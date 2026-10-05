import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const archiveRoot = path.join(root, 'archive');
const examRoot = path.join(archiveRoot, 'exams', 'original');
const generatedRoot = path.join(archiveRoot, '_generated', 'past-exams');
const reportDir = path.join(root, 'reports');
const allowedLevels = new Set(['하', '중', '상']);
const editorialWords = ['원본', '원문', '원해설', '정답표', '오류', '수정', '정정', '보정', '근거', '제공 해설', '제시 해설', '공급 해설', '제시 답안', '독립 풀이'];
const visualCue = /(?:(?:오른쪽|왼쪽|아래|위)의?\s*(?:그림|도표|표)|(?:다음|아래)의?\s*(?:그림|도표|표)(?:와|과)?\s*같|그림과\s*같|(?:다음|오른쪽)\s*표준정규분포표)/;
const circled = ['①', '②', '③', '④', '⑤'];

function posix(value) {
  return value.split(path.sep).join('/');
}

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function evaluate(file, globals = {}) {
  const sandbox = { window: {}, console, ...globals };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  return sandbox.window;
}

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\\(?:dfrac|frac|left|right|text|mathrm|operatorname)/g, '')
    .replace(/[\s$\\{}()[\],.:;!?·「」『』“”'"`~_^=+\-*/<>≤≥]/g, '')
    .toLowerCase();
}

function imageDimensions(file) {
  const b = fs.readFileSync(file);
  if (b.length >= 24 && b.toString('ascii', 1, 4) === 'PNG') {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), format: 'png' };
  }
  if (b.length >= 10 && (b.toString('ascii', 0, 3) === 'GIF')) {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8), format: 'gif' };
  }
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < b.length) {
      if (b[offset] !== 0xff) { offset += 1; continue; }
      const marker = b[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: b.readUInt16BE(offset + 7), height: b.readUInt16BE(offset + 5), format: 'jpg' };
      }
      const size = b.readUInt16BE(offset + 2);
      if (!size) break;
      offset += size + 2;
    }
  }
  return null;
}

function findGeneratedExam(title) {
  if (!fs.existsSync(generatedRoot)) return [];
  return fs.readdirSync(generatedRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(generatedRoot, entry.name, title))
    .filter(dir => fs.existsSync(dir));
}

function findCandidate(generatedDirs, filename) {
  return generatedDirs
    .map(dir => path.join(dir, 'candidate', filename))
    .filter(file => fs.existsSync(file));
}

const examFiles = walk(examRoot, file => file.endsWith('.js') && path.basename(path.dirname(file)) === '2mid').sort();
const db = evaluate(path.join(archiveRoot, 'db.js')).mainDB;
const index = evaluate(path.join(archiveRoot, 'question-index.js')).questionIndex;
const dbByFile = new Map((db?.exams || []).map(row => [String(row.file || '').replaceAll('\\', '/'), row]));
const indexCounts = new Map();
for (const row of index || []) indexCounts.set(row.sourceFile, (indexCounts.get(row.sourceFile) || 0) + 1);

const issues = [];
const exams = [];
const contentMap = new Map();
const stats = {
  exams: examFiles.length,
  questions: 0,
  objective: 0,
  subjective: 0,
  images: 0,
  sourcePages: 0,
  candidates: 0,
  candidateMismatch: 0,
  duplicates: 0,
  editorialHits: 0,
};

function issue(pass, severity, file, qid, code, detail) {
  issues.push({ pass, severity, file, qid: qid ?? null, code, detail });
}

