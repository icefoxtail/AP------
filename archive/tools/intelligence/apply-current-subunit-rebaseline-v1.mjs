import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/**
 * Apply the 2026-08-24 current-baseline sub-unit decisions to the seven
 * production files that were outside the frozen pilot snapshot.  This tool
 * changes only the four sub-unit metadata fields and emits an auditable
 * question-level ledger; it does not touch DB, question-index, identity, or
 * candidate files.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const outputPath = path.join(outputDir, 'archive-current-subunit-manual-rebaseline-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const metadataFields = new Set(['subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth']);

const assignments = {
  'original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js': [
    'H15-SB-01-SET_BASIC', 'H15-SB-02-NECESSARY_SUFFICIENT', 'H15-SB-04-RATIONAL_GRAPH',
    'H15-SB-05-IRRATIONAL_GRAPH', 'H15-SB-06-COUNTING_PRINCIPLE', 'H15-SB-07-PERMUTATION_BASIC',
    'H15-SB-07-PERMUTATION_RESTRICTED', 'H15-SB-08-COMBINATION_APPLICATION',
    'H15-SB-07-PERMUTATION_RESTRICTED', 'H15-SB-01-SET_COUNT', 'H15-SB-03-COMPOSITE_FUNCTION',
    'H15-SB-04-RATIONAL_GRAPH', 'H15-SB-05-IRRATIONAL_GRAPH', 'H15-SB-03-FUNCTION_RELATION',
    'H15-SB-07-PERMUTATION_RESTRICTED', 'H15-SB-04-RATIONAL_APPLICATION',
    'H15-SB-04-RATIONAL_APPLICATION', 'H15-SB-06-COUNTING_APPLICATION',
    'H15-SB-06-COUNTING_APPLICATION', 'H15-SB-08-COMBINATION_APPLICATION',
    'H15-SB-07-PERMUTATION_RESTRICTED', 'H15-SB-04-RATIONAL_GRAPH', 'H15-SB-03-INVERSE_FUNCTION',
    'H15-SB-07-PERMUTATION_RESTRICTED', 'H15-SB-03-FUNCTION_RELATION',
    'H15-SB-07-PERMUTATION_RESTRICTED', 'H15-SB-05-IRRATIONAL_GRAPH',
    'H15-SB-04-RATIONAL_APPLICATION', 'H15-SB-05-IRRATIONAL_GRAPH'
  ],
  'original/high/h2/2final/25_강남여고_2학기_기말_고2_수학II.js': [
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-08-DEFINITE_INTEGRAL',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-07-INDEFINITE_INTEGRAL',
    'H15-M2-09-INTEGRAL_APPLICATION', 'H15-M2-06-DERIVATIVE_APPLICATION',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-09-INTEGRAL_APPLICATION',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-06-DERIVATIVE_APPLICATION',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-09-INTEGRAL_APPLICATION',
    'H15-M2-09-INTEGRAL_APPLICATION', 'H15-M2-08-DEFINITE_INTEGRAL',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-06-DERIVATIVE_APPLICATION',
    'H15-M2-08-DEFINITE_INTEGRAL', 'H15-M2-03-DERIVATIVE_DEFINITION',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-06-DERIVATIVE_APPLICATION',
    'H15-M2-08-DEFINITE_INTEGRAL', 'H15-M2-05-TANGENT',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-08-DEFINITE_INTEGRAL',
    'H15-M2-07-INDEFINITE_INTEGRAL'
  ],
  'original/high/h2/2mid/22_순천고_2학기_중간_고2_수학II.js': [
    'H15-M2-01-LIMIT', 'H15-M2-01-LIMIT', 'H15-M2-01-LIMIT',
    'H15-M2-03-DERIVATIVE_DEFINITION', 'H15-M2-03-DERIVATIVE_DEFINITION',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-01-LIMIT', 'H15-M2-01-LIMIT',
    'H15-M2-02-CONTINUITY', 'H15-M2-05-TANGENT', 'H15-M2-05-TANGENT',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-01-LIMIT', 'H15-M2-02-CONTINUITY',
    'H15-M2-03-DERIVATIVE_DEFINITION', 'H15-M2-01-LIMIT', 'H15-M2-02-CONTINUITY',
    'H15-M2-03-DERIVATIVE_DEFINITION', 'H15-M2-06-DERIVATIVE_APPLICATION',
    'H15-M2-04-DERIVATIVE', 'H15-M2-02-CONTINUITY', 'H15-M2-05-TANGENT'
  ],
  'original/high/h2/2mid/22_팔마고_2학기_중간_고2_수학II.js': [
    'H15-M2-01-LIMIT', 'H15-M2-01-LIMIT', 'H15-M2-02-CONTINUITY',
    'H15-M2-06-DERIVATIVE_APPLICATION', 'H15-M2-03-DERIVATIVE_DEFINITION',
    'H15-M2-04-DERIVATIVE', 'H15-M2-06-DERIVATIVE_APPLICATION',
    'H15-M2-01-LIMIT', 'H15-M2-01-LIMIT', 'H15-M2-02-CONTINUITY',
    'H15-M2-02-CONTINUITY', 'H15-M2-03-DERIVATIVE_DEFINITION', 'H15-M2-04-DERIVATIVE',
    'H15-M2-05-TANGENT', 'H15-M2-03-DERIVATIVE_DEFINITION',
    'H15-M2-03-DERIVATIVE_DEFINITION', 'H15-M2-06-DERIVATIVE_APPLICATION',
    'H15-M2-02-CONTINUITY', 'H15-M2-03-DERIVATIVE_DEFINITION', 'H15-M2-05-TANGENT',
    'H15-M2-02-CONTINUITY', 'H15-M2-03-DERIVATIVE_DEFINITION'
  ],
  'similar/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js': [
    'H22-C2-05-CORE', 'H22-C2-01-COORDINATE_METRIC', 'H22-C2-01-COORDINATE_METRIC',
    'H22-C2-05-CORE', 'H22-C2-05-CORE', 'H22-C2-04-CORE', 'H22-C2-04-CORE',
    'H22-C2-01-COORDINATE_METRIC', 'H22-C2-01-COORDINATE_METRIC', 'H22-C2-02-RELATION',
    'H22-C2-05-CORE', 'H22-C2-02-LINE_EQUATION', 'H22-C2-02-LINE_EQUATION',
    'H22-C2-03-CIRCLE_EQUATION', 'H22-C2-04-CORE', 'H22-C2-05-CORE',
    'H22-C2-03-INTERSECTION', 'H22-C2-04-CORE', 'H22-C2-02-LINE_EQUATION',
    'H22-C2-02-LINE_EQUATION', 'H22-C2-03-TANGENT'
  ],
  'similar/high/h1/2mid/25_제일고_2학기_중간_고1_유사문제.js': [
    'H22-C2-05-CORE', 'H22-C2-07-FUNCTION_BASIC', 'H22-C2-05-CORE', 'H22-C2-05-CORE',
    'H22-C2-05-CORE', 'H22-C2-05-CORE', 'H22-C2-05-CORE', 'H22-C2-05-CORE',
    'H22-C2-07-FUNCTION_BASIC', 'H22-C2-01-COORDINATE_METRIC',
    'H22-C2-01-COORDINATE_METRIC', 'H22-C2-02-LINE_EQUATION', 'H22-C2-03-TANGENT',
    'H22-C2-02-RELATION', 'H22-C2-02-LINE_EQUATION', 'H22-C2-03-CIRCLE_EQUATION',
    'H22-C2-03-CIRCLE_EQUATION', 'H22-C2-04-CORE', 'H22-C2-07-FUNCTION_BASIC',
    'H22-C2-01-COORDINATE_METRIC', 'H22-C2-05-CORE', 'H22-C2-03-CIRCLE_EQUATION'
  ],
  'similar/high/h1/2mid/25_효천고_2학기_중간_고1_유사문제.js': [
    'H22-C2-01-COORDINATE_METRIC', 'H22-C2-02-RELATION', 'H22-C2-03-CIRCLE_EQUATION',
    'H22-C2-03-TANGENT', 'H22-C2-05-CORE', 'H22-C2-03-CIRCLE_EQUATION',
    'H22-C2-02-RELATION', 'H22-C2-02-LINE_EQUATION', 'H22-C2-05-CORE',
    'H22-C2-05-CORE', 'H22-C2-03-INTERSECTION', 'H22-C2-04-CORE', 'H22-C2-04-CORE',
    'H22-C2-01-GEOMETRY_RELATION', 'H22-C2-05-CORE', 'H22-C2-05-CORE',
    'H22-C2-04-CORE', 'H22-C2-04-CORE', 'H22-C2-04-CORE', 'H22-C2-05-CORE',
    'H22-C2-01-GEOMETRY_RELATION', 'H22-C2-03-TANGENT', 'H22-C2-04-CORE'
  ]
};

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

function withoutMetadata(question) {
  return Object.fromEntries(Object.entries(question).filter(([key]) => !metadataFields.has(key)));
}

function excerpt(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 280);
}

export function applyCurrentSubunitRebaselineV1() {
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const masterByKey = new Map(master
    .filter(row => row.status === 'active' && row.subUnitKey)
    .map(row => [row.subUnitKey, row]));
  const files = [];
  const review = [];
  let updatedQuestions = 0;
  const expectedFiles = Object.keys(assignments).sort((a, b) => a.localeCompare(b, 'en'));
  for (const relativeFile of expectedFiles) {
    const filePath = path.join(archiveDir, 'exams', relativeFile);
    const before = fs.readFileSync(filePath, 'utf8');
    const questions = loadQuestionBank(before, relativeFile);
    const keys = assignments[relativeFile];
    if (questions.length !== keys.length) throw new Error(`question count mismatch ${relativeFile}: ${questions.length}/${keys.length}`);
    const enriched = questions.map((question, index) => {
      const subUnitKey = keys[index];
      const masterRow = masterByKey.get(subUnitKey);
      if (!masterRow) throw new Error(`active master sub-unit missing: ${subUnitKey}`);
      if (masterRow.standardUnitKey !== question.standardUnitKey) {
        throw new Error(`standard unit mismatch ${relativeFile}#${index + 1}: ${question.standardUnitKey}/${masterRow.standardUnitKey}`);
      }
      const ruleOnly = subUnitKey.endsWith('-CORE');
      const subUnit = masterRow.subUnit || masterRow.labelKo || subUnitKey;
      const confidence = ruleOnly ? 'rule_inferred' : 'category_or_cue_inferred';
      const classificationDepth = ruleOnly ? 'complete_rule' : 'complete_category';
      review.push({
        sourceArchiveFile: relativeFile,
        sourceOrdinal: index + 1,
        standardUnitKey: question.standardUnitKey,
        standardUnit: question.standardUnit,
        category: question.category || '',
        subUnitKey,
        subUnit,
        confidence,
        classificationDepth,
        evidence: {
          contentExcerpt: excerpt(question.content),
          answerExcerpt: excerpt(question.answer),
          solutionExcerpt: excerpt(question.solution),
          rationale: '현재 운영 JS의 문항별 표준단원·분류명·본문 단서를 대조한 2026-08-24 재기준 매핑'
        }
      });
      return { ...question, subUnitKey, subUnit, subUnitConfidence: confidence, subUnitClassificationDepth: classificationDepth };
    });
    const beforePayload = JSON.stringify(questions.map(withoutMetadata));
    const after = replaceQuestionBank(before, enriched, relativeFile);
    const validated = loadQuestionBank(after, relativeFile);
    const afterPayload = JSON.stringify(validated.map(withoutMetadata));
    if (beforePayload !== afterPayload) throw new Error(`non-metadata content changed: ${relativeFile}`);
    writeTextWithRetry(filePath, after);
    const changed = enriched.filter((question, index) => JSON.stringify(question) !== JSON.stringify(questions[index])).length;
    if (changed !== questions.length) throw new Error(`expected every target question to receive metadata: ${relativeFile}`);
    files.push({ sourceArchiveFile: relativeFile, questionCount: questions.length, updatedQuestions: changed, beforeDigest: sha256(before), afterDigest: sha256(after) });
    updatedQuestions += changed;
  }
  const stable = {
    schemaVersion: 'archive-current-subunit-manual-rebaseline-v1',
    baseline: 'current-operational-js-2026-08-24',
    productionWriteAllowed: true,
    writes: { targetProductionJs: true, otherProductionJs: false, master: false, database: false, questionIndex: false, identity: false, commit: false, push: false },
    totals: { sourceFiles: files.length, updatedQuestions, expectedQuestions: 164, reviewRows: review.length },
    gates: { expectedFiles: files.length === 7, expectedQuestionCount: updatedQuestions === 164, masterKeysActive: true, onlyMetadataFieldsChanged: true, noDbIndexIdentityWrites: true, commitOrPush: false },
    files,
    review
  };
  if (updatedQuestions !== 164 || review.length !== 164) throw new Error(`rebaseline total mismatch: ${updatedQuestions}/${review.length}`);
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = applyCurrentSubunitRebaselineV1();
  fs.mkdirSync(outputDir, { recursive: true });
  writeTextWithRetry(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
}
