#!/usr/bin/env node
const { spawnSync } = require('child_process');
const r = spawnSync(process.execPath, [
  'archive/tools/review-evidence-gate.mjs',
  '--stage','R2',
  '--exam','archive/exams/original/middle/m3/2final/23_풍덕중_2학기_기말_중3_기출.js',
  '--evidence','archive/data/r2e-intake/m3/23_풍덕중_2학기_기말_중3_기출.review2.meta-v2.physical-evidence.json',
  '--json'
], { stdio: 'inherit' });
process.exit(Number.isInteger(r.status) ? r.status : 1);
