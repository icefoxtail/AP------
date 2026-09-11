import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDITOR_OUTPUT_SCHEMA } from '../../../../alive/runtime/provider-bridge/auditor-output-schema.mjs';
import { parseJsonObjectItems } from '../../../../alive/runtime/provider-bridge/auditor-output-normalizer.mjs';
import { completedTurnFor, completedTurnFromThreadRead, completedTurnFromTurnsList, completedTurnText } from '../../../../alive/runtime/provider-bridge/auditor-turn-output.mjs';

test('provider auditor output arrays bind explicit JSON Schema item types', () => {
  assert.equal(AUDITOR_OUTPUT_SCHEMA.type, 'object');
  assert.deepEqual(AUDITOR_OUTPUT_SCHEMA.required, ['evidence', 'defects']);
  for (const field of ['evidence', 'defects']) {
    assert.equal(AUDITOR_OUTPUT_SCHEMA.properties[field].type, 'array');
    assert.equal(AUDITOR_OUTPUT_SCHEMA.properties[field].items.type, 'string');
  }
});

test('provider auditor output normalizer restores strict JSON-string evidence items', () => {
  assert.deepEqual(parseJsonObjectItems(['{"questionUid":"exam|1","status":"PASS"}'], 'evidence'), [{ questionUid: 'exam|1', status: 'PASS' }]);
  assert.throws(() => parseJsonObjectItems([{ questionUid: 'exam|1' }], 'evidence'), /ITEM_STRING_REQUIRED/);
  assert.throws(() => parseJsonObjectItems(['not-json'], 'defects'), /ITEM_JSON_INVALID/);
  assert.throws(() => parseJsonObjectItems(['[]'], 'defects'), /ITEM_OBJECT_REQUIRED/);
});

test('provider adapter falls back to the completed turn final agent message', () => {
  const notifications = [{
    method: 'turn/completed',
    params: {
      threadId: 'thread',
      turn: {
        id: 'turn',
        status: 'completed',
        items: [{ type: 'agentMessage', id: 'item', text: '{"evidence":[],"defects":[]}' }],
      },
    },
  }];
  assert.ok(completedTurnFor(notifications, 'thread', 'turn'));
  assert.equal(completedTurnText(notifications, 'thread', 'turn'), '{"evidence":[],"defects":[]}');
});

test('provider adapter recovers a completed turn from thread history', () => {
  const response = {
    thread: {
      id: 'thread',
      turns: [{ id: 'turn', status: 'completed', items: [] }],
    },
  };
  assert.deepEqual(completedTurnFromThreadRead(response, 'thread', 'turn'), response.thread.turns[0]);
  assert.equal(completedTurnFromThreadRead(response, 'other-thread', 'turn'), null);
});

test('provider adapter recovers a completed turn from the turn list endpoint', () => {
  const response = { data: [{ id: 'turn', status: 'completed', items: [] }] };
  assert.deepEqual(completedTurnFromTurnsList(response, 'turn'), response.data[0]);
  assert.equal(completedTurnFromTurnsList(response, 'other-turn'), null);
});
