import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { canonicalJson, bytesSha, objectSha, readBoundFile, nonempty, safePath } from './canonical.mjs';
import { semanticDiff, changeImpactMap, runLevelSemanticHash } from './semantic-diff.mjs';
import { runInputSha, loadBoundQuestionBanks } from './closure.mjs';
import { computeV2AxisInputShas } from './v2-audit.mjs';
import { AXIS_REVIEW_BINDING, validateMachineEvidence, validateTypedEvidence } from './review-evidence-v2.mjs';
import { detectRenderImpact, validateRenderReviewReuseReceipt } from './render-impact.mjs';

import { validateSchema } from './schema.mjs';
const budgetContract = JSON.parse(fs.readFileSync(new URL('./contracts/work-batch-v1.schema.json', import.meta.url), 'utf8'));

export const WORK_BATCH_VERSION = 'APMATH_WORK_BATCH_v1';
export const MACHINE_AXES = Object.freeze(['STATIC', 'METADATA', 'RENDER_CAPTURE']);
export const AGENT_BUDGET = Object.freeze({ productionIndependent: 0, finalAuditors: 1, targetedRechecks: 1, concurrentExpensive: 1, automaticSecondAuditors: 0, explicitSecondAuditors: 1, retries: 0, recursiveSubagents: 0 });
const same = (a, b) => canonicalJson(a) === canonicalJson(b);
const check = (condition, code) => { if (!condition) throw new Error(`HOLD:${code}`); };
const time = () => new Date().toISOString();
const load = (root, ref) => JSON.parse(readBoundFile(root, ref));
const sorted = values => [...new Set(values)].sort();
const tokenTelemetry = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
const retiredTokenHoldCodes = new Set(['HOLD:TOKEN_BUDGET_EXCEEDED', 'HOLD:TOKEN_RESERVATION_INVALID', 'HOLD:PROVIDER_TOKEN_USAGE_INVALID']);
const statePath = (root, id) => {
  check(/^[A-Za-z0-9_-]+$/.test(id || ''), 'WORK_BATCH_ID_INVALID');
  return safePath(root, `alive/runtime/work-batches/${id}/state.json`, { mustExist: false });
};

// All mutations share one repository lock. A crashed lock is HOLD, never a timeout lease.
function mutate(root, id, fn) {
  const file = statePath(root, id), lock = path.join(path.dirname(path.dirname(file)), '.dispatch.lock');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const recovering = path.join(path.dirname(lock), '.dispatch.recovering');
  check(!fs.existsSync(recovering), 'LOCK_RECOVERY_IN_PROGRESS');
  const owner = { schemaVersion: 'APMATH_DISPATCH_LOCK_v1', pid: process.pid, host: os.hostname(), ownerToken: randomUUID(), acquiredAt: time(), workBatchId: id };
  let fd;
  try { fd = fs.openSync(lock, 'wx'); } catch { throw new Error('HOLD:RECONCILE_EXISTING_DISPATCH_LOCK'); }
  try {
    fs.writeFileSync(fd, JSON.stringify(owner) + '\n'); fs.fsyncSync(fd);
    check(!fs.existsSync(recovering), 'LOCK_RECOVERY_IN_PROGRESS');
    const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
    if (previous) validateState(previous);
    let state;
    try { state = fn(previous ? structuredClone(previous) : null); validateState(state); }
    catch (error) {
      if (previous) {
        const held = { ...previous, status: 'HOLD', lastHold: { at: time(), code: error.message } };
        const holdFile = `${file}.hold`;
        const holdFd = fs.openSync(holdFile, 'wx');
        try { fs.writeFileSync(holdFd, JSON.stringify(held, null, 2) + '\n'); fs.fsyncSync(holdFd); } finally { fs.closeSync(holdFd); }
        fs.renameSync(holdFile, file);
      }
      throw error;
    }
    validateState(state);
    const temporary = `${file}.next`;
    const out = fs.openSync(temporary, 'wx');
    try { fs.writeFileSync(out, JSON.stringify(state, null, 2) + '\n'); fs.fsyncSync(out); } finally { fs.closeSync(out); }
    fs.renameSync(temporary, file);
    return state;
  } finally {
    fs.closeSync(fd);
    // A recovery never takes a live owner's lock; do not remove a different owner.
    if (fs.existsSync(lock) && JSON.parse(fs.readFileSync(lock, 'utf8')).ownerToken === owner.ownerToken) fs.unlinkSync(lock);
  }
}


