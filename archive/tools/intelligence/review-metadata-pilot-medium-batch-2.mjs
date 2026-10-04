import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Second deterministic, human semantic-review batch for auto_medium candidates. */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');

const decisions = {
    qid_v1_483cff3703d5ad981b36fa869fca5344126474ad03763f23711692b2f93672d9: { disposition: 'reviewed_pass', note: '매개변수 a, b의 부호 조건에서 각 이차방정식의 판별식을 비교해 항상 실근을 갖는 식을 판단한다. 이차방정식 판별식 후보가 일치한다.' },
    qid_v1_5fc909a0e4dbe66fa6964f5220c5f973e5bc2229660b1f1a8adb9536537353dd: { disposition: 'partial_manual_review', note: '지름, 접선의 수직 성질과 원의 반지름을 이용한 원의 성질 문항이다. 피타고라스 길이 계산 후보는 핵심 유형을 충분히 나타내지 못한다.' },
    qid_v1_5ff476f424a293db7e093b30e319086121801ae36a3f37f9868cf6b1607f5b07: { disposition: 'partial_manual_review', note: 'xy와 x+y가 주어진 대칭형 연립방정식에서 두 수를 구하는 여러 가지 방정식 문항이다. 이차방정식 판별식 후보는 보조 계산만 포착했다.' },
    qid_v1_2988714f519a23904ff05f6c112e1eedf4c46f1c4faaa1e1fc393d14e04e2478: { disposition: 'partial_manual_review', note: 'n의 배수 조건을 세어 확률의 덧셈정리를 적용하는 확률 문항이다. 이차방정식 판별식 후보는 핵심 단원과 다르다.' },
    qid_v1_4842e885e7118aab2ee214e40955ce81ace75dcb9947013fdff469a304867033: { disposition: 'partial_manual_review', note: '직각삼각형에서 삼각비의 정의를 적용하는 문항이다. 피타고라스 정리는 빗변 계산 보조 단계이므로 후보를 통과시키지 않는다.' },
    qid_v1_9d88b4d5f1dd925f353393e5c67014831cbab52d9767e34a276d60d34f4cbf18: { disposition: 'reviewed_pass', note: '동전의 개수를 제한한 뒤 가능한 정수해를 세어 지불 방법 수를 구한다. 경우의 수·확률 후보가 원문·해설과 일치한다.' },
    qid_v1_7d54c0e0e9769d5cbfbc8647d60c04f1b107d363acec487b44c4c114220cc13c: { disposition: 'reviewed_pass', note: '두 점을 지나는 직선의 기울기와 식으로 y절편을 구한다. 직선·두 점 템플릿 후보가 일치한다.' },
    qid_v1_864bbf183c88565ed1d9aa6865fb383da6a507346fff89d0ce0e193e41579576: { disposition: 'partial_manual_review', note: '실근 조건, 근과 계수의 관계, 매개변수 범위에서의 최솟값을 함께 다룬다. 판별식 단일 템플릿으로는 유형이 과도하게 축약된다.' },
    qid_v1_8843154832ce67e9a3141d405afc230dd5a341db679db2e9c205eaf5a1138f80: { disposition: 'partial_manual_review', note: '두 근의 제곱합을 근과 계수의 관계로 바꾸고 매개변수 범위에서 극값을 구한다. 판별식 후보만으로는 핵심 풀이를 나타내지 못한다.' },
    qid_v1_4e8dbf61ac2db6ad4a38e37d2056adb44c65709c606817a9dffc09bc2213afb7: { disposition: 'partial_manual_review', note: '첫 추출 결과에 따라 시행이 달라지는 조건부확률 문항이며 마지막 물음은 역조건부확률 구조다. 일반 확률 경우 분류 후보는 부정확하다.' },
    qid_v1_6fd3a1949d95d09da6bb811a8f7712c095a1996685bb48f6fbbc21e0f304dbfa: { disposition: 'partial_manual_review', note: '연속함수 f(x)-x의 부호 변화에 중간값 정리를 적용하는 문항이다. 이차방정식 판별식 후보는 오분류다.' },
    qid_v1_54b0a4ed33d7c6f5103ef3fe7f1b6f502d725848fa4e37b2b461875c6c73dd44: { disposition: 'reviewed_pass', note: '닮은 직각삼각형으로 만든 피타고라스 나무에서 단계별 정사각형 넓이 합을 연결한다. 피타고라스 정리 후보가 그림·해설과 일치한다.' },
    qid_v1_69b3232970c01fe6e8a23789f3f04163dffd28799c679399333233658802dcbb: { disposition: 'reviewed_pass', note: '정사각형 좌표와 두 직선 조건을 이용해 일차함수의 식을 구한다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_7da0ba7cf3c8c470167caf6f126f082c5855133537676496ee9b0f49a20b4061: { disposition: 'reviewed_pass', note: '식을 일차함수 y=ax+b(a≠0)의 정의와 대조하는 문항이다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_6a32bb95990b7029a8511144cfc6f34cc417a90c578da69129cfcb6991f266af: { disposition: 'partial_manual_review', note: '원 밖 한 점에서 그은 두 접선의 길이가 같다는 원의 성질이 핵심이다. 피타고라스 계산은 보조이므로 후보를 통과시키지 않는다.' },
    qid_v1_9eb0781d7ce497700969b9ea3ae33f4fd7168b0d6f2ddffce3d740563747e96d: { disposition: 'partial_manual_review', note: '직각삼각형의 변 길이로 sin A의 정의를 적용하는 삼각비 문항이다. 피타고라스 길이 계산 후보는 핵심 단원을 잘못 잡았다.' },
    qid_v1_283cb181ff71c44beee4f23165108f2092f13731df19dd46ace6bad7bbdfef65: { disposition: 'reviewed_pass', note: '거리-시간 그래프에서 기울기로 속력을 읽고 만남 시각을 이용한다. 일차함수 그래프 후보가 그림·해설과 일치한다.' },
    qid_v1_4a81b492e51b7289bcc49f4a769bab51c6169a28974ef0ae298abdc106904a12: { disposition: 'partial_manual_review', note: '직각삼각형의 외접원·내접원 반지름과 넓이를 구하는 원의 성질 문항이다. 피타고라스 후보는 핵심 유형을 나타내지 못한다.' },
    qid_v1_5068a742bcc99fb3c7a7aa746d0182bd19789f8afce1a5abf3e8c1e465d61d2d: { disposition: 'reviewed_pass', note: '수평선과 평행하고 한 점을 지나는 직선의 방정식을 구한다. 일차함수 그래프 후보가 그림·해설과 일치한다.' }
};

const quotas = { advanced: 3, subjective: 3, track_h1: 3, track_h2: 2, track_m2: 3, track_m3: 2, visual: 3 };
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function selectBatch(items) {
    const byCohort = Object.groupBy(items.filter(item => item.candidate.tagStatus === 'auto_medium'), item => item.cohort);
    const selected = [];
    for (const [cohort, quota] of Object.entries(quotas)) {
        const candidates = (byCohort[cohort] || []).sort((a, b) => a.questionUid.localeCompare(b.questionUid));
        if (candidates.length < quota * 2) throw new Error(`${cohort}: insufficient auto_medium records for batch 2`);
        selected.push(...candidates.slice(quota, quota * 2));
    }
    return selected;
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.dispositions).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    return `# Phase 1 Pilot — Medium-Confidence Semantic Review, Batch 2\n\n- Reviewed: ${report.totals.reviewedBatchRecords} / ${report.totals.autoMediumCandidates} auto_medium candidates\n- Total pilot records reviewed so far: ${report.totals.totalPilotReviewed}\n- Remaining pilot records: ${report.totals.remainingPending}\n- Production metadata write: none\n\n## Dispositions\n\n| Disposition | Count |\n|---|---:|\n${rows}\n\n## Result\n\nThis second 19-record deterministic batch was manually reviewed against question content, solution, and required visual material. Eleven candidates remain in manual review because the auto candidate captured only a secondary calculation or the wrong mathematical domain.\n`;
}

