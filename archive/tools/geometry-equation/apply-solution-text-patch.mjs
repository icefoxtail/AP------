import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const staging = path.join(reports, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(reports, 'geometry_equation_manifest.json'), 'utf8'));
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const patchMap = new Map([
  ['original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js_17', 'solution_patch_q119.txt'],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_18', 'solution_patch_q261.txt'],
  ['original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js_11', 's6/q11.solution.txt'],
  ['original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js_11', '__REMOVE_INTERNAL_NOTE__'],
  ['original/high/h1/1final/23_복성고_1학기_기말_고1_기출.js_14', '__RUNTIME_ESCAPE_NE__']
]);

function readBank(filePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  return context.window.questionBank || [];
}

function locateObject(text, id) {
  const marker = new RegExp('\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*' + id + ',');
  const found = marker.exec(text);
  if (!found) throw new Error('Question object not found: ' + id);
  const start = found.index + 1;
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') quoted = false;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return { start, end: i + 1 };
    }
  }
  throw new Error('Question object closing brace not found: ' + id);
}

function replaceSolution(text, id, nextSolution) {
  const object = locateObject(text, id);
  const block = text.slice(object.start, object.end);
  const pattern = /(^[ \t]*"solution"\s*:\s*)("(?:\\.|[^"\\])*")/m;
  const found = pattern.exec(block);
  if (!found) throw new Error('Solution property not found: ' + id);
  const previous = JSON.parse(found[2]);
  const replacement = found[1] + JSON.stringify(nextSolution);
  const nextBlock = block.slice(0, found.index) + replacement + block.slice(found.index + found[0].length);
  return { text: text.slice(0, object.start) + nextBlock + text.slice(object.end), previous };
}

const byKey = new Map(manifest.rows.map((row) => [row.qKey, row]));
const touched = new Map();
const ledger = [];
for (const [qKey, patchFile] of patchMap) {
  const row = byKey.get(qKey);
  if (!row) throw new Error('qKey not in frozen manifest: ' + qKey);
  const filePath = path.join(staging, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  const before = touched.get(filePath) || fs.readFileSync(filePath, 'utf8');
  const question = readBank(filePath).find((item) => item.id === row.id);
  if (!question) throw new Error('Question missing: ' + qKey);
  const nextSolution = patchFile === '__REMOVE_INTERNAL_NOTE__'
    ? question.solution.replace(/(?:\n|\\n){2}\[검수 메모\][\s\S]*$/, '')
    : patchFile === '__RUNTIME_ESCAPE_NE__'
    ? question.solution.replace(/\n(?=e0\$이고)/, '\\n')
    : fs.readFileSync(path.join(reports, patchFile), 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, '');
  const result = replaceSolution(before, row.id, nextSolution);
  touched.set(filePath, result.text);
  ledger.push({ questionUid: row.questionUid, qKey, sourceJsPath: row.sourceJsPath, id: row.id, field: 'solution', beforeHash: sha(result.previous), afterHash: sha(nextSolution), protectedFieldsTouched: [] });
}

for (const [filePath, text] of touched) {
  new vm.Script(text, { filename: filePath });
  fs.writeFileSync(filePath, text, 'utf8');
}
fs.writeFileSync(path.join(reports, 'solution_text_patch_ledger.json'), JSON.stringify({ status: 'A_REPAIR_APPLIED_TO_STAGING_ONLY', repairedQuestionCount: ledger.length, changedSourceFileCount: touched.size, ledger }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'A_REPAIR_APPLIED_TO_STAGING_ONLY', repairedQuestionCount: ledger.length, changedSourceFileCount: touched.size }, null, 2));
