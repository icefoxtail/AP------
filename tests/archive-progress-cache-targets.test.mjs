import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import {executeOnce,collectEvidence} from '../archive/tools/archive-progress-observer.mjs';
import {proofFromBlobs} from '../archive/tools/archive-progress-content-proof.mjs';
import {runKey} from '../archive/tools/archive-progress-retry.mjs';
const ID='25_샘플고_1학기_중간_고1_기출',LATE='25_뒤늦게발견고_1학기_중간_고1_기출';
const A='a'.repeat(40),B='b'.repeat(40),C='c'.repeat(40),D='d'.repeat(40),E='e'.repeat(40);
const at=m=>new Date(Date.UTC(2026,9,11,0,m)).toISOString();
const link=(k,id)=>`https://github.com/icefoxtail/AP------/${k}/${id}`;
const blob=s=>createHash('sha1').update(`blob ${Buffer.byteLength(s)}\0`).update(s).digest('hex');
const entries={['archive/exams/high/'+ID+'.js']:'source-old',
 ['archive/assets/images/'+ID+'/q1.png']:'asset-old',
 ['archive/exams/high/'+LATE+'.js']:'source-new',
 ['archive/assets/images/'+LATE+'/q1.png']:'asset-new','archive/db.js':'registry'};
const blobs=Object.fromEntries(Object.entries(entries).map(([k,v])=>[k,blob(v)]));
const expected=proofFromBlobs(blobs);
const makeZip=()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'observer-targeted-'));
 const py=String.raw`import io,tarfile,zipfile,sys,json,os
folder=sys.argv[1]; items=json.loads(sys.argv[2]);sha=sys.argv[3]
with zipfile.ZipFile(os.path.join(folder,'diag.zip'),'w') as z:
 z.writestr('context.txt',f'run_id=44\nrun_attempt=2\nsource_sha={sha}\n')
tar=io.BytesIO()
with tarfile.open(fileobj=tar,mode='w') as t:
 for name,data in items.items():
  b=data.encode();info=tarfile.TarInfo(name);info.size=len(b);t.addfile(info,io.BytesIO(b))
with zipfile.ZipFile(os.path.join(folder,'site.zip'),'w') as z:z.writestr('artifact.tar',tar.getvalue())`;
 execFileSync('python3',['-c',py,dir,JSON.stringify(entries),D]);
 return dir;
};
function fixture({mode='fail',latePR=false}={}){
 const dir=makeZip(),called={diagnostic:0,site:0,jobs:0,tree:0};
 let currentMode=mode,discovered=latePR,treeDown=false,stored={entries:{}};
 const reg={id:20,run_attempt:1,event:'push',conclusion:'success',head_sha:B,updated_at:at(3),html_url:link('actions/runs',20),head_branch:'main'};
 const release={id:44,run_attempt:2,event:'push',conclusion:'success',head_sha:D,updated_at:at(5),html_url:link('actions/runs',44),head_branch:'main'};
 const api=async route=>{
  if(route.startsWith('/contents/'))return {sha:A,encoding:'base64',content:Buffer.from(JSON.stringify(stored)).toString('base64')};
  if(route.startsWith('/pulls?'))return [
   {number:1,merged_at:at(1),merge_commit_sha:B,head:{sha:A},changed_files:1,html_url:link('pull',1)},
   {number:2,merged_at:at(1),merge_commit_sha:B,head:{sha:A},changed_files:1,html_url:link('pull',2)}];
  if(route.includes('/pulls/1/files'))return [{filename:'archive/exams/high/'+ID+'.js'}];
  if(route.includes('/pulls/2/files'))return discovered?[{filename:'archive/exams/high/'+LATE+'.js'}]:[];
  if(route.includes('/archive-registration-sync.yml/runs?'))return {workflow_runs:[reg]};
  if(route.includes('/archive-pages-release.yml/runs?'))return {workflow_runs:[release]};
  if(route.startsWith('/compare/'))return {status:'ahead'};
  throw Error('unexpected observer API '+route);
 };
 const client={origin:'https://api.github.com/repos/icefoxtail/AP------',headers:{Authorization:'Bearer fake'},
  api:async route=>{
   if(route.includes('/artifacts?'))return {artifacts:[
    {id:90,name:'archive-pages-release-evidence-44-2',size_in_bytes:readFileSync(path.join(dir,'diag.zip')).length,expired:false,created_at:at(3)},
    {id:91,name:'github-pages',size_in_bytes:currentMode==='oversize'?2183453819:readFileSync(path.join(dir,'site.zip')).length,
     expired:currentMode==='expired',created_at:at(4)}].filter(a=>currentMode!=='missing'||a.id!==91)};
   if(route.endsWith('/attempts/2/jobs?per_page=100')){called.jobs++;return {jobs:[{name:'Deploy the verified student release',conclusion:'success',steps:[{name:'Deploy Pages artifact',conclusion:'success'}]}]};}
   if(route.endsWith('/attempts/2'))return {run_started_at:at(2),updated_at:at(5)};
   if(route.startsWith('/compare/'))return {status:'ahead'};
   if(route.startsWith('/git/commits/'))return {tree:{sha:A}};
   if(route.startsWith('/git/trees/')){called.tree++;if(treeDown)throw Error('transient git tree');return {truncated:false,tree:Object.entries(blobs).map(([p,sha])=>({type:'blob',path:p,sha}))};}
   throw Error('unexpected evidence API '+route);
  },fetchImpl:async url=>{
   if(url.endsWith('/artifacts/90/zip'))return new Response(null,{status:302,headers:{Location:'https://safe.example/90'}});
   if(url.endsWith('/artifacts/91/zip')){called.site++;return new Response(null,{status:302,headers:{Location:'https://safe.example/91'}});}
   if(url==='https://safe.example/90'){called.diagnostic++;return new Response(readFileSync(path.join(dir,'diag.zip')));}
   if(url==='https://safe.example/91'){
    if(currentMode==='fetchException')throw Error('ECONNREFUSED');
    if(currentMode==='streamInterrupted'){
     const bytes=readFileSync(path.join(dir,'site.zip'));
     const interrupted=new ReadableStream({start(controller){controller.enqueue(bytes.subarray(0,12));controller.error(Error('stream aborted'));}});
     return new Response(interrupted);
    }
    return currentMode==='fail'?new Response('unavailable',{status:503}):new Response(readFileSync(path.join(dir,'site.zip')));
   }
   throw Error('unexpected evidence download '+url);
  }};
 const evidence=async(run,kind,prior)=>kind==='release'||prior?collectEvidence(run,kind,prior,client):
  {schema:2,run_id:20,run_attempt:1,sourceSha:C,...expected,evidenceSource:'trusted-git-tree'};
 const next=async(minute,manualRetry=false)=>executeOnce({api,storeStatus:async current=>{stored=current;},
  getEvidence:evidence,clock:()=>at(minute),manualRetry});
 return {next,called,get state(){return stored;},setMode:v=>currentMode=v,discover:()=>{discovered=true;},setTreeDown:v=>{treeDown=v;},cleanup:()=>rmSync(dir,{recursive:true,force:true})};
}
for(const manualRetry of [false,true])test(`executeOnce + deployedSiteProof partial Pages recovery (${manualRetry?'manual':'automatic'})`,async()=>{
 const f=fixture();try{
  const first=await f.next(6);const key=runKey('release',{id:44,attempt:2,sha:D});
  assert.equal(first.entries[ID].deploymentJob.result,'완료');
  assert.equal(first.entries[ID].deployment.result,'미확인');
  assert.equal(first.observations[key].status,'partial');
  assert.equal(first.observations[key].fileProofState,'retryable');
  assert.equal(f.called.diagnostic,1);assert.equal(f.called.site,1);assert.equal(f.called.jobs,1);
  f.setMode('pass');
  if(!manualRetry){await f.next(7);assert.equal(f.called.site,1);}
  const done=await f.next(manualRetry?7:12,manualRetry);
  assert.equal(done.entries[ID].deploymentJob.result,'완료');
  assert.equal(done.entries[ID].deployment.result,'완료');
  assert.equal(done.observations[key].status,'verified');
  assert.equal(done.entries[ID].lastSuccessfulRelease.sha,D);
  assert.equal(f.called.diagnostic,1);assert.equal(f.called.jobs,1);
  assert.equal(f.called.site,2);
  await f.next(20);assert.equal(f.called.site,2);
 }finally{f.cleanup();}
});
for(const mode of ['oversize','expired'])test(`executeOnce does not retry ${mode} Pages artifact`,async()=>{
 const f=fixture({mode});try{
  const first=await f.next(6);
  assert.equal(first.entries[ID].deploymentJob.result,'완료');
  assert.equal(first.entries[ID].deployment.result,'미확인');
  assert.equal(first.observations[runKey('release',{id:44,attempt:2,sha:D})].fileProofState,'permanent');
  assert.equal(f.called.site,0);
  await f.next(20,true);assert.equal(f.called.site,0);assert.equal(f.called.diagnostic,1);
 }finally{f.cleanup();}
});
test('executeOnce transient missing Pages artifact is re-discovered, not sealed',async()=>{
 const f=fixture({mode:'missing'});try{
  const first=await f.next(6);assert.equal(first.entries[ID].deploymentJob.result,'완료');
  assert.equal(first.entries[ID].deployment.reason,'배포 파일 산출물 미식별');
  f.setMode('pass');const result=await f.next(12);
  assert.equal(result.entries[ID].deployment.result,'완료');
  assert.equal(f.called.diagnostic,1);assert.equal(f.called.jobs,1);assert.equal(f.called.site,1);
 }finally{f.cleanup();}
});
test('incomplete PR inventory then late exam adds only missing evidence to same validated runs',async()=>{
 const f=fixture({mode:'pass'});try{
  const first=await f.next(6);
  assert.equal(first.inventoryComplete,false);
  assert.equal(first.entries[LATE],undefined);
  assert.equal(first.entries[ID].deployment.result,'완료');
  assert.equal(f.called.diagnostic,1);assert.equal(f.called.site,1);
  f.discover();const next=await f.next(7);
  assert.equal(next.inventoryComplete,true);
  assert.equal(next.entries[ID].deployment.result,'완료');
  assert.equal(next.entries[LATE].registration.result,'완료');
  assert.equal(next.entries[LATE].deploymentJob.result,'완료');
  assert.equal(next.entries[LATE].deployment.result,'완료');
  assert.equal(next.observations[runKey('release',{id:44,attempt:2,sha:D})].proof.exams[LATE].source,blobs['archive/exams/high/'+LATE+'.js']);
  assert.equal(f.called.diagnostic,1);assert.equal(f.called.jobs,1);
  assert.equal(f.called.tree,1); // registration backfill: Git tree only, no job logs or ZIP
  assert.equal(f.called.site,2); // once for first known exam, once because second wasn't cached
  await f.next(12);
  assert.equal(f.called.site,2);assert.equal(f.called.tree,1);
 }finally{f.cleanup();}
});
test('legacy job-only verified cache reclassifies partial without losing authenticated job',async()=>{
 const f=fixture({mode:'fail'});try{
  const first=await f.next(6);const key=runKey('release',{id:44,attempt:2,sha:D});
  const secondSource=JSON.parse(JSON.stringify(first));
  secondSource.observations[key].status='verified';delete secondSource.observations[key].fileProofState;
  // Store is under the fixture API's old JSON; migrate through same executeOnce path.
  // Rather than resetting source state, test the sanitized migration directly.
  const {sanitizeObservation}=await import('../archive/tools/archive-progress-retry.mjs');
  const migrated=sanitizeObservation(key,secondSource.observations[key],[ID]);
  assert.equal(migrated.status,'partial');assert.equal(migrated.proof.deploymentJobVerified,true);
 }finally{f.cleanup();}
});

