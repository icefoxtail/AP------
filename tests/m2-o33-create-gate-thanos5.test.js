const fs = require('fs');
const vm = require('vm');
const path = require('path');

(async () => {
  const exam = path.resolve('archive/exams/original/middle/m2/1final/22_왕운중_1학기_기말_중2_기출.js');
  const evidenceFile = path.resolve('archive/data/r2e-intake/m2/22_왕운중_1학기_기말_중2_기출.create.physical-evidence.json');
  const source = fs.readFileSync(exam, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: exam, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));

  const calibration = await import('../archive/tools/solution-calibration-gate.mjs');
  const review = await import('../archive/tools/review-evidence-gate.mjs');

  const preflightIssues = calibration.validateSolutionCalibrationPreflight({
    examFile: exam,
    questions,
    evidence,
    stage: 'CREATE',
  });
  const preflight = {
    ok: preflightIssues.length === 0,
    stage: 'CREATE',
    gate: 'CALIBRATION_PREFLIGHT',
    questionCount: questions.length,
    issues: preflightIssues,
  };
  console.log(JSON.stringify(preflight, null, 2));
  if (!preflight.ok) process.exitCode = 1;

  const result = review.validatePhysicalEvidence({
    examFile: exam,
    evidenceFile,
    stage: 'CREATE',
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
  if (preflight.ok && result.ok) console.log('M2 o33 CREATE canonical gates PASS');
})().catch(error => {
  console.error(error);
  process.exitCode = 2;
});
