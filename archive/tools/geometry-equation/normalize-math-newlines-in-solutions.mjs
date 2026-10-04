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

function normalizeMathNewlines(solution) {
  let inside = false;
  let output = '';
  for (let i = 0; i < solution.length; i += 1) {
    const ch = solution[i];
    if (ch === '$') {
      inside = !inside;
      output += ch;
    } else if (inside && ch === '\r') {
      if (solution[i + 1] === '\n') i += 1;
      output += ' ';
    } else if (inside && ch === '\n') {
      output += ' ';
    } else {
      output += ch;
    }
  }
  return output;
}

const byFile = new Map();
for (const row of manifest.rows) {
  const filePath = path.join(staging, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  const beforeText = byFile.get(filePath) || fs.readFileSync(filePath, 'utf8');
  const question = readBank(filePath).find((item) => item.id === row.id);
  if (!question) throw new Error('Question missing: ' + row.qKey);
  const nextSolution = normalizeMathNewlines(String(question.solution || ''));
  if (nextSolution === question.solution) continue;
  const result = replaceSolution(beforeText, row.id, nextSolution);
  byFile.set(filePath, result.text);
  byFile.set(`${filePath}::ledger`, { questionUid: row.questionUid, qKey: row.qKey, sourceJsPath: row.sourceJsPath, id: row.id, field: 'solution', beforeHash: sha(result.previous), afterHash: sha(nextSolution), normalization: 'actual-newline-inside-dollar-delimited-math-to-space', protectedFieldsTouched: [] });
}

const ledger = [];
for (const [filePath, text] of byFile) {
  if (filePath.endsWith('::ledger')) { ledger.push(text); continue; }
  new vm.Script(text, { filename: filePath });
  fs.writeFileSync(filePath, text, 'utf8');
}
fs.writeFileSync(path.join(reports, 'solution_runtime_escape_normalization_S9.json'), JSON.stringify({ status: 'S9_STAGING_ONLY_SOLUTION_RENDER_REPAIR', repairedQuestionCount: ledger.length, changedSourceFileCount: new Set(ledger.map((row) => row.sourceJsPath)).size, ledger }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'S9_STAGING_ONLY_SOLUTION_RENDER_REPAIR', repairedQuestionCount: ledger.length, changedSourceFileCount: new Set(ledger.map((row) => row.sourceJsPath)).size, qKeys: ledger.map((row) => row.qKey) }, null, 2));
