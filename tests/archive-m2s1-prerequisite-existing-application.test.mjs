// Focused tests use synthetic native/current snapshots in temporary Git fixtures.
// They never issue a production approval, modify source QA, or mutate the repository.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const repo=path.resolve(process.env.ARCHIVE_TEST_REPO||new URL('..',import.meta.url).pathname);
const mod=p=>import(pathToFileURL(path.join(repo,p)).href);
const {registerReviewedExamV2}=await mod('archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
const {REASSESSED_STUDENT_FIELDS}=await mod('archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
const {validateNativeReviewedSourceReuse}=await mod('archive/tools/meta-foundation/native-reviewed-source-reuse.mjs');
const {loadActiveMetaRegistry}=await mod('archive/tools/meta-foundation/active-registry.mjs');
const {reviewedSourceBindingPath}=await mod('archive/tools/meta-foundation/reviewed-source-binding.mjs');
const {validateRpmPrimaryProvenance}=await mod('archive/tools/meta-foundation/reviewed-rpm-provenance.mjs');
const C='archive/data/meta-foundation/canonical',META='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const M1='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json',M2='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const PT='PT_M1_LINEAR_EQUATION_MODELING',TPL='TPL_M1_LINEAR_EQUATION_MODEL_QUANTITY';
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=v=>hash(stable(v));
const blob=b=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
const payload=q=>Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k=>[k,Object.hasOwn(q,k)?q[k]:null]));
const sourceSha=q=>hash(JSON.stringify({content:q.content??null,choices:q.choices??null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const bodySha=q=>hash(JSON.stringify({content:q.content??null,choices:q.choices??null,image:q.image??null}));
const json=v=>JSON.stringify(v,null,2)+'\n';
const bank=bytes=>{const c={window:{},console};vm.runInNewContext(bytes.toString(),c);return JSON.parse(JSON.stringify(c.window.questions));};

function fixture(t,{mutateNative,legacyNativeRpmPath=false}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'archive-prerequisite-existing-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const put=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:json(v));};
  const raw=p=>fs.readFileSync(path.join(root,p)),read=p=>JSON.parse(raw(p));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');git('config','user.name','Test fixture');git('config','user.email','fixture@example.invalid');
  const commit=label=>{git('add','--all');git('commit','--allow-empty','-qm',label);return git('rev-parse','HEAD');};
  const source='original/middle/m2/1final/prerequisite-fixture.js',sourcePath='archive/exams/'+source;
  const uid='qid_v1_'+hash(source+'#1'),heldUid='qid_v1_'+hash(source+'#2');
  const nativePath='docs/native.json',proposalPath='docs/proposal.json',approvalPath='docs/root-approval.json',
    independentPath='docs/independent.json',applicationPath='docs/application.json';
  const d5={level:'중',difficultyBucket:2,difficultyConfidence:'medium',difficultyBoundaryFlag:'B12',legacyLevelCompatibility:'NORMAL'};
  const rp={majorUnit:'문자와 식',midUnit:'일차방정식의 활용',l3:'수와 관계',l4:'나이·개수 관계'};
  const target={scope:'M2-1',standardCourse:'중2 수학',standardUnitKey:'M2-03',subUnitKey:'M2-03-SIMULTANEOUS_LINEAR_EQUATION',
    majorUnit:'일차부등식과 연립일차방정식',midUnit:'연립일차방정식',rpmEffectiveParentKey:null,provenance:'SOURCE_EXPLICIT_PRESERVED'};
  const remove={projectionStatus:'BINDING_PENDING',ownerPack:null,nullReason:'Existing pair has no target binding.',projectionReason:'Prerequisite and target scopes differ.'};
  const beforeQuestion={id:1,content:'One sibling is 5 years older than each of three same-age younger siblings. Their ages sum to 21.',
    choices:[],answer:'9',solution:'Let a younger age be x. Then (x+5)+3x=21 gives x=4 and the older age is 9.',image:'',
    curriculum:'2015',standardCourse:target.standardCourse,standardUnitKey:target.standardUnitKey,subUnitKey:target.subUnitKey,
    targetNamespace:target,problemTypeKey:null,templateKey:null,crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',...d5,
    primaryMethod:'Represent the common younger age by x.',decisiveStep:'(x+5)+3x=21 gives older age 9.',
    rpmPrimaryRecordId:'M1-RPM-042',rpmPrimaryPath:rp,rpmL3:rp.l3,rpmL4:rp.l4,
    semanticSourceScope:'M1-1',semanticScopeRelation:'PREREQUISITE_LOWER_GRADE',...remove};
  const question=structuredClone(beforeQuestion),neighbour={id:2,content:'Unselected held question',answer:'unknown',solution:'',sourceIssueHold:true};
  if(legacyNativeRpmPath)Object.assign(question,{rpmPrimaryRecordId:'M2-RPM-038',
    rpmPrimaryPath:{majorUnit:target.majorUnit,midUnit:'연립일차방정식의 활용',l3:'수와 개수',l4:'두 수 관계'},
    rpmL3:'수와 개수',rpmL4:'두 수 관계',semanticSourceScope:'M2-1',semanticScopeRelation:'TARGET_SCOPE'});
  const writeBank=()=>put(sourcePath,`window.questions = ${JSON.stringify([question,neighbour])};\n`);
  writeBank();
  const stored={questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:'1',reviewStatus:'review_required',
    sourceFingerprint:sourceSha({...beforeQuestion,content:'An older stored version'}),contentFingerprint:bodySha(beforeQuestion),
    standardCourse:target.standardCourse,standardUnitKey:target.standardUnitKey,subUnitKey:target.subUnitKey,
    problemTypeKey:'',templateKey:'',difficultyBucket:2,difficultyConfidence:'medium',difficultyBoundaryFlag:'B12',legacyLevelCompatibility:'NORMAL'};
  const held={questionUid:heldUid,sourceArchiveFile:source,sourceOrdinal:2,sourceQuestionNo:'2',sourceFingerprint:'held-old',
    reviewStatus:'manual_review',metadataStatus:'approved_partial_with_explicit_holds',problemTypeKey:'',templateKey:null};
  put(META,{records:[stored,held],counts:{}});put(ID,{records:[{questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:'1',sourceFingerprint:stored.sourceFingerprint},held]});
  const pt={problemTypeKey:PT,canonicalLabelKo:'한 미지수 수량 관계 모델',definition:'Model quantity relations with one unknown.',
    aliases:[],status:'ACTIVE',ownerPack:'MIDDLE1',supportingQuestionUids:['existing-support'],supportingItemCount:1};
  const tpl={templateKey:TPL,parentProblemTypeKey:PT,canonicalLabelKo:'수량 관계 일차방정식',definition:'Express related quantities as one linear equation.',
    aliases:[],status:'ACTIVE',ownerPack:'MIDDLE1',supportingQuestionUids:['existing-support'],supportingItemCount:1};
  const canonicalSources=[];
  for(const [id,slug,courses,domains]of[['MIDDLE1','middle1',['중1 수학','M1-1'],['M1-03']],['MIDDLE2','middle2',['중2 수학','M2-1'],['M2-03']]]){
    const b=`${C}/packs/${slug}`;
    put(b+'/pack.json',{schemaVersion:'meta-foundation-pack-v1',packId:id,packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:courses,ownedStandardUnitDomains:domains});
    put(b+'/taxonomy.json',{status:'ACTIVE',problemTypes:id==='MIDDLE1'?[pt]:[],templates:id==='MIDDLE1'?[tpl]:[]});
    put(b+'/bindings.json',{status:'ACTIVE',bindings:[]});put(b+'/aliases.json',{aliases:[]});
    for(const n of ['pack','taxonomy','bindings','aliases'])canonicalSources.push({path:b+'/'+n+'.json'});
  }
  put(`${C}/condition_registry.json`,{schemaVersion:'meta-foundation-condition-registry-v1',status:'ACTIVE',owner:'CONDITION_CORE',conditions:[],conditionCount:0});
  put(`${C}/metadata_rules.json`,{status:'ACTIVE',integrationPatterns:['NONE','SEQUENTIAL','INTERDEPENDENT','REINTERPRETATION','CASE_BRANCH','DEEP_COMPOSITE']});
  canonicalSources.push({path:`${C}/condition_registry.json`},{path:`${C}/metadata_rules.json`});
  put(`${C}/registry_index.json`,{schemaVersion:'meta-foundation-registry-index-v1',status:'ACTIVE',activePacks:['MIDDLE1','MIDDLE2'].map(id=>({id,version:'1.0.0',status:'ACTIVE'})),
    activeConceptShards:[],conditionRegistry:{id:'CONDITION_CORE',version:'1',status:'ACTIVE'},canonicalSources,
    compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled'].map(n=>({path:`archive/data/meta-foundation/compiled/${n}.json`}))});
  put('archive/data/master_tables/js_archive_tag_master.json',[{key:'M2-03',keyType:'standardUnitKey',labelKo:target.majorUnit,status:'active'},
    {key:target.subUnitKey,keyType:'subUnitKey',parentKey:'M2-03',standardUnitKey:'M2-03',labelKo:target.midUnit,status:'active'}]);
  const leaf={problemType:rp.l4},parent={curriculum:'2015',scope:'M2-1',majorUnit:target.majorUnit,midUnit:target.midUnit,concepts:[]};
  put(MASTER,{schemaVersion:'js-archive-taxonomy-rpm-primary-v1.0',authorityStatus:'LOCKED',records:[
    {curriculum:'2015',scope:'M1-1',majorUnit:rp.majorUnit,midUnit:rp.midUnit,concepts:[{concept:rp.l3,problemTypes:[leaf]}]},parent]});
  const record={id:'M1-RPM-042',curriculum:'2015',scope:'M1-1',rpmPath:rp,mappingStatus:'RPM_ONLY',bindingStatus:'NO_ACTIVE_MAPPING'};
  const targetRow={id:'M2-RPM-030',curriculum:'2015',scope:'M2-1',standardUnitKey:target.standardUnitKey,subUnitKey:target.subUnitKey,
    rpmPath:{majorUnit:target.majorUnit,midUnit:target.midUnit,l3:'Target lookup',l4:'Target lookup'},mappingStatus:'RPM_ONLY',bindingStatus:'NO_ACTIVE_MAPPING'};
  const cross=rows=>({schemaVersion:'rpm-primary-active-crosswalk-v1',status:'ACTIVE_REFERENCE',rpmAuthority:{source:MASTER},records:rows});
  put(M1,cross([record]));put(M2,cross([targetRow]));fs.mkdirSync(path.join(root,'archive/data/meta-foundation/runtime'),{recursive:true});
  const base=commit('Synthetic native source baseline'),sourceBlob=blob(raw(sourcePath));
  const row={questionUid:uid,sourceOrdinal:1,verdict:'REGISTRATION_PENDING',rpmDecision:'CORRECT',rpmRecordId:record.id,
    primaryMethod:'Model the younger sibling age.',decisiveStep:'Solve the total-age equation.',
    fieldReview:{classification:'A one-unknown quantity equation is a prerequisite within the explicit M2 target.',difficulty:'Reuse the accepted ordinary linear-equation difficulty.'},
    after:{crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE'},finalDifficulty:{...d5},proposalRefs:[],contentDebt:[],
    registrationDebt:['ACTIVE_SCOPED_PT_TPL_BINDING_NOT_ESTABLISHED'],
    semanticDecision:{semanticCurriculum:'2015',machineCurriculum:'2015',semanticScope:'M1-1',semanticScopeRelation:'PREREQUISITE_LOWER_GRADE',
      semanticSourceScope:'2015|중1 수학|M1-03|M1-03-LINEAR_EQUATION_WORD|M1-RPM-042',rpmPath:rp,rpmBasePath:rp,semanticSourcePath:rp,targetNamespace:target}};
  const review={schemaVersion:'m2-s1-meta-review-v1',owner:'native-author',sourceArchiveFile:source,sourceGitBlobSha:sourceBlob,baseSha:base,
    reviewedQuestionCount:2,proposals:[],items:[row,{questionUid:heldUid,sourceOrdinal:2,verdict:'UNRESOLVED',rpmDecision:'UNRESOLVED',after:{},decisiveStep:'Held neighbour'}]};
  mutateNative?.({review,row});put(nativePath,review);const reviewCommit=commit('Synthetic native review');
  if(legacyNativeRpmPath){Object.assign(question,{rpmPrimaryRecordId:beforeQuestion.rpmPrimaryRecordId,rpmPrimaryPath:structuredClone(rp),
    rpmL3:rp.l3,rpmL4:rp.l4,semanticSourceScope:'M1-1',semanticScopeRelation:'PREREQUISITE_LOWER_GRADE'});writeBank();}
  const beforeCommit=commit('Current source before application'),independentCommit=commit('Independent source observation');
  const ref=(p,commit=beforeCommit)=>({commit,path:p,sha256:hash(raw(p))});
  const sourceRef=commit=>{const bytes=execFileSync('git',['show',commit+':'+sourcePath],{cwd:root});return{commit,path:sourcePath,sha256:hash(bytes),blobSha1:blob(bytes)};};
  const beforeRef=sourceRef(beforeCommit),nativeRef=ref(nativePath,reviewCommit),nativeLocal={path:nativePath,sha256:nativeRef.sha256};
  const payloadSha=digest(payload(beforeQuestion)),flags=Object.fromEntries(['answerStatus','solutionStatus','reviewStatus'].map(k=>[k,{present:false,value:null}]));
  const binding={curriculum:'2015',standardCourse:target.standardCourse,standardUnitKey:target.standardUnitKey,subUnitKey:target.subUnitKey,
    problemTypeKey:PT,ownerPack:'MIDDLE2',status:'ACTIVE',L1:target.majorUnit,L2:target.midUnit,supportingQuestionUids:[uid],supportingItemCount:1};
  const set={problemTypeKey:PT,templateKey:TPL,rpmPrimaryId:record.id,rpmL1:rp.majorUnit,rpmL2:rp.midUnit,courseKey:'M2-1'};
  const semantic={record,crosswalkRef:ref(M1),recordStableSha256:digest(record),masterRef:ref(MASTER),leafStableSha256:digest(leaf)};
  const targetParentRef={path:MASTER,sha256:hash(raw(MASTER)),curriculum:'2015',scope:'M2-1',majorUnit:target.majorUnit,midUnit:target.midUnit};
  const existingDefinitions={taxonomyRef:ref(`${C}/packs/middle1/taxonomy.json`),problemType:pt,template:tpl,
    problemTypeStableSha256:digest(pt),templateStableSha256:digest(tpl),mustRemainByteSemanticEqual:true};
  const proposal={questionUid:uid,sourceOrdinal:1,sourceArchiveFile:source,expectedQuestionCount:2,protectedPayloadContract:{sha256:payloadSha},sourceMetadataDelta:{set,remove}};
  put(proposalPath,proposal);const proposalRef={path:proposalPath,sha256:hash(raw(proposalPath))};
  const independent={schemaVersion:'archive-independent-existing-definition-application-review-v1',decision:'APPROVE_EXISTING_DEFINITIONS_AND_EXACT_CURRENT_UID_APPLICATION',
    questionUid:uid,sourceOrdinal:1,sourceArchiveFile:source,reviewer:{id:'independent-reviewer',independentFromRootApprover:'root-reviewer',independentFromProposalPreparer:'preparer',independentFromNativeAuthor:'native-author',blindReviewClaim:false},
    proposalRef,nativeReviewRef:nativeRef,nativeItemRef:{questionUid:uid,sourceOrdinal:1,sha256:digest(row)},
    protectedPayloadContract:{fields:REASSESSED_STUDENT_FIELDS,sha256:payloadSha},protectedStudentPayloadIdenticalAcrossAllFourSnapshots:true,
    currentQuestionRawTextRead:true,currentExistingSolutionRead:true,nativeItemRead:true,referencedStudentAssetCount:0,blockingFindings:[],
    currentApplicationDecision:{existingPtTplMeaningUnchanged:true,exactCurrentUidApplicationApproved:true,newDefinitionApproved:false,unselectedUidApplicationApproved:false},
    preservedLimits:{newFullMathematicalQa:false,newSourceQualityApproval:false,newDifficultyJudgment:false,nativeAcceptedDifficultyReused:true,
      fingerprintReplacementWithoutTypedProofAllowed:false,originalSourceApprovalFlags:flags},
    nativeAuthorityPreserved:{nativeProposalRefs:[],nativeDocumentProposalCount:0,nativeAfterContainsApprovedCurrentPtTpl:false,retroactiveNativeProposalOrApprovalClaim:false},
    sourceSnapshots:[base,reviewCommit,beforeCommit,independentCommit].map(commit=>({...sourceRef(commit),questionCount:2,selectedOrdinal:1,protectedStudentPayloadSha256:payloadSha,
      selectedWholeQuestionSha256:digest(bank(execFileSync('git',['show',commit+':'+sourcePath],{cwd:root}))[0])})),
    existingDefinitions:{taxonomyRef:ref(`${C}/packs/middle1/taxonomy.json`,independentCommit),problemTypeKey:PT,templateKey:TPL,
      problemTypeSha256:digest(pt),templateSha256:digest(tpl),definitionChangesApproved:0,newDefinitionsApproved:0},
    semanticRpm:{crosswalkRef:ref(M1,independentCommit),masterRef:ref(MASTER,independentCommit),recordId:record.id,recordSha256:digest(record),leafSha256:digest(leaf),activeCrosswalkMappingClaim:false},
    targetNamespace:{parentSha256:digest(parent),targetLookupRef:{...ref(M2,independentCommit),recordId:targetRow.id,recordSha256:digest(targetRow)}},
    approvedExactBindingApplication:{proposedBinding:binding,proposedBindingSha256:digest(binding),currentExactBindingExists:false,unselectedUidApplicationApproved:false},
    rationaleContinuity:{currentPrimaryMethod:beforeQuestion.primaryMethod,currentDecisiveStep:beforeQuestion.decisiveStep,nativePrimaryMethod:row.primaryMethod,nativeDecisiveStep:row.decisiveStep,sourceRationaleIdenticalAcrossAllFourSnapshots:true}};
  const approval={schemaVersion:'middle-audit-prerequisite-existing-definition-current-approval-v1',decision:'APPROVE_EXISTING_DEFINITIONS_EXACT_UID_AND_TARGET_BINDING',
    questionUid:uid,sourceOrdinal:1,sourceArchiveFile:source,expectedQuestionCount:2,reviewer:'root-reviewer',owner:'root-reviewer',preparedBy:'preparer',nativeReviewer:'native-author',
    proposalRef,nativeReviewRef:nativeRef,sourceBeforeRef:beforeRef,approvedProtectedStudentPayloadSha256:payloadSha,
    existingDefinitions,semanticRpm:semantic,targetNamespace:{...target,targetMasterParentStableSha256:digest(parent),lookupRowRef:{...ref(M2),recordId:targetRow.id,recordStableSha256:digest(targetRow)}},
    targetParentRef,approvedBinding:binding,existingDefinitionChanges:0,newDefinitions:0,crosswalkChanges:0,newBindings:1,
    unselectedUidApplicationApproved:false,nativeProposalFabricated:false,newMathematicalQa:false,newSourceQualityApproval:false,newDifficultyJudgment:false,
    sourceMetadataDelta:{set,remove},originalSourceApprovalFlags:flags};
  Object.assign(question,set);for(const k of Object.keys(remove))delete question[k];writeBank();
  const application={schemaVersion:'archive-m2s1-prerequisite-existing-application-binding-v1',reviewer:'root-reviewer',decision:'BIND_EXISTING_DEFINITION_APPLICATION_AND_SEPARATE_PREREQUISITE_SCOPE',
    questionUid:uid,sourceOrdinal:1,sourceArchiveFile:source,expectedQuestionCount:2,nativeReviewRef:nativeRef,nativeItemStableSha256:digest(row),sourceBeforeRef:beforeRef,
    currentSourceRef:{path:sourcePath,blobSha1:blob(raw(sourcePath)),sha256:hash(raw(sourcePath)),questionStableSha256:digest(question)},
    protectedStudentPayloadSha256:payloadSha,problemTypeSha256:digest(pt),templateSha256:digest(tpl),bindingSha256:digest(binding),sourceMetadataDelta:{set,remove},
    retainedRationale:{primaryMethod:question.primaryMethod,decisiveStep:question.decisiveStep},nativeProposalRefs:[],newMathematicalQa:false};
  const after={...d5,standardCourse:target.standardCourse,standardUnitKey:target.standardUnitKey,subUnitKey:target.subUnitKey,
    problemTypeKey:PT,templateKey:TPL,crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',primaryMethod:question.primaryMethod,decisiveStep:question.decisiveStep,
    curriculum:'2015',curriculumKey:'2015',courseKey:'M2-1',rpmPrimaryId:record.id,rpmPrimaryPath:rp,rpmL1:rp.majorUnit,rpmL2:rp.midUnit,rpmL3:rp.l3,rpmL4:rp.l4,
    semanticSourceScope:'M1-1',semanticScopeRelation:'PREREQUISITE_LOWER_GRADE',sourceFingerprint:sourceSha(question),contentFingerprint:bodySha(question)};
  const item={questionUid:uid,sourceOrdinal:1,before:Object.fromEntries(Object.keys(after).map(k=>[k,stored[k]??null])),after,
    identityBefore:{sourceFingerprint:stored.sourceFingerprint},reason:'Separate reviewed prerequisite semantics from the unchanged target.',targetParentRef};
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'test-prerequisite-existing',examUid:'prerequisite-fixture',scope:'PARTIAL_UIDS',
    sourceArchiveFile:source,expectedSourceBlobSha1:blob(raw(sourcePath)),expectedQuestionCount:2,approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'root-reviewer'},
    registryChanges:[{path:`${C}/packs/middle2/bindings.json`,collection:'bindings',match:Object.fromEntries(['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'].map(k=>[k,binding[k]])),before:null,after:binding}],items:[item]};
  const publish=()=>{
    put(independentPath,independent);const independentRef={path:independentPath,sha256:hash(raw(independentPath))};
    approval.independentReviewRef=independentRef;put(approvalPath,approval);const approvalRef={path:approvalPath,sha256:hash(raw(approvalPath))};
    application.rootApprovalRef=approvalRef;application.independentReviewRef=independentRef;put(applicationPath,application);
    const applicationRef={path:applicationPath,sha256:hash(raw(applicationPath))},evidenceCommit=commit('Synthetic immutable current application');
    const refs=[nativeLocal,proposalRef,approvalRef,independentRef,applicationRef,{path:MASTER,sha256:targetParentRef.sha256}];
    request.approval.evidenceRefs=refs;item.evidenceRefs=refs;request.registryChanges[0].evidenceRefs=refs;
    item.sourceReview={schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit,reviewPath:nativePath,reviewRef:nativeLocal,
      prerequisiteExistingApplication:{schemaVersion:'archive-m2s1-prerequisite-existing-application-v1',evidenceCommit,rootApprovalRef:approvalRef,independentReviewRef:independentRef,applicationRef}};
  };
  publish();
  const retarget=()=>{writeBank();request.expectedSourceBlobSha1=blob(raw(sourcePath));item.after.sourceFingerprint=sourceSha(question);item.after.contentFingerprint=bodySha(question);
    application.currentSourceRef={path:sourcePath,blobSha1:blob(raw(sourcePath)),sha256:hash(raw(sourcePath)),questionStableSha256:digest(question)};publish();};
  const receiptPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`;
  const reuse=(selectedReceiptPath=receiptPath)=>{const receipt=read(selectedReceiptPath),m=read(META).records[0],id=read(ID).records[0],runtime=read('archive/data/meta-foundation/runtime/middle2-v1.json').records[0];
    const bytes=execFileSync('git',['cat-file','blob',receipt.sourceBlobSha1],{cwd:root});
    return validateNativeReviewedSourceReuse(receipt,{root,bytes,blobSha1:receipt.sourceBlobSha1,bank:bank(bytes),runtimeRecord:runtime},question,id,1,m,loadActiveMetaRegistry(root));};
  return {root,put,read,raw,git,commit,request,item,review,row,question,neighbour,beforeQuestion,record,held,uid,sourcePath,nativePath,approvalPath,independentPath,applicationPath,
    approval,independent,application,retarget,publish,writeBank,receiptPath,reuse,pt,tpl};
}

test('existing prerequisite: official write/replay/native reuse bind M1 meaning to M2 target without definition or native changes',t=>{
  const f=fixture(t),native=f.raw(f.nativePath),source=f.raw(f.sourcePath),definition=f.raw(`${C}/packs/middle1/taxonomy.json`),held=f.read(META).records[1];
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,'PASS');
  const receipt=f.read(f.receiptPath),record=f.read(META).records[0],proof=receipt.fingerprintRepairs[0].sourceReview;
  assert.equal(record.rpmPrimaryId,'M1-RPM-042');assert.equal(record.courseKey,'M2-1');
  assert.equal(record.semanticSourceScope,'M1-1');assert.equal(record.semanticScopeRelation,'PREREQUISITE_LOWER_GRADE');
  assert.equal(receipt.rpmPrimaryBindings[0].prerequisiteScopeBinding.registeredTargetScope,'M2-1');
  assert.equal(proof.prerequisiteExistingApplication.newDefinitions,0);assert.equal(proof.prerequisiteExistingApplication.newBindings,1);
  assert.equal(proof.prerequisiteExistingApplication.nativeProposalFabricated,false);
  assert.equal(proof.rationaleBindings.primaryMethod.origin,'PREREQUISITE_EXISTING_APPLICATION_UNCHANGED_NATIVE_SOURCE');
  assert.deepEqual(f.read(META).records[1],held);assert.deepEqual(f.raw(f.nativePath),native);assert.deepEqual(f.raw(f.sourcePath),source);assert.deepEqual(f.raw(`${C}/packs/middle1/taxonomy.json`),definition);
  assert.equal(f.read(reviewedSourceBindingPath(f.request.requestId)).records.length,1);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);assert.equal(f.reuse(),true);
});

test('existing prerequisite: ordinary RPM scope guard, direct-source guard and unforgeable capability remain closed',t=>{
  const f=fixture(t),args={root:f.root,question:f.question,final:f.item.after};
  assert.throws(()=>validateRpmPrimaryProvenance(args),/record curriculum\/scope mismatch/);
  assert.throws(()=>validateRpmPrimaryProvenance({...args,prerequisiteAuthority:{semanticScope:'M1-1',registeredTargetScope:'M2-1',scopeRelation:'PREREQUISITE_LOWER_GRADE'}}),/record curriculum\/scope mismatch/);
  const q={...f.question};delete q.rpmPrimaryId;
  assert.throws(()=>validateRpmPrimaryProvenance({...args,question:q}),/exact declared source value/);
  const final={...f.item.after,courseKey:'M1-1'};
  assert.equal(validateRpmPrimaryProvenance({...args,final}).scope,'M1-1');
});

test('existing prerequisite: an old hybrid native source path uses only its exact accepted semantic decision without another source delta',t=>{
  const f=fixture(t,{legacyNativeRpmPath:true}),nativeSource=f.git('show',f.item.sourceReview.reviewCommit+':'+f.sourcePath),sourceBytes=f.raw(f.sourcePath);
  assert.notDeepEqual(bank(nativeSource)[0].rpmPrimaryPath,f.question.rpmPrimaryPath);
  assert.equal(bank(nativeSource)[0].rpmPrimaryRecordId,'M2-RPM-038');
  assert.deepEqual(bank(nativeSource)[0].rpmPrimaryPath,{majorUnit:'일차부등식과 연립일차방정식',midUnit:'연립일차방정식의 활용',l3:'수와 개수',l4:'두 수 관계'});
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,'PASS');
  const receipt=f.read(f.receiptPath),proof=receipt.fingerprintRepairs[0].sourceReview.prerequisiteExistingApplication,stored=f.read(META).records[0];
  assert.deepEqual(stored.rpmPrimaryPath,f.row.semanticDecision.rpmPath);assert.equal(stored.rpmL3,f.row.semanticDecision.rpmPath.l3);assert.equal(stored.rpmL4,f.row.semanticDecision.rpmPath.l4);
  assert.equal(Object.keys(proof.sourceMetadataDelta.set).length,6);assert.equal(Object.keys(proof.sourceMetadataDelta.remove).length,4);
  assert.equal(proof.acceptedSemanticRpmTransport.sourceMetadataDeltaUnchanged,true);assert.deepEqual(f.raw(f.sourcePath),sourceBytes);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);assert.equal(f.reuse(),true);
});

test('existing prerequisite: exact guard failures do not issue a receipt or change stored metadata',async t=>{
  for(const [name,make,mutate,expected]of[
    ['missing independent item reference',{},f=>{f.item.evidenceRefs=f.item.evidenceRefs.filter(r=>r.path!==f.independentPath);},/evidence must bind approval and selected item/],
    ['independent reviewer collision',{},f=>{f.independent.reviewer.id='root-reviewer';f.publish();},/independent current UID application is absent/],
    ['real native proposal',{mutateNative:({review,row})=>{row.proposalRefs=['proposal'];review.proposals=[{id:'proposal'}];}},()=>{},/native empty proposal inventory/],
    ['native source hold',{mutateNative:({row})=>{row.contentDebt=['SOURCE_CONDITION_UNRESOLVED'];}},()=>{},/native source\/content\/difficulty hold remains/],
    ['hybrid primary path',{},f=>{f.question.rpmL1='M2 target';f.item.after.rpmL1='M2 target';f.retarget();},/current source changes exceed exact metadata delta|current application field mismatch/],
    ['target course replaced',{},f=>{f.question.courseKey='M1-1';f.item.after.courseKey='M1-1';f.retarget();},/registered target or semantic scope mismatch/],
    ['changed student answer with correct fresh hashes',{},f=>{f.question.answer='10';f.retarget();},/protected native\/current student payload differs/],
    ['changed omitted neighbour with correct fresh hashes',{},f=>{f.neighbour.editorialNote='unselected change';f.retarget();},/current application changed an unselected question/],
    ['current source hold',{},f=>{f.question.sourceIssueHold=true;f.retarget();},/explicit source hold cannot be bypassed/],
    ['changed retained rationale',{},f=>{f.question.decisiveStep='Unreviewed reasoning';f.item.after.decisiveStep=f.question.decisiveStep;f.retarget();},/retained source rationale differs/],
    ['source approval flag promotion',{},f=>{f.question.solutionStatus='APPROVED';f.retarget();},/current source changes exceed exact metadata delta/],
    ['changed existing ACTIVE definition',{},f=>{const p=`${C}/packs/middle1/taxonomy.json`,d=f.read(p);d.templates[0].definition='Different meaning';f.put(p,d);},/existing ACTIVE definitions must remain exactly unchanged/],
    ['changed selected semantic RPM row',{},f=>{const d=f.read(M1);d.records[0].mappingStatus='DIRECT_ACTIVE';f.put(M1,d);},/current prerequisite RPM row changed/],
    ['missing exact semantic master leaf',{},f=>{const d=f.read(MASTER);d.records[0].concepts[0].problemTypes=[];f.put(MASTER,d);const h=hash(f.raw(MASTER));f.item.targetParentRef.sha256=h;
      f.approval.targetParentRef.sha256=h;f.publish();f.request.approval.evidenceRefs.find(r=>r.path===MASTER).sha256=h;},/exact prerequisite master leaf missing/],
  ])await t.test(name,t=>{const f=fixture(t,make);mutate(f);const before=f.raw(META);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),expected);
    assert.deepEqual(f.raw(META),before);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
  });
});

test('existing prerequisite: replay and source reuse reject erased typed proof and sidecar',async t=>{
  for(const [name,mutate]of[
    ['receipt proof removed',f=>{const r=f.read(f.receiptPath);delete r.fingerprintRepairs[0].sourceReview.prerequisiteExistingApplication;f.put(f.receiptPath,r);}],
    ['typed source sidecar removed',f=>fs.rmSync(path.join(f.root,reviewedSourceBindingPath(f.request.requestId)))],
  ])await t.test(name,t=>{const f=fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(f.reuse(),true);mutate(f);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request}),/source.review|missing|proof|binding/i);
    assert.throws(()=>f.reuse(),/source.review|missing|proof|binding|ENOENT/i);
  });
});

test('existing prerequisite: unrelated RPM append and later source-only neighbour change preserve the selected issued approval',t=>{
  const f=fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(f.reuse(),true);
  const priorRef={path:f.receiptPath,sha256:hash(f.raw(f.receiptPath))},priorReceipt=f.read(f.receiptPath);
  const cross=f.read(M1);cross.records.push({id:'UNRELATED-APPEND',curriculum:'2015',scope:'M1-1',rpmPath:{majorUnit:'other',midUnit:'other',l3:'other',l4:'other'}});f.put(M1,cross);
  f.neighbour.editorialNote='Another UID changed after this issued application.';f.writeBank();assert.equal(f.reuse(),true);
  const sourceBytes=f.raw(f.sourcePath),currentBlob=f.git('hash-object','-w',f.sourcePath);assert.notEqual(currentBlob,priorReceipt.sourceBlobSha1);
  const request={schemaVersion:f.request.schemaVersion,requestId:'test-prerequisite-existing-source-rebind',scope:'PARTIAL_UIDS',examUid:f.request.examUid,
    sourceArchiveFile:f.request.sourceArchiveFile,expectedSourceBlobSha1:currentBlob,expectedQuestionCount:2,
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'root-reviewer',evidenceRefs:[...f.request.approval.evidenceRefs,priorRef],sourceRebind:{priorReceiptRef:priorRef}},
    items:[{questionUid:f.uid,sourceOrdinal:1,before:{},after:{},reason:'Preserve the exact selected review after an unrelated source change.',evidenceRefs:f.item.evidenceRefs}]};
  const result=registerReviewedExamV2({root:f.root,request,write:true});
  assert.equal(result.status,'PASS');assert.equal(result.newMetadataApprovals,0);assert.equal(result.preservedMetadataApprovals,1);
  const newPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`,receipt=f.read(newPath);
  assert.equal(receipt.sourceBlobSha1,currentBlob);assert.equal(receipt.sourceRawSha256,hash(sourceBytes));
  assert.deepEqual(receipt.appliedRecords.map(r=>r.questionUid),[f.uid]);assert.equal(registerReviewedExamV2({root:f.root,request}).replay,true);assert.equal(f.reuse(newPath),true);
  assert.deepEqual(f.raw(f.sourcePath),sourceBytes);
});
