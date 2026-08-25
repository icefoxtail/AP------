import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queuePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review', 'archive-manual-subunit-review-queue-v1.json');
const firstPassPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review', 'archive-manual-subunit-review-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

// Independent second-pass labels for M2-04, assigned from the source prompt and
// solution only. The first-pass ledger is read only for disagreement comparison.
const secondPassLabels = [
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph property'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph property'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'explicit parallel condition'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line translation/intercept'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'multiple-line intersection/area'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line translation/intercept'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph property'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line translation'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph property'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'explicit parallel condition'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'explicit parallel condition'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'no-solution parallel system'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'two-line intersection'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'bounded area uses intersection'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'one function through axis points'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'three-line parallel/concurrent condition'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'coincident translated graphs'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph property'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line translation'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph property'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph property'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'equation/function graph relation'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'one function through two points'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'one function through two points'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph shape'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph from intercepts'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'one function through collinear points'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line slope'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line graph direction'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line quadrant analysis']
];

export function reviewM204SecondPassV1() {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const firstPass = JSON.parse(fs.readFileSync(firstPassPath, 'utf8'));
    const entries = queue.entries.filter(entry => entry.standardUnitKey === 'M2-04');
    const firstById = new Map(firstPass.entries.filter(entry => entry.standardUnitKey === 'M2-04').map(entry => [entry.reviewId, entry.manualLabel]));
    if (entries.length !== secondPassLabels.length) throw new Error(`M2-04 queue ${entries.length} != second pass ${secondPassLabels.length}`);
    const reviewed = entries.map((entry, index) => {
        const [secondPassLabel, rationale] = secondPassLabels[index];
        if (!entry.subUnitKeys.includes(secondPassLabel)) throw new Error(`invalid M2-04 second-pass label for ${entry.reviewId}`);
        return {
            reviewId: entry.reviewId,
            questionUid: entry.questionUid,
            sourceArchiveFile: entry.sourceArchiveFile,
            sourceOrdinal: entry.sourceOrdinal,
            sampleType: entry.sampleType,
            firstPassLabel: firstById.get(entry.reviewId) ?? null,
            secondPassLabel,
            agreement: firstById.get(entry.reviewId) === secondPassLabel,
            rationale,
            sourceContentSolutionReviewed: true,
            productionUsable: false
        };
    });
    const stableReport = {
        schemaVersion: 'archive-m204-second-pass-v1',
        sourceQueueDigest: queue.digest,
        firstPassDigest: firstPass.digest,
        standardUnitKey: 'M2-04',
        productionWriteAllowed: false,
        status: reviewed.every(entry => entry.agreement) ? 'SECOND_PASS_MATCHED_NONPRODUCTION' : 'SECOND_PASS_DISAGREEMENT_REQUIRES_ADJUDICATION',
        totals: {
            entries: reviewed.length,
            secondPassReviewed: reviewed.length,
            agreements: reviewed.filter(entry => entry.agreement).length,
            disagreements: reviewed.filter(entry => !entry.agreement).length,
            productionUsable: 0
        },
        entries: reviewed
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = reviewM204SecondPassV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-m204-second-pass-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-m204-second-pass-v1.json', digest: report.digest, status: report.status, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
