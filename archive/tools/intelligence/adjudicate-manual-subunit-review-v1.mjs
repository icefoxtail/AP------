import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const queuePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review', 'archive-manual-subunit-review-queue-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

// Human-style primary-goal adjudication after reading each queued source prompt and solution.
// Indexes are the stable queue order emitted by build-subunit-manual-review-queue-v1.mjs.
const decisions = [
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph properties'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph properties'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'explicit parallel-line condition'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function translation and intercept'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'multiple lines, intersections, and bounded area'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function translation and intercept'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph properties; parallel is only an option'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function translation'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line equation graph properties'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'explicit parallel-line condition'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'explicit parallel-line condition'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'system has no solution; parallel/distinct lines'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'two line equations and their intersection'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'area bounded by two graphs and their intersection'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'find one function from two axis-intercept points'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'three-line parallel/concurrent conditions'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'coincident translated graphs'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph properties; parallel is only an option'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function translation'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph properties; parallel is only an option'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-line equation graph properties'],
    ['M2-04-LINEAR_FUNCTION_EQUATION', 'explicit relation between equation and function graphs'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'find one linear function through two points'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'find one linear function through two points'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph shape'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph from intercepts'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'collinear points determine one function'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function slope from increments'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph direction'],
    ['M2-04-LINEAR_FUNCTION_BASIC', 'single-function graph sign/quadrant analysis'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram/rhombus diagonal theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rectangle angle property'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'prove parallelogram from parallel/equal opposite side'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'prove opposite sides of parallelogram equal'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram midpoint/angle theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram angle-bisector theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rhombus area from diagonals'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rectangle folding geometry'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram area partition'],
    ['M2-05-TRIANGLE_PROPERTIES', 'triangle incenter theorem'],
    ['M2-05-TRIANGLE_PROPERTIES', 'right-triangle congruence and angle sum'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram/rhombus diagonal theorem'],
    ['M2-05-TRIANGLE_PROPERTIES', 'angle-bisector right-triangle congruence'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'rectangle angle property'],
    ['M2-05-TRIANGLE_PROPERTIES', 'connected isosceles-triangle angle chase'],
    ['M2-05-TRIANGLE_PROPERTIES', 'triangle angle-side theorem'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'prove opposite sides of parallelogram equal'],
    ['M2-05-TRIANGLE_PROPERTIES', 'isosceles-triangle altitude bisects base'],
    ['M2-05-QUADRILATERAL_PROPERTIES', 'parallelogram midpoint/angle theorem'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic quadratic discriminant/roots'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic quadratic discriminant/roots'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic repeated-root test'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic repeated-root test'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic repeated-root test'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic repeated-root test'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic repeated-root test'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic perfect-square factorization'],
    ['M3-03-QUADRATIC_EQUATION', 'algebraic quadratic formula'],
    ['M3-03-QUADRATIC_EQUATION_WORD', 'word model: projectile height equation'],
];

export function adjudicateManualSubunitReviewV1() {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    if (queue.entries.length !== decisions.length) throw new Error(`decision count ${decisions.length} does not match queue ${queue.entries.length}`);
    const entries = queue.entries.map((entry, index) => {
        const [manualLabel, rationale] = decisions[index];
        if (!entry.subUnitKeys.includes(manualLabel)) throw new Error(`invalid label ${manualLabel} for ${entry.reviewId}`);
        return {
            ...entry,
            manualDecision: 'MANUAL_CONFIRMED',
            manualLabel,
            manualRationale: rationale,
            sourceContentSolutionReviewed: true,
            productionUsable: false
        };
    });
    const stableReport = {
        schemaVersion: 'archive-manual-subunit-review-v1',
        sourceQueueDigest: queue.digest,
        productionWriteAllowed: false,
        status: 'MANUAL_REVIEW_COMPLETE_NONPRODUCTION',
        reviewPolicy: queue.reviewPolicy,
        totals: {
            entries: entries.length,
            manualConfirmed: entries.filter(entry => entry.manualDecision === 'MANUAL_CONFIRMED').length,
            unresolved: entries.filter(entry => entry.manualDecision !== 'MANUAL_CONFIRMED').length,
            byStandardUnit: Object.fromEntries([...new Set(entries.map(entry => entry.standardUnitKey))].sort().map(key => [key, entries.filter(entry => entry.standardUnitKey === key).length])),
            byManualLabel: Object.fromEntries([...new Set(entries.map(entry => entry.manualLabel))].sort().map(key => [key, entries.filter(entry => entry.manualLabel === key).length]))
        },
        entries
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = adjudicateManualSubunitReviewV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-manual-subunit-review-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-review-v1.json', digest: report.digest, status: report.status, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
