import { canonicalJson, objectSha, nonempty } from './canonical.mjs';

// Defect routing is deliberately separate from the work-batch reducer.  The
// reducer owns budget, hashes, and immutable lineage; this module answers the
// quality question: which bounded recovery lane should receive a finding?
export const REPAIR_ROUTES = Object.freeze({
  EXTRACTION: 'SOURCE_FIDELITY_RESTORATION',
  ANSWER: 'ANSWER_KEY_RECOVERY',
  SOURCE: 'DERIVED_SOURCE_RECOVERY',
  CANDIDATE: 'CANDIDATE_REPAIR',
  VISUAL: 'VISUAL_EVIDENCE_REPAIR',
  AUTHORITY: 'AUTHORITY_BINDING_REPAIR',
  EXECUTION: 'EXECUTION_RECOVERY',
  HUMAN: 'HUMAN_DECISION_REQUIRED'
});

const textOf = defect => [
  defect?.type,
  defect?.code,
  defect?.reason,
  defect?.defectType,
  defect?.category,
  defect?.message
].filter(nonempty).join(' ').toUpperCase();

const has = (value, pattern) => pattern.test(value);

export function routeDefect(defect = {}, { sourceRecoveryCapability = 'ACTIVE' } = {}) {
  const text = textOf(defect);
  let route = REPAIR_ROUTES.CANDIDATE;
  if (has(text, /PROVIDER|TRANSPORT|CODEX|SLOT|TIMEOUT|PROTOCOL|DISPATCH|EXECUTION|INPUT_ENVELOPE/)) route = REPAIR_ROUTES.EXECUTION;
  else if (has(text, /EXTRACTION|OCR|SOURCE_FIDELITY|TEXT_MISMATCH|CHOICE_MISMATCH/)) route = REPAIR_ROUTES.EXTRACTION;
  else if (has(text, /AUTHORITY|ADJUDICATION|UNFINALIZED|RUBRIC|METADATA|CURRICULUM/)) route = REPAIR_ROUTES.AUTHORITY;
  else if (has(text, /ANSWER_KEY|ANSWER_CONFLICT|NO_CORRECT|MULTIPLE_CORRECT/)) route = REPAIR_ROUTES.ANSWER;
  else if (defect?.sourceDefect === true || has(text, /SOURCE_DEFECT|SOURCE_PAYLOAD|UNDERDETERMINED|MISSING_CONDITION|CONTRADICTORY|INVALID_DOMAIN|INVALID_RANGE|LOGICAL_AMBIGUITY|SOURCE_TEXT/)) route = REPAIR_ROUTES.SOURCE;
  else if (has(text, /VISUAL|IMAGE|ARTIFACT|RENDER|GEOMETRY|DIAGRAM/)) route = REPAIR_ROUTES.VISUAL;
  const capabilityBlocked = route === REPAIR_ROUTES.SOURCE && ['UNAVAILABLE', 'BLOCKED', 'DEFERRED'].includes(String(sourceRecoveryCapability).toUpperCase());
  return {
    route: capabilityBlocked ? REPAIR_ROUTES.HUMAN : route,
    automatic: !capabilityBlocked && route !== REPAIR_ROUTES.HUMAN,
    capability: route === REPAIR_ROUTES.SOURCE ? String(sourceRecoveryCapability).toUpperCase() : 'NOT_APPLICABLE',
    requiresDerivedReplacement: route === REPAIR_ROUTES.SOURCE && !capabilityBlocked,
    requiresUserDecision: capabilityBlocked,
  };
}

const fingerprintFields = defect => ({
  runId: defect?.runId || null,
  questionUid: defect?.questionUid || null,
  phase: defect?.phase || null,
  axis: defect?.axis || null,
  defectType: defect?.type || defect?.defectType || defect?.code || null,
  reason: defect?.reason || null,
  semanticHash: defect?.semanticHash || null,
  inputBinding: defect?.inputSha || defect?.axisInputSha || defect?.inputBinding || null,
});

