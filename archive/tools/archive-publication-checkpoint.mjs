import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PUBLICATION_PHASES = Object.freeze([
  'INPUTS_BOUND', 'CHECKS_RUNNING', 'CHECKS_PASSED', 'COMMIT_READY', 'COMMITTED', 'PUSH_READY', 'PUSHED', 'READBACK_PASSED', 'MAIN_DONE',
]);
const shaPattern = /^[a-f0-9]{40,64}$/i;
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const canonical = value => JSON.stringify(stable(value));
const digest = value => crypto.createHash('sha256').update(canonical(value)).digest('hex');
export const publicationBindingSha256 = digest;
const fail = code => { throw Object.assign(new Error(code), { code }); };
function validateChecks(rows, bindingSha256) {
  if (!Array.isArray(rows) || !rows.length) fail('CURRENT_CHECK_RESULTS_REQUIRED');
  for (const row of rows) {
    if (!row?.name || typeof row.command !== 'string' || !row.command.trim()
      || !['pending', 'running', 'completed'].includes(row.status) || row.bindingSha256 !== bindingSha256) fail('CHECK_RESULT_BINDING_OR_STATUS_INVALID');
    if (row.status === 'completed' && !Number.isInteger(row.exitCode)) fail('CHECK_EXIT_CODE_REQUIRED');
    if (row.status === 'completed' && row.exitCode === 0
      && (!shaPattern.test(String(row.stdoutSha256 || '')) || !shaPattern.test(String(row.stderrSha256 || '')))) fail('CHECK_OUTPUT_HASHES_REQUIRED');
  }
}

function requireBinding(binding) {
  for (const field of ['sourceSha256', 'proofsSha256', 'assetsSha256', 'baselineSha256', 'mainSha']) {
    if (!shaPattern.test(String(binding?.[field] || ''))) fail(`BINDING_${field.toUpperCase()}_REQUIRED`);
  }
  if (!Array.isArray(binding.changedPaths) || !binding.changedPaths.length || binding.changedPaths.some(p => typeof p !== 'string' || !p || p.startsWith('/') || p.split(/[\\\\/]/).includes('..'))) fail('CHANGED_PATHS_REQUIRED_SAFE_RELATIVE');
  if (!Array.isArray(binding.targetPaths) || !binding.targetPaths.length) fail('TARGET_PATHS_REQUIRED');
}

export function classifyMainDrift({ baselineMainSha, currentMainSha, changedPaths, targetPaths }) {
  if (!shaPattern.test(String(baselineMainSha || '')) || !shaPattern.test(String(currentMainSha || ''))) fail('MAIN_SHA_REQUIRED');
  if (baselineMainSha === currentMainSha) return { kind: 'NO_DRIFT', disposition: 'REUSE_CHECKPOINTS' };
  const touched = new Set(changedPaths || []);
  const overlap = (targetPaths || []).filter(path => touched.has(path));
  return overlap.length
    ? { kind: 'OVERLAPPING_TARGET_CHANGE', disposition: 'BLOCK_AND_REPLAN_TARGET', overlappingPaths: overlap }
    : { kind: 'UNRELATED_MAIN_DRIFT', disposition: 'REBASE_OR_REFRESH_BASELINE', overlappingPaths: [] };
}

