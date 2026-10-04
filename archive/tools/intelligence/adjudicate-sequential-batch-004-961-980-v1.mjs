import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-961-980-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  961: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', '양변을 ac로 묶으면 ac(a−b)(a²−b²+c²)=0이고 삼각형 변의 양수성으로 a=b 또는 a²+c²=b²를 얻는다.'],
  962: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-INTEGER_ROOTS', '(α−1)(β−1)=3의 정수 인수쌍에서 a=0,−8을 얻어 합 −8을 확인했으나 H22-C-05 세부키는 보류한다.'],
  963: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', '축 x=a의 위치를 나누면 a=2−√2,√2이고 합은 2임을 독립 확인했으나 H22-C-06 세부키는 보류한다.'],
  964: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_CONJUGATE', '실계수 방정식에서 허근 α의 켤레근 β=−α이고 (2β/α)^6=(−2)^6=64임을 확인했으나 H22-C-04 세부키는 보류한다.'],
  965: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', '2A+B=x²−3x+1이므로 ②를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  966: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', '나머지정리로 f(1)=1이므로 ④를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  967: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', '2+√3은 실수이므로 실수부·허수부 연결이 잘못된 ③을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  968: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_ROOTS', '근의 곱 c/a=−2이므로 ①을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  969: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-ALGEBRAIC_IDENTITY', '차이의 제곱 항등식을 단계적으로 적용해 x⁸−2⁸, 즉 ②를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  970: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', 'a+2i=1+bi에서 b=2이므로 b=−2라고 한 ①이 옳지 않음을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  971: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_ROOTS', 'α+β=−2, αβ=3에서 α²+αβ+β²=(α+β)²−αβ=1, 즉 ⑤를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  972: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_FUNCTION', 'y=(x−2)²−9의 최솟값 −9, 즉 ③을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  973: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_POWER', 'z=(1+i)/(1−i)=i를 대입하면 식의 값 1−i, 즉 ③을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  974: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_FACTOR', '상수항 −(2y−3)(y+1)의 선형인수 조합을 비교하면 x계수 a−y=−y+4이므로 a=4, 즉 ④를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  975: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', '첫 조건 a²−b<0, 둘째 b²−a>0이므로 새 판별식 4(a²−b)−4(b²−a)<0, 따라서 ④를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  976: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_FUNCTION', 'α²+β²=k²−2(k−7)=(k−1)²+13의 최솟값 13, 즉 ⑤를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  977: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_ROOTS', '새 두 근은 6, −2/3이므로 3x²−16x−12=0, b−a=4인 ②를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  978: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_INTERSECTION', '교점 방정식의 판별식 조건 k≤19/4에서 정수 최댓값 4, 즉 ①을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  979: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_DIVISION', 'Q₁(2)=f(2)−3, Q₂(2)=4−f(2)이므로 합의 나머지 1, 즉 ④를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  980: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-VOLUME', '세 기둥의 합에서 중앙 정육면체 중복을 보정해 V=3x²y−2x³=x²(3y−2x), 즉 ⑤를 확인했으나 H15-SA-01 세부키는 보류한다.']
};

export function adjudicateSequentialBatch004961980V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 961 && record.sequenceOrder <= 980).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-961-980-adjudication-v1',
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
  const report = adjudicateSequentialBatch004961980V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
