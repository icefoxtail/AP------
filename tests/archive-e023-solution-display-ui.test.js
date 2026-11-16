'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const C=require('../tools/check-e023-solution-display-browser.cjs'),H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
const S=require('../tools/check-m2s1-solution-scroll.cjs');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-e023-solution-display-ui.json')));
const commit=process.env.ARCHIVE_E023_UI_TEST_COMMIT||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const cache=new Map();
const read=p=>{
 if(!cache.has(p)){
  const sha=execFileSync('git',['rev-parse',commit+':'+p],{encoding:'utf8'}).trim();
  cache.set(p,execFileSync('git',['cat-file','blob',sha],{maxBuffer:40e6}));
 }
 return cache.get(p);
};
const reader={read,ref:(p,b=read(p))=>({commit,path:p,gitBlobSha1:H.gitBlob(b),sha256:H.sha256(b),bytes:b.length})};
test('six closed E023 solution bindings match exact repository bytes without claiming UI approval',()=>{
 const out=C.preflight(reader,manifest);
 assert.equal(out.items.length,6);assert.deepEqual(out.items.map(x=>x.sourceOrdinal),[4,5,6,8,10,19]);
 assert(out.items.every(x=>x.assetRefs.length===1));assert.equal(out.status,undefined);
});
test('scope, viewport, surface, duplicated target and fixture additions fail closed',()=>{
 for(const change of [m=>m.items.pop(),m=>m.items.push(m.items[0]),m=>m.viewports[0].width=390,m=>m.expectedCases=5,m=>m.surface='PROBLEM',m=>m.mode='exam',m=>m.extra=true]){
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
 assert.throws(()=>C.checkoutEvidence(sha,{ARCHIVE_E023_SOLUTION_UI_EXPECTED_SHA:'b'.repeat(40)}));
 assert.equal(C.checkoutEvidence(sha,{ARCHIVE_E023_SOLUTION_UI_EXPECTED_SHA:sha}).actualCheckoutCommit,sha);
});
const frame=()=>({question:{x:100,y:100,width:300,height:400},children:[{x:102,y:102,width:100,height:20},{x:102,y:125,width:290,height:40},{x:102,y:170,width:290,height:200}],viewport:{width:1440,height:1000},feedbackIdle:true,readiness:'RENDER_READY',mode:'sol',solutionNodes:5,sourceFragments:1,mandatoryChildrenVisible:true,obstructions:[]});
test('a solution capture requires the complete original fragment with no obstruction',()=>{
 const f=frame(),tile=H.planProblemTiles(f).tiles[0];assert(S.assertSolutionTileCapture(f,tile));
 for(const d of [{mode:'exam'},{solutionNodes:0},{sourceFragments:2},{mandatoryChildrenVisible:false},{feedbackIdle:false},{readiness:'RENDERING'},{obstructions:[{x:100,y:100,width:40,height:40}]}])
  assert.throws(()=>S.assertSolutionTileCapture({...f,...d},tile));
 assert.throws(()=>H.assertTileCoverage(100,[{tileIndex:1,relativeInterval:[0,99]}]));
});
test('render readiness requires genuine sol mode, complete images, math and the exact bank count',()=>{
 const t={mode:'sol',questions:24,pages:2,readiness:'RENDER_READY',imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:5};C.assertTechnicalState(t,'sol',24);
 for(const d of [{mode:'exam'},{solutionNodes:0},{mathErrors:1},{unrenderedMath:1},{imagesComplete:false},{mathJaxSource:'cdn'},{questions:23}])assert.throws(()=>C.assertTechnicalState({...t,...d},'sol',24));
 assert.throws(()=>C.assertTechnicalState({...t,mode:'exam'},'exam',24));
});
test('missing, duplicated or placeholder screenshot cases cannot grant technical success',()=>{
 assert.throws(()=>C.assertCompletedResults([],{},manifest,[]));
 assert.throws(()=>C.assertCompletedResults(Array(6).fill({status:'PASS',viewport:{name:'desktop'},key:'E023-Q04'}),{items:[]},manifest,[]));
});

test('actual capture refuses a draft binding before any browser work',()=>{
 assert.throws(()=>C.assertFinalBinding({...manifest,bindingPhase:'DRAFT_CURRENT_SOURCE_FINAL_BINDING_REQUIRED'}),/UI_FINAL_PUBLIC_BINDING_REQUIRED/);
 assert.equal(C.assertFinalBinding({...manifest,bindingPhase:'FINAL_PUBLIC_SOURCE_BINDING'}).bindingPhase,'FINAL_PUBLIC_SOURCE_BINDING');
});
