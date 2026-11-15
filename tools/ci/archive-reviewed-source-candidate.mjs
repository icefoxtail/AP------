import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { REVIEWED_META_VALUE_FIELDS } from '../../archive/tools/meta-foundation/reviewed-meta-value-fields.mjs';
import { createQuestionIdentityResolver } from '../../archive/tools/intelligence/question-identity-contract.mjs';

export const CANDIDATE_ENVELOPE = '.archive-source-metadata/candidate.json';
export const CANDIDATE_SCHEMA = 'archive-reviewed-source-candidate-input-v1';
const SHA1 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const ID = /^[a-z0-9][a-z0-9-]{5,80}$/;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const REQUEST_SCHEMA = 'archive-reviewed-exam-meta-register-request-v2';
const MANIFEST_SCHEMA = 'archive-reviewed-source-metadata-materialization-v1';
const UID = /^qid_v1_[0-9a-f]{64}$/;
const INBOX = /^\.archive-meta-register\/inbox\/[A-Za-z0-9][A-Za-z0-9_.-]*\.json$/;
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const PARENT_SCHEMA = 'archive-meta-pipeline-parent-label-evidence-v1';
const NATIVE_SCHEMAS = new Set(['m2-s2-meta-review-v1', 'm3-s2-complete-semantic-review-v1']);
const PROPOSAL_SCHEMAS = new Set(['archive-independent-native-proposal-disposition-v1',
  'archive-reviewed-registry-change-proposal-v1', 'archive-independent-proposal-condition-boundary-finalization-v1',
  'archive-m3s2-condition-definition-proposal-for-independent-review-v1']);
const RENDERER_SCHEMAS = new Set(['archive-reviewed-renderer-continuity-evidence-v1',
  'archive-independent-narrow-renderer-review-v1', 'archive-independent-current-figure-review-v1',
  'archive-independent-current-renderer-review-v2',
  'archive-independent-current-renderer-review-v3',
  'archive-independent-prior-solution-renderer-review-v1',
  'archive-m3-narrow-current-figure-review-v1', 'archive-narrow-solution-renderer-correction-independent-review-v1']);
const META_FIELDS = new Set(REVIEWED_META_VALUE_FIELDS);
const equal = isDeepStrictEqual;
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const text = (v, max = 4096) => typeof v === 'string' && v.length > 0 && v.length <= max && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v);
const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor', 'question', 'questions',
  'questiontext', 'questionhtml', 'stem', 'choices', 'options', 'answer', 'answers', 'correctanswer',
  'solution', 'solutiontext', 'solutionhtml', 'explanation', 'prompt', 'currentquestion', 'sourcecode',
  'sourcebody', 'rawsource', 'rawtext', 'content', 'html', 'svg', 'base64', 'credentials', 'password', 'token', 'secret']);

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = code => { throw new Error(`SOURCE_METADATA_CANDIDATE:${code}`); };
const requireThat = (condition, code) => { if (!condition) fail(code); };
const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x);

function exactKeys(value, required, optional = []) {
  requireThat(plain(value), 'OBJECT_REQUIRED');
  requireThat(required.every(key => Object.hasOwn(value, key)) &&
    Object.keys(value).every(key => required.includes(key) || optional.includes(key)), 'UNKNOWN_OR_MISSING_FIELD');
}

function safePath(value) {
  requireThat(typeof value === 'string' && value.length > 0 && value.length <= 500 &&
    value === value.normalize('NFC') && !/[\\\x00-\x1f\x7f]/.test(value) &&
    !path.posix.isAbsolute(value) && !value.split('/').some(part => !part || part === '.' || part === '..' || part === '.git'),
  'UNSAFE_PATH');
  return value;
}

export function allowedMetadataPath(value) {
  safePath(value);
  if (!value.endsWith('.json') || value.endsWith('.source-review-binding.json')) return false;
  return /^\.archive-meta-register\/(?:inbox|evidence)\/[a-zA-Z0-9_./-]+\.json$/.test(value) ||
    /^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[^/]+\.parent-labels\.json$/.test(value) ||
    /^docs\/operations\/reviewed-exam-meta\/v1\/[^/]+\.(?:parent-labels|source-metadata-transport|review)\.json$/.test(value) ||
    /^docs\/operations\/m2(?:s[12]|-s[12])-[a-z0-9-]+\/[a-zA-Z0-9_.\/-]+\.json$/.test(value);
}

function assertMetadataOnly(value, depth = 0, trail = [], document = value) {
  requireThat(depth <= 40, 'JSON_DEPTH');
  if (Array.isArray(value)) {
    requireThat(value.length <= 100000, 'JSON_ARRAY_SIZE');
    value.forEach((item, index) => assertMetadataOnly(item, depth + 1, [...trail, index], document));
  } else if (plain(value)) {
    for (const [key, child] of Object.entries(value)) {
      const nativeReadFlag = document.schemaVersion === 'm3-s2-complete-semantic-review-v1' &&
        trail.length === 3 && trail[0] === 'items' && Number.isSafeInteger(trail[1]) && trail[2] === 'evidenceRead' &&
        ['stem', 'choices', 'answer'].includes(key) && typeof child === 'boolean';
      const publicRendererObservation = document.schemaVersion === 'archive-independent-current-figure-review-v1' &&
        trail.length === 3 && trail[0] === 'rows' && Number.isSafeInteger(trail[1]) && trail[2] === 'directVisualReview' &&
        key === 'solution' && text(child, 1000) && !/<\/?(?:script|svg|img|iframe|html|body|div|span)\b/i.test(child);
      requireThat((!forbiddenKeys.has(key.toLowerCase().replace(/[-_ ]/g, '')) || nativeReadFlag || publicRendererObservation) &&
        !['__proto__', 'prototype', 'constructor'].includes(key), 'RAW_OR_UNSAFE_METADATA_FIELD');
      assertMetadataOnly(child, depth + 1, [...trail, key], document);
    }
  } else {
    requireThat(value === null || ['string', 'number', 'boolean'].includes(typeof value), 'JSON_VALUE');
    if (typeof value === 'string') requireThat(value.length <= 100000, 'JSON_STRING_SIZE');
  }
}

