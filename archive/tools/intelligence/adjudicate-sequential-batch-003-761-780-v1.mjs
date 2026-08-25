import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-761-780-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  761: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_CONDITION', '분수가 실수가 되는 조건에서 z\u0304z=2, a²+4b²=2를 얻어 3(a+2)²−19의 최솟값 −19를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  762: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_EXPANSION', '(2x)(3)와 (3)(2x)만 x항을 만들므로 계수 12를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  763: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_INEQUALITY', '두 그래프의 전역 위치 조건을 판별식 D<0으로 바꾸어 정수 a의 최솟값 −16을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  764: ['DRAFT_TAXONOMY_HOLD', 'RAW-수치계산의공식화-CUBIC_IDENTITY', '53³+3·7·53²+3·7²·53+7³ 형태로 묶어 60³+100=216100을 확인했으나 RAW-수치계산의공식화 세부키는 보류한다.'],
  765: ['ANSWER_SOURCE_DEFECT_HOLD', 'H15-SA-03-FACTOR_CHECK', '원문 마지막 항은 −yz²인데 해설은 −y²z로 바꾸어 (x−z)(x−y)²라고 인수분해했다. 저장 정답 41은 이 불일치 상태에서 확정할 수 없으므로 원문·정답 소스 결함 보류한다.'],
  766: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_POWER', '두 복소수의 2·3배 주기를 i^p,i^q로 바꾸고 1+i가 되는 네 순서쌍을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  767: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_TANGENCY', '접선의 중근 조건과 삼각형 넓이비 9:1의 닮음비를 결합해 가능한 a 중 최댓값 절댓값 12를 확인했으나 H15-SA-13 세부키는 보류한다.'],
  768: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', '2A−(A−B)=A+B로 단순화해 −x²−8x+11(③)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  769: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_IDENTITY', 'x=2를 대입해 (x−1)=1인 경우 좌변 a+b+c와 우변 8을 일치시켜 8(④)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  770: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-07-FACTOR_THEOREM', 'f(1)=0,f(−1)=0에서 p+q=1,p−q=3, p=2,q=−1, pq=−2(③)를 확인했으나 H15-SA-07 세부키는 보류한다.'],
  771: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-SYNTHETIC_DIVISION', '조립제법 계수 비교로 a=2/3,b=1,c=−1, 합 2/3(②)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  772: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', 'i²=−1을 적용해 (4+3i)(1+i)=1+7i, 뒤 항은 0, 합 8(①)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  773: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', '실근 조건 D≥0에서 a≥−2를 얻어 최솟값 −2(④)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  774: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-VIETA_IDENTITIES', '근의 합 4, 곱 2를 세제곱합 공식에 대입해 α³+β³=40(③)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  775: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_EXTREMA', 'y=(x−3)²−8에서 구간 최솟값 −8, 최댓값 8을 얻어 합 0(①)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  776: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-SYMMETRIC_POLYNOMIAL', '식을 (a³+b³)(a²+b²)로 묶고 a+b=−2, ab=−1을 사용해 −84(⑤)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  777: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-MODULAR_ARITHMETIC', '1002=1000+2로 두어 1000 배수 항을 제거하고 2¹⁰ mod 250=24(③)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  778: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-ALGEBRAIC_FACTOR', 'a=4를 얻고 두 번째 식을 정리해 a=b=c, 삼각형 둘레 12(⑤)를 확인했으나 H15-SA-03 세부키는 보류한다.'],
  779: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_CONJUGATE', 'z=a+bi 성분 비교로 z=1−i, z²−2z+2=0을 만든 뒤 다항식 값을 7−3i(①)로 확인했으나 H15-SA-04 세부키는 보류한다.'],
  780: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_DISCRIMINANT', '첫 교점 조건 D₁≥0과 둘째 비교함수 미교점 조건 D₂<0을 결합해 정수 −2,−1,0 세 개(②)를 확인했으나 H15-SA-13 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003761780V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 761 && record.sequenceOrder <= 780)
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
        answerVerification: record.sequenceOrder === 765 ? 'ANSWER_SOURCE_DEFECT_HOLD' : 'INDEPENDENT_RECHECK_CONFIRMED',
        candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE',
        candidateSubUnitKey: decision[1],
        independentRationale: decision[2]
      };
    });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = {
    schemaVersion: 'archive-sequential-batch-003-761-780-adjudication-v1',
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
  const report = adjudicateSequentialBatch003761780V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
