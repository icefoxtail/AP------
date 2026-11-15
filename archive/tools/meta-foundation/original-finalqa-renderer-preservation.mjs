// Transport an existing full FINAL_QA approval across an independently inspected
// image/imageSize change. The original authority stays in its original schema;
// this contract supplies no semantic, difficulty or mathematical approval.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { REASSESSED_STUDENT_FIELDS } from './reviewed-source-reassessment.mjs';
import { validateOriginalFullFinalQaReuse, replayOriginalFullFinalQa } from './source-subset-preservation.mjs';

export const ORIGINAL_RENDERER_SCHEMA = 'archive-original-full-finalqa-renderer-preservation-v1';
export const ORIGINAL_RENDERER_REVIEW_SCHEMA = 'archive-independent-original-finalqa-renderer-review-v1';
export const ORIGINAL_RENDERER_BINDING_SCHEMA = 'archive-original-finalqa-renderer-binding-v1';
const PREFIX = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SUFFIX = '.original-renderer-binding.json';
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/, SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const fail = message => { throw Error(`original FINAL_QA renderer preservation: ${message}`); };
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const text = value => typeof value === 'string' && Boolean(value.trim());
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => object(value) && same(Object.keys(value).sort(), [...keys].sort());
const empty = value => exact(value, []);
const fullFp = q => sha(JSON.stringify({ content:q.content??null, choices:Array.isArray(q.choices)?q.choices:null,
  answer:q.answer??null, solution:q.solution??null, image:q.image??null }));
const bodyFp = q => sha(JSON.stringify({ content:q.content??null, choices:Array.isArray(q.choices)?q.choices:null, image:q.image??null }));
const strip = (value, fields) => Object.fromEntries(Object.entries(value || {}).filter(([key]) => !fields.includes(key)));
const inventory = rows => rows.map(({ questionUid, sourceOrdinal }) => ({ questionUid, sourceOrdinal }))
  .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
const boundRef = ref => exact(ref, ['path', 'sha256']) && text(ref.path) && SHA256.test(ref.sha256 || '');
const containsRef = (refs, ref) => Array.isArray(refs) && refs.some(r => same(r, ref));
const rendererHint = q => q.imageSize === undefined || ['full','tall'].includes(q.imageSize);
const scalarImage = q => typeof q.image === 'string' && /^(?:archive\/)?assets\//.test(q.image);
const nativePath = p => typeof p === 'string' && p.startsWith(PREFIX) && p.endsWith('.json') && ID.test(p.slice(PREFIX.length,-5));
const revisionId = row => typeof row?.metadataRevision === 'string'
  ? row.metadataRevision.match(/:exam-final_qa-v2:([A-Za-z0-9][A-Za-z0-9_-]{0,100})$/)?.[1] : undefined;

export function originalRendererBindingPath(requestId) {
  if (!ID.test(requestId || '')) fail('valid request identity required');
  return PREFIX + requestId + SUFFIX;
}
export const isOriginalFinalQaRendererPreservation = spec => spec?.schemaVersion === ORIGINAL_RENDERER_SCHEMA;
export const hasOriginalRendererMarker = row => Array.isArray(row?.approvalEvidence) && row.approvalEvidence.some(p =>
  typeof p === 'string' && p.startsWith(PREFIX) && p.endsWith(SUFFIX) && ID.test(p.slice(PREFIX.length, -SUFFIX.length)));

