'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {fixture,loadContract,coldObligation,clone}=require('./helpers/m2s2-image8-fixture.cjs');
const unlink=(f,p)=>fs.unlinkSync(f.root+'/'+p);
test('warm validation rejects deletion of the image8 marker after initial success',t=>{
  const f=fixture(t),reader=f.contract.createObligationReader(f.root,f.hp);assert.deepEqual(f.run(0,f.replay,reader),[]);delete f.data[0].evidence.currentM2Image8Continuity;assert.deepEqual(reader(f.data[0]).errors,['M2_IMAGE8_OBLIGATION_REQUIRED']);
});
test('committed carrier deletion with live restoration fails in a new reader',t=>{
  const f=fixture(t),p=f.carrierPaths[0],raw=f.bytes(p);unlink(f,p);f.commit('synthetic committed carrier deletion');f.save(p,raw);assert.match(f.run().join('|'),/IMMUTABLE_REGULAR_FILE/);
});
test('marker and carrier removal cannot erase an ancestor obligation',t=>{
  const f=fixture(t);delete f.data[0].evidence.currentM2Image8Continuity;f.save(f.sources[0].compactPath,f.data[0]);unlink(f,f.carrierPaths[0]);f.commit('synthetic combined committed stripping');const cold=loadContract(f.pins);assert.deepEqual(cold.createObligationReader(f.root,f.hp)(f.data[0]).errors,['M2_IMAGE8_OBLIGATION_REQUIRED']);assert.deepEqual(coldObligation(f).errors,['M2_IMAGE8_OBLIGATION_REQUIRED']);
});
test('an unchanged-parent merge cannot simplify away the issued carrier ancestor',t=>{
  const f=fixture(t),issued=f.finalCommit;f.git('checkout','-qb','without-claim',f.current);f.git('merge','--no-ff','--no-commit','-s','ours',issued);f.git('commit','-qm','synthetic merge keeps tree without carrier');const d=clone(f.literals[0]),cold=loadContract(f.pins);assert.deepEqual(cold.createObligationReader(f.root,f.hp)(d).errors,['M2_IMAGE8_OBLIGATION_REQUIRED']);assert.deepEqual(coldObligation(f,d).errors,['M2_IMAGE8_OBLIGATION_REQUIRED']);
});
