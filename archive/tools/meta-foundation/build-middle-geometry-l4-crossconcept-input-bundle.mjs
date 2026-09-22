import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Source from '../../archive2-source.js';

const ROOT = process.cwd();
const dir = path.join(ROOT, 'archive/data/meta-foundation/evidence/middle-geometry/v1');
const l3Path = path.join(dir, 'l3_semantic_final_928.json');
const outPath = path.join(dir, 'l4_crossconcept_decision_input_bundle_928.json');

const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const digestText = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => value.replace(/\r\n/g, '\n');
const l3 = readJson(l3Path);
const banks = new Map();
const sourceFileSha = new Map();
const failures = [];
for (const row of l3.records) {
  if (banks.has(row.sourceArchiveFile)) continue;
  try {
    const relative = path.join('archive/exams', row.sourceArchiveFile);
    const raw = normalize(fs.readFileSync(relative, 'utf8'));
    sourceFileSha.set(row.sourceArchiveFile, digestText(raw));
    banks.set(row.sourceArchiveFile, Source.evaluate(raw, row.sourceArchiveFile));
  } catch (error) {
    failures.push({sourceArchiveFile: row.sourceArchiveFile, error: String(error)});
  }
}
const records = [];
for (const row of l3.records) {
  const bank = banks.get(row.sourceArchiveFile);
  const question = bank?.[row.sourceOrdinal - 1];
  if (!question) {
    failures.push({questionUid: row.questionUid, error: 'missing source ordinal'});
    continue;
  }
  const sourceFingerprint = await Source.fingerprint(question);
  if (sourceFingerprint !== row.sourceFingerprint) {
    failures.push({questionUid: row.questionUid, expected: row.sourceFingerprint, actual: sourceFingerprint});
    continue;
  }
  const content = question.content ?? null;
  const choices = Array.isArray(question.choices) ? question.choices : null;
  const answer = question.answer ?? null;
  const solution = question.solution ?? null;
  const contentHash = digestText(JSON.stringify(content));
  const solutionHash = digestText(JSON.stringify(solution));
  const inputBundleSha = digestText(JSON.stringify({
    questionUid: row.questionUid,
    sourceArchiveFile: row.sourceArchiveFile,
    sourceOrdinal: row.sourceOrdinal,
    sourceQuestionNo: row.sourceQuestionNo,
    sourceFingerprint,
    contentHash,
    solutionHash,
    problemTypeKey: row.problemTypeKey
  }));
  records.push({
    questionUid: row.questionUid,
    grade: row.grade,
    sourceArchiveFile: row.sourceArchiveFile,
    sourceOrdinal: row.sourceOrdinal,
    sourceQuestionNo: row.sourceQuestionNo,
    sourceFingerprint,
    contentHash,
    solutionHash,
    inputBundleSha,
    problemTypeKey: row.problemTypeKey,
    sourceReadStatus: 'SOURCE_AND_SOLUTION_READ',
    semanticReviewStatus: 'READY_FOR_ISOLATED_SEMANTIC_DECISION'
  });
}
if (failures.length) {
  throw new Error(JSON.stringify({failureCount: failures.length, failures: failures.slice(0, 10)}, null, 2));
}
const doc = {
  schemaVersion: 'middle-geometry-l4-crossconcept-decision-input-bundle-v1',
  status: 'SOURCE_AND_SOLUTION_INPUT_FROZEN',
  authority: {
    l3Parent: 'l3_semantic_final_928.json',
    source: 'archive/exams current source JS',
    excludedInputs: [
      'item_level_assignment_928.json',
      'l3_l4_semantic_freeze_928.json',
      'relational_metadata_freeze_928.json',
      'candidate templateKey',
      'candidate crossConceptKeys',
      'heuristic hints',
      'previous verdicts'
    ]
  },
  denominator: {total: records.length, mapped: records.filter(r => r.problemTypeKey !== null).length, routeOut: records.filter(r => r.problemTypeKey === null).length},
  sourceFiles: sourceFileSha,
  records
};
fs.writeFileSync(outPath, JSON.stringify(doc, null, 2) + '\n');
console.log(JSON.stringify({outPath, rows: records.length, mapped: doc.denominator.mapped, routeOut: doc.denominator.routeOut, sourceFiles: sourceFileSha.size, inputBundleHash: digestText(fs.readFileSync(outPath, 'utf8'))}, null, 2));
