// A source-only receipt keeps an existing partial FINAL_QA approval. Reuse its
// original native verifier; a newer container hash is not a new content review.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {validateReviewedSourceReassessment} from './reviewed-source-reassessment.mjs';
import {REVIEWED_META_VALUE_FIELDS} from './reviewed-meta-value-fields.mjs';

const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const ID=/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/, SHA1=/^[a-f0-9]{40}$/, SHA256=/^[a-f0-9]{64}$/;
const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)
  ?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const same=(a,b)=>stable(a)===stable(b);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const fail=message=>{throw Error(`native preserved source reuse: ${message}`);};
const receiptPath=id=>{if(!ID.test(id||''))fail('invalid receipt identity');return RECEIPTS+id+'.json';};
const nativePath=p=>typeof p==='string'&&p.startsWith(RECEIPTS)&&p.endsWith('.json')&&ID.test(p.slice(RECEIPTS.length,-5));

function safePath(root,relative) {
  if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||relative.includes('\\')||
    /[\x00-\x1f]/.test(relative)||relative.split('/').some(p=>!p||p==='.'||p==='..'))fail('unsafe evidence path');
  const full=path.resolve(root,relative);
  for(let p=full;p!==path.resolve(root);p=path.dirname(p))
    if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())fail('symlink evidence path');
  return full;
}
const readBytes=(root,relative)=>fs.readFileSync(safePath(root,relative));
function evidence(root,refs) {
  if(!Array.isArray(refs)||!refs.length)fail('SHA-bound approval evidence required');
  for(const ref of refs)if(!SHA256.test(ref?.sha256||'')||sha(readBytes(root,ref.path))!==ref.sha256)
    fail('approval evidence missing or changed');
}

// A prior native receipt can be evidence for a newly reviewed source. It is not
// by itself a claim that only the source container changed. Recognize the plain
// fingerprint-only reassessment only by replaying every issued native proof;
// a marker, a repair-shaped object, or an unverifiable review cannot opt out of
// preservation checks. Opt-in renderer/parent/retained-field proofs keep their
// existing verifiers and are not reconstructed by this narrow path.
function verifiedPlainReassessment(receipt,root) {
  if(!root||!Array.isArray(receipt.fingerprintRepairs)||!receipt.fingerprintRepairs.length||
    !absentOrEmpty(receipt.registryChanges)||!absentOrEmpty(receipt.nativeParentBindings))return false;
  try {
    const first=receipt.appliedRecords?.[0],state=selected(receipt,first?.questionUid,first?.sourceOrdinal),
      repairs=unique(receipt.fingerprintRepairs,'source reassessment');
    if(!same([...repairs.keys()].sort(),[...state.records.keys()].sort()))return false;
    const current=readBytes(root,'archive/exams/'+receipt.sourceArchiveFile);
    if(blob(current)!==receipt.sourceBlobSha1||sha(current)!==receipt.sourceRawSha256)return false;
    const {bank}=gitSource(root,receipt.sourceBlobSha1,receipt.sourceRawSha256,receipt.expectedQuestionCount);
    evidence(root,receipt.approval.evidenceRefs);
    const cache=new Map(),supportedFields=new Set(REVIEWED_META_VALUE_FIELDS),request={
      scope:receipt.scope,approval:receipt.approval,sourceArchiveFile:receipt.sourceArchiveFile,
      expectedQuestionCount:receipt.expectedQuestionCount,registryChanges:receipt.registryChanges};
    for(const [uid,repair]of repairs) {
      const row=state.records.get(uid),proof=repair.sourceReview,identity=state.identities.get(uid);
      if(repair.rebind!==undefined||repair.sourceOrdinal!==row.sourceOrdinal||
        proof?.schemaVersion!=='archive-reviewed-source-reassessment-v1'||
        proof.scope!=='METADATA_SOURCE_BINDING_ONLY'||proof.newMathematicalQa!==false||
        proof.questionUid!==uid||proof.sourceOrdinal!==row.sourceOrdinal||
        !same(repair.after,{sourceFingerprint:row.sourceFingerprint,contentFingerprint:row.contentFingerprint})||
        identity.sourceFingerprint!==row.sourceFingerprint)return false;
      const patch={questionUid:uid,sourceOrdinal:row.sourceOrdinal,before:repair.metadataBefore,after:repair.after,
        identityBefore:repair.identityBefore,evidenceRefs:receipt.approval.evidenceRefs,
        sourceReview:{schemaVersion:proof.schemaVersion,reviewCommit:proof.reviewCommit,reviewPath:proof.reviewPath,reviewRef:proof.reviewRef}};
      // The registered container can differ only outside the selected review.
      // The official verifier compares this actual selected student payload and
      // all accepted fields with both immutable native source banks.
      const verified=validateReviewedSourceReassessment({root,request,patch,metadata:{...row,...repair.metadataBefore},
        question:bank[row.sourceOrdinal-1],final:row,supportedFields,cache});
      if(!same(verified,proof))return false;
    }
    return true;
  } catch {return false;}
}

