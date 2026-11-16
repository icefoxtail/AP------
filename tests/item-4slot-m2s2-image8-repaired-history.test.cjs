'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture,run,contract,priorContract,sp,cp}=require('./helpers/m2s2-repaired-metadata-fixture.cjs');
const repair=require('../tools/4slot/m2s2-current-repair-closure.cjs');
function context(f){const hp=f.hp;hp.m2ContinuityObligation=priorContract.createObligationReader(f.root,hp)(f.data);return hp;}
const originalReplay=(r,ref,h)=>repair.validateHistoricalFile(r,ref,h,priorContract.validateHistoricalFile);
test('repaired full original chain stays ordinary-live while closed historical replay reads its literal snapshot',t=>{
  const f=fixture(t);assert.equal(run(f).index.counts.registered,5);const c=f.commitCurrent(),ref=f.ref(c,cp,true),hp=context(f);
  f.bank[0].image='assets/synthetic-current-image8.svg';f.save(sp,f.js(f.bank));f.commit('synthetic later image pointer');
  assert.notDeepEqual(contract.validateFile(f.root,f.data,hp,originalReplay),[]);
  const result=contract.validateHistoricalFile(f.root,ref,hp,originalReplay);assert.deepEqual(result.errors,[]);assert.deepEqual(result.document,f.data);
  for(const p of [f.carrierPath,f.requestCopy,f.receiptPath,f.copyPath])assert.ok(result.requiredLiveEvidence.some(r=>r.path===p),p);
  assert.ok(result.requiredLiveEvidence.length>4);
});
test('historical repaired source mode must remain 100644 at the exact snapshot',t=>{
  const f=fixture(t);f.commitCurrent();f.git('update-index','--chmod=+x',sp);f.git('commit','-qm','synthetic nonregular historical source');const c=f.git('rev-parse','HEAD').trim(),hp=context(f);
  assert.notDeepEqual(contract.validateHistoricalFile(f.root,f.ref(c,cp,true),hp,originalReplay).errors,[]);
});
test('historical repaired replay still rejects its original native or negative chain failure',t=>{
  const f=fixture(t),c=f.commitCurrent(),hp=context(f);
  const out=contract.validateHistoricalFile(f.root,f.ref(c,cp,true),hp,()=>({errors:['synthetic original native rejection'],requiredLiveEvidence:[]}));
  assert.match(out.errors.join('|'),/HISTORICAL_CHAIN/);
});