// JSON.parse discards earlier duplicate keys. Do not let discarded bytes carry
// undeclared fields or data into a supposedly closed metadata input.
function assertUniqueJsonKeys(source) {
  const stack = [];
  for (let i = 0; i < source.length; i++) {
    const char = source[i], top = stack.at(-1);
    if (char === '"') {
      const start = i++;
      for (; i < source.length; i++) {
        if (source[i] === '\\') i++;
        else if (source[i] === '"') break;
      }
      if (top?.keys && top.keyExpected) {
        const key = JSON.parse(source.slice(start, i + 1));
        requireThat(!top.keys.has(key), 'DUPLICATE_JSON_KEY');
        top.keys.add(key); top.keyExpected = false;
      }
    } else if (char === '{') stack.push({ keys: new Set(), keyExpected: true });
    else if (char === '[') stack.push({});
    else if (char === '}' || char === ']') stack.pop();
    else if (char === ',' && top?.keys) top.keyExpected = true;
  }
}

function git(root, args, options = {}) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0', ...(options.env || {}) },
    stdio: ['pipe', 'pipe', 'pipe'], ...options,
  });
}

function entry(root, commit, rel, required = true) {
  safePath(rel);
  const raw = git(root, ['ls-tree', '-z', commit, '--', rel]);
  if (!raw) { requireThat(!required, 'INPUT_FILE_MISSING'); return null; }
  const rows = raw.split('\0').filter(Boolean);
  requireThat(rows.length === 1, 'INPUT_TREE_AMBIGUOUS');
  const match = /^(\d+) (\w+) ([0-9a-f]{40})\t(.*)$/s.exec(rows[0]);
  requireThat(match && match[1] === '100644' && match[2] === 'blob' && match[4] === rel, 'INPUT_FILE_MODE');
  return { path: rel, blobSha1: match[3] };
}

function readJson(root, commit, rel, { metadataOnly = true, maxBytes = MAX_FILE_BYTES } = {}) {
  const item = entry(root, commit, rel);
  const size = Number(git(root, ['cat-file', '-s', item.blobSha1]).trim());
  requireThat(Number.isSafeInteger(size) && size > 0 && size <= maxBytes, 'INPUT_SIZE');
  const bytes = git(root, ['cat-file', 'blob', item.blobSha1], { encoding: null, maxBuffer: maxBytes + 1024 });
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch { fail('INPUT_JSON'); }
  requireThat(Buffer.from(bytes.toString('utf8')).equals(bytes), 'INPUT_UTF8');
  if (metadataOnly) {
    try { assertUniqueJsonKeys(bytes.toString('utf8')); assertMetadataOnly(value); }
    catch (error) { error.message += `:${rel}`; throw error; }
  }
  const publicBlobReuseOnly = value?.schemaVersion === 'archive-independent-current-figure-review-v1' && Array.isArray(value.rows) &&
    value.rows.some(row => Object.hasOwn(row.directVisualReview || {}, 'solution'));
  return { ...item, sha256: digest(bytes), bytes, value, publicBlobReuseOnly };
}

function verifiedRef(ref, file) {
  exactKeys(ref, ['path', 'blobSha1', 'sha256']);
  requireThat(SHA1.test(ref.blobSha1) && SHA256.test(ref.sha256) &&
    ref.path === file.path && ref.blobSha1 === file.blobSha1 && ref.sha256 === file.sha256, 'INPUT_REF_MISMATCH');
}

function evidenceRef(ref) {
  exactKeys(ref, ['path', 'sha256']);
  safePath(ref.path);
  requireThat(ref.path.endsWith('.json') && SHA256.test(ref.sha256), 'EVIDENCE_REF');
}

function evidenceRefs(refs) {
  requireThat(Array.isArray(refs) && refs.length > 0 && refs.length <= 300, 'EVIDENCE_REFS');
  refs.forEach(evidenceRef);
  requireThat(new Set(refs.map(r => r.path)).size === refs.length, 'DUPLICATE_EVIDENCE_REF');
}

function valuePatch(value, { before = false } = {}) {
  requireThat(plain(value), 'METADATA_PATCH');
  for (const [field, v] of Object.entries(value)) {
    requireThat(META_FIELDS.has(field), 'UNKNOWN_METADATA_FIELD');
    if (v === null) continue;
    if (before && v === '' && !['sourceFingerprint', 'contentFingerprint', 'crossConceptKeys', 'conditionKeys',
      'secondaryConceptKeys', 'difficultyBucket', 'defaultSelectable'].includes(field)) continue;
    if (['crossConceptKeys', 'conditionKeys', 'secondaryConceptKeys'].includes(field)) {
      requireThat(Array.isArray(v) && v.length <= 100 && v.every(x => text(x, 160)) && new Set(v).size === v.length, 'METADATA_ARRAY');
    } else if (field === 'rpmPrimaryPath' && plain(v)) {
      exactKeys(v, ['majorUnit', 'midUnit', 'l3', 'l4'], ['curriculum', 'scope']);
      requireThat(Object.values(v).every(x => text(x, 160)), 'RPM_PATH_VALUES');
    } else if (field === 'difficultyBucket') {
      requireThat(Number.isSafeInteger(v) && v >= 0 && v <= 9, 'METADATA_BUCKET');
    } else if (field === 'defaultSelectable') {
      requireThat(typeof v === 'boolean', 'METADATA_BOOLEAN');
    } else {
      requireThat(text(v, ['primaryMethod', 'decisiveStep', 'integrationReason'].includes(field) ? 4096 : 512), 'METADATA_SCALAR');
      if (['sourceFingerprint', 'contentFingerprint'].includes(field)) requireThat(SHA256.test(v), 'METADATA_FINGERPRINT');
    }
  }
}

