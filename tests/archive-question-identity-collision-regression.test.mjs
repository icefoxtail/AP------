import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createQuestionIdentityResolver } from '../archive/tools/intelligence/question-identity-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archiveDir = path.join(root, 'archive');
const map = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'question_identity_map.json'), 'utf8'));
const reviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'qkey-collision-review.json');
const review = fs.existsSync(reviewPath)
    ? JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
    : { groups: [], groupCount: 0, recordCount: 0 };
const resolver = createQuestionIdentityResolver(map);

function sourceFingerprint(question) {
    return crypto.createHash('sha256').update(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    })).digest('hex');
}

function loadQuestions(sourceFile) {
    const fullPath = path.join(archiveDir, 'exams', sourceFile);
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath });
    const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
    assert(Array.isArray(questions), `${sourceFile} must expose its source question array`);
    return questions;
}

const questionsByFile = new Map();
let verifiedRecords = 0;
for (const group of review.groups) {
    assert.equal(group.resolution, 'canonical_uid_only', group.legacyQKey);
    assert.equal(group.records.length, 2, group.legacyQKey);
    const mapUids = map.lookup.byLegacyQKey[group.legacyQKey];
    assert.equal(mapUids.length, 2, group.legacyQKey);

    const fingerprints = new Set();
    for (const collisionRecord of group.records) {
        const questions = questionsByFile.get(collisionRecord.sourceFile) || loadQuestions(collisionRecord.sourceFile);
        questionsByFile.set(collisionRecord.sourceFile, questions);
        const question = questions[collisionRecord.sourceOrdinal - 1];
        assert(question, `${group.legacyQKey} ordinal ${collisionRecord.sourceOrdinal} must exist`);
        assert.equal(String(question.id), collisionRecord.questionId, `${group.legacyQKey} must preserve legacy id`);
        assert.equal(sourceFingerprint(question), collisionRecord.fingerprint, `${group.legacyQKey} must restore the exact source slot`);

        const resolved = resolver.resolve({
            sourceArchiveFile: collisionRecord.sourceFile,
            sourceOrdinal: collisionRecord.sourceOrdinal
        });
        assert.equal(resolved.status, 'RESOLVED_SOURCE_ORDINAL');
        assert.equal(resolved.sourceOrdinal, collisionRecord.sourceOrdinal);
        assert.equal(resolved.sourceQuestionNo, collisionRecord.questionId);
        assert(mapUids.includes(resolved.questionUid), `${group.legacyQKey} UID must belong to its collision group`);
        fingerprints.add(collisionRecord.fingerprint);
        verifiedRecords += 1;
    }
    assert.equal(fingerprints.size, 2, `${group.legacyQKey} colliding source slots must remain distinguishable`);

    const ambiguous = resolver.resolve({
        sourceArchiveFile: group.sourceFile,
        sourceQuestionNo: group.records[0].questionId
    });
    assert.equal(ambiguous.status, 'AMBIGUOUS_LEGACY_REFERENCE', group.legacyQKey);
}

assert.equal(verifiedRecords, review.recordCount);
console.log(JSON.stringify({
    collisionGroups: review.groupCount,
    collisionRecords: verifiedRecords,
    sourceFilesLoaded: questionsByFile.size,
    status: 'PASS'
}, null, 2));
