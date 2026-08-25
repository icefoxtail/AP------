import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_goal_cues_v1.json');
const reviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-review', 'archive-subunit-conflict-review-v1.json');
const exclusionsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'source-exclusions.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-resamples');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hitTerms = (text, terms) => terms.filter(term => compact(text).includes(compact(term)));
const excerpt = value => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 700);

function sourceExclusionSet() {
    if (!fs.existsSync(exclusionsPath)) return new Set();
    const exclusions = JSON.parse(fs.readFileSync(exclusionsPath, 'utf8'));
    return new Set([
        ...(exclusions.excludedSourceArchiveFiles ?? []),
        ...(exclusions.bulkOnlyExcludedSourceArchiveFiles ?? [])
    ]);
}

function records() {
    const excluded = sourceExclusionSet();
    const result = [];
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace('archive/exams/', '');
        if (excluded.has(sourceArchiveFile)) continue;
        for (const question of file.questions) {
            result.push({
                questionUid: `${sourceArchiveFile}#${question.originalIndex + 1}`,
                sourceArchiveFile,
                sourceOrdinal: question.originalIndex + 1,
                standardUnitKey: question.standardUnitKey,
                content: `${question.content ?? ''} ${(question.choices ?? []).join(' ')}`,
                solution: question.solution ?? ''
            });
        }
    }
    return result;
}

function existingUidSet() {
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    const result = new Set();
    for (const entry of review.entries) {
        for (const sample of [...entry.boundary, ...entry.disagreement]) result.add(sample.questionUid);
    }
    return result;
}

function scoreRecord(record, pair) {
    const scores = {};
    for (const key of pair.keys) {
        const cue = pair.goals[key].cues;
        const contentHits = hitTerms(record.content, cue);
        const solutionHits = hitTerms(record.solution, cue);
        scores[key] = {
            contentHits,
            solutionHits,
            contentScore: contentHits.length,
            solutionScore: solutionHits.length,
            totalScore: contentHits.length + solutionHits.length
        };
    }
    return scores;
}

function selectDiverse(pool, limit, used) {
    const selected = [];
    const sourceCounts = new Map();
    const ordered = [...pool].sort((a, b) => b.rank - a.rank || a.record.questionUid.localeCompare(b.record.questionUid));
    for (const candidate of ordered) {
        if (selected.length >= limit) break;
        if (used.has(candidate.record.questionUid)) continue;
        const count = sourceCounts.get(candidate.record.sourceArchiveFile) ?? 0;
        if (count >= 1) continue;
        selected.push(candidate);
        used.add(candidate.record.questionUid);
        sourceCounts.set(candidate.record.sourceArchiveFile, count + 1);
    }
    for (const candidate of ordered) {
        if (selected.length >= limit) break;
        if (used.has(candidate.record.questionUid)) continue;
        const count = sourceCounts.get(candidate.record.sourceArchiveFile) ?? 0;
        if (count >= 2) continue;
        selected.push(candidate);
        used.add(candidate.record.questionUid);
        sourceCounts.set(candidate.record.sourceArchiveFile, count + 1);
    }
    return selected;
}

function sampleDetail(candidate, sampleType, pair) {
    return {
        questionUid: candidate.record.questionUid,
        sourceArchiveFile: candidate.record.sourceArchiveFile,
        sourceOrdinal: candidate.record.sourceOrdinal,
        standardUnitKey: candidate.record.standardUnitKey,
        sampleType,
        scores: candidate.scores,
        contentExcerpt: excerpt(candidate.record.content),
        solutionExcerpt: excerpt(candidate.record.solution),
        adjudication: 'PENDING_REVIEW'
    };
}

