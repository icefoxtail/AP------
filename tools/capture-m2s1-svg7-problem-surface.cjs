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
  // Exact output of the pinned engine's default archive-source cache revision
  // and archive-asset-base resolver; no alternate origin/path/query is allowed.
  const expectedImageUrl = 'https://img.wangjiedu.com/exams/images/' +
    scope.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/') + '?v=20261014.1';
  need(imageUrl.href === expectedImageUrl && (image.currentSrc || image.src) === expectedImageUrl &&
    image.src === expectedImageUrl, 'UI_Q15_IMAGE_PATH');
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

// E048 Q24 mobile has a real empty answer-box with height zero. Its content is
// measured as real text ranges, generated math atoms and the one pinned image.
// The empty box is recorded separately and never counted as a visible rectangle.
const Q24_UID = 'qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad';
const Q24_WHOLE = '6af32349e8c99b6a75b05aae09dec93eb95cf45b28399e1cfc5d897494440d7a';
const Q24_SOURCE = Object.freeze({path:'archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js',
  gitBlobSha1:'4a20adbce9e5a7f07744143cef611d453e454250',sha256:'bb0904139d63eee938b33add6a9b48e1129bfa7d7e9dd9d6939045f66c50f88b',bytes:40797});
const Q24_ASSET = Object.freeze({path:'archive/assets/images/21_금당중_1학기_중간_중2_기출/q24-problem-visual-v2-source-repair-r1.svg',
  gitBlobSha1:'e77c366e63ffa891cb53ccd3b8b334e4c541a57a',sha256:'2b6aa6539acbc4f713ef09d9c1968825b1138416dc953449bb0392209ea28ca0',bytes:3555});
const Q24_BROWSER_SCOPE = Object.freeze({ordinal:24,assetPath:Q24_ASSET.path,width:390,height:844,choices:0});
function assertQ24Binding(item,viewport){
  assert(item&&item.key==='E048-Q24'&&item.questionUid===Q24_UID&&item.sourceOrdinal===24&&item.questionSha256===Q24_WHOLE,'UI_Q24_SCOPE');
  assert(viewport&&viewport.name==='mobile'&&viewport.width===390&&viewport.height===844,'UI_Q24_VIEWPORT');
  for(const[name,expected]of[['sourceRef',Q24_SOURCE],['assetRef',Q24_ASSET]]){
    assert(item[name],'UI_Q24_SCOPE');for(const key of Object.keys(expected))assert.equal(item[name][key],expected[key],'UI_Q24_SCOPE');
  }
  return true;
}
function assertQ24Preflight(question,item){
  assert(Array.isArray(question?.choices)&&question.choices.length===0&&question.choicesEmbeddedInImage!==true&&
    question.sourcePayload?.choicesEmbeddedInImage!==true&&!question.image,'UI_Q24_SUBJECTIVE_SCOPE');
  assert.equal(sha256(stable(question)),Q24_WHOLE,'UI_Q24_WHOLE_QUESTION');
  return assertQ24Binding({...item,sourceRef:{path:item.sourcePath,gitBlobSha1:item.sourceGitBlobSha1,sha256:item.sourceSha256,bytes:item.sourceBytes},
    assetRef:{path:item.assetPath,gitBlobSha1:item.assetGitBlobSha1,sha256:item.assetSha256,bytes:item.assetBytes}},
    {name:'mobile',width:390,height:844});
}
function assertQ24Topology(s){
  assert(s&&typeof s==='object'&&!Array.isArray(s),'UI_Q24_SURFACE_REQUIRED');
  assert.deepEqual(Object.keys(s).sort(),['schemaVersion','kind','sourceOrdinal','viewportWidth','viewportHeight','outerElementCount','numberCount','contentCount',
    'answerBoxCount','answerBoxHeight','emptyAnswerBox','choicesCount','imageCount','semanticChildCount','contentTextNodes','contentTextRanges','contentMathAtoms',
    'contentImageAtoms','nonemptyOutsideNodes','nestedQuestionCount','targetInsideContainer'].sort(),'UI_Q24_SURFACE_KEYS');
  assert(s.schemaVersion==='archive-m2s1-q24-mobile-native-surface-v1'&&s.kind==='NUMBER_AND_ALL_CONTENT_ATOMS_WITH_EMPTY_ANSWER_BOX'&&
    s.sourceOrdinal===24&&s.viewportWidth===390&&s.viewportHeight===844,'UI_Q24_SURFACE_SCOPE');
  assert(s.outerElementCount===3&&s.numberCount===1&&s.contentCount===1&&s.answerBoxCount===1&&s.answerBoxHeight===0&&s.emptyAnswerBox===true&&
    s.choicesCount===0&&s.imageCount===1&&s.contentImageAtoms===1&&s.contentMathAtoms===3&&s.nonemptyOutsideNodes===0&&s.nestedQuestionCount===0&&s.targetInsideContainer===true,'UI_Q24_SURFACE_COMPLETENESS');
  assert([s.semanticChildCount,s.contentTextNodes,s.contentTextRanges,s.contentMathAtoms].every(n=>Number.isSafeInteger(n)&&n>=0)&&
    s.contentTextNodes>0&&s.contentTextRanges>=s.contentTextNodes&&s.semanticChildCount===1+s.contentTextRanges+s.contentMathAtoms+s.contentImageAtoms&&
    s.semanticChildCount>=3,'UI_Q24_CONTENT_ACCOUNTING');
  return s;
}

