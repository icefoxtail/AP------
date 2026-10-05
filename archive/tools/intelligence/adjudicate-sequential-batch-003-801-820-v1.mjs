import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-801-820-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  801: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_OPERATION', 'z=a+bi의 켤레곱·합이 실수이고 ω³=−1을 사용해 ㄱ·ㄴ·ㄷ 모두 참인 ⑤를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  802: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-QUADRATIC_DISCRIMINANT', '중근 조건 D/4=0에서 (a+1)²=0, a=−1(①)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  803: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-QUADRATIC_ROOTS', '절댓값이 같고 부호가 반대인 두 근의 합 0으로 b=−4a, 곱 조건에서 a=1,2,3, ab 합 −56(③)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  804: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_TANGENCY', '판별식 D/4=a(5−4k)가 모든 a에 대해 0이 되도록 k=5/4(④)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  805: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-PIECEWISE_FUNCTION', '구간별 직선 교점 수가 네 개가 되는 경계 k=3/2,7/2 사이를 확인해 정수 2,3 두 개(②)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  806: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_TANGENCY', '폭·높이로 y=−x²+4를 세우고 C=(5/2,0)에서의 접선 기울기 −2, 접점 높이 3(③)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  807: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-VIETA_IDENTITIES', '실근 조건 k≥2와 근의 세제곱합을 이용해 12k²−24k의 최소 0(②)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  808: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-FACTORING_FORMULAS', '기본 인수분해 공식과 완전제곱·세제곱 차를 적용해 (1)~(8) 결과를 모두 대조했으나 H15-SA-01 세부키는 보류한다.'],
  809: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_DIVISION', 'P−x²가 1,2,3을 근으로 갖는 삼차식임을 이용해 P를 복원하고 2(x−1)(x−2)로 나누어 몫 1/2x−1, 나머지 3x−2를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  810: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-QUADRATIC_ROOTS', '잘못 본 근에서 올바른 곱 b=10과 합 −a=4를 복원해 x²−4x+10의 근 2±√6i를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  811: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', 'A+B,A−B를 연립해 A=x²+xy−2y², B=2x²−3xy+3y², B−2A의 계수합 2를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  812: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-COMPLEX_OPERATION', 'z의 실수부를 0으로 두어 a=2,3을 얻고 허수부 0을 제외해 합 2(①)를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  813: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-REMAINDER_THEOREM', 'P=(3x−1)Q+r에서 xP를 x−1/3으로 정리해 몫 3xQ+r, 나머지 r/3(⑤)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  814: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-ALGEBRAIC_IDENTITY', 'x³−y³=(x−y)³+3xy(x−y)에 x−y=3, x³−y³=−27을 대입해 xy=−6(④)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  815: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_DIVISION', 'f(1)=0으로 a=3을 정하고 조립제법으로 g=2x²−x−3, 계수합 −2(②)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  816: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-COMPLEX_POWER', 'i 거듭제곱을 주기적으로 정리해 합 2−3i, ab=−6(①)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  817: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-COMPLEX_CONJUGATE', '음수 제곱근을 복소수로 바꿔 z=−4−3i, z̄z=25(③)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  818: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_FACTOR', '식을 (a+b)²(2a−b)=121로 인수분해하고 자연수 조건에서 a+b=11,2a−b=1, ab=28(③)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  819: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-DIVISIBILITY', '7⁶−1=2⁴·3²·19·43의 소인수분해로 10만 나누어떨어지지 않음을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  820: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-QUADRATIC_DISCRIMINANT', '네 이차방정식의 판별식 부호를 대조해 ㄱ·ㄹ만 서로 다른 두 실근, ⑤를 확인했으나 H15-SA-02 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003801820V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 801 && record.sequenceOrder <= 820)
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
    schemaVersion: 'archive-sequential-batch-003-801-820-adjudication-v1',
    batchDigest: batch.digest,
    candidateDigest: candidates.digest,
    productionWriteAllowed: false,
    totals: {
      records: records.length,
      answerRecheckConfirmed: records.length,
      status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')))
    },
    records
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
  const report = adjudicateSequentialBatch003801820V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
