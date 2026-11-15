// Revalidate an issued opt-in source review before AutoMeta reuses its approval.
// This read-only check grants neither a new approval nor a student-change exception.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { loadCanonical } from './compile-meta-foundation.mjs';
import { createExactJsonByteParser } from './exact-json-byte-parser.mjs';
import { validateReviewedSourceReassessment } from './reviewed-source-reassessment.mjs';
import { validateNativeReviewedParent } from './reviewed-native-parent.mjs';
import { REVIEWED_META_VALUE_FIELDS } from './reviewed-meta-value-fields.mjs';
import { REVIEWED_SOURCE_BINDING_OPT_INS, hasReviewedReceiptLineage, reviewedSourceBindingItems, reviewedSourceBindingPath,
  buildReviewedSourceBinding } from './reviewed-source-binding.mjs';
import { restoreReviewedReplayCanonicalBefore } from './reviewed-replay-registry-context.mjs';
import { isSourceSubsetRebind, validateSourceSubsetEvidence, preservedSourceEvidence } from './source-subset-preservation.mjs';
import { isIssuedSourceBindingRecovery, validateIssuedSourceBindingRecovery } from './issued-source-binding-recovery.mjs';
import { hasImmutableM2CurrentRendererClaim } from './reviewed-m2-current-renderer-continuity.mjs';

const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const INDEX = 'archive/data/meta-foundation/canonical/registry_index.json';
const MASTER = 'archive/data/master_tables/js_archive_tag_master.json';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
const fail = message => { throw Error(`native reviewed source reuse: ${message}`); };
const fullFp = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const bodyFp = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
const caches = new Map(), supportedFields = new Set(REVIEWED_META_VALUE_FIELDS);
const marker = p => typeof p === 'string' && p.startsWith(RECEIPTS) && /\/[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.source-review-binding\.json$/.test(p);
const markers = row => (Array.isArray(row?.approvalEvidence) ? row.approvalEvidence : []).filter(marker);
const typedProof = (receipt, uid) => receipt.fingerprintRepairs?.some(repair => repair.questionUid === uid &&
  (REVIEWED_SOURCE_BINDING_OPT_INS.some(({proofKey}) => repair.sourceReview?.[proofKey] !== undefined) ||
    hasReviewedReceiptLineage(receipt) && repair.sourceReview !== undefined)) ||
  receipt.nativeParentBindings?.some(row => row.questionUid === uid);

function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') ||
      /[\x00-\x1f]/.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence path');
  return full;
}
const bytes = (root, relative) => fs.readFileSync(safePath(root, relative));
const read = (root, relative) => JSON.parse(bytes(root, relative).toString('utf8'));
function evidence(root, refs) {
  if (!Array.isArray(refs) || !refs.length) fail('SHA-bound approval evidence required');
  for (const ref of refs) if (!SHA256.test(ref.sha256 || '') || sha(bytes(root, ref.path)) !== ref.sha256)
    fail('current evidence missing or changed');
}
function unique(rows, key, label) {
  if (!Array.isArray(rows)) fail(`${label} inventory missing`);
  const result = new Map();
  for (const row of rows) { const id = key(row); if (!id || result.has(id)) fail(`${label} identity missing or duplicate`); result.set(id, row); }
  return result;
}

