'use strict';
// Read-only adapters for the exact forty-item capture fixture. Existing H,
// shared Surface, and E051 fragment contracts are imported without changes.
const assert = require('node:assert/strict'), path = require('node:path');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const Surface = require('./capture-m1s2-problem-surface.cjs');
const Fragments = require('./m2s1-text3-solution-fragments.cjs');
const { stable, sha256, problemContentClip, planProblemTiles, planProblemTileScroll,
  assertProblemTileCapture, assertTileCoverage, TILE_SCHEMA, TILE_LIMIT, TILE_OVERLAP } = H;
const MANIFEST_PATH = 'tests/fixtures/archive-m2s1-stale-forty-current-ui.json';
const MANIFEST_SHA = '69cc73bd5f3a1d4b32a46ef016b6e44efbb1a9cca5e7144a49069f96be78e8f6';
const NATIVE_KEYS = Object.freeze(['E037-Q22','E037-Q25','E037-Q24','E044-Q21','E044-Q24','E044-Q6','E040-Q23','E040-Q24','E040-Q15']);
const SOLUTION_KEYS = Object.freeze(['E044-Q21','E044-Q24']);
const issued = new WeakSet();
const positive = r => r && ['x','y','width','height'].every(k => Number.isFinite(r[k])) && r.width > 0 && r.height > 0;
const checkedRect = r => { assert(positive(r),'UI_STALE40_RECT'); return r; };
const overlap = (a,b) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
const stripCommit = r => { const { commit, ...rest } = r; return rest; };

function makePolicy(reader, item, surface, viewport) {
  const manifest = JSON.parse(reader.read(MANIFEST_PATH));
  assert.equal(sha256(stable(manifest)), MANIFEST_SHA, 'UI_STALE40_CLOSED_MANIFEST');
  const rows = manifest.items.filter(r => r.questionUid === item.questionUid);
  assert.equal(rows.length, 1, 'UI_STALE40_POLICY_UID');
  assert.deepEqual(item, rows[0], 'UI_STALE40_POLICY_ITEM');
  assert(item.surfaces.includes(surface), 'UI_STALE40_POLICY_SURFACE');
  assert(manifest.viewports[surface].some(v => stable(v) === stable(viewport)), 'UI_STALE40_POLICY_VIEWPORT');
  const selectedAssets = item.assets.filter(a => a.surface === surface);
  assert.equal(selectedAssets.length, 1, 'UI_STALE40_POLICY_ASSET');
  const sourceRef = reader.ref(item.sourcePath), assetRef = reader.ref(selectedAssets[0].ref.path);
  assert.deepEqual(stripCommit(sourceRef), item.sourceRef, 'UI_STALE40_POLICY_SOURCE');
  assert.deepEqual(stripCommit(assetRef), selectedAssets[0].ref, 'UI_STALE40_POLICY_ASSET_BYTES');
  const nativeAtoms = surface === 'PROBLEM' && NATIVE_KEYS.includes(item.key);
  if (nativeAtoms) assert(!item.sourceShape.topImage && item.sourceShape.contentImageCount === 1 && item.sourceShape.contentHasText &&
    (item.sourceShape.choiceCount === 0 || item.sourceShape.choicesEmbeddedInImage), 'UI_STALE40_NATIVE_SCOPE');
  if (surface === 'SOLUTION') assert(SOLUTION_KEYS.includes(item.key) || item.questionUid === Fragments.UID, 'UI_STALE40_SOLUTION_SCOPE');
  const p = { key:item.key, questionUid:item.questionUid, ordinal:item.sourceOrdinal, questionNo:item.sourceQuestionNo,
    wholeQuestionSha256:item.questionSha256, sourceRef, assetRef, surface, mode:surface === 'PROBLEM' ? 'exam' : 'sol',
    nativeAtoms, embedded:item.sourceShape.choicesEmbeddedInImage, contentTags:item.sourceShape.contentTagSequence,
    viewport:{width:viewport.width,height:viewport.height}, manifestRef:reader.ref(MANIFEST_PATH) };
  for (const key of ['sourceRef','assetRef','viewport','manifestRef','contentTags']) Object.freeze(p[key]);
  Object.freeze(p); issued.add(p); return p;
}

