import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {executeOnce} from '../archive/tools/archive-progress-observer.mjs';
import {deployedSiteProof} from '../archive/tools/archive-progress-github-proof.mjs';
import {reconcile} from '../archive/tools/archive-progress-core.mjs';
import {runKey,observeRun,MAX_RETRIES} from '../archive/tools/archive-progress-retry.mjs';
import {proofFromBlobs} from '../archive/tools/archive-progress-content-proof.mjs';
const id='25_샘플고_1학기_중간_고1_기출';
const sha=(c)=>c.repeat(40);
const A=sha('a'),B=sha('b'),C=sha('c'),D=sha('d'),E=sha('e'),F=sha('f');
const at=(n)=>new Date(Date.UTC(2026,9,11,0,n,0)).toISOString();
const link=(kind,n)=>`https://github.com/icefoxtail/AP------/${kind}/${n}`;
const p=(source,runId,attempt,site=false,asset='b',registry='f')=>({schema:2,run_id:runId,run_attempt:attempt,sourceSha:source,
 registry:registry.repeat(64),exams:{[id]:{source:A,assets:asset.repeat(64)}},actualDeployed:site,
 ...(site?{deploymentJobVerified:true}:{}),evidenceSource:site?'uploaded-pages-artifact':'trusted-git-tree'});
