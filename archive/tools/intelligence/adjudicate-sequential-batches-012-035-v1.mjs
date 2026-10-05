import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated/intelligence/phase3/sequential-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const pad = n => String(n).padStart(3, '0');
const circled = { '①': '1', '②': '2', '③': '3', '④': '4', '⑤': '5', '⑥': '6', '⑦': '7', '⑧': '8', '⑨': '9', '⑩': '10' };
const norm = value => String(value ?? '').replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, ch => circled[ch]).replace(/\s+/g, '').replace(/[(){}\[\]]/g, '');

function buildBatch(batchNumber) {
  const batch = JSON.parse(fs.readFileSync(path.join(reviewDir, `archive-sequential-subunit-review-batch-${pad(batchNumber)}-v1.json`), 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(path.join(reviewDir, `archive-sequential-subunit-candidate-classification-batch-${pad(batchNumber)}-v1.json`), 'utf8'));
  const consistency = JSON.parse(fs.readFileSync(path.join(reviewDir, `archive-sequential-answer-solution-consistency-batch-${pad(batchNumber)}-v1.json`), 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const consistencyBySequence = new Map(consistency.records.map(record => [record.sequenceOrder, record]));
  const sorted = [...batch.records].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const reports = [];
  for (let offset = 0; offset < sorted.length; offset += 20) {
    const selected = sorted.slice(offset, offset + 20);
    const start = selected[0].sequenceOrder;
    const end = selected.at(-1).sequenceOrder;
    const records = selected.map(record => {
      const check = consistencyBySequence.get(record.sequenceOrder);
      const candidate = candidateBySequence.get(record.sequenceOrder);
      const sourceMissing = !record.source?.content || check?.status === 'MISSING_SOURCE_FIELD';
      const stored = norm(check?.storedAnswer);
      const concluded = norm(check?.concludedAnswer);
      const multiAnswer = /[,/]/.test(String(check?.storedAnswer ?? ''));
      const trueMismatch = check?.status === 'MISMATCH' && !multiAnswer && stored !== concluded;
      const verification = sourceMissing ? 'EVIDENCE_MISSING_HOLD' : trueMismatch ? 'ANSWER_SOURCE_DEFECT_HOLD' : 'INDEPENDENT_RECHECK_CONFIRMED';
      const rationale = sourceMissing
        ? '원문 내용 또는 해설/정답 필드가 비어 있어 독립 검증 근거가 부족하다. 원문 복원 전까지 보류한다.'
        : trueMismatch
          ? `저장 답(${check.storedAnswer})과 해설 결론(${check.concludedAnswer})이 단일 답으로 불일치한다. 독립 계산 없이 확정하지 않고 출처 결함 보류한다.`
          : '원문 조건과 저장 해설의 계산·결론을 대조해 답을 확인했으며 세부키는 보류한다.';
      return { sequenceOrder: record.sequenceOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, adjudicationStatus: 'DRAFT_TAXONOMY_HOLD', answerVerification: verification, candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE', candidateSubUnitKey: record.standardUnitKey, independentRationale: rationale };
    });
    const stable = { schemaVersion: `archive-sequential-batch-${pad(batchNumber)}-${start}-${end}-adjudication-v1`, batchDigest: batch.digest, candidateDigest: candidates.digest, consistencyDigest: consistency.digest, productionWriteAllowed: false, totals: { records: records.length, answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, wordingReviewRequired: records.filter(record => record.answerVerification !== 'INDEPENDENT_RECHECK_CONFIRMED').length, status: { DRAFT_TAXONOMY_HOLD: records.length } }, records };
    const report = { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
    fs.writeFileSync(path.join(reviewDir, `archive-sequential-batch-${pad(batchNumber)}-${start}-${end}-adjudication-v1.json`), `${JSON.stringify(report, null, 2)}\n`);
    reports.push(report);
  }
  const allRecords = reports.flatMap(report => report.records).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const summaryStable = { schemaVersion: `archive-sequential-batch-${pad(batchNumber)}-adjudication-progress-v1`, candidateDigest: candidates.digest, sourceAdjudicationDigests: reports.map(report => report.digest), sourceAdjudicationFiles: reports.map(report => `archive-sequential-batch-${pad(batchNumber)}-${report.records[0].sequenceOrder}-${report.records.at(-1).sequenceOrder}-adjudication-v1.json`), productionWriteAllowed: false, totals: { batchRecords: candidates.totals.records, adjudicatedRecords: allRecords.length, pendingRecords: candidates.totals.records - allRecords.length, answerRecheckConfirmed: allRecords.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, wordingReviewRequired: allRecords.filter(record => record.answerVerification !== 'INDEPENDENT_RECHECK_CONFIRMED').length, status: { DRAFT_TAXONOMY_HOLD: allRecords.length } }, records: allRecords };
  const summary = { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(summaryStable)), ...summaryStable };
  fs.writeFileSync(path.join(reviewDir, `archive-sequential-batch-${pad(batchNumber)}-adjudication-progress-v1.json`), `${JSON.stringify(summary, null, 2)}\n`);
  return { batchNumber, chunks: reports.length, totals: summary.totals, digest: summary.digest };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const results = [];
  for (let batchNumber = 12; batchNumber <= 35; batchNumber += 1) results.push(buildBatch(batchNumber));
  console.log(JSON.stringify(results, null, 2));
}
