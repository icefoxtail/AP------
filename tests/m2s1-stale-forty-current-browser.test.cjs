'use strict';
// Synthetic boundary tests only. They neither run Chrome nor grant acceptance
// to any of the forty existing questions or their original approval packets.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const C=require('../tools/check-m2s1-stale-forty-current-browser.cjs');
const A=require('../tools/capture-m2s1-stale-forty-surfaces.cjs');
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-m2s1-stale-forty-current-ui.json')));
const clone=x=>JSON.parse(JSON.stringify(x)),head='a'.repeat(40);
const env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:'icefoxtail/AP------',GITHUB_REF:C.OPS_REF,
  GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1',GITHUB_WORKFLOW:'M2S1 stale forty current renderer',GITHUB_JOB:'current_ui',GITHUB_SHA:head,
  ARCHIVE_M2S1_STALE40_UI_EXPECTED_SHA:head};
const event={repository:{full_name:env.GITHUB_REPOSITORY,fork:false},deleted:false,ref:C.OPS_REF,after:head};
const reader={read(p){assert.equal(p,C.MANIFEST_PATH);return Buffer.from(JSON.stringify(fixture));},ref(p){
  if(p===C.MANIFEST_PATH)return{commit:head,path:p,gitBlobSha1:'b'.repeat(40),sha256:'c'.repeat(64),bytes:1};
  for(const item of fixture.items){if(p===item.sourcePath)return{commit:head,...item.sourceRef};for(const a of item.assets)if(p===a.ref.path)return{commit:head,...a.ref};}
  throw Error('UNEXPECTED_TEST_REF');}};
const item=fixture.items.find(i=>i.key==='E037-Q22'),viewport=fixture.viewports.PROBLEM[0];
const policy=()=>A.makePolicy(reader,clone(item),'PROBLEM',clone(viewport));

test('closed fixture plans 80 problem and exactly three solution cases',()=>{
  const groups=C.planCases(fixture);assert.equal(groups.length,26);assert.equal(groups.flatMap(g=>g.items).length,83);
  assert.deepEqual(groups.filter(g=>g.surface==='SOLUTION').flatMap(g=>g.items.map(i=>i.key)),['E044-Q21','E044-Q24','E051-Q15']);
  assert.equal(A.NATIVE_KEYS.length,9);assert.equal(A.SOLUTION_KEYS.length,2);
});
for(const [name,mutate]of[
  ['UID',m=>{m.items[0].questionUid='qid_v1_'+'0'.repeat(64);}],['whole question',m=>{m.items[0].questionSha256='0'.repeat(64);}],
  ['current source',m=>{m.items[0].sourceRef.gitBlobSha1='0'.repeat(40);}],['asset',m=>{m.items[0].assets[0].ref.sha256='0'.repeat(64);}],
  ['solution scope',m=>{m.items[0].surfaces.push('SOLUTION');}],['viewport',m=>{m.viewports.PROBLEM[1].width=391;}],
  ['case count',m=>{m.expectedLogicalCases=84;}],['identity row',m=>{m.items[0].identityRowSha256='0'.repeat(64);}],
  ['metadata row',m=>{m.items[0].metadataRowSha256='0'.repeat(64);}],['helper manifest',m=>{m.authority='APPROVED';}]
])test('fixture rejects '+name+' drift',()=>{const m=clone(fixture);mutate(m);assert.throws(()=>C.validateManifest(m),/UI_STALE40_CLOSED_MANIFEST/);});

test('exact closed push records push and captured head without PR identity',()=>{
  const p=C.checkoutEvidence(head,env,event);assert.equal(p.eventName,'push');assert.equal(p.capturedHead,head);assert.equal(p.ref,C.OPS_REF);
  assert.equal(p.pullRequest,null);assert.equal(p.baseSha,null);
});
for(const [name,modify]of[
  ['repository',e=>{e.env.GITHUB_REPOSITORY='other/repo';}],['event',e=>{e.env.GITHUB_EVENT_NAME='pull_request';}],
  ['ref',e=>{e.env.GITHUB_REF='refs/heads/main';}],['fork',e=>{e.event.repository.fork=true;}],['missing fork',e=>{delete e.event.repository.fork;}],
  ['payload repository',e=>{e.event.repository.full_name='other/repo';}],['payload ref',e=>{e.event.ref='refs/heads/main';}],
  ['after',e=>{e.event.after='b'.repeat(40);}],['missing after',e=>{delete e.event.after;}],['event sha',e=>{e.env.GITHUB_SHA='b'.repeat(40);}],
  ['deleted',e=>{e.event.deleted=true;}],['missing deleted',e=>{delete e.event.deleted;}],['PR payload',e=>{e.event.pull_request={};}],
  ['run identity',e=>{e.env.GITHUB_RUN_ID='0';}],['checkout',e=>{e.actual='b'.repeat(40);}]
])test('closed push rejects '+name,()=>{const x={env:clone(env),event:clone(event),actual:head};modify(x);assert.throws(()=>C.checkoutEvidence(x.actual,x.env,x.event),/UI_/);});

