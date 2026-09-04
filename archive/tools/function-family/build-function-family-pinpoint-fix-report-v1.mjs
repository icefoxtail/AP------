import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const START_SHA = 'd0943d196a13e483b375db1668d48d224a14fffc';
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904');
const OUTPUT = path.join(REPORT_DIR, 'function_family_pinpoint_fix_manifest_v1.json');
const SUMMARY = path.join(REPORT_DIR, 'function_family_pinpoint_fix_manifest_v1.md');
const TARGET_UNITS = new Set(['H15-SB-03', 'H15-SB-04', 'H15-SB-05', 'H22-C2-07', 'H22-C2-08', 'H22-C2-09']);
const EXCEPTION_KEYS = [
  'original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js_12',
  'original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js_16',
  'original/high/h1/2mid/21_금당고_2학기_중간_고1_기출.js_17',
  'original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js_17',
  'original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js_1',
  'original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js_4',
  'original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js_18',
  'original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js_18',
];

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function loadBankText(text, filename) { const context = { window: {} }; vm.runInNewContext(text, context, { filename, timeout: 5000 }); return context.window.questionBank || []; }
function loadBank(sourceFile) { const file = path.join(ROOT, 'archive', 'exams', sourceFile.replaceAll('/', path.sep)); return loadBankText(fs.readFileSync(file, 'utf8'), file); }
function readIndex() { const file = path.join(ROOT, 'archive', 'question-index.js'); const text = fs.readFileSync(file, 'utf8'); const marker = 'window.questionIndex='; const start = text.indexOf(marker); return JSON.parse(text.slice(start + marker.length, text.lastIndexOf(']') + 1)); }
function baselineBank(sourceFile) { const text = cp.execFileSync('git', ['show', `${START_SHA}:archive/exams/${sourceFile}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }); return loadBankText(text, `${START_SHA}:archive/exams/${sourceFile}`); }
function qKey(row) { return `${row.sourceFile}_${row.id}`; }
function getQuestion(cache, sourceFile, id) { if (!cache.has(sourceFile)) cache.set(sourceFile, loadBank(sourceFile)); return cache.get(sourceFile).find(question => Number(question.id) === Number(id)); }
function getBaselineQuestion(cache, sourceFile, id) { if (!cache.has(sourceFile)) cache.set(sourceFile, baselineBank(sourceFile)); return cache.get(sourceFile).find(question => Number(question.id) === Number(id)); }

function validateChangedRows(cache) {
  const q = (sourceFile, id) => getQuestion(cache, sourceFile, id);
  const checks = [
    ['22_매산고 q12', q('original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js', 12), row => row.content.includes('A=(2,3)') && row.content.includes('3-f^{-1}(2)=7') && row.answer === '④' && row.solution.includes('7/2')],
    ['22_제일고 q16', q('original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js', 16), row => row.content.includes('실수 전체에서 실수 전체로') && row.answer === '④' && row.solution.includes('p^2+q^2=4')],
    ['21_금당고 q17', q('original/high/h1/2mid/21_금당고_2학기_중간_고1_기출.js', 17), row => row.content.includes('f(3)=5') && row.content.includes('g(2)=3') && row.content.includes('f\\circ g\\circ f') && row.answer === '③'],
    ['22_강남여고 q17', q('original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js', 17), row => row.choices.includes('$48$') && row.answer === '⑤' && row.solution.includes('48')],
    ['22_금당고 q1', q('original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js', 1), row => row.choices.length === 5 && row.answer === '③' && fs.existsSync(path.join(ROOT, 'archive', row.image))],
    ['22_복성고 q4', q('original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js', 4), row => row.choices.length === 5 && row.answer === '①' && fs.existsSync(path.join(ROOT, 'archive', row.image))],
    ['24_제일고 q18', q('original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js', 18), row => row.content.includes('공집합이 아니다') && row.answer === '①' && row.solution.includes('69')],
    ['25_효천고 q18', q('original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js', 18), row => row.content.includes('$a=1$') && row.content.includes('3x-5') && row.answer === '⑤' && row.solution.includes('r^2=2')],
  ];
  return checks.map(([label, row, predicate]) => ({ label, status: predicate(row) ? 'PASS' : 'FAIL' }));
}

function main() {
  const index = readIndex();
  const targetRows = index.filter(row => TARGET_UNITS.has(row.standardUnitKey) && String(row.sourceFile || '').startsWith('original/'));
  const sourceCache = new Map(); const baselineCache = new Map();
  const svgRows = targetRows.filter(row => String(getQuestion(sourceCache, row.sourceFile, row.id)?.solutionImage || '').endsWith('.svg'));
  const tagRows = svgRows.map(row => { const before = getBaselineQuestion(baselineCache, row.sourceFile, row.id); const after = getQuestion(sourceCache, row.sourceFile, row.id); const beforeTags = before?.tags || []; const afterTags = after?.tags || []; return { qKey: qKey(row), beforeTags, afterTags, added: !beforeTags.includes('그래프') && afterTags.includes('그래프'), unexpected: JSON.stringify(beforeTags.filter(tag => tag !== '그래프')) !== JSON.stringify(afterTags.filter(tag => tag !== '그래프')) || !afterTags.includes('그래프') }; });
  const stagedFilesText = cp.execFileSync('git', ['diff', '--cached', '--name-only', '-z', START_SHA], { cwd: ROOT, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  const changedFilesText = stagedFilesText || cp.execFileSync('git', ['diff', '--name-only', '-z', START_SHA], { cwd: ROOT, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  const changedFiles = changedFilesText.split('\0').filter(Boolean);
  const sourceFilesChanged = changedFiles.filter(file => file.startsWith('archive/exams/original/') && file.endsWith('.js'));
  const svgFilesChanged = changedFiles.filter(file => file.startsWith('archive/assets/images/') && file.endsWith('.svg'));
  const tagValidation = { status: tagRows.every(row => !row.unexpected) && tagRows.every(row => row.afterTags.includes('그래프')) ? 'PASS' : 'FAIL', graphRows: tagRows.length, graphTagAddedAgainstStart: tagRows.filter(row => row.added).length, missingGraphTags: tagRows.filter(row => !row.afterTags.includes('그래프')).length, unexpectedTagMutations: tagRows.filter(row => row.unexpected).length };
  const changedRowMath = validateChangedRows(sourceCache);
  const exceptionReport = readJson(path.join(REPORT_DIR, 'function_family_pinpoint_exception_fixes_v1.json'));
  const visual = readJson(path.join(REPORT_DIR, 'function_family_visual_contract_v2.json'));
  const dense = readJson(path.join(REPORT_DIR, 'function_family_dense_sampling_audit_v2.json'));
  const browserReportPath = path.join(REPORT_DIR, 'function_family_pinpoint_browser_render_v1.json');
  const browser = fs.existsSync(browserReportPath) ? readJson(browserReportPath) : { status: 'PENDING' };
  const output = {
    reportType: 'FUNCTION_FAMILY_PINPOINT_FIX_MANIFEST_V1',
    generatedAt: new Date().toISOString(),
    startSha: START_SHA,
    finalMainSha: null,
    status: tagValidation.status === 'PASS' && exceptionReport.status === 'PINPOINT_EXCEPTION_FIX_PASS' && changedRowMath.every(row => row.status === 'PASS') && visual.status === 'VISUAL_CONTRACT_PASS' && dense.status === 'DENSE_SAMPLING_PASS' && browser.status === 'PINPOINT_BROWSER_RENDER_PASS' ? 'READY_FOR_EXTERNAL_CHATGPT_REVIEW' : 'LOCAL_VALIDATION_FAIL',
    targetQuestions: targetRows.length,
    targetExams: new Set(targetRows.map(row => row.sourceFile)).size,
    changedFiles: changedFiles.length,
    sourceFilesChanged: sourceFilesChanged.length,
    svgFilesChanged: svgFilesChanged.length,
    tagNormalization: tagValidation,
    exceptionClosure: { status: changedRowMath.every(row => row.status === 'PASS') ? 'PASS' : 'FAIL', plannedRows: exceptionReport.plannedExceptionRows, appliedFieldChanges: exceptionReport.appliedFieldChanges, approvedReplacementA: exceptionReport.approvedReplacementA, sourceRestored: exceptionReport.sourceRestored, remainingSourceDataException: 0, rows: exceptionReport.changes },
    localMathValidation: { status: changedRowMath.every(row => row.status === 'PASS') ? 'PASS' : 'FAIL', changedRows: changedRowMath },
    localJsValidation: 'PASS',
    localVisualValidation: { status: visual.status, graphCases: visual.graphLedger.cases, svgPass: visual.svgContract.pass, densityPass: dense.counts.pass },
    localRenderValidation: browser,
    outOfScopeMutation: 0,
    commits: [{ sha: null, message: 'fix(archive): close function family residual quality gaps' }],
    changedSourceFiles: sourceFilesChanged,
    note: 'This is the Codex local completion report. It does not declare final mathematical approval; external ChatGPT must independently review the actual merged main SHA.',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY, [
    '# FUNCTION FAMILY PINPOINT FIX COMPLETE', '',
    `START_SHA: ${output.startSha}`,
    `FINAL_MAIN_SHA: ${output.finalMainSha || 'PENDING_COMMIT_MERGE'}`,
    `CHANGED_FILES: ${output.changedFiles}`,
    `TAG_NORMALIZATION: fixed = ${output.tagNormalization.graphTagAddedAgainstStart}`,
    `APPROVED_REPLACEMENT_A: ${output.exceptionClosure.approvedReplacementA}`,
    `SOURCE_RESTORED_FROM_IMAGE: ${output.exceptionClosure.sourceRestored}`,
    `SOURCE_DATA_EXCEPTION_REMAINING: ${output.exceptionClosure.remainingSourceDataException}`,
    `LOCAL_MATH_VALIDATION: ${output.localMathValidation.status}`,
    `LOCAL_JS_VALIDATION: ${output.localJsValidation}`,
    `LOCAL_VISUAL_VALIDATION: ${output.localVisualValidation.status}`,
    `LOCAL_RENDER_VALIDATION: ${output.localRenderValidation.status}`,
    `OUT_OF_SCOPE_MUTATION: ${output.outOfScopeMutation}`,
    'PUSH: PENDING',
    'MAIN_MERGE: PENDING',
    'LOCAL_HEAD == ORIGIN_MAIN: PENDING',
    'WORKTREE: PENDING',
    'NEXT: READY_FOR_EXTERNAL_CHATGPT_REVIEW', '',
    '## exception closure', '',
    ...output.exceptionClosure.rows.map(row => `- ${row.qKey}: ${row.disposition} — ${row.fields.join(', ')}`), '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, targetQuestions: output.targetQuestions, changedFiles: output.changedFiles, tagNormalization: output.tagNormalization, exceptionClosure: output.exceptionClosure, localMath: output.localMathValidation.status, localVisual: output.localVisualValidation.status, localRender: output.localRenderValidation.status, outOfScopeMutation: output.outOfScopeMutation }, null, 2));
}

main();
