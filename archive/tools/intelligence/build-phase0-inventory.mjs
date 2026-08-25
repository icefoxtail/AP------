import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Phase 0A: read-only Archive Intelligence inventory.
 *
 * This deliberately does not write archive/exams, archive/db.js, or
 * archive/question-index.js. It produces only a derived snapshot below
 * archive/_generated/intelligence/phase0/.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const dbPath = path.join(archiveDir, 'db.js');
const indexBuilderPath = path.join(archiveDir, 'tools', 'build-question-index.mjs');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase0');
const outputPath = path.join(outputDir, 'inventory-latest.json');

function normalizePath(value) {
    return String(value || '').replace(/\\/g, '/').replace(/^exams\//, '').trim();
}

function runArchiveScript(file, code) {
    const context = {
        window: {},
        console: { log() {}, warn() {}, error() {} }
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: file });
    return context;
}

function readDb() {
    if (!fs.existsSync(dbPath)) return { exams: [], bytes: 0 };
    const code = fs.readFileSync(dbPath, 'utf8');
    const context = runArchiveScript(dbPath, code);
    const exams = Array.isArray(context.window.mainDB?.exams) ? context.window.mainDB.exams : [];
    return { exams, bytes: Buffer.byteLength(code, 'utf8') };
}

function readTrackedExamFiles() {
    const output = execFileSync('git', ['-C', repoRoot, 'ls-files', '-z', '--', 'archive/exams/*.js'], {
        maxBuffer: 64 * 1024 * 1024
    });
    return output.toString('utf8')
        .split('\0')
        .map(item => item.trim())
        .filter(Boolean)
        .map(relative => path.join(repoRoot, relative))
        .filter(file => fs.existsSync(file));
}

function collectExamFiles(db) {
    const tracked = readTrackedExamFiles();
    const dbListed = db.exams
        .map(exam => normalizePath(exam?.file))
        .filter(Boolean)
        .map(relative => path.join(examsDir, relative))
        .filter(file => fs.existsSync(file));
    const files = [...new Set([...tracked, ...dbListed])].sort((a, b) => a.localeCompare(b, 'en'));
    return {
        files,
        scope: tracked.length ? 'git-tracked + db-listed' : 'fs-fallback'
    };
}

function readOfficialKeys() {
    // The current index builder is the existing 142-key authority. Parse its
    // literal instead of copying the table into a second source of truth.
    const source = fs.readFileSync(indexBuilderPath, 'utf8');
    return new Set([...source.matchAll(/^\s*"([^"]+)":\s*\{\s*course:/gm)].map(match => match[1]));
}

function classifyKey(value, officialKeys) {
    const key = String(value || '').trim();
    if (!key) return 'empty';
    if (officialKeys.has(key)) return 'official';
    if (key.startsWith('RAW-')) return 'raw';
    return 'invalid';
}

function visualFlags(question) {
    const content = String(question?.content || '');
    return {
        explicitImage: Boolean(question?.image),
        contentImg: /<img\b/i.test(content),
        contentSvg: /<svg\b/i.test(content),
        contentTable: /<table\b/i.test(content)
    };
}

function present(value) {
    return value !== undefined && value !== null && String(value).trim() !== '';
}

function preview(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 240);
}

function addCount(map, key) {
    map[key] = (map[key] || 0) + 1;
}

const capturedAt = new Date().toISOString();
const db = readDb();
const examScope = collectExamFiles(db);
const officialKeys = readOfficialKeys();
const dbFileSet = new Set(db.exams.map(exam => normalizePath(exam?.file)).filter(Boolean));
const rawRecords = [];
const failures = [];
const fileIdIssues = [];
let sequence = 0;
let examBytes = 0;
let nonObjectQuestionSlots = 0;

