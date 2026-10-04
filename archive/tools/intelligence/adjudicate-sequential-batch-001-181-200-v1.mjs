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
    181: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '절댓값 부등식을 이중부등식으로 바꾸어 정수 해 세 개를 확인했다.'],
    182: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '평행선의 기울기를 같게 두고 점을 대입해 y=2x-1을 확인했다.'],
    183: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '완전제곱식으로 중심 (3,-1), 반지름 3을 구해 식의 값을 13으로 확인했다.'],
    184: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '중점 (0,2)과 원래 선분에 수직인 기울기 -1/2를 이용해 x절편 4를 확인했다.'],
    185: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '각의 이등분선 정리로 BD:DC=2:3을 적용해 a+b=18/5를 확인했으나 분점 하위키는 보류한다.'],
    186: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '둘레에서 현 AB=8을 구하고 중심-현 거리 3, 직선까지 거리 |k|/5를 비교해 양의 k=15를 확인했다.'],
    187: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', '켤레·역수 관계와 주기 합을 이용해 참인 보기가 ㄴ,ㄷ임을 확인했다.'],
    188: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-SYSTEM_INEQUALITY', '첫 부등식은 양의 정수에서 자동이고, 인수분해한 두 번째 조건으로 1/2≤a<1을 확인했으나 연립 하위키는 보류한다.'],
    189: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 평행 조건에서 a=1을 선택하고 평행선 사이 거리의 제곱 1/5를 확인했다.'],
    190: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '중점·외분점 좌표의 높이와 밑변을 비교해 넓이비 k=2를 확인했으나 분점 하위키는 보류한다.'],
    191: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-INEQUALITY_APPLICATION', '구간에서 각각의 최솟값·최댓값 조건을 적용해 a≤-1/2, b≥4 및 최솟값 5를 확인했다.'],
    192: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '두 접선까지의 거리 조건으로 중심 (r,√3r), 접점·교점 좌표를 구해 9r²=48을 확인했다.'],
    193: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', 'f+g의 영점 조건과 f-g의 꼭짓점 조건으로 g(x)=-a(x+6)(x-2), 양의 정수 해 7개를 확인했다.'],
    194: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '두 점에서 직선까지의 거리 합을 제곱해 최댓값 M²=5가 k=1에서 달성됨을 확인했다.'],
    195: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', 'P(-1)=0 조건으로 a=1,2를 얻고 판별식 조건으로 a=1을 선택해 세 근의 곱 -2를 확인했다.'],
    196: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '중심에서 두 좌표축까지 거리 4,3을 비교해 네 교점 조건이 k>4임을 확인했다.'],
    197: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', 'x+1을 인수로 분리하고 치환한 이차식의 두 양근 조건과 판별식으로 k>4를 확인했다.'],
    198: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '현 길이와 평행선상의 원 교점 개수를 구간별로 계산해 f(t)=mt가 세 근을 갖는 m=√3/2를 확인했다.'],
    199: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '좌표 차 5,-5를 거리 공식에 대입해 5√2를 확인했다.'],
    200: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', '기울기에서 a=3, 점 대입에서 b=-2를 구해 a+b=1을 확인했다.']
};

export function adjudicateSequentialBatch001181200V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 181 && record.sequenceOrder <= 200).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-181-200-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001181200V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-181-200-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-181-200-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
