import { assertE015IssuedSourceContinuationLeaf } from './native-e015-source-cc-continuity.mjs';
import { assertM2Problem21CurrentUiLeaf, replayM2Problem21CurrentUiRebind } from './m2-problem21-current-ui-continuity.mjs';
import { M3_Q5_COMPLETE_GIVEN_SCHEMA, M3_Q5_UID, loadM3Q5CompleteGivenBank } from "./reviewed-m3-e052-q5-complete-given.mjs";
import { M2_E017_RHS_SCHEMA, M2_E017_RHS_UID, M2_E017_RHS_SOURCE } from "./reviewed-m2-e017-rhs-continuity.mjs";
// Revalidate an issued opt-in source review before AutoMeta reuses its approval.
// This read-only check grants neither a new approval nor a student-change exception.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { loadCanonical } from './compile-meta-foundation.mjs';
import { validateReviewedSourceReassessment } from './reviewed-source-reassessment.mjs';
import { M2_PROBLEM_RENDERER_SCHEMA } from './reviewed-m2-problem-renderer-continuity.mjs';
import { M2_E006_PROBLEM_SCHEMA, M2_E006_PROBLEM_ITEMS } from './reviewed-m2-e006-problem-continuity.mjs';
import { M2_PROBLEM21_CONTINUITY_SCHEMA, M2_PROBLEM21_ITEMS } from './reviewed-m2-problem21-continuity.mjs';
import { M2_FAMILY3_PROBLEM_CONTINUITY_SCHEMA, M2_FAMILY3_PROBLEM_SCOPE, M2_FAMILY3_PROBLEM_ITEMS } from './reviewed-m2-family3-problem-continuity.mjs';
import { E023_SOLUTION_DISPLAY_SCHEMA, E023_SOLUTION_DISPLAY_FIELDS } from './reviewed-m2-e023-solution-display-continuity.mjs';
import { validateNativeReviewedParent } from './reviewed-native-parent.mjs';
import { validateReviewedRetainedScopeParent } from './reviewed-retained-scope-transport.mjs';
import { REVIEWED_META_VALUE_FIELDS } from './reviewed-meta-value-fields.mjs';
import { REVIEWED_SOURCE_BINDING_OPT_INS, reviewedSourceBindingItems, reviewedSourceBindingPath,
  buildReviewedSourceBinding } from './reviewed-source-binding.mjs';
import { restoreReviewedReplayCanonicalBefore } from './reviewed-replay-registry-context.mjs';
import { reviewedRendererBindingPath, buildReviewedRendererBinding } from './reviewed-current-renderer-continuity.mjs';
import { NATIVE_RATIONALE_CONTINUITY_SCHEMA, NATIVE_RATIONALE_SOURCE_FIELDS,
  rationaleProtectedQuestionSha256, rationaleSourceFieldBinding } from './reviewed-native-rationale-continuity.mjs';

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
    repair.sourceReview?.nativeRpmCourseTransport !== undefined)) ||
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

