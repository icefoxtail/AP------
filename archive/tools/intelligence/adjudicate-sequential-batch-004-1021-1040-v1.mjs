import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-1021-1040-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  1021: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', '주어진 관계식만으로 b²=−4(a−4)²+64, 0<a<8에서 최댓값 64(⑤)를 독립 확인했으나 H22-C-06 세부키는 보류한다.'],
  1022: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 'f(−2)=f(4)에서 계수 a=4, 최댓값 조건으로 b=6, [4,6]에서 값의 차 32(③)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  1023: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'z, z̄는 t²+t+1=0의 근이고 z³=1이므로 2025개 거듭제곱 합은 0(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1024: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_FACTOR', '공통 일차인수를 두고 A+B=2(x−3)², A(1)=0을 적용해 p=(x−3)(x−1)(x−5), p(2)=3(②)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1025: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-PIECEWISE_QUADRATIC', 'g=f−x의 두 가지 포물선 교점 수를 분석하면 유일한 3근 조건 (a−1)²=8b, 세 근 합 −(a−1)/2=−4에서 a=9,b=8, a+b=17(④)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1026: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_REMAINDER', '나머지 R=ax+b에 x=1,2를 대입해 R=2x+5, R(3)=11을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1027: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '중근 조건 b=a²와 두 번째 방정식의 실근 조건 b<16에서 a=1,2,3만 가능, m+n=3+(1+4+9)=17을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1028: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_GEOMETRY', '교점 근 α+β=−2, αβ=−m/2이고 넓이 합으로 α²+β²=16을 얻어 m=12를 확인했으나 H22-C-06 세부키는 보류한다.'],
  1029: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'n=2,3 조건의 연립으로 α²+α+1=β²+β+1=0, 두 근은 (−1±√3i)/2이고 2025항 합은 0임을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1030: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_TANGENCY', '접선 판별식의 m 항등식 계수비교로 a=−2,b=−1,c=−1/8을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1031: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_IDENTITY', '항등식 계수비교로 b=2,a=7, 합 9(⑤)를 확인했으나 H22-C-01 세부키는 보류한다.'],
  1032: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-ALGEBRAIC_IDENTITY', '8x³+36x²+54x+27=(2x+3)³에서 ab=6(③)을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1033: ['EVIDENCE_MISSING_HOLD', 'H22-C-01-POLYNOMIAL_DIVISION', '조립제법 도식과 원래 다항식 계수가 패킷에 누락되어 해설의 a=−1,b=0을 독립 재현할 수 없다.'],
  1034: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-REMAINDER_THEOREM', 'P(−1)=12에서 −1+27+1+k=12, k=−15(②)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1035: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 'y=−(x−1)²+4를 [−2,0]에 제한해 최댓값 3, 최솟값 −5, 합 −2(③)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  1036: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_DIVISION', '3x²−5x+6=(x−1)(3x−2)+4에서 a+b=3+4=7(⑤)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1037: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_REMAINDER', 'R(1)=7,R(3)=−9인 R=ax+b를 풀어 R=−8x+15, R(5)=−25(②)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1038: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-ALGEBRAIC_IDENTITY', 'x²+y²=(x−y)²+2xy에 12,3을 대입해 xy=3/2(②)를 확인했으나 H22-C-01 세부키는 보류한다.'],
  1039: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_OPERATION', 'A=[[2,−1],[3,5]]를 계산해 ㄱ·ㄴ만 참, ③을 확인했으나 H22-C-09 세부키는 보류한다.'],
  1040: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '짝수 판별식 −4k+32≥0에서 양의 정수 k=1,…,8, 개수 8(①)을 확인했으나 H22-C-05 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00410211040V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 1021 && record.sequenceOrder <= 1040).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-1021-1040-adjudication-v1',
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
  const report = adjudicateSequentialBatch00410211040V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
