import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * First stratified semantic-review batch for auto_medium candidates.
 * This remains a pilot ledger only: no source or production metadata is written.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');

const decisions = {
    qid_v1_14104c62b8e963581f9d376248790fe449ae5367c58684e32526e3fc93ae33e6: {
        disposition: 'partial_manual_review',
        note: '조건부확률·독립사건과 사건 B의 구성 수를 함께 다루는 문항이다. 일반 확률 경우 분류 후보는 단원과 풀이 구조를 충분히 나타내지 못한다.'
    },
    qid_v1_2c69d8d8f26a057066d31066c393065d0c810bb0fe1983063417b97148fbe2f2: {
        disposition: 'reviewed_pass',
        note: '두 일차함수와 x축이 만드는 삼각형의 넓이를 구하는 문항이다. 일차함수 그래프 개념 후보가 원문·해설과 일치한다.'
    },
    qid_v1_46068d7e6f98663ed3468fb80a5b065926100512bc0066c800308224203e1fb9: {
        disposition: 'partial_manual_review',
        note: '평행사변형, 중점, 합동을 이용한 각도 문항이다. 피타고라스 길이 계산 후보는 원문·해설과 일치하지 않는다.'
    },
    qid_v1_035db3b98decd8d1fe0013e82cbd88406673fe69d272b06c6d8024533b1bea51: {
        disposition: 'partial_manual_review',
        note: '원의 접선과 방멱으로 각 항을 만든 뒤 등비급수를 합하는 미적분 문항이다. 일차함수 두 점 템플릿 후보는 오분류다.'
    },
    qid_v1_043d07c2dd4b3715362da986043bae79d971ba8fd5117b46e7e362b49dfd3ec3: {
        disposition: 'reviewed_pass',
        note: '실계수 이차방정식의 켤레복소근 성질을 적용한다. 복소수와 이차방정식 하위 단원 및 이차방정식 개념 후보가 일치한다.'
    },
    qid_v1_1bae0b893f29cc4482f7a6adb9f3f4575640e59b7b5970f5ee3d8d7b514e76ec: {
        disposition: 'partial_manual_review',
        note: '다항식 인수분해와 완전제곱식 구성이 핵심이다. 이차방정식 판별식 후보는 사용된 계산 단서만 포착해 표준단원과 맞지 않는다.'
    },
    qid_v1_0c1e438417a64dd2d2e9d4c97d58569c8535efaf923168b09419be79d9663a27: {
        disposition: 'reviewed_pass',
        note: '도형 위 점의 좌표를 매개변수로 두고 넓이의 최댓값을 이차함수로 구한다. 이차함수 그래프 후보가 일치한다.'
    },
    qid_v1_390fe4a541feabaacff26678eb23f1569530e2cf5cbac13a12fb7d92be606ed2: {
        disposition: 'reviewed_pass',
        note: '두 점을 지나는 직선의 방정식과 y절편을 구하는 평면좌표 문항이다. 직선·두 점 템플릿 후보가 일치한다.'
    },
    qid_v1_4e142864d5a9370b30f66e1db181f04fac89f618e0bde446a42de7c53ab06791: {
        disposition: 'reviewed_pass',
        note: '교점 조건으로 이차함수를 정하고 닫힌 구간의 최댓값을 구한다. 이차함수 그래프 후보가 원문·해설과 일치한다.'
    },
    qid_v1_1ac7cf8579c73668ac2c8bd7f6af5ba887c06a39591a16a362e0eda94e7c3567: {
        disposition: 'partial_manual_review',
        note: '삼차함수 접선 조건에서 중근을 만들고 도함수 관계를 쓰는 문항이다. 이차방정식 판별식 후보는 오분류다.'
    },
    qid_v1_3f1380b1b9126a5d0d3c70a6083ff6b954502ffebf97424386a8d43d76567378: {
        disposition: 'partial_manual_review',
        note: '서로 다른 색의 3×3 배치, 꼭짓점 공유 제한, 회전 동치를 세는 경우의 수 문항이다. 확률 경우 분류 후보는 부정확하다.'
    },
    qid_v1_1e86fe684aa9067c7eddbc36fb97d94976245e41e50eedb231e3e6421de897a7: {
        disposition: 'reviewed_pass',
        note: '두 일차함수와 수직선이 둘러싼 삼각형의 넓이를 구한다. 일차함수 그래프 후보가 일치한다.'
    },
    qid_v1_31cbb03f490e7c0ce707ba62697d55b89e42b880323bc9c15574156b16340699: {
        disposition: 'reviewed_pass',
        note: '일차방정식의 그래프와 삼각형 넓이 조건을 함께 이용한다. 일차함수 그래프 후보가 일치한다.'
    },
    qid_v1_4de779271e414d2ef99a76f256cae6463c70d162e4ec520540b3344e8b05d677: {
        disposition: 'reviewed_pass',
        note: '수선으로 나뉜 두 직각삼각형에 피타고라스 정리를 적용한다. 피타고라스 정리 후보가 그림·해설과 일치한다.'
    },
    qid_v1_1fe640371ed53750b26b3c317c36c27b0da8f82b275504fe20831cbad80f0c34: {
        disposition: 'partial_manual_review',
        note: '직각삼각형의 내접원 반지름을 넓이와 반둘레로 구하는 원의 성질 문항이다. 피타고라스 후보만으로는 핵심 유형을 나타내지 못한다.'
    },
    qid_v1_4a923994fe76f51cb5594ec3a6211727c5e25748b87876dc9b61ec0c1ba9806d: {
        disposition: 'partial_manual_review',
        note: '접선의 길이 성질과 직각삼각형 조건으로 내접원의 반지름을 구한다. 피타고라스 길이 계산 후보는 보조 계산에 치우쳐 있다.'
    },
    qid_v1_0e47d3a2f9adf96372e1c026dcff87fe5b6c4914d981657e11ed0c336747984d: {
        disposition: 'reviewed_pass',
        note: '직각삼각형 변을 지름으로 하는 반원의 넓이를 피타고라스 정리로 연결한다. 피타고라스 정리 후보가 그림·해설과 일치한다.'
    },
    qid_v1_1084447a34cefe6a8b70b56f73808f6261ed7af817c9cf087a692d77e05f56e6: {
        disposition: 'partial_manual_review',
        note: '정삼각형 탁자에서의 자리배치와 회전 동치를 세는 순열·조합 문항이다. 확률 경우 분류 후보는 부정확하다.'
    },
    qid_v1_1813858f13499d38ecde6be24bb5f630fda0afb7e270898fe370c17afd65460b: {
        disposition: 'partial_manual_review',
        note: '삼각비와 45° 직각이등변삼각형을 이용하는 문항이다. 피타고라스 길이 계산 후보는 핵심 단원을 잘못 잡았다.'
    }
};

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function selectBatch(items) {
    const medium = items.filter(item => item.candidate.tagStatus === 'auto_medium');
    const byCohort = Object.groupBy(medium, item => item.cohort);
    const quotas = { advanced: 3, subjective: 3, track_h1: 3, track_h2: 2, track_m2: 3, track_m3: 2, visual: 3 };
    const selected = [];
    for (const [cohort, quota] of Object.entries(quotas)) {
        const candidates = (byCohort[cohort] || []).sort((a, b) => a.questionUid.localeCompare(b.questionUid));
        if (candidates.length < quota) throw new Error(`${cohort}: expected at least ${quota} auto_medium records, got ${candidates.length}`);
        selected.push(...candidates.slice(0, quota));
    }
    return selected;
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.dispositions).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    return `# Phase 1 Pilot — Medium-Confidence Semantic Review, Batch 1\n\n- Reviewed: ${report.totals.reviewedBatchRecords} / ${report.totals.autoMediumCandidates} auto_medium candidates\n- Total pilot records reviewed so far: ${report.totals.totalPilotReviewed}\n- Remaining pilot records: ${report.totals.remainingPending}\n- Production metadata write: none\n\n## Dispositions\n\n| Disposition | Count |\n|---|---:|\n${rows}\n\n## Result\n\nThis deterministic 19-record batch covers every cohort containing auto_medium candidates. Eleven candidates were kept for manual review because the suggested type/template misidentified the mathematical core. The remaining 51 auto_medium candidates and 319 other pending pilot records still require review.\n`;
}

