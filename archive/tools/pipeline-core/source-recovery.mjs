import { canonicalJson, isObject, nonempty, uidSet, uidSetSha } from './canonical.mjs';

export const SOURCE_RECOVERY_LEDGER_VERSION = 'ALIVE_SOURCE_RECOVERY_LEDGER_v1';
const AUTHORITIES = new Set(['SHADOW_ONLY', 'BOUNDED_PRODUCTION', 'DEFAULT_PRODUCTION']);

export function sourceRecoverySignal(run) {
  return Boolean(run?.sourceRecovery || run?.derivedSourceRecovery || run?.questions?.some(q =>
    q.slotUid !== undefined && q.effectiveArtifactUid !== undefined && q.slotUid !== q.effectiveArtifactUid
    || ['replacementDisposition', 'productionRecoveredActive', 'sourceRecoveryStatus', 'sourceRecoveryPolicy', 'sourceRecovery'].some(field => field in q)
  ));
}

const replacementErrors = (item, initial) => {
  const replacement = isObject(item.replacement) ? { ...item, ...item.replacement } : item;
  const errors = [];
  if (!nonempty(item.sourceQuestionUid) || !initial.includes(item.sourceQuestionUid)) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (!nonempty(item.recoveredQuestionUid) || item.recoveredQuestionUid === item.sourceQuestionUid) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (replacement.replacementCardinality !== '1:1') errors.push('DERIVED_REPLACEMENT_CARDINALITY_FAIL');
  if (replacement.sourceOriginalPreserved !== true) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (replacement.productionOriginalActive !== false || replacement.productionRecoveredActive !== true) errors.push('DERIVED_REPLACEMENT_PARITY_FAIL');
  if (replacement.replacementLineageParity !== 'PASS' || replacement.recoveredQualityClosure !== 'PASS') errors.push('DERIVED_REPLACEMENT_PARITY_FAIL');
  if (!nonempty(item.replacementEvidenceRef) || !nonempty(item.replacementEvidenceSha)) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (!AUTHORITIES.has(item.recoveryAuthority) || item.productionAdoptionStatus !== 'ADOPTED') errors.push('SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION');
  return [...new Set(errors)];
};

