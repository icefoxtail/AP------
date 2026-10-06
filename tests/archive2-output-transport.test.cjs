const assert = require("node:assert/strict");
const { test } = require("node:test");
const { webcrypto } = require("node:crypto");
const output = require("../archive/archive2-output.js");
const contract = require("../archive/archive2-output-contract.js");

class FakeIndexedDb {
  constructor() {
    this.records = new Map();
    this.stores = new Set();
    this.failPut = false;
    this.db = {
      objectStoreNames: { contains: (name) => this.stores.has(name) },
      createObjectStore: (name) => this.stores.add(name),
      transaction: () => {
        const tx = { oncomplete: null, onerror: null, onabort: null };
        const request = (operation) => {
          const result = { onsuccess: null, onerror: null, result: undefined, error: null };
          queueMicrotask(() => {
            try {
              result.result = operation();
              result.onsuccess?.({ target: result });
              queueMicrotask(() => tx.oncomplete?.({ target: tx }));
            } catch (error) {
              result.error = error;
              result.onerror?.({ target: result });
              tx.error = error;
              tx.onabort?.({ target: tx });
            }
          });
          return result;
        };
        tx.objectStore = () => ({
          put: (record) => request(() => {
            if (this.failPut) throw new DOMException("Storage failure", typeof this.failPut === 'string' ? this.failPut : "QuotaExceededError");
            const clone = structuredClone(record);
            this.records.set(clone.outputRequestId, clone);
            return clone.outputRequestId;
          }),
          get: (key) => request(() => structuredClone(this.records.get(key))),
          delete: (key) => request(() => this.records.delete(key)),
          getAll: () => request(() => [...this.records.values()].map((row) => structuredClone(row))),
        });
        return tx;
      },
    };
  }

  open() {
    const request = { result: this.db, onupgradeneeded: null, onsuccess: null, onerror: null };
    queueMicrotask(() => {
      if (!this.stores.has("outputs")) {
        request.onupgradeneeded?.({ target: request });
      }
      request.onsuccess?.({ target: request });
    });
    return request;
  }
}

const now = Date.now();
class MemoryStorage {
  constructor() { this.rows = new Map(); }
  get length() { return this.rows.size; }
  key(index) { return [...this.rows.keys()][index] ?? null; }
  getItem(key) { return this.rows.get(key) ?? null; }
  setItem(key, value) { this.rows.set(key, String(value)); }
  removeItem(key) { this.rows.delete(key); }
}
const brokenIndexedDb = {
  open() {
    const request = { error: new DOMException('Internal error.', 'UnknownError') };
    queueMicrotask(() => request.onerror?.());
    return request;
  },
};
function makeEnvelope(overrides = {}) {
  return contract.createOutputEnvelope(
    {
      outputRequestId: overrides.outputRequestId || "11111111-1111-4111-8111-111111111111",
      ownerId: overrides.ownerId || "22222222-2222-4222-8222-222222222222",
      sourceKind: "archive2-compose",
      sourceId: "compose-session-7",
      mode: "exam",
      questionCount: 1,
      questionUids: ["q-1"],
      meta: { qpp: 4 },
      questions: [{ questionUid: "q-1", body: "question" }],
      createdAt: now,
      expiresAt: now + contract.DEFAULT_TTL_MS,
      ...overrides,
    },
    webcrypto,
  );
}

test("IndexedDB transport stores and reads one exact, validated envelope", async () => {
  const indexedDB = new FakeIndexedDb();
  const store = output.createOutputStore(indexedDB, { crypto: webcrypto });
  const envelope = await makeEnvelope({
    questions: [{ questionUid: "q-1", body: "question", image: "data:image/png;base64,AQID" }],
  });

  await store.write(envelope);
  assert.equal(indexedDB.records.size, 1);
  assert.equal(indexedDB.records.get(envelope.outputRequestId).estimatedPinnedImageBytes, 3);
  assert.equal(indexedDB.records.get(envelope.outputRequestId).bytes,
    output.measureOutputEnvelope(envelope).canonicalJsonBytes);
  assert.equal(
    Object.keys(indexedDB.records.get(envelope.outputRequestId).envelope).includes("questions"),
    true,
  );
  const reopened = await store.read(envelope.outputRequestId, envelope.ownerId, "exam", { now: now + 1 });
  assert.deepEqual(reopened, envelope);
});

