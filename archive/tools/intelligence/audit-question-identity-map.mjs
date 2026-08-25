import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const mapPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'inventory-latest.json');
const collisionReviewPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'qkey-collision-review.json');

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeSourceFile(value) {
    return String(value || '').normalize('NFC').replace(/\\/g, '/').replace(/^exams\//, '').replace(/^\.\//, '').trim();
}

function ordinalUid(record) {
    return `qid_v1_${sha256(`${normalizeSourceFile(record.sourceArchiveFile)}#${Number(record.sourceOrdinal)}`)}`;
}

function contentUid(record) {
    return `qid_v1_${sha256(`${normalizeSourceFile(record.sourceArchiveFile)}#content:${record.contentFingerprint}`)}`;
}

function fail(errors, message) {
    if (errors.length < 25) errors.push(message);
}

if (!fs.existsSync(mapPath)) throw new Error(`identity map missing: ${mapPath}`);
if (!fs.existsSync(inventoryPath)) throw new Error(`inventory missing: ${inventoryPath}`);
if (!fs.existsSync(collisionReviewPath)) throw new Error(`collision review missing: ${collisionReviewPath}`);

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const collisionReview = JSON.parse(fs.readFileSync(collisionReviewPath, 'utf8'));
const errors = [];
const uidSet = new Set();

if (map.schemaVersion !== 'question-identity-map-v1') fail(errors, 'unexpected schemaVersion');
if (!Array.isArray(map.records)) fail(errors, 'records is not an array');
const migrated = map.uidMigration?.schemaVersion === 'question-identity-uid-migration-v1';
if (!migrated && map.sourceCommit !== inventory.sourceCommit) fail(errors, 'map/inventory source commit mismatch');
if (!migrated && map.inventoryDigest !== inventory.digest) fail(errors, 'map/inventory digest mismatch');
if (map.collisionReviewDigest !== collisionReview.reviewDigest) fail(errors, 'map/collision review digest mismatch');
if (map.records.length !== inventory.sourceQuestionCount) fail(errors, `record count ${map.records.length} !== inventory ${inventory.sourceQuestionCount}`);

const migrationByUid = new Map((map.uidMigration?.records || []).map(record => [record.questionUid, record]));

for (const record of map.records || []) {
    if (!/^qid_v1_[0-9a-f]{64}$/.test(record.questionUid || '')) fail(errors, `malformed UID: ${record.questionUid}`);
    if (migrated) {
        const migration = migrationByUid.get(record.questionUid);
        if (!migration) fail(errors, `migration record missing: ${record.questionUid}`);
        else if (migration.match === 'new_content_uid' && record.questionUid !== contentUid(record)) fail(errors, `new content UID mismatch: ${record.questionUid}`);
    } else if (record.questionUid !== ordinalUid(record)) {
        fail(errors, `UID contract mismatch: ${record.questionUid}`);
    }
    if (!/^[0-9a-f]{64}$/.test(record.sourceFingerprint || '')) fail(errors, `malformed source fingerprint: ${record.questionUid}`);
    if (uidSet.has(record.questionUid)) fail(errors, `duplicate UID: ${record.questionUid}`);
    uidSet.add(record.questionUid);

    const ordinalLookup = map.lookup?.bySourceFileAndOrdinal?.[record.sourceArchiveFile]?.[String(record.sourceOrdinal)];
    if (ordinalLookup !== record.questionUid) fail(errors, `ordinal lookup mismatch: ${record.questionUid}`);
    const legacyLookup = map.lookup?.byLegacyQKey?.[record.legacyQKey] || [];
    if (!legacyLookup.includes(record.questionUid)) fail(errors, `legacy lookup missing: ${record.questionUid}`);
    const noLookup = map.lookup?.bySourceFileAndQuestionNo?.[record.sourceArchiveFile]?.[String(record.sourceQuestionNo)] || [];
    if (!noLookup.includes(record.questionUid)) fail(errors, `question no lookup missing: ${record.questionUid}`);
}

for (const group of collisionReview.groups || []) {
    const uids = map.lookup?.byLegacyQKey?.[group.legacyQKey] || [];
    if (uids.length !== group.records.length) fail(errors, `collision group cardinality mismatch: ${group.legacyQKey}`);
    if (new Set(uids).size !== uids.length) fail(errors, `collision group has duplicate UID: ${group.legacyQKey}`);
}

const result = {
    map: path.relative(path.resolve(archiveDir, '..'), mapPath).replace(/\\/g, '/'),
    sourceCommit: map.sourceCommit,
    identityDigest: map.identityDigest,
    recordCount: map.records.length,
    uniqueQuestionUidCount: uidSet.size,
    collisionGroupCount: collisionReview.groupCount,
    errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
