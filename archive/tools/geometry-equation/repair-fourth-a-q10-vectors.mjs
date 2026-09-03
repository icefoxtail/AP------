import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const qKey = 'original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_20';
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function locate(text, id) {
  const found = new RegExp(`\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*${id},`).exec(text);
  if (!found) throw new Error(`Question object not found: ${id}`);
  const start = found.index + 1; let depth = 0; let quote = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quote = false; continue; }
    if (ch === '"') { quote = true; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error(`Question object not closed: ${id}`);
}
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const row = manifest.rows.find((candidate) => candidate.qKey === qKey);
if (!row) throw new Error(`qKey not found: ${qKey}`);
const filePath = path.join(STAGING, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
const before = fs.readFileSync(filePath, 'utf8'); const object = locate(before, row.id); const block = before.slice(object.start, object.end);
const property = /(^[ \t]*"solution"\s*:\s*)("(?:\\.|[^"\\])*")/m.exec(block);
if (!property) throw new Error('solution property not found');
const previous = JSON.parse(property[2]);
const replacements = [
  ['\\overrightarrow{AS}=(14-k)\\left(\\dfrac5{14},\\dfrac27\\right)', '\\overrightarrow{AS}=(14-k)\\left(-\\dfrac5{14},-\\dfrac27\\right)'],
  ['\\overrightarrow{AT}=(14-k)\\left(-\\dfrac12,2\\right)', '\\overrightarrow{AT}=(14-k)\\left(\\dfrac12,-2\\right)'],
];
let nextSolution = previous;
for (const [from, to] of replacements) nextSolution = nextSolution.replace(from, to);
if (nextSolution === previous) throw new Error('Expected vector notation not found');
const replacement = `${property[1]}${JSON.stringify(nextSolution)}`;
const after = before.slice(0, object.start) + block.slice(0, property.index) + replacement + block.slice(property.index + property[0].length) + before.slice(object.end);
new vm.Script(after, { filename: filePath }); fs.writeFileSync(filePath, after, 'utf8');
fs.writeFileSync(path.join(REPORTS, 'repair_fourth_a_q10_vectors.json'), JSON.stringify({ status: 'STAGING_REPAIR_APPLIED', questionUid: row.questionUid, beforeHash: sha(previous), afterHash: sha(nextSolution), fileShaBefore: sha(before), fileShaAfter: sha(after) }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'STAGING_REPAIR_APPLIED', questionUid: row.questionUid, beforeHash: sha(previous), afterHash: sha(nextSolution), fileShaAfter: sha(after) }, null, 2));
