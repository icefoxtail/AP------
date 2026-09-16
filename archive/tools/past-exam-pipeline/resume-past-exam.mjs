import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aggregateWorkBatchAudit, freezeWorkBatch, materializeWorkBatchRepair, readWorkBatch, recordWorkBatchRepair, reserveWorkBatchReview, reconcileWorkBatchReview } from '../pipeline-core/work-batch.mjs';
import { buildAuditorPacket, buildU3CandidatePayload, loadCandidateReviewContext, visualApplicabilityForQuestion, sourcePixelPayloads } from '../pipeline-core/review-isolation-runner.mjs';
import { canonicalJson, fileRef, readBoundFile, writeNewJson } from '../pipeline-core/canonical.mjs';
import { loadBoundQuestionBanks } from '../pipeline-core/closure.mjs';
import { prepareProviderReview, dispatchProviderReview, validateProviderPacketPreflight, visualAssetPayload } from '../pipeline-core/provider-bridge.mjs';
import { nextWorkBatchAction } from '../pipeline-core/defect-router.mjs';
import { materializeAuthorityBinding } from '../pipeline-core/authority-repair.mjs';
import { materializeVisualEvidence } from '../pipeline-core/visual-repair.mjs';
import { recoveryCapabilityRegistry } from '../pipeline-core/recovery-capability.mjs';

export const RESUME_RUNNER_VERSION = 'APMATH_PAST_EXAM_RESUME_RUNNER_v1';
export const RESUME_ACTIONS = Object.freeze([
  'BUILD_AND_FREEZE',
  'FREEZE_RECORDED_REPAIR',
  'AUTO_REPAIR',
  'AUTHORITY_BINDING_REPAIR',
  'VISUAL_EVIDENCE_REPAIR',
  'SOURCE_FIDELITY_RESTORATION',
  'ANSWER_KEY_RECOVERY',
  'DERIVED_SOURCE_RECOVERY',
  'CANDIDATE_REPAIR',
  'EXECUTION_RECOVERY',
  'FINAL_AUDIT',
  'TARGETED_RECHECK',
  'CLOSURE',
  'HUMAN_DECISION_REQUIRED',
  'DONE',
]);

const PHASES = Object.freeze(['U1', 'U2', 'U3']);
const defaultProviderAdapter = root => path.relative(root, path.resolve(root, 'alive/runtime/provider-bridge/codex-appserver-adapter.mjs')).split(path.sep).join('/');
const readJsonRef = (root, ref) => JSON.parse(readBoundFile(root, ref).toString('utf8'));
const currentRunRefs = state => state.freezes.at(-1)?.runRefs || [];
const launchOrdinal = state => state.launches.length + 1;

function runRows(root, state, freeze) {
  const rows = [];
  for (const runRef of freeze.runRefs || []) {
    const run = readJsonRef(root, runRef);
    const candidateContext = loadCandidateReviewContext(root, run);
    const questions = new Map(loadBoundQuestionBanks(root, run).map(question => [question.questionUid, { question, declared: run.questions.find(row => row.questionUid === question.questionUid), run, candidateContext }]).map(([uid, value]) => [uid, value]));
    for (const target of freeze.targets || []) if (target.runId === run.runId && questions.has(target.questionUid)) rows.push({ target, ...questions.get(target.questionUid) });
  }
  return rows.sort((left, right) => `${left.target.runId}:${left.target.questionUid}`.localeCompare(`${right.target.runId}:${right.target.questionUid}`));
}

