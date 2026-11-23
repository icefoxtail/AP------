import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { hydrateM3Q5CurrentUiInputs } from '../tools/ci/archive-pr-native-preview.mjs';

// Real sealed metadata/PNG bytes are read from the integration HEAD and its
// immutable Git history. These tests invoke only input hydration, never Native,
// registration, source evaluation, a global builder, screenshots or approvals.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROFILE = {
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

const INBOX = '.archive-meta-register/inbox/' + PROFILE.requestId + '.json';
const STAGED = [...PROFILE.currentRefs, ...PROFILE.extraServed];
const LIVE = [PROFILE.approvedRequest, ...PROFILE.priorRefs, ...STAGED, PROFILE.sourceRef, PROFILE.engineRef];
// Render engine files may change after the capture: the captured Git bytes are used, not HEAD or the working tree.
const RENDER = new Set(['archive/engine.html', 'archive/archive2-output-bar.css', 'archive/exam-display-title.js', 'archive/archive2-tokens.css']);
// The original exam is a living working file (minimal-fix protocol edits it any time), so its pinned bytes are read from the capture commit like the render engine files, not from HEAD.
const FROM_CAPTURE_COMMIT = new Set([...RENDER, PROFILE.sourceRef.path]);
const NON_RENDER_STAGED = STAGED.filter(ref => !RENDER.has(ref.path));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
const git = (root, ...args) => execFileSync('git', args, { cwd: root, maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' },
  timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'] });
const str = (root, ...args) => git(root, ...args).toString().trim();
const put = (root, relative, bytes) => {
  const full = path.join(root, relative); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, bytes);
};
const fileHashes = root => LIVE.map(ref => [ref.path, sha(fs.readFileSync(path.join(root, ref.path)))]);
const publicHead = str(ROOT, 'rev-parse', 'HEAD');
const publicStatus = git(ROOT, 'status', '--porcelain=v1', '-z');
const publicHashes = fileHashes(ROOT);
const immutableBytes = new Map(LIVE.map(ref => {
  const b = git(ROOT, 'show', (FROM_CAPTURE_COMMIT.has(ref.path) ? ref.commit : publicHead) + ':' + ref.path);
  assert.equal(b.length, ref.bytes, ref.path);
  assert.equal(sha(b), ref.sha256, ref.path);
  assert.equal(blob(b), ref.gitBlobSha1, ref.path);
  if (!FROM_CAPTURE_COMMIT.has(ref.path)) assert.equal(sha(fs.readFileSync(path.join(ROOT, ref.path))), ref.sha256, ref.path);
  return [ref.path, b];
}));
const approvedRequest = JSON.parse(immutableBytes.get(PROFILE.approvedRequest.path));
function assertPublicInputs() {
  assert.equal(str(ROOT, 'rev-parse', 'HEAD'), publicHead);
  assert.deepEqual(git(ROOT, 'status', '--porcelain=v1', '-z'), publicStatus);
  assert.deepEqual(fileHashes(ROOT), publicHashes);
}
function descriptor(f) {
  const raw = fs.readFileSync(path.join(f.root, INBOX));
  const request = JSON.parse(raw);
  return { path: INBOX, sha256: sha(raw), sizeBytes: raw.length, requestId: request.requestId,
    source: { path: PROFILE.sourceRef.path, blobSha1: PROFILE.sourceRef.gitBlobSha1,
      sha256: PROFILE.sourceRef.sha256, sizeBytes: PROFILE.sourceRef.bytes },
    selectedItems: request.items.map(row => ({ questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal })),
    evidence: request.approval.evidenceRefs.map(row => ({ ...row })) };
}
function seal(f, parent = f.head || publicHead) {
  git(f.root, 'add', '--all');
  const tree = str(f.root, 'write-tree');
  f.head = str(f.root, 'commit-tree', tree, ...(parent ? ['-p', parent] : []), '-m', 'Private readonly Q5 input fixture');
  git(f.root, 'update-ref', 'HEAD', f.head);
  f.selected = descriptor(f);
}
function fixture(t) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'q5-current-shadow-'));
  const f = { temp, root: path.join(temp, 'input'), shadow: path.join(temp, 'shadow') };
  fs.mkdirSync(f.root); fs.mkdirSync(f.shadow);
  t.after(() => { fs.rmSync(temp, { recursive: true, force: true }); assertPublicInputs(); });
  git(f.root, 'init', '-q');
  git(f.root, 'config', 'user.name', 'Readonly Q5 fixture');
  git(f.root, 'config', 'user.email', 'fixture@example.invalid');
  const objects = str(ROOT, 'rev-parse', '--path-format=absolute', '--git-path', 'objects');
  put(f.root, '.git/objects/info/alternates', objects + '\n');
  for (const [relative, bytes] of immutableBytes) put(f.root, relative, bytes);
  put(f.root, INBOX, immutableBytes.get(PROFILE.approvedRequest.path));
  seal(f);
  return f;
}
function run(f, requests = [f.selected], headSha = f.head) {
  return hydrateM3Q5CurrentUiInputs({ root: f.root, shadow: f.shadow, headSha, requests });
}
function countStaged(f) {
  return STAGED.filter(ref => fs.existsSync(path.join(f.shadow, ref.path))).length;
}
function reject(t, change, pattern = /PR_NATIVE_PREVIEW:(?:Q5_SHADOW_|SYMLINK:|UNSAFE_PATH)/) {
  const f = fixture(t); change(f);
  assert.throws(() => run(f), pattern);
  assert.equal(countStaged(f), 0, 'No readonly input is copied before all authentication succeeds');
}
function editRequest(f, change) {
  const request = JSON.parse(fs.readFileSync(path.join(f.root, INBOX)));
  change(request); put(f.root, INBOX, JSON.stringify(request, null, 2) + '\n'); seal(f);
}

