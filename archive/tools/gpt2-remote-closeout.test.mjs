import test from 'node:test';
import assert from 'node:assert/strict';
import { closeout } from './gpt2-remote-closeout.mjs';
const outputRoot=process.env.GPT2_TEST_OUTPUT_ROOT || '/mnt/data/gpt2_runner_pilot';
const opts={outputRoot,campaignId:'H1_GPT2_20261006',stream:'A',examUid:'20_순천여고_1학기_중간_고1_기출',stage:'CREATE'};
function memory(){const store=new Map();let writes=0;return {store,get writes(){return writes},async get(p){return store.get(p)??null},async put(p,b){writes++;if(store.has(p))throw Error('NOT_IMMUTABLE');store.set(p,Buffer.from(b));}};}
test('remote closeout is idempotent',async()=>{const a=memory();const r=await closeout(opts,a);assert.equal(r.committed,true);assert.equal(a.writes,4);const b=await closeout(opts,a);assert.equal(b.commitSha256,r.commitSha256);assert.equal(a.writes,4);});
test('corrupt remote readback has no committed marker',async()=>{const a=memory();a.put=async(p,b)=>{a.store.set(p,Buffer.from('corrupted'));};await assert.rejects(closeout(opts,a),/REMOTE_READBACK_MISMATCH/);assert.equal([...a.store.keys()].filter(x=>x.includes('/commits/')).length,0);});
test('tampered existing remote asset blocks replay',async()=>{const a=memory();await closeout(opts,a);const p=[...a.store.keys()].find(x=>x.endsWith('.validator.json'));a.store.set(p,Buffer.from('tamper'));await assert.rejects(closeout(opts,a),/REMOTE_READBACK_MISMATCH/);});
test('no raw byte readback is forbidden',async()=>{await assert.rejects(closeout(opts,{get:async()=>({hash:'claim'}),put:async()=>{}}),/ADAPTER_BYTES_REQUIRED/);});
