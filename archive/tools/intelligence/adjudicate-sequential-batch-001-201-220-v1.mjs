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
    201: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '이차부등식의 두 근 1,6을 구해 구간 길이 β-α=5를 확인했다.'],
    202: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', '세 꼭짓점 좌표의 평균으로 무게중심 (2,4), 곱 ab=8을 확인했다.'],
    203: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', 'P(t,0)으로 두고 두 거리 제곱 합을 완전제곱해 최솟값 4와 P(-4,0)을 확인했다.'],
    204: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '접선 ax+by=25와 두 번째 원의 중심 거리 조건으로 3<a≤5를 얻어 정수 a=4,5 및 곱 20을 확인했다.'],
    205: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', 'AB 기울기 1/2의 수직이등분선 기울기 -2와 평행 조건을 비교해 a=10을 확인했다.'],
    206: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-INEQUALITY_APPLICATION', '의자 수 x에 대해 7(x-4)+1≤5x+21≤7(x-3)을 세워 21≤x≤24, 합 45를 확인했다.'],
    207: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_NUMBER_OPERATION', 'z=(1+i)/√2의 주기와 w³=-1을 비교해 최소 n=12를 확인했다.'],
    208: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', '유리계수 다항식의 켤레근 2-√2를 보완하고 치환근의 합 4를 확인했다.'],
    209: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '√((x-3)²)=|x-3|로 바꿔 세 구간을 분석해 해 x≤-4/3 또는 x≥0, 값 -4를 확인했다.'],
    210: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '점 P를 지나는 두 접선의 기울기 0,21/20을 구해 세로선과의 교점 간격 및 12S=70을 확인했다.'],
    211: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '두 이차부등식의 해 존재·부재 조건을 판별식으로 비교해 정수 k=3,4 및 곱 12를 확인했다.'],
    212: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-11-INSCRIBED_CIRCLE_TRIANGLE', '세 직선의 교점으로 직각삼각형을 만들고 내접반지름 5/4, 둘레 5π/2를 확인했으나 내접원 하위키는 보류한다.'],
    213: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '내분점 공식으로 a=14,b=3을 구해 a-b=11을 확인했으나 분점 하위키는 보류한다.'],
    214: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', 'AB 직선 x+y+1=0과 수선의 발 (0,-1)을 구해 선분까지 거리 제곱 32를 확인했다.'],
    215: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-SYSTEM_INEQUALITY', '절댓값 부등식과 이차부등식의 교집합 끝점을 계산해 p+q=12/5를 확인했으나 연립 하위키는 보류한다.'],
    216: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SEMICIRCLE_TANGENT', '대칭성으로 반원 중심과 두 접점을 구해 직사각형 넓이 3√3/4를 확인했으나 반원 접선 하위키는 보류한다.'],
    217: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '변환된 f의 해 구간 끝점을 비교해 k=-1을 얻고 바깥쪽 해로 2α+6β=22를 확인했다.'],
    218: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '각의 이등분선으로 AC를 √5:5로 내분한 D와 AD²를 계산해 원 방정식을 확인했으나 분점 하위키는 보류한다.'],
    219: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', '주어진 근 -1로 a=-1을 구하고 나머지 이차식 근의 합 3을 이용해 값을 2로 확인했다.'],
    220: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '절댓값 부등식을 -1<x<7로 바꿔 정수 7개를 확인했다.']
};

export function adjudicateSequentialBatch001201220V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 201 && record.sequenceOrder <= 220).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-201-220-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001201220V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-201-220-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-201-220-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
