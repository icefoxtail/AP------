'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {validateMeta,validateProjection,audit,sha256}=require('../archive/tools/generated-meta-retention-gate.cjs');
const meta={
 rpmL1:'H1-RPM-L1-KEY',rpmL2:'H1-RPM-L2-KEY',rpmL3:'H1-RPM-L3-KEY',
 rpmL4:'GEN-EXT-L4-KEY',rpmL4Namespace:'GENERATED_EXT_L4',
 generatedL4RegistryRef:'archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/registry.json',
 crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',
 difficultyBucket:3,level:'중',problemTypeKey:null,templateKey:null,
 metaDebt:{problemTypeKey:'mapping adjudication required',templateKey:'template review required'}
};
const SHA='a'.repeat(64);
const valid=()=>({uid:'ALITE-NEW-001',approvedMeta:meta,indexMeta:meta,consumerMeta:meta,
 questionMeta:meta,sourceMeta:meta,
 digests:{index:sha256(meta),consumer:sha256(meta),question:sha256(meta),source:sha256(meta),authority:sha256(meta)},
 evidence:{index:SHA,consumer:SHA,authority:SHA}});
test('existing 323 approvals stay exempt while 23 new Palma records pass full Meta parity',()=>{
 const r=audit(path.resolve(__dirname,'..'));
 assert.equal(r.status,'PASS_NEW_UID_SCOPE_ONLY',r.errors.join('\n'));
 assert.equal(r.legacyExemptNotRecertified,323);
 assert.equal(r.newUidChecked,23);
 assert.equal(r.total,346);
});
test('fully evidenced future UID passes projection-only gate',()=>{
 assert.deepEqual(validateMeta(meta),[]);
 assert.deepEqual(validateProjection(valid()),[]);
});
test('missing Meta differs from explicit NONE and empty arrays',()=>{
 for(const field of ['crossConceptKeys','conditionKeys','integrationPattern','rpmL2','rpmL4']){
  const v={...meta};delete v[field];
  assert.notEqual(validateMeta(v).length,0,field);
 }
});
test('1-5 difficulty, L4 provenance and mapping holds are enforced',()=>{
 for(const patch of [{difficultyBucket:0},{difficultyBucket:6},{difficultyBucket:'3'},
   {rpmL4Namespace:'INVALID'},{generatedL4RegistryRef:''},
   {problemTypeKey:null,metaDebt:{}},{templateKey:undefined}]){
  assert.ok(validateMeta({...meta,...patch}).length);
 }
});
test('any projection mismatch, missing digest or missing review evidence is FAIL',()=>{
 const a=valid();a.consumerMeta={...meta,conditionKeys:['FAKE']};
 assert.ok(validateProjection(a).some(x=>x.includes('consumerMeta:META_PARITY')));
 const b=valid();b.digests.index='0'.repeat(64);
 assert.ok(validateProjection(b).some(x=>x.includes('index:META_SHA')));
 const c=valid();c.evidence.authority=undefined;
 assert.ok(validateProjection(c).some(x=>x.includes('META_REVIEW_EVIDENCE_REQUIRED')));
});


test('existing source-backed RPM draft is represented honestly and never falsified as LOCKED',()=>{
 const draft={...meta,rpmL4Namespace:'RPM_EXISTING_DRAFT',
  rpmPrimaryRecordId:'H1-RPM-234',
  rpmDraftAuthorityRef:'archive/data/meta-foundation/compiled/taxonomy_registry.json',
  rpmDraftAuthoritySha256:'b'.repeat(64)};
 assert.deepEqual(validateMeta(draft),[]);
 assert.ok(validateMeta({...draft,rpmPrimaryRecordId:''}).some(x=>x.includes('rpmPrimaryRecordId')));
 assert.ok(validateMeta({...draft,rpmDraftAuthorityRef:'alive/unverified.md'}).some(x=>x.includes('rpmDraftAuthorityRef')));
 assert.ok(validateMeta({...draft,rpmDraftAuthoritySha256:''}).some(x=>x.includes('rpmDraftAuthoritySha256')));
});
