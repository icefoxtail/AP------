'use strict';

// Exact TEXT3 PROBLEM transport only. The shared capture helper is unchanged.
// Three or more visible children still use its original implementation.
const assert = require('node:assert/strict');
const path = require('node:path');
const shared = require('./check-reviewed-problem-renderer-browser.cjs');
const { measureProblemRoles } = require('./m2s1-problem-capture-diagnostic.cjs');
const SELF_PATH = 'tools/m2s1-text3-problem-capture.cjs';
const MANIFEST_PATH = 'tests/fixtures/archive-m2s1-text3-problem-ui.json';
const MANIFEST_SHA256 = '84a8233210461c676eef4d126518442bc4875944d143038b73997134c5139e4f';
const COMMON_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const COMMON_SHA256 = 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const ROLE_PATH = 'tools/m2s1-problem-capture-diagnostic.cjs';
const ROLE_SHA256 = '9951724223fffe462fec790d444a5fb1d04e7a5bf9c4c0d1a2a81ad84f9e2ee9';
const EMPTY_CLASS_SHA256 = 'eecddef10cc4a80d3bd980d8a114244d6c2c6422131f2d0492d4428a94ab7674';
const { TILE_SCHEMA, TILE_LIMIT, TILE_OVERLAP, assertTileCoverage } = shared;
const finiteRect = rect => rect && ['x', 'y', 'width', 'height'].every(key => Number.isFinite(rect[key]));
const checkedRect = rect => { assert(finiteRect(rect) && rect.width > 0 && rect.height > 0, 'UI_CAPTURE_RECT'); return rect; };
const inside = (a, b) => a.x >= b.x - 1 && a.y >= b.y - 1 && a.x + a.width <= b.x + b.width + 1 && a.y + a.height <= b.y + b.height + 1;
const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

function checkedText3ProblemScope(manifestBytes, item, viewport, surface, mode) {
  assert.equal(shared.sha256(manifestBytes), MANIFEST_SHA256, 'UI_CLOSED_PROBLEM_MANIFEST');
  const manifest = JSON.parse(manifestBytes);
  assert(manifest.surface === 'PROBLEM' && manifest.mode === 'exam' && manifest.expectedCases === 6 && manifest.items.length === 3,
    'UI_CLOSED_PROBLEM_MANIFEST');
  assert(surface === 'PROBLEM' && mode === 'exam', 'UI_CLOSED_PROBLEM_SURFACE');
  assert(manifest.viewports.some(value => shared.stable(value) === shared.stable(viewport)), 'UI_CLOSED_PROBLEM_VIEWPORT');
  const matches = manifest.items.filter(row => row.questionUid === item?.questionUid);
  assert.equal(matches.length, 1, 'UI_CLOSED_PROBLEM_COHORT');
  const row = matches[0];
  for (const key of ['key', 'questionUid', 'sourceOrdinal', 'expectedBankCount', 'questionSha256', 'surfacePayloadSha256', 'expectedChoiceCount'])
    assert.equal(item[key], row[key], 'UI_CLOSED_PROBLEM_COHORT');
  assert.equal(row.assets.length, 1, 'UI_CLOSED_PROBLEM_ASSETS');
  return { row, viewport: { ...viewport }, surface, mode };
}

