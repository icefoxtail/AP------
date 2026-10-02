#!/usr/bin/env node
const { spawnSync } = require('child_process');
const args = [
  'archive/tools/review-evidence-gate.mjs',
  '--stage','R3',
  '--exam','archive/exams/original/middle/m3/2final/22_팔마중_2학기_기말_중3_기출.js',
  '--evidence','archive/data/r3-intake/m3/22_팔마중_2학기_기말_중3_기출.r3.physical-evidence.json',
  '--json'
];
const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(Number.isInteger(r.status) ? r.status : 1);
