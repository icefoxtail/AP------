import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { classifyMainDrift, makePublicationCheckpoint, planPublicationResume, publicationBindingSha256 } from './archive-publication-checkpoint.mjs';

const sha = char => char.repeat(40);
const binding = { sourceSha256: 'a'.repeat(64), proofsSha256: 'b'.repeat(64), assetsSha256: 'c'.repeat(64), baselineSha256: 'd'.repeat(64), mainSha: sha('e'), changedPaths: ['archive/data/question_metadata.json'], targetPaths: ['archive/data/question_metadata.json'] };
const check = (status, exitCode) => ({ name: 'validator', command: 'node archive/tools/archive-stage-validator.mjs', status, exitCode, bindingSha256: publicationBindingSha256(binding), ...(exitCode === 0 ? { stdoutSha256: '1'.repeat(64), stderrSha256: '2'.repeat(64) } : {}) });

test('publication resume waits for all checks to finish successfully before commit', () => {
  const checkpoint = makePublicationCheckpoint({ phase: 'CHECKS_RUNNING', binding, completedPhases: ['INPUTS_BOUND'], checks: [check('running')] });
  const plan = planPublicationResume({ checkpoint, currentBinding: binding, checks: [check('running')] });
  assert.equal(plan.status, 'WAITING');
  assert.equal(plan.nextAction, 'WAIT_FOR_CHECKS_EXIT_CODE_ZERO');
  assert.equal(plan.irreversibleActionPerformed, false);
  assert.deepEqual(plan.reusedPhases, ['INPUTS_BOUND']);
});

test('completed nonzero checks block commit rather than appearing as pending', () => {
  const checkpoint = makePublicationCheckpoint({ phase: 'CHECKS_RUNNING', binding });
  const plan = planPublicationResume({ checkpoint, currentBinding: binding, checks: [check('completed', 1)] });
  assert.equal(plan.status, 'BLOCKED');
  assert.equal(plan.reason, 'CHECK_FAILED');
  assert.equal(plan.nextAction, 'REPAIR_OR_RERUN_FAILED_CHECKS');
});

test('unchanged binding reuses committed work and resumes at push', () => {
  const checkpoint = makePublicationCheckpoint({ phase: 'COMMITTED', binding, completedPhases: ['INPUTS_BOUND', 'CHECKS_PASSED', 'COMMITTED'] });
  const plan = planPublicationResume({ checkpoint, currentBinding: binding, checks: [check('completed', 0)] });
  assert.equal(plan.nextAction, 'PUSH_ALLOWED_AFTER_COMMIT');
  assert.equal(plan.reportOnly, true);
  assert.equal(plan.irreversibleActionPerformed, false);
  assert.deepEqual(plan.reusedPhases, ['INPUTS_BOUND', 'CHECKS_PASSED']);
});

test('distinguishes unrelated main drift from target overlap', () => {
  assert.equal(classifyMainDrift({ baselineMainSha: sha('a'), currentMainSha: sha('b'), changedPaths: ['README.md'], targetPaths: binding.targetPaths }).kind, 'UNRELATED_MAIN_DRIFT');
  assert.equal(classifyMainDrift({ baselineMainSha: sha('a'), currentMainSha: sha('b'), changedPaths: binding.targetPaths, targetPaths: binding.targetPaths }).kind, 'OVERLAPPING_TARGET_CHANGE');
});

test('overlapping target drift blocks resume and asks for target replan', () => {
  const checkpoint = makePublicationCheckpoint({ phase: 'COMMITTED', binding, completedPhases: ['INPUTS_BOUND', 'CHECKS_PASSED', 'COMMITTED'] });
  const changed = { ...binding, mainSha: sha('f'), mainChangedPaths: binding.targetPaths };
  const changedCheck = { ...check('completed', 0), bindingSha256: publicationBindingSha256(changed) };
  const plan = planPublicationResume({ checkpoint, currentBinding: changed, checks: [changedCheck] });
  assert.equal(plan.status, 'BLOCKED');
  assert.equal(plan.reason, 'OVERLAPPING_TARGET_CHANGE');
});

test('unrelated main drift resets publication checkpoints for a fresh baseline', () => {
  const checkpoint = makePublicationCheckpoint({ phase: 'COMMITTED', binding, completedPhases: ['INPUTS_BOUND', 'CHECKS_PASSED', 'COMMITTED'] });
  const changed = { ...binding, mainSha: sha('f'), mainChangedPaths: ['README.md'] };
  const changedCheck = { ...check('completed', 0), bindingSha256: publicationBindingSha256(changed) };
  const plan = planPublicationResume({ checkpoint, currentBinding: changed, checks: [changedCheck] });
  assert.equal(plan.drift.kind, 'UNRELATED_MAIN_DRIFT');
  assert.equal(plan.nextAction, 'REFRESH_BASELINE_THEN_REPLAN_CHECKPOINT');
  assert.deepEqual(plan.reusedPhases, ['INPUTS_BOUND']);
});

test('rejects check results bound to different source or proof bytes', () => {
  const checkpoint = makePublicationCheckpoint({ phase: 'CHECKS_PASSED', binding, completedPhases: ['INPUTS_BOUND'] });
  assert.throws(() => planPublicationResume({ checkpoint, currentBinding: binding, checks: [{ ...check('completed', 0), bindingSha256: sha('a') }] }), /CHECK_RESULT_BINDING_OR_STATUS_INVALID/);
});

test('rejects a checkpoint without exact proof and baseline bindings', () => {
  assert.throws(() => makePublicationCheckpoint({ phase: 'INPUTS_BOUND', binding: { ...binding, proofsSha256: undefined } }), /BINDING_PROOFSSHA256_REQUIRED/);
});

