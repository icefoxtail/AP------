// Preserve four unchanged E032 questions without promoting their three changed
// neighbours. The original seven-question receipt remains an immutable ancestor.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const SOURCE='original/middle/m2/2final/22_풍덕중_2학기_기말_중2_기출.js';
const PRIOR_ID='m2s2-binding68-20261115-E032';
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SELECTED=Object.freeze([
  ['qid_v1_f288a19bf33c38b84c2c2436478bfba2bafd4b275fa60568af686eeab5732363',2],
  ['qid_v1_9172cf1ec90c0cc3af91cab63dcfa4b68fa61065882343e82812a4d86d780f85',3],
  ['qid_v1_bed808c0cecc90e30621de4a5b961290d1ce0b95e943d07155962ed483cc39c8',4],
  ['qid_v1_df579118439a5d43dc8408f65e435810dd1ef11b29053720e135ca1120ec50f0',5]
].map(Object.freeze));
const EXCLUDED=Object.freeze([
  ['qid_v1_45204c832c0632b1cad11ec4c9e766abfddf38680628e9af0beb70538e68ece7',6],
  ['qid_v1_9ec4baa4cded9d949b8ca60ced0a095a03b5d438f48f1a57fde1cc7dfeb956d6',7],
  ['qid_v1_7a44e50d6c7fb8fddcd4b1791abe9bd4987c5e1dc4d6e6aafca725c7c62a7f6a',9]
].map(Object.freeze));
const ALL=Object.freeze([...SELECTED,...EXCLUDED]);
const ID=/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/;
const SHA1=/^[a-f0-9]{40}$/,SHA256=/^[a-f0-9]{64}$/;
const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)
  ?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const same=(a,b)=>stable(a)===stable(b);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const fail=message=>{throw Error(`PARTIAL_SUBSET_PRESERVATION:${message}`);};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const keys=(value,expected)=>object(value)&&same(Object.keys(value).sort(),[...expected].sort());
const empty=value=>value===undefined||Array.isArray(value)&&value.length===0;
const core=row=>Object.fromEntries(Object.entries(row).filter(([k])=>!['metadataRevision','approvalEvidence'].includes(k)));

