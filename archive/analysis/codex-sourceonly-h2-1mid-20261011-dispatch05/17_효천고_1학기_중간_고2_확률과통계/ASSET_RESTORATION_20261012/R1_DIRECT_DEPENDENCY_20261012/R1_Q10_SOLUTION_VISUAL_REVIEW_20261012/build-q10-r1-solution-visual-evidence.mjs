import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const resolve = value => path.resolve(root, value);
const shaBytes = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const shaFile = file => shaBytes(fs.readFileSync(file));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeFresh = (file, value) => {
  const absolute = resolve(file);
  if (fs.existsSync(absolute)) throw new Error(`OUTPUT_EXISTS:${file}`);
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return { path: absolute, sha256: shaFile(absolute) };
};

const examUid = '17_효천고_1학기_중간_고2_확률과통계';
const sourceRel = 'archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js';
const expectedSourceRawSha256 = 'eb1c15e5b1cf316bb6d521735b7a8ef879e62460bfbdc89852db52e1c1325690';
const expectedSourceGitBlobSha1 = 'e575f4ef2be692679c474194ecec13cdc9b95ee3';
const oldSolutionSha256 = 'c7683f485f3da4311c8aed8001bcfdc7e2a2284467b2b66f027761ffc062c81d';
const expectedSolutionSha256 = '8b32d688c3a1e790fee1bc21a9c4ae18d29b194544a0cd80979520480aaf6ce7';
const pngRef = 'assets/images/17_효천고_1학기_중간_고2_확률과통계/q10.png';
const pngSha256 = '712d44da802680d20519db4a3051552fe39adb737d1d48f57526168e8ad358c3';
const svgRef = 'assets/images/17_효천고_1학기_중간_고2_확률과통계/q10-solution.svg';
const svgSha256 = '0bf7d4fdb5e063e7f3040b5f576bb6e2261344b0a3614e856fa81ed35e9ed4e1';
const svgGitBlobSha1 = '276bbad018a2b2aec2b96a1df534c19e4e1b69ed';
const dir = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1_Q10_SOLUTION_VISUAL_REVIEW_20261012';
const baseEvidenceFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.evidence.asset-restoration.golden-refresh.bound.json');
const previousParityFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.asset-restoration.direct-dependency-review.json');
const previousQ10TriageFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.q10.visual-triage.json');
const currentBundleFile = resolve(`${dir}/R1.current-student-only.after-q10-solution.json`);
const previousBundleFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1.asset-restoration.student-only.packet.json');
const freezeFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1.original-freeze.json');
const createEventFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/CREATE_Q10_SOLUTION_VISUAL_20261012/CREATE.q10.visual-repair.event.rev4.json');
const machineCaptureFile = resolve('.tmp/archive/hyocheon-q10-solution-visual-20261012/capture-final-current/machine-capture.json');
const svgStandaloneCaptureFile = resolve('.tmp/archive/hyocheon-q10-solution-visual-20261012/q10-solution-svg-chromium.png');
const currentR1GenericPassFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.generic.raw.golden-refresh.stdout.json');
const screenshotDir = resolve('.tmp/archive/hyocheon-q10-solution-visual-20261012/capture-final-current');
const currentJsPath = resolve(sourceRel);
const currentPngPath = resolve(`archive/${pngRef}`);
const currentSvgPath = resolve(`archive/${svgRef}`);
const captureInputFile = resolve('.tmp/archive/hyocheon-q10-solution-visual-20261012/q10-render-input-final-current.js');

if (shaFile(currentJsPath) !== expectedSourceRawSha256) throw new Error('CURRENT_SOURCE_SHA_MISMATCH');
if (shaFile(currentSvgPath) !== svgSha256) throw new Error('CURRENT_Q10_SVG_SHA_MISMATCH');
if (shaFile(currentPngPath) !== pngSha256) throw new Error('CURRENT_Q10_PNG_SHA_MISMATCH');
if (shaFile(baseEvidenceFile) !== '020c0e7f8bb34e35913ee9732c13c0a32aee61f7563b4000774a0318fe587cda') throw new Error('BASE_R1_EVIDENCE_SHA_MISMATCH');
if (shaFile(previousParityFile) !== '1ba88f22ec475c313c031987af3fd14c0742e47a89b351277bf530375d87210a') throw new Error('Q10_TO_Q12_RESTORATION_REVIEW_SHA_MISMATCH');
if (shaFile(previousQ10TriageFile) !== 'ba22d58962ffa5bd6b704ab6ea0896e15db040c495d077aaa741ead4193458e8') throw new Error('Q10_PRIOR_TRIAGE_SHA_MISMATCH');
if (shaFile(freezeFile) !== 'b27e25f675b8492b7030cd48575fb864d1e49f399744eb6cb6f1b5db39d100b2') throw new Error('ORIGINAL_FREEZE_MUST_REMAIN_UNCHANGED');
if (shaFile(createEventFile) !== 'e8bb9f2175e559b285e0f26548d9a98caf30b4c468d9efb6d8493260a6c97dcb') throw new Error('CREATE_Q10_REPAIR_EVENT_SHA_MISMATCH');

