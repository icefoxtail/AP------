// A separately approved auxiliary concept may supplement an existing audit.
// The original audit is replayed in full; its classification, difficulty and
// approval kind are never recast as a fresh FINAL_QA review.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {loadVerifiedHistoricalAuditSnapshot, isPreservableAuditRecord, isAuditPreservation} from './native-audit-preservation.mjs';
import {validateReviewedAuditCrossConceptComponent, REASSESSED_STUDENT_FIELDS} from './reviewed-source-reassessment.mjs';
import {loadActiveMetaRegistry} from './active-registry.mjs';
import {readImmutableGitFiles} from './immutable-git-batch.mjs';
import {createExactJsonByteParser} from './exact-json-byte-parser.mjs';

const parseSmallJson = createExactJsonByteParser(16);
const parseCurrentJson = raw => raw.length<=2*1024*1024 ? parseSmallJson(raw) : JSON.parse(raw.toString('utf8'));

export const AUDIT_CC_APPEND_SCHEMA = 'archive-audit-finalized-cc-append-v1';
export const AUDIT_CC_BINDING_SCHEMA = 'archive-audit-finalized-cc-binding-v1';
const COMPONENT_SCHEMA = 'archive-audit-cross-concept-components-v1';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const text = v => typeof v === 'string' && v.trim();
const fail = message => {throw Error('audited CC append: ' + message);};
const pick = (q, fields) => Object.fromEntries(fields.filter(k => Object.hasOwn(q, k)).map(k => [k, q[k]]));
const fp = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,
  answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const cf = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
const uniqueStrings = v => Array.isArray(v) && v.every(text) && new Set(v).size === v.length;
const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).every(k => keys.includes(k));

function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || /[\x00-\x1f]/.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence path');
  const full = path.resolve(root, relative), base = path.resolve(root);
  for (let p = full; p !== base; p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence path');
  return full;
}
const read = (root, p) => parseCurrentJson(fs.readFileSync(safe(root, p)));
function git(root, args) {
  try {return execFileSync('git', args, {cwd:root,maxBuffer:128*1024*1024,stdio:['ignore','pipe','pipe']});}
  catch {fail('immutable Git evidence missing');}
}
function bankFrom(bytes) {
  const ctx = {window:{},console:{log(){},warn(){},error(){}}};
  vm.runInNewContext(bytes.toString('utf8'),ctx,{timeout:5000});
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || !bank.length) fail('source bank missing');
  return JSON.parse(JSON.stringify(bank));
}
function inventory(rows, label) {
  if (!Array.isArray(rows)) fail(label + ' missing');
  const result = new Map();
  for (const row of rows) {
    if (!text(row?.questionUid) || result.has(row.questionUid)) fail(label + ' duplicate/missing UID');
    result.set(row.questionUid,row);
  }
  return result;
}
function refs(root, values) {
  if (!Array.isArray(values) || !values.length) fail('explicit evidence inventory missing');
  const found = new Map();
  for (const ref of values) {
    if (!exactKeys(ref,['path','sha256']) || !SHA256.test(ref.sha256 || '') ||
        sha(fs.readFileSync(safe(root,ref.path))) !== ref.sha256 ||
        found.has(ref.path) && found.get(ref.path) !== ref.sha256) fail('evidence missing, ambiguous or changed');
    found.set(ref.path,ref.sha256);
  }
  return found;
}
const bound = (map, ref) => ref && map.get(ref.path) === ref.sha256;
export const auditCcBindingPath = requestId => RECEIPTS + requestId + '.audit-cc-append.json';
export const isAuditCcAppend = approval => approval?.type === 'META_PIPELINE_AUDIT'
  && approval.sourceRebind?.schemaVersion === AUDIT_CC_APPEND_SCHEMA;

