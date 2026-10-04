import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queuePath = path.join(archiveDir, '_generated/intelligence/phase3/sequential-review/archive-sequential-subunit-review-queue-v1.json');
const outputPath = path.join(archiveDir, '_generated/intelligence/phase3/sequential-review/archive-sequential-subunit-review-batch-011-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function sourceLookup() {
  const lookup = new Map();
  for (const file of scanExamBank().files) {
    const sourceArchiveFile = file.sourceFile.replace(/^archive\/exams\//, '');
    for (const question of file.questions) lookup.set(`${sourceArchiveFile}#${question.originalIndex + 1}`, question);
  }
  return lookup;
}

function payload(source) {
  if (!source) return null;
  return { standardCourse: source.standardCourse ?? '', standardUnitKey: source.standardUnitKey ?? '', standardUnit: source.standardUnit ?? '', level: source.level ?? '', questionType: source.questionType ?? '', content: source.content ?? '', choices: Array.isArray(source.choices) ? source.choices : [], answer: source.answer ?? '', solution: source.solution ?? '', image: source.image ?? '', tags: Array.isArray(source.tags) ? source.tags : [] };
}

export function buildSequentialSubunitReviewBatch011FixedV1() {
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const lookup = sourceLookup();
  const queueRecords = queue.records.filter(record => record.reviewBatch === 11);
  let sourceJoinFailures = 0;
  const records = queueRecords.map(record => {
    const source = lookup.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    if (!source) sourceJoinFailures += 1;
    return { ...record, reviewStatus: 'PENDING_INDEPENDENT_REVIEW', source: payload(source) };
  });
  const stable = { schemaVersion: 'archive-sequential-subunit-review-batch-011-v1', queueDigest: queue.digest, batchNumber: 11, batchSize: queue.batchSize, productionWriteAllowed: false, totals: { records: records.length, sourceJoinFailures, pendingIndependentReview: records.length, checkpointConfirmations: 0, missingSourceContent: records.filter(record => !record.source?.content).length }, records };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildSequentialSubunitReviewBatch011FixedV1();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}
