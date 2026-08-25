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
    221: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '좌표 차 4,-3을 거리 공식에 대입해 5를 확인했다.'],
    222: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', '45°의 기울기 1과 두 점의 기울기를 비교해 a=4를 확인했다.'],
    223: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '기준 기울기 -1/2의 수직 기울기 2를 구하고 점 대입으로 y=2x+3을 확인했다.'],
    224: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-TRANSLATION', '평행이동 결과에서 a=8,b=-8을 얻고 역이동해 원점 전 점 (3,-16)을 확인했다.'],
    225: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-SYSTEM_INEQUALITY', '두 일차부등식의 공통범위 존재 조건으로 a≤1, 최댓값 1을 확인했으나 연립 하위키는 보류한다.'],
    226: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-SUBSTITUTION_SYSTEM', '첫 식을 y=±2x로 나누어 대입하고 가능한 값 중 최댓값 5√6을 확인했다.'],
    227: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', 'm=1의 상수식과 m≠1의 완전제곱 최솟값을 분리해 1≤m<5를 확인했다.'],
    228: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '중점·3:1 내분 조건으로 두 점 (0,5),(4,-7)을 복원해 거리 4√10을 확인했으나 분점 하위키는 보류한다.'],
    229: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-10-LINE_FAMILY', '평행 두 경우와 세 직선 동시교점 a=-2/3을 구해 합 -2/3을 확인했으나 삼각형 퇴화 하위키는 보류한다.'],
    230: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '원점-직선 거리 5와 반지름 √R을 비교해 R=25의 1점 및 R=26~30의 2점씩, 총 11점을 확인했다.'],
    231: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '반지름 기울기의 수직인 접선 y=-x/2+4를 구해 축과의 삼각형 넓이 16을 확인했다.'],
    232: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-COMPOSITE_TRANSFORMATION', '평행이동 후 y=ax+2a+8을 대칭시켜 y=x/a-2-8/a를 얻고 y축 교점 조건에서 a=-8/7을 확인했다.'],
    233: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-12-FOLDING', '대각선 접힘의 겹친 삼각형을 피타고라스와 넓이 조건으로 계산해 a=2를 확인했으나 접기 하위키는 보류한다.'],
    234: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-SYSTEM_INEQUALITY', '첫 부등식의 정수 1~5 중 두 번째 조건이 n-1 하나만 제외하도록 n=2~6을 확인했으나 연립 하위키는 보류한다.'],
    235: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '각의 이등분선이 AC 중점을 지나므로 AB=BC, 양의 a=4를 확인했으나 각의 이등분·분점 하위키는 보류한다.'],
    236: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-12-COMPOSITE_TRANSFORMATION', '절편·내분·축대칭·무게중심을 순서대로 계산해 a+b=10/9를 확인했으나 복합 하위키는 보류한다.'],
    237: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '중심 (h,h-2)와 직선 x=1 접선 조건을 점 (-2,-7)과 연립해 중심 y좌표 -4,-16, 합 -20을 확인했다.'],
    238: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '현 AB 길이와 45° 원주각으로 두 중심 (0,4),(6,-8)을 구해 원점 거리 최댓값 10을 확인했다.'],
    239: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-SUBSTITUTION_SYSTEM', '둘레·대각선 조건에서 합 17, 곱 60인 이차방정식을 세워 변 5,12를 확인했다.'],
    240: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '두 원에 대한 직선 비교로 양의 정수 m 개수를 세어 k=7,8 및 합 15를 확인했다.']
};

export function adjudicateSequentialBatch001221240V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 221 && record.sequenceOrder <= 240).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-221-240-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001221240V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-221-240-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-221-240-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
