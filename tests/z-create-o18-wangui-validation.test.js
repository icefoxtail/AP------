const path = require('path');
const { spawnSync } = require('child_process');

(async () => {
  const exam = 'archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js';
  const evidence = 'archive/data/r2e-intake/m2/26_왕의중_1학기_기말_중2_기출.create.physical-evidence.json';

  const preflight = spawnSync(process.execPath, [
    'archive/tools/solution-calibration-gate.mjs',
    '--exam', exam,
    '--evidence', evidence,
    '--stage', 'CREATE',
    '--preflight',
    '--json'
  ], { encoding: 'utf8' });

  console.log('M2_O18_CREATE_CALIBRATION_PREFLIGHT');
  if (preflight.stdout) console.log(preflight.stdout.trim());
  if (preflight.stderr) console.error(preflight.stderr.trim());
  if (preflight.status !== 0) {
    process.exitCode = 1;
    return;
  }

  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve(exam),
    evidenceFile: path.resolve(evidence),
    stage: 'CREATE'
  });
  console.log('M2_O18_CREATE_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
