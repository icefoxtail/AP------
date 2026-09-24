#!/usr/bin/env node
/** Current-payload structural A/B/C inventory for the H1 first 50 only. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dir = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const queue = read('H1_STAGEA_BOUNDARY_QUEUE_50_UID_ONLY.jsonl');
if (queue.length !== 50 || new Set(queue.map(row => row.questionUid)).size !== 50) throw new Error('first50 queue mismatch');
const files = fs.readdirSync(dir);
const workers = files.filter(name => /^H1_STAGEA_LUNA_[AB]_(BATCH|D2_Q42_REREVIEW|SOURCE_REPAIR_REREVIEW).+\.jsonl$/.test(name));
const cFiles = files.filter(name => /^H1_STAGEA_LUNA_C.+\.jsonl$/.test(name)
  || /^H1_STAGEA_LUNA6_C_FIRST50_.+\.jsonl$/.test(name));
const bySide = { A: new Map(), B: new Map() };
for (const file of workers) {
  const side = file.startsWith('H1_STAGEA_LUNA_A_') ? 'A' : 'B';
  const mtime = fs.statSync(path.join(dir, file)).mtimeMs;
  for (const record of read(file)) {
    if (!Number.isInteger(record.queueIndex) || record.queueIndex < 1 || record.queueIndex > 50) continue;
    if (!bySide[side].has(record.queueIndex)) bySide[side].set(record.queueIndex, []);
    bySide[side].get(record.queueIndex).push({ file, mtime, record });
  }
}
const cByQueue = new Map();
for (const file of cFiles) {
  const mtime = fs.statSync(path.join(dir, file)).mtimeMs;
  for (const record of read(file)) {
    if (!Number.isInteger(record.queueIndex) || record.queueIndex < 1 || record.queueIndex > 50) continue;
    if (!cByQueue.has(record.queueIndex)) cByQueue.set(record.queueIndex, []);
    cByQueue.get(record.queueIndex).push({ file, mtime, record });
  }
}
const examCache = new Map();
function current(sourceIdentity) {
  const match = /^(.+\.js)#([1-9]\d*)$/.exec(sourceIdentity);
  if (!match) throw new Error(`bad sourceIdentity ${sourceIdentity}`);
  const [relative, ordinal] = [match[1], Number(match[2])];
  if (!examCache.has(relative)) {
    const source = path.join(root, 'archive/exams', relative);
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(source, 'utf8'), context, { filename: source, timeout: 10000 });
    if (!Array.isArray(context.window.questionBank)) throw new Error(`no questionBank ${relative}`);
    examCache.set(relative, context.window.questionBank);
  }
  const q = examCache.get(relative)[ordinal - 1];
  if (!q || Number(q.id) !== ordinal) throw new Error(`ordinal mismatch ${sourceIdentity}`);
  return sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
}
const choose = (list, q, fingerprint) => (list ?? [])
  .filter(item => item.record.questionUid === q.questionUid && item.record.sourceIdentity === q.sourceIdentity
    && item.record.sourceFingerprint === fingerprint)
  .sort((a, b) => b.mtime - a.mtime || a.file.localeCompare(b.file))[0] ?? null;
const keys = value => [...new Set((Array.isArray(value) ? value : [])
  .map(item => typeof item === 'string' ? item : item?.key).filter(Boolean))].sort();
const label = value => typeof value === 'string' ? value : value?.key ?? value?.status ?? value?.issue ?? value?.issueCode ?? null;
const issue = value => {
  const raw = label(value);
  return ['CLEAR', 'NO_ISSUE', 'OK', 'PASS'].includes(raw) || raw?.startsWith('UPSTREAM_L') ? 'NONE' : raw;
};
function normalized(item) {
  if (!item) return null;
  const r = item.record;
  return { l3: r.problemTypeKey ?? null,
    crossConcepts: keys(r.crossConceptKeys ?? r.crossConcepts),
    conditions: keys(r.conditionKeys ?? r.conditions), integrationPattern: label(r.integrationPattern),
    sourceIssue: issue(r.sourceIssue), reviewStatus: typeof r.reviewStatus === 'string' && r.reviewStatus.startsWith('HOLD')
      ? 'HOLD' : ['REVIEWED', 'COMPLETE'].includes(r.reviewStatus)
        ? (r.holdReason && !['NONE', 'N/A', 'NO_HOLD'].includes(r.holdReason) ? 'HOLD' : 'PASS')
        : r.reviewStatus ?? r.status ?? null };
}
const rows = [];
const counts = { queueSeen: 0, currentA: 0, currentB: 0, currentDual: 0, coreConflict: 0, issueLabelDifference: 0, fullConflict: 0, currentC: 0, unreviewedConflict: 0 };
for (const q of queue) {
  const fingerprint = current(q.sourceIdentity);
  const a = choose(bySide.A.get(q.queueIndex), q, fingerprint);
  const b = choose(bySide.B.get(q.queueIndex), q, fingerprint);
  const c = choose(cByQueue.get(q.queueIndex), q, fingerprint);
  const na = normalized(a), nb = normalized(b);
  const fields = ['l3', 'crossConcepts', 'conditions', 'integrationPattern', 'reviewStatus'];
  const differences = na && nb ? fields.filter(field => JSON.stringify(na[field]) !== JSON.stringify(nb[field])) : [];
  const issueDifference = Boolean(na && nb && na.sourceIssue !== nb.sourceIssue);
  const fullConflict = differences.length > 0 || issueDifference;
  counts.queueSeen++;
  if (a) counts.currentA++;
  if (b) counts.currentB++;
  if (a && b) counts.currentDual++;
  if (differences.length) counts.coreConflict++;
  if (issueDifference) counts.issueLabelDifference++;
  if (fullConflict) counts.fullConflict++;
  if (c) counts.currentC++;
  if (fullConflict && !c) counts.unreviewedConflict++;
  rows.push({ queueIndex: q.queueIndex, questionUid: q.questionUid, sourceIdentity: q.sourceIdentity,
    currentSourceFingerprint: fingerprint, aFile: a?.file ?? null, bFile: b?.file ?? null,
    currentCFile: c?.file ?? null, a: na, b: nb, differentCoreFields: differences, issueLabelDifference: issueDifference, fullConflict });
}
const summary = { schemaVersion: 'h1-stagea-first50-working-comparison-v1', status: 'WORKING_NOT_FINAL',
  denominator: 50, queueRange: [1, 50], workerFiles: workers.length, cFiles: cFiles.length, counts };
const output = path.join(dir, 'H1_STAGEA_FIRST50_AB_WORKING_COMPARISON_CURRENT.json');
fs.writeFileSync(output, JSON.stringify({ summary, rows }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
