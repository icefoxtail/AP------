import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createGitHubCasLedger } from './gpt2-github-cas-ledger.mjs';

const fakeHash = (x) => crypto.createHash('sha1').update(x).digest('hex');
function host() {
  const files = new Map(); let calls=0;
  return {
    files,
    async fetch_file({path,ref}) {
      if (ref !== 'ops/gpt2-cas') throw Error('WRONG_BRANCH');
      const x=files.get(path); if (!x) throw Error('NOT_FOUND 404');
      return {result:{content:x.content,sha:x.sha}};
    },
    async create_file({path,branch,content}) {
      if (branch !== 'ops/gpt2-cas') throw Error('WRONG_BRANCH');
      if (files.has(path)) throw Error('GitHub API error 422: file already exists');
      files.set(path,{content,sha:fakeHash(content)});
      return {result:{commit_sha:fakeHash('commit'+ ++calls)}};
    },
    async update_file({path,branch,content,sha}) {
      if (branch !== 'ops/gpt2-cas') throw Error('WRONG_BRANCH');
      const x=files.get(path);
      if(!x||sha!==x.sha) throw Error('GitHub API error 409: sha mismatch');
      files.set(path,{content,sha:fakeHash(content)});
      return {result:{content_sha:fakeHash(content),commit_sha:fakeHash('commit'+ ++calls)}};
    },
  };
}
const path='gpt2-locks/'+'9'.repeat(64)+'.json';
const args = (github) => ({ github, repository:'icefoxtail/AP------', branch:'ops/gpt2-cas' });
test('separate bridge instances observe exactly one atomic claim',async()=>{
 const gh=host(),a=createGitHubCasLedger(args(gh)),b=createGitHubCasLedger(args(gh));
 const claims=await Promise.all([a.createIfAbsent(path,{owner:'A'}),b.createIfAbsent(path,{owner:'B'})]);
 assert.deepEqual(claims.map(x=>x.created).sort(),[false,true]);
 assert.equal(gh.files.size,1);
 const stored=await a.get(path); assert.ok(['A','B'].includes(stored.value.owner));
});
test('version CAS prevents a stale writer overwriting another writer',async()=>{
 const gh=host(),a=createGitHubCasLedger(args(gh)),b=createGitHubCasLedger(args(gh));
 await a.createIfAbsent(path,{state:'CLAIMED'});
 const first=await a.get(path),second=await b.get(path);
 assert.equal((await a.compareAndSwap(path,first.version,{state:'VERIFIED'})).updated,true);
 assert.equal((await b.compareAndSwap(path,second.version,{state:'STALE'})).updated,false);
 assert.equal((await a.get(path)).value.state,'VERIFIED');
});
test('reject main branch, unverified version and broad paths',async()=>{
 const gh=host();assert.throws(()=>createGitHubCasLedger({...args(gh),branch:'main'}),/DEDICATED/);
 const a=createGitHubCasLedger(args(gh));
 await assert.rejects(()=>a.createIfAbsent('../main',{x:1}),/INVALID_CAS_PATH/);
 await assert.rejects(()=>a.compareAndSwap(path,'oops',{x:1}),/GITHUB_CAS_VERSION_REQUIRED/);
});
test('provider permission errors never impersonate CAS conflicts',async()=>{
 const gh=host();gh.create_file=async()=>{throw Error("This tool call was blocked by OpenAI's safety checks.")};
 const a=createGitHubCasLedger(args(gh));
 await assert.rejects(()=>a.createIfAbsent(path,{}),/blocked by OpenAI/);
});