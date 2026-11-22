'use strict';

// This checker records problem-only student UI evidence. It never grants a
// mathematical, metadata, difficulty, REVIEW2, or four-slot approval.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const MANIFEST_PATH = 'tests/fixtures/archive-reviewed-problem-renderer-ui3.json';
const CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const TEST_PATH = 'tests/archive-problem-renderer-ui-contract.test.js';
const WORKFLOW_PATH = '.github/workflows/archive2-runtime-guard.yml';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-problem-renderer-student-ui-preview-v2';
const TILE_SCHEMA = 'archive-problem-scroll-coverage-v1';
const TILE_OVERLAP = 32;
const TILE_LIMIT = 8;
const FONT_FAMILY = 'Nanum Myeongjo';
const FONT_DIR = 'archive/vendor/nanum-myeongjo/';
const FONT_STYLESHEET = FONT_DIR + 'nanum-myeongjo.css';
const FONT_LICENSE = FONT_DIR + 'OFL.txt';
// Upstream Google Fonts OFL at f12cf9db03e8, with only trailing spaces removed.
const FONT_LICENSE_SHA256 = 'a06fb4706bd70da776e78c0df4fc08e49f12e604668d1da26abd689661e2ba4d';
// Google's Nanum Myeongjo v31 Chromium stylesheet, whose src URLs alone are local.
const FONT_STYLESHEET_SHA256 = '2adc8e3a93a6c54cfd800c51158737f3ca6bbcf7ad0f4145e5102864c9b06e2a';
const FONT_INVENTORY_SHA256 = '7cda2e76c30f8e4e34b62675983a6982f9a99fbb5827172e5298f6cff915fe76';
const FONT_WEIGHTS = [400, 700, 800];
const EXPECTED_KEYS = ['E005-Q12', 'E006-Q21', 'E006-Q3'];
const SHA256 = /^[a-f0-9]{64}$/;
const SHA1 = /^[a-f0-9]{40}$/;
const stable = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const ownKeys = (value, expected, code) => {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), expected.slice().sort(), code);
};
const relativePath = value => typeof value === 'string' && value.length > 0 && !value.includes('\\') &&
  !value.includes('\0') && !path.posix.isAbsolute(value) && path.posix.normalize(value) === value &&
  !value.split('/').some(part => part === '.' || part === '..');

const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x &&
  a.y < b.y + b.height && a.y + a.height > b.y;
const checkedRect = rect => {
  assert(rect && ['x', 'y', 'width', 'height'].every(key => Number.isFinite(rect[key])) && rect.width > 0 && rect.height > 0,
    'UI_CAPTURE_RECT');
  return rect;
};

function problemContentClip(frame) {
  const box = checkedRect(frame.question);
  assert(Array.isArray(frame.children) && frame.children.length >= 3, 'UI_COMPLETE_PROBLEM_CHILDREN');
  const children = frame.children.map(checkedRect);
  assert(children.every(child => child.x >= box.x - 1 && child.y >= box.y - 1 &&
    child.x + child.width <= box.x + box.width + 1 && child.y + child.height <= box.y + box.height + 1),
  'UI_PROBLEM_CHILD_CLIPPED');
  // Keep every visible child, including the number, complete statement, image
  // and choices. Only the empty flex tail of the page-sized q-box is excluded.
  const top = Math.max(box.y, Math.min(...children.map(child => child.y)) - 2);
  const bottom = Math.min(box.y + box.height, Math.max(...children.map(child => child.y + child.height)) + 2);
  return checkedRect({ x: box.x, y: top, width: box.width, height: bottom - top });
}

function planProblemScroll(frame) {
  const clip = problemContentClip(frame), viewport = frame.viewport;
  assert(viewport && Number.isFinite(viewport.width) && Number.isFinite(viewport.height) && viewport.width > 0 && viewport.height > 0,
    'UI_CAPTURE_VIEWPORT');
  assert(clip.x >= 0 && clip.x + clip.width <= viewport.width, 'UI_PROBLEM_HORIZONTAL_CLIP');
  assert(Array.isArray(frame.obstructions), 'UI_CAPTURE_OBSTRUCTIONS');
  const blocked = frame.obstructions.map(checkedRect).filter(rect => rect.x < clip.x + clip.width && rect.x + rect.width > clip.x)
    .map(rect => [Math.max(0, rect.y - 8), Math.min(viewport.height, rect.y + rect.height + 8)])
    .filter(([start, end]) => end > start).sort((a, b) => a[0] - b[0]);
  const free = []; let start = 8;
  for (const [from, to] of blocked) { if (from > start) free.push([start, from]); start = Math.max(start, to); }
  if (start < viewport.height - 8) free.push([start, viewport.height - 8]);
  const fits = free.filter(([from, to]) => to - from >= clip.height);
  assert(fits.length > 0, 'UI_COMPLETE_PROBLEM_DOES_NOT_FIT_VIEWPORT');
  const alreadyClear = fits.find(([from, to]) => clip.y >= from && clip.y + clip.height <= to);
  const selected = alreadyClear || fits.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
  return { scrollByY: alreadyClear ? 0 : clip.y - selected[0], safeInterval: selected, clip };
}

function assertProblemCapture(frame) {
  const clip = problemContentClip(frame), viewport = frame.viewport;
  assert(frame.feedbackIdle === true, 'UI_RENDER_FEEDBACK_NOT_IDLE');
  assert(frame.readiness === 'RENDER_READY' && frame.solutionNodes === 0, 'UI_CAPTURE_RENDER_STATE');
  assert(clip.x >= 0 && clip.y >= 0 && clip.x + clip.width <= viewport.width && clip.y + clip.height <= viewport.height,
    'UI_COMPLETE_PROBLEM_OUTSIDE_VIEWPORT');
  assert(frame.obstructions.every(rect => !overlaps(clip, checkedRect(rect))), 'UI_CAPTURE_OBSCURED');
  return clip;
}

