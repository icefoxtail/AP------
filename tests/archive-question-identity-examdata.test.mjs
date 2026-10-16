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

function selector(source, variableName) {
  const expression = source.match(new RegExp(`const ${variableName} = ([^;]+);`))?.[1];
  assert.ok(expression, `${variableName} source-array selector exists`);
  return new Function('context', 'scope', `return (${expression})`);
}

const indexSource = fs.readFileSync(path.join(root, 'archive/tools/build-question-index.mjs'), 'utf8');
const catalogSource = fs.readFileSync(path.join(root, 'archive/tools/build-archive2-catalog.mjs'), 'utf8');

test('question-index source loader uses examData only after existing globals and keeps array guard', () => {
  const getQuestions = selector(indexSource, 'questions');
  const fallback = [{ id: 1 }, { id: 2 }];
  const context = { window: { examData: { questions: fallback } } };
  assert.equal(getQuestions(context), fallback);

  const preferred = [{ id: 'preferred' }];
  assert.equal(getQuestions({ window: { questions: preferred, examData: { questions: fallback } } }), preferred);
  assert.equal(Array.isArray(getQuestions({ window: { questions: {}, examData: { questions: fallback } } })), false);
  assert.match(indexSource, /if \(!Array\.isArray\(questions\)\)/);
});

test('catalog source loader uses examData only after existing globals and keeps array guard', () => {
  const getBank = selector(catalogSource, 'bank');
  const fallback = [{ id: 1 }, { id: 2 }];
  const scope = { window: { examData: { questions: fallback } } };
  assert.equal(getBank(undefined, scope), fallback);

  const preferred = [{ id: 'preferred' }];
  assert.equal(getBank(undefined, { window: { questions: preferred, examData: { questions: fallback } } }), preferred);
  assert.equal(getBank(undefined, { window: { questions: {}, examData: { questions: fallback } } }), fallback);
  const wrappedBank = { title: 'sample', questions: fallback };
  assert.equal(getBank(undefined, { window: { questionBank: wrappedBank, examData: wrappedBank } }), fallback);
  assert.match(catalogSource, /if \(!Array\.isArray\(bank\)\)/);
});
