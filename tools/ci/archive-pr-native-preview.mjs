// Apply source-bound v2 and reviewed difficulty5 requests in a disposable CI checkout.
// PRs select changed requests plus exact inherited, approval-preserving partial
// FINAL_QA source rebinds. Pushes select the exact pending HEAD inbox.
// The main writer, inbox consumption and approval policy remain unchanged.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { SOURCE_SUBSET_SCHEMA, sourceSubsetEvidencePath } from '../../archive/tools/meta-foundation/source-subset-preservation.mjs';

export const NATIVE_PREVIEW_SCHEMA = 'archive-pr-native-preview/v1';
export const NATIVE_REQUEST_SCHEMA = 'archive-reviewed-exam-meta-register-request-v2';
export const DIFFICULTY_REQUEST_SCHEMA = 'archive-difficulty5-register-request-v1';
const DIFFICULTY_CORRECTION_SCHEMA = 'archive-difficulty5-reviewed-correction-v1';
export const AUDIT_PRESERVATION_SCHEMA = 'archive-native-audit-preservation-v1';
export const BASIC_PRESERVATION_SCHEMA = 'archive-basic-scope-current-source-preservation-v1';
const BASIC_REBIND_SCHEMA = 'archive-basic-scope-rebind-request-v1';
const PARENT_CORRECTION_SCHEMA = 'archive-basic-parent-correction-request-v1';
export const NATIVE_PREVIEW_HELPER = 'tools/ci/archive-pr-native-preview.mjs';
const INBOX = '.archive-meta-register/inbox/';
const REGISTRAR = 'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs';
const DIFFICULTY_REGISTRAR = 'archive/tools/meta-foundation/register-difficulty5.mjs';
const METADATA = 'archive/data/question_metadata.json';
const CONSUMER = 'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = reason => { throw Error(`PR_NATIVE_PREVIEW:${reason}`); };
const sorted = values => [...new Set(values)].sort();

export function nativeCommand(program, args, root) {
  const r = spawnSync(program, args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    timeout: 12 * 60 * 1000, stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error || r.status !== 0) fail(`COMMAND_FAILED:${args[0]}:${r.status ?? r.signal}:${String(r.stderr || '').slice(-1500)}`);
  return r.stdout || '';
}
const git = (root, ...args) => nativeCommand('git', args, root);
function gitBytes(root, ref) {
  const result = spawnSync('git', ['show', ref], { cwd: root, maxBuffer: 128 * 1024 * 1024 });
  if (result.error || result.status !== 0) fail(`GIT_INPUT_MISSING:${ref}`);
  return result.stdout;
}

function safe(root, file) {
  if (typeof file !== 'string' || !file || /[\\\r\n\0]/.test(file) || path.isAbsolute(file)
      || file.split('/').some(p => !p || p === '.' || p === '..')) fail('UNSAFE_PATH');
  let full = root;
  for (const part of file.split('/')) {
    full = path.join(full, part);
    if (fs.existsSync(full) && fs.lstatSync(full).isSymbolicLink()) fail(`SYMLINK:${file}`);
  }
  return full;
}
function fileRef(root, file) {
  const full = safe(root, file);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) fail(`MISSING_FILE:${file}`);
  const bytes = fs.readFileSync(full);
  return { path: file, sha256: sha(bytes), sizeBytes: bytes.length };
}
const dirty = root => sorted([
  ...git(root, 'diff', '--name-only', '-z', 'HEAD', '--').split('\0'),
  ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0'),
].filter(Boolean));
function dirtySnapshot(root) {
  return new Map(dirty(root).map(file => [file, fs.existsSync(safe(root, file)) ? fileRef(root, file).sha256 : null]));
}
function noUnexpectedMutation(root, before, allowed) {
  const after = dirtySnapshot(root), names = sorted([...before.keys(), ...after.keys()]);
  if (names.some(file => before.get(file) !== after.get(file) && !allowed.has(file))) fail('UNDECLARED_NATIVE_OUTPUT');
}
function parsed(result) {
  try { return JSON.parse(result); } catch { fail('REGISTRAR_RESULT_INVALID'); }
}

function selectReviewedDifficulty(root, file, request, headSha) {
  const payload = request.gemini, correction = request.reviewedCorrection;
  if (payload?.schemaVersion !== 'v1' || correction?.schemaVersion !== DIFFICULTY_CORRECTION_SCHEMA
      || typeof correction.approvalRef !== 'string' || !correction.approvalRef.trim()) fail('DIFFICULTY_APPROVAL');
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(payload.requestId || '')) fail('REQUEST_ID');
  if (!Array.isArray(payload.items) || !payload.items.length) fail('QUESTION_COUNT');
  const selectedItems = payload.items.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.ordinal }));
  if (selectedItems.some(item => typeof item.questionUid !== 'string' || !item.questionUid.trim()
      || !Number.isSafeInteger(item.sourceOrdinal) || item.sourceOrdinal < 1)
      || new Set(selectedItems.map(i => i.questionUid)).size !== selectedItems.length
      || new Set(selectedItems.map(i => i.sourceOrdinal)).size !== selectedItems.length) fail('SELECTED_UID_SCOPE');
  selectedItems.sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  if (!String(correction.evidencePath || '').startsWith('.archive-meta-register/evidence/')
      || !/^[a-f0-9]{64}$/.test(correction.evidenceSha256 || '')) fail('EVIDENCE_REQUIRED');
  const evidence = fileRef(root, correction.evidencePath);
  if (evidence.sha256 !== correction.evidenceSha256) fail(`EVIDENCE_DRIFT:${evidence.path}`);
  if (sha(gitBytes(root, `${headSha}:${evidence.path}`)) !== evidence.sha256) fail(`EVIDENCE_NOT_FIXED:${evidence.path}`);
  const sourcePath = `archive/exams/${payload.sourceArchiveFile}`, source = fileRef(root, sourcePath);
  const blobSha1 = git(root, 'rev-parse', `${headSha}:${sourcePath}`).trim();
  if (blobSha1 !== payload.latestBlobSha || sha(gitBytes(root, `${headSha}:${sourcePath}`)) !== source.sha256) fail('SOURCE_NOT_FIXED');
  let bank;
  try {
    const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.runInNewContext(fs.readFileSync(safe(root, sourcePath), 'utf8'), ctx, { timeout: 5000 });
    bank = ctx.window.questionBank || ctx.window.questions || ctx.window.examData?.questions;
  } catch { fail('SOURCE_BANK_INVALID'); }
  if (!Array.isArray(bank) || !bank.length || selectedItems.some(i => i.sourceOrdinal > bank.length)) fail('SOURCE_DENOMINATOR');
  return { ...fileRef(root, file), requestId: payload.requestId, kind: 'difficulty5-ratings',
    questionCount: selectedItems.length, sourceQuestionCount: bank.length, selectedItems,
    difficultyBeforeBindings: difficultyBeforeBindings(request),
    source: { ...source, blobSha1 }, evidence: [evidence] };
}

