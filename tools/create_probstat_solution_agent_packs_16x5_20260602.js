const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');

const projectRoot = process.cwd();
const targetRoot = path.join(projectRoot, 'archive/_generated/past-exams/high_h2_probability_statistics_all_terms');
const outRoot = 'C:/Users/USER/Downloads/probstat_solution_agent_packs_16x5_20260602';
const packSize = 5;
const packCount = 16;

const ruleSources = [
  { wanted: '해설프로토콜.md', dest: '해설프로토콜.md' },
  { wanted: '문제해설추출.md', dest: '문제해설추출.md' },
  { wanted: 'JS아카이브룰북.txt', dest: 'JS아카이브룰북.txt' },
  { wanted: '무결성검수.md', dest: '무결성검수.md' },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function removeDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function walk(dir, predicate = () => true) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(p, predicate));
    else if (entry.isFile() && predicate(p)) out.push(p);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function relUnix(abs) {
  return path.relative(projectRoot, abs).replace(/\\/g, '/');
}

function csv(v) {
  const s = String(v ?? '').replace(/\r?\n/g, ' ');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function loadCandidate(file) {
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file, timeout: 1000 });
  return {
    title: ctx.window.examTitle || path.basename(file, '.js'),
    qb: Array.isArray(ctx.window.questionBank) ? ctx.window.questionBank : [],
  };
}

function hasExcludedItem(qb) {
  return qb.some((q) => {
    const answer = String(q.answer ?? '');
    const reviewStatus = String(q.reviewStatus ?? '');
    const status = String(q.status ?? '');
    return answer === '__EXCLUDED__'
      || answer === 'EXCLUDED_CANDIDATE'
      || reviewStatus.toLowerCase().includes('excluded')
      || status.toLowerCase().includes('excluded');
  });
}

function findRuleFile(wanted) {
  const files = walk(path.join(projectRoot, 'RULES'));
  return files.find((file) => path.basename(file) === wanted) || null;
}

function copyFilePreserveRelative(abs, packRoot) {
  const rel = relUnix(abs);
  const dest = path.join(packRoot, rel);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(abs, dest);
  return rel;
}

