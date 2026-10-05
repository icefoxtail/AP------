import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const classificationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification', 'archive-hierarchical-classification-v1.json');
const overlayPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'fallback-safety-audit', 'archive-subunit-fallback-overlay-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'fallback-safety-audit');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function verifySubunitFallbackOverlayV1() {
    const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
    const overlay = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
    const overlayByUid = new Map(overlay.entries.map(entry => [entry.questionUid, entry]));
    const before = classification.records.filter(record => overlayByUid.has(record.questionUid));
    const after = before.map(record => ({ ...record, classification: { ...record.classification, subUnitKey: '', subUnit: '', classificationDepth: 'standard_unit_only', recommendationEligible: false } }));
    const blockedAfter = after.filter(record => overlayByUid.get(record.questionUid)?.toSubUnitKey);
    const stableReport = {
        schemaVersion: 'archive-subunit-fallback-overlay-verification-v1',
        classificationDigest: classification.digest,
        overlayDigest: sha256(JSON.stringify(overlay)),
        productionWriteAllowed: false,
        totals: {
            overlayEntries: overlay.entries.length,
            matchedAssignments: before.length,
            verifiedFallbackAssignments: after.length,
            blockedAfterOverlay: blockedAfter.length
        },
        status: blockedAfter.length === 0 && before.length === overlay.entries.length ? 'OVERLAY_VERIFIED_IN_MEMORY' : 'OVERLAY_MISMATCH'
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = verifySubunitFallbackOverlayV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-fallback-overlay-verification-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/fallback-safety-audit/archive-subunit-fallback-overlay-verification-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