test('data-only parser supports the exact JSON wrappers and escaped delimiters',()=>{
  const bank=[{id:1,content:'synthetic }; bracket ] and escaped " value',choices:[]}];
  for(const source of ['window.questionBank='+JSON.stringify(bank)+';',
    '/* metadata */\nwindow.examTitle="synthetic";window.examData='+JSON.stringify({questions:bank})+';',
    'window.examData='+JSON.stringify({questions:bank})+';window.questionBank=window.examData.questions;'])assert.deepEqual(C.loadQuestions(Buffer.from(source)),bank);
});
for(const [name,source]of[
  ['execution suffix','window.questionBank=[];process.exit(0);'],['function value','window.questionBank=[(()=>1)()];'],
  ['unquoted property','window.questionBank=[{id:1}];'],['duplicate assignment','window.questionBank=[];window.questionBank=[];'],
  ['foreign assignment','globalThis.questionBank=[];'],['missing semicolon','window.questionBank=[]'],
  ['invalid alias','window.questionBank=window.other.questions;'],['conflicting banks','window.examData={"questions":[]};window.questionBank=[{"id":1}];']
])test('source data parser rejects '+name,()=>assert.throws(()=>C.loadQuestions(Buffer.from(source))));

test('identity matching rejects a duplicate UID and a conflicting source ordinal',()=>{
  const row={questionUid:item.questionUid,sourceArchiveFile:item.sourcePath.slice('archive/exams/'.length),sourceOrdinal:item.sourceOrdinal};
  const i={...item,identityRowSha256:crypto.createHash('sha256').update(JSON.stringify(row,Object.keys(row).sort())).digest('hex')};
  assert.equal(C.validateIdentity({records:[row]},i),row);
  assert.throws(()=>C.validateIdentity({records:[row,{...row,sourceOrdinal:1}]},i),/UI_STALE40_GLOBAL_UID_UNIQUE/);
  assert.throws(()=>C.validateIdentity({records:[row,{...row,questionUid:'qid_v1_'+'f'.repeat(64)}]},i),/UI_STALE40_UNIQUE_IDENTITY_LOCATOR/);
});
test('policy is closed to exact fixture item, surface and viewport',()=>{
  const p=policy();assert(p.nativeAtoms&&Object.isFrozen(p));
  assert.throws(()=>A.makePolicy(reader,{...item,questionUid:'qid_v1_'+'f'.repeat(64)},'PROBLEM',viewport),/UI_STALE40_POLICY_UID/);
  assert.throws(()=>A.makePolicy(reader,{...item,sourceOrdinal:1},'PROBLEM',viewport),/UI_STALE40_POLICY_ITEM/);
  assert.throws(()=>A.makePolicy(reader,item,'SOLUTION',{name:'desktop',width:1440,height:1000}),/UI_STALE40_POLICY_SURFACE/);
  assert.throws(()=>A.makePolicy(reader,item,'PROBLEM',{...viewport,width:1366}),/UI_STALE40_POLICY_VIEWPORT/);
});
test('forged policy cannot start capture or substitute fragment policy',async()=>{
  await assert.rejects(A.capture({}, {}, '/tmp/synthetic.png', {...policy()}),/UI_STALE40_POLICY_NOT_ISSUED/);
  await assert.rejects(A.captureObservedTiles({}, {}, '/tmp/synthetic.png', {...policy()}),/UI_STALE40_POLICY_NOT_ISSUED/);
});

