import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { recoveryFixture } from './recovery-fixture.mjs';
import { objectSha } from '../canonical.mjs';
import { initWorkBatch, readWorkBatch, freezeWorkBatch, reserveWorkBatchReview, reconcileWorkBatchReview, recordWorkBatchRepair } from '../work-batch.mjs';
import { prepareProviderReview } from '../provider-bridge.mjs';
import { resumePastExam, reserveWhenAvailable } from '../../past-exam-pipeline/resume-past-exam.mjs';

const defect = reason => ({ runId: 'run', questionUid: 'recovery|1', type: 'CANDIDATE_MATH_DEFECT', reason });
function terminal(f, id, status, defects = [], extra = {}) {
  const externalId = `provider-${id}`;
  reconcileWorkBatchReview(f.root, 'job', { launchId: id, externalId, status: 'DISPATCHED' });
  const ref = f.terminalReceipt(id, externalId, status, defects, extra);
  return reconcileWorkBatchReview(f.root, 'job', { launchId: id, externalId, status, providerReceiptRef: ref });
}
function setupRepair(f) {
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT', 'first'));
  terminal(f, 'job:1', 'COMPLETED', [defect('initial')]);
  return first;
}
function repair(f, run, iteration, disposition) {
  return recordWorkBatchRepair(f.root, 'job', { iteration, revision: run.run.revision, inputSha: run.run.inputSha, builderId: 'builder', builderSessionId: 'builder-session', dispositions: [{ ...defect('fix'), disposition }], runRefs: [run.ref] });
}
function provider(f) {
  const ref = f.write('prepare-only.mjs', `
    import fs from 'node:fs';
    const r = JSON.parse(fs.readFileSync(0, 'utf8'));
    fs.appendFileSync(${JSON.stringify(path.join(f.root, 'control-calls'))}, '1');
    process.stdout.write(JSON.stringify({schemaVersion:r.schemaVersion,operation:r.operation,status:'READY',requestSha:r.requestSha,provider:'synthetic',model:'synthetic',externalTaskId:'provider-'+r.launchId,auditorId:'auditor-'+r.launchId,auditorSessionId:'session-'+r.launchId,contextIsolation:'STATELESS_INPUTS',subagentToolsEnabled:false,modelInvocationCount:0,runtimeAttestation:'test-only',contexts:Object.fromEntries(['U1','U2','U3'].map(p=>[p,{sessionId:r.launchId+p,contextId:r.launchId+p+'context'}]))}));
  `);
  return { command: process.execPath, args: [path.join(f.root, ref.path)] };
}

test('review-only followed by real repair is not blocked by the number of freezes', t => {
  const f = recoveryFixture(t), first = setupRepair(f);
  repair(f, first, 1, 'AUDITOR_FALSE_POSITIVE');
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK', 'review-only'));
  terminal(f, 'job:2', 'COMPLETED', [defect('different independently found defect')]);
  const second = f.makeRun(2);
  repair(f, second, 2, 'REPAIRED_CANDIDATE');
  freezeWorkBatch(f.root, 'job', [second.ref]);
  const prepared = prepareProviderReview(f.root, { workBatchId: 'job', purpose: 'TARGETED_RECHECK', transport: provider(f), planPath: 'alive/runtime/provider-bridge/job/second.json' });
  const state = reserveWorkBatchReview(f.root, 'job', prepared.reservationRequest);
  assert.equal(state.freezes.length, 2);
  assert.equal(state.launches.at(-1).repairIteration, 2);
});

