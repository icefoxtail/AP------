import fs from 'node:fs';
import vm from 'node:vm';

const dbPath = process.argv[2] || 'C:/Users/USER/Desktop/AP------/archive/db.js';
const generatedDbPath = process.argv[3];
if (!generatedDbPath) throw new Error('usage: node append-h1-2sem-followup-db.mjs <current-db.js> <generated-db.js>');

function loadDb(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  if (!Array.isArray(context.window.mainDB?.exams)) throw new Error('invalid db: ' + file);
  return context.window.mainDB;
}

const currentText = fs.readFileSync(dbPath, 'utf8');
const current = loadDb(dbPath);
const generated = loadDb(generatedDbPath);
const additions = generated.exams
  .filter((entry) => entry.file.startsWith('similar/high/h1/2mid/25_') || entry.file.startsWith('similar/high/h1/2final/25_'))
  .filter((entry) => entry.file.endsWith('_확인.js') || entry.file.endsWith('_심화.js'))
  .map((entry) => ({ ...entry, subject: entry.subject || '공통수학2' }));

const existing = new Set(current.exams.map((entry) => entry.file));
const fresh = additions.filter((entry) => !existing.has(entry.file));
if (fresh.length !== 16) throw new Error('expected 16 fresh entries, got ' + fresh.length);

const marker = '"exams": [';
const start = currentText.indexOf(marker);
if (start < 0) throw new Error('exams array marker not found');
let depth = 0;
let inString = false;
let escaped = false;
let close = -1;
for (let i = start + marker.length; i < currentText.length; i += 1) {
  const ch = currentText[i];
  if (inString) {
    if (escaped) escaped = false;
    else if (ch === '\\') escaped = true;
    else if (ch === '"') inString = false;
    continue;
  }
  if (ch === '"') { inString = true; continue; }
  if (ch === '[') depth += 1;
  else if (ch === ']') {
    if (depth === 0) { close = i; break; }
    depth -= 1;
  }
}
if (close < 0) throw new Error('exams array close not found');

const payload = fresh.map((entry) => JSON.stringify(entry, null, 2).replace(/^/gm, '    ')).join(',\n');
const before = currentText.slice(0, close).replace(/\s+$/, '');
const after = currentText.slice(close);
const nextText = before + ',\n' + payload + '\n  ' + after;
fs.writeFileSync(dbPath, nextText, 'utf8');

console.log(JSON.stringify({
  added: fresh.length,
  total: current.exams.length + fresh.length,
  files: fresh.map((entry) => entry.file),
}, null, 2));