function environment(){
 let last=null,stored={entries:{}},prArr=[{number:1,merged_at:at(1),merge_commit_sha:B,head:{sha:A},changed_files:1,html_url:link('pull',1)}];
 let regs=[],releases=[];
 const api=async route=>{
  if(route.startsWith('/contents/'))return stored&&Object.keys(stored.entries||{}).length||stored?.observations?{sha:C,encoding:'base64',content:Buffer.from(JSON.stringify(stored)).toString('base64')}:null;
  if(route.startsWith('/pulls?'))return prArr;
  if(route.startsWith('/pulls/1/files'))return [{filename:'archive/exams/high/'+id+'.js'}];
  if(route.includes('/archive-registration-sync.yml/runs?'))return {workflow_runs:regs};
  if(route.includes('/archive-pages-release.yml/runs?'))return {workflow_runs:releases};
  if(route.startsWith('/compare/'))return {status:'ahead'};
  throw Error('Unhandled API '+route);
 };
 const run=(n,source,minute,attempt=1,conclusion='success')=>({id:n,run_attempt:attempt,event:'push',conclusion,head_sha:source,
  updated_at:at(minute),html_url:link('actions/runs',n),head_branch:'main'});
 return {api,run,putReg:(r)=>regs=[r,...regs],putRelease:(r)=>releases=[r,...releases],
  get state(){return stored;},set state(v){stored=v;},
  save:async next=>{last=next;stored=next;},get last(){return last;},setPR:(x)=>prArr=x};
}
test('executeOnce auto recovers same run after transient failure and old updatedAt boundary',async()=>{
 const e=environment();e.putReg(e.run(20,B,3));let n=0;
 const source=async()=>{n++;return n===1?null:p(C,20,1);};
 const first=await executeOnce({api:e.api,getEvidence:source,storeStatus:e.save,clock:()=>at(5)});
 assert.equal(first.entries[id].registration.result,'미확인');assert.equal(n,1);
 // Same completed run timestamp, retry after delay; old updatedAt is newer than run.
 const second=await executeOnce({api:e.api,getEvidence:source,storeStatus:e.save,clock:()=>at(11)});
 assert.equal(second.entries[id].registration.result,'완료');assert.equal(second.entries[id].registration.sha,C);
 assert.equal(n,2);assert.equal(second.observations[runKey('registration',{id:20,attempt:1,sha:B})].status,'verified');
});
test('executeOnce manual retry can recover unknown without waiting, never re-fetches verified',async()=>{
 const e=environment();e.putReg(e.run(20,B,3));let count=0;
 const getEvidence=async()=>++count===1?{status:'transient',reason:'증거 조회 실패'}:p(C,20,1);
 await executeOnce({api:e.api,getEvidence,storeStatus:e.save,clock:()=>at(5)});
 const recovered=await executeOnce({api:e.api,getEvidence,storeStatus:e.save,clock:()=>at(6),manualRetry:true});
 assert.equal(recovered.entries[id].registration.result,'완료');
 await executeOnce({api:e.api,getEvidence:async()=>{throw Error('must not redownload verified proof');},storeStatus:e.save,clock:()=>at(7)});
 assert.equal(e.state.entries[id].registration.result,'완료');assert.equal(count,2);
});
test('verified evidence remains after temporary unrelated API evidence failure and fresh run ends midflight',async()=>{
 const e=environment();e.putReg(e.run(20,B,3));
 await executeOnce({api:e.api,getEvidence:async()=>p(C,20,1),storeStatus:e.save,clock:()=>at(8)});
 let called=0;
 await executeOnce({api:e.api,getEvidence:async()=>{called++;throw Error('transient');},storeStatus:async state=>{
   e.state=state;e.putRelease(e.run(30,D,6));},clock:()=>at(9)});
 assert.equal(called,0); // verified record cached
 const next=await executeOnce({api:e.api,getEvidence:async(r,kind)=>kind==='release'?p(D,30,1,true):p(C,20,1),storeStatus:e.save,clock:()=>at(10)});
 assert.equal(next.entries[id].deploymentJob.result,'완료');
 assert.equal(next.entries[id].deployment.result,'완료');
});
test('reconcile newest mismatched release is current mismatch while last successful remains',async()=>{
 const registration={id:20,attempt:1,sha:B,inputSha:B,registeredSha:C,proof:p(C,20,1),conclusion:'success',at:at(3),url:link('actions/runs',20)};
 const release=(n,sha,minute,asset='b')=>({id:n,attempt:1,sha,proof:p(sha,n,1,true,asset),conclusion:'success',at:at(minute),url:link('actions/runs',n)});
 const prs=[{number:1,exams:[id],headSha:A,mergeSha:B,at:at(1),url:link('pull',1)}];
 const old=await reconcile(null,{prs,registrations:[registration],releases:[release(30,D,4)],now:at(5)},async()=>true);
 assert.equal(old.entries[id].deployment.result,'완료');
 const next=await reconcile(old,{prs,registrations:[registration],releases:[release(31,E,7,'a')],now:at(8)},async()=>true);
 assert.equal(next.entries[id].deployment.result,'불일치');
 assert.equal(next.entries[id].deploymentJob.result,'완료');
 assert.equal(next.entries[id].lastSuccessfulRelease.sha,D);
});
test('new attempt or SHA cannot borrow earlier run proof even at identical timestamp',async()=>{
 const old=await observeRun({kind:'registration',run:{id:20,attempt:1,sha:B},clock:()=>at(2),examIds:[id],getEvidence:async()=>p(C,20,1)});
 assert.equal(old.record.status,'verified');
 let calls=0;
 for(const run of [{id:20,attempt:2,sha:B},{id:20,attempt:1,sha:D}]){
  assert.notEqual(runKey('registration',run),old.key);
  const current=await observeRun({kind:'registration',run,old:old.record,clock:()=>at(2),examIds:[id],getEvidence:async()=>{calls++;return null;}});
  assert.equal(current.record.status,'unverified');assert.equal(current.proof,null);
 }
 assert.equal(calls,2);
});
test('retry bound, clock backoff, permanent oversized artifact never repeats',async()=>{
 const run={id:44,attempt:2,sha:D,at:at(3),url:link('actions/runs',44),conclusion:'success',event:'push',branch:'main'};let attempts=0,record;
 for(let i=0;i<MAX_RETRIES;i++){
  const now=new Date(Date.UTC(2026,9,11,0,5+5*(2**i-1))).toISOString();
  const next=await observeRun({kind:'release',run,old:record,clock:()=>now,getEvidence:async()=>{attempts++;return {status:'transient',reason:'증거 조회 실패'};}});
  record=next.record;
  const skipped=await observeRun({kind:'release',run,old:record,clock:()=>now,getEvidence:async()=>{throw Error('too early');}});
  assert.equal(skipped.record.attempts,attempts);
 }
 assert.equal(attempts,MAX_RETRIES);
 const skipped=await observeRun({kind:'release',run,old:record,clock:()=>at(55),manual:true,getEvidence:async()=>{throw Error('retry cap');}});
 assert.equal(skipped.record.attempts,MAX_RETRIES);
 const permanent=await observeRun({kind:'release',run:{id:45,attempt:1,sha:E,at:at(3),url:link('actions/runs',45),conclusion:'success',event:'push',branch:'main'},clock:()=>at(3),getEvidence:async()=>({status:'permanent',reason:'Pages ZIP 크기 초과'})});
 const replay=await observeRun({kind:'release',run:{id:45,attempt:1,sha:E,at:at(3),url:link('actions/runs',45),conclusion:'success',event:'push',branch:'main'},old:permanent.record,clock:()=>at(30),manual:true,getEvidence:async()=>{throw Error('not allowed');}});
 assert.equal(replay.record.status,'permanent');assert.equal(replay.record.attempts,1);
});
test('executeOnce large Pages proof marks verified deploy job but file match unknown, caches result',async()=>{
 const e=environment();e.putReg(e.run(20,B,3));e.putRelease(e.run(30,D,4));let calls=0;
 const getEvidence=async(r,kind)=>{calls++;return kind==='registration'?p(C,20,1):
  {status:'verified',proof:{schema:2,run_id:30,run_attempt:1,sourceSha:D,deploymentJobVerified:true,
   actualDeployed:false,evidenceSource:'diagnostics-and-deploy-job',fileProofReason:'Pages ZIP 크기 초과',exams:{}}};};
 const result=await executeOnce({api:e.api,getEvidence,storeStatus:e.save,clock:()=>at(5)});
 assert.equal(result.entries[id].deploymentJob.result,'완료');
 assert.equal(result.entries[id].deployment.result,'미확인');
 assert.equal(result.entries[id].deployment.reason,'Pages ZIP 크기 초과');
 await executeOnce({api:e.api,getEvidence:async()=>{throw Error('must cache oversized');},storeStatus:e.save,clock:()=>at(10)});
 assert.equal(calls,2);
});

