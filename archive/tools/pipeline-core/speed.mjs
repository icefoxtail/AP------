import { changeImpactMap, computeAxisInputShaMap, semanticDiff } from './semantic-diff.mjs';
import { CANONICAL_AXES } from './projection.mjs';
import { objectSha } from './canonical.mjs';
import { validateEvidenceFreshness, evidenceReuseMetrics } from './review-evidence-v2.mjs';
import { detectRenderImpact } from './render-impact.mjs';

export const SPEED_PIPELINE_VERSION = 'APMATH_SPEED_PATH_v1';

const questionList = value => Array.isArray(value) ? value : Array.isArray(value?.questions) ? value.questions : Array.isArray(value?.questionBank) ? value.questionBank : [];
const questionUid = question => question?.questionUid || `${question?.sourcePath || 'unknown'}|${question?.examId || 'unknown'}|${question?.id ?? question?.qid}`;

export function buildTargetedRecheckPlan(previousQuestions = [], currentQuestions = [], { previousDependencies = {}, currentDependencies = {}, previousAxisInputShas = {}, currentAxisInputShas = null } = {}) {
  const currentAxes = currentAxisInputShas || computeAxisInputShaMap(currentQuestions);
  const diff = semanticDiff(previousQuestions, currentQuestions, { previousDependencies, currentDependencies });
  const impact = changeImpactMap(diff, currentQuestions, { previousAxisInputShas, currentAxisInputShas: currentAxes });
  const previousRows = questionList(previousQuestions);
  const currentRows = questionList(currentQuestions);
  const knownUids = [...new Set([...previousRows, ...currentRows].map(questionUid))];
  const unprovenUids = new Set(previousRows.length > 0 ? knownUids.filter(uid => {
    const relevantAxes = new Set([...Object.keys(previousAxisInputShas?.[uid] || {}), ...Object.keys(currentAxes?.[uid] || {})]);
    if (!relevantAxes.size) return true;
    return [...relevantAxes].some(axis => !previousAxisInputShas?.[uid]?.[axis] || !currentAxes?.[uid]?.[axis]);
  }) : []);
  if (unprovenUids.size) {
    const extraAffected = [...new Set(currentRows.map(questionUid))].filter(uid => unprovenUids.has(uid)).sort().flatMap(uid => {
      const axes = Object.keys(currentAxes?.[uid] || {});
      return (axes.length ? axes : CANONICAL_AXES).map(axis => ({ questionUid: uid, axis, action: 'RECHECK', reasonCodes: ['AXIS_INPUT_PROOF_MISSING'] }));
    });
    const affectedByKey = new Map();
    for (const row of [...(impact.affectedUidAxisSet || []), ...extraAffected]) {
      const key = `${row.questionUid}\u0000${row.axis}`;
      const prior = affectedByKey.get(key);
      affectedByKey.set(key, prior ? { ...prior, reasonCodes: [...new Set([...(prior.reasonCodes || []), ...(row.reasonCodes || [])])].sort() } : row);
    }
    const affectedUidAxisSet = [...affectedByKey.values()].sort((left, right) => `${left.questionUid}:${left.axis}`.localeCompare(`${right.questionUid}:${right.axis}`));
    const reusableUidAxisSet = (impact.reusableUidAxisSet || []).filter(row => !unprovenUids.has(row.questionUid));
    const payload = { semanticDiffSha: diff.semanticDiffSha, affectedUidAxisSet, reusableUidAxisSet: [], globalInvalidatorSet: diff.globalInvalidatorSet || [] };
    payload.reusableUidAxisSet = reusableUidAxisSet;
    const failClosedImpact = { ...impact, affectedUidAxisSet, affectedUidSet: [...new Set(affectedUidAxisSet.map(row => row.questionUid))].sort(), reusableUidAxisSet, affectedUidAxisSetSha: objectSha(affectedUidAxisSet), changeImpactSha: objectSha(payload), proofStatus: 'FAIL_CLOSED_PREVIOUS_OR_CURRENT_AXIS_INPUT_MISSING' };
    return { schemaVersion: SPEED_PIPELINE_VERSION, diff, impact: failClosedImpact, affectedUidSet: failClosedImpact.affectedUidSet, reusableUidAxisSet: failClosedImpact.reusableUidAxisSet, fullFinalAuditRequired: false, reason: 'SEMANTIC_CHANGE_IMPACT_ONLY', proofStatus: failClosedImpact.proofStatus };
  }
  return { schemaVersion: SPEED_PIPELINE_VERSION, diff, impact: { ...impact, proofStatus: 'PASS' }, affectedUidSet: impact.affectedUidSet, reusableUidAxisSet: impact.reusableUidAxisSet, fullFinalAuditRequired: false, reason: 'SEMANTIC_CHANGE_IMPACT_ONLY', proofStatus: 'PASS' };
}

export function validatedPassReuse({ evidence, currentRunInputSha, currentAxisInputSha, reuseReceipt = null, reuseContext = {} } = {}) {
  const result = validateEvidenceFreshness(evidence, { currentRunInputSha, currentAxisInputSha, reuseReceipt, reuseContext });
  return { ...result, reuseStatus: result.status === 'PASS' && result.mode === 'REUSED' ? 'VALIDATED_PASS_REUSE' : result.status === 'PASS' ? 'CURRENT_PASS' : 'REUSE_BLOCKED' };
}

export function renderReusePlan(previousCapture, currentCapture, { globalDependencies = [] } = {}) {
  const impact = detectRenderImpact(previousCapture, currentCapture, { globalDependencies });
  const currentRows = Array.isArray(currentCapture) ? currentCapture : currentCapture?.payload?.itemWitnesses || [];
  return { ...impact, freshRenderCount: impact.affectedRenderUidSet.length, reusedRenderCount: Math.max(0, new Set(currentRows.map(row => row.questionUid)).size - impact.affectedRenderUidSet.length) };
}

export function speedTelemetry({ startedAt = null, questionCount = 0, finalAuditInvocationCount = 0, targetedRecheckInvocationCount = 0, reviewedQuestionAxisCount = 0, reusedPassQuestionAxisCount = 0, repairIterationCount = 0, newSolutionVisualCount = 0, reusedVisualCount = 0, renderFreshCount = 0, renderReusedCount = 0, providerInvocationCount = 0, modelInvocationCount = 0, skipExistingExam = false } = {}) {
  return { version: SPEED_PIPELINE_VERSION, totalElapsedMs: startedAt === null ? null : Math.max(0, Date.now() - startedAt), questionCount, finalAuditInvocationCount, targetedRecheckInvocationCount, reviewedQuestionAxisCount, reusedPassQuestionAxisCount, repairIterationCount, newSolutionVisualCount, reusedVisualCount, renderFreshCount, renderReusedCount, providerInvocationCount, modelInvocationCount, skipExistingExam };
}

export function reuseTelemetry(rows = []) {
  const metrics = evidenceReuseMetrics(rows);
  return { reviewedQuestionAxisCount: rows.filter(row => row.status === 'PASS').length, reusedPassQuestionAxisCount: rows.filter(row => row.status === 'PASS' && row.mode === 'REUSED').length, ...metrics };
}
