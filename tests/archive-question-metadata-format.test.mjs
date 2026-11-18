import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { questionMetadataText } from '../archive/tools/meta-foundation/question-metadata-format.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Defect condition: any writer (or hand edit) that leaves question_metadata.json in another text form is caught here.
// The pretty form had grown past GitHub's 100 MB file limit.
test('the committed question_metadata.json is exactly the one-record-per-line form', () => {
  const raw = fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8');
  assert.equal(raw.charCodeAt(0) === 0xFEFF, false, 'no BOM');
  assert.equal(raw.includes('\r'), false, 'LF only');
  assert.equal(raw, questionMetadataText(JSON.parse(raw)));
});

test('head keys are pretty, records are one compact line each, key order is kept', () => {
  const doc = { schemaVersion: 'v', counts: { a: 1, b: [1, 2] }, records: [{ questionUid: 'x', n: 1, nested: { k: [1] } }, { questionUid: 'y' }], digest: 'd' };
  const text = questionMetadataText(doc);
  assert.equal(text, [
    '{',
    '  "schemaVersion": "v",',
    '  "counts": {',
    '    "a": 1,',
    '    "b": [',
    '      1,',
    '      2',
    '    ]',
    '  },',
    '  "records": [',
    '    {"questionUid":"x","n":1,"nested":{"k":[1]}},',
    '    {"questionUid":"y"}',
    '  ],',
    '  "digest": "d"',
    '}', ''].join('\n'));
  assert.deepEqual(Object.keys(JSON.parse(text)), Object.keys(doc));
});

test('empty or missing records stay valid JSON and the text round-trips', () => {
  for (const doc of [{ schemaVersion: 'v', records: [] }, { schemaVersion: 'v' }, { records: [], counts: {} }]) {
    const text = questionMetadataText(doc);
    assert.ok(text.endsWith('\n') && !text.endsWith('\n\n'));
    assert.deepEqual(JSON.parse(text), doc);
    assert.equal(questionMetadataText(JSON.parse(text)), text, 'writing what was read changes nothing');
  }
  assert.ok(questionMetadataText({ records: [] }).includes('"records": []'));
});
