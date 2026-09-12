import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { bytesSha, canonicalJson, fileRef, nonempty, objectSha, readBoundFile, safePath, writeNewJson } from './canonical.mjs';
import { loadBoundQuestionBanks } from './closure.mjs';
import { loadCandidateReviewContext, validateAuditorPacket, visualApplicabilityForQuestion, VISUAL_ONLY_DEFECT_TYPES } from './review-isolation-runner.mjs';
import { assertFreshLaunchIdentity, freezeInputSha, maxRepairIterationsForState, readWorkBatch, reconcileWorkBatchReview, reviewScopeForPurpose } from './work-batch.mjs';
import { observeModelRoute, isBenchmarkJobKind, validateModelRouteParity } from './gold-contract.mjs';

export const PROVIDER_BRIDGE_VERSION = 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1';
const PHASES = Object.freeze(['U1', 'U2', 'U3']);
const check = (condition, code) => { if (!condition) throw new Error(`HOLD:${code}`); };
const same = (left, right) => canonicalJson(left) === canonicalJson(right);
const mimeFor = relative => ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[path.extname(relative).toLowerCase()] || 'application/octet-stream');

export function visualAssetPayload(root, ref) {
  const bytes = readBoundFile(root, ref);
  return { ...ref, mimeType: mimeFor(ref.path), dataUrl: `data:${mimeFor(ref.path)};base64,${bytes.toString('base64')}` };
}

export const sourceVisualAssetPayload = visualAssetPayload;

function bridgePath(root, relative, { mustExist = false } = {}) {
  check(typeof relative === 'string' && relative.startsWith('alive/runtime/provider-bridge/'), 'PROVIDER_BRIDGE_RUNTIME_PATH_REQUIRED');
  return safePath(root, relative, { mustExist });
}

function writeBridgeJson(root, relative, value) {
  const target = bridgePath(root, relative);
  writeNewJson(target, value);
  return fileRef(root, relative);
}

function loadBridgeJson(root, relative) {
  const ref = fileRef(root, relative);
  return { ref, value: JSON.parse(readBoundFile(root, ref).toString('utf8')) };
}