export function defectFingerprint(defect = {}) {
  const fields = fingerprintFields(defect);
  const semanticHash = fields.semanticHash || objectSha({
    defectType: fields.defectType,
    reason: fields.reason,
    phase: fields.phase,
    axis: fields.axis,
  });
  return `sha256:${objectSha({ ...fields, semanticHash })}`.replace(/^sha256:sha256:/, 'sha256:');
}

export function routeDefects(defects = [], options = {}) {
  return defects.map(defect => ({
    ...defect,
    defectFingerprint: defect?.defectFingerprint || defectFingerprint(defect),
    ...routeDefect(defect, options),
  }));
}

export function defectFingerprintSet(defects = [], options = {}) {
  return [...new Set(routeDefects(defects, options).map(defect => defect.defectFingerprint))].sort();
}

export function buildRepairPlan(defects = [], dispositions = [], options = {}) {
  const routed = routeDefects(defects, options);
  const dispositionRoutes = dispositions.map(disposition => {
    if (disposition?.disposition === 'SOURCE_DEFECT_CONFIRMED') return { ...disposition, route: REPAIR_ROUTES.SOURCE, automatic: true, requiresDerivedReplacement: true };
    if (disposition?.disposition === 'HOLD') return { ...disposition, route: REPAIR_ROUTES.HUMAN, automatic: false, requiresUserDecision: true };
    return disposition;
  });
  const routes = [...new Set([
    ...routed.map(defect => defect.route),
    ...dispositionRoutes.map(row => row.route).filter(nonempty),
  ])];
  const human = routed.some(defect => defect.requiresUserDecision) || dispositionRoutes.some(row => row.requiresUserDecision);
  return {
    protocol: 'SIMILAR_PROTOCOL',
    status: human ? 'HUMAN_DECISION_REQUIRED' : 'AUTO_REPAIR_REQUIRED',
    routes,
    defects: routed.map(({ runId, questionUid, defectFingerprint: fingerprint, route, automatic, requiresDerivedReplacement, capability }) => ({ runId, questionUid, defectFingerprint: fingerprint, route, automatic, requiresDerivedReplacement, capability })),
    dispositions: dispositionRoutes,
    bounded: true,
    maxRepairIterations: options.maxRepairIterations || 3,
  };
}

export function nextWorkBatchAction(state, options = {}) {
  const status = state?.status;
  const lastHold = state?.lastHold?.code || null;
  if (status === 'REPAIR_REQUIRED') {
    const plan = buildRepairPlan(state.openDefects || [], [], options);
    return { action: plan.status === 'HUMAN_DECISION_REQUIRED' ? 'HUMAN_DECISION_REQUIRED' : 'AUTO_REPAIR', status: plan.status, plan };
  }
  if (status === 'FROZEN') {
    const finalCompleted = state.launches?.some(launch => launch.purpose === 'FINAL_AUDIT' && launch.status === 'COMPLETED');
    const open = (state.openDefectSet || []).length > 0;
    if (finalCompleted && !open && state.repairIterations?.every(iteration => iteration.status === 'CLOSED')) return { action: 'CLOSURE', status: 'READY_FOR_CLOSURE' };
    return { action: finalCompleted ? 'TARGETED_RECHECK' : 'FINAL_AUDIT', status: 'REVIEW_READY' };
  }
  if (status === 'PRODUCTION') return { action: 'BUILD_AND_FREEZE', status: 'BUILD_REQUIRED' };
  if (status === 'HOLD' && lastHold === 'HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED') return { action: 'WAIT_FOR_SLOT', status: 'TRANSIENT_WAIT' };
  if (status === 'HOLD' && /^HOLD:(REPAIR_ITERATION_LIMIT|REPAIR_STAGNATION)$/.test(lastHold || '')) return { action: 'TERMINAL_REPAIR_HOLD', status: 'HUMAN_DECISION_REQUIRED', reason: lastHold };
  if (status === 'HOLD') return { action: 'TECHNICAL_HOLD', status: 'HUMAN_DECISION_REQUIRED', reason: lastHold };
  return { action: 'RECONCILE_REQUIRED', status: 'RECONCILE_REQUIRED' };
}

export function repairPlanSha(plan) {
  return objectSha(JSON.parse(canonicalJson(plan)));
}
