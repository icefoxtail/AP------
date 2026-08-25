import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-641-660-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  641: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-ABSOLUTE_INEQUALITY', '절댓값 부등식의 구간을 나누어 해가 -2≤x≤10/3임을 확인하고 양 끝점의 합 4/3(②)을 재검산했으나 H22-C-06 세부키는 보류한다.'],
  642: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_COMBINATION', '서로 다른 색 공을 선택·배열하는 경우를 곱셈원리로 계산해 4C2·3C1·3C2·5!=6480(③)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  643: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', 'w^3=1, w≠1과 켤레 관계를 이용해 분수항을 정리하고 합 2(⑤)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  644: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_PARAMETER', '각 명제의 근·판별식 조건을 독립 확인해 (가),(다)만 참인 ④를 확인했으나 H22-C-06 세부키는 보류한다.'],
  645: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-COUNTING_DIVISIBILITY', '끝 두 자리의 4 배수 조건과 백의 자리 선택을 곱해 9·6=54(⑤)를 확인했으나 H22-C-08 세부키는 보류한다.'],
  646: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-POLYNOMIAL_PARAMETER', '인수분해한 네 근의 정수 조건과 중복근 배제를 적용해 가능한 짝수 n의 개수 9(④)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  647: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_POWER', 'A=E+N, N²=O인 상삼각행렬의 거듭제곱 합을 계산해 모든 성분의 합 75(④)를 확인했으나 H22-C-09 세부키는 보류한다.'],
  648: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-SOLID_GEOMETRY', '원기둥에서 정육면체 구멍을 뺀 부피·겉넓이 조건을 각각 대입해 a−b=4(①)를 재검산했으나 H22-C-07 세부키는 보류한다.'],
  649: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-COLORING_COUNTING', '색 배치의 인접 제한을 경우분할해 k(k−1)(k−2)^2=480, k=6(②)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  650: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_EQUATION', 'AB=CA 및 원소합 조건을 성분별로 풀어 미지수 합 3(③)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  651: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-COMBINATION_INEQUALITY', '세 번째 수가 6인 5개 선택 수를 조합식으로 세어 10·C(n−6,2)≥200의 최소 n=13을 확인했으나 H22-C-08 세부키는 보류한다.'],
  652: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-ABSOLUTE_INEQUALITY', '정수 k별 |x−k|<3과 주어진 구간의 교집합 조건을 점검해 정수합 5를 확인했으나 H22-C-06 세부키는 보류한다.'],
  653: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_POWER', '경로 인접행렬 A=[[0,2],[2,1]]를 세제곱해 원소합 33을 확인했으나 H22-C-09 세부키는 보류한다.'],
  654: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-DIVISOR_COUNTING', '4500=2²·3²·5³의 약수 지수 조합을 세어 3·3·3=27(④)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  655: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_OPERATION', 'AB의 네 성분을 비교해 a=2,b=−1,c=1,d=−3, 합 −1(①)을 독립 계산했으나 H22-C-09 세부키는 보류한다.'],
  656: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_COMBINATION', '9명 중 회장·부회장 순열 72에서 둘 다 남학생 12를 빼 적어도 한 명 여학생인 60(⑤)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  657: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_OPERATION', '행렬 조건으로 네 원소를 2,3,3,9로 복원해 합 17(④)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  658: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_COMBINATION', '(n−1)(n−2)(n−3)(n−4)=11P4를 만족하는 n=12(④)를 확인했으나 H22-C-08 세부키는 보류한다.'],
  659: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_APPLICATION', '가격·판매량 행렬의 곱에서 B 식당 열을 선택해 해당 선택지 ④를 확인했으나 H22-C-09 세부키는 보류한다.'],
  660: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-CUBIC_ROOTS', '삼차방정식 근의 합 2, 두 근의 곱의 합 −7, 곱 −2를 사용해 (α+β)(β+γ)(γ+α)=−12(②)를 확인했으나 H22-C-06 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003641660V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 641 && record.sequenceOrder <= 660)
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
    schemaVersion: 'archive-sequential-batch-003-641-660-adjudication-v1',
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
  const report = adjudicateSequentialBatch003641660V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
