'use strict';
// Actual problem-only Chrome observation; no student text or image bytes.
const ACTUAL_FRAME = {
  "schemaVersion": "archive-problem-role-frame-v1",
  "mode": "exam",
  "solutionNodes": 0,
  "sourcePageMatched": true,
  "targetAssetMatched": true,
  "bankCount": 23,
  "questionNumber": 17,
  "question": {
    "x": 28,
    "y": 2117.109375,
    "width": 334,
    "height": 364.265625
  },
  "image": {
    "x": 28,
    "y": 2196.359375,
    "width": 334,
    "height": 263.015625
  },
  "viewport": {
    "width": 390,
    "height": 844
  },
  "scroll": {
    "x": 0,
    "y": 1304
  },
  "readiness": "RENDER_READY",
  "feedbackIdle": true,
  "numberCount": 1,
  "visibleNumberCount": 1,
  "contentCount": 1,
  "visibleContentCount": 1,
  "directNodeCount": 5,
  "visibleDirectNodeCount": 2,
  "directNodes": [
    {
      "index": 0,
      "kind": "ELEMENT",
      "tag": "DIV",
      "knownClasses": [
        "q-num"
      ],
      "otherClassCount": 0,
      "otherClassesSha256": null,
      "rect": {
        "x": 28,
        "y": 2129.109375,
        "width": 334,
        "height": 19
      },
      "displayNone": false,
      "visibilityHidden": false,
      "opacityZero": false,
      "visible": true,
      "hasText": true,
      "mediaCount": 0,
      "numberCount": 1,
      "contentCount": 0,
      "containsTargetImage": false
    },
    {
      "index": 1,
      "kind": "TEXT",
      "hasText": false,
      "rect": {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0
      },
      "visible": false
    },
    {
      "index": 2,
      "kind": "ELEMENT",
      "tag": "DIV",
      "knownClasses": [
        "q-content"
      ],
      "otherClassCount": 0,
      "otherClassesSha256": null,
      "rect": {
        "x": 28,
        "y": 2154.109375,
        "width": 334,
        "height": 305.265625
      },
      "displayNone": false,
      "visibilityHidden": false,
      "opacityZero": false,
      "visible": true,
      "hasText": true,
      "mediaCount": 3,
      "numberCount": 0,
      "contentCount": 1,
      "containsTargetImage": true
    },
    {
      "index": 3,
      "kind": "TEXT",
      "hasText": false,
      "rect": {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0
      },
      "visible": false
    },
    {
      "index": 4,
      "kind": "ELEMENT",
      "tag": "DIV",
      "knownClasses": [],
      "otherClassCount": 1,
      "otherClassesSha256": "eecddef10cc4a80d3bd980d8a114244d6c2c6422131f2d0492d4428a94ab7674",
      "rect": {
        "x": 28,
        "y": 2469.375,
        "width": 334,
        "height": 0
      },
      "displayNone": false,
      "visibilityHidden": false,
      "opacityZero": false,
      "visible": false,
      "hasText": false,
      "mediaCount": 0,
      "numberCount": 0,
      "contentCount": 0,
      "containsTargetImage": false
    }
  ],
  "mediaNodes": [
    {
      "index": 0,
      "kind": "MJX-CONTAINER",
      "rect": {
        "x": 28,
        "y": 2157.109375,
        "width": 97.171875,
        "height": 14
      },
      "displayNone": false,
      "visibilityHidden": false,
      "opacityZero": false,
      "visible": true,
      "directNodeIndex": 2,
      "insideContent": true,
      "isTargetImage": false
    },
    {
      "index": 1,
      "kind": "MJX-CONTAINER",
      "rect": {
        "x": 254.171875,
        "y": 2157.109375,
        "width": 61.421875,
        "height": 14
      },
      "displayNone": false,
      "visibilityHidden": false,
      "opacityZero": false,
      "visible": true,
      "directNodeIndex": 2,
      "insideContent": true,
      "isTargetImage": false
    },
    {
      "index": 2,
      "kind": "IMG",
      "rect": {
        "x": 28,
        "y": 2196.359375,
        "width": 334,
        "height": 263.015625
      },
      "displayNone": false,
      "visibilityHidden": false,
      "opacityZero": false,
      "visible": true,
      "directNodeIndex": 2,
      "insideContent": true,
      "isTargetImage": true,
      "complete": true,
      "naturalWidth": 753,
      "naturalHeight": 593
    }
  ],
  "obstructions": [
    {
      "x": 0,
      "y": 778,
      "width": 390,
      "height": 66
    },
    {
      "x": 0,
      "y": 0,
      "width": 390,
      "height": 52
    }
  ],
  "hitTestSamples": 0,
  "foreignContentHits": 0,
  "domSha256": "7392558d2bf2fd15b0654728f1cecce9d114f5e66e306fa690e213ccd1afa352",
  "inputUnchanged": true,
  "cssWrites": 0,
  "domWrites": 0,
  "viewportChanges": 0,
  "scrollOperations": 0
};
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const helperPath = path.resolve(__dirname, '../tools/m2s1-problem18-capture.cjs');
const helper = require(helperPath);
const shared = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const manifestBytes = fs.readFileSync(path.join(__dirname, 'fixtures/archive-m2s1-current-problem-display-ui.json'));
const manifest = JSON.parse(manifestBytes);
const clone = value => JSON.parse(JSON.stringify(value));
const mobile = manifest.viewports.find(row => row.name === 'mobile');
const q17 = manifest.items.find(row => row.key === 'E009-Q17');

