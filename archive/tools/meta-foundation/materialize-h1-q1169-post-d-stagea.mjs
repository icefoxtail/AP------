#!/usr/bin/env node
/** Adapt the current, isolated q1169 A/B HOLD verdicts after source choice repair. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dir = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const rawDir = path.join(dir, 'post-d-q1169');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const readOne = file => {
  const rows = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  if (rows.length !== 1) throw new Error(`expected one row: ${file}`);
  return rows[0];
};
const sourceLedger = JSON.parse(fs.readFileSync(path.join(dir, 'source-evidence/D-q1169-question-only/physical-ledger.json'), 'utf8'));
if (sourceLedger.queueIndex !== 1169 || sourceLedger.disposition !== 'PARTIAL_REPAIR_CHOICE_AND_TARGET_CONFIRMED_MATRIX_CONTENT_HELD')
  throw new Error('D question-only ledger mismatch');
const sourceFile = path.join(root, 'archive/exams', sourceLedger.sourceIdentity.split('#')[0]);
const rawSource = fs.readFileSync(sourceFile);
const context = { window: {} };
vm.runInNewContext(rawSource.toString('utf8'), context, { filename: sourceFile, timeout: 10000 });
const q = context.window.questionBank[16];
if (!q || q.id !== 17) throw new Error('q17 source mismatch');
const choices = Array.from(q.choices);
if (JSON.stringify(choices) !== JSON.stringify(sourceLedger.fieldDispositions.choices.after))
  throw new Error('repaired choices drift');
const current = {
  sourceFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices, answer: q.answer ?? null,
    solution: q.solution ?? null, image: q.image ?? null })),
  contentHash: sha(String(q.content ?? '')),
  solutionHash: sha(String(q.solution ?? '')),
  sourceFileSha256: sha(rawSource),
};
const rows = [];
for (const side of ['A', 'B']) {
  const file = `H1_${side}_Q1169_POST_D_RAW.jsonl`;
  const r = readOne(path.join(rawDir, file));
  if (r.queueIndex !== 1169 || r.questionUid !== sourceLedger.questionUid || r.sourceIdentity !== sourceLedger.sourceIdentity
    || r.workerId !== side || r.reviewStatus !== 'HOLD') throw new Error(`${side} identity/status mismatch`);
  for (const [key, value] of Object.entries(current)) if (r[key] !== value) throw new Error(`${side} ${key} source drift`);
  if (JSON.stringify(r.choices) !== JSON.stringify(choices)) throw new Error(`${side} choices mismatch`);
  const ccs = r.CrossConceptKeys ?? [];
  const conds = r.ConditionKeys ?? [];
  const sourceIssueReason = side === 'A' ? r.sourceIssue : r['sourceIssue/HOLD'];
  if (!sourceIssueReason || !r.holdReason && side === 'A') throw new Error(`${side} HOLD reason missing`);
  const adapted = {
    queueIndex: 1169,
    questionUid: r.questionUid,
    sourceIdentity: r.sourceIdentity,
    sourceFingerprint: r.sourceFingerprint,
    contentHash: r.contentHash,
    solutionHash: r.solutionHash,
    inputBundleSha: r.inputBundleSha,
    sourceFileSha256: r.sourceFileSha256,
    primaryMethod: { method: r.primaryMethod, reason: r.sourceMathEvidence },
    decisiveStep: { step: r.decisiveStep, reason: r.solutionMathEvidence },
    frozenL3: r.frozenL3,
    l3Challenge: { challenge: true, reason: side === 'A' ? r.challenge : r.challenge?.reason },
    l4: { templateKey: null, status: 'HOLD', skeleton: r.draftL4Skeleton ?? r.draftL4Reason,
      reason: r.draftL4Reason },
    crossConcepts: ccs.map(key => ({ key, reason: r.crossConceptEvidence ?? r.CrossConceptReason })),
    conditions: conds.map(key => ({ key, reason: r.conditionEvidence ?? r.ConditionReason })),
    integrationPattern: { key: r.IntegrationPattern, reason: r.integrationPatternEvidence ?? r.IntegrationPatternReason },
    sourceIssue: { status: 'SOURCE_UNRESOLVED_HOLD', reason: sourceIssueReason },
    sourceMathEvidence: r.sourceMathEvidence,
    solutionMathEvidence: r.solutionMathEvidence,
    draftParentLabelKo: r.draftParentLabelKo,
    draftParentReason: r.draftParentReason,
    draftL4LabelKo: r.draftL4LabelKo,
    reviewStatus: 'HOLD',
    holdReason: r.holdReason ?? sourceIssueReason,
    workerId: side,
    evidenceRef: `post-d-q1169/${file}#queueIndex=1169`
  };
  const output = `H1_STAGEA_LUNA6_${side}_POST_D_Q1169.jsonl`;
  fs.writeFileSync(path.join(dir, output), JSON.stringify(adapted) + '\n');
  rows.push({ side, rawFile: file, adaptedFile: output, sourceFingerprint: r.sourceFingerprint,
    sourceFileSha256: r.sourceFileSha256, rawSha256: sha(fs.readFileSync(path.join(rawDir, file))) });
}
const summary = { schemaVersion: 1, status: 'POST_D_TARGETED_AB_HOLD_NOT_FINAL', queueIndex: 1169,
  questionUid: sourceLedger.questionUid, sourceIdentity: sourceLedger.sourceIdentity,
  currentSourceFingerprint: current.sourceFingerprint, choices, reviewStatus: 'HOLD',
  sourceContentStillHeld: true, model: 'gpt-6-luna', reasoningEffort: 'xhigh',
  rows, sourceLedger: 'source-evidence/D-q1169-question-only/physical-ledger.json' };
fs.writeFileSync(path.join(rawDir, 'H1_Q1169_POST_D_AB_ADAPTER_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
