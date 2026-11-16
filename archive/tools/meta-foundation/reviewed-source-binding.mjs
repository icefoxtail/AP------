import crypto from "node:crypto";

const fail = message => { throw new Error(`reviewed source binding: ${message}`); };
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const text = value => typeof value === "string" && value.trim().length > 0;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const sha = value => crypto.createHash("sha256").update(value).digest("hex");

export const REVIEWED_SOURCE_BINDING_OPT_INS = Object.freeze([
  Object.freeze({ requestKey: "proposalFinalization", proofKey: "proposalFinalization" }),
  Object.freeze({ requestKey: "retainedFields", proofKey: "retainedNativeFields" }),
  Object.freeze({ requestKey: "scopeFieldBinding", proofKey: "scopeFieldBindings" }),
  Object.freeze({ requestKey: "retainedScopeTransport", proofKey: "retainedScopeTransport" }),
  Object.freeze({ requestKey: "rationaleContinuity", proofKey: "rationaleContinuity" }),
  Object.freeze({ requestKey: "currentDefinitionApplication", proofKey: "currentDefinitionApplication" }),
]);

export function reviewedSourceBindingItems(request) {
  if (!Array.isArray(request?.items)) fail("request items required");
  return request.items.filter(patch => REVIEWED_SOURCE_BINDING_OPT_INS.some(({ requestKey }) =>
    patch.sourceReview?.[requestKey] !== undefined) || patch.targetParentRef?.nativeSourceReview !== undefined ||
    patch.targetParentRef?.retainedScopeParent !== undefined);
}

export function reviewedSourceBindingPath(requestId) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId || "")) fail("valid requestId required");
  return `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${requestId}.source-review-binding.json`;
}

// This writer-issued snapshot grants no authority by itself. Its path remains in
// selected metadata/runtime provenance, so removing a receipt's proof and refs
// cannot turn an explicitly reviewed request into an ordinary unchanged row.
export function buildReviewedSourceBinding({ request, requestId, requestSha256, sourceArchiveFile,
  sourceBlobSha1, sourceRawSha256, scope, expectedQuestionCount, partialUidCount,
  fingerprintRepairs, nativeParentBindings = [] }) {
  reviewedSourceBindingPath(requestId);
  if (request?.schemaVersion !== "archive-reviewed-exam-meta-register-request-v2" ||
      request.requestId !== requestId || request.scope !== "PARTIAL_UIDS" || scope !== request.scope ||
      request.approval?.type !== "FINAL_QA" || request.approval.metadataReviewed !== true ||
      request.registrationMode !== undefined || request.approval.sourceRebind !== undefined ||
      !SHA256.test(requestSha256 || "") || sha(stable(request)) !== requestSha256 ||
      !SHA1.test(sourceBlobSha1 || "") || request.expectedSourceBlobSha1 !== sourceBlobSha1 ||
      !SHA256.test(sourceRawSha256 || "") || !text(sourceArchiveFile) || request.sourceArchiveFile !== sourceArchiveFile ||
      !Number.isInteger(expectedQuestionCount) || expectedQuestionCount !== request.expectedQuestionCount ||
      !Number.isInteger(partialUidCount) || partialUidCount !== request.items?.length || partialUidCount < 1 ||
      expectedQuestionCount < partialUidCount || !Array.isArray(fingerprintRepairs) || !Array.isArray(nativeParentBindings))
    fail("exact original request, source and selected/full denominators required");
  const items = reviewedSourceBindingItems(request);
  if (!items.length || new Set(items.map(patch => patch.questionUid)).size !== items.length ||
      new Set(items.map(patch => patch.sourceOrdinal)).size !== items.length || items.some(patch => !text(patch.questionUid) ||
        !Number.isInteger(patch.sourceOrdinal) || patch.sourceOrdinal < 1 || patch.sourceOrdinal > expectedQuestionCount))
    fail("exact explicit source-review UID inventory required");
  const records = items.map(patch => {
    const repairs = fingerprintRepairs.filter(repair => repair.questionUid === patch.questionUid && repair.sourceOrdinal === patch.sourceOrdinal);
    const repair = repairs[0], proof = repair?.sourceReview;
    if (repairs.length !== 1 || !proof || proof.schemaVersion !== "archive-reviewed-source-reassessment-v1" ||
        proof.questionUid !== patch.questionUid || proof.sourceOrdinal !== patch.sourceOrdinal ||
        REVIEWED_SOURCE_BINDING_OPT_INS.some(({ requestKey, proofKey }) =>
          patch.sourceReview?.[requestKey] !== undefined && proof[proofKey] === undefined))
      fail("exact selected fingerprint repair and source-review proof required");
    const parents = nativeParentBindings.filter(value => value.questionUid === patch.questionUid && value.sourceOrdinal === patch.sourceOrdinal);
    const hasParent = patch.targetParentRef?.nativeSourceReview !== undefined || patch.targetParentRef?.retainedScopeParent !== undefined;
    if (hasParent ? parents.length !== 1 : parents.length !== 0)
      fail("exact native parent proof inventory required");
    return { questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal,
      sourceReviewSha256: sha(stable(proof)), fingerprintRepairSha256: sha(stable(repair)),
      nativeParentBindingSha256: parents.length ? sha(stable(parents[0])) : null };
  }).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  return { schemaVersion: "archive-reviewed-source-binding-v1", requestId, requestSha256, sourceArchiveFile,
    sourceBlobSha1, sourceRawSha256, scope, expectedQuestionCount, partialUidCount, sourceReviewUidCount: records.length,
    requestSnapshot: JSON.parse(stable(request)), records };
}
