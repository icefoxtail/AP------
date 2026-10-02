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
            if (this.failPut) throw new DOMException("Quota exceeded", "QuotaExceededError");
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

test("quota or serialization failures do not fall back to split browser keys", async () => {
  const indexedDB = new FakeIndexedDb();
  indexedDB.failPut = true;
  const store = output.createOutputStore(indexedDB, { crypto: webcrypto });
  const envelope = await makeEnvelope();
  await assert.rejects(store.write(envelope), /QuotaExceededError|quota/i);
  assert.equal(indexedDB.records.size, 0);
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