function assertTwoRoleFrame(frame) {
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
  assert.equal(emptyNodes, 1, 'UI_TWO_ROLE_EMPTY_NODE_INVENTORY');
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

function twoRoleContentClip(frame) {
  const { visible } = assertTwoRoleFrame(frame), box = frame.question;
  const top = Math.max(box.y, Math.min(...visible.map(node => node.rect.y)) - 2);
  const bottom = Math.min(box.y + box.height, Math.max(...visible.map(node => node.rect.y + node.rect.height)) + 2);
  return checkedRect({ x: box.x, y: top, width: box.width, height: bottom - top });
}

function intervals(frame) {
  const clip = twoRoleContentClip(frame), viewport = frame.viewport;
  assert(clip.x >= 0 && clip.x + clip.width <= viewport.width, 'UI_PROBLEM_HORIZONTAL_CLIP');
  const blocked = frame.obstructions.filter(rect => rect.x < clip.x + clip.width && rect.x + rect.width > clip.x)
    .map(rect => [Math.max(0, rect.y - 8), Math.min(viewport.height, rect.y + rect.height + 8)]).filter(([from, to]) => to > from).sort((a, b) => a[0] - b[0]);
  const free = []; let start = 8;
  for (const [from, to] of blocked) { if (from > start) free.push([start, from]); start = Math.max(start, to); }
  if (start < viewport.height - 8) free.push([start, viewport.height - 8]);
  return { clip, free };
}

function planTwoRoleTiles(frame) {
  const { clip, free } = intervals(frame), capacity = Math.max(0, ...free.map(([from, to]) => to - from));
  assert(capacity > 0 && (clip.height <= capacity || capacity >= TILE_OVERLAP * 2), 'UI_SCROLL_TILE_VISIBLE_AREA');
  const tiles = []; let start = 0;
  while (true) {
    const end = Math.min(clip.height, start + capacity); tiles.push({ tileIndex: tiles.length + 1, relativeInterval: [start, end] });
    assert(tiles.length <= TILE_LIMIT, 'UI_SCROLL_TILE_LIMIT'); if (end === clip.height) break; start = end - TILE_OVERLAP;
  }
  return { tiles, capacity, coverage: assertTileCoverage(clip.height, tiles) };
}

function tileClip(frame, tile) {
  const full = twoRoleContentClip(frame), span = tile.relativeInterval;
  assert(Array.isArray(span) && span.length === 2 && span.every(Number.isFinite) && span[0] >= 0 && span[1] <= full.height && span[1] > span[0], 'UI_SCROLL_TILE_RANGE');
  return checkedRect({ x: full.x, y: full.y + span[0], width: full.width, height: span[1] - span[0] });
}

function planTwoRoleScroll(frame, tile) {
  const { free } = intervals(frame), clip = tileClip(frame, tile), fits = free.filter(([from, to]) => to - from >= clip.height);
  assert(fits.length > 0, 'UI_SCROLL_TILE_DOES_NOT_FIT');
  const clear = fits.find(([from, to]) => clip.y >= from && clip.y + clip.height <= to);
  const selected = clear || fits.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
  return { scrollByY: clear ? 0 : clip.y - selected[0], safeInterval: selected, clip };
}

function assertTwoRoleTileCapture(frame, tile) {
  const clip = tileClip(frame, tile), viewport = frame.viewport;
  assert(clip.x >= 0 && clip.y >= 0 && clip.x + clip.width <= viewport.width && clip.y + clip.height <= viewport.height, 'UI_SCROLL_TILE_OUTSIDE_VIEWPORT');
  assert(frame.obstructions.every(rect => !overlaps(clip, rect)), 'UI_CAPTURE_OBSCURED'); return clip;
}

function documentFrame(frame) {
  const roles = assertTwoRoleFrame(frame), convert = rect => ({ x: rect.x + frame.scroll.x, y: rect.y + frame.scroll.y, width: rect.width, height: rect.height });
  return { question: convert(frame.question), content: convert(twoRoleContentClip(frame)), children: roles.visible.map(node => convert(node.rect)), image: convert(frame.image),
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

async function captureTwoRoleTiles(page, target, file, firstFrame, measurementArgs) {
  const measure = () => measuredRoles(target, measurementArgs);
  let frame = firstFrame; const original = documentFrame(frame), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planTwoRoleTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planTwoRoleScroll(frame, tile); if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await measure();
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentFrame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertTwoRoleTileCapture(frame, tile), hits = await target.evaluate(inspectHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await measure();
    assert.deepEqual(assertTwoRoleTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentFrame(after), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
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

async function captureClosedText3ProblemTiles({ root, expectedCommit, item, viewport, surface, mode, page, target, file }) {
  assert(path.isAbsolute(file) && file.endsWith('.png') && !path.resolve(file).startsWith(path.resolve(root) + path.sep), 'UI_OUTPUT_OUTSIDE_CHECKOUT_REQUIRED');
  const reader = shared.createGitReader(root, expectedCommit), manifestBytes = reader.read(MANIFEST_PATH);
  const scope = checkedText3ProblemScope(manifestBytes, item, viewport, surface, mode), row = scope.row;
  const manifestRef = reader.ref(MANIFEST_PATH), captureHelperRef = reader.ref(COMMON_PATH), roleHelperRef = reader.ref(ROLE_PATH), helperRef = reader.ref(SELF_PATH);
  assert.equal(captureHelperRef.sha256, COMMON_SHA256, 'UI_CLOSED_PROBLEM_COMMON_HELPER');
  assert.equal(roleHelperRef.sha256, ROLE_SHA256, 'UI_CLOSED_PROBLEM_ROLE_HELPER');
  const sourceRef = reader.ref(row.sourcePath), assetRef = reader.ref(row.assets[0].path);
  assert.equal(sourceRef.gitBlobSha1, row.sourceGitBlobSha1, 'UI_CLOSED_PROBLEM_SOURCE');
  assert.equal(sourceRef.sha256, row.sourceSha256, 'UI_CLOSED_PROBLEM_SOURCE');
  assert.deepEqual(item.sourceRef, sourceRef, 'UI_CLOSED_PROBLEM_SOURCE');
  assert.deepEqual(item.assetRefs, [assetRef], 'UI_CLOSED_PROBLEM_ASSETS');
  assert.deepEqual({ path: assetRef.path, gitBlobSha1: assetRef.gitBlobSha1, sha256: assetRef.sha256, bytes: assetRef.bytes }, row.assets[0], 'UI_CLOSED_PROBLEM_ASSETS');
  try { await page.waitForFunction(() => { const panel = document.getElementById('ap-archive-render-feedback'); return !panel || panel.hidden || getComputedStyle(panel).display === 'none'; }, null, { timeout: 15000 }); }
  catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  const measurementArgs = { ordinal: row.sourceOrdinal, bankCount: row.expectedBankCount, width: viewport.width, height: viewport.height, sourcePath: row.sourcePath, assetPath: row.assets[0].path };
  const first = await measuredRoles(target, measurementArgs);
  assert(first.viewport.width === viewport.width && first.viewport.height === viewport.height && first.questionNumber === row.sourceOrdinal && first.bankCount === row.expectedBankCount,
    'UI_CLOSED_PROBLEM_FRAME_SCOPE');
  let capture;
  if (first.visibleDirectNodeCount >= 3) capture = await shared.captureProblemTiles(page, target, file);
  else {
    assert.equal(first.visibleDirectNodeCount, 2, 'UI_COMPLETE_PROBLEM_CHILDREN');
    assert.equal(row.expectedChoiceCount, 0, 'UI_TEXT3_TWO_ROLE_WITH_CHOICES');
    capture = await captureTwoRoleTiles(page, target, file, first, measurementArgs);
    capture.closedProblemRoles = { schemaVersion: 'archive-m2s1-text3-problem-two-direct-roles-v1', key: row.key, questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal,
      manifestRef, sourceRef, assetRef, helperRef, roleHelperRef, initialFrameSha256: shared.sha256(shared.stable(first)), numberRoleCount: 1, contentRoleCount: 1,
      targetImageCount: 1, emptyZeroHeightNodeCount: 1, originalSharedHelperUnchanged: true };
  }
  for (const ref of [manifestRef, captureHelperRef, roleHelperRef, helperRef, sourceRef, assetRef]) assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
  return capture;
}

module.exports = { SELF_PATH, MANIFEST_PATH, MANIFEST_SHA256, checkedText3ProblemScope, assertTwoRoleFrame, twoRoleContentClip,
  planTwoRoleTiles, planTwoRoleScroll, assertTwoRoleTileCapture, captureClosedText3ProblemTiles };
