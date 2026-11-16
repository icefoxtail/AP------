'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash, webcrypto } = require('node:crypto');
const { test } = require('node:test');

const source = fs.readFileSync(path.join(__dirname, 'archive2-output-performance-browser.cjs'), 'utf8');
const ordinary = fs.readFileSync(path.join(__dirname, 'archive2-solution-loading-browser.cjs'), 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const plain = value => JSON.parse(JSON.stringify(value));
function range(text, start, end) {
  const a = text.indexOf(start), b = text.indexOf(end, a);
  assert.ok(a >= 0 && b > a, `actual helper range missing: ${start}`);
  return text.slice(a, b);
}
function childNode(type, name, value = null, children = [], namespace = null) {
  return Object.freeze({ nodeType: type, nodeName: name, nodeValue: value, namespaceURI: namespace,
    childNodes: Object.freeze(children) });
}
function math(markup, elements = [], childNodes = []) {
  const children = elements.map(([tag, attributes = {}]) => Object.freeze({ localName: tag,
    attributes: Object.freeze(Object.entries(attributes).map(([name, value]) => Object.freeze({ name, value }))) }));
  return Object.freeze({ innerHTML: markup, childNodes: Object.freeze(childNodes), querySelectorAll(selector) {
    assert.equal(selector, '*'); return children;
  }, getBoundingClientRect: () => ({ width: 30, height: 20 }) });
}
function fixture({ pdf = false } = {}) {
  let nodes = [], now = 0, serial = 0, evaluations = 0;
  const timers = new Map(), scheduled = [], returned = [];
  const area = Object.freeze({ querySelectorAll: selector => selector === 'mjx-container' ? nodes : [] });
  const runtime = Object.freeze({ inspect: () => ({ attempts: [] }), busy: false, whenIdle: async () => {},
    activeSnapshot: pdf ? Object.freeze({ snapshotId: 'fixed', mode: 'sol', rootNode: area }) : null,
    committedCandidate: pdf ? Object.freeze({ mode: 'sol' }) : null });
  const state = Object.freeze({ data: Object.freeze([]) });
  const window = { AppState: state, archiveScreenRuntime: runtime,
    __solutionLoadingQA: { calls: [], operationStart: 0 },
    __outputPerformance: { imageBuildFailures: [], operation: 0, adapters: [], metadata: {} },
    ...(pdf ? { __AP_RENDER_READY__: Promise.resolve({ ok: true }) } : {}) };
  const context = vm.createContext({ window, document: Object.freeze({ getElementById: () => area,
    fonts: Object.freeze({ ready: Promise.resolve(), status: 'loaded' }) }),
    crypto: webcrypto, TextEncoder, URLSearchParams, URL, location: { search: '?mode=sol' },
    performance: { getEntriesByType: () => [], now: () => now }, hash, Buffer,
    round: value => Number(Number(value).toFixed(2)), requestAnimationFrame: callback => callback(),
    inspectPdf: () => ({ synthetic: true }),
    Date: class extends Date { static now() { return now; } },
    operationTimeoutMs: 90000, suiteDeadline: 1500000,
    setTimeout(callback, delay) { const id = ++serial; scheduled.push(delay); timers.set(id, { at: now + delay, callback }); return id; },
    clearTimeout(id) { timers.delete(id); } });
  const code = [
    range(source, 'function requireThat(', '\nfunction writeReport('),
    range(source, 'function timeLeft(', '\nfunction installProfile('),
    range(ordinary, 'function compareRows(', '\nasync function preflight('),
    'const H = { compareRows };',
    range(source, 'async function documentEvidence(', '\nasync function awaitInitialOutcome('),
    range(source, 'async function pdfMathMarkupDiagnostic(', '\nasync function printPdfMetadata('),
    range(source, 'async function printPdfMetadata(', '\nasync function openSession('),
    range(source, 'function compare(before, after)', '\nfunction compareCycles(')
  ].join('\n');
  vm.runInContext(code, context, { filename: 'actual-pdf-diagnostic-helper' });
  const page = { async evaluate(callback, argument) {
    evaluations++; const result = await callback(argument); returned.push(plain(result)); return result;
  } };
  const row = evidence => ({ ...plain(evidence), pass: true, fixture: 'synthetic', operation: 'pdf-sol', mode: 'sol', qpp: 4,
    questionCount: 1, blockCount: 1, pageCount: 1, bodyHash: 'body-fixed', sourceOrder: ['synthetic#1'],
    mathCount: 1, images: [], pages: [{ width: 800, height: 1100, textHash: 'page-fixed', images: [],
      blocks: [{ sourceRef: 'synthetic#1', textHash: 'block-fixed', x: 10, y: 20, width: 700, height: 500 }] }] });
  return { context, window, state, runtime, area, page, row, returned, timers, scheduled,
    evaluations: () => evaluations, setNodes: value => { nodes = value; },
    async capture(nextNodes, capturePdfMath = true) {
      nodes = nextNodes; return context.documentEvidence(page, capturePdfMath);
    },
    async diagnostic(before, after) { return plain(await context.pdfMathMarkupDiagnostic(page, before.mathMarkupHash, after.mathMarkupHash)); },
    async failure(before, after, targetPage = page) {
      const error = await context.comparePdfScreen(targetPage, row(before), row(after)).then(() => null, error => error);
      assert.ok(error, 'actual comparison must still fail'); return error;
    },
    async advance(milliseconds) {
      now += milliseconds;
      for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.callback(); }
      for (let turn = 0; turn < 10; turn++) await Promise.resolve();
    } };
}