export function difficultyBeforeBindings(request) {
  return request.schemaVersion === DIFFICULTY_REQUEST_SCHEMA && Array.isArray(request.reviewedCorrection?.rows)
    ? request.reviewedCorrection.rows.map(row => ({ questionUid: row.questionUid, sourceOrdinal: row.ordinal,
      sourceFingerprint: row.before?.sourceFingerprint, contentFingerprint: row.before?.contentFingerprint })) : [];
}
export function basicPreservationDescriptor(request) {
  if (request.schemaVersion !== BASIC_REBIND_SCHEMA || request.approval?.sourceReview === undefined) return undefined;
  if (request.approval.sourceReview?.schemaVersion !== BASIC_PRESERVATION_SCHEMA || request.approval.type !== 'BASIC_SCOPE_REBIND'
      || request.scope !== undefined || request.registrationMode !== undefined || !Array.isArray(request.items) || !request.items.length)
    fail('BASIC_PRESERVATION_SCOPE');
  const bindings = request.items.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    sourceFingerprint: item.after?.sourceFingerprint, contentFingerprint: item.after?.contentFingerprint }));
  if (bindings.some(row => typeof row.questionUid !== 'string' || !row.questionUid || !Number.isSafeInteger(row.sourceOrdinal) || row.sourceOrdinal < 1
      || !/^[a-f0-9]{64}$/.test(row.sourceFingerprint || '') || !/^[a-f0-9]{64}$/.test(row.contentFingerprint || ''))
      || new Set(bindings.map(r => r.questionUid)).size !== bindings.length) fail('BASIC_PRESERVATION_BINDINGS');
  return { schemaVersion: BASIC_PRESERVATION_SCHEMA, bindings };
}

// Preserve the normal request order except where one exact audit-preservation
// request declares its reviewed difficulty input. The dependency must itself
// be selected by this PR; an unchanged inbox request is never pulled in.
export function auditPreservationDependency(request, file) {
  const spec = request.approval?.sourceRebind;
  const audit = spec?.schemaVersion === AUDIT_PRESERVATION_SCHEMA;
  if (audit && (request.schemaVersion !== NATIVE_REQUEST_SCHEMA || request.approval.type !== 'META_PIPELINE_AUDIT'
      || request.scope !== undefined && request.scope !== 'PARTIAL_UIDS' || request.registrationMode !== undefined
      || spec.requestPath !== file)) fail('AUDIT_DEPENDENCY_SCOPE');
  if (!audit && spec?.difficultyRequestRef !== undefined) fail('AUDIT_DEPENDENCY_SCOPE');
  return audit ? { schemaVersion: AUDIT_PRESERVATION_SCHEMA, difficultyRequestRef: spec.difficultyRequestRef } : undefined;
}

const REGISTRY_DEPENDENCY_SCHEMA = 'archive-native-active-binding-dependency-v1';
const BINDING_FIELDS = ['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey'];
const BINDING_PATH = /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9_-]+\/bindings\.json$/;
function bindingKey(value) {
  if (!value || BINDING_FIELDS.some(field => typeof value[field] !== 'string' || !value[field].trim())) return null;
  return Object.fromEntries(BINDING_FIELDS.map(field => [field, value[field]]));
}

// Ordering uses only explicit final tuples and exact add-only ACTIVE binding
// rows in the selected requests. The registrar still validates every input,
// existing canonical row, evidence and output before it writes.
export function nativeRegistryDependencyDescriptor(request) {
  if (request.schemaVersion !== NATIVE_REQUEST_SCHEMA || request.registrationMode !== undefined) return undefined;
  const provides = (Array.isArray(request.registryChanges) ? request.registryChanges : []).flatMap(change => {
    const key = bindingKey(change.after), match = bindingKey(change.match);
    return change.before === null && change.collection === 'bindings' && BINDING_PATH.test(change.path)
      && change.after?.status === 'ACTIVE' && key && match && eq(key, match)
      && Object.keys(change.match).length === BINDING_FIELDS.length ? [{ path: change.path, key }] : [];
  });
  const requires = (Array.isArray(request.items) ? request.items : []).flatMap(item => {
    const key = bindingKey(item.after);
    return key ? [{ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, key }] : [];
  });
  return provides.length || requires.length ? { schemaVersion: REGISTRY_DEPENDENCY_SCHEMA, provides, requires } : undefined;
}

