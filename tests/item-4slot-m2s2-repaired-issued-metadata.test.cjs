'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture,run,mod,contract,stable,sp,cp}=require('./helpers/m2s2-repaired-metadata-fixture.cjs');
const denied=f=>{const x=run(f).index;assert.equal(x.records.length,0,JSON.stringify(x.pending));assert.ok(x.pending.some(r=>/M2_(?:REPAIRED_METADATA|CURRENT_REPAIR)_/.test(r.reason)),JSON.stringify(x.pending));return x;};
test('two issued metadata additions preserve the literal repaired vector and historical negative',t=>{
 const f=fixture(t),raw=f.bytes(sp),negative=f.bytes(f.rootPath),x=run(f).index;
 assert.equal(x.counts.items,5);assert.equal(x.records.length,5);assert.equal(x.pending.length,0);
 const without=structuredClone(f.data);delete without.evidence[contract.GROUP];assert.deepEqual(without,f.literal);
 assert.equal(f.data.sourceGitBlobSha,f.literal.sourceGitBlobSha);assert.notEqual(f.data.sourceGitBlobSha,mod.blob(raw));
 assert.deepEqual(f.data.items,f.literal.items);assert.deepEqual(f.data.reviewedBy,f.literal.reviewedBy);
 assert.equal(f.data.evidence.currentM2RepairClosure.carrier.sha256,f.literal.evidence.currentM2RepairClosure.carrier.sha256);
 assert.equal(mod.run(f.root,{write:true}).verified,5);assert.equal(mod.run(f.root,{check:true}).changed,false);
 assert.equal(mod.verify(x).verified,5);assert.deepEqual(f.bytes(sp),raw);assert.deepEqual(f.bytes(f.rootPath),negative);
});
test('ordinary repair live equality still rejects the issued source before explicit successor publication',t=>{
 const f=fixture(t),old=structuredClone(f.literal);f.save(cp,old);
 const x=denied(f);assert.ok(x.pending.some(r=>/OBLIGATION_REQUIRED/.test(r.reason)));
 const hp={...f.hp,m2ContinuityObligation:require('../tools/4slot/m2s2-current-continuity.cjs').createObligationReader(f.root,f.hp)(old)};
 const errors=require('../tools/4slot/m2s2-current-repair-closure.cjs').validateFile(f.root,old,hp,require('../tools/4slot/m2s2-current-continuity.cjs').validateHistoricalFile);
 assert.deepEqual(errors,['M2_CURRENT_REPAIR_LIVE_BYTES']);
});
for(const field of ['content','solution','imageAlt','primaryMethod'])test('resealed source cannot add '+field+' under issued metadata transport',t=>{
 const f=fixture(t,{changeBank:b=>{b[1][field]=String(b[1][field]||'')+' unapproved';}});denied(f);
});
test('the repaired negative UID is excluded from metadata additions',t=>{
 const f=fixture(t,{changeBank:b=>Object.assign(b[2],{courseKey:'M2-2',reviewStatus:'reviewed_pass',tagConfidence:'approved_final_qa',tagStatus:'reviewed_pass'})});denied(f);
});
test('a third unselected UID cannot acquire the four allowed fields',t=>{
 const f=fixture(t,{changeBank:b=>Object.assign(b[4],{courseKey:'M2-2',reviewStatus:'reviewed_pass',tagConfidence:'approved_final_qa',tagStatus:'reviewed_pass'})});denied(f);
});
test('resealed asset bytes still must equal the repaired historical snapshot',t=>{
 const f=fixture(t,{changeAssets:f=>f.save(f.currentAssets[1],'<svg xmlns="http://www.w3.org/2000/svg"><circle r="9"/></svg>')});denied(f);
});
for(const [role,mode] of [['source','100755'],['asset','120000']])test('current HEAD '+role+' mode must remain a regular non-executable Git file',t=>{
 const f=fixture(t);f.commitCurrent();
 const target=role==='source'?sp:f.proof.currentAssets[0].path,raw=f.bytes(target),oid=f.git('rev-parse','HEAD:'+target).trim();
 f.git('update-index','--cacheinfo',mode,oid,target);
 // Commit the corrupted index directly: git add would restore the live mode.
 f.git('commit','--allow-empty','-qm','synthetic HEAD mode corruption');
 assert.deepEqual(f.bytes(target),raw);assert.equal(require('node:fs').lstatSync(require('node:path').join(f.root,target)).isFile(),true);
 const x=denied(f);assert.ok(x.pending.some(r=>r.reason==='M2_REPAIRED_METADATA_CURRENT_HEAD_REGULAR_FILE'),JSON.stringify(x.pending));
});
