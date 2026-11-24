// 서버 PDF도 고쳐진 내용으로 (2026-11-24 원장 결정: "시험지 문항을 고치면 고쳐진 내용이 어디서나 보인다").
// 학생 화면(apmath/student/current-question-content.js, #2827)과 같은 덮어쓰기 규칙을 그대로 쓴다: 출제 사본의 문항이 가리키는
// 원본 시험지 파일(sourceArchiveFile/_sourceFile)의 같은 문항으로 발문·보기·정답·해설·그림 칸만 덮고, 구성·순서·번호·배점은 사본 그대로다.
// 못 받거나 확신이 없으면 그 문항은 사본 그대로 두고 예외를 던지지 않는다.
//
// Worker는 문자열 코드를 실행할 수 없어(eval 불가) 시험지 JS를 해석하지 못한다. 그래서 여기서는
//  1) 필요한 시험지 파일의 "글"만 받아 지문(sha256)을 만들고(캐시 키에 들어간다),
//  2) 실제로 PDF를 새로 그릴 때만, 이미 띄운 브라우저 안에서 해석해(parseExamSourcesInPage) 덮어쓰기 규칙을 돌린다.
import currentContent from '../../../../apmath/student/current-question-content.js';

const MAX_FILES = 80;
const FETCH_TIMEOUT_MS = 6000;
const FETCH_BUDGET_MS = 12000;
const FETCH_CONCURRENCY = 6;

async function sha256hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value ?? '')));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

