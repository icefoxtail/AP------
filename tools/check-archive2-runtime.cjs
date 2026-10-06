#!/usr/bin/env node
'use strict';

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const files = [
  'tests/archive2-original-source-route.test.cjs',
  'tests/archive2-compose-performance.test.cjs',
  'tests/archive2-preview-feedback.test.cjs',
  'tests/archive2-output-transport.test.cjs',
  'tests/archive2-output-memory-bridge.test.cjs',
  'tests/archive2-unit-envelope-handoff.test.cjs',
  'tests/archive2-output-contract.test.cjs',
  'tests/archive2-output-envelope-routing.test.cjs',
  'tests/archive2-reader-controls.test.cjs',
  'tests/archive2-output-capacity.test.cjs',
  'tests/archive2-pdf-readiness.test.cjs',
];

console.log('Archive2 Runtime Guard — ARCHIVE2_RUNTIME_CONTRACT_V1_20261006');
const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...files], {
  cwd: root, stdio: 'inherit', timeout: 120000,
});
if (result.error) console.error(result.error.message);
process.exit(result.status === 0 && !result.error ? 0 : 1);
