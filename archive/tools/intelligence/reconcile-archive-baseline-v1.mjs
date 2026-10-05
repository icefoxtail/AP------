import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const baselinePath = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification', 'archive-hierarchical-classification-v1.json');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const originalExclusionsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'source-exclusions.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'baseline-reconciliation');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function reconcileArchiveBaselineV1() {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
    const originalExclusions = JSON.parse(fs.readFileSync(originalExclusionsPath, 'utf8'));
    const inventory = scanExamBank();
    const baselineFiles = new Set([
        ...baseline.records.map(record => record.sourceArchiveFile),
        ...originalExclusions.excludedSourceArchiveFiles.map(item => item.sourceArchiveFile),
        ...originalExclusions.bulkOnlyExcludedSourceArchiveFiles.map(item => item.sourceArchiveFile)
    ]);
    const currentFiles = new Map(inventory.files.map(file => [file.sourceFile.replace('archive/exams/', ''), file]));
    const postCheckpointFiles = [...currentFiles.entries()].filter(([sourceFile]) => !baselineFiles.has(sourceFile)).map(([sourceFile, file]) => ({
        sourceArchiveFile: sourceFile,
        questionCount: file.questions.length,
        reason: 'present after frozen 16:00 baseline; not in baseline identity/classification output'
    }));
    const postCheckpointQuestionCount = postCheckpointFiles.reduce((sum, file) => sum + file.questionCount, 0);
    const stableReport = {
        schemaVersion: 'archive-baseline-reconciliation-v1',
        baselineDigest: baseline.digest,
        identityDigest: identity.identityDigest,
        originalExclusionsDigest: sha256(JSON.stringify(originalExclusions)),
        checkpoint: originalExclusions.checkpoint,
        productionWriteAllowed: false,
        decision: postCheckpointFiles.length
            ? 'EXCLUDE_POST_CHECKPOINT_FILES_UNTIL_REBASELINE'
            : 'CURRENT_OPERATIONAL_BASELINE_RECONCILED',
        totals: {
            currentScannedFiles: inventory.totals.files,
            currentScannedQuestions: inventory.totals.questions,
            postCheckpointFiles: postCheckpointFiles.length,
            postCheckpointQuestions: postCheckpointQuestionCount,
            reconciledScannedFiles: inventory.totals.files - postCheckpointFiles.length,
            reconciledScannedQuestions: inventory.totals.questions - postCheckpointQuestionCount,
            reconciledIdentityFailures: Math.max(0, inventory.totals.questions - identity.records.length - postCheckpointQuestionCount)
        },
        postCheckpointFiles
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = reconcileArchiveBaselineV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-baseline-reconciliation-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-source-exclusions-v2.json'), `${JSON.stringify({
        schemaVersion: 'phase1-pilot-source-exclusions-v2',
        checkpoint: report.checkpoint,
        parentReconciliationDigest: report.digest,
        productionWriteAllowed: false,
        excludedSourceArchiveFiles: report.postCheckpointFiles,
        note: 'Sidecar exclusion only; no source files deleted or moved.'
    }, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/baseline-reconciliation/archive-baseline-reconciliation-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
