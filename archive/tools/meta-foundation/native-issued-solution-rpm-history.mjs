// Reuse one issued solution-only FINAL_QA fingerprint rebind. A distinct opt-in
// keeps the original repair and selected RPM definition bound to immutable Git.
// Every other approval value and current selected question must stay unchanged.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { validateRpmPrimaryProvenance } from './reviewed-rpm-provenance.mjs';
import { judgeLockedMaster } from './rpm-master-add-only.mjs';
import { readIssuedChildContinuity } from './native-issued-child-continuity.mjs';
import { REASSESSED_STUDENT_FIELDS } from './reviewed-source-reassessment.mjs';

export const ISSUED_SOLUTION_RPM_HISTORY_SCHEMA = 'archive-native-issued-solution-rpm-history-v1';
const CROSSWALK = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const META = 'archive/data/question_metadata.json', IDENTITY = 'archive/data/question_identity_map.json';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/, ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/;
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => stable(a) === stable(b);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const fail = message => { throw Error(`issued solution RPM history: ${message}`); };
const need = (condition, message) => { if (!condition) fail(message); };
const object = v => v && typeof v === 'object' && !Array.isArray(v);
const exactKeys = (v, keys) => object(v) && equal(Object.keys(v).sort(), [...keys].sort());
const empty = v => v === undefined || Array.isArray(v) && !v.length;
const contexts = new WeakMap(), immutable = new Map(), publishedStates = new Map(), ancestors = new Set();
const sourceFingerprint = q => sha(JSON.stringify({ content:q.content ?? null,
  choices:Array.isArray(q.choices) ? q.choices : null, answer:q.answer ?? null,
  solution:q.solution ?? null, image:q.image ?? null }));
const contentFingerprint = q => sha(JSON.stringify({ content:q.content ?? null,
  choices:Array.isArray(q.choices) ? q.choices : null, image:q.image ?? null }));
const pick = (q, fields) => Object.fromEntries(fields.map(key => [key, q?.[key] ?? null]));