test('temporary late-exam backfill failure retains previously verified exams until retry',async()=>{
 const f=fixture({mode:'pass'});try{
  const first=await f.next(6);f.discover();f.setTreeDown(true);
  const middle=await f.next(7);
  assert.equal(middle.entries[ID].registration.result,'완료');
  assert.equal(middle.entries[ID].deployment.result,'완료');
  assert.equal(middle.entries[LATE].registration.result,'미확인');
  assert.equal(middle.observations[runKey('registration',{id:20,attempt:1,sha:B})].status,'partial');
  f.setTreeDown(false);
  const last=await f.next(13);
  assert.equal(last.entries[LATE].registration.result,'완료');
  assert.equal(last.entries[LATE].deployment.result,'완료');
  assert.equal(last.entries[ID].registration.result,'완료');
  assert.equal(f.called.diagnostic,1);assert.equal(f.called.site,2);
 }finally{f.cleanup();}
});
test('partial release proof never leaks into changed run attempt or source SHA',async()=>{
 const {observeRun}=await import('../archive/tools/archive-progress-retry.mjs');
 const base={id:44,attempt:2,sha:D,at:at(5),url:link('actions/runs',44),conclusion:'success',event:'push',branch:'main'};
 const partial={schema:2,run_id:44,run_attempt:2,sourceSha:D,actualDeployed:false,
  deploymentJobVerified:true,evidenceSource:'diagnostics-and-deploy-job',fileProofReason:'Pages ZIP 다운로드 실패',exams:{}};
 const before=await observeRun({kind:'release',run:base,clock:()=>at(6),examIds:[ID],getEvidence:async()=>({status:'verified',proof:partial})});
 assert.equal(before.record.status,'partial');
 for(const next of [{...base,attempt:3},{...base,sha:E}]){
  const after=await observeRun({kind:'release',run:next,old:before.record,clock:()=>at(7),
   examIds:[ID],getEvidence:async()=>null});
  assert.equal(after.proof,null);assert.equal(after.record.status,'unverified');
 }
});