function assertNativeTopology(s, policy) {
  assert(s && s.schemaVersion === 'archive-m2s1-stale40-native-atoms-v1' && s.kind === 'NUMBER_AND_ALL_CONTENT_ATOMS', 'UI_STALE40_NATIVE_SCHEMA');
  assert(s.sourceOrdinal === policy.ordinal && s.questionUid === policy.questionUid && s.sourceMatchesSelected === true,
    'UI_STALE40_NATIVE_BINDING');
  assert(s.numberCount === 1 && s.contentCount === 1 && s.nestedQuestionCount === 0 && s.nonemptyOutsideNodes === 0 &&
    s.targetInsideContent === true && s.choicesCount === 0 && s.imageCount === 1, 'UI_STALE40_NATIVE_ROLES');
  assert(s.answerBoxCount === (policy.embedded ? 0 : 1) && s.answerBoxHeight === 0 && s.emptyAnswerBox === true,
    'UI_STALE40_EMPTY_ANSWER');
  assert(s.containerElementCount === (policy.embedded ? 2 : 3), 'UI_STALE40_NATIVE_CHILD_COUNT');
  assert(s.equalSlot ? s.wrapperCount === 1 && s.outerElementCount === 1 : s.wrapperCount === 0 && s.outerElementCount === s.containerElementCount,
    'UI_STALE40_NATIVE_WRAPPER');
  assert(Number.isSafeInteger(s.contentTextNodes) && s.contentTextNodes > 0 && Number.isSafeInteger(s.contentTextRanges) &&
    s.contentTextRanges >= s.contentTextNodes && Number.isSafeInteger(s.contentMathAtoms) && s.contentMathAtoms >= 0 &&
    s.contentImageAtoms === 1 && s.semanticChildCount === 1+s.contentTextRanges+s.contentMathAtoms+s.contentImageAtoms &&
    s.semanticChildCount >= 3 && s.completeNodeAccounting === true, 'UI_STALE40_NATIVE_ACCOUNTING');
  return s;
}