// Shared syntax routing is deliberately weaker than approval validation. Every
// accepted route must still call the full source/receipt/renderer verifier below.
export function isExplicitOriginalRendererRequest(request) {
  const approval = request?.approval, spec = approval?.sourceRebind;
  return exact(request,['schemaVersion','requestId','examUid','sourceArchiveFile','scope','expectedQuestionCount','expectedSourceBlobSha1','registryChanges','approval','items'])
    && request.schemaVersion === 'archive-reviewed-exam-meta-register-request-v2' && request.scope === 'PARTIAL_UIDS'
    && text(request.examUid) && text(request.sourceArchiveFile) && SHA1.test(request.expectedSourceBlobSha1 || '')
    && request.registrationMode === undefined && approval?.type === 'FINAL_QA' && approval.metadataReviewed === true
    && exact(approval,['type','metadataReviewed','approvedBy','evidenceRefs','sourceRebind'])
    && text(approval.approvedBy) && ID.test(request.requestId || '') && isOriginalFinalQaRendererPreservation(spec)
    && exact(spec, ['schemaVersion', 'priorReceiptRef', 'rendererEvidenceRef', 'reviewCommit'])
    && boundRef(spec.priorReceiptRef) && boundRef(spec.rendererEvidenceRef) && SHA1.test(spec.reviewCommit || '')
    && containsRef(approval.evidenceRefs, spec.priorReceiptRef) && containsRef(approval.evidenceRefs, spec.rendererEvidenceRef)
    && Array.isArray(request.registryChanges) && request.registryChanges.length === 0
    && Number.isSafeInteger(request.expectedQuestionCount) && request.expectedQuestionCount > 1
    && Array.isArray(request.items) && request.items.length > 0 && request.items.length < request.expectedQuestionCount
    && request.items.every(item => exact(item,['questionUid','sourceOrdinal','before','after','reason','evidenceRefs'])
      && text(item.questionUid) && text(item.reason) && Number.isSafeInteger(item.sourceOrdinal)
      && item.sourceOrdinal > 0 && item.sourceOrdinal <= request.expectedQuestionCount
      && empty(item.before) && empty(item.after) && item.rebind === undefined && item.sourceReview === undefined
      && containsRef(item.evidenceRefs, spec.priorReceiptRef) && containsRef(item.evidenceRefs, spec.rendererEvidenceRef))
    && new Set(request.items.map(r => r.questionUid)).size === request.items.length
    && new Set(request.items.map(r => r.sourceOrdinal)).size === request.items.length;
}

function safePath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || /[\x00-\x1f]/.test(relative)
      || relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe source/evidence/asset path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink source/evidence/asset path');
  return full;
}
function rawFile(root, relative) { return fs.readFileSync(safePath(root, relative)); }
function parse(raw) { try { return JSON.parse(raw); } catch { fail('invalid JSON evidence'); } }
function boundJson(root, ref) {
  if (!boundRef(ref)) fail('exact SHA-bound evidence required');
  const raw = rawFile(root, ref.path);
  if (sha(raw) !== ref.sha256) fail('evidence missing or changed');
  return { raw, doc:parse(raw) };
}
function gitFile(root, commit, relative) {
  safePath(root, relative);
  if (!SHA1.test(commit || '')) fail('immutable exact Git commit required');
  const git = (...args) => execFileSync('git', args, { cwd:root, maxBuffer:32*1024*1024, stdio:['ignore','pipe','pipe'] });
  try {
    if (git('rev-parse', '--verify', `${commit}^{commit}`).toString().trim() !== commit) fail('immutable exact Git commit required');
    const gitBlobSha1 = git('rev-parse', `${commit}:${relative}`).toString().trim();
    const bytes = git('cat-file', 'blob', gitBlobSha1);
    return { bytes, gitBlobSha1, sha256:sha(bytes) };
  } catch { fail('immutable Git snapshot unavailable'); }
}
function sourceSnapshot(root, ref, source, bytes) {
  if (!exact(ref, ['commit','path','gitBlobSha1','sha256']) || ref.path !== `archive/exams/${source}`
      || !SHA1.test(ref.gitBlobSha1 || '') || !SHA256.test(ref.sha256 || '')) fail('exact same-path source snapshot required');
  const file = gitFile(root, ref.commit, ref.path);
  if (file.gitBlobSha1 !== ref.gitBlobSha1 || file.sha256 !== ref.sha256 || !Buffer.isBuffer(bytes)
      || !file.bytes.equals(bytes)) fail('source Git/blob/raw bytes changed');
  return file;
}
function references(root, question) {
  const refs = new Set();
  const add = value => {
    if (typeof value !== 'string' || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail('unsupported renderer reference');
    const relative = value.startsWith('archive/') ? value : `archive/${value}`;
    safePath(root, relative); refs.add(relative);
  };
  const direct = value => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) { value.forEach(direct); return; }
    if (typeof value === 'string') { add(value); return; }
    fail('unsupported renderer object');
  };
  for (const key of ['image','images','solutionImage','solutionImages']) direct(question[key]);
  if (question.figureSvg || question.solutionFigureSvg) fail('inline SVG is outside this original image transport contract');
  const html = value => {
    if (typeof value === 'string') {
      for (const m of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) if (!m[1].startsWith('#')) add(m[1]);
      if (/url\s*\(/i.test(value)) fail('unsupported inline renderer URL');
    } else if (Array.isArray(value)) value.forEach(html);
    else if (object(value)) Object.values(value).forEach(html);
  };
  html(Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(key => [key, question[key] ?? null])));
  return [...refs].sort();
}
function verifyAssets(root, assets, question, commit, request, patch, live) {
  if (!Array.isArray(assets) || new Set(assets.map(a => a.path)).size !== assets.length
      || !same(assets.map(a => a.path).sort(), references(root, question))) fail('complete unique referenced asset inventory required');
  for (const asset of assets) {
    if (!exact(asset, ['path','gitBlobSha1','sha256','visuallyInspected']) || !SHA1.test(asset.gitBlobSha1 || '')
        || !SHA256.test(asset.sha256 || '') || asset.visuallyInspected !== true) fail('actual independent asset inspection and hashes required');
    const file = gitFile(root, commit, asset.path);
    if (file.gitBlobSha1 !== asset.gitBlobSha1 || file.sha256 !== asset.sha256) fail('renderer asset Git/raw digest changed');
    if (live) {
      const ref = {path:asset.path,sha256:asset.sha256};
      if (sha(rawFile(root, asset.path)) !== asset.sha256 || !containsRef(request.approval.evidenceRefs,ref)
          || !containsRef(patch.evidenceRefs,ref)) fail('current renderer must match and bind both approval/item evidence');
    }
    if (/\.svg$/i.test(asset.path)) {
      const svg=file.bytes.toString(), dependencies=[...[...svg.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]),
        ...[...svg.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m=>m[1])];
      if (dependencies.some(p=>!p.startsWith('#')&&!/^data:image\/[a-z0-9.+-]+;base64,/i.test(p))) fail('unsupported nested SVG renderer dependency');
    }
  }
}

