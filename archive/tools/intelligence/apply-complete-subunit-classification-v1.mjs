import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const classificationPath = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-classification-v1.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const outputPath = path.join(outputDir, 'archive-complete-subunit-production-apply-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function writeTextWithRetry(filePath, value) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      fs.writeFileSync(filePath, value, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      // Windows occasionally reports a transient UNKNOWN/sharing error while
      // an archive file is being scanned by an editor/antivirus. Give the
      // handle a short chance to clear before failing the whole batch.
      if (attempt < 11) {
        const wait = new Int32Array(new SharedArrayBuffer(4));
        Atomics.wait(wait, 0, 0, 150);
      }
    }
  }
  throw lastError;
}

function loadQuestionBank(source, file) {
  const context = { window: {}, console };
  vm.runInNewContext(source, context, { timeout: 2000, filename: file });
  if (!Array.isArray(context.window.questionBank)) throw new Error(`questionBank missing: ${file}`);
  return context.window.questionBank;
}

function replaceQuestionBank(source, enriched, file) {
  const assignment = /window\.questionBank\s*=/.exec(source);
  if (!assignment) throw new Error(`questionBank assignment missing: ${file}`);
  const expressionStart = assignment.index + assignment[0].length;
  let start = expressionStart;
  while (/\s/.test(source[start] || '')) start += 1;
  if (source[start] !== '[') throw new Error(`questionBank is not an array literal: ${file}`);
  let depth = 0;
  let quote = '';
  let escaped = false;
  let end = -1;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (character === '\\') { escaped = true; continue; }
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'" || character === '`') { quote = character; continue; }
    if (character === '[') depth += 1;
    else if (character === ']') {
      depth -= 1;
      if (depth === 0) { end = index; break; }
    }
  }
  if (end < 0) throw new Error(`questionBank array end missing: ${file}`);
  return `${source.slice(0, start)}${JSON.stringify(enriched, null, 2)}${source.slice(end + 1)}`;
}

export function applyCompleteSubunitClassificationV1() {
  const report = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
  const grouped = new Map();
  for (const record of report.records) {
    if (!/^(original|similar|types)\//.test(record.sourceArchiveFile)) throw new Error(`unsupported archive source in production apply: ${record.sourceArchiveFile}`);
    if (!grouped.has(record.sourceArchiveFile)) grouped.set(record.sourceArchiveFile, []);
    grouped.get(record.sourceArchiveFile).push(record);
  }
  const files = [];
  let updatedQuestions = 0;
  for (const [relativeFile, records] of grouped.entries()) {
    const filePath = path.join(archiveDir, 'exams', relativeFile);
    const before = fs.readFileSync(filePath, 'utf8');
    const questions = loadQuestionBank(before, relativeFile);
    if (questions.length !== records.length) throw new Error(`question count mismatch ${relativeFile}: ${questions.length} vs ${records.length}`);
    const enriched = questions.map((question, index) => {
      const record = records[index];
      return {
        ...question,
        subUnitKey: record.classification.subUnitKey,
        subUnit: record.classification.subUnit,
        subUnitConfidence: record.classification.confidence,
        subUnitClassificationDepth: record.classification.classificationDepth
      };
    });
    const metadataChanged = questions.some((question, index) => {
      const record = records[index];
      return question.subUnitKey !== record.classification.subUnitKey
        || question.subUnit !== record.classification.subUnit
        || question.subUnitConfidence !== record.classification.confidence
        || question.subUnitClassificationDepth !== record.classification.classificationDepth;
    });
    const after = metadataChanged ? replaceQuestionBank(before, enriched, relativeFile) : before;
    if (metadataChanged) writeTextWithRetry(filePath, after);
    const validated = loadQuestionBank(after, relativeFile);
    if (validated.length !== questions.length) throw new Error(`post-write question count mismatch ${relativeFile}`);
    const missing = validated.filter(question => !question.subUnitKey || !question.subUnit).length;
    if (missing) throw new Error(`post-write subunit missing in ${relativeFile}: ${missing}`);
    files.push({ sourceArchiveFile: relativeFile, questionCount: validated.length, metadataChanged, beforeDigest: sha256(before), afterDigest: sha256(after) });
    updatedQuestions += validated.length;
  }
  const stable = {
    schemaVersion: 'archive-complete-subunit-production-apply-v1',
    sourceClassificationDigest: report.digest,
    productionWriteAllowed: true,
    writes: { originalJs: true, master: false, database: false, questionIndex: false, commit: false, push: false },
    totals: { sourceFiles: files.length, updatedQuestions, expectedQuestions: report.totals.records, missingSubUnitKeysAfterWrite: 0 },
    gates: { sourceFilesUpdated: files.length > 0, questionCountMatches: updatedQuestions === report.totals.records, allSubUnitsNonEmpty: true, noDatabaseOrIndexWrites: true, commitOrPush: false },
    files
  };
  if (updatedQuestions !== report.totals.records) throw new Error(`updated question count mismatch: ${updatedQuestions}`);
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const output = applyCompleteSubunitClassificationV1();
  fs.mkdirSync(outputDir, { recursive: true });
  writeTextWithRetry(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: output.digest, totals: output.totals, gates: output.gates }, null, 2));
}
