'use strict';
// One immutable, image-embedded-choice problem has two outer DOM children.
// Measure its three actual, non-overlapping semantic elements without changing
// the DOM, inventing rectangles, or changing the shared M1 surface contract.
const assert = require('node:assert/strict'), path = require('node:path');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const { stable, sha256, problemContentClip, planProblemTiles, planProblemTileScroll,
  assertProblemTileCapture, assertTileCoverage, TILE_SCHEMA, TILE_LIMIT, TILE_OVERLAP } = H;
const UID = 'qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569';
const SOURCE = Object.freeze({
  path: 'archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js',
  gitBlobSha1: 'c8945961f52f7efca83d66ea045d070e74718de6',
  sha256: 'c1d8ce4c3de70c67d7a3ecf02031fd48327103785fec40505e1576043625618a', bytes: 44656
});
const ASSET = Object.freeze({
  path: 'archive/assets/images/21_팔마중_1학기_기말_중2_수학/q15-problem-visual-v2-source-repair-r1.svg',
  gitBlobSha1: 'a132105374964cd92b36c935fdd0aa97666acfe5',
  sha256: '909e5d8728f7035e2eabf89671372e18d9d4c0c72a7bd43f09feb6cf1462c4af', bytes: 12366
});
const WHOLE = '2db11d3dcd68f9aaf35c5d68e69d30f2e550ed3b42b956797fc81b41a62365fb';
const BROWSER_SCOPE = Object.freeze({ ordinal: 15, assetPath: ASSET.path, embeddedChoiceCount: 5 });
const SCHEMA = 'archive-m2s1-q15-embedded-choice-surface-v1';
const checkedRect = rect => {
  assert(rect && ['x', 'y', 'width', 'height'].every(k => Number.isFinite(rect[k])) && rect.width > 0 && rect.height > 0, 'UI_CAPTURE_RECT');
  return rect;
};
function assertQ15Binding(item) {
  assert(item && item.key === 'E045-Q15' && item.questionUid === UID && item.sourceOrdinal === 15 && item.questionSha256 === WHOLE, 'UI_Q15_SCOPE');
  for (const [name, expected] of [['sourceRef', SOURCE], ['assetRef', ASSET]]) {
    assert(item[name], 'UI_Q15_SCOPE');
    for (const key of Object.keys(expected)) assert.equal(item[name][key], expected[key], 'UI_Q15_SCOPE');
  }
  return true;
}
function assertQ15Preflight(question, item) {
  assert(question?.choicesEmbeddedInImage === true && Array.isArray(question.choices) && question.choices.length === 5, 'UI_Q15_EMBEDDED_CHOICES');
  assert.equal(sha256(stable(question)), WHOLE, 'UI_Q15_WHOLE_QUESTION');
  return assertQ15Binding({ ...item,
    sourceRef: { path: item.sourcePath, gitBlobSha1: item.sourceGitBlobSha1, sha256: item.sourceSha256, bytes: item.sourceBytes },
    assetRef: { path: item.assetPath, gitBlobSha1: item.assetGitBlobSha1, sha256: item.assetSha256, bytes: item.assetBytes }
  });
}
function assertQ15Topology(s) {
  assert(s && typeof s === 'object' && !Array.isArray(s), 'UI_Q15_SURFACE_REQUIRED');
  assert.deepEqual(Object.keys(s).sort(), ['schemaVersion', 'kind', 'sourceOrdinal', 'outerElementCount', 'numberCount', 'contentCount',
    'paragraphCount', 'statementCount', 'imageParagraphCount', 'imageCount', 'semanticChildCount', 'nonemptyOutsideNodes',
    'nestedQuestionCount', 'targetInsideContainer', 'embeddedChoiceCount', 'statementTextNodes', 'statementMathAtoms'].sort(), 'UI_Q15_SURFACE_KEYS');
  assert(s.schemaVersion === SCHEMA && s.kind === 'DIRECT_NUMBER_WITH_STATEMENT_AND_IMAGE_PARAGRAPHS' && s.sourceOrdinal === 15,
    'UI_Q15_SURFACE_SCOPE');
  assert(s.outerElementCount === 2 && s.numberCount === 1 && s.contentCount === 1 && s.paragraphCount === 2 &&
    s.statementCount === 1 && s.imageParagraphCount === 1 && s.imageCount === 1 && s.semanticChildCount === 3 &&
    s.nonemptyOutsideNodes === 0 && s.nestedQuestionCount === 0 && s.targetInsideContainer === true && s.embeddedChoiceCount === 5,
    'UI_Q15_SURFACE_COMPLETENESS');
  assert([s.statementTextNodes, s.statementMathAtoms].every(n => Number.isSafeInteger(n) && n >= 0) &&
    s.statementTextNodes + s.statementMathAtoms > 0, 'UI_Q15_STATEMENT_REQUIRED');
  return s;
}

