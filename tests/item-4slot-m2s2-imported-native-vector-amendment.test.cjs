'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {fixture,stable,uid,source,sp,cp,mod,contract,priorContract,hash}=require('./helpers/m2s2-imported-native-amendment-fixture.cjs');
const {fixture:priorFixture}=require('./helpers/m2s2-imported-current-fixture.cjs');
function denied(f,re=/M2_IMPORTED_/,{previous=null}={}){
  const x=mod.build(f.root,{previous,reuseCache:!!previous}).index;
  assert.equal(x.records.length,0,JSON.stringify(x.pending));assert(x.pending.some(p=>re.test(p.reason)),JSON.stringify(x.pending));return x;
}
function cold(f){
  const script='const b=require('+JSON.stringify(require.resolve('../tools/4slot/build-4slot-runtime.cjs'))+');process.stdout.write(JSON.stringify(b.build(process.argv[1],{previous:null,reuseCache:false}).index));';
  return JSON.parse(execFileSync(process.execPath,['-e',script,f.root],{encoding:'utf8'}));
}
test('amended full compact replays literal v1 and preserves HOLD, fallback and approved metadata overlay',t=>{
  const f=fixture(t),before=mod.sha(f.bytes(sp)),priorRaw=f.git('show',f.proof.priorValidatedCompactRef.commit+':'+cp);
  const dry=mod.run(f.root);assert.equal(dry.verified,2,JSON.stringify(dry.pendingItems));assert.equal(dry.pending,1);assert.match(dry.pendingItems[0].reason,/EXPLICIT_REVIEW_HOLD/);
  mod.run(f.root,{write:true});const replay=mod.run(f.root,{check:true});assert.equal(replay.changed,false);assert.equal(mod.sha(f.bytes(sp)),before);assert.equal(f.git('show',f.proof.priorValidatedCompactRef.commit+':'+cp),priorRaw);
  const index=JSON.parse(f.bytes('archive/data/item-4slot-index.json')),api=require('../archive/item-4slot.js').createIndex(index);
  assert.deepEqual(api.get(uid(1)).given,[4]);assert.equal(api.get(uid(2)),null);assert.deepEqual(api.get(uid(3)).method,[3]);assert.deepEqual(api.get(uid(3)).candidates,['unapproved fixture method']);
  assert.equal(mod.loadBank(f.bytes(sp))[0].courseKey,'M2-2');assert.deepEqual(f.data.reviewedBy,f.prior.reviewedBy);assert.deepEqual(f.data.items[1].registrationHold,f.prior.items[1].registrationHold);
});
test('the amendment also preserves a source without metadata overlay',t=>{const f=fixture(t,{overlay:false});assert.equal(mod.run(f.root).verified,2);});
test('a full native amendment with no renderer HOLD still has a mandatory successor',t=>{const f=fixture(t,{held:false});assert.equal(mod.run(f.root).verified,3);f.commitCandidate();f.save(cp,f.prior);f.commit('revert amended nonnegative compact');denied(f,/AMENDMENT_OBLIGATION_REQUIRED/);});
test('original v1 remains valid without an amendment claim',t=>{const f=priorFixture(t);assert.equal(mod.run(f.root).verified,2);});
test('slot changes outside the immutable approved successor are rejected',t=>{const f=fixture(t);f.data.items[2].given=[4];f.write();denied(f,/EXACT_SUCCESSOR_COMPACT/);});
test('reverting an issued approved vector to its old value is rejected by history',t=>{const f=fixture(t);f.data.items[0].given=[1];f.write();denied(f,/AMENDMENT_OBLIGATION_REQUIRED/);});
test('candidate promotion is rejected',t=>{const f=fixture(t);f.data.items[2].candidates=[];f.data.items[2].method=[4];f.write();denied(f,/EXACT_SUCCESSOR_COMPACT/);});
test('format changes are rejected',t=>{const f=fixture(t);f.data.items[2].format='서술형';f.write();denied(f,/EXACT_SUCCESSOR_COMPACT/);});
test('reviewer or independent-review scope cannot be upgraded',t=>{const f=fixture(t);f.data.reviewedBy.independentFullExamReview=true;f.write();denied(f,/EXACT_SUCCESSOR_COMPACT/);});
test('the full denominator cannot become a partial submission',t=>{const f=fixture(t);f.data.items.pop();f.write();denied(f,/FULL_DENOMINATOR/);});
test('prior HOLD may not be dropped',t=>{const f=fixture(t);delete f.data.items[1].registrationHold;f.write();denied(f,/OBLIGATION_REQUIRED/);});
test('prior HOLD details remain byte-for-byte unchanged',t=>{const f=fixture(t);f.data.items[1].registrationHold.nextAction='release';f.write();denied(f,/EXACT_SUCCESSOR_COMPACT/);});
test('a reconstructed prior with amended values is not an accepted literal v1 baseline',t=>{
  const f=fixture(t),fake=structuredClone(f.prior);fake.items[0].given=[4];f.save(cp,fake);const c=f.commit('counterexample fake prior');f.proof.priorValidatedCompactRef=f.ref(c,cp,true);f.signCarrier();denied(f,/PRIOR_V1:.*EXACT_ITEM/);
});
test('an exact immutable side-ref prior uses the existing v1 historical contract',t=>{
  const f=fixture(t),tree=f.git('rev-parse',f.priorValidatedCommit+'^{tree}').trim();
  const side=f.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit-tree',tree,'-p',f.baseCommit,'-m','synthetic immutable side prior').trim();
  assert.throws(()=>f.git('merge-base','--is-ancestor',side,'HEAD'));f.proof.priorValidatedCompactRef=f.ref(side,cp,true);f.signCarrier();assert.equal(mod.run(f.root).verified,2);
});
test('unapproved metadata cannot ride on the vector amendment',t=>{const f=fixture(t),bank=mod.loadBank(f.bytes(sp));bank[0].courseKey='M9-9';f.save(sp,f.js(bank));denied(f,/PRIOR_V1:.*LIVE_BYTES/);});
test('deleting the original durable metadata request remains rejected',t=>{const f=fixture(t);fs.unlinkSync(path.join(f.root,f.frozenRequestPath));denied(f,/PRIOR_V1:.*LIVE_UNAVAILABLE/);});
test('missing original v1 proof is rejected despite a complete new carrier',t=>{const f=fixture(t);fs.unlinkSync(path.join(f.root,f.prior.evidence[priorContract.GROUP].carrier.path));denied(f,/LIVE_UNAVAILABLE/);});
for(const key of ['copyPath','ownerPath','transportPath','rawPath','contactPath'])test('missing '+key+' is rejected before warm reuse',t=>{
  const f=fixture(t),previous=mod.build(f.root).index;assert.equal(previous.records.length,2);fs.unlinkSync(path.join(f.root,f[key]));denied(f,/LIVE_UNAVAILABLE/,{previous});
});
test('original native copy drift is rejected even with unchanged candidate vectors',t=>{const f=fixture(t),previous=mod.build(f.root).index;f.save(f.copyPath,Buffer.concat([f.bytes(f.copyPath),Buffer.from(' ')]));denied(f,/LIVE_BYTES/,{previous});});
test('current asset mutation is still rejected through original v1',t=>{const f=fixture(t),previous=mod.build(f.root).index;f.save(f.newAssets[0],'<svg/>');denied(f,/PRIOR_V1:.*LIVE_BYTES/,{previous});});
