import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Build the source-only identity manifest for the H2 Mathematics II direct
 * canonical-tagging job.
 *
 * This script is intentionally limited to inventory, identity binding, and
 * source immutability evidence. It does not classify questions and never
 * rewrites production JS, the database, or the question index.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const sourceRoot = path.join(archiveDir, 'exams', 'original', 'high', 'h2');
const canonicalPath = path.join(repoRoot, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
const compiledMasterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const ruleManifestPath = path.join(repoRoot, 'docs/rules/MANIFEST.md');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging');
const outputPath = path.join(outputDir, 'source_manifest.json');
const worklistDir = path.join(outputDir, 'worklists');
const WORKLIST_SIZE = 20;

const TARGET_GRADE = '고2';
const CURRICULUM_SCOPE = '수학II';
const CURRICULUM_KEY = '2015';
const SEMANTIC_DECISION_FIELDS_EXCLUDED = [
    'level',
    'category',
    'originalCategory',
    'standardCourse',
    'standardUnitKey',
    'standardUnit',
    'standardUnitOrder',
    'subUnitKey',
    'subUnit',
    'subUnitConfidence',
    'subUnitClassificationDepth',
    'conceptClusterKey',
    'problemTypeKey',
    'templateKey',
    'tags',
    'difficultyBucket',
    'tagConfidence',
    'tagStatus',
    'metadataRevision',
    'previousReview',
    'classifierResult',
    'queueCandidateContext'
];

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function digestJson(value) {
    return sha256(JSON.stringify(value));
}

function normalizeFile(file) {
    return path.relative(path.join(archiveDir, 'exams'), file).split(path.sep).join('/');
}

function git(args) {
    return execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' }).trim();
}

function readQuestionBank(file) {
    const source = fs.readFileSync(file, 'utf8');
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(source, context, { filename: file, timeout: 3000 });
    const questions = context.window.questionBank || context.window.questions;
    if (!Array.isArray(questions)) throw new Error(`QUESTION_BANK_MISSING:${normalizeFile(file)}`);
    return questions;
}

function sourceFingerprint(question) {
    return digestJson({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null,
        solutionImage: question?.solutionImage ?? null
    });
}

function contentFingerprint(question) {
    return digestJson({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        image: question?.image ?? null
    });
}

function collectSourceFiles() {
    const files = [];
    const visit = directory => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) visit(fullPath);
            else if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
        }
    };
    visit(sourceRoot);
    return files.sort((a, b) => normalizeFile(a).localeCompare(normalizeFile(b), 'ko'));
}

