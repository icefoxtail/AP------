import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queuePath = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue/archive-subunit-coverage-queue-v1.json');
const dir = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue');
const outputPath = path.join(dir, 'archive-subunit-coverage-all-progress-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const pad = n => String(n).padStart(3, '0');

export function summarizeSubunitCoverageAllV1() {
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const reports = [];
  for (let batch = 1; batch <= 35; batch += 1) reports.push(JSON.parse(fs.readFileSync(path.join(dir, `archive-subunit-coverage-batch-${pad(batch)}-adjudication-v1.json`), 'utf8')));
  const records = reports.flatMap(report => report.records).sort((a, b) => a.reviewOrder - b.reviewOrder);
  const disposition = {}; const subUnits = {};
  for (const record of records) { disposition[record.disposition] = (disposition[record.disposition] ?? 0) + 1; if (record.proposedSubUnitKey) subUnits[record.proposedSubUnitKey] = (subUnits[record.proposedSubUnitKey] ?? 0) + 1; }
  const gaps = []; for (let i = 0; i < records.length; i += 1) if (records[i].reviewOrder !== i + 1) gaps.push({ expected: i + 1, actual: records[i].reviewOrder });
  const stable = { schemaVersion: 'archive-subunit-coverage-all-progress-v1', queueDigest: queue.digest, productionWriteAllowed: false, scope: { queueRecords: queue.coverage.unresolvedRecords, processedRecords: records.length, firstReviewOrder: records[0]?.reviewOrder ?? null, lastReviewOrder: records.at(-1)?.reviewOrder ?? null, batchCount: reports.length }, gates: { sequenceContinuity: gaps.length === 0, allBatchesPresent: reports.length === 35, productionWrites: false }, totals: { disposition: Object.fromEntries(Object.entries(disposition).sort(([a], [b]) => a.localeCompare(b, 'en'))), pilotCandidates: disposition.PILOT_CANDIDATE ?? 0, reviewRequired: (disposition.PILOT_REVIEW_REQUIRED ?? 0) + (disposition.EVIDENCE_MISSING_HOLD ?? 0), fallbackRecords: disposition.STANDARD_UNIT_FALLBACK ?? 0 }, proposedSubUnits: Object.fromEntries(Object.entries(subUnits).sort(([a], [b]) => a.localeCompare(b, 'en'))), batchDigests: reports.map(report => ({ batch: report.schemaVersion, digest: report.digest, totals: report.totals })), sequenceGaps: gaps };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = summarizeSubunitCoverageAllV1();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, scope: report.scope, gates: report.gates, totals: report.totals }, null, 2));
}
