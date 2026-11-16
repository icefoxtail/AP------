// Read-only authentication of one already published source-preservation child.
// This sidecar never creates a request, changes a receipt, or grants an approval.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const ISSUED_CHILD_CONTINUITY_SCHEMA = 'archive-native-issued-child-continuity-v1';
export const ISSUED_CHILD_CONTINUITY_DIRECTORY = 'archive/data/meta-foundation/evidence/native-issued-child-continuity/v1/';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const META = 'archive/data/question_metadata.json', IDS = 'archive/data/question_identity_map.json';
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/, SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const KINDS = new Set(['RPM_UNCHANGED_FP0', 'SOLUTION_REBIND_FP1']);
const stable = value => JSON.stringify(value, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(key => [key, x[key]])) : x);
const same = (a,b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const keys = (value, expected) => object(value) && same(Object.keys(value).sort(), [...expected].sort());
const empty = value => value === undefined || Array.isArray(value) && !value.length;
const need = (condition, message) => { if (!condition) throw Error(`issued child continuity: ${message}`); };
const contexts = new WeakMap(), immutable = new Map(), published = new Map(), selectedTables = new Map();

function safe(root, relative) {
  need(typeof relative === 'string' && relative && !path.isAbsolute(relative) && !/[\\\x00-\x1f]/.test(relative)
    && relative.split('/').every(part => part && part !== '.' && part !== '..'), 'unsafe input path');
  const full = path.resolve(root, relative), base = path.resolve(root);
  for (let cursor = full; cursor !== base; cursor = path.dirname(cursor))
    need(!fs.existsSync(cursor) || !fs.lstatSync(cursor).isSymbolicLink(), 'symlink input');
  return full;
}
function read(root, relative) {
  const full = safe(root, relative);
  need(fs.existsSync(full) && fs.statSync(full).isFile(), 'regular input missing');
  return fs.readFileSync(full);
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { throw Error('issued child continuity: invalid JSON'); } }
function git(root, args) {
  try { return execFileSync('git', args, { cwd:root, env:{...process.env,GIT_NO_LAZY_FETCH:'1'},
    maxBuffer:192*1024*1024, stdio:['ignore','pipe','pipe'] }); }
  catch { throw Error(`issued child continuity: immutable Git input unavailable: ${args[0]}`); }
}
function gitFile(root, commit, relative, retain = true) {
  safe(root, relative); need(SHA1.test(commit || ''), 'exact published commit required');
  const key = `${root}:${commit}:${relative}`;
  if (retain && immutable.has(key)) return immutable.get(key);
  need(git(root,['rev-parse','--verify',`${commit}^{commit}`]).toString().trim() === commit, 'published commit mismatch');
  const entry = git(root,['ls-tree','-z',commit,'--',relative]).toString();
  need(/^100644 blob [a-f0-9]{40}\t[^\0]+\0$/.test(entry)
    && entry.slice(entry.indexOf('\t')+1,-1) === relative, 'published regular file required');
  const gitBlobSha1 = entry.slice(0,entry.indexOf('\t')).split(' ')[2];
  const bytes = git(root,['cat-file','blob',gitBlobSha1]);
  need(blob(bytes) === gitBlobSha1, 'published blob digest mismatch');
  const result = {bytes,gitBlobSha1,sha256:sha(bytes)};
  if (retain) immutable.set(key,result);
  return result;
}
function sourceBank(bytes) {
  const context={window:{},console:{log(){},warn(){},error(){}}};
  try { vm.runInNewContext(bytes.toString(),context,{timeout:5000}); }
  catch { throw Error('issued child continuity: source bank invalid'); }
  const rows=context.window.questionBank||context.window.questions||context.questions||context.questionBank||context.window.examData?.questions;
  need(Array.isArray(rows)&&rows.length,'source bank missing');
  return JSON.parse(JSON.stringify(rows));
}
function one(rows,uid,label) {
  need(Array.isArray(rows),`${label} records missing`);
  const matches=rows.filter(row=>row?.questionUid===uid);
  need(matches.length===1,`${label} selected UID missing or ambiguous`);return matches[0];
}
function exactRef(ref) { return keys(ref,['path','sha256']) && SHA256.test(ref.sha256||'') && typeof ref.path==='string'; }
function receiptState(receipt,uid,ordinal) {
  need(receipt?.schemaVersion==='archive-reviewed-exam-meta-registration-v2' && ID.test(receipt.requestId||'')
    && receipt.metadataRegistrationStatus==='REGISTERED' && SHA256.test(receipt.requestSha256||'')
    && receipt.scope==='PARTIAL_UIDS' && receipt.partialUidCount===1 && receipt.totalQuestions===1
    && Number.isSafeInteger(receipt.expectedQuestionCount) && receipt.expectedQuestionCount>1
    && receipt.registrationMode===undefined && receipt.approval?.type==='FINAL_QA'
    && receipt.approval.metadataReviewed===true && typeof receipt.approval.approvedBy==='string'
    && receipt.approval.approvedBy.trim(),'one-UID issued FINAL_QA receipt required');
  for(const name of ['appliedRecords','appliedIdentityRecords','runtimeRecords'])
    need(receipt[name]?.length===1 && receipt[name][0].questionUid===uid
      && receipt[name][0].sourceOrdinal===ordinal && receipt[name][0].sourceArchiveFile===receipt.sourceArchiveFile,
    `receipt ${name} scope changed`);
  const result={current:receipt.appliedRecords[0],identity:receipt.appliedIdentityRecords[0],runtimeRecord:receipt.runtimeRecords[0]};
  need(result.current.metadataApprovalType==='FINAL_QA' && result.runtimeRecord.metadataApprovalType==='FINAL_QA','selected approval type changed');
  return result;
}
function runtimePath(state) {
  const owner=state.current.metaFoundationPackId;
  need(/^[A-Z][A-Z0-9_]*$/.test(owner||''),'runtime owner invalid');
  return `archive/data/meta-foundation/runtime/${owner.toLowerCase().replaceAll('_','-')}-v1.json`;
}
function selectedTable(bytes,uid,label) {
  // Re-read and hash live bytes every time. Only the selected parsed row is
  // cached by exact bytes; a changed file cannot reuse a previous parse result.
  const key=sha(bytes)+':'+uid;
  if(!selectedTables.has(key)) {
    const doc=parse(bytes);
    selectedTables.set(key,{row:one(doc.records,uid,label),packId:doc.packId,status:doc.status});
  }
  return selectedTables.get(key);
}
function tables(root, uid, state, readFile) {
  const metadata=selectedTable(readFile(META),uid,'metadata'), identities=selectedTable(readFile(IDS),uid,'identity'),
    runtime=selectedTable(readFile(runtimePath(state)),uid,'runtime');
  need(runtime.packId===state.current.metaFoundationPackId && runtime.status==='ACTIVE','runtime authority changed');
  return {current:metadata.row,identity:identities.row,runtimeRecord:runtime.row};
}
function publishedState(root,commit,uid,state) {
  const key=`${root}:${commit}:${uid}:${runtimePath(state)}`;
  if(!published.has(key)) published.set(key,tables(root,uid,state,relative=>gitFile(root,commit,relative,false).bytes));
  return published.get(key);
}
function freeze(value) {
  if(value&&typeof value==='object') { for(const child of Object.values(value))freeze(child);Object.freeze(value); }
  return value;
}
function live(h) {
  need(sha(read(h.root,h.sidecarPath))===h.sidecarSha256,'sidecar bytes changed');
  need(sha(read(h.root,h.sidecar.childReceiptRef.path))===h.sidecar.childReceiptRef.sha256
    && sha(read(h.root,h.sidecar.priorReceiptRef.path))===h.sidecar.priorReceiptRef.sha256,'receipt bytes changed');
  const bytes=read(h.root,h.sourcePath);
  need(blob(bytes)===h.receipt.sourceBlobSha1 && sha(bytes)===h.receipt.sourceRawSha256
    && same(sourceBank(bytes)[h.sidecar.sourceOrdinal-1],h.wholeQuestion),'live source changed');
  need(same(tables(h.root,h.sidecar.questionUid,h.state,relative=>read(h.root,relative)),h.state),'live selected tables changed');
}

// No caller can supply a marker in place of a published sidecar. Discovery is
// deterministic and absence leaves the ordinary strict native path untouched.
export function loadIssuedChildContinuity({root,receipt,nativeSource,current,identity,ordinal,headSha}) {
  if(!ID.test(receipt?.requestId||''))return null;
  root=fs.realpathSync(root);
  const sidecarPath=ISSUED_CHILD_CONTINUITY_DIRECTORY+receipt.requestId+'.json';
  if(!fs.existsSync(safe(root,sidecarPath)))return null;
  need(!nativeSource?.issuedRpmHistoryContext && !nativeSource?.issuedSolutionRpmHistoryContext
    && !nativeSource?.issuedChildContinuityContext,'mixed historical contexts');
  const sidecarBytes=read(root,sidecarPath),sidecar=parse(sidecarBytes);
  const required=['schemaVersion','kind','questionUid','sourceArchiveFile','sourceOrdinal','expectedQuestionCount',
    'childReceiptRef','childPublishedCommit','priorReceiptRef','priorPublishedCommit'];
  need(keys(sidecar,sidecar.kind==='SOLUTION_REBIND_FP1'?[...required,'imageProof']:required)
    && sidecar.schemaVersion===ISSUED_CHILD_CONTINUITY_SCHEMA && KINDS.has(sidecar.kind),'closed sidecar schema required');
  need(typeof sidecar.questionUid==='string' && sidecar.questionUid && Number.isSafeInteger(sidecar.sourceOrdinal)
    && sidecar.sourceOrdinal===ordinal && ordinal>0 && ordinal<=sidecar.expectedQuestionCount
    && /^original\/middle\/m2\/(1mid|1final)\/[^/]+\.js$/.test(sidecar.sourceArchiveFile||''),'sidecar M2S1 scope invalid');
  need(exactRef(sidecar.childReceiptRef) && sidecar.childReceiptRef.path===RECEIPTS+receipt.requestId+'.json'
    && exactRef(sidecar.priorReceiptRef) && sidecar.priorReceiptRef.path.startsWith(RECEIPTS)
    && sidecar.priorReceiptRef.path.endsWith('.json') && SHA1.test(sidecar.childPublishedCommit||'')
    && SHA1.test(sidecar.priorPublishedCommit||''),'exact published receipt references required');
  if(sidecar.kind==='SOLUTION_REBIND_FP1')need(keys(sidecar.imageProof,['sourceCommit','assetRef'])
    && SHA1.test(sidecar.imageProof.sourceCommit||'') && exactRef(sidecar.imageProof.assetRef)
    && /^archive\/assets\/images\/[^/?#%]+\/[^/?#%]+\.png$/.test(sidecar.imageProof.assetRef.path),
  'exact original PNG proof required');
  const head=git(root,['rev-parse','HEAD']).toString().trim();
  need(SHA1.test(head) && (headSha===undefined || headSha===head),'current HEAD mismatch');
  git(root,['merge-base','--is-ancestor',sidecar.childPublishedCommit,head]);
  git(root,['merge-base','--is-ancestor',sidecar.priorPublishedCommit,sidecar.childPublishedCommit]);
  const publishedChild=gitFile(root,sidecar.childPublishedCommit,sidecar.childReceiptRef.path);
  const actualChild=read(root,sidecar.childReceiptRef.path);
  need(publishedChild.sha256===sidecar.childReceiptRef.sha256 && actualChild.equals(publishedChild.bytes)
    && same(parse(actualChild),receipt),'actual published child receipt mismatch');
  need(receipt.sourceArchiveFile===sidecar.sourceArchiveFile && receipt.expectedQuestionCount===sidecar.expectedQuestionCount
    && receipt.newMetadataApprovals===0 && receipt.preservedMetadataApprovals===1
    && empty(receipt.registryChanges) && empty(receipt.fingerprintRepairs) && empty(receipt.nativeParentBindings)
    && keys(receipt.approval,['type','metadataReviewed','approvedBy','evidenceRefs','sourceRebind'])
    && keys(receipt.approval.sourceRebind,['priorReceiptRef'])
    && same(receipt.approval.sourceRebind.priorReceiptRef,sidecar.priorReceiptRef),'exact existing source-only child required');
  const state=receiptState(receipt,sidecar.questionUid,ordinal);
  need(same({current,identity,runtimeRecord:nativeSource?.runtimeRecord},state),'supplied actual child state changed');
  need(nativeSource.root===root && nativeSource.runtimeStatus==='ACTIVE' && Buffer.isBuffer(nativeSource.bytes)
    && nativeSource.blobSha1===receipt.sourceBlobSha1 && blob(nativeSource.bytes)===receipt.sourceBlobSha1
    && sha(nativeSource.bytes)===receipt.sourceRawSha256 && Array.isArray(nativeSource.bank)
    && nativeSource.bank.length===receipt.expectedQuestionCount
    && same(sourceBank(nativeSource.bytes),JSON.parse(JSON.stringify(nativeSource.bank))),'supplied current source changed');
  const sourcePath='archive/exams/'+receipt.sourceArchiveFile,childSource=gitFile(root,sidecar.childPublishedCommit,sourcePath);
  need(childSource.bytes.equals(nativeSource.bytes) && childSource.gitBlobSha1===receipt.sourceBlobSha1
    && childSource.sha256===receipt.sourceRawSha256,'published child source differs');
  need(same(publishedState(root,sidecar.childPublishedCommit,sidecar.questionUid,state),state),'child was not actual published selected state');
  const priorBytes=read(root,sidecar.priorReceiptRef.path),publishedPrior=gitFile(root,sidecar.priorPublishedCommit,sidecar.priorReceiptRef.path);
  need(sha(priorBytes)===sidecar.priorReceiptRef.sha256 && priorBytes.equals(publishedPrior.bytes),'actual published prior receipt mismatch');
  const prior=parse(priorBytes),old=receiptState(prior,sidecar.questionUid,ordinal);
  need(sidecar.priorReceiptRef.path===RECEIPTS+prior.requestId+'.json' && prior.requestId!==receipt.requestId
    && prior.sourceArchiveFile===receipt.sourceArchiveFile && prior.examUid===receipt.examUid
    && prior.expectedQuestionCount===receipt.expectedQuestionCount && prior.approval.sourceRebind===undefined
    && prior.approval.rendererPreservation===undefined,'ordinary original leaf scope changed');
  need(same(publishedState(root,sidecar.priorPublishedCommit,sidecar.questionUid,old),old),'original leaf was not actual published selected state');
  const evidence=[...new Set([...old.current.approvalEvidence,sidecar.childReceiptRef.path])];
  const revision=`meta-foundation:${old.current.metaFoundationPackId}@${old.current.metaFoundationPackVersion}:exam-final_qa-v2:${receipt.requestId}`;
  need(same(state.current,{...old.current,approvalEvidence:evidence,metadataRevision:revision})
    && same(state.runtimeRecord,{...old.runtimeRecord,approvalEvidence:evidence,metadataRevision:revision})
    && same(state.identity,old.identity),'original selected authority or values changed');
  const originalSource=gitFile(root,sidecar.priorPublishedCommit,sourcePath),originalBank=sourceBank(originalSource.bytes);
  need(originalSource.gitBlobSha1===prior.sourceBlobSha1 && originalSource.sha256===prior.sourceRawSha256
    && originalBank.length===prior.expectedQuestionCount && !originalSource.bytes.equals(childSource.bytes)
    && same(originalBank[ordinal-1],nativeSource.bank[ordinal-1]),'original selected whole question changed');
  need(Array.isArray(receipt.approval.evidenceRefs) && receipt.approval.evidenceRefs.length
    && receipt.approval.evidenceRefs.some(ref=>same(ref,sidecar.priorReceiptRef)),'child evidence missing');
  const seen=new Set();
  for(const ref of receipt.approval.evidenceRefs) {
    need(exactRef(ref) && !seen.has(ref.path),'invalid or duplicate child evidence');seen.add(ref.path);
    need(sha(read(root,ref.path))===ref.sha256 && gitFile(root,sidecar.childPublishedCommit,ref.path).sha256===ref.sha256,'published child evidence changed');
  }
  const h={root,sidecarPath,sidecarSha256:sha(sidecarBytes),sidecar:freeze(structuredClone(sidecar)),
    receipt:freeze(structuredClone(receipt)),state:freeze(structuredClone(state)),sourcePath,
    wholeQuestion:freeze(structuredClone(nativeSource.bank[ordinal-1]))};
  live(h);
  const descriptor=freeze({schemaVersion:ISSUED_CHILD_CONTINUITY_SCHEMA,sidecarRef:{path:sidecarPath,sha256:h.sidecarSha256},
    kind:sidecar.kind,questionUid:sidecar.questionUid,sourceOrdinal:ordinal,
    childReceiptRef:sidecar.childReceiptRef,childPublishedCommit:sidecar.childPublishedCommit,
    priorReceiptRef:sidecar.priorReceiptRef,priorPublishedCommit:sidecar.priorPublishedCommit,
    childReceiptGitBlobSha1:publishedChild.gitBlobSha1,priorReceiptGitBlobSha1:publishedPrior.gitBlobSha1,
    currentWholeQuestionSha256:sha(stable(h.wholeQuestion)),newMetadataApprovals:0,preservedMetadataApprovals:1});
  const context=Object.freeze({descriptor});contexts.set(context,h);return context;
}

// Only a token from this module instance may provide options to the separate
// FP0/FP1 validators. Returning fresh data cannot mutate the private context.
export function readIssuedChildContinuity(context,{root,receipt,kind}={}) {
  const h=contexts.get(context);need(h,'authenticated child context required');
  need((root===undefined||fs.realpathSync(root)===h.root) && (receipt===undefined||same(receipt,h.receipt))
    && (kind===undefined||kind===h.sidecar.kind),'child context mismatch');
  live(h);return structuredClone({sidecar:h.sidecar,receipt:h.receipt,state:h.state});
}
