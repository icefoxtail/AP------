'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const C=require('../tools/check-e017-solution-display-browser.cjs'),H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
const S=require('../tools/check-m2s1-solution-scroll.cjs');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-e017-solution-display-ui.json')));
const commit=process.env.ARCHIVE_E017_UI_TEST_COMMIT||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const cache=new Map();
const read=p=>{
 if(!cache.has(p)){
  const sha=execFileSync('git',['rev-parse',commit+':'+p],{encoding:'utf8'}).trim();
  cache.set(p,execFileSync('git',['cat-file','blob',sha],{maxBuffer:40e6}));
 }
 return cache.get(p);
};
const reader={read,ref:(p,b=read(p))=>({commit,path:p,gitBlobSha1:H.gitBlob(b),sha256:H.sha256(b),bytes:b.length})};
test('one closed E017 solution binding match exact repository bytes without claiming UI approval',()=>{
 const out=C.preflight(reader,manifest);
 assert.equal(out.items.length,1);assert.deepEqual(out.items.map(x=>x.sourceOrdinal),[2]);
 assert(out.items.every(x=>x.assetRefs.length===1));assert.equal(out.status,undefined);
});
test('scope, viewport, surface, duplicated target and fixture additions fail closed',()=>{
 for(const change of [m=>m.items.pop(),m=>m.items.push(m.items[0]),m=>m.viewports[0].width=390,m=>m.expectedCases=2,m=>m.surface='PROBLEM',m=>m.mode='exam',m=>m.extra=true]){
  const m=structuredClone(manifest);change(m);assert.throws(()=>C.validateManifest(m));
 }
});
test('source or solution image byte drift cannot pass a correct-looking fixture',()=>{
 for(const p of [manifest.items[0].sourcePath,manifest.items[0].assets[0].path])
  assert.throws(()=>C.preflight({...reader,read:q=>q===p?Buffer.concat([read(q),Buffer.from(' ')]):read(q)},manifest));
});
test('the selected ordinal must retain exactly one correct identity',()=>{
 const p='archive/data/question_identity_map.json';
 for(const duplicate of [false,true]){
  const identity=JSON.parse(read(p)),item=manifest.items[0];
  const row=identity.records.find(x=>x.sourceArchiveFile===item.sourcePath.slice('archive/exams/'.length)&&Number(x.sourceOrdinal)===item.sourceOrdinal);
  if(duplicate)identity.records.push({...row});else row.questionUid='wrong-uid';
  assert.throws(()=>C.preflight({...reader,read:q=>q===p?Buffer.from(JSON.stringify(identity)):read(q)},manifest),duplicate?/UI_UNIQUE_IDENTITY/:/UI_IDENTITY_UID/);
 }
});
test('a checkout must match its explicitly required immutable commit',()=>{
 const sha='a'.repeat(40);assert.throws(()=>C.checkoutEvidence(sha,{}));
 assert.throws(()=>C.checkoutEvidence(sha,{ARCHIVE_E017_SOLUTION_UI_EXPECTED_SHA:'b'.repeat(40)}));
 assert.equal(C.checkoutEvidence(sha,{ARCHIVE_E017_SOLUTION_UI_EXPECTED_SHA:sha}).actualCheckoutCommit,sha);
});
const frame=()=>({question:{x:100,y:100,width:300,height:400},children:[{x:102,y:102,width:100,height:20},{x:102,y:125,width:290,height:40},{x:102,y:170,width:290,height:200}],viewport:{width:1440,height:1000},feedbackIdle:true,readiness:'RENDER_READY',mode:'sol',solutionNodes:5,sourceFragments:1,mandatoryChildrenVisible:true,obstructions:[]});
test('a solution capture requires the complete original fragment with no obstruction',()=>{
 const f=frame(),tile=H.planProblemTiles(f).tiles[0];assert(S.assertSolutionTileCapture(f,tile));
 for(const d of [{mode:'exam'},{solutionNodes:0},{sourceFragments:2},{mandatoryChildrenVisible:false},{feedbackIdle:false},{readiness:'RENDERING'},{obstructions:[{x:100,y:100,width:40,height:40}]}])
  assert.throws(()=>S.assertSolutionTileCapture({...f,...d},tile));
 assert.throws(()=>H.assertTileCoverage(100,[{tileIndex:1,relativeInterval:[0,99]}]));
});
test('render readiness requires genuine sol mode, complete images, math and the exact bank count',()=>{
 const t={mode:'sol',questions:23,pages:2,readiness:'RENDER_READY',imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:5};C.assertTechnicalState(t,'sol',23);
 for(const d of [{mode:'exam'},{solutionNodes:0},{mathErrors:1},{unrenderedMath:1},{imagesComplete:false},{mathJaxSource:'cdn'},{questions:24}])assert.throws(()=>C.assertTechnicalState({...t,...d},'sol',23));
 assert.throws(()=>C.assertTechnicalState({...t,mode:'exam'},'exam',23));
});
test('missing, duplicated or placeholder screenshot cases cannot grant technical success',()=>{
 assert.throws(()=>C.assertCompletedResults([],{},manifest,[]));
 assert.throws(()=>C.assertCompletedResults(Array(1).fill({status:'PASS',viewport:{name:'desktop'},key:'E017-Q02'}),{items:[]},manifest,[]));
});

