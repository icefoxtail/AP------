import { canonicalJson, objectSha, nonempty } from './canonical.mjs';
import { capabilityForRoute } from './recovery-capability.mjs';

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

export const CANONICAL_DEFECT_CLASSES = Object.freeze([
  'EXTRACTION_DEFECT',
  'ANSWER_KEY_CONFLICT',
  'SOURCE_PAYLOAD_DEFECT',
  'CANDIDATE_MATH_DEFECT',
  'SOLUTION_DEFECT',
  'VISUAL_DEFECT',
  'AUTHORITY_DEFECT',
  'EXECUTION_DEFECT',
  'REVIEW_CONFLICT',
]);

const CLASS_ROUTE = Object.freeze({
  EXTRACTION_DEFECT: REPAIR_ROUTES.EXTRACTION,
  ANSWER_KEY_CONFLICT: REPAIR_ROUTES.ANSWER,
  SOURCE_PAYLOAD_DEFECT: REPAIR_ROUTES.SOURCE,
  SOURCE_DEFECT: REPAIR_ROUTES.SOURCE,
  CANDIDATE_MATH_DEFECT: REPAIR_ROUTES.CANDIDATE,
  SOLUTION_DEFECT: REPAIR_ROUTES.CANDIDATE,
  VISUAL_DEFECT: REPAIR_ROUTES.VISUAL,
  AUTHORITY_DEFECT: REPAIR_ROUTES.AUTHORITY,
  EXECUTION_DEFECT: REPAIR_ROUTES.EXECUTION,
  REVIEW_CONFLICT: REPAIR_ROUTES.HUMAN,
});

const TYPE_ROUTE = Object.freeze({
  VISUAL_DEPENDENCY_UNVERIFIED: REPAIR_ROUTES.VISUAL,
  VISUAL_EVIDENCE_MISSING: REPAIR_ROUTES.VISUAL,
  MISSING_ARTIFACT: REPAIR_ROUTES.VISUAL,
  MISSING_RENDER_WITNESS: REPAIR_ROUTES.VISUAL,
  LOGICAL_AND_GEOMETRIC_ERROR: REPAIR_ROUTES.SOURCE,
  SOURCE_LOGICAL_AMBIGUITY: REPAIR_ROUTES.SOURCE,
  SOURCE_QUESTION_NON_UNIQUE: REPAIR_ROUTES.SOURCE,
  SOURCE_DEFECT: REPAIR_ROUTES.SOURCE,
  SOURCE_PAYLOAD_DEFECT: REPAIR_ROUTES.SOURCE,
  ANSWER_RUBRIC_AUTHORITY: REPAIR_ROUTES.AUTHORITY,
  UNFINALIZED_AUTHORITY: REPAIR_ROUTES.AUTHORITY,
  PROVIDER_INPUT_ENVELOPE_INVALID: REPAIR_ROUTES.EXECUTION,
  PROVIDER_TRANSPORT_UNAVAILABLE: REPAIR_ROUTES.EXECUTION,
  MODEL_STATE_AMBIGUOUS_FAILURE: REPAIR_ROUTES.EXECUTION,
  PRE_MODEL_EXECUTION_FAILURE: REPAIR_ROUTES.EXECUTION,
});

const textOf = defect => [
  defect?.type,
  defect?.code,
  defect?.reason,
  defect?.defectType,
  defect?.category,
  defect?.message,
  defect?.description,
  defect?.defect,
].filter(nonempty).join(' ').toUpperCase();

const has = (value, pattern) => pattern.test(value);

const normalized = value => nonempty(value) ? value.trim().toUpperCase().replace(/[ -]+/g, '_') : null;

