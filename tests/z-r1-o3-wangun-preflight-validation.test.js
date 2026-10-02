const { spawnSync } = require('child_process');

const exam = 'archive/exams/original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js';
const evidence = 'archive/data/review-evidence/m3/25_왕운중_1학기_중간_중3_기출.r1.calibration.json';

const result = spawnSync(process.execPath, [
  'archive/tools/solution-calibration-gate.mjs',
  '--exam', exam,
  '--evidence', evidence,
  '--stage', 'R1',
  '--preflight',
  '--json'
], { cwd: process.cwd(), encoding: 'utf8' });

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status || 1);