test('actual capture refuses a draft binding before any browser work',()=>{
 assert.throws(()=>C.assertFinalBinding({...manifest,bindingPhase:'DRAFT_CURRENT_SOURCE_FINAL_BINDING_REQUIRED'}),/UI_FINAL_PUBLIC_BINDING_REQUIRED/);
 assert.equal(C.assertFinalBinding({...manifest,bindingPhase:'FINAL_PUBLIC_SOURCE_BINDING'}).bindingPhase,'FINAL_PUBLIC_SOURCE_BINDING');
});

const vm=require('node:vm'),{webcrypto}=require('node:crypto');
test('the exact production renderer omits a caption for this actual source while rendering its original image',()=>{
 const engine=read('archive/engine.html').toString();
 const code=/(function renderSolutionImageHTML\([\s\S]*?\n\})\n/.exec(engine)?.[1];assert(code);
 const q=C.loadQuestions(read(manifest.items[0].sourcePath))[1];assert.equal(Object.hasOwn(q,'solutionImageCaption'),false);
 const render=vm.runInNewContext('('+code+')',{window:{},AppState:{},withArchiveAssetCacheBuster:x=>x,escapeArchiveHtmlAttribute:x=>String(x)});
 const html=render(q);assert(html.includes('sol-image-wrap'));assert(html.includes('q02-solution.svg'));
 assert.equal(html.includes('class="sol-image-caption"'),false);
 assert.equal((render({...q,solutionImageCaption:'synthetic-caption'}).match(/class="sol-image-caption"/g)||[]).length,1);
});
function boundPolicy(){return S.makeE017CaptionAbsencePolicy(reader,C.preflight(reader,manifest).items[0],C.loadQuestions);}
const LOCAL_ORIGIN='http://localhost:123';
const LOCAL_IMAGE=LOCAL_ORIGIN+'/archive/assets/images/24_연향중_2학기_중간_중2_수학/q02-solution.svg?stable=1';
const CDN_IMAGE='https://img.wangjiedu.com/exams/images/'+encodeURIComponent('24_연향중_2학기_중간_중2_수학')+'/q02-solution.svg?v=fixture';
function transportInput(p,imageUrl=LOCAL_IMAGE){return {imageUrl,origin:LOCAL_ORIGIN,servedRefs:[p.assetRef],mirroredRefs:[p.assetRef]};}
function boundTransport(p,imageUrl=LOCAL_IMAGE){return S.makeE017CaptionAssetTransport(p,transportInput(p,imageUrl));}
function domFixture(options={}){
 const r={x:100,y:180,width:300,height:120};
 const element=(text='fixture-role',pos=r)=>({nodeType:1,tagName:'DIV',textContent:text,hidden:false,
   getBoundingClientRect:()=>pos,querySelector:()=>null,getAttribute:()=>null});
 const nodes={number:[element(options.number||'2.',{x:100,y:100,width:30,height:20})],
   semantic:[element('fixture-stem',{x:100,y:125,width:300,height:40})],answer:[element()],explanation:[element()],
   caption:options.caption?[element()]:[]};
 if(options.missing)nodes[options.missing]=[];
 if(options.duplicate)nodes[options.duplicate].push(element());
 if(options.hidden&&nodes[options.hidden][0])nodes[options.hidden][0].hidden=true;
 const image=element('',{x:110,y:190,width:200,height:100});image.src=options.imageSrc||'http://localhost:123/archive/assets/images/24_연향중_2학기_중간_중2_수학/q02-solution.svg?stable=1';
 image.hidden=options.imageHidden===true;
 const selectors={'.q-num':'number','.sol-ans':'answer','.sol-exp':'explanation','.sol-image-caption':'caption'};
 const nestedSemantic=Array.from({length:options.nestedSemanticCount||0},()=>{
   const node=element('synthetic-math');node.tagName='MJX-MROW';node.getAttribute=()=>'17,18';return node;
 });
 const meta=element();meta.querySelector=()=>image;if(options.hiddenDirect)meta.hidden=true;
 const box=element('',{x:100,y:95,width:300,height:250});box.dataset={sourceRef:'fixture-source:2'};box.outerHTML='<div class="sol-box">synthetic-capture</div>';
 box.children=[...(nodes.number.slice(0,1)),...nodes.semantic,meta];box.childNodes=box.children;box.contains=x=>x===image||box.children.includes(x);
 for(const node of nodes.semantic){node.parentElement=box;node.tagName=options.semanticTag||'DIV';node.getAttribute=()=>options.semanticValue??'1';}
 for(const node of nestedSemantic)node.parentElement=nodes.semantic[0]||meta;
 box.querySelectorAll=s=>s==='[data-semantic-content]'?[...nodes.semantic,...nestedSemantic]:
   s===':scope > div[data-semantic-content="1"]'?nodes.semantic.filter(n=>n.parentElement===box&&n.tagName==='DIV'&&n.getAttribute('data-semantic-content')==='1'):
   nodes[selectors[s]]||[];
 box.querySelector=s=>box.querySelectorAll(s)[0]||null;image.closest=()=>box;
 const document={documentElement:{dataset:{apPrintReadiness:'{"state":"RENDER_READY"}'}},getElementById:()=>null,
   querySelectorAll:s=>s==='body *'?[]:s==='#print-area .sol-box'?[box]:[...box.children,...nodes.answer,...nodes.explanation]};
 const sandbox={image,Node:{ELEMENT_NODE:1,TEXT_NODE:3},document,innerWidth:1440,innerHeight:1000,scrollX:0,scrollY:0,
   getComputedStyle:e=>({display:e.hidden?'none':'block',visibility:'visible',opacity:'1',position:'static'}),
   crypto:webcrypto,TextEncoder,Uint8Array,AppState:{mode:'sol'},URL,location:{href:'http://localhost:123/archive/engine.html',origin:'http://localhost:123'}};
 return {image,sandbox};
}
async function measured(options,policy=null){const {sandbox}=domFixture(options);sandbox.policy=policy;
 return vm.runInNewContext('('+S.measureSolutionCapture.toString()+')(image,policy)',sandbox);}