export function reviewMediumPilotBatchOne() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const batch = selectBatch(pilot.items);
    const missing = batch.filter(item => !decisions[item.questionUid]).map(item => item.questionUid);
    if (missing.length) throw new Error(`semantic decision missing: ${missing.join(', ')}`);
    if (Object.keys(decisions).length !== batch.length) throw new Error('review decision set does not exactly match batch selection');
    const reviews = batch.map(item => ({
        questionUid: item.questionUid,
        cohort: item.cohort,
        sourceArchiveFile: item.sourceArchiveFile,
        sourceOrdinal: item.sourceOrdinal,
        existingMetadata: item.existingMetadata,
        candidate: item.candidate,
        review: decisions[item.questionUid]
    }));
    const highReviewPath = path.join(outputDir, 'high-confidence-semantic-review.json');
    const highReview = JSON.parse(fs.readFileSync(highReviewPath, 'utf8'));
    const stableReport = {
        schemaVersion: 'phase1-pilot-medium-batch-1-review-v1',
        pilotDigest: pilot.digest,
        productionWriteAllowed: false,
        batchSelection: 'lexical question UID order within fixed per-cohort quotas; track_m1 excluded because it has no auto_medium candidates',
        totals: {
            autoMediumCandidates: pilot.items.filter(item => item.candidate.tagStatus === 'auto_medium').length,
            reviewedBatchRecords: reviews.length,
            remainingAutoMedium: pilot.items.filter(item => item.candidate.tagStatus === 'auto_medium').length - reviews.length,
            totalPilotReviewed: highReview.totals.reviewedHighConfidence + reviews.length,
            remainingPending: pilot.items.length - highReview.totals.reviewedHighConfidence - reviews.length,
            dispositions: countBy(reviews.map(item => ({ disposition: item.review.disposition })), 'disposition'),
            cohorts: countBy(reviews, 'cohort')
        },
        reviews
    };
    const digest = sha256(JSON.stringify(stableReport));
    return { generatedAt: new Date().toISOString(), digest, ...stableReport };
}

function main() {
    const report = reviewMediumPilotBatchOne();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'medium-batch-1-semantic-review.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'medium-batch-1-semantic-review.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase1/pilot/review/medium-batch-1-semantic-review.json',
        digest: report.digest,
        totals: report.totals
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
