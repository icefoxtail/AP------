import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(
  path.join(root, 'archive/tools/intelligence/sync-question-identity-map-v1.mjs'),
  'utf8'
);
const runJsSource = source.match(/function runJs\(file, code\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(runJsSource, 'identity-map question loader exists');
const runJs = new Function('vm', `return (${runJsSource})`)(vm);

test('identity-map loader accepts questions on the root window.examData object', () => {
  const questions = runJs('sample.js', `window.examData = {
    "title": "sample",
    "questions": [{"id": 1}, {"id": 2}]
  };`);

  assert.equal(questions.length, 2);
  assert.equal(questions[0].id, 1);
  assert.equal(questions[1].id, 2);
});
