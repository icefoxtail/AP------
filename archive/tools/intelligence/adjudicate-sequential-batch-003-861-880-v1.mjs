import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-003-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-003-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-003-861-880-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  861: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_FACTOR', 'f=(x−1)²(x+3)로 인수분해해 f(21)=20²·24=9600(④)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  862: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-QUADRATIC_ROOTS', '켤레근 2±i에서 a=−4,b=5를 얻어 b−a=9(①)을 확인했으나 H15-SA-03 세부키는 보류한다.'],
  863: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-ALGEBRAIC_IDENTITY', 'a−b=4를 구하고 세제곱·제곱 차를 합산해 124+24+4=152(③)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  864: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-COMPLEX_POWER', '우변의 i 주기 합이 i이고 x+yi=i(1−2i)=2+i이므로 x+y=3(③)을 확인했으나 H15-SA-03 세부키는 보류한다.'],
  865: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-06-ABSOLUTE_INEQUALITY', '|x−4|<4에서 0<x<8, 정수합 28(③)을 확인했으나 H15-SA-06 세부키는 보류한다.'],
  866: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_FACTOR', '부피 다항식을 (x−2)²(x+5)로 분해해 r=x−2,h=x+5, f(4)=44(④)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  867: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-03-COMPLEX_SEQUENCE', '각 항을 i^n+(−i)^n으로 바꿔 주기 4를 확인해 ㄱ·ㄴ·ㄹ만 참인 ⑤를 확인했으나 H15-SA-03 세부키는 보류한다.'],
  868: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_REMAINDER', 'Q=x−a,R=상수로 차수를 정하고 R(3)=R(4), g(3)=5에서 a=−2를 얻어 f(1)−R(1)=−3(②)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  869: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_EXTREMA', 'y=−(x−a)²+a²의 축 위치를 구간별로 나누어 최댓값 5를 만족하는 a=3(④)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  870: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_IDENTITY', '항등식 계수와 상수항을 각각 0으로 두어 a=−2,b=−5, 합 −7을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  871: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-QUADRATIC_DISCRIMINANT', '실근 없음 D/4=1−k<0에서 최소 정수 k=2를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  872: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-06-CUBIC_FACTOR', 'x³−5x²−x+5=(x−1)(x+1)(x−5)로 분해해 실근합 5를 확인했으나 H15-SA-06 세부키는 보류한다.'],
  873: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-PERFECT_SQUARE', '공통합 x²−5x 치환으로 k=1, f=x²−5x+5, k+f(5)=6을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  874: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_TANGENCY', 'f+3의 접선 조건에서 k=1, f의 근의 합 −4를 사용해 α+β−k=−5를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  875: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-06-SYSTEM_INEQUALITY', '두 부등식 해를 −3a<x≤(a+2b)/2로 정리해 6<x≤8에서 a=−2,b=9, ab=−18을 확인했으나 H15-SA-06 세부키는 보류한다.'],
  876: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-POLYNOMIAL_OPERATION', 'A+2B−2(C+B)=A−2C로 소거한 뒤 3x²+2x−5(④)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  877: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_INTERSECTION', 'x²+2x=k가 실근을 갖지 않는 판별식 조건으로 k<−1(①)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  878: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-01-ALGEBRAIC_IDENTITY', 'x+y=2, xy=−1을 세제곱합 공식에 대입해 14(②)를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  879: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-VIETA_IDENTITIES', '근의 합 −6, 곱 −a와 차 4의 제곱 관계로 a=−5(②)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  880: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-FACTOR_THEOREM', 'P(1)=P(−2)=0 조건으로 a=−2,b=5를 구해 ab=−10(③)을 확인했으나 H15-SA-02 세부키는 보류한다.']
};

export function adjudicateSequentialBatch003861880V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records
    .filter(record => record.sequenceOrder >= 861 && record.sequenceOrder <= 880)
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
    schemaVersion: 'archive-sequential-batch-003-861-880-adjudication-v1',
    batchDigest: batch.digest,
    candidateDigest: candidates.digest,
    productionWriteAllowed: false,
    totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
    records
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
  const report = adjudicateSequentialBatch003861880V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
