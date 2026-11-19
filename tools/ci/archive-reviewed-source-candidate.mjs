import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { REVIEWED_META_VALUE_FIELDS } from '../../archive/tools/meta-foundation/reviewed-meta-value-fields.mjs';
import { createQuestionIdentityResolver } from '../../archive/tools/intelligence/question-identity-contract.mjs';
import { M2_PROBLEM_IMAGE_REPAIR8_PROFILE, validateM2ProblemImageRepair8Candidate,
  materializeM2ProblemImageRepair8 } from '../../archive/tools/meta-foundation/materialize-reviewed-problem-image-repair8.mjs';
import { M2S1_SVG7_IMAGE_POINTER_PROFILE, M2S1_SVG7_Q24_ORIGIN_PROFILE, validateM2s1Svg7ImagePointerCandidate,
  materializeM2s1Svg7ImagePointer } from '../../archive/tools/meta-foundation/materialize-reviewed-m2s1-svg7-image-pointer.mjs';
import { M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE, validateM3E052Q5OriginalDiagramCandidate,
  materializeM3E052Q5OriginalDiagram } from '../../archive/tools/meta-foundation/materialize-reviewed-m3-e052-q5-original-diagram.mjs';

import { E041_CHOICE_CORRECTION_PROFILE, validateE041OriginalChoiceCorrectionCandidate,
  materializeE041OriginalChoiceCorrection } from '../../archive/tools/meta-foundation/materialize-reviewed-e041-original-choice-correction.mjs';

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
const METADATA_PARENT_SOURCE = 'archive/data/question_metadata.json';
const TARGET_PARENT_MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const TARGET_PARENT_CROSSWALK = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const NATIVE_SCHEMAS = new Set(['m2-s2-meta-review-v1', 'm3-s2-complete-semantic-review-v1']);
const PROPOSAL_SCHEMAS = new Set(['archive-independent-native-proposal-disposition-v1',
  'archive-reviewed-registry-change-proposal-v1', 'archive-independent-proposal-condition-boundary-finalization-v1',
  'archive-m3s2-condition-definition-proposal-for-independent-review-v1',
  'archive-cross-concept-narrow-definition-finalization-v1', 'archive-reviewed-cross-concept-registry-change-proposal-v1']);
const RENDERER_SCHEMAS = new Set(['archive-reviewed-renderer-continuity-evidence-v1',
  'archive-independent-narrow-renderer-review-v1', 'archive-independent-current-figure-review-v1',
  'archive-independent-current-renderer-review-v2',
  'archive-independent-current-renderer-review-v3',
  'archive-independent-prior-solution-renderer-review-v1',
  'archive-m3-narrow-current-figure-review-v1', 'archive-narrow-solution-renderer-correction-independent-review-v1']);
