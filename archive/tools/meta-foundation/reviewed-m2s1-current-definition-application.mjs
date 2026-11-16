// A current definition and UID application require separate immutable approvals.
// A separate current application does not rewrite or manufacture a native proposal.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const CURRENT_DEFINITION_APPLICATION_SCHEMA = 'archive-m2s1-current-definition-application-v1';
const APPLICATION_SCHEMA = 'archive-m2s1-current-definition-application-binding-v1';
const DEFINITION_SCHEMA = 'middle-audit-independent-exact-template-definition-approval-v1';
const INDEPENDENT_SCHEMA = 'archive-independent-current-definition-application-review-v1';
const CROSSWALK = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const DIFFICULTY = ['level','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'];
const REF_KEYS = ['path','sha256'];
const REVIEW_KEYS = ['schemaVersion','reviewCommit','reviewPath','reviewRef','currentDefinitionApplication'];
const SEMANTIC_DEFINITION_KEYS = ['templateKey','parentProblemTypeKey','canonicalLabelKo','definition','internalSkeleton'];
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k,v[k]])) : v);
const equal = (a,b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const objectSha = value => sha(stable(value));
const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const fail = message => { throw new Error(`current definition application: ${message}`); };
const need = (condition,message) => { if (!condition) fail(message); };
const exactKeys = (value, keys, label) => need(object(value) && equal(Object.keys(value).sort(), [...keys].sort()), `${label} shape mismatch`);
const nullPrimary = value => value === undefined || value === null || value === '';
const slug = value => value.toLowerCase().replaceAll('_','-');

function safe(root, relative) {
  need(text(relative) && !path.isAbsolute(relative) && !/[\\\0]/.test(relative) &&
    relative.split('/').every(p => p && p !== '.' && p !== '..'), 'unsafe evidence path');
  const full = path.resolve(root,relative);
  for (let p=full;p!==path.resolve(root);p=path.dirname(p))
    need(!fs.existsSync(p) || !fs.lstatSync(p).isSymbolicLink(), 'symlink evidence path');
  return full;
}

function git(root,args) {
  try { return execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}); }
  catch { fail('immutable Git object unavailable'); }
}

function gitFile(ctx,commit,relative) {
  safe(ctx.root,relative); need(typeof commit === 'string' && SHA1.test(commit),'exact immutable commit required');
  const key=`current-definition-git:${commit}:${relative}`;
  if (!ctx.cache.has(key)) {
    need(git(ctx.root,['rev-parse','--verify',`${commit}^{commit}`]).toString().trim()===commit,'exact commit required');
    const blobSha1=git(ctx.root,['rev-parse',`${commit}:${relative}`]).toString().trim();
    const bytes=git(ctx.root,['cat-file','blob',blobSha1]);
    ctx.cache.set(key,{bytes,blobSha1,sha256:sha(bytes)});
  }
  return ctx.cache.get(key);
}

function parse(bytes) { try { return JSON.parse(bytes); } catch { fail('invalid evidence JSON'); } }

function boundDocument(ctx,ref) {
  exactKeys(ref,REF_KEYS,'evidence reference'); need(typeof ref.sha256==='string' && SHA256.test(ref.sha256),'evidence SHA required');
  for (const refs of [ctx.request.approval.evidenceRefs,ctx.patch.evidenceRefs])
    need(refs?.some(r=>r.path===ref.path&&r.sha256===ref.sha256),'evidence must bind approval and selected item');
  const full=safe(ctx.root,ref.path);
  need(fs.existsSync(full)&&sha(fs.readFileSync(full))===ref.sha256,'local evidence changed');
  const immutable=gitFile(ctx,ctx.spec.evidenceCommit,ref.path);
  need(immutable.sha256===ref.sha256,'evidence differs from immutable shared commit');
  return parse(immutable.bytes);
}