// A tiny synthetic browser tree exercises the actual read-only DOM reader.
// It contains no repository question text and performs no screenshot capture.
function nativeDom(p){
  const N={ELEMENT_NODE:1,TEXT_NODE:3,COMMENT_NODE:8};
  class E{
    constructor(tag,cls='',r={x:0,y:0,width:320,height:300}){this.nodeType=1;this.tagName=tag;this.cls=cls;this.childNodes=[];this.parentElement=null;this.r=r;this.attrs={};this.dataset={};this.css={display:'block',visibility:'visible',opacity:'1',position:'static'};}
    get children(){return this.childNodes.filter(n=>n.nodeType===1);}get textContent(){return this.childNodes.map(n=>n.textContent).join('');}
    get classList(){return{contains:c=>this.cls.split(' ').includes(c)};}
    append(...xs){for(const x of xs){x.parentElement=this;this.childNodes.push(x);}return this;}
    getBoundingClientRect(){return this.r;}hasAttribute(k){return Object.hasOwn(this.attrs,k);}getAttribute(k){return this.attrs[k]??null;}
    matches(s){return s.split(',').some(x=>x.trim().startsWith('.')?this.cls.split(' ').includes(x.trim().slice(1)):this.tagName.toLowerCase()===x.trim().toLowerCase());}
    contains(n){return n===this||this.childNodes.some(c=>c.nodeType===1&&c.contains(n)||c===n);}
    querySelectorAll(s){const out=[];for(const n of this.children){if(n.matches(s))out.push(n);out.push(...n.querySelectorAll(s));}return out;}
    closest(s){for(let n=this;n;n=n.parentElement)if(n.matches(s))return n;return null;}
    get outerHTML(){return JSON.stringify({tag:this.tagName,cls:this.cls,attrs:this.attrs,children:this.childNodes.map(n=>n.nodeType===1?n.outerHTML:n.textContent)});}
  }
  const text=(s,r)=>({nodeType:3,textContent:s,parentElement:null,rs:r?[r]:[]});
  const box=new E('DIV','q-box'),number=new E('DIV','q-num',{x:10,y:10,width:300,height:19});number.append(text(p.ordinal+'.'));
  const content=new E('DIV','q-content',{x:10,y:40,width:300,height:230});
  const statement=new E('P','',{x:10,y:40,width:300,height:30}),t=text('synthetic',{x:10,y:40,width:70,height:20});
  const math=new E('MJX-CONTAINER','',{x:90,y:40,width:30,height:20});statement.append(t,math);
  const picture=new E('P','',{x:10,y:80,width:300,height:190}),image=new E('IMG','',{x:10,y:80,width:300,height:180});
  image.src='https://img.wangjiedu.com/exams/images/'+p.assetRef.path.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
  image.currentSrc=image.src;image.complete=true;image.naturalWidth=300;image.naturalHeight=180;picture.append(image);content.append(statement,picture);
  const answer=new E('DIV','answer-box',{x:10,y:270,width:300,height:0});box.append(number,content,answer);box.dataset.sourceRef='synthetic-source-key';
  const doc={baseURI:'http://localhost/',documentElement:{dataset:{apPrintReadiness:JSON.stringify({state:'RENDER_READY'})}},
    querySelectorAll:()=>[],getElementById:()=>null,createRange(){return{selectNodeContents(n){this.n=n;},getClientRects(){return this.n.rs;}};}};
  const app={mode:'exam',data:Array.from({length:p.ordinal},()=>({}))};
  const globals={Node:N,document:doc,AppState:app,getArchiveQuestionSourceRef:()=>box.dataset.sourceRef,getComputedStyle:e=>e.css,
    innerWidth:p.viewport.width,innerHeight:p.viewport.height,scrollX:0,scrollY:0,crypto:crypto.webcrypto,TextEncoder,URL};
  return{E,text,box,number,content,statement,picture,image,answer,t,math,globals};
}
async function measureDom(d,p){const fn=vm.runInNewContext('('+A.measureNativeAtoms.toString()+')',d.globals);return fn(d.image,p);}
test('native reader measures real number, text ranges, math and image',async()=>{
  const p=policy(),d=nativeDom(p),f=await measureDom(d,p);A.assertNativeTopology(f.surface,p);assert.equal(f.children.length,4);
  assert.equal(f.surface.contentTextRanges,1);assert.equal(f.surface.contentMathAtoms,1);assert.equal(f.surface.contentImageAtoms,1);
  assert.equal(f.emptyAnswerBox.height,0);assert.equal(f.solutionNodes,0);
});
test('native reader accepts only the official unchanged equal-slot wrapper',async()=>{
  const p=policy(),d=nativeDom(p),wrapper=new d.E('DIV','ap-slot-content',{x:0,y:0,width:320,height:300});
  const nodes=d.box.childNodes;d.box.childNodes=[];wrapper.append(...nodes);d.box.cls='q-box ap-equal-slot';d.box.append(wrapper);
  const f=await measureDom(d,p);A.assertNativeTopology(f.surface,p);assert.equal(f.surface.wrapperCount,1);
});
for(const [name,mutate]of[
  ['hidden content',d=>{d.content.css.display='none';}],['hidden text',d=>{d.statement.attrs.hidden='';}],
  ['empty answer changed',d=>{d.answer.append(d.text('synthetic'));}],['nonzero answer',d=>{d.answer.r.height=1;}],
  ['out-of-content range',d=>{d.t.rs[0].x=400;}],['missing range',d=>{d.t.rs=[];}],
  ['wrong asset URL',d=>{d.image.src+='&extra=1';}],['unloaded image',d=>{d.image.complete=false;}],
  ['outside text',d=>{d.box.append(d.text('synthetic'));}],['extra wrapper',d=>{d.box.append(new d.E('DIV','ap-slot-content'));}],
  ['extra content element',d=>{d.statement.append(new d.E('SCRIPT'));}],['changed paragraph topology',d=>{d.statement.tagName='SPAN';}],
  ['duplicate image',d=>{d.content.append(new d.E('IMG'));}],['nested question',d=>{d.content.append(new d.E('DIV','q-box'));}],
  ['wrong number',d=>{d.number.childNodes=[d.text('1.')];}],['source identity mismatch',d=>{d.globals.getArchiveQuestionSourceRef=()=> 'other-key';}],
  ['DOM image clipping',d=>{d.image.r.width=500;}],['hidden math',d=>{d.math.css.visibility='hidden';}],
  ['duplicate atom',d=>{d.math.r={...d.t.rs[0]};}],['wrong viewport',d=>{d.globals.innerWidth++;}]
])test('native reader rejects '+name,async()=>{const p=policy(),d=nativeDom(p);mutate(d);await assert.rejects(measureDom(d,p),/UI_STALE40_/);});