for(const mode of ['fetchException','streamInterrupted'])test(`executeOnce preserves successful deploy job when initial Pages ${mode} throws`,async()=>{
 const f=fixture({mode});try{
  const key=runKey('release',{id:44,attempt:2,sha:D});
  const first=await f.next(6);
  assert.equal(first.entries[ID].deploymentJob.result,'완료');
  assert.equal(first.entries[ID].deployment.result,'미확인');
  assert.equal(first.observations[key].status,'partial');
  assert.equal(first.observations[key].proof.deploymentJobVerified,true);
  assert.equal(first.observations[key].proof.fileProofReason,'Pages ZIP 다운로드 실패');
  assert.equal(f.called.jobs,1);assert.equal(f.called.diagnostic,1);
  await f.next(7);assert.equal(f.called.site,1); // interval respected
  f.setMode('pass');const second=await f.next(12);
  assert.equal(second.observations[key].status,'verified');
  assert.equal(second.entries[ID].deploymentJob.result,'완료');
  assert.equal(second.entries[ID].deployment.result,'완료');
  assert.equal(f.called.jobs,1);assert.equal(f.called.diagnostic,1);
  assert.equal(f.called.site,2);
 }finally{f.cleanup();}
});

test('exceptions retain the existing four-try ceiling and keep verified job witness',async()=>{
 const f=fixture({mode:'streamInterrupted'});try{
  for(const minute of [6,12,23,44]){
   const state=await f.next(minute);
   assert.equal(state.entries[ID].deploymentJob.result,'완료');
   assert.equal(state.entries[ID].deployment.result,'미확인');
  }
  const key=runKey('release',{id:44,attempt:2,sha:D});
  assert.equal(f.state.observations[key].attempts,4);
  assert.equal(f.state.observations[key].retryExhausted,true);
  f.setMode('pass');await f.next(60,true);
  assert.equal(f.called.site,4);assert.equal(f.called.diagnostic,1);assert.equal(f.called.jobs,1);
 }finally{f.cleanup();}
});

