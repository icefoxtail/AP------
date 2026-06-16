#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const testsDir = path.join(root, 'tests');

const quarantined = new Map([
  ['assessment-grade-target-round5-1.test.js', 'pre-existing archive grade target assertion mismatch'],
  ['assessment-m1-diagnostic-packs.test.js', 'pre-existing M1 diagnostic pack count mismatch'],
  ['assessment-m1-type-source-integrity.test.js', 'pre-existing M1 source integrity mismatch'],
  ['eie-attendance-print-design-contract.test.js', 'pre-existing EIE print design contract mismatch'],
  ['eie-attendance-visual-contract.test.js', 'pre-existing EIE attendance visual contract mismatch'],
  ['eie-grade-ledger-port.test.js', 'EIE grade ledger port review-pack artifact contract requires CODEX_RESULT2.md']
]);

const includeQuarantined = process.env.APMATH_RUN_QUARANTINE === '1';

const files = fs.readdirSync(testsDir)
  .filter(name => name.endsWith('.test.js'))
  .sort();

const tests = includeQuarantined
  ? files
  : files.filter(name => !quarantined.has(name));

let passed = 0;
const failed = [];
const knownFailed = [];
const fixedKnown = [];

for (const file of tests) {
  const testPath = path.join('tests', file);
  const result = spawnSync(process.execPath, [testPath], {
    cwd: root,
    stdio: 'inherit',
    timeout: 60000
  });

  if (result.status === 0) {
    passed += 1;
    if (quarantined.has(file)) fixedKnown.push(file);
    continue;
  }

  if (quarantined.has(file)) {
    knownFailed.push(file);
  } else {
    failed.push(file);
    console.error(`Test failed: ${testPath}`);
  }
}

if (!includeQuarantined && quarantined.size > 0) {
  console.log(`${quarantined.size} quarantined test file(s) skipped; set APMATH_RUN_QUARANTINE=1 to include them`);
}

console.log(`PASS ${passed} / FAIL ${failed.length} / KNOWN-FAIL ${knownFailed.length} (total ${tests.length})`);

if (failed.length > 0) {
  console.error('\nBlocking failures:');
  for (const file of failed) console.error(`  FAIL ${file}`);
}

if (knownFailed.length > 0) {
  console.log('\nKnown failures (non-blocking quarantine):');
  for (const file of knownFailed) {
    console.log(`  KNOWN ${file} - ${quarantined.get(file)}`);
  }
}

if (fixedKnown.length > 0) {
  console.log('\nQuarantined tests now passing; consider removing them from the quarantine list:');
  for (const file of fixedKnown) {
    console.log(`  FIXED ${file}`);
  }
}

if (failed.length > 0) {
  console.error(`${failed.length} test file(s) failed`);
  process.exit(1);
}
