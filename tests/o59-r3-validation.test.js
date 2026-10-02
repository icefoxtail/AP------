#!/usr/bin/env node
const { spawnSync } = require('child_process');
const r = spawnSync(process.execPath, [
  'archive/tools/review-evidence-gate.mjs',
  '--stage','R3',
  '--exam','archive/exams/original/middle/m3/2final/23_향림중_2학기_기말_중3_기출.js',
  '--evidence','archive/data/r3-intake/m3/23_향림중_2학기_기말_중3_기출.r3.physical-evidence.json',
  '--json'
], { stdio: 'inherit' });
process.exit(Number.isInteger(r.status) ? r.status : 1);