function oldRunBackfillFixture({negative=false}={}){
 const runs=Array.from({length:11},(_,i)=>({id:100+i,attempt:1,sha:B,at:at(20+i),
  url:link('actions/runs',100+i),conclusion:'success',event:'push',branch:'main'}));
 const prior={entries:{[ID]:{exam:ID,main:{result:'완료',sha:B,run:link('pull',1),at:at(1)},
  lastSuccessfulRelease:{result:'완료',sha:D,run:link('actions/runs',44),at:at(5),stage:'파일 일치'}}},
  observations:Object.fromEntries(runs.map(run=>[runKey('registration',run),{
   key:runKey('registration',run),status:'verified',attempts:1,verifiedAt:at(40),run,
   proof:{schema:2,run_id:run.id,run_attempt:run.attempt,sourceSha:C,
    registry:expected.registry,exams:{},evidenceSource:'trusted-git-tree'}}]))};
 let stored=prior,trees=0;
 const api=async route=>{
  if(route.startsWith('/contents/'))return {sha:A,encoding:'base64',content:Buffer.from(JSON.stringify(stored)).toString('base64')};
  if(route.startsWith('/pulls?'))return []; // PR is outside recent window
  if(route.includes('/runs?'))return {workflow_runs:[]}; // historical runs are outside recent 24
  if(route.startsWith('/compare/'))return {status:'ahead'};
  throw Error('unexpected observer API '+route);
 };
 const client={api:async route=>{
  if(route.startsWith('/compare/'))return {status:'ahead'};
  if(route.startsWith('/git/commits/'))return {tree:{sha:A}};
  if(route.startsWith('/git/trees/')){
   trees++;
   const rows=Object.entries(blobs).filter(([filename])=>!negative||!filename.includes('/'+ID));
   return {truncated:false,tree:rows.map(([filename,sha])=>({type:'blob',path:filename,sha}))};
  }
  throw Error('unexpected tree API '+route);
 }};
 const next=async(minute)=>executeOnce({api,clock:()=>at(minute),
  getEvidence:(run,kind,cached,missing)=>collectEvidence(run,kind,cached,client),
  storeStatus:async state=>{stored=state;}});
 return {next,get count(){return trees;}};
}
for(const negative of [false,true])test(`existing exam with no run-level coverage resumes 11 old runs in batches of eight (${negative?'confirmed absent':'found'})`,async()=>{
 const f=oldRunBackfillFixture({negative});
 const first=await f.next(50);
 const processed=state=>Object.values(state.observations).filter(o=>o.checkedExamIds?.includes(ID)).length;
 assert.equal(processed(first),8);assert.equal(f.count,8);
 assert.equal(first.entries[ID].lastSuccessfulRelease.sha,D);
 const second=await f.next(51);
 assert.equal(processed(second),11);assert.equal(f.count,11);
 for(const o of Object.values(second.observations)){
  assert.equal(o.status,'verified');assert.ok(o.checkedExamIds.includes(ID));
  assert.equal(Boolean(o.proof.exams[ID]),!negative);
 }
 await f.next(52);assert.equal(f.count,11); // cached positive and confirmed negative
});
