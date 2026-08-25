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
    21: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '축과 직선에 접하는 같은 반지름 원의 중심거리 조건으로 M+m=-12를 재계산했다.'],
    22: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '근 -4,2를 비교해 a=2,b=-8, 합 -6(①)을 확인했다.'],
    23: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-TRANSLATION', '(-2,3) 평행이동 후 교점 (0,2)를 대입해 a=1(②)을 확인했다.'],
    24: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-ALWAYS_TRUE_INEQUALITY', 'ㄱ,ㄹ만 항등적 제곱합으로 항상 성립함을 확인했으나 별도 하위키가 필요하다.'],
    25: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', '무게중심 공식으로 C=(4,11)(⑤)을 재계산했다.'],
    26: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '완전제곱식에서 반지름 제곱 17/4-2k>0, k<17/8(③)을 확인했다.'],
    27: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '계수 내적 k(k+2)+k=0에서 k=0,-3, 합 -3(①)을 확인했다.'],
    28: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-COMPOSITE_TRANSFORMATION', 'x=1, y=3에 대한 순차 대칭으로 꼭짓점 (-1,5), 식을 확인했다.'],
    29: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', 'AB 직선과 y축 교점 C=(0,11/3), 거리비 조건도 만족함을 확인했다.'],
    30: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', 'V자 그래프 두 가지와의 교점 조건으로 2/3<m<3, 합 11/3(②)을 확인했다.'],
    31: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '두 원의 공통현과 중심-현 거리를 이용해 넓이 3√5(④)를 확인했다.'],
    32: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '그래프 차의 이차식이 항상 양수인 정수 a의 합 4(④)를 확인했다.'],
    33: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-COMPOSITE_TRANSFORMATION', '대칭·평행이동 대응으로 둘러싸인 영역이 6×6=36(④)임을 확인했다.'],
    34: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-REFLECTION', 'y=x 대칭에서 |PP\'-QQ\'|=|y-x|의 최댓값 3√2(③)를 확인했다.'],
    35: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '접점현의 극선 3x+4y-15=0에서 a+b+c=-8(①)을 확인했다.'],
    36: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', 'QR에 수직인 직선족의 공통점 (3,3), 제곱합 18(②)을 확인했다.'],
    37: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-SYSTEM_INEQUALITY', '공통 정수해 4~8만 남기는 조건 8≤a<9를 확인했다.'],
    38: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', 'PQ=PS에서 t=10/7, PR=4/7을 재계산했다.'],
    39: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '두 원을 모두 가로지르는 직선 기울기 범위의 양끝 곱 -1/4를 확인했다.'],
    40: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '세 원의 교점 수를 접선 경계로 나눠 3/4<m<1 또는 1<m<15/8을 확인했다.']
};

export function adjudicateSequentialBatch0012140V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 21 && record.sequenceOrder <= 40).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-21-40-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch0012140V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-21-40-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-21-40-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
