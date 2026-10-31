import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {executeOnce,githubClient,localAncestorResolver,gitStatus} from '../archive/tools/archive-progress-observer.mjs';

// S16: the Progress Observer used to time out after 30 minutes on every run (234 of 237 cancelled) because
// reconcile() asked GitHub /compare for thousands of (merge SHA, run SHA) pairs and the status is stored only
// at the very end. These tests pin the bounded behaviour.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=n=>String(n).padStart(40,'0');
const link=id=>'https://github.com/icefoxtail/AP------/actions/runs/'+id;
const releaseRun=(id,head)=>({id,run_attempt:1,event:'push',conclusion:'success',head_sha:head,
 updated_at:new Date(Date.UTC(2026,9,29,0,id%60,0)).toISOString(),html_url:link(id),head_branch:'main',pull_requests:[]});

function observerApi(releases,calls){
 return async route=>{
  calls.push(route);
  if(route.startsWith('/contents/'))return null;
  if(route.startsWith('/pulls?'))return [];
  if(route.startsWith('/actions/workflows/archive-registration-sync.yml/runs?'))return {workflow_runs:[]};
  if(route.startsWith('/actions/workflows/archive-pages-release.yml/runs?'))return {workflow_runs:releases};
  throw Error('unexpected API route '+route);
 };
}

test('an exhausted evidence budget defers new runs, spends no attempt, and still stores the status',async()=>{
 const releases=[1,2,3].map(i=>releaseRun(700+i,sha(i)));
 const calls=[],logs=[];let stored=0,evidence=0,written=null;
 await executeOnce({api:observerApi(releases,calls),clock:()=> '2026-10-29T12:00:00.000Z',
  getEvidence:async()=>{evidence++;return null;},deadlineAt:1000,now:()=>2000,log:m=>logs.push(m),
  storeStatus:async value=>{stored++;written=value;}});
 assert.equal(evidence,0,'no evidence request after the budget is spent');
 assert.equal(stored,1,'the status is stored exactly once even though evidence was skipped');
 assert.deepEqual(written.observations,{},'a deferred run records no observation, so no retry attempt is consumed');
 assert.ok(logs.some(m=>/budget exhausted: 3 run/.test(m)));
});

test('within the budget every new run is still observed',async()=>{
 const releases=[1,2].map(i=>releaseRun(710+i,sha(i)));
 let evidence=0,written=null;
 await executeOnce({api:observerApi(releases,[]),clock:()=> '2026-10-29T12:00:00.000Z',
  getEvidence:async()=>{evidence++;return null;},deadlineAt:Infinity,
  storeStatus:async value=>{written=value;}});
 assert.equal(evidence,2);
 assert.equal(Object.keys(written.observations).length,2);
});

test('an injected ancestry oracle replaces per-pair /compare API calls',async()=>{
 const releases=[1,2].map(i=>releaseRun(720+i,sha(i)));
 const calls=[];
 await executeOnce({api:observerApi(releases,calls),clock:()=> '2026-10-29T12:00:00.000Z',
  getEvidence:async()=>null,ancestor:async()=>true,storeStatus:async()=>{}});
 assert.equal(calls.some(route=>route.startsWith('/compare/')),false);
});

test('the default ancestry fallback requests a one-commit page, not the full comparison payload',async()=>{
 const calls=[];
 const api=async route=>{
  calls.push(route);
  if(route.startsWith('/contents/')){
   const raw=JSON.stringify({entries:{'exam-sample-a':{exam:'exam-sample-a',
    main:{result:'완료',sha:sha(1),run:'https://github.com/icefoxtail/AP------/pull/1',at:'2026-10-28T00:00:00Z'}}}});
   return {sha:'s',size:Buffer.byteLength(raw),encoding:'base64',content:Buffer.from(raw).toString('base64')};
  }
  if(route.startsWith('/pulls?'))return [];
  if(route.startsWith('/actions/workflows/archive-registration-sync.yml/runs?'))return {workflow_runs:[]};
  if(route.startsWith('/actions/workflows/archive-pages-release.yml/runs?'))return {workflow_runs:[releaseRun(731,sha(2))]};
  if(route.startsWith('/compare/'))return {status:'ahead'};
  throw Error('unexpected API route '+route);
 };
 await executeOnce({api,clock:()=> '2026-10-29T12:00:00.000Z',getEvidence:async()=>null,storeStatus:async()=>{}});
 const compares=calls.filter(route=>route.startsWith('/compare/'));
 assert.ok(compares.length>0,'fixture must exercise the ancestry fallback');
 assert.ok(compares.every(route=>route.endsWith('?per_page=1')),compares.join(','));
});

