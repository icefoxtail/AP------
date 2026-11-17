'use strict';
// Protocol and checkout-identity fixtures only: no real Chrome or source bank.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const T=require('../tools/emit-protected9-ui-log-transport.cjs');
const M1=require('../tools/check-m1s2-problem-seven-browser.cjs');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),clone=x=>JSON.parse(JSON.stringify(x));
const HEAD='1'.repeat(40),REPO='icefoxtail/AP------',OWNER='GITHUB_ACTIONS_SUPPORTED_CHROME';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1sAAAAASUVORK5CYII=','base64');
const currentRef=relative=>({commit:HEAD,path:relative,gitBlobSha1:'a'.repeat(40),sha256:'b'.repeat(64),bytes:1});
function protocol(profile){
 const spec=T.PROFILES[profile];
 const env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:REPO,GITHUB_REF:T.REVIEW_REF,
  GITHUB_SHA:HEAD,GITHUB_RUN_ID:'9001',GITHUB_RUN_ATTEMPT:'1',GITHUB_WORKFLOW:'Protected current renderer fixture',GITHUB_JOB:'current-ui'};
 const event={ref:T.REVIEW_REF,after:HEAD,deleted:false,repository:{full_name:REPO,fork:false}};
 const context=T.executionContext(HEAD,env,event);
 const items=spec.subjects.map(({key,questionUid,sourceOrdinal,sourcePath,assetPath})=>({
  key,questionUid,sourceOrdinal,sourceRef:currentRef(sourcePath),
  ...(assetPath?{assetRef:currentRef(assetPath)}:{assetRefs:[]})
 }));
 const results=items.flatMap(item=>T.VIEWPORTS.map(viewport=>{
  const filename=item.key+'-'+viewport.name+'-tile-01.png';
  return{key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,status:'PASS',viewport:{...viewport},
   sourceRef:clone(item.sourceRef),...(profile==='q16'?{assetRefs:[]}:{assetRef:clone(item.assetRef)}),
   ...(profile==='m1'?{surface:'PROBLEM',mode:'exam',assetRefs:[clone(item.assetRef)]}:{}),
   screenshots:[{tileIndex:1,path:filename,sha256:sha(png),bytes:png.length}],
   capture:{tileCount:1,tiles:[{tileIndex:1,filename}]},technical:{mode:'exam',solutionNodes:0},
   pageErrors:[],requestFailures:[],externalRequests:[],visualReview:'PENDING'};
 }));
 const proof={schemaVersion:spec.schema,status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',checkoutCommit:HEAD,
  executionOwner:profile==='m1'?'GITHUB_ACTIONS_CHROMIUM_CLOSED_OPS_PUSH_HEAD':OWNER,mode:'exam',
  screenshotsScope:'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY',problemOnlyScreenshots:true,
  sourceOverlay:false,sourceOverlayCount:0,sourceWrites:0,solutionsOpened:false,newFullMathematicalQa:false,
  newMetadataApprovals:0,newDifficultyJudgments:0,newReviewPassCount:0,newFourSlotApprovals:0,
  items,expectedLogicalCases:spec.cases,completedLogicalCases:results.length,results,
  screenshotArtifacts:results.flatMap(r=>r.screenshots.map(({tileIndex,...shot})=>shot)),
  screenshotArtifactCount:results.length,failures:[]};
 if(profile==='m1')proof.execution={provider:'GITHUB_ACTIONS',eventName:'push',repository:REPO,ref:T.REVIEW_REF,
  workflow:context.workflow,job:context.job,runId:context.runId,runAttempt:context.runAttempt,
  headSha:HEAD,capturedHead:HEAD,eventSha:HEAD,pullRequest:null,baseSha:null};
 if(profile==='q16'){
  proof.surface='PROBLEM';
  proof.executionProvenance={executionOwner:OWNER,checkout:{expectedCheckoutCommit:HEAD,actualCheckoutCommit:HEAD,
   executionOwner:OWNER,githubEventCommit:HEAD,repository:REPO,runId:context.runId,runAttempt:String(context.runAttempt),
   job:context.job,eventName:'push',headCommit:HEAD}};
 }
 if(profile==='q5'){
  proof.checkout={expectedCheckoutCommit:HEAD,actualCheckoutCommit:HEAD,githubEventCommit:HEAD};
  proof.newParentApprovals=0;proof.newNativeApprovals=0;proof.releaseGate='PENDING_INDEPENDENT_VISUAL_REVIEW';
 }
 return{profile,env,event,context,proof};
}
function fixture(t,profile){
 const p=protocol(profile),directory=fs.mkdtempSync(path.join(os.tmpdir(),'current-ui-log-')),out=path.join(directory,'output');
 fs.mkdirSync(out);
 const write=()=>fs.writeFileSync(path.join(out,'technical-proof.json'),JSON.stringify(p.proof,null,2)+'\n');
 for(const shot of p.proof.screenshotArtifacts)fs.writeFileSync(path.join(out,shot.path),png);
 write();t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 return{...p,directory,out,write,collect:()=>T.collectBundle({out,profile,context:p.context})};
}
for(const profile of ['m1','q16','q5']){
 test(profile+' original JSON and every PNG round-trip with exact real push context',t=>{
  const f=fixture(t,profile),original=fs.readFileSync(path.join(f.out,'technical-proof.json')),bundle=f.collect();
  const frames=[...T.frames(bundle)].map(line=>JSON.parse(line));
  assert.equal(bundle.manifest.logicalCases,T.PROFILES[profile].cases);
  assert.equal(bundle.manifest.captureStatus,'TECHNICAL_PASS_VISUAL_REVIEW_PENDING');
  assert.equal(bundle.manifest.execution.checkoutCommit,HEAD);
  assert.equal(bundle.manifest.execution.eventCommit,HEAD);
  assert.equal(bundle.manifest.execution.runId,'9001');assert.equal(bundle.manifest.newApprovals,0);
  for(let i=0;i<bundle.files.length;i++){
   const chunks=frames.filter(x=>x.kind==='file-chunk'&&x.fileIndex===i);
   assert(chunks.every((x,j)=>x.chunkIndex===j&&x.chunks===chunks.length&&x.base64.length<=T.LIMITS.chunkCharacters));
   const decoded=Buffer.from(chunks.map(x=>x.base64).join(''),'base64');
   assert(decoded.equals(bundle.files[i].data));assert.equal(sha(decoded),bundle.files[i].sha256);
  }
  assert(bundle.files[0].data.equals(original));
  if(profile==='q5'){
   assert.equal(Object.hasOwn(f.proof,'surface'),false);
   assert.equal(Object.hasOwn(f.proof.checkout,'runId'),false);
   assert.equal(Object.hasOwn(f.proof.checkout,'job'),false);
  }
 });
 test(profile+' partial capture stays failed with uncompleted tiles labelled',t=>{
  const f=fixture(t,profile);f.proof.status='FAIL';f.proof.failureCode='UI_BROWSER_CHECK_FAILED';
  f.proof.results=f.proof.results.slice(0,1);f.proof.completedLogicalCases=1;f.write();
  const bundle=f.collect();assert.equal(bundle.manifest.captureStatus,'FAIL');assert.equal(bundle.manifest.logicalCases,1);
  assert.equal(bundle.manifest.uncompletedCasePngFiles,T.PROFILES[profile].cases-1);
 });
 test(profile+' rejects a foreign selected UID and a missing logical case',t=>{
  const f=fixture(t,profile),uid=f.proof.items[0].questionUid;
  f.proof.items[0].questionUid='qid_v1_'+'f'.repeat(64);f.write();assert.throws(()=>f.collect(),/UI_LOG_ITEM_SCOPE/);
  f.proof.items[0].questionUid=uid;f.proof.results.pop();f.proof.completedLogicalCases--;f.write();
  assert.throws(()=>f.collect(),/UI_LOG_COMPLETE_CAPTURE|UI_SCREENSHOT_/);
 });
 test(profile+' rejects a source substitution and same-subject mixed result refs',t=>{
  const f=fixture(t,profile),original=clone(f.proof.items[0].sourceRef);
  f.proof.items[0].sourceRef.path='archive/exams/unknown.js';f.write();assert.throws(()=>f.collect(),/UI_LOG_ITEM_SOURCE/);
  f.proof.items[0].sourceRef=original;f.proof.results[0].sourceRef.sha256='c'.repeat(64);f.write();
  assert.throws(()=>f.collect(),/UI_LOG_RESULT_SOURCE/);
 });
 test(profile+' refuses a cross-profile schema or PR identity on this ops lane',t=>{
  const f=fixture(t,profile);f.proof.schemaVersion=T.PROFILES.svg7.schema;f.write();
  assert.throws(()=>f.collect(),/UI_LOG_PROFILE_SCHEMA/);
  f.proof.schemaVersion=T.PROFILES[profile].schema;f.write();
  assert.throws(()=>T.collectBundle({out:f.out,profile,context:{...f.context,eventName:'pull_request'}}),/UI_LOG_CLOSED_OPS_PROFILE/);
 });
 test(profile+' rejects solutions and an approval effect',t=>{
  const f=fixture(t,profile);f.proof.results[0].technical.solutionNodes=1;f.write();
  assert.throws(()=>f.collect(),/UI_LOG_RESULT_PROBLEM_ONLY/);
  f.proof.results[0].technical.solutionNodes=0;f.proof.newFourSlotApprovals=1;f.write();
  assert.throws(()=>f.collect(),/UI_LOG_PROBLEM_ONLY/);
 });
}
for(const [profile,name,mutate,error] of [
 ['m1','captured head',p=>{p.execution.capturedHead='2'.repeat(40);},/UI_LOG_M1_EXECUTION/],
 ['m1','PR-shaped base',p=>{p.execution.baseSha='3'.repeat(40);},/UI_LOG_M1_EXECUTION/],
 ['m1','job identity',p=>{p.execution.job='other-job';},/UI_LOG_M1_EXECUTION/],
 ['m1','old PR owner',p=>{p.executionOwner='GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD';},/UI_LOG_M1_EXECUTION/],
 ['m1','source-owned asset',p=>{p.items[0].assetRef.path='archive/assets/images/foreign.svg';},/UI_LOG_ITEM_ASSET/],
 ['q16','run identity',p=>{p.executionProvenance.checkout.runId='9002';},/UI_LOG_Q16_EXECUTION/],
 ['q16','actual checkout',p=>{p.executionProvenance.checkout.actualCheckoutCommit='2'.repeat(40);},/UI_LOG_Q16_EXECUTION/],
 ['q16','top solution surface',p=>{p.surface='SOLUTION';},/UI_LOG_Q16_SURFACE/],
 ['q16','invented file asset',p=>{p.results[0].assetRefs=[currentRef('archive/assets/images/invented.svg')];},/UI_LOG_Q16_NO_FILE_ASSETS/],
 ['q5','GitHub SHA differs from actual head',p=>{p.checkout.githubEventCommit='2'.repeat(40);},/UI_LOG_Q5_EXECUTION/],
 ['q5','an invented top surface field',p=>{p.surface='PROBLEM';},/UI_LOG_Q5_NO_APPROVAL/],
 ['q5','parent approval',p=>{p.newParentApprovals=1;},/UI_LOG_Q5_NO_APPROVAL/],
 ['q5','nonpending visual label',p=>{p.releaseGate='ACCEPTED';},/UI_LOG_Q5_NO_APPROVAL/],
 ['q5','different result asset',p=>{p.results[0].assetRef.sha256='d'.repeat(64);},/UI_LOG_RESULT_ASSET/],
])test(profile+' refuses '+name,t=>{
 const f=fixture(t,profile);mutate(f.proof);f.write();assert.throws(()=>f.collect(),error);
});
test('M1 production provenance accepts only the exact ops push and preserves old PR identity',()=>{
 const f=protocol('m1'),push=M1.executionProvenance(HEAD,f.env,f.event);
 assert.equal(push.eventName,'push');assert.equal(push.capturedHead,HEAD);
 assert.equal(push.pullRequest,null);assert.equal(push.baseSha,null);
 const repo={full_name:REPO,fork:false},prEvent={number:2330,pull_request:{number:2330,head:{sha:HEAD,repo},base:{sha:'3'.repeat(40),repo}}};
 const pr=M1.executionProvenance(HEAD,{...f.env,GITHUB_EVENT_NAME:'pull_request',GITHUB_SHA:'2'.repeat(40)},prEvent);
 assert.equal(pr.eventName,'pull_request');assert.equal(pr.headSha,HEAD);assert.equal(pr.eventSha,'2'.repeat(40));
 assert.equal(pr.pullRequest,2330);assert.equal(Object.hasOwn(pr,'capturedHead'),false);
});
for(const [name,mutate] of [
 ['wrong environment branch',f=>{f.env.GITHUB_REF='refs/heads/main';}],
 ['wrong payload branch',f=>{f.event.ref='refs/heads/main';}],
 ['deleted push',f=>{f.event.deleted=true;}],
 ['fork',f=>{f.event.repository.fork=true;}],
 ['wrong repository',f=>{f.event.repository.full_name='example/other';}],
 ['different GitHub SHA',f=>{f.env.GITHUB_SHA='2'.repeat(40);}],
 ['different event after',f=>{f.event.after='3'.repeat(40);}],
 ['missing run',f=>{delete f.env.GITHUB_RUN_ID;}],
 ['unsafe attempt',f=>{f.env.GITHUB_RUN_ATTEMPT='9007199254740992';}],
 ['unsupported dispatch',f=>{f.env.GITHUB_EVENT_NAME='workflow_dispatch';}],
])test('M1 production provenance refuses '+name,()=>{
 const f=protocol('m1');mutate(f);assert.throws(()=>M1.executionProvenance(HEAD,f.env,f.event),/UI_/);
});


