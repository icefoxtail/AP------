import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: freeze-middle1-difficulty-result.mjs <1..31>');
const dir = path.join(root, exam.artifactPath);
const receiptPath = path.join(dir, 'DIFFICULTY_FREEZE_RECEIPT.json');
if (fs.existsSync(receiptPath)) throw new Error('Blind difficulty already frozen');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inputBytes = fs.readFileSync(path.join(dir, 'DIFFICULTY_INPUT.jsonl'));
const outputBytes = fs.readFileSync(path.join(dir, 'DIFFICULTY.jsonl'));
const parse = bytes => bytes.toString('utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const inputs = parse(inputBytes), outputs = parse(outputBytes);
if (inputs.length !== exam.questionRowCount || outputs.length !== inputs.length) throw new Error('Blind difficulty count mismatch');
for (const rows of [inputs, outputs]) {
  for (const row of rows) if (Object.keys(row).some(k => /^(level|legacyLevel|legacyLevelCompatibility)$/i.test(k))) throw new Error(`Legacy field leaked into blind row ${row.questionUid}`);
}
if (batchNo >= 8) for (const row of outputs) for (const [flag, reason] of [['visualDifficultyImpact','visualDifficultyImpactReason'], ['sourceSolutionDifficultyConflict','sourceSolutionConflictReason'], ['reviewerRequestedRecheck','reviewerRecheckReason']]) {
  if (typeof row[flag] !== 'boolean' || (row[flag] && !String(row[reason] || '').trim())) throw new Error(`Missing first-pass recheck evidence ${flag} ${row.questionUid}`);
}
if (new Set(outputs.map(x => x.questionUid)).size !== outputs.length) throw new Error('Duplicate blind UID');
const byUid = new Map(inputs.map(x => [x.questionUid, x]));
for (const row of outputs) if (row.blindInputSha !== byUid.get(row.questionUid)?.blindInputSha) throw new Error(`Blind input mismatch ${row.questionUid}`);
const receipt = { schemaVersion: 'm1-difficulty-freeze-receipt-v1', batchNo, sourceArchiveFile: exam.sourceArchiveFile, frozenAt: new Date().toISOString(), inputSha256: sha(inputBytes), blindLedgerSha256: sha(outputBytes), questionCount: outputs.length, uniqueUidCount: new Set(outputs.map(x => x.questionUid)).size, legacyFieldsInBlindInputs: 0, legacyFieldsInBlindOutputs: 0, legacyCompareStarted: false };
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
