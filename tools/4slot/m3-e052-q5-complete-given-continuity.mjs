import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import C from './m3-e052-q5-complete-given-continuity.cjs';
import { sourceNumber, sourceIdentityNumber } from './exam-items.cjs';
import { loadM3Q5CompleteGivenBank as bank } from '../../archive/tools/meta-foundation/reviewed-m3-e052-q5-complete-given.mjs';
import { nativeReviewedM3Q5CompleteGivenRebind } from '../../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';
import { loadActiveMetaRegistry, validateActiveMetaFields } from '../../archive/tools/meta-foundation/active-registry.mjs';

const Q12 = 'qid_v1_1aac12db1a167973138e8dc51afcd5e0b19fcf73d4bb030ea406701acd0b8c4a';
const STUDENT = ['id','number','questionType','content','question','choices','answer','solution','image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const SLOTS = ['given','goal','method','condition'];
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const hash = v => sha(stable(v)), same = (a, b) => stable(a) === stable(b);
const payload = q => Object.fromEntries(STUDENT.map(k => [k, q[k] ?? null]));
const fail = m => { throw Error('M3_Q5_VECTOR_' + m); };
const demand = (ok, m) => { if (!ok) fail(m); };
function safe(root, relative) {
  demand(typeof relative === 'string' && relative && !path.isAbsolute(relative) && !/[\\\0-\x1f]/.test(relative) &&
    relative.split('/').every(p => p && p !== '.' && p !== '..'), 'PATH');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p)) if (fs.existsSync(p))
    demand(!fs.lstatSync(p).isSymbolicLink(), 'SYMLINK');
  return full;
}
function git(root, args, maxBuffer = 40 * 1024 * 1024) {
  try { return execFileSync('git', ['-c', 'core.quotePath=false', '-C', root, ...args], {
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, maxBuffer,
    timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { fail('IMMUTABLE_GIT_REQUIRED'); }
}
function treeBlob(root, commit, relative) {
  safe(root, relative);
  const lines = git(root, ['ls-tree', '-z', commit, '--', relative]).toString().split('\0').filter(Boolean);
  demand(lines.length === 1, 'IMMUTABLE_PATH_REQUIRED');
  const [head, p] = lines[0].split('\t'), [mode, type, oid] = head.split(' ');
  demand(mode === '100644' && type === 'blob' && p === relative && /^[a-f0-9]{40}$/.test(oid), 'IMMUTABLE_REGULAR_BLOB_REQUIRED');
  return oid;
}
function single(rows, uid, ordinal, label) {
  demand(Array.isArray(rows), label + '_RECORDS');
  const found = rows.filter(r => r?.questionUid === uid);
  demand(found.length === 1 && found[0].sourceArchiveFile === C.SOURCE && found[0].sourceOrdinal === ordinal,
    label + '_EXACT_IDENTITY');
  return found[0];
}
function rejectHold(value) {
  demand(value && typeof value === 'object' && !Object.hasOwn(value, 'registrationHold') &&
    !Object.hasOwn(value, 'sourceQualityHold') && !Object.hasOwn(value, 'reviewHold') &&
    value.metadataRegistrationStatus !== 'BLOCKED_SOURCE_EVIDENCE', 'HOLD_MUST_REMAIN');
}
export function verifyM3Q5ExistingVector(root, relative = C.FILE) {
  root = fs.realpathSync(root); demand(relative === C.FILE, 'EXACT_CARRIER_PATH');
  const observed = new Map();
  const read = p => { const b = fs.readFileSync(safe(root, p)); observed.set(p, sha(b)); return b; };
  const json = p => JSON.parse(read(p));
  const carrierRaw = read(relative), doc = JSON.parse(carrierRaw); C.assertDescriptor(doc);
  const reference = (ref, live = false) => {
    demand(treeBlob(root, ref.commit, ref.path) === ref.gitBlobSha1, 'IMMUTABLE_REF_TREE');
    const b = git(root, ['cat-file', 'blob', ref.gitBlobSha1]);
    demand(b.length === ref.bytes && blob(b) === ref.gitBlobSha1 && sha(b) === ref.sha256, 'IMMUTABLE_REF_BYTES');
    if (live) demand(sha(read(ref.path)) === ref.sha256, 'LIVE_REFERENCE_CHANGED');
    return b;
  };
  const compact = JSON.parse(reference(doc.refs.compactRef, true));
  const dictionary = JSON.parse(reference(doc.refs.dictionaryRef, true));
  reference(doc.refs.originalFourSlotReviewRef);
  demand(compact.schemaVersion === 'archive-meta-4slot-compact-v1' && compact.sourceArchiveFile === C.SOURCE &&
    compact.dictionaryVersion === dictionary.dictionaryVersion && Array.isArray(compact.items) && compact.items.length === 25 &&
    hash(compact.items) === doc.compactItemsSha256, 'ORIGINAL_COMPACT25_REQUIRED');
  demand(compact.evidence.commit === doc.refs.originalFourSlotReviewRef.commit &&
    compact.evidence.path === doc.refs.originalFourSlotReviewRef.path && compact.evidence.sha256 === doc.refs.originalFourSlotReviewRef.sha256,
    'ORIGINAL_FOUR_SLOT_AUTHORITY');
  const selected = compact.items.filter(it => it.ordinal === C.ORDINAL);
  demand(selected.length === 1 && hash(selected[0]) === doc.compactItemSha256, 'UNCHANGED_SELECTED_VECTOR'); rejectHold(selected[0]);
  const index = JSON.parse(reference(doc.refs.priorIndexRef));
  demand(index.schemaVersion === 'archive-item-4slot-runtime-v1' && index.authority === 'MAIN_MERGED_REVIEWED_COMPACT', 'PRIOR_REGISTERED_INDEX');
  const priorRows = index.records?.filter(r => r.sourceArchiveFile === C.SOURCE);
  demand(priorRows?.length === 25 && new Set(priorRows.map(r => r.questionUid)).size === 25 &&
    new Set(priorRows.map(r => r.sourceOrdinal)).size === 25 && priorRows.every(r => r.registrationStatus === 'REGISTERED'), 'PRIOR_REGISTERED25');
  const priorQ5 = single(priorRows, C.UID, 5, 'PRIOR_VECTOR');
  demand(hash(priorQ5) === doc.priorIndexRecordSha256, 'PRIOR_Q5_RECORD');
  const terms = new Map(dictionary.terms.map(t => [t.id, t]));
  for (const old of priorRows) {
    const its = compact.items.filter(it => it.ordinal === old.sourceDisplayNumber);
    demand(its.length === 1 && old.compactPath === doc.refs.compactRef.path && old.dictionaryVersion === compact.dictionaryVersion &&
      old.format === its[0].format && same(old.candidates, its[0].candidates) && SLOTS.every(k => same(old[k], its[0][k])), 'UNCHANGED_VECTOR25');
    for (const k of SLOTS) for (const id of its[0][k]) demand(terms.has(id) && (terms.get(id).status || 'ACTIVE') === 'ACTIVE', 'ACTIVE_ORIGINAL_TERM');
  }
  const beforeRaw = reference(doc.refs.beforeSourceRef), currentRaw = reference(doc.refs.currentSourceRef, true);
  const beforeBank = bank(beforeRaw), currentBank = bank(currentRaw);
  const compactRaw = git(root, ['cat-file', 'blob', compact.sourceGitBlobSha]);
  demand(blob(compactRaw) === compact.sourceGitBlobSha, 'COMPACT_SOURCE_BLOB');
  const compactBank = bank(compactRaw);
  demand([beforeBank, currentBank, compactBank].every(b => b.length === 25), 'WHOLE_BANK25');
  for (let i = 0; i < 25; i++) {
    demand(sourceNumber(currentBank[i]) === i + 1 && sourceNumber(compactBank[i]) === i + 1 &&
      sourceIdentityNumber(currentBank[i]) === sourceIdentityNumber(compactBank[i]), 'BANK_NUMBERS');
    if (i !== 4) demand(same(currentBank[i], beforeBank[i]) && same(payload(currentBank[i]), payload(compactBank[i])), 'OUTSIDE24_STUDENT_OR_WHOLE_QUESTION');
  }
  const q = currentBank[4], previous = compactBank[4];
  demand(beforeBank[4].image !== q.image && same({ ...q, image: beforeBank[4].image }, beforeBank[4]) &&
    same(payload({ ...q, image: previous.image }), payload(previous)), 'ONLY_Q5_ORIGINAL_IMAGE_POINTER');
  const oldLiteral = JSON.stringify(beforeBank[4].image), newLiteral = JSON.stringify(q.image), text = beforeRaw.toString();
  demand(text.split(oldLiteral).length === 2 && text.replace(oldLiteral, newLiteral) === currentRaw.toString(), 'PREFIX_SUFFIX_OR_UNSELECTED_SOURCE');
  const basis = JSON.parse(reference(doc.refs.applicationRef, true));
  const technical = JSON.parse(reference(doc.refs.technicalRef, true)); reference(doc.refs.visualRef, true);
  demand(same(basis.sourceBeforeRef, doc.refs.beforeSourceRef) && same(basis.sourceAfterRef, doc.refs.currentSourceRef), 'BASIS_SOURCE_JOIN');
  reference(basis.oldAssetRef, true); reference(basis.newAssetRef, true);
  const witnessRaw = read(C.REQUEST_WITNESS), request = JSON.parse(witnessRaw);
  demand(sha(witnessRaw) === doc.request.rawSha256 && hash(request) === doc.request.snapshotSha256 &&
    treeBlob(root, 'HEAD', C.REQUEST_WITNESS) === blob(witnessRaw) && request.requestId === C.REQUEST_ID, 'PUBLIC_REQUEST_RAW_AND_SNAPSHOT');
  const receiptRaw = read(C.RECEIPT), receipt = JSON.parse(receiptRaw);
  const bindingRaw = read(C.SOURCE_BINDING), binding = JSON.parse(bindingRaw);
  demand(receipt.schemaVersion === 'archive-reviewed-exam-meta-registration-v2' && receipt.requestId === C.REQUEST_ID &&
    receipt.requestSha256 === doc.request.snapshotSha256 && receipt.metadataRegistrationStatus === 'REGISTERED' &&
    receipt.scope === 'PARTIAL_UIDS' && receipt.partialUidCount === 2 && receipt.totalQuestions === 2 && receipt.expectedQuestionCount === 25 &&
    receipt.sourceArchiveFile === C.SOURCE && receipt.sourceBlobSha1 === blob(currentRaw) && receipt.sourceRawSha256 === sha(currentRaw) &&
    same(receipt.approval, request.approval) && same(receipt.registryChanges, []) && receipt.nativeParentBindings === undefined &&
    receipt.registrationMode === undefined && receipt.newMetadataApprovals === undefined, 'EXACT_ISSUED_REQUEST_PROVENANCE');
  demand(binding.schemaVersion === 'archive-reviewed-source-binding-v1' && binding.requestId === C.REQUEST_ID &&
    binding.requestSha256 === doc.request.snapshotSha256 && same(binding.requestSnapshot, request) &&
    binding.sourceArchiveFile === C.SOURCE && binding.sourceBlobSha1 === blob(currentRaw) && binding.sourceRawSha256 === sha(currentRaw),
    'EXACT_ISSUED_SIDECAR');
  // Observe the public live dependencies that the unmodified Native/UI replay
  // reads. Historical Git references remain immutable; no raw student values
  // are returned in this inventory, only path/digest pairs.
  const trackRefs = value => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '') &&
      (/^(?:archive\/|docs\/|tools\/|\.archive-meta-register\/)/.test(value.path) ||
       value.path === 'apmath/css/student-navigation.css' || value.path === 'apmath/js/student-navigation.js')) {
      const p = safe(root, value.path);
      if (fs.existsSync(p) && !observed.has(value.path)) read(value.path);
    }
    for (const child of Object.values(value)) if (child && typeof child === 'object') trackRefs(child);
  };
  for (const value of [basis, technical, receipt.approval, binding.requestSnapshot]) trackRefs(value);
  // The original Native call below must validate the same current-display files.
  // Observe them first and rehash every dependency again before returning PASS.
  for (const p of C.CURRENT_UI_PATHS) {
    if (!fs.existsSync(safe(root, p))) continue; // Missing mandatory evidence is rejected by the original Native resolver.
    const bytes = read(p);
    if (p.endsWith('/q5/technical-proof.json') || p.endsWith('/q5/visual-current-reuse-v1.json')) trackRefs(JSON.parse(bytes));
  }
  const metadata = json(C.MD), identity = json(C.ID);
  demand(Array.isArray(identity.records) && Array.isArray(metadata.records), 'CURRENT_RECORDS');
  const identityBank = identity.records.filter(r => r.sourceArchiveFile === C.SOURCE);
  demand(identityBank.length === 25, 'IDENTITY_BANK25');
  for (const r of priorRows) {
    const current = single(identity.records, r.questionUid, r.sourceOrdinal, 'ORIGINAL_IDENTITY');
    demand(identity.records.filter(x => x.sourceArchiveFile === C.SOURCE && x.sourceOrdinal === r.sourceOrdinal).length === 1 &&
      String(current.sourceQuestionNo) === sourceIdentityNumber(currentBank[r.sourceOrdinal - 1]), 'CURRENT_IDENTITY_TUPLE');
  }
  const runtimeHits = new Map([[C.UID, []], [Q12, []]]);
  const runtimeDir = safe(root, 'archive/data/meta-foundation/runtime');
  let runtimeContainer;
  for (const file of fs.readdirSync(runtimeDir).filter(p => p.endsWith('.json'))) {
    const relative = 'archive/data/meta-foundation/runtime/' + file, data = json(relative);
    for (const r of data.records || []) if (runtimeHits.has(r.questionUid)) runtimeHits.get(r.questionUid).push({ relative, data, row: r });
  }
  for (const [uid, ordinal] of [[C.UID, 5], [Q12, 12]]) {
    const md = single(metadata.records, uid, ordinal, 'METADATA'), id = single(identity.records, uid, ordinal, 'IDENTITY');
    const issued = single(receipt.appliedRecords, uid, ordinal, 'ISSUED_METADATA'), issuedId = single(receipt.appliedIdentityRecords, uid, ordinal, 'ISSUED_IDENTITY');
    demand(receipt.appliedRecords.length === 2 && receipt.appliedIdentityRecords.length === 2 && receipt.runtimeRecords.length === 2 &&
      same(md, issued) && same(id, issuedId), 'WHOLE_ISSUED_SELECTED_DATA'); rejectHold(md); rejectHold(id);
    const hits = runtimeHits.get(uid); demand(hits.length === 1 && hits[0].relative === C.RUNTIME && hits[0].data.status === 'ACTIVE' &&
      hits[0].data.packId === md.metaFoundationPackId && same(hits[0].row, single(receipt.runtimeRecords, uid, ordinal, 'ISSUED_RUNTIME')),
      'WHOLE_ISSUED_RUNTIME'); runtimeContainer = hits[0].data;
    demand(md.metadataApprovalType === 'FINAL_QA' && String(md.metadataStatus).startsWith('approved_') && md.metaFoundationStatus === 'ACTIVE',
      'CURRENT_FINAL_QA_ACTIVE');
  }
  const registryIndex = json('archive/data/meta-foundation/canonical/registry_index.json');
  for (const p of new Set(['archive/data/meta-foundation/canonical/metadata_rules.json', 'archive/data/master_tables/js_archive_tag_master.json',
    ...(registryIndex.canonicalSources || []).map(r => r.path), ...(registryIndex.compiledArtifacts || []).map(r => r.path)])) read(p);
  const registry = loadActiveMetaRegistry(root); demand(registry.status === 'ACTIVE', 'ACTIVE_REGISTRY');
  const md = single(metadata.records, C.UID, 5, 'Q5_METADATA'), id = single(identity.records, C.UID, 5, 'Q5_IDENTITY');
  demand(validateActiveMetaFields(md, registry, { requireFields: true }).status === 'VALIDATED', 'ACTIVE_SELECTED_BINDING');
  const nativeSource = { root, bytes: currentRaw, blobSha1: blob(currentRaw), bank: currentBank,
    identityMap: identity, identityByJoin: new Map(identity.records.map(r => [r.sourceArchiveFile + '#' + r.sourceOrdinal, r])),
    runtimeRecord: single(runtimeContainer.records, C.UID, 5, 'Q5_RUNTIME'), runtimeStatus: runtimeContainer.status };
  demand(nativeReviewedM3Q5CompleteGivenRebind(receipt, nativeSource, previous, q, id, 5, md, registry) === true,
    'ORIGINAL_NATIVE_GIVEN_UI_AND_ANCESTOR_REQUIRED');
  // The existing Native validator replays the complete original review, issued
  // sidecar, exact historical ancestor, given diagram and independent raw UI.
  // Global output digests are not receipt identity: other UIDs can be issued in
  // the same real writer. Their current hashes are observed, never synthesized.
  for (const [p, h] of observed) demand(sha(fs.readFileSync(safe(root, p))) === h, 'INPUT_CHANGED_DURING_VERIFICATION');
  return { status: 'PASS', questionUid: C.UID, sourceOrdinal: 5, sourceBinding: C.BINDING,
    carrierSha256: sha(carrierRaw), receiptSha256: sha(receiptRaw), sourceBindingSha256: sha(bindingRaw),
    existingVectorCount: 25, outside24WholeQuestionsUnchanged: true, newFourSlotApprovals: 0,
    newMathematicalQa: false, newMetadataApprovals: 0, observed: [...observed] };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(verifyM3Q5ExistingVector(path.resolve(process.argv[2]), process.argv[3]))); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