test('PDF snapshots use the existing hash and keep raw markup inside Chrome only', async () => {
  const f = fixture();
  const markup = '<svg id="MJX-13"><text>PRIVATE_TEX_BODY_SENTINEL</text></svg>';
  const before = await f.capture([math(markup, [['svg', { id: 'MJX-13' }], ['text']])]);
  assert.equal(before.mathMarkupHash, hash(JSON.stringify([markup.replace(/MJX-\d+/g, 'MJX-N')])));
  assert.equal(f.window.__archivePdfMathSnapshots.size, 1);
  assert.ok(!JSON.stringify(before).includes('PRIVATE_TEX_BODY_SENTINEL'));
  assert.ok(!JSON.stringify(f.returned).includes('<svg'));
  assert.equal(f.window.AppState, f.state); assert.equal(f.window.archiveScreenRuntime, f.runtime);
  assert.deepEqual(Object.keys(f.window).sort(), ['AppState', '__archivePdfMathSnapshots', '__outputPerformance', '__solutionLoadingQA', 'archiveScreenRuntime'].sort());
});

test('performance capture does not create the PDF cache', async () => {
  const f = fixture(); await f.capture([math('<svg/>')], false);
  assert.equal(Object.hasOwn(f.window, '__archivePdfMathSnapshots'), false);
});

test('PDF cache retains at most the last two distinct aggregate hashes', async () => {
  const f = fixture(); const rows = [];
  for (const value of ['a', 'b', 'c']) rows.push(await f.capture([math('<text>' + value + '</text>', [['text']])]));
  assert.equal(f.window.__archivePdfMathSnapshots.size, 2);
  assert.equal(f.window.__archivePdfMathSnapshots.has(rows[0].mathMarkupHash), false);
  const result = await f.diagnostic(rows[0], rows[2]);
  assert.deepEqual(result, { schemaVersion: 'archive-pdf-math-markup-diagnostic-v1', status: 'UNAVAILABLE', reason: 'SNAPSHOT_MISSING' });
});

