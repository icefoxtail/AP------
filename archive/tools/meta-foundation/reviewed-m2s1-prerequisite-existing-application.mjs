// An immutable current UID application may reuse existing definitions while its
// reviewed prerequisite RPM and registered target course remain distinct.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const PREREQUISITE_EXISTING_APPLICATION_SCHEMA = 'archive-m2s1-prerequisite-existing-application-v1';
const APPLICATION_SCHEMA = 'archive-m2s1-prerequisite-existing-application-binding-v1';
const APPROVAL_SCHEMA = 'middle-audit-prerequisite-existing-definition-current-approval-v1';
const INDEPENDENT_SCHEMA = 'archive-independent-existing-definition-application-review-v1';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const M1_CROSSWALK = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json';
const M2_CROSSWALK = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const M1_TAXONOMY = 'archive/data/meta-foundation/canonical/packs/middle1/taxonomy.json';
const BINDINGS = 'archive/data/meta-foundation/canonical/packs/middle2/bindings.json';
const PT = 'PT_M1_LINEAR_EQUATION_MODELING', TPL = 'TPL_M1_LINEAR_EQUATION_MODEL_QUANTITY';
const STUDENT_FIELDS = Object.freeze([
  'id','number','sourceQuestionNo','sourceQid','sourceOrdinal','questionUid','questionType','content','question','choices','answer','solution',
  'image','images','figureSvg','solutionImage','solutionImages','solutionFigureSvg','layoutTag','wide',
  'imageSize','solutionImageAlt','solutionImageCaption','solutionImageSize','score',
]);
const DIFFICULTY = ['level','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'];
const SOURCE_REVIEW_KEYS = ['schemaVersion','reviewCommit','reviewPath','reviewRef','prerequisiteExistingApplication'];
const BINDING_KEYS = ['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'];
const TARGET_KEYS = ['scope','standardCourse','standardUnitKey','subUnitKey','majorUnit','midUnit','rpmEffectiveParentKey','provenance'];
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k,v[k]])) : v);
const equal = (a,b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const objectSha = value => sha(stable(value));
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const fail = message => { throw new Error('prerequisite existing application: ' + message); };
const need = (condition,message) => { if (!condition) fail(message); };
const exactKeys = (value,keys,label) => need(object(value) &&
  equal(Object.keys(value).sort(),[...keys].sort()),label + ' shape mismatch');
const payload = q => Object.fromEntries(STUDENT_FIELDS.map(k => [k,Object.hasOwn(q,k) ? q[k] : null]));
const authorityTokens = new WeakMap();

function safe(root,relative) {
  need(text(relative) && !path.isAbsolute(relative) && !/[\\\0]/.test(relative) &&
    relative.split('/').every(p => p && p !== '.' && p !== '..'),'unsafe evidence path');
  const full = path.resolve(root,relative);
  for (let p=full;p!==path.resolve(root);p=path.dirname(p))
    need(!fs.existsSync(p) || !fs.lstatSync(p).isSymbolicLink(),'symlink evidence path');
  return full;
}
function git(ctx,args) {
  try { return execFileSync('git',args,{cwd:ctx.root,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}); }
  catch { fail('immutable Git object unavailable'); }
}
function gitFile(ctx,commit,relative) {
  safe(ctx.root,relative); need(SHA1.test(commit || ''),'exact immutable commit required');
  const key='prerequisite-existing-git:' + commit + ':' + relative;
  if (!ctx.cache.has(key)) {
    need(git(ctx,['rev-parse','--verify',commit + '^{commit}']).toString().trim()===commit,'exact commit required');
    const blobSha1=git(ctx,['rev-parse',commit + ':' + relative]).toString().trim();
    const bytes=git(ctx,['cat-file','blob',blobSha1]);
    ctx.cache.set(key,{bytes,blobSha1,sha256:sha(bytes)});
  }
  return ctx.cache.get(key);
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail('invalid evidence JSON'); } }
function bankFromBytes(bytes) {
  try {
    const context={window:{},console:{log(){},warn(){},error(){}}};
    vm.runInNewContext(bytes.toString(),context,{timeout:5000});
    const bank=context.window.questionBank || context.window.questions || context.questionBank ||
      context.questions || context.window.examData?.questions;
    need(Array.isArray(bank),'source bank required');
    return JSON.parse(JSON.stringify(bank));
  } catch { fail('invalid immutable source bank'); }
}
function boundDocument(ctx,ref) {
  exactKeys(ref,['path','sha256'],'evidence reference');
  need(SHA256.test(ref.sha256 || ''),'evidence SHA required');
  for (const refs of [ctx.request.approval.evidenceRefs,ctx.patch.evidenceRefs])
    need(refs?.some(r => r.path===ref.path && r.sha256===ref.sha256),'evidence must bind approval and selected item');
  const full=safe(ctx.root,ref.path);
  need(fs.existsSync(full) && sha(fs.readFileSync(full))===ref.sha256,'local evidence changed');
  const original=gitFile(ctx,ctx.spec.evidenceCommit,ref.path);
  need(original.sha256===ref.sha256,'evidence differs from immutable shared commit');
  return parse(original.bytes);
}
function snapshot(ctx,ref,{implicitCommit=false}={}) {
  const commit=implicitCommit ? ctx.spec.evidenceCommit : ref.commit;
  need(ref.path==='archive/exams/' + ctx.request.sourceArchiveFile &&
    SHA1.test(ref.blobSha1 || '') && SHA256.test(ref.sha256 || ''),'exact source snapshot required');
  const file=gitFile(ctx,commit,ref.path),bank=bankFromBytes(file.bytes);
  need(file.blobSha1===ref.blobSha1 && file.sha256===ref.sha256 &&
    bank.length===ctx.request.expectedQuestionCount,'source snapshot digest/denominator mismatch');
  const question=bank[ctx.patch.sourceOrdinal-1];
  need(question,'selected source ordinal missing');
  return {...file,commit,bank,question};
}
function immutableJson(ctx,ref) {
  const file=gitFile(ctx,ref.commit,ref.path);
  need(file.sha256===ref.sha256,'immutable authority digest mismatch');
  return parse(file.bytes);
}
function currentJson(ctx,relative) {
  return parse(fs.readFileSync(safe(ctx.root,relative)));
}
function readNative(ctx) {
  const spec=ctx.patch.sourceReview,ref=spec.reviewRef;
  need(spec.schemaVersion==='archive-reviewed-source-reassessment-v1' &&
    SHA1.test(spec.reviewCommit || '') && SHA256.test(ref?.sha256 || ''),'exact native source review required');
  for (const refs of [ctx.request.approval.evidenceRefs,ctx.patch.evidenceRefs])
    need(refs?.some(r => r.path===ref.path && r.sha256===ref.sha256),'native ref must bind approval and selected item');
  const original=gitFile(ctx,spec.reviewCommit,spec.reviewPath);
  need(original.sha256===ref.sha256 && sha(fs.readFileSync(safe(ctx.root,ref.path)))===ref.sha256,
    'native review differs from immutable/local reference');
  const review=parse(original.bytes);
  need(review.schemaVersion==='m2-s1-meta-review-v1' && review.sourceArchiveFile===ctx.request.sourceArchiveFile &&
    review.reviewedQuestionCount===ctx.request.expectedQuestionCount &&
    Array.isArray(review.items) && review.items.length===ctx.request.expectedQuestionCount,'native schema/source/denominator mismatch');
  const sourcePath='archive/exams/' + review.sourceArchiveFile;
  const before=gitFile(ctx,review.baseSha,sourcePath),committed=gitFile(ctx,spec.reviewCommit,sourcePath);
  need(before.blobSha1===review.sourceGitBlobSha,'native before/source blob mismatch');
  const reviewedBank=bankFromBytes(before.bytes),committedBank=bankFromBytes(committed.bytes);
  need(reviewedBank.length===review.reviewedQuestionCount && committedBank.length===review.reviewedQuestionCount,
    'native source denominator mismatch');
  const rows=new Map(),uids=new Set();
  for (const row of review.items) {
    need(Number.isInteger(row.sourceOrdinal) && row.sourceOrdinal>0 && row.sourceOrdinal<=review.reviewedQuestionCount &&
      !rows.has(row.sourceOrdinal) && text(row.questionUid) && !uids.has(row.questionUid),'native UID inventory mismatch');
    rows.set(row.sourceOrdinal,row);uids.add(row.questionUid);
  }
  const reviewer=review.judgedBy?.agent || review.owner;
  need(text(reviewer),'native reviewer missing');
  return {spec,review,sourceBlob:before.blobSha1,sourceSha256:before.sha256,committedBlob:committed.blobSha1,
    reviewedBank,committedBank,rows,reviewer};
}

