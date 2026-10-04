import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');

/** Third human semantic-review batch for the remaining auto_medium candidates. */
const decisions = {
    qid_v1_8455d8a2b8d8141932437e9cbadd67b6743e281258c0af1cc7f8d959baf22ddd: { disposition: 'partial_manual_review', note: '포물선과 원의 교점이 지름을 이룬다는 조건, 원의 방정식과 직선의 절편을 함께 다룬다. 일차함수 두 점 후보는 오분류다.' },
    qid_v1_87dfd7564526306254c5142c4a7e92a3d6e8c3afbbb783e7b47ec93b1873478b: { disposition: 'partial_manual_review', note: 'x²에 대한 이차식으로 환원하는 사차방정식과 네 실근 조건을 다룬다. 일반 이차방정식 판별식 후보만으로는 유형이 부족하다.' },
    qid_v1_8c7d7042859b5d2b3297a38c0f3e1e0a5c421e41732c9afa4fa2d42cf230d684: { disposition: 'partial_manual_review', note: '무리함수와 직선의 접선 조건을 이용하는 문항이다. 판별식은 접선 판정의 보조 수단이므로 이차방정식 후보를 통과시키지 않는다.' },
    qid_v1_9153a2d75691d8d358efa005a9dfbc27190768426d10b467d05eef25df9e1cf5: { disposition: 'reviewed_pass', note: '실수 매개변수와 무관하게 특정 근을 갖는 이차방정식 조건을 적용한다. 복소수와 이차방정식 후보가 일치한다.' },
    qid_v1_bd278f69cb7d7e1c24bd08a46fa5ac8167108441fd6775b63e7e51280061645a: { disposition: 'partial_manual_review', note: '정사각뿔의 닮음·부피와 a³+b³ 인수분해를 함께 다룬다. 피타고라스 길이 계산 후보는 핵심 유형이 아니다.' },
    qid_v1_cbfca4fb4153786f9bf54721339b38690586c3cf56a87c4a98e77b56bd60a9fa: { disposition: 'partial_manual_review', note: '두 좌표축에 접하는 원의 중심과 반지름을 부호별로 분류하는 원의 방정식 문항이다. 판별식 후보만으로는 부정확하다.' },
    qid_v1_8bfd5d376cf2d600dfec853b72daa95a9daafc2f2d1be85e8eec6ae413bcfb60: { disposition: 'partial_manual_review', note: '연립방정식을 합과 곱으로 바꾼 뒤 한 쌍의 해 조건을 판단한다. 판별식이 쓰이지만 여러 가지 방정식의 구조를 별도로 태깅해야 한다.' },
    qid_v1_9e83bdde4c28b3b47bda9c9eeb85c0ca581570349ea088bee6e818671e203895: { disposition: 'reviewed_pass', note: '이차방정식이 실근을 갖지 않는 조건 D<0을 직접 적용한다. 이차방정식 판별식 후보가 일치한다.' },
    qid_v1_7060643cd3fe5d63c5ac093b8ecd84d9f629d4ae50428bd86a9a11c675e1c769: { disposition: 'partial_manual_review', note: '인형별 선후관계를 지키는 작업 순서를 세는 여러 가지 순열 문항이다. 확률 경우 분류 후보는 오분류다.' },
    qid_v1_a371ab20a73dd9f48aee445331dbd0fcf6d3377fdad4d077913d01711e2ec17b: { disposition: 'partial_manual_review', note: '서로 다른 숫자의 배열에서 일의 자리 조건을 이용하는 확률 문항이다. case-split 템플릿 후보는 불필요하게 구체적이고 맞지 않는다.' },
    qid_v1_7df2a06f8682e574f1e2708816be7f9067cc9efb38086a8ccee7ee26b8a052d6: { disposition: 'reviewed_pass', note: '직선이 지나는 사분면으로 기울기와 y절편의 부호 조건을 구한다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_928cb28e41bde26b5061c9f57657ee7c79a4dc60919f62dcf29f881d80abd899: { disposition: 'reviewed_pass', note: '두 시점의 양을 지나는 일차함수로 감소량과 시점을 구한다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_cd6290f9fd5899dcbb15d2a10c39c376b5246cef992c46d162c7c00b2ccf245c: { disposition: 'reviewed_pass', note: '일차함수의 기울기·절편·사분면·평행을 판별한다. 일차함수 그래프 후보가 일치한다.' },
    qid_v1_54894b757a5e03e33bba8dcc3c2a4a43e9aa8b52b700ccb5bfddb0525506077d: { disposition: 'partial_manual_review', note: '30°와 45°를 이용하는 두 직각삼각형의 삼각비 문항이다. 피타고라스 길이 계산 후보는 핵심 단원을 잘못 잡았다.' },
    qid_v1_76dd55da73d9edb2aeb41cdd76997b70ec4a5d668fc94f00736038cde358937d: { disposition: 'reviewed_pass', note: '그래프 위 두 점에서 식을 구한 후 x절편을 구한다. 일차함수·두 점 템플릿 후보가 그림·해설과 일치한다.' },
    qid_v1_b04feee5df789e982dd463561c6668a898aa92bf8586a7d45cfee80df0a13a62: { disposition: 'partial_manual_review', note: '반복 시행의 세 범주 횟수를 제한하고 조건부확률을 구하는 문항이다. 일반 확률 경우 분류 후보는 세부 구조를 나타내지 못한다.' }
};

const segments = { advanced: [6, 5], subjective: [6, 1], track_h1: [6, 2], track_h2: [4, 2], track_m2: [6, 3], visual: [6, 3] };
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function selectBatch(items) {
    const byCohort = Object.groupBy(items.filter(item => item.candidate.tagStatus === 'auto_medium'), item => item.cohort);
    const selected = [];
    for (const [cohort, [start, count]] of Object.entries(segments)) {
        const candidates = (byCohort[cohort] || []).sort((a, b) => a.questionUid.localeCompare(b.questionUid));
        if (candidates.length < start + count) throw new Error(`${cohort}: insufficient auto_medium records for batch 3`);
        selected.push(...candidates.slice(start, start + count));
    }
    return selected;
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.dispositions).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    return `# Phase 1 Pilot — Medium-Confidence Semantic Review, Batch 3\n\n- Reviewed: ${report.totals.reviewedBatchRecords} auto_medium candidates\n- Total pilot records reviewed so far: ${report.totals.totalPilotReviewed}\n- Remaining auto_medium: ${report.totals.remainingAutoMedium}\n- Remaining pilot records: ${report.totals.remainingPending}\n- Production metadata write: none\n\n## Dispositions\n\n| Disposition | Count |\n|---|---:|\n${rows}\n\n## Result\n\nThe 16 records were manually reviewed against source content, solution, and necessary diagrams. Ten candidates were retained for manual review because the suggested category followed a secondary computation rather than the problem's mathematical core.\n`;
}