// This browser reader returns counts, geometry and digests only. No DOM text,
// HTML, source body, answer or solution is returned or modified.
async function measureNativeAtoms(image, scope) {
  const need=(ok,code)=>{if(!ok)throw new Error(code);};
  need(scope.nativeAtoms && scope.surface === 'PROBLEM' && scope.mode === 'exam', 'UI_STALE40_NATIVE_SCOPE');
  need(innerWidth === scope.viewport.width && innerHeight === scope.viewport.height, 'UI_STALE40_VIEWPORT');
  const box=image.closest('.q-box'); need(box && !box.classList.contains('sol-box'), 'UI_STALE40_PROBLEM_BOX');
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
  const positive=r=>r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]))&&r.width>0&&r.height>0;
  const inside=(r,o)=>positive(r)&&positive(o)&&r.x>=o.x-1&&r.y>=o.y-1&&r.x+r.width<=o.x+o.width+1&&r.y+r.height<=o.y+o.height+1;
  const shown=e=>{const c=getComputedStyle(e);return c.display!=='none'&&!['hidden','collapse'].includes(c.visibility)&&Number(c.opacity)!==0&&!e.hasAttribute('hidden')&&e.getAttribute('aria-hidden')!=='true';};
  const visible=e=>shown(e)&&positive(rect(e));
  const visibleWithin=e=>{for(let n=e;n&&box.contains(n);n=n.parentElement)if(!visible(n))return false;return !!(e&&box.contains(e));};
  const equalSlot=box.classList.contains('ap-equal-slot'),wrappers=[...box.children].filter(n=>n.matches('.ap-slot-content'));
  need(equalSlot ? wrappers.length===1&&box.children.length===1 : wrappers.length===0, 'UI_STALE40_NATIVE_WRAPPER');
  const container=equalSlot?wrappers[0]:box;
  const permittedOutside=node=>node.nodeType===Node.COMMENT_NODE||node.nodeType===Node.TEXT_NODE&&!node.textContent.trim();
  if(equalSlot)for(const n of box.childNodes)need(n===container||permittedOutside(n),'UI_STALE40_OUTSIDE_CONTENT');
  const all=[...container.children],number=all[0],content=all[1],answer=all[2]||null;
  need(all.length===(scope.embedded?2:3)&&number?.matches('.q-num')&&content?.matches('.q-content')&&
    (scope.embedded?!answer:answer?.matches('.answer-box')), 'UI_STALE40_NATIVE_CHILD_ORDER');
  need(box.querySelectorAll('.q-num').length===1&&box.querySelectorAll('.q-content').length===1&&box.querySelectorAll('.q-box').length===0&&
    box.querySelectorAll('.choices,.choice-item').length===0, 'UI_STALE40_NATIVE_ROLES');
  for(const n of container.childNodes)need(all.includes(n)||permittedOutside(n),'UI_STALE40_OUTSIDE_CONTENT');
  need(number.children.length===0&&number.textContent.trim()===String(scope.ordinal)+'.', 'UI_STALE40_VISIBLE_ORDINAL');
  need(content.contains(image)&&image.tagName==='IMG'&&box.querySelectorAll('img').length===1&&!image.hasAttribute('srcset'), 'UI_STALE40_IMAGE_ROLE');
  const expected='https://img.wangjiedu.com/exams/images/'+scope.assetRef.path.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
  need(image.src===expected&&(image.currentSrc||image.src)===expected&&new URL(image.src).href===expected,'UI_STALE40_IMAGE_PATH');
  need(image.complete&&image.naturalWidth>0&&image.naturalHeight>0,'UI_STALE40_IMAGE_READY');
  const question=rect(box),contentRect=rect(content);
  for(const e of [box,container,number,content,image])need(visibleWithin(e),'UI_STALE40_REQUIRED_ELEMENT_HIDDEN');
  need([number,content,image].every(e=>inside(rect(e),question))&&inside(rect(image),contentRect),'UI_STALE40_ROLE_CLIPPED');
  let emptyAnswerBox=null;
  if(answer){
    const a=rect(answer);
    need(!answer.textContent.trim()&&answer.children.length===0&&[...answer.childNodes].every(permittedOutside),'UI_STALE40_ANSWER_NOT_EMPTY');
    need(shown(answer)&&['x','y','width','height'].every(k=>Number.isFinite(a[k]))&&a.width>0&&a.height===0&&
      a.x>=question.x-1&&a.x+a.width<=question.x+question.width+1&&a.y>=contentRect.y+contentRect.height-1&&a.y<=question.y+question.height+1,
      'UI_STALE40_EMPTY_ANSWER_GEOMETRY');emptyAnswerBox=a;
  }
  const children=[rect(number)],seen=new Set(),tags=[];let contentTextNodes=0,contentTextRanges=0,contentMathAtoms=0,contentImageAtoms=0;
  const add=r=>{need(inside(r,contentRect)&&inside(r,question),'UI_STALE40_CONTENT_RANGE');need(!children.some(p=>
    ['x','y','width','height'].every(k=>Math.abs(p[k]-r[k])<0.01)),'UI_STALE40_DUPLICATE_ATOM');children.push({x:r.x,y:r.y,width:r.width,height:r.height});};
  const walk=n=>{
    need(!seen.has(n),'UI_STALE40_DUPLICATE_NODE');seen.add(n);
    if(n.nodeType===Node.TEXT_NODE){if(!n.textContent.trim())return;need(visibleWithin(n.parentElement),'UI_STALE40_CONTENT_HIDDEN');
      const range=document.createRange();range.selectNodeContents(n);const rs=[...range.getClientRects()].filter(positive);need(rs.length>0,'UI_STALE40_CONTENT_RANGE');
      for(const r of rs)add(r);contentTextNodes++;contentTextRanges+=rs.length;return;}
    if(n.nodeType===Node.COMMENT_NODE)return;
    need(n.nodeType===Node.ELEMENT_NODE,'UI_STALE40_CONTENT_NODE');
    need(!n.hasAttribute('hidden')&&n.getAttribute('aria-hidden')!=='true','UI_STALE40_CONTENT_HIDDEN');
    if(n.tagName==='MJX-CONTAINER'){need(visibleWithin(n)&&n.querySelectorAll('script,iframe,object,embed,foreignObject,img,mjx-merror,[data-mjx-error]').length===0,
      'UI_STALE40_MATH_ATOM');add(rect(n));contentMathAtoms++;return;}
    need(['P','BR','IMG'].includes(n.tagName),'UI_STALE40_CONTENT_ELEMENT');tags.push(n.tagName);
    if(n===image){need(visibleWithin(n),'UI_STALE40_CONTENT_HIDDEN');add(rect(n));contentImageAtoms++;return;}
    need(n.tagName!=='IMG','UI_STALE40_EXTRA_IMAGE');
    if(n.tagName==='BR'){need(n.childNodes.length===0&&shown(n),'UI_STALE40_BREAK_NODE');return;}
    need(visibleWithin(n)&&inside(rect(n),contentRect),'UI_STALE40_CONTENT_HIDDEN');
    for(const child of n.childNodes)walk(child);tags.push(n.tagName);
  };
  for(const n of content.childNodes)walk(n);
  need(JSON.stringify(tags)===JSON.stringify(scope.contentTags),'UI_STALE40_SOURCE_TAG_TOPOLOGY');
  need(contentTextNodes>0&&contentImageAtoms===1&&children.length>=3,'UI_STALE40_NATIVE_ACCOUNTING');
  const sourceMatchesSelected=box.dataset.sourceRef===getArchiveQuestionSourceRef(AppState.data[scope.ordinal-1],scope.ordinal-1,AppState);
  need(sourceMatchesSelected,'UI_STALE40_RENDERED_SOURCE_BINDING');
  const surface={schemaVersion:'archive-m2s1-stale40-native-atoms-v1',kind:'NUMBER_AND_ALL_CONTENT_ATOMS',questionUid:scope.questionUid,
    sourceOrdinal:scope.ordinal,sourceMatchesSelected,equalSlot,wrapperCount:wrappers.length,outerElementCount:box.children.length,
    containerElementCount:all.length,numberCount:1,contentCount:1,nestedQuestionCount:0,nonemptyOutsideNodes:0,targetInsideContent:true,
    choicesCount:0,imageCount:1,answerBoxCount:answer?1:0,answerBoxHeight:0,emptyAnswerBox:true,semanticChildCount:children.length,
    contentTextNodes,contentTextRanges,contentMathAtoms,contentImageAtoms,completeNodeAccounting:true};
  const obstructions=[...document.querySelectorAll('body *')].filter(e=>!box.contains(e)&&!e.contains(box)&&['fixed','sticky'].includes(getComputedStyle(e).position)&&visible(e)).map(rect)
    .filter(r=>r.x<innerWidth&&r.x+r.width>0&&r.y<innerHeight&&r.y+r.height>0);
  const panel=document.getElementById('ap-archive-render-feedback'),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(box.outerHTML));
  return {surface,question,children,image:rect(image),emptyAnswerBox,viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},obstructions,
    feedbackIdle:!panel||panel.hidden||!visible(panel),readiness:JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state,mode:AppState.mode,
    solutionNodes:document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber:number.textContent.trim(),mandatoryChildrenVisible:true,domSha256:[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')};
}

