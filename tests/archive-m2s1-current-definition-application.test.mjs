// Standalone focused integration tests. Repository writes occur only in temporary fixtures.
// Run: ARCHIVE_TEST_REPO=/absolute/repo node --test this-file.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const repo=path.resolve(process.env.ARCHIVE_TEST_REPO||process.argv[2]||new URL('..',import.meta.url).pathname);
const mod=p=>import(pathToFileURL(path.join(repo,p)).href);
const {registerReviewedExamV2}=await mod('archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
const {REASSESSED_STUDENT_FIELDS}=await mod('archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
const {validateNativeReviewedSourceReuse}=await mod('archive/tools/meta-foundation/native-reviewed-source-reuse.mjs');
const {loadActiveMetaRegistry}=await mod('archive/tools/meta-foundation/active-registry.mjs');
const {reviewedSourceBindingPath}=await mod('archive/tools/meta-foundation/reviewed-source-binding.mjs');
const CANON='archive/data/meta-foundation/canonical',META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json';
const CROSSWALK='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=v=>hash(stable(v));
const blob=b=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
const payload=q=>Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k=>[k,Object.hasOwn(q,k)?q[k]:null]));
const sourceSha=q=>hash(JSON.stringify({content:q.content??null,choices:q.choices??null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const bodySha=q=>hash(JSON.stringify({content:q.content??null,choices:q.choices??null,image:q.image??null}));
const json=v=>JSON.stringify(v,null,2)+'\n';
const bank=bytes=>{const ctx={window:{},console};vm.runInNewContext(bytes.toString(),ctx);return JSON.parse(JSON.stringify(ctx.window.questions));};

// Same fixture architecture as reviewedSourceFixture: real native/base Git objects,
// an older stored fingerprint, one selected UID, and an omitted held neighbour.
function applicationFixture(t,{mutateNative}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'archive-current-definition-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const put=(p,v)=>{const full=path.join(root,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,typeof v==='string'?v:json(v));};
  const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const raw=p=>fs.readFileSync(path.join(root,p));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');git('config','user.name','Fixture reviewer');git('config','user.email','fixture@example.invalid');
  const commit=message=>{git('add','--all');git('commit','--allow-empty','-qm',message);return git('rev-parse','HEAD');};
  const source='original/middle/m2/1final/fixture.js',sourcePath='archive/exams/'+source;
  const uid='qid_v1_'+hash(source+'#1'),heldUid='qid_v1_'+hash(source+'#2');
  const nativePath='docs/native-review.json',definitionPath='docs/current-definition-approval.json',
    independentPath='docs/original-independent-application.json',applicationPath='docs/current-application-binding.json',proposalPath='docs/current-proposal.json';
  const D5={level:'중',difficultyBucket:3,difficultyConfidence:'high',difficultyBoundaryFlag:'B23',legacyLevelCompatibility:'NORMAL'};
  const rp={majorUnit:'연립일차방정식',midUnit:'연립일차방정식의 활용',l3:'수와 개수',l4:'개수·가격'};
  const remove={projectionStatus:'RPM_ONLY',ownerPack:null,nullReason:'RPM_ONLY: no exact target-scope ACTIVE PT/TPL pair; null explicit.',
    projectionReason:'middle2 RPM crosswalk mapping=RPM_ONLY; bindingStatus=NO_ACTIVE_MAPPING.'};
  const beforeQuestion={id:1,content:'Known weights are 1300 and 2000. There are 10 objects; swapping counts increases the total by 1400.',
    choices:[],answer:'6',solution:'Let x and y be the counts. x+y=10 and 700(x-y)=1400; hence x=6.',image:'',
    curriculum:'2022',standardCourse:'중2',standardUnitKey:'M2-03',standardUnit:rp.majorUnit,
    subUnitKey:'M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD',subUnit:rp.midUnit,
    problemTypeKey:null,templateKey:null,crossConceptKeys:[],conditionKeys:[],integrationPattern:'SEQUENTIAL',...D5,
    primaryMethod:'retain the given-count model',decisiveStep:'x+y=10,x-y=2',rpmPrimaryRecordId:'M2-RPM-157',
    rpmPrimaryPath:rp,rpmL3:rp.l3,rpmL4:rp.l4,rpmSemanticStatus:'FINAL',...remove};
  const neighbour={...structuredClone(beforeQuestion),id:2,content:'Omitted held neighbour',answer:'unknown',solution:''};
  let currentQuestion=structuredClone(beforeQuestion),currentNeighbour=structuredClone(neighbour);
  const writeBank=()=>{put(sourcePath,`window.questions = ${JSON.stringify([currentQuestion,currentNeighbour])};\n`);return raw(sourcePath);};
  writeBank();
  const stored={...structuredClone(beforeQuestion),questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:'1',
    sourceFingerprint:sourceSha({...beforeQuestion,content:'older stored question'}),contentFingerprint:bodySha({...beforeQuestion,content:'older stored question'}),reviewStatus:'review_required',standardCourse:'중2 수학'};
  for(const k of ['id','content','choices','answer','solution','image',...Object.keys(remove)])delete stored[k];
  const held={questionUid:heldUid,sourceArchiveFile:source,sourceOrdinal:2,sourceQuestionNo:'2',sourceFingerprint:'held-legacy-fingerprint',
    reviewStatus:'manual_review',metadataStatus:'approved_partial_with_explicit_holds',problemTypeKey:'',templateKey:null};
  put(META,{records:[stored,held],counts:{}});put(IDENTITY,{records:[{questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:'1',sourceFingerprint:stored.sourceFingerprint},held]});
  const parent={problemTypeKey:'PT_H1_EQUATION_APPLICATION',canonicalLabelKo:'방정식의 활용',definition:'Use equations for quantity relations.',
    aliases:[],status:'ACTIVE',ownerPack:'H1_FOUNDATION',supportingQuestionUids:['existing-parent-support'],supportingItemCount:1};
  const canonicalSources=[];
  for(const [id,slug,courses,domains]of[['H1_FOUNDATION','h1-foundation',['공통수학1'],['H22-C-06']],['MIDDLE2','middle2',['중2','M2-1'],['M2-03']]]){
    const base=`${CANON}/packs/${slug}`;
    put(base+'/pack.json',{schemaVersion:'meta-foundation-pack-v1',packId:id,packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015','2022'],standardCourses:courses,ownedStandardUnitDomains:domains});
    put(base+'/taxonomy.json',{status:'ACTIVE',problemTypes:id==='H1_FOUNDATION'?[parent]:[],templates:[]});
    put(base+'/bindings.json',{status:'ACTIVE',bindings:[]});put(base+'/aliases.json',{aliases:[]});
    for(const n of ['pack','taxonomy','bindings','aliases'])canonicalSources.push({path:base+'/'+n+'.json'});
  }
  put(`${CANON}/condition_registry.json`,{schemaVersion:'meta-foundation-condition-registry-v1',status:'ACTIVE',owner:'CONDITION_CORE',conditions:[],conditionCount:0});
  canonicalSources.push({path:`${CANON}/condition_registry.json`});
  put(`${CANON}/metadata_rules.json`,{status:'ACTIVE',integrationPatterns:['NONE','SEQUENTIAL','INTERDEPENDENT','REINTERPRETATION','CASE_BRANCH','DEEP_COMPOSITE']});
  canonicalSources.push({path:`${CANON}/metadata_rules.json`});
  put(`${CANON}/registry_index.json`,{schemaVersion:'meta-foundation-registry-index-v1',status:'ACTIVE',
    activePacks:['H1_FOUNDATION','MIDDLE2'].map(id=>({id,version:'1.0.0',status:'ACTIVE'})),activeConceptShards:[],
    conditionRegistry:{id:'CONDITION_CORE',version:'1',status:'ACTIVE'},canonicalSources,
    compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled']
      .map(n=>({path:`archive/data/meta-foundation/compiled/${n}.json`}))});
  put('archive/data/master_tables/js_archive_tag_master.json',[
    {key:'M2-03',keyType:'standardUnitKey',labelKo:rp.majorUnit,status:'active'},
    {key:beforeQuestion.subUnitKey,keyType:'subUnitKey',parentKey:'M2-03',standardUnitKey:'M2-03',labelKo:rp.midUnit,status:'active'}]);
  put(MASTER,{schemaVersion:'js-archive-taxonomy-rpm-primary-v1.0',authorityStatus:'LOCKED',records:[{
    curriculum:'2022',scope:'M2-1',majorUnit:rp.majorUnit,midUnit:rp.midUnit,concepts:[{concept:rp.l3,problemTypes:[{problemType:rp.l4}]}]}]});
  const rpmRecord={id:'M2-RPM-157',curriculum:'2022',scope:'M2-1',rpmPath:rp,standardUnitKey:'M2-03',subUnitKey:beforeQuestion.subUnitKey,mappingStatus:'RPM_ONLY',bindingStatus:'NO_ACTIVE_MAPPING'};
  const crosswalk={schemaVersion:'rpm-primary-active-crosswalk-v1',status:'ACTIVE_REFERENCE',rpmAuthority:{source:MASTER},records:[rpmRecord]};
  put(CROSSWALK,crosswalk);fs.mkdirSync(path.join(root,'archive/data/meta-foundation/runtime'),{recursive:true});
  put(nativePath,{});const baseCommit=commit('Native baseline'),nativeBlob=blob(raw(sourcePath));
  const row={sourceOrdinal:1,questionUid:uid,verdict:'REGISTRATION_PENDING',rpmRecordId:'M2-RPM-157',rpmDecision:'CORRECT',
    primaryMethod:'Model counts and exchanged weighted totals.',decisiveStep:'x+y=10, (2000x+1300y)-(1300x+2000y)=1400',
    after:{crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',level:'중',difficultyBoundaryFlag:'B23'},
    finalDifficulty:{...D5},fieldReview:{classification:'Counts are unknown; known prices remain fixed.',difficulty:'Standard two linear equations.'},
    semanticDecision:{standardUnitKey:'M2-03',subUnitKey:beforeQuestion.subUnitKey,semanticCurriculum:'2022',rpmPath:rp,rpmBasePath:rp},
    contentDebt:[],registrationDebt:['PT_TPL_EVIDENCE_INCOMPLETE: a new exact definition and application are required.'],proposalRefs:[]};
  const review={schemaVersion:'m2-s1-meta-review-v1',owner:'native-author',sourceArchiveFile:source,sourceGitBlobSha:nativeBlob,
    baseSha:baseCommit,reviewedQuestionCount:2,proposals:[],items:[row,{sourceOrdinal:2,questionUid:heldUid,verdict:'UNRESOLVED',rpmDecision:'UNRESOLVED',after:{},decisiveStep:'Held neighbour'}]};
  mutateNative?.({review,row,uid});put(nativePath,review);const reviewCommit=commit('Native accepted review');
  const beforeCommit=commit('Independent current source snapshot');
  const nativeRef={commit:reviewCommit,path:nativePath,sha256:hash(raw(nativePath))};
  const localNativeRef={path:nativePath,sha256:nativeRef.sha256};
  const sourceRef=commit=>({commit,path:sourcePath,blobSha1:blob(raw(sourcePath)),sha256:hash(raw(sourcePath))});
  const beforeRef=sourceRef(beforeCommit),payloadSha=digest(payload(beforeQuestion));
  const tpl={templateKey:'TPL_H1_EQUATION_KNOWN_WEIGHTS_SWAPPED_QUANTITIES',parentProblemTypeKey:parent.problemTypeKey,
    canonicalLabelKo:'Known weights and swapped counts',definition:'Use count sum and the difference of weighted totals after swapping counts.',
    internalSkeleton:'COUNT_SUM_SWAP_WEIGHTED_DIFFERENCE_LINEAR_SYSTEM',status:'ACTIVE',ownerPack:'H1_FOUNDATION',aliases:[],supportingQuestionUids:[uid],supportingItemCount:1};
  const binding={curriculum:'2022',standardCourse:'중2',standardUnitKey:'M2-03',subUnitKey:beforeQuestion.subUnitKey,problemTypeKey:parent.problemTypeKey,
    ownerPack:'MIDDLE2',L1:rp.majorUnit,L2:rp.midUnit,status:'ACTIVE',supportingQuestionUids:[uid],supportingItemCount:1};
  const direct={...rpmRecord,id:'M2-RPM-157-FIXTURE-DIRECT',standardCourse:'중2',mappingStatus:'DIRECT_ACTIVE',bindingStatus:'ACTIVE',
    problemTypeKey:parent.problemTypeKey,templateKey:tpl.templateKey,ownerPack:'H1_FOUNDATION',promotesRpmOnlyRowId:rpmRecord.id,
    binding:Object.fromEntries(['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey','ownerPack'].map(k=>[k,binding[k]]))};
  put(proposalPath,{fixture:true,selectedUid:uid,newDefinition:tpl});const proposalRef={path:proposalPath,sha256:hash(raw(proposalPath))};
  const definition={schemaVersion:'middle-audit-independent-exact-template-definition-approval-v1',owner:'root-reviewer',preparedBy:'proposal-preparer',
    reviewer:'root-reviewer',nativeReviewer:'native-author',independentFromNativeAuthor:true,blindReviewClaim:false,
    questionUid:uid,sourceOrdinal:1,sourceArchiveFile:source,expectedQuestionCount:2,decision:'APPROVE_EXACT_GENERIC_DEFINITION_AND_CURRENT_UID_APPLICATION',
    nativeReviewRef:{commit:reviewCommit,path:nativePath,localRef:localNativeRef},currentSourceRef:beforeRef,currentProtectedStudentPayloadSha256:payloadSha,
    proposalRef,existingParent:{path:`${CANON}/packs/h1-foundation/taxonomy.json`,sha256:hash(raw(`${CANON}/packs/h1-foundation/taxonomy.json`)),problemType:parent},
    approvedTemplate:tpl,approvedBinding:binding,approvedCrosswalkRow:direct,existingDefinitionChanges:0,sourceAndSolutionMutationRequired:false,
    sourceApprovalFlagsMustRemainUnchanged:true,originalSourceApprovalFlags:{answerStatus:null,solutionStatus:null,reviewStatus:null}};
  put(definitionPath,definition);const definitionRef={path:definitionPath,sha256:hash(raw(definitionPath))};
  const semantic=Object.fromEntries(['templateKey','parentProblemTypeKey','canonicalLabelKo','definition','internalSkeleton'].map(k=>[k,tpl[k]]));
  const independent={schemaVersion:'archive-independent-current-definition-application-review-v1',
    reviewer:{id:'independent-reviewer',independentFromRootApprover:'root-reviewer',independentFromProposalPreparer:'proposal-preparer',independentFromNativeAuthor:true,blindReviewClaim:false},
    decision:'APPROVE_EXACT_DEFINITION_AND_CURRENT_UID_APPLICATION',questionUid:uid,sourceOrdinal:1,sourceArchiveFile:source,
    inputRefs:{rootDefinitionApproval:definitionRef,proposal:proposalRef},nativeReviewRef:nativeRef,
    nativeItemRef:{array:'items',sourceOrdinal:1,questionUid:uid,sha256:digest(row)},
    protectedPayloadContract:{fields:REASSESSED_STUDENT_FIELDS},protectedStudentPayloadIdenticalAcrossAllThreeSnapshots:true,
    currentQuestionRawTextRead:true,currentExistingSolutionRead:true,nativeItemRead:true,referencedStudentAssetCount:0,blockingFindings:[],
    sourceSnapshots:[baseCommit,reviewCommit,beforeCommit].map(commit=>({...sourceRef(commit),questionCount:2,selectedOrdinal:1,protectedStudentPayloadSha256:payloadSha})),
    definitionRef:{path:definitionPath,jsonPath:'approvedTemplate',sha256:digest(tpl),semanticDefinition:semantic,semanticDefinitionSha256:digest(semantic)},
    parentRef:{commit:beforeCommit,path:definition.existingParent.path,sha256:definition.existingParent.sha256,problemTypeKey:parent.problemTypeKey,problemTypeSha256:digest(parent)},
    rationaleContinuity:{currentPrimaryMethod:beforeQuestion.primaryMethod,currentDecisiveStep:beforeQuestion.decisiveStep,nativePrimaryMethod:row.primaryMethod,nativeDecisiveStep:row.decisiveStep,currentRationaleIdenticalInAllThreeSources:true},
    currentApplicationDecision:{newTemplateMeaningApproved:true,currentQ21ApplicationApproved:true,existingParentDefinitionChanged:false,unselectedUidApplicationApproved:false},
    preservedLimits:{newFullMathematicalQa:false,newSourceQualityApproval:false,newDifficultyJudgment:false,nativeAcceptedDifficultyReused:true,originalSourceApprovalFlags:{answerStatus:null,solutionStatus:null,reviewStatus:null}},
    nativeAuthorityPreserved:{nativeAfterContainsNewPTTPL:false,nativeProposalRefs:[],retroactiveNativeProposalOrApprovalClaim:false}};
  put(independentPath,independent);let independentRef={path:independentPath,sha256:hash(raw(independentPath))};
  const set={problemTypeKey:parent.problemTypeKey,templateKey:tpl.templateKey,rpmPrimaryId:rpmRecord.id,rpmL1:rp.majorUnit,rpmL2:rp.midUnit,courseKey:'M2-1',integrationPattern:'NONE'};
  Object.assign(currentQuestion,set);for(const k of Object.keys(remove))delete currentQuestion[k];writeBank();
  crosswalk.records.push(direct);put(CROSSWALK,crosswalk);
  const nativeCrosswalk=Buffer.from(git('show',reviewCommit+':'+CROSSWALK)+'\n');
  const application={schemaVersion:'archive-m2s1-current-definition-application-binding-v1',reviewer:'root-reviewer',
    decision:'BIND_APPROVED_CURRENT_DEFINITION_TO_UNCHANGED_STUDENT_PAYLOAD',questionUid:uid,sourceOrdinal:1,sourceArchiveFile:source,expectedQuestionCount:2,
    definitionApprovalRef:definitionRef,independentReviewRef:independentRef,nativeReviewRef:nativeRef,nativeItemStableSha256:digest(row),sourceBeforeRef:beforeRef,
    currentSourceRef:{path:sourcePath,blobSha1:blob(raw(sourcePath)),sha256:hash(raw(sourcePath)),questionStableSha256:digest(currentQuestion)},
    protectedStudentPayloadSha256:payloadSha,noNativeProposal:true,nativeProposalRefs:[],nativeSupportingProposalCount:0,
    approvedTemplateStableSha256:digest(tpl),approvedBindingStableSha256:digest(binding),
    retainedRationale:{primaryMethod:beforeQuestion.primaryMethod,decisiveStep:beforeQuestion.decisiveStep},
    nativeRpmRef:{commit:reviewCommit,path:CROSSWALK,sha256:hash(nativeCrosswalk),recordId:rpmRecord.id,recordSha256:digest(rpmRecord)},sourceMetadataDelta:{set,remove}};
  put(applicationPath,application);
  const after={sourceFingerprint:sourceSha(currentQuestion),contentFingerprint:bodySha(currentQuestion),curriculum:'2022',curriculumKey:'2022',courseKey:'M2-1',
    standardCourse:'중2',standardUnitKey:'M2-03',subUnitKey:beforeQuestion.subUnitKey,problemTypeKey:tpl.parentProblemTypeKey,templateKey:tpl.templateKey,
    ...D5,crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',primaryMethod:currentQuestion.primaryMethod,decisiveStep:currentQuestion.decisiveStep,
    rpmPrimaryId:rpmRecord.id,rpmPrimaryPath:rp,rpmL1:rp.majorUnit,rpmL2:rp.midUnit,rpmL3:rp.l3,rpmL4:rp.l4};
  const item={questionUid:uid,sourceOrdinal:1,before:Object.fromEntries(Object.keys(after).map(k=>[k,stored[k]??null])),after,
    identityBefore:{sourceFingerprint:stored.sourceFingerprint},reason:'Explicit current definition application preserves immutable native review.'};
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'test-current-definition',examUid:'fixture-exam',scope:'PARTIAL_UIDS',
    sourceArchiveFile:source,expectedSourceBlobSha1:blob(raw(sourcePath)),expectedQuestionCount:2,
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'root-reviewer'},items:[item],
    registryChanges:[{path:`${CANON}/packs/h1-foundation/taxonomy.json`,collection:'templates',match:{templateKey:tpl.templateKey},before:null,after:tpl},
      {path:`${CANON}/packs/middle2/bindings.json`,collection:'bindings',match:Object.fromEntries(['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'].map(k=>[k,binding[k]])),before:null,after:binding}]};
  const publishEvidence=()=>{
    put(definitionPath,definition);const defRef={path:definitionPath,sha256:hash(raw(definitionPath))};
    independent.inputRefs.rootDefinitionApproval=defRef;put(independentPath,independent);independentRef={path:independentPath,sha256:hash(raw(independentPath))};
    application.definitionApprovalRef=defRef;application.independentReviewRef=independentRef;put(applicationPath,application);
    const appRef={path:applicationPath,sha256:hash(raw(applicationPath))},evidenceCommit=commit('Current definition and independent application evidence');
    const evidenceRefs=[localNativeRef,proposalRef,defRef,independentRef,appRef];request.approval.evidenceRefs=evidenceRefs;item.evidenceRefs=evidenceRefs;
    for(const change of request.registryChanges)change.evidenceRefs=evidenceRefs;
    item.sourceReview={schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit,reviewPath:nativePath,reviewRef:localNativeRef,
      currentDefinitionApplication:{schemaVersion:'archive-m2s1-current-definition-application-v1',evidenceCommit,definitionApprovalRef:defRef,independentReviewRef:independentRef,applicationRef:appRef}};
  };
  publishEvidence();
  const receiptPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`;
  const retargetCurrent=()=>{writeBank();request.expectedSourceBlobSha1=blob(raw(sourcePath));Object.assign(item.after,{sourceFingerprint:sourceSha(currentQuestion),contentFingerprint:bodySha(currentQuestion)});
    application.currentSourceRef={path:sourcePath,blobSha1:blob(raw(sourcePath)),sha256:hash(raw(sourcePath)),questionStableSha256:digest(currentQuestion)};publishEvidence();};
  const nativeReuse=(selectedReceiptPath=receiptPath)=>{
    const receipt=read(selectedReceiptPath),current=read(META).records.find(r=>r.questionUid===uid),identity=read(IDENTITY).records.find(r=>r.questionUid===uid);
    const runtime=read('archive/data/meta-foundation/runtime/middle2-v1.json').records.find(r=>r.questionUid===uid);
    const bytes=execFileSync('git',['cat-file','blob',receipt.sourceBlobSha1],{cwd:root});
    return validateNativeReviewedSourceReuse(receipt,{root,bytes,blobSha1:receipt.sourceBlobSha1,bank:bank(bytes),runtimeRecord:runtime},
      currentQuestion,identity,1,current,loadActiveMetaRegistry(root));
  };
  return{root,put,read,raw,git,commit,request,item,review,row,uid,held,sourcePath,currentQuestion,currentNeighbour,writeBank,retargetCurrent,
    definition,independent,application,definitionPath,independentPath,applicationPath,nativePath,publishEvidence,receiptPath,nativeReuse};
}

test('current definition: actual write, replay and typed native source reuse preserve the native record and held neighbour',t=>{
  const f=applicationFixture(t),nativeBytes=f.raw(f.nativePath),sourceBytes=f.raw(f.sourcePath),held=f.read(META).records[1];
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,'PASS');
  const receipt=f.read(f.receiptPath),proof=receipt.fingerprintRepairs[0].sourceReview;
  assert.deepEqual(receipt.appliedRecords.map(r=>r.questionUid),[f.uid]);assert.deepEqual(f.read(META).records[1],held);
  assert.equal(f.read(META).records[0].standardCourse,'중2');
  assert.equal(proof.currentDefinitionApplication.retainedStandardCourseOrigin,'UNCHANGED_NATIVE_AND_CURRENT_SOURCE_EXACT_BINDING');
  assert.deepEqual(f.raw(f.nativePath),nativeBytes);assert.deepEqual(f.raw(f.sourcePath),sourceBytes);
  assert.equal(proof.currentDefinitionApplication.nativeAfterChanged,false);assert.equal(proof.currentDefinitionApplication.nativeProposalFabricated,false);
  assert.equal(proof.rationaleBindings.primaryMethod.origin,'CURRENT_DEFINITION_APPLICATION_UNCHANGED_NATIVE_SOURCE');
  assert.equal(proof.rpmBindings.rpmPrimaryId.origin,'CURRENT_DEFINITION_APPLICATION_NATIVE_RPM_ALIAS');
  const binding=f.read(reviewedSourceBindingPath(f.request.requestId));assert.equal(binding.records.length,1);assert.equal(binding.records[0].questionUid,f.uid);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);
  assert.equal(f.nativeReuse(),true);
});

test('current definition: missing or changed independent evidence fails closed before any writes',async t=>{
  for(const [name,mutate]of[
    ['not bound to item',f=>{f.item.evidenceRefs=f.item.evidenceRefs.filter(r=>r.path!==f.independentPath);}],
    ['not bound to approval',f=>{f.request.approval.evidenceRefs=f.request.approval.evidenceRefs.filter(r=>r.path!==f.independentPath);}],
    ['missing original file',f=>fs.rmSync(path.join(f.root,f.independentPath))],
    ['changed original bytes',f=>f.put(f.independentPath,{...f.independent,decision:'UNREVIEWED'})],
    ['new local SHA cannot replace immutable review',f=>{f.put(f.independentPath,{...f.independent,decision:'UNREVIEWED'});const ref=f.item.sourceReview.currentDefinitionApplication.independentReviewRef;ref.sha256=hash(f.raw(f.independentPath));}],
    ['reviewer collision in newly bound evidence',f=>{f.independent.reviewer.id='root-reviewer';f.publishEvidence();}],
  ])await t.test(name,t=>{const f=applicationFixture(t);mutate(f);const before=f.raw(META);assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/evidence|reference|SHA|independent|current definition application/i);assert.deepEqual(f.raw(META),before);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);});
});

test('current definition: a real native proposal, native hold or false absence assertion cannot be promoted',async t=>{
  for(const [name,make,mutate]of[
    ['native proposal selects UID',()=>({mutateNative:({review,row,uid})=>{review.proposals=[{id:'native-new-template',type:'TPL',supportingQuestionUids:[uid],supportOrdinals:[1]}];row.proposalRefs=['native-new-template'];}})],
    ['native source hold',()=>({mutateNative:({row})=>{row.contentDebt=['SOURCE_CONDITION_UNRESOLVED'];}})],
    ['native difficulty hold',()=>({mutateNative:({row})=>{row.registrationDebt.push('DIFFICULTY_HOLD');}})],
    ['false no-proposal flag',()=>({}),f=>{f.application.noNativeProposal=false;f.publishEvidence();}],
  ])await t.test(name,t=>{const f=applicationFixture(t,make());mutate?.(f);assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/native.*proposal|source.*hold|difficulty.*hold|current definition application/i);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);});
});

test('current definition: unapproved template, binding, alias, scope and student deltas are rejected',async t=>{
  for(const [name,mutate,expected]of[
    ['new template meaning changed',f=>{f.request.registryChanges[0].after={...f.request.registryChanges[0].after,definition:'unreviewed meaning'};},/template|definition|approval/i],
    ['binding parent changed',f=>{f.request.registryChanges[1].after={...f.request.registryChanges[1].after,L2:'unreviewed parent'};},/binding|parent|application/i],
    ['source RPM alias changed',f=>{f.currentQuestion.rpmL1='unreviewed RPM parent';f.item.after.rpmL1=f.currentQuestion.rpmL1;f.retargetCurrent();},/RPM.*conflict|RPM.*disagree|RPM provenance|application/i],
    ['2022 scope absent',f=>{const p=`${CANON}/packs/middle2/pack.json`,d=f.read(p);d.curricula=['2015'];f.put(p,d);},/scope|pack|curricul/i],
    ['student answer changed with truthful current hashes',f=>{f.currentQuestion.answer='7';f.retargetCurrent();},/student payload|source.*fingerprint|current.*payload/i],
    ['source approval flag added',f=>{f.currentQuestion.solutionStatus='APPROVED';f.retargetCurrent();},/whole question|metadata delta|approval flags/i],
    ['rationale replaced',f=>{f.currentQuestion.decisiveStep='new rationale';f.item.after.decisiveStep='new rationale';f.retargetCurrent();},/rationale/i],
  ])await t.test(name,t=>{const f=applicationFixture(t);mutate(f);const before=f.raw(META);assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),expected);assert.deepEqual(f.raw(META),before);});
});

test('current definition: replay and native reuse reject erased proof or typed source-binding sidecar',async t=>{
  for(const [name,mutate]of[
    ['receipt proof erased',f=>{const r=f.read(f.receiptPath);delete r.fingerprintRepairs[0].sourceReview.currentDefinitionApplication;f.put(f.receiptPath,r);}],
    ['typed binding removed',f=>fs.rmSync(path.join(f.root,reviewedSourceBindingPath(f.request.requestId)))],
    ['independent original removed',f=>fs.rmSync(path.join(f.root,f.independentPath))],
  ])await t.test(name,t=>{const f=applicationFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(f.nativeReuse(),true);mutate(f);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request}),/source.review|evidence|missing|proof|binding/i);
    assert.throws(()=>f.nativeReuse(),/source.review|evidence|missing|proof|binding|ENOENT/i);});
});

test('current definition: typed native reuse tolerates an unrelated RPM append and a later unselected source metadata change',t=>{
  const f=applicationFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(f.nativeReuse(),true);
  const cross=f.read(CROSSWALK);cross.records.push({id:'UNRELATED-RPM-APPEND',curriculum:'2022',scope:'M2-1',rpmPath:{majorUnit:'other',midUnit:'other',l3:'other',l4:'other'}});f.put(CROSSWALK,cross);
  f.currentNeighbour.editorialNote='Another UID changed after this independent review';f.writeBank();
  assert.equal(f.nativeReuse(),true);
});

test('current definition: actual source-only partial write issues a new receipt and reuses current source bytes and runtime',t=>{
  const f=applicationFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const priorRef={path:f.receiptPath,sha256:hash(f.raw(f.receiptPath))},priorReceipt=f.read(f.receiptPath);
  f.currentNeighbour.editorialNote='A later, unselected source metadata change';f.writeBank();
  const currentBytes=f.raw(f.sourcePath),currentBlob=f.git('hash-object','-w',f.sourcePath);
  assert.notEqual(currentBlob,priorReceipt.sourceBlobSha1);
  const request={schemaVersion:f.request.schemaVersion,requestId:'test-current-definition-source-rebind',scope:'PARTIAL_UIDS',
    examUid:f.request.examUid,sourceArchiveFile:f.request.sourceArchiveFile,expectedSourceBlobSha1:currentBlob,expectedQuestionCount:2,
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'root-reviewer',evidenceRefs:[...f.request.approval.evidenceRefs,priorRef],sourceRebind:{priorReceiptRef:priorRef}},
    items:[{questionUid:f.uid,sourceOrdinal:1,before:{},after:{},reason:'Preserve the exact reviewed question after another UID changes.',evidenceRefs:f.item.evidenceRefs}]};
  const result=registerReviewedExamV2({root:f.root,request,write:true});
  assert.equal(result.status,'PASS');assert.equal(result.newMetadataApprovals,0);assert.equal(result.preservedMetadataApprovals,1);
  const receiptPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`,receipt=f.read(receiptPath);
  assert.equal(receipt.sourceBlobSha1,currentBlob);assert.equal(receipt.sourceRawSha256,hash(currentBytes));
  assert.deepEqual(receipt.approval.sourceRebind.priorReceiptRef,priorRef);
  assert.deepEqual(receipt.appliedRecords.map(r=>r.questionUid),[f.uid]);
  assert.equal(registerReviewedExamV2({root:f.root,request}).replay,true);
  assert.equal(f.nativeReuse(receiptPath),true);
  assert.deepEqual(f.raw(f.sourcePath),currentBytes);
});

test('current definition: changing the omitted neighbour inside the initial evidence commit is rejected',t=>{
  const f=applicationFixture(t);f.currentNeighbour.editorialNote='Unselected change inside the initial application evidence';f.retargetCurrent();
  const metadataBefore=f.raw(META);
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/immutable application changed an unselected question/);
  assert.deepEqual(f.raw(META),metadataBefore);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
});
