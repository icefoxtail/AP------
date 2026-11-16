'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const helperPath = path.resolve(__dirname, '../tools/m2s1-problem-capture-diagnostic.cjs');
const helper = require(helperPath);
const shared = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const copy = value => JSON.parse(JSON.stringify(value));
const commit = 'a'.repeat(40);
const ref = expected => ({ commit, ...expected });
function scope() {
  const e = helper.EXPECTED;
  return { checkoutCommit: commit, item: { key: e.key, questionUid: e.questionUid, sourceOrdinal: e.sourceOrdinal, expectedBankCount: e.expectedBankCount,
    questionSha256: e.questionSha256, surfacePayloadSha256: e.surfacePayloadSha256, sourceRef: ref(e.source), assetRefs: [ref(e.asset)] },
    viewport: copy(e.viewport), surface: 'PROBLEM', mode: 'exam', failureCode: helper.FAILURE_CODE,
    manifestRef: ref(e.manifest), captureHelperRef: ref(e.captureHelper) };
}

function pageFixture(options = {}) {
  const make = (tag, classes, r, text = '') => ({ nodeType: 1, tagName: tag, classList: new Set(classes), childNodes: [], parentNode: null,
    textContent: text, _rect: r, _style: { display: 'block', visibility: 'visible', opacity: '1', position: 'static' },
    getBoundingClientRect() { return this._rect; },
    contains(other) { return this === other || this.childNodes.some(child => child === other || child.nodeType === 1 && child.contains(other)); },
    closest(selector) { let current = this; while (current) { if (selector === '.q-box' && current.classList.has('q-box')) return current; current = current.parentNode; } return null; },
    querySelectorAll(selector) {
      const tokens = selector.split(','), matches = node => tokens.some(token => token[0] === '.' ? node.classList.has(token.slice(1)) : node.tagName.toLowerCase() === token);
      const found = []; const visit = node => { for (const child of node.childNodes) if (child.nodeType === 1) { if (matches(child)) found.push(child); visit(child); } };
      visit(this); return found;
    },
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  });
  const add = (parent, ...children) => { parent.childNodes.push(...children); for (const child of children) child.parentNode = parent; };
  const box = make('DIV', ['q-box'], { x: 28, y: 50, width: 334, height: 700 });
  const header = make('DIV', ['q-header'], { x: 28, y: 50, width: 334, height: 30 });
  const number = make('SPAN', ['q-num'], { x: 28, y: 50, width: 25, height: 25 }, options.ordinal || '17.');
  const content = make('DIV', ['q-content', 'private_STUDENT_TEXT'], { x: 28, y: 90, width: 334, height: 600 }, 'RAW_PROBLEM_TEXT_NOT_FOR_OUTPUT');
  const image = make('IMG', [], { x: 38, y: 130, width: 300, height: 240 });
  Object.assign(image, { currentSrc: 'https://img.wangjiedu.com/exams/images/' + helper.EXPECTED.asset.path.slice('archive/assets/images/'.length),
    complete: true, naturalWidth: 753, naturalHeight: 593 });
  const whitespace = { nodeType: 3, textContent: ' \n ', _rect: { x: 0, y: 0, width: 0, height: 0 } };
  add(header, number); add(content, image); add(box, header, whitespace, content);
  const print = make('DIV', [], { x: 0, y: 0, width: 390, height: 2000 }); add(print, box);
  if (options.hiddenWorkspace) { const work = make('DIV', ['workspace'], { x: 28, y: 690, width: 334, height: 60 }); work._style.display = 'none'; add(box, work); }
  if (options.hiddenContent) content._style.visibility = 'hidden';
  if (options.textChild) add(box, { nodeType: 3, textContent: 'RAW_INLINE_STUDENT_TEXT', _rect: { x: 28, y: 695, width: 100, height: 20 } });
  const toolbar = make('DIV', [], { x: 0, y: 0, width: 390, height: 60 }); toolbar._style.position = 'fixed';
  const all = [print, box, header, number, content, image, ...(options.toolbar ? [toolbar] : [])];
  const document = {
    documentElement: { dataset: { apPrintReadiness: JSON.stringify({ state: 'RENDER_READY' }) } },
    querySelector: selector => selector === '#print-area' ? print : null,
    querySelectorAll: selector => selector.includes('.sol-box') ? Array(options.solution ? 1 : 0).fill({}) : selector === '#print-area img' ? [image] : selector === 'body *' ? all : [],
    getElementById: () => null,
    createRange() { return { selectNodeContents(node) { this.node = node; }, getBoundingClientRect() { return this.node._rect; } }; },
    elementFromPoint: (_x, y) => options.toolbar && y < 60 ? toolbar : box
  };
  let htmlReads = 0;
  Object.defineProperty(box, 'outerHTML', { get() { htmlReads++; return 'RAW_HTML_WITH_ATTRIBUTE_VALUES_' + (options.domChanges && htmlReads > 2 ? 'CHANGED' : 'STABLE'); } });
  const context = { crypto: crypto.webcrypto, TextEncoder, URL, Node: { ELEMENT_NODE: 1, TEXT_NODE: 3 }, document,
    getComputedStyle: element => element._style, innerWidth: options.width || 390, innerHeight: 844, scrollX: 0, scrollY: 0,
    AppState: { mode: options.mode || 'exam', data: Array(options.bankCount || 23).fill({}) },
    location: { href: 'http://localhost/archive/engine.html?mode=exam&studentReview=1&data=' + encodeURIComponent(helper.EXPECTED.source.path.slice('archive/'.length)) },
    __image: image, __expected: { ordinal: 17, bankCount: 23, width: 390, height: 844, sourcePath: helper.EXPECTED.source.path, assetPath: helper.EXPECTED.asset.path } };
  return { context, box, image, header, content, htmlReads: () => htmlReads };
}
async function measure(options) {
  const fixture = pageFixture(options);
  const result = await vm.runInNewContext('(' + helper.measureProblemRoles.toString() + ')(__image, __expected)', fixture.context);
  return { frame: copy(result), fixture };
}

