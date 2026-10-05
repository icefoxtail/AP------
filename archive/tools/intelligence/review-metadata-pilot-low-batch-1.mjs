import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const exclusionPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'source-exclusions.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');

/**
 * The first human-classification batch for auto_low candidates.  These records
 * have no automatic detailed tag, so each remains pending master approval.
 */
const decisions = {
    qid_v1_1b1675a2c8615493667f50b6fbce23ec7204d03b2a980b1468291ab7e90fe173: { proposedReviewLabel: 'SOLID_NET_SKEW_LINES', note: '정육면체 전개도를 접은 뒤 모서리의 꼬인 위치를 판정하는 기본도형 문항이다.' },
    qid_v1_1ff700cb6b6266931a5bac977761ffa91cb06e2fe323f81dea82614853643fb5: { proposedReviewLabel: 'RECTANGULAR_PRISM_NET_SKEW_LINES', note: '직육면체 전개도를 이용해 특정 선분과 꼬인 위치에 있는 선분 수를 세는 입체도형 문항이다.' },
    qid_v1_045df5777c9e33cf0828c3f6411a3db33ea24f4e16700ec8a0bee47b6bdc5f42: { proposedReviewLabel: 'MATRIX_POLYNOMIAL_REDUCTION', note: '행렬이 만족하는 이차 다항식 관계를 사용해 높은 차수의 행렬식을 A와 E의 일차결합으로 줄인다.' },
    qid_v1_06bc4c93807bba49a618fda8fbfd1778b149597ed2f8cfc735066891f9afdbf2: { proposedReviewLabel: 'PRIME_FACTORIZATION_PERFECT_SQUARE', note: '소인수 지수의 짝홀을 이용해 곱이 완전제곱수가 되게 하는 최소 자연수를 구한다.' },
    qid_v1_02256508a88561cd5f74a649982b7220b805a65b4e95b52e6e4eb1ae37528722: { proposedReviewLabel: 'PERMUTATION_ENDPOINT_CONSTRAINT', note: '일렬 배열에서 양 끝자리에 특정 성별이 서는 조건을 적용하는 순열 문항이다.' },
    qid_v1_0440f2a373a963b0d16faeb159ff1af94d3fd89120b51ef549b974d6d27242ee: { proposedReviewLabel: 'PERMUTATION_PARITY_COMPOSITION', note: '서로 다른 숫자를 고른 뒤 홀짝 구성 조건을 만족하는 네 자리 수를 배열하는 조합·순열 문항이다.' },
    qid_v1_196302242a66f4b48af186e33659b9a834a6a23c6b2c218714320b3a0a4d2e37: { proposedReviewLabel: 'DERIVATIVE_TANGENT_LINE', note: '삼차함수의 접점과 미분계수로 접선의 방정식을 구한다.' },
    qid_v1_1f1776cc9a34b079c9aa356d606a3151c1660b4562bdfa2429832963c3ebb869: { proposedReviewLabel: 'TRIGONOMETRIC_DERIVATIVE_TANGENT', note: 'tan 함수의 도함수로 지정된 점에서의 접선 기울기를 구한다.' },
    qid_v1_02bdb9b9c1d6e3e3c616f3ae5a57f51a04c3bc92699c9ccfdde3f308ad0a67c3: { proposedReviewLabel: 'ANGLE_CHASING_POLYGON', note: '여러 교차선과 다각형의 내각 관계로 x+y를 구하는 기본도형 각도 문항이며 그림을 함께 확인했다.' },
    qid_v1_037dba26cb7eec5c20ed5a01d11d60c4d63c7d1ae6a8f16e3843b7a77c85a873: { proposedReviewLabel: 'POLYNOMIAL_OPERATION_SUBSTITUTION', note: '다항식의 덧셈·뺄셈 조건에서 식을 구한 뒤 특정 값에 대입한다.' },
    qid_v1_24ab42c5f0e1186703cb09c5869513ccd793bff5f3c8232dc14a59a59e7d7810: { proposedReviewLabel: 'SOLID_SIMILARITY_VOLUME_RATIO', note: '정사면체를 평행 절단했을 때 닮음비의 세제곱으로 각 입체의 부피를 구한다.' },
    qid_v1_28c4340ccbd64e74f3998c3818e154eabca823b0f19bc21101f7a3450c6b268d: { proposedReviewLabel: 'REPEATING_DECIMAL_CONVERSION', note: '순환소수를 분수식으로 바꾸어 미지수를 순환소수로 나타낸다.' },
    qid_v1_006d3d7fb3c9f11a0355c15b8df9cc7ec43e9de53da5b4e7d3171318ff7e23d3: { proposedReviewLabel: 'CIRCLE_ARC_CENTRAL_INSCRIBED_ANGLE', note: '같은 호의 중심각과 원주각 관계를 이용해 각의 크기를 구한다.' },
    qid_v1_0486393932dd534d0155b90c64b31d0d01e503dcae228e106306bc3f4daf564c: { proposedReviewLabel: 'QUADRATIC_FUNCTION_GRAPH_PROPERTIES', note: '이차함수의 계수 부호, 꼭짓점, 대칭축, 폭을 비교해 설명을 판정한다.' },
    qid_v1_03687c62b3dfe8bc238a6f47b7cc54f0c01f24f934ebd65d5315426578425a62: { proposedReviewLabel: 'FUNCTION_ITERATION_CYCLE', note: '그래프에서 함수 반복 합성의 순환 주기를 찾아 높은 반복 횟수를 계산한다.' },
    qid_v1_06ef9f43bb10f6367e3448289776e3a20ef56c519f26631f3f6c5d0ececea6da: { proposedReviewLabel: 'STATISTICS_MEDIAN_STANDARD_DEVIATION', note: '중앙값 조건으로 미지 자료를 정한 뒤 평균·분산·표준편차를 계산한다.' }
};