// Native reuse needs the actual ACTIVE runtime inventory, not a caller's PASS.
export function originalRendererRuntimeStatuses(root) {
  const result = new Map(), directory = safePath(root,'archive/data/meta-foundation/runtime');
  for (const name of fs.readdirSync(directory).filter(n=>n.endsWith('.json')&&n!=='runtime-bridge-receipt.json')) {
    const doc=parse(rawFile(root,'archive/data/meta-foundation/runtime/'+name));
    if (!text(doc.packId) || !Array.isArray(doc.records)) continue;
    if (result.has(doc.packId)) fail('duplicate runtime owner');
    result.set(doc.packId,doc.status);
  }
  return result;
}

export function loadOriginalFinalQaRendererPreservation({root,request,bytes,bank,nativeSource,registry,revalidateLeaf}) {
  if (!isExplicitOriginalRendererRequest(request)) fail('exclusive typed partial existing-approval request required');
  const spec=request.approval.sourceRebind, source=request.sourceArchiveFile;
  if (!text(source) || source.startsWith('archive/') || !source.endsWith('.js') || !Array.isArray(bank)
      || bank.length!==request.expectedQuestionCount || blob(bytes)!==request.expectedSourceBlobSha1) fail('current source binding or denominator changed');
  const {doc:prior}=boundJson(root,spec.priorReceiptRef);
  const authority=validateOriginalFullFinalQaReuse({root,prior,priorReceiptRef:spec.priorReceiptRef});
  if (prior.sourceArchiveFile!==source || prior.examUid!==request.examUid || prior.totalQuestions!==bank.length
      || prior.requestId===request.requestId || !containsRef(request.approval.evidenceRefs,authority.proofRef)) fail('original full approval source/identity/reuse reference mismatch');
  const {raw:reviewRaw,doc:review}=boundJson(root,spec.rendererEvidenceRef),reviewFile=gitFile(root,spec.reviewCommit,spec.rendererEvidenceRef.path);
  if (!reviewRaw.equals(reviewFile.bytes) || reviewFile.sha256!==spec.rendererEvidenceRef.sha256) fail('independent review differs from immutable Git bytes');
  if (!exact(review,['schemaVersion','scope','reviewer','decision','sourceArchiveFile','expectedQuestionCount','priorReceiptRef',
      'priorSourceRef','currentSourceRef','newMetadataApprovals','newMathematicalQa','newReviewPassCount','newDifficultyJudgments','rows'])
      || review.schemaVersion!==ORIGINAL_RENDERER_REVIEW_SCHEMA || review.scope!=='NARROW_RENDERER_CONTINUITY_OF_EXISTING_FULL_FINAL_QA'
      || review.decision!=='PASS_NARROW_RENDERER_CONTINUITY' || !text(review.reviewer)
      || [request.approval.approvedBy,prior.approval.approvedBy].includes(review.reviewer)
      || review.sourceArchiveFile!==source || review.expectedQuestionCount!==bank.length || !same(review.priorReceiptRef,spec.priorReceiptRef)
      || review.newMetadataApprovals!==0 || review.newMathematicalQa!==false || review.newReviewPassCount!==0 || review.newDifficultyJudgments!==0
      || !Array.isArray(review.rows) || !same(inventory(review.rows),inventory(request.items))) fail('independent original-approval renderer review scope mismatch');
  if (new Set(review.rows.map(r=>r.questionUid)).size!==review.rows.length || new Set(review.rows.map(r=>r.sourceOrdinal)).size!==review.rows.length)
    fail('independent renderer UID inventory ambiguous');
  const originalSource=replayOriginalFullFinalQa({root,prior,priorReceiptRef:spec.priorReceiptRef,
    nativeSource:{...nativeSource,root,runtimeStatusByPack:originalRendererRuntimeStatuses(root)},registry,revalidateLeaf});
  sourceSnapshot(root,review.priorSourceRef,source,originalSource.bytes);
  sourceSnapshot(root,review.currentSourceRef,source,bytes);
  if (review.priorSourceRef.gitBlobSha1!==prior.sourceBlobSha1 || review.priorSourceRef.sha256!==prior.sourceRawSha256
      || review.currentSourceRef.gitBlobSha1===prior.sourceBlobSha1) fail('renderer transition needs its distinct original/current source');
  if (gitFile(root,review.priorSourceRef.commit,spec.priorReceiptRef.path).sha256!==spec.priorReceiptRef.sha256)
    fail('prior full receipt is not the exact originally published Git receipt');
  const rows=new Map();
  for (const row of review.rows) {
    const patch=request.items.find(r=>r.questionUid===row.questionUid),ordinal=row.sourceOrdinal;
    const old=originalSource.bank[ordinal-1],current=bank[ordinal-1],before=prior.appliedRecords[ordinal-1];
    const changed=[...new Set([...Object.keys(old||{}),...Object.keys(current||{})])].filter(k=>!same(old?.[k],current?.[k])).sort();
    if (!exact(row,['questionUid','sourceOrdinal','decision','visualInspectionPerformed','priorQuestionSha256','currentQuestionSha256',
        'changedFields','nonRendererFieldsUnchanged','noNewAnswerLeak','observed','priorAssets','currentAssets'])
        || before?.questionUid!==row.questionUid || row.decision!=='PRESERVE_EXISTING_APPROVAL_RENDERER_ONLY'
        || row.visualInspectionPerformed!==true || row.nonRendererFieldsUnchanged!==true || row.noNewAnswerLeak!==true || !text(row.observed)
        || !scalarImage(old) || !scalarImage(current) || !rendererHint(old) || !rendererHint(current)
        || !changed.length || changed.some(k=>!['image','imageSize'].includes(k)) || !same(changed,[...(row.changedFields||[])].sort())
        || !same(strip(old,['image','imageSize']),strip(current,['image','imageSize']))
        || row.priorQuestionSha256!==sha(stable(old)) || row.currentQuestionSha256!==sha(stable(current)))
      fail('selected renderer changed nonrenderer fields or lacks actual immutable inspection');
    verifyAssets(root,row.priorAssets,old,review.priorSourceRef.commit,request,patch,false);
    verifyAssets(root,row.currentAssets,current,review.currentSourceRef.commit,request,patch,true);
    rows.set(row.questionUid,{review:row,patch,prior:before,priorRuntime:prior.runtimeRecords[ordinal-1],priorIdentity:prior.appliedIdentityRecords[ordinal-1],question:current});
  }
  return {root,request,prior,review,authority,rows,source,bytes,bank,originalSource,bindingPath:originalRendererBindingPath(request.requestId)};
}