test('exact failed problem scope binds immutable inputs without approving capture', () => {
  const checked = helper.checkedDiagnosticScope(scope());
  assert.equal(checked.questionUid, helper.EXPECTED.questionUid);
  assert(!('captureAccepted' in checked));
});

test('diagnostic cannot silently expand its failure, surface, cohort or immutable input scope', async t => {
  const mutations = [
    ['failure code', s => { s.failureCode = 'UI_RENDERED_IMAGES'; }],
    ['solution mode', s => { s.mode = 'solution'; }],
    ['solution surface', s => { s.surface = 'SOLUTION'; }],
    ['desktop', s => { s.viewport = { name: 'desktop', width: 1365, height: 1000 }; }],
    ['viewport size', s => { s.viewport.height++; }],
    ['unknown UID', s => { s.item.questionUid = 'qid_v1_' + 'f'.repeat(64); }],
    ['ordinal', s => { s.item.sourceOrdinal = 8; }],
    ['bank count', s => { s.item.expectedBankCount = 24; }],
    ['payload', s => { s.item.surfacePayloadSha256 = '0'.repeat(64); }],
    ['source bytes', s => { s.item.sourceRef.sha256 = '0'.repeat(64); }],
    ['source path', s => { s.item.sourceRef.path = 'archive/exams/foreign.js'; }],
    ['source commit', s => { s.item.sourceRef.commit = 'b'.repeat(40); }],
    ['extra source field', s => { s.item.sourceRef.accept = true; }],
    ['asset bytes', s => { s.item.assetRefs[0].bytes++; }],
    ['extra asset', s => { s.item.assetRefs.push(copy(s.item.assetRefs[0])); }],
    ['manifest', s => { s.manifestRef.sha256 = '0'.repeat(64); }],
    ['shared helper', s => { s.captureHelperRef.sha256 = '0'.repeat(64); }]
  ];
  for (const [name, mutation] of mutations) await t.test(name, () => { const s = scope(); mutation(s); assert.throws(() => helper.checkedDiagnosticScope(s), /UI_ROLE_DIAGNOSTIC_/); });
});

test('two visible children are observed without changing the original three-child rejection', async () => {
  const { frame } = await measure({ hiddenWorkspace: true });
  assert.equal(frame.visibleDirectNodeCount, 2);
  assert.equal(frame.numberCount, 1); assert.equal(frame.contentCount, 1);
  assert.equal(frame.mediaNodes[0].insideContent, true);
  assert.equal(frame.directNodes.find(row => row.knownClasses?.includes('workspace')).visible, false);
  assert.throws(() => shared.problemContentClip({ question: frame.question, children: frame.directNodes.filter(row => row.visible).map(row => row.rect) }), /UI_COMPLETE_PROBLEM_CHILDREN/);
  assert.equal(frame.cssWrites + frame.domWrites + frame.viewportChanges + frame.scrollOperations, 0);
});

test('all visible direct nodes including standalone text are retained in the diagnostic', async () => {
  const { frame } = await measure({ textChild: true });
  assert.equal(frame.visibleDirectNodeCount, 3);
  assert.equal(frame.directNodes.at(-1).kind, 'TEXT');
  assert.equal(frame.directNodes.at(-1).hasText, true);
});

test('hidden substantive content remains visibly failed rather than being reclassified as empty', async () => {
  const { frame } = await measure({ hiddenContent: true });
  assert.equal(frame.visibleContentCount, 0);
  const content = frame.directNodes.find(row => row.contentCount === 1);
  assert.equal(content.hasText, true); assert.equal(content.mediaCount, 1); assert.equal(content.visible, false);
});

