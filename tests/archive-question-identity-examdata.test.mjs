import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
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

const metadataSource = fs.readFileSync(
  path.join(root, 'archive/tools/intelligence/sync-pending-question-metadata-v1.mjs'),
  'utf8'
);
const loadBankSource = metadataSource.match(/function loadBank\(sourceFile\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(loadBankSource, 'pending metadata question loader exists');

test('pending metadata loader accepts questions on the root window.examData object', t => {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pending-metadata-examdata-'));
  t.after(() => fs.rmSync(fixtureRoot, { recursive: true, force: true }));
  const archiveDir = path.join(fixtureRoot, 'archive');
  const examDir = path.join(archiveDir, 'exams');
  fs.mkdirSync(examDir, { recursive: true });
  fs.writeFileSync(path.join(examDir, 'sample.js'), `window.examData = {
    "title": "sample",
    "questions": [{"id": 1}, {"id": 2}]
  };`);

  const loadBank = new Function('archiveDir', 'banks', 'normalizeFile', 'fs', 'path', 'vm',
    `return (${loadBankSource})`)(archiveDir, new Map(), value => value, fs, path, vm);
  const questions = loadBank('sample.js');

  assert.equal(questions.length, 2);
  assert.equal(questions[0].id, 1);
  assert.equal(questions[1].id, 2);
});
