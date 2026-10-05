import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json');
const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json');
const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-901-920-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
  901: ['DRAFT_TAXONOMY_HOLD', 'H22-C-01-ALGEBRAIC_IDENTITY', 'x³−y³=(x−y)³+3xy(x−y)에 x−y=2, 차 20을 대입해 xy=2(②)를 확인했으나 H22-C-01 세부키는 보류한다.'],
  902: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_SEQUENCE', 'i의 4주기 항을 4개씩 묶어 각 합 2+2i, 전체 10+10i에서 a+b=20(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  903: ['ANSWER_SOURCE_DEFECT_HOLD', 'H22-C-04-COMPLEX_PROPERTY', '다) “z²이 허수이면 z도 허수”는 z=(1+i)/√2에서 반례가 되고, 마)의 복소수 부등호도 정의가 명확하지 않다. 해설은 다)를 잘못 참으로 판정했으므로 저장 정답 ④를 확정하지 않고 출처 결함 보류한다.'],
  904: ['DRAFT_TAXONOMY_HOLD', 'H22-C-04-COMPLEX_OPERATION', 'z z̄=2와 역수 켤레합 1을 계산해 전체 3(③)을 확인했으나 H22-C-04 세부키는 보류한다.'],
  905: ['DRAFT_TAXONOMY_HOLD', 'H22-C-03-POLYNOMIAL_FACTOR', 't=x² 치환으로 t²+3t+2=(t+1)(t+2), a=c=0,b=1,d=2, 합 3(③)을 확인했으나 H22-C-03 세부키는 보류한다.'],
  906: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_REMAINDER', 'P=(x+1)²(ax+b)+x+7로 두고 P(1)=P(2)=0을 풀어 a=1,b=−3, P(0)=4(④)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  907: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-POLYNOMIAL_DIVISION', '나눗셈 항등식 P=(x²+2x+3)²+x+2에 x=1을 대입해 39(③)를 확인했으나 H22-C-02 세부키는 보류한다.'],
  908: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-DISTANCE', '거리공식으로 √(4²+(-6)²)=2√13(②)을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  909: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-SECTION_FORMULA', 'B에 가장 가까운 4등분점의 내분비 3:1을 적용해 (−3,1/2)(③)을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  910: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-SECTION_FORMULA', '6등분 좌표에서 C가 FG를 3:4로 외분함을 확인해 ④를 독립 검산했으나 H22-C2-01 세부키는 보류한다.'],
  911: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-DISTANCE', '삼각부등식으로 PA+PB의 최솟값이 AB=6√2(②)임을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  912: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-LINEAR_FUNCTION', 'k별 대입으로 ㄱ,ㄴ,ㄷ 참·ㄹ 거짓을 확인해 ④를 재검산했으나 H22-C2-01 세부키는 보류한다.'],
  913: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-LINEAR_RELATION', '수직·평행 조건으로 ab=3,a+b=4를 얻어 a³+b³=28(④)을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  914: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-LINEAR_GEOMETRY', '두 직선 교점 (3,−2)와 P(2,1)을 잇는 선분에 수직인 직선 x−3y−9=0(①)을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  915: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-LINEAR_INTERSECTION', '직선군의 고정점 (−2,−1)을 찾고 A,B를 지나는 경계 m=1/7,−2/7, 합 −1/7(②)을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  916: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-QUADRATIC_GEOMETRY', '직각삼각형 좌표에서 거리 제곱합의 최소점 무게중심 (3,2), 합 78(④)을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  917: ['DRAFT_TAXONOMY_HOLD', 'H22-C-02-SYNTHETIC_DIVISION', '계수 2,−3,−1,2를 2로 조립제법해 몫 2x²+x+1, 나머지 4를 확인했으나 H22-C-02 세부키는 보류한다.'],
  918: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-AREA_BISECTION', '삼각형 넓이 12의 절반과 직선 절편 좌표로 k²/14=6, 양수 k=2√21을 확인했으나 H22-C2-01 세부키는 보류한다.'],
  919: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-DISTANCE', '점과 직선 거리식 |a²+a+1|=5|a|을 부호별로 풀어 2±√3,−3±2√2를 확인했으나 H22-C2-01 세부키는 보류한다.'],
  920: ['EVIDENCE_MISSING_HOLD', 'H22-C-03-RECIPROCAL_POLYNOMIAL', 'B(x),C(x)의 구체적인 차수·형태·인수 조건이 본문에 없어 a=0,b=2라는 해설 결론을 재현할 수 없다. 추가 출처가 없으므로 근거 부족 보류한다.']
};

export function adjudicateSequentialBatch004901920V1() {
  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
  const records = batch.records.filter(record => record.sequenceOrder >= 901 && record.sequenceOrder <= 920).map(record => {
    const decision = manualDecisions[record.sequenceOrder];
    if (!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate = candidateBySequence.get(record.sequenceOrder);
    const hold = decision[0] !== 'DRAFT_TAXONOMY_HOLD';
    return { sequenceOrder: record.sequenceOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, adjudicationStatus: decision[0], answerVerification: hold ? decision[0] : 'INDEPENDENT_RECHECK_CONFIRMED', candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE', candidateSubUnitKey: decision[1], independentRationale: decision[2] };
  });
  const counts = {};
  for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
  const stablePayload = { schemaVersion: 'archive-sequential-batch-004-901-920-adjudication-v1', batchDigest: batch.digest, candidateDigest: candidates.digest, productionWriteAllowed: false, totals: { records: records.length, answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, wordingReviewRequired: records.filter(record => record.answerVerification !== 'INDEPENDENT_RECHECK_CONFIRMED').length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) }, records };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() { const report = adjudicateSequentialBatch004901920V1(); fs.mkdirSync(reviewDir, { recursive: true }); fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2)); }
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