export function reviewMediumPilotBatchThree() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const batch = selectBatch(pilot.items);
    const missing = batch.filter(item => !decisions[item.questionUid]).map(item => item.questionUid);
    if (missing.length || Object.keys(decisions).length !== batch.length) throw new Error(`review decision set mismatch: ${missing.join(', ')}`);
    const prior = JSON.parse(fs.readFileSync(path.join(outputDir, 'medium-batch-2-semantic-review.json'), 'utf8'));
    const reviews = batch.map(item => ({ questionUid: item.questionUid, cohort: item.cohort, sourceArchiveFile: item.sourceArchiveFile, sourceOrdinal: item.sourceOrdinal, existingMetadata: item.existingMetadata, candidate: item.candidate, review: decisions[item.questionUid] }));
    const autoMediumCandidates = pilot.items.filter(item => item.candidate.tagStatus === 'auto_medium').length;
    const stableReport = {
        schemaVersion: 'phase1-pilot-medium-batch-3-review-v1',
        pilotDigest: pilot.digest,
        productionWriteAllowed: false,
        batchSelection: 'third lexical question UID segment in remaining cohorts; track_m1 and track_m3 excluded because no auto_medium candidates remain',
        totals: {
            autoMediumCandidates,
            reviewedBatchRecords: reviews.length,
            remainingAutoMedium: autoMediumCandidates - prior.totals.reviewedBatchRecords - 19 - reviews.length,
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
    const report = reviewMediumPilotBatchThree();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'medium-batch-3-semantic-review.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'medium-batch-3-semantic-review.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase1/pilot/review/medium-batch-3-semantic-review.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
