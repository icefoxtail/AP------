import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {auditedSubsetCcFixture} from './helpers/audited-subset-cc-fixture.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {nativeReviewReceipt,planQuestion} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {materializeAuditConsumerInputs} from './helpers/audited-cc-append-fixture.mjs';
import {verifyChangedUidConsumerApproval} from '../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';
import {verifiedAuditCcSourcePrecedence} from '../archive/tools/meta-foundation/audited-cross-concept-append.mjs';
import {selectPendingNativeRequests,rederiveNativePlans,nativeOutputManifest} from '../tools/ci/archive-pr-native-preview.mjs';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json',RUNTIME='archive/data/meta-foundation/runtime/new-course-v1.json';
const omit=(r,fields)=>Object.fromEntries(Object.entries(r).filter(([k])=>!fields.includes(k)));

test('current audit subset appends one CC while preserving its current native siblings and both original authorities',t=>{
 const f=auditedSubsetCcFixture(t),before=f.read(META),oldRuntime=f.read(RUNTIME),ids=f.hash(IDENTITY),source=f.hash(f.sourcePath),original=f.hash(f.fullPriorPath),prior=f.hash(f.priorPath);
 const dry=registerReviewedExamV2({root:f.root,request:f.request});assert.equal(dry.status,'PASS');assert.deepEqual(f.read(META),before);assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
 const written=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(written.totalQuestions,2);assert.equal(written.newMetadataApprovals,0);assert.equal(written.registryChangeCount,0);assert.equal(written.preservedMetadataApprovals,2);
 const after=f.read(META),runtime=f.read(RUNTIME),receipt=f.read(f.registeredPath);
 for(const n of f.nativeOrdinals){assert.deepEqual(after.records[n-1],before.records[n-1]);assert.deepEqual(runtime.records.find(r=>r.sourceOrdinal===n),oldRuntime.records.find(r=>r.sourceOrdinal===n));assert.equal(after.records[n-1].metadataApprovalType,'FINAL_QA');}
 for(const n of f.auditOrdinals){const a=after.records[n-1],b=before.records[n-1],fields=['metadataRevision','approvalEvidence',...(n===f.ordinal?['crossConceptKeys','crossConceptApprovalComponents']:[])];assert.deepEqual(omit(a,fields),omit(b,fields));assert.equal(a.metadataApprovalType,'META_PIPELINE_AUDIT');assert.equal(a.integrationPattern,'NONE');}
 assert.deepEqual(after.records[f.ordinal-1].crossConceptKeys,['CC_NEW','CC_APPEND']);assert.equal(receipt.expectedQuestionCount,4);assert.equal(receipt.partialUidCount,2);assert.equal(receipt.auditCrossConceptAppend.finalizedCrossConceptApplications,1);
 assert.equal(f.hash(IDENTITY),ids);assert.equal(f.hash(f.sourcePath),source);assert.equal(f.hash(f.fullPriorPath),original);assert.equal(f.hash(f.priorPath),prior);
 const replay=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
 for(const n of f.auditOrdinals){const a=f.nativeArgs(n);assert.equal(nativeReviewReceipt(a),f.registeredPath);assert.equal(planQuestion(a).status,'ALREADY_REGISTERED');}
});

test('current subset is selected by the official preview with its partial denominator',t=>{
 const f=auditedSubsetCcFixture(t),selected=selectPendingNativeRequests({root:f.root,headSha:f.head});
 assert.equal(selected.length,1);assert.equal(selected[0].questionCount,2);assert.equal(selected[0].sourceQuestionCount,4);
 assert.equal(selected[0].kind,'native-approval-preservation');assert.equal(selected[0].preservedApprovalType,'META_PIPELINE_AUDIT');
 assert.deepEqual(selected[0].selectedItems,f.request.items.map(({questionUid,sourceOrdinal})=>({questionUid,sourceOrdinal})));
 assert.equal(selected[0].evidence.some(r=>r.path==='.archive-meta-register/inbox/preserved-difficulty.json'),false);
 const phases=[],shadow=rederiveNativePlans({root:f.root,requests:selected,run:(_binary,args,root)=>{
  assert.notEqual(root,f.root);phases.push(args.includes('--write')?'write':'dry');
  const request=JSON.parse(fs.readFileSync(path.join(root,args[args.indexOf('--request')+1]),'utf8'));
  return JSON.stringify(registerReviewedExamV2({root,request,write:args.includes('--write')}));
 }});
 assert.deepEqual(phases,['dry','write']);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 assert.deepEqual(shadow.outputs,nativeOutputManifest(f.root,shadow.plans));assert(shadow.outputs.some(r=>r.path===f.bindingPath));
});

test('consumed request replays only through its exact durable binding',t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 fs.unlinkSync(path.join(f.root,f.requestPath));
 const replay=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
 assert.equal(nativeReviewReceipt(f.nativeArgs(f.ordinal)),f.registeredPath);
 const binding=f.read(f.bindingPath);binding.requestSnapshot.approval.approvedBy='different-operator';f.put(f.bindingPath,binding);
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}));assert.equal(nativeReviewReceipt(f.nativeArgs(f.ordinal)),null);
});

