'use strict';

// Closed SVG7 problem transport: the original two zero-choice cases and one
// exact E045 Q15 whose five choices are already embedded in its problem image.
// All other items retain the unchanged shared capture.
const assert = require('node:assert/strict');
const path = require('node:path');
const shared = require('./check-reviewed-problem-renderer-browser.cjs');
const SELF_PATH = 'tools/m2s1-svg7-problem-capture.cjs';
const MANIFEST_PATH = 'tests/fixtures/archive-m2s1-svg7-problem-ui.json';
const MANIFEST_SHA256 = 'd13bd86db38720754b4ad529209be63c29362a3bf5b04003dbfd88ef883e372b';
const COMMON_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const COMMON_SHA256 = 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const EMPTY_CLASS_SHA256 = 'eecddef10cc4a80d3bd980d8a114244d6c2c6422131f2d0492d4428a94ab7674';
const TWO_ROLE_KEYS = Object.freeze(['E045-Q24', 'E048-Q24']);
const EMBEDDED_CHOICE_KEY = 'E045-Q15';
const EMBEDDED_CHOICE_BINDING_SHA256 = '9f6108faf898cac852032c2e14268dcc84017a2beda1a1ea2cebd9319ee7243b';
function assertEmbeddedChoiceRow(row) {
  assert(row?.key === EMBEDDED_CHOICE_KEY && row.questionUid === 'qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569' &&
    row.sourceOrdinal === 15 && row.expectedBankCount === 24 && row.choiceCount === 5 &&
    row.sourcePath === 'archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js' &&
    row.questionSha256 === '2db11d3dcd68f9aaf35c5d68e69d30f2e550ed3b42b956797fc81b41a62365fb' &&
    row.embeddedChoiceBinding && shared.sha256(shared.stable(row.embeddedChoiceBinding)) === EMBEDDED_CHOICE_BINDING_SHA256,
    'UI_SVG7_EXACT_EMBEDDED_CHOICE_CASE');
  return row.embeddedChoiceBinding;
}
function assertEmbeddedChoiceFrame(row, frame) {
  const binding = assertEmbeddedChoiceRow(row), c = frame?.choiceState;
  assert(c && c.choiceCount === 5 && c.allChoicesNonemptyStrings === true && c.ownEmbeddedFlag === true && c.embeddedFlagValue === true &&
    c.nestedEmbeddedFlag === false && c.choicesSha256 === binding.choicesSha256,
    'UI_SVG7_EMBEDDED_CHOICE_SOURCE_STATE');
  assert(frame.questionNumber === row.sourceOrdinal && frame.bankCount === row.expectedBankCount, 'UI_SVG7_FRAME_SCOPE');
  return assertRoleFrame(frame, 0);
}
const checkedRoles = (frame, embeddedRow) => embeddedRow === undefined ? assertTwoRoleFrame(frame) : assertEmbeddedChoiceFrame(embeddedRow, frame);
const { TILE_SCHEMA, TILE_LIMIT, TILE_OVERLAP, assertTileCoverage } = shared;
const finiteRect = rect => rect && ['x', 'y', 'width', 'height'].every(key => Number.isFinite(rect[key]));
const checkedRect = rect => { assert(finiteRect(rect) && rect.width > 0 && rect.height > 0, 'UI_CAPTURE_RECT'); return rect; };
const inside = (a, b) => a.x >= b.x - 1 && a.y >= b.y - 1 && a.x + a.width <= b.x + b.width + 1 && a.y + a.height <= b.y + b.height + 1;
const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
function checkedSvg7Scope(manifestBytes, item, viewport, surface, mode) {
  assert.equal(shared.sha256(manifestBytes), MANIFEST_SHA256, 'UI_SVG7_CAPTURE_MANIFEST');
  const manifest = JSON.parse(manifestBytes);
  assert(manifest.surface === 'PROBLEM' && manifest.mode === 'exam' && manifest.expectedCases === 14 && manifest.items.length === 7,
    'UI_SVG7_CAPTURE_MANIFEST');
  assert(surface === 'PROBLEM' && mode === 'exam', 'UI_SVG7_CAPTURE_SURFACE');
  assert(manifest.viewports.some(value => shared.stable(value) === shared.stable(viewport)), 'UI_SVG7_CAPTURE_VIEWPORT');
  const matches = manifest.items.filter(row => row.questionUid === item?.questionUid);
  assert.equal(matches.length, 1, 'UI_SVG7_CAPTURE_COHORT');
  const row = matches[0];
  for (const key of ['key', 'questionUid', 'sourcePath', 'sourceOrdinal', 'expectedBankCount', 'questionSha256', 'choiceCount', 'assetPath'])
    assert.equal(item[key], row[key], 'UI_SVG7_CAPTURE_COHORT');
  return { row, sourceBinding: manifest.sourceBindings.find(source => source.sourcePath === row.sourcePath), viewport: { ...viewport }, surface, mode };
}
function captureRoute(row, frame) {
  assert(frame && frame.mode === 'exam' && frame.solutionNodes === 0 && frame.sourcePageMatched === true && frame.targetAssetMatched === true &&
    frame.questionNumber === row.sourceOrdinal && frame.bankCount === row.expectedBankCount, 'UI_SVG7_FRAME_SCOPE');
  if (row.key === EMBEDDED_CHOICE_KEY) {
    assert(frame.visibleDirectNodeCount === 2, 'UI_SVG7_EMBEDDED_CHOICES_EXTRA_DIRECT_ROLE');
    assertEmbeddedChoiceFrame(row, frame);
    return 'EXACT_EMBEDDED_CHOICES';
  }
  assert(row.embeddedChoiceBinding === undefined, 'UI_SVG7_UNSUPPORTED_EMBEDDED_CHOICE_CASE');
  if (frame.visibleDirectNodeCount >= 3) return 'UNCHANGED_SHARED';
  assert(frame.visibleDirectNodeCount === 2 && TWO_ROLE_KEYS.includes(row.key) && row.choiceCount === 0, 'UI_SVG7_TWO_ROLE_EXACT_ZERO_CHOICES');
  assertTwoRoleFrame(frame);
  return 'EXACT_TWO_ROLES';
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
  const sourceQuestion = AppState.data[expected.ordinal - 1];
  check(sourceQuestion && Array.isArray(sourceQuestion.choices), 'UI_ROLE_DIAGNOSTIC_CHOICES');
  const choiceState = { choiceCount: sourceQuestion.choices.length,
    allChoicesNonemptyStrings: sourceQuestion.choices.every(value => typeof value === 'string' && value.trim().length > 0),
    ownEmbeddedFlag: Object.hasOwn(sourceQuestion, 'choicesEmbeddedInImage'), embeddedFlagValue: sourceQuestion.choicesEmbeddedInImage ?? null,
    nestedEmbeddedFlag: sourceQuestion.sourcePayload?.choicesEmbeddedInImage === true,
    choicesSha256: await digest(JSON.stringify(sourceQuestion.choices)) };
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
    directNodes, mediaNodes, obstructions, hitTestSamples, foreignContentHits, choiceState,
    domSha256: initialDomSha256, inputUnchanged: true, cssWrites: 0, domWrites: 0, viewportChanges: 0, scrollOperations: 0 };
}

