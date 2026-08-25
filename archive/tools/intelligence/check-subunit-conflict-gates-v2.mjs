import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const goldLabelsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-goal-gold-labels', 'archive-subunit-goal-gold-labels-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-gates');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function checkSubunitConflictGatesV2() {
    const goldLabels = JSON.parse(fs.readFileSync(goldLabelsPath, 'utf8'));
    const pairs = goldLabels.pairs.map(pair => {
        const agreementRate = pair.sampleCount === 0 ? 0 : pair.confirmed / pair.sampleCount;
        const status = agreementRate >= 0.9 && pair.reviewRequired === 0 ? 'PASSED_AI_CANDIDATE' : 'FAIL_CLOSED_INSUFFICIENT_GOLD_COVERAGE';
        return {
            standardUnitKey: pair.standardUnitKey,
            sampleCount: pair.sampleCount,
            aiGoldConfirmed: pair.confirmed,
            reviewRequired: pair.reviewRequired,
            independentAgreementRate: Number(agreementRate.toFixed(3)),
            boundaryAccuracy: null,
            contentSolutionAgreement: null,
            gateStatus: status,
            productionUsable: false,
            reason: status === 'PASSED_AI_CANDIDATE'
                ? 'AI 독립 합의율 gate 충족; 생산 반영 전 최종 검토 필요'
                : 'AI 확정 후보 비율이 90% 미만이거나 보류 표본이 남아 있어 fail-closed'
        };
    });
    const stableReport = {
        schemaVersion: 'archive-subunit-conflict-gates-v2',
        goldLabelsDigest: goldLabels.digest,
        productionWriteAllowed: false,
        gatePolicy: {
            independentAgreementMin: 0.9,
            contentSolutionAgreementMin: 0.85,
            failClosedWithAnyReviewRequired: true
        },
        totals: {
            pairs: pairs.length,
            passedAiCandidates: pairs.filter(pair => pair.gateStatus === 'PASSED_AI_CANDIDATE').length,
            failedClosed: pairs.filter(pair => pair.gateStatus === 'FAIL_CLOSED_INSUFFICIENT_GOLD_COVERAGE').length
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = checkSubunitConflictGatesV2();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-conflict-gates-v2.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-conflict-gates/archive-subunit-conflict-gates-v2.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
