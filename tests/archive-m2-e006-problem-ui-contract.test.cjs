'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
const C=require('../tools/check-m2-e006-problem-browser.cjs');
const original=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-m2-e006-problem-ui.json')));
const clone=v=>structuredClone(v),digest=v=>H.sha256(H.stable(v));

test('closed two-item cohort preserves Q3 v3 and Q21 v2 with four logical cases',()=>{
 C.validateManifest(original);assert.equal(original.items.length,2);assert.equal(original.expectedCases,4);
 assert.deepEqual(original.items.map(x=>[x.key,x.sourceOrdinal,x.expectedBankCount,x.expectedChoiceCount,x.expectedImageWidth,x.expectedImageHeight]),
  [['E006-Q3',3,23,5,712,519],['E006-Q21',21,23,0,722,537]]);
 assert.deepEqual(original.items.map(x=>x.assetGitBlobSha1),['f3f0e19b5a70233587f70139c2ec58c947345a0a','cb2d982095986c654797fbf2bbbf85f582e96eba']);
 assert.equal(C.EXPECTED_STATIC_REFS.length,3);assert.equal(C.EXPECTED_SURFACE_REFS.length,4);
});
test('draft cannot read source or identity',()=>{
 let reads=0;assert.throws(()=>C.preflight({read(){reads++;throw Error('unexpected read');}},{...clone(original),bindingState:C.DRAFT}),/PUBLIC_SOURCE_SEAL_REQUIRED/);assert.equal(reads,0);
});
for(const [name,change] of Object.entries({
 'unknown option':m=>m.fallback=true,'scope':m=>m.scope='GENERAL','binding':m=>m.bindingState='READY',
 'two cases':m=>m.expectedCases=2,'six cases':m=>m.expectedCases=6,'missing item':m=>m.items.pop(),
 'duplicate item':m=>m.items[1]=clone(m.items[0]),'foreign UID':m=>m.items[0].questionUid='qid_v1_'+'0'.repeat(64),
 'foreign ordinal':m=>m.items[0].sourceOrdinal=4,'wrong bank count':m=>m.items[0].expectedBankCount=24,
 'old Q3 asset':m=>m.items[0].assetPath=m.items[0].assetPath.replace('v3','v2'),
 'resealed asset':m=>m.items[1].assetSha256='0'.repeat(64),'different layout':m=>m.items[1].expectedLayoutTag='normal',
 'Q21 choices':m=>m.items[1].expectedChoiceCount=5,'changed width':m=>m.items[0].expectedImageWidth++,
 'inline image profile':m=>m.items[0].imageBinding='CONTENT_SINGLE_IMG','problem payload':m=>m.items[0].problemPayloadSha256='0'.repeat(64),
 'different viewport':m=>m.viewports[1].width=500,'device scale':m=>m.viewports[1].deviceScaleFactor=.5,
 'source count':m=>m.sourceBindings.push(clone(m.sourceBindings[0])),
 'foreign source SHA':m=>m.sourceBindings[0].sha256='0'.repeat(64),'foreign source Git':m=>m.sourceBindings[0].gitBlobSha1='0'.repeat(40),
 'source bytes':m=>m.sourceBindings[0].bytes++,'source traversal':m=>m.sourceBindings[0].sourcePath='../other.js',
 'source fallback':m=>m.sourceBindings[0].allowFallback=true
}))test('manifest rejects '+name,()=>{const m=clone(original);change(m);assert.throws(()=>C.validateManifest(m));});
test('checkout event and expected SHA remain exact',()=>{
 const c='a'.repeat(40),other='b'.repeat(40);assert.equal(C.checkoutEvidence(c,{ARCHIVE_M2_E006_UI_EXPECTED_SHA:c,GITHUB_SHA:other}).githubEventCommit,other);
 for(const env of [{},{ARCHIVE_M2_E006_UI_EXPECTED_SHA:other},{ARCHIVE_M2_E006_UI_EXPECTED_SHA:c,GITHUB_SHA:'bad'}])assert.throws(()=>C.checkoutEvidence(c,env));
});
test('all four current renderer files and original-first static documents remain pinned',()=>{
 for(const [rows,fn] of [[C.EXPECTED_SURFACE_REFS,C.checkedSurface],[C.EXPECTED_STATIC_REFS,C.checkedStaticBasis]]){
  const ref=p=>({commit:'a'.repeat(40),...rows.find(x=>x.path===p)});assert.equal(fn({read:()=>Buffer.from('fixture'),ref}).length,rows.length);
  for(const field of ['path','gitBlobSha1','sha256','bytes'])assert.throws(()=>fn({read:()=>Buffer.from('fixture'),ref:p=>({...ref(p),[field]:field==='bytes'?1:'changed'})}));
 }
});
const synthetic=(ordinal=3)=>({id:ordinal,content:'Synthetic problem only.',choices:ordinal===3?['A','B','C','D','E']:[],image:'assets/images/synthetic/q'+ordinal+'.svg',layoutTag:'fullwidth'});
const bind=q=>({key:'SYNTHETIC',sourceOrdinal:q.id,expectedChoiceCount:q.id===3?5:0,choiceShape:'ARRAY',imageBinding:'QUESTION_IMAGE',assetPath:'archive/'+q.image,
 problemPayloadSha256:digest({content:q.content??q.question,choices:q.choices??[]}),problemFieldsSha256:digest(C.ownSnapshot(q,['content','question','choices'])),
 presentationSha256:digest(C.ownSnapshot(q,['image','imageAlt','imageSize','layoutTag'])),choicePresentationSha256:digest(C.ownSnapshot(q,['choicesEmbeddedInImage']))});
