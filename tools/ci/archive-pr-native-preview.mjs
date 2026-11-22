// Apply source-bound v2 and official difficulty5 requests in a disposable CI checkout.
// PRs select changed requests, their exact pending ACTIVE binding providers,
// and proven existing FINAL_QA source continuities.
// Pushes select the exact pending HEAD inbox.
// The main writer, inbox consumption and approval policy remain unchanged.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

export const NATIVE_PREVIEW_SCHEMA = 'archive-pr-native-preview/v1';
export const NATIVE_REQUEST_SCHEMA = 'archive-reviewed-exam-meta-register-request-v2';
export const DIFFICULTY_REQUEST_SCHEMA = 'archive-difficulty5-register-request-v1';
const DIFFICULTY_CORRECTION_SCHEMA = 'archive-difficulty5-reviewed-correction-v1';
export const AUDIT_PRESERVATION_SCHEMA = 'archive-native-audit-preservation-v1';
export const AUDIT_SOURCE_PRESERVATION_SCHEMA = 'archive-native-audit-source-preservation-v1';
export const BASIC_PRESERVATION_SCHEMA = 'archive-basic-scope-current-source-preservation-v1';
export const NATIVE_BASIC_HOLD_SCHEMA = 'archive-basic-native-source-hold-preservation-v1';
export const NATIVE_BASIC_PARENT_SCHEMA = 'archive-reviewed-native-basic-parent-v1';
const BASIC_REBIND_SCHEMA = 'archive-basic-scope-rebind-request-v1';
const PARENT_CORRECTION_SCHEMA = 'archive-basic-parent-correction-request-v1';
export const APPROVED_RENDERER_PRESERVATION_SCHEMA = 'archive-native-approved-renderer-preservation-v1';
export const NATIVE_PREVIEW_HELPER = 'tools/ci/archive-pr-native-preview.mjs';
const INBOX = '.archive-meta-register/inbox/';
const REGISTRAR = 'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs';
const DIFFICULTY_REGISTRAR = 'archive/tools/meta-foundation/register-difficulty5.mjs';
import { questionMetadataBytesAt, hasShards, assembleMetadataFile } from '../../archive/tools/meta-foundation/question-metadata-format.mjs';
const METADATA = 'archive/data/question_metadata.json';
const CONSUMER = 'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = reason => { throw Error(`PR_NATIVE_PREVIEW:${reason}`); };
const sorted = values => [...new Set(values)].sort();

import { AUTHORITY_CORRECTION_MODE, isNativeAuthorityCorrection, authorityHoldSealPath } from '../../archive/tools/meta-foundation/native-authority-correction.mjs';
import { bindDifficulty5Source, isTextBoundDraft } from '../../archive/tools/meta-foundation/register-difficulty5.mjs';
import { TEXT_BOUND_REVIEW_TYPES, reviewedSourceTextUnchanged } from '../../archive/tools/meta-foundation/text-binding-lib.mjs';
import { isPartialSubsetPreservation, validatePartialSubsetPreservation } from '../../archive/tools/meta-foundation/native-partial-subset-preservation.mjs';
import { DECISION_DOCUMENT as TYPE_JUDGMENT_DECISION_DOCUMENT } from '../../archive/tools/meta-foundation/register-type-judgment.mjs';

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
// Git holds the question metadata as per-exam shards; the native plans declare the one logical file they assemble to.
// A changed shard therefore counts as a change of METADATA (whose recorded hash is the assembled file's).
const METADATA_SHARDS = 'archive/data/question-metadata/v1/';
const dirty = root => sorted([
  ...git(root, 'diff', '--name-only', '-z', 'HEAD', '--').split('\0'),
  ...git(root, 'ls-files', '--others', '--exclude-standard', '-z').split('\0'),
].filter(Boolean).map(file => file.startsWith(METADATA_SHARDS) ? METADATA : file));
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

function selectDifficulty(root, file, request, headSha) {
  const payload = request.gemini, correction = request.reviewedCorrection;
  const ordinary = !Object.hasOwn(request, 'reviewedCorrection');
  if (payload?.schemaVersion !== 'v1' || !ordinary && (correction?.schemaVersion !== DIFFICULTY_CORRECTION_SCHEMA
      || typeof correction.approvalRef !== 'string' || !correction.approvalRef.trim())) fail('DIFFICULTY_APPROVAL');
  // Ordinary requests use the existing registrar's payload ID, including Korean.
  // It identifies ratings only; it never becomes a native approval receipt path.
  if (ordinary ? typeof payload.requestId !== 'string' || !payload.requestId.trim() || /[\x00-\x1f\x7f]/.test(payload.requestId)
      : !/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(payload.requestId || '')) fail('REQUEST_ID');
  if (!Array.isArray(payload.items) || !payload.items.length) fail('QUESTION_COUNT');
  const selectedItems = payload.items.map(item => ({ questionUid: item?.questionUid, sourceOrdinal: item?.ordinal }));
  if (selectedItems.some(item => typeof item.questionUid !== 'string' || !item.questionUid.trim()
      || !Number.isSafeInteger(item.sourceOrdinal) || item.sourceOrdinal < 1)
      || new Set(selectedItems.map(i => i.questionUid)).size !== selectedItems.length
      || new Set(selectedItems.map(i => i.sourceOrdinal)).size !== selectedItems.length) fail('SELECTED_UID_SCOPE');
  selectedItems.sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  const evidence = [];
  if (!ordinary) {
    if (!String(correction.evidencePath || '').startsWith('.archive-meta-register/evidence/')
        || !/^[a-f0-9]{64}$/.test(correction.evidenceSha256 || '')) fail('EVIDENCE_REQUIRED');
    const ref = fileRef(root, correction.evidencePath);
    if (ref.sha256 !== correction.evidenceSha256) fail(`EVIDENCE_DRIFT:${ref.path}`);
    if (sha(gitBytes(root, `${headSha}:${ref.path}`)) !== ref.sha256) fail(`EVIDENCE_NOT_FIXED:${ref.path}`);
    evidence.push(ref);
  }
  const sourcePath = `archive/exams/${payload.sourceArchiveFile}`, source = fileRef(root, sourcePath);
  const blobSha1 = git(root, 'rev-parse', `${headSha}:${sourcePath}`).trim();
  // The raw worktree must still equal the fixed Git snapshot. Ordinary D5 also
  // permits only the registrar's existing CRLF-to-LF source binding convention.
  const difficultySourceBlobSha1 = ordinary
    ? bindDifficulty5Source(fs.readFileSync(safe(root, sourcePath)), payload.latestBlobSha).sha : blobSha1;
  if ((difficultySourceBlobSha1 !== payload.latestBlobSha && !(ordinary && isTextBoundDraft(request))) || sha(gitBytes(root, `${headSha}:${sourcePath}`)) !== source.sha256) fail('SOURCE_NOT_FIXED');
  let bank;
  try {
    const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.runInNewContext(fs.readFileSync(safe(root, sourcePath), 'utf8'), ctx, { timeout: 5000 });
    bank = ctx.window.questionBank || ctx.window.questions || ctx.window.examData?.questions;
  } catch { fail('SOURCE_BANK_INVALID'); }
  if (!Array.isArray(bank) || !bank.length || selectedItems.some(i => i.sourceOrdinal > bank.length)) fail('SOURCE_DENOMINATOR');
  return { ...fileRef(root, file), requestId: payload.requestId, kind: 'difficulty5-ratings',
    ...(ordinary ? { difficultyRegistrationMode: 'ordinary-ratings', difficultySourceBlobSha1 } : {}),
    questionCount: selectedItems.length, sourceQuestionCount: bank.length, selectedItems,
    difficultyBeforeBindings: difficultyBeforeBindings(request),
    source: { ...source, blobSha1 }, evidence };
}

export function difficultyBeforeBindings(request) {
  return request.schemaVersion === DIFFICULTY_REQUEST_SCHEMA && Array.isArray(request.reviewedCorrection?.rows)
    ? request.reviewedCorrection.rows.map(row => ({ questionUid: row.questionUid, sourceOrdinal: row.ordinal,
      sourceFingerprint: row.before?.sourceFingerprint, contentFingerprint: row.before?.contentFingerprint })) : [];
}
export function basicPreservationDescriptor(request) {
  if (request.schemaVersion !== BASIC_REBIND_SCHEMA || request.approval?.sourceReview === undefined) return undefined;
  const schemaVersion = request.approval.sourceReview?.schemaVersion;
  if (![BASIC_PRESERVATION_SCHEMA, NATIVE_BASIC_HOLD_SCHEMA, NATIVE_BASIC_PARENT_SCHEMA].includes(schemaVersion) || request.approval.type !== 'BASIC_SCOPE_REBIND'
      || request.scope !== undefined || request.registrationMode !== undefined || !Array.isArray(request.items) || !request.items.length)
    fail('BASIC_PRESERVATION_SCOPE');
  const bindings = request.items.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    sourceFingerprint: item.after?.sourceFingerprint, contentFingerprint: item.after?.contentFingerprint }));
  if (bindings.some(row => typeof row.questionUid !== 'string' || !row.questionUid || !Number.isSafeInteger(row.sourceOrdinal) || row.sourceOrdinal < 1
      || !/^[a-f0-9]{64}$/.test(row.sourceFingerprint || '') || !/^[a-f0-9]{64}$/.test(row.contentFingerprint || ''))
      || new Set(bindings.map(r => r.questionUid)).size !== bindings.length) fail('BASIC_PRESERVATION_BINDINGS');
  return { schemaVersion, bindings, ...(schemaVersion === NATIVE_BASIC_PARENT_SCHEMA ? { newBasicParent: true } : {}) };
}

// This descriptor selects a preservation lane; the official registrar still
// replays the entire immutable FULL ancestor and authenticates every renderer.
export function approvedRendererPreservationDescriptor(request) {
  const spec=request.approval?.rendererPreservation;
  if(spec===undefined)return undefined;
  const empty=value=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===0;
  const items=request.items;
  if(request.schemaVersion!==NATIVE_REQUEST_SCHEMA||spec?.schemaVersion!==APPROVED_RENDERER_PRESERVATION_SCHEMA||
    request.scope!=='PARTIAL_UIDS'||request.approval.type!=='FINAL_QA'||request.approval.metadataReviewed!==true||
    !String(request.approval.approvedBy||'').trim()||request.approval.sourceRebind!==undefined||
    request.approval.metaPipelineAudit!==undefined||request.registrationMode!==undefined||
    request.registryChanges!==undefined&&(!Array.isArray(request.registryChanges)||request.registryChanges.length)||
    !/^original\/middle\/m1\/2(?:mid|final)\/[^/]+\.js$/.test(request.sourceArchiveFile||'')||
    !Array.isArray(items)||!items.length||items.some(item=>!empty(item.before)||!empty(item.after)||item.sourceReview!==undefined||
      !['UNCHANGED_WHOLE_QUESTION_AND_ASSETS','INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY'].includes(item.preservationMode))||
    !items.some(item=>item.preservationMode==='INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY'))fail('RENDERER_PRESERVATION_SCOPE');
  return {schemaVersion:APPROVED_RENDERER_PRESERVATION_SCHEMA,selectedCount:items.length};
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

// This opt-in preserves a proper subset of an immutable FULL audit after only
// disjoint source metadata changes. It has no D5 dependency or new approval.
// The official registrar still replays the FULL authority, current selected
// state, whole questions, renderer bytes and typed issued sidecar.
function auditSourcePreservationDescriptor(request, file) {
  const spec = request.approval?.sourceRebind;
  if (spec?.schemaVersion !== AUDIT_SOURCE_PRESERVATION_SCHEMA) return undefined;
  const ref = spec.priorReceiptRef;
  if (request.schemaVersion !== NATIVE_REQUEST_SCHEMA || request.scope !== 'PARTIAL_UIDS'
      || request.registrationMode !== undefined || request.approval.type !== 'META_PIPELINE_AUDIT'
      || request.approval.metadataReviewed !== true || typeof request.approval.approvedBy !== 'string'
      || !request.approval.approvedBy.trim() || !Array.isArray(request.registryChanges) || request.registryChanges.length
      || !objectKeys(spec, ['schemaVersion', 'requestPath', 'priorCommit', 'priorReceiptRef'])
      || spec.requestPath !== file || !/^[a-f0-9]{40}$/.test(spec.priorCommit || '')
      || !objectKeys(ref, ['path', 'sha256']) || typeof ref.path !== 'string'
      || !ref.path.startsWith(RECEIPTS) || ref.path.slice(RECEIPTS.length).includes('/')
      || !ref.path.endsWith('.json') || !/^[a-f0-9]{64}$/.test(ref.sha256 || '')
      || !Array.isArray(request.items) || !request.items.length || request.items.length >= request.expectedQuestionCount
      || request.items.some(item => !emptyObject(item.before) || !emptyObject(item.after)
        || Object.keys(item).some(key => !['questionUid', 'sourceOrdinal', 'before', 'after', 'reason', 'evidenceRefs'].includes(key))
        || typeof item.reason !== 'string' || !item.reason.trim()
        || !item.evidenceRefs?.some(evidence => eq(evidence, ref)))
      || !request.approval.evidenceRefs?.some(evidence => eq(evidence, ref))) fail('AUDIT_SOURCE_PRESERVATION_SCOPE');
  safe('/', ref.path);
  return { schemaVersion: spec.schemaVersion, priorCommit: spec.priorCommit, priorReceiptRef: { ...ref } };
}

const REGISTRY_DEPENDENCY_SCHEMA = 'archive-native-active-binding-dependency-v1';
const BINDING_FIELDS = ['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey'];
const BINDING_PATH = /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9_-]+\/bindings\.json$/;
const GEOMETRY_PACK = 'archive/data/meta-foundation/canonical/packs/geometry-equations';
const GEOMETRY_VERSION_SCHEMA = 'archive-native-geometry-pack-version-dependency-v1';
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
  const geometryPackProvider = (Array.isArray(request.registryChanges) ? request.registryChanges : []).some(change =>
    change.path === `${GEOMETRY_PACK}/taxonomy.json` && ['problemTypes', 'templates'].includes(change.collection)
    && Object.hasOwn(change, 'before') && Object.hasOwn(change, 'after') && !eq(change.before, change.after));
  return provides.length || requires.length || geometryPackProvider
    ? { schemaVersion: REGISTRY_DEPENDENCY_SCHEMA, provides, requires,
      ...(geometryPackProvider ? { geometryPackProvider: true } : {}) } : undefined;
}