function selectedSource(ctx,ref,{implicitCommit=false}={}) {
  const commit=implicitCommit?ctx.spec.evidenceCommit:ref.commit;
  const expectedPath=`archive/exams/${ctx.request.sourceArchiveFile}`;
  need(ref.path===expectedPath&&typeof ref.blobSha1==='string'&&SHA1.test(ref.blobSha1)&&
    typeof ref.sha256==='string'&&SHA256.test(ref.sha256),'exact source snapshot required');
  const file=gitFile(ctx,commit,ref.path);
  need(file.blobSha1===ref.blobSha1&&file.sha256===ref.sha256,'source snapshot blob/SHA drift');
  const bank=ctx.bankFromBytes(file.bytes),question=bank[ctx.patch.sourceOrdinal-1];
  need(bank.length===ctx.request.expectedQuestionCount&&question,'source snapshot denominator/ordinal mismatch');
  return {...file,commit,question,bank};
}

function assertNoSelectedNativeProposal(ctx) {
  const {native,row,patch}=ctx;
  need(Array.isArray(row.proposalRefs)&&row.proposalRefs.length===0,'native proposalRefs must be explicitly empty');
  need(!native.review.artifactRefs?.proposals&&!native.review.artifactRefs?.['proposals.json'],
    'external native proposal inventories are outside this narrow M2S1 application contract');
  need(Array.isArray(native.review.proposals),'native proposal inventory must be explicit');
  for (const proposal of native.review.proposals) {
    need(object(proposal),'invalid native proposal');
    const uids=proposal.supportingQuestionUids || (proposal.questionUid===undefined?[]:[proposal.questionUid]);
    const ordinals=proposal.supportOrdinals || proposal.ordinals ||
      (proposal.sourceOrdinal!==undefined?[proposal.sourceOrdinal]:proposal.ordinal!==undefined?[proposal.ordinal]:[]);
    need(Array.isArray(uids)&&Array.isArray(ordinals),'ambiguous native proposal support');
    need(!uids.includes(patch.questionUid)&&!ordinals.includes(patch.sourceOrdinal),'selected UID already has a native proposal');
  }
}

function currentRpmAuthority(ctx,application,definition) {
  const ref=application.nativeRpmRef;
  exactKeys(ref,['commit','path','sha256','recordId','recordSha256'],'native RPM reference');
  need(ref.commit===ctx.native.spec.reviewCommit&&ref.path===CROSSWALK&&ref.recordId===ctx.row.rpmRecordId,
    'native RPM reference identity differs');
  const old=gitFile(ctx,ref.commit,ref.path),oldDoc=parse(old.bytes);
  need(old.sha256===ref.sha256&&oldDoc.schemaVersion==='rpm-primary-active-crosswalk-v1'&&
    oldDoc.status==='ACTIVE_REFERENCE'&&oldDoc.rpmAuthority?.source===MASTER&&Array.isArray(oldDoc.records),
    'immutable RPM authority mismatch');
  const oldRows=oldDoc.records.filter(r=>r.id===ref.recordId),record=oldRows[0];
  need(oldRows.length===1&&objectSha(record)===ref.recordSha256,'immutable RPM row is missing or changed');
  const currentBytes=fs.readFileSync(safe(ctx.root,CROSSWALK)),current=parse(currentBytes);
  const matches=current.records?.filter(r=>r.id===record.id)||[];
  need(current.schemaVersion===oldDoc.schemaVersion&&current.status==='ACTIVE_REFERENCE'&&
    current.rpmAuthority?.source===MASTER&&matches.length===1&&equal(matches[0],record),
    'original native RPM row must remain unchanged in current authority');
  const direct=current.records.filter(r=>r.id===definition.approvedCrosswalkRow?.id);
  need(direct.length===1&&equal(direct[0],definition.approvedCrosswalkRow)&&
    direct[0].promotesRpmOnlyRowId===record.id&&equal(direct[0].rpmPath,record.rpmPath)&&
    direct[0].curriculum===record.curriculum&&direct[0].scope===record.scope&&
    direct[0].mappingStatus==='DIRECT_ACTIVE'&&direct[0].bindingStatus==='ACTIVE'&&
    direct[0].problemTypeKey===definition.approvedTemplate.parentProblemTypeKey&&
    direct[0].templateKey===definition.approvedTemplate.templateKey,
    'exact root-approved additive RPM connection missing or inconsistent');
  const decision=ctx.row.semanticDecision;
  need(record.curriculum==='2022'&&record.scope==='M2-1'&&record.mappingStatus==='RPM_ONLY'&&
    record.bindingStatus==='NO_ACTIVE_MAPPING'&&decision?.semanticCurriculum===record.curriculum&&
    equal(decision.rpmPath,record.rpmPath)&&equal(decision.rpmBasePath,record.rpmPath)&&
    decision.standardUnitKey===record.standardUnitKey&&decision.subUnitKey===record.subUnitKey,
    'native semantic decision/RPM157 scope is not exact');
  const masterBytes=fs.readFileSync(safe(ctx.root,MASTER)),master=parse(masterBytes),rp=record.rpmPath;
  need(master.schemaVersion==='js-archive-taxonomy-rpm-primary-v1.0'&&master.authorityStatus==='LOCKED'&&
    Array.isArray(master.records),'current LOCKED RPM master required');
  const leaves=master.records.filter(r=>r.curriculum===record.curriculum&&r.scope===record.scope&&
    r.majorUnit===rp.majorUnit&&r.midUnit===rp.midUnit).flatMap(r=>(r.concepts||[])
    .filter(c=>c.concept===rp.l3).flatMap(c=>(c.problemTypes||[]).filter(p=>p.problemType===rp.l4)));
  need(leaves.length===1,'native RPM path missing or ambiguous in current LOCKED master');
  return {record,proof:{nativeRef:ref,currentCrosswalkRecords:{path:CROSSWALK,recordId:record.id,
    recordSha256:objectSha(record),directRecordId:direct[0].id,directRecordSha256:objectSha(direct[0])},
    currentMasterLeaf:{path:MASTER,curriculum:record.curriculum,scope:record.scope,rpmPath:rp,
      leafSha256:objectSha(leaves[0])},authorityUse:'RPM_PATH_PROVENANCE_ONLY',selectsPtTpl:false}};
}

