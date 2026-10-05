import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: build-middle1-ab-comparison.mjs <1..31>');
const batchDir = path.join(root, exam.artifactPath);
const readJson = name => JSON.parse(fs.readFileSync(path.join(batchDir, name), 'utf8'));
const readJsonl = name => fs.readFileSync(path.join(batchDir, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const plan = readJson('AB_COMPARISON_PLAN.json');
const input = readJsonl('INPUT_BUNDLE.jsonl');
const a = readJsonl('LUNA_A.jsonl');
const b = readJsonl('LUNA_B.jsonl');
if (plan.denominator !== input.length || a.length !== input.length || b.length !== input.length) throw new Error('A/B denominator mismatch');
const conflictByOrdinal = new Map(plan.conflicts.map(x => [x.sourceOrdinal, x]));
const nameOnly = new Set(plan.nameOnlyOrEquivalentOrdinals);
if (new Set([...conflictByOrdinal.keys(), ...nameOnly]).size !== input.length) throw new Error('Comparison plan incomplete or overlapping');
const aByUid = new Map(a.map(x => [x.questionUid, x]));
const bByUid = new Map(b.map(x => [x.questionUid, x]));
const fields = ['standardUnitKey', 'subUnitKey', 'primaryMethod', 'decisiveStep', 'problemTypeKey', 'templateKey', 'crossConceptKeys', 'reviewStatus'];
const rows = input.map(source => {
  const left = aByUid.get(source.questionUid);
  const right = bByUid.get(source.questionUid);
  if (!left || !right) throw new Error(`Missing A/B row ${source.questionUid}`);
  for (const row of [left, right]) if (row.inputBundleSha !== source.inputBundleSha || row.sourceFingerprint !== source.sourceFingerprint) throw new Error(`A/B provenance mismatch ${source.questionUid}`);
  const differences = fields.filter(field => JSON.stringify(left[field]) !== JSON.stringify(right[field]));
  const conflict = conflictByOrdinal.get(source.sourceOrdinal);
  return {
    questionUid: source.questionUid,
    sourceArchiveFile: source.sourceArchiveFile,
    sourceOrdinal: source.sourceOrdinal,
    inputBundleSha: source.inputBundleSha,
    comparedFields: fields,
    differingFields: differences,
    semanticStatus: conflict ? 'ACTUAL_CONFLICT_C_REQUIRED' : 'SEMANTIC_EQUIVALENCE_WITH_CANDIDATE_NAME_DIFFERENCE',
    comparisonReason: conflict?.reason || 'Same mathematical goal and decisive method after semantic reading; proposed key wording differs. Relational differences, if any, remain for root gate.',
    rootGateDifferences: plan.rootGateDifferencesOutsideCTrigger.filter(x => x.sourceOrdinal === source.sourceOrdinal)
  };
});
const conflictInput = input.filter(x => conflictByOrdinal.has(x.sourceOrdinal));
if (conflictInput.length !== plan.conflicts.length || new Set(conflictInput.map(x => x.questionUid)).size !== conflictInput.length) throw new Error('Conflict subset mismatch');
fs.writeFileSync(path.join(batchDir, 'AB_COMPARISON.jsonl'), rows.map(JSON.stringify).join('\n') + '\n');
fs.writeFileSync(path.join(batchDir, 'CONFLICT_INPUT.jsonl'), conflictInput.map(JSON.stringify).join('\n') + '\n');
console.log(JSON.stringify({ batchNo, compared: rows.length, actualConflictCount: conflictInput.length, semanticEquivalentCount: rows.length - conflictInput.length, conflictOrdinals: conflictInput.map(x => x.sourceOrdinal) }, null, 2));
