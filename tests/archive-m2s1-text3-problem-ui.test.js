'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const C=require('../tools/check-m2s1-text3-problem-browser.cjs'),H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-m2s1-text3-problem-ui.json')));
const commit=process.env.ARCHIVE_M2S1_TEXT3_PROBLEM_UI_TEST_COMMIT||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const cache=new Map();
const read=p=>{
 if(!cache.has(p)){
  const sha=execFileSync('git',['rev-parse',commit+':'+p],{encoding:'utf8'}).trim();
  cache.set(p,execFileSync('git',['cat-file','blob',sha],{maxBuffer:40e6}));
 }return cache.get(p);
};
const reader={read,ref:(p,b=read(p))=>({commit,path:p,gitBlobSha1:H.gitBlob(b),sha256:H.sha256(b),bytes:b.length})};
test('three closed problem bindings authenticate the whole source, own fields, asset and current identity',()=>{
 const out=C.preflight(reader,manifest);
 assert.equal(out.items.length,3);assert.deepEqual(out.items.map(x=>x.sourceOrdinal),[21,24,15]);
 assert.deepEqual(out.items.map(x=>x.expectedChoiceCount),[0,0,5]);
 assert(out.items.every(x=>x.assetRefs.length===1));assert.equal(out.status,undefined);
});
test('both own question and content belong to the bound problem payload',()=>{
 assert(C.FIELDS.PROBLEM.includes('question')&&C.FIELDS.PROBLEM.includes('content')&&C.FIELDS.PROBLEM.includes('choices'));
 const q=C.loadQuestions(read(manifest.items[1].sourcePath))[23];
 assert(Object.hasOwn(q,'question')&&Object.hasOwn(q,'content')&&q.question!==q.content);
 assert(q.question.includes('\\frac')&&q.content.includes('\\dfrac'));
});
test('scope, viewport, surface, duplicate, added property and choice count fail closed',()=>{
 for(const change of [m=>m.items.pop(),m=>m.items.push(m.items[0]),m=>m.viewports[0].width=390,m=>m.expectedCases=3,m=>m.surface='SOLUTION',m=>m.mode='sol',m=>m.items[0].expectedChoiceCount=5,m=>m.extra=true]){
  const m=structuredClone(manifest);change(m);assert.throws(()=>C.validateManifest(m));
 }
});
test('source and problem image byte drift cannot pass a correct-looking fixture',()=>{
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
 assert.throws(()=>C.checkoutEvidence(sha,{ARCHIVE_M2S1_TEXT3_PROBLEM_UI_EXPECTED_SHA:'b'.repeat(40)}));
 assert.equal(C.checkoutEvidence(sha,{ARCHIVE_M2S1_TEXT3_PROBLEM_UI_EXPECTED_SHA:sha}).actualCheckoutCommit,sha);
});
test('genuine exam mode, no solution nodes, math and exact bank count are mandatory',()=>{
 const t={mode:'exam',questions:24,pages:2,readiness:'RENDER_READY',imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:0};C.assertTechnicalState(t,'exam',24);
 for(const d of [{mode:'sol'},{solutionNodes:1},{mathErrors:1},{unrenderedMath:1},{imagesComplete:false},{mathJaxSource:'cdn'},{questions:23}])assert.throws(()=>C.assertTechnicalState({...t,...d},'exam',24));
 assert.throws(()=>C.assertTechnicalState({...t,mode:'sol'},'sol',24));
});
test('missing, duplicated or placeholder screenshot cases cannot grant technical success',()=>{
 assert.throws(()=>C.assertCompletedResults([],{},manifest,[]));
 assert.throws(()=>C.assertCompletedResults(Array(6).fill({status:'PASS',viewport:{name:'desktop'},key:'E044-Q21'}),{items:[]},manifest,[]));
});
test('actual capture refuses a draft binding before browser work',()=>{
 assert.throws(()=>C.assertFinalBinding({...manifest,bindingPhase:'DRAFT_CURRENT_SOURCE_FINAL_BINDING_REQUIRED'}),/UI_FINAL_PUBLIC_BINDING_REQUIRED/);
 assert.equal(C.assertFinalBinding(manifest).bindingPhase,'FINAL_PUBLIC_SOURCE_BINDING');
});
for(const globalName of ['window','console'])test('bank context cannot obtain host constructors through '+globalName,()=>{
 assert.throws(()=>C.loadQuestions(Buffer.from('window.questionBank=[];'+globalName+'.constructor.constructor("return process")()')),/Code generation from strings disallowed/);
});