const META_FIELDS = new Set(REVIEWED_META_VALUE_FIELDS);
const UNSTORED_FIELDS = new Set(); // 목록 밖 필드는 거절하지 않고 이름만 결과에 남긴다 (등록기와 같은 원칙)
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
    if (!META_FIELDS.has(field)) { UNSTORED_FIELDS.add(field); continue; }
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
    [undefined, 'M3_REVIEWED_METADATA_V1', 'M2_NATIVE_PROPOSAL_V3'].includes(manifest.transportProfile), 'MANIFEST_SCHEMA');
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
          preservation ? [] : ['identityBefore', 'sourceReview', 'basicScopeParentRef', 'targetParentRef']);
        requireThat(!(item.basicScopeParentRef && item.targetParentRef), 'AMBIGUOUS_PARENT_REFERENCE');
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
      requests.push({ file, request, source, preservation, proposalCommits: new Set(), rendererCommits: new Set(), selectedV1RegistryChanges: [], selectedV3RegistryChanges: [] });
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

  const compact = value => String(value ?? '').normalize('NFC').replace(/\s/g, '');
  function middle2ParentContext(request, item) {
    requireThat(/^original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/u.test(request.sourceArchiveFile) &&
      (item.after.curriculum ?? item.after.curriculumKey) === '2015' && item.after.courseKey === 'M2-2' &&
      compact(item.after.standardCourse) === '중2수학' && text(item.after.standardUnitKey, 160) &&
      (item.after.subUnitKey === null || text(item.after.subUnitKey, 160)) &&
      text(item.after.L1, 160) && text(item.after.L2, 160), 'M2_CURRENT_PARENT_CONTEXT');
  }
  const metadataParentCache = new Map();
  function metadataParent(file) {
    if (metadataParentCache.has(file.path)) return metadataParentCache.get(file.path);
    const doc = file.value;
    // This is a current-public-base read only. The whole metadata document is
    // never accepted as an uploaded input or copied into the output commit.
    requireThat(!files.has(METADATA_PARENT_SOURCE), 'METADATA_PARENT_BASE_ONLY');
    const original = immutable(baseCommit, METADATA_PARENT_SOURCE, { metadataOnly: false, maxBytes: 128 * 1024 * 1024 });
    requireThat(original.sha256 === doc.sourceSha256 && original.value.schemaVersion === 'archive-question-metadata-v1' &&
      Array.isArray(original.value.records), 'METADATA_PARENT_SOURCE_HASH');
    const owners = requests.flatMap(ctx => ctx.preservation ? [] : ctx.request.items
      .filter(item => item.basicScopeParentRef?.path === file.path)
      .map(item => ({ request: ctx.request, item })));
    requireThat(Array.isArray(doc.records) && doc.records.length > 0 && doc.records.length === owners.length, 'METADATA_PARENT_SELECTED_SCOPE');
    const keys = ['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'curriculumKey', 'courseKey', 'standardUnitKey', 'subUnitKey', 'L1', 'L2'];
    const selected = new Map();
    for (const snapshot of doc.records) {
      exactKeys(snapshot, keys);
      requireThat(UID.test(snapshot.questionUid) && Number.isSafeInteger(snapshot.sourceOrdinal) &&
        snapshot.sourceOrdinal > 0 && !selected.has(snapshot.questionUid), 'METADATA_PARENT_SELECTED_UID');
      const owner = owners.filter(o => o.item.questionUid === snapshot.questionUid && o.item.sourceOrdinal === snapshot.sourceOrdinal &&
        o.request.sourceArchiveFile === snapshot.sourceArchiveFile);
      requireThat(owner.length === 1, 'METADATA_PARENT_SELECTED_SCOPE');
      const { request, item } = owner[0]; middle2ParentContext(request, item);
      const current = original.value.records.filter(r => r.questionUid === snapshot.questionUid &&
        r.sourceArchiveFile === snapshot.sourceArchiveFile && r.sourceOrdinal === snapshot.sourceOrdinal);
      requireThat(current.length === 1 && (current[0].reviewStatus === 'reviewed_pass' ||
        String(current[0].metadataStatus || '').startsWith('approved_')), 'METADATA_PARENT_NOT_APPROVED');
      const row = current[0], expected = { questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile,
        sourceOrdinal: row.sourceOrdinal, curriculumKey: row.curriculum || row.curriculumKey,
        courseKey: row.standardCourse || row.courseKey, standardUnitKey: row.standardUnitKey,
        subUnitKey: row.subUnitKey ?? null, L1: row.L1, L2: row.L2 };
      requireThat(equal(snapshot, expected) && snapshot.curriculumKey === '2015' &&
        compact(snapshot.courseKey) === compact(item.after.standardCourse) &&
        ['standardUnitKey', 'L1', 'L2'].every(k => snapshot[k] === item.after[k]) &&
        snapshot.subUnitKey === (item.after.subUnitKey ?? null), 'METADATA_PARENT_VALUE_DRIFT');
      selected.set(snapshot.questionUid, snapshot);
    }
    metadataParentCache.set(file.path, selected); return selected;
  }
  function parent(ref, request, item) {
    bound(ref, request, item);
    const file = evidence(ref), doc = file.value;
    requireThat(ref.path.startsWith(RECEIPTS) && ref.path.endsWith('.parent-labels.json'), 'PARENT_EVIDENCE_PATH');
    exactKeys(doc, ['schemaVersion', 'sourcePath', 'sourceSha256', 'records']);
    requireThat(doc.schemaVersion === PARENT_SCHEMA && ['archive/data/basic-scope-parent-links.json', METADATA_PARENT_SOURCE].includes(doc.sourcePath) &&
      SHA256.test(doc.sourceSha256), 'PARENT_EVIDENCE_SCHEMA');
    if (doc.sourcePath === METADATA_PARENT_SOURCE) {
      requireThat(metadataParent(file).has(item.questionUid), 'METADATA_PARENT_SELECTED_UID');
      role(file, 'parent'); return;
    }
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
  function nativeRationaleContinuity(ctx, item, native, nativeItem) {
    const { request } = ctx, spec = item.sourceReview, option = spec.rationaleContinuity;
    exactKeys(spec, ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef', 'rationaleContinuity']);
    exactKeys(option, ['schemaVersion']);
    requireThat(option.schemaVersion === 'archive-native-rationale-continuity-v1' &&
      request.scope === 'PARTIAL_UIDS' && request.registryChanges.length === 0 &&
      native.schemaVersion === 'm2-s2-meta-review-v1' &&
      /^original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/u.test(request.sourceArchiveFile) &&
      item.after.curriculum === '2015' && item.after.curriculumKey === '2015' &&
      item.after.courseKey === 'M2-2' && item.after.standardCourse === '중2 수학' &&
      plain(item.basicScopeParentRef) && !Object.hasOwn(item, 'targetParentRef'), 'RATIONALE_CONTINUITY_SCOPE');
    // The ordinary native and current-public-metadata parent closures have
    // already been verified. This option cannot share a request with another
    // review profile or another parent inventory.
    const parentFile = evidence(item.basicScopeParentRef), doc = parentFile.value;
    requireThat(doc.sourcePath === METADATA_PARENT_SOURCE && doc.records.length === request.items.length &&
      request.items.every(selected => equal(selected.basicScopeParentRef, item.basicScopeParentRef) &&
        equal(selected.sourceReview?.rationaleContinuity, option) && doc.records.some(row =>
          row.questionUid === selected.questionUid && row.sourceOrdinal === selected.sourceOrdinal &&
          row.sourceArchiveFile === request.sourceArchiveFile)), 'RATIONALE_CONTINUITY_PARENT_SCOPE');
    requireThat(plain(nativeItem.after) && ['primaryMethod', 'decisiveStep'].every(field =>
      !Object.hasOwn(nativeItem.after, field) && text(nativeItem[field]) && nativeItem[field].trim().length > 0 &&
      item.after[field] === nativeItem[field]), 'RATIONALE_CONTINUITY_NATIVE_VALUES');
  }
  function targetParent(ref, request, item, nativeItem) {
    middle2ParentContext(request, item);
    exactKeys(ref, ['path', 'sha256', 'curriculum', 'scope', 'majorUnit', 'midUnit'], ['crosswalkRef']);
    requireThat(ref.path === TARGET_PARENT_MASTER && ref.curriculum === '2015' && ref.scope === 'M2-2' &&
      ref.majorUnit === item.after.L1 && ref.midUnit === item.after.L2 && !files.has(ref.path), 'TARGET_PARENT_BASE_SCOPE');
    const masterRef = { path: ref.path, sha256: ref.sha256 }; bound(masterRef, request, item);
    const master = evidence(masterRef);
    requireThat(master.value.schemaVersion === 'js-archive-taxonomy-rpm-primary-v1.0' && master.value.authorityStatus === 'LOCKED' &&
      Array.isArray(master.value.records) && master.value.records.some(r => r.curriculum === ref.curriculum && r.scope === ref.scope &&
        r.majorUnit === ref.majorUnit && r.midUnit === ref.midUnit), 'TARGET_PARENT_MASTER_RECORD');
    role(master, 'target-parent-master');
    const taxonomy = immutable(baseCommit, 'archive/data/meta-foundation/compiled/taxonomy_registry.json', { metadataOnly: false }).value;
    const bindings = immutable(baseCommit, 'archive/data/meta-foundation/compiled/curriculum_bindings.json', { metadataOnly: false }).value;
    const tagMaster = immutable(baseCommit, 'archive/data/master_tables/js_archive_tag_master.json', { metadataOnly: false }).value;
    requireThat(taxonomy.status === 'DERIVED_READ_ONLY' && Array.isArray(taxonomy.problemTypes) && Array.isArray(taxonomy.templates) &&
      bindings.status === 'DERIVED_READ_ONLY' && Array.isArray(bindings.bindings) && Array.isArray(tagMaster), 'TARGET_PARENT_CURRENT_REGISTRY');
    const pt = taxonomy.problemTypes.filter(r => r.problemTypeKey === item.after.problemTypeKey && r.status === 'ACTIVE');
    const tpl = taxonomy.templates.filter(r => r.templateKey === item.after.templateKey && r.status === 'ACTIVE');
    const selected = bindings.bindings.filter(r => r.status === 'ACTIVE' && r.curriculum === ref.curriculum &&
      r.standardCourse === item.after.standardCourse && r.standardUnitKey === item.after.standardUnitKey &&
      (r.subUnitKey ?? null) === (item.after.subUnitKey ?? null) && r.problemTypeKey === item.after.problemTypeKey);
    requireThat(pt.length === 1 && tpl.length === 1 && tpl[0].parentProblemTypeKey === pt[0].problemTypeKey &&
      selected.length === 1, 'TARGET_PARENT_CURRENT_BINDING');
    const binding = selected[0], unit = tagMaster.filter(r => r.key === item.after.standardUnitKey && r.keyType === 'standardUnitKey'),
      sub = tagMaster.filter(r => r.key === item.after.subUnitKey && r.keyType === 'subUnitKey');
    requireThat(unit.length === 1 && (item.after.subUnitKey === null || sub.length === 1) &&
      (!binding.L1 || binding.L1 === ref.majorUnit), 'TARGET_PARENT_CURRENT_UNIT');
    let exactCrosswalk = false;
    if (ref.crosswalkRef) {
      const cross = ref.crosswalkRef; exactKeys(cross, ['path', 'sha256', 'recordId']);
      requireThat(cross.path === TARGET_PARENT_CROSSWALK && !files.has(cross.path) && text(cross.recordId, 160) &&
        nativeItem.rpmRecordId === cross.recordId, 'TARGET_PARENT_CROSSWALK_SCOPE');
      const crossRef = { path: cross.path, sha256: cross.sha256 }; bound(crossRef, request, item);
      const file = evidence(crossRef), doc = file.value;
      const rows = Array.isArray(doc.records) ? doc.records.filter(r => r.id === cross.recordId) : [];
      const r = rows[0];
      requireThat(doc.schemaVersion === 'rpm-primary-active-crosswalk-v1' && doc.status === 'ACTIVE_REFERENCE' && rows.length === 1 &&
        r.bindingStatus === 'ACTIVE' && r.curriculum === ref.curriculum && r.scope === ref.scope &&
        r.problemTypeKey === item.after.problemTypeKey && r.templateKey === item.after.templateKey &&
        r.rpmPath?.majorUnit === ref.majorUnit && r.rpmPath?.midUnit === ref.midUnit, 'TARGET_PARENT_CROSSWALK_RECORD');
      role(file, 'target-parent-crosswalk'); exactCrosswalk = true;
    }
    requireThat(exactCrosswalk || [binding.L2, binding.subUnitLabelKo, sub[0]?.labelKo, unit[0].labelKo]
      .filter(Boolean).some(label => compact(label) === compact(ref.midUnit)), 'TARGET_PARENT_CONTEXT_ALIAS');
  }
  function conceptFinalizationV1(ctx, item, native, nativeItem) {
    const { request } = ctx, spec = item.sourceReview, p = spec.proposalFinalization;
    exactKeys(p, ['schemaVersion', 'finalizationCommit', 'finalizationRef', 'registryChangesRef', 'proposalIds']);
    requireThat(native.schemaVersion === 'm2-s2-meta-review-v1' && Array.isArray(p.proposalIds) && p.proposalIds.length > 0 &&
      p.proposalIds.length <= 100 && p.proposalIds.every(id => text(id, 160)) && new Set(p.proposalIds).size === p.proposalIds.length &&
      Array.isArray(native.proposals) && Array.isArray(nativeItem.proposalRefs) &&
      equal([...p.proposalIds].sort(), [...nativeItem.proposalRefs].sort()), 'M2_V1_CC_PROPOSAL_IDS');
    for (const id of p.proposalIds) {
      const found = native.proposals.filter(row => (row.id ?? row.proposalId) === id);
      requireThat(found.length === 1 && ['CC', 'NEW_CC', 'CROSS_CONCEPT'].includes(found[0].type) &&
        Array.isArray(found[0].supportingQuestionUids) && found[0].supportingQuestionUids.includes(item.questionUid), 'M2_V1_CC_NATIVE_PROPOSAL');
    }
    bound(p.finalizationRef, request, item); bound(p.registryChangesRef, request, item);
    const proof = copy(p.finalizationRef, p.finalizationCommit, p.finalizationRef.path,
      new Set(['archive-cross-concept-narrow-definition-finalization-v1']), 'proposal').value;
    const registry = copy(p.registryChangesRef, p.finalizationCommit, p.registryChangesRef.path,
      new Set(['archive-reviewed-cross-concept-registry-change-proposal-v1']), 'proposal').value;
    requireThat(proof.status === 'DEFINITIONS_FINALIZED_OFFICIAL_REGISTRATION_PENDING' && text(proof.reviewer, 160) &&
      proof.nativeReviewCommit === spec.reviewCommit && proof.scope?.newFullMathematicalQa === false &&
      proof.scope?.newReview2Claims === 0 && proof.scope?.newMetadataApprovals === 0 && proof.scope?.newDifficultyJudgments === 0 &&
      registry.status === 'PENDING_OFFICIAL_REGISTRAR' && registry.evidenceRefs?.some(r => equal(r, p.finalizationRef)), 'M2_V1_CC_FINALIZATION_SCOPE');
    const app = one(proof.applications, item);
    requireThat(app.sourcePath === `archive/exams/${request.sourceArchiveFile}` && app.examId === native.examId &&
      equal(app.nativeReviewRef, { commit: spec.reviewCommit, path: spec.reviewPath, sha256: spec.reviewRef.sha256 }) &&
      app.nativeItemStableSha256 === digest(stable(nativeItem)) && Array.isArray(app.nativeProposalRefs) &&
      equal([...app.nativeProposalRefs].sort(), [...p.proposalIds].sort()) && app.definitionDisposition === 'ADD_EXACT_NEW_CANONICAL_CC' &&
      app.newMathematicalQa === false && app.newMetadataApproval === false && app.difficultyChanged === false &&
      equal(app.nativeProtectedStudentFieldsChanges, []) && Array.isArray(app.nativeAfterCrossConceptKeys) && text(app.addCrossConceptKey, 160) &&
      !app.nativeAfterCrossConceptKeys.includes(app.addCrossConceptKey) &&
      equal(item.after.crossConceptKeys, [...app.nativeAfterCrossConceptKeys, app.addCrossConceptKey]), 'M2_V1_CC_APPLICATION');
    requireThat(['standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey']
      .every(k => app.reviewedPrimaryContext?.[k] === item.after[k]), 'M2_V1_CC_PRIMARY_CONTEXT');
    const definitions = proof.definitionDecisions?.filter(d => d.definition?.conceptKey === app.addCrossConceptKey);
    const changes = registry.registryChanges?.filter(c => c.match?.conceptKey === app.addCrossConceptKey);
    requireThat(definitions?.length === 1 && changes?.length === 1 && changes[0].before === null && changes[0].collection === 'concepts' &&
      equal(changes[0].match, { conceptKey: app.addCrossConceptKey }) && equal(changes[0].after, definitions[0].definition), 'M2_V1_CC_DEFINITION');
    // This public v1 document contains multiple finalized concepts. Only the
    // exact change selected by this UID's finalized application is a transport
    // edge. Preserve its evidenceRefs too; no sibling definition is authorized
    // merely because it shares the same immutable proposal document.
    requireThat(request.registryChanges.filter(change => equal(change, changes[0])).length === 1,
      'M2_V1_CC_SELECTED_REGISTRY_CHANGE');
    ctx.selectedV1RegistryChanges.push(changes[0]);
    ctx.proposalCommits.add(p.finalizationCommit);
  }
  function m2FinalizationV3(ctx, item, native, nativeItem) {
    const { request, source } = ctx, spec = item.sourceReview, p = spec.proposalFinalization;
    exactKeys(p, ['schemaVersion', 'finalizationCommit', 'finalizationRef', 'proposalSelections']);
    requireThat(native.schemaVersion === 'm2-s2-meta-review-v1' && Array.isArray(p.proposalSelections) &&
      p.proposalSelections.length === 1 && Array.isArray(native.proposals), 'M2_V3_PROPOSAL_SCOPE');
    const selection = p.proposalSelections[0];
    exactKeys(selection, ['documentRef', 'index', 'proposalSha256', 'questionUid', 'sourceOrdinal'], ['proposalId']);
    evidenceRef(selection.documentRef);
    requireThat(selection.documentRef.path === spec.reviewPath && selection.documentRef.sha256 === spec.reviewRef.sha256 &&
      Number.isSafeInteger(selection.index) && selection.index >= 0 && SHA256.test(selection.proposalSha256) &&
      selection.questionUid === item.questionUid && selection.sourceOrdinal === item.sourceOrdinal, 'M2_V3_NATIVE_SELECTION');
    const proposal = native.proposals[selection.index];
    requireThat(plain(proposal) && digest(stable(proposal)) === selection.proposalSha256 &&
      selection.proposalId === (proposal.id ?? proposal.proposalId) && text(selection.proposalId, 160) &&
      ['CC', 'NEW_TPL', 'NEW_PT'].includes(proposal.type) && proposal.supportingQuestionUids?.includes(item.questionUid) &&
      equal(nativeItem.proposalRefs, [selection.proposalId]), 'M2_V3_NATIVE_PROPOSAL');
    bound(p.finalizationRef, request, item);
    const proof = copy(p.finalizationRef, p.finalizationCommit, p.finalizationRef.path,
      new Set(['archive-independent-m2-native-proposal-disposition-v1']), 'm2-proposal-v3').value;
    const noNewApproval = s => s?.newFullMathematicalQa === false && s?.newReview2Claims === 0 &&
      s?.newMetadataApprovals === 0 && s?.newDifficultyJudgments === 0;
    requireThat(proof.status === 'NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING' && noNewApproval(proof.scope) &&
      proof.scope.newSourceContentEdits === 0, 'M2_V3_FINALIZATION_SCOPE');
    const app = one(proof.applications, item);
    requireThat(app.examId === native.examId && app.sourcePath === source.path &&
      equal(app.nativeReviewRef, { commit: spec.reviewCommit, path: spec.reviewPath, sha256: spec.reviewRef.sha256 }) &&
      app.nativeItemStableSha256 === digest(stable(nativeItem)) && equal(app.proposalSelections, p.proposalSelections) &&
      app.newMathematicalQa === false && app.newMetadataApproval === false && app.difficultyChanged === false &&
      equal(app.nativeProtectedStudentFieldsChanges, []) && Array.isArray(app.decisions) && app.decisions.length === 1 &&
      equal(app.decisions[0].selection, selection) && text(app.reviewer, 160) && text(app.reason), 'M2_V3_APPLICATION');
    const primaryKeys = ['standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey'];
    exactKeys(app.reviewedPrimaryContext, primaryKeys);
    requireThat(primaryKeys.every(k => text(app.reviewedPrimaryContext[k], 160) && app.reviewedPrimaryContext[k] === item.after[k]),
      'M2_V3_PRIMARY_CONTEXT');
    bound(app.independentReviewRef, request, item);
    const witness = copy(app.independentReviewRef, p.finalizationCommit, app.independentReviewRef.path,
      new Set(['archive-independent-m2-native-definition-finalization-v1']), 'm2-proposal-v3').value;
    requireThat(witness.decision === 'APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS' &&
      witness.reviewer === app.reviewer && noNewApproval(witness) && witness.existingDefinitionsModified === 0 &&
      witness.sourceWrites === 0 && witness.canonicalWrites === 0 && witness.officialCompilerResolverConsumerStillRequired === true &&
      witness.actualMainRegistrationClaimed === false && witness.currentMainChecked === app.sourceSnapshot?.commit, 'M2_V3_INDEPENDENT_SCOPE');
    const original = one(witness.rows, item), choice = app.decisions[0];
    requireThat(['examId', 'sourceOrdinal', 'questionUid', 'sourcePath', 'nativeReviewRef', 'nativeItemStableSha256',
      'sourceSnapshot', 'rendererAssets', 'reviewedPrimaryContext'].every(k => equal(original[k], app[k])) &&
      equal(original.nativeProposal, proposal) && equal(original.proposalSelection, selection) &&
      equal(original.nativeAfter, nativeItem.after) && equal(original.nativeActiveDefinitionMatch, nativeItem.activeDefinitionMatch ?? null) &&
      equal(original.decision, choice) && original.protectedPayloadFieldsUnchanged === true &&
      original.newFullMathematicalQa === false && original.newReview2 === false && original.newMetadataApproval === false &&
      original.newDifficultyJudgment === false && original.sourceWrites === 0, 'M2_V3_ORIGINAL_WITNESS');
    const operation = source.changes.find(c => c.questionUid === item.questionUid && c.sourceOrdinal === item.sourceOrdinal);
    const exactChange = (change, key, definition) => {
      requireThat(plain(change) && change.before === null && equal(change.match, { [key]: definition?.[key] }) &&
        equal(change.after, definition) && definition?.status === 'ACTIVE' &&
        witness.approvedRegistryChanges?.filter(c => equal(c, change)).length === 1, 'M2_V3_APPROVED_REGISTRY_CHANGE');
      const matches = request.registryChanges.filter(c => {
        const { evidenceRefs: ignored, ...core } = c;
        return equal(core, change);
      });
      requireThat(matches.length === 1 && [p.finalizationRef, app.independentReviewRef]
        .every(ref => matches[0].evidenceRefs?.some(r => equal(r, ref))), 'M2_V3_SELECTED_REGISTRY_CHANGE');
      ctx.selectedV3RegistryChanges.push(matches[0]);
    };
    const definition = choice.definition;
    if (proposal.type === 'CC') {
      const op = operation.metadataFields.find(f => f.field === 'crossConceptKeys');
      requireThat(/^CC_[A-Z0-9_]+$/.test(definition?.conceptKey || '') && Array.isArray(op?.before) &&
        !op.before.includes(definition.conceptKey) && equal(op.after, [...op.before, definition.conceptKey]) &&
        equal(item.after.crossConceptKeys, op.after), 'M2_V3_CONCEPT_APPLICATION');
      if (choice.disposition === 'ADD_ONLY') exactChange(choice.registryChange, 'conceptKey', definition);
      else {
        requireThat(choice.disposition === 'REUSE_ACTIVE' && choice.registryChange === undefined &&
          text(choice.canonicalPath, 500), 'M2_V3_REUSE_SCOPE');
        const ref = choice.prerequisiteDefinitionRef;
        exactKeys(ref, ['commit', 'path', 'sha256', 'definitionSha256']);
        const prerequisite = immutable(ref.commit, ref.path);
        requireThat(prerequisite.sha256 === ref.sha256 && ref.definitionSha256 === digest(stable(definition)) &&
          prerequisite.value.registryChanges?.filter(c => c.path === choice.canonicalPath &&
            c.match?.conceptKey === definition.conceptKey && equal(c.after, definition)).length === 1, 'M2_V3_REUSE_AUTHORITY');
        // The public prerequisite is authority data, not proof that an ACTIVE
        // definition is installed. The registrar checks the actual canonical
        // before/after state; no prerequisite row is added by this transport.
      }
    } else {
      requireThat(choice.disposition === 'ADD_ONLY' && definition?.templateKey === item.after.templateKey &&
        definition.parentProblemTypeKey === item.after.problemTypeKey &&
        operation.metadataFields.some(f => f.field === 'templateKey' && f.after === definition.templateKey), 'M2_V3_TEMPLATE_APPLICATION');
      exactChange(choice.registryChange, 'templateKey', definition);
      if (proposal.type === 'NEW_PT') {
        requireThat(manifest.transportProfile === 'M2_NATIVE_PROPOSAL_V3' &&
          operation.metadataFields.some(f => f.field === 'problemTypeKey' && f.after === item.after.problemTypeKey) &&
          choice.problemTypeDefinition?.problemTypeKey === item.after.problemTypeKey &&
          choice.problemTypeDefinition.ownerPack === definition.ownerPack, 'M2_V3_PRIMARY_PROFILE');
        exactChange(choice.problemTypeRegistryChange, 'problemTypeKey', choice.problemTypeDefinition);
        const change = choice.bindingRegistryChange, binding = choice.binding;
        const expected = { problemTypeKey: item.after.problemTypeKey, curriculum: original.nativeRpmContext?.record?.curriculum,
          standardCourse: item.after.standardCourse, standardUnitKey: item.after.standardUnitKey, subUnitKey: item.after.subUnitKey };
        requireThat(plain(change) && change.collection === 'bindings' && change.before === null && equal(change.match, expected) &&
          equal(change.after, binding) && Object.entries(expected).every(([k,v]) => binding?.[k] === v) && binding.status === 'ACTIVE' &&
          binding.ownerPack === definition.ownerPack && equal(binding.supportingQuestionUids, [item.questionUid]) && binding.supportingItemCount === 1 &&
          witness.approvedRegistryChanges?.filter(c => equal(c, change)).length === 1, 'M2_V3_PRIMARY_BINDING');
        const matches = request.registryChanges.filter(c => { const { evidenceRefs: ignored, ...core } = c; return equal(core, change); });
        requireThat(matches.length === 1 && [p.finalizationRef, app.independentReviewRef]
          .every(ref => matches[0].evidenceRefs?.some(r => equal(r, ref))), 'M2_V3_SELECTED_REGISTRY_CHANGE');
        ctx.selectedV3RegistryChanges.push(matches[0]);
      }
    }
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
      exactKeys(spec, ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef'], ['proposalFinalization', 'rendererProof', 'rationaleContinuity']);
      requireThat(spec.schemaVersion === 'archive-reviewed-source-reassessment-v1' && spec.reviewPath.endsWith('.json') &&
        !(spec.proposalFinalization && spec.rendererProof), 'SOURCE_REVIEW_SCOPE');
      bound(spec.reviewRef, request, item);
      const native = copy(spec.reviewRef, spec.reviewCommit, spec.reviewPath, NATIVE_SCHEMAS, 'native').value;
      const m3 = native.schemaVersion === 'm3-s2-complete-semantic-review-v1';
      requireThat(native.sourceArchiveFile === request.sourceArchiveFile &&
        request.sourceArchiveFile.startsWith(`original/middle/${m3 ? 'm3' : 'm2'}/`) &&
        (m3 ? native.questionCount : native.reviewedQuestionCount) === request.expectedQuestionCount, 'NATIVE_SOURCE_DENOMINATOR');
      const nativeItem = one(native.items, item, m3 ? 'ordinal' : 'sourceOrdinal');
      if (item.basicScopeParentRef) parent(item.basicScopeParentRef, request, item);
      if (item.targetParentRef) targetParent(item.targetParentRef, request, item, nativeItem);
      if (Object.hasOwn(spec, 'rationaleContinuity')) nativeRationaleContinuity(ctx, item, native, nativeItem);
      if (spec.proposalFinalization) {
        const p = spec.proposalFinalization;
        if (p.schemaVersion === 'archive-native-proposal-finalization-v1') {
          conceptFinalizationV1(ctx, item, native, nativeItem);
        } else if (p.schemaVersion === 'archive-native-proposal-finalization-v3') {
          m2FinalizationV3(ctx, item, native, nativeItem);
        } else {
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
        if (['archive-cross-concept-narrow-definition-finalization-v1',
          'archive-reviewed-cross-concept-registry-change-proposal-v1',
          'archive-independent-m2-native-proposal-disposition-v1',
          'archive-independent-m2-native-definition-finalization-v1'].includes(doc.schemaVersion)) return [];
        return [...(doc.registryChanges || []), ...(doc.approvedRegistryChanges || []),
          ...(doc.change ? [doc.change] : []), ...(doc.applications || []).flatMap(a => (a.decisions || []).map(d => d.registryChange).filter(Boolean))];
      });
      requireThat([...ctx.selectedV1RegistryChanges, ...ctx.selectedV3RegistryChanges].some(row => equal(row, change)) || approved.some(row => equal(row, core)),
        'REGISTRY_CHANGE_NOT_IMMUTABLE_PROPOSAL');
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
  const closure = manifestFile.value.transportProfile === E041_CHOICE_CORRECTION_PROFILE
    ? validateE041OriginalChoiceCorrectionCandidate({ root, baseCommit, inputCommit, envelope, manifestFile, files })
    : manifestFile.value.transportProfile === M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE
    ? validateM3E052Q5OriginalDiagramCandidate({ root, baseCommit, inputCommit, envelope, manifestFile, files })
    : [M2S1_SVG7_IMAGE_POINTER_PROFILE, M2S1_SVG7_Q24_ORIGIN_PROFILE].includes(manifestFile.value.transportProfile)
      ? validateM2s1Svg7ImagePointerCandidate({ root, baseCommit, inputCommit, envelope, manifestFile, files })
      : manifestFile.value.transportProfile === M2_PROBLEM_IMAGE_REPAIR8_PROFILE
        ? validateM2ProblemImageRepair8Candidate({ root, baseCommit, inputCommit, envelope, manifestFile, files })
        : validateClosedInputGraph({ root, baseCommit, inputCommit, envelope, manifestFile, files });
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
  const materialize = manifestFile.value.transportProfile === E041_CHOICE_CORRECTION_PROFILE
    ? materializeE041OriginalChoiceCorrection : manifestFile.value.transportProfile === M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE
    ? materializeM3E052Q5OriginalDiagram : [M2S1_SVG7_IMAGE_POINTER_PROFILE, M2S1_SVG7_Q24_ORIGIN_PROFILE].includes(manifestFile.value.transportProfile)
      ? materializeM2s1Svg7ImagePointer : manifestFile.value.transportProfile === M2_PROBLEM_IMAGE_REPAIR8_PROFILE
        ? materializeM2ProblemImageRepair8 : materializeReviewedSourceMetadata;
  await materialize({ repoRoot: root, manifest: manifestFile.value,
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
    sourceFileCount: sourceRows.length, inputFileCount: inspected.files.size, unstoredFields: [...UNSTORED_FIELDS].sort(),
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
