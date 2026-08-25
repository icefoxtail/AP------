import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const candidatePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-candidate-classification-v1.json');
const first20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-first20-adjudication-v1.json');
const second20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-21-40-adjudication-v1.json');
const third20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-41-60-adjudication-v1.json');
const fourth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-61-80-adjudication-v1.json');
const fifth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-81-100-adjudication-v1.json');
const sixth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-101-120-adjudication-v1.json');
const seventh20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-121-140-adjudication-v1.json');
const eighth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-141-160-adjudication-v1.json');
const ninth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-161-180-adjudication-v1.json');
const tenth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-181-200-adjudication-v1.json');
const eleventh20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-201-220-adjudication-v1.json');
const twelfth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-221-240-adjudication-v1.json');
const thirteenth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-241-260-adjudication-v1.json');
const fourteenth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-261-280-adjudication-v1.json');
const fifteenth20Path = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-281-300-adjudication-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function summarizeSequentialBatch001AdjudicationV1() {
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const first20 = JSON.parse(fs.readFileSync(first20Path, 'utf8'));
    const second20 = JSON.parse(fs.readFileSync(second20Path, 'utf8'));
    const third20 = JSON.parse(fs.readFileSync(third20Path, 'utf8'));
    const fourth20 = JSON.parse(fs.readFileSync(fourth20Path, 'utf8'));
    const fifth20 = JSON.parse(fs.readFileSync(fifth20Path, 'utf8'));
    const sixth20 = JSON.parse(fs.readFileSync(sixth20Path, 'utf8'));
    const seventh20 = JSON.parse(fs.readFileSync(seventh20Path, 'utf8'));
    const eighth20 = JSON.parse(fs.readFileSync(eighth20Path, 'utf8'));
    const ninth20 = JSON.parse(fs.readFileSync(ninth20Path, 'utf8'));
    const tenth20 = JSON.parse(fs.readFileSync(tenth20Path, 'utf8'));
    const eleventh20 = JSON.parse(fs.readFileSync(eleventh20Path, 'utf8'));
    const twelfth20 = JSON.parse(fs.readFileSync(twelfth20Path, 'utf8'));
    const thirteenth20 = JSON.parse(fs.readFileSync(thirteenth20Path, 'utf8'));
    const fourteenth20 = JSON.parse(fs.readFileSync(fourteenth20Path, 'utf8'));
    const fifteenth20 = JSON.parse(fs.readFileSync(fifteenth20Path, 'utf8'));
    const adjudicated = [
        ...first20.records.filter(record => record.answerVerification !== 'PENDING'),
        ...second20.records,
        ...third20.records,
        ...fourth20.records,
        ...fifth20.records,
        ...sixth20.records,
        ...seventh20.records,
        ...eighth20.records,
        ...ninth20.records,
        ...tenth20.records,
        ...eleventh20.records,
        ...twelfth20.records,
        ...thirteenth20.records,
        ...fourteenth20.records,
        ...fifteenth20.records
    ].sort((left, right) => left.sequenceOrder - right.sequenceOrder);
    const stablePayload = {
        schemaVersion: 'archive-sequential-batch-001-adjudication-progress-v1',
        candidateDigest: candidates.digest,
        sourceAdjudicationDigests: [first20.digest, second20.digest, third20.digest, fourth20.digest, fifth20.digest, sixth20.digest, seventh20.digest, eighth20.digest, ninth20.digest, tenth20.digest, eleventh20.digest, twelfth20.digest, thirteenth20.digest, fourteenth20.digest, fifteenth20.digest],
        productionWriteAllowed: false,
        totals: {
            batchRecords: candidates.totals.records,
            adjudicatedRecords: adjudicated.length,
            pendingRecords: candidates.totals.records - adjudicated.length,
            answerRecheckConfirmed: adjudicated.filter(record => record.answerVerification === 'INDEPENDENT_RECHECK_CONFIRMED').length,
            status: Object.fromEntries(Object.entries(adjudicated.reduce((counts, record) => {
                counts[record.adjudicationStatus] = (counts[record.adjudicationStatus] ?? 0) + 1;
                return counts;
            }, {})).sort(([a], [b]) => a.localeCompare(b, 'en')))
        },
        records: adjudicated
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = summarizeSequentialBatch001AdjudicationV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-batch-001-adjudication-progress-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-batch-001-adjudication-progress-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
