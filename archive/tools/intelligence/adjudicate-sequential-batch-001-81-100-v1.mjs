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
    81: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '반사점과 직선까지의 최단거리로 t=1, B=(-2,3), 합 2(⑤)를 확인했다.'],
    82: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '거리 제곱 상한 2가 k=-3에서 달성됨을 확인했다.'],
    83: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '각의 이등분선 정리로 C의 자취와 최대 넓이 15(③)를 확인했으나 비율·자취 하위키를 보류한다.'],
    84: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '꼭짓점 이동 후 (2,-4) 조건으로 a=-3,b=1을 확인했다.'],
    85: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', 'P(x)-x의 근과 P의 최솟값 조건으로 a=1/3, P(5)=11을 확인했다.'],
    86: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '직선 대입 근의 합과 내분점 조건으로 p=0,q=3,k=5를 확인했다.'],
    87: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C-06-SYSTEM', 's=x+y,p=xy 치환으로 가능한 쌍을 열거해 최솟값 4(②)를 확인했다.'],
    88: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C-06-INEQUALITY', '소금 48g 보존과 농도 범위로 200≤x≤400, 합 600(⑤)을 확인했다.'],
    89: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C-06-INEQUALITY', '두 부등식 공통 정수 5,6의 합 11(④)을 확인했다.'],
    90: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C-06-INEQUALITY', '전구간 음수 조건 a<0 및 판별식 조건으로 a≤-1(①)을 확인했다.'],
    91: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-01-COORDINATE_METRIC', '벡터 내적 (a,-5)·(b,a)=0에서 a≠0을 사용해 b=5(⑤)를 확인했다.'],
    92: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-SECTION_RATIO', '넓이비와 직선 조건으로 C=(-3/2,11/2), 합 4(④)를 확인했으나 내분·넓이 하위키를 보류한다.'],
    93: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-SECTION_RATIO', '내분점 3, 외분점 -6으로 PQ=9(③)를 확인했으나 section 하위키를 보류한다.'],
    94: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-SECTION_RATIO', '세 외분점 좌표와 무게중심으로 a+b=15(①)를 확인했으나 section 하위키를 보류한다.'],
    95: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-01-SECTION_RATIO', '각의 이등분선 비 2:1로 D=(4/3,-5/3), 합 -1/3(①)을 확인했으나 ratio 하위키를 보류한다.'],
    96: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-02-LINE_EQUATION', '두 점으로 m=1/2,n=2, mn=1(①)을 확인했다.'],
    97: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-02-RELATION', '교점 (-1,-2)를 지나 원점까지 거리 최대인 수직선의 y절편 -5/2(⑤)를 확인했다.'],
    98: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-02-RELATION', '두 직선까지 거리 등식에서 a=-1/3,1, 합 2/3(⑤)을 확인했다.'],
    99: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-CIRCLE_EQUATION', '완전제곱식으로 중심 (4,-3), 반지름 7, 합 8(②)을 확인했다.'],
    100: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-CIRCLE_EQUATION', '두 축 접선 중심 경우를 모두 확인해 반지름 2,10, 둘레 합 24π(④)을 확인했다.']
};

export function adjudicateSequentialBatch00181100V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 81 && record.sequenceOrder <= 100).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-81-100-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch00181100V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-81-100-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-81-100-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
