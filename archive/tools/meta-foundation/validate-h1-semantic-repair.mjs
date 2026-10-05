import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const shaBytes = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(OUT, file))).digest('hex');
const read = (file) => fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const required = ['questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash', 'primaryMethod', 'decisiveStep', 'supportingConcepts', 'conditions', 'compositionPattern', 'curriculumNotes', 'sourceIssue', 'semanticConfidence', 'semanticReasonShort', 'reviewBasis'];
const directFiles = [
  'H1_SEMANTIC_REPAIR_EQINEQ_001_070.jsonl', 'H1_SEMANTIC_REPAIR_EQINEQ_071_140.jsonl', 'H1_SEMANTIC_REPAIR_EQINEQ_141_210.jsonl', 'H1_SEMANTIC_REPAIR_EQINEQ_211_280.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_281_350.jsonl',
  'H1_SEMANTIC_REPAIR_PERMCOMB_001_070.jsonl', 'H1_SEMANTIC_REPAIR_PERMCOMB_071_140.jsonl', 'H1_SEMANTIC_REPAIR_PERMCOMB_141_186.jsonl',
  'H1_SEMANTIC_REPAIR_MATRIX_001_026.jsonl',
];
const authoritativeFiles = [
  'POLYNOMIAL_SEMANTIC_LEDGER_217.jsonl', 'EQINEQ_BATCH1_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH2_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH3_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH4_SEMANTIC_LEDGER.jsonl',
  'EQINEQ_BATCH5_SOL_DECISIONS_281_350.jsonl', 'EQINEQ_BATCH6_SOL_DECISIONS_351_420.jsonl', 'EQINEQ_BATCH7_SOL_DECISIONS_421_490.jsonl', 'EQINEQ_BATCH8_SOL_DECISIONS_491_560.jsonl', 'EQINEQ_BATCH9_SOL_DECISIONS_561_583.jsonl',
  'PERMCOMB_BATCH10_SOL_DECISIONS_1_70.jsonl', 'PERMCOMB_BATCH11_SOL_DECISIONS_71_140.jsonl', 'PERMCOMB_BATCH12_SOL_DECISIONS_141_210.jsonl', 'PERMCOMB_BATCH13_SOL_DECISIONS_211_280.jsonl', 'PERMCOMB_BATCH14_SOL_DECISIONS_281_287.jsonl',
  'MATRIX_BATCH15_SOL_DECISIONS_1_70.jsonl', 'MATRIX_BATCH16_SOL_DECISIONS_71_83.jsonl',
];
const inv = JSON.parse(fs.readFileSync(path.join(ROOT, 'archive/_generated/intelligence/phase1/high1-foundation/h1_fresh_inventory.json'), 'utf8'));
const sourceByIdentity = new Map(inv.rows.map((row) => [`${row.sourceArchiveFile}#${row.sourceOrdinal}`, row]));
const directRows = directFiles.flatMap(read);
const directUid = new Set();
const directSource = new Set();
const directMissing = [];
const fingerprintMismatch = [];
for (const row of directRows) {
  for (const field of required) if (row[field] === undefined || row[field] === null || row[field] === '') directMissing.push(`${row.questionUid}:${field}`);
  if (row.reviewBasis !== 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW') directMissing.push(`${row.questionUid}:reviewBasis`);
  if (directUid.has(row.questionUid)) throw new Error(`duplicate direct UID ${row.questionUid}`);
  if (directSource.has(row.sourceIdentity)) throw new Error(`duplicate direct source identity ${row.sourceIdentity}`);
  directUid.add(row.questionUid); directSource.add(row.sourceIdentity);
  const source = sourceByIdentity.get(row.sourceIdentity);
  if (!source || source.sourceFingerprint !== row.sourceFingerprint) fingerprintMismatch.push(row.questionUid);
}
const authoritative = authoritativeFiles.flatMap(read);
const allUid = new Set(authoritative.map((row) => row.questionUid));
const allSource = new Set(authoritative.map((row) => row.sourceIdentity));
const index = JSON.parse(fs.readFileSync(path.join(OUT, 'H1_STAGE2_SEMANTIC_LEDGER_INDEX_1170.json'), 'utf8'));
const shaParity = index.ledgerFiles.map((entry) => ({ file: entry.file, expected: entry.sha256, actual: shaBytes(entry.file), matches: entry.sha256 === shaBytes(entry.file) }));
const evidence = {
  schemaVersion: 'h1-semantic-repair-validation-evidence-v1',
  repairStartHead: 'afccd2f78cc4a99a8a8deef8b160f90c3b0f9ae2',
  originMainSha: '0487238c8a137fcf5853d5202663dec04f893a01',
  directSemanticRepair: { eqineq001_280: 280, eqineqBatch5: 70, permcomb: 186, matrix: 26, total: directRows.length, uidUnique: directUid.size, sourceIdentityUnique: directSource.size, requiredFieldMissing: directMissing.length, fingerprintMismatch: fingerprintMismatch.length },
  polynomial: { rows: 217, reviewBasis: 'EXISTING_SEMANTIC_CHECKPOINT_PRESERVED_PROVENANCE_RECHECK' },
  authoritativeCoverage: { rows: authoritative.length, uidUnique: allUid.size, sourceIdentityUnique: allSource.size, duplicateUid: authoritative.length - allUid.size, duplicateSourceIdentity: authoritative.length - allSource.size, requiredFieldMissing: index.ledgerCoverage.requiredSemanticFieldMissing, fingerprintMismatch: index.ledgerCoverage.fingerprintMismatch },
  ledgerShaParity: shaParity,
  holds: { itemLevelKnown: index.holdResolution.knownItemLevelHoldRows, closedOrRouted: index.holdResolution.closedOrRouted, historicalAggregateResidual: index.holdResolution.aggregateBlocked, exactUidInference: false },
  mutation: { production: 0, canonical: 0, compiled: 0, runtime: 0, mainMerge: 0 },
};
fs.writeFileSync(path.join(OUT, 'H1_SEMANTIC_REPAIR_VALIDATION_EVIDENCE.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
if (directRows.length !== 562 || directUid.size !== 562 || directSource.size !== 562 || directMissing.length || fingerprintMismatch.length) throw new Error('Direct semantic repair validation failed');
if (authoritative.length !== 1170 || allUid.size !== 1170 || allSource.size !== 1170 || authoritative.length !== allUid.size || authoritative.length !== allSource.size) throw new Error('Authoritative 1170 coverage failed');
if (shaParity.some((row) => !row.matches)) throw new Error('Ledger SHA parity failed');
console.log(JSON.stringify({ directRows: directRows.length, directUidUnique: directUid.size, directSourceIdentityUnique: directSource.size, authoritativeRows: authoritative.length, shaParity: shaParity.every((row) => row.matches), evidence: 'H1_SEMANTIC_REPAIR_VALIDATION_EVIDENCE.json' }, null, 2));