function solutionFrame(){return{question:{x:0,y:0,width:300,height:400},children:[{x:10,y:10,width:280,height:20},{x:10,y:40,width:280,height:40},{x:10,y:90,width:280,height:290}],
  image:{x:10,y:150,width:200,height:100},viewport:{width:1440,height:1000},scroll:{x:0,y:0},obstructions:[],feedbackIdle:true,
  readiness:'RENDER_READY',mode:'sol',solutionNodes:5,mandatoryChildrenVisible:true};}
test('solution capture keeps real sol state and original three-role geometry',()=>{
  const f=solutionFrame(),tile={tileIndex:1,relativeInterval:[0,374]};const clip=A.assertSolutionTile(f,tile);
  assert.equal(clip.width,300);assert(clip.height>0);
});
for(const [name,modify]of[
  ['problem state',f=>{f.mode='exam';}],['missing solution nodes',f=>{f.solutionNodes=0;}],['readiness',f=>{f.readiness='WAITING';}],
  ['missing role',f=>{f.children.pop();}],['hidden role',f=>{f.mandatoryChildrenVisible=false;}],['feedback',f=>{f.feedbackIdle=false;}],
  ['obstruction',f=>{f.obstructions=[{x:0,y:20,width:300,height:30}];}],['clipped role',f=>{f.children[2].width=800;}]
])test('solution tile rejects '+name,()=>{const f=solutionFrame();modify(f);assert.throws(()=>A.assertSolutionTile(f,{tileIndex:1,relativeInterval:[0,200]}),/UI_/);});
test('safe failure records expose a code and never browser text',()=>{
  assert.equal(C.safeFailureCode(new Error('page.evaluate: Error: UI_STALE40_IMAGE_PATH at synthetic')),'UI_STALE40_IMAGE_PATH');
  assert.equal(C.safeFailureCode(new Error('synthetic unclassified message')),'UI_STALE40_CAPTURE_FAILED');
});

