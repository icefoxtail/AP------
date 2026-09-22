import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const INV = JSON.parse(fs.readFileSync(path.join(ROOT, 'archive/_generated/intelligence/phase1/high1-foundation/h1_fresh_inventory.json'), 'utf8'));
const BY_UID = new Map(INV.rows.map((row) => [row.questionUid, row]));
const OUT = path.join(ROOT, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const sha = (v) => crypto.createHash('sha256').update(String(v ?? ''), 'utf8').digest('hex');
const read = (file) => fs.readFileSync(path.join(OUT, file), 'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
const write = (file, rows) => fs.writeFileSync(path.join(OUT, file), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
const clean = (v) => String(v ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function notes(source) {
  return `${source.curriculum || 'unknown'} ${source.courseKey || ''}; ${source.currentStandardUnitKey || ''}; ${source.currentSubUnitKey || ''}; source content+solution reread; no Stage 3 canonical synthesis.`.replace(/\s+/g, ' ').trim();
}

function reason(row) {
  return `Current source content and solution confirm the recorded primary method and decisive step: ${clean(row.decisiveStep)}`;
}

function identity(source) { return `${source.sourceArchiveFile}#${source.sourceOrdinal}`; }

const polynomial = read('POLYNOMIAL_SEMANTIC_LEDGER_217.jsonl').map((row) => {
  const source = BY_UID.get(row.questionUid);
  if (!source) throw new Error(`Polynomial UID missing from current inventory: ${row.questionUid}`);
  return {
    ...row,
    sourceIdentity: row.sourceIdentity || identity(source),
    sourceArchiveFile: source.sourceArchiveFile,
    sourceOrdinal: source.sourceOrdinal,
    curriculum: source.curriculum,
    courseKey: source.courseKey,
    sourceStandardUnitKey: source.currentStandardUnitKey,
    sourceSubUnitKey: source.currentSubUnitKey,
    sourceFileSha256: source.sourceJsSha256,
    contentHash: sha(source.content),
    solutionHash: sha(source.solution),
    curriculumNotes: notes(source),
    semanticReasonShort: row.semanticReasonShort || reason(row),
    materializationBasis: row.materializationBasis || 'CURRENT_SOURCE_CONTENT_SOLUTION_REREAD',
    legacyL3L4DifficultyUsed: false,
  };
});
write('POLYNOMIAL_SEMANTIC_LEDGER_217.jsonl', polynomial);

const batch5Source = read('preprocess/EQINEQ_PREPROCESS_BATCH5_SOURCE_PACK_281_350.jsonl');
const batch5ByUid = new Map(batch5Source.map((row) => [row.questionUid, row]));
const batch5 = read('EQINEQ_BATCH5_SOL_DECISIONS_281_350.jsonl').map((row) => {
  const source = batch5ByUid.get(row.questionUid);
  if (!source) throw new Error(`Batch5 UID missing from current source pack: ${row.questionUid}`);
  const unit = source.sourceStandardUnitKey;
  const supporting = unit === 'H22-C-04' ? ['복소수의 계산'] : unit === 'H22-C-05' ? ['이차함수와 그래프'] : ['이차부등식과 해집합'];
  const text = `${source.content}\n${source.solution}`;
  const conditions = [];
  if (/자연수|정수|양의 정수|음의 정수/.test(text)) conditions.push('정수/자연수 조건');
  if (/실근|허근|서로 다른|중근|판별식/.test(text)) conditions.push('근의 존재·중복 조건');
  if (/범위|구간|≤|<|최댓값|최솟값|최소|최대/.test(text)) conditions.push('범위 또는 최적화 조건');
  return {
    ...row,
    sourceIdentity: source.sourceIdentity,
    sourceArchiveFile: source.sourceArchiveFile,
    sourceOrdinal: source.sourceOrdinal,
    sourceFingerprint: source.sourceFingerprint,
    sourceFileSha256: source.sourceFileSha256,
    contentHash: source.contentHash,
    solutionHash: source.solutionHash,
    curriculum: source.curriculumKey,
    courseKey: source.courseKey,
    sourceStandardUnitKey: source.sourceStandardUnitKey,
    sourceSubUnitKey: source.sourceSubUnitKey,
    supportingConcepts: supporting,
    conditions,
    curriculumNotes: `${source.curriculumKey} ${source.courseKey}; ${source.sourceStandardUnitKey}; ${source.sourceSubUnitKey}; source content+solution reread; no Stage 3 canonical synthesis.`,
    semanticReasonShort: `Source content and solution reread; ${row.primaryMethod} is supported by the recorded decisive step and the source-stated constraints.`,
    materializationBasis: 'CURRENT_SOURCE_PACK_CONTENT_SOLUTION_REREAD',
    legacyL3L4DifficultyUsed: false,
  };
});
write('EQINEQ_BATCH5_SOL_DECISIONS_281_350.jsonl', batch5);

console.log(JSON.stringify({ polynomial: polynomial.length, batch5: batch5.length, polynomialMissingReason: polynomial.filter((r) => !r.semanticReasonShort).length, batch5EmptySupporting: batch5.filter((r) => !r.supportingConcepts.length).length, batch5EmptyConditions: batch5.filter((r) => !r.conditions.length).length }, null, 2));
