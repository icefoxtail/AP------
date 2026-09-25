#!/usr/bin/env node
/** Structural intake gate for isolated H1 A/B/C 20-item ledgers. */
import fs from 'node:fs';
import path from 'node:path';

const [bundleDir, outputName] = process.argv.slice(2);
if (!bundleDir || !outputName || path.basename(outputName) !== outputName) {
  throw new Error('usage: node gate-h1-blind-ledger.mjs BUNDLE_DIR OUTPUT_FILENAME');
}
const inputDir = path.join(bundleDir, 'input');
const inputFiles = fs.readdirSync(inputDir).filter(name => /^H1_[ABC]_.+\.jsonl$/.test(name));
if (inputFiles.length !== 1) throw new Error(`expected one input JSONL, got ${inputFiles.length}`);
const read = file => fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const inputs = read(path.join(inputDir, inputFiles[0]));
const outputPath = path.join(bundleDir, 'output', outputName);
const raw = fs.readFileSync(outputPath, 'utf8');
const rows = read(outputPath);
const errors = [];
if (inputs.length < 1 || inputs.length > 20 || rows.length !== inputs.length) errors.push(`count input=${inputs.length} output=${rows.length}`);
if (new Set(rows.map(row => row.questionUid)).size !== rows.length) errors.push('duplicate UID');
if (new Set(rows.map(row => row.queueIndex)).size !== rows.length) errors.push('duplicate queueIndex');
if (/H1_STAGEA_LUNA_[ABC]|AB_COMPARISON|supportingQuestionUids/.test(raw)) errors.push('peer verdict/reference text');
const provenance = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash', 'inputBundleSha', 'sourceFileSha256'];
const inputByQueue = new Map(inputs.map(row => [row.queueIndex, row]));
const ordered = rows.every((row, index) => row.queueIndex === inputs[index]?.queueIndex);
let imageLinked = 0;
let imageEvidence = 0;
for (const row of rows) {
  const input = inputByQueue.get(row.queueIndex);
  if (!input) { errors.push(`unexpected q${row.queueIndex}`); continue; }
  const prefix = `q${input.queueIndex}`;
  for (const key of provenance) if (row[key] !== input[key]) errors.push(`${prefix} ${key} mismatch`);
  const sourceEvidence = row.sourceMathEvidence ?? row.sourceEvidence;
  const solutionEvidence = row.solutionMathEvidence ?? row.solutionEvidence;
  if (!sourceEvidence || !solutionEvidence || !row.evidenceRef) errors.push(`${prefix} evidence missing`);
  const l4 = row.l4 ?? row.l4Template ?? row.L4Skeleton ?? row.l4SkeletonCandidate;
  for (const [name, value] of Object.entries({ primaryMethod: row.primaryMethod, decisiveStep: row.decisiveStep, l4, integrationPattern: row.integrationPattern, sourceIssue: row.sourceIssue })) {
    if (!value?.reason) errors.push(`${prefix} ${name}.reason missing`);
  }
  for (const [name, list] of Object.entries({ crossConcepts: row.crossConcepts ?? row.crossConceptKeys ?? [], conditions: row.conditions ?? row.conditionKeys ?? [] })) {
    if (!Array.isArray(list)) errors.push(`${prefix} ${name} not array`);
    else for (const value of list) if (typeof value !== 'object' || !value?.reason) errors.push(`${prefix} ${name} item reason missing`);
  }
  const status = row.status ?? row.reviewStatus ?? row.verdict;
  if (!['PASS', 'HOLD'].includes(status)) errors.push(`${prefix} status invalid`);
  if (status === 'HOLD' && !row.holdReason) errors.push(`${prefix} HOLD reason missing`);
  if (input.localImagePaths?.length) {
    imageLinked++;
    if (row.imageEvidence || row.visualEvidence || row.imageCheck || row.integrity?.image) imageEvidence++;
  }
}
const verdicts = Object.fromEntries([...new Set(rows.map(row => row.status ?? row.reviewStatus ?? row.verdict))]
  .map(status => [status, rows.filter(row => (row.status ?? row.reviewStatus ?? row.verdict) === status).length]));
const reasonFields = {
  method: row => row.primaryMethod?.reason,
  decisiveStep: row => row.decisiveStep?.reason,
  l4: row => (row.l4 ?? row.l4Template ?? row.L4Skeleton ?? row.l4SkeletonCandidate)?.reason,
  source: row => row.sourceMathEvidence ?? row.sourceEvidence,
  solution: row => row.solutionMathEvidence ?? row.solutionEvidence,
};
const repeatedReasons = Object.entries(reasonFields).flatMap(([field, get]) => {
  const counts = new Map();
  for (const row of rows) {
    const value = get(row)?.trim();
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count >= 5).map(([value, count]) => ({ field, count, excerpt: value.slice(0, 100) }));
});
console.log(JSON.stringify({ pass: errors.length === 0, input: inputs.length, output: rows.length, range: [Math.min(...rows.map(row => row.queueIndex)), Math.max(...rows.map(row => row.queueIndex))], ordered, verdicts, imageLinked, imageEvidence, repeatedReasons, errors }, null, 2));
if (errors.length) process.exitCode = 1;
