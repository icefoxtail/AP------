import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync,readFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {mergedPRs,selectProof} from '../archive/tools/archive-progress-collector.mjs';
import {reconcile,present} from '../archive/tools/archive-progress-core.mjs';
import {registeredGitProof,deployedSiteProof} from '../archive/tools/archive-progress-github-proof.mjs';
import {executeOnce} from '../archive/tools/archive-progress-observer.mjs';
import {proofFromBlobs} from '../archive/tools/archive-progress-content-proof.mjs';
const REPO='https://api.github.com/repos/icefoxtail/AP------';
const ID='25_샘플고_1학기_중간_고1_기출';
const A='a'.repeat(40),B='b'.repeat(40),C='c'.repeat(40),D='d'.repeat(40),E='e'.repeat(40);
const at=n=>'2026-10-11T00:'+String(n).padStart(2,'0')+':00Z';
const link=(type,id)=>'https://github.com/icefoxtail/AP------/'+type+'/'+id;
const pr=(number,head=A,merged=B,time=1)=>({number,headSha:head,mergeSha:merged,at:at(time),url:link('pull',number),exams:[ID]});
const rp=(sha=C,id=20,attempt=1)=>({schema:2,run_id:id,run_attempt:attempt,sourceSha:sha,...proofFromBlobs({['archive/exams/h/'+ID+'.js']:A,['archive/assets/images/'+ID+'/q1.png']:B}),actualDeployed:false,evidenceSource:'trusted-git-tree'});
const ancestor=async(a,b)=>[A,B,C,D,E].indexOf(a)<=[A,B,C,D,E].indexOf(b);
const mockPulls=(count)=>async route=>{
 if(route.startsWith('/pulls?')){
  const p=Number(new URLSearchParams(route.split('?')[1]).get('page'));
  return Array.from({length:count},(_,i)=>({number:i+1,merged_at:at(1),merge_commit_sha:B,head:{sha:A},changed_files:i===64?101:1,html_url:link('pull',i+1)})).slice((p-1)*100,p*100);
 }
 if(route.startsWith('/pulls/')&&route.includes('/files?')){
  const n=Number(route.match(/\/pulls\/(\d+)/)[1]),page=Number(new URLSearchParams(route.split('?')[1]).get('page'));
  if(n===65)return page===1?Array.from({length:100},(_,i)=>({filename:'notes/file'+i})):page===2?[{filename:'archive/exams/h/'+ID+'.js'}]:[];
  return page===1?[{filename:'archive/exams/h/'+ID+'.js'}]:[];
 }
 throw Error('unknown route '+route);
};
test('actual collector reads >100 closed PRs, does not slice at merged #50, and inventories >100 files',async()=>{
 const result=await mergedPRs(mockPulls(115),2);
 assert.equal(result.prs.length,115);
 assert.equal(result.prs.find(x=>x.number===65).exams[0],ID);
 assert.equal(result.completePulls,true);
});
test('bounded >100 closed PR scan preserves verified statuses and carries a separate history boundary',async()=>{
 const fake=mockPulls(115);const earlier={entries:{[ID]:{main:{result:'완료',sha:B,run:link('pull',1),at:at(1)},
  check:{result:'통과',sha:A,run:link('actions/runs',10),at:at(2)}}},updatedAt:at(7)};
 const api=async route=>{
  if(route.startsWith('/pulls?')||route.startsWith('/pulls/'))return fake(route);
  if(route.includes('/runs?'))return {workflow_runs:[]};
  if(route.startsWith('/contents/'))return {encoding:'base64',content:Buffer.from(JSON.stringify(earlier)).toString('base64'),sha:D};
  if(route.startsWith('/compare/'))return {status:'ahead'};
  throw Error('unknown '+route);
 };
 const state=await executeOnce({api,historyPages:1,getEvidence:async()=>{throw Error('not called');},clock:()=>at(8),storeStatus:async()=>{}});
 assert.equal(state.history.complete,false);
 assert.equal(state.inventoryComplete,true);
 assert.equal(state.entries[ID].main.result,'완료');
 assert.equal(state.entries[ID].check.result,'통과');
});
test('latest relevant registration failure wins over previous registered success, preserves last deploy',async()=>{
 const first={entries:{[ID]:{main:{result:'완료',sha:B,run:link('pull',1),at:at(1)},registration:{result:'완료',sha:C,run:link('actions/runs',20),at:at(3),attempt:1},
  lastSuccessfulRelease:{result:'완료',sha:D,run:link('actions/runs',30),at:at(4)}}}};
 const r={id:21,attempt:1,inputSha:B,sha:B,conclusion:'failure',at:at(5),url:link('actions/runs',21)};
 const state=await reconcile(first,{prs:[],checks:[],registrations:[r],releases:[],now:at(6)},ancestor);
 assert.equal(state.entries[ID].registration.result,'실패');assert.equal(state.entries[ID].lastSuccessfulRelease.sha,D);
});
test('unrelated registration failure never invalidates other exams',async()=>{
 const initial={entries:{[ID]:{main:{result:'완료',sha:B,run:link('pull',1),at:at(1)},registration:{result:'완료',sha:C,run:link('actions/runs',20),at:at(3)}}}};
 const r={id:21,attempt:1,inputSha:C,sha:C,conclusion:'failure',at:at(5),url:link('actions/runs',21)};
 const s=await reconcile(initial,{prs:[],checks:[],registrations:[r],releases:[],now:at(6)},ancestor);
 assert.equal(s.entries[ID].registration.result,'완료');
});
function clientWithLog(log,mode='push'){
 const tree=[{path:'archive/exams/h/'+ID+'.js',type:'blob',sha:A},{path:'archive/assets/images/'+ID+'/q1.png',type:'blob',sha:B}];
 const api=async route=>{
  if(route.endsWith('/jobs?per_page=100'))return {jobs:[{id:55,name:'sync',conclusion:'success'}]};
  if(route.startsWith('/commits/'))return {sha:mode==='nochange'?D:C,commit:{message:mode==='nochange'?'other main commit':'chore(archive): sync registration artifacts [skip ci]'}};
  if(route.startsWith('/compare/'))return {status:'ahead'};
  if(route.startsWith('/git/commits/'))return {tree:{sha:E}};
  if(route.startsWith('/git/trees/'))return {truncated:false,tree};
  throw Error('bad API '+route);
 };
 const fetchImpl=async(url,opts)=>{
  if(url===REPO+'/actions/jobs/55/logs')return new Response(null,{status:302,headers:{Location:'https://safe.example/log'}});
  if(url==='https://safe.example/log')return new Response(log);
  throw Error('bad fetch '+url);
 };
 return {origin:REPO,headers:{Authorization:'Bearer mock'},api,fetchImpl};
}
const run=(id=20,attempt=2)=>({id,attempt,sha:B,at:at(4)});
test('registeredGitProof requires actual successful push, discards earlier failed local commit',async()=>{
 const log='2026-10-11T00:01:00Z [main ccccccc] chore(archive): sync registration artifacts [skip ci]\n'+
 'error: failed to push refs\nRegistration publish race; rebuilding latest main\n'+
 '2026-10-11T00:02:00Z [main ccccccc] chore(archive): sync registration artifacts [skip ci]\n'+
 '2026-10-11T00:03:00Z    bbbbbbb..ccccccc HEAD -> main\n';
 const r=await registeredGitProof(run(),clientWithLog(log));
 assert.equal(r.sourceSha,C);assert.equal(r.run_attempt,2);assert.ok(r.registry);
 const unpushed=await registeredGitProof(run(),clientWithLog('[main ccccccc] chore(archive): sync registration artifacts [skip ci]\nerror: failed to push'));
 assert.equal(unpushed,null);
});
test('registeredGitProof no-change after retry uses remote reset SHA, never abandoned commit',async()=>{
 const log='[main ccccccc] chore(archive): sync registration artifacts [skip ci]\nerror: failed to push\n'+
 'Registration publish race; rebuilding latest main (attempt 2/4)\nHEAD is now at ddddddd Existing update\nLatest main already has the generated registration.\n';
 const proven=await registeredGitProof(run(),clientWithLog(log,'nochange'));
 assert.equal(proven.sourceSha,D);
 const ambiguous=await registeredGitProof(run(),clientWithLog('[main ccccccc] chore(archive): sync registration artifacts [skip ci]\nLatest main already has the generated registration.','nochange'));
 assert.equal(ambiguous,null);
});
test('latest registered run attempt without witness becomes specifically unknown, previous successful deploy survives',async()=>{
 const prior={entries:{[ID]:{main:{result:'완료',sha:B,run:link('pull',1),at:at(1)},registration:{result:'완료',sha:C,run:link('actions/runs',20),at:at(3),attempt:1},lastSuccessfulRelease:{result:'완료',sha:D,run:link('actions/runs',30),at:at(4)}}}};
 const missing={id:20,attempt:2,inputSha:B,sha:B,conclusion:'success',at:at(5),url:link('actions/runs',20)};
 const state=await reconcile(prior,{registrations:[missing],now:at(6)},ancestor);
 assert.equal(state.entries[ID].registration.result,'미확인');
 assert.equal(state.entries[ID].registration.reason,'현재 실행 차수 증거 없음');
 assert.equal(state.entries[ID].lastSuccessfulRelease.sha,D);
 assert.equal(selectProof([{name:'archive-progress-20-1',expired:false},{name:'archive-progress-20-2',expired:true}],missing),null);
});
function zipFixtures({mutateSource=false,mutateAsset=false,mutateRegistry=false,contextAttempt=2,expired=false,artifactAttempt=2,downloadFailure=false}={}){
 const tmp=mkdtempSync(path.join(os.tmpdir(),'real-pages-proof-'));
 const python=String.raw`import io,os,tarfile,zipfile,sys
root=sys.argv[1]; exam=sys.argv[2]; src=sys.argv[3]; asset=sys.argv[4]; reg=sys.argv[5]; attempt=sys.argv[6]
with zipfile.ZipFile(os.path.join(root,'diagnostics.zip'),'w') as z:
 z.writestr('context.txt',f'source_sha={"d"*40}\nrun_id=44\nrun_attempt={attempt}\n')
blob=io.BytesIO()
with tarfile.open(fileobj=blob,mode='w') as t:
 for name,data in [(f'archive/exams/h/{exam}.js',src.encode()),(f'archive/assets/images/{exam}/q1.png',asset.encode()),('archive/db.js',reg.encode())]:
  info=tarfile.TarInfo(name);info.size=len(data);t.addfile(info,io.BytesIO(data))
with zipfile.ZipFile(os.path.join(root,'site.zip'),'w') as z:z.writestr('artifact.tar',blob.getvalue())`;
 const args=[tmp,ID,mutateSource?'source-CHANGED':'source',mutateAsset?'asset-CHANGED':'asset',mutateRegistry?'reg-CHANGED':'reg',String(contextAttempt)];
 // Use direct generated fixture; no network, no extraction or execution of downloaded data.
 execFileSync('python3',['-c',python,...args]);
 const names={diagnostics:'archive-pages-release-evidence-44-'+artifactAttempt,site:'github-pages'};
 const art=[{id:90,name:names.diagnostics,expired,size_in_bytes:readFileSync(path.join(tmp,'diagnostics.zip')).length,created_at:at(3)},
  {id:91,name:names.site,expired,size_in_bytes:readFileSync(path.join(tmp,'site.zip')).length,created_at:at(4)}];
 const client={origin:REPO,headers:{Authorization:'Bearer fake'},api:async route=>{
  if(route.includes('/artifacts?'))return {artifacts:art};
  if(route.includes('/attempts/2/jobs?'))return {jobs:[{name:'Deploy the verified student release',conclusion:'success',steps:[{name:'Deploy Pages artifact',conclusion:'success'}]}]};
  if(route.includes('/attempts/2'))return {run_started_at:at(2),updated_at:at(5)};
  throw Error('unexpected API '+route);
 },fetchImpl:async(uri,opts)=>{
  const match=uri.match(/\/artifacts\/(90|91)\/zip$/);
  if(match)return new Response(null,{status:302,headers:{Location:'https://safe.example/'+match[1]}});
  if(uri==='https://safe.example/90')return new Response(readFileSync(path.join(tmp,'diagnostics.zip')));
  if(uri==='https://safe.example/91')return downloadFailure?new Response('failed',{status:503}):new Response(readFileSync(path.join(tmp,'site.zip')));
  throw Error('unexpected fetch '+uri);
 }};
 return {tmp,client,run:{id:44,attempt:2,sha:D,at:at(5)}};
}
test('deployedSiteProof reads actual nested Pages ZIP bytes, detects source/asset/registry mismatches',async()=>{
 const cases=[{}, {mutateSource:true},{mutateAsset:true},{mutateRegistry:true}];
 const proofs=[];
 for(const config of cases){const x=zipFixtures(config);try{proofs.push((await deployedSiteProof(x.run,x.client)).proof);}finally{rmSync(x.tmp,{recursive:true,force:true});}}
 assert.ok(proofs.every(Boolean));
 assert.equal(proofs[0].actualDeployed,true);
 assert.equal(proofs[0].evidenceSource,'uploaded-pages-artifact');
 for(const p of proofs.slice(1))assert.notDeepEqual(p.exams[ID]?.source+p.exams[ID]?.assets+p.registry,proofs[0].exams[ID].source+proofs[0].exams[ID].assets+proofs[0].registry);
 assert.equal(proofs[1].registry,proofs[0].registry);
 assert.notEqual(proofs[2].exams[ID].assets,proofs[0].exams[ID].assets);
 assert.notEqual(proofs[3].registry,proofs[0].registry);
});
test('deployedSiteProof rejects wrong run attempt and expired diagnostics',async()=>{
 for(const x of [zipFixtures({contextAttempt:1}),zipFixtures({expired:true}),zipFixtures({artifactAttempt:1})]){
  try{assert.notEqual((await deployedSiteProof(x.run,x.client))?.status,'verified');}finally{rmSync(x.tmp,{recursive:true,force:true});}
 }
});
test('proof query/download and status storage failures in observer path do not block independent producers',async()=>{
 const x=zipFixtures({expired:true});
 try{
  assert.notEqual((await deployedSiteProof(x.run,x.client))?.status,'verified');
  let evidenceCalls=0;
  const api=async route=>{
   if(route.startsWith('/pulls?'))return [];
   if(route.includes('/runs?')){
    const reg=route.includes('archive-registration');
    return {workflow_runs:[{id:reg?20:30,run_attempt:2,event:'push',conclusion:'success',
     head_sha:B,updated_at:at(5),html_url:link('actions/runs',reg?20:30),head_branch:'main'}]};
   }
   if(route.startsWith('/contents/'))return null;
   throw Error('unexpected '+route);
  };
  let gate;const waiting=new Promise(resolve=>{gate=resolve;});let signal;
  const entered=new Promise(resolve=>{signal=resolve;});
  const status=executeOnce({api,getEvidence:async()=>{evidenceCalls++;throw Error('evidence query unavailable');},
   storeStatus:async()=>{signal();await waiting;throw Error('status branch failed');}});
  await entered;
  const tmp=mkdtempSync(path.join(os.tmpdir(),'independent-producer-'));
  try{
   // These commands execute while the actual observer's storage promise is stuck.
   const out=execFileSync('bash',['-c','printf REGISTERED; printf DEPLOYED'],{cwd:tmp,encoding:'utf8',timeout:2000});
   assert.equal(out,'REGISTEREDDEPLOYED');
  }finally{rmSync(tmp,{recursive:true,force:true});}
  assert.equal(evidenceCalls,2);
  gate();await assert.rejects(status,/status branch failed/);
 }finally{rmSync(x.tmp,{recursive:true,force:true});}
});
test('real ZIP witness mismatch is rejected by actual reconciler instead of accepted as deployed',async()=>{
 const site=zipFixtures(),changed=zipFixtures({mutateAsset:true});
 try{
  const good=(await deployedSiteProof(site.run,site.client)).proof;
  const bad=(await deployedSiteProof(changed.run,changed.client)).proof;
  const input={prs:[pr(1,A,B,1)],checks:[],registrations:[{id:20,attempt:2,inputSha:B,sha:B,registeredSha:C,
   proof:{...good,actualDeployed:false,evidenceSource:'trusted-git-tree',sourceSha:C,run_id:20,run_attempt:2},
   conclusion:'success',at:at(3),url:link('actions/runs',20)}],
   releases:[{...site.run,conclusion:'success',proof:good,url:link('actions/runs',44)}],now:at(7)};
  const pass=await reconcile(null,input,ancestor);
  assert.equal(pass.entries[ID].deployment.result,'완료');
  const fail=await reconcile(null,{...input,releases:[{...site.run,conclusion:'success',proof:bad,url:link('actions/runs',44)}]},ancestor);
  assert.equal(fail.entries[ID].deployment.result,'불일치');
  assert.equal(present(fail.entries[ID].lastSuccessfulRelease),'미확인');
 }finally{rmSync(site.tmp,{recursive:true,force:true});rmSync(changed.tmp,{recursive:true,force:true});}
});
test('successful old proof is not fetched repeatedly when no new observer events have arrived',async()=>{
 const previous={schema:1,updatedAt:at(7),entries:{[ID]:{exam:ID,
  main:{result:'완료',sha:B,run:link('pull',1),at:at(1)},
  registration:{result:'완료',sha:C,run:link('actions/runs',20),at:at(3),attempt:2},
  deployment:{result:'완료',sha:D,run:link('actions/runs',30),at:at(4),attempt:2},
  lastSuccessfulRelease:{result:'완료',sha:D,run:link('actions/runs',30),at:at(4),attempt:2}}},
 observations:{['registration:20:2:'+B]:{key:'registration:20:2:'+B,status:'verified',attempts:1,verifiedAt:at(6),run:{id:20,attempt:2,sha:B,at:at(3),url:link('actions/runs',20),conclusion:'success',event:'push',branch:'main'},proof:rp(C,20,2)},
 ['release:30:2:'+D]:{key:'release:30:2:'+D,status:'verified',attempts:1,verifiedAt:at(6),run:{id:30,attempt:2,sha:D,at:at(4),url:link('actions/runs',30),conclusion:'success',event:'push',branch:'main'},proof:{...rp(D,30,2),actualDeployed:true,deploymentJobVerified:true,evidenceSource:'uploaded-pages-artifact'}}}};
 let downloads=0;
 const fake=async route=>{
  if(route.startsWith('/pulls?'))return [];
  if(route.includes('/runs?'))return {workflow_runs:[{
   id:route.includes('archive-registration')?20:30,run_attempt:2,event:'push',conclusion:'success',
   head_sha:route.includes('archive-registration')?B:D,updated_at:at(route.includes('archive-registration')?3:4),
   html_url:link('actions/runs',route.includes('archive-registration')?20:30),head_branch:'main'}]};
  if(route.startsWith('/contents/'))return {encoding:'base64',content:Buffer.from(JSON.stringify(previous)).toString('base64'),sha:A};
  if(route.startsWith('/compare/'))return {status:'ahead'};
  throw Error('unexpected '+route);
 };
 const next=await executeOnce({api:fake,getEvidence:async()=>{downloads++;return null;},
  clock:()=>at(8),storeStatus:async()=>{}});
 assert.equal(downloads,0);
 assert.equal(next.entries[ID].registration.result,'완료');
 assert.equal(next.entries[ID].lastSuccessfulRelease.sha,D);
});
test('incomplete PR file list does not hide unrelated confirmed successes',async()=>{
 const prev={entries:{[ID]:{exam:ID,main:{result:'완료',sha:B,run:link('pull',1),at:at(1)},
  check:{result:'통과',sha:A,run:link('actions/runs',10),at:at(2)}}}};
 const s=await reconcile(prev,{prs:[],incompletePRs:[999],completePulls:false,now:at(7)},ancestor);
 assert.equal(s.entries[ID].main.result,'완료');assert.equal(s.entries[ID].check.result,'통과');
 assert.equal(s.inventoryComplete,false);assert.deepEqual(s.incompletePRs,[999]);
});

test('actual deployedSiteProof download failure is unknown rather than passed',async()=>{
 const x=zipFixtures({downloadFailure:true});
 try{const result=await deployedSiteProof(x.run,x.client);assert.equal(result.status,'verified');
  assert.equal(result.proof.deploymentJobVerified,true);assert.equal(result.proof.actualDeployed,false);
  assert.equal(result.proof.fileProofReason,'Pages ZIP 다운로드 실패');}
 finally{rmSync(x.tmp,{recursive:true,force:true});}
});
