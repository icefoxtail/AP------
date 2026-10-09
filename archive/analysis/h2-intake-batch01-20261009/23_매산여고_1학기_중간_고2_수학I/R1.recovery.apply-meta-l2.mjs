import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('SOURCE_PATH_REQUIRED');
const edits = new Map([
  [3,  {standardCourse:'수학I', standardUnitKey:'H15-M1-01', standardUnit:'지수의 뜻과 성질', standardUnitOrder:1, subUnitKey:'H15-M1-01-EXPONENT', subUnit:'지수의 뜻과 성질'}],
  [7,  {standardCourse:'수학I', standardUnitKey:'H15-M1-03', standardUnit:'지수함수', standardUnitOrder:3, subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', subUnit:'지수함수의 그래프'}],
  [9,  {standardCourse:'수학I', standardUnitKey:'H15-M1-03', standardUnit:'지수함수', standardUnitOrder:3, subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', subUnit:'지수함수의 그래프'}],
  [15, {standardCourse:'수학I', standardUnitKey:'H15-M1-03', standardUnit:'지수함수', standardUnitOrder:3, subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', subUnit:'지수함수의 활용'}],
  [17, {standardCourse:'수학I', standardUnitKey:'H15-M1-03', standardUnit:'지수함수', standardUnitOrder:3, subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', subUnit:'지수함수의 그래프'}],
  [18, {standardCourse:'수학I', standardUnitKey:'H15-M1-04', standardUnit:'로그함수', standardUnitOrder:4, subUnitKey:'H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH', subUnit:'로그함수의 그래프'}],
  [19, {standardCourse:'수학I', standardUnitKey:'H15-M1-02', standardUnit:'로그의 뜻과 성질', standardUnitOrder:2, subUnitKey:'H15-M1-02-LOGARITHM', subUnit:'로그의 뜻과 성질'}],
  [21, {standardCourse:'수학I', standardUnitKey:'H15-M1-03', standardUnit:'지수함수', standardUnitOrder:3, subUnitKey:'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', subUnit:'지수함수의 그래프'}],
]);

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const original = fs.readFileSync(sourcePath, 'utf8');
const ranges = [], braceStack = [];
let quote = '', escaped = false, lineComment = false, blockComment = false;
for (let i = 0; i < original.length; i++) {
  const ch = original[i], next = original[i + 1];
  if (lineComment) { if (ch === '\n') lineComment = false; continue; }
  if (blockComment) { if (ch === '*' && next === '/') { blockComment = false; i++; } continue; }
  if (quote) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === quote) quote = ''; continue; }
  if (ch === '/' && next === '/') { lineComment = true; i++; continue; }
  if (ch === '/' && next === '*') { blockComment = true; i++; continue; }
  if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
  if (ch === '{') { braceStack.push(i); continue; }
  if (ch === '}') { const start = braceStack.pop(); if (start !== undefined) ranges.push([start, i + 1]); }
}
const found = new Map();
for (const [begin, end] of ranges) {
  const body = original.slice(begin, end);
  const id = /["']?(?:id|qid)["']?\s*:\s*["']?(\d+)\b/.exec(body)?.[1];
  if (id && edits.has(Number(id)) && /["']?subUnitKey["']?\s*:/.test(body)) {
    const qid = Number(id), previous = found.get(qid);
    if (!previous || body.length < previous.body.length) found.set(qid, {begin, end, body});
  }
}
if ([...edits.keys()].some((qid) => !found.has(qid))) throw new Error('TARGET_QUESTION_OBJECT_NOT_FOUND');

const replacement = new Map();
for (const [qid, fields] of edits) {
  let body = found.get(qid).body;
  for (const [field, value] of Object.entries({...fields, subUnitConfidence:'category_or_cue_inferred', subUnitClassificationDepth:'complete_category'})) {
    const pattern = new RegExp(`(["' ]?${field}["' ]?\\s*:\\s*)(null|"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|-?\\d+)`, 'g');
    const matches = [...body.matchAll(pattern)];
    if (matches.length !== 1) throw new Error(`EXPECTED_SINGLE_FIELD_${qid}_${field}_GOT_${matches.length}`);
    const m = matches[0];
    const oldValue = m[2];
    const newValue = typeof value === 'number' ? String(value) : JSON.stringify(value);
    if (field === 'subUnitKey' && oldValue !== 'null') throw new Error(`EXPECTED_NULL_L2_${qid}_GOT_${oldValue}`);
    body = body.slice(0, m.index) + m[1] + newValue + body.slice(m.index + m[0].length);
  }
  replacement.set(qid, body);
}
let updated = original;
for (const qid of [...edits.keys()].sort((a,b)=>b-a)) {
  const {begin, end} = found.get(qid);
  updated = updated.slice(0, begin) + replacement.get(qid) + updated.slice(end);
}
if (updated === original) throw new Error('NO_SOURCE_CHANGE');
const report = {schemaVersion:'R1_META_L2_REPAIR_PROVENANCE_V1',sourcePath,sourceBeforeSha256:sha(original),sourceAfterSha256:sha(updated),changedQids:[...edits.keys()],changedFields:[...new Set([...edits.values()].flatMap(x=>Object.keys(x).concat('subUnitConfidence','subUnitClassificationDepth')))],semanticRegistryChanged:false,studentContentChanged:false,answersChanged:false,solutionsChanged:false,assetsChanged:false};
if (process.argv.includes('--write')) fs.writeFileSync(sourcePath, updated, 'utf8');
console.log(JSON.stringify(report,null,2));


