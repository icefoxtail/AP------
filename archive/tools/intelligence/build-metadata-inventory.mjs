import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Phase 1 metadata inventory.
 *
 * This is an observation-only census. It does not generate approved tags and
 * never rewrites archive/exams or archive/db.js.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1');
const mapPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'inventory-latest.json');
const dbPath = path.join(archiveDir, 'db.js');

const METADATA_FIELDS = [
    'standardUnitKey',
    'standardUnit',
    'standardCourse',
    'subUnitKey',
    'subUnit',
    'conceptClusterKey',
    'problemTypeKey',
    'templateKey',
    'difficultyBucket',
    'tagConfidence',
    'tagStatus',
    'metadataRevision'
];

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeFile(value) {
    return String(value || '')
        .normalize('NFC')
        .replace(/\\/g, '/')
        .replace(/^exams\//, '')
        .replace(/^\.\//, '')
        .trim();
}

function stableString(value) {
    return JSON.stringify(value, Object.keys(value).sort());
}

function runArchiveScript(file, code) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: file, timeout: 1000 });
    return context;
}

function readQuestionBank(fullPath) {
    try {
        const context = runArchiveScript(fullPath, fs.readFileSync(fullPath, 'utf8'));
        const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
        if (!Array.isArray(questions)) return { ok: false, questions: [], error: 'questions array not found' };
        return { ok: true, questions, error: '' };
    } catch (error) {
        return { ok: false, questions: [], error: `${error?.name || 'Error'}: ${error?.message || String(error)}` };
    }
}

function readDb() {
    if (!fs.existsSync(dbPath)) return [];
    try {
        const context = runArchiveScript(dbPath, fs.readFileSync(dbPath, 'utf8'));
        return Array.isArray(context.window.mainDB?.exams) ? context.window.mainDB.exams : [];
    } catch {
        return [];
    }
}

