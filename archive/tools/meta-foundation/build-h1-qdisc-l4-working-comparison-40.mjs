#!/usr/bin/env node
/** Current-source A2/B/C L4 inventory for two PASS-scope qdisc batches. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const checkpoint = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'l4-quadratic-discriminant');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const manifest = read('H1_QDISC_L4_WORKING_PASS_80_UID_ONLY.jsonl').slice(0, 40);
const a = [...read('H1_A2_QDISC_L4_BATCH1_20.jsonl'), ...read('H1_A2_QDISC_L4_BATCH2_20.jsonl')];
const b = [...read('H1_B_QDISC_L4_BATCH1_ISSUE_SUPERSESSION_20.jsonl'),
  ...read('H1_B_QDISC_L4_BATCH2_RAW_20.jsonl')];
const c = [...read('H1_C2_QDISC_L4_BATCH1_CONFLICTS_8.jsonl'),
  ...read('H1_C2_QDISC_L4_BATCH2_CONFLICTS_9.jsonl')];
const one = name => { const rows = read(name); if (rows.length !== 1) throw new Error(`one row expected ${name}`); return rows[0]; };
const post241 = { a2: one('H1_A2_QDISC_Q241_POST_SOL.jsonl'),
  b: one('H1_B_QDISC_Q241_POST_SOL.jsonl'), c: one('H1_C2_QDISC_Q241_POST_SOL.jsonl') };
const corrected572 = one('H1_B_QDISC_L4_BATCH2_Q572_CORRECTION.jsonl');
const q241Ledger = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'H1_SOL_Q241_MISSING_ROOT_BRANCH_CORRECTION.json'), 'utf8'));
if (manifest.length !== 40 || a.length !== 40 || b.length !== 40 || c.length !== 17)
  throw new Error('qdisc batch1/2 coverage mismatch');
for (let i = 0; i < 40; i++) if (a[i].questionUid !== manifest[i].questionUid
  || b[i].questionUid !== manifest[i].questionUid) throw new Error(`A/B qdisc order q${i}`);
const byUid = rows => new Map(rows.map(row => [row.questionUid, row]));
const aByUid = byUid(a), bByUid = byUid(b), cByUid = byUid(c);
aByUid.set(post241.a2.questionUid, post241.a2);
bByUid.set(post241.b.questionUid, post241.b);
cByUid.set(post241.c.questionUid, post241.c);
bByUid.set(corrected572.questionUid, corrected572);
if (aByUid.size !== 40 || bByUid.size !== 40 || cByUid.size !== 17)
  throw new Error('qdisc A/B/C distinct UID mismatch');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const exams = new Map();
function live(identity) {
  const match = /^(.+\.js)#([1-9]\d*)$/.exec(identity);
  if (!match) throw new Error(`bad sourceIdentity ${identity}`);
  if (!exams.has(match[1])) {
    const file = path.join(root, 'archive/exams', match[1]);
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 10000 });
    exams.set(match[1], context.window.questionBank);
  }
  const q = exams.get(match[1])?.[Number(match[2]) - 1];
  if (!q || q.id !== Number(match[2])) throw new Error(`ordinal drift ${identity}`);
  return sha(JSON.stringify({ content: q.content ?? null,
    choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
}
const out = manifest.map((old, index) => {
  const x = aByUid.get(old.questionUid), y = bByUid.get(old.questionUid), z = cByUid.get(old.questionUid) ?? null;
  const currentFingerprint = live(old.sourceIdentity);
  if (!x || !y || x.queueIndex !== old.queueIndex || y.queueIndex !== old.queueIndex
    || x.sourceIdentity !== old.sourceIdentity || y.sourceIdentity !== old.sourceIdentity)
    throw new Error(`qdisc identity mismatch row ${index}`);
  for (const field of ['questionUid', 'sourceFingerprint', 'contentHash', 'solutionHash'])
    if (x[field] !== y[field] || (z && x[field] !== z[field]))
      throw new Error(`qdisc A2/B/C ${field} mismatch q${old.queueIndex}`);
  if (x.sourceFingerprint !== currentFingerprint) throw new Error(`qdisc source drift q${old.queueIndex}`);
  if (old.queueIndex === 241 && (old.sourceFingerprint === currentFingerprint
    || q241Ledger.sourceFingerprintAfter !== currentFingerprint)) throw new Error('q241 post-solution supersession absent');
  if (old.queueIndex !== 241 && old.sourceFingerprint !== currentFingerprint)
    throw new Error(`unexpected qdisc source drift q${old.queueIndex}`);
  return { schemaVersion: 1, status: 'L4_RAW_COMPARISON_NOT_ADJUDICATED',
    queueIndex: old.queueIndex, questionUid: old.questionUid, sourceIdentity: old.sourceIdentity,
    sourceFingerprint: currentFingerprint,
    a2: { l3Fit: x.currentL3Fit?.status ?? null, cluster: x.l4Cluster ?? x.L4?.clusterId ?? null,
      skeleton: x.l4Skeleton ?? x.L4?.skeleton ?? null, reviewStatus: x.reviewStatus },
    b: { l3Fit: y.currentL3Assessment?.status ?? null, cluster: y.L4?.clusterId ?? y.l4Cluster ?? null,
      skeleton: y.L4?.skeleton ?? null, reviewStatus: y.reviewStatus },
    c: z ? { l3Fit: z.L3ParentAssessment?.fitStatus ?? null,
      cluster: z.clusterId?.startsWith('NO_SEPARATE') ? 'NO_SEPARATE' : z.clusterId ?? null,
      skeleton: z.l4Skeleton ?? null, reviewStatus: z.reviewStatus } : null,
    cIndependentCoverage: Boolean(z),
    sourceSupersession: old.queueIndex === 241 ? 'H1_SOL_Q241_MISSING_ROOT_BRANCH_CORRECTION.json' : null,
    qualitySupersession: old.queueIndex === 572 ? 'H1_B_QDISC_L4_BATCH2_Q572_QUALITY_LEDGER.json' : null,
    semanticClusterEquivalence: 'SOL_GLOBAL_EDITOR_PENDING', l4Final: false };
});
const summary = { schemaVersion: 1, status: 'L4_RAW_COMPARISON_NOT_ADJUDICATED',
  reviewedCurrent: 40, remainingPreparedNotReviewed: 40, a2CurrentCoverage: 40, bCurrentCoverage: 40,
  cTargetedCurrentCoverage: out.filter(row => row.c).length,
  currentSourceSupersessionQueueIndexes: [241], bQualityRejectedRowSupersededQueueIndexes: [572],
  a2HoldQueueIndexes: out.filter(row => row.a2.reviewStatus === 'HOLD').map(row => row.queueIndex),
  bHoldQueueIndexes: out.filter(row => row.b.reviewStatus === 'HOLD').map(row => row.queueIndex),
  cHoldQueueIndexes: out.filter(row => row.c?.reviewStatus === 'HOLD').map(row => row.queueIndex),
  semanticClusterEquivalencePending: true, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_QDISC_L4_AB_C_RAW_COMPARISON_40.jsonl'),
  out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_QDISC_L4_AB_C_RAW_COMPARISON_40_SUMMARY.json'),
  JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
