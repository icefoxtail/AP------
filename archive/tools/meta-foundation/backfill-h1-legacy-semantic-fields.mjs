import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const FILES = [
  'H1_SEMANTIC_REPAIR_POLYNOMIAL_PROVENANCE_217.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_281_350.jsonl',
];
const REQUIRED = [
  'questionUid',
  'sourceIdentity',
  'sourceFingerprint',
  'contentHash',
  'solutionHash',
  'curriculumNotes',
  'semanticReasonShort',
];

function readJsonl(file) {
  return fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
}

const rows = FILES.flatMap((file) => readJsonl(file).map((row) => ({ file, row })));
for (const { file, row } of rows) {
  for (const field of REQUIRED) {
    if (!(field in row)) throw new Error(`${file}: missing ${field} for ${row.questionUid}`);
  }
  if (file.includes('EQINEQ_281_350') && row.reviewBasis !== 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW') {
    throw new Error(`${file}: Batch5 row is not a direct semantic decision for ${row.questionUid}`);
  }
  if (file.includes('POLYNOMIAL') && row.reviewBasis !== 'EXISTING_SEMANTIC_CHECKPOINT_PRESERVED_PROVENANCE_RECHECK') {
    throw new Error(`${file}: Polynomial row has an invalid provenance basis for ${row.questionUid}`);
  }
}

console.log(JSON.stringify({
  role: 'VALIDATOR_AND_MATERIALIZE_ONLY',
  semanticAssignmentAuthority: 'PHYSICAL_DIRECT_SOURCE_SOLUTION_DECISION_LEDGERS',
  polynomialProvenanceRows: rows.filter(({ file }) => file.includes('POLYNOMIAL')).length,
  batch5DirectRows: rows.filter(({ file }) => file.includes('EQINEQ_281_350')).length,
}, null, 2));