// Runs in the browser and only reads the live student DOM. No style, text,
// viewport, source or rendering state is substituted for the screenshot.
async function measureProblemCapture(image) {
  const box = image.closest('.q-box');
  const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
  const visible = element => {
    const css = getComputedStyle(element), r = element.getBoundingClientRect();
    return css.display !== 'none' && css.visibility !== 'hidden' && css.visibility !== 'collapse' && Number(css.opacity) !== 0 && r.width > 0 && r.height > 0;
  };
  // 균등 칸 엔진은 문항 내용을 .ap-slot-content 하나로 감싼다(옛 갈래는 q-box의 직계 자식). 번호·본문·그림·보기는 그 안에서 센다.
  const holder = box.querySelector(':scope > .ap-slot-content') || box;
  const children = [];
  for (const child of holder.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE && visible(child)) children.push(rect(child));
    else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
      const range = document.createRange(); range.selectNodeContents(child);
      const r = range.getBoundingClientRect(); if (r.width > 0 && r.height > 0) children.push({ x: r.x, y: r.y, width: r.width, height: r.height });
    }
  }
  const obstructions = [...document.querySelectorAll('body *')].filter(element => !box.contains(element) && !element.contains(box) &&
    ['fixed', 'sticky'].includes(getComputedStyle(element).position) && visible(element)).map(rect)
    .filter(r => r.x < innerWidth && r.x + r.width > 0 && r.y < innerHeight && r.y + r.height > 0);
  const panel = document.getElementById('ap-archive-render-feedback');
  const completeChildrenVisible = [...holder.children].every(child =>
    (!child.textContent.trim() && !child.querySelector('img,svg,math,mjx-container')) || visible(child));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(box.outerHTML));
  return { question: rect(box), children, image: rect(image), viewport: { width: innerWidth, height: innerHeight },
    scroll: { x: scrollX, y: scrollY }, obstructions, feedbackIdle: !panel || panel.hidden || !visible(panel),
    readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
    solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber: box.querySelector('.q-num')?.textContent?.trim(),
    mandatoryChildrenVisible: visible(box) && completeChildrenVisible && !!box.querySelector('.q-num') && visible(box.querySelector('.q-num')) &&
      !!box.querySelector('.q-content') && visible(box.querySelector('.q-content')) && visible(image),
    domSha256: [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('') };
}