export function planOriginalRendererPreservedRow(context,{current,identity,runtime,question,ordinal,receiptPath,replay=false}) {
  const row=context.rows.get(current?.questionUid);
  if (!row || row.prior.sourceOrdinal!==ordinal || !same(row.question,question) || receiptPath!==PREFIX+context.request.requestId+'.json')
    fail('selected original approval identity/ordinal mismatch');
  const after={sourceFingerprint:fullFp(question),contentFingerprint:bodyFp(question)};
  const evidence=[...new Set([...(row.prior.approvalEvidence||[]),receiptPath,context.bindingPath])];
  const final={...structuredClone(row.prior),...after,metadataRevision:`meta-foundation:${row.prior.metaFoundationPackId}@${row.prior.metaFoundationPackVersion}:exam-final_qa-v2:${context.request.requestId}`,approvalEvidence:evidence};
  const identityAfter={...structuredClone(row.priorIdentity),sourceFingerprint:after.sourceFingerprint};
  const runtimeAfter={...structuredClone(row.priorRuntime),...after,approvedSourceFingerprint:after.sourceFingerprint,
    metadataRevision:final.metadataRevision,approvalEvidence:evidence};
  if (!same(current,replay?final:row.prior) || !same(identity,replay?identityAfter:row.priorIdentity)
      || !same(runtime,replay?runtimeAfter:row.priorRuntime)) fail('original approved values, identity or runtime changed');
  const fingerprintRepair={questionUid:current.questionUid,sourceOrdinal:ordinal,
    metadataBefore:{sourceFingerprint:row.prior.sourceFingerprint,contentFingerprint:row.prior.contentFingerprint},
    identityBefore:{sourceFingerprint:row.priorIdentity.sourceFingerprint},after,
    originalRendererPreservation:{schemaVersion:ORIGINAL_RENDERER_SCHEMA,priorReceiptRef:context.request.approval.sourceRebind.priorReceiptRef,
      rendererEvidenceRef:context.request.approval.sourceRebind.rendererEvidenceRef,reviewCommit:context.request.approval.sourceRebind.reviewCommit,
      bindingPath:context.bindingPath,newMetadataApprovals:0,newMathematicalQa:false,newDifficultyJudgments:0,newReviewPassCount:0}};
  return {final,identityAfter,runtimeAfter,fingerprintRepair};
}

