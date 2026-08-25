import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
const core = require(path.join(root, 'archive', 'unit-past-exams-core.js'));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'archive', 'question-index.js'), 'utf8'), context);

const catalog = core.buildCatalog(context.window.questionIndex);
const expected = {
  // Refreshed against the canonical question-index snapshot on 2026-08-24.
  'H22-C-01': 78,
  'H22-C-02': 94,
  'H22-C-03': 45,
  'H22-C-04': 116,
  'H22-C-05': 209,
  'H22-C-06': 250,
  'H22-C-07': 96,
  'H22-C-08': 191,
  'H22-C-09': 82,
  'H22-C2-01': 102,
  'H22-C2-02': 87,
  'H22-C2-03': 141,
  'H22-C2-04': 96,
  'H22-C2-05': 191,
  'H22-C2-06': 168,
  'H22-C2-07': 317,
  'H22-C2-08': 110,
  'H22-C2-09': 104
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(catalog.candidateCount === 2478, `candidateCount: ${catalog.candidateCount}`);
assert(catalog.classifiedCount === 2477, `classifiedCount: ${catalog.classifiedCount}`);
assert(catalog.review.length === 1, `review: ${catalog.review.length}`);
assert(catalog.invalid.length === 0, `invalid: ${catalog.invalid.length}`);

for (const unit of catalog.units) {
  assert(unit.count === expected[unit.key], `${unit.key}: expected ${expected[unit.key]}, got ${unit.count}`);
  for (const paper of unit.papers) {
    assert(paper.count <= core.SCOPE.hardMaxQuestionsPerPaper, `${unit.key} paper ${paper.index} exceeds max`);
    assert(paper.snapshotKey === core.buildSnapshotKey(unit.key, paper.records, catalog.scope), `${unit.key} snapshot is not stable`);
  }
}

const recordsBySource = new Map();
for (const unit of catalog.units) {
  for (const record of unit.records) {
    if (!recordsBySource.has(record.sourceFile)) recordsBySource.set(record.sourceFile, []);
    recordsBySource.get(record.sourceFile).push(record);
  }
}

let sourceVerifiedCount = 0;
for (const [sourceFile, records] of recordsBySource) {
  const examContext = { window: {} };
  vm.createContext(examContext);
  const examPath = path.join(root, 'archive', 'exams', ...sourceFile.split('/'));
  assert(fs.existsSync(examPath), `source file missing: ${sourceFile}`);
  vm.runInContext(fs.readFileSync(examPath, 'utf8'), examContext);
  const questions = examContext.window.questionBank || examContext.window.questions;
  assert(Array.isArray(questions), `question array missing: ${sourceFile}`);
  const ids = new Set(questions.map(question => Number(question?.id)));
  for (const record of records) {
    assert(ids.has(record.sourceQuestionNo), `source question missing: ${sourceFile}#${record.sourceQuestionNo}`);
    sourceVerifiedCount += 1;
  }
}
assert(sourceVerifiedCount === catalog.classifiedCount, `source verified: ${sourceVerifiedCount}`);

const hyo = catalog.units.find(unit => unit.key === 'H22-C-06').records.find(record =>
  record.sourceFile.endsWith('/22_효천고_1학기_기말_고1_기출.js') && record.sourceQuestionNo === 12
);
assert(hyo, '효천고 1학기 기말 12번 override missing');

console.log(JSON.stringify({
  candidateCount: catalog.candidateCount,
  classifiedCount: catalog.classifiedCount,
  reviewCount: catalog.review.length,
  invalidCount: catalog.invalid.length,
  sourceVerifiedCount,
  units: Object.fromEntries(catalog.units.map(unit => [unit.key, { count: unit.count, papers: unit.papers.map(p => p.count) }]))
}, null, 2));
