import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';
import { classifyItem, indexes } from './classify-pilot-hierarchical-v1.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const rulesPath = path.join(archiveDir, 'tools', 'tag-enrichment', 'data', 'pattern-rules.seed.json');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function normalizeSourceFile(relativeFile) {
    return relativeFile.replace(/^archive\/exams\//, '');
}

function buildRecords(inventory, identityMap, master, rules, exclusions) {
    const excludedFiles = new Set([
        ...exclusions.excludedSourceArchiveFiles,
        ...(exclusions.bulkOnlyExcludedSourceArchiveFiles || [])
    ].map(item => item.sourceArchiveFile));
    const identityByKey = new Map(identityMap.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
    const operatingSourceFiles = new Set(identityMap.records.map(record => record.sourceArchiveFile));
    const index = indexes(master);
    const records = [];
    const failures = [];
    for (const file of inventory.files) {
        const sourceArchiveFile = normalizeSourceFile(file.sourceFile);
        if (!operatingSourceFiles.has(sourceArchiveFile)) continue;
        if (excludedFiles.has(sourceArchiveFile)) continue;
        for (const question of file.questions) {
            const sourceOrdinal = question.originalIndex + 1;
            const identity = identityByKey.get(`${sourceArchiveFile}#${sourceOrdinal}`);
            if (!identity) {
                failures.push({ sourceArchiveFile, sourceOrdinal, reason: 'canonical identity missing' });
                continue;
            }
            const item = {
                questionUid: identity.questionUid,
                sourceArchiveFile,
                sourceOrdinal,
                existingMetadata: {
                    standardUnitKey: question.standardUnitKey,
                    standardUnit: question.standardUnit,
                    standardCourse: question.standardCourse,
                    difficultyBucket: question.level
                },
                sourceContext: {
                    content: question.content,
                    choices: question.choices,
                    answer: question.answer,
                    solution: question.solution,
                    image: question.image
                }
            };
            records.push({
                questionUid: identity.questionUid,
                sourceArchiveFile,
                sourceOrdinal,
                standardUnitKey: question.standardUnitKey,
                standardUnit: question.standardUnit,
                classification: classifyItem(item, index, rules)
            });
        }
    }
    return {
        records,
        failures,
        excludedFiles: [...excludedFiles],
        operatingSourceFiles: [...operatingSourceFiles].sort((a, b) => a.localeCompare(b, 'en')),
        outOfScopeFiles: inventory.files
            .map(file => normalizeSourceFile(file.sourceFile))
            .filter(sourceArchiveFile => !operatingSourceFiles.has(sourceArchiveFile))
            .sort((a, b) => a.localeCompare(b, 'en'))
    };
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals.classificationDepth).map(([key, count]) => `| ${key} | ${count} |`).join('\n');
    return `# Archive Hierarchical Semantic Classification v1\n\n- Eligible source records: ${report.totals.classifiedRecords}\n- Excluded source records: ${report.totals.excludedRecords}\n- Identity failures: ${report.totals.identityFailures}\n- Recommendation-eligible deep records: ${report.totals.recommendationEligible}\n\n| Classification depth | Count |\n|---|---:|\n${rows}\n\nNo source JS or production metadata was written. The output is a UID-keyed sidecar classification.\n`;
}

export function classifyArchiveHierarchicalV1() {
    const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8')).rules;
    const identityMap = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
    const exclusions = JSON.parse(fs.readFileSync(path.join(pilotDir, 'source-exclusions.json'), 'utf8'));
    const inventory = scanExamBank();
    const built = buildRecords(inventory, identityMap, master, rules, exclusions);
    const stableReport = {
        schemaVersion: 'archive-hierarchical-classification-v1',
        sourceCommit: identityMap.sourceCommit,
        identityDigest: identityMap.identityDigest,
        masterDigest: sha256(JSON.stringify(master)),
        productionWriteAllowed: false,
        excludedSourceArchiveFiles: built.excludedFiles,
        totals: {
            scannedFiles: built.operatingSourceFiles.length,
            scannedQuestions: identityMap.records.length,
            classifiedRecords: built.records.length,
            excludedRecords: identityMap.records.length - built.records.length,
            identityFailures: built.failures.length,
            recommendationEligible: built.records.filter(record => record.classification.recommendationEligible).length,
            classificationDepth: countBy(built.records.map(record => ({ classificationDepth: record.classification.classificationDepth })), 'classificationDepth'),
            confidence: countBy(built.records.map(record => ({ confidence: record.classification.confidence })), 'confidence')
        },
        failures: built.failures,
        outOfScopeFiles: built.outOfScopeFiles,
        records: built.records
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = classifyArchiveHierarchicalV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-hierarchical-classification-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-hierarchical-classification-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase2/archive-classification/archive-hierarchical-classification-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
