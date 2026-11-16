// Main-merge metadata registration. It applies declared metadata, never invents a semantic review.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isUnambiguousLegacySourceUidAlias } from '../intelligence/question-identity-contract.mjs';
import { REASSESSED_STUDENT_FIELDS } from './reviewed-source-reassessment.mjs';
import { nativeReviewedFigureRebind } from './native-reviewed-figure-reuse.mjs';
import { nativeReviewedRendererRebind } from './native-reviewed-renderer-reuse.mjs';
import { hasNativeReviewedSourceClaim, validateNativeReviewedSourceReuse, nativeReviewedFamilyRationaleReuse,
  nativeReviewedMetadataRationaleReuse } from './native-reviewed-source-reuse.mjs';
import { hasAuditSourcePreservationClaim } from './native-audit-source-preservation.mjs';
import { hasNativeSourcePreservationClaim, nativePreservedSourceRebind } from './native-preserved-source-reuse.mjs';
import { validateIssuedSourceBindingRecovery } from './issued-source-binding-recovery.mjs';
import { hasReviewedReceiptLineage, reviewedSourceBindingPath } from './reviewed-source-binding.mjs';
import { nativeOriginalFinalQaRendererRebind,hasOriginalFinalQaRendererClaim } from './original-finalqa-renderer-preservation.mjs';
import { hasApprovedRendererPreservationClaim, verifyApprovedRendererReceipt } from './native-approved-renderer-preservation.mjs';
import { isAuditPreservation,isPreservableAuditRecord,loadAuditPreservation,planPreservedAuditRecord,
  readAuditPreservationRequest,assertAuditPreservationReceipt,assertPreservedAuditRepair } from './native-audit-preservation.mjs';
import { nativeAuditCcAppend, hasExplicitAuditCcAppendClaim, hasAuditCcAppendClaim } from './audited-cross-concept-append.mjs';
import {resolveSemanticRunScope,semanticRunScopeProof,assertSemanticRunScopeProof,excludesSemanticSource} from './semantic-run-scope.mjs';