async function measureQ24Capture(image,scope){
  const need=(ok,code)=>{if(!ok)throw new Error(code);};
  need(scope&&scope.ordinal===24&&scope.width===390&&scope.height===844&&scope.choices===0&&typeof scope.assetPath==='string','UI_Q24_SCOPE');
  need(innerWidth===390&&innerHeight===844,'UI_Q24_VIEWPORT');
  const box=image.closest('.q-box');
  need(box&&!box.classList.contains('ap-equal-slot')&&box.querySelectorAll('.ap-slot-content').length===0,'UI_Q24_DIRECT_TOPOLOGY');
  const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
  const finite=r=>r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]));
  const positive=r=>finite(r)&&r.width>0&&r.height>0;
  const inside=(r,owner)=>positive(r)&&positive(owner)&&r.x>=owner.x-1&&r.y>=owner.y-1&&r.x+r.width<=owner.x+owner.width+1&&r.y+r.height<=owner.y+owner.height+1;
  const shown=e=>{const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&s.visibility!=='collapse'&&Number(s.opacity)!==0;};
  const visible=e=>shown(e)&&positive(rect(e));
  const visibleWithin=e=>{for(let n=e;n&&box.contains(n);n=n.parentElement)if(!visible(n))return false;return Boolean(e&&box.contains(e));};
  need(box.children.length===3,'UI_Q24_OUTER_THREE');
  const[number,content,answer]=box.children;
  need(number.matches('.q-num')&&content.matches('.q-content')&&answer.matches('.answer-box')&&
    box.querySelectorAll('.q-num').length===1&&box.querySelectorAll('.q-content').length===1&&box.querySelectorAll('.answer-box').length===1&&
    box.querySelectorAll('.q-box').length===0&&box.querySelectorAll('.choices,.choice-item').length===0,'UI_Q24_ROLE_TOPOLOGY');
  for(const node of box.childNodes){
    if(node.nodeType===Node.ELEMENT_NODE)need([number,content,answer].includes(node),'UI_Q24_EXTRA_ELEMENT');
    else if(node.nodeType===Node.TEXT_NODE)need(!node.textContent.trim(),'UI_Q24_OUTSIDE_TEXT');
    else need(node.nodeType===Node.COMMENT_NODE,'UI_Q24_EXTRA_NODE');
  }
  need(number.children.length===0&&number.textContent.trim()==='24.','UI_Q24_VISIBLE_ORDINAL');
  // These counts are from the byte-bound 106a failure observation, not inferred
  // from a screenshot. Every such node is still read and measured below.
  need(content.children.length===8&&[...content.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&Boolean(n.textContent.trim())).length===6,'UI_Q24_CONTENT_TOPOLOGY');
  need(content.contains(image)&&image.tagName==='IMG'&&box.querySelectorAll('img').length===1&&!image.hasAttribute('srcset'),'UI_Q24_IMAGE_ROLE');
  const expectedUrl='https://img.wangjiedu.com/exams/images/'+scope.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
  const imageUrl=new URL(image.currentSrc||image.src,document.baseURI);
  need(imageUrl.href===expectedUrl&&(image.currentSrc||image.src)===expectedUrl&&image.src===expectedUrl,'UI_Q24_IMAGE_PATH');
  need(image.complete&&image.naturalWidth>0&&image.naturalHeight>0,'UI_Q24_IMAGE_READY');
  const question=rect(box),contentRect=rect(content),answerRect=rect(answer);
  for(const e of[box,number,content,image])need(visibleWithin(e),'UI_Q24_REQUIRED_ELEMENT_HIDDEN');
  need([number,content,image].every(e=>inside(rect(e),question))&&inside(rect(image),contentRect),'UI_Q24_ROLE_CLIPPED');
  need(answer.children.length===0&&!answer.textContent.trim()&&[...answer.childNodes].every(n=>
    n.nodeType===Node.COMMENT_NODE||n.nodeType===Node.TEXT_NODE&&!n.textContent.trim()),'UI_Q24_ANSWER_NOT_EMPTY');
  need(shown(answer)&&!answer.hasAttribute('hidden')&&answer.getAttribute?.('aria-hidden')!=='true'&&finite(answerRect)&&answerRect.width>0&&answerRect.height===0,'UI_Q24_EMPTY_ANSWER_GEOMETRY');
  need(answerRect.x>=question.x-1&&answerRect.x+answerRect.width<=question.x+question.width+1&&
    answerRect.y>=contentRect.y+contentRect.height-1&&answerRect.y<=question.y+question.height+1,'UI_Q24_EMPTY_ANSWER_GEOMETRY');
  const children=[rect(number)],seen=new Set();let contentTextNodes=0,contentTextRanges=0,contentMathAtoms=0,contentImageAtoms=0;
  const add=r=>{need(inside(r,contentRect)&&inside(r,question),'UI_Q24_CONTENT_RANGE');
    need(!children.some(p=>Math.abs(p.x-r.x)<0.01&&Math.abs(p.y-r.y)<0.01&&Math.abs(p.width-r.width)<0.01&&Math.abs(p.height-r.height)<0.01),'UI_Q24_DUPLICATE_ATOM');
    children.push({x:r.x,y:r.y,width:r.width,height:r.height});};
  const walk=node=>{
    need(!seen.has(node),'UI_Q24_DUPLICATE_NODE');seen.add(node);
    if(node.nodeType===Node.TEXT_NODE){
      if(!node.textContent.trim())return;
      need(visibleWithin(node.parentElement),'UI_Q24_CONTENT_HIDDEN');
      const range=document.createRange();range.selectNodeContents(node);const spans=[...range.getClientRects()].filter(positive);
      need(spans.length>0,'UI_Q24_CONTENT_RANGE');for(const span of spans)add(span);
      contentTextNodes++;contentTextRanges+=spans.length;return;
    }
    if(node.nodeType===Node.COMMENT_NODE)return;
    need(node.nodeType===Node.ELEMENT_NODE,'UI_Q24_CONTENT_NODE');
    need(!node.hasAttribute('hidden')&&node.getAttribute?.('aria-hidden')!=='true','UI_Q24_CONTENT_HIDDEN');
    if(node===image){need(visibleWithin(node),'UI_Q24_CONTENT_HIDDEN');add(rect(node));contentImageAtoms++;return;}
    if(node.tagName==='MJX-CONTAINER'){
      need(visibleWithin(node)&&inside(rect(node),contentRect)&&node.querySelectorAll('script,iframe,object,embed,foreignObject,img,mjx-merror,[data-mjx-error]').length===0,'UI_Q24_MATH_ATOM');
      add(rect(node));contentMathAtoms++;return;
    }
    need(['SPAN','B','STRONG','I','EM','U','SUB','SUP','BR'].includes(node.tagName),'UI_Q24_CONTENT_ELEMENT');
    if(node.tagName==='BR'){need(node.childNodes.length===0&&shown(node),'UI_Q24_BREAK_NODE');return;}
    need(visibleWithin(node)&&inside(rect(node),contentRect),'UI_Q24_CONTENT_HIDDEN');
    for(const child of node.childNodes)walk(child);
  };
  for(const node of content.childNodes)walk(node);
  need(contentTextNodes>0&&contentTextRanges>=contentTextNodes&&contentMathAtoms===3&&contentImageAtoms===1&&children.length===1+contentTextRanges+contentMathAtoms+contentImageAtoms,'UI_Q24_CONTENT_ACCOUNTING');
  const surface={schemaVersion:'archive-m2s1-q24-mobile-native-surface-v1',kind:'NUMBER_AND_ALL_CONTENT_ATOMS_WITH_EMPTY_ANSWER_BOX',
    sourceOrdinal:24,viewportWidth:390,viewportHeight:844,outerElementCount:box.children.length,numberCount:1,contentCount:1,answerBoxCount:1,
    answerBoxHeight:answerRect.height,emptyAnswerBox:true,choicesCount:0,imageCount:box.querySelectorAll('img').length,semanticChildCount:children.length,
    contentTextNodes,contentTextRanges,contentMathAtoms,contentImageAtoms,nonemptyOutsideNodes:0,nestedQuestionCount:box.querySelectorAll('.q-box').length,targetInsideContainer:content.contains(image)};
  const obstructions=[...document.querySelectorAll('body *')].filter(e=>!box.contains(e)&&!e.contains(box)&&['fixed','sticky'].includes(getComputedStyle(e).position)&&visible(e)).map(rect)
    .filter(r=>r.x<innerWidth&&r.x+r.width>0&&r.y<innerHeight&&r.y+r.height>0);
  const panel=document.getElementById('ap-archive-render-feedback'),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(box.outerHTML));
  return{surface,question,children,image:rect(image),emptyAnswerBox:answerRect,viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},
    obstructions,feedbackIdle:!panel||panel.hidden||!visible(panel),readiness:JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state,
    solutionNodes:document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber:number.textContent.trim(),mandatoryChildrenVisible:true,
    domSha256:[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('')};
}
function documentQ24Frame(frame){
  assertQ24Topology(frame.surface);assert.equal(frame.mandatoryChildrenVisible,true,'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  assert(frame.scroll&&Number.isFinite(frame.scroll.x)&&Number.isFinite(frame.scroll.y),'UI_CAPTURE_SCROLL');
  const documentRect=r=>{checkedRect(r);return{x:r.x+frame.scroll.x,y:r.y+frame.scroll.y,width:r.width,height:r.height};};
  const e=frame.emptyAnswerBox;assert(e&&['x','y','width','height'].every(k=>Number.isFinite(e[k]))&&e.width>0&&e.height===0,'UI_Q24_EMPTY_ANSWER_GEOMETRY');
  return{surface:frame.surface,question:documentRect(frame.question),content:documentRect(problemContentClip(frame)),children:frame.children.map(documentRect),
    image:documentRect(frame.image),emptyAnswerBox:{x:e.x+frame.scroll.x,y:e.y+frame.scroll.y,width:e.width,height:0},viewport:frame.viewport,questionNumber:frame.questionNumber};
}

async function captureQ24Tiles(page, target, file, item, viewport) {
  assertQ24Binding(item, viewport);
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measureQ24Capture, Q24_BROWSER_SCOPE);
  assert(frame.mandatoryChildrenVisible === true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  const original = documentQ24Frame(frame), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planProblemTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planProblemTileScroll(frame, tile);
      if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await target.evaluate(measureQ24Capture, Q24_BROWSER_SCOPE);
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentQ24Frame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertProblemTileCapture(frame, tile), hits = await target.evaluate(inspectCaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await target.evaluate(measureQ24Capture, Q24_BROWSER_SCOPE);
    assert.deepEqual(assertProblemTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentQ24Frame(after), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
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

// Exact E045 Q24 mobile: its observed empty answer-box stays zero-height.
// Measure the number and five actual paragraphs, validate every meaningful
// descendant, and record descendant geometry for post-scroll/capture equality.
const E045_Q24_UID = 'qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd';
const E045_Q24_WHOLE = '6bbba32d209bd4dedfd6b154d86c986a059e69ac883b52bc963b67db17a36ae8';
const E045_Q24_ASSET = Object.freeze({path:'archive/assets/images/21_팔마중_1학기_기말_중2_수학/q24-problem-visual-v2-source-repair-r2.svg',
  gitBlobSha1:'6ddf55bc8a7575124342f996cd654b6df3ca5013',sha256:'a7f34be6ce3556987911922fe8df74cfca412de47f8ce1af3d0dd4bccc8c3749',bytes:10634});
const E045_Q24_BROWSER_SCOPE = Object.freeze({ordinal:24,assetPath:E045_Q24_ASSET.path,width:390,height:844,choices:0,paragraphs:5,mathAtoms:6});
function assertE045Q24Binding(item,viewport){
  assert(item&&item.key==='E045-Q24'&&item.questionUid===E045_Q24_UID&&item.sourceOrdinal===24&&item.questionSha256===E045_Q24_WHOLE,'UI_E045_Q24_SCOPE');
  assert(viewport&&viewport.name==='mobile'&&viewport.width===390&&viewport.height===844,'UI_E045_Q24_VIEWPORT');
  for(const[name,expected]of[['sourceRef',SOURCE],['assetRef',E045_Q24_ASSET]]){
    assert(item[name],'UI_E045_Q24_SCOPE');for(const key of Object.keys(expected))assert.equal(item[name][key],expected[key],'UI_E045_Q24_SCOPE');
  }
  return true;
}
function assertE045Q24Preflight(question,item){
  assert(Array.isArray(question?.choices)&&question.choices.length===0&&question.choicesEmbeddedInImage!==true&&
    question.sourcePayload?.choicesEmbeddedInImage!==true&&!question.image,'UI_E045_Q24_SUBJECTIVE_SCOPE');
  assert.equal(sha256(stable(question)),E045_Q24_WHOLE,'UI_E045_Q24_WHOLE_QUESTION');
  return assertE045Q24Binding({...item,sourceRef:{path:item.sourcePath,gitBlobSha1:item.sourceGitBlobSha1,sha256:item.sourceSha256,bytes:item.sourceBytes},
    assetRef:{path:item.assetPath,gitBlobSha1:item.assetGitBlobSha1,sha256:item.assetSha256,bytes:item.assetBytes}},{name:'mobile',width:390,height:844});
}
function assertE045Q24Topology(s){
  assert(s&&typeof s==='object'&&!Array.isArray(s),'UI_E045_Q24_SURFACE_REQUIRED');
  assert.deepEqual(Object.keys(s).sort(),['schemaVersion','kind','sourceOrdinal','viewportWidth','viewportHeight','outerElementCount','numberCount','contentCount',
    'answerBoxCount','answerBoxHeight','emptyAnswerBox','choicesCount','paragraphCount','paragraphs','imageCount','semanticChildCount',
    'contentTextNodes','contentTextRanges','contentMathAtoms','contentImageAtoms','nonemptyOutsideNodes','nestedQuestionCount','targetInsideContainer'].sort(),'UI_E045_Q24_SURFACE_KEYS');
  assert(s.schemaVersion==='archive-m2s1-e045-q24-mobile-paragraph-surface-v1'&&s.kind==='NUMBER_AND_FIVE_PARAGRAPHS_WITH_EMPTY_ANSWER_BOX'&&
    s.sourceOrdinal===24&&s.viewportWidth===390&&s.viewportHeight===844,'UI_E045_Q24_SURFACE_SCOPE');
  assert(s.outerElementCount===3&&s.numberCount===1&&s.contentCount===1&&s.answerBoxCount===1&&s.answerBoxHeight===0&&s.emptyAnswerBox===true&&
    s.choicesCount===0&&s.paragraphCount===5&&s.imageCount===1&&s.contentImageAtoms===1&&s.contentMathAtoms===6&&s.semanticChildCount===6&&
    s.nonemptyOutsideNodes===0&&s.nestedQuestionCount===0&&s.targetInsideContainer===true,'UI_E045_Q24_SURFACE_COMPLETENESS');
  assert(Array.isArray(s.paragraphs)&&s.paragraphs.length===5,'UI_E045_Q24_PARAGRAPH_ACCOUNTING');
  for(const[p,row]of s.paragraphs.entries()){
    assert.deepEqual(Object.keys(row).sort(),['index','role','textNodes','textRanges','mathAtoms','imageAtoms'].sort(),'UI_E045_Q24_PARAGRAPH_ACCOUNTING');
    assert(row.index===p&&row.role===(p===1?'IMAGE':'TEXT')&&['textNodes','textRanges','mathAtoms','imageAtoms'].every(k=>Number.isSafeInteger(row[k])&&row[k]>=0),
      'UI_E045_Q24_PARAGRAPH_ACCOUNTING');
    assert(p===1?row.textNodes===0&&row.textRanges===0&&row.mathAtoms===0&&row.imageAtoms===1:
      row.textNodes+row.mathAtoms>0&&row.textRanges>=row.textNodes&&row.imageAtoms===0,'UI_E045_Q24_PARAGRAPH_ACCOUNTING');
  }
  for(const[name,key]of[['contentTextNodes','textNodes'],['contentTextRanges','textRanges'],['contentMathAtoms','mathAtoms'],['contentImageAtoms','imageAtoms']])
    assert.equal(s[name],s.paragraphs.reduce((n,row)=>n+row[key],0),'UI_E045_Q24_PARAGRAPH_ACCOUNTING');
  return s;
}
async function measureE045Q24Capture(image,scope){
  const need=(ok,code)=>{if(!ok)throw new Error(code);};
  need(scope&&scope.ordinal===24&&scope.width===390&&scope.height===844&&scope.choices===0&&scope.paragraphs===5&&scope.mathAtoms===6&&typeof scope.assetPath==='string','UI_E045_Q24_SCOPE');
  need(innerWidth===390&&innerHeight===844,'UI_E045_Q24_VIEWPORT');
  const box=image.closest('.q-box');
  need(box&&!box.classList.contains('ap-equal-slot')&&box.querySelectorAll('.ap-slot-content').length===0,'UI_E045_Q24_DIRECT_TOPOLOGY');
  const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
  const finite=r=>r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]));
  const positive=r=>finite(r)&&r.width>0&&r.height>0;
  const inside=(r,owner)=>positive(r)&&positive(owner)&&r.x>=owner.x-1&&r.y>=owner.y-1&&r.x+r.width<=owner.x+owner.width+1&&r.y+r.height<=owner.y+owner.height+1;
  const shown=e=>{const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&s.visibility!=='collapse'&&Number(s.opacity)!==0&&
    !e.hasAttribute('hidden')&&e.getAttribute?.('aria-hidden')!=='true';};
  const visible=e=>shown(e)&&positive(rect(e));
  const visibleWithin=e=>{if(!box.contains(e))return false;for(let n=e;n&&box.contains(n);n=n.parentElement)if(!visible(n))return false;return true;};
  const exactChildren=(parent,expected)=>{
    need(parent.children.length===expected.length&&expected.every((n,i)=>parent.children[i]===n),'UI_E045_Q24_CHILD_ORDER');
    for(const n of parent.childNodes){
      if(n.nodeType===Node.ELEMENT_NODE)need(expected.includes(n),'UI_E045_Q24_EXTRA_ELEMENT');
      else if(n.nodeType===Node.TEXT_NODE)need(!n.textContent.trim(),'UI_E045_Q24_OUTSIDE_TEXT');
      else need(n.nodeType===Node.COMMENT_NODE,'UI_E045_Q24_EXTRA_NODE');
    }
  };
  need(box.children.length===3,'UI_E045_Q24_OUTER_THREE');
  const[number,content,answer]=box.children;
  need(number.matches('.q-num')&&content.matches('.q-content')&&answer.matches('.answer-box')&&box.querySelectorAll('.q-num').length===1&&
    box.querySelectorAll('.q-content').length===1&&box.querySelectorAll('.answer-box').length===1&&box.querySelectorAll('.q-box').length===0&&
    box.querySelectorAll('.choices,.choice-item').length===0,'UI_E045_Q24_ROLE_TOPOLOGY');
  exactChildren(box,[number,content,answer]);
  need(number.children.length===0&&number.textContent.trim()==='24.','UI_E045_Q24_VISIBLE_ORDINAL');
  need(content.children.length===5&&[...content.children].every(p=>p.tagName==='P'),'UI_E045_Q24_PARAGRAPHS_FIVE');
  const paragraphs=[...content.children],figure=paragraphs[1];exactChildren(content,paragraphs);exactChildren(figure,[image]);
  need(image.tagName==='IMG'&&box.querySelectorAll('img').length===1&&!image.hasAttribute('srcset'),'UI_E045_Q24_IMAGE_ROLE');
  const expectedUrl='https://img.wangjiedu.com/exams/images/'+scope.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
  const imageUrl=new URL(image.currentSrc||image.src,document.baseURI);
  need(imageUrl.href===expectedUrl&&(image.currentSrc||image.src)===expectedUrl&&image.src===expectedUrl,'UI_E045_Q24_IMAGE_PATH');
  need(image.complete&&image.naturalWidth>0&&image.naturalHeight>0,'UI_E045_Q24_IMAGE_READY');
  const question=rect(box),contentRect=rect(content),answerRect=rect(answer),paragraphRects=paragraphs.map(rect);
  for(const e of[box,number,content,...paragraphs,image])need(visibleWithin(e),'UI_E045_Q24_REQUIRED_ELEMENT_HIDDEN');
  need([number,content,...paragraphs,image].every(e=>inside(rect(e),question))&&paragraphRects.every(r=>inside(r,contentRect))&&inside(rect(image),rect(figure)),'UI_E045_Q24_ROLE_CLIPPED');
  need(answer.children.length===0&&[...answer.childNodes].every(n=>n.nodeType===Node.COMMENT_NODE||n.nodeType===Node.TEXT_NODE&&!n.textContent.trim()),'UI_E045_Q24_ANSWER_NOT_EMPTY');
  need(shown(answer)&&finite(answerRect)&&answerRect.width>0&&answerRect.height===0&&answerRect.x>=question.x-1&&answerRect.x+answerRect.width<=question.x+question.width+1&&
    answerRect.y>=contentRect.y+contentRect.height-1&&answerRect.y<=question.y+question.height+1,'UI_E045_Q24_EMPTY_ANSWER_GEOMETRY');
  const children=[rect(number),...paragraphRects],atoms=[],seenNodes=new Set(),seenRects=new Set(),details=[];
  for(let i=0;i<children.length;i++)for(let j=i+1;j<children.length;j++){
    const a=children[i],b=children[j];need(!(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1),'UI_E045_Q24_SEMANTIC_ROLES_OVERLAP');
  }
  for(const[index,p]of paragraphs.entries()){
    const owner=paragraphRects[index],counts={index,role:index===1?'IMAGE':'TEXT',textNodes:0,textRanges:0,mathAtoms:0,imageAtoms:0};
    const add=(kind,r)=>{
      need(positive(r)&&inside(r,owner)&&inside(r,question),'UI_E045_Q24_CONTENT_RANGE');
      const v={x:r.x,y:r.y,width:r.width,height:r.height},key=JSON.stringify(v);need(!seenRects.has(key),'UI_E045_Q24_DUPLICATE_ATOM');seenRects.add(key);
      atoms.push({paragraphIndex:index,kind,rect:v});
    };
    const walk=node=>{
      need(!seenNodes.has(node),'UI_E045_Q24_DUPLICATE_NODE');seenNodes.add(node);
      if(node.nodeType===Node.TEXT_NODE){
        if(!node.textContent.trim())return;need(index!==1&&visibleWithin(node.parentElement),'UI_E045_Q24_CONTENT_HIDDEN');
        const range=document.createRange();range.selectNodeContents(node);const spans=[...range.getClientRects()].filter(positive);
        need(spans.length>0,'UI_E045_Q24_CONTENT_RANGE');for(const span of spans)add('TEXT_RANGE',span);counts.textNodes++;counts.textRanges+=spans.length;return;
      }
      if(node.nodeType===Node.COMMENT_NODE)return;
      need(node.nodeType===Node.ELEMENT_NODE,'UI_E045_Q24_CONTENT_NODE');need(shown(node),'UI_E045_Q24_CONTENT_HIDDEN');
      if(node===image){need(index===1&&visibleWithin(node),'UI_E045_Q24_IMAGE_ROLE');add('IMAGE',rect(node));counts.imageAtoms++;return;}
      need(index!==1,'UI_E045_Q24_IMAGE_ROLE');
      if(node.tagName==='MJX-CONTAINER'){
        need(visibleWithin(node)&&inside(rect(node),owner)&&node.querySelectorAll('script,iframe,object,embed,foreignObject,img,mjx-merror,[data-mjx-error]').length===0,'UI_E045_Q24_MATH_ATOM');
        add('GENERATED_MATH',rect(node));counts.mathAtoms++;return;
      }
      need(['SPAN','B','STRONG','I','EM','U','SUB','SUP','BR'].includes(node.tagName),'UI_E045_Q24_CONTENT_ELEMENT');
      if(node.tagName==='BR'){need(node.childNodes.length===0,'UI_E045_Q24_BREAK_NODE');return;}
      need(visibleWithin(node)&&inside(rect(node),owner),'UI_E045_Q24_CONTENT_HIDDEN');for(const child of node.childNodes)walk(child);
    };
    for(const node of p.childNodes)walk(node);
    need(index===1?counts.textNodes===0&&counts.mathAtoms===0&&counts.imageAtoms===1:counts.textNodes+counts.mathAtoms>0&&counts.imageAtoms===0,'UI_E045_Q24_PARAGRAPH_ACCOUNTING');
    details.push(counts);
  }
  const total=k=>details.reduce((n,row)=>n+row[k],0);
  need(total('mathAtoms')===6&&total('imageAtoms')===1,'UI_E045_Q24_CONTENT_ACCOUNTING');
  const surface={schemaVersion:'archive-m2s1-e045-q24-mobile-paragraph-surface-v1',kind:'NUMBER_AND_FIVE_PARAGRAPHS_WITH_EMPTY_ANSWER_BOX',
    sourceOrdinal:24,viewportWidth:390,viewportHeight:844,outerElementCount:3,numberCount:1,contentCount:1,answerBoxCount:1,answerBoxHeight:0,emptyAnswerBox:true,
    choicesCount:0,paragraphCount:5,paragraphs:details,imageCount:1,semanticChildCount:children.length,contentTextNodes:total('textNodes'),contentTextRanges:total('textRanges'),
    contentMathAtoms:total('mathAtoms'),contentImageAtoms:total('imageAtoms'),nonemptyOutsideNodes:0,nestedQuestionCount:0,targetInsideContainer:content.contains(image)};
  const obstructions=[...document.querySelectorAll('body *')].filter(e=>!box.contains(e)&&!e.contains(box)&&['fixed','sticky'].includes(getComputedStyle(e).position)&&visible(e)).map(rect)
    .filter(r=>r.x<innerWidth&&r.x+r.width>0&&r.y<innerHeight&&r.y+r.height>0);
  const panel=document.getElementById('ap-archive-render-feedback'),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(box.outerHTML));
  return{surface,question,children,image:rect(image),semanticAtoms:atoms,emptyAnswerBox:answerRect,viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},
    obstructions,feedbackIdle:!panel||panel.hidden||!visible(panel),readiness:JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state,
    solutionNodes:document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber:number.textContent.trim(),mandatoryChildrenVisible:true,domSha256:[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('')};
}
function documentE045Q24Frame(frame){
  assertE045Q24Topology(frame.surface);assert.equal(frame.mandatoryChildrenVisible,true,'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  assert(frame.scroll&&Number.isFinite(frame.scroll.x)&&Number.isFinite(frame.scroll.y),'UI_CAPTURE_SCROLL');
  assert(Array.isArray(frame.semanticAtoms)&&frame.semanticAtoms.length===frame.surface.contentTextRanges+frame.surface.contentMathAtoms+frame.surface.contentImageAtoms,'UI_E045_Q24_CONTENT_ACCOUNTING');
  const documentRect=r=>{checkedRect(r);return{x:r.x+frame.scroll.x,y:r.y+frame.scroll.y,width:r.width,height:r.height};};
  const e=frame.emptyAnswerBox;assert(e&&['x','y','width','height'].every(k=>Number.isFinite(e[k]))&&e.width>0&&e.height===0,'UI_E045_Q24_EMPTY_ANSWER_GEOMETRY');
  return{surface:frame.surface,question:documentRect(frame.question),content:documentRect(problemContentClip(frame)),children:frame.children.map(documentRect),
    image:documentRect(frame.image),semanticAtoms:frame.semanticAtoms.map(a=>({paragraphIndex:a.paragraphIndex,kind:a.kind,rect:documentRect(a.rect)})),
    emptyAnswerBox:{x:e.x+frame.scroll.x,y:e.y+frame.scroll.y,width:e.width,height:0},viewport:frame.viewport,questionNumber:frame.questionNumber};
}

async function captureE045Q24Tiles(page, target, file, item, viewport) {
  assertE045Q24Binding(item, viewport);
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measureE045Q24Capture, E045_Q24_BROWSER_SCOPE);
  assert(frame.mandatoryChildrenVisible === true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  const original = documentE045Q24Frame(frame), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planProblemTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planProblemTileScroll(frame, tile);
      if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await target.evaluate(measureE045Q24Capture, E045_Q24_BROWSER_SCOPE);
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentE045Q24Frame(frame), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertProblemTileCapture(frame, tile), hits = await target.evaluate(inspectCaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await target.evaluate(measureE045Q24Capture, E045_Q24_BROWSER_SCOPE);
    assert.deepEqual(assertProblemTileCapture(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentE045Q24Frame(after), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
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

module.exports = { UID, BROWSER_SCOPE, assertQ15Binding, assertQ15Preflight, assertQ15Topology, measureQ15Capture, documentQ15Frame, captureQ15Tiles, Q24_UID, Q24_BROWSER_SCOPE, assertQ24Binding, assertQ24Preflight, assertQ24Topology, measureQ24Capture, documentQ24Frame, captureQ24Tiles, E045_Q24_UID, E045_Q24_BROWSER_SCOPE, assertE045Q24Binding, assertE045Q24Preflight, assertE045Q24Topology, measureE045Q24Capture, documentE045Q24Frame, captureE045Q24Tiles };