const productionBytes = fs.readFileSync(currentJsPath);
const productionBox = { window: {} };
vm.createContext(productionBox);
vm.runInContext(productionBytes.toString('utf8'), productionBox, { filename: currentJsPath, timeout: 5000 });
const productionBank = productionBox.window.questionBank || productionBox.window.questions;
const productionQ10 = Array.isArray(productionBank) ? productionBank.find(row => Number(row.id) === 10) : null;
if (!productionQ10) throw new Error('CURRENT_Q10_REQUIRED');
const solutionText = String(productionQ10.solution ?? '');
const solutionSha256 = shaBytes(Buffer.from(solutionText, 'utf8'));
if (solutionSha256 !== expectedSolutionSha256 || productionQ10.solutionImage !== svgRef || productionQ10.solutionReminderImagePolicy !== 'STRIP_INLINE' || productionQ10.solutionImageLayout !== 'fullwidth') throw new Error('CURRENT_Q10_SOLUTION_BINDING_MISMATCH');

const captureInputBytes = fs.readFileSync(captureInputFile);
const captureInputBox = { window: {} };
vm.createContext(captureInputBox);
vm.runInContext(captureInputBytes.toString('utf8'), captureInputBox, { filename: captureInputFile, timeout: 5000 });
const captureInputBank = captureInputBox.window.questionBank || captureInputBox.window.questions;
const captureInputQ10 = Array.isArray(captureInputBank) ? captureInputBank.find(row => Number(row.id) === 10) : null;
if (!captureInputQ10) throw new Error('CREATE_CAPTURE_INPUT_Q10_REQUIRED');
const captureStudentProjection = question => JSON.stringify({
  content: question.content ?? question.question ?? '', choices: question.choices ?? [], image: question.image ?? '',
  layoutTag: question.layoutTag ?? '', wide: question.wide ?? false
});
if (shaBytes(Buffer.from(String(captureInputQ10.solution ?? ''), 'utf8')) !== solutionSha256
  || captureInputQ10.solutionImage !== productionQ10.solutionImage
  || captureInputQ10.solutionReminderImagePolicy !== productionQ10.solutionReminderImagePolicy
  || captureInputQ10.solutionImageLayout !== productionQ10.solutionImageLayout
  || captureStudentProjection(captureInputQ10) !== captureStudentProjection(productionQ10)) throw new Error('CREATE_CAPTURE_INPUT_CURRENT_Q10_PARITY_REQUIRED');

const previousBundle = readJson(previousBundleFile);
const currentBundle = readJson(currentBundleFile);
const baseEvidence = readJson(baseEvidenceFile);
const freeze = readJson(freezeFile);
const createEvent = readJson(createEventFile);
const machine = readJson(machineCaptureFile);
const genericPass = readJson(currentR1GenericPassFile);
if (currentBundle.sourceRawSha256 !== expectedSourceRawSha256 || currentBundle.questionCount !== 23 || currentBundle.qids.length !== 23) throw new Error('CURRENT_STUDENT_BUNDLE_BINDING_REQUIRED');
if (freeze.stage !== 'R1' || freeze.rows.length !== 23 || !freeze.rows.some(row => Number(row.qid) === 10)) throw new Error('ORIGINAL_FULL_R1_FREEZE_REQUIRED');
if (!genericPass.ok || genericPass.disposition !== 'PASS' || genericPass.denominator !== 23) throw new Error('PREVIOUS_GOLDEN_REPAIR_R1_PASS_REQUIRED');
if (createEvent.solutionLayoutRepair?.mathTextContentPreserved !== true || createEvent.solutionLayoutRepair?.solutionAnswerAndChoicesUnchanged !== true || createEvent.solutionLayoutRepair?.problemPngAndTopologyUnchanged !== true) throw new Error('CREATE_MATH_OR_SOURCE_PRESERVATION_PROOF_REQUIRED');
if (machine.schemaVersion !== 'JS_ARCHIVE_CODEX_MACHINE_CAPTURE_V1' || machine.status !== 'CAPTURED_REVIEW_REQUIRED' || machine.renderPass !== false || JSON.stringify(machine.qids) !== JSON.stringify([10])) throw new Error('Q10_CAPTURE_REVIEW_REQUIRED');

