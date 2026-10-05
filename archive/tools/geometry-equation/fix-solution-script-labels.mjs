import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const filePath = fileURLToPath(new URL('./repair-solutions-from-a.mjs', import.meta.url));
const before = fs.readFileSync(filePath, 'utf8');
const after = before.replaceAll("$A'", '$A_1').replaceAll("$B'", '$B_1').replaceAll("$l'", '$l_1');
if (after === before) throw new Error('No prime labels found in repair script');
fs.writeFileSync(filePath, after, 'utf8');
console.log(JSON.stringify({ status: 'REPAIR_SCRIPT_LABELS_FIXED', changed: true }, null, 2));