export function nativeRegistryDependencies(requests) {
  const providers = new Map(), dependencies = new Map();
  const keyOf = key => {
    const normalized = bindingKey(key);
    if (!normalized || Object.keys(key).length !== BINDING_FIELDS.length) fail('REGISTRY_DEPENDENCY_KEY');
    return JSON.stringify(normalized);
  };
  for (const request of requests) {
    const descriptor = request.registryDependency;
    if (!descriptor) continue;
    if (descriptor.schemaVersion !== REGISTRY_DEPENDENCY_SCHEMA || !Array.isArray(descriptor.provides)
      || !Array.isArray(descriptor.requires)) fail('REGISTRY_DEPENDENCY_DESCRIPTOR');
    for (const row of descriptor.provides) {
      if (!BINDING_PATH.test(row.path)) fail('REGISTRY_DEPENDENCY_PATH');
      const key = keyOf(row.key);
      if (providers.has(key)) fail('REGISTRY_DEPENDENCY_AMBIGUOUS');
      providers.set(key, request.path);
    }
  }
  for (const request of requests) for (const row of request.registryDependency?.requires || []) {
    const provider = providers.get(keyOf(row.key));
    if (!provider || provider === request.path) continue;
    if (!dependencies.has(request.path)) dependencies.set(request.path, new Set());
    dependencies.get(request.path).add(provider);
  }
  return dependencies;
}

export function orderNativeRequests(requests) {
  const byPath = new Map(requests.map(request => [request.path, request]));
  if (byPath.size !== requests.length) fail('DUPLICATE_REQUEST_PATH');
  const dependencies = new Map();
  for (const request of requests) {
    if (!request.sourceRebind) continue;
    const spec = request.sourceRebind, ref = spec.difficultyRequestRef;
    if (spec.schemaVersion !== AUDIT_PRESERVATION_SCHEMA || request.kind !== undefined && request.kind !== 'native-approval-preservation'
        || request.scope !== undefined && request.scope !== 'PARTIAL_UIDS' || request.registrationMode !== undefined) fail('AUDIT_DEPENDENCY_SCOPE');
    if (typeof ref?.path !== 'string' || !ref.path.startsWith(INBOX)
        || ref.path.slice(INBOX.length).includes('/') || !ref.path.endsWith('.json')
        || !/^[a-f0-9]{64}$/.test(ref.sha256 || '')) fail('AUDIT_DEPENDENCY_REF');
    safe('/', ref.path);
    const dependency = byPath.get(ref.path);
    if (!dependency) fail('AUDIT_DEPENDENCY_NOT_SELECTED');
    if (dependency.kind !== 'difficulty5-ratings' || dependency.sourceRebind) fail('AUDIT_DEPENDENCY_KIND');
    if (dependency.sha256 !== ref.sha256) fail('AUDIT_DEPENDENCY_SHA');
    if (!request.source || !dependency.source || request.source.path !== dependency.source.path
        || request.source.blobSha1 !== dependency.source.blobSha1
        || request.source.sha256 !== dependency.source.sha256) fail('AUDIT_DEPENDENCY_SOURCE');
    // A selected audit subset still depends on the exact whole-source D5 input.
    // The preview must not replace the original denominator with selectedCount.
    const total = request.sourceQuestionCount, items = dependency.selectedItems;
    if (!Number.isSafeInteger(total) || total < 1 || dependency.sourceQuestionCount !== total || dependency.questionCount !== total ||
        !Array.isArray(items) || items.length !== total || new Set(items.map(i => i.questionUid)).size !== total ||
        new Set(items.map(i => i.sourceOrdinal)).size !== total || items.some(i => !Number.isSafeInteger(i.sourceOrdinal) || i.sourceOrdinal < 1 || i.sourceOrdinal > total))
      fail('AUDIT_DEPENDENCY_DENOMINATOR');
    if (!Array.isArray(request.selectedItems) || request.selectedItems.length !== request.questionCount ||
        request.selectedItems.some(i => !items.some(d => d.questionUid === i.questionUid && d.sourceOrdinal === i.sourceOrdinal)))
      fail('AUDIT_DEPENDENCY_UID_SCOPE');
    dependencies.set(request.path, new Set([ref.path]));
  }
  // Rebinding an existing basic body precedes only a difficulty request whose
  // exact before fingerprints name that result. No filename or global kind
  // ordering is used, and unrelated reviewed difficulty requests stay put.
  const basic = requests.filter(r => r.basicPreservation);
  const owners = new Map();
  for (const request of basic) {
    if (request.kind !== 'basic-approval-preservation' || request.basicPreservation.schemaVersion !== BASIC_PRESERVATION_SCHEMA)
      fail('BASIC_PRESERVATION_SCOPE');
    for (const binding of request.basicPreservation.bindings) {
      if (owners.has(binding.questionUid)) fail('BASIC_DEPENDENCY_AMBIGUOUS');
      owners.set(binding.questionUid, { request, binding });
    }
  }
  const bound = new Set();
  for (const request of requests.filter(r => r.kind === 'difficulty5-ratings')) {
    for (const selected of request.selectedItems || []) if (owners.has(selected.questionUid) &&
      (request.difficultyBeforeBindings || []).filter(b => b.questionUid === selected.questionUid && b.sourceOrdinal === selected.sourceOrdinal).length !== 1)
      fail('BASIC_DEPENDENCY_FINGERPRINT');
    for (const binding of request.difficultyBeforeBindings || []) {
      const owner = owners.get(binding.questionUid);
      if (!owner) continue;
      if (bound.has(binding.questionUid)) fail('BASIC_DEPENDENCY_AMBIGUOUS');
      bound.add(binding.questionUid);
      if (!eq(binding, owner.binding)) fail('BASIC_DEPENDENCY_FINGERPRINT');
      if (!request.source || !owner.request.source || ['path','blobSha1','sha256'].some(k => request.source[k] !== owner.request.source[k])) fail('BASIC_DEPENDENCY_SOURCE');
      if (!dependencies.has(request.path)) dependencies.set(request.path, new Set());
      dependencies.get(request.path).add(owner.request.path);
    }
  }
  const registryDependencies = nativeRegistryDependencies(requests);
  for (const [consumer, providers] of registryDependencies) {
    if (!dependencies.has(consumer)) dependencies.set(consumer, new Set());
    for (const provider of providers) dependencies.get(consumer).add(provider);
  }
  const remaining = [...requests], ordered = [], completed = new Set();
  while (remaining.length) {
    const index = remaining.findIndex(request => !dependencies.has(request.path)
      || [...dependencies.get(request.path)].every(dependency => completed.has(dependency)));
    if (index < 0) fail(registryDependencies.size ? 'REGISTRY_DEPENDENCY_CYCLE' : 'AUDIT_DEPENDENCY_CYCLE');
    const [request] = remaining.splice(index, 1);
    ordered.push(request); completed.add(request.path);
  }
  return ordered;
}