// This structural gate selects only the new operation. Authority validation is
// always performed below by the actual immutable audit and finalization code.
export function isExplicitAuditCcAppendRequest(request) {
  const spec = request?.approval?.sourceRebind;
  return request?.schemaVersion === 'archive-reviewed-exam-meta-register-request-v2' && isAuditCcAppend(request.approval)
    && exactKeys(request,['schemaVersion','requestId','examUid','sourceArchiveFile','expectedSourceBlobSha1','expectedQuestionCount','approval','registryChanges','items'])
    && exactKeys(request.approval,['type','metadataReviewed','approvedBy','evidenceRefs','sourceRebind','metaPipelineAudit'])
    && request.scope === undefined && request.registrationMode === undefined && request.approval.metadataReviewed === true
    && text(request.approval.approvedBy) && Number.isSafeInteger(request.expectedQuestionCount) && request.expectedQuestionCount > 0
    && Array.isArray(request.items) && request.items.length === request.expectedQuestionCount
    && exactKeys(spec,['schemaVersion','requestPath','priorCommit','priorReceiptRef','component'])
    && spec.requestPath === '.archive-meta-register/inbox/' + request.requestId + '.json'
    && SHA1.test(spec.priorCommit || '') && exactKeys(spec.priorReceiptRef,['path','sha256'])
    && SHA256.test(spec.priorReceiptRef?.sha256 || '')
    && Number.isSafeInteger(spec.component?.sourceOrdinal) && spec.component.sourceOrdinal > 0
    && spec.component.sourceOrdinal <= request.expectedQuestionCount && text(spec.component.questionUid)
    && text(spec.component.addCrossConceptKey)
    && (request.registryChanges === undefined || Array.isArray(request.registryChanges) && request.registryChanges.length <= 1)
    && request.items.every(item => exactKeys(item,['questionUid','sourceOrdinal','before','after','reason','evidenceRefs'])
      && same(item.before,{}) && same(item.after,{}) && text(item.reason));
}

function referencedAssets(question) {
  const found = new Set();
  const add = value => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {value.forEach(add);return;}
    if (typeof value !== 'string' || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value))
      fail('unsupported source renderer reference');
    found.add(value.startsWith('archive/') ? value : 'archive/' + value);
  };
  for (const field of ['image','images','solutionImage','solutionImages','visualAsset']) add(question[field]);
  if (question.visualSpec?.assetRef !== undefined) add(question.visualSpec.assetRef);
  const inline = value => {
    if (typeof value === 'string') {
      for (const m of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) if (!m[1].startsWith('#')) add(m[1]);
      if (/url\s*\(/i.test(value)) fail('unsupported inline renderer URL');
    } else if (Array.isArray(value)) value.forEach(inline);
    else if (value && typeof value === 'object') Object.values(value).forEach(inline);
  };
  inline(pick(question,REASSESSED_STUDENT_FIELDS));
  return [...found].sort();
}

function readBoundRequest(root, request) {
  const p = request.approval.sourceRebind.requestPath;
  if (fs.existsSync(safe(root,p))) {
    if (!same(read(root,p),request)) fail('request differs from explicit input');
    return;
  }
  const binding = read(root,auditCcBindingPath(request.requestId));
  if (binding.schemaVersion !== AUDIT_CC_BINDING_SCHEMA || !same(binding.requestSnapshot,request) ||
      binding.requestSha256 !== sha(stable(request))) fail('consumed request snapshot missing or changed');
}

