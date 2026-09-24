import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation/M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: build-middle1-source-quality.mjs <1..31>');
const dir = path.join(root, exam.artifactPath);
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'SOURCE_QUALITY_PLAN.json'), 'utf8'));
const consensus = fs.readFileSync(path.join(dir, 'CONSENSUS.jsonl'), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
if (consensus.length !== exam.questionRowCount || plan.denominator !== consensus.length) throw new Error('Source-quality denominator mismatch');
const overrides = new Map(plan.overrides.map(x => [x.sourceOrdinal, x]));
const sourceAnswerHold = new Set(plan.sourceAnswerHoldOrdinals);
const rows = consensus.map(x => {
  const override = overrides.get(x.sourceOrdinal);
  const sourceAnswerDefect = sourceAnswerHold.has(x.sourceOrdinal);
  return {
    questionUid: x.questionUid,
    sourceArchiveFile: x.sourceArchiveFile,
    sourceOrdinal: x.sourceOrdinal,
    sourceFingerprint: x.sourceFingerprint,
    issueType: override?.issueType || plan.defaultIssueType,
    issueReason: override?.reason || x.sourceIssue,
    disposition: sourceAnswerDefect ? 'SOURCE_BLOCKED' : plan.defaultDisposition,
    semanticMappingStatus: x.reviewStatus,
    metadataWritebackAllowed: !sourceAnswerDefect,
    runtimeSelectableBeforeRepair: false
  };
});
if (new Set(rows.map(x => x.questionUid)).size !== rows.length) throw new Error('Source-quality duplicate UID');
fs.writeFileSync(path.join(dir, 'SOURCE_QUALITY.jsonl'), rows.map(JSON.stringify).join('\n') + '\n');
console.log(JSON.stringify({ batchNo, rows: rows.length, sourceBlocked: rows.filter(x => x.disposition === 'SOURCE_BLOCKED').length, solutionRepairRequired: rows.filter(x => x.disposition === 'SOLUTION_REPAIR_REQUIRED').length }, null, 2));
