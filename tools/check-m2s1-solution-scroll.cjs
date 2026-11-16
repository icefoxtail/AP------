'use strict';
// Separate solution capture. The existing problem capture and its rejection guards are unchanged.
const assert=require('node:assert/strict'),path=require('node:path');
const H=require('./check-reviewed-problem-renderer-browser.cjs');
const {problemContentClip,planProblemTiles,planProblemTileScroll,assertTileCoverage,TILE_OVERLAP,TILE_LIMIT}=H;
const TILE_SCHEMA='archive-solution-scroll-coverage-v1';
const overlaps=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
const checkedRect=r=>{assert(r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]))&&r.width>0&&r.height>0,'UI_CAPTURE_RECT');return r;};
function problemTileClip(frame,tile){const full=problemContentClip(frame),s=tile.relativeInterval;assert(Array.isArray(s)&&s.length===2&&s.every(Number.isFinite)&&s[0]>=0&&s[1]<=full.height&&s[1]>s[0],'UI_SCROLL_TILE_RANGE');return checkedRect({x:full.x,y:full.y+s[0],width:full.width,height:s[1]-s[0]});}
async function measureSolutionCapture(image) {
  const box = image.closest('.sol-box');
  const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
  const visible = element => {
    const css = getComputedStyle(element), r = element.getBoundingClientRect();
    return css.display !== 'none' && css.visibility !== 'hidden' && css.visibility !== 'collapse' && Number(css.opacity) !== 0 && r.width > 0 && r.height > 0;
  };
  const children = [];
  for (const child of box.childNodes) {
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
  const completeChildrenVisible = [...box.children].every(child =>
    (!child.textContent.trim() && !child.querySelector('img,svg,math,mjx-container')) || visible(child));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(box.outerHTML));
  return { question: rect(box), children, image: rect(image), viewport: { width: innerWidth, height: innerHeight },
    scroll: { x: scrollX, y: scrollY }, obstructions, feedbackIdle: !panel || panel.hidden || !visible(panel),
    readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
    mode: typeof AppState === 'undefined' ? null : AppState.mode,
    sourceFragments: [...document.querySelectorAll('#print-area .sol-box')].filter(x=>x.dataset.sourceRef===box.dataset.sourceRef).length,
    solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber: box.querySelector('.q-num')?.textContent?.trim(),
    mandatoryChildrenVisible: visible(box) && completeChildrenVisible && !!box.querySelector('.q-num') && visible(box.querySelector('.q-num')) &&
      !!box.querySelector('[data-semantic-content]') && visible(box.querySelector('[data-semantic-content]')) &&
      ['.sol-ans','.sol-exp','.sol-image-caption'].every(s=>box.querySelectorAll(s).length===1 && visible(box.querySelector(s))) && visible(image),
    domSha256: [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('') };
}

function inspectCaptureHits(image, clip) {
  const box = image.closest('.sol-box'); let samples = 0, outsideQuestion = 0;
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

function assertSolutionTileCapture(frame, tile) {
  const clip = problemTileClip(frame, tile), viewport = frame.viewport;
  assert(frame.feedbackIdle === true, 'UI_RENDER_FEEDBACK_NOT_IDLE');
  assert(frame.readiness === 'RENDER_READY' && frame.mode === 'sol' && frame.solutionNodes > 0 && frame.sourceFragments === 1, 'UI_CAPTURE_RENDER_STATE');
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

async function captureSolutionTiles(page, target, file) {
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measureSolutionCapture);
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
      scrollOperations++; frame = await target.evaluate(measureSolutionCapture);
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentProblemFrame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertSolutionTileCapture(frame, tile), hits = await target.evaluate(inspectCaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await target.evaluate(measureSolutionCapture);
    assert.deepEqual(assertSolutionTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
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


module.exports={captureSolutionTiles,assertSolutionTileCapture,measureSolutionCapture};
