import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Phase 0C canonical identity builder.
 *
 * Initial UID contract: qid_v1_ + SHA-256(normalized source file + "#" +
 * 1-based source ordinal). Once source arrays have been edited, use the
 * fingerprint migration tool; never regenerate ordinal UIDs over a dirty
 * source snapshot.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const dbPath = path.join(archiveDir, 'db.js');
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'inventory-latest.json');
const collisionReviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'qkey-collision-review.json');
const outputPath = path.join(archiveDir, 'data', 'question_identity_map.json');

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeSourceFile(value) {
    return String(value || '')
        .normalize('NFC')
        .replace(/\\/g, '/')
        .replace(/^exams\//, '')
        .replace(/^\.\//, '')
        .trim();
}

function makeQuestionUid(sourceFile, sourceOrdinal) {
    return `qid_v1_${sha256(`${normalizeSourceFile(sourceFile)}#${Number(sourceOrdinal)}`)}`;
}

function makeSourceFingerprint(question) {
    // Audit-only fingerprint. It must never decide questionUid.
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    }));
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

function loadDbExamFiles() {
    if (!fs.existsSync(dbPath)) return [];
    const code = fs.readFileSync(dbPath, 'utf8');
    const context = runArchiveScript(dbPath, code);
    const exams = Array.isArray(context.window.mainDB?.exams) ? context.window.mainDB.exams : [];
    return exams
        .map(exam => normalizeSourceFile(exam?.file))
        .filter(Boolean)
        .map(sourceFile => path.join(examsDir, sourceFile))
        .filter(file => fs.existsSync(file));
}