export function validateM2S1CurrentDefinitionApplication(input) {
  const spec=input.patch.sourceReview?.currentDefinitionApplication;
  if (spec===undefined) return null;
  const ctx={...input,spec,cache:input.cache||new Map()};
  const {request,patch,native,row,accepted,question,final,canonicalBefore,canonicalAfter}=ctx;
  exactKeys(spec,['schemaVersion','evidenceCommit','definitionApprovalRef','independentReviewRef','applicationRef'],'opt-in');
  need(spec.schemaVersion===CURRENT_DEFINITION_APPLICATION_SCHEMA&&SHA1.test(spec.evidenceCommit||''),'explicit immutable current application required');
  need(request.scope==='PARTIAL_UIDS'&&request.approval?.type==='FINAL_QA'&&request.approval.metadataReviewed===true&&
    request.registrationMode===undefined&&request.approval.sourceRebind===undefined&&patch.rebind===undefined&&
    Object.hasOwn(patch.after||{},'sourceFingerprint')&&Array.isArray(request.items)&&request.items.length===1&&
    request.items[0].questionUid===patch.questionUid&&request.items[0].sourceOrdinal===patch.sourceOrdinal&&
    Object.keys(patch.sourceReview).every(k=>REVIEW_KEYS.includes(k)),
    'exclusive one-UID ordinary FINAL_QA native source reassessment required');
  need(native.review.schemaVersion==='m2-s1-meta-review-v1'&&row.verdict==='REGISTRATION_PENDING'&&row.rpmDecision==='CORRECT'&&
    row.questionUid===patch.questionUid&&row.sourceOrdinal===patch.sourceOrdinal&&
    /^original\/middle\/m2\/(1mid|1final)\/[^/]+\.js$/.test(request.sourceArchiveFile)&&
    native.review.sourceArchiveFile===request.sourceArchiveFile&&native.review.reviewedQuestionCount===request.expectedQuestionCount&&
    native.reviewedBank.length===request.expectedQuestionCount&&native.committedBank.length===request.expectedQuestionCount,
    'exact settled M2S1 native UID/denominator required');
  const debts=[...(row.debts||[]),...(row.contentDebt||[]),...(row.registrationDebt||[])];
  need(!(row.contentDebt||[]).length&&!debts.some(d=>/^(SOURCE_|CONTENT_|SOLUTION_|PRIOR_SOURCE_QA|DIFFICULTY_HOLD|EXPLICIT_DIFFICULTY_VALIDITY)/
    .test(typeof d==='string'?d:d?.type||d?.kind||'')), 'native source/content/difficulty hold remains');
  need(Array.isArray(row.registrationDebt)&&row.registrationDebt.length===1&&
    typeof row.registrationDebt[0]==='string'&&row.registrationDebt[0].startsWith('PT_TPL_EVIDENCE_INCOMPLETE:'),
    'only the existing unresolved PT/TPL application debt is supported');
  assertNoSelectedNativeProposal(ctx);
  const original=[native.reviewedBank[patch.sourceOrdinal-1],native.committedBank[patch.sourceOrdinal-1]];
  for (const key of ['problemTypeKey','templateKey']) need(nullPrimary(row.after?.[key])&&nullPrimary(accepted[key])&&
    original.every(q=>Object.hasOwn(q,key)&&nullPrimary(q[key])),'existing native primary cannot be overwritten');
  need(original.every(q=>equal(ctx.studentPayload(q),ctx.studentPayload(question))), 'protected native/current student payload differs');
  need(original.every(q=>q.sourceIssueHold!==true&&q.sourceDefectCandidate!==true)&&
    question.sourceIssueHold!==true&&question.sourceDefectCandidate!==true,'explicit source hold cannot be bypassed');
  for (const key of ['image','images','figureSvg','solutionImage','solutionImages','solutionFigureSvg'])
    need([question,...original].every(q=>q[key]===undefined||q[key]===null||q[key]===''||Array.isArray(q[key])&&q[key].length===0),
      'v1 current definition application is confined to text-only source evidence');
  for (const key of DIFFICULTY) need(Object.hasOwn(row.finalDifficulty||{},key)&&equal(accepted[key],row.finalDifficulty[key])&&
    equal(final[key],row.finalDifficulty[key]),`native difficulty value changed: ${key}`);

  const definition=boundDocument(ctx,spec.definitionApprovalRef),independent=boundDocument(ctx,spec.independentReviewRef),
    application=boundDocument(ctx,spec.applicationRef);
  const nativeRef={commit:native.spec.reviewCommit,path:native.spec.reviewPath,sha256:native.spec.reviewRef.sha256};
  need(definition.schemaVersion===DEFINITION_SCHEMA&&definition.decision==='APPROVE_EXACT_GENERIC_DEFINITION_AND_CURRENT_UID_APPLICATION'&&
    definition.reviewer===request.approval.approvedBy&&definition.owner===definition.reviewer&&
    text(definition.reviewer)&&text(definition.preparedBy)&&definition.reviewer!==definition.preparedBy&&
    definition.nativeReviewer===native.reviewer&&definition.reviewer!==native.reviewer&&
    definition.independentFromNativeAuthor===true&&definition.blindReviewClaim===false&&
    equal(definition.nativeReviewRef,{commit:nativeRef.commit,path:nativeRef.path,localRef:native.spec.reviewRef})&&
    definition.existingDefinitionChanges===0&&definition.sourceAndSolutionMutationRequired===false&&
    definition.sourceApprovalFlagsMustRemainUnchanged===true,'root definition approval identity/scope mismatch');
  const applicationKeys=['schemaVersion','reviewer','decision','questionUid','sourceOrdinal','sourceArchiveFile','expectedQuestionCount',
    'definitionApprovalRef','independentReviewRef','nativeReviewRef','nativeItemStableSha256','sourceBeforeRef','currentSourceRef',
    'protectedStudentPayloadSha256','noNativeProposal','nativeProposalRefs','nativeSupportingProposalCount',
    'approvedTemplateStableSha256','approvedBindingStableSha256','retainedRationale','nativeRpmRef','sourceMetadataDelta'];
  exactKeys(application,applicationKeys,'current application binding');
  need(application.schemaVersion===APPLICATION_SCHEMA&&
    application.decision==='BIND_APPROVED_CURRENT_DEFINITION_TO_UNCHANGED_STUDENT_PAYLOAD'&&
    equal(application.definitionApprovalRef,spec.definitionApprovalRef)&&equal(application.independentReviewRef,spec.independentReviewRef)&&
    equal(application.nativeReviewRef,nativeRef)&&application.nativeItemStableSha256===objectSha(row)&&
    application.noNativeProposal===true&&equal(application.nativeProposalRefs,[])&&application.nativeSupportingProposalCount===0,
    'current application must preserve the exact native item and absence of a native proposal');
  for (const doc of [definition,application,independent]) need(doc.questionUid===patch.questionUid&&
    doc.sourceOrdinal===patch.sourceOrdinal&&doc.sourceArchiveFile===request.sourceArchiveFile,
    'approval/application UID or source mismatch');
  need(definition.expectedQuestionCount===request.expectedQuestionCount&&application.expectedQuestionCount===request.expectedQuestionCount,
    'approval/application denominator mismatch');
  const payloadSha=objectSha(ctx.studentPayload(question));
  need(definition.currentProtectedStudentPayloadSha256===payloadSha&&application.protectedStudentPayloadSha256===payloadSha,
    'protected payload proof hash mismatch');
  need(independent.schemaVersion===INDEPENDENT_SCHEMA&&independent.decision==='APPROVE_EXACT_DEFINITION_AND_CURRENT_UID_APPLICATION'&&
    text(independent.reviewer?.id)&&application.reviewer===definition.reviewer&&
    ![definition.reviewer,definition.preparedBy,native.reviewer].includes(independent.reviewer.id)&&
    independent.reviewer.independentFromRootApprover===definition.reviewer&&
    independent.reviewer.independentFromProposalPreparer===definition.preparedBy&&
    independent.reviewer.independentFromNativeAuthor===true&&independent.reviewer.blindReviewClaim===false&&
    equal(independent.inputRefs?.rootDefinitionApproval,spec.definitionApprovalRef)&&
    equal(independent.inputRefs?.proposal,definition.proposalRef)&&equal(independent.nativeReviewRef,nativeRef)&&
    independent.nativeItemRef?.array==='items'&&independent.nativeItemRef.sourceOrdinal===patch.sourceOrdinal&&
    independent.nativeItemRef.questionUid===patch.questionUid&&independent.nativeItemRef.sha256===objectSha(row)&&
    equal(independent.protectedPayloadContract?.fields,ctx.studentFields)&&independent.protectedStudentPayloadIdenticalAcrossAllThreeSnapshots===true&&
    independent.currentQuestionRawTextRead===true&&independent.currentExistingSolutionRead===true&&independent.nativeItemRead===true&&
    independent.referencedStudentAssetCount===0&&equal(independent.blockingFindings,[]), 'original independent application review is absent, non-independent or inconsistent');
  need(independent.currentApplicationDecision?.newTemplateMeaningApproved===true&&
    independent.currentApplicationDecision.currentQ21ApplicationApproved===true&&
    independent.currentApplicationDecision.existingParentDefinitionChanged===false&&
    independent.currentApplicationDecision.unselectedUidApplicationApproved===false&&
    independent.preservedLimits?.newFullMathematicalQa===false&&independent.preservedLimits.newSourceQualityApproval===false&&
    independent.preservedLimits.newDifficultyJudgment===false&&independent.preservedLimits.nativeAcceptedDifficultyReused===true&&
    independent.nativeAuthorityPreserved?.nativeAfterContainsNewPTTPL===false&&
    equal(independent.nativeAuthorityPreserved.nativeProposalRefs,[])&&
    independent.nativeAuthorityPreserved.retroactiveNativeProposalOrApprovalClaim===false,
    'independent review exceeds the approved current-application boundary');

  need(equal(application.sourceBeforeRef,definition.currentSourceRef),'application baseline differs from approved source');
  const before=selectedSource(ctx,application.sourceBeforeRef);
  exactKeys(application.currentSourceRef,['path','blobSha1','sha256','questionStableSha256'],'current source reference');
  const current=selectedSource(ctx,application.currentSourceRef,{implicitCommit:true});
  need(current.blobSha1===request.expectedSourceBlobSha1&&objectSha(current.question)===application.currentSourceRef.questionStableSha256&&
    equal(current.question,question)&&equal(ctx.studentPayload(before.question),ctx.studentPayload(question)),'current immutable source/question mismatch');
  need(before.bank.every((q,index)=>index===patch.sourceOrdinal-1||equal(q,current.bank[index])),
    'immutable application changed an unselected question');
  // Later approval-preserving source-only rebinds may change other questions.
  // The selected full question and denominator remain exact, and the registrar
  // authenticates the whole source blob on the initial write and receipt replay.
  const liveBank=ctx.bankFromBytes(fs.readFileSync(safe(ctx.root,application.currentSourceRef.path)));
  need(liveBank.length===request.expectedQuestionCount&&equal(liveBank[patch.sourceOrdinal-1],question),
    'live selected question or denominator differs from immutable application');
  need(Array.isArray(independent.sourceSnapshots)&&independent.sourceSnapshots.length===3,'independent source snapshot inventory mismatch');
  const expectedSnapshots=[{commit:native.review.baseSha,blobSha1:native.sourceBlob},{commit:native.spec.reviewCommit,blobSha1:native.committedBlob},
    {commit:application.sourceBeforeRef.commit,blobSha1:before.blobSha1}];
  for (const expected of expectedSnapshots) {
    const matches=independent.sourceSnapshots.filter(r=>r.commit===expected.commit&&r.blobSha1===expected.blobSha1),ref=matches[0];
    need(matches.length===1&&ref.path===application.sourceBeforeRef.path&&ref.questionCount===request.expectedQuestionCount&&
      ref.selectedOrdinal===patch.sourceOrdinal&&ref.protectedStudentPayloadSha256===payloadSha,'independent source snapshot differs');
    const checked=selectedSource(ctx,ref); need(objectSha(ctx.studentPayload(checked.question))===payloadSha,'independent source payload differs');
  }

  const tpl=definition.approvedTemplate,binding=definition.approvedBinding,ptKey=tpl?.parentProblemTypeKey,tplKey=tpl?.templateKey;
  need(tpl?.status==='ACTIVE'&&text(tplKey)&&text(ptKey)&&text(tpl.definition)&&text(tpl.internalSkeleton)&&
    equal(tpl.supportingQuestionUids,[patch.questionUid])&&tpl.supportingItemCount===1&&
    application.approvedTemplateStableSha256===objectSha(tpl)&&application.approvedBindingStableSha256===objectSha(binding),
    'exact one-UID new template/binding approval required');
  const semanticDefinition=Object.fromEntries(SEMANTIC_DEFINITION_KEYS.map(k=>[k,tpl[k]]));
  need(independent.definitionRef?.path===spec.definitionApprovalRef.path&&independent.definitionRef.jsonPath==='approvedTemplate'&&
    independent.definitionRef.sha256===objectSha(tpl)&&equal(independent.definitionRef.semanticDefinition,semanticDefinition)&&
    independent.definitionRef.semanticDefinitionSha256===objectSha(semanticDefinition),'independent exact definition digest differs');
  const beforePt=canonicalBefore?.pt?.get(ptKey),afterPt=canonicalAfter?.pt?.get(ptKey),afterTpl=canonicalAfter?.tpl?.get(tplKey);
  need(beforePt?.status==='ACTIVE'&&equal(beforePt,afterPt)&&equal(beforePt,definition.existingParent?.problemType)&&
    tpl.ownerPack===beforePt.ownerPack&&!canonicalBefore?.tpl?.has(tplKey)&&equal(afterTpl,tpl),
    'requires unchanged existing ACTIVE parent and exactly one new template');
  const parentSnapshot=gitFile(ctx,application.sourceBeforeRef.commit,definition.existingParent.path);
  need(parentSnapshot.sha256===definition.existingParent.sha256&&independent.parentRef?.commit===application.sourceBeforeRef.commit&&
    independent.parentRef.path===definition.existingParent.path&&independent.parentRef.sha256===parentSnapshot.sha256&&
    independent.parentRef.problemTypeKey===ptKey&&independent.parentRef.problemTypeSha256===objectSha(beforePt)&&
    parse(parentSnapshot.bytes).problemTypes?.filter(p=>p.problemTypeKey===ptKey&&equal(p,beforePt)).length===1,
    'immutable parent definition evidence differs');
  const rpm=currentRpmAuthority(ctx,application,definition),record=rpm.record,rp=record.rpmPath;
  const aliases={rpmPrimaryId:record.id,rpmL1:rp.majorUnit,rpmL2:rp.midUnit,courseKey:record.scope};
  for (const q of [...original,before.question,question]) need(q.curriculum===record.curriculum&&
    q.standardCourse===binding.standardCourse&&q.standardUnitKey===record.standardUnitKey&&q.subUnitKey===record.subUnitKey&&
    q.rpmPrimaryRecordId===record.id&&equal(q.rpmPrimaryPath,rp)&&q.rpmL3===rp.l3&&q.rpmL4===rp.l4,
    'source native RPM path or explicit scope changed');
  need(binding.status==='ACTIVE'&&binding.curriculum===record.curriculum&&binding.standardUnitKey===record.standardUnitKey&&
    binding.subUnitKey===record.subUnitKey&&binding.problemTypeKey===ptKey&&binding.ownerPack==='MIDDLE2'&&
    binding.L1===rp.majorUnit&&binding.L2===rp.midUnit&&equal(binding.supportingQuestionUids,[patch.questionUid])&&binding.supportingItemCount===1,
    'exact one-UID M2 binding differs from native RPM scope');
  const tuple=[binding.curriculum,binding.standardCourse,binding.standardUnitKey,binding.subUnitKey,binding.problemTypeKey],bindingKey=stable(tuple);
  need(!canonicalBefore?.bindings?.has(bindingKey)&&equal(canonicalAfter?.bindings?.get(bindingKey),binding),
    'requires exactly one new exact ACTIVE curriculum binding');
  const pack=canonicalAfter?.packs?.get(binding.ownerPack)?.meta;
  need(pack?.canonicalStatus==='ACTIVE'&&pack.curricula?.includes(record.curriculum)&&
    pack.standardCourses?.includes(binding.standardCourse)&&pack.standardCourses.includes(record.scope)&&
    pack.ownedStandardUnitDomains?.includes(binding.standardUnitKey),'current ACTIVE owner pack scope missing');
  const changes=request.registryChanges||[];
  need(changes.length===2,'only the approved template and binding additions are admitted');
  const expectedChanges=[{path:`archive/data/meta-foundation/canonical/packs/${slug(tpl.ownerPack)}/taxonomy.json`,collection:'templates',
    match:{templateKey:tplKey},before:null,after:tpl},
    {path:'archive/data/meta-foundation/canonical/packs/middle2/bindings.json',collection:'bindings',
      match:Object.fromEntries(['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'].map(k=>[k,binding[k]])),before:null,after:binding}];
  for (const expected of expectedChanges) need(changes.filter(c=>equal(Object.fromEntries(Object.keys(expected).map(k=>[k,c[k]])),expected)).length===1,
    'request must contain exactly the two approved add-only registry objects');

  const rationale={};
  for (const key of ['primaryMethod','decisiveStep']) {
    const value=original[0][key];
    need(text(value)&&[original[1][key],before.question[key],question[key],final[key],patch.after[key]].every(v=>equal(v,value)),
      `retained native source rationale differs: ${key}`);
    need(independent.rationaleContinuity?.[key==='primaryMethod'?'currentPrimaryMethod':'currentDecisiveStep']===value&&
      independent.rationaleContinuity[key==='primaryMethod'?'nativePrimaryMethod':'nativeDecisiveStep']===row[key]&&
      independent.rationaleContinuity.currentRationaleIdenticalInAllThreeSources===true,'independent rationale continuity differs');
    rationale[key]=value;
  }
  need(equal(application.retainedRationale,rationale),'application retained rationale differs');
  const set={problemTypeKey:ptKey,templateKey:tplKey,rpmPrimaryId:aliases.rpmPrimaryId,rpmL1:aliases.rpmL1,rpmL2:aliases.rpmL2,
    courseKey:aliases.courseKey,integrationPattern:row.after.integrationPattern};
  const remove={projectionStatus:'RPM_ONLY',ownerPack:null,
    nullReason:'RPM_ONLY: no exact target-scope ACTIVE PT/TPL pair; null explicit.',
    projectionReason:'middle2 RPM crosswalk mapping=RPM_ONLY; bindingStatus=NO_ACTIVE_MAPPING.'};
  need(row.after.integrationPattern==='NONE'&&equal(application.sourceMetadataDelta,{set,remove}),
    'source delta is not the exact approved seven values and four obsolete annotation removals');
  const expectedQuestion=structuredClone(before.question);
  for (const [key,value] of Object.entries(remove)) {
    need(Object.hasOwn(expectedQuestion,key)&&equal(expectedQuestion[key],value),'obsolete annotation before value differs');
    delete expectedQuestion[key];
  }
  for (const [key,value] of Object.entries(set)) {
    if (['rpmPrimaryId','rpmL1','rpmL2','courseKey'].includes(key)) need(!Object.hasOwn(expectedQuestion,key), 'native-derived alias already existed in baseline');
    expectedQuestion[key]=value;
  }
  need(equal(question,expectedQuestion),'current whole question changes exceed the exact metadata delta');
  for (const key of ['answerStatus','solutionStatus','reviewStatus']) need(
    equal(definition.originalSourceApprovalFlags?.[key],before.question[key]??null)&&
    equal(independent.preservedLimits.originalSourceApprovalFlags?.[key],before.question[key]??null)&&
    equal(question[key],before.question[key]),'original source approval flags changed');
  const fields={problemTypeKey:ptKey,templateKey:tplKey,standardCourse:binding.standardCourse,...rationale,...aliases};
  for (const [key,value] of Object.entries(fields)) need(equal(question[key],value)&&equal(final[key],value)&&
    equal(patch.after[key],value),`current application field mismatch: ${key}`);
  return {fields,retainedRationaleFields:rationale,nativeRpmAliasFields:aliases,proof:{
    schemaVersion:CURRENT_DEFINITION_APPLICATION_SCHEMA,evidenceCommit:spec.evidenceCommit,
    definitionApprovalRef:spec.definitionApprovalRef,independentReviewRef:spec.independentReviewRef,applicationRef:spec.applicationRef,
    nativeReviewRef:nativeRef,nativeItemStableSha256:objectSha(row),questionUid:patch.questionUid,sourceOrdinal:patch.sourceOrdinal,
    expectedQuestionCount:request.expectedQuestionCount,nativeAfterChanged:false,nativeProposalFabricated:false,
    nativeProposalRefs:[],nativeSupportingProposalCount:0,sourceBeforeRef:application.sourceBeforeRef,
    currentSourceRef:{commit:spec.evidenceCommit,...application.currentSourceRef},studentPayloadSha256:payloadSha,
    rootDefinitionReviewer:definition.reviewer,independentApplicationReviewer:independent.reviewer.id,
    parentDefinitionSha256:objectSha(beforePt),templateDefinitionSha256:objectSha(tpl),exactActiveBindingSha256:objectSha(binding),
    sourceMetadataDelta:application.sourceMetadataDelta,fieldSha256:Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,objectSha(v)])),
    retainedRationaleOrigin:'CURRENT_DEFINITION_APPLICATION_UNCHANGED_NATIVE_SOURCE',nativeRpmAliasOrigin:'CURRENT_DEFINITION_APPLICATION_NATIVE_RPM_ALIAS',
    retainedStandardCourseOrigin:'UNCHANGED_NATIVE_AND_CURRENT_SOURCE_EXACT_BINDING',
    nativeRpmAuthority:rpm.proof,newTemplateDefinitions:1,newBindings:1,existingDefinitionChanges:0,newMathematicalQa:false,
    newSourceQualityApproval:false,newDifficultyJudgment:false,unselectedUidApproval:false,
  }};
}
