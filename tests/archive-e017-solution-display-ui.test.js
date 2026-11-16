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
function domFixture(options={}){
 const r={x:100,y:180,width:300,height:120};
 const element=(text='fixture-role',pos=r)=>({nodeType:1,textContent:text,hidden:false,
   getBoundingClientRect:()=>pos,querySelector:()=>null});
 const nodes={number:[element(options.number||'2.',{x:100,y:100,width:30,height:20})],
   semantic:[element('fixture-stem',{x:100,y:125,width:300,height:40})],answer:[element()],explanation:[element()],
   caption:options.caption?[element()]:[]};
 if(options.missing)nodes[options.missing]=[];
 if(options.duplicate)nodes[options.duplicate].push(element());
 if(options.hidden&&nodes[options.hidden][0])nodes[options.hidden][0].hidden=true;
 const image=element('',{x:110,y:190,width:200,height:100});image.src=options.imageSrc||'http://localhost:123/archive/assets/images/24_연향중_2학기_중간_중2_수학/q02-solution.svg?stable=1';
 image.hidden=options.imageHidden===true;
 const selectors={'.q-num':'number','[data-semantic-content]':'semantic','.sol-ans':'answer','.sol-exp':'explanation','.sol-image-caption':'caption'};
 const meta=element();meta.querySelector=()=>image;if(options.hiddenDirect)meta.hidden=true;
 const box=element('',{x:100,y:95,width:300,height:250});box.dataset={sourceRef:'fixture-source:2'};box.outerHTML='<div class="sol-box">synthetic-capture</div>';
 box.children=[...(nodes.number.slice(0,1)),...(nodes.semantic.slice(0,1)),meta];box.childNodes=box.children;box.contains=x=>x===image||box.children.includes(x);
 box.querySelectorAll=s=>nodes[selectors[s]]||[];box.querySelector=s=>box.querySelectorAll(s)[0]||null;image.closest=()=>box;
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
 await assert.rejects(S.captureSolutionTiles(page,target,'/unwritten.png',p),e=>e.message==='UI_REQUIRED_PROBLEM_CHILD_HIDDEN'&&
   e.captureDiagnostic.roleVisibility.roles.answer.visible===0&&!JSON.stringify(e.captureDiagnostic).includes('fixture-role'));
 assert.equal(captures,0);
});
test('named capture preserves the full scroll plan and records all checked zero-caption role frames',async()=>{
 const p=boundPolicy(),f=await measured({},p);let screenshots=0;
 const page={waitForFunction:async()=>{},evaluate:async()=>{},screenshot:async()=>{screenshots++;}};
 const target={evaluate:async fn=>fn===S.measureSolutionCapture?f:{samples:8,outsideQuestion:0}};
 const out=await S.captureSolutionTiles(page,target,'/synthetic-unwritten.png',p);assert.equal(screenshots,1);
 S.assertE017CaptionObservation(out.captionAbsenceObservation);assert.equal(out.coverage.complete,true);
 assert.equal(out.domWrites,0);assert.equal(out.cssWrites,0);assert.equal(out.viewportChanges,0);
 const {captionAbsenceObservation,...capture}=out;assert(!Object.hasOwn(capture,'captionAbsenceObservation'));
 const bad=structuredClone(captionAbsenceObservation);bad.measuredFrames[0].roles.caption.count=1;
 assert.throws(()=>S.assertE017CaptionObservation(bad),/UNEXPECTED/);
 assert.throws(()=>S.assertE017CaptionObservation({...captionAbsenceObservation,measuredFrames:[]}),/OBSERVATION/);
});
