import { canonicalJson, objectSha } from './canonical.mjs';

export const REVIEW_MERGER_VERSION = 'APMATH_INDEPENDENT_REVIEW_MERGER_v1';
const phases = ['U1', 'U2', 'U3'];

// Pure reducer: never calls a model, never chooses a winning auditor, and
// never collapses distinct findings merely because they concern the same UID.
export function mergeIndependentReviews(results) {
  if (results.length !== 3 || new Set(results.map(r => r.phase)).size !== 3 || results.some(r => !phases.includes(r.phase))) throw new Error('MERGER_THREE_PHASES_REQUIRED');
  const ordered = [...results].sort((a, b) => phases.indexOf(a.phase) - phases.indexOf(b.phase));
  const defects = [], claims = [];
  for (const result of ordered) {
    if (!Array.isArray(result.defects) || !Array.isArray(result.evidence)) throw new Error('MERGER_RESULT_INVALID');
    for (const defect of result.defects) {
      const row = { ...defect, phase: result.phase };
      defects.push({ ...row, mergedFindingId: objectSha(row) });
      const type = defect.defectClass || defect.type;
      const domain = /^(SOURCE_DEFECT|SOURCE_PAYLOAD_DEFECT)$/.test(type || '') ? 'SOURCE' : null;
      if (domain) claims.push({ questionUid: defect.questionUid, runId: defect.runId, phase: result.phase, domain, status: 'FAIL', subjectSha: defect.subjectSha || null });
    }
    for (const evidence of result.evidence) {
      const assessments = [...(evidence.payload?.assessments || [])];
      if (['MATH_A1', 'MATH_A2'].includes(evidence.axis) && typeof evidence.payload?.independentAnswer === 'string') assessments.push({ domain: 'MATH_ANSWER', status: 'PASS', value: evidence.payload.independentAnswer.trim(), subjectSha: evidence.subjectSha || null });
      if (evidence.axis === 'SOURCE' || evidence.type === 'SOURCE_PASS') assessments.push({ domain: 'SOURCE', status: evidence.type === 'SOURCE_PASS' ? 'PASS' : evidence.status, subjectSha: evidence.subjectSha || null });
      for (const claim of assessments) {
        if (!['PASS', 'FAIL'].includes(claim.status) || !claim.domain || !evidence.questionUid) continue;
        claims.push({ ...claim, subjectSha: claim.subjectSha || null, runId: evidence.runId, questionUid: evidence.questionUid, phase: result.phase });
      }
    }
  }
  const conflicts = new Map();
  for (const a of claims) for (const b of claims) {
    const contradicts = a.status !== b.status || a.value !== undefined && b.value !== undefined && a.value !== b.value;
    if (a.phase === b.phase || a.questionUid !== b.questionUid || a.runId !== b.runId || a.domain !== b.domain || a.subjectSha !== b.subjectSha || !contradicts) continue;
    const key = canonicalJson([a.runId || null, a.questionUid, a.domain, a.subjectSha]);
    const matching = claims.filter(c => c.runId === a.runId && c.questionUid === a.questionUid && c.domain === a.domain && c.subjectSha === a.subjectSha);
    conflicts.set(key, { runId: a.runId, questionUid: a.questionUid, type: 'REVIEW_CONFLICT', defectClass: 'REVIEW_CONFLICT', severity: 'BLOCKING', domain: a.domain, subjectSha: a.subjectSha, claims: matching, reason: 'Independent auditors disagree on the same bound subject.' });
  }
  const unique = [...new Map(defects.map(d => [d.mergedFindingId, d])).values()];
  const conflictRows = [...conflicts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, row]) => row);
  return { schemaVersion: REVIEW_MERGER_VERSION, phaseResultShas: ordered.map(r => ({ phase: r.phase, sha256: objectSha(r), ...(r.responseRef ? { responseRef: r.responseRef } : {}) })), defects: [...unique, ...conflictRows], conflicts: conflictRows, adjudication: { required: conflictRows.length > 0, route: conflictRows.length ? 'SECOND_AUDIT' : null, automaticLaunch: false, explicitAuthorizationRequired: true } };
}
