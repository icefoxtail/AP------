import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const phaseDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const reviewPath = path.join(phaseDir, 'archive-complete-subunit-exception-review-v1.json');
const outputPath = path.join(phaseDir, 'archive-complete-subunit-exception-apply-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function writeTextWithRetry(filePath, value) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try { fs.writeFileSync(filePath, value, 'utf8'); return; } catch (error) {
      lastError = error;
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
  let depth = 0; let quote = ''; let escaped = false; let end = -1;
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
    else if (character === ']') { depth -= 1; if (depth === 0) { end = index; break; } }
  }
  if (end < 0) throw new Error(`questionBank array end missing: ${file}`);
  return `${source.slice(0, start)}${JSON.stringify(enriched, null, 2)}${source.slice(end + 1)}`;
}

const METADATA_FIELDS = new Set(['standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth']);
function withoutMetadata(question) {
  return Object.fromEntries(Object.entries(question).filter(([key]) => !METADATA_FIELDS.has(key)));
}

export function applyCompleteSubunitExceptionReviewV1() {
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  const promotions = review.review.filter(item => item.decision === 'promote');
  const retained = review.review.filter(item => item.decision === 'retain_exception');
  if (![0, 1].includes(promotions.length) || retained.length !== 0) throw new Error(`unexpected review dispositions: ${promotions.length}/${retained.length}`);
  const cumulativePromotedQuestions = Number(review.cumulativeTotals?.formalPromotions || (195 + promotions.length));
  const grouped = new Map();
  for (const item of promotions) {
    if (!grouped.has(item.sourceArchiveFile)) grouped.set(item.sourceArchiveFile, []);
    grouped.get(item.sourceArchiveFile).push(item);
  }
  const files = [];
  let updatedQuestions = 0;
  for (const [relativeFile, items] of grouped.entries()) {
    const filePath = path.join(archiveDir, 'exams', relativeFile);
    const before = fs.readFileSync(filePath, 'utf8');
    const questions = loadQuestionBank(before, relativeFile);
    const enriched = questions.map((question, index) => {
      const item = items.find(candidate => candidate.sourceOrdinal === index + 1);
      if (!item) return question;
      if (question.standardUnitKey !== item.originalStandardUnitKey || question.standardUnit !== item.originalStandardUnit) {
        throw new Error(`source metadata changed before apply: ${relativeFile}#${index + 1}`);
      }
      return {
        ...question,
        standardUnitKey: item.candidateStandardUnitKey,
        standardUnit: item.candidateStandardUnit,
        subUnitKey: item.candidateSubUnitKey,
        subUnit: item.candidateSubUnit,
        subUnitConfidence: 'candidate_evidence',
        subUnitClassificationDepth: 'complete_candidate'
      };
    });
    const changed = enriched.filter((question, index) => JSON.stringify(question) !== JSON.stringify(questions[index])).length;
    if (changed !== items.length) throw new Error(`changed question count mismatch: ${relativeFile} ${changed}/${items.length}`);
    const beforePayload = JSON.stringify(questions.map(withoutMetadata));
    const after = replaceQuestionBank(before, enriched, relativeFile);
    const validated = loadQuestionBank(after, relativeFile);
    const afterPayload = JSON.stringify(validated.map(withoutMetadata));
    if (beforePayload !== afterPayload) throw new Error(`non-metadata content changed: ${relativeFile}`);
    if (validated.length !== questions.length) throw new Error(`post-write question count mismatch: ${relativeFile}`);
    writeTextWithRetry(filePath, after);
    files.push({ sourceArchiveFile: relativeFile, promotedQuestions: items.length, questionCount: validated.length, beforeDigest: sha256(before), afterDigest: sha256(after) });
    updatedQuestions += items.length;
  }
  if (updatedQuestions !== promotions.length) throw new Error(`updated question count mismatch: ${updatedQuestions}`);
  const stable = {
    schemaVersion: 'archive-complete-subunit-exception-apply-v1', sourceReviewDigest: review.digest,
    writes: { originalJs: true, master: false, database: false, questionIndex: false, commit: false, push: false },
    priorApplyDigest: '8bdf58901e77c9a89eee5d7298385a55ecc25b16d476a9f28dbc60b34b61d09',
    totals: { sourceFiles: files.length, promotedQuestions: updatedQuestions, cumulativePromotedQuestions, retainedExceptions: retained.length, nonMetadataContentChanges: 0 },
    gates: { reviewDispositionValid: true, allPromotionsWritten: updatedQuestions === promotions.length, cumulativeReviewComplete: cumulativePromotedQuestions === 196, nonMetadataContentUnchanged: true, noDatabaseOrIndexWrites: true, commitOrPush: false },
    retained, files
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = applyCompleteSubunitExceptionReviewV1();
  fs.mkdirSync(phaseDir, { recursive: true });
  writeTextWithRetry(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
}
