import fs from 'node:fs';
import vm from 'node:vm';

const dbPath = process.argv[2] || 'C:/Users/USER/Desktop/AP------/archive/db.js';
const generatedDbPath = process.argv[3];
if (!generatedDbPath) throw new Error('usage: node replace-h1-2sem-followup-db.mjs <current-db.js> <generated-db.js>');

function loadDb(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  if (!Array.isArray(context.window.mainDB?.exams)) throw new Error('invalid db: ' + file);
  return context.window.mainDB;
}

const targetRe = /^similar\/high\/h1\/(?:2mid|2final)\/25_.+_2학기_(?:중간|기말)_고1_(?:확인|심화)\.js$/;
const currentText = fs.readFileSync(dbPath, 'utf8');
const current = loadDb(dbPath);
const generated = loadDb(generatedDbPath);
const freshByFile = new Map(generated.exams
  .filter((entry) => targetRe.test(entry.file))
  .map((entry) => [entry.file, { ...entry, subject: entry.subject || '공통수학2' }]));
if (freshByFile.size !== 16) throw new Error('expected 16 generated target entries, got ' + freshByFile.size);

const marker = '"exams": [';
const start = currentText.indexOf(marker);
if (start < 0) throw new Error('exams array marker not found');
const spans = [];
let objectStart = -1;
let objectDepth = 0;
let inString = false;
let escaped = false;
let arrayDepth = 0;
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
  if (ch === '[') { arrayDepth += 1; continue; }
  if (ch === ']') {
    if (arrayDepth === 0) { close = i; break; }
    arrayDepth -= 1;
    continue;
  }
  if (ch === '{') {
    if (arrayDepth === 0 && objectDepth === 0) objectStart = i;
    objectDepth += 1;
  } else if (ch === '}') {
    objectDepth -= 1;
    if (objectDepth === 0 && objectStart >= 0) {
      spans.push({ start: objectStart, end: i + 1, entry: JSON.parse(currentText.slice(objectStart, i + 1)) });
      objectStart = -1;
    }
  }
}
if (close < 0) throw new Error('exams array close not found');

const targetSpans = spans.filter((span) => targetRe.test(span.entry.file));
if (targetSpans.length !== 16) throw new Error('expected 16 current target entries, got ' + targetSpans.length);
const seen = new Set();
const replacements = targetSpans.map((span) => {
  const fresh = freshByFile.get(span.entry.file);
  if (!fresh) throw new Error('generated entry missing: ' + span.entry.file);
  seen.add(span.entry.file);
  return { ...span, text: JSON.stringify(fresh, null, 2).replace(/^/gm, '    ') };
});
if (seen.size !== 16) throw new Error('target replacement coverage incomplete');

let nextText = currentText;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  nextText = nextText.slice(0, replacement.start) + replacement.text + nextText.slice(replacement.end);
}
fs.writeFileSync(dbPath, nextText, 'utf8');

const verified = loadDb(dbPath);
const currentByFile = new Map(current.exams.map((entry) => [entry.file, entry]));
const verifiedByFile = new Map(verified.exams.map((entry) => [entry.file, entry]));
for (const file of freshByFile.keys()) {
  if (JSON.stringify(verifiedByFile.get(file)) !== JSON.stringify(freshByFile.get(file))) {
    throw new Error('replacement verification failed: ' + file);
  }
}
if (verified.exams.length !== current.exams.length) throw new Error('exam count changed unexpectedly');

console.log(JSON.stringify({ replaced: replacements.length, total: verified.exams.length }, null, 2));
