import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mechanical recorder only: combine already-frozen micro-packets; no semantic inference.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const base = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const recordsOf = packet => Array.isArray(packet)
    ? packet
    : (packet.records || packet.results || (packet.sourceOrdinal !== undefined ? [packet] : []));
const identityOf = record => {
    const sourceIdentity = typeof record?.sourceIdentity === 'string'
        ? (() => {
            const split = record.sourceIdentity.lastIndexOf('#');
            return split > 0 ? { sourceArchiveFile: record.sourceIdentity.slice(0, split), sourceOrdinal: Number(record.sourceIdentity.slice(split + 1)) } : {};
        })()
        : (record?.sourceIdentity || {});
    const merged = { ...(record || {}), ...(record?.source || {}), ...(typeof sourceIdentity === 'object' ? sourceIdentity : {}) };
    let sourceArchiveFile = merged.sourceArchiveFile || merged.sourceFile || merged.source?.file || merged.file;
    let sourceOrdinal = merged.sourceOrdinal ?? merged.ordinal ?? merged.source?.ordinal;
    if (typeof sourceArchiveFile === 'string' && sourceArchiveFile.includes('#')) {
        const split = sourceArchiveFile.lastIndexOf('#');
        if (sourceOrdinal === undefined || sourceOrdinal === null || sourceOrdinal === '') sourceOrdinal = Number(sourceArchiveFile.slice(split + 1));
        sourceArchiveFile = sourceArchiveFile.slice(0, split);
    }
    if (typeof sourceArchiveFile === 'string') {
        sourceArchiveFile = sourceArchiveFile.replaceAll('\\', '/');
        const marker = sourceArchiveFile.indexOf('archive/exams/');
        if (marker >= 0) sourceArchiveFile = sourceArchiveFile.slice(marker + 'archive/exams/'.length);
        if (sourceArchiveFile.startsWith('middle/m3/')) sourceArchiveFile = `original/${sourceArchiveFile}`;
    }
    return { ...merged, sourceArchiveFile, sourceOrdinal };
};
const uid = record => {
    const identity = identityOf(record);
    return identity.sourceArchiveFile && identity.sourceOrdinal !== undefined
        ? `${identity.sourceArchiveFile}#${identity.sourceOrdinal}`
        : identity.questionUid;
};

function main() {
    const semester = String(process.argv[2] || '2H');
    const batchNo = String(process.argv[3] || '035').padStart(3, '0');
    const role = String(process.argv[4] || 'A').toUpperCase();
    const outputShard = String(process.argv[5] || '02').padStart(2, '0');
    const inputNames = process.argv.slice(6);
    if (!['A', 'B'].includes(role) || !inputNames.length) throw new Error('role and input packet names are required');
    const dir = path.join(base, semester);
    const source = read(path.join(dir, `DIRECT_${semester}_BATCH_${batchNo}.json`));
    const sourceByKey = new Map(source.records.map(record => [uid(record), record]));
    const records = inputNames.flatMap(name => {
        const packet = read(path.join(dir, name));
        const defaultSourceArchiveFile = packet?.source?.path || packet?.sourceArchiveFile || packet?.sourceFile;
        return recordsOf(packet).map(record => ({
            ...record,
            sourceArchiveFile: record.sourceArchiveFile || defaultSourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal ?? record.sourceId
        }));
    });
    const normalized = records.map(record => {
        const identity = identityOf(record);
        const expected = sourceByKey.get(`${identity.sourceArchiveFile}#${identity.sourceOrdinal}`);
        if (!expected) throw new Error(`unknown source identity ${identity.sourceArchiveFile}#${identity.sourceOrdinal}`);
        return { ...record, questionUid: expected.questionUid, sourceArchiveFile: expected.sourceArchiveFile, sourceOrdinal: expected.sourceOrdinal, sourceQuestionNo: expected.sourceQuestionNo, sourceJsSha256: expected.sourceJsSha256, sourceFingerprint: expected.sourceFingerprint, curriculumKey: expected.curriculumKey };
    });
    const ids = normalized.map(uid);
    const unique = new Set(ids);
    if (normalized.length !== 5 || unique.size !== 5) throw new Error(`micro-shard must contain exactly 5 unique records, got ${normalized.length}/${unique.size}`);
    const output = {
        schemaVersion: `m3-direct-canonical-tagging-${role === 'A' ? 'a' : 'b'}-result-v1.1`,
        status: role === 'A' ? 'A_DIRECT_TAGGED_AND_FROZEN' : 'B_INDEPENDENT_TAGGED_AND_FROZEN',
        targetGrade: 'MIDDLE3', semester, batchNo,
        sourceManifest: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/${semester}/DIRECT_${semester}_BATCH_${batchNo}.json`,
        canonicalAuthority: `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M3-${semester === '2H' ? '2' : '1'}.md`,
        recordCount: normalized.length,
        assembly: { inputMode: 'MICRO_PACKETS', inputNames, mechanicalOnly: true },
        records: normalized
    };
    fs.writeFileSync(path.join(dir, `${role}_DIRECT_${semester}_BATCH_${batchNo}_${outputShard}.json`), JSON.stringify(output, null, 2) + '\n', 'utf8');
    console.log(JSON.stringify({ semester, batchNo, role, outputShard, inputNames, records: normalized.length, unique: unique.size }, null, 2));
}

main();
