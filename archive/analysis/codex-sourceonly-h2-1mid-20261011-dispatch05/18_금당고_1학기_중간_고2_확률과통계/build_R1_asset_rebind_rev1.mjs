import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const outDir = path.dirname(fileURLToPath(import.meta.url));
const legacyEvidence = path.join(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1_18_geumdang_evidence_q12_correction_bound.json');
const reviewPath = path.join(outDir, 'R1_asset_restoration_review.rev1.json');
const evidenceOut = path.join(outDir, 'R1_evidence.asset_restoration.draft.rev2.json');
const reviewedAssetsOut = path.join(outDir, 'R1_reviewed_current_assets.rev2.json');
const evidence = JSON.parse(fs.readFileSync(legacyEvidence, 'utf8'));
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
const digest = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const byQid = new Map(evidence.rows.map(row => [Number(row.qid), row]));
const reviewAssets = review.reviewedAssets;
const asset = qid => ref => reviewAssets.find(item => item.qid === qid && item.ref === ref);
const refs = {
  q11: 'assets/images/18_금당고_1학기_중간_고2_확률과통계/q11-solution.svg',
  q12p: 'assets/images/18_금당고_1학기_중간_고2_확률과통계/q12.png',
  q12s: 'assets/images/18_금당고_1학기_중간_고2_확률과통계/q12-solution.svg',
  q13p: 'assets/images/18_금당고_1학기_중간_고2_확률과통계/q13.png',
  q13s: 'assets/images/18_금당고_1학기_중간_고2_확률과통계/q13-solution.svg'
};
for (const [qid, ref] of [[11, refs.q11], [12, refs.q12p], [12, refs.q12s], [13, refs.q13p], [13, refs.q13s]]) {
  const r = byQid.get(qid);
  const item = asset(qid)(ref);
  if (!r || !item || item.opened !== true || item.disposition !== 'PASS') throw new Error(`REVIEW_ASSET_MISSING:${qid}:${ref}`);
  const visual = r.axisEvidence?.VISUAL_SVG;
  if (!visual) throw new Error(`VISUAL_AXIS_MISSING:${qid}`);
  const binding = evidence.currentAssetBindings?.find(x => x.ref === ref);
  if (!binding) throw new Error(`CURRENT_ASSET_BINDING_MISSING:${ref}`);
  binding.sha256 = item.sha256;
  binding.reviewed = true;
  if (qid === 11) {
    visual.evidence = 'q11 solution SVG current bytes opened and its static render independently checked: accepted diagonal band and two excluded corner triangles yield 5/9. Archive browser render remains NOT_RUN/R3-owned.';
    visual.solutionVisual.sha256 = item.sha256;
    visual.solutionVisual.opened = true;
    visual.solutionVisual.geometryParity = 'PASS';
    visual.assetReads = [{ ref, sha256: item.sha256, opened: true, reviewedCurrentAsset: true }];
  } else if (qid === 12 && ref === refs.q12p) {
    visual.evidence = 'Current q12 problem PNG opened. The six-column by three-row grid has A lower left, B upper right, and the forbidden x=4 edge with P=(4,1) lower and Q=(4,2) upper. The bytes are recovered exact current PNG bytes; no PDF review claimed.';
    visual.problemVisual.sha256 = item.sha256;
    visual.problemVisual.opened = true;
    visual.problemVisual.sourceParity = 'EXACT_RECOVERED_CURRENT_BYTES';
    visual.problemVisual.observation = 'A lower-left, B upper-right, 6 columns × 3 rows, Q upper and P lower on one vertical edge at x=4.';
    const read = visual.assetReads.find(x => x.ref === ref);
    if (read) read.sha256 = item.sha256;
  } else if (qid === 12 && ref === refs.q12s) {
    visual.evidence = 'Current q12 problem PNG and recreated q12 solution SVG were opened; current SVG static render independently checked. Q=(4,2) is upper, P=(4,1) lower, forbidden edge x=4; A→P=5, Q→B=3, and 84−5×3=69. Archive browser render remains NOT_RUN/R3-owned.';
    visual.solutionVisual.sha256 = item.sha256;
    visual.solutionVisual.opened = true;
    visual.solutionVisual.geometryParity = 'PASS';
    visual.solutionVisual.observation = 'The actual line primitive spans lower P=(4,1) to upper Q=(4,2); annotations read A→P=5 and Q→B=3; forbidden-edge paths 15; avoiding paths 69.';
    const read = visual.assetReads.find(x => x.ref === ref);
    if (read) read.sha256 = item.sha256;
  } else if (qid === 13 && ref === refs.q13p) {
    visual.evidence = 'Current q13 PNG is a scoped 300-DPI source recrop, opened and visually checked; it contains the complete circle and eight equally spaced circumference points. Historical byte parity is not claimed. Archive browser render remains NOT_RUN/R3-owned.';
    visual.problemVisual.disposition = 'REBUILT_SOURCE_CROP';
    visual.problemVisual.sha256 = item.sha256;
    visual.problemVisual.opened = true;
    visual.problemVisual.sourceParity = 'SCOPED_300DPI_SOURCE_RECROP_VISUALLY_MATCHED';
    visual.problemVisual.historicalBytesParity = 'NOT_CLAIMED';
    visual.problemVisual.reason = 'Eight equally spaced circumference points are the decisive input. The current file is a scoped 300-DPI source recrop; its historical bytes are not claimed.';
    const read = visual.assetReads.find(x => x.ref === ref);
    if (read) { read.sha256 = item.sha256; read.reviewedCurrentAsset = true; }
  } else if (qid === 13 && ref === refs.q13s) {
    visual.evidence = 'Current q13 solution SVG and its static render were opened and independently checked: eight equally spaced points produce four antipodal pairs; selecting a diameter and one of the six remaining points gives 24 favorable triples among 56, probability 3/7. Archive browser render remains NOT_RUN/R3-owned.';
    visual.solutionVisual.sha256 = item.sha256;
    visual.solutionVisual.opened = true;
    visual.solutionVisual.geometryParity = 'PASS';
    visual.solutionVisual.observation = 'Eight equally spaced circumference points form four antipodal diameters; choosing a diameter and one of the remaining six points gives 4×6=24 right triangles among C(8,3)=56 triples, probability 3/7.';
    const read = visual.assetReads.find(x => x.ref === ref);
    if (read) { read.sha256 = item.sha256; read.reviewedCurrentAsset = true; }
  }
}
const goldenRefresh = review.validatorDependencyRefresh.currentGoldenVisuals;
for (const sample of evidence.goldenCalibration?.samples || []) {
  for (const item of sample.items || []) {
    const current = goldenRefresh.find(x => x.source === sample.path && x.qid === item.qid);
    if (item.visualSha256 && current) {
      item.visualSha256 = current.svgSha256;
      item.visualObservation = current.observation;
    }
  }
}
evidence.currentAssetReviewAck = {
  reviewed: true,
  openedRefs: reviewAssets.map(item => item.ref),
  reviewedBy: 'codex-r1-18-geumdang-20261012',
  note: 'Targeted rebind after missing current files were restored. q11–q13 problem/solution assets were opened; q13 PNG is a scoped 300-DPI recrop without historical-byte parity claim. Existing independent answer freeze and unrelated rows are reused. Required Golden visual dependencies were refreshed to current tracked SVG bytes after static review; no sample source/solution was changed and no Archive browser render is claimed.'
};
evidence.visualGeometryParityRef = {
  path: 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_금당고_1학기_중간_고2_확률과통계/CREATE.visual-asset-restoration.rev1/geometry-static-evidence.raw.json',
  sha256: digest(path.join(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_금당고_1학기_중간_고2_확률과통계/CREATE.visual-asset-restoration.rev1/geometry-static-evidence.raw.json'))
};
evidence.targetedAssetReviewRef = {
  path: 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_금당고_1학기_중간_고2_확률과통계/R1_asset_restoration_review.rev1.json',
  sha256: digest(reviewPath)
};
fs.writeFileSync(evidenceOut, JSON.stringify(evidence, null, 2) + '\n');
fs.writeFileSync(reviewedAssetsOut, JSON.stringify(reviewAssets.map(item => ({ ref: item.ref, sha256: item.sha256, reviewed: true })), null, 2) + '\n');
console.log(JSON.stringify({ evidenceOut, reviewedAssetsOut, updatedQids: [11, 12, 13], updatedRefs: reviewAssets.map(x => x.ref) }, null, 2));
