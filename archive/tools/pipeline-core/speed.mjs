import { changeImpactMap, computeAxisInputShaMap, semanticDiff } from './semantic-diff.mjs';
import { CANONICAL_AXES } from './projection.mjs';
import { objectSha } from './canonical.mjs';
import { validateEvidenceFreshness, validateFreshEvidenceIndependence, evidenceReuseMetrics, AXIS_REVIEW_BINDING } from './review-evidence-v2.mjs';
import { validateAuditorPacket } from './review-isolation-runner.mjs';
import { detectRenderImpact, evaluateRenderReuseEligibility } from './render-impact.mjs';

export const SPEED_PIPELINE_VERSION = 'APMATH_SPEED_PATH_v1';
export const TARGETED_RECHECK_PHASE_AXES = Object.freeze({
  U1: Object.freeze(['SOURCE', 'MATH_A1', 'V1']),
  U2: Object.freeze(['V2']),
  U3: Object.freeze(['MATH_A2', 'SOLUTION', 'V3', 'RENDER_REVIEW']),
});

const questionList = value => Array.isArray(value) ? value : Array.isArray(value?.questions) ? value.questions : Array.isArray(value?.questionBank) ? value.questionBank : [];
const questionUid = question => question?.questionUid || `${question?.sourcePath || 'unknown'}|${question?.examId || 'unknown'}|${question?.id ?? question?.qid}`;
const pairKey = (row, axis = row?.axis) => `${row?.runId || ''}\u0000${row?.questionUid || ''}\u0000${axis || ''}`;
const axisRows = value => (value || []).map(row => typeof row === 'string' ? { questionUid: row.split('\u0000').at(-2), axis: row.split('\u0000').at(-1) } : row).filter(row => row?.questionUid && row?.axis);

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

export function buildTargetedDispatchPlan({ scope = [], requiredAxesByUid = {}, affectedUidAxisSet = [], reusableUidAxisSet = [], validatedReuseRows = [], renderImpactUidSet = [] } = {}) {
  const affected = new Set(axisRows(affectedUidAxisSet).map(row => pairKey(row)));
  for (const questionUid of renderImpactUidSet || []) affected.add(pairKey({ questionUid }, 'RENDER_REVIEW'));
  const reusable = new Set(axisRows(reusableUidAxisSet).map(row => pairKey(row)));
  const validated = new Set(axisRows(validatedReuseRows).filter(row => row.status === 'PASS' && (row.reuseStatus === 'VALIDATED_PASS_REUSE' || row.reuseStatus === 'CURRENT_PASS' && row.independentEvidenceValidated === true)).map(row => pairKey(row)));
  const phaseScope = Object.fromEntries(Object.keys(TARGETED_RECHECK_PHASE_AXES).map(phase => [phase, []]));
  const freshAxisSet = [], reusedAxisSet = [];
  for (const target of scope || []) {
    const uid = target.questionUid;
    const declared = new Set(requiredAxesByUid?.[uid] || Object.values(TARGETED_RECHECK_PHASE_AXES).flat());
    if (declared.has('RENDER_CAPTURE')) declared.add('RENDER_REVIEW');
    for (const [phase, phaseAxes] of Object.entries(TARGETED_RECHECK_PHASE_AXES)) {
      const relevantAxes = phaseAxes.filter(axis => declared.has(axis));
      const freshAxes = [];
      for (const axis of relevantAxes) {
        const key = pairKey(target, axis);
        if (affected.has(key) || !reusable.has(key) || !validated.has(key)) {
          freshAxes.push(axis);
          freshAxisSet.push({ runId: target.runId, questionUid: uid, axis });
        } else reusedAxisSet.push({ runId: target.runId, questionUid: uid, axis });
      }
      if (freshAxes.length) phaseScope[phase].push({ runId: target.runId, questionUid: uid, axes: freshAxes.sort() });
    }
  }
  for (const phase of Object.keys(phaseScope)) phaseScope[phase].sort((a, b) => `${a.runId}:${a.questionUid}`.localeCompare(`${b.runId}:${b.questionUid}`));
  const freshPhaseSet = Object.keys(phaseScope).filter(phase => phaseScope[phase].length);
  const reusedPhaseSet = Object.keys(phaseScope).filter(phase => !phaseScope[phase].length);
  return {
    schemaVersion: SPEED_PIPELINE_VERSION,
    phaseScope,
    freshPhaseSet,
    reusedPhaseSet,
    freshAxisSet,
    reusedAxisSet,
    validatedReuseRows: axisRows(validatedReuseRows),
    status: freshAxisSet.length ? 'FRESH_TARGETED_AXES_REQUIRED' : 'VALIDATED_PASS_REUSE_ONLY',
  };
}

