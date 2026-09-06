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

test('a failed transaction cannot reach RENDER_READY or PRINT_READY', () => {
  const runtime = R.createReadinessTracker('MixerAdapter');
  runtime.begin({ source: 'storage' });
  runtime.mark('DATA_READY', { questions: 1 });
  runtime.mark('MATH_READY', { source: 'local' });
  runtime.fail('RENDER_FAILED', { message: 'intentional render mutation' });

  const snapshot = runtime.snapshot();
  assert.equal(snapshot.failed, true);
  assert.equal(snapshot.ready, false);
  assert.equal(snapshot.failure.code, 'RENDER_FAILED');
  assert.throws(() => runtime.mark('IMAGE_READY', { images: 0 }), error => error.code === 'READINESS_TRANSACTION_FAILED');
  assert.throws(() => R.assertSuccessfulRender({ ok: false, code: 'RENDER_FAILED' }), error => error.code === 'RENDER_TRANSACTION_INCOMPLETE');
});

test('the pre-render sentinel is fail-closed for every selected print transport', () => {
  assert.throws(
    () => R.assertSuccessfulRender({ ok: false, code: 'RENDER_NOT_STARTED' }),
    error => error.code === 'RENDER_TRANSACTION_INCOMPLETE' && error.details.outcome.code === 'RENDER_NOT_STARTED'
  );
});

test('image error or timeout mutation blocks IMAGE_READY rather than treating an image count as evidence', () => {
  assert.deepEqual(R.summarizeImageReadiness([{ status: 'loaded' }, { status: 'loaded' }]), {
    images: 2, loaded: 2, errors: 0, timeouts: 0
  });
  assert.throws(
    () => R.summarizeImageReadiness([{ status: 'loaded' }, { status: 'error', reason: 'LOAD_ERROR' }]),
    error => error.code === 'IMAGE_READINESS_INCOMPLETE' && error.details.summary.errors === 1
  );
  assert.throws(
    () => R.summarizeImageReadiness([{ status: 'timeout', reason: 'LOAD_TIMEOUT' }]),
    error => error.code === 'IMAGE_READINESS_INCOMPLETE' && error.details.summary.timeouts === 1
  );
});