test('Q5 shadow restores exact declared readonly nine and preserves writable post-state inputs', t => {
  const f = fixture(t);
  const sentinels = ['archive/data/question_metadata.json', 'archive/data/question_identity_map.json',
    'archive/data/meta-foundation/runtime/middle-geometry-v1.json', PROFILE.sourceRef.path];
  for (const relative of sentinels) put(f.shadow, relative, Buffer.from('private post-state sentinel\n'));
  const before = sentinels.map(relative => sha(fs.readFileSync(path.join(f.shadow, relative))));
  const original = fileHashes(f.root), result = run(f);
  assert.equal(result.length, 9);
  assert.deepEqual(result.map(ref => ref.path), STAGED.map(ref => ref.path));
  assert.equal(result.filter(ref => ref.existing).length, 0);
  for (const ref of STAGED) {
    const full = path.join(f.shadow, ref.path), b = fs.readFileSync(full);
    assert.equal(b.length, ref.bytes); assert.equal(sha(b), ref.sha256); assert.equal(blob(b), ref.gitBlobSha1);
    const a = fs.statSync(full), source = fs.statSync(path.join(f.root, ref.path));
    assert.ok(a.dev !== source.dev || a.ino !== source.ino, 'Copied bytes have no shared writable inode');
  }
  assert.deepEqual(fileHashes(f.root), original);
  assert.deepEqual(sentinels.map(relative => sha(fs.readFileSync(path.join(f.shadow, relative)))), before);
  assert.equal(result.some(ref => ref.path.startsWith('archive/data/') || ref.path.startsWith('archive/exams/')), false);
});
test('Exact existing shadow input is retained and repeated hydration is idempotent', t => {
  const f = fixture(t), ref = STAGED[0], full = path.join(f.shadow, ref.path);
  put(f.shadow, ref.path, immutableBytes.get(ref.path));
  const initial = fs.statSync(full, { bigint: true });
  const first = run(f), all = STAGED.map(row => fs.statSync(path.join(f.shadow, row.path), { bigint: true }));
  assert.equal(first[0].existing, true);
  assert.equal(fs.statSync(full, { bigint: true }).ino, initial.ino);
  assert.equal(fs.statSync(full, { bigint: true }).mtimeNs, initial.mtimeNs);
  assert.equal(run(f).every(row => row.existing), true);
  assert.deepEqual(STAGED.map(row => fs.statSync(path.join(f.shadow, row.path), { bigint: true }).ino), all.map(row => row.ino));
});
test('Provider-free and unrelated Q5 request identities hydrate nothing', () => {
  for (const requests of [[], [{ requestId: 'ordinary-unrelated' }],
    [{ requestId: 'separate-difficulty-request', selectedItems: [{ questionUid: PROFILE.questionUid, sourceOrdinal: 5 }] }]])
    assert.deepEqual(hydrateM3Q5CurrentUiInputs({ root: '/not-accessed', shadow: '/not-accessed', headSha: 'not-accessed', requests }), []);
});
test('Duplicate exact request descriptors are refused', t => {
  const f = fixture(t); assert.throws(() => run(f, [f.selected, f.selected]), /Q5_SHADOW_AMBIGUOUS_REQUEST/);
  assert.equal(countStaged(f), 0);
});
test('An incorrect expected HEAD is refused', t => {
  const f = fixture(t); assert.throws(() => run(f, [f.selected], '0'.repeat(40)), /Q5_SHADOW_HEAD/);
  assert.equal(countStaged(f), 0);
});
test('The real checkout can never be used as the shadow', t => {
  const f = fixture(t);
  assert.throws(() => hydrateM3Q5CurrentUiInputs({ root: f.root, shadow: f.root, headSha: f.head, requests: [f.selected] }), /Q5_SHADOW_HEAD/);
});
test('A descendant shadow cannot receive files inside the real checkout', t => {
  const f = fixture(t), child = path.join(f.root, 'private-shadow'); fs.mkdirSync(child);
  assert.throws(() => hydrateM3Q5CurrentUiInputs({ root: f.root, shadow: child, headSha: f.head, requests: [f.selected] }), /Q5_SHADOW_HEAD/);
});
test('Request traversal and descriptor raw drift are refused', t => {
  const f = fixture(t);
  assert.throws(() => run(f, [{ ...f.selected, path: '.archive-meta-register/inbox/../outside.json' }]), /Q5_SHADOW_REQUEST_PATH/);
  assert.throws(() => run(f, [{ ...f.selected, sha256: '0'.repeat(64) }]), /Q5_SHADOW_REQUEST/);
  assert.throws(() => run(f, [{ ...f.selected, sizeBytes: f.selected.sizeBytes + 1 }]), /Q5_SHADOW_REQUEST/);
  assert.equal(countStaged(f), 0);
});
for (const [name, change] of [
  ['wrong Q5 UID', r => { r.items[0].questionUid = r.items[1].questionUid; }],
  ['wrong Q5 ordinal', r => { r.items[0].sourceOrdinal = 6; }],
  ['wrong source', r => { r.sourceArchiveFile = 'original/middle/m3/2final/unrelated.js'; }],
  ['missing application marker', r => { delete r.items[0].sourceReview.q5CompleteGivenApplication; }],
  ['foreign marker commit', r => { r.items[0].sourceReview.q5CompleteGivenApplication.technicalRef.commit = '0'.repeat(40); }],
  ['malformed marker digest', r => { r.items[0].sourceReview.q5CompleteGivenApplication.technicalRef.sha256 = 'x'.repeat(64); }],
  ['changed marker byte count', r => { r.items[0].sourceReview.q5CompleteGivenApplication.technicalRef.bytes++; }],
  ['forged marker path', r => { r.items[0].sourceReview.q5CompleteGivenApplication.technicalRef.path = 'archive/data/question_metadata.json'; }],
  ['unbound approval evidence', r => { r.approval.evidenceRefs = r.approval.evidenceRefs.filter(x => x.path !== PROFILE.priorRefs[1].path); }],
  ['unbound selected evidence', r => { r.items[0].evidenceRefs = r.items[0].evidenceRefs.filter(x => x.path !== PROFILE.priorRefs[1].path); }],
  ['duplicate original evidence', r => { r.items[0].evidenceRefs.push({ path: PROFILE.priorRefs[1].path, sha256: '0'.repeat(64) }); }],
  ['a marker on companion Q12', r => { r.items[1].sourceReview.q5CompleteGivenApplication = r.items[0].sourceReview.q5CompleteGivenApplication; }],
  ['an unapproved additional request field', r => { r.currentUiOverride = PROFILE.currentRefs[0]; }]
]) test('Rejects ' + name + ' despite a newly committed matching descriptor', t => reject(t, f => editRequest(f, change)));
test('The exact original evidence must also be bound by the selected descriptor', t => reject(t, f => {
  f.selected.evidence = f.selected.evidence.filter(ref => ref.path !== PROFILE.priorRefs[1].path);
}));
test('The selected descriptor cannot duplicate one evidence path under a different hash', t => reject(t, f => {
  f.selected.evidence.push({ path: PROFILE.priorRefs[1].path, sha256: '0'.repeat(64) });
}));
test('Current source descriptor drift is refused', t => reject(t, f => { f.selected.source.blobSha1 = '0'.repeat(40); }));
test('A new HEAD with the same files but without immutable proof ancestry is refused', t => reject(t, f => {
  seal(f, null);
}, /Q5_SHADOW_ANCESTOR/));
for (const ref of [...PROFILE.priorRefs, ...NON_RENDER_STAGED])
  test('Missing original/current declared input is refused: ' + ref.path, t => reject(t, f => fs.unlinkSync(path.join(f.root, ref.path))));
