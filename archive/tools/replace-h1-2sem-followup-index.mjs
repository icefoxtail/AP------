import fs from 'node:fs';
import vm from 'node:vm';

const indexPath = process.argv[2] || 'C:/Users/USER/Desktop/AP------/archive/question-index.js';
const generatedIndexPath = process.argv[3];
if (!generatedIndexPath) throw new Error('usage: node replace-h1-2sem-followup-index.mjs <current-question-index.js> <generated-question-index.js>');

function loadIndex(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  if (!Array.isArray(context.window.questionIndex)) throw new Error('invalid question index: ' + file);
  return context.window.questionIndex;
}

const targetRe = /^similar\/high\/h1\/(?:2mid|2final)\/25_.+_2학기_(?:중간|기말)_고1_(?:확인|심화)\.js$/;
const currentText = fs.readFileSync(indexPath, 'utf8');
const current = loadIndex(indexPath);
const generated = loadIndex(generatedIndexPath);
const freshByFile = new Map();
for (const entry of generated) {
  if (!targetRe.test(entry.sourceFile)) continue;
  if (!freshByFile.has(entry.sourceFile)) freshByFile.set(entry.sourceFile, []);
  freshByFile.get(entry.sourceFile).push({ ...entry, subject: entry.subject || '공통수학2' });
}
const freshRows = [...freshByFile.values()].flat();
if (freshByFile.size !== 16 || freshRows.length !== 356) {
  throw new Error('expected 16 files/356 rows, got ' + freshByFile.size + ' files/' + freshRows.length + ' rows');
}

const marker = 'window.questionIndex=[';
const start = currentText.indexOf(marker);
if (start < 0) throw new Error('questionIndex array marker not found');
const spans = [];
let objectStart = -1;
let objectDepth = 0;
let arrayDepth = 0;
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
if (close < 0) throw new Error('questionIndex array close not found');

const targetSpans = spans.filter((span) => targetRe.test(span.entry.sourceFile));
if (targetSpans.length !== 356) throw new Error('expected 356 current target rows, got ' + targetSpans.length);
const freshByKey = new Map(freshRows.map((entry) => [entry.qKey, entry]));
const replacements = targetSpans.map((span) => {
  const fresh = freshByKey.get(span.entry.qKey);
  if (!fresh) throw new Error('generated row missing: ' + span.entry.qKey);
  return { ...span, text: JSON.stringify(fresh) };
});

let nextText = currentText;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  nextText = nextText.slice(0, replacement.start) + replacement.text + nextText.slice(replacement.end);
}
fs.writeFileSync(indexPath, nextText, 'utf8');

const verified = loadIndex(indexPath);
const verifiedTarget = verified.filter((entry) => targetRe.test(entry.sourceFile));
if (verified.length !== current.length || verifiedTarget.length !== 356) {
  throw new Error('replacement verification failed');
}
for (const entry of freshRows) {
  const actual = verified.find((candidate) => candidate.qKey === entry.qKey);
  if (JSON.stringify(actual) !== JSON.stringify(entry)) throw new Error('row mismatch: ' + entry.qKey);
}

console.log(JSON.stringify({ replaced: replacements.length, total: verified.length }, null, 2));
