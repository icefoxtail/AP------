import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Normalize only stale identity/provenance wrappers in pre-existing 001-028
// Mother Final artifacts. Semantic finalDecision fields are never changed.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const recordsOf = packet => Array.isArray(packet) ? packet : (packet?.records || packet?.results || []);
const identityKey = record => `${record?.sourceArchiveFile || ''}#${record?.sourceOrdinal ?? ''}`;

function main() {
    const changed = [];
    for (let n = 1; n <= 28; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const source = read(path.join(dir, `DIRECT_2H_BATCH_${batchNo}.json`));
        const packetPath = path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`);
        const packet = read(packetPath);
        const sourceByKey = new Map(recordsOf(source).map(record => [identityKey(record), record]));
        let touched = false;
        for (const record of packet.records || []) {
            const sourceRecord = sourceByKey.get(identityKey(record));
            if (!sourceRecord) throw new Error(`existing Mother source tuple missing ${batchNo}#${record.sourceOrdinal}`);
            if (record.sourceFingerprint && record.sourceFingerprint !== sourceRecord.sourceFingerprint) throw new Error(`existing Mother source fingerprint mismatch ${batchNo}#${record.sourceOrdinal}`);
            const changes = [];
            if (record.questionUid !== sourceRecord.questionUid) {
                record.questionUid = sourceRecord.questionUid;
                changes.push('questionUid rebound from source tuple');
            }
            if (!record.sourceFingerprint) {
                record.sourceFingerprint = sourceRecord.sourceFingerprint;
                changes.push('sourceFingerprint bound from source tuple');
            }
            if (!record.motherAdjudication || typeof record.motherAdjudication !== 'string') {
                record.motherAdjudication = 'Existing Mother semantic decision retained; provenance wrapper schema-normalized without semantic reclassification.';
                changes.push('motherAdjudication wrapper added');
            }
            if (changes.length) {
                record.schemaNormalization = 'IDENTITY_AND_PROVENANCE_WRAPPER_ONLY_NO_SEMANTIC_RECLASSIFICATION';
                record.normalizationNote = `${changes.join('; ')}.`;
                touched = true;
                changed.push(`${batchNo}#${record.sourceOrdinal}`);
            }
        }
        if (touched) write(packetPath, packet);
    }
    console.log(JSON.stringify({ status: 'PASS', changedCount: changed.length, changed }, null, 2));
}

main();
