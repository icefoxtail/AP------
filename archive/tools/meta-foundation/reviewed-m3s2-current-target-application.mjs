// One current target application reuses an immutable native primary decision.
// It does not select a publisher RPM leaf, extend RPM provenance authority, or
// reinterpret a lower-grade native after-value as an original M3 approval.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const M3_CURRENT_TARGET_APPLICATION_SCHEMA = 'archive-m3s2-current-target-application-v1';
const APPLICATION = 'archive-m3s2-current-target-application-binding-v1';
const APPROVAL = 'archive-m3s2-current-target-root-approval-v1';
const INDEPENDENT = 'archive-m3s2-current-target-application-independent-review-v1';
const PROPOSAL = 'archive-m3s2-prerequisite-current-target-application-proposal-v1';
const UID = 'qid_v1_916c03908e6a08d858a3e99febc0f465ee8e366e4496ec1788deb8ae87601546';
const SOURCE = 'original/middle/m3/2mid/22_풍덕중_2학기_중간_중3_수학.js';
const PT = 'PT_TRIANGLE_ANGLE_BISECTOR', TPL = 'TPL_TRIANGLE_ANGLE_BISECTOR_SIDE_RATIO';
const CANON = 'archive/data/meta-foundation/canonical/packs/middle-geometry/';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const TAG_MASTER = 'archive/data/master_tables/js_archive_tag_master.json';
const RULE = 'docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md';
const SOLUTION_RULE = 'docs/rules/02_PIPELINES/해설프로토콜.md';
const SOURCE_DELTA = Object.freeze({standardCourse:'중3 수학',standardUnitKey:'M3-05',standardUnit:'삼각비',
  standardSubUnitKey:'M3-05-TRIG_RATIO',subUnitKey:'M3-05-TRIG_RATIO',subUnit:'삼각비',courseKey:'M3-2',
  semanticSourceScope:'M2-2',semanticScopeRelation:'PREREQUISITE_LOWER_GRADE'});
const TARGET = Object.freeze({curriculum:'2015',courseKey:'M3-2',standardCourse:'중3 수학',standardUnitKey:'M3-05',
  subUnitKey:'M3-05-TRIG_RATIO',L1:'삼각비',L2:'삼각비'});
const LIMITS = Object.freeze({nativeOriginalCurriculum:'UNSPECIFIED',semantic2015ExactRpmRecordId:null,
  semantic2015PublisherParentAndLeafResolved:false,comparison2022RpmRecordId:'M2-RPM-182',comparison2022BindingResolved:false,
  oldM3Rpm059SemanticApprovalRestored:false,fullSemanticResolution:false,officialResolverVerifiedFinal:false,
  newFullMathematicalQa:false,newSourceQualityApproval:false,newDifficultyJudgment:false});
const STUDENT_FIELDS = Object.freeze(['id','number','sourceQuestionNo','sourceQid','sourceOrdinal','questionUid','questionType','content','question',
  'choices','answer','solution','image','images','figureSvg','solutionImage','solutionImages','solutionFigureSvg','layoutTag','wide',
  'imageSize','solutionImageAlt','solutionImageCaption','solutionImageSize','score']);
const SOURCE_REVIEW_KEYS = ['schemaVersion','reviewCommit','reviewPath','reviewRef','rendererProof','currentTargetApplication'];
const RPM_FIELDS = ['rpmPrimaryId','rpmPrimaryPath','rpmL1','rpmL2','rpmL3','rpmL4'];
const DIFFICULTY = ['level','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'];
const BINDING_KEYS = ['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'];
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value,(_,v) => v && typeof v==='object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k,v[k]])) : v);
const equal = (a,b) => stable(a)===stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const digest = value => sha(stable(value));
const text = value => typeof value==='string' && value.trim().length>0;
const object = value => value && typeof value==='object' && !Array.isArray(value);
const fail = message => { throw new Error('M3 current target application: '+message); };
const need = (condition,message) => { if (!condition) fail(message); };
const keys = (value,allowed,label) => need(object(value) && equal(Object.keys(value).sort(),[...allowed].sort()),label+' shape mismatch');
const sourcePath = 'archive/exams/'+SOURCE;

