import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeArchiveMetaBacklog} from '../tools/ci/archive-meta-backlog-overview.mjs';

const source='original/middle/m1/2mid/fixture.js';
function fixture() {
  return {
    requests:[{requestId:'fixture-1',sourceArchiveFile:source,expectedSourceBlobSha1:'a'.repeat(40),approval:{metadataReviewed:true},items:[{sourceOrdinal:1,after:{templateKey:'TPL_1'}}]}],
    provisionalReceipts:{'fixture-1':{metadataApprovalStatus:'USER_APPROVED_PENDING_SUPPLEMENT',metadataVerificationStatus:'NOT_VERIFIED',studentAccess:{status:'PASS'}}},
    sources:{[source]:{exists:true,blob:'a'.repeat(40)}},
    autoState:{pending:{'fixture#1':{sourceArchiveFile:source,sourceOrdinal:1,lastReasons:['IDENTITY_SOURCE_FINGERPRINT_MISMATCH']}}},
  };
}
test('provisional receipts never imply registration',()=>{
  const r=summarizeArchiveMetaBacklog(fixture());
  assert.equal(r.summary.registrationProven,0);
  assert.equal(r.requests[0].registrationProven,false);
  assert.equal(r.requests[0].nextAction,'VERIFY_UID_SOURCE_REBIND');
});
test('independent review cannot be inferred from source SHA',()=>{
  const f=fixture();
  f.requests[0].approval.metadataReviewed=false;
  f.requests[0].items[0].after={};
  f.autoState.pending={};
  const r=summarizeArchiveMetaBacklog(f);
  assert.equal(r.requests[0].expectedSourceBlobMatchesCurrent,true);
  assert.equal(r.requests[0].nextAction,'REVIEW_MISSING_METADATA_EVIDENCE');
});
test('duplicate request ID is not silently collapsed',()=>{
  const f=fixture();f.requests.push(structuredClone(f.requests[0]));
  assert.throws(()=>summarizeArchiveMetaBacklog(f),/DUPLICATE_REQUEST_ID/);
});