for (const ref of [PROFILE.currentRefs[1], PROFILE.currentRefs[5]])
  test('Live bytes cannot differ from fixed HEAD: ' + ref.path, t => reject(t, f => {
    fs.appendFileSync(path.join(f.root, ref.path), Buffer.from('\n'));
  }, /Q5_SHADOW_LIVE_PIN/));
test('A current proof replaced in both HEAD and the worktree is still refused', t => reject(t, f => {
  fs.appendFileSync(path.join(f.root, PROFILE.currentRefs[0].path), '\n'); seal(f);
}, /Q5_SHADOW_HEAD_PIN/));
test('A later edition of a render engine file in HEAD does not block the captured bytes', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, PROFILE.extraServed[2].path), '\n'); seal(f);
  assert.equal(run(f).length, 9);
  for (const ref of PROFILE.extraServed) assert.equal(sha(fs.readFileSync(path.join(f.shadow, ref.path))), ref.sha256);
});
test('Same-byte live file symlinks are refused', t => reject(t, f => {
  const full = path.join(f.root, PROFILE.currentRefs[1].path), copy = path.join(f.temp, 'same.json');
  fs.copyFileSync(full, copy); fs.unlinkSync(full); fs.symlinkSync(copy, full);
}, /(?:SYMLINK|Q5_SHADOW_SYMLINK)/));
test('A live parent-directory symlink is refused', t => reject(t, f => {
  const dir = path.join(f.root, 'docs'), outside = path.join(f.temp, 'copied-docs');
  fs.renameSync(dir, outside); fs.symlinkSync(outside, dir, 'dir');
}, /(?:SYMLINK|Q5_SHADOW_SYMLINK)/));
test('A dangling live input symlink is refused', t => reject(t, f => {
  const full = path.join(f.root, PROFILE.currentRefs[1].path);
  fs.unlinkSync(full); fs.symlinkSync(path.join(f.temp, 'missing-target'), full);
}, /Q5_SHADOW_SYMLINK/));
test('A shadow parent-directory symlink is refused before any writes', t => reject(t, f => {
  fs.mkdirSync(path.join(f.temp, 'outside-docs')); fs.symlinkSync(path.join(f.temp, 'outside-docs'), path.join(f.shadow, 'docs'), 'dir');
}, /(?:SYMLINK|Q5_SHADOW_SYMLINK)/));
test('A dangling shadow input symlink is refused', t => {
  const f = fixture(t), ref = STAGED[0], full = path.join(f.shadow, ref.path);
  fs.mkdirSync(path.dirname(full), { recursive: true }); fs.symlinkSync(path.join(f.temp, 'missing-target'), full);
  assert.throws(() => run(f), /Q5_SHADOW_SYMLINK/);
  assert.equal(countStaged(f), 0);
});
test('Existing shadow drift is never overwritten', t => {
  const f = fixture(t), ref = STAGED[0]; put(f.shadow, ref.path, 'private different bytes\n');
  const original = fs.readFileSync(path.join(f.shadow, ref.path));
  assert.throws(() => run(f), /Q5_SHADOW_EXISTING_DRIFT/);
  assert.deepEqual(fs.readFileSync(path.join(f.shadow, ref.path)), original);
  assert.equal(countStaged(f), 1);
});
test('An existing shadow hardlink to the live input is refused', t => {
  const f = fixture(t), ref = STAGED[0], dest = path.join(f.shadow, ref.path);
  fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.linkSync(path.join(f.root, ref.path), dest);
  assert.throws(() => run(f), /Q5_SHADOW_SHARED_INODE/);
  assert.equal(countStaged(f), 1);
});
test('A symlink in the shadow root is refused', t => {
  const f = fixture(t), link = path.join(f.temp, 'shadow-link'); fs.symlinkSync(f.shadow, link, 'dir');
  assert.throws(() => hydrateM3Q5CurrentUiInputs({ root: f.root, shadow: link, headSha: f.head, requests: [f.selected] }), /Q5_SHADOW_ROOT/);
  assert.equal(countStaged(f), 0);
});
test('The original legacy renderer route stages no new display proofs', t => {
  const f = fixture(t);
  for (const ref of PROFILE.currentRefs) fs.unlinkSync(path.join(f.root, ref.path));
  put(f.root, 'archive/engine.html', git(ROOT, 'cat-file', 'blob', PROFILE.legacyEngineBlob)); seal(f);
  assert.deepEqual(run(f), []);
  assert.equal(countStaged(f), 0);
});
test('A later renderer edition is not refused when all current proofs are present', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.root, 'archive/engine.html'), '\n'); seal(f);
  assert.equal(run(f).length, 9);
});
test('Source bytes are never hydrated from the current display bundle', t => reject(t, f => {
  fs.appendFileSync(path.join(f.root, PROFILE.sourceRef.path), '\n');
}, /Q5_SHADOW_LIVE_PIN/));
// A published original proof is not a new current-display approval. Recreate
// the real topology: all current refs are ancestors, while the original sealed
// publication exists in the object store on its independent review branch.
test('Exact original Q5 publications may remain outside current display ancestry', t => {
  const f = fixture(t);
  seal(f, PROFILE.currentRefs[0].commit);
  const isAncestor = commit => {
    try { git(f.root, 'merge-base', '--is-ancestor', commit, f.head); return true; }
    catch (error) { if (error.status === 1) return false; throw error; }
  };
  for (const ref of PROFILE.priorRefs) {
    assert.equal(str(f.root, 'cat-file', '-t', ref.commit), 'commit');
    assert.equal(isAncestor(ref.commit), false, 'Original publication is present but not a current ancestor');
  }
  for (const ref of [...PROFILE.currentRefs, ...PROFILE.extraServed, PROFILE.sourceRef, PROFILE.engineRef])
    assert.equal(isAncestor(ref.commit), true, 'Every new display/source/renderer ref keeps its ancestry contract');
  const original = fileHashes(f.root);
  assert.equal(run(f).length, 9);
  assert.equal(countStaged(f), 9);
  assert.deepEqual(fileHashes(f.root), original);
});
for (const ref of PROFILE.priorRefs) {
  test('Original publication live tamper is still refused: ' + ref.path, t => reject(t, f => {
    fs.appendFileSync(path.join(f.root, ref.path), '\n');
  }, /Q5_SHADOW_LIVE_PIN/));
  test('Original publication HEAD tamper is still refused: ' + ref.path, t => reject(t, f => {
    fs.appendFileSync(path.join(f.root, ref.path), '\n'); seal(f);
  }, /Q5_SHADOW_HEAD_PIN/));
}
test('Public inputs are unchanged after the bounded hydration tests', assertPublicInputs);
