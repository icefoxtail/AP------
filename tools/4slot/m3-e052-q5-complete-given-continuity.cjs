'use strict';
// One original registered vector, carried by the already-issued Q5 Native/UI proof.
// No vector, source, metadata, identity, approval or dictionary is authored here.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const DIR = '.archive-meta-register/4slot-m3-e052-q5-complete-given';
const UID = 'qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1';
const SOURCE = 'original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js';
const ORDINAL = 5, FILE = DIR + '/' + UID + '.json';
const SCHEMA = 'archive-m3-e052-q5-existing-vector-complete-given-v1';
const BINDING = 'M3_E052_Q5_COMPLETE_GIVEN_EXISTING_VECTOR';
const REQUEST_ID = 'm3s2-e052-q5-complete-given-q12-native2-r1-20261116';
const REQUEST_WITNESS = 'docs/operations/m3-e052-q5-complete-given-20261116/approved-request-v1.json';
const RECEIPT = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/' + REQUEST_ID + '.json';
const SOURCE_BINDING = RECEIPT.replace(/\.json$/, '.source-review-binding.json');
const MD = 'archive/data/question_metadata.json', ID = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime/middle-geometry-v1.json';
const worker = path.join(__dirname, 'm3-e052-q5-complete-given-continuity.mjs');
const CURRENT_UI_PATHS = Object.freeze(["docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/technical-proof.json","docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/visual-current-reuse-v1.json","docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m3/current-four-display-equivalence-v1.json","docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/producer-frames.jsonl","docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-desktop-tile-01.png","docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-mobile-tile-01.png"]);
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const same = (a, b) => stable(a) === stable(b);
const fail = m => { throw Error('M3_Q5_VECTOR_' + m); };
const freeze = x => { for (const v of Object.values(x)) if (v && typeof v === 'object') freeze(v); return Object.freeze(x); };
const PINS = freeze({"refs":{"compactRef":{"commit":"bc0af77466f92f32b2044c452e2f1418bbae4cf0","path":"archive/data/item-4slot/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.4slot.json","gitBlobSha1":"4f996d2c2d1c170554b2711e664c7fe9422591ec","sha256":"5f821ee0847061d5f964b4a6f84597b0102c66e3c30075c84cef406c694971a1","bytes":5278},"dictionaryRef":{"commit":"bc0af77466f92f32b2044c452e2f1418bbae4cf0","path":"docs/architecture/4slot/term-dictionary-v1.6.json","gitBlobSha1":"07920194882d3924ac50e8bbffc5b723c3fc5e89","sha256":"9d55b5f1172b13c3d05802b65963a18368d50b1659b31fa36aa52a27605e579d","bytes":367619},"priorIndexRef":{"commit":"8377221debc9200dff7e647ae1a772d8d5a2e8be","path":"archive/data/item-4slot-index.json","gitBlobSha1":"82e4ea98415a859771717904a9858baa40ad3ba5","sha256":"48ac02c5ffe219971d7389f166344e28cc1a624a2cf17072f1502339e899e5dc","bytes":20379847},"originalFourSlotReviewRef":{"commit":"c17c09a24eb356e4eaf17e4f5bc43c9844cf7427","path":"docs/operations/m3-s2-meta-full-20261114/exams/E052.4slot.json","gitBlobSha1":"41a8fe9ad908a5362148fc1880f303debfb05e4f","sha256":"29eb72472dfb7788207848197789d8f7dd54804aa45a210f3ec0bc3b90c9fcdc","bytes":91802},"beforeSourceRef":{"commit":"e75876f408cc86932c2e682e94143b6c5c2463ac","path":"archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js","gitBlobSha1":"0920e7ed51c32ca0c31094528634510e0691bbf9","sha256":"70cfc892e9b2c5b4bce4152fc0ffa8c27885bd11f6e18093149ecf805087840d","bytes":66640},"currentSourceRef":{"commit":"dd2d5d9dca6ee625500d0d5b3d201717190a9a7e","path":"archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js","gitBlobSha1":"82c627bacb59105e9bd3a5397d4828757308d587","sha256":"996ba1f2538b060c96f6528fc90c62affa567285a6a24d2106051199f9a348d1","bytes":66658},"applicationRef":{"commit":"1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2","path":"docs/operations/m3-e052-q5-complete-given-20261116/application-basis-v1.json","gitBlobSha1":"f2a96c282b365405c05ae7ad78c04c710ed635bc","sha256":"5c1cca89666988ba8e5f500c1eddac525d6dcc4f5ad01f17eb4c6e7bbf7a025a","bytes":9022},"technicalRef":{"commit":"1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2","path":"docs/operations/m3-e052-q5-complete-given-20261116/student-ui-technical-v1.json","gitBlobSha1":"e3acc11099e73b7b8cf7d9d1f5d975a3acc10ccb","sha256":"c96b586c177b4958620c658a0d135e04c3e66d66e4374a4e2b6941c847d44e2f","bytes":76825},"visualRef":{"commit":"1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2","path":"docs/operations/m3-e052-q5-complete-given-20261116/student-ui-independent-v1.json","gitBlobSha1":"ba2b198f2e8876f2667f29e12e595556714460c5","sha256":"d3a1eaa44d2801af173f7721d634cc6788ecfad46428ac80693f9fccbb2bf95e","bytes":1736}},"priorRegisteredCount":25,"priorQ5RecordSha256":"63a916992b4df7e2072fb6ff12155c55eb5728e4c3a1fcd1d7f53af6b528cce1","compactItemsSha256":"9f29dca5d4b196b616e7882a5423337b16f3bd9989097d617797feb59d1d564c","compactItem5Sha256":"71b4098640d18308c56cc3a62f079b99af88c2b199c3df8f2aac795c6828fdeb","requestSha256":"e0211e0093661e782455ce631e8cb68fbd1fe9f65479e3a8b8162b8ba82eb317","requestSnapshotSha256":"85f701caafb1c11c38061844edc77eafafe55d6f46f3419cabed56fdb4eca216"});
function descriptor() {
  return { schemaVersion: SCHEMA, scope: 'EXACT_EXISTING_Q5_VECTOR_ONLY', questionUid: UID,
    sourceArchiveFile: SOURCE, sourceOrdinal: ORDINAL, expectedQuestionCount: 25,
    selectedUidCount: 1, outsideScopeCount: 24, refs: structuredClone(PINS.refs),
    request: { requestId: REQUEST_ID, path: REQUEST_WITNESS, rawSha256: PINS.requestSha256, snapshotSha256: PINS.requestSnapshotSha256 },
    receiptPath: RECEIPT, sourceBindingPath: SOURCE_BINDING, compactItemsSha256: PINS.compactItemsSha256,
    compactItemSha256: PINS.compactItem5Sha256, priorIndexRecordSha256: PINS.priorQ5RecordSha256,
    newFourSlotApprovals: 0, newMathematicalQa: false, newMetadataApprovals: 0 };
}
function assertDescriptor(doc) { if (!same(doc, descriptor())) fail('CLOSED_DESCRIPTOR_REQUIRED'); return true; }
function collect(root, { safe, walk, sha: digest }) {
  const dir = safe(root, DIR), bySource = new Map();
  if (!fs.existsSync(dir)) return bySource;
  const files = walk(dir); if (!files.length) return bySource;
  if (files.length !== 1 || path.relative(root, files[0]).split(path.sep).join('/') !== FILE)
    fail('EXACT_ONE_CARRIER_REQUIRED');
  const raw = fs.readFileSync(files[0]), doc = JSON.parse(raw); assertDescriptor(doc);
  // The prior index and original review are immutable Git witnesses. In
  // particular, the live output index must never become its own cache input.
  const liveRefs = ['compactRef', 'dictionaryRef', 'currentSourceRef', 'applicationRef', 'technicalRef', 'visualRef'];
  const paths = [FILE, MD, ID, RUNTIME, RECEIPT, SOURCE_BINDING, REQUEST_WITNESS, ...liveRefs.map(key => PINS.refs[key].path), ...CURRENT_UI_PATHS];
  for (const prefix of ['archive/data/meta-foundation/canonical', 'archive/data/meta-foundation/compiled',
    'archive/tools/meta-foundation']) for (const f of walk(safe(root, prefix))) paths.push(path.relative(root, f).split(path.sep).join('/'));
  const digests = [...new Set(paths)].sort().map(p => {
    try { return [p, digest(fs.readFileSync(safe(root, p)))]; } catch { return [p, null]; }
  });
  bySource.set(SOURCE, [{ path: FILE, sha256: digest(raw), questionUid: UID, sourceOrdinal: ORDINAL, digests }]);
  return bySource;
}
function verify(root, entry, context) {
  if (entry.path !== FILE || entry.questionUid !== UID || entry.sourceOrdinal !== ORDINAL ||
    context.d.sourceArchiveFile !== SOURCE || context.it.ordinal !== ORDINAL || context.id.questionUid !== UID ||
    context.id.sourceOrdinal !== ORDINAL || context.cur.ordinal !== ORDINAL || context.uidUses.get(UID) !== 1 ||
    context.bank.length !== 25) fail('CURRENT_SUBJECT_OR_DENOMINATOR');
  const raw = fs.readFileSync(context.safe(root, FILE));
  if (sha(raw) !== entry.sha256) fail('CARRIER_CHANGED'); assertDescriptor(JSON.parse(raw));
  try {
    const result = JSON.parse(execFileSync(process.execPath, [worker, root, FILE], {
      encoding: 'utf8', timeout: 90000, maxBuffer: 4 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }));
    if (result.status !== 'PASS' || result.questionUid !== UID || result.sourceOrdinal !== ORDINAL ||
      result.sourceBinding !== BINDING || result.carrierSha256 !== entry.sha256 ||
      result.newFourSlotApprovals !== 0 || !Array.isArray(result.observed)) fail('WORKER_RESULT');
    return { ref: { path: FILE, sha256: entry.sha256 }, observed: result.observed,
      receiptSha256: result.receiptSha256, sourceBindingSha256: result.sourceBindingSha256 };
  } catch (e) { fail('ISSUED_PROOF_REJECTED:' + String(e.stderr || e.message).trim().slice(0, 300)); }
}
module.exports = { DIR, FILE, UID, SOURCE, ORDINAL, SCHEMA, BINDING, REQUEST_ID, REQUEST_WITNESS, RECEIPT,
  SOURCE_BINDING, MD, ID, RUNTIME, PINS, CURRENT_UI_PATHS, worker, descriptor, assertDescriptor, collect, verify };
