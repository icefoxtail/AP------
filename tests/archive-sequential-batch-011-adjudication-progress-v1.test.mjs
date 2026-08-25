import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { summarizeSequentialBatch011AdjudicationV1 } from '../archive/tools/intelligence/summarize-sequential-batch-011-adjudication-v1.mjs';
test('batch 011 summary is complete', () => {
  const report = summarizeSequentialBatch011AdjudicationV1();
  assert.equal(report.productionWriteAllowed, false);
  assert.deepEqual(report.totals, { batchRecords: 300, adjudicatedRecords: 300, pendingRecords: 0, answerRecheckConfirmed: 299, wordingReviewRequired: 1, status: { DRAFT_TAXONOMY_HOLD: 300 } });
  assert.equal(report.records[0].sequenceOrder, 3001);
  assert.equal(report.records.at(-1).sequenceOrder, 3300);
  const outputPath = 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-011-adjudication-progress-v1.json';
  if (fs.existsSync(outputPath)) assert.equal(JSON.parse(fs.readFileSync(outputPath, 'utf8')).digest, report.digest);
});
