import assert from 'node:assert/strict';
import test from 'node:test';
import bridgeApi from '../archive/review-preview-bridge.js';

const {
  PROTOCOL_VERSION,
  createReviewMessage,
  createReviewPreviewBridge,
  isCurrentRevisionTuple,
} = bridgeApi;

test('every bridge message carries the protocol and three revision axes', () => {
  const message = createReviewMessage(
    'REVIEW_SET_SOURCE',
    { sourceKind: 'review-snapshot' },
    { bridgeEpoch: 2, sourceEpoch: 3, revision: 4 }
  );

  assert.equal(message.protocolVersion, PROTOCOL_VERSION);
  assert.equal(message.channel, 'AP_REVIEW_BRIDGE');
  assert.deepEqual(
    { bridgeEpoch: message.bridgeEpoch, sourceEpoch: message.sourceEpoch, revision: message.revision },
    { bridgeEpoch: 2, sourceEpoch: 3, revision: 4 }
  );
});

test('stale messages from an old iframe or source are rejected', () => {
  const current = { bridgeEpoch: 2, sourceEpoch: 3, revision: 4 };
  assert.equal(isCurrentRevisionTuple(current, current), true);
  assert.equal(isCurrentRevisionTuple({ bridgeEpoch: 1, sourceEpoch: 3, revision: 9 }, current), false);
  assert.equal(isCurrentRevisionTuple({ bridgeEpoch: 2, sourceEpoch: 2, revision: 9 }, current), false);
  assert.equal(isCurrentRevisionTuple({ bridgeEpoch: 2, sourceEpoch: 3, revision: 3 }, current), false);
});

test('coalescing accepts only the newest pending snapshot', async () => {
  const sent = [];
  const bridge = createReviewPreviewBridge({
    post: message => sent.push(message),
    isReady: () => true,
    schedule: fn => fn(),
    initialTuple: { bridgeEpoch: 1, sourceEpoch: 0, revision: 0 },
  });

  const first = bridge.sendSnapshot({
    bridgeEpoch: 1, sourceEpoch: 1, revision: 1,
    sourceKind: 'review-snapshot', questionBank: [{ id: 1 }]
  });
  const second = bridge.sendSnapshot({
    bridgeEpoch: 1, sourceEpoch: 1, revision: 2,
    sourceKind: 'review-snapshot', questionBank: [{ id: 1, content: '최신' }]
  });
  const results = await Promise.all([first, second]);

  assert.equal(results[0].code, 'COALESCED');
  assert.equal(results[1].ok, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].type, 'REVIEW_SET_SOURCE');
  assert.equal(sent[0].revision, 2);
});

test('iframe receiver forwards in-memory snapshots and suppresses stale completions', async () => {
  const parentMessages = [];
  const messageListeners = [];
  const parentWindow = { postMessage: message => parentMessages.push(message) };
  const documentListeners = [];
  const removedDocumentListeners = [];
  const childWindow = {
    parent: parentWindow,
    location: { origin: 'http://localhost', search: '?reviewBridge=1&bridgeEpoch=4' },
    addEventListener(type, listener) { if (type === 'message') messageListeners.push(listener); },
    removeEventListener() {},
    document: {
      addEventListener(type, listener) { if (type === 'click') documentListeners.push(listener); },
      removeEventListener(type, listener) { if (type === 'click') removedDocumentListeners.push(listener); },
    },
  };
  let releaseFirst;
  let calls = 0;
  const requests = [];
  const receiver = bridgeApi.installReviewPreviewReceiver({
    windowRef: childWindow,
    parentWindow,
    origin: 'http://localhost',
    runtimeProvider: () => ({
      request: async intent => {
        requests.push(intent);
        calls += 1;
        if (calls === 1) await new Promise(resolve => { releaseFirst = resolve; });
        return { ok: true, pages: calls };
      },
    }),
  });
  assert.ok(receiver);

  const source = tuple => bridgeApi.createReviewMessage('REVIEW_SET_SOURCE', {
    sourceKind: 'review-snapshot', sourceArchiveFile: 'fixture.js',
    questionBank: [{ id: 1, content: String(tuple.revision) }], mode: 'exam', qpp: 4,
  }, tuple);
  messageListeners[0]({ origin: 'http://localhost', source: parentWindow, data: source({ bridgeEpoch: 4, sourceEpoch: 1, revision: 1 }) });
  await Promise.resolve();
  messageListeners[0]({ origin: 'http://localhost', source: parentWindow, data: source({ bridgeEpoch: 4, sourceEpoch: 1, revision: 2 }) });
  await Promise.resolve();
  releaseFirst();
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(requests.length, 2);
  assert.equal(requests[1].payload.revision, 2);
  assert.equal(parentMessages.filter(message => message.type === 'REVIEW_RENDER_DONE').length, 1);
  assert.equal(parentMessages.find(message => message.type === 'REVIEW_RENDER_DONE').revision, 2);
  receiver.dispose();
  assert.equal(documentListeners.length, 1);
  assert.equal(removedDocumentListeners.length, 1);
});