export function planPublicationResume({ checkpoint, currentBinding, checks, mainDrift, currentMainSha, mainChangedPaths }) {
  requireBinding(currentBinding);
  if (checkpoint?.schemaVersion !== 'JS_ARCHIVE_PUBLICATION_CHECKPOINT_V1' || !PUBLICATION_PHASES.includes(checkpoint.phase)) fail('TYPED_CHECKPOINT_REQUIRED');
  requireBinding(checkpoint.binding);
  const currentDigest = digest(currentBinding), savedDigest = digest(checkpoint.binding);
  if (checkpoint.bindingSha256 !== savedDigest) fail('CHECKPOINT_BINDING_DIGEST_MISMATCH');
  const sameWork = currentDigest === savedDigest;
  const observedMainSha = currentMainSha || currentBinding.mainSha;
  const expectedPublished = checkpoint.publication?.pushedMainSha === observedMainSha
    || (checkpoint.completedPhases?.includes('COMMITTED') && checkpoint.commitSha === observedMainSha);
  if (!expectedPublished && observedMainSha !== checkpoint.binding.mainSha
    && !Array.isArray(mainChangedPaths) && !Array.isArray(currentBinding.mainChangedPaths)) fail('MAIN_CHANGE_PATHS_REQUIRED_FOR_DRIFT_CLASSIFICATION');
  const drift = mainDrift || (expectedPublished
    ? { kind: 'EXPECTED_PUBLISHED_MAIN', disposition: 'VERIFY_REMOTE_READBACK', overlappingPaths: [] }
    : classifyMainDrift({
      baselineMainSha: checkpoint.binding.mainSha, currentMainSha: observedMainSha,
      changedPaths: mainChangedPaths || currentBinding.mainChangedPaths || [], targetPaths: currentBinding.targetPaths,
    }));
  if (drift.kind === 'OVERLAPPING_TARGET_CHANGE') return { status: 'BLOCKED', reason: 'OVERLAPPING_TARGET_CHANGE', phase: checkpoint.phase, nextAction: 'REPLAN_TARGET_AND_REVALIDATE_CHANGED_SCOPE', reusedPhases: [] };
  if (!sameWork && !['UNRELATED_MAIN_DRIFT', 'NO_DRIFT'].includes(drift.kind)) fail('UNCLASSIFIED_MAIN_DRIFT');
  const completed = new Set(sameWork ? checkpoint.completedPhases || [] : (checkpoint.completedPhases || []).filter(p => ['INPUTS_BOUND'].includes(p)));
  const neededChecks = checks || checkpoint.checks || [];
  validateChecks(neededChecks, currentDigest);
  if (neededChecks.some(row => row.bindingSha256 !== currentDigest)) fail('CHECK_RESULT_BINDING_MISMATCH');
  const failedChecks = neededChecks.filter(row => row.status === 'completed' && row.exitCode !== 0);
  if (failedChecks.length) return {
    status: 'BLOCKED', reason: 'CHECK_FAILED', phase: 'CHECKS_RUNNING', nextAction: 'REPAIR_OR_RERUN_FAILED_CHECKS',
    reportOnly: true, irreversibleActionPerformed: false, failedChecks: failedChecks.map(row => ({ name: row.name, exitCode: row.exitCode })),
    bindingSha256: currentDigest, reusedPhases: sameWork ? ['INPUTS_BOUND'] : [],
  };
  const incompleteChecks = neededChecks.filter(row => row.status !== 'completed' || row.exitCode !== 0);
  let phase = incompleteChecks.length ? 'CHECKS_RUNNING' : 'CHECKS_PASSED';
  for (const previous of ['INPUTS_BOUND', 'CHECKS_PASSED']) if (completed.has(previous) && sameWork && !incompleteChecks.length) completed.add(previous);
  if (!incompleteChecks.length) {
    if (completed.has('MAIN_DONE')) phase = 'MAIN_DONE';
    else if (completed.has('READBACK_PASSED')) phase = 'READBACK_PASSED';
    else if (completed.has('PUSHED')) phase = 'PUSHED';
    else if (completed.has('COMMITTED')) phase = 'PUSH_READY';
    else if (completed.has('CHECKS_PASSED')) phase = 'COMMIT_READY';
  }
  const reusable = [...completed].filter(p => p === 'INPUTS_BOUND' || (p === 'CHECKS_PASSED' && !incompleteChecks.length));
  let nextAction;
  if (drift.kind === 'UNRELATED_MAIN_DRIFT') nextAction = 'REFRESH_BASELINE_THEN_REPLAN_CHECKPOINT';
  else if (incompleteChecks.length) nextAction = 'WAIT_FOR_CHECKS_EXIT_CODE_ZERO';
  else if (!completed.has('CHECKS_PASSED')) nextAction = 'RECORD_CURRENT_CHECKS_PASS';
  else if (!completed.has('COMMITTED')) nextAction = 'COMMIT_ALLOWED_AFTER_CHECKS_PASS';
  else if (!completed.has('PUSHED') && checkpoint.commitSha === observedMainSha) nextAction = 'RECORD_PUSHED_STATE_THEN_VERIFY_READBACK';
  else if (!completed.has('PUSHED')) nextAction = 'PUSH_ALLOWED_AFTER_COMMIT';
  else if (!completed.has('READBACK_PASSED')) nextAction = 'VERIFY_REMOTE_READBACK';
  else nextAction = 'CLOSE_MAIN_DONE';
  return {
    schemaVersion: 'JS_ARCHIVE_PUBLICATION_RESUME_PLAN_V1', status: incompleteChecks.length || drift.kind === 'UNRELATED_MAIN_DRIFT' ? 'WAITING' : 'READY',
    reportOnly: true, irreversibleActionPerformed: false, phase, nextAction, drift,
    bindingSha256: currentDigest, reusedPhases: reusable,
    checks: neededChecks.map(row => ({ name: row.name, status: row.status, exitCode: row.exitCode ?? null })),
  };
}