export function loadAuditCcAppend({root,request,bytes,bank,canonicalBefore,canonicalAfter}) {
  if (!isExplicitAuditCcAppendRequest(request)) fail('exclusive full-audit CC append scope required');
  const spec=request.approval.sourceRebind, priorRef=spec.priorReceiptRef, component=spec.component;
  if (priorRef.path === RECEIPTS + request.requestId + '.json' ||
      !SHA1.test(request.expectedSourceBlobSha1 || '') || request.expectedSourceBlobSha1 !== blob(bytes) ||
      bank.length !== request.expectedQuestionCount) fail('source/request/ancestor binding mismatch');
  readBoundRequest(root,request);
  const approvalRefs=refs(root,request.approval.evidenceRefs);
  if (!bound(approvalRefs,priorRef)) fail('prior audit must be explicit evidence');
  const snapshot=loadVerifiedHistoricalAuditSnapshot({root,priorCommit:spec.priorCommit,priorReceiptRef:priorRef});
  const {prior,bank:oldBank}=snapshot;
  if (prior.examUid !== request.examUid || prior.sourceArchiveFile !== request.sourceArchiveFile ||
      prior.totalQuestions !== bank.length || prior.sourceRawSha256 === sha(bytes) ||
      !same(prior.approval.metaPipelineAudit,request.approval.metaPipelineAudit)) fail('original full audit/source scope mismatch');
  const records=inventory(prior.appliedRecords,'prior metadata'), identities=inventory(prior.appliedIdentityRecords,'prior identity'),
    runtimes=inventory(prior.runtimeRecords,'prior runtime'), patches=inventory(request.items,'request');
  if ([records,identities,runtimes,patches].some(m=>m.size!==bank.length) ||
      !same(request.items.map(r=>r.questionUid),prior.appliedRecords.map(r=>r.questionUid))) fail('whole audit UID/order inventory mismatch');
  const selected=records.get(component.questionUid);
  if (!selected || selected.sourceOrdinal !== component.sourceOrdinal || !uniqueStrings(selected.crossConceptKeys) ||
      !selected.crossConceptKeys.length || selected.crossConceptKeys.includes(component.addCrossConceptKey) ||
      selected.crossConceptApprovalComponents !== undefined) fail('one new CC must append to an exact existing audited array');
  const combined=[...selected.crossConceptKeys,component.addCrossConceptKey], assetMap=new Map();
  const assetPaths=[...new Set(bank.flatMap(referencedAssets))], assetInputs=assetPaths.flatMap(p=>[
    {commit:spec.priorCommit,path:p},...snapshot.sourceSnapshots.map(history=>({commit:history.commit,path:p}))]);
  const assetBytes=readImmutableGitFiles(root,assetInputs), assetsPerPath=1+snapshot.sourceSnapshots.length;
  const freshAssets=new Map(assetPaths.map((p,i)=>[p,assetBytes.slice(i*assetsPerPath,(i+1)*assetsPerPath)]));
  for (let i=0;i<bank.length;i++) {
    const old=prior.appliedRecords[i],oldQ=oldBank[i],q=bank[i],patch=request.items[i],id=identities.get(old.questionUid),rt=runtimes.get(old.questionUid);
    if (old.sourceOrdinal!==i+1 || patch.sourceOrdinal!==i+1 || !isPreservableAuditRecord(old) ||
        old.sourceArchiveFile!==request.sourceArchiveFile || !id || !rt ||
        old.sourceFingerprint!==fp(oldQ) || old.contentFingerprint!==cf(oldQ) || id.sourceFingerprint!==old.sourceFingerprint ||
        rt.sourceFingerprint!==old.sourceFingerprint || rt.contentFingerprint!==old.contentFingerprint ||
        rt.approvedSourceFingerprint!==old.sourceFingerprint || !same(rt.crossConceptKeys,old.crossConceptKeys) ||
        old.crossConceptApprovalComponents!==undefined || rt.crossConceptApprovalComponents!==undefined ||
        !old.approvalEvidence?.includes(priorRef.path)) fail('original audit row/source/identity/runtime mismatch');
    const itemRefs=refs(root,patch.evidenceRefs);
    if (!bound(itemRefs,priorRef)) fail('each retained UID must bind its actual prior audit');
    const expected=i+1===component.sourceOrdinal ? {...oldQ,crossConceptKeys:combined} : oldQ;
    if (!same(q,expected) || fp(q)!==old.sourceFingerprint || cf(q)!==old.contentFingerprint)
      fail('only the selected source CC array may change; every other source value must remain exact');
    const questionAssets=referencedAssets(q);
    for (const history of snapshot.sourceSnapshots)
      if (history.bank.length!==bank.length || !same(referencedAssets(history.bank[i]),questionAssets))
        fail('whole-source renderer references differ from the original audit history');
    for (const p of questionAssets) {
      if (!assetMap.has(p)) {
        const [original,...historicalBytes]=freshAssets.get(p),current=fs.readFileSync(safe(root,p)),hash=sha(original);
        if (sha(current)!==hash) fail('whole-source renderer bytes and explicit dependencies must remain unchanged');
        const auditHistory=snapshot.sourceSnapshots.map((history,historyIndex)=>{
          const raw=historicalBytes[historyIndex];
          if (sha(raw)!==hash) fail('whole-source renderer bytes differ from the original audit history');
          return {commit:history.commit,receiptRef:history.receiptRef,sha256:hash,gitBlobSha1:blob(raw)};
        });
        if (/\.svg$/i.test(p)) {
          const svg=original.toString('utf8'),dependencies=[
            ...[...svg.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]),
            ...[...svg.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m=>m[1])];
          if (/@import\b|<!ENTITY\b|<!DOCTYPE\b|<\?xml-stylesheet\b|<(?:foreignObject|script|animate\w*|set|discard)\b/i.test(svg) ||
              /\\/.test(svg) ||
              dependencies.some(ref=>!ref.startsWith('#')&&!/^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(ref)))
            fail('unsupported nested SVG dependency');
        }
        assetMap.set(p,{path:p,sha256:hash,gitBlobSha1:blob(original),auditHistory});
      }
      const checked=assetMap.get(p);
      if (approvalRefs.get(p)!==checked.sha256 || itemRefs.get(p)!==checked.sha256)
        fail('whole-source renderer bytes and explicit dependencies must remain unchanged');
    }
  }
  const proof=validateReviewedAuditCrossConceptComponent({root,request,component,
    evidenceRefs:patches.get(component.questionUid).evidenceRefs,question:bank[component.sourceOrdinal-1],
    prior:selected,canonicalBefore,canonicalAfter});
  const definition=canonicalAfter?.cc?.get(component.addCrossConceptKey);
  if (definition?.status!=='ACTIVE' || sha(stable(definition))!==proof.proposalFinalization.definitions[0].definitionSha256)
    fail('exact finalized CC must be ACTIVE in the planned/current registry');
  for (const key of selected.crossConceptKeys) if (canonicalAfter?.cc?.get(key)?.status!=='ACTIVE' ||
      canonicalBefore?.cc && !same(canonicalBefore.cc.get(key),canonicalAfter.cc.get(key))) fail('retained audited CC definition changed');
  if ((request.registryChanges||[]).some(change=>change.path!==proof.proposalFinalization.definitions[0].path ||
      change.collection!=='concepts' || !same(change.match,{conceptKey:component.addCrossConceptKey}) ||
      change.before!==null || !same(change.after,definition))) fail('only the exact independently finalized ADD definition is permitted');
  return {root,request,bytes,bank,oldBank,prior,priorRef,records,identities,runtimes,patches,selected,combined,proof,
    assets:[...assetMap.values()].sort((a,b)=>a.path.localeCompare(b.path)),
    bindingPath:auditCcBindingPath(request.requestId),consumerParents:snapshot.context.consumerParents};
}

