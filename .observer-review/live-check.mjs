import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {githubClient,executeOnce,collectEvidence} from '../archive/tools/archive-progress-observer.mjs';
const checkout=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const expected=process.env.GITHUB_SHA;
console.log('OBSERVER_CHECKOUT_SHA='+checkout);
if(!/^[0-9a-f]{40}$/.test(expected||'')||checkout!==expected)
 throw Error('PINNED_SHA_MISMATCH: checkout='+checkout+' expected='+expected);
const branch='review/archive-progress-state-live-20261011';
const client=githubClient(), api=client.api;
const oldBranch=await api('/git/ref/heads/'+branch,{allow404:true});
if(!oldBranch){
 const main=await api('/git/ref/heads/main');
 await api('/git/refs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ref:'refs/heads/'+branch,sha:main.object.sha})});
}
const routedApi=(route,opts)=>api(route==='/contents/archive-progress.json?ref=archive-progress-state'
 ? '/contents/archive-progress.json?ref='+branch:route,opts);
const save=async(value,priorSha)=>{
 const result=await api('/contents/archive-progress.json',{method:'PUT',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({branch,message:'test(observer): GitHub live evidence only',content:Buffer.from(JSON.stringify(value,null,2)+'\n').toString('base64'),...(priorSha?{sha:priorSha}:{})})});
 console.log('TEST_STATE_COMMIT_SHA='+result.commit.sha);
};
const read=async()=>{
 const file=await api('/contents/archive-progress.json?ref='+branch);
 return {blobSha:file.sha,data:JSON.parse(Buffer.from(file.content,'base64').toString('utf8'))};
};
const run=async()=>executeOnce({api:routedApi,historyPages:1,clock:()=>new Date().toISOString(),
 getEvidence:(item,kind,cached)=>collectEvidence(item,kind,cached,client),storeStatus:save});
const first=await run();
const remoteFirst=await read();
if(!remoteFirst.data.entries||remoteFirst.data.schema!==1)throw Error('REMOTE_SAVE_INVALID');
console.log('FIRST_ENTRY_COUNT='+Object.keys(remoteFirst.data.entries).length);
const keysBefore=Object.keys(remoteFirst.data.observations||{}).sort();
const second=await run();
const remoteSecond=await read();
const keysAfter=Object.keys(remoteSecond.data.observations||{}).sort();
for(const key of keysBefore){
 if(!keysAfter.includes(key))throw Error('EVIDENCE_KEY_LOST:'+key);
 const before=remoteFirst.data.observations[key],after=remoteSecond.data.observations[key];
 if(before.status==='verified'&&after.status!=='verified')throw Error('VERIFIED_RESULT_LOST:'+key);
}
const releaseKey='release:38109580827:1:8ded9dbdacab31b37f60778b7577640156a3fefa';
const release=remoteSecond.data.observations?.[releaseKey]||null;
console.log('B15_RELEASE_OBSERVATION='+JSON.stringify(release&&{status:release.status,reason:release.reason,sourceSha:release.run?.sha,
 jobVerified:release.proof?.deploymentJobVerified,fileProofReason:release.proof?.fileProofReason,fileState:release.fileProofState}));
if(!release)throw Error('B15_RELEASE_NOT_DISCOVERED: read-only workflow scan did not include B15');
if(release.proof?.deploymentJobVerified!==true)throw Error('B15_DEPLOY_JOB_NOT_VERIFIED');
if(release.proof?.actualDeployed===true)throw Error('B15_FILE_PARITY_WRONGLY_VERIFIED');
if(!/Pages ZIP 크기 초과|Pages ZIP 만료/.test(release.proof?.fileProofReason||''))
 console.log('B15_FILE_EVIDENCE_REASON='+String(release.proof?.fileProofReason||'미확인'));
const saved={...remoteSecond.data,checkoutSha:checkout,testStateBranch:branch,testStateBlobSha:remoteSecond.blobSha};
fs.writeFileSync('observer-live-status.json',JSON.stringify(saved,null,2)+'\n');
fs.writeFileSync('observer-live-report.json',JSON.stringify({checkout,firstCount:Object.keys(first.entries).length,
 secondCount:Object.keys(second.entries).length,observationCount:keysAfter.length,
 preservedEvidenceCount:keysBefore.length,b15:release},null,2)+'\n');
console.log('LIVE_OBSERVER_PASS: pinned_sha, remote_write_readback, second_collection, retained_proof, B15_deploy_success_partial_file');