test('exact actual role frame fixes only the documented child-count failure', () => {
  assert.equal(shared.sha256(shared.stable(ACTUAL_FRAME)), '16ea5f3c9d164327c5fce653bbdd36dbd84056f2c4d6bd81c518cc2f85781bef');
  const children = ACTUAL_FRAME.directNodes.filter(node => node.visible).map(node => node.rect);
  assert.throws(() => shared.problemContentClip({ question: ACTUAL_FRAME.question, children }), /UI_COMPLETE_PROBLEM_CHILDREN/);
  assert.deepEqual(helper.twoRoleContentClip(clone(ACTUAL_FRAME)), { x: 28, y: 2127.109375, width: 334, height: 334.265625 });
  assert.equal(helper.planTwoRoleTiles(clone(ACTUAL_FRAME)).tiles.length, 1);
});

test('exact sealed problem manifest admits only its eighteen problem rows', async t => {
  for (const row of manifest.items) await t.test(row.key, () => {
    const scope = helper.checkedProblem18Scope(manifestBytes, clone(row), mobile, 'PROBLEM', 'exam');
    assert.equal(scope.row.questionUid, row.questionUid);
  });
});

test('closed scope rejects any changed manifest or caller inventory', async t => {
  const cases = [
    ['manifest bytes', () => helper.checkedProblem18Scope(Buffer.concat([manifestBytes, Buffer.from(' ')]), q17, mobile, 'PROBLEM', 'exam')],
    ['foreign UID', () => helper.checkedProblem18Scope(manifestBytes, { ...q17, questionUid: 'qid_v1_' + '0'.repeat(64) }, mobile, 'PROBLEM', 'exam')],
    ['ordinal', () => helper.checkedProblem18Scope(manifestBytes, { ...q17, sourceOrdinal: 18 }, mobile, 'PROBLEM', 'exam')],
    ['payload digest', () => helper.checkedProblem18Scope(manifestBytes, { ...q17, surfacePayloadSha256: '0'.repeat(64) }, mobile, 'PROBLEM', 'exam')],
    ['bank count', () => helper.checkedProblem18Scope(manifestBytes, { ...q17, expectedBankCount: 24 }, mobile, 'PROBLEM', 'exam')],
    ['viewport', () => helper.checkedProblem18Scope(manifestBytes, q17, { ...mobile, height: 1200 }, 'PROBLEM', 'exam')],
    ['solution surface', () => helper.checkedProblem18Scope(manifestBytes, q17, mobile, 'SOLUTION', 'exam')],
    ['non-exam mode', () => helper.checkedProblem18Scope(manifestBytes, q17, mobile, 'PROBLEM', 'sol')]
  ];
  for (const [name, run] of cases) await t.test(name, () => assert.throws(run, /UI_CLOSED_PROBLEM_/));
});

