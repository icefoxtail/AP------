'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../archive/archive2-core.js');

// Execute the production aggregation stage, with real path normalization.
// Loading the whole generator would rebuild the repository in a unit test.
const source = fs.readFileSync(path.resolve(__dirname, '../archive/tools/build-archive2-catalog.mjs'), 'utf8');
const start = source.indexOf('const automaticCountBySource = ');
const end = source.indexOf('const indexVersion = hash(', start);
assert.ok(start >= 0 && end > start, 'production automatic-count stage must be identifiable');
const script = new vm.Script(source.slice(start, end), { filename: 'production-catalog-automatic-counts' });
function aggregate(records, exams) {
  let normalizationCalls = 0;
  script.runInNewContext({ records, exams, core: { normalizeFile: value => {
    normalizationCalls += 1;
    return core.normalizeFile(value);
  } } });
  return normalizationCalls;
}

test('automatic counts preserve exact source identity, normalized exam paths and false eligibility', () => {
  const records = [
    { sourceFile: 'original/a.js', automatic: true },
    { sourceFile: 'original/a.js', automatic: false },
    { sourceFile: 'original/a.js', automatic: true },
    { sourceFile: 'original/a.js', automatic: 0 },
    { sourceFile: 'original/a.js' },
    { sourceFile: 'archive/exams/original/a.js', automatic: true },
    { sourceFile: 'original/가.js', automatic: true },
    { sourceFile: 'original/b.js', automatic: true },
    { sourceFile: '__proto__', automatic: true },
  ];
  const exams = ['archive/exams/original/a.js?version=1', '/exams/original/a.js#page2',
    'exams\\original\\b.js', 'original/가.js', 'missing.js', '__proto__']
    .map(file => ({ file, automaticCount: 999 }));
  const before = JSON.stringify(records), paths = exams.map(e => e.file);
  assert.equal(aggregate(records, exams), exams.length);
  assert.deepEqual(exams.map(e => e.automaticCount), [2, 2, 1, 1, 0, 1]);
  assert.deepEqual(exams.map(e => e.file), paths);
  assert.equal(JSON.stringify(records), before, 'eligibility and record identity are read-only');
});

test('duplicate sources and exam aliases match the former full-scan contract with linear normalization', () => {
  const records = Array.from({ length: 1200 }, (_, i) => ({
    sourceFile: 'original/' + i % 17 + '.js', automatic: [true, false, null, undefined, 1][i % 5],
  }));
  const exams = Array.from({ length: 61 }, (_, i) => ({ file: 'archive/exams/original/' + i % 21 + '.js' }));
  const expected = exams.map(exam => records.filter(row => row.sourceFile === core.normalizeFile(exam.file) && row.automatic).length);
  const before = JSON.stringify(records);
  assert.equal(aggregate(records, exams), exams.length);
  assert.deepEqual(exams.map(e => e.automaticCount), expected);
  assert.equal(JSON.stringify(records), before);
});

test('empty source inventories reset counts without creating records or changing exam paths', () => {
  const exams = [{ file: 'original/empty.js', automaticCount: 8 }];
  assert.equal(aggregate([], exams), 1);
  assert.deepEqual(exams, [{ file: 'original/empty.js', automaticCount: 0 }]);
  assert.equal(aggregate([{ sourceFile: 'original/a.js', automatic: true }], []), 0);
});