// A durable marker must also stop the ordinary producer fallback if the native
// receipt itself is missing, changed or no longer passes its earlier checks.
export function hasNativeReviewedSourceClaim({root, current, runtimeRecord}) {
  if (hasImmutableM2CurrentRendererClaim({root,current,runtimeRecord})) return true;
  if (markers(current).length || markers(runtimeRecord).length) return true;
  const candidates=new Set([current,runtimeRecord].flatMap(row=>Array.isArray(row?.approvalEvidence)?row.approvalEvidence:[]));
  for (const row of [current,runtimeRecord]) {
    const id=typeof row?.metadataRevision==='string' && row.metadataRevision.match(/:exam-final_qa-v2:([A-Za-z0-9][A-Za-z0-9_-]{0,100})$/)?.[1];
    if(id)candidates.add(RECEIPTS+id+'.json');
  }
  const pending=[...candidates].map(p=>({path:p,depth:0})),seen=new Set();
  for (let i=0;i<pending.length;i++) {
    const {path:p,depth}=pending[i];
    if (typeof p !== 'string' || !p.startsWith(RECEIPTS) || !p.endsWith('.json')) continue;
    const id=p.slice(RECEIPTS.length,-5);
    if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(id))continue;
    if(seen.has(p))continue;
    if(depth>=64)return true;
    seen.add(p);
    let receipt;
    try { receipt=read(root,p);if(typedProof(receipt,current.questionUid))return true; } catch { /* Check its reserved sidecar even if the receipt was removed. */ }
    // A source-only descendant can lose all inherited row markers. Its explicit
    // prior receipt still carries the original target's obligation. This is only
    // claim detection; the verifier below authenticates the full chain and SHA.
    const prior=receipt?.approval?.sourceRebind?.priorReceiptRef;
    if(prior?.path)pending.push({path:prior.path,depth:depth+1});
    const bindingPath=reviewedSourceBindingPath(id),digests=Array.isArray(receipt?.outputDigests)?receipt.outputDigests.filter(ref=>ref.path===bindingPath):[];
    const exists=fs.existsSync(safePath(root,bindingPath));
    if(!exists){if(digests?.length)return true;continue;}
    try {
      const raw=bytes(root,bindingPath),bound=JSON.parse(raw);
      if(digests?.length&&(digests.length!==1||digests[0].sha256!==sha(raw)))return true;
      if(bound.schemaVersion!=='archive-reviewed-source-binding-v1'||bound.requestId!==id||!Array.isArray(bound.records))return true;
      if(bound.records.some(row=>row.questionUid===current.questionUid)||
          reviewedSourceBindingItems(bound.requestSnapshot).some(row=>row.questionUid===current.questionUid))return true;
      // A valid sidecar may belong only to other selected UIDs of the same receipt.
    } catch { return true; }
  }
  return false;
}

const parseCurrentTable = createExactJsonByteParser();
function currentTables(root, registry) {
  const currentBytes=new Map([[INDEX,bytes(root,INDEX)]]);
  if (registry?.status !== 'ACTIVE' || !same(parseCurrentTable(currentBytes.get(INDEX)), registry.files?.index)) fail('current ACTIVE registry changed');
  // Read and authenticate every live file on every call. Only parsing of exact
  // equal bytes is shared; no witness, asset, registry or approval check is cached.
  for (const entry of [...registry.files.index.canonicalSources, ...registry.files.index.compiledArtifacts]) {
    const raw=bytes(root,entry.path);currentBytes.set(entry.path,raw);
    const actual = sha(Buffer.from(raw.toString('utf8').replaceAll('\r\n', '\n')));
    if (actual !== String(entry.sha256).replace(/^sha256:/, '')) fail('current registry digest mismatch');
  }
  const canonical = loadCanonical(p => parseCurrentTable(currentBytes.get(p) ?? bytes(root,p)));
  return { pt:registry.problemTypes, tpl:registry.templates, cc:registry.concepts, cond:registry.conditions,
    packs:unique(canonical.packs, p => p.meta.packId, 'pack'),
    master:unique(parseCurrentTable(bytes(root,MASTER)).filter(r => ['standardUnitKey','subUnitKey'].includes(r.keyType)), r => r.key, 'master'),
    bindings:unique(registry.bindingRows.filter(r=>r.status==='ACTIVE'), r => stable([r.curriculum,r.standardCourse,r.standardUnitKey,r.subUnitKey??null,r.problemTypeKey]), 'binding') };
}

