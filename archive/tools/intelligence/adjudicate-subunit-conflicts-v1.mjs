import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const rulesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_rules_v1.json');
const resamplesPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-resamples', 'archive-subunit-conflict-resamples-v1.json');
const reviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-review', 'archive-subunit-conflict-review-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-adjudication');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function boundaryBreakdown(entry) {
    const result = { currentOnly: 0, siblingOnly: 0, bothStrong: 0, neitherStrong: 0 };
    for (const sample of entry.boundary) {
        const currentStrong = sample.currentRuleEvidence.contentInclude.length > 0 && sample.currentRuleEvidence.solutionInclude.length > 0;
        const siblingStrong = sample.siblingRuleEvidence.contentInclude.length > 0 && sample.siblingRuleEvidence.solutionInclude.length > 0;
        if (currentStrong && !siblingStrong) result.currentOnly += 1;
        else if (!currentStrong && siblingStrong) result.siblingOnly += 1;
        else if (currentStrong && siblingStrong) result.bothStrong += 1;
        else result.neitherStrong += 1;
    }
    return result;
}

function recommendation(firstRule, secondRule, firstReview, firstResample, secondResample) {
    const minimumStrong = Math.min(firstResample.actualCounts.strong, secondResample.actualCounts.strong);
    const boundary = boundaryBreakdown(firstReview);
    const boundaryTotal = firstReview.boundary.length;
    const overlapRate = boundaryTotal === 0 ? 0 : boundary.bothStrong / boundaryTotal;
    let status;
    let reason;
    if (minimumStrong < 10) {
        status = 'HOLD_AT_STANDARD_UNIT';
        reason = '한쪽 세부 키의 strong 표본이 10개 미만이라 독립 근거가 부족함';
    } else if (overlapRate >= 0.5) {
        status = 'HOLD_AT_STANDARD_UNIT';
        reason = '경계 표본의 양쪽 본문·해설 강한 단서 동시 출현률이 50% 이상이라 대표 목표가 분리되지 않음';
    } else {
        status = 'SEPARATE_CANDIDATE_WITH_PRIMARY_GOAL_GUARD';
        reason = '양쪽 strong 표본과 낮은 경계 중첩률이 확인되어 대표 목표 우선 룰로 분리 후보를 유지할 수 있음';
    }
    return {
        pairKey: [firstRule.subUnitKey, secondRule.subUnitKey].sort().join(' <-> '),
        standardUnitKey: firstResample.standardUnitKey,
        subUnitKeys: [firstRule.subUnitKey, secondRule.subUnitKey],
        recommendation: status,
        reason,
        productionUsable: false,
        evidence: {
            strongCounts: {
                [firstRule.subUnitKey]: firstResample.actualCounts.strong,
                [secondRule.subUnitKey]: secondResample.actualCounts.strong
            },
            minimumStrong,
            boundaryCounts: boundary,
            boundaryTotal,
            boundaryBothStrongRate: Number(overlapRate.toFixed(3)),
            disagreementCounts: {
                [firstRule.subUnitKey]: firstResample.actualCounts.disagreement,
                [secondRule.subUnitKey]: secondResample.actualCounts.disagreement
            }
        },
        requiredNextEvidence: status === 'HOLD_AT_STANDARD_UNIT'
            ? ['표준단원 상위 키 유지', '추가 표본 또는 목표 개념 주석 없이는 세부 키 승격 금지']
            : ['대표 목표 주석을 붙인 경계 표본 재판정', '본문·해설 일치율 85% 이상 확인', '경계 정확도 90% 이상 확인']
    };
}

export function adjudicateSubunitConflictsV1() {
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    const resamples = JSON.parse(fs.readFileSync(resamplesPath, 'utf8'));
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    const rulesByKey = new Map(rules.rules.map(rule => [rule.subUnitKey, rule]));
    const resamplesByKey = new Map(resamples.samples.map(sample => [sample.subUnitKey, sample]));
    const reviewByKey = new Map(review.entries.map(entry => [entry.subUnitKey, entry]));
    const seen = new Set();
    const recommendations = [];
    for (const rule of rules.rules) {
        const siblingKey = rule.conflictWith[0];
        const pairKey = [rule.subUnitKey, siblingKey].sort().join(' <-> ');
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);
        recommendations.push(recommendation(rule, rulesByKey.get(siblingKey), reviewByKey.get(rule.subUnitKey), resamplesByKey.get(rule.subUnitKey), resamplesByKey.get(siblingKey)));
    }
    const stableReport = {
        schemaVersion: 'archive-subunit-conflict-adjudication-v1',
        rulesDigest: sha256(JSON.stringify(rules)),
        resamplesDigest: resamples.digest,
        reviewDigest: review.digest,
        status: 'RECOMMENDATION_ONLY',
        productionWriteAllowed: false,
        totals: {
            conflictPairs: recommendations.length,
            separateCandidates: recommendations.filter(item => item.recommendation === 'SEPARATE_CANDIDATE_WITH_PRIMARY_GOAL_GUARD').length,
            heldAtStandardUnit: recommendations.filter(item => item.recommendation === 'HOLD_AT_STANDARD_UNIT').length
        },
        recommendations
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = adjudicateSubunitConflictsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-conflict-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-conflict-adjudication/archive-subunit-conflict-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
