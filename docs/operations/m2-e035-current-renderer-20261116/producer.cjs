'use strict';
// Exact-source, read-only E035 preview evidence. This producer grants no approval.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const args=process.argv.slice(2),arg=(k)=>args[args.indexOf(k)+1];
const REPO=path.resolve(arg('--repo')),COMMIT=arg('--commit'),OUT=path.resolve(arg('--output'));
const PRODUCER_PATH='docs/operations/m2-e035-current-renderer-20261116/producer.cjs';
const PRODUCER_COMMIT=arg('--producer-commit');
assert.equal(process.env.GITHUB_ACTIONS,'true','SUPPORTED_ACTIONS_RUNNER_REQUIRED');
const SOURCE='archive/exams/original/middle/m2/2final/21_연향중_2학기_기말_중2_기출.js';
const UID='qid_v1_aaa151978fdd692262dad4377577bb5ee6e5b89c725920ab21afae3ea603f5c8';
const PROBLEM='archive/assets/images/21_연향중_2학기_기말_중2_기출/q12-problem-visual-v2.svg';
const SOLUTION='archive/assets/images/21_연향중_2학기_기말_중2_기출/q12-solution-visual-v2.svg';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
const stable=v=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const git=(a)=>execFileSync('git',['-C',REPO,...a],{maxBuffer:128*1024*1024,timeout:120000});
assert(/^[a-f0-9]{40}$/.test(COMMIT)&&/^[a-f0-9]{40}$/.test(PRODUCER_COMMIT),'PUBLIC_COMMITS_REQUIRED');
const tree=new Map(git(['ls-tree','-r','-z',COMMIT]).toString().split('\0').filter(Boolean).map(row=>{const tab=row.indexOf('\t');const [mode,type,oid]=row.slice(0,tab).split(' ');return[row.slice(tab+1),{mode,type,oid}];}));
const cache=new Map(),served=new Map(),mirrored=new Map();
function read(rel){assert(typeof rel==='string'&&!path.posix.isAbsolute(rel)&&!rel.includes('\\')&&path.posix.normalize(rel)===rel&&!rel.split('/').includes('..'),'SAFE_PATH');const e=tree.get(rel);assert(e&&e.type==='blob'&&['100644','100755'].includes(e.mode),'TRACKED_REGULAR_FILE');if(!cache.has(rel)){const b=git(['cat-file','blob',e.oid]);assert.equal(blob(b),e.oid,'RAW_GIT_BLOB');cache.set(rel,b);}return cache.get(rel);}
function ref(rel){const b=read(rel);return{commit:COMMIT,path:rel,gitBlobSha1:blob(b),sha256:sha(b)};}
const producerBytes=git(['show',PRODUCER_COMMIT+':'+PRODUCER_PATH]);assert.equal(sha(producerBytes),sha(fs.readFileSync(__filename)),'PRODUCER_EXACT_PUBLIC_BYTES');
const producerRef={commit:PRODUCER_COMMIT,path:PRODUCER_PATH,gitBlobSha1:blob(producerBytes),sha256:sha(producerBytes)};
const helperPath='tools/check-reviewed-problem-renderer-browser.cjs',helperBytes=read(helperPath);
assert.equal(sha(helperBytes),'94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4','FROZEN_TILE_HELPER');
fs.mkdirSync(OUT,{recursive:true});const helperLocal=path.join(OUT,'tile-helper.cjs');fs.writeFileSync(helperLocal,helperBytes);
const helper=require(helperLocal);
const sandbox={window:{},console:{log(){},warn(){},error(){}}};vm.runInNewContext(read(SOURCE).toString(),sandbox,{timeout:1000});
const bank=JSON.parse(JSON.stringify(sandbox.window.questionBank));assert(Array.isArray(bank)&&bank.length===21,'SOURCE_DENOMINATOR');
assert.equal(bank[11].image,PROBLEM.slice('archive/'.length));assert.equal(bank[11].solutionImage,SOLUTION.slice('archive/'.length));
const questionsRaw=JSON.stringify(bank),metaRaw=JSON.stringify({title:sandbox.window.examTitle,qpp:4});
const transportMetadata={mode:'LEGACY_MIXED_STORAGE',storageKeys:['mixedQuestions','mixedMeta'],questionCount:21,mixedQuestionsSha256:sha(stable(bank)),mixedMetaSha256:sha(metaRaw),sourceOverlayCount:0};
const mime=rel=>({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'}[path.extname(rel)]||'application/octet-stream');
const failures=[],cases=[],externalResources=[],captureSettles=[],capturePixels=[];
// Diagnostics only: capped history and capped element rows never establish a PASS.
const mandatoryDiagnostics={schemaVersion:'archive-e035-mandatory-visibility-diagnostics-v1',maximumSnapshots:64,maximumDirectChildren:32,measurementCount:0,droppedSnapshots:0,snapshots:[]};
function recordMandatoryDiagnostic(stage,frame,tileIndex=null){
 const snapshot={measurement:++mandatoryDiagnostics.measurementCount,caseId:activeCase,stage,tileIndex,mandatoryChildrenVisible:frame.mandatoryChildrenVisible,feedbackIdle:frame.feedbackIdle,readiness:frame.readiness,domSha256:frame.domSha256,scroll:frame.scroll,viewportMetrics:frame.viewportMetrics,details:frame.mandatoryVisibility};
 if(mandatoryDiagnostics.snapshots.length===mandatoryDiagnostics.maximumSnapshots){mandatoryDiagnostics.snapshots.shift();mandatoryDiagnostics.droppedSnapshots++;}
 mandatoryDiagnostics.snapshots.push(snapshot);
}
const server=http.createServer((req,res)=>{try{const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'');if(rel==='favicon.ico'){res.writeHead(204);res.end();return;}const b=read(rel);served.set(rel,ref(rel));res.writeHead(200,{'content-type':mime(rel),'cache-control':'no-store'});res.end(b);}catch(e){failures.push({kind:'STATIC',requestSha256:sha(req.url||''),code:e.code||e.message.split('\n')[0]});res.writeHead(404);res.end();}});
// Measurement only: no browser DOM/style/viewport replacement establishes evidence.
async function measure(selector){
 const matches=document.querySelectorAll(selector);if(matches.length!==1)throw Error('UNIQUE_SELECTED_ASSET');const image=matches[0];if(!image.isConnected||!document.contains(image))throw Error('SELECTED_ASSET_DETACHED');
 const box=image.closest('.q-box');if(!box)throw Error('SELECTED_CONTAINER_MISSING');
 const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
 const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&s.visibility!=='collapse'&&+s.opacity!==0&&r.width>0&&r.height>0;};
 // No text, attribute values, URLs, innerHTML or outerHTML are emitted here.
 // The original predicate below is retained verbatim; these reads only explain it.
 const mandatoryVisibilitySnapshot=()=>{
  const maximumDirectChildren=32,allChildren=[...box.children],number=box.querySelector('.q-num');
  const describe=(element,role,index,required=true)=>{
   if(!element)return{role,index,present:false,required,isConnected:false,inDocument:false,tag:null,rect:null,style:null,styleTruncated:[],isVisible:false,passesRequirement:!required};
   const s=getComputedStyle(element),r=rect(element),style={},styleTruncated=[];
   for(const key of ['display','visibility','opacity','position','contentVisibility','overflowX','overflowY','transform']){
    const value=String(s[key]||'');style[key]=value.slice(0,128);if(value.length>128)styleTruncated.push(key);
   }
   const isVisible=s.display!=='none'&&s.visibility!=='hidden'&&s.visibility!=='collapse'&&+s.opacity!==0&&r.width>0&&r.height>0;
   return{role,index,present:true,required,isConnected:element.isConnected,inDocument:document.contains(element),tag:element.localName.slice(0,64),rect:r,style,styleTruncated,isVisible,passesRequirement:!required||isVisible};
  };
  const fixed=[describe(box,'box',null),describe(image,'selected-image',null),describe(number,'question-number',null)];
  const directChildren=allChildren.slice(0,maximumDirectChildren).map((element,index)=>{
   const hasText=!!element.textContent.trim(),hasMediaDescendant=!!element.querySelector('img,svg,math,mjx-container');
   return{...describe(element,'direct-child',index,hasText||hasMediaDescendant),hasText,hasMediaDescendant};
  });
  return{maximumDirectChildren,totalDirectChildren:allChildren.length,recordedDirectChildren:directChildren.length,truncated:allChildren.length>maximumDirectChildren,fixed,directChildren};
 };
 const children=[];for(const child of box.childNodes){if(child.nodeType===1&&visible(child))children.push(rect(child));else if(child.nodeType===3&&child.textContent.trim()){const range=document.createRange();range.selectNodeContents(child);const r=range.getBoundingClientRect();if(r.width>0&&r.height>0)children.push({x:r.x,y:r.y,width:r.width,height:r.height});}}
 const obstructions=[...document.querySelectorAll('body *')].filter(e=>!box.contains(e)&&!e.contains(box)&&['fixed','sticky'].includes(getComputedStyle(e).position)&&visible(e)).map(rect).filter(r=>r.x<innerWidth&&r.x+r.width>0&&r.y<innerHeight&&r.y+r.height>0);
 const panel=document.getElementById('ap-archive-render-feedback'),domSnapshot=box.outerHTML;
 // Start hashing now, but capture every DOM-derived value before the first await.
 const digestPromise=crypto.subtle.digest('SHA-256',new TextEncoder().encode(domSnapshot));
 const vv=window.visualViewport;if(!vv)throw Error('VISUAL_VIEWPORT_REQUIRED');
 const viewportMetrics={layoutViewport:{width:innerWidth,height:innerHeight},documentClient:{width:document.documentElement.clientWidth,height:document.documentElement.clientHeight},visualViewport:{width:vv.width,height:vv.height,offsetLeft:vv.offsetLeft,offsetTop:vv.offsetTop,pageLeft:vv.pageLeft,pageTop:vv.pageTop,scale:vv.scale},screen:{width:screen.width,height:screen.height},devicePixelRatio};
 const snapshot={question:rect(box),children,image:rect(image),viewport:{width:innerWidth,height:innerHeight},viewportMetrics,scroll:{x:scrollX,y:scrollY},obstructions,feedbackIdle:!panel||panel.hidden||!visible(panel),readiness:JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state,solutionNodes:document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length,questionNumber:box.querySelector('.q-num')?.textContent?.trim(),mandatoryChildrenVisible:visible(box)&&visible(image)&&!!box.querySelector('.q-num')&&visible(box.querySelector('.q-num'))&&[...box.children].every(c=>(!c.textContent.trim()&&!c.querySelector('img,svg,math,mjx-container'))||visible(c)),mandatoryVisibility:mandatoryVisibilitySnapshot()};
 const digest=await digestPromise;
 // After yielding, only the already captured bytes and plain values are used.
 return{...snapshot,domSha256:[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')};
}
function hit({selector,clip}){const matches=document.querySelectorAll(selector);if(matches.length!==1)throw Error('UNIQUE_SELECTED_ASSET');const image=matches[0];if(!image.isConnected||!document.contains(image))throw Error('SELECTED_ASSET_DETACHED');const box=image.closest('.q-box');let samples=0,outsideQuestion=0;const xs=[clip.x+1.5],ys=[clip.y+1.5];for(let x=clip.x+17.5;x<clip.x+clip.width-1.5;x+=16)xs.push(x);for(let y=clip.y+17.5;y<clip.y+clip.height-1.5;y+=16)ys.push(y);xs.push(clip.x+clip.width-1.5);ys.push(clip.y+clip.height-1.5);for(const x of xs)for(const y of ys){samples++;const e=document.elementFromPoint(x,y);if(!e||(e!==box&&!box.contains(e)))outsideQuestion++;}return{samples,outsideQuestion};}
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
function documentFrame(f){const dr=r=>({x:r.x+f.scroll.x,y:r.y+f.scroll.y,width:r.width,height:r.height});return{question:dr(f.question),content:dr(helper.problemContentClip(f)),children:f.children.map(dr),image:dr(f.image),viewport:f.viewport,questionNumber:f.questionNumber};}
function verifyTile(f,tile,view){recordMandatoryDiagnostic('verify-tile',f,tile.tileIndex);const full=helper.problemContentClip(f),clip={x:full.x,y:full.y+tile.relativeInterval[0],width:full.width,height:tile.relativeInterval[1]-tile.relativeInterval[0]};assert(f.feedbackIdle,'UI_FEEDBACK_NOT_IDLE');assert(f.mandatoryChildrenVisible,'UI_MANDATORY_CHILDREN_NOT_VISIBLE');assert.equal(f.readiness,'RENDER_READY','UI_READINESS_NOT_READY');assert(view==='problem'?f.solutionNodes===0:f.solutionNodes>0,'UI_ACTUAL_VIEW');assert(clip.x>=0&&clip.y>=0&&clip.x+clip.width<=f.viewport.width&&clip.y+clip.height<=f.viewport.height,'UI_TILE_OUTSIDE_VIEWPORT');assert(f.obstructions.every(r=>!overlap(clip,r)),'UI_TILE_OBSCURED');return clip;}
function viewportShape(metrics){const {pageLeft,pageTop,...visualViewport}=metrics.visualViewport;return{layoutViewport:metrics.layoutViewport,documentClient:metrics.documentClient,visualViewport,screen:metrics.screen,devicePixelRatio:metrics.devicePixelRatio};}
function visibleDocumentClip(frame,clip,contextViewport){
 const m=frame.viewportMetrics,v=m.visualViewport;
 for(const value of Object.values(v))assert(Number.isFinite(value),'UI_FINITE_VISUAL_METRICS');
 assert(v.width>0&&v.height>0&&v.scale>0,'UI_POSITIVE_VISUAL_METRICS');assert.equal(m.devicePixelRatio,1,'UI_EXACT_DPR');assert.deepEqual(m.layoutViewport,frame.viewport);
 assert.deepEqual(m.screen,contextViewport,'UI_SCREEN_CONTEXT_BINDING');
 assert(Math.abs(v.width*v.scale-contextViewport.width)<=1&&Math.abs(v.height*v.scale-contextViewport.height)<=1,'UI_VISUAL_CONTEXT_SCALE_BINDING');
 assert(clip.x>=v.offsetLeft&&clip.y>=v.offsetTop&&clip.x+clip.width<=v.offsetLeft+v.width&&clip.y+clip.height<=v.offsetTop+v.height,'UI_TILE_OUTSIDE_ACTUAL_VISUAL_VIEWPORT');
 assert(Math.abs(v.pageLeft-frame.scroll.x-v.offsetLeft)<.01&&Math.abs(v.pageTop-frame.scroll.y-v.offsetTop)<.01,'UI_DOCUMENT_VISUAL_ORIGIN_BINDING');
 return{x:clip.x+frame.scroll.x,y:clip.y+frame.scroll.y,width:clip.width,height:clip.height};
}
function pngDimensions(bytes){assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'ORIGINAL_PNG_REQUIRED');assert.equal(bytes.toString('ascii',12,16),'IHDR');return{width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};}
async function capture(page,selector,view,viewport){
 const contextViewport={width:viewport.width,height:viewport.height};assert.deepEqual(page.viewportSize(),contextViewport);
 let frame=await page.evaluate(measure,selector);recordMandatoryDiagnostic('capture-initial',frame);assert(frame.mandatoryChildrenVisible);const original=documentFrame(frame),originalViewportShape=viewportShape(frame.viewportMetrics),digest=frame.domSha256,scrollBefore=frame.scroll,plan=helper.planProblemTiles(frame),tiles=[];
 assert.equal(Number(frame.questionNumber.match(/^\d+/)?.[0]),12,'VISIBLE_ORDINAL');
 for(const tile of plan.tiles){let operations=0;for(let i=0;i<3;i++){const step=helper.planProblemTileScroll(frame,tile);if(Math.abs(step.scrollByY)<.5)break;await page.evaluate(y=>window.scrollBy({top:y,left:0,behavior:'instant'}),step.scrollByY);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));operations++;frame=await page.evaluate(measure,selector);}
  recordMandatoryDiagnostic('after-scroll',frame,tile.tileIndex);assert.equal(frame.domSha256,digest);assert.deepEqual(documentFrame(frame),original);assert.deepEqual(viewportShape(frame.viewportMetrics),originalViewportShape);const clip=verifyTile(frame,tile,view),hits=await page.evaluate(hit,{selector,clip});assert(hits.samples>0&&hits.outsideQuestion===0,'UI_FOREIGN_HITS');
  const contextBefore=page.viewportSize();assert.deepEqual(contextBefore,contextViewport);const documentClip=visibleDocumentClip(frame,clip,contextViewport);
  // fullPage selects Chromium's document-coordinate capture API. The clip is
  // still wholly inside the measured live visual viewport; no offscreen region,
  // resize, DOM/CSS substitution, screenshot postprocessing or compositing is used.
  const filename=`e035-${view}-${viewport.name}-tile-${String(tile.tileIndex).padStart(2,'0')}.png`;await page.screenshot({path:path.join(OUT,filename),clip:documentClip,fullPage:true,scale:'css',caret:'initial',timeout:15000});
  const png=pngDimensions(fs.readFileSync(path.join(OUT,filename))),expectedPng={width:Math.round(clip.width),height:Math.round(clip.height)};
  capturePixels.push({caseId:activeCase,tileIndex:tile.tileIndex,layoutClip:clip,documentClip,contextViewport:page.viewportSize(),metricsBefore:frame.viewportMetrics,pngDimensions:png,expectedPng,pixelRule:'NEAREST_INTEGER_CSS_PX'});
  assert.deepEqual(png,expectedPng,'UI_ORIGINAL_PNG_FULL_CLIP_DIMENSIONS');
  const settle={caseId:activeCase,tileIndex:tile.tileIndex,method:'READ_ONLY_EXISTING_RENDER_IDLE',maximumWaitMs:10000,observations:[],elapsedMs:0,complete:false};captureSettles.push(settle);const settleStart=Date.now();let after;
  for(;;){
   after=await page.evaluate(measure,selector);recordMandatoryDiagnostic('post-screenshot-poll',after,tile.tileIndex);settle.observations.push({feedbackIdle:after.feedbackIdle,mandatoryChildrenVisible:after.mandatoryChildrenVisible,readiness:after.readiness,domSha256:after.domSha256});settle.elapsedMs=Date.now()-settleStart;assert(settle.elapsedMs<settle.maximumWaitMs,'UI_NATURAL_RENDER_IDLE_TIMEOUT');assert(after.mandatoryChildrenVisible,'UI_MANDATORY_CHILDREN_NOT_VISIBLE');
   // Natural feedback may settle, but no observed source layout, viewport,
   // scroll or selected DOM change is tolerated while waiting.
   assert.deepEqual(after.scroll,frame.scroll);assert.deepEqual(documentFrame(after),original);assert.deepEqual(after.viewportMetrics,frame.viewportMetrics);assert.deepEqual(viewportShape(after.viewportMetrics),originalViewportShape);assert.deepEqual(page.viewportSize(),contextViewport);assert.equal(after.domSha256,digest);
   if(after.feedbackIdle&&after.readiness==='RENDER_READY'){settle.complete=true;break;}
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  }
  assert.deepEqual(verifyTile(after,tile,view),clip);assert.deepEqual(visibleDocumentClip(after,clip,contextViewport),documentClip);const afterHits=await page.evaluate(hit,{selector,clip});assert(afterHits.samples>0&&afterHits.outsideQuestion===0,'UI_AFTER_FOREIGN_HITS');
  const screenshotEvidence={api:'PAGE_SCREENSHOT',fullPage:true,scale:'css',coordinateSystem:'DOCUMENT_CSS_PIXELS',documentClip,contextViewportBefore:contextBefore,contextViewportAfter:page.viewportSize(),metricsBefore:frame.viewportMetrics,metricsAfter:after.viewportMetrics,pngDimensions:png,visibleRoiContained:true,postprocessing:false};
  tiles.push({...tile,filename,clip,scroll:after.scroll,scrollOperations:operations,feedbackIdle:true,obstructionsIntersectingClip:0,hitTestSamples:hits.samples+afterHits.samples,foreignContentHits:0,domSha256:digest,screenshotEvidence});frame=after;
 }
 return{schemaVersion:'archive-problem-scroll-coverage-v1',method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',coordinateSystem:'LAYOUT_CSS_PIXELS',viewportEvidence:{contextViewport,isMobile:viewport.name==='mobile',hasTouch:viewport.name==='mobile',deviceScaleFactor:1,beforeScroll:originalViewportShape,afterScroll:viewportShape(frame.viewportMetrics)},tileLimit:8,overlapCssPixels:32,tileCount:tiles.length,content:original.content,question:original.question,viewport:original.viewport,visibleChildren:original.children.length,coverage:helper.assertTileCoverage(original.content.height,tiles),tiles,scrollBefore,scrollAfter:frame.scroll,scrollOperations:tiles.reduce((n,t)=>n+t.scrollOperations,0),domSha256:digest,feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false};
}
let browser,activeCase=null;
function write(status,error){const technical={schemaVersion:'archive-e035-current-renderer-student-ui-technical-v2',status,producer:'/root',observedAt:new Date().toISOString(),executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',checkoutCommit:COMMIT,rendererRef:ref('archive/mixed_engine.html'),sourceRef:ref(SOURCE),currentAssets:{problem:ref(PROBLEM),solution:ref(SOLUTION)},sourceOverlayCount:0,cssWrites:0,domWrites:0,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,browserVersion:browser?.version()||'',producerRef,servedFiles:[...served.values()],mirroredAssets:[...mirrored.values()],transportMetadata,cases};fs.writeFileSync(path.join(OUT,'technical-proof.json'),JSON.stringify(technical,null,2)+'\n');fs.writeFileSync(path.join(OUT,'diagnostics.json'),JSON.stringify({status,activeCase,failures,externalResources,captureSettles,capturePixels,mandatoryDiagnostics,error:error?{name:error.name,message:error.message.split('\n')[0]}:null},null,2)+'\n');}
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({executablePath:arg('--chrome')||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],timeout:30000});
 for(const viewport of [{name:'desktop',width:1280,height:900},{name:'mobile',width:390,height:844}])for(const view of ['problem','solution']){
  activeCase=viewport.name+'-'+view;console.log(JSON.stringify({starting:activeCase}));const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1,isMobile:viewport.name==='mobile',hasTouch:viewport.name==='mobile',serviceWorkers:'block'});
  try{await context.addInitScript(({questions,meta})=>{sessionStorage.setItem('mixedQuestions',questions);sessionStorage.setItem('mixedMeta',meta);},{questions:questionsRaw,meta:metaRaw});const page=await context.newPage();page.setDefaultTimeout(10000);const pageErrors=[],requestFailures=[];
   page.on('pageerror',e=>pageErrors.push({messageSha256:sha(e.message)}));page.on('requestfailed',q=>requestFailures.push({urlSha256:sha(q.url()),failureSha256:sha(q.failure()?.errorText||'')}));
   await page.route('https://img.wangjiedu.com/exams/images/**',async route=>{try{const url=new URL(route.request().url()),rel='archive/assets/images/'+decodeURIComponent(url.pathname.slice('/exams/images/'.length)),bytes=read(rel);mirrored.set(rel,ref(rel));await route.fulfill({status:200,headers:{'access-control-allow-origin':'*','cache-control':'no-store'},contentType:mime(rel),body:bytes});}catch(e){failures.push({kind:'MIRROR',code:e.code||e.message.split('\n')[0]});await route.abort('failed');}});
   const mode=view==='problem'?'exam':'sol';await page.goto(`${origin}/archive/mixed_engine.html?mode=${mode}&qpp=4&studio=1&preview=1&fit=screen&studentReview=1`,{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(()=>JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state==='RENDER_READY'&&window.AppState?.data?.length===21,null,{timeout:60000});
   await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
   const technical=await page.evaluate(()=>({questionCount:AppState.data.length,readiness:JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}').state,imagesComplete:[...document.querySelectorAll('#print-area img')].every(i=>i.complete&&i.naturalWidth>0),mathJaxSource:window.__AP_MATHJAX_SOURCE__,mathErrors:document.querySelectorAll('#print-area mjx-merror,#print-area [data-mjx-error]').length,unrenderedMath:window.APRenderLoop?.unrenderedMathCount(document.querySelector('#print-area')),fontStatus:document.fonts.status,fontFamilies:[...new Set([...document.querySelectorAll('#print-area .q-content,#print-area .sol-exp')].map(e=>getComputedStyle(e).fontFamily))],solutionNodes:document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length}));
   fs.writeFileSync(path.join(OUT,`${activeCase}-preflight.json`),JSON.stringify({technical,pageErrors,requestFailures,failures},null,2)+'\n');
   assert.equal(technical.questionCount,21);assert.equal(technical.readiness,'RENDER_READY');assert(technical.imagesComplete);assert.equal(technical.mathJaxSource,'local');assert.equal(technical.mathErrors,0);assert.equal(technical.unrenderedMath,0);assert.equal(technical.fontStatus,'loaded');assert(technical.fontFamilies.length);assert(view==='problem'?technical.solutionNodes===0:technical.solutionNodes>0);assert.equal(pageErrors.length+requestFailures.length+failures.length,0,'UI_NETWORK_OR_PAGE_FAILURE');
   const selector=`#print-area img[src*="${path.posix.basename(view==='problem'?PROBLEM:SOLUTION)}"]`;const target=page.locator(selector);assert.equal(await target.count(),1,'UNIQUE_SELECTED_ASSET');
   const boxes=await page.locator('#print-area .q-box').evaluateAll(nodes=>nodes.filter(n=>/^12\.(?:\s|$)/.test(n.querySelector('.q-num')?.textContent||'')).length);assert.equal(boxes,1,'COMPLETE_SELECTED_CONTAINER_NOT_SPLIT');
   const captured=await capture(page,selector,view,viewport);const screenshots=captured.tiles.map(t=>{const b=fs.readFileSync(path.join(OUT,t.filename));return{tileIndex:t.tileIndex,path:t.filename,sha256:sha(b),bytes:b.length};});
   assert.equal(pageErrors.length+requestFailures.length+failures.length,0,'UI_LATE_FAILURE');
   cases.push({caseId:activeCase,questionUid:UID,sourceOrdinal:12,view,viewport,status:'PASS',visualReview:'PENDING',...technical,pageErrors,requestFailures,capture:captured,screenshots});console.log(JSON.stringify({completed:activeCase,tiles:screenshots.length}));write('IN_PROGRESS');
  }catch(error){const page=context.pages()[0];if(page){await page.screenshot({path:path.join(OUT,`${activeCase}-failure-viewport.png`),fullPage:false}).catch(()=>{});const state=await page.evaluate(()=>({readiness:document.documentElement.dataset.apPrintReadiness||null,questions:window.AppState?.data?.length,renderError:window.__AP_OUTPUT_RENDER_ERROR__||null,bodyTextLength:document.body?.textContent?.length})).catch(()=>null);fs.writeFileSync(path.join(OUT,`${activeCase}-failure-state.json`),JSON.stringify(state,null,2)+'\n');}throw error;}finally{await context.close();}
 }
 assert.equal(cases.length,4);activeCase=null;for(const entry of [...served.values(),...mirrored.values()])assert.deepEqual(ref(entry.path),entry);write('TECHNICAL_PASS_VISUAL_REVIEW_PENDING');console.log(JSON.stringify({status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',cases:4,tiles:cases.reduce((n,c)=>n+c.screenshots.length,0)}));
}
main().catch(error=>{write('FAIL',error);console.error(JSON.stringify({status:'FAIL',activeCase,error:error.message.split('\n')[0]}));process.exitCode=1;}).finally(async()=>{await browser?.close();await new Promise(resolve=>server.close(resolve));});
