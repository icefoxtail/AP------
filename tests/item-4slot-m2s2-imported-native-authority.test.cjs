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
test('the owner full compact cannot change another metadata or evidence header',t=>{const f=fixture(t);f.main.reviewedBy.sampled=[1,2,3];f.signOwner();denied(f,/MAIN_NON_VECTOR_HEADER/);});
test('raw owner contact assets must join exact Git-bound question assets',t=>{const f=fixture(t);f.contact.rows[0].currentAsset=structuredClone(f.contact.rows[1].currentAsset);f.raw.rows[0].currentAssetSha256=f.contact.rows[0].currentAsset.rawSha256;f.signOwner();denied(f,/OWNER_CONTACT_ASSET/);});
test('raw owner observation cannot omit actual image reading',t=>{const f=fixture(t);f.raw.rows[0].actualBeforeAndCurrentImagesViewed=false;f.signOwner();denied(f,/OWNER_ACTUAL_READ/);});
test('raw duplicate observations cannot replace a distinct image pair',t=>{const f=fixture(t);f.contact.rows[1]=structuredClone(f.contact.rows[0]);f.raw.rows[1]=structuredClone(f.raw.rows[0]);f.signOwner();denied(f,/DUPLICATE_OBSERVATION/);});
test('a raw observation identity cannot be substituted',t=>{const f=fixture(t);f.contact.rows[0].questionUid=uid(999);f.raw.rows[0].questionUid=uid(999);f.signOwner();denied(f,/OWNER_CONTACT_IDENTITY/);});
test('exact native source entries are required in the owner amendment',t=>{const f=fixture(t);f.transport.rows[0].changes[0].nativeEntries[0].quote='fabricated';f.signOwner();denied(f,/TRANSPORT_ORIGINAL_ENTRIES/);});
test('owner cannot claim a new semantic judgment',t=>{const f=fixture(t);f.transport.rows[0].newSemanticJudgment=true;f.signOwner();denied(f,/TRANSPORT_ITEM_BINDING/);});
test('native fallback provenance cannot be substituted',t=>{const f=fixture(t);f.owner.existingFallbacksPreserved[0].originalAuthorItemSha256='0'.repeat(64);f.transport.existingFallbacksPreserved=structuredClone(f.owner.existingFallbacksPreserved);f.signOwner();denied(f,/FALLBACK_AUTHORITY/);});
test('unapproved fallback cannot be reclassified as an approved candidate',t=>{const f=fixture(t);f.owner.existingFallbacksPreserved[0].candidateApproval='GRANTED';f.transport.existingFallbacksPreserved=structuredClone(f.owner.existingFallbacksPreserved);f.signOwner();denied(f,/FALLBACK_AUTHORITY/);});
test('fallback must retain its explicit existing-value decision',t=>{const f=fixture(t);f.owner.existingFallbacksPreserved[0].decision='NEW_APPROVAL';f.transport.existingFallbacksPreserved=structuredClone(f.owner.existingFallbacksPreserved);f.signOwner();denied(f,/FALLBACK_AUTHORITY/);});
test('undeclared or extra native amendment rows are rejected',t=>{const f=fixture(t);f.transport.rows.push(structuredClone(f.transport.rows[0]));f.signOwner();denied(f,/TRANSPORT_ITEM|EXACT_DELTA_PARTITION/);});
test('carrier cannot change the native amendment partition',t=>{const f=fixture(t);f.proof.changedRows[0].sourceQuestionNo='99';f.signCarrier();denied(f,/EXACT_DELTA_PARTITION/);});
test('a different original native reference cannot stand in for approved c286-like authority',t=>{const f=fixture(t);f.proof.nativeFourSlotRef=f.ref(f.nativeCommit,f.nativeRef.path,true);f.signCarrier();denied(f,/NATIVE_REFERENCE/);});
test('a current native quote is revalidated after all authority references are truthfully rebound',t=>{const f=fixture(t);f.native.items[0].slots.given[0].quote='absent literal phrase';f.signNative();denied(f,/NATIVE_CURRENT_VALIDATION/);});
test('a review change cannot reuse the prior ROOT acceptance hash',t=>{const f=fixture(t);f.review.extra='unaccepted revision';f.signNative({updateAcceptance:false});denied(f,/ROOT_NATIVE_ACCEPTANCE/);});
test('ROOT acceptance cannot be replaced with a same-author sample',t=>{const f=fixture(t);f.accepted.sampleReviewer=f.accepted.owner;f.signNative();denied(f,/ROOT_NATIVE_ACCEPTANCE/);});
test('native UID replacement is rejected even with re-signed acceptance',t=>{const f=fixture(t);f.native.items[0].questionUid=uid(99);f.signNative();denied(f,/NATIVE_ITEM/);});
test('native source ordinal replacement cannot be hidden by row order',t=>{const f=fixture(t);f.native.items[0].sourceOrdinal=3;f.signNative();denied(f,/NATIVE_CURRENT_VALIDATION|NATIVE_ITEM/);});
test('original native Git object deletion is rejected cold and warm',t=>{const f=fixture(t),previous=mod.build(f.root).index,r=f.proof.nativeFourSlotRef;const oid=f.git('rev-parse',r.commit+':'+r.path).trim();fs.unlinkSync(path.join(f.root,'.git','objects',oid.slice(0,2),oid.slice(2)));denied(f,/IMMUTABLE_UNAVAILABLE/,{previous});const x=cold(f);assert.equal(x.records.length,0);assert(x.pending.some(p=>/IMMUTABLE_UNAVAILABLE/.test(p.reason)));});
test('an unmerged owner compact is rejected even with exact content',t=>{const f=fixture(t),saved=new Map([f.carrierPath,f.copyPath,f.ownerPath,f.transportPath,f.rawPath,f.contactPath].map(p=>[p,f.bytes(p)]));f.git('reset','--hard',f.priorValidatedCommit);f.save(cp,f.data);for(const [p,b]of saved)f.save(p,b);denied(f,/UNMERGED_REFERENCE/);});
test('committed removal of markers, native copy and all new proofs remains rejected cold and warm',t=>{
  const f=fixture(t),previous=mod.build(f.root).index;f.commitCandidate();f.save(cp,f.prior);for(const p of [f.carrierPath,f.copyPath,f.ownerPath,f.transportPath,f.rawPath,f.contactPath])fs.unlinkSync(path.join(f.root,p));f.commit('remove issued amendment and restore old v1');
  denied(f,/AMENDMENT_OBLIGATION_REQUIRED/,{previous});const x=cold(f);assert.equal(x.records.length,0);assert(x.pending.some(p=>/AMENDMENT_OBLIGATION_REQUIRED/.test(p.reason)));
});
test('committed empty carrier cannot erase the amendment obligation',t=>{const f=fixture(t);f.commitCandidate();f.save(cp,f.prior);f.save(f.carrierPath,{});f.commit('replace amendment carrier with empty object');denied(f,/AMENDMENT_OBLIGATION_REQUIRED/);});
test('merge-parent history retains the amendment obligation after an otherwise clean reversion',t=>{
  const f=fixture(t),issued=f.commitCandidate();f.git('reset','--hard',f.priorValidatedCommit);const other=f.git('rev-parse','HEAD').trim(),tree=f.git('rev-parse','HEAD^{tree}').trim();
  const merged=f.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit-tree',tree,'-p',other,'-p',issued,'-m','synthetic merge retaining prior tree').trim();f.git('reset','--hard',merged);denied(f,/AMENDMENT_OBLIGATION_REQUIRED/);
});
