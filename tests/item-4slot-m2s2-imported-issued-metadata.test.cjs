'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture,run,mod,contract,stable,sp,cp,uid}=require('./helpers/m2s2-imported-metadata-fixture.cjs');
const denied=f=>{const r=run(f);assert.equal(r.index.records.length,0);assert.ok(r.index.pending.some(x=>/M2_IMPORTED_METADATA_/.test(x.reason)),JSON.stringify(r.index.pending));return r;};
test('issued metadata successor preserves literal full vector, candidate, HOLD and old source header',t=>{
  const f=fixture(t),r=run(f);assert.equal(r.index.records.length,2);assert.equal(r.index.pending.length,1);assert.equal(r.index.pending[0].ordinal,2);
  assert.deepEqual(f.data.items,f.literal.items);assert.deepEqual(f.data.reviewedBy,f.literal.reviewedBy);assert.equal(f.data.sourceGitBlobSha,f.literal.sourceGitBlobSha);
  assert.notEqual(f.data.sourceGitBlobSha,mod.blob(f.bytes(sp)));assert.deepEqual(f.data.items[2].candidates,['unapproved fixture method']);
  const original=structuredClone(f.data);delete original.evidence[contract.GROUP];assert.deepEqual(original,f.literal);
});
test('the old amendment without opt-in still rejects changed whole source bytes',t=>{const f=fixture(t);f.save(cp,f.literal);const r=run(f);assert.equal(r.index.records.length,0);assert.ok(r.index.pending.some(x=>/OBLIGATION_REQUIRED/.test(x.reason)));});
for(const field of ['content','choices','answer','solution','imageAlt','primaryMethod'])test('truthfully rebound extra '+field+' is not a metadata-only addition',t=>{const f=fixture(t,{changeBank:b=>{b[2][field]=field==='choices'?['Changed']:String(b[2][field]||'')+' changed';}});denied(f);});
test('a changed unselected peer remains outside the issued request',t=>{const f=fixture(t,{changeBank:b=>{b[0].reviewStatus='reviewed_pass';}});denied(f);});
test('a held peer cannot receive even the four allowed keys',t=>{const f=fixture(t,{changeBank:b=>Object.assign(b[1],{courseKey:'M2-2',reviewStatus:'reviewed_pass',tagConfidence:'approved_final_qa',tagStatus:'reviewed_pass'})});denied(f);});
test('new status values must be the exact issued values',t=>{const f=fixture(t,{changeBank:b=>{b[2].tagStatus='draft';}});denied(f);});
test('current asset bytes cannot be resealed independently of the historical source',t=>{const f=fixture(t,{changeAssets:f=>f.save(f.oldAssets[2],'<svg xmlns="http://www.w3.org/2000/svg"><circle r="9"/></svg>')});denied(f);});