function assertSolutionTopology(s, policy) {
  assert(s && s.schemaVersion==='archive-m2s1-stale40-single-solution-v1' && s.questionUid===policy.questionUid &&
    s.sourceOrdinal===policy.ordinal && s.sourceMatchesSelected===true && s.sourceFragments===1, 'UI_STALE40_SOLUTION_BINDING');
  assert(s.numberCount===1&&s.semanticCount===1&&s.metaCount===1&&s.answerCount===1&&s.explanationCount===1&&s.selectedImageCount===1&&
    s.outerElementCount===3&&s.nestedQuestionCount===0&&s.nonemptyOutsideNodes===0&&s.visibleRoles===true, 'UI_STALE40_SOLUTION_ROLES');
  assert(Number.isSafeInteger(s.expectedChunkCount)&&s.expectedChunkCount>0&&s.chunkCount===s.expectedChunkCount&&
    s.placementCount===1&&s.allChunksInside===true&&/^[a-f0-9]{64}$/.test(s.sourceRefSha256)&&/^[a-f0-9]{64}$/.test(s.layoutLedgerSha256),
    'UI_STALE40_SOLUTION_COMPLETENESS');return s;
}

async function measureSingleSolution(image, scope) {
  const need=(ok,code)=>{if(!ok)throw new Error(code);};
  need(scope.surface==='SOLUTION'&&scope.mode==='sol'&&['E044-Q21','E044-Q24'].includes(scope.key),'UI_STALE40_SOLUTION_SCOPE');
  need(innerWidth===1440&&innerHeight===1000,'UI_STALE40_VIEWPORT');
  const box=image.closest('.q-box.sol-box');need(box,'UI_STALE40_SOLUTION_BOX');
  const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
  const positive=r=>r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]))&&r.width>0&&r.height>0;
  const inside=(r,o)=>positive(r)&&positive(o)&&r.x>=o.x-1&&r.y>=o.y-1&&r.x+r.width<=o.x+o.width+1&&r.y+r.height<=o.y+o.height+1;
  const visible=e=>{const c=getComputedStyle(e);return c.display!=='none'&&!['hidden','collapse'].includes(c.visibility)&&Number(c.opacity)!==0&&
    !e.hasAttribute('hidden')&&e.getAttribute('aria-hidden')!=='true'&&positive(rect(e));};
  const source=box.dataset.sourceRef,group=[...document.querySelectorAll('#print-area .sol-box')].filter(n=>n.dataset.sourceRef===source);
  const sourceMatchesSelected=source===getArchiveQuestionSourceRef(AppState.data[scope.ordinal-1],scope.ordinal-1,AppState);
  need(sourceMatchesSelected&&group.length===1,'UI_STALE40_SOLUTION_FRAGMENT_COUNT');
  need(box.children.length===3&&box.querySelectorAll('.q-box').length===0&&!box.classList.contains('ap-equal-slot')&&box.querySelectorAll('.ap-slot-content').length===0,
    'UI_STALE40_SOLUTION_TOPOLOGY');
  const [number,semantic,meta]=box.children;
  need(number.matches('.q-num')&&semantic.matches('[data-semantic-content="1"]')&&meta.matches('.sol-meta'),'UI_STALE40_SOLUTION_CHILD_ORDER');
  for(const n of box.childNodes)need([...box.children].includes(n)||n.nodeType===Node.COMMENT_NODE||n.nodeType===Node.TEXT_NODE&&!n.textContent.trim(),'UI_STALE40_OUTSIDE_CONTENT');
  const one=selector=>{const all=[...box.querySelectorAll(selector)];need(all.length===1,'UI_STALE40_SOLUTION_ROLE_COUNT');return all[0];};
  const answer=one('.sol-ans'),explanation=one('.sol-exp');one('.q-num');one('[data-semantic-content="1"]');one('.sol-meta');
  need(meta.contains(answer)&&meta.contains(explanation)&&meta.contains(image)&&number.children.length===0&&number.textContent.trim()===String(scope.ordinal)+'.',
    'UI_STALE40_SOLUTION_ROLE_BINDING');
  const expected='https://img.wangjiedu.com/exams/images/'+scope.assetRef.path.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
  need(image.tagName==='IMG'&&!image.hasAttribute('srcset')&&image.src===expected&&(image.currentSrc||image.src)===expected&&image.complete&&image.naturalWidth>0&&image.naturalHeight>0,
    'UI_STALE40_SOLUTION_IMAGE');
  const question=rect(box);for(const e of [box,number,semantic,meta,answer,explanation,image])need(visible(e)&&inside(rect(e),question),'UI_STALE40_SOLUTION_ROLE_CLIPPED');
  const chunks=[...explanation.querySelectorAll(':scope > .sol-chunk')],er=rect(explanation);
  const decision=AppState.solutionDecisionLedger?.blocks?.find(x=>x.blockId===box.dataset.solutionDecisionBlockId);
  const expectedChunkCount=Number.isInteger(decision?.actualChunkCount)?decision.actualChunkCount:decision?.chunks?.length;
  need(Number.isInteger(expectedChunkCount)&&expectedChunkCount>0&&chunks.length===expectedChunkCount,'UI_STALE40_SOLUTION_CHUNKS');
  for(const c of chunks)need((!c.textContent.trim()&&!c.querySelector('img,svg,math,mjx-container'))||visible(c)&&inside(rect(c),er),'UI_STALE40_SOLUTION_CHUNK_CLIPPED');
  // Reject hidden meaningful descendants and active nodes before capturing the
  // whole original roles. Generated MathJax descendants are checked as atoms.
  const walk=n=>{
    if(n.nodeType===Node.TEXT_NODE){if(!n.textContent.trim())return;need(visible(n.parentElement),'UI_STALE40_SOLUTION_HIDDEN_TEXT');
      const range=document.createRange();range.selectNodeContents(n);const rs=[...range.getClientRects()].filter(positive);need(rs.length&&rs.every(r=>inside(r,question)),'UI_STALE40_SOLUTION_TEXT_RANGE');return;}
    if(n.nodeType===Node.COMMENT_NODE)return;need(n.nodeType===Node.ELEMENT_NODE,'UI_STALE40_SOLUTION_NODE');
    need(!['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FOREIGNOBJECT'].includes(n.tagName)&&!n.hasAttribute('hidden')&&n.getAttribute('aria-hidden')!=='true','UI_STALE40_SOLUTION_ACTIVE_OR_HIDDEN');
    if(n.tagName==='BR'){need(n.childNodes.length===0,'UI_STALE40_SOLUTION_BREAK');return;}
    if(n.textContent.trim()||n.querySelector('img,svg,math,mjx-container'))need(visible(n)&&inside(rect(n),question),'UI_STALE40_SOLUTION_HIDDEN_CONTENT');
    if(n.tagName==='MJX-CONTAINER'){need(n.querySelectorAll('mjx-merror,[data-mjx-error],script,iframe,object,embed').length===0,'UI_STALE40_SOLUTION_MATH');return;}
    if(n.tagName==='IMG'){need(n.complete&&n.naturalWidth>0&&visible(n)&&inside(rect(n),question),'UI_STALE40_SOLUTION_IMAGE');return;}
    for(const child of n.childNodes)walk(child);
  };
  for(const n of box.childNodes)walk(n);
  const placements=(AppState.solutionObservedPlacementLedger||[]).filter(x=>x.questionKey===source);
  need(placements.length===1&&placements[0].blockId===box.dataset.solutionLayoutBlockId&&!placements[0].continuationOf,'UI_STALE40_SOLUTION_PLACEMENT');
  const digest=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
  const surface={schemaVersion:'archive-m2s1-stale40-single-solution-v1',questionUid:scope.questionUid,sourceOrdinal:scope.ordinal,sourceMatchesSelected,
    sourceFragments:1,numberCount:1,semanticCount:1,metaCount:1,answerCount:1,explanationCount:1,selectedImageCount:1,outerElementCount:3,
    nestedQuestionCount:0,nonemptyOutsideNodes:0,visibleRoles:true,expectedChunkCount,chunkCount:chunks.length,placementCount:1,allChunksInside:true,
    sourceRefSha256:await digest(source),layoutLedgerSha256:await digest(JSON.stringify({decision,placements}))};
  const obstructions=[...document.querySelectorAll('body *')].filter(e=>!box.contains(e)&&!e.contains(box)&&['fixed','sticky'].includes(getComputedStyle(e).position)&&visible(e)).map(rect)
    .filter(r=>r.x<innerWidth&&r.x+r.width>0&&r.y<innerHeight&&r.y+r.height>0),panel=document.getElementById('ap-archive-render-feedback');
  return {surface,question,children:[number,semantic,meta].map(rect),image:rect(image),emptyAnswerBox:null,viewport:{width:innerWidth,height:innerHeight},
    scroll:{x:scrollX,y:scrollY},obstructions,feedbackIdle:!panel||panel.hidden||!visible(panel),readiness:JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state,
    mode:AppState.mode,solutionNodes:document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
    questionNumber:number.textContent.trim(),mandatoryChildrenVisible:true,domSha256:await digest(box.outerHTML)};
}