export function inspectDispatchLock(root) {
  const lock = safePath(root, 'alive/runtime/work-batches/.dispatch.lock', { mustExist: false });
  if (!fs.existsSync(lock)) return { status: fs.existsSync(path.join(path.dirname(lock), '.dispatch.recovering')) ? 'LOCK_RECONCILIATION_REQUIRED' : 'NO_DISPATCH_LOCK', lockSha: 'ABSENT' };
  const data = fs.readFileSync(lock);
  let owner = null;
  try { owner = JSON.parse(data); } catch { /* legacy empty locks cannot prove owner death */ }
  return { status: 'LOCK_RECONCILIATION_REQUIRED', lockSha: bytesSha(data), owner };
}

export function recoverDispatchLock(root, expectedLockSha) {
  check(expectedLockSha === 'ABSENT' || /^sha256:[0-9a-f]{64}$/.test(expectedLockSha || ''), 'EXPECTED_LOCK_SHA_REQUIRED');
  const result = spawnSync(process.env.APMATH_PYTHON || 'python', ['-X', 'utf8', fileURLToPath(new URL('./recover-dispatch-lock.py', import.meta.url)), '--root', fs.realpathSync(root), '--expected-lock-sha', expectedLockSha], { encoding: 'utf8', windowsHide: true, maxBuffer: 1024 * 1024 });
  if (result.error) throw new Error(`HOLD:LOCK_RECOVERY_HELPER:${result.error.message}`);
  let report;
  try { report = JSON.parse(result.stdout); } catch { throw new Error('HOLD:LOCK_RECOVERY_RESULT_UNKNOWN'); }
  if (result.status !== 0) throw new Error((report.errors || ['HOLD:LOCK_RECOVERY_FAILED']).join(';'));
  return report;
}

function validateState(state) {
  check(validateSchema(state, budgetContract).length === 0, 'BUDGET_STATE_CONTRACT_INVALID');
  check(state?.schemaVersion === WORK_BATCH_VERSION && same(state.policy, AGENT_BUDGET), 'BUDGET_POLICY_INVALID');
  check(Array.isArray(state.launches) && Array.isArray(state.freezes), 'LEDGER_REQUIRED');
  check(new Set(state.launches.map(l => l.launchId)).size === state.launches.length, 'DUPLICATE_LAUNCH');
  for (const purpose of ['FINAL_AUDIT', 'TARGETED_RECHECK', 'SECOND_AUDIT']) check(state.launches.filter(l => l.purpose === purpose).length <= 1, 'AGENT_BUDGET_EXCEEDED');
  const active = state.launches.filter(l => ['RESERVED', 'DISPATCHED'].includes(l.status));
  check(active.length <= 1, 'CONCURRENT_EXPENSIVE_EXCEEDED');
  for (const launch of state.launches) {
    check(['FINAL_AUDIT', 'TARGETED_RECHECK', 'SECOND_AUDIT'].includes(launch.purpose), 'PRODUCTION_OR_AXIS_DISPATCH_FORBIDDEN');
    check(launch.contextIsolation === 'STATELESS_INPUTS' && launch.subagentToolsEnabled === false && ['U1','U2','U3'].every(phase => nonempty(launch.contexts?.[phase]?.sessionId) && nonempty(launch.contexts?.[phase]?.contextId)), 'AUDITOR_CAPABILITIES_INVALID');
    check(launch.parentLaunchId === null && launch.recursiveSubagentLaunchCount === 0, 'RECURSIVE_SUBAGENT_FORBIDDEN');
    check(['RESERVED', 'DISPATCHED', 'COMPLETED', 'FAILED'].includes(launch.status), 'LAUNCH_STATE_INVALID');
    const freeze = state.freezes.find(f => f.freezeSha === launch.freezeSha);
    check(freeze && Date.parse(launch.reservedAt) >= Date.parse(freeze.frozenAt), 'REVIEW_BEFORE_FREEZE');
    check(same(launch.scope, launch.purpose === 'FINAL_AUDIT' ? freeze.targets : freeze.affected), 'LAUNCH_SCOPE_MISMATCH');
    if (launch.purpose === 'SECOND_AUDIT') check(launch.authorization?.explicit === true && ['CONFLICT', 'HIGH_RISK'].includes(launch.authorization.reason) && nonempty(launch.authorization.authorizedBy), 'SECOND_AUDITOR_NOT_AUTHORIZED');
  }
  for (let i = 0; i < state.launches.length; i++) {
    const launch = state.launches[i];
    check(i === 0 ? launch.purpose === 'FINAL_AUDIT' : state.launches[0].status === 'COMPLETED', 'AUDIT_ORDER_INVALID');
    if (i) check(state.launches[i-1].endedAt && Date.parse(launch.reservedAt) >= Date.parse(state.launches[i-1].endedAt), 'CONCURRENT_HISTORY_INVALID');
    if (['COMPLETED','FAILED'].includes(launch.status)) check(nonempty(launch.externalId) && nonempty(launch.endedAt) && (launch.usedTokens === undefined || launch.usedTokens === null || Number.isSafeInteger(launch.usedTokens) && launch.usedTokens >= 0), 'TERMINAL_USAGE_REQUIRED');
  }
  for (const freeze of state.freezes) { const { freezeSha, ...body } = freeze; check(freezeSha === objectSha(body), 'FREEZE_SHA_INVALID'); }
}