test('failed targeted review successor keeps its semantic iteration and frozen bytes', t => {
  const f = recoveryFixture(t); setupRepair(f);
  const second = f.makeRun(2);
  repair(f, second, 1, 'REPAIRED_CANDIDATE');
  freezeWorkBatch(f.root, 'job', [second.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK', 'failed-recheck'));
  const before = terminal(f, 'job:2', 'FAILED', [], { modelInvocationCount: 0, failureCode: 'TURN_START_REJECT', semanticEvidenceCount: 0 });
  const prepared = prepareProviderReview(f.root, { workBatchId: 'job', purpose: 'TARGETED_RECHECK', transport: provider(f), planPath: 'alive/runtime/provider-bridge/job/successor.json', executionRecoveryOfLaunchId: 'job:2' });
  const state = reserveWorkBatchReview(f.root, 'job', prepared.reservationRequest);
  assert.equal(state.launches.at(-1).repairIteration, 1);
  assert.equal(state.launches.at(-1).executionRecovery, true);
  assert.deepEqual(state.freezes, before.freezes);
  assert.equal(state.repairIterations.length, 1);
});

test('resume after persisted repair freezes saved refs without invoking the producer again', async t => {
  const f = recoveryFixture(t); setupRepair(f);
  const second = f.makeRun(2);
  repair(f, second, 1, 'REPAIRED_CANDIDATE'); // Simulated crash before freeze.
  let called = false;
  const result = await resumePastExam(f.root, { workBatchId: 'job', maxSteps: 1, handlers: { CANDIDATE_REPAIR() { called = true; throw new Error('duplicate build'); } } });
  assert.equal(called, false);
  assert.equal(result.history[0].action, 'FREEZE_RECORDED_REPAIR');
  assert.equal(result.state.repairIterations[0].status, 'FROZEN_FOR_RECHECK');
  assert.equal(result.state.freezes.at(-1).runRefs[0].sha256, second.ref.sha256);
});

test('same unreserved preflight can resume without allocating new provider contexts; tampering fails', t => {
  const f = recoveryFixture(t), run = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [run.ref]);
  const options = { workBatchId: 'job', purpose: 'FINAL_AUDIT', transport: provider(f), planPath: 'alive/runtime/provider-bridge/job/plan.json' };
  const first = prepareProviderReview(f.root, options), next = prepareProviderReview(f.root, options);
  assert.deepEqual(next, first);
  assert.equal(fs.readFileSync(path.join(f.root, 'control-calls'), 'utf8'), '1');
  const p = path.join(f.root, options.planPath), changed = JSON.parse(fs.readFileSync(p));
  changed.externalId = 'tampered'; fs.writeFileSync(p, JSON.stringify(changed));
  assert.throws(() => prepareProviderReview(f.root, options), /PROVIDER_PREFLIGHT_REPLAY_PLAN_MISMATCH/);
});

test('global slot contention waits and continues without a semantic HOLD or a duplicate launch', async t => {
  const f = recoveryFixture(t), first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  const other = initWorkBatch(f.root, { workBatchId: 'other', runIds: ['other-run'], builderId: 'other-builder', builderSessionId: 'other-session' });
  const targets = [{ runId: 'other-run', questionUid: 'other|1' }];
  const body = { workBatchId: 'other', frozenAt: '2026-01-01T00:00:00Z', targets, affected: targets, bindings: [], runRefs: [], machineCheckedUidCount: 0, predecessorFreezeSha: null };
  const freeze = { ...body, freezeSha: objectSha(body) };
  const active = { ...f.request('FINAL_AUDIT', 'other'), launchId: 'other:1', freezeSha: freeze.freezeSha, scope: targets, reservedAt: '2026-01-01T00:01:00Z', status: 'RESERVED', externalId: null };
  const p = path.join(f.root, 'alive/runtime/work-batches/other/state.json');
  fs.writeFileSync(p, JSON.stringify({ ...other, status: 'FROZEN', freezes: [freeze], launches: [active] }));
  let waits = 0;
  const result = await reserveWhenAvailable(f.root, 'job', f.request('FINAL_AUDIT', 'waiting'), { waitForSlot: async () => {
    waits++;
    assert.equal(readWorkBatch(f.root, 'job').status, 'FROZEN');
    active.status = 'COMPLETED'; active.externalId = 'other-provider'; active.endedAt = '2026-01-01T00:02:00Z';
    fs.writeFileSync(p, JSON.stringify({ ...other, status: 'FROZEN', freezes: [freeze], launches: [active] }));
  } });
  assert.equal(waits, 1);
  assert.equal(result.launches.length, 1);
  assert.equal(result.launches[0].status, 'RESERVED');
});
