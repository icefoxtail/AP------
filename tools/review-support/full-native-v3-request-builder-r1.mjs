import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// Pure candidate preparation, with no filesystem, Git, network or approval side
// effects. Callers must separately authenticate every input. The ordinary
// registrar and its original Native v3 finalizer remain the approval boundary.
// This helper contains no question roster, subject profile or authority waiver.
export const stableJson = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
export const sha256Bytes = value => crypto.createHash('sha256').update(value).digest('hex');
export const sha256Value = value => sha256Bytes(stableJson(value));
const equal = (a, b) => stableJson(a) === stableJson(b);
const own = (row, key) => Object.hasOwn(row || {}, key);
const clone = value => structuredClone(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const DIFFICULTY = ['level', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
const DERIVED = new Set(['sourceFingerprint', 'contentFingerprint', 'L1', 'L2', 'L3', 'L4']);
const RPM = ['rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'rpmPrimaryId', 'rpmPrimaryPath', 'rpmSemanticStatus', 'semanticSourceScope', 'semanticScopeRelation'];
const PRIMARY = ['standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey'];

// Exact property order used by reviewed-exam-registration-v2 sourceFingerprints.
export function sourceFingerprints(question) {
  const content = { content: question.content ?? null, choices: Array.isArray(question.choices) ? question.choices : null,
    image: question.image ?? null };
  return { sourceFingerprint: sha256Bytes(JSON.stringify({ content: content.content, choices: content.choices,
    answer: question.answer ?? null, solution: question.solution ?? null, image: content.image })),
  contentFingerprint: sha256Bytes(JSON.stringify(content)) };
}

export function evidenceRefs(refs) {
  assert(Array.isArray(refs), 'evidence list required');
  const byPath = new Map();
  for (const ref of refs) {
    assert(ref && text(ref.path) && !ref.path.startsWith('/') && !ref.path.includes('\\') &&
      ref.path.split('/').every(part => part && part !== '.' && part !== '..') && SHA256.test(ref.sha256 || ''), 'safe exact evidence ref required');
    const clean = { path: ref.path, sha256: ref.sha256 };
    assert(!byPath.has(ref.path) || equal(byPath.get(ref.path), clean), 'same evidence path has conflicting bytes');
    byPath.set(ref.path, clean);
  }
  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path, 'en'));
}

// finalizedFields must be copied from the caller's original, authenticated v3
// application. This function never decides a proposal or validates a definition.
// Values omitted from the Native row are only retained below where the original
// production contract has an immutable source fallback.
export function buildFullNativeV3Patch({ nativeRow, reviewedQuestion, committedQuestion, currentQuestion,
  metadata, identity, nativeRef, originalFinalization, reviewedPrimaryContext, finalizedFields,
  targetParentRef, continuityOption, extraEvidenceRefs = [], supportedFields, reason }) {
  assert(nativeRow && metadata && identity && reviewedQuestion && committedQuestion && currentQuestion, 'all original/current inputs required');
  assert(supportedFields instanceof Set && supportedFields.size > 0, 'current production supported-field set required');
  const uid = nativeRow.questionUid, ordinal = nativeRow.sourceOrdinal ?? nativeRow.ordinal;
  assert(/^qid_v1_[a-f0-9]{64}$/.test(uid || '') && Number.isInteger(ordinal) && ordinal > 0, 'exact Native UID/ordinal required');
  for (const rec of [metadata, identity]) assert(rec.questionUid === uid && rec.sourceOrdinal === ordinal, 'current identity binding mismatch');
  assert(metadata.sourceArchiveFile === identity.sourceArchiveFile, 'current source identity mismatch');
  assert(nativeRef && SHA1.test(nativeRef.commit || '') && text(nativeRef.reviewPath || nativeRef.path), 'immutable native ref required');
  assert(originalFinalization?.schemaVersion === 'archive-native-proposal-finalization-v3' &&
    SHA1.test(originalFinalization.finalizationCommit || '') &&
    Array.isArray(originalFinalization.proposalSelections) && originalFinalization.proposalSelections.length > 0,
  'original complete v3 finalization required');
  assert(nativeRow.after && typeof nativeRow.after === 'object' && !Array.isArray(nativeRow.after), 'full Native after required');
  assert(reviewedPrimaryContext && equal(Object.keys(reviewedPrimaryContext).sort(), [...PRIMARY].sort()) &&
    PRIMARY.every(key => text(reviewedPrimaryContext[key])), 'original complete primary context required');
  assert(finalizedFields && typeof finalizedFields === 'object' && !Array.isArray(finalizedFields), 'explicit finalized fields required');
  assert(Object.keys(finalizedFields).every(key => supportedFields.has(key) && !DERIVED.has(key)), 'unsupported finalized field');

  const accepted = clone(nativeRow.after);
  for (const key of DIFFICULTY) if (own(nativeRow.finalDifficulty, key)) {
    assert(!own(accepted, key) || equal(accepted[key], nativeRow.finalDifficulty[key]), 'Native difficulty disagreement: ' + key);
    accepted[key] = clone(nativeRow.finalDifficulty[key]);
  }
  const after = Object.fromEntries(Object.entries(accepted).filter(([key]) => supportedFields.has(key) && !DERIVED.has(key)));
  for (const key of PRIMARY) {
    assert(!own(accepted, key) || equal(accepted[key], reviewedPrimaryContext[key]), 'Native primary context disagreement: ' + key);
    after[key] = clone(reviewedPrimaryContext[key]);
  }
  Object.assign(after, clone(finalizedFields));

  // Retain the original empty auxiliary values only with the same two original
  // source records and the exact production v3 per-field review prerequisite.
  for (const key of ['conditionKeys', 'integrationPattern']) if (!own(after, key) && own(currentQuestion, key)) {
    const fieldReview = key === 'conditionKeys' ? 'condition' : 'integration';
    const value = committedQuestion[key];
    assert(own(committedQuestion, key) && own(reviewedQuestion, key) && equal(value, reviewedQuestion[key]) &&
      equal(value, currentQuestion[key]) && text(nativeRow.fieldReview?.[fieldReview]), 'immutable auxiliary field mismatch: ' + key);
    assert(key === 'conditionKeys' ? Array.isArray(value) && value.length === 0 : ['NONE', 'SEQUENTIAL', 'PARALLEL'].includes(value),
      'auxiliary field is outside the retained v3 contract: ' + key);
    after[key] = clone(value);
  }
  for (const key of ['primaryMethod', 'decisiveStep']) {
    const value = own(accepted, key) ? accepted[key] : text(nativeRow[key]) ? nativeRow[key] : committedQuestion[key];
    assert(text(value), 'immutable Native rationale required: ' + key);
    assert(!own(currentQuestion, key) || equal(currentQuestion[key], value), 'current Native rationale mismatch: ' + key);
    after[key] = value;
  }
  for (const key of RPM) if (own(accepted, key) || own(currentQuestion, key)) {
    const value = own(accepted, key) ? accepted[key] : committedQuestion[key];
    assert(own(accepted, key) || own(committedQuestion, key), 'immutable Native RPM field required: ' + key);
    assert(!own(currentQuestion, key) || equal(value, currentQuestion[key]), 'current Native RPM mismatch: ' + key);
    after[key] = clone(value);
  }
  Object.assign(after, sourceFingerprints(currentQuestion));
  assert(Object.keys(after).every(key => supportedFields.has(key)), 'unsupported complete Native field');
  const before = Object.fromEntries(Object.keys(after).map(key => [key, own(metadata, key) ? clone(metadata[key]) : null]));
  assert(SHA256.test(identity.sourceFingerprint || ''), 'exact current identity fingerprint required');
  const nativeEvidenceRef = { path: nativeRef.evidencePath || nativeRef.path, sha256: nativeRef.sha256 };
  const refs = evidenceRefs([nativeEvidenceRef, originalFinalization.finalizationRef,
    ...(targetParentRef ? [targetParentRef] : []), ...extraEvidenceRefs]);
  const sourceReview = { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: nativeRef.commit,
    reviewPath: nativeRef.reviewPath || nativeRef.path, reviewRef: nativeEvidenceRef,
    proposalFinalization: clone(originalFinalization) };
  if (continuityOption !== undefined) {
    assert(continuityOption && equal(Object.keys(continuityOption).sort(), ['key', 'value']) && text(continuityOption.key) &&
      !own(sourceReview, continuityOption.key), 'one explicit caller-owned continuity option required');
    sourceReview[continuityOption.key] = clone(continuityOption.value);
  }
  assert(text(reason), 'candidate reason required');
  return { questionUid: uid, sourceOrdinal: ordinal, before, after,
    identityBefore: { sourceFingerprint: identity.sourceFingerprint }, sourceReview,
    ...(targetParentRef ? { targetParentRef: clone(targetParentRef) } : {}), reason, evidenceRefs: refs };
}

export function buildFullNativeV3Request({ requestId, sourceArchiveFile, expectedQuestionCount,
  expectedSourceBlobSha1, approvedBy, items, registryChanges = [], extraEvidenceRefs = [] }) {
  assert(/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId || '') && text(sourceArchiveFile) &&
    SHA1.test(expectedSourceBlobSha1 || '') && Number.isInteger(expectedQuestionCount) && expectedQuestionCount > 0 &&
    text(approvedBy) && Array.isArray(items) && items.length > 0 && items.length <= expectedQuestionCount,
  'exact request envelope required');
  assert(new Set(items.map(row => row.questionUid)).size === items.length &&
    new Set(items.map(row => row.sourceOrdinal)).size === items.length &&
    items.every(row => row.sourceOrdinal >= 1 && row.sourceOrdinal <= expectedQuestionCount), 'unique selected UID/ordinal inventory required');
  const refs = evidenceRefs([...items.flatMap(row => row.evidenceRefs), ...extraEvidenceRefs]);
  assert(Array.isArray(registryChanges), 'explicit registry change list required');
  return { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId, sourceArchiveFile,
    scope: 'PARTIAL_UIDS', expectedQuestionCount, expectedSourceBlobSha1,
    approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy, evidenceRefs: refs },
    items: clone(items), registryChanges: clone(registryChanges) };
}
