import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json');
const outputRoot = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging');

const SEMESTER_CONFIG = {
    '2H': { units: ['M3-05', 'M3-06', 'M3-07'], label: '2학기 삼각비·원의 성질·통계' },
    '1H': { units: ['M3-01', 'M3-02', 'M3-03', 'M3-04'], label: '1학기 실수와 그 연산·다항식의 곱셈과 인수분해·이차방정식·이차함수' }
};

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function publicSourceRecord(record) {
    return {
        questionUid: record.questionUid,
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        sourceQuestionNo: record.sourceQuestionNo,
        sourceJsSha256: record.sourceJsSha256,
        sourceFingerprint: record.sourceFingerprint,
        curriculumKey: record.curriculum,
        curriculumResolution: record.curriculumResolution,
        sourceEvidence: {
            content: record.sourceFieldSnapshot.content,
            choices: record.sourceFieldSnapshot.choices,
            answer: record.sourceFieldSnapshot.answer,
            solution: record.sourceFieldSnapshot.solution,
            image: record.sourceFieldSnapshot.image,
            visualDependency: record.visualDependency,
            sharedMaterialDependency: record.sharedMaterialDependency
        }
    };
}

function main() {
    const semester = process.argv[2] || '2H';
    const config = SEMESTER_CONFIG[semester];
    if (!config) throw new Error('semester must be 2H or 1H');
    const inventory = readJson(inventoryPath);
    const records = inventory.records
        .filter(record => config.units.includes(record.currentStandardUnitKey))
        .map(publicSourceRecord);
    const batchSize = 20;
    const batchCount = Math.ceil(records.length / batchSize);
    const dir = path.join(outputRoot, semester);
    const batches = [];
    for (let index = 0; index < records.length; index += batchSize) {
        const batchNo = String(Math.floor(index / batchSize) + 1).padStart(3, '0');
        const batchRecords = records.slice(index, index + batchSize);
        const file = path.join(dir, `DIRECT_${semester}_BATCH_${batchNo}.json`);
        writeJson(file, {
            schemaVersion: 'm3-direct-canonical-tagging-source-manifest-v1',
            status: 'SOURCE_ONLY_FOR_DIRECT_AGENT_TAGGING',
            targetGrade: 'MIDDLE3',
            semester,
            scopeLabel: config.label,
            sourceInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json',
            sourceInventoryDigest: inventory.inventoryDigest,
            batchNo,
            batchSize: batchRecords.length,
            semanticFieldsExcluded: ['currentStandardUnitKey', 'currentStandardUnit', 'currentSubUnitKey', 'currentSubUnit', 'currentConceptClusterKey', 'currentProblemTypeKey', 'currentTemplateKey', 'currentLevel', 'currentDifficultyBucket', 'reviewStatus', 'existingSidecar', 'queueId', 'queueExpectedTaxonomy'],
            records: batchRecords
        });
        batches.push({ batchNo, file: path.relative(repoRoot, file).replaceAll('\\', '/'), count: batchRecords.length, questionUids: batchRecords.map(record => record.questionUid) });
    }
    writeJson(path.join(dir, `DIRECT_${semester}_INDEX.json`), {
        schemaVersion: 'm3-direct-canonical-tagging-index-v1',
        status: 'SOURCE_ONLY_FOR_DIRECT_AGENT_TAGGING',
        targetGrade: 'MIDDLE3',
        semester,
        scopeLabel: config.label,
        sourceInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json',
        sourceInventoryDigest: inventory.inventoryDigest,
        targetQueueUnits: config.units,
        directRecordCount: records.length,
        batchSize,
        batchCount,
        batches
    });
    console.log(JSON.stringify({ semester, count: records.length, batchCount, directory: path.relative(repoRoot, dir).replaceAll('\\', '/') }, null, 2));
}

main();
