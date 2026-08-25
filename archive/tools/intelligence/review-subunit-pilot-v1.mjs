import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Structured review gate for evidence-ready sub-unit pilots. This ledger
 * records adjudication outcomes separately from the production master. A
 * sibling collision blocks approval even when lexical evidence is strong.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const validationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-validation', 'archive-subunit-pilot-validation-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const conditionallyApproved = new Set([
    'M2-01-REPEATING_DECIMAL',
    'M2-06-PARALLEL_LENGTH_RATIO'
]);

function reviewEntry(entry, siblings) {
    if (siblings.length > 1) {
        return {
            reviewStatus: 'TAXONOMY_CONFLICT',
            productionUsable: false,
            reason: `same standardUnitKey has ${siblings.length} evidence-ready siblings; current sample selection does not separate them`
        };
    }
    if (conditionallyApproved.has(entry.subUnitKey)) {
        return {
            reviewStatus: 'APPROVED_CANDIDATE',
            productionUsable: false,
            reason: 'single evidence-ready sibling with independent content/solution support; requires final curriculum and textbook sign-off'
        };
    }
    return {
        reviewStatus: 'REVIEW_REQUIRED',
        productionUsable: false,
        reason: 'evidence is insufficient for a non-conflicting approval decision'
    };
}

export function reviewSubunitPilotV1() {
    const validation = JSON.parse(fs.readFileSync(validationPath, 'utf8'));
    const entries = validation.stages.flatMap(stage => stage.entries
        .filter(entry => entry.status === 'PILOT_EVIDENCE_READY')
        .map(entry => ({ stageId: stage.stageId, ...entry })));
    const byStandard = new Map();
    for (const entry of entries) (byStandard.get(entry.standardUnitKey) ?? byStandard.set(entry.standardUnitKey, []).get(entry.standardUnitKey)).push(entry);
    const reviews = entries.map(entry => ({
        stageId: entry.stageId,
        standardUnitKey: entry.standardUnitKey,
        subUnitKey: entry.subUnitKey,
        subUnit: entry.subUnit,
        sampleCount: entry.sampleCount,
        evidenceRate: entry.evidenceRate,
        independentSupportRate: entry.independentSupportRate,
        ...reviewEntry(entry, byStandard.get(entry.standardUnitKey))
    }));
    const stableReport = {
        schemaVersion: 'archive-subunit-pilot-review-v1',
        validationDigest: validation.digest,
        productionWriteAllowed: false,
        reviewPolicy: {
            siblingConflictBlocksApproval: true,
            productionApprovalRequires: ['curriculum_alignment', 'textbook_toc_alignment', 'independent_content_solution_support', 'no_sibling_conflict']
        },
        totals: {
            reviewedEntries: reviews.length,
            approvedCandidates: reviews.filter(item => item.reviewStatus === 'APPROVED_CANDIDATE').length,
            taxonomyConflicts: reviews.filter(item => item.reviewStatus === 'TAXONOMY_CONFLICT').length,
            reviewRequired: reviews.filter(item => item.reviewStatus === 'REVIEW_REQUIRED').length
        },
        reviews
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function summaryMarkdown(report) {
    const rows = report.reviews.map(item => `| ${item.subUnitKey} | ${item.reviewStatus} | ${item.independentSupportRate} | ${item.reason} |`).join('\n');
    return `# Archive Sub-unit Pilot Review v1\n\n- Production write: none\n- Approved candidates: ${report.totals.approvedCandidates}\n- Taxonomy conflicts: ${report.totals.taxonomyConflicts}\n- Review required: ${report.totals.reviewRequired}\n\n| Sub-unit | Status | Independent support | Reason |\n|---|---|---:|---|\n${rows}\n\nAPPROVED_CANDIDATE means eligible for final sign-off only; it is not a production tag.\n`;
}

function main() {
    const report = reviewSubunitPilotV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-pilot-review-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-pilot-review-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-review/archive-subunit-pilot-review-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