test('fixed obstruction and foreign hit counts are observed and do not establish capture approval', async () => {
  const { frame } = await measure({ toolbar: true });
  assert.equal(frame.obstructions.length, 1);
  assert.equal(frame.hitTestSamples, 25);
  assert(!('captureAccepted' in frame));
});

test('diagnostic returns no raw text HTML unknown class or image URL', async () => {
  const { frame } = await measure({ textChild: true }); const serialized = JSON.stringify(frame);
  for (const forbidden of ['RAW_PROBLEM', 'RAW_INLINE', 'RAW_HTML', 'private_STUDENT_TEXT', 'https:', 'img.wangjiedu', 'q17-problem-visual']) assert(!serialized.includes(forbidden));
  assert.match(frame.directNodes.find(row => row.contentCount === 1).otherClassesSha256, /^[a-f0-9]{64}$/);
});

for (const [name, options, code] of [
  ['solution surface', { solution: true }, 'UI_ROLE_DIAGNOSTIC_SURFACE'],
  ['non-exam mode', { mode: 'sol' }, 'UI_ROLE_DIAGNOSTIC_SURFACE'],
  ['foreign ordinal', { ordinal: '18.' }, 'UI_ROLE_DIAGNOSTIC_ORDINAL'],
  ['bank mismatch', { bankCount: 24 }, 'UI_ROLE_DIAGNOSTIC_BANK'],
  ['viewport mismatch', { width: 391 }, 'UI_ROLE_DIAGNOSTIC_VIEWPORT'],
  ['changing DOM', { domChanges: true }, 'UI_ROLE_DIAGNOSTIC_INPUT_CHANGED']
]) test('browser role diagnostic rejects ' + name, async () => { await assert.rejects(() => measure(options), new RegExp(code)); });

test('solution refusal precedes reading any problem or solution HTML', async () => {
  const fixture = pageFixture({ solution: true });
  await assert.rejects(() => vm.runInNewContext('(' + helper.measureProblemRoles.toString() + ')(__image, __expected)', fixture.context), /UI_ROLE_DIAGNOSTIC_SURFACE/);
  assert.equal(fixture.htmlReads(), 0);
});

function loadedWithReader(changed = false) {
  const e = helper.EXPECTED, values = new Map([e.manifest, e.captureHelper, e.source, e.asset].map(value => [value.path, ref(value)]));
  values.set(helper.SELF_PATH, { commit, path: helper.SELF_PATH, gitBlobSha1: 'f'.repeat(40), sha256: 'e'.repeat(64), bytes: 100 });
  const reads = new Map();
  const reader = { commit, ref(file) { reads.set(file, (reads.get(file) || 0) + 1); const result = copy(values.get(file));
    if (changed && file === e.source.path && reads.get(file) > 1) result.sha256 = '0'.repeat(64); return result; } };
  const loaded = new Module(helperPath, module); loaded.filename = helperPath;
  loaded.require = id => id === './check-reviewed-problem-renderer-browser.cjs' ? { createGitReader: () => reader } : require(id);
  loaded._compile(fs.readFileSync(helperPath, 'utf8'), helperPath);
  return { exported: loaded.exports, reads };
}

test('collection keeps the original failure and creates no screenshot or approval', async () => {
  const { frame } = await measure({ hiddenWorkspace: true }), { exported, reads } = loadedWithReader();
  const s = scope(), result = await exported.diagnoseProblemCaptureFailure({ root: '/private-test', expectedCommit: commit, ...s,
    target: { evaluate: async () => frame } });
  assert.equal(result.status, 'DIAGNOSTIC_ONLY_ORIGINAL_CAPTURE_FAILURE');
  assert.equal(result.failureCode, 'UI_COMPLETE_PROBLEM_CHILDREN');
  assert.equal(result.captureAccepted, false); assert.equal(result.screenshotCreated, false); assert.equal(result.solutionsOpened, false);
  assert.equal(result.newMetadataApprovals + result.newFourSlotApprovals, 0);
  assert.equal(result.previousFailure.technicalSha256, helper.EXPECTED.previousFailure.technicalSha256);
  assert([...reads.values()].every(count => count === 2));
});

test('post-diagnostic Git input drift remains a failure', async () => {
  const { frame } = await measure({}), { exported } = loadedWithReader(true), s = scope();
  await assert.rejects(() => exported.diagnoseProblemCaptureFailure({ root: '/private-test', expectedCommit: commit, ...s,
    target: { evaluate: async () => frame } }), /UI_ROLE_DIAGNOSTIC_INPUT_CHANGED/);
});
