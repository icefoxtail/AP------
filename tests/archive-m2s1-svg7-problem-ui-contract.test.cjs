'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const H = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const C = require('../tools/check-m2s1-svg7-problem-browser.cjs');
const A = require('../tools/m2s1-svg7-problem-capture.cjs');
const fixtureBytes = fs.readFileSync(path.join(__dirname, 'fixtures/archive-m2s1-svg7-problem-ui.json'));
const original = JSON.parse(fixtureBytes);
const clone = value => structuredClone(value);
const digest = value => H.sha256(H.stable(value));

test('exact public SVG7 scope is three banks, 75 questions, fourteen problem-only cases', () => {
  C.validateManifest(original);
  assert.equal(original.sourceCandidateCommit, '76ed4169325af7c8145a03b6d23d537940e359df');
  assert.equal(original.sourceBindings.reduce((sum, row) => sum + row.expectedQuestionCount, 0), 75);
  assert.deepEqual(original.items.filter(row => row.choiceCount === 0).map(row => row.key).sort(), A.TWO_ROLE_KEYS);
  assert.equal(original.items.filter(row => row.choiceCount === 5).length, 5);
  assert.equal(H.sha256(fixtureBytes), A.MANIFEST_SHA256);
});
for (const [name, mutate] of Object.entries({
  'extra permission': m => { m.allowFallback = true; },
  'solution surface': m => { m.surface = 'SOLUTION'; },
  'solution mode': m => { m.mode = 'sol'; },
  'unsealed draft': m => { m.bindingState = 'DRAFT'; },
  'wrong logical denominator': m => { m.expectedCases = 13; },
  'taller mobile viewport': m => { m.viewports[1].height = 1600; },
  'eighth item': m => { m.items.push(clone(m.items[0])); },
  'missing item': m => { m.items.pop(); },
  'duplicate UID': m => { m.items[1].questionUid = m.items[0].questionUid; },
  'different whole question': m => { m.items[0].questionSha256 = '0'.repeat(64); },
  'different asset': m => { m.items[0].assetSha256 = '0'.repeat(64); },
  'hidden choices resealed': m => { m.items.find(row => row.choiceCount === 5).choiceCount = 0; },
  'alternate current source': m => { m.sourceBindings[0].gitBlobSha1 = '0'.repeat(40); },
  'transport receipt mismatch': m => { m.sourceTransportReceiptRef.sha256 = '0'.repeat(64); },
  'substituted static review': m => { m.staticEvidenceRef.commit = '0'.repeat(40); },
  'identity scope resealed': m => { m.identityBinding.sha256 = '0'.repeat(64); },
  'embedded-choice scope changed': m => { m.items.find(row => row.key === A.EMBEDDED_CHOICE_KEY).embeddedChoiceBinding.choicesSha256 = '0'.repeat(64); },
  'old engine': m => { m.engineBinding.gitBlobSha1 = '0'.repeat(40); },
  'old shared helper': m => { m.sharedHelperBinding.sha256 = '0'.repeat(64); }
})) test('closed immutable fixture refuses ' + name, () => { const m = clone(original); mutate(m); assert.throws(() => C.validateManifest(m)); });
test('invalid manifest cannot read any actual source or launch a browser', () => {
  let reads = 0;
  assert.throws(() => C.preflight({ read() { reads++; } }, { ...clone(original), surface: 'SOLUTION' }), /UI_SVG7_PROBLEM_ONLY/);
  assert.equal(reads, 0);
});
test('exact checkout pin is required and event commit is separately recorded', () => {
  const current = 'a'.repeat(40), event = 'b'.repeat(40);
  assert.equal(C.checkoutEvidence(current, { ARCHIVE_M2S1_SVG7_UI_EXPECTED_SHA: current, GITHUB_SHA: event }).githubEventCommit, event);
  for (const env of [{}, { ARCHIVE_M2S1_SVG7_UI_EXPECTED_SHA: null }, { ARCHIVE_M2S1_SVG7_UI_EXPECTED_SHA: event },
    { ARCHIVE_M2S1_SVG7_UI_EXPECTED_SHA: current, GITHUB_SHA: 'bad' }]) assert.throws(() => C.checkoutEvidence(current, env));
});
const question = () => ({ id: 24, content: 'Synthetic given <img src="assets/images/test/problem.svg">', choices: [], layoutTag: 'grid' });
function itemFor(q) {
  return { key: 'E048-Q24', sourceOrdinal: 24, imageBinding: 'CONTENT_SINGLE_IMG', choiceCount: q.choices.length, assetPath: 'archive/assets/images/test/problem.svg',
    questionSha256: digest(q), contentSha256: H.sha256(q.content),
    problemPayloadSha256: digest({ content: q.content ?? q.question, choices: q.choices ?? [] }),
    problemFieldsSha256: digest(C.ownSnapshot(q, ['content', 'question', 'choices'])),
    presentationSha256: digest(C.ownSnapshot(q, ['image', 'imageAlt', 'imageSize', 'layoutTag'])) };
}
test('selected whole-question and inline-image hashes bind without exposing contents', () => { const q = question(); C.assertBoundQuestion(itemFor(q), q); });
for (const [name, mutate] of Object.entries({
  'changed given': q => { q.content += ' changed'; },
  'changed option': q => { q.choices.push('synthetic choice'); },
  'changed nonproblem field': q => { q.syntheticAuthority = 'changed'; },
  'own null image': q => { q.image = null; },
  'ordinal drift': q => { q.id = 23; },
  'layout drift': q => { q.layoutTag = 'wide'; }
})) test('original binding refuses ' + name, () => { const q = question(), item = itemFor(q); mutate(q); assert.throws(() => C.assertBoundQuestion(item, q)); });
for (const [name, mutate] of Object.entries({
  'extra inline image': q => { q.content += '<img src="assets/images/test/other.svg">'; },
  'wrong inline image': q => { q.content = q.content.replace('problem.svg', 'other.svg'); },
  'unquoted img URI': q => { q.content = q.content.replaceAll('"', ''); },
  'added top image': q => { q.image = ''; }
})) test('even resealed synthetic profile refuses ' + name, () => { const q = question(); mutate(q); assert.throws(() => C.assertBoundQuestion(itemFor(q), q)); });
test('VM executes suffix and disallows runtime code generation', () => {
  assert.equal(C.loadQuestions(Buffer.from('window.questionBank=[{id:1}];window.questionBank[0].tag="suffix";'))[0].tag, 'suffix');
  assert.throws(() => C.loadQuestions(Buffer.from('window.questionBank=Function("return []")();')));
  assert.throws(() => C.loadQuestions(Buffer.from('window.questionBank=window.constructor.constructor("return [process.version]")();')));
  assert.throws(() => C.loadQuestions(Buffer.from('window.questionBank=({}).constructor.constructor("return [process.version]")();')));
  assert.throws(() => C.loadQuestions(Buffer.from('window.questionBank={};')), /UI_SVG7_BANK_REQUIRED/);
});
test('bound file verifies Git, raw hash and byte count', () => {
  const bytes = Buffer.from('synthetic public bytes');
  const ref = { path: 'docs/test.json', gitBlobSha1: H.gitBlob(bytes), sha256: H.sha256(bytes), bytes: bytes.length };
  assert.deepEqual(C.readBound({ read: () => bytes }, ref, 'UI_TEST_REF'), bytes);
  for (const patch of [{ gitBlobSha1: '0'.repeat(40) }, { sha256: '0'.repeat(64) }, { bytes: 1 }])
    assert.throws(() => C.readBound({ read: () => bytes }, { ...ref, ...patch }, 'UI_TEST_REF'), /UI_TEST_REF/);
});

