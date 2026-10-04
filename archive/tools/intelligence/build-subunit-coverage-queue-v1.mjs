import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Build a deterministic, review-only queue for records that still lack an
 * effective sub-unit assignment. This tool deliberately does not infer or
 * write production metadata. It turns the remaining coverage gap into
 * bounded review batches, with semantic candidates placed first.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const effectivePath = path.join(
    archiveDir,
    '_generated',
    'intelligence',
    'phase3',
    'fallback-safety-audit',
    'archive-hierarchical-classification-with-fallback-overlay-v1.json'
);
const semanticPath = path.join(
    archiveDir,
    '_generated',
    'intelligence',
    'phase2',
    'semantic-expansion',
    'archive-semantic-expansion-v1.json'
);
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'coverage-queue');
const batchSize = 300;

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function trackOf(sourceArchiveFile) {
    if (sourceArchiveFile.startsWith('original/middle/')) return 'middle';
    if (sourceArchiveFile.startsWith('original/high/')) return 'high';
    return 'other';
}

function sourcePriority(sourceArchiveFile) {
    const track = trackOf(sourceArchiveFile);
    if (track === 'middle') return 0;
    if (track === 'high') return 1;
    return 2;
}

function semanticPriority(status) {
    if (status === 'standard_candidate') return 0;
    if (status === 'review_candidate') return 1;
    return 2;
}

function coverageReason(record) {
    return record.classification.classificationDepth === 'unmapped_standard_unit'
        ? 'unmapped_standard_unit'
        : 'standard_unit_only';
}

function stableCompare(left, right) {
    return left.priority - right.priority
        || sourcePriority(left.sourceArchiveFile) - sourcePriority(right.sourceArchiveFile)
        || left.standardUnitKey.localeCompare(right.standardUnitKey, 'en')
        || left.sourceArchiveFile.localeCompare(right.sourceArchiveFile, 'en')
        || left.sourceOrdinal - right.sourceOrdinal
        || left.questionUid.localeCompare(right.questionUid, 'en');
}

export function buildSubunitCoverageQueueV1() {
    const effective = JSON.parse(fs.readFileSync(effectivePath, 'utf8'));
    const semantic = JSON.parse(fs.readFileSync(semanticPath, 'utf8'));
    const semanticByUid = new Map(semantic.records.map(record => [record.questionUid, record.semanticExpansion]));
    const unresolved = effective.records
        .filter(record => !record.classification.subUnitKey)
        .map(record => {
            const semanticExpansion = semanticByUid.get(record.questionUid) ?? { status: 'unresolved' };
            const reason = coverageReason(record);
            const status = semanticExpansion.status ?? 'unresolved';
            return {
                questionUid: record.questionUid,
                sourceArchiveFile: record.sourceArchiveFile,
                sourceOrdinal: record.sourceOrdinal,
                track: trackOf(record.sourceArchiveFile),
                standardUnitKey: record.standardUnitKey,
                standardUnit: record.standardUnit,
                classificationDepth: record.classification.classificationDepth,
                coverageReason: reason,
                semanticStatus: status,
                suggestedSubUnitKey: semanticExpansion.suggestedSubUnitKey ?? '',
                suggestedConceptClusterKey: semanticExpansion.suggestedConceptClusterKey ?? '',
                suggestedProblemTypeKey: semanticExpansion.suggestedProblemTypeKey ?? '',
                suggestedTemplateKey: semanticExpansion.suggestedTemplateKey ?? '',
                confidence: semanticExpansion.confidence ?? 'none',
                priority: semanticPriority(status) * 10 + (reason === 'unmapped_standard_unit' ? 2 : 0)
            };
        })
        .sort(stableCompare)
        .map((record, index) => ({ ...record, reviewBatch: Math.floor(index / batchSize) + 1, reviewOrder: index + 1 }));

    const coverage = {
        effectiveRecords: effective.records.length,
        detailedRecords: effective.records.filter(record => Boolean(record.classification.subUnitKey)).length,
        unresolvedRecords: unresolved.length,
        semanticCandidatesInQueue: unresolved.filter(record => record.semanticStatus !== 'unresolved').length,
        queueByReason: Object.fromEntries(
            ['standard_unit_only', 'unmapped_standard_unit'].map(reason => [
                reason,
                unresolved.filter(record => record.coverageReason === reason).length
            ])
        )
    };
    const stablePayload = {
        schemaVersion: 'archive-subunit-coverage-queue-v1',
        effectiveClassificationDigest: effective.digest,
        semanticExpansionDigest: semantic.digest,
        productionWriteAllowed: false,
        batchSize,
        coverage,
        records: unresolved
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function summaryMarkdown(report) {
    const statusCounts = {};
    for (const record of report.records) statusCounts[record.semanticStatus] = (statusCounts[record.semanticStatus] ?? 0) + 1;
    const statusRows = Object.entries(statusCounts)
        .sort(([a], [b]) => a.localeCompare(b, 'en'))
        .map(([status, count]) => `| ${status} | ${count} |`)
        .join('\n');
    const reasonRows = Object.entries(report.coverage.queueByReason)
        .map(([reason, count]) => `| ${reason} | ${count} |`)
        .join('\n');
    const firstBatch = report.records.filter(record => record.reviewBatch === 1).length;
    return `# Archive Sub-unit Coverage Queue v1\n\n- Effective classification records: ${report.coverage.effectiveRecords}\n- Detailed records already covered: ${report.coverage.detailedRecords}\n- Review queue records: ${report.coverage.unresolvedRecords}\n- Batch size: ${report.batchSize}\n- First review batch: ${firstBatch} records\n- Production metadata write: none\n\n## Queue reason\n\n| Reason | Count |\n|---|---:|\n${reasonRows}\n\n## Semantic evidence already available\n\n| Semantic status | Count |\n|---|---:|\n${statusRows}\n\nBatch 1 contains the strongest existing semantic candidates first. Every entry still requires independent review before a sub-unit is approved or written to source JS.\n`;
}

function main() {
    const report = buildSubunitCoverageQueueV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-coverage-queue-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-coverage-queue-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase3/coverage-queue/archive-subunit-coverage-queue-v1.json',
        digest: report.digest,
        coverage: report.coverage,
        batchSize: report.batchSize
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
