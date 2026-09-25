import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const read = (file) => fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const write = (file, rows) => fs.writeFileSync(path.join(OUT, file), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
const overlay = (targetFile, directRows) => {
  const direct = new Map(directRows.map((row) => [row.questionUid, row]));
  const base = read(targetFile);
  const merged = base.map((row) => direct.get(row.questionUid) || row);
  write(targetFile, merged);
  return { file: targetFile, base: base.length, directApplied: base.filter((row) => direct.has(row.questionUid)).length };
};

const results = [];
const eqDirect = [
  'H1_SEMANTIC_REPAIR_EQINEQ_001_070.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_071_140.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_141_210.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_211_280.jsonl',
].flatMap(read);
for (const file of ['EQINEQ_BATCH1_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH2_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH3_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH4_SEMANTIC_LEDGER.jsonl']) results.push(overlay(file, eqDirect));
results.push(overlay('EQINEQ_BATCH5_SOL_DECISIONS_281_350.jsonl', read('H1_SEMANTIC_REPAIR_EQINEQ_281_350.jsonl')));
results.push(overlay('POLYNOMIAL_SEMANTIC_LEDGER_217.jsonl', read('H1_SEMANTIC_REPAIR_POLYNOMIAL_PROVENANCE_217.jsonl')));

const permDirect = [
  'H1_SEMANTIC_REPAIR_PERMCOMB_001_070.jsonl',
  'H1_SEMANTIC_REPAIR_PERMCOMB_071_140.jsonl',
  'H1_SEMANTIC_REPAIR_PERMCOMB_141_186.jsonl',
].flatMap(read);
for (const file of ['PERMCOMB_BATCH10_SOL_DECISIONS_1_70.jsonl', 'PERMCOMB_BATCH11_SOL_DECISIONS_71_140.jsonl', 'PERMCOMB_BATCH12_SOL_DECISIONS_141_210.jsonl', 'PERMCOMB_BATCH13_SOL_DECISIONS_211_280.jsonl', 'PERMCOMB_BATCH14_SOL_DECISIONS_281_287.jsonl']) results.push(overlay(file, permDirect));
const matrixDirect = read('H1_SEMANTIC_REPAIR_MATRIX_001_026.jsonl');
for (const file of ['MATRIX_BATCH15_SOL_DECISIONS_1_70.jsonl', 'MATRIX_BATCH16_SOL_DECISIONS_71_83.jsonl']) results.push(overlay(file, matrixDirect));

const authoritativeLedgerFiles = [
  'POLYNOMIAL_SEMANTIC_LEDGER_217.jsonl',
  'EQINEQ_BATCH1_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH2_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH3_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH4_SEMANTIC_LEDGER.jsonl',
  'EQINEQ_BATCH5_SOL_DECISIONS_281_350.jsonl', 'EQINEQ_BATCH6_SOL_DECISIONS_351_420.jsonl', 'EQINEQ_BATCH7_SOL_DECISIONS_421_490.jsonl', 'EQINEQ_BATCH8_SOL_DECISIONS_491_560.jsonl', 'EQINEQ_BATCH9_SOL_DECISIONS_561_583.jsonl',
  'PERMCOMB_BATCH10_SOL_DECISIONS_1_70.jsonl', 'PERMCOMB_BATCH11_SOL_DECISIONS_71_140.jsonl', 'PERMCOMB_BATCH12_SOL_DECISIONS_141_210.jsonl', 'PERMCOMB_BATCH13_SOL_DECISIONS_211_280.jsonl', 'PERMCOMB_BATCH14_SOL_DECISIONS_281_287.jsonl',
  'MATRIX_BATCH15_SOL_DECISIONS_1_70.jsonl', 'MATRIX_BATCH16_SOL_DECISIONS_71_83.jsonl',
];
for (const file of authoritativeLedgerFiles) {
  if (!fs.existsSync(path.join(OUT, file))) continue;
  const rows = read(file).map((row) => row.reviewBasis ? row : { ...row, reviewBasis: 'EXISTING_SEMANTIC_CHECKPOINT_PRESERVED' });
  write(file, rows);
}

console.log(JSON.stringify({ role: 'UID_JOIN_AND_LEDGER_FREEZE_ONLY', results }, null, 2));