export function readWorkBatch(root, id) {
  const state = JSON.parse(fs.readFileSync(statePath(root, id), 'utf8'));
  validateState(state); return state;
}

export function initWorkBatch(root, spec) {
  return mutate(root, spec.workBatchId, prior => {
    check(!prior, 'WORK_BATCH_ALREADY_EXISTS_RECONCILE');
    const directory = path.dirname(path.dirname(statePath(root, spec.workBatchId)));
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) if (entry.isDirectory()) {
      const existing = path.join(directory, entry.name, 'state.json');
      if (fs.existsSync(existing)) { const owner = JSON.parse(fs.readFileSync(existing, 'utf8')); validateState(owner); check(!owner.runIds.some(runId => spec.runIds?.includes(runId)), 'RUN_ALREADY_OWNED_REUSE_EXISTING_WORK_BATCH'); }
    }
    check(Array.isArray(spec.runIds) && spec.runIds.length > 0 && sorted(spec.runIds).length === spec.runIds.length && spec.runIds.every(nonempty), 'WHOLE_JOB_RUN_IDS_REQUIRED');
    check(nonempty(spec.builderId) && nonempty(spec.builderSessionId), 'MAIN_WORKER_IDENTITY_REQUIRED');
    return { schemaVersion: WORK_BATCH_VERSION, workBatchId: spec.workBatchId, runIds: sorted(spec.runIds), builderId: spec.builderId, builderSessionId: spec.builderSessionId, policy: AGENT_BUDGET, status: 'PRODUCTION', freezes: [], launches: [] };
  });
}