test('two-role capture rejects missing hidden foreign or omitted problem elements', async t => {
  const cases = [
    ['invisible number', f => { f.directNodes[0].visible = false; }],
    ['number role omitted', f => { f.directNodes[0].knownClasses = []; }],
    ['number count omitted', f => { f.directNodes[0].numberCount = 0; }],
    ['invisible content', f => { f.visibleContentCount = 0; f.directNodes[2].visible = false; }],
    ['display-none content', f => { f.directNodes[2].displayNone = true; }],
    ['zero-opacity content', f => { f.directNodes[2].opacityZero = true; }],
    ['unreadable extra content class', f => { f.directNodes[2].otherClassCount = 1; }],
    ['number/content overlap', f => { f.directNodes[0].rect.height += 10; }],
    ['clipped content', f => { f.directNodes[2].rect.width++; f.directNodes[2].rect.width++; }],
    ['target image not in content', f => { f.directNodes[2].containsTargetImage = false; }],
    ['third child contains text', f => { f.directNodes[4].hasText = true; }],
    ['third child contains media', f => { f.directNodes[4].mediaCount = 1; }],
    ['third child has height', f => { f.directNodes[4].rect.height = 1; }],
    ['third child is deliberately hidden', f => { f.directNodes[4].displayNone = true; }],
    ['third child is transparent', f => { f.directNodes[4].opacityZero = true; }],
    ['foreign zero-height class', f => { f.directNodes[4].otherClassesSha256 = '0'.repeat(64); }],
    ['zero node missing', f => { f.directNodes.pop(); f.directNodeCount--; }],
    ['zero node duplicated', f => { const v = clone(f.directNodes[4]); v.index = 5; f.directNodes.push(v); f.directNodeCount++; }],
    ['standalone text omitted', f => { f.directNodes[1].hasText = true; }],
    ['whitespace occupies height', f => { f.directNodes[1].rect.height = 12; }],
    ['unknown direct node', f => { f.directNodes[1].kind = 'OTHER'; }],
    ['second content role', f => { f.contentCount = 2; }],
    ['second number role', f => { f.numberCount = 2; }],
    ['media count not exhaustive', f => { f.mediaNodes.pop(); }],
    ['unloaded target image', f => { f.mediaNodes[2].complete = false; }],
    ['invalid target natural size', f => { f.mediaNodes[2].naturalWidth = 0; }],
    ['foreign target image', f => { f.mediaNodes[2].isTargetImage = false; }],
    ['foreign media outside content', f => { f.mediaNodes[0].directNodeIndex = 4; }],
    ['media outside content role', f => { f.mediaNodes[0].insideContent = false; }],
    ['hidden math', f => { f.mediaNodes[0].visible = false; }],
    ['clipped inline math', f => { f.mediaNodes[0].rect.x = 0; }],
    ['video media', f => { f.mediaNodes[0].kind = 'VIDEO'; }],
    ['additional image', f => { const v = clone(f.mediaNodes[2]); v.index = 3; v.isTargetImage = false; f.mediaNodes.push(v); f.directNodes[2].mediaCount++; }],
    ['target rectangle mismatch', f => { f.image.width--; }],
    ['solution nodes present', f => { f.solutionNodes = 1; }],
    ['solution mode', f => { f.mode = 'sol'; }],
    ['render pending', f => { f.readiness = 'LOADING'; }],
    ['feedback active', f => { f.feedbackIdle = false; }],
    ['DOM change', f => { f.inputUnchanged = false; }],
    ['missing DOM hash', f => { f.domSha256 = null; }],
    ['CSS write', f => { f.cssWrites = 1; }],
    ['viewport change', f => { f.viewportChanges = 1; }]
  ];
  for (const [name, mutation] of cases) await t.test(name, () => { const frame = clone(ACTUAL_FRAME); mutation(frame); assert.throws(() => helper.twoRoleContentClip(frame), /UI_/); });
});

function tallFrame(extra = 1500) {
  const f = clone(ACTUAL_FRAME); f.question.height += extra; f.directNodes[2].rect.height += extra; f.directNodes[4].rect.y += extra; return f;
}
function shifted(frame, delta) {
  const f = clone(frame); f.scroll.y += delta;
  for (const rect of [f.question, f.image, ...f.directNodes.filter(node => node.kind === 'ELEMENT').map(node => node.rect), ...f.mediaNodes.map(node => node.rect)]) rect.y -= delta;
  return f;
}

test('whole content tiles retain exact32px overlap and include bottom extent', () => {
  const f = tallFrame(), plan = helper.planTwoRoleTiles(f), full = helper.twoRoleContentClip(f);
  assert(plan.tiles.length > 1 && plan.tiles.length <= 8);
  assert.equal(plan.tiles[0].relativeInterval[0], 0);
  assert.equal(plan.tiles.at(-1).relativeInterval[1], full.height);
  for (let i = 1; i < plan.tiles.length; i++) assert.equal(plan.tiles[i - 1].relativeInterval[1] - plan.tiles[i].relativeInterval[0], 32);
  assert.throws(() => helper.planTwoRoleTiles(tallFrame(10000)), /UI_SCROLL_TILE_LIMIT/);
});

