import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'high_first_wave_candidate_cues_v1.json');
const resamplesPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-high-candidate-resamples', 'archive-independent-high-candidate-resamples-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-high-candidate-adjudication');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hitTerms = (text, terms) => terms.filter(term => compact(text).includes(compact(term)));

function score(sample, terms) {
    const contentHits = hitTerms(sample.contentExcerpt, terms);
    const solutionHits = hitTerms(sample.solutionExcerpt, terms);
    return { contentHits, solutionHits, contentScore: contentHits.length, solutionScore: solutionHits.length, totalScore: contentHits.length + solutionHits.length };
}

function adjudicateDomain(domain, cueDomain) {
    const keys = Object.keys(cueDomain.candidates);
    const scored = domain.samples.map(sample => ({ sample, scores: Object.fromEntries(keys.map(key => [key, score(sample, cueDomain.candidates[key])])) }));
    const candidateStats = keys.map(key => {
        const strong = scored.filter(item => {
            const current = item.scores[key];
            const siblingMax = Math.max(...keys.filter(other => other !== key).map(other => item.scores[other].totalScore));
            return current.contentScore > 0 && current.solutionScore > 0 && current.totalScore >= 2 && current.totalScore - siblingMax >= 2;
        });
        return { candidateKey: key, strongCount: Math.min(20, strong.length), strongShortfall: strong.length < 20 };
    });
    const decisions = scored.map(item => {
        const contentScores = keys.map(key => item.scores[key].contentScore);
        const solutionScores = keys.map(key => item.scores[key].solutionScore);
        const contentTopScore = Math.max(...contentScores);
        const solutionTopScore = Math.max(...solutionScores);
        const contentTop = contentTopScore > 0 && contentScores.filter(scoreValue => scoreValue === contentTopScore).length === 1 ? keys[contentScores.indexOf(contentTopScore)] : null;
        const solutionTop = solutionTopScore > 0 && solutionScores.filter(scoreValue => scoreValue === solutionTopScore).length === 1 ? keys[solutionScores.indexOf(solutionTopScore)] : null;
        const totalScores = keys.map(key => item.scores[key].totalScore);
        const totalTop = Math.max(...totalScores);
        const totalTopKey = totalTop > 0 && totalScores.filter(scoreValue => scoreValue === totalTop).length === 1 ? keys[totalScores.indexOf(totalTop)] : null;
        return {
            questionUid: item.sample.questionUid,
            scoreRecommendation: totalTopKey && totalTop >= 2 && totalTop - Math.max(...totalScores.filter((_, index) => keys[index] !== totalTopKey)) >= 2 ? totalTopKey : null,
            independentRecommendation: contentTop && contentTop === solutionTop ? contentTop : null,
            status: totalTopKey && totalTopKey === contentTop && totalTopKey === solutionTop ? 'AI_GOLD_CONFIRMED' : 'AI_REVIEW_REQUIRED'
        };
    });
    const boundary = scored.filter(item => keys.filter(key => item.scores[key].totalScore > 0).length >= 2);
    return {
        standardUnitKey: domain.standardUnitKey,
        sampleCount: domain.sampleCount,
        coverageStatus: domain.coverageStatus,
        candidates: candidateStats,
        confirmed: decisions.filter(decision => decision.status === 'AI_GOLD_CONFIRMED').length,
        reviewRequired: decisions.filter(decision => decision.status === 'AI_REVIEW_REQUIRED').length,
        boundaryCount: boundary.length,
        boundaryConfirmed: decisions.filter((decision, index) => boundary.some(item => item.sample.questionUid === decision.questionUid) && decision.status === 'AI_GOLD_CONFIRMED').length,
        decisions,
        productionUsable: false
    };
}

export function adjudicateIndependentHighCandidatesV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const resamples = JSON.parse(fs.readFileSync(resamplesPath, 'utf8'));
    const domains = resamples.domains.map(domain => adjudicateDomain(domain, cues.domains.find(candidate => candidate.standardUnitKey === domain.standardUnitKey)));
    const stableReport = {
        schemaVersion: 'archive-independent-high-candidate-adjudication-v1',
        cuesDigest: sha256(JSON.stringify(cues)),
        resamplesDigest: resamples.digest,
        productionWriteAllowed: false,
        status: 'AI_ADJUDICATION_CANDIDATE',
        totals: {
            domains: domains.length,
            independentReady: domains.filter(domain => domain.coverageStatus === 'INDEPENDENT_READY').length,
            samples: domains.reduce((sum, domain) => sum + domain.sampleCount, 0),
            confirmed: domains.reduce((sum, domain) => sum + domain.confirmed, 0),
            reviewRequired: domains.reduce((sum, domain) => sum + domain.reviewRequired, 0)
        },
        domains
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = adjudicateIndependentHighCandidatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-independent-high-candidate-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/independent-high-candidate-adjudication/archive-independent-high-candidate-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
