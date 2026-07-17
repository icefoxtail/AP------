#!/usr/bin/env node
/**
 * exam-lint — 기출 JS 파일 구조·표기 자동 검수
 *
 * 2025년 기출 49개 파일 전수 검수(2026-07-17)에서 실제로 결함을 잡아낸 검사만 넣었다.
 * 룰북(archive/archive/docs/PAST_EXAM_PDF_TO_JS_PIPELINE_RULEBOOK.md) §14의 1차 게이트에 해당한다.
 * 정오답(2차)은 사람이 직접 재풀이해야 하므로 여기서 다루지 않는다.
 *
 * 사용법:
 *   node archive/tools/exam-lint.mjs                  # 전체
 *   node archive/tools/exam-lint.mjs 25_              # 파일명에 '25_' 포함된 것만
 *   node archive/tools/exam-lint.mjs --json           # JSON 출력 (CI용)
 *
 * 종료 코드: FAIL 있으면 1, 아니면 0
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '..');
const examsDir = path.join(archiveDir, 'exams', 'original');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const filter = args.find(a => !a.startsWith('--')) || '';

const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}

/** $...$ 밖에 LaTeX 명령이 노출됐는지 (렌더 시 원문 그대로 보임) */
const LATEX_CMD = /\\(sqrt|frac|dfrac|dot|times|div|pi|le\b|ge\b|lt\b|gt\b|neq|cdot|overline|angle|therefore)/;
/** $ 개수가 홀수면 수식이 안 닫힘 */
function mathUnbalanced(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === '$' && s[i - 1] !== '\\') n++;
  return n % 2 !== 0;
}

const files = walk(examsDir).filter(f => path.basename(f).includes(filter));
const report = [];

