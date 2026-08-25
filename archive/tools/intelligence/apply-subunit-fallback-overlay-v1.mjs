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

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

export function applySubunitFallbackOverlayV1() {
    const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
    const overlay = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
    const overlayByUid = new Map(overlay.entries.map(entry => [entry.questionUid, entry]));
    const records = classification.records.map(record => {
        if (!overlayByUid.has(record.questionUid)) return record;
        return {
            ...record,
            classification: {
                ...record.classification,
                subUnitKey: '',
                subUnit: '',
                conceptClusterKey: '',
                problemTypeKey: '',
                templateKey: '',
                confidence: 'standard',
                classificationDepth: 'standard_unit_only',
                recommendationEligible: false,
                evidence: {
                    contentRuleIds: [],
                    solutionRuleIds: [],
                    agreedRuleIds: [],
                    rationale: 'fallback overlay: conflict disposition retained standard-unit key'
                }
            }
        };
    });
    const stableReport = {
        schemaVersion: 'archive-hierarchical-classification-with-fallback-overlay-v1',
        sourceClassificationDigest: classification.digest,
        overlayDigest: sha256(JSON.stringify(overlay)),
        productionWriteAllowed: false,
        overlayApplied: overlay.entries.length,
        totals: {
            classifiedRecords: records.length,
            identityFailures: classification.totals.identityFailures,
            recommendationEligible: records.filter(record => record.classification.recommendationEligible).length,
            classificationDepth: countBy(records.map(record => ({ classificationDepth: record.classification.classificationDepth })), 'classificationDepth'),
            blockedSubUnitAssignments: records.filter(record => overlayByUid.has(record.questionUid) && record.classification.subUnitKey).length
        },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.classificationDepth).map(([key, count]) => `| ${key} | ${count} |`).join('\n');
    return `# Archive Hierarchical Classification with Fallback Overlay v1\n\n- Source classification: \`${report.sourceClassificationDigest}\`\n- Overlay entries applied: ${report.overlayApplied}\n- Recommendation-eligible after overlay: ${report.totals.recommendationEligible}\n- Blocked sub-unit assignments after overlay: ${report.totals.blockedSubUnitAssignments}\n\n| Classification depth | Count |\n|---|---:|\n${rows}\n\nThis is a non-production policy-layer output; the raw classifier and source JS remain unchanged.\n`;
}

function main() {
    const report = applySubunitFallbackOverlayV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-hierarchical-classification-with-fallback-overlay-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-hierarchical-classification-with-fallback-overlay-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/fallback-safety-audit/archive-hierarchical-classification-with-fallback-overlay-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
