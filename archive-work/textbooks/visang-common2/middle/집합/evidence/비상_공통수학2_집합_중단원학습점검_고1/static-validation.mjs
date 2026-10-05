import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const setRoot = 'archive-work/textbooks/visang-common2/middle/집합';
const evidenceRoot = `${setRoot}/evidence/비상_공통수학2_집합_중단원학습점검_고1`;
const jsPath = `${setRoot}/js/비상_공통수학2_집합_중단원학습점검_고1.js`;
const readJson = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const sha = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const jsBytes = fs.readFileSync(path.join(root, jsPath));
const context = { window: {} };
vm.runInNewContext(jsBytes.toString('utf8'), context, { filename: jsPath });
const questions = context.window.questionBank;
const inventory = readJson(`${evidenceRoot}/question-inventory.json`);
const crosswalk = readJson(`${evidenceRoot}/answer-solution-crosswalk.json`);
const pageMap = readJson(`${evidenceRoot}/section-page-mapping.json`);
const visual = readJson(`${evidenceRoot}/visual-benefit-ledger.json`);
const browser = readJson(`${evidenceRoot}/browser-render-report.json`);
const failures = [];
if (!Array.isArray(questions) || questions.length !== 11) failures.push('QUESTION_COUNT');
if (inventory.coverage?.expected !== 11 || inventory.coverage?.observed !== 11 || inventory.items?.length !== 11) failures.push('SOURCE_INVENTORY_COVERAGE');
if (crosswalk.summary?.officialAnswerMatches !== 11 || crosswalk.summary?.unresolved !== 0 || crosswalk.items?.length !== 11) failures.push('OFFICIAL_ANSWER_CROSSWALK');
if (pageMap.problemPdf?.physicalPages?.join(',') !== '19,20' || pageMap.officialAnswerPdf?.physicalPages?.join(',') !== '8') failures.push('PAGE_CROSSWALK');
const ordinals = new Set(inventory.items.map(x => x.ordinal));
for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const ordinal = i + 1;
  const expectedUid = `qid_v1_${crypto.createHash('sha256').update(`${jsPath}#${ordinal}`).digest('hex')}`;
  if (!ordinals.has(ordinal)) failures.push(`ORDINAL_MISSING:${ordinal}`);
  if (q.id !== expectedUid) failures.push(`UID_BINDING:${ordinal}`);
  for (const field of ['content', 'answer', 'solution', 'standardUnitKey', 'subUnitKey', 'questionType', 'layoutTag']) {
    if (typeof q[field] !== 'string' || !q[field].trim()) failures.push(`FIELD_MISSING:${ordinal}:${field}`);
  }
  if (!Array.isArray(q.choices) || !Array.isArray(q.tags)) failures.push(`ARRAY_FIELDS:${ordinal}`);
  if (q.image) {
    const sourceImagePath = path.join(root, setRoot, q.image);
    if (!fs.existsSync(sourceImagePath)) failures.push(`SOURCE_IMAGE_MISSING:${ordinal}`);
  }
  if (q.solutionImage) {
    const solutionPath = path.join(root, setRoot, q.solutionImage);
    if (!fs.existsSync(solutionPath)) failures.push(`SOLUTION_IMAGE_MISSING:${ordinal}`);
    else if (!fs.readFileSync(solutionPath, 'utf8').includes('<svg')) failures.push(`SOLUTION_IMAGE_INVALID:${ordinal}`);
  }
}
if (browser.summary?.pass !== 6 || browser.summary?.fail !== 0 || browser.captures?.length !== 6 || browser.captures.some(x => x.status !== 'PASS')) failures.push('BROWSER_RENDER_MATRIX');
const requiredVisuals = visual.items.filter(x => x.decision === 'VISUAL_REQUIRED');
if (requiredVisuals.length !== 2 || requiredVisuals.some(x => !x.asset)) failures.push('VISUAL_DISPOSITION_COVERAGE');

const report = {
  schemaVersion: 'VISANG_TEXTBOOK_STATIC_VALIDATION_v1',
  setTitle: '비상_공통수학2_집합_중단원학습점검_고1',
  status: failures.length ? 'FAIL' : 'PASS',
  questionCount: questions.length,
  sourceInventory: { expected: inventory.coverage.expected, observed: inventory.coverage.observed, missing: inventory.coverage.missingOrdinals, duplicates: inventory.coverage.duplicateOrdinals },
  officialAnswerAgreement: crosswalk.summary,
  questionTypeCounts: questions.reduce((out, q) => { out[q.questionType] = (out[q.questionType] || 0) + 1; return out; }, {}),
  solutionAssetCount: questions.filter(q => q.solutionImage).length,
  visualDispositionCounts: { required: requiredVisuals.length, exempt: visual.items.filter(x => x.decision === 'VISUAL_EXEMPT').length },
  browserRenderPassCount: browser.summary.pass,
  jsSha256: sha(jsBytes),
  errors: failures
};
fs.writeFileSync(path.join(root, evidenceRoot, 'static-validation-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
