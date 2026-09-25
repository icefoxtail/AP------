#!/usr/bin/env node
/** Targeted mathematical proof-gap correction after independent A/B/C review. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const relative = 'original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js';
const source = path.join(root, 'archive/exams', relative);
const output = path.join(root,
  'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/H1_SOL_Q241_MISSING_ROOT_BRANCH_CORRECTION.json');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const question = raw => {
  const context = { window: {} };
  vm.runInNewContext(raw, context, { filename: source, timeout: 10000 });
  const q = context.window.questionBank?.[17];
  if (!q || q.id !== 18) throw new Error('q241 source ordinal drift');
  return q;
};
const fingerprint = q => sha(JSON.stringify({ content: q.content ?? null,
  choices: Array.isArray(q.choices) ? q.choices : null, answer: q.answer ?? null,
  solution: q.solution ?? null, image: q.image ?? null }));
const beforeRaw = fs.readFileSync(source, 'utf8');
const before = question(beforeRaw);
const beforeFingerprint = fingerprint(before);
if (beforeFingerprint !== 'caf2275b5ea37423ab2075eb49fc47f5c8264dfaa2d95530e3073f03b636fbfe'
  || fs.existsSync(output)) throw new Error('q241 already changed or ledger exists');
const oldSentence = '두 근 중 하나는 $-1$과 $1$ 사이에 있고, 다른 하나는 $1$보다 큰 쪽에 있어야 하므로';
const newSentence = '두 근 중 하나는 $-1$과 $1$ 사이에 있다. 다른 근이 $-1$보다 작다면 $f(-1)<0$과 $f(1)>0$이 필요하지만, 이는 각각 $a<-3$과 $5a+3>0$을 요구하여 양립할 수 없다. 따라서 다른 근은 $1$보다 커야 하므로';
if (beforeRaw.split(oldSentence).length !== 2) throw new Error('q241 exact proof sentence not unique');
const afterRaw = beforeRaw.replace(oldSentence, newSentence);
fs.writeFileSync(source, afterRaw);
const after = question(afterRaw);
for (const field of ['content', 'choices', 'answer', 'image'])
  if (JSON.stringify(before[field] ?? null) !== JSON.stringify(after[field] ?? null))
    throw new Error(`q241 unexpected ${field} change`);
if (after.solution !== before.solution.replace(oldSentence, newSentence))
  throw new Error('q241 solution delta not exact');
const ledger = { schemaVersion: 1, status: 'SOLUTION_REASON_GAP_CORRECTED_WORKING',
  queueIndex: 241, questionUid: 'qid_v1_b2fd27170298cd3a490b7375d9ace680e495653562efcff5e4191c01041db772',
  sourceIdentity: `${relative}#18`,
  sourceFingerprintBefore: beforeFingerprint, sourceFingerprintAfter: fingerprint(after),
  solutionHashBefore: sha(String(before.solution)), solutionHashAfter: sha(String(after.solution)),
  changedField: 'solution', answerUnchanged: before.answer,
  before: { proofSentence: oldSentence }, after: { proofSentence: newSentence },
  mathematicalVerification: 'If the other root were below −1, an upward quadratic would require f(−1)<0 and f(1)>0. Here f(−1)=a+3 and f(1)=5a+3, forcing a<−3 and a>−3/5 simultaneously, impossible. Thus the exterior root is above 1; the original −3<a<−3/5 and integer sum −3 follow.',
  reason: 'The prior solution asserted the right exterior-root location without excluding the left case. A and B/C independently surfaced the proof gap; the correction adds the missing contradiction only.',
  evidenceFiles: ['C:/Users/USER/.codex/h1-a2-blind/l4-qdisc-80/batch1/output/H1_A2_QDISC_L4_BATCH1_20.jsonl',
    'C:/Users/USER/.codex/h1-b-blind/l4-qdisc-80/batch1/output/H1_B_QDISC_L4_BATCH1_20_ISSUE_REASON_SUPERSESSION.jsonl',
    'C:/Users/USER/.codex/h1-c2-blind/l4-qdisc-batch1-conflicts8/output/H1_C2_QDISC_BATCH1_CONFLICTS8.jsonl'],
  officialAnswerOrSolutionPagesUsed: false, affectedUidBlindRereviewRequired: true,
  validation: { syntax: 'PASS', onlySolutionChanged: true, sourceFingerprintRecomputed: true } };
fs.writeFileSync(output, JSON.stringify(ledger, null, 2) + '\n');
console.log(JSON.stringify({ queueIndex: 241, beforeFingerprint, afterFingerprint: fingerprint(after),
  solutionHashAfter: ledger.solutionHashAfter }));
