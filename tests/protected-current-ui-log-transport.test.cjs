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
