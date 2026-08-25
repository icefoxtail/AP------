import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Build the goal's canonical first-to-last review order. Unlike the
 * candidate-priority queue, this artifact preserves source file and question
 * order so progress can be resumed at an exact sequence number.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const effectivePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'fallback-safety-audit', 'archive-hierarchical-classification-with-fallback-overlay-v1.json');
const classificationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification', 'archive-hierarchical-classification-v1.json');
const reconciliationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'baseline-reconciliation', 'archive-baseline-reconciliation-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review');
const batchSize = 300;

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function trackOf(sourceArchiveFile) {
    if (sourceArchiveFile.startsWith('original/middle/')) return 'middle';
    if (sourceArchiveFile.startsWith('original/high/')) return 'high';
    return 'other';
}

function compareSourceOrder(left, right) {
    return left.sourceArchiveFile.localeCompare(right.sourceArchiveFile, 'en')
        || left.sourceOrdinal - right.sourceOrdinal
        || left.questionUid.localeCompare(right.questionUid, 'en');
}

export function buildSequentialSubunitReviewQueueV1() {
    const effective = JSON.parse(fs.readFileSync(effectivePath, 'utf8'));
    const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
    const reconciliation = JSON.parse(fs.readFileSync(reconciliationPath, 'utf8'));
    const ordered = [...effective.records]
        .sort(compareSourceOrder)
        .map((record, index) => ({
            sequenceOrder: index + 1,
            reviewBatch: Math.floor(index / batchSize) + 1,
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            track: trackOf(record.sourceArchiveFile),
            standardUnitKey: record.standardUnitKey,
            standardUnit: record.standardUnit,
            classificationDepth: record.classification.classificationDepth,
            subUnitKey: record.classification.subUnitKey,
            subUnit: record.classification.subUnit,
            recommendationEligible: record.classification.recommendationEligible,
            reviewStatus: record.classification.subUnitKey ? 'ALREADY_DETAILED' : 'PENDING_DETAILED_REVIEW'
        }));
    const stablePayload = {
        schemaVersion: 'archive-sequential-subunit-review-queue-v1',
        effectiveClassificationDigest: effective.digest,
        rawClassificationDigest: classification.digest,
        reconciliationDigest: reconciliation.digest,
        checkpoint: reconciliation.checkpoint,
        productionWriteAllowed: false,
        batchSize,
        scope: {
            reconciledFiles: reconciliation.totals.reconciledScannedFiles,
            reconciledQuestions: reconciliation.totals.reconciledScannedQuestions,
            eligibleRecords: ordered.length,
            explicitExcludedRecords: classification.totals.excludedRecords,
            postCheckpointRecords: reconciliation.totals.postCheckpointQuestions
        },
        progress: {
            detailedRecords: ordered.filter(record => record.reviewStatus === 'ALREADY_DETAILED').length,
            pendingRecords: ordered.filter(record => record.reviewStatus === 'PENDING_DETAILED_REVIEW').length,
            firstPendingSequence: ordered.find(record => record.reviewStatus === 'PENDING_DETAILED_REVIEW')?.sequenceOrder ?? null
        },
        records: ordered
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stablePayload)), ...stablePayload };
}

function summaryMarkdown(report) {
    const firstPending = report.progress.firstPendingSequence;
    return `# Archive Sequential Sub-unit Review Queue v1\n\n- Reconciled scope: ${report.scope.reconciledFiles} files / ${report.scope.reconciledQuestions} questions\n- Eligible ordered records: ${report.scope.eligibleRecords}\n- Explicitly excluded records: ${report.scope.explicitExcludedRecords}\n- Post-checkpoint records held aside: ${report.scope.postCheckpointRecords}\n- Detailed records already present: ${report.progress.detailedRecords}\n- Pending detailed review: ${report.progress.pendingRecords}\n- First pending sequence: ${firstPending ?? 'none'}\n- Batch size: ${report.batchSize}\n- Production metadata write: none\n\nRecords are ordered by sourceArchiveFile, then sourceOrdinal. Existing detailed assignments are retained as checkpoints; only PENDING_DETAILED_REVIEW records require new adjudication.\n`;
}

function main() {
    const report = buildSequentialSubunitReviewQueueV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-subunit-review-queue-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-sequential-subunit-review-queue-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase3/sequential-review/archive-sequential-subunit-review-queue-v1.json',
        digest: report.digest,
        scope: report.scope,
        progress: report.progress,
        batchSize: report.batchSize
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