const oldRows = previousBundle.rows;
const currentRows = currentBundle.rows;
if (JSON.stringify(previousBundle.qids) !== JSON.stringify(currentBundle.qids) || currentBundle.questionCount !== 23) throw new Error('FULL_QID_DENOMINATOR_CHANGED');
const projectionDiffs = [];
for (let index = 0; index < currentRows.length; index += 1) {
  const oldRow = oldRows[index], currentRow = currentRows[index];
  const assetProjection = row => (row.assets ?? []).map(asset => [asset.ref, asset.sha256]).sort((a, b) => a[0].localeCompare(b[0]));
  if (Number(oldRow.qid) !== Number(currentRow.qid)
    || oldRow.studentPayloadSha256 !== currentRow.studentPayloadSha256
    || JSON.stringify(assetProjection(oldRow)) !== JSON.stringify(assetProjection(currentRow))) projectionDiffs.push(Number(currentRow.qid));
}
if (projectionDiffs.length) throw new Error(`SOLUTION_ONLY_STUDENT_PARITY_FAILED:${projectionDiffs.join(',')}`);
const currentQ10BundleRow = currentRows.find(row => Number(row.qid) === 10);
if (!currentQ10BundleRow || currentQ10BundleRow.assets?.length !== 1 || currentQ10BundleRow.assets[0].ref !== pngRef || currentQ10BundleRow.assets[0].sha256 !== pngSha256) throw new Error('CURRENT_Q10_PROBLEM_IMAGE_BUNDLE_BINDING_REQUIRED');

const q10SvgText = fs.readFileSync(currentSvgPath, 'utf8');
if (!q10SvgText.includes('viewBox="0 0 860 470"') || !q10SvgText.includes('data:image/png;base64,')) throw new Error('Q10_SVG_EMBEDDED_PROBLEM_IMAGE_REQUIRED');
const imageMatch = q10SvgText.match(/<image\b[^>]*(?:href|xlink:href)="data:image\/png;base64,([^\"]+)"/);
if (!imageMatch) throw new Error('Q10_SVG_EMBEDDED_PNG_REQUIRED');
const embeddedPng = Buffer.from(imageMatch[1], 'base64');
if (shaBytes(embeddedPng) !== pngSha256) throw new Error('Q10_SVG_EMBEDDED_PNG_PARITY_FAILED');

const expectedCaptureIds = ['exam/desktop', 'exam/mobile', 'sol/desktop', 'sol/mobile', 'ans/desktop', 'ans/mobile'];
if (!Array.isArray(machine.cases) || JSON.stringify(machine.cases.map(row => row.id)) !== JSON.stringify(expectedCaptureIds)) throw new Error('Q10_SIX_CASE_CAPTURE_SET_REQUIRED');
const captureCases = [];
const viewedCaseIds = new Set(['exam/desktop', 'exam/mobile', 'sol/desktop', 'sol/mobile']);
for (const captureCase of machine.cases) {
  if (captureCase.status !== 'CAPTURED_REVIEW_REQUIRED' || captureCase.captures?.length !== 1 || JSON.stringify(captureCase.captures[0].qids) !== JSON.stringify([10])) throw new Error(`Q10_CAPTURE_CASE_BINDING_INVALID:${captureCase.id}`);
  const capture = captureCase.captures[0].image;
  const imagePath = resolve(capture.path);
  if (!fs.existsSync(imagePath) || shaFile(imagePath) !== capture.sha256) throw new Error(`Q10_CAPTURE_IMAGE_SHA_MISMATCH:${captureCase.id}`);
  const loaded = captureCase.loadedAssets ?? [];
  if (captureCase.id.startsWith('exam/') && !loaded.some(asset => asset.ref === pngRef && asset.sha256 === pngSha256)) throw new Error(`Q10_PROBLEM_PNG_CAPTURE_BINDING_REQUIRED:${captureCase.id}`);
  if (captureCase.id.startsWith('sol/') && !loaded.some(asset => asset.ref === svgRef && asset.sha256 === svgSha256)) throw new Error(`Q10_SOLUTION_SVG_CAPTURE_BINDING_REQUIRED:${captureCase.id}`);
  captureCases.push({ id: captureCase.id, status: captureCase.status, screenshot: { path: imagePath, sha256: capture.sha256 }, loadedAssets: loaded, visuallyOpenedByR1: viewedCaseIds.has(captureCase.id) });
}