test('CLI persists an immutable checks-to-commit-to-push-to-readback-to-MAIN_DONE chain', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-publication-checkpoint-'));
  try {
    const modulePath = fileURLToPath(import.meta.url).replace(/\.test\.mjs$/, '.mjs');
    const put = (name, value) => {
      const file = path.join(directory, name);
      fs.writeFileSync(file, JSON.stringify(value));
      return file;
    };
    const bindingPath = put('binding.json', binding);
    const checksPath = put('checks.json', [check('completed', 0)]);
    const run = (...args) => JSON.parse(execFileSync(process.execPath, [modulePath, ...args], { encoding: 'utf8' }));
    const checkpoint1 = path.join(directory, '01-created.json');
    run('create', '--binding', bindingPath, '--output', checkpoint1);
    const plan1 = run('plan', '--checkpoint', checkpoint1, '--binding', bindingPath, '--checks', checksPath, '--current-main-sha', binding.mainSha);
    assert.equal(plan1.nextAction, 'RECORD_CURRENT_CHECKS_PASS');
    const checkpoint2 = path.join(directory, '02-checks.json');
    run('record', '--checkpoint', checkpoint1, '--binding', bindingPath, '--checks', checksPath, '--event', 'checks', '--output', checkpoint2);
    const plan2 = run('plan', '--checkpoint', checkpoint2, '--binding', bindingPath, '--checks', checksPath, '--current-main-sha', binding.mainSha);
    assert.equal(plan2.phase, 'COMMIT_READY');
    assert.equal(plan2.nextAction, 'COMMIT_ALLOWED_AFTER_CHECKS_PASS');
    const overlapPath = put('overlap.json', binding.targetPaths);
    const blockedCommit = path.join(directory, 'blocked-commit.json');
    assert.throws(() => execFileSync(process.execPath, [modulePath, 'record', '--checkpoint', checkpoint2, '--binding', bindingPath, '--checks', checksPath, '--event', 'commit', '--current-main-sha', sha('9'), '--main-changed-paths', overlapPath, '--commit-sha', sha('f'), '--output', blockedCommit], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    assert.equal(fs.existsSync(blockedCommit), false);
    const checkpoint3 = path.join(directory, '03-commit.json');
    run('record', '--checkpoint', checkpoint2, '--binding', bindingPath, '--event', 'commit', '--current-main-sha', binding.mainSha, '--commit-sha', sha('f'), '--output', checkpoint3);
    const checkpoint4 = path.join(directory, '04-push.json');
    run('record', '--checkpoint', checkpoint3, '--binding', bindingPath, '--event', 'push', '--current-main-sha', sha('f'), '--pushed-main-sha', sha('f'), '--output', checkpoint4);
    const plan4 = run('plan', '--checkpoint', checkpoint4, '--binding', bindingPath, '--checks', checksPath, '--current-main-sha', sha('f'));
    assert.equal(plan4.phase, 'PUSHED');
    assert.equal(plan4.nextAction, 'VERIFY_REMOTE_READBACK');
    const readbackPath = put('readback.json', { mainSha: sha('f'), sourceSha256: binding.sourceSha256, proofsSha256: binding.proofsSha256, assetsSha256: binding.assetsSha256, baselineSha256: binding.baselineSha256, bindingSha256: publicationBindingSha256(binding), allBytesMatch: true });
    const checkpoint5 = path.join(directory, '05-readback.json');
    run('record', '--checkpoint', checkpoint4, '--binding', bindingPath, '--event', 'readback', '--readback', readbackPath, '--output', checkpoint5);
    const plan5 = run('plan', '--checkpoint', checkpoint5, '--binding', bindingPath, '--checks', checksPath, '--current-main-sha', sha('f'));
    assert.equal(plan5.nextAction, 'CLOSE_MAIN_DONE');
    const checkpoint6 = path.join(directory, '06-main-done.json');
    run('record', '--checkpoint', checkpoint5, '--binding', bindingPath, '--event', 'main-done', '--main-done-receipt-sha256', 'a'.repeat(64), '--output', checkpoint6);
    const final = JSON.parse(fs.readFileSync(checkpoint6, 'utf8'));
    assert.equal(final.phase, 'MAIN_DONE');
    assert.equal(final.revision, 6);
    assert.equal(final.history.length, 6);
    assert.ok(final.parentCheckpointSha256);
    assert.ok(fs.existsSync(checkpoint1) && fs.existsSync(checkpoint2) && fs.existsSync(checkpoint3) && fs.existsSync(checkpoint4) && fs.existsSync(checkpoint5));
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test('CLI refuses commit recording with a failed current check result', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-publication-failed-check-'));
  try {
    const modulePath = fileURLToPath(import.meta.url).replace(/\.test\.mjs$/, '.mjs');
    const bindingPath = path.join(directory, 'binding.json'); fs.writeFileSync(bindingPath, JSON.stringify(binding));
    const checksPath = path.join(directory, 'checks.json'); fs.writeFileSync(checksPath, JSON.stringify([check('completed', 1)]));
    const checkpointPath = path.join(directory, 'checkpoint.json'); fs.writeFileSync(checkpointPath, JSON.stringify(makePublicationCheckpoint({ phase: 'INPUTS_BOUND', binding, completedPhases: ['INPUTS_BOUND'], checks: [check('completed', 1)] })));
    const outputPath = path.join(directory, 'next.json');
    assert.throws(() => execFileSync(process.execPath, [modulePath, 'record', '--checkpoint', checkpointPath, '--binding', bindingPath, '--checks', checksPath, '--event', 'commit', '--current-main-sha', binding.mainSha, '--commit-sha', sha('f'), '--output', outputPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    assert.equal(fs.existsSync(outputPath), false);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
