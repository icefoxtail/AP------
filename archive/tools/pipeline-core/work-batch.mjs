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
import { createExecutionIdentity, isBenchmarkJobKind, validateModelRouteParity } from './gold-contract.mjs';
import { latestMainCommit } from '../past-exam-pipeline/lib/calibration.mjs';

import { validateSchema } from './schema.mjs';
const budgetContract = JSON.parse(fs.readFileSync(new URL('./contracts/work-batch-v1.schema.json', import.meta.url), 'utf8'));

export const WORK_BATCH_VERSION = 'APMATH_WORK_BATCH_v1';
export const MACHINE_AXES = Object.freeze(['STATIC', 'METADATA', 'RENDER_CAPTURE']);
export const MAX_REPAIR_ITERATIONS = 3;
export const WORKFLOW_PROFILES = Object.freeze({ LEGACY: 'LEGACY', PAST_EXAM: 'PAST_EXAM' });
export const AGENT_BUDGET = Object.freeze({ productionIndependent: 0, finalAuditors: 1, targetedRechecks: 1, maxRepairIterations: 1, concurrentExpensive: 1, automaticSecondAuditors: 0, explicitSecondAuditors: 1, retries: 0, recursiveSubagents: 0 });
export const PAST_EXAM_AGENT_BUDGET = Object.freeze({ ...AGENT_BUDGET, targetedRechecks: MAX_REPAIR_ITERATIONS, maxRepairIterations: MAX_REPAIR_ITERATIONS });
export const REPAIR_DISPOSITIONS = Object.freeze(['REPAIRED_CANDIDATE', 'REPAIRED_ASSET', 'EXTRACTION_CORRECTED', 'SOURCE_DEFECT_CONFIRMED', 'AUDITOR_FALSE_POSITIVE', 'NO_CHANGE_WITH_EVIDENCE', 'HOLD']);
const same = (a, b) => canonicalJson(a) === canonicalJson(b);
const check = (condition, code) => { if (!condition) throw new Error(`HOLD:${code}`); };
const time = () => new Date().toISOString();
const load = (root, ref) => JSON.parse(readBoundFile(root, ref));
const sorted = values => [...new Set(values)].sort();
const tokenTelemetry = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
const retiredTokenHoldCodes = new Set(['HOLD:TOKEN_BUDGET_EXCEEDED', 'HOLD:TOKEN_RESERVATION_INVALID', 'HOLD:PROVIDER_TOKEN_USAGE_INVALID']);
const nonPersistentReservationErrors = new Set(['HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED']);
const targetKey = target => canonicalJson({ runId: target?.runId || null, questionUid: target?.questionUid || null });
const budgetForProfile = profile => profile === WORKFLOW_PROFILES.PAST_EXAM ? PAST_EXAM_AGENT_BUDGET : AGENT_BUDGET;

function launchIdentityParts(launch) {
  return {
    auditorId: launch?.auditorId || null,
    auditorSessionId: launch?.auditorSessionId || null,
    sessionIds: ['U1', 'U2', 'U3'].map(phase => launch?.contexts?.[phase]?.sessionId).filter(nonempty),
    contextIds: ['U1', 'U2', 'U3'].map(phase => launch?.contexts?.[phase]?.contextId).filter(nonempty)
  };
}

function identityCollision(left, right) {
  const a = launchIdentityParts(left);
  const b = launchIdentityParts(right);
  return (a.auditorId && a.auditorId === b.auditorId)
    || (a.auditorSessionId && [b.auditorSessionId, ...b.sessionIds].includes(a.auditorSessionId))
    || (b.auditorSessionId && a.sessionIds.includes(b.auditorSessionId))
    || a.sessionIds.some(sessionId => b.sessionIds.includes(sessionId))
    || a.contextIds.some(contextId => b.contextIds.includes(contextId));
}

export function assertFreshLaunchIdentity(previousLaunches = [], candidate) {
  const candidateLaunch = { auditorId: candidate?.auditorId, auditorSessionId: candidate?.auditorSessionId, contexts: candidate?.contexts };
  for (const previous of previousLaunches) check(!identityCollision(previous, candidateLaunch), 'CROSS_LAUNCH_AUDITOR_CONTEXT_REUSE');
  return true;
}
export function maxRepairIterationsForState(state) {
  return state?.policy?.maxRepairIterations || state?.policy?.targetedRechecks || budgetForProfile(state?.workflowProfile).maxRepairIterations;
}
export function freezeInputSha(freeze) {
  const bindings = freeze?.bindings || [];
  if (bindings.length === 1) return bindings[0].inputSha;
  return objectSha(bindings.map(binding => ({ runId: binding.runId, inputSha: binding.inputSha })).sort((a, b) => canonicalJson(a).localeCompare(canonicalJson(b))));
}
const statePath = (root, id) => {
  check(/^[A-Za-z0-9_-]+$/.test(id || ''), 'WORK_BATCH_ID_INVALID');
  return safePath(root, `alive/runtime/work-batches/${id}/state.json`, { mustExist: false });
};

function targetKeys(targets, missingCode = 'BENCHMARK_DENOMINATOR_TARGETS_REQUIRED') {
  check(Array.isArray(targets), missingCode);
  const keys = targets.map(target => {
    check(nonempty(target?.runId) && nonempty(target?.questionUid), 'BENCHMARK_DENOMINATOR_TARGET_IDENTITY_INVALID');
    return targetKey(target);
  });
  check(new Set(keys).size === keys.length, 'BENCHMARK_DENOMINATOR_DUPLICATE_TARGET');
  return keys;
}

function validateBenchmarkDenominator(targets, denominator) {
  check(denominator?.status === 'FROZEN', 'BENCHMARK_DENOMINATOR_REQUIRED');
  const allKeys = targetKeys(targets);
  const eligibleKeys = targetKeys(denominator.eligibleTargets, 'BENCHMARK_ELIGIBLE_TARGETS_REQUIRED');
  const excludedKeys = targetKeys(denominator.excludedTargets, 'BENCHMARK_EXCLUDED_TARGETS_REQUIRED');
  check(Number.isSafeInteger(denominator.totalTargetCount) && denominator.totalTargetCount >= 0, 'BENCHMARK_TOTAL_TARGET_COUNT_INVALID');
  check(Number.isSafeInteger(denominator.eligibleTargetCount) && denominator.eligibleTargetCount >= 0, 'BENCHMARK_ELIGIBLE_TARGET_COUNT_INVALID');
  check(Number.isSafeInteger(denominator.excludedTargetCount) && denominator.excludedTargetCount >= 0, 'BENCHMARK_EXCLUDED_TARGET_COUNT_INVALID');
  check(denominator.totalTargetCount === targets.length, 'BENCHMARK_DENOMINATOR_TOTAL_MISMATCH');
  check(denominator.eligibleTargetCount === denominator.eligibleTargets.length, 'BENCHMARK_DENOMINATOR_ELIGIBLE_COUNT_MISMATCH');
  check(denominator.excludedTargetCount === denominator.excludedTargets.length, 'BENCHMARK_DENOMINATOR_EXCLUDED_COUNT_MISMATCH');
  check(denominator.totalTargetCount === denominator.eligibleTargetCount + denominator.excludedTargetCount, 'BENCHMARK_DENOMINATOR_PARTITION_COUNT_MISMATCH');
  check(!eligibleKeys.some(key => excludedKeys.includes(key)), 'BENCHMARK_DENOMINATOR_OVERLAP');
  check(same([...new Set([...eligibleKeys, ...excludedKeys])].sort(), [...allKeys].sort()), 'BENCHMARK_DENOMINATOR_TARGET_PARTITION_MISMATCH');
  check(Array.isArray(denominator.excludedRuns), 'BENCHMARK_EXCLUDED_RUNS_REQUIRED');
  const excludedRunIds = denominator.excludedRuns.map(row => {
    check(nonempty(row?.runId) && nonempty(row?.status), 'BENCHMARK_EXCLUDED_RUN_INVALID');
    return row.runId;
  });
  check(new Set(excludedRunIds).size === excludedRunIds.length, 'BENCHMARK_EXCLUDED_RUN_DUPLICATE');
  check(same(sorted(excludedRunIds), sorted([...new Set(denominator.excludedTargets.map(target => target.runId))])), 'BENCHMARK_EXCLUDED_RUNS_TARGET_PARITY');
  check(denominator.eligibleTargetCount > 0, 'GOLD_BENCHMARK_DENOMINATOR_EMPTY');
  return denominator;
}