// Synthetic geometry only. It is not an observed SVG7 screenshot or verdict.
function twoRoleFrame() {
  const state = rect => ({ rect, displayNone: false, visibilityHidden: false, opacityZero: false, visible: true });
  const number = { index: 0, kind: 'ELEMENT', tag: 'DIV', knownClasses: ['q-num'], otherClassCount: 0, otherClassesSha256: null,
    ...state({ x: 28, y: 90, width: 334, height: 20 }), hasText: true, mediaCount: 0, numberCount: 1, contentCount: 0, containsTargetImage: false };
  const content = { index: 1, kind: 'ELEMENT', tag: 'DIV', knownClasses: ['q-content'], otherClassCount: 0, otherClassesSha256: null,
    ...state({ x: 28, y: 120, width: 334, height: 440 }), hasText: true, mediaCount: 1, numberCount: 0, contentCount: 1, containsTargetImage: true };
  const empty = { index: 2, kind: 'ELEMENT', tag: 'DIV', knownClasses: [], otherClassCount: 1,
    otherClassesSha256: 'eecddef10cc4a80d3bd980d8a114244d6c2c6422131f2d0492d4428a94ab7674',
    rect: { x: 28, y: 570, width: 334, height: 0 }, displayNone: false, visibilityHidden: false, opacityZero: false,
    visible: false, hasText: false, mediaCount: 0, numberCount: 0, contentCount: 0, containsTargetImage: false };
  const image = { x: 28, y: 150, width: 334, height: 400 };
  return { schemaVersion: 'archive-problem-role-frame-v1', mode: 'exam', solutionNodes: 0, sourcePageMatched: true, targetAssetMatched: true,
    bankCount: 26, questionNumber: 24, question: { x: 28, y: 80, width: 334, height: 500 }, image,
    viewport: { width: 390, height: 844 }, scroll: { x: 0, y: 0 }, readiness: 'RENDER_READY', feedbackIdle: true,
    numberCount: 1, visibleNumberCount: 1, contentCount: 1, visibleContentCount: 1,
    directNodeCount: 3, visibleDirectNodeCount: 2, directNodes: [number, content, empty],
    mediaNodes: [{ index: 0, kind: 'IMG', ...state(image), directNodeIndex: 1, insideContent: true, isTargetImage: true, complete: true, naturalWidth: 668, naturalHeight: 800 }],
    obstructions: [{ x: 0, y: 0, width: 390, height: 52 }, { x: 0, y: 778, width: 390, height: 66 }],
    domSha256: 'd'.repeat(64), inputUnchanged: true, cssWrites: 0, domWrites: 0, viewportChanges: 0, scrollOperations: 0 };
}
test('closed two-role scope binds exact manifest, item and viewport', () => {
  const row = original.items.find(row => row.key === 'E048-Q24');
  assert.equal(A.checkedSvg7Scope(fixtureBytes, row, original.viewports[1], 'PROBLEM', 'exam').row.key, row.key);
  for (const args of [
    [Buffer.from('{}'), row, original.viewports[1], 'PROBLEM', 'exam'],
    [fixtureBytes, { ...row, questionUid: 'qid_v1_' + '0'.repeat(64) }, original.viewports[1], 'PROBLEM', 'exam'],
    [fixtureBytes, { ...row, choiceCount: 5 }, original.viewports[1], 'PROBLEM', 'exam'],
    [fixtureBytes, row, { ...original.viewports[1], height: 1600 }, 'PROBLEM', 'exam'],
    [fixtureBytes, row, original.viewports[1], 'SOLUTION', 'sol']
  ]) assert.throws(() => A.checkedSvg7Scope(...args));
});
test('zero-choice exact Q24 may use two roles; five-choice rows cannot hide choices', () => {
  const row = original.items.find(row => row.key === 'E048-Q24'), frame = twoRoleFrame();
  assert.equal(A.captureRoute(row, frame), 'EXACT_TWO_ROLES');
  const other = original.items.find(row => row.choiceCount === 5), hiddenChoices = { ...frame, questionNumber: other.sourceOrdinal, bankCount: other.expectedBankCount };
  assert.throws(() => A.captureRoute(other, hiddenChoices), /UI_SVG7_TWO_ROLE_EXACT_ZERO_CHOICES/);
  assert.equal(A.captureRoute(other, { ...hiddenChoices, visibleDirectNodeCount: 3 }), 'UNCHANGED_SHARED');
  assert.throws(() => A.captureRoute({ ...row, key: 'UNOWNED' }, frame), /UI_SVG7_TWO_ROLE_EXACT_ZERO_CHOICES/);
});
test('shared three-child minimum is unchanged', () => {
  assert.throws(() => H.problemContentClip({ question: { x: 0, y: 0, width: 300, height: 200 }, children: [{ x: 0, y: 0, width: 300, height: 20 }, { x: 0, y: 30, width: 300, height: 160 }] }), /UI_COMPLETE_PROBLEM_CHILDREN/);
});
test('two-role geometry includes the entire number, statement and target image', () => {
  const f = twoRoleFrame(); A.assertTwoRoleFrame(f);
  const clip = A.twoRoleContentClip(f), plan = A.planTwoRoleTiles(f);
  assert.equal(clip.y, 88); assert.equal(clip.height, 474);
  assert.equal(plan.coverage.complete, true); assert.equal(plan.tiles.length, 1);
});
for (const [name, mutate] of Object.entries({
  'hidden statement': f => { f.directNodes[1].visibilityHidden = true; },
  'dropped text node': f => { f.directNodes[2] = { index: 2, kind: 'TEXT', hasText: true, rect: { x: 0, y: 0, width: 0, height: 0 }, visible: false }; },
  'unknown empty child': f => { f.directNodes[2].otherClassesSha256 = '0'.repeat(64); },
  'missing empty child': f => { f.directNodes.pop(); f.directNodeCount--; },
  'hidden media': f => { f.mediaNodes[0].visible = false; },
  'second image': f => { f.mediaNodes.push({ ...clone(f.mediaNodes[0]), index: 1, isTargetImage: false }); f.directNodes[1].mediaCount++; },
  'foreign media role': f => { f.mediaNodes[0].directNodeIndex = 0; },
  'cropped image': f => { f.mediaNodes[0].rect.width = 500; },
  'image not loaded': f => { f.mediaNodes[0].complete = false; },
  'DOM changed': f => { f.inputUnchanged = false; },
  'solution surface': f => { f.solutionNodes = 1; },
  'wrong target asset': f => { f.targetAssetMatched = false; },
  'obscured header geometry': f => { f.directNodes[0].rect.y = 130; }
})) test('two-role frame refuses ' + name, () => { const f = twoRoleFrame(); mutate(f); assert.throws(() => A.assertTwoRoleFrame(f)); });
test('tall exact problem uses overlapping original tiles within the eight-tile bound', () => {
  const f = twoRoleFrame(); f.question.height = 1300; f.directNodes[1].rect.height = 1240; f.directNodes[2].rect.y = 1370;
  const plan = A.planTwoRoleTiles(f); assert.equal(plan.tiles.length, 2);
  assert.equal(plan.tiles[0].relativeInterval[1] - plan.tiles[1].relativeInterval[0], 32);
  assert.equal(plan.coverage.complete, true);
  f.question.height = 10000; f.directNodes[1].rect.height = 9900; f.directNodes[2].rect.y = 10030;
  assert.throws(() => A.planTwoRoleTiles(f), /UI_SCROLL_TILE_LIMIT/);
});