test('value-only math markup mismatch still fails and reports attribute names without values', async () => {
  const f = fixture();
  const before = await f.capture([math('<svg><path d="PRIVATE_BEFORE_PATH"/></svg>', [['svg'], ['path', { d: 'PRIVATE_BEFORE_PATH' }]])]);
  const after = await f.capture([math('<svg><path d="PRIVATE_AFTER_PATH"/></svg>', [['svg'], ['path', { d: 'PRIVATE_AFTER_PATH' }]])]);
  const error = await f.failure(before, after);
  assert.equal(error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH'); assert.equal(error.details.field, 'mathMarkupHash');
  const report = plain(f.context.safeError(error));
  const diagnostic = report.details.mathMarkupDiagnostic;
  assert.equal(diagnostic.status, 'CAPTURED'); assert.equal(diagnostic.changedNodeCount, 1);
  assert.deepEqual(diagnostic.nodes[0].elementChanges, [{ elementIndex: 1, beforeTag: 'path', afterTag: 'path',
    addedAttributeNames: [], removedAttributeNames: [], changedAttributeNames: ['d'] }]);
  assert.deepEqual(diagnostic.nodes[0].tagCountChanges, []);
  for (const sentinel of ['PRIVATE_BEFORE_PATH', 'PRIVATE_AFTER_PATH', '<svg', '<path']) assert.ok(!JSON.stringify(report).includes(sentinel));
  assert.equal(f.timers.size, 0); assert.deepEqual(f.scheduled, [5000]);
});

for (const attribute of ['viewBox', 'href', 'aria-label']) test(`changed ${attribute} values remain strict mismatches`, async () => {
  const f = fixture();
  const before = await f.capture([math(`<svg ${attribute}="PRIVATE_OLD"/>`, [['svg', { [attribute]: 'PRIVATE_OLD' }]])]);
  const after = await f.capture([math(`<svg ${attribute}="PRIVATE_NEW"/>`, [['svg', { [attribute]: 'PRIVATE_NEW' }]])]);
  const error = await f.failure(before, after);
  assert.equal(error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH');
  assert.deepEqual(plain(error.details.mathMarkupDiagnostic.nodes[0].elementChanges[0].changedAttributeNames), [attribute]);
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('PRIVATE_'));
});

test('tag and attribute presence changes are reported with exact document-order counts', async () => {
  const f = fixture();
  const before = await f.capture([math('<svg><path d="secret"/></svg>', [['svg'], ['path', { d: 'secret' }]])]);
  const after = await f.capture([math('<svg role="img"><use href="secret"/><use/></svg>', [['svg', { role: 'img' }], ['use', { href: 'secret' }], ['use']])]);
  const result = await f.diagnostic(before, after), node = result.nodes[0];
  assert.equal(node.beforeElementCount, 2); assert.equal(node.afterElementCount, 3);
  assert.deepEqual(node.tagCountChanges, [{ name: 'path', before: 1, after: 0 }, { name: 'use', before: 0, after: 2 }]);
  assert.deepEqual(node.attributeNameCountChanges, [{ name: 'd', before: 1, after: 0 }, { name: 'href', before: 0, after: 1 }, { name: 'role', before: 0, after: 1 }]);
  assert.deepEqual(node.elementChanges[1], { elementIndex: 1, beforeTag: 'path', afterTag: 'use',
    addedAttributeNames: ['href'], removedAttributeNames: ['d'], changedAttributeNames: [] });
});

test('node insertion and removal have null hashes and complete per-node inventory', async () => {
  const f = fixture(), a = math('<svg/>', [['svg']]), b = math('<math/>', [['math']]);
  const before = await f.capture([a]), after = await f.capture([a, b]);
  const added = await f.diagnostic(before, after), removed = await f.diagnostic(after, before);
  assert.equal(added.beforeNodeCount, 1); assert.equal(added.afterNodeCount, 2); assert.equal(added.nodes.length, 2);
  assert.equal(added.nodes[0].changed, false); assert.equal(added.nodes[1].beforeSha256, null);
  assert.equal(added.nodes[1].afterSha256, hash('<math/>'));
  assert.equal(removed.nodes[1].afterSha256, null); assert.equal(removed.changedNodeCount, 1);
});

test('text-only changes expose only different hashes, never text or guessed normalization', async () => {
  const f = fixture();
  const before = await f.capture([math('<text>PRIVATE_TEX_BEFORE</text>', [['text']])]);
  const after = await f.capture([math('<text>PRIVATE_TEX_AFTER</text>', [['text']])]);
  const result = await f.diagnostic(before, after);
  assert.equal(result.nodes[0].beforeSha256, hash('<text>PRIVATE_TEX_BEFORE</text>'));
  assert.equal(result.nodes[0].afterSha256, hash('<text>PRIVATE_TEX_AFTER</text>'));
  assert.equal(result.nodes[0].changed, true); assert.deepEqual(result.nodes[0].elementChanges, []);
  assert.ok(!JSON.stringify(result).includes('PRIVATE_TEX'));
});

test('ordered attribute changes are distinct from changed values and remain parity failures', async () => {
  const f = fixture(), children = [childNode(1, 'svg', null, [], 'http://www.w3.org/2000/svg')];
  const before = await f.capture([math('<svg id="PRIVATE" class="x"></svg>', [['svg', { id: 'PRIVATE', class: 'x' }]], children)]);
  const after = await f.capture([math('<svg class="x" id="PRIVATE"></svg>', [['svg', { class: 'x', id: 'PRIVATE' }]], children)]);
  const error = await f.failure(before, after), node = plain(error.details.mathMarkupDiagnostic.nodes[0]);
  assert.equal(error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH');
  assert.deepEqual(node.elementChanges, []);
  assert.deepEqual(node.attributeOrderChanges, [{ elementIndex: 0, tag: 'svg', beforeOrder: ['id', 'class'], afterOrder: ['class', 'id'] }]);
  assert.deepEqual(node.characterDataChanges, []); assert.deepEqual(node.childNodeTypeChanges, []);
  assert.equal(node.beforeChildStructureSha256, node.afterChildStructureSha256);
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('PRIVATE'));
});

for (const [kind, type, name, beforeValue, afterValue] of [
  ['text', 3, '#text', 'PRIVATE_MATH_BEFORE', 'PRIVATE_MATH_AFTER'],
  ['comment', 8, '#comment', 'PRIVATE_COMMENT_BEFORE', 'PRIVATE_COMMENT_AFTER'],
  ['whitespace text', 3, '#text', ' ', '\n  '],
  ['CDATA', 4, '#cdata-section', 'PRIVATE_CDATA_BEFORE', 'PRIVATE_CDATA_AFTER']
]) test(`${kind} changes have exact hashes and types without leaking character data`, async () => {
  const f = fixture();
  const make = value => math(`<span>${value}</span>`, [['span']], [childNode(1, 'SPAN', null, [childNode(type, name, value)])]);
  const before = await f.capture([make(beforeValue)]), after = await f.capture([make(afterValue)]);
  const error = await f.failure(before, after), node = plain(error.details.mathMarkupDiagnostic.nodes[0]);
  assert.equal(error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH');
  assert.deepEqual(node.elementChanges, []); assert.deepEqual(node.attributeOrderChanges, []);
  assert.equal(node.beforeChildNodeCount, 2); assert.equal(node.afterChildNodeCount, 2);
  assert.equal(node.beforeChildStructureSha256, node.afterChildStructureSha256);
  assert.deepEqual(node.childNodeTypeChanges, []);
  assert.deepEqual(node.characterDataChanges, [{ childIndex: 1, beforePath: [0, 0], afterPath: [0, 0],
    beforeType: type, afterType: type, beforeLength: beforeValue.length, afterLength: afterValue.length,
    beforeSha256: hash(beforeValue), afterSha256: hash(afterValue),
    beforeWhitespaceOnly: /^\s*$/.test(beforeValue), afterWhitespaceOnly: /^\s*$/.test(afterValue) }]);
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('PRIVATE_'));
  assert.ok(!JSON.stringify(f.returned).includes('<span>'));
});

test('comment insertion reports an exact child position and a null prior hash', async () => {
  const f = fixture();
  const before = await f.capture([math('<span></span>', [['span']], [childNode(1, 'SPAN')])]);
  const after = await f.capture([math('<span><!--PRIVATE_COMMENT--></span>', [['span']],
    [childNode(1, 'SPAN', null, [childNode(8, '#comment', 'PRIVATE_COMMENT')])])]);
  const error = await f.failure(before, after), node = plain(error.details.mathMarkupDiagnostic.nodes[0]);
  assert.equal(node.beforeChildNodeCount, 1); assert.equal(node.afterChildNodeCount, 2);
  assert.notEqual(node.beforeChildStructureSha256, node.afterChildStructureSha256);
  assert.deepEqual(node.childNodeTypeChanges, [{ childIndex: 1, beforePath: null, afterPath: [0, 0],
    beforeType: null, afterType: 8, beforeName: null, afterName: '#comment' }]);
  assert.equal(node.characterDataChanges[0].beforeSha256, null);
  assert.equal(node.characterDataChanges[0].afterSha256, hash('PRIVATE_COMMENT'));
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('PRIVATE_COMMENT'));
});