function documentFrame(frame, policy) {
  if (policy.surface==='PROBLEM') assertNativeTopology(frame.surface,policy); else assertSolutionTopology(frame.surface,policy);
  assert(frame.mandatoryChildrenVisible===true,'UI_STALE40_REQUIRED_HIDDEN');
  assert(frame.scroll&&Number.isFinite(frame.scroll.x)&&Number.isFinite(frame.scroll.y),'UI_STALE40_SCROLL');
  assert.deepEqual(frame.viewport,policy.viewport,'UI_STALE40_VIEWPORT');
  assert.equal(frame.questionNumber,String(policy.ordinal)+'.','UI_STALE40_VISIBLE_ORDINAL');
  const doc=r=>{checkedRect(r);return{x:r.x+frame.scroll.x,y:r.y+frame.scroll.y,width:r.width,height:r.height};};
  let emptyAnswerBox=null;
  if(frame.emptyAnswerBox){const a=frame.emptyAnswerBox;assert(['x','y','width','height'].every(k=>Number.isFinite(a[k]))&&a.width>0&&a.height===0,'UI_STALE40_EMPTY_ANSWER_GEOMETRY');
    emptyAnswerBox={x:a.x+frame.scroll.x,y:a.y+frame.scroll.y,width:a.width,height:0};}
  return {surface:frame.surface,question:doc(frame.question),content:doc(problemContentClip(frame)),children:frame.children.map(doc),image:doc(frame.image),
    emptyAnswerBox,viewport:frame.viewport,questionNumber:frame.questionNumber};
}

