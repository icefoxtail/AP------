'use strict';

// Closed problem-only capture for E052 Q5 and its restored original given diagram.
// Source seals remain a draft until the trusted public candidate is verified.
// Technical capture confers no mathematical, Native or metadata approval.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const { stable, sha256, gitBlob, createGitReader, studentFontResourcePath, checkedStudentFontRefs, FONT_DIR, FONT_STYLESHEET,
  fontFailureDiagnostic, captureProblemTiles, readScreenshotArtifacts, assertScreenshotInventory } = H;
const MANIFEST_PATH = 'tests/fixtures/archive-m3-e052-q5-problem-ui.json';
const CHECKER_PATH = 'tools/check-m3-e052-q5-problem-browser.cjs';
const SHARED_CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const SHARED_CHECKER_SHA256 = 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-m3-e052-q5-student-ui-preview-v1';
const FONT_FAMILY = 'Nanum Myeongjo';
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const EXPECTED_ITEMS_SHA256 = '4654337aafdb73a826ab1b6e286394042932e506feece451dc5526bf6063e937';
const EXPECTED_SOURCE_BINDINGS = Object.freeze([{"sourcePath":"archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js","gitBlobSha1":"82c627bacb59105e9bd3a5397d4828757308d587","sha256":"996ba1f2538b060c96f6528fc90c62affa567285a6a24d2106051199f9a348d1","bytes":66658}]);
const EXPECTED_SURFACE_REFS = Object.freeze([{"path":"archive/engine.html","gitBlobSha1":"226342544e896cd6a6f35aa946947b89ef3c893e","sha256":"671f89999fe07b0f5695bb088ef9d262d7d2da95947689117241bb6f3b633ce5","bytes":196085},{"path":"archive/screen-runtime-adapter.js","gitBlobSha1":"fb0ee7afc7eed48b30975874c5536eb283f308c9","sha256":"ed0b267dc3b27675c2c0ed0aa985991a0aad3d3863ce5bcd43f0acb28033d709","bytes":53393}]);
const VIEWPORTS = Object.freeze([{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]);
const DRAFT = 'DRAFT_AWAIT_TRUSTED_PUBLIC_SOURCE';
const SEALED = 'SEALED_PUBLIC_RENDERER_CANDIDATE';
const ownSnapshot = (question, fields) => Object.fromEntries(fields.map(field => [field,
  { present: Object.hasOwn(question, field), value: question[field] ?? null }]));
function ownKeys(value, keys, code) {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), keys.slice().sort(), code);
}
function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'bindingState', 'expectedCases', 'viewports', 'sourceBindings', 'items'], 'UI_Q5_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-m3-e052-q5-problem-ui-manifest-v1', 'UI_Q5_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'EXACT_E052_Q5_ORIGINAL_GIVEN_DIAGRAM_NO_APPROVAL', 'UI_Q5_MANIFEST_SCOPE');
  assert([DRAFT, SEALED].includes(manifest.bindingState), 'UI_Q5_BINDING_STATE');
  assert.equal(manifest.expectedCases, 2, 'UI_Q5_CASE_COUNT');
  assert.deepEqual(manifest.viewports, VIEWPORTS, 'UI_Q5_EXACT_VIEWPORTS');
  assert(Array.isArray(manifest.items) && manifest.items.length === 1, 'UI_Q5_EXACT_ITEMS');
  assert.equal(sha256(stable(manifest.items)), EXPECTED_ITEMS_SHA256, 'UI_Q5_EXACT_TARGET_BINDING');
  assert.equal(new Set(manifest.items.map(item => item.questionUid)).size, 1, 'UI_Q5_UNIQUE_UID');
  const sources = [...new Set(manifest.items.map(item => item.sourcePath))].sort();
  assert.equal(sources.length, 1, 'UI_Q5_ONE_BANK');
  assert(Array.isArray(manifest.sourceBindings) && manifest.sourceBindings.length === 1, 'UI_Q5_SOURCE_BINDINGS');
  assert.deepEqual(manifest.sourceBindings.map(row => row.sourcePath), sources, 'UI_Q5_SOURCE_INVENTORY');
  for (const row of manifest.sourceBindings) {
    ownKeys(row, ['sourcePath', 'gitBlobSha1', 'sha256', 'bytes'], 'UI_Q5_SOURCE_BINDING_KEYS');
    assert(SHA1.test(row.gitBlobSha1) && SHA256.test(row.sha256) && Number.isSafeInteger(row.bytes) && row.bytes > 0, 'UI_Q5_SOURCE_BINDING_VALUES');
  }
  assert.deepEqual(manifest.sourceBindings, EXPECTED_SOURCE_BINDINGS, 'UI_Q5_EXACT_EXPECTED_PUBLIC_SOURCE');
  return manifest;
}
function requireSealedManifest(manifest) {
  validateManifest(manifest);
  assert.equal(manifest.bindingState, SEALED, 'UI_Q5_PUBLIC_SOURCE_SEAL_REQUIRED');
  return manifest;
}
function checkoutEvidence(actualCommit, env = process.env) {
  const expectedCommit = env.ARCHIVE_M3_E052_Q5_UI_EXPECTED_SHA;
  assert(typeof expectedCommit === 'string' && SHA1.test(expectedCommit), 'UI_Q5_EXPECTED_CHECKOUT_REQUIRED');
  assert.equal(actualCommit, expectedCommit, 'UI_Q5_CHECKOUT_MISMATCH');
  assert(env.GITHUB_SHA === undefined || (typeof env.GITHUB_SHA === 'string' && SHA1.test(env.GITHUB_SHA)), 'UI_Q5_EVENT_SHA');
  return { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: actualCommit, githubEventCommit: env.GITHUB_SHA ?? null };
}
function loadQuestions(bytes) {
  assert(Buffer.isBuffer(bytes) && bytes.length > 0 && bytes.length <= 16 * 1024 * 1024, 'UI_Q5_SOURCE_SIZE');
  const context = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
  new vm.Script('globalThis.window={};globalThis.console={log(){},warn(){},error(){}};').runInContext(context, { timeout: 1500 });
  new vm.Script(bytes.toString('utf8'), { filename: 'q5-problem-source.js' }).runInContext(context, { timeout: 1500 });
  const json = new vm.Script(`(() => {
    const bank = window.questionBank ?? globalThis.questionBank ?? window.examData?.questions ?? globalThis.examData?.questions;
    if (!Array.isArray(bank) || !bank.length) throw new Error('UI_Q5_BANK_REQUIRED');
    const seen = new Set();
    function data(value) {
      if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return;
      if (!value || typeof value !== 'object' || seen.has(value)) throw new Error('UI_Q5_SOURCE_DATA');
      seen.add(value);
      if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) throw new Error('UI_Q5_SOURCE_PROTOTYPE');
      for (const key of Reflect.ownKeys(value)) {
        if (Array.isArray(value) && key === 'length') continue;
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (typeof key !== 'string' || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw new Error('UI_Q5_SOURCE_DESCRIPTOR');
        data(descriptor.value);
      }
      if (Array.isArray(value) && Object.keys(value).length !== value.length) throw new Error('UI_Q5_SOURCE_ARRAY');
      seen.delete(value);
    }
    data(bank); return JSON.stringify(bank);
  })()`).runInContext(context, { timeout: 1500 });
  return JSON.parse(json);
}
function assertBoundQuestion(item, question) {
  assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_Q5_ORDINAL');
  assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_Q5_PROBLEM_PAYLOAD_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['content', 'question', 'choices']))), item.problemFieldsSha256, 'UI_Q5_PROBLEM_OWN_FIELDS_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['image', 'imageAlt', 'imageSize', 'layoutTag']))), item.presentationSha256, 'UI_Q5_PRESENTATION_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['choicesEmbeddedInImage']))), item.choicePresentationSha256, 'UI_Q5_CHOICE_PRESENTATION_DRIFT');
  assert(Array.isArray(question.choices) && question.choices.length === 5 && question.choicesEmbeddedInImage !== true, 'UI_Q5_EXACT_VISIBLE_CHOICES');
  assert(!/<img\b/i.test(String(question.content ?? question.question ?? '')), 'UI_Q5_UNDECLARED_INLINE_IMAGE');
  assert.equal(item.imageBinding, 'QUESTION_IMAGE', 'UI_Q5_IMAGE_PROFILE');
  assert.equal(question.image, item.assetPath.slice('archive/'.length), 'UI_Q5_IMAGE_POINTER');
}
function checkedSurface(reader) {
  return EXPECTED_SURFACE_REFS.map(expected => {
    // Render engine files may change after the capture (user decision 2026-11-18): the current bytes are
    // recorded in the technical result, not compared with the fixed edition.
    const bytes = reader.read(expected.path), actual = reader.ref(expected.path, bytes);
    return actual;
  });
}
function preflight(reader, manifest) {
  requireSealedManifest(manifest);
  const identityBytes = reader.read(IDENTITY_PATH), identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_Q5_IDENTITY_RECORDS');
  const surfaceRefs = checkedSurface(reader);
  const banks = new Map();
  for (const binding of manifest.sourceBindings) {
    const bytes = reader.read(binding.sourcePath);
    assert.equal(gitBlob(bytes), binding.gitBlobSha1, 'UI_Q5_SOURCE_GIT_DRIFT');
    assert.equal(sha256(bytes), binding.sha256, 'UI_Q5_SOURCE_RAW_DRIFT');
    assert.equal(bytes.length, binding.bytes, 'UI_Q5_SOURCE_SIZE_DRIFT');
    banks.set(binding.sourcePath, { bytes, questions: loadQuestions(bytes) });
  }
  const items = manifest.items.map(item => {
    const { bytes, questions } = banks.get(item.sourcePath), asset = reader.read(item.assetPath);
    assert.equal(questions.length, item.expectedBankCount, 'UI_Q5_BANK_COUNT');
    assertBoundQuestion(item, questions[item.sourceOrdinal - 1]);
    assert.equal(gitBlob(asset), item.assetGitBlobSha1, 'UI_Q5_ASSET_GIT_DRIFT');
    assert.equal(sha256(asset), item.assetSha256, 'UI_Q5_ASSET_RAW_DRIFT');
    assert.equal(asset.length, item.assetBytes, 'UI_Q5_ASSET_SIZE_DRIFT');
    const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
    assert.equal(matched.length, 1, 'UI_Q5_UNIQUE_IDENTITY');
    assert.equal(matched[0].questionUid, item.questionUid, 'UI_Q5_IDENTITY_UID');
    const bankIdentity = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length));
    assert(bankIdentity.length === 25 && new Set(bankIdentity.map(row => row.sourceOrdinal)).size === 25 &&
      bankIdentity.every(row => Number.isSafeInteger(row.sourceOrdinal) && row.sourceOrdinal >= 1 && row.sourceOrdinal <= 25), 'UI_Q5_IDENTITY_DENOMINATOR');
    assert.equal(identity.records.filter(row => row.questionUid === item.questionUid).length, 1, 'UI_Q5_GLOBAL_UID_UNIQUE');
    return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, expectedBankCount: item.expectedBankCount,
      imageBinding: item.imageBinding, problemPayloadSha256: item.problemPayloadSha256, problemFieldsSha256: item.problemFieldsSha256,
      presentationSha256: item.presentationSha256, choicePresentationSha256: item.choicePresentationSha256, expectedImageWidth: item.expectedImageWidth, expectedImageHeight: item.expectedImageHeight, sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), surfaceRefs, items };
}
function assertTechnicalState(technical, expectedBankCount) {
  assert.equal(expectedBankCount, 25, 'UI_Q5_EXPECTED_BANK_COUNT');
  assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
  assert.equal(technical.questions, expectedBankCount, 'UI_Q5_RENDERED_BANK_COUNT');
  assert.equal(technical.readiness, 'RENDER_READY', 'UI_Q5_RENDER_READY');
  assert(technical.pages > 0 && technical.imagesComplete === true, 'UI_RENDERED_IMAGES');
  assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
  assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
  assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
  assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
}
function assertCompletedResults(results, inputs, manifest, artifacts) {
  requireSealedManifest(manifest);
  assert.equal(results.length, 2, 'UI_Q5_TWO_LOGICAL_CASES');
  assert.equal(inputs.items.length, 1, 'UI_Q5_INPUT_INVENTORY');
  const seen = new Set();
  for (const row of results) {
    const item = inputs.items.find(item => item.key === row.key), viewport = VIEWPORTS.find(viewport => viewport.name === row.viewport?.name);
    assert(item && viewport, 'UI_Q5_RESULT_TARGET');assert.deepEqual(row.viewport, viewport, 'UI_Q5_RESULT_VIEWPORT');
    const key = item.questionUid + '#' + viewport.name;assert(!seen.has(key), 'UI_Q5_DUPLICATE_LOGICAL_CASE');seen.add(key);
    assert(row.status === 'PASS' && row.visualReview === 'PENDING' && row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal, 'UI_Q5_RESULT_TARGET');
    assert.deepEqual(row.sourceRef, item.sourceRef, 'UI_Q5_RESULT_SOURCE');assert.deepEqual(row.assetRef, item.assetRef, 'UI_Q5_RESULT_ASSET');
    assertTechnicalState(row.technical, item.expectedBankCount);
    const fonts = row.technical.fontReadiness;
    assert(fonts && fonts.status === 'loaded' && fonts.family === FONT_FAMILY && Array.isArray(fonts.weights) &&
      fonts.weights.length === 3 && fonts.weights.every((font, index) => font.weight === [400, 700, 800][index] && font.loadedFaces > 0 && font.allLoaded === true && font.checked === true) &&
      Array.isArray(fonts.problemFontFamilies) && fonts.problemFontFamilies.length > 0 && fonts.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_Q5_COMPLETED_FONT_READINESS');
    const capture = row.capture;
    assert.deepEqual(capture.equalSlotRoles, Q5_EQUAL_SLOT_ROLES, 'UI_Q5_EQUAL_SLOT_COMPLETED_ROLES');
    assert(capture.visibleChildren === 1 && capture.visibleRoleDescendants === 4 && capture.measuredEnvelopeRects === 5, 'UI_Q5_EQUAL_SLOT_COMPLETED_COUNTS');
    assert(Array.isArray(capture.equalSlotEvidence) && capture.equalSlotEvidence.length === 7, 'UI_Q5_EQUAL_SLOT_COMPLETED_EVIDENCE');
    assert.deepEqual(capture.equalSlotEvidence.slice(0, 2), [item.sourceRef, item.assetRef], 'UI_Q5_EQUAL_SLOT_COMPLETED_INPUTS');
    const evidencePaths = [MANIFEST_PATH, CHECKER_PATH, SHARED_CHECKER_PATH, ...Q5_EQUAL_SLOT_SURFACE.map(ref => ref.path)];
    capture.equalSlotEvidence.slice(2).forEach((ref, index) => {
      ownKeys(ref, ['commit','path','gitBlobSha1','sha256','bytes'], 'UI_Q5_EQUAL_SLOT_COMPLETED_REF');
      assert(ref.commit === item.sourceRef.commit && ref.path === evidencePaths[index] && SHA1.test(ref.gitBlobSha1) && SHA256.test(ref.sha256) &&
        Number.isSafeInteger(ref.bytes) && ref.bytes > 0, 'UI_Q5_EQUAL_SLOT_COMPLETED_REF');
      if (index === 2) assert.equal(ref.sha256, SHARED_CHECKER_SHA256, 'UI_Q5_EQUAL_SLOT_COMPLETED_COMMON');
      if (index > 2) assert.deepEqual(ref, { commit: item.sourceRef.commit, ...Q5_EQUAL_SLOT_SURFACE[index - 3] }, 'UI_Q5_EQUAL_SLOT_COMPLETED_SURFACE');
    });
    assert(capture.schemaVersion === H.TILE_SCHEMA && capture.method === 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' && capture.overlapCssPixels === 32 && capture.tileLimit === 8 &&
      capture.cssWrites === 0 && capture.domWrites === 0 && capture.viewportChanges === 0 && capture.compositeImageCreated === false && capture.feedbackIdle === true && capture.foreignContentHits === 0, 'UI_Q5_UNCHANGED_CAPTURE_REQUIRED');
    assert.deepEqual(capture.coverage, H.assertTileCoverage(capture.content.height, capture.tiles), 'UI_Q5_COMPLETE_COVERAGE');
    for (const tile of capture.tiles) {
      assert(tile.feedbackIdle === true && tile.obstructionsIntersectingClip === 0 && tile.foreignContentHits === 0 && tile.hitTestSamples > 0 && tile.domSha256 === capture.domSha256, 'UI_Q5_UNOBSTRUCTED_ORIGINAL_TILE');
    }
    assert(row.geometry?.imageInsideQuestion === true && row.geometry.naturalWidth === item.expectedImageWidth && row.geometry.naturalHeight === item.expectedImageHeight && row.geometry.image.width > 0, 'UI_Q5_RESULT_IMAGE_GEOMETRY');
    for (const field of ['pageErrors', 'requestFailures', 'externalRequests']) assert.deepEqual(row[field], [], 'UI_Q5_NETWORK_OR_PAGE_FAILURE');
  }
  assert.equal(seen.size, 2, 'UI_Q5_COMPLETE_LOGICAL_INVENTORY');
  return assertScreenshotInventory(results, artifacts);
}
function checkedOutput(root, out) {
  root = path.resolve(root); out = path.resolve(out);
  assert(out !== root && !out.startsWith(root + path.sep), 'UI_Q5_OUTPUT_OUTSIDE_CHECKOUT');
  for (let current = out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'UI_Q5_OUTPUT_SYMLINK');
  assert(!fs.existsSync(out) || fs.readdirSync(out).length === 0, 'UI_Q5_EMPTY_OUTPUT_REQUIRED');
  return out;
}

async function measureProblemRoles(image, expected) {
  const check = (condition, code) => { if (!condition) throw new Error(code); };
  const mode = typeof AppState === 'undefined' ? null : AppState.mode;
  const solutionNodes = document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length;
  check(mode === 'exam' && solutionNodes === 0, 'UI_ROLE_DIAGNOSTIC_SURFACE');
  const box = image?.closest('.q-box');
  check(image?.tagName === 'IMG' && box && document.querySelector('#print-area')?.contains(box), 'UI_ROLE_DIAGNOSTIC_TARGET');
  check(innerWidth === expected.width && innerHeight === expected.height, 'UI_ROLE_DIAGNOSTIC_VIEWPORT');
  check(AppState.data.length === expected.bankCount, 'UI_ROLE_DIAGNOSTIC_BANK');
  const query = new URL(location.href).searchParams;
  check(query.get('mode') === 'exam' && query.get('data') === expected.sourcePath.slice('archive/'.length) && query.get('studentReview') === '1', 'UI_ROLE_DIAGNOSTIC_PAGE');
  const digest = async text => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(byte => byte.toString(16).padStart(2, '0')).join('');
  const imagePath = element => {
    try { return decodeURIComponent(new URL(element.currentSrc || element.src, location.href).pathname); } catch { return ''; }
  };
  const allowedPaths = [expected.assetPath, '/' + expected.assetPath, '/exams/images/' + expected.assetPath.slice('archive/assets/images/'.length)];
  check(allowedPaths.includes(imagePath(image)), 'UI_ROLE_DIAGNOSTIC_TARGET_ASSET');
  check([...document.querySelectorAll('#print-area img')].filter(node => allowedPaths.includes(imagePath(node))).length === 1, 'UI_ROLE_DIAGNOSTIC_UNIQUE_TARGET');
  const numbers = [...box.querySelectorAll('.q-num')], contents = [...box.querySelectorAll('.q-content')];
  const ordinal = numbers.length === 1 ? Number((numbers[0].textContent.trim().match(/^(\d+)\./) || [])[1]) : null;
  check(ordinal === expected.ordinal, 'UI_ROLE_DIAGNOSTIC_ORDINAL');
  const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
  const state = element => {
    const css = getComputedStyle(element), r = rect(element);
    return { rect: r, displayNone: css.display === 'none', visibilityHidden: ['hidden', 'collapse'].includes(css.visibility), opacityZero: Number(css.opacity) === 0,
      visible: css.display !== 'none' && !['hidden', 'collapse'].includes(css.visibility) && Number(css.opacity) !== 0 && r.width > 0 && r.height > 0 };
  };
  const nodes = [...box.childNodes], media = [...box.querySelectorAll('img,svg,math,mjx-container')], bodyElements = [...document.querySelectorAll('body *')];
  check(nodes.length <= 128 && media.length <= 256 && bodyElements.length <= 30000 && box.outerHTML.length <= 2000000, 'UI_ROLE_DIAGNOSTIC_LIMIT');
  const initialDomSha256 = await digest(box.outerHTML), initialScroll = { x: scrollX, y: scrollY }, initialViewport = { width: innerWidth, height: innerHeight };
  const knownClasses = ['q-header', 'q-head', 'q-num', 'q-content', 'q-image', 'q-choices', 'choices', 'choice', 'q-space', 'answer-space', 'work-space', 'workspace'];
  const knownTags = ['DIV', 'SPAN', 'IMG', 'P', 'SECTION', 'TABLE', 'OL', 'UL', 'SVG', 'MATH', 'MJX-CONTAINER'];
  const directNodes = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (node.nodeType === Node.ELEMENT_NODE) {
      const classes = [...node.classList], unknownClasses = classes.filter(value => !knownClasses.includes(value)).sort();
      directNodes.push({ index, kind: 'ELEMENT', tag: knownTags.includes(node.tagName) ? node.tagName : 'OTHER', knownClasses: classes.filter(value => knownClasses.includes(value)).sort(),
        otherClassCount: unknownClasses.length, otherClassesSha256: unknownClasses.length ? await digest(JSON.stringify(unknownClasses)) : null,
        ...state(node), hasText: !!node.textContent.trim(), mediaCount: node.querySelectorAll('img,svg,math,mjx-container').length + Number(['IMG', 'SVG', 'MATH', 'MJX-CONTAINER'].includes(node.tagName)),
        numberCount: numbers.filter(value => node === value || node.contains(value)).length,
        contentCount: contents.filter(value => node === value || node.contains(value)).length,
        containsTargetImage: node === image || node.contains(image) });
    } else if (node.nodeType === Node.TEXT_NODE) {
      const hasText = !!node.textContent.trim(), range = document.createRange(); range.selectNodeContents(node);
      const r = range.getBoundingClientRect();
      directNodes.push({ index, kind: 'TEXT', hasText, rect: { x: r.x, y: r.y, width: r.width, height: r.height }, visible: hasText && r.width > 0 && r.height > 0 });
    } else directNodes.push({ index, kind: 'OTHER', visible: false });
  }
  const mediaNodes = media.map((node, index) => ({ index, kind: node.tagName.toUpperCase(), ...state(node),
    directNodeIndex: nodes.findIndex(child => child === node || (child.nodeType === Node.ELEMENT_NODE && child.contains(node))),
    insideContent: contents.some(content => content === node || content.contains(node)), isTargetImage: node === image,
    ...(node.tagName === 'IMG' ? { complete: node.complete, naturalWidth: node.naturalWidth, naturalHeight: node.naturalHeight } : {}) }));
  const obstructions = bodyElements.filter(node => !box.contains(node) && !node.contains(box) && ['fixed', 'sticky'].includes(getComputedStyle(node).position) && state(node).visible)
    .map(rect).filter(r => r.x < innerWidth && r.x + r.width > 0 && r.y < innerHeight && r.y + r.height > 0);
  check(obstructions.length <= 256, 'UI_ROLE_DIAGNOSTIC_LIMIT');
  const q = rect(box), visibleBounds = { left: Math.max(0, q.x), right: Math.min(innerWidth, q.x + q.width), top: Math.max(0, q.y), bottom: Math.min(innerHeight, q.y + q.height) };
  let hitTestSamples = 0, foreignContentHits = 0;
  if (visibleBounds.right > visibleBounds.left && visibleBounds.bottom > visibleBounds.top) {
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) {
      const top = document.elementFromPoint(visibleBounds.left + (x + 0.5) * (visibleBounds.right - visibleBounds.left) / 5,
        visibleBounds.top + (y + 0.5) * (visibleBounds.bottom - visibleBounds.top) / 5);
      hitTestSamples++; if (!top || (top !== box && !box.contains(top))) foreignContentHits++;
    }
  }
  const panel = document.getElementById('ap-archive-render-feedback');
  const finalDomSha256 = await digest(box.outerHTML);
  check(finalDomSha256 === initialDomSha256 && scrollX === initialScroll.x && scrollY === initialScroll.y && innerWidth === initialViewport.width && innerHeight === initialViewport.height,
    'UI_ROLE_DIAGNOSTIC_INPUT_CHANGED');
  return { schemaVersion: 'archive-problem-role-frame-v1', mode, solutionNodes, sourcePageMatched: true, targetAssetMatched: true,
    bankCount: AppState.data.length, questionNumber: ordinal, question: q, image: rect(image), viewport: initialViewport, scroll: initialScroll,
    readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
    feedbackIdle: !panel || panel.hidden || !state(panel).visible,
    numberCount: numbers.length, visibleNumberCount: numbers.filter(node => state(node).visible).length,
    contentCount: contents.length, visibleContentCount: contents.filter(node => state(node).visible).length,
    directNodeCount: directNodes.length, visibleDirectNodeCount: directNodes.filter(node => node.visible).length,
    directNodes, mediaNodes, obstructions, hitTestSamples, foreignContentHits,
    domSha256: initialDomSha256, inputUnchanged: true, cssWrites: 0, domWrites: 0, viewportChanges: 0, scrollOperations: 0 };
}