export function buildOriginalRendererBinding(context,requestSha256) {
  if (requestSha256!==sha(stable(context.request))) fail('exact original renderer request digest required');
  return {schemaVersion:ORIGINAL_RENDERER_BINDING_SCHEMA,scope:'EXACT_PRIOR_FULL_APPROVAL_WITH_REVIEWED_RENDERER',
    requestId:context.request.requestId,requestSha256,sourceArchiveFile:context.source,sourceBlobSha1:blob(context.bytes),sourceRawSha256:sha(context.bytes),
    expectedQuestionCount:context.bank.length,partialUidCount:context.rows.size,newMetadataApprovals:0,newMathematicalQa:false,newReviewPassCount:0,newDifficultyJudgments:0,
    request:structuredClone(context.request),records:[...context.rows.values()].map(row=>({questionUid:row.prior.questionUid,sourceOrdinal:row.prior.sourceOrdinal,
      originalApprovedValuesSha256:sha(stable(strip(row.prior,['sourceFingerprint','contentFingerprint','metadataRevision','approvalEvidence']))),
      priorQuestionSha256:row.review.priorQuestionSha256,currentQuestionSha256:row.review.currentQuestionSha256,
      priorAssetsSha256:sha(stable(row.review.priorAssets)),currentAssetsSha256:sha(stable(row.review.currentAssets))})).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal)};
}