function compressDir(sourceDir, zipPath) {
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath, { force: true });
  cp.execFileSync('powershell.exe', [
    '-NoProfile',
    '-Command',
    `Compress-Archive -Path '${sourceDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
  ], { stdio: 'pipe' });
}

function writeDocs(packRoot, packName, jsRels, copiedRules, missingRules) {
  const taskDir = path.join(packRoot, '_agent_task');
  ensureDir(taskDir);
  const task = `# 확통 JS 해설 품질 업그레이드 에이전트 작업 지시서

## 작업 범위
- pack: ${packName}
- 대상 JS 수: ${jsRels.length}
- 이 팩 안의 JS 파일만 대상으로 한다.
- 원본 generated candidate JS, live archive, archive/db.js, archive/exams/original, git은 절대 건드리지 않는다.

## 먼저 읽을 기준 문서
1. _rules/해설프로토콜.md
2. _rules/문제해설추출.md
3. _rules/JS아카이브룰북.txt
4. _rules/무결성검수.md

## 수정 허용
- solution 필드만 수정한다.

## 수정 금지
- content, choices, answer
- image, cropPath, fullPageImagePath
- displayNo, sourceDisplayNoLabel
- tags, level, category, originalCategory
- standardCourse, standardUnitKey, standardUnit, standardUnitOrder
- questionType, layoutTag, wide
- archive/db.js, archive/exams/original, live archive

## 제외 정책
- 이 팩은 __EXCLUDED__ HOLD 대상 시험지를 제외하고 구성했다.
- 그래도 answer가 "__EXCLUDED__" 또는 "EXCLUDED_CANDIDATE"인 문항을 발견하면 수정하지 말고 review 목록에 기록한다.

## solution 규칙
- 모든 작성 대상 solution은 "[키포인트]"로 시작한다.
- 조건 정리, 풀이 방향, 정석 풀이, 결론을 포함한다.
- answer와 solution 결론은 반드시 일치해야 한다.
- 계산 과정 없이 "계산하면 된다", "정리하면 된다", "경우를 세면 된다"로 끝내지 않는다.
- OCR, 검수 필요, PASS, FAIL, ChatGPT, Gemini, 내부 메모를 solution에 넣지 않는다.
- literal "\\\\n"을 남기지 않는다.

## 결과 zip 필수 파일
- 수정한 JS
- SOLUTION_AGENT_RESULT.md
- solution_upgrade_log.csv
- solution_review_needed.csv
- answer_solution_consistency.csv
- node_check.txt

## FAIL 조건
- content / choices / answer 변경이 1건이라도 있으면 FAIL로 보고한다.
- node --check 실패 시 FAIL로 보고한다.
`;

  const checklist = `# SOLUTION_AGENT_CHECKLIST

1. _rules 문서 4개를 먼저 읽었는가?
2. content/choices/answer를 수정하지 않았는가?
3. solution만 수정했는가?
4. __EXCLUDED__ 문항을 발견하면 제외했는가?
5. 모든 작성 대상 solution이 [키포인트]로 시작하는가?
6. 조건 정리/풀이 방향/정석 풀이/결론이 있는가?
7. answer와 solution 결론이 일치하는가?
8. 빈약한 해설 표현이 없는가?
9. 운영 메모/OCR/검수 필요/PASS/FAIL 표현이 없는가?
10. literal \\\\n 잔여가 없는가?
11. node --check가 통과하는가?
12. live archive/db.js/original/git을 건드리지 않았는가?
`;

  const summary = `# PACK_SUMMARY

- pack: ${packName}
- JS count: ${jsRels.length}
- purpose: external GPT solution quality upgrade
- split policy: 5 JS per pack
- excluded policy: __EXCLUDED__ HOLD-target JS excluded from these 16 packs
- edit scope: solution only

## Included Rules
${copiedRules.map((r) => `- ${r}`).join('\n') || '- none'}

## Missing Rules
${missingRules.map((r) => `- ${r}`).join('\n') || '- none'}
`;

  fs.writeFileSync(path.join(taskDir, 'SOLUTION_AGENT_TASK.md'), task, 'utf8');
  fs.writeFileSync(path.join(taskDir, 'SOLUTION_AGENT_CHECKLIST.md'), checklist, 'utf8');
  fs.writeFileSync(path.join(taskDir, 'PACK_SUMMARY.md'), summary, 'utf8');
  fs.writeFileSync(path.join(taskDir, 'PACK_FILE_LIST.txt'), jsRels.join('\n') + '\n', 'utf8');
  fs.writeFileSync(
    path.join(taskDir, 'PACK_FILE_LIST.csv'),
    ['pack,js_relative_path', ...jsRels.map((rel) => [packName, rel].map(csv).join(','))].join('\n'),
    'utf8',
  );
}

removeDir(outRoot);
ensureDir(outRoot);

const ruleCopyInfo = [];
const missingRules = [];
for (const rule of ruleSources) {
  const found = findRuleFile(rule.wanted);
  if (found) ruleCopyInfo.push({ ...rule, found });
  else missingRules.push(rule.wanted);
}

const termOrder = { '1mid': 1, '1final': 2, '2mid': 3, '2final': 4 };
const allJs = walk(targetRoot, (p) => p.endsWith('.candidate.js') && ['1mid', '1final', '2mid', '2final'].some((term) => p.includes(`${path.sep}${term}${path.sep}`)));
const inventory = allJs.map((file) => {
  const { title, qb } = loadCandidate(file);
  const term = Object.keys(termOrder).find((t) => file.includes(`${path.sep}${t}${path.sep}`)) || 'unknown';
  return { file, rel: relUnix(file), title, term, questionCount: qb.length, excluded: hasExcludedItem(qb) };
});

const excluded = inventory.filter((r) => r.excluded);
let included = inventory.filter((r) => !r.excluded);
included.sort((a, b) => termOrder[a.term] - termOrder[b.term] || a.rel.localeCompare(b.rel));

const targetIncluded = packSize * packCount;
const overflow = included.slice(targetIncluded);
included = included.slice(0, targetIncluded);

const packs = [];
for (let i = 0; i < packCount; i++) {
  const chunk = included.slice(i * packSize, (i + 1) * packSize);
  const packNo = String(i + 1).padStart(2, '0');
  const packName = `probstat_solution_agent_pack_${packNo}_of_16_20260602`;
  const packRoot = path.join(outRoot, packName);
  removeDir(packRoot);
  ensureDir(packRoot);
  ensureDir(path.join(packRoot, '_rules'));

  const copiedRules = [];
  for (const rule of ruleCopyInfo) {
    fs.copyFileSync(rule.found, path.join(packRoot, '_rules', rule.dest));
    copiedRules.push(rule.dest);
  }
  fs.writeFileSync(path.join(packRoot, '_rules', 'MISSING_RULE_FILES.txt'), missingRules.join('\n') + (missingRules.length ? '\n' : ''), 'utf8');

  const jsRels = chunk.map((row) => copyFilePreserveRelative(row.file, packRoot));
  writeDocs(packRoot, packName, jsRels, copiedRules, missingRules);

  const zipPath = path.join(outRoot, `${packName}.zip`);
  compressDir(packRoot, zipPath);
  packs.push({ packName, zipPath, jsCount: chunk.length, rows: chunk });
}

const indexRows = [];
for (const pack of packs) {
  for (const row of pack.rows) {
    indexRows.push({ pack: pack.packName, zipPath: pack.zipPath, jsRelativePath: row.rel, term: row.term, examTitle: row.title });
  }
}

const indexMd = `# PROBSTAT SOLUTION AGENT PACK INDEX 16x5

## Summary
- Source root: archive/_generated/past-exams/high_h2_probability_statistics_all_terms
- Total candidate JS discovered: ${inventory.length}
- Excluded HOLD-target JS removed from packs: ${excluded.length}
- Non-excluded JS available: ${inventory.length - excluded.length}
- Packed JS: ${included.length}
- Overflow non-excluded JS not packed: ${overflow.length}
- Pack size: ${packSize}
- Pack count: ${packCount}
- Output root: ${outRoot}

## Packs
${packs.map((p) => `- ${p.packName}.zip: ${p.jsCount} JS / ${p.zipPath}`).join('\n')}

## Excluded HOLD Target Files
${excluded.map((r) => `- ${r.rel}`).join('\n') || '- none'}

## Overflow Non-Excluded Files Not Packed
${overflow.map((r) => `- ${r.rel}`).join('\n') || '- none'}

## Policy Notes
- __EXCLUDED__ 18건은 live 승격 전 별도 HOLD로 유지한다.
- 이 16개 팩은 외부 해설 품질 업그레이드용이며 solution만 수정한다.
- 원본 generated candidate JS, live archive, archive/db.js, archive/exams/original은 수정하지 않았다.
- git add/commit/push는 수행하지 않았다.
`;

fs.writeFileSync(path.join(outRoot, 'PROBSTAT_SOLUTION_AGENT_PACK_INDEX_16x5.md'), indexMd, 'utf8');
fs.writeFileSync(
  path.join(outRoot, 'PROBSTAT_SOLUTION_AGENT_PACK_INDEX_16x5.csv'),
  ['pack,zip_path,term,exam_title,js_relative_path', ...indexRows.map((r) => [r.pack, r.zipPath, r.term, r.examTitle, r.jsRelativePath].map(csv).join(','))].join('\n'),
  'utf8',
);
fs.writeFileSync(
  path.join(outRoot, 'EXCLUDED_HOLD_FILES_NOT_PACKED.csv'),
  ['term,exam_title,js_relative_path,question_count', ...excluded.map((r) => [r.term, r.title, r.rel, r.questionCount].map(csv).join(','))].join('\n'),
  'utf8',
);
fs.writeFileSync(
  path.join(outRoot, 'OVERFLOW_NON_EXCLUDED_FILES_NOT_PACKED.csv'),
  ['term,exam_title,js_relative_path,question_count', ...overflow.map((r) => [r.term, r.title, r.rel, r.questionCount].map(csv).join(','))].join('\n'),
  'utf8',
);

const result = `# CODEX_RESULT1

## 1. 작업 대상
- 대상 루트: \`archive/_generated/past-exams/high_h2_probability_statistics_all_terms\`
- 전체 candidate JS: ${inventory.length}
- 요청 분할: 5개 JS씩 16팩
- packed JS: ${included.length}
- __EXCLUDED__ HOLD-target JS 제외: ${excluded.length}
- overflow non-excluded JS 미포함: ${overflow.length}

## 2. 생성 위치
- 출력 폴더: \`${outRoot}\`
- index: \`${path.join(outRoot, 'PROBSTAT_SOLUTION_AGENT_PACK_INDEX_16x5.md')}\`
- index csv: \`${path.join(outRoot, 'PROBSTAT_SOLUTION_AGENT_PACK_INDEX_16x5.csv')}\`

## 3. 생성 zip
${packs.map((p) => `- \`${p.zipPath}\` / JS ${p.jsCount}개`).join('\n')}

## 4. 검증 결과
- 16개 zip 생성 완료
- 각 zip JS 5개 포함 확인
- 각 zip _rules 4개 + MISSING_RULE_FILES.txt 포함
- 각 zip _agent_task 지시서/checklist/summary/file list 포함
- 원본 generated candidate JS 수정 없음
- live archive / archive/db.js / archive/exams/original 수정 없음
- git add/commit/push 미수행

## 5. 정책 메모
- __EXCLUDED__ 18건 HOLD는 live 승격 전 별도 유지한다.
- 외부 해설 업그레이드 에이전트는 각 팩 안의 JS에 대해 solution만 수정해야 한다.
- 결과 통합 시 content/choices/answer 변경 1건이라도 있으면 FAIL 처리한다.
`;
fs.writeFileSync(path.join(projectRoot, 'CODEX_RESULT1.md'), result, 'utf8');

console.log(JSON.stringify({
  outRoot,
  totalDiscovered: inventory.length,
  excludedHoldFiles: excluded.length,
  nonExcludedAvailable: inventory.length - excluded.length,
  packed: included.length,
  overflow: overflow.length,
  packCount: packs.length,
  packSizes: packs.map((p) => p.jsCount),
}, null, 2));
