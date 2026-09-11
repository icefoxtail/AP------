import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDITOR_OUTPUT_SCHEMA } from '../../../../alive/runtime/provider-bridge/auditor-output-schema.mjs';

test('provider auditor output arrays bind explicit JSON Schema item types', () => {
  assert.equal(AUDITOR_OUTPUT_SCHEMA.type, 'object');
  assert.deepEqual(AUDITOR_OUTPUT_SCHEMA.required, ['evidence', 'defects']);
  for (const field of ['evidence', 'defects']) {
    assert.equal(AUDITOR_OUTPUT_SCHEMA.properties[field].type, 'array');
    assert.equal(AUDITOR_OUTPUT_SCHEMA.properties[field].items.type, 'object');
    assert.equal(AUDITOR_OUTPUT_SCHEMA.properties[field].items.additionalProperties, true);
  }
});
