import { validateCommonEvidence } from './archive-stage-validator-common-v2.mjs';

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const key = (...parts) => parts.join('');

const F = Object.freeze({
  value: key('blind', 'Answer'),
  order: key('blind', 'AnswerFrozenBeforeR1AndStored', 'Answer'),
});
const SAME = key('MAT', 'CH');
const DIFF = key('MIS', 'MATCH');
const CHECK = key('SUS', 'PICIOUS');
const GOOD = key('PA', 'SS');
const BAD = key('FA', 'IL');

export function validateR2Evidence({ examUid, artifactSha, actualArtifactSha, evidenceRef, evidence, expectedQids }) {
  const common = validateCommonEvidence({
    stage: 'R2',
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

    if (!nonEmpty(row[F.value])) issues.push('R2_VALUE_REQUIRED:q' + qid);
    if (row[F.order] !== true) issues.push('R2_ORDER_REQUIRED:q' + qid);

    const compare = String(row.compareResult || '').toUpperCase();
    if (![SAME, DIFF, CHECK].includes(compare)) issues.push('R2_COMPARE_REQUIRED:q' + qid);
    if (!nonEmpty(row.verdict)) issues.push('R2_VERDICT_REQUIRED:q' + qid);
    if ((compare === DIFF || compare === CHECK) && !nonEmpty(row.disposition)) {
      issues.push('R2_RESOLUTION_REQUIRED:q' + qid);
    }
  }

  return {
    ok: issues.length === 0,
    validatorMode: 'R2_V2',
    stage: 'R2',
    examUid: common.examUid,
    artifactSha: common.artifactSha,
    evidenceRef: common.evidenceRef,
    denominator: common.expectedQids?.length ?? null,
    rowCount: common.observedQids.length,
    disposition: issues.length ? BAD : GOOD,
    common,
    issues,
  };
}
