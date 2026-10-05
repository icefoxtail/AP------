import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.env.AP_REPO || process.cwd(), 'archive/exams/original');
const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (p.endsWith('.js')) files.push(p);
  }
}
walk(root);
let changed = 0;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const fixed = text.replace(/("answer"\s*:\s*)([①②③④⑤](?:\s*,\s*[①②③④⑤])?)(\s*,)/g, '$1"$2"$3');
  if (fixed !== text) {
    fs.writeFileSync(file, fixed, 'utf8');
    changed++;
  }
}
console.log(JSON.stringify({ changedFiles: changed }));
