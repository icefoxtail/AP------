import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { publicPlaygroundBase, liveRepoPath, createLiveAssetVerifier, drainResponseTasks } from './high-live-assets.mjs';
const base='https://example.test/AP/apmath/playground/';

test('public URL and source mapping reject credentials and paths outside checked source',()=>{
  assert.equal(publicPlaygroundBase(base.slice(0,-1)).href,base);
  assert.equal(liveRepoPath(new URL(base),base+'next/labs/a.html?theme=paper'),'apmath/playground/next/labs/a.html');
  assert.equal(liveRepoPath(new URL(base),'https://cdn.example.test/a.css'),null);
  for(const url of ['file:///tmp/a','https://user:secret@example.test/a','https://example.test/a?token=x','https://example.test/a#x'])assert.throws(()=>publicPlaygroundBase(url));
  for(const suffix of ['../outside.js','next/%2Fetc/passwd.js','next/a%5Cb.js','next/a%00b.js'])assert.throws(()=>liveRepoPath(new URL(base),base+suffix));
});

test('public byte verification fails closed on stale content, absent references and dirty checkout',async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'high-live-assets-'));
  try{
    const relative='apmath/playground/next/labs/a.html',file=path.join(root,relative),body=Buffer.from('<p>pinned</p>');
    fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,body);
    const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
    git('init');git('add','.');git('-c','user.name=Test','-c','user.email=test@example.test','commit','-m','fixture');
    const commit=git('rev-parse','HEAD'),url=base+'next/labs/a.html';
    const response=value=>({url:()=>url,status:()=>200,ok:()=>true,body:async()=>value});
    const check=()=>{const errors=[];return{errors,v:createLiveAssetVerifier({root,baseURL:base,commit,onFailure:e=>errors.push(e)})};};
    const valid=check();await valid.v.verify(response(body),'one');valid.v.requireSources([url],'one');
    assert.equal(valid.v.finish().status,'MATCHED_CHECKED_ASSETS');assert.deepEqual(valid.errors,[]);assert.equal(valid.v.report.actualDeployedCommit,null);
    const statusChange=check();await statusChange.v.verify(response(body),'one');
    await statusChange.v.verify({...response(body),status:()=>500,ok:()=>false},'two');
    assert.equal(statusChange.v.finish().status,'FAILED');assert.equal(statusChange.v.report.assets.length,2);
    const pending=check();let releaseBody;
    const lateBody=new Promise(resolve=>releaseBody=resolve),work=pending.v.verify({...response(body),body:()=>lateBody},'one');
    assert.equal(pending.v.report.pendingVerifications,1);assert.equal(pending.v.finish().status,'FAILED');
    releaseBody(body);await work;assert.equal(pending.v.report.pendingVerifications,0);assert.equal(pending.v.report.status,'FAILED');
    const stale=check();await stale.v.verify(response(Buffer.from('old deployment')),'one');assert.equal(stale.v.finish().status,'FAILED');assert.equal(stale.errors[0].reason,'public-source-verification');
    const missing=check();await missing.v.verify(response(body),'one');missing.v.requireSources([url],'two');assert.equal(missing.v.finish().status,'FAILED');
    fs.writeFileSync(file,'uncommitted');const dirty=check();await dirty.v.verify(response(body),'one');assert.equal(dirty.v.finish().status,'FAILED');assert.match(dirty.errors[0].error,/Checkout differs/);
    const empty=check();assert.equal(empty.v.finish().status,'FAILED');
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('response drain waits for verification work appended during an earlier body read',async()=>{
  let releaseFirst,releaseSecond,secondDone=false,finished=false;
  const first=new Promise(r=>releaseFirst=r),second=new Promise(r=>releaseSecond=r);
  const tasks=[first.then(()=>tasks.push(second.then(()=>{secondDone=true;})))];
  const drain=drainResponseTasks(tasks).then(()=>{finished=true;});
  releaseFirst();await Promise.resolve();await Promise.resolve();await Promise.resolve();
  assert.equal(finished,false);assert.equal(secondDone,false);
  releaseSecond();await drain;assert.equal(secondDone,true);assert.equal(finished,true);
});
