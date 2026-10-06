const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

function peer() {
  const listeners = new Set();
  const root = {
    crypto: webcrypto, TextEncoder, setTimeout, clearTimeout, console,
    location: { origin: 'https://archive.test' },
    localStorage: { length: 0, getItem: () => null, setItem() { throw new DOMException('Quota exceeded', 'QuotaExceededError'); } },
    indexedDB: { open() {
      const request = { error: new DOMException('Internal error.', 'UnknownError') };
      queueMicrotask(() => request.onerror?.());
      return request;
    } },
    addEventListener(name, fn) { if (name === 'message') listeners.add(fn); },
    removeEventListener(name, fn) { if (name === 'message') listeners.delete(fn); },
  };
  vm.createContext(root);
  const clone = value => {
    root.cloneInput = JSON.stringify(value);
    return vm.runInContext('JSON.parse(cloneInput)', root);
  };
  root.structuredClone = clone;
  vm.runInContext('window = globalThis; parent = globalThis;', root);
  vm.runInContext(fs.readFileSync(require.resolve('../archive/archive2-output-contract.js'), 'utf8'), root);
  vm.runInContext(fs.readFileSync(require.resolve('../archive/archive2-output.js'), 'utf8'), root);
  return { root, clone, deliver(event) { for (const listener of [...listeners]) listener({ ...event, data: clone(event.data) }); } };
}

test('an isolated output window receives and validates its exact snapshot when both storage backends fail', async () => {
  const producer = peer(), consumer = peer();
  const toProducer = { postMessage(data) { queueMicrotask(() => producer.deliver({ data: structuredClone(data), origin: 'https://archive.test', source: toConsumer })); } };
  const toConsumer = { postMessage(data) { queueMicrotask(() => consumer.deliver({ data: structuredClone(data), origin: 'https://archive.test', source: toProducer })); } };
  consumer.root.opener = toProducer;
  const envelope = await producer.root.Archive2Output.publishOutputEnvelope(producer.clone({
    sourceKind: 'archive2-compose', sourceId: 'test-paper', mode: 'exam',
    questionCount: 1, questionUids: ['q-1'], meta: { qpp: 4 },
    questions: [{ questionUid: 'q-1', content: 'large snapshot ' + 'x'.repeat(200000) }],
  }));
  const received = await consumer.root.Archive2Output.readOutputEnvelope(envelope.outputRequestId, envelope.ownerId, 'exam');
  assert.equal(JSON.stringify(received), JSON.stringify(envelope));
  await assert.rejects(consumer.root.Archive2Output.readOutputEnvelope(envelope.outputRequestId, envelope.ownerId, 'ans'), /mode/);
  const solution = await consumer.root.Archive2Output.publishOutputEnvelopeMode(received, 'sol');
  assert.equal(solution.mode, 'sol');
  assert.deepEqual(solution.questions, received.questions);
  assert.equal(await consumer.root.Archive2Output.createOutputStore().cleanup(envelope.ownerId, envelope.outputRequestId), true);
});
