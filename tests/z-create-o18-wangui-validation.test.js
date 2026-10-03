const fs = require('fs');
const path = require('path');
const vm = require('vm');

(async () => {
  const examFile = path.resolve('archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js');
  const evidenceFile = path.resolve('archive/data/r2e-intake/m2/26_왕의중_1학기_기말_중2_기출.create.physical-evidence.json');
  const source = fs.readFileSync(examFile, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: examFile, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));

  const calibration = await import('../archive/tools/solution-calibration-gate.mjs');
  const preflightIssues = calibration.validateSolutionCalibrationPreflight({
    examFile, questions, evidence, stage: 'CREATE'
  });
  console.log('M2_O18_CREATE_CALIBRATION_PREFLIGHT');
  console.log(JSON.stringify({ ok: preflightIssues.length === 0, stage: 'CREATE', issues: preflightIssues }, null, 2));
  if (preflightIssues.length) {
    process.exitCode = 1;
    return;
  }

  const gate = await import('../archive/tools/review-evidence-gate.mjs');
  const report = gate.validatePhysicalEvidence({ examFile, evidenceFile, stage: 'CREATE' });
  console.log('M2_O18_CREATE_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
