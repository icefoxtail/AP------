'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {fixture,clone,hash}=require('./helpers/m2s2-image8-fixture.cjs');
test('synthetic closed IMAGE8 preserves both full priors and original pending UI values',t=>{
  const f=fixture(t);assert.deepEqual(f.run(0),[]);assert.deepEqual(f.run(1),[]);
  assert.equal(f.data[0].items.length+f.data[1].items.length,47);
  assert.deepEqual(f.data.map(d=>hash(d.items)),f.literals.map(d=>hash(d.items)));
});
test('a prior validator rejection cannot be replaced by a successful image review',t=>{
  const f=fixture(t);assert.match(f.run(0,()=>({errors:['ORIGINAL_NATIVE_OR_NEGATIVE_REJECTED']})).join('|'),/HISTORICAL_CHAIN/);
});
test('truthfully bound current source cannot change protected content beside image',t=>{
  const f=fixture(t,{changeCurrentBank:(bank,n)=>{if(n===0)bank[3].content+=' changed';}});assert.match(f.run().join('|'),/EXACT_IMAGE_POINTER/);
});
test('truthfully bound current source cannot change an unselected question',t=>{
  const f=fixture(t,{changeCurrentBank:(bank,n)=>{if(n===0)bank[0].answer='B';}});assert.match(f.run().join('|'),/UNSELECTED_WHOLE_QUESTION/);
});
