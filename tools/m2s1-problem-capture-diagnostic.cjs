'use strict';

// Diagnostic only: the common capture failure remains a failure. This module
// neither accepts a two-child layout nor opens a solution surface.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createGitReader } = require('./check-reviewed-problem-renderer-browser.cjs');
const SELF_PATH = 'tools/m2s1-problem-capture-diagnostic.cjs';
const SCHEMA = 'archive-m2s1-problem-role-diagnostic-v1';
const FAILURE_CODE = 'UI_COMPLETE_PROBLEM_CHILDREN';
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const freeze = object => { for (const value of Object.values(object)) if (value && typeof value === 'object') freeze(value); return Object.freeze(object); };
const EXPECTED = freeze({
  key: 'E009-Q17',
  questionUid: 'qid_v1_b31a67c9954946ec253d475f53ca1674fe691087548f3e36d8b024108b8edc14',
  sourceOrdinal: 17, expectedBankCount: 23,
  questionSha256: '6e19383274ef433565d527fbd59b3db69ebe17eff82388acd9eefee796faf82d',
  surfacePayloadSha256: '9ebfe24f39de6b74d3a7933078148ddfe194a8a2e374e8997223da891cdf3517',
  viewport: { name: 'mobile', width: 390, height: 844 },
  manifest: { path: 'tests/fixtures/archive-m2s1-current-problem-display-ui.json', gitBlobSha1: '5a78f23961292e13c061b4979feb3c4b54f3426f', sha256: '3b445bd5f807948e56685276d455eb71904385ad837529e13b3267126686d342', bytes: 18095 },
  captureHelper: { path: 'tools/check-reviewed-problem-renderer-browser.cjs', gitBlobSha1: 'dcb4382ada6913f9aa35a820777248ee93879e36', sha256: '94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4', bytes: 50028 },
  source: { path: 'archive/exams/original/middle/m2/1final/25_연향중_1학기_기말_중2_기출.js', gitBlobSha1: 'a5addb0951dcd0892cde2e21e3bc23b080c9a5bc', sha256: '10aee6984c88c649e6df3571d9c16bccd812076643b98a75270c1a67d1692737', bytes: 69826 },
  asset: { path: 'archive/assets/images/25_연향중_1학기_기말_중2_기출/q17-problem-visual-v2.svg', gitBlobSha1: '8202b078ae3402f029dfdf47b61ee01b8953fcc4', sha256: '2b2fa52d85f3f0b160d7f43c35440ed7a5b1fb03296860c50031f2ada3601700', bytes: 8252 },
  previousFailure: { runId: 43796344105, checkoutCommit: '7f0e8fd714dda6810e102567315d2067062bc512', technicalSha256: '3c1b711250a17932f9eb4d4be78f156b21a3474c0a63f0cb4155bbc5e6dc4f0f' }
});

function checkedRef(ref, expected, commit) {
  assert(ref && Object.keys(ref).sort().join(',') === 'bytes,commit,gitBlobSha1,path,sha256', 'UI_ROLE_DIAGNOSTIC_REF');
  assert.equal(ref.commit, commit, 'UI_ROLE_DIAGNOSTIC_COMMIT');
  assert.deepEqual({ path: ref.path, gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes }, expected, 'UI_ROLE_DIAGNOSTIC_INPUT_DRIFT');
  return ref;
}