function structuredDefectClass(defect) {
  const candidates = [
    defect?.defectClass,
    defect?.canonicalDefectClass,
    defect?.classification?.defectClass,
    defect?.sourceDefect?.defectClass,
    defect?.sourceDefect?.category,
    defect?.structuredSourceDefect?.defectClass,
    defect?.structuredSourceDefect?.category,
  ];
  for (const candidate of candidates) {
    const value = normalized(candidate);
    if (value && CANONICAL_DEFECT_CLASSES.includes(value)) return { value, source: 'STRUCTURED' };
  }
  if (defect?.sourceDefect === true) return { value: 'SOURCE_PAYLOAD_DEFECT', source: 'STRUCTURED_BOOLEAN' };
  return null;
}

function explicitTypeRoute(defect) {
  const type = normalized(defect?.type || defect?.defectType || defect?.code);
  return type && TYPE_ROUTE[type] ? { value: type, route: TYPE_ROUTE[type], source: 'EXPLICIT_TYPE' } : null;
}

function legacyTextRoute(defect, text) {
  // These narrow phrases preserve routing for older receipts that predate the
  // canonical defectClass field.  They are intentionally below structured
  // class, phase/axis, and explicit type routing.
  if (has(text, /합성함수|RENDERWITNESSES|PACKET.*그림|그림.*PACKET|DIAGRAM.*PACKET/)) return { route: REPAIR_ROUTES.VISUAL, source: 'LEGACY_TEXT' };
  if (has(text, /최솟값이 존재하지|논리적? 모호|명제의 문장|UNDERDETERMINED|SOURCE.*AMBIGU/)) return { route: REPAIR_ROUTES.SOURCE, source: 'LEGACY_TEXT' };
  return null;
}

function routeCapability(route, options) {
  const row = capabilityForRoute(options.capabilityRegistry, route);
  if (row) return { status: row.available ? 'ACTIVE' : 'UNAVAILABLE', available: row.available === true, row };
  if (route === REPAIR_ROUTES.SOURCE && options.sourceRecoveryCapability !== undefined && options.sourceRecoveryCapability !== null) {
    const value = typeof options.sourceRecoveryCapability === 'object'
      ? options.sourceRecoveryCapability
      : { available: String(options.sourceRecoveryCapability).toUpperCase() === 'ACTIVE', reason: String(options.sourceRecoveryCapability).toUpperCase() };
    const active = value.available === true || String(value.status || '').toUpperCase() === 'ACTIVE';
    return { status: active ? 'UNPROBED' : 'UNAVAILABLE', available: active ? null : false, row: active ? { ...value, reason: 'CAPABILITY_PROBE_REQUIRED' } : value, blockUnknown: active };
  }
  return { status: 'UNPROBED', available: null, row: null, blockUnknown: false };
}

