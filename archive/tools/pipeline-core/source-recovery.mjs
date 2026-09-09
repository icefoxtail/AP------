import { canonicalJson, isObject, nonempty, uidSet, uidSetSha } from './canonical.mjs';

export const SOURCE_RECOVERY_LEDGER_VERSION = 'ALIVE_SOURCE_RECOVERY_LEDGER_v1';
const AUTHORITIES = new Set(['SHADOW_ONLY', 'BOUNDED_PRODUCTION', 'DEFAULT_PRODUCTION']);

const replacementErrors = (item, initial) => {
  const replacement = isObject(item.replacement) ? { ...item, ...item.replacement } : item;
  const errors = [];
  if (!nonempty(item.sourceQuestionUid) || !initial.includes(item.sourceQuestionUid)) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (!nonempty(item.recoveredQuestionUid) || item.recoveredQuestionUid === item.sourceQuestionUid) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (replacement.replacementCardinality !== '1:1') errors.push('DERIVED_REPLACEMENT_CARDINALITY_FAIL');
  if (replacement.sourceOriginalPreserved !== true) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (replacement.productionOriginalActive !== false || replacement.productionRecoveredActive !== true) errors.push('DERIVED_REPLACEMENT_PARITY_FAIL');
  if (replacement.replacementLineageParity !== 'PASS' || replacement.recoveredQualityClosure !== 'PASS') errors.push('DERIVED_REPLACEMENT_PARITY_FAIL');
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
    if ((item.productionRecoveredActive === true || item.productionAdoptionStatus === 'ADOPTED') && item.replacementDisposition !== 'DERIVED_REPLACEMENT_VERIFIED') errors.push('DERIVED_REPLACEMENT_PARITY_FAIL');
    if (item.status === 'RECOVERED' && finalTarget && (item.recoveryAuthority === 'SHADOW_ONLY' || item.productionAdoptionStatus !== 'ADOPTED')) counts.shadowRecoveredUnapprovedCount++;
    if (finalTarget && item.productionAdoptionStatus && item.productionAdoptionStatus !== 'ADOPTED' && !AUTHORITIES.has(item.recoveryAuthority)) counts.unauthorizedRecoveryAdoptionCount++;
    if (item.replacementDisposition === 'DERIVED_REPLACEMENT_VERIFIED' && replacementErrors(item, initial).length) counts.derivedReplacementParityFailCount++;
    if (finalTarget && item.replacementDisposition !== 'DERIVED_REPLACEMENT_VERIFIED') counts.derivedReplacementParityFailCount++;
  }
  if (run) {
    const slots = run.questions?.map(q => q.slotUid || q.questionUid) || [];
    try {
      if (canonicalJson(uidSet(slots)) !== canonicalJson(initial)) errors.push('INITIAL_SCOPE_RUN_UID_SET_MISMATCH');
      for (const item of items.filter(row => row.replacementDisposition === 'DERIVED_REPLACEMENT_VERIFIED')) {
        const matches = (run.questions || []).filter(q => (q.slotUid || q.questionUid) === item.sourceQuestionUid && q.effectiveArtifactUid === item.recoveredQuestionUid);
        if (matches.length !== 1) errors.push('DERIVED_REPLACEMENT_FINAL_TARGET_BINDING');
      }
    } catch { errors.push('INITIAL_SCOPE_RUN_UID_SET_INVALID'); }
  }
  for (const [name, count] of Object.entries(counts)) if (count) errors.push(name.toUpperCase());
  return { schemaVersion: SOURCE_RECOVERY_LEDGER_VERSION, status: errors.length ? 'BLOCKED' : 'PASS', productionSeal: errors.length ? 'BLOCKED' : 'PASS', counts, errors: [...new Set(errors)] };
}
