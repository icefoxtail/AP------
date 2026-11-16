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
test('both committed generated HEAD files can advance after exact issued cursor rows',t=>{
  const f=fixture(t);advance(f,{commit:true});assert.deepEqual(f.run(0),[]);assert.deepEqual(f.run(1),[]);
});
test('uncommitted write requires the exact complete pending HEAD request',t=>{
  const f=fixture(t);advance(f);assert.deepEqual(f.run(),[]);
});
test('a fabricated live-only receipt without a HEAD request is rejected',t=>{
  const f=fixture(t);advance(f,{pending:false});assert.match(f.run().join('|'),/CURSOR_NOT_EXACT_ISSUED_ROW/);
});
test('a pending request that mutates registry authority cannot authorize this forward path',t=>{
  const f=fixture(t);advance(f,{changeRequest:r=>r.registryChanges=[{action:'ADD'}]});assert.match(f.run().join('|'),/CURSOR_NOT_EXACT_ISSUED_ROW/);
});
