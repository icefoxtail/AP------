import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDITOR_OUTPUT_SCHEMA } from '../../../../alive/runtime/provider-bridge/auditor-output-schema.mjs';
import { parseJsonObjectItems } from '../../../../alive/runtime/provider-bridge/auditor-output-normalizer.mjs';

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
