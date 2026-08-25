import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-1121-1140-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  1121: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-ALGEBRAIC_IDENTITY', 'x+y=2,x²+y²=6에서 xy=−1, x³+y³=8−3(−1)(2)=14(②)을 확인했으나 H22-C-01 세부키는 보류한다.'],
  1122: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_OPERATION', 'x² 계수 16, y 계수 −4a를 비교해 a=−4(④)를 확인했으나 H22-C-01 세부키는 보류한다.'],
  1123: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-QUADRATIC_DISCRIMINANT', '보기의 판별식을 비교해 x²−5x+9=0만 D<0, ③을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1124: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', '근의 합 a=5, 곱 b=−3에서 a+b=2(②)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1125: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', '축 x=3이 구간 오른쪽에 있어 y는 감소, x=−1에서 최댓값 11(⑤)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1126: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_IDENTITY', '계수비교로 a=2,b=−1,c=4, a−b+c=7(①)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1127: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '복소수 상등에서 a+1=7,b=3, a−b=3(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1128: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_TANGENCY', '2x²−x+k의 판별식 1−8k=0에서 k=1/8(④)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1129: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_POWER', '원방정식 근 3,−1의 세제곱 27,−1에서 새 방정식 x²−26x−27=0(①)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1130: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 'f가 일차식이 되도록 (x+1)(x+a)²의 x² 계수를 0으로 해 a=−1/2, f(11)=9(⑤)을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1131: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_REMAINDER', 'R(1)=5,R(2)=15에서 R=10x−5, 2a+b=15(③)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1132: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_TANGENCY', '판별식 항등식에서 a=1,b=−3, a+b=−2(②)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1133: ['EVIDENCE_MISSING_HOLD', 'H22-C-06-QUADRATIC_GEOMETRY', '포물선의 구체적 방정식·직사각형 배치 그림이 패킷에 없어 둘레 최댓값 8을 독립 검증할 수 없다.'],
  1134: ['ANSWER_SOURCE_DEFECT_HOLD', 'H22-C-04-COMPLEX_POWER', 'z²이 음의 실수가 되는 a=−1에서 RHS=1이고 w=(1−i)/√2의 주기는 8이므로 300 이하 해 개수는 37인데 저장 답 40과 불일치한다.'],
  1135: ['ANSWER_SOURCE_DEFECT_HOLD', 'H22-C-05-QUADRATIC_INTERSECTION', 'f=x²+px+q로 두고 α=t,β=2t 및 f(1)=3을 적용하면 k=−3+3t−2t²의 최댓값은 t=3/4에서 −15/8(③)인데 저장 답 13/8과 불일치한다.'],
  1136: ['ANSWER_SOURCE_DEFECT_HOLD', 'H22-C-05-PIECEWISE_FUNCTION', '직접 교점 분석 시 x=0,1은 항상 만나고 1<a<4에서 x=a가 추가되어 연속적으로 정확히 3점이므로 a=4는 4점, 저장 답이 유일하지 않다.'],
  1137: ['ANSWER_SOURCE_DEFECT_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', '조립제법 표에서 a=1,b=−2,c=−5, 따라서 P(5)=61인데 저장 답 11과 불일치한다.'],
  1138: ['ANSWER_SOURCE_DEFECT_HOLD', 'H22-C-01-VOLUME', '지름 합 8, 겉넓이 합 40π에서 반지름은 1,3, 부피합 aπ=112π/3이므로 8a=896/3으로 저장 답 125와 불일치한다.'],
  1139: ['ANSWER_SOURCE_DEFECT_HOLD', 'H22-C-05-QUADRATIC_FUNCTION', 'f=(x−2)²+6의 길이 2 구간 변동 g는 최소 1이므로 g=1/2 해가 없고, g=1은 1개,g=3/2는 2개여서 합 3, 저장 답 6과 불일치한다.'],
  1140: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-POLYNOMIAL_OPERATION', 'A+B=x³+x²+x+6에서 x의 계수 1(①)을 확인했으나 H22-C-01 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00411211140V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 1121 && record.sequenceOrder <= 1140).map(record => {
    const decision = manualDecisions[record.sequenceOrder];
    if (!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate = candidateBySequence.get(record.sequenceOrder);
    const hold = decision[0] !== 'DRAFT_TAXONOMY_HOLD';
    return { sequenceOrder: record.sequenceOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, adjudicationStatus: decision[0], answerVerification: hold ? decision[0] : 'INDEPENDENT_RECHECK_CONFIRMED', candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE', candidateSubUnitKey: decision[1], independentRationale: decision[2] };
  });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = { schemaVersion: 'archive-sequential-batch-004-1121-1140-adjudication-v1', batchDigest: batch.digest, candidateDigest: candidates.digest, productionWriteAllowed: false, totals: { records: records.length, answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, wordingReviewRequired: records.filter(record => record.answerVerification !== 'INDEPENDENT_RECHECK_CONFIRMED').length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) }, records };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() { const report = adjudicateSequentialBatch00411211140V1(); fs.mkdirSync(reviewDir, { recursive: true }); fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2)); }
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