for (const file of examFiles) {
  const rel = posix(path.relative(path.join(archiveRoot, 'exams'), file));
  const filename = path.basename(file);
  let data;
  try {
    data = evaluate(file);
  } catch (error) {
    issue(1, 'FAIL', rel, null, 'JS_PARSE', error.message);
    continue;
  }
  const title = data.examTitle;
  const qs = data.questionBank;
  if (!title || !Array.isArray(qs)) {
    issue(1, 'FAIL', rel, null, 'BANK_SHAPE', 'examTitle 또는 questionBank 배열이 없음');
    continue;
  }
  stats.questions += qs.length;
  const ids = new Set();
  const generatedDirs = findGeneratedExam(title);
  const candidates = findCandidate(generatedDirs, filename);
  const pages = generatedDirs.flatMap(dir => walk(path.join(dir, 'pages'), p => /\.(?:png|jpe?g)$/i.test(p)));
  stats.candidates += candidates.length;
  stats.sourcePages += pages.length;
  if (!generatedDirs.length) issue(2, 'WARN', rel, null, 'NO_GENERATED_DIR', '생성 원본 디렉터리를 찾지 못함');
  if (!pages.length) issue(2, 'WARN', rel, null, 'NO_SOURCE_PAGES', '생성 원본 페이지 이미지가 없음');
  for (const candidate of candidates) {
    if (sha(candidate) !== sha(file)) {
      stats.candidateMismatch += 1;
      issue(2, 'FAIL', rel, null, 'CANDIDATE_MISMATCH', posix(path.relative(root, candidate)));
    }
  }

  const dbRow = dbByFile.get(rel);
  if (!dbRow) issue(2, 'FAIL', rel, null, 'DB_MISSING', 'db.js 레코드 없음');
  else {
    const required = ['file', 'school', 'grade', 'year', 'semester', 'examType', 'subject', 'contentType', 'qCount'];
    for (const key of required) {
      if (dbRow[key] === undefined || dbRow[key] === null || String(dbRow[key]).trim() === '') {
        issue(2, 'FAIL', rel, null, 'DB_EMPTY', `${key} 비어 있음`);
      }
    }
    if (Number(dbRow.qCount) !== qs.length) issue(2, 'FAIL', rel, null, 'DB_QCOUNT', `DB ${dbRow.qCount}, JS ${qs.length}`);
    if (String(dbRow.semester) !== '2' || dbRow.examType !== 'mid') issue(2, 'FAIL', rel, null, 'DB_TERM', `semester=${dbRow.semester}, examType=${dbRow.examType}`);
  }
  const indexed = indexCounts.get(rel) || 0;
  if (indexed !== qs.length) issue(2, 'FAIL', rel, null, 'INDEX_QCOUNT', `index ${indexed}, JS ${qs.length}`);

  for (const [offset, q] of qs.entries()) {
    const qid = q?.id ?? offset + 1;
    if (!Number.isInteger(qid)) issue(1, 'FAIL', rel, qid, 'BAD_ID', '정수 ID가 아님');
    if (ids.has(qid)) issue(1, 'FAIL', rel, qid, 'DUPLICATE_ID', '시험 내 ID 중복');
    ids.add(qid);
    for (const key of ['content', 'answer', 'solution', 'level', 'category', 'questionType']) {
      if (typeof q?.[key] !== 'string' || !q[key].trim()) issue(1, 'FAIL', rel, qid, 'EMPTY_FIELD', key);
    }
    if (!Array.isArray(q?.choices)) issue(1, 'FAIL', rel, qid, 'BAD_CHOICES', 'choices 배열이 아님');
    if (!Array.isArray(q?.tags) || !q.tags.length || q.tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
      issue(1, 'FAIL', rel, qid, 'BAD_TAGS', '빈 태그 또는 비정상 tags');
    }
    if (!allowedLevels.has(q?.level)) issue(1, 'FAIL', rel, qid, 'BAD_LEVEL', String(q?.level));

    const objective = Array.isArray(q?.choices) && q.choices.length > 0;
    if (objective) {
      stats.objective += 1;
      if (q.choices.length !== 5) issue(1, 'WARN', rel, qid, 'CHOICE_COUNT', `${q.choices.length}개`);
      const answerText = String(q.answer).trim();
      const answerMarks = answerText.match(/[①②③④⑤]/g) || [];
      const noListedChoice = /^(?:해당 없음|정답 없음)/.test(answerText);
      if (!noListedChoice && (!answerMarks.length || answerMarks.some(mark => circled.indexOf(mark) >= q.choices.length))) {
        issue(3, 'FAIL', rel, qid, 'OBJECTIVE_ANSWER', answerText);
      }
      const conclusionText = String(q.solution).match(/(?:정답은|옳은 것은|옳지 않은 것은)\s*([①②③④⑤](?:\s*[,·와과]\s*[①②③④⑤])*)/g)?.at(-1) || '';
      const conclusionMarks = conclusionText.match(/[①②③④⑤]/g) || [];
      if (conclusionMarks.length && conclusionMarks.join('') !== answerMarks.join('')) {
        issue(3, 'FAIL', rel, qid, 'SOLUTION_ANSWER_MISMATCH', `${conclusionMarks.join(', ')} != ${answerMarks.join(', ')}`);
      }
    } else {
      stats.subjective += 1;
    }

    const solution = String(q?.solution || '');
    const foundEditorial = editorialWords.filter(word => solution.includes(word));
    if (foundEditorial.length) {
      stats.editorialHits += 1;
      issue(3, 'FAIL', rel, qid, 'EDITORIAL_WORD', foundEditorial.join(', '));
    }
    if (/(full_page_reference|cropped_for_manual_cleanup|도형필요|그래프필요|표필요|TODO|FIXME|내부 메모|검수 완료|\bPASS\b|\bFAIL\b|\bWARN\b)/.test(JSON.stringify(q))) {
      issue(3, 'FAIL', rel, qid, 'WORK_MARKER', '작업/검수 마커 잔존');
    }

    const normalized = normalizeText(`${q.content} ${(q.choices || []).join(' ')}`);
    if (normalized.length >= 12) {
      const list = contentMap.get(normalized) || [];
      list.push({ file: rel, qid });
      contentMap.set(normalized, list);
    }

    if (q.image) {
      stats.images += 1;
      const imageFile = path.join(archiveRoot, String(q.image).replaceAll('/', path.sep));
      if (!fs.existsSync(imageFile)) issue(2, 'FAIL', rel, qid, 'IMAGE_MISSING', q.image);
      else {
        const dim = imageDimensions(imageFile);
        if (!dim) issue(2, 'WARN', rel, qid, 'IMAGE_DIMENSION_UNKNOWN', q.image);
        else {
          if (dim.width < 80 || dim.height < 50) issue(2, 'FAIL', rel, qid, 'IMAGE_TOO_SMALL', `${dim.width}x${dim.height}`);
          if (dim.width < 100 || dim.height < 40) issue(2, 'WARN', rel, qid, 'IMAGE_CROP_RISK', `${dim.width}x${dim.height}`);
        }
        if (fs.statSync(imageFile).size < 1000) issue(2, 'WARN', rel, qid, 'IMAGE_FILE_SMALL', `${fs.statSync(imageFile).size} bytes`);
      }
    } else if (visualCue.test(String(q.content || '')) && !/<(?:svg|table|img)\b/i.test(String(q.content || '')) && !/\[표\][\s\S]{30,}/.test(String(q.content || '')) && !/\$X:.*P\(X=x\):/s.test(String(q.content || ''))) {
      issue(2, 'WARN', rel, qid, 'VISUAL_CUE_NO_IMAGE', '발문에 시각자료 지시어가 있으나 image 없음');
    }
  }
  exams.push({ file: rel, title, questions: qs.length, images: qs.filter(q => q.image).length, sourcePages: pages.length, candidates: candidates.length });
}