async function runSyntheticCapture(mutate){
  const p=policy(),d=nativeDom(p),original=JSON.parse(JSON.stringify(await measureDom(d,p)));let captured=false;
  const page={waitForFunction:async()=>{},evaluate:async()=>{},screenshot:async()=>{captured=true;}};
  const target={evaluate:async(fn)=>{
    if(fn===A.inspectCaptureHits)return{samples:10,outsideQuestion:captured&&mutate==='foreign'?1:0};
    assert.equal(fn,A.measureNativeAtoms);const f=clone(original);if(captured){
      if(mutate==='dom')f.domSha256='d'.repeat(64);
      if(mutate==='scroll')f.scroll.y=1;
      if(mutate==='geometry')f.image.x++;
      if(mutate==='hidden')f.mandatoryChildrenVisible=false;
      if(mutate==='roles')f.surface.completeNodeAccounting=false;
    }return f;
  }};
  return A.captureObservedTiles(page,target,'/tmp/synthetic-stale40-unit.png',p);
}
test('capture loop retains complete original tile coverage without DOM writes',async()=>{
  const result=await runSyntheticCapture(null);assert.equal(result.capture.tileCount,1);assert.equal(result.capture.coverage.complete,true);
  assert.equal(result.capture.domWrites,0);assert.equal(result.capture.cssWrites,0);assert.equal(result.capture.foreignContentHits,0);
  assert.equal(result.capture.tiles[0].hitTestSamples,20);
});
for(const failure of ['dom','scroll','geometry','hidden','roles','foreign'])test('capture loop rejects post-screenshot '+failure,async()=>{
  await assert.rejects(runSyntheticCapture(failure),/UI_/);
});

// Inventory-only fixtures: no browser, PNG generation, source reads or review.
// The logical rows retain their original question keys and surface fields.
function surfaceInventory(tileOverrides={}){
  const rows=C.planCases(fixture).flatMap(group=>group.items.map(subject=>{
    const id=[subject.key,group.surface,group.viewport.name].join(':');
    const count=tileOverrides[id]??1;
    const fileKey=group.surface==='SOLUTION'&&subject.key==='E051-Q15'
      ?subject.key:subject.key+'-'+group.surface;
    const shots=Array.from({length:count},(_,index)=>({tileIndex:index+1,
      path:`${fileKey}-${group.viewport.name}-tile-${String(index+1).padStart(2,'0')}.png`,
      sha256:'c'.repeat(64),bytes:index+1}));
    return{key:subject.key,questionUid:subject.questionUid,sourceOrdinal:subject.sourceOrdinal,
      surface:group.surface,mode:group.mode,viewport:clone(group.viewport),screenshots:shots,
      capture:{tileCount:count,tiles:shots.map(shot=>({tileIndex:shot.tileIndex,filename:shot.path}))}};
  }));
  const artifacts=rows.flatMap(row=>row.screenshots.map(({tileIndex,...shot})=>shot));
  return{rows,artifacts};
}
const runInventory=x=>C.assertScopedScreenshotInventory(x.rows,x.artifacts,fixture);
const findInventory=(x,key,surface='PROBLEM',viewport='desktop')=>x.rows.find(row=>row.key===key&&row.surface===surface&&row.viewport.name===viewport);
function renameInventoryShot(x,row,to){
  const old=row.screenshots[0].path;row.screenshots[0].path=to;row.capture.tiles[0].filename=to;
  x.artifacts.find(shot=>shot.path===old).path=to;
}
test('surface inventory maps exact 83 cases and keeps raw results and artifacts unchanged',()=>{
  const x=surfaceInventory(),before=clone(x);
  assert.throws(()=>require('../tools/check-reviewed-problem-renderer-browser.cjs').assertScreenshotInventory(x.rows,x.artifacts),/UI_SCREENSHOT_TILE_BINDING/);
  assert.equal(runInventory(x),83);assert.deepEqual(x,before);
});
for(const [label,id]of[
  ['ordinary problem','E037-Q22:PROBLEM:desktop'],
  ['ordinary solution','E044-Q21:SOLUTION:desktop'],
  ['unchanged E051 fragments','E051-Q15:SOLUTION:desktop']
])test('surface inventory accepts all original tiles for '+label,()=>{
  const x=surfaceInventory({[id]:8});assert.equal(runInventory(x),90);
});
for(const [name,mutate]of[
  ['missing logical case',x=>{x.rows.pop();}],
  ['duplicate logical case',x=>{x.rows[1]=clone(x.rows[0]);}],
  ['question key',x=>{x.rows[0].key='E000-Q1';}],
  ['UID cross-binding',x=>{x.rows[0].questionUid=x.rows[1].questionUid;}],
  ['ordinal cross-binding',x=>{x.rows[0].sourceOrdinal++;}],
  ['unknown surface',x=>{x.rows[0].surface='OTHER';}],
  ['problem as solution',x=>{findInventory(x,'E044-Q21').surface='SOLUTION';}],
  ['unknown viewport',x=>{x.rows[0].viewport.name='tablet';}],
  ['solution width in problem viewport',x=>{x.rows[0].viewport.width=1440;}],
  ['wrong mode',x=>{x.rows[0].mode='sol';}],
  ['problem filename without surface',x=>{const r=x.rows[0];renameInventoryShot(x,r,`${r.key}-desktop-tile-01.png`);}],
  ['solution filename labelled problem',x=>{const r=findInventory(x,'E044-Q21','SOLUTION');renameInventoryShot(x,r,'E044-Q21-PROBLEM-desktop-tile-01.png');}],
  ['problem filename labelled solution',x=>{const r=findInventory(x,'E044-Q21');renameInventoryShot(x,r,'E044-Q21-SOLUTION-desktop-tile-01.png');}],
  ['filename viewport cross-binding',x=>{const r=x.rows[0];renameInventoryShot(x,r,`${r.key}-PROBLEM-mobile-tile-01.png`);}],
  ['E051 fragment filename changed',x=>{const r=findInventory(x,'E051-Q15','SOLUTION');renameInventoryShot(x,r,'E051-Q15-SOLUTION-desktop-tile-01.png');}],
  ['capture filename differs from screenshot',x=>{x.rows[0].capture.tiles[0].filename='other.png';}],
  ['tile index skipped',x=>{x.rows[0].screenshots[0].tileIndex=2;}],
  ['missing screenshot',x=>{x.rows[0].screenshots=[];}],
  ['missing artifact',x=>{x.artifacts.pop();}],
  ['duplicate artifact',x=>{x.artifacts.push(clone(x.artifacts[0]));}],
  ['extra artifact',x=>{x.artifacts.push({path:'unselected.png',sha256:'d'.repeat(64),bytes:1});}],
  ['artifact hash mismatch',x=>{x.artifacts[0].sha256='d'.repeat(64);}],
  ['artifact byte count mismatch',x=>{x.artifacts[0].bytes++;}]
])test('surface inventory rejects '+name,()=>{
  const x=surfaceInventory();mutate(x);assert.throws(()=>runInventory(x),/UI_(?:STALE40_SCREENSHOT|SCREENSHOT)/);
});
test('surface inventory keeps the existing eight-tile limit',()=>{
  const x=surfaceInventory({'E051-Q15:SOLUTION:desktop':9});assert.throws(()=>runInventory(x),/UI_SCREENSHOT_TILE_COUNT/);
});