test('child text reordering is detected even when the element and child type structure is unchanged', async () => {
  const f = fixture();
  const make = values => math(`<span>${values.join('')}</span>`, [['span']],
    [childNode(1, 'SPAN', null, values.map(value => childNode(3, '#text', value)))]);
  const before = await f.capture([make(['PRIVATE_A', 'PRIVATE_B'])]);
  const after = await f.capture([make(['PRIVATE_B', 'PRIVATE_A'])]);
  const error = await f.failure(before, after), node = plain(error.details.mathMarkupDiagnostic.nodes[0]);
  assert.equal(node.characterDataChanges.length, 2);
  assert.equal(node.beforeChildStructureSha256, node.afterChildStructureSha256);
  assert.deepEqual(node.childNodeTypeChanges, []); assert.deepEqual(node.elementChanges, []);
  assert.equal(node.characterDataChanges[0].beforeSha256, node.characterDataChanges[1].afterSha256);
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('PRIVATE_'));
});

test('changed child nesting is diagnosed independently of element document order', async () => {
  const f = fixture();
  const before = await f.capture([math('<span><i></i></span>', [['span'], ['i']], [childNode(1, 'SPAN', null, [childNode(1, 'I')])])]);
  const after = await f.capture([math('<span></span><i></i>', [['span'], ['i']], [childNode(1, 'SPAN'), childNode(1, 'I')])]);
  const error = await f.failure(before, after), node = plain(error.details.mathMarkupDiagnostic.nodes[0]);
  assert.deepEqual(node.elementChanges, []); assert.deepEqual(node.characterDataChanges, []);
  assert.notEqual(node.beforeChildStructureSha256, node.afterChildStructureSha256);
  assert.deepEqual(node.childNodeTypeChanges, [{ childIndex: 1, beforePath: [0, 0], afterPath: [1],
    beforeType: 1, afterType: 1, beforeName: 'I', afterName: 'I' }]);
});

