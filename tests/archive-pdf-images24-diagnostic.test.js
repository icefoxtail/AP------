'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const D = require('./archive2-pdf-images24-diagnostic.cjs');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const copy = value => JSON.parse(JSON.stringify(value));
const args = ['--diagnostic-only', '--output', '/tmp/pdf-images24-diagnostic'];
const plan = (cycles = 2) => D.diagnosticPlan([...args, '--cycles', String(cycles)], '/checkout', {});
const flush = async () => { for (let i = 0; i < 24; i++) await Promise.resolve(); };

const checkoutHead = 'a'.repeat(40), eventMerge = 'b'.repeat(40);
test('PR head checkout binds to its workflow expectation while preserving the distinct event merge SHA', () => {
  const env = Object.freeze({ ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: checkoutHead, GITHUB_SHA: eventMerge });
  assert.deepEqual(D.checkoutEvidence(checkoutHead, env), {
    expectedCheckoutCommit: checkoutHead, actualCheckoutCommit: checkoutHead, githubEventCommit: eventMerge
  });
  assert.equal(env.GITHUB_SHA, eventMerge);
});
test('push checkout records identical expected, actual and event SHA values without a special fallback', () => {
  const result = D.checkoutEvidence(checkoutHead, { ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: checkoutHead, GITHUB_SHA: checkoutHead });
  assert.deepEqual(result, { expectedCheckoutCommit: checkoutHead, actualCheckoutCommit: checkoutHead, githubEventCommit: checkoutHead });
});
test('an explicit local expectation records the absence of a GitHub event reference', () => {
  assert.equal(D.checkoutEvidence(checkoutHead, { ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: checkoutHead }).githubEventCommit, null);
});
for (const expected of [undefined, '', null, 'a'.repeat(7), 'A'.repeat(40), checkoutHead + '\n'])
  test('rejects missing or malformed workflow expectation even when GITHUB_SHA matches HEAD: ' + JSON.stringify(expected), () => {
    assert.throws(() => D.checkoutEvidence(checkoutHead, { ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: expected, GITHUB_SHA: checkoutHead }),
      /PDF_DIAGNOSTIC_EXPECTED_CHECKOUT_REQUIRED/);
  });
for (const event of [checkoutHead, eventMerge])
  test('a checkout that differs from the workflow expectation is rejected independently of the event SHA: ' + event[0], () => {
    assert.throws(() => D.checkoutEvidence(eventMerge, { ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: checkoutHead, GITHUB_SHA: event }),
      /PDF_DIAGNOSTIC_EXACT_CHECKOUT_REQUIRED/);
  });
for (const event of ['', null, 'b'.repeat(7), eventMerge + '\n'])
  test('a malformed event reference is rejected instead of being silently rewritten: ' + JSON.stringify(event), () => {
    assert.throws(() => D.checkoutEvidence(checkoutHead, { ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: checkoutHead, GITHUB_SHA: event }),
      /PDF_DIAGNOSTIC_EVENT_SHA_INVALID/);
  });