const initialFontGroup=()=>C.planCases(fixture)[0];
const initialFontReadiness=()=>({status:'loaded',family:'Nanum Myeongjo',weights:[400,700,800].map(weight=>({weight,loadedFaces:1,allLoaded:true,checked:true})),problemFontFamilies:[]});
const initialFontDom=()=>({printAreaCount:1,pageCount:7,questionBoxCount:25,selectorCounts:[0,0,0],unionCount:0,bodyFamily:'Nanum Myeongjo, serif',nodes:[]});
const initialFontError=()=>new Error('UI_STUDENT_FONT_NOT_APPLIED');
test('initial font diagnostic distinguishes empty original selector union without body text',async()=>{
  const p=await C.observeInitialFontFailure({evaluate:async()=>initialFontDom()},initialFontGroup(),fixture,initialFontReadiness(),initialFontError());
  assert.equal(p.status,'FAILURE_METADATA_ONLY');assert.equal(p.originalGuardObservation.familyCount,0);
  assert.deepEqual(p.afterFailureDom.selectorCounts,[0,0,0]);assert.equal(p.afterFailureDom.bodyFont.appliesExpected,true);
  assert.equal(p.afterFailureDom.observationTiming,'AFTER_ORIGINAL_FONT_GUARD_FAILURE');assert.equal(p.newApproval,0);
});
test('initial font diagnostic distinguishes a different family using only digest and expected flag',async()=>{
  const r=initialFontReadiness();r.problemFontFamilies=['SENSITIVE_SYNTHETIC_FAMILY'];const d=initialFontDom();d.unionCount=1;d.selectorCounts=[1,0,0];
  d.nodes=[{roles:[true,false,false],family:r.problemFontFamilies[0],rect:{x:0,y:1,width:2,height:3},displayNone:false,visibilityHidden:false,opacityZero:false,textContent:'SENSITIVE_SYNTHETIC_TEXT'}];
  const p=await C.observeInitialFontFailure({evaluate:async()=>d},initialFontGroup(),fixture,r,initialFontError());
  assert.equal(p.originalGuardObservation.familyCount,1);assert.equal(p.originalGuardObservation.families[0].appliesExpected,false);
  assert.equal(p.originalGuardObservation.families[0].sha256,crypto.createHash('sha256').update(r.problemFontFamilies[0]).digest('hex'));
  assert.equal(p.afterFailureDom.nodes[0].font.appliesExpected,false);assert(!JSON.stringify(p).includes('SENSITIVE_SYNTHETIC'));
  assert.deepEqual(Object.keys(p.afterFailureDom.nodes[0]),['roles','font','rect','displayNone','visibilityHidden','opacityZero']);
});
test('initial font diagnostic does not invoke DOM inspection for another failure enum',async()=>{
  let calls=0;const p=await C.observeInitialFontFailure({evaluate:async()=>{calls++;}},initialFontGroup(),fixture,null,new Error('UI_RENDERED_IMAGES'));
  assert.equal(p,null);assert.equal(calls,0);
});
for(const [name,change]of[
  ['other bank',g=>{g.sourcePath+='-other';}],['other surface',g=>{g.surface='SOLUTION';}],
  ['other viewport',g=>{g.viewport={...g.viewport,width:390};}],['other item',g=>{g.items=g.items.slice(1);}]
])test('initial font diagnostic refuses '+name+' before DOM read',async()=>{
  let calls=0;const g=initialFontGroup();change(g);const p=await C.observeInitialFontFailure({evaluate:async()=>{calls++;}},g,fixture,initialFontReadiness(),initialFontError());
  assert.equal(p.status,'UNAVAILABLE');assert.equal(calls,0);assert.equal(p.failureCode,'UI_STUDENT_FONT_NOT_APPLIED');
});
test('initial font diagnostic preserves original guard evidence when its DOM read fails',async()=>{
  const p=await C.observeInitialFontFailure({evaluate:async()=>{throw new Error('SENSITIVE_DIAGNOSTIC_FAILURE');}},initialFontGroup(),fixture,initialFontReadiness(),initialFontError());
  assert.equal(p.failureCode,'UI_STUDENT_FONT_NOT_APPLIED');assert.equal(p.originalGuardObservation.familyCount,0);
  assert.equal(p.afterFailureDom.status,'UNAVAILABLE');assert(!JSON.stringify(p).includes('SENSITIVE_DIAGNOSTIC_FAILURE'));
});
for(const [name,change]of[
  ['negative count',d=>{d.unionCount=-1;}],['unbounded count',d=>{d.pageCount=10001;}],
  ['role shape',d=>{d.nodes=[{roles:[true],rect:{x:0,y:0,width:1,height:1}}];}],
  ['invalid rect',d=>{d.nodes=[{roles:[true,false,false],rect:{x:0,y:0,width:Infinity,height:1}}];}],
  ['node limit',d=>{d.nodes=Array.from({length:129},()=>({}));}]
])test('initial font diagnostic contains '+name+' without changing original failure',async()=>{
  const d=initialFontDom();change(d);const p=await C.observeInitialFontFailure({evaluate:async()=>d},initialFontGroup(),fixture,initialFontReadiness(),initialFontError());
  assert.equal(p.afterFailureDom.status,'UNAVAILABLE');assert.equal(p.failureCode,'UI_STUDENT_FONT_NOT_APPLIED');
});
test('initial font diagnostic explicitly bounds original family list',async()=>{
  const r=initialFontReadiness();r.problemFontFamilies=Array.from({length:65},(_,i)=>'synthetic-'+i);
  const p=await C.observeInitialFontFailure({evaluate:async()=>initialFontDom()},initialFontGroup(),fixture,r,initialFontError());
  assert.equal(p.originalGuardObservation.familyCount,65);assert.equal(p.originalGuardObservation.families.length,64);
  assert.equal(p.originalGuardObservation.familyListTruncated,true);
});
