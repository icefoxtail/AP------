import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const classificationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'pilot-classification', 'hierarchical-pilot-classification-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'pilot-classification');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function summaryMarkdown(report) {
    return `# Pilot Classification Strategy Comparison\n\n- Pilot records: ${report.totals.pilotRecords}\n- Legacy candidates with a deep type/template: ${report.totals.legacyDeepCandidates}\n- Hierarchical deep recommendation-eligible records: ${report.totals.hierarchicalRecommendationEligible}\n- Legacy deep candidates safely reduced to a broader tag: ${report.totals.legacyDeepReduced}\n- Hierarchical unmapped source standard units: ${report.totals.unmappedStandardUnits}\n\n## Interpretation\n\nThe older candidate generator can attach a deep pattern from any matching keyword. The hierarchy-first classifier requires that the rule be both compatible with the source standard unit and supported by content and solution independently. This comparison is a safety baseline, not a claim that broad fallback records are complete semantic classifications.\n`;
}

export function comparePilotClassificationStrategies() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const hierarchical = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
    if (pilot.digest !== hierarchical.pilotDigest) throw new Error('pilot digest mismatch');
    const hierarchicalByUid = new Map(hierarchical.classifications.map(item => [item.questionUid, item.classification]));
    const rows = pilot.items.map(item => {
        const oldDeep = Boolean(item.candidate.problemTypeKeyCandidate && item.candidate.templateKeyCandidate);
        const current = hierarchicalByUid.get(item.questionUid);
        if (!current) throw new Error(`missing hierarchical classification: ${item.questionUid}`);
        return {
            questionUid: item.questionUid,
            sourceArchiveFile: item.sourceArchiveFile,
            standardUnitKey: item.existingMetadata.standardUnitKey,
            legacyTagStatus: item.candidate.tagStatus,
            legacyDeepCandidate: oldDeep,
            hierarchicalDepth: current.classificationDepth,
            hierarchicalConfidence: current.confidence,
            hierarchicalRecommendationEligible: current.recommendationEligible,
            legacyDeepReduced: oldDeep && !current.recommendationEligible
        };
    });
    const stableReport = {
        schemaVersion: 'pilot-classification-strategy-comparison-v1',
        pilotDigest: pilot.digest,
        hierarchicalDigest: hierarchical.digest,
        totals: {
            pilotRecords: rows.length,
            legacyStatus: countBy(rows, 'legacyTagStatus'),
            legacyDeepCandidates: rows.filter(row => row.legacyDeepCandidate).length,
            hierarchicalRecommendationEligible: rows.filter(row => row.hierarchicalRecommendationEligible).length,
            legacyDeepReduced: rows.filter(row => row.legacyDeepReduced).length,
            unmappedStandardUnits: rows.filter(row => row.hierarchicalDepth === 'unmapped_standard_unit').length,
            hierarchicalDepth: countBy(rows, 'hierarchicalDepth')
        },
        rows
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = comparePilotClassificationStrategies();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'strategy-comparison-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'strategy-comparison-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase2/pilot-classification/strategy-comparison-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
