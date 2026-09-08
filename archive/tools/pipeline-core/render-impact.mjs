import { canonicalJson, objectSha, readBoundFile } from './canonical.mjs';

export const RENDER_IMPACT_VERSION = 'APMATH_RENDER_IMPACT_v1';
export const GLOBAL_RENDER_INVALIDATORS = Object.freeze(['engine.html', 'CSS', 'layout-authority', 'native-print-runtime', 'viewport-policy', 'render-policy', 'font', 'MathJax', 'runtime']);

const keyOf = row => `${row.questionUid}\u0000${row.mode}\u0000${row.viewportProfile}`;
const signatureOf = row => ({ page: row.page ?? null, column: row.column ?? null, flowPosition: row.flowPosition ?? null, boundingBox: row.boundingBox ?? null, continuation: row.continuation ?? null, runtimeResponseSha: row.runtimeResponseSha ?? null, assetSha: row.assetSha ?? null, screenshotSha: row.screenshot?.sha256 ?? null, blocks: row.blocks?.map(block => ({ blockId: block.blockId, placementSha: block.placementSha, screenshotSha: block.screenshot?.sha256 || null, final: block.final })) ?? null });

export function renderSignatureMap(capture) {
  const rows = Array.isArray(capture) ? capture : capture?.payload?.itemWitnesses || capture?.itemWitnesses || [];
  if (!rows.length || rows.some(row => !row.questionUid || !row.mode || !row.viewportProfile || !row.boundingBox || !row.screenshot?.sha256 || !row.runtimeResponseSha || !row.assetSha || !row.blocks?.length)) throw new Error('ACTUAL_CAPTURE_WITNESS_REQUIRED');
  if (new Set(rows.map(keyOf)).size !== rows.length) throw new Error('DUPLICATE_RENDER_WITNESS');
  return Object.fromEntries(rows.map(row => [keyOf(row), { questionUid: row.questionUid, mode: row.mode, viewport: row.viewport || row.viewportProfile, signature: signatureOf(row), signatureSha: objectSha(signatureOf(row)) }]).sort(([a], [b]) => a.localeCompare(b)));
}

export function detectRenderImpact(previous, current, { globalDependencies = [] } = {}) {
  const before = renderSignatureMap(previous), after = renderSignatureMap(current);
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  const changed = keys.filter(key => canonicalJson(before[key]?.signature || null) !== canonicalJson(after[key]?.signature || null));
  const globalInvalidatorSet = [...new Set(globalDependencies)].sort();
  const rows = changed.map(key => ({ questionUid: after[key]?.questionUid || before[key]?.questionUid, mode: after[key]?.mode || before[key]?.mode, viewport: after[key]?.viewport || before[key]?.viewport, reasonCodes: ['SIGNATURE_CHANGED'] })).sort((a, b) => `${a.questionUid}:${a.mode}:${a.viewport}`.localeCompare(`${b.questionUid}:${b.mode}:${b.viewport}`));
  const result = { schemaVersion: RENDER_IMPACT_VERSION, changedRenderSet: rows, renderChangedUidSet: [...new Set(rows.map(row => row.questionUid))].sort(), affectedRenderUidSet: globalInvalidatorSet.length ? [...new Set(Object.values(after).map(row => row.questionUid))].sort() : [...new Set(rows.map(row => row.questionUid))].sort(), globalInvalidatorSet, renderSignatureSha: objectSha({ before, after }) };
  return { ...result, status: 'PASS', impactSha: objectSha(result) };
}

export const RENDER_REVIEW_REUSE_RECEIPT_VERSION = 'RENDER_REVIEW_REUSE_RECEIPT_v1';
export function validateRenderReviewReuseReceipt(root, receipt, { currentCaptureRef, currentRunInputSha, questionUid = null } = {}) {
  const errors = [];
  try {
    if (receipt?.schemaVersion !== RENDER_REVIEW_REUSE_RECEIPT_VERSION || receipt.status !== 'PASS' || receipt.currentRunInputSha !== currentRunInputSha || canonicalJson(receipt.currentCaptureRef) !== canonicalJson(currentCaptureRef)) throw new Error('RENDER_REUSE_BINDING');
    const prior = JSON.parse(readBoundFile(root, receipt.priorCaptureRef)), current = JSON.parse(readBoundFile(root, currentCaptureRef)), review = JSON.parse(readBoundFile(root, receipt.rootFreshReviewRef));
    if (review.mode !== 'FRESH' || review.status !== 'PASS' || review.payload?.captureEvidenceSha !== receipt.priorCaptureRef.sha256 || review.reviewSessionId === prior.reviewSessionId || review.reviewerId === prior.reviewerId) throw new Error('ROOT_RENDER_REVIEW_REQUIRED');
    const scope = capture => questionUid ? (capture.payload?.itemWitnesses || []).filter(row => row.questionUid === questionUid) : capture;
    if (questionUid && (receipt.questionUid !== questionUid || !review.payload?.questionUids?.includes(questionUid) || review.axisInputShas?.[questionUid] !== current.reviewAxisInputShas?.[questionUid])) throw new Error('RENDER_REUSE_UID_AXIS_BINDING');
    if (canonicalJson(renderSignatureMap(scope(prior))) !== canonicalJson(renderSignatureMap(scope(current)))) throw new Error('RENDER_PLACEMENT_CONTINUATION_RUNTIME_ASSET_WITNESS_CHANGED');
    const eligibility = JSON.parse(readBoundFile(root, receipt.eligibilityEvidenceRef));
    const lifecycle = JSON.parse(readBoundFile(root, receipt.lifecycleSnapshotRef));
    if (lifecycle.currentRunInputSha !== currentRunInputSha || canonicalJson(lifecycle.eligibility) !== canonicalJson(Object.fromEntries(Object.entries(eligibility).filter(([key]) => key !== 'lifecycleSnapshotSha')))) throw new Error('RENDER_LIFECYCLE_SNAPSHOT_BINDING');
    if (eligibility.currentRunInputSha !== currentRunInputSha || eligibility.currentRunId !== current.runId || eligibility.currentRevision !== current.revision || eligibility.lifecycleSnapshotSha !== receipt.lifecycleSnapshotRef?.sha256 || eligibility.rootFreshEvidenceSha !== receipt.rootFreshReviewRef.sha256 || eligibility.eligibilityStatus !== 'ELIGIBLE' || eligibility.withdrawalStatus !== 'ACTIVE' || eligibility.revocationStatus !== 'NOT_REVOKED' || eligibility.supersessionStatus !== 'VALID' || eligibility.sourceAuthorityStatus !== 'VALID' || eligibility.correctionLineageStatus !== 'VALID') throw new Error('RENDER_REVIEW_REUSE_INELIGIBLE');
  } catch (error) { errors.push(error.message); }
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors, receiptSha: errors.length ? null : objectSha(receipt) };
}
