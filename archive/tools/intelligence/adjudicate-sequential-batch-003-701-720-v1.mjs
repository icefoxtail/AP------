import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-701-720-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  701: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_ADDITION', '행렬의 같은 위치 성분을 더해 A+B=[[1,1],[4,2]], 성분합 8(①)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  702: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', 'x절편 -1,3을 근으로 하는 (x+1)(x−3)을 전개해 a=−2(④)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  703: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', 'y=−(x−3)²+1로 완전제곱식화하고 꼭짓점이 구간에 포함됨을 확인해 최댓값 1(①)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  704: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-DIVISOR_COUNTING', '1200=2⁴·3·5²의 지수 선택 5·2·3으로 양의 약수 30개(⑤)를 확인했으나 H22-C-07 세부키는 보류한다.'],
  705: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-ABSOLUTE_INEQUALITY', '−10≤3x+5≤10에서 −5≤x≤5/3, 정수 7개(④)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  706: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_EQUATION', '4X−3A=3X+2B를 X=3A+2B로 정리해 X=[[7,2],[18,7]], 성분합 34(②)를 확인했으나 H22-C-09 세부키는 보류한다.'],
  707: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY', '두 이차부등식 해의 교집합 −2<x≤3에서 정수 −1,0,1,2,3을 얻어 합 5(①)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  708: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-LINEAR_INEQUALITY', '장미 x송이 조건 x>6과 금액 조건 x≤8을 동시에 적용해 최댓값 8(③)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  709: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_COMPLEMENT', '전체 5!에서 A,B 인접 2·4!을 빼 72(④)를 확인했으나 H22-C-08 세부키는 보류한다.'],
  710: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_COMBINATION', '조합 대칭성으로 ㄱ만 참이고 순열·조합 관계 및 제시된 순열식은 거짓임을 확인해 ①을 재검산했으나 H22-C-08 세부키는 보류한다.'],
  711: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY_PARAMETER', '|x−8|≤4의 정수 구간과 (x−a)(x−4a−2)≤0의 교집합을 세어 a=11만 가능, 합 11(②)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  712: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION_AREA', 'f(x)=(x−a)(x−a−4)의 절편과 y절편으로 넓이 2(a²+4a)를 세워 최솟값 10, 최댓값 64, 합 74(⑤)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  713: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-ABSOLUTE_INEQUALITY', '둘째 부등식의 정수 후보 −2,−1,0,1에 |x−k|<3을 적용해 |p|=1인 k=2,3, 합 5(⑤)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  714: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-SEATING_COUNTING', 'AB 인접 배치 192에서 CD까지 인접한 64를 여사건으로 빼 128(②)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  715: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-DISTRIBUTION_COUNTING', '어른 분포를 세 곳 모두 또는 B,C에만 두는 경우로 나누어 108+18=126(③)을 확인했으나 H22-C-07 세부키는 보류한다.'],
  716: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY_PARAMETER', 'm의 부호·값별 첫 부등식과 n별 두 번째 구간의 정수 교집합을 조사해 10개(④)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  717: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', '꼭짓점 p의 위치별 최솟값 조건을 나누어 ㄱ·ㄴ 참, p+q 최댓값 17/4로 ㄷ 거짓임을 확인해 ②를 재검산했으나 H22-C-05 세부키는 보류한다.'],
  718: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_ORDER', '43012보다 작은 수를 첫 자리 1,2,3의 72개와 4-0/1/2의 18개로 세어 90개, 순번 91을 확인했으나 H22-C-08 세부키는 보류한다.'],
  719: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_TANGENCY', '접선 판별식으로 a=1,9를 얻고 f(−1)<0에서 a=9를 선택해 f(2)=23을 확인했으나 H22-C-05 세부키는 보류한다.'],
  720: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_INEQUALITY', '총이익 −0.01x²+8x−500≥700을 정리해 (x−200)(x−600)≤0, 최소 200개를 확인했으나 H22-C-06 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003701720V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 701 && record.sequenceOrder <= 720)
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
    schemaVersion: 'archive-sequential-batch-003-701-720-adjudication-v1',
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
  const report = adjudicateSequentialBatch003701720V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