// A taxonomy-only change also increments this pack's version. Its native
// consumers must issue their runtime receipts against the final selected pack,
// before the compiler checks that exact same version. This adds ordering only;
// the registrar still verifies all changes, evidence and whole runtime rows.
function attachGeometryPackVersionDependencies({ root, headSha, requests, cache }) {
  if (!requests.some(r => r.registryDependency?.geometryPackProvider)) return requests;
  const packPath = `${GEOMETRY_PACK}/pack.json`, bindingsPath = `${GEOMETRY_PACK}/bindings.json`;
  const pack = fixedJson(root, headSha, packPath, cache), bindings = fixedJson(root, headSha, bindingsPath, cache);
  if (pack.value?.packId !== 'GEOMETRY_EQUATIONS' || pack.value.canonicalStatus !== 'ACTIVE'
      || !/^\d+\.\d+\.\d+$/.test(pack.value.packVersion || '') || bindings.value?.status !== 'ACTIVE'
      || bindings.value.ownerPack !== 'GEOMETRY_EQUATIONS' || !Array.isArray(bindings.value.bindings))
    fail('REGISTRY_VERSION_CONTEXT');
  const context = { schemaVersion: GEOMETRY_VERSION_SCHEMA, headSha, packVersion: pack.value.packVersion,
    packRef: { path: packPath, sha256: pack.sha256 }, bindingsRef: { path: bindingsPath, sha256: bindings.sha256 } };
  for (const request of requests) {
    const consumers = (request.registryDependency?.requires || []).filter(row => {
      const matches = bindings.value.bindings.filter(binding => binding.status === 'ACTIVE'
        && binding.ownerPack === 'GEOMETRY_EQUATIONS' && eq(bindingKey(binding), row.key));
      if (matches.length > 1) fail('REGISTRY_VERSION_AMBIGUOUS');
      return matches.length === 1;
    });
    const provider = request.registryDependency?.geometryPackProvider === true;
    if (provider || consumers.length) request.geometryPackVersionDependency = {
      ...structuredClone(context), provider, consumers: structuredClone(consumers) };
  }
  return requests;
}

// The main writer shares this exact dependency context with the PR selector.
// Keep the cache private and bind both caller graphs to the checkout snapshot.
export function attachNativeRegistryVersionDependencies({ root, headSha, requests }) {
  if (!requests.some(r => r.registryDependency?.geometryPackProvider)) return requests;
  if (!/^[a-f0-9]{40}$/.test(headSha || '') || git(root, 'rev-parse', 'HEAD').trim() !== headSha)
    fail('REGISTRY_VERSION_CONTEXT');
  return attachGeometryPackVersionDependencies({ root, headSha, requests, cache: new Map() });
}