// All semantic reviewer scopes are derived from this frozen partition. The
// production branch deliberately retains its historical targets/affected
// behavior; benchmark jobs review only the denominator-eligible targets.
export function reviewScopeForPurpose(state, freeze, purpose) {
  check(freeze, 'WHOLE_JOB_FREEZE_REQUIRED');
  if (!isBenchmarkJobKind(state.jobKind)) return purpose === 'FINAL_AUDIT' ? freeze.targets : freeze.affected;
  const denominator = validateBenchmarkDenominator(freeze.targets, freeze.benchmarkDenominator);
  if (purpose === 'FINAL_AUDIT') return denominator.eligibleTargets;
  const eligible = new Set(denominator.eligibleTargets.map(targetKey));
  return freeze.affected.filter(target => eligible.has(targetKey(target)));
}

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
      if (previous && !nonPersistentReservationErrors.has(error.message)) {
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
  check(state?.schemaVersion === WORK_BATCH_VERSION, 'BUDGET_POLICY_INVALID');
  const workflowProfile = state.workflowProfile || (state.policy?.maxRepairIterations > 1 ? WORKFLOW_PROFILES.PAST_EXAM : WORKFLOW_PROFILES.LEGACY);
  check(Object.values(WORKFLOW_PROFILES).includes(workflowProfile), 'WORKFLOW_PROFILE_INVALID');
  const policy = state.policy || {};
  const expectedBudget = budgetForProfile(workflowProfile);
  for (const key of Object.keys(expectedBudget).filter(key => key !== 'maxRepairIterations')) check(policy[key] === expectedBudget[key], 'BUDGET_POLICY_INVALID');
  if (policy.maxRepairIterations === undefined) check(workflowProfile === WORKFLOW_PROFILES.LEGACY && policy.targetedRechecks === 1, 'BUDGET_POLICY_INVALID');
  else check(policy.maxRepairIterations === expectedBudget.maxRepairIterations, 'BUDGET_POLICY_INVALID');
  const maxRepairIterations = maxRepairIterationsForState({ workflowProfile, policy });
  if (state.predecessorWorkBatchId !== undefined) check(/^[A-Za-z0-9_-]+$/.test(state.predecessorWorkBatchId) && state.predecessorWorkBatchId !== state.workBatchId, 'PREDECESSOR_WORK_BATCH_INVALID');
  if (state.predecessorFreezeSha !== undefined) check(/^sha256:[0-9a-f]{64}$/.test(state.predecessorFreezeSha), 'PREDECESSOR_FREEZE_SHA_INVALID');
  if (state.predecessorLaunchId !== undefined) check(nonempty(state.predecessorLaunchId), 'PREDECESSOR_LAUNCH_ID_INVALID');
  check(Array.isArray(state.launches) && Array.isArray(state.freezes), 'LEDGER_REQUIRED');
  const openDefectSet = state.openDefectSet || [];
  const openDefects = state.openDefects || [];
  const repairIterations = state.repairIterations || [];
  check(Array.isArray(openDefectSet), 'OPEN_DEFECT_SET_REQUIRED');
  check(new Set(openDefectSet.map(targetKey)).size === openDefectSet.length, 'OPEN_DEFECT_SET_DUPLICATE');
  check(Array.isArray(openDefects), 'OPEN_DEFECTS_REQUIRED');
  const openKeys = new Set(openDefectSet.map(targetKey));
  for (const defect of openDefects) check(openKeys.has(targetKey(defect)), 'OPEN_DEFECT_IDENTITY_MISMATCH');
  check(Array.isArray(repairIterations) && repairIterations.length <= maxRepairIterations, 'REPAIR_ITERATION_LIMIT');
  for (const iteration of repairIterations) {
    check(Number.isSafeInteger(iteration.iteration) && iteration.iteration >= 1 && iteration.iteration <= maxRepairIterations, 'REPAIR_ITERATION_INVALID');
    check(['REPAIR_REQUIRED', 'REPAIR_RECORDED', 'FROZEN_FOR_RECHECK', 'CLOSED', 'HOLD'].includes(iteration.status), 'REPAIR_ITERATION_STATUS_INVALID');
    check(Array.isArray(iteration.openDefectSet || []), 'REPAIR_ITERATION_DEFECTS_REQUIRED');
    check(Array.isArray(iteration.defects || []), 'REPAIR_ITERATION_DEFECT_RECORDS_REQUIRED');
  }
  if (state.jobKind !== undefined) check(typeof state.jobKind === 'string' && (state.jobKind === 'PRODUCTION' || isBenchmarkJobKind(state.jobKind) || state.jobKind === 'DIAGNOSTIC'), 'JOB_KIND_INVALID');
  if (state.executionIdentity !== undefined) {
    check(state.executionIdentity?.schemaVersion === 'APMATH_GOLD_EXECUTION_CONTRACT_v1', 'MODEL_ROUTE_IDENTITY_INVALID');
    check(state.executionIdentity.jobKind === state.jobKind, 'MODEL_ROUTE_JOB_KIND_MISMATCH');
    const parity = validateModelRouteParity(state.executionIdentity);
    if (isBenchmarkJobKind(state.jobKind) && parity.status === 'PASS' && state.executionIdentity.MODEL_ROUTE_PARITY !== 'PASS') throw new Error('MODEL_ROUTE_PARITY_STATE_MISMATCH');
  }
  check(new Set(state.launches.map(l => l.launchId)).size === state.launches.length, 'DUPLICATE_LAUNCH');
  for (const purpose of ['FINAL_AUDIT', 'SECOND_AUDIT']) check(state.launches.filter(l => l.purpose === purpose).length <= 1, 'AGENT_BUDGET_EXCEEDED');
  check(state.launches.filter(l => l.purpose === 'TARGETED_RECHECK').length <= maxRepairIterations, 'REPAIR_ITERATION_LIMIT');
  check(state.freezes.length <= maxRepairIterations + 1, 'REPAIR_FREEZE_LIMIT');
  const active = state.launches.filter(l => ['RESERVED', 'DISPATCHED'].includes(l.status));
  check(active.length <= 1, 'CONCURRENT_EXPENSIVE_EXCEEDED');
  for (const freeze of state.freezes) if (isBenchmarkJobKind(state.jobKind)) validateBenchmarkDenominator(freeze.targets, freeze.benchmarkDenominator);
  for (const launch of state.launches) {
    check(['FINAL_AUDIT', 'TARGETED_RECHECK', 'SECOND_AUDIT'].includes(launch.purpose), 'PRODUCTION_OR_AXIS_DISPATCH_FORBIDDEN');
    check(launch.contextIsolation === 'STATELESS_INPUTS' && launch.subagentToolsEnabled === false && ['U1','U2','U3'].every(phase => nonempty(launch.contexts?.[phase]?.sessionId) && nonempty(launch.contexts?.[phase]?.contextId)), 'AUDITOR_CAPABILITIES_INVALID');
    check(launch.parentLaunchId === null && launch.recursiveSubagentLaunchCount === 0, 'RECURSIVE_SUBAGENT_FORBIDDEN');
    check(['RESERVED', 'DISPATCHED', 'COMPLETED', 'FAILED'].includes(launch.status), 'LAUNCH_STATE_INVALID');
    const freeze = state.freezes.find(f => f.freezeSha === launch.freezeSha);
    check(freeze && Date.parse(launch.reservedAt) >= Date.parse(freeze.frozenAt), 'REVIEW_BEFORE_FREEZE');
    check(same(launch.scope, reviewScopeForPurpose(state, freeze, launch.purpose)), 'LAUNCH_SCOPE_MISMATCH');
    if (launch.inputSha !== undefined) check(launch.inputSha === freezeInputSha(freeze), 'REVIEW_INPUT_SHA_BINDING');
    if (launch.repairIteration !== undefined) check(Number.isSafeInteger(launch.repairIteration) && launch.repairIteration >= 0 && launch.repairIteration <= maxRepairIterations, 'REPAIR_ITERATION_INVALID');
    if (launch.purpose === 'SECOND_AUDIT') check(launch.authorization?.explicit === true && ['CONFLICT', 'HIGH_RISK'].includes(launch.authorization.reason) && nonempty(launch.authorization.authorizedBy), 'SECOND_AUDITOR_NOT_AUTHORIZED');
  }
  for (let i = 0; i < state.launches.length; i++) for (let j = 0; j < i; j++) {
    check(!identityCollision(state.launches[j], state.launches[i]), 'CROSS_LAUNCH_AUDITOR_CONTEXT_REUSE');
  }
  for (let i = 0; i < state.launches.length; i++) {
    const launch = state.launches[i];
    check(i === 0 ? launch.purpose === 'FINAL_AUDIT' : state.launches[0].status === 'COMPLETED', 'AUDIT_ORDER_INVALID');
    if (i) check(state.launches[i-1].endedAt && Date.parse(launch.reservedAt) >= Date.parse(state.launches[i-1].endedAt), 'CONCURRENT_HISTORY_INVALID');
    if (['COMPLETED','FAILED'].includes(launch.status)) check(nonempty(launch.externalId) && nonempty(launch.endedAt) && (launch.usedTokens === undefined || launch.usedTokens === null || Number.isSafeInteger(launch.usedTokens) && launch.usedTokens >= 0), 'TERMINAL_USAGE_REQUIRED');
  }
  for (let index = 0; index < state.freezes.length; index++) {
    const freeze = state.freezes[index];
    const { freezeSha, ...body } = freeze;
    check(freezeSha === objectSha(body), 'FREEZE_SHA_INVALID');
    if (index > 0 && freeze.predecessorFreezeSha !== undefined) check(freeze.predecessorFreezeSha === state.freezes[index - 1].freezeSha, 'FREEZE_PREDECESSOR_INVALID');
  }
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
    const jobKind = String(spec.jobKind || 'PRODUCTION').trim().toUpperCase();
    check(jobKind === 'PRODUCTION' || isBenchmarkJobKind(jobKind) || jobKind === 'DIAGNOSTIC', 'JOB_KIND_INVALID');
    const executionIdentity = createExecutionIdentity({ jobKind, requestedModel: spec.requestedModel, requestedReasoningEffort: spec.requestedReasoningEffort });
    if (isBenchmarkJobKind(jobKind)) check(nonempty(executionIdentity.requestedModel) && nonempty(executionIdentity.requestedReasoningEffort), 'MODEL_ROUTE_REQUEST_REQUIRED');
    if (isBenchmarkJobKind(jobKind)) {
      check(spec.jobAuthority?.startSha && spec.jobAuthority?.calibrationSha && spec.jobAuthority?.rulePackSha, 'START_TIME_AUTHORITY_REQUIRED');
      let latest;
      try { latest = latestMainCommit(root); } catch { throw new Error('START_TIME_STALE'); }
      check(spec.jobAuthority.startSha === latest, 'START_TIME_STALE');
    }
    const workflowProfile = String(spec.workflowProfile || (spec.pipeline === 'past-exam' ? WORKFLOW_PROFILES.PAST_EXAM : WORKFLOW_PROFILES.LEGACY)).trim().toUpperCase();
    check(Object.values(WORKFLOW_PROFILES).includes(workflowProfile), 'WORKFLOW_PROFILE_INVALID');
    return { schemaVersion: WORK_BATCH_VERSION, workBatchId: spec.workBatchId, runIds: sorted(spec.runIds), builderId: spec.builderId, builderSessionId: spec.builderSessionId, jobKind, workflowProfile, executionIdentity, jobAuthority: spec.jobAuthority || null, policy: budgetForProfile(workflowProfile), status: 'PRODUCTION', freezes: [], launches: [], openDefectSet: [], openDefects: [], repairIterations: [] };
  });
}

