#!/usr/bin/env node

/** Read-only Phase 5A/5B/5C/5D/5E contract audit; no student or DB writes. */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import joiner from '../weakness-metadata-join.js';
import aggregator from '../weakness-aggregator.js';
import studentView from '../weakness-student-view.js';
import supplementPreset from '../weakness-supplement-preset.js';
import selector from '../mixer-selector.js';
import closedLoop from '../weakness-closed-loop.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.resolve(HERE, '..');
const OUTPUT_PATH = path.join(ARCHIVE_ROOT, 'data', 'weakness-phase5-contract-audit.json');
export const SCHEMA_VERSION = 'weakness-phase5-contract-audit.v3';

function loadIndex() {
  const source = fs.readFileSync(path.join(ARCHIVE_ROOT, 'question-index.js'), 'utf8');
  const start = source.indexOf('[', source.indexOf('window.questionIndex='));
  return JSON.parse(source.slice(start, source.lastIndexOf(']') + 1));
}

export function auditWeaknessContract() {
  const identity = JSON.parse(fs.readFileSync(path.join(ARCHIVE_ROOT, 'data', 'question_identity_map.json'), 'utf8'));
  const index = loadIndex();
  const original = index.filter(row => String(row.sourceFile || '').startsWith('original/'));
  const canonicalIndex = original.filter(row => identity.records.some(record => record.sourceArchiveFile === row.sourceFile && record.sourceOrdinal === row.sourceOrdinal && joiner.CANONICAL_UID_RE.test(record.questionUid)));
  const sampleRows = original.slice(0, 3).map((row, i) => ({
    session_id: 'contract-session',
    student_id: 'contract-student',
    source_archive_file: `exams/${row.sourceFile}`,
    source_question_ordinal: row.sourceOrdinal,
    source_question_uid: identity.records.find(record => record.sourceArchiveFile === row.sourceFile && record.sourceOrdinal === row.sourceOrdinal)?.questionUid || '',
    result_status: i === 1 ? 'correct' : 'wrong',
    is_correct: i === 1 ? 1 : 0,
    standard_unit_key: row.standardUnitKey,
    sub_unit_key: row.subUnitKey,
    type_key: row.questionType,
    difficulty: row.level,
    created_at: '2026-08-25T00:00:00Z',
  }));
  const joined = joiner.joinWrongItems({ assessmentResultItems: sampleRows, identityRecords: identity.records, indexRecords: index });
  const aggregated = aggregator.aggregateWeakness(joined, { asOf: '2026-08-25T00:00:00Z' });
  const view = studentView.buildStudentWeaknessView({
    weaknessReport: aggregated,
    wrongClinicPackets: [{ packet_key: 'phase5-contract-packet', item_count: 1 }],
    maxItems: 5,
  });
  const supplement = supplementPreset.buildSupplementPreset({
    weaknessReport: aggregated,
    count: 3,
    minScore: 0,
    selectionSeed: 'phase5-contract-supplement',
  });
  const supplementValidation = supplementPreset.validatePreset(supplement);
  const identityBySource = new Map(identity.records.map(record => [`${record.sourceArchiveFile}#${Number(record.sourceOrdinal)}`, record]));
  const candidates = original.map(row => ({
    ...row,
    questionUid: identityBySource.get(`${row.sourceFile}#${Number(row.sourceOrdinal)}`)?.questionUid || '',
    sourceQuestionNo: row.id,
    difficultyBucket: row.level,
    problemTypeKey: row.questionType,
  }));
  const closedLoopReport = closedLoop.runClosedLoop({
    preset: supplement,
    selector,
    candidates,
    wrongQuestionNos: [1],
    joiner,
    aggregator,
    sessionId: 'phase5-contract-loop',
    studentId: 'phase5-contract-student',
    resultAt: '2026-08-25T00:00:00Z',
    asOf: '2026-08-25T00:00:00Z',
  });
  return {
    schemaVersion: SCHEMA_VERSION,
    status: 'CONTRACT_PASS_NON_OPERATIONAL',
    operationalExposure: 'HOLD',
    source: {
      identityRecords: identity.records.length,
      indexRecords: index.length,
      originalIndexRecords: original.length,
      originalCanonicalUidCoverage: canonicalIndex.length,
    },
    join: {
      preferredSource: 'assessment_result_items',
      fallbackSource: 'wrong_answers + exam_sessions + exam_blueprints',
      sampleRows: joined.length,
      sampleResolved: joined.filter(row => Boolean(row.questionUid)).length,
      sampleUnresolved: joined.filter(row => !row.questionUid).length,
      metadataFields: ['questionUid', 'standardUnitKey', 'subUnitKey', 'conceptClusterKey', 'problemTypeKey', 'templateKey', 'difficultyBucket'],
    },
    aggregation: {
      dimensions: Object.keys(aggregated.groups),
      recoveryAvailable: true,
      fallbackRecoveryStatus: 'limited_fallback',
      scoreFormula: 'wrongRate × recencyWeight × repeatedFailureWeight × difficultyAdjustment × recoveryFactor',
    },
    studentView: {
      exposure: view.exposure,
      readOnly: view.readOnly,
      dimensions: Object.keys(view.weakness.dimensions),
      wrongClinicPreserved: view.wrongClinic.preserved && view.wrongClinic.packetCount === 1,
      noticeCodes: view.notices.map(row => row.code),
    },
    supplementPreset: {
      exposure: supplement.exposure,
      status: supplement.status,
      requestCount: supplementValidation.requestCount,
      targetCount: supplement.targets.length,
      validation: supplementValidation.ok,
      roundtrip: supplement.roundtrip,
    },
    closedLoop: {
      status: closedLoopReport.status,
      operationalExposure: closedLoopReport.operationalExposure,
      mixedQuestionCount: closedLoopReport.mixed.questionCount,
      blueprintCount: closedLoopReport.blueprints.count,
      resultCount: closedLoopReport.result.count,
      joinResolvedCount: closedLoopReport.join.resolvedCount,
      recalculatedItemCount: closedLoopReport.weakness?.itemCount || 0,
      writes: closedLoopReport.writes,
      networkCalls: closedLoopReport.networkCalls,
      errorCount: closedLoopReport.errors.length,
    },
    checks: {
      canonicalIndexCoverage: original.length === canonicalIndex.length,
      joinSampleResolved: joined.length === joined.filter(row => Boolean(row.questionUid)).length,
      aggregationDimensionsPresent: ['concept', 'problemType', 'template', 'standardUnit'].every(key => Array.isArray(aggregated.groups[key])),
      studentViewReady: view.exposure === 'non_operational' && view.readOnly === true && Object.keys(view.weakness.dimensions).length === 4,
      wrongClinicPreserved: view.wrongClinic.preserved === true && view.wrongClinic.packetCount === 1,
      supplementPresetReady: supplementValidation.ok && supplement.exposure === 'non_operational' && supplement.status === 'candidate_non_operational' && supplementValidation.requestCount === supplement.count,
      closedLoopReady: closedLoopReport.status === 'CLOSED_LOOP_PASS_NON_OPERATIONAL' && closedLoopReport.mixed.questionCount === supplement.count && closedLoopReport.blueprints.count === supplement.count && closedLoopReport.result.count === supplement.count && closedLoopReport.join.resolvedCount === closedLoopReport.join.count && closedLoopReport.weakness?.itemCount === closedLoopReport.join.count && closedLoopReport.writes === 0 && closedLoopReport.networkCalls === 0,
    },
  };
}

export function writeAudit(outputPath = OUTPUT_PATH) {
  const report = auditWeaknessContract();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const report = writeAudit();
  console.log(`weakness Phase 5 contract audit: ${report.status}; canonical ${report.source.originalCanonicalUidCoverage}/${report.source.originalIndexRecords}; join ${report.join.sampleResolved}/${report.join.sampleRows}`);
}