function inspectCaptureHits(image, clip) {
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

async function captureCompleteProblem(page, target, file) {
  // The production feedback hides itself only after its real render promise
  // settles. A pending/failed panel must not be cropped away as a successful UI.
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measureProblemCapture); const originalDomSha256 = frame.domSha256;
  const scrollBefore = frame.scroll; let scrollOperations = 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    const plan = planProblemScroll(frame);
    if (Math.abs(plan.scrollByY) < 0.5) break;
    await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), plan.scrollByY);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    scrollOperations++; frame = await target.evaluate(measureProblemCapture);
  }
  assert(frame.mandatoryChildrenVisible, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
  const clip = assertProblemCapture(frame), hits = await target.evaluate(inspectCaptureHits, clip);
  assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
  // A page viewport clip does not perform the locator screenshot's implicit
  // second scroll. It records this already verified on-screen content exactly.
  await page.screenshot({ path: file, clip, fullPage: false, caret: 'initial', timeout: 15000 });
  const after = await target.evaluate(measureProblemCapture);
  assert(after.mandatoryChildrenVisible, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  assert.deepEqual(assertProblemCapture(after), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
  assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
  assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
  const afterHits = await target.evaluate(inspectCaptureHits, clip);
  assert(afterHits.samples > 0 && afterHits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
  return { method: 'UNCHANGED_VIEWPORT_COMPLETE_CHILD_ENVELOPE', clip, question: frame.question, visibleChildren: frame.children.length,
    scrollBefore, scrollAfter: after.scroll, scrollOperations, feedbackIdle: true, obstructionsIntersectingClip: 0,
    hitTestSamples: hits.samples + afterHits.samples, foreignContentHits: 0, domSha256: originalDomSha256,
    cssWrites: 0, domWrites: 0, viewportChanges: 0 };
}

// A tall mobile problem is read by scrolling the unchanged student surface.
// Each PNG is an original viewport capture. No image stitching, resizing,
// hidden controls or CSS/DOM substitutes can establish complete coverage.
function problemTileIntervals(frame) {
  const clip = problemContentClip(frame), viewport = frame.viewport;
  assert(viewport && Number.isFinite(viewport.width) && Number.isFinite(viewport.height) &&
    viewport.width > 0 && viewport.height > 0, 'UI_CAPTURE_VIEWPORT');
  assert(clip.x >= 0 && clip.x + clip.width <= viewport.width, 'UI_PROBLEM_HORIZONTAL_CLIP');
  assert(Array.isArray(frame.obstructions), 'UI_CAPTURE_OBSTRUCTIONS');
  const blocked = frame.obstructions.map(checkedRect).filter(rect => rect.x < clip.x + clip.width && rect.x + rect.width > clip.x)
    .map(rect => [Math.max(0, rect.y - 8), Math.min(viewport.height, rect.y + rect.height + 8)])
    .filter(([from, to]) => to > from).sort((a, b) => a[0] - b[0]);
  const free = []; let start = 8;
  for (const [from, to] of blocked) { if (from > start) free.push([start, from]); start = Math.max(start, to); }
  if (start < viewport.height - 8) free.push([start, viewport.height - 8]);
  return { clip, free };
}

function assertTileCoverage(height, tiles) {
  assert(Number.isFinite(height) && height > 0 && Array.isArray(tiles) && tiles.length > 0 && tiles.length <= TILE_LIMIT,
    'UI_SCROLL_TILE_INVENTORY');
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i], span = tile.relativeInterval;
    assert(tile.tileIndex === i + 1 && Array.isArray(span) && span.length === 2 && span.every(Number.isFinite) &&
      span[0] >= 0 && span[1] <= height && span[1] > span[0], 'UI_SCROLL_TILE_RANGE');
    if (i === 0) assert.equal(span[0], 0, 'UI_SCROLL_TILE_TOP_MISSING');
    else {
      const prior = tiles[i - 1].relativeInterval;
      assert(span[0] > prior[0] && span[1] > prior[1], 'UI_SCROLL_TILE_NO_PROGRESS');
      assert.equal(prior[1] - span[0], TILE_OVERLAP, 'UI_SCROLL_TILE_OVERLAP');
    }
  }
  assert.equal(tiles.at(-1).relativeInterval[1], height, 'UI_SCROLL_TILE_BOTTOM_MISSING');
  return { requiredInterval: [0, height], coveredInterval: [0, height], complete: true };
}

function planProblemTiles(frame) {
  const { clip, free } = problemTileIntervals(frame);
  const capacity = Math.max(0, ...free.map(([from, to]) => to - from));
  assert(capacity > 0 && (clip.height <= capacity || capacity >= TILE_OVERLAP * 2), 'UI_SCROLL_TILE_VISIBLE_AREA');
  const tiles = []; let start = 0;
  while (true) {
    const end = Math.min(clip.height, start + capacity);
    tiles.push({ tileIndex: tiles.length + 1, relativeInterval: [start, end] });
    assert(tiles.length <= TILE_LIMIT, 'UI_SCROLL_TILE_LIMIT');
    if (end === clip.height) break;
    start = end - TILE_OVERLAP;
  }
  return { tiles, capacity, coverage: assertTileCoverage(clip.height, tiles) };
}

function problemTileClip(frame, tile) {
  const full = problemContentClip(frame), span = tile.relativeInterval;
  assert(Array.isArray(span) && span.length === 2 && span.every(Number.isFinite) && span[0] >= 0 &&
    span[1] <= full.height && span[1] > span[0], 'UI_SCROLL_TILE_RANGE');
  return checkedRect({ x: full.x, y: full.y + span[0], width: full.width, height: span[1] - span[0] });
}

function planProblemTileScroll(frame, tile) {
  const { free } = problemTileIntervals(frame), clip = problemTileClip(frame, tile);
  const fits = free.filter(([from, to]) => to - from >= clip.height);
  assert(fits.length > 0, 'UI_SCROLL_TILE_DOES_NOT_FIT');
  const clear = fits.find(([from, to]) => clip.y >= from && clip.y + clip.height <= to);
  const selected = clear || fits.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
  return { scrollByY: clear ? 0 : clip.y - selected[0], safeInterval: selected, clip };
}

function assertProblemTileCapture(frame, tile) {
  const clip = problemTileClip(frame, tile), viewport = frame.viewport;
  assert(frame.feedbackIdle === true, 'UI_RENDER_FEEDBACK_NOT_IDLE');
  assert(frame.readiness === 'RENDER_READY' && frame.solutionNodes === 0, 'UI_CAPTURE_RENDER_STATE');
  assert(frame.mandatoryChildrenVisible === true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  assert(clip.x >= 0 && clip.y >= 0 && clip.x + clip.width <= viewport.width && clip.y + clip.height <= viewport.height,
    'UI_SCROLL_TILE_OUTSIDE_VIEWPORT');
  assert(Array.isArray(frame.obstructions) && frame.obstructions.every(rect => !overlaps(clip, checkedRect(rect))),
    'UI_CAPTURE_OBSCURED');
  return clip;
}

function documentProblemFrame(frame) {
  assert(frame.scroll && Number.isFinite(frame.scroll.x) && Number.isFinite(frame.scroll.y), 'UI_CAPTURE_SCROLL');
  const documentRect = rect => { checkedRect(rect); return { x: rect.x + frame.scroll.x, y: rect.y + frame.scroll.y,
    width: rect.width, height: rect.height }; };
  return { question: documentRect(frame.question), content: documentRect(problemContentClip(frame)),
    children: frame.children.map(documentRect), image: documentRect(frame.image), viewport: frame.viewport,
    questionNumber: frame.questionNumber };
}

async function captureProblemTiles(page, target, file) {
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measureProblemCapture);
  assert(frame.mandatoryChildrenVisible === true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  const original = documentProblemFrame(frame), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planProblemTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planProblemTileScroll(frame, tile);
      if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await target.evaluate(measureProblemCapture);
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentProblemFrame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertProblemTileCapture(frame, tile), hits = await target.evaluate(inspectCaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await target.evaluate(measureProblemCapture);
    assert.deepEqual(assertProblemTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentProblemFrame(after), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const afterHits = await target.evaluate(inspectCaptureHits, clip);
    assert(afterHits.samples > 0 && afterHits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    tiles.push({ ...tile, filename: path.basename(tileFile), clip, scroll: after.scroll, scrollOperations,
      feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: hits.samples + afterHits.samples,
      foreignContentHits: 0, domSha256: originalDomSha256 });
    frame = after;
  }
  return { schemaVersion: TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: TILE_LIMIT,
    overlapCssPixels: TILE_OVERLAP, tileCount: tiles.length, content: original.content, question: original.question,
    viewport: original.viewport, visibleChildren: original.children.length, coverage: assertTileCoverage(original.content.height, tiles),
    tiles, scrollBefore, scrollAfter: frame.scroll, scrollOperations: tiles.reduce((sum, row) => sum + row.scrollOperations, 0),
    domSha256: originalDomSha256, feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0,
    compositeImageCreated: false };
}

function readScreenshotArtifacts(out) {
  return fs.readdirSync(out).filter(file => file.endsWith('.png')).sort().map(file => {
    const full = path.join(out, file);
    assert(fs.lstatSync(full).isFile(), 'UI_SCREENSHOT_REGULAR_FILE');
    const bytes = fs.readFileSync(full);
    return { path: file, sha256: sha256(bytes), bytes: bytes.length };
  });
}

function assertScreenshotInventory(results, artifacts) {
  const expected = results.flatMap(row => {
    assert(Array.isArray(row.screenshots) && row.screenshots.length === row.capture.tileCount &&
      row.screenshots.length === row.capture.tiles.length && row.screenshots.length > 0 && row.screenshots.length <= TILE_LIMIT,
    'UI_SCREENSHOT_TILE_COUNT');
    return row.screenshots.map((shot, index) => {
      ownKeys(shot, ['tileIndex', 'path', 'sha256', 'bytes'], 'UI_SCREENSHOT_KEYS');
      const expectedPath = `${row.key}-${row.viewport.name}-tile-${String(index + 1).padStart(2, '0')}.png`;
      assert(shot.tileIndex === index + 1 && row.capture.tiles[index].tileIndex === index + 1 &&
        shot.path === expectedPath && row.capture.tiles[index].filename === expectedPath &&
        SHA256.test(shot.sha256) && Number.isSafeInteger(shot.bytes) && shot.bytes > 0, 'UI_SCREENSHOT_TILE_BINDING');
      return { path: shot.path, sha256: shot.sha256, bytes: shot.bytes };
    });
  }).sort((a, b) => a.path.localeCompare(b.path));
  assert.equal(new Set(expected.map(row => row.path)).size, expected.length, 'UI_SCREENSHOT_ARTIFACT_DUPLICATE');
  assert.deepEqual(artifacts.slice().sort((a, b) => a.path.localeCompare(b.path)), expected, 'UI_SCREENSHOT_ARTIFACT_INVENTORY');
  return expected.length;
}

function studentFontResourcePath(value, origin, allowedPaths) {
  const url = new URL(value), rel = url.pathname.slice(1);
  return value === origin + '/' + rel && allowedPaths.has(rel) ? rel : null;
}

function declaredStudentFonts(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert(!/@import\b/i.test(css), 'UI_NESTED_FONT_IMPORT');
  const rules = /@font-face\s*\{([^{}]*)\}/gi;
  const files = new Map();
  for (const [, declarations] of css.matchAll(rules)) {
    const fields = {};
    for (const declaration of declarations.split(';').map(value => value.trim()).filter(Boolean)) {
      const field = declaration.match(/^([a-z-]+)\s*:\s*(.+)$/);
      assert(field && !Object.hasOwn(fields, field[1]), 'UI_FONT_DECLARATIONS');
      fields[field[1]] = field[2];
    }
    ownKeys(fields, ['font-family', 'font-style', 'font-weight', 'font-display', 'src', 'unicode-range'], 'UI_FONT_DECLARATIONS');
    assert(/^(['"])Nanum Myeongjo\1$/.test(fields['font-family']), 'UI_FONT_FAMILY_REQUIRED');
    assert(fields['font-style'] === 'normal' && fields['font-display'] === 'swap', 'UI_FONT_DECLARATIONS');
    assert(/^U\+[0-9a-f]{1,6}(?:-[0-9a-f]{1,6})?(?:\s*,\s*U\+[0-9a-f]{1,6}(?:-[0-9a-f]{1,6})?)*$/i.test(fields['unicode-range']),
      'UI_FONT_DECLARATIONS');
    const file = fields.src.match(/^url\(\.\/([A-Za-z0-9_-]+(?:\.(?:0|[1-9][0-9]?|1[01][0-9]))?\.woff2)\)\s+format\((['"])woff2\2\)$/)?.[1];
    assert(file, 'UI_FONT_URL_OUTSIDE_DECLARED_FAMILY');
    const rel = FONT_DIR + file;
    const weight = Number(fields['font-weight']);
    assert(FONT_WEIGHTS.includes(weight) && String(weight) === fields['font-weight'] && !files.has(rel), 'UI_FONT_WEIGHT_REQUIRED');
    files.set(rel, weight);
  }
  assert(!css.replace(rules, '').trim(), 'UI_FONT_DECLARATIONS');
  assert.deepEqual(FONT_WEIGHTS.map(weight => [...files.values()].filter(value => value === weight).length),
    [92, 92, 92], 'UI_FONT_WEIGHT_REQUIRED');
  return files;
}

function checkedStudentFontRefs(reader) {
  const css = reader.read(FONT_STYLESHEET);
  const weights = declaredStudentFonts(css.toString('utf8'));
  assert.equal(sha256(css), FONT_STYLESHEET_SHA256, 'UI_FONT_STYLESHEET_BYTES_DRIFT');
  const refs = new Map([[FONT_STYLESHEET, reader.ref(FONT_STYLESHEET, css)]]);
  const inventory = [];
  for (const file of [...weights.keys()].sort()) {
    const bytes = reader.read(file);
    assert(bytes.length <= 2 * 1024 * 1024 && bytes.toString('ascii', 0, 4) === 'wOF2', 'UI_FONT_BODY_SIZE');
    inventory.push([file, sha256(bytes)]);
    refs.set(file, reader.ref(file, bytes));
  }
  assert.equal(sha256(stable(inventory)), FONT_INVENTORY_SHA256, 'UI_FONT_BYTES_DRIFT');
  const license = reader.read(FONT_LICENSE);
  assert.equal(sha256(license), FONT_LICENSE_SHA256, 'UI_FONT_LICENSE_DRIFT');
  return { refs, weights, licenseRef: reader.ref(FONT_LICENSE, license) };
}

function fontFailureDiagnostic(observation, error) {
  const message = typeof error?.message === 'string' ? error.message : '';
  const code = message.split('\n')[0];
  const knownCodes = ['UI_FONT_HTTP_STATUS', 'UI_FONT_REDIRECT', 'UI_FONT_MIME', 'UI_FONT_BODY_SIZE', 'UI_FONT_BYTES_DRIFT',
    'UI_NESTED_FONT_IMPORT', 'UI_FONT_URL_OUTSIDE_DECLARED_FAMILY',
    'UI_FONT_FAMILY_REQUIRED', 'UI_FONT_WEIGHT_REQUIRED', 'UI_FONT_DECLARATIONS', 'UI_FONT_NOT_DECLARED'];
  return { code: 'UI_STUDENT_FONT_FAILED',
    kind: ['STYLESHEET', 'FONT'].includes(observation.kind) ? observation.kind : 'UNKNOWN',
    urlSha256: SHA256.test(observation.urlSha256 || '') ? observation.urlSha256 : null,
    stage: ['FETCH', 'HTTP_STATUS', 'RESPONSE_URL', 'MIME', 'BODY_READ', 'BODY_SIZE', 'BODY_HASH', 'CSS_DECLARATIONS', 'FULFILL', 'ABORT'].includes(observation.stage)
      ? observation.stage : 'UNKNOWN',
    httpStatus: Number.isInteger(observation.httpStatus) && observation.httpStatus >= 100 && observation.httpStatus <= 599 ? observation.httpStatus : null,
    responseUrlSha256: SHA256.test(observation.responseUrlSha256 || '') ? observation.responseUrlSha256 : null,
    mime: typeof observation.mime === 'string' && observation.mime.length <= 128 && /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/.test(observation.mime) ? observation.mime : null,
    bytes: Number.isSafeInteger(observation.bytes) && observation.bytes >= 0 ? observation.bytes : null,
    responseSha256: SHA256.test(observation.responseSha256 || '') ? observation.responseSha256 : null,
    errorName: ['AssertionError', 'Error', 'TimeoutError', 'TypeError', 'SyntaxError'].includes(error?.name) ? error.name : 'OtherError',
    errorCode: knownCodes.includes(code) ? code : 'UNCLASSIFIED_ERROR', errorMessageSha256: sha256(message) };
}

function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'expectedCases', 'viewports', 'items'], 'UI_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-reviewed-problem-renderer-ui-manifest-v1', 'UI_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'PR2188_PROBLEM_RENDERERS_AND_Q3_LABEL_REPAIR_ONLY', 'UI_MANIFEST_SCOPE');
  assert.equal(manifest.expectedCases, 6, 'UI_MANIFEST_CASE_COUNT');
  assert.deepEqual(manifest.viewports, [{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }], 'UI_VIEWPORTS');
  assert(Array.isArray(manifest.items), 'UI_ITEMS');
  assert.deepEqual(manifest.items.map(item => item.key).sort(), EXPECTED_KEYS, 'UI_EXACT_THREE_ITEMS');
  const uids = new Set();
  const locators = new Set();
  for (const item of manifest.items) {
    ownKeys(item, ['key', 'questionUid', 'sourceOrdinal', 'sourcePath', 'problemPayloadSha256', 'presentationSha256', 'assetPath', 'assetSha256'], 'UI_ITEM_KEYS');
    assert(/^qid_v1_[a-f0-9]{64}$/.test(item.questionUid) && !uids.has(item.questionUid), 'UI_UNIQUE_UID');
    uids.add(item.questionUid);
    assert(Number.isInteger(item.sourceOrdinal) && item.sourceOrdinal > 0, 'UI_ORDINAL');
    assert(relativePath(item.sourcePath) && item.sourcePath.startsWith('archive/exams/original/middle/m2/2final/') && item.sourcePath.endsWith('.js'), 'UI_SOURCE_PATH');
    assert(relativePath(item.assetPath) && item.assetPath.startsWith('archive/assets/images/') && item.assetPath.endsWith('.svg'), 'UI_ASSET_PATH');
    const locator = `${item.sourcePath}:${item.sourceOrdinal}`;
    assert(!locators.has(locator), 'UI_UNIQUE_LOCATOR');
    locators.add(locator);
    assert(SHA256.test(item.problemPayloadSha256) && SHA256.test(item.presentationSha256) && SHA256.test(item.assetSha256), 'UI_HASH');
    if (item.key === 'E006-Q3') {
      assert.equal(item.sourceOrdinal, 3, 'UI_Q3_ORDINAL');
      assert.equal(path.posix.basename(item.assetPath), 'q3-problem-visual-v3.svg', 'UI_Q3_REPAIRED_ASSET_REQUIRED');
      assert.equal(item.assetSha256, 'd1d29913cf799c82380e2765ac1648ad9cda6324e421a5418055b779e7ba61c7', 'UI_Q3_REPAIRED_BYTES_REQUIRED');
    }
  }
  assert.equal(new Set(manifest.items.map(item => item.sourcePath)).size, 2, 'UI_TWO_BANKS');
  return manifest;
}

function planRequired(manifest, scope, checkoutCommit) {
  validateManifest(manifest);
  assert(SHA1.test(checkoutCommit), 'UI_CHECKOUT_COMMIT');
  assert.equal(scope.schemaVersion, 'archive-ci-scope-v2', 'UI_SCOPE_SCHEMA');
  assert.equal(scope.headSha, checkoutCommit, 'UI_SCOPE_HEAD');
  assert(scope.changedFiles === null || (Array.isArray(scope.changedFiles) && scope.changedFiles.every(relativePath)), 'UI_CHANGED_FILES');
  const triggers = new Set([MANIFEST_PATH, CHECKER_PATH, TEST_PATH, WORKFLOW_PATH, 'archive/engine.html',
    FONT_STYLESHEET, FONT_LICENSE]);
  for (const item of manifest.items) { triggers.add(item.sourcePath); triggers.add(item.assetPath); }
  const repaired = manifest.items.find(item => item.key === 'E006-Q3');
  triggers.add(repaired.assetPath.replace('-v3.svg', '-v2.svg'));
  const matchedPaths = (scope.changedFiles || []).filter(file => triggers.has(file) || file.startsWith(FONT_DIR)).sort();
  const required = scope.eventName === 'workflow_dispatch' || scope.changedFiles === null || matchedPaths.length > 0;
  return { schemaVersion: 'archive-reviewed-problem-renderer-ui-plan-v1', checkoutCommit, required, expectedCases: 6,
    reason: scope.eventName === 'workflow_dispatch' ? 'EXPLICIT_DISPATCH' : scope.changedFiles === null ? 'UNKNOWN_DIFF_FAIL_CLOSED' : required ? 'EXACT_TARGET_OR_CHECKER_CHANGED' : 'TARGETS_UNCHANGED',
    matchedPaths, triggerPaths: [...triggers].sort() };
}

function createGitReader(root, expectedCommit = '') {
  root = path.resolve(root);
  const git = args => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 30000 });
  const commit = git(['rev-parse', '--verify', 'HEAD']).trim();
  assert(SHA1.test(commit), 'UI_CHECKOUT_COMMIT');
  if (expectedCommit) assert.equal(commit, expectedCommit, 'UI_EVENT_HEAD_MISMATCH');
  const tree = new Map(git(['ls-tree', '-r', '-z', commit]).split('\0').filter(Boolean).map(row => {
    const tab = row.indexOf('\t'), [mode, type, blob] = row.slice(0, tab).split(' ');
    return [row.slice(tab + 1), { mode, type, blob }];
  }));
  // The student page fetches data/question_metadata.json. Git tracks that metadata as per-exam shards
  // (archive/data/question-metadata/v1/); the one file is their assembly at this exact commit, built from
  // git objects (never from the mutable working tree), so it is as immutable as any tracked file.
  const METADATA_FILE = 'archive/data/question_metadata.json';
  let assembledMetadata = null;
  const readAssembledMetadata = () => {
    if (!assembledMetadata) {
      assembledMetadata = execFileSync(process.execPath, ['--input-type=module', '-e',
        "import { pathToFileURL } from 'node:url'; import path from 'node:path';" +
        "const { questionMetadataBytesAt } = await import(pathToFileURL(path.join(process.argv[1], 'archive/tools/meta-foundation/question-metadata-format.mjs')).href);" +
        'process.stdout.write(questionMetadataBytesAt(process.argv[1], process.argv[2]));', root, commit],
      { maxBuffer: 512 * 1024 * 1024, timeout: 120000 });
    }
    return assembledMetadata;
  };
  const read = rel => {
    assert(relativePath(rel), 'UI_UNSAFE_PATH');
    if (rel === METADATA_FILE && !tree.has(rel) && [...tree.keys()].some(file => file.startsWith('archive/data/question-metadata/v1/'))) return readAssembledMetadata();
    const entry = tree.get(rel);
    assert(entry && entry.type === 'blob' && ['100644', '100755'].includes(entry.mode), 'UI_TRACKED_FILE_REQUIRED');
    const full = path.join(root, rel);
    assert(fs.lstatSync(full).isFile(), 'UI_REGULAR_FILE_REQUIRED');
    const bytes = fs.readFileSync(full);
    assert.equal(gitBlob(bytes), entry.blob, 'UI_CHECKOUT_BYTES_DRIFT');
    return bytes;
  };
  const ref = (rel, bytes = read(rel)) => ({ commit, path: rel, gitBlobSha1: gitBlob(bytes), sha256: sha256(bytes), bytes: bytes.length });
  return { root, commit, read, ref };
}

function loadQuestions(bytes) {
  const sandbox = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), sandbox, { timeout: 1500, filename: 'reviewed-source.js', contextCodeGeneration: { strings: false, wasm: false } });
  const bank = sandbox.window.questionBank ?? sandbox.questionBank ?? sandbox.window.examData?.questions ?? sandbox.examData?.questions;
  assert(Array.isArray(bank), 'UI_BANK_REQUIRED');
  return bank;
}

function preflight(reader, manifest) {
  validateManifest(manifest);
  const identityBytes = reader.read(IDENTITY_PATH);
  const identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_IDENTITY_RECORDS');
  const banks = new Map();
  const items = manifest.items.map(item => {
    if (!banks.has(item.sourcePath)) {
      const bytes = reader.read(item.sourcePath);
      banks.set(item.sourcePath, { bytes, questions: loadQuestions(bytes) });
    }
    const { bytes, questions } = banks.get(item.sourcePath);
    const question = questions[item.sourceOrdinal - 1];
    assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_QUESTION_ORDINAL_MISMATCH');
    const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
    assert.equal(matched.length, 1, 'UI_UNIQUE_IDENTITY_RECORD');
    assert.equal(matched[0].questionUid, item.questionUid, 'UI_IDENTITY_UID_MISMATCH');
    assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_PROBLEM_PAYLOAD_DRIFT');
    assert.equal(question.image, item.assetPath.slice('archive/'.length), 'UI_IMAGE_POINTER_MISMATCH');
    assert.equal(sha256(stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag })), item.presentationSha256, 'UI_PRESENTATION_DRIFT');
    const asset = reader.read(item.assetPath);
    assert.equal(sha256(asset), item.assetSha256, 'UI_REVIEWED_ASSET_DRIFT');
    return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
      problemPayloadSha256: item.problemPayloadSha256, presentationSha256: item.presentationSha256,
      sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), items };
}

const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

function createStudentRouteLifecycle(failures) {
  const pending = new Set(), errors = [];
  return {
    wrap(handler) {
      return route => {
        // Own rejection handling before Playwright's event callback receives it.
        // Recorded failures are rethrown at teardown, never converted to PASS.
        const task = Promise.resolve().then(() => handler(route));
        const settled = task.then(() => {}, error => {
          errors.push(error);
          failures.push({ code: 'UI_ROUTE_HANDLER_FAILED', requestSha256: sha256(route.request().url()),
            errorMessageSha256: sha256(typeof error?.message === 'string' ? error.message : '') });
        });
        pending.add(settled);
        settled.then(() => pending.delete(settled));
        return settled;
      };
    },
    async drain() {
      // A running handler can cause another request; include that later work.
      while (pending.size) await Promise.all([...pending]);
    },
    assertSettled() {
      assert.equal(pending.size, 0, 'UI_ROUTE_WORK_UNSETTLED');
      if (errors.length) throw errors[0];
    }
  };
}

async function serveStudentFont(route, url, fontPath, { declaredFonts, fontRefs, fontWeights, studentFontResources, fontResources, failures }) {
  const stylesheet = fontPath === FONT_STYLESHEET;
  const fontObservation = { kind: stylesheet ? 'STYLESHEET' : 'FONT', urlSha256: sha256(url.href), stage: 'FETCH' };
  let fulfillmentAttempted = false;
  try {
    assert(stylesheet || declaredFonts.has(fontPath), 'UI_FONT_NOT_DECLARED');
    const response = await route.fetch({ timeout: 15000, maxRedirects: 0 });
    const contentType = response.headers()['content-type'] || '', mediaType = contentType.split(';')[0].trim().toLowerCase();
    Object.assign(fontObservation, { httpStatus: response.status(), responseUrlSha256: sha256(response.url()), mime: mediaType, stage: 'HTTP_STATUS' });
    assert.equal(response.status(), 200, 'UI_FONT_HTTP_STATUS');
    fontObservation.stage = 'RESPONSE_URL';
    assert.equal(response.url(), url.href, 'UI_FONT_REDIRECT');
    fontObservation.stage = 'MIME';
    assert.equal(mediaType, stylesheet ? 'text/css' : 'font/woff2', 'UI_FONT_MIME');
    fontObservation.stage = 'BODY_READ';
    const bytes = await response.body();
    Object.assign(fontObservation, { bytes: bytes.length, responseSha256: sha256(bytes), stage: 'BODY_SIZE' });
    assert(bytes.length > 0 && bytes.length <= 2 * 1024 * 1024, 'UI_FONT_BODY_SIZE');
    fontObservation.stage = 'BODY_HASH';
    const ref = fontRefs.get(fontPath);
    assert.equal(fontObservation.responseSha256, ref.sha256, 'UI_FONT_BYTES_DRIFT');
    fontObservation.stage = 'CSS_DECLARATIONS';
    if (stylesheet) for (const file of declaredStudentFonts(bytes.toString('utf8')).keys()) declaredFonts.add(file);
    const resourceId = sha256(stable({ path: fontPath, responseSha256: ref.sha256, mime: contentType }));
    fontObservation.stage = 'FULFILL';
    fulfillmentAttempted = true;
    await route.fulfill({ response });
    studentFontResources.set(resourceId, { resourceId, kind: fontObservation.kind, ...ref, mime: contentType,
      status: response.status(), weight: fontWeights.get(fontPath) ?? null });
    fontResources.set(fontPath, resourceId);
  } catch (error) {
    failures.push(fontFailureDiagnostic(fontObservation, error));
    // Once fulfillment has begun, another abort would attempt to handle the
    // same route twice. Preserve the fulfillment error for a technical FAIL.
    if (!fulfillmentAttempted) {
      try { await route.abort('failed'); }
      catch (abortError) {
        failures.push(fontFailureDiagnostic({ ...fontObservation, stage: 'ABORT' }, abortError));
        throw new AggregateError([error, abortError], 'UI_ROUTE_ABORT_FAILED');
      }
    }
    throw error;
  }
}

async function closeStudentContext(page, context, verifySettled = () => {}, routeLifecycle = null, priorFailure = null) {
  const cleanupErrors = [];
  try {
    // Drain owned work before unrouteAll changes interception patterns. In the
    // pinned Playwright version, unrouting with multiple handlers still active
    // can release a later route when the first handler finishes.
    if (routeLifecycle) {
      await routeLifecycle.drain();
      // A failed settlement can leave Playwright's handled promise unresolved.
      // Preserve that failure and close the context without waiting on unroute.
      routeLifecycle.assertSettled();
    }
    if (page) await page.unrouteAll({ behavior: 'wait' });
    if (routeLifecycle) {
      await routeLifecycle.drain();
      routeLifecycle.assertSettled();
    }
    verifySettled();
  } catch (error) {
    cleanupErrors.push(error);
  }
  try { await context.close(); }
  catch (error) { cleanupErrors.push(error); }
  if (!cleanupErrors.length) return;
  const errors = [...new Set(priorFailure ? [priorFailure, ...cleanupErrors] : cleanupErrors)];
  if (errors.length === 1) throw errors[0];
  throw new AggregateError(errors, priorFailure?.message || 'UI_CONTEXT_CLEANUP_FAILED', { cause: errors[0] });
}

async function inspectStudentUi({ root, out, expectedCommit, executablePath }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), ...inputs,
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertScreenshotInventory(results, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
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
      const routeLifecycle = createStudentRouteLifecycle(failures);
      try {
        page = await context.newPage();
        page.setDefaultTimeout(10000);
        page.on('pageerror', error => pageErrors.push({ messageSha256: sha256(error.message) }));
        page.on('requestfailed', request => requestFailures.push({ urlSha256: sha256(request.url()), errorSha256: sha256(request.failure()?.errorText || '') }));
        await page.route('**/*', routeLifecycle.wrap(async route => {
          const url = new URL(route.request().url());
          const fontPath = studentFontResourcePath(url.href, origin, fontRefs);
          if (fontPath) {
            return serveStudentFont(route, url, fontPath, fontState);
          }
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
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=exam&fit=screen&studentReview=1`;
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
              face.status === 'loaded' && face.family.replace(/["']/g, '') === family &&
              face.weight === String(weight) && face.style === 'normal'), checked: document.fonts.check(`${weight} 12px "${family}"`, '한글 ABC 123') });
          }
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { status: document.fonts.status, family, weights,
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content')].map(node => getComputedStyle(node).fontFamily))] };
        }, FONT_FAMILY);
        assert.equal(fontReadiness.status, 'loaded', 'UI_DOCUMENT_FONTS_READY');
        assert(fontReadiness.weights.every(row => row.allLoaded && row.checked), 'UI_STUDENT_FONT_NOT_LOADED');
        assert(fontReadiness.problemFontFamilies.length > 0 && fontReadiness.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_STUDENT_FONT_NOT_APPLIED');
        // Resource evidence is recorded when Playwright's fulfillment settles.
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
        assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
        assert(technical.pages > 0 && technical.imagesComplete, 'UI_RENDERED_IMAGES');
        assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
        assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
        assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
        assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const capture = await captureProblemTiles(page, target, path.join(out, screenshotPath));
          const geometry = await target.evaluate(image => {
            const box = image.closest('.q-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth > 0 && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
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
        await closeStudentContext(page, context, () => {
          // Inspect real late failures after route settlement and before teardown.
          // If the case already failed, retain that original failure instead.
          if (casesCompleted) assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
        }, routeLifecycle, caseFailure);
      }
    }
    assert.equal(results.length, manifest.expectedCases, 'UI_ALL_SIX_REQUIRED');
    assert.equal(new Set(results.map(row => `${row.key}:${row.viewport.name}`)).size, 6, 'UI_UNIQUE_SIX_REQUIRED');
    assertScreenshotInventory(results, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, inputs.identityRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
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
  const args = process.argv.slice(2), get = flag => { const index = args.indexOf(flag); return index < 0 ? '' : args[index + 1]; };
  const root = process.cwd(), expectedCommit = process.env.GITHUB_SHA || '';
  if (args.includes('--plan')) {
    const scopePath = get('--scope'), output = get('--output');
    assert(scopePath && output, 'UI_PLAN_ARGUMENTS');
    const reader = createGitReader(root, expectedCommit), manifest = JSON.parse(reader.read(MANIFEST_PATH));
    const scopeModule = await import('./ci/archive-ci-scope.mjs');
    const scope = scopeModule.readScope(scopePath, root);
    const plan = planRequired(manifest, scope, reader.commit);
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(plan, null, 2) + '\n');
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `required=${plan.required}\n`);
    console.log(JSON.stringify(plan));
    return;
  }
  const out = get('--output');
  assert(out, 'UI_OUTPUT_REQUIRED');
  assert(!path.resolve(out).startsWith(path.resolve(root) + path.sep), 'UI_OUTPUT_OUTSIDE_CHECKOUT_REQUIRED');
  const proof = await inspectStudentUi({ root, out: path.resolve(out), expectedCommit, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, cases: proof.results.length, checkoutCommit: proof.checkoutCommit }));
}

module.exports = { MANIFEST_PATH, CHECKER_PATH, TEST_PATH, WORKFLOW_PATH, IDENTITY_PATH, SCHEMA, stable, sha256, gitBlob, validateManifest, planRequired, createGitReader, preflight,
  FONT_DIR, FONT_STYLESHEET, FONT_LICENSE, studentFontResourcePath, declaredStudentFonts, checkedStudentFontRefs, fontFailureDiagnostic,
  createStudentRouteLifecycle, serveStudentFont, closeStudentContext,
  problemContentClip, planProblemScroll, assertProblemCapture, captureCompleteProblem,
  TILE_SCHEMA, TILE_OVERLAP, TILE_LIMIT, planProblemTiles, planProblemTileScroll, assertTileCoverage, assertProblemTileCapture, captureProblemTiles,
  readScreenshotArtifacts, assertScreenshotInventory };
if (require.main === module) main().catch(error => {
  const args = process.argv.slice(2), index = args.indexOf('--output');
  if (!args.includes('--plan') && index >= 0 && args[index + 1]) {
    const out = path.resolve(args[index + 1]);
    if (out !== process.cwd() && !out.startsWith(process.cwd() + path.sep)) {
      fs.mkdirSync(out, { recursive: true });
      const file = path.join(out, 'technical-proof.json');
      if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL',
        failureCode: /^UI_[A-Z0-9_]+$/.test(error.message) ? error.message : 'UI_PREFLIGHT_FAILED', results: [] }, null, 2) + '\n');
    }
  }
  console.error('UI_PROBLEM_RENDERER_VERIFICATION_FAILED'); process.exitCode = 1;
});
