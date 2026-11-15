'use strict';

const { spawnSync } = require('child_process');

// These are the complete outputs of the official readiness writer. The test
// runner's output guard owns only its own generated changes to these paths.
const READINESS_OUTPUT_FILES = Object.freeze([
  'archive/data/meta-foundation/runtime/derivative-v1.json',
  'archive/data/meta-foundation/runtime/integral-calculus-v1.json',
  'archive/data/meta-foundation/runtime/middle-geometry-v1.json',
  'archive/data/meta-foundation/runtime/runtime-bridge-receipt.json',
]);
const RECEIPT = READINESS_OUTPUT_FILES.at(-1);
const CATALOG = 'archive/tools/build-archive2-catalog.mjs';
const READINESS = 'archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs';

function prepareArchiveTestProjection({ root, run = spawnSync, log = text => process.stdout.write(text) }) {
  const checked = (args, capture = false) => {
    const result = run(process.execPath, args, {
      cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 32 * 1024 * 1024,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
    if (capture && result.stdout) log(result.stdout);
    if (capture && result.stderr) log(result.stderr);
    if (result.error || result.status !== 0)
      throw new Error(`Archive test projection failed: ${args.join(' ')}: ${result.error?.message || result.stderr || result.signal || result.status}`);
    return result.stdout || '';
  };
  const refresh = () => {
    let report;
    try { report = JSON.parse(checked([READINESS, '--write'], true)); }
    catch (error) { throw new Error(`Archive test readiness refresh failed: ${error.message}`); }
    if (report.status !== 'PASS' || report.mode !== '--write' || !Array.isArray(report.changedFiles)
        || report.changedFiles.some(file => !READINESS_OUTPUT_FILES.includes(file)))
      throw new Error('Archive test readiness returned an invalid output scope');
    return report.changedFiles.some(file => file !== RECEIPT);
  };

  checked([CATALOG]);
  let catalogBuilds = 1;
  // A new catalog projection invalidates the receipt even if no pack row
  // changed. Refresh it before any test reads the current projection version.
  if (refresh()) {
    // Readiness counts live in manifest inputs. Rebuild only when that writer
    // changed such an input, then bind the receipt to the resulting manifest.
    checked([CATALOG]);
    catalogBuilds += 1;
    if (refresh()) throw new Error('Archive test readiness runtime inputs did not stabilize');
  }
  // This validates both the final manifest input hashes and exact receipt
  // bytes. A genuine join/source defect or another drift remains a failure.
  checked([READINESS, '--check']);
  return { catalogBuilds, readinessVerified: true };
}

module.exports = { prepareArchiveTestProjection, READINESS_OUTPUT_FILES };
