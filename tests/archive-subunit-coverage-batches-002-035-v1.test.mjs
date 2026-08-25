import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('coverage batches 002-035 are complete and contiguous', () => {
  const dir = 'archive/_generated/intelligence/phase3/coverage-queue';
  let total = 0;
  let previousOrder = 300;
  for (let batch = 2; batch <= 35; batch += 1) {
    const pad = String(batch).padStart(3, '0');
    const report = JSON.parse(fs.readFileSync(`${dir}/archive-subunit-coverage-batch-${pad}-adjudication-v1.json`, 'utf8'));
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.records.length, report.totals.records);
    assert.ok(report.records.length === 300 || (batch === 35 && report.records.length === 8));
    for (const record of report.records) { assert.equal(record.reviewOrder, previousOrder + 1); previousOrder = record.reviewOrder; }
    total += report.records.length;
  }
  assert.equal(total, 9908);
  assert.equal(previousOrder, 10208);
});
