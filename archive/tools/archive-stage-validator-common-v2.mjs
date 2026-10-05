export const V2_EVIDENCE_SCHEMA = 'JS_ARCHIVE_STAGE_EVIDENCE_v2';
export const V2_STAGES = new Set(['CREATE', 'R1', 'R2', 'R3']);

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const array = value => Array.isArray(value) ? value : [];

function normalizeQids(values) {
  return [...new Set(array(values).map(Number).filter(Number.isInteger))].sort((a, b) => a - b);
}

function compareQidSets(expected, observed, issues) {
  const expectedSet = new Set(expected);
  const observedSet = new Set(observed);
  for (const qid of expected) {
    if (!observedSet.has(qid)) issues.push(`COMMON_QID_MISSING:q${qid}`);
  }
  for (const qid of observed) {
    if (!expectedSet.has(qid)) issues.push(`COMMON_QID_ORPHAN:q${qid}`);
  }
}

export function validateCommonEvidence({
  stage,
  examUid,
  artifactSha,
  actualArtifactSha,
  evidenceRef,
  evidence,
  rows = evidence?.rows,
  expectedQids,
}) {
  const issues = [];
  const normalizedStage = String(stage || '').toUpperCase();

  if (!V2_STAGES.has(normalizedStage)) issues.push('COMMON_STAGE_UNSUPPORTED');
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) {
    issues.push('COMMON_EVIDENCE_OBJECT_REQUIRED');
  }

  if (evidence?.schemaVersion !== V2_EVIDENCE_SCHEMA) issues.push('COMMON_SCHEMA_UNSUPPORTED');
  if (String(evidence?.stage || '').toUpperCase() !== normalizedStage) issues.push('COMMON_STAGE_MISMATCH');

  if (!nonEmpty(examUid)) issues.push('COMMON_EXAM_UID_REQUIRED');
  if (!nonEmpty(evidence?.examUid)) issues.push('COMMON_EVIDENCE_EXAM_UID_REQUIRED');
  else if (nonEmpty(examUid) && evidence.examUid !== examUid) issues.push('COMMON_EXAM_UID_MISMATCH');

  if (!nonEmpty(artifactSha)) issues.push('COMMON_ARTIFACT_SHA_REQUIRED');
  if (!nonEmpty(actualArtifactSha)) issues.push('COMMON_ACTUAL_ARTIFACT_SHA_REQUIRED');
  if (!nonEmpty(evidence?.artifactSha)) issues.push('COMMON_EVIDENCE_ARTIFACT_SHA_REQUIRED');

  if (nonEmpty(artifactSha) && nonEmpty(actualArtifactSha) && artifactSha !== actualArtifactSha) {
    issues.push('COMMON_ACTUAL_ARTIFACT_SHA_MISMATCH');
  }
  if (nonEmpty(artifactSha) && nonEmpty(evidence?.artifactSha) && artifactSha !== evidence.artifactSha) {
    issues.push('COMMON_EVIDENCE_ARTIFACT_SHA_MISMATCH');
  }

  if (!nonEmpty(evidenceRef)) issues.push('COMMON_EVIDENCE_REF_REQUIRED');

  const observedQids = [];
  if (rows !== undefined) {
    if (!Array.isArray(rows)) {
      issues.push('COMMON_ROWS_ARRAY_REQUIRED');
    } else {
      const seen = new Set();
      for (const row of rows) {
        const qid = Number(row?.qid);
        if (!Number.isInteger(qid)) {
          issues.push('COMMON_ROW_QID_INVALID');
          continue;
        }
        if (seen.has(qid)) issues.push(`COMMON_ROW_QID_DUPLICATE:q${qid}`);
        else seen.add(qid);
        observedQids.push(qid);
      }
    }
  }

  const normalizedObservedQids = normalizeQids(observedQids);
  const normalizedExpectedQids = expectedQids === undefined ? null : normalizeQids(expectedQids);
  if (normalizedExpectedQids) {
    compareQidSets(normalizedExpectedQids, normalizedObservedQids, issues);
  }

  return {
    validatorLayer: 'COMMON_V2',
    commonValid: issues.length === 0,
    schemaVersion: evidence?.schemaVersion || null,
    stage: normalizedStage || null,
    examUid: nonEmpty(examUid) ? examUid : null,
    artifactSha: nonEmpty(artifactSha) ? artifactSha : null,
    evidenceRef: nonEmpty(evidenceRef) ? evidenceRef : null,
    observedQids: normalizedObservedQids,
    expectedQids: normalizedExpectedQids,
    issues,
  };
}
