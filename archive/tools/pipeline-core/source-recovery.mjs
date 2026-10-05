import fs from 'node:fs';
import { canonicalJson, isObject, nonempty, uidSet, uidSetSha, bytesSha, safePath } from './canonical.mjs';

export const SOURCE_RECOVERY_LEDGER_VERSION = 'ALIVE_SOURCE_RECOVERY_LEDGER_v1';
const AUTHORITIES = new Set(['SHADOW_ONLY', 'BOUNDED_PRODUCTION', 'DEFAULT_PRODUCTION']);
const PRODUCTION_AUTHORITIES = new Set(['BOUNDED_PRODUCTION', 'DEFAULT_PRODUCTION']);

const finalSealErrors = (item, root) => {
  if (!root) return [];
  const errors = [];
  if (!nonempty(item.finalArtifactRef) || !/^sha256:[0-9a-f]{64}$/.test(item.finalArtifactSha256 || '')
    || !/^sha256:[0-9a-f]{64}$/.test(item.afterPayloadSha256 || '')
    || !nonempty(item.sourceLockSha256)
    || !/^sha256:[0-9a-f]{64}$/.test(item.initialIncludedScopeUidSetSha256 || '')) {
    errors.push('FINAL_ARTIFACT_BINDING_INVALID');
  } else {
    try {
      const finalPath = safePath(root, item.finalArtifactRef);
      const finalBytes = fs.readFileSync(finalPath);
      if (bytesSha(finalBytes) !== item.finalArtifactSha256) errors.push('FINAL_ARTIFACT_SHA_MISMATCH');
    } catch (error) { errors.push(`FINAL_ARTIFACT_FILE_INVALID:${error.message}`); }
  }
  if (!nonempty(item.replacementEvidenceRef) || !/^sha256:[0-9a-f]{64}$/.test(item.replacementEvidenceSha || '')) {
    errors.push('REPLACEMENT_EVIDENCE_BINDING_INVALID');
  } else {
    try {
      const evidencePath = safePath(root, item.replacementEvidenceRef);
      const evidenceBytes = fs.readFileSync(evidencePath);
      if (bytesSha(evidenceBytes) !== item.replacementEvidenceSha) errors.push('REPLACEMENT_EVIDENCE_SHA_MISMATCH');
      const evidence = JSON.parse(evidenceBytes.toString('utf8'));
      const expected = {
        sourceQuestionUid: item.sourceQuestionUid,
        recoveredQuestionUid: item.recoveredQuestionUid,
        effectiveArtifactUid: item.effectiveArtifactUid,
        candidatePayloadSha256: item.afterPayloadSha256,
        sourceLockSha256: item.sourceLockSha256,
        initialIncludedScopeUidSetSha256: item.initialIncludedScopeUidSetSha256,
        finalArtifactSha256: item.finalArtifactSha256,
        finalArtifactRef: item.finalArtifactRef,
      };
      for (const [field, value] of Object.entries(expected)) {
        if (evidence[field] !== value) errors.push(`REPLACEMENT_EVIDENCE_BINDING_MISMATCH:${field}`);
      }
    } catch (error) { errors.push(`REPLACEMENT_EVIDENCE_FILE_INVALID:${error.message}`); }
  }
  if (!nonempty(item.qualityClosureEvidenceRef) || !/^sha256:[0-9a-f]{64}$/.test(item.qualityClosureEvidenceSha || '')) {
    errors.push('QUALITY_CLOSURE_EVIDENCE_BINDING_INVALID');
  } else {
    try {
      const qualityPath = safePath(root, item.qualityClosureEvidenceRef);
      const qualityBytes = fs.readFileSync(qualityPath);
      if (bytesSha(qualityBytes) !== item.qualityClosureEvidenceSha) errors.push('QUALITY_CLOSURE_EVIDENCE_SHA_MISMATCH');
      const quality = JSON.parse(qualityBytes.toString('utf8'));
      if (quality.status !== 'PASS' || !isObject(quality.qualityGateResults) || Object.values(quality.qualityGateResults).some(status => status !== 'PASS')) errors.push('QUALITY_CLOSURE_EVIDENCE_NOT_PASS');
    } catch (error) { errors.push(`QUALITY_CLOSURE_EVIDENCE_FILE_INVALID:${error.message}`); }
  }
  return [...new Set(errors)];
};
const validExhaustionAttempt = attempt => isObject(attempt)
  && attempt.producerStatus === 'COMPLETED'
  && Number.isSafeInteger(attempt.attemptCount) && attempt.attemptCount >= 1
  && Number.isSafeInteger(attempt.candidateBudget) && attempt.candidateBudget >= 1
  && Number.isSafeInteger(attempt.candidateBudgetConsumed) && attempt.candidateBudgetConsumed === attempt.candidateBudget
  && Number.isSafeInteger(attempt.retryBudget) && attempt.retryBudget >= 0
  && attempt.retryBudgetConsumed === true
  && Number.isSafeInteger(attempt.generatedCandidateCount) && attempt.generatedCandidateCount >= 0
  && nonempty(attempt.attemptEvidenceRef)
  && /^sha256:[0-9a-f]{64}$/.test(attempt.attemptEvidenceSha || '')
  && attempt.allProducedCandidatesRejected === true;

