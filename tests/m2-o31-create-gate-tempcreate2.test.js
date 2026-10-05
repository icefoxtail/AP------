const { spawnSync } = require('child_process');

const exam = 'archive/exams/original/middle/m2/1final/23_연향중_1학기_기말_중2_기출.js';
const evidence = 'archive/data/r2e-intake/m2/23_연향중_1학기_기말_중2_기출.create.physical-evidence.json';

for (const args of [
  ['archive/tools/solution-calibration-gate.mjs', '--exam', exam, '--evidence', evidence, '--stage', 'CREATE', '--preflight'],
  ['archive/tools/review-evidence-gate.mjs', '--exam', exam, '--evidence', evidence, '--stage', 'CREATE'],
]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log('M2 o31 CREATE canonical gates PASS');