function components(context) {
  return {schemaVersion:COMPONENT_SCHEMA,
    retained:{approvalType:'META_PIPELINE_AUDIT',receiptRef:context.priorRef,keys:context.selected.crossConceptKeys,
      recordSha256:sha(stable(context.selected))},
    appended:{key:context.request.approval.sourceRebind.component.addCrossConceptKey,
      nativeReview:context.proof.nativeReview,finalizationRef:context.proof.proposalFinalization.finalizationRef,
      componentProofSha256:sha(stable(context.proof)),newMathematicalQa:false,newDifficultyJudgments:0}};
}
export function planAuditCcAppendRow(context,{current,identity,runtime,question,ordinal,receiptPath,replay=false}) {
  const old=context.records.get(current.questionUid),oldId=context.identities.get(current.questionUid),oldRt=context.runtimes.get(current.questionUid);
  if (!old || old.sourceOrdinal!==ordinal || !same(question,context.bank[ordinal-1]) ||
      receiptPath!==RECEIPTS+context.request.requestId+'.json') fail('exact retained audit row required');
  const selected=old.questionUid===context.selected.questionUid;
  const evidence=[...old.approvalEvidence,receiptPath,context.bindingPath];
  if (new Set(evidence).size!==evidence.length) fail('duplicate/cyclic appended provenance');
  const revision=`meta-foundation:${old.metaFoundationPackId}@${old.metaFoundationPackVersion}:audit-finalized-cc-append-v1:${context.request.requestId}`;
  const delta={metadataRevision:revision,approvalEvidence:evidence,
    ...(selected?{crossConceptKeys:context.combined,crossConceptApprovalComponents:components(context)}:{})};
  const final={...structuredClone(old),...structuredClone(delta)},runtimeAfter={...structuredClone(oldRt),...structuredClone(delta)};
  if (!same(current,replay?final:old) || !same(identity,oldId) || !same(runtime,replay?runtimeAfter:oldRt))
    fail('current metadata, identity or runtime differs from the exact component operation');
  return {final,identityAfter:structuredClone(oldId),runtimeAfter};
}