test('deployedSiteProof calls actual diagnostics and deploy jobs, never fetches 2.18GB Pages ZIP',async()=>{
 const tmp=mkdtempSync(path.join(os.tmpdir(),'progress-diag-'));
 try{
  const diagnostic=path.join(tmp,'diag.zip');
  execFileSync('python3',['-c',`import zipfile,sys\nwith zipfile.ZipFile(sys.argv[1],'w') as z:z.writestr('context.txt','source_sha=${D}\\nrun_id=30\\nrun_attempt=1\\n')`,diagnostic]);
  const run={id:30,attempt:1,sha:D,at:at(6)};const requests=[];
  const client={origin:'https://api.github.com/repos/icefoxtail/AP------',headers:{Authorization:'Bearer test'},
   api:async route=>{
    requests.push(route);
    if(route.endsWith('/artifacts?per_page=100'))return {artifacts:[
     {id:80,name:'archive-pages-release-evidence-30-1',expired:false,size_in_bytes:readFileSync(diagnostic).length},
     {id:81,name:'github-pages',expired:false,size_in_bytes:2183453819,created_at:at(4)}]};
    if(route.endsWith('/attempts/1/jobs?per_page=100'))return {jobs:[{name:'Deploy the verified student release',conclusion:'success',steps:[{name:'Deploy Pages artifact',conclusion:'success'}]}]};
    if(route.endsWith('/attempts/1'))return {run_started_at:at(2),updated_at:at(6)};
    throw Error('unexpected '+route);
   },fetchImpl:async(url)=>{
    requests.push(url);
    if(url.endsWith('/artifacts/80/zip'))return new Response(null,{status:302,headers:{Location:'https://safe.example/80'}});
    if(url==='https://safe.example/80')return new Response(readFileSync(diagnostic));
    throw Error('Pages ZIP must never download: '+url);
   }};
  const got=await deployedSiteProof(run,client);
  assert.equal(got.status,'verified');assert.equal(got.proof.deploymentJobVerified,true);
  assert.equal(got.proof.fileProofReason,'Pages ZIP 크기 초과');assert.equal(got.proof.actualDeployed,false);
  assert.ok(!requests.some(s=>/artifacts\/81\/zip/.test(s)));
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