function checkedDiagnosticScope({ checkoutCommit, item, viewport, surface, mode, failureCode, manifestRef, captureHelperRef }) {
  assert(SHA1.test(checkoutCommit || ''), 'UI_ROLE_DIAGNOSTIC_COMMIT');
  assert.equal(failureCode, FAILURE_CODE, 'UI_ROLE_DIAGNOSTIC_FAILURE_SCOPE');
  assert(surface === 'PROBLEM' && mode === 'exam', 'UI_ROLE_DIAGNOSTIC_SURFACE');
  assert.deepEqual(viewport, EXPECTED.viewport, 'UI_ROLE_DIAGNOSTIC_VIEWPORT');
  assert(item && typeof item === 'object', 'UI_ROLE_DIAGNOSTIC_ITEM');
  for (const field of ['key', 'questionUid', 'sourceOrdinal', 'expectedBankCount', 'questionSha256', 'surfacePayloadSha256'])
    assert.equal(item[field], EXPECTED[field], 'UI_ROLE_DIAGNOSTIC_COHORT');
  checkedRef(item.sourceRef, EXPECTED.source, checkoutCommit);
  assert(Array.isArray(item.assetRefs) && item.assetRefs.length === 1, 'UI_ROLE_DIAGNOSTIC_ASSETS');
  checkedRef(item.assetRefs[0], EXPECTED.asset, checkoutCommit);
  checkedRef(manifestRef, EXPECTED.manifest, checkoutCommit);
  checkedRef(captureHelperRef, EXPECTED.captureHelper, checkoutCommit);
  return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: { ...viewport }, surface, mode,
    sourceRef: { ...item.sourceRef }, assetRefs: item.assetRefs.map(ref => ({ ...ref })), manifestRef: { ...manifestRef }, captureHelperRef: { ...captureHelperRef } };
}

// Passed directly to locator.evaluate. Only this problem's DOM is inspected;
// no text, HTML, attribute values, URLs or unknown class names leave the page.
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

async function diagnoseProblemCaptureFailure({ root, expectedCommit, item, viewport, surface, mode, failureCode, target }) {
  const reader = createGitReader(root, expectedCommit);
  const manifestRef = reader.ref(EXPECTED.manifest.path), captureHelperRef = reader.ref(EXPECTED.captureHelper.path);
  const scope = checkedDiagnosticScope({ checkoutCommit: reader.commit, item, viewport, surface, mode, failureCode, manifestRef, captureHelperRef });
  const sourceRef = reader.ref(EXPECTED.source.path), assetRef = reader.ref(EXPECTED.asset.path), helperRef = reader.ref(SELF_PATH);
  checkedRef(sourceRef, EXPECTED.source, reader.commit); checkedRef(assetRef, EXPECTED.asset, reader.commit);
  assert(helperRef.commit === reader.commit && helperRef.path === SELF_PATH && SHA1.test(helperRef.gitBlobSha1) && SHA256.test(helperRef.sha256), 'UI_ROLE_DIAGNOSTIC_HELPER');
  let timer;
  const frame = await Promise.race([
    target.evaluate(measureProblemRoles, { ordinal: EXPECTED.sourceOrdinal, bankCount: EXPECTED.expectedBankCount, width: viewport.width, height: viewport.height,
      sourcePath: EXPECTED.source.path, assetPath: EXPECTED.asset.path }),
    new Promise((_resolve, reject) => { timer = setTimeout(() => reject(new Error('UI_ROLE_DIAGNOSTIC_TIMEOUT')), 15000); })
  ]).finally(() => clearTimeout(timer));
  assert(frame && frame.schemaVersion === 'archive-problem-role-frame-v1' && frame.mode === 'exam' && frame.solutionNodes === 0 && frame.inputUnchanged === true,
    'UI_ROLE_DIAGNOSTIC_FRAME');
  for (const ref of [manifestRef, captureHelperRef, sourceRef, assetRef, helperRef]) assert.deepEqual(reader.ref(ref.path), ref, 'UI_ROLE_DIAGNOSTIC_INPUT_CHANGED');
  return { schemaVersion: SCHEMA, status: 'DIAGNOSTIC_ONLY_ORIGINAL_CAPTURE_FAILURE', failureCode, checkoutCommit: reader.commit,
    previousFailure: EXPECTED.previousFailure, ...scope, helperRef, frame, frameSha256: sha256(stable(frame)),
    captureAccepted: false, screenshotCreated: false, problemOnly: true, solutionsOpened: false,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newFourSlotApprovals: 0 };
}

module.exports = { SELF_PATH, SCHEMA, FAILURE_CODE, EXPECTED, checkedDiagnosticScope, measureProblemRoles, diagnoseProblemCaptureFailure };