for (const file of examScope.files) {
    const sourceFile = normalizePath(path.relative(examsDir, file));
    try {
        const code = fs.readFileSync(file, 'utf8');
        examBytes += Buffer.byteLength(code, 'utf8');
        const context = runArchiveScript(file, code);
        const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
        if (!Array.isArray(questions)) {
            failures.push({ sourceFile, error: 'questions array not found' });
            continue;
        }

        const idSlots = new Map();
        for (let slot = 0; slot < questions.length; slot += 1) {
            const question = questions[slot];
            if (!question || typeof question !== 'object') {
                nonObjectQuestionSlots += 1;
                continue;
            }

            const id = question.id ?? '';
            const idKey = String(id);
            if (!idSlots.has(idKey)) idSlots.set(idKey, []);
            idSlots.get(idKey).push(slot + 1);

            const standardUnitKey = String(question.standardUnitKey || '').trim();
            const flags = visualFlags(question);
            rawRecords.push({
                sequence: sequence++,
                qKey: `${sourceFile}_${id}`,
                sourceFile,
                sourceOrdinal: slot + 1,
                questionId: id,
                standardUnit: String(question.standardUnit || '').trim(),
                standardUnitKey,
                standardCourse: String(question.standardCourse || '').trim(),
                contentPresent: present(question.content),
                answerPresent: present(question.answer),
                solutionPresent: present(question.solution),
                choicesPresent: Array.isArray(question.choices),
                levelPresent: present(question.level),
                tagsPresent: present(question.tags),
                visual: flags,
                keyClass: classifyKey(standardUnitKey, officialKeys),
                contentLength: String(question.content || '').length,
                choicesLength: Array.isArray(question.choices)
                    ? question.choices.map(choice => String(choice || '')).join(' ').length
                    : 0,
                contentPreview: preview(question.content)
            });
        }

        const duplicateIds = [];
        let emptyIdCount = 0;
        for (const [id, slots] of idSlots) {
            if (!id) emptyIdCount += slots.length;
            else if (slots.length > 1) duplicateIds.push({ id, slots });
        }
        if (duplicateIds.length || emptyIdCount) {
            fileIdIssues.push({ sourceFile, total: questions.length, duplicateIds, emptyIdCount });
        }
    } catch (error) {
        failures.push({ sourceFile, error: error?.message || String(error) });
    }
}

const groupedByQKey = new Map();
for (const record of rawRecords) {
    if (!groupedByQKey.has(record.qKey)) groupedByQKey.set(record.qKey, []);
    groupedByQKey.get(record.qKey).push(record);
}

const collisions = [...groupedByQKey.entries()]
    .filter(([, records]) => records.length > 1)
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(([qKey, records]) => ({
        qKey,
        sourceFile: records[0].sourceFile,
        records: records.map(record => ({
            sourceOrdinal: record.sourceOrdinal,
            questionId: record.questionId,
            standardUnitKey: record.standardUnitKey,
            keyClass: record.keyClass,
            contentPresent: record.contentPresent,
            answerPresent: record.answerPresent,
            solutionPresent: record.solutionPresent,
            contentPreview: record.contentPreview
        }))
    }));

function preferred(a, b) {
    const aOfficial = a.keyClass === 'official' ? 1 : 0;
    const bOfficial = b.keyClass === 'official' ? 1 : 0;
    if (aOfficial !== bOfficial) return aOfficial > bOfficial ? a : b;
    const aUnitCourse = a.standardUnit && a.standardCourse ? 1 : 0;
    const bUnitCourse = b.standardUnit && b.standardCourse ? 1 : 0;
    if (aUnitCourse !== bUnitCourse) return aUnitCourse > bUnitCourse ? a : b;
    if (a.contentLength !== b.contentLength) return a.contentLength > b.contentLength ? a : b;
    if (a.choicesLength !== b.choicesLength) return a.choicesLength > b.choicesLength ? a : b;
    return a.sequence <= b.sequence ? a : b;
}