function loadTrackedExamFiles() {
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

function loadExamFiles() {
    return [...new Set([...loadTrackedExamFiles(), ...loadDbExamFiles()])]
        .sort((a, b) => a.localeCompare(b, 'en'));
}

function addArrayValue(object, key, value) {
    if (!object[key]) object[key] = [];
    object[key].push(value);
}

function sortObject(object) {
    return Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function main() {
    if (!fs.existsSync(inventoryPath)) throw new Error(`inventory missing: ${inventoryPath}`);
    if (!fs.existsSync(collisionReviewPath)) throw new Error(`collision review missing: ${collisionReviewPath}`);

    const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
    const collisionReview = JSON.parse(fs.readFileSync(collisionReviewPath, 'utf8'));
    const sourceCommit = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim();
    const dirtySourceFiles = execFileSync('git', ['-C', repoRoot, 'status', '--short', '--', 'archive/exams'], {
        maxBuffer: 16 * 1024 * 1024
    }).toString('utf8').trim();
    if (dirtySourceFiles) {
        throw new Error('archive source files are modified in the worktree; commit the snapshot or run migrate-question-identity-map-v1.mjs before rebuilding Phase 0C');
    }
    if (inventory.sourceCommit !== sourceCommit) {
        throw new Error(`inventory commit mismatch: inventory=${inventory.sourceCommit}, HEAD=${sourceCommit}; rerun Phase 0A first`);
    }
    if (collisionReview.sourceCommit !== sourceCommit || collisionReview.inventoryDigest !== inventory.digest) {
        throw new Error('collision review does not match the current Phase 0A inventory; rerun Phase 0B first');
    }

    const records = [];
    const failures = [];
    for (const fullPath of loadExamFiles()) {
        const sourceArchiveFile = normalizeSourceFile(path.relative(examsDir, fullPath));
        try {
            const code = fs.readFileSync(fullPath, 'utf8');
            const context = runArchiveScript(fullPath, code);
            const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
            if (!Array.isArray(questions)) {
                failures.push({ sourceArchiveFile, error: 'questions array not found' });
                continue;
            }
            for (let index = 0; index < questions.length; index += 1) {
                const question = questions[index];
                if (!question || typeof question !== 'object') {
                    failures.push({ sourceArchiveFile, sourceOrdinal: index + 1, error: 'non-object question slot' });
                    continue;
                }
                const sourceOrdinal = index + 1;
                const sourceQuestionNo = String(question.id ?? '');
                if (!sourceQuestionNo) {
                    failures.push({ sourceArchiveFile, sourceOrdinal, error: 'missing source question id' });
                    continue;
                }
                records.push({
                    questionUid: makeQuestionUid(sourceArchiveFile, sourceOrdinal),
                    legacyQKey: `${sourceArchiveFile}_${sourceQuestionNo}`,
                    sourceArchiveFile,
                    sourceOrdinal,
                    sourceQuestionNo,
                    sourceFingerprint: makeSourceFingerprint(question)
                });
            }
        } catch (error) {
            failures.push({ sourceArchiveFile, error: error?.message || String(error) });
        }
    }

    records.sort((a, b) => (
        a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') ||
        a.sourceOrdinal - b.sourceOrdinal
    ));

    const byQuestionUid = {};
    const byLegacyQKey = {};
    const bySourceFileAndOrdinal = {};
    const bySourceFileAndQuestionNo = {};
    const duplicateUids = [];
    for (const record of records) {
        if (byQuestionUid[record.questionUid]) duplicateUids.push(record.questionUid);
        byQuestionUid[record.questionUid] = {
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            sourceQuestionNo: record.sourceQuestionNo
        };
        addArrayValue(byLegacyQKey, record.legacyQKey, record.questionUid);
        if (!bySourceFileAndOrdinal[record.sourceArchiveFile]) bySourceFileAndOrdinal[record.sourceArchiveFile] = {};
        bySourceFileAndOrdinal[record.sourceArchiveFile][String(record.sourceOrdinal)] = record.questionUid;
        if (!bySourceFileAndQuestionNo[record.sourceArchiveFile]) bySourceFileAndQuestionNo[record.sourceArchiveFile] = {};
        addArrayValue(bySourceFileAndQuestionNo[record.sourceArchiveFile], record.sourceQuestionNo, record.questionUid);
    }

    const collisionLegacyKeys = Object.entries(byLegacyQKey)
        .filter(([, uids]) => uids.length > 1)
        .map(([legacyQKey, uids]) => ({ legacyQKey, questionUids: uids }));
    const expectedCollisionKeys = new Set(collisionReview.groups.map(group => group.legacyQKey));
    const collisionMismatch = collisionLegacyKeys.filter(item => !expectedCollisionKeys.has(item.legacyQKey));
    const missingCollisionKeys = [...expectedCollisionKeys].filter(key => !byLegacyQKey[key] || byLegacyQKey[key].length < 2);

    const stableMap = {
        schemaVersion: 'question-identity-map-v1',
        sourceCommit,
        inventoryDigest: inventory.digest,
        collisionReviewDigest: collisionReview.reviewDigest,
        identityAlgorithm: {
            version: 'qid_v1',
            expression: 'qid_v1_ + sha256(normalizeNfc(sourceArchiveFile) + "#" + sourceOrdinal)',
            sourceOrdinal: '1-based original question array position',
            contentHashPolicy: 'sourceFingerprint is audit-only and never changes questionUid'
        },
        stats: {
            examFileCount: loadExamFiles().length,
            sourceQuestionCount: records.length,
            uniqueQuestionUidCount: Object.keys(byQuestionUid).length,
            legacyQKeyCollisionGroupCount: collisionLegacyKeys.length,
            failures: failures.length,
            duplicateQuestionUidCount: duplicateUids.length,
            collisionMismatchCount: collisionMismatch.length,
            missingCollisionKeyCount: missingCollisionKeys.length
        },
        failures,
        records,
        lookup: {
            byQuestionUid: sortObject(byQuestionUid),
            byLegacyQKey: sortObject(byLegacyQKey),
            bySourceFileAndOrdinal: sortObject(bySourceFileAndOrdinal),
            bySourceFileAndQuestionNo: sortObject(bySourceFileAndQuestionNo)
        },
        collisionAudit: {
            expectedGroups: collisionReview.groupCount,
            detectedGroups: collisionLegacyKeys.length,
            collisionMismatch,
            missingCollisionKeys
        }
    };
    const identityDigest = sha256(JSON.stringify(stableMap));
    const output = {
        generatedAt: new Date().toISOString(),
        identityDigest,
        ...stableMap
    };

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

    if (
        failures.length || duplicateUids.length || collisionMismatch.length || missingCollisionKeys.length ||
        records.length !== inventory.sourceQuestionCount || Object.keys(byQuestionUid).length !== records.length
    ) {
        throw new Error('identity map generated but failed validation; inspect output before use');
    }

    console.log(JSON.stringify({
        output: path.relative(repoRoot, outputPath).replace(/\\/g, '/'),
        sourceCommit,
        identityDigest,
        sourceQuestionCount: records.length,
        uniqueQuestionUidCount: Object.keys(byQuestionUid).length,
        legacyQKeyCollisionGroupCount: collisionLegacyKeys.length,
        failures: failures.length
    }, null, 2));
}

main();