test('IndexedDB Internal error preserves a complete validated output across reopened stores', async () => {
  const localStorage = new MemoryStorage();
  const envelope = await makeEnvelope();
  const producer = output.createOutputStore(brokenIndexedDb, { crypto: webcrypto, localStorage });
  await producer.sweepExpired();
  await producer.write(envelope);
  assert.equal(localStorage.length, 1);
  const consumer = output.createOutputStore(brokenIndexedDb, { crypto: webcrypto, localStorage });
  assert.deepEqual(await consumer.read(envelope.outputRequestId, envelope.ownerId, 'exam'), envelope);
  await assert.rejects(consumer.read(envelope.outputRequestId, '44444444-4444-4444-8444-444444444444', 'exam'), /identity/);
  await assert.rejects(consumer.read(envelope.outputRequestId, envelope.ownerId, 'ans'), /mode/);
  assert.equal(await consumer.cleanup('44444444-4444-4444-8444-444444444444', envelope.outputRequestId), false);
  assert.equal(await consumer.cleanup(envelope.ownerId, envelope.outputRequestId), true);
  assert.equal(localStorage.length, 0);
});

test('fallback output rejects corrupted snapshots and expires without deleting unrelated storage', async () => {
  const localStorage = new MemoryStorage();
  localStorage.setItem('APMATH_SESSION', 'preserve');
  const store = output.createOutputStore(brokenIndexedDb, { crypto: webcrypto, localStorage });
  const envelope = await makeEnvelope();
  await store.write(envelope);
  const key = [...localStorage.rows.keys()].find(key => key !== 'APMATH_SESSION');
  const stored = JSON.parse(localStorage.getItem(key));
  stored.envelope.questions[0].body = 'tampered';
  localStorage.setItem(key, JSON.stringify(stored));
  await assert.rejects(store.read(envelope.outputRequestId, envelope.ownerId, 'exam'), /hash/i);
  await store.write(envelope);
  assert.equal(await store.sweepExpired(undefined, envelope.expiresAt), 1);
  assert.equal(localStorage.getItem('APMATH_SESSION'), 'preserve');
});

test('publish and reopened consumers retain fallback output after IndexedDB recovers', async () => {
  const localStorage = new MemoryStorage();
  const original = await makeEnvelope();
  const envelope = await output.publishOutputEnvelope(original, { indexedDB: brokenIndexedDb, crypto: webcrypto, localStorage });
  const recovered = output.createOutputStore(new FakeIndexedDb(), { crypto: webcrypto, localStorage });
  assert.deepEqual(await recovered.read(envelope.outputRequestId, envelope.ownerId, 'exam'), envelope);
  assert.equal(await recovered.sweepExpired('44444444-4444-4444-8444-444444444444', envelope.expiresAt), 0);
  assert.equal(localStorage.length, 1);
  assert.equal(await recovered.sweepExpired(envelope.ownerId, envelope.expiresAt), 1);
});

test('large or quota-blocked fallback outputs remain readable without a localStorage write', async () => {
  for (const large of [false, true]) {
    const localStorage = new MemoryStorage();
    localStorage.setItem = () => { throw new DOMException('Storage quota exceeded', 'QuotaExceededError'); };
    const envelope = await makeEnvelope({
      questions: [{ questionUid: 'q-1', body: large ? 'x'.repeat(6 * 1024 * 1024) : 'small question' }],
    });
    const producer = output.createOutputStore(brokenIndexedDb, { crypto: webcrypto, localStorage });
    await producer.write(envelope);
    assert.equal(localStorage.length, 0);
    const consumer = output.createOutputStore(brokenIndexedDb, { crypto: webcrypto, localStorage });
    assert.deepEqual(await consumer.read(envelope.outputRequestId, envelope.ownerId, 'exam'), envelope);
    assert.equal(await consumer.cleanup(envelope.ownerId, envelope.outputRequestId), true);
  }
});

test("A/B request cleanup is exact and cannot delete another owner or request", async () => {
  const indexedDB = new FakeIndexedDb();
  const store = output.createOutputStore(indexedDB, { crypto: webcrypto });
  const a = await makeEnvelope({ outputRequestId: "11111111-1111-4111-8111-111111111111" });
  const b = await makeEnvelope({
    outputRequestId: "33333333-3333-4333-8333-333333333333",
    ownerId: "44444444-4444-4444-8444-444444444444",
  });
  await store.write(a);
  await store.write(b);

  assert.equal(await store.cleanup(a.ownerId, b.outputRequestId), false);
  assert.equal(await store.cleanup(a.ownerId, a.outputRequestId), true);
  assert.equal(indexedDB.records.has(a.outputRequestId), false);
  assert.equal(indexedDB.records.has(b.outputRequestId), true);
  await assert.doesNotReject(store.read(b.outputRequestId, b.ownerId, "exam", { now: now + 1 }));
});

test("expired records fail closed and are removed only for their owner", async () => {
  const indexedDB = new FakeIndexedDb();
  const store = output.createOutputStore(indexedDB, { crypto: webcrypto });
  const a = await makeEnvelope();
  const b = await makeEnvelope({
    outputRequestId: "33333333-3333-4333-8333-333333333333",
    ownerId: "44444444-4444-4444-8444-444444444444",
  });
  await store.write(a);
  await store.write(b);
  await assert.rejects(
    store.read(a.outputRequestId, a.ownerId, "exam", { now: a.expiresAt }),
    /만료|expired/i,
  );
  assert.equal(indexedDB.records.has(a.outputRequestId), false);
  assert.equal(indexedDB.records.has(b.outputRequestId), true);
});

