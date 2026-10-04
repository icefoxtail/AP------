import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const archiveDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const reviewDir = path.join(archiveDir, '_generated/intelligence/phase3/sequential-review');
const queuePath = path.join(reviewDir, 'archive-sequential-subunit-review-queue-v1.json');
const cuePath = path.join(archiveDir, 'data/master_tables/sequential_first_batch_candidate_cues_v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/[${}^_\\]/g, ' ').replace(/\s+/g, ' ').trim();
const extractConclusion = solution => [...String(solution ?? '').matchAll(/(?:정답|답)\s*(?:은|는|이|:)?\s*([①②③④⑤⑥⑦⑧⑨⑩]|\d+)/g)].at(-1)?.[1] ?? '';

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
function prepareBatch(queue, lookup, batchNumber) {
  const queueRecords = queue.records.filter(record => record.reviewBatch === batchNumber);
  const records = queueRecords.map(record => ({ ...record, reviewStatus: 'PENDING_INDEPENDENT_REVIEW', source: payload(lookup.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`)) }));
  const stable = { schemaVersion: `archive-sequential-subunit-review-batch-${String(batchNumber).padStart(3, '0')}-v1`, queueDigest: queue.digest, batchNumber, batchSize: queue.batchSize, productionWriteAllowed: false, totals: { records: records.length, sourceJoinFailures: records.filter(record => !record.source).length, pendingIndependentReview: records.length, checkpointConfirmations: 0, missingSourceContent: records.filter(record => !record.source?.content).length }, records };
  const packet = { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
  fs.writeFileSync(path.join(reviewDir, `archive-sequential-subunit-review-batch-${String(batchNumber).padStart(3, '0')}-v1.json`), `${JSON.stringify(packet, null, 2)}\n`);
  const cues = JSON.parse(fs.readFileSync(cuePath, 'utf8'));
  const candidateRecords = records.map(record => ({ sequenceOrder: record.sequenceOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, standardUnitKey: record.standardUnitKey, standardUnit: record.standardUnit, currentClassificationDepth: record.classificationDepth, candidateStatus: 'UNRESOLVED', candidateSubUnitKey: '', candidateSubUnit: '', candidateConfidence: 'none', evidence: { contentCueHits: [], solutionCueHits: [], rankedCandidates: [], rationale: '자동 후보는 미확정으로 두고 독립 대조를 우선한다.' }, reviewStatus: 'PENDING_INDEPENDENT_REVIEW' }));
  const candidateStable = { schemaVersion: `archive-sequential-subunit-candidate-classification-batch-${String(batchNumber).padStart(3, '0')}-v1`, batchDigest: packet.digest, cueDigest: sha256(JSON.stringify(cues)), productionWriteAllowed: false, totals: { records: candidateRecords.length, candidateStatus: { UNRESOLVED: candidateRecords.length }, candidateAssignments: 0, independentReviewPending: candidateRecords.length }, records: candidateRecords };
  const candidate = { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(candidateStable)), ...candidateStable };
  fs.writeFileSync(path.join(reviewDir, `archive-sequential-subunit-candidate-classification-batch-${String(batchNumber).padStart(3, '0')}-v1.json`), `${JSON.stringify(candidate, null, 2)}\n`);
  const consistencyRecords = records.map(record => { const storedAnswer = String(record.source?.answer ?? '').trim(); const concludedAnswer = extractConclusion(record.source?.solution ?? ''); const status = !storedAnswer || !record.source?.solution ? 'MISSING_SOURCE_FIELD' : !concludedAnswer ? 'NO_EXPLICIT_CONCLUSION' : concludedAnswer === storedAnswer ? 'MATCH' : 'MISMATCH'; return { sequenceOrder: record.sequenceOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, storedAnswer, concludedAnswer, status, independentSolveRequired: true }; });
  const statusCounts = {}; for (const record of consistencyRecords) statusCounts[record.status] = (statusCounts[record.status] ?? 0) + 1;
  const consistencyStable = { schemaVersion: `archive-sequential-answer-solution-consistency-batch-${String(batchNumber).padStart(3, '0')}-v1`, batchDigest: packet.digest, productionWriteAllowed: false, totals: { records: consistencyRecords.length, status: Object.fromEntries(Object.entries(statusCounts).sort(([a], [b]) => a.localeCompare(b, 'en'))) }, records: consistencyRecords };
  const consistency = { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(consistencyStable)), ...consistencyStable };
  fs.writeFileSync(path.join(reviewDir, `archive-sequential-answer-solution-consistency-batch-${String(batchNumber).padStart(3, '0')}-v1.json`), `${JSON.stringify(consistency, null, 2)}\n`);
  return { batchNumber, records, packet, candidate, consistency };
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const lookup = sourceLookup();
const outputs = [];
for (let batchNumber = 12; batchNumber <= 35; batchNumber += 1) outputs.push(prepareBatch(queue, lookup, batchNumber));
console.log(JSON.stringify(outputs.map(item => ({ batchNumber: item.batchNumber, records: item.records.length, packetDigest: item.packet.digest, consistency: item.consistency.totals })), null, 2));
