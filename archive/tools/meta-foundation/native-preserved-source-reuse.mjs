// A source-only receipt keeps an existing partial FINAL_QA approval. Reuse its
// original native verifier; a newer container hash is not a new content review.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {validateReviewedSourceReassessment} from './reviewed-source-reassessment.mjs';
import {REVIEWED_META_VALUE_FIELDS} from './reviewed-meta-value-fields.mjs';
import {nativeReviewedRendererRebind} from './native-reviewed-renderer-reuse.mjs';
import {reviewedRendererBindingPath} from './reviewed-current-renderer-continuity.mjs';
import {assertReviewedPackVersionLineage} from './reviewed-pack-version-lineage.mjs';

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
const reviewCaches=new Map(),reviewedFields=new Set(REVIEWED_META_VALUE_FIELDS);

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

// The count and prior-evidence markers also prevent deleting just sourceRebind
// from turning an issued preservation receipt into an ordinary FINAL_QA receipt.
export function isPartialNativeSourcePreservation(receipt,root) {
  if(receipt?.approval?.type!=='FINAL_QA'||!(receipt.scope==='PARTIAL_UIDS'||Object.hasOwn(receipt,'partialUidCount')))return false;
  if(Object.hasOwn(receipt.approval,'sourceRebind')||receipt.newMetadataApprovals===0&&receipt.preservedMetadataApprovals>0||
    Array.isArray(receipt.approval.evidenceRefs)&&receipt.approval.evidenceRefs.some(ref=>nativePath(ref?.path)))return true;
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

// An ordinary fingerprint reassessment may cite its prior native receipt as
// evidence. That reference remains a fail-closed claim until the actual native
// review replays; it does not by itself make the new receipt source-only. Keep
// explicit preservation markers authoritative, and do not accept a repair flag
// as a substitute for immutable review/source/proof equality.
function ordinaryReviewedReassessment({receipt,nativeSource,question,identity,ordinal,current,registry,reviewedContainerCarry=false}) {
  if(Object.hasOwn(receipt.approval,'sourceRebind')||Object.hasOwn(receipt,'newMetadataApprovals')||
    Object.hasOwn(receipt,'preservedMetadataApprovals')||!absentOrEmpty(receipt.registryChanges)||
    !absentOrEmpty(receipt.nativeParentBindings)||!Array.isArray(receipt.fingerprintRepairs))return false;
  const repairs=receipt.fingerprintRepairs.filter(row=>row.questionUid===identity.questionUid);
  if(repairs.length!==1)return false;
  const repair=repairs[0],proof=repair.sourceReview;
  const fingerprintKeys=['contentFingerprint','sourceFingerprint'];
  if(repair.sourceOrdinal!==ordinal||repair.rebind!==undefined||
    !same(Object.keys(repair.metadataBefore||{}).sort(),fingerprintKeys)||
    !same(Object.keys(repair.identityBefore||{}),['sourceFingerprint'])||
    !same(Object.keys(repair.after||{}).sort(),fingerprintKeys)||
    ![...Object.values(repair.metadataBefore),...Object.values(repair.identityBefore),...Object.values(repair.after)].every(value=>SHA256.test(value||''))||
    repair.after.sourceFingerprint!==current.sourceFingerprint||repair.after.contentFingerprint!==current.contentFingerprint||
    repair.after.sourceFingerprint!==identity.sourceFingerprint||proof?.schemaVersion!=='archive-reviewed-source-reassessment-v1')return false;
  const root=fs.realpathSync(nativeSource.root);
  const refs=receipt.approval.evidenceRefs.filter(ref=>nativePath(ref?.path));
  if(refs.length!==1)return false;
  const ref=refs[0],bytes=readBytes(root,ref.path);
  if(sha(bytes)!==ref.sha256)fail('ordinary reassessment prior receipt digest changed');
  const prior=JSON.parse(bytes),old=selected(prior,identity.questionUid,ordinal);
  if(ref.path!==receiptPath(prior.requestId)||prior.requestId===receipt.requestId||prior.examUid!==receipt.examUid||
    prior.sourceArchiveFile!==receipt.sourceArchiveFile||prior.expectedQuestionCount!==receipt.expectedQuestionCount||
    // Copying the ancestor's existing review into a damaged source-only receipt
    // is not a new immutable reassessment of the changed source container.
    !reviewedContainerCarry&&proof.rendererContinuity===undefined&&(proof.reviewedSourceBlobSha1===prior.sourceBlobSha1||proof.reviewCommitSourceBlobSha1===prior.sourceBlobSha1)||
    !same(repair.metadataBefore,{sourceFingerprint:old.row.sourceFingerprint,contentFingerprint:old.row.contentFingerprint})||
    repair.identityBefore.sourceFingerprint!==old.identity.sourceFingerprint)return false;
  const without=(row,keys)=>Object.fromEntries(Object.entries(row).filter(([key])=>!keys.includes(key)));
  const metadataKeys=['sourceFingerprint','contentFingerprint','metadataRevision','approvalEvidence'];
  const runtimeKeys=[...metadataKeys,'approvedSourceFingerprint'];
  if(assertReviewedPackVersionLineage({root,current,runtime:nativeSource.runtimeRecord,
    prior:old.row,priorRuntime:old.runtime,priorReceiptRef:ref,registry})){
    metadataKeys.push('metaFoundationPackVersion');runtimeKeys.push('metaFoundationPackVersion');
  }
  let rendererBinding=null;
  if(proof.rendererContinuity!==undefined) {
    const currentSource=proof.rendererContinuity?.currentSourceRef;
    if(currentSource?.path!=='archive/exams/'+receipt.sourceArchiveFile||
      currentSource.gitBlobSha1!==receipt.sourceBlobSha1||currentSource.sha256!==receipt.sourceRawSha256||
      prior.sourceBlobSha1===receipt.sourceBlobSha1)
      fail('ordinary renderer reassessment must bind this exact new source container');
    if(nativeReviewedRendererRebind(receipt,nativeSource,question,question,identity,ordinal,current,registry)!==true)
      fail('ordinary renderer reassessment lacks a verified current proof');
    rendererBinding=reviewedRendererBindingPath(receipt.requestId);
  }
  const appended=row=>[...new Set([...row.approvalEvidence,receiptPath(receipt.requestId),...(rendererBinding?[rendererBinding]:[])])];
  if(!same(without(current,metadataKeys),without(old.row,metadataKeys))||
    !same(without(identity,['sourceFingerprint']),without(old.identity,['sourceFingerprint']))||
    !same(without(nativeSource.runtimeRecord,runtimeKeys),without(old.runtime,runtimeKeys))||
    !same(current.approvalEvidence,appended(old.row))||!same(nativeSource.runtimeRecord.approvalEvidence,appended(old.runtime)))
    fail('ordinary reassessment changed an existing approved value or provenance');
  // The renderer verifier reproduced the entire original native/source review,
  // current independent asset proof and typed sidecar. Only that issued sidecar
  // may accompany the new receipt in this otherwise unchanged approval.
  if(rendererBinding)return true;
  if(!reviewCaches.has(root))reviewCaches.set(root,new Map());
  const canonical=registry?{pt:registry.problemTypes,tpl:registry.templates}:undefined;
  const result=validateReviewedSourceReassessment({root,
    request:{scope:receipt.scope,approval:receipt.approval,sourceArchiveFile:receipt.sourceArchiveFile,
      expectedQuestionCount:receipt.expectedQuestionCount},
    patch:{questionUid:identity.questionUid,sourceOrdinal:ordinal,before:repair.metadataBefore,
      identityBefore:repair.identityBefore,after:repair.after,evidenceRefs:receipt.approval.evidenceRefs,
      sourceReview:{schemaVersion:proof.schemaVersion,reviewCommit:proof.reviewCommit,reviewPath:proof.reviewPath,reviewRef:proof.reviewRef}},
    metadata:{...current,...repair.metadataBefore},question,final:current,canonicalBefore:canonical,canonicalAfter:canonical,
    supportedFields:reviewedFields,cache:reviewCaches.get(root)});
  if(!same(result,proof))fail('ordinary reassessment differs from its immutable native proof');
  return true;
}

// This is the existing registrar rebind form, restricted here to an unchanged
// whole question in a complete renderer cohort. It transports no new native
// decision, metadata value, identity value or approval kind.
function unchangedApprovedRebindMember({patch,row,runtime,identity,oldRow,oldRuntime,oldIdentity,prior,receipt,root,priorReceiptRef,registry}) {
  const fingerprints={sourceFingerprint:oldRow.sourceFingerprint,contentFingerprint:oldRow.contentFingerprint};
  const moved=assertReviewedPackVersionLineage({root,current:row,runtime,prior:oldRow,priorRuntime:oldRuntime,priorReceiptRef,registry});
  const approved=value=>Object.fromEntries(Object.entries(unchanged(value)).filter(([key])=>!moved||key!=='metaFoundationPackVersion'));
  if(!same(Object.keys(patch).sort(),['after','identityBefore','metadataBefore','questionUid','rebind','sourceOrdinal'])||
    !Object.values(fingerprints).every(value=>SHA256.test(value||''))||
    !same(patch.metadataBefore,fingerprints)||!same(patch.after,fingerprints)||
    !same(patch.identityBefore,{sourceFingerprint:oldIdentity.sourceFingerprint})||
    !same(patch.rebind,{priorSourceBlobSha1:prior.sourceBlobSha1,priorContentFingerprint:oldRow.contentFingerprint})||
    !same(approved(row),approved(oldRow))||!same(approved(runtime),approved(oldRuntime))||
    !same(identity,oldIdentity))return false;
  const appended=before=>[...new Set([...before.approvalEvidence,receiptPath(receipt.requestId)])];
  return same(row.approvalEvidence,appended(oldRow))&&same(runtime.approvalEvidence,appended(oldRuntime));
}

// A mixed current-renderer reassessment retains the exact prior selected cohort.
// Its unchanged members still use their original native verifier and actual old
// Git question; only the changed members receive the current renderer witness.
// This does not permit a subset source-only receipt or a copied old renderer.
function unchangedMemberOfRendererReassessment({receipt,nativeSource,question,identity,ordinal,current,registry,state,revalidateLeaf}) {
  if(Object.hasOwn(receipt.approval,'sourceRebind')||Object.hasOwn(receipt,'newMetadataApprovals')||
    Object.hasOwn(receipt,'preservedMetadataApprovals')||!absentOrEmpty(receipt.registryChanges)||
    !absentOrEmpty(receipt.nativeParentBindings)||!Array.isArray(receipt.fingerprintRepairs))return false;
  const root=fs.realpathSync(nativeSource.root),bindingPath=reviewedRendererBindingPath(receipt.requestId);
  const rendererClaimed=receipt.fingerprintRepairs.some(r=>r.sourceReview?.rendererContinuity!==undefined)||
    receipt.outputDigests?.some(row=>row.path===bindingPath)||
    [...state.records.values(),...state.runtimes.values()].some(row=>row.approvalEvidence?.includes(bindingPath))||
    fs.existsSync(safePath(root,bindingPath))||receipt.approval.evidenceRefs.some(ref=>{
      const bytes=readBytes(root,ref.path);if(sha(bytes)!==ref.sha256)fail('mixed renderer evidence changed');
      let doc;try{doc=JSON.parse(bytes);}catch{return false;}
      return doc?.schemaVersion==='archive-reviewed-renderer-continuity-evidence-v1'&&
        doc.sourceArchiveFile===receipt.sourceArchiveFile&&Array.isArray(doc.items)&&doc.items.some(row=>
          row.currentSourceRef?.path==='archive/exams/'+receipt.sourceArchiveFile&&
          row.currentSourceRef.gitBlobSha1===receipt.sourceBlobSha1&&row.currentSourceRef.sha256===receipt.sourceRawSha256);
    });
  if(!rendererClaimed)return false;
  const repairs=unique(receipt.fingerprintRepairs,'reassessment repair');
  if(repairs.get(identity.questionUid)?.sourceReview?.rendererContinuity!==undefined)return false;
  const refs=receipt.approval.evidenceRefs.filter(ref=>nativePath(ref?.path));
  if(refs.length!==1||!SHA256.test(refs[0].sha256||''))fail('mixed reassessment requires one exact prior receipt');
  const raw=readBytes(root,refs[0].path);if(sha(raw)!==refs[0].sha256)fail('mixed reassessment prior receipt changed');
  const prior=JSON.parse(raw),old=selected(prior,identity.questionUid,ordinal);
  if(refs[0].path!==receiptPath(prior.requestId)||prior.requestId===receipt.requestId||prior.examUid!==receipt.examUid||
    prior.sourceArchiveFile!==receipt.sourceArchiveFile||prior.expectedQuestionCount!==receipt.expectedQuestionCount||
    prior.partialUidCount!==receipt.partialUidCount||prior.sourceBlobSha1===receipt.sourceBlobSha1||
    !same([...old.records.keys()].sort(),[...state.records.keys()].sort())||
    !same([...repairs.keys()].sort(),[...state.records.keys()].sort()))fail('mixed reassessment must retain the entire prior selected cohort');
  const beforeSource=gitSource(root,prior.sourceBlobSha1,prior.sourceRawSha256,prior.expectedQuestionCount);
  if(!same(question,beforeSource.bank[ordinal-1]))return false;
  let currentRendererCount=0;
  for(const [uid,row]of state.records) {
    const oldRow=old.records.get(uid),patch=repairs.get(uid),q=nativeSource.bank[row.sourceOrdinal-1];
    if(row.sourceOrdinal!==oldRow.sourceOrdinal||patch.sourceOrdinal!==row.sourceOrdinal)
      fail('mixed reassessment ordinal changed');
    const renderer=patch.sourceReview?.rendererContinuity!==undefined;
    if(!renderer&&!same(q,beforeSource.bank[row.sourceOrdinal-1]))fail('changed member lacks a current renderer review');
    const retained=!renderer&&patch.sourceReview===undefined&&patch.rebind!==undefined;
    const verified=retained?unchangedApprovedRebindMember({patch,row,runtime:state.runtimes.get(uid),
      identity:state.identities.get(uid),oldRow,oldRuntime:old.runtimes.get(uid),oldIdentity:old.identities.get(uid),prior,receipt,
      root,priorReceiptRef:refs[0],registry}):
      ordinaryReviewedReassessment({receipt,nativeSource:{...nativeSource,runtimeRecord:state.runtimes.get(uid)},
        question:q,identity:state.identities.get(uid),ordinal:row.sourceOrdinal,current:row,registry,reviewedContainerCarry:!renderer});
    if(!verified)fail('mixed reassessment member lacks an exact approved-value continuation');
    if(renderer)currentRendererCount++;
  }
  if(!currentRendererCount)fail('mixed reassessment has no current renderer witness');
  // The unchanged member is checked inside the complete old receipt. Restore
  // only that receipt's selected identities for its historical verifier: a
  // changed renderer peer legitimately has a different current fingerprint.
  // The current identity cohort was already compared to these exact old rows.
  const identityByJoin=new Map(nativeSource.identityByJoin||[]);
  for(const row of old.identities.values())identityByJoin.set(`${row.sourceArchiveFile}#${row.sourceOrdinal}`,row);
  const identityMap=nativeSource.identityMap?{...nativeSource.identityMap,
    records:nativeSource.identityMap.records.map(row=>old.identities.get(row.questionUid)||row)}:undefined;
  const previousContext={nativeSource:{...nativeSource,...beforeSource,runtimeRecord:old.runtime,identityByJoin,
      ...(identityMap?{identityMap}:{})},
    question:beforeSource.bank[ordinal-1],current:old.row,identity:old.identity};
  if(revalidateLeaf(previousContext)!==refs[0].path)fail('unchanged mixed member original native approval cannot replay');
  const priorRepairs=(prior.fingerprintRepairs||[]).filter(row=>row.questionUid===identity.questionUid);
  if(priorRepairs.length>1)fail('ambiguous unchanged member original repair');
  if(priorRepairs[0]?.rebind!==undefined) {
    const original=gitSource(root,priorRepairs[0].rebind.priorSourceBlobSha1,undefined,prior.expectedQuestionCount);
    if(revalidateLeaf({...previousContext,previous:original.bank[ordinal-1]})!==refs[0].path)
      fail('unchanged member original solution repair cannot replay');
  }
  return true;
}

export function nativePreservedSourceRebind({receipt,nativeSource,question,identity,ordinal,current,registry,revalidateLeaf}) {
  if(!isPartialNativeSourcePreservation(receipt,nativeSource.root))return null;
  const root=fs.realpathSync(nativeSource.root),runtime=nativeSource.runtimeRecord;
  if(!same(JSON.parse(readBytes(root,receiptPath(receipt.requestId))),receipt))fail('current receipt bytes differ from supplied receipt');
  let cursor=receipt,state=selected(cursor,identity.questionUid,ordinal),source=nativeSource;
  if(typeof revalidateLeaf!=='function'||!same(state.row,current)||!same(state.runtime,runtime)||!same(state.identity,identity)||
    !Buffer.isBuffer(source.bytes)||!Array.isArray(source.bank)||!same(source.bank[ordinal-1],question)||
    source.bank.length!==receipt.expectedQuestionCount||blob(source.bytes)!==source.blobSha1||
    receipt.sourceBlobSha1!==source.blobSha1||receipt.sourceRawSha256!==sha(source.bytes))fail('current receipt differs from actual state');
  if(unchangedMemberOfRendererReassessment({receipt,nativeSource,question,identity,ordinal,current,registry,state,revalidateLeaf}))return true;
  // null preserves the ordinary native/student guards; this is not permission
  // to reuse changed student content or skip a renderer/typed-source verifier.
  if(ordinaryReviewedReassessment({receipt,nativeSource,question,identity,ordinal,current,registry}))return null;
  const seen=new Set();
  while(isPartialNativeSourcePreservation(cursor,root)&&!ordinaryReviewedReassessment({receipt:cursor,nativeSource:source,
    question:source.bank[ordinal-1],identity:state.identity,ordinal,current:state.row,registry})) {
    if(unchangedMemberOfRendererReassessment({receipt:cursor,nativeSource:source,question:source.bank[ordinal-1],
      identity:state.identity,ordinal,current:state.row,registry,state,revalidateLeaf}))break;
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