// The count and prior-evidence markers also prevent deleting just sourceRebind
// from turning an issued preservation receipt into an ordinary FINAL_QA receipt.
export function isPartialNativeSourcePreservation(receipt,root) {
  if(receipt?.approval?.type!=='FINAL_QA'||!(receipt.scope==='PARTIAL_UIDS'||Object.hasOwn(receipt,'partialUidCount')))return false;
  if(Object.hasOwn(receipt.approval,'sourceRebind')||receipt.newMetadataApprovals===0&&receipt.preservedMetadataApprovals>0)return true;
  if(Array.isArray(receipt.approval.evidenceRefs)&&receipt.approval.evidenceRefs.some(ref=>nativePath(ref?.path)))
    return !verifiedPlainReassessment(receipt,root);
  if(!root||!ID.test(receipt.requestId||'')||!Array.isArray(receipt.appliedRecords)||!receipt.appliedRecords.length||
    !absentOrEmpty(receipt.registryChanges)||!absentOrEmpty(receipt.fingerprintRepairs)||!absentOrEmpty(receipt.nativeParentBindings))return false;
  // Deleting all three receipt markers must not erase the older receipt paths
  // already carried by the issued metadata/runtime records. An exact unchanged
  // approval with evidence append is a preservation claim, not authority to pass.
  for(const relative of receipt.appliedRecords[0].approvalEvidence||[]) {
    if(!nativePath(relative)||relative===receiptPath(receipt.requestId))continue;
    if(!Array.isArray(receipt.runtimeRecords)||![...receipt.appliedRecords,...receipt.runtimeRecords]
      .every(row=>Array.isArray(row.approvalEvidence)&&row.approvalEvidence.includes(relative)))continue;
    try {
      const prior=JSON.parse(readBytes(root,relative));
      if(prior.scope!=='PARTIAL_UIDS'||prior.approval?.type!=='FINAL_QA'||relative!==receiptPath(prior.requestId)||
        prior.examUid!==receipt.examUid||prior.sourceArchiveFile!==receipt.sourceArchiveFile||
        prior.expectedQuestionCount!==receipt.expectedQuestionCount||prior.partialUidCount!==receipt.partialUidCount||
        prior.sourceBlobSha1===receipt.sourceBlobSha1)continue;
      const uid=receipt.appliedRecords[0].questionUid,ordinal=receipt.appliedRecords[0].sourceOrdinal,
        now=selected(receipt,uid,ordinal),old=selected(prior,uid,ordinal);
      if(!same([...now.records.keys()].sort(),[...old.records.keys()].sort()))continue;
      if([...now.records].every(([id,row])=>{
        const before=old.records.get(id),evidenceAfter=[...new Set([...before.approvalEvidence,receiptPath(receipt.requestId)])];
        return same(unchanged(row),unchanged(before))&&same(row.approvalEvidence,evidenceAfter)&&
          same(unchanged(now.runtimes.get(id)),unchanged(old.runtimes.get(id)))&&
          same(now.runtimes.get(id).approvalEvidence,evidenceAfter)&&same(now.identities.get(id),old.identities.get(id));
      }))return true;
    }catch {return true; /* Removing a predecessor still named by every issued row cannot erase its obligation. */}
  }
  return false;
}

