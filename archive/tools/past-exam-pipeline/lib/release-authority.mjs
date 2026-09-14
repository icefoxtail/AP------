import { randomUUID } from 'node:crypto';
import { HASH_PATTERN, bytesSha, canonicalJson, isObject, nonempty, objectSha, readBoundFile } from '../../pipeline-core/canonical.mjs';
import { assetSetSha, readActualRef } from './production-boundary.mjs';
import { aggregateWorkBatchAudit, freezeInputSha, readWorkBatch, reviewScopeForPurpose, validateWorkBatchEvidence } from '../../pipeline-core/work-batch.mjs';
import { RELEASE_CASES, validateExamReleaseClosure } from '../../pipeline-core/exam-release.mjs';
import { validateQuestionQualityClosureSet } from '../../pipeline-core/question-quality-set.mjs';
import { auditV2Run } from '../../pipeline-core/v2-audit.mjs';
import { evaluateCanonicalAuditOnce } from '../../pipeline-core/canonical-audit-authority.mjs';
import { validateRenderReviewReuseReceipt } from '../../pipeline-core/render-impact.mjs';

export const EXTERNAL_APPROVAL_SCHEMA = 'APMATH_FINAL_EXTERNAL_APPROVAL_v1';
export const FINAL_AUDIT_AUTHORITY_SCHEMA = 'APMATH_FINAL_AUDIT_AUTHORITY_v1';
export const RELEASE_TRANSACTION_VERSION = 'APMATH_APPROVED_RELEASE_TRANSACTION_v1';
export const RELEASE_TRANSACTION_STATES = Object.freeze([
  'REVIEW_READY',
  'EXTERNAL_APPROVED',
  'PROMOTE_APPROVED_EXAM',
  'PROMOTION_PARITY_PASS',
  'REGISTER_APPROVED_EXAM',
  'DB_TARGET_PARITY_PASS',
  'INDEX_REBUILD',
  'INDEX_TARGET_PARITY_PASS',
  'PRODUCTION_SMOKE_RENDER',
  'DONE',
]);

function authorityPayload(authority) {
  const { authoritySha: ignoredAuthoritySha, errors: ignoredErrors, ...payload } = authority || {};
  return payload;
}

function normalizePath(value) {
  return String(value || '').replaceAll('\\', '/');
}

function refKey(ref) {
  return `${normalizePath(ref?.path)}|${ref?.bytes}|${ref?.sha256}`;
}

function sameRef(left, right) {
  return refKey(left) === refKey(right);
}

function readAuthorityRef(root, authority, field, errors, { json = false } = {}) {
  const ref = authority?.[field];
  if (!isObject(ref) || !nonempty(ref.path)) {
    errors.push('FINAL_AUDIT_AUTHORITY_REF_REQUIRED:' + field);
    return null;
  }
  if (!HASH_PATTERN.test(String(ref.sha256 || '')) || !Number.isSafeInteger(ref.bytes) || ref.bytes < 0) {
    errors.push('FINAL_AUDIT_AUTHORITY_REF_INVALID:' + field);
    return null;
  }
  try {
    const bytes = readBoundFile(root, ref);
    if (!json) return { ref, bytes };
    return { ref, bytes, value: JSON.parse(bytes.toString('utf8')) };
  } catch (error) {
    errors.push('FINAL_AUDIT_AUTHORITY_REF_STALE:' + field + ':' + error.message);
    return null;
  }
}

function phaseForAxis(axis) {
  if (['SOURCE', 'MATH_A1', 'V1'].includes(axis)) return 'U1';
  if (axis === 'V2') return 'U2';
  if (['MATH_A2', 'SOLUTION', 'V3', 'RENDER_REVIEW'].includes(axis)) return 'U3';
  return null;
}