// Q5 alone uses the production equal-slot wrapper observed in run 43909557685.
// All rectangles below belong to actual unchanged DOM elements. The wrapper
// envelope stays in the clip; role descendants are never synthetic stand-ins.
const Q5_EQUAL_SLOT_SCHEMA = 'archive-m3-e052-q5-equal-slot-capture-v1';
const Q5_EQUAL_SLOT_SURFACE = [
  { path: 'archive/equal-slot-engine.js', gitBlobSha1: 'c826512ff61d4969c7ce45ba8f4ee002286bcf10',
    sha256: '4979ccfd129470e076965bf93bb86e089d53c4ea875a17b011760886f967177a', bytes: 20518 },
  { path: 'archive/exam-render-executor.js', gitBlobSha1: '583a72ae2c960d485cdcd1c1aec1329f204067b6',
    sha256: 'e4ac35518351fd89d16222df4221e64a32121213f5b99c831407a61d90b573d7', bytes: 24896 }
];
function checkedQ5EqualSlotScope(reader, item, viewport) {
  const refs = checkedQ5DiagnosticScope(reader, item, viewport);
  for (const expected of Q5_EQUAL_SLOT_SURFACE) {
    const ref = reader.ref(expected.path);
    assert.deepEqual(ref, { commit: reader.commit, ...expected }, 'UI_Q5_EQUAL_SLOT_SURFACE');
    refs.push(ref);
  }
  return refs;
}
async function measureQ5EqualSlotCapture(image) {
  const check = (value, code) => { if (!value) throw Error(code); };
  const box = image?.closest('.q-box'), area = document.querySelector('#print-area');
  check(typeof AppState !== 'undefined' && AppState.mode === 'exam' && AppState.data.length === 25,
    'UI_Q5_EQUAL_SLOT_BANK_MODE');
  check(image?.tagName === 'IMG' && box && area?.contains(box) && box.classList.contains('ap-equal-slot'),
    'UI_Q5_EQUAL_SLOT_BOX');
  const query = new URL(location.href).searchParams;
  check(query.get('mode') === 'exam' && query.get('studentReview') === '1' &&
    query.get('data') === 'exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js', 'UI_Q5_EQUAL_SLOT_PAGE');
  const assetPath = '/archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05-problem-source-v2.png';
  const allowedAssetPaths = [assetPath, '/exams/images/21_풍덕중_2학기_기말_중3_기출/q05-problem-source-v2.png'];
  const imagePath = node => { try { return decodeURIComponent(new URL(node.currentSrc || node.src, location.href).pathname); } catch { return ''; } };
  check(allowedAssetPaths.includes(imagePath(image)) && [...area.querySelectorAll('img')].filter(node => allowedAssetPaths.includes(imagePath(node))).length === 1,
    'UI_Q5_EQUAL_SLOT_ASSET');
  const rect = node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
  const visible = node => { const c = getComputedStyle(node), r = rect(node); return c.display !== 'none' &&
    !['hidden', 'collapse'].includes(c.visibility) && Number(c.opacity) !== 0 && r.width > 0 && r.height > 0; };
  const elements = node => {
    check([...node.childNodes].every(child => child.nodeType === Node.ELEMENT_NODE ||
      child.nodeType === Node.TEXT_NODE && !child.textContent.trim()), 'UI_Q5_EQUAL_SLOT_UNSAFE_NODE');
    return [...node.children];
  };
  const outer = elements(box);
  check(outer.length === 1 && outer[0].tagName === 'DIV' && outer[0].className === 'ap-slot-content', 'UI_Q5_EQUAL_SLOT_WRAPPER');
  const wrapper = outer[0], roles = elements(wrapper);
  check(roles.length === 4 && roles.every(node => node.tagName === 'DIV'), 'UI_Q5_EQUAL_SLOT_FOUR_ROLES');
  const [number, content, imageWrap, choices] = roles;
  check(number.className === 'q-num' && number.textContent.trim() === '5.' &&
    box.querySelectorAll('.q-num').length === 1, 'UI_Q5_EQUAL_SLOT_NUMBER');
  check(content.className === 'q-content' && content.textContent.trim().length > 0 &&
    box.querySelectorAll('.q-content').length === 1, 'UI_Q5_EQUAL_SLOT_CONTENT');
  check(imageWrap.classList.contains('q-image-wrap') && elements(imageWrap).length === 1 && imageWrap.children[0] === image,
    'UI_Q5_EQUAL_SLOT_IMAGE_ROLE');
  check(choices.classList.contains('choices') && box.querySelectorAll('.choices').length === 1, 'UI_Q5_EQUAL_SLOT_CHOICES');
  const choiceItems = elements(choices), labels = ['①', '②', '③', '④', '⑤'];
  check(choiceItems.length === 5, 'UI_Q5_EQUAL_SLOT_CHOICE_COUNT');
  const choiceParts = [];
  for (let i = 0; i < choiceItems.length; i++) {
    const item = choiceItems[i], parts = elements(item);
    check(item.tagName === 'DIV' && item.className === 'choice-item' && parts.length === 2 &&
      parts[0].tagName === 'SPAN' && parts[0].className === 'choice-no' && parts[0].textContent.trim() === labels[i] &&
      parts[1].tagName === 'SPAN' && parts[1].className === 'choice-text' && parts[1].textContent.trim().length > 0,
      'UI_Q5_EQUAL_SLOT_CHOICE_ROLE');
    choiceParts.push(...parts);
  }
  const media = [...box.querySelectorAll('img,svg,math,mjx-container')];
  check(media.length === 11 && media.filter(node => node.tagName === 'IMG').length === 1 &&
    media.every(node => node === image || node.tagName === 'MJX-CONTAINER' && (content.contains(node) || choices.contains(node))),
    'UI_Q5_EQUAL_SLOT_MEDIA');
  check(content.querySelectorAll('mjx-container').length === 5 && choices.querySelectorAll('mjx-container').length === 5,
    'UI_Q5_EQUAL_SLOT_MATH_COUNTS');
  check(image.complete && image.naturalWidth === 550 && image.naturalHeight === 330, 'UI_Q5_EQUAL_SLOT_IMAGE_READY');
  const mandatory = [box, wrapper, ...roles, ...choiceItems, ...choiceParts, ...media];
  check(mandatory.every(visible), 'UI_Q5_EQUAL_SLOT_HIDDEN_ROLE');
  const containsRect = (outer, inner) => inner.x >= outer.x - 1 && inner.y >= outer.y - 1 &&
    inner.x + inner.width <= outer.x + outer.width + 1 && inner.y + inner.height <= outer.y + outer.height + 1;
  const boxRect = rect(box), wrapperRect = rect(wrapper);
  check(mandatory.slice(1).every(node => containsRect(boxRect, rect(node))) &&
    mandatory.slice(2).every(node => containsRect(wrapperRect, rect(node))), 'UI_Q5_EQUAL_SLOT_CLIPPED_ROLE');
  const obstructions = [...document.querySelectorAll('body *')].filter(node => !box.contains(node) && !node.contains(box) &&
    ['fixed', 'sticky'].includes(getComputedStyle(node).position) && visible(node)).map(rect)
    .filter(r => r.x < innerWidth && r.x + r.width > 0 && r.y < innerHeight && r.y + r.height > 0);
  const panel = document.getElementById('ap-archive-render-feedback');
  const solutionNodes = document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(box.outerHTML));
  return { question: boxRect, children: [wrapper, ...roles].map(rect), image: rect(image),
    viewport: { width: innerWidth, height: innerHeight }, scroll: { x: scrollX, y: scrollY }, obstructions,
    feedbackIdle: !panel || panel.hidden || !visible(panel), readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
    solutionNodes, questionNumber: '5.', mandatoryChildrenVisible: true,
    domSha256: [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join(''),
    equalSlotRoles: { schemaVersion: 'archive-m3-e052-q5-equal-slot-capture-v1', sourceOrdinal: 5, bankCount: 25,
      actualDirectChildren: 1, wrapperClass: 'ap-slot-content', roleOrder: ['q-num', 'q-content', 'q-image-wrap', 'choices'],
      roleDescendants: 4, choiceItems: 5, targetImages: 1, contentMath: 5, choiceMath: 5, hiddenRoles: 0,
      unknownDirectNodes: 0, foreignMedia: 0, completeWrapperEnvelope: true } };
}
const Q5_EQUAL_SLOT_ROLES = { schemaVersion: Q5_EQUAL_SLOT_SCHEMA, sourceOrdinal: 5, bankCount: 25,
  actualDirectChildren: 1, wrapperClass: 'ap-slot-content', roleOrder: ['q-num', 'q-content', 'q-image-wrap', 'choices'],
  roleDescendants: 4, choiceItems: 5, targetImages: 1, contentMath: 5, choiceMath: 5, hiddenRoles: 0,
  unknownDirectNodes: 0, foreignMedia: 0, completeWrapperEnvelope: true };
