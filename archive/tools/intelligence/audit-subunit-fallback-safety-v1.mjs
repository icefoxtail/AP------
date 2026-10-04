import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const classificationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification', 'archive-hierarchical-classification-v1.json');
const middleDispositionPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-dispositions', 'archive-subunit-conflict-dispositions-v1.json');
const highDispositionPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'high-first-wave-dispositions', 'archive-high-first-wave-dispositions-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'fallback-safety-audit');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function auditSubunitFallbackSafetyV1() {
    const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
    const middle = JSON.parse(fs.readFileSync(middleDispositionPath, 'utf8'));
    const high = JSON.parse(fs.readFileSync(highDispositionPath, 'utf8'));
    const blockedKeys = new Set(middle.dispositions.flatMap(item => item.subUnitKeys));
    const records = classification.records.filter(record => blockedKeys.has(record.classification.subUnitKey));
    const overlay = records.map(record => ({
        questionUid: record.questionUid,
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        standardUnitKey: record.classification.standardUnitKey,
        fromSubUnitKey: record.classification.subUnitKey,
        toSubUnitKey: '',
        action: 'FALLBACK_TO_STANDARD_UNIT',
        productionWriteAllowed: false
    }));
    const byKey = {};
    for (const record of records) byKey[record.classification.subUnitKey] = (byKey[record.classification.subUnitKey] ?? 0) + 1;
    const stableReport = {
        schemaVersion: 'archive-subunit-fallback-safety-audit-v1',
        classificationDigest: classification.digest,
        middleDispositionDigest: middle.digest,
        highDispositionDigest: high.digest,
        status: records.length === 0 ? 'SAFE_NO_BLOCKED_ASSIGNMENTS' : 'VIOLATION_REQUIRES_OVERLAY',
        productionWriteAllowed: false,
        totals: {
            blockedSubUnitKeys: blockedKeys.size,
            blockedAssignments: records.length,
            fallbackOverlayRecommendations: overlay.length,
            highDomainsFallbackLocked: high.totals.proposedOnlyFallback
        },
        blockedAssignmentsBySubUnit: byKey
    };
    return {
        generatedAt: new Date().toISOString(),
        digest: sha256(JSON.stringify(stableReport)),
        ...stableReport,
        overlay
    };
}

function main() {
    const report = auditSubunitFallbackSafetyV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-fallback-safety-audit-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-fallback-overlay-v1.json'), `${JSON.stringify({ schemaVersion: 'archive-subunit-fallback-overlay-v1', auditDigest: report.digest, productionWriteAllowed: false, entries: report.overlay }, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/fallback-safety-audit/archive-subunit-fallback-safety-audit-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
