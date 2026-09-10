import { HASH_PATTERN, isObject, nonempty, objectSha } from './canonical.mjs';
import { validateSolutionQuality } from './solution-quality.mjs';

export const EVIDENCE_VERSION_V2 = 'APMATH_PIPELINE_EVIDENCE_v2';
export const REUSE_RECEIPT_VERSION = 'APMATH_EVIDENCE_REUSE_RECEIPT_v1';

export const REUSE_RECEIPT_FIELDS = Object.freeze(['receiptId', 'questionUid', 'axis', 'priorEvidenceId', 'priorEvidenceSha', 'priorRunInputSha', 'currentRunId', 'currentRevision', 'currentRunInputSha', 'priorAxisInputSha', 'currentAxisInputSha', 'dependencySetSha', 'ruleDependencySetSha', 'semanticVerifierSha', 'lifecycleSnapshotRef', 'validatedAt', 'status', 'reasonCodes']);

const hashFields = new Set(['priorEvidenceSha', 'priorRunInputSha', 'currentRunInputSha', 'priorAxisInputSha', 'currentAxisInputSha', 'dependencySetSha', 'ruleDependencySetSha', 'semanticVerifierSha']);
const isFileRef = value => isObject(value) && nonempty(value.path) && Number.isSafeInteger(value.bytes) && value.bytes >= 0 && HASH_PATTERN.test(value.sha256);
export const FRESH_LIFECYCLE_DECLARATIONS = Object.freeze({ withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE' });

export function createEvidenceReuseReceipt(input) {
  const receipt = { schemaVersion: REUSE_RECEIPT_VERSION, ...input };
  if (!isFileRef(receipt.lifecycleSnapshotRef)) throw new Error('REUSE_LIFECYCLE_SNAPSHOT_REF_REQUIRED');
  if (!Array.isArray(receipt.reasonCodes)) receipt.reasonCodes = [];
  return receipt;
}

export function validateEvidenceReuseReceipt(receipt, context = {}) {
  const errors = [];
  if (!isObject(receipt)) return { status: 'FAIL', errors: ['REUSE_RECEIPT_REQUIRED'], receiptSha: null };
  if (!isObject(receipt) || receipt.schemaVersion !== REUSE_RECEIPT_VERSION) errors.push('REUSE_RECEIPT_SCHEMA_INVALID');
  for (const field of REUSE_RECEIPT_FIELDS) if (receipt?.[field] === undefined || receipt?.[field] === null) errors.push(`REUSE_RECEIPT_FIELD_MISSING:${field}`);
  for (const field of hashFields) if (receipt?.[field] !== undefined && !HASH_PATTERN.test(receipt[field])) errors.push(`REUSE_RECEIPT_HASH_INVALID:${field}`);
  if (!isFileRef(receipt?.lifecycleSnapshotRef)) errors.push('REUSE_LIFECYCLE_SNAPSHOT_REF_INVALID');
  if (context.lifecycleSnapshotSha !== undefined && receipt?.lifecycleSnapshotRef?.sha256 !== context.lifecycleSnapshotSha) errors.push('REUSE_LIFECYCLE_SNAPSHOT_HASH_MISMATCH');
  if (context.eligibility?.lifecycleSnapshotSha !== receipt?.lifecycleSnapshotRef?.sha256) errors.push('REUSE_LIFECYCLE_ELIGIBILITY_HASH_MISMATCH');
  if (!nonempty(receipt?.receiptId) || !nonempty(receipt?.questionUid) || !nonempty(receipt?.axis) || !nonempty(receipt?.priorEvidenceId)) errors.push('REUSE_RECEIPT_IDENTITY_INVALID');
  if (!Number.isSafeInteger(receipt?.currentRevision) || receipt.currentRevision < 1) errors.push('REUSE_RECEIPT_REVISION_INVALID');
  if (!Number.isFinite(Date.parse(receipt?.validatedAt))) errors.push('REUSE_RECEIPT_TIME_INVALID');
  if (!['PASS', 'FAIL'].includes(receipt?.status)) errors.push('REUSE_RECEIPT_STATUS_INVALID');
  if (!Array.isArray(receipt?.reasonCodes) || (receipt?.status === 'PASS' && receipt.reasonCodes.length === 0)) errors.push('REUSE_RECEIPT_REASON_CODES_INVALID');
  const equal = (field, expected) => { if (expected !== undefined && receipt?.[field] !== expected) errors.push(`REUSE_RECEIPT_${field.toUpperCase()}_MISMATCH`); };
  equal('questionUid', context.questionUid); equal('axis', context.axis); equal('priorEvidenceId', context.priorEvidenceId); equal('priorEvidenceSha', context.priorEvidenceSha); equal('priorRunInputSha', context.priorRunInputSha); equal('currentRunId', context.currentRunId); equal('currentRevision', context.currentRevision); equal('currentRunInputSha', context.currentRunInputSha); equal('priorAxisInputSha', context.currentAxisInputSha); equal('currentAxisInputSha', context.currentAxisInputSha); equal('dependencySetSha', context.dependencySetSha); equal('ruleDependencySetSha', context.ruleDependencySetSha); equal('semanticVerifierSha', context.semanticVerifierSha);
  if (context.priorEvidence && !['PASS', 'FROZEN'].includes(context.priorEvidence.status)) errors.push('REUSE_PRIOR_EVIDENCE_NOT_PASS');
  if (context.priorEvidence && context.priorEvidence.questionUid !== receipt.questionUid) errors.push('REUSE_PRIOR_EVIDENCE_SCOPE_MISMATCH');
  if (context.priorEvidence && context.priorEvidence.axis !== receipt.axis) errors.push('REUSE_PRIOR_EVIDENCE_AXIS_MISMATCH');
  if (context.priorEvidence && receipt.priorAxisInputSha !== context.priorEvidence.axisInputSha) errors.push('REUSE_PRIOR_AXIS_INPUT_SHA_MISMATCH');
  const root = context.rootFreshEvidence;
  for (const field of ['rootFreshEvidenceId', 'rootFreshEvidenceSha', 'rootFreshRunId', 'rootFreshRunInputSha', 'rootFreshAxisInputSha']) if (!nonempty(receipt[field])) errors.push(`ROOT_FRESH_FIELD_MISSING:${field}`);
  if (!root || root.schemaVersion !== EVIDENCE_VERSION_V2 || root.mode !== 'FRESH' || root.reuseReceipt || root.reuseReceiptRef || root.status !== 'PASS' || !['VALID', 'FROZEN'].includes(root.validityStatus)) errors.push('IMMUTABLE_ROOT_FRESH_REQUIRED');
  else {
    for (const [key, expected] of Object.entries({ rootFreshEvidenceId: root.evidenceId, rootFreshEvidenceSha: context.rootFreshEvidenceSha, rootFreshRunId: root.runId, rootFreshRunInputSha: root.inputSha, rootFreshAxisInputSha: root.axisInputSha })) if (!expected || receipt[key] !== expected) errors.push(`ROOT_FRESH_BINDING:${key}`);
    if (root.axisInputSha !== context.currentAxisInputSha || root.questionUid !== receipt.questionUid || root.axis !== receipt.axis) errors.push('ROOT_FRESH_SCOPE_OR_INPUT_CHANGED');
    if (context.priorEvidence?.mode !== 'FRESH' || receipt.priorEvidenceId !== root.evidenceId || receipt.priorEvidenceSha !== receipt.rootFreshEvidenceSha) errors.push('RECEIPT_CHAIN_WITHOUT_DIRECT_ROOT_FORBIDDEN');
  }
  for (const [field, expected] of Object.entries({ withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE' })) {
    if (receipt[field] !== expected || root?.[field] !== expected || context.eligibility?.[field] !== expected) errors.push(`REUSE_INELIGIBLE:${field}`);
  }
  if (!context.eligibility || context.eligibility.currentRunInputSha !== context.currentRunInputSha || context.eligibility.rootFreshEvidenceSha !== receipt.rootFreshEvidenceSha || context.eligibility.correctionLineageStatus !== 'VALID' || context.eligibility.currentRunId !== context.currentRunId || context.eligibility.currentRevision !== context.currentRevision || context.eligibility.axis !== receipt.axis || context.eligibility.questionUid !== receipt.questionUid || context.eligibility.sourceAuthoritySliceSha !== context.sourceAuthoritySliceSha || !HASH_PATTERN.test(context.eligibility.lifecycleSnapshotSha) || context.eligibility.lifecycleSnapshotSha !== context.lifecycleSnapshotSha) errors.push('REUSE_CORRECTION_LINEAGE_INVALID');
  if (receipt.status !== 'PASS') errors.push('REUSE_RECEIPT_NOT_PASS');
  if (receipt.status === 'PASS' && errors.length) errors.push('REUSE_RECEIPT_PASS_NOT_PROVEN');
  return { status: errors.length ? 'FAIL' : 'PASS', errors, receiptSha: errors.length ? null : objectSha(receipt) };
}

export function validateFreshEvidenceIndependence(evidence, run, packet) {
  const errors = [];
  for (const field of ['reviewerId', 'reviewSessionId', 'reviewerModelOrAgent', 'startedAt', 'frozenAt', 'priorReviewVisibility', 'inputVisibilityProfile', 'reviewIsolationProvenanceSha']) if (!nonempty(evidence?.[field])) errors.push(`FRESH_REVIEW_FIELD_MISSING:${field}`);
  if (!['STATELESS_MODEL', 'HUMAN'].includes(evidence?.auditorPrincipalType)) errors.push('AUDITOR_PRINCIPAL_TYPE_REQUIRED');
  for (const [field, expected] of Object.entries(FRESH_LIFECYCLE_DECLARATIONS)) if (evidence?.[field] !== expected) errors.push(`FRESH_LIFECYCLE_DECLARATION_INVALID:${field}`);
  if (evidence?.reviewerId === run.builderId || evidence?.reviewSessionId === run.builderSessionId) errors.push('BUILDER_REVIEWER_COLLISION');
  if (!Number.isFinite(Date.parse(evidence?.startedAt)) || !Number.isFinite(Date.parse(evidence?.frozenAt)) || Date.parse(evidence.startedAt) > Date.parse(evidence.frozenAt)) errors.push('FRESH_REVIEW_TIME_INVALID');
  if (!Array.isArray(evidence?.findings) || evidence.findings.some(f => f.status !== 'RESOLVED')) errors.push('FRESH_FINDINGS_UNRESOLVED');
  if (!packet || packet.packetSha !== evidence.reviewIsolationProvenanceSha || packet.auditorId !== evidence.reviewerId || packet.auditorSessionId !== evidence.reviewSessionId || packet.auditorPrincipalType !== evidence.auditorPrincipalType || packet.inputVisibilityProfile !== evidence.inputVisibilityProfile || packet.priorReviewVisibility !== evidence.priorReviewVisibility || packet.sealed !== true || !nonempty(packet.contextId)) errors.push('FRESH_ISOLATION_PROVENANCE_INVALID');
  if (!packet?.questionUids?.includes(evidence.questionUid) && !evidence.payload?.questionUids?.every(uid => packet?.questionUids?.includes(uid))) errors.push('EVIDENCE_PACKET_UID_BINDING');
  const binding = AXIS_REVIEW_BINDING[evidence?.axis];
  if (!binding || packet?.phase !== binding[0] || evidence.inputVisibilityProfile !== binding[1] || evidence.priorReviewVisibility !== binding[2]) errors.push('AXIS_PHASE_VISIBILITY_EXACT_BINDING');
  if (packet?.launchId !== evidence.launchId || packet?.externalTaskId !== evidence.externalTaskId) errors.push('PACKET_LAUNCH_BINDING');
  if (['U1', 'U2'].includes(packet?.phase) && evidence.priorReviewVisibility !== 'NONE') errors.push('FRESH_BLIND_VISIBILITY_INVALID');
  return errors;
}

export function validateEvidenceFreshness(evidence, { currentRunInputSha, currentAxisInputSha, reuseReceipt = null, reuseContext = {} } = {}) {
  const errors = [];
  if (!isObject(evidence)) return { status: 'BLOCKED', mode: null, errors: ['EVIDENCE_INVALID'] };
  if (evidence.schemaVersion !== EVIDENCE_VERSION_V2) return { status: 'BLOCKED', mode: null, errors: ['V1_EVIDENCE_AUTO_UPGRADE_FORBIDDEN'] };
  if (evidence.status !== 'PASS' || !['VALID', 'FROZEN'].includes(evidence.validityStatus)) errors.push('EVIDENCE_NOT_PASS');
  if (machineAxes.includes(evidence.axis)) {
    if (reuseReceipt || evidence.mode !== 'MACHINE_CURRENT' || evidence.inputSha !== currentRunInputSha || evidence.axisInputSha !== currentAxisInputSha) errors.push('MACHINE_CURRENT_REUSE_FORBIDDEN');
    return { status: errors.length ? 'BLOCKED' : 'PASS', mode: 'MACHINE_CURRENT', errors };
  }
  if (evidence.inputSha === currentRunInputSha && evidence.axisInputSha === currentAxisInputSha && !reuseReceipt) return { status: errors.length ? 'BLOCKED' : 'PASS', mode: 'FRESH', errors };
  const receiptResult = validateEvidenceReuseReceipt(reuseReceipt, { ...reuseContext, questionUid: evidence.questionUid, axis: evidence.axis, currentRunInputSha, currentAxisInputSha });
  if (receiptResult.status !== 'PASS') errors.push(...receiptResult.errors);
  if (evidence.inputSha === currentRunInputSha) errors.push('FRESH_EVIDENCE_AXIS_SHA_MISMATCH');
  return { status: errors.length ? 'BLOCKED' : 'PASS', mode: 'REUSED', errors, receiptSha: receiptResult.receiptSha };
}

export function evidenceReuseMetrics(rows) {
  const items = Array.isArray(rows) ? rows : [];
  const fresh = items.filter(row => row.mode === 'FRESH');
  const reused = items.filter(row => row.mode === 'REUSED');
  return { freshAxisCount: fresh.length, reusedAxisCount: reused.length, freshUidCount: new Set(fresh.map(row => row.questionUid)).size, reusedOnlyUidCount: new Set(reused.map(row => row.questionUid)).size, affectedUidCount: new Set(items.filter(row => row.affected).map(row => row.questionUid)).size, freshLlmUidCount: new Set(fresh.filter(row => row.llm === true).map(row => row.questionUid)).size, freshLlmAxisCount: fresh.filter(row => row.llm === true).length, reusedUidCount: new Set(reused.map(row => row.questionUid)).size, reusedAxisCount: reused.length, reuseRatio: items.length ? reused.length / items.length : 0 };
}

// Axis contracts are evidence types, never instructions to create another agent.
export const AXIS_REVIEW_BINDING = Object.freeze({
  SOURCE: ['U1', 'SOURCE_ONLY', 'NONE'], MATH_A1: ['U1', 'SOURCE_ONLY', 'NONE'],
  V1: ['U1', 'SOURCE_ONLY', 'NONE'], V2: ['U2', 'ARTIFACT_ONLY', 'NONE'],
  MATH_A2: ['U3', 'FROZEN_V1_V2', 'FROZEN_U1_U2'],
  SOLUTION: ['U3', 'FROZEN_V1_V2', 'FROZEN_U1_U2'],
  V3: ['U3', 'FROZEN_V1_V2', 'FROZEN_U1_U2'],
  RENDER_REVIEW: ['U3', 'ACTUAL_RENDER', 'CAPTURE_ONLY']
});
const machineAxes = ['STATIC', 'METADATA', 'RENDER_CAPTURE'];
export function validateMachineEvidence(evidence, run, { diagnostic = false } = {}) {
  const errors = [];
  if (!machineAxes.includes(evidence?.axis) || evidence.mode !== 'MACHINE_CURRENT' || evidence.auditorPrincipalType !== 'MACHINE_COLLECTOR' || evidence.launchId || evidence.externalTaskId) errors.push('MACHINE_COLLECTOR_SEMANTICS_INVALID');
  if (evidence?.runId !== run.runId || evidence?.revision !== run.revision || evidence?.inputSha !== run.inputSha || evidence?.reviewStartInputSha !== run.inputSha || evidence?.reviewEndInputSha !== run.inputSha || !(diagnostic ? ['PASS', 'FAIL', 'HOLD'] : ['PASS']).includes(evidence?.status)) errors.push('MACHINE_CURRENT_BINDING_INVALID');
  const provenance = evidence?.machineProvenance;
  if (!provenance || provenance.inputSha !== run.inputSha || provenance.runId !== run.runId || provenance.revision !== run.revision || !nonempty(provenance.collector) || objectSha(provenance) !== evidence.reviewIsolationProvenanceSha) errors.push('MACHINE_PROVENANCE_REQUIRED');
  if (evidence?.axis === 'RENDER_CAPTURE' && (evidence.payload?.actualBrowser !== true || evidence.payload?.productionEngine !== true || !evidence.payload?.itemWitnesses?.length)) errors.push('MACHINE_RENDER_WITNESSES_REQUIRED');
  if (diagnostic && ['STATIC','METADATA'].includes(evidence?.axis)) {
    const checks = Object.values(evidence.payload?.checks || {});
    if (!checks.length || checks.some(value => !['PASS','FAIL','HOLD'].includes(value)) || (evidence.status === 'PASS') !== checks.every(value => value === 'PASS')) errors.push('MACHINE_STATUS_CHECKS_CONTRADICTION');
  }
  return errors;
}
export function validateTypedEvidence(evidence, { diagnostic = false } = {}) {
  const errors = [], p = evidence?.payload;
  if (!isObject(p)) return ['TYPED_PAYLOAD_REQUIRED'];
  const text = field => { if (!nonempty(p[field])) errors.push(`TYPED_${evidence.axis}:${field}`); };
  const hash = field => { if (!HASH_PATTERN.test(p[field])) errors.push(`TYPED_${evidence.axis}:${field}`); };
  const truth = field => { if (p[field] !== true) errors.push(`TYPED_${evidence.axis}:${field}`); };
  const checks = fields => { for (const field of fields) if (!(diagnostic && machineAxes.includes(evidence.axis) ? ['PASS', 'FAIL', 'HOLD'] : ['PASS']).includes(p.checks?.[field])) errors.push(`TYPED_${evidence.axis}:checks.${field}`); };
  switch (evidence.axis) {
    case 'SOURCE': hash('sourceTruthBundleSha'); text('fidelityRationale'); truth('sourceFidelityVerified'); break;
    case 'MATH_A1': text('independentAnswer'); text('independentDerivation'); truth('blindSolveFrozen'); truth('allChoicesChecked'); truth('answerUnique'); break;
    case 'MATH_A2': hash('a1EvidenceSha'); text('answerComparison'); truth('allChoicesChecked'); truth('answerUnique'); break;
    case 'SOLUTION': text('solutionRationale'); checks(['mathematicalCorrectness', 'logicalCompleteness', 'studentUnderstandability']); errors.push(...validateSolutionQuality(p.solutionQuality).errors); break;
    case 'METADATA': hash('metadataInputSha'); checks(['schema', 'uidBinding', 'curriculumBinding']); break;
    case 'STATIC': hash('checkedInputSha'); checks(['schema', 'jsLoad', 'hashes', 'assetBinding', 'fileParity', 'studentSerialization']); break;
  }
  if (machineAxes.includes(evidence.axis) !== (evidence.auditorPrincipalType === 'MACHINE_COLLECTOR' && evidence.mode === 'MACHINE_CURRENT')) errors.push('AXIS_EXECUTION_CLASS_MISMATCH');
  return errors;
}