function assertSolutionTile(frame,tile) {
  const full=problemContentClip(frame),s=tile.relativeInterval,v=frame.viewport;
  assert(Array.isArray(s)&&s.length===2&&s.every(Number.isFinite)&&s[0]>=0&&s[1]<=full.height&&s[1]>s[0],'UI_SCROLL_TILE_RANGE');
  const clip=checkedRect({x:full.x,y:full.y+s[0],width:full.width,height:s[1]-s[0]});
  assert(frame.feedbackIdle===true,'UI_RENDER_FEEDBACK_NOT_IDLE');
  assert(frame.readiness==='RENDER_READY'&&frame.mode==='sol'&&Number.isSafeInteger(frame.solutionNodes)&&frame.solutionNodes>0,'UI_STALE40_SOLUTION_RENDER_STATE');
  assert(frame.mandatoryChildrenVisible===true,'UI_STALE40_REQUIRED_HIDDEN');
  assert(clip.x>=0&&clip.y>=0&&clip.x+clip.width<=v.width&&clip.y+clip.height<=v.height,'UI_SCROLL_TILE_OUTSIDE_VIEWPORT');
  assert(Array.isArray(frame.obstructions)&&frame.obstructions.every(r=>!overlap(clip,checkedRect(r))),'UI_CAPTURE_OBSCURED');return clip;
}

