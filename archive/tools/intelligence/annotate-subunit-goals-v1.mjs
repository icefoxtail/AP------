import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_goal_cues_v1.json');
const adjudicationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-adjudication', 'archive-subunit-conflict-adjudication-v1.json');
const reviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-review', 'archive-subunit-conflict-review-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-goal-annotations');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hits = (text, cues) => cues.filter(cue => normalize(text).includes(normalize(cue)));

function score(sample, goal) {
    const contentHits = hits(sample.contentExcerpt, goal.cues);
    const solutionHits = hits(sample.solutionExcerpt, goal.cues);
    return { contentHits, solutionHits, score: contentHits.length + solutionHits.length };
}

export function annotateSubunitGoalsV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const adjudication = JSON.parse(fs.readFileSync(adjudicationPath, 'utf8'));
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    const reviewByKey = new Map(review.entries.map(entry => [entry.subUnitKey, entry]));
    const candidatePairs = adjudication.recommendations.filter(item => item.recommendation === 'SEPARATE_CANDIDATE_WITH_PRIMARY_GOAL_GUARD');
    const pairs = [];
    for (const pair of cues.pairs) {
        if (!candidatePairs.some(candidate => candidate.standardUnitKey === pair.standardUnitKey)) continue;
        const [firstKey, secondKey] = pair.keys;
        const entry = reviewByKey.get(firstKey);
        const samples = entry.boundary.map(sample => {
            const first = score(sample, pair.goals[firstKey]);
            const second = score(sample, pair.goals[secondKey]);
            const margin = Math.abs(first.score - second.score);
            const topKey = first.score >= second.score ? firstKey : secondKey;
            const autoStatus = Math.max(first.score, second.score) >= cues.minimumScore && margin >= cues.minimumMargin
                ? 'AUTO_PRIMARY_GOAL_CANDIDATE'
                : 'REVIEW_REQUIRED';
            return {
                questionUid: sample.questionUid,
                sourceArchiveFile: sample.sourceArchiveFile,
                sourceOrdinal: sample.sourceOrdinal,
                scores: { [firstKey]: first, [secondKey]: second },
                recommendedPrimaryGoal: autoStatus === 'AUTO_PRIMARY_GOAL_CANDIDATE' ? topKey : null,
                autoStatus,
                adjudication: 'PENDING_REVIEW'
            };
        });
        pairs.push({
            standardUnitKey: pair.standardUnitKey,
            subUnitKeys: pair.keys,
            sampleCount: samples.length,
            autoPrimaryGoalCandidates: samples.filter(sample => sample.autoStatus === 'AUTO_PRIMARY_GOAL_CANDIDATE').length,
            reviewRequired: samples.filter(sample => sample.autoStatus === 'REVIEW_REQUIRED').length,
            samples
        });
    }
    const stableReport = {
        schemaVersion: 'archive-subunit-goal-annotations-v1',
        cuesDigest: sha256(JSON.stringify(cues)),
        adjudicationDigest: adjudication.digest,
        productionWriteAllowed: false,
        totals: {
            candidatePairs: pairs.length,
            samples: pairs.reduce((sum, pair) => sum + pair.sampleCount, 0),
            autoPrimaryGoalCandidates: pairs.reduce((sum, pair) => sum + pair.autoPrimaryGoalCandidates, 0),
            reviewRequired: pairs.reduce((sum, pair) => sum + pair.reviewRequired, 0)
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = annotateSubunitGoalsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-goal-annotations-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-goal-annotations/archive-subunit-goal-annotations-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
