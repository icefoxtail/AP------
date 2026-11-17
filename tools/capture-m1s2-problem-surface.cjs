'use strict';
// Read the production equal-slot wrapper without changing it. All geometry,
// tile coverage, obstruction, hit-test, DOM and viewport guards stay unchanged.
const assert=require('node:assert/strict'),path=require('node:path');
const H=require('./check-reviewed-problem-renderer-browser.cjs');
const{problemContentClip,planProblemTiles,planProblemTileScroll,assertProblemTileCapture,assertTileCoverage,TILE_SCHEMA,TILE_LIMIT,TILE_OVERLAP}=H;
const checkedRect=rect=>{assert(rect&&['x','y','width','height'].every(key=>Number.isFinite(rect[key]))&&rect.width>0&&rect.height>0,'UI_CAPTURE_RECT');return rect;};
function assertSurfaceTopology(s){
 assert(s&&typeof s==='object'&&!Array.isArray(s),'UI_NATIVE_SURFACE_REQUIRED');
 assert.deepEqual(Object.keys(s).sort(),['schemaVersion','kind','equalSlot','wrapperCount','outerElementCount','nonemptyOutsideNodes','numberCount','contentCount','nestedQuestionCount','targetInsideContainer','semanticChildCount'].sort(),'UI_NATIVE_SURFACE_KEYS');
 assert(s.schemaVersion==='archive-m1s2-native-problem-surface-v1'&&['DIRECT_CHILDREN','AP_EQUAL_SLOT_CONTENT'].includes(s.kind),'UI_NATIVE_SURFACE_KIND');
 assert(['wrapperCount','outerElementCount','nonemptyOutsideNodes','numberCount','contentCount','nestedQuestionCount','semanticChildCount'].every(k=>Number.isSafeInteger(s[k])&&s[k]>=0),'UI_NATIVE_SURFACE_COUNTS');
 assert(s.numberCount===1&&s.contentCount===1&&s.nestedQuestionCount===0&&s.targetInsideContainer===true&&s.semanticChildCount>=3,'UI_NATIVE_SURFACE_COMPLETENESS');
 if(s.kind==='AP_EQUAL_SLOT_CONTENT')assert(s.equalSlot===true&&s.wrapperCount===1&&s.outerElementCount===1&&s.nonemptyOutsideNodes===0,'UI_NATIVE_SLOT_TOPOLOGY');
 else assert(s.equalSlot===false&&s.wrapperCount===0&&s.nonemptyOutsideNodes===0&&s.outerElementCount>=3,'UI_NATIVE_DIRECT_TOPOLOGY');
 return s;
}

async function measureM1ProblemCapture(image) {
  const box = image.closest('.q-box');
  const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
  const visible = element => {
    const css = getComputedStyle(element), r = element.getBoundingClientRect();
    return css.display !== 'none' && css.visibility !== 'hidden' && css.visibility !== 'collapse' && Number(css.opacity) !== 0 && r.width > 0 && r.height > 0;
  };
  const wrappers=[...box.children].filter(child=>child.matches('.ap-slot-content'));
  const equalSlot=box.classList.contains('ap-equal-slot');
  const container=equalSlot&&wrappers.length===1?wrappers[0]:box;
  const nonempty=node=>node.nodeType===Node.ELEMENT_NODE||node.nodeType===Node.TEXT_NODE&&!!node.textContent.trim();
  const outside=equalSlot?[...box.childNodes].filter(node=>node!==container&&nonempty(node)):[];
  const surface={schemaVersion:'archive-m1s2-native-problem-surface-v1',kind:equalSlot?'AP_EQUAL_SLOT_CONTENT':'DIRECT_CHILDREN',
    equalSlot,wrapperCount:wrappers.length,outerElementCount:box.children.length,nonemptyOutsideNodes:outside.length,
    numberCount:container.querySelectorAll('.q-num').length,contentCount:container.querySelectorAll('.q-content').length,
    nestedQuestionCount:box.querySelectorAll('.q-box').length,targetInsideContainer:container.contains(image)};
  const children = [];
  for (const child of container.childNodes) {
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
  const completeChildrenVisible = [...container.children].every(child =>
    (!child.textContent.trim() && !child.querySelector('img,svg,math,mjx-container')) || visible(child));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(box.outerHTML));
  surface.semanticChildCount=children.length;
  return { surface, question: rect(box), children, image: rect(image), viewport: { width: innerWidth, height: innerHeight },
    scroll: { x: scrollX, y: scrollY }, obstructions, feedbackIdle: !panel || panel.hidden || !visible(panel),
    readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
    solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber: box.querySelector('.q-num')?.textContent?.trim(),
    mandatoryChildrenVisible: visible(box) && visible(container) && completeChildrenVisible && !!box.querySelector('.q-num') && visible(box.querySelector('.q-num')) &&
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

function documentM1ProblemFrame(frame) {
  assertSurfaceTopology(frame.surface);
  assert(frame.scroll && Number.isFinite(frame.scroll.x) && Number.isFinite(frame.scroll.y), 'UI_CAPTURE_SCROLL');
  const documentRect = rect => { checkedRect(rect); return { x: rect.x + frame.scroll.x, y: rect.y + frame.scroll.y,
    width: rect.width, height: rect.height }; };
  return { surface:frame.surface, question: documentRect(frame.question), content: documentRect(problemContentClip(frame)),
    children: frame.children.map(documentRect), image: documentRect(frame.image), viewport: frame.viewport,
    questionNumber: frame.questionNumber };
}

async function captureM1ProblemTiles(page, target, file) {
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measureM1ProblemCapture);
  assert(frame.mandatoryChildrenVisible === true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  const original = documentM1ProblemFrame(frame), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planProblemTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planProblemTileScroll(frame, tile);
      if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await target.evaluate(measureM1ProblemCapture);
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentM1ProblemFrame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertProblemTileCapture(frame, tile), hits = await target.evaluate(inspectCaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await target.evaluate(measureM1ProblemCapture);
    assert.deepEqual(assertProblemTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentM1ProblemFrame(after), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const afterHits = await target.evaluate(inspectCaptureHits, clip);
    assert(afterHits.samples > 0 && afterHits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    tiles.push({ ...tile, filename: path.basename(tileFile), clip, scroll: after.scroll, scrollOperations,
      feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: hits.samples + afterHits.samples,
      foreignContentHits: 0, domSha256: originalDomSha256 });
    frame = after;
  }
  return { surface:original.surface, capture:{ schemaVersion: TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: TILE_LIMIT,
    overlapCssPixels: TILE_OVERLAP, tileCount: tiles.length, content: original.content, question: original.question,
    viewport: original.viewport, visibleChildren: original.children.length, coverage: assertTileCoverage(original.content.height, tiles),
    tiles, scrollBefore, scrollAfter: frame.scroll, scrollOperations: tiles.reduce((sum, row) => sum + row.scrollOperations, 0),
    domSha256: originalDomSha256, feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0,
    compositeImageCreated: false } };
}

module.exports={assertSurfaceTopology,measureM1ProblemCapture,documentM1ProblemFrame,captureM1ProblemTiles};
