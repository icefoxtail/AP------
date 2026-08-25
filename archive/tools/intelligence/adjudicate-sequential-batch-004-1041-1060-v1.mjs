import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-1041-1060-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  1041: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', 'i의 거듭제곱 주기로 각 항을 계산해 합 4+4i, a−b=0(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1042: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_CONJUGATE', 'z̄=1+2i이므로 z+z̄=2(②)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1043: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_OPERATION', '쌍을 지어 (x²+2x−8)(x²+2x−3)을 전개하면 x³ 계수 4, x² 계수 −7, 합 −3(①)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1044: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', '새 근의 합 1/2, 곱 −1에서 a=−1/2,b=−1, a−b=1/2(②)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1045: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_REDUCTION', 'x²+2x=1을 이용해 식을 x²+2x+5=6으로 낮춰 ④를 확인했으나 H22-C-01 세부키는 보류한다.'],
  1046: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', '겉넓이 S=6x²+8x−2는 x≥1에서 증가하므로 S(1)=12(②)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  1047: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_OPERATION', 'x=p+1,y=11로 x+y+p=2p+12, 50 이하 조건 p≤49의 최대 소수 47에서 106(④)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  1048: ['EVIDENCE_MISSING_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 'P(x),Q(x)의 원래 정의·조건이 패킷에 누락되어 해설의 (x−2)(x−3),(x−1)(x−4) 추정을 독립 확인할 수 없다.'],
  1049: ['EVIDENCE_MISSING_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', 'k에 의존하는 원래 이차방정식이 패킷에 누락되어 해설의 판별식 (a−2)k+(4−b)를 독립 확인할 수 없다.'],
  1050: ['EVIDENCE_MISSING_HOLD', 'H22-C-05-QUADRATIC_GEOMETRY', '도형 또는 지름 AB의 길이 20 근거가 패킷에 누락되어 AP+PB=20을 독립 확인할 수 없다.'],
  1051: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 't=x²−4x+6∈[2,6], y=(t−a)²+1의 구간 최솟값이 5가 되는 a=0,8을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1052: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_IDENTITY', '계수비교로 a=1,b=0,c=3, 합 4(④)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1053: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-REMAINDER_THEOREM', '나머지정리 P(1)=2로 ②를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1054: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', '조립제법에서 a=−1,b=0이므로 a+b=−1(③)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1055: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 'P(2)≠0이고 나머지 보기 값에서는 P(k)=0이므로 인수가 아닌 x−2, ③을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1056: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_REMAINDER', 'P=(x−1)Q+4, Q(2)=1에서 P(2)=5(⑤)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1057: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-ALGEBRAIC_IDENTITY', 'x²+y²=−1,x³+y³=−2를 곱하고 교차항 1을 보정해 x⁵+y⁵=1(①)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1058: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_FACTOR', 'P(1)=0 및 몫의 x=1 조건으로 a=−100,b=99, b−a=199(②)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1059: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-REMAINDER_THEOREM', '50≡1 (mod 49)이므로 50³⁰+3≡4, ④를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1060: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'α²=α−1, α³=−1, α⁴=−α를 대입해 (k−1)(α−1)=0, k=1(①)을 확인했으나 H22-C-04 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00410411060V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 1041 && record.sequenceOrder <= 1060).map(record => {
    const decision = manualDecisions[record.sequenceOrder];
    if (!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate = candidateBySequence.get(record.sequenceOrder);
    const hold = decision[0] !== 'DRAFT_TAXONOMY_HOLD';
    return {
      sequenceOrder: record.sequenceOrder,
      questionUid: record.questionUid,
      sourceArchiveFile: record.sourceArchiveFile,
      sourceOrdinal: record.sourceOrdinal,
      adjudicationStatus: decision[0],
      answerVerification: hold ? decision[0] : 'INDEPENDENT_RECHECK_CONFIRMED',
      candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE',
      candidateSubUnitKey: decision[1],
      independentRationale: decision[2]
    };
  });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = {
    schemaVersion: 'archive-sequential-batch-004-1041-1060-adjudication-v1',
    batchDigest: batch.digest,
    candidateDigest: candidates.digest,
    productionWriteAllowed: false,
    totals: {
      records: records.length,
      answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length,
      wordingReviewRequired: records.filter(record => record.answerVerification !== 'INDEPENDENT_RECHECK_CONFIRMED').length,
      status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')))
    },
    records
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
  const report = adjudicateSequentialBatch00410411060V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
