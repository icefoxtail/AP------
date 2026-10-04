import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const FILES = [
  'H1_SEMANTIC_REPAIR_PERMCOMB_001_070.jsonl',
  'H1_SEMANTIC_REPAIR_PERMCOMB_071_140.jsonl',
  'H1_SEMANTIC_REPAIR_PERMCOMB_141_186.jsonl',
  'H1_SEMANTIC_REPAIR_MATRIX_001_026.jsonl',
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

const rows = FILES.flatMap((file) => {
  const batch = readJsonl(file);
  for (const row of batch) {
    for (const field of REQUIRED) {
      if (!(field in row)) throw new Error(`${file}: missing ${field} for ${row.questionUid}`);
    }
    if (row.reviewBasis !== 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW') {
      throw new Error(`${file}: non-direct semantic authority for ${row.questionUid}`);
    }
  }
  return batch;
});
const uids = new Set(rows.map((row) => row.questionUid));
const identities = new Set(rows.map((row) => row.sourceIdentity));
if (rows.length !== 212 || uids.size !== 212 || identities.size !== 212) {
  throw new Error(`Expected 212 direct PermComb/Matrix repair rows; got rows=${rows.length}, uids=${uids.size}, identities=${identities.size}`);
}

console.log(JSON.stringify({
  role: 'VALIDATOR_AND_MATERIALIZE_ONLY',
  semanticAssignmentAuthority: 'PHYSICAL_DIRECT_SOURCE_SOLUTION_DECISION_LEDGERS',
  rows: rows.length,
  uidUnique: uids.size,
  sourceIdentityUnique: identities.size,
  permcombRows: rows.filter((row) => row.workUnit === 'PERMCOMB').length,
  matrixRows: rows.filter((row) => row.workUnit === 'MATRIX').length,
  files: FILES,
}, null, 2));
