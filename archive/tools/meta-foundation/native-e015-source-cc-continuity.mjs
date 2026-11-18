import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

// This is an issued-receipt comparison view, not a source rebind or approval.
// The exact source worker appended one CC to Q10; the issued Q7/Q8 are intact.
// The ordinary Native, current ACTIVE, retained-field and renderer validators
// must still succeed. Only this synchronous replay can mint its private token.
// Continuity chain: issued edition (pins.old) -> Q10 CC only (pins.current, from the
// transport commit) -> layoutTag only (pins.restored, bound to the live HEAD tree).
// The restored stage adds no approval: every non-layoutTag field of every question
// must equal pins.current, so the fields the approval inspected are proven unchanged.
const SOURCE = 'original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js';
const SOURCE_PATH = `archive/exams/${SOURCE}`;
const ISSUED_COMMIT = 'dfb0d368e1e57c0f481bef2f85f96e3ad7b52ed9';
const TRANSPORT_COMMIT = '054986dff9a1b772cd2b40a44e6dc70d4400d0a5';
const INPUT_COMMIT = '0352ae93718e3ffa0d456d545dfe9c85c306fdc5';
const REQUEST_ID = 'm2-family3-e015-current65a-display-r2-20261116';
const RECEIPT_PATH = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${REQUEST_ID}.json`;
const BINDING_PATH = RECEIPT_PATH.replace(/\.json$/, '.source-review-binding.json');
const TRANSPORT_ID = 'm2s2-public4-source-cc-currentc57-r3-20261116';
const TRANSPORT_PATH = `docs/operations/source-metadata-candidates/${TRANSPORT_ID}/transport-receipt.json`;
const MANIFEST_PATH = `.archive-meta-register/evidence/${TRANSPORT_ID}/source-materialization-manifest.json`;
const PROPOSAL_PATH = `.archive-meta-register/inbox/${TRANSPORT_ID}-e015.json`;
const CC = 'CC_INTERIOR_RAY_CIRCLE_INTERSECTION_UNIQUENESS';
const Q10_UID = 'qid_v1_944a8e2657646dc03aa3d569fe594e1bc8c08bdb9ec9009ba41f56427c5ecb17';
const pins = Object.freeze({
  old: { path: SOURCE_PATH, commit: ISSUED_COMMIT, git: '40fac8532d52c2b308708f6a0769005029bb7565', raw: 'b86fc1cbb7a69bdedc337675a834c9641344df0c7d2cd47a1bb953b6177cb2f4', bytes: 75142 },
  current: { path: SOURCE_PATH, commit: TRANSPORT_COMMIT, git: 'f14aefb3ab99ed6df2badef820a0878e97c6f488', raw: '217ec8b1b30a09080f0660244a64967e399d38bb79ad64cfcb8a9f1ef1b07d79', bytes: 75202 },
  // No issuing commit: the restored edition is bound by exact blob, raw sha256 and bytes,
  // and must be present in the live HEAD tree and working file (see assertLive).
  restored: { path: SOURCE_PATH, commit: null, git: '68701f35d17f45248c6a61f5051b4706c1dea6a6', raw: 'd4393430d6564adabd65ee5c02906db25363e4715856a44fb94ac385c1b59459', bytes: 75117 },
  receipt: { path: RECEIPT_PATH, commit: ISSUED_COMMIT, git: '5ec0d73c6fd2bd84d8aceea2d515e9242f4f3e3a', raw: 'a9df73bb28871d2c90261be036470e7e365c719837fd5576bec1875cdfedd29e', bytes: 77976 },
  binding: { path: BINDING_PATH, commit: ISSUED_COMMIT, git: '1f37adda74d1b349317b96704d3dc51cd11ff655', raw: 'af038405d3556f385c9b8060b9c305dcaf9e2f74df23482eb963515e2e096968', bytes: 19966 },
  transport: { path: TRANSPORT_PATH, commit: TRANSPORT_COMMIT, git: '15de556bd9c1f3c9e1f24c5fcb8b2ee553a06314', raw: 'a421a330e89a68db893fcc86f67db6078fc5c4c135708d7b004d7cca2378b1f7', bytes: 1880 },
  manifest: { path: MANIFEST_PATH, commit: INPUT_COMMIT, git: '6aa5d8af69c4e533c05bb5b12302b567b35d78fc', raw: 'ae713e6df3ce40f63efc9d0c038daa1c1d3b3488987b42fa823c31f01714ad7f', bytes: 5263 },
  proposal: { path: PROPOSAL_PATH, commit: INPUT_COMMIT, git: '4dd1aa85c1dcc6298094a5fb57caaa2c0505b52c', raw: '314af069a71f83a5030720c3d8390dede32c083148781d4d40d11691ba9b70d8', bytes: 6713 },
});
const ITEMS = Object.freeze([
  { ordinal: 7, uid: 'qid_v1_3c72535bb4d43798192918e723d32bd646b2415bde8c5e8ad872b445496b7bfd', question: 'b19cf8ccd095f088ce50db31223c2c02d4e4996aab9036d5872fcdfa3281507c', md: '8f44fbf99408b7bde066400aed6cda46d94a15fb1f9c886eeb8993a1105589fa', id: 'a555070c4a10e0cf3e0404d56c3563722c94e6ca95df29e5829603aa85d2f453', runtime: '20f56cf6de495eaffc348e3f02d598c2cb08bf27a542a88283a37c7b15d21ce8' },
  { ordinal: 8, uid: 'qid_v1_76b2be613350f59166e128170c6f38b6150078c9ed44e727733d5de0bbf76942', question: '455d23c4edad9eb76f4ee0b5d0e962398993216f6528647b8b79ef5fcb993500', md: '3d459296fbacab476d72b035d1902a6e3a18a32d9967f76396c058762d00a725', id: '823c90b69955e28009bdf1df2554cca4f545b77dda22d1974978efc9c696c701', runtime: '8fd5224b188aca63ea4d64d8ba20d52b3ad8427f6c6ef5618551f28ab05e7470' },
].map(Object.freeze));
const contexts = new WeakMap();
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const hash = value => sha(stable(value));
const same = (a, b) => stable(a) === stable(b);
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const fail = code => { throw Error(`E015_ISSUED_SOURCE_CONTINUITY:${code}`); };
const git = (root, ...args) => execFileSync('git', args, { cwd: root, maxBuffer: 2 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
const gitText = (root, ...args) => git(root, ...args).toString('utf8').trim();

function local(root, relative) {
  if (typeof relative !== 'string' || path.isAbsolute(relative) || relative.includes('\\') ||
      relative.split('/').some(v => !v || v === '.' || v === '..')) fail('PATH');
  let at = root;
  const parts = relative.split('/');
  for (let i = 0; i < parts.length; i++) {
    at = path.join(at, parts[i]);
    const st = fs.lstatSync(at);
    if (st.isSymbolicLink() || (i === parts.length - 1 ? !st.isFile() : !st.isDirectory())) fail('REGULAR_FILE');
  }
  const b = fs.readFileSync(at);
  if (b.length > 1024 * 1024) fail('INPUT_SIZE');
  return b;
}
function checked(b, ref) {
  if (!Buffer.isBuffer(b) || b.length !== ref.bytes || sha(b) !== ref.raw || blob(b) !== ref.git) fail('RAW_GIT_PIN');
  return b;
}
function immutable(root, ref, commit = ref.commit) {
  if (!/^[a-f0-9]{40}$/.test(commit)) fail('COMMIT');
  const entry = git(root, 'ls-tree', '-z', commit, '--', ref.path).toString('utf8').replace(/\0$/, '');
  if (entry !== `100644 blob ${ref.git}\t${ref.path}`) fail('COMMIT_PATH_PIN');
  return checked(git(root, 'cat-file', 'blob', ref.git), ref);
}
function parseBank(bytes) {
  const text = bytes.toString('utf8'), matches = [...text.matchAll(/window\s*\.\s*questionBank\s*=/g)];
  if (matches.length !== 1) fail('JSON_BANK_ASSIGNMENT');
  const start = text.indexOf('[', matches[0].index + matches[0][0].length);
  if (start < 0 || text.slice(matches[0].index + matches[0][0].length, start).trim()) fail('JSON_BANK_START');
  let depth = 0, quoted = false, escaped = false, end = -1;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
    if (c === '"') quoted = true;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { if (--depth === 0) { end = i + 1; break; } }
  }
  let bank;
  try { bank = JSON.parse(text.slice(start, end)); } catch { fail('JSON_BANK_ONLY'); }
  if (end < 0 || !Array.isArray(bank) || bank.length !== 24 || bank.some(q => !q || Array.isArray(q) || typeof q !== 'object')) fail('BANK_24');
  return { bank, prefix: text.slice(0, start), suffix: text.slice(end) };
}
const withoutLayoutTag = ({ layoutTag, ...rest }) => rest;
// The only allowed difference between the f14aefb3ab edition and the restored one is
// the value of the per-question layoutTag key. Text outside the bank, question count
// and order, and every other key and value of every question must be identical.
function assertLayoutTagOnly(base, next) {
  if (base.prefix !== next.prefix || base.suffix !== next.suffix || base.bank.length !== next.bank.length ||
      base.bank.some((q, i) => !same(withoutLayoutTag(q), withoutLayoutTag(next.bank[i])) ||
        Object.hasOwn(next.bank[i], 'layoutTag') && typeof next.bank[i].layoutTag !== 'string')) fail('LAYOUT_TAG_ONLY');
}
// Pure comparison only (no authority, no token): used by authenticate and by tests.
export function assertE015LayoutTagOnlyEdition(baseBytes, nextBytes) {
  assertLayoutTagOnly(parseBank(baseBytes), parseBank(nextBytes));
  return true;
}
function select(rows, uid, ordinal) {
  if (!Array.isArray(rows) || rows.length !== 2 || new Set(rows.map(r => r.questionUid)).size !== 2 ||
      rows.some(r => !ITEMS.some(i => i.uid === r.questionUid && i.ordinal === r.sourceOrdinal) || r.sourceArchiveFile !== SOURCE)) fail('ISSUED_TWO_INVENTORY');
  const item = rows.find(r => r.questionUid === uid && r.sourceOrdinal === ordinal);
  if (!item) fail('SELECTED_ISSUED_ROW');
  return item;
}
function assertLive(ctx) {
  if (fs.realpathSync(ctx.root) !== ctx.root || gitText(ctx.root, 'rev-parse', 'HEAD') !== ctx.head) fail('HEAD_CHANGED');
  for (const ref of [ctx.livePin, pins.receipt, pins.binding, pins.transport]) {
    immutable(ctx.root, ref, ctx.head);
    checked(local(ctx.root, ref.path), ref);
  }
}
function authenticate(args) {
  const item = ITEMS.find(i => i.uid === args.identity?.questionUid && i.ordinal === args.ordinal && args.source === SOURCE);
  if (!item) return null;
  const n = args.nativeSource;
  const livePin = n && [pins.current, pins.restored].find(p => p.git === n.blobSha1);
  if (!livePin) return null;
  if (n.e015IssuedSourceContinuation || n.issuedRpmHistoryContext || n.issuedSolutionRpmHistoricalContext || n.issuedSolutionRpmHistoryContext) fail('EXCLUSIVE_CONTEXT');
  const root = fs.realpathSync(n.root), head = gitText(root, 'rev-parse', 'HEAD');
  if (!/^[a-f0-9]{40}$/.test(head)) fail('HEAD');
  for (const c of [ISSUED_COMMIT, TRANSPORT_COMMIT]) {
    try { git(root, 'merge-base', '--is-ancestor', c, head); } catch { fail('ISSUED_TRANSPORT_ANCESTRY'); }
  }
  const raw = Object.fromEntries(Object.entries(pins).filter(([k]) => k !== 'restored').map(([k, ref]) => [k, immutable(root, ref)]));
  // The live edition must be pinned in this HEAD tree (and, in assertLive, on disk).
  if (livePin === pins.restored) raw.restored = immutable(root, pins.restored, head);
  const receipt = JSON.parse(raw.receipt), binding = JSON.parse(raw.binding), transport = JSON.parse(raw.transport),
    manifest = JSON.parse(raw.manifest), proposal = JSON.parse(raw.proposal);
  const old = parseBank(raw.old), current = parseBank(raw.current);
  const live = livePin === pins.restored ? parseBank(raw.restored) : current;
  if (live !== current) assertLayoutTagOnly(current, live);
  checked(n.bytes, livePin);
  if (!same(n.bank, live.bank) || !same(args.question, live.bank[item.ordinal - 1]) ||
      n.runtimeStatus !== 'ACTIVE' || !args.previous) fail('CURRENT_ARGUMENT');
  if (old.prefix !== current.prefix || old.suffix !== current.suffix || old.bank.some((q, i) => {
    if (i !== 9) return !same(q, current.bank[i]);
    return !Object.hasOwn(q, 'crossConceptKeys') || !same(q.crossConceptKeys, []) ||
      !same({ ...q, crossConceptKeys: [CC] }, current.bank[i]);
  })) fail('EXACT_Q10_CC_ONLY');
  for (const i of ITEMS) if (hash(old.bank[i.ordinal - 1]) !== i.question || hash(current.bank[i.ordinal - 1]) !== i.question) fail('SELECTED_WHOLE_QUESTION');
  if (transport.schemaVersion !== 'archive-reviewed-source-candidate-receipt-v1' || transport.materializationId !== TRANSPORT_ID ||
      transport.inputCommit !== INPUT_COMMIT || transport.approvalEffect !== 'NONE' || transport.registrationStatus !== 'NOT_REGISTERED' ||
      transport.inputClosure?.newApprovals !== 0 || transport.inputClosure?.selectedUidCount !== 4 ||
      !same(transport.manifestRef, { path: MANIFEST_PATH, blobSha1: pins.manifest.git, sha256: pins.manifest.raw })) fail('TRANSPORT_NO_APPROVAL');
  if (manifest.schemaVersion !== 'archive-reviewed-source-metadata-materialization-v1' || manifest.materializationId !== TRANSPORT_ID ||
      manifest.baseCommit !== transport.baseCommit || manifest.transportProfile !== 'M2_NATIVE_PROPOSAL_V3' ||
      !manifest.outputScope?.includes(SOURCE_PATH) || manifest.requestRefs?.filter(r =>
        same(r, { path: PROPOSAL_PATH, blobSha1: pins.proposal.git, sha256: pins.proposal.raw })).length !== 1) fail('MATERIALIZATION_REQUEST_LINK');
  const selectedFiles = manifest.files?.filter(f => f.path === SOURCE_PATH);
  if (selectedFiles?.length !== 1 || !same(selectedFiles[0], { path: SOURCE_PATH,
    before: { blobSha1: pins.old.git, sha256: pins.old.raw }, after: { blobSha1: pins.current.git, sha256: pins.current.raw },
    expectedQuestionCount: 24, changes: [{ questionUid: Q10_UID, sourceOrdinal: 10, requestIndex: 1,
      metadataFields: [{ field: 'crossConceptKeys', beforePresent: true, afterPresent: true, before: [], after: [CC] }] }] })) fail('EXACT_SOURCE_TRANSPORT');
  const transported = transport.sourceFiles?.filter(f => f.path === SOURCE_PATH);
  if (transported?.length !== 1 || !same(transported[0], { path: SOURCE_PATH, blobSha1: pins.current.git, sha256: pins.current.raw, bytes: pins.current.bytes }) ||
      proposal.sourceArchiveFile !== SOURCE || proposal.expectedQuestionCount !== 24 || proposal.expectedSourceBlobSha1 !== pins.current.git ||
      proposal.items?.length !== 1 || proposal.items[0].questionUid !== Q10_UID || proposal.items[0].sourceOrdinal !== 10 ||
      !same(proposal.items[0].after?.crossConceptKeys, [CC])) fail('PROPOSAL_TRANSPORT_ONLY');
  if (receipt.requestId !== REQUEST_ID || receipt.metadataRegistrationStatus !== 'REGISTERED' || receipt.scope !== 'PARTIAL_UIDS' ||
      receipt.partialUidCount !== 2 || receipt.expectedQuestionCount !== 24 || receipt.sourceArchiveFile !== SOURCE ||
      receipt.sourceBlobSha1 !== pins.old.git || receipt.sourceRawSha256 !== pins.old.raw || receipt.approval?.type !== 'FINAL_QA' ||
      receipt.approval.metadataReviewed !== true || receipt.registryChanges?.length ||
      !same(binding.requestSnapshot?.approval, receipt.approval) || binding.requestSnapshot?.expectedSourceBlobSha1 !== pins.old.git ||
      binding.requestSnapshot.requestId !== REQUEST_ID || binding.requestSnapshot.items?.length !== 2) fail('ORIGINAL_ISSUED_AUTHORITY');
  const issuedMd = select(receipt.appliedRecords, item.uid, item.ordinal), issuedId = select(receipt.appliedIdentityRecords, item.uid, item.ordinal),
    issuedRuntime = select(receipt.runtimeRecords, item.uid, item.ordinal);
  if (!same(args.current, issuedMd) || !same(args.identity, issuedId) || !same(n.runtimeRecord, issuedRuntime) ||
      hash(args.current) !== item.md || hash(args.identity) !== item.id || hash(n.runtimeRecord) !== item.runtime) fail('CURRENT_SELECTED_MD_ID_RUNTIME');
  if (!(n.identityByJoin instanceof Map)) fail('IDENTITY_JOIN');
  for (const i of ITEMS) if (!same(n.identityByJoin.get(`${SOURCE}#${i.ordinal}`), select(receipt.appliedIdentityRecords, i.uid, i.ordinal))) fail('PAIR_IDENTITY_JOIN');
  const ctx = { root, head, item, livePin, oldBytes: raw.old, oldBank: old.bank, receipt, binding,
    current: structuredClone(args.current), identity: structuredClone(args.identity), runtime: structuredClone(n.runtimeRecord) };
  assertLive(ctx);
  return ctx;
}

