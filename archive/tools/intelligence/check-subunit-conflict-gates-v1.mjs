import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_goal_cues_v1.json');
const annotationsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-goal-annotations', 'archive-subunit-goal-annotations-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-gates');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function checkSubunitConflictGatesV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const annotations = JSON.parse(fs.readFileSync(annotationsPath, 'utf8'));
    const pairs = annotations.pairs.map(pair => ({
        standardUnitKey: pair.standardUnitKey,
        sampleCount: pair.sampleCount,
        autoPrimaryGoalCandidates: pair.autoPrimaryGoalCandidates,
        reviewRequired: pair.reviewRequired,
        goldLabelsAvailable: false,
        boundaryAccuracy: null,
        contentSolutionAgreement: null,
        gateStatus: 'FAIL_CLOSED_PENDING_GOLD_LABELS',
        productionUsable: false,
        requiredThresholds: {
            boundaryAccuracyMin: cues.minimumMargin === 2 ? 0.9 : 0.9,
            contentSolutionAgreementMin: 0.85
        }
    }));
    const stableReport = {
        schemaVersion: 'archive-subunit-conflict-gates-v1',
        annotationsDigest: annotations.digest,
        productionWriteAllowed: false,
        gatePolicy: {
            boundaryAccuracyMin: 0.9,
            contentSolutionAgreementMin: 0.85,
            failClosedWithoutGoldLabels: true
        },
        totals: {
            pairs: pairs.length,
            passed: pairs.filter(pair => pair.gateStatus === 'PASSED').length,
            failedClosed: pairs.filter(pair => pair.gateStatus === 'FAIL_CLOSED_PENDING_GOLD_LABELS').length
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = checkSubunitConflictGatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-conflict-gates-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-conflict-gates/archive-subunit-conflict-gates-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