function safe(root,relative) {
  need(text(relative) && !path.isAbsolute(relative) && !/[\\\0]/.test(relative) &&
    relative.split('/').every(p => p && p!=='.' && p!=='..'),'unsafe repository evidence path');
  const full=path.resolve(root,relative);
  for(let p=full;p!==path.resolve(root);p=path.dirname(p))
    need(!fs.existsSync(p) || !fs.lstatSync(p).isSymbolicLink(),'symlink evidence path');
  return full;
}
function git(ctx,args) {
  try { return execFileSync('git',args,{cwd:ctx.root,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}); }
  catch { fail('immutable Git authority unavailable'); }
}
function gitFile(ctx,commit,relative) {
  safe(ctx.root,relative);need(SHA1.test(commit || ''),'exact immutable commit required');
  const key='m3-current-target:'+commit+':'+relative;
  if(!ctx.cache.has(key)) {
    need(git(ctx,['rev-parse','--verify',commit+'^{commit}']).toString().trim()===commit,'exact commit required');
    const blobSha1=git(ctx,['rev-parse',commit+':'+relative]).toString().trim(),bytes=git(ctx,['cat-file','blob',blobSha1]);
    ctx.cache.set(key,{bytes,blobSha1,sha256:sha(bytes)});
  }
  return ctx.cache.get(key);
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail('invalid evidence JSON'); } }
function bound(ctx,ref) {
  keys(ref,['path','sha256'],'bound evidence reference');need(SHA256.test(ref.sha256 || ''),'evidence SHA required');
  for(const refs of [ctx.request.approval.evidenceRefs,ctx.patch.evidenceRefs])
    need(refs?.some(r => r.path===ref.path && r.sha256===ref.sha256),'evidence must bind approval and selected item');
  const full=safe(ctx.root,ref.path);
  need(fs.existsSync(full) && sha(fs.readFileSync(full))===ref.sha256,'local evidence changed');
  const file=gitFile(ctx,ctx.spec.applicationCommit,ref.path);
  need(file.sha256===ref.sha256,'bound evidence differs from immutable application commit');
  return parse(file.bytes);
}
function immutable(ctx,ref) {
  need(object(ref) && SHA256.test(ref.sha256 || '') && SHA1.test(ref.gitBlobSha1 || ref.blobSha1 || ''),'exact authority digest required');
  const file=gitFile(ctx,ref.commit,ref.path);
  need(file.sha256===ref.sha256 && file.blobSha1===(ref.gitBlobSha1 || ref.blobSha1),'immutable authority digest mismatch');
  return file;
}
function snapshot(ctx,ref,implicit=false) {
  need(ref.path===sourcePath,'exact E043 source path required');
  const file=immutable(ctx,{...ref,commit:implicit ? ctx.spec.applicationCommit : ref.commit});
  const bank=ctx.bankFromBytes(file.bytes),question=bank[10];
  need(bank.length===25 && question,'exact full source denominator required');
  return {...file,bank,question};
}
function currentJson(ctx,p) { return parse(fs.readFileSync(safe(ctx.root,p))); }
const tuple = binding => stable(BINDING_KEYS.map(k => binding[k]??null));

