import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated/intelligence/phase3/sequential-review');
const reconciliationPath = path.join(archiveDir, '_generated/intelligence/phase3/baseline-reconciliation/archive-baseline-reconciliation-v1.json');
const queuePath = path.join(reviewDir, 'archive-sequential-subunit-review-queue-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-codeification-final-audit-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const pad = n => String(n).padStart(3, '0');

export function auditSequentialCodeificationV1() {
  const reconciliation = JSON.parse(fs.readFileSync(reconciliationPath, 'utf8'));
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const summaries = [];
  for (let batch = 1; batch <= 35; batch += 1) summaries.push(JSON.parse(fs.readFileSync(path.join(reviewDir, `archive-sequential-batch-${pad(batch)}-adjudication-progress-v1.json`), 'utf8')));
  const records = summaries.flatMap(summary => summary.records).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const verification = records.reduce((counts, record) => { counts[record.answerVerification] = (counts[record.answerVerification] ?? 0) + 1; return counts; }, {});
  const adjudication = records.reduce((counts, record) => { counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1; return counts; }, {});
  const sequenceGaps = [];
  for (let i = 0; i < records.length; i += 1) if (records[i].sequenceOrder !== i + 1) sequenceGaps.push({ index: i, expected: i + 1, actual: records[i].sequenceOrder });
  const stable = {
    schemaVersion: 'archive-sequential-codeification-final-audit-v1',
    reconciliationDigest: reconciliation.digest,
    queueDigest: queue.digest,
    productionWriteAllowed: false,
    scope: { frozenBaselineFiles: reconciliation.totals.reconciledScannedFiles, frozenBaselineQuestions: reconciliation.totals.reconciledScannedQuestions, excludedPostCheckpointFiles: reconciliation.totals.postCheckpointFiles, excludedPostCheckpointQuestions: reconciliation.totals.postCheckpointQuestions, eligibleQueueRecords: queue.scope.eligibleRecords, adjudicatedRecords: records.length },
    gates: { baselineIdentityFailures: reconciliation.totals.reconciledIdentityFailures, sequenceContinuity: sequenceGaps.length === 0, allBatchesComplete: summaries.every(summary => summary.totals.pendingRecords === 0), productionWrites: false },
    totals: { answerVerification: Object.fromEntries(Object.entries(verification).sort(([a], [b]) => a.localeCompare(b, 'en'))), adjudicationStatus: Object.fromEntries(Object.entries(adjudication).sort(([a], [b]) => a.localeCompare(b, 'en'))), taxonomyHoldRecords: records.filter(record => record.adjudicationStatus === 'DRAFT_TAXONOMY_HOLD').length },
    batchSummaries: summaries.map(summary => ({ schemaVersion: summary.schemaVersion, digest: summary.digest, totals: summary.totals })),
    sequenceGaps,
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = auditSequentialCodeificationV1();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, scope: report.scope, gates: report.gates, totals: report.totals }, null, 2));
}
