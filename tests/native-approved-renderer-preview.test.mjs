import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {approvedRendererPreservationDescriptor,selectNativeRequests,selectPendingNativeRequests,
  applyNativeRequests,verifyNativeRequests} from '../tools/ci/archive-pr-native-preview.mjs';

const schema='archive-native-approved-renderer-preservation-v1';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function fixture(t,mutate=()=>{}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'renderer-preview-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const write=(p,value)=>{const full=path.join(root,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');git('config','user.name','Preview fixture');git('config','user.email','fixture@example.invalid');
  const source='original/middle/m1/2mid/fixture.js',sourcePath='archive/exams/'+source;
  write(sourcePath,'window.questionBank = '+JSON.stringify(Array.from({length:23},(_,i)=>({id:i+1,content:'fixture '+(i+1)})))+';\n');
  const prior='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/original-full.json',review='.archive-meta-register/evidence/renderer-review.json';
  write(prior,'{}\n');write(review,'{}\n');git('add','.');git('commit','-qm','exact base');
  const baseSha=git('rev-parse','HEAD'),refs=[prior,review].map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(root,p)))}));
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'full23-renderer-preserve',examUid:'fixture',sourceArchiveFile:source,
    expectedSourceBlobSha1:git('rev-parse','HEAD:'+sourcePath),expectedQuestionCount:23,scope:'PARTIAL_UIDS',registryChanges:[],
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'transport of existing approval',evidenceRefs:refs,
      rendererPreservation:{schemaVersion:schema,priorCommit:baseSha,currentCommit:baseSha,priorReceiptRef:refs[0],
        reviewRefs:[{commit:baseSha,...refs[1]}],outsideRequest:[]}},
    items:Array.from({length:23},(_,i)=>({questionUid:'uid-'+(i+1),sourceOrdinal:i+1,before:{},after:{},reason:'Preserve existing authority.',
      preservationMode:i<7?'INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY':'UNCHANGED_WHOLE_QUESTION_AND_ASSETS',evidenceRefs:refs}))};
  mutate(request);
  const file='.archive-meta-register/inbox/'+request.requestId+'.json';write(file,request);git('add','.');git('commit','-qm','exact renderer request');
  return{root,baseSha,headSha:git('rev-parse','HEAD'),request,file};
}
function result(descriptor) {
  return{status:'PASS',requestId:descriptor.requestId,totalQuestions:23,scope:'PARTIAL_UIDS',partialUidCount:23,expectedQuestionCount:23,
    newMetadataApprovals:0,preservedMetadataApprovals:23,replay:true,plannedPaths:[],consumerSearchStatus:'STATIC_VALUES_VERIFIED'};
}
function consumer(descriptor) {
  return{status:'PASS',counts:{changed:23,checked:23,passed:23,skippedUnchanged:0},failures:[],unobservedFields:[],assignmentPending:[],
    exams:[{file:descriptor.path,exam:'fixture',kind:'native-approval-preservation',sourceFile:'original/middle/m1/2mid/fixture.js',
      changed:23,checked:23,passed:23,skippedUnchanged:0,newMetadataApprovals:0,approvalCreated:false,
      preservedMetadataApprovals:23,approvalType:'FINAL_QA',expectedQuestionCount:23}]};
}

test('exact typed FULL23 renderer input is preserved FINAL_QA in PR and pending-main descriptors',t=>{
  const f=fixture(t),selected=selectNativeRequests(f),pending=selectPendingNativeRequests({root:f.root,headSha:f.headSha});
  assert.equal(selected.length,1);assert.deepEqual(selected,pending);
  assert.equal(selected[0].kind,'native-approval-preservation');assert.equal(selected[0].preservedApprovalType,'FINAL_QA');
  assert.equal(selected[0].questionCount,23);assert.equal(selected[0].sourceQuestionCount,23);
  assert.deepEqual(selected[0].rendererPreservation,{schemaVersion:schema,selectedCount:23});
  assert.equal(selected[0].evidence.length,2);
});
for(const [name,mutate] of [
  ['unknown schema',r=>r.approval.rendererPreservation.schemaVersion='unrecognized'],
  ['missing partial scope',r=>delete r.scope],
  ['non-FINAL approval',r=>r.approval.type='REVIEW2'],
  ['unreviewed authority',r=>r.approval.metadataReviewed=false],
  ['mixed source mode',r=>r.approval.sourceRebind={}],
  ['mixed audit mode',r=>r.approval.metaPipelineAudit={}],
  ['identity mode',r=>r.registrationMode='IDENTITY_FINGERPRINT_ONLY'],
  ['canonical changes',r=>r.registryChanges=[{}]],
  ['new after approval',r=>r.items[0].after={tagStatus:'reviewed_pass'}],
  ['new before value',r=>r.items[0].before={difficultyBucket:2}],
  ['ordinary reassessment',r=>r.items[0].sourceReview={}],
  ['unspecified preservation mode',r=>delete r.items[0].preservationMode],
  ['no reviewed renderer',r=>r.items.forEach(i=>i.preservationMode='UNCHANGED_WHOLE_QUESTION_AND_ASSETS')],
])test('typed preview refuses '+name,t=>{
  const f=fixture(t,mutate);assert.throws(()=>selectNativeRequests(f),/RENDERER_PRESERVATION_SCOPE/);
});
test('ordinary requests are not reclassified by the new descriptor',()=>{
  assert.equal(approvedRendererPreservationDescriptor({schemaVersion:'archive-reviewed-exam-meta-register-request-v2',approval:{type:'FINAL_QA'}}),undefined);
});
test('typed preview requires exact23 preserved and zero new approval in official registrar results',t=>{
  const f=fixture(t),requests=selectNativeRequests(f),ok=result(requests[0]);
  assert.equal(applyNativeRequests({root:f.root,requests,guard:false,run:()=>JSON.stringify(ok)}).length,1);
  for(const delta of [{preservedMetadataApprovals:22},{preservedMetadataApprovals:24},{newMetadataApprovals:1},{partialUidCount:22},{expectedQuestionCount:24}])
    assert.throws(()=>applyNativeRequests({root:f.root,requests,guard:false,run:()=>JSON.stringify({...ok,...delta})}),/DRY_RUN_NOT_PASS/);
});
test('typed preview requires every one of23 observed Consumer rows with no unchanged skips',t=>{
  const f=fixture(t),requests=selectNativeRequests(f),r=requests[0],ok=consumer(r);
  const run=(_program,args)=>JSON.stringify(args.some(a=>a.endsWith('verify-changed-uid-consumer-approval.mjs'))?ok:result(r));
  const verified=verifyNativeRequests({root:f.root,requests,run});
  assert.deepEqual(verified[1].preservedNativeApprovals,{requests:1,preservedMetadataApprovals:23,newMetadataApprovals:0,approvalTypes:['FINAL_QA']});
  for(const mutate of [c=>c.exams[0].preservedMetadataApprovals=22,c=>c.exams[0].newMetadataApprovals=1,
    c=>c.exams[0].kind='reviewed-exam-v2',c=>{for(const v of [c.counts,c.exams[0]])Object.assign(v,{changed:22,checked:22,passed:22,skippedUnchanged:1});}]) {
    const bad=structuredClone(ok);mutate(bad);
    assert.throws(()=>verifyNativeRequests({root:f.root,requests,run:(_p,args)=>JSON.stringify(args.some(a=>a.endsWith('verify-changed-uid-consumer-approval.mjs'))?bad:result(r))}),/CONSUMER_NOT_PASS/);
  }
});
