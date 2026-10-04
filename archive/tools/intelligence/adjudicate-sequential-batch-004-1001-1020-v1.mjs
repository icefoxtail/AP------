import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-1001-1020-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  1001: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_POWER', 'z=−i의 4주기에서 30쌍을 정리하면 마지막 두 항만 0−2=−2, 즉 ②를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  1002: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_ROOTS', '두 근 사이에 3이 있으려면 f(3)=9−2n<0, 따라서 정수 최소 n=5(③)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  1003: ['DRAFT_TAXONOMY_HOLD', 'RAW-다항식의성질', 'x=0 대입, x=1 대입 및 일차식 계수비교로 ㄱ·ㄴ·ㄷ 모두 참, ⑤를 확인했으나 세부키는 보류한다.'],
  1004: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_ROOTS', 'α+β=3a, αβ=a+1, αβ(α+β)=36 및 αβ>0에서 a=3; 새 근 2,4로 b=−6,c=8, 합 5(②)를 확인했으나 H15-SA-05 세부키는 보류한다.'],
  1005: ['DRAFT_TAXONOMY_HOLD', 'RAW-다항식의변형', 'x+1/x=3에서 x³+1/x³=18,x⁴+1/x⁴=47이고 곱에서 x+1/x를 빼 843(④)를 확인했으나 세부키는 보류한다.'],
  1006: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-04-COMPLEX_POWER', '첫 복소수의 위상은 π/4, 둘째는 π/6이므로 합이 0이 되는 최소 자연수 n=12(③)를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  1007: ['DRAFT_TAXONOMY_HOLD', 'RAW-다항식의결정', 'P(0),P(2)∈{0,1}과 P(1)P(−1)=0을 연립해 가능한 6개 이차식의 상수항 합 4를 확인했으나 세부키는 보류한다.'],
  1008: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_INTERSECTION', '꼭짓점 최댓값 k+6=8에서 k=2, 교점 α=1,β=4, 구간 최솟값 f(1)=4(②)를 확인했으나 H15-SA-13 세부키는 보류한다.'],
  1009: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-02-POLYNOMIAL_DIVISION', '(x−3)² 인수 조건으로 a=−45,b=81, f(1)=40을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  1010: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-13-QUADRATIC_FUNCTION', '축 위치별 최솟값 조건에서 유효한 a=4를 얻고 [1,3] 최댓값 f(1)=22를 확인했으나 H15-SA-13 세부키는 보류한다.'],
  1011: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-ALGEBRAIC_IDENTITY', '(5x−3y−z)²의 yz항은 2(−3y)(−z)=6yz, 즉 ②를 확인했으나 H22-C-01 세부키는 보류한다.'],
  1012: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', 'α+β=4, αβ=2이므로 1/α+1/β=2(③)를 확인했으나 H22-C-05 세부키는 보류한다.'],
  1013: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '(1−i)/(1+i)=−i,(1+i)/(1−i)=i이므로 a=0,b=−2,a−b=2(①)를 확인했으나 H22-C-04 세부키는 보류한다.'],
  1014: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_TANGENCY', 'x축 접점 조건 a²−4a−6=0의 두 실근 곱 −6(①)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1015: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', 'P(−1)=0에서 a=3, P를 x−1로 나눈 몫 Q=3x²+6, Q(1)=9(④)을 확인했으나 H22-C-02 세부키는 보류한다.'],
  1016: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', '각 제곱근 항을 계산해 z=−9+2√3i, a²+b²=81+12=93(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  1017: ['DRAFT_TAXONOMY_HOLD', 'H22-C-05-QUADRATIC_ROOTS', '새 근은 (225−α)/9,(225−β)/9이므로 합 (450−27)/9=47(⑤)을 확인했으나 H22-C-05 세부키는 보류한다.'],
  1018: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_FUNCTION', 'g(1)=−8,g(3)=8,g(5)=40으로 합 40(④)을 확인했으나 H22-C-06 세부키는 보류한다.'],
  1019: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', '900×890+9=(895−4)(895+4)=891×899, 1023으로 약분해 783(⑤)을 확인했으나 H22-C-03 세부키는 보류한다.'],
  1020: ['DRAFT_TAXONOMY_HOLD', 'H22-C-06-QUADRATIC_INTERSECTION', '교점 방정식 x²−2x−k=0에서 f(k)=4+4k,g(k)=−k, 조건으로 양의 k=16(②)을 확인했으나 H22-C-06 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00410011020V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 1001 && record.sequenceOrder <= 1020).map(record => {
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
    schemaVersion: 'archive-sequential-batch-004-1001-1020-adjudication-v1',
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
  const report = adjudicateSequentialBatch00410011020V1();
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