// Called before the ordinary RPM provenance check. It grants no write or
// approval itself. The returned authority is an in-process capability bound
// to the fully authenticated selected source/final values and semantic row.
export function preparePrerequisiteExistingRpmAuthority(input) {
  const spec=input.patch.sourceReview?.prerequisiteExistingApplication;
  if (spec===undefined) return null;
  const ctx={...input,spec,cache:input.cache || new Map()};
  const native=readNative(ctx),row=native.rows.get(input.patch.sourceOrdinal);
  const accepted={...row?.after};
  for (const key of DIFFICULTY) if (Object.hasOwn(row?.finalDifficulty || {},key)) accepted[key]=row.finalDifficulty[key];
  const result=validateM2S1PrerequisiteExistingApplication({...input,native,row,accepted,
    studentFields:STUDENT_FIELDS,studentPayload:payload,bankFromBytes,cache:ctx.cache});
  const token=Object.freeze({});
  authorityTokens.set(token,{questionSha256:objectSha(input.question),finalSha256:objectSha(input.final),
    recordSha256:result.proof.semanticRpmAuthority.recordSha256,proof:result.proof});
  return token;
}

// A request JSON object or a copied proof cannot manufacture this capability.
export function authenticatedPrerequisiteRpmScope(authority,{question,final,record}) {
  const value=authority && authorityTokens.get(authority);
  if (!value || value.questionSha256!==objectSha(question) || value.finalSha256!==objectSha(final) ||
    value.recordSha256!==objectSha(record)) return null;
  return {schemaVersion:PREREQUISITE_EXISTING_APPLICATION_SCHEMA,evidenceCommit:value.proof.evidenceCommit,
    questionUid:value.proof.questionUid,sourceOrdinal:value.proof.sourceOrdinal,
    semanticScope:'M1-1',registeredTargetScope:'M2-1',scopeRelation:'PREREQUISITE_LOWER_GRADE',
    rootApprovalRef:value.proof.rootApprovalRef,independentReviewRef:value.proof.independentReviewRef,
    applicationRef:value.proof.applicationRef,authorityUse:'RPM_PATH_PROVENANCE_ONLY',selectsPtTpl:false};
}

