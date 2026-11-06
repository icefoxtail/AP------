const test=require('node:test');
const assert=require('node:assert/strict');
const load=import('../tools/ci/archive-meta-backlog-overview.mjs');
const source='original/middle/m1/2mid/fixture.js';
function fixture(){
return {
requests:[{requestId:'a',sourceArchiveFile:source,expectedSourceBlobSha1:'a'.repeat(40),
approval:{metadataReviewed:true},items:[{sourceOrdinal:1,after:{templateKey:'TPL'}}]}],
provisionalReceipts:{a:{metadataApprovalStatus:'USER_APPROVED_PENDING_SUPPLEMENT',
metadataVerificationStatus:'NOT_VERIFIED',studentAccess:{status:'PASS'}}},
sources:{[source]:{exists:true,blob:'a'.repeat(40)}},
autoState:{pending:{'a#1':{sourceArchiveFile:source,sourceOrdinal:1,
lastReasons:['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']}}}};
}
test('historical provisional receipt is not registered',async()=>{
const {summarizeArchiveMetaBacklog:f}=await load;
const r=f(fixture());
assert.equal(r.summary.registrationEvidenceStatus,'NOT_EVALUATED');
assert.equal(r.requests[0].nextAction,'VERIFY_UID_SOURCE_REBIND');
});
test('matching source SHA does not invent missing review',async()=>{
const {summarizeArchiveMetaBacklog:f}=await load;
const x=fixture();x.requests[0].approval.metadataReviewed=false;x.requests[0].items[0].after={};
assert.equal(f(x).requests[0].nextAction,'REVIEW_MISSING_METADATA_EVIDENCE');
});
test('duplicate request IDs remain an error',async()=>{
const {summarizeArchiveMetaBacklog:f}=await load;
const x=fixture();x.requests.push(x.requests[0]);
assert.throws(()=>f(x),/DUPLICATE_REQUEST_ID/);
});