test('actual fixed source has no own caption; only verified immutable E017 bindings issue a policy',()=>{
 const p=boundPolicy();assert.equal(p.sourceCaptionOwn,false);assert.equal(p.expectedCaptionCount,0);
 assert.equal(p.questionUid,manifest.items[0].questionUid);assert.equal(p.sourceRef.commit,commit);assert(Object.isFrozen(p.sourceRef));
 const item=C.preflight(reader,manifest).items[0];
 for(const mutate of [x=>x.questionUid='qid_v1_'+'a'.repeat(64),x=>x.sourceOrdinal=3,x=>x.sourcePath='archive/exams/other.js',
   x=>x.sourceRef.commit='a'.repeat(40),x=>x.assetRefs[0].sha256='a'.repeat(64)]){
  const x=structuredClone(item);mutate(x);assert.throws(()=>S.makeE017CaptionAbsencePolicy(reader,x,C.loadQuestions));
 }
});
test('explicit null, empty, whitespace and nonempty source captions never become the named own-absence',()=>{
 const q=C.loadQuestions(read(manifest.items[0].sourcePath))[1];S.assertE017CaptionSource(q);
 for(const v of [null,'',' ','caption',false,0,undefined])assert.throws(()=>S.assertE017CaptionSource({...q,solutionImageCaption:v}),/EXACT_SOURCE_ABSENCE/);
});
test('legacy caption-required measurement remains red for a missing caption and green for its original full roles',async()=>{
 assert.equal((await measured({})).mandatoryChildrenVisible,false);
 assert.equal((await measured({caption:true})).mandatoryChildrenVisible,true);
});
test('the named exact E017 absence permits zero captions only with all other roles visible',async()=>{
 const f=await measured({},boundPolicy());assert.equal(f.mandatoryChildrenVisible,true);
 assert.equal(f.roleVisibility.roles.caption.count,0);assert.equal(f.roleVisibility.namedCaptionAbsence,true);
});
for(const role of ['number','semantic','answer','explanation'])for(const fault of ['hidden','missing','duplicate'])
 test('named absence refuses '+fault+' '+role,async()=>{
  assert.equal((await measured({[fault]:role},boundPolicy())).mandatoryChildrenVisible,false);
 });