const emptyObject = value => value && typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length;
function explicitSubsetReferences(request) {
  const rebind = request.approval?.sourceRebind, ref = rebind?.subsetEvidenceRef;
  const sameRef = (a, b) => a && b && eq(Object.keys(a).sort(), ['path', 'sha256'])
    && a.path === b.path && a.sha256 === b.sha256;
  return rebind?.schemaVersion === SOURCE_SUBSET_SCHEMA
    && eq(Object.keys(rebind).sort(), ['priorReceiptRef', 'schemaVersion', 'subsetEvidenceRef'])
    && /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(request.requestId || '')
    && ref && eq(Object.keys(ref).sort(), ['path', 'sha256'])
    && ref.path === sourceSubsetEvidencePath(request.requestId) && /^[a-f0-9]{64}$/.test(ref.sha256 || '')
    && Array.isArray(request.approval.evidenceRefs) && request.approval.evidenceRefs.some(item => sameRef(item, ref))
    && request.approval.evidenceRefs.some(item => sameRef(item, rebind.priorReceiptRef))
    && Array.isArray(request.items) && request.items.every(item => Array.isArray(item.evidenceRefs) && item.evidenceRefs.some(entry => sameRef(entry, ref)));
}
function partialFinalQaPreservation(request) {
  const approval = request?.approval, rebind = approval?.sourceRebind;
  return request?.schemaVersion === NATIVE_REQUEST_SCHEMA && request.scope === 'PARTIAL_UIDS'
    && request.registrationMode === undefined && (request.registryChanges === undefined ||
      Array.isArray(request.registryChanges) && request.registryChanges.length === 0)
    && approval?.type === 'FINAL_QA' && approval.metadataReviewed === true
    && typeof approval.approvedBy === 'string' && Boolean(approval.approvedBy.trim())
    && rebind && !Array.isArray(rebind) && (eq(Object.keys(rebind), ['priorReceiptRef']) || explicitSubsetReferences(request))
    && typeof rebind.priorReceiptRef?.path === 'string' && /^[a-f0-9]{64}$/.test(rebind.priorReceiptRef?.sha256 || '')
    && Array.isArray(request.items) && request.items.length > 0
    && request.items.every(item => emptyObject(item.before) && emptyObject(item.after)
      && item.rebind === undefined && item.sourceReview === undefined);
}

// A code-only PR may inherit source changes whose registration writer is still
// pending. Only an exact no-new-approval partial FINAL_QA rebind may supply that
// existing receipt in the temporary projection. Ordinary other-owner requests,
// D5/audit/basic approvals and any semantic patch keep the changed-input boundary.
export function selectNativeRequests({ root, baseSha, headSha }) {
  const fields = git(root, 'diff', '--name-status', '--diff-filter=AM', '--no-renames', '-z', baseSha, headSha, '--', INBOX).split('\0').filter(Boolean);
  if (fields.length % 2) fail('DIFF_INVALID');
  const files = [];
  for (let i = 0; i < fields.length; i += 2) {
    const file = fields[i + 1];
    if (['A', 'M'].includes(fields[i]) && flatInboxPath(file)) files.push(file);
  }
  const changed = new Set(files), basePaths = new Set(pendingNativeRequestPaths({ root, headSha: baseSha }));
  const inherited = new Map();
  for (const file of pendingNativeRequestPaths({ root, headSha })) {
    if (changed.has(file) || !basePaths.has(file)) continue;
    // Read the fixed Git input for dispatch. A forged working copy cannot turn
    // an ordinary inherited request into an eligible preservation request.
    const raw = gitBytes(root, `${headSha}:${file}`);
    let request; try { request = JSON.parse(raw); } catch { continue; }
    if (!partialFinalQaPreservation(request)) continue;
    if (!raw.equals(gitBytes(root, `${baseSha}:${file}`))) fail(`INHERITED_REQUEST_CHANGED:${file}`);
    inherited.set(file, { baseSha, requestSha256: sha(raw) });
    files.push(file);
  }
  return selectFixedNativeRequests({ root, files, headSha, rejectUnsupported: false, inherited });
}

const flatInboxPath = file => file.startsWith(INBOX) && !file.slice(INBOX.length).includes('/') && file.endsWith('.json');

// A main push can follow a source merge while the single registration writer is
// still running. Its unchanged pending requests belong to this fixed main
// snapshot. Never discover them from the mutable worktree or origin/main.
export function pendingNativeRequestPaths({ root, headSha }) {
  if (!/^[a-f0-9]{40}$/i.test(headSha || '')) fail('PENDING_SNAPSHOT_SHA');
  return git(root, 'ls-tree', '-r', '--name-only', '-z', headSha, '--', INBOX)
    .split('\0').filter(file => file && flatInboxPath(file)).sort();
}

export function selectPendingNativeRequests({ root, headSha }) {
  return selectFixedNativeRequests({ root, headSha, files: pendingNativeRequestPaths({ root, headSha }), rejectUnsupported: true });
}

