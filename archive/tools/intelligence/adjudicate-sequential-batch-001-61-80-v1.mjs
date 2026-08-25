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
    61: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-07-SYSTEM_OF_EQUATIONS', '두 식의 인수분해와 원의 교점으로 네 해를 재계산했으나 연립방정식 하위키가 추가로 필요하다.'],
    62: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-06-ROOT_COEFFICIENT_RELATION', '근의 합·곱 범위와 한 자리 조건으로 a=1,b=6,c=3을 확인했다.'],
    63: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '대칭 그래프 교점 수를 k 구간별로 재계산했으나 함수 교점용 세부키 경계를 보류한다.'],
    64: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '거리식 (a+1)^2+16=25와 양수 조건으로 a=2(②)를 확인했다.'],
    65: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '-7≤2x-3≤7에서 구간 [-2,5], 합 3(⑤)을 확인했다.'],
    66: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '평행 기울기 -2를 대입해 a=1(③)을 확인했다.'],
    67: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '원점에서 3x-y±k=0까지 거리 2 조건으로 k=2√10(③)을 확인했다.'],
    68: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '완전제곱식에서 반지름 제곱 -a-1>0, 정수 최댓값 -2(①)를 확인했다.'],
    69: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '두 거리의 절댓값을 같게 해 a=0,2, 합 2(④)를 확인했다.'],
    70: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '접선 -2x+3y=13이 두 번째 원 중심을 지나도록 a=5(⑤)를 확인했다.'],
    71: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '중심 (a,-2)의 y=x 대칭이 (-2,a)이고 목표 중심 (-2,-1), 반지름 3, 합 2(④)를 확인했다.'],
    72: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', '평행사변형 대각선 관계로 a+b=5,c=1, 삼각형 무게중심 합 3(③)을 확인했다.'],
    73: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '넓이비 3:1로 BC 내분점 (3,4), a-b=-1(②)을 확인했으나 내분 하위키를 보류한다.'],
    74: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', 'f(-x) 치환으로 해 x≤-6 또는 x≥3(①)을 확인했다.'],
    75: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '중심 (a,a+1), x축 접선과 점 통과 조건으로 중심 (2,3), 넓이 9π(④)를 확인했다.'],
    76: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-SYSTEM_INEQUALITY', '연립해의 정수 -2를 대입해 m>2, 최솟값 3(⑤)을 확인했다.'],
    77: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '판별식 0 후보 중 a=2는 공집합, a=-4만 단일해라서 합 -4(②)를 확인했다.'],
    78: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-SYSTEM_INEQUALITY', '두 해집합의 정수 교집합이 없도록 a=3,4,5, 합 12(⑤)를 확인했다.'],
    79: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', 'AC=2√2로 D=(-1,4), 수직이등분선 y=2와 BC 교점 (-7,2), 값 -1(②)을 확인했다.'],
    80: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '현 AB의 수직이등분선과 y축 교점에서 a=5(④)를 확인했다.']
};

export function adjudicateSequentialBatch0016180V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 61 && record.sequenceOrder <= 80).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-61-80-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch0016180V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-61-80-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-61-80-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