function geometryPackVersionDependencies(requests) {
  const providers = [], consumers = [], dependencies = new Map();
  let fixedContext;
  for (const request of requests) {
    const descriptor = request.geometryPackVersionDependency;
    if (!descriptor) {
      if (request.registryDependency?.geometryPackProvider) fail('REGISTRY_VERSION_DESCRIPTOR');
      continue;
    }
    const { provider, consumers: rows, ...context } = descriptor;
    if (!objectKeys(descriptor, ['schemaVersion', 'headSha', 'packVersion', 'packRef', 'bindingsRef', 'provider', 'consumers'])
        || descriptor.schemaVersion !== GEOMETRY_VERSION_SCHEMA || !/^[a-f0-9]{40}$/.test(descriptor.headSha || '')
        || !/^\d+\.\d+\.\d+$/.test(descriptor.packVersion || '') || typeof provider !== 'boolean'
        || provider !== (request.registryDependency?.geometryPackProvider === true) || !Array.isArray(rows)
        || ![descriptor.packRef, descriptor.bindingsRef].every(ref => objectKeys(ref, ['path', 'sha256']) && /^[a-f0-9]{64}$/.test(ref.sha256 || ''))
        || descriptor.packRef.path !== `${GEOMETRY_PACK}/pack.json` || descriptor.bindingsRef.path !== `${GEOMETRY_PACK}/bindings.json`
        || rows.some(row => !objectKeys(row, ['questionUid', 'sourceOrdinal', 'key'])
          || !(request.registryDependency?.requires || []).some(required => eq(required, row)))
        || new Set(rows.map(row => row.questionUid)).size !== rows.length || !provider && !rows.length)
      fail('REGISTRY_VERSION_DESCRIPTOR');
    if (fixedContext && !eq(fixedContext, context)) fail('REGISTRY_VERSION_CONTEXT');
    fixedContext = context;
    if (provider) providers.push(request.path);
    if (rows.length) consumers.push(request.path);
  }
  if (consumers.length && !providers.length) fail('REGISTRY_VERSION_PROVIDER_NOT_SELECTED');
  for (const consumer of consumers) for (const provider of providers) if (provider !== consumer) {
    if (!dependencies.has(consumer)) dependencies.set(consumer, new Set());
    dependencies.get(consumer).add(provider);
  }
  return dependencies;
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
  for (const [consumer, providers] of geometryPackVersionDependencies(requests)) {
    if (!dependencies.has(consumer)) dependencies.set(consumer, new Set());
    for (const provider of providers) dependencies.get(consumer).add(provider);
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
    if (request.kind !== (request.basicPreservation.newBasicParent ? 'basic-parent-registration' : 'basic-approval-preservation') ||
        ![BASIC_PRESERVATION_SCHEMA, NATIVE_BASIC_HOLD_SCHEMA, NATIVE_BASIC_PARENT_SCHEMA].includes(request.basicPreservation.schemaVersion) ||
        Boolean(request.basicPreservation.newBasicParent) !== (request.basicPreservation.schemaVersion === NATIVE_BASIC_PARENT_SCHEMA))
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
const objectKeys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value)
  && eq(Object.keys(value).sort(), [...expected].sort());
const FINGERPRINT_FIELDS = ['sourceFingerprint', 'contentFingerprint'];
const fingerprintPair = value => objectKeys(value, FINGERPRINT_FIELDS)
  && FINGERPRINT_FIELDS.every(field => /^[a-f0-9]{64}$/.test(value[field]));

function fingerprintOnlyFinalQaReassessment(request) {
  return request?.schemaVersion === NATIVE_REQUEST_SCHEMA && request.scope === 'PARTIAL_UIDS'
    && request.registrationMode === undefined && request.approval?.type === 'FINAL_QA'
    && request.approval.metadataReviewed === true && request.approval.sourceRebind === undefined
    && typeof request.approval.approvedBy === 'string' && Boolean(request.approval.approvedBy.trim())
    && Array.isArray(request.registryChanges) && request.registryChanges.length === 0
    && Array.isArray(request.items) && request.items.length > 0
    && request.items.every(item => fingerprintPair(item.before) && fingerprintPair(item.after)
      && item.rebind === undefined && objectKeys(item.identityBefore, ['sourceFingerprint'])
      && /^[a-f0-9]{64}$/.test(item.identityBefore.sourceFingerprint)
      && objectKeys(item.sourceReview, ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef'])
      && item.sourceReview.schemaVersion === 'archive-reviewed-source-reassessment-v1'
      && /^[a-f0-9]{40}$/.test(item.sourceReview.reviewCommit || '')
      && item.sourceReview.reviewRef?.path === item.sourceReview.reviewPath
      && /^[a-f0-9]{64}$/.test(item.sourceReview.reviewRef?.sha256 || ''));
}

function fixedJson(root, headSha, file, cache) {
  safe(root, file);
  if (!cache.has(file)) {
    const raw = file === METADATA ? questionMetadataBytesAt(root, headSha) : gitBytes(root, `${headSha}:${file}`);
    let value; try { value = JSON.parse(raw); } catch { fail(`INHERITED_REASSESSMENT_JSON:${file}`); }
    cache.set(file, { value, sha256: sha(raw) });
  }
  return cache.get(file);
}
function oneUid(rows, uid) {
  if (!Array.isArray(rows)) return null;
  const found = rows.filter(row => row?.questionUid === uid);
  return found.length === 1 ? found[0] : null;
}

// A visual/source refresh may have an explicit current sourceReview instead of
// the empty sourceRebind envelope. It can enter an inherited preview only when
// every selected UID is still the exact already-issued FINAL_QA approval. No
// metadata value, approval type, registry row or unapproved UID is inferred.
function inheritedFingerprintReassessment({ root, headSha, request, cache }) {
  if (!fingerprintOnlyFinalQaReassessment(request)) return null;
  const refs = new Map((request.approval.evidenceRefs || []).filter(ref =>
    typeof ref?.path === 'string' && ref.path.startsWith(RECEIPTS)
      && !ref.path.slice(RECEIPTS.length).includes('/') && ref.path.endsWith('.json'))
    .map(ref => [ref.path, ref]));
  const receipts = [];
  for (const ref of refs.values()) {
    const fixed = fixedJson(root, headSha, ref.path, cache), receipt = fixed.value;
    if (receipt?.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2'
        || receipt.approval?.type !== 'FINAL_QA' || receipt.sourceArchiveFile !== request.sourceArchiveFile) continue;
    if (ref.sha256 !== fixed.sha256) fail('INHERITED_REASSESSMENT_RECEIPT_DRIFT');
    receipts.push({ ref, receipt });
  }
  if (!receipts.length) return null;
  if (receipts.length !== 1) fail('INHERITED_REASSESSMENT_RECEIPT_AMBIGUOUS');
  const { ref, receipt } = receipts[0];
  const total = receipt.scope === 'PARTIAL_UIDS' ? receipt.expectedQuestionCount : receipt.totalQuestions;
  const count = receipt.totalQuestions, selected = receipt.appliedRecords;
  if (receipt.metadataRegistrationStatus !== 'REGISTERED' || receipt.approval.metadataReviewed !== true
      || ref.path !== `${RECEIPTS}${receipt.requestId}.json`
      || !Number.isSafeInteger(count) || count < 1 || total !== request.expectedQuestionCount
      || receipt.scope !== undefined && receipt.scope !== 'PARTIAL_UIDS'
      || receipt.scope === 'PARTIAL_UIDS' && receipt.partialUidCount !== count
      || ![selected, receipt.appliedIdentityRecords, receipt.runtimeRecords].every(rows => Array.isArray(rows)
        && rows.length === count && new Set(rows.map(row => row.questionUid)).size === count))
    fail('INHERITED_REASSESSMENT_PRIOR_SCOPE');
  const runtimePaths = (receipt.outputDigests || []).filter(row =>
    /^archive\/data\/meta-foundation\/runtime\/[a-z0-9_-]+\.json$/.test(row.path || '')).map(row => row.path);
  if (runtimePaths.length !== 1) fail('INHERITED_REASSESSMENT_RUNTIME_SCOPE');
  const metadata = fixedJson(root, headSha, METADATA, cache);
  const identity = fixedJson(root, headSha, 'archive/data/question_identity_map.json', cache);
  const runtime = fixedJson(root, headSha, runtimePaths[0], cache);
  if (runtime.value?.status !== 'ACTIVE' || runtime.value.generatedFrom?.[`reviewedExam_${receipt.requestId}`] !== ref.path)
    fail('INHERITED_REASSESSMENT_RUNTIME_BINDING');
  for (const item of request.items) {
    const uid = item.questionUid, previous = oneUid(selected, uid), current = oneUid(metadata.value.records, uid);
    const oldIdentity = oneUid(receipt.appliedIdentityRecords, uid), currentIdentity = oneUid(identity.value.records, uid);
    const oldRuntime = oneUid(receipt.runtimeRecords, uid), currentRuntime = oneUid(runtime.value.records, uid);
    if (!previous || !oldIdentity || !oldRuntime || !eq(previous, current) || !eq(oldIdentity, currentIdentity)
        || !eq(oldRuntime, currentRuntime) || previous.metadataApprovalType !== 'FINAL_QA'
        || previous.metadataStatus !== 'approved_semantic_review' || previous.metaFoundationStatus !== 'ACTIVE'
        || previous.defaultSelectable !== true || !previous.approvalEvidence?.includes(ref.path)
        || [previous, oldIdentity, oldRuntime].some(row => row.sourceArchiveFile !== request.sourceArchiveFile
          || row.sourceOrdinal !== item.sourceOrdinal)
        || FINGERPRINT_FIELDS.some(field => item.before[field] !== previous[field])
        || item.identityBefore.sourceFingerprint !== oldIdentity.sourceFingerprint)
      fail('INHERITED_REASSESSMENT_EXISTING_APPROVAL');
  }
  return { headSha, priorReceiptRef: ref, runtimePath: runtimePaths[0],
    baselineDigests: { metadata: metadata.sha256, identity: identity.sha256, runtime: runtime.sha256 } };
}

// The official writer still evaluates the current sourceReview. Independently
// retain the narrower CI selection promise: only fingerprints and provenance
// may differ from the old approval, including after build and shadow replay.
export function verifyInheritedReassessmentValues(root, request) {
  const spec = request.inheritedFingerprintReassessment;
  if (!spec) return;
  const prior = fixedJson(root, spec.headSha, spec.priorReceiptRef.path, new Map());
  if (prior.sha256 !== spec.priorReceiptRef.sha256) fail('INHERITED_REASSESSMENT_RECEIPT_DRIFT');
  const current = JSON.parse(fs.readFileSync(safe(root, METADATA), 'utf8'));
  const currentIdentity = JSON.parse(fs.readFileSync(safe(root, 'archive/data/question_identity_map.json'), 'utf8'));
  const currentRuntime = JSON.parse(fs.readFileSync(safe(root, spec.runtimePath), 'utf8'));
  const issued = JSON.parse(fs.readFileSync(safe(root, request.receiptPath), 'utf8'));
  const inputRaw = gitBytes(root, `${spec.headSha}:${request.path}`), input = JSON.parse(inputRaw);
  if (sha(inputRaw) !== spec.requestSha256 || spec.requestSha256 !== request.sha256)
    fail('INHERITED_REASSESSMENT_REQUEST_DRIFT');
  if (issued.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || issued.requestId !== request.requestId
      || issued.approval?.type !== 'FINAL_QA' || issued.sourceArchiveFile !== input.sourceArchiveFile
      || issued.sourceBlobSha1 !== request.source.blobSha1 || issued.sourceRawSha256 !== request.source.sha256
      || issued.scope !== 'PARTIAL_UIDS' || issued.totalQuestions !== request.questionCount
      || issued.partialUidCount !== request.questionCount || issued.expectedQuestionCount !== request.sourceQuestionCount)
    fail('INHERITED_REASSESSMENT_ISSUED_SCOPE');
  const permitted = new Set([...FINGERPRINT_FIELDS, 'metadataRevision', 'approvalEvidence']);
  const unchangedExcept = (before, after, allowed) => before && after &&
    sorted([...Object.keys(before), ...Object.keys(after)]).every(key => allowed.has(key) || eq(before[key], after[key]));
  const provenance = (before, after) => Array.isArray(after.approvalEvidence)
    && after.approvalEvidence.includes(request.receiptPath)
    && before.approvalEvidence.every(ref => after.approvalEvidence.includes(ref));
  for (const item of input.items) {
    const previous = oneUid(prior.value.appliedRecords, item.questionUid), row = oneUid(current.records, item.questionUid);
    if (!previous || !row || !eq(row, oneUid(issued.appliedRecords, item.questionUid))
        || !unchangedExcept(previous, row, permitted)
        || FINGERPRINT_FIELDS.some(field => row[field] !== item.after[field])
        || !provenance(previous, row))
      fail('INHERITED_REASSESSMENT_CHANGED_APPROVAL_VALUES');
    const oldIdentity = oneUid(prior.value.appliedIdentityRecords, item.questionUid), identity = oneUid(currentIdentity.records, item.questionUid);
    if (!unchangedExcept(oldIdentity, identity, new Set(['sourceFingerprint']))
        || !eq(identity, oneUid(issued.appliedIdentityRecords, item.questionUid))
        || identity.sourceFingerprint !== item.after.sourceFingerprint)
      fail('INHERITED_REASSESSMENT_CHANGED_IDENTITY_VALUES');
    const oldRuntime = oneUid(prior.value.runtimeRecords, item.questionUid), runtime = oneUid(currentRuntime.records, item.questionUid);
    if (!unchangedExcept(oldRuntime, runtime, new Set([...permitted, 'approvedSourceFingerprint']))
        || !eq(runtime, oneUid(issued.runtimeRecords, item.questionUid))
        || FINGERPRINT_FIELDS.some(field => runtime[field] !== item.after[field])
        || runtime.approvedSourceFingerprint !== item.after.sourceFingerprint || !provenance(oldRuntime, runtime))
      fail('INHERITED_REASSESSMENT_CHANGED_RUNTIME_VALUES');
  }
}

function partialFinalQaPreservation(request) {
  const approval = request?.approval, rebind = approval?.sourceRebind;
  return request?.schemaVersion === NATIVE_REQUEST_SCHEMA && request.scope === 'PARTIAL_UIDS'
    && request.registrationMode === undefined && (request.registryChanges === undefined ||
      Array.isArray(request.registryChanges) && request.registryChanges.length === 0)
    && approval?.type === 'FINAL_QA' && approval.metadataReviewed === true
    && typeof approval.approvedBy === 'string' && Boolean(approval.approvedBy.trim())
    && rebind && !Array.isArray(rebind) && eq(Object.keys(rebind), ['priorReceiptRef'])
    && typeof rebind.priorReceiptRef?.path === 'string' && /^[a-f0-9]{64}$/.test(rebind.priorReceiptRef?.sha256 || '')
    && Array.isArray(request.items) && request.items.length > 0
    && request.items.every(item => emptyObject(item.before) && emptyObject(item.after)
      && item.rebind === undefined && item.sourceReview === undefined);
}

// Expand only explicit registry dependencies of the selected requests. Dispatch
// comes from the same immutable HEAD inbox, never a working copy or moving ref.
// A matching provider must still pass the ordinary request/source/evidence
// selector and official registrar; this does not approve a canonical row.
function selectBindingProviderClosure({ root, baseSha, headSha, files, basePaths, pendingPaths }) {
  const fixed = new Map(), providers = new Map();
  for (const file of pendingPaths) {
    const raw = gitBytes(root, `${headSha}:${file}`);
    let request;
    try { request = JSON.parse(raw); } catch { continue; }
    if (!request || typeof request !== 'object' || Array.isArray(request)) continue;
    const descriptor = nativeRegistryDependencyDescriptor(request);
    if (!descriptor) continue;
    fixed.set(file, { raw, descriptor });
    for (const row of descriptor.provides) {
      const key = JSON.stringify(row.key);
      if (!providers.has(key)) providers.set(key, []);
      providers.get(key).push(file);
    }
  }
  const selected = new Set(files), queue = [...selected], inherited = new Map();
  for (let i = 0; i < queue.length; i++) {
    const consumer = queue[i];
    for (const row of fixed.get(consumer)?.descriptor.requires || []) {
      const matches = providers.get(JSON.stringify(row.key)) || [];
      if (matches.length > 1) fail('REGISTRY_DEPENDENCY_AMBIGUOUS');
      const provider = matches[0];
      // A missing provider may be an existing canonical binding. Leave that
      // decision, including refusal of a missing ACTIVE row, to the registrar.
      if (!provider || provider === consumer) continue;
      if (!selected.has(provider)) {
        const raw = fixed.get(provider).raw;
        if (!basePaths.has(provider) || !raw.equals(gitBytes(root, `${baseSha}:${provider}`)))
          fail(`INHERITED_BINDING_PROVIDER_CHANGED:${provider}`);
        inherited.set(provider, { baseSha, requestSha256: sha(raw), requiredBy: [] });
        selected.add(provider); queue.push(provider);
      }
      const reason = inherited.get(provider);
      const witness = { requestPath: consumer, questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal, key: row.key };
      if (reason && !reason.requiredBy.some(value => eq(value, witness))) reason.requiredBy.push(witness);
    }
  }
  for (const reason of inherited.values()) reason.requiredBy.sort((a, b) =>
    a.requestPath.localeCompare(b.requestPath, 'en') || a.sourceOrdinal - b.sourceOrdinal
      || JSON.stringify(a.key).localeCompare(JSON.stringify(b.key), 'en'));
  return { files: [...selected], inherited };
}

// A code-only PR may inherit source changes whose registration writer is still
// pending. An exact no-new-approval partial FINAL_QA rebind may supply that
// existing receipt. A fingerprint-only source review needs the exact issued
// approval witness above. Other inherited requests are selected only when
// their exact add-only ACTIVE binding is required by this fixed selection.
export function selectNativeRequests({ root, baseSha, headSha }) {
  const fields = git(root, 'diff', '--name-status', '--diff-filter=AM', '--no-renames', '-z', baseSha, headSha, '--', INBOX).split('\0').filter(Boolean);
  if (fields.length % 2) fail('DIFF_INVALID');
  const files = [];
  for (let i = 0; i < fields.length; i += 2) {
    const file = fields[i + 1];
    if (['A', 'M'].includes(fields[i]) && flatInboxPath(file)) files.push(file);
  }
  const changed = new Set(files), basePaths = new Set(pendingNativeRequestPaths({ root, headSha: baseSha }));
  const pendingPaths = pendingNativeRequestPaths({ root, headSha });
  const inherited = new Map(), inheritedReassessments = new Map(), fixedInputs = new Map();
  for (const file of pendingPaths) {
    if (changed.has(file) || !basePaths.has(file)) continue;
    // Read the fixed Git input for dispatch. A forged working copy cannot turn
    // an ordinary inherited request into an eligible preservation request.
    const raw = gitBytes(root, `${headSha}:${file}`);
    let request; try { request = JSON.parse(raw); } catch { continue; }
    const preservation = partialFinalQaPreservation(request);
    const reassessment = preservation ? null : inheritedFingerprintReassessment({ root, headSha, request, cache: fixedInputs });
    if (!preservation && !reassessment) continue;
    if (!raw.equals(gitBytes(root, `${baseSha}:${file}`))) fail(`INHERITED_REQUEST_CHANGED:${file}`);
    if (preservation) inherited.set(file, { baseSha, requestSha256: sha(raw) });
    else inheritedReassessments.set(file, { baseSha, requestSha256: sha(raw), ...reassessment });
    files.push(file);
  }
  const closure = selectBindingProviderClosure({ root, baseSha, headSha, files, basePaths, pendingPaths });
  return selectFixedNativeRequests({ root, files: closure.files, headSha, rejectUnsupported: false,
    inherited, inheritedBindingProviders: closure.inherited, inheritedReassessments });
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

// A source-only FINAL_QA preservation does not re-author the RPM crosswalk
// recorded by its issued receipt. Permit only that historical RPM reference,
// with its exact published receipt/cohort and unchanged current RPM records.
// Other evidence still has to equal HEAD. The official registrar, Native and
// Consumer checks remain responsible for approval and whole-source continuity.
function historicalPreservedRpmEvidence(root, headSha, context, item, currentRef, cache) {
  const { request, priorRef, receipt } = context;
  const reject = suffix => fail(`PRESERVED_RPM_HISTORY_${suffix}`);
  if (!partialFinalQaPreservation(request)
      || !/^archive\/data\/meta-foundation\/crosswalks\/rpm-primary-v1\.0\/middle[123]\.json$/.test(item.path || '')
      || !eq(request.approval.sourceRebind.priorReceiptRef, priorRef)) return null;
  const count = request.items.length;
  if (receipt.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2'
      || receipt.metadataRegistrationStatus !== 'REGISTERED' || receipt.approval?.type !== 'FINAL_QA'
      || receipt.approval.metadataReviewed !== true || !String(receipt.approval.approvedBy || '').trim()
      || priorRef.path !== `${RECEIPTS}${receipt.requestId}.json`
      || receipt.examUid !== request.examUid || receipt.sourceArchiveFile !== request.sourceArchiveFile
      || receipt.scope !== 'PARTIAL_UIDS' || receipt.totalQuestions !== count || receipt.partialUidCount !== count
      || receipt.expectedQuestionCount !== request.expectedQuestionCount || !/^[a-f0-9]{64}$/.test(receipt.requestSha256 || '')
      || !/^[a-f0-9]{40}$/.test(receipt.sourceBlobSha1 || '') || !/^[a-f0-9]{64}$/.test(receipt.sourceRawSha256 || '')
      || receipt.sourceBlobSha1 === request.expectedSourceBlobSha1
      || ![receipt.appliedRecords, receipt.appliedIdentityRecords, receipt.runtimeRecords, receipt.rpmPrimaryBindings]
        .every(rows => Array.isArray(rows) && rows.length === count && new Set(rows.map(r => r.questionUid)).size === count))
    reject('PRIOR_SCOPE');
  if (sha(gitBytes(root, receipt.sourceBlobSha1)) !== receipt.sourceRawSha256) reject('PRIOR_SOURCE');
  const runtimePaths = (receipt.outputDigests || []).filter(row =>
    /^archive\/data\/meta-foundation\/runtime\/[a-z0-9_-]+\.json$/.test(row.path || '')).map(row => row.path);
  if (runtimePaths.length !== 1) reject('RUNTIME_SCOPE');
  const metadata = fixedJson(root, headSha, METADATA, cache), identity = fixedJson(root, headSha, 'archive/data/question_identity_map.json', cache);
  const runtime = fixedJson(root, headSha, runtimePaths[0], cache);
  if (runtime.value?.status !== 'ACTIVE' || runtime.value.generatedFrom?.[`reviewedExam_${receipt.requestId}`] !== priorRef.path)
    reject('RUNTIME_BINDING');
  for (const selected of request.items) {
    const uid = selected.questionUid, previous = oneUid(receipt.appliedRecords, uid);
    const oldIdentity = oneUid(receipt.appliedIdentityRecords, uid), oldRuntime = oneUid(receipt.runtimeRecords, uid);
    const binding = oneUid(receipt.rpmPrimaryBindings, uid);
    if (!previous || !oldIdentity || !oldRuntime || !binding
        || !eq(previous, oneUid(metadata.value.records, uid)) || !eq(oldIdentity, oneUid(identity.value.records, uid))
        || !eq(oldRuntime, oneUid(runtime.value.records, uid)) || previous.metadataApprovalType !== 'FINAL_QA'
        || previous.metadataStatus !== 'approved_semantic_review' || previous.metaFoundationStatus !== 'ACTIVE'
        || previous.defaultSelectable !== true || !previous.approvalEvidence?.includes(priorRef.path)
        || [previous, oldIdentity, oldRuntime].some(row => row.sourceArchiveFile !== request.sourceArchiveFile
          || row.sourceOrdinal !== selected.sourceOrdinal) || binding.sourceOrdinal !== selected.sourceOrdinal
        || binding.recordId !== previous.rpmPrimaryId || binding.authorityUse !== 'RPM_PATH_PROVENANCE_ONLY'
        || binding.selectsPtTpl !== false || !/^[A-Za-z0-9_-]+$/.test(binding.recordId || '')) reject('EXISTING_APPROVAL');
  }
  const bindings = receipt.rpmPrimaryBindings.filter(binding => eq(binding.crosswalkRef, item));
  if (!bindings.length) reject('REFERENCE_NOT_ISSUED');
  // A commit touching this exact receipt must be a HEAD ancestor and must bind
  // both its current immutable bytes and the historical crosswalk bytes.
  const history = spawnSync('git', ['log', '--format=%H', '--max-count=64', headSha, '--', priorRef.path],
    { cwd: root, encoding: 'utf8', timeout: 10000, maxBuffer: 64 * 1024, env: { ...process.env, GIT_NO_LAZY_FETCH: '1' } });
  if (history.error || history.status !== 0) reject('GIT_HISTORY');
  let historical;
  for (const commit of history.stdout.trim().split(/\s+/).filter(Boolean)) {
    if (!/^[a-f0-9]{40}$/.test(commit)) reject('GIT_HISTORY');
    try {
      if (sha(gitBytes(root, `${commit}:${priorRef.path}`)) !== priorRef.sha256) continue;
      const bytes = gitBytes(root, `${commit}:${item.path}`);
      if (sha(bytes) !== item.sha256) continue;
      historical = { commit, bytes }; break;
    } catch { /* Missing or differently issued history cannot authorize reuse. */ }
  }
  if (!historical) reject('IMMUTABLE_REFERENCE');
  let before, current;
  try { before = JSON.parse(historical.bytes); current = JSON.parse(gitBytes(root, `${headSha}:${item.path}`)); }
  catch { reject('CROSSWALK_JSON'); }
  if ([before, current].some(doc => doc.schemaVersion !== 'rpm-primary-active-crosswalk-v1'
      || doc.status !== 'ACTIVE_REFERENCE' || !Array.isArray(doc.records)
      || doc.records.some(row => typeof row?.id !== 'string' || !row.id)
      || new Set(doc.records.map(row => row.id)).size !== doc.records.length)
      || before.grade !== current.grade || item.path !== `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle${String(before.grade).slice(1)}.json`)
    reject('CROSSWALK_SCOPE');
  const selectedRecords = [];
  for (const binding of bindings) {
    const oldRows = before.records.filter(row => row.id === binding.recordId), currentRows = current.records.filter(row => row.id === binding.recordId);
    if (oldRows.length !== 1 || currentRows.length !== 1 || !eq(oldRows[0], currentRows[0])
        || oldRows[0].curriculum !== binding.curriculum || oldRows[0].scope !== binding.scope
        || !eq(oldRows[0].rpmPath, binding.rpmPath)) reject('SELECTED_RECORD_CHANGED');
    selectedRecords.push({ questionUid: binding.questionUid, sourceOrdinal: binding.sourceOrdinal,
      recordId: binding.recordId, recordSha256: sha(JSON.stringify(oldRows[0])) });
  }
  return { priorReceiptRef: priorRef, historicalRef: { ...item, commit: historical.commit,
    gitBlobSha1: crypto.createHash('sha1').update(`blob ${historical.bytes.length}\0`).update(historical.bytes).digest('hex') },
    currentRef, selectedRecords,
    baselineDigests: { metadata: metadata.sha256, identity: identity.sha256, runtime: runtime.sha256 } };
}

// Preserving an issued native approval replays its complete ancestor receipt.
// Include that receipt's explicit SHA-bound approval inputs in the same fixed
// manifest, so the independent shadow receives the documents too. This stages
// inputs only; the official registrar still authenticates every approval.
function fixedNativeEvidence(root, headSha, lists, { withdrawnReceiptRef, auditSourceAncestor, preservationRequest, historicalRpmEvidence = [] } = {}) {
  const refs = new Map(), active = new Set(), historyCache = new Map();
  const visit = (item, context = null) => {
    if (!/^[a-f0-9]{64}$/.test(item?.sha256 || '')) fail('EVIDENCE_SHA');
    safe(root, item.path);
    if (active.has(item.path)) fail(`EVIDENCE_CYCLE:${item.path}`);
    const known = refs.get(item.path);
    if (known) {
      if (known.sha256 !== item.sha256 && !(context && historicalRpmEvidence.some(row =>
        eq(row.priorReceiptRef, context.priorRef) && eq(row.historicalRef.path, item.path) && row.historicalRef.sha256 === item.sha256)))
        fail(`EVIDENCE_DRIFT:${item.path}`);
      return;
    }
    const ref = fileRef(root, item.path);
    if (ref.sha256 !== item.sha256) {
      const historical = context && historicalPreservedRpmEvidence(root, headSha, context, item, ref, historyCache);
      if (!historical) fail(`EVIDENCE_DRIFT:${ref.path}`);
      if (sha(gitBytes(root, `${headSha}:${ref.path}`)) !== ref.sha256) fail(`EVIDENCE_NOT_FIXED:${ref.path}`);
      refs.set(ref.path, ref); historicalRpmEvidence.push(historical); return;
    }
    if (sha(gitBytes(root, `${headSha}:${ref.path}`)) !== ref.sha256) fail(`EVIDENCE_NOT_FIXED:${ref.path}`);
    refs.set(ref.path, ref);
    const nativeReceipt = ref.path.startsWith(RECEIPTS)
      && !ref.path.slice(RECEIPTS.length).includes('/') && ref.path.endsWith('.json');
    if (!nativeReceipt) return;
    let receipt;
    try { receipt = JSON.parse(fs.readFileSync(safe(root, ref.path), 'utf8')); }
    catch { fail(`EVIDENCE_JSON:${ref.path}`); }
    if (auditSourceAncestor && eq(auditSourceAncestor.priorReceiptRef, { path: ref.path, sha256: ref.sha256 })) {
      // Only this typed source-only audit uses a historical FULL authority.
      // Its registrar replays the entire prior graph from immutable Git,
      // including consumed inbox snapshots. Those historical bytes must not
      // be substituted with today's source or canonical files in the shadow.
      let priorBytes;
      try { priorBytes = gitBytes(root, `${auditSourceAncestor.priorCommit}:${ref.path}`); }
      catch { fail('AUDIT_SOURCE_PRIOR_GIT'); }
      if (sha(priorBytes) !== ref.sha256) fail('AUDIT_SOURCE_PRIOR_GIT');
      const priorRequest = receipt?.auditPreservation?.requestSnapshot;
      if (receipt?.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2'
          || receipt.metadataRegistrationStatus !== 'REGISTERED' || receipt.scope !== undefined
          || receipt.partialUidCount !== undefined || receipt.registrationMode !== undefined
          || receipt.approval?.type !== 'META_PIPELINE_AUDIT'
          || receipt.approval.sourceRebind?.schemaVersion !== AUDIT_PRESERVATION_SCHEMA
          || receipt.requestId !== path.posix.basename(ref.path, '.json')
          || receipt.sourceArchiveFile !== auditSourceAncestor.sourceArchiveFile
          || receipt.examUid !== auditSourceAncestor.examUid || receipt.totalQuestions !== auditSourceAncestor.expectedQuestionCount
          || receipt.newMetadataApprovals !== 0 || receipt.preservedMetadataApprovals !== receipt.totalQuestions
          || priorRequest?.schemaVersion !== NATIVE_REQUEST_SCHEMA || priorRequest.scope !== undefined
          || priorRequest.requestId !== receipt.requestId || priorRequest.sourceArchiveFile !== receipt.sourceArchiveFile
          || priorRequest.expectedQuestionCount !== receipt.totalQuestions || priorRequest.approval?.type !== 'META_PIPELINE_AUDIT'
          || !Array.isArray(priorRequest.items) || priorRequest.items.length !== receipt.totalQuestions) fail('AUDIT_SOURCE_PRIOR_FULL');
      return;
    }
    if (receipt?.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2') return;
    const nestedRefs = receipt.approval?.evidenceRefs;
    // An authority withdrawal binds its unsupported original receipt as the
    // object being corrected, not as proof of a reusable native approval.
    // Only that exact path/SHA may terminate without approval evidence. If
    // evidence is present, retain every ordinary recursive validation below.
    const withdrawnOriginal = withdrawnReceiptRef?.path === ref.path && withdrawnReceiptRef.sha256 === ref.sha256;
    if (withdrawnOriginal && (nestedRefs === undefined || Array.isArray(nestedRefs) && !nestedRefs.length)) return;
    if (!Array.isArray(nestedRefs) || !nestedRefs.length) fail('EVIDENCE_REQUIRED');
    active.add(ref.path);
    const priorRef = preservationRequest?.approval?.sourceRebind?.priorReceiptRef;
    const priorContext = partialFinalQaPreservation(preservationRequest) && eq(priorRef, { path: ref.path, sha256: ref.sha256 })
      ? { request: preservationRequest, priorRef, receipt } : null;
    for (const nested of nestedRefs) visit(nested, priorContext);
    active.delete(ref.path);
  };
  for (const list of lists) {
    if (!Array.isArray(list) || !list.length) fail('EVIDENCE_REQUIRED');
    for (const item of list) visit(item);
  }
  return [...refs.values()].sort((a, b) => a.path.localeCompare(b.path, 'en'));
}

// Reuse the official closed E032 subset contract against the immutable input.
// Selection also runs after registration, so generated worktree post-state must
// not replace the initial HEAD authority. The official registrar and Consumer
// still validate every selected native leaf and the actual issued post-state.
function partialSubsetPreservationDescriptor({ root, headSha, request, bytes, bank, cache }) {
  if (!isPartialSubsetPreservation(request)) return undefined;
  const spec = request.approval.sourceRebind, ref = spec.priorReceiptRef;
  if (!objectKeys(ref, ['path', 'sha256']) || typeof ref.path !== 'string'
      || !ref.path.startsWith(RECEIPTS) || ref.path.slice(RECEIPTS.length).includes('/')
      || !ref.path.endsWith('.json') || !/^[a-f0-9]{64}$/.test(ref.sha256 || '')) fail('PARTIAL_SUBSET_PRIOR_REF');
  const prior = fixedJson(root, headSha, ref.path, cache);
  if (prior.sha256 !== ref.sha256) fail('PARTIAL_SUBSET_PRIOR_DRIFT');
  const metadata = fixedJson(root, headSha, METADATA, cache);
  const identity = fixedJson(root, headSha, 'archive/data/question_identity_map.json', cache);
  const runtime = fixedJson(root, headSha, 'archive/data/meta-foundation/runtime/middle2-v1.json', cache);
  const validated = validatePartialSubsetPreservation({ root, envelope: request, prior: prior.value, bytes, bank,
    metadata: metadata.value.records, identities: identity.value.records, runtime: runtime.value.records, mode: 'request' });
  return { schemaVersion: spec.schemaVersion, priorCommit: spec.priorCommit, currentCommit: spec.currentCommit,
    priorReceiptRef: { ...ref }, priorApprovalCount: validated.priorApprovalCount,
    preservedMetadataApprovals: validated.preservedMetadataApprovals, newMetadataApprovals: validated.newMetadataApprovals,
    baselineDigests: { metadata: metadata.sha256, identity: identity.sha256, runtime: runtime.sha256 } };
}

function selectFixedNativeRequests({ root, files, headSha, rejectUnsupported, inherited = new Map(), inheritedBindingProviders = new Map(), inheritedReassessments = new Map() }) {
  const requests = [], fixedSubsetInputs = new Map();
  for (const file of files) {
    safe(root, file);
    const raw = fs.readFileSync(path.join(root, file));
    if (sha(raw) !== sha(gitBytes(root, `${headSha}:${file}`))) fail(`REQUEST_NOT_FIXED:${file}`);
    let request; try { request = JSON.parse(raw); } catch { fail(`REQUEST_JSON:${file}`); }
    if (request.schemaVersion === DIFFICULTY_REQUEST_SCHEMA) {
      requests.push(selectDifficulty(root, file, request, headSha));
      continue;
    }
    const correction = request.schemaVersion === PARENT_CORRECTION_SCHEMA;
    const authorityCorrection = isNativeAuthorityCorrection(request);
    const basicPreservation = basicPreservationDescriptor(request);
    const rendererPreservation = approvedRendererPreservationDescriptor(request);
    if (!correction && !basicPreservation && request.schemaVersion !== NATIVE_REQUEST_SCHEMA) {
      // An unhandled main inbox must not be reported as a coherent projection.
      // PRs retain their existing ownership boundary for unrelated schemas.
      if (rejectUnsupported) fail(`PENDING_SCHEMA_UNSUPPORTED:${file}`);
      continue;
    }
    const sourceRebind = auditPreservationDependency(request, file);
    const auditSourcePreservation = auditSourcePreservationDescriptor(request, file);
    const registryDependency = nativeRegistryDependencyDescriptor(request);
    const preservation = request.approval?.sourceRebind !== undefined;
    if (preservation && (correction || request.registrationMode !== undefined ||
        !request.approval.sourceRebind || typeof request.approval.sourceRebind !== 'object' || Array.isArray(request.approval.sourceRebind) ||
        !(sourceRebind || auditSourcePreservation || isPartialSubsetPreservation(request)
          || request.approval.type === 'FINAL_QA' && request.approval.sourceRebind.schemaVersion === undefined))) fail('PRESERVATION_SCOPE');
    const partial = !correction && request.scope === 'PARTIAL_UIDS';
    if (!correction && request.scope !== undefined && !partial) fail('REQUEST_SCOPE');
    if (request.registrationMode !== undefined && (correction || !partial ||
        !['IDENTITY_FINGERPRINT_ONLY', AUTHORITY_CORRECTION_MODE].includes(request.registrationMode))) fail('REGISTRATION_MODE');
    if (authorityCorrection && (request.approval?.type !== 'AUTHORITY_CORRECTION' || request.approval.metadataReviewed !== false ||
        request.registryChanges?.length || request.approval.sourceRebind)) fail('AUTHORITY_WITHDRAWAL_SCOPE');
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
    const historicalRpmEvidence = [];
    const evidence = fixedNativeEvidence(root, headSha, [request.approval?.evidenceRefs, ...(request.items || []).map(i => i.evidenceRefs),
      ...(request.registryChanges || []).map(i => i.evidenceRefs),
      ...(correction ? [[request.difficultyEvidence]] : [])],
      { preservationRequest: request, historicalRpmEvidence,
        withdrawnReceiptRef: authorityCorrection ? request.authorityCorrection?.originalReceiptRef : undefined,
        auditSourceAncestor: auditSourcePreservation ? { ...auditSourcePreservation,
          sourceArchiveFile: request.sourceArchiveFile, examUid: request.examUid, expectedQuestionCount: request.expectedQuestionCount } : undefined });
    const sourcePath = `archive/exams/${request.sourceArchiveFile}`;
    const source = fileRef(root, sourcePath), blobSha1 = git(root, 'rev-parse', `${headSha}:${sourcePath}`).trim();
    // A direct type judgment is bound to each question's stem + choices (the registrar checks the text), not to the file blob.
    // A plain REVIEW2/FINAL_QA request is likewise bound to the stem + choices of its questions (same predicate as the registrar and the consumer gate).
    const textBoundReview = blobSha1 !== request.expectedSourceBlobSha1 && !correction && !preservation && !authorityCorrection &&
      TEXT_BOUND_REVIEW_TYPES.includes(request.approval?.type) &&
      reviewedSourceTextUnchanged({ root, expectedBlobSha1: request.expectedSourceBlobSha1, currentBytes: gitBytes(root, `${headSha}:${sourcePath}`),
        ordinals: selectedItems.map(item => item.sourceOrdinal) }).ok;
    if ((blobSha1 !== request.expectedSourceBlobSha1 && request.approval?.type !== 'DIRECT_JUDGMENT' && !textBoundReview) || sha(gitBytes(root, `${headSha}:${sourcePath}`)) !== source.sha256) fail('SOURCE_NOT_FIXED');
    let bank;
    try {
      const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
      vm.runInNewContext(fs.readFileSync(safe(root, sourcePath), 'utf8'), ctx, { timeout: 5000 });
      bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
    } catch { fail('SOURCE_BANK_INVALID'); }
    if (!Array.isArray(bank) || bank.length !== request.expectedQuestionCount) fail('SOURCE_DENOMINATOR');
    const partialSubsetPreservation = partialSubsetPreservationDescriptor({ root, headSha, request,
      bytes: fs.readFileSync(safe(root, sourcePath)), bank, cache: fixedSubsetInputs });
    requests.push({ ...fileRef(root, file), requestId: request.requestId, questionCount: selectedItems.length,
      sourceQuestionCount: request.expectedQuestionCount, selectedItems,
      ...(inherited.has(file) ? { inheritedPreservation: inherited.get(file) } : {}),
      ...(inheritedBindingProviders.has(file) ? { inheritedBindingProvider: inheritedBindingProviders.get(file) } : {}),
      ...(inheritedReassessments.has(file) ? { inheritedFingerprintReassessment: inheritedReassessments.get(file) } : {}),
      ...(partial ? { scope: request.scope } : {}),
      ...(request.registrationMode ? { registrationMode: request.registrationMode } : {}),
      ...(sourceRebind ? { sourceRebind } : {}),
      ...(auditSourcePreservation ? { auditSourcePreservation } : {}),
      ...(partialSubsetPreservation ? { partialSubsetPreservation } : {}),
      ...(historicalRpmEvidence.length ? { historicalRpmEvidence } : {}),
      ...(registryDependency ? { registryDependency } : {}),
      ...(rendererPreservation ? { rendererPreservation } : {}),
      ...(authorityCorrection ? { kind: 'native-authority-withdrawal' } : basicPreservation ? { basicPreservation, kind: basicPreservation.newBasicParent ? 'basic-parent-registration' : 'basic-approval-preservation' }
        : correction ? { kind: 'basic-parent-correction' } : request.registrationMode === 'IDENTITY_FINGERPRINT_ONLY' ? { kind: 'identity-fingerprint-repair' }
        : preservation || rendererPreservation ? { kind: 'native-approval-preservation', preservedApprovalType: request.approval.type }
        : request.approval?.type === 'DIRECT_JUDGMENT' ? { kind: 'direct-type-judgment' } : {}), source: { ...source, blobSha1 },
      evidence,
      receiptPath: `${RECEIPTS}${request.requestId}.json` });
  }
  if (new Set(requests.map(r => r.requestId)).size !== requests.length) fail('DUPLICATE_REQUEST_ID');
  attachGeometryPackVersionDependencies({ root, headSha, requests, cache: fixedSubsetInputs });
  return orderNativeRequests(requests.sort((a, b) => a.path.localeCompare(b.path, 'en')));
}

function difficultyResult(result, request, flags) {
  const summary = result.summary, verify = flags.includes('--verify-projection'), write = flags.includes('--write');
  const ordinary = request.difficultyRegistrationMode === 'ordinary-ratings';
  if (request.difficultyRegistrationMode !== undefined && !ordinary) fail('DIFFICULTY_REGISTRATION_MODE');
  const expectedMode = ordinary ? verify ? 'verify-projection' : write ? 'write' : 'dry-run'
    : verify ? 'verify-reviewed-correction' : write ? 'write-reviewed-correction' : 'dry-run-reviewed-correction';
  const countKeys = ['APPLY', 'ALREADY_REGISTERED', 'SKIP_INVALID', 'CONFLICT', 'VERIFIED'];
  if (result.status !== 'PASS' || result.requestId !== request.requestId
      || `archive/exams/${result.sourceArchiveFile}` !== request.source.path
      || result.sourceBlobSha !== (ordinary ? request.difficultySourceBlobSha1 : request.source.blobSha1)
      || result.ptTpl !== 'UNTOUCHED_NOT_IN_SCOPE' || !summary || summary.total !== request.questionCount
      || countKeys.some(k => !Number.isSafeInteger(summary[k]) || summary[k] < 0)
      || countKeys.reduce((n, k) => n + summary[k], 0) !== request.questionCount
      || summary.SKIP_INVALID || summary.CONFLICT
      || !Number.isSafeInteger(summary.changedFields) || summary.changedFields < 0 || summary.changedFields > 4 * request.questionCount
      || typeof summary.written !== 'boolean' || summary.written !== Boolean(write && summary.changedFields)
      || result.mode !== expectedMode
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
  if (request.kind === 'native-authority-withdrawal' &&
      (result.newMetadataApprovals !== 0 || result.withdrawnMetadataApprovals !== request.questionCount)) return false;
  if (request.kind === 'native-approval-preservation' &&
      (result.newMetadataApprovals !== 0 || result.preservedMetadataApprovals !== request.questionCount)) return false;
  // Type-only registration: no new approval, and exactly the selected rows get a direct type judgment.
  if (request.kind === 'direct-type-judgment' &&
      (result.fieldScope !== 'TYPE_ONLY' || result.newMetadataApprovals !== 0 || result.typeApprovals !== request.questionCount)) return false;
  if (request.kind === 'basic-approval-preservation' &&
      (result.newMetadataApprovals !== 0 || result.advancedApprovals !== 0 || result.metadataValuesChanged !== false ||
        result.preservedMetadataApprovals !== request.questionCount || result.expectedQuestionCount !== request.sourceQuestionCount)) return false;
  if (request.kind === 'basic-parent-registration' &&
      (result.newMetadataApprovals !== request.questionCount || result.newBasicParentApprovals !== request.questionCount || result.preservedMetadataApprovals !== 0 ||
        result.advancedApprovals !== 0 || result.metadataValuesChanged !== false || result.newDifficultyJudgments !== 0 || result.newBlindReviews !== 0 || result.newReview2 !== 0 ||
        result.expectedQuestionCount !== request.sourceQuestionCount)) return false;
  return request.registrationMode !== 'IDENTITY_FINGERPRINT_ONLY'
    || result.metadataChanged === false && result.newMetadataApprovals === 0;
}
function planPaths(result, request) {
  if (!resultScopeMatches(result, request) || !Array.isArray(result.plannedPaths)
      || typeof result.replay !== 'boolean' || result.plannedPaths.some(file => typeof file !== 'string')) fail('DRY_RUN_NOT_PASS');
  const paths = sorted(result.plannedPaths);
  if (paths.length !== result.plannedPaths.length || paths.some(file => !file.startsWith('archive/data/'))) fail('OUTPUT_SCOPE');
  for (const file of paths) safe('/', file);
  if (request.kind === 'native-authority-withdrawal' && !result.replay) {
    const required = [METADATA, request.receiptPath, ...request.selectedItems.map(item => authorityHoldSealPath(item.questionUid))];
    if (required.some(file => !paths.includes(file)) || paths.some(file => !required.includes(file) &&
        !/^archive\/data\/meta-foundation\/runtime\/[a-z0-9-]+-v1\.json$/.test(file))) fail('AUTHORITY_WITHDRAWAL_OUTPUT_SCOPE');
  }
  if (request.kind === 'difficulty5-ratings') {
    if (!eq(paths, result.replay ? [] : [METADATA])) fail('DIFFICULTY_OUTPUT_SCOPE');
  } else if (['basic-approval-preservation', 'basic-parent-registration'].includes(request.kind)) {
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
    verifyInheritedReassessmentValues(root, request);
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
        || result.consumerSearchStatus !== (request.kind === 'native-authority-withdrawal' ? 'AUTHORITY_WITHDRAWAL_VERIFIED' : identityOnly ? 'IDENTITY_BINDINGS_VERIFIED'
          : request.kind === 'difficulty5-ratings' ? 'STATIC_DIFFICULTY_VALUES_VERIFIED'
          : request.kind === 'direct-type-judgment' ? 'TYPE_FIELDS_VERIFIED' : 'STATIC_VALUES_VERIFIED')
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
          || r.kind === 'native-authority-withdrawal' && (exams[0].newMetadataApprovals !== 0 || exams[0].approvalCreated !== false
            || exams[0].withdrawnMetadataApprovals !== r.questionCount || exams[0].authorityHolds !== r.questionCount
            || exams[0].expectedQuestionCount !== r.sourceQuestionCount || exams[0].skippedUnchanged !== 0 || exams[0].changed !== r.questionCount)
          || r.kind === 'native-approval-preservation' && (exams[0].newMetadataApprovals !== 0 || exams[0].approvalCreated !== false
            || exams[0].preservedMetadataApprovals !== r.questionCount || exams[0].approvalType !== r.preservedApprovalType
            || exams[0].expectedQuestionCount !== r.sourceQuestionCount || exams[0].skippedUnchanged !== 0 || exams[0].changed !== r.questionCount)
          || r.kind === 'direct-type-judgment' && (exams[0].newMetadataApprovals !== 0 || exams[0].approvalCreated !== false
            || !['directTypeApprovals', 'typeNotDisplayed'].every(k => Number.isSafeInteger(exams[0][k]) && exams[0][k] >= 0)
            || exams[0].directTypeApprovals + exams[0].typeNotDisplayed !== r.questionCount
            || exams[0].expectedQuestionCount !== r.sourceQuestionCount || exams[0].skippedUnchanged !== 0 || exams[0].changed !== r.questionCount)
          || r.kind === 'basic-approval-preservation' && (exams[0].newMetadataApprovals !== 0 || exams[0].approvalCreated !== false
            || exams[0].advancedApprovals !== 0 || exams[0].preservedMetadataApprovals !== r.questionCount
            || exams[0].expectedQuestionCount !== r.sourceQuestionCount || exams[0].skippedUnchanged !== 0 || exams[0].changed !== r.questionCount)
          || r.kind === 'basic-parent-registration' && (exams[0].newMetadataApprovals !== r.questionCount || exams[0].newBasicParentApprovals !== r.questionCount || exams[0].approvalCreated !== true
            || exams[0].advancedApprovals !== 0 || exams[0].preservedMetadataApprovals !== 0 || exams[0].newDifficultyJudgments !== 0 || exams[0].newBlindReviews !== 0 || exams[0].newReview2 !== 0
            || exams[0].expectedQuestionCount !== r.sourceQuestionCount || exams[0].skippedUnchanged !== 0 || exams[0].changed !== r.questionCount)
          || `archive/exams/${exams[0].sourceFile}` !== r.source.path || !complete(exams[0], r.questionCount);
      })
      || ['changed', 'checked', 'passed', 'skippedUnchanged'].some(k => result.exams.reduce((sum, e) => sum + e[k], 0) !== result.counts[k])
      || ['failures', 'unobservedFields'].some(k => !Array.isArray(result[k]) || result[k].length)
      || !Array.isArray(result.assignmentPending)) fail('CONSUMER_NOT_PASS');
  for (const request of requests) verifyInheritedReassessmentValues(root, request);
  const difficultyOnly = difficultyAssignmentInformation(requests, result);
  const preservation = requests.filter(r => r.kind === 'native-approval-preservation');
  const preservedNativeApprovals = preservation.length ? { requests: preservation.length,
    preservedMetadataApprovals: preservation.reduce((sum, r) => sum + r.questionCount, 0), newMetadataApprovals: 0,
    approvalTypes: sorted(preservation.map(r => r.preservedApprovalType)) } : null;
  const basic = requests.filter(r => r.kind === 'basic-approval-preservation');
  const preservedBasicApprovals = basic.length ? { requests: basic.length,
    preservedMetadataApprovals: basic.reduce((sum, r) => sum + r.questionCount, 0), newMetadataApprovals: 0, advancedApprovals: 0 } : null;
  const newBasic = requests.filter(r => r.kind === 'basic-parent-registration');
  const newBasicParentApprovals = newBasic.length ? { requests: newBasic.length,
    newBasicParentApprovals: newBasic.reduce((sum, r) => sum + r.questionCount, 0), preservedMetadataApprovals: 0, advancedApprovals: 0 } : null;
  // Type-only judgments: how many rows the catalog shows by type, and how many it does not (stale binding) are reported, not hidden.
  const direct = requests.filter(r => r.kind === 'direct-type-judgment');
  const directTypeJudgments = direct.length ? { requests: direct.length, newMetadataApprovals: 0,
    directTypeApprovals: direct.reduce((sum, r) => sum + result.exams.find(e => e.file === r.path).directTypeApprovals, 0),
    typeNotDisplayed: direct.reduce((sum, r) => sum + result.exams.find(e => e.file === r.path).typeNotDisplayed, 0) } : null;
  noUnexpectedMutation(root, before, new Set());
  return [{ id: 'native-projection', outcome: 'success' },
    { id: 'native-consumer', outcome: 'success', ...(difficultyOnly ? { difficultyOnly } : {}),
      ...(preservedNativeApprovals ? { preservedNativeApprovals } : {}), ...(preservedBasicApprovals ? { preservedBasicApprovals } : {}),
      ...(newBasicParentApprovals ? { newBasicParentApprovals } : {}), ...(directTypeJudgments ? { directTypeJudgments } : {}) }];
}

export function nativeOutputManifest(root, plans) {
  return sorted(plans.flatMap(p => p.plannedPaths)).map(file => fileRef(root, file));
}

// Exact immutable references inside the already selected evidence can also
// name live renderer helpers, runtime files and fonts. Restore only those
// declared paths from HEAD. Historical-only paths stay in Git, and a current
// file is never replaced by the older bytes named by a review. This discovers
// inputs, not approvals: the ordinary registrar still validates every ref and
// the real checkout's live bytes after the independent shadow replay.
function referencedNativeHeadInputs(root, headSha, requests) {
  const paths = new Set();
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.path === 'string' && /^[a-f0-9]{40}$/.test(value.commit || '')
        && /^[a-f0-9]{40}$/.test(value.gitBlobSha1 || '') && /^[a-f0-9]{64}$/.test(value.sha256 || '')
        && Number.isSafeInteger(value.bytes) && value.bytes > 0) paths.add(value.path);
    for (const child of Object.values(value)) visit(child);
  };
  for (const file of sorted(requests.flatMap(r => r.evidence.map(ref => ref.path)))) {
    if (!file.endsWith('.json')) continue;
    let doc;
    try { doc = JSON.parse(gitBytes(root, `${headSha}:${file}`)); }
    catch { continue; } // Non-JSON evidence remains the registrar's responsibility.
    visit(doc);
  }
  return sorted(paths).filter(file => {
    safe('/', file);
    const entry = git(root, 'ls-tree', '-z', headSha, '--', file);
    if (!entry) return false;
    if (!/^100(?:644|755) blob [a-f0-9]{40}\t/.test(entry)
        || entry.slice(entry.indexOf('\t') + 1) !== `${file}\0`) fail(`SHADOW_REFERENCE_NOT_REGULAR:${file}`);
    return true;
  });
}

// The existing family3 validator authenticates this request -> wrapper -> UI
// chain and then reads the captured renderer files from the live checkout.
// Recreate only those read-only inputs in the private initial-state shadow.
// This stages bytes; it does not replace any Native, UI or approval validator.
const SHADOW_UI_TECHNICAL = 'docs/operations/m2-problem21-continuity-20261116/student-ui-technical-v1.json';
const SHADOW_UI_FAMILY = [
  ['original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js', 24, 'qid_v1_3c72535bb4d43798192918e723d32bd646b2415bde8c5e8ad872b445496b7bfd', 7],
  ['original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js', 24, 'qid_v1_76b2be613350f59166e128170c6f38b6150078c9ed44e727733d5de0bbf76942', 8],
  ['original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js', 23, 'qid_v1_9a0686ad7215cc2afff66c158131fd343a64bd2111f30341df6b8383aaba1b7c', 6],
];
const shadowUiReadonlyPath = file => file === 'archive/engine.html'
  || /^archive\/[A-Za-z0-9_-]+\.(?:js|css)$/.test(file)
  || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(file)
  || /^archive\/vendor\/(?:html2canvas|qrious|nanum-myeongjo|ap-enclosed-latin|mathjax|mathjax-tex-font)\/[A-Za-z0-9_./-]+\.(?:js|css|woff2|json)$/.test(file)
  || file === 'archive/data/svg-accessibility-index.js'
  || /^apmath\/(?:css\/student-navigation\.css|js\/student-navigation\.js)$/.test(file);

export function hydrateFixedNativeServedInputs({ root, shadow, headSha, requests }) {
  if (!/^[a-f0-9]{40}$/.test(headSha || '') || git(root, 'rev-parse', 'HEAD').trim() !== headSha
      || path.resolve(root) === path.resolve(shadow)) fail('SHADOW_LIVE_HEAD');
  const blobs = new Map(), staged = new Map(), checked = new Set();
  const regularBlob = (commit, file) => {
    if (!/^[a-f0-9]{40}$/.test(commit || '')) fail('SHADOW_LIVE_COMMIT');
    safe(root, file);
    const key = `${commit}:${file}`;
    if (!blobs.has(key)) {
      const entry = spawnSync('git', ['ls-tree', '-z', commit, '--', file], { cwd: root, encoding: 'utf8',
        env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, maxBuffer: 1024 * 1024 });
      const match = !entry.error && entry.status === 0 && /^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry.stdout);
      if (!match || match[3] !== file) fail(`SHADOW_LIVE_REGULAR_BLOB:${file}`);
      blobs.set(key, match[2]);
    }
    return blobs.get(key);
  };
  const pinned = (commit, ref) => {
    if (!ref || !/^[a-f0-9]{64}$/.test(ref.sha256 || '')) fail('SHADOW_LIVE_REF');
    const blobSha1 = regularBlob(commit, ref.path);
    if (regularBlob(headSha, ref.path) !== blobSha1) fail(`SHADOW_LIVE_HEAD_DRIFT:${ref.path}`);
    const raw = gitBytes(root, `${headSha}:${ref.path}`);
    if (sha(raw) !== ref.sha256 || ref.gitBlobSha1 !== undefined && ref.gitBlobSha1 !== blobSha1
        || ref.bytes !== undefined && ref.bytes !== raw.length || raw.length > 8 * 1024 * 1024)
      fail(`SHADOW_LIVE_DIGEST:${ref.path}`);
    const live = fileRef(root, ref.path);
    if (live.sha256 !== ref.sha256 || live.sizeBytes !== raw.length) fail(`SHADOW_LIVE_WORKTREE_DRIFT:${ref.path}`);
    return { raw, ref: { path: ref.path, gitBlobSha1: blobSha1, sha256: ref.sha256, bytes: raw.length } };
  };
  const fiveRef = ref => {
    if (!objectKeys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'])
        || !/^[a-f0-9]{40}$/.test(ref.commit || '') || !/^[a-f0-9]{40}$/.test(ref.gitBlobSha1 || '')
        || !/^[a-f0-9]{64}$/.test(ref.sha256 || '') || !Number.isSafeInteger(ref.bytes) || ref.bytes < 1)
      fail('SHADOW_LIVE_REF');
    safe(root, ref.path);
    return Object.fromEntries(['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'].map(key => [key, ref[key]]));
  };
  const add = ref => {
    ref = fiveRef(ref);
    if (!shadowUiReadonlyPath(ref.path)) fail(`SHADOW_LIVE_PATH:${ref.path}`);
    const prior = staged.get(ref.path);
    if (prior) {
      if (!eq(prior.expected, ref)) fail(`SHADOW_LIVE_MIXED_REF:${ref.path}`);
      return;
    }
    staged.set(ref.path, { ...pinned(ref.commit, ref), expected: ref });
  };
  for (const selected of requests) {
    if (!flatInboxPath(selected.path)) fail('SHADOW_LIVE_REQUEST');
    const raw = gitBytes(root, `${headSha}:${selected.path}`), request = parsed(raw.toString('utf8'));
    const marked = (request.items || []).filter(item => Object.hasOwn(item.sourceReview || {}, 'm2Family3ProblemContinuity'));
    if (!marked.length) continue;
    if (sha(raw) !== selected.sha256 || raw.length !== selected.sizeBytes || request.requestId !== selected.requestId
        || request.schemaVersion !== NATIVE_REQUEST_SCHEMA || request.scope !== 'PARTIAL_UIDS'
        || request.approval?.type !== 'FINAL_QA' || request.approval.metadataReviewed !== true
        || Object.hasOwn(request.approval, 'sourceRebind') || Object.hasOwn(request, 'registrationMode')
        || !Array.isArray(request.registryChanges) || request.registryChanges.length || marked.length !== request.items.length
        || selected.source.path !== `archive/exams/${request.sourceArchiveFile}`
        || !eq([...selected.selectedItems].sort((a, b) => a.sourceOrdinal - b.sourceOrdinal),
          marked.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal })).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal))
        || marked.some(item => !SHADOW_UI_FAMILY.some(([source, count, uid, ordinal]) =>
          request.sourceArchiveFile === source && request.expectedQuestionCount === count
          && item.questionUid === uid && item.sourceOrdinal === ordinal))) fail('SHADOW_LIVE_REQUEST');
    const bound = (item, ref) => {
      const narrow = { path: ref.path, sha256: ref.sha256 };
      if (![request.approval.evidenceRefs, item.evidenceRefs].every(refs => Array.isArray(refs)
          && refs.filter(value => objectKeys(value, ['path', 'sha256'])
            && value.path === narrow.path && value.sha256 === narrow.sha256).length === 1)
          || !Array.isArray(selected.evidence) || selected.evidence.filter(value => value.path === ref.path
            && value.sha256 === ref.sha256).length !== 1) fail('SHADOW_LIVE_UNBOUND_INVENTORY');
    };
    for (const item of marked) {
      const spec = item.sourceReview.m2Family3ProblemContinuity;
      if (!objectKeys(spec, ['schemaVersion', 'reviewCommit', 'reviewRef'])
          || spec.schemaVersion !== 'archive-m2-family3-problem-continuity-v1'
          || !objectKeys(spec.reviewRef, ['path', 'sha256'])
          || !/^docs\/operations\/m2-family3-problem-continuity-20261116\/binding-e0(?:15|17)-v1\.json$/.test(spec.reviewRef.path || ''))
        fail('SHADOW_LIVE_PROFILE');
      bound(item, spec.reviewRef);
      const wrapper = parsed(pinned(spec.reviewCommit, spec.reviewRef).raw.toString('utf8'));
      if (wrapper.schemaVersion !== 'archive-m2-family3-problem-continuity-binding-v1'
          || wrapper.scope !== 'EXACT_M2_E017_Q6_E015_Q7_Q8_PROBLEM_DISPLAY'
          || wrapper.sourceArchiveFile !== request.sourceArchiveFile || !Array.isArray(wrapper.selectedQuestionUids)
          || !eq([...wrapper.selectedQuestionUids].sort(), marked.map(row => row.questionUid).sort())) fail('SHADOW_LIVE_PROFILE');
      const ref = fiveRef(wrapper.studentUiTechnicalRef);
      if (ref.path !== SHADOW_UI_TECHNICAL) fail('SHADOW_LIVE_PROFILE');
      bound(item, ref);
      const technical = parsed(pinned(ref.commit, ref).raw.toString('utf8'));
      if (checked.has(ref.sha256)) continue;
      checked.add(ref.sha256);
      if (technical.schemaVersion !== 'archive-m2-problem24-student-ui-preview-v1'
          || technical.status !== 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING'
          || !/^[a-f0-9]{40}$/.test(technical.checkoutCommit || '')
          || !Array.isArray(technical.items) || technical.items.length !== 24
          || !Array.isArray(technical.servedFiles) || technical.servedFiles.length !== 98
          || new Set(technical.servedFiles.map(value => value.path)).size !== 98
          || !Array.isArray(technical.studentFontResources) || technical.studentFontResources.length !== 40)
        fail('SHADOW_LIVE_INVENTORY');
      const dynamic = new Set([METADATA]);
      for (const row of technical.items) {
        if (typeof row.sourceRef?.path !== 'string' || !row.sourceRef.path.startsWith('archive/exams/original/middle/m2/'))
          fail('SHADOW_LIVE_DYNAMIC_SCOPE');
        safe(root, row.sourceRef.path); dynamic.add(row.sourceRef.path);
      }
      for (const served of technical.servedFiles) {
        fiveRef(served);
        if (served.commit !== technical.checkoutCommit) fail('SHADOW_LIVE_CAPTURE_COMMIT');
        if (!dynamic.has(served.path)) add(served);
      }
      const fontIds = new Set();
      for (const font of technical.studentFontResources) {
        if (font.status !== 200 || font.commit !== technical.checkoutCommit || !/^[a-f0-9]{64}$/.test(font.resourceId || '')
            || fontIds.has(font.resourceId) || !['STYLESHEET', 'FONT'].includes(font.kind)) fail('SHADOW_LIVE_FONT');
        fontIds.add(font.resourceId);
        const exact = Object.fromEntries(['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'].map(key => [key, font[key]]));
        if (!technical.servedFiles.some(served => eq(fiveRef(served), exact))) fail('SHADOW_LIVE_FONT');
        add(exact);
      }
    }
  }
  const result = [];
  for (const [file, { raw, ref }] of [...staged].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    const full = safe(shadow, file);
    if (fs.existsSync(full)) {
      const current = fileRef(shadow, file);
      if (current.sha256 !== ref.sha256 || current.sizeBytes !== ref.bytes) fail(`SHADOW_LIVE_EXISTING_DRIFT:${file}`);
    } else {
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, raw, { flag: 'wx', mode: 0o600 });
    }
    result.push({ ...ref, headSha });
  }
  return result;
}