test('the actual CLI main records the PR checkout binding before starting its unchanged diagnostic cycle', async () => {
  const source = fs.readFileSync(path.join(__dirname, 'archive2-pdf-images24-diagnostic.cjs'), 'utf8');
  const start = source.indexOf('async function main() {'), end = source.indexOf('\nmodule.exports =', start);
  assert(start >= 0 && end > start);
  const codeBytes = Buffer.from('SYNTHETIC_CODE'), gitBlob = crypto.createHash('sha1')
    .update(Buffer.concat([Buffer.from(`blob ${codeBytes.length}\0`), codeBytes])).digest('hex');
  const env = Object.freeze({ CHROME_BIN: '/chrome', ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: checkoutHead, GITHUB_SHA: eventMerge });
  let issued, observed = 0;
  const context = vm.createContext({ __dirname: '/checkout/tests', path, crypto, Buffer, hash, checkoutEvidence: D.checkoutEvidence,
    process: { env, argv: ['node', 'diagnostic', ...args] },
    diagnosticPlan: D.diagnosticPlan, requireThat(ok, code) { assert.ok(ok, code); },
    fs: { statSync: () => ({ isFile: () => true }), existsSync: () => false, mkdirSync() {},
      lstatSync: () => ({ isFile: () => true, isSymbolicLink: () => false }), readFileSync: () => codeBytes,
      writeFileSync(file, value) { assert.equal(file, '/tmp/pdf-images24-diagnostic/pdf-images24-diagnostic.json'); issued = JSON.parse(value); } },
    execFileSync(command, values) { assert.equal(command, 'git'); assert.equal(values[0], 'rev-parse');
      return values[1] === 'HEAD' ? checkoutHead + '\n' : gitBlob + '\n'; },
    productionDependencies() { observed++; return {}; }, runDiagnostic: async () => ({ complete: true, failureReproduced: false }),
    console: { log() {} } });
  vm.runInContext(source.slice(start, end), context);
  await context.main();
  assert.equal(observed, 1); assert.equal(issued.currentCommit, checkoutHead);
  assert.deepEqual(issued.checkout, { expectedCheckoutCommit: checkoutHead, actualCheckoutCommit: checkoutHead, githubEventCommit: eventMerge });
  assert.equal(env.GITHUB_SHA, eventMerge);
  context.process.env = Object.freeze({ ...env, ARCHIVE_PDF_DIAGNOSTIC_EXPECTED_SHA: eventMerge });
  await assert.rejects(context.main(), /PDF_DIAGNOSTIC_EXACT_CHECKOUT_REQUIRED/);
  assert.equal(observed, 1, 'a mismatched checkout must fail before browser dependencies run');
});

function fixtures() {
  let bytes = Buffer.from('IMMUTABLE_SYNTHETIC_SOURCE');
  const questions = Array.from({ length: 24 }, (_, i) => ({ id: i + 1 }));
  const fixture = { id: 'images24', kind: 'original', qpp: 4, questions, inputSha256: hash(JSON.stringify(questions)),
    sources: [{ file: 'archive/exams/original/synthetic/images24.js', sha256: hash(bytes) }] };
  const pinned = { fixtures: [{ id: 'irrelevant' }, fixture], sourceOverlay(file) {
    return file === '/' + fixture.sources[0].file ? bytes : undefined;
  } };
  return { fixture, pinned, setBytes: value => { bytes = Buffer.from(value); } };
}
function clock() {
  let now = 0, serial = 0; const timers = new Map(), scheduled = [];
  return { timers, scheduled, setTimeout(callback, delay) { const id = ++serial;
    timers.set(id, { at: now + delay, callback }); scheduled.push(delay); return id; },
    clearTimeout(id) { timers.delete(id); }, async advance(ms) {
      now += ms; for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.callback(); }
      await flush();
    } };
}
function runtime(f = fixtures()) {
  const calls = [], observed = { cycles: [], pdfRows: [], failures: [] }, closed = { browser: 0, server: 0 };
  const browser = { version: () => 'synthetic-chrome', close: async () => { closed.browser++; } };
  const server = { origin: 'http://synthetic.invalid', close: async () => { closed.server++; } };
  const deps = { loadFixtures: async root => { assert.equal(root, '/checkout'); return f.pinned; },
    serve: async (root, sharedRoot, overlay) => { assert.equal(root, '/checkout'); assert.equal(sharedRoot, root);
      assert.equal(overlay, f.pinned.sourceOverlay); return server; },
    launch: async () => browser,
    async cycle(actualBrowser, actualServer, fixture, label, repeat, options) {
      calls.push({ actualBrowser, actualServer, fixture, label, repeat, options });
      observed.cycles.push({ fixture: 'images24', label, repeat, network: 'normal', purpose: 'pdf',
        operations: ['pdf-exam', 'pdf-sol', 'pdf-ans'], completed: 3, pass: true });
      for (const operation of ['pdf-exam', 'pdf-sol', 'pdf-ans']) observed.pdfRows.push({ fixture: 'images24', label, repeat,
        network: 'normal', purpose: 'pdf', operation, pass: true });
      return observed.pdfRows.slice(-3);
    }, observe: () => observed };
  return { f, deps, calls, observed, closed, browser, server };
}