test('existing overlap gap bottom omission horizontal clipping and overlays still fail', () => {
  const f = clone(ACTUAL_FRAME), plan = helper.planTwoRoleTiles(f), step = helper.planTwoRoleScroll(f, plan.tiles[0]), visible = shifted(f, step.scrollByY);
  const clip = helper.assertTwoRoleTileCapture(visible, plan.tiles[0]); assert(clip.y >= 60 && clip.y + clip.height <= 770);
  visible.obstructions.push({ x: clip.x, y: clip.y, width: 10, height: 10 });
  assert.throws(() => helper.assertTwoRoleTileCapture(visible, plan.tiles[0]), /UI_CAPTURE_OBSCURED/);
  assert.throws(() => helper.assertTwoRoleTileCapture(f, plan.tiles[0]), /UI_SCROLL_TILE_OUTSIDE_VIEWPORT/);
  const horizontal = clone(f); horizontal.viewport.width = 300;
  assert.throws(() => helper.planTwoRoleTiles(horizontal), /UI_PROBLEM_HORIZONTAL_CLIP/);
  assert.throws(() => shared.assertTileCoverage(100, [{ tileIndex: 1, relativeInterval: [0, 70] }, { tileIndex: 2, relativeInterval: [50, 100] }]), /UI_SCROLL_TILE_OVERLAP/);
  assert.throws(() => shared.assertTileCoverage(100, [{ tileIndex: 1, relativeInterval: [0, 99] }]), /UI_SCROLL_TILE_BOTTOM_MISSING/);
});

function mockCapture({ frame = ACTUAL_FRAME, afterScreenshot, foreignHits = false, changedRef = false, extraShared = {} } = {}) {
  const commit = 'a'.repeat(40), rawRefs = new Map();
  const add = (file, sha, blob = 'a'.repeat(40), bytes = 123) => rawRefs.set(file, { commit, path: file, sha256: sha, gitBlobSha1: blob, bytes });
  add(helper.MANIFEST_PATH, helper.MANIFEST_SHA256, '5a78f23961292e13c061b4979feb3c4b54f3426f', manifestBytes.length);
  add('tools/check-reviewed-problem-renderer-browser.cjs', '94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4');
  add('tools/m2s1-problem-capture-diagnostic.cjs', '9951724223fffe462fec790d444a5fb1d04e7a5bf9c4c0d1a2a81ad84f9e2ee9');
  add(helper.SELF_PATH, 'c'.repeat(64));
  add(q17.sourcePath, q17.sourceSha256, q17.sourceGitBlobSha1, 69826);
  const asset = q17.assets[0]; add(asset.path, asset.sha256, asset.gitBlobSha1, asset.bytes);
  const reads = new Map(), reader = { commit, read: file => { assert.equal(file, helper.MANIFEST_PATH); return manifestBytes; },
    ref: file => { reads.set(file, (reads.get(file) || 0) + 1); const ref = clone(rawRefs.get(file)); if (changedRef && reads.get(file) > 1 && file === q17.sourcePath) ref.sha256 = 'f'.repeat(64); return ref; } };
  const calls = { screenshots: [], shared: 0, measurements: 0, scroll: 0 }; let state = clone(frame);
  const fakeShared = { ...shared, createGitReader: () => reader, captureProblemTiles: async () => { calls.shared++; return { originalSharedResult: true }; }, ...extraShared };
  const compiled = new Module(helperPath, module); compiled.filename = helperPath;
  compiled.require = id => id === './check-reviewed-problem-renderer-browser.cjs' ? fakeShared : id === './m2s1-problem-capture-diagnostic.cjs' ? require('../tools/m2s1-problem-capture-diagnostic.cjs') : require(id);
  compiled._compile(fs.readFileSync(helperPath, 'utf8'), helperPath);
  const page = { waitForFunction: async () => {}, evaluate: async (_fn, arg) => { if (typeof arg === 'number') { calls.scroll++; state = shifted(state, arg); } },
    screenshot: async options => { calls.screenshots.push(options); afterScreenshot?.(state); } };
  const target = { evaluate: async fn => { if (fn.name === 'inspectHits') return { samples: 10, outsideQuestion: foreignHits ? 1 : 0 }; calls.measurements++; return clone(state); } };
  const item = { ...clone(q17), sourceRef: clone(rawRefs.get(q17.sourcePath)), assetRefs: [clone(rawRefs.get(asset.path))] };
  return { calls, item, run: overrides => compiled.exports.captureClosedProblem18Tiles({ root: '/checkout', expectedCommit: commit,
    item, viewport: mobile, surface: 'PROBLEM', mode: 'exam', page, target, file: '/artifacts/E009-Q17-mobile.png', ...overrides }) };
}

