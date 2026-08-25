import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Final sign-off ledger for non-conflicting pilot sub-unit candidates. */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const reviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-review', 'archive-subunit-pilot-review-v1.json');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-approval');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const sourceReferences = [
    { kind: 'curriculum', title: 'NCIC 국가교육과정정보센터 2022 개정 교육과정 자료', url: 'https://ncic.go.kr/' },
    { kind: 'textbook', title: '비상교육 자습서·평가문제집 중학 수학 2 (22개정)', url: 'https://m.book.visang.com/books/info/5967?tab=3' },
    { kind: 'archive-evidence', title: 'Archive pilot validation v1', path: 'archive/_generated/intelligence/phase3/subunit-validation/archive-subunit-pilot-validation-v1.json' }
];

export function approveSubunitCandidatesV1() {
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const active = new Map(master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active').map(item => [item.subUnitKey, item]));
    const candidates = review.reviews.filter(item => item.reviewStatus === 'APPROVED_CANDIDATE');
    const approvals = candidates.map(candidate => {
        const masterEntry = active.get(candidate.subUnitKey);
        if (!masterEntry) throw new Error(`approved candidate missing from active master: ${candidate.subUnitKey}`);
        if (masterEntry.standardUnitKey !== candidate.standardUnitKey || masterEntry.subUnit !== candidate.subUnit) {
            throw new Error(`master mismatch for approved candidate: ${candidate.subUnitKey}`);
        }
        return {
            standardUnitKey: candidate.standardUnitKey,
            subUnitKey: candidate.subUnitKey,
            subUnit: candidate.subUnit,
            conceptClusterKey: masterEntry.conceptClusterKey,
            status: 'APPROVED',
            productionUsable: true,
            alreadyInProductionMaster: true,
            evidence: {
                sampleCount: candidate.sampleCount,
                evidenceRate: candidate.evidenceRate,
                independentSupportRate: candidate.independentSupportRate,
                siblingConflict: false
            }
        };
    });
    const stableReport = {
        schemaVersion: 'archive-subunit-approval-v1',
        reviewDigest: review.digest,
        masterDigest: sha256(JSON.stringify(master)),
        productionWriteAllowed: false,
        approvalPolicy: {
            note: 'This ledger records approval; source JS and master files were not modified because approved keys already exist in the active master.',
            requiredEvidence: ['curriculum_alignment', 'textbook_alignment', 'independent_content_solution_support', 'no_sibling_conflict']
        },
        sourceReferences,
        totals: {
            approved: approvals.length,
            missingFromMaster: approvals.filter(item => !item.alreadyInProductionMaster).length
        },
        approvals
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function summaryMarkdown(report) {
    const rows = report.approvals.map(item => `| ${item.subUnitKey} | ${item.subUnit} | ${item.status} | ${item.evidence.independentSupportRate} |`).join('\n');
    return `# Archive Sub-unit Approval v1\n\n- Approved candidates: ${report.totals.approved}\n- Production master changes: none\n\n| Sub-unit | Label | Status | Independent support |\n|---|---|---|---:|\n${rows}\n\nThese keys were already present in the active master; this ledger records the sign-off state without rewriting source JS or master data.\n`;
}

function main() {
    const report = approveSubunitCandidatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-approval-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-approval-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-approval/archive-subunit-approval-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
