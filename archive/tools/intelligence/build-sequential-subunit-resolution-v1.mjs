import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const phase3Dir = path.join(archiveDir, '_generated/intelligence/phase3');
const classificationPath = path.join(phase3Dir, 'fallback-safety-audit/archive-hierarchical-classification-with-fallback-overlay-v1.json');
const coveragePath = path.join(phase3Dir, 'coverage-queue/archive-subunit-coverage-all-progress-v1.json');
const coverageDir = path.join(phase3Dir, 'coverage-queue');
const outputDir = path.join(phase3Dir, 'sequential-subunit-resolution');
const outputPath = path.join(outputDir, 'archive-sequential-subunit-resolution-v1.json');
const summaryPath = path.join(outputDir, 'archive-sequential-subunit-resolution-v1.summary.md');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const sortBatchFiles = files => files
  .filter(file => /^archive-subunit-coverage-batch-\d{3}-adjudication-v1\.json$/.test(file))
  .sort((a, b) => Number(a.match(/batch-(\d{3})-/)[1]) - Number(b.match(/batch-(\d{3})-/)[1]));

function countBy(records, key) {
  const counts = {};
  for (const record of records) {
    const value = record[key] || 'UNSPECIFIED';
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function assertUnique(records, key, label) {
  const seen = new Set();
  const duplicates = [];
  for (const record of records) {
    const value = record[key];
    if (seen.has(value)) duplicates.push(value);
    seen.add(value);
  }
  if (duplicates.length) throw new Error(`${label} duplicate ${key}: ${duplicates.slice(0, 5).join(', ')}`);
}

function buildQueueResolution(record, classificationRecord) {
  const classification = classificationRecord?.classification ?? {};
  const unmapped = classification.classificationDepth === 'unmapped_standard_unit'
    || !record.standardUnitKey;
  let resolutionStatus;
  let resolutionOutcome;
  let resolvedSubUnitKey = '';
  let resolvedSubUnit = '';
  let resolutionRationale = record.rationale;

  if (unmapped) {
    resolutionStatus = 'UNMAPPED_STANDARD_UNIT_FALLBACK';
    resolutionOutcome = 'UNMAPPED_STANDARD_UNIT';
    resolutionRationale = `${record.rationale} 표준단원 키가 미매핑이므로 세부단원 후보는 참고값으로만 보존하고 해소값은 비워 둔다.`;
  } else if (record.disposition === 'PILOT_CANDIDATE') {
    resolutionStatus = 'SUBUNIT_CANDIDATE_NONPRODUCTION';
    resolutionOutcome = 'CANDIDATE_RETAINED_NONPRODUCTION';
    resolvedSubUnitKey = record.proposedSubUnitKey || '';
    resolvedSubUnit = record.proposedSubUnit || '';
  } else if (record.disposition === 'PILOT_REVIEW_REQUIRED') {
    resolutionStatus = 'STANDARD_UNIT_FALLBACK_REVIEW_REQUIRED';
    resolutionOutcome = 'STANDARD_UNIT_FALLBACK';
    resolutionRationale = `${record.rationale} 추가 경계 검수 전까지 표준단원 fallback으로 유지한다.`;
  } else if (record.disposition === 'EVIDENCE_MISSING_HOLD') {
    resolutionStatus = 'STANDARD_UNIT_FALLBACK_EVIDENCE_MISSING';
    resolutionOutcome = 'STANDARD_UNIT_FALLBACK';
    resolutionRationale = `${record.rationale} 근거 부족 상태를 명시적으로 보류한다.`;
  } else if (record.disposition === 'STANDARD_UNIT_FALLBACK') {
    resolutionStatus = 'STANDARD_UNIT_FALLBACK';
    resolutionOutcome = 'STANDARD_UNIT_FALLBACK';
  } else {
    throw new Error(`unsupported coverage disposition: ${record.disposition}`);
  }

  return {
    recordScope: 'SEQUENTIAL_QUEUE',
    reviewOrder: record.reviewOrder,
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceArchiveFile,
    sourceOrdinal: record.sourceOrdinal,
    standardUnitKey: classification.standardUnitKey || record.standardUnitKey || '',
    standardUnit: classification.standardUnit || record.standardUnit || '',
    classificationDepth: classification.classificationDepth || 'unavailable',
    candidateSubUnitKey: record.proposedSubUnitKey || '',
    candidateSubUnit: record.proposedSubUnit || '',
    resolvedSubUnitKey,
    resolvedSubUnit,
    resolutionStatus,
    resolutionOutcome,
    resolutionRationale,
    disposition: record.disposition,
    semanticStatus: record.semanticStatus,
    contentCueHits: record.contentCueHits ?? [],
    solutionCueHits: record.solutionCueHits ?? [],
    independentSupport: record.independentSupport ?? false,
    candidateEvidenceRetained: Boolean(record.proposedSubUnitKey),
    productionWriteAllowed: false
  };
}

function buildExistingResolution(record) {
  const classification = record.classification ?? {};
  if (!classification.subUnitKey) throw new Error(`existing record has no subUnitKey: ${record.questionUid}`);
  if (!['documented_template', 'single_documented_subunit'].includes(classification.classificationDepth)) {
    throw new Error(`existing record has unsupported depth: ${record.questionUid}`);
  }
  return {
    recordScope: 'EXISTING_SUBUNIT',
    reviewOrder: null,
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceArchiveFile,
    sourceOrdinal: record.sourceOrdinal,
    standardUnitKey: record.standardUnitKey || classification.standardUnitKey || '',
    standardUnit: record.standardUnit || classification.standardUnit || '',
    classificationDepth: classification.classificationDepth,
    candidateSubUnitKey: '',
    candidateSubUnit: '',
    resolvedSubUnitKey: classification.subUnitKey,
    resolvedSubUnit: classification.subUnit,
    resolutionStatus: 'EXISTING_SUBUNIT_RETAINED',
    resolutionOutcome: 'EXISTING_SUBUNIT_RETAINED',
    resolutionRationale: 'fallback overlay 기준에서 기존 문서화 세부단원 값을 보존한다. 운영 반영은 허용하지 않는다.',
    disposition: 'EXISTING_SUBUNIT',
    semanticStatus: 'documented_existing',
    contentCueHits: classification.evidence?.contentRuleIds ?? [],
    solutionCueHits: classification.evidence?.solutionRuleIds ?? [],
    independentSupport: Boolean(classification.evidence?.agreedRuleIds?.length),
    candidateEvidenceRetained: false,
    productionWriteAllowed: false
  };
}

export function buildSequentialSubunitResolutionV1() {
  const classification = readJson(classificationPath);
  const coverage = readJson(coveragePath);
  const batchFiles = sortBatchFiles(fs.readdirSync(coverageDir));
  const batches = batchFiles.map(file => ({ file, report: readJson(path.join(coverageDir, file)) }));
  const queueRecords = batches.flatMap(({ report }) => report.records).sort((a, b) => a.reviewOrder - b.reviewOrder);
  const classificationByUid = new Map(classification.records.map(record => [record.questionUid, record]));

  if (batchFiles.length !== 35) throw new Error(`expected 35 coverage batches, found ${batchFiles.length}`);
  if (queueRecords.length !== 10208) throw new Error(`expected 10208 queue records, found ${queueRecords.length}`);
  assertUnique(queueRecords, 'questionUid', 'coverage queue');
  const sequenceGaps = queueRecords
    .map((record, index) => record.reviewOrder === index + 1 ? null : { expected: index + 1, actual: record.reviewOrder })
    .filter(Boolean);
  if (sequenceGaps.length) throw new Error(`coverage queue sequence gaps: ${JSON.stringify(sequenceGaps.slice(0, 3))}`);
  const missingClassification = queueRecords.filter(record => !classificationByUid.has(record.questionUid));
  if (missingClassification.length) throw new Error(`queue records missing classification: ${missingClassification.length}`);

  const records = queueRecords.map(record => buildQueueResolution(record, classificationByUid.get(record.questionUid)));
  const existingRecords = classification.records
    .filter(record => record.classification?.subUnitKey)
    .map(buildExistingResolution);
  assertUnique(existingRecords, 'questionUid', 'existing subunit records');
  const allRecords = [...records, ...existingRecords];
  assertUnique(allRecords, 'questionUid', 'resolution ledger');
  if (allRecords.length !== 10498) throw new Error(`expected 10498 total records, found ${allRecords.length}`);

  const candidateResolved = records.filter(record => record.resolutionStatus === 'SUBUNIT_CANDIDATE_NONPRODUCTION');
  const candidateObserved = records.filter(record => record.disposition === 'PILOT_CANDIDATE');
  const fallback = records.filter(record => record.resolutionOutcome !== 'CANDIDATE_RETAINED_NONPRODUCTION');
  const unmapped = records.filter(record => record.resolutionStatus === 'UNMAPPED_STANDARD_UNIT_FALLBACK');
  const stable = {
    schemaVersion: 'archive-sequential-subunit-resolution-v1',
    productionWriteAllowed: false,
    sourceWrites: { master: false, originalJs: false, database: false, questionIndex: false, commit: false, push: false },
    scope: {
      totalRecords: allRecords.length,
      queueRecords: records.length,
      existingSubunitRecords: existingRecords.length,
      queueFirstReviewOrder: records[0]?.reviewOrder ?? null,
      queueLastReviewOrder: records.at(-1)?.reviewOrder ?? null,
      queueBatchCount: batches.length
    },
    inputs: {
      classification: { path: path.relative(archiveDir, classificationPath).replaceAll('\\', '/'), digest: classification.digest, schemaVersion: classification.schemaVersion, overlayApplied: classification.overlayApplied },
      coverage: { path: path.relative(archiveDir, coveragePath).replaceAll('\\', '/'), digest: coverage.digest, schemaVersion: coverage.schemaVersion, batchDigests: batches.map(({ file, report }) => ({ file, digest: report.digest })) }
    },
    gates: {
      queueSequenceContiguous: sequenceGaps.length === 0,
      allBatchesPresent: batches.length === 35,
      queueIdentityUnique: new Set(records.map(record => record.questionUid)).size === records.length,
      totalIdentityUnique: new Set(allRecords.map(record => record.questionUid)).size === allRecords.length,
      everyRecordHasResolution: allRecords.every(record => record.resolutionStatus && record.resolutionOutcome),
      existingSubunitDepthValid: existingRecords.every(record => ['documented_template', 'single_documented_subunit'].includes(record.classificationDepth)),
      productionWrites: false
    },
    totals: {
      totalRecords: allRecords.length,
      queueRecords: records.length,
      existingSubunitRetained: existingRecords.length,
      pilotCandidatesObserved: candidateObserved.length,
      candidateSubunitAssignedNonproduction: candidateResolved.length,
      candidateNotesRetainedOnUnmapped: candidateObserved.length - candidateResolved.length,
      fallbackOrHoldRecords: fallback.length,
      unmappedStandardUnitFallback: unmapped.length,
      resolutionStatus: countBy(allRecords, 'resolutionStatus'),
      resolutionOutcome: countBy(allRecords, 'resolutionOutcome'),
      disposition: countBy(records, 'disposition')
    },
    sequenceGaps,
    records: allRecords
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

function writeSummary(report) {
  const lines = [
    '# 순차 세부단원 해소 대장 v1',
    '',
    `- 생성 시각: ${report.generatedAt}`,
    `- 전체 문항: ${report.totals.totalRecords.toLocaleString('en-US')}건`,
    `- 기존 세부단원 보존: ${report.totals.existingSubunitRetained.toLocaleString('en-US')}건`,
    `- 순차 검토 대기열: ${report.totals.queueRecords.toLocaleString('en-US')}건 (reviewOrder ${report.scope.queueFirstReviewOrder}~${report.scope.queueLastReviewOrder})`,
    `- 비운영 후보 세부단원: ${report.totals.candidateSubunitAssignedNonproduction.toLocaleString('en-US')}건`,
    `- 후보 참고값만 남긴 미매핑 표준단원: ${report.totals.candidateNotesRetainedOnUnmapped.toLocaleString('en-US')}건`,
    `- 폴백/보류: ${report.totals.fallbackOrHoldRecords.toLocaleString('en-US')}건`,
    `- 미매핑 표준단원 폴백: ${report.totals.unmappedStandardUnitFallback.toLocaleString('en-US')}건`,
    '',
    '운영 master, 원본 JS, DB, question-index, 커밋·푸시는 수행하지 않았다. 이 대장은 후보·폴백 해소 결과를 기록하는 비운영 sidecar이며, 운영 승격을 의미하지 않는다.',
    '',
    `- digest: \`${report.digest}\``,
    `- productionWriteAllowed: \`${report.productionWriteAllowed}\``
  ];
  return `${lines.join('\n')}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildSequentialSubunitResolutionV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryPath, writeSummary(report), 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), summary: path.relative(archiveDir, summaryPath).replaceAll('\\', '/'), digest: report.digest, scope: report.scope, gates: report.gates, totals: report.totals }, null, 2));
}