function transportCall(transport, request) {
  check(nonempty(transport?.command), 'PROVIDER_TRANSPORT_COMMAND_REQUIRED');
  check(Array.isArray(transport.args || []) && transport.args.every(nonempty), 'PROVIDER_TRANSPORT_ARGS_INVALID');
  const result = spawnSync(transport.command, transport.args || [], {
    encoding: 'utf8',
    input: canonicalJson(request),
    shell: false,
    windowsHide: true,
    maxBuffer: 8 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) throw new Error('HOLD:PROVIDER_TRANSPORT_UNAVAILABLE');
  try { return JSON.parse(result.stdout); } catch { throw new Error('HOLD:PROVIDER_TRANSPORT_RESPONSE_INVALID'); }
}

function contextMap(contexts, builderSessionId, controlSessionId = null) {
  check(contexts && typeof contexts === 'object' && PHASES.every(phase => nonempty(contexts[phase]?.sessionId) && nonempty(contexts[phase]?.contextId)), 'PROVIDER_CONTEXT_ATTESTATION_REQUIRED');
  const sessions = PHASES.map(phase => contexts[phase].sessionId);
  const contextIds = PHASES.map(phase => contexts[phase].contextId);
  check(new Set(sessions).size === PHASES.length && new Set(contextIds).size === PHASES.length, 'PROVIDER_CONTEXT_IDENTITY_COLLISION');
  check(!sessions.includes(builderSessionId), 'PROVIDER_BUILDER_SESSION_COLLISION');
  if (controlSessionId) check(!sessions.includes(controlSessionId), 'PROVIDER_CONTROL_SESSION_COLLISION');
  return Object.fromEntries(PHASES.map(phase => [phase, { sessionId: contexts[phase].sessionId, contextId: contexts[phase].contextId }]));
}

function validatePreflightResponse(response, request, executionIdentity = null) {
  check(response?.schemaVersion === PROVIDER_BRIDGE_VERSION && response.operation === 'PREPARE_STATELESS_FINAL_AUDIT' && response.status === 'READY', 'PROVIDER_PREFLIGHT_RESPONSE_INVALID');
  check(request.requestSha === objectSha(Object.fromEntries(Object.entries(request).filter(([key]) => key !== 'requestSha'))) && response.requestSha === request.requestSha, 'PROVIDER_PREFLIGHT_INPUT_BINDING');
  check(nonempty(response.provider) && nonempty(response.model) && nonempty(response.externalTaskId), 'PROVIDER_IDENTITY_ATTESTATION_REQUIRED');
  check(nonempty(response.auditorId) && response.auditorId !== request.builderId && nonempty(response.auditorSessionId) && response.auditorSessionId !== request.builderSessionId, 'PROVIDER_AUDITOR_SEPARATION_REQUIRED');
  check(response.contextIsolation === 'STATELESS_INPUTS' && response.subagentToolsEnabled === false && response.modelInvocationCount === 0, 'PROVIDER_PREFLIGHT_CAPABILITY_INVALID');
  check(nonempty(response.runtimeAttestation), 'PROVIDER_RUNTIME_ATTESTATION_REQUIRED');
  const route = observeModelRoute(response, new Date().toISOString());
  return { contexts: contextMap(response.contexts, request.builderSessionId, response.auditorSessionId), route };
}

function plannedLaunch(state, purpose) {
  check(state.status === 'FROZEN', 'WHOLE_JOB_FREEZE_REQUIRED');
  check(!state.launches.some(launch => ['RESERVED', 'DISPATCHED'].includes(launch.status)), 'RECONCILE_EXISTING_EXPENSIVE_TASK');
  const freeze = state.freezes.at(-1);
  check(freeze, 'WHOLE_JOB_FREEZE_REQUIRED');
  if (purpose === 'FINAL_AUDIT') check(state.launches.length === 0 && state.freezes.length === 1, 'FINAL_AUDITOR_ALREADY_USED');
  if (purpose === 'TARGETED_RECHECK') {
    const repairCount = state.launches.filter(launch => launch.purpose === 'TARGETED_RECHECK').length;
    check(state.launches.some(launch => launch.purpose === 'FINAL_AUDIT' && launch.status === 'COMPLETED') && state.freezes.length === repairCount + 2 && freeze.affected.length > 0, 'TARGETED_CHANGE_REQUIRED');
    check(repairCount < maxRepairIterationsForState(state), 'REPAIR_ITERATION_LIMIT');
    if (state.workflowProfile === 'PAST_EXAM' && state.repairIterations?.length) check(state.repairIterations?.at(-1)?.status === 'FROZEN_FOR_RECHECK', 'REPAIR_NOT_FROZEN_FOR_RECHECK');
  }
  check(['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(purpose), 'PROVIDER_BRIDGE_PURPOSE_INVALID');
  const scope = reviewScopeForPurpose(state, freeze, purpose);
  if (isBenchmarkJobKind(state.jobKind) && purpose === 'TARGETED_RECHECK') check(scope.length > 0, 'GOLD_BENCHMARK_RECHECK_SCOPE_EMPTY');
  return { freeze, launchId: `${state.workBatchId}:${state.launches.length + 1}`, scope };
}

// This is control-plane only. A provider must attest modelInvocationCount: 0;
// the three model invocations are issued later through dispatchProviderReview.
export function prepareProviderReview(root, { workBatchId, purpose, transport, planPath }) {
  const state = readWorkBatch(root, workBatchId);
  const { freeze, launchId, scope } = plannedLaunch(state, purpose);
  const body = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    operation: 'PREPARE_STATELESS_FINAL_AUDIT',
    workBatchId,
    purpose,
    launchId,
    freezeSha: freeze.freezeSha,
    scope,
    builderId: state.builderId,
    builderSessionId: state.builderSessionId,
    requestedModel: state.executionIdentity?.requestedModel || null,
    requestedReasoningEffort: state.executionIdentity?.requestedReasoningEffort || null,
    jobKind: state.jobKind || 'PRODUCTION',
    workflowProfile: state.workflowProfile || 'LEGACY',
    inputSha: freezeInputSha(freeze),
    repairIteration: purpose === 'TARGETED_RECHECK' ? state.launches.filter(launch => launch.purpose === 'TARGETED_RECHECK').length + 1 : 0,
    requiredCapabilities: {
      contexts: PHASES,
      contextIsolation: 'STATELESS_INPUTS',
      subagentToolsEnabled: false,
      modelInvocationCount: 0,
      automaticRetry: false,
      recursiveSubagents: false,
    },
  };
  const request = { ...body, requestSha: objectSha(body) };
  const response = transportCall(transport, request);
  const { contexts, route } = validatePreflightResponse(response, request, state.executionIdentity);
  assertFreshLaunchIdentity(state.launches, { auditorId: response.auditorId, auditorSessionId: response.auditorSessionId, contexts });
  const executionIdentity = {
    ...(state.executionIdentity || {}),
    actualModel: route.actualModel,
    actualReasoningEffort: route.actualReasoningEffort,
    modelRouteObservedAtStart: route.observedAt,
  };
  const parity = validateModelRouteParity(executionIdentity);
  Object.assign(executionIdentity, { routeStatus: parity.routeStatus, MODEL_ROUTE_PARITY: parity.MODEL_ROUTE_PARITY });
  const plan = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    kind: 'PROVIDER_STATELESS_REVIEW_PLAN',
    workBatchId,
    purpose,
    launchId,
    freezeSha: freeze.freezeSha,
    scope: body.scope,
    workflowProfile: body.workflowProfile,
    inputSha: body.inputSha,
    repairIteration: body.repairIteration,
    builderId: state.builderId,
    builderSessionId: state.builderSessionId,
    provider: response.provider,
    model: response.model,
    reasoningEffort: response.reasoningEffort || response.actualReasoningEffort || null,
    jobAuthorityStartSha: state.jobAuthority?.startSha || null,
    executionIdentity,
    externalId: response.externalTaskId,
    auditorId: response.auditorId,
    auditorSessionId: response.auditorSessionId,
    contexts,
    contextIsolation: 'STATELESS_INPUTS',
    subagentToolsEnabled: false,
    preflightRequest: request,
    preflightResponse: response,
    preflightResponseSha: objectSha(response),
  };
  const ref = writeBridgeJson(root, planPath, plan);
  return {
    status: 'READY',
    planRef: ref,
    provider: plan.provider,
    model: plan.model,
    reservationRequest: {
      purpose,
      callerRole: 'MAIN_WORKER',
      auditorId: plan.auditorId,
      auditorSessionId: plan.auditorSessionId,
      parentLaunchId: null,
      recursiveSubagentLaunchCount: 0,
      contextIsolation: 'STATELESS_INPUTS',
      subagentToolsEnabled: false,
      contexts: plan.contexts,
      providerAttestationPlanRef: ref,
      executionIdentity,
    },
  };
}

function validatePlanAgainstLaunch(root, planRef, plan, launch, state) {
  check(plan?.schemaVersion === PROVIDER_BRIDGE_VERSION && plan.kind === 'PROVIDER_STATELESS_REVIEW_PLAN', 'PROVIDER_PLAN_INVALID');
  check(plan.workBatchId === state.workBatchId && plan.launchId === launch.launchId && plan.purpose === launch.purpose && plan.freezeSha === launch.freezeSha && plan.inputSha === launch.inputSha && plan.repairIteration === launch.repairIteration, 'PROVIDER_PLAN_LAUNCH_BINDING');
  check(plan.builderId === state.builderId && plan.builderSessionId === state.builderSessionId, 'PROVIDER_PLAN_BUILDER_BINDING');
  check(plan.auditorId === launch.auditorId && plan.auditorSessionId === launch.auditorSessionId && same(plan.contexts, launch.contexts), 'PROVIDER_PLAN_CONTEXT_BINDING');
  check(same(plan.scope, reviewScopeForPurpose(state, state.freezes.find(freeze => freeze.freezeSha === launch.freezeSha), launch.purpose)) && same(plan.scope, launch.scope), 'PROVIDER_PLAN_SCOPE_BINDING');
  check(launch.providerAttestationPlanRef && same(launch.providerAttestationPlanRef, planRef) && same(planRef, fileRef(root, planRef.path)), 'PROVIDER_PLAN_RESERVATION_REQUIRED');
  check(plan.contextIsolation === 'STATELESS_INPUTS' && plan.subagentToolsEnabled === false && nonempty(plan.externalId), 'PROVIDER_PLAN_CAPABILITY_INVALID');
  if (isBenchmarkJobKind(state.jobKind)) {
    check(plan.executionIdentity?.jobKind === state.jobKind && plan.executionIdentity.requestedModel === state.executionIdentity.requestedModel && plan.executionIdentity.requestedReasoningEffort === state.executionIdentity.requestedReasoningEffort, 'MODEL_ROUTE_REQUEST_BINDING');
    check(nonempty(plan.executionIdentity.actualModel) && nonempty(plan.executionIdentity.actualReasoningEffort) && nonempty(plan.executionIdentity.modelRouteObservedAtStart), 'MODEL_ROUTE_OBSERVATION_REQUIRED');
  }
  check(plan.preflightResponse?.requestSha === plan.preflightRequest?.requestSha && plan.preflightResponseSha === objectSha(plan.preflightResponse), 'PROVIDER_PLAN_ATTESTATION_TAMPERED');
}

function loadPacket(root, ref, launch, plan, state, candidateContext, sourceContext) {
  const packet = JSON.parse(readBoundFile(root, ref).toString('utf8'));
  const visibleUids = launch.scope.map(row => row.questionUid);
  const validation = validateAuditorPacket(packet, {
    affectedUidSet: visibleUids,
    declaredContextDependencyUidSet: sourceContext.declaredContextDependencyUidSet,
    builderId: state.builderId,
    builderSessionId: state.builderSessionId,
    candidateContext,
  });
  check(validation.status === 'PASS', `PROVIDER_PACKET_INVALID:${validation.errors.join(',')}`);
  check(packet.auditorPrincipalType === 'STATELESS_MODEL' && packet.launchId === launch.launchId && packet.externalTaskId === plan.externalId, 'PROVIDER_PACKET_LAUNCH_BINDING');
  check(packet.auditorId === launch.auditorId && packet.auditorSessionId === launch.contexts[packet.phase].sessionId && packet.contextId === launch.contexts[packet.phase].contextId, 'PROVIDER_PACKET_CONTEXT_BINDING');
  walkBoundRefs(root, packet);
  validatePacketVisualAndAuthority(packet, sourceContext);
  if (packet.phase === 'U1') {
    const rows = Array.isArray(packet.payload) ? packet.payload : [packet.payload];
    for (const row of rows) {
      const expected = sourceContext.sourcePayloads.get(row.questionUid);
      check(expected && same({ content: row.content, choices: row.choices, problemAssets: row.problemAssets || [] }, expected), 'PROVIDER_U1_SOURCE_PACKET_MISMATCH');
    }
  }
  if (packet.phase === 'U2') {
    const rows = Array.isArray(packet.payload) ? packet.payload : [packet.payload];
    for (const row of rows) {
      const expected = sourceContext.visualApplicabilities.get(row.questionUid);
      check(expected && same(row.visualApplicability, expected), 'PROVIDER_U2_VISUAL_APPLICABILITY_MISMATCH');
    }
  }
  return packet;
}

function sourceContexts(root, freeze) {
  const candidateContext = {};
  const sourcePayloads = new Map();
  const visualApplicabilities = new Map();
  const declaredContextDependencyUidSet = [];
  for (const runRef of freeze.runRefs || []) {
    const run = JSON.parse(readBoundFile(root, runRef).toString('utf8'));
    Object.assign(candidateContext, loadCandidateReviewContext(root, run));
    declaredContextDependencyUidSet.push(...(run.declaredContextDependencyUidSet || []));
    for (const question of loadBoundQuestionBanks(root, run)) {
      const declared = run.questions.find(row => row.questionUid === question.questionUid);
      visualApplicabilities.set(question.questionUid, visualApplicabilityForQuestion({ ...declared, ...question, visual: declared?.visual }));
      const sourceImage = question.sourceRecord?.image;
      const sourceAssetPaths = sourceImage
        ? (sourceImage.startsWith('archive/')
          ? [sourceImage]
          : [path.posix.join(run.assetRoot || 'archive', sourceImage), `archive/${sourceImage}`])
        : [];
      const sourceAsset = sourceAssetPaths.length ? run.inputs.find(ref => sourceAssetPaths.includes(ref.path)) : null;
      if (sourceImage) check(sourceAsset, 'PROVIDER_SOURCE_ASSET_NOT_BOUND');
      sourcePayloads.set(question.questionUid, {
        content: question.sourceRecord.content,
        choices: question.sourceRecord.choices || [],
        problemAssets: sourceAsset ? [sourceVisualAssetPayload(root, sourceAsset)] : [],
      });
    }
  }
  return { candidateContext, sourcePayloads, visualApplicabilities, declaredContextDependencyUidSet: [...new Set(declaredContextDependencyUidSet)] };
}

function walkBoundRefs(root, value, pathValue = '$', seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (typeof value.path === 'string' && typeof value.sha256 === 'string' && /^sha256:[0-9a-f]{64}$/.test(value.sha256)) {
    const bytes = readBoundFile(root, value);
    if (bytesSha(bytes) !== value.sha256) throw new Error(`HOLD:PROVIDER_PACKET_ASSET_SHA_MISMATCH:${pathValue}`);
  }
  if (Array.isArray(value)) return value.forEach((item, index) => walkBoundRefs(root, item, `${pathValue}[${index}]`, seen));
  for (const [key, child] of Object.entries(value)) walkBoundRefs(root, child, `${pathValue}.${key}`, seen);
}

function requireNativeImages(value, pathValue = '$', required = false, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (typeof value.dataUrl === 'string') {
    if (!/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/.test(value.dataUrl)) throw new Error(`HOLD:PROVIDER_NATIVE_IMAGE_ENVELOPE_INVALID:${pathValue}`);
    if (value.sha256 && /^sha256:[0-9a-f]{64}$/.test(value.sha256)) {
      const encoded = value.dataUrl.slice(value.dataUrl.indexOf(',') + 1);
      if (bytesSha(Buffer.from(encoded, 'base64')) !== value.sha256) throw new Error(`HOLD:PROVIDER_NATIVE_IMAGE_SHA_MISMATCH:${pathValue}`);
    }
  } else if (required && typeof value.path === 'string' && typeof value.sha256 === 'string') {
    throw new Error(`HOLD:PROVIDER_NATIVE_IMAGE_REQUIRED:${pathValue}`);
  }
  if (Array.isArray(value)) return value.forEach((item, index) => requireNativeImages(item, `${pathValue}[${index}]`, required, seen));
  for (const [key, child] of Object.entries(value)) requireNativeImages(child, `${pathValue}.${key}`, required || ['problemAssets', 'assetRefs', 'screenshot'].includes(key), seen);
}

function validatePacketVisualAndAuthority(packet, sourceContext) {
  const rows = Array.isArray(packet.payload) ? packet.payload : [packet.payload];
  if (packet.phase === 'U1') for (const row of rows) if (row.problemAssets?.length) requireNativeImages(row.problemAssets, `U1.${row.questionUid}.problemAssets`, true);
  if (packet.phase === 'U2') for (const row of rows) {
    const applicability = sourceContext.visualApplicabilities.get(row.questionUid);
    const required = Boolean(row.visualApplicability?.artifactRequired || row.visualApplicability?.renderWitnessRequired);
    if (required && ['PENDING', 'UNFINALIZED', null, undefined].includes(row.visualApplicability?.authority?.adjudicationStatus)) throw new Error(`HOLD:PROVIDER_PACKET_AUTHORITY_UNFINALIZED:${row.questionUid}`);
    if (row.artifact?.assetRefs?.length) requireNativeImages(row.artifact.assetRefs, `U2.${row.questionUid}.artifact.assetRefs`, true);
    if (applicability && canonicalJson(row.visualApplicability) !== canonicalJson(applicability)) throw new Error(`HOLD:PROVIDER_PACKET_VISUAL_APPLICABILITY_MISMATCH:${row.questionUid}`);
  }
  if (packet.phase === 'U3') for (const row of rows) if (row.renderWitnesses?.length) requireNativeImages(row.renderWitnesses, `U3.${row.questionUid}.renderWitnesses`, true);
}

// This check runs after control-plane identity creation and before repository
// reservation. It is intentionally read-only and is repeated by dispatch as a
// last defence. A malformed packet must never consume an expensive audit slot.
export function validateProviderPacketPreflight(root, { workBatchId, planPath, packetRefs }) {
  const state = readWorkBatch(root, workBatchId);
  const { ref: planRef, value: plan } = loadBridgeJson(root, planPath);
  check(plan?.workBatchId === workBatchId, 'PROVIDER_PLAN_WORK_BATCH_BINDING');
  const freeze = state.freezes.find(item => item.freezeSha === plan.freezeSha);
  check(freeze, 'PROVIDER_FREEZE_REQUIRED');
  const contexts = sourceContexts(root, freeze);
  const pseudoLaunch = { ...plan, status: 'RESERVED', scope: plan.scope, contexts: plan.contexts, auditorId: plan.auditorId, auditorSessionId: plan.auditorSessionId, launchId: plan.launchId, purpose: plan.purpose, freezeSha: plan.freezeSha, externalId: plan.externalId };
  check(Array.isArray(packetRefs) && packetRefs.length === PHASES.length, 'PROVIDER_PACKET_REFS_REQUIRED');
  const packets = packetRefs.map(({ phase, ref }) => {
    check(PHASES.includes(phase) && ref, 'PROVIDER_PACKET_PHASES_INVALID');
    const packet = loadPacket(root, ref, pseudoLaunch, plan, state, contexts.candidateContext, contexts);
    check(packet.phase === phase, 'PROVIDER_PACKET_PHASE_REF_MISMATCH');
    return { phase, ref };
  });
  check(new Set(packets.map(row => row.phase)).size === PHASES.length, 'PROVIDER_PACKET_PHASES_INVALID');
  return { status: 'PASS', workBatchId, launchId: plan.launchId, planRef, packetRefs: packets, nativeImageAttachmentProtocol: 'url', expensiveLaunchAuthorized: true };
}

export function applyVisualApplicabilityToDefects(defects, visualApplicabilities) {
  const kept = [];
  const suppressed = [];
  for (const defect of defects || []) {
    const applicability = visualApplicabilities?.get(defect.questionUid);
    const suppressArtifact = defect.type === 'missing_artifact' && applicability?.artifactRequired === false;
    const suppressWitness = defect.type === 'missing_render_witness' && applicability?.renderWitnessRequired === false;
    if (suppressArtifact || suppressWitness) suppressed.push({ ...defect, suppression: 'VISUAL_APPLICABILITY_NOT_REQUIRED' });
    else kept.push(defect);
  }
  return { defects: kept, suppressedDefects: suppressed };
}

function phaseRequest(plan, packet) {
  const body = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    operation: 'INVOKE_STATELESS_AUDITOR_PHASE',
    logicalLaunchId: plan.launchId,
    externalTaskId: plan.externalId,
    phase: packet.phase,
    jobAuthorityStartSha: plan.jobAuthorityStartSha || null,
    subagentToolsEnabled: false,
    packet,
  };
  return { ...body, inputSha: objectSha(body) };
}

