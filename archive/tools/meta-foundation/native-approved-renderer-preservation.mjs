// Rebind independently reviewed image/imageSize changes to an existing native
// approval. The immutable FULL receipt supplies all approval values; the image
// review supplies no semantic values. This is separate from source-only reuse.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

export const APPROVED_RENDERER_PRESERVATION = 'archive-native-approved-renderer-preservation-v1';
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SHA1=/^[a-f0-9]{40}$/, SHA256=/^[a-f0-9]{64}$/;
const ID=/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/;
const ALLOWED_FIELDS=new Set(['image','imageSize']);
// Only observed producer metadata may differ in an older automatic-writer
// cursor. This cursor is never an approval source. Original/current complete
// question equality, every referenced asset and all original approval tuples
// have already been verified for UNCHANGED_WHOLE_QUESTION_AND_ASSETS.
export const UNCHANGED_CURSOR_PRODUCER_FIELDS=Object.freeze([
  'legacyLevelCompatibility','subUnitKey','subUnit','rpmPrimaryRecordId','problemTypeKey','templateKey',
  'crossConceptKeys','integrationPattern','tagConfidence','tagStatus','primaryMethod','decisiveStep',
  'rpmCrosswalkStatus','canonicalBindingStatus','runtimeMaterializationStatus','rpmSemanticStatus',
  'metaNullReason','rpmPrimaryPath',
]);
const CURSOR_PRODUCER_FIELDS=new Set(UNCHANGED_CURSOR_PRODUCER_FIELDS);
const REVIEW_STUDENT_FIELDS=['id','number','questionType','content','question','choices','answer','solution',
  'image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)
  ?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const same=(a,b)=>stable(a)===stable(b), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const clone=x=>JSON.parse(JSON.stringify(x));
const fail=m=>{throw Error('approved renderer preservation: '+m);};
// Exact terminal FULL shape validation reused from the reviewed contract.
// This private function adds no source-only/subset registration route.
const fullInventory = (rows, label) => {
  if (!Array.isArray(rows) || !rows.length) fail(label + ' inventory missing');
  const out = new Map(), ordinals = new Set();
  for (const row of rows) {
    if (typeof row?.questionUid !== 'string' || !row.questionUid || out.has(row.questionUid) ||
        !Number.isSafeInteger(row.sourceOrdinal) || row.sourceOrdinal < 1 || ordinals.has(row.sourceOrdinal))
      fail(label + ' UID/ordinal missing or duplicated');
    out.set(row.questionUid, row); ordinals.add(row.sourceOrdinal);
  }
  return out;
};
function fullNativePreservationAncestor(receipt, expectedQuestionCount) {
  if (!receipt || ['scope', 'partialUidCount', 'expectedQuestionCount', 'registrationMode'].some(key => Object.hasOwn(receipt, key)) ||
      receipt.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || receipt.metadataRegistrationStatus !== 'REGISTERED' ||
      receipt.approval?.type !== 'FINAL_QA' || receipt.approval.metadataReviewed !== true ||
      !String(receipt.approval.approvedBy || '').trim() || Object.hasOwn(receipt.approval, 'sourceRebind') ||
      receipt.newMetadataApprovals === 0 && receipt.preservedMetadataApprovals > 0 ||
      !/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(receipt.requestId || '') ||
      !/^[a-f0-9]{64}$/.test(receipt.requestSha256 || '') || !/^[a-f0-9]{40}$/.test(receipt.sourceBlobSha1 || '') ||
      !/^[a-f0-9]{64}$/.test(receipt.sourceRawSha256 || '') || !String(receipt.examUid || '').trim() ||
      typeof receipt.sourceArchiveFile !== 'string' || !receipt.sourceArchiveFile.endsWith('.js'))
    fail('an unmodified terminal FULL FINAL_QA ancestor is required');
  const count = receipt.totalQuestions;
  if (!Number.isSafeInteger(count) || count < 1 || expectedQuestionCount !== undefined && count !== expectedQuestionCount)
    fail('full ancestor denominator differs from the actual exam');
  const records = fullInventory(receipt.appliedRecords, 'full metadata'), identities = fullInventory(receipt.appliedIdentityRecords, 'full identity'),
    runtimes = fullInventory(receipt.runtimeRecords, 'full runtime');
  if ([records, identities, runtimes].some(map => map.size !== count) ||
      receipt.appliedRecords.some((row, index) => row.sourceOrdinal !== index + 1))
    fail('full ancestor requires complete contiguous 1..N inventories');
  for (const [uid, row] of records) for (const value of [row, identities.get(uid), runtimes.get(uid)])
    if (!value || value.sourceArchiveFile !== receipt.sourceArchiveFile || value.sourceOrdinal !== row.sourceOrdinal)
      fail('full ancestor UID/source/ordinal inventories differ');
  return { kind: 'FULL_EXAM', count, expectedQuestionCount: count };
}

const keys=(o,allowed)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>allowed.includes(k));
const sf=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,
  answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const cf=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
