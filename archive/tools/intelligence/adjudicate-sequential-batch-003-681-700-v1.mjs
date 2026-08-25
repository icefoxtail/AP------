import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-681-700-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  681: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-ABSOLUTE_INEQUALITY', '절댓값 부등식을 -7<x−2<7로 바꾸어 -5<x<9, 정수 13개(③)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  682: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', '근의 곱 3b=-15와 근의 합 3+b=-a를 적용해 a=2,b=-5, a+b=-3(③)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  683: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_OPERATION', '두 기저벡터의 상으로 A의 두 열을 복원한 뒤 A(1,3)=(7,−4), 성분 곱 −28(①)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  684: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY', '절댓값 부등식 해와 이차부등식 해의 교집합 정수 −2,−1,0,1,2,3을 구해 합 3(③)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  685: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_POWER', 'A+B=[[1,0],[4,1]]의 n제곱이 [[1,0],[4n,1]]임을 확인해 성분합 34에서 n=8(④)을 재검산했으나 H22-C-09 세부키는 보류한다.'],
  686: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-FUNCTION_COMPOSITION', 't=x²−2x의 범위 [-1,3]로 치환해 y=(t−1)²−9의 최댓값 -5, 최솟값 -9, 차 4(④)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  687: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_INEQUALITY_PARAMETER', 'x=-1 대입으로 a≥−1을 얻고 a=−1에서 식이 (x+1)²이 되어 최솟값 −1(①)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  688: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-ABSOLUTE_FUNCTION', 't=|x|∈[0,4]로 두어 y=2(t−1)²−5의 최솟값 −5와 최댓값 13, 합 8(②)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  689: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_WITH_RESTRICTION', '자음 네 자리 선택 C(6,4)=15와 모음 순서 2!을 곱해 30(⑤)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  690: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_OPERATION', '행렬 A² 성분합을 근과 계수로 2k²+4k+9로 정리해 자연수 k=2(②)를 확인했으나 H22-C-09 세부키는 보류한다.'],
  691: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', 'w³=1, w̄=w², w+w̄=−1을 사용해 ㄱ·ㄴ·ㄷ 모두 참이고 50 이하 짝수 25개임을 확인해 ⑤를 재검산했으나 H22-C-04 세부키는 보류한다.'],
  692: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_ORDER', '첫 자리 1,2,3의 72개를 건너 4로 시작하는 11번째를 찾아 41302(④)를 확인했으나 H22-C-08 세부키는 보류한다.'],
  693: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', '판별식 (a−b)²−16<0, 전체 36쌍에서 |a−b|=4,5인 6쌍을 제외해 30(③)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  694: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_COEFFICIENT', 'f(x+a)를 전개해 x²계수로 a=−2, x계수로 b=−2를 얻어 a+b=−4(②)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  695: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-QUADRATIC_ROOTS', '판별식 6m≥0으로 m≥0을 정하고 α²+β²=½m²+4m+½의 최솟값 1/2(⑤)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  696: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-CUBIC_ROOTS', '(x+1)(x²−2kx+3)로 인수분해해 k=2만 후보이나 근이 1,3으로 경계에 놓여 조건 불충족, 0개(①)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  697: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-CUBIC_ROOTS', '(x−a)(x²+8x+a²)로 인수분해하고 판별식·중복근 조건을 적용해 −4<a<0 또는 0<a<4를 확인했으나 H22-C-06 세부키는 보류한다.'],
  698: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY_PARAMETER', '첫 부등식의 정수해 3,4,5,6 중 둘째 부등식이 제외하는 유일한 x=n−1이 하나가 되도록 n=4,5,6,7을 확인했으나 H22-C-06 세부키는 보류한다.'],
  699: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION_TANGENCY', '포물선과 조명 직선의 접선 조건을 판별식 0으로 풀어 D와 E를 구하고 삼각형 넓이 27/16을 확인했으나 H22-C-05 세부키는 보류한다.'],
  700: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_FACTORIAL', '3!=6, 4P3=24를 계산해 합 30(③)을 확인했으나 H22-C-08 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003681700V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 681 && record.sequenceOrder <= 700)
    .map(record => {
      const decision = manualDecisions[record.sequenceOrder];
      if (!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
      const candidate = candidateBySequence.get(record.sequenceOrder);
      return {
        sequenceOrder: record.sequenceOrder,
        questionUid: record.questionUid,
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        adjudicationStatus: decision[0],
        answerVerification: 'INDEPENDENT_RECHECK_CONFIRMED',
        candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE',
        candidateSubUnitKey: decision[1],
        independentRationale: decision[2]
      };
    });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = {
    schemaVersion: 'archive-sequential-batch-003-681-700-adjudication-v1',
    batchDigest: batch.digest,
    candidateDigest: candidates.digest,
    productionWriteAllowed: false,
    totals: {
      records: records.length,
      answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length,
      status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')))
    },
    records
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
  const report = adjudicateSequentialBatch003681700V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