function caseFixture() {
  const manifest = clone(original), ref = (file, sha = 'c'.repeat(64)) => ({ commit: 'a'.repeat(40), path: file, gitBlobSha1: 'b'.repeat(40), sha256: sha, bytes: 100 });
  const inputs = { items: manifest.items.map(item => ({ ...item, sourceRef: ref(item.sourcePath), assetRef: ref(item.assetPath, item.assetSha256) })) };
  const results = [];
  for (const viewport of manifest.viewports) for (const item of inputs.items) {
    const filename = `${item.key}-${viewport.name}-tile-01.png`, dom = 'd'.repeat(64);
    const tile = { tileIndex: 1, relativeInterval: [0, 100], filename, clip: { x: 28, y: 60, width: 300, height: 100 }, scroll: { x: 0, y: 0 }, scrollOperations: 1,
      feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: 100, foreignContentHits: 0, domSha256: dom };
    const capture = { schemaVersion: H.TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: 8, overlapCssPixels: 32, tileCount: 1,
      content: { height: 100 }, coverage: H.assertTileCoverage(100, [tile]), tiles: [tile], visibleChildren: item.key === A.EMBEDDED_CHOICE_KEY ? 2 : item.choiceCount ? 3 : 2,
      feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0, compositeImageCreated: false, domSha256: dom };
    if (!item.choiceCount || item.key === A.EMBEDDED_CHOICE_KEY) capture.closedProblemRoles = { schemaVersion: 'archive-m2s1-svg7-two-direct-roles-v1', key: item.key, questionUid: item.questionUid,
      sourceOrdinal: item.sourceOrdinal, expectedChoiceCount: 0, numberRoleCount: 1, contentRoleCount: 1, targetImageCount: 1, emptyZeroHeightNodeCount: 1,
      originalSharedHelperUnchanged: true, initialFrameSha256: 'e'.repeat(64), sourceRef: item.sourceRef, assetRef: item.assetRef,
      ...(item.key === A.EMBEDDED_CHOICE_KEY ? { schemaVersion: 'archive-m2s1-svg7-embedded-image-choices-v1', expectedChoiceCount: 5, emptyZeroHeightNodeCount: 0,
        embeddedChoiceBinding: item.embeddedChoiceBinding, choiceState: embeddedFrame().choiceState } : {}) };
    results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport, sourceRef: item.sourceRef, assetRef: item.assetRef,
      screenshots: [{ tileIndex: 1, path: filename, sha256: H.sha256(filename), bytes: 16 }],
      technical: { mode: 'exam', questions: item.expectedBankCount, pages: 1, readiness: 'RENDER_READY', imagesComplete: true, mathErrors: 0, unrenderedMath: 0, mathJaxSource: 'local', solutionNodes: 0,
        fontReadiness: { status: 'loaded', family: 'Nanum Myeongjo', weights: [400, 700, 800].map(weight => ({ weight, loadedFaces: 1, allLoaded: true, checked: true })), problemFontFamilies: ['"Nanum Myeongjo", serif'] } },
      geometry: { naturalWidth: 700, image: { width: 300 }, imageInsideQuestion: true }, capture,
      visualReview: 'PENDING', pageErrors: [], requestFailures: [], externalRequests: [] });
  }
  return { manifest, inputs, results, artifacts: results.flatMap(row => row.screenshots.map(({ path, sha256, bytes }) => ({ path, sha256, bytes }))) };
}
test('all fourteen logical cases require exact original screenshot inventory; visual approval remains pending', () => {
  const f = caseFixture(); assert.equal(C.assertCompletedResults(f.results, f.inputs, f.manifest, f.artifacts), 14);
});
for (const [name, mutate] of Object.entries({
  'missing case': f => { f.results.pop(); },
  'duplicate case': f => { f.results[1] = clone(f.results[0]); },
  'viewport change': f => { f.results[0].viewport = { ...f.results[0].viewport, height: 1600 }; },
  'solution nodes': f => { f.results[0].technical.solutionNodes = 1; },
  'font loading': f => { f.results[0].technical.fontReadiness.status = 'loading'; },
  'fallback font': f => { f.results[0].technical.fontReadiness.problemFontFamilies = ['serif']; },
  'missing font weight': f => { f.results[0].technical.fontReadiness.weights.pop(); },
  'math error': f => { f.results[0].technical.mathErrors = 1; },
  'two roles borrowed for choices': f => { f.results.find(row => row.capture.visibleChildren === 3).capture.visibleChildren = 2; },
  'missing role binding': f => { delete f.results.find(row => row.capture.visibleChildren === 2).capture.closedProblemRoles; },
  'role source changed': f => { const row = f.results.find(row => row.capture.visibleChildren === 2); row.capture.closedProblemRoles.sourceRef = { ...row.sourceRef, sha256: '0'.repeat(64) }; },
  'CSS write': f => { f.results[0].capture.cssWrites = 1; },
  'DOM write': f => { f.results[0].capture.domWrites = 1; },
  'resized viewport': f => { f.results[0].capture.viewportChanges = 1; },
  'composite image': f => { f.results[0].capture.compositeImageCreated = true; },
  'foreign content': f => { f.results[0].capture.tiles[0].foreignContentHits = 1; },
  'obscured tile': f => { f.results[0].capture.tiles[0].obstructionsIntersectingClip = 1; },
  'bottom cropped': f => { f.results[0].capture.tiles[0].relativeInterval[1] = 99; },
  'missing PNG': f => { f.artifacts.pop(); },
  'extra PNG': f => { f.artifacts.push({ path: 'extra.png', sha256: '0'.repeat(64), bytes: 1 }); },
  'PNG changed': f => { f.artifacts[0].sha256 = '0'.repeat(64); }
})) test('complete technical contract refuses ' + name, () => { const f = caseFixture(); mutate(f); assert.throws(() => C.assertCompletedResults(f.results, f.inputs, f.manifest, f.artifacts)); });
test('more tiles retain fourteen logical cases and full 32-pixel coverage', () => {
  const f = caseFixture(), row = f.results[0], tile = clone(row.capture.tiles[0]);
  tile.tileIndex = 2; tile.relativeInterval = [68, 168]; tile.filename = tile.filename.replace('01.png', '02.png');
  row.capture.content.height = 168; row.capture.tiles.push(tile); row.capture.tileCount = 2; row.capture.coverage = H.assertTileCoverage(168, row.capture.tiles);
  row.screenshots.push({ tileIndex: 2, path: tile.filename, sha256: H.sha256(tile.filename), bytes: 16 });
  f.artifacts.push({ path: tile.filename, sha256: H.sha256(tile.filename), bytes: 16 });
  assert.equal(C.assertCompletedResults(f.results, f.inputs, f.manifest, f.artifacts), 15);
});
test('output is an empty directory outside the source checkout with no symlink ancestors', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'svg7-contract-'));
  try {
    const root = path.join(tmp, 'checkout'); fs.mkdirSync(root);
    assert.equal(C.checkedOutput(root, path.join(tmp, 'out')), path.join(tmp, 'out'));
    assert.throws(() => C.checkedOutput(root, root)); assert.throws(() => C.checkedOutput(root, path.join(root, 'out')));
    fs.mkdirSync(path.join(tmp, 'used')); fs.writeFileSync(path.join(tmp, 'used/prior.json'), '{}');
    assert.throws(() => C.checkedOutput(root, path.join(tmp, 'used')));
    fs.symlinkSync(path.join(tmp, 'used'), path.join(tmp, 'alias'));
    assert.throws(() => C.checkedOutput(root, path.join(tmp, 'alias/out')));
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});
test('dedicated workflow binds current engine, exact branch, full Git and read-only permissions', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/archive-m2s1-svg7-problem-ui.yml'), 'utf8');
  assert.match(workflow, /branches: \['review-reference\/m2s1-svg7-problem-ui-20261116'\]/);
  assert.match(workflow, /if: github.ref == 'refs\/heads\/review-reference\/m2s1-svg7-problem-ui-20261116'/);
  assert.match(workflow, /paths:\n      - '\.github\/workflows\/archive-m2s1-svg7-problem-ui.yml'/);
  assert.match(workflow, /contents: read/); assert.doesNotMatch(workflow, /contents: write|pull_request_target/);
  assert.match(workflow, /fetch-depth: 0/); assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /905952ae39138e1f6dc0aa2d7c7c8a64403f527b/);
  assert.match(workflow, /a963c562478b96f7f9d8ae09ad6e5c85b3262296d734e7abd001836e1c3f317b/);
  assert.match(workflow, /ARCHIVE_M2S1_SVG7_UI_EXPECTED_SHA: \$\{\{ github.sha \}\}/);
  assert.match(workflow, /if: always\(\)/); assert.match(workflow, /playwright@1\.62\.1/);
  assert.doesNotMatch(workflow, /\n    env:/); // runner context remains step-scoped.
});


