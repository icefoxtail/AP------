import { validateCommonEvidence } from './archive-stage-validator-common-v2.mjs';

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;

function hasEvidenceValue(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function dispositionRequired(row) {
  const compareResult = String(row?.compareResult || '').toUpperCase();
  return compareResult === 'MISMATCH'
    || row?.repairApplied === true
    || row?.sourceMode === 'AUDITED_REPAIR'
    || row?.sourceMode === 'QUESTION_ONLY'
    || row?.sourceMode === 'ALIVE_REPLACEMENT';
}

export function validateR1Evidence({
  examUid,
  artifactSha,
  actualArtifactSha,
  evidenceRef,
  evidence,
  expectedQids,
}) {
  const common = validateCommonEvidence({
    stage: 'R1',
    examUid,
    artifactSha,
    actualArtifactSha,
    evidenceRef,
    evidence,
    rows: evidence?.rows,
    expectedQids,
  });

  const issues = [...common.issues];
  const rows = Array.isArray(evidence?.rows) ? evidence.rows : [];

  for (const row of rows) {
    const qid = Number(row?.qid);
    if (!Number.isInteger(qid)) continue;

    if (!hasEvidenceValue(row.independentAnswer)) {
      issues.push(`R1_INDEPENDENT_ANSWER_REQUIRED:q${qid}`);
    }
    if (row.independentAnswerFrozenBeforeStoredAnswer !== true) {
      issues.push(`R1_FREEZE_BEFORE_STORED_REQUIRED:q${qid}`);
    }
    if (!hasEvidenceValue(row.storedAnswer)) {
      issues.push(`R1_STORED_ANSWER_REQUIRED:q${qid}`);
    }

    const compareResult = String(row.compareResult || '').toUpperCase();
    if (!['MATCH', 'MISMATCH'].includes(compareResult)) {
      issues.push(`R1_COMPARE_RESULT_REQUIRED:q${qid}`);
    }

    if (!nonEmpty(row.verdict)) {
      issues.push(`R1_VERDICT_REQUIRED:q${qid}`);
    }

    if (dispositionRequired(row) && !nonEmpty(row.disposition)) {
      issues.push(`R1_DISPOSITION_REQUIRED:q${qid}`);
    }
  }

  return {
    ok: issues.length === 0,
    validatorMode: 'R1_V2',
    stage: 'R1',
    examUid: common.examUid,
    artifactSha: common.artifactSha,
    evidenceRef: common.evidenceRef,
    denominator: common.expectedQids?.length ?? null,
    rowCount: common.observedQids.length,
    disposition: issues.length ? 'FAIL' : 'PASS',
    common,
    issues,
  };
}