export function validateSourceRecoveryLedger(ledger, run = null) {
  const errors = [], counts = {
    humanRequiredCount: 0,
    recoveryEvidenceBlockedCount: 0,
    recoveryCapabilityBlockedCount: 0,
    correctnessAffectingPreserveOnlyCount: 0,
    shadowRecoveredUnapprovedCount: 0,
    unauthorizedRecoveryAdoptionCount: 0,
    derivedReplacementParityFailCount: 0,
  };
  let finalTargetSlotUidSet = [], effectiveFinalArtifactMap = {};
  if (!isObject(ledger) || ledger.schemaVersion !== SOURCE_RECOVERY_LEDGER_VERSION) errors.push('SOURCE_RECOVERY_LEDGER_SCHEMA_INVALID');
  let initial = [];
  try {
    initial = uidSet(ledger?.initialIncludedScopeUidSet);
    if (ledger.initialIncludedScopeUidSetSha256 !== uidSetSha(initial)) errors.push('INITIAL_SCOPE_UID_SET_SHA_MISMATCH');
  } catch { errors.push('INITIAL_SCOPE_UID_SET_INVALID'); }
  if (!Array.isArray(ledger?.items)) errors.push('SOURCE_RECOVERY_ITEMS_INVALID');
  const items = Array.isArray(ledger?.items) ? ledger.items : [];
  const sourceIds = new Set(), recoveredIds = new Set();
  for (const item of items) {
    if (!isObject(item)) { errors.push('SOURCE_RECOVERY_ITEM_INVALID'); continue; }
    if (sourceIds.has(item.sourceQuestionUid)) errors.push('DERIVED_REPLACEMENT_CARDINALITY_FAIL');
    sourceIds.add(item.sourceQuestionUid);
    if (item.recoveredQuestionUid) {
      if (recoveredIds.has(item.recoveredQuestionUid)) errors.push('DERIVED_REPLACEMENT_CARDINALITY_FAIL');
      recoveredIds.add(item.recoveredQuestionUid);
    }
    if (item.replacementDisposition === 'DERIVED_REPLACEMENT_VERIFIED') errors.push(...replacementErrors(item, initial));
    if (item.productionOriginalActive === true && item.productionRecoveredActive === true) errors.push('DERIVED_REPLACEMENT_PARITY_FAIL');
    if (item.status === 'HUMAN_REQUIRED') counts.humanRequiredCount++;
    if (item.status === 'SOURCE_RECOVERY_EVIDENCE_BLOCKED') counts.recoveryEvidenceBlockedCount++;
    if (['RECOVERY_CAPABILITY_BLOCKED', 'RECOVERY_DEFERRED_CAPABILITY'].includes(item.status)) counts.recoveryCapabilityBlockedCount++;
    if (item.status === 'PRESERVE_ONLY' && item.correctnessAffecting !== false) counts.correctnessAffectingPreserveOnlyCount++;
    const finalTarget = item.finalTarget === true || item.productionRecoveredActive === true;
    const answerKeyRecovery = item.recoveryDisposition === 'ANSWER_KEY_RECOVERED';
    if ((item.productionRecoveredActive === true || item.productionAdoptionStatus === 'ADOPTED') && item.replacementDisposition !== 'DERIVED_REPLACEMENT_VERIFIED') errors.push('DERIVED_REPLACEMENT_PARITY_FAIL');
    if (item.recoveryDisposition === 'ANSWER_KEY_RECOVERED' && item.finalTarget === true) {
      const resolution = item.answerKeyResolution;
      if (!isObject(resolution) || !nonempty(resolution.effectiveArtifactUid) || !nonempty(resolution.effectiveArtifactSha256) || resolution.lineageStatus !== 'PASS' || !nonempty(resolution.verifierEvidenceSha256)) errors.push('SOURCE_RECOVERY_VALIDATION_FAIL');
    }
    if (item.status === 'RECOVERED' && finalTarget && !answerKeyRecovery && (item.recoveryAuthority === 'SHADOW_ONLY' || item.productionAdoptionStatus !== 'ADOPTED')) counts.shadowRecoveredUnapprovedCount++;
    if (finalTarget && !answerKeyRecovery && item.productionAdoptionStatus && item.productionAdoptionStatus !== 'ADOPTED' && !AUTHORITIES.has(item.recoveryAuthority)) counts.unauthorizedRecoveryAdoptionCount++;
    if (item.replacementDisposition === 'DERIVED_REPLACEMENT_VERIFIED' && replacementErrors(item, initial).length) counts.derivedReplacementParityFailCount++;
    if (finalTarget && !answerKeyRecovery && item.replacementDisposition !== 'DERIVED_REPLACEMENT_VERIFIED') counts.derivedReplacementParityFailCount++;
  }
  if (run) {
    if (sourceRecoverySignal(run) && !ledger) errors.push('SOURCE_RECOVERY_LEDGER_REQUIRED');
    const slots = run.questions?.map(q => q.slotUid || q.questionUid) || [];
    try {
      if (canonicalJson(uidSet(slots)) !== canonicalJson(initial)) errors.push('INITIAL_SCOPE_RUN_UID_SET_MISMATCH');
      const effectiveMap = new Map(), effectiveIds = new Set();
      for (const q of run.questions || []) {
        const slotUid = q.slotUid || q.questionUid;
        const effectiveArtifactUid = q.effectiveArtifactUid || q.questionUid;
        if (effectiveMap.has(slotUid) || effectiveIds.has(effectiveArtifactUid)) errors.push('EFFECTIVE_FINAL_ARTIFACT_MAP_INVALID');
        effectiveMap.set(slotUid, effectiveArtifactUid);
        effectiveIds.add(effectiveArtifactUid);
      }
      finalTargetSlotUidSet = [...effectiveMap.keys()].sort();
      effectiveFinalArtifactMap = Object.fromEntries([...effectiveMap.entries()].sort(([left], [right]) => left.localeCompare(right)));
      for (const item of items.filter(row => row.replacementDisposition === 'DERIVED_REPLACEMENT_VERIFIED')) {
        const matches = (run.questions || []).filter(q => (q.slotUid || q.questionUid) === item.sourceQuestionUid && q.effectiveArtifactUid === item.recoveredQuestionUid);
        if (matches.length !== 1) errors.push('DERIVED_REPLACEMENT_FINAL_TARGET_BINDING');
        if (effectiveMap.get(item.sourceQuestionUid) !== item.recoveredQuestionUid) errors.push('EFFECTIVE_FINAL_ARTIFACT_MAP_MISMATCH');
      }
    } catch { errors.push('INITIAL_SCOPE_RUN_UID_SET_INVALID'); }
  }
  for (const [name, count] of Object.entries(counts)) if (count) errors.push(name.toUpperCase());
  return { schemaVersion: SOURCE_RECOVERY_LEDGER_VERSION, status: errors.length ? 'BLOCKED' : 'PASS', productionSeal: errors.length ? 'BLOCKED' : 'PASS', counts, finalTargetSlotUidSet, effectiveFinalArtifactMap, errors: [...new Set(errors)] };
}
