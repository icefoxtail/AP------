import { validateCommonEvidence } from './archive-stage-validator-common-v2.mjs';

const STAGE = 'CREATE';
const MODES = new Set(['ORIGINAL', 'AUDITED_REPAIR', 'ALIVE_REPLACEMENT']);

function has(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return value === true;
}

export function validateCreateEvidence({
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

    const sourceMode = String(row?.sourceMode || '').toUpperCase();
    if (!MODES.has(sourceMode)) {
      issues.push('CREATE_SOURCE_MODE_REQUIRED:q' + qid);
      continue;
    }

    const axes = row?.axisEvidence;
    const requiredAxes = ['questionLayout', 'solutionLayout', 'meta', 'visualSvg'];
    if (!axes || typeof axes !== 'object' || Array.isArray(axes)) {
      issues.push('CREATE_AXIS_EVIDENCE_REQUIRED:q' + qid);
    } else {
      for (const axis of requiredAxes) {
        if (!has(axes[axis])) issues.push('CREATE_AXIS_EVIDENCE_REQUIRED:' + axis + ':q' + qid);
      }
    }

    const provenance = row?.provenanceEvidence || {};
    if (sourceMode === 'ORIGINAL') {
      if (!has(provenance.sourceParity)) issues.push('CREATE_SOURCE_PARITY_EVIDENCE_REQUIRED:q' + qid);
    } else if (sourceMode === 'AUDITED_REPAIR') {
      if (!has(provenance.repair)) issues.push('CREATE_REPAIR_PROVENANCE_REQUIRED:q' + qid);
      if (!has(provenance.repairedTruth)) issues.push('CREATE_REPAIRED_TRUTH_EVIDENCE_REQUIRED:q' + qid);
    } else if (sourceMode === 'ALIVE_REPLACEMENT') {
      if (!has(provenance.curriculum)) issues.push('CREATE_CURRICULUM_EVIDENCE_REQUIRED:q' + qid);
      if (!has(provenance.answerCardinality)) issues.push('CREATE_ANSWER_CARDINALITY_EVIDENCE_REQUIRED:q' + qid);
    }
  }

  return {
    ok: issues.length === 0,
    validatorMode: 'CREATE_V2',
    stage: STAGE,
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