const reviewPayload=q=>sha(stable(Object.fromEntries(REVIEW_STUDENT_FIELDS.map(k=>[k,q[k]??null]))));
const nonRenderer=q=>Object.fromEntries(Object.entries(q).filter(([k])=>!ALLOWED_FIELDS.has(k)));
function safe(root,relative) {
  if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||relative.includes('\\')||
    /[\x00-\x1f]/.test(relative)||relative.split('/').some(p=>!p||p==='.'||p==='..'))fail('unsafe path');
  const full=path.resolve(root,relative),base=path.resolve(root);
  for(let p=full;p!==base;p=path.dirname(p))if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())fail('symlink path');
  return full;
}
const read=(root,p)=>fs.readFileSync(safe(root,p));
function git(root,...args) {
  try{return execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']});}
  catch {fail('immutable Git evidence unavailable');}
}
function gitFile(root,commit,relative) {
  safe(root,relative);
  if(!SHA1.test(commit||'')||git(root,'rev-parse','--verify',commit+'^{commit}').toString().trim()!==commit)
    fail('exact commit required');
  const bytes=git(root,'show',commit+':'+relative);
  if(git(root,'rev-parse',commit+':'+relative).toString().trim()!==blob(bytes))fail('Git path/blob mismatch');
  return bytes;
}
function bankFromBytes(bytes) {
  const context={window:{},console:{log(){},warn(){},error(){}}};
  try{vm.runInNewContext(bytes.toString('utf8'),context,{timeout:5000,contextCodeGeneration:{strings:false,wasm:false}});}
  catch {fail('invalid original question bank');}
  const bank=context.window.questionBank||context.window.questions||context.questionBank||context.questions||context.window.examData?.questions;
  if(!Array.isArray(bank)||!bank.length)fail('question bank missing');
  return clone(bank);
}
function unique(rows,label) {
  if(!Array.isArray(rows))fail(label+' inventory missing');
  const out=new Map(),ordinals=new Set();
  for(const row of rows) {
    if(typeof row?.questionUid!=='string'||!row.questionUid||out.has(row.questionUid)||
      !Number.isSafeInteger(row.sourceOrdinal)||row.sourceOrdinal<1||ordinals.has(row.sourceOrdinal))fail(label+' inventory duplicate or invalid');
    out.set(row.questionUid,row);ordinals.add(row.sourceOrdinal);
  }
  return out;
}
function evidence(root,refs) {
  if(!Array.isArray(refs)||!refs.length)fail('SHA-bound evidence required');
  for(const ref of refs)if(!keys(ref,['path','sha256'])||!SHA256.test(ref.sha256||'')||sha(read(root,ref.path))!==ref.sha256)
    fail('evidence missing or changed');
}
function boundRef(root,ref,refs) {
  if(!keys(ref,['commit','path','sha256'])||!SHA256.test(ref.sha256||'')||
    !refs.some(r=>r.path===ref.path&&r.sha256===ref.sha256))fail('exact immutable review ref required');
  const bytes=gitFile(root,ref.commit,ref.path);
  if(sha(bytes)!==ref.sha256||!same(bytes,read(root,ref.path)))fail('review differs from immutable evidence');
  return JSON.parse(bytes);
}
function assetPath(image) {
  if(typeof image!=='string'||!image.trim())fail('one local image required');
  const p=image.startsWith('archive/')?image:'archive/'+image;
  if(!p.startsWith('archive/assets/')||!/[.](?:svg|png|jpe?g|gif|webp)$/i.test(p))fail('unsupported image path');
  return p;
}
function verifyAsset(root,ref,commit,image,{live=false}={}) {
  const p=assetPath(image);
  if(!keys(ref,['path','gitBlob','rawSha256'])||ref.path!==p||!SHA1.test(ref.gitBlob||'')||!SHA256.test(ref.rawSha256||''))
    fail('exact image digest required');
  const bytes=gitFile(root,commit,p);
  if(blob(bytes)!==ref.gitBlob||sha(bytes)!==ref.rawSha256||live&&!same(bytes,read(root,p)))fail('image digest or live asset mismatch');
  return {path:p,gitBlobSha1:blob(bytes),sha256:sha(bytes)};
}
function allAssetPaths(root,question) {
  const refs=new Set(),add=value=>{
    if(typeof value!=='string'||!/^(?:archive\/)?assets\//.test(value)||/[?#]/.test(value))fail('unsupported renderer reference');
    const p=value.startsWith('archive/')?value:'archive/'+value;safe(root,p);refs.add(p);
  },walk=value=>{
    if(value===undefined||value===null||value==='')return;
    if(Array.isArray(value)){value.forEach(walk);return;}
    if(typeof value==='string'){add(value);return;}
    fail('unsupported renderer object');
  };
  for(const key of ['image','images','solutionImage','solutionImages'])walk(question[key]);
  if(question.figureSvg||question.solutionFigureSvg||question.svg)fail('inline SVG is outside image preservation');
  const html=value=>{
    if(typeof value==='string') {
      for(const m of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi))if(!m[1].startsWith('#'))add(m[1]);
      if(/url\s*\(/i.test(value))fail('unsupported inline renderer URL');
    }else if(Array.isArray(value))value.forEach(html);
    else if(value&&typeof value==='object')Object.values(value).forEach(html);
  };
  for(const key of REVIEW_STUDENT_FIELDS)html(question[key]);
  return [...refs].sort();
}
function completeAssets(root,old,now,priorCommit,reviewCommit,beforeAsset,currentAsset) {
  const before=allAssetPaths(root,old),after=allAssetPaths(root,now),rows=[];
  if(!same(before.filter(p=>p!==beforeAsset.path),after.filter(p=>p!==currentAsset.path)))fail('non-image asset inventory changed');
  for(const p of new Set([...before,...after])) {
    const oldBytes=before.includes(p)?gitFile(root,priorCommit,p):null,
      nowBytes=after.includes(p)?gitFile(root,reviewCommit,p):null;
    if(nowBytes&&!same(nowBytes,read(root,p)))fail('live referenced asset changed');
    if(p!==beforeAsset.path&&p!==currentAsset.path&&(!oldBytes||!nowBytes||!same(oldBytes,nowBytes)))fail('unreviewed companion asset changed');
    for(const bytes of [oldBytes,nowBytes])if(bytes&&/[.]svg$/i.test(p)) {
      const text=bytes.toString('utf8');
      if([...text.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)].some(m=>!m[1].startsWith('#')&&!m[1].startsWith('data:'))||
        [...text.matchAll(/url\s*\(\s*([^)]*)\)/gi)].some(m=>!m[1].trim().replace(/^["']|["']$/g,'').startsWith('#')))
        fail('external SVG dependency is outside image preservation');
    }
    rows.push({path:p,before:oldBytes?{gitBlobSha1:blob(oldBytes),sha256:sha(oldBytes)}:null,
      current:nowBytes?{gitBlobSha1:blob(nowBytes),sha256:sha(nowBytes)}:null});
  }
  return rows.sort((a,b)=>a.path.localeCompare(b.path));
}
function unchangedAssets(root,old,now,priorCommit,currentCommit) {
  const before=allAssetPaths(root,old),after=allAssetPaths(root,now);
  if(!same(before,after))fail('unchanged item asset inventory differs');
  return before.map(p=>{
    const bytes=gitFile(root,priorCommit,p),current=gitFile(root,currentCommit,p);
    if(!same(bytes,current)||!same(current,read(root,p)))fail('unchanged item referenced asset differs');
    if(/[.]svg$/i.test(p)) {
      const text=bytes.toString('utf8');
      if([...text.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)].some(m=>!m[1].startsWith('#')&&!m[1].startsWith('data:'))||
        [...text.matchAll(/url\s*\(\s*([^)]*)\)/gi)].some(m=>!m[1].trim().replace(/^["']|["']$/g,'').startsWith('#')))
        fail('unchanged item has an unbound external SVG dependency');
    }
    const digest={gitBlobSha1:blob(bytes),sha256:sha(bytes)};
    return {path:p,before:digest,current:clone(digest)};
  });
}
export function approvedRendererBindingPath(requestId) {
  if(!ID.test(requestId||''))fail('valid request ID required');
  return RECEIPTS+requestId+'.approved-renderer-preservation.json';
}
export function hasApprovedRendererPreservationClaim({root,current,runtimeRecord}) {
  const candidates=new Set();
  for(const row of [current,runtimeRecord]) {
    for(const p of row?.approvalEvidence||[]) {
      if(typeof p!=='string'||!p.startsWith(RECEIPTS))continue;
      if(p.endsWith('.approved-renderer-preservation.json'))return true;
      candidates.add(p);
    }
    const id=typeof row?.metadataRevision==='string'&&row.metadataRevision.match(/:exam-final_qa-v2:([A-Za-z0-9][A-Za-z0-9_-]{0,100})$/)?.[1];
    if(id)candidates.add(RECEIPTS+id+'.json');
  }
  for(const p of candidates) {
    const id=p.startsWith(RECEIPTS)&&p.endsWith('.json')?p.slice(RECEIPTS.length,-5):null;
    if(!ID.test(id||''))continue;
    const sidecar=approvedRendererBindingPath(id);
    // The issued revision and reserved sidecar retain the obligation even if
    // an inherited row loses its explicit evidence markers. Detection never
    // grants approval; the complete verifier must still authenticate it.
    if(fs.existsSync(safe(root,sidecar)))return true;
    try{const doc=JSON.parse(read(root,p));if(doc?.approval&&Object.hasOwn(doc.approval,'rendererPreservation')||
      Object.hasOwn(doc||{},'approvedRendererPreservation')||doc?.outputDigests?.some(r=>r.path===sidecar))return true;}catch{}
  }
  return false;
}

export function loadApprovedRendererPreservation({root,request:req,bytes,bank,identityMap,registry,revalidateLeaf}) {
  const spec=req.approval?.rendererPreservation;
  if(!keys(spec,['schemaVersion','priorCommit','currentCommit','priorReceiptRef','reviewRefs','outsideRequest'])||
    spec.schemaVersion!==APPROVED_RENDERER_PRESERVATION||req.scope!=='PARTIAL_UIDS'||
    req.approval.type!=='FINAL_QA'||req.approval.metadataReviewed!==true||!String(req.approval.approvedBy||'').trim()||
    req.approval.sourceRebind!==undefined||req.approval.metaPipelineAudit!==undefined||
    req.registrationMode!==undefined||(req.registryChanges||[]).length||!ID.test(req.requestId||'')||
    !/^original\/middle\/m1\/2(?:mid|final)\/[^/]+\.js$/.test(req.sourceArchiveFile||''))fail('exclusive M1 S2 renderer preservation contract required');
  if(!Buffer.isBuffer(bytes)||blob(bytes)!==req.expectedSourceBlobSha1||!Array.isArray(bank)||
    bank.length!==req.expectedQuestionCount||!same(bankFromBytes(bytes),bank))fail('current source binding mismatch');
  if(!same(gitFile(root,spec.currentCommit,'archive/exams/'+req.sourceArchiveFile),bytes))fail('current immutable source snapshot differs');
  if(registry?.status!=='ACTIVE'||typeof revalidateLeaf!=='function')fail('official ACTIVE historical verifier required');
  evidence(root,req.approval.evidenceRefs);
  const ref=spec.priorReceiptRef;
  if(!keys(ref,['path','sha256'])||!SHA256.test(ref.sha256||'')||!ref.path.startsWith(RECEIPTS)||
    !req.approval.evidenceRefs.some(r=>same(r,ref)))fail('exact prior receipt ref required');
  const priorBytes=read(root,ref.path);
  if(sha(priorBytes)!==ref.sha256||!same(priorBytes,gitFile(root,spec.priorCommit,ref.path)))fail('original receipt changed');
  const prior=JSON.parse(priorBytes),full=fullNativePreservationAncestor(prior,bank.length);
  if(prior.sourceArchiveFile!==req.sourceArchiveFile||prior.examUid!==req.examUid||ref.path!==RECEIPTS+prior.requestId+'.json')
    fail('original full receipt source mismatch');
  const oldBytes=gitFile(root,spec.priorCommit,'archive/exams/'+req.sourceArchiveFile);
  if(blob(oldBytes)!==prior.sourceBlobSha1||sha(oldBytes)!==prior.sourceRawSha256)fail('original source digest mismatch');
  const oldBank=bankFromBytes(oldBytes);
  if(oldBank.length!==full.count)fail('original full source denominator mismatch');
  evidence(root,prior.approval.evidenceRefs);
  const oldRecords=unique(prior.appliedRecords,'original metadata'),oldIdentities=unique(prior.appliedIdentityRecords,'original identity'),
    oldRuntime=unique(prior.runtimeRecords,'original runtime'),selected=unique(req.items,'selected'),outside=unique(spec.outsideRequest,'outside request');
  if(!selected.size||selected.size>full.count||selected.size+outside.size!==full.count)fail('complete disjoint selected/outside partition required');
  for(const [uid,row] of [...selected,...outside])if(oldRecords.get(uid)?.sourceOrdinal!==row.sourceOrdinal||selected.has(uid)&&outside.has(uid))
    fail('selected/outside partition differs from original receipt');
  for(const row of outside.values())if(!keys(row,['questionUid','sourceOrdinal','reason'])||row.reason!=='OUTSIDE_REQUEST_PRESERVE_LIVE_STATE')
    fail('outside rows do not confer approval or declare a review hold');
  for(const row of selected.values()) {
    if(!keys(row,['questionUid','sourceOrdinal','before','after','reason','evidenceRefs','rendererReviewRef','preservationMode'])||
      !keys(row.before,[])||!keys(row.after,[])||!String(row.reason||'').trim()||
      !['UNCHANGED_WHOLE_QUESTION_AND_ASSETS','INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY'].includes(row.preservationMode))
      fail('selected approval values must be empty and preservation mode explicit');
    if(row.preservationMode==='UNCHANGED_WHOLE_QUESTION_AND_ASSETS'&&row.rendererReviewRef!==undefined)
      fail('unchanged item cannot claim independent renderer approval');
    evidence(root,row.evidenceRefs);
  }
  if(!Array.isArray(identityMap?.records))fail('current identity context required');
  const restored=clone(identityMap),joins=new Set();
  restored.records=restored.records.map(row=>{
    const old=oldIdentities.get(row.questionUid);
    if(!old)return row;
    if(row.sourceArchiveFile!==old.sourceArchiveFile||row.sourceOrdinal!==old.sourceOrdinal)fail('current identity source join changed');
    joins.add(row.questionUid);return clone(old);
  });
  if(joins.size!==full.count)fail('complete original identity context missing');
  const byJoin=new Map(restored.records.map(row=>[`${row.sourceArchiveFile}#${row.sourceOrdinal}`,row]));
  for(const [uid,row] of oldRecords) {
    const ordinal=row.sourceOrdinal,q=oldBank[ordinal-1],id=oldIdentities.get(uid),runtime=oldRuntime.get(uid);
    if(row.sourceFingerprint!==sf(q)||row.contentFingerprint!==cf(q)||id.sourceFingerprint!==sf(q)||
      revalidateLeaf({nativeSource:{root,bytes:oldBytes,blobSha1:prior.sourceBlobSha1,bank:oldBank,
        runtimeRecord:runtime,runtimeStatus:'ACTIVE',identityMap:restored,identityByJoin:byJoin},question:q,previous:q,
        current:row,identity:id,source:req.sourceArchiveFile,ordinal})!==ref.path)fail('original full native approval cannot replay: '+uid);
  }
  if(!Array.isArray(spec.reviewRefs)||!spec.reviewRefs.length)fail('independent renderer review refs required');
  const reviewDocs=new Map();
  for(const reviewRef of spec.reviewRefs) {
    const key=stable(reviewRef);
    if(reviewDocs.has(key))fail('duplicate renderer review ref');
    const review=boundRef(root,reviewRef,req.approval.evidenceRefs);
    const repaired=review.schemaVersion==='m1-current-renderer-repair-independent-review-v1';
    if((!repaired&&review.schemaVersion!=='archive-m1-independent-narrow-renderer-review-v1')||!String(review.reviewer||'').trim()||
      !String(review.rendererAuthor||'').trim()||review.reviewer===review.rendererAuthor||
      !Array.isArray(review.rows)||(!repaired&&review.fullSourceMathReviewRepeated!==false)||
      repaired&&(review.status!=='ACCEPT_THREE_EXACT_REPAIRED_ASSETS_ONLY'||review.newMathReview!==0||review.newNativeApproval!==0||
        review.sourceChanges!==0||review.answerSolutionChanges!==0||review.slotVectorChanges!==0||review.accepted!==review.rows.length))
      fail('supported independent narrow renderer review required');
    reviewDocs.set(key,{review,reviewRef,repaired});
  }
  const proofs=new Map();
  for(const [uid,item] of selected) {
    const o=item.sourceOrdinal,old=oldBank[o-1],now=bank[o-1];
    if(item.preservationMode==='UNCHANGED_WHOLE_QUESTION_AND_ASSETS') {
      if(!same(old,now))fail('unchanged item whole question differs');
      const assetInventory=unchangedAssets(root,old,now,spec.priorCommit,spec.currentCommit);
      proofs.set(uid,{questionUid:uid,sourceOrdinal:o,preservationMode:item.preservationMode,
        decision:'EXACT_EXISTING_WHOLE_QUESTION_AND_ASSETS',currentCommit:spec.currentCommit,
        beforeWholeQuestionSha256:sha(stable(old)),currentWholeQuestionSha256:sha(stable(now)),
        beforeStudentPayloadSha256:reviewPayload(old),currentStudentPayloadSha256:reviewPayload(now),
        changedFields:[],assetInventory});
      continue;
    }
    const found=reviewDocs.get(stable(item.rendererReviewRef));
    if(!found||!item.evidenceRefs.some(r=>r.path===found.reviewRef.path&&r.sha256===found.reviewRef.sha256))fail('item independent review binding missing');
    const matches=found.review.rows.filter(r=>r.questionUid===uid),r=matches[0];
    if(matches.length!==1||r.sourceOrdinal!==o||r.sourceArchiveFile!==req.sourceArchiveFile||
      !(found.repaired?r.decision==='ACCEPT_REPAIRED_CURRENT_RENDERER_CONTINUITY':
        ['ACCEPT_NARROW_CURRENT_RENDERER','ACCEPT_SIZE_EFFECT_ONLY'].includes(r.decision))||
      r.scope!=='CURRENT_FIGURE_CONTINUITY_ONLY_NO_NEW_MATH_OR_SEMANTIC_QA'||r.bothImagesActuallyViewed!==true||
      r.existingSemanticHoldPreserved!==true||r.newFullSemanticApproval!==false||r.registrationApplied!==false||
      !(found.repaired?r.originalCurrentAndRepairActuallyViewed===true&&SHA256.test(r.candidateRenderSha256||'')&&SHA256.test(r.reviewSheetSha256||''):
        SHA256.test(r.pairRenderSha256||'')))fail('selected renderer is not independently accepted');
    if(r.sourceRefs?.beforeBlob!==prior.sourceBlobSha1||r.sourceRefs.beforeRawSha256!==prior.sourceRawSha256||
      r.sourceRefs.currentBlob!==blob(bytes)||r.sourceRefs.currentRawSha256!==sha(bytes)||
      r.sourceRefs.currentCommit!==found.review.currentSourceCommit||
      !same(gitFile(root,r.sourceRefs.currentCommit,'archive/exams/'+req.sourceArchiveFile),bytes)||
      !same(gitFile(root,found.reviewRef.commit,'archive/exams/'+req.sourceArchiveFile),bytes)||
      r.beforeStudentPayloadSha256!==reviewPayload(old)||r.currentStudentPayloadSha256!==reviewPayload(now))fail('reviewed source or selected payload mismatch');
    const changed=[...new Set([...Object.keys(old),...Object.keys(now)])].filter(k=>!same(old[k],now[k]));
    if(!changed.length||changed.some(k=>!ALLOWED_FIELDS.has(k))||!same(nonRenderer(old),nonRenderer(now)))
      fail('only image/imageSize question changes are allowed');
    if(r.decision==='ACCEPT_SIZE_EFFECT_ONLY'&&(!same(old.image,now.image)||!same(changed,['imageSize'])))fail('size-only review exceeded');
    if(!changed.includes('image')&&r.decision!=='ACCEPT_SIZE_EFFECT_ONLY')fail('size-only change requires its explicit review');
    const beforeAsset=verifyAsset(root,r.beforeAsset,spec.priorCommit,old.image),
      currentAsset=verifyAsset(root,r.currentAsset,found.reviewRef.commit,now.image,{live:true});
    if(r.decision==='ACCEPT_SIZE_EFFECT_ONLY'&&!same(beforeAsset,currentAsset))fail('size-only review changed image bytes');
    if(found.repaired) {
      if(r.currentAssetState!=='ROOT_ACCEPTED_UNPUBLISHED_CANDIDATE')fail('repaired renderer origin state missing');
      verifyAsset(root,r.previousProductionAsset,r.sourceRefs.currentCommit,now.image);
    }
    const assetInventory=completeAssets(root,old,now,spec.priorCommit,found.reviewRef.commit,beforeAsset,currentAsset);
    proofs.set(uid,{questionUid:uid,sourceOrdinal:o,preservationMode:item.preservationMode,reviewRef:clone(found.reviewRef),decision:r.decision,
      beforeWholeQuestionSha256:sha(stable(old)),currentWholeQuestionSha256:sha(stable(now)),
      beforeStudentPayloadSha256:r.beforeStudentPayloadSha256,currentStudentPayloadSha256:r.currentStudentPayloadSha256,
      changedFields:changed.sort(),beforeAsset,currentAsset,assetInventory,
      ...(found.repaired?{candidateRenderSha256:r.candidateRenderSha256,reviewSheetSha256:r.reviewSheetSha256}:
        {pairRenderSha256:r.pairRenderSha256})});
  }
  if(![...proofs.values()].some(p=>p.preservationMode==='INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY'))
    fail('at least one independently reviewed renderer change is required');
  return {request:req,prior,priorRef:ref,oldRecords,oldIdentities,oldRuntime,proofs,bank,bytes,
    requestSha256:sha(stable(req)),bindingPath:approvedRendererBindingPath(req.requestId)};
}

export function planApprovedRendererRecord(ctx,{current,identity,runtime,ordinal,receiptPath,replay=false}) {
  const uid=current?.questionUid,old=ctx.oldRecords.get(uid),id=ctx.oldIdentities.get(uid),rt=ctx.oldRuntime.get(uid),q=ctx.bank[ordinal-1];
  if(!ctx.proofs.has(uid)||old.sourceOrdinal!==ordinal||receiptPath!==RECEIPTS+ctx.request.requestId+'.json')fail('selected record binding mismatch');
  const revision=`meta-foundation:${old.metaFoundationPackId}@${old.metaFoundationPackVersion}:exam-final_qa-v2:${ctx.request.requestId}`;
  const append=refs=>[...new Set([...refs,receiptPath,ctx.bindingPath])];
  const final={...clone(old),sourceFingerprint:sf(q),contentFingerprint:cf(q),metadataRevision:revision,approvalEvidence:append(old.approvalEvidence)};
  const identityAfter={...clone(id),sourceFingerprint:sf(q)};
  const runtimeAfter={...clone(rt),sourceFingerprint:sf(q),contentFingerprint:cf(q),approvedSourceFingerprint:sf(q),
    metadataRevision:revision,approvalEvidence:append(rt.approvalEvidence)};
  if(!same(current,replay?final:old)||!same(identity,replay?identityAfter:id)||!same(runtime,replay?runtimeAfter:rt))
    fail('selected live approval/identity/runtime differs from exact preserved state: '+uid);
  return {final,identityAfter,runtimeAfter,fingerprintRepair:{questionUid:uid,sourceOrdinal:ordinal,
    metadataBefore:{sourceFingerprint:old.sourceFingerprint,contentFingerprint:old.contentFingerprint},
    identityBefore:{sourceFingerprint:id.sourceFingerprint},after:{sourceFingerprint:sf(q),contentFingerprint:cf(q)},
    approvedRendererPreservation:clone(ctx.proofs.get(uid))}};
}
export function buildApprovedRendererBinding(ctx) {
  return {schemaVersion:APPROVED_RENDERER_PRESERVATION,requestId:ctx.request.requestId,requestSha256:ctx.requestSha256,
    sourceArchiveFile:ctx.request.sourceArchiveFile,sourceBlobSha1:blob(ctx.bytes),sourceRawSha256:sha(ctx.bytes),
    priorReceiptRef:clone(ctx.priorRef),originalFullCount:ctx.prior.totalQuestions,
    selectedCount:ctx.proofs.size,newMetadataApprovals:0,preservedMetadataApprovals:ctx.proofs.size,
    unchangedWholeQuestionCount:[...ctx.proofs.values()].filter(p=>p.preservationMode==='UNCHANGED_WHOLE_QUESTION_AND_ASSETS').length,
    independentlyReviewedRendererCount:[...ctx.proofs.values()].filter(p=>p.preservationMode==='INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY').length,
    requestSnapshot:clone(ctx.request),records:[...ctx.proofs.values()].sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal)};
}
export function verifyApprovedRendererReceipt({receipt,nativeSource,current,identity,ordinal,previous,registry,revalidateLeaf}) {
  const marker=receipt?.approvedRendererPreservation,spec=receipt?.approval?.rendererPreservation;
  if(marker===undefined&&spec===undefined)return null;
  if(!marker||!spec||marker.schemaVersion!==APPROVED_RENDERER_PRESERVATION||
    receipt.newMetadataApprovals!==0||receipt.preservedMetadataApprovals!==receipt.partialUidCount||
    !same(marker.requestSnapshot?.approval,receipt.approval)||
    sha(stable(marker.requestSnapshot))!==receipt.requestSha256)fail('issued renderer-preservation proof missing or changed');
  const ctx=loadApprovedRendererPreservation({root:nativeSource.root,request:marker.requestSnapshot,
    bytes:nativeSource.bytes,bank:nativeSource.bank,identityMap:nativeSource.identityMap,registry,revalidateLeaf});
  const bound=buildApprovedRendererBinding(ctx),bindingBytes=read(nativeSource.root,ctx.bindingPath);
  if(!same(marker,bound)||!same(JSON.parse(bindingBytes),bound)||
    !receipt.outputDigests?.some(r=>r.path===ctx.bindingPath&&r.sha256===sha(bindingBytes))||
    receipt.totalQuestions!==ctx.proofs.size||receipt.partialUidCount!==ctx.proofs.size||
    receipt.expectedQuestionCount!==ctx.bank.length)fail('issued renderer binding differs from exact validated proof');
  const records=unique(receipt.appliedRecords,'issued metadata'),ids=unique(receipt.appliedIdentityRecords,'issued identity'),
    runtimes=unique(receipt.runtimeRecords,'issued runtime');
  if([records,ids,runtimes].some(map=>map.size!==ctx.proofs.size||[...map.keys()].some(uid=>!ctx.proofs.has(uid))))fail('issued selected inventory mismatch');
  for(const [uid,row] of records) {
    const kept=planApprovedRendererRecord(ctx,{current:row,identity:ids.get(uid),runtime:runtimes.get(uid),
      ordinal:row.sourceOrdinal,receiptPath:RECEIPTS+receipt.requestId+'.json',replay:true});
    const repairs=(receipt.fingerprintRepairs||[]).filter(r=>r.questionUid===uid);
    if(repairs.length!==1||!same(repairs[0],kept.fingerprintRepair))fail('issued selected fingerprint proof changed');
  }
  if((receipt.fingerprintRepairs||[]).length!==ctx.proofs.size||!same(records.get(current.questionUid),current)||
    !same(ids.get(current.questionUid),identity)||!same(runtimes.get(current.questionUid),nativeSource.runtimeRecord)||
    ctx.oldRecords.get(current.questionUid)?.sourceOrdinal!==ordinal)fail('live selected receipt state mismatch');
  const old=bankFromBytes(git(nativeSource.root,'cat-file','blob',ctx.prior.sourceBlobSha1))[ordinal-1];
  const sameCursor=(a,b)=>a&&typeof a==='object'&&!Array.isArray(a)&&
    same(Object.keys(a).sort(),Object.keys(b).sort())&&same(a,b);
  if(!sameCursor(previous,old)&&!sameCursor(previous,ctx.bank[ordinal-1])) {
    const proof=ctx.proofs.get(current.questionUid);
    if(proof?.preservationMode!=='UNCHANGED_WHOLE_QUESTION_AND_ASSETS'||
      !same(old,ctx.bank[ordinal-1])||!previous||typeof previous!=='object'||Array.isArray(previous))
      fail('pending cursor is outside proven old/current renderer scope');
    const delta=[...new Set([...Object.keys(previous),...Object.keys(old)])]
      .filter(k=>Object.hasOwn(previous,k)!==Object.hasOwn(old,k)||!same(previous[k],old[k]));
    if(!delta.length||delta.some(k=>!CURSOR_PRODUCER_FIELDS.has(k)))
      fail('unchanged pending cursor has an unapproved student, asset or unknown field');
  }
  return true;
}
