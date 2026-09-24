import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: build-middle1-difficulty-final.mjs <1..31>');
const dir = path.join(root, exam.artifactPath);
const readJsonl = name => fs.readFileSync(path.join(dir, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'DIFFICULTY_FREEZE_RECEIPT.json'), 'utf8'));
if (sha(fs.readFileSync(path.join(dir, 'DIFFICULTY.jsonl'))) !== receipt.blindLedgerSha256) throw new Error('Blind difficulty ledger changed after freeze');
const blind = readJsonl('DIFFICULTY.jsonl');
const legacy = readJsonl('LEGACY_COMPARE.jsonl');
const queue = readJsonl('DIFFICULTY_RECHECK_QUEUE.jsonl');
const recheck = readJsonl('DIFFICULTY_RECHECK.jsonl');
if (blind.length !== exam.questionRowCount || legacy.length !== blind.length || recheck.length !== queue.length) throw new Error('Difficulty/recheck count mismatch');
const queueByUid = new Map(queue.map(x => [x.questionUid, x]));
const reviewByUid = new Map(recheck.map(x => [x.questionUid, x]));
const legacyByUid = new Map(legacy.map(x => [x.questionUid, x]));
if (queueByUid.size !== queue.length || reviewByUid.size !== recheck.length) throw new Error('Duplicate difficulty queue/recheck UID');
for (const [uid, item] of queueByUid) {
  const row = reviewByUid.get(uid);
  if (!row || row.blindInputSha !== item.blindInputSha) throw new Error(`Missing or mismatched recheck ${uid}`);
  if (!String(row.recheckReason || '').trim()) throw new Error(`Missing recheck reason ${uid}`);
  if (!Array.isArray(row.triggerReasons) || item.triggerReasons.some(t => !row.triggerReasons.includes(t))) throw new Error(`Recheck trigger coverage mismatch ${uid}`);
}
const final = blind.map(row => {
  const rev = reviewByUid.get(row.questionUid);
  const comp = legacyByUid.get(row.questionUid);
  if (!comp || comp.blindInputSha !== row.blindInputSha) throw new Error(`Legacy join mismatch ${row.questionUid}`);
  const bucket = rev ? (rev.proposedFinalBucket ?? rev.finalBucket) : row.difficultyBucket;
  const confidence = rev ? rev.finalConfidence : row.difficultyConfidence;
  const boundary = rev ? rev.finalBoundaryFlag : row.difficultyBoundaryFlag;
  const compatibility = rev ? rev.legacyLevelCompatibility : comp.legacyLevelCompatibility;
  if (![1,2,3,4,5,'UNKNOWN'].includes(bucket)) throw new Error(`Invalid final bucket ${row.questionUid}`);
  if (!['high','medium','low'].includes(confidence)) throw new Error(`Invalid final confidence ${row.questionUid}`);
  if (!['NONE','B12','B23','B34','B45'].includes(boundary)) throw new Error(`Invalid final boundary ${row.questionUid}`);
  if (!['NORMAL','BORDERLINE_ACCEPTABLE','STRONG_CONFLICT','UNKNOWN'].includes(compatibility)) throw new Error(`Unresolved legacy compatibility ${row.questionUid}: ${compatibility}`);
  return {
    questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal,
    sourceFingerprint: row.sourceFingerprint, blindInputSha: row.blindInputSha, blindLedgerSha256: receipt.blindLedgerSha256,
    blindBucket: row.difficultyBucket, difficultyBucket: bucket, difficultyConfidence: confidence, difficultyBoundaryFlag: boundary,
    legacyLevelCompatibility: compatibility, difficultyReason: rev ? `${row.difficultyReason} Recheck: ${rev.recheckReason}` : row.difficultyReason,
    sourceIssueImpact: row.sourceIssueImpact, recheckRequired: queueByUid.has(row.questionUid), recheckReviewed: Boolean(rev),
    recheckTriggerReasons: queueByUid.get(row.questionUid)?.triggerReasons || [], reviewStatus: rev?.reviewStatus || row.reviewStatus
  };
});
fs.writeFileSync(path.join(dir, 'DIFFICULTY_FINAL.jsonl'), final.map(JSON.stringify).join('\n') + '\n');
console.log(JSON.stringify({ batchNo, total: final.length, rechecked: recheck.length, buckets: final.reduce((o,x)=>(o[x.difficultyBucket]=(o[x.difficultyBucket]||0)+1,o),{}), compatibility: final.reduce((o,x)=>(o[x.legacyLevelCompatibility]=(o[x.legacyLevelCompatibility]||0)+1,o),{}) }, null, 2));
