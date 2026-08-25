import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const baseLabels = [
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram/rhombus diagonal theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rectangle angle theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram criterion proof'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram opposite-side proof'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram midpoint/angle theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram angle-bisector theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rhombus diagonal-area theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rectangle folding theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram area theorem'],
    ['M2-05-TRIANGLE_PROPERTIES', 'triangle incenter theorem'],
    ['M2-05-TRIANGLE_PROPERTIES', 'right-triangle congruence'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram/rhombus diagonal theorem'],
    ['M2-05-TRIANGLE_PROPERTIES', 'angle-bisector right-triangle congruence'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rectangle angle theorem'],
    ['M2-05-TRIANGLE_PROPERTIES', 'connected isosceles-triangle angle chase'],
    ['M2-05-TRIANGLE_PROPERTIES', 'triangle angle-side theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram opposite-side proof'],
    ['M2-05-TRIANGLE_PROPERTIES', 'isosceles-triangle altitude theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram midpoint/angle theorem']
];

const supplementalLabels = [
    ['M2-05-QUADRILATERAL_PROPERTIES', 'square/diagonal theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram theorem'],
    ['M2-05-TRIANGLE_PROPERTIES', 'right-isosceles triangle congruence'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'square diagonal theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'square diagonal/congruence theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram angle theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'two-square area geometry'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram properties'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram diagonal theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram criterion']
];

function reviewSet(entries, labels, firstById) {
    if (entries.length !== labels.length) throw new Error(`entry count ${entries.length} != label count ${labels.length}`);
    return entries.map((entry, index) => {
        const [secondPassLabel, rationale] = labels[index];
        if (!entry.subUnitKeys.includes(secondPassLabel)) throw new Error(`invalid M2-05 label for ${entry.questionUid}`);
        const firstPassLabel = firstById.get(entry.reviewId) ?? firstById.get(`${entry.questionUid}|${entry.sampleType}`) ?? null;
        return {
            reviewId: entry.reviewId ?? `${entry.questionUid}|${entry.sampleType}`,
            questionUid: entry.questionUid,
            sourceArchiveFile: entry.sourceArchiveFile,
            sourceOrdinal: entry.sourceOrdinal,
            sampleType: entry.sampleType,
            firstPassLabel,
            secondPassLabel,
            agreement: firstPassLabel === secondPassLabel,
            rationale,
            sourceContentSolutionReviewed: true,
            productionUsable: false
        };
    });
}

export function reviewM205SecondPassV1() {
    const baseQueue = JSON.parse(fs.readFileSync(path.join(archiveDir, '_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-review-queue-v1.json'), 'utf8'));
    const firstPass = JSON.parse(fs.readFileSync(path.join(archiveDir, '_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-review-v1.json'), 'utf8'));
    const supplemental = JSON.parse(fs.readFileSync(path.join(archiveDir, '_generated/intelligence/phase3/manual-subunit-review/archive-supplemental-manual-subunit-review-v1.json'), 'utf8'));
    const supplementalPass = JSON.parse(fs.readFileSync(path.join(archiveDir, '_generated/intelligence/phase3/manual-subunit-review/archive-supplemental-manual-subunit-review-v1.json'), 'utf8'));
    const baseEntries = baseQueue.entries.filter(entry => entry.standardUnitKey === 'M2-05');
    const supplementalEntries = supplemental.entries.filter(entry => entry.standardUnitKey === 'M2-05');
    const firstById = new Map(firstPass.entries.filter(entry => entry.standardUnitKey === 'M2-05').map(entry => [entry.reviewId, entry.manualLabel]));
    for (const entry of supplementalPass.entries.filter(entry => entry.standardUnitKey === 'M2-05')) firstById.set(`${entry.questionUid}|${entry.sampleType}`, entry.manualLabel);
    const reviewed = [...reviewSet(baseEntries, baseLabels, firstById), ...reviewSet(supplementalEntries, supplementalLabels, firstById)];
    const stableReport = {
        schemaVersion: 'archive-m205-second-pass-v1',
        sourceQueueDigest: baseQueue.digest,
        firstPassDigest: firstPass.digest,
        supplementalDigest: supplemental.digest,
        standardUnitKey: 'M2-05',
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
    const report = reviewM205SecondPassV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-m205-second-pass-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-m205-second-pass-v1.json', digest: report.digest, status: report.status, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