const deduplicatedRecords = [];
for (const records of groupedByQKey.values()) {
    let winner = records[0];
    for (let index = 1; index < records.length; index += 1) winner = preferred(winner, records[index]);
    deduplicatedRecords.push(winner);
}

function summarize(records) {
    const missing = {
        questionId: 0,
        content: 0,
        answer: 0,
        solution: 0,
        choices: 0,
        level: 0,
        standardUnit: 0,
        standardUnitKey: 0,
        standardCourse: 0,
        tags: 0
    };
    const keyCounts = { official: 0, raw: 0, invalid: 0, empty: 0 };
    const invalidKeys = {};
    const rawKeys = {};
    const visualTotals = { explicitImage: 0, contentImg: 0, contentSvg: 0, contentTable: 0, hasVisual: 0 };

    for (const record of records) {
        if (!present(record.questionId)) missing.questionId += 1;
        if (!record.contentPresent) missing.content += 1;
        if (!record.answerPresent) missing.answer += 1;
        if (!record.solutionPresent) missing.solution += 1;
        if (!record.choicesPresent) missing.choices += 1;
        if (!record.levelPresent) missing.level += 1;
        if (!record.standardUnit) missing.standardUnit += 1;
        if (!record.standardUnitKey) missing.standardUnitKey += 1;
        if (!record.standardCourse) missing.standardCourse += 1;
        if (!record.tagsPresent) missing.tags += 1;

        keyCounts[record.keyClass] += 1;
        if (record.keyClass === 'invalid') addCount(invalidKeys, record.standardUnitKey);
        if (record.keyClass === 'raw') addCount(rawKeys, record.standardUnitKey);

        for (const [name, value] of Object.entries(record.visual)) {
            if (value) visualTotals[name] += 1;
        }
        if (Object.values(record.visual).some(Boolean)) visualTotals.hasVisual += 1;
    }
    return { missing, keyCounts, invalidKeys, rawKeys, visualTotals };
}

const rawSummary = summarize(rawRecords);
const deduplicatedSummary = summarize(deduplicatedRecords);

const dbMissingSourceFiles = [...dbFileSet]
    .filter(file => !examScope.files.some(full => normalizePath(path.relative(examsDir, full)) === file))
    .sort((a, b) => a.localeCompare(b, 'en'));

const stableSnapshot = {
    scope: examScope.scope,
    dbExamCount: db.exams.length,
    dbBytes: db.bytes,
    examFileCount: examScope.files.length,
    examBytes,
    sourceQuestionCount: rawRecords.length,
    deduplicatedQuestionCount: groupedByQKey.size,
    qKeyDuplicateGroupCount: collisions.length,
    qKeyDuplicateRecordCount: collisions.reduce((sum, group) => sum + group.records.length - 1, 0),
    nonObjectQuestionSlots,
    failures,
    fileIdIssues,
    dbMissingSourceFileCount: dbMissingSourceFiles.length,
    dbMissingSourceFiles,
    raw: rawSummary,
    deduplicated: deduplicatedSummary,
    collisions
};

const digest = crypto.createHash('sha256').update(JSON.stringify(stableSnapshot)).digest('hex');
const output = {
    schemaVersion: 'phase0-inventory-v1',
    capturedAt,
    sourceCommit: execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim(),
    digest,
    ...stableSnapshot
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
    output: path.relative(repoRoot, outputPath).replace(/\\/g, '/'),
    sourceCommit: output.sourceCommit,
    digest: output.digest,
    examFileCount: output.examFileCount,
    sourceQuestionCount: output.sourceQuestionCount,
    deduplicatedQuestionCount: output.deduplicatedQuestionCount,
    qKeyDuplicateGroupCount: output.qKeyDuplicateGroupCount,
    invalidStandardKeyCountRaw: output.raw.keyCounts.invalid,
    invalidStandardKeyCountDeduplicated: output.deduplicated.keyCounts.invalid,
    rawKeyCount: output.raw.keyCounts.raw,
    failureCount: output.failures.length
}, null, 2));
