// An explicit operational retry may read the same ACTIVE unit/subunit labels as
// reviewed-exam-registration-v2. It does not grant FINAL_QA, REVIEW2, or audit authority.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const CANONICAL_PARENT_RETRY_SCHEMA = 'archive-main-auto-canonical-parent-retry-v1';
export const CANONICAL_PARENT_RETRY_INDEX = 'archive/data/meta-foundation/main-auto-parent-retries-v1.json';
export const CANONICAL_PARENT_MASTER = 'archive/data/master_tables/js_archive_tag_master.json';
const PREFIX = 'archive/data/meta-foundation/evidence/main-auto-parent-retry/v1/';
const SHA = /^[a-f0-9]{64}$/, BLOB = /^[a-f0-9]{40}$/, UID = /^qid_v1_[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
export const canonicalParentRetryHash = value => crypto.createHash('sha256').update(stable(value)).digest('hex');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const requireThat = (ok, code) => { if (!ok) throw Error('CANONICAL_PARENT_RETRY:' + code); };
const exactKeys = (value, keys) => requireThat(value && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).sort().join('\0') === [...keys].sort().join('\0'), 'SCHEMA_KEYS');
function safePath(relative) {
  requireThat(typeof relative === 'string' && relative === relative.normalize('NFC') && relative.length < 600 &&
    !path.posix.isAbsolute(relative) && !/[\\\x00-\x1f\x7f]/.test(relative) &&
    !relative.split('/').some(p => !p || p === '.' || p === '..' || p === '.git'), 'PATH');
  return relative;
}
function readBytes(root, relative) {
  const base = fs.realpathSync(root), file = path.resolve(base, safePath(relative));
  requireThat(file.startsWith(base + path.sep) && fs.existsSync(file), 'FILE_MISSING');
  requireThat(fs.realpathSync(file) === file && fs.statSync(file).isFile(), 'FILE_MODE');
  return fs.readFileSync(file);
}
function readJson(root, relative) {
  try { return JSON.parse(readBytes(root, relative).toString('utf8')); }
  catch (error) { if (String(error.message).startsWith('CANONICAL_PARENT_RETRY:')) throw error; throw Error('CANONICAL_PARENT_RETRY:JSON'); }
}
function evidenceRef(ref) {
  exactKeys(ref, ['path', 'sha256']); safePath(ref.path); requireThat(SHA.test(ref.sha256), 'EVIDENCE_REF');
}
export function canonicalParentRetryRequests(root) {
  if (!fs.existsSync(path.join(root, CANONICAL_PARENT_RETRY_INDEX))) return [];
  const index = readJson(root, CANONICAL_PARENT_RETRY_INDEX);
  exactKeys(index, ['schemaVersion', 'requests']);
  requireThat(index.schemaVersion === 'archive-main-auto-canonical-parent-retry-index-v1' &&
    Array.isArray(index.requests) && index.requests.length > 0 && index.requests.length <= 20, 'INDEX');
  const seen = new Set();
  for (const ref of index.requests) {
    evidenceRef(ref); requireThat(ref.path.startsWith(PREFIX) && ref.path.endsWith('.json') && !seen.has(ref.path), 'REQUEST_PATH');
    seen.add(ref.path);
  }
  const statePath = path.join(root, '.archive-meta-register/auto/state.json');
  const completed = fs.existsSync(statePath) ? readJson(root, '.archive-meta-register/auto/state.json').completedCanonicalParentRetries || {} : {};
  return index.requests.filter(ref => {
    const done = completed[ref.sha256];
    if (!done) return true;
    // Closed requests are historical operations, not a reusable approval for a new source/master edition.
    // Explicit --canonical-parent-retry requests and replay still revalidate every current pin below.
    requireThat(done.requestPath === ref.path && done.requestSha256 === ref.sha256 &&
      Array.isArray(done.receipts) && done.receipts.length > 0, 'COMPLETION');
    const raw = readBytes(root, ref.path); requireThat(digest(raw) === ref.sha256, 'REQUEST_DIGEST');
    const request = JSON.parse(raw.toString('utf8'));
    requireThat(request.schemaVersion === CANONICAL_PARENT_RETRY_SCHEMA && Array.isArray(request.items) &&
      request.items.length === done.receipts.length, 'COMPLETION_SCOPE');
    const seenUids = new Set();
    for (const bound of done.receipts) {
      exactKeys(bound, ['questionUid', 'path', 'sha256']);
      requireThat(!seenUids.has(bound.questionUid) && /^\.archive-meta-register\/auto\/receipts\/[A-Za-z0-9_-]+\.json$/.test(bound.path), 'COMPLETION_RECEIPT');
      seenUids.add(bound.questionUid);
      const bytes = readBytes(root, bound.path); requireThat(digest(bytes) === bound.sha256, 'COMPLETION_RECEIPT_DIGEST');
      const receipt = JSON.parse(bytes.toString('utf8')), item = request.items.find(r => r.questionUid === bound.questionUid);
      requireThat(item && receipt.metadataRegistrationStatus === 'REGISTERED' && receipt.questionUid === bound.questionUid &&
        receipt.sourceArchiveFile === request.sourceArchiveFile && receipt.sourceOrdinal === item.sourceOrdinal &&
        receipt.canonicalParentRetry?.requestPath === ref.path && receipt.canonicalParentRetry?.requestSha256 === ref.sha256 &&
        receipt.canonicalParentRetry?.metadataBeforeSha256 === item.metadataBeforeSha256 &&
        receipt.canonicalParentRetry?.masterSha256 === request.masterRef.sha256, 'COMPLETION_RECEIPT_SCOPE');
    }
    return false;
  });
}
export function loadCanonicalParentRetry(root, relative, expectedSha256) {
  safePath(relative); requireThat(relative.startsWith(PREFIX) && /^[A-Za-z0-9_-]+\.json$/.test(relative.slice(PREFIX.length)), 'REQUEST_PATH');
  const raw = readBytes(root, relative), requestSha256 = digest(raw), request = JSON.parse(raw.toString('utf8'));
  requireThat(SHA.test(expectedSha256 || '') && requestSha256 === expectedSha256, 'REQUEST_DIGEST');
  exactKeys(request, ['schemaVersion', 'requestId', 'scope', 'approvalBasis', 'independentReviewClaim',
    'sourceArchiveFile', 'sourceBlobSha1', 'sourceSha256', 'expectedQuestionCount', 'baseCommit',
    'priorSourceBlobSha1', 'priorSourceSha256', 'registrySha', 'masterRef', 'evidenceRefs', 'items']);
  requireThat(request.schemaVersion === CANONICAL_PARENT_RETRY_SCHEMA && request.scope === 'EXACT_UIDS' &&
    request.approvalBasis === 'MAIN_MERGED_EXPLICIT_METADATA' && request.independentReviewClaim === false &&
    /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(request.requestId), 'REQUEST_AUTHORITY');
  safePath(request.sourceArchiveFile);
  requireThat(/^original\/.+\.js$/.test(request.sourceArchiveFile) && BLOB.test(request.sourceBlobSha1) &&
    SHA.test(request.sourceSha256) && BLOB.test(request.baseCommit) && BLOB.test(request.priorSourceBlobSha1) &&
    SHA.test(request.priorSourceSha256) && /^sha256:[a-f0-9]{64}$/.test(request.registrySha) &&
    Number.isSafeInteger(request.expectedQuestionCount) && request.expectedQuestionCount > 0, 'SOURCE_DECLARATION');
  evidenceRef(request.masterRef); requireThat(request.masterRef.path === CANONICAL_PARENT_MASTER, 'MASTER_PATH');
  requireThat(Array.isArray(request.evidenceRefs) && request.evidenceRefs.length > 0 && request.evidenceRefs.length <= 20, 'EVIDENCE');
  for (const ref of [request.masterRef, ...request.evidenceRefs]) {
    evidenceRef(ref); requireThat(ref.path === CANONICAL_PARENT_MASTER || ref.path.startsWith('docs/operations/'), 'EVIDENCE_PATH');
    requireThat(digest(readBytes(root, ref.path)) === ref.sha256, 'EVIDENCE_DIGEST');
  }
  const master = readJson(root, CANONICAL_PARENT_MASTER); requireThat(Array.isArray(master), 'MASTER_SCHEMA');
  const sourceBytes = readBytes(root, 'archive/exams/' + request.sourceArchiveFile);
  requireThat(blob(sourceBytes) === request.sourceBlobSha1 && digest(sourceBytes) === request.sourceSha256, 'SOURCE_EDITION');
  requireThat(Array.isArray(request.items) && request.items.length > 0 && request.items.length <= request.expectedQuestionCount, 'ITEMS');
  const uids = new Set(), ordinals = new Set();
  for (const item of request.items) {
    exactKeys(item, ['questionUid', 'sourceOrdinal', 'metadataBeforeSha256', 'identitySha256', 'curriculum', 'standardCourse',
      'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey', 'L1', 'L2']);
    requireThat(UID.test(item.questionUid) && Number.isSafeInteger(item.sourceOrdinal) && item.sourceOrdinal > 0 &&
      item.sourceOrdinal <= request.expectedQuestionCount && SHA.test(item.metadataBeforeSha256) && SHA.test(item.identitySha256) &&
      !uids.has(item.questionUid) && !ordinals.has(item.sourceOrdinal), 'ITEM_IDENTITY');
    for (const key of ['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey', 'L1', 'L2'])
      requireThat(typeof item[key] === 'string' && item[key].trim().length > 0, 'ITEM_PARENT');
    uids.add(item.questionUid); ordinals.add(item.sourceOrdinal);
  }
  return { path: relative, requestSha256, request, master, sourceBytes };
}
export function canonicalParentRetryDependencies(root) {
  const paths = [CANONICAL_PARENT_RETRY_INDEX, 'archive/tools/meta-foundation/canonical-parent-retry.mjs'];
  for (const ref of canonicalParentRetryRequests(root)) {
    const state = loadCanonicalParentRetry(root, ref.path, ref.sha256), r = state.request;
    paths.push(ref.path, 'archive/exams/' + r.sourceArchiveFile, r.masterRef.path, ...r.evidenceRefs.map(e => e.path));
  }
  return [...new Set(paths)].sort();
}
export function canonicalParentRetryTargets(state) {
  const { request: r, path: requestPath, requestSha256 } = state;
  return r.items.map(item => [`${r.sourceArchiveFile}#${item.sourceOrdinal}`, {
    sourceArchiveFile: r.sourceArchiveFile, sourceOrdinal: item.sourceOrdinal, baseCommit: r.baseCommit,
    canonicalParentRetry: { path: requestPath, sha256: requestSha256 },
  }]);
}
export function resolveCanonicalParentRetry({ state, source, ordinal, question, previous, current, identity,
  registry, binding, candidate, nativeSource, priorReceipt, studentChanged, validatedCurriculum }) {
  const { request: r, requestSha256, master } = state;
  requireThat(source === r.sourceArchiveFile && nativeSource && Buffer.isBuffer(nativeSource.bytes) &&
    digest(nativeSource.bytes) === r.sourceSha256 && blob(nativeSource.bytes) === r.sourceBlobSha1 &&
    nativeSource.bank?.length === r.expectedQuestionCount && stable(nativeSource.bank[ordinal - 1]) === stable(question), 'SOURCE_CONTEXT');
  const matches = r.items.filter(item => item.questionUid === identity?.questionUid && item.sourceOrdinal === ordinal);
  requireThat(matches.length === 1 && current?.questionUid === identity?.questionUid, 'UID_SCOPE');
  const item = matches[0];
  requireThat(canonicalParentRetryHash(identity) === item.identitySha256, 'IDENTITY_DRIFT');
  requireThat(registry.status === 'ACTIVE' && registry.registrySha === r.registrySha, 'REGISTRY_DRIFT');
  requireThat(previous && studentChanged === false, 'STUDENT_CHANGE');
  requireThat(Buffer.isBuffer(nativeSource.previousSourceBytes) &&
    blob(nativeSource.previousSourceBytes) === r.priorSourceBlobSha1 &&
    digest(nativeSource.previousSourceBytes) === r.priorSourceSha256, 'PRIOR_SOURCE_EDITION');
  const proof = { schemaVersion: CANONICAL_PARENT_RETRY_SCHEMA, requestPath: state.path, requestSha256,
    masterPath: r.masterRef.path, masterSha256: r.masterRef.sha256, questionUid: item.questionUid,
    sourceArchiveFile: source, sourceOrdinal: ordinal, metadataBeforeSha256: item.metadataBeforeSha256,
    identitySha256: item.identitySha256 };
  const before = canonicalParentRetryHash(current) === item.metadataBeforeSha256;
  const registered = priorReceipt?.metadataRegistrationStatus === 'REGISTERED' &&
    stable(priorReceipt.canonicalParentRetry) === stable(proof) &&
    priorReceipt.registeredMetadataSha256 === canonicalParentRetryHash(current) &&
    priorReceipt.questionUid === item.questionUid && priorReceipt.sourceArchiveFile === source &&
    priorReceipt.sourceOrdinal === ordinal && priorReceipt.sourceSha256 === r.sourceSha256;
  requireThat(before || registered, 'METADATA_DRIFT');
  requireThat(binding.status === 'ACTIVE' && binding.curriculum === item.curriculum &&
    String(binding.standardCourse).replaceAll(' ', '') === item.standardCourse.replaceAll(' ', '') &&
    binding.standardUnitKey === item.standardUnitKey && binding.subUnitKey === item.subUnitKey &&
    binding.problemTypeKey === item.problemTypeKey, 'BINDING_PARENT');
  for (const field of ['standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey'])
    requireThat(candidate[field] === item[field], 'CANDIDATE_PARENT');
  requireThat(validatedCurriculum === item.curriculum &&
    (!candidate.curriculum || candidate.curriculum === item.curriculum) &&
    (!candidate.curriculumKey || candidate.curriculumKey === item.curriculum) &&
    String(candidate.standardCourse).replaceAll(' ', '') === item.standardCourse.replaceAll(' ', ''), 'CANDIDATE_COURSE');
  const units = master.filter(row => row.key === item.standardUnitKey), subs = master.filter(row => row.key === item.subUnitKey);
  requireThat(units.length === 1 && subs.length === 1 && units[0].keyType === 'standardUnitKey' &&
    subs[0].keyType === 'subUnitKey' && ['active', 'ACTIVE'].includes(units[0].status) &&
    ['active', 'ACTIVE'].includes(subs[0].status) && (subs[0].standardUnitKey || subs[0].parentKey) === item.standardUnitKey &&
    (!subs[0].parentKey || subs[0].parentKey === item.standardUnitKey) &&
    (!subs[0].standardUnitKey || subs[0].standardUnitKey === item.standardUnitKey), 'MASTER_PARENT');
  const L1 = binding.L1 || units[0].labelKo, L2 = binding.L2 || subs[0].labelKo;
  requireThat(typeof L1 === 'string' && L1.trim() && typeof L2 === 'string' && L2.trim() && L1 === item.L1 && L2 === item.L2, 'MASTER_LABEL');
  for (const row of [question, current]) for (const [field, value] of Object.entries({ L1, L2 }))
    requireThat(row[field] == null || row[field] === '' || row[field] === value, 'EXPLICIT_LABEL_CONFLICT');
  return { L1, L2, proof, digest: canonicalParentRetryHash(proof) };
}