function checkedQ5EqualSlotFrame(frame, viewport) {
  assert.deepEqual(frame.equalSlotRoles, Q5_EQUAL_SLOT_ROLES, 'UI_Q5_EQUAL_SLOT_ROLE_PROOF');
  assert.deepEqual(frame.viewport, { width: viewport.width, height: viewport.height }, 'UI_Q5_EQUAL_SLOT_VIEWPORT');
  assert(frame.children.length === 5 && frame.questionNumber === '5.' && frame.mandatoryChildrenVisible === true &&
    frame.solutionNodes === 0 && frame.readiness === 'RENDER_READY' && SHA256.test(frame.domSha256), 'UI_Q5_EQUAL_SLOT_FRAME');
  const wrapper = frame.children[0];
  assert(frame.children.slice(1).every(r => r.x >= wrapper.x - 1 && r.y >= wrapper.y - 1 &&
    r.x + r.width <= wrapper.x + wrapper.width + 1 && r.y + r.height <= wrapper.y + wrapper.height + 1), 'UI_Q5_EQUAL_SLOT_ROLE_ENVELOPE');
  H.problemContentClip(frame);
  return frame;
}
function q5DocumentProblemFrame(frame) {
  assert(frame.scroll && Number.isFinite(frame.scroll.x) && Number.isFinite(frame.scroll.y), 'UI_CAPTURE_SCROLL');
  const documentRect = rect => ({ x: rect.x + frame.scroll.x, y: rect.y + frame.scroll.y, width: rect.width, height: rect.height });
  return { question: documentRect(frame.question), content: documentRect(H.problemContentClip(frame)),
    children: frame.children.map(documentRect), image: documentRect(frame.image), viewport: frame.viewport,
    questionNumber: frame.questionNumber, equalSlotRoles: frame.equalSlotRoles };
}
function inspectQ5CaptureHits(image, clip) {
  const box = image.closest('.q-box'); let samples = 0, outsideQuestion = 0;
  const xs = [clip.x + 1.5], ys = [clip.y + 1.5];
  for (let x = clip.x + 17.5; x < clip.x + clip.width - 1.5; x += 16) xs.push(x);
  for (let y = clip.y + 17.5; y < clip.y + clip.height - 1.5; y += 16) ys.push(y);
  xs.push(clip.x + clip.width - 1.5); ys.push(clip.y + clip.height - 1.5);
  for (const x of xs) for (const y of ys) {
    samples++; const top = document.elementFromPoint(x, y);
    if (!top || (top !== box && !box.contains(top))) outsideQuestion++;
  }
  return { samples, outsideQuestion };
}
async function captureQ5EqualSlotProblem({ page, target, filename, reader, item, viewport }) {
  const evidence = checkedQ5EqualSlotScope(reader, item, viewport);
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  const measure = async () => checkedQ5EqualSlotFrame(await target.evaluate(measureQ5EqualSlotCapture), viewport);
  let frame = await measure();
  const original = q5DocumentProblemFrame(frame), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = H.planProblemTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = H.planProblemTileScroll(frame, tile);
      if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await measure();
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(q5DocumentProblemFrame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = H.assertProblemTileCapture(frame, tile), hits = await target.evaluate(inspectQ5CaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = filename.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await measure();
    assert.deepEqual(H.assertProblemTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(q5DocumentProblemFrame(after), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const afterHits = await target.evaluate(inspectQ5CaptureHits, clip);
    assert(afterHits.samples > 0 && afterHits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    tiles.push({ ...tile, filename: path.basename(tileFile), clip, scroll: after.scroll, scrollOperations,
      feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: hits.samples + afterHits.samples,
      foreignContentHits: 0, domSha256: originalDomSha256 });
    frame = after;
  }
  for (const ref of evidence) assert.deepEqual(reader.ref(ref.path), ref, 'UI_Q5_EQUAL_SLOT_INPUT_CHANGED');
  return { schemaVersion: H.TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: H.TILE_LIMIT,
    overlapCssPixels: H.TILE_OVERLAP, tileCount: tiles.length, content: original.content, question: original.question,
    viewport: original.viewport, visibleChildren: 1, visibleRoleDescendants: 4, measuredEnvelopeRects: 5,
    equalSlotRoles: original.equalSlotRoles, equalSlotEvidence: evidence,
    coverage: H.assertTileCoverage(original.content.height, tiles), tiles, scrollBefore, scrollAfter: frame.scroll,
    scrollOperations: tiles.reduce((sum, row) => sum + row.scrollOperations, 0), domSha256: originalDomSha256,
    feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0, compositeImageCreated: false };
}

// Diagnostic only. Every capture failure remains the same thrown failure.
const Q5_CHILD_FAILURE = 'UI_COMPLETE_PROBLEM_CHILDREN';
const Q5_DIAGNOSTIC_ITEM_SHA256 = 'c8435288e0ab156661f686299fa1a91947490e3da347476f01585ca1a600c7ae';
function checkedQ5DiagnosticScope(reader, item, viewport) {
  const fields = ['key','questionUid','sourceOrdinal','expectedBankCount','imageBinding','problemPayloadSha256','problemFieldsSha256',
    'presentationSha256','choicePresentationSha256','expectedImageWidth','expectedImageHeight'];
  ownKeys(item, [...fields, 'sourceRef', 'assetRef'], 'UI_Q5_DIAGNOSTIC_ITEM');
  assert.equal(sha256(stable(Object.fromEntries(fields.map(key => [key, item[key]])))), Q5_DIAGNOSTIC_ITEM_SHA256, 'UI_Q5_DIAGNOSTIC_SCOPE');
  assert(VIEWPORTS.some(v => stable(v) === stable(viewport)), 'UI_Q5_DIAGNOSTIC_VIEWPORT');
  assert(SHA1.test(reader.commit || ''), 'UI_Q5_DIAGNOSTIC_COMMIT');
  for (const ref of [item.sourceRef, item.assetRef]) {
    ownKeys(ref, ['commit','path','gitBlobSha1','sha256','bytes'], 'UI_Q5_DIAGNOSTIC_REF');
    assert.equal(ref.commit, reader.commit, 'UI_Q5_DIAGNOSTIC_COMMIT');
    assert.deepEqual(reader.ref(ref.path), ref, 'UI_Q5_DIAGNOSTIC_LIVE_REF');
  }
  const source = EXPECTED_SOURCE_BINDINGS[0];
  assert.deepEqual(item.sourceRef, { commit: reader.commit, path: source.sourcePath, gitBlobSha1: source.gitBlobSha1,
    sha256: source.sha256, bytes: source.bytes }, 'UI_Q5_DIAGNOSTIC_SOURCE');
  assert.deepEqual(item.assetRef, { commit: reader.commit,
    path: 'archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05-problem-source-v2.png',
    gitBlobSha1: '716c4228fd5e2ab0ad995eae9b498f8b57a8eb88',
    sha256: 'e09a9ffa670e31766c57c4687e88a8d44fb773e0ca265cc4d1ad06e40a79ad6f', bytes: 57270 }, 'UI_Q5_DIAGNOSTIC_ASSET');
  const evidence = [item.sourceRef, item.assetRef, reader.ref(MANIFEST_PATH), reader.ref(CHECKER_PATH), reader.ref(SHARED_CHECKER_PATH)];
  assert.equal(evidence[4].sha256, SHARED_CHECKER_SHA256, 'UI_Q5_DIAGNOSTIC_CAPTURE_HELPER');
  return evidence;
}
async function readQ5RoleDiagnostic({ reader, item, viewport, target }) {
  const evidence = checkedQ5DiagnosticScope(reader, item, viewport);
  let timer;
  const frame = await Promise.race([
    target.evaluate(measureProblemRoles, { ordinal: item.sourceOrdinal, bankCount: item.expectedBankCount,
      width: viewport.width, height: viewport.height, sourcePath: item.sourceRef.path, assetPath: item.assetRef.path }),
    new Promise((_resolve, reject) => { timer = setTimeout(() => reject(new Error('UI_Q5_DIAGNOSTIC_TIMEOUT')), 15000); })
  ]).finally(() => clearTimeout(timer));
  assert(frame && frame.schemaVersion === 'archive-problem-role-frame-v1' && frame.mode === 'exam' && frame.solutionNodes === 0 &&
    frame.bankCount === 25 && frame.questionNumber === 5 && frame.sourcePageMatched === true && frame.targetAssetMatched === true &&
    frame.inputUnchanged === true && frame.cssWrites === 0 && frame.domWrites === 0 && frame.viewportChanges === 0 && frame.scrollOperations === 0 &&
    frame.viewport.width === viewport.width && frame.viewport.height === viewport.height && SHA256.test(frame.domSha256), 'UI_Q5_DIAGNOSTIC_FRAME');
  for (const ref of evidence) assert.deepEqual(reader.ref(ref.path), ref, 'UI_Q5_DIAGNOSTIC_INPUT_CHANGED');
  return { schemaVersion: 'archive-m3-e052-q5-problem-role-diagnostic-v1', status: 'DIAGNOSTIC_ONLY_ORIGINAL_CAPTURE_FAILURE',
    originalFailureCode: Q5_CHILD_FAILURE, checkoutCommit: reader.commit, key: item.key, questionUid: item.questionUid,
    sourceOrdinal: item.sourceOrdinal, viewport, evidence, frame, frameSha256: sha256(stable(frame)),
    captureAccepted: false, screenshotCreated: false, solutionsOpened: false, sourceWrites: 0, newNativeApprovals: 0 };
}
async function captureQ5WithFailureDiagnostic({ page, target, filename, reader, item, viewport, diagnostics,
  capture, diagnose = readQ5RoleDiagnostic }) {
  try { return await (capture ? capture(page, target, filename) : captureQ5EqualSlotProblem({ page, target, filename, reader, item, viewport })); }
  catch (originalError) {
    if (String(originalError?.message || '').split('\n')[0] === Q5_CHILD_FAILURE) {
      try { diagnostics.push(await diagnose({ reader, item, viewport, target })); }
      catch (diagnosticError) { diagnostics.push({ schemaVersion: 'archive-m3-e052-q5-problem-role-diagnostic-v1',
        status: 'DIAGNOSTIC_UNAVAILABLE_ORIGINAL_CAPTURE_FAILURE', originalFailureCode: Q5_CHILD_FAILURE,
        diagnosticErrorSha256: sha256(String(diagnosticError?.message || '')), captureAccepted: false,
        screenshotCreated: false, solutionsOpened: false, sourceWrites: 0, newNativeApprovals: 0 }); }
    }
    throw originalError;
  }
}

// The bounded browser driver below is copied from the independently checked
// Q22 problem-only driver; only the closed cohort names and bank counts differ.
const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath, githubEventCommit = null }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  assert(SHA1.test(expectedCommit), 'UI_Q5_EXPECTED_CHECKOUT_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const captureHelperRef = reader.ref(SHARED_CHECKER_PATH);
  assert.equal(captureHelperRef.sha256, SHARED_CHECKER_SHA256, 'UI_Q5_CAPTURE_HELPER_CHANGED');
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [];
  const diagnosticFrames = [];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef, ...inputs,
    checkout: { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: reader.commit, githubEventCommit },
    newParentApprovals: 0, newNativeApprovals: 0, releaseGate: 'PENDING_INDEPENDENT_VISUAL_REVIEW',
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertCompletedResults(results, inputs, manifest, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, ...(diagnosticFrames.length ? { diagnosticFrames } : {}), servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
      studentFontResources: [...studentFontResources.values()], externalFontResources: [], failures };
    fs.writeFileSync(path.join(out, 'technical-proof.json'), JSON.stringify(proof, null, 2) + '\n');
    return proof;
  };
  let browser;
  const server = http.createServer((request, response) => {
    try {
      const rel = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\//, '');
      if (rel === 'favicon.ico') { response.writeHead(204); response.end(); return; }
      // The engine also loads its tracked ../apmath navigation resources.
      // read() requires an exact regular file in this immutable checkout tree;
      // it cannot expose an untracked file, symlink, traversal or Git internals.
      const bytes = reader.read(rel);
      served.set(rel, reader.ref(rel, bytes));
      response.writeHead(200, { 'Content-Type': mime(rel), 'Cache-Control': 'no-store' });
      response.end(bytes);
    } catch {
      failures.push({ code: 'UI_STATIC_FILE_UNAVAILABLE', requestSha256: sha256(request.url || '') });
      response.writeHead(404); response.end();
    }
  });
  const watchdog = setTimeout(() => { writeProof('FAIL', 'UI_TOTAL_TIMEOUT'); process.exit(1); }, 240000);
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const { chromium } = require('playwright');
    browser = await chromium.launch({ executablePath, headless: true, timeout: 30000 });
    proofBase.browserVersion = browser.version();
    const banks = [...new Set(manifest.items.map(item => item.sourcePath))];
    for (const viewport of manifest.viewports) for (const sourcePath of banks) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1,
        isMobile: viewport.name === 'mobile', hasTouch: viewport.name === 'mobile', serviceWorkers: 'block' });
      let page, casesCompleted = false, caseFailure = null;
      const pageErrors = [], requestFailures = [], externalRequests = [];
      const fontState = { declaredFonts: new Set(), fontRefs, fontWeights, studentFontResources, fontResources: new Map(), failures };
      const routeLifecycle = H.createStudentRouteLifecycle(failures);
      try {
        page = await context.newPage();
        page.setDefaultTimeout(10000);
        page.on('pageerror', error => pageErrors.push({ messageSha256: sha256(error.message) }));
        page.on('requestfailed', request => requestFailures.push({ urlSha256: sha256(request.url()), errorSha256: sha256(request.failure()?.errorText || '') }));
        await page.route('**/*', routeLifecycle.wrap(async route => {
          const url = new URL(route.request().url());
          const fontPath = studentFontResourcePath(url.href, origin, fontRefs);
          if (fontPath) return H.serveStudentFont(route, url, fontPath, fontState);
          if (url.origin === origin) {
            if (url.pathname.startsWith('/' + FONT_DIR)) {
              failures.push({ code: 'UI_FONT_NOT_DECLARED', requestSha256: sha256(url.href) });
              return route.abort('blockedbyclient');
            }
            return route.continue();
          }
          if (url.protocol === 'https:' && url.hostname === 'img.wangjiedu.com' && url.pathname.startsWith('/exams/images/')) {
            try {
              const rel = 'archive/assets/images/' + decodeURIComponent(url.pathname.slice('/exams/images/'.length));
              const bytes = reader.read(rel);
              mirrored.set(rel, reader.ref(rel, bytes));
              return route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' }, contentType: mime(rel), body: bytes });
            } catch { failures.push({ code: 'UI_MIRRORED_ASSET_UNAVAILABLE', requestSha256: sha256(route.request().url()) }); }
          }
          externalRequests.push({ host: url.hostname, urlSha256: sha256(url.href) });
          return route.abort('blockedbyclient');
        }));
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=exam&fit=screen&studentReview=1&figureZoom=0`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForFunction(() => {
          const readiness = JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}');
          return readiness.state === 'RENDER_READY' && typeof AppState !== 'undefined' && AppState.mode === 'exam' && AppState.data.length > 0;
        }, null, { timeout: 40000 });
        const fontReadiness = await page.evaluate(async family => {
          await document.fonts.ready;
          const weights = [];
          for (const weight of [400, 700, 800]) {
            const faces = await document.fonts.load(`${weight} 12px "${family}"`, '한글 ABC 123');
            weights.push({ weight, loadedFaces: faces.length, allLoaded: faces.length > 0 && faces.every(face =>
              face.status === 'loaded' && face.family.replace(/["']/g, '') === family && face.weight === String(weight) && face.style === 'normal'), checked: document.fonts.check(`${weight} 12px "${family}"`, '한글 ABC 123') });
          }
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { status: document.fonts.status, family, weights,
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content')].map(node => getComputedStyle(node).fontFamily))] };
        }, FONT_FAMILY);
        assert.equal(fontReadiness.status, 'loaded', 'UI_DOCUMENT_FONTS_READY');
        assert(fontReadiness.weights.every(row => row.allLoaded && row.checked), 'UI_STUDENT_FONT_NOT_LOADED');
        assert(fontReadiness.problemFontFamilies.length > 0 && fontReadiness.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_STUDENT_FONT_NOT_APPLIED');
        await routeLifecycle.drain();
        routeLifecycle.assertSettled();
        const respondingWeights = [...fontState.fontResources.keys()].map(file => fontWeights.get(file));
        assert(fontState.fontResources.has(FONT_STYLESHEET) && fontReadiness.weights.every(row =>
          respondingWeights.filter(weight => weight === row.weight).length >= row.loadedFaces),
          'UI_FONT_RESPONSES_REQUIRED');
        await page.waitForFunction(() => JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state === 'RENDER_READY', null, { timeout: 30000 });
        const technical = await page.evaluate(() => ({
          mode: AppState.mode, questions: AppState.data.length, pages: document.querySelectorAll('#print-area .page').length,
          readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
          imagesComplete: [...document.querySelectorAll('#print-area img')].every(image => image.complete && image.naturalWidth > 0),
          mathErrors: document.querySelectorAll('#print-area mjx-merror,#print-area [data-mjx-error]').length,
          unrenderedMath: window.APRenderLoop?.unrenderedMathCount(document.querySelector('#print-area')),
          mathJaxSource: window.__AP_MATHJAX_SOURCE__,
          solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length
        }));
        assertTechnicalState(technical, inputs.items.find(item => item.sourceRef.path === sourcePath).expectedBankCount);
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const capture = await captureQ5WithFailureDiagnostic({ page, target, filename: path.join(out, screenshotPath),
            reader, item, viewport, diagnostics: diagnosticFrames });
          const geometry = await target.evaluate(image => {
            const box = image.closest('.q-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth === item.expectedImageWidth && geometry.naturalHeight === item.expectedImageHeight && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber || '').match(/^\d+/)?.[0]), item.sourceOrdinal, 'UI_VISIBLE_ORDINAL');
          const screenshots = capture.tiles.map(tile => { const bytes = fs.readFileSync(path.join(out, tile.filename));
            return { tileIndex: tile.tileIndex, path: tile.filename, sha256: sha256(bytes), bytes: bytes.length }; });
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
            sourceRef: item.sourceRef, assetRef: item.assetRef, screenshots,
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontState.fontResources.values()].sort() }, geometry, capture,
            visualReview: 'PENDING', pageErrors, requestFailures, externalRequests });
          activeCase = null;
        }
        casesCompleted = true;
      } catch (error) {
        caseFailure = error;
        throw error;
      } finally {
        await H.closeStudentContext(page, context, () => {
          if (casesCompleted) assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
        }, routeLifecycle, caseFailure);
      }
    }
    assertCompletedResults(results, inputs, manifest, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, inputs.identityRef, ...inputs.surfaceRefs, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
      assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
    }
    return writeProof('TECHNICAL_PASS_VISUAL_REVIEW_PENDING');
  } catch (error) {
    writeProof('FAIL', /^UI_[A-Z0-9_]+$/.test(error.message) ? error.message : 'UI_BROWSER_CHECK_FAILED');
    throw error;
  } finally {
    clearTimeout(watchdog);
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}


async function main() {
  const args = process.argv.slice(2);
  assert(args.length === 2 && args[0] === '--output' && typeof args[1] === 'string' &&
    path.isAbsolute(args[1]) && !/[\x00-\x1f\x7f]/.test(args[1]), 'UI_Q5_ARGUMENTS');
  const root = process.cwd(), out = checkedOutput(root, args[1]);
  const reader = createGitReader(root), checkout = checkoutEvidence(reader.commit);
  const proof = await inspectStudentUi({ root, out, expectedCommit: checkout.expectedCheckoutCommit,
    githubEventCommit: checkout.githubEventCommit, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, logicalCases: proof.results.length,
    screenshotArtifacts: proof.screenshotArtifactCount, checkoutCommit: proof.checkoutCommit,
    newParentApprovals: 0, releaseGate: proof.releaseGate }));
}
module.exports = { MANIFEST_PATH, CHECKER_PATH, SHARED_CHECKER_PATH, SHARED_CHECKER_SHA256, IDENTITY_PATH, SCHEMA,
  EXPECTED_ITEMS_SHA256, EXPECTED_SOURCE_BINDINGS, EXPECTED_SURFACE_REFS, checkedSurface, VIEWPORTS, DRAFT, SEALED, ownSnapshot, validateManifest, requireSealedManifest, checkoutEvidence, loadQuestions, assertBoundQuestion, preflight, assertTechnicalState, assertCompletedResults, checkedOutput, checkedQ5DiagnosticScope, readQ5RoleDiagnostic, captureQ5WithFailureDiagnostic, measureProblemRoles, Q5_EQUAL_SLOT_SCHEMA, Q5_EQUAL_SLOT_SURFACE, Q5_EQUAL_SLOT_ROLES, checkedQ5EqualSlotScope, measureQ5EqualSlotCapture, checkedQ5EqualSlotFrame, q5DocumentProblemFrame, inspectQ5CaptureHits, captureQ5EqualSlotProblem };
if (require.main === module) main().catch(error => {
  const message = String(error?.message || ''), code = message.split('\n')[0];
  console.error(JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL', newParentApprovals: 0,
    releaseGate: 'PENDING_ACTUAL_STUDENT_UI', failureCode: /^UI_[A-Z0-9_]+$/.test(code) ? code : 'UI_Q5_PREFLIGHT_FAILED',
    errorMessageSha256: sha256(message) }));
  process.exitCode = 1;
});