function refForPath(run, relative) {
  return (run.inputs || []).find(ref => ref.path === relative || ref.path === path.posix.normalize(relative) || ref.path === relative.replace(/^archive\//, '')) || null;
}

function sourceAssetRef(root, row) {
  const image = row.question.sourceRecord?.image;
  if (!image) return null;
  const candidates = [image, image.startsWith('archive/') ? image : path.posix.join(row.run.assetRoot || 'archive', image), `archive/${image}`];
  const ref = candidates.map(candidate => refForPath(row.run, candidate)).find(Boolean);
  return ref ? visualAssetPayload(root, ref) : null;
}

function solutionAssets(root, row) {
  const paths = [
    ...(row.declared.problemAssetPaths || []),
    ...(row.question.solutionAssetPaths || []),
    ...(row.question.solutionAssetRefs || []).map(ref => ref.path).filter(Boolean),
  ];
  return [...new Set(paths)].map(relative => {
    const ref = refForPath(row.run, relative);
    if (!ref) throw new Error(`REVIEW_ASSET_NOT_BOUND:${relative}`);
    return visualAssetPayload(root, ref);
  });
}

function renderWitnesses(root, row) {
  const witnesses = [];
  for (const ref of row.run.evidence || []) {
    const evidence = readJsonRef(root, ref);
    if (evidence.axis !== 'RENDER_CAPTURE') continue;
    if (evidence.inputSha !== row.run.inputSha) throw new Error('REVIEW_RENDER_CAPTURE_STALE');
    for (const witness of evidence.payload?.itemWitnesses || []) {
      if (witness.questionUid !== row.question.questionUid) continue;
      witnesses.push({ ...witness, screenshot: visualAssetPayload(root, witness.screenshot) });
    }
  }
  return witnesses;
}

export function packetInputs(root, state, plan) {
  const scope = new Set(plan.scope.map(target => `${target.runId}:${target.questionUid}`));
  const rows = runRows(root, state, state.freezes.find(freeze => freeze.freezeSha === plan.freezeSha)).filter(row => scope.has(`${row.target.runId}:${row.target.questionUid}`));
  if (rows.length !== scope.size) throw new Error('REVIEW_SCOPE_TARGET_MISSING');
  const byPhase = {
    U1: rows.map(row => ({ questionUid: row.question.questionUid, content: row.question.sourceRecord?.content, choices: row.question.sourceRecord?.choices || [], problemAssets: sourceAssetRef(root, row) ? [sourceAssetRef(root, row)] : [], sourcePixels: sourcePixelPayloads(root, row.run, row.question.sourceRecord) })),
    U2: rows.map(row => ({ questionUid: row.question.questionUid, artifact: solutionAssets(root, row).length ? { assetRefs: solutionAssets(root, row) } : null, renderWitnesses: [], visualApplicability: visualApplicabilityForQuestion({ ...row.declared, ...row.question, visual: row.declared?.visual }) })),
    U3: [],
  };
  const candidateContext = Object.assign({}, ...rows.map(row => row.candidateContext));
  byPhase.U3 = rows.map(row => buildU3CandidatePayload(candidateContext, row.question.questionUid, { renderWitnesses: renderWitnesses(root, row), metadata: {}, dependencies: {} }));
  return { rows, byPhase };
}

function buildPackets(root, state, plan, packetRoot) {
  const { byPhase } = packetInputs(root, state, plan);
  const refs = [];
  for (const phase of PHASES) {
    const payload = byPhase[phase];
    const packet = buildAuditorPacket({
      phase,
      questionUids: plan.scope.map(row => row.questionUid),
      payload,
      affectedUidSet: plan.scope.map(row => row.questionUid),
      declaredContextDependencyUidSet: [],
      auditorId: plan.auditorId,
      auditorSessionId: plan.contexts[phase].sessionId,
      builderId: state.builderId,
      builderSessionId: state.builderSessionId,
      auditorPrincipalType: 'STATELESS_MODEL',
      contextId: plan.contexts[phase].contextId,
      inputVisibilityProfile: phase === 'U1' ? 'SOURCE_ONLY' : phase === 'U2' ? 'ARTIFACT_ONLY' : 'CANDIDATE_ONLY',
      priorReviewVisibility: 'NONE',
      sealed: true,
      launchId: plan.launchId,
      externalTaskId: plan.externalId,
      candidateContext: phase === 'U3' ? Object.assign({}, ...packetInputs(root, state, plan).rows.map(row => row.candidateContext)) : null,
    });
    const relative = `${packetRoot}/${phase.toLowerCase()}-packet.json`;
    if (fs.existsSync(path.resolve(root, relative))) {
      if (canonicalJson(readJsonRef(root, fileRef(root, relative))) !== canonicalJson(packet)) throw new Error(`PACKET_REPLAY_CONTENT_MISMATCH:${phase}`);
    } else writeNewJson(path.resolve(root, relative), packet);
    refs.push({ phase, ref: fileRef(root, relative) });
  }
  return refs;
}

function providerTransport(root, workBatchId, options) {
  const command = options.providerCommand || process.execPath;
  const args = options.providerArgs || [defaultProviderAdapter(root), '--job', workBatchId];
  return { command, args };
}

async function runReview(root, state, purpose, options, executionRecoveryOfLaunchId = null) {
  const ordinal = launchOrdinal(state);
  const bridgeRoot = `alive/runtime/provider-bridge/${state.workBatchId}`;
  const launchRoot = `${bridgeRoot}/launch-${ordinal}`;
  const planPath = options.planPath || `${launchRoot}/plan.json`;
  const receiptPath = options.receiptPath || `${launchRoot}/receipt.json`;
  const preflight = prepareProviderReview(root, { workBatchId: state.workBatchId, purpose, transport: providerTransport(root, state.workBatchId, options), planPath, executionRecoveryOfLaunchId, authorization: purpose === 'SECOND_AUDIT' ? options.conflictAuthorization || null : null });
  const plan = readJsonRef(root, preflight.planRef);
  const packets = options.packetRefsFactory ? await options.packetRefsFactory({ root, state, plan }) : buildPackets(root, state, plan, launchRoot);
  validateProviderPacketPreflight(root, { workBatchId: state.workBatchId, planPath, packetRefs: packets });
  const reserved = await reserveWhenAvailable(root, state.workBatchId, preflight.reservationRequest, options);
  if (!reserved) return { status: 'WAITING_FOR_SLOT', productionAuthorized: false };
  return dispatchProviderReview(root, { workBatchId: state.workBatchId, launchId: plan.launchId, planPath, packetRefs: packets, transport: providerTransport(root, state.workBatchId, options), receiptPath });
}

export async function reserveWhenAvailable(root, workBatchId, request, options = {}) {
  const deadline = Date.now() + (options.maxSlotWaitMs ?? 180000);
  let waits = 0;
  for (;;) {
    if (options.signal?.aborted) return null;
    try { return reserveWorkBatchReview(root, workBatchId, request); }
    catch (error) {
      // Only an unreserved global slot conflict is safe to retry. Never replay
      // dispatch, unknown provider failures, corrupt evidence or identity errors.
      if (error.message !== 'HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED') throw error;
      const remaining = deadline - Date.now();
      if (remaining <= 0) return null;
      const delayMs = Math.min(remaining, options.slotPollMs ?? 1000, 30000);
      const state = readWorkBatch(root, workBatchId);
      if (options.onWait) await options.onWait({ workBatchId, state, reason: error.message, waits: ++waits, delayMs });
      if (options.waitForSlot) await options.waitForSlot({ root, state, delayMs });
      else await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

async function routeHandler(root, state, plan, route, options) {
  const handler = options.handlers?.[route];
  const defects = plan.defects.filter(defect => defect.route === route || defect.requestedRoute === route);
  if (handler) return handler({ root, state, plan, route, defects, runRefs: currentRunRefs(state), iteration: state.repairIterations.at(-1) });
  if (route === 'AUTHORITY_BINDING_REPAIR' && options.enableBuiltInMetadataHandlers) {
    const run = readJsonRef(root, currentRunRefs(state)[0]);
    return { route, status: 'HANDLER_READY', result: materializeAuthorityBinding(run, { questionUids: defects.map(defect => defect.questionUid) }) };
  }
  if (route === 'VISUAL_EVIDENCE_REPAIR' && options.enableBuiltInMetadataHandlers) {
    const run = readJsonRef(root, currentRunRefs(state)[0]);
    return { route, status: 'HANDLER_READY', result: materializeVisualEvidence(run, { questionUids: defects.map(defect => defect.questionUid) }) };
  }
  return { route, status: 'HUMAN_DECISION_REQUIRED', reason: 'RECOVERY_CAPABILITY_NOT_IMPLEMENTED' };
}

function dispositionForRoute(route, defects) {
  const disposition = route === 'SOURCE_FIDELITY_RESTORATION' ? 'EXTRACTION_CORRECTED' : route === 'VISUAL_EVIDENCE_REPAIR' ? 'REPAIRED_ASSET' : route === 'AUTHORITY_BINDING_REPAIR' || route === 'CANDIDATE_REPAIR' || route === 'ANSWER_KEY_RECOVERY' ? 'REPAIRED_CANDIDATE' : null;
  return disposition ? defects.map(defect => ({ runId: defect.runId, questionUid: defect.questionUid, disposition })) : [];
}

async function performRepair(root, state, action, options) {
  if (action.action !== 'AUTO_REPAIR') return { status: 'HUMAN_DECISION_REQUIRED', reason: action.reason || 'REPAIR_ACTION_REQUIRED' };
  const routes = [...new Set(action.plan.routes)];
  const results = [];
  for (const route of routes) {
    if (route === 'HUMAN_DECISION_REQUIRED') return { status: 'HUMAN_DECISION_REQUIRED', reason: action.plan.defects.find(defect => defect.route === route)?.capabilityReason || 'RECOVERY_CAPABILITY_NOT_IMPLEMENTED', results };
    const result = await routeHandler(root, state, action.plan, route, options);
    results.push(result);
    if (result.status === 'HUMAN_DECISION_REQUIRED') return { status: 'HUMAN_DECISION_REQUIRED', reason: result.reason, results };
  }
  const dispositions = results.flatMap(result => result.repairRequest?.dispositions || dispositionForRoute(result.route, action.plan.defects.filter(defect => defect.route === result.route)));
  const open = state.openDefectSet || [];
  if (dispositions.length !== open.length) return { status: 'HUMAN_DECISION_REQUIRED', reason: 'REPAIR_HANDLER_OUTPUT_INCOMPLETE', results };
  const repairRequest = results.find(result => result.repairRequest)?.repairRequest || {
    iteration: state.repairIterations.at(-1)?.iteration,
    revision: options.revision,
    inputSha: options.inputSha,
    dispositions,
    builderId: state.builderId,
    builderSessionId: state.builderSessionId,
  };
  if (!repairRequest.runRefs?.length) return { status: 'HUMAN_DECISION_REQUIRED', reason: 'REPAIR_PRODUCER_FROZEN_REFS_REQUIRED', results };
  for (const ref of repairRequest.runRefs) readJsonRef(root, ref);
  const repaired = recordWorkBatchRepair(root, state.workBatchId, repairRequest);
  if (repairRequest.runRefs) freezeWorkBatch(root, state.workBatchId, repairRequest.runRefs);
  return { status: repaired.status, results, state: readWorkBatch(root, state.workBatchId) };
}

export async function resumePastExam(root, options = {}) {
  const resolvedRoot = path.resolve(root || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'));
  let workBatchId = options.workBatchId || null;
  if (!workBatchId && options.predecessorWorkBatchId) {
    if (!options.newWorkBatchId) throw new Error('RESUME_NEW_WORK_BATCH_ID_REQUIRED');
    let materialized;
    try {
      materialized = materializeWorkBatchRepair(resolvedRoot, { workBatchId: options.newWorkBatchId, predecessorWorkBatchId: options.predecessorWorkBatchId, builderId: options.builderId, builderSessionId: options.builderSessionId });
    } catch (error) {
      const reason = String(error?.message || '').startsWith('STALE_FILE:') || String(error?.message || '').startsWith('INVALID_FILE_REF') ? 'IMMUTABLE_EVIDENCE_CORRUPTION' : error.message;
      return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason, detail: error.message, predecessorWorkBatchId: options.predecessorWorkBatchId, newWorkBatchId: options.newWorkBatchId, history: [] };
    }
    workBatchId = materialized.workBatchId;
  }
  if (!workBatchId) throw new Error('RESUME_WORK_BATCH_ID_REQUIRED');
  const maxSteps = options.maxSteps || 32;
  const history = [];
  for (let step = 0; step < maxSteps; step++) {
    const state = readWorkBatch(resolvedRoot, workBatchId);
    const action = nextWorkBatchAction(state, { capabilityRegistry: recoveryCapabilityRegistry(resolvedRoot, { inputReady: true, handlers: options.handlers }), sourceRecoveryCapability: options.sourceRecoveryCapability });
    history.push({ step, action: action.action, status: action.status, reason: action.reason || null });
    if (options.onAction) await options.onAction({ state, action, step });
    if (action.reason === 'REVIEW_CONFLICT' && options.conflictAuthorization && !state.launches.some(l => l.purpose === 'SECOND_AUDIT')) {
      const review = await runReview(resolvedRoot, state, 'SECOND_AUDIT', options);
      if (review.status === 'WAITING_FOR_SLOT') return { schemaVersion: RESUME_RUNNER_VERSION, ...review, workBatchId, history, state: readWorkBatch(resolvedRoot, workBatchId) };
      continue;
    }
    if (action.action === 'DONE') return { schemaVersion: RESUME_RUNNER_VERSION, status: 'DONE', workBatchId, history, state };
    if (action.action === 'BUILD_AND_FREEZE') {
      const refs = options.runRefs || currentRunRefs(state);
      if (!refs.length) return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason: 'RUN_REFS_REQUIRED', workBatchId, history, state };
      freezeWorkBatch(resolvedRoot, workBatchId, refs);
      continue;
    }
    if (action.action === 'FREEZE_RECORDED_REPAIR') {
      const iteration = state.repairIterations.at(-1);
      const refs = iteration.pendingRunRefs || options.runRefs || (iteration.repairKind === 'REVIEW_ONLY_RESOLUTION' ? currentRunRefs(state) : null);
      if (!refs?.length) return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason: 'RECORDED_REPAIR_RUN_REFS_REQUIRED', workBatchId, history, state };
      freezeWorkBatch(resolvedRoot, workBatchId, refs);
      continue;
    }
    if (action.action === 'FINAL_AUDIT' || action.action === 'TARGETED_RECHECK') {
      const review = await runReview(resolvedRoot, state, action.action === 'FINAL_AUDIT' ? 'FINAL_AUDIT' : 'TARGETED_RECHECK', options);
      if (review.status === 'WAITING_FOR_SLOT') return { schemaVersion: RESUME_RUNNER_VERSION, ...review, workBatchId, history, state: readWorkBatch(resolvedRoot, workBatchId) };
      continue;
    }
    if (action.action === 'EXECUTION_RECOVERY') {
      const failed = action.failedLaunchId;
      const purpose = state.launches.find(launch => launch.launchId === failed)?.purpose;
      if (!purpose) return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason: 'EXECUTION_RECOVERY_PURPOSE_MISSING', workBatchId, history, state };
      const review = await runReview(resolvedRoot, state, purpose, options, failed);
      if (review.status === 'WAITING_FOR_SLOT') return { schemaVersion: RESUME_RUNNER_VERSION, ...review, workBatchId, history, state: readWorkBatch(resolvedRoot, workBatchId) };
      continue;
    }
    if (action.action === 'AUTO_REPAIR') {
      const repaired = await performRepair(resolvedRoot, state, action, options);
      if (repaired.status === 'HUMAN_DECISION_REQUIRED') return { schemaVersion: RESUME_RUNNER_VERSION, status: repaired.status, reason: repaired.reason, workBatchId, history, results: repaired.results, state: readWorkBatch(resolvedRoot, workBatchId) };
      continue;
    }
    if (action.action === 'CLOSURE') {
      if (options.closureHandler) return { schemaVersion: RESUME_RUNNER_VERSION, status: await options.closureHandler({ root: resolvedRoot, state, history }), workBatchId, history, state: readWorkBatch(resolvedRoot, workBatchId) };
      return { schemaVersion: RESUME_RUNNER_VERSION, status: 'CLOSURE_READY', productionAuthorized: false, workBatchId, history, state };
    }
    if (action.action === 'WAIT_FOR_SLOT') {
      if (options.waitForSlot) { await options.waitForSlot({ root: resolvedRoot, state }); continue; }
      return { schemaVersion: RESUME_RUNNER_VERSION, status: 'WAITING_FOR_SLOT', workBatchId, history, state };
    }
    return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason: action.reason || action.action, workBatchId, history, state };
  }
  const state = readWorkBatch(resolvedRoot, workBatchId);
  return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason: 'RESUME_STEP_LIMIT', workBatchId, history, state };
}

export const resumePastExamOnePass = resumePastExam;

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const option = name => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : undefined;
  const workBatchId = option('--work-batch-id');
  const predecessorWorkBatchId = option('--predecessor-work-batch-id');
  const newWorkBatchId = option('--new-work-batch-id');
  resumePastExam(root, { workBatchId, predecessorWorkBatchId, newWorkBatchId, providerCommand: process.execPath, providerArgs: [defaultProviderAdapter(root), '--job', newWorkBatchId || workBatchId] }).then(result => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
