import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { gitBlobSha } from '../../../../tools/archive-stage-validator.mjs';

const root = process.cwd();
const candidateRel = '.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2/23_금당고_1학기_중간_고2_수학I.js';
const parentRel = '.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js';
const draftRel = `${process.argv[2]}`;
const evidenceRel = 'archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/ITEM_RECOVERY.v1';
const expectedSha = 'f991b9796817f3ac596126c2dc911002124822a04e1a7455065712fcee59194e';
const targets = new Set([9, 10, 18, 19]);
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const candidate = path.join(root, candidateRel);
const parent = path.join(root, parentRel);
const draftPath = path.join(root, draftRel);
const evidence = path.join(root, evidenceRel);
const beforePath = path.join(evidence, 'ITEM_RECOVERY.candidate.before.js');
const reportPath = path.join(evidence, 'ITEM_RECOVERY.candidate-patch-report.json');

function parseBank(source) {
  const assignment = source.indexOf('window.questionBank');
  const start = source.indexOf('[', assignment);
  if (assignment < 0 || start < 0) throw new Error('QUESTION_BANK_ASSIGNMENT_NOT_FOUND');
  let inString = false, escaped = false, depth = 0, end = -1;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') { inString = true; continue; }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) { end = i; break; }
  }
  if (end < 0) throw new Error('QUESTION_BANK_ARRAY_END_NOT_FOUND');
  const arrayText = source.slice(start, end + 1);
  const questions = JSON.parse(arrayText);
  const ranges = [];
  inString = false; escaped = false;
  let braces = 0, objectStart = -1;
  for (let i = start + 1; i < end; i++) {
    const c = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') { inString = true; continue; }
    if (c === '{') { if (braces === 0) objectStart = i; braces++; }
    else if (c === '}') {
      braces--;
      if (braces === 0) ranges.push({ start: objectStart, end: i + 1 });
      if (braces < 0) throw new Error('OBJECT_BRACE_UNDERFLOW');
    }
  }
  if (braces !== 0 || ranges.length !== questions.length) throw new Error('QUESTION_OBJECT_RANGES_MISMATCH');
  return { start, end, questions, ranges };
}