for(const [name,options] of Object.entries({unexpectedCaption:{caption:true},hiddenCaption:{caption:true,hidden:'caption'},
 wrongOrdinal:{number:'3.'},hiddenImage:{imageHidden:true},hiddenWholeChild:{hiddenDirect:true},
 wrongImagePath:{imageSrc:'http://localhost:123/archive/assets/other.svg'},foreignImageOrigin:{imageSrc:'https://foreign.example/archive/assets/images/24_연향중_2학기_중간_중2_수학/q02-solution.svg'}}))
 test('named absence refuses '+name,async()=>{assert.equal((await measured(options,boundPolicy())).mandatoryChildrenVisible,false);});
test('a caller-supplied or serialized policy cannot bypass source verification',async()=>{
 for(const policy of [{},JSON.parse(JSON.stringify(boundPolicy()))])
  await assert.rejects(S.captureSolutionTiles({}, {}, '/unwritten.png',policy),/POLICY_NOT_VERIFIED/);
});
test('a verified policy keeps failed role diagnostics red without taking any screenshot',async()=>{
 const p=boundPolicy(),f=await measured({hidden:'answer'},p);let captures=0;
 const page={waitForFunction:async()=>{},screenshot:async()=>{captures++;}},target={evaluate:async()=>f};
 await assert.rejects(S.captureSolutionTiles(page,target,'/unwritten.png',p,boundTransport(p)),e=>e.message==='UI_REQUIRED_PROBLEM_CHILD_HIDDEN'&&
   e.captureDiagnostic.roleVisibility.roles.answer.visible===0&&!JSON.stringify(e.captureDiagnostic).includes('fixture-role'));
 assert.equal(captures,0);
});
test('named capture preserves the full scroll plan and records all checked zero-caption role frames',async()=>{
 const p=boundPolicy(),f=await measured({},p);let screenshots=0;
 const page={waitForFunction:async()=>{},evaluate:async()=>{},screenshot:async()=>{screenshots++;}};
 const target={evaluate:async fn=>fn===S.measureSolutionCapture?f:{samples:8,outsideQuestion:0}};
 const out=await S.captureSolutionTiles(page,target,'/synthetic-unwritten.png',p,boundTransport(p));assert.equal(screenshots,1);
 S.assertE017CaptionObservation(out.captionAbsenceObservation);assert.equal(out.coverage.complete,true);
 assert.equal(out.domWrites,0);assert.equal(out.cssWrites,0);assert.equal(out.viewportChanges,0);
 const {captionAbsenceObservation,...capture}=out;assert(!Object.hasOwn(capture,'captionAbsenceObservation'));
 const bad=structuredClone(captionAbsenceObservation);bad.measuredFrames[0].roles.caption.count=1;
 assert.throws(()=>S.assertE017CaptionObservation(bad),/UNEXPECTED/);
 assert.throws(()=>S.assertE017CaptionObservation({...captionAbsenceObservation,measuredFrames:[]}),/OBSERVATION/);
});

