'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {fixture,clone,hash}=require('./helpers/m2s2-image8-fixture.cjs');
test('complete row coverage is required even with all eight figure claims',t=>{
  const f=fixture(t,{changeProof:p=>p[0].rows.pop()});assert.match(f.run().join('|'),/ROW_COVERAGE/);
});
test('immutable prior vectors and fallback candidates cannot be dropped',t=>{
  const f=fixture(t);f.data[0].items[0].candidates=[];assert.match(f.run().join('|'),/HISTORY_REQUIRED|EXACT_LITERAL_COMPACT/);
});
test('all returned original native and negative evidence remains mandatory',t=>{
  const f=fixture(t);fs.unlinkSync(f.root+'/'+f.historicalRefs[0][1].path);assert.match(f.run().join('|'),/LIVE_UNAVAILABLE/);
});
test('static copies must equal original Git evidence and stay in current HEAD',t=>{
  const f=fixture(t);f.save(f.staticCopies[0],{fake:true});assert.match(f.run().join('|'),/LIVE_BYTES/);
});
test('current image bytes stay exact despite an unchanged source pointer',t=>{
  const f=fixture(t);f.save(f.selected[0].newAssetPath,'<svg/>');assert.match(f.run().join('|'),/LIVE_BYTES/);
});
