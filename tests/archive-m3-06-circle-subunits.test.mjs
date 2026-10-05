import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archive = path.join(root, 'archive');
const allowed = new Map([
  ['M3-06-CIRCLE_LINE', '원과 직선'],
  ['M3-06-CIRCLE_INSCRIBED_ANGLE', '원주각'],
]);

function loadQuestionBank(sourceArchiveFile) {
  const file = path.join(archive, 'exams', sourceArchiveFile);
  const context = { window: {}, console };
  context.globalThis = context.window;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: sourceArchiveFile, timeout: 3000 });
  const bank = context.window.questionBank || context.window.questions;
  assert.ok(Array.isArray(bank), `question bank missing: ${sourceArchiveFile}`);
  return bank;
}

test('M3-06 has exactly two canonical subunits with source and metadata parity', () => {
  const metadata = JSON.parse(fs.readFileSync(path.join(archive, 'data/question_metadata.json'), 'utf8'));
  const records = metadata.records.filter(record => record.standardUnitKey === 'M3-06');
  const counts = {};
  const sourceBanks = new Map();

  for (const record of records) {
    if (!sourceBanks.has(record.sourceArchiveFile)) sourceBanks.set(record.sourceArchiveFile, loadQuestionBank(record.sourceArchiveFile));
    const question = sourceBanks.get(record.sourceArchiveFile)[Number(record.sourceOrdinal) - 1];
    assert.ok(question, `source question missing: ${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    assert.equal(question.standardUnitKey, 'M3-06');
    assert.ok(allowed.has(question.subUnitKey));
    assert.equal(question.subUnit, allowed.get(question.subUnitKey));
    assert.equal(record.subUnitKey, question.subUnitKey);
    assert.equal(record.subUnit, question.subUnit);
    counts[record.subUnitKey] = (counts[record.subUnitKey] || 0) + 1;
  }

  assert.equal(records.length, 320);
  assert.deepEqual(counts, {
    'M3-06-CIRCLE_INSCRIBED_ANGLE': 188,
    'M3-06-CIRCLE_LINE': 132,
  });
  assert.equal(new Set(records.map(record => record.questionUid)).size, records.length);
  assert.equal(new Set(records.map(record => `${record.sourceArchiveFile}#${record.sourceOrdinal}`)).size, records.length);
  assert.equal(records.filter(record => !record.subUnitKey || !record.subUnit).length, 0);
});

test('M3-06 runtime core filters by exact subUnitKey', () => {
  const metadata = JSON.parse(fs.readFileSync(path.join(archive, 'data/question_metadata.json'), 'utf8'));
  const records = metadata.records.filter(record => record.standardUnitKey === 'M3-06');
  const context = { window: {}, console };
  context.globalThis = context.window;
  vm.runInNewContext(fs.readFileSync(path.join(archive, 'unit-past-exams-core.js'), 'utf8'), context, { timeout: 3000 });
  const core = context.window.UnitPastExamsCore;
  assert.ok(core);
  const options = core.getSubUnitOptions(records);
  assert.deepEqual(JSON.parse(JSON.stringify(options.map(option => [option.key, option.label, option.count]).sort())), [
    ['M3-06-CIRCLE_INSCRIBED_ANGLE', '원주각', 188],
    ['M3-06-CIRCLE_LINE', '원과 직선', 132],
  ].sort());
  assert.equal(core.filterUnitRecords(records, { subUnitKeys: ['M3-06-CIRCLE_LINE'] }).length, 132);
  assert.equal(core.filterUnitRecords(records, { subUnitKeys: ['M3-06-CIRCLE_INSCRIBED_ANGLE'] }).length, 188);
  assert.equal(core.filterUnitRecords(records, { subUnitKeys: ['M3-06-CIRCLE_LINE', 'M3-06-CIRCLE_INSCRIBED_ANGLE'] }).length, 320);
});