// Preserve the existing non-native producer behavior. Only a claimed partial
// preservation chain blocks that fallback when its original proof cannot replay.
export function hasNativeSourcePreservationClaim({root,current,runtimeRecord,nativeSource}) {
  for(const row of [current,runtimeRecord])for(const relative of row?.approvalEvidence||[]) {
    if(!nativePath(relative))continue;
    try {if(isPartialNativeSourcePreservation(JSON.parse(readBytes(root,relative)),root))return true;}catch {/* No new claim is inferred from a filename. */}
  }
  // The latest receipt can itself disappear. Its issued revision and evidence
  // append still bind the unchanged metadata/runtime to a registered ancestor;
  // a missing container receipt must not permit the ordinary producer fallback.
  const id=typeof current?.metadataRevision==='string'&&current.metadataRevision.match(/:exam-final_qa-v2:([A-Za-z0-9][A-Za-z0-9_-]{0,100})$/)?.[1];
  if(!id||current.metadataApprovalType!=='FINAL_QA'||runtimeRecord?.metadataApprovalType!=='FINAL_QA'||runtimeRecord.metadataRevision!==current.metadataRevision||
    !Array.isArray(current.approvalEvidence)||!Array.isArray(runtimeRecord.approvalEvidence))return false;
  const latest=receiptPath(id);
  if(!current.approvalEvidence.includes(latest)||!runtimeRecord.approvalEvidence.includes(latest))return false;
  try {
    const receipt=JSON.parse(readBytes(root,latest)),state=selected(receipt,current.questionUid,current.sourceOrdinal);
    if(receipt.requestId===id&&same(state.row,current)&&same(state.runtime,runtimeRecord)&&
      Buffer.isBuffer(nativeSource?.bytes)&&Array.isArray(nativeSource.bank)&&
      blob(nativeSource.bytes)===nativeSource.blobSha1&&receipt.sourceBlobSha1===nativeSource.blobSha1&&
      receipt.sourceRawSha256===sha(nativeSource.bytes)&&receipt.expectedQuestionCount===nativeSource.bank.length)return false;
  }catch {/* Parsing alone does not establish a current registered receipt. */}
  for(const relative of current.approvalEvidence) {
    if(!nativePath(relative)||relative===latest||!runtimeRecord.approvalEvidence.includes(relative))continue;
    try {
      const prior=JSON.parse(readBytes(root,relative));
      if(prior.scope!=='PARTIAL_UIDS')continue;
      const old=selected(prior,current.questionUid,current.sourceOrdinal);
      const evidenceAfter=[...new Set([...old.row.approvalEvidence,latest])];
      if(relative===receiptPath(prior.requestId)&&same(unchanged(current),unchanged(old.row))&&
        same(unchanged(runtimeRecord),unchanged(old.runtime))&&same(current.approvalEvidence,evidenceAfter)&&
        same(runtimeRecord.approvalEvidence,evidenceAfter))return true;
    }catch {return true; /* Both issued rows still name the now unavailable native ancestor. */}
  }
  return false;
}

