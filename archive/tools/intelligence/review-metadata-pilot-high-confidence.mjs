import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Semantic review ledger for every auto_high item in the fixed pilot.
 * A reviewed pass is evidence for pilot-quality measurement only; it is not a
 * production metadata write while the production master gate is closed.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');

const decisions = {
    qid_v1_4343d400192c1c78e234127b568bcaccf993f719acb29714389a8c80125dc69e: {
        disposition: 'reviewed_pass',
        note: '과일 수량·금액 조건으로 연립일차방정식을 세우는 활용 문항이다. 후보의 네 세부 태그가 원문·해설과 일치한다.'
    },
    qid_v1_49a34fee5160f6722741ced7b5090203e373a82e1034d93f4ad29c8cab67bd92: {
        disposition: 'partial_manual_review',
        note: '조합 개념은 맞지만, 정팔각형에서 인접 꼭짓점을 피하는 조건은 at-least-one 조합 템플릿이 아니다.',
        correction: { problemTypeKey: 'COMBINATION_SELECTION_CONDITION', templateKey: 'COMBINATION_NON_ADJACENT' }
    },
    qid_v1_578b266e333c0ea050c38aafdfde77f81cf8e73f130666f72bc08f15fee3e242: {
        disposition: 'partial_manual_review',
        note: '피타고라스 정리의 역을 이용해 직각삼각형 여부를 판정한다. 길이 구하기 템플릿은 정확한 유형이 아니다.'
    },
    qid_v1_6ac75fbfe3412c97569e46a24ac0edd8f53ca8de7382d3a2fd0f6728ab097c4e: {
        disposition: 'reviewed_pass',
        note: '중근 조건 D=0을 직접 적용하는 이차방정식 판별식 문항으로 후보와 일치한다.'
    },
    qid_v1_70a153fd0db92774327a2a79647a464cb887d400f870eb8b8280cab9f094b147: {
        disposition: 'reviewed_pass',
        note: '접기 후 형성된 직각삼각형의 변 길이를 피타고라스 정리로 구한다. 이미지와 해설을 함께 확인했고 후보가 일치한다.'
    },
    qid_v1_85751b4b83c5310d0471e18a6c32cc3573999d0c87acff8b5e0a4a2954f2fb20: {
        disposition: 'partial_manual_review',
        note: '일차함수와 그래프 단원은 맞지만, 고정점과 선분의 교점 존재 범위를 구하는 문항은 두 점으로 직선 식을 구하는 템플릿과 다르다.'
    },
    qid_v1_aa89837636343e6a488da7e2a0111dfcea1514b5c37c486e51c4af21f240b5c7: {
        disposition: 'partial_manual_review',
        note: '두 실근이 모두 특정 값보다 작다는 근의 위치 조건 문항이다. 판별식만으로는 후보 템플릿을 충분히 설명하지 못한다.'
    },
    qid_v1_aa8cb9eb15e4095d2f64e74f503fb0b920ea01e018003ec0f17aa8c1a61fa62b: {
        disposition: 'corrected_candidate_pending_master',
        note: '두 사람이 모두 약속을 지킬 확률의 여사건을 이용한다. case-split 템플릿 대신 documented complement 템플릿이 적절하다.',
        correction: { problemTypeKey: 'PROBABILITY_BASIC_COUNT', templateKey: 'PROBABILITY_COMPLEMENT' }
    },
    qid_v1_adb304713d634ad7254c84d2ce38224ffbd0c5058e0341067d682543db679a41: {
        disposition: 'reviewed_pass',
        note: '중근을 갖는 이차방정식을 고르는 문항이며 판별식/완전제곱식 판단 후보와 일치한다.'
    },
    qid_v1_bb22f14004632eb01cdfa447231109b0113cab1800137168c4e3862ab0a33e4b: {
        disposition: 'partial_manual_review',
        note: '서로 배반인 두 범주의 합으로 확률을 구하는 문항이다. 후보의 case-split 템플릿은 근거가 부족하다.'
    },
    qid_v1_ec37277753402a53359b450c1969a014d85863a15ad03dbbaec6260e11a50251: {
        disposition: 'reviewed_pass',
        note: '이차식 유지 조건과 D>0을 함께 적용하는 서로 다른 두 실근 조건 문항이다. 판별식 유형 후보가 적절하다.'
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

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.dispositions).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    return `# Phase 1 Pilot — High-Confidence Semantic Review\n\n- Reviewed: ${report.totals.reviewedHighConfidence} / ${report.totals.highConfidenceCandidates} auto_high candidates\n- Remaining pilot records: ${report.totals.remainingPending}\n- Production metadata write: none\n\n## Dispositions\n\n| Disposition | Count |\n|---|---:|\n${rows}\n\n## Result\n\nFive auto_high candidates were confirmed without modification. One candidate was corrected to the documented probability-complement template but remains pending the production master. Five candidates were retained for manual review because their problem/template granularity was too coarse or incorrect. The full 400-item quality gate remains pending and cannot be claimed from this focused review.\n`;
}

export function reviewHighConfidencePilotCandidates() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const highConfidence = pilot.items.filter(item => item.candidate.tagStatus === 'auto_high');
    if (highConfidence.length !== 11) throw new Error(`expected 11 auto_high pilot candidates, got ${highConfidence.length}`);
    const missing = highConfidence.filter(item => !decisions[item.questionUid]).map(item => item.questionUid);
    if (missing.length) throw new Error(`semantic decision missing: ${missing.join(', ')}`);
    const reviews = highConfidence.map(item => ({
        questionUid: item.questionUid,
        sourceArchiveFile: item.sourceArchiveFile,
        sourceOrdinal: item.sourceOrdinal,
        existingMetadata: item.existingMetadata,
        candidate: item.candidate,
        review: decisions[item.questionUid]
    }));
    const stableReport = {
        schemaVersion: 'phase1-pilot-high-confidence-review-v1',
        pilotDigest: pilot.digest,
        productionWriteAllowed: false,
        totals: {
            highConfidenceCandidates: highConfidence.length,
            reviewedHighConfidence: reviews.length,
            remainingPending: pilot.items.length - reviews.length,
            dispositions: countBy(reviews.map(item => ({ disposition: item.review.disposition })), 'disposition')
        },
        reviews
    };
    const digest = sha256(JSON.stringify(stableReport));
    return { generatedAt: new Date().toISOString(), digest, ...stableReport };
}

function main() {
    const report = reviewHighConfidencePilotCandidates();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'high-confidence-semantic-review.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'high-confidence-semantic-review.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase1/pilot/review/high-confidence-semantic-review.json',
        digest: report.digest,
        totals: report.totals
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