const baseQ10 = baseEvidence.rows.find(row => Number(row.qid) === 10);
if (!baseQ10 || baseQ10.solutionSha256 !== oldSolutionSha256 || baseQ10.axisEvidence.VISUAL_SVG.status !== 'EVIDENCE_DEBT') throw new Error('Q10_PRIOR_R1_VISUAL_DEBT_BINDING_REQUIRED');
const reviewerIdentity = baseEvidence.reviewerIdentity;
const freezePhysical = { path: freezeFile, sha256: shaFile(freezeFile), sourceRawSha256: freeze.sourceRawSha256, rowCount: freeze.rows.length, preservedWithoutModification: true };

const parity = {
  schemaVersion: 'JS_ARCHIVE_R1_SAME_SOURCE_STUDENT_PROJECTION_PARITY_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX', stage: 'R1', examUid,
  priorCurrentBundle: { path: previousBundleFile, sha256: shaFile(previousBundleFile), sourceRawSha256: previousBundle.sourceRawSha256 },
  currentStudentBundle: { path: currentBundleFile, sha256: shaFile(currentBundleFile), sourceRawSha256: currentBundle.sourceRawSha256, questionCount: currentBundle.questionCount, qids: currentBundle.qids, answersIncluded: false },
  exactStudentPayloadAndAssetParityAcrossAll23Qids: true,
  changedQidsBySolutionOnlySourceUpdate: [],
  originalFreeze: freezePhysical,
  preexistingApprovedStudentDifferences: {
    changedQids: [10, 11, 12, 15],
    directDependencyReview: { path: previousParityFile, sha256: shaFile(previousParityFile) },
    q15R1RowReusedFromCurrentFullEvidence: true,
    q15ContentReopenedByThisWorker: false
  },
  solutionOnlyChange: { qid: 10, oldSolutionSha256: oldSolutionSha256, currentSolutionSha256: solutionSha256, studentProjectionChanged: false, originalAnswerFreezeChanged: false }
};
const parityRef = writeFresh(`${dir}/R1.student-projection-parity.after-q10-solution.json`, parity);

