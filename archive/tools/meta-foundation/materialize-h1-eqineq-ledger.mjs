import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const FILES = [
  'H1_SEMANTIC_REPAIR_EQINEQ_001_070.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_071_140.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_141_210.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_211_280.jsonl',
];
const REQUIRED = [
  'questionUid',
  'sourceIdentity',
  'sourceFingerprint',
  'contentHash',
  'solutionHash',
  'primaryMethod',
  'decisiveStep',
  'supportingConcepts',
  'conditions',
  'compositionPattern',
  'curriculumNotes',
  'sourceIssue',
  'semanticConfidence',
  'semanticReasonShort',
  'reviewBasis',
];

function readJsonl(file) {
  return fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
}

function validateRow(row, file) {
  for (const field of REQUIRED) {
    if (!(field in row)) throw new Error(`${file}: missing required field ${field} for ${row.questionUid}`);
  }
  if (row.reviewBasis !== 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW') {
    throw new Error(`${file}: non-direct semantic authority for ${row.questionUid}`);
  }
  if (!Array.isArray(row.supportingConcepts) || !Array.isArray(row.conditions)) {
    throw new Error(`${file}: relational fields must be arrays for ${row.questionUid}`);
  }
}

const rows = FILES.flatMap((file) => {
  const batch = readJsonl(file);
  batch.forEach((row) => validateRow(row, file));
  return batch;
});
const uids = new Set(rows.map((row) => row.questionUid));
const identities = new Set(rows.map((row) => row.sourceIdentity));
if (rows.length !== 280 || uids.size !== 280 || identities.size !== 280) {
  throw new Error(`Expected 280 direct Eq/Ineq repair rows; got rows=${rows.length}, uids=${uids.size}, identities=${identities.size}`);
}

console.log(JSON.stringify({
  role: 'VALIDATOR_AND_MATERIALIZE_ONLY',
  semanticAssignmentAuthority: 'PHYSICAL_DIRECT_SOURCE_SOLUTION_DECISION_LEDGERS',
  rows: rows.length,
  uidUnique: uids.size,
  sourceIdentityUnique: identities.size,
  files: FILES,
}, null, 2));
