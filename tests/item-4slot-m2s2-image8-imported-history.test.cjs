'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture,run,contract,priorContract,sp,cp}=require('./helpers/m2s2-imported-metadata-fixture.cjs');
function context(f){const hp=f.hp;hp.m2ImportedObligation=priorContract.createObligationReader(f.root,hp)(f.data);return hp;}
test('imported full native amendment stays ordinary-live while closed historical replay keeps the exact prior',t=>{
  const f=fixture(t);assert.equal(run(f).index.counts.registered,2);const c=f.commitCurrent(),ref=f.ref(c,cp,true),hp=context(f);
  f.bank[0].image='assets/synthetic-current-image8.svg';f.save(sp,f.js(f.bank));f.commit('synthetic later image pointer');
  assert.notDeepEqual(contract.validateFile(f.root,f.data,hp,priorContract.validateHistoricalFile),[]);
  const result=contract.validateHistoricalFile(f.root,ref,hp,priorContract.validateHistoricalFile);assert.deepEqual(result.errors,[]);assert.deepEqual(result.document,f.data);
  for(const p of [f.carrierPath,f.requestCopy,f.receiptPath,f.copyPath])assert.ok(result.requiredLiveEvidence.some(r=>r.path===p),p);
  assert.ok(result.requiredLiveEvidence.length>4);
});
test('historical imported carrier deletion is rejected even if restored only live',t=>{
  const f=fixture(t);f.commitCurrent();const raw=f.bytes(f.carrierPath);require('node:fs').unlinkSync(f.root+'/'+f.carrierPath);const c=f.commit('synthetic historical carrier deletion');f.save(f.carrierPath,raw);const hp=context(f);
  assert.notDeepEqual(contract.validateHistoricalFile(f.root,f.ref(c,cp,true),hp,priorContract.validateHistoricalFile).errors,[]);
});
test('historical imported replay propagates a full original authority rejection',t=>{
  const f=fixture(t),c=f.commitCurrent(),hp=context(f);
  const out=contract.validateHistoricalFile(f.root,f.ref(c,cp,true),hp,()=>({errors:['synthetic original amendment rejection'],requiredLiveEvidence:[]}));
  assert.match(out.errors.join('|'),/HISTORICAL_CHAIN/);
});