const visualReview = {
  schemaVersion: 'JS_ARCHIVE_R1_Q10_SOLUTION_VISUAL_REVIEW_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX', stage: 'R1', examUid, qid: 10, reviewerIdentity,
  currentSource: { path: currentJsPath, rawSha256: expectedSourceRawSha256, rawBufferGitBlobSha1: expectedSourceGitBlobSha1 },
  currentStudentProjection: { bundlePath: currentBundleFile, bundleSha256: shaFile(currentBundleFile), qid: 10, studentPayloadSha256: currentQ10BundleRow.studentPayloadSha256 },
  originalFreeze: freezePhysical,
  problemVisual: {
    disposition: 'REQUIRED',
    ref: pngRef,
    sha256: pngSha256,
    observation: 'The restored source crop shows the irregular road grid with A at the lower-left, B at the upper-right, and forbidden intersections P and Q. The rendered exam/desktop and exam/mobile captures use the same PNG bytes; the grid remains visible without clipping.'
  },
  frozenSolutionComparison: {
    priorSolutionSha256: oldSolutionSha256,
    currentSolutionSha256: solutionSha256,
    solutionImage: svgRef,
    solutionImageSha256: svgSha256,
    solutionImageGitBlobSha1: svgGitBlobSha1,
    solutionReminderImagePolicy: 'STRIP_INLINE',
    solutionImageLayout: 'fullwidth',
    mathTextContentPreservedByCreateReceipt: true,
    independentlyComparedFacts: ['left-and-below path-count recurrence', 'P and Q assigned zero', 'the same four row-value sequences', 'same final B count', 'answer and choices not re-solved'],
    lineBreakDisposition: 'Only prose/list boundaries changed; complete math groups remain intact.'
  },
  svgSemanticParity: {
    disposition: 'PASS_STATIC_TRIAGE',
    wellFormedSvg: true,
    viewBox: '0 0 860 470',
    embeddedProblemPngSha256: pngSha256,
    embeddedProblemPngMatchesCurrentSource: true,
    overlayCountFromCreateEvidence: 33,
    observed: 'The overlay places the frozen row counts at the matching road-grid intersections, marks the P/Q zero-count vertices, shows the left-plus-below recurrence, and highlights the terminal B count. The shortened upper row and original source grid remain aligned.'
  },
  solutionLayout: {
    disposition: 'PASS_STATIC',
    smallBoardContinuityStatus: 'PASS',
    desktopObservation: 'The fullwidth solution visual appears once, followed by the prose row sequence; the diagram and body text remain inside the solution card without overlap or overflow.',
    mobileObservation: 'The same diagram scales within the mobile solution card; row labels, P/Q markers, and terminal count remain visible, with no clipping or horizontal overflow.',
    actualStudentRender: 'NOT_RUN_R1_R3_OWNS_RENDER'
  },
  createCaptureEvidence: {
    event: { path: createEventFile, sha256: shaFile(createEventFile) },
    machineCapture: { path: machineCaptureFile, sha256: shaFile(machineCaptureFile), status: machine.status, reviewStatus: machine.reviewStatus, renderPass: machine.renderPass, qids: machine.qids, loadedJs: machine.loadedJs },
    captureInputParity: { path: captureInputFile, sha256: shaFile(captureInputFile), currentQ10SolutionSha256: solutionSha256, currentQ10StudentProjectionAndSolutionPropertiesMatch: true },
    standaloneSvgCapture: { path: svgStandaloneCaptureFile, sha256: shaFile(svgStandaloneCaptureFile), viewport: createEvent.renderEvidence.standaloneChromiumSvg.viewport, status: createEvent.renderEvidence.standaloneChromiumSvg.status },
    sixCases: captureCases,
    actualImageFilesViewed: [...viewedCaseIds],
    captureStatus: 'CAPTURED_REVIEW_REQUIRED',
    wholeExamR3RenderClaimed: false
  },
  priorR1Evidence: { path: baseEvidenceFile, sha256: shaFile(baseEvidenceFile) },
  decision: { questionLayout: 'REUSE_PRIOR_Q10_REVIEW; student payload and problem PNG unchanged', solutionLayout: 'PASS_STATIC_AFTER_REPAIR', visualSvg: 'STATIC_TRIAGE_REVIEWED', q10VisualDebtResolved: true, answerFreezeReusedWithoutModification: true }
};
const visualReviewRef = writeFresh(`${dir}/R1.q10.solution-visual-review.json`, visualReview);

const reviewedAssets = [
  { ref: pngRef, sha256: pngSha256, reviewed: true },
  { ref: 'assets/images/17_효천고_1학기_중간_고2_확률과통계/q11.png', sha256: '8af30a006b8c2ec4fb56156a454d729aac7b4b61b6ffec79fd66cf7c2028f93f', reviewed: true },
  { ref: 'assets/images/17_효천고_1학기_중간_고2_확률과통계/q12.png', sha256: 'aac24e6b45036b7f628ddf4406fa451fc30681e7ae831b44272edb7cd8719026', reviewed: true },
  { ref: svgRef, sha256: svgSha256, reviewed: true }
];
const reviewedAssetsRef = writeFresh(`${dir}/reviewed-current-assets.after-q10-solution.json`, reviewedAssets);

const draft = structuredClone(baseEvidence);
draft.studentInput.currentStudentBundle = {
  path: currentBundleFile,
  sha256: shaFile(currentBundleFile),
  sourceRawSha256: currentBundle.sourceRawSha256,
  questionCount: currentBundle.questionCount,
  qids: currentBundle.qids,
  answersIncluded: false
};
draft.studentInput.currentStudentParity = {
  path: parityRef.path,
  sha256: parityRef.sha256,
  exactStudentAndAssetParity: false,
  changedQids: [10, 11, 12, 15],
  assetCount: 3,
  targetedDirectDependencyQids: [10, 11, 12],
  q15CoveredByCurrentR1Evidence: true,
  currentSolutionOnlyStudentParity: 'EXACT'
};
const reads = [...(draft.studentInput.actualAssetReads ?? [])];
if (!reads.some(asset => asset.ref === svgRef && asset.sha256 === svgSha256 && asset.opened === true)) reads.push({ ref: svgRef, sha256: svgSha256, reviewed: true, opened: true });
draft.studentInput.actualAssetReads = reads;
draft.currentAssetBindings = [...(draft.currentAssetBindings ?? [])];
if (!draft.currentAssetBindings.some(asset => asset.ref === svgRef)) draft.currentAssetBindings.push({ kind: 'CURRENT_ASSET', ref: svgRef, sha256: svgSha256 });

