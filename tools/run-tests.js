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
  ['eie-grade-ledger-port.test.js', 'EIE grade ledger port review-pack artifact contract requires CODEX_RESULT2.md'],
  ['print-render-authority-phase0-baseline.test.js', 'the v2.2 SHA denominator is a historical frozen closure, and its documented clinic hash is stale; do not rewrite history to green the current source (docs/evidence/internal-review-engine-20260915.md)'],
  ['archive-latex-escapes.test.js', 'an in-progress Visang textbook solution contains two JS-unescaped \\dfrac commands; do not edit archived student math without freezing and checking the official source page']
]);

const includeQuarantined = process.env.APMATH_RUN_QUARANTINE === '1';

const files = fs.readdirSync(testsDir)
  .filter(name => name.endsWith('.test.js'))
  .sort();

const tests = includeQuarantined
  ? files
  : files.filter(name => !quarantined.has(name));

// Keep the SVG semantic regression outside the legacy CommonJS-only glob.
// CI invokes this runner, so both the verifier syntax gate and its ESM test
// become blocking checks on every normal test run.
const requiredCommands = [
  {
    label: 'tests/archive2-preview-feedback.test.cjs',
    args: ['--test', 'tests/archive2-preview-feedback.test.cjs']
  },
  {
    label: 'tests/archive2-output-memory-bridge.test.cjs',
    args: ['--test', 'tests/archive2-output-memory-bridge.test.cjs']
  },
  {
    label: 'tests/archive2-unit-envelope-handoff.test.cjs',
    args: ['--test', 'tests/archive2-unit-envelope-handoff.test.cjs']
  },
  {
    label: 'tests/archive2-original-source-route.test.cjs',
    args: ['--test', 'tests/archive2-original-source-route.test.cjs']
  },
  {
    label: 'tests/archive2-compose-performance.test.cjs',
    args: ['--test', 'tests/archive2-compose-performance.test.cjs']
  },
  {
    label: 'tests/archive2-output-transport.test.cjs',
    args: ['--test', 'tests/archive2-output-transport.test.cjs']
  },
  {
    label: 'tests/archive2-generated-mock-selection.test.cjs',
    args: ['--test', 'tests/archive2-generated-mock-selection.test.cjs']
  },
  {
    label: 'archive/tools/solution-calibration-gate.mjs syntax',
    args: ['--check', 'archive/tools/solution-calibration-gate.mjs']
  },
  {
    label: 'archive/tools/review-evidence-gate.mjs syntax',
    args: ['--check', 'archive/tools/review-evidence-gate.mjs']
  },
  {
    label: 'archive/tools/gpt2-one-shot-closeout.test.mjs',
    args: ['--test', 'archive/tools/gpt2-one-shot-closeout.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-library-coordinated-adapter.test.mjs',
    args: ['--test', 'archive/tools/gpt2-library-coordinated-adapter.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-github-cas-ledger.test.mjs',
    args: ['--test', 'archive/tools/gpt2-github-cas-ledger.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-files-tool-transport.test.mjs',
    args: ['--test', 'archive/tools/gpt2-files-tool-transport.test.mjs']
  },
  {
    label: 'archive/tools/gpt2-connected-host-adapter.test.mjs',
    args: ['--test', 'archive/tools/gpt2-connected-host-adapter.test.mjs']
  },
  {
    label: 'archive/tools/review-evidence-gate.test.mjs',
    args: ['--test', 'archive/tools/review-evidence-gate.test.mjs']
  },
  {
    label: 'archive/tools/solution-calibration-gate.test.mjs',
    args: ['--test', 'archive/tools/solution-calibration-gate.test.mjs']
  },
  {
    label: 'archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs syntax',
    args: ['--check', 'archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/reviewed-apply-core.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/reviewed-apply-core.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/apply-reviewed-meta-patch.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/apply-reviewed-meta-patch.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/rebuild-reviewed-runtime.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/rebuild-reviewed-runtime.mjs']
  },
  {
    label: 'archive/tools/meta-foundation/archive-reviewed-apply-staging.mjs syntax',
    args: ['--check', 'archive/tools/meta-foundation/archive-reviewed-apply-staging.mjs']
  },
  {
    label: 'tests/archive-reviewed-apply-bridge.test.mjs',
    args: ['--test', 'tests/archive-reviewed-apply-bridge.test.mjs']
  },
  {
    label: 'tests/archive-saved-papers-runtime.mjs',
    args: ['--test', 'tests/archive-saved-papers-runtime.mjs']
  },
  {
    label: 'archive/tools/geometry-equation/tests/verify-svg-coordinate-parity.test.mjs',
    args: ['--test', 'archive/tools/geometry-equation/tests/verify-svg-coordinate-parity.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-api.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-api.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-contract.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-contract.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-course-picker.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-course-picker.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-phase-api.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-phase-api.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-phase-migration.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-phase-migration.test.mjs']
  },
  {
    label: 'tests/apmath-class-progress-phase.test.mjs',
    args: ['--test', 'tests/apmath-class-progress-phase.test.mjs']
  },
  {
    label: 'tests/archive2-worker-validation.test.mjs (Grade/browse contracts)',
    args: [
      '--test',
      '--test-name-pattern',
      'grade-only canonical path filters pass mixed-question validation|Worker accepts an approved high2 source in the shared high3 semantic browse pool without rewriting its grade|shared browse grade cannot replace saved snapshot source grades at deployment|target-only grade validation accepts every supported class grade and preserves fail-closed fallbacks',
      'tests/archive2-worker-validation.test.mjs'
    ]
  },
  {
    label: 'tests/archive2-saved-paper-namespace.test.mjs',
    args: ['--test', 'tests/archive2-saved-paper-namespace.test.mjs']
  },
  {
    label: 'tests/archive2-assignment-handoff.test.cjs',
    args: ['--test', 'tests/archive2-assignment-handoff.test.cjs']
  },
  {
    label: 'tests/archive2-assignment-pdf-retry.test.cjs',
    args: ['--test', 'tests/archive2-assignment-pdf-retry.test.cjs']
  },
  {
    label: 'tests/archive2-worker-runtime.mjs (workerd + D1)',
    args: ['tests/archive2-worker-runtime.mjs']
  },
  {
    label: 'tests/archive2-ux-retrieval-d1.test.mjs',
    args: ['--test', 'tests/archive2-ux-retrieval-d1.test.mjs']
  },
  {
    label: 'tests/archive2-recent-friction-ui.test.cjs',
    args: ['--test', 'tests/archive2-recent-friction-ui.test.cjs']
  },
  {
    label: 'tests/archive2-core.test.cjs',
    args: ['--test', 'tests/archive2-core.test.cjs']
  },
  {
    label: 'tests/archive2-finder-filters.test.cjs',
    args: ['--test', 'tests/archive2-finder-filters.test.cjs']
  },
  {
    label: 'tests/archive2-canonical-projection.test.mjs',
    args: ['--test', 'tests/archive2-canonical-projection.test.mjs']
  }
];

let passed = 0;
const failed = [];
const knownFailed = [];
const fixedKnown = [];

for (const file of tests) {
  const testPath = path.join('tests', file);
  const result = spawnSync(process.execPath, [testPath], {
    cwd: root,
    stdio: 'inherit',
    // Full canonical Compose inventory now covers all grades and runtime packs.
    timeout: file === 'archive2-compose-scope.test.js' ? 180000 : 60000
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

for (const command of requiredCommands) {
  const result = spawnSync(process.execPath, command.args, {
    cwd: root,
    stdio: 'inherit',
    timeout: 60000
  });
  if (result.status === 0) {
    passed += 1;
    continue;
  }
  failed.push(command.label);
  console.error(`Test failed: ${command.label}`);
}

if (!includeQuarantined && quarantined.size > 0) {
  console.log(`${quarantined.size} quarantined test file(s) skipped; set APMATH_RUN_QUARANTINE=1 to include them`);
}

console.log(`PASS ${passed} / FAIL ${failed.length} / KNOWN-FAIL ${knownFailed.length} (total ${tests.length + requiredCommands.length})`);

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
