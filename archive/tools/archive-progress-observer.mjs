import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {reconcile,validSha} from './archive-progress-core.mjs';
import {mergedPRs,runs,selectProof,parseProof,checksFromRuns} from './archive-progress-collector.mjs';
import {registeredGitProof,deployedSiteProof} from './archive-progress-github-proof.mjs';
import {observeRun,runKey,sanitizeObservation,eligible} from './archive-progress-retry.mjs';
const REPOSITORY='icefoxtail/AP------';
// A hung socket must never consume the whole job budget: every request carries its own deadline.
export const API_TIMEOUT_MS=60*1000;
export const DOWNLOAD_TIMEOUT_MS=5*60*1000;
export function githubClient({fetchImpl=fetch,token=process.env.GITHUB_TOKEN,apiTimeoutMs=API_TIMEOUT_MS,
 downloadTimeoutMs=DOWNLOAD_TIMEOUT_MS}={}){
 if(!token)throw Error('GITHUB_TOKEN missing');
 const origin='https://api.github.com/repos/'+REPOSITORY;
 const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'};
 const bounded=(ms,fn)=>(url,opts={})=>fn(url,opts.signal?opts:{...opts,signal:AbortSignal.timeout(ms)});
 const api=async(route,opts={})=>{
  const response=await bounded(apiTimeoutMs,fetchImpl)(origin+route,{...opts,headers:{...headers,...opts.headers}});
  if(!response.ok){if(response.status===404&&opts.allow404)return null;throw Error('GitHub '+response.status+' '+route);}
  return response.json();
 };
 return {api,headers,origin,fetchImpl:bounded(downloadTimeoutMs,fetchImpl)};
}

/**
 * Ancestry oracle for reconcile(). The old implementation called GET /compare/{base}...{head} once per
 * (exam merge SHA, run SHA) pair: ~175 merge SHAs x ~32 runs = thousands of sequential, payload-heavy
 * requests, which exceeded the 30 minute job limit on every run since 2026-10-28 (the status is only
 * stored at the very end, so a timeout loses all progress). The trusted-main checkout already holds the
 * full commit graph, so answer from it. A commit that exists on neither side is not an ancestor of a local
 * commit; only a head newer than the checkout falls back to the API (existence is probed once per head).
 */
