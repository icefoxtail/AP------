import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-721-740-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  721: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_GEOMETRY', '정삼각형의 60도 관계로 AH=x를 두고 두 삼각형 넓이 합을 정리해 최솟값 3√3/2를 확인했으나 H22-C-05 세부키는 보류한다.'],
  722: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_DIMENSION', '행 3개·열 2개인 3×2 행렬에서 m−n=1(④)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  723: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_COMBINATION', 'P₀=1이라는 정의를 포함해 각 순열·조합 식을 대조하고 옳지 않은 ③을 확인했으나 H22-C-08 세부키는 보류한다.'],
  724: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_EQUATION', '2A와 B의 대응 성분을 비교해 a=1,b=0, 합 1(①)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  725: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', 'x²−3x−10=(x−5)(x+2)의 두 근 합 3(①)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  726: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-FUNCTION_GRAPH', '그래프의 교점 −3,1 사이에서 f<g임을 읽어 정수 −2,−1,0 세 개(③)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  727: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'z⁸=1인 복소수의 연속 8항 합이 0이고 40항은 5묶음임을 확인해 0(④)을 재검산했으나 H22-C-04 세부키는 보류한다.'],
  728: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-QUADRATIC_DISCRIMINANT', '첫 방정식 판별식 0에서 a=−3,2를 얻고 둘째 판별식<0에서 a>5/4를 적용해 a=2(②)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  729: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', 'f=(x−a)²−2a−4의 꼭짓점 위치를 나눠 a>2일 때 f(2)=a(a−6)=0, a=6(③)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  730: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-DIVISOR_COUNTING', '1500=2²·3·5³에서 5 지수 1~3을 선택해 3·2·3=18(⑤)을 확인했으나 H22-C-07 세부키는 보류한다.'],
  731: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-RECURRENCE_COUNTING', '6개 돌을 지나 도착까지 7칸 이동, 피보나치형 점화로 21(②)을 확인했으나 H22-C-07 세부키는 보류한다.'],
  732: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY', '두 식을 (x+1)(x−a)<0, (x+a)(x+5)<0으로 인수분해해 공통해가 사라지는 최소 양수 a=1(③)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  733: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_RESTRICTION', '밴드가 두 댄스팀보다 앞서는 상대순서 2/6을 전체 5!에 적용해 40(②)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  734: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION_COMPARISON', 'h=f−g의 최고차항 계수 1과 해 구간 양 끝 −2,4를 사용해 h=(x+2)(x−4), g(1)−f(1)=9(④)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  735: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-COUNTING_WITH_REPETITION', 'a₁=a₃의 9가지, a₂<a₄의 C(10,2)=45, 짝수 a₅의 5가지를 곱해 2025=45², k=45(④)를 확인했으나 H22-C-07 세부키는 보류한다.'],
  736: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-INCLUSION_EXCLUSION', '전체 180에서 a=b,b=c,c=a의 합집합 71을 포함배제로 제거해 서로 다른 숫자 109(⑤)를 확인했으나 H22-C-07 세부키는 보류한다.'],
  737: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_IDENTITIES', '결합·분배·스칼라배·단위행렬 거듭제곱·마지막 항등식만 참이고 교환·영곱 명제는 거짓으로 5개(⑤)를 확인했으나 H22-C-09 세부키는 보류한다.'],
  738: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_OPERATION', 'A−B=E로 교환 가능함을 확인해 A³−B³=3AB+E, AB=[[2,3],[4,0]], 성분합 9(①)을 확인했으나 H22-C-09 세부키는 보류한다.'],
  739: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_TANGENCY', '꼭짓점 범위로 f,g의 축을 −1,2에 정하고 y=−2x 접선 판별식으로 계수 1/2,1/4를 얻어 합 −9/2(①)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  740: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_ADDITION', '2×1 열행렬의 같은 위치 성분을 더해 [[3],[3]]을 확인했으나 H22-C-09 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003721740V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 721 && record.sequenceOrder <= 740)
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
    schemaVersion: 'archive-sequential-batch-003-721-740-adjudication-v1',
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
  const report = adjudicateSequentialBatch003721740V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
