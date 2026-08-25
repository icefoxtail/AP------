import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/* Promote only the explicitly adjudicated candidate set. */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const phase1Dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1');
const phase3Dir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'complete-subunit-classification');
const adjudicationPath = path.join(phase1Dir, 'master-audit', 'cross-unit-adjudication', 'cross-unit-adjudication-v1.json');
const classificationPath = path.join(phase3Dir, 'archive-complete-subunit-classification-v1.json');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const outputDir = path.join(phase1Dir, 'master-audit', 'cross-unit-adjudication');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function loadQuestions(filePath) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 3000 });
    if (!Array.isArray(context.window.questionBank)) throw new Error(`questionBank missing: ${filePath}`);
    return context.window.questionBank;
}

function replaceField(block, field, value) {
    const pattern = new RegExp('(\\n\\s*"' + field + '"\\s*:\\s*)("(?:[^"\\\\]|\\\\.)*"|-?\\d+)(,?)');
    if (!pattern.test(block)) throw new Error(`field missing in question block: ${field}`);
    return block.replace(pattern, (_match, prefix, _old, comma) => prefix + JSON.stringify(value) + comma);
}

function replaceQuestionBlock(source, questionId, updates, file) {
    const marker = `    "id": ${questionId},`;
    const markerIndex = source.indexOf(marker);
    if (markerIndex < 0) throw new Error(`question id not found: ${file}#${questionId}`);
    const start = source.lastIndexOf('  {', markerIndex);
    const closing = source.indexOf('\n  }', markerIndex);
    if (start < 0 || closing < 0) throw new Error(`question block boundary missing: ${file}#${questionId}`);
    let block = source.slice(start, closing);
    for (const [field, value] of Object.entries(updates)) block = replaceField(block, field, value);
    return source.slice(0, start) + block + source.slice(closing);
}

function applySourceFile(relativeFile, rows, subunitLabels) {
    const filePath = path.join(archiveDir, 'exams', relativeFile);
    const before = fs.readFileSync(filePath, 'utf8');
    const questions = loadQuestions(filePath);
    let after = before;
    for (const row of rows) {
        const question = questions[row.sourceOrdinal - 1];
        if (!question || question.id !== row.questionId) throw new Error(`ordinal/id mismatch: ${relativeFile}#${row.sourceOrdinal}`);
        const subUnitKey = row.proposedSubUnitKey;
        const subUnit = subunitLabels.get(subUnitKey);
        if (!subUnit) throw new Error(`subUnit not found in master: ${subUnitKey}`);
        const updates = {
            standardUnitKey: row.proposedStandardUnitKey,
            standardUnit: row.proposedStandardUnit,
            standardUnitOrder: row.proposedStandardUnitOrder,
            subUnitKey,
            subUnit,
            subUnitConfidence: 'candidate_evidence',
            subUnitClassificationDepth: 'complete_candidate'
        };
        after = replaceQuestionBlock(after, question.id, updates, relativeFile);
    }
    fs.writeFileSync(filePath, after, 'utf8');
    const validated = loadQuestions(filePath);
    return { sourceArchiveFile: relativeFile, questionCount: validated.length, updatedQuestions: rows.length, beforeDigest: sha256(before), afterDigest: sha256(after) };
}

export function promoteCandidates() {
    const adjudication = JSON.parse(fs.readFileSync(adjudicationPath, 'utf8'));
    const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
    const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const subunitLabels = new Map(master.filter(row => row.keyType === 'subUnitKey').map(row => [row.key, row.labelKo]));
    const candidateGroups = adjudication.groups.filter(group => group.adjudication === 'CANDIDATE_CONFIRMED_NONPRODUCTION');
    const rows = candidateGroups.flatMap(group => group.questionRefs.map(ref => ({ ...ref, proposedStandardUnitKey: ref.proposedStandardUnitKey || group.proposedStandardUnitKey, proposedStandardUnit: ref.proposedStandardUnit || group.proposedStandardUnit, proposedStandardUnitOrder: ref.proposedStandardUnitOrder ?? group.proposedStandardUnitOrder })));
    const byFile = new Map();
    for (const row of rows) {
        if (!byFile.has(row.sourceArchiveFile)) byFile.set(row.sourceArchiveFile, []);
        byFile.get(row.sourceArchiveFile).push(row);
    }
    const files = [];
    for (const [relativeFile, fileRows] of byFile) files.push(applySourceFile(relativeFile, fileRows, subunitLabels));
    const classificationByQuestion = new Map(classification.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
    for (const row of rows) {
        const record = classificationByQuestion.get(`${row.sourceArchiveFile}#${row.sourceOrdinal}`);
        if (!record) throw new Error(`classification record missing: ${row.sourceArchiveFile}#${row.sourceOrdinal}`);
        record.standardUnitKey = row.proposedStandardUnitKey;
        record.standardUnit = row.proposedStandardUnit;
        record.inferredStandardUnitKey = row.proposedStandardUnitKey;
        record.classification.subUnitKey = row.proposedSubUnitKey;
        record.classification.subUnit = subunitLabels.get(row.proposedSubUnitKey);
        record.classification.confidence = 'candidate_evidence';
        record.classification.classificationDepth = 'complete_candidate';
        record.classification.uncertainty = false;
        record.classification.evidence = {
            ...(record.classification.evidence || {}),
            sourceDisposition: 'CROSS_UNIT_ADJUDICATED_CANDIDATE',
            rationale: '문항별 라벨·본문·세부단원 부모를 대조한 비운영 후보 승격'
        };
    }
    const classificationStable = { ...classification };
    delete classificationStable.digest;
    classification.generatedAt = new Date().toISOString();
    classification.digest = sha256(JSON.stringify(classificationStable));
    fs.writeFileSync(classificationPath, JSON.stringify(classification, null, 2) + '\n', 'utf8');
    const stable = {
        schemaVersion: 'phase1-cross-unit-candidate-promotion-v1',
        sourceAdjudicationDigest: adjudication.digest,
        classificationDigest: classification.digest,
        productionWriteAllowed: true,
        writes: { sourceJs: true, classificationSnapshot: true, database: false, questionIndex: false, commit: false, push: false },
        totals: { sourceFiles: files.length, updatedQuestions: rows.length, holdQuestions: adjudication.totals.holdQuestions },
        gates: { candidateSetNonEmpty: rows.length > 0, questionRefsUnique: new Set(rows.map(row => row.sourceArchiveFile + '#' + row.sourceOrdinal)).size === rows.length, subUnitsInMaster: rows.every(row => subunitLabels.has(row.proposedSubUnitKey)), noDatabaseOrIndexWrites: true, commitOrPush: false },
        files
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

function main() {
    const report = promoteCandidates();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'cross-unit-candidate-promotion-v1.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log(JSON.stringify({ output: path.relative(archiveDir, path.join(outputDir, 'cross-unit-candidate-promotion-v1.json')).replace(/\\/g, '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