function safe(root, relative) {
  need(typeof relative === 'string' && relative && !path.isAbsolute(relative) && !/[\\\x00-\x1f]/.test(relative)
    && relative.split('/').every(p => p && p !== '.' && p !== '..'), 'unsafe evidence path');
  const full = path.resolve(root, relative), base = path.resolve(root);
  for (let p = full; p !== base; p = path.dirname(p))
    need(!fs.existsSync(p) || !fs.lstatSync(p).isSymbolicLink(), 'symlink evidence input');
  return full;
}
const read = (root, relative) => fs.readFileSync(safe(root, relative));
function run(root, args) {
  try { return execFileSync('git', args, { cwd: root, env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
    maxBuffer: 192 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { fail(`immutable Git input unavailable: ${args[0]}`); }
}
function gitFile(root, commit, relative, retain = true) {
  safe(root, relative); need(SHA1.test(commit || ''), 'exact prior commit required');
  const key = `${path.resolve(root)}:${commit}:${relative}`;
  if (retain && immutable.has(key)) return immutable.get(key);
  need(run(root, ['rev-parse', '--verify', `${commit}^{commit}`]).toString().trim() === commit, 'prior commit mismatch');
  const entry = run(root, ['ls-tree', '-z', commit, '--', relative]).toString();
  need(/^100644 blob [a-f0-9]{40}\t[^\0]+\0$/.test(entry)
    && entry.slice(entry.indexOf('\t') + 1, -1) === relative, 'regular immutable file required');
  const gitBlobSha1 = entry.slice(0, entry.indexOf('\t')).split(' ')[2];
  const bytes = run(root, ['cat-file', 'blob', gitBlobSha1]);
  need(blob(bytes) === gitBlobSha1, 'immutable blob digest mismatch');
  const value = { bytes, sha256: sha(bytes), gitBlobSha1 };
  if (retain) immutable.set(key, value);
  return value;
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail('invalid JSON evidence'); } }
function bank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  try { vm.runInNewContext(bytes.toString(), ctx, { timeout: 5000 }); } catch { fail('invalid source bank'); }
  const rows = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  need(Array.isArray(rows) && rows.length, 'source bank missing');
  return JSON.parse(JSON.stringify(rows));
}
function only(rows, uid, label) {
  need(Array.isArray(rows), `${label} missing`);
  const found = rows.filter(r => r?.questionUid === uid);
  need(found.length === 1, `${label} UID missing or ambiguous`); return found[0];
}
function oneReceipt(receipt, uid, ordinal) {
  need(receipt?.schemaVersion === 'archive-reviewed-exam-meta-registration-v2'
    && receipt.metadataRegistrationStatus === 'REGISTERED' && ID.test(receipt.requestId || '')
    && SHA256.test(receipt.requestSha256 || '') && receipt.scope === 'PARTIAL_UIDS'
    && receipt.totalQuestions === 1 && receipt.partialUidCount === 1
    && Number.isSafeInteger(receipt.expectedQuestionCount) && receipt.expectedQuestionCount > 1
    && receipt.registrationMode === undefined && receipt.approval?.type === 'FINAL_QA'
    && receipt.approval.metadataReviewed === true && typeof receipt.approval.approvedBy === 'string'
    && receipt.approval.approvedBy.trim(), 'issued one-UID FINAL_QA receipt required');
  for (const key of ['appliedRecords', 'appliedIdentityRecords', 'runtimeRecords'])
    need(receipt[key]?.length === 1 && receipt[key][0].questionUid === uid
      && receipt[key][0].sourceOrdinal === ordinal && receipt[key][0].sourceArchiveFile === receipt.sourceArchiveFile,
    `issued ${key} scope mismatch`);
  need(receipt.appliedRecords[0].metadataApprovalType === 'FINAL_QA' && receipt.runtimeRecords[0].metadataApprovalType === 'FINAL_QA', 'issued selected approval type changed');
  return { current: receipt.appliedRecords[0], identity: receipt.appliedIdentityRecords[0], runtimeRecord: receipt.runtimeRecords[0] };
}
function noRenderer(question) {
  const rendererKeys = new Set(['image', 'images', 'figureSvg', 'svg', 'solutionImage', 'solutionImages', 'solutionFigureSvg']);
  const visit = (value, key = '') => {
    if (rendererKeys.has(key)) need(value === undefined || value === null || value === ''
      || Array.isArray(value) && value.length === 0, 'v1 is confined to text-only unchanged questions');
    if (Array.isArray(value)) value.forEach(child => visit(child, key));
    else if (object(value)) Object.entries(value).forEach(([childKey, child]) => visit(child, childKey));
  };
  visit(question);
  need(!/(?:archive\/)?assets\/|<(?:img|svg|object|iframe|image|use)\b|\b(?:src|srcset|href|xlink:href)\s*=|url\s*\(/i.test(JSON.stringify(question)),
    'renderer reference outside text-only v1');
}
function without(obj, fields) { return Object.fromEntries(Object.entries(obj).filter(([key]) => !fields.includes(key))); }
function selectedImagePath(question) {
  const image = question.image;
  if (image === undefined || image === null || image === '') { noRenderer(question); return null; }
  need(typeof image === 'string' && /^assets\/images\/[^/?#%]+\/[^/?#%]+\.png$/.test(image)
    && image.split('/').every(part => part && part !== '.' && part !== '..')
    && !/[\\\x00-\x1f]/.test(image), 'only one existing local PNG image is supported');
  noRenderer(without(question, ['image']));
  return `archive/${image}`;
}

// This is a separate contract from the FP0 history route. Its only accepted
// original change is the exact already-issued native solution-only rebind.
// It never interprets the solution, authorizes a replacement or creates a review.
function solutionRepair(root, prior, sourceBank, uid, ordinal) {
  need(prior.fingerprintRepairs?.length === 1 && empty(prior.registryChanges)
    && empty(prior.nativeParentBindings) && prior.newMetadataApprovals === undefined
    && prior.preservedMetadataApprovals === undefined, 'one original solution rebind required');
  const repair = prior.fingerprintRepairs[0];
  need(exactKeys(repair, ['questionUid','sourceOrdinal','metadataBefore','identityBefore','after','rebind'])
    && repair.questionUid === uid && repair.sourceOrdinal === ordinal
    && exactKeys(repair.metadataBefore, ['sourceFingerprint','contentFingerprint'])
    && exactKeys(repair.identityBefore, ['sourceFingerprint'])
    && exactKeys(repair.after, ['sourceFingerprint','contentFingerprint'])
    && exactKeys(repair.rebind, ['priorSourceBlobSha1','priorContentFingerprint'])
    && SHA1.test(repair.rebind.priorSourceBlobSha1 || '')
    && [...Object.values(repair.metadataBefore), ...Object.values(repair.identityBefore),
      ...Object.values(repair.after), repair.rebind.priorContentFingerprint]
      .every(value => SHA256.test(value || '')), 'original solution rebind shape changed');
  const bytes = run(root, ['cat-file','blob',repair.rebind.priorSourceBlobSha1]);
  need(blob(bytes) === repair.rebind.priorSourceBlobSha1, 'original repair Git blob changed');
  const beforeBank = bank(bytes), before = beforeBank[ordinal - 1], question = sourceBank[ordinal - 1];
  need(beforeBank.length === prior.expectedQuestionCount && before && question
    && typeof before.solution === 'string' && typeof question.solution === 'string'
    && before.solution !== question.solution
    && equal(pick(before, REASSESSED_STUDENT_FIELDS.filter(field => field !== 'solution')),
      pick(question, REASSESSED_STUDENT_FIELDS.filter(field => field !== 'solution'))),
  'original repair must change only the solution student field');
  need(selectedImagePath(before) === selectedImagePath(question), 'original solution repair renderer path changed');
  const beforeSource = sourceFingerprint(before), content = contentFingerprint(before), afterSource = sourceFingerprint(question);
  need(repair.metadataBefore.sourceFingerprint === beforeSource
    && repair.identityBefore.sourceFingerprint === beforeSource
    && repair.metadataBefore.contentFingerprint === content
    && repair.rebind.priorContentFingerprint === content
    && repair.after.sourceFingerprint === afterSource && repair.after.contentFingerprint === content
    && contentFingerprint(question) === content
    && prior.appliedRecords[0].sourceFingerprint === afterSource
    && prior.appliedRecords[0].contentFingerprint === content
    && prior.appliedIdentityRecords[0].sourceFingerprint === afterSource,
  'original solution repair fingerprints changed');
  return { bytes, bank:beforeBank, question:before, blobSha1:repair.rebind.priorSourceBlobSha1,
    sourceFingerprintBefore:beforeSource, sourceFingerprintAfter:afterSource, contentFingerprint:content };
}

function validateSelectedImage(history) {
  const {root, commit, prior, envelope, oldBank, sourceBank, originalRepair, ordinal, uid} = history;
  const imagePath = selectedImagePath(oldBank[ordinal - 1]);
  need(selectedImagePath(sourceBank[ordinal - 1]) === imagePath
    && selectedImagePath(originalRepair.question) === imagePath, 'selected renderer path changed');
  const sourceCommit = history.childSidecar ? history.childSidecar.imageProof.sourceCommit
    : envelope.approval.sourceRebind.historicalSolutionRpmEvidence.assetProofSourceCommit;
  if (!imagePath) { need(sourceCommit === undefined, 'text-only history cannot carry an image proof commit'); return null; }
  need(SHA1.test(sourceCommit || ''), 'exact image-proof source commit required');
  const sourcePath = `archive/exams/${prior.sourceArchiveFile}`;
  const matches = [];
  for (const ref of prior.approval.evidenceRefs) {
    const bytes = gitFile(root, commit, ref.path).bytes;
    let doc; try { doc = JSON.parse(bytes); } catch { continue; }
    if (doc.schemaVersion === 'archive-narrow-metadata-independent-crosscheck-v1'
      && doc.questionUid === uid && doc.sourceOrdinal === ordinal && doc.source?.path === sourcePath
      && doc.image?.path === imagePath) matches.push({ref,doc});
  }
  need(matches.length === 1, 'one original issued independent PNG proof required');
  const {ref,doc} = matches[0];
  need(SHA256.test(doc.image.sha256 || '') && doc.image.visuallyInspected === true
    && SHA1.test(doc.source.gitBlobSha1 || '') && SHA256.test(doc.source.sha256 || ''),
  'original independent source and PNG digests required');
  const ancestryKey = `${root}:${sourceCommit}:${commit}`;
  if (!ancestors.has(ancestryKey)) { run(root, ['merge-base', '--is-ancestor', sourceCommit, commit]); ancestors.add(ancestryKey); }
  const proofSource = gitFile(root, sourceCommit, sourcePath), proofBank = bank(proofSource.bytes);
  need(proofSource.gitBlobSha1 === doc.source.gitBlobSha1 && proofSource.sha256 === doc.source.sha256
    && proofBank.length === prior.expectedQuestionCount
    && selectedImagePath(proofBank[ordinal - 1]) === imagePath
    && equal(pick(proofBank[ordinal - 1], REASSESSED_STUDENT_FIELDS.filter(field => field !== 'solution')),
      pick(oldBank[ordinal - 1], REASSESSED_STUDENT_FIELDS.filter(field => field !== 'solution'))),
  'independent proof source or non-solution student fields changed');
  const proofImage = gitFile(root, sourceCommit, imagePath), issuedImage = gitFile(root, commit, imagePath), currentImage = read(root, imagePath);
  need(proofImage.sha256 === doc.image.sha256 && issuedImage.sha256 === doc.image.sha256
    && proofImage.gitBlobSha1 === issuedImage.gitBlobSha1 && sha(currentImage) === doc.image.sha256
    && blob(currentImage) === proofImage.gitBlobSha1 && currentImage.equals(proofImage.bytes),
  'original approved PNG bytes changed');
  const imageRef = {path:imagePath,sha256:doc.image.sha256};
  if (history.childSidecar) need(equal(history.childSidecar.imageProof.assetRef,imageRef),
    'exact original PNG must bind the authenticated child sidecar');
  else need(envelope.approval.evidenceRefs.some(value => equal(value,imageRef))
    && (envelope.schemaVersion === 'archive-reviewed-exam-meta-registration-v2'
      || envelope.items[0].evidenceRefs.some(value => equal(value,imageRef))),
  'exact current PNG must bind request approval and item evidence');
  return {schemaVersion:'archive-issued-solution-image-continuity-v1',originalIndependentProofRef:ref,
    proofPublishedCommit:commit,assetProofSourceCommit:sourceCommit,proofSourceBlobSha1:proofSource.gitBlobSha1,
    assetRef:imageRef,assetGitBlobSha1:proofImage.gitBlobSha1,originalSolutionCursorImagePathUnchanged:true};
}

function currentTaxonomy(history) {
  const { root, commit, prior } = history, selected = prior.appliedRecords[0];
  const refs = prior.approval.evidenceRefs.filter(ref =>
    /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9_-]+\/taxonomy\.json$/.test(ref.path));
  need(refs.length === 1, 'one exact original PT/TPL taxonomy evidence required');
  const ref = refs[0], historical = gitFile(root, commit, ref.path), current = read(root, ref.path);
  need(historical.sha256 === ref.sha256 && sha(current) === ref.sha256, 'selected taxonomy evidence changed');
  const doc = parse(current), pt = (doc.problemTypes || []).filter(row => row.problemTypeKey === selected.problemTypeKey),
    tpl = (doc.templates || []).filter(row => row.templateKey === selected.templateKey);
  need(pt.length === 1 && tpl.length === 1 && pt[0].status === 'ACTIVE' && tpl[0].status === 'ACTIVE'
    && tpl[0].parentProblemTypeKey === pt[0].problemTypeKey
    && tpl[0].ownerPack === pt[0].ownerPack, 'selected ACTIVE PT/TPL definition changed');
  return { taxonomyRef:ref, problemTypeKey:pt[0].problemTypeKey, problemTypeSha256:sha(stable(pt[0])),
    templateKey:tpl[0].templateKey, templateSha256:sha(stable(tpl[0])) };
}

function validateCurrentCrosswalk(history) {
  if (history.childContext) readIssuedChildContinuity(history.childContext, {root:history.root,kind:'SOLUTION_REBIND_FP1'});
  const { root, oldCrosswalk, crosswalkRef, masterRef, prior, sourceBank, ordinal } = history;
  const currentBytes = read(root, CROSSWALK), current = parse(currentBytes), old = parse(oldCrosswalk.bytes);
  need(old.schemaVersion === 'rpm-primary-active-crosswalk-v1' && old.status === 'ACTIVE_REFERENCE'
    && old.rpmAuthority?.source === MASTER
    && equal(without(current, ['records', 'summary']), without(old, ['records', 'summary'])), 'crosswalk authority changed');
  need(Array.isArray(old.records) && Array.isArray(current.records), 'crosswalk rows missing');
  const byId = rows => {
    const result = new Map();
    for (const row of rows) { need(typeof row?.id === 'string' && row.id && !result.has(row.id), 'duplicate or invalid RPM row'); result.set(row.id, row); }
    return result;
  };
  const before = byId(old.records), now = byId(current.records);
  need(now.size >= before.size && [...before.keys()].every(id => now.has(id)), 'old RPM inventory removed');
  const selectedId = prior.rpmPrimaryBindings[0].recordId;
  need(before.has(selectedId) && equal(before.get(selectedId), now.get(selectedId)), 'selected RPM row changed');
  // The master is add-only: the pinned bytes may be an older Git revision that the current master still contains.
  const masterBytes = read(root, MASTER);
  need(judgeLockedMaster({ root, pinnedSha256: masterRef.sha256, currentBytes: masterBytes }).ok, 'LOCKED master bytes changed');
  const master = parse(masterBytes);
  need(master.schemaVersion === 'js-archive-taxonomy-rpm-primary-v1.0' && master.authorityStatus === 'LOCKED', 'LOCKED master authority changed');
  const original = prior.rpmPrimaryBindings[0];
  const live = validateRpmPrimaryProvenance({ root, question: sourceBank[ordinal - 1], final: prior.appliedRecords[0], cache: new Map() });
  need(live && live.crosswalkRef.path === CROSSWALK && live.crosswalkRef.sha256 === sha(currentBytes)
    && live.masterRef.path === MASTER && live.masterRef.sha256 === sha(masterBytes)
    && equal({ ...live, crosswalkRef, masterRef }, without(original, ['questionUid', 'sourceOrdinal'])), 'selected current RPM provenance changed');
  const definitions = currentTaxonomy(history);
  return { currentCrosswalkRef: { path: CROSSWALK, sha256: sha(currentBytes) },
    currentCrosswalkGitBlobSha1: blob(currentBytes), oldRowCount: before.size, currentRowCount: now.size,
    selectedRecordId: original.recordId, selectedRowSha256: sha(stable(now.get(original.recordId))),
    unrelatedChangedRecordIds:[...before].filter(([id,row]) => id !== selectedId && !equal(row,now.get(id))).map(([id]) => id).sort(),
    ...definitions, selectedImageContinuity:validateSelectedImage(history) };
}

export function hasIssuedSolutionRpmHistory(envelope) {
  return Object.hasOwn(envelope?.approval?.sourceRebind || {}, 'historicalSolutionRpmEvidence');
}

// Every caller supplies state already read from the current registrar/native
// context. A reused receipt may be an ancestor of the live receipt, but only
// after the ordinary source-only chain has authenticated that exact state.
export function loadIssuedSolutionRpmHistory(args) { return loadHistory(args, null); }

export function loadIssuedSolutionRpmChildContinuity({ childContext, ...args }) {
  readIssuedChildContinuity(childContext, { root:args.root,receipt:args.envelope,kind:'SOLUTION_REBIND_FP1' });
  return loadHistory(args, childContext);
}

function loadHistory({ root, envelope, bytes, bank: questions, current, identity, runtimeRecord, headSha }, childContext) {
  const authenticatedChild = childContext ? readIssuedChildContinuity(childContext, {root,receipt:envelope,kind:'SOLUTION_REBIND_FP1'}) : null;
  if (!authenticatedChild && !hasIssuedSolutionRpmHistory(envelope)) return null;
  root = fs.realpathSync(root);
  const spec = envelope.approval.sourceRebind, marker = authenticatedChild
    ? {schemaVersion:ISSUED_SOLUTION_RPM_HISTORY_SCHEMA,priorReceiptCommit:authenticatedChild.sidecar.priorPublishedCommit, assetProofSourceCommit:authenticatedChild.sidecar.imageProof.sourceCommit}
    : spec.historicalSolutionRpmEvidence, ref = spec.priorReceiptRef;
  need(exactKeys(spec, authenticatedChild ? ['priorReceiptRef'] : ['priorReceiptRef', 'historicalSolutionRpmEvidence'])
    && exactKeys(marker, Object.hasOwn(marker || {},'assetProofSourceCommit')
      ? ['schemaVersion','priorReceiptCommit','assetProofSourceCommit'] : ['schemaVersion','priorReceiptCommit'])
    && marker.schemaVersion === ISSUED_SOLUTION_RPM_HISTORY_SCHEMA && SHA1.test(marker.priorReceiptCommit || '')
    && (marker.assetProofSourceCommit === undefined || SHA1.test(marker.assetProofSourceCommit)), 'explicit historical RPM options required');
  need(exactKeys(ref, ['path', 'sha256']) && SHA256.test(ref.sha256 || '')
    && typeof ref.path === 'string' && ref.path.startsWith(RECEIPTS) && ID.test(ref.path.slice(RECEIPTS.length, -5))
    && ref.path.endsWith('.json'), 'exact predecessor reference required');
  need(ID.test(envelope.requestId || '') && envelope.scope === 'PARTIAL_UIDS' && envelope.registrationMode === undefined
    && envelope.approval.type === 'FINAL_QA' && envelope.approval.metadataReviewed === true
    && empty(envelope.registryChanges) && envelope.approval.rendererPreservation === undefined
    && /^original\/middle\/m2\/(1mid|1final)\/[^/]+\.js$/.test(envelope.sourceArchiveFile || ''), 'exclusive M2S1 FINAL_QA source-only scope required');
  const issued = envelope.schemaVersion === 'archive-reviewed-exam-meta-registration-v2';
  need(issued || envelope.schemaVersion === 'archive-reviewed-exam-meta-register-request-v2', 'request or issued receipt required');
  const items = issued ? envelope.appliedRecords : envelope.items;
  need(items?.length === 1 && typeof items[0].questionUid === 'string'
    && Number.isSafeInteger(items[0].sourceOrdinal) && items[0].sourceOrdinal > 0
    && items[0].sourceOrdinal <= envelope.expectedQuestionCount, 'one selected UID required');
  const { questionUid: uid, sourceOrdinal: ordinal } = items[0];
  need(Array.isArray(envelope.approval.evidenceRefs) && envelope.approval.evidenceRefs.some(r => equal(r, ref)), 'predecessor must bind approval evidence');
  if (!issued) need(equal(items[0].before, {}) && equal(items[0].after, {})
    && Object.keys(items[0]).every(k => ['questionUid', 'sourceOrdinal', 'before', 'after', 'reason', 'evidenceRefs'].includes(k))
    && items[0].evidenceRefs?.some(r => equal(r, ref)), 'value-free item with predecessor evidence required');
  const commit = marker.priorReceiptCommit;
  const head = headSha || run(root, ['rev-parse', 'HEAD']).toString().trim();
  need(SHA1.test(head), 'exact current HEAD required');
  const ancestryKey = `${root}:${commit}:${head}`;
  if (!ancestors.has(ancestryKey)) { run(root, ['merge-base', '--is-ancestor', commit, head]); ancestors.add(ancestryKey); }
  const raw = read(root, ref.path), original = gitFile(root, commit, ref.path);
  need(sha(raw) === ref.sha256 && original.sha256 === ref.sha256 && raw.equals(original.bytes), 'published predecessor receipt digest changed');
  const prior = parse(raw), oldState = oneReceipt(prior, uid, ordinal);
  need(ref.path === `${RECEIPTS}${prior.requestId}.json` && prior.requestId !== envelope.requestId
    && prior.examUid === envelope.examUid && prior.sourceArchiveFile === envelope.sourceArchiveFile
    && prior.expectedQuestionCount === envelope.expectedQuestionCount
    && prior.approval.sourceRebind === undefined && prior.approval.rendererPreservation === undefined
    && prior.fingerprintRepairs?.length === 1 && empty(prior.nativeParentBindings) && empty(prior.registryChanges)
    && prior.rpmPrimaryBindings?.length === 1 && prior.rpmPrimaryBindings[0].questionUid === uid
    && prior.rpmPrimaryBindings[0].sourceOrdinal === ordinal
    && prior.rpmPrimaryBindings[0].authorityUse === 'RPM_PATH_PROVENANCE_ONLY'
    && prior.rpmPrimaryBindings[0].selectsPtTpl === false, 'issued solution-rebind RPM predecessor required');
  // The actual preservation actor may differ from the original reviewer.
  // The authenticated child must retain every original selected authority field.
  if (!authenticatedChild) need(equal(without(envelope.approval, ['evidenceRefs', 'sourceRebind']), without(prior.approval, ['evidenceRefs'])), 'original approval fields changed');
  const sourcePath = `archive/exams/${envelope.sourceArchiveFile}`, oldSource = gitFile(root, commit, sourcePath);
  const oldBank = bank(oldSource.bytes);
  need(oldSource.gitBlobSha1 === prior.sourceBlobSha1 && oldSource.sha256 === prior.sourceRawSha256
    && Buffer.isBuffer(bytes) && Array.isArray(questions) && equal(bank(bytes), JSON.parse(JSON.stringify(questions)))
    && oldBank.length === envelope.expectedQuestionCount && questions.length === oldBank.length
    && blob(bytes) === (issued ? envelope.sourceBlobSha1 : envelope.expectedSourceBlobSha1)
    && (!issued || sha(bytes) === envelope.sourceRawSha256) && !oldSource.bytes.equals(bytes), 'source snapshot or denominator mismatch');
  if (!issued) need(read(root, sourcePath).equals(bytes), 'supplied source differs from live current file');
  need(equal(oldBank[ordinal - 1], JSON.parse(JSON.stringify(questions[ordinal - 1]))), 'selected whole question changed');
  selectedImagePath(oldBank[ordinal - 1]);
  const originalRepair = solutionRepair(root, prior, oldBank, uid, ordinal);
  // PR proof generation selects again after applying the same fixed request.
  // Recognize only its exact issued receipt, never an arbitrary old/new row.
  const issuedPath = `${RECEIPTS}${envelope.requestId}.json`;
  if (!issued && fs.existsSync(safe(root, issuedPath))) {
    const registered = parse(read(root, issuedPath));
    need(registered.requestSha256 === sha(stable(envelope)) && equal(registered.approval, envelope.approval)
      && registered.requestId === envelope.requestId && registered.examUid === envelope.examUid
      && registered.sourceArchiveFile === envelope.sourceArchiveFile
      && registered.sourceBlobSha1 === envelope.expectedSourceBlobSha1
      && registered.expectedQuestionCount === envelope.expectedQuestionCount
      && registered.appliedRecords?.length === 1 && registered.appliedRecords[0].questionUid === uid
      && registered.appliedRecords[0].sourceOrdinal === ordinal, 'post-write request or issued receipt differs');
    need(equal(readIssuedSolutionRpmCurrentState(root, envelope), { current, identity, runtimeRecord }), 'post-write supplied state differs from live current tables');
    return loadIssuedSolutionRpmHistory({ root, envelope: registered, bytes, bank: questions, current, identity, runtimeRecord, headSha: head });
  }
  const historyKey = `${root}:${commit}:${ref.path}:${ref.sha256}`;
  if (!publishedStates.has(historyKey)) {
    const metadata = parse(gitFile(root, commit, META, false).bytes), ids = parse(gitFile(root, commit, IDENTITY, false).bytes);
    const pack = oldState.current.metaFoundationPackId;
    need(/^[A-Z][A-Z0-9_]*$/.test(pack || ''), 'invalid original runtime owner');
    const runtimePath = `archive/data/meta-foundation/runtime/${pack.toLowerCase().replaceAll('_', '-')}-v1.json`;
    const runtime = parse(gitFile(root, commit, runtimePath, false).bytes);
    need(runtime.packId === pack && runtime.status === 'ACTIVE'
      && equal(only(metadata.records, uid, 'published metadata'), oldState.current)
      && equal(only(ids.records, uid, 'published identity'), oldState.identity)
      && equal(only(runtime.records, uid, 'published runtime'), oldState.runtimeRecord), 'predecessor was not the actual published selected state');
    publishedStates.set(historyKey, true);
  }
  const proof = prior.rpmPrimaryBindings[0], crosswalkRef = proof.crosswalkRef, masterRef = proof.masterRef;
  need(exactKeys(crosswalkRef, ['path', 'sha256']) && crosswalkRef.path === CROSSWALK && SHA256.test(crosswalkRef.sha256 || '')
    && exactKeys(masterRef, ['path', 'sha256']) && masterRef.path === MASTER && SHA256.test(masterRef.sha256 || ''), 'exact issued RPM authority refs required');
  need(Array.isArray(prior.approval.evidenceRefs) && prior.approval.evidenceRefs.length
    && prior.approval.evidenceRefs.some(r => equal(r, crosswalkRef)) && prior.approval.evidenceRefs.some(r => equal(r, masterRef)), 'issued RPM evidence refs missing');
  const refPaths = new Set();
  for (const evidence of prior.approval.evidenceRefs) {
    need(exactKeys(evidence, ['path', 'sha256']) && SHA256.test(evidence.sha256 || '') && !refPaths.has(evidence.path), 'invalid or duplicate original evidence');
    refPaths.add(evidence.path);
    const originalEvidence = gitFile(root, commit, evidence.path);
    need(originalEvidence.sha256 === evidence.sha256, 'original immutable evidence digest changed');
    if (evidence.path.startsWith(RECEIPTS)) {
      const label = parse(originalEvidence.bytes);
      need(evidence.path.endsWith('.parent-labels.json')
        && label.schemaVersion === 'archive-meta-pipeline-parent-label-evidence-v1',
      'only the original typed parent-label artifact may share the receipt directory');
    }
    if (evidence.path === MASTER) need(judgeLockedMaster({ root, pinnedSha256: evidence.sha256 }).ok, 'non-RPM current evidence changed');
    else if (evidence.path !== CROSSWALK) need(sha(read(root, evidence.path)) === evidence.sha256, 'non-RPM current evidence changed');
  }
  const expected = issued ? oneReceipt(envelope, uid, ordinal) : oldState;
  if (issued) {
    const evidence = [...new Set([...oldState.current.approvalEvidence, `${RECEIPTS}${envelope.requestId}.json`])];
    const revision = `meta-foundation:${oldState.current.metaFoundationPackId}@${oldState.current.metaFoundationPackVersion}:exam-final_qa-v2:${envelope.requestId}`;
    need(envelope.newMetadataApprovals === 0 && envelope.preservedMetadataApprovals === 1
      && empty(envelope.fingerprintRepairs) && empty(envelope.nativeParentBindings)
      && equal(expected.current, { ...oldState.current, approvalEvidence: evidence, metadataRevision: revision })
      && equal(expected.runtimeRecord, { ...oldState.runtimeRecord, approvalEvidence: evidence, metadataRevision: revision })
      && equal(expected.identity, oldState.identity), 'issued preservation changes original authority or values');
    need(equal(parse(read(root, `${RECEIPTS}${envelope.requestId}.json`)), envelope), 'issued envelope differs from local receipt');
  }
  need(equal(current, expected.current) && equal(identity, expected.identity) && equal(runtimeRecord, expected.runtimeRecord), 'selected current metadata, identity or runtime changed');
  if (!issued) need(equal(readIssuedSolutionRpmCurrentState(root, envelope), { current, identity, runtimeRecord }), 'supplied state differs from live current tables');
  const history = { childContext, childSidecar:authenticatedChild?.sidecar, root, commit, ref, prior, envelope:structuredClone(envelope), oldState, oldSource, oldBank, ordinal, uid, originalRepair,
    sourceBank: JSON.parse(JSON.stringify(questions)), crosswalkRef, masterRef, oldCrosswalk: gitFile(root, commit, CROSSWALK) };
  const currentCanonical = validateCurrentCrosswalk(history);
  const descriptor = { schemaVersion: ISSUED_SOLUTION_RPM_HISTORY_SCHEMA, priorReceiptCommit: commit, priorReceiptRef: ref,
    historicalCrosswalkRef: crosswalkRef, historicalCrosswalkGitBlobSha1: history.oldCrosswalk.gitBlobSha1,
    masterRef, ...currentCanonical, questionUid: uid, sourceOrdinal: ordinal,
    wholeQuestionSha256: sha(stable(oldBank[ordinal - 1])), originalSolutionSourceBlobSha1:originalRepair.blobSha1,
    sourceFingerprintBefore:originalRepair.sourceFingerprintBefore, sourceFingerprintAfter:originalRepair.sourceFingerprintAfter,
    contentFingerprint:originalRepair.contentFingerprint, requiredNativeCursors:['ISSUED','ORIGINAL_SOLUTION'], newMetadataApprovals: 0 };
  const freeze = value => {
    if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); }
    return value;
  };
  const context = Object.freeze({ descriptor: freeze(structuredClone(descriptor)) });
  contexts.set(context, history); return context;
}

