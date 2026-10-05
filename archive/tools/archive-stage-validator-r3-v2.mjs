import { validateCommonEvidence } from './archive-stage-validator-common-v2.mjs';

const array = value => Array.isArray(value) ? value : [];
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;

function scopeQids(scope) {
  return [...new Set([
    ...array(scope?.openFindingQids),
    ...array(scope?.changedQids),
    ...array(scope?.directDependencyQids),
  ].map(Number).filter(Number.isInteger))].sort((a, b) => a - b);
}

export function validateR3Evidence({
  examUid,
  artifactSha,
  actualArtifactSha,
  evidenceRef,
  evidence,
}) {
  const expectedQids = scopeQids(evidence?.targetedScope);
  const common = validateCommonEvidence({
    stage: 'R3',
    examUid,
    artifactSha,
    actualArtifactSha,
    evidenceRef,
    evidence,
    rows: evidence?.rows,
    expectedQids,
  });

  const issues = [...common.issues];

  if (evidence?.lockedScopeIntegrity !== true) {
    issues.push('R3_LOCKED_SCOPE_INTEGRITY_REQUIRED');
  }
  if (evidence?.releaseIntegrity !== true) {
    issues.push('R3_RELEASE_INTEGRITY_REQUIRED');
  }

  const rows = Array.isArray(evidence?.rows) ? evidence.rows : [];
  for (const row of rows) {
    const qid = Number(row?.qid);
    if (!Number.isInteger(qid)) continue;
    if (!nonEmpty(row.verdict)) issues.push('R3_VERDICT_REQUIRED:q' + qid);
  }

  return {
    ok: issues.length === 0,
    validatorMode: 'R3_V2',
    stage: 'R3',
    examUid: common.examUid,
    artifactSha: common.artifactSha,
    evidenceRef: common.evidenceRef,
    scopeCount: expectedQids.length,
    rowCount: common.observedQids.length,
    disposition: issues.length ? 'FAIL' : 'PASS',
    common,
    issues,
  };
}