const cohorts = ['advanced', 'subjective', 'track_h1', 'track_h2', 'track_m1', 'track_m2', 'track_m3', 'visual'];
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function selectBatch(items, excludedFiles) {
    const eligible = items.filter(item => item.candidate.tagStatus === 'auto_low' && !excludedFiles.has(item.sourceArchiveFile));
    const byCohort = Object.groupBy(eligible, item => item.cohort);
    const selected = [];
    for (const cohort of cohorts) {
        const candidates = (byCohort[cohort] || []).sort((a, b) => a.questionUid.localeCompare(b.questionUid));
        if (candidates.length < 2) throw new Error(`${cohort}: expected at least 2 eligible auto_low records`);
        selected.push(...candidates.slice(0, 2));
    }
    return { eligible, selected };
}

function summaryMarkdown(report) {
    return `# Phase 1 Pilot — Low-Confidence Manual Classification, Batch 1\n\n- Reviewed: ${report.totals.reviewedBatchRecords} / ${report.totals.eligibleAutoLowCandidates} eligible auto_low candidates\n- Each record: manual classification pending master approval\n- Total pilot records reviewed so far: ${report.totals.totalPilotReviewed}\n- Remaining pilot records: ${report.totals.remainingPending}\n- Excluded source-file records in pilot: ${report.totals.excludedPilotRecords}\n- Production metadata write: none\n\n## Result\n\nNo auto_low candidate was promoted. The reviewer recorded human-proposed labels only; each remains outside production metadata until the master-key gate is resolved.\n`;
}

export function reviewLowPilotBatchOne() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const exclusions = JSON.parse(fs.readFileSync(exclusionPath, 'utf8'));
    if (exclusions.pilotDigest !== pilot.digest) throw new Error('source exclusion record is for a different pilot');
    const excludedFiles = new Set(exclusions.excludedSourceArchiveFiles.map(item => item.sourceArchiveFile));
    const { eligible, selected } = selectBatch(pilot.items, excludedFiles);
    const missing = selected.filter(item => !decisions[item.questionUid]).map(item => item.questionUid);
    if (missing.length || Object.keys(decisions).length !== selected.length) throw new Error(`review decision set mismatch: ${missing.join(', ')}`);
    const prior = JSON.parse(fs.readFileSync(path.join(outputDir, 'medium-batch-4-semantic-review.json'), 'utf8'));
    const excludedPilotRecords = pilot.items.filter(item => excludedFiles.has(item.sourceArchiveFile)).length;
    const reviews = selected.map(item => ({
        questionUid: item.questionUid,
        cohort: item.cohort,
        sourceArchiveFile: item.sourceArchiveFile,
        sourceOrdinal: item.sourceOrdinal,
        existingMetadata: item.existingMetadata,
        candidate: item.candidate,
        review: { disposition: 'manual_classification_pending_master', ...decisions[item.questionUid] }
    }));
    const stableReport = {
        schemaVersion: 'phase1-pilot-low-batch-1-review-v1',
        pilotDigest: pilot.digest,
        productionWriteAllowed: false,
        sourceExclusionPath: 'archive/_generated/intelligence/phase1/pilot/source-exclusions.json',
        batchSelection: 'first two lexical question UIDs in every pilot cohort after fixed source exclusions',
        totals: {
            eligibleAutoLowCandidates: eligible.length,
            reviewedBatchRecords: reviews.length,
            excludedPilotRecords,
            totalPilotReviewed: prior.totals.totalPilotReviewed + reviews.length,
            remainingPending: pilot.items.length - excludedPilotRecords - prior.totals.totalPilotReviewed - reviews.length,
            dispositions: countBy(reviews.map(item => ({ disposition: item.review.disposition })), 'disposition'),
            cohorts: countBy(reviews, 'cohort')
        },
        reviews
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = reviewLowPilotBatchOne();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'low-batch-1-semantic-review.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'low-batch-1-semantic-review.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase1/pilot/review/low-batch-1-semantic-review.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
