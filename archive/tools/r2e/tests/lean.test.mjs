import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { git, sha, atomicWrite } from '../common.mjs';
import { acquireLease } from '../lock.mjs';
import { inventory } from '../snapshot.mjs';
import { finalGate, REQUIRED_GATES } from '../final-gate.mjs';

function fixture() {
  const base = path.resolve(fileURLToPath(new URL('../../../..', import.meta.url)), 'tmp/r2e-tests-20260927'); fs.mkdirSync(base, { recursive: true });
  const root = fs.mkdtempSync(path.join(base, 'fixture-')), repo = path.join(root, 'repo'), remote = path.join(root, 'remote.git'); fs.mkdirSync(repo);
  execFileSync('git', ['init', '--bare', remote], { stdio: 'pipe' }); git(repo, ['init', '-b', 'main']); git(repo, ['config', 'user.name', 'R2E Test']); git(repo, ['config', 'user.email', 'test@example.invalid']); git(repo, ['config', 'core.autocrlf', 'false']); git(repo, ['remote', 'add', 'origin', remote]);
  const write = (rel, value) => { const target = path.join(repo, rel); atomicWrite(target, typeof value === 'string' ? value : JSON.stringify(value)); return { path: rel, sha256: sha(fs.readFileSync(target)) }; };
  const commit = (paths, message) => { git(repo, ['add', '--', ...paths]); git(repo, ['commit', '-m', message]); return git(repo, ['rev-parse', 'HEAD']).trim(); };
  const examFile = 'archive/exams/original/middle/m2/1mid/test.js';
  write(examFile, 'window.questionBank=[{id:1,content:"문항",answer:"①",choices:["1","2"],solution:"조건에서 답을 구한다."}];');
  const main = commit([examFile], 'main'); git(repo, ['push', 'origin', 'main']);
  for (const g of ['m2', 'm3']) git(repo, ['push', 'origin', `${main}:refs/heads/work/intake/${g}`]);
  git(repo, ['checkout', '-b', 'work/intake/m2']);
  const receiptPath = 'archive/data/r2e-intake/m2/test.json';
  const receipt = { examUid: 'test', examFile, grade: '중2', lane: 'A', stage: 'R1', sourceBlobSha: sha('source'), inputCommit: main, totalQuestions: 1, changedQuestions: [], changedSvgFiles: [], metaDispositionSummary: {}, unresolvedItems: [], authorityRefs: [], nextState: 'READY_FOR_R2E', updatedAt: new Date().toISOString() };
  write(receiptPath, receipt); const ready = commit([receiptPath], 'R1 READY'); git(repo, ['push', 'origin', 'work/intake/m2']);
  return { root, repo, write, commit, examFile, main, receiptPath, receipt, ready };
}
test('grade snapshot is immutable; late and malformed receipts do not block healthy input', () => {
  const f = fixture(), first = inventory(f.repo); assert.equal(first.status, 'READY'); assert.equal(first.candidates[0].inputCommit, f.ready);
  f.write('archive/data/r2e-intake/m2/bad.json', { nextState: 'READY_FOR_R2E' }); const late = f.commit(['archive/data/r2e-intake/m2/bad.json'], 'late invalid'); git(f.repo, ['push', 'origin', 'work/intake/m2']);
  assert.equal(first.heads.m2.sha, f.ready); assert.equal(first.candidates.length, 1);
  const next = inventory(f.repo); assert.equal(next.heads.m2.sha, late); assert.equal(next.candidates.length, 1); assert.equal(next.errors.length, 1);
  const oldLanes = 'work/intake/m2-a'; git(f.repo, ['push', 'origin', `${late}:refs/heads/${oldLanes}`]); assert.deepEqual(Object.keys(inventory(f.repo).heads), ['m2', 'm3']);
});
test('remote physical checkpoint takes resume precedence; final input is skipped', () => {
  const f = fixture(); git(f.repo, ['checkout', '-b', 'work/r2e-state', f.main]);
  const rel = 'archive/data/r2e/m2/exams/test.json'; f.write(rel, { examUid: 'test', inputCommit: f.ready, finalStatus: 'R2E_IN_PROGRESS', nextAction: 'continue q1' }); f.commit([rel], 'checkpoint'); git(f.repo, ['push', 'origin', 'work/r2e-state']);
  assert.equal(inventory(f.repo).status, 'RESUME');
  f.write(rel, { examUid: 'test', inputCommit: f.ready, finalStatus: 'R2E_MAIN_FINAL' }); f.commit([rel], 'final receipt'); git(f.repo, ['push', 'origin', 'work/r2e-state']); assert.equal(inventory(f.repo).status, 'NO_WORK');
});
test('same-repository worktrees share OS lock; competing owner is rejected; release fences old owner', async t => {
  const f = fixture(), first = await acquireLease(f.repo, { runId: 'first' }); t.after(() => first.release()); assert.equal(first.status, 'ACQUIRED');
  const worktree = path.join(f.root, 'other'); git(f.repo, ['worktree', 'add', '--detach', worktree, f.main]);
  assert.equal((await acquireLease(worktree, { runId: 'second' })).status, 'RUN_ALREADY_ACTIVE');
  await first.release(); assert.throws(first.assert, /LEASE_LOST/);
  const next = await acquireLease(worktree, { runId: 'second' }); t.after(() => next.release()); assert.ok(next.fencingToken > first.fencingToken);
});
test('guard helper crash releases kernel lock; prior JavaScript owner can no longer mutate', async t => {
  const f = fixture(), first = await acquireLease(f.repo, { runId: 'crash' });
  const owner = JSON.parse(fs.readFileSync(path.join(f.repo, '.git/r2e/lease.json'), 'utf8')); process.kill(owner.guardPid);
  await new Promise(resolve => setTimeout(resolve, 100)); assert.throws(first.assert, /LEASE_LOST/);
  const next = await acquireLease(f.repo, { runId: 'recovered' }); t.after(() => next.release()); assert.equal(next.status, 'ACQUIRED');
});
test('final gate needs current bytes, complete evidence, HOLD Zero and integrity reuse for normal PASS', () => {
  const f = fixture(), evidence = f.write('archive/data/r2e/m2/evidence/check.json', { scope: 'synthetic test', status: 'PASS' });
  const ledger = { examFile: f.examFile, inputBranch: 'work/intake/m2', inputCommit: f.ready, dependencyShas: [evidence], denominator: 1, integrityScanned: 1, deepReviewItems: [], resolvedItems: [], remainingItems: [], unresolvedItems: [], items: [{ ordinal: 1, status: 'PASS', r1Status: 'PASS', reviewMode: 'INTEGRITY_REUSE' }] };
  const validation = { artifactSha256: sha(fs.readFileSync(path.join(f.repo, f.examFile))), inputCommit: f.ready, artifacts: [], gates: Object.fromEntries(REQUIRED_GATES.map(name => [name, { status: 'PASS', evidenceRef: evidence }])) };
  assert.equal(finalGate(f.repo, ledger, validation).status, 'PASS');
  for (const code of ['META_PACK_GAP_HOLD', 'META_CANONICAL_HOLD', 'RPM_PRIMARY_MIGRATION_GAP', 'PROPOSED_NEW_L3', 'PROPOSED_NEW_L4', 'CROSS_CONCEPT_CANDIDATE']) {
    const modified = structuredClone(ledger); modified.items[0].disposition = code; assert.equal(finalGate(f.repo, modified, validation).status, 'FAIL');
  }
  const deep = structuredClone(ledger); deep.items[0].reviewMode = 'DEEP'; assert.equal(finalGate(f.repo, deep, validation).status, 'FAIL');
  const proposal = structuredClone(ledger); proposal.crossConceptCandidates = ['unresolved']; assert.equal(finalGate(f.repo, proposal, validation).status, 'FAIL');
  const wrongIdentity = structuredClone(ledger); wrongIdentity.items[0].ordinal = 2; assert.equal(finalGate(f.repo, wrongIdentity, validation).status, 'FAIL');
  const missing = structuredClone(validation); delete missing.gates.compiledRuntimeParity; assert.equal(finalGate(f.repo, ledger, missing).status, 'FAIL');
  f.write(evidence.path, 'changed dependency'); assert.equal(finalGate(f.repo, ledger, validation).status, 'FAIL');
  f.write(f.examFile, 'window.questionBank=[];'); assert.equal(finalGate(f.repo, ledger, validation).status, 'FAIL');
});
