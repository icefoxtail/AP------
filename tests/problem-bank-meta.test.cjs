'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const core = require('../archive/archive2-core.js');
const meta = require('../archive/problem-bank-meta.js');
const approved = {uid:'ALITE-TEST', sourceKind:'generated', consumerSelectable:true,
  approval:'REVIEW_APPROVED', reviewStatus:'REVIEW_PASS', l2:'PHYSICAL',
  metaFinalSha256:'a'.repeat(64), sourceShardGitSha:'b'.repeat(40), metaReviewEvidenceSha256:'c'.repeat(64),
  meta:{rpmL1:'A',rpmL2:'B',rpmL3:'C',rpmL4:'D',difficultyBucket:5,
    crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE'}};
test('semantic RPM and physical storage bucket never alias; unknown differs from NONE', () => {
  const r=meta.projectGenerated(approved);
  assert.equal(r.L2,'B'); assert.equal(r.storageBucketKey,'PHYSICAL');
  assert.deepEqual(r.crossConceptKeys,[]);
  assert.equal(r.metaStatus.crossConceptKeys,'RECORDED_NOT_APPLICABLE');
  const x=meta.projectGenerated({...approved,meta:{level:'상'}});
  assert.equal(x.difficultyBucket,null); assert.equal(x.L2,null);
  assert.equal(x.conditionKeys,null); assert.equal(x.metaStatus.conditionKeys,'UNKNOWN');
  assert.equal(meta.projectGenerated({...approved,meta:{...approved.meta,conditionKeys:'NONE'}}).conditionKeys,null);
});
test('same query works for original and Generated, unknown does not fill a bucket', () => {
  const rows=meta.buildIndex([{questionUid:'qid_v1_test',sourceFile:'original/test.js',
    L1:'A',L2:'B',L3:'C',L4:'D',difficultyBucket:5}], [approved]);
  assert.equal(meta.query(rows,{L2:'B',difficultyBucket:5}).length,2);
  assert.equal(meta.query(rows,{L2:'PHYSICAL'}).length,0);
  assert.equal(meta.query(rows,{difficultyBucket:'UNKNOWN'}).length,0);
  assert.equal(meta.query(rows,{}, {profile:'VERIFIED'}).length,0);
  assert.throws(()=>meta.buildIndex([], [approved,approved]),/DUPLICATE/);
  const bound={...approved,metaFinalSha256:'a'.repeat(64),metaBrowsePath:{status:'EXACT_AUTHORITY_ALIAS',metaFinalSha256:'a'.repeat(64),L2:'canonical label'}};
  assert.equal(meta.projectGenerated(bound).L2,'canonical label');
  assert.equal(meta.projectGenerated(bound).rpmL2,'B','raw authority key is preserved');
  assert.equal(meta.projectGenerated({...bound,metaFinalSha256:'b'.repeat(64)}).L2,'B','stale alias is not consumed');
});
test('approval, HOLD and Meta verification are independent axes', () => {
  assert.equal(meta.projectGenerated(approved,null,['ALITE-TEST']).directSelectable,false);
  assert.equal(meta.projectGenerated({...approved,reviewStatus:'HOLD'}).directSelectable,false);
  assert.equal(meta.projectGenerated(approved).verifiedEligible,false);
  const userApproved={...approved,approval:'USER_DIRECTED_QUALITY_APPROVED',reviewStatus:'USER_DIRECTED_QUALITY_APPROVED',reviewApprovalBasis:'USER_DIRECTED_QUALITY_APPROVED:scoped-directive'};
  assert.equal(meta.projectGenerated(userApproved).directSelectable,true);
  assert.equal(meta.projectGenerated(userApproved).verifiedEligible,false,'quality approval does not invent full verified Meta');
  const m={...approved.meta,secondaryConceptKeys:[],problemTypeKey:'PT',templateKey:'TPL'};
  const verified=meta.projectGenerated({...approved,meta:m,metaVerification:{
    status:'VERIFIED_CURRENT_SOURCE',sourceBound:true,reviewBytesBound:true,
    metaFinalSha256:approved.metaFinalSha256,sourceShardGitSha:approved.sourceShardGitSha,
    reviewEvidenceSha256:approved.metaReviewEvidenceSha256}});
  assert.equal(verified.verifiedEligible,true);
  assert.equal(meta.projectGenerated({...approved,meta:m,
    metaVerification:{status:'VERIFIED_CURRENT_SOURCE',sourceBound:true}}).verifiedEligible,false);
  for (const patch of [
    { metaFinalSha256:'d'.repeat(64) },
    { sourceShardGitSha:'e'.repeat(40) },
    { reviewEvidenceSha256:'f'.repeat(64) },
  ]) assert.equal(meta.projectGenerated({...approved,meta:m,metaVerification:{
    status:'VERIFIED_CURRENT_SOURCE',sourceBound:true,reviewBytesBound:true,
    metaFinalSha256:approved.metaFinalSha256,sourceShardGitSha:approved.sourceShardGitSha,
    reviewEvidenceSha256:approved.metaReviewEvidenceSha256,...patch}}).verifiedEligible,false);
});
test('actual complete catalog and all current Generated UIDs retain identity', () => {
  const c=core.decodeCatalog(JSON.parse(fs.readFileSync('archive/data/archive2-catalog.json')));
  const i=JSON.parse(fs.readFileSync('archive/data/generated-lite-consumer/v1/index.json'));
  const rows=meta.buildIndex(c.records,i.records,{excludedHoldUids:i.excludedHoldUids});
  assert.equal(rows.length,c.records.length+i.records.length);
  assert.ok(c.records.length>=10000);
  assert.equal(rows.filter(r=>r.sourceKind==='generated'&&r.directSelectable).length,i.approvedCount);
  assert.ok(rows.every(r=>r.uid));
  for(const bucket of [1,2,3,4,5])
    assert.ok(meta.query(rows,{difficultyBucket:bucket}).every(r=>r.difficultyBucket===bucket));
  assert.deepEqual(c.records.map(r=>r.questionUid),rows.slice(0,c.records.length).map(r=>r.questionUid));
});
