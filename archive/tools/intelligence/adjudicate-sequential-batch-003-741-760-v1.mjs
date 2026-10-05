import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-741-760-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  741: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_RADICAL', '음수 제곱근을 i로 바꾸어 곱셈 결과 −4와 나눗셈 결과 −2i를 확인했으나 H22-C-04 세부키는 보류한다.'],
  742: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-CUBIC_ROOTS', 'x=1을 인수로 찾아 (x−1)(x²−2x+2)로 분해하고 해 1,1±i를 확인했으나 H22-C-06 세부키는 보류한다.'],
  743: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-ABSOLUTE_INEQUALITY', '절댓값 기준점 −2,1로 나누어 전체 해 −3<x<2, a−b=−5를 확인했으나 H22-C-06 세부키는 보류한다.'],
  744: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY', '2x+1<3x<x+a−1에서 1<x<(a−1)/2를 얻고 정수 2,3,4만 포함 조건으로 9<a≤11을 확인했으나 H22-C-06 세부키는 보류한다.'],
  745: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-FUNCTION_COMPARISON', 'h=f−g의 근 1,5와 최솟값 −8로 h=2(x−1)(x−5)를 복원해 구간 최댓값 10, x=0을 확인했으나 H22-C-05 세부키는 보류한다.'],
  746: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_EQUATION', 'n 짝수 조건으로 AₙBₙX의 두 성분을 비교해 x²=n−1, 최소 홀수 완전제곱 9에서 n=10을 확인했으나 H22-C-09 세부키는 보류한다.'],
  747: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-DISTRIBUTION_COUNTING', '어른 분포 (0,1,3),(0,2,2),(0,3,1),(1,1,2),(1,2,1),(2,1,1)을 나누어 어린이 배치를 합산해 490을 확인했으나 H22-C-08 세부키는 보류한다.'],
  748: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', 'A−B를 괄호 전개해 −x²−3x+3(②)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  749: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', '실수부와 허수부를 각각 더해 4+9i, a+b=13(④)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  750: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_IDENTITY', '(x−3)(2x+4)=2x²−2x−12의 계수 비교로 a+b=−14(①)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  751: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', '나머지정리로 f(3)=9−15−3=−9(③)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  752: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', '중근 조건 D=0을 적용해 36−4(k−3)=0, k=12(③)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  753: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-POLYNOMIAL_FACTOR', 'x² 치환으로 (x²+3)(x²−1)=(x²+3)(x+1)(x−1), a−b=2(①)을 확인했으나 H15-SA-03 세부키는 보류한다.'],
  754: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-RECIPROCAL_IDENTITY', '조건을 x로 나누어 x+1/x=6, 세제곱합으로 전체 식 192(③)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  755: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_DIVISION', '(x+2)² 인수 조건의 계수 비교로 a=12,b=16,Q(10)=6, 합 34(②)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  756: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_COMPOSITION', 'f(x+k) 전개 계수 비교로 k=−2,a=−33,b=59, 합 24(④)를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  757: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_MAXIMUM', '끈 길이 조건 3x+2y=240으로 넓이 −3/2x²+120x를 세워 꼭짓점 x=40m(②)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  758: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_DISCRIMINANT', '첫 함수의 두 교점 조건 k>2와 둘째 함수 접선 조건 k=12 또는 −4를 결합해 5k=60(③)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  759: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-FUNCTION_SUBSTITUTION', 'X=x²−2x∈[−1,8]로 치환해 y=(X−4)²−1, M−m=25(①)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  760: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-VIETA_RELATIONS', '잘못 본 계수에서 근의 곱 2와 근의 합 2/3을 복원해 27(α²+β²)=−96(③)을 확인했으나 H15-SA-05 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003741760V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 741 && record.sequenceOrder <= 760)
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
    schemaVersion: 'archive-sequential-batch-003-741-760-adjudication-v1',
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
  const report = adjudicateSequentialBatch003741760V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
