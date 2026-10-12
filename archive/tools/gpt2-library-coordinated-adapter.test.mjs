import test from 'node:test';
import assert from 'node:assert/strict';
import { createCoordinatedAdapter } from './gpt2-library-coordinated-adapter.mjs';

const scope = { campaignId: 'H1_GPT2_20261006', stream: 'B', examUid: '23_금당고_1학기_중간_고1_기출' };
const root = `/Archive2-GPT/generations/${scope.campaignId}/${scope.stream}/${scope.examUid}/TECHNICAL/GPT2_V2/`;
const p = suffix => root + `seals/R2/${'b'.repeat(40)}${suffix}.json`;
const sample = Buffer.from('{"validatorMode":"R2_V2","ok":true}\n');
function pair() {
  const rows = new Map(), names = new Map(); let seq = 0, renamed = 0;
  const ledger = {
    capabilities: { atomicCreateIfAbsent: true, atomicCompareAndSwap: true, readAfterWrite: true },
    async get(key) { const item = rows.get(key); return item ? structuredClone(item) : null; },
    async createIfAbsent(key, value) {
      if (rows.has(key)) return { created: false };
      rows.set(key, { version: String(++seq), value: structuredClone(value) });
      return { created: true };
    },
    async compareAndSwap(key, oldVersion, value) {
      if (rows.get(key)?.version !== oldVersion) return { updated: false };
      rows.set(key, { version: String(++seq), value: structuredClone(value) });
      return { updated: true };
    },
  };
  const library = {
    capabilities: { rawByteReadback: true, createOnlyNoOverwrite: true },
    async getRaw(path) { const b = names.get(path); return b ? Buffer.from(b) : null; },
    async uploadCreateOnly(path, bytes) {
      if (names.has(path)) { renamed++; return { path: `${path}(${renamed})`, fileId: 'extra-' + renamed }; }
      names.set(path, Buffer.from(bytes)); return { path, fileId: 'canonical' };
    },
  };
  const make = (ownerId, opts={}) => createCoordinatedAdapter({ library, ledger, ...scope, ownerId, ...opts });
  return { make, library, ledger, rows, names, get renamed() { return renamed; } };
}

test('host adapter serializes two independent instances with identical artifact', async () => {
  const x = pair();
  const adapters = [x.make('session-1'), x.make('session-2')];
  const results = await Promise.allSettled(adapters.map(a => a.putIfAbsent(p('.validator'), sample)));
  assert.ok(results.some(r => r.status === 'fulfilled' && r.value === true));
  for (const a of adapters) assert.deepEqual(await a.get(p('.validator')), sample);
  assert.equal(x.names.size, 1);
  assert.equal(x.renamed, 0);
  const repeat = await adapters[1].putIfAbsent(p('.validator'), sample);
  assert.equal(repeat, false);
});

test('disallow another payload for immutable same remote path', async () => {
  const x = pair(), a = x.make('worker-1'), b = x.make('worker-2');
  await a.putIfAbsent(p(''), sample);
  await assert.rejects(() => b.putIfAbsent(p(''), Buffer.from('DIFFERENT')), /LIBRARY_IMMUTABLE_CONFLICT/);
  assert.equal(x.names.size, 1);
});

test('after remote byte persisted but final CAS interrupted, replay recovers without second upload', async () => {
  const x = pair(), first = x.make('worker-1');
  let finalized = false;
  const original = x.ledger.compareAndSwap.bind(x.ledger);
  x.ledger.compareAndSwap = async (...args) => {
    if (!finalized && args[2]?.status === 'VERIFIED') { finalized = true; throw Error('TRANSIENT_LEDGER_ERROR'); }
    return original(...args);
  };
  await assert.rejects(() => first.putIfAbsent(p(''), sample), /TRANSIENT_LEDGER_ERROR/);
  assert.equal(x.names.size, 1);
  const replay = x.make('worker-2');
  assert.equal(await replay.putIfAbsent(p(''), sample), false);
  assert.equal(x.renamed, 0);
});

test('stale distributed claim can be taken over safely', async () => {
  let time = 100_000;
  const x = pair(), inputPath = p('');
  const a = x.make('first', { now: () => time, leaseMs: 10_000 });
  const blocker = x.library.uploadCreateOnly.bind(x.library);
  x.library.uploadCreateOnly = async () => { throw Error('SIMULATED_CRASH_BEFORE_UPLOAD'); };
  await assert.rejects(() => a.putIfAbsent(inputPath, sample), /SIMULATED_CRASH/);
  const second = x.make('second', { now: () => time, leaseMs: 10_000 });
  await assert.rejects(() => second.putIfAbsent(inputPath, sample), /CAS_LEDGER_ACTIVE_WRITER/);
  time += 11_000; x.library.uploadCreateOnly = blocker;
  assert.equal(await second.putIfAbsent(inputPath, sample), true);
  assert.deepEqual(await second.get(inputPath), sample);
});

test('Library unexpected duplicate-safe rename is a HARD failure even when actor claimed path', async () => {
  const x = pair();
  const a = x.make('me');
  const original = x.library.getRaw.bind(x.library);
  let injected = false;
  x.library.getRaw = async path => {
    // simulate external uncoordinated writer racing after claim
    if (!injected && x.rows.size > 0) { x.names.set(path, Buffer.from('foreign')); injected = true; }
    return original(path);
  };
  await assert.rejects(() => a.putIfAbsent(p(''), sample), /LIBRARY_IMMUTABLE_CONFLICT/);
  assert.equal(x.names.size, 1);
});

test('fake capabilities and cross-stream upload are rejected', async () => {
  const x = pair();
  assert.throws(() => createCoordinatedAdapter({ library: x.library, ledger: { capabilities: {} }, ...scope }), /DISTRIBUTED_CAS_LEDGER_REQUIRED/);
  const a = x.make('allowed');
  await assert.rejects(() => a.putIfAbsent(p('').replace('/B/', '/A/'), sample), /OUT_OF_SCOPE_LIBRARY_PATH/);
  await assert.rejects(() => a.putIfAbsent(root + 'unrelated.json', sample), /INVALID_LIBRARY_CLOSEOUT_PATH/);
});

test('provider metadata claim is rejected instead of real bytes', async () => {
  const x = pair();
  x.library.getRaw = async () => ({ sha: 'fake' });
  const a = x.make('test');
  await assert.rejects(() => a.putIfAbsent(p(''), sample), /LIBRARY_RAW_BYTES_REQUIRED/);
});

test('a forged coordinator VERIFIED record without Library bytes blocks writes', async () => {
  const x = pair(), a = x.make('owner');
  const library = x.library;
  const real = library.uploadCreateOnly.bind(library);
  library.uploadCreateOnly = async (path, bytes) => { const result = await real(path, bytes); x.names.delete(path); return result; };
  await assert.rejects(() => a.putIfAbsent(p(''), sample), /LIBRARY_REMOTE_READBACK_MISSING/);
});