function unique(rows,label) {
  if(!Array.isArray(rows))fail(`${label} inventory missing`);
  const result=new Map();
  for(const row of rows) {
    if(typeof row?.questionUid!=='string'||!row.questionUid||result.has(row.questionUid))fail(`${label} UID missing or duplicated`);
    result.set(row.questionUid,row);
  }
  return result;
}
function selected(receipt,uid,ordinal) {
  const records=unique(receipt.appliedRecords,'metadata'),identities=unique(receipt.appliedIdentityRecords,'identity'),runtimes=unique(receipt.runtimeRecords,'runtime');
  if(receipt.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||receipt.metadataRegistrationStatus!=='REGISTERED'||
    receipt.scope!=='PARTIAL_UIDS'||receipt.registrationMode!==undefined||receipt.approval?.type!=='FINAL_QA'||
    receipt.approval.metadataReviewed!==true||!String(receipt.approval.approvedBy||'').trim()||
    !SHA256.test(receipt.requestSha256||'')||!SHA1.test(receipt.sourceBlobSha1||'')||!SHA256.test(receipt.sourceRawSha256||'')||
    typeof receipt.sourceArchiveFile!=='string'||!receipt.sourceArchiveFile.endsWith('.js')||!String(receipt.examUid||'').trim()||
    !Number.isInteger(receipt.expectedQuestionCount)||!Number.isInteger(receipt.partialUidCount)||receipt.partialUidCount<1||
    receipt.partialUidCount>receipt.expectedQuestionCount||receipt.totalQuestions!==receipt.partialUidCount||
    [records,identities,runtimes].some(map=>map.size!==receipt.partialUidCount||!same([...map.keys()].sort(),[...records.keys()].sort()))||
    new Set([...records.values()].map(row=>row.sourceOrdinal)).size!==records.size)fail('exact partial FINAL_QA inventory required');
  const relative=receiptPath(receipt.requestId);
  for(const [id,row]of records) {
    const runtime=runtimes.get(id),identity=identities.get(id),revision=`meta-foundation:${row.metaFoundationPackId}@${row.metaFoundationPackVersion}:exam-final_qa-v2:${receipt.requestId}`;
    if(!Number.isInteger(row.sourceOrdinal)||row.sourceOrdinal<1||row.sourceOrdinal>receipt.expectedQuestionCount||
      [row,runtime,identity].some(value=>value.sourceArchiveFile!==receipt.sourceArchiveFile||value.sourceOrdinal!==row.sourceOrdinal)||
      row.metadataApprovalType!=='FINAL_QA'||runtime.metadataApprovalType!=='FINAL_QA'||
      row.metadataRevision!==revision||runtime.metadataRevision!==revision||
      !Array.isArray(row.approvalEvidence)||!Array.isArray(runtime.approvalEvidence)||
      !row.approvalEvidence.includes(relative)||!runtime.approvalEvidence.includes(relative)||
      runtime.sourceIdentity!==`${receipt.sourceArchiveFile}#${row.sourceOrdinal}`)fail('selected approval, revision or source identity changed');
  }
  if(records.get(uid)?.sourceOrdinal!==ordinal)fail('selected target missing');
  return {records,identities,runtimes,row:records.get(uid),identity:identities.get(uid),runtime:runtimes.get(uid)};
}
function gitSource(root,sourceBlob,rawSha,expectedCount) {
  if(!SHA1.test(sourceBlob||''))fail('exact prior Git blob required');
  let bytes;
  try {bytes=execFileSync('git',['cat-file','blob',sourceBlob],{cwd:root,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']});}
  catch {fail('prior source Git object unavailable');}
  if(blob(bytes)!==sourceBlob||rawSha!==undefined&&sha(bytes)!==rawSha)fail('prior source raw/Git binding mismatch');
  const ctx={window:{}};vm.runInNewContext(bytes.toString('utf8'),ctx,{timeout:5000});
  const bank=ctx.window.questionBank||ctx.window.questions||ctx.questionBank||ctx.questions||ctx.window.examData?.questions;
  if(!Array.isArray(bank)||bank.length!==expectedCount)fail('prior source denominator mismatch');
  return {bytes,blobSha1:sourceBlob,bank:JSON.parse(JSON.stringify(bank))};
}
const unchanged=row=>Object.fromEntries(Object.entries(row).filter(([key])=>!['metadataRevision','approvalEvidence'].includes(key)));
const absentOrEmpty=value=>value===undefined||Array.isArray(value)&&value.length===0;

// A plain reassessment can name the prior native receipt in its immutable review.
// Reuse that transition only for the actual reviewed old question, never for an
// arbitrary stale cursor. Its original native approval must still replay, and
// every approval value is preserved apart from the registered fingerprint change.
export function nativeReassessedPriorSourceRebind({receipt,nativeSource,previous,question,identity,ordinal,current,revalidateLeaf}) {
  const root=nativeSource.root;
  if(Object.hasOwn(receipt.approval||{},'sourceRebind')||receipt.newMetadataApprovals===0&&receipt.preservedMetadataApprovals>0||
    !verifiedPlainReassessment(receipt,root))return null;
  const state=selected(receipt,identity.questionUid,ordinal),repairs=unique(receipt.fingerprintRepairs,'source reassessment');
  const reviews=[...repairs.values()].map(repair=>JSON.parse(readBytes(root,repair.sourceReview.reviewPath)));
  const ref=reviews[0]?.priorMetadataReceipt;
  if(ref===undefined)return null;
  if(!nativePath(ref?.path)||!SHA256.test(ref.sha256||'')||
    !same(Object.keys(ref).sort(),['path','sha256'])||reviews.some(review=>!same(review.priorMetadataReceipt,ref))||
    !receipt.approval.evidenceRefs.some(item=>same(item,ref)))fail('exact reviewed prior receipt reference required');
  if(typeof revalidateLeaf!=='function'||!same(state.row,current)||!same(state.identity,identity)||
    !same(state.runtime,nativeSource.runtimeRecord)||!same(nativeSource.bank?.[ordinal-1],question)||
    !same(JSON.parse(readBytes(root,receiptPath(receipt.requestId))),receipt))fail('current reassessment differs from actual state');
  const priorRaw=readBytes(root,ref.path);
  if(sha(priorRaw)!==ref.sha256)fail('reviewed prior receipt digest changed');
  const prior=JSON.parse(priorRaw),old=selected(prior,identity.questionUid,ordinal);
  if(ref.path!==receiptPath(prior.requestId)||prior.requestId===receipt.requestId||prior.examUid!==receipt.examUid||
    prior.sourceArchiveFile!==receipt.sourceArchiveFile||prior.expectedQuestionCount!==receipt.expectedQuestionCount||
    prior.sourceBlobSha1===receipt.sourceBlobSha1||!same([...old.records.keys()].sort(),[...state.records.keys()].sort()))
    fail('reviewed prior receipt scope changed');
  const priorSource=gitSource(root,prior.sourceBlobSha1,prior.sourceRawSha256,prior.expectedQuestionCount);
  const approvalValues=row=>Object.fromEntries(Object.entries(unchanged(row)).filter(([key])=>
    !['sourceFingerprint','contentFingerprint','approvedSourceFingerprint'].includes(key)));
  const identityValues=row=>Object.fromEntries(Object.entries(row).filter(([key])=>key!=='sourceFingerprint'));
  for(const[uid,row]of state.records){
    const before=old.records.get(uid),repair=repairs.get(uid);
    if(repair.sourceOrdinal!==before.sourceOrdinal||
      !same(repair.metadataBefore,{sourceFingerprint:before.sourceFingerprint,contentFingerprint:before.contentFingerprint})||
      !same(repair.identityBefore,{sourceFingerprint:old.identities.get(uid).sourceFingerprint})||
      !same(approvalValues(row),approvalValues(before))||
      !same(approvalValues(state.runtimes.get(uid)),approvalValues(old.runtimes.get(uid)))||
      !same(identityValues(state.identities.get(uid)),identityValues(old.identities.get(uid))))
      fail('reviewed prior fingerprints or approval values changed');
  }
  const oldQuestion=priorSource.bank[ordinal-1];
  if(!same(previous,oldQuestion)&&!same(previous,question))fail('previous question is not the exact reviewed old or current source');
  evidence(root,prior.approval.evidenceRefs);
  const identityByJoin=new Map(nativeSource.identityByJoin);
  for(const row of old.identities.values())identityByJoin.set(`${row.sourceArchiveFile}#${row.sourceOrdinal}`,row);
  const identityMap=nativeSource.identityMap&&{...nativeSource.identityMap,
    records:nativeSource.identityMap.records.map(row=>old.identities.get(row.questionUid)||row)};
  if(revalidateLeaf({nativeSource:{...nativeSource,...priorSource,identityByJoin,identityMap,runtimeRecord:old.runtime},
    question:oldQuestion,previous:oldQuestion,current:old.row,identity:old.identity})!==ref.path)
    fail('reviewed prior native approval cannot replay');
  return true;
}

export function nativePreservedSourceRebind({receipt,nativeSource,question,identity,ordinal,current,revalidateLeaf}) {
  if(!isPartialNativeSourcePreservation(receipt,nativeSource.root))return null;
  const root=fs.realpathSync(nativeSource.root),runtime=nativeSource.runtimeRecord;
  if(!same(JSON.parse(readBytes(root,receiptPath(receipt.requestId))),receipt))fail('current receipt bytes differ from supplied receipt');
  let cursor=receipt,state=selected(cursor,identity.questionUid,ordinal),source=nativeSource;
  if(typeof revalidateLeaf!=='function'||!same(state.row,current)||!same(state.runtime,runtime)||!same(state.identity,identity)||
    !Buffer.isBuffer(source.bytes)||!Array.isArray(source.bank)||!same(source.bank[ordinal-1],question)||
    source.bank.length!==receipt.expectedQuestionCount||blob(source.bytes)!==source.blobSha1||
    receipt.sourceBlobSha1!==source.blobSha1||receipt.sourceRawSha256!==sha(source.bytes))fail('current receipt differs from actual state');
  const seen=new Set();
  while(isPartialNativeSourcePreservation(cursor,root)) {
    if(seen.has(cursor.requestId)||seen.size>=64)fail('source-rebind cycle or depth exceeded');
    seen.add(cursor.requestId);evidence(root,cursor.approval.evidenceRefs);
    const spec=cursor.approval.sourceRebind,ref=spec?.priorReceiptRef;
    if(!spec||!same(Object.keys(spec).sort(),['priorReceiptRef'])||!nativePath(ref?.path)||!SHA256.test(ref.sha256||'')||
      !cursor.approval.evidenceRefs.some(item=>same(item,ref))||cursor.newMetadataApprovals!==0||
      cursor.preservedMetadataApprovals!==cursor.partialUidCount||!absentOrEmpty(cursor.registryChanges)||
      !absentOrEmpty(cursor.fingerprintRepairs)||!absentOrEmpty(cursor.nativeParentBindings))fail('exact source-only preservation required');
    const raw=readBytes(root,ref.path);
    if(sha(raw)!==ref.sha256)fail('prior receipt digest changed');
    const prior=JSON.parse(raw),old=selected(prior,identity.questionUid,ordinal);
    if(ref.path!==receiptPath(prior.requestId)||seen.has(prior.requestId)||prior.examUid!==cursor.examUid||
      prior.sourceArchiveFile!==cursor.sourceArchiveFile||prior.expectedQuestionCount!==cursor.expectedQuestionCount||
      prior.partialUidCount!==cursor.partialUidCount||prior.sourceRawSha256===cursor.sourceRawSha256||
      !same([...old.records.keys()].sort(),[...state.records.keys()].sort()))fail('preserved ancestor scope or source binding changed');
    const priorSource=gitSource(root,prior.sourceBlobSha1,prior.sourceRawSha256,prior.expectedQuestionCount);
    for(const [uid,row]of state.records) {
      const before=old.records.get(uid),beforeRuntime=old.runtimes.get(uid),nextRuntime=state.runtimes.get(uid);
      const approvalEvidence=[...new Set([...before.approvalEvidence,receiptPath(cursor.requestId)])];
      if(!same(unchanged(row),unchanged(before))||!same(row.approvalEvidence,approvalEvidence)||
        !same(unchanged(nextRuntime),unchanged(beforeRuntime))||!same(nextRuntime.approvalEvidence,approvalEvidence)||
        !same(state.identities.get(uid),old.identities.get(uid))||
        !same(source.bank[row.sourceOrdinal-1],priorSource.bank[row.sourceOrdinal-1]))
        fail('selected whole question, approval or identity changed');
    }
    cursor=prior;state=old;source={...nativeSource,...priorSource,runtimeRecord:old.runtime};
  }
  evidence(root,cursor.approval.evidenceRefs);
  const relative=receiptPath(cursor.requestId),context={nativeSource:source,current:state.row,identity:state.identity,question:source.bank[ordinal-1]};
  if(revalidateLeaf(context)!==relative)fail('original native approval cannot replay for this cursor');
  // A caught-up cursor must not skip the original solution-only repair. Replaying
  // its actual old Git question invokes the same existing native solution guard.
  const repairs=(cursor.fingerprintRepairs||[]).filter(row=>row.questionUid===identity.questionUid);
  if(repairs.length>1)fail('ambiguous original selected repair');
  if(repairs[0]?.rebind!==undefined) {
    const original=gitSource(root,repairs[0].rebind.priorSourceBlobSha1,undefined,cursor.expectedQuestionCount);
    if(revalidateLeaf({...context,previous:original.bank[ordinal-1]})!==relative)fail('original solution repair cannot replay');
  }
  return true;
}
