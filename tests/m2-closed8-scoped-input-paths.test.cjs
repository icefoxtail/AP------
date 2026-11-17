'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {pathContractForTests:{dependencyPath,refShape}}=require('../tools/4slot/check-m2-closed8-current-ui-scoped.cjs');
const localCapture='/workspace/scratch/c9f85667609e/ap-release-recovery/root-public-problem24-final-ui43870043370-r2/original/E017-Q10-desktop-tile-01.png';
const ref=p=>({commit:'1'.repeat(40),path:p,gitBlobSha1:'2'.repeat(40),sha256:'3'.repeat(64),bytes:1});
test('actual Q10 diagnostic image path is not a repository dependency',()=>{
  assert.equal(dependencyPath(localCapture),false);
});
test('current Q10 independent proof remains a repository dependency',()=>{
  const p='docs/operations/m2-problem21-continuity-20261116/q10-independent-ui-v1.json';
  assert.equal(dependencyPath(p),true);assert.equal(dependencyPath(p,true),true);assert.equal(refShape(ref(p)).path,p);
});
test('an immutable or explicitly required absolute capture path still rejects',()=>{
  assert.throws(()=>refShape(ref(localCapture)),/M2_CURRENT8_SCOPE_PATH/);
  assert.throws(()=>dependencyPath(localCapture,true),/M2_CURRENT8_SCOPE_PATH/);
});
for(const p of ['docs/operations/../proof.json','docs//proof.json','archive/data/./proof.json','tools/invalid\\\\name.cjs','tests/invalid'+String.fromCharCode(10)+'name.json']){
  test('repository namespace rejects unsafe path '+JSON.stringify(p),()=>{
    assert.throws(()=>dependencyPath(p),/M2_CURRENT8_SCOPE_PATH/);
    assert.throws(()=>dependencyPath(p,true),/M2_CURRENT8_SCOPE_PATH/);
    assert.throws(()=>refShape(ref(p)),/M2_CURRENT8_SCOPE_PATH/);
  });
}
test('supported Korean and sidecar paths retain exact identity',()=>{
  for(const p of ['archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js','.archive-meta-register/evidence/review.json','.archive-meta-register/4slot-renderer-continuity/item.json']){
    assert.equal(dependencyPath(p),true);assert.equal(dependencyPath(p,true),true);assert.equal(refShape(ref(p)).path,p);
  }
});
test('nondependency path metadata stays outside the hydration queue',()=>{
  for(const p of ['screenshots/tile-01.png','https://example.invalid/output.png',undefined,null,17])assert.equal(dependencyPath(p),false);
});

const {historicalProofRef,HISTORICAL_ONLY_PROOFS}=require('../tools/4slot/check-m2-closed8-current-ui-scoped.cjs').pathContractForTests;
test('only the authenticated five historical documents omit current-path hydration',()=>{
  assert.equal(HISTORICAL_ONLY_PROOFS.length,5);
  assert.equal(new Set(HISTORICAL_ONLY_PROOFS.map(r=>r.path)).size,5);
  for(const r of HISTORICAL_ONLY_PROOFS)assert.equal(historicalProofRef({...r}),true);
});
test('historical commit blob digest and size substitutions fail closed',()=>{
  for(const r of HISTORICAL_ONLY_PROOFS)for(const key of ['commit','gitBlobSha1','sha256','bytes']){
    const changed={...r,[key]:key==='bytes'?r.bytes+1:(r[key][0]==='a'?'b':'a')+r[key].slice(1)};
    assert.throws(()=>historicalProofRef(changed),/M2_CURRENT8_SCOPE_HISTORICAL_PROOF_PIN/);
  }
});
test('unknown history and required current v2 proof receive no historical exemption',()=>{
  for(const p of ['docs/operations/unknown-history.json','docs/operations/m2-problem-image8-repair-20261116/independent-static-v2.json']){
    assert.equal(historicalProofRef(ref(p)),false);assert.equal(dependencyPath(p,true),true);
  }
});