function selected(receipt, uid, ordinal) {
  const records = unique(receipt.appliedRecords, r => r.questionUid, 'metadata'),
    identities = unique(receipt.appliedIdentityRecords, r => r.questionUid, 'identity'),
    runtimes = unique(receipt.runtimeRecords, r => r.questionUid, 'runtime');
  if (receipt.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || receipt.metadataRegistrationStatus !== 'REGISTERED' ||
      receipt.scope !== 'PARTIAL_UIDS' || receipt.approval?.type !== 'FINAL_QA' || receipt.approval.metadataReviewed !== true ||
      !String(receipt.approval.approvedBy || '').trim() || receipt.registrationMode !== undefined ||
      !SHA256.test(receipt.requestSha256 || '') || !SHA1.test(receipt.sourceBlobSha1 || '') || !SHA256.test(receipt.sourceRawSha256 || '') ||
      !Number.isInteger(receipt.expectedQuestionCount) || receipt.expectedQuestionCount < receipt.partialUidCount ||
      !Number.isInteger(receipt.partialUidCount) || receipt.partialUidCount < 1 || receipt.totalQuestions !== receipt.partialUidCount ||
      [records, identities, runtimes].some(map => map.size !== receipt.partialUidCount || !same([...map.keys()].sort(), [...records.keys()].sort())) ||
      new Set([...records.values()].map(r => r.sourceOrdinal)).size !== records.size)
    fail('exact partial FINAL_QA selected/full inventory required');
  for (const [id, record] of records) if (record.sourceArchiveFile !== receipt.sourceArchiveFile ||
      !Number.isInteger(record.sourceOrdinal) || record.sourceOrdinal < 1 || record.sourceOrdinal > receipt.expectedQuestionCount ||
      identities.get(id).sourceArchiveFile !== receipt.sourceArchiveFile || identities.get(id).sourceOrdinal !== record.sourceOrdinal ||
      runtimes.get(id).sourceArchiveFile !== receipt.sourceArchiveFile || runtimes.get(id).sourceOrdinal !== record.sourceOrdinal)
    fail('selected UID/source ordinal mismatch');
  const row = records.get(uid);
  if (row?.sourceOrdinal !== ordinal) fail('selected target missing');
  return {records, identities, runtimes, row, identity:identities.get(uid), runtime:runtimes.get(uid)};
}

function validateDirect(receipt, context) {
  const {root, current, runtimeRecord, question, identity, ordinal, tables, cache} = context;
  const bindingPath = reviewedSourceBindingPath(receipt.requestId), boundBytes = bytes(root, bindingPath);
  const digests = receipt.outputDigests?.filter(ref => ref.path === bindingPath);
  if (digests?.length !== 1 || digests[0].sha256 !== sha(boundBytes)) fail('source-review sidecar digest missing or changed');
  const bound = JSON.parse(boundBytes), request = bound.requestSnapshot;
  if (!same(bound, buildReviewedSourceBinding({request, ...receipt})) || !same(request.approval, receipt.approval) ||
      !same(request.registryChanges || [], receipt.registryChanges || []) || request.examUid !== receipt.examUid)
    fail('source-review sidecar differs from its issued request and receipt');
  const inventory = selected(receipt, identity.questionUid, ordinal);
  const requestItems = unique(request.items, row => row.questionUid, 'request');
  if (!same([...requestItems.keys()].sort(), [...inventory.records.keys()].sort()) ||
      [...requestItems].some(([uid, item]) => item.sourceOrdinal !== inventory.records.get(uid).sourceOrdinal))
    fail('request and receipt UID inventories differ');
  for (const item of bound.records) for (const rows of [inventory.records, inventory.runtimes])
    if (!rows.get(item.questionUid)?.approvalEvidence?.includes(bindingPath)) fail('sidecar absent from registered metadata/runtime provenance');
  const patches = reviewedSourceBindingItems(request).filter(p => p.questionUid === identity.questionUid && p.sourceOrdinal === ordinal);
  if (patches.length !== 1 || !current.approvalEvidence?.includes(bindingPath) || !runtimeRecord.approvalEvidence?.includes(bindingPath))
    fail('typed target missing its durable provenance');
  evidence(root, request.approval.evidenceRefs);
  const patch = patches[0]; evidence(root, patch.evidenceRefs);
  const repairs = receipt.fingerprintRepairs.filter(r => r.questionUid === identity.questionUid && r.sourceOrdinal === ordinal);
  const repair = repairs[0], after = {sourceFingerprint:fullFp(question),contentFingerprint:bodyFp(question)};
  if (repairs.length !== 1 || repair.rebind !== undefined || !same(repair.after, after) || identity.sourceFingerprint !== after.sourceFingerprint ||
      !same(repair.metadataBefore, {sourceFingerprint:patch.before?.sourceFingerprint ?? null,contentFingerprint:patch.before?.contentFingerprint ?? null}) ||
      !SHA256.test(repair.identityBefore?.sourceFingerprint || '') ||
      patch.identityBefore !== undefined && !same(patch.identityBefore, repair.identityBefore) ||
      patch.after?.sourceFingerprint !== after.sourceFingerprint ||
      Object.entries(patch.after).some(([key, value]) => !same(current[key] ?? null, value ?? null)))
    fail('registered request/fingerprint repair drift');
  const beforeTables = restoreReviewedReplayCanonicalBefore({request, currentTables:tables, root});
  const proof = validateReviewedSourceReassessment({root, request, patch, metadata:{...current,...patch.before},
    question, final:current, supportedFields, canonicalBefore:beforeTables, canonicalAfter:tables, cache});
  if (!same(proof, repair.sourceReview)) fail('current source-review proof differs from issued proof');
  if (patch.targetParentRef?.nativeSourceReview !== undefined) {
    const curriculum = current.curriculum || current.curriculumKey, course = current.standardCourse || current.courseKey;
    const binding = tables.bindings.get(stable([curriculum,course,current.standardUnitKey,current.subUnitKey??null,current.problemTypeKey]));
    const pt = tables.pt.get(current.problemTypeKey), tpl = tables.tpl.get(current.templateKey);
    const parent = validateNativeReviewedParent({root, request, patch, row:current, sourceReview:proof,
      resolved:{curriculum,course,binding,pt,tpl,pack:tables.packs.get(binding?.ownerPack || pt?.ownerPack)}});
    const issued = receipt.nativeParentBindings?.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
    if (issued?.length !== 1 || !same(parent, issued[0])) fail('current native parent proof differs');
  }
  return bindingPath;
}