export function validateM3S2CurrentTargetApplication(input) {
  const spec=input.patch.sourceReview?.currentTargetApplication;
  if(spec===undefined) return null;
  const ctx={...input,spec,cache:input.cache || new Map()};
  const {request,patch,native,row,question,final,canonicalBefore,canonicalAfter,rendererContinuity}=ctx;
  keys(spec,['schemaVersion','applicationCommit','applicationRef','independentRef'],'explicit current target opt-in');
  need(spec.schemaVersion===M3_CURRENT_TARGET_APPLICATION_SCHEMA && SHA1.test(spec.applicationCommit || ''),
    'exact current target application contract required');
  need(request.schemaVersion==='archive-reviewed-exam-meta-register-request-v2' && request.scope==='PARTIAL_UIDS' &&
    request.approval?.type==='FINAL_QA' && request.approval.metadataReviewed===true && request.approval.sourceRebind===undefined &&
    request.registrationMode===undefined && patch.rebind===undefined && request.sourceArchiveFile===SOURCE &&
    request.expectedQuestionCount===25 && request.items?.length===1 && equal(request.items[0],patch) &&
    patch.questionUid===UID && patch.sourceOrdinal===11 && Object.hasOwn(patch.after || {},'sourceFingerprint'),
    'exclusive E043 Q11 partial ordinary FINAL_QA application required');
  keys(patch.sourceReview,SOURCE_REVIEW_KEYS,'source review');
  need(equal(ctx.studentFields,STUDENT_FIELDS),'official student payload field contract differs');
  need(native.review.schemaVersion==='m3-s2-complete-semantic-review-v1' && native.review.examId==='E043' &&
    native.review.questionCount===25 && native.review.sourceArchiveFile===SOURCE && row.ordinal===11 && row.questionUid===UID &&
    row.decision==='CORRECT' && text(row.decisiveStep) && row.after?.problemTypeKey===PT && row.after.templateKey===TPL &&
    row.after.standardCourse==='중2 수학' && row.after.standardUnitKey==='M2-05' &&
    row.after.subUnitKey==='M2-05-TRIANGLE_PROPERTIES','immutable lower-grade native primary decision differs');
  const rpm=row.rpm;
  need(rpm?.originalCurriculum===null && rpm.originalCurriculumProvenance?.status==='UNSPECIFIED' &&
    rpm.base?.curriculum==='2015' && rpm.base.scope==='M2-2' && rpm.base.recordId===null &&
    rpm.base.midUnit===null && rpm.base.l3===null && rpm.base.l4===null &&
    rpm.base.status==='ORIGINAL_PUBLISHER_PARENT_AND_LEAF_GAP' && rpm.current2022?.recordId==='M2-RPM-182' &&
    rpm.rejectedHistoricalBaseRecord==='M3-RPM-059' && row.after.rpmPrimaryKey===null &&
    row.after.metaStatus==='PROJECTION_PENDING' && equal(row.after.metaDebtFields,['rpmPrimaryKey']) &&
    ['ORIGINAL_EXACT_LEAF_GAP','CURRENT2022_BINDING_GAP'].every(k => row.debts?.some(d => d.type===k)),
    'original curriculum, publisher leaf and comparison debt must remain unresolved');
  for(const key of RPM_FIELDS) need((question[key]??null)===null && (final[key]??null)===null &&
    (patch.after[key]??null)===null,'current target must not fabricate a semantic RPM field: '+key);
  need(!['VERIFIED_FINAL','FINAL','VERIFIED'].includes(final.rpmSemanticStatus),'current target cannot claim full RPM resolution');
  need(rendererContinuity?.schemaVersion==='archive-reviewed-current-renderer-continuity-v1' &&
    rendererContinuity.currentStudentPayloadSha256===digest(ctx.studentPayload(question)),
    'existing independently reviewed renderer proof must be validated first');

  const application=bound(ctx,spec.applicationRef),independent=bound(ctx,spec.independentRef);
  const applicationKeys=['schemaVersion','reviewer','decision','questionUid','sourceOrdinal','sourceArchiveFile','expectedQuestionCount',
    'rootApprovalRef','independentRef','proposalRef','nativeReviewRef','nativeItemStableSha256','sourceBeforeRef','currentSourceRef',
    'protectedStudentPayloadSha256','sourceMetadataDelta','problemTypeStableSha256','templateStableSha256','bindingStableSha256','limitations'];
  keys(application,applicationKeys,'immutable current application');
  const approval=bound(ctx,application.rootApprovalRef),proposal=bound(ctx,application.proposalRef);
  const nativeRef={commit:native.spec.reviewCommit,path:native.spec.reviewPath,sha256:native.spec.reviewRef.sha256};
  need(application.schemaVersion===APPLICATION && application.decision==='BIND_EXACT_CURRENT_TARGET_ONLY' &&
    application.reviewer===request.approval.approvedBy && equal(application.independentRef,spec.independentRef) &&
    equal(application.nativeReviewRef,nativeRef) && application.nativeItemStableSha256===digest(row) &&
    equal(application.limitations,LIMITS),'application authority or preserved limitations differ');
  need(approval.schemaVersion===APPROVAL && approval.decision==='APPROVE_EXACT_CURRENT_TARGET_APPLICATION_ONLY' &&
    approval.approvedBy===request.approval.approvedBy && approval.owner===approval.approvedBy && text(approval.approvedBy) &&
    text(proposal.preparedBy) && approval.approvedBy!==proposal.preparedBy && approval.approvedBy!==native.reviewer &&
    equal(approval.proposalRef,application.proposalRef) && equal(approval.independentReviewRef,spec.independentRef) &&
    approval.nativeItemStableSha256===digest(row) && approval.definitionChanges===0 && approval.addOnlyBindingCount===1 &&
    approval.targetApprovalOrigin==='NEW_CURRENT_TARGET_APPLICATION' &&
    approval.originalTargetOrigin==='IMMUTABLE_REVIEWED_BEFORE_SOURCE_FIELDS' &&
    approval.implementationApprovedOnlyWithinThisExactContract===true &&
    approval.rootVerification?.currentPrerequisiteRuleRead===true &&
    approval.rootVerification.immutableSourceBeforeNativeAndCurrentRead===true &&
    approval.rootVerification.nativeDecisiveStepAndIndependentMeaningRead===true &&
    Object.entries(LIMITS).filter(([k]) => !['oldM3Rpm059SemanticApprovalRestored','fullSemanticResolution',
      'officialResolverVerifiedFinal'].includes(k)).every(([k,v]) => equal(approval.preservedLimits?.[k],v)) &&
    approval.preservedLimits.existingSourceAndDifficultyHoldsReleased===0 && approval.preservedLimits.newSemanticDefinitionApproval===false,
    'distinct root approval must approve only this target application');
  need(proposal.schemaVersion===PROPOSAL && proposal.newDefinitionCount===0 && proposal.newBindingCount===1 &&
    proposal.newFullMathematicalQa===false && proposal.newSourceQualityApproval===false && proposal.newDifficultyJudgment===false,
    'proposal scope exceeds the closed application');
  for(const doc of [application,approval,proposal,independent]) need(doc.questionUid===UID && doc.sourceOrdinal===11 &&
    doc.sourceArchiveFile===SOURCE && doc.expectedQuestionCount===25,'approval/source/UID denominator mismatch');
  need(independent.schemaVersion===INDEPENDENT && independent.decision==='APPROVE_EXACT_CURRENT_TARGET_APPLICATION_ONLY' &&
    text(independent.reviewer) && ![approval.approvedBy,proposal.preparedBy,native.reviewer].includes(independent.reviewer) &&
    independent.proposalAuthor===proposal.preparedBy && independent.owner===approval.approvedBy &&
    independent.proposalRef?.sha256===application.proposalRef.sha256 && independent.nativeItemStableSha256===digest(row) &&
    independent.targetApprovalOrigin==='THIS_INDEPENDENT_CURRENT_APPLICATION_NOT_NATIVE_AFTER' &&
    independent.currentApplicationApprovalCount===1 && independent.newSemanticDefinitionApproval===false &&
    independent.newFullMathematicalQa===false && independent.newSourceQualityApproval===false &&
    independent.newDifficultyJudgment===false &&
    independent.originalCurriculum==='UNSPECIFIED' && independent.semantic2015ExactRpmRecordId===null &&
    independent.semantic2015PublisherParentAndLeafResolved===false && independent.comparison2022RpmRecordId==='M2-RPM-182' &&
    independent.comparison2022BindingResolved===false && independent.oldM3Rpm059SemanticApprovalRestored===false,
    'independent current application approval missing or exceeds its boundary');
  const checks=independent.checks || {};
  const targetName='2015|M3-2|중3 수학|M3-05|M3-05-TRIG_RATIO|삼각비|삼각비';
  for(const doc of [approval,independent]) need(doc.currentTarget===targetName && doc.semanticSourceScope==='M2-2' &&
    doc.semanticScopeRelation==='PREREQUISITE_LOWER_GRADE','approval must distinguish exact operational target and semantic scope');
  need(['nativeAndIndependentMeaningHashesExact','nativeAfterPreservedAsM2','originalTargetExplicit','currentMasterParentUnique',
    'activePrimaryDefinitionsUnchanged','ownerPackAlreadySupportsTarget','exactTargetBindingAbsentBefore',
    'currentRationaleDifficultyHoldsAndProjectionDebtUnchanged','rendererProofSelectedPayloadExact'].every(k => checks[k]===true) &&
    checks.bindingAdditions===1 && checks.definitionChanges===0 && checks.sourceChangedUidCount===1 &&
    checks.selectedSourceMetadataFieldsChanged===9 && checks.studentPayloadsUnchanged===25 &&
    checks.identityHashesUnchanged===25 && checks.otherWholeQuestionsUnchanged===24,
    'independent narrowed application checks differ');

  const proposalNative=proposal.native;
  need(proposalNative?.reviewRef?.commit===nativeRef.commit && proposalNative.reviewRef.path===nativeRef.path &&
    proposalNative.reviewRef.sha256===nativeRef.sha256 && proposalNative.itemStableSha256===digest(row) &&
    equal(proposalNative.nativeAfterUnchanged,row.after) && equal(proposalNative.exact2015PublisherRpm,rpm.base) &&
    equal(proposalNative.exact2022Comparison,rpm.current2022) && equal(proposalNative.preservedDebts,row.debts),
    'proposal does not bind the exact unchanged native item');
  immutable(ctx,proposalNative.reviewRef);
  const nativeIndependent=parse(immutable(ctx,proposalNative.independentRef).bytes);
  const independentRows=nativeIndependent.items?.filter(r => r.questionUid===UID && r.ordinal===11) || [];
  // The immutable M3 packet uses c/a in its integrator manifest and
  // review_c/review_a in the independently authored witness document.
  const nativeActor=value => /^[abc]$/.test(value || '') ? value : /^review_[abc]$/.test(value || '') ? value.slice(7) : value;
  need(proposalNative.independentRef.commit===nativeRef.commit && nativeIndependent.schemaVersion==='archive-independent-semantic-sample-v1' &&
    nativeActor(nativeIndependent.author)===nativeActor(native.reviewer) && text(nativeIndependent.reviewer) &&
    nativeActor(nativeIndependent.reviewer)===nativeActor(native.review.independentReviewer) &&
    nativeActor(nativeIndependent.reviewer)!==nativeActor(native.reviewer) &&
    nativeIndependent.newMathematicalVerification===false && independentRows.length===1 && independentRows[0].status==='PASS' &&
    independentRows[0].metadataClassification==='PASS' && independentRows[0].newMathematicalVerification===false &&
    digest(independentRows[0])===proposalNative.independentItemStableSha256 &&
    digest(independentRows[0])===independent.nativeIndependentItemStableSha256 &&
    digest(independentRows[0])===approval.nativeIndependentItemStableSha256,'native independent meaning authority differs');
  const nativeProposals=parse(immutable(ctx,proposalNative.proposalRef).bytes),nativeProposal=nativeProposals[1];
  keys(nativeProposal,['kind','supportingQuestionUids','historicalSourceRpm','currentExactRpm','existingActiveProblemType',
    'existingActiveTemplate','newProblemTypeRequired','newTemplateRequired','reason','owner'],'native technical proposal');
  need(proposalNative.proposalRef.commit===nativeRef.commit && proposalNative.proposalRef.index===1 &&
    nativeProposal.kind==='ORIGINAL_PUBLISHER_PARENT_AND_LEAF_GAP' && equal(nativeProposal.supportingQuestionUids,[UID]) &&
    nativeProposal.historicalSourceRpm==='M3-RPM-059' && nativeProposal.currentExactRpm==='M2-RPM-182' &&
    nativeProposal.existingActiveProblemType===PT && nativeProposal.existingActiveTemplate===TPL &&
    nativeProposal.newProblemTypeRequired===false && nativeProposal.newTemplateRequired===false &&
    equal(nativeProposal,proposalNative.originalProposal) && digest(nativeProposal)===proposalNative.proposalRef.proposalStableSha256 &&
    digest(nativeProposal)===independent.nativeProposalStableSha256 && digest(nativeProposal)===approval.nativeProposalStableSha256,
    'original technical proposal must remain unchanged');

  const original=snapshot(ctx,proposal.sourceRefs.reviewedBefore),committed=snapshot(ctx,proposal.sourceRefs.nativeCommitted);
  need(original.blobSha1===native.review.sourceBeforeBlob && committed.blobSha1===native.committedBlob &&
    original.question.standardCourse==='중3 수학' && original.question.standardUnitKey==='M3-05' &&
    original.question.standardSubUnitKey==='M3-05-TRIG_RATIO' &&
    proposal.sourceRefs.nativeCommitted.commit===nativeRef.commit &&
    equal(committed.question,native.committedBank[10]),'original explicit target or native committed source differs');
  need(equal(application.sourceBeforeRef,proposal.sourceRefs.current) &&
    equal(application.sourceBeforeRef,approval.sourceBeforeRef) && equal(application.sourceBeforeRef,independent.sourceBeforeRef),
    'current source baseline must be the independently inspected snapshot');
  const before=snapshot(ctx,application.sourceBeforeRef);
  keys(application.currentSourceRef,['path','blobSha1','sha256','questionStableSha256'],'current source snapshot');
  const current=snapshot(ctx,application.currentSourceRef,true),payloadSha=digest(ctx.studentPayload(question));
  need(current.blobSha1===request.expectedSourceBlobSha1 && digest(current.question)===application.currentSourceRef.questionStableSha256 &&
    equal(current.question,question) && equal(ctx.studentPayload(before.question),ctx.studentPayload(question)) &&
    application.currentSourceRef.sha256===independent.sourceCandidateRef?.sha256 &&
    current.blobSha1===independent.sourceCandidateRef.gitBlobSha1 && application.currentSourceRef.sha256===approval.sourceCandidateRef?.sha256 &&
    current.blobSha1===approval.sourceCandidateRef.gitBlobSha1 && application.protectedStudentPayloadSha256===payloadSha &&
    independent.selectedCurrentStudentPayloadSha256===payloadSha &&
    independent.selectedCandidateStudentPayloadSha256===payloadSha,'current selected source or official payload digest differs');
  need(before.bank.every((q,i) => equal(ctx.studentPayload(q),ctx.studentPayload(current.bank[i])) &&
    (i===10 || equal(q,current.bank[i]))),'initial current application changed another question or student payload');
  const liveBank=ctx.bankFromBytes(fs.readFileSync(safe(ctx.root,sourcePath)));
  need(liveBank.length===25 && equal(liveBank[10],question),'live selected question or denominator differs');
  const expected={...before.question,...SOURCE_DELTA};
  need(equal(current.question,expected) && before.question.curriculum==='2015' && current.question.curriculum==='2015' &&
    equal(application.sourceMetadataDelta,SOURCE_DELTA) && equal(approval.approvedSourceFieldValues,SOURCE_DELTA) &&
    equal(proposal.sourceCandidate.sourceMetadataDelta,SOURCE_DELTA) && equal(independent.approvedSourceFieldValues,SOURCE_DELTA) &&
    equal(independent.approvedSourceFieldNames,Object.keys(SOURCE_DELTA).sort()) &&
    equal(approval.approvedSourceFieldNames,Object.keys(SOURCE_DELTA).sort()),'only the nine approved source metadata fields may change');
  for(const key of DIFFICULTY) need(equal(question[key],before.question[key]) && equal(question[key],row.after[key]) &&
    equal(final[key],row.after[key]),'accepted native difficulty must remain exact: '+key);
  need(question.metaStatus==='PROJECTION_PENDING' && equal(question.metaDebtFields,['rpmPrimaryKey']) && question.rpmPrimaryKey===null,
    'source projection/leaf debt must remain intact');
  need(equal(patch.sourceReview.rendererProof,proposal.rendererProofReuse.sourceReviewInput) &&
    independent.existingRendererProofRef?.commit===patch.sourceReview.rendererProof.reviewCommit &&
    independent.existingRendererProofRef.path===patch.sourceReview.rendererProof.reviewRef.path &&
    independent.existingRendererProofRef.sha256===patch.sourceReview.rendererProof.reviewRef.sha256,
    'current application must reuse the exact existing renderer proof');

  const definitions=proposal.existingDefinitions,pt=canonicalBefore?.pt?.get(PT),tpl=canonicalBefore?.tpl?.get(TPL);
  need(pt?.status==='ACTIVE' && tpl?.status==='ACTIVE' && pt.ownerPack==='MIDDLE_GEOMETRY' &&
    tpl.ownerPack==='MIDDLE_GEOMETRY' && tpl.parentProblemTypeKey===PT && equal(pt,canonicalAfter?.pt?.get(PT)) &&
    equal(tpl,canonicalAfter?.tpl?.get(TPL)) && equal(pt,definitions.problemType) && equal(tpl,definitions.template) &&
    [definitions.problemTypeStableSha256,application.problemTypeStableSha256,independent.problemTypeStableSha256,
      approval.problemTypeStableSha256].every(h => h===digest(pt)) &&
    [definitions.templateStableSha256,application.templateStableSha256,independent.templateStableSha256,
      approval.templateStableSha256].every(h => h===digest(tpl)),
    'existing primary definitions must remain exactly ACTIVE and unchanged');
  need(definitions.taxonomyRef?.path===CANON+'taxonomy.json','exact canonical definition owner required');
  const taxonomy=parse(immutable(ctx,definitions.taxonomyRef).bytes);
  need(taxonomy.problemTypes?.filter(r => equal(r,pt)).length===1 && taxonomy.templates?.filter(r => equal(r,tpl)).length===1,
    'immutable existing definition records differ');
  const pack=canonicalAfter?.packs?.get('MIDDLE_GEOMETRY')?.meta;
  need(definitions.ownerPackRef.path===CANON+'pack.json','exact owner pack ref required');
  const priorPack=parse(immutable(ctx,definitions.ownerPackRef).bytes);
  for(const p of [pack,priorPack]) need(p?.packId==='MIDDLE_GEOMETRY' && p.canonicalStatus==='ACTIVE' &&
    p.curricula?.includes('2015') && p.standardCourses?.includes('중3 수학') && p.standardCourses.includes('M3-2') &&
    p.ownedStandardUnitDomains?.includes('M3-05'),'existing ACTIVE owner does not support the exact target');

  const target=proposal.currentTarget;
  need(equal(Object.fromEntries(Object.keys(TARGET).map(k => [k,target[k]])),TARGET) &&
    target.tagMasterRef.path===TAG_MASTER && target.parentRef.path===MASTER,'fixed operational target mismatch');
  const tagSnapshot=parse(immutable(ctx,target.tagMasterRef).bytes),tagNow=currentJson(ctx,TAG_MASTER);
  const tagRows=doc => Array.isArray(doc) ? doc : doc.records;
  for(const doc of [tagSnapshot,tagNow]) for(const [record,key] of [[target.unitRecord,'M3-05'],[target.subunitRecord,'M3-05-TRIG_RATIO']]) {
    const found=tagRows(doc)?.filter(r => r.key===key) || [];
    need(found.length===1 && found[0].status==='active' && equal(found[0],record),'selected current standard unit/subunit changed');
  }
  need(target.unitRecord.keyType==='standardUnitKey' && target.unitRecord.labelKo==='삼각비' &&
    target.subunitRecord.keyType==='subUnitKey' && target.subunitRecord.parentKey==='M3-05' && target.subunitRecord.labelKo==='삼각비',
    'original explicit subunit alias resolves to a different target');
  for(const doc of [parse(immutable(ctx,target.parentRef).bytes),currentJson(ctx,MASTER)]) {
    const parents=doc.records?.filter(r => r.curriculum==='2015' && r.scope==='M3-2' && r.majorUnit==='삼각비' && r.midUnit==='삼각비') || [];
    need(doc.schemaVersion==='js-archive-taxonomy-rpm-primary-v1.0' && doc.authorityStatus==='LOCKED' && parents.length===1 &&
      parents[0].defaultSelectable!==false && equal(parents[0],target.parentRecord) && digest(parents[0])===target.parentStableSha256,
      'exact current target master parent is missing, changed or not selectable');
  }
  for(const [ref,p] of [[proposal.currentRuleAuthority.ruleRef,RULE],[proposal.currentRuleAuthority.solutionRuleRef,SOLUTION_RULE]]) {
    need(ref.path===p,'exact current prerequisite rule required');const historical=immutable(ctx,ref);
    need(sha(fs.readFileSync(safe(ctx.root,p)))===historical.sha256,'current prerequisite operating rule changed');
  }
  const parentRef={path:MASTER,sha256:target.parentRef.sha256,curriculum:'2015',scope:'M3-2',majorUnit:'삼각비',midUnit:'삼각비'};
  need(equal(patch.targetParentRef,parentRef) && patch.basicScopeParentRef===undefined && patch.semanticBinding===undefined &&
    patch.approvedMetadataRef===undefined,'plain exact current target parent only; no native parent claim');
  for(const refs of [request.approval.evidenceRefs,patch.evidenceRefs])
    need(refs.some(r => r.path===MASTER && r.sha256===parentRef.sha256),'target master must bind approval and item evidence');

  const binding={curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-05',subUnitKey:'M3-05-TRIG_RATIO',
    problemTypeKey:PT,ownerPack:'MIDDLE_GEOMETRY',subUnitLabelKo:'삼각비',L1:'삼각비',L2:'삼각비',status:'ACTIVE',
    supportingQuestionUids:[UID],supportingItemCount:1};
  const change={path:CANON+'bindings.json',collection:'bindings',match:Object.fromEntries(BINDING_KEYS.map(k => [k,binding[k]])),before:null,after:binding};
  need(request.registryChanges?.length===1,'exactly one add-only binding change required');
  keys(request.registryChanges[0],['path','collection','match','before','after','evidenceRefs'],'target registry change');
  for(const ref of [spec.applicationRef,spec.independentRef,application.rootApprovalRef])
    need(request.registryChanges[0].evidenceRefs?.some(r => equal(r,ref)),'target binding lacks its exact application evidence');
  need(equal(proposal.proposedExactBinding,binding) && equal(approval.approvedBinding,binding) && equal(independent.approvedBinding,binding) &&
    [application.bindingStableSha256,independent.approvedBindingStableSha256].every(h => h===digest(binding)) &&
    equal(Object.fromEntries(Object.keys(change).map(k => [k,request.registryChanges[0][k]])),change) &&
    equal(proposal.proposedRegistryChanges,[change]) &&
    !canonicalBefore?.bindings?.has(tuple(binding)) && equal(canonicalAfter?.bindings?.get(tuple(binding)),binding),
    'only one exact add-only current target binding is approved');
  const fields={...SOURCE_DELTA,curriculum:'2015',curriculumKey:'2015'};
  for(const [field,value] of Object.entries(fields)) {
    if(field==='standardSubUnitKey') need(equal(question[field],value),'source subunit alias differs');
    else need(equal(final[field],value) && equal(patch.after[field],value) &&
      (field==='curriculumKey' ? question.curriculum===value : equal(question[field],value)),
      'explicit current target field differs: '+field);
  }
  for(const [field,value] of Object.entries(TARGET)) need(equal(final[field],value) || ['L1','L2'].includes(field) &&
    patch.after[field]===undefined,'registered target tuple differs: '+field);
  need(final.problemTypeKey===PT && final.templateKey===TPL,'approved native primary must be preserved');
  return {fields,proof:{schemaVersion:M3_CURRENT_TARGET_APPLICATION_SCHEMA,applicationCommit:spec.applicationCommit,
    applicationRef:spec.applicationRef,independentRef:spec.independentRef,rootApprovalRef:application.rootApprovalRef,
    proposalRef:application.proposalRef,questionUid:UID,sourceOrdinal:11,expectedQuestionCount:25,
    nativeReviewRef:nativeRef,nativeItemStableSha256:digest(row),nativeAfterStableSha256:digest(row.after),
    nativeIndependentItemStableSha256:digest(independentRows[0]),nativeProposalStableSha256:digest(nativeProposal),
    sourceBeforeRef:application.sourceBeforeRef,currentSourceRef:{commit:spec.applicationCommit,...application.currentSourceRef},
    protectedStudentFields:[...STUDENT_FIELDS],studentPayloadSha256:payloadSha,
    rootReviewer:approval.approvedBy,independentReviewer:independent.reviewer,
    nativeMeaningOrigin:'IMMUTABLE_NATIVE_AND_INDEPENDENT_EXISTING_PRIMARY',targetApprovalOrigin:'CURRENT_TARGET_APPLICATION',
    fieldBindings:Object.fromEntries(Object.entries(fields).map(([k,v]) => [k,{origin:k==='curriculum' || k==='curriculumKey'
      ? 'UNCHANGED_CURRENT_SOURCE_EXPLICIT_CURRICULUM' : 'CURRENT_TARGET_APPLICATION',valueSha256:digest(v)}])),
    registeredTarget:TARGET,semanticSourceScope:'M2-2',semanticScopeRelation:'PREREQUISITE_LOWER_GRADE',
    targetParentRef:parentRef,exactActiveBindingSha256:digest(binding),problemTypeDefinitionSha256:digest(pt),templateDefinitionSha256:digest(tpl),
    nativeDebts:structuredClone(row.debts),nativeOriginalCurriculumProvenance:structuredClone(rpm.originalCurriculumProvenance),
    limitations:LIMITS,newDefinitions:0,existingDefinitionChanges:0,newBindings:1,crosswalkChanges:0,
    sourceMetadataDelta:SOURCE_DELTA,sourceQualityHoldChanged:false,unselectedUidApproval:false,newMathematicalQa:false,
    approvalBoundary:'EXISTING_NATIVE_PRIMARY_AND_CURRENT_TARGET_BINDING_ONLY',
  }};
}
