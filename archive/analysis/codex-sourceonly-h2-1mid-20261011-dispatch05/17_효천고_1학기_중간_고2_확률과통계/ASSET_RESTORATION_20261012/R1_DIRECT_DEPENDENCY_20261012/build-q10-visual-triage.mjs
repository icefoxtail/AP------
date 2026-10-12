import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const resolve = value => path.resolve(root, value);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const shaFile = file => sha(fs.readFileSync(file));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const outPath = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.q10.visual-triage.json';
if (fs.existsSync(resolve(outPath))) throw new Error('OUTPUT_EXISTS');

const examUid = '17_효천고_1학기_중간_고2_확률과통계';
const expectedSourceSha256 = '97d37e06747b4dff432b999a34266a05ac6dd16cfeb92fa6c9e74586cfdf2803';
const jsFile = resolve('archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const bundleFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1.asset-restoration.student-only.packet.json');
const r1EvidenceFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.evidence.asset-restoration.golden-refresh.bound.json');
const validatorReportFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.generic.raw.golden-refresh.stdout.json');
const problemVisualReviewFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.asset-restoration.direct-dependency-review.json');
const freezeFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1.original-freeze.json');

if (shaFile(jsFile) !== expectedSourceSha256) throw new Error('CURRENT_SOURCE_SHA_MISMATCH');
if (shaFile(r1EvidenceFile) !== '020c0e7f8bb34e35913ee9732c13c0a32aee61f7563b4000774a0318fe587cda') throw new Error('CURRENT_R1_EVIDENCE_SHA_MISMATCH');
if (shaFile(validatorReportFile) !== '85ef8d94ee4949db5a1f19fefe53469ecdc76584102f877577b4f455860bc983') throw new Error('CURRENT_R1_VALIDATOR_REPORT_SHA_MISMATCH');
if (shaFile(problemVisualReviewFile) !== '1ba88f22ec475c313c031987af3fd14c0742e47a89b351277bf530375d87210a') throw new Error('Q10_PROBLEM_ASSET_REVIEW_SHA_MISMATCH');

const sourceBytes = fs.readFileSync(jsFile);
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(sourceBytes.toString('utf8'), sandbox, { filename: jsFile, timeout: 5000 });
const bank = sandbox.window.questionBank || sandbox.window.questions;
const q = Array.isArray(bank) ? bank.find(row => Number(row.id) === 10) : null;
if (!q) throw new Error('Q10_CURRENT_SOURCE_ROW_REQUIRED');
const solution = String(q.solution ?? '');
const solutionSha256 = sha(Buffer.from(solution, 'utf8'));
if (q.solutionImage) throw new Error('Q10_SOLUTION_IMAGE_NOW_PRESENT');
if (/<svg\b/i.test(solution)) throw new Error('Q10_INLINE_SVG_NOW_PRESENT');

const bundle = readJson(bundleFile);
const bundleRow = bundle.rows.find(row => Number(row.qid) === 10);
const evidence = readJson(r1EvidenceFile);
const evidenceRow = evidence.rows.find(row => Number(row.qid) === 10);
const freeze = readJson(freezeFile);
const freezeRow = freeze.rows.find(row => Number(row.qid) === 10);
const report = readJson(validatorReportFile);
if (bundle.sourceRawSha256 !== expectedSourceSha256 || !bundleRow || !evidenceRow || !freezeRow || !report.ok || report.denominator !== 23) throw new Error('Q10_SOURCE_BOUND_INPUTS_REQUIRED');
if (evidenceRow.solutionSha256 !== solutionSha256) throw new Error('Q10_CURRENT_SOLUTION_SHA_BINDING_MISMATCH');
if (bundleRow.assets?.length !== 1 || bundleRow.assets[0].ref !== 'assets/images/17_효천고_1학기_중간_고2_확률과통계/q10.png') throw new Error('Q10_PROBLEM_ASSET_REF_MISMATCH');
if (bundleRow.assets[0].sha256 !== '712d44da802680d20519db4a3051552fe39adb737d1d48f57526168e8ad358c3') throw new Error('Q10_PROBLEM_ASSET_SHA_MISMATCH');

const value = {
  schemaVersion: 'JS_ARCHIVE_R1_QID_VISUAL_TRIAGE_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  stage: 'R1',
  examUid,
  qid: 10,
  reviewerIdentity: evidence.reviewerIdentity,
  currentSource: { path: jsFile, rawSha256: expectedSourceSha256 },
  currentStudentInput: {
    bundlePath: bundleFile,
    bundleSha256: shaFile(bundleFile),
    qid: 10,
    studentPayloadSha256: bundleRow.studentPayloadSha256,
    problemImageRef: bundleRow.assets[0].ref,
    problemImageSha256: bundleRow.assets[0].sha256
  },
  existingProblemVisualReview: { path: problemVisualReviewFile, sha256: shaFile(problemVisualReviewFile), disposition: 'SOURCE_CROP_REVIEWED_KEEP_CURRENT_PRODUCTION_ASSET' },
  frozenR1: { path: freezeFile, sha256: shaFile(freezeFile), stage: freeze.stage, qidRowPresent: true, answerReadOrReSolved: false },
  currentSolution: { solutionSha256, solutionImage: null, inlineSvgPresent: false, existingR1RowSolutionSha256: evidenceRow.solutionSha256 },
  problemVisual: {
    disposition: 'REQUIRED',
    facts: 'The source PNG is an irregular road grid with A at the lower-left, B at the upper-right, and forbidden marked intersections P and Q. The uppermost row begins partway across the grid. This topology is part of the route-counting problem.'
  },
  solutionVisual: {
    disposition: 'BENEFICIAL',
    status: 'OPEN_CREATE_SOLUTION_VISUAL',
    rationale: 'The solution uses a left-plus-below path-count recurrence, assigns zero at P and Q, and lists four row sequences before continuing through the shorter top row to B=64. The prose contains the recurrence and values, so the diagram is not needed to determine the stated result; placing the values on the irregular grid would materially clarify which sequence belongs to each row and how the final count reaches B.',
    frozenSolutionFacts: {
      recurrence: 'Each intersection receives the sum of the path counts immediately to its left and below; set P=0 and Q=0.',
      listedRows: [
        'bottom: 1,1,1,1,1,1,1',
        'next: 1,2,3,4,5,6,7',
        'P row: 1,3,0,4,9,15,22',
        'Q row: 1,4,4,8,0,15,37'
      ],
      statedTerminalValue: 'B=64'
    }
  },
  createAction: {
    owner: 'CREATE',
    requiredWork: 'Create a solution SVG that reuses the current road-grid topology and places the frozen recurrence counts at their corresponding intersections; mark P and Q as zero and make the left/below recurrence and terminal B=64 legible.',
    constraints: ['preserve the current source PNG unchanged', 'do not reconstruct or alter road topology', 'bind the SVG to q10 solution and current asset references', 'verify count-to-intersection placement and SVG render before R1 re-review']
  },
  disposition: 'Q10_REMAINS_OPEN_FOR_CREATE_SOLUTION_VISUAL',
  completionSealAllowed: false,
  currentR1Validator: { path: validatorReportFile, sha256: shaFile(validatorReportFile), disposition: report.disposition, denominator: report.denominator, rowCount: report.rowCount },
  scope: { qidsReviewed: [10], unrelatedTargetQidsOpened: false, answerReSolved: false, examOrGoldenSourceModified: false }
};

const output = resolve(outPath);
fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ path: output, sha256: shaFile(output), disposition: value.disposition, visualDisposition: value.solutionVisual.disposition }, null, 2));