// Exact public metadata inputs for one unchanged issued Q5/Q12 request.
const SHADOW_M3_Q5_CURRENT_UI = {
  "requestId": "m3s2-e052-q5-complete-given-q12-native2-r1-20261116",
  "questionUid": "qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1",
  "companionUid": "qid_v1_1aac12db1a167973138e8dc51afcd5e0b19fcf73d4bb030ea406701acd0b8c4a",
  "sourceArchiveFile": "original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
  "sourceOrdinal": 5,
  "expectedQuestionCount": 25,
  "approvedRequest": {
    "path": "docs/operations/m3-e052-q5-complete-given-20261116/approved-request-v1.json",
    "bytes": 15405,
    "sha256": "e0211e0093661e782455ce631e8cb68fbd1fe9f65479e3a8b8162b8ba82eb317",
    "gitBlobSha1": "da393b3aff6d7c482da1c9f505ea4c46c27b28a8"
  },
  "priorRefs": [
    {
      "commit": "1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2",
      "path": "docs/operations/m3-e052-q5-complete-given-20261116/application-basis-v1.json",
      "gitBlobSha1": "f2a96c282b365405c05ae7ad78c04c710ed635bc",
      "sha256": "5c1cca89666988ba8e5f500c1eddac525d6dcc4f5ad01f17eb4c6e7bbf7a025a",
      "bytes": 9022
    },
    {
      "commit": "1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2",
      "path": "docs/operations/m3-e052-q5-complete-given-20261116/student-ui-technical-v1.json",
      "gitBlobSha1": "e3acc11099e73b7b8cf7d9d1f5d975a3acc10ccb",
      "sha256": "c96b586c177b4958620c658a0d135e04c3e66d66e4374a4e2b6941c847d44e2f",
      "bytes": 76825
    },
    {
      "commit": "1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2",
      "path": "docs/operations/m3-e052-q5-complete-given-20261116/student-ui-independent-v1.json",
      "gitBlobSha1": "ba2b198f2e8876f2667f29e12e595556714460c5",
      "sha256": "d3a1eaa44d2801af173f7721d634cc6788ecfad46428ac80693f9fccbb2bf95e",
      "bytes": 1736
    }
  ],
  "currentRefs": [
    {
      "commit": "e371e50ba8cb3e317c32cf1d1478b832bb0444c2",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/visual-current-reuse-v1.json",
      "bytes": 7372,
      "sha256": "f7b575307f2105c5e03a96b4b601e8c22953263723810843338a30c043a7ebf3",
      "gitBlobSha1": "c12986521a343b4d4ea3dac5fb5282617c5cc69f"
    },
    {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/technical-proof.json",
      "gitBlobSha1": "0cd74ab0be77a70badcabc655b811bb02cbb9209",
      "sha256": "9248d818ec7c44d3f8f4273526c4af1d70624385d185b63db3270e1324b2c279",
      "bytes": 76724
    },
    {
      "commit": "006e6455f69c092c3251d440daf0c4b07da7a469",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m3/current-four-display-equivalence-v1.json",
      "gitBlobSha1": "56ec9409ca900e94a46d6562e6e9189aedac7d43",
      "sha256": "07632bee16334ab68a80b3433db7b32daa145053b68156b68244b9145ebeaa7e",
      "bytes": 37970
    },
    {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/producer-frames.jsonl",
      "gitBlobSha1": "439b8fc9187f3907a63a16af5841251952024533",
      "sha256": "c822e4bac3fb2ba1a21657f89f838d35bedbe08820d418021ec75c72c666d628",
      "bytes": 197175
    },
    {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-desktop-tile-01.png",
      "gitBlobSha1": "9d96646282e97104a032c81c03451bda8794eb1b",
      "sha256": "600ad7c79c86889cc1f1bba376c929d67fc942aa495a08dcb77c2a48f612aa1f",
      "bytes": 28776
    },
    {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-mobile-tile-01.png",
      "gitBlobSha1": "a977c9c35a5b2a5bb4fd90c23ffbc16d30e9d908",
      "sha256": "d83399fdf70d554a7505310b038b490ca55730d962f040e83bbf2606e614ccab",
      "bytes": 30805
    }
  ],
  "extraServed": [
    {
      "commit": "48d18ccdc7eafffe3d1d8ae32e65a4dc23437502",
      "path": "archive/archive2-output-bar.css",
      "gitBlobSha1": "6e5899be049eed33d7a82c02e8eb22c8c43a9bec",
      "sha256": "a25a088c8a16a8401a210fa903808125baf5aa399e59242fe2bbb64ce94bb5c8",
      "bytes": 9673
    },
    {
      "commit": "48d18ccdc7eafffe3d1d8ae32e65a4dc23437502",
      "path": "archive/exam-display-title.js",
      "gitBlobSha1": "f669223144e179ec9e06855f8016e7ff88074864",
      "sha256": "619973f16351892792f831421726cc604b3ff99b4d341a616b63ec5347f76444",
      "bytes": 2358
    },
    {
      "commit": "48d18ccdc7eafffe3d1d8ae32e65a4dc23437502",
      "path": "archive/archive2-tokens.css",
      "gitBlobSha1": "e7866d0d24504a0ce770e700ef42cc5069276b43",
      "sha256": "2ea2008d63916cfe61a6f07cabad249f70ac818bdbc5599d7bd4efaddc8266e1",
      "bytes": 2241
    }
  ],
  "sourceRef": {
    "commit": "48d18ccdc7eafffe3d1d8ae32e65a4dc23437502",
    "path": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
    "gitBlobSha1": "82c627bacb59105e9bd3a5397d4828757308d587",
    "sha256": "996ba1f2538b060c96f6528fc90c62affa567285a6a24d2106051199f9a348d1",
    "bytes": 66658
  },
  "engineRef": {
    "commit": "48d18ccdc7eafffe3d1d8ae32e65a4dc23437502",
    "path": "archive/engine.html",
    "gitBlobSha1": "226342544e896cd6a6f35aa946947b89ef3c893e",
    "sha256": "671f89999fe07b0f5695bb088ef9d262d7d2da95947689117241bb6f3b633ce5",
    "bytes": 196085
  },
  "captureCommit": "48d18ccdc7eafffe3d1d8ae32e65a4dc23437502",
  "legacyEngineBlob": "905952ae39138e1f6dc0aa2d7c7c8a64403f527b"
};