function buildManifest() {
    if (!fs.existsSync(canonicalPath)) throw new Error('CANONICAL_AUTHORITY_MISSING');
    if (!fs.existsSync(compiledMasterPath)) throw new Error('COMPILED_MASTER_MISSING');

    const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
    if (canonical.authorityStatus !== 'LOCKED') throw new Error('CANONICAL_NOT_LOCKED');

    const sourceFiles = collectSourceFiles();
    const records = [];
    const includedFiles = new Map();
    const loadFailures = [];

    for (const fullPath of sourceFiles) {
        const sourceArchiveFile = normalizeFile(fullPath);
        const sourceFileSha256 = sha256(fs.readFileSync(fullPath));
        let questions;
        try {
            questions = readQuestionBank(fullPath);
        } catch (error) {
            loadFailures.push({ sourceArchiveFile, error: String(error?.message || error) });
            continue;
        }

        questions.forEach((question, index) => {
            if (String(question?.standardCourse ?? '') !== CURRICULUM_SCOPE) return;
            const sourceOrdinal = index + 1;
            const stableKey = `${sourceArchiveFile}#${sourceOrdinal}`;
            const stableUid = `h2-math2-direct-${sha256(stableKey).slice(0, 32)}`;
            const record = {
                stableUid,
                sourceArchiveFile,
                sourceOrdinal,
                sourceQuestionNo: String(question?.id ?? sourceOrdinal),
                curriculumKey: CURRICULUM_KEY,
                sourceFileSha256,
                content: question?.content ?? '',
                choices: Array.isArray(question?.choices) ? question.choices : [],
                answer: question?.answer ?? null,
                solution: question?.solution ?? '',
                image: question?.image ?? '',
                solutionImage: question?.solutionImage ?? '',
                sourceFingerprint: sourceFingerprint(question),
                contentFingerprint: contentFingerprint(question)
            };
            records.push(record);
            if (!includedFiles.has(sourceArchiveFile)) includedFiles.set(sourceArchiveFile, { sourceArchiveFile, sourceFileSha256, questionCount: 0 });
            includedFiles.get(sourceArchiveFile).questionCount += 1;
        });
    }

    const identityKeys = records.map(record => `${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    const uniqueIdentityKeys = new Set(identityKeys);
    const stableUids = new Set(records.map(record => record.stableUid));
    if (uniqueIdentityKeys.size !== records.length) throw new Error(`IDENTITY_DUPLICATE:${records.length - uniqueIdentityKeys.size}`);
    if (stableUids.size !== records.length) throw new Error(`STABLE_UID_DUPLICATE:${records.length - stableUids.size}`);
    if (loadFailures.length) throw new Error(`SOURCE_LOAD_FAILURES:${loadFailures.length}`);

    records.sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'ko') || a.sourceOrdinal - b.sourceOrdinal);
    const cohortCounts = { [CURRICULUM_KEY]: records.length };
    const fileRecords = [...includedFiles.values()].sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'ko'));
    const sourceFileSha256 = sha256(JSON.stringify(fileRecords));
    const canonicalBytes = fs.readFileSync(canonicalPath);
    const compiledMasterBytes = fs.readFileSync(compiledMasterPath);
    const manifest = {
        schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-source-manifest-v1',
        sourceOnly: true,
        productionWriteAllowed: false,
        targetGrade: TARGET_GRADE,
        curriculumScope: CURRICULUM_SCOPE,
        curriculumKey: CURRICULUM_KEY,
        targetBranch: git(['branch', '--show-current']),
        startSha: git(['rev-parse', 'HEAD']),
        originMainSha: git(['rev-parse', 'origin/main']),
        startShaMatchesOriginMain: git(['rev-parse', 'HEAD']) === git(['rev-parse', 'origin/main']),
        sourceRoot: 'archive/exams/original/high/h2',
        assetRoot: 'archive/assets/images',
        canonicalAuthority: {
            path: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
            sha256: sha256(canonicalBytes),
            authorityStatus: canonical.authorityStatus,
            authorityVersion: canonical.authorityVersion
        },
        compiledMaster: {
            path: 'archive/data/master_tables/js_archive_tag_master.json',
            sha256: sha256(compiledMasterBytes)
        },
        ruleManifest: {
            path: 'docs/rules/MANIFEST.md',
            sha256: sha256(fs.readFileSync(ruleManifestPath))
        },
        semanticDecisionFieldsExcluded: SEMANTIC_DECISION_FIELDS_EXCLUDED,
        inventoryMethod: "Load every JS under sourceRoot, then include only questions whose source standardCourse is exactly 수학II. Existing semantic metadata is excluded from direct-tagging inputs.",
        actualDenominator: records.length,
        expectedDenominator: records.length,
        sourceFileCount: fileRecords.length,
        uniqueSourceKeys: uniqueIdentityKeys.size,
        uniqueStableUids: stableUids.size,
        sourceFileManifestSha256: sourceFileSha256,
        cohortCounts,
        sourceFiles: fileRecords,
        records
    };
    manifest.manifestSha256 = digestJson(manifest);
    return manifest;
}

function writeWorklists(manifest) {
    fs.mkdirSync(worklistDir, { recursive: true });
    const batches = [];
    for (let offset = 0; offset < manifest.records.length; offset += WORKLIST_SIZE) {
        const records = manifest.records.slice(offset, offset + WORKLIST_SIZE).map(record => ({
            stableUid: record.stableUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            sourceQuestionNo: record.sourceQuestionNo,
            curriculumKey: record.curriculumKey,
            sourceFileSha256: record.sourceFileSha256,
            sourceFingerprint: record.sourceFingerprint,
            contentFingerprint: record.contentFingerprint
        }));
        const batchNumber = Math.floor(offset / WORKLIST_SIZE) + 1;
        const batchId = `batch-${String(batchNumber).padStart(3, '0')}`;
        const worklist = {
            schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-worklist-v1',
            targetGrade: manifest.targetGrade,
            curriculumScope: manifest.curriculumScope,
            curriculumKey: manifest.curriculumKey,
            sourceManifestPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/source_manifest.json',
            sourceManifestSha256: manifest.manifestSha256,
            batchId,
            recordIndexStart: offset + 1,
            recordIndexEnd: offset + records.length,
            recordCount: records.length,
            priorReviewVisibility: 'NONE',
            productionWriteAllowed: false,
            records
        };
        const file = path.join(worklistDir, `${batchId}.json`);
        fs.writeFileSync(file, `${JSON.stringify(worklist, null, 2)}\n`, 'utf8');
        batches.push({ batchId, path: path.relative(repoRoot, file).split(path.sep).join('/'), recordIndexStart: worklist.recordIndexStart, recordIndexEnd: worklist.recordIndexEnd, recordCount: records.length });
    }
    const summary = {
        schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-worklist-summary-v1',
        targetGrade: manifest.targetGrade,
        curriculumScope: manifest.curriculumScope,
        sourceManifestPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/source_manifest.json',
        sourceManifestSha256: manifest.manifestSha256,
        totalRecords: manifest.records.length,
        worklistSize: WORKLIST_SIZE,
        batchCount: batches.length,
        batches,
        aStatus: 'NOT_STARTED',
        bStatus: 'NOT_STARTED',
        motherStatus: 'NOT_STARTED',
        productionWriteAllowed: false
    };
    fs.writeFileSync(path.join(outputDir, 'worklist_summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    return summary;
}

function main() {
    const manifest = buildManifest();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    const worklists = writeWorklists(manifest);
    console.log(JSON.stringify({
        output: path.relative(repoRoot, outputPath).split(path.sep).join('/'),
        targetBranch: manifest.targetBranch,
        startSha: manifest.startSha,
        originMainSha: manifest.originMainSha,
        startShaMatchesOriginMain: manifest.startShaMatchesOriginMain,
        sourceFileCount: manifest.sourceFileCount,
        actualDenominator: manifest.actualDenominator,
        worklistSize: worklists.worklistSize,
        batchCount: worklists.batchCount,
        uniqueSourceKeys: manifest.uniqueSourceKeys,
        sourceOnly: manifest.sourceOnly,
        productionWriteAllowed: manifest.productionWriteAllowed,
        manifestSha256: manifest.manifestSha256
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