test('the exact served solution producers use a direct reminder div while MathJax uses nested semantic attributes',()=>{
 for(const p of ['archive/engine.html','archive/solution-render-executor.js']){
  const code=read(p).toString();
  assert(code.includes('<div data-semantic-content="1" style="margin-bottom:8px;color:#555;font-size:8.5pt;">${reminderContent}</div><div class="sol-meta">'));
 }
 const math=read('archive/vendor/mathjax-tex-font/tex-mml-chtml-mathjax-tex.js').toString();
 assert(math.includes('CONTENT="data-semantic-content"'));
});

test('named caption absence measures one direct reminder despite two nested MathJax semantic markers',async()=>{
 const f=await measured({nestedSemanticCount:2},boundPolicy());
 assert.equal(f.mandatoryChildrenVisible,true);assert.equal(f.roleVisibility.roles.semantic.count,1);
 assert.equal(f.semanticRoleCandidates.length,3);assert.equal(f.semanticRoleCandidates.filter(x=>x.directChild).length,1);
 assert.equal(f.semanticRoleCandidates.filter(x=>x.tag==='mjx-mrow').length,2);
 assert.equal(f.semanticRoleCandidates.every(x=>x.visible),true);
});

for(const [name,options]of Object.entries({
 missingReminder:{missing:'semantic'},hiddenReminder:{hidden:'semantic'},duplicateReminder:{duplicate:'semantic'},
 wrongReminderValue:{semanticValue:'2'},wrongReminderElement:{semanticTag:'SPAN'},
}))test('nested semantic markers do not mask '+name,async()=>{
 const f=await measured({...options,nestedSemanticCount:2},boundPolicy());
 assert.equal(f.mandatoryChildrenVisible,false);
});

test('the generic caption-required path keeps its original descendant selector behavior',async()=>{
 const f=await measured({caption:true,nestedSemanticCount:2});
 assert.equal(f.mandatoryChildrenVisible,true);assert.equal(f.roleVisibility.roles.semantic.count,3);
 assert.equal(f.roleVisibility.captionPolicyApplied,false);
});

test('named full capture retains complete coverage and all direct-role checks with nested markers',async()=>{
 const p=boundPolicy(),f=await measured({nestedSemanticCount:2},p);let screenshots=0;
 const page={waitForFunction:async()=>{},evaluate:async()=>{},screenshot:async()=>{screenshots++;}};
 const target={evaluate:async fn=>fn===S.measureSolutionCapture?f:{samples:8,outsideQuestion:0}};
 const out=await S.captureSolutionTiles(page,target,'/synthetic-unwritten.png',p,boundTransport(p));
 assert.equal(screenshots,1);assert.equal(out.coverage.complete,true);
 S.assertE017CaptionObservation(out.captionAbsenceObservation);
 assert(out.captionAbsenceObservation.measuredFrames.every(x=>x.roles.semantic.count===1&&x.roles.semantic.visible===1));
 assert.equal(out.domWrites,0);assert.equal(out.cssWrites,0);assert.equal(out.viewportChanges,0);
});

test('a hidden direct reminder records redacted candidate ancestry and still takes no screenshot',async()=>{
 const p=boundPolicy(),f=await measured({hidden:'semantic',nestedSemanticCount:2},p);let screenshots=0;
 await assert.rejects(S.captureSolutionTiles({waitForFunction:async()=>{},screenshot:async()=>{screenshots++;}},
  {evaluate:async()=>f},'/unwritten.png',p,boundTransport(p)),e=>e.message==='UI_REQUIRED_PROBLEM_CHILD_HIDDEN'&&
  e.captureDiagnostic.semanticRoleCandidates.length===3&&e.captureDiagnostic.semanticRoleCandidates.some(x=>x.directChild&&!x.visible)&&
  !JSON.stringify(e.captureDiagnostic).includes('fixture-stem')&&!JSON.stringify(e.captureDiagnostic).includes('synthetic-math'));
 assert.equal(screenshots,0);
});

