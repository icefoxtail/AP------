#!/usr/bin/env node

/** Read-only audit for the frozen wrong_ids-only OMR input contract. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUTPUT_PATH = path.join(ROOT, 'archive', 'data', 'weakness-input-policy-audit.json');
export const SCHEMA_VERSION = 'weakness-input-policy-audit.v1';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function has(source, pattern) {
  return pattern instanceof RegExp ? pattern.test(source) : source.includes(pattern);
}

export function auditWeaknessInputPolicy() {
  const studentHtml = read('apmath/student/index.html');
  const qrOmr = read('apmath/js/qr-omr.js');
  const studentRoute = read('apmath/worker-backup/worker/routes/student-portal.js');
  const examsRoute = read('apmath/worker-backup/worker/routes/exams.js');
  const closedLoop = read('archive/weakness-closed-loop.js');

  const studentSubmit = studentHtml.match(/apiPost\('student-portal\/omr-submit',[\s\S]*?\n\s*\}\);/u)?.[0] || '';
  const teacherSubmit = qrOmr.match(/const payload = \{[\s\S]*?\n\s*\};/u)?.[0] || '';
  // The markers below are scoped to the Worker source; they are unique to
  // saveAssessmentResultItems and avoid coupling the audit to formatting.
  const resultItemBlock = examsRoute;

  const checks = {
    studentWrongIdsOnly: has(studentHtml, '틀린 번호만 눌러 빨간색으로 표시한 뒤 제출하세요.') && has(studentSubmit, 'wrong_ids: normalizeOmrWrongIds(omrDraft.wrong_ids)'),
    teacherWrongIdsOnly: has(teacherSubmit, 'wrong_ids: wrs') && !has(teacherSubmit, 'student_answer') && !has(teacherSubmit, 'student_answers'),
    studentRouteNormalizesWrongIds: has(studentRoute, 'const wrongIds = normalizeWrongIds(d.wrong_ids, questionCount)'),
    workerBuildsComplementRows: has(resultItemBlock, "result_status: wrongSet.has(orderNo) ? 'wrong' : 'correct'") && has(resultItemBlock, 'is_correct: wrongSet.has(orderNo) ? 0 : 1'),
    answerFieldsRemainUnset: has(resultItemBlock, 'student_answer: null') && has(resultItemBlock, 'correct_answer: null'),
    closedLoopIsFixtureOnly: has(closedLoop, "writeMode: 'fixture_only'") && has(closedLoop, 'writes: 0') && has(closedLoop, 'networkCalls: 0'),
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    status: Object.values(checks).every(Boolean) ? 'INPUT_POLICY_PASS' : 'INPUT_POLICY_FAIL',
    policy: {
      mode: 'wrong_ids_only',
      studentInput: '틀린 번호만 선택',
      inferredRule: '선택된 번호=wrong, 미선택 번호=correct',
      answerTextCapture: false,
      answerAutoScoring: false,
      unattemptedState: 'not_separately_captured',
      sourceClassification: 'self_reported_result',
    },
    checks,
    operationalExposure: 'unchanged',
    writes: 0,
  };
}

export function writeAudit(outputPath = OUTPUT_PATH) {
  const report = auditWeaknessInputPolicy();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const report = writeAudit();
  console.log(`weakness input policy audit: ${report.status}; mode=${report.policy.mode}`);
}