for (const file of files) {
  const rel = path.relative(archiveDir, file).replace(/\\/g, '/');
  const src = fs.readFileSync(file, 'utf8');
  const entry = { file: rel, fail: [], warn: [], count: 0 };
  report.push(entry);

  const sandbox = { window: {} };
  try {
    vm.runInNewContext(src, sandbox, { timeout: 5000 });
  } catch (e) {
    entry.fail.push(`파싱 실패: ${e.message}`);
    continue;
  }

  if (!sandbox.window.examTitle) entry.warn.push('examTitle 없음');
  const bank = sandbox.window.questionBank;
  if (!Array.isArray(bank) || bank.length === 0) {
    entry.fail.push('questionBank 없음/비어있음');
    continue;
  }
  entry.count = bank.length;

  // --- 파일 단위: answer 표기가 원문자/숫자로 갈리는지 ---
  const objective = bank.filter(q => Array.isArray(q.choices) && q.choices.length > 0);
  const numStyle = objective.filter(q => /^[1-8]$/.test(String(q.answer || '').trim())).length;
  if (numStyle > 0 && numStyle === objective.length) {
    // 파일 전체가 숫자 표기 -> 선택지 값과 혼동됨 (예: 선택지 ①5 ②6 … 인데 answer "5")
    entry.fail.push(`객관식 answer가 전부 숫자 표기(${numStyle}문항) — 선택지 값과 혼동됨. 원문자로 통일 필요`);
  } else if (numStyle > 0) {
    entry.warn.push(`객관식 answer 표기 혼재: 숫자 ${numStyle} / 원문자 ${objective.length - numStyle}`);
  }

  const ids = new Set();
  const courses = new Set();

  for (const q of bank) {
    const tag = `q${q.id}`;
    if (q.id == null) entry.fail.push('id 없는 문항');
    else if (ids.has(q.id)) entry.fail.push(`${tag}: id 중복`);
    ids.add(q.id);
    if (q.standardCourse) courses.add(q.standardCourse);

    if (!q.content || !q.content.trim()) entry.fail.push(`${tag}: content 비어있음`);
    if (!q.answer || !String(q.answer).trim()) entry.fail.push(`${tag}: answer 비어있음`);
    if (!q.solution || !q.solution.trim()) entry.fail.push(`${tag}: solution 비어있음`);

    // 서답형은 choices가 [] 이거나 [" "," ",…]처럼 전부 공백이다.
    // engine 의 isSubjective 가 '전부 공백'을 주관식으로 판정해 답란을 그리므로 이 형태는 정상이다.
    const allBlank = Array.isArray(q.choices) && q.choices.length > 0
      && q.choices.every(c => !String(c ?? '').trim());
    const hasCh = Array.isArray(q.choices) && q.choices.length > 0 && !allBlank;
    const ans = String(q.answer || '');
    const circledInAns = [...ans].filter(c => CIRCLED.includes(c));

    if (allBlank) {
      entry.warn.push(`${tag}: 서답형인데 choices가 공백 배열 — [] 로 정리 권장(렌더는 정상)`);
      if (circledInAns.length > 0) {
        entry.fail.push(`${tag}: 서답형(choices 공백)인데 answer가 원문자 ${ans} — 값으로 기재 필요`);
      }
    } else if (hasCh) {
      q.choices.forEach((c, i) => {
        if (!c || !String(c).trim()) entry.fail.push(`${tag}: choice ${i + 1}만 비어있음 — 선택지 유실`);
      });
      for (const c of circledInAns) {
        if (CIRCLED.indexOf(c) >= q.choices.length) entry.fail.push(`${tag}: answer ${c}가 choices 범위 밖`);
      }
    } else if (circledInAns.length > 0 && !q.image) {
      // 선택지가 이미지 안에 있는 그래프 문항은 정상이므로 image 있으면 제외
      entry.fail.push(`${tag}: choices도 image도 없는데 answer가 원문자 ${ans} — 서술형이면 값으로 기재`);
    }

    if (q.image && String(q.image).trim()) {
      if (q.image.includes('_generated')) {
        entry.fail.push(`${tag}: image가 파이프라인 임시경로(_generated) — assets/images/{examId}/ 로 이관 필요`);
      } else if (!fs.existsSync(path.join(archiveDir, q.image))) {
        entry.fail.push(`${tag}: image 파일 없음 (${q.image})`);
      }
    }

    // --- 해설 결론과 answer 불일치 (2025 검수에서 정오답 오류 5건 중 3건을 이 패턴으로 발견) ---
    if (hasCh && q.solution && circledInAns.length === 1) {
      const m = [...q.solution.matchAll(/정답[^①-⑧\n]{0,12}([①-⑧])/g)].map(x => x[1]);
      const concl = m.length ? m[m.length - 1] : null;
      if (concl && concl !== circledInAns[0]) {
        entry.fail.push(`${tag}: 해설 결론(${concl})과 answer(${circledInAns[0]}) 불일치`);
      }
    }
    // --- 해설이 추측·조작을 자인하는 표현 (룰북 §10 추측 금지) ---
    // '정답 보정'류는 24년 검수에서 나온 패턴: 해설이 정답을 제대로 계산해 놓고
    // "원본 정답 43 보정 반영"처럼 결론만 다른 값으로 바꿔치기한다. 계산값 쪽이 맞는 경우가 많다.
    // 단순 "[보정 완료]"(선택지 텍스트를 고쳤다는 편집 메모)는 무해하므로 제외한다.
    const sol = q.solution || '';
    // 원문(정답·보기)을 데이터 쪽에서 조작했다고 자인한 경우만 잡는다.
    // '몫을 보정', '보기의 값을 대입', '검산' 같은 정상 계산 서술은 제외해야 오탐이 안 난다.
    if (/원본 정답|정답 도출을 위해|보기[^.\n]{0,15}(교체 보정|으로 보정|값을 .{0,6}으로 (교체|보정))|오탈자 복원|(교체|바꿔) ?보정|보정하여 (수학적 )?무결성|조건 교정 반영/.test(sol)) {
      entry.fail.push(`${tag}: 해설이 '정답·보기 조작'을 자인 — 원본 선택지/정답이 달랐을 가능성 큼`);
    } else if (/근사치|가장 가까운 수치를 정답|추정\)|추정한|보이나|가능성/.test(sol)) {
      entry.warn.push(`${tag}: 해설에 추측성 표현 — 원본 대조 필요`);
    }

    // --- 표기 오염 / 렌더 블로커 ---
    const texts = [['content', q.content], ['solution', q.solution],
      ...(hasCh ? q.choices.map((c, i) => [`choice${i + 1}`, c]) : [])];
    for (const [name, t] of texts) {
      if (typeof t !== 'string') continue;
      if (/\[도형필요\]|\[그래프필요\]|\[판독불가\]/.test(t)) entry.fail.push(`${tag}.${name}: 플레이스홀더 잔존`);
      if (/undefined|�|\[object Object\]/.test(t)) entry.fail.push(`${tag}.${name}: 문자열 오염`);
      if (mathUnbalanced(t)) entry.fail.push(`${tag}.${name}: $ 짝 안 맞음`);
      if (t.includes('<svg')) continue;
      const stripped = t.replace(/\$[^$]*\$/g, '');
      if (LATEX_CMD.test(stripped)) entry.warn.push(`${tag}.${name}: $ 밖에 LaTeX 명령 노출`);
    }
    // \neq 등이 \n + 문자로 깨진 경우 (값에 백슬래시+n 이 남음)
    for (const [name, t] of texts) {
      if (typeof t === 'string' && /\\n\s+(eq|otin|e\s)/.test(t)) {
        entry.fail.push(`${tag}.${name}: \\neq류 표기 깨짐`);
      }
    }

    for (const f of ['standardCourse', 'standardUnitKey', 'standardUnit']) {
      if (!q[f] || !String(q[f]).trim()) entry.warn.push(`${tag}: ${f} 비어있음`);
    }
    if (!Array.isArray(q.tags) || q.tags.length === 0) entry.warn.push(`${tag}: tags 비어있음`);
    if (!q.questionType || !String(q.questionType).trim()) entry.warn.push(`${tag}: questionType 비어있음`);
    if (!q.level || !String(q.level).trim()) entry.warn.push(`${tag}: level 비어있음`);
    if (q.wide === true && q.layoutTag === 'grid') entry.warn.push(`${tag}: wide=true인데 layoutTag=grid`);
  }

  // 학년 폴더와 standardCourse 정합
  const g = rel.split('/')[2];
  const expect = { m2: '중2 수학', m3: '중3 수학' }[g];
  if (expect) for (const c of courses) if (c !== expect) entry.warn.push(`standardCourse "${c}" — ${g} 폴더 기대값 "${expect}"과 다름`);

  const sorted = [...ids].filter(x => typeof x === 'number').sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) entry.warn.push(`id 불연속: ${sorted[i - 1]} → ${sorted[i]}`);
  }
}

const failFiles = report.filter(r => r.fail.length);
const warnFiles = report.filter(r => !r.fail.length && r.warn.length);
const totalQ = report.reduce((s, r) => s + r.count, 0);

if (asJson) {
  console.log(JSON.stringify({ files: report.length, totalQ, failFiles: failFiles.length, warnFiles: warnFiles.length, report }, null, 1));
} else {
  console.log(`대상 ${report.length}개 파일 / ${totalQ}문항`);
  console.log(`FAIL ${failFiles.length}개 파일 / WARN ${warnFiles.length}개 파일\n`);
  for (const r of report) {
    if (!r.fail.length && !r.warn.length) continue;
    console.log(`## ${r.file} (${r.count}문항) ${r.fail.length ? 'FAIL' : 'WARN'}`);
    r.fail.forEach(s => console.log(`  [FAIL] ${s}`));
    r.warn.forEach(s => console.log(`  [warn] ${s}`));
    console.log();
  }
}

process.exit(failFiles.length ? 1 : 0);
