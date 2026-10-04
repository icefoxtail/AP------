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
    121: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '세 직선 중 수직인 쌍을 비교해 a=2,-3/2, 곱 -3(②)을 확인했다.'],
    122: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '거리 분모의 최솟값 1/√2에서 f 최대 2√2(⑤)를 확인했다.'],
    123: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '|k|≤5인 정수 11개(④)를 확인했다.'],
    124: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', 'ω²+ω+1=0 및 켤레 관계로 ㄴ,ㄹ만 참(③)을 확인했다.'],
    125: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '고정 밑변과 포물선-직선 거리로 넓이 최솟값 47/2, 최댓값 84, 결과 37(①)을 확인했다.'],
    126: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '두 고정점 사이 거리 √17이 최솟값임을 확인했다.'],
    127: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '접선 x+2y-10=0과 두 번째 원의 비교에서 k=6,7,8,9 네 개를 확인했다.'],
    128: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-07-SYSTEM_OF_EQUATIONS', '연립식에서 x=-4,3, y=-3,4를 구해 합 최댓값 7을 확인했으나 연립 하위키를 보류한다.'],
    129: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-DISCRIMINANT', '기준근 1,5에서 부호가 바뀌는 정수 k=-2,-1 두 개를 확인했다.'],
    130: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', '교점 (-1,2)를 이용해 (1) y=-x+1, (2) 거리 √10/2를 확인했다.'],
    131: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', '세 좌표 평균으로 무게중심 (2,1)(①)을 확인했다.'],
    132: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '거리 공식으로 √5(④)를 확인했다.'],
    133: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', '원점 포함 좌표 넓이 1/2|2·3-4·5|=7(③)을 확인했다.'],
    134: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', '세 항씩 묶이는 1+ω+ω²=0으로 전체 합 0(①)을 확인했다.'],
    135: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-07-SYSTEM_OF_EQUATIONS', '판별식 0에서 x=y=k/2, 양의 k=4(④)를 확인했으나 연립 하위키를 보류한다.'],
    136: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '판별식 음수 조건 -2<a<3의 정수 4개(②)를 확인했다.'],
    137: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '중점 좌표 증명에서 C=(c,0), AC² 전개와 다항식 항을 확인했으나 증명/중점 하위키를 보류한다.'],
    138: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '대각선 중점으로 b=a+4, 변 길이로 a=3,b=7, 곱 21(③)을 확인했다.'],
    139: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '꼭짓점 최솟값으로 k=5, 끝점 최댓값 8(②)을 확인했다.'],
    140: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '구간별 절댓값 풀이로 [-1,2], 곱 -2(⑤)를 확인했다.']
};

export function adjudicateSequentialBatch001121140V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 121 && record.sequenceOrder <= 140).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-121-140-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001121140V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-121-140-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-121-140-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