export function routeDefect(defect = {}, options = {}) {
  const text = textOf(defect);
  let route = REPAIR_ROUTES.CANDIDATE;
  let classificationSource = 'DEFAULT';
  const explicitClass = structuredDefectClass(defect);
  const phase = normalized(defect?.phase);
  const axis = normalized(defect?.axis);
  const phaseAxisRoute = axis && /EXECUTION|TRANSPORT|PROTOCOL/.test(axis)
    ? REPAIR_ROUTES.EXECUTION
    : axis && /AUTHORITY|ADJUDICATION/.test(axis)
      ? REPAIR_ROUTES.AUTHORITY
      : phase === 'U2' && /V2|VISUAL|RENDER/.test(axis || '')
        ? REPAIR_ROUTES.VISUAL
        : phase === 'U1' && /SOURCE|EXTRACTION/.test(axis || '')
          ? REPAIR_ROUTES.EXTRACTION
          : phase === 'U3' && /SOURCE|PAYLOAD/.test(axis || '')
            ? REPAIR_ROUTES.SOURCE
            : null;
  const typed = explicitTypeRoute(defect);
  const legacy = legacyTextRoute(defect, text);
  if (explicitClass) {
    route = CLASS_ROUTE[explicitClass.value];
    classificationSource = explicitClass.source;
  } else if (phaseAxisRoute) {
    route = phaseAxisRoute;
    classificationSource = 'PHASE_AXIS';
  } else if (typed) {
    route = typed.route;
    classificationSource = typed.source;
  } else if (legacy) {
    route = legacy.route;
    classificationSource = legacy.source;
  } else if (has(text, /EXTRACTION|OCR|SOURCE_FIDELITY|TEXT_MISMATCH|CHOICE_MISMATCH/)) route = REPAIR_ROUTES.EXTRACTION;
  else if (has(text, /AUTHORITY|ADJUDICATION|UNFINALIZED|RUBRIC|METADATA|CURRICULUM/)) route = REPAIR_ROUTES.AUTHORITY;
  else if (has(text, /ANSWER_KEY|ANSWER_CONFLICT|NO_CORRECT|MULTIPLE_CORRECT/)) route = REPAIR_ROUTES.ANSWER;
  else if (has(text, /SOURCE_DEFECT|SOURCE_PAYLOAD|UNDERDETERMINED|MISSING_CONDITION|CONTRADICTORY|INVALID_DOMAIN|INVALID_RANGE|LOGICAL_AMBIGUITY|SOURCE_TEXT/)) route = REPAIR_ROUTES.SOURCE;
  else if (has(text, /VISUAL|IMAGE|ARTIFACT|RENDER|DIAGRAM/)) route = REPAIR_ROUTES.VISUAL;
  const requestedRoute = route;
  const capability = routeCapability(route, options);
  const capabilityBlocked = capability.available === false || capability.blockUnknown === true;
  return {
    route: capabilityBlocked ? REPAIR_ROUTES.HUMAN : route,
    requestedRoute,
    automatic: !capabilityBlocked && route !== REPAIR_ROUTES.HUMAN,
    capability: capability.status,
    capabilityDetail: capability.row,
    capabilityReason: capabilityBlocked ? (capability.row?.reason || 'RECOVERY_CAPABILITY_NOT_IMPLEMENTED') : null,
    classificationSource,
    defectClass: explicitClass?.value || null,
    requiresDerivedReplacement: requestedRoute === REPAIR_ROUTES.SOURCE && !capabilityBlocked,
    requiresUserDecision: capabilityBlocked,
  };
}

