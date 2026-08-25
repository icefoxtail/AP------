import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-661-680-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  661: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '세제곱근의 켤레·주기 관계로 ㄱ, ㄷ이 참이고 ㄴ이 거짓임을 확인해 정답 ③을 재검산했으나 H22-C-04 세부키는 보류한다.'],
  662: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY', 'A의 무게 x에 대해 열량 x≤30, 단백질 x≥20을 동시에 적용해 최소 20g(③)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  663: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY', '해의 정수 구간을 -4부터 2까지로 맞추고 합 -7을 확인해 정수 매개변수 최댓값 -15(③)을 재검산했으나 H22-C-06 세부키는 보류한다.'],
  664: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', '교점 조건으로 f(x)=a(x−1)^2−a−12를 복원하고 구간 최댓값 48에서 a=4, f(6)=84(②)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  665: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-COMBINATION_COUNTING', '가장 큰 수가 홀수인 3,5,7,9의 경우를 나누어 C(2,2)+C(4,2)+C(6,2)+C(8,2)=50(①)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  666: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_INEQUALITY', '두 부등식의 공통해가 정확히 (3,5)가 되도록 매개변수 범위를 점검해 -3≤a≤0, M+m=-3(⑤)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  667: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-PERMUTATION_COMPLEMENT', 'A,B를 포함할 나머지 팀 선택 15, 전체 배열 6!, 인접 묶음 배열 2·5!을 차감해 7200(①)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  668: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_INEQUALITY', '(x−3)(x−n)<0의 자연수 해 개수를 n별로 세어 n=1,5,6,7, 합 19(②)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  669: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', '꼭짓점 x=2와 대칭점 x=4를 기준으로 구간을 나누어 a=2−√3, 2+√7을 얻고 합 4−√3+√7(②)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  670: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-ABSOLUTE_INEQUALITY', '절댓값 기준점 -1,2로 구간을 나누어 전체 해 -4≤x≤5, 정수 10개를 확인했으나 H22-C-06 세부키는 보류한다.'],
  671: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-PLANE_GEOMETRY', '내접 직사각형의 대각선이 지름 80이고 변의 비 4:3이므로 3-4-5 비로 변 64,48, 넓이 3072를 확인했으나 H22-C-07 세부키는 보류한다.'],
  672: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-FUNCTION_GRAPH', '그래프에서 f>0인 구간 (-5,0)과 f<g인 구간 (-5,-3)의 교집합을 취해 정수 해 -4를 확인했으나 H22-C-05 세부키는 보류한다.'],
  673: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', '가격 인상 횟수 x에 따른 이익 -50(x−20)^2+45000의 꼭짓점을 사용해 판매가 400원을 확인했으나 H22-C-05 세부키는 보류한다.'],
  674: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-SYSTEM_EQUATION', 'x²−y²=0을 인수분해하고 양수 조건에서 x=y, 2x²=24를 얻어 a+b=4√3을 확인했으나 H22-C-06 세부키는 보류한다.'],
  675: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_FACTOR', '나머지 차수와 최고차항 조건으로 g를 정한 뒤 q=11에서 f=(x−11)(x−3)(x+4)를 얻어 α=11,β=−4를 확인했으나 H22-C-02 세부키는 보류한다.'],
  676: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-DISTRIBUTION_COUNTING', '5개 물건을 4명에게 모두 나누는 세 소문항을 학생·물건 선택으로 분할해 24,72,36을 각각 재계산했으나 H22-C-08 세부키는 보류한다.'],
  677: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-MULTIPLICATION_PRINCIPLE', '파스타·샐러드·아이스크림에서 각각 하나씩 독립 선택하여 5·4·3=60(⑤)을 확인했으나 H22-C-08 세부키는 보류한다.'],
  678: ['DRAFT_TAXONOMY_HOLD', 'H22-C-08-COMBINATION', '조합식 7C3=7·6·5/(3·2·1)=35(①)을 독립 계산했으나 H22-C-08 세부키는 보류한다.'],
  679: ['DRAFT_TAXONOMY_HOLD', 'H22-C-07-ORDERED_PAIRS', '자연수 조건에서 x=1일 때 y=1,2, x=2일 때 y=1만 가능해 순서쌍 3개(②)를 확인했으나 H22-C-07 세부키는 보류한다.'],
  680: ['DRAFT_TAXONOMY_HOLD', 'H22-C-09-MATRIX_DIMENSION', '각 행렬의 크기를 1×2,2×3,3×2,3×1로 확인해 AB,BD,CB,DA 네 곱만 정의됨(④)을 재검산했으나 H22-C-09 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003661680V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 661 && record.sequenceOrder <= 680)
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
    schemaVersion: 'archive-sequential-batch-003-661-680-adjudication-v1',
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
  const report = adjudicateSequentialBatch003661680V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
