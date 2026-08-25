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
    41: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '내분·외분점의 넓이비로 k를 재계산했으나 기존 좌표/거리 후보와 다른 새 하위키가 필요하다.'],
    42: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-TRANSLATION', '(-1,5)에 (2,-1)을 더해 (1,4)(③)을 확인했다.'],
    43: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', '사차식 인수분해 근 -3,-1,1,2를 확인해 -2가 근 아님(②)을 확인했다.'],
    44: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '접선 3x+y=10에서 y=-3x+10, mn=-30(①)을 확인했다.'],
    45: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '근 -5,2 사이 해에서 α-β=-7(①)을 확인했다.'],
    46: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '-4≤x-3≤4에서 -1≤x≤7(④)을 확인했다.'],
    47: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-INEQUALITY_APPLICATION', '5x-7>13, 2x-3≤7의 공통 정수 x=5(⑤)를 확인했다.'],
    48: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-EQUATION_FUNCTION_RELATION', '꼭짓점과 양 끝값 비교로 M=4,m=0, 차 4(④)를 확인했다.'],
    49: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-DISCRIMINANT', '교점 방정식 판별식 13-4k>0에서 자연수 k 1,2,3, 개수 3(③)을 확인했다.'],
    50: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-12-COMPOSITE_TRANSFORMATION', '평행이동 후 원점대칭 중심을 일치시켜 a=4,b=2, 합 6(⑤)을 확인했다.'],
    51: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '세 구간을 나눠 정수해 0,1 두 개(③)를 직접 확인했다.'],
    52: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-05-QUADRATIC_FUNCTION_APPLICATION', '닮음으로 넓이 이차함수의 최댓값 20(⑤)을 확인했으나 새 활용 하위키가 필요하다.'],
    53: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '수직 접선 x=2를 빠뜨린 ㄱ이 첫 오류임을 확인했다.'],
    54: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-08-ALWAYS_TRUE_INEQUALITY', 'ㄱ만 참임을 확인했으나 항상 성립 판정용 새 하위키가 필요하다.'],
    55: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', 'ω³=8 및 두 허근의 합 -2로 값을 확인했다.'],
    56: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '대칭 원 중심거리 4√2, 사이 빈 거리 2√2에서 최소 원 넓이 2π(②)를 확인했다.'],
    57: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-SECTION_RATIO', '내분·외분 공식으로 최종점 (0,0)을 확인했으나 새 하위키가 필요하다.'],
    58: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-DISCRIMINANT', '모든 k에서 접하려면 판별식 계수와 상수항이 0, a=2,b=4, 합 6(⑤)을 확인했다.'],
    59: ['ANSWER_WORDING_HOLD', 'H15-SA-08-SYSTEM_INEQUALITY', '해석상 정수해가 x=5 하나인지 문장 확인이 필요하며, 그 해석에서는 5<a≤6이다.'],
    60: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-05-DISCRIMINANT', '첫 판별식 조건과 전구간 양수 조건의 교집합 정수 합 1(①)을 확인했다.']
};

export function adjudicateSequentialBatch0014160V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 41 && record.sequenceOrder <= 60).map(record => {
        const decision = manualDecisions[record.sequenceOrder];
        const candidate = candidateBySequence.get(record.sequenceOrder);
        return {
            sequenceOrder: record.sequenceOrder,
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            adjudicationStatus: decision[0],
            answerVerification: decision[0] === 'ANSWER_WORDING_HOLD' ? 'WORDING_REVIEW_REQUIRED' : 'INDEPENDENT_RECHECK_CONFIRMED',
            candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE',
            candidateSubUnitKey: decision[1],
            independentRationale: decision[2]
        };
    });
    const counts = {};
    for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
    const stablePayload = {
        schemaVersion: 'archive-sequential-batch-001-41-60-adjudication-v1',
        batchDigest: batch.digest,
        candidateDigest: candidates.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, answerRecheckConfirmed: records.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length, wordingReviewRequired: records.filter(record => record.answerVerification === 'WORDING_REVIEW_REQUIRED').length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = adjudicateSequentialBatch0014160V1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-41-60-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-41-60-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