const originalBytes = fs.readFileSync(candidate);
if (hash(originalBytes) !== expectedSha) throw new Error('CANDIDATE_SHA_MISMATCH');
if (hash(fs.readFileSync(parent)) !== expectedSha) throw new Error('PARENT_WORKING_JS_SHA_MISMATCH');
fs.writeFileSync(beforePath, originalBytes, { flag: 'wx' });
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
if (draft.sourceRawSha256 !== expectedSha) throw new Error('DRAFT_SOURCE_SHA_MISMATCH');
const { questions, ranges } = parseBank(originalBytes.toString('utf8'));
if (questions.length !== 20) throw new Error('QUESTION_COUNT_MISMATCH');
if (draft.rows.length !== targets.size || new Set(draft.rows.map(x => Number(x.qid))).size !== targets.size) throw new Error('DRAFT_TARGET_SET_INVALID');
const replacementRows = new Map(draft.rows.map(x => [Number(x.qid), x]));
for (const qid of targets) if (!replacementRows.has(qid)) throw new Error(`DRAFT_QID_MISSING:${qid}`);
const replacements = [];
for (let i = 0; i < questions.length; i++) {
  const old = questions[i];
  const qid = Number(old.id);
  if (!targets.has(qid)) continue;
  if (Number(old.number) !== qid || Number(old.id) !== qid) throw new Error(`TARGET_IDENTITY_MISMATCH:${qid}`);
  const row = { ...replacementRows.get(qid) };
  delete row.qid;
  const updated = { ...old, ...row };
  delete updated.itemStatus;
  delete updated.itemHoldReason;
  const serialized = JSON.stringify(updated, null, 2).split('\n').map(line => '  ' + line).join('\n');
  replacements.push({ ...ranges[i], qid, serialized });
}
if (replacements.length !== targets.size) throw new Error('TARGET_COUNT_MISMATCH');
let afterText = originalBytes.toString('utf8');
for (const r of replacements.sort((a, b) => b.start - a.start)) afterText = afterText.slice(0, r.start) + r.serialized + afterText.slice(r.end);
const afterBytes = Buffer.from(afterText, 'utf8');
const context = { window: {} }; vm.createContext(context); vm.runInContext(afterText, context, { timeout: 5000 });
const afterQuestions = context.window.questionBank || context.window.questions;
if (!Array.isArray(afterQuestions) || afterQuestions.length !== 20) throw new Error('PATCHED_JS_PARSE_OR_DENOMINATOR_FAIL');
const baselinePath = path.join(evidence, 'ITEM_RECOVERY.invariance-baseline.json');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const beforeContext = { window: {} }; vm.createContext(beforeContext); vm.runInContext(originalBytes.toString('utf8'), beforeContext, { timeout: 5000 });
const beforeQuestions = beforeContext.window.questionBank || beforeContext.window.questions;
const objectHash = q => hash(Buffer.from(JSON.stringify(q), 'utf8'));
const beforeNonTarget = beforeQuestions.filter(q => !targets.has(Number(q.id))).map(q => ({ qid: Number(q.id), sha256: objectHash(q) }));
const afterNonTarget = afterQuestions.filter(q => !targets.has(Number(q.id))).map(q => ({ qid: Number(q.id), sha256: objectHash(q) }));
if (JSON.stringify(beforeNonTarget) !== JSON.stringify(afterNonTarget)) throw new Error('NON_TARGET_OBJECT_MUTATION_DETECTED');
if (baseline.nonTargetObjectSha256.length !== afterNonTarget.length || baseline.nonTargetObjectSha256.some((x, i) => x.qid !== afterNonTarget[i].qid || x.sha256 !== afterNonTarget[i].sha256)) throw new Error('NON_TARGET_BASELINE_MISMATCH');
for (const qid of targets) {
  const q = afterQuestions.find(x => Number(x.id) === qid);
  if (!q || q.itemStatus === 'HOLD' || q.itemHoldReason !== undefined || !q.answer || !q.solution) throw new Error(`TARGET_HOLD_OR_COMPLETENESS_FAIL:${qid}`);
}
fs.writeFileSync(candidate, afterBytes);
if (hash(fs.readFileSync(parent)) !== expectedSha) throw new Error('PARENT_WORKING_JS_CHANGED');
for (const asset of baseline.assets) {
  const bytes = fs.readFileSync(path.join(path.dirname(candidate), asset.path));
  if (hash(bytes) !== asset.sha256 || gitBlobSha(bytes) !== asset.gitBlobSha) throw new Error(`ASSET_MUTATION_DETECTED:${asset.path}`);
}
const output = fs.readFileSync(candidate);
const report = {
  schemaVersion: 'JS_ARCHIVE_ITEM_RECOVERY_CANDIDATE_PATCH_V1',
  examUid: '23_금당고_1학기_중간_고2_수학I',
  qidsChanged: [9, 10, 18, 19],
  parentWorkingJsSha256: hash(fs.readFileSync(parent)),
  candidateInputRawSha256: hash(originalBytes),
  candidateOutputRawSha256: hash(output),
  candidateOutputGitBlobSha: gitBlobSha(output),
  questionCount: afterQuestions.length,
  itemHoldCount: afterQuestions.filter(q => q.itemStatus === 'HOLD').length,
  targetRows: [9, 10, 18, 19].map(qid => { const q = afterQuestions.find(x => Number(x.id) === qid); return { qid, answer: q.answer, choices: q.choices, solutionSha256: hash(Buffer.from(q.solution, 'utf8')), itemStatus: q.itemStatus || null, itemHoldReasonPresent: q.itemHoldReason !== undefined }; }),
  nonTargetObjectCount: afterNonTarget.length,
  nonTargetObjectsInvariant: true,
  assets: baseline.assets.map(a => ({ path: a.path, sha256: a.sha256, gitBlobSha: a.gitBlobSha, invariant: true }))
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(report, null, 2));