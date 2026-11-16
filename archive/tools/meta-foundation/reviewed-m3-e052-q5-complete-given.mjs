import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { validateM2ProblemRendererUiTileEvidence } from './reviewed-m2-problem-renderer-continuity.mjs';

// This named contract transports one already frozen complete-given review. It
// neither replaces the complete original Native review nor grants another UID
// a display exception. Only image is restored in the comparison view, after
// all source, original-asset, current-definition and real UI witnesses pass.
export const M3_Q5_COMPLETE_GIVEN_SCHEMA = 'archive-m3-e052-q5-complete-given-application-v1';
export const M3_Q5_UID = 'qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1';
const Q12_UID = 'qid_v1_1aac12db1a167973138e8dc51afcd5e0b19fcf73d4bb030ea406701acd0b8c4a';
const SOURCE = 'original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js';
const DIR = 'docs/operations/m3-e052-q5-complete-given-20261116/';
const BASIS = Object.freeze({ path: DIR + 'application-basis-v1.json',
  sha256: '5c1cca89666988ba8e5f500c1eddac525d6dcc4f5ad01f17eb4c6e7bbf7a025a',
  gitBlobSha1: 'f2a96c282b365405c05ae7ad78c04c710ed635bc', bytes: 9022 });
// The actual current AutoMeta cursor predates the already issued course alias.
// It is one immutable public question, not a generic missing-course allowance.
const OLD_CURSOR_SOURCE = Object.freeze({
  commit: '8c27587b8e7bbab6d35e0bc1d95d0c2a1beb63cd', path: `archive/exams/${SOURCE}`,
  gitBlobSha1: '5a9e25d32e96a19bb6bb2f2f8265446cb92fee34',
  sha256: 'ccab19ec3a0546078515c3a5d0da6396d18bb7f134c9e53847d7b7fc7f7cadb9', bytes: 66266 });
const OLD_CURSOR_QUESTION_SHA256 = 'e13c954d264435835a1a62b0739c77e03130e1d7d75134b3137017ea5a7ab881';
const REF_KEYS = ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'];
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const text = value => typeof value === 'string' && value.trim().length > 0;
const keys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value) &&
  same(Object.keys(value).sort(), expected.slice().sort());
const fail = code => { throw new Error(`M3 Q5 complete given: ${code}`); };
const ensure = (value, code) => { if (!value) fail(code); };
const refOnly = value => Object.fromEntries(REF_KEYS.map(key => [key, value[key]]));
const noCommit = ref => Object.fromEntries(REF_KEYS.filter(k => k !== 'commit').map(k => [k, ref[k]]));

