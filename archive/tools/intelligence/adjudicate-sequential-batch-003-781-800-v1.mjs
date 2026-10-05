import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-781-800-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  781: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_ROOTS', '두 근이 1보다 크기 위한 판별식·경계값 조건을 결합해 5/3<k≤2, a+b=11/3(②)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  782: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_FUNCTION', '직선 위 b=−2a+6과 0≤a≤3을 대입해 2(a−2)²+16의 최솟값 16(④)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  783: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_GEOMETRY', '교점 근의 합·곱으로 두 영역 넓이 차를 α³+β³/2로 표현해 1+3k=64, k=21(⑤)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  784: ['ANSWER_SOURCE_DEFECT_HOLD', 'H15-SA-02-REMAINDER_THEOREM', '문항에는 몫=나머지와 “나머지가 1”만 있고 해설이 사용하는 R(0)=2 조건이 없다. 따라서 R(x)=ax+b의 x계수는 유일하게 결정되지 않아 저장 정답 −1을 확정할 수 없다.'],
  785: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-POLYNOMIAL_FACTOR', 'x+2를 인수로 뽑고 상수항 mn=6인 정수 인수쌍의 중복을 제거해 가능한 a가 6개(②)임을 확인했으나 H15-SA-03 세부키는 보류한다.'],
  786: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_DIVISION', '몫을 x+k로 두어 계수 비교 k=3, a=6을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  787: ['ANSWER_SOURCE_DEFECT_HOLD', 'H15-SA-01-PERFECT_SQUARE', '문항 본문에 완전제곱으로 만들 대상인 사차식이 누락되어 있고 해설에만 식이 나타난다. 누락된 원문 없이는 k와 f(1)을 독립 확정할 수 없다.'],
  788: ['ANSWER_SOURCE_DEFECT_HOLD', 'H15-SA-05-VIETA_RELATIONS', '문항 본문에 두 이차방정식 자체가 누락되어 해설의 α+β, α−β 관계를 검증할 수 없다. 저장 정답 −27은 출처 결함 보류한다.'],
  789: ['ANSWER_SOURCE_DEFECT_HOLD', 'H15-SA-13-QUADRATIC_EXTREMA', '문항 본문에 제한 구간과 이차함수 식이 누락되어 해설의 y=(x−k)²−k²+5k 및 k 범위를 검증할 수 없다. 저장 정답 5는 출처 결함 보류한다.'],
  790: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', '2A−3B를 직접 전개해 −4x²+13xy−11y²(⑤)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  791: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-ALGEBRAIC_IDENTITY', '(x−y)²로 xy=3/2를 얻고 x³−y³=(x−y)³+3xy(x−y)=11/2(①)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  792: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_EXPANSION', '(2x−1)(2x²+x+1)=4x³+x−1에서 a=4,b=0,c=1, a−b+c=5(⑤)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  793: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_DIVISION', 'x²+1로 나눗셈해 잔여식 x+7(②)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  794: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', 'P=(x−a)Q+R에 x²를 곱해 x(x−a)로 나눈 나머지 T(x)=aRx, T(a)=a²R(②)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  795: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_IDENTITY', '각 보기 전개로 ②,③만 항등식임을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  796: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_EXPANSION', 'x−1 기준 전개로 a=1,b=9,c=27,d=27, a−b+c−d=−8(③)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  797: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-REMAINDER_THEOREM', 'P(0)=2와 (x−1)(x+2) 인수 조건으로 P=(x−1)(x+2)(x−1)+x²를 복원해 P(2)=8(③)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  798: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_FACTOR', '2y²−y−3=(2y−3)(y+1)로 인수분해해 ac+bd=−1(①)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  799: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_FACTOR', 'P(1/2)=P(2)=0에서 계수를 정해 P=(2x−1)(x−2)², 나머지 인수 x−2(③)를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  800: ['ANSWER_SOURCE_DEFECT_HOLD', 'H15-SA-03-COMPLEX_RADICAL', '계산값은 4√6이나 선택지 ④와 ⑤가 동일하게 4√6으로 중복되어 저장 답안 ⑤의 선택지 식별이 유일하지 않다. 선택지 출처 결함 보류한다.']
};

export function adjudicateSequentialBatch003781800V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 781 && record.sequenceOrder <= 800)
    .map(record => {
      const decision = manualDecisions[record.sequenceOrder];
      if (!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
      const candidate = candidateBySequence.get(record.sequenceOrder);
      const isDefect = decision[0] === 'ANSWER_SOURCE_DEFECT_HOLD';
      return {
        sequenceOrder: record.sequenceOrder,
        questionUid: record.questionUid,
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        adjudicationStatus: decision[0],
        answerVerification: isDefect ? 'ANSWER_SOURCE_DEFECT_HOLD' : 'INDEPENDENT_RECHECK_CONFIRMED',
        candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE',
        candidateSubUnitKey: decision[1],
        independentRationale: decision[2]
      };
    });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = {
    schemaVersion: 'archive-sequential-batch-003-781-800-adjudication-v1',
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
  const report = adjudicateSequentialBatch003781800V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
