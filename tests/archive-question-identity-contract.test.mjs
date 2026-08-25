import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createQuestionIdentityResolver } from '../archive/tools/intelligence/question-identity-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const map = JSON.parse(fs.readFileSync(path.join(root, 'archive', 'data', 'question_identity_map.json'), 'utf8'));
const collisionReviewPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase0', 'qkey-collision-review.json');
const collisionReview = fs.existsSync(collisionReviewPath)
    ? JSON.parse(fs.readFileSync(collisionReviewPath, 'utf8'))
    : { groupCount: 0 };
const resolver = createQuestionIdentityResolver(map);

let canonicalResolved = 0;
let ordinalResolved = 0;
for (const record of map.records) {
    const byUid = resolver.resolve({ questionUid: record.questionUid });
    assert.equal(byUid.status, 'RESOLVED_CANONICAL_UID');
    assert.equal(byUid.questionUid, record.questionUid);
    assert.equal(byUid.sourceArchiveFile, record.sourceArchiveFile);
    assert.equal(byUid.sourceOrdinal, record.sourceOrdinal);
    canonicalResolved += 1;

    const byOrdinal = resolver.resolve({
        source_archive_file: record.sourceArchiveFile,
        source_question_ordinal: record.sourceOrdinal
    });
    assert.equal(byOrdinal.status, 'RESOLVED_SOURCE_ORDINAL');
    assert.equal(byOrdinal.questionUid, record.questionUid);
    ordinalResolved += 1;
}

let legacyUnambiguous = 0;
let legacyAmbiguous = 0;
for (const [legacyQKey, candidates] of Object.entries(map.lookup.byLegacyQKey)) {
    const first = map.lookup.byQuestionUid[candidates[0]];
    const result = resolver.resolve({
        sourceArchiveFile: first.sourceArchiveFile,
        sourceQuestionNo: first.sourceQuestionNo
    });
    if (candidates.length === 1) {
        assert.equal(result.status, 'RESOLVED_LEGACY_UNAMBIGUOUS');
        assert.equal(result.questionUid, candidates[0]);
        legacyUnambiguous += 1;
    } else {
        assert.equal(result.status, 'AMBIGUOUS_LEGACY_REFERENCE');
        assert.deepEqual(result.candidates, candidates, legacyQKey);
        legacyAmbiguous += 1;
    }
}

assert.equal(legacyAmbiguous, collisionReview.groupCount);
assert.equal(canonicalResolved, map.records.length);
assert.equal(ordinalResolved, map.records.length);
assert.equal(resolver.resolve({ sourceArchiveFile: 'missing.js', sourceQuestionNo: 1 }).status, 'UNKNOWN_LEGACY_REFERENCE');
assert.equal(resolver.resolve({}).status, 'INSUFFICIENT_IDENTITY_REFERENCE');

console.log(JSON.stringify({
    recordCount: map.records.length,
    canonicalResolved,
    ordinalResolved,
    legacyUnambiguous,
    legacyAmbiguous,
    status: 'PASS'
}, null, 2));
