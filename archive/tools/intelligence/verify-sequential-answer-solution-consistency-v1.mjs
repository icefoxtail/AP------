import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Check that an existing solution's explicit answer conclusion agrees with
 * the stored answer. This is a consistency gate, not a substitute for an
 * independent mathematical solve; unresolved markers remain review items.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const batchPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-review-batch-001-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function extractConclusion(solution) {
    const matches = [...String(solution ?? '').matchAll(/(?:정답|답)\s*(?:은|는|이|:)\s*([①②③④⑤⑥⑦⑧⑨⑩]|\d+)/g)];
    return matches.at(-1)?.[1] ?? '';
}

export function verifySequentialAnswerSolutionConsistencyV1() {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    const records = batch.records.map(record => {
        const storedAnswer = String(record.source?.answer ?? '').trim();
        const concludedAnswer = extractConclusion(record.source?.solution ?? '');
        const status = !storedAnswer || !record.source?.solution
            ? 'MISSING_SOURCE_FIELD'
            : !concludedAnswer
                ? 'NO_EXPLICIT_CONCLUSION'
                : concludedAnswer === storedAnswer
                    ? 'MATCH'
                    : 'MISMATCH';
        return {
            sequenceOrder: record.sequenceOrder,
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            storedAnswer,
            concludedAnswer,
            status,
            independentSolveRequired: true
        };
    });
    const counts = {};
    for (const record of records) counts[record.status] = (counts[record.status] ?? 0) + 1;
    const stablePayload = {
        schemaVersion: 'archive-sequential-answer-solution-consistency-v1',
        batchDigest: batch.digest,
        productionWriteAllowed: false,
        totals: { records: records.length, status: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))) },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function main() {
    const report = verifySequentialAnswerSolutionConsistencyV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-answer-solution-consistency-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-answer-solution-consistency-v1.json',
        digest: report.digest,
        totals: report.totals
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