// Separate closed-eight transport profile. Synthetic protocol PNGs are not UI evidence.
const C8=require('../tools/check-m2s2-closed-eight-current-browser.cjs');
const closed8Fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-m2s2-closed-eight-current-ui.json'),'utf8'));
function closed8Protocol(){
 const spec=T.PROFILES.closed8;
 const env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:REPO,GITHUB_REF:T.CLOSED8_REF,
  GITHUB_SHA:HEAD,GITHUB_RUN_ID:'9003',GITHUB_RUN_ATTEMPT:'1',GITHUB_WORKFLOW:'M2 Closed Eight Current Renderer',
  GITHUB_JOB:'current-ui',ARCHIVE_M2S2_CLOSED8_UI_EXPECTED_SHA:HEAD};
 const event={ref:T.CLOSED8_REF,after:HEAD,deleted:false,repository:{full_name:REPO,fork:false}};
 const context=T.closed8ExecutionContext(HEAD,env,event),checkout=C8.checkoutEvidence(HEAD,env,event);
 const items=spec.subjects.map(s=>({key:s.key,questionUid:s.questionUid,sourceOrdinal:s.sourceOrdinal,
  sourceRef:{commit:HEAD,path:s.sourcePath,gitBlobSha1:s.sourceGitBlobSha1,sha256:s.sourceSha256,bytes:s.sourceBytes},
  assetRef:{commit:HEAD,path:s.assetPath,gitBlobSha1:s.assetGitBlobSha1,sha256:s.assetSha256,bytes:s.assetBytes}}));
 const results=items.flatMap(item=>T.VIEWPORTS.map(viewport=>{
  const count=viewport.name==='desktop'&&['E017-Q05','E017-Q23'].includes(item.key)?2:1;
  const screenshots=Array.from({length:count},(_,i)=>({tileIndex:i+1,
   path:item.key+'-'+viewport.name+'-tile-'+String(i+1).padStart(2,'0')+'.png',sha256:sha(png),bytes:png.length}));
  return{...clone(item),status:'PASS',viewport:{...viewport},screenshots,
   capture:{tileCount:count,tiles:screenshots.map(s=>({tileIndex:s.tileIndex,filename:s.path}))},
   technical:{mode:'exam',solutionNodes:0},pageErrors:[],requestFailures:[],externalRequests:[],visualReview:'PENDING'};
 }));
 const proof={schemaVersion:spec.schema,status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',checkoutCommit:HEAD,
  executionOwner:C8.EXECUTION_OWNER,execution:checkout.execution,
  checkout:{expectedCheckoutCommit:HEAD,actualCheckoutCommit:HEAD,githubEventCommit:HEAD},mode:'exam',
  screenshotsScope:'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY',problemOnlyScreenshots:true,
  sourceOverlay:false,sourceOverlayCount:0,sourceWrites:0,solutionsOpened:false,newFullMathematicalQa:false,
  newMetadataApprovals:0,newDifficultyJudgments:0,newReviewPassCount:0,newFourSlotApprovals:0,
  newParentApprovals:0,newNativeApprovals:0,releaseGate:'PENDING_INDEPENDENT_VISUAL_REVIEW',
  items,expectedLogicalCases:16,completedLogicalCases:16,results,
  screenshotArtifacts:results.flatMap(r=>r.screenshots.map(({tileIndex,...shot})=>shot)),
  screenshotArtifactCount:18,failures:[]};
 return{env,event,context,proof};
}
function closed8Files(t){
 const p=closed8Protocol(),directory=fs.mkdtempSync(path.join(os.tmpdir(),'closed8-ui-log-')),out=path.join(directory,'output');
 fs.mkdirSync(out);const write=()=>fs.writeFileSync(path.join(out,'technical-proof.json'),JSON.stringify(p.proof,null,2)+'\n');
 for(const s of p.proof.screenshotArtifacts)fs.writeFileSync(path.join(out,s.path),png);
 write();t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 return{...p,directory,out,write,collect:()=>T.collectBundle({out,profile:'closed8',context:p.context})};
}
test('closed eight profile matches the separately sealed capture fixture and its source/asset pins',()=>{
 assert.equal(C8.requireSealedManifest(clone(closed8Fixture)).expectedCases,16);
 assert.deepEqual(T.PROFILES.closed8.subjects.map(s=>({key:s.key,questionUid:s.questionUid,sourceOrdinal:s.sourceOrdinal,
  sourcePath:s.sourcePath,assetPath:s.assetPath})),closed8Fixture.items.map(s=>({key:s.key,questionUid:s.questionUid,
  sourceOrdinal:s.sourceOrdinal,sourcePath:s.sourcePath,assetPath:s.assetPath})));
 for(const s of T.PROFILES.closed8.subjects){
  const item=closed8Fixture.items.find(i=>i.questionUid===s.questionUid),binding=closed8Fixture.sourceBindings.find(b=>b.sourcePath===s.sourcePath);
  assert.equal(s.sourceGitBlobSha1,binding.gitBlobSha1);assert.equal(s.sourceSha256,binding.sha256);assert.equal(s.sourceBytes,binding.bytes);
  assert.equal(s.assetGitBlobSha1,item.assetGitBlobSha1);assert.equal(s.assetSha256,item.assetSha256);assert.equal(s.assetBytes,item.assetBytes);
 }
});
test('closed eight sixteen logical cases retain eighteen original protocol tiles and raw JSON without editing',t=>{
 const f=closed8Files(t),raw=fs.readFileSync(path.join(f.out,'technical-proof.json')),bundle=f.collect();
 assert.equal(bundle.manifest.logicalCases,16);assert.equal(bundle.manifest.pngFiles,18);
 assert.equal(bundle.manifest.newApprovals,0);assert.equal(bundle.manifest.execution.ref,T.CLOSED8_REF);
 assert.equal(bundle.manifest.execution.eventName,'push');assert(bundle.files[0].data.equals(raw));
 const frames=[...T.frames(bundle)].map(line=>JSON.parse(line));
 for(let i=0;i<bundle.files.length;i++){
  const chunks=frames.filter(x=>x.kind==='file-chunk'&&x.fileIndex===i);
  assert(chunks.every((x,j)=>x.chunkIndex===j&&x.chunks===chunks.length&&x.base64.length<=T.LIMITS.chunkCharacters));
  const recovered=Buffer.from(chunks.map(x=>x.base64).join(''),'base64');
  assert(recovered.equals(bundle.files[i].data));assert.equal(sha(recovered),bundle.files[i].sha256);
 }
 assert.equal(bundle.manifest.visualReview,'NOT_PERFORMED_BY_TRANSPORT');
});
test('closed eight partial capture transports its failure and does not invent sixteen successful cases',t=>{
 const f=closed8Files(t);f.proof.status='FAIL';f.proof.failureCode='UI_BROWSER_CHECK_FAILED';
 f.proof.results=f.proof.results.slice(0,2);f.proof.completedLogicalCases=2;f.write();
 const b=f.collect();assert.equal(b.manifest.captureStatus,'FAIL');assert.equal(b.manifest.logicalCases,2);
 assert.equal(b.manifest.pngFiles,18);assert.equal(b.manifest.uncompletedCasePngFiles,16);
});
test('closed eight and protected eighteen branch contexts cannot be interchanged',()=>{
 const c=closed8Protocol(),m=protocol('m1');
 assert.throws(()=>T.executionContext(HEAD,c.env,c.event),/UI_LOG_EXACT_REVIEW_PUSH/);
 assert.throws(()=>T.closed8ExecutionContext(HEAD,m.env,m.event),/UI_LOG_CLOSED8_EXACT_PUSH/);
 assert.throws(()=>T.validateProof(c.proof,'closed8',m.context),/UI_LOG_CLOSED8_CONTEXT/);
 assert.throws(()=>T.validateProof(m.proof,'m1',c.context),/UI_LOG_CLOSED_OPS_PROFILE/);
});
for(const [name,mutate,error] of [
 ['a foreign UID',p=>{p.items[0].questionUid='qid_v1_'+'f'.repeat(64);},/UI_LOG_ITEM_SCOPE/],
 ['a duplicate UID',p=>{p.items[1]=clone(p.items[0]);},/UI_LOG_ITEM_SCOPE/],
 ['a different source path',p=>{p.items[0].sourceRef.path='archive/exams/other.js';},/UI_LOG_ITEM_SOURCE/],
 ['the historical source Git',p=>{p.items[0].sourceRef.gitBlobSha1='f417b7e4e993ceb1a70c1b85de1e292a52d2b551';},/UI_LOG_CLOSED8_IMMUTABLE_INPUT_PINS/],
 ['a changed source raw hash',p=>{p.items[0].sourceRef.sha256='0'.repeat(64);},/UI_LOG_CLOSED8_IMMUTABLE_INPUT_PINS/],
 ['a changed source byte count',p=>{p.items[0].sourceRef.bytes++;},/UI_LOG_CLOSED8_IMMUTABLE_INPUT_PINS/],
 ['a different asset path',p=>{p.items[0].assetRef.path='archive/assets/images/other.svg';},/UI_LOG_ITEM_ASSET/],
 ['a changed asset Git',p=>{p.items[0].assetRef.gitBlobSha1='0'.repeat(40);},/UI_LOG_CLOSED8_IMMUTABLE_INPUT_PINS/],
 ['a changed asset raw hash',p=>{p.items[0].assetRef.sha256='0'.repeat(64);},/UI_LOG_CLOSED8_IMMUTABLE_INPUT_PINS/],
 ['a changed asset byte count',p=>{p.items[0].assetRef.bytes++;},/UI_LOG_CLOSED8_IMMUTABLE_INPUT_PINS/],
 ['a mixed result source',p=>{p.results[0].sourceRef.sha256='0'.repeat(64);},/UI_LOG_RESULT_SOURCE/],
 ['a mixed result asset',p=>{p.results[0].assetRef.sha256='0'.repeat(64);},/UI_LOG_RESULT_ASSET/],
 ['an old broad raw schema',p=>{p.schemaVersion='archive-m2-problem24-student-ui-preview-v1';},/UI_LOG_PROFILE_SCHEMA/],
 ['an old broad execution owner',p=>{p.executionOwner='GITHUB_ACTIONS_SUPPORTED_CHROME';},/UI_LOG_CLOSED8_EXECUTION/],
 ['a different captured head',p=>{p.execution.capturedHead='2'.repeat(40);},/UI_LOG_CLOSED8_EXECUTION/],
 ['a different run identity',p=>{p.execution.runId='9004';},/UI_LOG_CLOSED8_EXECUTION/],
 ['a different workflow',p=>{p.execution.workflow='other-workflow';},/UI_LOG_CLOSED8_EXECUTION/],
 ['a PR-shaped identity',p=>{p.execution.pullRequest=2330;},/UI_LOG_CLOSED8_EXECUTION/],
 ['another execution ref',p=>{p.execution.ref=T.REVIEW_REF;},/UI_LOG_CLOSED8_EXECUTION/],
 ['a changed actual checkout',p=>{p.checkout.actualCheckoutCommit='2'.repeat(40);},/UI_LOG_CLOSED8_CHECKOUT/],
 ['a source overlay',p=>{p.sourceOverlay=true;},/UI_LOG_PROBLEM_ONLY/],
 ['a solution node',p=>{p.results[0].technical.solutionNodes=1;},/UI_LOG_RESULT_PROBLEM_ONLY/],
 ['a new Native approval',p=>{p.newNativeApprovals=1;},/UI_LOG_CLOSED8_NO_APPROVAL/],
 ['a new parent approval',p=>{p.newParentApprovals=1;},/UI_LOG_CLOSED8_NO_APPROVAL/],
 ['a new four-slot approval',p=>{p.newFourSlotApprovals=1;},/UI_LOG_PROBLEM_ONLY/],
 ['a premature visual acceptance',p=>{p.releaseGate='ACCEPTED';},/UI_LOG_CLOSED8_NO_APPROVAL/],
 ['a changed viewport',p=>{p.results[0].viewport.width=1366;},/UI_LOG_RESULT_SCOPE/],
 ['a duplicate case',p=>{p.results[1]=clone(p.results[0]);},/UI_LOG_DUPLICATE_CASE/],
 ['a missing logical case',p=>{p.results.pop();p.completedLogicalCases--;},/UI_LOG_COMPLETE_CAPTURE/],
 ['a missing declared tile',p=>{p.screenshotArtifacts.pop();p.screenshotArtifactCount--;},/UI_SCREENSHOT_/]
])test('closed eight transport rejects '+name,t=>{
 const f=closed8Files(t);mutate(f.proof);f.write();assert.throws(()=>f.collect(),error);
});
test('closed eight keeps the existing eight-tile and ten-megabyte transport bounds',t=>{
 const f=closed8Files(t);assert.equal(T.LIMITS.bundleBytes,10*1024*1024);
 f.proof.screenshotArtifacts=Array.from({length:129},()=>clone(f.proof.screenshotArtifacts[0]));
 f.proof.screenshotArtifactCount=129;f.write();assert.throws(()=>f.collect(),/UI_LOG_ARTIFACT_COUNT/);
});
test('closed eight refuses changed PNG bytes rather than reframing a false hash',t=>{
 const f=closed8Files(t);fs.writeFileSync(path.join(f.out,f.proof.screenshotArtifacts[0].path),Buffer.from('changed'));
 assert.throws(()=>f.collect(),/UI_LOG_PNG_BYTES_MISMATCH/);
});
for(const [name,mutate] of [
 ['missing repository',f=>{delete f.event.repository;}],
 ['fork',f=>{f.event.repository.fork=true;}],
 ['another payload repository',f=>{f.event.repository.full_name='example/other';}],
 ['another branch',f=>{f.event.ref=T.REVIEW_REF;}],
 ['missing after',f=>{delete f.event.after;}],
 ['deleted push',f=>{f.event.deleted=true;}],
 ['different GitHub SHA',f=>{f.env.GITHUB_SHA='2'.repeat(40);}],
 ['unsafe attempt',f=>{f.env.GITHUB_RUN_ATTEMPT='9007199254740992';}],
 ['pull request event',f=>{f.env.GITHUB_EVENT_NAME='pull_request';}]
])test('closed eight transport context refuses '+name,()=>{
 const f=closed8Protocol();mutate(f);assert.throws(()=>T.closed8ExecutionContext(HEAD,f.env,f.event),/UI_LOG_CLOSED8_/);
});
