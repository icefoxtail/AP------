import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Final parent-key repair for two legacy records. The selected L4 and all
// semantic evidence remain unchanged; only inconsistent parent keys are
// rebound to the parent encoded by the existing canonical L4 key.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const repairs = new Map([
    ['007#19', { L2Key: 'L2-3.2', L2: '상관관계' }],
    ['027#2', { L3Key: 'L3-1.1.1', L3: '삼각비의 뜻' }]
]);

function main() {
    const changed = [];
    for (const [target, fields] of repairs) {
        const [batchNo, ordinalText] = target.split('#');
        const file = path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`);
        const packet = read(file);
        const record = packet.records.find(item => String(item.sourceOrdinal) === ordinalText);
        if (!record) throw new Error(`legacy Mother record missing ${target}`);
        const d = record.finalDecision || {};
        if (!d.L4Key) throw new Error(`legacy Mother record has no L4 for key repair ${target}`);
        Object.assign(d, fields);
        d.normalizationNote = `${d.normalizationNote || ''} Parent key rebound to the existing L4 hierarchy only; no L4, difficulty, or semantic decision change.`.trim();
        record.finalDecision = d;
        record.schemaNormalization = 'PARENT_KEY_REBOUND_TO_EXISTING_L4_ONLY_NO_SEMANTIC_RECLASSIFICATION';
        record.motherAdjudication = `${record.motherAdjudication || 'Existing Mother decision retained.'} Parent key schema-normalized to existing L4 hierarchy.`;
        write(file, packet);
        changed.push(target);
    }
    console.log(JSON.stringify({ status: 'PASS', changed }, null, 2));
}

main();
