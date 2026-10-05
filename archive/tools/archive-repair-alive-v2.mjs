export const SOURCE_MODES = Object.freeze({
  ORIGINAL: 'ORIGINAL',
  AUDITED_REPAIR: 'AUDITED_REPAIR',
  ALIVE_REPLACEMENT: 'ALIVE_REPLACEMENT',
});

export const SOURCE_FIDELITY_REASON = 'SOURCE_FIDELITY_REQUIRED';
const STAGES = new Set(['CREATE', 'R1', 'R2', 'R3']);

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const hasValue = value => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

function qids(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map(Number)
    .filter(Number.isInteger))]
    .sort((a, b) => a - b);
}

function required(condition, code) {
  if (!condition) throw new Error(code);
}

export function buildMutationScope({ changedQids = [], directDependencyQids = [] } = {}) {
  const changed = qids(changedQids);
  const directDependencies = qids(directDependencyQids);
  return {
    changedQids: changed,
    directDependencyQids: directDependencies,
    scopeQids: qids([...changed, ...directDependencies]),
  };
}

export function buildQidProvenance(input = {}) {
  const qid = Number(input.qid);
  const sourceMode = String(input.sourceMode || '').toUpperCase();

  required(Number.isInteger(qid), 'PROVENANCE_QID_REQUIRED');
  required(Object.values(SOURCE_MODES).includes(sourceMode), 'PROVENANCE_SOURCE_MODE_REQUIRED');

  const record = { qid, sourceMode };

  if (sourceMode === SOURCE_MODES.AUDITED_REPAIR) {
    required(hasValue(input.originalValue), 'AUDITED_REPAIR_ORIGINAL_VALUE_REQUIRED');
    required(hasValue(input.repairedValue), 'AUDITED_REPAIR_REPAIRED_VALUE_REQUIRED');
    required(nonEmpty(input.repairReason), 'AUDITED_REPAIR_REASON_REQUIRED');
    required(Array.isArray(input.affectedFields) && input.affectedFields.length > 0, 'AUDITED_REPAIR_AFFECTED_FIELDS_REQUIRED');
    required(hasValue(input.verificationResult), 'AUDITED_REPAIR_VERIFICATION_REQUIRED');
    Object.assign(record, {
      originalValue: input.originalValue,
      repairedValue: input.repairedValue,
      repairReason: input.repairReason,
      affectedFields: [...input.affectedFields],
      verificationResult: input.verificationResult,
    });
  }

  if (sourceMode === SOURCE_MODES.ALIVE_REPLACEMENT) {
    required(nonEmpty(input.replacementReason), 'ALIVE_REPLACEMENT_REASON_REQUIRED');
    required(STAGES.has(String(input.replacementStage || '').toUpperCase()), 'ALIVE_REPLACEMENT_STAGE_REQUIRED');
    Object.assign(record, {
      replacementReason: input.replacementReason,
      replacementStage: String(input.replacementStage).toUpperCase(),
    });
  }

  return record;
}

export function rebindPostMutationEvidence({
  evidence,
  finalArtifactSha,
  changedQids = [],
  directDependencyQids = [],
  reboundRows = [],
} = {}) {
  required(evidence && typeof evidence === 'object' && !Array.isArray(evidence), 'REBIND_EVIDENCE_OBJECT_REQUIRED');
  required(nonEmpty(evidence.artifactSha), 'REBIND_INPUT_ARTIFACT_SHA_REQUIRED');
  required(nonEmpty(finalArtifactSha), 'REBIND_FINAL_ARTIFACT_SHA_REQUIRED');
  required(evidence.artifactSha !== finalArtifactSha, 'REBIND_FINAL_ARTIFACT_MUST_CHANGE');

  const scope = buildMutationScope({ changedQids, directDependencyQids });
  required(scope.changedQids.length > 0, 'REBIND_CHANGED_QID_REQUIRED');

  const rows = Array.isArray(evidence.rows) ? evidence.rows : [];
  const rebound = Array.isArray(reboundRows) ? reboundRows : [];
  const reboundByQid = new Map();

  for (const row of rebound) {
    const qid = Number(row?.qid);
    required(Number.isInteger(qid), 'REBIND_ROW_QID_REQUIRED');
    required(!reboundByQid.has(qid), 'REBIND_ROW_QID_DUPLICATE:q' + qid);
    required(scope.scopeQids.includes(qid), 'REBIND_ROW_OUTSIDE_SCOPE:q' + qid);
    required(row.artifactSha === finalArtifactSha, 'REBIND_ROW_ARTIFACT_SHA_MISMATCH:q' + qid);
    required(nonEmpty(row.evidenceRef), 'REBIND_ROW_EVIDENCE_REF_REQUIRED:q' + qid);
    reboundByQid.set(qid, { ...row });
  }

  for (const qid of scope.scopeQids) {
    required(reboundByQid.has(qid), 'REBIND_SCOPE_ROW_REQUIRED:q' + qid);
  }

  const scopeSet = new Set(scope.scopeQids);
  const nextRows = rows
    .filter(row => !scopeSet.has(Number(row?.qid)))
    .map(row => ({ ...row }));

  for (const qid of scope.scopeQids) nextRows.push(reboundByQid.get(qid));
  nextRows.sort((a, b) => Number(a.qid) - Number(b.qid));

  return {
    ...evidence,
    artifactSha: finalArtifactSha,
    rows: nextRows,
    postMutationRebind: {
      inputArtifactSha: evidence.artifactSha,
      finalArtifactSha,
      changedQids: scope.changedQids,
      directDependencyQids: scope.directDependencyQids,
      scopeQids: scope.scopeQids,
    },
  };
}

export function buildSourceFidelityContinuation({
  userOptIn = false,
  examUid,
  qid,
  stage,
  detail,
} = {}) {
  if (userOptIn !== true) return null;

  required(nonEmpty(examUid), 'SOURCE_FIDELITY_EXAM_UID_REQUIRED');
  required(Number.isInteger(Number(qid)), 'SOURCE_FIDELITY_QID_REQUIRED');
  required(STAGES.has(String(stage || '').toUpperCase()), 'SOURCE_FIDELITY_STAGE_REQUIRED');
  required(nonEmpty(detail), 'SOURCE_FIDELITY_DETAIL_REQUIRED');

  return {
    reason: SOURCE_FIDELITY_REASON,
    examUid,
    qid: Number(qid),
    stage: String(stage).toUpperCase(),
    detail,
  };
}
