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
export const AGENT_BUDGET = Object.freeze({ productionIndependent: 0, finalAuditors: 1, targetedRechecks: 1, concurrentExpensive: 1, automaticSecondAuditors: 0, explicitSecondAuditors: 1, retries: 0, recursiveSubagents: 0 });
const same = (a, b) => canonicalJson(a) === canonicalJson(b);
const check = (condition, code) => { if (!condition) throw new Error(`HOLD:${code}`); };
const time = () => new Date().toISOString();
const load = (root, ref) => JSON.parse(readBoundFile(root, ref));
const sorted = values => [...new Set(values)].sort();
const tokenTelemetry = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
const retiredTokenHoldCodes = new Set(['HOLD:TOKEN_BUDGET_EXCEEDED', 'HOLD:TOKEN_RESERVATION_INVALID', 'HOLD:PROVIDER_TOKEN_USAGE_INVALID']);
const targetKey = target => canonicalJson({ runId: target?.runId || null, questionUid: target?.questionUid || null });
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
  if (state.jobKind !== undefined) check(typeof state.jobKind === 'string' && (state.jobKind === 'PRODUCTION' || isBenchmarkJobKind(state.jobKind) || state.jobKind === 'DIAGNOSTIC'), 'JOB_KIND_INVALID');
  if (state.executionIdentity !== undefined) {
    check(state.executionIdentity?.schemaVersion === 'APMATH_GOLD_EXECUTION_CONTRACT_v1', 'MODEL_ROUTE_IDENTITY_INVALID');
    check(state.executionIdentity.jobKind === state.jobKind, 'MODEL_ROUTE_JOB_KIND_MISMATCH');
    const parity = validateModelRouteParity(state.executionIdentity);
    if (isBenchmarkJobKind(state.jobKind) && parity.status === 'PASS' && state.executionIdentity.MODEL_ROUTE_PARITY !== 'PASS') throw new Error('MODEL_ROUTE_PARITY_STATE_MISMATCH');
  }
  check(new Set(state.launches.map(l => l.launchId)).size === state.launches.length, 'DUPLICATE_LAUNCH');
  for (const purpose of ['FINAL_AUDIT', 'TARGETED_RECHECK', 'SECOND_AUDIT']) check(state.launches.filter(l => l.purpose === purpose).length <= 1, 'AGENT_BUDGET_EXCEEDED');
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
    return { schemaVersion: WORK_BATCH_VERSION, workBatchId: spec.workBatchId, runIds: sorted(spec.runIds), builderId: spec.builderId, builderSessionId: spec.builderSessionId, jobKind, executionIdentity, jobAuthority: spec.jobAuthority || null, policy: AGENT_BUDGET, status: 'PRODUCTION', freezes: [], launches: [] };
  });
}