export function bindProviderDefectsToLaunchScope(defects, scope) {
  const rowsFor = defect => {
    if (typeof defect?.questionUid === 'string') return scope.filter(row => row.questionUid === defect.questionUid);
    const declaredScope = typeof defect?.scope === 'string' ? defect.scope : typeof defect?.questionUids === 'string' ? defect.questionUids : null;
    if (!declaredScope) return [];
    const exact = scope.filter(row => row.questionUid === declaredScope);
    if (exact.length) return exact;
    const prefixMatches = scope.filter(row => row.questionUid.startsWith(`${declaredScope}|`));
    if (prefixMatches.length) return prefixMatches;
    const match = declaredScope.match(/^(.*)\|(\d+)\.\.(\d+)$/);
    if (!match) return [];
    const prefix = match[1];
    const start = Number(match[2]);
    const end = Number(match[3]);
    return scope.filter(row => {
      const candidate = row.questionUid.match(/^(.*)\|(\d+)$/);
      if (!candidate || candidate[1] !== prefix) return false;
      const ordinal = Number(candidate[2]);
      return ordinal >= start && ordinal <= end;
    });
  };
  return defects.flatMap(defect => {
    const rows = rowsFor(defect);
    check(rows.length > 0, 'PROVIDER_DEFECT_SCOPE_REQUIRED');
    return rows.map(scoped => {
      if (defect.runId !== undefined && defect.runId !== scoped.runId) throw new Error('HOLD:PROVIDER_DEFECT_SCOPE_REQUIRED');
      return { ...defect, questionUid: scoped.questionUid, runId: defect.runId === undefined ? scoped.runId : defect.runId };
    });
  });
}

