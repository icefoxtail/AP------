import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const batchPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-review-batch-002-v1.json');
const candidatePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-candidate-classification-batch-002-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const manualDecisions = {
    301: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-DISTANCE_RATIO_LOCUS', '원 위 점과 삼각형 변 위 점 사이 거리를 중심거리 ±반지름으로 바꾸고 OQ의 최댓값 5, 최솟값 2√2에서 Mm=6(2√2-1)을 확인했다.'],
    302: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-10-PARALLEL_PERPENDICULAR', '외분점 Q=(0,2), 평행 조건으로 P=(7,3), 직선 PQ의 n/m=14를 확인했으나 외분·평행 결합 하위키는 보류한다.'],
    303: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-10-DISTANCE_ANGLE', '두 직선 등거리 자취 두 각의 이등분선과 y=-x+5의 교점 두 개로 넓이 25/2를 확인했으나 등거리자취 하위키는 보류한다.'],
    304: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '지름 양끝의 중점 (2,-1), 반지름 √13을 구해 원 방정식을 확인했다.'],
    305: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-ABSOLUTE_INEQUALITY', '절댓값 기준 -2,2 세 구간에서 |x-2|+|x+2|>5의 해 x<-5/2 또는 x>5/2를 확인했다.'],
    306: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-09-COORDINATE_METRIC', '평행사변형을 좌표화해 두 대각선 제곱합과 변 제곱합이 같은 항으로 정리됨을 확인했으나 증명 하위키는 보류한다.'],
    307: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '교점 (2,3)을 구하고 거리 2인 직선 x=2, 기울기 5/12를 찾아 x절편 차와 높이로 넓이 54/5를 확인했다.'],
    308: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-08-QUADRATIC_INEQUALITY', '이차식의 두 근 1,3 사이에서만 음수임을 확인해 ab=3을 확인했다.'],
    309: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '원점과 (4,3)의 거리 5를 확인했다.'],
    310: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-09-COORDINATE_METRIC', '중점 (4,1)을 구해 p+q=5를 확인했다.'],
    311: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-LINE_EQUATION', 'y=4x+k에 (3,2)를 대입해 k=-10을 확인했다.'],
    312: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-DISTANCE_ANGLE', '점-직선 거리 공식으로 5/5=1을 확인했다.'],
    313: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-10-PARALLEL_PERPENDICULAR', '기울기 3의 수직 기울기 -1/3을 확인했다.'],
    314: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-CIRCLE_EQUATION', '표준형에서 중심 (-4,2), 반지름 2를 읽어 a+b+r=0을 확인했다.'],
    315: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-HIGHER_EQUATION', '삼차식 상수항으로 세 근의 곱 -6을 확인했다.'],
    316: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-11-TANGENT', '외부점에서 원에 그은 접점현이 4x+3y-5=0임을 접선 조건으로 확인했다.'],
    317: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-04-COMPLEX_ROOT', '1/ω^n의 세 항 주기 합이 0이고 30항은 10주기임을 확인했다.'],
    318: ['DRAFT_TAXONOMY_HOLD', 'H15-SA-10-LINE_FAMILY', '매개변수에 무관한 공통점 P=(-5,2)를 구하고 축과의 삼각형 넓이 36을 확인했으나 직선족 하위키는 보류한다.'],
    319: ['DRAFT_TAXONOMY_HOLD', 'H15-SB-03-GRAPH_INEQUALITY', '그래프의 상대적 위치로 공통구간 -2<x<-1을 확인했으나 그래프 판독 하위키는 보류한다.'],
    320: ['CONFIRMED_DRAFT_CANDIDATE', 'H15-SA-07-SUBSTITUTION_SYSTEM', 'x-y=3을 대입해 판별식 45-8k>0, 자연수 최댓값 k=5를 확인했다.']
};
export function adjudicateSequentialBatch002301320V1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8')); const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8')); const candidateBySequence = new Map(candidates.records.map(record => [record.sequenceOrder, record]));
    const records = batch.records.filter(record => record.sequenceOrder >= 301 && record.sequenceOrder <= 320).map(record => { const decision = manualDecisions[record.sequenceOrder]; const candidate = candidateBySequence.get(record.sequenceOrder); return { sequenceOrder: record.sequenceOrder, questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, adjudicationStatus: decision[0], answerVerification: 'INDEPENDENT_RECHECK_CONFIRMED', candidateStatus: candidate?.candidateStatus ?? 'MANUAL_CANDIDATE', candidateSubUnitKey: decision[1], independentRationale: decision[2] }; });
    const counts = {}; for (const record of records) counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
    const stablePayload = { schemaVersion: 'archive-sequential-batch-002-301-320-adjudication-v1', batchDigest: batch.digest, candidateDigest: candidates.digest, productionWriteAllowed: false, totals: { records: records.length, answerRecheckConfirmed: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) }, records };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}
function main() { const report = adjudicateSequentialBatch002301320V1(); fs.mkdirSync(outputDir, { recursive: true }); fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-002-301-320-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-002-301-320-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2)); }
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