export function resampleIndependentSubunitGoalsV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const existing = existingUidSet();
    const all = records();
    const pairs = [];
    for (const pair of cues.pairs) {
        const pool = all.filter(record => record.standardUnitKey === pair.standardUnitKey).map(record => ({ record, scores: scoreRecord(record, pair) }));
        const strongUsed = new Set(existing);
        const strongByGoal = {};
        for (const key of pair.keys) {
            const sibling = pair.keys.find(candidate => candidate !== key);
            const candidates = pool.filter(candidate => {
                const current = candidate.scores[key];
                const other = candidate.scores[sibling];
                return current.contentScore > 0 && current.solutionScore > 0 && current.totalScore >= 2 && current.totalScore - other.totalScore >= 2;
            }).map(candidate => ({ ...candidate, rank: candidate.scores[key].totalScore - candidate.scores[sibling].totalScore }));
            strongByGoal[key] = selectDiverse(candidates, 20, strongUsed).map(candidate => sampleDetail(candidate, `strong:${key}`, pair));
        }
        const boundaryCandidates = pool.filter(candidate => {
            const [first, second] = pair.keys.map(key => candidate.scores[key]);
            return first.totalScore > 0 && second.totalScore > 0;
        }).map(candidate => ({ ...candidate, rank: Math.min(...pair.keys.map(key => candidate.scores[key].totalScore)) }));
        const boundaryUsed = new Set(existing);
        const boundary = selectDiverse(boundaryCandidates, 20, boundaryUsed).map(candidate => sampleDetail(candidate, 'boundary', pair));
        const disagreementCandidates = pool.filter(candidate => {
            const [first, second] = pair.keys.map(key => candidate.scores[key]);
            const contentTop = first.contentScore === second.contentScore ? null : first.contentScore > second.contentScore ? pair.keys[0] : pair.keys[1];
            const solutionTop = first.solutionScore === second.solutionScore ? null : first.solutionScore > second.solutionScore ? pair.keys[0] : pair.keys[1];
            return (contentTop && solutionTop && contentTop !== solutionTop) || (contentTop && !solutionTop) || (!contentTop && solutionTop);
        }).map(candidate => ({ ...candidate, rank: Math.abs(candidate.scores[pair.keys[0]].contentScore - candidate.scores[pair.keys[1]].contentScore) + Math.abs(candidate.scores[pair.keys[0]].solutionScore - candidate.scores[pair.keys[1]].solutionScore) }));
        const disagreementUsed = new Set(existing);
        const disagreement = selectDiverse(disagreementCandidates, 10, disagreementUsed).map(candidate => sampleDetail(candidate, 'disagreement', pair));
        pairs.push({
            standardUnitKey: pair.standardUnitKey,
            subUnitKeys: pair.keys,
            poolCount: pool.length,
            excludedExistingSamples: existing.size,
            samplePlan: { strongPerKey: 20, boundary: 20, disagreement: 10 },
            actualCounts: {
                strong: Object.values(strongByGoal).reduce((sum, samples) => sum + samples.length, 0),
                boundary: boundary.length,
                disagreement: disagreement.length
            },
            strongByGoal,
            boundary,
            disagreement
        });
    }
    const stableReport = {
        schemaVersion: 'archive-independent-subunit-resamples-v1',
        cuesDigest: sha256(JSON.stringify(cues)),
        productionWriteAllowed: false,
        totals: {
            candidatePairs: pairs.length,
            pairsWithStrongShortfall: pairs.filter(pair => Object.values(pair.strongByGoal).some(samples => samples.length < 20)).length,
            pairsWithBoundaryShortfall: pairs.filter(pair => pair.boundary.length < 20).length,
            pairsWithDisagreementShortfall: pairs.filter(pair => pair.disagreement.length < 10).length,
            uniqueSamples: new Set(pairs.flatMap(pair => [
                ...Object.values(pair.strongByGoal).flat(), ...pair.boundary, ...pair.disagreement
            ]).map(sample => sample.questionUid)).size
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = resampleIndependentSubunitGoalsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-independent-subunit-resamples-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/independent-subunit-resamples/archive-independent-subunit-resamples-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
