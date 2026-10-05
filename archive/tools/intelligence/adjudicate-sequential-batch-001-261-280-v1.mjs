import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const batchPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-review-batch-001-v1.json');
const candidatePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-candidate-classification-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
    261: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '원점을 지나는 y=ax와 점 (4,3)의 거리를 3으로 두어 a=0,24/7의 두 직선을 확인했다.'],
    262: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-COORDINATE_METRIC', '무게중심 G=(1,1)을 구하고 두 축·직선 대칭으로 최단경로 √10을 확인했으나 복합 최단경로 하위키는 보류한다.'],
    263: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '두 함수의 세로 차와 사각형 넓이를 이차식 -2t²+6t로 정리해 t=3/2, 최댓값 9/2를 확인했다.'],
    264: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', '삼차방정식의 근과 계수 관계로 세 근의 합 1을 확인했다.'],
    265: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-DISCRIMINANT', '중근 조건 판별식 16-4k=0에서 k=4를 확인했다.'],
    266: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '완전제곱식의 구간 양 끝 함숫값 2,5를 비교해 최댓값 5를 확인했다.'],
    267: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-SYSTEM_INEQUALITY', '두 일차부등식의 공통범위 1<x<4와 a+b=5를 확인했으나 연립 하위키는 보류한다.'],
    268: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', 'x+1/x 치환으로 t=3,-2를 얻고 서로 다른 실근 합 2를 확인했다.'],
    269: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '절댓값 기준점 -1,1로 구간을 나누어 정수 해 -1,0,1 세 개를 확인했다.'],
    270: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-SUBSTITUTION_SYSTEM', '첫 식을 두 직선으로 인수분해해 네 해를 구하고 α+β 최댓값 3을 확인했다.'],
    271: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-03-FACTORIZATION_BASIC', '두 일차식의 곱을 계수 비교해 a=1,b=2,k=2를 확인했다.'],
    272: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '점 (0,t)를 지나는 포물선 접선의 기울기 조건 m²=t와 수직 조건으로 t=1을 확인했으나 접선 하위키는 보류한다.'],
    273: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '각 원의 중심·반지름과 축까지 거리를 비교해 x축에만 접하는 보기가 ②임을 확인했다.'],
    274: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '완전제곱식으로 반지름 제곱을 확인해 한 점만 나타내는 ④를 원이 아닌 식으로 판정했다.'],
    275: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '원점에서 각 직선까지 거리를 반지름 √10과 비교해 접선이 아닌 ③을 확인했다.'],
    276: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 교점 (2,-1)을 구하고 기울기 -3에 수직인 기울기 1/3으로 방정식을 확인했다.'],
    277: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '원 넓이를 이등분하려면 중심을 지나야 함을 적용해 두 중심을 잇는 2x+3y-1=0, a+b=-1을 확인했다.'],
    278: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '고정 밑변 AB=13과 원 중심-직선 거리에 반지름을 더한 최대 높이로 넓이 121/2를 확인했다.'],
    279: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '중심과 외부점 거리 5, 반지름 3에서 접점현까지 거리 24/5를 확인했다.'],
    280: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '점에서 원에 그은 접선의 기울기 방정식 판별로 두 기울기 곱 -4/3을 확인했다.']
};

export function adjudicateSequentialBatch001261280V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 261 && record.sequenceOrder <= 280).map(record => {
        const decision = manualDecisions[record.sequenceOrder];
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
        schemaVersion: 'archive-sequential-batch-001-261-280-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001261280V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-261-280-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-261-280-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