export function reviewMediumPilotBatchTwo() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const batch = selectBatch(pilot.items);
    const missing = batch.filter(item => !decisions[item.questionUid]).map(item => item.questionUid);
    if (missing.length || Object.keys(decisions).length !== batch.length) throw new Error(`review decision set mismatch: ${missing.join(', ')}`);
    const prior = JSON.parse(fs.readFileSync(path.join(outputDir, 'medium-batch-1-semantic-review.json'), 'utf8'));
    const reviews = batch.map(item => ({ questionUid: item.questionUid, cohort: item.cohort, sourceArchiveFile: item.sourceArchiveFile, sourceOrdinal: item.sourceOrdinal, existingMetadata: item.existingMetadata, candidate: item.candidate, review: decisions[item.questionUid] }));
    const stableReport = {
        schemaVersion: 'phase1-pilot-medium-batch-2-review-v1',
        pilotDigest: pilot.digest,
        productionWriteAllowed: false,
        batchSelection: 'second lexical question UID segment within fixed per-cohort quotas; track_m1 excluded because it has no auto_medium candidates',
        totals: {
            autoMediumCandidates: pilot.items.filter(item => item.candidate.tagStatus === 'auto_medium').length,
            reviewedBatchRecords: reviews.length,
            remainingAutoMedium: pilot.items.filter(item => item.candidate.tagStatus === 'auto_medium').length - prior.totals.reviewedBatchRecords - reviews.length,
            totalPilotReviewed: prior.totals.totalPilotReviewed + reviews.length,
            remainingPending: pilot.items.length - prior.totals.totalPilotReviewed - reviews.length,
            dispositions: countBy(reviews.map(item => ({ disposition: item.review.disposition })), 'disposition'),
            cohorts: countBy(reviews, 'cohort')
        },
        reviews
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = reviewMediumPilotBatchTwo();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'medium-batch-2-semantic-review.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'medium-batch-2-semantic-review.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase1/pilot/review/medium-batch-2-semantic-review.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
