import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const rel = value => path.resolve(root, value);
const shaFile = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeFresh = (file, value) => {
  const absolute = rel(file);
  if (fs.existsSync(absolute)) throw new Error(`OUTPUT_EXISTS:${file}`);
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return { path: absolute, sha256: shaFile(absolute) };
};

const examUid = '17_효천고_1학기_중간_고2_확률과통계';
const jsFile = rel('archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const expectedRawSha256 = '97d37e06747b4dff432b999a34266a05ac6dd16cfeb92fa6c9e74586cfdf2803';
const receiptFile = rel('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/asset-restoration-receipt.json');
const baseEvidenceFile = rel('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ITEM_RECOVERY_q15/R1_qid_review_clean2/R1.evidence.merged-q15-clean.bound.rebind1.json');
const oldBundleFile = rel('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/current-student-only.bundle.json');
const currentBundleFile = rel('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1.asset-restoration.student-only.packet.json');
const freezeFile = rel('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1.original-freeze.json');
const q15ReportFile = rel('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ITEM_RECOVERY_q15/R1_qid_review_clean2/R1.generic.raw.rebind1.stdout.json');
const q15EventFile = rel('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ITEM_RECOVERY_q15/R1_qid_review_clean2/R1.complete.event.rebind1.json');
const outputDir = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012';

if (shaFile(jsFile) !== expectedRawSha256) throw new Error('CURRENT_JS_SHA_MISMATCH');
if (shaFile(baseEvidenceFile) !== '44942f51c1867934ec65b07882b479e338f79f3c367ad67297350476097dbeaa') throw new Error('REUSED_R1_EVIDENCE_SHA_MISMATCH');
if (shaFile(q15ReportFile) !== '6fd6c2a5fb7dcef113cace2e21a3aaba3d7905e808f050afc09055a1a2a31778') throw new Error('REUSED_Q15_REPORT_SHA_MISMATCH');
if (shaFile(q15EventFile) !== '6e82f1cd08a791ff6ad82de9f442974df775096b0341984f65e3835d7c74e530') throw new Error('REUSED_Q15_EVENT_SHA_MISMATCH');

const receipt = readJson(receiptFile);
const base = readJson(baseEvidenceFile);
const oldBundle = readJson(oldBundleFile);
const currentBundle = readJson(currentBundleFile);
const freeze = readJson(freezeFile);
const oldRows = oldBundle.rows ?? oldBundle.packet?.rows;
const currentRows = currentBundle.rows;
const expectedQids = Array.from({ length: 23 }, (_, index) => index + 1);
const qids = rows => rows.map(row => Number(row.qid ?? row.id));

if (receipt.examUid !== examUid || receipt.sourcePdf?.matchIntake !== true) throw new Error('RESTORATION_SOURCE_INTAKE_BINDING_REQUIRED');
if (receipt.sourcePdf?.sha256 !== '0bb72554feacb549d7bf981e187ae6591f2355cc7635e9e9a880e88a1b870468') throw new Error('RESTORATION_SOURCE_PDF_SHA_MISMATCH');
if (currentBundle.sourceRawSha256 !== expectedRawSha256) throw new Error('CURRENT_STUDENT_PACKET_SOURCE_SHA_MISMATCH');
if (currentBundle.questionCount !== 23 || JSON.stringify(currentBundle.qids) !== JSON.stringify(expectedQids)) throw new Error('CURRENT_STUDENT_PACKET_DENOMINATOR_MISMATCH');
if (JSON.stringify(qids(base.rows)) !== JSON.stringify(expectedQids)) throw new Error('CURRENT_R1_EVIDENCE_QID_DENOMINATOR_MISMATCH');
if (freeze.stage !== 'R1' || freeze.rows.length !== 23 || JSON.stringify(freeze.studentQidOrder) !== JSON.stringify(expectedQids)) throw new Error('ORIGINAL_R1_FREEZE_IDENTITY_INVALID');

const oldByQid = new Map(oldRows.map(row => [Number(row.qid ?? row.id), row]));
const currentByQid = new Map(currentRows.map(row => [Number(row.qid ?? row.id), row]));
const assetRows = [];
const observations = {
  q10: 'Restored crop shows the road-grid route network and the A, B, P, Q markers named by the current prompt; crop boundary excludes neighboring prompt/choice text.',
  q11: 'Restored crop shows the single horizontal blank-cell row with the printed ellipsis; it matches the table structure required by the current prompt.',
  q12: 'Restored crop shows the intersecting-line arrangement and the parallel family required by the current prompt; the crop contains the diagram without adjacent text.'
};

for (const qid of [10, 11, 12]) {
  const item = receipt.assets.find(row => row.qid === `q${qid}`);
  const oldRow = oldByQid.get(qid);
  const currentRow = currentByQid.get(qid);
  if (!item || !oldRow || !currentRow) throw new Error(`TARGET_QID_INPUT_MISSING:${qid}`);
  if (oldRow.studentPayloadSha256 !== currentRow.studentPayloadSha256) throw new Error(`TARGET_STUDENT_PAYLOAD_CHANGED:q${qid}`);
  const oldAssets = (oldRow.assets ?? []).map(asset => ({ ref: asset.ref, sha256: asset.sha256 })).sort((a, b) => a.ref.localeCompare(b.ref));
  const newAssets = (currentRow.assets ?? []).map(asset => ({ ref: asset.ref, sha256: asset.sha256 })).sort((a, b) => a.ref.localeCompare(b.ref));
  if (oldAssets.length !== 1 || newAssets.length !== 1 || oldAssets[0].ref !== item.finalAssetPath.replace(`${root}${path.sep}archive${path.sep}`, '').replaceAll(path.sep, '/') || newAssets[0].ref !== oldAssets[0].ref) throw new Error(`TARGET_ASSET_REFERENCE_MISMATCH:q${qid}`);

  const candidateSha256 = shaFile(item.candidatePath);
  const finalAssetSha256 = shaFile(item.finalAssetPath);
  if (candidateSha256 !== item.candidateSha256 || finalAssetSha256 !== item.finalAssetSha256 || candidateSha256 !== finalAssetSha256) throw new Error(`TARGET_CROP_BYTES_DIVERGE:q${qid}`);
  if (currentRow.assets?.length !== 1 || currentRow.assets[0].ref !== newAssets[0].ref || currentRow.assets[0].sha256 !== finalAssetSha256) throw new Error(`CURRENT_BUNDLE_ASSET_BINDING_MISMATCH:q${qid}`);
  assetRows.push({
    qid,
    currentStudentPayloadSha256: currentRow.studentPayloadSha256,
    priorStudentPayloadSha256: oldRow.studentPayloadSha256,
    studentPayloadUnchanged: true,
    currentRef: newAssets[0].ref,
    priorExpectedAssetSha256: oldAssets[0].sha256,
    currentAssetSha256: finalAssetSha256,
    sourcePdfPage: item.sourcePdfPage,
    sourcePageRenderSha256: item.sourcePageRenderSha256,
    sourcePageRenderDimensions: item.sourcePageRenderDimensions,
    cropBoxPixels: item.cropBoxPixels,
    cropOutputDimensions: item.cropOutputDimensions,
    candidateSha256,
    finalAssetSha256,
    candidateEqualsFinal: true,
    sourcePdfSha256: receipt.sourcePdf.sha256,
    sourcePdfMatchesIntake: receipt.sourcePdf.matchIntake,
    observation: observations[`q${qid}`],
    currentAssetActuallyOpenedByReviewer: true
  });
}

const reviewedAssets = assetRows.map(row => ({ ref: row.currentRef, sha256: row.currentAssetSha256, reviewed: true }));
const ackRef = writeFresh(`${outputDir}/reviewed-current-assets.json`, reviewedAssets);
const parity = {
  schemaVersion: 'JS_ARCHIVE_R1_DIRECT_DEPENDENCY_REVIEW_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  stage: 'R1',
  examUid,
  reviewKind: 'TARGETED_DIRECT_DEPENDENCY_ASSET_RESTORATION',
  scopeQids: [10, 11, 12],
  currentSource: { path: jsFile, sha256: expectedRawSha256 },
  originalFreeze: { path: freezeFile, sha256: shaFile(freezeFile), sourceRawSha256: freeze.sourceRawSha256, rowCount: freeze.rows.length, preservedWithoutModification: true },
  originalStudentBundle: { path: oldBundleFile, sha256: shaFile(oldBundleFile), sourceRawSha256: oldBundle.sourceRawSha256, qidCount: oldRows.length },
  currentStudentBundle: { path: currentBundleFile, sha256: shaFile(currentBundleFile), sourceRawSha256: currentBundle.sourceRawSha256, qidCount: currentBundle.questionCount, qids: currentBundle.qids, answersIncluded: false },
  restorationReceipt: { path: receiptFile, sha256: shaFile(receiptFile), sourcePdf: receipt.sourcePdf, targetedCropOnly: true },
  assetReviewAcknowledgement: ackRef,
  qids: assetRows,
  q15Reuse: {
    exactCurrentFullR1Evidence: { path: baseEvidenceFile, sha256: shaFile(baseEvidenceFile) },
    exactCurrentGenericReport: { path: q15ReportFile, sha256: shaFile(q15ReportFile) },
    exactCurrentCompletionEvent: { path: q15EventFile, sha256: shaFile(q15EventFile) },
    contentInspectedByThisWorker: false
  },
  answerReview: 'EXISTING_FROZEN_R1_ROWS_REUSED; no answer or solution was reopened or re-solved for this direct-dependency visual review.',
  sourceReviewMode: 'SCOPED_RESTORATION_CROP_REVIEW; intake PDF identity was reused from the receipt; only the q10/q11/q12 crop PNGs and current student references were opened.',
  noPdfFullPageReview: true,
  noJsEdit: true
};
const parityRef = writeFresh(`${outputDir}/R1.asset-restoration.direct-dependency-review.json`, parity);

const draft = structuredClone(base);
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
  q15CoveredByCurrentR1Evidence: true
};
draft.studentInput.actualAssetReads = reviewedAssets.map(asset => ({ ...asset, opened: true }));
draft.currentAssetBindings = assetRows.map(row => ({ kind: 'CURRENT_ASSET', ref: row.currentRef, sha256: row.priorExpectedAssetSha256 }));
for (const assetReview of assetRows) {
  const row = draft.rows.find(entry => Number(entry.qid) === assetReview.qid);
  if (!row) throw new Error(`R1_EVIDENCE_ROW_MISSING:q${assetReview.qid}`);
  row.directDependencyAssetReview = {
    path: parityRef.path,
    sha256: parityRef.sha256,
    currentRef: assetReview.currentRef,
    currentAssetSha256: assetReview.currentAssetSha256,
    sourcePdfPage: assetReview.sourcePdfPage,
    sourcePageRenderSha256: assetReview.sourcePageRenderSha256,
    cropBoxPixels: assetReview.cropBoxPixels,
    sourcePdfSha256: assetReview.sourcePdfSha256,
    sourcePdfMatchesIntake: assetReview.sourcePdfMatchesIntake,
    disposition: 'SOURCE_CROP_REVIEWED_KEEP_CURRENT_PRODUCTION_ASSET'
  };
}
const draftRef = writeFresh(`${outputDir}/R1.evidence.asset-restoration.draft.json`, draft);

console.log(JSON.stringify({
  ok: true,
  currentSourceSha256: expectedRawSha256,
  currentStudentBundle: { path: currentBundleFile, sha256: shaFile(currentBundleFile), questionCount: currentBundle.questionCount },
  originalFreeze: { path: freezeFile, sha256: shaFile(freezeFile), preserved: true },
  qids: assetRows.map(row => ({ qid: row.qid, studentPayloadUnchanged: row.studentPayloadUnchanged, ref: row.currentRef, currentAssetSha256: row.currentAssetSha256, sourcePage: row.sourcePdfPage, cropBoxPixels: row.cropBoxPixels })),
  q15ContentInspected: false,
  outputs: { assetAcknowledgement: ackRef, directDependencyReview: parityRef, evidenceDraft: draftRef }
}, null, 2));