// Render engine files may change after the capture (user decision 2026-11-18): their captured Git
// bytes are staged as is, and neither HEAD nor the working tree is compared with them.
const isRenderEngineFile = file => file === 'archive/engine.html' || file === 'archive/mixed_engine.html'
  || file === 'apmath/wrong_print_engine.html' || /^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(file)
  || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(file)
  || /^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(file);

// Current Q5 display evidence is deliberately absent from the immutable issued
// request. Authenticate that exact request and its original three evidence refs
// before following this one independently sealed display binding. This restores
// only missing readonly input bytes; the ordinary Native/registrar validation
// below still decides all approval, identity, source and current UI conditions.
export function hydrateM3Q5CurrentUiInputs({ root, shadow, headSha, requests }) {
  const p = SHADOW_M3_Q5_CURRENT_UI;
  if (!Array.isArray(requests)) fail('Q5_SHADOW_REQUESTS');
  const selected = requests.filter(row => row?.requestId === p.requestId);
  if (!selected.length) return [];
  if (selected.length !== 1) fail('Q5_SHADOW_AMBIGUOUS_REQUEST');
  root = path.resolve(root); shadow = path.resolve(shadow);
  for (const directory of [root, shadow]) {
    const stat = fs.lstatSync(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink() || fs.realpathSync(directory) !== directory)
      fail('Q5_SHADOW_ROOT');
  }
  if (root === shadow || root.startsWith(shadow + path.sep) || shadow.startsWith(root + path.sep)
      || !/^[a-f0-9]{40}$/.test(headSha || '') || git(root, 'rev-parse', 'HEAD').trim() !== headSha)
    fail('Q5_SHADOW_HEAD');
  const stable = value => JSON.stringify(value, (_, row) => row && typeof row === 'object' && !Array.isArray(row)
    ? Object.fromEntries(Object.keys(row).sort().map(key => [key, row[key]])) : row);
  const same = (a, b) => stable(a) === stable(b);
  const five = ref => {
    if (!objectKeys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'])
        || !/^[a-f0-9]{40}$/.test(ref.commit || '') || !/^[a-f0-9]{40}$/.test(ref.gitBlobSha1 || '')
        || !/^[a-f0-9]{64}$/.test(ref.sha256 || '') || !Number.isSafeInteger(ref.bytes)
        || ref.bytes < 1 || ref.bytes > 2 * 1024 * 1024) fail('Q5_SHADOW_REF');
    return ref;
  };
  const strictPath = (base, file, allowMissing = false) => {
    const full = safe(base, file);
    let cursor = base;
    const parts = file.split('/');
    for (let i = 0; i < parts.length; i++) {
      cursor = path.join(cursor, parts[i]);
      let stat;
      try { stat = fs.lstatSync(cursor); }
      catch (error) {
        if (error.code === 'ENOENT' && allowMissing) return full;
        fail('Q5_SHADOW_MISSING:' + file);
      }
      if (stat.isSymbolicLink()) fail('Q5_SHADOW_SYMLINK:' + file);
      if (i < parts.length - 1 ? !stat.isDirectory() : !stat.isFile()) fail('Q5_SHADOW_REGULAR:' + file);
    }
    return full;
  };
  const tree = (commit, file) => {
    safe(root, file);
    const entry = spawnSync('git', ['ls-tree', '-z', commit, '--', file], { cwd: root, encoding: 'utf8',
      env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, maxBuffer: 1024 * 1024 });
    const match = !entry.error && entry.status === 0 && /^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry.stdout);
    if (!match || match[2] !== file) fail('Q5_SHADOW_GIT_REGULAR:' + file);
    return match[1];
  };
  const observed = new Map(), ancestors = new Set();
  const readHead = (file, expected) => {
    const oid = tree(headSha, file), raw = gitBytes(root, headSha + ':' + file);
    if (expected && (oid !== expected.gitBlobSha1 || raw.length !== expected.bytes || sha(raw) !== expected.sha256))
      fail('Q5_SHADOW_HEAD_PIN:' + file);
    const full = strictPath(root, file), live = fs.readFileSync(full);
    if (live.length !== raw.length || sha(live) !== sha(raw)) fail('Q5_SHADOW_LIVE_PIN:' + file);
    observed.set(file, { sha256: sha(raw), bytes: raw.length });
    return raw;
  };
  const pinned = ref => {
    five(ref);
    if (!ancestors.has(ref.commit)) {
      const result = spawnSync('git', ['merge-base', '--is-ancestor', ref.commit, headSha], { cwd: root,
        env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, maxBuffer: 1024 * 1024 });
      if (result.error || result.status !== 0) fail('Q5_SHADOW_ANCESTOR');
      ancestors.add(ref.commit);
    }
    if (tree(ref.commit, ref.path) !== ref.gitBlobSha1) fail('Q5_SHADOW_IMMUTABLE_PIN:' + ref.path);
    if (isRenderEngineFile(ref.path)) {
      const captured = gitBytes(root, ref.commit + ':' + ref.path);
      if (captured.length !== ref.bytes || sha(captured) !== ref.sha256) fail('Q5_SHADOW_IMMUTABLE_PIN:' + ref.path);
      return captured;
    }
    return readHead(ref.path, ref);
  };
  // The issued request names these three exact publications. The original
  // Native reference contract authenticates their immutable bytes and current
  // live copies, but does not require their publication branch to be an ancestor.
  // Current display/source/renderer refs still use pinned() and its ancestry gate.
  const originalPrior = ref => {
    five(ref);
    if (!p.priorRefs.some(expected => same(ref, expected))) fail('Q5_SHADOW_ORIGINAL_REF');
    if (tree(ref.commit, ref.path) !== ref.gitBlobSha1) fail('Q5_SHADOW_IMMUTABLE_PIN:' + ref.path);
    return readHead(ref.path, ref);
  };
  const descriptor = selected[0];
  if (!flatInboxPath(descriptor.path)) fail('Q5_SHADOW_REQUEST_PATH');
  const requestRaw = readHead(descriptor.path), request = parsed(requestRaw.toString('utf8'));
  if (sha(requestRaw) !== descriptor.sha256 || requestRaw.length !== descriptor.sizeBytes
      || request.requestId !== p.requestId || descriptor.requestId !== p.requestId
      || request.schemaVersion !== NATIVE_REQUEST_SCHEMA || request.scope !== 'PARTIAL_UIDS'
      || request.sourceArchiveFile !== p.sourceArchiveFile || request.expectedQuestionCount !== p.expectedQuestionCount
      || !Array.isArray(descriptor.selectedItems)
      || !same([...descriptor.selectedItems].sort((a,b) => a.sourceOrdinal - b.sourceOrdinal),
        [{ questionUid: p.questionUid, sourceOrdinal: 5 }, { questionUid: p.companionUid, sourceOrdinal: 12 }]))
    fail('Q5_SHADOW_REQUEST');
  const approved = parsed(readHead(p.approvedRequest.path, p.approvedRequest).toString('utf8'));
  if (!same(request, approved)) fail('Q5_SHADOW_APPROVED_REQUEST_CHANGED');
  const item = request.items.find(row => row.questionUid === p.questionUid);
  const marker = item.sourceReview.q5CompleteGivenApplication;
  if (!objectKeys(marker, ['schemaVersion', 'applicationRef', 'technicalRef', 'visualRef'])
      || marker.schemaVersion !== 'archive-m3-e052-q5-complete-given-application-v1'
      || !same([marker.applicationRef, marker.technicalRef, marker.visualRef], p.priorRefs))
    fail('Q5_SHADOW_ORIGINAL_MARKER');
  for (const ref of p.priorRefs) {
    const short = { path: ref.path, sha256: ref.sha256 };
    if (![request.approval.evidenceRefs, item.evidenceRefs].every(refs =>
        refs.filter(row => row.path === ref.path).length === 1 && refs.some(row => same(row, short)))
        || !Array.isArray(descriptor.evidence)
        || descriptor.evidence.filter(row => row.path === ref.path).length !== 1
        || !descriptor.evidence.some(row => row.path === ref.path && row.sha256 === ref.sha256))
      fail('Q5_SHADOW_UNBOUND_ORIGINAL_EVIDENCE');
  }
  // Preserve the original old-renderer route. Unknown/new renderer editions may
  // not borrow this bounded current display bundle.
  const engineOid = tree(headSha, 'archive/engine.html');
  const currentRequested = p.currentRefs.slice(0, 2).some(ref => {
    const full = strictPath(root, ref.path, true);
    return fs.existsSync(full);
  });
  if (!currentRequested && engineOid === p.legacyEngineBlob) return [];
  const [basisRaw, priorRaw] = p.priorRefs.map(originalPrior);
  const basis = parsed(basisRaw.toString('utf8')), prior = parsed(priorRaw.toString('utf8'));
  const currentRaw = p.currentRefs.map(pinned);
  const visual = parsed(currentRaw[0].toString('utf8')), technical = parsed(currentRaw[1].toString('utf8'));
  if (visual.schemaVersion !== 'archive-independent-m3-e052-q5-current-ui-reuse-v1'
      || visual.scope !== 'EXACT_E052_Q5_COMPLETE_GIVEN_CURRENT_DISPLAY_ONLY'
      || visual.decision !== 'APPROVE_EXACT_STUDENT_UI'
      || !same(visual.priorTechnicalRef, marker.technicalRef) || !same(visual.priorVisualRef, marker.visualRef)
      || !same([visual.technicalRef, visual.displayEquivalenceRef, visual.currentProducerFramesRef, ...visual.artifactRefs],
        p.currentRefs.slice(1)) || visual.newNativeApproval !== 0 || visual.newMetadataApproval !== 0
      || visual.newMathematicalQa !== 0 || visual.currentFullLiveCodeFontAssetGuardsRequired !== true)
    fail('Q5_SHADOW_CURRENT_BINDING');
  const identity = value => [value.key, value.questionUid, value.sourceOrdinal, value.expectedBankCount];
  const noCommit = ref => Object.fromEntries(['path','gitBlobSha1','sha256','bytes'].map(key => [key, ref[key]]));
  if (basis.questionUid !== p.questionUid || basis.sourceOrdinal !== 5 || basis.expectedQuestionCount !== 25
      || technical.schemaVersion !== 'archive-m3-e052-q5-student-ui-preview-v1'
      || technical.status !== 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING' || technical.checkoutCommit !== p.captureCommit
      || technical.expectedLogicalCases !== 2 || technical.completedLogicalCases !== 2
      || !Array.isArray(prior.items) || prior.items.length !== 1 || !Array.isArray(technical.items) || technical.items.length !== 1
      || !same(identity(technical.items[0]), ['E052-Q5', p.questionUid, 5, 25])
      || !same(identity(prior.items[0]), identity(technical.items[0]))
      || !same(noCommit(prior.items[0].sourceRef), noCommit(technical.items[0].sourceRef))
      || !same(noCommit(prior.items[0].assetRef), noCommit(technical.items[0].assetRef))
      || !same(technical.items[0].sourceRef, p.sourceRef)
      || !same(noCommit(basis.sourceAfterRef), noCommit(p.sourceRef)))
    fail('Q5_SHADOW_CURRENT_SCOPE');
  pinned(p.sourceRef);
  if (request.expectedSourceBlobSha1 !== p.sourceRef.gitBlobSha1
      || descriptor.source?.path !== p.sourceRef.path || descriptor.source?.blobSha1 !== p.sourceRef.gitBlobSha1
      || descriptor.source?.sha256 !== p.sourceRef.sha256 || descriptor.source?.sizeBytes !== p.sourceRef.bytes)
    fail('Q5_SHADOW_SOURCE_BINDING');
  if (!Array.isArray(technical.servedFiles) || !Array.isArray(prior.servedFiles)
      || new Set(technical.servedFiles.map(ref => ref.path)).size !== technical.servedFiles.length
      || new Set(prior.servedFiles.map(ref => ref.path)).size !== prior.servedFiles.length)
    fail('Q5_SHADOW_SERVED_INVENTORY');
  const priorPaths = new Set(prior.servedFiles.map(ref => ref.path));
  const added = technical.servedFiles.filter(ref => !priorPaths.has(ref.path));
  if (!same(added.slice().sort((a,b) => a.path.localeCompare(b.path, 'en')),
      p.extraServed.slice().sort((a,b) => a.path.localeCompare(b.path, 'en'))))
    fail('Q5_SHADOW_NEW_SERVED_SCOPE');
  const staged = [...p.currentRefs, ...p.extraServed];
  const buffers = [...currentRaw, ...p.extraServed.map(ref => {
    if (ref.commit !== p.captureCommit || !technical.servedFiles.some(value => same(value, ref)))
      fail('Q5_SHADOW_UNDECLARED_SERVED_INPUT');
    return pinned(ref);
  })];
  if (staged.length !== 9 || new Set(staged.map(ref => ref.path)).size !== 9)
    fail('Q5_SHADOW_FIXED_NINE');
  const existing = [];
  for (const ref of staged) {
    const full = strictPath(shadow, ref.path, true), present = fs.existsSync(full);
    if (present) {
      const bytes = fs.readFileSync(strictPath(shadow, ref.path));
      if (bytes.length !== ref.bytes || sha(bytes) !== ref.sha256) fail('Q5_SHADOW_EXISTING_DRIFT:' + ref.path);
      const a = fs.statSync(full), b = fs.statSync(strictPath(root, ref.path));
      if (a.dev === b.dev && a.ino === b.ino) fail('Q5_SHADOW_SHARED_INODE:' + ref.path);
    }
    existing.push(present);
  }
  const assertObserved = () => {
    if (git(root, 'rev-parse', 'HEAD').trim() !== headSha) fail('Q5_SHADOW_HEAD_CHANGED');
    for (const [file, ref] of observed) {
      const bytes = fs.readFileSync(strictPath(root, file));
      if (bytes.length !== ref.bytes || sha(bytes) !== ref.sha256) fail('Q5_SHADOW_INPUT_CHANGED:' + file);
    }
  };
  assertObserved();
  for (let i = 0; i < staged.length; i++) if (!existing[i]) {
    const full = strictPath(shadow, staged[i].path, true);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, buffers[i], { flag: 'wx', mode: 0o600 });
  }
  assertObserved();
  return staged.map((ref, i) => ({ ...ref, headSha, existing: existing[i] }));
}