function assertTwoRoleFrame(frame) { return assertRoleFrame(frame, 1); }
function assertRoleFrame(frame, expectedEmptyNodes) {
  assert(frame?.schemaVersion === 'archive-problem-role-frame-v1' && frame.mode === 'exam' && frame.solutionNodes === 0 &&
    frame.sourcePageMatched === true && frame.targetAssetMatched === true, 'UI_TWO_ROLE_SURFACE');
  assert(frame.readiness === 'RENDER_READY' && frame.feedbackIdle === true, 'UI_CAPTURE_RENDER_STATE');
  assert(frame.inputUnchanged === true && frame.cssWrites === 0 && frame.domWrites === 0 && frame.viewportChanges === 0 && frame.scrollOperations === 0 &&
    /^[a-f0-9]{64}$/.test(frame.domSha256 || ''), 'UI_TWO_ROLE_INPUT_CHANGED');
  assert(frame.numberCount === 1 && frame.visibleNumberCount === 1 && frame.contentCount === 1 && frame.visibleContentCount === 1,
    'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  const box = checkedRect(frame.question);
  assert(Array.isArray(frame.directNodes) && frame.directNodes.length <= 128 && frame.directNodeCount === frame.directNodes.length &&
    frame.directNodes.every((node, index) => node.index === index), 'UI_TWO_ROLE_NODE_INVENTORY');
  const visible = frame.directNodes.filter(node => node.visible === true);
  assert(frame.visibleDirectNodeCount === 2 && visible.length === 2, 'UI_TWO_ROLE_VISIBLE_COUNT');
  const numbered = visible.filter(node => node.kind === 'ELEMENT' && node.tag === 'DIV' && shared.stable(node.knownClasses) === '["q-num"]');
  const statements = visible.filter(node => node.kind === 'ELEMENT' && node.tag === 'DIV' && shared.stable(node.knownClasses) === '["q-content"]');
  assert(numbered.length === 1 && statements.length === 1, 'UI_TWO_ROLE_REQUIRED_ROLES');
  const number = numbered[0], content = statements[0];
  assert(number.index < content.index && number.numberCount === 1 && number.contentCount === 0 && number.containsTargetImage === false && number.hasText === true && number.mediaCount === 0 &&
    content.numberCount === 0 && content.contentCount === 1 && content.containsTargetImage === true && content.mediaCount >= 1,
    'UI_TWO_ROLE_REQUIRED_ROLES');
  for (const node of visible) {
    assert(node.otherClassCount === 0 && node.otherClassesSha256 === null && node.displayNone === false && node.visibilityHidden === false && node.opacityZero === false,
      'UI_TWO_ROLE_VISIBLE_STATE');
    assert(inside(checkedRect(node.rect), box), 'UI_PROBLEM_CHILD_CLIPPED');
  }
  assert(number.rect.y + number.rect.height <= content.rect.y + 1, 'UI_TWO_ROLE_HEADER_OVERLAP');
  let emptyNodes = 0;
  for (const node of frame.directNodes.filter(node => !visible.includes(node))) {
    if (node.kind === 'TEXT') {
      assert(node.hasText === false && node.visible === false && finiteRect(node.rect) && node.rect.width === 0 && node.rect.height === 0,
        'UI_TWO_ROLE_OMITTED_TEXT');
      continue;
    }
    assert(node.kind === 'ELEMENT' && node.tag === 'DIV' && node.visible === false && node.hasText === false && node.mediaCount === 0 &&
      node.numberCount === 0 && node.contentCount === 0 && node.containsTargetImage === false && node.displayNone === false &&
      node.visibilityHidden === false && node.opacityZero === false && shared.stable(node.knownClasses) === '[]' && node.otherClassCount === 1 &&
      node.otherClassesSha256 === EMPTY_CLASS_SHA256 && finiteRect(node.rect) && node.rect.width > 0 && node.rect.height === 0 && inside(node.rect, box),
    'UI_TWO_ROLE_UNSAFE_EMPTY_NODE');
    emptyNodes++;
  }
  assert.equal(emptyNodes, expectedEmptyNodes, 'UI_TWO_ROLE_EMPTY_NODE_INVENTORY');
  assert(Array.isArray(frame.mediaNodes) && frame.mediaNodes.length === content.mediaCount && frame.mediaNodes.length <= 256 &&
    frame.mediaNodes.every((node, index) => node.index === index), 'UI_TWO_ROLE_MEDIA_INVENTORY');
  const images = frame.mediaNodes.filter(node => node.kind === 'IMG');
  assert(images.length === 1 && images[0].isTargetImage === true && images[0].complete === true && images[0].naturalWidth > 0 && images[0].naturalHeight > 0,
    'UI_TWO_ROLE_TARGET_IMAGE');
  for (const media of frame.mediaNodes) {
    assert(['IMG', 'MJX-CONTAINER', 'SVG', 'MATH'].includes(media.kind) && media.directNodeIndex === content.index && media.insideContent === true &&
      media.visible === true && media.displayNone === false && media.visibilityHidden === false && media.opacityZero === false &&
      (media.kind === 'IMG' || media.isTargetImage === false), 'UI_TWO_ROLE_FOREIGN_MEDIA');
    assert(inside(checkedRect(media.rect), content.rect) && inside(media.rect, box), 'UI_TWO_ROLE_MEDIA_CLIPPED');
  }
  assert.deepEqual(images[0].rect, checkedRect(frame.image), 'UI_TWO_ROLE_TARGET_GEOMETRY');
  assert(frame.viewport && frame.viewport.width > 0 && frame.viewport.height > 0 && Number.isFinite(frame.viewport.width) && Number.isFinite(frame.viewport.height) &&
    frame.scroll && Number.isFinite(frame.scroll.x) && Number.isFinite(frame.scroll.y), 'UI_CAPTURE_VIEWPORT');
  assert(Array.isArray(frame.obstructions), 'UI_CAPTURE_OBSTRUCTIONS');
  frame.obstructions.forEach(checkedRect);
  return { number, content, visible, emptyNodes };
}

function twoRoleContentClip(frame, embeddedRow) {
  const { visible } = checkedRoles(frame, embeddedRow), box = frame.question;
  const top = Math.max(box.y, Math.min(...visible.map(node => node.rect.y)) - 2);
  const bottom = Math.min(box.y + box.height, Math.max(...visible.map(node => node.rect.y + node.rect.height)) + 2);
  return checkedRect({ x: box.x, y: top, width: box.width, height: bottom - top });
}

function intervals(frame, embeddedRow) {
  const clip = twoRoleContentClip(frame, embeddedRow), viewport = frame.viewport;
  assert(clip.x >= 0 && clip.x + clip.width <= viewport.width, 'UI_PROBLEM_HORIZONTAL_CLIP');
  const blocked = frame.obstructions.filter(rect => rect.x < clip.x + clip.width && rect.x + rect.width > clip.x)
    .map(rect => [Math.max(0, rect.y - 8), Math.min(viewport.height, rect.y + rect.height + 8)]).filter(([from, to]) => to > from).sort((a, b) => a[0] - b[0]);
  const free = []; let start = 8;
  for (const [from, to] of blocked) { if (from > start) free.push([start, from]); start = Math.max(start, to); }
  if (start < viewport.height - 8) free.push([start, viewport.height - 8]);
  return { clip, free };
}

function planTwoRoleTiles(frame, embeddedRow) {
  const { clip, free } = intervals(frame, embeddedRow), capacity = Math.max(0, ...free.map(([from, to]) => to - from));
  assert(capacity > 0 && (clip.height <= capacity || capacity >= TILE_OVERLAP * 2), 'UI_SCROLL_TILE_VISIBLE_AREA');
  const tiles = []; let start = 0;
  while (true) {
    const end = Math.min(clip.height, start + capacity); tiles.push({ tileIndex: tiles.length + 1, relativeInterval: [start, end] });
    assert(tiles.length <= TILE_LIMIT, 'UI_SCROLL_TILE_LIMIT'); if (end === clip.height) break; start = end - TILE_OVERLAP;
  }
  return { tiles, capacity, coverage: assertTileCoverage(clip.height, tiles) };
}

function tileClip(frame, tile, embeddedRow) {
  const full = twoRoleContentClip(frame, embeddedRow), span = tile.relativeInterval;
  assert(Array.isArray(span) && span.length === 2 && span.every(Number.isFinite) && span[0] >= 0 && span[1] <= full.height && span[1] > span[0], 'UI_SCROLL_TILE_RANGE');
  return checkedRect({ x: full.x, y: full.y + span[0], width: full.width, height: span[1] - span[0] });
}

function planTwoRoleScroll(frame, tile, embeddedRow) {
  const { free } = intervals(frame, embeddedRow), clip = tileClip(frame, tile, embeddedRow), fits = free.filter(([from, to]) => to - from >= clip.height);
  assert(fits.length > 0, 'UI_SCROLL_TILE_DOES_NOT_FIT');
  const clear = fits.find(([from, to]) => clip.y >= from && clip.y + clip.height <= to);
  const selected = clear || fits.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
  return { scrollByY: clear ? 0 : clip.y - selected[0], safeInterval: selected, clip };
}

function assertTwoRoleTileCapture(frame, tile, embeddedRow) {
  const clip = tileClip(frame, tile, embeddedRow), viewport = frame.viewport;
  assert(clip.x >= 0 && clip.y >= 0 && clip.x + clip.width <= viewport.width && clip.y + clip.height <= viewport.height, 'UI_SCROLL_TILE_OUTSIDE_VIEWPORT');
  assert(frame.obstructions.every(rect => !overlaps(clip, rect)), 'UI_CAPTURE_OBSCURED'); return clip;
}

function documentFrame(frame, embeddedRow) {
  const roles = checkedRoles(frame, embeddedRow), convert = rect => ({ x: rect.x + frame.scroll.x, y: rect.y + frame.scroll.y, width: rect.width, height: rect.height });
  return { question: convert(frame.question), content: convert(twoRoleContentClip(frame, embeddedRow)), children: roles.visible.map(node => convert(node.rect)), image: convert(frame.image),
    media: frame.mediaNodes.map(node => ({ kind: node.kind, rect: convert(node.rect) })), viewport: frame.viewport, questionNumber: frame.questionNumber,
    roles: frame.directNodes.map(({ rect, ...node }) => node) };
}

// Same on-screen hit grid as the shared capture helper. No DOM/CSS mutation.
function inspectHits(image, clip) {
  const box = image.closest('.q-box'); let samples = 0, outsideQuestion = 0;
  const xs = [clip.x + 1.5], ys = [clip.y + 1.5];
  for (let x = clip.x + 17.5; x < clip.x + clip.width - 1.5; x += 16) xs.push(x);
  for (let y = clip.y + 17.5; y < clip.y + clip.height - 1.5; y += 16) ys.push(y);
  xs.push(clip.x + clip.width - 1.5); ys.push(clip.y + clip.height - 1.5);
  for (const x of xs) for (const y of ys) { samples++; const top = document.elementFromPoint(x, y); if (!top || (top !== box && !box.contains(top))) outsideQuestion++; }
  return { samples, outsideQuestion };
}

async function measuredRoles(target, measurementArgs) {
  let timer; return Promise.race([target.evaluate(measureProblemRoles, measurementArgs),
    new Promise((_resolve, reject) => { timer = setTimeout(() => reject(new Error('UI_TWO_ROLE_MEASUREMENT_TIMEOUT')), 15000); })]).finally(() => clearTimeout(timer));
}

async function captureTwoRoleTiles(page, target, file, firstFrame, measurementArgs, embeddedRow) {
  const measure = () => measuredRoles(target, measurementArgs);
  let frame = firstFrame; const original = documentFrame(frame, embeddedRow), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planTwoRoleTiles(frame, embeddedRow), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planTwoRoleScroll(frame, tile, embeddedRow); if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await measure();
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentFrame(frame, embeddedRow), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertTwoRoleTileCapture(frame, tile, embeddedRow), hits = await target.evaluate(inspectHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await measure();
    assert.deepEqual(assertTwoRoleTileCapture(after, tile, embeddedRow), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentFrame(after, embeddedRow), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const afterHits = await target.evaluate(inspectHits, clip);
    assert(afterHits.samples > 0 && afterHits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    tiles.push({ ...tile, filename: path.basename(tileFile), clip, scroll: after.scroll, scrollOperations, feedbackIdle: true,
      obstructionsIntersectingClip: 0, hitTestSamples: hits.samples + afterHits.samples, foreignContentHits: 0, domSha256: originalDomSha256 });
    frame = after;
  }
  return { schemaVersion: TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: TILE_LIMIT, overlapCssPixels: TILE_OVERLAP,
    tileCount: tiles.length, content: original.content, question: original.question, viewport: original.viewport, visibleChildren: 2,
    coverage: assertTileCoverage(original.content.height, tiles), tiles, scrollBefore, scrollAfter: frame.scroll,
    scrollOperations: tiles.reduce((sum, row) => sum + row.scrollOperations, 0), domSha256: originalDomSha256, feedbackIdle: true,
    foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0, compositeImageCreated: false };
}

async function captureClosedSvg7ProblemTiles({ root, expectedCommit, item, viewport, surface, mode, page, target, file, onInitialFrame }) {
  assert(path.isAbsolute(file) && file.endsWith('.png') && !path.resolve(file).startsWith(path.resolve(root) + path.sep), 'UI_OUTPUT_OUTSIDE_CHECKOUT_REQUIRED');
  const reader = shared.createGitReader(root, expectedCommit), manifestBytes = reader.read(MANIFEST_PATH);
  const scope = checkedSvg7Scope(manifestBytes, item, viewport, surface, mode), row = scope.row;
  const manifestRef = reader.ref(MANIFEST_PATH), captureHelperRef = reader.ref(COMMON_PATH), helperRef = reader.ref(SELF_PATH);
  assert.equal(captureHelperRef.sha256, COMMON_SHA256, 'UI_SVG7_COMMON_HELPER');
  const sourceRef = reader.ref(row.sourcePath), assetRef = reader.ref(row.assetPath);
  for (const key of ['gitBlobSha1', 'sha256', 'bytes']) assert.equal(sourceRef[key], scope.sourceBinding[key], 'UI_SVG7_CAPTURE_SOURCE');
  assert.deepEqual(item.sourceRef, sourceRef, 'UI_SVG7_CAPTURE_SOURCE');
  assert.deepEqual(item.assetRef, assetRef, 'UI_SVG7_CAPTURE_ASSET');
  assert.equal(assetRef.gitBlobSha1, row.assetGitBlobSha1, 'UI_SVG7_CAPTURE_ASSET');
  assert.equal(assetRef.sha256, row.assetSha256, 'UI_SVG7_CAPTURE_ASSET');
  assert.equal(assetRef.bytes, row.assetBytes, 'UI_SVG7_CAPTURE_ASSET');
  try { await page.waitForFunction(() => { const panel = document.getElementById('ap-archive-render-feedback'); return !panel || panel.hidden || getComputedStyle(panel).display === 'none'; }, null, { timeout: 15000 }); }
  catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  const measurementArgs = { ordinal: row.sourceOrdinal, bankCount: row.expectedBankCount, width: viewport.width, height: viewport.height, sourcePath: row.sourcePath, assetPath: row.assetPath };
  const first = await measuredRoles(target, measurementArgs);
  assert(first.viewport.width === viewport.width && first.viewport.height === viewport.height, 'UI_SVG7_FRAME_VIEWPORT');
  if (onInitialFrame !== undefined) { assert.equal(typeof onInitialFrame, 'function'); onInitialFrame(structuredClone(first)); }
  const route = captureRoute(row, first);
  let capture;
  if (route === 'UNCHANGED_SHARED') capture = await shared.captureProblemTiles(page, target, file);
  else {
    const embeddedRow = route === 'EXACT_EMBEDDED_CHOICES' ? row : undefined;
    capture = await captureTwoRoleTiles(page, target, file, first, measurementArgs, embeddedRow);
    capture.closedProblemRoles = { schemaVersion: 'archive-m2s1-svg7-two-direct-roles-v1', key: row.key, questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal,
      manifestRef, sourceRef, assetRef, helperRef, initialFrameSha256: shared.sha256(shared.stable(first)), numberRoleCount: 1, contentRoleCount: 1,
      targetImageCount: 1, emptyZeroHeightNodeCount: embeddedRow ? 0 : 1, expectedChoiceCount: embeddedRow ? 5 : 0, originalSharedHelperUnchanged: true,
      ...(embeddedRow ? { schemaVersion: 'archive-m2s1-svg7-embedded-image-choices-v1', embeddedChoiceBinding: embeddedRow.embeddedChoiceBinding,
        choiceState: first.choiceState } : {}) };
  }
  for (const ref of [manifestRef, captureHelperRef, helperRef, sourceRef, assetRef]) assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
  return capture;
}
module.exports = { SELF_PATH, MANIFEST_PATH, MANIFEST_SHA256, COMMON_PATH, COMMON_SHA256, TWO_ROLE_KEYS, EMBEDDED_CHOICE_KEY, assertEmbeddedChoiceRow, assertEmbeddedChoiceFrame, checkedSvg7Scope, captureRoute,
  assertTwoRoleFrame, twoRoleContentClip, planTwoRoleTiles, planTwoRoleScroll, assertTwoRoleTileCapture, measureProblemRoles, captureClosedSvg7ProblemTiles };