export function sourceRecoverySignal(run) {
  return Boolean(run?.sourceRecoveryLedger || run?.sourceRecoverySignal === true || run?.sourceRecoveryStatus || run?.sourceRecovery || run?.derivedSourceRecovery);
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
  if (!nonempty(item.replacementEvidenceRef) || !/^sha256:[0-9a-f]{64}$/.test(item.replacementEvidenceSha || '')) errors.push('DERIVED_REPLACEMENT_LINEAGE_FAIL');
  if (!PRODUCTION_AUTHORITIES.has(item.recoveryAuthority) || item.productionAdoptionStatus !== 'ADOPTED') errors.push('SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION');
  const scope = item.authorizedScope;
  const scopeSources = Array.isArray(scope?.allowedSourceQuestionUids) ? scope.allowedSourceQuestionUids : [];
  const scopeTiers = Array.isArray(scope?.allowedRecoveryTiers) ? scope.allowedRecoveryTiers : [];
  const scopeDefects = Array.isArray(scope?.defectTypes) ? scope.defectTypes : Array.isArray(scope?.allowedDefectTypes) ? scope.allowedDefectTypes : scope?.defectType ? [scope.defectType] : [];
  if (item.scopeAuthorizationStatus !== 'PASS' || !isObject(scope)
    || (scope.sourceQuestionUid !== item.sourceQuestionUid && !scopeSources.includes(item.sourceQuestionUid))
    || (scope.recoveryTier !== item.recoveryTier && !scopeTiers.includes(item.recoveryTier))
    || !Array.isArray(item.sourceDefectTypes) || item.sourceDefectTypes.some(defect => !scopeDefects.includes(defect))
    || (item.authorizationAuthority || item.recoveryAuthority) !== item.recoveryAuthority) errors.push('SOURCE_RECOVERY_AUTHORIZATION_SCOPE_INVALID');
  return [...new Set(errors)];
};

export function validateSourceRecoveryLedger(ledger, run = null, root = null) {
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
    if (isObject(item.tierMatrix)) {
      for (const [tier, row] of Object.entries(item.tierMatrix)) if (row?.execution === 'ATTEMPTED_EXHAUSTED' && !validExhaustionAttempt(item.producerAttempts?.[tier])) errors.push('RECOVERY_PRODUCER_BUDGET_NOT_EXHAUSTED');
      if (item.status === 'HUMAN_REQUIRED') for (const row of Object.values(item.tierMatrix)) if (row?.applicability !== 'NOT_APPLICABLE' && row?.capability === 'ACTIVE' && row?.execution !== 'ATTEMPTED_EXHAUSTED') errors.push('RECOVERY_HUMAN_REQUIRED_PATH_NOT_EXHAUSTED');
    }
    if (item.status === 'RECOVERED' && finalTarget && !answerKeyRecovery && (item.recoveryAuthority === 'SHADOW_ONLY' || item.productionAdoptionStatus !== 'ADOPTED')) counts.shadowRecoveredUnapprovedCount++;
    if (finalTarget && !answerKeyRecovery && item.productionAdoptionStatus && item.productionAdoptionStatus !== 'ADOPTED' && !PRODUCTION_AUTHORITIES.has(item.recoveryAuthority)) counts.unauthorizedRecoveryAdoptionCount++;
    if (item.replacementDisposition === 'DERIVED_REPLACEMENT_VERIFIED' && replacementErrors(item, initial).length) counts.derivedReplacementParityFailCount++;
    if (finalTarget && !answerKeyRecovery && item.replacementDisposition !== 'DERIVED_REPLACEMENT_VERIFIED') counts.derivedReplacementParityFailCount++;
    if (item.replacementDisposition === 'DERIVED_REPLACEMENT_VERIFIED') errors.push(...finalSealErrors(item, root));
  }
  if (ledger?.events !== undefined || ledger?.latestBySource !== undefined) {
    if (!Array.isArray(ledger.events) || !isObject(ledger.latestBySource)) errors.push('SOURCE_RECOVERY_EVENT_HISTORY_INVALID');
    const events = Array.isArray(ledger.events) ? ledger.events : [];
    const eventIds = new Set(), revisions = new Map();
    for (const event of events) {
      if (!isObject(event) || !nonempty(event.eventId) || !nonempty(event.sourceQuestionUid)
        || !Number.isSafeInteger(event.eventRevision) || event.eventRevision < 1
        || !nonempty(event.evidenceRef) || !/^sha256:[0-9a-f]{64}$/.test(event.evidenceSha256 || '')
        || !/^sha256:[0-9a-f]{64}$/.test(event.recordSha256 || '')) {
        errors.push('SOURCE_RECOVERY_EVENT_INVALID');
        continue;
      }
      if (eventIds.has(event.eventId)) errors.push('SOURCE_RECOVERY_EVENT_ID_DUPLICATE');
      eventIds.add(event.eventId);
      const list = revisions.get(event.sourceQuestionUid) || [];
      list.push(event.eventRevision);
      revisions.set(event.sourceQuestionUid, list);
    }
    for (const [sourceUid, list] of revisions) {
      if (JSON.stringify(list) !== JSON.stringify([...new Set(list)].sort((a, b) => a - b))) errors.push('SOURCE_RECOVERY_EVENT_REVISION_INVALID');
      if (!eventIds.has(ledger.latestBySource?.[sourceUid])) errors.push('SOURCE_RECOVERY_LATEST_POINTER_INVALID');
    }
    for (const item of items) if (ledger.latestBySource?.[item.sourceQuestionUid] && item.eventId !== ledger.latestBySource[item.sourceQuestionUid]) errors.push('SOURCE_RECOVERY_CURRENT_POINTER_MISMATCH');
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
