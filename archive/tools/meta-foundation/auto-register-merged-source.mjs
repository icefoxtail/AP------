import originalSourceError from '../../../tools/4slot/original-source-error-hold.cjs';
import { questionMetadataText, writeMetadataText, assertMetadataAssembledCurrent } from './question-metadata-format.mjs';
// Main-merge metadata registration. It applies declared metadata, never invents a semantic review.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadCanonicalParentRetry, canonicalParentRetryTargets, resolveCanonicalParentRetry } from './canonical-parent-retry.mjs';
import { isUnambiguousLegacySourceUidAlias } from '../intelligence/question-identity-contract.mjs';
import { REASSESSED_STUDENT_FIELDS } from './reviewed-source-reassessment.mjs';
import { nativeReviewedFigureRebind } from './native-reviewed-figure-reuse.mjs';
import { nativeReviewedRendererRebind } from './native-reviewed-renderer-reuse.mjs';
import { hasNativeReviewedSourceClaim, validateNativeReviewedSourceReuse, nativeReviewedFamilyRationaleReuse,
  nativeReviewedMetadataRationaleReuse, nativeReviewedM2ProblemRendererRebind, nativeReviewedM2E006ProblemRebind, nativeReviewedE017RhsRebind,
  nativeReviewedM2Problem21Rebind, nativeReviewedM2Family3Rebind, nativeReviewedM3Q5CompleteGivenRebind } from './native-reviewed-source-reuse.mjs';
import { hasAuditSourcePreservationClaim } from './native-audit-source-preservation.mjs';
import { nativeReviewedM2CcRendererRebind } from './reviewed-m2-cc-renderer-continuity.mjs';
import { hasNativeSourcePreservationClaim, nativePreservedSourceRebind } from './native-preserved-source-reuse.mjs';
import { replayE015IssuedSourceContinuation, assertE015IssuedSourceContinuationLeaf } from './native-e015-source-cc-continuity.mjs';
import { replayM2Problem21CurrentUiContinuation, assertM2Problem21CurrentUiLeaf } from './m2-problem21-current-ui-continuity.mjs';
import { assertIssuedRpmHistoricalLeaf, readIssuedRpmHistoricalEvidence } from './native-issued-rpm-history.mjs';
import { RPM_MASTER_PATH, lockedMasterEvidenceBytes } from './rpm-master-add-only.mjs';
import { assertIssuedSolutionRpmHistoricalLeaf, readIssuedSolutionRpmHistoricalEvidence } from './native-issued-solution-rpm-history.mjs';
import { hasApprovedRendererPreservationClaim, verifyApprovedRendererReceipt } from './native-approved-renderer-preservation.mjs';
import { isAuditPreservation,isPreservableAuditRecord,loadAuditPreservation,planPreservedAuditRecord,
  readAuditPreservationRequest,assertAuditPreservationReceipt,assertPreservedAuditRepair } from './native-audit-preservation.mjs';

import { nativeAuthorityHoldState } from './native-authority-correction.mjs';
import { explicitRegistrationMode } from './registration-mode.mjs';
import { classifyMetaBinding, loadRebinds, textFingerprint } from './text-binding-lib.mjs';

export const VERSION = 'archive-main-merge-meta-v1';
export const AUTO = '.archive-meta-register/auto';
const META = 'archive/data/question_metadata.json';
const IDENTITY = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime';
const STATE = `${AUTO}/state.json`;
const CONFIG = `${AUTO}/config.json`;
const REPLAY_VERSION = 'archive-main-merge-meta-batch-replay-v1';
const NATIVE_RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const FIELDS = ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit',
  'curriculum','curriculumKey','courseKey','problemTypeKey','templateKey','crossConceptKeys',
  'conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence',
  'difficultyBoundaryFlag','legacyLevelCompatibility','level','primaryMethod','decisiveStep',
  'rpmPrimaryId','rpmPrimaryPath','rpmL1','rpmL2','rpmL3','rpmL4','secondaryConceptKeys'];
