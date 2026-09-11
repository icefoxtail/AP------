import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDITOR_OUTPUT_SCHEMA } from '../../../../alive/runtime/provider-bridge/auditor-output-schema.mjs';
import { parseJsonObjectItems } from '../../../../alive/runtime/provider-bridge/auditor-output-normalizer.mjs';
import { classifyAppServerMessage, completedTurnFor, completedTurnFromThreadRead, completedTurnFromTurnsList, completedTurnText, parseAuditorOutputText, summarizeAppServerMessage, turnFromStartResponse, withTimeout } from '../../../../alive/runtime/provider-bridge/auditor-turn-output.mjs';
import { bindProviderDefectsToLaunchScope } from '../provider-bridge.mjs';

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

test('provider adapter accepts a complete auditor JSON output without a completion notification', () => {
  assert.deepEqual(parseAuditorOutputText('progress {"evidence":["{}"],"defects":[]}'), { evidence: ['{}'], defects: [] });
  assert.equal(parseAuditorOutputText('{"evidence":["{}"]}'), null);
});

test('provider history recovery timeout does not block completion polling', async () => {
  const started = Date.now();
  await assert.rejects(withTimeout(new Promise(() => {}), 20, 'HISTORY_TIMEOUT'), /HISTORY_TIMEOUT/);
  assert.ok(Date.now() - started < 500);
});

test('app-server method envelopes are notifications even when they carry an id', () => {
  const pending = new Map([['7', { resolve() {}, reject() {} }]]);
  const message = { id: 7, method: 'turn/completed', params: { threadId: 'thread', turn: { id: 'turn', status: 'completed' } } };
  assert.equal(classifyAppServerMessage(message, pending), 'notification');
  const summary = summarizeAppServerMessage(message, 'notification', 1);
  assert.equal(summary.method, 'turn/completed');
  assert.equal(summary.route, 'notification');
  assert.equal(summary.turnStatus, 'completed');
});

test('app-server turn/start response unwraps the nested turn contract', () => {
  assert.equal(turnFromStartResponse({ turn: { id: 'nested-turn' } }).id, 'nested-turn');
  assert.equal(turnFromStartResponse({ id: 'legacy-turn' }).id, 'legacy-turn');
  assert.equal(turnFromStartResponse(null), null);
});

test('provider defects bind missing runId from the frozen launch scope', () => {
  const scope = [{ runId: 'run-1', questionUid: 'exam|5' }];
  assert.deepEqual(bindProviderDefectsToLaunchScope([{ questionUid: 'exam|5', severity: 'major' }], scope), [{ questionUid: 'exam|5', severity: 'major', runId: 'run-1' }]);
  assert.throws(() => bindProviderDefectsToLaunchScope([{ questionUid: 'exam|9' }], scope), /PROVIDER_DEFECT_SCOPE_REQUIRED/);
  assert.throws(() => bindProviderDefectsToLaunchScope([{ questionUid: 'exam|5', runId: 'run-2' }], scope), /PROVIDER_DEFECT_SCOPE_REQUIRED/);
});

test('provider aggregate defect scopes expand only across matching launch UIDs', () => {
  const scope = [1, 2, 3].map(id => ({ runId: 'run-1', questionUid: `exam|${id}` }));
  const bound = bindProviderDefectsToLaunchScope([{ scope: 'exam|1..2', severity: 'blocker' }], scope);
  assert.deepEqual(bound.map(defect => [defect.questionUid, defect.runId]), [['exam|1', 'run-1'], ['exam|2', 'run-1']]);
  assert.throws(() => bindProviderDefectsToLaunchScope([{ scope: 'other|1..2' }], scope), /PROVIDER_DEFECT_SCOPE_REQUIRED/);
});
