#!/usr/bin/env node

/** Read-only Gate 5 readiness audit; no student, DB, or remote writes. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUTPUT_PATH = path.join(ROOT, 'archive', 'data', 'phase5-gate5-readiness.json');
export const SCHEMA_VERSION = 'phase5-gate5-readiness.v1';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

export function auditPhase5Gate5Readiness() {
  const phase5 = readJson('archive/data/weakness-phase5-contract-audit.json');
  const inputPolicy = readJson('archive/data/weakness-input-policy-audit.json');
  const fingerprintGate = readJson('archive/data/school-fingerprint-gate-report.json');
  const studentHtml = read('apmath/student/index.html');
  const studentRoute = read('apmath/worker-backup/worker/routes/student-portal.js');
  const mixerHtml = read('archive/mixer.html');

  const checks = {
    phase5ContractPass: phase5.status === 'CONTRACT_PASS_NON_OPERATIONAL' && phase5.checks?.closedLoopReady === true,
    phase5OperationalHold: phase5.operationalExposure === 'HOLD',
    inputPolicyPass: inputPolicy.status === 'INPUT_POLICY_PASS' && inputPolicy.policy?.mode === 'wrong_ids_only',
    fingerprintTechnicalPass: fingerprintGate.status === 'PASS' || fingerprintGate.status === 'TECHNICAL_PASS',
    fingerprintOperationalHold: fingerprintGate.operationalExposure === 'HOLD',
    wrongClinicRoutePresent: studentRoute.includes("method === 'GET' && id === 'wrong-clinics'") && studentRoute.includes("method === 'POST' && id === 'wrong-clinics'"),
    weaknessStudentUiNotExposed: !studentHtml.includes('weakness-student-view.js') && !studentHtml.includes('weakness-supplement-preset.js'),
    weaknessMixerUiNotExposed: !mixerHtml.includes('weakness-supplement-preset.js') && !mixerHtml.includes('weakness-preset'),
  };
  const technicalPass = checks.phase5ContractPass && checks.phase5OperationalHold && checks.inputPolicyPass && checks.fingerprintTechnicalPass && checks.fingerprintOperationalHold && checks.wrongClinicRoutePresent && checks.weaknessStudentUiNotExposed && checks.weaknessMixerUiNotExposed;
  return {
    schemaVersion: SCHEMA_VERSION,
    status: technicalPass ? 'GATE5_TECHNICAL_PASS_OPERATIONAL_HOLD' : 'GATE5_READINESS_FAIL',
    gate: {
      technical: technicalPass,
      operationalExposure: 'HOLD',
      studentUi: 'not_exposed',
      dbWrite: 'not_run',
      remoteOmr: 'not_run',
    },
    evidence: {
      canonicalCoverage: `${phase5.source?.originalCanonicalUidCoverage || 0}/${phase5.source?.originalIndexRecords || 0}`,
      closedLoop: phase5.closedLoop?.status || '',
      inputMode: inputPolicy.policy?.mode || '',
      fingerprintGate: fingerprintGate.status || '',
      wrongClinicPreserved: phase5.checks?.wrongClinicPreserved === true,
    },
    checks,
    approvalRequired: [
      'Gate 5 운영 노출 승인',
      '인증된 테스트 학생/교사 범위 확정',
      '실환경 DB write·QR/OMR roundtrip 실행 승인',
      '실행 전 rollback checkpoint와 post-audit 기준 확정',
    ],
    writes: 0,
    networkCalls: 0,
  };
}

export function writeAudit(outputPath = OUTPUT_PATH) {
  const report = auditPhase5Gate5Readiness();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const report = writeAudit();
  console.log(`Phase 5 Gate 5 readiness: ${report.status}; technical=${report.gate.technical}; operational=${report.gate.operationalExposure}`);
}
