import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-981-1000-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  981: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-VOLUME', 'ab=3,bc=9,ca=27을 곱해 abc=27을 얻고 (a,b,c)=(3,1,9), 합 13(⑤)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  982: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_OPERATION', 'x=1,−1 대입으로 p=32,q=−32, 짝·홀 계수합 r=0,s=32, a₁₀−a₀=2를 얻어 합 34(②)를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  983: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_GEOMETRY', '직각삼각형 내접 직사각형의 관계 y=10−(5/4)x에서 밑면 넓이 최댓값 20, 높이 24를 곱해 480(③)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  984: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', 'DP/4=2a−1,DQ/4=2a+1을 비교해 ㄱ만 항상 참이므로 ①을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  985: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-PARTIAL_FRACTION', '항등식 계수비교로 (a,b,c)=(3,−2,2), 합 3을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  986: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', 'z=(a−2)(a+2)+(a+1)(a+2)i에서 비영 실수 조건 p=−1, 순허수 조건 q=2, p+q=1을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  987: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', '두 판별식 조건 k<−9, k>1/2의 합집합을 취해 답을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  988: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_INTERSECTION', '서로 다른 교점 조건 k<a−3/4와 자연수 k를 적용해 《1》=0,《2》=1,《3》=2,《4》=3, 값 2/3을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  989: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_CONJUGATE', '−5−3i의 켤레는 −5+3i이므로 ①을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  990: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-ALGEBRAIC_IDENTITY', '(x+2)(x²−2x+4)=x³+8이므로 ⑤를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  991: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', '−A+2B−(−2A+3B)=A−B=xy이므로 ③을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  992: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', '(2+i)−(−3i)=2+4i이므로 ④를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  993: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_INTERSECTION', 'x²−x+1의 판별식 −3<0이므로 x축 교점은 0개, ①을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  994: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', 'P(1)=5로 a=1, P(2)=7이므로 ②를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  995: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', '(x+1)(x²−2x+3)의 x² 계수 −2+1=−1, 즉 ①을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  996: ['DRAFT_TAXONOMY_HOLD', 'RAW-다항식의성질', 'f(1)=24, 상수항 f(0)=−3이므로 상수항을 제외한 계수합 24−(−3)=27(⑤)을 확인했으나 세부키는 보류한다.'],
  997: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-POLYNOMIAL_FACTOR', 'N=(29+1)²(29−7)=2³·3²·5²·11의 약수 개수 72(④)를 확인했으나 H15-SA-03 세부키는 보류한다.'],
  998: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', '(a+i)/(3+2i)의 실수·허수부분 합이 (a+5)/13=1이므로 a=8, ⑤를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  999: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_IDENTITY', '판별식 항등식에서 a=−2,b=−4를 얻어 a−b=2, 즉 ④를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  1000: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_REMAINDER', 'R(1)=R(2)=2,R(3)=4인 2차 이하 R을 복원해 R=x²−3x+4, R(−1)=8(①)을 확인했으나 H15-SA-02 세부키는 보류한다.']
};

export function adjudicateSequentialBatch004981000V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 981 && record.sequenceOrder <= 1000).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-981-1000-adjudication-v1',
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
  const report = adjudicateSequentialBatch004981000V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
