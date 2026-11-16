'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture,run}=require('./helpers/m2s2-repaired-metadata-fixture.cjs');
const denied=f=>{const x=run(f).index;assert.equal(x.records.length,0,JSON.stringify(x.pending));assert.ok(x.pending.some(r=>/M2_REPAIRED_METADATA_/.test(r.reason)),JSON.stringify(x.pending));};
for(const fault of ['registry-change','not-final-qa','extra-selected-row','native-link'])test('original issued request rejects '+fault,t=>{
 const f=fixture(t,{changeRequest:r=>{
  if(fault==='registry-change')r.registryChanges=[{kind:'ADD',key:'UNAPPROVED'}];
  if(fault==='not-final-qa')r.approval.type='REVIEW2';
  if(fault==='extra-selected-row')r.items.push(structuredClone(r.items[0]));
  if(fault==='native-link')r.items[0].sourceReview.reviewPath=r.items[0].sourceReview.reviewPath.replace('E999','E998');
 }});denied(f);
});
for(const fault of ['not-issued','source-drift','runtime-drift','duplicate-identity','unreviewed-native-value','native-source-drift'])test('immutable issued receipt rejects '+fault,t=>{
 const f=fixture(t,{changeReceipt:r=>{
  if(fault==='not-issued')r.metadataRegistrationStatus='PENDING';
  if(fault==='source-drift')r.sourceRawSha256='0'.repeat(64);
  if(fault==='runtime-drift')r.runtimeRecords[0].tagStatus='draft';
  if(fault==='duplicate-identity')r.appliedIdentityRecords[1]=structuredClone(r.appliedIdentityRecords[0]);
  if(fault==='unreviewed-native-value')r.appliedRecords[0].curriculum='2022';
  if(fault==='native-source-drift')r.fingerprintRepairs[0].sourceReview.reviewedSourceSha256='0'.repeat(64);
 }});denied(f);
});
test('historical evidence coverage cannot omit the original negative record',t=>{
 const f=fixture(t,{changeProof:p=>{p.historicalEvidenceRefs=p.historicalEvidenceRefs.filter(r=>!r.path.endsWith('raw-root.json'));}});denied(f);
});
