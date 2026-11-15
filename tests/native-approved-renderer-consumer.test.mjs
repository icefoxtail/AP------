import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {verifyChangedUidConsumerApproval,renderSummary} from '../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';

const request=()=>({schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'renderer-existing',examUid:'fixture',
  sourceArchiveFile:'original/middle/m1/2mid/fixture.js',expectedSourceBlobSha1:'1'.repeat(40),expectedQuestionCount:3,scope:'PARTIAL_UIDS',
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'existing approval transport',rendererPreservation:{schemaVersion:'archive-native-approved-renderer-preservation-v1'}},
  items:[{questionUid:'uid-1',sourceOrdinal:1,preservationMode:'INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY',before:{},after:{}}]});
function check(t,doc){const root=fs.mkdtempSync(path.join(os.tmpdir(),'renderer-consumer-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.writeFileSync(path.join(root,'request.json'),JSON.stringify(doc));return verifyChangedUidConsumerApproval({root,requestPaths:['request.json']});}

test('renderer preservation empty patches require a real replay and never pass by unchanged skipping',t=>{
  const result=check(t,request());
  assert.equal(result.status,'FAIL','missing real native receipt and Consumer cannot pass');
  assert.equal(result.counts.changed,1);assert.equal(result.counts.skippedUnchanged,0);assert.equal(result.counts.passed,0);
  assert.equal(result.exams[0].kind,'native-approval-preservation');
  assert.match(renderSummary(result),/Preservation operations|Changed-UID consumer verification/);
});
for(const [name,mutate] of [
  ['unknown schema',r=>r.approval.rendererPreservation.schemaVersion='invented'],
  ['missing explicit partial selection',r=>delete r.scope],
  ['mixed source-only mode',r=>r.approval.sourceRebind={}],
  ['mixed identity mode',r=>r.registrationMode='IDENTITY_FINGERPRINT_ONLY'],
  ['new approval values',r=>r.items[0].after={tagStatus:'reviewed_pass'}],
  ['ordinary reassessment mixed in',r=>r.items[0].sourceReview={}],
  ['foreign ordinal',r=>r.items[0].sourceOrdinal=4],
  ['duplicate UID and ordinal',r=>r.items.push({...r.items[0]})],
  ['empty selection',r=>r.items=[]],
  ['different approval type',r=>r.approval.type='REVIEW2'],
])test('renderer Consumer refuses '+name+' before treating it as preserved approval',t=>{
  const r=request();mutate(r);const result=check(t,r);assert.equal(result.status,'FAIL');
  assert.equal(result.counts.passed,0);assert(result.failures.some(f=>f.reason==='INVALID_REQUEST'),JSON.stringify(result.failures));
});