// Re-derive the *initial* official plan from the immutable Git input. A replay
// on the post-state returns plannedPaths:[] and cannot authenticate a new
// allowlist. This shadow has independent bytes; verify-local never writes its
// actual checkout, consumes inbox files or runs another catalog build.
// Repository inputs the registrars read from the shadow root (the request, source exam and evidence files are written separately).
// The type-judgment decision document is read by name from the registrar's own constant: a first registration refuses without it.
export const SHADOW_RESTORE_PATHS = ['archive/data', 'archive/assets', 'docs/rules/01_CANONICAL/taxonomy', TYPE_JUDGMENT_DECISION_DOCUMENT];

export function rederiveNativePlans({ root, requests, run = nativeCommand }) {
  if (!requests.length) return { plans: [], outputs: [] };
  const headSha = git(root, 'rev-parse', '--verify', 'HEAD').trim();
  const shadow = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pr-native-plan-'));
  try {
    nativeCommand('git', ['clone', '--quiet', '--shared', '--no-checkout', '--local', root, shadow], root);
    // Renderer/source reviews revalidate the live asset bytes, including assets
    // reached through an older receipt. Recreate that immutable input tree too;
    // never copy current worktree bytes or share mutable asset inodes.
    const restore = SHADOW_RESTORE_PATHS
      .filter(file => git(root, 'ls-tree', headSha, '--', file).trim());
    // Data plus assets can exceed the child-process memory buffer. Stream Git's
    // exact archive into a private temporary file, removed with this shadow.
    const snapshotPath = path.join(shadow, '.native-input-snapshot.tar');
    const snapshotFd = fs.openSync(snapshotPath, 'wx', 0o600);
    let tar;
    try {
      tar = spawnSync('git', ['archive', '--format=tar', headSha, '--', ...restore],
        { cwd: root, stdio: ['ignore', snapshotFd, 'pipe'], maxBuffer: 1024 * 1024 });
    } finally { fs.closeSync(snapshotFd); }
    if (tar.error || tar.status !== 0) fail('SHADOW_GIT_SNAPSHOT_FAILED');
    const extracted = spawnSync('tar', ['-xf', snapshotPath, '-C', shadow], { maxBuffer: 1024 * 1024 });
    if (extracted.error || extracted.status !== 0) fail('SHADOW_EXTRACT_FAILED');
    fs.unlinkSync(snapshotPath);
    // The archive holds the metadata shards, not the ignored assembled file the registrars read and write: assemble it in the shadow.
    if (hasShards(shadow)) assembleMetadataFile(shadow);
    const inputs = sorted([...requests.flatMap(r => [r.path, r.source.path, ...r.evidence.map(e => e.path)]),
      ...referencedNativeHeadInputs(root, headSha, requests)]);
    const attrs = git(root, 'ls-tree', '-r', '--name-only', headSha).split('\n').filter(p => path.posix.basename(p) === '.gitattributes');
    for (const file of sorted([...inputs, ...attrs])) {
      const full = safe(shadow, file);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, file === METADATA ? questionMetadataBytesAt(root, headSha) : gitBytes(root, `${headSha}:${file}`));
    }
    hydrateFixedNativeServedInputs({ root, shadow, headSha: git(root, 'rev-parse', 'HEAD').trim(), requests });
    hydrateM3Q5CurrentUiInputs({ root, shadow, headSha, requests });
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
