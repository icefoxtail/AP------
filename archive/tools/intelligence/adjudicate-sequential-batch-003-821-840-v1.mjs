import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-821-840-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  821: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-VIETA_IDENTITIES', '근의 합 −5, 곱 −1과 α²+β²=27을 이용해 주어진 식 −22(①)를 확인했으나 H15-SA-02 세부키는 보류한다.'],
  822: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-VIETA_IDENTITIES', '실수 계수 조건으로 켤레근 2±i, a=−4,b=5를 얻고 역수근 방정식에서 m=20,n=1, mn=20(④)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  823: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_INTERSECTION', '교점 방정식의 두 근 −2,1에 근과 계수 관계를 적용해 a=3,b=5, 합 8(②)을 확인했으나 H15-SB-02 세부키는 보류한다.'],
  824: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_TANGENCY', '점 (0,2)를 지나는 직선을 두고 접선 판별식 0 및 음의 기울기를 적용해 y=(3−2√6)x/3+2(②)를 확인했으나 H15-SB-02 세부키는 보류한다.'],
  825: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_EXTREMA', 'y=(x−2)²+k−4의 구간 최솟값 5에서 k=9, 끝점 최댓값 14(②)를 확인했으나 H15-SB-02 세부키는 보류한다.'],
  826: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_DISCRIMINANT', 'x축과 만나지 않음 조건 D<0에서 2a<0, 자연수 해가 없어 개수 0(①)을 확인했으나 H15-SB-02 세부키는 보류한다.'],
  827: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_VERTEX', '근의 합 2로 축 x=1을 정하고 꼭짓점이 직선 위라 k=−3, f(2)=−2(①)를 확인했으나 H15-SB-02 세부키는 보류한다.'],
  828: ['EVIDENCE_MISSING_HOLD', 'H15-SB-02-QUADRATIC_GRAPH', '문항이 요구하는 그림이 패킷에 포함되지 않았고 해설도 “도형 검토 후 보완 필요” 상태다. ㄴ의 d<0 등 그림 의존 조건을 독립 확인할 근거가 없어 정답을 확정하지 않는다.'],
  829: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-REMAINDER_THEOREM', '나머지를 R=a(x−1)²+x−4로 두고 R(3)=3을 적용해 a=1, R=x²−x−3을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  830: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_FUNCTION', 'f(−1)=f(5)로 축 x=2, 꼭짓점 y=−3, 절편 거리 2로 a=3을 얻어 f(0)=9를 확인했으나 H15-SB-02 세부키는 보류한다.'],
  831: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_FACTOR', 'x(x+3)와 (x+1)(x+2)를 묶어 (x²+3x+1)²로 인수분해하고 x=10에서 131²을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  832: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_FUNCTION', '교점 조건으로 f=a(x−1)²+4a−10, 구간 최솟값 8에서 a=9/2, 100a=450을 확인했으나 H15-SB-02 세부키는 보류한다.'],
  833: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-02-QUADRATIC_MAXIMUM', '막대 수로 2(a+b)=18, 넓이 4ab를 세워 a,b=4,5에서 최대 80을 확인했으나 H15-SB-02 세부키는 보류한다.'],
  834: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_EXTREMA', '두 함수를 완전제곱식으로 바꾸어 최댓값 9와 최솟값 −10, 합 −1(②)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  835: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_ROOTS', 'x절편 −1,3에서 y=(x+1)(x−3), a=−2,b=−3, 합 −5(⑤)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  836: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_DISCRIMINANT', '두 허근 조건 D/4=6k−12<0에서 자연수 k=1만 가능해 개수 1(①)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  837: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-POLYNOMIAL_FACTOR', 'P(−1)=0과 조립제법으로 P=(x+1)²(2x−7), a=1,b=2,c=−7, 합 −4(③)를 확인했으나 H15-SA-03 세부키는 보류한다.'],
  838: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-ALGEBRAIC_IDENTITY', '(x−y)²로 xy=−1을 얻고 세제곱 차 공식으로 52(①)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  839: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_COEFFICIENT', 'x=1,−1 대입값 0,−64를 더해 짝수차 계수합 −32(⑤)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  840: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_COEFFICIENT', '전개식 x³,x² 계수로 a+b=4, ab=7을 얻어 a³+b³=−20(①)을 확인했으나 H15-SA-01 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003821840V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 821 && record.sequenceOrder <= 840)
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
        answerVerification: decision[0] === 'EVIDENCE_MISSING_HOLD' ? 'EVIDENCE_MISSING_HOLD' : 'INDEPENDENT_RECHECK_CONFIRMED',
        candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE',
        candidateSubUnitKey: decision[1],
        independentRationale: decision[2]
      };
    });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = {
    schemaVersion: 'archive-sequential-batch-003-821-840-adjudication-v1',
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
  const report = adjudicateSequentialBatch003821840V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