function validateFinalAuditPhaseEvidence(root, run, state, launch, receipt, authority, errors) {
  const attestationRows = authority?.phaseAttestationRefs;
  if (!Array.isArray(attestationRows) || attestationRows.length !== 3) {
    errors.push('FINAL_AUDIT_AUTHORITY_PHASE_EVIDENCE_REQUIRED');
    return;
  }
  const byPhase = new Map();
  for (const row of attestationRows) {
    if (!['U1', 'U2', 'U3'].includes(row?.phase) || byPhase.has(row.phase)) {
      errors.push('FINAL_AUDIT_AUTHORITY_PHASE_ATTESTATION_INVALID');
      continue;
    }
    byPhase.set(row.phase, row);
  }
  if (byPhase.size !== 3 || !['U1', 'U2', 'U3'].every(phase => byPhase.has(phase))) {
    errors.push('FINAL_AUDIT_AUTHORITY_PHASE_ATTESTATION_COVERAGE');
  }
  for (const phase of ['U1', 'U2', 'U3']) {
    const row = byPhase.get(phase);
    const sourceLaunchId = row?.launchId || launch.launchId;
    const sourceLaunch = state.launches?.find(item => item.launchId === sourceLaunchId && item.status === 'COMPLETED' && ['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(item.purpose));
    const sourceReceiptRef = row?.providerReceiptRef || sourceLaunch?.providerReceiptRef;
    const sourceReceiptLoaded = sourceReceiptRef ? readAuthorityRef(root, { sourceReceiptRef }, 'sourceReceiptRef', errors, { json: true }) : null;
    const sourceReceipt = sourceReceiptLoaded?.value || (sourceLaunchId === launch.launchId ? receipt : null);
    if (sourceLaunch && sourceReceiptRef && !sameRef(sourceReceiptRef, sourceLaunch.providerReceiptRef)) errors.push('FINAL_AUDIT_AUTHORITY_PHASE_RECEIPT_BINDING:' + phase);
    const receiptAttestations = Array.isArray(sourceReceipt?.phaseAttestationRefs) ? sourceReceipt.phaseAttestationRefs : [];
    const receiptRow = receiptAttestations.find(candidate => candidate?.phase === phase);
    if (!sourceLaunch || !sourceReceipt || sourceReceipt.status !== 'COMPLETED') errors.push('FINAL_AUDIT_AUTHORITY_PHASE_SOURCE_LAUNCH_INVALID:' + phase);
    if (!row || !receiptRow || !sameRef(row.requestRef, receiptRow.requestRef) || !sameRef(row.responseRef, receiptRow.responseRef)) {
      errors.push('FINAL_AUDIT_AUTHORITY_PHASE_ATTESTATION_BINDING:' + phase);
      continue;
    }
    const requestLoaded = readAuthorityRef(root, { requestRef: row.requestRef }, 'requestRef', errors, { json: true });
    const responseLoaded = readAuthorityRef(root, { responseRef: row.responseRef }, 'responseRef', errors, { json: true });
    const request = requestLoaded?.value;
    const response = responseLoaded?.value;
    if (!request || !response) continue;
    const { inputSha: ignoredInputSha, ...requestBody } = request;
    if (request.inputSha !== objectSha(requestBody) || request.phase !== phase || request.logicalLaunchId !== sourceLaunch?.launchId || request.externalTaskId !== sourceLaunch?.externalId) errors.push('FINAL_AUDIT_AUTHORITY_REQUEST_BINDING:' + phase);
    if (response.schemaVersion !== request.schemaVersion || response.operation !== request.operation || response.status !== 'COMPLETED' || response.inputSha !== request.inputSha || response.phase !== phase || response.externalTaskId !== sourceLaunch?.externalId || response.sessionId !== sourceLaunch?.contexts?.[phase]?.sessionId || response.contextId !== sourceLaunch?.contexts?.[phase]?.contextId || !nonempty(response.providerInvocationId)) errors.push('FINAL_AUDIT_AUTHORITY_RESPONSE_BINDING:' + phase);
    if (row.inputSha && row.inputSha !== request.inputSha) errors.push('FINAL_AUDIT_AUTHORITY_PHASE_INPUT_SHA_MISMATCH:' + phase);
  }

  const phaseEvidenceRows = Array.isArray(authority?.phaseEvidenceRefs) ? authority.phaseEvidenceRefs : [];
  if (phaseEvidenceRows.length !== 3) errors.push('FINAL_AUDIT_AUTHORITY_PHASE_RESPONSE_EVIDENCE_REQUIRED');
  for (const phase of ['U1', 'U2', 'U3']) {
    const row = phaseEvidenceRows.find(candidate => candidate?.phase === phase);
    if (!row || !Array.isArray(row.evidenceRefs) || row.evidenceRefs.length === 0) {
      errors.push('FINAL_AUDIT_AUTHORITY_PHASE_RESPONSE_EVIDENCE_MISSING:' + phase);
      continue;
    }
    const sourceLaunch = state.launches?.find(item => item.launchId === (row.launchId || launch.launchId) && item.status === 'COMPLETED' && ['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(item.purpose));
    if (sourceLaunch && row.providerReceiptRef && !sameRef(row.providerReceiptRef, sourceLaunch.providerReceiptRef)) errors.push('FINAL_AUDIT_AUTHORITY_PHASE_RECEIPT_BINDING:' + phase);
    const sourceReceipt = sourceLaunch?.launchId === launch.launchId ? receipt : sourceLaunch?.providerReceiptRef ? readAuthorityRef(root, { sourceReceiptRef: sourceLaunch.providerReceiptRef }, 'sourceReceiptRef', errors, { json: true })?.value : null;
    const receiptEvidence = [...(sourceReceipt?.evidenceRefs || []), ...(sourceReceipt?.reusedEvidenceRefs || [])];
    if (!sourceReceipt || sourceReceipt.status !== 'COMPLETED') errors.push('FINAL_AUDIT_AUTHORITY_PHASE_RECEIPT_INVALID:' + phase);
    const sourceFreeze = state.freezes?.find(item => item.freezeSha === sourceLaunch?.freezeSha);
    let sourceRun = null;
    for (const sourceRunRef of sourceFreeze?.runRefs || []) {
      const loaded = readAuthorityRef(root, { sourceRunRef }, 'sourceRunRef', errors, { json: true });
      if (loaded?.value?.runId === sourceLaunch?.scope?.[0]?.runId || loaded?.value?.runId === run.runId) { sourceRun = loaded.value; break; }
    }
    for (const evidenceRef of row.evidenceRefs) {
      if (!receiptEvidence.some(candidate => sameRef(candidate, evidenceRef))) {
        errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_OUTPUT_BINDING:' + phase);
        continue;
      }
      const loaded = readAuthorityRef(root, { evidenceRef }, 'evidenceRef', errors, { json: true });
      const evidence = loaded?.value;
      if (!evidence) continue;
      const reusedOutput = sourceReceipt?.reusedEvidenceRefs?.some(candidate => sameRef(candidate, evidenceRef));
      if (phaseForAxis(evidence.axis) !== phase || evidence.runId !== (sourceRun?.runId || run.runId) || evidence.status !== 'PASS' || !reusedOutput && sourceLaunch && (evidence.launchId !== sourceLaunch.launchId || evidence.externalTaskId !== sourceLaunch.externalId)) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_BINDING:' + phase);
      else if (sourceRun && (evidence.revision !== sourceRun.revision || evidence.inputSha !== sourceRun.inputSha)) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_RUN_BINDING:' + phase);
      else if (!reusedOutput && run.evidence?.some(candidate => sameRef(candidate, evidenceRef))) errors.push(...validateWorkBatchEvidence(root, run, evidence));
    }
  }
}

function requiredAuthorityPairs(freeze, runId) {
  return (freeze?.bindings || [])
    .filter(binding => binding.runId === runId)
    .flatMap(binding => (binding.questions || []).flatMap(question => Object.entries(binding.axisInputShas?.[question.questionUid] || {}).map(([axis, axisInputSha]) => ({ questionUid: question.questionUid, axis, axisInputSha }))));
}

function evidenceQuestionMatches(evidence, questionUid, axis) {
  if (evidence?.axis !== axis) return false;
  if (evidence.questionUid === questionUid) return true;
  return ['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(axis) && evidence.payload?.questionUids?.includes(questionUid);
}

function evidenceAxisInputSha(evidence, questionUid, axis) {
  return ['RENDER_CAPTURE', 'RENDER_REVIEW'].includes(axis)
    ? evidence?.axisInputShas?.[questionUid] || null
    : evidence?.axisInputSha || null;
}

function collectAuthorityEvidence(root, run, state, authority, launch, receipt, errors) {
  const entries = new Map();
  const add = (ref, { runEvidence = false, reuseReceipt = null, renderReuseReceipt = null, phaseEvidenceDeclaration = null } = {}) => {
    if (!isObject(ref) || !nonempty(ref.path)) return null;
    const key = refKey(ref);
    let entry = entries.get(key);
    if (!entry) {
      const loaded = readAuthorityRef(root, { evidenceRef: ref }, 'evidenceRef', errors, { json: true });
      if (!loaded) return null;
      entry = { ref: loaded.ref, evidence: loaded.value, runEvidence: false, reuseReceipts: [], renderReuseReceipts: [], phaseEvidenceDeclarations: [] };
      entries.set(key, entry);
    }
    entry.runEvidence ||= runEvidence;
    if (reuseReceipt && !entry.reuseReceipts.some(item => item.ref && sameRef(item.ref, reuseReceipt.ref))) entry.reuseReceipts.push(reuseReceipt);
    if (renderReuseReceipt && !entry.renderReuseReceipts.some(item => item.ref && sameRef(item.ref, renderReuseReceipt.ref))) entry.renderReuseReceipts.push(renderReuseReceipt);
    if (phaseEvidenceDeclaration && !entry.phaseEvidenceDeclarations.some(item => item.phase === phaseEvidenceDeclaration.phase && item.sourceLaunch?.launchId === phaseEvidenceDeclaration.sourceLaunch?.launchId && item.providerReceipt?.ref && sameRef(item.providerReceipt.ref, phaseEvidenceDeclaration.providerReceipt?.ref))) entry.phaseEvidenceDeclarations.push(phaseEvidenceDeclaration);
    return entry;
  };
  const addReceipt = (receiptRef, sourceLaunch = null) => {
    if (!isObject(receiptRef)) return null;
    const loaded = readAuthorityRef(root, { receiptRef }, 'receiptRef', errors, { json: true });
    if (!loaded) return null;
    const providerReceipt = { ref: loaded.ref, value: loaded.value, launch: sourceLaunch };
    for (const ref of loaded.value?.evidenceRefs || []) add(ref);
    for (const ref of loaded.value?.reusedEvidenceRefs || []) add(ref);
    return providerReceipt;
  };
  for (const ref of run.evidence || []) add(ref, { runEvidence: true });
  addReceipt(authority.providerReceiptRef, launch);
  for (const row of authority.phaseEvidenceRefs || []) {
    const sourceLaunch = state.launches?.find(item => item.launchId === (row.launchId || launch?.launchId) && item.status === 'COMPLETED' && ['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(item.purpose)) || null;
    const sourceReceiptRef = row.providerReceiptRef || sourceLaunch?.providerReceiptRef || (sourceLaunch?.launchId === launch?.launchId ? authority.providerReceiptRef : null);
    const providerReceipt = sourceReceiptRef ? addReceipt(sourceReceiptRef, sourceLaunch) : null;
    for (const ref of row.evidenceRefs || []) add(ref, { phaseEvidenceDeclaration: { phase: row.phase, sourceLaunch, providerReceipt } });
  }
  for (const ref of run.reuseReceipts || []) {
    const loaded = readAuthorityRef(root, { reuseReceiptRef: ref }, 'reuseReceiptRef', errors, { json: true });
    if (!loaded) continue;
    const reuseReceipt = { ref: loaded.ref, value: loaded.value };
    add(loaded.value.rootFreshEvidenceRef, { reuseReceipt });
  }
  for (const ref of run.renderReviewReuseReceiptRefs || []) {
    const loaded = readAuthorityRef(root, { renderReuseReceiptRef: ref }, 'renderReuseReceiptRef', errors, { json: true });
    if (!loaded) continue;
    const renderReuseReceipt = { ref: loaded.ref, value: loaded.value };
    add(loaded.value.rootFreshReviewRef, { renderReuseReceipt });
  }
  const evidenceById = new Map();
  for (const entry of entries.values()) {
    const previous = evidenceById.get(entry.evidence.evidenceId);
    if (previous && !sameRef(previous.ref, entry.ref)) errors.push('FINAL_AUDIT_AUTHORITY_DUPLICATE_EVIDENCE_ID:' + entry.evidence.evidenceId);
    else evidenceById.set(entry.evidence.evidenceId, entry);
  }
  return [...entries.values()];
}

function validateFinalAuditEvidenceCoverage(root, run, state, freeze, authority, launch, receipt, audit, errors) {
  const requiredPairs = requiredAuthorityPairs(freeze, run.runId);
  const requiredKeys = new Set(requiredPairs.map(pair => `${pair.questionUid}\u0000${pair.axis}`));
  if (!requiredPairs.length || requiredKeys.size !== requiredPairs.length) errors.push('FINAL_AUDIT_AUTHORITY_REQUIRED_UID_AXIS_COVERAGE_INVALID');
  const evidenceEntries = collectAuthorityEvidence(root, run, state, authority, launch, receipt, errors);
  const freshness = Array.isArray(audit?.freshness) ? audit.freshness : [];
  if (!freshness.length) {
    errors.push('FINAL_AUDIT_AUTHORITY_FRESHNESS_REQUIRED');
    return { requiredPairs, evidenceEntries };
  }
  const seenFreshness = new Set();
  for (const pair of requiredPairs) {
    const pairKeyValue = `${pair.questionUid}\u0000${pair.axis}`;
    const rows = freshness.filter(row => row?.questionUid === pair.questionUid && row?.axis === pair.axis);
    if (rows.length !== 1 || rows[0]?.status !== 'PASS') {
      errors.push('FINAL_AUDIT_AUTHORITY_FRESHNESS_BINDING:' + pair.axis);
      continue;
    }
    seenFreshness.add(pairKeyValue);
    const row = rows[0];
    const candidates = evidenceEntries.filter(entry => evidenceQuestionMatches(entry.evidence, pair.questionUid, pair.axis) && evidenceAxisInputSha(entry.evidence, pair.questionUid, pair.axis) === pair.axisInputSha);
    if (!candidates.length) {
      errors.push('FINAL_AUDIT_AUTHORITY_CANONICAL_EVIDENCE_REQUIRED:' + pair.questionUid + ':' + pair.axis);
      continue;
    }
    // Render evidence is case-scoped: one UID×axis can have one canonical
    // evidence ref per required render case. The freshness row must still
    // name and hash one of those actual refs; a synthetic row cannot stand in
    // for the case evidence set.
    const matched = candidates.filter(entry => entry.evidence.evidenceId === row.evidenceId && entry.ref.sha256 === row.evidenceSha);
    if (matched.length !== 1) {
      errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_IDENTITY_MISMATCH:' + pair.questionUid + ':' + pair.axis);
      continue;
    }
    const entry = matched[0];
    const evidence = entry.evidence;
    const actualAxisSha = evidenceAxisInputSha(evidence, pair.questionUid, pair.axis);
    const machineEvidenceWithoutValidity = evidence.mode === 'MACHINE_CURRENT' && ['STATIC', 'METADATA'].includes(pair.axis) && evidence.validityStatus === undefined;
    if (evidence.status !== 'PASS' || (!machineEvidenceWithoutValidity && !['FROZEN', 'VALID'].includes(evidence.validityStatus))) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_NOT_PASS:' + pair.questionUid + ':' + pair.axis);
    if (row.mode !== 'REUSED' && row.mode !== evidence.mode) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_MODE_MISMATCH:' + pair.questionUid + ':' + pair.axis);
    if (row.evidenceId !== evidence.evidenceId || row.evidenceSha !== entry.ref.sha256 || row.questionUid !== pair.questionUid || row.axis !== pair.axis || row.axisInputSha !== pair.axisInputSha || actualAxisSha !== pair.axisInputSha) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_IDENTITY_MISMATCH:' + pair.questionUid + ':' + pair.axis);
    if (row.evidenceSha !== entry.ref.sha256 || !HASH_PATTERN.test(String(row.evidenceSha || ''))) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_SHA_MISMATCH:' + pair.questionUid + ':' + pair.axis);
    if ((row.runId !== undefined && row.runId !== evidence.runId) || (row.revision !== undefined && row.revision !== evidence.revision) || (row.inputSha !== undefined && row.inputSha !== evidence.inputSha)) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_LINEAGE_MISMATCH:' + pair.questionUid + ':' + pair.axis);
    if (row.mode === 'REUSED') {
      const reuse = entry.reuseReceipts.find(item => item.value?.questionUid === pair.questionUid && item.value?.axis === pair.axis && item.value?.currentRunId === run.runId && item.value?.currentRevision === run.revision && item.value?.currentRunInputSha === run.inputSha && item.value?.currentAxisInputSha === pair.axisInputSha && item.value?.rootFreshEvidenceId === evidence.evidenceId && item.value?.rootFreshEvidenceSha === entry.ref.sha256);
      const renderReuse = entry.renderReuseReceipts.find(item => item.value?.schemaVersion === 'RENDER_REVIEW_REUSE_RECEIPT_v1' && item.value?.status === 'PASS' && item.value?.currentRunInputSha === run.inputSha && sameRef(item.value.rootFreshReviewRef, entry.ref) && item.value.currentCaptureRef && run.evidence?.some(ref => sameRef(ref, item.value.currentCaptureRef)) && row.receiptSha === objectSha(item.value));
      let renderReuseErrors = [];
      if (renderReuse) renderReuseErrors = validateRenderReviewReuseReceipt(root, renderReuse.value, { currentCaptureRef: renderReuse.value.currentCaptureRef, currentRunInputSha: run.inputSha }).errors;
      if ((!reuse && !renderReuse) || reuse && (reuse.value.schemaVersion !== 'APMATH_EVIDENCE_REUSE_RECEIPT_v1' || reuse.value.status !== 'PASS' || !sameRef(reuse.value.rootFreshEvidenceRef, entry.ref) || reuse.value.priorEvidenceId !== evidence.evidenceId || reuse.value.priorEvidenceSha !== entry.ref.sha256 || reuse.value.rootFreshRunId !== evidence.runId || reuse.value.rootFreshRunInputSha !== evidence.inputSha || reuse.value.rootFreshAxisInputSha !== actualAxisSha || row.receiptSha !== objectSha(reuse.value)) || renderReuseErrors.length) errors.push('FINAL_AUDIT_AUTHORITY_REUSE_LINEAGE_MISMATCH:' + pair.questionUid + ':' + pair.axis);
    } else {
      const machine = ['STATIC', 'METADATA', 'RENDER_CAPTURE'].includes(pair.axis) && evidence.mode === 'MACHINE_CURRENT' && entry.runEvidence;
      const provider = entry.phaseEvidenceDeclarations.some(declaration => declaration.sourceLaunch?.status === 'COMPLETED' && declaration.providerReceipt?.value?.status === 'COMPLETED' && phaseForAxis(evidence.axis) === declaration.phase && [...(declaration.providerReceipt.value.evidenceRefs || []), ...(declaration.providerReceipt.value.reusedEvidenceRefs || [])].some(ref => sameRef(ref, entry.ref)));
      if (evidence.runId !== run.runId || evidence.revision !== run.revision || evidence.inputSha !== run.inputSha) errors.push('FINAL_AUDIT_AUTHORITY_EVIDENCE_RUN_BINDING:' + pair.questionUid + ':' + pair.axis);
      const renderer = entry.runEvidence && pair.axis === 'RENDER_REVIEW';
      if (!machine && !provider && !renderer) errors.push('FINAL_AUDIT_AUTHORITY_PROVIDER_OUTPUT_LINEAGE_REQUIRED:' + pair.questionUid + ':' + pair.axis);
    }
  }
  if (seenFreshness.size !== new Set(requiredPairs.map(pair => `${pair.questionUid}\u0000${pair.axis}`)).size || freshness.some(row => !requiredPairs.some(pair => pair.questionUid === row?.questionUid && pair.axis === row?.axis))) errors.push('FINAL_AUDIT_AUTHORITY_FRESHNESS_SCOPE_INVALID');
  return { requiredPairs, evidenceEntries };
}

export function validateCanonicalFinalAuditAuthority(root, { authority, expected = {} } = {}) {
  const errors = [];
  if (!isObject(authority)) errors.push('FINAL_AUDIT_AUTHORITY_REQUIRED');
  if (authority?.schemaVersion !== FINAL_AUDIT_AUTHORITY_SCHEMA) errors.push('FINAL_AUDIT_AUTHORITY_SCHEMA_INVALID');
  if (authority?.status !== 'PASS') errors.push('FINAL_AUDIT_AUTHORITY_NOT_PASS');
  for (const field of ['examId', 'workBatchId', 'runId', 'launchId', 'freezeSha', 'finalAuditRef', 'canonicalClosureRef', 'candidateRef']) {
    if (!nonempty(authority?.[field]) && !(isObject(authority?.[field]) && nonempty(authority[field]?.path))) errors.push('FINAL_AUDIT_AUTHORITY_FIELD_REQUIRED:' + field);
  }
  if (!Number.isSafeInteger(authority?.revision) || authority.revision < 1) errors.push('FINAL_AUDIT_AUTHORITY_REVISION_REQUIRED');
  for (const field of ['freezeSha', 'inputSha', 'candidateSha256', 'assetSetSha256', 'authoritySha']) {
    if (!HASH_PATTERN.test(String(authority?.[field] || ''))) errors.push('FINAL_AUDIT_AUTHORITY_SHA_REQUIRED:' + field);
  }
  if (expected.examId && authority?.examId !== expected.examId) errors.push('FINAL_AUDIT_AUTHORITY_EXAM_ID_MISMATCH');
  if (expected.runId && authority?.runId !== expected.runId) errors.push('FINAL_AUDIT_AUTHORITY_RUN_ID_MISMATCH');
  if (expected.revision !== undefined && authority?.revision !== expected.revision) errors.push('FINAL_AUDIT_AUTHORITY_REVISION_MISMATCH');
  if (expected.inputSha && authority?.inputSha !== expected.inputSha) errors.push('FINAL_AUDIT_AUTHORITY_INPUT_SHA_MISMATCH');
  if (expected.candidateSha256 && authority?.candidateSha256 !== expected.candidateSha256) errors.push('FINAL_AUDIT_AUTHORITY_CANDIDATE_SHA_MISMATCH');
  if (authority?.authoritySha && authority.authoritySha !== objectSha(authorityPayload(authority))) errors.push('FINAL_AUDIT_AUTHORITY_SHA_MISMATCH');
  if (!Array.isArray(authority?.assetRefs)) errors.push('FINAL_AUDIT_AUTHORITY_ASSET_REFS_REQUIRED');
  if (!Array.isArray(authority?.phaseAttestationRefs) || authority.phaseAttestationRefs.length !== 3) errors.push('FINAL_AUDIT_AUTHORITY_PHASE_EVIDENCE_REQUIRED');
  if (!Array.isArray(authority?.phaseEvidenceRefs) || authority.phaseEvidenceRefs.length !== 3) errors.push('FINAL_AUDIT_AUTHORITY_PHASE_RESPONSE_EVIDENCE_REQUIRED');
  if (root && isObject(authority)) {
    for (const field of ['workBatchRef', 'runRef', 'providerReceiptRef', 'finalAuditRef', 'canonicalClosureRef', 'candidateRef']) {
      const ref = authority[field];
      if (!isObject(ref) || !nonempty(ref.path)) errors.push('FINAL_AUDIT_AUTHORITY_REF_REQUIRED:' + field);
      else if (!HASH_PATTERN.test(String(ref.sha256 || '')) || !Number.isSafeInteger(ref.bytes)) errors.push('FINAL_AUDIT_AUTHORITY_REF_INVALID:' + field);
    }
    try {
      const workBatchLoaded = readAuthorityRef(root, authority, 'workBatchRef', errors, { json: true });
      const runLoaded = readAuthorityRef(root, authority, 'runRef', errors, { json: true });
      const receiptLoaded = readAuthorityRef(root, authority, 'providerReceiptRef', errors, { json: true });
      const auditLoaded = readAuthorityRef(root, authority, 'finalAuditRef', errors, { json: true });
      const closureLoaded = readAuthorityRef(root, authority, 'canonicalClosureRef', errors, { json: true });
      const candidateLoaded = readAuthorityRef(root, authority, 'candidateRef', errors);
      const statePath = `alive/runtime/work-batches/${authority.workBatchId}/state.json`;
      if (normalizePath(authority.workBatchRef?.path) !== statePath) errors.push('FINAL_AUDIT_AUTHORITY_WORK_BATCH_REF_PATH_INVALID');
      if (!workBatchLoaded || !runLoaded || !receiptLoaded || !auditLoaded || !closureLoaded || !candidateLoaded) return { status: 'FAIL', errors: [...new Set(errors)], binding: null };
      const state = readWorkBatch(root, authority.workBatchId);
      const run = runLoaded.value;
      const receipt = receiptLoaded.value;
      const audit = auditLoaded.value;
      const closure = closureLoaded.value;
      if (state.workBatchId !== authority.workBatchId || !state.runIds?.includes(authority.runId)) errors.push('FINAL_AUDIT_AUTHORITY_WORK_BATCH_IDENTITY_INVALID');
      const freeze = state.freezes?.find(item => item.freezeSha === authority.freezeSha) || state.freezes?.at(-1);
      if (!freeze || freeze.freezeSha !== authority.freezeSha || freezeInputSha(freeze) !== authority.inputSha) errors.push('FINAL_AUDIT_AUTHORITY_FREEZE_BINDING_INVALID');
      const binding = freeze?.bindings?.find(item => item.runId === authority.runId);
      if (!binding || binding.revision !== authority.revision || binding.inputSha !== authority.inputSha) errors.push('FINAL_AUDIT_AUTHORITY_RUN_BINDING_INVALID');
      if (run.workBatchId !== authority.workBatchId || run.runId !== authority.runId || run.revision !== authority.revision || run.inputSha !== authority.inputSha) errors.push('FINAL_AUDIT_AUTHORITY_RUN_LINEAGE_INVALID');
      if (refKey(runLoaded.ref) !== refKey(authority.runRef)) errors.push('FINAL_AUDIT_AUTHORITY_RUN_REF_BINDING_INVALID');
      if (authority.examId !== (run.examId || run.sourceExamId || run.questions?.[0]?.examId || run.questions?.[0]?.sourceExamId)) errors.push('FINAL_AUDIT_AUTHORITY_EXAM_ID_MISMATCH');
      const actualCandidate = { path: authority.candidateRef.path, bytes: candidateLoaded.bytes.length, sha256: bytesSha(candidateLoaded.bytes) };
      if (actualCandidate.sha256 !== authority.candidateSha256 || expected.candidateSha256 && actualCandidate.sha256 !== expected.candidateSha256) errors.push('FINAL_AUDIT_AUTHORITY_CANDIDATE_SHA_MISMATCH');
      const runCandidate = run.inputs?.find(ref => ref.role === 'candidate');
      if (!runCandidate || !sameRef(runCandidate, authority.candidateRef)) errors.push('FINAL_AUDIT_AUTHORITY_CANDIDATE_REF_BINDING_INVALID');
      const actualAssets = [];
      for (const [index, ref] of (authority.assetRefs || []).entries()) {
        try {
          const actual = readActualRef(root, ref);
          actualAssets.push(actual);
          if (!sameRef(actual, ref)) errors.push('FINAL_AUDIT_AUTHORITY_ASSET_REF_STALE:' + index);
        } catch (error) { errors.push('FINAL_AUDIT_AUTHORITY_ASSET_REF_INVALID:' + index + ':' + error.message); }
      }
      if (assetSetSha(actualAssets) !== authority.assetSetSha256 || expected.assetSetSha256 && assetSetSha(actualAssets) !== expected.assetSetSha256) errors.push('FINAL_AUDIT_AUTHORITY_ASSET_SET_SHA_MISMATCH');
      const finalAuditLaunches = state.launches?.filter(item => item.purpose === 'FINAL_AUDIT' && item.executionRecovery !== true && item.status === 'COMPLETED') || [];
      const reviewLaunches = state.launches?.filter(item => ['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(item.purpose) && item.executionRecovery !== true && item.status === 'COMPLETED') || [];
      const launch = reviewLaunches.find(item => item.launchId === authority.launchId);
      if (finalAuditLaunches.length !== 1 || !launch) errors.push('FINAL_AUDIT_AUTHORITY_FINAL_AUDIT_LAUNCH_INVALID');
      if (launch && (launch.freezeSha !== authority.freezeSha || launch.inputSha !== authority.inputSha || launch.externalId !== receipt.externalId || !Array.isArray(launch.scope) || canonicalJson(launch.scope) !== canonicalJson(reviewScopeForPurpose(state, freeze, launch.purpose)))) errors.push('FINAL_AUDIT_AUTHORITY_LAUNCH_LINEAGE_INVALID');
      if (!sameRef(launch?.providerReceiptRef, authority.providerReceiptRef) || receipt.status !== 'COMPLETED' || receipt.launchId !== authority.launchId || receipt.externalId !== launch?.externalId || (receipt.defects || []).length !== 0) errors.push('FINAL_AUDIT_AUTHORITY_PROVIDER_RECEIPT_INVALID');
      if (launch && receipt) validateFinalAuditPhaseEvidence(root, run, state, launch, receipt, authority, errors);
      if (audit.schemaVersion !== 'APMATH_PIPELINE_AUDIT_v2' || audit.status !== 'PASS' || audit.productionAuthorized !== false || (audit.workBatchId !== undefined && audit.workBatchId !== authority.workBatchId) || audit.runId !== run.runId || audit.revision !== run.revision || audit.inputSha !== run.inputSha) errors.push('FINAL_AUDIT_AUTHORITY_REPORT_INVALID');
      const coverage = validateFinalAuditEvidenceCoverage(root, run, state, freeze, authority, launch, receipt, audit, errors);
      let canonicalAudit = null;
      if (run.schemaVersion !== 'APMATH_PIPELINE_RUN_v2') errors.push('FINAL_AUDIT_AUTHORITY_RUN_V2_REQUIRED');
      if (!isObject(run.sourceAuthority)) errors.push('FINAL_AUDIT_AUTHORITY_SOURCE_AUTHORITY_REQUIRED');
      if (!isObject(run.uidAuthority)) errors.push('FINAL_AUDIT_AUTHORITY_UID_AUTHORITY_REQUIRED');
      if (!isObject(run.questionQualityClosureSetRef) || !nonempty(run.questionQualityClosureSetRef.path)) errors.push('FINAL_AUDIT_AUTHORITY_QUALITY_CLOSURE_REF_REQUIRED');
      try {
        const snapshotLoaded = authority.canonicalAuditSnapshotRef ? readAuthorityRef(root, authority, 'canonicalAuditSnapshotRef', errors, { json: true }) : null;
        const evaluated = evaluateCanonicalAuditOnce(root, run, { snapshotRef: snapshotLoaded?.ref || null, authority, evaluator: auditV2Run });
        canonicalAudit = evaluated.audit;
        if (canonicalJson(canonicalAudit) !== canonicalJson(audit)) errors.push('FINAL_AUDIT_AUTHORITY_CANONICAL_AUDIT_PARITY_INVALID');
        if (canonicalAudit.status !== 'PASS') errors.push('FINAL_AUDIT_AUTHORITY_CANONICAL_AUDIT_NOT_PASS');
      } catch (error) {
        errors.push('FINAL_AUDIT_AUTHORITY_CANONICAL_AUDIT_ERROR:' + error.message);
      }
      const qualitySha = closure?.qualityClosureSetSha;
      if (!HASH_PATTERN.test(String(qualitySha || ''))) errors.push('FINAL_AUDIT_AUTHORITY_QUALITY_CLOSURE_SHA_REQUIRED');
      if (!HASH_PATTERN.test(String(audit.closureSetSha || '')) || audit.closureSetSha !== qualitySha) errors.push('FINAL_AUDIT_AUTHORITY_AUDIT_CLOSURE_SHA_BINDING_INVALID');
      const qualityRef = run.questionQualityClosureSetRef;
      let quality = null;
      if (!isObject(qualityRef) || !nonempty(qualityRef.path)) errors.push('FINAL_AUDIT_AUTHORITY_QUALITY_CLOSURE_REF_REQUIRED');
      else {
        const qualityLoaded = readAuthorityRef(root, { qualityRef }, 'qualityRef', errors, { json: true });
        quality = qualityLoaded?.value || null;
        if (quality && quality.closureSetSha !== qualitySha) errors.push('FINAL_AUDIT_AUTHORITY_QUALITY_CLOSURE_SHA_MISMATCH');
        if (quality) {
          const requiredAxesByUid = (coverage.requiredPairs || []).reduce((map, pair) => { (map[pair.questionUid] ||= []).push(pair.axis); return map; }, {});
          const qualityValidation = validateQuestionQualityClosureSet(quality, { runId: run.runId, revision: run.revision, currentRunInputSha: run.inputSha, questionUids: [...new Set((coverage.requiredPairs || []).map(pair => pair.questionUid))], requiredAxesByUid, freshness: audit.freshness });
          errors.push(...qualityValidation.errors.map(error => 'FINAL_AUDIT_AUTHORITY_QUALITY_CLOSURE:' + error));
        }
      }
      const closureEvidence = new Map((coverage.evidenceEntries || []).map(entry => [entry.evidence.evidenceId, entry.evidence]));
      const closureEvidenceRefs = new Map((coverage.evidenceEntries || []).map(entry => [entry.evidence.evidenceId, entry.ref]));
      const closureValidation = validateExamReleaseClosure(closure, { root, run, evidence: closureEvidence, evidenceRefs: closureEvidenceRefs, qualityClosureSetSha: qualitySha });
      errors.push(...closureValidation.errors.map(error => 'FINAL_AUDIT_AUTHORITY_CANONICAL_CLOSURE:' + error));
      const aggregate = aggregateWorkBatchAudit(root, state, [run], [canonicalAudit || audit]);
      if (aggregate.status !== 'PASS' || aggregate.workBatchId !== authority.workBatchId || aggregate.productionAuthorized !== false) errors.push('FINAL_AUDIT_AUTHORITY_AGGREGATE_NOT_PASS');
      const closureSha = objectSha(Object.fromEntries(Object.entries(closure || {}).filter(([key]) => !['closureSha', 'errors'].includes(key))));
      const actualCases = Array.isArray(closure.actualCases) ? closure.actualCases : [];
      const closureCases = Array.isArray(closure.cases) ? closure.cases : [];
      if (closure.schemaVersion !== 'APMATH_EXAM_RELEASE_CLOSURE_v1' || closure.applicability !== 'REQUIRED' || closure.status !== 'PASS' || closure.productionAuthorized !== false || closure.runId !== run.runId || closure.revision !== run.revision || closure.currentRunInputSha !== run.inputSha || closureSha !== closure.closureSha || !sameRef(authority.canonicalClosureRef, run.examReleaseClosureRef) || canonicalJson(closure.requiredCases || []) !== canonicalJson([...RELEASE_CASES]) || actualCases.length !== RELEASE_CASES.length || canonicalJson([...actualCases].sort()) !== canonicalJson([...RELEASE_CASES].sort()) || closureCases.length !== RELEASE_CASES.length || new Set(closureCases.map(row => row?.caseKey || [row?.mode, row?.viewport || row?.viewportProfile].filter(Boolean).join('/'))).size !== RELEASE_CASES.length || closureCases.some(row => !RELEASE_CASES.includes(row?.caseKey || [row?.mode, row?.viewport || row?.viewportProfile].filter(Boolean).join('/')) || !nonempty(row?.captureEvidenceId) || !nonempty(row?.reviewEvidenceId))) errors.push('FINAL_AUDIT_AUTHORITY_CANONICAL_CLOSURE_INVALID');
    } catch (error) {
      errors.push('FINAL_AUDIT_AUTHORITY_CANONICAL_VALIDATION_ERROR:' + error.message);
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)], binding: errors.length ? null : authorityPayload(authority) };
}

export function validateExternalApproval({ root, reviewReady, approval, candidateRef = null, assetRefs = null } = {}) {
  const errors = [];
  if (approval?.schemaVersion !== EXTERNAL_APPROVAL_SCHEMA) errors.push('APPROVAL_RECEIPT_SCHEMA_INVALID');
  if (approval?.approvalStatus !== 'APPROVED') errors.push('APPROVAL_STATUS_NOT_APPROVED');
  if (!approval?.examId || approval.examId !== reviewReady?.examId) errors.push('APPROVAL_EXAM_ID_MISMATCH');
  if (!approval?.reviewReadyRunId || approval.reviewReadyRunId !== reviewReady?.reviewReadyRunId) errors.push('APPROVAL_REVIEW_READY_RUN_MISMATCH');
  if (!HASH_PATTERN.test(String(approval?.reviewReadySha || ''))) errors.push('APPROVAL_REVIEW_READY_SHA_REQUIRED');
  if (approval?.reviewReadySha !== reviewReady?.reviewReadySha) errors.push('APPROVAL_REVIEW_READY_SHA_MISMATCH');
  if (!HASH_PATTERN.test(String(approval?.candidateSha256 || ''))) errors.push('APPROVAL_CANDIDATE_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.stagedAssetSetSha256 || ''))) errors.push('APPROVAL_ASSET_SET_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.finalClosureSha || ''))) errors.push('APPROVAL_CLOSURE_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.dbBaselineSha256 || ''))) errors.push('APPROVAL_DB_BASELINE_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.indexBaselineSha256 || ''))) errors.push('APPROVAL_INDEX_BASELINE_SHA_REQUIRED');
  if (approval?.candidateSha256 !== reviewReady?.candidateSha256) errors.push('APPROVAL_CANDIDATE_SHA_NOT_REVIEW_READY');
  if (approval?.stagedAssetSetSha256 !== reviewReady?.stagedAssetSetSha256) errors.push('APPROVAL_ASSET_SET_SHA_NOT_REVIEW_READY');
  if (approval?.finalClosureSha !== reviewReady?.finalClosureSha) errors.push('APPROVAL_CLOSURE_SHA_NOT_REVIEW_READY');
  if (!approval?.approvalEvidenceIdentity) errors.push('APPROVAL_EVIDENCE_IDENTITY_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.approvalEvidenceSha256 || ''))) errors.push('APPROVAL_EVIDENCE_SHA_REQUIRED');
  if (!Number.isFinite(Date.parse(approval?.approvedAt))) errors.push('APPROVAL_TIMESTAMP_REQUIRED');

  if (root) {
    try {
      const candidate = readActualRef(root, candidateRef || reviewReady.candidateRef);
      if (candidate.sha256 !== approval.candidateSha256) errors.push('APPROVED_CANDIDATE_SHA_MISMATCH');
      const actualAssets = (assetRefs || reviewReady.assetRefs || []).map(ref => readActualRef(root, ref));
      if (assetSetSha(actualAssets) !== approval.stagedAssetSetSha256) errors.push('APPROVED_ASSET_SET_SHA_MISMATCH');
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)] };
}

export function assertExternalApproval(options = {}) {
  const result = validateExternalApproval(options);
  if (result.status !== 'PASS') throw new Error('EXTERNAL_APPROVAL_BLOCKED:' + result.errors.join(';'));
  return result;
}

export function validateProductionSmokeRender(report, expectedCount = null, expectedBinding = null) {
  const errors = [];
  const rows = Array.isArray(report?.cases) ? report.cases : [];
  const keys = rows.map(row => row.caseKey || [row.mode, row.profile || row.viewport || row.viewportProfile].filter(Boolean).join('/'));
  const required = ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'];
  for (const key of required) {
    const matches = rows.filter((row, index) => keys[index] === key);
    if (matches.length !== 1 || matches[0].status !== 'PASS') errors.push('PRODUCTION_SMOKE_CASE_NOT_PASS:' + key);
    if (matches.length === 1 && expectedCount !== null && (matches[0].expectedQuestionCount !== expectedCount || matches[0].observedQuestionCount !== expectedCount)) errors.push('PRODUCTION_SMOKE_COUNT_MISMATCH:' + key);
  }
  for (const key of keys) if (!required.includes(key)) errors.push('PRODUCTION_SMOKE_UNEXPECTED_CASE:' + key);
  if (report?.status !== 'PASS') errors.push('PRODUCTION_SMOKE_REPORT_NOT_PASS');
  if (!nonempty(report?.releaseTransactionId)) errors.push('PRODUCTION_SMOKE_RELEASE_ID_REQUIRED');
  if (!nonempty(report?.reviewReadyRunId)) errors.push('PRODUCTION_SMOKE_REVIEW_READY_RUN_REQUIRED');
  if (!nonempty(report?.smokeId)) errors.push('PRODUCTION_SMOKE_CAPTURE_ID_REQUIRED');
  if (!isObject(report?.browserWitness) || report.browserWitness.actualBrowser !== true || !nonempty(report.browserWitness.captureId) || !nonempty(report.browserWitness.browserVersion)) errors.push('PRODUCTION_SMOKE_BROWSER_WITNESS_REQUIRED');
  const capturedAt = Date.parse(report?.capturedAt || report?.executedAt);
  if (!Number.isFinite(capturedAt)) errors.push('PRODUCTION_SMOKE_TIMESTAMP_REQUIRED');
  const indexCompletedAt = Date.parse(expectedBinding?.indexCompletedAt || expectedBinding?.productionReadyAt);
  if (Number.isFinite(indexCompletedAt) && (!Number.isFinite(capturedAt) || capturedAt < indexCompletedAt)) errors.push('PRODUCTION_SMOKE_BEFORE_INDEX_COMPLETION');
  if (!isObject(report?.rendererRuntimeBinding) || !nonempty(report.rendererRuntimeBinding.renderer) || !nonempty(report.rendererRuntimeBinding.runtimeSha256)) errors.push('PRODUCTION_SMOKE_RENDERER_RUNTIME_BINDING_REQUIRED');
  if (expectedBinding) {
    const binding = report?.productionBinding;
    if (!binding || report?.releaseTransactionId !== binding.releaseTransactionId || report?.reviewReadyRunId !== binding.reviewReadyRunId) errors.push('PRODUCTION_SMOKE_REPORT_BINDING_SELF_MISMATCH');
    if (!binding || binding.releaseTransactionId !== expectedBinding.releaseTransactionId) errors.push('PRODUCTION_SMOKE_RELEASE_ID_BINDING_FAIL');
    if (!report || report.reviewReadyRunId !== expectedBinding.reviewReadyRunId) errors.push('PRODUCTION_SMOKE_REVIEW_READY_RUN_BINDING_FAIL');
    if (expectedBinding.smokeId && report?.smokeId !== expectedBinding.smokeId) errors.push('PRODUCTION_SMOKE_REPLAY_BINDING_FAIL');
    if (!binding || binding.examId !== expectedBinding.examId) errors.push('PRODUCTION_SMOKE_EXAM_ID_BINDING_FAIL');
    if (!binding || binding.productionJsSha256 !== expectedBinding.productionJsSha256) errors.push('PRODUCTION_SMOKE_JS_SHA_BINDING_FAIL');
    if (!binding || binding.productionAssetSetSha256 !== expectedBinding.productionAssetSetSha256) errors.push('PRODUCTION_SMOKE_ASSET_SET_SHA_BINDING_FAIL');
    if (!binding || binding.questionCount !== expectedBinding.questionCount) errors.push('PRODUCTION_SMOKE_QUESTION_COUNT_BINDING_FAIL');
    if (!binding || canonicalJson(binding.dbTarget || null) !== canonicalJson(expectedBinding.dbTarget || null)) errors.push('PRODUCTION_SMOKE_DB_TARGET_BINDING_FAIL');
    if (!binding || canonicalJson(binding.indexTarget || null) !== canonicalJson(expectedBinding.indexTarget || null)) errors.push('PRODUCTION_SMOKE_INDEX_TARGET_BINDING_FAIL');
    if (!binding || canonicalJson(binding.rendererRuntimeBinding || null) !== canonicalJson(expectedBinding.rendererRuntimeBinding || null)) errors.push('PRODUCTION_SMOKE_RENDERER_RUNTIME_BINDING_FAIL');
    if (!binding || binding.releaseTransactionId !== expectedBinding.releaseTransactionId) errors.push('PRODUCTION_SMOKE_RELEASE_ID_BINDING_FAIL');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)] };
}

export function assertProductionSmokeRender(report, expectedCount = null, expectedBinding = null) {
  const result = validateProductionSmokeRender(report, expectedCount, expectedBinding);
  if (result.status !== 'PASS') throw new Error('PRODUCTION_SMOKE_BLOCKED:' + result.errors.join(';'));
  return result;
}

export function validateTargetParity({ examId, targetFile, questionCount, dbEntry, indexRows = [] } = {}) {
  const errors = [];
  const target = String(targetFile || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '');
  if (!examId || !targetFile) errors.push('TARGET_PARITY_IDENTITY_REQUIRED');
  if (String(dbEntry?.file || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '') !== target) errors.push('DB_TARGET_FILE_MISMATCH');
  if (dbEntry?.qCount !== questionCount) errors.push('DB_TARGET_QCOUNT_MISMATCH');
  const targetRows = indexRows.filter(row => String(row.sourceFile || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '') === target);
  if (targetRows.length !== questionCount) errors.push('INDEX_TARGET_QCOUNT_MISMATCH');
  const expectedKeys = new Set(Array.from({ length: questionCount }, (_, index) => target + '_' + (index + 1)));
  const actualKeys = new Set(targetRows.map(row => row.qKey));
  if (canonicalJson([...actualKeys].sort()) !== canonicalJson([...expectedKeys].sort())) errors.push('INDEX_TARGET_QKEY_SET_MISMATCH');
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)], examId, targetFile: target, questionCount };
}

export function assertTargetParity(options = {}) {
  const result = validateTargetParity(options);
  if (result.status !== 'PASS') throw new Error('TARGET_PARITY_BLOCKED:' + result.errors.join(';'));
  return result;
}

export function createReleaseTransaction({ reviewReady, approval, stages = [], status = 'HOLD', failure = null, transactionId = null, baseline = null, mutations = [], recovery = null } = {}) {
  const payload = {
    schemaVersion: RELEASE_TRANSACTION_VERSION,
    transactionId: transactionId || `release-${randomUUID()}`,
    examId: reviewReady?.examId || null,
    reviewReadyRunId: reviewReady?.reviewReadyRunId || null,
    reviewReadySha: reviewReady?.reviewReadySha || null,
    approvalStatus: approval?.approvalStatus || null,
    stages: [...stages],
    status,
    productionAuthorized: status === 'DONE',
    failure,
    baseline,
    mutations: [...mutations],
    recovery,
  };
  return { ...payload, transactionSha: objectSha(payload) };
}