const CORE = ['content','choices','answer','image','images','figureSvg'];
const STUDENT = [...CORE, 'solution','solutionImage','solutionFigureSvg','questionType','layoutTag','wide'];
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k,x[k]])) : x);
export const sha256 = v => crypto.createHash('sha256').update(v).digest('hex');
const hash = v => sha256(stable(v));
const equal = (a,b) => stable(a ?? null) === stable(b ?? null);
const pick = (v, keys) => Object.fromEntries(keys.map(k => [k, v?.[k] ?? null]));
const json = v => JSON.stringify(v, null, 2) + '\n';
const git = (root, ...args) => execFileSync('git', args, {cwd:root, encoding:'utf8', maxBuffer:64*1024*1024, stdio:['pipe','pipe','pipe']});
const read = (root, rel, fallback) => fs.existsSync(path.join(root,rel)) ? JSON.parse(fs.readFileSync(path.join(root,rel),'utf8')) : fallback;
const write = (root, rel, value) => { if(rel===META){writeMetadataText(root,questionMetadataText(value));return;} const f=path.join(root,rel); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,json(value)); };
export const sourceFingerprint = q => sha256(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
export const contentFingerprint = q => sha256(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
export function sourcePath(value) {
  if (typeof value !== 'string' || !value.endsWith('.js') || value.startsWith('/') || value.includes('\\') || /[\x00-\x1f]/.test(value) || value.split('/').some(s=>!s||s==='.'||s==='..')) throw Error('SOURCE_PATH_INVALID');
  return value;
}
export function loadBank(text, name='source') {
  if (Buffer.byteLength(text)>16*1024*1024) throw Error('SOURCE_TOO_LARGE');
  const ctx=vm.createContext({window:{}});
  vm.runInContext(text,ctx,{filename:name,timeout:3000});
  const bank=ctx.window.questionBank||ctx.window.questions||ctx.questionBank||ctx.questions||ctx.window.examData?.questions;
  if (!Array.isArray(bank)||!bank.length) throw Error('SOURCE_BANK_MISSING');
  return JSON.parse(JSON.stringify(bank));
}
const archived = (root,commit,file) => {
  try { return loadBank(git(root,'show',`${commit}:archive/exams/${file}`),file); }
  catch(e) { if (String(e.stderr||'').includes('does not exist in') || String(e.stderr||'').includes('exists on disk, but not in')) return []; throw e; }
};
const mapUnique = (rows, key, label) => { const m=new Map(); for(const r of rows||[]){const k=key(r);if(m.has(k))throw Error(`DUPLICATE_${label}:${k}`);m.set(k,r);}return m; };
const semantic = q => pick(q,FIELDS);
const SOLUTION_REBIND_FIXED_FIELDS=REASSESSED_STUDENT_FIELDS.filter(field=>field!=='solution');

// A later native FINAL_QA may explicitly rebind a repaired solution while the
// AutoMeta cursor still names its previous source. This is not a new review:
// require the selected receipt's exact before/after repair and its actual old
// Git source, and keep every other student field unchanged.
function nativeSolutionRebind(receipt,{root,bank},previous,question,identity,ordinal) {
  if(receipt.scope!=='PARTIAL_UIDS'||receipt.approval?.type!=='FINAL_QA'
    ||typeof previous.solution!=='string'||typeof question.solution!=='string'||previous.solution===question.solution
    ||!equal(pick(previous,SOLUTION_REBIND_FIXED_FIELDS),pick(question,SOLUTION_REBIND_FIXED_FIELDS)))return false;
  const repairs=receipt.fingerprintRepairs?.filter(r=>r.questionUid===identity.questionUid);
  if(repairs?.length!==1)return false;
  const r=repairs[0],fp=sourceFingerprint(previous),cf=contentFingerprint(previous);
  if(r.sourceOrdinal!==ordinal||r.sourceReview||!/^[a-f0-9]{40}$/.test(r.rebind?.priorSourceBlobSha1||'')
    ||r.rebind.priorContentFingerprint!==cf||r.metadataBefore?.sourceFingerprint!==fp
    ||!Object.hasOwn(r.metadataBefore,'contentFingerprint')||![null,cf].includes(r.metadataBefore.contentFingerprint)
    ||r.identityBefore?.sourceFingerprint!==fp||r.after?.sourceFingerprint!==sourceFingerprint(question)
    ||r.after?.contentFingerprint!==cf||contentFingerprint(question)!==cf)return false;
  const prior=loadBank(git(root,'cat-file','blob',r.rebind.priorSourceBlobSha1));
  return prior.length===bank.length&&equal(pick(prior[ordinal-1],REASSESSED_STUDENT_FIELDS),pick(previous,REASSESSED_STUDENT_FIELDS));
}

// A partial receipt keeps the original source denominator but owns only its selected
// UID set. Bind every selected row to the actual identity map and source ordinal;
// an array offset cannot identify a row in a noncontiguous registration.
function nativeReceiptRecords(receipt,{bank,identityByJoin,identityMap},source) {
  if(!Array.isArray(receipt.appliedRecords))return null;
  if(receipt.scope===undefined) {
    if(receipt.totalQuestions!==bank.length||receipt.appliedRecords.length!==bank.length
      ||new Set(receipt.appliedRecords.map(r=>r.questionUid)).size!==bank.length
      ||receipt.appliedRecords.some((r,i)=>r.sourceArchiveFile!==source||r.sourceOrdinal!==i+1))return null;
    return new Map(receipt.appliedRecords.map(r=>[r.questionUid,r]));
  }
  if(receipt.scope!=='PARTIAL_UIDS'||!Number.isInteger(receipt.partialUidCount)
    ||receipt.partialUidCount<1||receipt.partialUidCount>bank.length
    ||receipt.expectedQuestionCount!==bank.length||receipt.totalQuestions!==receipt.partialUidCount
    ||receipt.appliedRecords.length!==receipt.partialUidCount||!(identityByJoin instanceof Map)
    ||!Array.isArray(receipt.appliedIdentityRecords)||receipt.appliedIdentityRecords.length!==receipt.partialUidCount
    ||!Array.isArray(receipt.runtimeRecords))return null;
  const records=mapUnique(receipt.appliedRecords,r=>r.questionUid,'NATIVE_PARTIAL_UID');
  const identities=mapUnique(receipt.appliedIdentityRecords,r=>r.questionUid,'NATIVE_PARTIAL_IDENTITY');
  const runtimes=mapUnique(receipt.runtimeRecords,r=>r.questionUid,'NATIVE_PARTIAL_RUNTIME');
  if(new Set(receipt.appliedRecords.map(r=>r.sourceOrdinal)).size!==records.size
    ||[...identities.keys(),...runtimes.keys()].some(uid=>!records.has(uid)))return null;
  for(const [uid,record] of records) {
    const ordinal=record.sourceOrdinal,q=bank[ordinal-1],identity=identityByJoin.get(`${source}#${ordinal}`);
    if(!Number.isInteger(ordinal)||ordinal<1||ordinal>bank.length||record.sourceArchiveFile!==source
      ||!identity||identity.questionUid!==uid||identity.sourceArchiveFile!==source||identity.sourceOrdinal!==ordinal
      ||identity.status&&identity.status!=='VERIFIED'||!equal(identities.get(uid),identity)
      ||!equal(record.sourceQuestionNo,identity.sourceQuestionNo)
      ||record.sourceFingerprint!==sourceFingerprint(q)||record.contentFingerprint!==contentFingerprint(q)
      ||identity.sourceFingerprint!==record.sourceFingerprint)return null;
    if(q.questionUid&&q.questionUid!==uid&&!isUnambiguousLegacySourceUidAlias({question:q,
      sourceArchiveFile:source,sourceOrdinal:ordinal,identityRecord:identity,identityMap,bank}))return null;
    const runtime=runtimes.get(uid);
    // REVIEW2 may retain an explicit type hold without a runtime row. It cannot
    // supply another UID's runtime, and the reused target must have its own row.
    if(runtime&&(runtime.sourceArchiveFile!==source||runtime.sourceOrdinal!==ordinal
      ||runtime.sourceIdentity!==`${source}#${ordinal}`||runtime.sourceFingerprint!==record.sourceFingerprint
      ||runtime.contentFingerprint!==record.contentFingerprint||runtime.approvedSourceFingerprint!==record.sourceFingerprint
      ||String(runtime.sourceQuestionNo??'')!==String(q.sourceQuestionNo??q.id??'')))return null;
  }
  return records;
}

function preservedAuditReceipt({nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,ownerPack}) {
  const {root,bytes,bank,runtimeRecord}=nativeSource;
  if(!isPreservableAuditRecord(current)||current.metaFoundationPackId!==ownerPack||
    current.L3!==pt?.canonicalLabelKo||current.L4!==tpl?.canonicalLabelKo)return null;
  for(const relative of current.approvalEvidence||[]) {
    if(typeof relative!=='string'||!relative.startsWith(NATIVE_RECEIPTS)||!relative.endsWith('.json'))continue;
    try {
      const receipt=read(root,relative);
      if(!isAuditPreservation(receipt?.approval))continue;
      const request=readAuditPreservationRequest(root,receipt);
      if(relative!==NATIVE_RECEIPTS+request.requestId+'.json'||request.sourceArchiveFile!==source)continue;
      assertAuditPreservationReceipt(receipt,request,bytes,bank.length);
      const registered=nativeReceiptRecords(receipt,nativeSource,source)?.get(identity.questionUid);
      const registeredIds=receipt.appliedIdentityRecords?.filter(r=>r.questionUid===identity.questionUid);
      const registeredRuntime=receipt.runtimeRecords?.filter(r=>r.questionUid===identity.questionUid);
      if(!equal(registered,current)||registeredIds?.length!==1||!equal(registeredIds[0],identity)||
        registeredRuntime?.length!==1||!equal(registeredRuntime[0],runtimeRecord))continue;
      const context=loadAuditPreservation({root,request,bytes,bank});
      const kept=planPreservedAuditRecord(context,{current,identity,runtime:runtimeRecord,question,ordinal,
        receiptPath:relative,replay:true});
      assertPreservedAuditRepair(receipt,kept);
      if(!equal(pick(previous,REASSESSED_STUDENT_FIELDS),pick(kept.priorQuestion,REASSESSED_STUDENT_FIELDS))&&
        !equal(pick(previous,REASSESSED_STUDENT_FIELDS),pick(question,REASSESSED_STUDENT_FIELDS)))continue;
      return relative;
    } catch { /* Audit kind, explicit debt and original approval must all remain provable. */ }
  }
  return null;
}

// The reviewed lane may have just registered this exact source before AutoMeta reaches an older
// pending cursor. Reuse its byte-bound native receipt, never the approval flags alone. Returning
// ALREADY_REGISTERED also leaves the native metadata revision, runtime and RPM parent untouched.
export function nativeReviewReceipt({nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,registry,ownerPack=pt?.ownerPack}) {
  if(originalSourceError.isSubject({questionUid:current?.questionUid||identity?.questionUid,source,ordinal}))return null;
  if(!nativeSource||!previous)return null;
  if(nativeAuthorityHoldState({root:nativeSource.root,current,identity,source,ordinal}))return null;
  const studentUnchanged=equal(pick(previous,STUDENT),pick(question,STUDENT));
  const {root,bytes,blobSha1,bank,runtimeRecord,runtimeStatus}=nativeSource;
  if(!Buffer.isBuffer(bytes)||!Array.isArray(bank)||!equal(bank[ordinal-1],question)
    ||!/^[a-f0-9]{40}$/.test(blobSha1||'')||!runtimeRecord||runtimeStatus!=='ACTIVE'
    ||String(runtimeRecord.sourceQuestionNo??'')!==String(question.sourceQuestionNo??question.id??''))return null;
  if(current.metadataApprovalType==='META_PIPELINE_AUDIT')
    return preservedAuditReceipt({nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,ownerPack});
  if(!['FINAL_QA','REVIEW2'].includes(current.metadataApprovalType)||current.reviewStatus!=='reviewed_pass'
    ||!String(current.metadataStatus||'').startsWith('approved_')||current.tagStatus!=='reviewed_pass'
    ||current.sourceFingerprint!==sourceFingerprint(question)||current.contentFingerprint!==contentFingerprint(question)
    ||FIELDS.some(k=>Object.hasOwn(question,k)&&!equal(question[k],current[k]))
    ||current.metaFoundationStatus!=='ACTIVE'||current.metaFoundationPackId!==ownerPack
    ||!String(current.L1||'').trim()||!String(current.L2||'').trim()
    ||current.L3!==pt.canonicalLabelKo||current.L4!==tpl.canonicalLabelKo)return null;
  // A private exact-source view is available only for the two original E015
  // receipts after the authenticated Q10-only metadata transport. The recursive
  // call retains every ordinary Native, current ACTIVE and renderer check.
  if(Object.hasOwn(nativeSource,'e015IssuedSourceContinuation')) {
    try { assertE015IssuedSourceContinuationLeaf({context:nativeSource.e015IssuedSourceContinuation,
      nativeSource,current,identity,source,ordinal,question}); } catch { return null; }
  } else {
    try {
      const replayed=replayE015IssuedSourceContinuation({nativeSource,question,previous,current,identity,source,ordinal,
        revalidateLeaf:leaf=>nativeReviewReceipt({nativeSource,question,previous,current,identity,source,ordinal,
          pt,tpl,registry,ownerPack,...leaf})});
      if(replayed!==null)return replayed;
    } catch { return null; }
  }
  // Only a live private token can present the original issued bank. The
  // recursive leaf still runs the unmodified receipt and current ACTIVE guards.
  if(Object.hasOwn(nativeSource,'m2Problem21CurrentUiContinuation')) {
    try { assertM2Problem21CurrentUiLeaf({context:nativeSource.m2Problem21CurrentUiContinuation,
      nativeSource,current,identity,source,ordinal,question}); } catch { return null; }
  } else {
    try {
      const replayed=replayM2Problem21CurrentUiContinuation({nativeSource,question,previous,current,identity,source,ordinal,
        revalidateLeaf:leaf=>nativeReviewReceipt({nativeSource,question,previous,current,identity,source,ordinal,
          pt,tpl,registry,ownerPack,...leaf})});
      if(replayed!==null)return replayed;
    } catch { return null; }
  }
  const boundRead=relative=>{
    if(typeof relative!=='string'||path.isAbsolute(relative)||relative.includes('\\')
      ||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('NATIVE_EVIDENCE_PATH_INVALID');
    const full=fs.realpathSync(path.join(root,relative)),base=fs.realpathSync(root);
    if(!full.startsWith(base+path.sep))throw Error('NATIVE_EVIDENCE_PATH_ESCAPE');
    return fs.readFileSync(full);
  };
  // The LOCKED RPM master is add-only: a receipt may pin an older Git revision that the current master still contains.
  const boundEvidence=ref=>{
    const bytes=boundRead(ref.path);
    return ref.path===RPM_MASTER_PATH?lockedMasterEvidenceBytes({root,pinnedSha256:ref.sha256,currentBytes:bytes}):bytes;
  };
  for(const receiptPath of Array.isArray(current.approvalEvidence)?current.approvalEvidence:[]) {
    if(typeof receiptPath!=='string'||!receiptPath.startsWith(NATIVE_RECEIPTS))continue;
    const requestId=receiptPath.slice(NATIVE_RECEIPTS.length).replace(/\.json$/,'');
    if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId)||receiptPath!==NATIVE_RECEIPTS+requestId+'.json')continue;
    try {
      const receipt=JSON.parse(boundRead(receiptPath)),approval=receipt.approval;
      if(receipt.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'
        ||receipt.metadataRegistrationStatus!=='REGISTERED'||receipt.requestId!==requestId
        ||!/^[a-f0-9]{64}$/.test(receipt.requestSha256||'')||receipt.sourceArchiveFile!==source
        ||receipt.sourceRawSha256!==sha256(bytes)||receipt.sourceBlobSha1!==blobSha1
        ||approval?.type!==current.metadataApprovalType||approval.metadataReviewed!==true
        ||!String(approval.approvedBy||'').trim()||approval.type==='REVIEW2'&&approval.reviewPassCount!==2
        ||!Array.isArray(approval.evidenceRefs)||!approval.evidenceRefs.length)continue;
      const rpmHistory=nativeSource.issuedRpmHistoryContext;
      const solutionRpmHistory=nativeSource.issuedSolutionRpmHistoryContext;
      if(rpmHistory&&solutionRpmHistory)continue;
      if(rpmHistory)assertIssuedRpmHistoricalLeaf({context:rpmHistory,receipt,nativeSource,current,identity,ordinal});
      if(solutionRpmHistory)assertIssuedSolutionRpmHistoricalLeaf({context:solutionRpmHistory,receipt,nativeSource,current,identity,ordinal,previous});
      if(!approval.evidenceRefs.every(ref=>/^[a-f0-9]{64}$/.test(ref.sha256||'')&&sha256(solutionRpmHistory
        ?readIssuedSolutionRpmHistoricalEvidence(solutionRpmHistory,receipt,ref):rpmHistory
          ?readIssuedRpmHistoricalEvidence(rpmHistory,receipt,ref):boundEvidence(ref))===ref.sha256))continue;
      const record=nativeReceiptRecords(receipt,nativeSource,source)?.get(identity.questionUid);
      const runtime=receipt.runtimeRecords?.filter(r=>r.questionUid===identity.questionUid);
      const registeredIdentity=receipt.appliedIdentityRecords?.filter(r=>r.questionUid===identity.questionUid);
      if(!record||record.sourceOrdinal!==ordinal||!equal(record,current)
        ||runtime?.length!==1||!equal(runtime[0],runtimeRecord)
        ||registeredIdentity?.length!==1||registeredIdentity[0].sourceArchiveFile!==source
        ||registeredIdentity[0].sourceOrdinal!==ordinal||registeredIdentity[0].sourceFingerprint!==identity.sourceFingerprint
        ||!equal(registeredIdentity[0].sourceQuestionNo,identity.sourceQuestionNo)
        ||current.metadataRevision!==`meta-foundation:${ownerPack}@${current.metaFoundationPackVersion}:exam-${approval.type.toLowerCase()}-v2:${requestId}`)continue;
      if(Object.hasOwn(approval,'rendererPreservation')||Object.hasOwn(receipt,'approvedRendererPreservation')||
        hasApprovedRendererPreservationClaim({root,current,runtimeRecord})) {
        const kept=verifyApprovedRendererReceipt({receipt,nativeSource,current,identity,ordinal,previous,registry,
          revalidateLeaf:ancestor=>{
            const context=activeBindingContext({candidate:ancestor.current,check:{curriculum:ancestor.current.curriculum||ancestor.current.curriculumKey},
              registry,runtimeOwner:ancestor.current.metaFoundationPackId});
            return context.reason?null:nativeReviewReceipt({...ancestor,registry,...context});
          }});
        if(kept!==true)continue;
        return receiptPath;
      }
      const verifiedSource=validateNativeReviewedSourceReuse(receipt,nativeSource,question,identity,ordinal,current,registry);
      const preservedSource=nativePreservedSourceRebind({receipt,nativeSource,question,identity,ordinal,current,registry,
        revalidateLeaf:ancestor=>nativeReviewReceipt({nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,registry,ownerPack,...ancestor})});
      if(preservedSource===true)return receiptPath;
      const reviewedFigure=nativeReviewedFigureRebind(receipt,nativeSource,previous,question,identity,ordinal,current);
      const reviewedRenderer=nativeReviewedRendererRebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      const reviewedM2Renderer=nativeReviewedM2ProblemRendererRebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      const reviewedM2E006=nativeReviewedM2E006ProblemRebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      const reviewedM2CcRenderer=nativeReviewedM2CcRendererRebind({receipt,previous,question,identity,ordinal,verifiedSource});
      const reviewedE017Rhs=nativeReviewedE017RhsRebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      const reviewedM2Problem21=nativeReviewedM2Problem21Rebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      const reviewedM2Family3=nativeReviewedM2Family3Rebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      const reviewedM3Q5=nativeReviewedM3Q5CompleteGivenRebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      if(reviewedFigure!==true&&reviewedRenderer!==true&&reviewedM2Renderer!==true&&reviewedM2E006!==true&&reviewedM2CcRenderer!==true&&reviewedE017Rhs!==true&&reviewedM2Problem21!==true&&reviewedM2Family3!==true&&reviewedM3Q5!==true&&!studentUnchanged&&!nativeSolutionRebind(receipt,nativeSource,previous,question,identity,ordinal))continue;
      return receiptPath;
    } catch { /* Missing, malformed or drifted evidence never grants the native reuse path. */ }
  }
  return null;
}

export function activeBindingContext({candidate,check,registry,runtimeOwner}) {
  const pt=registry.problemTypes.get(candidate.problemTypeKey),tpl=registry.templates.get(candidate.templateKey);
  const bindings=registry.bindingRows.filter(b=>b.status==='ACTIVE'&&b.curriculum===check.curriculum&&b.standardUnitKey===candidate.standardUnitKey&&(b.subUnitKey??null)===(candidate.subUnitKey??null)&&b.problemTypeKey===candidate.problemTypeKey&&String(b.standardCourse||'').replaceAll(' ','')===String(candidate.standardCourse||'').replaceAll(' ',''));
  if(bindings.length!==1)return {reason:'EXACT_COURSE_BINDING_MISSING_OR_AMBIGUOUS'};
  const binding=bindings[0],definitionPack=registry.activePacks.get(pt?.ownerPack);
  if(!definitionPack||pt?.status!=='ACTIVE'||tpl?.status!=='ACTIVE'||tpl.ownerPack!==pt.ownerPack
    ||tpl.parentProblemTypeKey!==candidate.problemTypeKey||definitionPack.status&&definitionPack.status!=='ACTIVE')return {reason:'ACTIVE_OWNER_PACK_MISMATCH'};
  // An exact ACTIVE binding may reuse another pack's PT/TPL definitions.
  // Its owner controls runtime placement and course scope, as in official v2 resolve().
  const ownerPack=binding.ownerPack||pt.ownerPack,pack=registry.activePacks.get(ownerPack);
  if(!/^[A-Z][A-Z0-9_]*$/.test(ownerPack)||!pack||pack.status&&pack.status!=='ACTIVE')return {reason:'ACTIVE_OWNER_PACK_MISMATCH'};
  if(runtimeOwner&&runtimeOwner!==ownerPack)return {reason:'EXISTING_RUNTIME_OWNER_CONFLICT'};
  let scope;
  try {scope=registry.root?read(registry.root,`archive/data/meta-foundation/canonical/packs/${ownerPack.toLowerCase().replaceAll('_','-')}/pack.json`,null):pack;}
  catch {return {reason:'BINDING_OWNER_PACK_SCOPE_MISMATCH'};}
  const course=candidate.standardCourse||candidate.courseKey,courseKey=candidate.courseKey||course;
  if(!scope||(scope.packId||scope.id)!==ownerPack||(scope.packVersion||scope.version)!==pack.version
    ||scope.canonicalStatus&&scope.canonicalStatus!=='ACTIVE'||!scope.curricula?.includes(check.curriculum)
    ||!scope.standardCourses?.includes(course)||!scope.standardCourses?.includes(courseKey))return {reason:'BINDING_OWNER_PACK_SCOPE_MISMATCH'};
  return {pt,tpl,binding,pack,ownerPack};
}

// The official ACTIVE validator is supplied by loadContext; fixtures use the same public interface.
export function planQuestion({question:q, previous, current, identity, registry, validate, source, ordinal, runtimeOwner, priorReceipt, nativeSource, canonicalParentRetry, textRebinds}) {
  const reject = (...reasons) => ({status:'SUPPLEMENT_PENDING',reasons,questionUid:identity?.questionUid||current?.questionUid||null,sourceArchiveFile:source,sourceOrdinal:ordinal});
  if (!identity || !current || identity.questionUid!==current.questionUid || identity.sourceArchiveFile!==source || current.sourceArchiveFile!==source || Number(identity.sourceOrdinal)!==ordinal || Number(current.sourceOrdinal)!==ordinal) return reject('UID_JOIN_MISMATCH');
  if(originalSourceError.isSubject({questionUid:identity.questionUid,source,ordinal}))return reject(originalSourceError.REASON);
  const authorityHold=nativeAuthorityHoldState({root:nativeSource?.root,current,identity,source,ordinal});
  if(authorityHold)return reject(authorityHold.reason);
  if(canonicalParentRetry&&['FINAL_QA','REVIEW2','META_PIPELINE_AUDIT'].includes(current.metadataApprovalType))return reject('CANONICAL_PARENT_RETRY:NATIVE_AUTHORITY_NOT_SUPPORTED');
  if (q.questionUid && q.questionUid!==identity.questionUid && !isUnambiguousLegacySourceUidAlias({question:q,
    sourceArchiveFile:source,sourceOrdinal:ordinal,identityRecord:identity,
    identityMap:nativeSource?.identityMap,bank:nativeSource?.bank})) return reject('SOURCE_UID_CONFLICT');
  if (identity.status && identity.status!=='VERIFIED') return reject('UID_NOT_VERIFIED');
  const questionNo=String(q.sourceQuestionNo??q.id??'');
  if(previous&&String(previous.sourceQuestionNo??previous.id??'')!==questionNo)return reject('SOURCE_ORDINAL_CHANGED');
  const fp=sourceFingerprint(q), cf=contentFingerprint(q);
  // 결속은 발문+보기(text-v1)만 본다(docs/agents/metadata.md "메타 결속 지문 범위"). 전체 지문(해설·정답·그림 포함)이 어긋나도
  // 이 행이 지금과 같은 발문·보기에 묶여 있음이 확인되면(행의 내용 지문 일치 또는 동결된 재결속 기록, 카탈로그와 같은 판정)
  // 통과한다. 확인되지 않거나 유형 판정만 묶인 행은 기존 사유로 그대로 거절한다. 이유: identity의 전체 지문은 감사용이라
  // 해설 한 줄만 고쳐도 자동 등록이 영구히 막혔다. 지문이 전부 일치하는 행은 이전과 똑같이 통과한다.
  let textBound;
  const rowTextBound=()=>textBound??=classifyMetaBinding({meta:current,question:q,assignmentFingerprint:cf,rebinds:textRebinds})==='row';
  if(identity.sourceFingerprint!==fp && !rowTextBound()) return reject('IDENTITY_SOURCE_FINGERPRINT_MISMATCH');
  if(current.sourceFingerprint!==fp && (!previous||current.sourceFingerprint!==sourceFingerprint(previous)) && !rowTextBound()) return reject('METADATA_SOURCE_FINGERPRINT_CONFLICT');
  // 이미 한 판정을 되돌리는 변화는 발문·보기(text-v1)가 바뀐 것뿐이다(docs/agents/metadata.md "메타 결속 지문 범위"). 정답·그림·해설만 바뀐 문항은 판정과 승인 이력을 그대로 둔다.
  // 발문·보기가 바뀌었어도 행이 지금의 발문·보기에 묶여 있음이 확인되면(재결속 기록: 같은 수학 내용의 정식 수정) 역시 그대로 둔다.
  // 이유: 정식 수정으로 행 전체가 registered_merged_source/review_required로 내려가면 단원·교육과정 표시가 카탈로그에서 사라졌다(수정한 문항이 필터에서 빠짐).
  // text-v1 지문을 못 만드는 문항(발문이 비었거나 choices 형식 오류)은 예전 비교(CORE 필드 전부)를 그대로 쓴다.
  const textFpBefore=previous?textFingerprint(previous):null,textFpNow=textFingerprint(q);
  const coreChanged=Boolean(previous&&(textFpBefore&&textFpNow
    ?textFpBefore!==textFpNow&&!rowTextBound()
    :!equal(pick(previous,CORE),pick(q,CORE))));
  const sourceMetaChanged=Boolean(!previous||!equal(semantic(previous),semantic(q)));
  if(current.metadataStatus==='SOURCE_HOLD')return reject('EXPLICIT_SOURCE_HOLD');
  const studentChanged=Boolean(previous&&!equal(pick(previous,STUDENT),pick(q,STUDENT)));
  if(nativeSource&&isPreservableAuditRecord(current)) {
    // Existing audit evidence can explicitly leave an optional field unassessed.
    // The native preservation proof below must retain that exact null and debt;
    // omitting it only from the ACTIVE-key checker does not fill or approve it.
    const supplied={...current,sourceArchiveFile:source};
    if(supplied.integrationPattern===null&&supplied.fieldStatus?.integrationPattern==='EVIDENCE_DEBT'&&
      supplied.integrationPatternEvidenceDebt?.status==='EVIDENCE_DEBT')delete supplied.integrationPattern;
    const check=validate(supplied,registry,{requireFields:false});
    if(check.status==='VALIDATED'&&check.activeBinding) {
      const context=activeBindingContext({candidate:current,check,registry,runtimeOwner});
      if(!context.reason) {
        const receipt=nativeReviewReceipt({nativeSource,question:q,previous,current,identity,source,ordinal,registry,
          pt:context.pt,tpl:context.tpl,ownerPack:context.ownerPack});
        if(receipt)return {status:'ALREADY_REGISTERED',questionUid:identity.questionUid,sourceArchiveFile:source,
          sourceOrdinal:ordinal,inputHash:hash({source,ordinal,student:pick(q,STUDENT),metadata:semantic(q),registry:registry.registrySha}),
          nativeReviewReceipt:receipt,newMetadataApprovals:0,preservedMetadataApprovals:1};
      }
    }
  }
  const candidate={...current};
  // Absent source fields do not erase reviewed sidecars. Explicit changes are authoritative only for this UID.
  for(const k of FIELDS) if(Object.hasOwn(q,k)) {
    const changed=!previous||!equal(previous[k],q[k]);
    const approved=current.reviewStatus==='reviewed_pass'||String(current.metadataStatus||'').startsWith('approved_');
    if(changed&&approved&&candidate[k]!=null&&candidate[k]!==''&&!equal(candidate[k],previous?.[k])&&!equal(candidate[k],q[k]))return reject('FIELD_AUTHORITY_CONFLICT:'+k);
    if(changed || candidate[k]==null || candidate[k]==='') candidate[k]=structuredClone(q[k]);
  }
  if(!candidate.problemTypeKey||!candidate.templateKey) return reject('DECLARED_PT_TPL_MISSING');
  const parentRetryInput=canonicalParentRetry?{requestSha256:canonicalParentRetry.requestSha256,masterSha256:canonicalParentRetry.request.masterRef.sha256}:null;
  const inputHash=hash({source,ordinal,student:pick(q,STUDENT),metadata:semantic(q),registry:registry.registrySha,...(parentRetryInput?{canonicalParentRetry:parentRetryInput}:{})});
  const hasSourceRationale=!sourceMetaChanged||Boolean(String(q.primaryMethod||'').trim()&&String(q.decisiveStep||'').trim());
  // Reusing an existing byte-bound native approval does not produce new metadata.
  // Validate every supplied field, ACTIVE key/binding/owner and source rationale,
  // then let the byte-bound native receipt verifier prove full state equality.
  // Missing optional producer fields are never filled or treated as completed.
  const nativeEligible=nativeSource&&['FINAL_QA','REVIEW2'].includes(current.metadataApprovalType)
    &&Array.isArray(current.approvalEvidence)&&current.approvalEvidence.some(p=>typeof p==='string'&&p.startsWith(NATIVE_RECEIPTS));
  if(nativeEligible) {
    // Native metadata/identity retain the global question number. The source and
    // runtime may carry a restarted display number; the receipt binds both lanes.
    if(identity.sourceQuestionNo==null||current.sourceQuestionNo==null
      ||String(identity.sourceQuestionNo)!==String(current.sourceQuestionNo))return reject('SOURCE_ORDINAL_CHANGED');
    const supplied=validate({...candidate,sourceArchiveFile:source},registry,{requireFields:false});
    if(supplied.status==='VALIDATED'&&supplied.activeBinding) {
      const context=activeBindingContext({candidate,check:supplied,registry,runtimeOwner});
      if(!context.reason) {
        const nativeReceipt=nativeReviewReceipt({nativeSource,question:q,previous,current,identity,source,ordinal,registry,pt:context.pt,tpl:context.tpl,ownerPack:context.ownerPack});
        if(nativeReceipt&&(hasSourceRationale||nativeReviewedFamilyRationaleReuse(nativeReceipt,nativeSource,previous,q,identity,ordinal,current,registry)||
          nativeReviewedMetadataRationaleReuse(nativeReceipt,nativeSource,previous,q,identity,ordinal,current,registry)))return {status:'ALREADY_REGISTERED',questionUid:identity.questionUid,sourceArchiveFile:source,
          sourceOrdinal:ordinal,inputHash,nativeReviewReceipt:nativeReceipt};
      }
    }
  }
  if(nativeSource&&hasApprovedRendererPreservationClaim({root:nativeSource.root,current,runtimeRecord:nativeSource.runtimeRecord}))
    return reject('NATIVE_APPROVED_RENDERER_PRESERVATION_REVALIDATION_FAILED');
  if(nativeSource&&hasNativeReviewedSourceClaim({root:nativeSource.root,current,runtimeRecord:nativeSource.runtimeRecord}))
    return reject('NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED');
  if(nativeSource&&hasAuditSourcePreservationClaim({root:nativeSource.root,current,runtimeRecord:nativeSource.runtimeRecord}))
    return reject('NATIVE_AUDIT_SOURCE_PRESERVATION_REVALIDATION_FAILED');
  if(nativeSource&&hasNativeSourcePreservationClaim({root:nativeSource.root,current,runtimeRecord:nativeSource.runtimeRecord,nativeSource}))
    return reject('NATIVE_SOURCE_PRESERVATION_REVALIDATION_FAILED');
  // All new registrations and missing/stale/incompatible native evidence retain
  // the original strict producer validation, including difficulty completeness.
  if (identity.sourceQuestionNo!=null && String(identity.sourceQuestionNo)!==questionNo) return reject('SOURCE_ORDINAL_CHANGED');
  const check=validate({...candidate,sourceArchiveFile:source},registry,{requireFields:true});
  if(check.status!=='VALIDATED'||!check.activeBinding||!check.difficultyComplete) return reject(...check.errors, ...(!check.difficultyComplete?['DIFFICULTY_INCOMPLETE']:[]), ...(!check.activeBinding?['ACTIVE_BINDING_MISSING']:[]));
  const context=activeBindingContext({candidate,check,registry,runtimeOwner});
  if(context.reason)return reject(context.reason);
  const {pt,tpl,binding,pack,ownerPack}=context;
  // Existing declarations are evidence of what was merged, not proof of independent mathematical QA.
  if(!hasSourceRationale) return reject('SOURCE_SEMANTIC_RATIONALE_MISSING');
  let parentLabels={L1:binding.L1,L2:binding.L2},parentRetry=null;
  if(canonicalParentRetry) {
    try {parentRetry=resolveCanonicalParentRetry({state:canonicalParentRetry,source,ordinal,question:q,previous,current,identity,registry,binding,candidate,nativeSource,priorReceipt,studentChanged,validatedCurriculum:check.curriculum});}
    catch(error){return reject(String(error.message));}
    parentLabels=parentRetry;
  }
  if(!parentLabels.L1||!parentLabels.L2||!pt.canonicalLabelKo||!tpl.canonicalLabelKo) return reject('CANONICAL_LABELS_MISSING');
  // A newly available registry binding does not resolve a reviewed row's
  // explicit type hold. Keep its approved basic fields and provenance intact;
  // only an explicit reviewed registration may replace these held values.
  // Native receipt reuse above retains priority and does not create approval.
  if(current.metadataStatus==='approved_partial_with_explicit_holds'
    &&['problemType','template'].some(k=>current.fieldStatus?.[k]==='manual_review_pending'))
    return reject('EXPLICIT_PARTIAL_REVIEW_HOLD');
  // identity의 전체 지문이 낡은 행은 행의 전체 지문도 그대로 둔다(내용 지문 cf만 현재로). 이 등록기는 identity를 고치지 않으므로
  // 행만 현재 지문으로 바꾸면 행≠identity 어긋남이 새로 생겨 다른 등록 길(FINAL_QA·난이도)이 "divergence"로 거절한다.
  const final={...candidate,sourceFingerprint:identity.sourceFingerprint===fp?fp:(current.sourceFingerprint??fp),contentFingerprint:cf,curriculum:check.curriculum,curriculumKey:check.curriculum,
    courseKey:check.curriculum===current.curriculumKey&&current.courseKey?current.courseKey:candidate.standardCourse,
    L1:parentLabels.L1,L2:parentLabels.L2,L3:pt.canonicalLabelKo,L4:tpl.canonicalLabelKo,
    foundationTaxonomyStatus:'CONFIRMED',projectionStatus:'REUSE',metaFoundationStatus:'ACTIVE',
    metaFoundationPackId:ownerPack,metaFoundationPackVersion:pack.version,
    metadataRegistrationStatus:'REGISTERED',metadataRegistrationBasis:'MAIN_MERGED_EXPLICIT_METADATA',
    independentMathReviewStatus:studentChanged?'NOT_PERFORMED_BY_AUTO_REGISTRAR':current.independentMathReviewStatus||'NOT_PERFORMED_BY_AUTO_REGISTRAR',
    l3Disposition:'ASSIGNED',l4Disposition:'ASSIGNED',curriculumApplicability:current.curriculumApplicability||'DEFAULT_SCOPE',
    defaultSelectable:current.defaultSelectable!==false};
  // Do not manufacture FINAL_QA/REVIEW2. Unchanged reviewed metadata retains its original authority.
  const preserveReview=!coreChanged&&!sourceMetaChanged;
  if(!preserveReview) {
    final.metadataStatus='registered_merged_source';
    final.reviewStatus='review_required';
    final.tagStatus='review_required';
    final.metadataApprovalType='MAIN_MERGE';
    final.fieldStatus={...current.fieldStatus};
    const groups={standardUnit:['standardCourse','standardUnitKey','standardUnit'],subUnit:['subUnitKey','subUnit'],concept:['L1','L2','L3','L4'],problemType:['problemTypeKey'],template:['templateKey'],crossConcept:['crossConceptKeys'],condition:['conditionKeys'],integrationPattern:['integrationPattern'],difficulty:['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility']};
    for(const [field,keys] of Object.entries(groups))if(keys.some(k=>!equal(current[k],final[k])))final.fieldStatus[field]='registered_main_merge';
  }
  // A rerun after a build can canonicalize summary fields; compare actual registered values, not wall-clock data.
  const effectiveFields=[...FIELDS.filter(k=>Object.hasOwn(final,k)), 'sourceFingerprint','contentFingerprint','L1','L2','L3','L4'];
  if(priorReceipt?.inputHash===inputHash&&priorReceipt.metadataRegistrationStatus==='REGISTERED'&&effectiveFields.every(k=>equal(current[k],final[k]))) return {status:'ALREADY_REGISTERED',questionUid:identity.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,inputHash,...(parentRetry?{canonicalParentRetry:parentRetry.proof}:{})};
  return {status:'APPLY',questionUid:identity.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,inputHash,ownerPack,final,
    changedFields:effectiveFields.filter(k=>!equal(current[k],final[k])),preserveReview,coreChanged,sourceMetaChanged,
    studentPayloadHash:hash(pick(q,STUDENT)),sourceQuestionNo:questionNo,...(parentRetry?{canonicalParentRetry:parentRetry.proof}:{})};
}

async function context(root) {
  const {loadActiveMetaRegistry,validateActiveMetaFields}=await import('./active-registry.mjs');
  const {refreshRuntime}=await import('./reviewed-runtime-summary.mjs');
  const registry=loadActiveMetaRegistry(root);
  if(registry.status!=='ACTIVE') throw Error('ACTIVE_REGISTRY_UNAVAILABLE:'+registry.errors.join('|'));
  const metadata=read(root,META),identity=read(root,IDENTITY);
  if(!metadata?.records||!identity?.records)throw Error('IDENTITY_OR_METADATA_MISSING');
  const metaByUid=mapUnique(metadata.records,r=>r.questionUid,'METADATA_UID');
  mapUnique(metadata.records,r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`,'METADATA_SOURCE');
  const identityByJoin=mapUnique(identity.records,r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`,'IDENTITY_SOURCE');
  mapUnique(identity.records,r=>r.questionUid,'IDENTITY_UID');
  const runtimes=new Map(),owners=new Map();
  for(const name of fs.readdirSync(path.join(root,RUNTIME)).filter(n=>n.endsWith('.json')&&n!=='runtime-bridge-receipt.json')) {
    const rel=`${RUNTIME}/${name}`,data=read(root,rel);
    if(!Array.isArray(data.records)||!data.packId)continue;
    if(runtimes.has(data.packId))throw Error('DUPLICATE_RUNTIME_PACK');
    runtimes.set(data.packId,{rel,data});
    for(const r of data.records){if(owners.has(r.questionUid))throw Error('DUPLICATE_RUNTIME_UID');owners.set(r.questionUid,data.packId);}
  }
  return {registry,validate:validateActiveMetaFields,refreshRuntime,metadata,metaByUid,identityMap:identity,identityByJoin,runtimes,owners};
}

// Read-only run instrumentation. It is written only into the (uncommitted) run report outside `replayBatch`,
// so no committed output, cursor, replay digest or planner decision depends on it.
export const INSTRUMENTATION_VERSION = 'archive-main-merge-meta-instrumentation-v1';
const TOP_N = 20;
const byName = (a,b) => a<b?-1:a>b?1:0;
export function topCounts(counts, limit=TOP_N) {
  const rows=[...counts.entries()].sort((a,b)=>b[1]-a[1]||byName(a[0],b[0]));
  const rest=rows.slice(limit);
  return {top:rows.slice(0,limit).map(([name,count])=>({name,count})),otherNames:rest.length,otherCount:rest.reduce((n,[,c])=>n+c,0)};
}
function topFileRows(files, limit=TOP_N) {
  const rows=[...files.entries()].sort((a,b)=>b[1].total-a[1].total||byName(a[0],b[0])),rest=rows.slice(limit);
  return {top:rows.slice(0,limit).map(([name,v])=>({name,...v})),otherFiles:rest.length,otherCount:rest.reduce((n,[,v])=>n+v.total,0)};
}
// Oldest pending baseCommit by committer date; null when Git cannot resolve it (never fatal for a report).
function oldestBase(root, counts) {
  const shas=[...counts.keys()].filter(c=>/^[a-f0-9]{40}$/.test(c));
  if(!shas.length)return null;
  try {
    const rows=execFileSync('git',['log','--no-walk=sorted','--stdin','--format=%H %cI'],{cwd:root,input:shas.join('\n')+'\n',encoding:'utf8',
      maxBuffer:16*1024*1024,stdio:['pipe','pipe','pipe']}).trim().split('\n').filter(Boolean);
    const [commit,committedAt]=rows[rows.length-1].split(' ');
    return {commit,committedAt,count:counts.get(commit)};
  } catch { return null; }
}
export function summarizeBacklog(root, pending) {
  const entries=Object.values(pending||{}),bases=new Map(),atoms=new Map(),kinds=new Map();
  const out={pendingTotal:entries.length,withoutAttemptSignature:0,attemptedRefused:0,neverTried:0,entriesWithMultipleReasons:0,
    reasonAtomTotal:0,reasonsNote:'one pending entry may carry several reasons, so reason counts sum to at least attemptedRefused'};
  for(const e of entries) {
    if(!e||typeof e!=='object'){out.malformedEntries=(out.malformedEntries||0)+1;continue;}
    if(!e.attemptSignature)out.withoutAttemptSignature++;
    if(Array.isArray(e.lastReasons)&&e.lastReasons.length) {
      out.attemptedRefused++;
      if(e.lastReasons.length>1)out.entriesWithMultipleReasons++;
      for(const reason of e.lastReasons) {
        const atom=String(reason).slice(0,120),kind=atom.split(':')[0];
        out.reasonAtomTotal++;atoms.set(atom,(atoms.get(atom)||0)+1);kinds.set(kind,(kinds.get(kind)||0)+1);
      }
    } else if(!e.attemptSignature)out.neverTried++;
    if(e.baseCommit)bases.set(e.baseCommit,(bases.get(e.baseCommit)||0)+1);
  }
  return {...out,reasons:topCounts(atoms,25),reasonKinds:topCounts(kinds,25),distinctBaseCommits:bases.size,oldestBaseCommit:oldestBase(root,bases)};
}

// mode 'digest' (default, also every caller that does not pass one) keeps the whole queued backlog as targets.
// mode 'merge' returns only what changed between the durable cursor and HEAD, plus pilots; queued entries are
// neither targets nor touched. Entries a merge run could not reach carry origin:'merge' (see registerMergedSource)
// and are tried first by a digest run. Entries without that field are plain backlog (older state files).
export function selectTargets(root, state, config, head, stats, mode='digest') {
  if(!['merge','digest'].includes(mode))throw Error('REGISTRATION_MODE_INVALID');
  const base=state.lastProcessedCommit||config.bootstrapBase;
  if(!/^[a-f0-9]{40}$/.test(base||''))throw Error('BOOTSTRAP_BASE_REQUIRED');
  git(root,'merge-base','--is-ancestor',base,head);
  const files=git(root,'diff','--name-only','-z',base,head,'--','archive/exams/').split('\0').filter(p=>p.endsWith('.js'));
  const selected=new Map(mode==='merge'?[]:Object.entries(structuredClone(state.pending||{})));
  // Optional, read-only origin bookkeeping for the run report; the returned targets are unaffected.
  if(stats){stats.diffKeys=new Set();stats.pilotKeys=new Set();stats.pendingBefore=Object.keys(state.pending||{}).length;stats.diffFiles=files.length;stats.diffAlsoPending=0;}
  for(const rel of files) {
    const source=sourcePath(rel.slice('archive/exams/'.length));
    if(!fs.existsSync(path.join(root,rel)))continue; // Native identity sync owns deletions; never invent a UID relocation.
    const now=loadBank(fs.readFileSync(path.join(root,rel),'utf8'),rel),before=archived(root,base,source);
    for(let i=0;i<now.length;i++)if(!equal(now[i],before[i])) {
      const key=`${source}#${i+1}`;
      if(stats){stats.diffKeys.add(key);if(selected.has(key))stats.diffAlsoPending++;}
      selected.set(key,{sourceArchiveFile:source,sourceOrdinal:i+1,baseCommit:base});
    }
  }
  for(const seed of config.pilotTargets||[]) {
    const key=`${sourcePath(seed.sourceArchiveFile)}#${seed.sourceOrdinal}`;
    if(!state.completedPilots?.includes(key)){if(stats)stats.pilotKeys.add(key);selected.set(key,{...seed,baseCommit:seed.baseCommit||base,pilot:true});}
  }
  // Digest runs try the merge-originated leftovers before the older backlog; without markers the order is unchanged.
  const rank=([,t])=>t?.origin==='merge'&&mode==='digest'?0:1;
  return [...selected.entries()].sort((x,y)=>rank(x)-rank(y)||x[0].localeCompare(y[0],'en'));
}

// Fields that mark an entry as "left over from a merge run". They never survive an attempt.
const settled=t=>{const rest={...t};delete rest.origin;delete rest.mergeHead;return rest;};
export const backlogCounts=pending=>{const all=Object.values(pending||{});return {backlogRemaining:all.length,mergeBacklog:all.filter(e=>e?.origin==='merge').length};};

function replayBatch(root, file, {config,state,head}) {
  const original=JSON.parse(fs.readFileSync(file,'utf8')),binding=original.replayBatch;
  if(original.schemaVersion!==VERSION||original.write!==true||original.head!==head
    ||binding?.schemaVersion!==REPLAY_VERSION||!Array.isArray(binding.targets)
    ||!Array.isArray(binding.results)||binding.targets.length!==binding.results.length
    ||!Array.isArray(binding.rowBindings)||binding.rowBindings.length!==binding.targets.length
    ||binding.targets.length>(config.maxQuestionsPerRun||100))throw Error('AUTO_META_REPLAY_INPUT_INVALID');
  const {sha256:digest,stateAfterSha256,...sealed}=binding;
  if(digest!==hash(sealed)||binding.head!==head||binding.configSha256!==hash(config)
    ||stateAfterSha256!==hash(state)||(binding.targets.length&&state.lastBatchSha256!==digest))
    throw Error('AUTO_META_REPLAY_BINDING_DRIFT');
  const seen=new Set();
  for(let i=0;i<binding.targets.length;i++) {
    const [key,target]=binding.targets[i],result=binding.results[i];
    if(sourcePath(target?.sourceArchiveFile)+'#'+target.sourceOrdinal!==key||seen.has(key)
      ||!Number.isInteger(target.sourceOrdinal)||target.sourceOrdinal<1||!/^[a-f0-9]{40}$/.test(target.baseCommit||'')
      ||result.sourceArchiveFile!==target.sourceArchiveFile||result.sourceOrdinal!==target.sourceOrdinal
      ||!['APPLY','ALREADY_REGISTERED','SUPPLEMENT_PENDING'].includes(result.status))
      throw Error('AUTO_META_REPLAY_TARGET_INVALID');
    seen.add(key);
  }
  const applied=binding.results.filter(r=>r.status==='APPLY');
  if(applied.length!==(original.applied||0)||!equal(binding.sourceHashes,original.sourceHashes||{}))
    throw Error('AUTO_META_REPLAY_RESULT_SCOPE_MISMATCH');
  for(const [rel,digest]of Object.entries(binding.sourceHashes)) {
    if(!rel.startsWith('archive/exams/')||'archive/exams/'+sourcePath(rel.slice(14))!==rel
      ||sha256(fs.readFileSync(path.join(root,rel)))!==digest)throw Error('AUTO_META_REPLAY_SOURCE_DRIFT');
  }
  for(const [rel,digest]of Object.entries(binding.immutableOutputs)) {
    if(!/^\.archive-meta-register\/auto\/(requests|receipts)\/[A-Za-z0-9_-]+\.json$/.test(rel)
      ||sha256(fs.readFileSync(path.join(root,rel)))!==digest)throw Error('AUTO_META_REPLAY_RECEIPT_DRIFT');
  }
  return binding;
}

// Instrumentation must never decide whether a registration run succeeds: any failure only drops the numbers.
export function safeInstrumentation(build) {
  try { return build(); }
  catch(error) { return {schemaVersion:INSTRUMENTATION_VERSION,error:String(error?.message||error).slice(0,160)}; }
}
const newTally = targets => ({targets,attempted:0,applied:0,alreadyRegistered:0,refused:0,unchangedSkipped:0,notReachedBudget:0});
function buildInstrumentation({root,max,originStats,pendingBefore,pendingAfter,tally,origins,files,unchangedFiles,outputs,touched,mode,mergeNotReached=0}) {
  const o=name=>({targets:0,attempted:0,unchangedSkipped:0,notReachedBudget:0,...origins.get(name)});
  const origin=originStats?{available:true,
    thisMergeDiff:{changedExamFiles:originStats.diffFiles,questions:o('diff').targets,attempted:o('diff').attempted,unchangedSkipped:o('diff').unchangedSkipped,
      notReachedBudget:o('diff').notReachedBudget,alsoQueuedBefore:originStats.diffAlsoPending},
    queuedBacklog:{questions:o('backlog').targets,attempted:o('backlog').attempted,unchangedSkipped:o('backlog').unchangedSkipped,notReachedBudget:o('backlog').notReachedBudget},
    pilot:{questions:o('pilot').targets,attempted:o('pilot').attempted},
    thisMergeQuestionsNotReachedBecauseOfBudget:o('diff').notReachedBudget}:{available:false};
  const paths=[...outputs.keys()];
  return {schemaVersion:INSTRUMENTATION_VERSION,
    run:{batchLimit:max,...tally,registeredUids:touched,requestFiles:paths.filter(p=>p.startsWith(`${AUTO}/requests/`)).length,
      receiptFiles:paths.filter(p=>p.startsWith(`${AUTO}/receipts/`)).length},
    attemptedByFile:topFileRows(files),unchangedSkippedByFile:topCounts(new Map([...unchangedFiles].map(([f,v])=>[f,v.total]))),
    origin,pendingBeforeRun:pendingBefore,backlogAfterRun:summarizeBacklog(root,pendingAfter),
    registration:{mode,...backlogCounts(pendingAfter),mergeNotReached}};
}

// plan:true stops after target selection (read-only, no registry context, no writes) so a caller can tell cheaply whether
// a run has any work; with zero targets it returns the same NO_CHANGE report a full run would.
export async function registerMergedSource({root=ROOT,write:doWrite=false,reportPath,replayReportPath,canonicalParentRetryRequestPath,canonicalParentRetryRequestSha256,mode=explicitRegistrationMode(process.env),plan=false,contextLoader=context}={}) {
  root=path.resolve(root);
  if(!['merge','digest'].includes(mode))throw Error('REGISTRATION_MODE_INVALID');
  if(plan&&(doWrite||replayReportPath||canonicalParentRetryRequestPath))throw Error('AUTO_META_PLAN_READ_ONLY');
  if(replayReportPath&&doWrite)throw Error('AUTO_META_REPLAY_READ_ONLY');
  const config=read(root,CONFIG); if(config?.enabled!==true){const r={status:'DISABLED',processed:0,results:[]};if(reportPath)fs.writeFileSync(reportPath,json(r));return r;}
  const head=git(root,'rev-parse','HEAD').trim();
  if(doWrite&&process.env.GITHUB_ACTIONS==='true'&&process.env.GITHUB_REF!=='refs/heads/main')throw Error('MAIN_ONLY_WRITER');
  const state=read(root,STATE,{schemaVersion:VERSION,lastProcessedCommit:config.bootstrapBase,pending:{},completedPilots:[],latestReceipts:{}});
  const replay=replayReportPath?replayBatch(root,replayReportPath,{config,state,head}):null;
  if(replay&&(canonicalParentRetryRequestPath||canonicalParentRetryRequestSha256))throw Error('CANONICAL_PARENT_RETRY:REPLAY_OPTIONS');
  const retryRef=replay?.targets?.[0]?.[1]?.canonicalParentRetry || (canonicalParentRetryRequestPath?{path:canonicalParentRetryRequestPath,sha256:canonicalParentRetryRequestSha256}:null);
  const parentRetry=retryRef?loadCanonicalParentRetry(root,retryRef.path,retryRef.sha256):null;
  if(canonicalParentRetryRequestSha256&&!parentRetry)throw Error('CANONICAL_PARENT_RETRY:REQUEST_REQUIRED');
  const originStats=replay||parentRetry?null:{};
  const targets=replay?structuredClone(replay.targets):parentRetry?canonicalParentRetryTargets(parentRetry):selectTargets(root,state,config,head,originStats,mode);
  if(parentRetry&&!equal(targets,canonicalParentRetryTargets(parentRetry)))throw Error('CANONICAL_PARENT_RETRY:TARGET_SCOPE');
  if(parentRetry)for(const [key,target]of targets) {
    const queued=state.pending?.[key],item=parentRetry.request.items.find(r=>r.sourceOrdinal===target.sourceOrdinal);
    if(queued&&queued.baseCommit!==target.baseCommit)throw Error('CANONICAL_PARENT_RETRY:PENDING_BASE_CONFLICT');
    if(!queued&&!state.latestReceipts?.[item.questionUid])throw Error('CANONICAL_PARENT_RETRY:PENDING_TARGET_REQUIRED');
  }
  const report={schemaVersion:VERSION,head,base:state.lastProcessedCommit,write:doWrite,mode,...backlogCounts(state.pending),mergeNotReached:0,results:[],studentFilesChanged:0,unrelatedMetadataChanged:0,...(parentRetry?{canonicalParentRetryRequest:{path:parentRetry.path,sha256:parentRetry.requestSha256},selectedUidCount:parentRetry.request.items.length}:{})};
  if(!targets.length){
    if(replay?.registrySha&&(await contextLoader(root)).registry.registrySha!==replay.registrySha)throw Error('AUTO_META_REPLAY_REGISTRY_DRIFT');
    const batch={schemaVersion:REPLAY_VERSION,head,configSha256:hash(config),registrySha:null,targets:[],results:[],rowBindings:[],sourceHashes:{},immutableOutputs:{}};
    report.status='NO_CHANGE';report.applied=0;report.plannedPaths=[];report.targetCount=0;
    if(mode==='merge')report.note='NO_TARGETS: this merge changed no exam question; queued backlog is left for the scheduled or manual digest run';
    if(replay){report.replayVerified=true;report.replayed=0;report.replayOf=replay.sha256;}
    else report.replayBatch={...batch,sha256:hash(batch),stateAfterSha256:hash(state)};
    if(!replay)report.instrumentation=safeInstrumentation(()=>buildInstrumentation({root,max:config.maxQuestionsPerRun||100,originStats,pendingBefore:Object.keys(state.pending||{}).length,
      pendingAfter:state.pending,tally:newTally(0),origins:new Map(),files:new Map(),unchangedFiles:new Map(),outputs:new Map(),touched:0,mode}));
    if(reportPath)fs.writeFileSync(reportPath,json(report));return report;
  }
  if(plan) {
    report.status='PLAN';report.targetCount=targets.length;report.applied=0;report.plannedPaths=[];
    if(reportPath)fs.writeFileSync(reportPath,json(report));
    return report;
  }
  const textRebinds=loadRebinds(root);
  const c=await contextLoader(root),banks=new Map(),sourceBindings=new Map(),previousBanks=new Map(),changedPacks=new Set(),outputs=new Map();
  if(replay&&c.registry.registrySha!==replay.registrySha)throw Error('AUTO_META_REPLAY_REGISTRY_DRIFT');
  const rowBinding=key=>{
    const identity=c.identityByJoin.get(key),current=c.metaByUid.get(identity?.questionUid);
    return {key,questionUid:identity?.questionUid??null,identitySha256:hash(identity??null),metadataSha256:hash(current??null)};
  };
  if(replay&&!equal(replay.rowBindings,targets.map(([key])=>rowBinding(key))))throw Error('AUTO_META_REPLAY_UID_STATE_DRIFT');
  const attemptedTargets=[],attemptedResults=[];
  const nextState=structuredClone(state);nextState.pending={...state.pending};nextState.latestReceipts={...state.latestReceipts};nextState.completedPilots=[...(state.completedPilots||[])];
  const beforeRows=new Map(c.metadata.records.map(r=>[r.questionUid,hash(r)])),touched=new Set(),sourceHashes=new Map();
  const max=config.maxQuestionsPerRun||100;
  if(!Number.isInteger(max)||max<1||max>500)throw Error('BATCH_LIMIT_INVALID');
  if(parentRetry&&targets.length>max)throw Error('CANONICAL_PARENT_RETRY:BATCH_LIMIT');
  const sourceDelta=git(root,'diff','--name-only',state.lastProcessedCommit,head,'--','archive/exams/').trim();
  let acted=0,mergeNotReached=0;
  const tally=newTally(targets.length),origins=new Map(),fileTally=new Map(),unchangedFiles=new Map();
  const originOf=key=>!originStats?'unknown':originStats.diffKeys.has(key)?'diff':originStats.pilotKeys.has(key)?'pilot':'backlog';
  const count=(name,field)=>{const row=origins.get(name)||{targets:0,attempted:0,unchangedSkipped:0,notReachedBudget:0};row[field]++;origins.set(name,row);};
  const fileRow=(map,file)=>{let row=map.get(file);if(!row){row={total:0,registered:0,alreadyRegistered:0,refused:0};map.set(file,row);}return row;};
  for(let ti=0;ti<targets.length;ti++) {
    const [key,target]=targets[ti];
    count(originOf(key),'targets');
    if(acted>=max) {
      // A merge run never lets this merge's own questions fall back into the anonymous backlog: mark them so the
      // next digest run tries them first and the reports can count them separately.
      const fromMerge=mode==='merge'&&originOf(key)==='diff';
      nextState.pending[key]=fromMerge?{...target,origin:'merge',mergeHead:head}:target;
      tally.notReachedBudget++;if(fromMerge)mergeNotReached++;count(originOf(key),'notReachedBudget');continue;
    }
    const attemptedTarget=structuredClone(target);
    const source=sourcePath(target.sourceArchiveFile),ordinal=Number(target.sourceOrdinal),rel=`archive/exams/${source}`;
    if(!Number.isInteger(ordinal)||ordinal<1)throw Error('INVALID_TARGET_ORDINAL');
    let result,attempted=false;
    try {
      if(!banks.has(source)){
        const bytes=fs.readFileSync(path.join(root,rel));sourceHashes.set(rel,sha256(bytes));
        banks.set(source,loadBank(bytes.toString('utf8'),rel));
        sourceBindings.set(source,{root,bytes,bank:banks.get(source)});
      }
      const prevKey=`${target.baseCommit}:${source}`;
      if(!previousBanks.has(prevKey))previousBanks.set(prevKey,archived(root,target.baseCommit,source));
      const q=banks.get(source)[ordinal-1];if(!q)throw Error('TARGET_REMOVED_OR_REORDERED');
      const id=c.identityByJoin.get(key),current=c.metaByUid.get(id?.questionUid);
      const priorPath=state.latestReceipts?.[id?.questionUid];
      if(priorPath&&!new RegExp('^\\.archive-meta-register/auto/receipts/[A-Za-z0-9_-]+\\.json$').test(priorPath))throw Error('RECEIPT_PATH_INVALID');
      const prior=priorPath?read(root,priorPath):null;
      const attemptSignature=hash({source:sourceHashes.get(rel),metadata:current,registry:c.registry.registrySha,...(parentRetry?{canonicalParentRetry:{requestSha256:parentRetry.requestSha256,masterSha256:parentRetry.request.masterRef.sha256}}:{})});
      if(!replay&&state.pending?.[key]?.attemptSignature===attemptSignature) {
        report.results.push({status:'SUPPLEMENT_PENDING_UNCHANGED',sourceArchiveFile:source,sourceOrdinal:ordinal,reasons:state.pending[key].lastReasons});
        tally.unchangedSkipped++;count(originOf(key),'unchangedSkipped');fileRow(unchangedFiles,source).total++;
        // An entry that was already attempted is no longer an unvisited merge leftover (an older writer keeps stale marks).
        if(state.pending[key].origin!==undefined||state.pending[key].mergeHead!==undefined)nextState.pending[key]=settled(state.pending[key]);
        continue;
      }
      acted++;attempted=true;target.attemptSignature=attemptSignature;
      const runtimeOwner=c.owners.get(id?.questionUid),nativeSource=sourceBindings.get(source);
      if(['FINAL_QA','REVIEW2','META_PIPELINE_AUDIT'].includes(current?.metadataApprovalType)&&!nativeSource.blobSha1)
        nativeSource.blobSha1=execFileSync('git',['hash-object','--path',rel,'--stdin'],{cwd:root,input:nativeSource.bytes,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();
      result=planQuestion({question:q,previous:previousBanks.get(prevKey)[ordinal-1],current,identity:id,registry:c.registry,validate:c.validate,source,ordinal,runtimeOwner,priorReceipt:prior,canonicalParentRetry:parentRetry,textRebinds,
        nativeSource:{...nativeSource,...(parentRetry?{previousSourceBytes:execFileSync('git',['show',`${target.baseCommit}:${rel}`],{cwd:root,maxBuffer:16*1024*1024,stdio:['pipe','pipe','pipe']})}:{}),identityMap:c.identityMap,identityByJoin:c.identityByJoin,runtimeRecord:c.runtimes.get(runtimeOwner)?.data.records.find(r=>r.questionUid===id?.questionUid),
          runtimeStatus:c.runtimes.get(runtimeOwner)?.data.status}});
      if(result.status==='APPLY') {
        const rt=c.runtimes.get(result.ownerPack);if(!rt||rt.data.status!=='ACTIVE')throw Error('OWNER_RUNTIME_MISSING');
        const requestId=`main-${result.questionUid.slice(7,23)}-${result.inputHash.slice(0,24)}`;
        const reqPath=`${AUTO}/requests/${requestId}.json`,receiptPath=`${AUTO}/receipts/${requestId}.json`;
        const final=result.final;
        final.metadataRevision=`${VERSION}:${requestId}`;
        final.registrationEvidence=[...new Set([...(current.registrationEvidence||[]),receiptPath])];
        const request={schemaVersion:VERSION,requestId,questionUid:result.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,
          inputHash:result.inputHash,sourceSha256:sourceHashes.get(rel),sourceCommit:git(root,'log','-1','--format=%H','--',rel).trim(),registrySha:c.registry.registrySha,
          approvalBasis:'MAIN_MERGED_EXPLICIT_METADATA',independentReviewClaim:false,
          before:pick(current,result.changedFields),after:pick(final,result.changedFields),changedFields:result.changedFields};
        const receipt={...request,metadataRegistrationStatus:'REGISTERED',consumerStatus:'PENDING_VERIFICATION',
          studentPayloadHash:result.studentPayloadHash,coreChanged:result.coreChanged,reviewPreserved:result.preserveReview,
          values:pick(final,[...FIELDS,'sourceFingerprint','contentFingerprint','L1','L2','L3','L4']),
          ...(result.canonicalParentRetry?{canonicalParentRetry:result.canonicalParentRetry,registeredMetadataSha256:hash(final)}:{})};
        const existing=read(root,reqPath);
        if(existing&&!equal(existing,request))throw Error('IMMUTABLE_REQUEST_CONFLICT');
        const priorStoredReceipt=read(root,receiptPath);
        if(priorStoredReceipt&&!equal(priorStoredReceipt,receipt))throw Error('IMMUTABLE_RECEIPT_CONFLICT');
        outputs.set(reqPath,request);outputs.set(receiptPath,receipt);
        Object.assign(current,final);touched.add(result.questionUid);
        const rr={...structuredClone(final),sourceQuestionNo:result.sourceQuestionNo,sourceIdentity:key,
          approvedSourceFingerprint:final.sourceFingerprint,legacyLevel:final.level,
          runtimeSelectable:final.defaultSelectable&&final.curriculumApplicability==='DEFAULT_SCOPE'};
        rt.data.records=rt.data.records.filter(r=>r.questionUid!==result.questionUid);rt.data.records.push(rr);
        c.owners.set(result.questionUid,result.ownerPack);changedPacks.add(result.ownerPack);
        nextState.latestReceipts[result.questionUid]=receiptPath;
        result={...result,requestId,receiptPath};delete result.final;
      }
      if(parentRetry&&result.status==='ALREADY_REGISTERED')result={...result,receiptPath:priorPath};
      if(['APPLY','ALREADY_REGISTERED'].includes(result.status)) {
        delete nextState.pending[key];
        if(target.pilot&&!nextState.completedPilots.includes(key))nextState.completedPilots.push(key);
      } else nextState.pending[key]={...settled(target),lastReasons:result.reasons};
    }catch(e) { if(!attempted)acted++;result={status:'SUPPLEMENT_PENDING',sourceArchiveFile:source,sourceOrdinal:ordinal,reasons:[String(e.message)]};nextState.pending[key]={...settled(target),lastReasons:result.reasons}; }
    tally.attempted++;count(originOf(key),'attempted');
    {const row=fileRow(fileTally,source);row.total++;
      if(result.status==='APPLY'){tally.applied++;row.registered++;}
      else if(result.status==='ALREADY_REGISTERED'){tally.alreadyRegistered++;row.alreadyRegistered++;}
      else{tally.refused++;row.refused++;}}
    attemptedTargets.push([key,attemptedTarget]);attemptedResults.push(structuredClone(result));
    if(replay) {
      const before=replay.results[ti],expected=before.status==='APPLY'?'ALREADY_REGISTERED':before.status;
      if(result.status!==expected||result.questionUid!==before.questionUid
        ||(['APPLY','ALREADY_REGISTERED'].includes(before.status)&&result.inputHash!==before.inputHash)
        ||(expected==='SUPPLEMENT_PENDING'&&!equal(result.reasons,before.reasons)))
        throw Error('AUTO_META_REPLAY_NOT_IDEMPOTENT:'+key);
    }
    report.results.push(result);
  }
  if(parentRetry&&(attemptedTargets.length!==targets.length||report.results.some(r=>!['APPLY','ALREADY_REGISTERED'].includes(r.status))))throw Error('CANONICAL_PARENT_RETRY:BATCH_REFUSED:'+JSON.stringify(report.results.map(r=>({sourceOrdinal:r.sourceOrdinal,status:r.status,reasons:r.reasons}))));
  if(parentRetry)nextState.completedCanonicalParentRetries={...(state.completedCanonicalParentRetries||{}),[parentRetry.requestSha256]:{requestPath:parentRetry.path,requestSha256:parentRetry.requestSha256,receipts:report.results.map(r=>({questionUid:r.questionUid,path:r.receiptPath,sha256:sha256(outputs.has(r.receiptPath)?json(outputs.get(r.receiptPath)):fs.readFileSync(path.join(root,r.receiptPath)))}))}};
  // A queued batch is durable in the SAME commit as its cursor. Missed events are caught up from this cursor.
  if(!parentRetry&&(sourceDelta||touched.size||acted&&targets.some(([,t])=>t.pilot&&!state.completedPilots?.includes(`${t.sourceArchiveFile}#${t.sourceOrdinal}`))))nextState.lastProcessedCommit=head;
  for(const row of c.metadata.records)if(!touched.has(row.questionUid)&&beforeRows.get(row.questionUid)!==hash(row))throw Error('UNRELATED_UID_MUTATION');
  for(const [rel,sha]of sourceHashes)if(sha256(fs.readFileSync(path.join(root,rel)))!==sha)throw Error('STUDENT_SOURCE_MUTATION');
  if(touched.size) {
    c.metadata.counts={...c.metadata.counts,records:c.metadata.records.length,uidUnique:true,sourceJoinUnique:true};
    for(const [field,marker] of [['explicitProblemTypeHolds','problemType'],['explicitTemplateHolds','template'],['explicitDifficultyHolds','difficulty']]) {
      if(Object.hasOwn(c.metadata.counts,field))c.metadata.counts[field]=c.metadata.records.filter(r=>r.fieldStatus?.[marker]==='manual_review_pending').length;
    }
    if(Object.hasOwn(c.metadata,'reviewedPassCount'))c.metadata.reviewedPassCount=c.metadata.records.filter(r=>r.reviewStatus==='reviewed_pass').length;
    if(Object.hasOwn(c.metadata.counts,'semanticallyReviewed'))c.metadata.counts.semanticallyReviewed=c.metadata.records.filter(r=>r.reviewStatus==='reviewed_pass'||['approved_semantic_review','approved_exam_meta_source'].includes(r.metadataStatus)).length;
    if(Object.hasOwn(c.metadata,'digest')){delete c.metadata.digest;c.metadata.digest=sha256(JSON.stringify(c.metadata));}
    outputs.set(META,c.metadata);
    for(const p of changedPacks){const rt=c.runtimes.get(p);rt.data.records.sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en'));c.refreshRuntime(rt.data);outputs.set(rt.rel,rt.data);}
  }
  if(!replay) {
    const batch={schemaVersion:REPLAY_VERSION,head,configSha256:hash(config),registrySha:c.registry.registrySha,
      targets:attemptedTargets,results:attemptedResults,sourceHashes:Object.fromEntries(sourceHashes),
      rowBindings:attemptedTargets.map(([key])=>rowBinding(key)),
      immutableOutputs:Object.fromEntries([...outputs].filter(([p])=>p.startsWith(`${AUTO}/requests/`)||p.startsWith(`${AUTO}/receipts/`)).map(([p,obj])=>[p,sha256(json(obj))]))};
    const digest=hash(batch);
    if(attemptedTargets.length)nextState.lastBatchSha256=digest;
    report.replayBatch={...batch,sha256:digest,stateAfterSha256:hash(nextState)};
  }
  if(!equal(state,nextState))outputs.set(STATE,nextState);
  if(replay) {
    if(acted!==replay.targets.length||touched.size||outputs.size)throw Error('AUTO_META_REPLAY_NOT_IDEMPOTENT');
    report.replayVerified=true;report.replayed=acted;report.replayOf=replay.sha256;
  }
  report.status=report.results.some(r=>r.status.startsWith('SUPPLEMENT_PENDING'))?'REGISTERED_WITH_SUPPLEMENTS':touched.size?'REGISTERED':'NO_CHANGE';
  report.unrelatedMetadataDigest=hash(c.metadata.records.filter(r=>!touched.has(r.questionUid)).sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en')));
  report.sourceHashes=Object.fromEntries(sourceHashes);
  report.applied=touched.size;report.pending=Object.keys(nextState.pending).length;report.plannedPaths=[...outputs.keys()];
  Object.assign(report,backlogCounts(nextState.pending),{mergeNotReached,targetCount:targets.length});
  if(!replay)report.instrumentation=safeInstrumentation(()=>buildInstrumentation({root,max,originStats,pendingBefore:Object.keys(state.pending||{}).length,pendingAfter:nextState.pending,
    tally,origins,files:fileTally,unchangedFiles,outputs,touched:touched.size,mode,mergeNotReached}));
  if(doWrite){assertMetadataAssembledCurrent(root);for(const [rel,obj]of outputs)write(root,rel,obj);}
  if(reportPath)fs.writeFileSync(reportPath,json(report));
  return report;
}

export async function verifyMergedSource({root=ROOT,reportPath}) {
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8')),c=await context(root);
  const {loadResolvedConsumerCatalog}=await import('./reviewed-exam-registration-v2.mjs');
  const catalog=loadResolvedConsumerCatalog(root),byUid=new Map((catalog.records||[]).map(r=>[r.questionUid,r]));
  const appliedUids=new Set(report.results.filter(r=>r.status==='APPLY').map(r=>r.questionUid));
  if(report.unrelatedMetadataDigest&&hash(c.metadata.records.filter(r=>!appliedUids.has(r.questionUid)).sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en')))!==report.unrelatedMetadataDigest)throw Error('BUILD_CHANGED_UNRELATED_METADATA');
  for(const [rel,digest] of Object.entries(report.sourceHashes||{}))if(sha256(fs.readFileSync(path.join(root,rel)))!==digest)throw Error('BUILD_CHANGED_SOURCE');
  const verified=[];
  for(const r of report.results.filter(r=>r.status==='APPLY'||report.canonicalParentRetryRequest&&r.status==='ALREADY_REGISTERED')) {
    const receipt=read(root,r.receiptPath),row=c.metaByUid.get(r.questionUid),owner=c.owners.get(r.questionUid),rt=c.runtimes.get(owner)?.data.records.find(x=>x.questionUid===r.questionUid),consumer=byUid.get(r.questionUid);
    if(!receipt||!row||!rt||!consumer)throw Error('REGISTERED_UID_MISSING:'+r.questionUid);
    for(const f of ['problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket']) {
      if(!equal(row[f],receipt.values[f])||!equal(rt[f],receipt.values[f]))throw Error(`REGISTERED_PARITY:${r.questionUid}.${f}`);
    }
    const q=loadBank(fs.readFileSync(path.join(root,'archive/exams',r.sourceArchiveFile),'utf8'))[r.sourceOrdinal-1];
    if(hash(pick(q,STUDENT))!==receipt.studentPayloadHash)throw Error('REGISTERED_SOURCE_CHANGED');
    // The actual consumer can expose a recorded-metadata lane without conferring an independent QA approval.
    const cpt=consumer.problemTypeKey||consumer.metaHintPT;
    const ctpl=consumer.templateKey||consumer.metaHintTPL;
    if(cpt!==row.problemTypeKey||ctpl!==row.templateKey)throw Error('CONSUMER_PT_TPL_MISMATCH:'+r.questionUid+':'+JSON.stringify({cpt,ctpl,metaBinding:consumer.metaBinding,keys:Object.keys(consumer).filter(k=>/meta|ype|emplate/i.test(k))}));
    if(consumer.sourceFile!==r.sourceArchiveFile||Number(consumer.sourceOrdinal)!==r.sourceOrdinal)throw Error('CONSUMER_UID_JOIN_MISMATCH');
    if(!(consumer.problemTypeKey&&consumer.templateKey)&&!consumer.metaBinding)throw Error('CONSUMER_METADATA_NOT_SOURCE_BOUND');
    if(Number(consumer.difficultyBucket)!==Number(row.difficultyBucket))throw Error('CONSUMER_DIFFICULTY_MISMATCH');
    for(const field of ['crossConceptKeys','conditionKeys'])if(Object.hasOwn(consumer,field)&&!equal(consumer[field],row[field]))throw Error('CONSUMER_'+field+'_MISMATCH');
    verified.push({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,problemTypeKey:cpt,templateKey:ctpl,metaBinding:consumer.metaBinding||null});
  }
  const result={status:'PASS',verifiedCount:verified.length,verified,studentMutation:0};
  if(verified.length)write(root,`${AUTO}/last-verification.json`,{schemaVersion:VERSION,head:report.head,...result});
  return result;
}
// Finish module evaluation before Consumer imports this module back through the registrar.
async function runCli() {
  const a=process.argv.slice(2),get=k=>a.includes(k)?a[a.indexOf(k)+1]:undefined;
  try {
    const root=get('--root')||ROOT,reportPath=get('--report')||path.join(process.env.RUNNER_TEMP||'/tmp','archive-auto-meta-report.json');
    const result=a.includes('--verify')?await verifyMergedSource({root,reportPath}):await registerMergedSource({root,write:a.includes('--write'),reportPath,replayReportPath:get('--replay-report'),canonicalParentRetryRequestPath:get('--canonical-parent-retry-request'),canonicalParentRetryRequestSha256:get('--canonical-parent-retry-sha256'),plan:a.includes('--plan')});
    console.log(JSON.stringify(result,null,2));
  }catch(e){console.error('AUTO_META_FAILED:',e.stack||e);process.exitCode=1;}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) void runCli();