function collectFreeze(root, state, runRefs) {
  const runs = runRefs.map(ref => load(root, ref));
  check(same(sorted(runs.map(r => r.runId)), state.runIds) && runs.length === state.runIds.length, 'WHOLE_JOB_FREEZE_REQUIRED');
  const targets = [], affected = [], bindings = [];
  const priorFreeze = state.freezes.at(-1);
  const finalLaunch = state.launches.find(l => l.purpose === 'FINAL_AUDIT' && l.status === 'COMPLETED');
  const defects = finalLaunch ? load(root, finalLaunch.providerReceiptRef).defects || [] : [];
  for (const run of runs) {
    check(run.schemaVersion === 'APMATH_PIPELINE_RUN_v2' && run.workBatchId === state.workBatchId, 'WORK_BATCH_RUN_BINDING');
    check(run.builderId === state.builderId && run.builderSessionId === state.builderSessionId, 'MAIN_WORKER_BINDING');
    check(run.inputSha === runInputSha(run), 'CURRENT_RUN_HASH_REQUIRED');
    for (const ref of run.inputs) readBoundFile(root, ref);
    const shas = computeV2AxisInputShas(root, run);
    check(run.questions.length === Object.keys(shas).length, 'DUPLICATE_JOB_UID');
    const old = priorFreeze?.bindings.find(b => b.runId === run.runId);
    const actual = loadBoundQuestionBanks(root, run);
    const runSemanticSha = runLevelSemanticHash(run, actual);
    const delta = semanticDiff(old?.questions || [], actual, { previousDependencies: old ? { runLevel: old.runSemanticSha } : {}, currentDependencies: { runLevel: runSemanticSha } });
    const impact = changeImpactMap(delta, actual, { previousAxisInputShas: old?.axisInputShas || {}, currentAxisInputShas: shas });
    if (old) check(run.revision === old.revision || run.revision === old.revision + 1, 'REVISION_LINEAGE_INVALID');
    const machineEvidence = (run.evidence || []).map(ref => load(root, ref)).filter(e => MACHINE_AXES.includes(e.axis));
    for (const [uid, axes] of Object.entries(shas)) for (const axis of ['STATIC','METADATA'].filter(a => axes[a])) {
      const matches = machineEvidence.filter(e => e.questionUid === uid && e.axis === axis);
      check(matches.length === 1 && matches[0].axisInputSha === axes[axis] && !validateMachineEvidence(matches[0], run, { diagnostic: true }).length && !validateTypedEvidence(matches[0], { diagnostic: true }).length, 'WHOLE_JOB_MACHINE_CHECK_REQUIRED');
      if (axis === 'STATIC') check(['jsLoad', 'hashes', 'assetBinding', 'fileParity'].every(key => matches[0].payload.checks[key] === 'PASS'), 'MACHINE_EXECUTION_BLOCKED');
    }
    const captureRefs = (run.evidence || []).filter(ref => load(root, ref).axis === 'RENDER_CAPTURE');
    const captures = captureRefs.map(ref => load(root, ref));
    for (const c of captures) check(c.mode === 'MACHINE_CURRENT' && c.auditorPrincipalType === 'MACHINE_COLLECTOR' && c.inputSha === run.inputSha && c.revision === run.revision && c.runId === run.runId && c.status === 'PASS', 'CURRENT_MACHINE_CAPTURE_REQUIRED');
    const witnesses = captures.flatMap(c => c.payload.itemWitnesses || []);
    const needsRender = Object.values(shas).some(row => row.RENDER_REVIEW);
    const missingRender = needsRender ? run.questions.filter(q => !['exam', 'solution', 'answer'].every(mode => ['desktop', 'mobile'].every(viewport => witnesses.some(w => w.questionUid === q.questionUid && w.mode === mode && w.viewportProfile === viewport)))).map(q => q.questionUid) : [];
    if (run.pipeline !== 'past-exam') check(!missingRender.length, 'WHOLE_JOB_RENDER_CAPTURE_REQUIRED');
    const renderChanged = old && needsRender ? detectRenderImpact(old.witnesses, witnesses).affectedRenderUidSet : [];
    for (const [questionUid, axes] of Object.entries(shas)) {
      const row = { runId: run.runId, questionUid };
      targets.push(row);
      if (!old || defects.some(d => d.runId === run.runId && d.questionUid === questionUid) || impact.affectedUidAxisSet.some(a => a.questionUid === questionUid && !MACHINE_AXES.includes(a.axis)) || Object.entries(axes).some(([axis, sha]) => !MACHINE_AXES.includes(axis) && old.axisInputShas[questionUid]?.[axis] !== sha) || renderChanged.includes(questionUid)) affected.push(row);
    }
    bindings.push({ questions: actual, runSemanticSha, runId: run.runId, revision: run.revision, inputSha: run.inputSha, axisInputShas: shas, witnesses,
      preAudit: { purpose: 'DIAGNOSTIC_CONTINUATION_ONLY', promotionAuthorized: false, machineEvidence: machineEvidence.map(e => ({ questionUid: e.questionUid, axis: e.axis, status: e.status, evidenceSha: objectSha(e) })), missingRender } });
  }
  targets.sort((a,b) => canonicalJson(a).localeCompare(canonicalJson(b)));
  affected.sort((a,b) => canonicalJson(a).localeCompare(canonicalJson(b)));
  if (priorFreeze) check(same(targets, priorFreeze.targets), 'WORK_BATCH_TARGET_DENOMINATOR_CHANGED');
  const body = { workBatchId: state.workBatchId, frozenAt: time(), runRefs, targets, affected, bindings, machineCheckedUidCount: targets.length, predecessorFreezeSha: priorFreeze?.freezeSha || null };
  return { ...body, freezeSha: objectSha(body) };
}