// This is a transport graph, not an approval engine. Newly authored inputs have
// closed shapes. Complex review documents are accepted only as exact copies of
// recognized immutable evidence selected by the typed registration request.
// Historical refs inside those copies are not arbitrary traversal instructions.
function validateClosedInputGraph({ root, baseCommit, inputCommit, envelope, manifestFile, files }) {
  const manifest = manifestFile.value, reached = new Set([manifestFile.path]), cache = new Map(), roles = new Map(), commits = new Set();
  const immutable = (commit, rel, options) => {
    requireThat(SHA1.test(commit || '') && commit !== inputCommit, 'EVIDENCE_COMMIT');
    if (!commits.has(commit)) {
      requireThat(git(root, ['cat-file', '-t', commit]).trim() === 'commit', 'EVIDENCE_COMMIT');
      commits.add(commit);
    }
    const key = `${commit}:${rel}:${options?.metadataOnly === false ? 'base' : 'metadata'}`;
    if (!cache.has(key)) cache.set(key, readJson(root, commit, rel, options));
    return cache.get(key);
  };
  const evidence = ref => {
    evidenceRef(ref);
    // Existing base evidence (notably issued receipts) is read in place. The
    // uploaded-payload filter applies to every new input, not to historical
    // metadata nested in an already published receipt that is never recopied.
    const file = files.get(ref.path) || immutable(baseCommit, ref.path, { metadataOnly: false });
    requireThat(file.sha256 === ref.sha256, 'EVIDENCE_HASH');
    if (files.has(file.path)) reached.add(file.path);
    return file;
  };
  const role = (file, kind) => {
    requireThat(!roles.has(file.path) || roles.get(file.path) === kind, 'EVIDENCE_ROLE_CONFLICT');
    roles.set(file.path, kind);
    return file;
  };
  const copy = (ref, commit, publicPath, schemas, kind) => {
    const file = evidence(ref), original = immutable(commit, safePath(publicPath));
    requireThat(file.bytes.equals(original.bytes), 'IMMUTABLE_EVIDENCE_MISMATCH');
    requireThat(schemas.has(file.value.schemaVersion), 'UNRECOGNIZED_EVIDENCE_SCHEMA');
    file.publicReuse = { commit, path: publicPath, blobSha1: original.blobSha1, sha256: original.sha256 };
    return role(file, kind);
  };
  const bound = (ref, request, item) => {
    for (const refs of [request.approval.evidenceRefs, item.evidenceRefs])
      requireThat(refs.some(r => equal(r, ref)), 'TYPED_EVIDENCE_NOT_DECLARED');
  };
  const one = (rows, item, ordinalKey = 'sourceOrdinal') => {
    requireThat(Array.isArray(rows), 'EVIDENCE_SELECTED_ROWS');
    const found = rows.filter(r => r.questionUid === item.questionUid && r[ordinalKey] === item.sourceOrdinal);
    requireThat(found.length === 1, 'EVIDENCE_SELECTED_UID');
    return found[0];
  };
  exactKeys(manifest, ['schemaVersion', 'materializationId', 'baseCommit', 'identityRef', 'requestRefs', 'outputScope', 'files'], ['transportProfile']);
  requireThat(manifest.schemaVersion === MANIFEST_SCHEMA &&
    (manifest.transportProfile === undefined || manifest.transportProfile === 'M3_REVIEWED_METADATA_V1'), 'MANIFEST_SCHEMA');
  exactKeys(manifest.identityRef, ['path', 'blobSha1', 'sha256']);
  requireThat(manifest.identityRef.path === 'archive/data/question_identity_map.json', 'IDENTITY_PATH');
  const identity = immutable(baseCommit, manifest.identityRef.path, { metadataOnly: false, maxBytes: 64 * 1024 * 1024 });
  verifiedRef(manifest.identityRef, identity);
  requireThat(identity.value.schemaVersion === 'question-identity-map-v1' && Array.isArray(identity.value.records), 'IDENTITY_SCHEMA');
  const resolver = createQuestionIdentityResolver(identity.value);
  requireThat(Array.isArray(manifest.files) && manifest.files.length > 0 && manifest.files.length <= 100 &&
    Array.isArray(manifest.outputScope) && equal([...manifest.outputScope].sort(), manifest.files.map(f => f.path).sort()), 'MANIFEST_SCOPE');
  const bySource = new Map();
  for (const file of manifest.files) {
    exactKeys(file, ['path', 'before', 'after', 'expectedQuestionCount', 'changes']);
    safePath(file.path);
    requireThat(/^archive\/exams\/original\/middle\/m[23]\/(?:2mid|2final)\/[^/]+\.js$/u.test(file.path) &&
      !bySource.has(file.path) && Number.isSafeInteger(file.expectedQuestionCount) && file.expectedQuestionCount > 0 &&
      file.expectedQuestionCount <= 1000 && Array.isArray(file.changes) && file.changes.length > 0, 'MANIFEST_FILE');
    for (const pair of [file.before, file.after]) {
      exactKeys(pair, ['blobSha1', 'sha256']);
      requireThat(SHA1.test(pair.blobSha1) && SHA256.test(pair.sha256), 'MANIFEST_SOURCE_HASH');
    }
    for (const change of file.changes) {
      exactKeys(change, ['questionUid', 'sourceOrdinal', 'requestIndex', 'metadataFields']);
      requireThat(UID.test(change.questionUid) && Number.isSafeInteger(change.sourceOrdinal) && change.sourceOrdinal >= 1 &&
        change.sourceOrdinal <= file.expectedQuestionCount && Number.isSafeInteger(change.requestIndex) && change.requestIndex >= 0 &&
        Array.isArray(change.metadataFields) && change.metadataFields.length > 0, 'MANIFEST_CHANGE');
      for (const field of change.metadataFields) {
        exactKeys(field, ['field', 'beforePresent', 'afterPresent', 'before', 'after']);
        requireThat(typeof field.field === 'string' && typeof field.beforePresent === 'boolean' && field.afterPresent === true, 'MANIFEST_FIELD');
      }
    }
    const rows = identity.value.records.filter(r => r.sourceArchiveFile === file.path.slice('archive/exams/'.length));
    requireThat(rows.length === file.expectedQuestionCount && new Set(rows.map(r => r.sourceOrdinal)).size === rows.length &&
      rows.every(r => Number.isSafeInteger(r.sourceOrdinal) && r.sourceOrdinal >= 1 && r.sourceOrdinal <= rows.length), 'IDENTITY_DENOMINATOR');
    bySource.set(file.path, file);
  }
  requireThat(Array.isArray(manifest.requestRefs) && manifest.requestRefs.length > 0 && manifest.requestRefs.length <= 100, 'REQUEST_REFS');
  const preservationRefs = envelope.preservationRequestRefs || [];
  requireThat(Array.isArray(preservationRefs) && preservationRefs.length <= 100, 'PRESERVATION_REQUEST_REFS');
  const requestPaths = new Set(), requestIds = new Set(), selected = new Set(), requests = [];
  for (const [preservation, refs] of [[false, manifest.requestRefs], [true, preservationRefs]]) {
    for (const ref of refs) {
      requireThat(plain(ref) && INBOX.test(ref.path || '') && !requestPaths.has(ref.path), 'DECLARED_REQUEST_PATH');
      const file = files.get(ref.path);
      requireThat(file, 'REQUEST_NOT_INPUT'); verifiedRef(ref, file);
      reached.add(file.path); role(file, 'request'); requestPaths.add(file.path);
      const request = file.value;
      exactKeys(request, ['schemaVersion', 'requestId', 'sourceArchiveFile', 'expectedQuestionCount', 'expectedSourceBlobSha1', 'approval', 'items', 'registryChanges'], ['scope', 'examUid']);
      requireThat(request.schemaVersion === REQUEST_SCHEMA && text(request.requestId, 120) && /^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(request.requestId) &&
        !requestIds.has(request.requestId) && [undefined, 'PARTIAL_UIDS'].includes(request.scope), 'REQUEST_SCHEMA_SCOPE');
      requestIds.add(request.requestId);
      if (request.examUid !== undefined) requireThat(text(request.examUid, 160), 'EXAM_UID');
      const source = bySource.get(`archive/exams/${request.sourceArchiveFile}`);
      requireThat(source && request.expectedQuestionCount === source.expectedQuestionCount &&
        request.expectedSourceBlobSha1 === source.after.blobSha1, 'REQUEST_AFTER_SOURCE_BLOB');
      exactKeys(request.approval, ['type', 'metadataReviewed', 'approvedBy', 'evidenceRefs'], preservation ? ['sourceRebind'] : []);
      requireThat(request.approval.type === 'FINAL_QA' && request.approval.metadataReviewed === true && text(request.approval.approvedBy, 160), 'FINAL_QA_REQUEST');
      evidenceRefs(request.approval.evidenceRefs);
      requireThat(Array.isArray(request.registryChanges) && request.registryChanges.length <= 100 &&
        Array.isArray(request.items) && request.items.length > 0 && request.items.length <= source.expectedQuestionCount &&
        (request.scope === 'PARTIAL_UIDS' || request.items.length === source.expectedQuestionCount), 'REQUEST_SELECTED_DENOMINATOR');
      const ordinals = new Set();
      for (const item of request.items) {
        exactKeys(item, ['questionUid', 'sourceOrdinal', 'before', 'after', 'reason', 'evidenceRefs'],
          preservation ? [] : ['identityBefore', 'sourceReview', 'basicScopeParentRef']);
        requireThat(UID.test(item.questionUid) && !selected.has(item.questionUid) && Number.isSafeInteger(item.sourceOrdinal) &&
          item.sourceOrdinal >= 1 && item.sourceOrdinal <= source.expectedQuestionCount && !ordinals.has(item.sourceOrdinal) && text(item.reason), 'REQUEST_SELECTED_UID');
        selected.add(item.questionUid); ordinals.add(item.sourceOrdinal);
        for (const lookup of [{ questionUid: item.questionUid }, { sourceArchiveFile: request.sourceArchiveFile, sourceOrdinal: item.sourceOrdinal }]) {
          const result = resolver.resolve(lookup);
          requireThat(['RESOLVED_CANONICAL_UID', 'RESOLVED_SOURCE_ORDINAL'].includes(result.status) && result.questionUid === item.questionUid &&
            result.sourceArchiveFile === request.sourceArchiveFile && result.sourceOrdinal === item.sourceOrdinal, 'REQUEST_IDENTITY_JOIN');
        }
        valuePatch(item.before, { before: true }); valuePatch(item.after); evidenceRefs(item.evidenceRefs);
        requireThat(item.evidenceRefs.every(r => request.approval.evidenceRefs.some(a => equal(a, r))), 'ITEM_EVIDENCE_NOT_APPROVAL');
        if (preservation) requireThat(Object.keys(item.before).length === 0 && Object.keys(item.after).length === 0, 'PRESERVATION_VALUES');
        else {
          requireThat(plain(item.sourceReview), 'NATIVE_SOURCE_REVIEW_REQUIRED');
          if (item.identityBefore !== undefined) {
            exactKeys(item.identityBefore, ['sourceFingerprint']);
            requireThat(SHA256.test(item.identityBefore.sourceFingerprint), 'IDENTITY_BEFORE');
          }
        }
      }
      requests.push({ file, request, source, preservation, proposalCommits: new Set(), rendererCommits: new Set() });
    }
  }
  const materializationRequests = requests.filter(r => !r.preservation), used = new Set(), changedItems = new Map();
  for (const source of bySource.values()) for (const change of source.changes) {
    const ctx = materializationRequests[change.requestIndex];
    requireThat(ctx && ctx.source === source && ctx.request.items.some(i => i.questionUid === change.questionUid && i.sourceOrdinal === change.sourceOrdinal), 'MATERIALIZATION_REQUEST_BINDING');
    if (!changedItems.has(ctx)) changedItems.set(ctx, new Set());
    const key = `${change.questionUid}:${change.sourceOrdinal}`;
    requireThat(!changedItems.get(ctx).has(key), 'DUPLICATE_MATERIALIZATION_ITEM');
    changedItems.get(ctx).add(key);
    used.add(change.requestIndex);
  }
  requireThat(used.size === materializationRequests.length, 'UNUSED_MATERIALIZATION_REQUEST');
  for (const ctx of materializationRequests)
    requireThat(ctx.request.items.every(item => changedItems.get(ctx)?.has(`${item.questionUid}:${item.sourceOrdinal}`)) &&
      ctx.request.items.length === changedItems.get(ctx)?.size, 'UNUSED_MATERIALIZATION_REQUEST_ITEM');

  function parent(ref, request, item) {
    bound(ref, request, item);
    const file = evidence(ref), doc = file.value;
    requireThat(ref.path.startsWith(RECEIPTS) && ref.path.endsWith('.parent-labels.json'), 'PARENT_EVIDENCE_PATH');
    exactKeys(doc, ['schemaVersion', 'sourcePath', 'sourceSha256', 'records']);
    requireThat(doc.schemaVersion === PARENT_SCHEMA && doc.sourcePath === 'archive/data/basic-scope-parent-links.json' &&
      SHA256.test(doc.sourceSha256), 'PARENT_EVIDENCE_SCHEMA');
    const original = immutable(baseCommit, doc.sourcePath, { metadataOnly: false });
    requireThat(original.sha256 === doc.sourceSha256 && Array.isArray(original.value.records), 'PARENT_SOURCE_HASH');
    requireThat(Array.isArray(doc.records) && doc.records.length > 0 && doc.records.length <= 1000, 'PARENT_RECORDS');
    const keys = ['grade', 'curriculumKey', 'courseKey', 'standardUnitKey', 'subUnitKey', 'L1', 'L2'];
    for (const row of doc.records) {
      exactKeys(row, keys);
      requireThat(keys.every(k => text(row[k], 160)) && original.value.records.some(r => equal(r, row)), 'PARENT_RECORD_NOT_CURRENT_BASE');
    }
    role(file, 'parent');
  }
  for (const ctx of requests) {
    const { request, preservation } = ctx;
    if (preservation) {
      exactKeys(request.approval.sourceRebind, ['priorReceiptRef']);
      const ref = request.approval.sourceRebind.priorReceiptRef; evidenceRef(ref);
      requireThat(ref.path.startsWith(RECEIPTS) && !files.has(ref.path) && request.registryChanges.length === 0, 'PRESERVATION_PRIOR_BASE_ONLY');
      const file = evidence(ref), prior = file.value;
      requireThat(prior.schemaVersion === 'archive-reviewed-exam-meta-registration-v2' && prior.approval?.type === 'FINAL_QA' &&
        prior.sourceArchiveFile === request.sourceArchiveFile && (prior.expectedQuestionCount ?? prior.totalQuestions) === request.expectedQuestionCount &&
        Array.isArray(prior.appliedRecords) && prior.appliedRecords.length === request.items.length &&
        prior.appliedRecords.every(r => r.sourceArchiveFile === request.sourceArchiveFile && request.items.some(i => i.questionUid === r.questionUid && i.sourceOrdinal === r.sourceOrdinal)),
      'PRESERVATION_PRIOR_SCOPE');
      requireThat(request.approval.evidenceRefs.length === 1 && equal(request.approval.evidenceRefs[0], ref), 'PRESERVATION_EVIDENCE');
      for (const item of request.items) bound(ref, request, item);
      role(file, 'prior-receipt');
      continue;
    }
    for (const item of request.items) {
      const spec = item.sourceReview;
      exactKeys(spec, ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef'], ['proposalFinalization', 'rendererProof']);
      requireThat(spec.schemaVersion === 'archive-reviewed-source-reassessment-v1' && spec.reviewPath.endsWith('.json') &&
        !(spec.proposalFinalization && spec.rendererProof), 'SOURCE_REVIEW_SCOPE');
      bound(spec.reviewRef, request, item);
      const native = copy(spec.reviewRef, spec.reviewCommit, spec.reviewPath, NATIVE_SCHEMAS, 'native').value;
      const m3 = native.schemaVersion === 'm3-s2-complete-semantic-review-v1';
      requireThat(native.sourceArchiveFile === request.sourceArchiveFile &&
        request.sourceArchiveFile.startsWith(`original/middle/${m3 ? 'm3' : 'm2'}/`) &&
        (m3 ? native.questionCount : native.reviewedQuestionCount) === request.expectedQuestionCount, 'NATIVE_SOURCE_DENOMINATOR');
      one(native.items, item, m3 ? 'ordinal' : 'sourceOrdinal');
      if (item.basicScopeParentRef) parent(item.basicScopeParentRef, request, item);
      if (spec.proposalFinalization) {
        const p = spec.proposalFinalization;
        exactKeys(p, ['schemaVersion', 'finalizationCommit', 'finalizationRef', 'proposalSelections']);
        requireThat(p.schemaVersion === 'archive-native-proposal-finalization-v2' && Array.isArray(p.proposalSelections) && p.proposalSelections.length > 0, 'PROPOSAL_SPEC');
        for (const selection of p.proposalSelections) {
          exactKeys(selection, ['documentRef', 'index', 'proposalSha256', 'questionUid', 'sourceOrdinal'], ['proposalId']); evidenceRef(selection.documentRef);
          requireThat(Number.isSafeInteger(selection.index) && selection.index >= 0 && SHA256.test(selection.proposalSha256) &&
            selection.questionUid === item.questionUid && selection.sourceOrdinal === item.sourceOrdinal, 'PROPOSAL_SELECTED_UID');
          // The original proposal is a Git-only edge; it is not uploaded or
          // recursively expanded into the candidate input graph.
          const document = immutable(spec.reviewCommit, selection.documentRef.path, { metadataOnly: false });
          requireThat(document.sha256 === selection.documentRef.sha256, 'NATIVE_PROPOSAL_HASH');
          const proposals = Array.isArray(document.value) ? document.value : document.value.proposals;
          const proposal = Array.isArray(proposals) ? proposals[selection.index] : undefined;
          requireThat(plain(proposal) && digest(stable(proposal)) === selection.proposalSha256 &&
            selection.proposalId === (proposal.id ?? proposal.proposalId), 'NATIVE_PROPOSAL_SELECTION');
        }
        bound(p.finalizationRef, request, item);
        const proof = copy(p.finalizationRef, p.finalizationCommit, p.finalizationRef.path,
          new Set(['archive-independent-native-proposal-disposition-v1']), 'proposal').value;
        ctx.proposalCommits.add(p.finalizationCommit);
        const app = one(proof.applications, item);
        if (app.independentReviewRef) {
          bound(app.independentReviewRef, request, item);
          copy(app.independentReviewRef, p.finalizationCommit, app.independentReviewRef.path,
            new Set(['archive-independent-proposal-condition-boundary-finalization-v1']), 'proposal');
        }
        requireThat(app.authorDraftRef === undefined && app.registryProposalRef === undefined, 'UNSUPPORTED_PROPOSAL_EVIDENCE_EDGE');
      }
      if (spec.rendererProof) {
        const r = spec.rendererProof;
        exactKeys(r, ['schemaVersion', 'reviewCommit', 'reviewRef']);
        requireThat(r.schemaVersion === 'archive-reviewed-current-renderer-continuity-v1' && request.scope === 'PARTIAL_UIDS' && m3, 'RENDERER_SPEC');
        bound(r.reviewRef, request, item);
        const proof = copy(r.reviewRef, r.reviewCommit, r.reviewRef.path,
          new Set(['archive-reviewed-renderer-continuity-evidence-v1']), 'renderer').value;
        requireThat(proof.sourceArchiveFile === request.sourceArchiveFile && proof.expectedQuestionCount === request.expectedQuestionCount, 'RENDERER_SOURCE_DENOMINATOR');
        const row = one(proof.items, item);
        bound(row.independentReviewRef, request, item);
        const independent = copy(row.independentReviewRef, r.reviewCommit, row.independentReviewRef.path, RENDERER_SCHEMAS, 'renderer').value;
        requireThat(independent.schemaVersion !== 'archive-independent-prior-solution-renderer-review-v1',
          'PRIOR_RENDERER_REQUIRES_V3_LINK');
        if (independent.schemaVersion === 'archive-independent-current-renderer-review-v3') {
          const selected = one(independent.rows, item);
          if (selected.prefigureRendererReviewRef !== undefined) {
            const priorRef = selected.prefigureRendererReviewRef;
            bound(priorRef, request, item);
            const prior = copy(priorRef, r.reviewCommit, priorRef.path,
              new Set(['archive-independent-prior-solution-renderer-review-v1']), 'renderer').value;
            requireThat(prior.questionUid === item.questionUid && prior.sourceOrdinal === item.sourceOrdinal,
              'PRIOR_RENDERER_SELECTED_UID');
          }
        }
        ctx.rendererCommits.add(r.reviewCommit);
      }
    }
  }
  // Explicit registrar approval/item/registry evidenceRefs are current SHA
  // consumers. Supplementary public documents are restricted to the exact
  // proposal/renderer commit selected above; unknown author wrappers are not a
  // way to add more fields or files. Nested historical provenance refs are data.
  function supplementary(ref, ctx) {
    const file = evidence(ref);
    if (roles.has(file.path)) return file;
    const doc = file.value;
    let commits, kind;
    if (PROPOSAL_SCHEMAS.has(doc.schemaVersion)) { commits = ctx.proposalCommits; kind = 'proposal'; }
    else if (RENDERER_SCHEMAS.has(doc.schemaVersion)) {
      requireThat(doc.schemaVersion !== 'archive-independent-prior-solution-renderer-review-v1',
        'UNSELECTED_PRIOR_RENDERER_WITNESS');
      commits = ctx.rendererCommits; kind = 'renderer';
    }
    else if (doc.schemaVersion === undefined && /\/centroid-exact-definition-reuse\.json$/.test(file.path)) {
      exactKeys(doc, ['immutableProposalCommit', 'path', 'change']);
      requireThat(SHA1.test(doc.immutableProposalCommit) && text(doc.path, 500) && plain(doc.change), 'LEGACY_CENTROID_EVIDENCE');
      commits = ctx.proposalCommits; kind = 'proposal';
    } else fail('UNRECOGNIZED_EVIDENCE_SCHEMA');
    requireThat([...commits].some(commit => {
      if (!entry(root, commit, file.path, false)) return false;
      const original = immutable(commit, file.path);
      if (!original.bytes.equals(file.bytes)) return false;
      file.publicReuse = { commit, path: file.path, blobSha1: original.blobSha1, sha256: original.sha256 };
      return true;
    }), 'SUPPLEMENTARY_EVIDENCE_NOT_IMMUTABLE');
    return role(file, kind);
  }
  for (const ctx of requests) {
    for (const ref of ctx.request.approval.evidenceRefs) supplementary(ref, ctx);
    for (const change of ctx.request.registryChanges) {
      exactKeys(change, ['path', 'collection', 'match', 'before', 'after', 'evidenceRefs']);
      safePath(change.path);
      requireThat(change.path.startsWith('archive/data/meta-foundation/canonical/') && change.path.endsWith('.json') &&
        text(change.collection, 80) && plain(change.match) && Object.keys(change.match).length > 0 && change.before === null && plain(change.after), 'ADD_ONLY_REGISTRY_CHANGE');
      evidenceRefs(change.evidenceRefs);
      requireThat(change.evidenceRefs.every(r => ctx.request.approval.evidenceRefs.some(a => equal(a, r))), 'REGISTRY_EVIDENCE_NOT_APPROVAL');
      const { evidenceRefs: refs, ...core } = change;
      const approved = refs.flatMap(ref => {
        const doc = supplementary(ref, ctx).value;
        return [...(doc.registryChanges || []), ...(doc.approvedRegistryChanges || []),
          ...(doc.change ? [doc.change] : []), ...(doc.applications || []).flatMap(a => (a.decisions || []).map(d => d.registryChange).filter(Boolean))];
      });
      requireThat(approved.some(row => equal(row, core)), 'REGISTRY_CHANGE_NOT_IMMUTABLE_PROPOSAL');
    }
  }
  requireThat(reached.size === files.size && [...files.keys()].every(p => reached.has(p)), 'UNREFERENCED_INPUT_FILE');
  const publicBlobReuse = [...files.values()].filter(f => f.publicBlobReuseOnly).map(file => {
    requireThat(file.publicReuse?.blobSha1 === file.blobSha1 && file.publicReuse.sha256 === file.sha256 && roles.get(file.path) === 'renderer', 'PUBLIC_OBSERVATION_BLOB_REUSE_REQUIRED');
    return { inputPath: file.path, ...file.publicReuse, contentUploadPermitted: false };
  });
  return { requestCount: materializationRequests.length, preservationRequestCount: preservationRefs.length,
    selectedUidCount: selected.size, evidenceFileCount: [...roles.values()].filter(r => r !== 'request').length,
    newApprovals: 0, publicBlobReuse, evidenceTraversal: 'EXPLICIT_TYPED_AND_CURRENT_REGISTRAR_REFS_ONLY' };
}

/** Inspects immutable Git objects only. No code from the input branch is loaded. */
export function inspectSourceMetadataCandidate({ repoRoot, inputCommit, eventRef }) {
  requireThat(typeof repoRoot === 'string' && fs.existsSync(repoRoot), 'REPOSITORY_REQUIRED');
  const root = fs.realpathSync(repoRoot);
  requireThat(SHA1.test(inputCommit || ''), 'INPUT_COMMIT_REQUIRED');
  const baseCommit = git(root, ['rev-parse', 'HEAD']).trim();
  requireThat(SHA1.test(baseCommit), 'BASE_COMMIT_REQUIRED');
  requireThat(!git(root, ['diff', '--name-only', 'HEAD', '--']).trim(), 'TRUSTED_CHECKOUT_DIRTY');
  const parents = git(root, ['rev-list', '--parents', '-n', '1', inputCommit]).trim().split(/\s+/);
  requireThat(parents.length === 2 && parents[1] === baseCommit, 'INPUT_PARENT_NOT_CURRENT_BASE');
  const envelopeFile = readJson(root, inputCommit, CANDIDATE_ENVELOPE);
  const envelope = envelopeFile.value;
  exactKeys(envelope, ['schemaVersion', 'materializationId', 'baseCommit', 'manifestRef', 'inputFiles'], ['preservationRequestRefs']);
  requireThat(envelope.schemaVersion === CANDIDATE_SCHEMA && ID.test(envelope.materializationId), 'ENVELOPE_SCHEMA');
  requireThat(envelope.baseCommit === baseCommit, 'BASE_COMMIT_MISMATCH');
  requireThat(eventRef === `archive-meta-source-input/${envelope.materializationId}`, 'EVENT_REF_MISMATCH');
  requireThat(Array.isArray(envelope.inputFiles) && envelope.inputFiles.length > 0 && envelope.inputFiles.length <= 500,
    'INPUT_FILE_COUNT');
  const files = new Map();
  let total = envelopeFile.bytes.length;
  for (const ref of envelope.inputFiles) {
    requireThat(plain(ref) && allowedMetadataPath(ref.path), 'INPUT_PATH_NOT_METADATA');
    requireThat(!files.has(ref.path), 'DUPLICATE_INPUT_PATH');
    requireThat(entry(root, baseCommit, ref.path, false) === null, 'INPUT_OVERWRITE_FORBIDDEN');
    const file = readJson(root, inputCommit, ref.path);
    verifiedRef(ref, file);
    files.set(ref.path, file);
    total += file.bytes.length;
    requireThat(total <= MAX_TOTAL_BYTES, 'INPUT_TOTAL_SIZE');
  }
  const changed = git(root, ['diff-tree', '--no-commit-id', '--name-only', '-r', '-z', baseCommit, inputCommit]).split('\0').filter(Boolean).sort();
  const expected = [CANDIDATE_ENVELOPE, ...files.keys()].sort();
  requireThat(JSON.stringify(changed) === JSON.stringify(expected), 'INPUT_TREE_SCOPE');
  requireThat(entry(root, baseCommit, CANDIDATE_ENVELOPE, false) === null, 'ENVELOPE_OVERWRITE');
  const manifestFile = files.get(envelope.manifestRef?.path);
  requireThat(Boolean(manifestFile), 'MANIFEST_NOT_INPUT');
  verifiedRef(envelope.manifestRef, manifestFile);
  requireThat(manifestFile.value.materializationId === envelope.materializationId &&
    manifestFile.value.baseCommit === baseCommit, 'MANIFEST_IDENTITY');
  const closure = validateClosedInputGraph({ root, baseCommit, inputCommit, envelope, manifestFile, files });
  return { root, baseCommit, inputCommit, materializationId: envelope.materializationId,
    candidateBranch: `release/metadata-source-${envelope.materializationId}`, envelopeFile, manifestFile, files,
    totalInputBytes: total, closure };
}

function outsideNewDirectory(root, value) {
  requireThat(typeof value === 'string' && path.isAbsolute(value), 'ABSOLUTE_OUTPUT_REQUIRED');
  const parent = fs.realpathSync(path.dirname(value));
  const resolved = path.join(parent, path.basename(value));
  requireThat(resolved !== root && !resolved.startsWith(root + path.sep), 'OUTPUT_INSIDE_REPOSITORY');
  requireThat(!fs.existsSync(resolved), 'OUTPUT_ALREADY_EXISTS');
  return resolved;
}

/** Produces an unreferenced candidate commit. Publishing it and opening a PR are separate actions. */
export async function buildSourceMetadataCandidate({ repoRoot, inputCommit, eventRef, outputRoot }) {
  const inspected = inspectSourceMetadataCandidate({ repoRoot, inputCommit, eventRef });
  const { root, baseCommit, manifestFile, materializationId, candidateBranch } = inspected;
  const target = outsideNewDirectory(root, outputRoot);
  const { materializeReviewedSourceMetadata } = await import('../../archive/tools/meta-foundation/materialize-reviewed-source-metadata.mjs');
  await materializeReviewedSourceMetadata({ repoRoot: root, manifest: manifestFile.value,
    baseCommit, inputCommit, outputRoot: target, write: true });
  const manifest = manifestFile.value;
  requireThat(Array.isArray(manifest.files) && manifest.files.length > 0, 'MATERIALIZED_FILES_REQUIRED');
  const sourceRows = manifest.files.map(file => {
    const rel = safePath(file.path);
    requireThat(/^archive\/exams\/original\/.+\.js$/.test(rel), 'SOURCE_PATH');
    const absolute = path.join(target, rel);
    requireThat(fs.existsSync(absolute) && fs.lstatSync(absolute).isFile() && !fs.lstatSync(absolute).isSymbolicLink(),
      'MATERIALIZED_FILE_MISSING');
    requireThat(fs.realpathSync(absolute).startsWith(target + path.sep), 'MATERIALIZED_PATH_ESCAPE');
    const bytes = fs.readFileSync(absolute);
    const blobSha1 = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    requireThat(blobSha1 === file.after?.blobSha1 && digest(bytes) === file.after?.sha256, 'MATERIALIZED_BYTES_MISMATCH');
    return { path: rel, blobSha1, sha256: digest(bytes), bytes: bytes.length, absolute };
  });
  requireThat(new Set(sourceRows.map(row => row.path)).size === sourceRows.length, 'DUPLICATE_SOURCE_PATH');
  const receiptPath = `docs/operations/source-metadata-candidates/${materializationId}/transport-receipt.json`;
  requireThat(entry(root, inputCommit, receiptPath, false) === null, 'RECEIPT_OVERWRITE');
  const receipt = { schemaVersion: 'archive-reviewed-source-candidate-receipt-v1', materializationId,
    baseCommit, inputCommit, manifestRef: { path: manifestFile.path, blobSha1: manifestFile.blobSha1, sha256: manifestFile.sha256 },
    sourceFiles: sourceRows.map(({ absolute, ...row }) => row), inputFileCount: inspected.files.size,
    inputBytes: inspected.totalInputBytes, inputClosure: inspected.closure, approvalEffect: 'NONE', registrationStatus: 'NOT_REGISTERED',
    nextRequiredStep: 'NORMAL_PULL_REQUEST_CI_AND_SINGLE_MAIN_REGISTRATION_WRITER' };
  const receiptBytes = Buffer.from(JSON.stringify(receipt, null, 2) + '\n');
  const privateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-source-candidate-index-'));
  const indexFile = path.join(privateDir, 'index');
  const env = { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_INDEX_FILE: indexFile,
    GIT_AUTHOR_NAME: 'Archive Source Metadata Candidate', GIT_AUTHOR_EMAIL: 'archive-candidate@users.noreply.github.com',
    GIT_COMMITTER_NAME: 'Archive Source Metadata Candidate', GIT_COMMITTER_EMAIL: 'archive-candidate@users.noreply.github.com' };
  let candidateCommit;
  try {
    git(root, ['read-tree', inputCommit], { env });
    git(root, ['update-index', '--force-remove', '--', CANDIDATE_ENVELOPE], { env });
    for (const row of sourceRows) {
      const actualBlob = git(root, ['hash-object', '-w', '--', row.absolute], { env }).trim();
      requireThat(actualBlob === row.blobSha1, 'SOURCE_OBJECT_MISMATCH');
      git(root, ['update-index', '--add', '--cacheinfo', `100644,${actualBlob},${row.path}`], { env });
    }
    const receiptBlob = git(root, ['hash-object', '-w', '--stdin'], { env, input: receiptBytes }).trim();
    git(root, ['update-index', '--add', '--cacheinfo', `100644,${receiptBlob},${receiptPath}`], { env });
    const tree = git(root, ['write-tree'], { env }).trim();
    candidateCommit = git(root, ['commit-tree', tree, '-p', inputCommit], {
      env, input: `Build reviewed source metadata candidate ${materializationId}\n\nExisting public source bytes plus bound metadata changes; ordinary PR gates remain required.\n`,
    }).trim();
  } finally { fs.rmSync(privateDir, { recursive: true, force: true }); }
  requireThat(git(root, ['rev-parse', 'HEAD']).trim() === baseCommit &&
    !git(root, ['diff', '--name-only', 'HEAD', '--']).trim(), 'TRUSTED_CHECKOUT_CHANGED');
  return { schemaVersion: 'archive-reviewed-source-candidate-result-v1', materializationId, baseCommit, inputCommit,
    candidateCommit, candidateBranch, receiptPath, receiptSha256: digest(receiptBytes),
    sourceFileCount: sourceRows.length, inputFileCount: inspected.files.size,
    approvalEffect: 'NONE', registrationStatus: 'NOT_REGISTERED' };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const args = process.argv.slice(2);
    const allowed = new Set(['--repo-root', '--input-commit', '--event-ref', '--output-root', '--result-file']);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      requireThat(allowed.has(args[i]) && !Object.hasOwn(options, args[i]) && args[i + 1], 'CLI_ARGUMENT');
      options[args[i]] = args[i + 1];
    }
    requireThat(options['--result-file'], 'RESULT_FILE_REQUIRED');
    const root = fs.realpathSync(options['--repo-root'] || process.cwd());
    const resultPath = outsideNewDirectory(root, options['--result-file']);
    const result = await buildSourceMetadataCandidate({ repoRoot: root, inputCommit: options['--input-commit'],
      eventRef: options['--event-ref'], outputRoot: options['--output-root'] });
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
