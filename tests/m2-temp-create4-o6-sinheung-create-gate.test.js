const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const { validateSolutionCalibrationPreflight } = await import('../archive/tools/solution-calibration-gate.mjs');
  const exam = 'archive/exams/original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js';
  const evidence = 'archive/data/r2e-intake/m2/24_신흥중_1학기_중간_중2_기출c.create.physical-evidence.json';
  const examFile = path.resolve(exam);
  const evidenceFile = path.resolve(evidence);
  const source = require('node:fs').readFileSync(examFile, 'utf8');
  const vm = require('node:vm');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: examFile, timeout: 5000 });
  const questions = sandbox.window.questionBank;
  const ev = JSON.parse(require('node:fs').readFileSync(evidenceFile, 'utf8'));
  const preflightIssues = validateSolutionCalibrationPreflight({ examFile, questions, evidence: ev, stage: 'CREATE' });
  assert.deepEqual(preflightIssues, [], JSON.stringify(preflightIssues));
  const report = validatePhysicalEvidence({ examFile, evidenceFile, stage: 'CREATE' });
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.equal(report.questionCount, 23);
  assert.equal(report.questionEvidenceRows, 23);
  assert.equal(report.metaEvidenceRows, 23);
  assert.deepEqual(report.itemHoldQids, []);
  console.log('M2 o6 TEMP-CREATE-4 calibration preflight + canonical CREATE gate PASS');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
