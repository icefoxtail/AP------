import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

/**
 * Materialize one bounded review packet from the coverage queue. The packet
 * includes source text and existing answer/solution fields for inspection,
 * but remains a non-production proposal until independently reviewed.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queuePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'coverage-queue', 'archive-subunit-coverage-queue-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'coverage-queue');
const batchNumber = 1;

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function sourceLookup() {
    const lookup = new Map();
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace(/^archive\/exams\//, '');
        for (const question of file.questions) {
            lookup.set(`${sourceArchiveFile}#${question.originalIndex + 1}`, question);
        }
    }
    return lookup;
}

function sourcePayload(source) {
    if (!source) return null;
    return {
        standardCourse: source.standardCourse ?? '',
        standardUnitKey: source.standardUnitKey ?? '',
        standardUnit: source.standardUnit ?? '',
        level: source.level ?? '',
        questionType: source.questionType ?? '',
        content: source.content ?? '',
        choices: Array.isArray(source.choices) ? source.choices : [],
        answer: source.answer ?? '',
        solution: source.solution ?? '',
        image: source.image ?? '',
        tags: Array.isArray(source.tags) ? source.tags : []
    };
}

export function buildSubunitReviewBatchV1() {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const lookup = sourceLookup();
    const queueRecords = queue.records.filter(record => record.reviewBatch === batchNumber);
    let sourceJoinFailures = 0;
    const records = queueRecords.map(record => {
        const source = lookup.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`);
        if (!source) sourceJoinFailures += 1;
        return {
            ...record,
            reviewStatus: 'PENDING_INDEPENDENT_REVIEW',
            source: sourcePayload(source)
        };
    });
    const stablePayload = {
        schemaVersion: 'archive-subunit-review-batch-v1',
        queueDigest: queue.digest,
        batchNumber,
        batchSize: queue.batchSize,
        productionWriteAllowed: false,
        totals: {
            records: records.length,
            sourceJoinFailures,
            semanticCandidates: records.filter(record => record.semanticStatus !== 'unresolved').length,
            missingSourceContent: records.filter(record => !record.source?.content).length
        },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function summaryMarkdown(report) {
    const statusCounts = {};
    for (const record of report.records) statusCounts[record.semanticStatus] = (statusCounts[record.semanticStatus] ?? 0) + 1;
    const rows = Object.entries(statusCounts)
        .sort(([a], [b]) => a.localeCompare(b, 'en'))
        .map(([status, count]) => `| ${status} | ${count} |`)
        .join('\n');
    return `# Archive Sub-unit Review Batch ${String(report.batchNumber).padStart(3, '0')}\n\n- Records: ${report.totals.records}\n- Semantic candidates: ${report.totals.semanticCandidates}\n- Source join failures: ${report.totals.sourceJoinFailures}\n- Missing source content: ${report.totals.missingSourceContent}\n- Production metadata write: none\n\n| Semantic status | Count |\n|---|---:|\n${rows}\n\nAll records remain pending independent review. No answer, solution, source JS, or master-table field was modified.\n`;
}

function main() {
    const report = buildSubunitReviewBatchV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-review-batch-001-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-review-batch-001-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase3/coverage-queue/archive-subunit-review-batch-001-v1.json',
        digest: report.digest,
        totals: report.totals
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
