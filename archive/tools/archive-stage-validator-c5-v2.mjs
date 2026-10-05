import { V2_STAGES, validateCommonEvidence } from './archive-stage-validator-common-v2.mjs';

const STAGE = [...V2_STAGES][0];
const MODE_KEY = ['source', 'Mode'].join('');
const PROOF_KEY = ['provenance', 'Evidence'].join('');
const MODES = Object.freeze({
  base: ['ORI', 'GINAL'].join(''),
  audited: ['AUDITED', '_REPAIR'].join(''),
  replacement: ['ALIVE', '_REPLACEMENT'].join(''),
});

function has(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return value === true;
}

export function validateC5Evidence({
  examUid,
  artifactSha,
  actualArtifactSha,
  evidenceRef,
  evidence,
  expectedQids,
}) {
  const common = validateCommonEvidence({
    stage: STAGE,
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

    const mode = String(row?.[MODE_KEY] || '').toUpperCase();
    if (![MODES.base, MODES.audited, MODES.replacement].includes(mode)) {
      issues.push('C5_MODE_REQUIRED:q' + qid);
      continue;
    }

    const axes = Array.isArray(row?.axisEvidence) ? row.axisEvidence : [];
    if (axes.length !== 4 || axes.some(value => !has(value))) {
      issues.push('C5_AXIS_EVIDENCE_REQUIRED:q' + qid);
    }

    const proof = row?.[PROOF_KEY] || {};
    if (mode === MODES.base) {
      if (!has(proof.sourceParity)) issues.push('C5_BASE_PROOF_REQUIRED:q' + qid);
    } else if (mode === MODES.audited) {
      if (!has(proof.audit)) issues.push('C5_AUDIT_PROOF_REQUIRED:q' + qid);
      if (!has(proof.truth)) issues.push('C5_TRUTH_PROOF_REQUIRED:q' + qid);
    } else if (mode === MODES.replacement) {
      if (!has(proof.curriculum)) issues.push('C5_CURRICULUM_PROOF_REQUIRED:q' + qid);
      if (!has(proof.cardinality)) issues.push('C5_CARDINALITY_PROOF_REQUIRED:q' + qid);
    }
  }

  return {
    ok: issues.length === 0,
    validatorMode: 'C5_V2',
    stage: STAGE,
    examUid: common.examUid,
    artifactSha: common.artifactSha,
    evidenceRef: common.evidenceRef,
    denominator: common.expectedQids?.length ?? null,
    rowCount: common.observedQids.length,
    common,
    issues,
  };
}
