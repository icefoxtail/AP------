'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createHash } = require('node:crypto');
const { prepareArchiveTestProjection } = require('../tools/lib/archive-test-projection.js');

const CATALOG = 'archive/tools/build-archive2-catalog.mjs';
const READINESS = 'archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs';
const RUNTIME = 'archive/data/meta-foundation/runtime/derivative-v1.json';
const RECEIPT = 'archive/data/meta-foundation/runtime/runtime-bridge-receipt.json';

// Model the actual dependency: the manifest hashes source + runtime counts,
// while the receipt must name that manifest. The receipt is not a manifest
// input. These checks fail if either dependency remains at an older version.
function fixture({ readyCount = 5, runtimeCount = 5, failCatalog = false,
  failWrite = false, failCheck = false, invalidReport = false, unstable = false } = {}) {
  const state = { readyCount, runtimeCount, manifest: 'old-projection', receipt: 'old-projection', calls: [] };
  const projection = () => createHash('sha256').update(JSON.stringify({ source: 'current-source', runtimeCount: state.runtimeCount })).digest('hex');
  const run = (_node, args) => {
    state.calls.push(args.slice());
    const bad = stderr => ({ status: 1, stdout: '', stderr });
    if (args[0] === CATALOG) {
      if (failCatalog) return bad('source join defect');
      state.manifest = projection();
      return { status: 0, stdout: '', stderr: '' };
    }
    assert.equal(args[0], READINESS);
    if (state.manifest !== projection()) return bad('canonical input digest mismatch');
    if (args[1] === '--check') {
      if (failCheck) return bad('runtime identity join mismatch');
      if (state.runtimeCount !== state.readyCount || state.receipt !== state.manifest) return bad('runtime receipt stale');
      return { status: 0, stdout: '', stderr: '' };
    }
    assert.equal(args[1], '--write');
    if (failWrite) return bad('canonical source authority incomplete');
    const changedFiles = [];
    const desiredCount = unstable ? state.runtimeCount + 1 : state.readyCount;
    if (state.runtimeCount !== desiredCount) changedFiles.push(RUNTIME);
    if (state.receipt !== state.manifest) changedFiles.push(RECEIPT);
    state.runtimeCount = desiredCount;
    state.receipt = state.manifest;
    if (invalidReport) changedFiles.push('archive/data/question_metadata.json');
    return { status: 0, stderr: '', stdout: JSON.stringify({ status: 'PASS', mode: '--write', changedFiles }) };
  };
  return { state, run, prepare: () => prepareArchiveTestProjection({ root: '/fixture', run, log() {} }) };
}

test('catalog-only preparation reproduces the stale receipt regression', () => {
  const f = fixture();
  assert.equal(f.run(process.execPath, [CATALOG]).status, 0);
  const result = f.run(process.execPath, [READINESS, '--check']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /receipt stale/);
});

test('current source projection is bound to the receipt before checks run', () => {
  const f = fixture();
  assert.deepEqual(f.prepare(), { catalogBuilds: 1, readinessVerified: true });
  assert.equal(f.state.receipt, f.state.manifest);
  assert.deepEqual(f.state.calls.at(-1), [READINESS, '--check']);
});

test('changed runtime counts rebuild the manifest and bind the final receipt', () => {
  const f = fixture({ readyCount: 6 });
  assert.deepEqual(f.prepare(), { catalogBuilds: 2, readinessVerified: true });
  assert.equal(f.state.runtimeCount, 6);
  assert.equal(f.state.receipt, f.state.manifest);
  assert.equal(f.run(process.execPath, [READINESS, '--check']).status, 0);
});

test('a source/catalog defect stops preparation before the readiness writer', () => {
  const f = fixture({ failCatalog: true });
  assert.throws(f.prepare, /source join defect/);
  assert.equal(f.state.calls.length, 1);
});

test('a rejected readiness write remains fatal without a blind retry', () => {
  const f = fixture({ failWrite: true });
  assert.throws(f.prepare, /canonical source authority incomplete/);
  assert.equal(f.state.calls.filter(args => args[1] === '--write').length, 1);
  assert.equal(f.state.calls.some(args => args[1] === '--check'), false);
});

test('runtime inputs that keep changing cannot produce a successful projection', () => {
  const f = fixture({ unstable: true });
  assert.throws(f.prepare, /did not stabilize/);
  assert.equal(f.state.calls.filter(args => args[0] === CATALOG).length, 2);
});

test('the preparation cannot accept writes outside the derived readiness outputs', () => {
  const f = fixture({ invalidReport: true });
  assert.throws(f.prepare, /invalid output scope/);
});

test('the final strict readiness check is mandatory even after successful writes', () => {
  const f = fixture({ failCheck: true });
  assert.throws(f.prepare, /runtime identity join mismatch/);
  assert.deepEqual(f.state.calls.at(-1), [READINESS, '--check']);
});