function inspectCaptureHits(image,clip){
  const box=image.closest('.q-box');let samples=0,outsideQuestion=0;const xs=[clip.x+1.5],ys=[clip.y+1.5];
  for(let x=clip.x+17.5;x<clip.x+clip.width-1.5;x+=16)xs.push(x);
  for(let y=clip.y+17.5;y<clip.y+clip.height-1.5;y+=16)ys.push(y);
  xs.push(clip.x+clip.width-1.5);ys.push(clip.y+clip.height-1.5);
  for(const x of xs)for(const y of ys){samples++;const top=document.elementFromPoint(x,y);if(!top||(top!==box&&!box.contains(top)))outsideQuestion++;}
  return{samples,outsideQuestion};
}

async function captureObservedTiles(page, target, file, policy) {
  assert(issued.has(policy),'UI_STALE40_POLICY_NOT_ISSUED');
  assert(policy.surface==='SOLUTION'||policy.nativeAtoms,'UI_STALE40_ADAPTER_SCOPE');
  const measure=policy.surface==='PROBLEM'?measureNativeAtoms:measureSingleSolution;
  const assertTile=policy.surface==='PROBLEM'?assertProblemTileCapture:assertSolutionTile;
  try {
    await page.waitForFunction(() => {
      const panel = document.getElementById('ap-archive-render-feedback');
      return !panel || panel.hidden || getComputedStyle(panel).display === 'none';
    }, null, { timeout: 15000 });
  } catch { throw new Error('UI_RENDER_FEEDBACK_NOT_IDLE'); }
  let frame = await target.evaluate(measure,policy);
  assert(frame.mandatoryChildrenVisible === true, 'UI_REQUIRED_PROBLEM_CHILD_HIDDEN');
  const original = documentFrame(frame,policy), originalDomSha256 = frame.domSha256, scrollBefore = frame.scroll;
  const plan = planProblemTiles(frame), tiles = [];
  for (const tile of plan.tiles) {
    let scrollOperations = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      const step = planProblemTileScroll(frame, tile);
      if (Math.abs(step.scrollByY) < 0.5) break;
      await page.evaluate(delta => window.scrollBy({ top: delta, left: 0, behavior: 'instant' }), step.scrollByY);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      scrollOperations++; frame = await target.evaluate(measure,policy);
    }
    assert.equal(frame.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_SCROLL');
    assert.deepEqual(documentFrame(frame,policy), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const clip = assertTile(frame, tile), hits = await target.evaluate(inspectCaptureHits, clip);
    assert(hits.samples > 0 && hits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    const tileFile = file.replace(/\.png$/, '') + `-tile-${String(tile.tileIndex).padStart(2, '0')}.png`;
    await page.screenshot({ path: tileFile, clip, fullPage: false, caret: 'initial', timeout: 15000 });
    const after = await target.evaluate(measure,policy);
    assert.deepEqual(assertTile(after, tile), clip, 'UI_CAPTURE_GEOMETRY_CHANGED');
    assert.deepEqual(after.scroll, frame.scroll, 'UI_CAPTURE_SCROLLED');
    assert.equal(after.domSha256, originalDomSha256, 'UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE');
    assert.deepEqual(documentFrame(after,policy), original, 'UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED');
    const afterHits = await target.evaluate(inspectCaptureHits, clip);
    assert(afterHits.samples > 0 && afterHits.outsideQuestion === 0, 'UI_CAPTURE_FOREIGN_CONTENT');
    tiles.push({ ...tile, filename: path.basename(tileFile), clip, scroll: after.scroll, scrollOperations,
      feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: hits.samples + afterHits.samples,
      foreignContentHits: 0, domSha256: originalDomSha256 });
    frame = after;
  }
  return { surface:original.surface, capture:{ schemaVersion: policy.surface==='PROBLEM'?TILE_SCHEMA:'archive-solution-scroll-coverage-v1', method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: TILE_LIMIT,
    overlapCssPixels: TILE_OVERLAP, tileCount: tiles.length, content: original.content, question: original.question,
    viewport: original.viewport, visibleChildren: original.children.length, coverage: assertTileCoverage(original.content.height, tiles),
    tiles, scrollBefore, scrollAfter: frame.scroll, scrollOperations: tiles.reduce((sum, row) => sum + row.scrollOperations, 0),
    domSha256: originalDomSha256, feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0,
    compositeImageCreated: false } };
}

async function capture(page,target,file,policy,fragmentPolicy=null){
  assert(issued.has(policy),'UI_STALE40_POLICY_NOT_ISSUED');
  if(policy.surface==='SOLUTION'){
    if(policy.questionUid===Fragments.UID){assert(fragmentPolicy,'UI_STALE40_FRAGMENT_POLICY');const c=await Fragments.capture(page,target,file,fragmentPolicy);
      return{surface:{schemaVersion:'archive-m2s1-stale40-reused-e051-fragments-v1',questionUid:policy.questionUid,sourceOrdinal:15,fragmentCount:2},capture:c};}
    return captureObservedTiles(page,target,file,policy);
  }
  const measured=await target.evaluate(Surface.measureM1ProblemCapture);
  if(measured.surface.semanticChildCount>=3){Surface.assertSurfaceTopology(measured.surface);return Surface.captureM1ProblemTiles(page,target,file);}
  assert(policy.nativeAtoms,'UI_NATIVE_SURFACE_COMPLETENESS');
  return captureObservedTiles(page,target,file,policy);
}

module.exports={MANIFEST_PATH,MANIFEST_SHA,NATIVE_KEYS,SOLUTION_KEYS,makePolicy,assertNativeTopology,measureNativeAtoms,
  assertSolutionTopology,measureSingleSolution,documentFrame,assertSolutionTile,inspectCaptureHits,captureObservedTiles,capture};
