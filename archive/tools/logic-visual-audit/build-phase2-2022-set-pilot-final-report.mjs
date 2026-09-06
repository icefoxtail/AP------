import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nativeFinal } from '../pipeline-core/native-final.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'archive/tools/logic-visual-audit/reports/phase2_2022_set_pilot_inventory.json'), 'utf8'));
// No filename-final selection, fixed totals, or render->semantic inference.
nativeFinal(root, 'logic-visual', inventory.rows.map(row => ({ sourcePath: row.sourceJsPath, qid: row.qid })));
