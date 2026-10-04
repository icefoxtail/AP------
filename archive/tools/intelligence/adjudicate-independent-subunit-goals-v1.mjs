import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_goal_cues_v1.json');
const resamplesPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-resamples', 'archive-independent-subunit-resamples-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-adjudication');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hitTerms = (text, cues) => cues.filter(cue => normalize(text).includes(normalize(cue)));

const anchorWeight = (standardUnitKey, key, cue) => {
    const high = {
        'M2-04': { 'M2-04-LINEAR_FUNCTION_EQUATION': ['두 직선', '교점', '해의 개수', '일치', '평행'], 'M2-04-LINEAR_FUNCTION_BASIC': ['기울기', '절편', '두 점을 지나는 직선'] },
        'M2-05': { 'M2-05-TRIANGLE_PROPERTIES': ['이등변', '직각삼각형', '합동', '내심', '외심', '무게중심'], 'M2-05-QUADRILATERAL_PROPERTIES': ['평행사변형', '사다리꼴', '직사각형', '마름모', '정사각형', '사각형의 대각선'] },
        'M3-03': { 'M3-03-QUADRATIC_EQUATION': ['인수분해', '완전제곱', '근의 공식', '판별식', '근과 계수'], 'M3-03-QUADRATIC_EQUATION_WORD': ['넓이', '수량', '연속 정수', '속력', '변수 설정', '식 수립'] }
    };
    return high[standardUnitKey]?.[key]?.includes(cue) ? 2 : 1;
};

function independentTextDecision(standardUnitKey, keys, goals, text) {
    const scores = Object.fromEntries(keys.map(key => [key, goals[key].cues.reduce((sum, cue) => sum + (normalize(text).includes(normalize(cue)) ? anchorWeight(standardUnitKey, key, cue) : 0), 0)]));
    const [first, second] = keys;
    if (scores[first] === 0 && scores[second] === 0) return { label: null, scores };
    if (scores[first] === scores[second]) return { label: null, scores };
    return { label: scores[first] > scores[second] ? first : second, scores };
}

function scoreRecommendation(keys, sample) {
    const first = sample.scores[keys[0]];
    const second = sample.scores[keys[1]];
    if (!first || !second) return null;
    const top = first.totalScore >= second.totalScore ? keys[0] : keys[1];
    const max = Math.max(first.totalScore, second.totalScore);
    const margin = Math.abs(first.totalScore - second.totalScore);
    return max >= 2 && margin >= 2 ? top : null;
}

function adjudicateSample(pair, sample) {
    const scoreRecommendationLabel = scoreRecommendation(pair.keys, sample);
    const content = independentTextDecision(pair.standardUnitKey, pair.keys, pair.goals, sample.contentExcerpt);
    const solution = independentTextDecision(pair.standardUnitKey, pair.keys, pair.goals, sample.solutionExcerpt);
    const independentRecommendation = content.label && content.label === solution.label ? content.label : null;
    const confirmed = scoreRecommendationLabel && scoreRecommendationLabel === independentRecommendation;
    return {
        questionUid: sample.questionUid,
        sourceArchiveFile: sample.sourceArchiveFile,
        sourceOrdinal: sample.sourceOrdinal,
        sampleType: sample.sampleType,
        scoreRecommendation: scoreRecommendationLabel,
        independentRecommendation,
        independentEvidence: { content, solution },
        goldLabel: confirmed ? scoreRecommendationLabel : null,
        status: confirmed ? 'AI_GOLD_CONFIRMED' : 'AI_REVIEW_REQUIRED',
        productionUsable: false
    };
}

export function adjudicateIndependentSubunitGoalsV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const resamples = JSON.parse(fs.readFileSync(resamplesPath, 'utf8'));
    const pairs = resamples.pairs.map(resamplePair => {
        const cuePair = cues.pairs.find(pair => pair.standardUnitKey === resamplePair.standardUnitKey);
        const samples = [
            ...Object.values(resamplePair.strongByGoal).flat(),
            ...resamplePair.boundary,
            ...resamplePair.disagreement
        ].map(sample => adjudicateSample(cuePair, sample));
        const boundary = samples.filter(sample => sample.sampleType === 'boundary');
        const disagreements = samples.filter(sample => sample.sampleType === 'disagreement');
        return {
            standardUnitKey: resamplePair.standardUnitKey,
            subUnitKeys: resamplePair.subUnitKeys,
            sampleCounts: resamplePair.actualCounts,
            confirmed: samples.filter(sample => sample.status === 'AI_GOLD_CONFIRMED').length,
            reviewRequired: samples.filter(sample => sample.status === 'AI_REVIEW_REQUIRED').length,
            boundaryConfirmed: boundary.filter(sample => sample.status === 'AI_GOLD_CONFIRMED').length,
            boundaryReviewRequired: boundary.filter(sample => sample.status === 'AI_REVIEW_REQUIRED').length,
            disagreementConfirmed: disagreements.filter(sample => sample.status === 'AI_GOLD_CONFIRMED').length,
            samples
        };
    });
    const stableReport = {
        schemaVersion: 'archive-independent-subunit-adjudication-v1',
        resamplesDigest: resamples.digest,
        productionWriteAllowed: false,
        status: 'AI_ADJUDICATION_CANDIDATE',
        totals: {
            candidatePairs: pairs.length,
            samples: pairs.reduce((sum, pair) => sum + pair.confirmed + pair.reviewRequired, 0),
            confirmed: pairs.reduce((sum, pair) => sum + pair.confirmed, 0),
            reviewRequired: pairs.reduce((sum, pair) => sum + pair.reviewRequired, 0),
            boundaryConfirmed: pairs.reduce((sum, pair) => sum + pair.boundaryConfirmed, 0)
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = adjudicateIndependentSubunitGoalsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-independent-subunit-adjudication-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/independent-subunit-adjudication/archive-independent-subunit-adjudication-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