function safePath(root,relative) {
  if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||relative.includes('\\')||
    /[\x00-\x1f]/.test(relative)||relative.split('/').some(p=>!p||p==='.'||p==='..'))fail('UNSAFE_PATH');
  const base=path.resolve(root),full=path.resolve(base,relative);
  for(let p=full;p!==base;p=path.dirname(p))
    if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())fail('SYMLINK_PATH');
  return full;
}
const read=(root,relative)=>fs.readFileSync(safePath(root,relative));
function gitFile(root,commit,relative) {
  safePath(root,relative);
  if(!SHA1.test(commit||''))fail('FIXED_GIT_COMMIT_REQUIRED');
  try {
    return execFileSync('git',['show',`${commit}:${relative}`],{
      cwd:root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']
    });
  }catch {fail('FIXED_GIT_INPUT_UNAVAILABLE');}
}
function sourceBank(bytes) {
  if(!Buffer.isBuffer(bytes))fail('SOURCE_BYTES_REQUIRED');
  const box={window:{}};
  try {vm.runInNewContext(bytes.toString('utf8'),box,{timeout:1000});}
  catch {fail('SOURCE_PARSE');}
  const bank=JSON.parse(JSON.stringify(box.window.questionBank));
  if(!Array.isArray(bank)||bank.length!==24)fail('SOURCE_DENOMINATOR');
  return bank;
}
function unique(rows,label) {
  if(!Array.isArray(rows))fail(`${label}_ROWS`);
  const out=new Map();
  for(const row of rows) {
    if(!object(row)||typeof row.questionUid!=='string'||out.has(row.questionUid))fail(`${label}_UID_DUPLICATE_OR_MISSING`);
    out.set(row.questionUid,row);
  }
  return out;
}
function exactRows(rows,pairs,label) {
  const result=unique(rows,label);
  if(result.size!==pairs.length||!pairs.every(([uid,ordinal])=>{
    const row=result.get(uid);
    return row?.sourceArchiveFile===SOURCE&&row.sourceOrdinal===ordinal;
  }))fail(`${label}_SCOPE`);
  return result;
}
function evidence(root,refs) {
  if(!Array.isArray(refs)||!refs.length)fail('EVIDENCE_REQUIRED');
  const seen=new Set();
  for(const ref of refs) {
    if(!keys(ref,['path','sha256'])||!SHA256.test(ref.sha256||'')||seen.has(ref.path)||sha(read(root,ref.path))!==ref.sha256)
      fail('EVIDENCE_CHANGED');
    seen.add(ref.path);
  }
}
function assetFree(value) {
  if(typeof value==='string')return !/(?:<\s*(?:img|svg|object|iframe|canvas)\b|\bsrcset\s*=|\burl\s*\(|(?:archive\/)?assets\/|data:image\/)/i.test(value);
  if(Array.isArray(value))return value.every(assetFree);
  if(object(value)) {
    for(const [key,child] of Object.entries(value)) {
      if(['image','images','svg','figureSvg','solutionImage','solutionImages','solutionFigureSvg'].includes(key)&&
        child!==undefined&&child!==null&&child!==''&&!(Array.isArray(child)&&child.length===0))return false;
      if(!assetFree(child))return false;
    }
  }
  return true;
}

export function isPartialSubsetPreservation(envelope) {
  return envelope?.approval?.sourceRebind?.schemaVersion==='archive-native-partial-subset-preservation-v1';
}

// This detects an obligation only; it never validates or grants native authority.
// The immutable original path remains in all four issued metadata/runtime rows
// even if sourceRebind, count markers and the top-level prior ref are deleted.
export function hasPartialSubsetPreservationFingerprint(receipt) {
  if(receipt?.sourceArchiveFile!==SOURCE||receipt.requestId===PRIOR_ID||!ID.test(receipt.requestId||'')||
    receipt.scope!=='PARTIAL_UIDS'||receipt.expectedQuestionCount!==24)return false;
  return ['appliedRecords','runtimeRecords'].every(key=>{
    const rows=receipt[key];
    return Array.isArray(rows)&&rows.length===4&&SELECTED.every(([uid,ordinal])=>{
      const matches=rows.filter(row=>row?.questionUid===uid);
      return matches.length===1&&matches[0].sourceOrdinal===ordinal&&matches[0].sourceArchiveFile===SOURCE&&
        Array.isArray(matches[0].approvalEvidence)&&matches[0].approvalEvidence.includes(RECEIPTS+PRIOR_ID+'.json');
    });
  });
}

export function validatePartialSubsetPreservation({root,envelope,prior,bytes,bank,metadata,identities,runtime,mode}) {
  if(!['request','receipt'].includes(mode)||envelope?.schemaVersion!==(mode==='request'
    ?'archive-reviewed-exam-meta-register-request-v2':'archive-reviewed-exam-meta-registration-v2')||!isPartialSubsetPreservation(envelope))
    fail('TYPED_ENVELOPE_REQUIRED');
  const spec=envelope.approval.sourceRebind;
  if(!keys(spec,['schemaVersion','priorCommit','currentCommit','priorReceiptRef','selectedQuestionUids','excludedQuestionUids'])||
    !same(spec.selectedQuestionUids,SELECTED.map(([uid])=>uid))||!same(spec.excludedQuestionUids,EXCLUDED.map(([uid])=>uid)))
    fail('EXACT_FOUR_AND_THREE_PARTITION_REQUIRED');
  if(envelope.sourceArchiveFile!==SOURCE||envelope.scope!=='PARTIAL_UIDS'||envelope.expectedQuestionCount!==24||
    envelope.registrationMode!==undefined||!ID.test(envelope.requestId||'')||envelope.requestId===PRIOR_ID||
    !keys(envelope.approval,['type','metadataReviewed','approvedBy','evidenceRefs','sourceRebind'])||
    envelope.approval.type!=='FINAL_QA'||envelope.approval.metadataReviewed!==true||
    !String(envelope.approval.approvedBy||'').trim()||!Array.isArray(envelope.registryChanges)||envelope.registryChanges.length)
    fail('SOURCE_ONLY_SCOPE_REQUIRED');
  const priorPath=RECEIPTS+PRIOR_ID+'.json',ref=spec.priorReceiptRef;
  if(!keys(ref,['path','sha256'])||ref.path!==priorPath||!SHA256.test(ref.sha256||'')||
    !envelope.approval.evidenceRefs?.some(item=>same(item,ref)))fail('CANONICAL_ORIGINAL_RECEIPT_REQUIRED');
  evidence(root,envelope.approval.evidenceRefs);
  const raw=read(root,priorPath),historical=gitFile(root,spec.priorCommit,priorPath),stillPublished=gitFile(root,spec.currentCommit,priorPath);
  if(sha(raw)!==ref.sha256||!raw.equals(historical)||!raw.equals(stillPublished)||!same(JSON.parse(raw),prior))
    fail('ORIGINAL_RECEIPT_CHANGED');
  if(prior.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||prior.metadataRegistrationStatus!=='REGISTERED'||
    prior.requestId!==PRIOR_ID||prior.sourceArchiveFile!==SOURCE||prior.examUid!==envelope.examUid||
    prior.scope!=='PARTIAL_UIDS'||prior.registrationMode!==undefined||prior.expectedQuestionCount!==24||
    prior.partialUidCount!==7||prior.totalQuestions!==7||prior.approval?.type!=='FINAL_QA'||
    prior.approval.metadataReviewed!==true||!String(prior.approval.approvedBy||'').trim()||!SHA256.test(prior.requestSha256||'')||
    prior.approval.sourceRebind!==undefined||prior.approval.rendererPreservation!==undefined||
    !empty(prior.fingerprintRepairs)||!empty(prior.nativeParentBindings))fail('ORIGINAL_SEVEN_AUTHORITY_REQUIRED');
  evidence(root,prior.approval.evidenceRefs);
  const oldRecords=exactRows(prior.appliedRecords,ALL,'ORIGINAL_METADATA'),oldIds=exactRows(prior.appliedIdentityRecords,ALL,'ORIGINAL_IDENTITY'),
    oldRuntime=exactRows(prior.runtimeRecords,ALL,'ORIGINAL_RUNTIME');
  for(const [uid,ordinal] of ALL) {
    const row=oldRecords.get(uid),rt=oldRuntime.get(uid),revision=`meta-foundation:${row.metaFoundationPackId}@${row.metaFoundationPackVersion}:exam-final_qa-v2:${PRIOR_ID}`;
    if(row.metaFoundationPackId!=='MIDDLE2'||row.metaFoundationPackVersion!=='1.0.3'||row.metadataApprovalType!=='FINAL_QA'||
      rt.metadataApprovalType!=='FINAL_QA'||row.metadataRevision!==revision||rt.metadataRevision!==revision||
      !Array.isArray(row.approvalEvidence)||!row.approvalEvidence.includes(priorPath)||!same(row.approvalEvidence,rt.approvalEvidence)||
      rt.sourceIdentity!==`${SOURCE}#${ordinal}`)fail('ORIGINAL_ROW_AUTHORITY_CHANGED');
  }
  const priorBytes=gitFile(root,spec.priorCommit,'archive/exams/'+SOURCE),priorBank=sourceBank(priorBytes);
  if(blob(priorBytes)!==prior.sourceBlobSha1||sha(priorBytes)!==prior.sourceRawSha256)fail('ORIGINAL_SOURCE_CHANGED');
  const currentBytes=gitFile(root,spec.currentCommit,'archive/exams/'+SOURCE),currentBank=sourceBank(currentBytes);
  if(!Buffer.isBuffer(bytes)||!bytes.equals(currentBytes)||!same(bank,currentBank)||currentBytes.equals(priorBytes))
    fail('CURRENT_SOURCE_CHANGED');
  if(mode==='request'?envelope.expectedSourceBlobSha1!==blob(bytes)
    :envelope.sourceBlobSha1!==blob(bytes)||envelope.sourceRawSha256!==sha(bytes))fail('CURRENT_SOURCE_PIN_CHANGED');
  const rows=unique(metadata,'LIVE_METADATA'),ids=unique(identities,'LIVE_IDENTITY'),runtimes=unique(runtime,'LIVE_RUNTIME');
  if(mode==='request') {
    const items=unique(envelope.items,'REQUEST');
    if(items.size!==4||!SELECTED.every(([uid,ordinal])=>{
      const item=items.get(uid);
      return keys(item,['questionUid','sourceOrdinal','before','after','reason','evidenceRefs'])&&item.sourceOrdinal===ordinal&&
        keys(item.before,[])&&keys(item.after,[])&&String(item.reason||'').trim()&&item.evidenceRefs?.some(r=>same(r,ref));
    }))fail('EMPTY_PATCHES_EXACT_FOUR_REQUIRED');
    for(const item of items.values())evidence(root,item.evidenceRefs);
  } else {
    if(envelope.metadataRegistrationStatus!=='REGISTERED'||envelope.totalQuestions!==4||envelope.partialUidCount!==4||
      envelope.newMetadataApprovals!==0||envelope.preservedMetadataApprovals!==4||!SHA256.test(envelope.requestSha256||'')||
      !empty(envelope.fingerprintRepairs)||!empty(envelope.nativeParentBindings))fail('ISSUED_FOUR_ZERO_NEW_REQUIRED');
    const issuedRows=exactRows(envelope.appliedRecords,SELECTED,'ISSUED_METADATA'),issuedIds=exactRows(envelope.appliedIdentityRecords,SELECTED,'ISSUED_IDENTITY'),
      issuedRuntime=exactRows(envelope.runtimeRecords,SELECTED,'ISSUED_RUNTIME');
    for(const [uid] of SELECTED)if(!same(rows.get(uid),issuedRows.get(uid))||!same(ids.get(uid),issuedIds.get(uid))||
      !same(runtimes.get(uid),issuedRuntime.get(uid)))fail('ISSUED_CURRENT_STATE_CHANGED');
  }
  for(const [uid,ordinal] of SELECTED) {
    const before=oldRecords.get(uid),beforeRuntime=oldRuntime.get(uid),row=rows.get(uid),rt=runtimes.get(uid);
    if(!same(priorBank[ordinal-1],bank[ordinal-1])||!assetFree(bank[ordinal-1]))fail('SELECTED_WHOLE_QUESTION_OR_ASSET_CHANGED');
    if(!same(ids.get(uid),oldIds.get(uid)))fail('SELECTED_IDENTITY_CHANGED');
    if(mode==='request') {
      if(!same(row,before)||!same(rt,beforeRuntime))fail('LIVE_ORIGINAL_AUTHORITY_CHANGED');
    } else {
      const evidenceAfter=[...new Set([...before.approvalEvidence,RECEIPTS+envelope.requestId+'.json'])];
      const revision=`meta-foundation:${before.metaFoundationPackId}@${before.metaFoundationPackVersion}:exam-final_qa-v2:${envelope.requestId}`;
      if(!object(row)||!object(rt)||!same(core(row),core(before))||!same(core(rt),core(beforeRuntime))||
        row.metadataRevision!==revision||rt.metadataRevision!==revision||!same(row.approvalEvidence,evidenceAfter)||
        !same(rt.approvalEvidence,evidenceAfter))fail('ISSUED_AUTHORITY_NOT_PRESERVED');
    }
  }
  return {priorBytes,priorBank,selectedQuestionUids:SELECTED.map(([uid])=>uid),excludedQuestionUids:EXCLUDED.map(([uid])=>uid),
    priorApprovalCount:7,preservedMetadataApprovals:4,newMetadataApprovals:0};
}
