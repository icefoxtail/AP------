import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const readJson = relativePath => JSON.parse(fs.readFileSync(path.join(archiveDir, relativePath), 'utf8'));
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function checkManualSubunitGatesV1() {
    const resamples = readJson('_generated/intelligence/phase3/independent-subunit-resamples/archive-independent-subunit-resamples-v1.json');
    const adjudication = readJson('_generated/intelligence/phase3/independent-subunit-adjudication/archive-independent-subunit-adjudication-v1.json');
    const manual = readJson('_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-review-v1.json');
    const manualBySample = new Map(manual.entries.map(entry => [`${entry.questionUid}|${entry.sampleType}`, entry]));
    const adjudicationByUnit = new Map(adjudication.pairs.map(pair => [pair.standardUnitKey, pair]));
    const pairs = resamples.pairs.map(pair => {
        const allSamples = [
            ...Object.values(pair.strongByGoal).flat(),
            ...pair.boundary,
            ...pair.disagreement
        ];
        const adjudicatedPair = adjudicationByUnit.get(pair.standardUnitKey);
        const priorBySample = new Map(adjudicatedPair.samples.map(sample => [`${sample.questionUid}|${sample.sampleType}`, sample]));
        const reviewedSamples = allSamples.map(sample => {
            const key = `${sample.questionUid}|${sample.sampleType}`;
            const manualEntry = manualBySample.get(key);
            const prior = priorBySample.get(key);
            return {
                key,
                sampleType: sample.sampleType,
                label: manualEntry?.manualLabel ?? prior?.goldLabel ?? null,
                reviewSource: manualEntry ? 'MANUAL_REVIEW' : (prior?.goldLabel ? 'AI_GOLD_PRIOR' : 'UNRESOLVED')
            };
        });
        const boundary = reviewedSamples.filter(sample => sample.sampleType === 'boundary');
        const unresolved = reviewedSamples.filter(sample => !sample.label);
        const strongCounts = Object.fromEntries(Object.entries(pair.strongByGoal).map(([key, samples]) => [key, samples.length]));
        const coverageReady = pair.boundary.length >= 20 && Object.values(strongCounts).every(count => count >= 20);
        const reviewComplete = unresolved.length === 0;
        const status = coverageReady && reviewComplete ? 'MANUAL_REVIEW_CANDIDATE_SECOND_REVIEW_REQUIRED' : 'FAIL_CLOSED_MANUAL_COVERAGE_OR_UNRESOLVED';
        return {
            standardUnitKey: pair.standardUnitKey,
            strongCounts,
            boundaryCount: boundary.length,
            reviewedCount: reviewedSamples.length - unresolved.length,
            unresolvedCount: unresolved.length,
            manualReviewedCount: reviewedSamples.filter(sample => sample.reviewSource === 'MANUAL_REVIEW').length,
            aiGoldPriorCount: reviewedSamples.filter(sample => sample.reviewSource === 'AI_GOLD_PRIOR').length,
            coverageReady,
            reviewComplete,
            status,
            productionUsable: false,
            labelCounts: Object.fromEntries([...new Set(reviewedSamples.map(sample => sample.label).filter(Boolean))].sort().map(label => [label, reviewedSamples.filter(sample => sample.label === label).length]))
        };
    });
    const stableReport = {
        schemaVersion: 'archive-manual-subunit-gates-v1',
        resamplesDigest: resamples.digest,
        adjudicationDigest: adjudication.digest,
        manualReviewDigest: manual.digest,
        productionWriteAllowed: false,
        policy: {
            strongSampleMinPerKey: 20,
            boundarySampleMin: 20,
            unresolvedMax: 0,
            secondReviewerRequiredForPromotion: true
        },
        totals: {
            pairs: pairs.length,
            manualReviewCandidatePairs: pairs.filter(pair => pair.status === 'MANUAL_REVIEW_CANDIDATE_SECOND_REVIEW_REQUIRED').length,
            failedClosed: pairs.filter(pair => pair.status !== 'MANUAL_REVIEW_CANDIDATE_SECOND_REVIEW_REQUIRED').length,
            unresolved: pairs.reduce((sum, pair) => sum + pair.unresolvedCount, 0)
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = checkManualSubunitGatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-manual-subunit-gates-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
