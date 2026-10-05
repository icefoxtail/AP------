import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mechanical recorder only: assemble one frozen role packet from a full packet or shards.
// It performs no taxonomy, difficulty, HOLD, or semantic inference.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const base = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const recordsOf = packet => Array.isArray(packet) ? packet : (packet.records || packet.results || []);

const identityOf = record => {
    const sourceIdentity = typeof record?.sourceIdentity === 'string'
        ? (() => {
            const split = record.sourceIdentity.lastIndexOf('#');
            return split > 0 ? { sourceArchiveFile: record.sourceIdentity.slice(0, split), sourceOrdinal: Number(record.sourceIdentity.slice(split + 1)) } : {};
        })()
        : (record?.sourceIdentity || {});
    const merged = { ...(record || {}), ...(record?.source || {}), ...(typeof sourceIdentity === 'object' ? sourceIdentity : {}) };
    let sourceArchiveFile = merged.sourceArchiveFile || merged.sourceFile || merged.sourceArchiveFileOrdinal || merged.source?.file || merged.file;
    let sourceOrdinal = merged.sourceOrdinal ?? merged.ordinal ?? merged.source?.ordinal;
    const sourceIndex = merged.sourceIndex ?? merged.index ?? merged.targetIndex ?? merged.recordIndex;
    if (typeof sourceArchiveFile === 'string' && sourceArchiveFile.includes('#')) {
        const split = sourceArchiveFile.lastIndexOf('#');
        if (sourceOrdinal === undefined || sourceOrdinal === null || sourceOrdinal === '') sourceOrdinal = Number(sourceArchiveFile.slice(split + 1));
        sourceArchiveFile = sourceArchiveFile.slice(0, split);
    }
    if (typeof sourceArchiveFile === 'string') {
        sourceArchiveFile = sourceArchiveFile.replaceAll('\\', '/');
        const archiveMarker = sourceArchiveFile.indexOf('archive/exams/');
        if (archiveMarker >= 0) sourceArchiveFile = sourceArchiveFile.slice(archiveMarker + 'archive/exams/'.length);
    }
    return { ...merged, sourceArchiveFile, sourceOrdinal, sourceIndex };
};

const uid = record => {
    const identity = identityOf(record);
    return identity.sourceArchiveFile && identity.sourceOrdinal !== undefined
        ? `${identity.sourceArchiveFile}#${identity.sourceOrdinal}`
        : identity.questionUid;
};

const normalizeIdentity = (record, sourceByKey, sourceByIndex) => {
    const identity = identityOf(record);
    const sourceKey = identity.sourceArchiveFile && identity.sourceOrdinal !== undefined
        ? `${identity.sourceArchiveFile}#${identity.sourceOrdinal}`
        : '';
    const expected = sourceByKey.get(sourceKey) || (identity.sourceIndex !== undefined ? sourceByIndex.get(Number(identity.sourceIndex)) : undefined);
    if (!expected) throw new Error(`unknown source identity ${sourceKey || identity.questionUid || 'missing'}`);
    return {
        ...record,
        questionUid: expected.questionUid,
        sourceArchiveFile: expected.sourceArchiveFile,
        sourceOrdinal: expected.sourceOrdinal,
        sourceQuestionNo: expected.sourceQuestionNo,
        sourceJsSha256: expected.sourceJsSha256,
        sourceFingerprint: expected.sourceFingerprint,
        curriculumKey: expected.curriculumKey
    };
};

function main() {
    const semester = String(process.argv[2] || '2H');
    const batchNo = String(process.argv[3] || '001').padStart(3, '0');
    const role = String(process.argv[4] || 'A').toUpperCase();
    const shardCount = Number(process.argv[5] || 4);
    const forceShards = process.argv[6] === '--force-shards';
    if (!['A', 'B'].includes(role)) throw new Error(`role must be A or B, got ${role}`);
    const dir = path.join(base, semester);
    const source = read(path.join(dir, `DIRECT_${semester}_BATCH_${batchNo}.json`));
    const sourceByKey = new Map(source.records.map(record => [uid(record), record]));
    const sourceByIndex = new Map(source.records.map((record, index) => [index, record]));
    const sourceOrder = new Map(source.records.map((record, index) => [uid(record), index]));
    const fullPath = path.join(dir, `${role}_DIRECT_${semester}_BATCH_${batchNo}.json`);
    let records = [];
    let inputMode = 'FULL_PACKET';
    if (fs.existsSync(fullPath) && !forceShards) {
        records = recordsOf(read(fullPath));
    } else {
        inputMode = 'SHARDS';
        for (let index = 1; index <= shardCount; index += 1) {
            const suffix = String(index).padStart(2, '0');
            const shardPath = path.join(dir, `${role}_DIRECT_${semester}_BATCH_${batchNo}_${suffix}.json`);
            if (!fs.existsSync(shardPath)) throw new Error(`missing ${role} shard ${shardPath}`);
            records.push(...recordsOf(read(shardPath)));
        }
    }
    const normalized = records.map(record => normalizeIdentity(record, sourceByKey, sourceByIndex));
    normalized.sort((left, right) => (sourceOrder.get(uid(left)) ?? 9999) - (sourceOrder.get(uid(right)) ?? 9999));
    const ids = normalized.map(uid);
    const unique = new Set(ids);
    const expectedIds = new Set(source.records.map(uid));
    if (normalized.length !== source.records.length || unique.size !== normalized.length) throw new Error(`${role} count or uniqueness failure: ${normalized.length}/${source.records.length}, unique ${unique.size}`);
    if ([...expectedIds].some(value => !unique.has(value))) throw new Error(`${role} source identity coverage failure`);
    const output = {
        schemaVersion: `m3-direct-canonical-tagging-${role === 'A' ? 'a' : 'b'}-result-v1.1`,
        status: role === 'A' ? 'A_DIRECT_TAGGED_AND_FROZEN' : 'B_INDEPENDENT_TAGGED_AND_FROZEN',
        targetGrade: 'MIDDLE3',
        semester,
        batchNo,
        sourceManifest: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/${semester}/DIRECT_${semester}_BATCH_${batchNo}.json`,
        canonicalAuthority: `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M3-${semester === '2H' ? '2' : '1'}.md`,
        recordCount: normalized.length,
        assembly: { inputMode, shardCount, mechanicalOnly: true },
        records: normalized
    };
    fs.writeFileSync(fullPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
    console.log(JSON.stringify({ semester, batchNo, role, inputMode, source: source.records.length, records: normalized.length, unique: unique.size }, null, 2));
}

main();
