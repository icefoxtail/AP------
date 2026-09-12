import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aggregateWorkBatchAudit, freezeWorkBatch, materializeWorkBatchRepair, readWorkBatch, recordWorkBatchRepair, reserveWorkBatchReview, reconcileWorkBatchReview } from '../pipeline-core/work-batch.mjs';
import { buildAuditorPacket, buildU3CandidatePayload, loadCandidateReviewContext, visualApplicabilityForQuestion } from '../pipeline-core/review-isolation-runner.mjs';
import { fileRef, readBoundFile, writeNewJson } from '../pipeline-core/canonical.mjs';
import { loadBoundQuestionBanks } from '../pipeline-core/closure.mjs';
import { prepareProviderReview, dispatchProviderReview, validateProviderPacketPreflight, visualAssetPayload } from '../pipeline-core/provider-bridge.mjs';
import { nextWorkBatchAction } from '../pipeline-core/defect-router.mjs';
import { materializeAuthorityBinding } from '../pipeline-core/authority-repair.mjs';
import { materializeVisualEvidence } from '../pipeline-core/visual-repair.mjs';
import { recoveryCapabilityRegistry } from '../pipeline-core/recovery-capability.mjs';

export const RESUME_RUNNER_VERSION = 'APMATH_PAST_EXAM_RESUME_RUNNER_v1';
export const RESUME_ACTIONS = Object.freeze([
  'BUILD_AND_FREEZE',
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
    ...(row.question.solutionAssetPaths || []),
    ...(row.question.solutionAssetRefs || []).map(ref => ref.path).filter(Boolean),
  ];
  return paths.map(relative => refForPath(row.run, relative)).filter(Boolean).map(ref => visualAssetPayload(root, ref));
}

function packetInputs(root, state, plan) {
  const rows = runRows(root, state, state.freezes.find(freeze => freeze.freezeSha === plan.freezeSha));
  const byPhase = {
    U1: rows.map(row => ({ questionUid: row.question.questionUid, content: row.question.sourceRecord?.content, choices: row.question.sourceRecord?.choices || [], problemAssets: sourceAssetRef(root, row) ? [sourceAssetRef(root, row)] : [] })),
    U2: rows.map(row => ({ questionUid: row.question.questionUid, artifact: solutionAssets(root, row).length ? { assetRefs: solutionAssets(root, row) } : null, renderWitnesses: [], visualApplicability: visualApplicabilityForQuestion({ ...row.declared, ...row.question, visual: row.declared?.visual }) })),
    U3: [],
  };
  const candidateContext = Object.assign({}, ...rows.map(row => row.candidateContext));
  byPhase.U3 = rows.map(row => buildU3CandidatePayload(candidateContext, row.question.questionUid, { frozenU1: { status: 'FROZEN_SOURCE_PACKET' }, frozenU2: { status: 'FROZEN_ARTIFACT_PACKET' }, renderWitnesses: [], metadata: {}, dependencies: {} }));
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
      inputVisibilityProfile: phase === 'U1' ? 'SOURCE_ONLY' : phase === 'U2' ? 'ARTIFACT_ONLY' : 'FROZEN_V1_V2',
      priorReviewVisibility: phase === 'U3' ? 'FROZEN_U1_U2' : 'NONE',
      sealed: true,
      launchId: plan.launchId,
      externalTaskId: plan.externalId,
      candidateContext: phase === 'U3' ? Object.assign({}, ...packetInputs(root, state, plan).rows.map(row => row.candidateContext)) : null,
    });
    const relative = `${packetRoot}/${phase.toLowerCase()}-packet.json`;
    writeNewJson(path.resolve(root, relative), packet);
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
  const preflight = prepareProviderReview(root, { workBatchId: state.workBatchId, purpose, transport: providerTransport(root, state.workBatchId, options), planPath, executionRecoveryOfLaunchId });
  const reserved = reserveWorkBatchReview(root, state.workBatchId, preflight.reservationRequest);
  const plan = readJsonRef(root, preflight.planRef);
  const packets = options.packetRefsFactory ? await options.packetRefsFactory({ root, state: reserved, plan }) : buildPackets(root, reserved, plan, launchRoot);
  validateProviderPacketPreflight(root, { workBatchId: state.workBatchId, planPath, packetRefs: packets });
  return dispatchProviderReview(root, { workBatchId: state.workBatchId, launchId: plan.launchId, planPath, packetRefs: packets, transport: providerTransport(root, state.workBatchId, options), receiptPath });
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
      return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason, predecessorWorkBatchId: options.predecessorWorkBatchId, newWorkBatchId: options.newWorkBatchId, history: [] };
    }
    workBatchId = materialized.workBatchId;
  }
  if (!workBatchId) throw new Error('RESUME_WORK_BATCH_ID_REQUIRED');
  const maxSteps = options.maxSteps || 32;
  const history = [];
  for (let step = 0; step < maxSteps; step++) {
    const state = readWorkBatch(resolvedRoot, workBatchId);
    const action = nextWorkBatchAction(state, { capabilityRegistry: recoveryCapabilityRegistry(resolvedRoot, { inputReady: true }), sourceRecoveryCapability: options.sourceRecoveryCapability });
    history.push({ step, action: action.action, status: action.status, reason: action.reason || null });
    if (options.onAction) await options.onAction({ state, action, step });
    if (action.action === 'DONE') return { schemaVersion: RESUME_RUNNER_VERSION, status: 'DONE', workBatchId, history, state };
    if (action.action === 'BUILD_AND_FREEZE') {
      const refs = options.runRefs || currentRunRefs(state);
      if (!refs.length) return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason: 'RUN_REFS_REQUIRED', workBatchId, history, state };
      freezeWorkBatch(resolvedRoot, workBatchId, refs);
      continue;
    }
    if (action.action === 'FINAL_AUDIT' || action.action === 'TARGETED_RECHECK') {
      await runReview(resolvedRoot, state, action.action === 'FINAL_AUDIT' ? 'FINAL_AUDIT' : 'TARGETED_RECHECK', options);
      continue;
    }
    if (action.action === 'EXECUTION_RECOVERY') {
      const failed = action.failedLaunchId;
      const purpose = state.launches.find(launch => launch.launchId === failed)?.purpose;
      if (!purpose) return { schemaVersion: RESUME_RUNNER_VERSION, status: 'HUMAN_DECISION_REQUIRED', reason: 'EXECUTION_RECOVERY_PURPOSE_MISSING', workBatchId, history, state };
      await runReview(resolvedRoot, state, purpose, options, failed);
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
  const workBatchId = process.argv[process.argv.indexOf('--work-batch-id') + 1];
  const predecessorWorkBatchId = process.argv[process.argv.indexOf('--predecessor-work-batch-id') + 1];
  const newWorkBatchId = process.argv[process.argv.indexOf('--new-work-batch-id') + 1];
  resumePastExam(root, { workBatchId, predecessorWorkBatchId, newWorkBatchId, providerCommand: process.execPath, providerArgs: [defaultProviderAdapter(root), '--job', newWorkBatchId || workBatchId] }).then(result => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
