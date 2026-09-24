#!/usr/bin/env node
/** Screen the unreviewed 67 UIDs in the frozen polynomial division family. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkpoint = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'poly-division-boundary');
const read = file => fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const stage = read(path.join(checkpoint, 'H1_STAGE3_L4_CANDIDATE_ASSIGNMENTS_1170.jsonl'))
  .filter(row => row.problemTypeKeyCandidate === 'PT_H1_POLY_DIVISION_REMAINDER');
const current = read(path.join(checkpoint, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'));
const sample = read(path.join(dir, 'H1_POLY_DIVISION_L3_L4_BOUNDARY_SAMPLE_20.jsonl'));
const currentByUid = new Map(current.map(row => [row.questionUid, row]));
const sampleUids = new Set(sample.map(row => row.questionUid));
if (stage.length !== 87 || currentByUid.size !== 1170 || sampleUids.size !== 20)
  throw new Error('family/sample/current coverage drift');
const remaining = stage.filter(row => !sampleUids.has(row.questionUid)).map(row => {
  const live = currentByUid.get(row.questionUid);
  if (!live || live.sourceIdentity !== row.sourceIdentity) throw new Error(`source identity drift ${row.questionUid}`);
  return { queueIndex: live.queueIndex, questionUid: live.questionUid,
    sourceIdentity: live.sourceIdentity, sourceFingerprint: live.sourceFingerprint };
}).sort((a, b) => a.queueIndex - b.queueIndex);
if (remaining.length !== 67 || new Set(remaining.map(row => row.questionUid)).size !== 67)
  throw new Error('remaining UID coverage mismatch');
const chunks = [remaining.slice(0, 20), remaining.slice(20, 40), remaining.slice(40, 60), remaining.slice(60)];
const files = ['H1_POLY_DIVISION_REMAINING_67.jsonl', ...chunks.map((_, i) => `H1_POLY_DIVISION_REMAINING_BATCH${i + 1}.jsonl`),
  'H1_POLY_DIVISION_REMAINING_67_SUMMARY.json'];
if (files.some(file => fs.existsSync(path.join(dir, file)))) throw new Error('remaining screen already frozen');
fs.writeFileSync(path.join(dir, files[0]), remaining.map(row => JSON.stringify(row)).join('\n') + '\n');
for (const [i, chunk] of chunks.entries())
  fs.writeFileSync(path.join(dir, files[i + 1]), chunk.map(row => JSON.stringify(row)).join('\n') + '\n');
const summary = { schemaVersion: 1, status: 'SCREEN_ONLY_NOT_SEMANTIC_VERDICT',
  familyDenominator: 87, priorSample: 20, remaining: 67,
  batches: chunks.map((chunk, i) => ({ batch: i + 1, count: chunk.length,
    firstQueueIndex: chunk[0].queueIndex, lastQueueIndex: chunk.at(-1).queueIndex })),
  selectionRule: 'same frozen family UID set minus the 20 already blind-reviewed UIDs; current queue/fingerprint bound',
  oldL3L4VerdictsInWorkerInput: false };
fs.writeFileSync(path.join(dir, files.at(-1)), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
