#!/usr/bin/env node

/** Consolidated, deterministic Phase 4 technical gate. */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildSchoolFingerprints } from './build-school-fingerprints.mjs';
import { auditQuestionTypeCoverage } from './audit-question-type-coverage.mjs';
import { auditSchoolFingerprintPolicy } from './audit-school-fingerprint-policy.mjs';
import selector from '../mixer-selector.js';
import bridge from '../mixer-school-fingerprint.js';
import runtime from '../mixer-school-fingerprint-runtime.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.resolve(HERE, '..');
const OUTPUT_PATH = path.join(ARCHIVE_ROOT, 'data', 'school-fingerprint-gate-report.json');
export const SCHEMA_VERSION = 'school-fingerprint-gate.v1';

function loadQuestionIndex() {
  const source = fs.readFileSync(path.join(ARCHIVE_ROOT, 'question-index.js'), 'utf8');
  const start = source.indexOf('[', source.indexOf('window.questionIndex='));
  return JSON.parse(source.slice(start, source.lastIndexOf(']') + 1));
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function runSchoolFingerprintGate() {
  const first = buildSchoolFingerprints();
  const second = buildSchoolFingerprints();
  const coverage = auditQuestionTypeCoverage();
  const policy = auditSchoolFingerprintPolicy({ fingerprints: first });
  const runtimeValidation = runtime.validatePayload(first);
  const presets = runtime.eligiblePresets(first);
  const identity = JSON.parse(fs.readFileSync(path.join(ARCHIVE_ROOT, 'data', 'question_identity_map.json'), 'utf8'));
  const exams = first.schools.flatMap(school => school.exams);
  const enriched = bridge.enrichIndexRecords(loadQuestionIndex(), identity.records, exams);
  const largest = first.schools.filter(school => school.sampleEligible)
    .sort((a, b) => b.questionCount - a.questionCount || a.schoolKey.localeCompare(b.schoolKey))[0];
  const preset = presets.find(candidate => candidate.schoolName === largest?.schoolName);
  const candidates = enriched.filter(record => record.school === preset?.schoolName);
  const replay = preset
    ? bridge.selectSchoolFingerprint(selector, candidates, preset, { count: 15, selectionSeed: 'phase4-gate-v1' })
    : { ok: false, selected: [], errors: ['eligible runtime preset is unavailable'], hardValidation: { ok: false }, distribution: { ok: false } };

  const checks = {
    originalOnly: first.source.root === 'archive/exams/original' && first.source.parseErrorCount === 0,
    deterministic: sameJson(first, second),
    aliasAudit: policy.audit.aliasAuditPass && policy.aliasPolicy.collisionCount === 0,
    thresholdAudit: policy.audit.thresholdAuditPass && policy.samplePolicy.candidateCount === 23 && policy.samplePolicy.hiddenCount === 14,
    questionTypeCoverage: coverage.comparison.exactValueMatch && coverage.source.questionCount === first.source.questionCount,
    presetConversion: runtimeValidation.ok && presets.length === 23,
    selectorReplay: replay.ok && replay.hardValidation.ok && replay.distribution.ok && replay.selected.length === 15,
  };
  return {
    schemaVersion: SCHEMA_VERSION,
    status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL',
    operationalExposure: 'HOLD',
    source: first.source,
    schoolCount: first.schools.length,
    eligibleSchoolCount: policy.samplePolicy.candidateCount,
    hiddenSchoolCount: policy.samplePolicy.hiddenCount,
    sampleReplay: {
      schoolKey: largest?.schoolKey || '',
      candidateCount: candidates.length,
      selectedCount: replay.selected.length,
      distribution: replay.distribution,
      hardValidation: replay.hardValidation,
      errors: replay.errors,
    },
    checks,
    next: 'Approve Gate 4 operational exposure separately; do not expose school preset controls while operationalExposure is HOLD.',
  };
}

export function writeGateReport(outputPath = OUTPUT_PATH) {
  const report = runSchoolFingerprintGate();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const report = writeGateReport();
  console.log(`school fingerprint gate: ${report.status}; exposure=${report.operationalExposure}; checks=${Object.values(report.checks).filter(Boolean).length}/${Object.keys(report.checks).length}`);
}