function embeddedFrame() {
  const f = twoRoleFrame();
  f.bankCount = 24; f.questionNumber = 15; f.directNodes.pop(); f.directNodeCount = 2;
  f.choiceState = { choiceCount: 5, allChoicesNonemptyStrings: true, ownEmbeddedFlag: true, embeddedFlagValue: true, nestedEmbeddedFlag: false,
    choicesSha256: original.items.find(row => row.key === A.EMBEDDED_CHOICE_KEY).embeddedChoiceBinding.choicesSha256 };
  return f;
}
test('exact embedded five-choice Q15 has two visible roles and no invented answer-space node', () => {
  const row = original.items.find(row => row.key === A.EMBEDDED_CHOICE_KEY), f = embeddedFrame();
  assert.equal(A.captureRoute(row, f), 'EXACT_EMBEDDED_CHOICES');
  assert.equal(A.assertEmbeddedChoiceFrame(row, f).emptyNodes, 0);
  assert.equal(A.planTwoRoleTiles(f, row).coverage.complete, true);
  assert.throws(() => A.assertTwoRoleFrame(f), /UI_TWO_ROLE_EMPTY_NODE_INVENTORY/);
  assert.throws(() => A.captureRoute(row, { ...f, visibleDirectNodeCount: 3 }), /UI_SVG7_EMBEDDED_CHOICES_EXTRA_DIRECT_ROLE/);
});
for (const [name, mutate] of Object.entries({
  'flag absent': f => { f.choiceState.ownEmbeddedFlag = false; },
  'flag false': f => { f.choiceState.embeddedFlagValue = false; },
  'flag null': f => { f.choiceState.embeddedFlagValue = null; },
  'nested alias': f => { f.choiceState.nestedEmbeddedFlag = true; },
  'choice payload drift': f => { f.choiceState.choicesSha256 = '0'.repeat(64); },
  'empty choice': f => { f.choiceState.allChoicesNonemptyStrings = false; },
  'different choice count': f => { f.choiceState.choiceCount = 4; },
  'extra empty answer-space': f => { f.directNodes.push(twoRoleFrame().directNodes[2]); f.directNodeCount++; },
  'hidden choice text outside image': f => { f.directNodes.push({ index: 2, kind: 'TEXT', hasText: true, visible: false, rect: {x:0,y:0,width:0,height:0} }); f.directNodeCount++; },
  'hidden statement': f => { f.directNodes[1].visibilityHidden = true; },
  'second image': f => { f.mediaNodes.push({...clone(f.mediaNodes[0]),index:1,isTargetImage:false});f.directNodes[1].mediaCount++; },
  'cropped image': f => { f.mediaNodes[0].rect.width = 500; },
  'wrong ordinal': f => { f.questionNumber = 14; }
})) test('embedded choices closed case refuses ' + name, () => {
  const row = original.items.find(row => row.key === A.EMBEDDED_CHOICE_KEY), f = embeddedFrame(); mutate(f);
  assert.throws(() => A.captureRoute(row, f));
});
test('embedded contract cannot be moved to another UID or a resealed before-source', () => {
  const row = original.items.find(row => row.key === A.EMBEDDED_CHOICE_KEY);
  for (const change of [{questionUid:'qid_v1_'+'0'.repeat(64)}, {sourceOrdinal:14}, {questionSha256:'0'.repeat(64)},
    {embeddedChoiceBinding:{...row.embeddedChoiceBinding,beforeQuestionSha256:'0'.repeat(64)}}])
    assert.throws(() => A.assertEmbeddedChoiceFrame({...clone(row),...change}, embeddedFrame()));
  const other = original.items.find(row => row.key === 'E037-Q15');
  assert.throws(() => A.captureRoute({...other,embeddedChoiceBinding:row.embeddedChoiceBinding}, {...embeddedFrame(),bankCount:25}));
});
test('embedded full original image still requires all original scroll tiles', () => {
  const row = original.items.find(row => row.key === A.EMBEDDED_CHOICE_KEY), f = embeddedFrame();
  f.question.height = 1800; f.directNodes[1].rect.height = 1700; f.image.height = 1660; f.mediaNodes[0].rect.height = 1660;
  const plan = A.planTwoRoleTiles(f,row);
  assert(plan.tiles.length > 1);assert.equal(plan.coverage.complete,true);
  for(let i=1;i<plan.tiles.length;i++)assert.equal(plan.tiles[i-1].relativeInterval[1]-plan.tiles[i].relativeInterval[0],32);
});
test('completed embedded case refuses changed flag or suppressed choices on an ordinary row', () => {
  for(const mutate of [
    f=>{f.results.find(r=>r.key===A.EMBEDDED_CHOICE_KEY).capture.closedProblemRoles.choiceState.embeddedFlagValue=false;},
    f=>{f.results.find(r=>r.key===A.EMBEDDED_CHOICE_KEY).capture.closedProblemRoles.emptyZeroHeightNodeCount=1;},
    f=>{f.results.find(r=>r.key===A.EMBEDDED_CHOICE_KEY).capture.closedProblemRoles.embeddedChoiceBinding.oldAssetRef={};},
    f=>{f.results.find(r=>r.key===A.EMBEDDED_CHOICE_KEY).capture.visibleChildren=3;}
  ]){const f=caseFixture();mutate(f);assert.throws(()=>C.assertCompletedResults(f.results,f.inputs,f.manifest,f.artifacts));}
});
test('historical embedded metadata requires an exact regular Git file, not a new self-declared hash', () => {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'svg7-historical-'));
  const git=(...args)=>cp.execFileSync('git',['-C',tmp,...args],{stdio:['ignore','pipe','pipe'],env:{...process.env,GIT_AUTHOR_NAME:'Archive Test',GIT_AUTHOR_EMAIL:'archive-test@example.invalid',GIT_COMMITTER_NAME:'Archive Test',GIT_COMMITTER_EMAIL:'archive-test@example.invalid'}}).toString().trim();
  try{
    git('init','-q');fs.writeFileSync(path.join(tmp,'before.json'),'{}\n');fs.symlinkSync('before.json',path.join(tmp,'alias.json'));git('add','before.json','alias.json');git('commit','-qm','synthetic exact immutable input');
    const commit=git('rev-parse','HEAD'),bytes=fs.readFileSync(path.join(tmp,'before.json'));
    const ref={commit,path:'before.json',gitBlobSha1:H.gitBlob(bytes),sha256:H.sha256(bytes),bytes:bytes.length};
    assert.deepEqual(C.readHistoricalBound({root:tmp},ref),bytes);
    for(const mutation of [{sha256:'0'.repeat(64)},{gitBlobSha1:'0'.repeat(40)},{bytes:1},{commit:'0'.repeat(40)},{path:'../before.json'}])
      assert.throws(()=>C.readHistoricalBound({root:tmp},{...ref,...mutation}));
    const symlink=Buffer.from('before.json');assert.throws(()=>C.readHistoricalBound({root:tmp},{commit,path:'alias.json',gitBlobSha1:H.gitBlob(symlink),sha256:H.sha256(symlink),bytes:symlink.length}),/UI_SVG7_ORIGINAL_REGULAR_BLOB/);
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
