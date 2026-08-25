import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { execFileSync } from 'node:child_process';

test('batch 011 sequential adjudication covers 300 records in order', () => {
  execFileSync(process.execPath, ['archive/tools/intelligence/adjudicate-sequential-batch-011-all-v1.mjs'], { encoding: 'utf8' });
  const dir = 'archive/_generated/intelligence/phase3/sequential-review';
  const names = fs.readdirSync(dir).filter(name => /^archive-sequential-batch-011-\d+-\d+-adjudication-v1\.json$/.test(name)).sort((a, b) => Number(a.match(/011-(\d+)-/)[1]) - Number(b.match(/011-(\d+)-/)[1]));
  assert.equal(names.length, 15);
  const records = names.flatMap(name => JSON.parse(fs.readFileSync(`${dir}/${name}`, 'utf8')).records).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  assert.equal(records.length, 300);
  assert.equal(records[0].sequenceOrder, 3001);
  assert.equal(records.at(-1).sequenceOrder, 3300);
  assert.equal(new Set(records.map(record => record.sequenceOrder)).size, 300);
  assert.equal(records.filter(record => record.answerVerification === 'EVIDENCE_MISSING_HOLD').length, 1);
  assert.equal(records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, 299);
  assert.ok(records.every(record => record.adjudicationStatus === 'DRAFT_TAXONOMY_HOLD'));
});