test('iframe mode completion is discarded when a newer source tuple starts', async () => {
  const parentMessages = [];
  const messageListeners = [];
  const windowListeners = [];
  const removedWindowListeners = [];
  const parentWindow = { postMessage: message => parentMessages.push(message) };
  let releaseMode;
  const childWindow = {
    parent: parentWindow,
    location: { origin: 'http://localhost', search: '?reviewBridge=1&bridgeEpoch=5' },
    addEventListener(type, listener) {
      windowListeners.push({ type, listener });
      if (type === 'message') messageListeners.push(listener);
    },
    removeEventListener(type, listener) {
      removedWindowListeners.push({ type, listener });
    },
    document: {
      documentElement: { dataset: {} },
      addEventListener() {},
      removeEventListener() {},
    },
  };
  const receiver = bridgeApi.installReviewPreviewReceiver({
    windowRef: childWindow,
    parentWindow,
    origin: 'http://localhost',
    runtimeProvider: () => ({
      request: async intent => {
        if (intent.type === 'MODE_CHANGE') {
          return new Promise(resolve => { releaseMode = resolve; });
        }
        return { ok: true, pages: 1 };
      },
    }),
  });
  const send = data => messageListeners[0]({ origin: 'http://localhost', source: parentWindow, data });
  const source = tuple => bridgeApi.createReviewMessage('REVIEW_SET_SOURCE', {
    sourceKind: 'review-snapshot', sourceArchiveFile: 'fixture.js',
    questionBank: [{ id: 1, content: String(tuple.revision) }], mode: 'exam', qpp: 4,
  }, tuple);

  parentMessages.length = 0;
  send(source({ bridgeEpoch: 5, sourceEpoch: 1, revision: 1 }));
  await new Promise(resolve => setTimeout(resolve, 0));
  send(bridgeApi.createReviewMessage('REVIEW_SET_MODE', { mode: 'sol' }, {
    bridgeEpoch: 5, sourceEpoch: 1, revision: 1,
  }));
  await Promise.resolve();
  assert.equal(typeof releaseMode, 'function');
  send(source({ bridgeEpoch: 5, sourceEpoch: 1, revision: 2 }));
  await Promise.resolve();
  releaseMode({ ok: true, pages: 99 });
  await new Promise(resolve => setTimeout(resolve, 0));

  const done = parentMessages.filter(message => message.type === 'REVIEW_RENDER_DONE');
  assert.equal(done.filter(message => message.payload.mode === 'sol').length, 0);
  assert.equal(done.filter(message => message.revision === 2).length, 1);
  receiver.dispose();
  assert.ok(removedWindowListeners.some(item => item.type === 'message'));
});

test('parent bridge rejects messages without the expected origin or iframe source', () => {
  const bridge = createReviewPreviewBridge({
    iframe: { contentWindow: {} },
    origin: 'http://localhost',
    initialTuple: { bridgeEpoch: 2 },
    post() {},
  });
  const ready = createReviewMessage('REVIEW_BRIDGE_READY', {}, { bridgeEpoch: 2 });
  assert.equal(bridge.handleMessage({ origin: '', source: undefined, data: ready }), false);
  assert.equal(bridge.handleMessage({ origin: 'http://localhost', source: {}, data: ready }), false);
});