test('the canonical and changed-UID Consumers retain audit status for only the exact issued subset',t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});materializeAuditConsumerInputs(f);
 const projection=registerReviewedExamV2({root:f.root,request:f.request,verifyProjection:true});assert.equal(projection.consumerSearchStatus,'STATIC_VALUES_VERIFIED');
 const result=verifyChangedUidConsumerApproval({root:f.root,requestPaths:[f.requestPath]});assert.equal(result.status,'PASS',JSON.stringify(result.failures));
 assert.deepEqual(result.counts,{changed:2,checked:2,passed:2,skippedUnchanged:0});assert.equal(result.exams[0].approvalType,'META_PIPELINE_AUDIT');assert.equal(result.exams[0].newMetadataApprovals,0);
 const receipt=f.read(f.registeredPath);receipt.appliedRecords.pop();f.put(f.registeredPath,receipt);materializeAuditConsumerInputs(f);
 const bad=verifyChangedUidConsumerApproval({root:f.root,requestPaths:[f.requestPath]});assert.equal(bad.status,'FAIL');assert.equal(bad.counts.passed,0);
});

test('catalog precedence validates the whole retained cohort and never overrides native siblings',t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 const args=()=>({root:f.root,source:f.request.sourceArchiveFile,bytes:fs.readFileSync(path.join(f.root,f.sourcePath)),bank:structuredClone(f.bank),metadataRows:f.read(META).records,identityRows:f.read(IDENTITY).records});
 const valid=verifiedAuditCcSourcePrecedence(args());assert.deepEqual([...valid.keys()].sort(),f.request.items.map(i=>i.questionUid).sort());
 for(const n of f.nativeOrdinals)assert.equal(valid.has(f.read(META).records[n-1].questionUid),false);
 const bad=args();bad.metadataRows[f.auditOrdinals[1]-1].primaryMethod='unapproved';assert.equal(verifiedAuditCcSourcePrecedence(bad).size,0);
 const rt=f.read(RUNTIME);rt.records.find(r=>r.sourceOrdinal===f.auditOrdinals[1]).crossConceptKeys=[];f.put(RUNTIME,rt);
 assert.equal(verifiedAuditCcSourcePrecedence(args()).size,0);assert.equal(nativeReviewReceipt(f.nativeArgs(f.ordinal)),null);
});

test('current audit append and the existing native source-only preservation compose without overlapping UIDs',t=>{
 const f=auditedSubsetCcFixture(t),native=f.nativePreservationRequest(),nativePath='.archive-meta-register/inbox/'+native.requestId+'.json';
 f.put(nativePath,native);const head=f.checkpoint('both exact disjoint current approval transports');
 const requests=selectPendingNativeRequests({root:f.root,headSha:head});assert.equal(requests.length,2);assert.equal(requests.reduce((n,r)=>n+r.questionCount,0),4);
 assert.equal(new Set(requests.flatMap(r=>r.selectedItems.map(i=>i.questionUid))).size,4);
 for(const r of[f.request,native]){assert.equal(registerReviewedExamV2({root:f.root,request:r}).status,'PASS');registerReviewedExamV2({root:f.root,request:r,write:true});}
 // The original audit fixture deliberately has only its independently bound
 // alternate basic parent. A mixed Consumer also needs the ordinary native
 // tuple in its canonical master; it does not use the audit-only parent bridge.
 const masterPath='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',master=f.read(masterPath);
 for(const n of f.nativeOrdinals){const r=f.read(META).records[n-1];if(!master.records.some(p=>p.curriculum===r.curriculumKey&&p.scope===r.courseKey&&p.majorUnit===r.L1&&p.midUnit===r.L2))
  master.records.push({curriculum:r.curriculumKey,scope:r.courseKey,majorUnit:r.L1,midUnit:r.L2,concepts:[]});}
 f.put(masterPath,master);
 const linksPath='archive/data/basic-scope-parent-links.json',links=f.read(linksPath);
 links.authority.sha256=f.ref(masterPath).sha256;f.put(linksPath,links);
 materializeAuditConsumerInputs(f);
 for(const r of[f.request,native]){const replay=registerReviewedExamV2({root:f.root,request:r,write:true});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);}
 const consumer=verifyChangedUidConsumerApproval({root:f.root,requestPaths:[f.requestPath,nativePath]});
 assert.equal(consumer.status,'PASS',JSON.stringify({failures:consumer.failures,assignmentPending:consumer.assignmentPending}));assert.deepEqual(consumer.counts,{changed:4,checked:4,passed:4,skippedUnchanged:0});
 for(const n of f.auditOrdinals)assert.equal(nativeReviewReceipt(f.nativeArgs(n)),f.registeredPath);
 for(const n of f.nativeOrdinals){const a=f.nativeArgs(n);assert.equal(nativeReviewReceipt(a),'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+native.requestId+'.json');assert.equal(planQuestion(a).status,'ALREADY_REGISTERED');}
});
