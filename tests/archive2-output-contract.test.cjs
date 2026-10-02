const assert = require("node:assert/strict");
const { test } = require("node:test");
const { webcrypto } = require("node:crypto");

const contract = require("../archive/archive2-output-contract.js");
const cryptoApi = globalThis.crypto || webcrypto;

const now = 1_790_000_000_000;
const baseInput = () => ({
  contractVersion: "archive2-output-envelope-v1",
  outputRequestId: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  sourceKind: "archive2-compose",
  sourceId: "compose-session-7",
  mode: "exam",
  questionCount: 2,
  questionUids: ["q-1", "q-2"],
  meta: { qpp: 4, title: "Canonical output" },
  questions: [
    { questionUid: "q-1", body: "first" },
    { questionUid: "q-2", body: "second" },
  ],
  createdAt: now,
  expiresAt: now + 30 * 60 * 1000,
});

test("canonical serialization sorts object keys and preserves array order", () => {
  assert.equal(
    contract.canonicalizeOutputValue({ z: 1, a: { y: 2, b: "x" }, rows: [2, 1] }),
    '{"a":{"b":"x","y":2},"rows":[2,1],"z":1}',
  );
  assert.throws(() => contract.canonicalizeOutputValue({ invalid: undefined }));
  assert.throws(() => contract.canonicalizeOutputValue({ invalid: Number.NaN }));
});

test("producer creates a versioned SHA-256 envelope that its consumer verifies", async () => {
  const envelope = await contract.createOutputEnvelope(baseInput(), cryptoApi);
  assert.match(envelope.payloadHash, /^[a-f0-9]{64}$/);
  assert.equal(envelope.contractVersion, "archive2-output-envelope-v1");
  await assert.doesNotReject(
    contract.validateOutputEnvelope(
      envelope,
      {
        outputRequestId: baseInput().outputRequestId,
        ownerId: baseInput().ownerId,
        mode: "exam",
        now: now + 1,
      },
      cryptoApi,
    ),
  );
});

test("consumer fails closed for changed payload, contract, mode, or request identity", async () => {
  const envelope = await contract.createOutputEnvelope(baseInput(), cryptoApi);
  const expected = {
    outputRequestId: envelope.outputRequestId,
    ownerId: envelope.ownerId,
    mode: envelope.mode,
    now: now + 1,
  };
  await assert.rejects(
    contract.validateOutputEnvelope({ ...envelope, meta: { ...envelope.meta, qpp: 8 } }, expected, cryptoApi),
    /hash/i,
  );
  await assert.rejects(
    contract.validateOutputEnvelope({ ...envelope, contractVersion: "archive2-output-v0" }, expected, cryptoApi),
    /contractVersion/i,
  );
  await assert.rejects(
    contract.validateOutputEnvelope(envelope, { ...expected, mode: "sol" }, cryptoApi),
    /mode/i,
  );
  await assert.rejects(
    contract.validateOutputEnvelope(envelope, { ...expected, outputRequestId: "33333333-3333-4333-8333-333333333333" }, cryptoApi),
    /outputRequestId/i,
  );
});

test("question count and ordered UID list are bound to materialized questions", async () => {
  const wrongCount = baseInput();
  wrongCount.questionCount = 1;
  await assert.rejects(contract.createOutputEnvelope(wrongCount, cryptoApi), /questionCount/i);

  const wrongOrder = baseInput();
  wrongOrder.questionUids = ["q-2", "q-1"];
  await assert.rejects(contract.createOutputEnvelope(wrongOrder, cryptoApi), /questionUids/i);
});

test("envelope rejects split or incomplete payload and expired output", async () => {
  const missingPayload = baseInput();
  delete missingPayload.questions;
  await assert.rejects(contract.createOutputEnvelope(missingPayload, cryptoApi), /questions|immutableReference/i);

  const expired = await contract.createOutputEnvelope(baseInput(), cryptoApi);
  await assert.rejects(
    contract.validateOutputEnvelope(expired, { now: expired.expiresAt }, cryptoApi),
    /expired/i,
  );
});

test("immutable references are accepted as a single payload authority", async () => {
  const input = baseInput();
  delete input.questions;
  input.immutableReference = {
    kind: "assignment-snapshot",
    id: "assignment-17",
    snapshotHash: "a".repeat(64),
  };
  const envelope = await contract.createOutputEnvelope(input, cryptoApi);
  await assert.doesNotReject(
    contract.validateOutputEnvelope(envelope, { now: now + 1 }, cryptoApi),
  );
});