// A token cannot be made by data in a request or by an arbitrary nativeSource
// property: it must have passed the complete validator in this module instance.
export function assertIssuedSolutionRpmHistoricalLeaf({ context, receipt, nativeSource, current, identity, ordinal, previous }) {
  const h = contexts.get(context); need(h, 'validated historical context required');
  need(equal(receipt, h.prior) && ordinal === h.ordinal && equal(current, h.oldState.current)
    && equal(identity, h.oldState.identity) && equal(nativeSource.runtimeRecord, h.oldState.runtimeRecord)
    && nativeSource.root === h.root && Buffer.isBuffer(nativeSource.bytes) && nativeSource.bytes.equals(h.oldSource.bytes)
    && nativeSource.blobSha1 === h.prior.sourceBlobSha1 && equal(nativeSource.bank, h.oldBank)
    && (equal(previous,h.oldBank[ordinal - 1]) || equal(previous,h.originalRepair.question)),
  'historical leaf context differs from issued predecessor or original cursor');
  validateCurrentCrosswalk(h);
}
export function readIssuedSolutionRpmHistoricalEvidence(context, receipt, ref) {
  const h = contexts.get(context); need(h && equal(receipt, h.prior)
    && h.prior.approval.evidenceRefs.some(r => equal(r, ref)), 'reference is not an authenticated original approval input');
  if (ref.path === CROSSWALK) { validateCurrentCrosswalk(h); return h.oldCrosswalk.bytes; }
  const bytes = read(h.root, ref.path);
  if (ref.path === MASTER) {
    const kept = judgeLockedMaster({ root: h.root, pinnedSha256: ref.sha256, currentBytes: bytes });
    need(kept.ok, 'ordinary evidence digest changed'); return kept.bytes;
  }
  need(sha(bytes) === ref.sha256, 'ordinary evidence digest changed'); return bytes;
}