export function freezeWorkBatch(root, id, runRefs) {
  return mutate(root, id, state => {
    check(state && !state.launches.some(l => ['RESERVED', 'DISPATCHED'].includes(l.status)), 'RECONCILE_EXISTING_EXPENSIVE_TASK');
    if (state.freezes.length) check(state.launches.some(l => l.purpose === 'FINAL_AUDIT' && l.status === 'COMPLETED') && !state.launches.some(l => l.purpose === 'TARGETED_RECHECK'), 'NO_AUTOMATIC_REVIEW_LOOP');
    state.freezes.push(collectFreeze(root, state, runRefs)); state.status = 'FROZEN'; return state;
  });
}

function requireLegacyReconciled(root) {
  const runtime = safePath(root, 'alive/runtime', { mustExist: false });
  const inspect = value => {
    if (!value || typeof value !== 'object') return;
    if (value.status === 'DISPATCHED' && (value.dispatch || value.externalId)) throw new Error('HOLD:RECONCILE_LEGACY_DISPATCHED_TASK');
    for (const nested of Object.values(value)) inspect(nested);
  };
  const walk = directory => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'work-batches') continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name === 'manifest.json') inspect(JSON.parse(fs.readFileSync(file, 'utf8')));
    }
  };
  walk(runtime);
}

