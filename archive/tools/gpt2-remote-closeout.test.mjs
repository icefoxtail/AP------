import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { closeout, createImmutable } from './gpt2-remote-closeout.mjs';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const outputRoot=await fs.mkdtemp(path.join(os.tmpdir(),'gpt2-remote-closeout-'));
const opts={outputRoot,campaignId:'H1_GPT2_20261006',stream:'A',examUid:'race_fixture_exam',stage:'CREATE'};
const root=path.join(outputRoot,opts.campaignId,opts.stream,opts.examUid);
const artifactSha='a'.repeat(40), evidenceSha256='b'.repeat(64);
const sealDir=path.join(root,'seals','CREATE');
const validator={ok:true,validatorMode:'CREATE_V2',artifactContract:{active:true,issues:[]},issues:[],artifactSha};
const validatorBytes=Buffer.from(JSON.stringify(validator,null,2)+'\n');
const seal={stageStatus:'CREATE_PASS',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',campaignId:opts.campaignId,stream:opts.stream,examUid:opts.examUid,stage:opts.stage,artifactSha,artifactSha256:'c'.repeat(64),evidenceSha256,validatorReportSha256:digest(validatorBytes),nextArtifactReference:{}};
const handoff={campaignId:opts.campaignId,stream:opts.stream,examUid:opts.examUid,previousStage:'CREATE',stage:'R1',artifactSha,evidenceSha256,artifactReference:{}};
await fs.mkdir(sealDir,{recursive:true});
await fs.mkdir(path.join(root,'handoffs'),{recursive:true});
await fs.writeFile(path.join(sealDir,artifactSha+'.validator.json'),validatorBytes);
await fs.writeFile(path.join(sealDir,artifactSha+'.json'),JSON.stringify(seal,null,2)+'\n');
await fs.writeFile(path.join(root,'handoffs','R1.json'),JSON.stringify(handoff,null,2)+'\n');
function memory(barrier=false){
 const store=new Map();let writes=0;const missingReads=new Map();
 const client=()=>({
  store,
  async get(p){
   if(barrier&&!store.has(p)){
    let gate=missingReads.get(p);if(!gate){let release;gate={n:0,promise:new Promise(r=>release=r),release};missingReads.set(p,gate);}
    gate.n++;if(gate.n===2){missingReads.delete(p);gate.release();}
    await gate.promise;
   }
   const bytes=store.get(p);return bytes==null?null:Buffer.from(bytes);
  },
  async createIfAbsent(p,b){if(store.has(p))return false;writes++;store.set(p,Buffer.from(b));return true;}
 });
 return {store,get writes(){return writes},client};
}
test('remote closeout is idempotent',async()=>{const remote=memory();const r=await closeout(opts,remote.client());assert.equal(r.committed,true);assert.equal(remote.writes,4);const b=await closeout(opts,remote.client());assert.equal(b.commitSha256,r.commitSha256);assert.equal(remote.writes,4);});
test('two independent actors that both observed absence safely close the same artifact',async()=>{const remote=memory(true);const [left,right]=await Promise.all([closeout(opts,remote.client()),closeout(opts,remote.client())]);assert.equal(left.committed,true);assert.equal(right.committed,true);assert.equal(left.commitSha256,right.commitSha256);assert.equal(remote.writes,4);});
test('two independent actors cannot overwrite a path with different artifact bytes',async()=>{const remote=memory(true);const outcomes=await Promise.allSettled([createImmutable(remote.client(),'/same/immutable-key',Buffer.from('artifact-A')),createImmutable(remote.client(),'/same/immutable-key',Buffer.from('artifact-B'))]);assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1);const rejected=outcomes.find(x=>x.status==='rejected');assert.match(rejected.reason.message,/REMOTE_IMMUTABLE_CONFLICT/);assert.equal(remote.writes,1);});
test('legacy get/put adapter fails closed without atomic create',async()=>{let puts=0;const adapter=memory().client();adapter.put=async()=>{puts++;};delete adapter.createIfAbsent;await assert.rejects(closeout(opts,adapter),/REMOTE_ATOMIC_CREATE_REQUIRED/);assert.equal(puts,0);});
test('bad first upload readback leaves the commit marker absent',async()=>{const remote=memory();const adapter=remote.client();adapter.createIfAbsent=async(p,b)=>{if(remote.store.has(p))return false;remote.store.set(p,Buffer.from('corrupted'));return true;};await assert.rejects(closeout(opts,adapter),/REMOTE_IMMUTABLE_CONFLICT/);assert.equal([...remote.store.keys()].filter(x=>x.includes('/commits/')).length,0);});
test('tampered existing remote asset blocks replay',async()=>{const remote=memory();await closeout(opts,remote.client());const p=[...remote.store.keys()].find(x=>x.endsWith('.validator.json'));remote.store.set(p,Buffer.from('tamper'));await assert.rejects(closeout(opts,remote.client()),/REMOTE_IMMUTABLE_CONFLICT/);});
test('no raw byte readback is forbidden',async()=>{await assert.rejects(closeout(opts,{get:async()=>({hash:'claim'}),createIfAbsent:async()=>true}),/ADAPTER_BYTES_REQUIRED/);});
