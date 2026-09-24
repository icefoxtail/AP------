#!/usr/bin/env node
/** Current-payload A/B working comparison for H1 Stage A, queue 51 onward. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dir = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const queueFile = path.join(dir, 'H1_STAGEA_REMAINING_QUEUE_1120_UID_ONLY.jsonl');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const readLines = file => fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const queue = readLines(queueFile);
const allFiles = fs.readdirSync(dir);
const workerFiles = allFiles.filter(name => (/^H1_STAGEA_LUNA_(A2|A3|B2|B3)_.+\.jsonl$/.test(name)
  || /^H1_STAGEA_LUNA6_[AB]_.+\.jsonl$/.test(name))
  && !name.includes('Q1001_SUPERSESSION')
  && !name.includes('STATUS_SUPERSESSION'));
const cFiles = allFiles.filter(name => /^H1_STAGEA_LUNA_(?:C|C2|C4)_.+\.jsonl$/.test(name)
  || /^H1_STAGEA_LUNA6_C_.+\.jsonl$/.test(name));
const bStatusSupersessionFile = path.join(dir, 'H1_STAGEA_LUNA6_B_BLIND_BATCH20_STATUS_SUPERSESSION.jsonl');
const bStatusOverrides = fs.existsSync(bStatusSupersessionFile)
  ? new Map(readLines(bStatusSupersessionFile).map(row => [row.questionUid, row]))
  : new Map();
const workerRows = { A: new Map(), B: new Map() };
for (const file of workerFiles) {
  const side = /LUNA(?:6)?_A/.test(file) ? 'A' : 'B';
  const mtime = fs.statSync(path.join(dir, file)).mtimeMs;
  for (const record of readLines(path.join(dir, file))) {
    if (!Number.isInteger(record.queueIndex)) continue;
    if (!workerRows[side].has(record.queueIndex)) workerRows[side].set(record.queueIndex, []);
    workerRows[side].get(record.queueIndex).push({ file, mtime, record });
  }
}
const cRows = new Map();
for (const file of cFiles) {
  for (const record of readLines(path.join(dir, file))) {
    if (!Number.isInteger(record.queueIndex)) continue;
    if (!cRows.has(record.queueIndex)) cRows.set(record.queueIndex, []);
    cRows.get(record.queueIndex).push({ file, record });
  }
}

const examCache = new Map();
function currentQuestion(sourceIdentity) {
  const match = /^(.+\.js)#([1-9]\d*)$/.exec(sourceIdentity);
  if (!match) throw new Error(`bad sourceIdentity: ${sourceIdentity}`);
  const relative = match[1];
  const ordinal = Number(match[2]);
  if (!examCache.has(relative)) {
    const file = path.join(root, 'archive/exams', relative);
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 10000 });
    const bank = context.window.questionBank;
    if (!Array.isArray(bank)) throw new Error(`no questionBank: ${relative}`);
    examCache.set(relative, { bank, sourceFileSha256: sha(fs.readFileSync(file)) });
  }
  const exam = examCache.get(relative);
  const q = exam.bank[ordinal - 1];
  if (!q || Number(q.id) !== ordinal) throw new Error(`ordinal/id mismatch: ${sourceIdentity}`);
  const sourceFingerprint = sha(JSON.stringify({
    content: q.content ?? null,
    choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null,
    solution: q.solution ?? null,
    image: q.image ?? null,
  }));
  return { sourceFingerprint, sourceFileSha256: exam.sourceFileSha256 };
}
function choose(list, q, current) {
  const candidates = (list ?? []).filter(x => x.record.questionUid === q.questionUid
    && x.record.sourceIdentity === q.sourceIdentity
    && x.record.sourceFingerprint === current.sourceFingerprint);
  candidates.sort((a, b) => b.mtime - a.mtime || a.file.localeCompare(b.file));
  return candidates[0] ?? null;
}
const sorted = value => [...new Set((Array.isArray(value) ? value : [])
  .map(item => typeof item === 'string' ? item : item?.key)
  .filter(Boolean))].sort();
const label = value => typeof value === 'string' ? value : value?.key ?? value?.status ?? value?.issue ?? null;
const sourceIssueLabel = value => {
  const raw = label(value);
  if (['CLEAR', 'NO_ISSUE', 'OK', 'PASS'].includes(raw) || raw?.startsWith('UPSTREAM_L')) return 'NONE';
  return raw;
};
function normalized(record) {
  if (!record) return null;
  const r = record.record;
  return {
    l3: r.l3?.problemTypeKey ?? r.problemTypeKey ?? r.frozenUpstreamL3?.problemTypeKey
      ?? r.frozenL3?.problemTypeKey ?? r.frozenL3?.key ?? null,
    l3Challenge: Boolean(r.l3Challenge || r.recommendedL3Key
      || ['NEW_CANDIDATE', 'CHALLENGE', 'HOLD'].includes(r.l3?.status)
      || (r.l3ReviewStatus && r.l3ReviewStatus !== 'CONFIRMED')),
    crossConcepts: sorted(r.crossConceptKeys ?? r.crossConcepts),
    conditions: sorted(r.conditionKeys ?? r.conditions),
    integrationPattern: label(r.integrationPattern),
    sourceIssue: sourceIssueLabel(r.sourceIssue),
    reviewStatus: (bStatusOverrides.get(r.questionUid)?.sourceFingerprint === r.sourceFingerprint
      ? bStatusOverrides.get(r.questionUid).status : undefined) ?? r.reviewStatus ?? r.status ?? null,
  };
}
const compared = [];
const counts = { queueSeen: 0, currentA: 0, currentB: 0, currentDual: 0, coreConflict: 0, issueLabelDifference: 0, fullConflict: 0, currentC: 0, unreviewedConflict: 0 };
for (const q of queue) {
  const current = currentQuestion(q.sourceIdentity);
  const a = choose(workerRows.A.get(q.queueIndex), q, current);
  const b = choose(workerRows.B.get(q.queueIndex), q, current);
  const na = normalized(a);
  const nb = normalized(b);
  const c = (cRows.get(q.queueIndex) ?? []).find(x => x.record.questionUid === q.questionUid && x.record.sourceFingerprint === current.sourceFingerprint) ?? null;
  const coreKeys = ['l3', 'l3Challenge', 'crossConcepts', 'conditions', 'integrationPattern', 'reviewStatus'];
  const differentCoreFields = na && nb ? coreKeys.filter(key => JSON.stringify(na[key]) !== JSON.stringify(nb[key])) : [];
  const issueLabelDifference = Boolean(na && nb && na.sourceIssue !== nb.sourceIssue);
  const coreConflict = differentCoreFields.length > 0;
  const fullConflict = coreConflict || issueLabelDifference;
  counts.queueSeen++;
  if (a) counts.currentA++;
  if (b) counts.currentB++;
  if (a && b) counts.currentDual++;
  if (coreConflict) counts.coreConflict++;
  if (issueLabelDifference) counts.issueLabelDifference++;
  if (fullConflict) counts.fullConflict++;
  if (c) counts.currentC++;
  if (fullConflict && !c) counts.unreviewedConflict++;
  compared.push({
    queueIndex: q.queueIndex, questionUid: q.questionUid, sourceIdentity: q.sourceIdentity,
    currentSourceFingerprint: current.sourceFingerprint, currentSourceFileSha256: current.sourceFileSha256,
    aFile: a?.file ?? null, bFile: b?.file ?? null,
    a: na, b: nb, currentCFile: c?.file ?? null,
    differentCoreFields, issueLabelDifference, coreConflict, fullConflict,
  });
}
const summary = {
  schemaVersion: 'h1-stagea-ab-working-comparison-current-payload-v1',
  status: 'WORKING_NOT_FINAL',
  denominator: 1170,
  queueRange: [51, 1170],
  workerFiles: workerFiles.length,
  cFiles: cFiles.length,
  counts,
  sourceRule: 'Only a record whose UID, sourceIdentity, and item sourceFingerprint match the live JS is current; whole-file hash drift for a different sibling UID does not invalidate the item tuple.',
};
const output = path.join(dir, 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json');
fs.writeFileSync(output, JSON.stringify({ summary, rows: compared }, null, 2) + '\n');
const next = compared.filter(x => x.fullConflict && !x.currentCFile).slice(0, 20);
const queueOut = path.join(dir, 'H1_STAGEA_C_BLIND_QUEUE_NEXT_20.jsonl');
fs.writeFileSync(queueOut, next.map(x => JSON.stringify({ queueIndex: x.queueIndex, questionUid: x.questionUid, sourceIdentity: x.sourceIdentity, sourceFingerprint: x.currentSourceFingerprint })).join('\n') + (next.length ? '\n' : ''));
console.log(JSON.stringify({ ...summary, nextBlindCQueue: next.map(x => x.queueIndex) }, null, 2));