// Browser-only reader. All accepted elements and every nonempty statement text
// range are measured. A generated visible MathJax container is one math atom;
// its hidden assistive MathML is not a second visible copy of the statement.
async function measureQ15Capture(image, scope) {
  const need = (value, code) => { if (!value) throw new Error(code); };
  need(scope && scope.ordinal === 15 && scope.embeddedChoiceCount === 5 && typeof scope.assetPath === 'string', 'UI_Q15_SCOPE');
  const box = image.closest('.q-box');
  need(box && !box.classList.contains('ap-equal-slot') && box.querySelectorAll('.ap-slot-content').length === 0, 'UI_Q15_DIRECT_TOPOLOGY');
  const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
  const positive = r => r && ['x', 'y', 'width', 'height'].every(k => Number.isFinite(r[k])) && r.width > 0 && r.height > 0;
  const inside = (r, owner) => positive(r) && positive(owner) && r.x >= owner.x - 1 && r.y >= owner.y - 1 &&
    r.x + r.width <= owner.x + owner.width + 1 && r.y + r.height <= owner.y + owner.height + 1;
  const visible = element => {
    const css = getComputedStyle(element), r = rect(element);
    return css.display !== 'none' && css.visibility !== 'hidden' && css.visibility !== 'collapse' && Number(css.opacity) !== 0 && positive(r);
  };
  const visibleWithin = element => {
    for (let node = element; node && box.contains(node); node = node.parentElement) if (!visible(node)) return false;
    return true;
  };
  const exactChildren = (parent, expected) => {
    need(parent.children.length === expected.length && expected.every((node, i) => parent.children[i] === node), 'UI_Q15_CHILD_ORDER');
    for (const node of parent.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) need(expected.includes(node), 'UI_Q15_EXTRA_ELEMENT');
      else if (node.nodeType === Node.TEXT_NODE) need(!node.textContent.trim(), 'UI_Q15_OUTSIDE_TEXT');
      else need(node.nodeType === Node.COMMENT_NODE, 'UI_Q15_EXTRA_NODE');
    }
  };
  need(box.children.length === 2, 'UI_Q15_OUTER_TWO');
  const [number, content] = box.children;
  need(number.matches('.q-num') && content.matches('.q-content') &&
    box.querySelectorAll('.q-num').length === 1 && box.querySelectorAll('.q-content').length === 1 &&
    box.querySelectorAll('.q-box').length === 0, 'UI_Q15_ROLE_TOPOLOGY');
  exactChildren(box, [number, content]);
  need(number.children.length === 0 && number.textContent.trim() === String(scope.ordinal) + '.', 'UI_Q15_VISIBLE_ORDINAL');
  need(content.children.length === 2, 'UI_Q15_PARAGRAPHS_TWO');
  const [statement, figure] = content.children;
  need(statement.tagName === 'P' && figure.tagName === 'P', 'UI_Q15_PARAGRAPH_ROLES');
  exactChildren(content, [statement, figure]);
  need(figure.children.length === 1 && figure.children[0] === image && image.tagName === 'IMG' &&
    box.querySelectorAll('img').length === 1 && !image.hasAttribute('srcset'), 'UI_Q15_IMAGE_ROLE');
  exactChildren(figure, [image]);
  const imageUrl = new URL(image.currentSrc || image.src, document.baseURI);
  const decodedPath = decodeURIComponent(imageUrl.pathname);
  need(!imageUrl.search && !imageUrl.hash && [scope.assetPath.replace(/^archive/, ''),
    '/exams/images/' + scope.assetPath.slice('archive/assets/images/'.length)].includes(decodedPath), 'UI_Q15_IMAGE_PATH');
  need(image.complete && image.naturalWidth > 0 && image.naturalHeight > 0, 'UI_Q15_IMAGE_READY');
  const question = rect(box), contentRect = rect(content), statementRect = rect(statement), figureRect = rect(figure);
  for (const element of [box, number, content, statement, figure, image]) need(visibleWithin(element), 'UI_Q15_REQUIRED_ELEMENT_HIDDEN');
  need([number, content, statement, figure, image].every(element => inside(rect(element), question)) &&
    inside(statementRect, contentRect) && inside(figureRect, contentRect) && inside(rect(image), figureRect), 'UI_Q15_ROLE_CLIPPED');
  let statementTextNodes = 0, statementMathAtoms = 0;
  const walk = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return;
      need(visibleWithin(node.parentElement), 'UI_Q15_STATEMENT_HIDDEN');
      const range = document.createRange(); range.selectNodeContents(node);
      const spans = [...range.getClientRects()].filter(positive);
      need(spans.length > 0 && spans.every(r => inside(r, statementRect) && inside(r, question)), 'UI_Q15_STATEMENT_RANGE');
      statementTextNodes++; return;
    }
    if (node.nodeType === Node.COMMENT_NODE) return;
    need(node.nodeType === Node.ELEMENT_NODE, 'UI_Q15_STATEMENT_NODE');
    if (node.tagName === 'MJX-CONTAINER') {
      need(visibleWithin(node) && inside(rect(node), statementRect) &&
        node.querySelectorAll('script,iframe,object,embed,foreignObject,img,mjx-merror,[data-mjx-error]').length === 0, 'UI_Q15_MATH_ATOM');
      statementMathAtoms++; return;
    }
    need(['SPAN', 'B', 'STRONG', 'I', 'EM', 'U', 'SUB', 'SUP', 'BR'].includes(node.tagName), 'UI_Q15_STATEMENT_ELEMENT');
    if (node.tagName === 'BR') { need(node.childNodes.length === 0, 'UI_Q15_BREAK_NODE'); return; }
    need(visibleWithin(node) && inside(rect(node), statementRect), 'UI_Q15_STATEMENT_HIDDEN');
    for (const child of node.childNodes) walk(child);
  };
  for (const node of statement.childNodes) walk(node);
  need(statementTextNodes + statementMathAtoms > 0, 'UI_Q15_STATEMENT_REQUIRED');
  const children = [rect(number), statementRect, figureRect];
  for (let i = 0; i < children.length; i++) for (let j = i + 1; j < children.length; j++) {
    const a = children[i], b = children[j];
    need(!(Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 &&
      Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1), 'UI_Q15_SEMANTIC_ROLES_OVERLAP');
  }
  const surface = { schemaVersion: 'archive-m2s1-q15-embedded-choice-surface-v1', kind: 'DIRECT_NUMBER_WITH_STATEMENT_AND_IMAGE_PARAGRAPHS',
    sourceOrdinal: scope.ordinal, outerElementCount: box.children.length, numberCount: 1, contentCount: 1,
    paragraphCount: content.children.length, statementCount: 1, imageParagraphCount: 1, imageCount: box.querySelectorAll('img').length,
    semanticChildCount: children.length, nonemptyOutsideNodes: 0, nestedQuestionCount: box.querySelectorAll('.q-box').length,
    targetInsideContainer: content.contains(image), embeddedChoiceCount: scope.embeddedChoiceCount, statementTextNodes, statementMathAtoms };
  const obstructions = [...document.querySelectorAll('body *')].filter(element => !box.contains(element) && !element.contains(box) &&
    ['fixed', 'sticky'].includes(getComputedStyle(element).position) && visible(element)).map(rect)
    .filter(r => r.x < innerWidth && r.x + r.width > 0 && r.y < innerHeight && r.y + r.height > 0);
  const panel = document.getElementById('ap-archive-render-feedback');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(box.outerHTML));
  return { surface, question, children, image: rect(image), viewport: { width: innerWidth, height: innerHeight },
    scroll: { x: scrollX, y: scrollY }, obstructions, feedbackIdle: !panel || panel.hidden || !visible(panel),
    readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
    solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber: number.textContent.trim(), mandatoryChildrenVisible: true,
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

function documentQ15Frame(frame) {
  assertQ15Topology(frame.surface);
  assert.equal(frame.mandatoryChildrenVisible, true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  assert(frame.scroll && Number.isFinite(frame.scroll.x) && Number.isFinite(frame.scroll.y), 'UI_CAPTURE_SCROLL');
  const documentRect = rect => { checkedRect(rect); return { x: rect.x + frame.scroll.x, y: rect.y + frame.scroll.y,
    width: rect.width, height: rect.height }; };
  return { surface: frame.surface, question: documentRect(frame.question), content: documentRect(problemContentClip(frame)),
    children: frame.children.map(documentRect), image: documentRect(frame.image), viewport: frame.viewport,
    questionNumber: frame.questionNumber };
}

// The shared Surface's scroll/capture loop and hit test are retained here with
// only the measured-frame callback changed to the closed Q15 semantic reader.
async function captureQ15Tiles(page, target, file, item) {
  assertQ15Binding(item);
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measureQ15Capture, BROWSER_SCOPE);
  assert(frame.mandatoryChildrenVisible === true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  const original = documentQ15Frame(frame), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planProblemTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planProblemTileScroll(frame, tile);
      if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await target.evaluate(measureQ15Capture, BROWSER_SCOPE);
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentQ15Frame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertProblemTileCapture(frame, tile), hits = await target.evaluate(inspectCaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await target.evaluate(measureQ15Capture, BROWSER_SCOPE);
    assert.deepEqual(assertProblemTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentQ15Frame(after), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const afterHits = await target.evaluate(inspectCaptureHits, clip);
    assert(afterHits.samples > 0 && afterHits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    tiles.push({ ...tile, filename: path.basename(tileFile), clip, scroll: after.scroll, scrollOperations,
      feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: hits.samples + afterHits.samples,
      foreignContentHits: 0, domSha256: originalDomSha256 });
    frame = after;
  }
  return { surface: original.surface, capture: { schemaVersion: TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: TILE_LIMIT,
    overlapCssPixels: TILE_OVERLAP, tileCount: tiles.length, content: original.content, question: original.question,
    viewport: original.viewport, visibleChildren: original.children.length, coverage: assertTileCoverage(original.content.height, tiles),
    tiles, scrollBefore, scrollAfter: frame.scroll, scrollOperations: tiles.reduce((sum, row) => sum + row.scrollOperations, 0),
    domSha256: originalDomSha256, feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0,
    compositeImageCreated: false } };
}

module.exports = { UID, BROWSER_SCOPE, assertQ15Binding, assertQ15Preflight, assertQ15Topology, measureQ15Capture, documentQ15Frame, captureQ15Tiles };
