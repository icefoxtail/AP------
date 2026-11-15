// Recover a missing durable source-review binding for an already issued cohort.
// This is a replay of immutable authority, not a new review or a legacy exemption.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { registerReviewedExamV2, loadResolvedConsumerCatalog, verifyConsumerValues } from './reviewed-exam-registration-v2.mjs';
import { nativeReviewReceipt, activeBindingContext } from './auto-register-merged-source.mjs';
import { loadActiveMetaRegistry } from './active-registry.mjs';
import { hasReviewedReceiptLineage, reviewedSourceBindingItems, reviewedSourceBindingPath } from './reviewed-source-binding.mjs';
import { REASSESSED_STUDENT_FIELDS } from './reviewed-source-reassessment.mjs';
import { validateNativeReviewedSourceReuse } from './native-reviewed-source-reuse.mjs';
import { readImmutableGitFiles, forEachImmutableGitFile } from './immutable-git-batch.mjs';

export const ISSUED_SOURCE_BINDING_RECOVERY_SCHEMA = 'archive-native-issued-source-binding-recovery-v1';
const PROOF_SCHEMA = 'archive-issued-source-binding-recovery-proof-v1';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const META = 'archive/data/question_metadata.json', IDENTITY = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime/';
const MASTER = 'archive/data/master_tables/js_archive_tag_master.json';
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/, SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const fail = message => { throw Error(`issued source binding recovery: ${message}`); };
const exactKeys = (value, keys) => value && !Array.isArray(value) && same(Object.keys(value).sort(), [...keys].sort());
function mismatchPaths(left, right, prefix = '', result = []) {
  if (same(left, right) || result.length >= 12) return result;
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object' || Array.isArray(left) !== Array.isArray(right)) {
    result.push(prefix); return result;
  }
  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) mismatchPaths(left[key], right[key], prefix ? `${prefix}.${key}` : key, result);
  return result;
}
const receiptPath = id => { if (!ID.test(id || '')) fail('valid requestId required'); return RECEIPTS + id + '.json'; };
export const issuedSourceBindingRecoveryPath = id => receiptPath(id).replace(/\.json$/, '.source-binding-recovery.json');
export const isIssuedSourceBindingRecovery = spec => spec?.schemaVersion === ISSUED_SOURCE_BINDING_RECOVERY_SCHEMA;
export const hasIssuedSourceBindingRecoveryMarker = row => Array.isArray(row?.approvalEvidence) && row.approvalEvidence.some(p =>
  typeof p === 'string' && p.startsWith(RECEIPTS) && /\/[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.source-binding-recovery\.json$/.test(p));

export function isExplicitIssuedSourceBindingRecoveryRequest(request) {
  const spec = request?.approval?.sourceRebind, ref = spec?.priorReceiptRef, original = spec?.originalRequestRef;
  return request?.schemaVersion === 'archive-reviewed-exam-meta-register-request-v2' && request.scope === 'PARTIAL_UIDS' &&
    request.registrationMode === undefined && request.approval?.type === 'FINAL_QA' && request.approval.metadataReviewed === true &&
    isIssuedSourceBindingRecovery(spec) && exactKeys(spec, ['schemaVersion', 'priorReceiptRef', 'originalRequestRef', 'issuedReceiptCommit']) &&
    exactKeys(ref, ['path', 'sha256']) && SHA256.test(ref.sha256 || '') && exactKeys(original, ['commit', 'path', 'sha256']) &&
    SHA256.test(original.sha256 || '') && SHA1.test(original.commit || '') && SHA1.test(spec.issuedReceiptCommit || '') &&
    (!request.registryChanges || Array.isArray(request.registryChanges) && !request.registryChanges.length) &&
    Array.isArray(request.approval.evidenceRefs) && request.approval.evidenceRefs.some(value => same(value, ref)) &&
    Array.isArray(request.items) && request.items.length > 0 && request.items.every(item =>
      exactKeys(item, ['questionUid', 'sourceOrdinal', 'before', 'after', 'evidenceRefs']) && same(item.before, {}) && same(item.after, {}) &&
      Array.isArray(item.evidenceRefs) && item.evidenceRefs.some(value => same(value, ref)));
}

function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') ||
      /[\x00-\x1f]/.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe input path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink input path');
  return full;
}
const bytes = (root, p) => fs.readFileSync(safePath(root, p));
const read = (root, p) => JSON.parse(bytes(root, p));
const git = (root, args) => execFileSync('git', args, { cwd: root, maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
function gitBytes(root, commit, relative) {
  if (!SHA1.test(commit || '')) fail('immutable commit SHA required');
  safePath(root, relative);
  if (git(root, ['rev-parse', '--verify', `${commit}^{commit}`]).toString().trim() !== commit) fail('exact commit required');
  const mode = git(root, ['ls-tree', commit, '--', relative]).toString().split(' ')[0];
  if (!['100644', '100755'].includes(mode)) fail('immutable regular file required');
  return git(root, ['show', `${commit}:${relative}`]);
}
// One immutable replay pass can share directory entries, never file bytes or
// verification results. Every read below still obtains the actual Git blob.
function immutableReplayFiles(root) {
  const directories = new Map();
  function directory(commit) {
    if (!SHA1.test(commit || '')) fail('immutable commit SHA required');
    if (!directories.has(commit)) {
      if (git(root, ['rev-parse', '--verify', `${commit}^{commit}`]).toString().trim() !== commit) fail('exact commit required');
      const entries = new Map();
      for (const entry of git(root, ['ls-tree', '-r', '-z', commit]).toString('utf8').split('\0').filter(Boolean)) {
        const tab = entry.indexOf('\t'), [mode, type, object] = entry.slice(0, tab).split(' '), relative = entry.slice(tab + 1);
        if (tab < 0 || !SHA1.test(object || '') || entries.has(relative)) fail('invalid immutable directory entry');
        entries.set(relative, {mode, type});
      }
      directories.set(commit, entries);
    }
    return directories.get(commit);
  }
  function file(commit, relative) {
    safePath(root, relative);
    const entry = directory(commit).get(relative);
    if (!entry || entry.type !== 'blob' || !['100644', '100755'].includes(entry.mode)) fail('immutable regular file required');
    return entry;
  }
  return {
    paths: commit => [...directory(commit).keys()],
    bytes(commit, relative) {
      file(commit,relative);
      return git(root, ['show', `${commit}:${relative}`]);
    },
    many(commit, relatives) {
      relatives.forEach(relative => file(commit,relative));
      return readImmutableGitFiles(root,relatives.map(p=>({commit,path:p})));
    },
    forEach(commit, relatives, consume) {
      relatives.forEach(relative => file(commit,relative));
      forEachImmutableGitFile(root,relatives.map(p=>({commit,path:p})),consume);
    }
  };
}
function bankOf(raw, count) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(raw.toString('utf8'), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questionBank || ctx.questions || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || bank.length !== count || !bank.length) fail('source denominator mismatch');
  return JSON.parse(JSON.stringify(bank));
}
function byUid(rows, label) {
  if (!Array.isArray(rows)) fail(`${label} inventory missing`);
  const map = new Map();
  for (const row of rows) {
    if (typeof row?.questionUid !== 'string' || !row.questionUid || map.has(row.questionUid)) fail(`${label} UID missing or duplicate`);
    map.set(row.questionUid, row);
  }
  return map;
}
function inventory(receipt) {
  const records = byUid(receipt.appliedRecords, 'issued metadata'), runtimes = byUid(receipt.runtimeRecords, 'issued runtime'),
    identities = byUid(receipt.appliedIdentityRecords, 'issued identity'), count = receipt.partialUidCount;
  if (receipt.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || receipt.metadataRegistrationStatus !== 'REGISTERED' ||
      receipt.scope !== 'PARTIAL_UIDS' || receipt.approval?.type !== 'FINAL_QA' || receipt.approval.metadataReviewed !== true ||
      !String(receipt.approval.approvedBy || '').trim() || receipt.registrationMode !== undefined ||
      !SHA256.test(receipt.requestSha256 || '') || !SHA1.test(receipt.sourceBlobSha1 || '') || !SHA256.test(receipt.sourceRawSha256 || '') ||
      !Number.isInteger(count) || count < 1 || receipt.totalQuestions !== count || !Number.isInteger(receipt.expectedQuestionCount) ||
      receipt.expectedQuestionCount < count || records.size !== count ||
      !same([...records.keys()].sort(), [...runtimes.keys()].sort()) || !same([...records.keys()].sort(), [...identities.keys()].sort()))
    fail('exact issued partial FINAL_QA whole-cohort inventory required');
  const ordinals = new Set();
  for (const [uid, row] of records) {
    const runtime = runtimes.get(uid), identity = identities.get(uid), ordinal = row.sourceOrdinal;
    const revision = `meta-foundation:${row.metaFoundationPackId}@${row.metaFoundationPackVersion}:exam-final_qa-v2:${receipt.requestId}`;
    if (!Number.isInteger(ordinal) || ordinal < 1 || ordinal > receipt.expectedQuestionCount || ordinals.has(ordinal) ||
        [row, runtime, identity].some(value => value.sourceArchiveFile !== receipt.sourceArchiveFile || value.sourceOrdinal !== ordinal) ||
        row.metadataApprovalType !== 'FINAL_QA' || runtime.metadataApprovalType !== 'FINAL_QA' ||
        row.metadataRevision !== revision || runtime.metadataRevision !== revision ||
        ![row, runtime].every(value => Array.isArray(value.approvalEvidence) && value.approvalEvidence.includes(receiptPath(receipt.requestId))))
      fail('issued approval/source ordinal/revision mismatch');
    ordinals.add(ordinal);
  }
  return { records, runtimes, identities };
}
function refsOf(request) { return [...request.approval.evidenceRefs, ...request.items.flatMap(row => row.evidenceRefs)]; }
function verifyRefs(root, refs) {
  if (!Array.isArray(refs) || !refs.length) fail('SHA-bound evidence required');
  const seen = new Map();
  for (const ref of refs) {
    if (!exactKeys(ref, ['path', 'sha256']) || !SHA256.test(ref.sha256 || '') || sha(bytes(root, ref.path)) !== ref.sha256 ||
        seen.has(ref.path) && seen.get(ref.path) !== ref.sha256) fail('evidence missing, changed or ambiguous');
    seen.set(ref.path, ref.sha256);
  }
}
function assetPaths(bank, items) {
  const found = new Set();
  const add = value => { if (/^(?:archive\/)?assets\//.test(value)) found.add(value.startsWith('archive/') ? value : `archive/${value}`); };
  const walk = value => {
    if (typeof value === 'string') {
      if (/^(?:archive\/)?assets\/[^\s<>"']+$/.test(value)) add(value);
      for (const match of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) add(match[1]);
    } else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  for (const item of items) for (const field of REASSESSED_STUDENT_FIELDS) walk(bank[item.sourceOrdinal - 1]?.[field]);
  return [...found].sort();
}

// The cache contains only results derived by the actual registrar from immutable
// Git inputs. Every caller still rereads current evidence, assets, canonical
// tables and the supplied/current cohort. No cached live-state permission exists.
const replayCache = new Map();
function bindingPrerequisites(immutableFiles, originalRef, issuedRef, issued, allPaths) {
  const packs = new Set(issued.appliedRecords.map(row => row.metaFoundationPackId)), paths = new Set([...packs].map(id =>
    `archive/data/meta-foundation/canonical/packs/${id.toLowerCase().replaceAll('_','-')}/bindings.json`));
  const selected = new Set(issued.appliedRecords.map(row => row.questionUid)), result = [];
  const candidates=[...allPaths].filter(p => p.startsWith('.archive-meta-register/inbox/') && p.endsWith('.json') && p!==originalRef.path).sort();
  const candidateBytes=immutableFiles.many(originalRef.commit,candidates);
  for (const [i,relative] of candidates.entries()) {
    const raw = candidateBytes[i], request = JSON.parse(raw), changes = request.registryChanges;
    if (!Array.isArray(changes) || !changes.some(change => paths.has(change.path))) continue;
    if (request.schemaVersion !== 'archive-reviewed-exam-meta-register-request-v2' || request.scope !== 'PARTIAL_UIDS' ||
        request.approval?.type !== 'FINAL_QA' || request.approval.sourceRebind || request.registrationMode !== undefined ||
        !Array.isArray(request.items) || request.items.some(row => selected.has(row.questionUid)) ||
        changes.some(change => !paths.has(change.path) || change.collection !== 'bindings' || change.before !== null || change.after?.status !== 'ACTIVE'))
      fail('only disjoint original additive binding prerequisites are supported');
    const p = receiptPath(request.requestId), issuedRaw = immutableFiles.bytes(issuedRef.commit, p), prior = JSON.parse(issuedRaw);
    inventory(prior);
    if (prior.requestSha256 !== sha(stable(request)) || prior.requestId !== request.requestId ||
        !same(prior.approval, request.approval) || !same(prior.registryChanges, changes)) fail('prerequisite lacks its exact issued request/receipt');
    result.push({ request, issued:prior, requestRef:{commit:originalRef.commit,path:relative,sha256:sha(raw)},
      issuedReceiptRef:{commit:issuedRef.commit,path:p,sha256:sha(issuedRaw)} });
  }
  return result;
}
function liveAuthorityRefs(root,original,bank,prerequisites) {
  const refs=new Map(),queue=[];
  const add=ref=>{
    if(!ref||typeof ref.path!=='string'||!SHA256.test(ref.sha256||''))fail('exact live authority ref required');
    if(refs.has(ref.path)){if(refs.get(ref.path).sha256!==ref.sha256)fail('live authority digest conflict');return;}
    if(sha(bytes(root,ref.path))!==ref.sha256)fail('original live authority input does not match its declared digest');
    refs.set(ref.path,{path:ref.path,sha256:ref.sha256});queue.push(ref.path);
  };
  refsOf(original).forEach(add);
  for(const p of assetPaths(bank,original.items))add({path:p,sha256:sha(bytes(root,p))});
  for(let i=0;i<queue.length;i++) {
    const p=queue[i];if(!p.endsWith('.json'))continue;const doc=read(root,p);
    if(doc.schemaVersion==='archive-reviewed-exam-meta-registration-v2') {
      doc.approval.evidenceRefs.forEach(add);
      for(const ref of doc.outputDigests||[])if(ref.path.startsWith(RECEIPTS+doc.requestId+'.')&&ref.path.endsWith('.json'))add(ref);
    }
    if(doc.requestSnapshot?.schemaVersion==='archive-reviewed-exam-meta-register-request-v2')refsOf(doc.requestSnapshot).forEach(add);
    // These are the runtime-read authority references of the existing narrow
    // native/renderer contracts. Arbitrary documentary paths and global output
    // manifests are hydration hints, not live authority dependencies.
    const named=new Set(['reviewRef','independentReviewRef','priorReceiptRef','subsetEvidenceRef','difficultyRequestRef','reuseEvidenceRef']);
    const walk=value=>{if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')for(const [key,v]of Object.entries(value)) {
      if(named.has(key)&&v?.path&&SHA256.test(v.sha256||''))add(v);else if(!['outputDigests','requestSnapshot'].includes(key))walk(v);
    }};walk(doc);
  }
  return [...refs.values(),...prerequisites.map(p=>({path:p.issuedReceiptRef.path,sha256:p.issuedReceiptRef.sha256}))].sort((a,b)=>a.path.localeCompare(b.path));
}
function replayOriginal(root, originalRef, issuedRef) {
  const key = stable([fs.realpathSync(root), originalRef, issuedRef]);
  if (replayCache.has(key)) return replayCache.get(key);
  const immutableFiles = immutableReplayFiles(root);
  const originalRaw = immutableFiles.bytes(originalRef.commit, originalRef.path);
  const issuedRaw = immutableFiles.bytes(issuedRef.commit, issuedRef.path);
  if (sha(originalRaw) !== originalRef.sha256 || sha(issuedRaw) !== issuedRef.sha256) fail('immutable original request/issued receipt digest mismatch');
  const original = JSON.parse(originalRaw), issued = JSON.parse(issuedRaw), old = inventory(issued);
  if (originalRef.path !== `.archive-meta-register/inbox/${original.requestId}.json` || issuedRef.path !== receiptPath(original.requestId) ||
      issued.requestId !== original.requestId || issued.requestSha256 !== sha(stable(original)) || !hasReviewedReceiptLineage(original) ||
      original.schemaVersion !== 'archive-reviewed-exam-meta-register-request-v2' || original.registryChanges?.length ||
      original.registrationMode !== undefined || original.items.some(row => !exactKeys(row.after, ['sourceFingerprint', 'contentFingerprint'])) ||
      original.items.some(row=>row.sourceReview&&Object.keys(row.sourceReview).some(key=>!['schemaVersion','reviewCommit','reviewPath','reviewRef','rendererProof'].includes(key))) ||
      !same(original.approval, issued.approval) || !same(original.registryChanges || [], issued.registryChanges || []) ||
      original.examUid !== issued.examUid || original.sourceArchiveFile !== issued.sourceArchiveFile ||
      original.expectedSourceBlobSha1 !== issued.sourceBlobSha1 || original.expectedQuestionCount !== issued.expectedQuestionCount ||
      !same(original.items.map(row => [row.questionUid, row.sourceOrdinal]).sort(),
        [...old.records.values()].map(row => [row.questionUid, row.sourceOrdinal]).sort())) fail('original request is not this issued fingerprint-only whole cohort');
  const bindingPath = reviewedSourceBindingPath(original.requestId), reviewed = reviewedSourceBindingItems(original);
  if (!reviewed.length || issued.newMetadataApprovals !== undefined || issued.preservedMetadataApprovals !== undefined ||
      issued.outputDigests?.some(ref => ref.path === bindingPath) ||
      [...old.records.values(), ...old.runtimes.values()].some(row => row.approvalEvidence.includes(bindingPath))) fail('only missing issued durable bindings are recoverable');
  try { git(root, ['cat-file', '-e', `${issuedRef.commit}:${bindingPath}`]); fail('issued binding already exists'); }
  catch (error) { if (String(error.message).includes('issued binding already exists')) throw error; }
  const sourcePath = `archive/exams/${original.sourceArchiveFile}`, sourceRaw = immutableFiles.bytes(originalRef.commit, sourcePath);
  if (blob(sourceRaw) !== issued.sourceBlobSha1 || sha(sourceRaw) !== issued.sourceRawSha256 ||
      !sourceRaw.equals(immutableFiles.bytes(issuedRef.commit, sourcePath))) fail('issued source differs from original pre-write source');
  const bank = bankOf(sourceRaw, issued.expectedQuestionCount);
  const shadow = fs.mkdtempSync(path.join(os.tmpdir(), 'issued-source-binding-replay-'));
  try {
    git(root, ['clone', '--quiet', '--shared', '--no-checkout', '--local', root, shadow]);
    git(shadow, ['update-ref', 'HEAD', originalRef.commit]);
    const allPaths = new Set(immutableFiles.paths(originalRef.commit));
    const prerequisites = bindingPrerequisites(immutableFiles, originalRef, issuedRef, issued, allPaths);
    const materialized = new Map();
    const putMany = relatives => {
      const pending=[...new Set(relatives)].filter(relative=>!materialized.has(relative));
      immutableFiles.forEach(originalRef.commit,pending,(raw,i)=>{
        const relative=pending[i],full=safePath(shadow,relative);
        fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,raw);
        materialized.set(relative,sha(raw));
      });
    };
    putMany([...allPaths].filter(relative => [META, IDENTITY, MASTER, 'archive/data/meta-os/received-values.json'].includes(relative) ||
        relative.startsWith('archive/data/meta-foundation/canonical/') || relative.startsWith('archive/data/meta-foundation/compiled/') ||
        relative.startsWith(RUNTIME) || relative === 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json'));
    const queue = [originalRef.path,sourcePath, ...refsOf(original).map(ref => ref.path), ...assetPaths(bank, original.items)];
    for (const prerequisite of prerequisites) {
      const request = prerequisite.request, p = `archive/exams/${request.sourceArchiveFile}`;
      const currentBank = bankOf(immutableFiles.bytes(originalRef.commit, p), request.expectedQuestionCount);
      queue.push(prerequisite.requestRef.path,p,...refsOf(request).map(ref => ref.path),...assetPaths(currentBank,request.items));
    }
    const discover = value => {
      if (typeof value === 'string' && /^(?:archive\/|docs\/|\.archive-meta-register\/)/.test(value) && allPaths.has(value)) queue.push(value);
      else if (Array.isArray(value)) value.forEach(discover);
      else if (value && typeof value === 'object') Object.values(value).forEach(discover);
    };
    const visited = new Set();
    for (let i = 0; i < queue.length;) {
      const pending=[];
      while(i<queue.length) {const relative=queue[i++];if(visited.has(relative))continue;visited.add(relative);pending.push(relative);}
      putMany(pending);
      for(const relative of pending)if (relative.endsWith('.json') && relative !== META && relative !== IDENTITY && !relative.startsWith(RUNTIME)) discover(read(shadow, relative));
    }
    const preIdentityDoc=read(shadow,IDENTITY);
    const preMetadata = byUid(read(shadow, META).records, 'pre-write metadata'), preIdentity = byUid(preIdentityDoc.records, 'pre-write identity');
    const preRuntime=byUid(runtimeDocuments(shadow).flatMap(doc=>doc.records||[]),'pre-write runtime');
    for (const item of original.items) {
      const before = preMetadata.get(item.questionUid), identity = preIdentity.get(item.questionUid);
      if (!before || !identity || before.sourceArchiveFile !== original.sourceArchiveFile || before.sourceOrdinal !== item.sourceOrdinal ||
          identity.sourceArchiveFile !== original.sourceArchiveFile || identity.sourceOrdinal !== item.sourceOrdinal ||
          Object.entries(item.before || {}).some(([field, value]) => !same(before[field] ?? null, value ?? null)) ||
          Object.entries(item.identityBefore || {}).some(([field, value]) => !same(identity[field] ?? null, value ?? null))) fail('immutable pre-write before/join mismatch');
    }
    const prerequisiteProofs=[];
    for (const prerequisite of prerequisites) {
      const report=registerReviewedExamV2({root:shadow,request:prerequisite.request,write:true});
      const actual=read(shadow,prerequisite.issuedReceiptRef.path), expected=structuredClone(prerequisite.issued), normalized=structuredClone(actual);
      delete normalized.outputDigests;delete expected.outputDigests;
      if(report.status!=='PASS'||report.replay||!same(normalized,expected))fail(`official binding prerequisite differs from issued values: ${prerequisite.request.requestId}: ${mismatchPaths(normalized,expected).join(', ')}`);
      prerequisiteProofs.push({requestRef:prerequisite.requestRef,issuedReceiptRef:prerequisite.issuedReceiptRef,
        officialReplayReceiptSha256:sha(stable(actual)),selectedUids:actual.appliedRecords.map(row=>row.questionUid)});
    }
    const report = registerReviewedExamV2({ root: shadow, request: original, write: true });
    if (report.status !== 'PASS' || report.replay || report.totalQuestions !== issued.totalQuestions) fail('official original registration did not apply its whole cohort');
    const strict = read(shadow, issuedRef.path), binding = read(shadow, bindingPath), strictState = inventory(strict);
    const normalized = structuredClone(strict), reviewedUids = new Set(reviewed.map(row => row.questionUid));
    for (const row of [...normalized.appliedRecords, ...normalized.runtimeRecords]) {
      const expected = reviewedUids.has(row.questionUid) ? 1 : 0;
      if (row.approvalEvidence.filter(p => p === bindingPath).length !== expected) fail('official binding provenance scope mismatch');
      row.approvalEvidence = row.approvalEvidence.filter(p => p !== bindingPath);
    }
    // Global runtime/identity digests depend on earlier, unrelated requests in
    // the main writer transaction. Their exact selected records are compared;
    // immutable receipt bytes remain pinned separately to the issued commit.
    const outputPaths = receipt => (receipt.outputDigests || []).map(ref => ref.path).filter(p => p !== bindingPath).sort();
    if (!same(outputPaths(strict), outputPaths(issued)) || (issued.outputDigests || []).some(ref =>
      ref.path !== IDENTITY && !ref.path.startsWith(RUNTIME) && ref.path !== `${RECEIPTS}${original.requestId}.renderer-binding.json`))
      fail('original replay output scope changed');
    for (const ref of issued.outputDigests || []) if (ref.path.endsWith('.renderer-binding.json') &&
      (!bytes(shadow, ref.path).equals(immutableFiles.bytes(issuedRef.commit, ref.path)) || sha(bytes(shadow, ref.path)) !== ref.sha256))
      fail('issued renderer proof differs from official replay');
    delete normalized.outputDigests;
    const withoutOutputs = structuredClone(issued); delete withoutOutputs.outputDigests;
    if (!same(normalized, withoutOutputs)) fail(`official original replay differs from issued approval/metadata/runtime/identity: ${mismatchPaths(normalized, withoutOutputs).join(', ')}`);
    const registry = loadActiveMetaRegistry(shadow);
    if (registry.status !== 'ACTIVE') fail('pre-write ACTIVE registry unavailable');
    const runtimeDocs = runtimeDocuments(shadow), identityDoc = read(shadow, IDENTITY);
    const priorRefs=original.approval.evidenceRefs.filter(ref=>/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.json$/.test(ref.path));
    if(priorRefs.length!==1)fail('one exact original native authority receipt required');
    const priorRef=priorRefs[0],priorRaw=bytes(shadow,priorRef.path),prior=JSON.parse(priorRaw),priorState=inventory(prior);
    if(sha(priorRaw)!==priorRef.sha256||priorRef.path!==receiptPath(prior.requestId)||prior.examUid!==issued.examUid||
      prior.sourceArchiveFile!==issued.sourceArchiveFile||prior.expectedQuestionCount!==issued.expectedQuestionCount||
      !same([...priorState.records.keys()].sort(),[...old.records.keys()].sort()))fail('original native authority whole cohort differs');
    const priorSource=git(shadow,['cat-file','blob',prior.sourceBlobSha1]),priorBank=bankOf(priorSource,prior.expectedQuestionCount);
    if(sha(priorSource)!==prior.sourceRawSha256)fail('original native authority source bytes changed');
    const omit=(row,keys)=>Object.fromEntries(Object.entries(row).filter(([key])=>!keys.includes(key)));
    const derivedMeta=['sourceFingerprint','contentFingerprint','metadataRevision','approvalEvidence','metaFoundationPackVersion'];
    // Build indexes once from this replay's fresh pre/post snapshots. Each UID
    // still undergoes the complete native checks below; no verdict is reused.
    const identityByJoin=new Map(identityDoc.records.map(r=>[`${r.sourceArchiveFile}#${r.sourceOrdinal}`,r]));
    const preIdentityByJoin=new Map(preIdentityDoc.records.map(r=>[`${r.sourceArchiveFile}#${r.sourceOrdinal}`,r]));
    const runtimeStatusByPack=new Map(runtimeDocs.map(doc=>[doc.packId,doc.status]));
    for (const row of strict.appliedRecords) {
      const ordinal = row.sourceOrdinal, question = bank[ordinal - 1], runtime = strictState.runtimes.get(row.questionUid);
      const before=priorState.records.get(row.questionUid),beforeRuntime=priorState.runtimes.get(row.questionUid),beforeIdentity=priorState.identities.get(row.questionUid);
      if(!same(preMetadata.get(row.questionUid),before)||!same(preRuntime.get(row.questionUid),beforeRuntime)||!same(preIdentity.get(row.questionUid),beforeIdentity))
        fail('immutable pre-write whole cohort differs from its original native approval');
      if(!same(omit(row,derivedMeta),omit(before,derivedMeta))||
        !same(omit(runtime,[...derivedMeta,'approvedSourceFingerprint']),omit(beforeRuntime,[...derivedMeta,'approvedSourceFingerprint']))||
        !same(omit(strictState.identities.get(row.questionUid),['sourceFingerprint']),omit(beforeIdentity,['sourceFingerprint'])))
        fail('original fingerprint-only issuance changed a semantic approval or identity');
      const nativeSource = { root: shadow, bytes: sourceRaw, blobSha1: issued.sourceBlobSha1, bank,
        runtimeRecord: runtime, runtimeStatus: runtimeDocs.find(doc => doc.records?.some(r => r.questionUid === row.questionUid))?.status,
        identityMap: identityDoc, identityByJoin, runtimeStatusByPack };
      const originalNativeSource={...nativeSource,bytes:priorSource,blobSha1:prior.sourceBlobSha1,bank:priorBank,runtimeRecord:beforeRuntime,
        identityMap:preIdentityDoc,identityByJoin:preIdentityByJoin};
      if (nativeReviewReceipt({ nativeSource:originalNativeSource, question:priorBank[ordinal-1], previous:priorBank[ordinal-1], current:before, identity:beforeIdentity,
        source: original.sourceArchiveFile, ordinal, pt: registry.problemTypes.get(row.problemTypeKey),
        tpl: registry.templates.get(row.templateKey), registry, ownerPack: row.metaFoundationPackId }) !== priorRef.path)
        fail(`original pre-write native approval cannot replay: ${row.questionUid}`);
      const patch=original.items.find(item=>item.questionUid===row.questionUid),sourceReview=patch.sourceReview!==undefined;
      if(sourceReview ? validateNativeReviewedSourceReuse(strict,nativeSource,question,strictState.identities.get(row.questionUid),ordinal,row,registry)!==true
        : !patch.rebind||patch.rebind.priorSourceBlobSha1!==prior.sourceBlobSha1||!same(question,priorBank[ordinal-1]))
        fail('issued native source review or unchanged peer authority did not replay');
      const evidence=[...new Set([...before.approvalEvidence,issuedRef.path,
        ...(patch.sourceReview?.rendererProof?[`${RECEIPTS}${original.requestId}.renderer-binding.json`]:[]),...(sourceReview?[bindingPath]:[])])];
      if(!same(row.approvalEvidence,evidence)||!same(runtime.approvalEvidence,evidence))fail('official issuance lost its original native provenance');
    }
    const result = { original, issued, binding, sourceRaw, bank,
      liveEvidenceRefs: liveAuthorityRefs(shadow,original,bank,prerequisites), prerequisiteProofs,
      canonicalAuthority: authority(registry, strict.appliedRecords, read(shadow, MASTER)),
      strictReceiptSha256: sha(stable(strict)),
      originalNativeApprovalReplay:{priorReceiptRef:priorRef,sourceBlobSha1:prior.sourceBlobSha1,sourceRawSha256:prior.sourceRawSha256,
        selectedUids:[...old.records.keys()],issuedPackVersions:[...new Set(issued.appliedRecords.map(row=>`${row.metaFoundationPackId}@${row.metaFoundationPackVersion}`))].sort()},
      preStateSha256: sha(stable(original.items.map(item => ({ questionUid: item.questionUid,
        metadata: preMetadata.get(item.questionUid), identity: preIdentity.get(item.questionUid) })))),
      sourceReviewUidCount: reviewed.length, unchangedUidCount: issued.totalQuestions - reviewed.length };
    replayCache.set(key, result); return result;
  } finally { fs.rmSync(shadow, { recursive: true, force: true }); }
}
function runtimeDocuments(root) {
  return fs.readdirSync(safePath(root, RUNTIME.slice(0, -1))).filter(p => p.endsWith('.json') && p !== 'runtime-bridge-receipt.json')
    .map(p => ({ ...read(root, RUNTIME + p), __path: RUNTIME + p }));
}
function authority(registry, rows, master) {
  const pick = (map, keys) => [...new Set(keys)].sort().map(key => [key, map.get(key) ?? null]);
  const selectedBindings=rows.map(row => {
    const selected=activeBindingContext({candidate:row,check:{curriculum:row.curriculum||row.curriculumKey},registry,runtimeOwner:row.metaFoundationPackId});
    if(selected.reason)fail(`selected current ACTIVE binding/scope invalid: ${selected.reason}`);
    return selected.binding;
  });
  const bindings=[...new Map(selectedBindings.map(row=>[stable(row),row])).values()];
  for(const row of rows) {
    const pack=registry.activePacks.get(row.metaFoundationPackId), prior=String(row.metaFoundationPackVersion).match(/^(\d+)\.(\d+)\.(\d+)$/),next=String(pack?.version).match(/^(\d+)\.(\d+)\.(\d+)$/);
    if(!prior||!next||pack.status!=='ACTIVE'||prior.slice(1).some((n,i)=>Number(next[i+1])!==Number(n)&&
      prior.slice(1,i+1).every((p,j)=>Number(next[j+1])===Number(p))&&Number(next[i+1])<Number(n)))fail('current ACTIVE pack cannot carry the issued row version');
  }
  return { problemTypes: pick(registry.problemTypes, rows.map(row => row.problemTypeKey)),
    templates: pick(registry.templates, rows.map(row => row.templateKey)), concepts: pick(registry.concepts, rows.flatMap(row => row.crossConceptKeys || [])),
    conditions: pick(registry.conditions, rows.flatMap(row => row.conditionKeys || [])),
    // Pack version/counts advance for unrelated additive definitions. The exact
    // selected definitions and binding tuples below remain the authority; the
    // issued row's version is never rewritten to the current container version.
    packs: pick(registry.activePacks, rows.map(row => row.metaFoundationPackId)).map(([key,value])=>[key,value&&{id:value.id,status:value.status}]),
    bindings: bindings.sort((a, b) => stable(a).localeCompare(stable(b))),
    master: master.filter(row => rows.some(r => [r.standardUnitKey, r.subUnitKey].includes(row.key))).sort((a, b) => stable(a).localeCompare(stable(b))) };
}
function expectedRefs(original, priorRef, liveRefs) {
  const map = new Map();
  for (const ref of [...refsOf(original), priorRef, ...liveRefs]) {
    if (map.has(ref.path) && map.get(ref.path).sha256 !== ref.sha256) fail('immutable evidence conflict');
    map.set(ref.path, structuredClone(ref));
  }
  return [...map.values()].sort((a, b) => a.path.localeCompare(b.path));
}
function context(root, request) {
  const spec = request?.approval?.sourceRebind;
  if (!isIssuedSourceBindingRecovery(spec) || !exactKeys(spec, ['schemaVersion', 'priorReceiptRef', 'originalRequestRef', 'issuedReceiptCommit']) ||
      !exactKeys(spec.priorReceiptRef, ['path', 'sha256']) || !exactKeys(spec.originalRequestRef, ['commit', 'path', 'sha256']) ||
      !SHA1.test(spec.issuedReceiptCommit || '') || !SHA1.test(spec.originalRequestRef.commit || '') ||
      !SHA256.test(spec.originalRequestRef.sha256 || '') || !SHA256.test(spec.priorReceiptRef.sha256 || '')) fail('exact typed immutable recovery refs required');
  const replay = replayOriginal(root, spec.originalRequestRef, { commit: spec.issuedReceiptCommit, ...spec.priorReceiptRef });
  const { original, issued } = replay;
  if (request.schemaVersion !== 'archive-reviewed-exam-meta-register-request-v2' || !ID.test(request.requestId || '') ||
      request.requestId === original.requestId || request.scope !== 'PARTIAL_UIDS' || request.registrationMode !== undefined ||
      request.registryChanges?.length || !Array.isArray(request.items) || request.items.length !== issued.partialUidCount ||
      request.examUid !== original.examUid || request.sourceArchiveFile !== original.sourceArchiveFile ||
      request.expectedSourceBlobSha1 !== original.expectedSourceBlobSha1 || request.expectedQuestionCount !== original.expectedQuestionCount ||
      Object.hasOwn(request, 'newMetadataApprovals') || Object.hasOwn(request, 'preservedMetadataApprovals')) fail('recovery must preserve the exact original whole cohort and source');
  const refs = expectedRefs(original, spec.priorReceiptRef, replay.liveEvidenceRefs);
  const approval = structuredClone(request.approval); delete approval.sourceRebind; delete approval.evidenceRefs;
  const originalApproval = structuredClone(original.approval); delete originalApproval.evidenceRefs;
  if (!same(approval, originalApproval) || !same(request.approval.evidenceRefs, refs)) fail('original approval and complete immutable evidence must be retained');
  const oldItems = byUid(original.items, 'original request'), items = byUid(request.items, 'recovery request');
  if (!same([...oldItems.keys()].sort(), [...items.keys()].sort())) fail('recovery UID inventory differs');
  for (const [uid, item] of items) if (!exactKeys(item, ['questionUid', 'sourceOrdinal', 'before', 'after', 'evidenceRefs']) ||
      item.sourceOrdinal !== oldItems.get(uid).sourceOrdinal || !same(item.before, {}) || !same(item.after, {}) ||
      !same(item.evidenceRefs, refs)) fail('recovery may not add, omit or change approved values');
  verifyRefs(root, refs);
  if (!bytes(root, spec.priorReceiptRef.path).equals(gitBytes(root, spec.issuedReceiptCommit, spec.priorReceiptRef.path))) fail('original issued receipt changed');
  const registry = loadActiveMetaRegistry(root);
  if (registry.status !== 'ACTIVE' || !same(authority(registry, issued.appliedRecords, read(root, MASTER)), replay.canonicalAuthority))
    fail('current ACTIVE selected authority changed');
  return { ...replay, request, refs, registry, spec };
}
function carriedRow(row, id) {
  return { ...structuredClone(row), metadataRevision: `meta-foundation:${row.metaFoundationPackId}@${row.metaFoundationPackVersion}:exam-final_qa-v2:${id}`,
    approvalEvidence: [...new Set([...row.approvalEvidence, receiptPath(id), issuedSourceBindingRecoveryPath(id)])] };
}
function buildProof(ctx) {
  const { request, original, issued } = ctx;
  return { schemaVersion: PROOF_SCHEMA, requestId: request.requestId, requestSha256: sha(stable(request)),
    sourceArchiveFile: issued.sourceArchiveFile, sourceBlobSha1: issued.sourceBlobSha1, sourceRawSha256: issued.sourceRawSha256,
    expectedQuestionCount: issued.expectedQuestionCount, partialUidCount: issued.partialUidCount,
    newMetadataApprovals: 0, preservedMetadataApprovals: issued.partialUidCount, newMathematicalQa: false, newDifficultyJudgments: 0,
    originalRequestRef: request.approval.sourceRebind.originalRequestRef,
    issuedReceiptRef: { commit: request.approval.sourceRebind.issuedReceiptCommit, ...request.approval.sourceRebind.priorReceiptRef },
    sourceReviewUidCount: ctx.sourceReviewUidCount, unchangedUidCount: ctx.unchangedUidCount,
    officialReplay: { originalRequestSha256: sha(stable(original)), receiptSha256: ctx.strictReceiptSha256, preStateSha256: ctx.preStateSha256,
      bindingPrerequisites:ctx.prerequisiteProofs,originalNativeApproval:ctx.originalNativeApprovalReplay },
    reconstructedSourceBinding: ctx.binding, requestSnapshot: structuredClone(request),
    records: issued.appliedRecords.map(row => ({ questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal,
      issuedMetadataSha256: sha(stable(row)), issuedRuntimeSha256: sha(stable(issued.runtimeRecords.find(r => r.questionUid === row.questionUid))),
      issuedIdentitySha256: sha(stable(issued.appliedIdentityRecords.find(r => r.questionUid === row.questionUid))) })) };
}
function expectedReceipt(ctx, proof, outputDigests) {
  const { request, issued } = ctx;
  return { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId: request.requestId, requestSha256: sha(stable(request)),
    examUid: issued.examUid, sourceArchiveFile: issued.sourceArchiveFile, sourceBlobSha1: issued.sourceBlobSha1, sourceRawSha256: issued.sourceRawSha256,
    approval: structuredClone(request.approval), metadataRegistrationStatus: 'REGISTERED', examFinalQaStatus: 'NOT_EVALUATED_BY_REGISTRAR',
    consumerSearchStatus: 'NOT_RUN', totalQuestions: issued.totalQuestions, registryChanges: [],
    appliedRecords: issued.appliedRecords.map(row => carriedRow(row, request.requestId)),
    appliedIdentityRecords: structuredClone(issued.appliedIdentityRecords), fingerprintRepairs: [],
    runtimeRecords: issued.runtimeRecords.map(row => carriedRow(row, request.requestId)), outputDigests,
    scope: 'PARTIAL_UIDS', partialUidCount: issued.partialUidCount, expectedQuestionCount: issued.expectedQuestionCount,
    newMetadataApprovals: 0, preservedMetadataApprovals: issued.partialUidCount,
    issuedSourceBindingRecovery: { schemaVersion: ISSUED_SOURCE_BINDING_RECOVERY_SCHEMA,
      proofPath: issuedSourceBindingRecoveryPath(request.requestId), sourceReviewUidCount: proof.sourceReviewUidCount, unchangedUidCount: proof.unchangedUidCount } };
}
function verifyReceipt(ctx, receipt, proof) {
  const proofPath = issuedSourceBindingRecoveryPath(ctx.request.requestId), expectedProof = buildProof(ctx);
  if (!same(proof, expectedProof) || !Array.isArray(receipt.outputDigests) ||
      receipt.outputDigests.filter(ref => ref.path === proofPath && ref.sha256 === sha(json(proof))).length !== 1 ||
      receipt.outputDigests.some(ref => !SHA256.test(ref.sha256 || '') || ref.path !== proofPath && !ref.path.startsWith(RUNTIME)) ||
      !same(receipt, expectedReceipt(ctx, proof, receipt.outputDigests))) fail('recovery receipt/proof differs from actual immutable replay');
  inventory(receipt);
}

let liveSnapshotCache;
function liveSnapshot(root) {
  const raw = new Map([[META,bytes(root,META)],[IDENTITY,bytes(root,IDENTITY)]]);
  for(const name of fs.readdirSync(safePath(root,RUNTIME.slice(0,-1))).filter(p=>p.endsWith('.json')&&p!=='runtime-bridge-receipt.json'))
    raw.set(RUNTIME+name,bytes(root,RUNTIME+name));
  const key=stable([fs.realpathSync(root),[...raw].map(([p,value])=>[p,sha(value)])]);
  if(liveSnapshotCache?.key===key)return liveSnapshotCache;
  const docs=[...raw].filter(([p])=>p.startsWith(RUNTIME)).map(([p,value])=>({...JSON.parse(value),__path:p}));
  const metadata=byUid(JSON.parse(raw.get(META)).records,'live metadata'),
    identity=byUid(JSON.parse(raw.get(IDENTITY)).records,'live identity');
  const runtime=byUid(docs.flatMap(doc=>doc.records||[]),'live runtime'),runtimePackByUid=new Map();
  for(const doc of docs)for(const row of doc.records||[])runtimePackByUid.set(row.questionUid,doc);
  liveSnapshotCache={key,metadata,identity,runtime,runtimePackByUid,docs};
  return liveSnapshotCache;
}
const withoutProvenance=row=>Object.fromEntries(Object.entries(row).filter(([key])=>!['metadataRevision','approvalEvidence'].includes(key)));
function assertLiveCohort(root,ctx,recovery) {
  const live=liveSnapshot(root),expected=inventory(recovery),sourceRaw=bytes(root,`archive/exams/${recovery.sourceArchiveFile}`),bank=bankOf(sourceRaw,recovery.expectedQuestionCount);
  const latestIds=new Set();
  for(const [uid,row]of expected.records) {
    const current=live.metadata.get(uid),runtime=live.runtime.get(uid),pack=live.runtimePackByUid.get(uid);
    if(!current||!runtime||!same(withoutProvenance(current),withoutProvenance(row))||
      !same(withoutProvenance(runtime),withoutProvenance(expected.runtimes.get(uid)))||!same(live.identity.get(uid),expected.identities.get(uid))||
      !same(bank[row.sourceOrdinal-1],ctx.bank[row.sourceOrdinal-1])||pack?.status!=='ACTIVE'||pack.packId!==row.metaFoundationPackId||
      pack.packVersion!==ctx.registry.activePacks.get(row.metaFoundationPackId)?.version||
      pack.generatedFrom?.[`reviewedExam_${recovery.requestId}`]!==receiptPath(recovery.requestId))
      fail('live whole-cohort approval, identity, student or ACTIVE runtime drift');
    const id=current.metadataRevision.match(/:exam-final_qa-v2:([A-Za-z0-9][A-Za-z0-9_-]{0,100})$/)?.[1];
    if(!id||runtime.metadataRevision!==current.metadataRevision)fail('live cohort revision mismatch');latestIds.add(id);
  }
  if(latestIds.size!==1)fail('live recovery cohort split across incompatible registrations');
  let cursor=read(root,receiptPath([...latestIds][0])),state=inventory(cursor);
  for(const [uid]of expected.records)if(!same(state.records.get(uid),live.metadata.get(uid))||!same(state.runtimes.get(uid),live.runtime.get(uid))||
    !same(state.identities.get(uid),live.identity.get(uid)))fail('latest whole-cohort receipt differs from actual records');
  const seen=new Set();
  while(cursor.requestId!==recovery.requestId) {
    if(seen.has(cursor.requestId)||seen.size>=64)fail('source-only recovery descendant cycle');seen.add(cursor.requestId);
    const spec=cursor.approval.sourceRebind,ref=spec?.priorReceiptRef;
    if(!exactKeys(spec,['priorReceiptRef'])||!exactKeys(ref,['path','sha256'])||!SHA256.test(ref.sha256||'')||
      cursor.newMetadataApprovals!==0||cursor.preservedMetadataApprovals!==recovery.partialUidCount||
      cursor.partialUidCount!==recovery.partialUidCount||cursor.expectedQuestionCount!==recovery.expectedQuestionCount||
      cursor.examUid!==recovery.examUid||cursor.sourceArchiveFile!==recovery.sourceArchiveFile||
      cursor.registryChanges?.length||cursor.fingerprintRepairs?.length||cursor.nativeParentBindings?.length||
      !cursor.approval.evidenceRefs.some(value=>same(value,ref)))fail('only exact whole-cohort source-only descendants may carry recovery');
    verifyRefs(root,cursor.approval.evidenceRefs);
    const priorRaw=bytes(root,ref.path);if(sha(priorRaw)!==ref.sha256)fail('recovery descendant ancestor digest changed');
    const prior=JSON.parse(priorRaw),old=inventory(prior);
    if(ref.path!==receiptPath(prior.requestId)||prior.sourceRawSha256===cursor.sourceRawSha256||
      !same([...state.records.keys()].sort(),[...expected.records.keys()].sort())||
      !same([...old.records.keys()].sort(),[...expected.records.keys()].sort()))fail('recovery descendant scope/source changed');
    const currentSource=blob(sourceRaw)===cursor.sourceBlobSha1?sourceRaw:git(root,['cat-file','blob',cursor.sourceBlobSha1]);
    if(sha(currentSource)!==cursor.sourceRawSha256)fail('recovery descendant current source hash changed');
    const currentBank=bankOf(currentSource,cursor.expectedQuestionCount);
    const priorSource=git(root,['cat-file','blob',prior.sourceBlobSha1]),priorBank=bankOf(priorSource,prior.expectedQuestionCount);
    if(sha(priorSource)!==prior.sourceRawSha256)fail('recovery descendant prior source hash changed');
    for(const [uid,row]of state.records) {
      const before=old.records.get(uid),evidence=[...new Set([...before.approvalEvidence,receiptPath(cursor.requestId)])];
      if(!same(withoutProvenance(row),withoutProvenance(before))||!same(row.approvalEvidence,evidence)||
        !same(withoutProvenance(state.runtimes.get(uid)),withoutProvenance(old.runtimes.get(uid)))||!same(state.runtimes.get(uid).approvalEvidence,evidence)||
        !same(state.identities.get(uid),old.identities.get(uid))||!same(currentBank[row.sourceOrdinal-1],priorBank[row.sourceOrdinal-1]))
        fail('recovery descendant altered a selected approval, question or identity');
    }
    cursor=prior;state=old;
  }
  if(!same(cursor,recovery))fail('live descendant does not end in this exact verified recovery');
}

// Exact input builder for callers. It does not write an inbox, source or approval.
export function prepareIssuedSourceBindingRecovery({ root, requestId, originalRequestRef, issuedReceiptCommit, priorReceiptRef }) {
  receiptPath(requestId);
  const ctx = replayOriginal(root, originalRequestRef, { commit: issuedReceiptCommit, ...priorReceiptRef });
  const refs = expectedRefs(ctx.original, priorReceiptRef, ctx.liveEvidenceRefs), sourceRebind = {
    schemaVersion: ISSUED_SOURCE_BINDING_RECOVERY_SCHEMA, priorReceiptRef, originalRequestRef, issuedReceiptCommit };
  const request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId,
    examUid: ctx.original.examUid, sourceArchiveFile: ctx.original.sourceArchiveFile,
    expectedSourceBlobSha1: ctx.original.expectedSourceBlobSha1, expectedQuestionCount: ctx.original.expectedQuestionCount,
    scope: 'PARTIAL_UIDS', approval: { ...structuredClone(ctx.original.approval), evidenceRefs: refs, sourceRebind }, registryChanges: [],
    items: ctx.original.items.map(row => ({ questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal, before: {}, after: {}, evidenceRefs: refs })) };
  return { request, inputRefs: refs, sourceReviewUidCount: ctx.sourceReviewUidCount, unchangedUidCount: ctx.unchangedUidCount };
}

export function registerIssuedSourceBindingRecovery({ root, request, write = false, verifyProjection = false }) {
  const ctx = context(root, request), id = request.requestId, relative = receiptPath(id), proofPath = issuedSourceBindingRecoveryPath(id);
  const sourceRaw = bytes(root, `archive/exams/${request.sourceArchiveFile}`);
  if (!sourceRaw.equals(ctx.sourceRaw)) fail('current whole source differs from issued source');
  const metadata = read(root, META), identity = read(root, IDENTITY), current = byUid(metadata.records, 'current metadata'),
    ids = byUid(identity.records, 'current identity'), runtimeDocs = runtimeDocuments(root), allRuntime = byUid(runtimeDocs.flatMap(doc => doc.records || []), 'current runtime');
  if (metadata.records.filter(row => row.sourceArchiveFile === request.sourceArchiveFile).length !== request.expectedQuestionCount ||
      identity.records.filter(row => row.sourceArchiveFile === request.sourceArchiveFile).length !== request.expectedQuestionCount) fail('current full source inventory differs');
  const exists = fs.existsSync(safePath(root, relative)), proof = buildProof(ctx);
  if (!exists && fs.existsSync(safePath(root, proofPath))) fail('orphan recovery proof cannot be adopted');
  const receipt = exists ? read(root, relative) : expectedReceipt(ctx, proof, []);
  if (exists) verifyReceipt(ctx, receipt, read(root, proofPath));
  const expected = exists ? receipt : ctx.issued;
  for (const row of expected.appliedRecords) if (!same(current.get(row.questionUid), row) ||
      !same(ids.get(row.questionUid), expected.appliedIdentityRecords.find(r => r.questionUid === row.questionUid)) ||
      !same(allRuntime.get(row.questionUid), expected.runtimeRecords.find(r => r.questionUid === row.questionUid))) fail('current whole-cohort metadata/runtime/identity drift');
  const summary = { status: 'PASS', requestId: id, approvalType: 'FINAL_QA', totalQuestions: ctx.issued.totalQuestions,
    scope: 'PARTIAL_UIDS', partialUidCount: ctx.issued.partialUidCount, expectedQuestionCount: ctx.issued.expectedQuestionCount,
    newMetadataApprovals: 0, preservedMetadataApprovals: ctx.issued.partialUidCount, sourceReviewUidCount: ctx.sourceReviewUidCount,
    unchangedUidCount: ctx.unchangedUidCount, registryChangeCount: 0, fingerprintRepairCount: 0,
    runtimeMaterialized: ctx.issued.partialUidCount, browserStatus: 'NOT_RUN' };
  if (exists) {
    assertLiveCohort(root,ctx,receipt);
    const consumerLanes = verifyProjection ? verifyConsumerValues(root, receipt.appliedRecords, receipt.runtimeRecords,
      loadResolvedConsumerCatalog(root), { sourceValueOverrides: ctx.issued.sourceValueOverrides || [] }) : null;
    return { ...summary, replay: true, plannedPaths: [], consumerSearchStatus: verifyProjection ? 'STATIC_VALUES_VERIFIED' : 'NOT_RUN',
      ...(consumerLanes ? { consumerLanes } : {}) };
  }
  if (verifyProjection) fail('recovery receipt required before Consumer verification');
  const next = new Map(receipt.appliedRecords.map(row => [row.questionUid, row])), nextRuntime = new Map(receipt.runtimeRecords.map(row => [row.questionUid, row]));
  const outputs = new Map([[META, json({ ...metadata, records: metadata.records.map(row => next.get(row.questionUid) || row) })], [proofPath, json(proof)]]);
  for (const doc of runtimeDocs) if (doc.records?.some(row => nextRuntime.has(row.questionUid))) {
    if (doc.status !== 'ACTIVE' || doc.packVersion!==ctx.registry.activePacks.get(doc.packId)?.version) fail('current runtime is not the ACTIVE container version');
    const value = { ...doc, generatedFrom:{...(doc.generatedFrom||{}),[`reviewedExam_${id}`]:relative},
      records: doc.records.map(row => nextRuntime.get(row.questionUid) || row) }; delete value.__path;
    outputs.set(doc.__path, json(value));
  }
  receipt.outputDigests = [...outputs].filter(([p]) => p !== META).map(([p, raw]) => ({ path: p, sha256: sha(raw) }));
  outputs.set(relative, json(receipt)); verifyReceipt(ctx, receipt, proof);
  if (write) {
    const backups = new Map();
    try {
      for (const [p, raw] of outputs) {
        const full = safePath(root, p); backups.set(full, fs.existsSync(full) ? fs.readFileSync(full) : null);
        fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, raw);
      }
    } catch (error) {
      for (const [full, raw] of backups) { if (raw === null) fs.rmSync(full, { force: true }); else fs.writeFileSync(full, raw); }
      throw error;
    }
  }
  return { ...summary, write, replay: false, consumerSearchStatus: 'NOT_RUN', plannedPaths: [...outputs.keys()] };
}

export function validateIssuedSourceBindingRecovery(receipt, nativeSource, question, identity, ordinal, current) {
  const ownMarker=ID.test(receipt?.requestId||'')?issuedSourceBindingRecoveryPath(receipt.requestId):null;
  if (!isIssuedSourceBindingRecovery(receipt?.approval?.sourceRebind) && receipt?.issuedSourceBindingRecovery === undefined &&
      ![...(receipt?.appliedRecords||[]),...(receipt?.runtimeRecords||[])].some(row=>row.approvalEvidence?.includes(ownMarker))) return null;
  if (!isIssuedSourceBindingRecovery(receipt.approval?.sourceRebind)) fail('recovery marker lost its exact contract');
  const root = nativeSource.root, proof = read(root, issuedSourceBindingRecoveryPath(receipt.requestId));
  const ctx = context(root, proof.requestSnapshot); verifyReceipt(ctx, receipt, proof);
  assertLiveCohort(root,ctx,receipt);
  if (!same(read(root, receiptPath(receipt.requestId)), receipt) || !Buffer.isBuffer(nativeSource.bytes) ||
      !nativeSource.bytes.equals(ctx.sourceRaw) || nativeSource.blobSha1 !== ctx.issued.sourceBlobSha1 ||
      !same(nativeSource.bank, ctx.bank) || !same(question, ctx.bank[ordinal - 1])) fail('recovery current/historical source context drift');
  const state = inventory(receipt), uid = identity.questionUid;
  if (state.records.get(uid)?.sourceOrdinal !== ordinal || !same(state.records.get(uid), current) ||
      !same(state.runtimes.get(uid), nativeSource.runtimeRecord) || !same(state.identities.get(uid), identity)) fail('recovery supplied current state drift');
  return true;
}
