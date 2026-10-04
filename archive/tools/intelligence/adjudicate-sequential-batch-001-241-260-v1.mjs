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
    241: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '수직선 거리 |a-1|=4에서 a=-3,5를 얻어 합 2를 확인했다.'],
    242: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', '두 점을 잇는 직선의 기울기 1/2와 점 (a,3)을 대입해 a=2를 확인했다.'],
    243: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-REFLECTION', 'x축·y축·원점 대칭 좌표를 구해 밑변 4, 높이 6인 삼각형 넓이 12를 확인했다.'],
    244: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선의 기울기 일치 조건에서 a=5,-1을 얻고 같은 직선인 a=-1을 제외해 a=5를 확인했다.'],
    245: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '완전제곱으로 중심 (3,-2), 반지름 4를 구해 a+b+r=5를 확인했다.'],
    246: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '축에 동시 접하는 중심 (r,r)과 점 (2,1) 조건으로 r=1,5를 구해 합 6을 확인했다.'],
    247: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '모든 실수에서 이차식이 음이 아니도록 판별식≤0을 적용해 a의 최댓값 2를 확인했다.'],
    248: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '등거리 조건과 직선 β=α+1을 연립해 (α,β)=(-1/2,1/2), 합 0을 확인했다.'],
    249: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '대칭된 직선과 반지름 3 원의 현 길이가 지름 6이므로 중심이 직선 위에 있어 a=-1임을 확인했다.'],
    250: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', '실근 -1을 분리하고 허근의 합·곱으로 α²+β²=-2를 확인했다.'],
    251: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-10-PARALLEL_PERPENDICULAR', '내분점 C=(1,-1)을 구한 뒤 AB에 수직인 직선 x-2y-3=0과 a+b=-1을 확인했으나 내분 결합 하위키는 보류한다.'],
    252: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '평행이동 직선 x+2y-4-2k=0과 원의 중심 거리 조건으로 정수 k=-2~3, 6개를 확인했다.'],
    253: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '거리 분모 2(k+1)^2+18을 최소화해 a=-1,b=1/√2 및 a²/b²=2를 확인했다.'],
    254: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-TRIANGLE_AREA_RATIO', '평행선과 넓이비 조건으로 d=1,-3을 구해 x좌표 곱 -3을 확인했으나 넓이비 하위키는 보류한다.'],
    255: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '고정 밑변에서 최대 높이를 주는 평행 접선을 구해 3x-y+5√10=0, ab=15√10을 확인했다.'],
    256: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '원점에서 직선까지의 수선 발 방향 m=3/4에서 지름 4, 넓이 4π 및 mS=3π를 확인했다.'],
    257: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '수직 조건으로 P=(3,0)을 확정하고 y축 대칭으로 최단거리 4√2를 확인했다.'],
    258: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '두 접선이 수직인 조건으로 P=(1,3)을 구하고 접선 기울기 이차식의 합 -3/2를 확인했다.'],
    259: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-TRANSLATION', '평행이동 식 -2a+b=6에서 원점과 직선 사이 최단거리 제곱 36/5를 확인했다.'],
    260: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '교점 근의 합·곱과 삼각형 넓이로 합 1, 곱 -2를 구해 α³+β³=7을 확인했다.']
};

export function adjudicateSequentialBatch001241260V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 241 && record.sequenceOrder <= 260).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-241-260-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001241260V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-241-260-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-241-260-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