test("owner cleanup stays scoped while TTL scavenging removes only expired envelope records", async () => {
  const indexedDB = new FakeIndexedDb();
  const store = output.createOutputStore(indexedDB, { crypto: webcrypto });
  const a = await makeEnvelope();
  const b = await makeEnvelope({
    outputRequestId: "33333333-3333-4333-8333-333333333333",
    ownerId: "44444444-4444-4444-8444-444444444444",
  });
  const live = await makeEnvelope({
    outputRequestId: "88888888-8888-4888-8888-888888888888",
    ownerId: "99999999-9999-4999-8999-999999999999",
  });
  await store.write(a);
  await store.write(b);
  await store.write(live);
  indexedDB.records.get(a.outputRequestId).expiresAt = now - 1;
  indexedDB.records.get(b.outputRequestId).expiresAt = now - 1;

  assert.equal(await store.sweepExpired(a.ownerId, now), 1);
  assert.equal(indexedDB.records.has(a.outputRequestId), false);
  assert.equal(indexedDB.records.has(b.outputRequestId), true, "owner cleanup must preserve another owner");
  assert.equal(await store.sweepExpired(undefined, now), 1);
  assert.equal(indexedDB.records.has(b.outputRequestId), false);
  assert.equal(indexedDB.records.has(live.outputRequestId), true, "TTL sweep must preserve all unexpired requests");
});

test("serialization failures do not fall back to split browser keys", async () => {
  const indexedDB = new FakeIndexedDb();
  indexedDB.failPut = 'DataCloneError';
  const store = output.createOutputStore(indexedDB, { crypto: webcrypto });
  const envelope = await makeEnvelope();
  await assert.rejects(store.write(envelope), /DataCloneError/i);
  assert.equal(indexedDB.records.size, 0);
});

test('a full primary IndexedDB transfers one exact output in memory without another storage write', async () => {
  const indexedDB = new FakeIndexedDb();
  indexedDB.failPut = true;
  const localStorage = new MemoryStorage();
  localStorage.setItem = () => { throw new Error('must not try another quota-limited write'); };
  const store = output.createOutputStore(indexedDB, { crypto: webcrypto, localStorage });
  const envelope = await makeEnvelope();
  await store.write(envelope);
  assert.equal(localStorage.length, 0);
  assert.deepEqual(await store.read(envelope.outputRequestId, envelope.ownerId, 'exam'), envelope);
  assert.equal(await store.cleanup(envelope.ownerId, envelope.outputRequestId), true);
});

test("assignment envelope URLs preserve every supported frozen QPP", async () => {
  for (const qpp of [1, 2, 4, 6, 8]) {
    const url = output.outputEnvelopeUrl(
      "mixed_engine.html",
      "https://example.test/archive/workspace.html",
      {
        outputRequestId: "11111111-1111-4111-8111-111111111111",
        ownerId: "22222222-2222-4222-8222-222222222222",
        mode: "exam",
        questionCount: 1,
        meta: { qpp },
      },
    );
    assert.equal(url.searchParams.get("qpp"), String(qpp));
  }
});

test("mode envelopes preserve the exact source, owner, snapshot, and ordered UID list", async () => {
  const indexedDB = new FakeIndexedDb();
  const original = await makeEnvelope({
    sourceKind: "assignment",
    sourceId: "assignment-exact-7",
    assignmentId: "assignment-exact-7",
    paperId: "saved-paper-2",
    questions: [{ questionUid: "q-1", body: "question" }],
  });
  await output.storeOutputEnvelope(original, { indexedDB, crypto: webcrypto });
  const solution = await output.publishOutputEnvelopeMode(original, "sol", { indexedDB, crypto: webcrypto });
  assert.notEqual(solution.outputRequestId, original.outputRequestId);
  assert.equal(solution.ownerId, original.ownerId);
  assert.equal(solution.sourceKind, original.sourceKind);
  assert.equal(solution.sourceId, original.sourceId);
  assert.equal(solution.assignmentId, original.assignmentId);
  assert.equal(solution.paperId, original.paperId);
  assert.equal(solution.mode, "sol");
  assert.deepEqual(solution.questionUids, original.questionUids);
  assert.deepEqual(solution.meta, original.meta);
  assert.deepEqual(solution.questions, original.questions);
  assert.deepEqual(await output.readOutputEnvelope(solution.outputRequestId, solution.ownerId, "sol", {
    indexedDB, crypto: webcrypto, now: now + 1,
  }), solution);
});