function selectFixedNativeRequests({ root, files, headSha, rejectUnsupported, inherited = new Map() }) {
  const requests = [];
  for (const file of files) {
    safe(root, file);
    const raw = fs.readFileSync(path.join(root, file));
    if (sha(raw) !== sha(gitBytes(root, `${headSha}:${file}`))) fail(`REQUEST_NOT_FIXED:${file}`);
    let request; try { request = JSON.parse(raw); } catch { fail(`REQUEST_JSON:${file}`); }
    if (request.schemaVersion === DIFFICULTY_REQUEST_SCHEMA && request.reviewedCorrection !== undefined) {
      requests.push(selectReviewedDifficulty(root, file, request, headSha));
      continue;
    }
    const correction = request.schemaVersion === PARENT_CORRECTION_SCHEMA;
    const basicPreservation = basicPreservationDescriptor(request);
    if (!correction && !basicPreservation && request.schemaVersion !== NATIVE_REQUEST_SCHEMA) {
      // An unhandled main inbox must not be reported as a coherent projection.
      // PRs retain their existing ownership boundary for unrelated schemas.
      if (rejectUnsupported) fail(`PENDING_SCHEMA_UNSUPPORTED:${file}`);
      continue;
    }
    const sourceRebind = auditPreservationDependency(request, file);
    const registryDependency = nativeRegistryDependencyDescriptor(request);
    const preservation = request.approval?.sourceRebind !== undefined;
    if (preservation && (correction || request.registrationMode !== undefined ||
        !request.approval.sourceRebind || typeof request.approval.sourceRebind !== 'object' || Array.isArray(request.approval.sourceRebind) ||
        !(sourceRebind || request.approval.type === 'FINAL_QA' && (request.approval.sourceRebind.schemaVersion === undefined ||
          request.approval.sourceRebind.schemaVersion === SOURCE_SUBSET_SCHEMA && partialFinalQaPreservation(request))))) fail('PRESERVATION_SCOPE');
    const partial = !correction && request.scope === 'PARTIAL_UIDS';
    if (!correction && request.scope !== undefined && !partial) fail('REQUEST_SCOPE');
    if (request.registrationMode !== undefined && (correction || !partial || request.registrationMode !== 'IDENTITY_FINGERPRINT_ONLY')) fail('REGISTRATION_MODE');
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(request.requestId || '')) fail('REQUEST_ID');
    if (!Number.isSafeInteger(request.expectedQuestionCount) || request.expectedQuestionCount < 1) fail('QUESTION_COUNT');
    if (!Array.isArray(request.items) || !request.items.length || request.items.length > request.expectedQuestionCount
        || !correction && !basicPreservation && !partial && request.items.length !== request.expectedQuestionCount) fail('QUESTION_COUNT');
    const selectedItems = request.items.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal }));
    if (selectedItems.some(item => typeof item.questionUid !== 'string' || !item.questionUid.trim()
        || !Number.isSafeInteger(item.sourceOrdinal) || item.sourceOrdinal < 1 || item.sourceOrdinal > request.expectedQuestionCount)
        || new Set(selectedItems.map(i => i.questionUid)).size !== selectedItems.length
        || new Set(selectedItems.map(i => i.sourceOrdinal)).size !== selectedItems.length) fail('SELECTED_UID_SCOPE');
    selectedItems.sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
    const refs = new Map();
    for (const list of [request.approval?.evidenceRefs, ...(request.items || []).map(i => i.evidenceRefs),
      ...(request.registryChanges || []).map(i => i.evidenceRefs),
      ...(correction ? [[request.difficultyEvidence]] : [])]) {
      if (!Array.isArray(list) || !list.length) fail('EVIDENCE_REQUIRED');
      for (const item of list) {
        if (!/^[a-f0-9]{64}$/.test(item.sha256 || '')) fail('EVIDENCE_SHA');
        const ref = fileRef(root, item.path);
        if (ref.sha256 !== item.sha256 || refs.has(ref.path) && !eq(refs.get(ref.path), ref)) fail(`EVIDENCE_DRIFT:${ref.path}`);
        if (sha(gitBytes(root, `${headSha}:${ref.path}`)) !== ref.sha256) fail(`EVIDENCE_NOT_FIXED:${ref.path}`);
        refs.set(ref.path, ref);
      }
    }
    const sourcePath = `archive/exams/${request.sourceArchiveFile}`;
    const source = fileRef(root, sourcePath), blobSha1 = git(root, 'rev-parse', `${headSha}:${sourcePath}`).trim();
    if (blobSha1 !== request.expectedSourceBlobSha1 || sha(gitBytes(root, `${headSha}:${sourcePath}`)) !== source.sha256) fail('SOURCE_NOT_FIXED');
    let bank;
    try {
      const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
      vm.runInNewContext(fs.readFileSync(safe(root, sourcePath), 'utf8'), ctx, { timeout: 5000 });
      bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
    } catch { fail('SOURCE_BANK_INVALID'); }
    if (!Array.isArray(bank) || bank.length !== request.expectedQuestionCount) fail('SOURCE_DENOMINATOR');
    requests.push({ ...fileRef(root, file), requestId: request.requestId, questionCount: selectedItems.length,
      sourceQuestionCount: request.expectedQuestionCount, selectedItems,
      ...(inherited.has(file) ? { inheritedPreservation: inherited.get(file) } : {}),
      ...(partial ? { scope: request.scope } : {}),
      ...(request.registrationMode ? { registrationMode: request.registrationMode } : {}),
      ...(sourceRebind ? { sourceRebind } : {}),
      ...(registryDependency ? { registryDependency } : {}),
      ...(basicPreservation ? { basicPreservation, kind: 'basic-approval-preservation' }
        : correction ? { kind: 'basic-parent-correction' } : request.registrationMode === 'IDENTITY_FINGERPRINT_ONLY' ? { kind: 'identity-fingerprint-repair' }
        : preservation ? { kind: 'native-approval-preservation', preservedApprovalType: request.approval.type } : {}), source: { ...source, blobSha1 },
      evidence: [...refs.values()].sort((a, b) => a.path.localeCompare(b.path, 'en')),
      receiptPath: `${RECEIPTS}${request.requestId}.json` });
  }
  if (new Set(requests.map(r => r.requestId)).size !== requests.length) fail('DUPLICATE_REQUEST_ID');
  return orderNativeRequests(requests.sort((a, b) => a.path.localeCompare(b.path, 'en')));
}

