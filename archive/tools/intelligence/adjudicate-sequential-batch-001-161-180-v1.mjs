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
    161: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-07-SUBSTITUTION_SYSTEM', '연립방정식에 대입해 중근 (x,y)=(1,-2), 합 -1을 확인했으나 연립 하위키의 확정은 보류한다.'],
    162: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '절댓값 기준점 -1,2로 구간을 나누어 정수 해 -1,0,1,2 네 개를 확인했다.'],
    163: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', 'f-g가 모든 실수에서 양수가 되는 최고차항·판별식 조건을 적용해 -2≤m<1을 확인했다.'],
    164: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '세 직선 중 세 번째 직선이 첫째·둘째와 각각 수직이 되는 두 a값을 구해 곱 -3/2를 확인했다.'],
    165: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-10-LINE_FAMILY', '매개변수 직선족의 공통점 (-2,1)을 구하고 거리 √5를 확인했으나 직선족 하위키는 보류한다.'],
    166: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '원점과 직선 사이 거리가 반지름보다 커야 함을 적용해 |k|>2를 확인했다.'],
    167: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '완전제곱으로 중심 (1,-2), 반지름 √5를 구한 뒤 접선 길이 2√5를 확인했다.'],
    168: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-COMPOSITE_TRANSFORMATION', 'f(-y,x+2)의 좌표 대응을 역으로 대입해 (1,2)가 (0,-1)로 이동함을 확인했다.'],
    169: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '직사각형을 펼친 최단경로의 수평·수직 차 9,12에서 거리 15를 확인했다.'],
    170: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-SYSTEM_INEQUALITY', '첫 부등식의 정수 범위와 (x-a)(x-2)>0의 교집합을 조사해 -3<a≤-2를 확인했으나 연립 하위키는 보류한다.'],
    171: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', 'ω의 주기 3과 1+ω+ω²=0을 이용해 세 항 합 -3/2를 반복하고 전체 합 -7을 확인했다.'],
    172: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '내분점 좌표와 행렬식으로 S=3T/10을 확인했으나 분점·넓이 결합 하위키는 보류한다.'],
    173: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '현 AB의 길이와 45° 원주각으로 반지름을 구하고 가능한 중심의 원점 거리 최댓값 10을 확인했다.'],
    174: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '기준 직선 기울기 1/3의 음의 역수 -3을 사용해 y=-3x-9를 확인했다.'],
    175: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-SUBSTITUTION_SYSTEM', '두 연립식의 공통해 (1,1)을 구해 a=3, b=-4를 확인했다.'],
    176: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '수직 조건 ab=4와 평행 조건 a=b-3을 연립해 두 경우 모두 a²+b²=17을 확인했다.'],
    177: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-FOLDING_CENTROID_AREA', '무게중심과 접는 선의 수직이등분선으로 D,E를 구해 k-S=1/2를 확인했으나 접기 하위키는 보류한다.'],
    178: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '두 점의 좌표 차 3,4로 거리가 5임을 확인했다.'],
    179: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', 'x⁴-16을 인수분해해 근 ±2, ±2i를 구하고 근이 아닌 값 1을 확인했다.'],
    180: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', '점 (1,3), 기울기 1에서 y=x+2, m+n=3을 확인했다.']
};

export function adjudicateSequentialBatch001161180V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 161 && record.sequenceOrder <= 180).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-161-180-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001161180V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-161-180-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-161-180-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