test('five visible choices and original empty answer space are distinct exact source states',()=>{
 for(const ordinal of [3,21]){const q=synthetic(ordinal);C.assertBoundQuestion(bind(q),q);}
});
for(const [name,change] of Object.entries({
 'given':q=>q.content+=' changed','choice order':q=>q.choices.reverse(),'ordinal':q=>q.id=4,
 'null alias':q=>q.question=null,'null image alt':q=>q.imageAlt=null,'layout':q=>q.layoutTag='normal',
 'image':q=>q.image+='changed','flag':q=>q.choicesEmbeddedInImage=false
}))test('sealed source fields reject '+name,()=>{const q=synthetic(),i=bind(q);change(q);assert.throws(()=>C.assertBoundQuestion(i,q));});
for(const [name,change] of Object.entries({
 'inline extra image':q=>q.content+='<img src=x>','embedded choices':q=>q.choicesEmbeddedInImage=true,
 'four choices':q=>q.choices.pop(),'missing choices':q=>delete q.choices,'foreign layout':q=>q.layoutTag='normal'
}))test('resealed synthetic given rejects '+name,()=>{const q=synthetic();change(q);assert.throws(()=>C.assertBoundQuestion(bind(q),q));});
test('whole JS suffix executes inside an isolated data-only VM',()=>assert.deepEqual(C.loadQuestions(Buffer.from('window.questionBank=[{id:1}];window.questionBank[0].tag="suffix";')),[{id:1,tag:'suffix'}]));
for(const [name,script] of Object.entries({
 'window host constructor':'window.questionBank=window.constructor.constructor("return process")();',
 'console host constructor':'window.questionBank=console.log.constructor("return process")();',
 'Function':'window.questionBank=Function("return []")();','getter':'window.questionBank=[{get id(){return 1;}}];',
 'prototype':'window.questionBank=[Object.create({id:1})];','cycle':'window.questionBank=[];window.questionBank.push(window.questionBank);',
 'sparse':'window.questionBank=new Array(2);','not finite':'window.questionBank=[{id:NaN}];'
}))test('VM refuses '+name,()=>assert.throws(()=>C.loadQuestions(Buffer.from(script))));

