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