function priorBank(root, receipt) {
  let raw;
  try { raw = execFileSync('git', ['cat-file','blob',receipt.sourceBlobSha1], {cwd:root,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']}); }
  catch { fail('prior source Git object unavailable'); }
  if (sha(raw) !== receipt.sourceRawSha256 || blob(raw) !== receipt.sourceBlobSha1) fail('prior source raw/Git binding mismatch');
  const ctx = {window:{}};vm.runInNewContext(raw.toString('utf8'), ctx, {timeout:5000});
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questionBank || ctx.questions || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || bank.length !== receipt.expectedQuestionCount) fail('prior source denominator mismatch');
  return JSON.parse(JSON.stringify(bank));
}
const unchangedRecord = row => Object.fromEntries(Object.entries(row).filter(([key]) => !['metadataRevision','approvalEvidence'].includes(key)));

// Source-only rebinding may update whole-file bytes while retaining an earlier
// typed review. Follow that exact receipt chain; never use a new receipt to erase
// the old review's witness/asset obligations.
export function validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) {
  const root = fs.realpathSync(nativeSource.root), runtimeRecord = nativeSource.runtimeRecord;
  if (!hasNativeReviewedSourceClaim({root, current, runtimeRecord}) && !typedProof(receipt, identity.questionUid)) return null;
  if (!caches.has(root)) caches.set(root, new Map());
  const context = {root,current,runtimeRecord,question,identity,ordinal,tables:currentTables(root,registry),cache:caches.get(root)};
  let cursor = receipt, state = selected(cursor, identity.questionUid, ordinal), cursorBank = nativeSource.bank;
  if (!same(state.row,current) || !same(state.runtime,runtimeRecord) || !same(state.identity,identity) ||
      !Buffer.isBuffer(nativeSource.bytes) || !Array.isArray(nativeSource.bank) ||
      !same(nativeSource.bank[ordinal-1],question) || blob(nativeSource.bytes) !== nativeSource.blobSha1 ||
      cursor.expectedQuestionCount !== nativeSource.bank.length || cursor.sourceBlobSha1 !== nativeSource.blobSha1 ||
      cursor.sourceRawSha256 !== sha(nativeSource.bytes)) fail('current native receipt does not match actual state');
  const wanted = new Set([...markers(current),...markers(runtimeRecord)]), seen = new Set();
  while (true) {
    if (seen.has(cursor.requestId) || seen.size >= 64) fail('source-rebind receipt cycle or depth exceeded');
    seen.add(cursor.requestId); evidence(root,cursor.approval.evidenceRefs);
    if (isIssuedSourceBindingRecovery(cursor.approval?.sourceRebind)) {
      const raw = cursor === receipt ? nativeSource.bytes : execFileSync('git', ['cat-file', 'blob', cursor.sourceBlobSha1],
        { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ['ignore','pipe','pipe'] });
      if (wanted.size || validateIssuedSourceBindingRecovery(cursor, { ...nativeSource, bytes:raw,
        blobSha1:cursor.sourceBlobSha1, bank:cursorBank, runtimeRecord:state.runtime }, cursorBank[ordinal-1],
        state.identity, ordinal, state.row) !== true) fail('issued source recovery ancestor cannot replay');
      return true;
    }
    if (typedProof(cursor,identity.questionUid) || wanted.has(reviewedSourceBindingPath(cursor.requestId))) {
      if (cursor.approval.sourceRebind !== undefined) fail('source rebind cannot issue a new typed review');
      const verified = validateDirect(cursor,{...context,current:state.row,runtimeRecord:state.runtime,identity:state.identity});
      wanted.delete(verified);
      if (wanted.size) fail('unresolved registered source-review ancestor');
      return true;
    }
    const ref = cursor.approval.sourceRebind?.priorReceiptRef;
    if (!ref || !/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.json$/.test(ref.path || '') ||
        !SHA256.test(ref.sha256 || '') || !cursor.approval.evidenceRefs.some(row => same(row,ref)) ||
        cursor.registryChanges?.length || cursor.newMetadataApprovals !== 0 || cursor.preservedMetadataApprovals !== cursor.partialUidCount)
      fail('typed review requires its original receipt or an exact approval-preserving ancestor');
    const raw = bytes(root,ref.path);
    if (sha(raw) !== ref.sha256) fail('prior receipt digest changed');
    const prior = JSON.parse(raw), old = selected(prior,identity.questionUid,ordinal);
    const subset = isSourceSubsetRebind(cursor.approval.sourceRebind);
    if (subset) validateSourceSubsetEvidence({root, current:cursor, prior, selected:[...state.records.values()]});
    if (ref.path !== RECEIPTS+prior.requestId+'.json' || prior.examUid !== cursor.examUid || prior.sourceArchiveFile !== cursor.sourceArchiveFile ||
        prior.expectedQuestionCount !== cursor.expectedQuestionCount || (!subset && prior.partialUidCount !== cursor.partialUidCount) ||
        (!subset && !same([...state.records.keys()].sort(),[...old.records.keys()].sort()))) fail('source-rebind ancestor scope changed');
    const bank = priorBank(root,prior);
    for (const [uid, row] of state.records) {
      const oldRow=old.records.get(uid), oldRuntime=old.runtimes.get(uid), runtime=state.runtimes.get(uid);
      const evidenceAfter=preservedSourceEvidence(oldRow.approvalEvidence,RECEIPTS+cursor.requestId+'.json',cursor.approval.sourceRebind);
      if (!same(unchangedRecord(row),unchangedRecord(oldRow)) || !same(row.approvalEvidence,evidenceAfter) ||
          !same(unchangedRecord(runtime),unchangedRecord(oldRuntime)) || !same(runtime.approvalEvidence,evidenceAfter) ||
          !same(state.identities.get(uid),old.identities.get(uid)) ||
          !same(bank[row.sourceOrdinal-1],cursorBank[row.sourceOrdinal-1]))
        fail('source-rebind ancestor changed a selected question, approval or identity');
    }
    cursor=prior;state=old;cursorBank=bank;
  }
}
