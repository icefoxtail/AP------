import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const rulesPath = path.join(archiveDir, 'data', 'master_tables', 'subunit_conflict_rules_v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-conflict-resamples');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const hitAny = (text, terms) => terms.some(term => compact(text).includes(compact(term)));

function records() {
    const result = [];
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace('archive/exams/', '');
        for (const question of file.questions) result.push({
            questionUid: `${sourceArchiveFile}#${question.originalIndex + 1}`,
            sourceArchiveFile,
            sourceOrdinal: question.originalIndex + 1,
            standardUnitKey: question.standardUnitKey,
            content: `${question.content ?? ''} ${(question.choices ?? []).join(' ')}`,
            solution: question.solution ?? ''
        });
    }
    return result;
}

function classifyForRule(record, rule) {
    const contentInclude = hitAny(record.content, rule.include);
    const solutionInclude = hitAny(record.solution, rule.include);
    const contentExclude = hitAny(record.content, rule.exclude);
    const solutionExclude = hitAny(record.solution, rule.exclude);
    return { contentInclude, solutionInclude, contentExclude, solutionExclude };
}

export function resampleSubunitConflictsV1() {
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    const all = records();
    const byStandard = new Map();
    for (const rule of rules.rules) {
        const standardUnitKey = rule.subUnitKey.split('-').slice(0, 2).join('-');
        const pool = all.filter(record => record.standardUnitKey === standardUnitKey);
        const scored = pool.map(record => ({ record, evidence: classifyForRule(record, rule) }));
        const strong = scored.filter(item => item.evidence.contentInclude && item.evidence.solutionInclude && !item.evidence.contentExclude && !item.evidence.solutionExclude).slice(0, 20);
        const conflictRule = rules.rules.find(candidate => candidate.subUnitKey === rule.conflictWith[0]);
        const boundary = conflictRule ? scored.filter(item => {
            const other = classifyForRule(item.record, conflictRule);
            return (item.evidence.contentInclude || item.evidence.solutionInclude) && (other.contentInclude || other.solutionInclude);
        }).slice(0, 20) : [];
        const disagreement = scored.filter(item => item.evidence.contentInclude !== item.evidence.solutionInclude).slice(0, 10);
        byStandard.set(rule.subUnitKey, {
            subUnitKey: rule.subUnitKey,
            standardUnitKey,
            poolCount: pool.length,
            samplePlan: { strong: 20, boundary: 20, disagreement: 10 },
            actualCounts: { strong: strong.length, boundary: boundary.length, disagreement: disagreement.length },
            strong: strong.map(item => ({ questionUid: item.record.questionUid, sourceArchiveFile: item.record.sourceArchiveFile, sourceOrdinal: item.record.sourceOrdinal })),
            boundary: boundary.map(item => ({ questionUid: item.record.questionUid, sourceArchiveFile: item.record.sourceArchiveFile, sourceOrdinal: item.record.sourceOrdinal })),
            disagreement: disagreement.map(item => ({ questionUid: item.record.questionUid, sourceArchiveFile: item.record.sourceArchiveFile, sourceOrdinal: item.record.sourceOrdinal }))
        });
    }
    const stableReport = {
        schemaVersion: 'archive-subunit-conflict-resamples-v1',
        rulesDigest: sha256(JSON.stringify(rules)),
        productionWriteAllowed: false,
        totals: {
            ruleCount: rules.rules.length,
            rulesWithStrongShortfall: [...byStandard.values()].filter(item => item.actualCounts.strong < 20).length,
            rulesWithBoundarySamples: [...byStandard.values()].filter(item => item.actualCounts.boundary > 0).length
        },
        samples: [...byStandard.values()]
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = resampleSubunitConflictsV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-conflict-resamples-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-conflict-resamples/archive-subunit-conflict-resamples-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
