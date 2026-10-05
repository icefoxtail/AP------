import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mechanical recorder only: concatenate frozen shards and preserve source order.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const base = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
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
    const sourceIndex = merged.sourceIndex ?? merged.index ?? merged.targetIndex;
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
    const shardCount = Number(process.argv[4] || 4);
    const dir = path.join(base, semester);
    const source = read(path.join(dir, `DIRECT_${semester}_BATCH_${batchNo}.json`));
    const sourceByKey = new Map(source.records.map(record => [uid(record), record]));
    const sourceByIndex = new Map(source.records.map((record, index) => [index, record]));
    const sourceOrder = new Map(source.records.map((record, index) => [uid(record), index]));
    const a = [];
    const b = [];
    for (let index = 1; index <= shardCount; index += 1) {
        const suffix = String(index).padStart(2, '0');
        const aPacket = read(path.join(dir, `A_DIRECT_${semester}_BATCH_${batchNo}_${suffix}.json`));
        const aRecords = Array.isArray(aPacket) ? aPacket : (aPacket.records || []);
        a.push(...aRecords.map(record => normalizeIdentity(record, sourceByKey, sourceByIndex)));
        const packet = read(path.join(dir, `B_DIRECT_${semester}_BATCH_${batchNo}_${suffix}.json`));
        const packetRecords = Array.isArray(packet) ? packet : (packet.results || packet.records || []);
        b.push(...packetRecords.map(record => normalizeIdentity(record, sourceByKey, sourceByIndex)));
    }
    const sort = records => records.sort((left, right) => (sourceOrder.get(uid(left)) ?? 9999) - (sourceOrder.get(uid(right)) ?? 9999));
    const sortedA = sort(a);
    const sortedB = sort(b);
    const sourceUids = new Set(source.records.map(uid));
    const aUids = new Set(sortedA.map(uid));
    const bUids = new Set(sortedB.map(uid));
    if (sortedA.length !== source.records.length || sortedB.length !== source.records.length || aUids.size !== sortedA.length || bUids.size !== sortedB.length) throw new Error('shard count or uniqueness failure');
    if ([...sourceUids].some(value => !aUids.has(value) || !bUids.has(value))) throw new Error('shard identity coverage failure');
    fs.writeFileSync(path.join(dir, `A_DIRECT_${semester}_BATCH_${batchNo}.json`), JSON.stringify({ schemaVersion: 'm3-direct-canonical-tagging-a-result-v1', status: 'A_DIRECT_TAGGED', targetGrade: 'MIDDLE3', semester, batchNo, sourceManifest: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/${semester}/DIRECT_${semester}_BATCH_${batchNo}.json`, canonicalAuthority: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M3-2.md', recordCount: sortedA.length, records: sortedA }, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dir, `B_DIRECT_${semester}_BATCH_${batchNo}.json`), JSON.stringify({ schemaVersion: 'm3-direct-canonical-tagging-b-result-v1', status: 'B_INDEPENDENT_TAGGED_AND_FROZEN', targetGrade: 'MIDDLE3', semester, batchNo, sourceManifest: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/${semester}/DIRECT_${semester}_BATCH_${batchNo}.json`, canonicalAuthority: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M3-2.md', recordCount: sortedB.length, results: sortedB }, null, 2) + '\n', 'utf8');
    console.log(JSON.stringify({ semester, batchNo, shardCount, source: source.records.length, A: sortedA.length, AUnique: aUids.size, B: sortedB.length, BUnique: bUids.size }, null, 2));
}

main();
