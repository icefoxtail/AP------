import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const rulesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_rules_v1.json');
const resamplesPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-resamples', 'archive-subunit-conflict-resamples-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-review');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hitAny = (text, terms) => terms.filter(term => compact(text).includes(compact(term)));
const excerpt = value => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 700);

function buildRecordMap() {
    const map = new Map();
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace('archive/exams/', '');
        for (const question of file.questions) {
            const questionUid = `${sourceArchiveFile}#${question.originalIndex + 1}`;
            map.set(questionUid, {
                questionUid,
                sourceArchiveFile,
                sourceOrdinal: question.originalIndex + 1,
                standardUnitKey: question.standardUnitKey,
                content: `${question.content ?? ''} ${(question.choices ?? []).join(' ')}`,
                solution: question.solution ?? ''
            });
        }
    }
    return map;
}

function evidence(record, rule) {
    const contentInclude = hitAny(record.content, rule.include);
    const solutionInclude = hitAny(record.solution, rule.include);
    const contentExclude = hitAny(record.content, rule.exclude);
    const solutionExclude = hitAny(record.solution, rule.exclude);
    return {
        contentInclude,
        solutionInclude,
        contentExclude,
        solutionExclude,
        anyInclude: [...new Set([...contentInclude, ...solutionInclude])],
        anyExclude: [...new Set([...contentExclude, ...solutionExclude])]
    };
}

function enrichSample(questionUid, recordMap, rule, siblingRule) {
    const record = recordMap.get(questionUid);
    if (!record) return { questionUid, missing: true };
    return {
        questionUid,
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        standardUnitKey: record.standardUnitKey,
        contentExcerpt: excerpt(record.content),
        solutionExcerpt: excerpt(record.solution),
        currentRuleEvidence: evidence(record, rule),
        siblingRuleEvidence: siblingRule ? evidence(record, siblingRule) : null,
        adjudication: 'PENDING_REVIEW'
    };
}

export function reviewSubunitConflictBoundariesV1() {
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    const resamples = JSON.parse(fs.readFileSync(resamplesPath, 'utf8'));
    const recordMap = buildRecordMap();
    const rulesByKey = new Map(rules.rules.map(rule => [rule.subUnitKey, rule]));
    const samplesByKey = new Map(resamples.samples.map(sample => [sample.subUnitKey, sample]));
    const entries = [];
    for (const rule of rules.rules) {
        const siblingRule = rulesByKey.get(rule.conflictWith[0]);
        const sample = samplesByKey.get(rule.subUnitKey);
        entries.push({
            subUnitKey: rule.subUnitKey,
            conflictWith: rule.conflictWith,
            standardUnitKey: sample.standardUnitKey,
            boundary: sample.boundary.map(item => enrichSample(item.questionUid, recordMap, rule, siblingRule)),
            disagreement: sample.disagreement.map(item => enrichSample(item.questionUid, recordMap, rule, siblingRule))
        });
    }
    const stableReport = {
        schemaVersion: 'archive-subunit-conflict-review-v1',
        resamplesDigest: resamples.digest,
        productionWriteAllowed: false,
        totals: {
            ruleCount: entries.length,
            boundarySamples: entries.reduce((sum, entry) => sum + entry.boundary.length, 0),
            disagreementSamples: entries.reduce((sum, entry) => sum + entry.disagreement.length, 0),
            pendingAdjudications: entries.reduce((sum, entry) => sum + entry.boundary.length + entry.disagreement.length, 0)
        },
        entries
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = reviewSubunitConflictBoundariesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-conflict-review-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-conflict-review/archive-subunit-conflict-review-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