export function assertE015IssuedSourceContinuationLeaf({ context, nativeSource, current, identity, source, ordinal, question, receipt }) {
  const ctx = context && contexts.get(context);
  if (!ctx || source !== SOURCE || ordinal !== ctx.item.ordinal || identity?.questionUid !== ctx.item.uid ||
      fs.realpathSync(nativeSource.root) !== ctx.root || nativeSource.e015IssuedSourceContinuation !== context ||
      nativeSource.blobSha1 !== pins.old.git || !Buffer.isBuffer(nativeSource.bytes) || !nativeSource.bytes.equals(ctx.oldBytes) ||
      !same(nativeSource.bank, ctx.oldBank) || !same(question, ctx.oldBank[ordinal - 1]) ||
      !same(current, ctx.current) || !same(identity, ctx.identity) || !same(nativeSource.runtimeRecord, ctx.runtime) ||
      receipt !== undefined && !same(receipt, ctx.receipt)) fail('PRIVATE_SELECTED_LEAF');
  assertLive(ctx);
  return true;
}

export function readE015IssuedSourceContinuation({ context, root, request, patch, current, question, relativePath }) {
  if (context === undefined) return null;
  const ctx = context && contexts.get(context);
  if (!ctx || fs.realpathSync(root) !== ctx.root || relativePath !== SOURCE_PATH ||
      !same(request, ctx.binding.requestSnapshot) || !same(current, ctx.current) ||
      patch?.questionUid !== ctx.item.uid || patch?.sourceOrdinal !== ctx.item.ordinal ||
      !same(patch, ctx.binding.requestSnapshot.items.find(i => i.questionUid === ctx.item.uid)) ||
      !same(question, ctx.oldBank[ctx.item.ordinal - 1])) fail('PRIVATE_FAMILY3_READER');
  assertLive(ctx);
  return Buffer.from(ctx.oldBytes);
}

export function replayE015IssuedSourceContinuation(args) {
  const ctx = authenticate(args);
  if (!ctx) return null;
  if (typeof args.revalidateLeaf !== 'function') fail('ORDINARY_NATIVE_CALLBACK');
  const token = Object.freeze(Object.create(null));
  contexts.set(token, ctx);
  try {
    const bank = structuredClone(ctx.oldBank), nativeSource = { ...args.nativeSource,
      bytes: Buffer.from(ctx.oldBytes), blobSha1: pins.old.git, bank, e015IssuedSourceContinuation: token };
    const result = args.revalidateLeaf({ nativeSource, question: bank[ctx.item.ordinal - 1] });
    if (result !== RECEIPT_PATH) fail('ORDINARY_NATIVE_RECEIPT_REQUIRED');
    assertLive(ctx);
    return result;
  } finally { contexts.delete(token); }
}