export function buildAuditCcAppendBinding(context,requestSha256=sha(stable(context.request))) {
  return {schemaVersion:AUDIT_CC_BINDING_SCHEMA,requestId:context.request.requestId,requestSha256,
    requestSnapshot:structuredClone(context.request),priorReceiptRef:context.priorRef,
    sourceArchiveFile:context.request.sourceArchiveFile,expectedQuestionCount:context.bank.length,
    priorSourceBlobSha1:context.prior.sourceBlobSha1,sourceBlobSha1:blob(context.bytes),sourceRawSha256:sha(context.bytes),
    newMetadataApprovals:0,preservedMetadataApprovals:context.bank.length,finalizedCrossConceptApplications:1,
    originalApprovalType:'META_PIPELINE_AUDIT',componentProof:context.proof,components:components(context),
    assets:context.assets,records:context.prior.appliedRecords.map((r,i)=>({questionUid:r.questionUid,sourceOrdinal:i+1,
      priorMetadataSha256:sha(stable(r)),priorIdentitySha256:sha(stable(context.identities.get(r.questionUid))),
      priorRuntimeSha256:sha(stable(context.runtimes.get(r.questionUid))),
      priorWholeQuestionSha256:sha(stable(context.oldBank[i])),wholeQuestionSha256:sha(stable(context.bank[i])),
      retainedCrossConceptKeys:r.crossConceptKeys,
      appendedCrossConceptKeys:r.questionUid===context.selected.questionUid?[context.request.approval.sourceRebind.component.addCrossConceptKey]:[]}))};
}
export function auditCcAppendSummary(context) {
  return {schemaVersion:AUDIT_CC_APPEND_SCHEMA,bindingPath:context.bindingPath,priorReceiptRef:context.priorRef,
    preservedApprovalType:'META_PIPELINE_AUDIT',newMetadataApprovals:0,preservedMetadataApprovals:context.bank.length,
    finalizedCrossConceptApplications:1,appendedQuestionUid:context.selected.questionUid,
    appendedCrossConceptKey:context.request.approval.sourceRebind.component.addCrossConceptKey};
}
export function assertAuditCcAppendReceipt(context,receipt) {
  const request=context.request,hash=sha(stable(request)),count=context.bank.length;
  if (!exactKeys(receipt,['schemaVersion','requestId','requestSha256','examUid','sourceArchiveFile','sourceBlobSha1','sourceRawSha256',
      'approval','metaPipelineAudit','auditCrossConceptAppend','metadataRegistrationStatus','examFinalQaStatus','consumerSearchStatus',
      'totalQuestions','registryChanges','appliedRecords','appliedIdentityRecords','fingerprintRepairs','runtimeRecords','outputDigests',
      'newMetadataApprovals','preservedMetadataApprovals']) ||
      receipt.schemaVersion!=='archive-reviewed-exam-meta-registration-v2' || receipt.requestId!==request.requestId ||
      receipt.requestSha256!==hash || !same(receipt.approval,request.approval) || receipt.scope!==undefined ||
      receipt.registrationMode!==undefined || receipt.partialUidCount!==undefined || receipt.totalQuestions!==count ||
      receipt.sourceArchiveFile!==request.sourceArchiveFile || receipt.examUid!==request.examUid ||
      receipt.sourceBlobSha1!==blob(context.bytes) || receipt.sourceRawSha256!==sha(context.bytes) ||
      receipt.metadataRegistrationStatus!=='REGISTERED' || receipt.examFinalQaStatus!=='NOT_EVALUATED_BY_REGISTRAR' ||
      receipt.newMetadataApprovals!==0 || receipt.preservedMetadataApprovals!==count ||
      receipt.fingerprintRepairs?.length!==0 || !same(receipt.registryChanges,request.registryChanges||[]) ||
      !same(receipt.metaPipelineAudit,context.prior.metaPipelineAudit) ||
      !same(receipt.auditCrossConceptAppend,auditCcAppendSummary(context))) fail('issued component receipt binding/count/provenance drift');
  const raw=fs.readFileSync(safe(context.root,context.bindingPath));
  const digests=receipt.outputDigests?.filter(r=>r.path===context.bindingPath);
  if (digests?.length!==1 || digests[0].sha256!==sha(raw) ||
      !same(parseCurrentJson(raw),buildAuditCcAppendBinding(context,hash))) fail('durable component sidecar missing or changed');
  const records=inventory(receipt.appliedRecords,'issued metadata'),ids=inventory(receipt.appliedIdentityRecords,'issued identity'),
    runtimes=inventory(receipt.runtimeRecords,'issued runtime');
  if ([records,ids,runtimes].some(m=>m.size!==count) ||
      !same(receipt.appliedRecords.map(r=>r.questionUid),request.items.map(r=>r.questionUid))) fail('issued whole-source inventory drift');
  for (const [uid,old] of context.records) planAuditCcAppendRow(context,{current:records.get(uid),identity:ids.get(uid),
    runtime:runtimes.get(uid),question:context.bank[old.sourceOrdinal-1],ordinal:old.sourceOrdinal,
    receiptPath:RECEIPTS+request.requestId+'.json',replay:true});
}

