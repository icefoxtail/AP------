#!/usr/bin/env node
/** Two GitHub-hosted runners compete for one key in ops/gpt2-cas.
 * This tests GitHub CAS only; it does not claim cross-GPT-session Library CAS.
 * The caller must use an owner-authorized workflow with contents:write.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

const BRANCH = 'ops/gpt2-cas';
const VERSION = 'GPT2_CAS_DISTRIBUTED_SMOKE_v1';
export const testPath = runId => {
  if (!/^\d+$/.test(String(runId))) throw Error('INVALID_RUN_ID');
  return `gpt2-locks/${createHash('sha256').update(`GPT2_CAS_SMOKE:${runId}`).digest('hex')}.json`;
};
export const collisionStatus = code => code === 409 || code === 422;

export function evaluateAttemptResults(records, actual) {
  if (!Array.isArray(records) || records.length !== 2 || !actual || !/^[AB]$/.test(actual.owner))
    throw Error('INVALID_DISTRIBUTED_TEST_EVIDENCE');
  assert.deepEqual(records.map(r => r.actor).sort(), ['A','B']);
  assert.equal(records.filter(r => r.created === true).length, 1, 'exactly one writer must win');
  assert.equal(records.filter(r => r.created === false).length, 1, 'exactly one writer must fail CAS');
  const winner = records.find(r => r.created === true);
  assert.equal(actual.owner, winner.actor, 'actual remote writer must equal winner');
  for (const row of records) {
    assert.equal(row.path, winner.path);
    assert.equal(row.observedOwner, winner.actor);
    assert.equal(row.runId, winner.runId);
  }
  return { ok: true, winner: winner.actor, loser: records.find(r => !r.created).actor, path: winner.path };
}

function host() {
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  const runId = process.env.GITHUB_RUN_ID;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository || '') || !token || !/^\d+$/.test(runId || ''))
    throw Error('GITHUB_AUTH_OR_RUN_ID_REQUIRED');
  const key = testPath(runId);
  const url = `https://api.github.com/repos/${repository}/contents/${key}`;
  async function api(method, body = undefined) {
    const res = await fetch(method === 'GET' ? `${url}?ref=${encodeURIComponent(BRANCH)}` : url, {
      method,
      headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json',
        'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json','User-Agent':'gpt2-cas-distributed-smoke'},
      ...(body ? { body:JSON.stringify(body) } : {}),
      signal:AbortSignal.timeout(30000),
    });
    const value=await res.json();
    return { status:res.status, value };
  }
  async function read() {
    const r=await api('GET');
    if (r.status===404) return null;
    if (r.status!==200) throw Error(`CAS_READ_STATUS:${r.status}:${r.value?.message}`);
    const bytes=Buffer.from(String(r.value.content||'').replaceAll('\n',''),'base64');
    const data=JSON.parse(bytes.toString('utf8'));
    if (data.schemaVersion!==VERSION || data.runId!==runId) throw Error('CAS_WRONG_TEST_RECORD');
    return { data, version:r.value.sha };
  }
  const update = (value, sha) => api('PUT',{
    message:'test(gpt2-cas): cross-runner compare-and-swap', branch:BRANCH,
    content:Buffer.from(JSON.stringify(value,null,2)+'\n').toString('base64'),
    ...(sha ? {sha} : {}),
  });
  const remove = sha => api('DELETE',{ message:'test(gpt2-cas): remove cross-runner probe',branch:BRANCH,sha });
  return {runId,key,read,update,remove};
}
async function readRetry(state) {
  for(let i=0;i<12;i++) {
    const r=await state.read();
    if (r) return r;
    await new Promise(resolve => setTimeout(resolve,400));
  }
  throw Error('CAS_READBACK_MISSING');
}
async function attempt(actor, file) {
  if (!['A','B'].includes(actor)) throw Error('INVALID_ACTOR');
  const state=host();
  const value={schemaVersion:VERSION,runId:state.runId,owner:actor,status:'CREATED'};
  const wrote=await state.update(value);
  if (wrote.status!==201 && !collisionStatus(wrote.status)) throw Error(`CAS_CREATE_STATUS:${wrote.status}:${wrote.value?.message}`);
  const observed=await readRetry(state);
  if(wrote.status===201 && observed.data.owner!==actor) throw Error('CAS_DOUBLE_WIN_RACE');
  const row={actor,created:wrote.status===201,status:wrote.status,runId:state.runId,
    path:state.key,observedOwner:observed.data.owner,remoteBlobSha:observed.version};
  await fs.writeFile(file,JSON.stringify(row,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify(row));
}
async function verify(a,b) {
  const state=host();
  const rows=await Promise.all([a,b].map(async p=>JSON.parse(await fs.readFile(p,'utf8'))));
  const current=await readRetry(state);
  const result=evaluateAttemptResults(rows,current.data);
  assert.equal(result.path,state.key);
  assert.equal(current.data.runId,state.runId);
  // Check that an exact blob SHA update succeeds once and the stale SHA loses.
  const changed={...current.data,status:'VERIFIED'};
  const updated=await state.update(changed,current.version);
  assert.equal(updated.status,200,`CAS_CURRENT_UPDATE_FAILED:${updated.status}`);
  const stale=await state.update({...changed,status:'STALE_OVERWRITE'},current.version);
  assert.ok(collisionStatus(stale.status),`CAS_STALE_UPDATE_SUCCEEDED:${stale.status}`);
  const after=await state.read();
  assert.equal(after.data.status,'VERIFIED');
  assert.equal(after.data.owner,result.winner);
  console.log(JSON.stringify({...result,exactShaCAS:{initialUpdate:updated.status,staleUpdate:stale.status},verifiedRemote:true}));
}
async function cleanup() {
  const state=host();const current=await state.read();
  if(!current) return console.log(JSON.stringify({removed:false,reason:'already absent'}));
  const deleted=await state.remove(current.version);
  if(deleted.status!==200) throw Error(`CAS_CLEANUP_FAILED:${deleted.status}`);
  if(await state.read()) throw Error('CAS_CLEANUP_READBACK_FAILED');
  console.log(JSON.stringify({removed:true,path:state.key}));
}
async function main() {
  const [mode,...args]=process.argv.slice(2);
  if(mode==='attempt'&&args.length===2)return attempt(...args);
  if(mode==='verify'&&args.length===2)return verify(...args);
  if(mode==='cleanup'&&args.length===0)return cleanup();
  throw Error('USAGE: attempt ACTOR FILE | verify FILEA FILEB | cleanup');
}
if (process.argv[1]?.endsWith('gpt2-cas-distributed-smoke.mjs')){
  main().catch(e=>{console.error('CAS_DISTRIBUTED_SMOKE_FAILED:'+e.message);process.exitCode=1;});
}