export function reserveWorkBatchReview(root, id, request) {
  return mutate(root, id, state => {
    // A historic token-only HOLD has no authority after token telemetry became
    // observational. Other HOLD causes, active providers, and all agent gates stay hard.
    if (state?.status === 'HOLD' && retiredTokenHoldCodes.has(state.lastHold?.code) && !state.launches.some(l => ['RESERVED', 'DISPATCHED'].includes(l.status))) {
      state.status = state.freezes.length ? 'FROZEN' : 'PRODUCTION';
      delete state.lastHold;
    }
    check(state?.status === 'FROZEN', 'WHOLE_JOB_FREEZE_REQUIRED');
    requireLegacyReconciled(root);
    check(!request.parentLaunchId && request.recursiveSubagentLaunchCount === 0, 'RECURSIVE_SUBAGENT_FORBIDDEN');
    check(!state.launches.some(l => ['RESERVED', 'DISPATCHED'].includes(l.status)), 'RECONCILE_EXISTING_EXPENSIVE_TASK');
    const directory = path.dirname(path.dirname(statePath(root, id)));
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) if (entry.isDirectory()) {
      const otherFile = path.join(directory, entry.name, 'state.json');
      if (fs.existsSync(otherFile)) { const other = JSON.parse(fs.readFileSync(otherFile, 'utf8')); validateState(other); check(!other.launches.some(l => ['RESERVED', 'DISPATCHED'].includes(l.status)), 'GLOBAL_EXPENSIVE_SLOT_OCCUPIED'); }
    }
    const freeze = state.freezes.at(-1);
    const fresh = collectFreeze(root, { ...state, freezes: state.freezes.slice(0, -1) }, freeze.runRefs);
    check(same(fresh.bindings, freeze.bindings), 'FROZEN_INPUT_CHANGED');
    check(nonempty(request.auditorId) && request.auditorId !== state.builderId && nonempty(request.auditorSessionId) && request.auditorSessionId !== state.builderSessionId, 'AUDITOR_INDEPENDENCE_REQUIRED');
    if (request.purpose === 'FINAL_AUDIT') check(state.launches.length === 0 && state.freezes.length === 1, 'FINAL_AUDITOR_ALREADY_USED');
    else check(state.launches.some(l => l.purpose === 'FINAL_AUDIT' && l.status === 'COMPLETED'), 'FIRST_AUDIT_MUST_COMPLETE');
    if (request.purpose === 'TARGETED_RECHECK') check(state.freezes.length > 1 && freeze.affected.length > 0, 'TARGETED_CHANGE_REQUIRED');
    check(!state.launches.some(l => l.purpose === request.purpose), 'AGENT_BUDGET_EXHAUSTED');
    check(request.callerRole === 'MAIN_WORKER', 'ONLY_MAIN_WORKER_CAN_DISPATCH');
    check(['U1','U2','U3'].every(phase => nonempty(request.contexts?.[phase]?.sessionId) && nonempty(request.contexts?.[phase]?.contextId)), 'SEALED_SUBCONTEXTS_REQUIRED');
    check(new Set(Object.values(request.contexts).map(c => c.sessionId)).size === 3 && new Set(Object.values(request.contexts).map(c => c.contextId)).size === 3 && Object.values(request.contexts).every(c => c.sessionId !== state.builderSessionId), 'SEALED_CONTEXT_COLLISION');
    check(request.contextIsolation === 'STATELESS_INPUTS' && request.subagentToolsEnabled === false, 'AUDITOR_ISOLATION_CAPABILITY_REQUIRED');
    let providerAttestationPlanRef = null;
    if (request.providerAttestationPlanRef) {
      const plan = load(root, request.providerAttestationPlanRef);
      const nextLaunchId = `${id}:${state.launches.length + 1}`;
      check(plan?.schemaVersion === 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1' && plan.kind === 'PROVIDER_STATELESS_REVIEW_PLAN', 'PROVIDER_PLAN_INVALID');
      check(plan.workBatchId === id && plan.launchId === nextLaunchId && plan.purpose === request.purpose && plan.freezeSha === freeze.freezeSha && plan.builderId === state.builderId && plan.builderSessionId === state.builderSessionId, 'PROVIDER_PLAN_LAUNCH_BINDING');
      check(plan.preflightResponse?.requestSha === plan.preflightRequest?.requestSha && plan.preflightResponseSha === objectSha(plan.preflightResponse), 'PROVIDER_PLAN_ATTESTATION_TAMPERED');
      check(plan.auditorId === request.auditorId && plan.auditorSessionId === request.auditorSessionId && same(plan.contexts, request.contexts) && plan.contextIsolation === 'STATELESS_INPUTS' && plan.subagentToolsEnabled === false && nonempty(plan.externalId), 'PROVIDER_PLAN_CONTEXT_BINDING');
      providerAttestationPlanRef = request.providerAttestationPlanRef;
    }
    const launch = { contexts: request.contexts, contextIsolation: request.contextIsolation, subagentToolsEnabled: false, launchId: `${id}:${state.launches.length + 1}`, purpose: request.purpose, freezeSha: freeze.freezeSha, scope: request.purpose === 'FINAL_AUDIT' ? freeze.targets : freeze.affected, auditorId: request.auditorId, auditorSessionId: request.auditorSessionId, parentLaunchId: null, recursiveSubagentLaunchCount: 0, authorization: request.authorization || null, reservedAt: time(), status: 'RESERVED', externalId: null, ...(providerAttestationPlanRef ? { providerAttestationPlanRef } : {}) };
    state.launches.push(launch); return state;
  });
}

