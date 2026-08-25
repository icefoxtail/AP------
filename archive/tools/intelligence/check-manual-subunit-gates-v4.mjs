import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const read = name => JSON.parse(fs.readFileSync(path.join(outputDir, name), 'utf8'));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function checkManualSubunitGatesV4() {
    const base = read('archive-manual-subunit-gates-v3.json');
    const m205SecondPass = read('archive-m205-second-pass-v1.json');
    const m303Availability = read('archive-m303-sample-availability-audit-v1.json');
    const pairs = base.pairs.map(pair => {
        if (pair.standardUnitKey === 'M2-04') return {
            ...pair,
            finalReviewStatus: 'TWO_PASS_MATCHED_FINAL_SIGNOFF_REQUIRED',
            productionUsable: false
        };
        if (pair.standardUnitKey === 'M2-05') {
            const matched = m205SecondPass.status === 'SECOND_PASS_MATCHED_NONPRODUCTION' && m205SecondPass.totals.disagreements === 0;
            return {
                ...pair,
                secondPassStatus: m205SecondPass.status,
                secondPassAgreements: m205SecondPass.totals.agreements,
                secondPassDisagreements: m205SecondPass.totals.disagreements,
                finalReviewStatus: matched ? 'TWO_PASS_MATCHED_FINAL_SIGNOFF_REQUIRED' : 'FAIL_CLOSED_SECOND_PASS_DISAGREEMENT',
                productionUsable: false
            };
        }
        return {
            ...pair,
            availabilityAuditStatus: m303Availability.disposition,
            availableStrongByKey: m303Availability.totals.availableStrongByKey,
            availableMixedBoundary: m303Availability.totals.availableMixedBoundary,
            finalReviewStatus: 'FAIL_CLOSED_NO_SAMPLE_AVAILABILITY_STANDARD_FALLBACK',
            productionUsable: false
        };
    });
    const stableReport = {
        schemaVersion: 'archive-manual-subunit-gates-v4',
        baseGateDigest: base.digest,
        m205SecondPassDigest: m205SecondPass.digest,
        m303AvailabilityDigest: m303Availability.digest,
        productionWriteAllowed: false,
        policy: {
            ...base.policy,
            finalSignoffRequiredAfterTwoPassMatch: true,
            noSampleAvailabilityLocksStandardFallback: true
        },
        totals: {
            pairs: pairs.length,
            twoPassMatchedFinalSignoffRequired: pairs.filter(pair => pair.finalReviewStatus === 'TWO_PASS_MATCHED_FINAL_SIGNOFF_REQUIRED').length,
            failedClosed: pairs.filter(pair => pair.finalReviewStatus.startsWith('FAIL_CLOSED')).length,
            unresolved: pairs.reduce((sum, pair) => sum + pair.unresolvedCount, 0),
            productionUsable: 0
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = checkManualSubunitGatesV4();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-manual-subunit-gates-v4.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v4.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
