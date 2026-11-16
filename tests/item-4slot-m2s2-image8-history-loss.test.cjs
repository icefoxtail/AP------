'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {fixture,loadContract,clone}=require('./helpers/m2s2-image8-fixture.cjs');
const unlink=(f,p)=>fs.unlinkSync(f.root+'/'+p);
test('current source deletion cannot be hidden by restoring its live file',t=>{
  const f=fixture(t),p=f.sources[0].sourcePath,raw=f.bytes(p);unlink(f,p);f.commit('synthetic committed source loss');f.save(p,raw);assert.match(f.run().join('|'),/IMMUTABLE_REGULAR_FILE/);
});
test('original negative evidence deleted from HEAD remains mandatory',t=>{
  const f=fixture(t),p=f.historicalRefs[0].find(r=>r.path.endsWith('original-negative.json')).path,raw=f.bytes(p);unlink(f,p);f.commit('synthetic negative deletion');f.save(p,raw);assert.match(f.run().join('|'),/IMMUTABLE_REGULAR_FILE/);
});
test('current UI capture deleted from HEAD cannot be restored only on disk',t=>{
  const f=fixture(t),p=f.uiFiles.find(r=>r.role==='ORIGINAL_SELECTED_CAPTURE').path,raw=f.bytes(p);unlink(f,p);f.commit('synthetic capture deletion');f.save(p,raw);assert.match(f.run().join('|'),/IMMUTABLE_REGULAR_FILE/);
});
test('pass-local immutable inventory rejects a concurrent HEAD transition',t=>{
  const f=fixture(t),reader=f.contract.createObligationReader(f.root,f.hp);assert.deepEqual(reader(f.data[0]).errors,[]);f.commit('synthetic unrelated HEAD advance');assert.deepEqual(reader(f.data[0]).errors,['M2_IMAGE8_HEAD_DRIFT']);
});