test('the exact engine and asset-base resolve this source to the Git-mirrored CDN path',async()=>{
 const assetCode=read('archive/archive-asset-base.js').toString();
 const context={module:{exports:{}},URL,URLSearchParams,location:new URL(LOCAL_ORIGIN+'/archive/engine.html?studentReview=1')};
 vm.runInNewContext(assetCode,context);
 const api=context.module.exports,engine=read('archive/engine.html').toString();
 const fn=/(function withArchiveAssetCacheBuster\([\s\S]*?\n\})\n/.exec(engine)?.[1];assert(fn);
 const resolve=vm.runInNewContext('('+fn+')',{resolveExamImageUrl:api.resolveExamImageUrl,ARCHIVE_ASSET_CACHE_VERSION:'fixture'});
 const q=C.loadQuestions(read(manifest.items[0].sourcePath))[1],url=resolve(q.solutionImage,{assetRevision:'fixture'});
 assert.equal(url,CDN_IMAGE);assert.notEqual(new URL(url).origin,LOCAL_ORIGIN);
 const policy=boundPolicy(),transport=boundTransport(policy,url),f=await measured({imageSrc:url,nestedSemanticCount:2},policy);
 assert.equal(transport.mode,'MIRRORED_GIT_BYTES');assert.equal(f.mandatoryChildrenVisible,true);
 assert.equal(f.roleVisibility.imageUrlBinding.urlSha256,transport.urlSha256);
 assert.deepEqual(transport.assetRef,reader.ref(manifest.items[0].assets[0].path));
});

test('the mirrored exact asset completes the unchanged scroll plan and records its Git transport',async()=>{
 const p=boundPolicy(),transport=boundTransport(p,CDN_IMAGE),f=await measured({imageSrc:CDN_IMAGE,nestedSemanticCount:2},p);let screenshots=0;
 const target={evaluate:async fn=>fn===S.measureSolutionCapture?f:{samples:8,outsideQuestion:0}};
 const out=await S.captureSolutionTiles({waitForFunction:async()=>{},evaluate:async()=>{},screenshot:async()=>{screenshots++;}},target,'/unwritten.png',p,transport);
 assert.equal(screenshots,1);assert.equal(out.coverage.complete,true);assert.equal(out.tileLimit,8);assert.equal(out.overlapCssPixels,32);
 assert.equal(out.domWrites,0);assert.equal(out.cssWrites,0);assert.equal(out.viewportChanges,0);
 S.assertE017CaptionObservation(out.captionAbsenceObservation);
 assert.deepEqual(out.captionAbsenceObservation.imageTransport,transport);
 const bad=structuredClone(out.captionAbsenceObservation);bad.measuredFrames[1].imageUrlBinding.urlSha256='a'.repeat(64);
 assert.throws(()=>S.assertE017CaptionObservation(bad),/URL_OBSERVATION/);
});

for(const [name,imageUrl]of Object.entries({
 insecureCdn:CDN_IMAGE.replace('https:','http:'),foreignHost:CDN_IMAGE.replace('img.wangjiedu.com','foreign.example'),
 lookalikeHost:CDN_IMAGE.replace('img.wangjiedu.com','img.wangjiedu.com.foreign.example'),
 foreignPort:CDN_IMAGE.replace('img.wangjiedu.com','img.wangjiedu.com:444'),
 wrongCdnPrefix:CDN_IMAGE.replace('/exams/images/','/archive/assets/images/'),
 wrongLocalPrefix:LOCAL_IMAGE.replace('/archive/assets/images/','/exams/images/'),
 foreignFile:CDN_IMAGE.replace('q02-solution.svg','q03-solution.svg'),
 credentials:CDN_IMAGE.replace('https://','https://user:pass@'),fragment:CDN_IMAGE+'#unverified-fragment',
 sameOriginOtherFile:LOCAL_IMAGE.replace('q02-solution.svg','other.svg'),
}))test('named image transport refuses '+name,async()=>{
 const p=boundPolicy();assert.throws(()=>boundTransport(p,imageUrl),/IMAGE_URL/);
 assert.equal((await measured({imageSrc:imageUrl},p)).mandatoryChildrenVisible,false);
});

for(const [name,mutate]of [
 ['missing mirrored asset',x=>x.mirroredRefs=[]],['duplicate mirrored asset',x=>x.mirroredRefs.push(x.mirroredRefs[0])],
 ['wrong commit',x=>x.mirroredRefs[0].commit='b'.repeat(40)],['wrong Git blob',x=>x.mirroredRefs[0].gitBlobSha1='b'.repeat(40)],
 ['wrong raw hash',x=>x.mirroredRefs[0].sha256='b'.repeat(64)],['wrong byte count',x=>x.mirroredRefs[0].bytes++],
 ['foreign path',x=>x.mirroredRefs[0].path='archive/assets/images/foreign.svg'],
 ['extra ref key',x=>x.mirroredRefs[0].unchecked=true],['null ref',x=>x.mirroredRefs[0]=null],
])test('the CDN URL alone cannot replace '+name,()=>{
 const p=boundPolicy(),input=structuredClone(transportInput(p,CDN_IMAGE));mutate(input);
 assert.throws(()=>S.makeE017CaptionAssetTransport(p,input),/TRANSPORT/);
});