function difficultyResult(result, request, flags) {
  const summary = result.summary, verify = flags.includes('--verify-projection'), write = flags.includes('--write');
  const countKeys = ['APPLY', 'ALREADY_REGISTERED', 'SKIP_INVALID', 'CONFLICT', 'VERIFIED'];
  if (result.status !== 'PASS' || result.requestId !== request.requestId
      || `archive/exams/${result.sourceArchiveFile}` !== request.source.path || result.sourceBlobSha !== request.source.blobSha1
      || result.ptTpl !== 'UNTOUCHED_NOT_IN_SCOPE' || !summary || summary.total !== request.questionCount
      || countKeys.some(k => !Number.isSafeInteger(summary[k]) || summary[k] < 0)
      || countKeys.reduce((n, k) => n + summary[k], 0) !== request.questionCount
      || summary.SKIP_INVALID || summary.CONFLICT
      || !Number.isSafeInteger(summary.changedFields) || summary.changedFields < 0 || summary.changedFields > 4 * request.questionCount
      || typeof summary.written !== 'boolean' || summary.written !== Boolean(write && summary.changedFields)
      || result.mode !== (verify ? 'verify-reviewed-correction' : write ? 'write-reviewed-correction' : 'dry-run-reviewed-correction')
      || verify && (summary.VERIFIED !== request.questionCount || summary.changedFields !== 0)
      || !verify && summary.VERIFIED !== 0
      || !Array.isArray(result.items) || result.items.length !== request.questionCount) fail('DIFFICULTY_RESULT_NOT_PASS');
  const items = result.items.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.ordinal }))
    .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  if (!eq(items, request.selectedItems)) fail('DIFFICULTY_RESULT_UID_SCOPE');
  const replay = verify || summary.ALREADY_REGISTERED === request.questionCount;
  if (!verify && (replay ? summary.changedFields !== 0 : summary.changedFields === 0)) fail('DIFFICULTY_RESULT_NOT_PASS');
  return { ...result, totalQuestions: summary.total, replay,
    plannedPaths: summary.changedFields ? [METADATA] : [],
    consumerSearchStatus: verify ? 'STATIC_DIFFICULTY_VALUES_VERIFIED' : 'NOT_RUN' };
}

function registrar(root, request, run, flags = [], scriptRoot = root) {
  const difficulty = request.kind === 'difficulty5-ratings';
  const result = parsed(run(process.execPath, [path.join(scriptRoot, difficulty ? DIFFICULTY_REGISTRAR : REGISTRAR),
    '--repo-root', root, '--request', request.path, ...flags], root));
  return difficulty ? difficultyResult(result, request, flags) : result;
}
function resultScopeMatches(result, request) {
  if (result.status !== 'PASS' || result.requestId !== request.requestId || result.totalQuestions !== request.questionCount
      || result.registrationMode !== request.registrationMode) return false;
  if (request.scope === 'PARTIAL_UIDS') {
    if (result.scope !== request.scope || result.partialUidCount !== request.questionCount
        || result.expectedQuestionCount !== request.sourceQuestionCount) return false;
  } else if (result.scope !== undefined || result.partialUidCount !== undefined) return false;
  if (request.kind === 'native-approval-preservation' &&
      (result.newMetadataApprovals !== 0 || result.preservedMetadataApprovals !== request.questionCount)) return false;
  if (request.kind === 'basic-approval-preservation' &&
      (result.newMetadataApprovals !== 0 || result.advancedApprovals !== 0 || result.metadataValuesChanged !== false ||
        result.preservedMetadataApprovals !== request.questionCount || result.expectedQuestionCount !== request.sourceQuestionCount)) return false;
  return request.registrationMode !== 'IDENTITY_FINGERPRINT_ONLY'
    || result.metadataChanged === false && result.newMetadataApprovals === 0;
}
function planPaths(result, request) {
  if (!resultScopeMatches(result, request) || !Array.isArray(result.plannedPaths)
      || typeof result.replay !== 'boolean' || result.plannedPaths.some(file => typeof file !== 'string')) fail('DRY_RUN_NOT_PASS');
  const paths = sorted(result.plannedPaths);
  if (paths.length !== result.plannedPaths.length || paths.some(file => !file.startsWith('archive/data/'))) fail('OUTPUT_SCOPE');
  for (const file of paths) safe('/', file);
  if (request.kind === 'difficulty5-ratings') {
    if (!eq(paths, result.replay ? [] : [METADATA])) fail('DIFFICULTY_OUTPUT_SCOPE');
  } else if (request.kind === 'basic-approval-preservation') {
    if (!eq(paths, result.replay ? [] : sorted([METADATA, 'archive/data/question_identity_map.json',
      'archive/data/basic-scope-source-links.json', request.receiptPath]))) fail('BASIC_PRESERVATION_OUTPUT_SCOPE');
  } else if (!result.replay && !paths.includes(request.receiptPath)) fail('RECEIPT_NOT_PLANNED');
  if (result.replay && paths.length) fail('REPLAY_WRITES');
  return paths;
}