for (const entries of contentMap.values()) {
  if (entries.length < 2) continue;
  stats.duplicates += entries.length;
  for (const entry of entries) issue(3, 'WARN', entry.file, entry.qid, 'EXACT_DUPLICATE', entries.map(x => `${x.file}#${x.qid}`).join(' | '));
}

const severityOrder = { FAIL: 0, WARN: 1 };
issues.sort((a, b) => (a.pass - b.pass) || (severityOrder[a.severity] - severityOrder[b.severity]) || a.file.localeCompare(b.file, 'ko') || ((a.qid || 0) - (b.qid || 0)));
const failCount = issues.filter(x => x.severity === 'FAIL').length;
const warnCount = issues.filter(x => x.severity === 'WARN').length;
const passSummary = [1, 2, 3].map(pass => ({
  pass,
  fail: issues.filter(x => x.pass === pass && x.severity === 'FAIL').length,
  warn: issues.filter(x => x.pass === pass && x.severity === 'WARN').length,
}));

const payload = { generatedAt: new Date().toISOString(), ok: failCount === 0, stats, passSummary, exams, issues };
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, '2mid-mechanical-audit.json'), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [
  '# 2학기 중간고사 1·2·3차 기계 검수',
  '',
  `- 생성 시각: ${payload.generatedAt}`,
  `- 시험: ${stats.exams}개`,
  `- 문항: ${stats.questions}개 (객관식 ${stats.objective}, 주관식 ${stats.subjective})`,
  `- 연결 이미지: ${stats.images}개`,
  `- 원본 페이지: ${stats.sourcePages}장`,
  `- 후보 파일: ${stats.candidates}개 / 불일치 ${stats.candidateMismatch}개`,
  `- FAIL: ${failCount} / WARN: ${warnCount}`,
  '',
  '## 차수별 결과',
  '',
  '| 차수 | FAIL | WARN |',
  '|---:|---:|---:|',
  ...passSummary.map(row => `| ${row.pass}차 | ${row.fail} | ${row.warn} |`),
  '',
  '## 시험별 수량',
  '',
  '| 시험 | 문항 | 이미지 | 원본 페이지 | 후보 |',
  '|---|---:|---:|---:|---:|',
  ...exams.map(row => `| ${row.title} | ${row.questions} | ${row.images} | ${row.sourcePages} | ${row.candidates} |`),
  '',
  '## 발견 항목',
  '',
  ...(issues.length ? issues.map(row => `- [${row.severity}] ${row.pass}차 ${row.file}${row.qid == null ? '' : ` q${row.qid}`} ${row.code}: ${row.detail}`) : ['- 없음']),
  '',
];
fs.writeFileSync(path.join(reportDir, '2mid-mechanical-audit.md'), `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ ok: payload.ok, stats, passSummary, failCount, warnCount }, null, 2));
if (!payload.ok) process.exitCode = 1;
