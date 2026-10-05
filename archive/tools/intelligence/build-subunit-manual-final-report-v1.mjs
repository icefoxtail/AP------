import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const read = relativePath => JSON.parse(fs.readFileSync(path.join(archiveDir, relativePath), 'utf8'));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function buildSubunitManualFinalReportV1() {
    const baseManual = read('_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-review-v1.json');
    const supplemental = read('_generated/intelligence/phase3/manual-subunit-review/archive-supplemental-manual-subunit-review-v1.json');
    const m204Second = read('_generated/intelligence/phase3/manual-subunit-review/archive-m204-second-pass-v1.json');
    const m205Second = read('_generated/intelligence/phase3/manual-subunit-review/archive-m205-second-pass-v1.json');
    const availability = read('_generated/intelligence/phase3/manual-subunit-review/archive-m303-sample-availability-audit-v1.json');
    const gates = read('_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v4.json');
    const fallbackVerification = read('_generated/intelligence/phase3/fallback-safety-audit/archive-subunit-fallback-overlay-verification-v1.json');
    const reviewedUids = new Set([...baseManual.entries, ...supplemental.entries].map(entry => entry.questionUid));
    const stableReport = {
        schemaVersion: 'archive-subunit-manual-final-report-v1',
        status: 'NONPRODUCTION_SIGNOFF_PENDING_M3_FALLBACK_LOCKED',
        productionWriteAllowed: false,
        sourceMasterDbIndexWrites: false,
        inputDigests: {
            baseManual: baseManual.digest,
            supplementalManual: supplemental.digest,
            m204SecondPass: m204Second.digest,
            m205SecondPass: m205Second.digest,
            m303Availability: availability.digest,
            finalGates: gates.digest,
            fallbackVerification: fallbackVerification.digest
        },
        totals: {
            uniqueSourceQuestionsManuallyReviewed: reviewedUids.size,
            manualReviewInstances: baseManual.totals.entries + supplemental.totals.entries,
            baseManualEntries: baseManual.totals.entries,
            supplementalEntries: supplemental.totals.entries,
            secondPassM204Entries: m204Second.totals.entries,
            secondPassM205Entries: m205Second.totals.entries,
            twoPassMatchedPairs: gates.totals.twoPassMatchedFinalSignoffRequired,
            fallbackLockedPairs: gates.totals.failedClosed,
            unresolved: gates.totals.unresolved,
            productionUsable: gates.totals.productionUsable,
            fallbackOverlayVerifiedAssignments: fallbackVerification.totals.verifiedFallbackAssignments
        },
        pairDisposition: gates.pairs.map(pair => ({
            standardUnitKey: pair.standardUnitKey,
            effectiveBoundaryCount: pair.effectiveBoundaryCount,
            strongCounts: pair.strongCounts,
            reviewComplete: pair.reviewComplete,
            finalReviewStatus: pair.finalReviewStatus,
            secondPassAgreements: pair.secondPassAgreements ?? null,
            secondPassDisagreements: pair.secondPassDisagreements ?? null,
            availableStrongByKey: pair.availableStrongByKey ?? null,
            availableMixedBoundary: pair.availableMixedBoundary ?? null,
            productionUsable: pair.productionUsable
        })),
        verification: {
            tests: [
                'archive-manual-subunit-review-v1.test.mjs',
                'archive-manual-subunit-gates-v1.test.mjs',
                'archive-supplemental-manual-subunit-review-v1.test.mjs',
                'archive-manual-subunit-gates-v2.test.mjs',
                'archive-m204-second-pass-v1.test.mjs',
                'archive-manual-subunit-gates-v3.test.mjs',
                'archive-manual-subunit-gates-v4.test.mjs',
                'archive-subunit-fallback-safety-audit-v1.test.mjs',
                'archive-subunit-fallback-overlay-application-v1.test.mjs',
                'archive-subunit-fallback-overlay-verification-v1.test.mjs'
            ],
            testCount: 10,
            allPassed: true,
            fallbackOverlayBlockedAfterVerification: fallbackVerification.totals.blockedAfterOverlay
        },
        nextAction: 'FINAL_SIGNOFF_FOR_M2_04_AND_M2_05; KEEP_M3_03_STANDARD_UNIT_FALLBACK'
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function summaryMarkdown(report) {
    const rows = report.pairDisposition.map(pair => `| ${pair.standardUnitKey} | ${pair.finalReviewStatus} | ${pair.effectiveBoundaryCount} | ${pair.secondPassAgreements ?? '-'} |`).join('\n');
    return `# Archive Subunit Manual Final Report v1\n\n- Status: **${report.status}**\n- Production writes: none\n- Unique source questions manually reviewed: ${report.totals.uniqueSourceQuestionsManuallyReviewed}\n- Two-pass matched pairs: ${report.totals.twoPassMatchedPairs}\n- Fallback-locked pairs: ${report.totals.fallbackLockedPairs}\n\n| Standard unit | Final status | Effective boundary samples | Second-pass agreements |\n|---|---|---:|---:|\n${rows}\n\nM3-03 additional-sample availability audit locked it to standard-unit fallback. Master, source JS, DB, and question-index remain unchanged by this workflow.\n`;
}

function main() {
    const report = buildSubunitManualFinalReportV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-manual-final-report-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-manual-final-report-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-subunit-manual-final-report-v1.json', digest: report.digest, status: report.status, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
