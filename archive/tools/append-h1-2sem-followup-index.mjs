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

const targetFiles = new Set([
  'similar/high/h1/2mid/25_금당고_2학기_중간_고1_확인.js',
  'similar/high/h1/2mid/25_금당고_2학기_중간_고1_심화.js',
  'similar/high/h1/2mid/25_매산고_2학기_중간_고1_확인.js',
  'similar/high/h1/2mid/25_매산고_2학기_중간_고1_심화.js',
  'similar/high/h1/2mid/25_순천고_2학기_중간_고1_확인.js',
  'similar/high/h1/2mid/25_순천고_2학기_중간_고1_심화.js',
  'similar/high/h1/2final/25_금당고_2학기_기말_고1_확인.js',
  'similar/high/h1/2final/25_금당고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_순천고_2학기_기말_고1_확인.js',
  'similar/high/h1/2final/25_순천고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_제일고_2학기_기말_고1_확인.js',
  'similar/high/h1/2final/25_제일고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_팔마고_2학기_기말_고1_확인.js',
  'similar/high/h1/2final/25_팔마고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_효천고_2학기_기말_고1_확인.js',
  'similar/high/h1/2final/25_효천고_2학기_기말_고1_심화.js',
]);

const additions = generated.filter((entry) => targetFiles.has(entry.sourceFile));
if (additions.length !== 356) throw new Error('expected 356 generated rows, got ' + additions.length);

const existingKeys = new Set(current.map((entry) => entry.qKey));
const duplicate = additions.find((entry) => existingKeys.has(entry.qKey));
if (duplicate) throw new Error('qKey already exists: ' + duplicate.qKey);

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

const payload = additions.map((entry) => JSON.stringify(entry)).join(',');
const before = currentText.slice(0, close).replace(/\s+$/, '');
const after = currentText.slice(close);
const nextText = before + ',' + payload + after;
fs.writeFileSync(indexPath, nextText, 'utf8');

console.log(JSON.stringify({
  added: additions.length,
  total: current.length + additions.length,
  files: [...targetFiles],
}, null, 2));
