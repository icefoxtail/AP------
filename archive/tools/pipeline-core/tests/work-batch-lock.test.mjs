import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { objectSha } from '../canonical.mjs';
import { initWorkBatch, readWorkBatch, inspectDispatchLock, recoverDispatchLock, reserveWorkBatchReview } from '../work-batch.mjs';

const moduleUrl = new URL('../work-batch.mjs', import.meta.url).href;
const setup = t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-budget-lock-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const state = initWorkBatch(root, { workBatchId: 'job', runIds: ['run'], builderId: 'builder', builderSessionId: 'builder-session', tokenBudget: 1000 });
  const directory = path.join(root, 'alive/runtime/work-batches');
  return { root, directory, state, lock: path.join(directory, '.dispatch.lock'), file: path.join(directory, 'job/state.json') };
};
const deadPid = () => {
  const child = spawnSync(process.execPath, ['-e', 'process.stdout.write(String(process.pid))'], { encoding: 'utf8', windowsHide: true });
  assert.equal(child.status, 0);
  return Number(child.stdout);
};
const owner = pid => ({ schemaVersion: 'APMATH_DISPATCH_LOCK_v1', pid, host: os.hostname(), ownerToken: 'synthetic-test-lock', acquiredAt: '2020-01-01T00:00:00Z', workBatchId: 'job' });

test('lock recovery preserves DISPATCHED providers and legacy token telemetry byte-for-byte', t => {
  const f = setup(t);
  const targets = [{ runId: 'run', questionUid: 'exam|1' }];
  const body = { frozenAt: '2026-01-01T00:00:00Z', targets, affected: targets, bindings: [], runRefs: [] };
  const freeze = { ...body, freezeSha: objectSha(body) };
  const launch = { launchId: 'job:1', purpose: 'FINAL_AUDIT', freezeSha: freeze.freezeSha, scope: targets, auditorId: 'auditor', auditorSessionId: 'auditor', parentLaunchId: null, recursiveSubagentLaunchCount: 0, maxTokens: 100, reservedAt: '2026-01-01T01:00:00Z', dispatchedAt: '2026-01-01T01:00:01Z', status: 'DISPATCHED', externalId: 'active-provider', contexts: { U1: { sessionId: 's1', contextId: 'c1' }, U2: { sessionId: 's2', contextId: 'c2' }, U3: { sessionId: 's3', contextId: 'c3' } }, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false };
  const state = { ...f.state, status: 'FROZEN', freezes: [freeze], launches: [launch] };
  const raw = JSON.stringify(state);
  fs.writeFileSync(f.file, raw);
  fs.writeFileSync(f.lock, JSON.stringify(owner(deadPid())));
  fs.writeFileSync(`${f.file}.next`, 'uncommitted state');
  fs.writeFileSync(`${f.file}.hold`, 'uncommitted hold');
  const result = recoverDispatchLock(f.root, inspectDispatchLock(f.root).lockSha);
  assert.equal(result.status, 'RECOVERED_RECONCILE_REQUIRED');
  assert.equal(result.providerTasksChanged, false);
  assert.equal(result.budgetReset, false);
  assert.equal(result.quarantinedPendingWriteCount, 2);
  assert.equal(result.activeProviderTasks[0].externalId, 'active-provider');
  assert.equal(fs.readFileSync(f.file, 'utf8'), raw);
  assert.deepEqual(readWorkBatch(f.root, 'job'), state);
  assert.equal(fs.existsSync(f.lock), false);
  assert.equal(fs.readFileSync(path.join(f.root, result.archive, 'job-state.json.next'), 'utf8'), 'uncommitted state');
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', { recursiveSubagentLaunchCount: 0 }), /RECONCILE_EXISTING_EXPENSIVE_TASK/);
  assert.deepEqual(readWorkBatch(f.root, 'job').launches, [launch]);
});

test('age never permits taking a live owner lock', t => {
  const f = setup(t);
  const raw = JSON.stringify(owner(process.pid)); fs.writeFileSync(f.lock, raw);
  assert.throws(() => recoverDispatchLock(f.root, inspectDispatchLock(f.root).lockSha), /LOCK_OWNER_ACTIVE_OR_UNKNOWN/);
  assert.equal(fs.readFileSync(f.lock, 'utf8'), raw);
  assert.equal(fs.existsSync(path.join(f.directory, '.dispatch.recovering')), false);
});

test('empty legacy locks, foreign owners and changed snapshots stay HOLD', t => {
  const f = setup(t);
  fs.writeFileSync(f.lock, '');
  assert.throws(() => recoverDispatchLock(f.root, inspectDispatchLock(f.root).lockSha), /LEGACY_OR_INCOMPLETE_LOCK_OWNER_UNKNOWN/);
  fs.writeFileSync(f.lock, JSON.stringify({ ...owner(deadPid()), host: 'unrelated-host' }));
  assert.throws(() => recoverDispatchLock(f.root, inspectDispatchLock(f.root).lockSha), /REMOTE_LOCK_OWNER_UNKNOWN/);
  const sha = inspectDispatchLock(f.root).lockSha;
  fs.writeFileSync(f.lock, JSON.stringify(owner(process.pid)));
  assert.throws(() => recoverDispatchLock(f.root, sha), /LOCK_CHANGED_INSPECT_AGAIN/);
  assert.equal(JSON.parse(fs.readFileSync(f.lock)).pid, process.pid);
});

test('a real process exit before atomic state commit leaves recoverable owner and pending write', t => {
  const f = setup(t);
  const script = `import fs from 'node:fs'; import { initWorkBatch } from ${JSON.stringify(moduleUrl)}; fs.renameSync = () => process.exit(17); initWorkBatch(${JSON.stringify(f.root)}, { workBatchId:'other', runIds:['other-run'], builderId:'b', builderSessionId:'s', tokenBudget:100 });`;
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', windowsHide: true });
  assert.equal(child.status, 17, child.stderr);
  const snapshot = inspectDispatchLock(f.root);
  assert.equal(snapshot.owner.workBatchId, 'other');
  const before = fs.readFileSync(f.file);
  const result = recoverDispatchLock(f.root, snapshot.lockSha);
  assert.equal(result.quarantinedPendingWriteCount, 1);
  assert.deepEqual(fs.readFileSync(f.file), before);
  assert.equal(fs.existsSync(path.join(f.directory, 'other/state.json')), false);
  assert.equal(initWorkBatch(f.root, { workBatchId:'other', runIds:['other-run'], builderId:'b', builderSessionId:'s', tokenBudget:100 }).status, 'PRODUCTION');
});

test('an interrupted recovery marker blocks mutation until official recovery', t => {
  const f = setup(t);
  fs.writeFileSync(path.join(f.directory, '.dispatch.recovering'), 'interrupted recovery');
  assert.throws(() => initWorkBatch(f.root, { workBatchId:'other', runIds:['other-run'], builderId:'b', builderSessionId:'s', tokenBudget:100 }), /LOCK_RECOVERY_IN_PROGRESS/);
  const snapshot = inspectDispatchLock(f.root);
  assert.equal(snapshot.lockSha, 'ABSENT');
  assert.equal(recoverDispatchLock(f.root, snapshot.lockSha).status, 'RECOVERED_RECONCILE_REQUIRED');
  assert.equal(readWorkBatch(f.root, 'job').launches.length, 0);
});