function safe(root, relative) {
  ensure(text(relative) && !path.isAbsolute(relative) && !/[\\\x00-\x1f]/.test(relative) &&
    relative.split('/').every(part => part && part !== '.' && part !== '..'), 'UNSAFE_PATH');
  const full = path.resolve(root, relative);
  for (let at = full; at !== path.resolve(root); at = path.dirname(at))
    ensure(!fs.existsSync(at) || !fs.lstatSync(at).isSymbolicLink(), 'SYMLINK_PATH');
  return full;
}
function git(ctx, args, limit = 16 * 1024 * 1024) {
  try { return execFileSync('git', args, { cwd: ctx.root, maxBuffer: limit, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE'); }
}
// Large historical MD/ID references are streamed in a small child process.
// Their bytes are authenticated, never copied into a mutable fixture or cache.
const STREAM_DIGEST = `
import fs from 'node:fs';import crypto from 'node:crypto';import{spawn}from'node:child_process';
const[kind,target,sizeText]=process.argv.slice(1),size=Number(sizeText),a=crypto.createHash('sha256'),b=crypto.createHash('sha1');
b.update('blob '+size+'\\0');let count=0,p;
const input=kind==='git'?(p=spawn('git',['cat-file','blob',target],{stdio:['ignore','pipe','pipe']})).stdout:fs.createReadStream(target);
if(p)p.stderr.resume();const done=p?new Promise((resolve,reject)=>{p.on('error',reject);p.on('close',code=>code===0?resolve():reject(Error('git')))}):null;
for await(const chunk of input){count+=chunk.length;a.update(chunk);b.update(chunk)}if(done)await done;
if(count!==size)throw Error('size');process.stdout.write(JSON.stringify({sha256:a.digest('hex'),gitBlobSha1:b.digest('hex'),bytes:count}));`;
function digestFile(ctx, kind, target, size) {
  try { return JSON.parse(execFileSync(process.execPath, ['--max-old-space-size=64', '--input-type=module', '-e', STREAM_DIGEST,
    kind, target, String(size)], { cwd: ctx.root, maxBuffer: 4096, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, stdio: ['ignore', 'pipe', 'pipe'] })); }
  catch { fail('REFERENCE_DIGEST_UNAVAILABLE'); }
}
function reference(ctx, ref, { live = false, data = false } = {}) {
  ensure(keys(ref, REF_KEYS) && SHA1.test(ref.commit || '') && SHA1.test(ref.gitBlobSha1 || '') &&
    SHA256.test(ref.sha256 || '') && Number.isSafeInteger(ref.bytes) && ref.bytes > 0 && ref.bytes <= 128 * 1024 * 1024,
  'EXACT_REFERENCE_REQUIRED');
  const full = safe(ctx.root, ref.path), cacheKey = stable(['m3-q5-ref', ctx.root, ref]);
  let verified = ctx.cache.get(cacheKey);
  if (!verified) {
    ensure(git(ctx, ['rev-parse', '--verify', `${ref.commit}^{commit}`]).toString().trim() === ref.commit, 'EXACT_COMMIT_REQUIRED');
    const entry = git(ctx, ['ls-tree', '-z', ref.commit, '--', ref.path]).toString();
    ensure(entry === `100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`, 'REGULAR_GIT_BLOB_REQUIRED');
    ensure(Number(git(ctx, ['cat-file', '-s', ref.gitBlobSha1]).toString()) === ref.bytes, 'GIT_SIZE_DRIFT');
    let bytes, digest;
    if (ref.bytes <= 4 * 1024 * 1024) {
      bytes = git(ctx, ['cat-file', 'blob', ref.gitBlobSha1]);
      digest = { sha256: sha(bytes), gitBlobSha1: blob(bytes), bytes: bytes.length };
    } else digest = digestFile(ctx, 'git', ref.gitBlobSha1, ref.bytes);
    ensure(same(digest, { sha256: ref.sha256, gitBlobSha1: ref.gitBlobSha1, bytes: ref.bytes }), 'GIT_RAW_DRIFT');
    verified = { ref, bytes }; ctx.cache.set(cacheKey, verified);
  }
  if (live) {
    ensure(fs.existsSync(full) && fs.lstatSync(full).isFile() && fs.statSync(full).size === ref.bytes, 'LIVE_FILE_MISSING_OR_SIZE_DRIFT');
    const bytes = ref.bytes <= 4 * 1024 * 1024 ? fs.readFileSync(full) : null;
    const digest = bytes ? { sha256: sha(bytes), gitBlobSha1: blob(bytes), bytes: bytes.length } : digestFile(ctx, 'file', full, ref.bytes);
    ensure(same(digest, { sha256: ref.sha256, gitBlobSha1: ref.gitBlobSha1, bytes: ref.bytes }), 'LIVE_RAW_DRIFT');
  }
  if (!data) return ref;
  ensure(verified.bytes, 'SMALL_DATA_REFERENCE_REQUIRED');
  return verified.bytes;
}
function jsonReference(ctx, ref, options) {
  const bytes = reference(ctx, ref, { ...options, data: true });
  try { return JSON.parse(bytes); } catch { fail('REFERENCE_JSON_INVALID'); }
}
function evidence(ctx, ref, expectedPath) {
  ensure(ref?.path === expectedPath, 'EVIDENCE_PATH_OUTSIDE_COHORT');
  const short = { path: ref.path, sha256: ref.sha256 };
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    ensure(Array.isArray(refs) && refs.filter(row => row.path === short.path).length === 1 &&
      refs.some(row => same(row, short)), 'EVIDENCE_MUST_BIND_APPROVAL_AND_ITEM');
  return jsonReference(ctx, ref, { live: true });
}

export function loadM3Q5CompleteGivenBank(bytes) {
  assert(Buffer.isBuffer(bytes) && bytes.length > 0 && bytes.length <= 16 * 1024 * 1024, 'Q5_SOURCE_SIZE');
  const context = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
  new vm.Script('globalThis.window={};globalThis.console={log(){},warn(){},error(){}};').runInContext(context, { timeout: 1500 });
  new vm.Script(bytes.toString('utf8'), { filename: 'q5-bound-source.js' }).runInContext(context, { timeout: 1500 });
  const json = new vm.Script(`(() => {
    const bank = window.questionBank ?? globalThis.questionBank ?? window.examData?.questions ?? globalThis.examData?.questions;
    if (!Array.isArray(bank) || !bank.length) throw Error('Q5_BANK_REQUIRED');
    const seen = new Set();
    function data(value) {
      if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return;
      if (!value || typeof value !== 'object' || seen.has(value)) throw Error('Q5_SOURCE_DATA');
      seen.add(value);
      if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) throw Error('Q5_SOURCE_PROTOTYPE');
      for (const key of Reflect.ownKeys(value)) {
        if (Array.isArray(value) && key === 'length') continue;
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (typeof key !== 'string' || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) throw Error('Q5_SOURCE_DESCRIPTOR');
        data(descriptor.value);
      }
      if (Array.isArray(value) && Object.keys(value).length !== value.length) throw Error('Q5_SOURCE_ARRAY');
      seen.delete(value);
    }
    data(bank); return JSON.stringify(bank);
  })()`).runInContext(context, { timeout: 1500 });
  return JSON.parse(json);
}

const VIEWPORTS = [{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }];
const ROLE_PROOF = { schemaVersion: 'archive-m3-e052-q5-equal-slot-capture-v1', sourceOrdinal: 5, bankCount: 25,
  actualDirectChildren: 1, wrapperClass: 'ap-slot-content', roleOrder: ['q-num', 'q-content', 'q-image-wrap', 'choices'],
  roleDescendants: 4, choiceItems: 5, targetImages: 1, contentMath: 5, choiceMath: 5, hiddenRoles: 0,
  unknownDirectNodes: 0, foreignMedia: 0, completeWrapperEnvelope: true };
const UI_CODE = [
  ['tests/fixtures/archive-m3-e052-q5-problem-ui.json', '6a130b5af0bde204ede90211ae779b92ff74022f', '1ad5d743e74665f42ba8abc3213a81e7c768eb771a8575314c6e9404e851b9cb', 1807],
  ['tools/check-m3-e052-q5-problem-browser.cjs', '5937d98954764d79bf8efc2b528cd3a5b791c573', '0386a00334a011de691a2d298f1822f8d9894e60090d8020fc7e01a10e62762d', 59715],
  ['tools/check-reviewed-problem-renderer-browser.cjs', '56c80b40d53fa88e8054a16f7b7267f968696f3f', 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673', 56735],
  ['archive/equal-slot-engine.js', 'c826512ff61d4969c7ce45ba8f4ee002286bcf10', '4979ccfd129470e076965bf93bb86e089d53c4ea875a17b011760886f967177a', 20518],
  ['archive/exam-render-executor.js', '583a72ae2c960d485cdcd1c1aec1329f204067b6', 'e4ac35518351fd89d16222df4221e64a32121213f5b99c831407a61d90b573d7', 24896],
  ['archive/engine.html', '905952ae39138e1f6dc0aa2d7c7c8a64403f527b', 'a963c562478b96f7f9d8ae09ad6e5c85b3262296d734e7abd001836e1c3f317b', 201060],
  ['archive/screen-runtime-adapter.js', '3d8f3159934c99637c4df893649adbc331065d96', '2834bd3d0f3b40264921e15a85840df3d2374c7fcc6158844ce12883fb7cdd93', 52980],
].map(([path, gitBlobSha1, sha256, bytes]) => ({ path, gitBlobSha1, sha256, bytes }));

function uiEvidence(ctx, basis) {
  const technical = evidence(ctx, ctx.spec.technicalRef, DIR + 'student-ui-technical-v1.json');
  const visual = evidence(ctx, ctx.spec.visualRef, DIR + 'student-ui-independent-v1.json');
  ensure(technical.schemaVersion === 'archive-m3-e052-q5-student-ui-preview-v1' &&
    technical.executionOwner === 'GITHUB_ACTIONS_SUPPORTED_CHROME' && technical.status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING' &&
    technical.releaseGate === 'PENDING_INDEPENDENT_VISUAL_REVIEW' && SHA1.test(technical.checkoutCommit || '') &&
    same(technical.checkout, { expectedCheckoutCommit: technical.checkoutCommit, actualCheckoutCommit: technical.checkoutCommit,
      githubEventCommit: technical.checkoutCommit }) && technical.mode === 'exam' && technical.studentReview === true &&
    technical.screenshotsScope === 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY' && technical.problemOnlyScreenshots === true &&
    technical.sourceOverlay === false && technical.sourceOverlayCount === 0 && technical.sourceWrites === 0 &&
    technical.solutionsOpened === false && technical.productionCdnTest === false &&
    technical.assetTransport === 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN' &&
    technical.fontTransport === 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS' &&
    technical.newFullMathematicalQa === false && ['newParentApprovals', 'newNativeApprovals', 'newMetadataApprovals',
      'newDifficultyJudgments', 'newReviewPassCount', 'newFourSlotApprovals'].every(k => technical[k] === 0) &&
    same(technical.failures, []) && same(technical.externalFontResources, []) && !Object.hasOwn(technical, 'failureCode') &&
    !Object.hasOwn(technical, 'diagnosticFrames') && technical.expectedLogicalCases === 2 && technical.completedLogicalCases === 2 &&
    Array.isArray(technical.items) && technical.items.length === 1 && Array.isArray(technical.results) && technical.results.length === 2 &&
    Array.isArray(technical.screenshotArtifacts) && technical.screenshotArtifacts.length === technical.screenshotArtifactCount &&
    technical.screenshotArtifactCount >= 2 && technical.screenshotArtifactCount <= 16, 'ACTUAL_COMPLETE_UI_REQUIRED');
  ensure(keys(visual, ['schemaVersion', 'scope', 'decision', 'reviewer', 'producerOwner', 'technicalRef', 'records',
    'newMathematicalQa', 'newNativeApprovals', 'newMetadataApprovals', 'newDifficultyJudgments', 'newReview2Claims']) &&
    visual.schemaVersion === 'archive-independent-m3-e052-q5-student-ui-review-v1' &&
    visual.scope === 'EXACT_E052_Q5_COMPLETE_GIVEN_ONLY' && visual.decision === 'APPROVE_EXACT_STUDENT_UI' &&
    visual.reviewer === 'GPT_ROOT_C8F1B0BFB4FA' && visual.producerOwner === 'GPT_M3S2_RELEASE_20261116' && visual.reviewer !== visual.producerOwner &&
    visual.reviewer !== ctx.native.reviewer && same(visual.technicalRef, { path: ctx.spec.technicalRef.path, sha256: ctx.spec.technicalRef.sha256 }) &&
    visual.newMathematicalQa === false && ['newNativeApprovals', 'newMetadataApprovals', 'newDifficultyJudgments', 'newReview2Claims'].every(k => visual[k] === 0) &&
    Array.isArray(visual.records) && visual.records.length === 2, 'INDEPENDENT_ALL_TILES_VISUAL_REQUIRED');
  const atCheckout = (ref, opts = {}) => {
    ensure(ref?.commit === technical.checkoutCommit, 'UI_CHECKOUT_REF_DRIFT');
    return reference(ctx, ref, opts);
  };
  for (const [ref, pin] of [[technical.manifestRef, UI_CODE[0]], [technical.checkerRef, UI_CODE[1]],
    [technical.captureHelperRef, UI_CODE[2]]]) {
    ensure(same(noCommit(ref || {}), pin), 'UI_EXECUTED_CODE_DRIFT'); atCheckout(ref, { live: pin.path === UI_CODE[2].path });
  }
  ensure(Array.isArray(technical.surfaceRefs) && same(technical.surfaceRefs.map(noCommit), UI_CODE.slice(5)), 'UI_SURFACE_INVENTORY');
  technical.surfaceRefs.forEach(ref => atCheckout(ref, { live: true }));
  ensure(technical.identityRef?.path === 'archive/data/question_identity_map.json', 'UI_IDENTITY_REFERENCE');
  atCheckout(technical.identityRef); // Issued identity changes are checked by the ordinary registrar, not a stale whole DB equality.
  const item = technical.items[0];
  ensure(item.key === 'E052-Q5' && item.questionUid === M3_Q5_UID && item.sourceOrdinal === 5 && item.expectedBankCount === 25 &&
    item.imageBinding === 'QUESTION_IMAGE' && item.expectedImageWidth === 550 && item.expectedImageHeight === 330 &&
    same(noCommit(item.sourceRef || {}), noCommit(basis.sourceAfterRef)) &&
    same(noCommit(item.assetRef || {}), noCommit(basis.newAssetRef)), 'UI_SELECTED_SOURCE_ASSET_DRIFT');
  atCheckout(item.sourceRef, { live: true }); atCheckout(item.assetRef, { live: true });
  const fontMap = new Map();
  ensure(Array.isArray(technical.studentFontResources) && technical.studentFontResources.length > 3, 'UI_FONT_RESPONSES_REQUIRED');
  for (const font of technical.studentFontResources) {
    ensure(keys(font, [...REF_KEYS, 'resourceId', 'kind', 'mime', 'status', 'weight']) &&
      font.path.startsWith('archive/vendor/nanum-myeongjo/') && font.status === 200 &&
      font.resourceId === sha(stable({ path: font.path, responseSha256: font.sha256, mime: font.mime })) && !fontMap.has(font.resourceId) &&
      (font.kind === 'STYLESHEET' ? font.path === 'archive/vendor/nanum-myeongjo/nanum-myeongjo.css' && font.mime === 'text/css' && font.weight === null :
        font.kind === 'FONT' && /\/[A-Za-z0-9_-]+(?:\.[0-9]{1,3})?\.woff2$/.test(font.path) && font.mime === 'font/woff2' && [400, 700, 800].includes(font.weight)),
    'UI_FONT_RESPONSE_INVALID');
    atCheckout(refOnly(font), { live: true }); fontMap.set(font.resourceId, font);
  }
  ensure(technical.fontLicenseRef?.path === 'archive/vendor/nanum-myeongjo/OFL.txt', 'UI_FONT_LICENSE_REQUIRED');
  atCheckout(technical.fontLicenseRef, { live: true });
  const served = new Map();
  for (const list of [technical.servedFiles, technical.mirroredAssets]) {
    ensure(Array.isArray(list) && list.length > 0 && new Set(list.map(ref => ref.path)).size === list.length, 'UI_SERVED_INVENTORY');
    for (const ref of list) {
      if (served.has(ref.path)) ensure(same(served.get(ref.path), ref), 'UI_SERVED_ALIAS_DRIFT');
      served.set(ref.path, ref);
      // The captured whole MD is immutable evidence of the screen. The ordinary
      // Native/Consumer validates the newly issued selected row after writing.
      atCheckout(ref, { live: ref.path !== 'archive/data/question_metadata.json' });
    }
  }
  for (const pin of UI_CODE.slice(3)) ensure(same(noCommit(served.get(pin.path) || {}), pin), 'UI_REQUIRED_SERVED_CODE_MISSING');
  ensure(same(served.get(item.sourceRef.path), item.sourceRef) && same(served.get(item.assetRef.path), item.assetRef), 'UI_REQUIRED_INPUT_NOT_SERVED');
  const inventory = [];
  for (const viewport of VIEWPORTS) {
    const rows = technical.results.filter(row => same(row.viewport, viewport));
    const reviews = visual.records.filter(row => row.viewport === viewport.name);
    ensure(rows.length === 1 && reviews.length === 1, 'UI_UNIQUE_TWO_VIEWPORTS');
    const row = rows[0], review = reviews[0], t = row.technical, g = row.geometry, c = row.capture;
    ensure(row.status === 'PASS' && row.visualReview === 'PENDING' && row.key === item.key && row.questionUid === M3_Q5_UID && row.sourceOrdinal === 5 &&
      review.questionUid === M3_Q5_UID && review.sourceOrdinal === 5 && same(row.sourceRef, item.sourceRef) && same(row.assetRef, item.assetRef) &&
      t?.mode === 'exam' && t.questions === 25 && Number.isSafeInteger(t.pages) && t.pages > 0 && t.readiness === 'RENDER_READY' &&
      t.imagesComplete === true && t.mathErrors === 0 && t.unrenderedMath === 0 && t.mathJaxSource === 'local' && t.solutionNodes === 0 &&
      g?.naturalWidth === 550 && g.naturalHeight === 330 && g.imageInsideQuestion === true && g.image?.width > 0 && g.questionNumber === '5.' &&
      [row.pageErrors, row.requestFailures, row.externalRequests].every(list => same(list, [])), 'UI_ROW_NOT_READY');
    const font = t.fontReadiness, ids = t.fontResourceIds;
    ensure(font?.status === 'loaded' && font.family === 'Nanum Myeongjo' && Array.isArray(font.weights) &&
      same(font.weights.map(value => value.weight), [400, 700, 800]) && font.weights.every(value =>
        value.checked === true && value.allLoaded === true && Number.isSafeInteger(value.loadedFaces) && value.loadedFaces > 0) &&
      Array.isArray(font.problemFontFamilies) && font.problemFontFamilies.length > 0 &&
      font.problemFontFamilies.every(value => typeof value === 'string' && value.includes('Nanum Myeongjo')) &&
      Array.isArray(ids) && ids.length === new Set(ids).size && ids.every(id => fontMap.has(id)) &&
      ids.some(id => fontMap.get(id).kind === 'STYLESHEET') && font.weights.every(weight =>
        ids.filter(id => fontMap.get(id).kind === 'FONT' && fontMap.get(id).weight === weight.weight).length >= weight.loadedFaces),
    'UI_FONT_READINESS_OR_RESPONSES');
    ensure(same(c?.equalSlotRoles, ROLE_PROOF) && c.visibleChildren === 1 && c.visibleRoleDescendants === 4 && c.measuredEnvelopeRects === 5 &&
      Array.isArray(c.equalSlotEvidence) && c.equalSlotEvidence.length === 7 &&
      same(c.equalSlotEvidence.slice(0, 2), [item.sourceRef, item.assetRef]) &&
      same(c.equalSlotEvidence.slice(2).map(noCommit), UI_CODE.slice(0, 5)), 'UI_EXACT_EQUAL_SLOT_ROLES_REQUIRED');
    c.equalSlotEvidence.forEach(ref => atCheckout(ref));
    const common = { ...c };
    for (const key of ['equalSlotRoles', 'equalSlotEvidence', 'visibleRoleDescendants', 'measuredEnvelopeRects']) delete common[key];
    // This unchanged pure validator checks the original PNG inventory, exact
    // viewport/clip geometry, 32px overlap, 8 tile bound, every obstruction and
    // foreign hit, unchanged DOM, and the independent review of every tile.
    validateM2ProblemRendererUiTileEvidence(ctx, { ...row, capture: common }, review, item.key);
    inventory.push(...row.screenshots.map(shot => ({ path: shot.path, sha256: shot.sha256, bytes: shot.bytes })));
  }
  ensure(new Set(inventory.map(row => row.path)).size === inventory.length &&
    same(inventory.slice().sort((a, b) => a.path.localeCompare(b.path)),
      technical.screenshotArtifacts.slice().sort((a, b) => a.path.localeCompare(b.path))), 'UI_COMPLETE_ORIGINAL_PNG_INVENTORY');
  return { technicalRef: ctx.spec.technicalRef, visualRef: ctx.spec.visualRef, checkoutCommit: technical.checkoutCommit,
    reviewer: visual.reviewer, logicalCases: 2, screenshotArtifactCount: inventory.length, screenshots: inventory,
    originalTilesOnly: true, newMathematicalQa: false, newNativeApprovals: 0 };
}

function currentDefinitions(ctx, basis) {
  const refs = new Map(), rows = [];
  for (const pin of basis.definitions) {
    const key = stable(pin.ref);
    if (!refs.has(key)) refs.set(key, jsonReference(ctx, pin.ref));
    const list = refs.get(key)[pin.collection];
    const identityKey = { problemTypes: 'problemTypeKey', templates: 'templateKey', concepts: 'conceptKey' }[pin.collection];
    const selected = Array.isArray(list) ? list.filter(row => pin.collection === 'bindings'
      ? [row.curriculum, row.standardCourse, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join('|') === pin.key
      : row[identityKey] === pin.key) : [];
    ensure(selected.length === 1 && sha(stable(selected[0])) === pin.rowSha256 && selected[0].status === 'ACTIVE', 'HISTORICAL_ACTIVE_DEFINITION_DRIFT');
    const tableKey = { problemTypes: 'pt', templates: 'tpl', concepts: 'cc', bindings: 'bindings' }[pin.collection];
    for (const tables of [ctx.canonicalBefore, ctx.canonicalAfter]) {
      ensure(tables?.[tableKey] instanceof Map, 'CURRENT_DEFINITION_TABLE_REQUIRED');
      const actual = [...tables[tableKey].values()].filter(row => pin.collection === 'bindings'
        ? [row.curriculum, row.standardCourse, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join('|') === pin.key
        : row[identityKey] === pin.key);
      ensure(actual.length === 1 && same(actual[0], selected[0]), 'CURRENT_ACTIVE_DEFINITION_DRIFT');
    }
    rows.push({ collection: pin.collection, key: pin.key, rowSha256: pin.rowSha256 });
  }
  ensure(rows.length === 5, 'EXACT_ACTIVE_FIVE_DEFINITIONS_REQUIRED');
  for (const [key, value] of Object.entries(basis.activeTuple)) {
    const actual = key === 'curriculumKey' ? ctx.final.curriculumKey ?? ctx.final.curriculum : ctx.final[key];
    ensure(same(actual, value), 'FINAL_ACTIVE_TUPLE_DIFFERS_FROM_FROZEN_RECOMMENDATION');
  }
  return rows;
}

export function validateM3Q5CompleteGivenApplication(args) {
  const spec = args.patch.sourceReview?.q5CompleteGivenApplication;
  if (spec === undefined) return null;
  const ctx = { ...args, spec, cache: args.cache || new Map() }, { request, patch, native, row, question } = ctx;
  ensure(keys(spec, ['schemaVersion', 'applicationRef', 'technicalRef', 'visualRef']) && spec.schemaVersion === M3_Q5_COMPLETE_GIVEN_SCHEMA &&
    request.scope === 'PARTIAL_UIDS' && request.approval?.type === 'FINAL_QA' && request.approval.metadataReviewed === true &&
    request.approval.sourceRebind === undefined && request.registrationMode === undefined && patch.rebind === undefined &&
    request.sourceArchiveFile === SOURCE && request.expectedQuestionCount === 25 && (request.registryChanges || []).length === 0 &&
    patch.questionUid === M3_Q5_UID && patch.sourceOrdinal === 5 && SHA256.test(patch.after?.sourceFingerprint || '') &&
    SHA256.test(patch.after?.contentFingerprint || ''), 'EXCLUSIVE_Q5_FINGERPRINT_APPLICATION_REQUIRED');
  ensure(Array.isArray(request.items) && request.items.length === 2 && request.items.filter(item => item.questionUid === M3_Q5_UID && item.sourceOrdinal === 5).length === 1 &&
    request.items.filter(item => item.questionUid === Q12_UID && item.sourceOrdinal === 12).length === 1 &&
    request.items.every(item => item.questionUid === M3_Q5_UID || item.sourceReview?.q5CompleteGivenApplication === undefined),
  'EXACT_EXISTING_Q5_Q12_REQUEST_INVENTORY_REQUIRED');
  ensure(keys(patch.sourceReview, ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef', 'proposalFinalization', 'q5CompleteGivenApplication']),
    'ORIGINAL_NATIVE_AND_CC_AUTHORITY_REQUIRED');
  ensure(same(noCommit(spec.applicationRef || {}), BASIS), 'FROZEN_APPLICATION_BASIS_REQUIRED');
  const basis = evidence(ctx, spec.applicationRef, BASIS.path);
  ensure(basis.questionUid === M3_Q5_UID && basis.sourceOrdinal === 5 && basis.expectedQuestionCount === 25 && basis.selectedUidCount === 1 &&
    basis.outsideScopeCount === 24 && basis.newFullMathematicalQa === false && basis.newNativeApprovals === 0, 'BASIS_SCOPE');
  const normalizedPatch = { ...patch, sourceReview: { ...patch.sourceReview } };
  delete normalizedPatch.sourceReview.q5CompleteGivenApplication;
  ensure(same(normalizedPatch.sourceReview, basis.originalSourceReview) &&
    sha(stable(normalizedPatch.sourceReview)) === basis.originalSourceReviewSha256, 'ORIGINAL_AUTHORITY_CHANGED');
  const companion = request.items.find(item => item.questionUid === Q12_UID), companionReview = { ...basis.originalSourceReview };
  delete companionReview.proposalFinalization;
  ensure(same(companion.sourceReview, companionReview) && companion.rebind === undefined, 'Q12_MUST_KEEP_ORDINARY_NATIVE_AUTHORITY');
  ensure(native.review?.schemaVersion === 'm3-s2-complete-semantic-review-v1' && native.reviewer === native.review.author &&
    native.spec.reviewCommit === basis.nativeReviewRef.commit && native.spec.reviewPath === basis.nativeReviewRef.path &&
    native.spec.reviewRef.sha256 === basis.nativeReviewRef.sha256 && row.questionUid === M3_Q5_UID && row.ordinal === 5 &&
    sha(stable(row)) === basis.nativeSelectedRowSha256 && native.reviewedBank?.length === 25 && native.committedBank?.length === 25 &&
    native.rows instanceof Map && native.rows.size === 25, 'ORIGINAL_COMPLETE_NATIVE_CHANGED');
  const originalNative = jsonReference(ctx, basis.nativeReviewRef);
  ensure(same(originalNative, native.review), 'COMPLETE_NATIVE_DOCUMENT_DIFFERS');
  const nativeSource = { commit: basis.nativeReviewRef.commit, path: `archive/exams/${SOURCE}`,
    gitBlobSha1: originalNative.sourceAfterBlob, sha256: originalNative.sourceAfterSha256,
    bytes: Number(git(ctx, ['cat-file', '-s', originalNative.sourceAfterBlob]).toString()) };
  const nativeBank = loadM3Q5CompleteGivenBank(reference(ctx, nativeSource, { data: true }));
  ensure(nativeBank.length === 25 && native.sourceBlob === nativeSource.gitBlobSha1 && native.committedBlob === nativeSource.gitBlobSha1 &&
    same(nativeBank, native.reviewedBank) && same(nativeBank, native.committedBank), 'COMPLETE_NATIVE_SOURCE_DIFFERS');
  const staticDoc = jsonReference(ctx, basis.staticRef);
  ensure(staticDoc.reviewer === basis.independentReviewer && staticDoc.producer === basis.producer &&
    basis.independentReviewer !== basis.producer, 'INDEPENDENT_GIVEN_AUTHORITY_CHANGED');
  const beforeBytes = reference(ctx, basis.sourceBeforeRef, { data: true });
  const afterBytes = reference(ctx, basis.sourceAfterRef, { live: true, data: true });
  ensure(basis.sourceBeforeRef.path === `archive/exams/${SOURCE}` && basis.sourceAfterRef.path === basis.sourceBeforeRef.path &&
    request.expectedSourceBlobSha1 === basis.sourceAfterRef.gitBlobSha1, 'CURRENT_SOURCE_CAS');
  const beforeBank = loadM3Q5CompleteGivenBank(beforeBytes), afterBank = loadM3Q5CompleteGivenBank(afterBytes);
  ensure(beforeBank.length === 25 && afterBank.length === 25 && same(afterBank[4], question) &&
    sha(stable(beforeBank[4])) === basis.wholeQuestionBeforeSha256 && sha(stable(question)) === basis.wholeQuestionAfterSha256,
  'WHOLE_QUESTION_OR_DENOMINATOR_DRIFT');
  reference(ctx, basis.oldAssetRef, { live: true }); reference(ctx, basis.newAssetRef, { live: true });
  const oldUri = basis.oldAssetRef.path.slice('archive/'.length), newUri = basis.newAssetRef.path.slice('archive/'.length);
  ensure(beforeBank[4].image === oldUri && question.image === newUri, 'EXACT_IMAGE_POINTER_REQUIRED');
  const normalizedQuestion = { ...question, image: oldUri };
  ensure(same(normalizedQuestion, beforeBank[4]) && beforeBank.every((item, i) => i === 4 || same(item, afterBank[i])), 'ONLY_Q5_IMAGE_MAY_DIFFER');
  const beforeText = beforeBytes.toString('utf8'), oldLiteral = JSON.stringify(oldUri), newLiteral = JSON.stringify(newUri);
  ensure(beforeText.split(oldLiteral).length === 2 && beforeText.replace(oldLiteral, newLiteral) === afterBytes.toString('utf8'),
    'SOURCE_PREFIX_SUFFIX_OR_UNSELECTED_BYTES_CHANGED');
  ensure(same(ctx.studentPayload(normalizedQuestion), ctx.studentPayload(native.reviewedBank[4])) &&
    same(ctx.studentPayload(normalizedQuestion), ctx.studentPayload(native.committedBank[4])), 'NORMALIZED_NATIVE_STUDENT_PAYLOAD_DIFFERS');
  const definitions = currentDefinitions(ctx, basis);
  const ui = uiEvidence(ctx, basis);
  const oldCursorBank = loadM3Q5CompleteGivenBank(reference(ctx, OLD_CURSOR_SOURCE, { data: true }));
  ensure(oldCursorBank.length === 25 && !Object.hasOwn(oldCursorBank[4], 'courseKey') &&
    sha(stable(oldCursorBank[4])) === OLD_CURSOR_QUESTION_SHA256 && beforeBank[4].courseKey === 'M3-2' &&
    same({ ...oldCursorBank[4], courseKey: beforeBank[4].courseKey }, beforeBank[4]),
  'EXACT_HISTORICAL_MISSING_COURSE_CURSOR_REQUIRED');
  const oldCursorCourseBinding = { sourceRef: OLD_CURSOR_SOURCE, questionUid: M3_Q5_UID, sourceOrdinal: 5,
    expectedQuestionCount: 25, wholeQuestionSha256: OLD_CURSOR_QUESTION_SHA256,
    beforeWholeQuestionSha256: basis.wholeQuestionBeforeSha256, missingField: 'courseKey', issuedValue: 'M3-2',
    metadataOnly: true, newMetadataApprovals: 0 };
  // The caller must replay the unmodified complete Native and CC finalization
  // validators with this comparison view before it issues this typed proof.
  return { normalizedPatch, normalizedQuestion, proof: { schemaVersion: M3_Q5_COMPLETE_GIVEN_SCHEMA,
    questionUid: M3_Q5_UID, sourceOrdinal: 5, sourceArchiveFile: SOURCE, expectedQuestionCount: 25,
    selectedAuthorityUidCount: 1, outsideScopeCount: 24, applicationRef: spec.applicationRef,
    originalSourceReviewSha256: basis.originalSourceReviewSha256, independentReviewer: basis.independentReviewer,
    nativeReviewRef: basis.nativeReviewRef, nativeItemSha256: basis.nativeSelectedRowSha256,
    nativeReviewedQuestionSha256: sha(stable(native.reviewedBank[4])), nativeCommittedQuestionSha256: sha(stable(native.committedBank[4])),
    sourceBeforeRef: basis.sourceBeforeRef, sourceAfterRef: basis.sourceAfterRef,
    wholeQuestionBeforeSha256: basis.wholeQuestionBeforeSha256, wholeQuestionAfterSha256: basis.wholeQuestionAfterSha256,
    oldAssetRef: basis.oldAssetRef, newAssetRef: basis.newAssetRef, definitions, ui,
    oldCursorCourseBinding,
    currentStudentPayloadSha256: sha(stable(ctx.studentPayload(question))), originalStudentPayloadSha256: sha(stable(ctx.studentPayload(normalizedQuestion))),
    memoryOnlyNormalization: true, normalizedFields: ['image'], outside24WholeQuestionsUnchanged: true,
    sourceWrites: 0, rendererWrites: 0, canonicalWrites: 0, newMathematicalQa: false, newMetadataApprovals: 0,
    newNativeApprovals: 0, newDifficultyJudgments: 0, newReview2Claims: 0 } };
}
