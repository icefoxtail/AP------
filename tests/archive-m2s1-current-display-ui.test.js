'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const C=require('../tools/check-m2s1-current-display-browser.cjs'),H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
const S=require('../tools/check-m2s1-solution-scroll.cjs');
const manifests=Object.fromEntries(Object.entries(C.SPECS).map(([k,s])=>[k,JSON.parse(fs.readFileSync(s.path))]));
const cache=new Map(),commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const read=p=>{if(!cache.has(p))cache.set(p,execFileSync('git',['show',commit+':'+p],{maxBuffer:40e6}));return cache.get(p);};
const reader={read,ref:(p,b=read(p))=>({commit,path:p,gitBlobSha1:H.gitBlob(b),sha256:H.sha256(b),bytes:b.length})};
test('closed glyph bindings verify one problem and two solution items without issuing UI or approval status',()=>{
 for(const [s,m] of Object.entries(manifests)){const out=C.preflight(reader,m);assert.equal(out.items.length,C.SPECS[s].count);assert(out.items.every(x=>x.assetRefs.length===1&&x.questionUid));assert.equal(out.status,undefined);}
});
test('scope changes, missing cases and widened viewports are rejected by exact manifest',()=>{
 for(const change of [m=>m.items.pop(),m=>m.items.push(m.items[0]),m=>m.viewports[0].width=1000,m=>m.expectedCases=1,m=>m.extra=true,m=>m.mode='sol']){
  const m=structuredClone(manifests.PROBLEM);change(m);assert.throws(()=>C.validateManifest(m));
 }
 assert.throws(()=>C.validateManifest({...manifests.PROBLEM,surface:'ANY'}));
});
test('a correct-looking manifest cannot conceal mutated source or asset bytes',()=>{
 const m=manifests.PROBLEM;
 for(const p of [m.items[0].sourcePath,m.items[0].assets[0].path])assert.throws(()=>C.preflight({...reader,read:q=>q===p?Buffer.concat([read(q),Buffer.from(' ') ]):read(q)},m));
});
test('source ordinal must retain its unique public identity',()=>{
 const p='archive/data/question_identity_map.json',m=manifests.PROBLEM,identity=JSON.parse(read(p));
 const row=identity.records.find(x=>x.sourceArchiveFile===m.items[0].sourcePath.slice('archive/exams/'.length)&&Number(x.sourceOrdinal)===m.items[0].sourceOrdinal);row.questionUid='wrong-uid';
 assert.throws(()=>C.preflight({...reader,read:q=>q===p?Buffer.from(JSON.stringify(identity)):read(q)},m),/UI_IDENTITY_UID/);
});
test('actual checkout and event binding are mandatory',()=>{
 const sha='a'.repeat(40);assert.throws(()=>C.checkoutEvidence(sha,{}));assert.throws(()=>C.checkoutEvidence(sha,{ARCHIVE_M2S1_DISPLAY_UI_EXPECTED_SHA:'b'.repeat(40)}));
 assert.equal(C.checkoutEvidence(sha,{ARCHIVE_M2S1_DISPLAY_UI_EXPECTED_SHA:sha}).actualCheckoutCommit,sha);
});
const frame=()=>({question:{x:100,y:100,width:300,height:400},children:[{x:102,y:102,width:100,height:20},{x:102,y:125,width:290,height:40},{x:102,y:170,width:290,height:200}],viewport:{width:1440,height:1000},feedbackIdle:true,readiness:'RENDER_READY',mode:'sol',solutionNodes:5,sourceFragments:1,mandatoryChildrenVisible:true,obstructions:[]});
test('solution capture requires genuine sol mode and exactly one complete source fragment',()=>{
 const f=frame(),tile=H.planProblemTiles(f).tiles[0];assert(S.assertSolutionTileCapture(f,tile));
 for(const delta of [{mode:'exam'},{solutionNodes:0},{sourceFragments:2},{mandatoryChildrenVisible:false},{feedbackIdle:false},{readiness:'RENDERING'}])assert.throws(()=>S.assertSolutionTileCapture({...f,...delta},tile));
});
test('solution coverage rejects obstruction and missing bottom even with a displayed image',()=>{
 const f=frame(),tile=H.planProblemTiles(f).tiles[0];assert.throws(()=>S.assertSolutionTileCapture({...f,obstructions:[{x:100,y:100,width:40,height:40}]},tile));
 assert.throws(()=>H.assertTileCoverage(100,[{tileIndex:1,relativeInterval:[0,99]}]));
});
test('problem state cannot be replaced with a solution state or incomplete math',()=>{
 const t={mode:'exam',questions:23,pages:2,readiness:'RENDER_READY',imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:0};C.assertTechnicalState(t,'exam',23);
 for(const d of [{solutionNodes:1},{mathErrors:1},{unrenderedMath:1},{imagesComplete:false},{mathJaxSource:'cdn'},{questions:22}])assert.throws(()=>C.assertTechnicalState({...t,...d},'exam',23));
});
test('no missing or placeholder screenshot set can grant technical pass',()=>{
 assert.throws(()=>C.assertCompletedResults([],{},manifests.PROBLEM,[]));assert.throws(()=>C.assertCompletedResults(Array(36).fill({status:'PASS',viewport:{name:'desktop'},key:'E009-Q08'}),{items:[]},manifests.PROBLEM,[]));
});