function validatePhaseResponse(response, request, plan, seenInvocationIds) {
  check(response?.schemaVersion === PROVIDER_BRIDGE_VERSION && response.operation === 'INVOKE_STATELESS_AUDITOR_PHASE' && response.status === 'COMPLETED', 'PROVIDER_PHASE_RESPONSE_INVALID');
  check(response.inputSha === request.inputSha && response.packetSha === request.packet.packetSha, 'PROVIDER_PHASE_INPUT_BINDING');
  check(response.externalTaskId === plan.externalId && response.phase === request.phase, 'PROVIDER_PHASE_LAUNCH_BINDING');
  const expected = plan.contexts[request.phase];
  check(response.sessionId === expected.sessionId && response.contextId === expected.contextId && nonempty(response.providerInvocationId) && !seenInvocationIds.has(response.providerInvocationId), 'PROVIDER_PHASE_CONTEXT_ATTESTATION_REQUIRED');
  check(response.inputVisibilityProfile === request.packet.inputVisibilityProfile && response.priorReviewVisibility === request.packet.priorReviewVisibility && response.subagentToolsEnabled === false, 'PROVIDER_PHASE_VISIBILITY_ATTESTATION_REQUIRED');
  check(response.usedTokens === null || response.usedTokens === 'NOT_AVAILABLE' || Number.isSafeInteger(response.usedTokens) && response.usedTokens >= 0, 'PROVIDER_TOKEN_TELEMETRY_INVALID');
  check(Array.isArray(response.evidence) && Array.isArray(response.defects), 'PROVIDER_PHASE_OUTPUT_INVALID');
  return observeModelRoute(response, new Date().toISOString());
}

