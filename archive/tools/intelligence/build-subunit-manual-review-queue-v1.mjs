import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const adjudicationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-subunit-adjudication', 'archive-independent-subunit-adjudication-v1.json');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_goal_cues_v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'manual-subunit-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const stripMarkup = value => String(value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
const normalize = value => stripMarkup(value).replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '');

function loadQuestion(sourceArchiveFile, sourceOrdinal) {
    const sourcePath = path.join(archiveDir, 'exams', sourceArchiveFile);
    const context = { window: {}, console };
    vm.runInNewContext(fs.readFileSync(sourcePath, 'utf8'), context, { filename: sourcePath });
    const bank = context.window.questionBank || [];
    return bank.find(question => Number(question.id) === Number(sourceOrdinal)) || bank[Number(sourceOrdinal) - 1] || null;
}

function buildQueue() {
    const adjudication = JSON.parse(fs.readFileSync(adjudicationPath, 'utf8'));
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const cueByUnit = new Map(cues.pairs.map(pair => [pair.standardUnitKey, pair]));
    const entries = [];
    for (const pair of adjudication.pairs) {
        const cuePair = cueByUnit.get(pair.standardUnitKey);
        for (const sample of pair.samples.filter(item => item.status === 'AI_REVIEW_REQUIRED')) {
            const question = loadQuestion(sample.sourceArchiveFile, sample.sourceOrdinal);
            const content = stripMarkup(question?.content);
            const solution = stripMarkup(question?.solution);
            const allText = normalize(`${content} ${solution}`);
            const cueHits = Object.fromEntries(pair.subUnitKeys.map(key => [key, (cuePair?.goals?.[key]?.cues || []).filter(cue => allText.includes(normalize(cue)))]));
            entries.push({
                reviewId: `${pair.standardUnitKey}:${sample.questionUid}`,
                standardUnitKey: pair.standardUnitKey,
                subUnitKeys: pair.subUnitKeys,
                sampleType: sample.sampleType,
                questionUid: sample.questionUid,
                sourceArchiveFile: sample.sourceArchiveFile,
                sourceOrdinal: sample.sourceOrdinal,
                sourceQuestionId: question?.id ?? null,
                sourceAnswer: question?.answer ?? null,
                sourceContent: question?.content ?? '',
                sourceSolution: question?.solution ?? '',
                contentText: content,
                solutionText: solution,
                cueHits,
                automatedEvidence: sample.independentEvidence,
                automatedScoreRecommendation: sample.scoreRecommendation,
                manualDecision: 'PENDING_MANUAL_REVIEW',
                productionWriteAllowed: false
            });
        }
    }
    const stableReport = {
        schemaVersion: 'archive-manual-subunit-review-queue-v1',
        sourceAdjudicationDigest: adjudication.digest,
        productionWriteAllowed: false,
        status: 'MANUAL_REVIEW_PENDING',
        totals: {
            entries: entries.length,
            byStandardUnit: Object.fromEntries([...new Set(entries.map(entry => entry.standardUnitKey))].sort().map(key => [key, entries.filter(entry => entry.standardUnitKey === key).length])),
            bySampleType: Object.fromEntries([...new Set(entries.map(entry => entry.sampleType))].sort().map(key => [key, entries.filter(entry => entry.sampleType === key).length]))
        },
        reviewPolicy: {
            confirmOnlyWhenPrimaryGoalIsExplicitInQuestionOrSolution: true,
            ambiguousOrEvidenceMissing: 'STANDARD_UNIT_FALLBACK',
            sourceAndMasterWrites: false
        },
        entries
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = buildQueue();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-manual-subunit-review-queue-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-review-queue-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
