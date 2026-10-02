#!/usr/bin/env node
const { spawnSync } = require('child_process');

const exam = 'archive/exams/original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js';
const evidence = 'archive/data/r3-intake/m3/25_왕운중_1학기_중간_중3_기출.r3.physical-evidence.json';

const calibration = spawnSync(process.execPath, [
  'archive/tools/solution-calibration-gate.mjs',
  '--exam', exam,
  '--evidence', evidence,
  '--stage', 'R3',
  '--json'
], { encoding: 'utf8' });
process.stdout.write(calibration.stdout || '');
process.stderr.write(calibration.stderr || '');
if (calibration.status !== 0) process.exit(Number.isInteger(calibration.status) ? calibration.status : 1);

const gate = spawnSync(process.execPath, [
  'archive/tools/review-evidence-gate.mjs',
  '--stage', 'R3',
  '--exam', exam,
  '--evidence', evidence,
  '--json'
], { encoding: 'utf8' });
process.stdout.write(gate.stdout || '');
process.stderr.write(gate.stderr || '');

let report = {};
try { report = JSON.parse(gate.stdout || '{}'); } catch { process.exit(2); }
const expected = [1,2,4,6,7,8,9,11,12,17,18,22];
const exact = JSON.stringify(report.itemHoldQids || []) === JSON.stringify(expected)
  && Array.isArray(report.issues)
  && report.issues.includes('R3_ITEM_HOLD_FORBIDDEN:1,2,4,6,7,8,9,11,12,17,18,22');

if (gate.status !== 1 || report.ok !== false || !exact) process.exit(3);
process.exit(0);
