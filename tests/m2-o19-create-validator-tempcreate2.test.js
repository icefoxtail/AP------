const fs = require('fs');
const path = require('path');
const vm = require('vm');

(async () => {
  const { validateSolutionCalibrationPreflight } = await import('../archive/tools/solution-calibration-gate.mjs');
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const examFile = path.resolve('archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js');
  const evidenceFile = path.resolve('archive/data/r2e-intake/m2/26_왕운중_1학기_기말_중2_기출.create.physical-evidence.json');
  const source = fs.readFileSync(examFile, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: examFile, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));

  const preflightIssues = validateSolutionCalibrationPreflight({ examFile, questions, evidence, stage: 'CREATE' });
  console.log(JSON.stringify({ ok: preflightIssues.length === 0, stage: 'CREATE', gate: 'CALIBRATION_PREFLIGHT', questionCount: questions.length, issues: preflightIssues }));
  if (preflightIssues.length) process.exitCode = 1;

  const report = validatePhysicalEvidence({ examFile, evidenceFile, stage: 'CREATE' });
  console.log(JSON.stringify(report));
  if (!report.ok) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
