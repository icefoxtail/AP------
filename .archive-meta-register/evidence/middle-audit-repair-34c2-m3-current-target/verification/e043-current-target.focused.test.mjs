// Isolated local fixtures reuse the exact already reviewed Q11 input bytes.
// New receipts and deliberate tampering exist only in disposable fixture roots.
// Git history is read from the pinned shared object cache; no fetch is performed.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const base=path.resolve(process.env.M3_FIXTURE_WORKSPACE || '/workspace/scratch/0a70543c4ce8');
const repo=path.join(base,'scoped'),code=path.resolve(process.env.ARCHIVE_TEST_REPO || path.join(base,'m3-prep/e043-q11-helper-scratch/candidate'));
process.env.GIT_NO_LAZY_FETCH='1';
const mod=p=>import(pathToFileURL(path.join(code,p)).href);
const {registerReviewedExamV2}=await mod('archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
const {validateNativeReviewedSourceReuse}=await mod('archive/tools/meta-foundation/native-reviewed-source-reuse.mjs');
const {loadActiveMetaRegistry}=await mod('archive/tools/meta-foundation/active-registry.mjs');
const {REASSESSED_STUDENT_FIELDS}=await mod('archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
const {reviewedSourceBindingPath}=await mod('archive/tools/meta-foundation/reviewed-source-binding.mjs');
const {reviewedRendererBindingPath}=await mod('archive/tools/meta-foundation/reviewed-current-renderer-continuity.mjs');
const {validateRpmPrimaryProvenance}=await mod('archive/tools/meta-foundation/reviewed-rpm-provenance.mjs');
const C='archive/data/meta-foundation/canonical',META='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const MASTER='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const PIN='c3027e63785af0d9c018aee93a323f44872e5d4d';
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),digest=x=>sha(stable(x));
const blob=x=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(x)}\0`).update(x).digest('hex');
const json=x=>JSON.stringify(x,null,2)+'\n';
const payload=q=>Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k=>[k,Object.hasOwn(q,k)?q[k]:null]));
const full=q=>sha(JSON.stringify({content:q.content??null,choices:q.choices??null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const body=q=>sha(JSON.stringify({content:q.content??null,choices:q.choices??null,image:q.image??null}));
const readBank=bytes=>{const ctx={window:{},console};vm.runInNewContext(bytes.toString(),ctx,{timeout:5000});return JSON.parse(JSON.stringify(ctx.window.questionBank||ctx.window.questions||ctx.questions||ctx.questionBank||ctx.window.examData?.questions));};
const originalGit=(...args)=>execFileSync('git',args,{cwd:repo,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const exactBytes=(p,c=PIN)=>originalGit('show',c+':'+p);
const sharedObjects=fs.realpathSync(path.resolve(repo,originalGit('rev-parse','--git-path','objects').toString().trim()));
const originalProposal=JSON.parse(fs.readFileSync(path.join(base,'m3-prep/e043-q11-current-target/e043-q11-current-target-application-proposal.r1.json')));
const originalIndependent=JSON.parse(fs.readFileSync(path.join(base,'m1-read/e043-q11-current-target-application-independent-review.r1.json')));
const originalApproval=JSON.parse(fs.readFileSync(path.join(base,'state/e043-q11-root-approval.r1.json')));
const originalRequest=JSON.parse(fs.readFileSync(path.join(base,'scoped/.archive-meta-register/inbox/m3s2-audit-e043-q11-native1-20261116.json')));
const NATIVE=JSON.parse(exactBytes(originalProposal.native.reviewRef.path,originalProposal.native.reviewRef.commit));
const limits={nativeOriginalCurriculum:'UNSPECIFIED',semantic2015ExactRpmRecordId:null,semantic2015PublisherParentAndLeafResolved:false,
  comparison2022RpmRecordId:'M2-RPM-182',comparison2022BindingResolved:false,oldM3Rpm059SemanticApprovalRestored:false,
  fullSemanticResolution:false,officialResolverVerifiedFinal:false,newFullMathematicalQa:false,newSourceQualityApproval:false,newDifficultyJudgment:false};

function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'archive-m3-current-target-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const put=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,Buffer.isBuffer(v)||typeof v==='string'?v:json(v));};
  const raw=p=>fs.readFileSync(path.join(root,p)),read=p=>JSON.parse(raw(p));
  const git=(...args)=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}).toString().trim();
  git('init','-q');git('config','user.name','Isolated contract fixture');git('config','user.email','fixture@example.invalid');
  put('.git/objects/info/alternates',sharedObjects+'\n');
  const commit=label=>{git('add','--all');git('commit','--allow-empty','-qm',label);return git('rev-parse','HEAD');};
  const proposal=structuredClone(originalProposal),approval=structuredClone(originalApproval),independent=structuredClone(originalIndependent);
  const source=proposal.sourceArchiveFile,sourcePath='archive/exams/'+source,uid=proposal.questionUid;
  const sourceBytes=fs.readFileSync(path.join(base,'m3-prep/e043-q11-current-target/blocked-e043-q11-current-target-candidate.js'));
  put(sourcePath,sourceBytes);const bank=readBank(sourceBytes),question=bank[10],neighbour=bank[0];
  const writeBank=()=>put(sourcePath,'window.questionBank = '+JSON.stringify(bank)+';\n');
  const pt=proposal.existingDefinitions.problemType,tpl=proposal.existingDefinitions.template;
  const pack=JSON.parse(exactBytes(C+'/packs/middle-geometry/pack.json'));
  const packBase=C+'/packs/middle-geometry';
  put(packBase+'/pack.json',pack);put(packBase+'/taxonomy.json',{status:'ACTIVE',problemTypes:[pt],templates:[tpl],problemTypeCount:1,templateCount:1});
  put(packBase+'/bindings.json',{status:'ACTIVE',bindings:[]});put(packBase+'/aliases.json',{aliases:[]});
  const shard=JSON.parse(exactBytes(C+'/concepts/trigonometry.json'));
  shard.concepts=shard.concepts.filter(c=>c.conceptKey==='CC_SPECIAL_ANGLES');shard.conceptCount=shard.concepts.length;
  put(C+'/concepts/trigonometry.json',shard);
  put(C+'/condition_registry.json',{schemaVersion:'meta-foundation-condition-registry-v1',status:'ACTIVE',owner:'CONDITION_CORE',conditions:[],conditionCount:0});
  put(C+'/metadata_rules.json',{status:'ACTIVE',integrationPatterns:['NONE','SEQUENTIAL','INTERDEPENDENT','REINTERPRETATION','CASE_BRANCH','DEEP_COMPOSITE']});
  const canonicalSources=['pack','taxonomy','bindings','aliases'].map(n=>({path:packBase+'/'+n+'.json'}));
  for(const p of ['concepts/trigonometry.json','condition_registry.json','metadata_rules.json'])canonicalSources.push({path:C+'/'+p});
  put(C+'/registry_index.json',{schemaVersion:'meta-foundation-registry-index-v1',status:'ACTIVE',
    activePacks:[{id:pack.packId,version:pack.packVersion,status:'ACTIVE'}],
    activeConceptShards:[{id:shard.shardId,version:shard.shardVersion,status:'ACTIVE'}],
    conditionRegistry:{id:'CONDITION_CORE',version:'1',status:'ACTIVE'},canonicalSources,
    compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled'].map(n=>({path:'archive/data/meta-foundation/compiled/'+n+'.json'}))});
  for(const ref of [proposal.currentTarget.tagMasterRef,proposal.currentTarget.parentRef,proposal.currentRuleAuthority.ruleRef,
    proposal.currentRuleAuthority.solutionRuleRef])put(ref.path,exactBytes(ref.path,ref.commit));
  fs.mkdirSync(path.join(root,'archive/data/meta-foundation/runtime'),{recursive:true});
  const old=originalRequest.items[0];
  const metadata=NATIVE.items.map((item,i)=>({questionUid:item.questionUid,sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(i+1),
    sourceFingerprint:full(bank[i]),contentFingerprint:body(bank[i]),problemTypeKey:'',templateKey:'',reviewStatus:'review_required',metadataStatus:'registration_pending_semantic_review'}));
  Object.assign(metadata[10],structuredClone(old.before));
  const identity=metadata.map(row=>({questionUid:row.questionUid,sourceArchiveFile:source,sourceOrdinal:row.sourceOrdinal,sourceQuestionNo:row.sourceQuestionNo,sourceFingerprint:row.sourceFingerprint}));
  put(META,{records:metadata,counts:{}});put(ID,{records:identity});
  for(const ref of originalRequest.approval.evidenceRefs) {
    const local=path.join(repo,ref.path);const bytes=fs.existsSync(local)?fs.readFileSync(local):exactBytes(ref.path);
    assert.equal(sha(bytes),ref.sha256);put(ref.path,bytes);
  }
  const visual=read('.archive-meta-register/evidence/m3s2-audit-e043-renderer2-20261116/independent-renderer-review.json').rows.find(r=>r.sourceOrdinal===11);
  for(const ref of visual.assets.current)put(ref.path,exactBytes(ref.path,ref.commit));
  const prefix='.archive-meta-register/evidence/middle-audit-repair-34c2-m3-current-target/';
  const proposalPath=prefix+'e043-q11-current-target-application-proposal.r1.json';
  const independentPath=prefix+'e043-q11-current-target-application-independent-review.r1.json';
  const approvalPath=prefix+'e043-q11-root-approval.r1.json';
  const applicationPath=prefix+'e043-q11-current-target-application-binding.json';
  put(proposalPath,fs.readFileSync(path.join(base,'m3-prep/e043-q11-current-target/e043-q11-current-target-application-proposal.r1.json')));
  put(independentPath,fs.readFileSync(path.join(base,'m1-read/e043-q11-current-target-application-independent-review.r1.json')));
  put(approvalPath,fs.readFileSync(path.join(base,'state/e043-q11-root-approval.r1.json')));
  const ref=p=>({path:p,sha256:sha(raw(p))});
  const application={schemaVersion:'archive-m3s2-current-target-application-binding-v1',reviewer:approval.approvedBy,decision:'BIND_EXACT_CURRENT_TARGET_ONLY',
    questionUid:uid,sourceOrdinal:11,sourceArchiveFile:source,expectedQuestionCount:25,rootApprovalRef:ref(approvalPath),independentRef:ref(independentPath),proposalRef:ref(proposalPath),
    nativeReviewRef:{commit:proposal.native.reviewRef.commit,path:proposal.native.reviewRef.path,sha256:proposal.native.reviewRef.sha256},nativeItemStableSha256:proposal.native.itemStableSha256,
    sourceBeforeRef:proposal.sourceRefs.current,currentSourceRef:{path:sourcePath,blobSha1:blob(sourceBytes),sha256:sha(sourceBytes),questionStableSha256:digest(question)},
    protectedStudentPayloadSha256:digest(payload(question)),sourceMetadataDelta:proposal.sourceCandidate.sourceMetadataDelta,
    problemTypeStableSha256:proposal.existingDefinitions.problemTypeStableSha256,templateStableSha256:proposal.existingDefinitions.templateStableSha256,
    bindingStableSha256:digest(proposal.proposedExactBinding),limitations:structuredClone(limits)};
  const request=structuredClone(originalRequest);request.requestId='test-m3-current-target';request.expectedSourceBlobSha1=blob(sourceBytes);
  request.approval.approvedBy=approval.approvedBy;request.registryChanges=structuredClone(proposal.proposedRegistryChanges);
  const item=request.items[0];
  for(const [key,value] of Object.entries(proposal.sourceCandidate.sourceMetadataDelta))if(key!=='standardSubUnitKey')item.after[key]=value;
  item.after.sourceFingerprint=full(question);item.after.contentFingerprint=body(question);
  item.before=Object.fromEntries(Object.keys(item.after).map(k=>[k,metadata[10][k]??null]));
  item.targetParentRef={path:MASTER,sha256:proposal.currentTarget.parentRef.sha256,curriculum:'2015',scope:'M3-2',majorUnit:'삼각비',midUnit:'삼각비'};
  const publish=()=>{
    put(proposalPath,proposal);put(independentPath,independent);
    approval.proposalRef=ref(proposalPath);approval.independentReviewRef=ref(independentPath);put(approvalPath,approval);
    application.rootApprovalRef=ref(approvalPath);application.independentRef=ref(independentPath);application.proposalRef=ref(proposalPath);put(applicationPath,application);
    const applicationCommit=commit('Isolated immutable Q11 current-target fixture');
    const refs=[...originalRequest.approval.evidenceRefs,ref(proposalPath),ref(independentPath),ref(approvalPath),ref(applicationPath),ref(MASTER)];
    request.approval.evidenceRefs=refs;item.evidenceRefs=refs;request.registryChanges[0].evidenceRefs=refs;
    item.sourceReview.currentTargetApplication={schemaVersion:'archive-m3s2-current-target-application-v1',applicationCommit,applicationRef:ref(applicationPath),independentRef:ref(independentPath)};
  };
  publish();
  const retarget=()=>{writeBank();request.expectedSourceBlobSha1=blob(raw(sourcePath));item.after.sourceFingerprint=full(question);item.after.contentFingerprint=body(question);
    application.currentSourceRef={path:sourcePath,blobSha1:blob(raw(sourcePath)),sha256:sha(raw(sourcePath)),questionStableSha256:digest(question)};publish();};
  const receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+request.requestId+'.json';
  const reuse=(receiptFile=receiptPath)=>{const receipt=read(receiptFile),current=read(META).records.find(r=>r.questionUid===uid),id=read(ID).records.find(r=>r.questionUid===uid),
    rt=read('archive/data/meta-foundation/runtime/middle-geometry-v1.json').records.find(r=>r.questionUid===uid),bytes=execFileSync('git',['cat-file','blob',receipt.sourceBlobSha1],{cwd:root});
    return validateNativeReviewedSourceReuse(receipt,{root,bytes,blobSha1:receipt.sourceBlobSha1,bank:readBank(bytes),runtimeRecord:rt},question,id,11,current,loadActiveMetaRegistry(root));};
  return {root,put,read,raw,git,commit,uid,sourcePath,bank,question,neighbour,request,item,application,approval,independent,proposal,
    proposalPath,independentPath,approvalPath,applicationPath,publish,retarget,writeBank,receiptPath,reuse,pt,tpl};
}

test('Q11 exact current target: official fixture write, replay and native reuse retain every semantic limit',t=>{
  const f=fixture(t),source=f.raw(f.sourcePath),definition=f.raw(C+'/packs/middle-geometry/taxonomy.json'),before=f.read(META).records;
  const result=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(result.status,'PASS');
  const receipt=f.read(f.receiptPath),proof=receipt.fingerprintRepairs[0].sourceReview.currentTargetApplication,record=f.read(META).records[10];
  assert.equal(record.standardCourse,'중3 수학');assert.equal(record.courseKey,'M3-2');assert.equal(record.semanticSourceScope,'M2-2');
  assert.equal(record.semanticScopeRelation,'PREREQUISITE_LOWER_GRADE');assert.equal(record.problemTypeKey,f.pt.problemTypeKey);
  assert.equal(record.templateKey,f.tpl.templateKey);assert.equal(record.rpmPrimaryId??null,null);
  assert.deepEqual(proof.limitations,limits);assert.equal(proof.targetApprovalOrigin,'CURRENT_TARGET_APPLICATION');
  assert.equal(proof.fieldBindings.standardCourse.origin,'CURRENT_TARGET_APPLICATION');
  assert.equal(proof.newBindings,1);assert.equal(proof.newDefinitions,0);assert.equal(receipt.rpmPrimaryBindings?.length||0,0);
  assert.deepEqual(f.raw(f.sourcePath),source);assert.deepEqual(f.raw(C+'/packs/middle-geometry/taxonomy.json'),definition);
  assert.deepEqual(f.read(META).records.filter((_,i)=>i!==10),before.filter((_,i)=>i!==10));
  assert.equal(f.read(reviewedSourceBindingPath(f.request.requestId)).records.length,1);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);assert.equal(f.reuse(),true);
});

test('Q11 current target rejects unrelated scope, invented RPM, evidence drift and extra writes before issue',async t=>{
  for(const [name,mutate,pattern]of[
    ['ordinary request without typed target application',f=>{delete f.item.sourceReview.currentTargetApplication;},/native review|after value/],
    ['different UID',f=>{f.item.questionUid=f.bank[0].questionUid||'wrong';},/UID|ordinal/],
    ['extra opt-in authority key',f=>{f.item.sourceReview.currentTargetApplication.grantAllTargets=true;},/shape mismatch/],
    ['false native target provenance',f=>{f.application.decision='NATIVE_AFTER';f.publish();},/application authority/],
    ['invented exact2015 publisher leaf',f=>{f.application.limitations.semantic2015ExactRpmRecordId='M3-RPM-059';f.publish();},/application authority/],
    ['independent reviewer same as root',f=>{f.independent.reviewer=f.approval.approvedBy;f.publish();},/independent current application/],
    ['independent target contradicts its source values',f=>{f.independent.currentTarget='2015|M2-2';f.publish();},/distinguish exact operational target/],
    ['root changes the semantic scope',f=>{f.approval.semanticSourceScope='M3-2';f.publish();},/distinguish exact operational target/],
    ['independent proof removed from item refs',f=>{f.item.evidenceRefs=f.item.evidenceRefs.filter(r=>r.path!==f.independentPath);},/evidence must bind/],
    ['renderer proof stripped',f=>{delete f.item.sourceReview.rendererProof;},/student payload|source review.*shape|renderer/],
    ['different current target parent',f=>{f.item.targetParentRef.midUnit='삼각비의 활용';},/plain exact current target/],
    ['metadata semantic scope replaced',f=>{f.item.after.semanticSourceScope='M3-2';},/current target field differs/],
    ['metadata target grade replaced',f=>{f.item.after.courseKey='M2-2';},/current target field differs/],
    ['metadata invented semantic RPM',f=>{f.item.before.rpmPrimaryPath=null;f.item.after.rpmPrimaryPath={majorUnit:'삼각비',midUnit:'삼각비',l3:'invented',l4:'invented'};},/fabricate a semantic RPM/],
    ['existing definition changed',f=>{const p=C+'/packs/middle-geometry/taxonomy.json',d=f.read(p);d.templates[0].definition='Different unsupported meaning';f.put(p,d);},/primary definitions/],
    ['binding gains another UID',f=>{f.request.registryChanges[0].after.supportingQuestionUids.push('other');},/add.only current target binding/],
    ['extra binding operation',f=>{f.request.registryChanges.push(structuredClone(f.request.registryChanges[0]));},/before|binding change|collision/],
    ['source approval flag promotion',f=>{f.question.solutionStatus='APPROVED';f.retarget();},/current selected source|metadata fields/],
    ['changed selected answer',f=>{f.question.answer='invented';f.retarget();},/student payload|selected source/],
    ['changed selected method',f=>{f.question.primaryMethod='invented method';f.item.after.primaryMethod=f.question.primaryMethod;f.retarget();},/current selected source|metadata fields|rationale/],
    ['changed unselected source question',f=>{f.neighbour.editorialNote='not part of initial target application';f.retarget();},/current selected source|another question/],
  ])await t.test(name,t=>{const f=fixture(t);mutate(f);const stored=f.raw(META);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),pattern);assert.deepEqual(f.raw(META),stored);
    assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
  });
});

test('Q11 replay and native reuse reject stripped typed and renderer proofs',async t=>{
  for(const [name,mutate]of[
    ['typed proof removed',f=>{const r=f.read(f.receiptPath);delete r.fingerprintRepairs[0].sourceReview.currentTargetApplication;f.put(f.receiptPath,r);}],
    ['typed sidecar removed',f=>fs.rmSync(path.join(f.root,reviewedSourceBindingPath(f.request.requestId)))],
    ['renderer sidecar removed',f=>fs.rmSync(path.join(f.root,reviewedRendererBindingPath(f.request.requestId)))],
    ['root proof changed',f=>{const d=f.read(f.approvalPath);d.preservedLimits.semantic2015PublisherParentAndLeafResolved=true;f.put(f.approvalPath,d);}],
  ])await t.test(name,t=>{const f=fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(f.reuse(),true);mutate(f);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request}),/proof|binding|evidence|missing|ENOENT|drift/i);
    assert.throws(()=>f.reuse(),/proof|binding|evidence|missing|ENOENT|drift/i);
  });
});

test('Q11 later unrelated source and crosswalk changes use an exact source-only receipt; selected edits are rejected',t=>{
  const f=fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(f.reuse(),true);
  const priorRef={path:f.receiptPath,sha256:sha(f.raw(f.receiptPath))};
  f.put('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/unrelated.json',{schemaVersion:'rpm-primary-active-crosswalk-v1',status:'ACTIVE_REFERENCE',rpmAuthority:{source:MASTER},records:[]});
  f.neighbour.editorialNote='An unrelated question changed after original issue.';f.writeBank();assert.equal(f.reuse(),true);
  const currentBlob=f.git('hash-object','-w',f.sourcePath);
  const request={schemaVersion:f.request.schemaVersion,requestId:'test-m3-current-target-source-rebind',scope:'PARTIAL_UIDS',examUid:f.request.examUid,
    sourceArchiveFile:f.request.sourceArchiveFile,expectedSourceBlobSha1:currentBlob,expectedQuestionCount:25,
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:f.approval.approvedBy,evidenceRefs:[...f.request.approval.evidenceRefs,priorRef],sourceRebind:{priorReceiptRef:priorRef}},
    items:[{questionUid:f.uid,sourceOrdinal:11,before:{},after:{},reason:'Preserve the exact issued selected approval.',evidenceRefs:f.item.evidenceRefs}]};
  const result=registerReviewedExamV2({root:f.root,request,write:true});assert.equal(result.status,'PASS');assert.equal(result.newMetadataApprovals,0);assert.equal(result.preservedMetadataApprovals,1);
  const p='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+request.requestId+'.json';
  assert.equal(f.read(p).sourceBlobSha1,currentBlob);assert.equal(registerReviewedExamV2({root:f.root,request}).replay,true);assert.equal(f.reuse(p),true);
  f.question.sourceIssueHold=true;f.writeBank();const changedBlob=f.git('hash-object','-w',f.sourcePath),next=structuredClone(request);
  next.requestId='test-m3-current-target-forbidden-selected-edit';next.expectedSourceBlobSha1=changedBlob;
  next.approval.sourceRebind.priorReceiptRef={path:p,sha256:sha(f.raw(p))};next.approval.evidenceRefs.push(next.approval.sourceRebind.priorReceiptRef);
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:next,write:true}),/changed|differs|hold|source rebind/i);
});
