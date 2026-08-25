import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-881-900-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  881: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_POWER', '첫 항을 i^9, 둘째 항을 (−i)^19로 주기화해 각각 i, i, 합 2i(②)를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  882: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-POLYNOMIAL_FACTOR', 'x² 치환으로 (x²+3)(x²−1)을 얻어 ㄱ,ㄷ,ㅂ이 모두 인수인 ⑤를 확인했으나 H15-SA-03 세부키는 보류한다.'],
  883: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_DIVISION', 'x=1/2 조립제법과 나누는 식의 leading coefficient를 보정해 몫 x²+2, 나머지 1(③)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  884: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_EXTREMA', 'y=(x−1)²+2가 [2,k]에서 증가하므로 k²−2k+3=18, k=5(⑤)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  885: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-QUADRATIC_TANGENCY', '판별식 항등식으로 (2−4a)k+(a²−b)=0의 계수를 0으로 두어 a=1/2,b=1/4, 합 3/4(①)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  886: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', 'R=a(x−1)²+3x+2로 두고 R(2)=7에서 a=−1, R(0)=1(①)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  887: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_IDENTITY', 'y=−x−1을 대입해 x²,x,상수 계수를 비교하여 a=3,b=6,c=3, abc=54(④)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  888: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_DIVISION', 'P=(x³+x)(x+3)+(x+5)를 전개해 x+1로 나눈 나머지 R=0, 몫 Q(1)=7, 차 7(⑤)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  889: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-PERFECT_SQUARE', '교차 짝짓기로 t=x²+x를 두어 t²−18t+72+k=(t−9)², k=9(③)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  890: ['ANSWER_SOURCE_DEFECT_HOLD', 'H15-SA-04-QUADRATIC_DISCRIMINANT', '허근 조건은 n>m²/4인데 문항은 m만 자연수라고 명시하고 n의 범위를 주지 않았다. 해설의 n≥1 가정 없이는 m+n의 최솟값 2를 독립 확정할 수 없다.'],
  891: ['EVIDENCE_MISSING_HOLD', 'H15-SA-03-COMBINATORICS', '정팔면체의 면·꼭짓점과 a~f의 정의 및 “합 231” 조건이 본문에 누락되어 해설의 231=3·7·11 추론을 검증할 수 없다.'],
  892: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_COMPOSITION', 'x=1 기준 연쇄 조립제법으로 a=1,b=1,c=2,d=−2, abcd=−4(②)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  893: ['EVIDENCE_MISSING_HOLD', 'H15-SA-04-COMPLEX_NUMBER', 'z₁,z₂와 자연수 a,b,c,d의 정의·조건이 본문에서 잘려 있어 해설의 (3,2),(2,1) 선택과 z₁−z₂=1+i를 독립 검증할 수 없다.'],
  894: ['EVIDENCE_MISSING_HOLD', 'RAW-다항식추론-POLYNOMIAL_CONSTRAINT', 'P(x)의 차수·계수 등 추가 조건이 본문에 없고 P(x)P(x−2)의 나눗셈 조건만으로는 P(4)²가 유일하게 정해지지 않는다. 저장 정답 25는 근거 부족 보류한다.'],
  895: ['EVIDENCE_MISSING_HOLD', 'H15-SA-13-QUADRATIC_GEOMETRY', '문항의 이차함수 식, 점 A·B 및 기울기 조건/그림이 본문에서 누락되어 넓이 3을 독립 검증할 수 없다.'],
  896: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_COEFFICIENT', '(x−1)^4 전개 계수 비교로 a=−4,b=−4를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  897: ['EVIDENCE_MISSING_HOLD', 'RAW-서술형2-POLYNOMIAL_REMAINDER', '사차식 P(x)의 실제 조건과 나눗셈 관계가 본문에서 누락되어 해설의 R(x)=2x−3 및 P(0)=15를 독립 검증할 수 없다.'],
  898: ['EVIDENCE_MISSING_HOLD', 'RAW-서술형3-QUADRATIC_EXTREMA', 'M=2m을 정의하는 이차함수와 구간 조건이 본문에서 누락되어 해설의 a=5, 2a+b=17을 독립 검증할 수 없다.'],
  899: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_EQUALITY', '복소수 실수·허수부 비교로 x=−2,y=−2, x+y=−4(①)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  900: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-REMAINDER_THEOREM', '나머지정리로 P(1)=1을 계산해 ①을 확인했으나 H22-C-02 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003881900V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 881 && record.sequenceOrder <= 900)
    .map(record => {
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
    schemaVersion: 'archive-sequential-batch-003-881-900-adjudication-v1',
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
  const report = adjudicateSequentialBatch003881900V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