function receiptPathFor(root, relative) {
  check(typeof relative === 'string' && relative.startsWith('alive/runtime/provider-bridge/'), 'PROVIDER_RECEIPT_RUNTIME_PATH_REQUIRED');
  return bridgePath(root, relative);
}

// Executes only phase packets that the main worker prepared and sealed after
// reservation. There is no fallback, retry, or local synthetic receipt path.
export function dispatchProviderReview(root, { workBatchId, launchId, planPath, packetRefs, transport, receiptPath }) {
  const state = readWorkBatch(root, workBatchId);
  const launch = state.launches.find(item => item.launchId === launchId);
  check(launch?.status === 'RESERVED', 'PROVIDER_RESERVED_LAUNCH_REQUIRED');
  const { ref: planRef, value: plan } = loadBridgeJson(root, planPath);
  validatePlanAgainstLaunch(root, planRef, plan, launch, state);
  check(Array.isArray(packetRefs) && packetRefs.length > 0 && packetRefs.length <= PHASES.length, 'PROVIDER_PACKET_REFS_REQUIRED');
  check(new Set(packetRefs.map(row => row.phase)).size === packetRefs.length && packetRefs.every(row => PHASES.includes(row.phase) && row.ref), 'PROVIDER_PACKET_PHASES_INVALID');
  const freeze = state.freezes.find(item => item.freezeSha === launch.freezeSha);
  check(freeze, 'PROVIDER_FREEZE_REQUIRED');
  const contexts = sourceContexts(root, freeze);
  const packets = packetRefs.map(({ phase, ref }) => {
    const packet = loadPacket(root, ref, launch, plan, state, contexts.candidateContext, contexts);
    check(packet.phase === phase, 'PROVIDER_PACKET_PHASE_REF_MISMATCH');
    return { packet, ref };
  }).sort((left, right) => PHASES.indexOf(left.packet.phase) - PHASES.indexOf(right.packet.phase));
  reconcileWorkBatchReview(root, workBatchId, { launchId, externalId: plan.externalId, status: 'DISPATCHED' });
  const base = path.dirname(receiptPathFor(root, receiptPath));
  const relativeBase = path.relative(path.resolve(root), base).split(path.sep).join('/');
  const phaseAttestationRefs = [], evidenceRefs = [], defects = [], suppressedDefects = [], usedTokens = [], routeObservations = [], seenInvocationIds = new Set();
  for (const { packet } of packets) {
    const request = phaseRequest(plan, packet);
    const requestRef = writeBridgeJson(root, `${relativeBase}/${packet.phase.toLowerCase()}-request.json`, request);
    const response = transportCall(transport, request);
    const phaseRoute = validatePhaseResponse(response, request, plan, seenInvocationIds);
    routeObservations.push({ phase: packet.phase, ...phaseRoute });
    seenInvocationIds.add(response.providerInvocationId);
    const responseRef = writeBridgeJson(root, `${relativeBase}/${packet.phase.toLowerCase()}-response.json`, response);
    phaseAttestationRefs.push({ phase: packet.phase, requestRef, responseRef, inputSha: request.inputSha, providerInvocationId: response.providerInvocationId });
    usedTokens.push(Number.isSafeInteger(response.usedTokens) ? response.usedTokens : null);
    const scopedDefects = bindProviderDefectsToLaunchScope(response.defects, launch.scope);
    const filtered = packet.phase === 'U2'
      ? applyVisualApplicabilityToDefects(scopedDefects, contexts.visualApplicabilities)
      : { defects: scopedDefects, suppressedDefects: [] };
    defects.push(...filtered.defects);
    suppressedDefects.push(...filtered.suppressedDefects.map(defect => ({ ...defect, phase: packet.phase })));
    for (let index = 0; index < response.evidence.length; index++) evidenceRefs.push(writeBridgeJson(root, `${relativeBase}/${packet.phase.toLowerCase()}-evidence-${index + 1}.json`, response.evidence[index]));
  }
  const receipt = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    launchId,
    externalId: plan.externalId,
    status: 'COMPLETED',
    provider: plan.provider,
    model: plan.model,
    reasoningEffort: plan.reasoningEffort || null,
    executionIdentity: (() => {
      const identity = structuredClone(plan.executionIdentity || {});
      const first = routeObservations.find(route => route.actualModel || route.actualReasoningEffort);
      const routeChanged = routeObservations.some(route => (route.actualModel || null) !== identity.actualModel || (route.actualReasoningEffort || null) !== identity.actualReasoningEffort);
      Object.assign(identity, {
        actualModel: first?.actualModel || identity.actualModel || null,
        actualReasoningEffort: first?.actualReasoningEffort || identity.actualReasoningEffort || null,
        modelRouteObservedAtClosure: new Date().toISOString(),
        modelRouteChanged: routeChanged,
        modelRouteObservations: routeObservations,
      });
      const parity = validateModelRouteParity(identity, { modelRouteChanged: routeChanged });
      Object.assign(identity, { routeStatus: parity.routeStatus, MODEL_ROUTE_PARITY: parity.MODEL_ROUTE_PARITY });
      return identity;
    })(),
    providerPlanRef: planRef,
    independentAgentLaunchCount: 1,
    expensiveAgentLaunchCount: 1,
    concurrentExpensiveAgentPeak: 1,
    recursiveSubagentLaunchCount: 0,
    retryLaunchCount: 0,
    usedTokens: usedTokens.every(Number.isSafeInteger) ? usedTokens.reduce((total, value) => total + value, 0) : null,
    usedTokensByPhase: Object.fromEntries(packets.map(({ packet }, index) => [packet.phase, usedTokens[index]])),
    phaseAttestationRefs,
    evidenceRefs,
    defects,
    suppressedDefects,
  };
  writeNewJson(receiptPathFor(root, receiptPath), receipt);
  const providerReceiptRef = fileRef(root, receiptPath);
  const completed = reconcileWorkBatchReview(root, workBatchId, { launchId, externalId: plan.externalId, status: 'COMPLETED', providerReceiptRef });
  return { status: 'COMPLETED', workBatchId, launchId, externalId: plan.externalId, providerReceiptRef, phaseAttestationRefs, evidenceRefs, usedTokens: receipt.usedTokens, state: completed.status };
}