function collectFreeze(root, state, runRefs) {
  const runs = runRefs.map(ref => load(root, ref));
  check(same(sorted(runs.map(r => r.runId)), state.runIds) && runs.length === state.runIds.length, 'WHOLE_JOB_FREEZE_REQUIRED');
  const allTargets = [], eligibleTargets = [], excludedTargets = [], affected = [], bindings = [];
  const priorFreeze = state.freezes.at(-1);
  const finalLaunch = state.launches.find(l => l.purpose === 'FINAL_AUDIT' && l.status === 'COMPLETED');
  const defects = finalLaunch ? load(root, finalLaunch.providerReceiptRef).defects || [] : [];
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
    const renderChanged = old && needsRender ? detectRenderImpact(old.witnesses, witnesses).affectedRenderUidSet : [];
    for (const [questionUid, axes] of Object.entries(shas)) {
      const row = { runId: run.runId, questionUid };
      allTargets.push(row);
      if (isBenchmarkJobKind(state.jobKind)) (benchmarkEligible ? eligibleTargets : excludedTargets).push(row);
      if (!old || defects.some(d => d.runId === run.runId && d.questionUid === questionUid) || impact.affectedUidAxisSet.some(a => a.questionUid === questionUid && !MACHINE_AXES.includes(a.axis)) || Object.entries(axes).some(([axis, sha]) => !MACHINE_AXES.includes(axis) && old.axisInputShas[questionUid]?.[axis] !== sha) || renderChanged.includes(questionUid)) affected.push(row);
    }
    bindings.push({ questions: actual, runSemanticSha, runId: run.runId, revision: run.revision, inputSha: run.inputSha, axisInputShas: shas, witnesses,
      preAudit: { purpose: 'DIAGNOSTIC_CONTINUATION_ONLY', promotionAuthorized: false, machineEvidence: machineEvidence.map(e => ({ questionUid: e.questionUid, axis: e.axis, status: e.status, evidenceSha: objectSha(e) })), missingRender } });
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
    const scope = reviewScopeForPurpose(state, freeze, request.purpose);
    if (isBenchmarkJobKind(state.jobKind) && request.purpose === 'TARGETED_RECHECK') check(scope.length > 0, 'GOLD_BENCHMARK_RECHECK_SCOPE_EMPTY');
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
      if (isBenchmarkJobKind(state.jobKind)) {
        check(plan.executionIdentity?.jobKind === state.jobKind && plan.executionIdentity.requestedModel === state.executionIdentity.requestedModel && plan.executionIdentity.requestedReasoningEffort === state.executionIdentity.requestedReasoningEffort, 'MODEL_ROUTE_REQUEST_BINDING');
        check(plan.executionIdentity.modelRouteObservedAtStart && plan.executionIdentity.actualModel && plan.executionIdentity.actualReasoningEffort, 'MODEL_ROUTE_OBSERVATION_REQUIRED');
      }
      providerAttestationPlanRef = request.providerAttestationPlanRef;
      if (plan.executionIdentity) state.executionIdentity = structuredClone(plan.executionIdentity);
    }
    const launch = { contexts: request.contexts, contextIsolation: request.contextIsolation, subagentToolsEnabled: false, launchId: `${id}:${state.launches.length + 1}`, purpose: request.purpose, freezeSha: freeze.freezeSha, scope, auditorId: request.auditorId, auditorSessionId: request.auditorSessionId, parentLaunchId: null, recursiveSubagentLaunchCount: 0, authorization: request.authorization || null, reservedAt: time(), status: 'RESERVED', externalId: null, ...(providerAttestationPlanRef ? { providerAttestationPlanRef } : {}) };
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
      if (isBenchmarkJobKind(state.jobKind)) {
        check(receipt.executionIdentity?.jobKind === state.jobKind, 'MODEL_ROUTE_RECEIPT_BINDING');
        check(receipt.executionIdentity?.modelRouteObservedAtClosure, 'MODEL_ROUTE_CLOSURE_OBSERVATION_REQUIRED');
        state.executionIdentity = structuredClone(receipt.executionIdentity);
      }
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
  const closed = eligibleReports.length > 0 && eligibleReports.every(report => report.status === 'PASS');
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
    reports: reports.map(({ runId, status, errors }) => ({ runId, status, errors })),
    diagnostics: { excludedRuns: excluded, eligibleReportCount: eligibleReports.length, closed },
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
    return { workBatchId: state.workBatchId, targetCount: freeze?.targets.length || 0, totalTargetCount: denominator?.eligibleTargetCount ?? freeze?.targets.length ?? 0, totalAffectedCount: freeze?.affected.length || 0, benchmarkReviewedTargetCount: benchmark ? denominator?.eligibleTargetCount ?? null : null, benchmarkEligibleTargetCount: benchmark ? denominator?.eligibleTargetCount ?? null : null, benchmarkExcludedTargetCount: benchmark ? denominator?.excludedTargetCount ?? null : null, benchmarkTotalSourceTargetCount: benchmark ? denominator?.totalTargetCount ?? null : null, benchmarkEligibleAffectedTargetCount: eligibleAffectedCount, independentAgentLaunchCount: launches.length, expensiveAgentLaunchCount: launches.length, concurrentExpensiveAgentPeak: peak, freshLlmUidCount: new Set(rows.filter(r => r.status === 'PASS' && r.mode === 'FRESH' && !MACHINE_AXES.includes(r.axis)).map(r => r.questionUid)).size, reusedUidCount: new Set(rows.filter(r => r.status === 'PASS' && r.mode === 'REUSED').map(r => r.questionUid)).size, machineCheckedUidCount: freeze?.machineCheckedUidCount || 0, retryLaunchCount: 0, secondAuditorLaunchCount: launches.filter(l => l.purpose === 'SECOND_AUDIT').length, recursiveSubagentLaunchCount: 0, usedTokens: launches.every(l => Number.isSafeInteger(l.usedTokens)) ? launches.reduce((n,l) => n+l.usedTokens,0) : null, tokenTelemetryAvailable: launches.every(l => Number.isSafeInteger(l.usedTokens)), agentBudgetStatus: state.status === 'HOLD' || state.launches.some(l => ['RESERVED','DISPATCHED'].includes(l.status)) ? 'HOLD' : 'WITHIN_BUDGET', jobKind: state.jobKind || 'PRODUCTION', executionIdentity: state.executionIdentity || null, MODEL_ROUTE_PARITY: route.MODEL_ROUTE_PARITY, modelRouteStatus: route.routeStatus };
  } catch (error) { return { workBatchId: run?.workBatchId || null, agentBudgetStatus: 'HOLD', errors: [error.message] }; }
}
