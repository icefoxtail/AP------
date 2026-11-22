'use strict';
// Synthetic transport protocol tests. These do not run Chrome or accept images.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const T=require('../tools/emit-protected9-ui-log-transport.cjs');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),clone=x=>JSON.parse(JSON.stringify(x));
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1sAAAAASUVORK5CYII=','base64');
const HEAD='1'.repeat(40),REPO='icefoxtail/AP------';
function protocol(){
 const env={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:REPO,GITHUB_EVENT_NAME:'pull_request',GITHUB_SHA:'2'.repeat(40),
  GITHUB_RUN_ID:'9001',GITHUB_RUN_ATTEMPT:'1',GITHUB_WORKFLOW:'Synthetic transport fixture',GITHUB_JOB:'svg7'};
 const repo={full_name:REPO,fork:false},event={number:2330,pull_request:{head:{sha:HEAD,repo},base:{sha:'3'.repeat(40),repo}}};
 const context=T.executionContext(HEAD,env,event);
 const results=T.PROFILES.svg7.subjects.flatMap(item=>T.VIEWPORTS.map(viewport=>{
  const filename=item.key+'-'+viewport.name+'-tile-01.png';
  return{...item,status:'PASS',surface:'PROBLEM',mode:'exam',viewport:{...viewport},
   screenshots:[{tileIndex:1,path:filename,sha256:sha(png),bytes:png.length}],
   capture:{tileCount:1,tiles:[{tileIndex:1,filename}]},
   technical:{mode:'exam',solutionNodes:0},pageErrors:[],requestFailures:[],externalRequests:[],visualReview:'PENDING'};
 }));
 const proof={schemaVersion:T.PROFILES.svg7.schema,status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',
  checkoutCommit:HEAD,executionOwner:'GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD',
  execution:{provider:context.provider,repository:REPO,eventName:context.eventName,headSha:HEAD,eventSha:context.eventCommit,
   runId:context.runId,runAttempt:context.runAttempt,job:context.job,workflow:context.workflow,pullRequest:2330,baseSha:context.baseSha},
  mode:'exam',problemOnlyScreenshots:true,solutionsOpened:false,sourceOverlay:false,sourceWrites:0,
  newFullMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReviewPassCount:0,newFourSlotApprovals:0,
  items:clone(T.PROFILES.svg7.subjects),expectedLogicalCases:14,completedLogicalCases:14,results,
  screenshotArtifacts:results.flatMap(r=>r.screenshots.map(({tileIndex,...s})=>s)),screenshotArtifactCount:14,failures:[]};
 return{env,event,context,proof};
}
function fixture(t){
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ui-log-transport-')),out=path.join(directory,'output');
 fs.mkdirSync(out);const p=protocol();
 const write=()=>fs.writeFileSync(path.join(out,'technical-proof.json'),JSON.stringify(p.proof,null,2)+'\n');
 for(const shot of p.proof.screenshotArtifacts)fs.writeFileSync(path.join(out,shot.path),png);
 write();t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 return{...p,directory,out,write,collect(){return T.collectBundle({out,profile:'svg7',context:p.context});}};
}
test('raw JSON and all fourteen original PNG fixtures round-trip through bounded frames',t=>{
 const f=fixture(t),bundle=f.collect(),frames=[...T.frames(bundle)].map(line=>JSON.parse(line));
 assert.equal(bundle.manifest.logicalCases,14);assert.equal(bundle.manifest.pngFiles,14);assert.equal(bundle.manifest.newApprovals,0);
 assert.equal(frames[0].kind,'bundle-begin');assert.equal(frames.at(-1).kind,'bundle-end');
 for(let i=0;i<bundle.files.length;i++){
  const chunks=frames.filter(x=>x.kind==='file-chunk'&&x.fileIndex===i);
  assert(chunks.every((x,index)=>x.chunkIndex===index&&x.chunks===chunks.length&&x.base64.length<=T.LIMITS.chunkCharacters));
  const decoded=Buffer.from(chunks.map(x=>x.base64).join(''),'base64');
  assert(decoded.equals(bundle.files[i].data));assert.equal(sha(decoded),bundle.files[i].sha256);
 }
 assert.equal(bundle.manifest.visualReview,'NOT_PERFORMED_BY_TRANSPORT');
});
test('partial capture failure remains failure and uncompleted tiles are labelled',t=>{
 const f=fixture(t);f.proof.status='FAIL';f.proof.failureCode='UI_BROWSER_CHECK_FAILED';
 f.proof.results=f.proof.results.slice(0,3);f.proof.completedLogicalCases=3;f.write();
 const bundle=f.collect();assert.equal(bundle.manifest.captureStatus,'FAIL');assert.equal(bundle.manifest.logicalCases,3);
 assert.equal(bundle.manifest.uncompletedCasePngFiles,11);assert.equal(bundle.manifest.newApprovals,0);
 assert.equal(JSON.parse([...T.frames(bundle)].at(-1)).captureStatus,'FAIL');
});
for(const[name,change]of[
 ['unknown selected UID',p=>p.items[0].questionUid='qid_v1_'+'f'.repeat(64)],
 ['duplicate logical case',p=>p.results[1]=clone(p.results[0])],
 ['forged run identity',p=>p.execution.runId='9002'],
 ['forged checkout',p=>p.checkoutCommit='4'.repeat(40)],
 ['solution surface',p=>p.results[0].technical.solutionNodes=1],
 ['opened solutions',p=>p.solutionsOpened=true],
 ['approval effect',p=>p.newMetadataApprovals=1],
 ['unknown filename',p=>p.screenshotArtifacts[0].path='../../private.png'],
 ['oversized declared PNG',p=>p.screenshotArtifacts[0].bytes=T.LIMITS.pngBytes+1],
 ['false complete count',p=>p.completedLogicalCases=13]
])test('transport refuses '+name,t=>{
 const f=fixture(t);change(f.proof);f.write();assert.throws(()=>f.collect(),/UI_LOG_|UI_SCREENSHOT_/);
});
test('an undeclared output file is never framed',t=>{
 const f=fixture(t);fs.writeFileSync(path.join(f.out,'extra.png'),png);assert.throws(()=>f.collect(),/UI_LOG_UNDECLARED_OUTPUT_FILE/);
});
test('same-byte PNG symlink is refused',t=>{
 const f=fixture(t),name=f.proof.screenshotArtifacts[0].path,external=path.join(f.directory,'outside.png');
 fs.writeFileSync(external,png);fs.unlinkSync(path.join(f.out,name));fs.symlinkSync(external,path.join(f.out,name));
 assert.throws(()=>f.collect(),/UI_LOG_FILE_SYMLINK_OR_TYPE/);
});
test('output parent symlink is refused',t=>{
 const f=fixture(t),link=path.join(f.directory,'link');fs.symlinkSync(f.out,link);
 assert.throws(()=>T.collectBundle({out:link,profile:'svg7',context:f.context}),/UI_LOG_DIRECTORY_SYMLINK_OR_TYPE/);
});
test('modified PNG bytes fail even if a valid PNG header remains',t=>{
 const f=fixture(t);fs.appendFileSync(path.join(f.out,f.proof.screenshotArtifacts[0].path),'x');
 assert.throws(()=>f.collect(),/UI_LOG_PNG_BYTES_MISMATCH/);
});
test('a forged digest does not turn a non-PNG into an image',t=>{
 const f=fixture(t),bad=Buffer.from('not-a-png'.repeat(10)),name=f.proof.screenshotArtifacts[0].path;
 fs.writeFileSync(path.join(f.out,name),bad);
 for(const s of [f.proof.screenshotArtifacts[0],f.proof.results[0].screenshots[0]]){s.sha256=sha(bad);s.bytes=bad.length;}
 f.write();assert.throws(()=>f.collect(),/UI_LOG_PNG_HEADER/);
});
test('undeclared capture profiles are closed',t=>{
 const f=fixture(t);assert.throws(()=>T.collectBundle({out:f.out,profile:'not-a-profile',context:f.context}),/UI_LOG_PROFILE_SCHEMA/);
});
test('exact ops push binds all three SHA identities and its real event',()=>{
 const f=protocol();f.env.GITHUB_EVENT_NAME='push';f.env.GITHUB_REF=T.REVIEW_REF;f.env.GITHUB_SHA=HEAD;
 const event={ref:T.REVIEW_REF,after:HEAD,deleted:false,repository:{full_name:REPO,fork:false}};
 assert.equal(T.executionContext(HEAD,f.env,event).eventName,'push');
 for(const patch of [{ref:'refs/heads/main'},{after:'5'.repeat(40)},{deleted:true},{repository:{full_name:REPO,fork:true}}])
  assert.throws(()=>T.executionContext(HEAD,f.env,{...event,...patch}),/UI_LOG_/);
 assert.throws(()=>T.executionContext(HEAD,{...f.env,GITHUB_SHA:'6'.repeat(40)},event),/UI_LOG_PUSH_AFTER_SHA/);
});
test('producer and transport refs must be current regular tracked bytes',t=>{
 const f=fixture(t),root=path.join(f.directory,'repo');fs.mkdirSync(root);
 const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 git('init','--quiet');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
 const files=[T.PROFILES.svg7.checkerPath,T.PROFILES.svg7.manifestPath,'tools/check-reviewed-problem-renderer-browser.cjs','tools/emit-protected9-ui-log-transport.cjs'];
 for(const relative of files){const full=path.join(root,relative);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,'synthetic protocol fixture\n');}
 git('add','--all');git('commit','--quiet','-m','synthetic tracked transport inputs');const head=git('rev-parse','HEAD');
 const ref=relative=>{const bytes=fs.readFileSync(path.join(root,relative));return{commit:head,path:relative,
  gitBlobSha1:git('rev-parse',head+':'+relative),sha256:sha(bytes),bytes:bytes.length};};
 const bundle=f.collect();bundle.context.checkoutCommit=head;
 bundle.proof.checkerRef=ref(files[0]);bundle.proof.manifestRef=ref(files[1]);bundle.proof.captureHelperRef=ref(files[2]);
 assert.equal(T.assertProducerRefs(root,bundle).manifest.transportRef.commit,head);
 fs.appendFileSync(path.join(root,files[0]),'changed');
 assert.throws(()=>T.assertProducerRefs(root,bundle),/UI_LOG_CURRENT_CHECKOUT_DRIFT/);
});