export function materializeWorkBatchRepair(root, spec) {
  return mutate(root, spec.workBatchId, prior => {
    check(!prior, 'WORK_BATCH_ALREADY_EXISTS_RECONCILE');
    check(nonempty(spec.predecessorWorkBatchId) && spec.predecessorWorkBatchId !== spec.workBatchId, 'PREDECESSOR_WORK_BATCH_REQUIRED');
    const predecessor = readWorkBatch(root, spec.predecessorWorkBatchId);
    check(predecessor.status === 'FROZEN' || predecessor.status === 'HOLD' && predecessor.lastHold?.code === 'HOLD:REPAIR_STAGNATION', 'PREDECESSOR_WORK_BATCH_NOT_FROZEN');
    check(!predecessor.launches.some(launch => ['RESERVED', 'DISPATCHED'].includes(launch.status)), 'PREDECESSOR_EXPENSIVE_TASK_ACTIVE');
    const finalLaunch = [...predecessor.launches].reverse().find(launch => ['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(launch.purpose) && launch.status === 'COMPLETED');
    check(finalLaunch?.providerReceiptRef, 'PREDECESSOR_COMPLETED_REVIEW_REQUIRED');
    const receipt = load(root, finalLaunch.providerReceiptRef);
    check(receipt.status === 'COMPLETED' && Array.isArray(receipt.defects) && receipt.defects.length > 0, 'PREDECESSOR_OPEN_DEFECTS_REQUIRED');
    const freeze = predecessor.freezes.find(candidate => candidate.freezeSha === finalLaunch.freezeSha);
    check(freeze, 'PREDECESSOR_FREEZE_REQUIRED');
    const targets = new Set(freeze.targets.map(targetKey));
    const defects = receipt.defects.filter(defect => nonempty(defect?.runId) && nonempty(defect?.questionUid)).map(defect => structuredClone(defect));
    check(defects.length > 0 && defects.every(defect => targets.has(targetKey(defect))), 'PREDECESSOR_DEFECT_SCOPE_REQUIRED');
    const openDefectSet = [...new Map(defects.map(defect => [targetKey(defect), { runId: defect.runId, questionUid: defect.questionUid }])).values()].sort((a, b) => targetKey(a).localeCompare(targetKey(b)));
    const runIds = spec.runIds || predecessor.runIds;
    check(same(sorted(runIds), predecessor.runIds), 'PREDECESSOR_RUN_SCOPE_CHANGED');
    const builderId = spec.builderId || predecessor.builderId;
    const builderSessionId = spec.builderSessionId || predecessor.builderSessionId;
    check(builderId === predecessor.builderId && builderSessionId === predecessor.builderSessionId, 'PREDECESSOR_BUILDER_BINDING');
    const workflowProfile = String(spec.workflowProfile || WORKFLOW_PROFILES.PAST_EXAM).trim().toUpperCase();
    check(workflowProfile === WORKFLOW_PROFILES.PAST_EXAM, 'PAST_EXAM_REPAIR_PROFILE_REQUIRED');
    const predecessorFreeze = structuredClone(predecessor.freezes);
    const predecessorLaunches = structuredClone(predecessor.launches);
    const iteration = { iteration: 1, triggerLaunchId: finalLaunch.launchId, status: 'REPAIR_REQUIRED', openedAt: time(), closedAt: null, auditInputSha: freezeInputSha(freeze), openDefectSet, defects, recheckScope: [], dispositions: [] };
    return {
      schemaVersion: WORK_BATCH_VERSION,
      workBatchId: spec.workBatchId,
      runIds: sorted(runIds),
      builderId,
      builderSessionId,
      jobKind: predecessor.jobKind || 'PRODUCTION',
      workflowProfile,
      executionIdentity: predecessor.executionIdentity || null,
      jobAuthority: predecessor.jobAuthority || null,
      policy: PAST_EXAM_AGENT_BUDGET,
      status: 'REPAIR_REQUIRED',
      predecessorWorkBatchId: predecessor.workBatchId,
      predecessorFreezeSha: freeze.freezeSha,
      predecessorLaunchId: finalLaunch.launchId,
      predecessorReceiptRef: structuredClone(finalLaunch.providerReceiptRef),
      freezes: predecessorFreeze,
      launches: predecessorLaunches,
      openDefectSet,
      openDefects: defects,
      repairIterations: [iteration]
    };
  });
}

function collectFreeze(root, state, runRefs) {
  const runs = runRefs.map(ref => load(root, ref));
  check(same(sorted(runs.map(r => r.runId)), state.runIds) && runs.length === state.runIds.length, 'WHOLE_JOB_FREEZE_REQUIRED');
  const allTargets = [], eligibleTargets = [], excludedTargets = [], affected = [], bindings = [];
  const priorFreeze = state.freezes.at(-1);
  const latestCompletedLaunch = [...state.launches].reverse().find(l => l.status === 'COMPLETED');
  const defects = latestCompletedLaunch ? load(root, latestCompletedLaunch.providerReceiptRef).defects || [] : [];
  const authorities = [];
  const excludedRuns = [];
  for (const run of runs) {
    check(run.schemaVersion === 'APMATH_PIPELINE_RUN_v2' && run.workBatchId === state.workBatchId, 'WORK_BATCH_RUN_BINDING');
    check(run.builderId === state.builderId && run.builderSessionId === state.builderSessionId, 'MAIN_WORKER_BINDING');
    check(run.inputSha === runInputSha(run), 'CURRENT_RUN_HASH_REQUIRED');
    if (run.pastExamAuthority) authorities.push(run.pastExamAuthority);
    const eligibility = run.sourceAuthority?.goldBenchmarkEligibility || run.goldBenchmarkEligibility || null;
    let benchmarkEligible = true;
    if (isBenchmarkJobKind(state.jobKind)) {
      check(run.benchmarkKind === state.jobKind, 'JOB_KIND_RUN_BINDING');
      check(run.pastExamAuthority, 'FROZEN_JOB_AUTHORITY_REQUIRED');
      if (state.jobAuthority) check(same(run.pastExamAuthority, state.jobAuthority), 'FROZEN_START_SHA_MISMATCH');
      check(eligibility, 'GOLD_SOURCE_ELIGIBILITY_REQUIRED');
      benchmarkEligible = eligibility.denominatorIncluded === true;
      if (!benchmarkEligible) excludedRuns.push({ runId: run.runId, status: eligibility.status || 'GOLD_INELIGIBLE_SOURCE' });
    }
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
    const renderChanged = old && needsRender
      ? (old.witnesses?.length ? detectRenderImpact(old.witnesses, witnesses).affectedRenderUidSet : run.questions.map(question => question.questionUid))
      : [];
    for (const [questionUid, axes] of Object.entries(shas)) {
      const row = { runId: run.runId, questionUid };
      allTargets.push(row);
      if (isBenchmarkJobKind(state.jobKind)) (benchmarkEligible ? eligibleTargets : excludedTargets).push(row);
      if (!old || defects.some(d => d.runId === run.runId && d.questionUid === questionUid) || impact.affectedUidAxisSet.some(a => a.questionUid === questionUid && !MACHINE_AXES.includes(a.axis)) || Object.entries(axes).some(([axis, sha]) => !MACHINE_AXES.includes(axis) && old.axisInputShas[questionUid]?.[axis] !== sha) || renderChanged.includes(questionUid)) affected.push(row);
    }
    bindings.push({ questions: actual, runSemanticSha, runId: run.runId, revision: run.revision, inputSha: run.inputSha, axisInputShas: shas, witnesses,
      preAudit: { purpose: 'DIAGNOSTIC_CONTINUATION_ONLY', promotionAuthorized: false, machineEvidence: machineEvidence.map(e => ({ questionUid: e.questionUid ?? null, axis: e.axis, status: e.status, evidenceSha: objectSha(e) })), missingRender } });
  }
  allTargets.sort((a,b) => canonicalJson(a).localeCompare(canonicalJson(b)));
  eligibleTargets.sort((a,b) => canonicalJson(a).localeCompare(canonicalJson(b)));
  excludedTargets.sort((a,b) => canonicalJson(a).localeCompare(canonicalJson(b)));
  affected.sort((a,b) => canonicalJson(a).localeCompare(canonicalJson(b)));
  if (priorFreeze) check(same(allTargets, priorFreeze.targets), 'WORK_BATCH_TARGET_DENOMINATOR_CHANGED');
  if (authorities.length) {
    const authority = authorities[0];
    check(authorities.every(candidate => same(candidate, authority)), 'FROZEN_START_SHA_MISMATCH');
    if (state.jobAuthority) check(same(state.jobAuthority, authority), 'FROZEN_START_SHA_MISMATCH');
    state.jobAuthority = authority;
  }
  if (isBenchmarkJobKind(state.jobKind)) check(state.jobAuthority || authorities.length > 0, 'FROZEN_JOB_AUTHORITY_REQUIRED');
  const benchmarkDenominator = isBenchmarkJobKind(state.jobKind)
    ? { status: 'FROZEN', totalTargetCount: allTargets.length, eligibleTargetCount: eligibleTargets.length, excludedTargetCount: excludedTargets.length, eligibleTargets, excludedTargets, excludedRuns }
    : { status: 'NOT_APPLICABLE', eligibleTargetCount: allTargets.length, excludedRuns: [] };
  if (isBenchmarkJobKind(state.jobKind)) validateBenchmarkDenominator(allTargets, benchmarkDenominator);
  const body = { workBatchId: state.workBatchId, frozenAt: time(), runRefs, targets: allTargets, affected, bindings, machineCheckedUidCount: allTargets.length, predecessorFreezeSha: priorFreeze?.freezeSha || null, jobAuthority: state.jobAuthority || null, benchmarkDenominator };
  return { ...body, freezeSha: objectSha(body) };
}

function validateRepairLineage(state, freeze) {
  const iteration = state.repairIterations?.at(-1);
  if (!iteration || iteration.status !== 'REPAIR_RECORDED') return;
  check((iteration.repairInputSha || iteration.inputSha) === freezeInputSha(freeze), 'REPAIR_INPUT_SHA_LINEAGE_MISMATCH');
  const prior = state.freezes.at(-1);
  const previousByRun = new Map((prior?.bindings || []).map(binding => [binding.runId, binding]));
  const changed = freeze.bindings.filter(binding => {
    const previous = previousByRun.get(binding.runId);
    return !previous || previous.inputSha !== binding.inputSha || previous.revision !== binding.revision;
  });
  check(changed.length > 0, 'REPAIR_NEW_INPUT_REQUIRED');
  check(changed.every(binding => {
    const previous = previousByRun.get(binding.runId);
    return previous && binding.revision === previous.revision + 1 && binding.inputSha !== previous.inputSha;
  }), 'REPAIR_NEW_REVISION_REQUIRED');
  check(iteration.revision === Math.max(...changed.map(binding => binding.revision)), 'REPAIR_REVISION_LINEAGE_MISMATCH');
}

export function freezeWorkBatch(root, id, runRefs) {
  return mutate(root, id, state => {
    check(state && state.status !== 'HOLD', 'WORK_BATCH_HOLD_REQUIRES_RECONCILIATION');
    check(!state.launches.some(l => ['RESERVED', 'DISPATCHED'].includes(l.status)), 'RECONCILE_EXISTING_EXPENSIVE_TASK');
    if (state.freezes.length) {
      check(state.launches.some(l => l.purpose === 'FINAL_AUDIT' && l.status === 'COMPLETED'), 'FIRST_AUDIT_MUST_COMPLETE');
      check(state.launches.at(-1)?.status === 'COMPLETED', 'PREVIOUS_REVIEW_MUST_COMPLETE');
      const maxRepairIterations = maxRepairIterationsForState(state);
      check(state.freezes.length <= maxRepairIterations + 1, 'REPAIR_ITERATION_LIMIT');
    }
    const freeze = collectFreeze(root, state, runRefs);
    validateRepairLineage(state, freeze);
    state.freezes.push(freeze);
    const iteration = state.repairIterations?.at(-1);
    if (iteration && iteration.status === 'REPAIR_RECORDED') {
      iteration.status = 'FROZEN_FOR_RECHECK';
      iteration.freezeSha = freeze.freezeSha;
      iteration.recheckScope = freeze.affected;
    }
    state.status = 'FROZEN';
    return state;
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
    if (state?.status === 'HOLD' && state.lastHold?.code === 'HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED' && !state.launches.some(l => ['RESERVED', 'DISPATCHED'].includes(l.status)) && state.freezes.length) {
      const freeze = state.freezes.at(-1);
      const fresh = collectFreeze(root, { ...state, freezes: state.freezes.slice(0, -1) }, freeze.runRefs);
      check(same(fresh.bindings, freeze.bindings), 'FROZEN_INPUT_CHANGED');
      state.status = 'FROZEN';
      delete state.lastHold;
    }
    // A historic token-only HOLD has no authority after token telemetry became
    // observational. Other HOLD causes, active providers, and all agent gates stay hard.
    if (state?.status === 'HOLD' && retiredTokenHoldCodes.has(state.lastHold?.code) && !state.launches.some(l => ['RESERVED', 'DISPATCHED'].includes(l.status))) {
      state.status = state.freezes.length ? 'FROZEN' : 'PRODUCTION';
      delete state.lastHold;
    }
    if (state?.status === 'HOLD' && ['HOLD:REPAIR_ITERATION_LIMIT', 'HOLD:REPAIR_STAGNATION'].includes(state.lastHold?.code)) throw new Error(state.lastHold.code);
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
    else if (request.purpose === 'TARGETED_RECHECK') {
      check(state.launches.some(l => l.purpose === 'FINAL_AUDIT' && l.status === 'COMPLETED'), 'FIRST_AUDIT_MUST_COMPLETE');
      const repairCount = state.launches.filter(l => l.purpose === 'TARGETED_RECHECK').length;
      const maxRepairIterations = maxRepairIterationsForState(state);
      check(repairCount < maxRepairIterations, 'REPAIR_ITERATION_LIMIT');
      check(state.freezes.length === repairCount + 2 && freeze.affected.length > 0, 'TARGETED_CHANGE_REQUIRED');
      if (state.workflowProfile === WORKFLOW_PROFILES.PAST_EXAM && state.repairIterations?.length) check(state.repairIterations?.at(-1)?.status === 'FROZEN_FOR_RECHECK', 'REPAIR_NOT_FROZEN_FOR_RECHECK');
    } else check(state.launches.some(l => l.purpose === 'FINAL_AUDIT' && l.status === 'COMPLETED'), 'FIRST_AUDIT_MUST_COMPLETE');
    const scope = reviewScopeForPurpose(state, freeze, request.purpose);
    if (isBenchmarkJobKind(state.jobKind) && request.purpose === 'TARGETED_RECHECK') check(scope.length > 0, 'GOLD_BENCHMARK_RECHECK_SCOPE_EMPTY');
    if (request.purpose !== 'TARGETED_RECHECK') check(!state.launches.some(l => l.purpose === request.purpose), 'AGENT_BUDGET_EXHAUSTED');
    check(request.callerRole === 'MAIN_WORKER', 'ONLY_MAIN_WORKER_CAN_DISPATCH');
    check(['U1','U2','U3'].every(phase => nonempty(request.contexts?.[phase]?.sessionId) && nonempty(request.contexts?.[phase]?.contextId)), 'SEALED_SUBCONTEXTS_REQUIRED');
    check(new Set(Object.values(request.contexts).map(c => c.sessionId)).size === 3 && new Set(Object.values(request.contexts).map(c => c.contextId)).size === 3 && Object.values(request.contexts).every(c => c.sessionId !== state.builderSessionId), 'SEALED_CONTEXT_COLLISION');
    assertFreshLaunchIdentity(state.launches, request);
    check(request.contextIsolation === 'STATELESS_INPUTS' && request.subagentToolsEnabled === false, 'AUDITOR_ISOLATION_CAPABILITY_REQUIRED');
    let providerAttestationPlanRef = null;
    if (request.providerAttestationPlanRef) {
      const plan = load(root, request.providerAttestationPlanRef);
      const nextLaunchId = `${id}:${state.launches.length + 1}`;
      check(plan?.schemaVersion === 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1' && plan.kind === 'PROVIDER_STATELESS_REVIEW_PLAN', 'PROVIDER_PLAN_INVALID');
      const expectedRepairIteration = request.purpose === 'TARGETED_RECHECK' ? state.launches.filter(l => l.purpose === 'TARGETED_RECHECK').length + 1 : 0;
      check(plan.workBatchId === id && plan.launchId === nextLaunchId && plan.purpose === request.purpose && plan.freezeSha === freeze.freezeSha && plan.builderId === state.builderId && plan.builderSessionId === state.builderSessionId && plan.inputSha === freezeInputSha(freeze) && plan.repairIteration === expectedRepairIteration, 'PROVIDER_PLAN_LAUNCH_BINDING');
      check(plan.preflightResponse?.requestSha === plan.preflightRequest?.requestSha && plan.preflightResponseSha === objectSha(plan.preflightResponse), 'PROVIDER_PLAN_ATTESTATION_TAMPERED');
      check(plan.auditorId === request.auditorId && plan.auditorSessionId === request.auditorSessionId && same(plan.contexts, request.contexts) && plan.contextIsolation === 'STATELESS_INPUTS' && plan.subagentToolsEnabled === false && nonempty(plan.externalId), 'PROVIDER_PLAN_CONTEXT_BINDING');
      if (isBenchmarkJobKind(state.jobKind)) {
        check(plan.executionIdentity?.jobKind === state.jobKind && plan.executionIdentity.requestedModel === state.executionIdentity.requestedModel && plan.executionIdentity.requestedReasoningEffort === state.executionIdentity.requestedReasoningEffort, 'MODEL_ROUTE_REQUEST_BINDING');
        check(plan.executionIdentity.modelRouteObservedAtStart && plan.executionIdentity.actualModel && plan.executionIdentity.actualReasoningEffort, 'MODEL_ROUTE_OBSERVATION_REQUIRED');
      }
      providerAttestationPlanRef = request.providerAttestationPlanRef;
      if (plan.executionIdentity) state.executionIdentity = structuredClone(plan.executionIdentity);
    }
    const launchInputSha = freezeInputSha(freeze);
    const launch = { contexts: request.contexts, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, launchId: `${id}:${state.launches.length + 1}`, purpose: request.purpose, freezeSha: freeze.freezeSha, scope, auditorId: request.auditorId, auditorSessionId: request.auditorSessionId, parentLaunchId: null, recursiveSubagentLaunchCount: 0, authorization: request.authorization || null, reservedAt: time(), status: 'RESERVED', externalId: null, inputSha: launchInputSha, repairIteration: request.purpose === 'TARGETED_RECHECK' ? state.launches.filter(l => l.purpose === 'TARGETED_RECHECK').length + 1 : 0, ...(providerAttestationPlanRef ? { providerAttestationPlanRef } : {}) };
    state.launches.push(launch); return state;
  });
}

export function recoverLegacyReservationHold(root, id, evidenceRefs = []) {
  return mutate(root, id, state => {
    check(state?.status === 'HOLD', 'TRANSIENT_HOLD_REQUIRED');
    const exactGlobal = state.lastHold?.code === 'HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED';
    const overwrittenByRetry = state.lastHold?.code === 'HOLD:WHOLE_JOB_FREEZE_REQUIRED';
    check(exactGlobal || overwrittenByRetry, 'TRANSIENT_HOLD_CODE_INVALID');
    if (overwrittenByRetry) {
      check(Array.isArray(evidenceRefs) && evidenceRefs.length === 2, 'TRANSIENT_HOLD_HISTORY_REQUIRED');
      const reports = evidenceRefs.map(ref => load(root, ref));
      check(reports[0]?.status === 'HOLD' && reports[0]?.errors?.includes('HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED') && reports[1]?.status === 'HOLD' && reports[1]?.errors?.includes('HOLD:WHOLE_JOB_FREEZE_REQUIRED'), 'TRANSIENT_HOLD_HISTORY_MISMATCH');
    }
    check(!state.launches.some(launch => ['RESERVED', 'DISPATCHED'].includes(launch.status)), 'RECONCILE_EXISTING_EXPENSIVE_TASK');
    const freeze = state.freezes.at(-1);
    check(freeze, 'WHOLE_JOB_FREEZE_REQUIRED');
    const fresh = collectFreeze(root, { ...state, freezes: state.freezes.slice(0, -1) }, freeze.runRefs);
    check(same(fresh.bindings, freeze.bindings), 'FROZEN_INPUT_CHANGED');
    const directory = path.dirname(path.dirname(statePath(root, id)));
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) if (entry.isDirectory()) {
      const otherFile = path.join(directory, entry.name, 'state.json');
      if (fs.existsSync(otherFile)) {
        const other = JSON.parse(fs.readFileSync(otherFile, 'utf8'));
        validateState(other);
        check(!other.launches.some(launch => ['RESERVED', 'DISPATCHED'].includes(launch.status)), 'GLOBAL_EXPENSIVE_SLOT_OCCUPIED');
      }
    }
    state.status = 'FROZEN';
    delete state.lastHold;
    return state;
  });
}

// Reservation precedes provider launch. Ambiguous provider outcomes retain the slot indefinitely.
export function reconcileWorkBatchReview(root, id, request) {
  return mutate(root, id, state => {
    const launch = state?.launches.find(l => l.launchId === request.launchId);
    check(launch, 'UNKNOWN_LAUNCH');
    if (launch.status === 'RESERVED' && request.status === 'FAILED' && request.preDispatchFailure === true) {
      check(nonempty(request.externalId), 'PRE_DISPATCH_PROVIDER_ID_REQUIRED');
      const receipt = load(root, request.providerReceiptRef);
      check(receipt.status === 'FAILED' && receipt.preDispatchFailure === true && receipt.externalId === request.externalId && receipt.launchId === launch.launchId && receipt.independentAgentLaunchCount === 0 && receipt.expensiveAgentLaunchCount === 0 && receipt.concurrentExpensiveAgentPeak === 0 && receipt.recursiveSubagentLaunchCount === 0, 'PRE_DISPATCH_FAILURE_RECEIPT_REQUIRED');
      check(Array.isArray(receipt.evidenceRefs) && receipt.evidenceRefs.length > 0, 'PRE_DISPATCH_FAILURE_EVIDENCE_REQUIRED');
      for (const ref of receipt.evidenceRefs) readBoundFile(root, ref);
      launch.externalId = request.externalId;
      launch.status = 'FAILED';
      launch.endedAt = time();
      launch.usedTokens = null;
      launch.providerReceiptRef = request.providerReceiptRef;
      state.status = 'HOLD';
      return state;
    }
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
      if (isBenchmarkJobKind(state.jobKind)) {
        check(receipt.executionIdentity?.jobKind === state.jobKind, 'MODEL_ROUTE_RECEIPT_BINDING');
        check(receipt.executionIdentity?.modelRouteObservedAtClosure, 'MODEL_ROUTE_CLOSURE_OBSERVATION_REQUIRED');
        state.executionIdentity = structuredClone(receipt.executionIdentity);
      }
      launch.status = request.status; launch.endedAt = time(); launch.usedTokens = tokenTelemetry(receipt.usedTokens); launch.providerReceiptRef = request.providerReceiptRef;
      const defects = Array.isArray(receipt.defects) ? receipt.defects : [];
      const openDefects = defects.filter(defect => nonempty(defect?.runId) && nonempty(defect?.questionUid)).map(defect => structuredClone(defect));
      const defectSet = [...new Map(openDefects.map(defect => [targetKey(defect), { runId: defect.runId, questionUid: defect.questionUid }])).values()].sort((a, b) => targetKey(a).localeCompare(targetKey(b)));
      if (request.status === 'COMPLETED') {
        state.openDefectSet = defectSet;
        state.openDefects = openDefects;
        if (defectSet.length) {
          const maxRepairIterations = maxRepairIterationsForState(state);
          if ((state.repairIterations?.length || 0) >= maxRepairIterations) {
            state.status = 'HOLD';
            state.lastHold = { at: time(), code: 'HOLD:REPAIR_ITERATION_LIMIT' };
            return state;
          }
          const previousIteration = state.repairIterations?.at(-1);
          const repeated = launch.purpose === 'TARGETED_RECHECK'
            && same(previousIteration?.openDefectSet || [], defectSet)
            && (previousIteration?.repairInputSha || previousIteration?.inputSha) === launch.inputSha;
          if (launch.purpose === 'TARGETED_RECHECK' && previousIteration?.status === 'FROZEN_FOR_RECHECK' && !repeated) {
            previousIteration.status = 'CLOSED';
            previousIteration.closedAt = time();
          }
          const iteration = {
            iteration: (state.repairIterations?.length || 0) + 1,
            triggerLaunchId: launch.launchId,
            status: repeated ? 'HOLD' : 'REPAIR_REQUIRED',
            openedAt: time(),
            closedAt: null,
            inputSha: launch.inputSha,
            auditInputSha: launch.inputSha,
            openDefectSet: defectSet,
            defects: openDefects,
            recheckScope: [],
            dispositions: []
          };
          state.repairIterations = [...(state.repairIterations || []), iteration];
          if (repeated) {
            state.status = 'HOLD';
            state.lastHold = { at: time(), code: 'HOLD:REPAIR_STAGNATION' };
          } else state.status = 'REPAIR_REQUIRED';
        } else {
          const iteration = state.repairIterations?.at(-1);
          if (iteration && iteration.status !== 'CLOSED') { iteration.status = 'CLOSED'; iteration.closedAt = time(); }
          if (!(state.status === 'HOLD' && !retiredTokenHoldCodes.has(state.lastHold?.code))) state.status = 'FROZEN';
        }
      }
      if (request.status === 'FAILED') state.status = 'HOLD';
      if (request.status === 'COMPLETED' && retiredTokenHoldCodes.has(state.lastHold?.code) && !state.launches.some(item => ['RESERVED', 'DISPATCHED'].includes(item.status))) {
        state.status = 'FROZEN';
        delete state.lastHold;
      }
    }
    return state;
  });
}

export function recordWorkBatchRepair(root, id, request) {
  return mutate(root, id, state => {
    check(state.status === 'REPAIR_REQUIRED', 'REPAIR_REQUIRED_STATE_REQUIRED');
    check(request.builderId === state.builderId && request.builderSessionId === state.builderSessionId, 'REPAIR_BUILDER_IDENTITY_REQUIRED');
    const iteration = state.repairIterations?.at(-1);
    check(iteration && iteration.status === 'REPAIR_REQUIRED', 'REPAIR_ITERATION_NOT_OPEN');
    check(request.iteration === iteration.iteration, 'REPAIR_ITERATION_MISMATCH');
    check(Number.isSafeInteger(request.revision) && request.revision >= 1, 'REPAIR_REVISION_REQUIRED');
    check(/^sha256:[0-9a-f]{64}$/.test(request.inputSha || ''), 'REPAIR_INPUT_SHA_REQUIRED');
    check(Array.isArray(request.dispositions) && request.dispositions.length > 0, 'REPAIR_DISPOSITIONS_REQUIRED');
    const openKeys = new Set((state.openDefectSet || []).map(targetKey));
    const dispositionKeys = new Set();
    for (const disposition of request.dispositions) {
      check(REPAIR_DISPOSITIONS.includes(disposition?.disposition), 'REPAIR_DISPOSITION_INVALID');
      const key = targetKey(disposition);
      check(openKeys.has(key), 'REPAIR_DISPOSITION_SCOPE_REQUIRED');
      check(!dispositionKeys.has(key), 'REPAIR_DISPOSITION_DUPLICATE');
      dispositionKeys.add(key);
    }
    check(dispositionKeys.size === openKeys.size, 'REPAIR_DISPOSITION_COVERAGE_REQUIRED');
    iteration.status = 'REPAIR_RECORDED';
    iteration.revision = request.revision;
    iteration.repairInputSha = request.inputSha;
    iteration.dispositions = structuredClone(request.dispositions);
    iteration.repairRef = request.repairRef || null;
    iteration.recordedAt = time();
    const blockingDisposition = request.dispositions.find(disposition => ['HOLD', 'SOURCE_DEFECT_CONFIRMED'].includes(disposition.disposition));
    if (blockingDisposition) {
      iteration.status = 'HOLD';
      state.status = 'HOLD';
      state.lastHold = { at: time(), code: blockingDisposition.disposition === 'SOURCE_DEFECT_CONFIRMED' ? 'HOLD:SOURCE_DEFECT_CONFIRMED' : 'HOLD:BUILDER_REPAIR_HOLD' };
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
    if (state.jobAuthority?.startSha) check((evidence.jobAuthorityStartSha || evidence.machineProvenance?.authorityStartSha || evidence.payload?.authorityStartSha) === state.jobAuthority.startSha, 'EVIDENCE_START_SHA_MISMATCH');
  } catch (error) { errors.push(error.message); }
  return errors;
}

export function aggregateWorkBatchAudit(root, state, runs, reports) {
  const benchmark = isBenchmarkJobKind(state.jobKind);
  const rows = reports.flatMap(report => report.freshness.map(row => ({ ...row, runId: report.runId, targetQuestionUid: row.questionUid, questionUid: `${report.runId}:${row.questionUid}` })));
  const route = validateModelRouteParity(state.executionIdentity);
  const routeErrors = benchmark && route.status !== 'PASS' ? ['MODEL_ROUTE_PARITY_FAIL'] : [];
  const freeze = state.freezes.at(-1);
  const benchmarkDenominator = freeze?.benchmarkDenominator || null;
  const denominator = benchmarkDenominator?.eligibleTargetCount;
  const excluded = benchmarkDenominator?.excludedRuns || [];
  const reviewTargets = benchmark ? benchmarkDenominator?.eligibleTargets || [] : freeze?.targets || [];
  const reviewTargetKeys = new Set(reviewTargets.map(row => canonicalJson({ runId: row.runId, questionUid: row.questionUid })));
  const eligibleReports = benchmark ? reports.filter(report => reviewTargets.some(row => row.runId === report.runId)) : reports;
  const openDefectCount = (state.openDefectSet || []).length;
  const repairClosureComplete = (state.repairIterations || []).every(iteration => iteration.status === 'CLOSED');
  const closed = eligibleReports.length > 0 && eligibleReports.every(report => report.status === 'PASS') && openDefectCount === 0 && repairClosureComplete && state.status === 'FROZEN';
  const denominatorEmpty = benchmark && (!benchmarkDenominator || denominator === 0);
  const cost = workBatchMetrics(root, runs[0], benchmark ? rows.filter(row => reviewTargetKeys.has(canonicalJson({ runId: row.runId, questionUid: row.targetQuestionUid }))) : rows);
  const finalStatus = denominatorEmpty ? 'BLOCKED' : closed && !routeErrors.length ? 'PASS' : 'BLOCKED';
  const benchmarkEligible = benchmark ? !denominatorEmpty && closed && !routeErrors.length : true;
  const finalCoverage = (() => {
    const denominatorAxes = runs.reduce((total, run) => total + run.questions.reduce((count, question) => count + (reviewTargetKeys.has(canonicalJson({ runId: run.runId, questionUid: question.questionUid })) ? question.requiredAxes?.length || 0 : 0), 0), 0);
    return denominatorAxes ? new Set(rows.filter(row => row.status === 'PASS' && reviewTargetKeys.has(canonicalJson({ runId: row.runId, questionUid: row.targetQuestionUid }))).map(row => `${row.questionUid}:${row.axis}`)).size / denominatorAxes : 0;
  })();
  return {
    status: finalStatus,
    benchmarkEligible,
    workBatchId: state.workBatchId,
    productionAuthorized: false,
    MODEL_ROUTE_PARITY: route.MODEL_ROUTE_PARITY,
    modelRouteStatus: route.routeStatus,
    routeErrors,
    benchmarkDenominator,
    cost: { ...cost, totalTargetCount: denominator ?? cost.totalTargetCount },
    finalCoverage,
    openDefectCount,
    repairIterationCount: (state.repairIterations || []).length,
    maxRepairIterations: maxRepairIterationsForState(state),
    reports: reports.map(({ runId, status, errors }) => ({ runId, status, errors })),
    diagnostics: { excludedRuns: excluded, eligibleReportCount: eligibleReports.length, repairClosureComplete, closed },
  };
}

export function workBatchMetrics(root, run, rows = []) {
  try {
    const state = readWorkBatch(root, run.workBatchId), freeze = state.freezes.at(-1);
    const launches = state.launches.filter(l => l.externalId);
    const events = launches.flatMap(l => [{ t: l.dispatchedAt, n: 1 }, ...(l.endedAt ? [{ t: l.endedAt, n: -1 }] : [])]).sort((a,b) => a.t.localeCompare(b.t) || a.n-b.n);
    let active = 0, peak = 0; for (const e of events) { active += e.n; peak = Math.max(peak, active); }
    const route = validateModelRouteParity(state.executionIdentity);
    const benchmark = isBenchmarkJobKind(state.jobKind), denominator = freeze?.benchmarkDenominator;
    const eligibleAffectedCount = benchmark && denominator ? freeze.affected.filter(target => denominator.eligibleTargets.some(candidate => targetKey(candidate) === targetKey(target))).length : null;
    return { workBatchId: state.workBatchId, targetCount: freeze?.targets.length || 0, totalTargetCount: denominator?.eligibleTargetCount ?? freeze?.targets.length ?? 0, totalAffectedCount: freeze?.affected.length || 0, openDefectCount: (state.openDefectSet || []).length, repairIterationCount: (state.repairIterations || []).length, maxRepairIterations: maxRepairIterationsForState(state), benchmarkReviewedTargetCount: benchmark ? denominator?.eligibleTargetCount ?? null : null, benchmarkEligibleTargetCount: benchmark ? denominator?.eligibleTargetCount ?? null : null, benchmarkExcludedTargetCount: benchmark ? denominator?.excludedTargetCount ?? null : null, benchmarkTotalSourceTargetCount: benchmark ? denominator?.totalTargetCount ?? null : null, benchmarkEligibleAffectedTargetCount: eligibleAffectedCount, independentAgentLaunchCount: launches.length, expensiveAgentLaunchCount: launches.length, concurrentExpensiveAgentPeak: peak, freshLlmUidCount: new Set(rows.filter(r => r.status === 'PASS' && r.mode === 'FRESH' && !MACHINE_AXES.includes(r.axis)).map(r => r.questionUid)).size, reusedUidCount: new Set(rows.filter(r => r.status === 'PASS' && r.mode === 'REUSED').map(r => r.questionUid)).size, machineCheckedUidCount: freeze?.machineCheckedUidCount || 0, retryLaunchCount: 0, secondAuditorLaunchCount: launches.filter(l => l.purpose === 'SECOND_AUDIT').length, recursiveSubagentLaunchCount: 0, usedTokens: launches.every(l => Number.isSafeInteger(l.usedTokens)) ? launches.reduce((n,l) => n+l.usedTokens,0) : null, tokenTelemetryAvailable: launches.every(l => Number.isSafeInteger(l.usedTokens)), agentBudgetStatus: state.status === 'HOLD' || state.status === 'REPAIR_REQUIRED' || state.launches.some(l => ['RESERVED','DISPATCHED'].includes(l.status)) ? 'HOLD' : 'WITHIN_BUDGET', jobKind: state.jobKind || 'PRODUCTION', workflowProfile: state.workflowProfile || WORKFLOW_PROFILES.LEGACY, executionIdentity: state.executionIdentity || null, MODEL_ROUTE_PARITY: route.MODEL_ROUTE_PARITY, modelRouteStatus: route.routeStatus };
  } catch (error) { return { workBatchId: run?.workBatchId || null, agentBudgetStatus: 'HOLD', errors: [error.message] }; }
}
