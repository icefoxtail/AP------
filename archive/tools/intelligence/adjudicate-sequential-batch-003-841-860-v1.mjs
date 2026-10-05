import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-841-860-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  841: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', '공통 나머지 R이 (x−2)² 나머지 2x−5를 가지며 f(1)=R(1)=3이므로 R(1)=3(③)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  842: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-FACTORING_FORMULA', '(a−b+2c)²−c²로 변형해 (a−b+3c)(a−b+c), 인수 a−b+3c(④)를 확인했으나 H15-SA-03 세부키는 보류한다.'],
  843: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', '판별식의 k 항등식 계수를 비교해 a=1,b=6,c=3, 합 10(①)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  844: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_POWER', 'z=(1−i)/(1+i)=−i의 4주기 부분합을 이용해 100 이하 n=1 mod 4가 25개(⑤)임을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  845: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', '근호 등식의 부호 조건에서 a>0,b<0을 얻어 ㄱ·ㄴ만 모든 실근을 보장함(③)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  846: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_EXTREMA', '원방정식 근의 합·곱으로 역수근 합 6, 곱 2를 얻고 leading coefficient −1인 f=−(x²−6x+2), 최댓값 7(⑤)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  847: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_COMPOSITION', 'x−1/2 기준 연속 조립제법으로 a=4,b=4,c=2,d=1, ac+b+d=13(③)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  848: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_GEOMETRY', '두 그래프의 수직선 교점 중점이 x축에 놓이도록 t=−4, 정삼각형 높이 16√3에서 k=−4+16√3, a+b=12(②)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  849: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_EXTREMA', '꼭짓점 위치별로 a+b의 하한을 비교해 a<0 구간의 15/4가 전역 최솟값, 8k=30(③)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  850: ['EVIDENCE_MISSING_HOLD', 'H22-A-05-TRIANGLE_SIMILARITY', '문항이 참조하는 그림이 패킷에 포함되지 않았고 해설도 “도형 검토 후 보완 필요” 상태다. 선분 배치·닮음 관계를 독립 확인할 근거가 없어 69를 확정하지 않는다.'],
  851: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_REMAINDER', 'P를 f로 나눈 나머지 g와 g로 나눈 나머지 조건을 비교해 f=x²+2x, g=−x−3, g(2)=−5(⑤)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  852: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_EQUALITY', '복소수 실수·허수부를 비교한 연립식으로 x=y=2, 합 4를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  853: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_FUNCTION', 'α²=β, β²=α를 사용해 f(α)=2α+2,f(β)=2β+2, f=x²+3x+3, f(2)=13을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  854: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_EXTREMA', 'M 전환점으로 축 x=1을 정하고 m 최솟값 4에서 b=5, 오른쪽 곡선 접선 조건으로 t=−4를 확인했으나 H15-SA-13 세부키는 보류한다.'],
  855: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_ADDITION', 'A+B=2x²+8x+7의 계수 비교로 a=8(②)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  856: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-COMPLEX_EQUALITY', '실수부 x+y=1, 허수부 xy=−2를 비교해 xy=−2(①)을 확인했으나 H15-SA-03 세부키는 보류한다.'],
  857: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_VERTEX', 'y=2(x−1)²−1에서 a=1,b=−1, a−b=2(⑤)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  858: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-ALGEBRAIC_IDENTITY', '(a+b+c)²−2(ab+bc+ca)로 a²+b²+c²=11(①)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  859: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-VIETA_IDENTITIES', 'α+β=3, αβ=−6을 (α+1)(β+1)에 대입해 −2(②)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  860: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', 'f(2)=6,f(−1)=0의 연립식으로 a=−7,b=12, b−a=19(⑤)을 확인했으나 H15-SA-02 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003841860V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 841 && record.sequenceOrder <= 860)
    .map(record => {
      const decision = manualDecisions[record.sequenceOrder];
      if (!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
      const candidate = candidateBySequence.get(record.sequenceOrder);
      const missing = decision[0] === 'EVIDENCE_MISSING_HOLD';
      return {
        sequenceOrder: record.sequenceOrder,
        questionUid: record.questionUid,
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        adjudicationStatus: decision[0],
        answerVerification: missing ? 'EVIDENCE_MISSING_HOLD' : 'INDEPENDENT_RECHECK_CONFIRMED',
        candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE',
        candidateSubUnitKey: decision[1],
        independentRationale: decision[2]
      };
    });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = {
    schemaVersion: 'archive-sequential-batch-003-841-860-adjudication-v1',
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
  const report = adjudicateSequentialBatch003841860V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