export function applyNativeRequests({ root, requests, run = nativeCommand, scriptRoot = root, guard = true }) {
  const plans = [];
  for (const request of orderNativeRequests(requests)) {
    const before = guard ? dirtySnapshot(root) : null;
    const dryRun = registrar(root, request, run, [], scriptRoot), paths = planPaths(dryRun, request);
    if (guard) noUnexpectedMutation(root, before, new Set());
    const applied = registrar(root, request, run, ['--write'], scriptRoot);
    if (!resultScopeMatches(applied, request) || applied.replay !== dryRun.replay
        || !eq(sorted(applied.plannedPaths || []), paths)) fail('WRITE_PLAN_MISMATCH');
    if (guard) noUnexpectedMutation(root, before, new Set(paths));
    plans.push({ requestPath: request.path, replay: dryRun.replay, plannedPaths: paths });
  }
  return plans;
}

function difficultyAssignmentInformation(requests, result) {
  const difficulty = requests.filter(r => r.kind === 'difficulty5-ratings');
  const bound = [], seen = new Set(), counts = new Map();
  for (const row of result.assignmentPending) {
    if (row?.reason !== 'assignment_missing' || typeof row.exam !== 'string'
        || !Number.isSafeInteger(row.qid) || typeof row.uid !== 'string') fail('CONSUMER_NOT_PASS');
    const exams = result.exams.filter(e => e.exam === row.exam);
    if (exams.length !== 1 || exams[0].kind !== 'difficulty5-ratings') fail('CONSUMER_NOT_PASS');
    const request = difficulty.find(r => r.path === exams[0].file && r.requestId === row.exam);
    const owners = requests.filter(r => r.selectedItems.some(i => i.questionUid === row.uid));
    if (!request || owners.length !== 1 || owners[0] !== request
        || !request.selectedItems.some(i => i.questionUid === row.uid && i.sourceOrdinal === row.qid)) fail('CONSUMER_NOT_PASS');
    const key = `${request.path}\0${row.uid}`;
    if (seen.has(key)) fail('CONSUMER_NOT_PASS');
    seen.add(key); counts.set(request.path, (counts.get(request.path) || 0) + 1);
    bound.push({ requestPath: request.path, questionUid: row.uid, sourceOrdinal: row.qid, reason: row.reason });
  }
  if (!difficulty.length) return null;
  bound.sort((a, b) => a.requestPath.localeCompare(b.requestPath, 'en') || a.sourceOrdinal - b.sourceOrdinal);
  // The official Consumer treats a missing advanced assignment as informational
  // for difficulty-only rows. Preserve that debt, tied to one exact request;
  // it cannot stand in for a native/identity approval or hide mixed-UID scope.
  return { requestCount: difficulty.length, selectedQuestions: difficulty.reduce((n, r) => n + r.questionCount, 0),
    newAdvancedMetadataApprovals: 0, informationalAssignmentPendingCount: bound.length,
    informationalAssignmentPendingSha256: sha(JSON.stringify(bound)),
    informationalAssignmentPendingByRequest: [...counts].sort(([a], [b]) => a.localeCompare(b, 'en'))
      .map(([requestPath, questionCount]) => ({ requestPath, questionCount })) };
}

export function verifyNativeRequests({ root, requests, run = nativeCommand }) {
  if (!requests.length) return [];
  requests = orderNativeRequests(requests);
  const before = dirtySnapshot(root);
  for (const request of requests) {
    const result = registrar(root, request, run, ['--verify-projection']);
    const identityOnly = request.registrationMode === 'IDENTITY_FINGERPRINT_ONLY';
    if (!resultScopeMatches(result, request) || result.replay !== true
        || result.consumerSearchStatus !== (identityOnly ? 'IDENTITY_BINDINGS_VERIFIED'
          : request.kind === 'difficulty5-ratings' ? 'STATIC_DIFFICULTY_VALUES_VERIFIED' : 'STATIC_VALUES_VERIFIED')
        || identityOnly && (result.consumerLanes?.identityBindings !== request.questionCount
          || result.consumerLanes?.newMetadataApprovals !== 0)) fail('PROJECTION_NOT_VERIFIED');
  }
  const result = parsed(run(process.execPath, [CONSUMER, ...requests.flatMap(r => ['--request', r.path]), '--root', root], root));
  const count = requests.reduce((sum, r) => sum + r.questionCount, 0);
  const complete = (counts, total) => counts && ['changed', 'checked', 'passed', 'skippedUnchanged']
    .every(k => Number.isSafeInteger(counts[k]) && counts[k] >= 0)
    && counts.changed + counts.skippedUnchanged === total && counts.checked === counts.changed && counts.passed === counts.changed;
  // The official Consumer checks changed rows and counts legitimate KEEP rows
  // as skipped. The preceding projection check still verifies every selected row;
  // the fixed source bank independently retains its original full denominator.
  if (result.status !== 'PASS' || !complete(result.counts, count)
      || !Array.isArray(result.exams) || result.exams.length !== requests.length
      || requests.some(r => {
        const exams = result.exams.filter(e => e.file === r.path);
        return exams.length !== 1 || exams[0].kind !== (r.kind || 'reviewed-exam-v2')
          || r.registrationMode === 'IDENTITY_FINGERPRINT_ONLY' && (exams[0].newMetadataApprovals !== 0
            || exams[0].approvalCreated !== false || exams[0].identityBindings !== r.questionCount)
          || r.kind === 'native-approval-preservation' && (exams[0].newMetadataApprovals !== 0 || exams[0].approvalCreated !== false
            || exams[0].preservedMetadataApprovals !== r.questionCount || exams[0].approvalType !== r.preservedApprovalType
            || exams[0].expectedQuestionCount !== r.sourceQuestionCount || exams[0].skippedUnchanged !== 0 || exams[0].changed !== r.questionCount)
          || r.kind === 'basic-approval-preservation' && (exams[0].newMetadataApprovals !== 0 || exams[0].approvalCreated !== false
            || exams[0].advancedApprovals !== 0 || exams[0].preservedMetadataApprovals !== r.questionCount
            || exams[0].expectedQuestionCount !== r.sourceQuestionCount || exams[0].skippedUnchanged !== 0 || exams[0].changed !== r.questionCount)
          || `archive/exams/${exams[0].sourceFile}` !== r.source.path || !complete(exams[0], r.questionCount);
      })
      || ['changed', 'checked', 'passed', 'skippedUnchanged'].some(k => result.exams.reduce((sum, e) => sum + e[k], 0) !== result.counts[k])
      || ['failures', 'unobservedFields'].some(k => !Array.isArray(result[k]) || result[k].length)
      || !Array.isArray(result.assignmentPending)) fail('CONSUMER_NOT_PASS');
  const difficultyOnly = difficultyAssignmentInformation(requests, result);
  const preservation = requests.filter(r => r.kind === 'native-approval-preservation');
  const preservedNativeApprovals = preservation.length ? { requests: preservation.length,
    preservedMetadataApprovals: preservation.reduce((sum, r) => sum + r.questionCount, 0), newMetadataApprovals: 0,
    approvalTypes: sorted(preservation.map(r => r.preservedApprovalType)) } : null;
  const basic = requests.filter(r => r.kind === 'basic-approval-preservation');
  const preservedBasicApprovals = basic.length ? { requests: basic.length,
    preservedMetadataApprovals: basic.reduce((sum, r) => sum + r.questionCount, 0), newMetadataApprovals: 0, advancedApprovals: 0 } : null;
  noUnexpectedMutation(root, before, new Set());
  return [{ id: 'native-projection', outcome: 'success' },
    { id: 'native-consumer', outcome: 'success', ...(difficultyOnly ? { difficultyOnly } : {}),
      ...(preservedNativeApprovals ? { preservedNativeApprovals } : {}), ...(preservedBasicApprovals ? { preservedBasicApprovals } : {}) }];
}

