import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const filePath = fileURLToPath(new URL('./repair-third-a-q10.mjs', import.meta.url));
const before = fs.readFileSync(filePath, 'utf8');
const typo = "') }).replaceAll";
const at = before.indexOf(typo);
if (at < 0) throw new Error('Expected String.raw closing typo not found');
const after = before.slice(0, at) + "'] }).replaceAll" + before.slice(at + typo.length);
fs.writeFileSync(filePath, after, 'utf8');
console.log(JSON.stringify({ status: 'REPAIR_THIRD_SCRIPT_SYNTAX_FIXED' }, null, 2));
