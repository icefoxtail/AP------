import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { canonicalJson, fileRef, nonempty, objectSha, readBoundFile, safePath, writeNewJson } from './canonical.mjs';
import { loadBoundQuestionBanks } from './closure.mjs';
import { loadCandidateReviewContext, validateAuditorPacket } from './review-isolation-runner.mjs';
import { readWorkBatch, reconcileWorkBatchReview } from './work-batch.mjs';

export const PROVIDER_BRIDGE_VERSION = 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1';
const PHASES = Object.freeze(['U1', 'U2', 'U3']);
const check = (condition, code) => { if (!condition) throw new Error(`HOLD:${code}`); };
const same = (left, right) => canonicalJson(left) === canonicalJson(right);

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

function contextMap(contexts, builderSessionId) {
  check(contexts && typeof contexts === 'object' && PHASES.every(phase => nonempty(contexts[phase]?.sessionId) && nonempty(contexts[phase]?.contextId)), 'PROVIDER_CONTEXT_ATTESTATION_REQUIRED');
  const sessions = PHASES.map(phase => contexts[phase].sessionId);
  const contextIds = PHASES.map(phase => contexts[phase].contextId);
  check(new Set(sessions).size === PHASES.length && new Set(contextIds).size === PHASES.length, 'PROVIDER_CONTEXT_IDENTITY_COLLISION');
  check(!sessions.includes(builderSessionId), 'PROVIDER_BUILDER_SESSION_COLLISION');
  return Object.fromEntries(PHASES.map(phase => [phase, { sessionId: contexts[phase].sessionId, contextId: contexts[phase].contextId }]));
}

function validatePreflightResponse(response, request) {
  check(response?.schemaVersion === PROVIDER_BRIDGE_VERSION && response.operation === 'PREPARE_STATELESS_FINAL_AUDIT' && response.status === 'READY', 'PROVIDER_PREFLIGHT_RESPONSE_INVALID');
  check(request.requestSha === objectSha(Object.fromEntries(Object.entries(request).filter(([key]) => key !== 'requestSha'))) && response.requestSha === request.requestSha, 'PROVIDER_PREFLIGHT_INPUT_BINDING');
  check(nonempty(response.provider) && nonempty(response.model) && nonempty(response.externalTaskId), 'PROVIDER_IDENTITY_ATTESTATION_REQUIRED');
  check(nonempty(response.auditorId) && response.auditorId !== request.builderId && nonempty(response.auditorSessionId) && response.auditorSessionId !== request.builderSessionId, 'PROVIDER_AUDITOR_SEPARATION_REQUIRED');
  check(response.contextIsolation === 'STATELESS_INPUTS' && response.subagentToolsEnabled === false && response.modelInvocationCount === 0, 'PROVIDER_PREFLIGHT_CAPABILITY_INVALID');
  check(nonempty(response.runtimeAttestation), 'PROVIDER_RUNTIME_ATTESTATION_REQUIRED');
  return contextMap(response.contexts, request.builderSessionId);
}

function plannedLaunch(state, purpose) {
  check(state.status === 'FROZEN', 'WHOLE_JOB_FREEZE_REQUIRED');
  check(!state.launches.some(launch => ['RESERVED', 'DISPATCHED'].includes(launch.status)), 'RECONCILE_EXISTING_EXPENSIVE_TASK');
  const freeze = state.freezes.at(-1);
  check(freeze, 'WHOLE_JOB_FREEZE_REQUIRED');
  if (purpose === 'FINAL_AUDIT') check(state.launches.length === 0 && state.freezes.length === 1, 'FINAL_AUDITOR_ALREADY_USED');
  if (purpose === 'TARGETED_RECHECK') check(state.launches.some(launch => launch.purpose === 'FINAL_AUDIT' && launch.status === 'COMPLETED') && state.freezes.length > 1 && freeze.affected.length > 0, 'TARGETED_CHANGE_REQUIRED');
  check(['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(purpose), 'PROVIDER_BRIDGE_PURPOSE_INVALID');
  return { freeze, launchId: `${state.workBatchId}:${state.launches.length + 1}` };
}

// This is control-plane only. A provider must attest modelInvocationCount: 0;
// the three model invocations are issued later through dispatchProviderReview.
export function prepareProviderReview(root, { workBatchId, purpose, transport, planPath }) {
  const state = readWorkBatch(root, workBatchId);
  const { freeze, launchId } = plannedLaunch(state, purpose);
  const body = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    operation: 'PREPARE_STATELESS_FINAL_AUDIT',
    workBatchId,
    purpose,
    launchId,
    freezeSha: freeze.freezeSha,
    scope: purpose === 'FINAL_AUDIT' ? freeze.targets : freeze.affected,
    builderId: state.builderId,
    builderSessionId: state.builderSessionId,
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
  const contexts = validatePreflightResponse(response, request);
  const plan = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    kind: 'PROVIDER_STATELESS_REVIEW_PLAN',
    workBatchId,
    purpose,
    launchId,
    freezeSha: freeze.freezeSha,
    scope: body.scope,
    builderId: state.builderId,
    builderSessionId: state.builderSessionId,
    provider: response.provider,
    model: response.model,
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
    },
  };
}

