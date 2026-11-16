'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {fixture,clone,hash}=require('./helpers/m2s2-image8-fixture.cjs');
test('current source executable mode is not a regular immutable input',t=>{
  const f=fixture(t);f.git('update-index','--chmod=+x',f.sources[0].sourcePath);f.git('commit','-qm','synthetic executable source');assert.match(f.run().join('|'),/IMMUTABLE_REGULAR_FILE/);
});
test('current asset executable mode cannot be hidden by restoring live bytes',t=>{
  const f=fixture(t);f.git('update-index','--chmod=+x',f.selected[0].newAssetPath);f.git('commit','-qm','synthetic executable asset');assert.match(f.run().join('|'),/IMMUTABLE_REGULAR_FILE/);
});
test('unchanged renderer inputs cannot be changed under a historical UI proof',t=>{
  const f=fixture(t),p=f.dependencyPaths.find(p=>p.includes('input-'));f.save(p,'different renderer');f.commit('synthetic renderer drift');assert.match(f.run().join('|'),/UI_CURRENT_TREE_BYTES/);
});
test('an added unrelated scope or relabeled review header is rejected',t=>{
  const f=fixture(t);f.data[0].reviewedBy.agent='new-unreviewed-author';assert.match(f.run().join('|'),/EXACT_LITERAL_COMPACT/);
});