test('the dedicated plan has an explicit role and cannot claim release qualification', () => {
  const p = plan();
  assert.equal(p.diagnosticOnly, true); assert.equal(p.releaseGateStatus, 'NOT_RUN'); assert.equal(p.canReplaceReleaseGate, false);
  assert.equal(p.releaseQualificationExpectedRows, 48); assert.deepEqual(p.operations, ['pdf-exam', 'pdf-sol', 'pdf-ans']);
  assert.equal(p.cycles, 2); assert.equal(p.totalBudgetMs, 480000);
});
for (const bad of [[], ['--output', '/tmp/x'], [...args, '--fixture', 'ordinary'], [...args, '--diagnostic-only'],
  [...args, '--cycles', '1'], [...args, '--cycles', '4'], [...args, '--cycles', '02'], [...args, '--cycles', '2\t'],
  ['--diagnostic-only', '--output', '/checkout/report'], ['--diagnostic-only', '--output', 'relative']])
  test('rejects non-diagnostic or unbounded arguments ' + JSON.stringify(bad), () => {
    assert.throws(() => D.diagnosticPlan(bad, '/checkout', {}), /PDF_DIAGNOSTIC_/);
  });
test('every release-selection environment flag is rejected instead of silently changing a gate', () => {
  for (const key of D.RELEASE_FLAGS) assert.throws(() => D.diagnosticPlan(args, '/checkout', { [key]: '1' }),
    /PDF_DIAGNOSTIC_RELEASE_FLAGS_FORBIDDEN/);
});

test('fixture selection retains the original verified questions and source overlay bytes', () => {
  const f = fixtures(), selected = D.selectPinnedFixture(f.pinned);
  assert.equal(selected.fixture.questions, f.fixture.questions);
  assert.deepEqual(selected.fixture.sources, [f.fixture.sources[0].file]);
  assert.equal(selected.evidence.inputSha256, f.fixture.inputSha256);
  assert.equal(selected.evidence.questionCount, 24);
});
for (const [name, mutate] of [
  ['duplicate', f => f.pinned.fixtures.push(f.fixture)],
  ['missing', f => { f.fixture.id = 'other'; }],
  ['question bytes', f => { f.fixture.questions[0].id = 25; }],
  ['question count', f => f.fixture.questions.pop()],
  ['qpp', f => { f.fixture.qpp = 1; }],
  ['kind', f => { f.fixture.kind = 'envelope'; }],
  ['source bytes', f => f.setBytes('MUTATED_SYNTHETIC_SOURCE')]
]) test('refuses changed qualification input: ' + name, () => {
  const f = fixtures(); mutate(f); assert.throws(() => D.selectPinnedFixture(f.pinned), /PDF_DIAGNOSTIC_/);
});

for (const count of [2, 3]) test(`runs exactly ${count} existing current PDF cycles without replacing their operations`, async () => {
  const r = runtime(), c = clock(), result = await D.runDiagnostic(plan(count), r.deps, c);
  assert.equal(r.calls.length, count);
  for (const [index, call] of r.calls.entries()) {
    assert.equal(call.actualBrowser, r.browser); assert.equal(call.actualServer, r.server);
    assert.equal(call.fixture.questions, r.f.fixture.questions);
    assert.equal(call.label, 'current'); assert.equal(call.repeat, index + 1); assert.deepEqual(call.options, { pdf: true });
  }
  assert.equal(result.observation, 'NO_FAILURE_OBSERVED'); assert.equal(result.complete, true);
  assert.equal(result.releaseGateStatus, 'NOT_RUN'); assert.equal(result.canReplaceReleaseGate, false);
  assert.equal(Object.hasOwn(result, 'pass'), false); assert.equal(result.baselineComparison, 'NOT_RUN');
  assert.equal(result.rows.length, count * 3); assert.deepEqual(r.closed, { browser: 1, server: 1 }); assert.equal(c.timers.size, 0);
});

