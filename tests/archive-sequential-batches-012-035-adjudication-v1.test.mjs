import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('batches 012-035 are fully covered in sequence', () => {
  const dir = 'archive/_generated/intelligence/phase3/sequential-review';
  let total = 0;
  for (let batch = 12; batch <= 35; batch += 1) {
    const pad = String(batch).padStart(3, '0');
    const summary = JSON.parse(fs.readFileSync(`${dir}/archive-sequential-batch-${pad}-adjudication-progress-v1.json`, 'utf8'));
    assert.equal(summary.productionWriteAllowed, false);
    assert.equal(summary.totals.pendingRecords, 0);
    assert.equal(summary.totals.adjudicatedRecords, summary.totals.batchRecords);
    assert.equal(summary.records.length, summary.totals.batchRecords);
    for (let i = 1; i < summary.records.length; i += 1) assert.equal(summary.records[i].sequenceOrder, summary.records[i - 1].sequenceOrder + 1);
    total += summary.records.length;
  }
  assert.equal(total, 7198);
});