function currentIndependentEvidenceErrors(evidence, independentContext = {}) {
  const errors = [];
  const { run, packet, launch } = independentContext || {};
  if (!run || !packet || !launch) return ['CURRENT_PASS_INDEPENDENCE_CONTEXT_REQUIRED'];
  errors.push(...validateFreshEvidenceIndependence(evidence, run, packet));
  errors.push(...validateAuditorPacket(packet, { affectedUidSet: launch.scope?.filter(row => row.runId === evidence.runId).map(row => row.questionUid) || run.questions?.map(question => question.questionUid) || [evidence.questionUid], builderId: run.builderId, builderSessionId: run.builderSessionId, candidateContext: independentContext.candidateContext || null }).errors.map(error => `CURRENT_PASS_PACKET_INVALID:${error}`));
  const phase = AXIS_REVIEW_BINDING[evidence?.axis]?.[0];
  const { packetSha, ...boundPacket } = packet;
  if (packetSha !== objectSha(boundPacket)) errors.push('CURRENT_PASS_PACKET_SEAL_INVALID');
  if (evidence.runId !== run.runId || evidence.revision !== run.revision) errors.push('CURRENT_PASS_RUN_BINDING_INVALID');
  if (!phase || launch.status !== 'COMPLETED' || launch.launchId !== evidence.launchId || launch.externalId !== evidence.externalTaskId || launch.auditorId !== evidence.reviewerId) errors.push('CURRENT_PASS_LAUNCH_BINDING_INVALID');
  if (phase && (launch.contexts?.[phase]?.sessionId !== evidence.reviewSessionId || launch.contexts?.[phase]?.contextId !== packet.contextId)) errors.push('CURRENT_PASS_CONTEXT_BINDING_INVALID');
  if (!launch.scope?.some(row => row.runId === evidence.runId && row.questionUid === evidence.questionUid)) errors.push('CURRENT_PASS_SCOPE_BINDING_INVALID');
  return [...new Set(errors)];
}

export function validatedPassReuse({ evidence, currentRunInputSha, currentAxisInputSha, reuseReceipt = null, reuseContext = {}, independentContext = null } = {}) {
  const result = validateEvidenceFreshness(evidence, { currentRunInputSha, currentAxisInputSha, reuseReceipt, reuseContext });
  if (result.status === 'PASS' && result.mode === 'FRESH') {
    const errors = currentIndependentEvidenceErrors(evidence, independentContext);
    if (errors.length) return { ...result, status: 'BLOCKED', errors: [...result.errors, ...errors], reuseStatus: 'REUSE_BLOCKED' };
    return { ...result, reuseStatus: 'CURRENT_PASS', independentEvidenceValidated: true };
  }
  return { ...result, reuseStatus: result.status === 'PASS' && result.mode === 'REUSED' ? 'VALIDATED_PASS_REUSE' : 'REUSE_BLOCKED' };
}

