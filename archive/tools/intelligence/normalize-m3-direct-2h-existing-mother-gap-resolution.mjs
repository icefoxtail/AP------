import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Adds an explicit GAP resolution wrapper to pre-existing Mother gap
// decisions. The L4 remains empty and the existing semantic/difficulty
// decision remains unchanged; this is provenance/schema normalization only.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');

function main() {
    const changed = [];
    for (let n = 1; n <= 28; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const file = path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`);
        const packet = read(file);
        let touched = false;
        for (const record of packet.records || []) {
            const d = record.finalDecision || {};
            if (d.L4Key || d.foundationDefectCandidate !== true || d.L4Resolution?.mode === 'GAP') continue;
            d.L4Resolution = {
                mode: 'GAP',
                L4Key: '',
                L4: '',
                gapReason: d.foundationDefectReason,
                sourceDerivedType: d.primaryConcept || d.primaryConceptReason || 'existing Mother source-derived gap'
            };
            d.normalizationNote = `${d.normalizationNote || ''} Explicit GAP resolution wrapper added; existing L4 gap and semantic decision preserved.`.trim();
            record.finalDecision = d;
            record.schemaNormalization = 'EXPLICIT_GAP_WRAPPER_ONLY_NO_SEMANTIC_RECLASSIFICATION';
            record.motherAdjudication = `${record.motherAdjudication || 'Existing Mother decision retained.'} Explicit GAP provenance wrapper schema-normalized.`;
            touched = true;
            changed.push(`${batchNo}#${record.sourceOrdinal}`);
        }
        if (touched) write(file, packet);
    }
    console.log(JSON.stringify({ status: 'PASS', changedCount: changed.length, changed }, null, 2));
}

main();
