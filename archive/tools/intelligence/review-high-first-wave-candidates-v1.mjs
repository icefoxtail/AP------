import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'high_first_wave_candidate_cues_v1.json');
const validationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'high-first-wave-validation', 'archive-high-first-wave-validation-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'high-first-wave-candidate-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hits = (text, terms) => terms.filter(term => compact(text).includes(compact(term)));

function score(sample, terms) {
    const contentHits = hits(sample.contentExcerpt, terms);
    const solutionHits = hits(sample.solutionExcerpt, terms);
    return { contentHits, solutionHits, contentScore: contentHits.length, solutionScore: solutionHits.length, totalScore: contentHits.length + solutionHits.length };
}

function summarizeDomain(domain, cueDomain) {
    const keys = Object.keys(cueDomain.candidates);
    const scored = domain.samples.map(sample => ({ sample, scores: Object.fromEntries(keys.map(key => [key, score(sample, cueDomain.candidates[key])])) }));
    const candidates = keys.map(key => {
        const strong = scored.filter(item => {
            const current = item.scores[key];
            const siblingMax = Math.max(...keys.filter(other => other !== key).map(other => item.scores[other].totalScore));
            return current.contentScore > 0 && current.solutionScore > 0 && current.totalScore >= 2 && current.totalScore - siblingMax >= 2;
        }).slice(0, 20);
        return {
            candidateKey: key,
            strongCount: strong.length,
            strongShortfall: strong.length < 20,
            strongSampleUids: strong.map(item => item.sample.questionUid)
        };
    });
    const boundary = scored.filter(item => {
        const active = keys.filter(key => item.scores[key].totalScore > 0);
        return active.length >= 2;
    }).slice(0, 20);
    const disagreement = scored.filter(item => {
        const contentScores = keys.map(key => item.scores[key].contentScore);
        const solutionScores = keys.map(key => item.scores[key].solutionScore);
        const contentTop = Math.max(...contentScores);
        const solutionTop = Math.max(...solutionScores);
        return contentTop > 0 && solutionTop > 0 && contentScores.indexOf(contentTop) !== solutionScores.indexOf(solutionTop);
    }).slice(0, 10);
    const boundaryOverlapRate = domain.samples.length === 0 ? 0 : boundary.length / Math.min(20, domain.samples.length);
    return {
        standardUnitKey: domain.standardUnitKey,
        candidateCount: keys.length,
        sampleCount: domain.sampleCount,
        candidates,
        boundaryCount: boundary.length,
        disagreementCount: disagreement.length,
        boundaryOverlapRate: Number(boundaryOverlapRate.toFixed(3)),
        reviewStatus: candidates.every(candidate => !candidate.strongShortfall) && boundary.length <= 5 ? 'REVIEW_CANDIDATE' : 'CONFLICT_OR_SHORTFALL',
        productionUsable: false,
        boundarySampleUids: boundary.map(item => item.sample.questionUid),
        disagreementSampleUids: disagreement.map(item => item.sample.questionUid)
    };
}

export function reviewHighFirstWaveCandidatesV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const validation = JSON.parse(fs.readFileSync(validationPath, 'utf8'));
    const domains = cues.domains.map(cueDomain => summarizeDomain(validation.domains.find(domain => domain.standardUnitKey === cueDomain.standardUnitKey), cueDomain));
    const stableReport = {
        schemaVersion: 'archive-high-first-wave-candidate-review-v1',
        cuesDigest: sha256(JSON.stringify(cues)),
        validationDigest: validation.digest,
        productionWriteAllowed: false,
        totals: {
            domains: domains.length,
            reviewCandidates: domains.filter(domain => domain.reviewStatus === 'REVIEW_CANDIDATE').length,
            conflictOrShortfall: domains.filter(domain => domain.reviewStatus === 'CONFLICT_OR_SHORTFALL').length,
            candidates: domains.reduce((sum, domain) => sum + domain.candidateCount, 0)
        },
        domains
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = reviewHighFirstWaveCandidatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-high-first-wave-candidate-review-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/high-first-wave-candidate-review/archive-high-first-wave-candidate-review-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
