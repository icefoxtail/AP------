import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');

export function auditM303SampleAvailabilityV1() {
    const cues = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data/master_tables/subunit_conflict_goal_cues_v1.json'), 'utf8'));
    const pair = cues.pairs.find(item => item.standardUnitKey === 'M3-03');
    const resamples = JSON.parse(fs.readFileSync(path.join(archiveDir, '_generated/intelligence/phase3/independent-subunit-resamples/archive-independent-subunit-resamples-v1.json'), 'utf8'));
    const supplemental = JSON.parse(fs.readFileSync(path.join(archiveDir, '_generated/intelligence/phase3/manual-subunit-review/archive-supplemental-manual-subunit-review-v1.json'), 'utf8'));
    const used = new Set([
        ...resamples.pairs.flatMap(item => [...Object.values(item.strongByGoal).flat(), ...item.boundary, ...item.disagreement]).map(sample => sample.questionUid),
        ...supplemental.entries.map(entry => entry.questionUid)
    ]);
    const availableStrong = Object.fromEntries(pair.keys.map(key => [key, 0]));
    let availableMixedBoundary = 0;
    let remainingRecords = 0;
    for (const file of scanExamBank().files) for (const question of file.questions) {
        if (question.standardUnitKey !== 'M3-03') continue;
        const sourceArchiveFile = file.sourceFile.replace('archive/exams/', '');
        const questionUid = `${sourceArchiveFile}#${question.originalIndex + 1}`;
        if (used.has(questionUid)) continue;
        remainingRecords++;
        const content = compact(`${question.content ?? ''} ${(question.choices ?? []).join(' ')}`);
        const solution = compact(question.solution ?? '');
        const scores = Object.fromEntries(pair.keys.map(key => {
            const contentScore = pair.goals[key].cues.filter(cue => content.includes(compact(cue))).length;
            const solutionScore = pair.goals[key].cues.filter(cue => solution.includes(compact(cue))).length;
            return [key, { contentScore, solutionScore, totalScore: contentScore + solutionScore }];
        }));
        for (const key of pair.keys) {
            const other = pair.keys.find(candidate => candidate !== key);
            if (scores[key].contentScore > 0 && scores[key].solutionScore > 0 && scores[key].totalScore >= 2 && scores[key].totalScore - scores[other].totalScore >= 2) availableStrong[key]++;
        }
        if (pair.keys.every(key => scores[key].totalScore > 0)) availableMixedBoundary++;
    }
    const stableReport = {
        schemaVersion: 'archive-m303-sample-availability-audit-v1',
        resamplesDigest: resamples.digest,
        supplementalDigest: supplemental.digest,
        productionWriteAllowed: false,
        standardUnitKey: 'M3-03',
        gatePolicy: { strongSampleMinPerKey: 20, mixedBoundarySampleMin: 20 },
        totals: {
            reviewedOrSampledUidsExcluded: used.size,
            remainingRecords,
            availableStrongByKey: availableStrong,
            availableMixedBoundary,
            canReachStrongMinimum: Object.values(availableStrong).every(count => count >= 20),
            canReachMixedBoundaryMinimum: availableMixedBoundary >= 20
        },
        disposition: 'STANDARD_UNIT_FALLBACK_LOCKED_NO_ADDITIONAL_SAMPLE_CAN_SATISFY_GATE'
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = auditM303SampleAvailabilityV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-m303-sample-availability-audit-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-m303-sample-availability-audit-v1.json', digest: report.digest, totals: report.totals, disposition: report.disposition }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
