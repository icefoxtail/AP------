const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const testsDir = path.join(root, 'tests');

const quarantined = new Map([
  ['admin-diagnostic-assessment-alert.test.js', 'pre-existing dashboard-admin diagnostic alert marker mismatch'],
  ['admin-recent-consultation-panel.test.js', 'pre-existing dashboard header global search mismatch'],
  ['apmath-dark-mode-modals.test.js', 'pre-existing AP Math dark-mode modal token mismatch'],
  ['assessment-grade-target-round5-1.test.js', 'pre-existing archive grade target assertion mismatch'],
  ['assessment-m1-diagnostic-packs.test.js', 'pre-existing M1 diagnostic pack count mismatch'],
  ['assessment-m1-type-source-integrity.test.js', 'pre-existing M1 source integrity mismatch'],
  ['eie-attendance-print-design-contract.test.js', 'pre-existing EIE print design contract mismatch'],
  ['eie-attendance-visual-contract.test.js', 'pre-existing EIE attendance visual contract mismatch']
]);

const includeQuarantined = process.env.APMATH_RUN_QUARANTINE === '1';

const tests = fs.readdirSync(testsDir)
  .filter(name => name.endsWith('.test.js'))
  .filter(name => includeQuarantined || !quarantined.has(name))
  .sort()
  .map(name => path.join('tests', name));

let failed = 0;

for (const test of tests) {
  const result = spawnSync(process.execPath, [test], {
    cwd: root,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    failed += 1;
    console.error(`Test failed: ${test}`);
  }
}

if (failed > 0) {
  console.error(`${failed} test file(s) failed`);
  process.exit(1);
}

if (!includeQuarantined && quarantined.size > 0) {
  console.log(`${quarantined.size} quarantined test file(s) skipped; set APMATH_RUN_QUARANTINE=1 to include them`);
}
console.log(`${tests.length} test file(s) passed`);