test('same-origin requires served bytes and CDN requires mirrored bytes without cross-lane fallback',()=>{
 const p=boundPolicy();
 assert.throws(()=>S.makeE017CaptionAssetTransport(p,{...transportInput(p),servedRefs:[]}),/INVENTORY/);
 assert.throws(()=>S.makeE017CaptionAssetTransport(p,{...transportInput(p,CDN_IMAGE),mirroredRefs:[]}),/INVENTORY/);
 assert.equal(boundTransport(p).mode,'SAME_ORIGIN_GIT_BYTES');
});

test('missing, serialized, or another policy transport cannot start a named capture',async()=>{
 const p=boundPolicy(),transport=boundTransport(p);let visited=false;
 const page={waitForFunction:async()=>{visited=true;}};
 for(const t of [null,JSON.parse(JSON.stringify(transport)),boundTransport(boundPolicy())])
  await assert.rejects(S.captureSolutionTiles(page,{},'/unwritten.png',p,t),/TRANSPORT_NOT_VERIFIED/);
 assert.equal(visited,false);
});

test('a URL replacement after verified transport is rejected before taking a screenshot',async()=>{
 const p=boundPolicy(),transport=boundTransport(p,CDN_IMAGE),f=await measured({},p);let screenshots=0;
 await assert.rejects(S.captureSolutionTiles({waitForFunction:async()=>{},screenshot:async()=>{screenshots++;}},
  {evaluate:async()=>f},'/unwritten.png',p,transport),e=>e.message==='UI_E017_CAPTION_IMAGE_TRANSPORT_DRIFT'&&
  e.captureDiagnostic.expectedImageUrlSha256===transport.urlSha256&&!JSON.stringify(e.captureDiagnostic).includes('https://'));
 assert.equal(screenshots,0);
});

test('a late same-path URL change is still red and cannot produce a success record',async()=>{
 const p=boundPolicy(),transport=boundTransport(p,CDN_IMAGE),before=await measured({imageSrc:CDN_IMAGE},p),
   after=await measured({imageSrc:CDN_IMAGE+'&late=1'},p);let measuredCount=0,screenshots=0;
 const target={evaluate:async fn=>fn===S.measureSolutionCapture?(++measuredCount===1?before:after):{samples:8,outsideQuestion:0}};
 await assert.rejects(S.captureSolutionTiles({waitForFunction:async()=>{},evaluate:async()=>{},screenshot:async()=>{screenshots++;}},
  target,'/unwritten.png',p,transport),/IMAGE_TRANSPORT_DRIFT/);
 assert.equal(screenshots,1);
});

test('the generic caption-required path remains independent of the named image transport',async()=>{
 const f=await measured({caption:true,imageSrc:CDN_IMAGE});assert.equal(f.mandatoryChildrenVisible,true);
 assert.equal(Object.hasOwn(f.roleVisibility,'imageUrlBinding'),false);
});

test('an unexpected actual URL yields predicate-only diagnostics without exposing the URL or body',()=>{
 const p=boundPolicy(),imageUrl=CDN_IMAGE.replace('img.wangjiedu.com','foreign.example');
 assert.throws(()=>boundTransport(p,imageUrl),e=>e.message==='UI_E017_CAPTION_IMAGE_URL'&&
  e.captureDiagnostic.parsed===true&&e.captureDiagnostic.sameOrigin===false&&e.captureDiagnostic.defaultCdnOrigin===false&&
  /^[a-f0-9]{64}$/.test(e.captureDiagnostic.urlSha256)&&!JSON.stringify(e.captureDiagnostic).includes('foreign.example')&&
  !JSON.stringify(e.captureDiagnostic).includes('q02-solution'));
});