function receiptCandidates(current,runtime) {
  const result=new Set([current,runtime].flatMap(r=>r?.approvalEvidence||[]));
  for (const r of [current,runtime]) {
    const id=r?.metadataRevision?.match(/:(?:audit-finalized-cc-append-v1|exam-meta_pipeline_audit-v2):([A-Za-z0-9][A-Za-z0-9_-]{0,100})$/)?.[1];
    if (id) result.add(RECEIPTS+id+'.json');
  }
  return [...result].filter(p=>typeof p==='string' && p.startsWith(RECEIPTS) &&
    /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.json$/.test(p.slice(RECEIPTS.length)));
}

export function nativeAuditCcAppend({nativeSource,question,previous,current,identity,ordinal,registry,pt,tpl,ownerPack}) {
  const {root,bytes,bank,runtimeRecord}=nativeSource;
  if (!isPreservableAuditRecord(current) || current.metaFoundationPackId!==ownerPack ||
      current.L3!==pt?.canonicalLabelKo || current.L4!==tpl?.canonicalLabelKo) return null;
  for (const p of receiptCandidates(current,runtimeRecord)) {
    try {
      const receipt=read(root,p);
      if (!isAuditCcAppend(receipt.approval)) continue;
      const matches=receipt.appliedRecords.filter(r=>r.questionUid===current.questionUid);
      if (matches.length!==1 || !same(matches[0],current)) fail('native current component row drift');
      if (receipt.sourceRawSha256!==sha(bytes) || receipt.sourceBlobSha1!==blob(bytes))
        fail('native component source bytes drift');
      const ids=receipt.appliedIdentityRecords.filter(r=>r.questionUid===current.questionUid),
        runtimes=receipt.runtimeRecords.filter(r=>r.questionUid===current.questionUid);
      if (ids.length!==1 || !same(ids[0],identity) || runtimes.length!==1 || !same(runtimes[0],runtimeRecord))
        fail('native component identity or runtime drift');
      const binding=read(root,auditCcBindingPath(receipt.requestId)),request=binding.requestSnapshot;
      if (p!==RECEIPTS+request?.requestId+'.json' || request.sourceArchiveFile!==current.sourceArchiveFile ||
          receipt.requestSha256!==sha(stable(request))) fail('native component request missing');
      const tables={pt:registry.problemTypes,tpl:registry.templates,cc:registry.concepts,cond:registry.conditions};
      const context=loadAuditCcAppend({root,request,bytes,bank,canonicalBefore:tables,canonicalAfter:tables});
      assertAuditCcAppendReceipt(context,receipt);
      planAuditCcAppendRow(context,{current,identity,runtime:runtimeRecord,question,ordinal,receiptPath:p,replay:true});
      if (!same(pick(previous,REASSESSED_STUDENT_FIELDS),pick(question,REASSESSED_STUDENT_FIELDS)))
        fail('component operation cannot approve changed student input');
      return p;
    } catch { /* Missing/changed audit, component or source proof grants nothing. */ }
  }
  return null;
}

