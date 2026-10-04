import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const setRoot = 'archive-work/textbooks/visang-common2/major/sets-propositions';
const evidenceRoot = `${setRoot}/evidence/비상_공통수학2_집합과명제_대단원학습평가_고1`;
const jsPath = `${setRoot}/js/비상_공통수학2_집합과명제_대단원학습평가_고1.js`;
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
const errors = [];
if (!Array.isArray(questions) || questions.length !== 17) errors.push('QUESTION_COUNT');
if (inventory.coverage?.expected !== 17 || inventory.coverage?.observed !== 17 || inventory.items?.length !== 17) errors.push('SOURCE_INVENTORY_COVERAGE');
if (crosswalk.summary?.officialAnswerMatches !== 17 || crosswalk.summary?.unresolved !== 0 || crosswalk.items?.length !== 17) errors.push('OFFICIAL_ANSWER_CROSSWALK');
if (pageMap.problemPdf?.physicalPages?.join(',') !== '26,27,28' || pageMap.officialAnswerPdf?.physicalPages?.join(',') !== '10,11') errors.push('PAGE_CROSSWALK');
for (let i = 0; i < questions.length; i++) {
  const q = questions[i], ordinal = i + 1;
  const uid = `qid_v1_${crypto.createHash('sha256').update(`${jsPath}#${ordinal}`).digest('hex')}`;
  if (q.id !== uid) errors.push(`UID_BINDING:${ordinal}`);
  for (const field of ['content', 'answer', 'solution', 'questionType', 'standardUnitKey', 'subUnitKey']) if (!String(q[field] || '').trim()) errors.push(`FIELD_MISSING:${ordinal}:${field}`);
  if (!Array.isArray(q.choices) || !Array.isArray(q.tags)) errors.push(`ARRAY_FIELDS:${ordinal}`);
  for (const field of ['image', 'solutionImage']) {
    if (!q[field]) continue;
    if (!fs.existsSync(path.join(root, setRoot, q[field]))) errors.push(`ASSET_MISSING:${ordinal}:${field}`);
  }
}
if (browser.summary?.pass !== 6 || browser.summary?.fail !== 0 || browser.captures?.length !== 6 || browser.captures.some(c => c.status !== 'PASS')) errors.push('BROWSER_RENDER_MATRIX');
const dispositions = visual.items || [];
if (dispositions.length !== 17 || dispositions.filter(x => x.decision === 'VISUAL_REQUIRED').length !== 3 || dispositions.filter(x => x.decision === 'VISUAL_OPTIONAL').length !== 2 || dispositions.filter(x => x.decision === 'SOURCE_VISUAL_REQUIRED').length !== 2) errors.push('VISUAL_DISPOSITION_COVERAGE');

const report = {
  schemaVersion: 'VISANG_TEXTBOOK_STATIC_VALIDATION_v1',
  setTitle: '비상_공통수학2_집합과명제_대단원학습평가_고1',
  status: errors.length ? 'FAIL' : 'PASS',
  questionCount: questions.length,
  questionTypeCounts: questions.reduce((out, q) => { out[q.questionType] = (out[q.questionType] || 0) + 1; return out; }, {}),
  sourceCoverage: { expected: inventory.coverage.expected, observed: inventory.coverage.observed, missing: inventory.coverage.missingOrdinals, duplicates: inventory.coverage.duplicateOrdinals },
  officialAnswerAgreement: crosswalk.summary,
  problemImageCount: questions.filter(q => q.image).length,
  solutionImageCount: questions.filter(q => q.solutionImage).length,
  browserRenderPassCount: browser.summary.pass,
  jsSha256: sha(jsBytes),
  errors
};
fs.writeFileSync(path.join(root, evidenceRoot, 'static-validation-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
