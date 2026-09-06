const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../archive/print-runtime.js');

test('shared readiness tracker requires evidence-backed canonical order independent of transport', () => {
  const runtime = R.createReadinessTracker('ArchiveAdapter');
  runtime.begin({ source: 'archive' });
  for (const state of R.STATES) runtime.mark(state, { state });
  assert.equal(runtime.snapshot().ready, true);
  assert.deepEqual(runtime.snapshot().events.map(event => event.state), R.STATES);
});

test('readiness tracker rejects missing, skipped, and reordered transitions', () => {
  const runtime = R.createReadinessTracker('ClinicAdapter');
  runtime.begin();
  assert.throws(() => runtime.mark('MATH_READY', {}), error => error.code === 'INVALID_READINESS_TRANSITION');
  assert.throws(() => runtime.mark('DATA_READY', null), error => error.code === 'MISSING_READINESS_EVIDENCE');
  runtime.mark('DATA_READY', { payload: true });
  assert.throws(() => runtime.mark('IMAGE_READY', { image: true }), error => error.code === 'INVALID_READINESS_TRANSITION');
});
