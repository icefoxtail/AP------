import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { oneShot } from './gpt2-one-shot-closeout.mjs';

const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const SHA = 'a'.repeat(40);
const CAMPAIGN = 'H1_GPT2_20261006';
const EXAM = '23_금당고_1학기_중간_고1_기출';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gpt2-one-shot-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const opts = { stage: 'R2', exam: path.join(root, 'exam.js'), evidence: path.join(root, 'evidence.json'),
    assetRoot: path.join(root, 'archive'), outputRoot: path.join(root, 'out'),
    campaignId: CAMPAIGN, stream: 'B', examUid: EXAM };
  fs.mkdirSync(opts.assetRoot, { recursive: true });
  fs.writeFileSync(opts.exam, 'window.questionBank = [{ id: 1 }];\n');
  fs.writeFileSync(opts.evidence, JSON.stringify({ artifactSha: SHA }));
  let seals = 0;
  function runSeal() {
    seals++;
    const base = path.join(opts.outputRoot, CAMPAIGN, 'B', EXAM);
    const dir = path.join(base, 'seals', 'R2');
    const handoffDir = path.join(base, 'handoffs');
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(handoffDir, { recursive: true });
    const report = { ok: true, validatorMode: 'R2_V2', artifactSha: SHA, artifactContract: { active: true }, issues: [] };
    const reportBytes = Buffer.from(JSON.stringify(report) + '\n');
    const seal = { campaignId: CAMPAIGN, stream: 'B', examUid: EXAM, stage: 'R2',
      stageStatus: 'R2_VERIFIED', artifactSha: SHA, evidenceSha256: 'b'.repeat(64),
      validatorReportSha256: digest(reportBytes) };
    const handoff = { campaignId: CAMPAIGN, stream: 'B', examUid: EXAM, previousStage: 'R2',
      stage: 'R3', artifactSha: SHA, evidenceSha256: 'b'.repeat(64) };
    fs.writeFileSync(path.join(dir, SHA + '.validator.json'), reportBytes);
    fs.writeFileSync(path.join(dir, SHA + '.json'), JSON.stringify(seal) + '\n');
    fs.writeFileSync(path.join(handoffDir, 'R3.json'), JSON.stringify(handoff) + '\n');
    return { ok: true, stageStatus: 'R2_VERIFIED', artifactSha: SHA, noop: seals > 1 };
  }
  return { opts, runSeal, get sealCalls() { return seals; } };
}
function adapter() {
  const store = new Map();
  let writes = 0;
  return { store, capabilities: { atomicCreateIfAbsent: true, rawByteReadback: true },
    get writes() { return writes; },
    async get(key) { return store.get(key) ?? null; },
    async putIfAbsent(key, data) {
      if (store.has(key)) return false;
      store.set(key, Buffer.from(data)); writes++;
      return true;
    },
  };
}

test('R2 gate -> immutable seal -> remote byte readback -> R3 handoff in one call', async t => {
  const f = fixture(t), a = adapter();
  const r = await oneShot(f.opts, { adapter: a, runSeal: f.runSeal });
  assert.equal(r.status, 'REMOTE_VERIFIED');
  assert.equal(r.nextStage, 'R3');
  assert.equal(r.artifactSha, SHA);
  assert.equal(f.sealCalls, 1);
  assert.equal(a.writes, 4);
  assert.equal([...a.store.keys()].filter(k => k.includes('/commits/')).length, 1);
});

test('rerun reuses byte-identical remote artifacts and commit marker', async t => {
  const f = fixture(t), a = adapter();
  const first = await oneShot(f.opts, { adapter: a, runSeal: f.runSeal });
  const second = await oneShot(f.opts, { adapter: a, runSeal: f.runSeal });
  assert.equal(first.commitSha256, second.commitSha256);
  assert.equal(second.localSealReused, true);
  assert.equal(a.writes, 4);
});

test('interrupted upload resumes with no early remote commit', async t => {
  const f = fixture(t), a = adapter();
  let attempts = 0;
  const original = a.putIfAbsent.bind(a);
  a.putIfAbsent = async (...args) => { if (++attempts === 3) throw Error('SIMULATED_PROVIDER_INTERRUPTION'); return original(...args); };
  await assert.rejects(oneShot(f.opts, { adapter: a, runSeal: f.runSeal }), /SIMULATED_PROVIDER_INTERRUPTION/);
  assert.equal([...a.store.keys()].filter(k => k.includes('/commits/')).length, 0);
  a.putIfAbsent = original;
  const recovered = await oneShot(f.opts, { adapter: a, runSeal: f.runSeal });
  assert.equal(recovered.status, 'REMOTE_VERIFIED');
  assert.equal(a.writes, 4);
});

test('concurrent callers only create four content-addressed remote entries', async t => {
  const f = fixture(t), a = adapter();
  const results = await Promise.all(Array.from({ length: 8 }, () => oneShot(f.opts, { adapter: a, runSeal: f.runSeal })));
  assert.ok(results.every(x => x.status === 'REMOTE_VERIFIED'));
  assert.equal(a.writes, 4);
});

test('reject adapters without atomic create-if-absent before local seal', async t => {
  const f = fixture(t);
  await assert.rejects(oneShot(f.opts, { adapter: { get: async () => null, put: async () => {} }, runSeal: f.runSeal }), /ATOMIC_LIBRARY_ADAPTER_REQUIRED/);
  assert.equal(f.sealCalls, 0);
});

test('failed canonical validator cannot upload a receipt', async t => {
  const f = fixture(t), a = adapter();
  await assert.rejects(oneShot(f.opts, { adapter: a, runSeal: () => ({ ok: false, issues: ['R2_ORDER_REQUIRED:q1'] }) }), /CANONICAL_STAGE_NOT_PASSED/);
  assert.equal(a.writes, 0);
});

test('existing conflicting Library bytes stop commit without overwrite', async t => {
  const f = fixture(t), a = adapter();
  const first = await oneShot(f.opts, { adapter: a, runSeal: f.runSeal });
  const key = [...a.store.keys()].find(k => k.endsWith('.validator.json'));
  a.store.set(key, Buffer.from('tampered'));
  await assert.rejects(oneShot(f.opts, { adapter: a, runSeal: f.runSeal }), /REMOTE_READBACK_MISMATCH/);
  assert.equal(a.writes, 4);
  assert.equal(first.status, 'REMOTE_VERIFIED');
});

test('fake hash claim instead of raw bytes is rejected', async t => {
  const f = fixture(t), a = adapter();
  a.get = async () => ({ sha256: 'pretend' });
  await assert.rejects(oneShot(f.opts, { adapter: a, runSeal: f.runSeal }), /LIBRARY_RAW_BYTES_REQUIRED/);
  assert.equal(a.writes, 0);
});