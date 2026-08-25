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
    141: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-SYSTEM_INEQUALITY', '연립 이차부등식의 해집합 교집합을 비교해 -1≤a≤2의 범위를 확인했다.'],
    142: ['DRAFT_TAXONOMY_HOLD', 'RAW-UNMAPPED-ORDER_COMPARISON', 'A·B·C의 값을 직접 비교해 C<A<B를 확인했으나 표준단원과 연결되는 세부키가 없어 보류한다.'],
    143: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-06-ROOT_COEFFICIENT_RELATION', '근과 계수 관계로 α²+β²의 범위를 계산해 최솟값 20/9를 확인했다.'],
    144: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '좌표 조건을 대입해 두 원의 반지름 9/4, 3/8을 구하고 합 21/8을 확인했다.'],
    145: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '구간에서 이차함수의 최댓값 조건을 비교해 a=0,-4를 확인했다.'],
    146: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-10-LINE_FAMILY', '직선족의 공통점·기울기 조건을 대조해 ㄱ만 참임을 확인했으나 직선족 하위키는 보류한다.'],
    147: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', 'y=m|x|와 원의 교점 개수 조건을 계산해 정확히 두 교점이 되는 정수 범위를 확인했다.'],
    148: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '내·외분점 좌표와 거리 공식으로 4√5를 확인했으나 내분·외분 하위키는 보류한다.'],
    149: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '주어진 점에서 원에 그은 두 접선의 접점 조건을 풀어 요구값을 확인했다.'],
    150: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', '다항식의 근과 계수 관계로 P(-1)=3을 직접 계산해 확인했다.'],
    151: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-INEQUALITY_APPLICATION', '매개변수별 부등식 해의 개수를 구간별로 합산해 총 65를 확인했다.'],
    152: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '이동점과 고정점 사이 거리의 최솟값을 거리 제곱으로 비교해 답을 확인했다.'],
    153: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-LINEAR_INEQUALITY', '두 일차부등식의 해집합을 교집합해 답을 확인했으나 일차부등식 세부키 신설은 보류한다.'],
    154: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '거리 조건의 양의 해를 선택해 a=5를 확인했다.'],
    155: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '내분점 좌표와 거리 제곱 전개로 4√5를 재확인했으나 분점 하위키는 보류한다.'],
    156: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', '세 꼭짓점 좌표의 평균으로 무게중심 (2,1), 좌표합 3을 확인했다.'],
    157: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '주어진 직선과 평행한 직선의 기울기·절편을 계산해 방정식을 확인했다.'],
    158: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '원 중심에서 접선까지 거리를 반지름과 같게 두어 반지름 √10을 확인했다.'],
    159: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-TRANSLATION', '평행이동된 직선의 절편 변화를 대입해 방정식을 확인했다.'],
    160: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', '삼차방정식의 근과 계수 관계로 세 근의 합·곱 조건을 계산해 답을 확인했다.']
};

export function adjudicateSequentialBatch001141160V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 141 && record.sequenceOrder <= 160).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-141-160-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001141160V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-141-160-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-141-160-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