function validatePlanAgainstLaunch(root, planRef, plan, launch, state) {
  check(plan?.schemaVersion === PROVIDER_BRIDGE_VERSION && plan.kind === 'PROVIDER_STATELESS_REVIEW_PLAN', 'PROVIDER_PLAN_INVALID');
  check(plan.workBatchId === state.workBatchId && plan.launchId === launch.launchId && plan.purpose === launch.purpose && plan.freezeSha === launch.freezeSha, 'PROVIDER_PLAN_LAUNCH_BINDING');
  check(plan.builderId === state.builderId && plan.builderSessionId === state.builderSessionId, 'PROVIDER_PLAN_BUILDER_BINDING');
  check(plan.auditorId === launch.auditorId && plan.auditorSessionId === launch.auditorSessionId && same(plan.contexts, launch.contexts), 'PROVIDER_PLAN_CONTEXT_BINDING');
  check(launch.providerAttestationPlanRef && same(launch.providerAttestationPlanRef, planRef) && same(planRef, fileRef(root, planRef.path)), 'PROVIDER_PLAN_RESERVATION_REQUIRED');
  check(plan.contextIsolation === 'STATELESS_INPUTS' && plan.subagentToolsEnabled === false && nonempty(plan.externalId), 'PROVIDER_PLAN_CAPABILITY_INVALID');
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
  if (packet.phase === 'U1') {
    const rows = Array.isArray(packet.payload) ? packet.payload : [packet.payload];
    for (const row of rows) {
      const expected = sourceContext.sourcePayloads.get(row.questionUid);
      check(expected && same({ content: row.content, choices: row.choices, problemAssets: row.problemAssets || [] }, expected), 'PROVIDER_U1_SOURCE_PACKET_MISMATCH');
    }
  }
  return packet;
}

function sourceContexts(root, freeze) {
  const candidateContext = {};
  const sourcePayloads = new Map();
  const declaredContextDependencyUidSet = [];
  for (const runRef of freeze.runRefs || []) {
    const run = JSON.parse(readBoundFile(root, runRef).toString('utf8'));
    Object.assign(candidateContext, loadCandidateReviewContext(root, run));
    declaredContextDependencyUidSet.push(...(run.declaredContextDependencyUidSet || []));
    for (const question of loadBoundQuestionBanks(root, run)) {
      const sourceImage = question.sourceRecord?.image;
      const sourcePath = sourceImage ? (sourceImage.startsWith('archive/') ? sourceImage : `archive/${sourceImage}`) : null;
      const sourceAsset = sourcePath ? run.inputs.find(ref => ref.path === sourcePath) : null;
      if (sourceImage) check(sourceAsset, 'PROVIDER_SOURCE_ASSET_NOT_BOUND');
      sourcePayloads.set(question.questionUid, {
        content: question.sourceRecord.content,
        choices: question.sourceRecord.choices || [],
        problemAssets: sourceAsset ? [sourceAsset] : [],
      });
    }
  }
  return { candidateContext, sourcePayloads, declaredContextDependencyUidSet: [...new Set(declaredContextDependencyUidSet)] };
}

function phaseRequest(plan, packet) {
  const body = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    operation: 'INVOKE_STATELESS_AUDITOR_PHASE',
    logicalLaunchId: plan.launchId,
    externalTaskId: plan.externalId,
    phase: packet.phase,
    subagentToolsEnabled: false,
    packet,
  };
  return { ...body, inputSha: objectSha(body) };
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
  const phaseAttestationRefs = [], evidenceRefs = [], defects = [], usedTokens = [], seenInvocationIds = new Set();
  for (const { packet } of packets) {
    const request = phaseRequest(plan, packet);
    const requestRef = writeBridgeJson(root, `${relativeBase}/${packet.phase.toLowerCase()}-request.json`, request);
    const response = transportCall(transport, request);
    validatePhaseResponse(response, request, plan, seenInvocationIds);
    seenInvocationIds.add(response.providerInvocationId);
    const responseRef = writeBridgeJson(root, `${relativeBase}/${packet.phase.toLowerCase()}-response.json`, response);
    phaseAttestationRefs.push({ phase: packet.phase, requestRef, responseRef, inputSha: request.inputSha, providerInvocationId: response.providerInvocationId });
    usedTokens.push(Number.isSafeInteger(response.usedTokens) ? response.usedTokens : null);
    for (const defect of response.defects) {
      check(launch.scope.some(row => row.runId === defect?.runId && row.questionUid === defect?.questionUid), 'PROVIDER_DEFECT_SCOPE_REQUIRED');
      defects.push(defect);
    }
    for (let index = 0; index < response.evidence.length; index++) evidenceRefs.push(writeBridgeJson(root, `${relativeBase}/${packet.phase.toLowerCase()}-evidence-${index + 1}.json`, response.evidence[index]));
  }
  const receipt = {
    schemaVersion: PROVIDER_BRIDGE_VERSION,
    launchId,
    externalId: plan.externalId,
    status: 'COMPLETED',
    provider: plan.provider,
    model: plan.model,
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
  };
  writeNewJson(receiptPathFor(root, receiptPath), receipt);
  const providerReceiptRef = fileRef(root, receiptPath);
  const completed = reconcileWorkBatchReview(root, workBatchId, { launchId, externalId: plan.externalId, status: 'COMPLETED', providerReceiptRef });
  return { status: 'COMPLETED', workBatchId, launchId, externalId: plan.externalId, providerReceiptRef, phaseAttestationRefs, evidenceRefs, usedTokens: receipt.usedTokens, state: completed.status };
}