const fingerprintFields = defect => ({
  runId: defect?.runId || null,
  questionUid: defect?.questionUid || null,
  phase: defect?.phase || null,
  axis: defect?.axis || null,
  defectType: structuredDefectClass(defect)?.value || defect?.type || defect?.defectType || defect?.code || null,
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
  const routingOptions = !options.capabilityRegistry && options.sourceRecoveryCapability === undefined
    ? { ...options, sourceRecoveryCapability: 'UNAVAILABLE' }
    : options;
  const routed = routeDefects(defects, routingOptions);
  const dispositionRoutes = dispositions.map(disposition => {
    if (disposition?.disposition === 'SOURCE_DEFECT_CONFIRMED') {
      const sourceRoute = routeDefect({ ...disposition, defectClass: 'SOURCE_PAYLOAD_DEFECT' }, routingOptions);
      return { ...disposition, route: sourceRoute.route, requestedRoute: REPAIR_ROUTES.SOURCE, automatic: sourceRoute.automatic, requiresDerivedReplacement: sourceRoute.capability !== 'UNAVAILABLE', requiresUserDecision: sourceRoute.requiresUserDecision, capability: sourceRoute.capability, capabilityReason: sourceRoute.capabilityReason };
    }
    if (disposition?.disposition === 'HOLD') return { ...disposition, route: REPAIR_ROUTES.HUMAN, automatic: false, requiresUserDecision: true };
    return disposition;
  });
  const routes = [...new Set([
    ...routed.map(defect => defect.route),
    ...dispositionRoutes.map(row => row.route).filter(nonempty),
  ])];
  const human = routed.some(defect => defect.requiresUserDecision) || dispositionRoutes.some(row => row.requiresUserDecision);
  const repairKind = dispositions.length > 0 && dispositions.every(row => ['AUDITOR_FALSE_POSITIVE', 'NO_CHANGE_WITH_EVIDENCE'].includes(row?.disposition)) ? 'REVIEW_ONLY_RESOLUTION' : 'SEMANTIC_REPAIR';
  return {
    protocol: 'SIMILAR_PROTOCOL',
    status: human ? 'HUMAN_DECISION_REQUIRED' : 'AUTO_REPAIR_REQUIRED',
    routes,
    defects: routed.map(({ runId, questionUid, defectFingerprint: fingerprint, route, requestedRoute, automatic, requiresDerivedReplacement, capability, capabilityReason, classificationSource, defectClass }) => ({ runId, questionUid, defectFingerprint: fingerprint, route, requestedRoute, automatic, requiresDerivedReplacement, capability, capabilityReason, classificationSource, defectClass })),
    dispositions: dispositionRoutes,
    repairKind,
    bounded: true,
    maxRepairIterations: options.maxRepairIterations || 3,
  };
}

export function nextWorkBatchAction(state, options = {}) {
  const status = state?.status;
  const lastHold = state?.lastHold?.code || null;
  const failedExecution = [...(state?.launches || [])].reverse().find(launch => launch.status === 'FAILED' && launch.executionFailureClass);
  if (status === 'HOLD' && (failedExecution || state?.lastHold?.failureClass)) {
    const failure = failedExecution || state.lastHold;
    const attempts = (state?.executionRecovery?.attempts || []).filter(attempt => attempt.freezeSha === failure.freezeSha);
    const repeated = attempts.some(attempt => attempt.fingerprint === failure.executionFailureFingerprint || attempt.fingerprint === failure.fingerprint);
    if (repeated) return { action: 'HUMAN_DECISION_REQUIRED', status: 'EXECUTION_RECOVERY_STAGNATION', reason: 'HUMAN_DECISION_REQUIRED:IDENTICAL_EXECUTION_FAILURE', failureClass: failure.executionFailureClass, failedLaunchId: failure.launchId || failure.failedLaunchId, executionAttempt: attempts.length };
    if (attempts.length >= 2) return { action: 'HUMAN_DECISION_REQUIRED', status: 'EXECUTION_RECOVERY_EXHAUSTED', reason: 'HUMAN_DECISION_REQUIRED:EXECUTION_RECOVERY_LIMIT', failureClass: failure.executionFailureClass, failedLaunchId: failure.launchId || failure.failedLaunchId, executionAttempt: attempts.length };
    return { action: 'EXECUTION_RECOVERY', nextAction: 'START_FRESH_REVIEW_ATTEMPT', status: 'RECOVERY_AVAILABLE', failureClass: failure.executionFailureClass, failedLaunchId: failure.launchId || failure.failedLaunchId, freezeSha: failure.freezeSha || null, executionAttempt: attempts.length + 1, maxExecutionRecoveryAttempts: 2 };
  }
  if (status === 'REPAIR_REQUIRED') {
    const conflicts = (state.openDefects || []).filter(d => d.type === 'REVIEW_CONFLICT' || d.defectClass === 'REVIEW_CONFLICT');
    if (conflicts.length) return { action: 'HUMAN_DECISION_REQUIRED', status: 'REVIEW_CONFLICT', reason: 'REVIEW_CONFLICT', conflicts, conditionalReview: { purpose: 'SECOND_AUDIT', reason: 'CONFLICT', explicitAuthorizationRequired: true, automaticLaunch: false } };
    const recorded = state.repairIterations?.at(-1);
    if (recorded?.status === 'REPAIR_RECORDED') return { action: 'FREEZE_RECORDED_REPAIR', status: 'REPAIR_ALREADY_MATERIALIZED' };
    const plan = buildRepairPlan(state.openDefects || [], [], options);
    return { action: plan.status === 'HUMAN_DECISION_REQUIRED' ? 'HUMAN_DECISION_REQUIRED' : 'AUTO_REPAIR', status: plan.status, reason: plan.defects.find(defect => defect.capabilityReason)?.capabilityReason || null, plan };
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