draft.sourceProvenance.finalCurrentSourceSha256 = expectedSourceRawSha256;
draft.sourceProvenance.finalCurrentSourceGitBlobSha1 = expectedSourceGitBlobSha1;
const row = draft.rows.find(entry => Number(entry.qid) === 10);
if (!row) throw new Error('CURRENT_R1_Q10_ROW_REQUIRED');
const qlAssets = row.axisEvidence.QUESTION_LAYOUT?.requiredAssets;
if (Array.isArray(qlAssets)) {
  const pngBinding = qlAssets.find(asset => asset.ref === pngRef);
  if (pngBinding) pngBinding.sha256 = pngSha256;
}
row.axisEvidence.SOLUTION_LAYOUT.solutionSha256 = solutionSha256;
row.axisEvidence.SOLUTION_LAYOUT.status = 'PASS_STATIC';
row.axisEvidence.SOLUTION_LAYOUT.smallBoardContinuityStatus = 'PASS';
row.axisEvidence.SOLUTION_LAYOUT.actualSolutionRender = 'NOT_RUN_R1_R3_REQUIRED';
row.axisEvidence.SOLUTION_LAYOUT.observation = 'Post-repair q10 solution lines preserve all frozen math facts and answer; complete row-value math groups are separated at prose boundaries. The fullwidth SVG maps the recurrence to the source grid. CREATE desktop/mobile solution captures were visually reviewed; the current-source R3 full-exam render remains unrun.';
row.axisEvidence.SOLUTION_LAYOUT.visualReview = { path: visualReviewRef.path, sha256: visualReviewRef.sha256 };
row.axisEvidence.VISUAL_SVG.status = 'STATIC_TRIAGE_REVIEWED';
row.axisEvidence.VISUAL_SVG.solutionImagePresent = true;
row.axisEvidence.VISUAL_SVG.solutionImageSha256 = svgSha256;
row.axisEvidence.VISUAL_SVG.actualStudentRender = 'NOT_RUN_R1_R3_OWNS_RENDER';
row.axisEvidence.VISUAL_SVG.sourcePngSha256 = pngSha256;
row.axisEvidence.VISUAL_SVG.visualReview = { path: visualReviewRef.path, sha256: visualReviewRef.sha256, disposition: 'PASS_STATIC_TRIAGE' };
row.visualEvidence = { path: visualReviewRef.path, sha256: visualReviewRef.sha256, renderStatus: 'NOT_RUN_R1_R3_OWNS_RENDER' };
row.solutionVisualReview = { path: visualReviewRef.path, sha256: visualReviewRef.sha256, disposition: 'PASS_STATIC_AFTER_REPAIR' };

draft.qualityReview.visualDebtQids = (draft.qualityReview.visualDebtQids ?? []).filter(qid => Number(qid) !== 10);
draft.qualityReview.fourAxisCoverage = '21/23 validated unchanged rows reused + q10 solution visual direct-dependency review + q15 fresh review';
draft.qualityReview.actualSolutionLayoutReview = 'Prior full-qid solution-layout rows reused except q10, which was re-reviewed against the current solution and CREATE q10 desktop/mobile captures; R3 current-source full-exam render remains required.';
draft.qualityReview.actualVisualTriage = 'Prior full-qid visual triage reused except q10, which now has a current-source problem-PNG/SVG semantic review; other prior dispositions are preserved.';
draft.qualityReview.q10VisualReview = { path: visualReviewRef.path, sha256: visualReviewRef.sha256, solutionLayout: 'PASS_STATIC', visualSvg: 'STATIC_TRIAGE_REVIEWED', renderPassClaimed: false };

const draftRef = writeFresh(`${dir}/R1.evidence.q10-solution-visual.draft.json`, draft);
console.log(JSON.stringify({
  ok: true,
  currentSource: { rawSha256: expectedSourceRawSha256, rawBufferGitBlobSha1: expectedSourceGitBlobSha1 },
  q10: { priorSolutionSha256: oldSolutionSha256, currentSolutionSha256: solutionSha256, problemPngSha256: pngSha256, solutionSvgSha256: svgSha256, originalFreezeSha256: freezePhysical.sha256, createCaptureReviewCases: captureCases.length },
  fullStudentProjectionParityToPreviousCurrentSource: true,
  outputs: { currentStudentBundle: { path: currentBundleFile, sha256: shaFile(currentBundleFile) }, parity: parityRef, visualReview: visualReviewRef, reviewedAssets: reviewedAssetsRef, evidenceDraft: draftRef }
}, null, 2));