// Reservation precedes provider launch. Ambiguous provider outcomes retain the slot indefinitely.
export function reconcileWorkBatchReview(root, id, request) {
  return mutate(root, id, state => {
    const launch = state?.launches.find(l => l.launchId === request.launchId);
    check(launch, 'UNKNOWN_LAUNCH');
    if (launch.status === 'RESERVED') {
      check(request.status === 'DISPATCHED' && nonempty(request.externalId), 'PROVIDER_ID_REQUIRED');
      check(!state.launches.some(l => l.externalId === request.externalId), 'DUPLICATE_PROVIDER_TASK');
      launch.externalId = request.externalId; launch.status = 'DISPATCHED'; launch.dispatchedAt = time();
    } else {
      check(request.externalId === launch.externalId, 'RECONCILE_SAME_PROVIDER_TASK');
      if (request.status === launch.status) return state;
      check(launch.status === 'DISPATCHED' && ['COMPLETED', 'FAILED'].includes(request.status), 'NO_REDISPATCH_OR_TIMEOUT_RETRY');
      const receipt = load(root, request.providerReceiptRef);
      check(receipt.externalId === launch.externalId && receipt.status === request.status && receipt.launchId === launch.launchId && receipt.recursiveSubagentLaunchCount === 0 && receipt.independentAgentLaunchCount === 1 && receipt.expensiveAgentLaunchCount === 1 && receipt.concurrentExpensiveAgentPeak === 1, 'PROVIDER_TERMINAL_RECEIPT_REQUIRED');
      check(Array.isArray(receipt.defects) && receipt.defects.every(d => launch.scope.some(row => row.runId === d.runId && row.questionUid === d.questionUid)), 'PROVIDER_DEFECT_SCOPE_REQUIRED');
      check(Array.isArray(receipt.evidenceRefs), 'PROVIDER_OUTPUT_REFS_REQUIRED');
      for (const ref of receipt.evidenceRefs) readBoundFile(root, ref);
      launch.status = request.status; launch.endedAt = time(); launch.usedTokens = tokenTelemetry(receipt.usedTokens); launch.providerReceiptRef = request.providerReceiptRef;
      if (request.status === 'FAILED') state.status = 'HOLD';
      if (request.status === 'COMPLETED' && retiredTokenHoldCodes.has(state.lastHold?.code) && !state.launches.some(item => ['RESERVED', 'DISPATCHED'].includes(item.status))) {
        state.status = 'FROZEN';
        delete state.lastHold;
      }
    }
    return state;
  });
}