export function localAncestorResolver({git,remoteHasCommit,apiCompare,log=()=>{}}){
 const known=new Map(),remote=new Map(),stats={local:0,api:0,missing:0};
 const hasLocal=sha=>{
  if(!known.has(sha))known.set(sha,git(['cat-file','-e',sha+'^{commit}'])===0);
  return known.get(sha);
 };
 const resolver=async(base,head)=>{
  if(hasLocal(head)){
   if(!hasLocal(base)){stats.missing++;return false;}
   stats.local++;
   return git(['merge-base','--is-ancestor',base,head])===0;
  }
  if(!remote.has(head))remote.set(head,Promise.resolve().then(()=>remoteHasCommit(head)).catch(()=>false));
  if(!(await remote.get(head))){stats.missing++;return false;}
  stats.api++;
  return apiCompare(base,head);
 };
 resolver.stats=stats;resolver.log=()=>log('ancestry checks: local='+stats.local+' api='+stats.api+' unknown='+stats.missing);
 return resolver;
}
export function gitStatus(args,{cwd=process.cwd()}={}){
 return spawnSync('git',args,{cwd,stdio:'ignore',timeout:30000}).status;
}
export async function getProof(run,kind,client){
 if(run.conclusion!=='success'||run.event==='pull_request'||run.branch!=='main'||!Number.isInteger(run.attempt))return null;
 const artifacts=await client.api('/actions/runs/'+run.id+'/artifacts?per_page=100');
 const item=selectProof(artifacts.artifacts,run);
 if(!item||item.size_in_bytes>8*1024*1024)return null;
 const response=await client.fetchImpl(client.origin+'/actions/artifacts/'+item.id+'/zip',{headers:client.headers,redirect:'manual'});
 if(![301,302,303,307,308].includes(response.status))return null;
 const location=response.headers.get('location');
 if(!location || !/^https:\/\//.test(location)||new URL(location).hostname==='api.github.com')return null;
 // The signed artifact URL is DATA; never send GitHub credentials to that host.
 const archive=await client.fetchImpl(location);
 if(!archive.ok)return null;
 const bytes=new Uint8Array(await archive.arrayBuffer());
 if(bytes.length>8*1024*1024)return null;
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'archive-progress-'));
 try{
  const zip=path.join(tmp,'proof.zip');fs.writeFileSync(zip,bytes);
  const member='progress-evidence-'+run.id+'-'+run.attempt+'.json';
  const raw=execFileSync('unzip',['-p',zip,member],{encoding:'utf8',maxBuffer:8*1024*1024});
  return parseProof(raw,run,kind);
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
// Production adapter is injectable so the exact collector used by main() can
// also be exercised by executeOnce fixture tests without status-branch writes.
export async function collectEvidence(run,kind,cachedProof,client){
 if(kind==='release')return deployedSiteProof(run,client,cachedProof);
 if(cachedProof)return registeredGitProof(run,client,cachedProof);
 const provided=await getProof(run,kind,client);
 return provided || registeredGitProof(run,client);
}
export const CONTENTS_API_INLINE_LIMIT = 1024 * 1024;

/**
 * Read the durable progress document without assuming Contents API always
 * includes its bytes. GitHub omits inline content for files over 1 MiB and
 * reports encoding "none"; in that case the Contents response SHA points to
 * the same immutable object through the Git Blobs API.
 */
export async function readStatus(api) {
 const file=await api('/contents/archive-progress.json?ref=archive-progress-state',{allow404:true});
 if(!file)return {value:{entries:{}},sha:null};
 const fileSize=Number.isInteger(file.size)&&file.size>=0?file.size:null;
 const canReadInline=file.encoding==='base64'&&typeof file.content==='string'&&file.content.length>0&&
  (fileSize===null||fileSize<=CONTENTS_API_INLINE_LIMIT);
 let bytes;
 if(canReadInline){
  bytes=Buffer.from(file.content,'base64');
 }else{
  if(typeof file.sha!=='string'||!file.sha)throw Error('Progress Contents response has no blob SHA for fallback');
  const blob=await api('/git/blobs/'+file.sha);
  if(!blob||blob.sha!==file.sha)throw Error('Progress Git Blob SHA does not match Contents response');
  if(blob.encoding!=='base64'||typeof blob.content!=='string'||blob.content.length===0)
   throw Error('Progress Git Blob response is not base64 content');
  bytes=Buffer.from(blob.content,'base64');
  if(Number.isInteger(blob.size)&&blob.size!==bytes.length)
   throw Error('Progress Git Blob size does not match decoded content');
 }
 if(fileSize!==null&&bytes.length!==fileSize)
  throw Error('Progress status size does not match Contents response');
 let value;
 try{value=JSON.parse(bytes.toString('utf8'));}
 catch(error){throw Error('Progress status JSON is invalid: '+error.message);}
 if(!value||typeof value!=='object'||Array.isArray(value))
  throw Error('Progress status JSON root must be an object');
 return {value,sha:file.sha||null};
}

export async function executeOnce({api,getEvidence,historyPages=1,clock=()=>new Date().toISOString(),storeStatus,manualRetry=false,
 ancestor:ancestorImpl=null,deadlineAt=Infinity,now:nowMs=()=>Date.now(),log=()=>{}}){
 const {value:old,sha:previousSha}=await readStatus(api);
 const [{prs,incompletePRs,completePulls,oldestObservedAt},regRuns,releaseRuns]=await Promise.all([
  mergedPRs(api,historyPages),runs(api,'archive-registration-sync.yml',historyPages),runs(api,'archive-pages-release.yml',historyPages)]);
 const checks=checksFromRuns(regRuns),registrations=[],releases=[];
 const manualHistory=historyPages>1;
 // Incremental by default. History replay remains a separate manual dispatch.
 // The next run always fetches the newest page; updatedAt NEVER gates evidence.
 const count=manualHistory?Infinity:24;
 const selectedRegistration=regRuns.filter(x=>x.event!=='pull_request'&&x.branch==='main').slice(0,count);
 const selectedRelease=releaseRuns.filter(x=>x.branch==='main').slice(0,count);
 const examIds=[...new Set([...Object.keys(old.entries||{}),...prs.flatMap(p=>p.exams||[])])];
 // Run/exam coverage is durable. Once an exam appears in the state, absent
 // witness rows still need backfill after it drops out of recent PR results.
 const mergedAt=new Map();
 for(const [id,item] of Object.entries(old.entries||{}))if(item?.main?.result==='완료'&&validSha(item.main.sha)&&
  Number.isFinite(Date.parse(item.main.at)))mergedAt.set(id,Date.parse(item.main.at));
 for(const p of prs)for(const id of p.exams||[]){
  const time=Date.parse(p.at);
  if(Number.isFinite(time))mergedAt.set(id,Math.max(mergedAt.get(id)||0,time));
 }
 const missingFor=(run,record)=>examIds.filter(id=>mergedAt.has(id)&&
  mergedAt.get(id)<=Date.parse(run.at)&&!record?.proof?.exams?.[id]&&
  !record?.checkedExamIds?.includes(id));
 const observations={};
 let deferred=0;
 for(const [key,raw] of Object.entries(old.observations||{})){
  const safe=sanitizeObservation(key,raw,examIds);
  if(safe)observations[key]=safe;
 }
 const now=clock();
 const backfill=(kind,chosen)=>{
  const existing=new Set(chosen.map(r=>runKey(kind,r)));
  return Object.values(observations)
   .filter(o=>o.key.startsWith(kind+':')&&!existing.has(o.key)&&o.run&&
    (eligible(o,now,manualRetry)||o.fileProofState!=='permanent'&&
     o.status==='verified'&&missingFor(o.run,o).length>0))
   .sort((a,b)=>(a.nextRetryAt||'').localeCompare(b.nextRetryAt||''))
   .slice(0,8).map(o=>({...o.run}));
 };
 for(const kind of ['registration','release']){
  const recent=kind==='registration'?selectedRegistration:selectedRelease;
  const selection=[...recent,...backfill(kind,recent)];
  for(const r of selection){
   if(r.conclusion==='failure'){
    const record={...r,inputSha:r.sha};
    if(kind==='registration')registrations.push(record);else releases.push(record);
    continue;
   }
   if(r.conclusion!=='success')continue;
   const key=runKey(kind,r);
   // Bounded work: once the budget is spent, stop paying for new evidence. Already stored evidence is
   // reused unchanged (no attempt is consumed), the remaining runs are picked up by the next observer run,
   // and the status is still reconciled and stored so progress is never lost to a job timeout.
   const exhausted=nowMs()>=deadlineAt;
   if(exhausted)deferred++;
   const {record,proof}=exhausted?{record:key?observations[key]||null:null,proof:key?observations[key]?.proof||null:null}
    :await observeRun({kind,run:r,old:key?observations[key]:null,clock,manual:manualRetry,
    getEvidence,examIds,newExamIds:missingFor(r,observations[key])});
   if(key&&record)observations[key]=record;
   if(kind==='registration')registrations.push({...r,inputSha:r.sha,registeredSha:proof?.sourceSha,
    proof,proofReason:record?.reason||'현재 실행 차수 증거 없음'});
   else releases.push({...r,proof,sha:r.sha});
  }
 }
 const apiCompare=async(base,head)=>{
  const result=await api('/compare/'+base+'...'+head+'?per_page=1');
  return result.status==='identical'||result.status==='ahead';
 };
 const ancestor=ancestorImpl||apiCompare;
 if(deferred)log('evidence budget exhausted: '+deferred+' run(s) deferred to the next observer run');
 const current=await reconcile(old,{prs,checks,registrations,releases,incompletePRs,completePulls,oldestObservedAt,
  scope:manualHistory?'manual-history':'recent',now:clock()},ancestor);
 // Cache small allowlisted proof fragments keyed to the exact observed run version.
 // Keep bounded history; verified records are reusable and never invalidated by a
 // temporary API outage. Reconciliation preserves older completed item snapshots.
 current.observations=Object.fromEntries(Object.entries(observations).sort((a,b)=>
   (b[1].verifiedAt||b[1].nextRetryAt||'').localeCompare(a[1].verifiedAt||a[1].nextRetryAt||'')).slice(0,200));
 current.history={...current.history,seenRegistrationRuns:selectedRegistration.length,
  seenReleaseRuns:selectedRelease.length,runScanIsPartial:!manualHistory&&(
   regRuns.filter(x=>x.event!=='pull_request'&&x.branch==='main').length>count||
   releaseRuns.filter(x=>x.branch==='main').length>count)};
 await storeStatus(current,previousSha);
 return current;
}

async function main(){
 if(process.env.GITHUB_REPOSITORY!==REPOSITORY)throw Error('Unexpected GitHub repository');
 const pages=Math.min(100,Math.max(1,Number.parseInt(process.env.ARCHIVE_PROGRESS_HISTORY_PAGES||'1',10)||1));
 const client=githubClient(),{api}=client;
 if(!(await api('/git/ref/heads/archive-progress-state',{allow404:true}))){
  const base=await api('/git/ref/heads/main');
  try{await api('/git/refs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ref:'refs/heads/archive-progress-state',sha:base.object.sha})});}
  catch(e){if(!/GitHub 422/.test(String(e)))throw e;}
 }
 const storeStatus=async(value,priorSha)=>api('/contents/archive-progress.json',{method:'PUT',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({message:'chore(status): refresh GitHub-observed archive progress',branch:'archive-progress-state',
   content:Buffer.from(JSON.stringify(value,null,2)+'\n').toString('base64'),...(priorSha?{sha:priorSha}:{})})});
 console.log('OBSERVER_CHECKOUT_SHA='+execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim());
 const started=Date.now();
 const log=message=>console.log('['+Math.round((Date.now()-started)/1000)+'s] '+message);
 // Evidence collection stops at the budget (default 12 min) so reconcile + store always finish inside the
 // workflow's 20 minute step limit instead of being cancelled with nothing saved.
 const budgetMs=Math.max(30*1000,Number.parseInt(process.env.ARCHIVE_PROGRESS_BUDGET_MS||'',10)||12*60*1000);
 const shallow=execFileSync('git',['rev-parse','--is-shallow-repository'],{encoding:'utf8'}).trim()==='true';
 // A shallow checkout cannot answer ancestry locally; fall back to the (slower) API comparison.
 const ancestor=shallow?null:localAncestorResolver({git:gitStatus,log,
  remoteHasCommit:async sha=>!!(await api('/git/commits/'+sha,{allow404:true})),
  apiCompare:async(base,head)=>{const r=await api('/compare/'+base+'...'+head+'?per_page=1');return r.status==='identical'||r.status==='ahead';}});
 log('observer start: budget='+Math.round(budgetMs/1000)+'s ancestry='+(shallow?'api (shallow checkout)':'local git'));
 const current=await executeOnce({api,historyPages:pages,manualRetry:process.env.GITHUB_EVENT_NAME==='workflow_dispatch',
  getEvidence:(run,kind,cachedProof)=>collectEvidence(run,kind,cachedProof,client),storeStatus,
  ancestor,deadlineAt:started+budgetMs,log});
 ancestor?.log?.();
 log('observer stored status');
 console.log('Observer complete:',Object.keys(current.entries).length,'GitHub-linked exams');
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e);process.exitCode=1;});
