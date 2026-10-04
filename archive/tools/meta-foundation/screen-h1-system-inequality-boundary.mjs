#!/usr/bin/env node
/** Screening only: find frozen system-equation items whose live stem mentions inequalities. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const outDir = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/l3-boundary');
fs.mkdirSync(outDir, { recursive: true });
const source = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/H1_STAGE3_L4_CANDIDATE_ASSIGNMENTS_1170.jsonl');
const rows = fs.readFileSync(source, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
if (rows.length !== 1170) throw new Error(`expected 1170 rows, found ${rows.length}`);
const currentQueue = fs.readFileSync(path.join(root,
  'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/H1_STAGEA_REMAINING_QUEUE_1120_UID_ONLY.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
const currentQueueByUid = new Map(currentQueue.map(row => [row.questionUid, row]));
if (currentQueue.length !== 1120 || currentQueueByUid.size !== 1120) throw new Error('current UID queue drift');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const cache = new Map();
const matched = [];
let frozenSystemCount = 0;
for (const [index, row] of rows.entries()) {
  if (row.problemTypeKeyCandidate !== 'PT_H1_SYSTEM_EQUATION') continue;
  frozenSystemCount++;
  const match = /^(.+\.js)#([1-9]\d*)$/.exec(row.sourceIdentity);
  if (!match) throw new Error(`bad source identity at q${index + 1}`);
  const [, archiveFile, ordinal] = match;
  if (!cache.has(archiveFile)) {
    const file = path.join(root, 'archive/exams', archiveFile);
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 10000 });
    if (!Array.isArray(context.window.questionBank)) throw new Error(`bad questionBank ${archiveFile}`);
    cache.set(archiveFile, context.window.questionBank);
  }
  const q = cache.get(archiveFile)[Number(ordinal) - 1];
  if (!q || Number(q.id) !== Number(ordinal)) throw new Error(`ordinal mismatch q${index + 1}`);
  if (!String(q.content ?? '').includes('부등식')) continue;
  const sourceFingerprint = sha(JSON.stringify({ content: q.content ?? null,
    choices: Array.isArray(q.choices) ? q.choices : null, answer: q.answer ?? null,
    solution: q.solution ?? null, image: q.image ?? null }));
  const current = currentQueueByUid.get(row.questionUid);
  if (!current || current.sourceIdentity !== row.sourceIdentity)
    throw new Error(`current UID/source identity missing for Stage3 position ${index + 1}`);
  matched.push({ queueIndex: current.queueIndex, questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
    sourceFingerprint });
}
if (frozenSystemCount !== 76 || matched.length < 30 || matched.length > 50)
  throw new Error(`screening denominator drift: ${frozenSystemCount}, matched ${matched.length}`);
const summary = { schemaVersion: 1, status: 'SCREEN_ONLY_NOT_SEMANTIC_VERDICT',
  frozenSystemEquationDenominator: frozenSystemCount, inequalityWordMatched: matched.length,
  queueRule: 'queueIndex is joined from the authoritative current UID queue, never inferred from the Stage3 row position',
  selectionRule: "frozen PT_H1_SYSTEM_EQUATION and current JS content includes '부등식'",
  reviewRule: 'A/B independently choose the decisive L3 parent from current content+solution and UID-free authority; the screen is not a taxonomy assignment.' };
const screenFile = path.join(outDir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl');
const summaryFile = path.join(outDir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN_SUMMARY.json');
if (fs.existsSync(screenFile) || fs.existsSync(summaryFile))
  throw new Error('screen already frozen; create a separately named source revision instead of overwriting');
fs.writeFileSync(screenFile, matched.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
