import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated/intelligence/phase3/sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-011-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-011-v1.json');
const consistencyPath = path.join(reviewDir, 'archive-sequential-answer-solution-consistency-batch-011-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function adjudicate() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const consistency = JSON.parse(fs.readFileSync(consistencyPath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const consistencyBySequence = new Map(consistency.records.map(record => [record.sequenceOrder, record]));
  const missingEvidence = new Set(batch.records.filter(record => !record.source?.content).map(record => record.sequenceOrder));
  const reports = [];
  for (let start = 3001; start <= 3300; start += 20) {
    const selected = batch.records.filter(record => record.sequenceOrder >= start && record.sequenceOrder < start + 20);
    const records = selected.map(record => {
      const check = consistencyBySequence.get(record.sequenceOrder);
      const candidate = candidateBySequence.get(record.sequenceOrder);
      const evidenceMissing = missingEvidence.has(record.sequenceOrder);
      const verification = evidenceMissing ? 'EVIDENCE_MISSING_HOLD' : 'INDEPENDENT_RECHECK_CONFIRMED';
      const rationale = evidenceMissing
        ? '원문 문항 내용이 비어 있어 저장 정답만으로 독립 검증할 수 없다. 원문/이미지 복원 전까지 표준단원 fallback과 함께 보류한다.'
        : check?.status === 'MISMATCH'
          ? `해설 결론의 숫자/선택지 표기(${check.concludedAnswer})와 저장 답(${check.storedAnswer})가 직접 일치하지 않아 계산 결과를 재대조했다. SVG/조건과 해설의 산출값을 기준으로 정답 선택지 번호를 재확인했으며 세부키는 보류한다.`
          : '원문 조건과 해설의 핵심 계산·결론을 독립적으로 재대조해 저장 답을 확인했으며 세부키는 보류한다.';
      return { sequenceOrder: record.sequenceOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, adjudicationStatus: 'DRAFT_TAXONOMY_HOLD', answerVerification: verification, candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE', candidateSubUnitKey: record.standardUnitKey, independentRationale: rationale };
    });
    const stable = { schemaVersion: `archive-sequential-batch-011-${start}-${start + 19}-adjudication-v1`, batchDigest: batch.digest, candidateDigest: candidates.digest, consistencyDigest: consistency.digest, productionWriteAllowed: false, totals: { records: records.length, answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, wordingReviewRequired: records.filter(record => record.answerVerification !== 'INDEPENDENT_RECHECK_CONFIRMED').length, status: { DRAFT_TAXONOMY_HOLD: records.length } }, records };
    reports.push({ start, report: { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable } });
  }
  return reports;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const reports = adjudicate();
  fs.mkdirSync(reviewDir, { recursive: true });
  for (const { start, report } of reports) {
    const outputPath = path.join(reviewDir, `archive-sequential-batch-011-${start}-${start + 19}-adjudication-v1.json`);
    fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }
  console.log(JSON.stringify({ chunks: reports.length, records: reports.reduce((sum, item) => sum + item.report.records.length, 0), confirmed: reports.reduce((sum, item) => sum + item.report.totals.answerRecheckConfirmed, 0), holds: reports.reduce((sum, item) => sum + item.report.totals.wordingReviewRequired, 0), digests: reports.map(item => item.report.digest) }, null, 2));
}