/** apmath/student/self-study-view.js safeExamPath와 같은 규칙: "exams/<이름>.js" 평범한 상대 경로만, 아니면 ''. */
export function safeExamPath(raw) {
  const value = String(raw || '').trim();
  if (!value || value.length > 512 || /\\|%5c/i.test(value)) return '';
  let decoded;
  try { decoded = decodeURIComponent(value); } catch (error) { return ''; }
  if (/\\/.test(decoded)) return '';
  decoded = decoded.trim().replace(/^\.\/+/, '').replace(/^archive\/exams\//, 'exams/').replace(/^(?!exams\/)/, 'exams/');
  if (!decoded || decoded.length > 512 || /[?#]/.test(decoded)) return '';
  if (/^(https?:)?\/\//i.test(decoded) || /^(javascript|data|blob):/i.test(decoded)) return '';
  if (decoded.includes('../') || decoded.includes('/./') || decoded.includes('//') || /%2e|%2f|%5c/i.test(decoded)) return '';
  return /^exams\/[a-zA-Z0-9가-힣_\-./]+\.js$/.test(decoded) ? decoded : '';
}

/** 이 출제가 읽어야 할 시험지 파일(exams/… 경로) 목록. 사본이 있으면 문항이 가리키는 파일들, 없으면 출제 파일 하나. */
export function sourceFilesOf(assignment, mixedPayload) {
  const files = new Set();
  if (mixedPayload && Array.isArray(mixedPayload.questions)) {
    for (const question of mixedPayload.questions) {
      const where = currentContent.locate(question);
      const safe = where ? safeExamPath(where.file) : '';
      if (safe) files.add(safe);
    }
  } else {
    const archive = String(assignment?.archive_file || '').trim();
    if (archive && !archive.startsWith('MIXED:')) {
      const safe = safeExamPath(archive);
      if (safe) files.add(safe);
    }
  }
  return [...files].sort();
}

function fileUrl(baseUrl, safePath) {
  const base = String(baseUrl || '').replace(/\/+$/, '');
  return `${base}/${safePath.split('/').map(encodeURIComponent).join('/')}`;
}

/**
 * 시험지 파일 글을 받는다. 돌려주는 값: { texts: Map(경로 -> 글), failed: [경로] }. 예외를 던지지 않는다.
 * 시간 예산을 넘기면 받지 못한 파일은 failed에 넣는다.
 */
export async function fetchExamSources(files, { fetchImpl, baseUrl, budgetMs = FETCH_BUDGET_MS, timeoutMs = FETCH_TIMEOUT_MS, concurrency = FETCH_CONCURRENCY } = {}) {
  const texts = new Map();
  const failed = [];
  const fetcher = fetchImpl || (typeof fetch === 'function' ? fetch : null);
  const wanted = files.slice(0, MAX_FILES);
  for (const extra of files.slice(MAX_FILES)) failed.push(extra);
  if (!fetcher || !baseUrl) { failed.push(...wanted); return { texts, failed }; }
  const deadline = Date.now() + budgetMs;
  let next = 0;
  const worker = async () => {
    while (next < wanted.length) {
      const file = wanted[next++];
      if (Date.now() >= deadline) { failed.push(file); continue; }
      const controller = typeof AbortController === 'function' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
      try {
        const response = await fetcher(fileUrl(baseUrl, file), controller ? { signal: controller.signal, cf: { cacheTtl: 0 } } : undefined);
        if (!response || !response.ok) throw new Error('EXAM_FETCH_FAILED');
        texts.set(file, await response.text());
      } catch (error) {
        failed.push(file);
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, wanted.length)) }, worker));
  failed.sort();
  return { texts, failed };
}

/**
 * 캐시 키에 넣을 "지금 내용의 지문". 받은 파일 글의 sha256을 파일 경로와 함께 묶어 다시 sha256 한다.
 * 파일을 못 받은 자리는 'unavailable'로 표시해 같은 값이 나오지 않게 하되, complete=false로 알려 호출자가 새로 그리지 않도록 할 수 있다.
 * 파일이 하나도 필요 없는 출제(생성 문항만 등)는 fingerprint ''.
 */
export async function collectCurrentContent(assignment, mixedPayload, options = {}) {
  const files = sourceFilesOf(assignment, mixedPayload);
  if (!files.length) return { files, texts: new Map(), failed: [], complete: true, fingerprint: '' };
  const { texts, failed } = await fetchExamSources(files, options);
  const parts = [];
  for (const file of files) {
    parts.push(texts.has(file) ? `${file}\0${await sha256hex(texts.get(file))}` : `${file}\0unavailable`);
  }
  return { files, texts, failed, complete: failed.length === 0, fingerprint: await sha256hex(parts.join('\n')) };
}

/**
 * 브라우저 안에서 실행된다(page.evaluate). 시험지 JS 글을 학생 화면과 같은 방식(self-study-view.js parseExamSource)으로 해석해
 * 경로 -> 문항 목록(JSON으로 복제 가능한 값)으로 돌려준다. 해석 못 한 파일은 null.
 * Worker 번들러가 함수 안에 보조 코드를 끼워 넣어도 브라우저에서 깨지지 않도록 함수가 아니라 글(식)로 둔다.
 * Worker 자신은 이 글을 실행하지 않는다(eval 불가): 브라우저 쪽에서만 실행된다.
 */
export const PARSE_EXAM_SOURCES_EXPRESSION = `(function (sources) {
  var out = {};
  Object.keys(sources).forEach(function (path) {
    try {
      var sandbox = {};
      new Function('window', 'self', sources[path] + '\\n')(sandbox, sandbox);
      var bank = sandbox.questionBank || sandbox.examData;
      var list = Array.isArray(bank) ? bank
        : Array.isArray(bank && bank.questions) ? bank.questions
          : Array.isArray(bank && bank.problems) ? bank.problems : [];
      out[path] = list.length ? JSON.parse(JSON.stringify(list)) : null;
    } catch (error) {
      out[path] = null;
    }
  });
  return out;
})`;

/**
 * 출제 사본 문항에 지금 원본 내용을 덮는다. parse(sources) -> Promise<{경로: 문항 목록|null}> 는 호출자가 준다(브라우저 안 해석).
 * 돌려주는 값: { questions(같은 길이·같은 순서), replaced }. 어떤 실패도 사본 그대로({questions: 입력, replaced: 0})다.
 */
export async function overlayCurrentQuestions(questions, texts, parse) {
  const untouched = { questions, replaced: 0 };
  try {
    if (!Array.isArray(questions) || !questions.length || !texts || !texts.size || typeof parse !== 'function') return untouched;
    const parsed = (await parse(Object.fromEntries(texts))) || {};
    const result = await currentContent.overlay(questions, {
      budgetMs: 10000,
      fetchQuestionList: async (path) => {
        const bank = parsed[safeExamPath(path)];
        if (!Array.isArray(bank)) throw new Error('EXAM_SOURCE_UNAVAILABLE');
        return bank;
      },
    });
    if (!result || !Array.isArray(result.questions) || result.questions.length !== questions.length) return untouched;
    return { questions: result.questions, replaced: Number(result.replaced) || 0 };
  } catch (error) {
    return untouched;
  }
}