export function assertOriginalRendererReceipt(context,receipt) {
  const request=context.request,path=PREFIX+request.requestId+'.json';
  if (receipt.schemaVersion!=='archive-reviewed-exam-meta-registration-v2' || receipt.metadataRegistrationStatus!=='REGISTERED'
      || receipt.requestId!==request.requestId || receipt.requestSha256!==sha(stable(request)) || receipt.scope!=='PARTIAL_UIDS'
      || receipt.sourceArchiveFile!==context.source || receipt.sourceBlobSha1!==blob(context.bytes) || receipt.sourceRawSha256!==sha(context.bytes)
      || receipt.expectedQuestionCount!==context.bank.length || receipt.partialUidCount!==context.rows.size || receipt.totalQuestions!==context.rows.size
      || receipt.newMetadataApprovals!==0 || receipt.preservedMetadataApprovals!==context.rows.size || !same(receipt.approval,request.approval)
      || receipt.registrationMode!==undefined || !same(receipt.registryChanges,[]) || receipt.nativeParentBindings!==undefined
      || !Array.isArray(receipt.appliedRecords) || !same(inventory(receipt.appliedRecords),inventory(request.items))
      || !Array.isArray(receipt.appliedIdentityRecords) || !same(inventory(receipt.appliedIdentityRecords),inventory(request.items))
      || !Array.isArray(receipt.runtimeRecords) || !same(inventory(receipt.runtimeRecords),inventory(request.items))) fail('issued original renderer receipt scope/authority changed');
  const repairs=[];
  for (const current of receipt.appliedRecords) {
    const identity=receipt.appliedIdentityRecords.find(r=>r.questionUid===current.questionUid),runtime=receipt.runtimeRecords.find(r=>r.questionUid===current.questionUid);
    repairs.push(planOriginalRendererPreservedRow(context,{current,identity,runtime,question:context.bank[current.sourceOrdinal-1],ordinal:current.sourceOrdinal,receiptPath:path,replay:true}).fingerprintRepair);
  }
  if (!same(receipt.fingerprintRepairs,repairs)) fail('issued original renderer fingerprint/provenance repair changed');
  const bytes=rawFile(context.root,context.bindingPath),digests=receipt.outputDigests?.filter(r=>r.path===context.bindingPath);
  if (digests?.length!==1 || digests[0].sha256!==sha(bytes) || !same(parse(bytes),buildOriginalRendererBinding(context,receipt.requestSha256)))
    fail('durable original renderer binding missing or changed');
}

// These comparisons only retain a proof obligation; they never grant approval.
// A caught-up cursor must not turn an issued fingerprint/provenance transport
// into ordinary FINAL_QA just because all explicit transport markers vanished.
function matchesOriginalFullRows(prior,current,runtime,identity) {
  if(prior?.schemaVersion!=='archive-reviewed-exam-meta-registration-v2' || prior.scope!==undefined
      || prior.metadataRegistrationStatus!=='REGISTERED' || prior.approval?.type!=='FINAL_QA'
      || prior.approval.reuse?.mode!=='EXACT_PRIOR_FINAL_QA_PLUS_REVIEWED_DIFFICULTY'
      || !ID.test(prior.requestId||'') || !ID.test(revisionId(current)||'') || revisionId(current)===prior.requestId
      || current.metadataApprovalType!=='FINAL_QA' || runtime?.metadataApprovalType!=='FINAL_QA'
      || current.metadataRevision!==runtime.metadataRevision || current.sourceArchiveFile!==prior.sourceArchiveFile) return false;
  const old=prior.appliedRecords?.filter(r=>r.questionUid===current.questionUid&&r.sourceOrdinal===current.sourceOrdinal),
    oldRuntime=prior.runtimeRecords?.filter(r=>r.questionUid===current.questionUid&&r.sourceOrdinal===current.sourceOrdinal),
    oldIdentity=prior.appliedIdentityRecords?.filter(r=>r.questionUid===current.questionUid&&r.sourceOrdinal===current.sourceOrdinal);
  if(old?.length!==1 || oldRuntime?.length!==1 || oldIdentity?.length!==1) return false;
  const priorPath=PREFIX+prior.requestId+'.json',latest=PREFIX+revisionId(current)+'.json';
  if(![current,runtime].every(row=>Array.isArray(row.approvalEvidence)&&row.approvalEvidence.includes(priorPath)
      && row.approvalEvidence.includes(latest) && old[0].approvalEvidence.every(p=>row.approvalEvidence.includes(p)))) return false;
  return same(strip(current,['sourceFingerprint','contentFingerprint','metadataRevision','approvalEvidence']),
      strip(old[0],['sourceFingerprint','contentFingerprint','metadataRevision','approvalEvidence']))
    && same(strip(runtime,['sourceFingerprint','contentFingerprint','approvedSourceFingerprint','metadataRevision','approvalEvidence']),
      strip(oldRuntime[0],['sourceFingerprint','contentFingerprint','approvedSourceFingerprint','metadataRevision','approvalEvidence']))
    && (!identity || same(strip(identity,['sourceFingerprint']),strip(oldIdentity[0],['sourceFingerprint'])));
}