test('closed dispatcher preserves original shared path for at least three visible children', async () => {
  const f = clone(ACTUAL_FRAME); f.visibleDirectNodeCount = 3;
  const mocked = mockCapture({ frame: f }); const result = await mocked.run();
  assert.deepEqual(result, { originalSharedResult: true }); assert.equal(mocked.calls.shared, 1); assert.equal(mocked.calls.screenshots.length, 0);
});

test('actual two-role frame captures through unchanged viewport natural scroll and bounded PNG settings', async () => {
  const mocked = mockCapture(), result = await mocked.run();
  assert.equal(mocked.calls.shared, 0); assert.equal(result.visibleChildren, 2); assert.equal(result.tileCount, 1);
  assert.equal(result.closedProblemRoles.questionUid, q17.questionUid);
  assert.equal(result.closedProblemRoles.observedFrameSha256, '16ea5f3c9d164327c5fce653bbdd36dbd84056f2c4d6bd81c518cc2f85781bef');
  assert.equal(result.cssWrites + result.domWrites + result.viewportChanges, 0); assert.equal(result.compositeImageCreated, false);
  assert(mocked.calls.scroll > 0); assert.equal(mocked.calls.screenshots.length, 1);
  const image = mocked.calls.screenshots[0]; assert.equal(image.fullPage, false); assert.equal(image.caret, 'initial'); assert.equal(image.timeout, 15000);
  assert.equal(image.path, '/artifacts/E009-Q17-mobile-tile-01.png');
});

test('tall two-role problem keeps all original tiles and complete coverage', async () => {
  const mocked = mockCapture({ frame: tallFrame() }), result = await mocked.run();
  assert(result.tileCount > 1); assert.equal(result.tileCount, mocked.calls.screenshots.length); assert.equal(result.coverage.complete, true);
  assert.equal(result.overlapCssPixels, 32); assert.equal(result.tileLimit, 8);
});

for (const [name, options, expected] of [
  ['foreign hit', { foreignHits: true }, /UI_CAPTURE_FOREIGN_CONTENT/],
  ['post-shot DOM mutation', { afterScreenshot: state => { state.domSha256 = 'f'.repeat(64); } }, /UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE/],
  ['post-shot shortened content', { afterScreenshot: state => { state.directNodes[2].rect.height--; } }, /UI_SCROLL_TILE_RANGE/],
  ['post-shot scroll mutation', { afterScreenshot: state => { state.scroll.y++; } }, /UI_CAPTURE_SCROLLED/],
  ['post-shot viewport mutation', { afterScreenshot: state => { state.viewport.height++; } }, /UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED/],
  ['post-shot overlay', { afterScreenshot: state => { state.obstructions.push({ x: 28, y: 60, width: 334, height: 50 }); } }, /UI_CAPTURE_OBSCURED/],
  ['post-capture immutable source drift', { changedRef: true }, /UI_INPUT_CHANGED_DURING_RUN/]
]) test('closed capture rejects ' + name, async () => { const mocked = mockCapture(options); await assert.rejects(() => mocked.run(), expected); });

test('closed wrapper rejects foreign caller source reference before measuring DOM', async () => {
  const mocked = mockCapture(), item = clone(mocked.item); item.sourceRef.sha256 = '0'.repeat(64);
  await assert.rejects(() => mocked.run({ item }), /UI_CLOSED_PROBLEM_SOURCE/); assert.equal(mocked.calls.measurements, 0);
});

test('closed wrapper rejects solution and other-scope callers before measuring DOM', async () => {
  const mocked = mockCapture(); await assert.rejects(() => mocked.run({ surface: 'SOLUTION' }), /UI_CLOSED_PROBLEM_SURFACE/);
  const item = clone(mocked.item); item.questionUid = 'qid_v1_' + '1'.repeat(64);
  await assert.rejects(() => mocked.run({ item }), /UI_CLOSED_PROBLEM_COHORT/); assert.equal(mocked.calls.measurements, 0);
});
