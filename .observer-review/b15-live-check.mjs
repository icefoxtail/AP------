import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {githubClient,executeOnce,collectEvidence} from '../archive/tools/archive-progress-observer.mjs';
const checkout=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
console.log('OBSERVER_CHECKOUT_SHA='+checkout);
if(checkout!==process.env.OBSERVER_EXPECTED_SHA)throw Error('PINNED_SHA_MISMATCH');
const testBranch='review/archive-progress-state-b15-live-20261011';
const client=githubClient(),raw=client.api;
const ref=await raw('/git/ref/heads/'+testBranch,{allow404:true});
if(!ref){
 const main=await raw('/git/ref/heads/main');
 await raw('/git/refs',{method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({ref:'refs/heads/'+testBranch,sha:main.object.sha})});
}
const scopedApi=async(route,opts={})=>{
 if(route==='/contents/archive-progress.json?ref=archive-progress-state')
  return raw('/contents/archive-progress.json?ref='+testBranch,opts);
 if(route.startsWith('/pulls?state=closed')){
  const list=await raw(route,opts);
  return list.filter(p=>p.number===389);
 }
 if(route.startsWith('/actions/workflows/archive-registration-sync.yml/runs?')){
  const result=await raw(route,opts);
  return {...result,workflow_runs:(result.workflow_runs||[]).filter(r=>r.id===38109291851)};
 }
 if(route.startsWith('/actions/workflows/archive-pages-release.yml/runs?')){
  const result=await raw(route,opts);
  return {...result,workflow_runs:(result.workflow_runs||[]).filter(r=>r.id===38109580827)};
 }
 return raw(route,opts);
};
const storeStatus=async(data,priorSha)=>{
 const r=await raw('/contents/archive-progress.json',{method:'PUT',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({branch:testBranch,message:'test(observer): B15 actual GitHub evidence only',
   content:Buffer.from(JSON.stringify(data,null,2)+'\n').toString('base64'),
   ...(priorSha?{sha:priorSha}:{})})});
 console.log('TEST_STATE_COMMIT_SHA='+r.commit.sha);
};
const read=async()=>{
 const file=await raw('/contents/archive-progress.json?ref='+testBranch);
 return {sha:file.sha,json:JSON.parse(Buffer.from(file.content,'base64').toString('utf8'))};
};
const once=()=>executeOnce({api:scopedApi,getEvidence:(run,kind,cached)=>collectEvidence(run,kind,cached,client),
 historyPages:1,clock:()=>new Date().toISOString(),storeStatus});
const first=await once(),remote1=await read();
const second=await once(),remote2=await read();
const key='release:38109580827:1:8ded9dbdacab31b37f60778b7577640156a3fefa';
const record=remote2.json.observations?.[key];
if(!record)throw Error('B15_RELEASE_NOT_OBSERVED');
if(record.proof?.deploymentJobVerified!==true)throw Error('B15_DEPLOY_JOB_SUCCESS_NOT_AUTHENTICATED');
if(record.proof?.actualDeployed===true)throw Error('B15_LARGE_PAGES_FILE_WRONGLY_VERIFIED');
if(record.proof?.fileProofReason!=='Pages ZIP 크기 초과')throw Error('B15_FILE_REASON_UNEXPECTED:'+record.proof?.fileProofReason);
const e=remote2.json.entries?.['19_복성고_1학기_중간_고1_기출'];
if(!e)throw Error('B15_EXAM_MISSING_FROM_ACTUAL_PR');
if(e.deploymentJob?.result!=='완료'||e.deployment?.result!=='미확인')
 throw Error('B15_SCREEN_STATUS_INCORRECT:'+JSON.stringify({job:e.deploymentJob,file:e.deployment}));
for(const [k,v] of Object.entries(remote1.json.observations||{})){
 const newer=remote2.json.observations?.[k];
 if(!newer)throw Error('EVIDENCE_LOST:'+k);
 if(v.status==='verified'&&newer.status!=='verified')throw Error('VERIFIED_LOST:'+k);
}
console.log('B15_ACTUAL_READBACK='+JSON.stringify({job:e.deploymentJob,file:e.deployment,registration:e.registration,main:e.main}));
console.log('TEST_STATE_BLOB_SHA='+remote2.sha);
fs.writeFileSync('observer-live-status.json',JSON.stringify(remote2.json,null,2)+'\n');
fs.writeFileSync('observer-live-report.json',JSON.stringify({observerCheckoutSha:checkout,stateBranch:testBranch,
 firstCount:Object.keys(first.entries).length,secondCount:Object.keys(second.entries).length,
 firstObservationCount:Object.keys(remote1.json.observations||{}).length,
 secondObservationCount:Object.keys(remote2.json.observations||{}).length,b15:record,entry:e},null,2)+'\n');
console.log('LIVE_B15_PASS: exact checkout, real API evidence, remote write + readback, repeat no loss, job success + file unknown');