import { nativeAuthorityHoldState } from './native-authority-correction.mjs';
import { verifyIssuedRpmEvidenceContinuity } from './issued-rpm-evidence-continuity.mjs';

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
const write = (root, rel, value) => { const f=path.join(root,rel); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,json(value)); };
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
  if(!nativeSource||!previous)return null;
  if(nativeAuthorityHoldState({root:nativeSource.root,current,identity,source,ordinal}))return null;
  const studentUnchanged=equal(pick(previous,STUDENT),pick(question,STUDENT));
  const {root,bytes,blobSha1,bank,runtimeRecord,runtimeStatus}=nativeSource;
  if(!Buffer.isBuffer(bytes)||!Array.isArray(bank)||!equal(bank[ordinal-1],question)
    ||!/^[a-f0-9]{40}$/.test(blobSha1||'')||!runtimeRecord||runtimeStatus!=='ACTIVE'
    ||String(runtimeRecord.sourceQuestionNo??'')!==String(question.sourceQuestionNo??question.id??''))return null;
  if(current.metadataApprovalType==='META_PIPELINE_AUDIT') {
    const component = nativeAuditCcAppend({nativeSource,question,previous,current,identity,ordinal,registry,pt,tpl,ownerPack});
    if(component)return component;
    if(hasExplicitAuditCcAppendClaim({root,current,runtimeRecord}))return null;
    return preservedAuditReceipt({nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,ownerPack});
  }
  if(hasExplicitAuditCcAppendClaim({root,current,runtimeRecord}))return null;
  if(!['FINAL_QA','REVIEW2'].includes(current.metadataApprovalType)||current.reviewStatus!=='reviewed_pass'
    ||!String(current.metadataStatus||'').startsWith('approved_')||current.tagStatus!=='reviewed_pass'
    ||current.sourceFingerprint!==sourceFingerprint(question)||current.contentFingerprint!==contentFingerprint(question)
    ||FIELDS.some(k=>Object.hasOwn(question,k)&&!equal(question[k],current[k]))
    ||current.metaFoundationStatus!=='ACTIVE'||current.metaFoundationPackId!==ownerPack
    ||!String(current.L1||'').trim()||!String(current.L2||'').trim()
    ||current.L3!==pt.canonicalLabelKo||current.L4!==tpl.canonicalLabelKo)return null;
  const boundRead=relative=>{
    if(typeof relative!=='string'||path.isAbsolute(relative)||relative.includes('\\')
      ||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('NATIVE_EVIDENCE_PATH_INVALID');
    const full=fs.realpathSync(path.join(root,relative)),base=fs.realpathSync(root);
    if(!full.startsWith(base+path.sep))throw Error('NATIVE_EVIDENCE_PATH_ESCAPE');
    return fs.readFileSync(full);
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
      if(!approval.evidenceRefs.every(ref=>{
        if(!/^[a-f0-9]{64}$/.test(ref.sha256||''))return false;
        const liveSha=sha256(boundRead(ref.path));
        if(liveSha===ref.sha256)return true;
        const continuity=verifyIssuedRpmEvidenceContinuity({root,receipt,receiptPath,evidenceRef:ref});
        return continuity?.currentRef.sha256===liveSha;
      }))continue;
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
      if(validateIssuedSourceBindingRecovery(receipt,nativeSource,question,identity,ordinal,current)===true)return receiptPath;
      const originalRenderer=nativeOriginalFinalQaRendererRebind({receipt,nativeSource,previous,question,identity,ordinal,current,registry,
        revalidateLeaf:ancestor=>nativeReviewReceipt({nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,registry,ownerPack,...ancestor}),
        revalidateDirectSource:()=>validateNativeReviewedSourceReuse(receipt,nativeSource,question,identity,ordinal,current,registry)===true&&hasReviewedReceiptLineage(receipt)});
      if(originalRenderer===true)return receiptPath;
      const reviewedSource=validateNativeReviewedSourceReuse(receipt,nativeSource,question,identity,ordinal,current,registry);
      // Only a replayed immutable source reassessment distinguishes a direct
      // review's lineage refs from source-only preservation. null is no proof;
      // explicit sourceRebind/count claims still enter every preservation guard.
      const reviewedLineage=reviewedSource===true&&hasReviewedReceiptLineage(receipt);
      const reviewedRequest=reviewedLineage?read(root,reviewedSourceBindingPath(receipt.requestId))?.requestSnapshot:null;
      const reviewedPatch=reviewedRequest?.items?.find(row=>row.questionUid===identity.questionUid&&row.sourceOrdinal===ordinal);
      // A request that only rebinds fingerprints must still preserve its actual
      // prior approved values and any mixed renderer peers. A fresh semantic
      // reassessment remains governed by the verified explicit request values.
      const fingerprintOnlyLineage=reviewedPatch?.sourceReview!==undefined&&
        equal(Object.keys(reviewedPatch.after||{}).sort(),['contentFingerprint','sourceFingerprint']);
      const directSourceReview=reviewedLineage&&!fingerprintOnlyLineage;
      const preservedSource=directSourceReview?null:nativePreservedSourceRebind({receipt,nativeSource,question,identity,ordinal,current,registry,
        revalidateLeaf:ancestor=>nativeReviewReceipt({nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,registry,ownerPack,...ancestor})});
      if(preservedSource===true)return receiptPath;
      const reviewedFigure=nativeReviewedFigureRebind(receipt,nativeSource,previous,question,identity,ordinal,current);
      const reviewedRenderer=nativeReviewedRendererRebind(receipt,nativeSource,previous,question,identity,ordinal,current,registry);
      // M2 presentation transport has its own revalidated immutable prefigure
      // view. An older cursor must match that whole student payload exactly;
      // the presence of a marker or witness alone cannot exempt a change.
      const m2Proofs=receipt.fingerprintRepairs?.filter(repair=>repair.questionUid===identity.questionUid&&repair.sourceOrdinal===ordinal)
        .map(repair=>repair.sourceReview?.m2RendererContinuity).filter(Boolean)||[];
      const reviewedM2Renderer=reviewedSource===true&&m2Proofs.length===1&&
        m2Proofs[0].schemaVersion==='archive-reviewed-m2-current-renderer-continuity-v1'&&
        m2Proofs[0].nativeStudentPayloadSha256===hash(pick(previous,REASSESSED_STUDENT_FIELDS));
      const m2ProviderProofs=receipt.fingerprintRepairs?.filter(repair=>repair.questionUid===identity.questionUid&&repair.sourceOrdinal===ordinal)
        .map(repair=>repair.sourceReview?.m2ProviderRendererContinuity).filter(Boolean)||[];
      const reviewedM2ProviderRenderer=reviewedSource===true&&m2ProviderProofs.length===1&&
        m2ProviderProofs[0].schemaVersion==='archive-reviewed-m2-provider-current-renderer-continuity-v1'&&
        m2ProviderProofs[0].nativeStudentPayloadSha256===hash(pick(previous,REASSESSED_STUDENT_FIELDS));
      if(reviewedFigure!==true&&reviewedRenderer!==true&&!reviewedM2Renderer&&!reviewedM2ProviderRenderer&&!studentUnchanged&&!nativeSolutionRebind(receipt,nativeSource,previous,question,identity,ordinal))continue;
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
export function planQuestion({question:q, previous, current, identity, registry, validate, source, ordinal, runtimeOwner, priorReceipt, nativeSource}) {
  const reject = (...reasons) => ({status:'SUPPLEMENT_PENDING',reasons,questionUid:identity?.questionUid||current?.questionUid||null,sourceArchiveFile:source,sourceOrdinal:ordinal});
  if (!identity || !current || identity.questionUid!==current.questionUid || identity.sourceArchiveFile!==source || current.sourceArchiveFile!==source || Number(identity.sourceOrdinal)!==ordinal || Number(current.sourceOrdinal)!==ordinal) return reject('UID_JOIN_MISMATCH');
  const authorityHold=nativeAuthorityHoldState({root:nativeSource?.root,current,identity,source,ordinal});
  if(authorityHold)return reject(authorityHold.reason);
  if (q.questionUid && q.questionUid!==identity.questionUid && !isUnambiguousLegacySourceUidAlias({question:q,
    sourceArchiveFile:source,sourceOrdinal:ordinal,identityRecord:identity,
    identityMap:nativeSource?.identityMap,bank:nativeSource?.bank})) return reject('SOURCE_UID_CONFLICT');
  if (identity.status && identity.status!=='VERIFIED') return reject('UID_NOT_VERIFIED');
  const questionNo=String(q.sourceQuestionNo??q.id??'');
  if(previous&&String(previous.sourceQuestionNo??previous.id??'')!==questionNo)return reject('SOURCE_ORDINAL_CHANGED');
  const fp=sourceFingerprint(q), cf=contentFingerprint(q);
  if(identity.sourceFingerprint!==fp) return reject('IDENTITY_SOURCE_FINGERPRINT_MISMATCH');
  if(current.sourceFingerprint!==fp && (!previous||current.sourceFingerprint!==sourceFingerprint(previous))) return reject('METADATA_SOURCE_FINGERPRINT_CONFLICT');
  const coreChanged=Boolean(previous&&!equal(pick(previous,CORE),pick(q,CORE)));
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
  const inputHash=hash({source,ordinal,student:pick(q,STUDENT),metadata:semantic(q),registry:registry.registrySha});
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
  if(nativeSource&&hasAuditCcAppendClaim({root:nativeSource.root,current,runtimeRecord:nativeSource.runtimeRecord,nativeSource}))
    return reject('AUDITED_CC_COMPONENT_REVALIDATION_FAILED');
  if(nativeSource&&hasOriginalFinalQaRendererClaim({root:nativeSource.root,current,runtimeRecord:nativeSource.runtimeRecord}))
    return reject('ORIGINAL_FINAL_QA_RENDERER_REVALIDATION_FAILED');
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
  if(!binding.L1||!binding.L2||!pt.canonicalLabelKo||!tpl.canonicalLabelKo) return reject('CANONICAL_LABELS_MISSING');
  // A newly available registry binding does not resolve a reviewed row's
  // explicit type hold. Keep its approved basic fields and provenance intact;
  // only an explicit reviewed registration may replace these held values.
  // Native receipt reuse above retains priority and does not create approval.
  if(current.metadataStatus==='approved_partial_with_explicit_holds'
    &&['problemType','template'].some(k=>current.fieldStatus?.[k]==='manual_review_pending'))
    return reject('EXPLICIT_PARTIAL_REVIEW_HOLD');
  const final={...candidate,sourceFingerprint:fp,contentFingerprint:cf,curriculum:check.curriculum,curriculumKey:check.curriculum,
    courseKey:check.curriculum===current.curriculumKey&&current.courseKey?current.courseKey:candidate.standardCourse,
    L1:binding.L1,L2:binding.L2,L3:pt.canonicalLabelKo,L4:tpl.canonicalLabelKo,
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
  if(priorReceipt?.inputHash===inputHash&&priorReceipt.metadataRegistrationStatus==='REGISTERED'&&effectiveFields.every(k=>equal(current[k],final[k]))) return {status:'ALREADY_REGISTERED',questionUid:identity.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,inputHash};
  return {status:'APPLY',questionUid:identity.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,inputHash,ownerPack,final,
    changedFields:effectiveFields.filter(k=>!equal(current[k],final[k])),preserveReview,coreChanged,sourceMetaChanged,
    studentPayloadHash:hash(pick(q,STUDENT)),sourceQuestionNo:questionNo};
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

export function selectTargets(root, state, config, head) {
  const base=state.lastProcessedCommit||config.bootstrapBase;
  if(!/^[a-f0-9]{40}$/.test(base||''))throw Error('BOOTSTRAP_BASE_REQUIRED');
  git(root,'merge-base','--is-ancestor',base,head);
  const files=git(root,'diff','--name-only','-z',base,head,'--','archive/exams/').split('\0').filter(p=>p.endsWith('.js'));
  const selected=new Map(Object.entries(structuredClone(state.pending||{})));
  for(const rel of files) {
    const source=sourcePath(rel.slice('archive/exams/'.length));
    if(!fs.existsSync(path.join(root,rel)))continue; // Native identity sync owns deletions; never invent a UID relocation.
    const now=loadBank(fs.readFileSync(path.join(root,rel),'utf8'),rel),before=archived(root,base,source);
    for(let i=0;i<now.length;i++)if(!equal(now[i],before[i])) selected.set(`${source}#${i+1}`,{sourceArchiveFile:source,sourceOrdinal:i+1,baseCommit:base});
  }
  for(const seed of config.pilotTargets||[]) {
    const key=`${sourcePath(seed.sourceArchiveFile)}#${seed.sourceOrdinal}`;
    if(!state.completedPilots?.includes(key))selected.set(key,{...seed,baseCommit:seed.baseCommit||base,pilot:true});
  }
  return [...selected.entries()].sort(([a],[b])=>a.localeCompare(b,'en'));
}

const deferredScopeTargets=(state,scope)=>Object.entries(state.pending||{})
  .filter(([,target])=>excludesSemanticSource(scope,target.sourceArchiveFile))
  .sort(([a],[b])=>a.localeCompare(b,'en'))
  .map(([key,target])=>({key,sourceArchiveFile:target.sourceArchiveFile,sourceOrdinal:target.sourceOrdinal,pendingSha256:hash(target)}));
function assertNoExcludedAttempts(report,scope){
  if((report.results||[]).some(row=>excludesSemanticSource(scope,row.sourceArchiveFile))
    ||(report.targets||[]).some(([,target])=>excludesSemanticSource(scope,target.sourceArchiveFile)))
    throw Error('AUTO_META_SCOPE_EXCLUDED_ATTEMPT');
}
function replayBatch(root, file, {config,state,head,runScope}) {
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
  assertSemanticRunScopeProof(original.runScope,runScope);
  assertSemanticRunScopeProof(binding.runScope,runScope);
  assertNoExcludedAttempts(original,runScope);assertNoExcludedAttempts(binding,runScope);
  if(runScope.active&&(!equal(binding.deferredTargets,deferredScopeTargets(state,runScope))
    ||!equal(original.deferredTargets,binding.deferredTargets)))throw Error('AUTO_META_SCOPE_DEFERRED_BINDING_DRIFT');
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

export async function registerMergedSource({root=ROOT,write:doWrite=false,reportPath,replayReportPath}={}) {
  root=path.resolve(root);
  if(replayReportPath&&doWrite)throw Error('AUTO_META_REPLAY_READ_ONLY');
  const config=read(root,CONFIG); if(config?.enabled!==true){const r={status:'DISABLED',processed:0,results:[]};if(reportPath)fs.writeFileSync(reportPath,json(r));return r;}
  const head=git(root,'rev-parse','HEAD').trim();
  if(doWrite&&process.env.GITHUB_ACTIONS==='true'&&process.env.GITHUB_REF!=='refs/heads/main')throw Error('MAIN_ONLY_WRITER');
  const runScope=resolveSemanticRunScope(root),scopeProof=semanticRunScopeProof(runScope);
  const state=read(root,STATE,{schemaVersion:VERSION,lastProcessedCommit:config.bootstrapBase,pending:{},completedPilots:[],latestReceipts:{}});
  const replay=replayReportPath?replayBatch(root,replayReportPath,{config,state,head,runScope}):null;
  const targets=replay?structuredClone(replay.targets):selectTargets(root,state,config,head);
  const report={schemaVersion:VERSION,head,base:state.lastProcessedCommit,write:doWrite,runScope:scopeProof,
    deferredTargets:replay?structuredClone(replay.deferredTargets||[]):[],results:[],studentFilesChanged:0,unrelatedMetadataChanged:0};
  if(!targets.length){
    if(replay?.registrySha&&(await context(root)).registry.registrySha!==replay.registrySha)throw Error('AUTO_META_REPLAY_REGISTRY_DRIFT');
    const batch={schemaVersion:REPLAY_VERSION,head,configSha256:hash(config),runScope:scopeProof,
      deferredTargets:report.deferredTargets,registrySha:null,targets:[],results:[],rowBindings:[],sourceHashes:{},immutableOutputs:{}};
    report.status=report.deferredTargets.length?'DEFERRED_BY_RUN_SCOPE':'NO_CHANGE';report.applied=0;report.plannedPaths=[];
    report.pending=Object.keys(state.pending||{}).length;report.deferredPending=report.deferredTargets.length;
    report.allowedPending=report.pending-report.deferredPending;
    if(replay){report.replayVerified=true;report.replayed=0;report.replayOf=replay.sha256;}
    else report.replayBatch={...batch,sha256:hash(batch),stateAfterSha256:hash(state)};
    if(reportPath)fs.writeFileSync(reportPath,json(report));return report;
  }
  const c=await context(root),banks=new Map(),sourceBindings=new Map(),previousBanks=new Map(),changedPacks=new Set(),outputs=new Map();
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
  const sourceDelta=git(root,'diff','--name-only',state.lastProcessedCommit,head,'--','archive/exams/').trim();
  let acted=0;
  for(let ti=0;ti<targets.length;ti++) {
    const [key,target]=targets[ti];
    if(excludesSemanticSource(runScope,target.sourceArchiveFile)){
      // selectTargets can replace a pending key with a later source delta. An
      // excluded old debt keeps its original complete record; only newly seen
      // excluded changes are queued, before the global cursor can advance.
      nextState.pending[key]=structuredClone(state.pending?.[key]??target);
      continue;
    }
    if(acted>=max){nextState.pending[key]=target;continue;}
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
      const attemptSignature=hash({source:sourceHashes.get(rel),metadata:current,registry:c.registry.registrySha});
      if(!replay&&state.pending?.[key]?.attemptSignature===attemptSignature) {
        report.results.push({status:'SUPPLEMENT_PENDING_UNCHANGED',sourceArchiveFile:source,sourceOrdinal:ordinal,reasons:state.pending[key].lastReasons});
        continue;
      }
      acted++;attempted=true;target.attemptSignature=attemptSignature;
      const runtimeOwner=c.owners.get(id?.questionUid),nativeSource=sourceBindings.get(source);
      if(['FINAL_QA','REVIEW2','META_PIPELINE_AUDIT'].includes(current?.metadataApprovalType)&&!nativeSource.blobSha1)
        nativeSource.blobSha1=execFileSync('git',['hash-object','--path',rel,'--stdin'],{cwd:root,input:nativeSource.bytes,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();
      result=planQuestion({question:q,previous:previousBanks.get(prevKey)[ordinal-1],current,identity:id,registry:c.registry,validate:c.validate,source,ordinal,runtimeOwner,priorReceipt:prior,
        nativeSource:{...nativeSource,identityMap:c.identityMap,identityByJoin:c.identityByJoin,runtimeRecord:c.runtimes.get(runtimeOwner)?.data.records.find(r=>r.questionUid===id?.questionUid),
          runtimeStatus:c.runtimes.get(runtimeOwner)?.data.status,runtimeStatusByPack:new Map([...c.runtimes].map(([pack,item])=>[pack,item.data.status]))}});
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
          values:pick(final,[...FIELDS,'sourceFingerprint','contentFingerprint','L1','L2','L3','L4'])};
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
      if(['APPLY','ALREADY_REGISTERED'].includes(result.status)) {
        delete nextState.pending[key];
        if(target.pilot&&!nextState.completedPilots.includes(key))nextState.completedPilots.push(key);
      } else nextState.pending[key]={...target,lastReasons:result.reasons};
    }catch(e) { if(!attempted)acted++;result={status:'SUPPLEMENT_PENDING',sourceArchiveFile:source,sourceOrdinal:ordinal,reasons:[String(e.message)]};nextState.pending[key]={...target,lastReasons:result.reasons}; }
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
  // A queued batch is durable in the SAME commit as its cursor. Missed events are caught up from this cursor.
  if(sourceDelta||touched.size||acted&&targets.some(([,t])=>t.pilot&&!state.completedPilots?.includes(`${t.sourceArchiveFile}#${t.sourceOrdinal}`)))nextState.lastProcessedCommit=head;
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
    report.deferredTargets=deferredScopeTargets(nextState,runScope);
    const batch={schemaVersion:REPLAY_VERSION,head,configSha256:hash(config),registrySha:c.registry.registrySha,
      runScope:scopeProof,deferredTargets:report.deferredTargets,
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
  report.status=report.results.some(r=>r.status.startsWith('SUPPLEMENT_PENDING'))?'REGISTERED_WITH_SUPPLEMENTS'
    :report.deferredTargets.length?'REGISTERED_WITH_DEFERRED_SCOPE':touched.size?'REGISTERED':'NO_CHANGE';
  report.unrelatedMetadataDigest=hash(c.metadata.records.filter(r=>!touched.has(r.questionUid)).sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en')));
  report.sourceHashes=Object.fromEntries(sourceHashes);
  report.applied=touched.size;report.pending=Object.keys(nextState.pending).length;report.plannedPaths=[...outputs.keys()];
  report.deferredPending=report.deferredTargets.length;report.allowedPending=report.pending-report.deferredPending;
  assertNoExcludedAttempts(report,runScope);
  if(doWrite)for(const [rel,obj]of outputs)write(root,rel,obj);
  if(reportPath)fs.writeFileSync(reportPath,json(report));
  return report;
}

export async function verifyMergedSource({root=ROOT,reportPath}) {
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8')),runScope=resolveSemanticRunScope(root);
  assertSemanticRunScopeProof(report.runScope,runScope);
  if((runScope.active||report.runScope?.active)&&report.head!==runScope.head)throw Error('AUTO_META_SCOPE_REPORT_HEAD_DRIFT');
  assertNoExcludedAttempts(report,runScope);
  if(runScope.active&&!equal(report.deferredTargets,deferredScopeTargets(read(root,STATE,{pending:{}}),runScope)))
    throw Error('AUTO_META_SCOPE_DEFERRED_BINDING_DRIFT');
  const c=await context(root);
  const {loadResolvedConsumerCatalog}=await import('./reviewed-exam-registration-v2.mjs');
  const catalog=loadResolvedConsumerCatalog(root),byUid=new Map((catalog.records||[]).map(r=>[r.questionUid,r]));
  const appliedUids=new Set(report.results.filter(r=>r.status==='APPLY').map(r=>r.questionUid));
  if(report.unrelatedMetadataDigest&&hash(c.metadata.records.filter(r=>!appliedUids.has(r.questionUid)).sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en')))!==report.unrelatedMetadataDigest)throw Error('BUILD_CHANGED_UNRELATED_METADATA');
  for(const [rel,digest] of Object.entries(report.sourceHashes||{}))if(sha256(fs.readFileSync(path.join(root,rel)))!==digest)throw Error('BUILD_CHANGED_SOURCE');
  const verified=[];
  for(const r of report.results.filter(r=>r.status==='APPLY')) {
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
    if(!(consumer.problemTypeKey&&consumer.templateKey)&&!['exact','content'].includes(consumer.metaBinding))throw Error('CONSUMER_METADATA_NOT_SOURCE_BOUND');
    if(Number(consumer.difficultyBucket)!==Number(row.difficultyBucket))throw Error('CONSUMER_DIFFICULTY_MISMATCH');
    for(const field of ['crossConceptKeys','conditionKeys'])if(Object.hasOwn(consumer,field)&&!equal(consumer[field],row[field]))throw Error('CONSUMER_'+field+'_MISMATCH');
    verified.push({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,problemTypeKey:cpt,templateKey:ctpl,metaBinding:consumer.metaBinding||null});
  }
  const result={status:'PASS',verifiedCount:verified.length,verified,studentMutation:0,
    runScope:semanticRunScopeProof(runScope),deferredPending:report.deferredTargets?.length||0};
  if(verified.length)write(root,`${AUTO}/last-verification.json`,{schemaVersion:VERSION,head:report.head,...result});
  return result;
}
// Finish module evaluation before Consumer imports this module back through the registrar.
async function runCli() {
  const a=process.argv.slice(2),get=k=>a.includes(k)?a[a.indexOf(k)+1]:undefined;
  try {
    const root=get('--root')||ROOT,reportPath=get('--report')||path.join(process.env.RUNNER_TEMP||'/tmp','archive-auto-meta-report.json');
    const result=a.includes('--verify')?await verifyMergedSource({root,reportPath}):await registerMergedSource({root,write:a.includes('--write'),reportPath,replayReportPath:get('--replay-report')});
    console.log(JSON.stringify(result,null,2));
  }catch(e){console.error('AUTO_META_FAILED:',e.stack||e);process.exitCode=1;}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) void runCli();
