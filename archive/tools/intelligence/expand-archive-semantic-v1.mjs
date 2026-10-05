import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

/**
 * Meaning-expansion pass for the conservative hierarchical sidecar.
 *
 * This pass never edits source JS or production metadata. It uses the
 * documented master labels, curriculum-track priors, and independent
 * content/solution cue agreement to produce reviewable candidates. A
 * candidate is not a production tag until it is separately approved.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const inputPath = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification', 'archive-hierarchical-classification-v1.json');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'semantic-expansion');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const stripMarkup = value => String(value ?? '').replace(/<[^>]+>/g, ' ');
const normalize = value => stripMarkup(value)
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/\$|\{|\}|\^|_|\\/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const compact = value => normalize(value).replace(/[\s··,\.\(\)\[\]{}:;!?/\\+*=<>~%\-]/g, '');

const trackPrior = sourceArchiveFile => {
    if (/^original\/middle\//.test(sourceArchiveFile)) return ['M1-', 'M2-', 'M3-'];
    if (/^original\/high\//.test(sourceArchiveFile)) return ['H22-', 'H15-'];
    return [];
};

const semanticCues = [
    { id: 'quadratic-function-graph', keys: ['QUADRATIC_FUNCTION_GRAPH'], cues: ['이차함수', '그래프', '꼭짓점', '대칭축', '최댓값', '최솟값', '축'] },
    { id: 'quadratic-function-application', keys: ['QUADRATIC_FUNCTION_APPLICATION'], cues: ['이차함수', '넓이', '최대', '최소', '길이', '활용'] },
    { id: 'quadratic-equation', keys: ['QUADRATIC_EQUATION'], cues: ['이차방정식', '판별식', '근의 공식', '중근', '실근', '허근'] },
    { id: 'polynomial-multiplication', keys: ['POLYNOMIAL_MULTIPLICATION', 'POLYNOMIAL_OPERATIONS'], cues: ['다항식', '전개', '곱셈공식', '인수분해', '세제곱'] },
    { id: 'exponent-law', keys: ['EXPONENT_LAW'], cues: ['지수법칙', '거듭제곱', '지수', '밑'] },
    { id: 'trig-ratio', keys: ['TRIG_RATIO', 'TRIG_RATIO_APPLICATION'], cues: ['삼각비', '직각삼각형', '사인', '코사인', '탄젠트'] },
    { id: 'linear-equation', keys: ['LINEAR_EQUATION', 'LINEAR_EQUATION_WORD_PROBLEM'], cues: ['일차방정식', '거리', '속력', '시간', '미지수'] },
    { id: 'simultaneous-linear-equation', keys: ['SIMULTANEOUS_LINEAR_EQUATION', 'SIMULTANEOUS_LINEAR_EQUATION_WORD_PROBLEM'], cues: ['연립방정식', '두 식', '미지수'] },
    { id: 'linear-inequality', keys: ['LINEAR_INEQUALITY', 'LINEAR_INEQUALITY_WORD_PROBLEM'], cues: ['일차부등식', '부등식', '범위', '이상', '이하', '미만', '초과'] },
    { id: 'probability', keys: ['PROBABILITY_BASIC', 'PROBABILITY_COUNTING'], cues: ['확률', '경우의 수', '경우', '여사건', '선택'] },
    { id: 'pythagorean', keys: ['PYTHAGOREAN_THEOREM', 'PYTHAGOREAN_APPLICATION'], cues: ['피타고라스', '직각삼각형', '빗변', '거리'] },
    { id: 'similarity', keys: ['SIMILAR_FIGURE', 'PARALLEL_LENGTH_RATIO'], cues: ['닮음', '평행선', '비례', '선분의 길이'] }
];

function ngrams(value, size = 2) {
    const text = compact(value);
    const result = new Set();
    for (let index = 0; index <= text.length - size; index += 1) result.add(text.slice(index, index + size));
    return result;
}

function similarity(source, target) {
    const left = ngrams(source);
    const right = ngrams(target);
    if (!left.size || !right.size) return 0;
    let intersection = 0;
    for (const item of left) if (right.has(item)) intersection += 1;
    return intersection / (left.size + right.size - intersection);
}

function buildMasterIndex(master) {
    const active = master.filter(item => item.status === 'active');
    const standards = active.filter(item => item.keyType === 'standardUnitKey');
    const subUnits = active.filter(item => item.keyType === 'subUnitKey');
    const concepts = active.filter(item => item.keyType === 'conceptClusterKey');
    const types = active.filter(item => item.keyType === 'problemTypeKey');
    const templates = active.filter(item => item.keyType === 'templateKey');
    const byConcept = new Map();
    for (const item of [...concepts, ...subUnits, ...types, ...templates]) {
        if (item.conceptClusterKey) (byConcept.get(item.conceptClusterKey) ?? byConcept.set(item.conceptClusterKey, []).get(item.conceptClusterKey)).push(item);
    }
    return { standards, subUnits, concepts, types, templates, byConcept };
}

function cueHits(text, cues) {
    const normalized = compact(text);
    return cues.filter(cue => normalized.includes(compact(cue)));
}

function classifySemanticCandidate(record, source, masterIndex) {
    const content = normalize(`${source.content ?? ''} ${(source.choices ?? []).join(' ')}`);
    const solution = normalize(source.solution ?? '');
    const combined = `${content} ${solution}`;
    const sourceUnit = record.standardUnit ?? '';
    const sourceKey = record.standardUnitKey ?? '';
    const tracks = trackPrior(record.sourceArchiveFile);
    const activeKey = masterIndex.standards.some(item => item.key === sourceKey);
    const baseClassification = record.classification;

    const standardScores = masterIndex.standards.map(item => {
        const label = item.labelKo ?? '';
        const labelCompact = compact(label);
        const sourceCompact = compact(sourceUnit);
        const contentCompact = compact(combined);
        const exactSource = sourceCompact && (sourceCompact === labelCompact || sourceCompact.includes(labelCompact) || labelCompact.includes(sourceCompact));
        const contentHit = labelCompact && contentCompact.includes(labelCompact);
        const contentSimilarity = similarity(sourceUnit || combined, label);
        let score = Math.max(contentSimilarity, exactSource ? 0.9 : 0, contentHit ? 0.82 : 0);
        if (tracks.some(prefix => item.key.startsWith(prefix))) score += 0.08;
        if (activeKey && item.key === sourceKey) score += 0.3;
        return { key: item.key, label, score: Math.min(1, score), exactSource, contentHit };
    }).sort((a, b) => b.score - a.score || a.key.localeCompare(b.key));
    const best = standardScores[0];
    const second = standardScores[1];
    const margin = best ? best.score - (second?.score ?? 0) : 0;
    const contentCueMatches = semanticCues.map(group => ({ id: group.id, keys: group.keys, hits: cueHits(content, group.cues) })).filter(item => item.hits.length);
    const solutionCueMatches = semanticCues.map(group => ({ id: group.id, keys: group.keys, hits: cueHits(solution, group.cues) })).filter(item => item.hits.length);
    const agreedCues = contentCueMatches.filter(contentGroup => solutionCueMatches.some(solutionGroup => solutionGroup.id === contentGroup.id));

    const semanticStandard = !activeKey && best && best.score >= 0.82 && margin >= 0.12 && (best.exactSource || agreedCues.length > 0)
        ? best
        : null;
    const chosenStandard = activeKey ? masterIndex.standards.find(item => item.key === sourceKey) : semanticStandard;
    const compatibleCues = agreedCues.filter(group => {
        const keys = new Set(group.keys);
        return masterIndex.subUnits.some(item => item.standardUnitKey === chosenStandard?.key && keys.has(item.conceptClusterKey));
    });
    // A cue group that spans two documented concepts is evidence for review,
    // not enough evidence to choose one production sub-unit automatically.
    const compatibleCue = compatibleCues.length === 1 && compatibleCues[0].keys.length === 1
        ? compatibleCues[0]
        : null;
    const candidateSubUnit = compatibleCue
        ? masterIndex.subUnits.find(item => item.standardUnitKey === chosenStandard.key && compatibleCue.keys.includes(item.conceptClusterKey))
        : null;
    const candidatesForConcept = compatibleCue
        ? masterIndex.byConcept.get(candidateSubUnit?.conceptClusterKey) ?? []
        : [];
    const candidateType = candidatesForConcept.find(item => item.keyType === 'problemTypeKey');
    const candidateTemplate = candidatesForConcept.find(item => item.keyType === 'templateKey');
    let status = 'unresolved';
    if (semanticStandard && semanticStandard.exactSource && margin >= 0.2 && tracks.some(prefix => semanticStandard.key.startsWith(prefix))) status = 'standard_candidate';
    else if (semanticStandard && compatibleCue) status = 'promote_candidate';
    else if (semanticStandard || compatibleCue) status = 'review_candidate';
    else if (activeKey && baseClassification.classificationDepth === 'single_documented_subunit' && agreedCues.length) status = 'review_candidate';

    return {
        status,
        sourceStandardUnitKey: sourceKey,
        sourceStandardUnit: sourceUnit,
        suggestedStandardUnitKey: semanticStandard?.key ?? (activeKey ? sourceKey : ''),
        suggestedStandardUnit: semanticStandard?.label ?? (activeKey ? sourceUnit : ''),
        suggestedSubUnitKey: candidateSubUnit?.subUnitKey ?? '',
        suggestedConceptClusterKey: candidateSubUnit?.conceptClusterKey ?? compatibleCue?.keys?.[0] ?? '',
        suggestedProblemTypeKey: candidateType?.problemTypeKey ?? '',
        suggestedTemplateKey: candidateTemplate?.templateKey ?? '',
        confidence: ['standard_candidate', 'promote_candidate'].includes(status) ? 'medium' : status === 'review_candidate' ? 'low' : 'none',
        evidence: {
            standardTopCandidates: standardScores.slice(0, 3),
            standardMargin: Number(margin.toFixed(4)),
            contentCueMatches,
            solutionCueMatches,
            agreedCueIds: agreedCues.map(item => item.id),
            rationale: status === 'standard_candidate'
                ? 'source standard label exactly matches one documented active standard; deep tags intentionally withheld'
                : status === 'promote_candidate'
                    ? 'documented standard candidate and same semantic cue group independently supported by content and solution'
                : status === 'review_candidate'
                    ? 'semantic evidence exists but requires review before any production tag'
                    : 'no sufficiently unique documented semantic candidate'
        }
    };
}

function buildSourceLookup() {
    const lookup = new Map();
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace(/^archive\/exams\//, '');
        for (const question of file.questions) lookup.set(`${sourceArchiveFile}#${question.originalIndex + 1}`, question);
    }
    return lookup;
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.status).map(([key, count]) => `| ${key} | ${count} |`).join('\n');
    const sourceRows = Object.entries(report.totals.sourceDepth).map(([key, count]) => `| ${key} | ${count} |`).join('\n');
    return `# Archive Semantic Expansion v1\n\n- Input records: ${report.totals.inputRecords}\n- Semantic candidates: ${report.totals.semanticCandidates}\n- Production metadata write: none\n\n## Candidate status\n\n| Status | Count |\n|---|---:|\n${rows}\n\n## Input classification depth\n\n| Depth | Count |\n|---|---:|\n${sourceRows}\n\nCandidates are UID-keyed review evidence only. No candidate is applied to source JS or production metadata.\n`;
}

export function expandArchiveSemanticV1() {
    const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const masterIndex = buildMasterIndex(master);
    const sources = buildSourceLookup();
    const records = input.records.map(record => {
        const source = sources.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`) ?? {};
        return { ...record, semanticExpansion: classifySemanticCandidate(record, source, masterIndex) };
    });
    const status = {};
    const sourceDepth = {};
    for (const record of records) {
        const currentStatus = record.semanticExpansion.status;
        status[currentStatus] = (status[currentStatus] ?? 0) + 1;
        const depth = record.classification.classificationDepth;
        sourceDepth[depth] = (sourceDepth[depth] ?? 0) + 1;
    }
    const stableReport = {
        schemaVersion: 'archive-semantic-expansion-v1',
        inputDigest: input.digest,
        masterDigest: sha256(JSON.stringify(master)),
        productionWriteAllowed: false,
        totals: {
            inputRecords: records.length,
            semanticCandidates: records.filter(record => record.semanticExpansion.status !== 'unresolved').length,
            status: Object.fromEntries(Object.entries(status).sort(([a], [b]) => a.localeCompare(b, 'en'))),
            sourceDepth: Object.fromEntries(Object.entries(sourceDepth).sort(([a], [b]) => a.localeCompare(b, 'en')))
        },
        records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = expandArchiveSemanticV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-semantic-expansion-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-semantic-expansion-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase2/semantic-expansion/archive-semantic-expansion-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
