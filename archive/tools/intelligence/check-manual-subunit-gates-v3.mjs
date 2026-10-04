import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function checkManualSubunitGatesV3() {
    const gate = JSON.parse(fs.readFileSync(path.join(outputDir, 'archive-manual-subunit-gates-v2.json'), 'utf8'));
    const secondPass = JSON.parse(fs.readFileSync(path.join(outputDir, 'archive-m204-second-pass-v1.json'), 'utf8'));
    const pairs = gate.pairs.map(pair => {
        if (pair.standardUnitKey !== 'M2-04') return pair;
        const matched = secondPass.status === 'SECOND_PASS_MATCHED_NONPRODUCTION' && secondPass.totals.disagreements === 0;
        return {
            ...pair,
            secondPassStatus: secondPass.status,
            secondPassAgreements: secondPass.totals.agreements,
            secondPassDisagreements: secondPass.totals.disagreements,
            status: matched ? 'TWO_PASS_MATCHED_FINAL_SIGNOFF_REQUIRED' : 'FAIL_CLOSED_SECOND_PASS_DISAGREEMENT',
            productionUsable: false
        };
    });
    const stableReport = {
        schemaVersion: 'archive-manual-subunit-gates-v3',
        baseGateDigest: gate.digest,
        secondPassDigest: secondPass.digest,
        productionWriteAllowed: false,
        policy: {
            ...gate.policy,
            finalSignoffRequiredAfterTwoPassMatch: true
        },
        totals: {
            pairs: pairs.length,
            twoPassMatchedPairs: pairs.filter(pair => pair.status === 'TWO_PASS_MATCHED_FINAL_SIGNOFF_REQUIRED').length,
            manualReviewCandidatePairs: pairs.filter(pair => pair.status === 'TWO_PASS_MATCHED_FINAL_SIGNOFF_REQUIRED' || pair.status === 'MANUAL_REVIEW_CANDIDATE_SECOND_REVIEW_REQUIRED').length,
            failedClosed: pairs.filter(pair => pair.status === 'FAIL_CLOSED_MANUAL_COVERAGE_OR_UNRESOLVED' || pair.status === 'FAIL_CLOSED_SECOND_PASS_DISAGREEMENT').length,
            unresolved: pairs.reduce((sum, pair) => sum + pair.unresolvedCount, 0)
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = checkManualSubunitGatesV3();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-manual-subunit-gates-v3.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v3.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