test('existing numeric MJX normalization is unchanged and adds no new exception', async () => {
  const f = fixture();
  const before = await f.capture([math('<svg id="MJX-1"/>', [['svg', { id: 'MJX-1' }]])]);
  const after = await f.capture([math('<svg id="MJX-999"/>', [['svg', { id: 'MJX-999' }]])]);
  assert.equal(before.mathMarkupHash, after.mathMarkupHash);
  const evaluations = f.evaluations();
  assert.equal((await f.context.comparePdfScreen(f.page, f.row(before), f.row(after))).pass, true);
  assert.equal(f.evaluations(), evaluations); assert.equal(f.scheduled.length, 0);
});

test('changed snapshot cache is reported unavailable and never alters the original failure', async () => {
  const f = fixture(); const before = await f.capture([math('old')]), after = await f.capture([math('new')]);
  f.window.__archivePdfMathSnapshots.get(before.mathMarkupHash)[0].markup = 'private-tampering';
  const error = await f.failure(before, after);
  assert.equal(error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH');
  assert.equal(error.details.mathMarkupDiagnostic.reason, 'SNAPSHOT_HASH_MISMATCH');
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('private-tampering'));
});

test('diagnostic exception is redacted while preserving the same parity error', async () => {
  const f = fixture(); const before = await f.capture([math('old')]), after = await f.capture([math('new')]);
  const error = await f.failure(before, after, { evaluate: async () => { throw Error('PRIVATE_EXCEPTION_MARKUP'); } });
  assert.equal(error.message, 'EXTENDED_OUTPUT_PARITY_MISMATCH');
  assert.equal(error.details.mathMarkupDiagnostic.reason, 'DIAGNOSTIC_CAPTURE_FAILED');
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('PRIVATE_EXCEPTION_MARKUP')); assert.equal(f.timers.size, 0);
});