export function validateM2S1PrerequisiteExistingApplication(input) {
  const spec=input.patch.sourceReview?.prerequisiteExistingApplication;
  if (spec===undefined) return null;
  const ctx={...input,spec,cache:input.cache || new Map()};
  const {request,patch,native,row,accepted,question,final,canonicalBefore,canonicalAfter}=ctx;
  exactKeys(spec,['schemaVersion','evidenceCommit','rootApprovalRef','independentReviewRef','applicationRef'],'opt-in');
  need(spec.schemaVersion===PREREQUISITE_EXISTING_APPLICATION_SCHEMA && SHA1.test(spec.evidenceCommit || ''),
    'explicit immutable prerequisite application required');
  need(request.scope==='PARTIAL_UIDS' && request.approval?.type==='FINAL_QA' &&
    request.approval.metadataReviewed===true && request.registrationMode===undefined &&
    request.approval.sourceRebind===undefined && patch.rebind===undefined &&
    Object.hasOwn(patch.after || {},'sourceFingerprint') && request.items?.length===1 &&
    request.items[0].questionUid===patch.questionUid && request.items[0].sourceOrdinal===patch.sourceOrdinal &&
    equal(Object.keys(patch.sourceReview).sort(),SOURCE_REVIEW_KEYS.slice().sort()),
    'exclusive one-UID ordinary FINAL_QA source reassessment required');
  need(equal(ctx.studentFields,STUDENT_FIELDS),'protected student field contract differs');
  need(native.review.schemaVersion==='m2-s1-meta-review-v1' && row?.verdict==='REGISTRATION_PENDING' &&
    row.rpmDecision==='CORRECT' && row.questionUid===patch.questionUid && row.sourceOrdinal===patch.sourceOrdinal &&
    /^original\/middle\/m2\/(?:1mid|1final)\/[^/]+\.js$/.test(request.sourceArchiveFile) &&
    native.review.sourceArchiveFile===request.sourceArchiveFile &&
    native.review.reviewedQuestionCount===request.expectedQuestionCount &&
    native.reviewedBank.length===request.expectedQuestionCount && native.committedBank.length===request.expectedQuestionCount,
    'exact settled M2S1 native UID and full denominator required');
  const debts=[...(row.debts || []),...(row.contentDebt || []),...(row.registrationDebt || [])];
  need(!(row.contentDebt || []).length && !debts.some(d => /^(SOURCE_|CONTENT_|SOLUTION_|PRIOR_SOURCE_QA|DIFFICULTY_HOLD|EXPLICIT_DIFFICULTY_VALIDITY)/
    .test(typeof d==='string' ? d : d?.type || d?.kind || '')),'native source/content/difficulty hold remains');
  need(Array.isArray(row.proposalRefs) && row.proposalRefs.length===0 &&
    Array.isArray(native.review.proposals) && native.review.proposals.length===0 &&
    !native.review.artifactRefs?.proposals && !native.review.artifactRefs?.['proposals.json'],
    'native empty proposal inventory must remain intact');
  for (const key of ['problemTypeKey','templateKey'])
    need((accepted[key]===undefined || accepted[key]===null || accepted[key]==='') &&
      (row.semanticDecision?.[key]===undefined || row.semanticDecision[key]===null || row.semanticDecision[key]===''),
      'native approved primary cannot be overwritten');
  const original=[native.reviewedBank[patch.sourceOrdinal-1],native.committedBank[patch.sourceOrdinal-1]];
  need(original.every(q => q && equal(ctx.studentPayload(q),ctx.studentPayload(question))),
    'protected native/current student payload differs');
  for (const q of [...original,question]) {
    need(q.sourceIssueHold!==true && q.sourceDefectCandidate!==true && q.sourceQualityHold?.status!=='HOLD',
      'explicit source hold cannot be bypassed');
    for (const key of ['image','images','figureSvg','solutionImage','solutionImages','solutionFigureSvg'])
      need(q[key]===undefined || q[key]===null || q[key]==='' || Array.isArray(q[key]) && q[key].length===0,
        'v1 prerequisite application is confined to text-only evidence');
    need(!/<(?:img|svg)\b/i.test([q.content,q.question,q.solution,JSON.stringify(q.choices)].join('\n')),
      'v1 prerequisite application cannot carry inline student assets');
  }
  for (const key of DIFFICULTY) need(Object.hasOwn(row.finalDifficulty || {},key) &&
    equal(accepted[key],row.finalDifficulty[key]) && equal(final[key],row.finalDifficulty[key]),
    'native accepted difficulty changed: ' + key);
  const approval=boundDocument(ctx,spec.rootApprovalRef),independent=boundDocument(ctx,spec.independentReviewRef),
    application=boundDocument(ctx,spec.applicationRef),proposal=boundDocument(ctx,approval.proposalRef);
  const nativeRef={commit:native.spec.reviewCommit,path:native.spec.reviewPath,sha256:native.spec.reviewRef.sha256};
  need(approval.schemaVersion===APPROVAL_SCHEMA &&
    approval.decision==='APPROVE_EXISTING_DEFINITIONS_EXACT_UID_AND_TARGET_BINDING' &&
    approval.reviewer===request.approval.approvedBy && approval.owner===approval.reviewer &&
    text(approval.reviewer) && text(approval.preparedBy) && approval.reviewer!==approval.preparedBy &&
    approval.nativeReviewer===native.reviewer && approval.reviewer!==native.reviewer &&
    equal(approval.nativeReviewRef,nativeRef) && equal(approval.independentReviewRef,spec.independentReviewRef) &&
    approval.existingDefinitionChanges===0 && approval.newDefinitions===0 && approval.crosswalkChanges===0 &&
    approval.newBindings===1 && approval.unselectedUidApplicationApproved===false &&
    approval.nativeProposalFabricated===false && approval.newMathematicalQa===false &&
    approval.newSourceQualityApproval===false && approval.newDifficultyJudgment===false,
    'root current existing-definition approval scope mismatch');
  const applicationKeys=['schemaVersion','reviewer','decision','questionUid','sourceOrdinal','sourceArchiveFile','expectedQuestionCount',
    'rootApprovalRef','independentReviewRef','nativeReviewRef','nativeItemStableSha256','sourceBeforeRef','currentSourceRef',
    'protectedStudentPayloadSha256','problemTypeSha256','templateSha256','bindingSha256','sourceMetadataDelta','retainedRationale',
    'nativeProposalRefs','newMathematicalQa'];
  exactKeys(application,applicationKeys,'current application binding');
  need(application.schemaVersion===APPLICATION_SCHEMA &&
    application.decision==='BIND_EXISTING_DEFINITION_APPLICATION_AND_SEPARATE_PREREQUISITE_SCOPE' &&
    application.reviewer===approval.reviewer && equal(application.rootApprovalRef,spec.rootApprovalRef) &&
    equal(application.independentReviewRef,spec.independentReviewRef) && equal(application.nativeReviewRef,nativeRef) &&
    application.nativeItemStableSha256===objectSha(row) && equal(application.nativeProposalRefs,[]) &&
    application.newMathematicalQa===false,'current application identity/native preservation mismatch');
  for (const doc of [approval,independent,application,proposal])
    need(doc.questionUid===patch.questionUid && doc.sourceOrdinal===patch.sourceOrdinal &&
      doc.sourceArchiveFile===request.sourceArchiveFile,'approval/application UID or source mismatch');
  need(approval.expectedQuestionCount===request.expectedQuestionCount &&
    application.expectedQuestionCount===request.expectedQuestionCount &&
    proposal.expectedQuestionCount===request.expectedQuestionCount,'application full denominator mismatch');
  const payloadSha=objectSha(ctx.studentPayload(question));
  need(approval.approvedProtectedStudentPayloadSha256===payloadSha &&
    application.protectedStudentPayloadSha256===payloadSha &&
    proposal.protectedPayloadContract?.sha256===payloadSha,'protected payload proof hash mismatch');
  need(independent.schemaVersion===INDEPENDENT_SCHEMA &&
    independent.decision==='APPROVE_EXISTING_DEFINITIONS_AND_EXACT_CURRENT_UID_APPLICATION' &&
    text(independent.reviewer?.id) && ![approval.reviewer,approval.preparedBy,native.reviewer].includes(independent.reviewer.id) &&
    independent.reviewer.independentFromRootApprover===approval.reviewer &&
    independent.reviewer.independentFromProposalPreparer===approval.preparedBy &&
    independent.reviewer.independentFromNativeAuthor===native.reviewer &&
    independent.reviewer.blindReviewClaim===false && equal(independent.proposalRef,approval.proposalRef) &&
    equal(independent.nativeReviewRef,nativeRef) && independent.nativeItemRef?.sha256===objectSha(row) &&
    independent.nativeItemRef.questionUid===patch.questionUid && independent.nativeItemRef.sourceOrdinal===patch.sourceOrdinal &&
    equal(independent.protectedPayloadContract?.fields,STUDENT_FIELDS) &&
    independent.protectedPayloadContract.sha256===payloadSha &&
    independent.protectedStudentPayloadIdenticalAcrossAllFourSnapshots===true &&
    independent.currentQuestionRawTextRead===true && independent.currentExistingSolutionRead===true &&
    independent.nativeItemRead===true && independent.referencedStudentAssetCount===0 &&
    equal(independent.blockingFindings,[]),'independent current UID application is absent or inconsistent');
  need(independent.currentApplicationDecision?.existingPtTplMeaningUnchanged===true &&
    independent.currentApplicationDecision.exactCurrentUidApplicationApproved===true &&
    independent.currentApplicationDecision.newDefinitionApproved===false &&
    independent.currentApplicationDecision.unselectedUidApplicationApproved===false &&
    independent.preservedLimits?.newFullMathematicalQa===false &&
    independent.preservedLimits.newSourceQualityApproval===false &&
    independent.preservedLimits.newDifficultyJudgment===false &&
    independent.preservedLimits.nativeAcceptedDifficultyReused===true &&
    independent.preservedLimits.fingerprintReplacementWithoutTypedProofAllowed===false &&
    equal(independent.nativeAuthorityPreserved?.nativeProposalRefs,[]) &&
    independent.nativeAuthorityPreserved.nativeDocumentProposalCount===0 &&
    independent.nativeAuthorityPreserved.nativeAfterContainsApprovedCurrentPtTpl===false &&
    independent.nativeAuthorityPreserved.retroactiveNativeProposalOrApprovalClaim===false,
    'independent review exceeds current application boundary');
  need(equal(application.sourceBeforeRef,approval.sourceBeforeRef),'current application baseline mismatch');
  const before=snapshot(ctx,application.sourceBeforeRef);
  exactKeys(application.currentSourceRef,['path','blobSha1','sha256','questionStableSha256'],'current source reference');
  const current=snapshot(ctx,application.currentSourceRef,{implicitCommit:true});
  need(current.blobSha1===request.expectedSourceBlobSha1 &&
    objectSha(current.question)===application.currentSourceRef.questionStableSha256 &&
    equal(current.question,question) && equal(ctx.studentPayload(before.question),ctx.studentPayload(question)),
    'current immutable source/question mismatch');
  need(before.bank.every((q,i) => i===patch.sourceOrdinal-1 || equal(q,current.bank[i])),
    'current application changed an unselected question');
  const live=bankFromBytes(fs.readFileSync(safe(ctx.root,application.currentSourceRef.path)));
  need(live.length===request.expectedQuestionCount && equal(live[patch.sourceOrdinal-1],question),
    'live selected question or denominator differs');
  need(Array.isArray(independent.sourceSnapshots) && independent.sourceSnapshots.length===4,
    'independent source snapshot inventory mismatch');
  const requiredSnapshots=[[native.review.baseSha,native.sourceBlob],[native.spec.reviewCommit,native.committedBlob],
    [application.sourceBeforeRef.commit,before.blobSha1]];
  for (const [commit,blob] of requiredSnapshots)
    need(independent.sourceSnapshots.filter(r => r.commit===commit && r.blobSha1===blob).length===1,
      'required independent source snapshot absent');
  for (const ref of independent.sourceSnapshots) {
    const checked=snapshot(ctx,ref);
    need(ref.questionCount===request.expectedQuestionCount && ref.selectedOrdinal===patch.sourceOrdinal &&
      ref.protectedStudentPayloadSha256===payloadSha &&
      objectSha(ctx.studentPayload(checked.question))===payloadSha &&
      ref.selectedWholeQuestionSha256===objectSha(checked.question),'independent snapshot does not bind exact source');
  }

  const defs=approval.existingDefinitions,pt=canonicalBefore?.pt?.get(PT),tpl=canonicalBefore?.tpl?.get(TPL);
  need(pt?.status==='ACTIVE' && tpl?.status==='ACTIVE' && tpl.parentProblemTypeKey===PT &&
    pt.ownerPack==='MIDDLE1' && tpl.ownerPack==='MIDDLE1' &&
    equal(pt,canonicalAfter?.pt?.get(PT)) && equal(tpl,canonicalAfter?.tpl?.get(TPL)) &&
    equal(pt,defs.problemType) && equal(tpl,defs.template) && defs.mustRemainByteSemanticEqual===true &&
    objectSha(pt)===defs.problemTypeStableSha256 && objectSha(tpl)===defs.templateStableSha256 &&
    application.problemTypeSha256===objectSha(pt) && application.templateSha256===objectSha(tpl),
    'existing ACTIVE definitions must remain exactly unchanged');
  for (const ref of [defs.taxonomyRef,independent.existingDefinitions?.taxonomyRef]) {
    need(ref?.path===M1_TAXONOMY,'exact existing definition source required');
    const snapshot=immutableJson(ctx,ref);
    need(snapshot.problemTypes?.filter(r => equal(r,pt)).length===1 &&
      snapshot.templates?.filter(r => equal(r,tpl)).length===1,'immutable existing definitions differ');
  }
  need(independent.existingDefinitions.problemTypeKey===PT &&
    independent.existingDefinitions.templateKey===TPL &&
    independent.existingDefinitions.problemTypeSha256===objectSha(pt) &&
    independent.existingDefinitions.templateSha256===objectSha(tpl) &&
    independent.existingDefinitions.definitionChangesApproved===0 &&
    independent.existingDefinitions.newDefinitionsApproved===0,'independent existing definition digest mismatch');

  const semantic=approval.semanticRpm,record=semantic.record,decision=row.semanticDecision;
  need(record?.id==='M1-RPM-042' && record.curriculum==='2015' && record.scope==='M1-1' &&
    record.mappingStatus==='RPM_ONLY' && record.bindingStatus==='NO_ACTIVE_MAPPING' &&
    semantic.crosswalkRef.path===M1_CROSSWALK && semantic.recordStableSha256===objectSha(record) &&
    row.rpmRecordId===record.id && decision?.semanticCurriculum===record.curriculum &&
    decision.machineCurriculum===record.curriculum && decision.semanticScope===record.scope &&
    decision.semanticScopeRelation==='PREREQUISITE_LOWER_GRADE' &&
    decision.semanticSourceScope==='2015|중1 수학|M1-03|M1-03-LINEAR_EQUATION_WORD|M1-RPM-042' &&
    equal(decision.rpmPath,record.rpmPath) && equal(decision.rpmBasePath,record.rpmPath) &&
    equal(decision.semanticSourcePath,record.rpmPath),'native prerequisite semantic decision is not exact');
  for (const ref of [semantic.crosswalkRef,independent.semanticRpm?.crosswalkRef]) {
    need(ref?.path===M1_CROSSWALK,'exact semantic crosswalk required');
    const doc=immutableJson(ctx,ref);
    need(doc.schemaVersion==='rpm-primary-active-crosswalk-v1' && doc.status==='ACTIVE_REFERENCE' &&
      doc.rpmAuthority?.source===MASTER && doc.records?.filter(r => r.id===record.id && equal(r,record)).length===1,
      'immutable prerequisite RPM row differs');
  }
  const liveCross=currentJson(ctx,M1_CROSSWALK);
  need(liveCross.schemaVersion==='rpm-primary-active-crosswalk-v1' && liveCross.status==='ACTIVE_REFERENCE' &&
    liveCross.rpmAuthority?.source===MASTER &&
    liveCross.records?.filter(r => r.id===record.id).length===1 &&
    equal(liveCross.records.find(r => r.id===record.id),record),'current prerequisite RPM row changed');
  need(semantic.masterRef.path===MASTER && independent.semanticRpm.masterRef.path===MASTER,
    'exact LOCKED master reference required');
  const master=currentJson(ctx,MASTER),rp=record.rpmPath;
  need(master.schemaVersion==='js-archive-taxonomy-rpm-primary-v1.0' && master.authorityStatus==='LOCKED',
    'current LOCKED master required');
  const leaves=master.records.filter(r => r.curriculum===record.curriculum && r.scope===record.scope &&
    r.majorUnit===rp.majorUnit && r.midUnit===rp.midUnit).flatMap(r => (r.concepts || [])
    .filter(c => c.concept===rp.l3).flatMap(c => (c.problemTypes || []).filter(p => p.problemType===rp.l4)));
  need(leaves.length===1 && objectSha(leaves[0])===semantic.leafStableSha256 &&
    independent.semanticRpm.recordId===record.id && independent.semanticRpm.recordSha256===objectSha(record) &&
    independent.semanticRpm.leafSha256===objectSha(leaves[0]) &&
    independent.semanticRpm.activeCrosswalkMappingClaim===false,'exact prerequisite master leaf missing or changed');
  for (const ref of [semantic.masterRef,independent.semanticRpm.masterRef]) {
    const old=immutableJson(ctx,ref);
    need(old.authorityStatus==='LOCKED' && old.records.some(r => r.curriculum==='2015' && r.scope==='M1-1' &&
      r.majorUnit===rp.majorUnit && r.midUnit===rp.midUnit && r.concepts?.some(c => c.concept===rp.l3 &&
        c.problemTypes?.some(p => equal(p,leaves[0])))),'immutable prerequisite master leaf differs');
  }

  const target=Object.fromEntries(TARGET_KEYS.map(k => [k,approval.targetNamespace[k]])),binding=approval.approvedBinding;
  need(target.scope==='M2-1' && target.standardCourse==='중2 수학' && target.standardUnitKey==='M2-03' &&
    target.subUnitKey==='M2-03-SIMULTANEOUS_LINEAR_EQUATION' &&
    target.majorUnit==='일차부등식과 연립일차방정식' && target.midUnit==='연립일차방정식' &&
    equal(decision.targetNamespace,target) && equal(before.question.targetNamespace,target) &&
    equal(question.targetNamespace,target),'original registered target namespace changed');
  for (const q of [...original,before.question,question])
    need(q.curriculum==='2015' && q.standardCourse===target.standardCourse &&
      q.standardUnitKey===target.standardUnitKey && q.subUnitKey===target.subUnitKey,
      'native/current explicit M2 target differs');
  need(final.curriculum==='2015' && final.curriculumKey==='2015' && final.courseKey==='M2-1' &&
    final.standardCourse===target.standardCourse && final.standardUnitKey===target.standardUnitKey &&
    final.subUnitKey===target.subUnitKey && final.semanticSourceScope==='M1-1' &&
    final.semanticScopeRelation==='PREREQUISITE_LOWER_GRADE','registered target or semantic scope mismatch');
  const parents=master.records.filter(r => r.curriculum==='2015' && r.scope==='M2-1' &&
    r.majorUnit===target.majorUnit && r.midUnit===target.midUnit);
  need(parents.length===1 && objectSha(parents[0])===approval.targetNamespace.targetMasterParentStableSha256 &&
    independent.targetNamespace?.parentSha256===objectSha(parents[0]),'exact M2 target master parent missing');
  need(equal(patch.targetParentRef,approval.targetParentRef) && patch.basicScopeParentRef===undefined &&
    patch.semanticBinding===undefined && patch.approvedMetadataRef===undefined &&
    patch.targetParentRef.path===MASTER && patch.targetParentRef.curriculum==='2015' &&
    patch.targetParentRef.scope==='M2-1' && patch.targetParentRef.majorUnit===target.majorUnit &&
    patch.targetParentRef.midUnit===target.midUnit,'target parent must remain independently bound');
  for (const refs of [request.approval.evidenceRefs,patch.evidenceRefs])
    need(refs.some(r => r.path===MASTER && r.sha256===patch.targetParentRef.sha256),'target parent master is not evidence bound');
  need(sha(fs.readFileSync(safe(ctx.root,MASTER)))===patch.targetParentRef.sha256,'target master digest changed');
  for (const ref of [approval.targetNamespace.lookupRowRef,independent.targetNamespace.targetLookupRef]) {
    need(ref.path===M2_CROSSWALK && ref.recordId==='M2-RPM-030','target lookup must not replace semantic primary');
    const old=immutableJson(ctx,ref),rows=old.records.filter(r => r.id===ref.recordId);
    need(rows.length===1 && objectSha(rows[0])===ref.recordStableSha256 ||
      rows.length===1 && objectSha(rows[0])===ref.recordSha256,'immutable target lookup row differs');
    const now=currentJson(ctx,M2_CROSSWALK).records.filter(r => r.id===ref.recordId);
    need(now.length===1 && equal(now[0],rows[0]) && now[0].curriculum==='2015' && now[0].scope==='M2-1' &&
      now[0].standardUnitKey===target.standardUnitKey && now[0].subUnitKey===target.subUnitKey &&
      now[0].rpmPath.majorUnit===target.majorUnit && now[0].rpmPath.midUnit===target.midUnit,'target lookup context changed');
  }
  need(binding.curriculum==='2015' && binding.standardCourse===target.standardCourse &&
    binding.standardUnitKey===target.standardUnitKey && binding.subUnitKey===target.subUnitKey &&
    binding.problemTypeKey===PT && binding.ownerPack==='MIDDLE2' && binding.status==='ACTIVE' &&
    binding.L1===target.majorUnit && binding.L2===target.midUnit &&
    equal(binding.supportingQuestionUids,[patch.questionUid]) && binding.supportingItemCount===1 &&
    application.bindingSha256===objectSha(binding) &&
    equal(independent.approvedExactBindingApplication?.proposedBinding,binding) &&
    independent.approvedExactBindingApplication.proposedBindingSha256===objectSha(binding) &&
    independent.approvedExactBindingApplication.currentExactBindingExists===false &&
    independent.approvedExactBindingApplication.unselectedUidApplicationApproved===false,
    'exact one-UID target binding approval mismatch');
  const tuple=[binding.curriculum,binding.standardCourse,binding.standardUnitKey,binding.subUnitKey,binding.problemTypeKey];
  need(!canonicalBefore?.bindings?.has(stable(tuple)) &&
    equal(canonicalAfter?.bindings?.get(stable(tuple)),binding),'requires exactly one new target binding');
  const pack=canonicalAfter?.packs?.get('MIDDLE2')?.meta;
  need(pack?.canonicalStatus==='ACTIVE' && pack.curricula?.includes('2015') &&
    pack.standardCourses?.includes('중2 수학') && pack.standardCourses.includes('M2-1') &&
    pack.ownedStandardUnitDomains?.includes('M2-03'),'ACTIVE M2 binding owner scope missing');
  const expectedChange={path:BINDINGS,collection:'bindings',match:Object.fromEntries(BINDING_KEYS.map(k => [k,binding[k]])),
    before:null,after:binding};
  need(request.registryChanges?.length===1 &&
    equal(Object.fromEntries(Object.keys(expectedChange).map(k => [k,request.registryChanges[0][k]])),expectedChange),
    'only the exact binding addition is admitted');

  const rationale={};
  for (const key of ['primaryMethod','decisiveStep']) {
    const value=original[0][key];
    need(text(value) && [original[1][key],before.question[key],question[key],final[key],patch.after[key]].every(v => equal(v,value)),
      'retained source rationale differs: ' + key);
    need(independent.rationaleContinuity?.[key==='primaryMethod' ? 'currentPrimaryMethod' : 'currentDecisiveStep']===value &&
      independent.rationaleContinuity[key==='primaryMethod' ? 'nativePrimaryMethod' : 'nativeDecisiveStep']===row[key] &&
      independent.rationaleContinuity.sourceRationaleIdenticalAcrossAllFourSnapshots===true,'independent rationale continuity differs');
    rationale[key]=value;
  }
  need(equal(application.retainedRationale,rationale),'retained rationale application differs');
  const aliases={rpmPrimaryId:record.id,rpmL1:rp.majorUnit,rpmL2:rp.midUnit,courseKey:'M2-1'};
  const fields={problemTypeKey:PT,templateKey:TPL,standardCourse:target.standardCourse,...rationale,...aliases,
    semanticSourceScope:'M1-1',semanticScopeRelation:'PREREQUISITE_LOWER_GRADE'};
  const set={problemTypeKey:PT,templateKey:TPL,...aliases};
  const remove=Object.fromEntries(['projectionStatus','ownerPack','nullReason','projectionReason'].map(k => [k,before.question[k]]));
  need(remove.projectionStatus==='BINDING_PENDING' && remove.ownerPack===null &&
    text(remove.nullReason) && text(remove.projectionReason) &&
    equal(application.sourceMetadataDelta,{set,remove}) && equal(approval.sourceMetadataDelta,{set,remove}) &&
    equal(proposal.sourceMetadataDelta,{set,remove}),'exact source metadata delta differs');
  const expected=structuredClone(before.question);
  for (const key of Object.keys(remove)) { need(Object.hasOwn(expected,key),'obsolete source annotation absent');delete expected[key]; }
  for (const [key,value] of Object.entries(set)) {
    if (Object.hasOwn(aliases,key)) need(!Object.hasOwn(expected,key),'new native-derived alias already existed');
    expected[key]=value;
  }
  need(equal(question,expected),'current source changes exceed exact metadata delta');
  for (const key of ['answerStatus','solutionStatus','reviewStatus']) {
    const flag={present:Object.hasOwn(before.question,key),value:before.question[key]??null};
    need(equal(approval.originalSourceApprovalFlags?.[key],flag) &&
      equal(independent.preservedLimits.originalSourceApprovalFlags?.[key],flag) &&
      Object.hasOwn(question,key)===flag.present && equal(question[key]??null,flag.value),'original source approval flags changed');
  }
  for (const [key,value] of Object.entries(fields))
    need(equal(question[key],value) && equal(final[key],value) && equal(patch.after[key],value),'current application field mismatch: ' + key);
  need(question.rpmPrimaryRecordId===record.id && equal(question.rpmPrimaryPath,rp) &&
    question.rpmL3===rp.l3 && question.rpmL4===rp.l4 &&
    equal(final.rpmPrimaryPath,rp) && final.rpmL3===rp.l3 && final.rpmL4===rp.l4,'declared semantic RPM path is hybrid or changed');
  return {fields,retainedRationaleFields:rationale,nativeRpmAliasFields:aliases,proof:{
    schemaVersion:PREREQUISITE_EXISTING_APPLICATION_SCHEMA,evidenceCommit:spec.evidenceCommit,
    rootApprovalRef:spec.rootApprovalRef,independentReviewRef:spec.independentReviewRef,applicationRef:spec.applicationRef,
    nativeReviewRef:nativeRef,nativeItemStableSha256:objectSha(row),questionUid:patch.questionUid,
    sourceOrdinal:patch.sourceOrdinal,expectedQuestionCount:request.expectedQuestionCount,nativeProposalRefs:[],
    sourceBeforeRef:application.sourceBeforeRef,currentSourceRef:{commit:spec.evidenceCommit,...application.currentSourceRef},
    studentPayloadSha256:payloadSha,problemTypeDefinitionSha256:objectSha(pt),templateDefinitionSha256:objectSha(tpl),
    exactActiveBindingSha256:objectSha(binding),rootReviewer:approval.reviewer,independentReviewer:independent.reviewer.id,
    sourceMetadataDelta:application.sourceMetadataDelta,fieldSha256:Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,objectSha(v)])),
    semanticRpmAuthority:{path:M1_CROSSWALK,recordId:record.id,recordSha256:objectSha(record),masterPath:MASTER,
      leafSha256:objectSha(leaves[0]),curriculum:'2015',semanticScope:'M1-1',rpmPath:rp,authorityUse:'RPM_PATH_PROVENANCE_ONLY',selectsPtTpl:false},
    registeredTarget:{curriculum:'2015',courseKey:'M2-1',standardCourse:target.standardCourse,
      standardUnitKey:target.standardUnitKey,subUnitKey:target.subUnitKey,L1:target.majorUnit,L2:target.midUnit,bindingOwner:'MIDDLE2'},
    semanticScopeRelation:'PREREQUISITE_LOWER_GRADE',newDefinitions:0,newBindings:1,crosswalkChanges:0,
    existingDefinitionChanges:0,nativeProposalFabricated:false,newMathematicalQa:false,
    newSourceQualityApproval:false,newDifficultyJudgment:false,unselectedUidApproval:false,
    officialResolverVerifiedFinal:'NOT_RUN_NOT_CREATED_BY_CURRENT_APPLICATION',
  }};
}
