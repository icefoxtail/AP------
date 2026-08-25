import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const annotationsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-goal-annotations', 'archive-subunit-goal-annotations-v1.json');
const reviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-review', 'archive-subunit-conflict-review-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-goal-gold-labels');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hitCount = (text, cues) => cues.filter(cue => normalize(text).includes(normalize(cue))).length;

const pairCues = {
    'M2-04': {
        labels: ['M2-04-LINEAR_FUNCTION_BASIC', 'M2-04-LINEAR_FUNCTION_EQUATION'],
        cues: {
            'M2-04-LINEAR_FUNCTION_BASIC': ['y=ax+b', '기울기', '절편', '그래프 위의 점', '두 점을 지나는 직선'],
            'M2-04-LINEAR_FUNCTION_EQUATION': ['ax+by+c=0', '두 직선', '교점', '해의 개수', '일치', '평행']
        }
    },
    'M2-05': {
        labels: ['M2-05-TRIANGLE_PROPERTIES', 'M2-05-QUADRILATERAL_PROPERTIES'],
        cues: {
            'M2-05-TRIANGLE_PROPERTIES': ['삼각형', '이등변', '직각삼각형', '합동', '내심', '외심', '무게중심', '삼각형의 내각'],
            'M2-05-QUADRILATERAL_PROPERTIES': ['평행사변형', '사다리꼴', '직사각형', '마름모', '정사각형', '사각형의 대각선']
        }
    },
    'M3-03': {
        labels: ['M3-03-QUADRATIC_EQUATION', 'M3-03-QUADRATIC_EQUATION_WORD'],
        cues: {
            'M3-03-QUADRATIC_EQUATION': ['인수분해', '완전제곱', '근의 공식', '판별식', '근과 계수', '주어진 이차방정식'],
            'M3-03-QUADRATIC_EQUATION_WORD': ['넓이', '수량', '연속 정수', '길이', '속력', '변수 설정', '식 수립', '세워']
        }
    }
};

function independentTextDecision(pair, text) {
    const [first, second] = pair.labels;
    const firstHits = hitCount(text, pair.cues[first]);
    const secondHits = hitCount(text, pair.cues[second]);
    if (firstHits === 0 && secondHits === 0) return { label: null, firstHits, secondHits };
    if (firstHits > 0 && secondHits > 0 && firstHits === secondHits) return { label: null, firstHits, secondHits };
    if (firstHits > secondHits) return { label: first, firstHits, secondHits };
    if (secondHits > firstHits) return { label: second, firstHits, secondHits };
    return { label: null, firstHits, secondHits };
}

function independentDecision(pair, sample) {
    const content = independentTextDecision(pair, sample.contentExcerpt);
    const solution = independentTextDecision(pair, sample.solutionExcerpt);
    const label = content.label && content.label === solution.label ? content.label : null;
    return { label, content, solution };
}

export function goldLabelSubunitGoalsV1() {
    const annotations = JSON.parse(fs.readFileSync(annotationsPath, 'utf8'));
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    const reviewByUid = new Map();
    for (const entry of review.entries) for (const sample of entry.boundary) reviewByUid.set(sample.questionUid, sample);
    const pairs = annotations.pairs.map(annotationPair => {
        const pair = pairCues[annotationPair.standardUnitKey];
        const samples = annotationPair.samples.map(annotation => {
            const sample = reviewByUid.get(annotation.questionUid);
            const independent = independentDecision(pair, sample);
            const agreement = annotation.recommendedPrimaryGoal && independent.label === annotation.recommendedPrimaryGoal;
            const status = agreement ? 'AI_GOLD_CONFIRMED' : 'AI_REVIEW_REQUIRED';
            return {
                questionUid: annotation.questionUid,
                sourceArchiveFile: annotation.sourceArchiveFile,
                sourceOrdinal: annotation.sourceOrdinal,
                scoreRecommendation: annotation.recommendedPrimaryGoal,
                independentRecommendation: independent.label,
                independentEvidence: independent,
                goldLabel: agreement ? annotation.recommendedPrimaryGoal : null,
                status,
                productionUsable: false
            };
        });
        return {
            standardUnitKey: annotationPair.standardUnitKey,
            subUnitKeys: annotationPair.subUnitKeys,
            sampleCount: samples.length,
            confirmed: samples.filter(sample => sample.status === 'AI_GOLD_CONFIRMED').length,
            reviewRequired: samples.filter(sample => sample.status === 'AI_REVIEW_REQUIRED').length,
            samples
        };
    });
    const stableReport = {
        schemaVersion: 'archive-subunit-goal-gold-labels-v1',
        annotationsDigest: annotations.digest,
        reviewDigest: review.digest,
        status: 'AI_ADJUDICATION_CANDIDATE',
        productionWriteAllowed: false,
        totals: {
            candidatePairs: pairs.length,
            samples: pairs.reduce((sum, pair) => sum + pair.sampleCount, 0),
            confirmed: pairs.reduce((sum, pair) => sum + pair.confirmed, 0),
            reviewRequired: pairs.reduce((sum, pair) => sum + pair.reviewRequired, 0)
        },
        pairs
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = goldLabelSubunitGoalsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-goal-gold-labels-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-goal-gold-labels/archive-subunit-goal-gold-labels-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
