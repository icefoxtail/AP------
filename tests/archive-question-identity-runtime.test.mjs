import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const map = JSON.parse(fs.readFileSync(path.join(root, 'archive', 'data', 'question_identity_map.json'), 'utf8'));
const runtimeSource = fs.readFileSync(path.join(root, 'archive', 'question-identity.js'), 'utf8');
const context = { window: {} };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(runtimeSource, context, { filename: 'question-identity.js' });

assert.equal(context.window.questionIdentity.schemaVersion, 'question-identity-runtime-v1');
assert.equal(context.window.questionIdentity.identityDigest, map.identityDigest);
let uidResolved = 0;
let ordinalResolved = 0;
for (const record of map.records) {
    const byUid = context.window.resolveQuestionIdentityReference({ questionUid: record.questionUid });
    assert.equal(byUid.status, 'RESOLVED_CANONICAL_UID');
    assert.equal(byUid.questionUid, record.questionUid);
    uidResolved += 1;
    const byOrdinal = context.window.resolveQuestionIdentityReference({ source_archive_file: record.sourceArchiveFile, source_question_ordinal: record.sourceOrdinal });
    assert.equal(byOrdinal.status, 'RESOLVED_SOURCE_ORDINAL');
    assert.equal(byOrdinal.questionUid, record.questionUid);
    ordinalResolved += 1;
}

let ambiguous = 0;
for (const [legacyQKey, uids] of Object.entries(map.lookup.byLegacyQKey)) {
    if (uids.length < 2) continue;
    const tuple = map.lookup.byQuestionUid[uids[0]];
    const result = context.window.resolveQuestionIdentityReference({ sourceArchiveFile: tuple.sourceArchiveFile, sourceQuestionNo: tuple.sourceQuestionNo });
    assert.equal(result.status, 'AMBIGUOUS_LEGACY_REFERENCE', legacyQKey);
    assert.deepEqual([...result.candidates], uids, legacyQKey);
    ambiguous += 1;
}

console.log(JSON.stringify({ uidResolved, ordinalResolved, ambiguous, runtimeBytes: Buffer.byteLength(runtimeSource, 'utf8'), status: 'PASS' }, null, 2));
