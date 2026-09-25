import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: freeze-middle1-difficulty-input.mjs <1..31>');
const batchDir = path.join(root, exam.artifactPath);
const outPath = path.join(batchDir, 'DIFFICULTY_INPUT.jsonl');
if (fs.existsSync(outPath)) throw new Error('Difficulty input already frozen');
const readJsonl = name => fs.readFileSync(path.join(batchDir, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const source = readJsonl('INPUT_BUNDLE.jsonl');
const consensus = readJsonl('CONSENSUS.jsonl');
if (source.length !== exam.questionRowCount || consensus.length !== source.length) throw new Error('Semantic consensus must cover whole exam before difficulty');
const byUid = new Map(consensus.map(x => [x.questionUid, x]));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const records = source.map(x => {
  const c = byUid.get(x.questionUid);
  if (!c || c.inputBundleSha !== x.inputBundleSha) throw new Error(`Consensus provenance mismatch ${x.questionUid}`);
  const row = {
    questionUid: x.questionUid, sourceArchiveFile: x.sourceArchiveFile, sourceOrdinal: x.sourceOrdinal,
    sourceFingerprint: x.sourceFingerprint, inputBundleSha: x.inputBundleSha,
    contentHash: x.contentHash, solutionHash: x.solutionHash,
    content: x.content, choices: x.choices, answer: x.answer, solution: x.solution, images: x.images,
    semanticContext: {
      standardUnitKey: c.standardUnitKey, subUnitKey: c.subUnitKey,
      primaryMethod: c.primaryMethod, decisiveStep: c.decisiveStep,
      problemTypeKey: c.problemTypeKey, templateKey: c.templateKey,
      crossConceptKeys: c.crossConceptKeys, conditionKeys: c.conditionKeys,
      integrationPattern: c.integrationPattern, reviewStatus: c.reviewStatus,
      sourceIssue: c.sourceIssue
    },
    inputFieldInventory: ['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceFingerprint', 'inputBundleSha', 'contentHash', 'solutionHash', 'content', 'choices', 'answer', 'solution', 'images', 'semanticContext']
  };
  row.blindInputSha = sha(JSON.stringify(row));
  if ('level' in row || 'difficultyBucket' in row || 'legacyLevel' in row || row.inputFieldInventory.some(f => /level|difficultyBucket|legacy/i.test(f))) throw new Error(`Legacy leakage ${x.questionUid}`);
  return row;
});
fs.writeFileSync(outPath, records.map(JSON.stringify).join('\n') + '\n');
console.log(JSON.stringify({ batchNo, rows: records.length, uidUnique: new Set(records.map(x => x.questionUid)).size, legacyFields: 0, path: outPath }, null, 2));