// The context only selects authentic historical inputs. The existing official
// native verifier must still accept both its caught-up cursor and the actual
// original solution cursor, so a later source-only container cannot erase the
// original nativeSolutionRebind obligation.
export function replayIssuedSolutionRpmHistoricalLeaf({ context, nativeSource, revalidateLeaf }) {
  const h = contexts.get(context); need(h && typeof revalidateLeaf === 'function', 'validated history and native replay required');
  validateCurrentCrosswalk(h);
  const leaf = { nativeSource:{ ...nativeSource,root:h.root,bytes:h.oldSource.bytes,blobSha1:h.prior.sourceBlobSha1,
    bank:h.oldBank,runtimeRecord:h.oldState.runtimeRecord,issuedSolutionRpmHistoryContext:context },
    current:h.oldState.current, identity:h.oldState.identity,
    question:h.oldBank[h.ordinal - 1], ordinal:h.ordinal, source:h.prior.sourceArchiveFile };
  const expected = h.ref.path;
  need(revalidateLeaf({ ...leaf,previous:h.oldBank[h.ordinal - 1] }) === expected, 'issued native cursor did not replay');
  need(revalidateLeaf({ ...leaf,previous:h.originalRepair.question }) === expected, 'original solution native cursor did not replay');
  return true;
}

// Preview uses the same actual selected tables that the registrar will read.
// This does not construct or alter any registration state.
export function readIssuedSolutionRpmCurrentState(root, envelope) {
  const uid = (envelope.items || envelope.appliedRecords)?.[0]?.questionUid, current = only(parse(read(root, META)).records, uid, 'current metadata');
  const identity = only(parse(read(root, IDENTITY)).records, uid, 'current identity'), pack = current.metaFoundationPackId;
  need(/^[A-Z][A-Z0-9_]*$/.test(pack || ''), 'invalid current runtime owner');
  const runtime = parse(read(root, `archive/data/meta-foundation/runtime/${pack.toLowerCase().replaceAll('_', '-')}-v1.json`));
  need(runtime.packId === pack && runtime.status === 'ACTIVE', 'current runtime authority mismatch');
  return { current, identity, runtimeRecord: only(runtime.records, uid, 'current runtime') };
}
