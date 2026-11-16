'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const H = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const C = require('../tools/check-m2-problem24-renderer-browser.cjs');
const original = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/archive-m2-problem24-renderer-ui.json')));
const clone = value => structuredClone(value);
const sealed = () => ({ ...clone(original), bindingState: C.SEALED });
const digest = value => H.sha256(H.stable(value));

test('draft contains exactly 24 closed questions, three banks and 48 logical cases', () => {
  C.validateManifest(original);
  assert.equal(original.items.filter(item => item.imageBinding === 'CONTENT_SINGLE_IMG').length, 1);
  assert.equal(original.items.find(item => item.key === 'E017-Q02').assetPath.split('/').at(-1), 'q02.png');
  assert.equal(original.items.filter(item => /-v[34]\.svg$/.test(item.assetPath)).length, 8);
});
test('draft cannot read source or launch an actual preflight', () => {
  let reads = 0;
  assert.throws(() => C.preflight({ read() { reads++; throw Error('must not read'); } }, { ...clone(original), bindingState: C.DRAFT }), /UI_24_PUBLIC_SOURCE_SEAL_REQUIRED/);
  assert.equal(reads, 0);
});
test('explicit sealed state validates only the same immutable cohort metadata', () => C.requireSealedManifest(sealed()));
const manifestMutations = {
  'extra top field': m => { m.allowFallback = true; },
  'wrong scope': m => { m.scope = 'GENERAL'; },
  'unknown binding state': m => { m.bindingState = 'READY'; },
  '47 cases': m => { m.expectedCases = 47; },
  '49 cases': m => { m.expectedCases = 49; },
  'mobile height overlay': m => { m.viewports[1].height = 1600; },
  'desktop scale alias': m => { m.viewports[0].deviceScaleFactor = 0.5; },
  'missing question': m => { m.items.pop(); },
  'extra question': m => { m.items.push(clone(m.items[0])); },
  'duplicate question': m => { m.items[1] = clone(m.items[0]); },
  'different uid': m => { m.items[0].questionUid = 'qid_v1_' + 'a'.repeat(64); },
  'different ordinal': m => { m.items[0].sourceOrdinal++; },
  'bank count 24 for E017': m => { m.items.find(x => x.key === 'E017-Q01').expectedBankCount = 24; },
  'Q2 new SVG substituted': m => { m.items.find(x => x.key === 'E017-Q02').assetPath = 'archive/assets/q2-v3.svg'; },
  'old asset path for repaired Q4': m => { m.items.find(x => x.key === 'E017-Q04').assetPath = m.items.find(x => x.key === 'E017-Q04').assetPath.replace('-v4.svg', '-v2.svg'); },
  'different approved asset bytes': m => { m.items[0].assetSha256 = '0'.repeat(64); },
  'arbitrary inline profile': m => { m.items[0].imageBinding = 'CONTENT_SINGLE_IMG'; },
  'missing source seal': m => { m.sourceBindings.pop(); },
  'duplicate source seal': m => { m.sourceBindings[1] = clone(m.sourceBindings[0]); },
  'foreign source path': m => { m.sourceBindings[0].sourcePath = '../outside.js'; },
  'source seal extra permission': m => { m.sourceBindings[0].allowMetadata = true; },
  'source null git seal': m => { m.sourceBindings[0].gitBlobSha1 = null; },
  'source blank raw seal': m => { m.sourceBindings[0].sha256 = ''; },
  'source zero byte seal': m => { m.sourceBindings[0].bytes = 0; }
};
for (const [name, mutate] of Object.entries(manifestMutations)) test('closed manifest refuses ' + name, () => { const m = sealed(); mutate(m); assert.throws(() => C.validateManifest(m)); });
test('expected checkout is explicit and exact; event SHA remains separately recorded', () => {
  const c = 'a'.repeat(40), event = 'b'.repeat(40);
  assert.equal(C.checkoutEvidence(c, { ARCHIVE_M2_PROBLEM24_UI_EXPECTED_SHA: c, GITHUB_SHA: event }).githubEventCommit, event);
  for (const env of [{}, { ARCHIVE_M2_PROBLEM24_UI_EXPECTED_SHA: null }, { ARCHIVE_M2_PROBLEM24_UI_EXPECTED_SHA: event }, { ARCHIVE_M2_PROBLEM24_UI_EXPECTED_SHA: c, GITHUB_SHA: 'bad' }]) assert.throws(() => C.checkoutEvidence(c, env));
});
function bind(question, overrides = {}) {
  return { key: 'SYNTHETIC', sourceOrdinal: 1, imageBinding: 'QUESTION_IMAGE', assetPath: 'archive/assets/images/test/problem.svg',
    problemPayloadSha256: digest({ content: question.content ?? question.question, choices: question.choices ?? [] }),
    problemFieldsSha256: digest(C.ownSnapshot(question, ['content', 'question', 'choices'])),
    presentationSha256: digest(C.ownSnapshot(question, ['image', 'imageAlt', 'imageSize', 'layoutTag'])), ...overrides };
}
const simple = () => ({ id: 1, content: 'Synthetic given-only text.', choices: ['A', 'B'], image: 'assets/images/test/problem.svg', layoutTag: 'grid' });
test('question image exact problem and own-property presentation bind', () => { const q = simple(); C.assertBoundQuestion(bind(q), q); });
for (const [name, mutate] of Object.entries({
  'changed content': q => { q.content += ' changed'; },
  'changed choices': q => { q.choices.reverse(); },
  'changed ordinal': q => { q.id = 2; },
  'added question alias null': q => { q.question = null; },
  'added imageAlt null': q => { q.imageAlt = null; },
  'added imageSize null': q => { q.imageSize = null; },
  'changed image': q => { q.image = 'assets/images/test/foreign.svg'; },
  'changed layout': q => { q.layoutTag = 'other'; }
})) test('bound question refuses ' + name, () => { const q = simple(), item = bind(q); mutate(q); assert.throws(() => C.assertBoundQuestion(item, q)); });
test('even re-sealed generic question cannot introduce an inline image', () => {
  const q = simple(); q.content += '<img src="assets/images/test/foreign.svg">';
  assert.throws(() => C.assertBoundQuestion(bind(q), q), /UI_24_UNDECLARED_INLINE_IMAGE/);
});
const inlineQuestion = () => ({ id: 10, content: 'Synthetic given <img src="assets/images/test/problem.svg">', choices: [], image: '', layoutTag: 'grid' });
const inlineItem = q => bind(q, { key: 'E017-Q10', sourceOrdinal: 10, imageBinding: 'CONTENT_SINGLE_IMG' });
test('exact Q10 inline profile accepts one bound image and empty own image field', () => { const q = inlineQuestion(); C.assertBoundQuestion(inlineItem(q), q); });
for (const [name, mutate] of Object.entries({
  'second inline image': q => { q.content += '<img src="assets/images/test/second.svg">'; },
  'wrong inline image URI': q => { q.content = q.content.replace('problem.svg', 'foreign.svg'); },
  'unquoted inline URI': q => { q.content = q.content.replaceAll('"', ''); },
  'absent image field': q => { delete q.image; },
  'null image field': q => { q.image = null; },
  'nonempty image field': q => { q.image = 'assets/images/test/problem.svg'; }
})) test('re-sealed inline profile refuses ' + name, () => { const q = inlineQuestion(); mutate(q); assert.throws(() => C.assertBoundQuestion(inlineItem(q), q)); });
test('inline profile cannot be borrowed by another key', () => { const q = inlineQuestion(), item = inlineItem(q); item.key = 'E017-Q06'; assert.throws(() => C.assertBoundQuestion(item, q), /UI_24_INLINE_IMAGE_PROFILE/); });
test('source VM is bounded, executes suffix and forbids dynamic code generation', () => {
  assert.equal(C.loadQuestions(Buffer.from('window.questionBank=[{id:1}];window.questionBank[0].tag="suffix";'))[0].tag, 'suffix');
  assert.throws(() => C.loadQuestions(Buffer.from('window.questionBank=Function("return []")();')));
  assert.throws(() => C.loadQuestions(Buffer.from('window.questionBank={};')), /UI_24_BANK_REQUIRED/);
});
function caseFixture() {
  const m = sealed(), ref = item => ({ commit: 'a'.repeat(40), path: item.sourcePath, gitBlobSha1: 'b'.repeat(40), sha256: 'c'.repeat(64), bytes: 100 });
  const inputs = { items: m.items.map(item => ({ ...item, sourceRef: ref(item), assetRef: { ...ref(item), path: item.assetPath, gitBlobSha1: item.assetGitBlobSha1, sha256: item.assetSha256, bytes: item.assetBytes } })) };
  const results = [];
  for (const viewport of m.viewports) for (const item of inputs.items) {
    const filename = `${item.key}-${viewport.name}-tile-01.png`, dom = 'd'.repeat(64);
    const tile = { tileIndex: 1, relativeInterval: [0, 100], filename, clip: { x: 28, y: 60, width: 300, height: 100 }, scroll: { x: 0, y: 0 }, scrollOperations: 1, feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: 100, foreignContentHits: 0, domSha256: dom };
    results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport, sourceRef: item.sourceRef, assetRef: item.assetRef,
      screenshots: [{ tileIndex: 1, path: filename, sha256: H.sha256(filename), bytes: 16 }],
      technical: { mode: 'exam', questions: item.expectedBankCount, pages: 1, readiness: 'RENDER_READY', imagesComplete: true, mathErrors: 0, unrenderedMath: 0, mathJaxSource: 'local', solutionNodes: 0,
        fontReadiness: { status: 'loaded', family: 'Nanum Myeongjo', weights: [400, 700, 800].map(weight => ({ weight, loadedFaces: 1, allLoaded: true, checked: true })), problemFontFamilies: ['"Nanum Myeongjo", serif'] } },
      geometry: { naturalWidth: 700, image: { width: 300 }, imageInsideQuestion: true },
      capture: { schemaVersion: H.TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: 8, overlapCssPixels: 32, tileCount: 1, content: { height: 100 }, coverage: { requiredInterval: [0, 100], coveredInterval: [0, 100], complete: true }, tiles: [tile], feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0, compositeImageCreated: false, domSha256: dom },
      visualReview: 'PENDING', pageErrors: [], requestFailures: [], externalRequests: [] });
  }
  return { m, inputs, results, artifacts: results.flatMap(r => r.screenshots.map(({ path, sha256, bytes }) => ({ path, sha256, bytes }))).sort((a, b) => a.path.localeCompare(b.path)) };
}
test('48 logical cases and exact original PNG inventory pass independently of approval', () => { const f = caseFixture(); assert.equal(C.assertCompletedResults(f.results, f.inputs, f.m, f.artifacts), 48); });
test('49 original tiles remain 48 logical cases with exact 32px overlap', () => {
  const f = caseFixture(), r = f.results[0], first = r.capture.tiles[0];r.capture.content.height = 168;r.capture.tileCount = 2;
  const second = { ...clone(first), tileIndex: 2, relativeInterval: [68, 168], filename: first.filename.replace('01.png', '02.png') };
  r.capture.tiles.push(second);r.capture.coverage = H.assertTileCoverage(168, r.capture.tiles);
  const shot = { tileIndex: 2, path: second.filename, sha256: H.sha256(second.filename), bytes: 20 };r.screenshots.push(shot);f.artifacts.push({ path: shot.path, sha256: shot.sha256, bytes: shot.bytes });
  assert.equal(C.assertCompletedResults(f.results, f.inputs, f.m, f.artifacts), 49);
});
const caseMutations = {
  'missing logical case': f => { f.results.pop(); },
  'duplicate logical case': f => { f.results[1] = clone(f.results[0]); },
  'wrong viewport': f => { f.results[0].viewport.width--; },
  'different result UID': f => { f.results[0].questionUid = 'qid_v1_' + '0'.repeat(64); },
  'different result source seal': f => { f.results[0].sourceRef = { ...f.results[0].sourceRef, sha256: '0'.repeat(64) }; },
  'different asset seal': f => { f.results[0].assetRef = { ...f.results[0].assetRef, sha256: '0'.repeat(64) }; },
  'wrong rendered bank count': f => { f.results[0].technical.questions++; },
  'solution nodes': f => { f.results[0].technical.solutionNodes = 1; },
  'unrendered math': f => { f.results[0].technical.unrenderedMath = 1; },
  'font not loaded': f => { f.results[0].technical.fontReadiness.status = 'loading'; },
  'font weight missing': f => { f.results[0].technical.fontReadiness.weights.pop(); },
  'font fallback family': f => { f.results[0].technical.fontReadiness.problemFontFamilies = ['serif']; },
  'CSS modification': f => { f.results[0].capture.cssWrites = 1; },
  'DOM modification': f => { f.results[0].capture.domWrites = 1; },
  'viewport modification': f => { f.results[0].capture.viewportChanges = 1; },
  'composite substituted': f => { f.results[0].capture.compositeImageCreated = true; },
  'foreign hit': f => { f.results[0].capture.tiles[0].foreignContentHits = 1; },
  'obstructed tile': f => { f.results[0].capture.tiles[0].obstructionsIntersectingClip = 1; },
  'missing hit tests': f => { f.results[0].capture.tiles[0].hitTestSamples = 0; },
  'DOM differs across tiles': f => { f.results[0].capture.tiles[0].domSha256 = '0'.repeat(64); },
  'bottom cropped': f => { f.results[0].capture.tiles[0].relativeInterval[1] = 99; },
  'image clipped': f => { f.results[0].geometry.imageInsideQuestion = false; },
  'network failure': f => { f.results[0].requestFailures = [{ urlSha256: '0'.repeat(64) }]; },
  'missing PNG': f => { f.artifacts.pop(); },
  'extra PNG': f => { f.artifacts.push({ path: 'foreign.png', sha256: '0'.repeat(64), bytes: 1 }); },
  'PNG bytes drift': f => { f.artifacts[0].sha256 = '0'.repeat(64); },
  'replaced v1 screenshot alias': f => { f.results[0].screenshot = f.results[0].screenshots[0]; delete f.results[0].screenshots; }
};
for (const [name, mutate] of Object.entries(caseMutations)) test('completed UI contract refuses ' + name, () => { const f = caseFixture(); mutate(f); assert.throws(() => C.assertCompletedResults(f.results, f.inputs, f.m, f.artifacts)); });
test('output must be outside checkout, empty and free of symlink ancestors', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'problem24-contract-'));
  try {const root = path.join(base, 'checkout');fs.mkdirSync(root);assert.equal(C.checkedOutput(root, path.join(base, 'out')), path.join(base, 'out'));
    assert.throws(() => C.checkedOutput(root, root));assert.throws(() => C.checkedOutput(root, path.join(root, 'out')));
    fs.mkdirSync(path.join(base, 'used'));fs.writeFileSync(path.join(base, 'used', 'prior.json'), '{}');assert.throws(() => C.checkedOutput(root, path.join(base, 'used')));
    fs.symlinkSync(path.join(base, 'used'), path.join(base, 'alias'));assert.throws(() => C.checkedOutput(root, path.join(base, 'alias', 'child')));
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