// A source declaration can predate the original audit (for example a broad
// template or an incomplete CC array). Preserve that audit's field precedence
// only after replaying both authorities and every current row of the full
// source. A revision label selects work; it never grants this precedence.
export function verifiedAuditCcSourcePrecedence({root,source,bytes,bank,metadataRows,identityRows}) {
  const empty=()=>new Map();
  if (!Array.isArray(metadataRows) || !metadataRows.some(row=>
      row.crossConceptApprovalComponents!==undefined ||
      /:audit-finalized-cc-append-v1:/.test(row.metadataRevision||'') ||
      row.approvalEvidence?.some(p=>typeof p==='string'&&p.endsWith('.audit-cc-append.json')))) return empty();
  try {
    const sourcePath='archive/exams/'+source;
    if (!Buffer.isBuffer(bytes) || !bytes.equals(fs.readFileSync(safe(root,sourcePath))) ||
        !same(bank,bankFrom(bytes))) return empty();
    const actualMetadata=read(root,'archive/data/question_metadata.json').records;
    const actualIdentities=read(root,'archive/data/question_identity_map.json').records;
    const sourceRows=rows=>rows.filter(r=>r.sourceArchiveFile===source).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
    if (!same(sourceRows(actualMetadata),sourceRows(metadataRows)) ||
        !Array.isArray(identityRows) || !same(sourceRows(actualIdentities),sourceRows(identityRows)) ||
        sourceRows(actualMetadata).length!==bank.length || sourceRows(actualIdentities).length!==bank.length) return empty();
    const current=inventory(actualMetadata,'current catalog metadata'),identities=inventory(actualIdentities,'current catalog identity');
    const registry=loadActiveMetaRegistry(root);
    if (registry.status!=='ACTIVE') return empty();
    const tables={pt:registry.problemTypes,tpl:registry.templates,cc:registry.concepts,cond:registry.conditions};
    const runtimeRows=new Map(),runtimeDir='archive/data/meta-foundation/runtime';
    for (const file of fs.readdirSync(safe(root,runtimeDir)).filter(p=>p.endsWith('.json'))) {
      const pack=read(root,runtimeDir+'/'+file);
      if (!Array.isArray(pack.records)) continue;
      for (const row of pack.records) if (row.sourceArchiveFile===source) {
        if (runtimeRows.has(row.questionUid)) return empty();
        runtimeRows.set(row.questionUid,{row,pack});
      }
    }
    if (runtimeRows.size!==bank.length) return empty();
    const candidates=new Set(metadataRows.flatMap(row=>receiptCandidates(row,null)));
    let accepted=null;
    for (const receiptPath of candidates) {
      let receipt;
      try {receipt=read(root,receiptPath);} catch {continue;}
      if (!isAuditCcAppend(receipt.approval)) continue;
      const binding=read(root,auditCcBindingPath(receipt.requestId)),request=binding.requestSnapshot;
      if (request?.sourceArchiveFile!==source || receiptPath!==RECEIPTS+request?.requestId+'.json') return empty();
      const context=loadAuditCcAppend({root,request,bytes,bank,canonicalBefore:tables,canonicalAfter:tables});
      assertAuditCcAppendReceipt(context,receipt);
      const checked=new Map();
      for (const item of request.items) {
        const row=current.get(item.questionUid),identity=identities.get(item.questionUid),runtime=runtimeRows.get(item.questionUid);
        const active=registry.activePacks.get(row?.metaFoundationPackId);
        // The ACTIVE container may have gained definitions since the original
        // audit. Its version must match the registry; each retained row keeps
        // its own historical approval version, checked by the exact replay.
        if (!row || !runtime || runtime.pack.status!=='ACTIVE' || runtime.pack.packId!==row.metaFoundationPackId ||
            !active || active.status!=='ACTIVE' || !text(active.version) || !text(runtime.pack.packVersion) ||
            active.version!==runtime.pack.packVersion) return empty();
        const question=bank[item.sourceOrdinal-1];
        planAuditCcAppendRow(context,{current:row,identity,runtime:runtime.row,question,ordinal:item.sourceOrdinal,receiptPath,replay:true});
        const fields=new Map();
        for (const [field,value] of Object.entries(row)) {
          const sourceValue=question[field];
          if (sourceValue!==undefined&&sourceValue!==null&&String(sourceValue).trim()!==''&&!same(sourceValue,value))
            fields.set(field,{sourceValue:structuredClone(sourceValue),registeredValue:structuredClone(value)});
        }
        checked.set(row.questionUid,fields);
      }
      // Nothing is exposed until all selected and non-selected rows passed.
      if (accepted) return empty();
      accepted=checked;
    }
    return accepted||empty();
  } catch {return empty();}
}

export function auditCcSourceFieldIsVerified(precedence,questionUid,field,sourceValue,registeredValue) {
  const bound=precedence?.get(questionUid)?.get(field);
  return Boolean(bound)&&same(bound.sourceValue,sourceValue)&&same(bound.registeredValue,registeredValue);
}

export function hasExplicitAuditCcAppendClaim({root,current,runtimeRecord}) {
  for (const row of [current,runtimeRecord]) if (row?.crossConceptApprovalComponents!==undefined ||
      /:audit-finalized-cc-append-v1:/.test(row?.metadataRevision||'') ||
      row?.approvalEvidence?.some(p=>typeof p==='string' && p.endsWith('.audit-cc-append.json'))) return true;
  for (const p of receiptCandidates(current,runtimeRecord)) {
    try {
      const receipt=read(root,p);
      if (receipt.auditCrossConceptAppend!==undefined || receipt.approval?.sourceRebind?.schemaVersion===AUDIT_CC_APPEND_SCHEMA) return true;
    } catch { /* A removed marker is handled by the original authority below. */ }
  }
  return false;
}

