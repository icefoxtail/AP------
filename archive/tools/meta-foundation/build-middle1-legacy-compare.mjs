import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: build-middle1-legacy-compare.mjs <1..31>');
const dir = path.join(root, exam.artifactPath);
const legacyOut = path.join(dir, 'LEGACY_COMPARE.jsonl');
if (fs.existsSync(legacyOut)) throw new Error('Legacy comparison already exists');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJsonl = name => fs.readFileSync(path.join(dir, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'DIFFICULTY_FREEZE_RECEIPT.json'), 'utf8'));
const blindBytes = fs.readFileSync(path.join(dir, 'DIFFICULTY.jsonl'));
if (sha(blindBytes) !== receipt.blindLedgerSha256 || receipt.legacyCompareStarted !== false) throw new Error('Blind difficulty freeze mismatch');
const blind = readJsonl('DIFFICULTY.jsonl');
const input = readJsonl('DIFFICULTY_INPUT.jsonl');
const blindByUid = new Map(blind.map(x => [x.questionUid, x]));
const byInput = new Map(input.map(x => [x.questionUid, x]));
const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'archive/exams', exam.sourceArchiveFile), 'utf8'), context, { timeout: 3000 });
const source = context.window.questionBank || context.window.questions || context.questionBank || context.questions;
if (blind.length !== exam.questionRowCount || source.length !== blind.length) throw new Error('Legacy compare count mismatch');
function compatibility(level, bucket) {
  if (bucket === 'UNKNOWN' || !['하','중','상'].includes(level)) return 'UNKNOWN';
  if ((level === '하' && bucket === 1) || (level === '중' && [2,3].includes(bucket)) || (level === '상' && [4,5].includes(bucket))) return 'NORMAL';
  if ((level === '하' && bucket === 2) || (level === '중' && [1,4].includes(bucket)) || (level === '상' && bucket === 3)) return 'BORDERLINE_REVIEW';
  return 'STRONG_CONFLICT';
}
const compared = blind.map(row => {
  const raw = source[row.sourceOrdinal - 1];
  const dInput = byInput.get(row.questionUid);
  if (!raw || !dInput || row.blindInputSha !== dInput.blindInputSha) throw new Error(`Legacy/source join mismatch ${row.questionUid}`);
  if (batchNo >= 8) {
    for (const [flag, reason] of [['visualDifficultyImpact','visualDifficultyImpactReason'], ['sourceSolutionDifficultyConflict','sourceSolutionConflictReason'], ['reviewerRequestedRecheck','reviewerRecheckReason']]) {
      if (typeof row[flag] !== 'boolean') throw new Error(`First-pass recheck evidence flag missing: ${flag} #${row.sourceOrdinal}`);
      if (row[flag] && !String(row[reason] || '').trim()) throw new Error(`First-pass recheck evidence reason missing: ${reason} #${row.sourceOrdinal}`);
    }
  }
  return { questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal, blindInputSha: row.blindInputSha, blindLedgerSha256: receipt.blindLedgerSha256, blindBucket: row.difficultyBucket, blindConfidence: row.difficultyConfidence, blindBoundaryFlag: row.difficultyBoundaryFlag, legacyLevel: raw.level ?? null, legacyLevelCompatibility: compatibility(raw.level, row.difficultyBucket) };
});
const triggersByUid = new Map();
for (const row of compared) {
  const reasons = [];
  if (row.blindBoundaryFlag !== 'NONE') reasons.push('BOUNDARY_FLAG');
  if (row.blindConfidence === 'low') reasons.push('LOW_CONFIDENCE');
  // Canonical v1.3 §11.2 requires independent review before an adjacent legacy mismatch is accepted.
  if (row.legacyLevelCompatibility === 'BORDERLINE_REVIEW') reasons.push('LEGACY_BORDERLINE');
  if (row.legacyLevelCompatibility === 'STRONG_CONFLICT') reasons.push('LEGACY_STRONG_CONFLICT');
  const firstPass = blindByUid.get(row.questionUid);
  const raw = source[row.sourceOrdinal - 1];
  if (typeof raw.difficultyBucket === 'number' && typeof row.blindBucket === 'number' && Math.abs(raw.difficultyBucket - row.blindBucket) >= 2) reasons.push('EXISTING_METADATA_SEMANTIC_CONFLICT');
  if (firstPass.visualDifficultyImpact === true) reasons.push('VISUAL_DIFFICULTY_IMPACT');
  if (firstPass.sourceSolutionDifficultyConflict === true) reasons.push('SOURCE_SOLUTION_DIFFICULTY_CONFLICT');
  if (firstPass.reviewerRequestedRecheck === true) reasons.push('REVIEWER_REQUESTED_RECHECK');
  if (reasons.length) triggersByUid.set(row.questionUid, reasons);
}
const byTemplate = new Map();
for (const row of blind) {
  const key = byInput.get(row.questionUid)?.semanticContext?.templateKey;
  if (!byTemplate.has(key)) byTemplate.set(key, []);
  byTemplate.get(key).push(row);
}
for (const rows of byTemplate.values()) {
  const numeric = rows.filter(x => typeof x.difficultyBucket === 'number');
  if (numeric.length < 2) continue;
  const sorted = [...numeric].sort((a,b) => a.difficultyBucket - b.difficultyBucket);
  if (sorted.at(-1).difficultyBucket - sorted[0].difficultyBucket >= 2) for (const row of [sorted[0], sorted.at(-1)]) {
    const reasons = triggersByUid.get(row.questionUid) || [];
    reasons.push('SAME_TEMPLATE_SPAN_ENDPOINT');
    triggersByUid.set(row.questionUid, reasons);
  }
}
const queue = compared.filter(x => triggersByUid.has(x.questionUid)).map(x => ({ ...x, triggerReasons: [...new Set(triggersByUid.get(x.questionUid))] }));
fs.writeFileSync(legacyOut, compared.map(JSON.stringify).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'DIFFICULTY_RECHECK_QUEUE.jsonl'), queue.map(JSON.stringify).join('\n') + (queue.length ? '\n' : ''));
const triggerCounts = queue.flatMap(x => x.triggerReasons).reduce((o,key)=>(o[key]=(o[key]||0)+1,o),{});
console.log(JSON.stringify({ batchNo, compared: compared.length, compatibilityCounts: compared.reduce((o,x)=>(o[x.legacyLevelCompatibility]=(o[x.legacyLevelCompatibility]||0)+1,o),{}), mandatoryRecheck: queue.length, recheckRatePercent: Number((100 * queue.length / compared.length).toFixed(1)), triggerCounts, visualTriggeredRecheck: triggerCounts.VISUAL_DIFFICULTY_IMPACT || 0 }, null, 2));
