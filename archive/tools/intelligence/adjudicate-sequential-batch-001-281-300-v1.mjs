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
    281: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '두 축에 동시 접하는 중심 조건 |a|=|b|를 포물선과 연립해 반지름별 넓이 합 16π을 확인했다.'],
    282: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-03-FACTORIZATION_BASIC', '완전제곱과 제곱의 차로 (x-1-√2)(x-1+√2)를 직접 확인했다.'],
    283: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', 'ω의 주기 6과 z=ω^n의 세제곱근 조건으로 n≡2,4 (mod 6), 50 이하 17개를 확인했다.'],
    284: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '무게중심 좌표를 역변환해 원 위 P 조건을 대입하고 G의 자취 원 (x-3)^2+(y+2)^2=4를 확인했다.'],
    285: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '현 AB 길이와 45° 원주각에서 두 중심을 수직이등분선 위로 계산해 (2,-2),(6,6)을 확인했다.'],
    286: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '2:1 내분점 공식으로 (1,5)를 확인했으나 분점 하위키는 보류한다.'],
    287: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', '기울기 2인 y=2x+b에 점 (-2,1)을 대입해 절편 5를 확인했다.'],
    288: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '점-직선 거리 공식으로 분자 15, 분모 5를 계산해 거리 3을 확인했다.'],
    289: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '두 직선을 같은 법선형으로 정리해 평행·불일치 조건 a≠1/2 및 알맞지 않은 값을 확인했다.'],
    290: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '평행 조건에서 a=-2, 수직 조건에서 b=-1을 구해 합 -3을 확인했다.'],
    291: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '완전제곱으로 중심 (2,3), 반지름 4를 구해 a+b+r=9를 확인했다.'],
    292: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '모든 실수에서 비음수인 조건 판별식≤0으로 -2≤a≤5, 정수합 12를 확인했다.'],
    293: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '평행선 거리 공식으로 |1-k|=10, k=-9,11 및 곱 -99를 확인했다.'],
    294: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-INEQUALITY_APPLICATION', '사과 배분량을 1≤19-2x<6으로 정리해 자연수 최댓값 9를 확인했다.'],
    295: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-FLOOR_INEQUALITY', '일반 이차부등식과 바닥함수 조건의 교집합 -3≤x<3을 확인했으나 바닥함수 하위키는 보류한다.'],
    296: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '수직 조건으로 접선 기울기 m=2를 정하고 원점 거리 조건에서 n²=25, 합 27을 확인했다.'],
    297: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-SUBSTITUTION_SYSTEM', 's=x+y,p=xy로 두어 s+p=11,sp=30의 두 경우를 비교해 x-y 최댓값 4를 확인했다.'],
    298: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '|x²-4|>5를 두 경우로 나누어 음의 정수 최댓값 -4를 확인했다.'],
    299: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '외부점-중심 거리 5와 반지름 2로 접촉현까지 거리 4/5, 25m²=336을 확인했다.'],
    300: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-INEQUALITY_APPLICATION', '혼합 농도 부등식으로 900≤x≤1200을 구해 보기 중 부적합한 800을 확인했다.']
};

export function adjudicateSequentialBatch001281300V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 281 && record.sequenceOrder <= 300).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-281-300-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001281300V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-281-300-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-281-300-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
