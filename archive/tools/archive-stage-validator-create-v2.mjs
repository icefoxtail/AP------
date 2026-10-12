import { validateCommonEvidence } from './archive-stage-validator-common-v2.mjs';
import { validateQuestionOnlyReplacement } from './question-only-replacement-v2.mjs';

const STAGE = 'CREATE';
const MODES = new Set(['ORIGINAL', 'AUDITED_REPAIR', 'ALIVE_REPLACEMENT', 'QUESTION_ONLY']);

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
  actualArtifactRawSha256,
  evidenceRef,
  evidence,
  expectedQids,
  questions,
  repoRoot,
  assetRoot,
  questionOnlyAuthority,
  questionOnlyAuthorityRef,
}) {
  const inputRows = Array.isArray(evidence?.rows) ? evidence.rows : [];
  let questionOnlyRows = inputRows.filter(row => String(row?.sourceMode || '').toUpperCase() === 'QUESTION_ONLY'
    || String(row?.replacementMode || '').toUpperCase() === 'QUESTION_ONLY'
    || Boolean(row?.provenanceEvidence?.questionOnlyReplacement));
  const questionOnlyDeclared = evidence?.replacementEvidenceScope?.fullExamStageClosure === false
    && Array.isArray(evidence?.replacementEvidenceScope?.qids) && evidence.replacementEvidenceScope.qids.length === 1
    || evidence?.sourceParity?.status === 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT';
  if (questionOnlyDeclared && questionOnlyRows.length === 0) {
    const requestedQid = Number(evidence?.replacementEvidenceScope?.qids?.[0] ?? evidence?.sourceParity?.qid);
    questionOnlyRows = inputRows.filter(row => Number(row?.qid) === requestedQid);
  }
  const scopedQuestionOnly = questionOnlyRows.length > 0 || questionOnlyDeclared;
  const scopedQid = scopedQuestionOnly && questionOnlyRows.length === 1 ? Number(questionOnlyRows[0]?.qid) : null;
  const commonExpectedQids = scopedQuestionOnly && Number.isInteger(scopedQid) ? [scopedQid] : expectedQids;
  const common = validateCommonEvidence({
    stage: STAGE,
    examUid,
    artifactSha,
    actualArtifactSha,
    evidenceRef,
    evidence,
    rows: evidence?.rows,
    expectedQids: commonExpectedQids,
  });

  const issues = [...common.issues];
  const rows = Array.isArray(evidence?.rows) ? evidence.rows : [];
  let questionOnly = null;

  if (scopedQuestionOnly) {
    if (questionOnlyRows.length !== 1) issues.push('QUESTION_ONLY_SINGLE_TARGET_ROW_REQUIRED');
    else {
      questionOnly = validateQuestionOnlyReplacement({
        evidence,
        row: questionOnlyRows[0],
        questions,
        repoRoot,
        assetRoot,
        artifactRawSha256: actualArtifactRawSha256,
        artifactGitBlobSha: actualArtifactSha,
        authorityRef: questionOnlyAuthorityRef,
        authority: questionOnlyAuthority,
      });
      issues.push(...questionOnly.issues);
    }
  }

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
    if (sourceMode === 'QUESTION_ONLY') {
      if (row?.replacementMode !== 'QUESTION_ONLY' || !has(provenance.questionOnlyReplacement)) {
        issues.push('CREATE_QUESTION_ONLY_PROVENANCE_REQUIRED:q' + qid);
      }
    } else if (sourceMode === 'ORIGINAL') {
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
    ...(scopedQuestionOnly ? { candidateScope: 'QUESTION_ONLY_QID_CANDIDATE', fullExamStageClosure: false, questionOnly: questionOnly?.summary || null } : {}),
    common,
    issues,
  };
}
