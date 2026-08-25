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
    101: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-TANGENT', '수직 기울기 2인 두 접선의 절편 차 5√2(③)를 확인했다.'],
    102: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-INTERSECTION', '두 원과 직선의 거리 조건을 교집합해 정수 k 9개(②)를 확인했다.'],
    103: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-TANGENT', 'OP²=41, OQ²=9에서 접선 길이 4√2(⑤)를 확인했다.'],
    104: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-TANGENT', '접선 조건 n²=16(m²+1)로 f(-4)f(4)=16(④)을 확인했다.'],
    105: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C-06-INEQUALITY', '절댓값 구간을 나눠 해 [-3/2,3/2]를 확인했다.'],
    106: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-CIRCLE_EQUATION', '원의 반지름 제곱 조건과 축 접선 조건의 반례로 ㄱ,ㄴ 모두 거짓임을 확인했다.'],
    107: ['DRAFT_TAXONOMY_HOLD', 'H22-C2-03-CIRCLE_EQUATION', '외분 변환으로 자취 중심 (7,0), 반지름 3, 합 10을 재계산했으나 자취 하위키를 보류한다.'],
    108: ['CONFIRMED_DRAFT_CANDIDATE', 'H22-C2-03-CIRCLE_EQUATION', '직각삼각형 내접원 중심 (-2,2), 방정식 계수합 4를 확인했다.'],
    109: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-LINEAR_INEQUALITY', '연쇄 일차부등식 해 [1,3], 합 4(④)를 확인했으나 선형 부등식 하위키가 필요하다.'],
    110: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', 'x축 위 등거리 조건으로 P=(3,0)(③)을 확인했다.'],
    111: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '세 변 내분점의 무게중심 (5,-1)(⑤)을 재계산했으나 section 하위키를 보류한다.'],
    112: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '두 기울기 수직 조건으로 a=1/3(②)을 확인했다.'],
    113: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '기울기 일치 해 중 동일 직선을 제거해 m=-2(①)를 확인했다.'],
    114: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '완전제곱식 중심 (1,-4), 반지름 5로 합 2(④)를 확인했다.'],
    115: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '지름 길이 10에서 반지름 5, 넓이 25π(③)를 확인했다.'],
    116: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', '다항식에 x=2를 대입해 근 곱 9(①)를 확인했다.'],
    117: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-07-SYSTEM_OF_EQUATIONS', '공통해 (2,1)에서 a=-9,b=4, 합 -5(⑤)를 확인했으나 연립 하위키를 보류한다.'],
    118: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '구간 끝점 비교로 a=2,b=9, 합 11(②)을 확인했다.'],
    119: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-INEQUALITY_APPLICATION', '가격·판매량 비율 매출 부등식에서 20≤x≤80, 합 100(③)을 확인했다.'],
    120: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-SYSTEM_INEQUALITY', '첫 해집합과 두 해집합의 정수 교집합이 하나가 되는 최대 a=6(③)을 확인했다.']
};

export function adjudicateSequentialBatch001101120V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 101 && record.sequenceOrder <= 120).map(record => {
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
        schemaVersion: 'archive-sequential-batch-001-101-120-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001101120V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-101-120-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-101-120-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