function dom(ordinal=3){
 function node(tag,cls,text=''){
  const classes=new Set(cls.split(' ').filter(Boolean));const n={tagName:tag,classes,classList:{contains:k=>classes.has(k)},children:[],extraNodes:[],parent:null,isConnected:true,
   style:{display:'block',visibility:'visible',opacity:'1'},rect:{width:300,height:40},ownText:text,
   get textContent(){return this.ownText+this.children.map(c=>c.textContent).join('');},get childNodes(){return [...this.children,...this.extraNodes];},
   getBoundingClientRect(){return this.rect;},contains(x){return this===x||this.children.some(c=>c.contains(x));},
   querySelectorAll(selector){const match=x=>selector[0]==='.'?x.classes.has(selector.slice(1)):x.tagName.toLowerCase()===selector;return this.children.flatMap(c=>[...(match(c)?[c]:[]),...c.querySelectorAll(selector)]);},
   querySelector(selector){return this.querySelectorAll(selector)[0]||null;},closest(selector){return this.classes.has(selector.slice(1))?this:this.parent?.closest(selector)||null;}};
  return n;
 }
 const append=(a,b)=>{a.children.push(b);b.parent=a;return b;};
 const box=node('DIV','q-box'),num=append(box,node('DIV','q-num',String(ordinal)+'.')),
  content=append(box,node('DIV','q-content','Synthetic given.')),picture=append(box,node('DIV','q-image-wrap')),
  answer=append(box,node('DIV',ordinal===3?'choices':'answer-box')),image=append(picture,node('IMG',''));
 Object.assign(image,{complete:true,naturalWidth:712,naturalHeight:519});
 const choices=[];if(ordinal===3)for(let i=0;i<5;i++){
  const item=append(answer,node('DIV','choice-item'));append(item,node('SPAN','choice-no',String(i+1)));append(item,node('SPAN','choice-text','Synthetic choice'));choices.push(item);
 }
 if(ordinal===21)answer.rect.height=0;
 return {box,num,content,picture,answer,image,choices,node,append,spec:{sourceOrdinal:ordinal,expectedChoiceCount:ordinal===3?5:0}};
}
function collect(f){const old=global.getComputedStyle;global.getComputedStyle=n=>n.style;try{return C.collectLegacyRoleFrame(f.image,f.spec);}finally{if(old===undefined)delete global.getComputedStyle;else global.getComputedStyle=old;}}
test('collector observes actual direct roles for both profiles without mutation',()=>{
 for(const ordinal of [3,21]){const f=dom(ordinal),before=f.box.textContent,frame=collect(f);C.assertLegacyRoleFrame(frame,f.spec);assert.equal(f.box.textContent,before);assert.equal(f.box.children.length,4);}
});
for(const [name,change] of Object.entries({
 'hidden number':f=>f.num.style.display='none','transparent given':f=>f.content.style.opacity='0',
 'hidden image':f=>f.image.rect.height=0,'unloaded image':f=>f.image.complete=false,
 'extra outer role':f=>f.append(f.box,f.node('DIV','extra','unexpected')),
 'anonymous text':f=>f.box.extraNodes.push({nodeType:3,textContent:'unexpected'}),
 'equal-slot wrapper':f=>{const w=f.node('DIV','ap-slot-content');w.children=f.box.children;f.box.children=[w];w.parent=f.box;},
 'wrong visible ordinal':f=>f.num.ownText='4.','missing content':f=>f.content.ownText='',
 'extra image':f=>f.append(f.picture,f.node('IMG','')),'choice missing':f=>f.answer.children.pop(),
 'hidden choice':f=>f.choices[2].style.visibility='hidden','choice label absent':f=>f.choices[0].children.shift(),
 'empty choice':f=>f.choices[0].children[1].ownText='',
 'wrong scope':f=>f.spec.sourceOrdinal=4
}))test('collector refuses '+name,()=>{const f=dom();change(f);assert.throws(()=>collect(f));});
test('Q21 empty response is preserved, extra response content is rejected',()=>{
 const f=dom(21);C.assertLegacyRoleFrame(collect(f),f.spec);f.answer.ownText='unexpected';assert.throws(()=>collect(f),/EMPTY_RESPONSE_SPACE/);
});
function cases(){
 const m=clone(original),items=m.items.map(item=>({...item,sourceRef:{commit:'a'.repeat(40),path:item.sourcePath,gitBlobSha1:'b'.repeat(40),sha256:'c'.repeat(64),bytes:100},
  assetRef:{commit:'a'.repeat(40),path:item.assetPath,gitBlobSha1:item.assetGitBlobSha1,sha256:item.assetSha256,bytes:item.assetBytes}}));
 const results=items.flatMap(item=>m.viewports.map(viewport=>{
  const filename=`${item.key}-${viewport.name}-tile-01.png`,domSha='d'.repeat(64),tile={tileIndex:1,relativeInterval:[0,100],filename,clip:{x:28,y:60,width:300,height:100},scroll:{x:0,y:0},scrollOperations:1,
   feedbackIdle:true,obstructionsIntersectingClip:0,hitTestSamples:100,foreignContentHits:0,domSha256:domSha};
  return {status:'PASS',key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,viewport,sourceRef:item.sourceRef,assetRef:item.assetRef,
   screenshots:[{tileIndex:1,path:filename,sha256:H.sha256(filename),bytes:16}],
   technical:{mode:'exam',questions:23,pages:1,readiness:'RENDER_READY',imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:0,
    fontReadiness:{status:'loaded',family:'Nanum Myeongjo',weights:[400,700,800].map(weight=>({weight,loadedFaces:1,allLoaded:true,checked:true})),problemFontFamilies:['"Nanum Myeongjo", serif']}},
   legacyRoleFrame:collect(dom(item.sourceOrdinal)),geometry:{naturalWidth:item.expectedImageWidth,naturalHeight:item.expectedImageHeight,image:{width:300},imageInsideQuestion:true},
   capture:{schemaVersion:H.TILE_SCHEMA,method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',tileLimit:8,overlapCssPixels:32,tileCount:1,content:{height:100},coverage:{requiredInterval:[0,100],coveredInterval:[0,100],complete:true},tiles:[tile],
    feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false,domSha256:domSha},visualReview:'PENDING',pageErrors:[],requestFailures:[],externalRequests:[]};
 }));
 const artifacts=results.flatMap(row=>row.screenshots.map(({path,sha256,bytes})=>({path,sha256,bytes}))).sort((a,b)=>a.path.localeCompare(b.path));return {m,inputs:{items},results,artifacts};
}
test('four logical cases require four original PNGs and exact inventories',()=>{const f=cases();assert.equal(C.assertCompletedResults(f.results,f.inputs,f.m,f.artifacts),4);});
test('a longer original problem uses an additional original tile with 32px overlap',()=>{
 const f=cases(),r=f.results[0],first=r.capture.tiles[0];r.capture.content.height=168;r.capture.tileCount=2;
 const second={...clone(first),tileIndex:2,relativeInterval:[68,168],filename:first.filename.replace('01.png','02.png')};r.capture.tiles.push(second);r.capture.coverage=H.assertTileCoverage(168,r.capture.tiles);
 const shot={tileIndex:2,path:second.filename,sha256:H.sha256(second.filename),bytes:20};r.screenshots.push(shot);f.artifacts.push({path:shot.path,sha256:shot.sha256,bytes:shot.bytes});
 assert.equal(C.assertCompletedResults(f.results,f.inputs,f.m,f.artifacts),5);
});
for(const [name,change] of Object.entries({
 'missing logical case':f=>f.results.pop(),'duplicate':f=>f.results[1]=clone(f.results[0]),'viewport':f=>f.results[0].viewport.width--,
 'wrong UID':f=>f.results[0].questionUid='qid_v1_'+'0'.repeat(64),'source drift':f=>f.results[0].sourceRef={...f.results[0].sourceRef,sha256:'0'.repeat(64)},
 'asset drift':f=>f.results[0].assetRef={...f.results[0].assetRef,sha256:'0'.repeat(64)},'bank count':f=>f.results[0].technical.questions--,
 'solution nodes':f=>f.results[0].technical.solutionNodes=1,'math pending':f=>f.results[0].technical.unrenderedMath=1,
 'font pending':f=>f.results[0].technical.fontReadiness.status='loading','font weight':f=>f.results[0].technical.fontReadiness.weights.pop(),
 'role proof':f=>f.results[0].legacyRoleFrame.choiceCount=4,'wrapper proof':f=>f.results[0].legacyRoleFrame.directChildRoles=['ap-slot-content'],
 'CSS write':f=>f.results[0].capture.cssWrites=1,'DOM write':f=>f.results[0].capture.domWrites=1,'viewport write':f=>f.results[0].capture.viewportChanges=1,
 'composite':f=>f.results[0].capture.compositeImageCreated=true,'occluded tile':f=>f.results[0].capture.tiles[0].obstructionsIntersectingClip=1,
 'foreign content':f=>f.results[0].capture.tiles[0].foreignContentHits=1,'no hit tests':f=>f.results[0].capture.tiles[0].hitTestSamples=0,
 'changed DOM':f=>f.results[0].capture.tiles[0].domSha256='0'.repeat(64),'coverage':f=>f.results[0].capture.tiles[0].relativeInterval[1]=99,
 'clipped image':f=>f.results[0].geometry.imageInsideQuestion=false,'wrong dimensions':f=>f.results[0].geometry.naturalWidth--,
 'network failure':f=>f.results[0].requestFailures=[{urlSha256:'0'.repeat(64)}],'missing PNG':f=>f.artifacts.pop(),
 'extra PNG':f=>f.artifacts.push({path:'unselected.png',sha256:'0'.repeat(64),bytes:1}),'PNG drift':f=>f.artifacts[0].sha256='0'.repeat(64)
}))test('completion refuses '+name,()=>{const f=cases();change(f);assert.throws(()=>C.assertCompletedResults(f.results,f.inputs,f.m,f.artifacts));});
test('output must be empty and outside the checkout',()=>{
 const base=fs.mkdtempSync(path.join(os.tmpdir(),'e006-ui-'));try{const root=path.join(base,'checkout');fs.mkdirSync(root);assert.equal(C.checkedOutput(root,path.join(base,'out')),path.join(base,'out'));
  assert.throws(()=>C.checkedOutput(root,root));assert.throws(()=>C.checkedOutput(root,path.join(root,'out')));fs.mkdirSync(path.join(base,'used'));fs.writeFileSync(path.join(base,'used/old.json'),'{}');assert.throws(()=>C.checkedOutput(root,path.join(base,'used')));
  fs.symlinkSync(path.join(base,'used'),path.join(base,'alias'));assert.throws(()=>C.checkedOutput(root,path.join(base,'alias/child')));
 }finally{fs.rmSync(base,{recursive:true,force:true});}
});
test('workflow is read-only, exact-branch, four owned paths, full history and two viewport capture',()=>{
 const workflow=fs.readFileSync(path.join(__dirname,'../.github/workflows/archive-m2-e006-problem-ui.yml'),'utf8');
 assert.match(workflow,/contents: read/);assert.match(workflow,/fetch-depth: 0/);assert.match(workflow,/persist-credentials: false/);
 assert.match(workflow,/review-reference\/m2-e006-q3-q21-problem-ui-20261116/);assert.match(workflow,/ref: \$\{\{ github.sha \}\}/);
 assert.match(workflow,/ARCHIVE_M2_E006_UI_EXPECTED_SHA: \$\{\{ github.sha \}\}/);assert.match(workflow,/if: always\(\)/);
 assert.equal((workflow.match(/^      - '(?:[^']+)'$/gm)||[]).length,4);assert(!/contents: write|git push|equalSlots=|deviceScaleFactor: 0/.test(workflow));
});