function currentTables(root, registry) {
  if (registry?.status !== 'ACTIVE' || !same(read(root, INDEX), registry.files?.index)) fail('current ACTIVE registry changed');
  // Never memoize current bytes. The immutable Git review cache below does not
  // exempt current assets, witnesses, master data or canonical files from reads.
  for (const entry of [...registry.files.index.canonicalSources, ...registry.files.index.compiledArtifacts]) {
    const actual = sha(Buffer.from(bytes(root, entry.path).toString('utf8').replaceAll('\r\n', '\n')));
    if (actual !== String(entry.sha256).replace(/^sha256:/, '')) fail('current registry digest mismatch');
  }
  const canonical = loadCanonical(p => read(root, p));
  return { pt:registry.problemTypes, tpl:registry.templates, cc:registry.concepts, cond:registry.conditions,
    packs:unique(canonical.packs, p => p.meta.packId, 'pack'),
    master:unique(read(root, MASTER).filter(r => ['standardUnitKey','subUnitKey'].includes(r.keyType)), r => r.key, 'master'),
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
    question, final:current, supportedFields, canonicalBefore:beforeTables, canonicalAfter:tables,
    issuedSourceReview:repair.sourceReview, cache, e015IssuedSourceContinuation:context.e015IssuedSourceContinuation,
    m2Problem21CurrentUiContinuation:context.m2Problem21CurrentUiContinuation});
  if (!same(proof, repair.sourceReview)) fail('current source-review proof differs from issued proof');
  // This current-target application requires its original compound renderer
  // contract as well as the typed source review. A source-only ancestor may
  // preserve both proofs; it may not discard the writer-issued renderer seal.
  if (patch.sourceReview?.currentTargetApplication !== undefined) {
    const rendererPath = reviewedRendererBindingPath(receipt.requestId), rendererBytes = bytes(root, rendererPath);
    const rendererDigests = receipt.outputDigests?.filter(ref => ref.path === rendererPath);
    if (rendererDigests?.length !== 1 || rendererDigests[0].sha256 !== sha(rendererBytes) ||
        !same(JSON.parse(rendererBytes), buildReviewedRendererBinding(receipt)) ||
        !current.approvalEvidence?.includes(rendererPath) || !runtimeRecord.approvalEvidence?.includes(rendererPath))
      fail('current-target renderer sidecar digest, content or provenance differs');
  }
  if (patch.targetParentRef?.nativeSourceReview !== undefined || patch.targetParentRef?.retainedScopeParent !== undefined) {
    const curriculum = current.curriculum || current.curriculumKey, course = current.standardCourse || current.courseKey;
    const binding = tables.bindings.get(stable([curriculum,course,current.standardUnitKey,current.subUnitKey??null,current.problemTypeKey]));
    const pt = tables.pt.get(current.problemTypeKey), tpl = tables.tpl.get(current.templateKey);
    const context = {root, request, patch, row:current, sourceReview:proof,
      resolved:{curriculum,course,binding,pt,tpl,pack:tables.packs.get(binding?.ownerPack || pt?.ownerPack)}};
    if (patch.targetParentRef.nativeSourceReview !== undefined && patch.targetParentRef.retainedScopeParent !== undefined)
      fail('ambiguous typed target parent carrier');
    const parent = patch.targetParentRef.nativeSourceReview !== undefined
      ? validateNativeReviewedParent(context) : validateReviewedRetainedScopeParent(context);
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

// One already issued Q5 CC proof remains an obligation after its original
// diagram is restored. The new typed review does not replace that obligation:
// replay these exact public receipt, sidecar and source bytes before resolving
// this one historical marker. Other typed-to-typed chains remain unsupported.
const Q5_ORIGINAL_TYPED_RECEIPT = Object.freeze({
  commit: '50d001f8ab5a9a4dbfc749edb30916fb15c8dc0a',
  path: RECEIPTS + 'm3s2-audit-e052-native2-course-r2-20261116.json',
  gitBlobSha1: 'e01550ad3fde0f4970467a9386c3a8c06bd6f12c',
  sha256: 'c44a99b1b1b09bfdde74d46819115d1369fb9bbbc7f602c79477375450848be3', bytes: 29781
});
const Q5_ORIGINAL_TYPED_BINDING = Object.freeze({
  commit: Q5_ORIGINAL_TYPED_RECEIPT.commit,
  path: RECEIPTS + 'm3s2-audit-e052-native2-course-r2-20261116.source-review-binding.json',
  gitBlobSha1: '119bcc32412c805aa144700a4652be195c650092',
  sha256: 'de13eeb7e26812fdf3970cf15cb54c49b8f0e39f53884ac5808af963ea195126', bytes: 15753
});
const Q5_ORIGINAL_TYPED_SOURCE = Object.freeze({
  commit: 'd422885a338e06169739815f0f717d7d035ef7a1',
  path: 'archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js',
  gitBlobSha1: '533c93f017e1640ba9764925b2f164aaeaae9bb7',
  sha256: 'cc6c9ac3347716da154d24321207395cc24539b34a6b99087ae2e5866e087c27', bytes: 66316
});
function q5OriginalTypedBytes(root, ref, live) {
  const git = args => execFileSync('git', args, {cwd:root, maxBuffer:2*1024*1024, timeout:30000,
    env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'}, stdio:['ignore','pipe','pipe']});
  const entry = git(['ls-tree','-z',ref.commit,'--',ref.path]);
  if (entry.toString('utf8') !== `100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`)
    fail('Q5 original typed ancestor Git entry differs');
  const raw = git(['cat-file','blob',ref.gitBlobSha1]);
  if (raw.length !== ref.bytes || blob(raw) !== ref.gitBlobSha1 || sha(raw) !== ref.sha256 ||
      live && !bytes(root,ref.path).equals(raw)) fail('Q5 original typed ancestor raw/live bytes differ');
  return raw;
}
function validateQ5OriginalTypedAncestor(receipt, context, wanted) {
  const {root,current,runtimeRecord,question,identity,ordinal,tables,cache} = context;
  const repair = receipt.fingerprintRepairs?.find(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
  const proof = repair?.sourceReview?.q5CompleteGivenApplication;
  if (proof === undefined) return null;
  if (identity.questionUid !== M3_Q5_UID || ordinal !== 5 || proof.schemaVersion !== M3_Q5_COMPLETE_GIVEN_SCHEMA ||
      receipt.expectedQuestionCount !== 25 || receipt.partialUidCount !== 2 || receipt.approval?.sourceRebind !== undefined ||
      receipt.registryChanges?.length || !same([...wanted], [Q5_ORIGINAL_TYPED_BINDING.path]) ||
      !current.approvalEvidence?.includes(Q5_ORIGINAL_TYPED_BINDING.path) ||
      !runtimeRecord.approvalEvidence?.includes(Q5_ORIGINAL_TYPED_BINDING.path))
    fail('Q5 original typed ancestor obligation missing or ambiguous');
  const prior = JSON.parse(q5OriginalTypedBytes(root,Q5_ORIGINAL_TYPED_RECEIPT,true));
  const binding = JSON.parse(q5OriginalTypedBytes(root,Q5_ORIGINAL_TYPED_BINDING,true));
  const oldBytes = q5OriginalTypedBytes(root,Q5_ORIGINAL_TYPED_SOURCE,false);
  if (prior.sourceBlobSha1 !== Q5_ORIGINAL_TYPED_SOURCE.gitBlobSha1 || prior.sourceRawSha256 !== Q5_ORIGINAL_TYPED_SOURCE.sha256 ||
      prior.sourceArchiveFile !== receipt.sourceArchiveFile || prior.examUid !== receipt.examUid ||
      prior.expectedQuestionCount !== 25 || prior.partialUidCount !== 2 ||
      Q5_ORIGINAL_TYPED_RECEIPT.path !== RECEIPTS + prior.requestId + '.json' ||
      Q5_ORIGINAL_TYPED_BINDING.path !== reviewedSourceBindingPath(prior.requestId))
    fail('Q5 original typed ancestor source or scope differs');
  const old = selected(prior,M3_Q5_UID,5), issued = selected(receipt,M3_Q5_UID,5);
  const q12 = 'qid_v1_1aac12db1a167973138e8dc51afcd5e0b19fcf73d4bb030ea406701acd0b8c4a';
  if (!same([...old.records.keys()].sort(),[M3_Q5_UID,q12].sort()) ||
      !same([...issued.records.keys()].sort(),[M3_Q5_UID,q12].sort()) ||
      old.records.get(q12)?.sourceOrdinal !== 12 || issued.records.get(q12)?.sourceOrdinal !== 12 ||
      !same(markers(old.row),[Q5_ORIGINAL_TYPED_BINDING.path]) ||
      !same(markers(old.runtime),[Q5_ORIGINAL_TYPED_BINDING.path]) ||
      markers(old.records.get(q12)).length || markers(old.runtimes.get(q12)).length)
    fail('Q5 original typed ancestor exact pair or marker inventory differs');
  const oldBank = loadM3Q5CompleteGivenBank(oldBytes);
  const currentBytes = bytes(root,'archive/exams/'+receipt.sourceArchiveFile);
  const currentBank = loadM3Q5CompleteGivenBank(currentBytes);
  if (oldBank.length !== 25 || currentBank.length !== 25 || blob(currentBytes) !== receipt.sourceBlobSha1 ||
      sha(currentBytes) !== receipt.sourceRawSha256 || !same(currentBank[4],question) ||
      sha(stable(oldBank[4])) !== proof.wholeQuestionBeforeSha256 || !same(oldBank[11],currentBank[11]))
    fail('Q5 original typed ancestor whole question differs');
  const oldPatch = binding.requestSnapshot?.items?.find(row => row.questionUid === M3_Q5_UID && row.sourceOrdinal === 5);
  if (!oldPatch || sha(stable(oldPatch.sourceReview)) !== proof.originalSourceReviewSha256)
    fail('Q5 original typed ancestor Native and CC authority differs');
  const omit = (row, fields) => Object.fromEntries(Object.entries(row).filter(([key]) => !fields.includes(key)));
  const nextReceiptPath = RECEIPTS + receipt.requestId + '.json', nextBindingPath = reviewedSourceBindingPath(receipt.requestId);
  for (const [uid, priorRow] of old.records) {
    const isQ5 = uid === M3_Q5_UID, next = issued.records.get(uid), previousRuntime = old.runtimes.get(uid), nextRuntime = issued.runtimes.get(uid);
    // The ordinary issuer resolves the current ACTIVE pack version. Another
    // approved request in the same writer may advance that descriptor before
    // this exact pair is issued; it does not change the pair's approval.
    const pack = tables.packs.get(next.metaFoundationPackId)?.meta;
    if (pack?.canonicalStatus !== 'ACTIVE' || pack.packId !== next.metaFoundationPackId ||
        next.metaFoundationPackId !== priorRow.metaFoundationPackId ||
        nextRuntime.metaFoundationPackId !== next.metaFoundationPackId ||
        next.metaFoundationPackVersion !== pack.packVersion ||
        nextRuntime.metaFoundationPackVersion !== pack.packVersion)
      fail('Q5 original typed ancestor current ACTIVE pack version differs');
    const fields = ['metadataRevision','approvalEvidence','metaFoundationPackVersion',
      ...(isQ5?['sourceFingerprint','contentFingerprint']:[])];
    const runtimeFields = [...fields,...(isQ5?['approvedSourceFingerprint']:[])];
    const evidenceAfter = [...new Set([...(priorRow.approvalEvidence||[]),nextReceiptPath,...(isQ5?[nextBindingPath]:[])])];
    const revision = `meta-foundation:${next.metaFoundationPackId}@${next.metaFoundationPackVersion}:exam-final_qa-v2:${receipt.requestId}`;
    if (!same(omit(next,fields),omit(priorRow,fields)) || !same(omit(nextRuntime,runtimeFields),omit(previousRuntime,runtimeFields)) ||
        !same(next.approvalEvidence,evidenceAfter) || !same(nextRuntime.approvalEvidence,evidenceAfter) ||
        next.metadataRevision !== revision || nextRuntime.metadataRevision !== revision ||
        !same(omit(issued.identities.get(uid),isQ5?['sourceFingerprint']:[]),omit(old.identities.get(uid),isQ5?['sourceFingerprint']:[])))
      fail('Q5 original typed ancestor changed an approval, identity or unrelated field');
    const index = next.sourceOrdinal-1;
    if (next.sourceFingerprint !== fullFp(currentBank[index]) || next.contentFingerprint !== bodyFp(currentBank[index]) ||
        priorRow.sourceFingerprint !== fullFp(oldBank[index]) || priorRow.contentFingerprint !== bodyFp(oldBank[index]) ||
        nextRuntime.approvedSourceFingerprint !== next.sourceFingerprint ||
        previousRuntime.approvedSourceFingerprint !== priorRow.sourceFingerprint ||
        issued.identities.get(uid).sourceFingerprint !== next.sourceFingerprint ||
        old.identities.get(uid).sourceFingerprint !== priorRow.sourceFingerprint)
      fail('Q5 original typed ancestor fingerprint transition differs');
  }
  // Existing validation replays the original request, complete Native review
  // and original CC finalization. It must authenticate the exact old sidecar;
  // no historical approval field or before-view is manufactured here.
  const verified = validateDirect(prior,{root,current:old.row,runtimeRecord:old.runtime,question:oldBank[4],
    identity:old.identity,ordinal:5,tables,cache});
  if (verified !== Q5_ORIGINAL_TYPED_BINDING.path) fail('Q5 original typed ancestor was not replayed');
  return verified;
}

// Source-only rebinding may update whole-file bytes while retaining an earlier
// typed review. Follow that exact receipt chain; never use a new receipt to erase
// the old review's witness/asset obligations.
export function validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) {
  const root = fs.realpathSync(nativeSource.root), runtimeRecord = nativeSource.runtimeRecord;
  if (Object.hasOwn(nativeSource, 'e015IssuedSourceContinuation'))
    assertE015IssuedSourceContinuationLeaf({context:nativeSource.e015IssuedSourceContinuation, nativeSource,
      current,identity,source:receipt.sourceArchiveFile,ordinal,question,receipt});
  if (Object.hasOwn(nativeSource, 'm2Problem21CurrentUiContinuation'))
    assertM2Problem21CurrentUiLeaf({context:nativeSource.m2Problem21CurrentUiContinuation,nativeSource,
      current,identity,source:receipt.sourceArchiveFile,ordinal,question,receipt});
  if (!hasNativeReviewedSourceClaim({root, current, runtimeRecord}) && !typedProof(receipt, identity.questionUid)) return null;
  if (!caches.has(root)) caches.set(root, new Map());
  const context = {root,current,runtimeRecord,question,identity,ordinal,tables:currentTables(root,registry),cache:caches.get(root),
    e015IssuedSourceContinuation:nativeSource.e015IssuedSourceContinuation,
    m2Problem21CurrentUiContinuation:nativeSource.m2Problem21CurrentUiContinuation};
  let cursor = receipt, state = selected(cursor, identity.questionUid, ordinal);
  if (!same(state.row,current) || !same(state.runtime,runtimeRecord) || !same(state.identity,identity) ||
      !Buffer.isBuffer(nativeSource.bytes) || !Array.isArray(nativeSource.bank) ||
      !same(nativeSource.bank[ordinal-1],question) || blob(nativeSource.bytes) !== nativeSource.blobSha1 ||
      cursor.expectedQuestionCount !== nativeSource.bank.length || cursor.sourceBlobSha1 !== nativeSource.blobSha1 ||
      cursor.sourceRawSha256 !== sha(nativeSource.bytes)) fail('current native receipt does not match actual state');
  const wanted = new Set([...markers(current),...markers(runtimeRecord)]), seen = new Set();
  while (true) {
    if (seen.has(cursor.requestId) || seen.size >= 64) fail('source-rebind receipt cycle or depth exceeded');
    seen.add(cursor.requestId); evidence(root,cursor.approval.evidenceRefs);
    if (typedProof(cursor,identity.questionUid) || wanted.has(reviewedSourceBindingPath(cursor.requestId))) {
      if (cursor.approval.sourceRebind !== undefined) fail('source rebind cannot issue a new typed review');
      const verified = validateDirect(cursor,{...context,current:state.row,runtimeRecord:state.runtime,identity:state.identity});
      wanted.delete(verified);
      const q5Ancestor = validateQ5OriginalTypedAncestor(cursor,{...context,current:state.row,runtimeRecord:state.runtime,identity:state.identity},wanted);
      if (q5Ancestor !== null) wanted.delete(q5Ancestor);
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
    if (ref.path !== RECEIPTS+prior.requestId+'.json' || prior.examUid !== cursor.examUid || prior.sourceArchiveFile !== cursor.sourceArchiveFile ||
        prior.expectedQuestionCount !== cursor.expectedQuestionCount || prior.partialUidCount !== cursor.partialUidCount ||
        !same([...state.records.keys()].sort(),[...old.records.keys()].sort())) fail('source-rebind ancestor scope changed');
    const bank = priorBank(root,prior);
    for (const [uid, row] of state.records) {
      const oldRow=old.records.get(uid), oldRuntime=old.runtimes.get(uid), runtime=state.runtimes.get(uid);
      const evidenceAfter=[...new Set([...(oldRow.approvalEvidence||[]),RECEIPTS+cursor.requestId+'.json'])];
      if (!same(unchangedRecord(row),unchangedRecord(oldRow)) || !same(row.approvalEvidence,evidenceAfter) ||
          !same(unchangedRecord(runtime),unchangedRecord(oldRuntime)) || !same(runtime.approvalEvidence,evidenceAfter) ||
          !same(state.identities.get(uid),old.identities.get(uid)) ||
          !same(bank[row.sourceOrdinal-1],nativeSource.bank[row.sourceOrdinal-1]))
        fail('source-rebind ancestor changed a selected question, approval or identity');
    }
    cursor=prior;state=old;
  }
}

// This existing-approval lane is deliberately narrower than the source producer.
// An older cursor may still carry the pre-review difficulty values. A FAMILY_ACTIVE
// parent receipt can retain its two immutable native rationale values without adding
// them to the source, only after the complete issued review and parent are replayed.
export function nativeReviewedFamilyRationaleReuse(receiptPath, nativeSource, previous, question, identity, ordinal, current, registry) {
  const difficulty = new Set(['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility']);
  const rationale = ['primaryMethod','decisiveStep'];
  if (!previous || rationale.some(field => Object.hasOwn(previous,field) || Object.hasOwn(question,field) ||
      typeof current[field] !== 'string' || !current[field].trim())) return false;
  const rest = value => Object.fromEntries(Object.entries(value).filter(([field]) => !difficulty.has(field)));
  if (!same(rest(previous),rest(question)) ||
      ![...difficulty].some(field => !same(previous[field] ?? null,question[field] ?? null))) return false;
  try {
    const root = fs.realpathSync(nativeSource.root), receipt = read(root,receiptPath);
    if (receiptPath !== RECEIPTS+receipt.requestId+'.json' || receipt.approval?.sourceRebind !== undefined ||
        validateNativeReviewedSourceReuse(receipt,nativeSource,question,identity,ordinal,current,registry) !== true) return false;
    const request = read(root,reviewedSourceBindingPath(receipt.requestId)).requestSnapshot;
    const patches = request.items.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
    const repairs = receipt.fingerprintRepairs.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
    const parents = receipt.nativeParentBindings?.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
    if (patches.length !== 1 || repairs.length !== 1 || parents?.length !== 1) return false;
    const patch = patches[0], proof = repairs[0].sourceReview, parent = parents[0];
    if (patch.targetParentRef?.nativeSourceReview?.crosswalkProfile !== 'ACTIVE_FAMILY_EXPLICIT_NATIVE_AFTER' ||
        patch.targetParentRef.retainedScopeParent !== undefined || patch.rebind !== undefined ||
        Object.keys(patch.sourceReview).some(key => !['schemaVersion','reviewCommit','reviewPath','reviewRef'].includes(key)) ||
        proof.nativeSchemaVersion !== 'm2-s2-meta-review-v1' || proof.newMathematicalQa !== false ||
        parent.crosswalkProfile !== 'ACTIVE_FAMILY_EXPLICIT_NATIVE_AFTER' || parent.primaryAuthority !== 'EXPLICIT_NATIVE_AFTER' ||
        parent.templateCandidatesUsedAsApproval !== false || parent.sharedCrosswalkModified !== false ||
        parent.canonicalDefinitionsModified !== false || parent.newMathematicalQa !== false) return false;
    return rationale.every(field => Object.hasOwn(patch.after,field) && patch.after[field] === current[field] &&
      proof.rationaleBindings?.[field]?.origin === 'NATIVE_ITEM_FIELD' &&
      proof.rationaleBindings[field].valueSha256 === sha(current[field]));
  } catch { return false; }
}

// This separately issued profile binds an existing metadata parent and the two
// verbatim native item rationale fields. The generic source producer and the
// narrower FAMILY_ACTIVE exception above retain their original contracts.
export function nativeReviewedMetadataRationaleReuse(receiptPath, nativeSource, previous, question, identity, ordinal, current, registry) {
  const fields = ['primaryMethod', 'decisiveStep'];
  if (!previous || fields.some(field => Object.hasOwn(previous, field) || Object.hasOwn(question, field) ||
      typeof current[field] !== 'string' || !current[field].trim())) return false;
  try {
    const root = fs.realpathSync(nativeSource.root), receipt = read(root, receiptPath);
    if (receiptPath !== RECEIPTS + receipt.requestId + '.json' || receipt.approval.sourceRebind !== undefined ||
        validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) !== true) return false;
    const request = read(root, reviewedSourceBindingPath(receipt.requestId)).requestSnapshot;
    const patches = request.items.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
    const repairs = receipt.fingerprintRepairs.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
    if (patches.length !== 1 || repairs.length !== 1) return false;
    const patch = patches[0], sourceReview = repairs[0].sourceReview, proof = sourceReview.rationaleContinuity;
    if (!same(patch.sourceReview.rationaleContinuity, { schemaVersion: NATIVE_RATIONALE_CONTINUITY_SCHEMA }) ||
        proof?.schemaVersion !== NATIVE_RATIONALE_CONTINUITY_SCHEMA || proof.scope !== 'ISSUED_NATIVE_RATIONALE_REUSE_ONLY' ||
        sourceReview.nativeSchemaVersion !== 'm2-s2-meta-review-v1' || sourceReview.newMathematicalQa !== false ||
        proof.questionUid !== identity.questionUid || proof.sourceOrdinal !== ordinal ||
        proof.protectedQuestionSha256 !== rationaleProtectedQuestionSha256(previous) ||
        proof.protectedQuestionSha256 !== rationaleProtectedQuestionSha256(question) || proof.currentQuestionSha256 !== sha(stable(question)) ||
        !same(proof.sourceMetadataFields, NATIVE_RATIONALE_SOURCE_FIELDS) ||
        !Array.isArray(proof.nativeSourceMetadata) || proof.nativeSourceMetadata.length !== NATIVE_RATIONALE_SOURCE_FIELDS.length ||
        proof.nativeSourceMetadata.some((entry, index) => entry.field !== NATIVE_RATIONALE_SOURCE_FIELDS[index] ||
          ![entry.reviewed, entry.committed, rationaleSourceFieldBinding(question, entry.field)]
            .some(bound => same(bound, rationaleSourceFieldBinding(previous, entry.field))))) return false;
    return fields.every(field => patch.after[field] === current[field] &&
      same(proof.rationaleBindings[field], { origin: 'NATIVE_ITEM_FIELD', valueSha256: sha(current[field]) }) &&
      same(proof.rationaleBindings[field], sourceReview.rationaleBindings[field]));
  } catch { return false; }
}

// The exact three-item M2 renderer contract changes only a separately witnessed
// picture presentation. Revalidate its complete typed request first, then bind
// an older cursor to one of that proof's immutable whole questions. A generic
// typed review or a matching student fingerprint is not renderer authority.
export function nativeReviewedM2ProblemRendererRebind(receipt, nativeSource, previous, question, identity, ordinal, current, registry) {
  if (!previous || receipt.approval?.sourceRebind !== undefined) return false;
  const matches = receipt.fingerprintRepairs?.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
  const proof = matches?.[0]?.sourceReview?.m2ProblemRendererContinuity;
  if (matches?.length !== 1 || proof?.schemaVersion !== M2_PROBLEM_RENDERER_SCHEMA ||
      proof.questionUid !== identity.questionUid || proof.sourceOrdinal !== ordinal ||
      proof.sourceArchiveFile !== receipt.sourceArchiveFile || proof.memoryOnlyNormalization !== true ||
      proof.newMathematicalQa !== false || proof.newMetadataApprovals !== 0 || proof.newDifficultyJudgments !== 0 ||
      proof.newReview2Claims !== 0 || proof.sourceWrites !== 0 || proof.rendererWrites !== 0) return false;
  try {
    if (validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) !== true) return false;
    const previousSha = sha(stable(previous));
    return [proof.nativeReviewedSource, proof.nativeCommittedSource, proof.prefigureSource]
      .some(ref => SHA256.test(ref?.questionSha256 || '') && ref.questionSha256 === previousSha);
  } catch { return false; }
}

// Exact pending Q3 cursor. Its whole question is also the initial independent
// label-repair predecessor. Recognition follows a fresh typed Native/UI replay;
// this immutable historical context grants no display or metadata approval.
const E006_Q3_CURSOR_SOURCE = Object.freeze({
  commit: 'd511d4f82d3da2224cc43f8ff26f30469b436af3',
  path: 'archive/exams/original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js',
  gitBlobSha1: 'fb5492f096e8d7cfa8cccbf2f5cb9c98181a0ce1',
  sha256: '1ad6a014c40c64d8524b7f616fcbd5b717e7b0051887189bcbbdf0e46b6fbf9f',
  bytes: 58252
});
const E006_Q3_CURSOR_QUESTION_SHA256 = 'caf314395157fdeb6543107e3e12bcb0b73bd8b5a9670155cb4aa5375bfd1d43';
function matchesE006Q3HistoricalCursor(root, previous) {
  if (sha(stable(previous)) !== E006_Q3_CURSOR_QUESTION_SHA256) return false;
  const ref = E006_Q3_CURSOR_SOURCE;
  const run = args => execFileSync('git', args, {cwd:fs.realpathSync(root), maxBuffer:1024*1024,
    stdio:['ignore','pipe','pipe'], env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'}});
  if (run(['ls-tree','-z',ref.commit,'--',ref.path]).toString() !==
      `100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`) return false;
  const raw = run(['cat-file','blob',ref.gitBlobSha1]);
  if (raw.length !== ref.bytes || sha(raw) !== ref.sha256 || blob(raw) !== ref.gitBlobSha1) return false;
  const context = vm.createContext(Object.create(null), {codeGeneration:{strings:false,wasm:false}});
  vm.runInContext('globalThis.window = {}; globalThis.console = Object.freeze({log(){},warn(){},error(){}});', context);
  vm.runInContext(raw.toString('utf8'), context, {timeout:3000});
  const bank = context.window.questionBank || context.window.questions;
  return Array.isArray(bank) && bank.length === 23 && same(JSON.parse(JSON.stringify(bank[2])), previous);
}

// The E006 four-case observation remains separate from the original THREE
// profile. Reuse replays every native, current source, asset and UI gate first.
export function nativeReviewedM2E006ProblemRebind(receipt, nativeSource, previous, question, identity, ordinal, current, registry) {
  if (!previous || receipt.approval?.sourceRebind !== undefined || !M2_E006_PROBLEM_ITEMS.some(item =>
      item.questionUid === identity.questionUid && item.sourceOrdinal === ordinal && item.sourceArchiveFile === receipt.sourceArchiveFile)) return false;
  const matches = receipt.fingerprintRepairs?.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
  const proof = matches?.[0]?.sourceReview?.m2E006ProblemContinuity;
  if (matches?.length !== 1 || proof?.schemaVersion !== M2_E006_PROBLEM_SCHEMA ||
      proof.questionUid !== identity.questionUid || proof.sourceOrdinal !== ordinal || proof.sourceArchiveFile !== receipt.sourceArchiveFile ||
      proof.memoryOnlyNormalization !== true || proof.newMathematicalQa !== false || proof.newMetadataApprovals !== 0 ||
      proof.newDifficultyJudgments !== 0 || proof.newReview2Claims !== 0 || proof.sourceWrites !== 0 || proof.rendererWrites !== 0) return false;
  try {
    if (validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) !== true) return false;
    const previousSha = sha(stable(previous));
    return [proof.nativeReviewedSource, proof.nativeCommittedSource, proof.prefigureSource]
      .some(ref => SHA256.test(ref?.questionSha256 || '') && ref.questionSha256 === previousSha) ||
      ordinal === 3 && matchesE006Q3HistoricalCursor(nativeSource.root, previous);
  } catch { return false; }
}

// This is only the actual pending cursor's immutable whole-question context.
// Its old display is not authority: the current typed Native/UI review is still
// fully replayed before this one-UID historical input can be recognized.
const E017_RHS_CURSOR_SOURCE = Object.freeze({
  commit: 'd511d4f82d3da2224cc43f8ff26f30469b436af3',
  path: 'archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js',
  gitBlobSha1: 'a6a8419ba3ea9b6e271b57c34b920088277dc226',
  sha256: '916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687',
  bytes: 66448
});
const E017_RHS_CURSOR_QUESTION_SHA256 = '20a99cd2a1363d44ad9033982102491aff790ef4fe5b187f07bb04dfaa476a51';
function matchesE017RhsHistoricalCursor(root, previous) {
  if (sha(stable(previous)) !== E017_RHS_CURSOR_QUESTION_SHA256) return false;
  const ref = E017_RHS_CURSOR_SOURCE;
  const run = args => execFileSync('git', args, {cwd:fs.realpathSync(root), maxBuffer:16*1024*1024,
    stdio:['ignore','pipe','pipe'], env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'}});
  if (run(['ls-tree','-z',ref.commit,'--',ref.path]).toString() !==
      `100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`) return false;
  const raw = run(['cat-file','blob',ref.gitBlobSha1]);
  if (raw.length !== ref.bytes || sha(raw) !== ref.sha256 || blob(raw) !== ref.gitBlobSha1) return false;
  const context = vm.createContext(Object.create(null), {codeGeneration:{strings:false,wasm:false}});
  vm.runInContext('globalThis.window = {}; globalThis.console = Object.freeze({log(){},warn(){},error(){}});',
    context,{timeout:5000});
  vm.runInContext(raw.toString('utf8'),context,{timeout:5000});
  const bank = context.window.questionBank || context.window.questions || context.questionBank || context.questions || context.window.examData?.questions;
  return Array.isArray(bank) && bank.length === 23 &&
    sha(stable(JSON.parse(JSON.stringify(bank[1])))) === E017_RHS_CURSOR_QUESTION_SHA256;
}

// The one reviewed solution line is carried only after the entire issued typed
// request and immutable UI/authority binding have been replayed. A payload hash
// or an ordinary receipt never grants this old-cursor continuation.
export function nativeReviewedE017RhsRebind(receipt, nativeSource, previous, question, identity, ordinal, current, registry) {
  if (!previous || identity.questionUid !== M2_E017_RHS_UID || ordinal !== 2 ||
      receipt.sourceArchiveFile !== M2_E017_RHS_SOURCE || receipt.expectedQuestionCount !== 23 ||
      receipt.approval?.sourceRebind !== undefined) return false;
  const matches = receipt.fingerprintRepairs?.filter(r => r.questionUid === identity.questionUid && r.sourceOrdinal === ordinal);
  const proof = matches?.[0]?.sourceReview?.e017RhsContinuity;
  if (matches?.length !== 1 || proof?.schemaVersion !== M2_E017_RHS_SCHEMA || proof.questionUid !== identity.questionUid ||
      proof.sourceOrdinal !== ordinal || proof.sourceArchiveFile !== receipt.sourceArchiveFile || proof.memoryOnlyNormalization !== true ||
      proof.newMathematicalQa !== false || proof.newMetadataApprovals !== 0 || proof.newDifficultyJudgments !== 0 ||
      proof.newReview2Claims !== 0 || proof.sourceWrites !== 0 || proof.rendererWrites !== 0) return false;
  try {
    if (validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) !== true) return false;
    const prior = sha(stable(previous));
    return [proof.nativeReviewedQuestionSha256, proof.nativeCommittedQuestionSha256, proof.reviewedCurrentQuestionSha256]
      .some(value => SHA256.test(value || '') && value === prior) || matchesE017RhsHistoricalCursor(nativeSource.root, previous);
  } catch { return false; }
}

// Historical cursor inputs only. These whole-bank references do not approve
// any historical display. Current authority comes from replaying the complete
// issued request, including both display witnesses and the ordinary Native check.
const M2_PROBLEM21_CURSOR_SOURCES = Object.freeze({
  "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js": [
    {
      "commit": "ed83f05220b64f75cbbd5de360a68dd6ddaadd22",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "6a96cbd5c2671c61a63b0e964777ec6d6ac3369d",
      "sha256": "ec693aa011e6a82f41c63f640666d061c2751a972abfb730ca91e954565ad9c3",
      "bytes": 40638
    },
    {
      "commit": "ce35ff92baeef7c07014a8ea7a75ea6e0770e3b0",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "4134e04ee4214c161c740988bf024592c4247e3f",
      "sha256": "3c5a0f0ae254b2f5c3dafa15dfe55c269a9c8055c70d6936fb9ba44002469161",
      "bytes": 61302
    },
    {
      "commit": "ecb0b3efd706fb63dc12336560a418f17dac0ccb",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "a6a8419ba3ea9b6e271b57c34b920088277dc226",
      "sha256": "916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687",
      "bytes": 66448
    },
    {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    }
  ],
  "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js": [
    {
      "commit": "ed83f05220b64f75cbbd5de360a68dd6ddaadd22",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "0a6f06b0d702264ca13e27d4280b727199cfaafc",
      "sha256": "5e97d4fcea1a919e49a50ae655ee7c288b7a23a1656189a57b8aa1a9543f7e0c",
      "bytes": 39754
    },
    {
      "commit": "ce35ff92baeef7c07014a8ea7a75ea6e0770e3b0",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "7fdc6dfcb7b717cea2852d4bd96d7659316039c7",
      "sha256": "93ee10ebffd06e4742cfbcf6ddae30a27830b49a4c691710ad7f3e414a370bd1",
      "bytes": 60473
    },
    {
      "commit": "ecb0b3efd706fb63dc12336560a418f17dac0ccb",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "f0cd94780d1f2c277bad52142cfa20cb932e0e96",
      "sha256": "e3eea28235f0054b79858ad6451af0a82c94ffb9ab7470f481710519a2887cdf",
      "bytes": 63986
    },
    {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
      "sha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
      "bytes": 65146
    }
  ]
});

// An old cursor may predate the reviewed display while a caught-up cursor has
// the exact current bank. Neither cursor grants approval: replay the entire
// issued typed registration first, then require a whole-question match against
// one of this closed cohort's immutable historical banks.
export function nativeReviewedM2Problem21Rebind(receipt, nativeSource, previous, question, identity, ordinal, current, registry) {
  if (!previous || receipt.approval?.sourceRebind !== undefined) return false;
  if (Object.hasOwn(nativeSource, 'm2Problem21CurrentUiContinuation')) {
    try { assertM2Problem21CurrentUiLeaf({context:nativeSource.m2Problem21CurrentUiContinuation,nativeSource,
      current,identity,source:receipt.sourceArchiveFile,ordinal,question,receipt}); } catch { return false; }
  } else {
    try {
      const replayed=replayM2Problem21CurrentUiRebind({receipt,nativeSource,previous,question,identity,ordinal,current,
        source:receipt.sourceArchiveFile,revalidateLeaf:leaf=>nativeReviewedM2Problem21Rebind(receipt,
          leaf.nativeSource,previous,leaf.question,identity,ordinal,current,registry)});
      if(replayed!==null)return replayed;
    } catch { return false; }
  }
  const item = M2_PROBLEM21_ITEMS.find(item => item.callerAction === 'NORMALIZE_EXACT_PROBLEM_FIELDS' &&
    item.questionUid === identity.questionUid && item.sourceOrdinal === ordinal && item.sourceArchiveFile === receipt.sourceArchiveFile);
  if (!item || receipt.expectedQuestionCount !== item.expectedQuestionCount) return false;
  const matches = receipt.fingerprintRepairs?.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
  const review = matches?.[0]?.sourceReview, proof = review?.m2ProblemRenderer21Continuity;
  const zeroApproval = value => value?.memoryOnlyNormalization === true && value.newMathematicalQa === false &&
    value.newMetadataApprovals === 0 && value.newDifficultyJudgments === 0 && value.newReview2Claims === 0 &&
    value.sourceWrites === 0 && value.rendererWrites === 0;
  if (matches?.length !== 1 || proof?.schemaVersion !== M2_PROBLEM21_CONTINUITY_SCHEMA ||
      proof.questionUid !== identity.questionUid || proof.sourceOrdinal !== ordinal || proof.sourceArchiveFile !== receipt.sourceArchiveFile ||
      proof.requiresOrdinaryNativeValidation !== true || !zeroApproval(proof)) return false;
  if (proof.requiresSeparateSolutionContinuity) {
    const solution = review.e023SolutionDisplayContinuity;
    if (solution?.schemaVersion !== E023_SOLUTION_DISPLAY_SCHEMA || solution.questionUid !== identity.questionUid ||
        solution.sourceOrdinal !== ordinal || solution.sourceArchiveFile !== receipt.sourceArchiveFile ||
        !same(solution.ownedFields, E023_SOLUTION_DISPLAY_FIELDS) || !zeroApproval(solution)) return false;
  }
  try {
    if (validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) !== true) return false;
    const root = fs.realpathSync(nativeSource.root), priorSha = sha(stable(previous));
    for (const ref of M2_PROBLEM21_CURSOR_SOURCES[receipt.sourceArchiveFile] || []) {
      const run = args => execFileSync('git', args, {cwd:root, maxBuffer:16*1024*1024, stdio:['ignore','pipe','pipe'],
        env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'}});
      const entry = run(['ls-tree','-z',ref.commit,'--',ref.path]).toString();
      if (entry !== `100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`) return false;
      const raw = run(['cat-file','blob',ref.gitBlobSha1]);
      if (raw.length !== ref.bytes || sha(raw) !== ref.sha256 || blob(raw) !== ref.gitBlobSha1) return false;
      // Construct all source-visible objects inside the context. Host-created
      // window or console functions would expose a host Function constructor.
      const context = vm.createContext(Object.create(null), {codeGeneration:{strings:false,wasm:false}});
      vm.runInContext('globalThis.window = {}; globalThis.console = Object.freeze({log(){},warn(){},error(){}});',
        context,{timeout:5000});
      vm.runInContext(raw.toString('utf8'),context,{timeout:5000});
      const bank = context.window.questionBank || context.window.questions || context.questionBank || context.questions || context.window.examData?.questions;
      if (!Array.isArray(bank) || bank.length !== item.expectedQuestionCount) return false;
      if (sha(stable(JSON.parse(JSON.stringify(bank[ordinal-1])))) === priorSha) return true;
    }
  } catch { return false; }
  return false;
}


// This separate three-UID profile does not widen the existing fixed-three or
// problem21 profiles. The complete issued Native/retained/parent request is
// replayed before accepting any authenticated original or caught-up cursor.
export function nativeReviewedM2Family3Rebind(receipt, nativeSource, previous, question, identity, ordinal, current, registry) {
  if (!previous || receipt.approval?.sourceRebind !== undefined) return false;
  const item = M2_FAMILY3_PROBLEM_ITEMS.find(item => item.questionUid === identity.questionUid &&
    item.sourceOrdinal === ordinal && item.sourceArchiveFile === receipt.sourceArchiveFile);
  if (!item || receipt.expectedQuestionCount !== item.expectedQuestionCount) return false;
  const matches = receipt.fingerprintRepairs?.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
  const proof = matches?.[0]?.sourceReview?.m2Family3ProblemContinuity;
  if (matches?.length !== 1 || proof?.schemaVersion !== M2_FAMILY3_PROBLEM_CONTINUITY_SCHEMA ||
      proof.scope !== M2_FAMILY3_PROBLEM_SCOPE || proof.questionUid !== identity.questionUid ||
      proof.sourceOrdinal !== ordinal || proof.sourceArchiveFile !== receipt.sourceArchiveFile ||
      proof.requiresOrdinaryNativeValidation !== true ||
      proof.requiresOrdinaryRetainedValidation !== item.key.startsWith('E015') || proof.requiresSeparateSolutionContinuity !== false ||
      !same(proof.normalizedProblemFields, ['image','imageAlt','imageSize','layoutTag']) ||
      proof.memoryOnlyNormalization !== true || proof.newMathematicalQa !== false || proof.newMetadataApprovals !== 0 ||
      proof.newDifficultyJudgments !== 0 || proof.newReview2Claims !== 0 || proof.sourceWrites !== 0 || proof.rendererWrites !== 0) return false;
  try {
    if (validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) !== true) return false;
    // validateDirect compared this proof with a fresh full typed replay. Each
    // digest was recomputed from the exact immutable Git bank in that replay.
    const previousSha = sha(stable(previous));
    return [proof.nativeReviewedQuestionSha256, proof.nativeCommittedQuestionSha256,
      proof.staticBeforeQuestionSha256, proof.staticCurrentQuestionSha256, proof.reviewedCurrentQuestionSha256]
      .some(value => SHA256.test(value || '') && value === previousSha);
  } catch { return false; }
}


// The one original-diagram restoration is reusable only after the complete
// issued typed receipt, independent given/UI evidence and unchanged Native/CC
// validators pass. An old cursor must match an authenticated whole question.
export function nativeReviewedM3Q5CompleteGivenRebind(receipt, nativeSource, previous, question, identity, ordinal, current, registry) {
  if (!previous || receipt.approval?.sourceRebind !== undefined || identity.questionUid !== M3_Q5_UID || ordinal !== 5) return false;
  const matches = receipt.fingerprintRepairs?.filter(row => row.questionUid === identity.questionUid && row.sourceOrdinal === ordinal);
  const proof = matches?.[0]?.sourceReview?.q5CompleteGivenApplication;
  if (matches?.length !== 1 || proof?.schemaVersion !== M3_Q5_COMPLETE_GIVEN_SCHEMA || proof.questionUid !== M3_Q5_UID ||
      proof.sourceOrdinal !== 5 || proof.sourceArchiveFile !== receipt.sourceArchiveFile || proof.expectedQuestionCount !== 25 ||
      proof.selectedAuthorityUidCount !== 1 || proof.outsideScopeCount !== 24 || proof.memoryOnlyNormalization !== true ||
      !same(proof.normalizedFields, ['image']) || proof.outside24WholeQuestionsUnchanged !== true ||
      proof.newMathematicalQa !== false || proof.newMetadataApprovals !== 0 || proof.newNativeApprovals !== 0 ||
      proof.newDifficultyJudgments !== 0 || proof.newReview2Claims !== 0 || proof.sourceWrites !== 0 ||
      proof.rendererWrites !== 0 || proof.canonicalWrites !== 0) return false;
  try {
    if (validateNativeReviewedSourceReuse(receipt, nativeSource, question, identity, ordinal, current, registry) !== true) return false;
    const previousSha = sha(stable(previous));
    return [proof.nativeReviewedQuestionSha256, proof.nativeCommittedQuestionSha256, proof.wholeQuestionBeforeSha256,
      proof.oldCursorCourseBinding?.wholeQuestionSha256]
      .some(hash => SHA256.test(hash || '') && hash === previousSha);
  } catch { return false; }
}
