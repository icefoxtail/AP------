import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * First bounded manual adjudication checkpoint for the source-order batch.
 * These decisions are review evidence only; they never update the active
 * master or source JS.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const batchPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-review-batch-001-v1.json');
const candidatePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-candidate-classification-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions = {
    1: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-REFLECTION', '좌표를 (x,y)→(y,x)로 바꾸는 y=x 대칭으로 재계산했다.'],
    2: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '0<x<4의 자연수 1,2,3을 직접 세어 정답 3(④)을 확인했다.'],
    3: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', '세 꼭짓점 좌표 평균으로 (3,4), 합 7(②)을 재계산했다.'],
    4: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '원점과 직선의 거리를 3/5(③)로 직접 계산했다.'],
    5: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-07-SYSTEM_OF_EQUATIONS', '두 방정식의 공통해를 직접 대입해 보기의 해 아님을 확인했으나 이 세부키는 추가 taxonomy 후보다.'],
    6: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '접선 x+3y=10의 x절편 10(⑤)을 재계산했다.'],
    7: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-REFLECTION', '원의 중심 (1,-2)를 원점 대칭해 (-1,2), a=-1(②)을 확인했다.'],
    8: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', 'x축 위 등거리 조건으로 P=(7,0), 합 7(⑤)을 재계산했다.'],
    9: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-TRIANGLE_CENTROID_AREA', 'A를 지나는 넓이 이등분선이 BC 중점을 지나므로 기울기 1(①)을 확인했다.'],
    10: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '두 고정점 사이 거리의 최솟값이 √13이므로 m²=13(④)을 확인했다.'],
    11: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-INTERSECTION', '중심-현 거리 3, 현 길이 8, 삼각형 넓이 12(③)를 재계산했다.'],
    12: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-DISTANCE_RATIO_LOCUS', '거리비 1:2의 자취가 중심 (2,0), 반지름 2인 원이어서 넓이 4π(③)임을 확인했다.'],
    13: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', 'Q=(5/2,0), PQ의 기울기 2, 절편 -5이므로 m-n=7(④)을 확인했다.'],
    14: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-COMPOSITE_TRANSFORMATION', '포물선 꼭짓점 이동으로 (k,-k), 접선 수직 조건으로 k=2(⑤)를 재계산했다.'],
    15: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-SYSTEM_INEQUALITY', '두 해집합이 겹치지 않는 자연수 범위 2≤a≤3.5에서 최댓값 3(①)을 확인했다.'],
    16: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-COMPOSITE_TRANSFORMATION', 'm=4,n=2, 두 원 중심거리 4√5에서 지름 2를 빼 4√5-2, 값 20(④)을 확인했다.'],
    17: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-ABSOLUTE_INEQUALITY', '절댓값 포함 부등식의 정수해를 p=-1/2에서 6개로 직접 확인했으나 활용 하위키 경계가 남아 있다.'],
    18: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-ROOT_LOCATION_CONDITION', 'f(-1)>0, f(1)<0에서 -3<a<-3/5, 정수 -2,-1의 합 -3을 확인했으나 새 후보키다.'],
    19: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '세 교점과 변 길이로 내심 (23/15,34/15)을 재계산했다.'],
    20: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '각의 이등분선 y=x-7과 음의 중심 조건으로 원 방정식을 재계산했다.']
};

export function adjudicateSequentialBatch001First20V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.map(record => {
        const decision = manualDecisions[record.sequenceOrder];
        const candidate = candidateBySequence.get(record.sequenceOrder);
        if (!decision) {
            return {
                sequenceOrder: record.sequenceOrder,
                questionUid: record.questionUid,
                sourceArchiveFile: record.sourceArchiveFile,
                sourceOrdinal: record.sourceOrdinal,
                adjudicationStatus: 'PENDING_MANUAL_REVIEW',
                answerVerification: 'PENDING',
                candidateStatus: candidate?.candidateStatus ?? 'UNKNOWN',
                candidateSubUnitKey: candidate?.candidateSubUnitKey ?? '',
                independentRationale: ''
            };
        }
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
        schemaVersion: 'archive-sequential-batch-001-first20-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: {
            records: records.length,
            adjudicatedRecords: records.filter(record => record.answerVerification !== 'PENDING').length,
            answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length,
            status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')))
        },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch001First20V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-first20-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-first20-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