test('diagnostic timeout stays bounded at 5000 ms and late resolution cannot turn failure into PASS', async () => {
  const f = fixture(); const before = await f.capture([math('old')]), after = await f.capture([math('new')]);
  let resolve, settled = false;
  const pending = new Promise(yes => { resolve = yes; });
  const result = f.failure(before, after, { evaluate: () => pending }).then(error => { settled = true; return error; });
  await f.advance(4999); assert.equal(settled, false);
  await f.advance(1); const error = await result;
  assert.equal(error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH'); assert.equal(error.details.mathMarkupDiagnostic.status, 'UNAVAILABLE');
  const frozen = JSON.stringify(f.context.safeError(error)); resolve({ status: 'PASS', value: 'PRIVATE_LATE_RESULT' });
  await f.advance(1); assert.equal(JSON.stringify(f.context.safeError(error)), frozen); assert.equal(f.timers.size, 0);
});

test('body and input mismatches keep their original guard order without diagnostic capture', async () => {
  const f = fixture(); const before = await f.capture([math('old')]), after = await f.capture([math('new')]);
  const evaluations = f.evaluations();
  await assert.rejects(f.context.comparePdfScreen(f.page, f.row(before), { ...f.row(after), bodyHash: 'changed' }),
    error => error.code === 'OUTPUT_PARITY_MISMATCH' && error.details.field === 'bodyHash' && !error.details.mathMarkupDiagnostic);
  await assert.rejects(f.context.comparePdfScreen(f.page, f.row(before), { ...f.row(after), inputHash: 'changed' }),
    error => error.code === 'EXTENDED_OUTPUT_PARITY_MISMATCH' && error.details.field === 'inputHash' && !error.details.mathMarkupDiagnostic);
  assert.equal(f.evaluations(), evaluations);
});

test('one-pixel geometry and PDF raster parity guards remain unchanged', async () => {
  const f = fixture(), evidence = await f.capture([math('<svg/>')]);
  const before = f.row(evidence), after = f.row(evidence); after.mathGeometry[0].width++;
  assert.equal((await f.context.comparePdfScreen(f.page, before, after)).pass, true);
  after.mathGeometry[0].width++;
  await assert.rejects(f.context.comparePdfScreen(f.page, before, after), error => error.code === 'MATH_GEOMETRY_CHANGED');
  const pdf = { generated: true, pageCount: 1, mediaBoxes: [[0, 0, 600, 800]], raster: { paintedSha256: 'before', inspectionElapsedMs: 1 } };
  await assert.rejects(f.context.comparePdfScreen(f.page, { ...before, pdf }, { ...f.row(evidence), pdf: { ...pdf,
    raster: { paintedSha256: 'after', inspectionElapsedMs: 1 } } }), error => error.code === 'PDF_PAINTED_OUTPUT_PARITY_FAILED');
});

test('the actual post-PDF capture attaches diagnostics to its original strict comparison failure', async () => {
  const f = fixture({ pdf: true });
  const before = await f.capture([math('<svg><use href="PRIVATE_BEFORE"/></svg>', [['svg'], ['use', { href: 'PRIVATE_BEFORE' }]])]);
  const H = vm.runInContext('H', f.context);
  H.capture = async () => f.row(before);
  H.assertReady = (row, count) => assert.equal(row.questionCount, count);
  let printed = 0;
  const session = { page: f.page, cdp: { async send(method, options) {
    assert.equal(method, 'Page.printToPDF'); assert.equal(options.preferCSSPageSize, true); printed++;
    f.setNodes([math('<svg><use href="PRIVATE_AFTER"/></svg>', [['svg'], ['use', { href: 'PRIVATE_AFTER' }]])]);
    return { data: Buffer.from('%PDF-1.4\n/Type /Page\n/MediaBox [0 0 600 800]').toString('base64') };
  } } };
  const error = await f.context.printPdfMetadata(session, f.row(before)).then(() => null, error => error);
  assert.equal(printed, 1); assert.equal(error.code, 'EXTENDED_OUTPUT_PARITY_MISMATCH');
  assert.equal(error.details.field, 'mathMarkupHash');
  assert.equal(error.details.mathMarkupDiagnostic.beforeHash, before.mathMarkupHash);
  assert.deepEqual(plain(error.details.mathMarkupDiagnostic.nodes[0].elementChanges[0].changedAttributeNames), ['href']);
  assert.ok(!JSON.stringify(f.context.safeError(error)).includes('PRIVATE_')); assert.equal(f.timers.size, 0);
});
