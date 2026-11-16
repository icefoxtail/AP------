"use strict";
// A closed capture of the existing M2S1-E035-Q19 primary and continuation shells.
// The shared single-fragment helper and its default guards remain unchanged.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const SCHEMA='archive-remaining-figure3-solution-fragment-scroll-coverage-v1';
const POLICY_SCHEMA='archive-m2s1-e035-q19-exact-two-solution-fragments-v1';
const HELPER_PATH='tools/remaining-figure3-solution-fragments.cjs';
const UID='qid_v1_50ad9d7ca3a5a9b9bb98771d205ff88250f1de608f14e123d0ea1d3d1e26f758';
const SOURCE='archive/exams/original/middle/m2/1final/22_연향중_1학기_기말_중2_기출.js';
const ASSET='archive/assets/images/22_연향중_1학기_기말_중2_기출/q19-solution-visual-v2.svg';
const MANIFEST='tests/fixtures/archive-remaining-figure3-solution-ui.json';
const HEX=/^[a-f0-9]{64}$/,OID=/^[a-f0-9]{40}$/;
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const equal=(a,b)=>stable(a)===stable(b);
const exact=(x,keys,code)=>assert(x&&typeof x==='object'&&!Array.isArray(x)&&equal(Object.keys(x).sort(),keys.slice().sort()),code);
const issued=new WeakSet();
const refKeys=['commit','path','gitBlobSha1','sha256','bytes'];
const policyKeys=['schemaVersion','questionUid','sourceOrdinal','expectedFragmentCount','wholeQuestionSha256','sourceRef','assetRef','manifestRef','helperRef'];
function assertPolicy(p){
 exact(p,policyKeys,'UI_FIGURE3_E035_Q19_POLICY_KEYS');
 assert(p.schemaVersion===POLICY_SCHEMA&&p.questionUid===UID&&p.sourceOrdinal===19&&p.expectedFragmentCount===2&&p.wholeQuestionSha256==='43d3a68a8f5466787f47b1760fa2fb8b83bceea87858839daf11cc8e96982059','UI_FIGURE3_E035_Q19_POLICY_SCOPE');
 const specs=[
  ['sourceRef',SOURCE,'ebd499cd5e52824ad9eb2597c8108ada013f2bc4','de15541161f629958edf4daed26bb139215222ee8a1cdf416851b58f92b9d97d',43228],
  ['assetRef',ASSET,'e389d2cf614c0ef86aea7f26d326a0690b4cdeaa','b68e58264ae35ffbd16794616a76db26e544ba688d983ed0937f0daeafa2c459',24171],
  ['manifestRef',MANIFEST,'facd22af64e1b01786cc392c5363416a08790aab','0a21dab9a8462ec9c872ff6d1b348e0f7c0c49c636e1e732931d936e50c6469a',3544]
 ];
 for(const [key,pathname,oid,hash,bytes] of specs){const r=p[key];exact(r,refKeys,'UI_FIGURE3_E035_Q19_REF_KEYS');assert(OID.test(r.commit)&&r.path===pathname&&r.gitBlobSha1===oid&&r.sha256===hash&&r.bytes===bytes,'UI_FIGURE3_E035_Q19_REF_BINDING');}
 exact(p.helperRef,refKeys,'UI_FIGURE3_E035_Q19_HELPER_REF_KEYS');assert(p.helperRef.path===HELPER_PATH&&OID.test(p.helperRef.gitBlobSha1)&&HEX.test(p.helperRef.sha256)&&Number.isSafeInteger(p.helperRef.bytes)&&p.helperRef.bytes>0,'UI_FIGURE3_E035_Q19_HELPER_REF');
 assert([p.assetRef,p.manifestRef,p.helperRef].every(r=>r.commit===p.sourceRef.commit),'UI_FIGURE3_E035_Q19_ONE_CHECKOUT');return p;
}
function makePolicy(reader,item){
 assert(item.questionUid===UID&&item.sourceOrdinal===19&&item.expectedBankCount===24&&item.sourcePath===SOURCE&&item.questionSha256==='43d3a68a8f5466787f47b1760fa2fb8b83bceea87858839daf11cc8e96982059','UI_FIGURE3_E035_Q19_PREFLIGHT_SCOPE');
 const p={schemaVersion:POLICY_SCHEMA,questionUid:UID,sourceOrdinal:19,expectedFragmentCount:2,wholeQuestionSha256:item.questionSha256,
 sourceRef:reader.ref(SOURCE),assetRef:reader.ref(ASSET),manifestRef:reader.ref(MANIFEST),helperRef:reader.ref(HELPER_PATH)};
 assertPolicy(p);assert.deepEqual(item.sourceRef,p.sourceRef);assert.deepEqual(item.assetRefs,[p.assetRef]);
 for(const r of [p.sourceRef,p.assetRef,p.manifestRef,p.helperRef])Object.freeze(r);Object.freeze(p);issued.add(p);return p;
}
const rect=r=>{exact(r,['x','y','width','height'],'UI_FIGURE3_E035_Q19_RECT_KEYS');assert(r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]))&&r.width>0&&r.height>0,'UI_FIGURE3_E035_Q19_RECT');return r;};
const overlaps=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
function assertRoles(f,index){
 assert(index===1||index===2,'UI_FIGURE3_E035_Q19_FRAGMENT_INDEX');
 const expected=index===1?{number:1,semantic:1,answer:1,explanation:1,caption:1,selectedImage:1}:{number:0,semantic:0,answer:0,explanation:1,caption:0,selectedImage:0};
 exact(f.roles,Object.keys(expected),'UI_FIGURE3_E035_Q19_ROLES');
 for(const [k,n] of Object.entries(expected)){exact(f.roles[k],['count','visible'],'UI_FIGURE3_E035_Q19_ROLE');assert(f.roles[k].count===n&&f.roles[k].visible===n,'UI_FIGURE3_E035_Q19_REQUIRED_ROLE');}
 assert(f.boxVisible===true&&f.completeChildrenVisible===true&&f.chunksInsideExplanation===true,'UI_FIGURE3_E035_Q19_CHILDREN_VISIBLE');
 assert(f.questionNumber===(index===1?'19.':null),'UI_FIGURE3_E035_Q19_VISIBLE_ORDINAL');
 assert(Array.isArray(f.children)&&f.children.length===(index===1?3:1),'UI_FIGURE3_E035_Q19_DIRECT_CHILDREN');
 assert(Number.isSafeInteger(f.chunkCount)&&f.chunkCount>0,'UI_FIGURE3_E035_Q19_FRAGMENT_CHUNKS');
}
function contentClip(f){
 assertRoles(f,f.fragmentIndex);const box=rect(f.question),children=f.children.map(rect);
 assert(children.every(c=>c.x>=box.x-1&&c.y>=box.y-1&&c.x+c.width<=box.x+box.width+1&&c.y+c.height<=box.y+box.height+1),'UI_FIGURE3_E035_Q19_CHILD_CLIPPED');
 const top=Math.max(box.y,Math.min(...children.map(c=>c.y))-2),bottom=Math.min(box.y+box.height,Math.max(...children.map(c=>c.y+c.height))+2);
 return rect({x:box.x,y:top,width:box.width,height:bottom-top});
}
function intervals(f){
 const clip=contentClip(f),v=f.viewport;assert(v&&v.width===1440&&v.height===1000,'UI_FIGURE3_E035_Q19_VIEWPORT');
 assert(clip.x>=0&&clip.x+clip.width<=v.width&&Array.isArray(f.obstructions),'UI_FIGURE3_E035_Q19_HORIZONTAL_CLIP');
 const blocked=f.obstructions.map(rect).filter(r=>r.x<clip.x+clip.width&&r.x+r.width>clip.x).map(r=>[Math.max(0,r.y-8),Math.min(v.height,r.y+r.height+8)]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);
 const free=[];let start=8;for(const [a,b]of blocked){if(a>start)free.push([start,a]);start=Math.max(start,b);}if(start<v.height-8)free.push([start,v.height-8]);return{clip,free};
}
function coverage(height,tiles){
 assert(Number.isFinite(height)&&height>0&&Array.isArray(tiles)&&tiles.length>0&&tiles.length<=8,'UI_FIGURE3_E035_Q19_TILE_INVENTORY');
 for(let i=0;i<tiles.length;i++){const t=tiles[i],s=t.relativeInterval;assert(t.fragmentTileIndex===i+1&&Array.isArray(s)&&s.length===2&&s.every(Number.isFinite)&&s[0]>=0&&s[1]<=height&&s[1]>s[0],'UI_FIGURE3_E035_Q19_TILE_RANGE');
 if(i===0)assert(s[0]===0,'UI_FIGURE3_E035_Q19_TOP_MISSING');else{const a=tiles[i-1].relativeInterval;assert(s[0]>a[0]&&s[1]>a[1]&&a[1]-s[0]===32,'UI_FIGURE3_E035_Q19_TILE_OVERLAP');}}
 assert(tiles.at(-1).relativeInterval[1]===height,'UI_FIGURE3_E035_Q19_BOTTOM_MISSING');return{requiredInterval:[0,height],coveredInterval:[0,height],complete:true};
}
function planTiles(f){const {clip,free}=intervals(f),cap=Math.max(0,...free.map(([a,b])=>b-a));assert(cap>0&&(clip.height<=cap||cap>=64),'UI_FIGURE3_E035_Q19_VISIBLE_AREA');const tiles=[];let start=0;while(true){const end=Math.min(clip.height,start+cap);tiles.push({fragmentTileIndex:tiles.length+1,relativeInterval:[start,end]});assert(tiles.length<=8,'UI_FIGURE3_E035_Q19_TILE_LIMIT');if(end===clip.height)break;start=end-32;}coverage(clip.height,tiles);return tiles;}
function tileClip(f,t){const c=contentClip(f),s=t.relativeInterval;assert(Array.isArray(s)&&s.length===2&&s[0]>=0&&s[1]<=c.height&&s[1]>s[0],'UI_FIGURE3_E035_Q19_TILE_RANGE');return rect({x:c.x,y:c.y+s[0],width:c.width,height:s[1]-s[0]});}
function scrollPlan(f,t){const{free}=intervals(f),clip=tileClip(f,t),fits=free.filter(([a,b])=>b-a>=clip.height);assert(fits.length,'UI_FIGURE3_E035_Q19_TILE_DOES_NOT_FIT');const clear=fits.find(([a,b])=>clip.y>=a&&clip.y+clip.height<=b),selected=clear||fits.sort((a,b)=>(b[1]-b[0])-(a[1]-a[0]))[0];return{scrollByY:clear?0:clip.y-selected[0],clip};}
function assertTileFrame(f,t){const c=tileClip(f,t),v=f.viewport;assert(f.feedbackIdle&&f.readiness==='RENDER_READY'&&f.mode==='sol'&&f.sourceFragments===2&&f.solutionNodes>0,'UI_FIGURE3_E035_Q19_RENDER_STATE');assert(c.x>=0&&c.y>=0&&c.x+c.width<=v.width&&c.y+c.height<=v.height,'UI_FIGURE3_E035_Q19_TILE_OUTSIDE_VIEWPORT');assert(f.obstructions.every(r=>!overlaps(c,rect(r))),'UI_FIGURE3_E035_Q19_OBSCURED');return c;}
function documentFrame(f){const cv=r=>({x:r.x+f.scroll.x,y:r.y+f.scroll.y,width:r.width,height:r.height});return{fragmentIndex:f.fragmentIndex,question:cv(f.question),content:cv(contentClip(f)),children:f.children.map(cv),roles:f.roles,questionNumber:f.questionNumber,domSha256:f.domSha256,chunkCount:f.chunkCount,blockId:f.blockId,sourceRefSha256:f.sourceRefSha256,solutionHtmlSha256:f.solutionHtmlSha256};}
function assertGroup(g){
 assert(g&&g.sourceMatchesSelected===true&&g.sourceFragmentCount===2&&g.fragments.length===2&&g.mode==='sol'&&g.readiness==='RENDER_READY','UI_FIGURE3_E035_Q19_GROUP');
 assert(HEX.test(g.sourceRefSha256)&&HEX.test(g.solutionHtmlSha256)&&HEX.test(g.layoutLedgerSha256)&&Number.isSafeInteger(g.expectedChunkCount)&&g.expectedChunkCount>1,'UI_FIGURE3_E035_Q19_GROUP_PROVENANCE');
 assert(Array.isArray(g.placements)&&g.placements.length===2,'UI_FIGURE3_E035_Q19_LAYOUT_PLACEMENTS');
 const ids=[];for(let i=0;i<2;i++){const f=g.fragments[i],p=g.placements[i];exact(p,['blockId','questionKeySha256','continuationOf','placementOrder'],'UI_FIGURE3_E035_Q19_PLACEMENT_KEYS');assert(Number.isSafeInteger(p.placementOrder)&&p.placementOrder>=0,'UI_FIGURE3_E035_Q19_PLACEMENT_ORDER');assertRoles(f,i+1);assert(f.fragmentIndex===i+1&&f.sourceFragments===2&&f.sourceRefSha256===g.sourceRefSha256&&f.solutionHtmlSha256===g.solutionHtmlSha256&&HEX.test(f.domSha256),'UI_FIGURE3_E035_Q19_FRAGMENT_BINDING');
 assert(typeof f.blockId==='string'&&f.blockId&&p.blockId===f.blockId&&p.questionKeySha256===g.sourceRefSha256,'UI_FIGURE3_E035_Q19_BLOCK_ID');assert(p.continuationOf===(i===0?'':g.fragments[0].blockId),'UI_FIGURE3_E035_Q19_CONTINUATION_PARENT');ids.push(f.blockId);}
 assert(new Set(ids).size===2&&g.placements[1].placementOrder>g.placements[0].placementOrder,'UI_FIGURE3_E035_Q19_FRAGMENT_ORDER');
 assert(g.fragments.reduce((n,f)=>n+f.chunkCount,0)===g.expectedChunkCount,'UI_FIGURE3_E035_Q19_COMPLETE_CHUNK_COUNT');return g;
}
// This browser function only observes the existing DOM and production ledgers.
async function measureGroup(image){
 const box=image.closest('.sol-box'),source=box.dataset.sourceRef,all=[...document.querySelectorAll('#print-area .sol-box')].filter(x=>x.dataset.sourceRef===source);
 const digest=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
 const r=e=>{const a=e.getBoundingClientRect();return{x:a.x,y:a.y,width:a.width,height:a.height};};
 const visible=e=>{const c=getComputedStyle(e),a=e.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&c.visibility!=='collapse'&&Number(c.opacity)!==0&&a.width>0&&a.height>0;};
 const sourceHash=await digest(source||''),solutionHtml=box.dataset.solutionHtml||'',htmlHash=await digest(solutionHtml);
 const decision=AppState.solutionDecisionLedger?.blocks?.find(x=>x.blockId===box.dataset.solutionDecisionBlockId);
 const selectedPlacements=(AppState.solutionObservedPlacementLedger||[]).filter(x=>x.questionKey===source).sort((a,b)=>a.placementOrder-b.placementOrder);
 const placements=selectedPlacements.map(x=>({blockId:x.blockId,questionKeySha256:sourceHash,continuationOf:x.continuationOf||'',placementOrder:x.placementOrder}));
 const panel=document.getElementById('ap-archive-render-feedback'),ready=JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state;
 const fragments=[];
 for(let i=0;i<all.length;i++){const n=all[i],children=[];for(const child of n.childNodes){if(child.nodeType===Node.ELEMENT_NODE&&visible(child))children.push(r(child));else if(child.nodeType===Node.TEXT_NODE&&child.textContent.trim()){const range=document.createRange();range.selectNodeContents(child);const a=range.getBoundingClientRect();if(a.width>0&&a.height>0)children.push({x:a.x,y:a.y,width:a.width,height:a.height});}}
 const role=selector=>{const a=[...n.querySelectorAll(selector)];return{count:a.length,visible:a.filter(visible).length};};
 const explanation=n.querySelector('.sol-exp'),er=explanation?.getBoundingClientRect();const chunks=[...n.querySelectorAll('.sol-exp > .sol-chunk')];
 const meaningful=chunks.filter(x=>x.textContent.trim()||x.querySelector('img,svg,math,mjx-container'));
 fragments.push({fragmentIndex:i+1,question:r(n),children,viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},
 obstructions:[...document.querySelectorAll('body *')].filter(e=>!n.contains(e)&&!e.contains(n)&&['fixed','sticky'].includes(getComputedStyle(e).position)&&visible(e)).map(r).filter(a=>a.x<innerWidth&&a.x+a.width>0&&a.y<innerHeight&&a.y+a.height>0),
 feedbackIdle:!panel||panel.hidden||!visible(panel),readiness:ready,mode:AppState.mode,sourceFragments:all.length,solutionNodes:document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,
 questionNumber:n.querySelector('.q-num')?.textContent?.trim()??null,roles:{number:role('.q-num'),semantic:role(':scope > div[data-semantic-content="1"]'),answer:role('.sol-ans'),explanation:role('.sol-exp'),caption:role('.sol-image-caption'),selectedImage:role('img[src*="q19-solution-visual-v2.svg"]')},
 boxVisible:visible(n),completeChildrenVisible:[...n.children].every(c=>(!c.textContent.trim()&&!c.querySelector('img,svg,math,mjx-container'))||visible(c)),
 chunksInsideExplanation:!!er&&meaningful.every(c=>{const a=c.getBoundingClientRect();return visible(c)&&a.left>=er.left-1&&a.right<=er.right+1&&a.top>=er.top-1&&a.bottom<=er.bottom+1;}),chunkCount:chunks.length,
 blockId:n.dataset.solutionLayoutBlockId||'',sourceRefSha256:await digest(n.dataset.sourceRef||''),solutionHtmlSha256:await digest(n.dataset.solutionHtml||''),domSha256:await digest(n.outerHTML)});
 }
 return{sourceMatchesSelected:source===getArchiveQuestionSourceRef(AppState.data[18],18,AppState),sourceFragmentCount:all.length,sourceRefSha256:sourceHash,solutionHtmlSha256:htmlHash,expectedChunkCount:Number.isInteger(decision?.actualChunkCount)?decision.actualChunkCount:decision?.chunks?.length??null,layoutLedgerSha256:await digest(JSON.stringify({decision,placements:selectedPlacements})),placements,mode:AppState.mode,readiness:ready,fragments};
}
function inspectHits(image,{fragmentIndex,clip}){const source=image.closest('.sol-box').dataset.sourceRef,box=[...document.querySelectorAll('#print-area .sol-box')].filter(x=>x.dataset.sourceRef===source)[fragmentIndex-1];let samples=0,outsideQuestion=0;const xs=[clip.x+1.5],ys=[clip.y+1.5];for(let x=clip.x+17.5;x<clip.x+clip.width-1.5;x+=16)xs.push(x);for(let y=clip.y+17.5;y<clip.y+clip.height-1.5;y+=16)ys.push(y);xs.push(clip.x+clip.width-1.5);ys.push(clip.y+clip.height-1.5);for(const x of xs)for(const y of ys){samples++;const top=document.elementFromPoint(x,y);if(!top||(top!==box&&!box.contains(top)))outsideQuestion++;}return{samples,outsideQuestion};}
async function capture(page,target,file,policy){
 assert(issued.has(policy),'UI_FIGURE3_E035_Q19_POLICY_NOT_ISSUED');await page.waitForFunction(()=>{const p=document.getElementById('ap-archive-render-feedback');return !p||p.hidden||getComputedStyle(p).display==='none';},null,{timeout:15000});
 let g=await target.evaluate(measureGroup);try{assertGroup(g);}catch(e){e.captureDiagnostic=g;throw e;}
 const original=g.fragments.map(documentFrame),provenance={sourceRefSha256:g.sourceRefSha256,solutionHtmlSha256:g.solutionHtmlSha256,layoutLedgerSha256:g.layoutLedgerSha256,expectedChunkCount:g.expectedChunkCount,placements:g.placements};
 const unchanged=x=>{assertGroup(x);assert.deepEqual(x.fragments.map(documentFrame),original,'UI_FIGURE3_E035_Q19_DOCUMENT_CHANGED');for(const k of Object.keys(provenance))assert.deepEqual(x[k],provenance[k],'UI_FIGURE3_E035_Q19_PROVENANCE_CHANGED');};
 const fragments=[],allTiles=[];
 for(let index=1;index<=2;index++){let f=g.fragments[index-1];const before=f.scroll,tiles=[];for(const planned of planTiles(f)){let operations=0;for(let n=0;n<3;n++){const step=scrollPlan(f,planned);if(Math.abs(step.scrollByY)<0.5)break;await page.evaluate(d=>window.scrollBy({top:d,left:0,behavior:'instant'}),step.scrollByY);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));operations++;g=await target.evaluate(measureGroup);unchanged(g);f=g.fragments[index-1];}
 const clip=assertTileFrame(f,planned),hits=await target.evaluate(inspectHits,{fragmentIndex:index,clip});assert(hits.samples>0&&hits.outsideQuestion===0,'UI_FIGURE3_E035_Q19_FOREIGN_CONTENT');
 const tileIndex=allTiles.length+1;assert(tileIndex<=8,'UI_FIGURE3_E035_Q19_TOTAL_TILE_LIMIT');const tileFile=file.replace(/\.png$/,'')+'-tile-'+String(tileIndex).padStart(2,'0')+'.png';await page.screenshot({path:tileFile,clip,fullPage:false,caret:'initial',timeout:15000});
 const after=await target.evaluate(measureGroup);unchanged(after);const af=after.fragments[index-1];assert.deepEqual(assertTileFrame(af,planned),clip,'UI_FIGURE3_E035_Q19_GEOMETRY_CHANGED');assert.deepEqual(af.scroll,f.scroll,'UI_FIGURE3_E035_Q19_CAPTURE_SCROLLED');const ah=await target.evaluate(inspectHits,{fragmentIndex:index,clip});assert(ah.samples>0&&ah.outsideQuestion===0,'UI_FIGURE3_E035_Q19_FOREIGN_CONTENT');
 const t={...planned,tileIndex,fragmentIndex:index,filename:path.basename(tileFile),clip,scroll:af.scroll,scrollOperations:operations,feedbackIdle:true,obstructionsIntersectingClip:0,hitTestSamples:hits.samples+ah.samples,foreignContentHits:0,domSha256:f.domSha256};tiles.push(t);allTiles.push(t);g=after;f=af;}
 fragments.push({...original[index-1],boxVisible:f.boxVisible,completeChildrenVisible:f.completeChildrenVisible,chunksInsideExplanation:f.chunksInsideExplanation,visibleChildren:original[index-1].children.length,coverage:coverage(original[index-1].content.height,tiles),tiles,scrollBefore:before,scrollAfter:f.scroll});}
 const proof={schemaVersion:SCHEMA,method:'UNCHANGED_VIEWPORT_ALL_ORIGINAL_SOLUTION_FRAGMENTS',policy,...provenance,fragmentCount:2,fragments,viewport:{width:1440,height:1000},tileLimit:8,overlapCssPixels:32,tileCount:allTiles.length,tiles:allTiles,allOriginalFragmentsCaptured:true,feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false};validateCapture(proof,proof.viewport);return proof;
}
function validateCapture(c,viewport,screenshots){
 exact(c,['schemaVersion','method','policy','sourceRefSha256','solutionHtmlSha256','layoutLedgerSha256','expectedChunkCount','placements','fragmentCount','fragments','viewport','tileLimit','overlapCssPixels','tileCount','tiles','allOriginalFragmentsCaptured','feedbackIdle','foreignContentHits','cssWrites','domWrites','viewportChanges','compositeImageCreated'],'UI_FIGURE3_E035_Q19_CAPTURE_KEYS');
 assertPolicy(c.policy);assert(c.schemaVersion===SCHEMA&&c.method==='UNCHANGED_VIEWPORT_ALL_ORIGINAL_SOLUTION_FRAGMENTS'&&c.fragmentCount===2&&c.fragments.length===2,'UI_FIGURE3_E035_Q19_CAPTURE_SCOPE');
 assert(equal(viewport,{width:1440,height:1000})&&equal(c.viewport,viewport)&&c.tileLimit===8&&c.overlapCssPixels===32&&c.allOriginalFragmentsCaptured===true&&c.feedbackIdle===true&&c.foreignContentHits===0&&c.cssWrites===0&&c.domWrites===0&&c.viewportChanges===0&&c.compositeImageCreated===false,'UI_FIGURE3_E035_Q19_CAPTURE_INVARIANTS');
 assert(HEX.test(c.sourceRefSha256)&&HEX.test(c.solutionHtmlSha256)&&HEX.test(c.layoutLedgerSha256)&&Number.isSafeInteger(c.expectedChunkCount)&&c.expectedChunkCount>1,'UI_FIGURE3_E035_Q19_CAPTURE_PROVENANCE');
 assert(Array.isArray(c.tiles)&&Number.isSafeInteger(c.tileCount)&&c.tileCount>=2&&c.tileCount<=8&&c.tiles.length===c.tileCount&&equal(c.tiles,c.fragments.flatMap(f=>f.tiles)),'UI_FIGURE3_E035_Q19_ALL_TILES');
 assert(c.placements.length===2&&c.placements[0].continuationOf===''&&c.placements[1].continuationOf===c.placements[0].blockId&&c.placements[1].placementOrder>c.placements[0].placementOrder&&new Set(c.placements.map(p=>p.blockId)).size===2,'UI_FIGURE3_E035_Q19_LAYOUT_PLACEMENTS');
 for(const p of c.placements){exact(p,['blockId','questionKeySha256','continuationOf','placementOrder'],'UI_FIGURE3_E035_Q19_PLACEMENT_KEYS');assert(Number.isSafeInteger(p.placementOrder)&&p.placementOrder>=0,'UI_FIGURE3_E035_Q19_PLACEMENT_ORDER');}
 let globalIndex=0,totalChunks=0;for(let i=0;i<2;i++){const f=c.fragments[i];exact(f,['fragmentIndex','question','content','children','roles','questionNumber','domSha256','chunkCount','blockId','sourceRefSha256','solutionHtmlSha256','boxVisible','completeChildrenVisible','chunksInsideExplanation','visibleChildren','coverage','tiles','scrollBefore','scrollAfter'],'UI_FIGURE3_E035_Q19_FRAGMENT_KEYS');assertRoles(f,i+1);assert(f.fragmentIndex===i+1&&f.sourceRefSha256===c.sourceRefSha256&&f.solutionHtmlSha256===c.solutionHtmlSha256&&f.blockId===c.placements[i].blockId&&c.placements[i].questionKeySha256===c.sourceRefSha256&&HEX.test(f.domSha256)&&f.visibleChildren===f.children.length,'UI_FIGURE3_E035_Q19_FRAGMENT_PROVENANCE');
 assert(equal(contentClip({...f,fragmentIndex:i+1}),f.content),'UI_FIGURE3_E035_Q19_FRAGMENT_CONTENT');assert(equal(coverage(f.content.height,f.tiles),f.coverage),'UI_FIGURE3_E035_Q19_COMPLETE_FRAGMENT');totalChunks+=f.chunkCount;
 for(const scroll of [f.scrollBefore,f.scrollAfter]){exact(scroll,['x','y'],'UI_FIGURE3_E035_Q19_SCROLL_KEYS');assert(scroll.x===0&&Number.isFinite(scroll.y)&&scroll.y>=0,'UI_FIGURE3_E035_Q19_SCROLL');}
 for(const t of f.tiles){exact(t,['fragmentTileIndex','relativeInterval','tileIndex','fragmentIndex','filename','clip','scroll','scrollOperations','feedbackIdle','obstructionsIntersectingClip','hitTestSamples','foreignContentHits','domSha256'],'UI_FIGURE3_E035_Q19_TILE_KEYS');globalIndex++;assert(t.tileIndex===globalIndex&&t.fragmentIndex===i+1&&t.feedbackIdle===true&&t.obstructionsIntersectingClip===0&&t.foreignContentHits===0&&Number.isSafeInteger(t.hitTestSamples)&&t.hitTestSamples>=2&&t.domSha256===f.domSha256&&Number.isSafeInteger(t.scrollOperations)&&t.scrollOperations>=0&&t.scrollOperations<=3,'UI_FIGURE3_E035_Q19_TILE_PROOF');const a=rect(t.clip);assert(t.scroll&&Number.isFinite(t.scroll.x)&&Number.isFinite(t.scroll.y)&&a.x>=0&&a.y>=0&&a.x+a.width<=viewport.width&&a.y+a.height<=viewport.height,'UI_FIGURE3_E035_Q19_TILE_VIEWPORT');
 assert(Math.abs(a.x+t.scroll.x-f.content.x)<1e-6&&Math.abs(a.y+t.scroll.y-f.content.y-t.relativeInterval[0])<1e-6&&a.width===f.content.width&&Math.abs(a.height-(t.relativeInterval[1]-t.relativeInterval[0]))<1e-6,'UI_FIGURE3_E035_Q19_DOCUMENT_TILE_BINDING');
 assert(t.filename==='M2S1-E035-Q19-desktop-tile-'+String(globalIndex).padStart(2,'0')+'.png','UI_FIGURE3_E035_Q19_TILE_FILENAME');
 }}assert(totalChunks===c.expectedChunkCount,'UI_FIGURE3_E035_Q19_COMPLETE_CHUNK_COUNT');
 if(screenshots){assert(screenshots.length===c.tileCount,'UI_FIGURE3_E035_Q19_SCREENSHOT_COUNT');for(let i=0;i<screenshots.length;i++){const s=screenshots[i];exact(s,['tileIndex','path','sha256','bytes'],'UI_FIGURE3_E035_Q19_SCREENSHOT_KEYS');assert(s.tileIndex===i+1&&s.path===c.tiles[i].filename&&HEX.test(s.sha256)&&Number.isSafeInteger(s.bytes)&&s.bytes>0,'UI_FIGURE3_E035_Q19_SCREENSHOT_BINDING');}}
 return true;
}
module.exports={SCHEMA,POLICY_SCHEMA,HELPER_PATH,UID,assertPolicy,makePolicy,assertRoles,contentClip,coverage,planTiles,scrollPlan,assertTileFrame,documentFrame,assertGroup,measureGroup,capture,validateCapture,stable,sha};