export function validateWorkBatchEvidence(root, run, evidence) {
  const errors = [];
  try {
    const state = readWorkBatch(root, run.workBatchId);
    const launch = state.launches.find(l => l.launchId === evidence.launchId);
    check(launch && launch.status === 'COMPLETED' && launch.externalId === evidence.externalTaskId && launch.auditorId === evidence.reviewerId, 'EVIDENCE_LAUNCH_NOT_COMPLETED');
    const phase = AXIS_REVIEW_BINDING[evidence.axis]?.[0];
    check(phase && launch.contexts[phase].sessionId === evidence.reviewSessionId, 'EVIDENCE_SEALED_SESSION_BINDING');
    const packetRef = run.auditorPacketRefs?.find(ref => load(root, ref).packetSha === evidence.reviewIsolationProvenanceSha);
    const packet = packetRef && load(root, packetRef);
    check(packet && packet.contextId === launch.contexts[phase].contextId, 'EVIDENCE_SEALED_CONTEXT_BINDING');
    const freeze = state.freezes.find(f => f.freezeSha === launch.freezeSha);
    check(freeze.bindings.some(b => b.runId === run.runId && b.revision === run.revision && b.inputSha === run.inputSha), 'EVIDENCE_FREEZE_BINDING');
    let freshUids = evidence.payload?.questionUids || [evidence.questionUid];
    if (evidence.axis === 'RENDER_REVIEW') {
      const items = evidence.payload.itemReviews;
      check(Array.isArray(items) && same(sorted(items.map(i => i.questionUid)), sorted(evidence.payload.questionUids)), 'RENDER_ITEM_COVERAGE');
      freshUids = items.filter(i => i.mode !== 'REUSED').map(i => i.questionUid);
      check(same(sorted(freshUids), sorted(evidence.payload.freshQuestionUids || [])), 'RENDER_FRESH_SCOPE_DECLARATION');
      const captureRef = run.evidence.find(ref => load(root, ref).evidenceId === evidence.payload.captureEvidenceId);
      for (const item of items.filter(i => i.mode === 'REUSED')) {
        const receipt = load(root, item.reuseReceiptRef);
        check(validateRenderReviewReuseReceipt(root, receipt, { currentCaptureRef: captureRef, currentRunInputSha: run.inputSha, questionUid: item.questionUid }).status === 'PASS', 'RENDER_ITEM_REUSE_INVALID');
      }
    }
    for (const uid of freshUids) check(launch.scope.some(row => row.runId === run.runId && row.questionUid === uid), 'FRESH_REVIEW_OUTSIDE_IMPACT');
    check(Date.parse(evidence.startedAt) >= Date.parse(launch.dispatchedAt) && Date.parse(evidence.frozenAt) <= Date.parse(launch.endedAt), 'EVIDENCE_LAUNCH_TIME_BINDING');
    const terminal = load(root, launch.providerReceiptRef);
    if (evidence.auditorPrincipalType === 'STATELESS_MODEL') {
      check(launch.providerAttestationPlanRef, 'PROVIDER_ATTESTATION_PLAN_REQUIRED');
      const plan = load(root, launch.providerAttestationPlanRef);
      check(plan?.schemaVersion === 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1' && plan.kind === 'PROVIDER_STATELESS_REVIEW_PLAN', 'PROVIDER_PLAN_INVALID');
      check(plan.workBatchId === state.workBatchId && plan.launchId === launch.launchId && plan.purpose === launch.purpose && plan.freezeSha === launch.freezeSha && plan.externalId === launch.externalId, 'PROVIDER_PLAN_LAUNCH_BINDING');
      check(plan.auditorId === launch.auditorId && plan.auditorSessionId === launch.auditorSessionId && same(plan.contexts, launch.contexts), 'PROVIDER_PLAN_CONTEXT_BINDING');
      check(plan.preflightResponse?.requestSha === plan.preflightRequest?.requestSha && plan.preflightResponseSha === objectSha(plan.preflightResponse), 'PROVIDER_PLAN_ATTESTATION_TAMPERED');
      check(terminal.providerPlanRef && same(terminal.providerPlanRef, launch.providerAttestationPlanRef), 'PROVIDER_RECEIPT_PLAN_BINDING');
    }
    const evidenceRef = run.evidence?.find(ref => load(root, ref).evidenceId === evidence.evidenceId);
    check(evidenceRef && terminal.evidenceRefs?.some(ref => same(ref, evidenceRef)), 'PROVIDER_EVIDENCE_OUTPUT_BINDING');
  } catch (error) { errors.push(error.message); }
  return errors;
}

export function workBatchMetrics(root, run, rows = []) {
  try {
    const state = readWorkBatch(root, run.workBatchId), freeze = state.freezes.at(-1);
    const launches = state.launches.filter(l => l.externalId);
    const events = launches.flatMap(l => [{ t: l.dispatchedAt, n: 1 }, ...(l.endedAt ? [{ t: l.endedAt, n: -1 }] : [])]).sort((a,b) => a.t.localeCompare(b.t) || a.n-b.n);
    let active = 0, peak = 0; for (const e of events) { active += e.n; peak = Math.max(peak, active); }
    return { workBatchId: state.workBatchId, targetCount: freeze?.targets.length || 0, totalTargetCount: freeze?.targets.length || 0, totalAffectedCount: freeze?.affected.length || 0, independentAgentLaunchCount: launches.length, expensiveAgentLaunchCount: launches.length, concurrentExpensiveAgentPeak: peak, freshLlmUidCount: new Set(rows.filter(r => r.status === 'PASS' && r.mode === 'FRESH' && !MACHINE_AXES.includes(r.axis)).map(r => r.questionUid)).size, reusedUidCount: new Set(rows.filter(r => r.status === 'PASS' && r.mode === 'REUSED').map(r => r.questionUid)).size, machineCheckedUidCount: freeze?.machineCheckedUidCount || 0, retryLaunchCount: 0, secondAuditorLaunchCount: launches.filter(l => l.purpose === 'SECOND_AUDIT').length, recursiveSubagentLaunchCount: 0, usedTokens: launches.every(l => Number.isSafeInteger(l.usedTokens)) ? launches.reduce((n,l) => n+l.usedTokens,0) : null, tokenTelemetryAvailable: launches.every(l => Number.isSafeInteger(l.usedTokens)), agentBudgetStatus: state.status === 'HOLD' || state.launches.some(l => ['RESERVED','DISPATCHED'].includes(l.status)) ? 'HOLD' : 'WITHIN_BUDGET' };
  } catch (error) { return { workBatchId: run?.workBatchId || null, agentBudgetStatus: 'HOLD', errors: [error.message] }; }
}
