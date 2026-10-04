import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-1101-1120-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  1101: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', 'z=4+3i의 실수·허수부분 합 4+3=7(④)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1102: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_CONJUGATE', '7−2i의 켤레복소수 7+2i(①)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1103: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-VOLUME', 'a+b+c=25,a²+b²+c²=225에서 2(ab+bc+ca)=400, 겉넓이 400(①)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1104: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_FACTOR', 'f=(x+1)²(x−2)이고 f(−3)=−20(⑤)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1105: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-ALGEBRAIC_IDENTITY', 'a³+b³+c³−3abc=0과 양의 변 조건에서 a=b=c, 둘레12로 한 변4, 넓이4√3(④)을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1106: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 'x에 대한 이차식 인수분해로 (x+3y+1)(x−y+2), 즉 ③을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1107: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '분모 유리화 후 실수·허수부분 합 (−2a−7)/25=1/5에서 a=−6(⑤)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1108: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'z=(1+i)/√2,z²=i,z⁵=−z와 역수 켤레를 합해 −√2(②)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1109: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', '원래 근의 합·곱으로 새 계수 a=26/25,b=9/25를 얻어 13/a+3/b=125/6(⑤)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1110: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', '근을 α,3α로 두고 근과 계수 관계를 적용해 k=4/3,4, 차 8/3(⑤)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1111: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', '나머지 a=0, 몫 f(x)=Σ_{j=0}^{2024}(−1)^j x^{2024−j}, f(−1)=2025이므로 a+b=2025(①)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  1112: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '첫 방정식의 허근으로 a=8,b=16, 둘째 판별식 k<48, 홀수 자연수 1…47 개수24(②)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1113: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_OPERATION', '전개 차수 중 2n−4=n이 되는 n=4에서만 5개 항, x=1 대입 합 64(④)를 확인했으나 H22-C-01 세부키는 보류한다.'],
  1114: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', 'a²+(b+2)²=50의 자연수 해 (a,b)=(1,5),(5,3)에서 (a+3)²+b² 최솟값 41(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1115: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_REMAINDER', '두 주어진 조건을 일반 삼차식 계수로 연립하면 B=C,D=A가 되어 f(−1)=0, 따라서 나머지 0(②)을 독립 확인했으나 H22-C-02 세부키는 보류한다.'],
  1116: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_DISCRIMINANT', '이차식 조건 k≠1과 판별식 1+3(k−1)>0에서 정수 최솟값 2를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1117: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', 'f(x)−2x=3(x²+ax+b)로 놓고 f(1)=11을 적용해 a+b=2를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1118: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', 'z³=1, 3항 묶음 16개와 잔여항을 계산해 S=−51/2−(17√3/2)i, ab=867√3/4를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1119: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 'P(n)=(n²+3n−3)(n²+3n+1)가 소수이려면 n=1, f(1)=3을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1120: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_OPERATION', '2A+B=2(3x²+4x−2)+(x²+x+3)=7x²+9x−1, ①을 확인했으나 해설 누락과 무관하게 원문으로 독립 확인되어 H22-C-01 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00411011120V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 1101 && record.sequenceOrder <= 1120).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-1101-1120-adjudication-v1',
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
  const report = adjudicateSequentialBatch00411011120V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
