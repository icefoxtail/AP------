import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queuePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review', 'archive-supplemental-subunit-review-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

// Manual primary-goal decisions for the supplemental source/solution pass.
const decisions = [
    ['M2-05-QUADRILATERAL_PROPERTIES', 'square/diagonal theorem is primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram theorem is primary'],
    ['M2-05-TRIANGLE_PROPERTIES', 'right-isosceles triangle congruence is primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'square diagonal theorem is primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'square diagonal and congruence theorem is primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram angle theorem is primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'two-square area geometry is primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram properties are primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram diagonal theorem is primary'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram criterion is primary'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'moving points and area model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'land/path area model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'garden/path width model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'square-side length word model'],
    ['M3-03-QUADRATIC_EQUATION', 'completing-square algebraic method, not model construction'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'tile dimensions and area model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'rectangle area/perimeter model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'flowerbed/path area model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'triangle side lengths form an application model'],
    ['M3-03-QUADRATIC_EQUATION', 'geometric derivation of quadratic formula'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'rectangle tile area model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'sum of square areas and side lengths'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'golden-ratio length model'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'box volume and dimensions model'],
    ['M3-03-QUADRATIC_EQUATION', 'quadratic discriminant/roots'],
    ['M3-03-QUADRATIC_EQUATION', 'quadratic root relation'],
    ['M3-03-QUADRATIC_EQUATION', 'quadratic discriminant/roots'],
    ['M3-03-QUADRATIC_EQUATION', 'quadratic formula comparison'],
    [null, 'source is annulus area; no quadratic-equation goal evidence; standard fallback'],
    ['M3-03-QUADRATIC_EQUATION', 'quadratic root by substitution/factorization']
];

export function adjudicateSupplementalSubunitReviewV1() {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const entries = queue.pairs.flatMap(pair => pair.samples);
    if (entries.length !== decisions.length) throw new Error(`decision count ${decisions.length} does not match queue ${entries.length}`);
    const reviewed = entries.map((entry, index) => {
        const [manualLabel, rationale] = decisions[index];
        if (manualLabel && !entry.subUnitKeys.includes(manualLabel)) throw new Error(`invalid label ${manualLabel} for ${entry.questionUid}`);
        return {
            ...entry,
            manualDecision: manualLabel ? 'MANUAL_CONFIRMED' : 'MANUAL_STANDARD_FALLBACK',
            manualLabel,
            manualRationale: rationale,
            sourceContentSolutionReviewed: true,
            productionUsable: false
        };
    });
    const stableReport = {
        schemaVersion: 'archive-supplemental-manual-subunit-review-v1',
        sourceQueueDigest: queue.digest,
        productionWriteAllowed: false,
        status: 'SUPPLEMENTAL_MANUAL_REVIEW_COMPLETE_NONPRODUCTION',
        policy: queue.policy,
        totals: {
            entries: reviewed.length,
            manualConfirmed: reviewed.filter(entry => entry.manualDecision === 'MANUAL_CONFIRMED').length,
            standardFallback: reviewed.filter(entry => entry.manualDecision === 'MANUAL_STANDARD_FALLBACK').length,
            unresolved: reviewed.filter(entry => !entry.manualDecision).length,
            mixedBoundaryReviewed: reviewed.filter(entry => entry.qualifiesForBoundaryCoverage && entry.manualDecision === 'MANUAL_CONFIRMED').length,
            byStandardUnit: Object.fromEntries([...new Set(reviewed.map(entry => entry.standardUnitKey))].sort().map(key => [key, reviewed.filter(entry => entry.standardUnitKey === key).length])),
            byManualLabel: Object.fromEntries([...new Set(reviewed.map(entry => entry.manualLabel).filter(Boolean))].sort().map(key => [key, reviewed.filter(entry => entry.manualLabel === key).length]))
        },
        entries: reviewed
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = adjudicateSupplementalSubunitReviewV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-supplemental-manual-subunit-review-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-supplemental-manual-subunit-review-v1.json', digest: report.digest, status: report.status, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
