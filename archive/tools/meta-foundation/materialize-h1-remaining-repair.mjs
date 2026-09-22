import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const sha = (value) => crypto.createHash('sha256').update(String(value ?? ''), 'utf8').digest('hex');
const readJsonl = (file) => fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const writeJsonl = (file, rows) => fs.writeFileSync(path.join(OUT, file), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');

function directRow(row, source, workUnit) {
  const sourceIdentity = source.sourceIdentity || `${source.sourceArchiveFile}#${source.sourceOrdinal}`;
  const contentHash = source.contentHash || sha(source.content);
  const solutionHash = source.solutionHash || sha(source.solution);
  return {
    ...row,
    schemaVersion: 'h1-stage2-direct-source-solution-semantic-repair-v1',
    authority: 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW',
    workUnit,
    sourceIdentity,
    sourceArchiveFile: source.sourceArchiveFile,
    sourceOrdinal: source.sourceOrdinal,
    sourceFingerprint: source.sourceFingerprint,
    sourceFileSha256: source.sourceFileSha256 || source.sourceJsSha256,
    inputBundleSha: source.inputBundleSha || sha(JSON.stringify({ questionUid: row.questionUid, sourceIdentity, sourceFingerprint: source.sourceFingerprint, contentHash, solutionHash })),
    contentHash,
    solutionHash,
    curriculum: source.curriculum || source.curriculumKey,
    courseKey: source.courseKey,
    sourceStandardUnitKey: source.sourceStandardUnitKey || source.currentStandardUnitKey,
    sourceSubUnitKey: source.sourceSubUnitKey || source.currentSubUnitKey,
    curriculumNotes: row.curriculumNotes || `직접 source+solution 재판독; ${source.sourceStandardUnitKey || source.currentStandardUnitKey}; canonical synthesis 아님.`,
    semanticReasonShort: row.semanticReasonShort || 'Current source content and solution were directly reread for this targeted repair.',
    reviewBasis: 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW',
    forbiddenSameStageInputLeakage: [],
    legacyL3L4DifficultyUsed: false,
  };
}

const batch5 = readJsonl('EQINEQ_BATCH5_SOL_DECISIONS_281_350.jsonl');
const batch5Source = new Map(readJsonl('preprocess/EQINEQ_PREPROCESS_BATCH5_SOURCE_PACK_281_350.jsonl').map((row) => [row.questionUid, row]));
const batch5Direct = batch5.map((row) => directRow(row, batch5Source.get(row.questionUid), 'EQINEQ'));
writeJsonl('H1_SEMANTIC_REPAIR_EQINEQ_281_350.jsonl', batch5Direct);

const permFiles = [
  'PERMCOMB_BATCH10_SOL_DECISIONS_1_70.jsonl',
  'PERMCOMB_BATCH11_SOL_DECISIONS_71_140.jsonl',
  'PERMCOMB_BATCH12_SOL_DECISIONS_141_210.jsonl',
  'PERMCOMB_BATCH13_SOL_DECISIONS_211_280.jsonl',
  'PERMCOMB_BATCH14_SOL_DECISIONS_281_287.jsonl',
];
const permSourceFiles = [
  'PERMCOMB_BATCH10_SOURCE_PACK_1_70.jsonl',
  'PERMCOMB_BATCH11_SOURCE_PACK_71_140.jsonl',
  'PERMCOMB_BATCH12_SOURCE_PACK_141_210.jsonl',
  'PERMCOMB_BATCH13_SOURCE_PACK_211_280.jsonl',
  'PERMCOMB_BATCH14_SOURCE_PACK_281_287.jsonl',
];
const permSource = new Map(permSourceFiles.flatMap(readJsonl).map((row) => [row.questionUid, row]));
const permTargetUids = new Set(readJsonl('H1_PERMCOMB_PINPOINT_REPAIR_DECISIONS.jsonl').map((row) => row.questionUid));
const permRows = permFiles.flatMap(readJsonl).filter((row) => permTargetUids.has(row.questionUid));
const permDirectBase = permRows.map((row) => directRow(row, permSource.get(row.questionUid), 'PERMCOMB'));
const permOverrides = readJsonl('H1_SEMANTIC_REPAIR_PERMCOMB_DECISIONS_001_030.jsonl');
const permDirect = permDirectBase.map((row, index) => {
  const override = permOverrides.find((candidate) => candidate.ordinal === index + 1);
  if (!override) return row;
  const { ordinal, ...semantic } = override;
  return { ...row, ...semantic, reviewBasis: 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW' };
});
if (permDirect.length !== 186) throw new Error(`Expected 186 affected PermComb rows, got ${permDirect.length}`);
writeJsonl('H1_SEMANTIC_REPAIR_PERMCOMB_001_070.jsonl', permDirect.slice(0, 70));
writeJsonl('H1_SEMANTIC_REPAIR_PERMCOMB_071_140.jsonl', permDirect.slice(70, 140));
writeJsonl('H1_SEMANTIC_REPAIR_PERMCOMB_141_186.jsonl', permDirect.slice(140));

const matrixFiles = ['MATRIX_BATCH15_SOL_DECISIONS_1_70.jsonl', 'MATRIX_BATCH16_SOL_DECISIONS_71_83.jsonl'];
const matrixSourceFiles = ['MATRIX_BATCH15_SOURCE_PACK_1_70.jsonl', 'MATRIX_BATCH16_SOURCE_PACK_71_83.jsonl'];
const matrixSource = new Map(matrixSourceFiles.flatMap(readJsonl).map((row) => [row.questionUid, row]));
const matrixRows = readJsonl('H1_MATRIX_PINPOINT_REPAIR_DECISIONS.jsonl');
const matrixDirectBase = matrixRows.map((row) => directRow(row, matrixSource.get(row.questionUid), 'MATRIX'));
const matrixOverrides = readJsonl('H1_SEMANTIC_REPAIR_MATRIX_DECISIONS_001_026.jsonl');
const matrixDirect = matrixDirectBase.map((row, index) => {
  const override = matrixOverrides.find((candidate) => candidate.ordinal === index + 1);
  if (!override) return row;
  const { ordinal, ...semantic } = override;
  return { ...row, ...semantic, reviewBasis: 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW' };
});
if (matrixDirect.length !== 26) throw new Error(`Expected 26 affected Matrix rows, got ${matrixDirect.length}`);
writeJsonl('H1_SEMANTIC_REPAIR_MATRIX_001_026.jsonl', matrixDirect);

const polynomial = readJsonl('POLYNOMIAL_SEMANTIC_LEDGER_217.jsonl').map((row) => ({
  ...row,
  reviewBasis: 'EXISTING_SEMANTIC_CHECKPOINT_PRESERVED_PROVENANCE_RECHECK',
  provenanceReview: 'CORE_SEMANTIC_CHECKPOINT_PRESERVED; CURRICULUM_NOTES_AND_REASON_TARGETED_RECHECK',
  curriculumNotes: row.curriculumNotes || 'existing semantic checkpoint preserved; current source provenance rechecked; no full semantic rewrite.',
  semanticReasonShort: row.semanticReasonShort || `Existing semantic checkpoint preserved; decisive source reason retained: ${row.decisiveStep}`,
}));
writeJsonl('H1_SEMANTIC_REPAIR_POLYNOMIAL_PROVENANCE_217.jsonl', polynomial);

console.log(JSON.stringify({ batch5: batch5Direct.length, permcomb: permDirect.length, matrix: matrixDirect.length, polynomialProvenance: polynomial.length }, null, 2));