test('a reproduced strict parity failure remains a failure while a second fresh cycle still observes', async () => {
  const r = runtime(), original = r.deps.cycle;
  r.deps.cycle = async (...values) => {
    const rows = await original(...values); const repeat = values[4];
    if (repeat === 1) { r.observed.cycles[0].pass = false; r.observed.cycles[0].completed = 1;
      r.observed.cycles[0].failedOperation = 'pdf-sol'; r.observed.pdfRows.pop(); r.observed.pdfRows[1].pass = false;
      r.observed.failures.push({ fixture: 'images24', label: 'current', repeat, network: 'normal', purpose: 'pdf', operation: 'pdf-sol',
        error: { code: 'EXTENDED_OUTPUT_PARITY_MISMATCH', details: { field: 'mathMarkupHash' } } }); }
    return rows;
  };
  const result = await D.runDiagnostic(plan(), r.deps, clock());
  assert.equal(r.calls.length, 2); assert.equal(result.failureReproduced, true); assert.equal(result.observation, 'FAILURE_REPRODUCED');
  assert.equal(result.failures[0].error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH'); assert.equal(result.canReplaceReleaseGate, false);
});

test('timeout is bounded and a late cycle resolution cannot start another cycle or turn the report into PASS', async () => {
  const r = runtime(), c = clock(); let release, settled = false;
  r.deps.cycle = (...values) => { r.calls.push(values); return new Promise(resolve => { release = resolve; }); };
  const pending = D.runDiagnostic(plan(), r.deps, c).then(value => { settled = true; return value; });
  await flush(); assert.equal(r.calls.length, 1);
  await c.advance(D.BUDGET_MS - 1); assert.equal(settled, false);
  await c.advance(1); const result = await pending, frozen = JSON.stringify(result);
  assert.equal(result.observation, 'DIAGNOSTIC_TIMEOUT'); assert.equal(result.complete, false);
  assert.equal(result.error.code, 'PDF_DIAGNOSTIC_TOTAL_TIMEOUT'); assert.deepEqual(r.closed, { browser: 1, server: 1 });
  release([]); await flush(); assert.equal(r.calls.length, 1); assert.equal(JSON.stringify(result), frozen);
  assert.equal(c.timers.size, 0);
});

test('a browser that resolves after the total deadline is still closed and cannot execute a cycle', async () => {
  const r = runtime(), c = clock(); let launch;
  r.deps.launch = () => new Promise(resolve => { launch = resolve; });
  const pending = D.runDiagnostic(plan(), r.deps, c); await flush(); await c.advance(D.BUDGET_MS);
  const result = await pending; assert.equal(result.observation, 'DIAGNOSTIC_TIMEOUT');
  launch(r.browser); await flush(); assert.equal(r.calls.length, 0); assert.deepEqual(r.closed, { browser: 1, server: 1 });
});

test('cleanup itself has a finite bound and cannot produce a completed diagnostic if it hangs', async () => {
  const r = runtime(), c = clock(); let settled = false;
  r.browser.close = () => new Promise(() => {});
  const pending = D.runDiagnostic(plan(), r.deps, c).then(value => { settled = true; return value; });
  await flush(); assert.equal(r.calls.length, 2);
  await c.advance(D.CLEANUP_MS - 1); assert.equal(settled, false);
  await c.advance(1); const result = await pending;
  assert.equal(result.complete, false); assert.equal(result.error.code, 'PDF_DIAGNOSTIC_CLEANUP_TIMEOUT');
  assert.equal(result.releaseGateStatus, 'NOT_RUN'); assert.equal(c.timers.size, 0);
});

test('infrastructure failure is redacted, records incomplete observation and closes all opened resources', async () => {
  const r = runtime(), c = clock(); r.deps.cycle = async () => { throw Error('PRIVATE_BROWSER_RAW_MARKUP'); };
  const result = await D.runDiagnostic(plan(), r.deps, c);
  assert.equal(result.observation, 'DIAGNOSTIC_INCOMPLETE'); assert.equal(result.complete, false);
  assert.ok(!JSON.stringify(result).includes('PRIVATE_BROWSER_RAW_MARKUP'));
  assert.equal(result.error.messageSha256, hash('PRIVATE_BROWSER_RAW_MARKUP'));
  assert.deepEqual(r.closed, { browser: 1, server: 1 }); assert.equal(c.timers.size, 0);
});

test('mutation of the original pinned input during observation is not accepted as a completed diagnostic', async () => {
  const r = runtime(), original = r.deps.cycle;
  r.deps.cycle = async (...values) => { const result = await original(...values); if (values[4] === 2) r.f.setBytes('MUTATED'); return result; };
  const result = await D.runDiagnostic(plan(), r.deps, clock());
  assert.equal(result.complete, false); assert.equal(result.error.code, 'PDF_DIAGNOSTIC_SOURCE_BYTES_MISMATCH');
});
test('an observation from another fixture or shortened operation sequence is rejected', () => {
  const p = plan();
  assert.throws(() => D.summarizeObservation(p, { cycles: [{ fixture: 'other', label: 'current', repeat: 1 }] }, 1, null, false), /OBSERVATION_SCOPE/);
  assert.throws(() => D.summarizeObservation(p, { cycles: [{ fixture: 'images24', label: 'current', repeat: 1,
    purpose: 'pdf', network: 'normal', operations: ['pdf-sol'], pass: true }] }, 1, null, false), /UNCHANGED_CYCLE/);
});

test('successful cycle claims with missing operation rows cannot become completed diagnostic observations', () => {
  const cycle = { fixture: 'images24', label: 'current', repeat: 1, purpose: 'pdf', network: 'normal',
    operations: ['pdf-exam', 'pdf-sol', 'pdf-ans'], completed: 3, pass: true };
  assert.throws(() => D.summarizeObservation(plan(), { cycles: [cycle], pdfRows: [] }, 1, null, false), /CYCLE_ROW_INVENTORY/);
});

test('the original PDF_ONLY qualification planner still creates all 48 rows and 24 paired cases', () => {
  const source = fs.readFileSync(path.join(__dirname, 'archive2-output-performance-browser.cjs'), 'utf8');
  const start = source.indexOf('function planCoverage('), end = source.indexOf('\nfunction timeLeft(', start);
  assert(start >= 0 && end > start);
  const context = vm.createContext({ pdfOnly: true, networkOnly: false, skipPdf: false, profileOnly: false, repeats: 1,
    operationsByCycle: { pdf: [{ id: 'pdf-exam', mode: 'exam' }, { id: 'pdf-sol', mode: 'sol' }, { id: 'pdf-ans', mode: 'ans' }] },
    report: { rows: [], pdfRows: [], comparisons: [], networkComparisons: [], pdfComparisons: [], cycles: [], conditions: {} }, phase: 'pdf' });
  vm.runInContext(source.slice(start, end), context);
  context.planCoverage(Array.from({ length: 6 }, (_, i) => ({ id: 'fixture-' + i, qpp: 4 })), { id: 'legacy50' }, { id: 'continuation-golden' });
  assert.equal(context.report.coverage.plannedRows, 48); assert.equal(context.report.coverage.plannedPairs, 24);
  assert.equal(context.report.coverage.measurements.length, 24);
});
