import fs from 'node:fs';
import vm from 'node:vm';

const indexPath = process.argv[2] || 'C:/Users/USER/Desktop/AP------/archive/question-index.js';
const generatedIndexPath = process.argv[3];
if (!generatedIndexPath) {
  throw new Error('usage: node append-h1-2sem-followup-index.mjs <current-question-index.js> <generated-question-index.js>');
}

function loadIndex(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  if (!Array.isArray(context.window.questionIndex)) throw new Error('invalid question index: ' + file);
  return context.window.questionIndex;
}

const currentText = fs.readFileSync(indexPath, 'utf8');
const current = loadIndex(indexPath);
const generated = loadIndex(generatedIndexPath);

// Legacy compatibility only. The canonical path is build-question-index.mjs,
// which rebuilds the entire production index and enforces DB/source parity.
// If this fallback is used, include every H1 semester-2 follow-up variant.
const isH1Semester2Followup = (entry) => entry.sourceFile.startsWith('similar/high/h1/2mid/25_') || entry.sourceFile.startsWith('similar/high/h1/2final/25_');
const additions = generated.filter(isH1Semester2Followup);

const existingKeys = new Set(current.map((entry) => entry.qKey));
const fresh = additions.filter((entry) => !existingKeys.has(entry.qKey));

if (!fresh.length) {
  console.log(JSON.stringify({ added: 0, total: current.length, files: [] }, null, 2));
  process.exit(0);
}

const marker = 'window.questionIndex=[';
const start = currentText.indexOf(marker);
if (start < 0) throw new Error('questionIndex array marker not found');
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
if (close < 0) throw new Error('questionIndex array close not found');

const payload = fresh.map((entry) => JSON.stringify(entry)).join(',');
const before = currentText.slice(0, close).replace(/\s+$/, '');
const after = currentText.slice(close);
const nextText = before + ',' + payload + after;
fs.writeFileSync(indexPath, nextText, 'utf8');

console.log(JSON.stringify({
  added: fresh.length,
  total: current.length + fresh.length,
  files: [...new Set(fresh.map((entry) => entry.sourceFile))],
}, null, 2));