export function nativeOutputManifest(root, plans) {
  return sorted(plans.flatMap(p => p.plannedPaths)).map(file => fileRef(root, file));
}

// Re-derive the *initial* official plan from the immutable Git input. A replay
// on the post-state returns plannedPaths:[] and cannot authenticate a new
// allowlist. This shadow has independent bytes; verify-local never writes its
// actual checkout, consumes inbox files or runs another catalog build.
export function rederiveNativePlans({ root, requests, run = nativeCommand }) {
  if (!requests.length) return { plans: [], outputs: [] };
  const shadow = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pr-native-plan-'));
  try {
    nativeCommand('git', ['clone', '--quiet', '--shared', '--no-checkout', '--local', root, shadow], root);
    const restore = ['archive/data', 'docs/rules/01_CANONICAL/taxonomy'].filter(file => git(root, 'ls-tree', 'HEAD', '--', file).trim());
    const tar = spawnSync('git', ['archive', '--format=tar', 'HEAD', '--', ...restore], { cwd: root, maxBuffer: 1024 * 1024 * 1024 });
    if (tar.error || tar.status !== 0) fail('SHADOW_GIT_SNAPSHOT_FAILED');
    const extracted = spawnSync('tar', ['-xf', '-', '-C', shadow], { input: tar.stdout, maxBuffer: 1024 * 1024 });
    if (extracted.error || extracted.status !== 0) fail('SHADOW_EXTRACT_FAILED');
    const inputs = sorted(requests.flatMap(r => [r.path, r.source.path, ...r.evidence.map(e => e.path)]));
    const attrs = git(root, 'ls-tree', '-r', '--name-only', 'HEAD').split('\n').filter(p => path.posix.basename(p) === '.gitattributes');
    for (const file of sorted([...inputs, ...attrs])) {
      const full = safe(shadow, file);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, gitBytes(root, `HEAD:${file}`));
    }
    const plans = applyNativeRequests({ root: shadow, requests, run, scriptRoot: root, guard: false });
    return { plans, outputs: nativeOutputManifest(shadow, plans) };
  } finally { fs.rmSync(shadow, { recursive: true, force: true }); }
}

export function emptyNativePreview() {
  return { schemaVersion: NATIVE_PREVIEW_SCHEMA, requests: [], plans: [], outputs: [], checks: [] };
}

export function validateNativePreview({ root, baseSha, headSha, preview, run = nativeCommand, allowedGenerated = [] }) {
  const requests = selectNativeRequests({ root, baseSha, headSha });
  if (!preview || !eq(Object.keys(preview).sort(), ['schemaVersion', 'requests', 'plans', 'outputs', 'checks'].sort())
      || preview.schemaVersion !== NATIVE_PREVIEW_SCHEMA || !eq(preview.requests, requests)) fail('INPUT_MANIFEST_MISMATCH');
  if (!requests.length) {
    if (!eq(preview, emptyNativePreview())) fail('UNEXPECTED_NATIVE_PROOF');
    return [];
  }
  const before = dirtySnapshot(root);
  const expected = rederiveNativePlans({ root, requests, run });
  if (!eq(preview.plans, expected.plans)) fail('PLAN_MANIFEST_MISMATCH');
  const actual = nativeOutputManifest(root, expected.plans);
  if (!eq(actual, preview.outputs)) fail('OUTPUT_MANIFEST_MISMATCH');
  // The ordinary builder may refresh generated counts. Newly allowed native
  // authority/receipt files must still equal the official writer's exact bytes.
  for (const ref of expected.outputs) {
    if (!allowedGenerated.some(re => re.test(ref.path)) && !eq(fileRef(root, ref.path), ref)) fail(`NATIVE_AUTHORITY_OUTPUT_DRIFT:${ref.path}`);
  }
  if (!eq(verifyNativeRequests({ root, requests, run }), preview.checks)) fail('CHECKS_INCOMPLETE');
  noUnexpectedMutation(root, before, new Set());
  return sorted(expected.plans.flatMap(p => p.plannedPaths));
}