function strippedOriginalRendererLineage(root,receipt) {
  if(receipt?.approval?.sourceRebind!==undefined || receipt.scope!=='PARTIAL_UIDS' || !ID.test(receipt.requestId||'')
      || !Array.isArray(receipt.appliedRecords) || !receipt.appliedRecords.length) return false;
  const first=receipt.appliedRecords[0],latest=PREFIX+receipt.requestId+'.json';
  for(const ref of first.approvalEvidence||[]) {
    if(!nativePath(ref)||ref===latest) continue;
    try {
      const prior=parse(rawFile(root,ref));
      if(ref!==PREFIX+prior.requestId+'.json' || prior.totalQuestions!==receipt.expectedQuestionCount
          || prior.examUid!==receipt.examUid || prior.sourceBlobSha1===receipt.sourceBlobSha1) continue;
      if(receipt.appliedRecords.every(row=>{
        const runtime=receipt.runtimeRecords?.filter(r=>r.questionUid===row.questionUid),identity=receipt.appliedIdentityRecords?.filter(r=>r.questionUid===row.questionUid);
        return runtime?.length===1 && identity?.length===1 && matchesOriginalFullRows(prior,row,runtime[0],identity[0]);
      })) return true;
    } catch { /* An unavailable ancestor is handled by the live-row claim below. */ }
  }
  return false;
}

export function hasOriginalFinalQaRendererClaim({root,current,runtimeRecord}) {
  if (hasOriginalRendererMarker(current)||hasOriginalRendererMarker(runtimeRecord)) return true;
  for (const ref of new Set([...(current?.approvalEvidence||[]),...(runtimeRecord?.approvalEvidence||[])])) {
    if (!nativePath(ref)) continue;
    try { const receipt=parse(rawFile(root,ref));
      if (isOriginalFinalQaRendererPreservation(receipt.approval?.sourceRebind)
          || receipt.fingerprintRepairs?.some(r=>r.originalRendererPreservation?.schemaVersion===ORIGINAL_RENDERER_SCHEMA)
          || strippedOriginalRendererLineage(root,receipt) || matchesOriginalFullRows(receipt,current,runtimeRecord)) return true;
    } catch { /* A missing ordinary receipt alone does not invent an approval type. */ }
  }
  return false;
}

export function nativeOriginalFinalQaRendererRebind({receipt,nativeSource,question,previous,current,identity,ordinal,registry,revalidateLeaf,revalidateDirectSource}) {
  const typed=isOriginalFinalQaRendererPreservation(receipt.approval?.sourceRebind);
  const marked=receipt.appliedRecords?.some(hasOriginalRendererMarker)||receipt.runtimeRecords?.some(hasOriginalRendererMarker)
    || receipt.fingerprintRepairs?.some(r=>r.originalRendererPreservation?.schemaVersion===ORIGINAL_RENDERER_SCHEMA)
    || strippedOriginalRendererLineage(nativeSource.root,receipt);
  if (!typed&&!marked) return null;
  // A distinct ordinary reassessment is an exception only after its actual
  // immutable native verifier succeeds. A sourceReview-shaped flag is no proof.
  if(!typed && !receipt.appliedRecords?.some(hasOriginalRendererMarker) && !receipt.runtimeRecords?.some(hasOriginalRendererMarker)
      && !receipt.fingerprintRepairs?.some(r=>r.originalRendererPreservation?.schemaVersion===ORIGINAL_RENDERER_SCHEMA)
      && receipt.fingerprintRepairs?.some(r=>r.sourceReview!==undefined) && typeof revalidateDirectSource==='function'
      && revalidateDirectSource()===true) return null;
  if (!typed || !ID.test(receipt.requestId||'')) fail('issued original renderer authority marker was stripped');
  const bindingPath=originalRendererBindingPath(receipt.requestId),binding=parse(rawFile(nativeSource.root,bindingPath));
  if (binding.schemaVersion!==ORIGINAL_RENDERER_BINDING_SCHEMA || binding.requestId!==receipt.requestId
      || binding.requestSha256!==receipt.requestSha256 || sha(stable(binding.request))!==receipt.requestSha256) fail('durable original renderer request missing or changed');
  const context=loadOriginalFinalQaRendererPreservation({root:nativeSource.root,request:binding.request,bytes:nativeSource.bytes,bank:nativeSource.bank,
    nativeSource,registry,revalidateLeaf});
  assertOriginalRendererReceipt(context,receipt);
  planOriginalRendererPreservedRow(context,{current,identity,runtime:nativeSource.runtimeRecord,question,ordinal,receiptPath:PREFIX+receipt.requestId+'.json',replay:true});
  const original=context.originalSource.bank[ordinal-1],payload=q=>Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k=>[k,q?.[k]??null]));
  if (!same(payload(previous),payload(original))&&!same(payload(previous),payload(question))) fail('previous payload is neither original approved nor independently inspected current renderer');
  return true;
}
