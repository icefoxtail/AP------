import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-1061-1080-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  1061: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '복소수의 정의와 i²=−1을 적용하면 옳은 설명은 5i의 허수부분 5인 ③임을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1062: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '(1−i)(2+2i)=4이므로 전체 −1+5i, a+b=4(⑤)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1063: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_RADICAL', '복소 제곱근의 주값에서 a+3≥0,a−3<0일 때만 양변 부호 관계가 성립해 정수 −3≤a<3, 총 6개(④)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1064: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_INTERSECTION', 'f의 근 −2,5가 x+1 변환으로 −3,4가 되어 곱 −12(①)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  1065: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '첫 판별식에서 k≥−9/2, 둘째에서 k<1, 정수 최댓값 0(②)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1066: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', 'i 주기 4로 4항 묶음이 2−2i, 12묶음 합 24−24i에서 a−b=48(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1067: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_TANGENCY', '접선 판별식의 k 항등식에서 a=3,b=−9/4, a+b=3/4(④)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  1068: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', 'f(x)−3이 α,β를 근으로 하므로 f=p(x²−2x+3)+3, f(1)=2에서 p=−1/2, f(5)=−6(②)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1069: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_GEOMETRY', 'EF: y=−4x/3+4, 직사각형 넓이 S=(8−t)(4t/3+4)의 꼭짓점 t=5/2에서 최댓값 121/3(⑤)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1070: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 'x²(x−1)−4(x−1)=(x−1)(x−2)(x+2)임을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1071: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', '몫=나머지=ax+b에서 P=(x²+1)(ax+b), P(−1)=0으로 b=a, P(1)=8로 a=2, P(2)=30을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1072: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '허수부분 x²−25=0에서 x=±5, 실수부분 검증으로 x=5만 비영 실수, 답 5를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1073: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', '축 x=2에서 최솟값 a−4, 더 먼 끝점 x=−2에서 최댓값 a+12, 곱 조건으로 a=−4를 확인했으나 H22-C-06 세부키는 보류한다.'],
  1074: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-REMAINDER_THEOREM', 'P(2)=8−4+2k+6=0에서 k=−5(①)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1075: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-ALGEBRAIC_IDENTITY', 'A=a+b+c,B=a−b로 정해져 A+B=2a+c(②)를 확인했으나 H22-C-01 세부키는 보류한다.'],
  1076: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', 'D/4=5−k<0에서 k>5, 정수 최솟값 6(⑤)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1077: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_DIVISION', '직접 나눗셈으로 몫 2x+5, 나머지 −3x+1인 ③을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1078: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '좌변=(3−x)+(2−y)i와 1+2i 비교로 x=2,y=0, 합 2(④)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1079: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', 'αβ(α+β)=(−7)(−5)=35이므로 ⑤를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1080: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 't=x²+4x 치환으로 (t+1)(t+2)−6=(t+4)(t−1)=(x+2)²(x²+4x−1), ①을 확인했으나 H22-C-03 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00410611080V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 1061 && record.sequenceOrder <= 1080).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-1061-1080-adjudication-v1',
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
  const report = adjudicateSequentialBatch00410611080V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