// Cache only immutable Git inventories, never a successful authority check or
// mutable working-file evidence. Losing or forging every current provenance
// field cannot hide the already committed original full audit for this source.
const auditAuthorityIndexes=new Map();
function immutableAuditAuthorities(root,source) {
  const head=git(root,['rev-parse','HEAD']).toString().trim(),key=path.resolve(root)+'\0'+head;
  if (!auditAuthorityIndexes.has(key)) {
    const bySource=new Map();
    const paths=git(root,['ls-tree','-r','--name-only',head,'--',RECEIPTS]).toString().split('\n');
    for (const p of paths) {
      if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.json$/.test(p.slice(RECEIPTS.length))) continue;
      try {
        const raw=git(root,['show',head+':'+p]),receipt=JSON.parse(raw);
        if (!isAuditPreservation(receipt.approval) || receipt.scope!==undefined ||
            receipt.metadataRegistrationStatus!=='REGISTERED' || !text(receipt.sourceArchiveFile)) continue;
        if (!bySource.has(receipt.sourceArchiveFile)) bySource.set(receipt.sourceArchiveFile,[]);
        bySource.get(receipt.sourceArchiveFile).push({path:p,sha256:sha(raw),receipt});
      } catch { /* A malformed record cannot become an old authority. */ }
    }
    auditAuthorityIndexes.set(key,bySource);
    if (auditAuthorityIndexes.size>8) auditAuthorityIndexes.delete(auditAuthorityIndexes.keys().next().value);
  }
  return auditAuthorityIndexes.get(key).get(source)||[];
}

// This is an obligation check after actual native receipt reuse has failed.
// Immutable original authority, not the presence of mutable issued markers,
// bounds the CC array. No result from this function approves any record.
export function hasAuditCcAppendClaim({root,current,runtimeRecord,nativeSource}) {
  if (hasExplicitAuditCcAppendClaim({root,current,runtimeRecord})) return true;
  if (!current?.questionUid || !current.sourceArchiveFile || !nativeSource?.bank) return false;
  let authorities;
  try {authorities=immutableAuditAuthorities(root,current.sourceArchiveFile);}
  catch {return current.metadataApprovalType==='META_PIPELINE_AUDIT';}
  for (const {path:p,sha256:receiptSha,receipt} of authorities) {
    try {
      if (receipt.approval?.type!=='META_PIPELINE_AUDIT' || receipt.scope!==undefined || !Array.isArray(receipt.appliedRecords) ||
          receipt.sourceArchiveFile!==current.sourceArchiveFile || !SHA1.test(receipt.sourceBlobSha1||'')) continue;
      const prior=receipt.appliedRecords.find(r=>r.questionUid===current.questionUid);
      if (!prior || !isPreservableAuditRecord(prior)) continue;
      if (isAuditPreservation(receipt.approval) && [current,runtimeRecord].some(row=>
          row?.questionUid===prior.questionUid && !same(row.crossConceptKeys,prior.crossConceptKeys))) {
        try {
          const revision=git(root,['log','-1','--format=%H','HEAD','--',p]).toString().trim();
          const authority=loadVerifiedHistoricalAuditSnapshot({root,priorCommit:revision,
            priorReceiptRef:{path:p,sha256:receiptSha}});
          const original=authority.prior.appliedRecords.find(row=>row.questionUid===current.questionUid);
          if (!original || !same(original.crossConceptKeys,prior.crossConceptKeys)) fail('original audit CC authority drift');
        } catch {
          // Failure to replay an explicitly claimed old authority is also a
          // missing-proof obligation. It is never a producer fallback waiver.
          return true;
        }
        return true;
      }
      const oldBank=bankFrom(git(root,['cat-file','blob',receipt.sourceBlobSha1]));
      if (oldBank.length!==nativeSource.bank.length || receipt.totalQuestions!==oldBank.length) continue;
      let additions=0,valid=true;
      for (let i=0;i<oldBank.length;i++) {
        const oldQ=oldBank[i],q=nativeSource.bank[i];
        if (same(oldQ,q)) continue;
        const old=receipt.appliedRecords.find(r=>r.sourceOrdinal===i+1),keys=q.crossConceptKeys;
        if (!same({...oldQ,crossConceptKeys:keys},q) || !uniqueStrings(old?.crossConceptKeys) ||
            !uniqueStrings(keys) || keys.length!==old.crossConceptKeys.length+1 ||
            !same(keys.slice(0,-1),old.crossConceptKeys)) {valid=false;break;}
        additions++;
      }
      if (valid && additions===1) return true;
    } catch { /* Explicit durable markers above still preserve their obligation. */ }
  }
  return false;
}
