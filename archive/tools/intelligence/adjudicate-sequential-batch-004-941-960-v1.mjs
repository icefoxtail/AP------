import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-941-960-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  941: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_POWER', 'z=(1−√3i)/(2i), m=12이고 f(k)f(k+2)=360에서 k=17,18을 얻어 k의 합 35(①)를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  942: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', 'α+β=2, αβ=2이므로 α²+β²=(α+β)²−2αβ=0(①)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  943: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_OPERATION', '(2x+1)^3(x−2)의 x³ 계수는 −16+12=−4(②)를 확인했으나 H22-C-01 세부키는 보류한다.'],
  944: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-ALGEBRAIC_IDENTITY', 'a+b=4, a³+b³=28에서 64−12ab=28이므로 ab=3(③)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  945: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '중근 조건 (k+3)²−16=0으로 k=1 또는 −7, 음의 정수는 −7(②)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  946: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-REMAINDER_THEOREM', '나머지 3x−2를 ±1에 대입해 a=1,b=−2를 얻고 P(2)=12(⑤)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  947: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_OPERATION', '짝수차 계수합은 (P(1)+P(−1))/2=128(④)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  948: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-RADICAL_EQUATION', '정의역 x≤−3에서 절댓값 합을 −2x+3으로 정리해 a=−2,b=3,b−a=5(⑤)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  949: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 'y=2x−4, xy=2x²−4x를 [−1,4]에서 조사해 최솟값 −2, 최댓값 16, 차 18(⑤)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  950: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', '인수 조건을 x에 대한 이차식으로 보고 판별식이 완전제곱이 되도록 정리하면 k=−4(①)를 확인했으나 H22-C-03 세부키는 보류한다.'],
  951: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 'y=x²+a(x−2)의 고정점 (2,4)에서 꼭짓점 조건 a=−4, y절편 8(②)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  952: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', '직사각형의 둘레·넓이 가능성을 비교해 현재 조건 25²<800이고 보기 중 ④만 불가능하므로 정답 ④를 확인했으나 H22-C-06 세부키는 보류한다.'],
  953: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_CONJUGATE', 'ㄱ은 복소수체의 영인자 없음, ㄴ은 |α|²+|β|²=0, ㄷ은 α=a+bi·β=c+di 대입 시 실수부 a²+c²+(b−d)²=0에서 a=c=0,b=d를 얻어 α=β이므로 세 명제 모두 참(⑤)을 독립 확인했으나 H22-C-04 세부키는 보류한다.'],
  954: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 't=x²−4x∈[−4,0], y=t²−4t+1의 최솟값 1·최댓값 33에서 합 34(②)를 확인했으나 H22-C-06 세부키는 보류한다.'],
  955: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', 'f(x)+20x가 α,β를 근으로 하므로 f+20x=k(x²−5x+3), f(1)=15에서 k=−15, 근의 곱 3(③)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  956: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_OPERATION', 'u=2x−1로 치환하면 u³+3u²+5u+4, 4a+3b+2c+d=27(④)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  957: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', '직선이 포물선과 만나기 위한 조건을 2t≥t²+8t−7로 세워 −7≤t≤1(①)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  958: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', 'Q=(x−1)(x−3), P(1)=0,P(3)=32이므로 나머지 R=16x−16, R(2)=16을 확인했으나 H22-C-02 세부키는 보류한다.'],
  959: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_REMAINDER', 'x⁵≡1 (mod x⁴+x³+x²+x+1)로 정리한 나머지가 2x+2, R(5)=12(③)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  960: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', '두 근이 2보다 작으려면 a<1이고 f(2)=8+a>0에서 −8<a<1, 정수 a는 −7부터 0까지 8개(④)를 확인했으나 H22-C-05 세부키는 보류한다.']
};

export function adjudicateSequentialBatch004941960V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 941 && record.sequenceOrder <= 960).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-941-960-adjudication-v1',
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
  const report = adjudicateSequentialBatch004941960V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