function firstValue(question, names) {
    for (const name of names) {
        const value = question?.[name];
        if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return null;
}

function textValue(value) {
    if (value === undefined || value === null) return '';
    if (Array.isArray(value)) return value.length ? value.map(item => String(item)).join('|') : '';
    return String(value).trim();
}

function present(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== '';
}

function increment(map, key) {
    const normalized = key || '(empty)';
    map[normalized] = (map[normalized] || 0) + 1;
}

function sortedCounts(map) {
    return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function sourceKind(sourceFile) {
    if (sourceFile.startsWith('original/')) return 'original';
    if (sourceFile.startsWith('types/')) return 'types';
    return 'other';
}

function metadataStatus(record) {
    if (record.standardKeyClass === 'empty') return 'missing_standard_unit';
    if (record.standardKeyClass === 'raw') return 'raw_standard_unit';
    if (record.standardKeyClass === 'invalid') return 'invalid_standard_unit';
    if (record.missingMetadataFields.length === 0) return 'complete';
    return 'partial';
}

function fieldValue(question, field) {
    const aliases = {
        standardUnitKey: ['standardUnitKey'],
        standardUnit: ['standardUnit'],
        standardCourse: ['standardCourse'],
        subUnitKey: ['subUnitKey'],
        subUnit: ['subUnit'],
        conceptClusterKey: ['conceptClusterKey', 'conceptCluster'],
        problemTypeKey: ['problemTypeKey', 'typeKey'],
        templateKey: ['templateKey'],
        difficultyBucket: ['difficultyBucket', 'difficulty', 'level'],
        tagConfidence: ['tagConfidence'],
        tagStatus: ['tagStatus'],
        metadataRevision: ['metadataRevision', 'metadata_revision']
    };
    return firstValue(question, aliases[field] || [field]);
}

function renderSummary(report) {
    const rows = Object.entries(report.counts.metadataStatus)
        .sort(([, a], [, b]) => b - a)
        .map(([key, count]) => `| ${key} | ${count} |`)
        .join('\n');
    const fields = Object.entries(report.fieldPresence)
        .map(([field, value]) => `| ${field} | ${value.present} | ${value.missing} | ${value.coveragePercent}% |`)
        .join('\n');
    const keyClasses = Object.entries(report.counts.standardKeyClass)
        .sort(([, a], [, b]) => b - a)
        .map(([key, count]) => `| ${key} | ${count} |`)
        .join('\n');
    return `# Phase 1 Metadata Inventory\n\n- Generated: ${report.generatedAt}\n- Source commit: ${report.sourceCommit}\n- Files scanned: ${report.totals.files}\n- Questions scanned: ${report.totals.questions}\n- Load failures: ${report.totals.loadFailures}\n- Identity join failures: ${report.totals.identityJoinFailures}\n\n## Metadata Status\n\n| Status | Count |\n|---|---:|\n${rows}\n\n## Standard Key Class\n\n| Class | Count |\n|---|---:|\n${keyClasses}\n\n## Field Presence\n\n| Field | Present | Missing | Coverage |\n|---|---:|---:|---:|\n${fields}\n\n## Interpretation\n\n- This is an observation-only census; it does not approve or apply metadata.\n- invalid, raw, and missing_standard_unit remain explicit review states.\n- Fine-grained tags are only counted when already present in source data; no candidate tag was inferred here.\n- The detailed JSON is keyed by canonical questionUid and preserves source ordinal for collision-safe review.\n`;
}

export function buildMetadataInventory() {
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    const phase0Inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
    const sourceCommit = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim();
    const dbByFile = new Map();
    for (const exam of readDb()) {
        const file = normalizeFile(exam?.file);
        if (file) dbByFile.set(file, exam);
    }
    const rawKeySets = {
        invalid: new Set(Object.keys(phase0Inventory.raw?.invalidKeys || {})),
        raw: new Set(Object.keys(phase0Inventory.raw?.rawKeys || {}))
    };
    const byFile = new Map();
    for (const record of map.records) {
        if (!byFile.has(record.sourceArchiveFile)) byFile.set(record.sourceArchiveFile, []);
        byFile.get(record.sourceArchiveFile).push(record);
    }

    const records = [];
    const fileReports = [];
    const counts = {
        metadataStatus: {},
        standardKeyClass: {},
        sourceKind: {},
        sourceTrack: {},
        questionType: {},
        level: {},
        hasImage: { true: 0, false: 0 },
        hasChoices: { true: 0, false: 0 },
        hasAnswer: { true: 0, false: 0 },
        hasSolution: { true: 0, false: 0 }
    };
    const fieldTotals = Object.fromEntries(METADATA_FIELDS.map(field => [field, { present: 0, missing: 0 }]));
    let loadFailures = 0;
    let identityJoinFailures = 0;

    for (const [sourceFile, identityRecords] of [...byFile.entries()].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
        const fullPath = path.join(archiveDir, 'exams', sourceFile);
        const loaded = readQuestionBank(fullPath);
        if (!loaded.ok) loadFailures += 1;
        const fileStatus = { complete: 0, partial: 0, missing_standard_unit: 0, raw_standard_unit: 0, invalid_standard_unit: 0, errors: 0 };
        for (const identity of identityRecords.sort((a, b) => a.sourceOrdinal - b.sourceOrdinal)) {
            const question = loaded.questions[identity.sourceOrdinal - 1];
            if (!question) {
                identityJoinFailures += 1;
                fileStatus.errors += 1;
                continue;
            }
            const metadata = Object.fromEntries(METADATA_FIELDS.map(field => [field, textValue(fieldValue(question, field))]));
            const missingMetadataFields = METADATA_FIELDS.filter(field => !present(metadata[field]));
            const standardUnitKey = metadata.standardUnitKey;
            const standardKeyClass = !standardUnitKey
                ? 'empty'
                : rawKeySets.raw.has(standardUnitKey) || standardUnitKey.startsWith('RAW-')
                    ? 'raw'
                    : rawKeySets.invalid.has(standardUnitKey)
                        ? 'invalid'
                        : 'official';
            const content = textValue(question.content);
            const hasVisual = present(question.image) || /<img\b|<svg\b|<table\b/i.test(content);
            const record = {
                questionUid: identity.questionUid,
                legacyQKey: identity.legacyQKey,
                sourceArchiveFile: sourceFile,
                sourceOrdinal: identity.sourceOrdinal,
                sourceQuestionNo: identity.sourceQuestionNo,
                sourceKind: sourceKind(sourceFile),
                metadata,
                missingMetadataFields,
                standardKeyClass,
                metadataStatus: '',
                contentPresent: present(question.content),
                choicesPresent: Array.isArray(question.choices) && question.choices.length > 0,
                answerPresent: present(question.answer),
                solutionPresent: present(question.solution),
                hasImage: hasVisual,
                imageFieldPresent: present(question.image),
                questionType: textValue(question.questionType),
                level: textValue(question.level),
                dbRecordPresent: dbByFile.has(sourceFile)
            };
            record.metadataStatus = metadataStatus(record);
            fileStatus[record.metadataStatus] = (fileStatus[record.metadataStatus] || 0) + 1;
            increment(counts.metadataStatus, record.metadataStatus);
            increment(counts.standardKeyClass, standardKeyClass);
            increment(counts.sourceKind, record.sourceKind);
            increment(counts.sourceTrack, sourceFile.split('/')[2] || '(unknown)');
            increment(counts.questionType, record.questionType);
            increment(counts.level, record.level);
            counts.hasImage[String(record.hasImage)] += 1;
            counts.hasChoices[String(record.choicesPresent)] += 1;
            counts.hasAnswer[String(record.answerPresent)] += 1;
            counts.hasSolution[String(record.solutionPresent)] += 1;
            for (const field of METADATA_FIELDS) {
                if (present(metadata[field])) fieldTotals[field].present += 1;
                else fieldTotals[field].missing += 1;
            }
            records.push(record);
        }
        fileReports.push({
            sourceArchiveFile: sourceFile,
            sourceKind: sourceKind(sourceFile),
            dbRecordPresent: dbByFile.has(sourceFile),
            dbQCount: dbByFile.get(sourceFile)?.qCount ?? null,
            sourceQuestionCount: identityRecords.length,
            loadedQuestionCount: loaded.questions.length,
            loadOk: loaded.ok,
            loadError: loaded.error,
            metadataStatus: fileStatus
        });
    }

    const fieldPresence = Object.fromEntries(Object.entries(fieldTotals).map(([field, value]) => [field, {
        ...value,
        coveragePercent: Number(((value.present / map.records.length) * 100).toFixed(2))
    }]));
    const stablePayload = {
        schemaVersion: 'phase1-metadata-inventory-v1',
        sourceCommit,
        identityDigest: map.identityDigest,
        scope: 'canonical identity map records joined to archive/exams source fields',
        totals: {
            files: byFile.size,
            questions: records.length,
            expectedQuestions: map.records.length,
            loadFailures,
            identityJoinFailures,
            dbFiles: fileReports.filter(file => file.dbRecordPresent).length,
            dbMissingFiles: fileReports.filter(file => !file.dbRecordPresent).length
        },
        counts: Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, typeof value === 'object' && !Array.isArray(value) ? sortedCounts(value) : value])),
        fieldPresence,
        files: fileReports,
        records
    };
    const digest = sha256(JSON.stringify(stablePayload));
    return { generatedAt: new Date().toISOString(), digest, ...stablePayload };
}

function main() {
    const report = buildMetadataInventory();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'metadata-inventory-latest.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'metadata-inventory.summary.md'), renderSummary(report), 'utf8');
    if (report.totals.loadFailures || report.totals.identityJoinFailures || report.totals.questions !== report.totals.expectedQuestions) {
        throw new Error('metadata inventory failed integrity checks; inspect latest report');
    }
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase1/metadata-inventory-latest.json',
        digest: report.digest,
        files: report.totals.files,
        questions: report.totals.questions,
        loadFailures: report.totals.loadFailures,
        identityJoinFailures: report.totals.identityJoinFailures
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
