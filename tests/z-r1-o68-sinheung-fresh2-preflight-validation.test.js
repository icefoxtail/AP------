const { spawnSync } = require('child_process');
const result = spawnSync(process.execPath, [
  'archive/tools/solution-calibration-gate.mjs',
  '--exam', 'archive/exams/original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js',
  '--evidence', 'archive/data/review-evidence/m3/22_신흥중_2학기_기말_중3_기출.r1.r11-fresh2.calibration.json',
  '--stage', 'R1', '--preflight', '--json'
], { cwd: process.cwd(), encoding: 'utf8' });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status || 1);
