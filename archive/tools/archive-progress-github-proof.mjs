import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Readable,Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {createWriteStream} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {proofFromBlobs} from './archive-progress-content-proof.mjs';
import {validSha} from './archive-progress-core.mjs';
const script=fileURLToPath(new URL('../../.github/scripts/archive-progress-site-snapshot.py',import.meta.url));
const limit=256*1024*1024;
async function getSigned(client,url){
 const response=await client.fetchImpl(url,{headers:client.headers,redirect:'manual'});
 if(![301,302,303,307,308].includes(response.status))return null;
 const location=response.headers.get('location');
 if(!location||!location.startsWith('https://')||new URL(location).hostname==='api.github.com')return null;
 return location;
}
async function download(client,artifact,pathToFile){
 if(!artifact||!Number.isFinite(artifact.size_in_bytes)||artifact.size_in_bytes>limit)return false;
 const location=await getSigned(client,client.origin+'/actions/artifacts/'+artifact.id+'/zip');
 if(!location)return false;
 const response=await client.fetchImpl(location); // No authentication headers forwarded
 if(!response.ok||!response.body)return false;
 let size=0;
 const guard=new Transform({transform(buf,_encoding,callback){size+=buf.length;callback(size>limit?Error('Artifact size limit'):null,buf);}});
 await pipeline(Readable.fromWeb(response.body),guard,createWriteStream(pathToFile));
 return true;
}
const withTemp=async fn=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'archive-progress-proof-'));
 try{return await fn(temp);}finally{fs.rmSync(temp,{recursive:true,force:true});}
};
const contextOf=raw=>Object.fromEntries(raw.split(/\r?\n/).filter(x=>x.includes('=')).map(x=>[x.slice(0,x.indexOf('=')),x.slice(x.indexOf('=')+1)]));
// Only a successful remote push, or an explicit no-change at a verified main
// commit, establishes the registration outcome. A discarded local commit never does.
export async function registeredGitProof(run,client,cachedProof=null){
 if(cachedProof?.schema===2&&cachedProof.run_id===run.id&&cachedProof.run_attempt===run.attempt&&
    validSha(cachedProof.sourceSha)&&cachedProof.registry&&cachedProof.evidenceSource!=='diagnostics-and-deploy-job'){
  // Previously authenticated commit: inspect only its current tree, not the job log or ZIP again.
  const sha=cachedProof.sourceSha;
  const reach=await client.api('/compare/'+sha+'...main');
  if(!['ahead','identical'].includes(reach?.status))return null;
  const object=await client.api('/git/commits/'+sha);
  const tree=await client.api('/git/trees/'+object.tree.sha+'?recursive=1');
  if(tree.truncated||!Array.isArray(tree.tree))return null;
  const files={};for(const item of tree.tree)if(item.type==='blob'&&validSha(item.sha))files[item.path]=item.sha;
  return {schema:2,run_id:run.id,run_attempt:run.attempt,sourceSha:sha,
   ...proofFromBlobs(files),actualDeployed:false,evidenceSource:'trusted-git-tree'};
 }
 const jobs=await client.api('/actions/runs/'+run.id+'/attempts/'+run.attempt+'/jobs?per_page=100');
 const sync=(jobs.jobs||[]).find(x=>x.name==='sync');
 if(!sync||sync.conclusion!=='success')return null;
 const location=await getSigned(client,client.origin+'/actions/jobs/'+sync.id+'/logs');
 if(!location)return null;
 const logResponse=await client.fetchImpl(location);
 if(!logResponse.ok)return null;
 const raw=await logResponse.text();
 if(raw.length>5*1024*1024)return null;
 // Strip ANSI and GitHub timestamp prefixes, preserving execution order.
 const lines=raw.replace(/\x1b\[[0-9;]*m/g,'').split(/\r?\n/)
  .map(s=>s.replace(/^\d{4}-\d\d-\d\dT[^ ]+\s+/,''));
 let candidate=null,reset=null,accepted=null;
 for(const line of lines){
  const created=/\[main ([a-f0-9]{7,40})\] chore\(archive\): sync registration artifacts(?: \[skip ci\])?/.exec(line);
  if(created)candidate=created[1];
  const resetMatch=/HEAD is now at ([a-f0-9]{7,40})\b/.exec(line);
  if(resetMatch)reset=resetMatch[1];
  const pushed=/\b([a-f0-9]{7,40})\.\.([a-f0-9]{7,40})\s+HEAD -> main\b/.exec(line);
  if(pushed&&candidate&&candidate.startsWith(pushed[2]))accepted=candidate;
  if(line.includes('Latest main already has the generated registration.'))accepted=reset;
  if(line.includes('Archive registration artifacts already current.'))accepted=run.sha;
 }
 if(!accepted)return null;
 const commit=await client.api('/commits/'+accepted);
 const sha=commit?.sha;
 if(!validSha(sha)||!sha.startsWith(accepted))return null;
 // For a no-change path the already-present remote commit may have any message.
 if(candidate&&accepted===candidate&&!/^chore\(archive\): sync registration artifacts/.test(commit.commit?.message||''))return null;
 // A successful push or no-change is only accepted if GitHub confirms the
 // referenced commit is in main's current ancestry (not a discarded local HEAD).
 const reach=await client.api('/compare/'+sha+'...main');
 if(!['ahead','identical'].includes(reach?.status))return null;
 const object=await client.api('/git/commits/'+sha);
 const tree=await client.api('/git/trees/'+object.tree.sha+'?recursive=1');
 if(tree.truncated||!Array.isArray(tree.tree))return null;
 const files={};
 for(const item of tree.tree)if(item.type==='blob'&&validSha(item.sha))files[item.path]=item.sha;
 return {schema:2,run_id:run.id,run_attempt:run.attempt,sourceSha:sha,...proofFromBlobs(files),
  actualDeployed:false,evidenceSource:'trusted-git-tree'};
}
export async function deployedSiteProof(run,client,cachedProof=null){
 return withTemp(async tmp=>{
  const response=await client.api('/actions/runs/'+run.id+'/artifacts?per_page=100');
  const artifacts=response.artifacts||[];
  const reusable=cachedProof?.schema===2&&cachedProof.run_id===run.id&&
   cachedProof.run_attempt===run.attempt&&cachedProof.sourceSha===run.sha&&cachedProof.deploymentJobVerified===true;
  const found=artifacts.find(a=>a.name==='archive-pages-release-evidence-'+run.id+'-'+run.attempt);
  if(!reusable&&found?.expired)return {status:'permanent',reason:'증거 만료'};
  if(!reusable&&!found)return {status:'transient',reason:'배포 진단 증거 없음'};
  if(!reusable){
   const diagnosticZip=path.join(tmp,'diagnostics.zip');
   if(found.size_in_bytes>limit)return {status:'permanent',reason:'증거 크기 초과'};
   if(!(await download(client,found,diagnosticZip)))return {status:'transient',reason:'증거 다운로드 실패'};
   const context=contextOf(execFileSync('unzip',['-p',diagnosticZip,'context.txt'],{encoding:'utf8',maxBuffer:65536}));
   if(context.run_id!==String(run.id)||context.run_attempt!==String(run.attempt)||context.source_sha!==run.sha||!validSha(context.source_sha))
    return {status:'transient',reason:'증거 실행/차수/SHA 불일치'};
   // A previously confirmed deploy job is immutable for this exact run/attempt/SHA.
   const jobs=await client.api('/actions/runs/'+run.id+'/attempts/'+run.attempt+'/jobs?per_page=100');
   const deploy=(jobs.jobs||[]).find(j=>j.name==='Deploy the verified student release');
   if(!deploy||deploy.conclusion!=='success'||!(deploy.steps||[]).some(s=>s.name==='Deploy Pages artifact'&&s.conclusion==='success'))
    return {status:'transient',reason:'배포 결과 단계 미검증'};
  }
  // This witness is already authenticated. A later Pages artifact/API/stream
  // exception must not discard the successful deployment-job observation.
  const proof={schema:2,run_id:run.id,run_attempt:run.attempt,sourceSha:run.sha,
   deploymentJobVerified:true,actualDeployed:false,evidenceSource:'diagnostics-and-deploy-job',exams:{}};
  const partial=reason=>({status:'verified',proof:{...proof,fileProofReason:reason}});
  try{
   const attemptInfo=await client.api('/actions/runs/'+run.id+'/attempts/'+run.attempt);
   const started=Date.parse(attemptInfo.run_started_at),finished=Date.parse(attemptInfo.updated_at||run.at);
   if(!Number.isFinite(started)||!Number.isFinite(finished))return partial('배포 파일 산출물 미식별');
   const candidates=artifacts.filter(a=>a.name==='github-pages'&&Date.parse(a.created_at)>=started&&Date.parse(a.created_at)<=finished+600000);
   if(candidates.length!==1)return partial('배포 파일 산출물 미식별');
   if(candidates[0].expired)return partial('Pages ZIP 만료');
   if(candidates[0].size_in_bytes>limit)return partial('Pages ZIP 크기 초과');
   const siteZip=path.join(tmp,'site.zip');
   if(!(await download(client,candidates[0],siteZip)))return partial('Pages ZIP 다운로드 실패');
   const raw=execFileSync('python3',[script,siteZip],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:240000});
   const files=JSON.parse(raw);
   return {status:'verified',proof:{...proof,...proofFromBlobs(files),actualDeployed:true,
    evidenceSource:'uploaded-pages-artifact'}};
  }catch(error){
   // The streaming guard also protects against a falsely reported small ZIP.
   // Oversized/expired file evidence is terminal; network/stream errors retry.
   return partial(error?.message==='Artifact size limit'?'Pages ZIP 크기 초과':'Pages ZIP 다운로드 실패');
  }
 });
}