test('local ancestry resolver answers from git and probes the remote once per unknown head',async()=>{
 const local=new Set([sha(1),sha(2),sha(3)]);
 const gitCalls=[];
 const git=args=>{
  gitCalls.push(args.join(' '));
  if(args[0]==='cat-file')return local.has(args[2].replace('^{commit}',''))?0:1;
  if(args[0]==='merge-base')return Number(args[2])<=Number(args[3])?0:1;
  throw Error('unexpected git '+args);
 };
 let remoteProbes=0,apiCompares=0;
 const resolver=localAncestorResolver({git,
  remoteHasCommit:async head=>{remoteProbes++;return head===sha(9);},
  apiCompare:async()=>{apiCompares++;return true;}});
 assert.equal(await resolver(sha(1),sha(3)),true);
 assert.equal(await resolver(sha(3),sha(1)),false);
 assert.equal(await resolver(sha(8),sha(3)),false,'a base unknown locally cannot be an ancestor of a local head');
 // Pre-rewrite or foreign heads: one existence probe, never one API compare per base.
 assert.equal(await resolver(sha(1),sha(7)),false);
 assert.equal(await resolver(sha(2),sha(7)),false);
 assert.equal(await resolver(sha(3),sha(7)),false);
 assert.equal(remoteProbes,1);
 assert.equal(apiCompares,0);
 // A head newer than the checkout exists remotely: only then the API decides.
 assert.equal(await resolver(sha(1),sha(9)),true);
 assert.equal(apiCompares,1);
 assert.equal(resolver.stats.api,1);
});

test('gitStatus drives a real repository: ancestor, non-ancestor and unknown commit',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'observer-git-'));
 try{
  const git=(...args)=>execFileSync('git',['-C',dir,...args],{encoding:'utf8',env:{...process.env,GIT_AUTHOR_NAME:'t',GIT_AUTHOR_EMAIL:'t@example.com',
   GIT_COMMITTER_NAME:'t',GIT_COMMITTER_EMAIL:'t@example.com'}}).trim();
  git('init','-q','-b','main');
  const commit=name=>{fs.writeFileSync(path.join(dir,name),name);git('add',name);git('commit','-q','-m',name);return git('rev-parse','HEAD');};
  const first=commit('a'),second=commit('b');
  git('checkout','-q','-b','side',first);
  const side=commit('c');
  const run=args=>gitStatus(args,{cwd:dir});
  assert.equal(run(['merge-base','--is-ancestor',first,second]),0);
  assert.equal(run(['merge-base','--is-ancestor',second,first]),1);
  assert.equal(run(['merge-base','--is-ancestor',side,second]),1,'diverged commits are not ancestors');
  assert.notEqual(run(['cat-file','-e',sha(5)+'^{commit}']),0,'an unknown commit is reported as missing');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('githubClient gives every request an abort deadline',async()=>{
 const seen=[];
 const fetchImpl=async(url,opts)=>{seen.push({url,signal:opts.signal});return {ok:true,status:200,json:async()=>({})};};
 const client=githubClient({fetchImpl,token:'t',apiTimeoutMs:5000,downloadTimeoutMs:9000});
 await client.api('/pulls');
 await client.fetchImpl('https://example.invalid/artifact.zip');
 assert.equal(seen.length,2);
 for(const request of seen)assert.ok(request.signal instanceof AbortSignal);
 assert.equal(seen[0].signal.aborted,false);
 // A caller-provided signal is respected, not overwritten.
 const own=new AbortController();
 await client.api('/pulls',{signal:own.signal});
 assert.equal(seen[2].signal,own.signal);
});

test('the observer workflow is bounded: step and job timeouts, full-history checkout, evidence budget',()=>{
 const workflow=fs.readFileSync(path.join(root,'.github/workflows/archive-progress-observer.yml'),'utf8');
 const job=/timeout-minutes:\s*(\d+)/.exec(workflow);
 assert.ok(job&&Number(job[1])<=25,'job timeout must stay well below the old 30 minute wedge');
 assert.match(workflow,/Reconcile public status[\s\S]*?timeout-minutes:\s*(1\d|20)\b/);
 assert.match(workflow,/fetch-depth:\s*0/);
 assert.match(workflow,/filter:\s*blob:none/);
 assert.match(workflow,/ARCHIVE_PROGRESS_BUDGET_MS:\s*['"]?\d+/);
 // Evidence work is lost on cancel (status is stored at the end): superseded runs queue, they never cancel a running one.
 assert.match(workflow,/cancel-in-progress:\s*false/);
});

test('status save retries transient socket errors at most 3 attempts and never retries other errors',async()=>{
 const {withTransientRetry}=await import('../archive/tools/archive-progress-observer.mjs');
 const sleep=async()=>{};
 let n=0;
 assert.equal(await withTransientRetry(async()=>{if(++n<3)throw Object.assign(Error('fetch failed'),{cause:{code:'EPIPE'}});return 'ok';},{sleep}),'ok');
 assert.equal(n,3);
 n=0;
 await assert.rejects(withTransientRetry(async()=>{n++;throw Object.assign(new Error('write EPIPE'),{code:'EPIPE'});},{sleep}),/EPIPE/);
 assert.equal(n,3);
 n=0;
 await assert.rejects(withTransientRetry(async()=>{n++;throw Error('GitHub 409 /contents');},{sleep}),/409/);
 assert.equal(n,1);
});