export function renderReusePlan(previousCapture, currentCapture, { globalDependencies = [] } = {}) {
  const impact = detectRenderImpact(previousCapture, currentCapture, { globalDependencies });
  const currentRows = Array.isArray(currentCapture) ? currentCapture : currentCapture?.payload?.itemWitnesses || [];
  const previousIdentity = Array.isArray(previousCapture) ? null : previousCapture?.payload?.renderIdentity || null;
  const currentIdentity = Array.isArray(currentCapture) ? null : currentCapture?.payload?.renderIdentity || null;
  const preCaptureReuse = globalDependencies.length
    ? { status: 'FRESH_REQUIRED', reasonCodes: ['GLOBAL_RUNTIME_INVALIDATOR'], globalInvalidatorSet: [...new Set(globalDependencies)].sort() }
    : previousIdentity && currentIdentity
    ? evaluateRenderReuseEligibility({ previousIdentity, currentIdentity, priorStatus: previousCapture.status === 'PASS' ? 'PASS' : 'STALE', lifecycleStatus: currentCapture.payload?.renderLifecycleStatus || 'VALID' })
    : { status: 'FRESH_REQUIRED', reasonCodes: ['RENDER_REUSE_IDENTITY_MISSING'] };
  return { ...impact, preCaptureReuse, freshRenderCount: impact.affectedRenderUidSet.length, reusedRenderCount: Math.max(0, new Set(currentRows.map(row => row.questionUid)).size - impact.affectedRenderUidSet.length) };
}

const timing = value => Object.fromEntries(Object.entries(value || {}).map(([key, raw]) => [key, Number.isFinite(raw) && raw >= 0 ? raw : null]));

export function providerTelemetryFromReceipts(receipts = []) {
  const completed = receipts.filter(receipt => receipt?.status === 'COMPLETED' && receipt.launchId);
  const modelInvocationCount = receipts.reduce((total, receipt) => total + (Number.isSafeInteger(receipt?.modelInvocationCount) && receipt.modelInvocationCount >= 0 ? receipt.modelInvocationCount : 0), 0);
  return { providerInvocationCount: completed.length, modelInvocationCount };
}

export function speedTelemetry({ startedAt = null, questionCount = 0, finalAuditInvocationCount = 0, targetedRecheckInvocationCount = 0, reviewedQuestionAxisCount = 0, reusedPassQuestionAxisCount = 0, repairIterationCount = 0, newSolutionVisualCount = 0, reusedVisualCount = 0, renderFreshCount = 0, renderReusedCount = 0, providerInvocationCount = 0, modelInvocationCount = 0, skipExistingExam = false, phaseTimings = {}, renderTimings = {}, auditTimings = {}, freshPhaseSet = [], reusedPhaseSet = [], freshAxisSet = [], reusedAxisSet = [], screenshotStats = {} } = {}) {
  return {
    version: SPEED_PIPELINE_VERSION,
    totalElapsedMs: startedAt === null ? null : Math.max(0, Date.now() - startedAt),
    questionCount,
    finalAuditInvocationCount,
    targetedRecheckInvocationCount,
    reviewedQuestionAxisCount,
    reusedPassQuestionAxisCount,
    repairIterationCount,
    newSolutionVisualCount,
    reusedVisualCount,
    renderFreshCount,
    renderReusedCount,
    providerInvocationCount,
    modelInvocationCount,
    skipExistingExam,
    phaseTimings: timing(phaseTimings),
    renderTimings: timing(renderTimings),
    auditTimings: timing(auditTimings),
    freshPhaseSet: [...freshPhaseSet],
    reusedPhaseSet: [...reusedPhaseSet],
    freshAxisSet: [...freshAxisSet],
    reusedAxisSet: [...reusedAxisSet],
    screenshotStats: { count: screenshotStats.count ?? 0, bytes: screenshotStats.bytes ?? 0, encodeMs: screenshotStats.encodeMs ?? 0, writeMs: screenshotStats.writeMs ?? 0 },
  };
}

export function reuseTelemetry(rows = []) {
  const metrics = evidenceReuseMetrics(rows);
  return { reviewedQuestionAxisCount: rows.filter(row => row.status === 'PASS').length, reusedPassQuestionAxisCount: rows.filter(row => row.status === 'PASS' && row.mode === 'REUSED').length, ...metrics };
}
