import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-1081-1100-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  1081: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_INTERSECTION', '교점 방정식 3x²−14x−17=0에서 a+b=14/3=β/α, α=3,β=14이므로 합 17(④)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1082: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_IDENTITY', 'y=2x+2k 대입 후 계수비교로 a=−2,k=−3, ak=6(④)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1083: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '중근 판별식 −2k²−12k+7=0의 두 실근 합 −6(③)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1084: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', '허근 ω에 대해 ω̄=ω², 1+ω²=−ω,1+ω=−ω²를 사용하면 식은 −1(②)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1085: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-SYSTEM_EQUATION', 'xy=2에서 x+y=6, 두 수 3±√7의 순서를 비교해 2x−y 최솟값 3−3√7(①)을 확인했으나 H22-C-07 세부키는 보류한다.'],
  1086: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', 'Q=(x+1)²−2=x²+2x−1, P=(x−1)Q+3에서 P(2)=10(⑤)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1087: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'z=(1−i)/√2, z⁸=1이고 24항 주기합에 초기 1을 더해 전체 1(②)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1088: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_TANGENCY', '실계수 근 1±2i에서 a=2,b=−5, 접선 조건 k=27, 중근 α=−5, k+4α=7(④)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1089: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '중근 조건 n=m²/4와 두 번째 판별식 n²−4m>0을 결합해 짝수 m={−8,−6,−4,−2,6,8}, 순서쌍 6개(③)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1090: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_GEOMETRY', '삼각형 높이 3, 직사각형 S=x·(4/3)(3−x)의 꼭짓점 x=3/2에서 최댓값 3(①)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1091: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', 'Q(0)=Q(2)=0인 monic 이차식 Q=x(x−2), P=2x³+8x, Q(x+2)=x²+2x로 나눈 나머지 16x, R(1)=16(⑤)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1092: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'w=1+√3i의 실수 거듭제곱 조건 3|n과 √5 분모 조건 2|n에서 a=15, norm 조건을 만족하는 6의 배수는 12 하나라 b=1, a−b=14(③)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1093: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_REMAINDER', 'R=ax+b에 f(1)=0,f(3)=2를 대입해 R=x−1을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1094: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 'h(t)=0의 양의 해 (2+√14)/5, [0,1]에서 꼭짓점 최댓값 14/5와 끝점 최솟값 1을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1095: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 'f(−2)=0으로 (x+2)(x²−2x+2), 근 −2,1±i 및 복소 인수분해를 확인했으나 H22-C-03 세부키는 보류한다.'],
  1096: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-SYSTEM_EQUATION', '첫 식 (x−3y)(x−y+2)=0으로 분기해 첫 branch 2해, 둘째 branch가 중근이 되는 k²=1, k>0에서 k=1을 확인했으나 H22-C-07 세부키는 보류한다.'],
  1097: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_OPERATION', '전개식 x⁴+(3−a)x³−2ax²+3ax에서 3−a=−2a, a=−3(①)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1098: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-REMAINDER_THEOREM', 'f(−2)=3에서 (x²f)(−2)=4·3=12(②)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1099: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_IDENTITY', 'k 항등식 계수비교로 a=1,b=−2, a−b=3(③)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1100: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-ALGEBRAIC_IDENTITY', '④의 우변 전개는 x⁴+x²+1로 좌변 x⁴−x²+1과 달라 인수분해가 옳지 않음을 확인했으나 H22-C-03 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00410811100V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 1081 && record.sequenceOrder <= 1100).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-1081-1100-adjudication-v1',
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
  const report = adjudicateSequentialBatch00410811100V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
