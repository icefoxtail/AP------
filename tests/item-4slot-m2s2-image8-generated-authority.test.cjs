'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {fixture,clone,hash,generated}=require('./helpers/m2s2-image8-fixture.cjs');
// The receipt and pending request below model the public writer schemas. They
// are synthetic and do not establish that an actual registration was executed.
function advance(f,{pending=true,commit=false,changeRequest=()=>{},changeRow=()=>{},changeReceipt=()=>{}}={}){
  const source=f.sources[0],pin=f.pins.generatedBaselineRows[3],metadata=JSON.parse(f.bytes(generated.PATHS[0])),identity=JSON.parse(f.bytes(generated.PATHS[1])),m=metadata.records[3],id=identity.records[3],requestId='synthetic-image8-forward',rp='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+requestId+'.json',qp='.archive-meta-register/inbox/'+requestId+'.json';
  const req={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId,sourceArchiveFile:source.sourceArchiveFile,expectedSourceBlobSha1:source.currentSourceRef.gitBlobSha1,expectedQuestionCount:23,scope:'PARTIAL_UIDS',approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-existing-native'},registryChanges:[],items:[{questionUid:pin.questionUid,sourceOrdinal:4,before:{curriculum:m.curriculum},after:{curriculum:m.curriculum}}]};
  changeRequest(req);if(pending){f.save(qp,req);f.commit('synthetic pending immutable approved request');}
  Object.assign(m,{sourceFingerprint:pin.currentSourceFingerprint,contentFingerprint:pin.currentContentFingerprint,metadataRevision:'synthetic-registered-cursor',approvalEvidence:[...m.approvalEvidence,rp]});id.sourceFingerprint=pin.currentSourceFingerprint;changeRow(m,id);
  const receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId,requestSha256:hash(req),sourceArchiveFile:source.sourceArchiveFile,sourceBlobSha1:source.currentSourceRef.gitBlobSha1,sourceRawSha256:source.currentSourceRef.sha256,metadataRegistrationStatus:'REGISTERED',scope:'PARTIAL_UIDS',expectedQuestionCount:23,totalQuestions:1,partialUidCount:1,approval:clone(req.approval),registryChanges:clone(req.registryChanges),appliedRecords:[clone(m)],appliedIdentityRecords:[clone(id)]};changeReceipt(receipt);
  f.save(generated.PATHS[0],metadata);f.save(generated.PATHS[1],identity);f.save(rp,receipt);
  if(commit){if(pending)fs.unlinkSync(f.root+'/'+qp);f.commit('synthetic writer committed generated2 and issued receipt');}
  return {metadata,identity,request:req,receipt,rp,qp};
}
test('an exact receipt cannot authorize changed selected metadata meaning',t=>{
  const f=fixture(t);advance(f,{commit:true,changeRow:m=>m.curriculum='unapproved-new-meaning'});assert.match(f.run().join('|'),/SELECTED_MEANING_OR_TUPLE_CHANGED/);
});
test('the original native evidence list cannot be removed during cursor progress',t=>{
  const f=fixture(t);advance(f,{commit:true,changeRow:m=>m.approvalEvidence=m.approvalEvidence.slice(-1)});assert.match(f.run().join('|'),/CURSOR_RECEIPT_REQUIRED/);
});
test('an issued row must use the exact current source fingerprint',t=>{
  const f=fixture(t);advance(f,{commit:true,changeRow:(m,id)=>{m.sourceFingerprint='b'.repeat(64);id.sourceFingerprint=m.sourceFingerprint;}});assert.match(f.run().join('|'),/CURSOR_SOURCE_FINGERPRINT/);
});
test('committed metadata with a subsequently deleted receipt fails even if restored live',t=>{
  const f=fixture(t),x=advance(f,{commit:true}),raw=f.bytes(x.rp);fs.unlinkSync(f.root+'/'+x.rp);f.commit('synthetic lost issued receipt');f.save(x.rp,raw);assert.match(f.run().join('|'),/CURSOR_NOT_EXACT_ISSUED_ROW/);
});
test('full receipt denominator and unique applied rows cannot be reduced',t=>{
  const f=fixture(t);advance(f,{commit:true,changeReceipt:r=>r.totalQuestions=2});assert.match(f.run().join('|'),/CURSOR_NOT_EXACT_ISSUED_ROW/);
});
