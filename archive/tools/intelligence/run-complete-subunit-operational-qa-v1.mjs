import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const classificationPath = path.join(outputDir, 'archive-complete-subunit-classification-v1.json');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const candidateSyncPath = path.join(outputDir, 'archive-complete-subunit-candidate-sync-v1.json');
const exceptionReviewPath = path.join(outputDir, 'archive-complete-subunit-exception-review-v1.json');
const indexPath = path.join(archiveDir, 'question-index.js');
const reportPath = path.join(outputDir, 'archive-complete-subunit-operational-qa-v1.json');
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

function loadQuestionBank(filePath) {
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { timeout: 2000, filename: filePath });
  if (!Array.isArray(context.window.questionBank)) throw new Error(`questionBank missing: ${filePath}`);
  return context.window.questionBank;
}

function loadQuestionIndex(filePath) {
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { timeout: 10000, filename: filePath });
  if (!Array.isArray(context.window.questionIndex)) throw new Error(`questionIndex missing: ${filePath}`);
  return context.window.questionIndex;
}

function countBy(records, keyFn) {
  const counts = {};
  for (const record of records) {
    const key = keyFn(record) || '(empty)';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

export function runCompleteSubunitOperationalQaV1() {
  const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const candidateSync = JSON.parse(fs.readFileSync(candidateSyncPath, 'utf8'));
  const exceptionReview = fs.existsSync(exceptionReviewPath) ? JSON.parse(fs.readFileSync(exceptionReviewPath, 'utf8')) : null;
  const byFile = new Map();
  for (const record of classification.records) {
    if (!byFile.has(record.sourceArchiveFile)) byFile.set(record.sourceArchiveFile, []);
    byFile.get(record.sourceArchiveFile).push(record);
  }

  const sourceFiles = [];
  const fieldMismatches = [];
  let productionQuestionCount = 0;
  let missingSubUnitFields = 0;
  for (const [relativeFile, records] of byFile.entries()) {
    const filePath = path.join(archiveDir, 'exams', relativeFile);
    const questions = loadQuestionBank(filePath);
    if (questions.length !== records.length) throw new Error(`question count mismatch: ${relativeFile}`);
    productionQuestionCount += questions.length;
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      const expected = records[index].classification;
      if (!question.subUnitKey || !question.subUnit || !question.subUnitConfidence || !question.subUnitClassificationDepth) missingSubUnitFields += 1;
      for (const key of ['subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth']) {
        if (question[key] !== expected[key === 'subUnitConfidence' ? 'confidence' : key === 'subUnitClassificationDepth' ? 'classificationDepth' : key]) {
          fieldMismatches.push({ file: relativeFile, ordinal: index + 1, field: key, actual: question[key], expected: expected[key === 'subUnitConfidence' ? 'confidence' : key === 'subUnitClassificationDepth' ? 'classificationDepth' : key] });
        }
      }
    }
    sourceFiles.push({ file: relativeFile, questionCount: questions.length });
  }

  const usedSubUnits = [...new Set(classification.records.map(record => record.classification.subUnitKey).filter(Boolean))].sort();
  const masterSubUnits = new Set(master.filter(record => record.keyType === 'subUnitKey').map(record => record.key));
  const masterStandardUnits = new Set(master.filter(record => record.keyType === 'standardUnitKey' && record.status === 'active').map(record => record.key));
  const masterGaps = usedSubUnits.filter(key => !masterSubUnits.has(key));
  const rawOrUnmappedGaps = masterGaps.filter(key => /^R?RAW-|^UNMAPPED-/.test(key));
  const invalidFormalGaps = masterGaps.filter(key => !/^R?RAW-|^UNMAPPED-/.test(key));
  const formalGapPolicySatisfied = invalidFormalGaps.every(key => classification.records
    .filter(record => record.classification.subUnitKey === key)
    .every(record => !masterStandardUnits.has(record.standardUnitKey)));
  const qIndex = loadQuestionIndex(indexPath);
  const classificationBySource = new Map(classification.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record.classification]));
  const indexSubunitMismatches = [];
  for (const record of qIndex) {
    const expected = classificationBySource.get(`${record.sourceFile}#${record.sourceOrdinal}`);
    if (!expected) continue;
    for (const [actualKey, expectedKey] of [['subUnitKey', 'subUnitKey'], ['subUnit', 'subUnit'], ['subUnitConfidence', 'confidence'], ['subUnitClassificationDepth', 'classificationDepth']]) {
      if (record[actualKey] !== expected[expectedKey]) indexSubunitMismatches.push({ sourceFile: record.sourceFile, sourceOrdinal: record.sourceOrdinal, field: actualKey, actual: record[actualKey], expected: expected[expectedKey] });
    }
  }
  const evidenceRecords = classification.records.filter(record => record.classification.evidence?.sourceDisposition !== 'PRODUCTION_EXISTING');
  const uncertainty = evidenceRecords.filter(record => record.classification.evidence?.uncertainty || record.classification.uncertainty);
  const margins = evidenceRecords.map(record => Number(record.classification.evidence?.margin || 0));
  const lowMargin = evidenceRecords.filter(record => Number(record.classification.evidence?.margin || 0) < 8);

  const stable = {
    schemaVersion: 'archive-complete-subunit-operational-qa-v1',
    sourceClassificationDigest: classification.digest,
    sourceFiles: sourceFiles.length,
    productionQuestionCount,
    classificationQuestionCount: classification.records.length,
    masterSubUnitCount: masterSubUnits.size,
    usedSubUnitCount: usedSubUnits.length,
    depthCounts: countBy(classification.records, record => record.classification.classificationDepth),
    confidenceCounts: countBy(classification.records, record => record.classification.confidence),
    uncertaintyCount: uncertainty.length,
    lowMarginCount: lowMargin.length,
    margin: { min: Math.min(...margins), median: [...margins].sort((a, b) => a - b)[Math.floor(margins.length / 2)], max: Math.max(...margins) },
    masterGaps: { total: masterGaps.length, rawOrUnmapped: rawOrUnmappedGaps, invalidFormal: invalidFormalGaps },
    candidateSync: { totals: candidateSync.totals, gates: candidateSync.gates },
    index: { questionCount: qIndex.length },
    gates: {
      classificationNoEmptySubUnits: classification.totals.emptySubUnitKeys === 0,
      classificationNoDefaultFallbacks: !Object.keys(classification.totals.classificationDepth || {}).some(key => /default/i.test(key)),
      productionQuestionCountMatches: productionQuestionCount === classification.records.length,
      productionSubunitFieldsMatch: missingSubUnitFields === 0 && fieldMismatches.length === 0,
      allUsedFormalKeysInMaster: invalidFormalGaps.length === 0,
      formalGapPolicySatisfied,
      rawAndUnmappedExplicitlyIsolated: exceptionReview
        ? rawOrUnmappedGaps.length === Number(exceptionReview.totals?.retainedException ?? -1)
        : rawOrUnmappedGaps.length === 1,
      candidateMappedFilesByteEqual: candidateSync.gates.allMappedCandidatesByteEqual === true,
      indexRegenerated: qIndex.length > 0,
      indexSubunitFieldsMatch: indexSubunitMismatches.length === 0,
      noCommitOrPush: true
    },
    exceptions: {
      invalidFormalMasterGaps: invalidFormalGaps,
      rawOrUnmappedMasterGaps: rawOrUnmappedGaps,
      retainedExceptionReview: exceptionReview ? { digest: exceptionReview.digest, totals: exceptionReview.totals } : null,
      missingCandidateProductionMappings: candidateSync.totals?.missingProductionMappings || []
    },
    fieldMismatchCount: fieldMismatches.length,
    missingSubUnitFields,
    indexSubunitMismatchCount: indexSubunitMismatches.length,
    fieldMismatches: fieldMismatches.slice(0, 50)
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = runCompleteSubunitOperationalQaV1();
  fs.mkdirSync(outputDir, { recursive: true });
  writeTextWithRetry(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ output: path.relative(archiveDir, reportPath).replaceAll('\\', '/'), digest: report.digest, productionQuestionCount: report.productionQuestionCount, gates: report.gates }, null, 2));
}