export function makePublicationCheckpoint({ phase, binding, completedPhases = [], checks = [] }) {
  if (!PUBLICATION_PHASES.includes(phase)) fail('UNKNOWN_PUBLICATION_PHASE');
  requireBinding(binding);
  if (completedPhases.some(p => !PUBLICATION_PHASES.includes(p))) fail('UNKNOWN_COMPLETED_PHASE');
  return { schemaVersion: 'JS_ARCHIVE_PUBLICATION_CHECKPOINT_V1', revision: 1, phase, binding: structuredClone(binding), bindingSha256: digest(binding), completedPhases: [...new Set(completedPhases)], checks: structuredClone(checks), history: [{ event: 'CHECKPOINT_CREATED', at: new Date().toISOString(), bindingSha256: digest(binding) }] };
}

export function recordPublicationEvent({ checkpoint, binding, event, checks, currentMainSha, mainChangedPaths, commitSha, pushedMainSha, readback, mainDoneReceiptSha256 }) {
  if (checkpoint?.schemaVersion !== 'JS_ARCHIVE_PUBLICATION_CHECKPOINT_V1' || checkpoint.bindingSha256 !== digest(checkpoint.binding)) fail('TYPED_CHECKPOINT_REQUIRED');
  requireBinding(binding);
  if (digest(binding) !== checkpoint.bindingSha256) fail('PUBLICATION_BINDING_CHANGED');
  const next = structuredClone(checkpoint);
  const completeChecks = checks || next.checks;
  validateChecks(completeChecks, checkpoint.bindingSha256);
  const failed = completeChecks.filter(row => row.status !== 'completed' || row.exitCode !== 0);
  if (event === 'commit' || event === 'push') {
    if (!shaPattern.test(String(currentMainSha || ''))) fail('CURRENT_MAIN_SHA_REQUIRED_FOR_PUBLICATION_RECORD');
    const plan = planPublicationResume({ checkpoint, currentBinding: binding, checks: completeChecks, currentMainSha, mainChangedPaths });
    const expectedAction = event === 'commit' ? 'COMMIT_ALLOWED_AFTER_CHECKS_PASS' : 'RECORD_PUSHED_STATE_THEN_VERIFY_READBACK';
    if (plan.nextAction !== expectedAction) fail('PUBLICATION_RECORD_BLOCKED_BY_CURRENT_PLAN', plan.nextAction);
  }
  if (event === 'checks') {
    if (failed.length) fail('CHECKS_MUST_ALL_EXIT_ZERO');
    next.checks = structuredClone(completeChecks);
    next.phase = 'COMMIT_READY';
    next.completedPhases = [...new Set([...next.completedPhases, 'INPUTS_BOUND', 'CHECKS_PASSED'])];
  } else if (event === 'commit') {
    if (failed.length || !next.completedPhases.includes('CHECKS_PASSED')) fail('COMMIT_REQUIRES_CURRENT_CHECKS_PASS');
    if (!shaPattern.test(String(commitSha || ''))) fail('COMMIT_SHA_REQUIRED');
    next.commitSha = commitSha;
    next.phase = 'PUSH_READY';
    next.completedPhases = [...new Set([...next.completedPhases, 'COMMITTED'])];
  } else if (event === 'push') {
    if (!next.completedPhases.includes('COMMITTED') || !shaPattern.test(String(pushedMainSha || '')) || pushedMainSha !== next.commitSha || currentMainSha !== pushedMainSha) fail('PUSH_REQUIRES_REMOTE_COMMIT_READBACK');
    next.publication = { ...(next.publication || {}), pushedMainSha };
    next.phase = 'PUSHED';
    next.completedPhases = [...new Set([...next.completedPhases, 'PUSHED'])];
  } else if (event === 'readback') {
    if (!next.completedPhases.includes('PUSHED') || readback?.mainSha !== next.publication?.pushedMainSha) fail('READBACK_REQUIRES_PUSHED_MAIN_PARITY');
    for (const field of ['sourceSha256', 'proofsSha256', 'assetsSha256', 'baselineSha256']) if (readback[field] !== binding[field]) fail('READBACK_BINDING_MISMATCH:' + field);
    if (readback.bindingSha256 !== checkpoint.bindingSha256 || readback.allBytesMatch !== true) fail('REMOTE_READBACK_NOT_PASS');
    next.readback = structuredClone(readback);
    next.phase = 'READBACK_PASSED';
    next.completedPhases = [...new Set([...next.completedPhases, 'READBACK_PASSED'])];
  } else if (event === 'main-done') {
    if (!next.completedPhases.includes('READBACK_PASSED') || !shaPattern.test(String(mainDoneReceiptSha256 || ''))) fail('MAIN_DONE_REQUIRES_REMOTE_READBACK');
    next.mainDoneReceiptSha256 = mainDoneReceiptSha256;
    next.phase = 'MAIN_DONE';
    next.completedPhases = [...new Set([...next.completedPhases, 'MAIN_DONE'])];
  } else fail('UNKNOWN_PUBLICATION_EVENT', event);
  next.revision = Number(checkpoint.revision || 0) + 1;
  next.parentCheckpointSha256 = digest(checkpoint);
  next.history = [...(checkpoint.history || []), { event: event.toUpperCase().replaceAll('-', '_'), at: new Date().toISOString(), bindingSha256: checkpoint.bindingSha256, ...(event === 'commit' ? { commitSha } : {}), ...(event === 'push' ? { pushedMainSha } : {}), ...(event === 'main-done' ? { mainDoneReceiptSha256 } : {}) }];
  return next;
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
function writeFreshJson(file, value) {
  const target = path.resolve(file);
  if (fs.existsSync(target)) fail('FRESH_CHECKPOINT_OUTPUT_REQUIRED');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n');
  return { path: target, sha256: crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex') };
}
function parseCli() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const key = process.argv[i];
    if (!['create', 'plan', 'record'].includes(key)) {
      if (args.action === undefined) args.action = key;
      else if (['--binding', '--checkpoint', '--checks', '--current-main-sha', '--main-changed-paths', '--event', '--output', '--commit-sha', '--pushed-main-sha', '--readback', '--main-done-receipt-sha256'].includes(key)) args[key.slice(2)] = process.argv[++i];
      else fail('UNKNOWN_ARGUMENT', key);
    } else args.action = key;
  }
  return args;
}
async function runCli() {
  const args = parseCli();
  if (args.action === 'create') {
    if (!args.binding || !args.output) fail('CREATE_REQUIRES_BINDING_AND_OUTPUT');
    const binding = readJson(args.binding);
    const checkpoint = makePublicationCheckpoint({ phase: 'INPUTS_BOUND', binding, completedPhases: ['INPUTS_BOUND'] });
    console.log(JSON.stringify(writeFreshJson(args.output, checkpoint), null, 2));
    return;
  }
  if (args.action === 'plan') {
    if (!args.binding || !args.checkpoint || !args.checks || !args['current-main-sha']) fail('PLAN_REQUIRES_CHECKPOINT_BINDING_CHECKS_AND_CURRENT_MAIN');
    const checkpoint = readJson(args.checkpoint), binding = readJson(args.binding), checks = readJson(args.checks);
    const mainChangedPaths = args['main-changed-paths'] ? readJson(args['main-changed-paths']) : undefined;
    const plan = planPublicationResume({ checkpoint, currentBinding: binding, checks, currentMainSha: args['current-main-sha'], mainChangedPaths });
    if (args.output) console.log(JSON.stringify(writeFreshJson(args.output, plan), null, 2));
    else console.log(JSON.stringify(plan, null, 2));
    process.exitCode = plan.status === 'BLOCKED' ? 1 : 0;
    return;
  }
  if (args.action === 'record') {
    if (!args.binding || !args.checkpoint || !args.event || !args.output) fail('RECORD_REQUIRES_CHECKPOINT_BINDING_EVENT_AND_OUTPUT');
    const checkpointBytes = fs.readFileSync(args.checkpoint), checkpoint = JSON.parse(checkpointBytes.toString('utf8').replace(/^\uFEFF/, ''));
    const binding = readJson(args.binding);
    const checks = args.checks ? readJson(args.checks) : checkpoint.checks;
    const readback = args.readback ? readJson(args.readback) : undefined;
    const mainChangedPaths = args['main-changed-paths'] ? readJson(args['main-changed-paths']) : undefined;
    const next = recordPublicationEvent({ checkpoint, binding, event: args.event, checks, currentMainSha: args['current-main-sha'], mainChangedPaths, commitSha: args['commit-sha'], pushedMainSha: args['pushed-main-sha'], readback, mainDoneReceiptSha256: args['main-done-receipt-sha256'] });
    next.parentCheckpointSha256 = crypto.createHash('sha256').update(checkpointBytes).digest('hex');
    console.log(JSON.stringify(writeFreshJson(args.output, next), null, 2));
    return;
  }
  fail('ACTION_REQUIRED_CREATE_PLAN_OR_RECORD');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli().catch(error => {
  console.error(JSON.stringify({ status: 'BLOCKED', code: error.code || 'ERROR', message: error.message }));
  process.exitCode = 1;
});
