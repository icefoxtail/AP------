import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { validateM2ProblemRendererUiTileEvidence } from './reviewed-m2-problem-renderer-continuity.mjs';
import SvgIndexContinuity from '../../../tools/4slot/existing-vector-svg-index-continuity.cjs';

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

// The captured global index is immutable screen evidence. A later generated
// index can serve unrelated assets while the exact captured asset lookup stays
// unchanged. Authenticate the old file and compare every field in both visual
// roles using the unchanged student runtime; all asset bytes stay live-bound.
function svgIndexFootprint(ctx, ref, technical) {
  reference(ctx, ref);
  const full = safe(ctx.root, ref.path);
  ensure(fs.existsSync(full) && fs.lstatSync(full).isFile() &&
    fs.statSync(full).size > 0 && fs.statSync(full).size <= 128 * 1024 * 1024, 'LIVE_SVG_INDEX_REQUIRED');
  const originalRaw = git(ctx, ['cat-file', 'blob', ref.gitBlobSha1]);
  ensure(originalRaw.length === ref.bytes && sha(originalRaw) === ref.sha256 &&
    blob(originalRaw) === ref.gitBlobSha1, 'SVG_INDEX_IMMUTABLE_RAW_DRIFT');
  const assetRefs = [...technical.servedFiles, ...technical.mirroredAssets]
    .filter(asset => asset.path.startsWith('archive/assets/'));
  const original = SvgIndexContinuity.parseIndex(originalRaw);
  const current = SvgIndexContinuity.parseIndex(fs.readFileSync(full));
  ensure(same(SvgIndexContinuity.selectEntries(original, assetRefs),
    SvgIndexContinuity.selectEntries(current, assetRefs)), 'SVG_INDEX_CONSUMED_FOOTPRINT_DRIFT');
}

// Render engine files may change after the capture. Their captured Git bytes stay authenticated,
// but the current bytes are not compared with the captured ones (user decision 2026-11-18).
const isRenderEngineFile = p => p === 'archive/engine.html' || p === 'archive/mixed_engine.html' || p === 'apmath/wrong_print_engine.html' ||
  /^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) ||
  /^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(p);

function uiEvidence(ctx, basis) {
  const originalTechnical = evidence(ctx, ctx.spec.technicalRef, DIR + 'student-ui-technical-v1.json');
  const visual = evidence(ctx, ctx.spec.visualRef, DIR + 'student-ui-independent-v1.json');
  const currentUi = currentM3Q5Ui(ctx, originalTechnical, visual);
  const technical = currentUi ? currentUi.technical : originalTechnical;
  const uiCode = currentUi ? CURRENT_Q5_UI.code : UI_CODE;
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
    if (isRenderEngineFile(ref.path)) opts = { ...opts, live: false };
    if (currentUi && opts.live) ensure(git(ctx, ['rev-parse', 'HEAD:' + ref.path]).toString().trim() === ref.gitBlobSha1, 'CURRENT_UI_HEAD_RENDER_DRIFT');
    return reference(ctx, ref, opts);
  };
  for (const [ref, pin] of [[technical.manifestRef, uiCode[0]], [technical.checkerRef, uiCode[1]],
    [technical.captureHelperRef, uiCode[2]]]) {
    ensure(same(noCommit(ref || {}), pin), 'UI_EXECUTED_CODE_DRIFT'); atCheckout(ref, { live: pin.path === uiCode[2].path });
  }
  ensure(Array.isArray(technical.surfaceRefs) && same(technical.surfaceRefs.map(noCommit), uiCode.slice(5)), 'UI_SURFACE_INVENTORY');
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
      if (ref.path === 'archive/data/svg-accessibility-index.js') {
        atCheckout(ref); svgIndexFootprint(ctx, ref, technical);
      } else atCheckout(ref, { live: ref.path !== 'archive/data/question_metadata.json' });
    }
  }
  for (const pin of uiCode.slice(3)) ensure(same(noCommit(served.get(pin.path) || {}), pin), 'UI_REQUIRED_SERVED_CODE_MISSING');
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
      same(c.equalSlotEvidence.slice(2).map(noCommit), uiCode.slice(0, 5)), 'UI_EXACT_EQUAL_SLOT_ROLES_REQUIRED');
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
  // The live current UI has been fully authenticated above. This return belongs
  // to the already-issued source-review proof, whose whole representation must
  // remain unchanged; current UI provenance is verified, not newly issued here.
  return { technicalRef: ctx.spec.technicalRef, visualRef: ctx.spec.visualRef,
    checkoutCommit: originalTechnical.checkoutCommit,
    reviewer: visual.reviewer, logicalCases: 2, screenshotArtifactCount: inventory.length, screenshots: inventory,
    originalTilesOnly: true, newMathematicalQa: false, newNativeApprovals: 0 };
}

// Exact current display reuse. The original request/item evidence and every
// GIVEN/source/complete-review/ancestor condition are checked by the original
// application path. This clause only replaces its stale live UI evidence.
const CURRENT_Q5_UI = freezeQ5CurrentUi({"head":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","technicalRef":{"commit":"90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/technical-proof.json","gitBlobSha1":"0cd74ab0be77a70badcabc655b811bb02cbb9209","sha256":"9248d818ec7c44d3f8f4273526c4af1d70624385d185b63db3270e1324b2c279","bytes":76724},"visualRef":{"commit":"e371e50ba8cb3e317c32cf1d1478b832bb0444c2","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/visual-current-reuse-v1.json","gitBlobSha1":"c12986521a343b4d4ea3dac5fb5282617c5cc69f","sha256":"f7b575307f2105c5e03a96b4b601e8c22953263723810843338a30c043a7ebf3","bytes":7372},"priorTechnicalRef":{"commit":"1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2","path":"docs/operations/m3-e052-q5-complete-given-20261116/student-ui-technical-v1.json","gitBlobSha1":"e3acc11099e73b7b8cf7d9d1f5d975a3acc10ccb","sha256":"c96b586c177b4958620c658a0d135e04c3e66d66e4374a4e2b6941c847d44e2f","bytes":76825},"priorVisualRef":{"commit":"1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2","path":"docs/operations/m3-e052-q5-complete-given-20261116/student-ui-independent-v1.json","gitBlobSha1":"ba2b198f2e8876f2667f29e12e595556714460c5","sha256":"d3a1eaa44d2801af173f7721d634cc6788ecfad46428ac80693f9fccbb2bf95e","bytes":1736},"witnessRef":{"commit":"006e6455f69c092c3251d440daf0c4b07da7a469","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m3/current-four-display-equivalence-v1.json","gitBlobSha1":"56ec9409ca900e94a46d6562e6e9189aedac7d43","sha256":"07632bee16334ab68a80b3433db7b32daa145053b68156b68244b9145ebeaa7e","bytes":37970},"framesRef":{"commit":"90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/producer-frames.jsonl","gitBlobSha1":"439b8fc9187f3907a63a16af5841251952024533","sha256":"c822e4bac3fb2ba1a21657f89f838d35bedbe08820d418021ec75c72c666d628","bytes":197175},"artifacts":[{"commit":"90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-desktop-tile-01.png","gitBlobSha1":"9d96646282e97104a032c81c03451bda8794eb1b","sha256":"600ad7c79c86889cc1f1bba376c929d67fc942aa495a08dcb77c2a48f612aa1f","bytes":28776},{"commit":"90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-mobile-tile-01.png","gitBlobSha1":"a977c9c35a5b2a5bb4fd90c23ffbc16d30e9d908","sha256":"d83399fdf70d554a7505310b038b490ca55730d962f040e83bbf2606e614ccab","bytes":30805}],"code":[{"path":"tests/fixtures/archive-m3-e052-q5-problem-ui.json","gitBlobSha1":"6a130b5af0bde204ede90211ae779b92ff74022f","sha256":"1ad5d743e74665f42ba8abc3213a81e7c768eb771a8575314c6e9404e851b9cb","bytes":1807},{"path":"tools/check-m3-e052-q5-problem-browser.cjs","gitBlobSha1":"c59ca5c001e007e7fa123089f306a54bba8ee796","sha256":"43067702c2eb2ca062aa73c0551a5fb5d3ad9a35bcf409452778b41c01f0e6a7","bytes":59715},{"path":"tools/check-reviewed-problem-renderer-browser.cjs","gitBlobSha1":"56c80b40d53fa88e8054a16f7b7267f968696f3f","sha256":"e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673","bytes":56735},{"path":"archive/equal-slot-engine.js","gitBlobSha1":"c826512ff61d4969c7ce45ba8f4ee002286bcf10","sha256":"4979ccfd129470e076965bf93bb86e089d53c4ea875a17b011760886f967177a","bytes":20518},{"path":"archive/exam-render-executor.js","gitBlobSha1":"583a72ae2c960d485cdcd1c1aec1329f204067b6","sha256":"e4ac35518351fd89d16222df4221e64a32121213f5b99c831407a61d90b573d7","bytes":24896},{"path":"archive/engine.html","gitBlobSha1":"226342544e896cd6a6f35aa946947b89ef3c893e","sha256":"671f89999fe07b0f5695bb088ef9d262d7d2da95947689117241bb6f3b633ce5","bytes":196085},{"path":"archive/screen-runtime-adapter.js","gitBlobSha1":"fb0ee7afc7eed48b30975874c5536eb283f308c9","sha256":"ed0b267dc3b27675c2c0ed0aa985991a0aad3d3863ce5bcd43f0acb28033d709","bytes":53393}],"transportManifest":{"schemaVersion":"archive-protected9-original-ui-log-transport-v1","profile":"q5","execution":{"provider":"GITHUB_ACTIONS","repository":"icefoxtail/AP------","eventName":"push","ref":"refs/heads/ops/middle-protected9-current-renderer-26fc-20261117","pullRequest":null,"baseSha":null,"checkoutCommit":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","eventCommit":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","runId":"44015662986","runAttempt":1,"workflow":"Middle Protected Current Renderer","job":"current-ui"},"captureStatus":"TECHNICAL_PASS_VISUAL_REVIEW_PENDING","logicalCases":2,"expectedLogicalCases":2,"pngFiles":2,"uncompletedCasePngFiles":0,"totalBytes":136305,"technicalJsonSha256":"9248d818ec7c44d3f8f4273526c4af1d70624385d185b63db3270e1324b2c279","files":[{"path":"technical-proof.json","mimeType":"application/json","bytes":76724,"sha256":"9248d818ec7c44d3f8f4273526c4af1d70624385d185b63db3270e1324b2c279","gitBlobSha1":"0cd74ab0be77a70badcabc655b811bb02cbb9209","captureCaseCompleted":null},{"path":"E052-Q5-desktop-tile-01.png","sha256":"600ad7c79c86889cc1f1bba376c929d67fc942aa495a08dcb77c2a48f612aa1f","bytes":28776,"mimeType":"image/png","gitBlobSha1":"9d96646282e97104a032c81c03451bda8794eb1b","dimensions":{"width":316,"height":287},"captureCaseCompleted":true},{"path":"E052-Q5-mobile-tile-01.png","sha256":"d83399fdf70d554a7505310b038b490ca55730d962f040e83bbf2606e614ccab","bytes":30805,"mimeType":"image/png","gitBlobSha1":"a977c9c35a5b2a5bb4fd90c23ffbc16d30e9d908","dimensions":{"width":350,"height":299},"captureCaseCompleted":true}],"visualReview":"NOT_PERFORMED_BY_TRANSPORT","newApprovals":0,"sourceWrites":0,"transportDigest":"9e6be5e5b318adedc4cd9e83c4e3af6a26b12f5eb255cf6c0129a04c14b5fdcf","transportRef":{"commit":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","path":"tools/emit-protected9-ui-log-transport.cjs","gitBlobSha1":"66e822cd012fc8744afc8af3124d39ff9319b20c","sha256":"606a2008bb34a2cd363b16099a32eb0288781592d99ee1ede41cd8977360850b","bytes":24695},"producerRefs":[{"commit":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","path":"tools/check-m3-e052-q5-problem-browser.cjs","gitBlobSha1":"c59ca5c001e007e7fa123089f306a54bba8ee796","sha256":"43067702c2eb2ca062aa73c0551a5fb5d3ad9a35bcf409452778b41c01f0e6a7","bytes":59715},{"commit":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","path":"tests/fixtures/archive-m3-e052-q5-problem-ui.json","gitBlobSha1":"6a130b5af0bde204ede90211ae779b92ff74022f","sha256":"1ad5d743e74665f42ba8abc3213a81e7c768eb771a8575314c6e9404e851b9cb","bytes":1807},{"commit":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","path":"tools/check-reviewed-problem-renderer-browser.cjs","gitBlobSha1":"56c80b40d53fa88e8054a16f7b7267f968696f3f","sha256":"e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673","bytes":56735}]},"oldCaptureHead":"c29e1cc63c1d55b9c049c254908e466dad23a086","omittedFontResourceId":"cf3f7bcae01e00f44158a8856b11c7c8a30174647e6181b4dc402c6121b6a20c"});
function freezeQ5CurrentUi(value) { for (const x of Object.values(value)) if (x && typeof x === 'object') freezeQ5CurrentUi(x); return Object.freeze(value); }
const stripUiCommit = ({commit, ...r}) => r;
export function currentM3Q5UiRefs() { return structuredClone(CURRENT_Q5_UI); }
export function assertM3Q5CurrentUiDocuments({ prior, visual, technical, currentVisual, witness, transport }) {
  const c = CURRENT_Q5_UI;
  ensure(technical.checkoutCommit === c.head && same(technical.checkout, {
    expectedCheckoutCommit: c.head, actualCheckoutCommit: c.head, githubEventCommit: c.head
  }), 'CURRENT_UI_CHECKOUT');
  ensure(same(transport, c.transportManifest), 'CURRENT_UI_TRANSPORT');
  ensure(witness.decision === 'ACCEPT_EXACT_CURRENT_FOUR_PNG_DISPLAY_BY_PRIOR_OBSERVATION_REUSE_ONLY' &&
    witness.actualCapture?.head === c.head && witness.actualCapture?.publicationCommit === c.technicalRef.commit &&
    same(witness.priorEvidence?.q5?.technical, c.priorTechnicalRef) &&
    same(witness.priorEvidence?.q5?.visual, c.priorVisualRef), 'CURRENT_UI_INDEPENDENT_REUSE');
  ensure(currentVisual.schemaVersion === 'archive-independent-m3-e052-q5-current-ui-reuse-v1' &&
    currentVisual.scope === 'EXACT_E052_Q5_COMPLETE_GIVEN_CURRENT_DISPLAY_ONLY' &&
    currentVisual.decision === visual.decision && currentVisual.reviewer === visual.reviewer &&
    currentVisual.derivationAuthor === 'GPT_M3S2_RELEASE' &&
    currentVisual.decisionOrigin === 'IMMUTABLE_PRIOR_SEPARATE_VISUAL_INSPECTION_REUSED_FOR_IDENTICAL_CURRENT_PNG_BYTES' &&
    same(currentVisual.technicalRef, c.technicalRef) && same(currentVisual.priorTechnicalRef, c.priorTechnicalRef) &&
    same(currentVisual.priorVisualRef, c.priorVisualRef) && same(currentVisual.displayEquivalenceRef, c.witnessRef) &&
    same(currentVisual.currentProducerFramesRef, c.framesRef) && same(currentVisual.records, visual.records) &&
    same(currentVisual.artifactRefs, c.artifacts) && currentVisual.oldVisualRecordsCopiedExactly === true &&
    currentVisual.currentRawTechnicalUnchanged === true && currentVisual.originalPngBytesUnmodified === true &&
    ['newVisualInspection','newMathematicalQa','newSemanticApproval','newNativeApproval','newMetadataApproval','newDifficultyApproval','newFourSlotVector']
      .every(k => currentVisual[k] === 0) &&
    currentVisual.sharedRendererCodeEquivalenceClaimed === false && currentVisual.currentFullLiveCodeFontAssetGuardsRequired === true &&
    currentVisual.officialCurrentNativeBuilderConsumer === 'NOT_RUN_CURRENT_UI_BINDING', 'CURRENT_UI_VISUAL_REUSE');
  ensure(prior.schemaVersion === technical.schemaVersion && prior.status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING' &&
    prior.checkoutCommit === c.oldCaptureHead && Array.isArray(prior.results) && prior.results.length === 2 &&
    Array.isArray(technical.results) && technical.results.length === 2 &&
    same(prior.screenshotArtifacts, technical.screenshotArtifacts), 'CURRENT_UI_CAPTURE_INVENTORY');
  const stripItem = x => ({...x, sourceRef: stripUiCommit(x.sourceRef), assetRef: stripUiCommit(x.assetRef)});
  ensure(same(prior.items.map(stripItem), technical.items.map(stripItem)) &&
    same(prior.mirroredAssets.map(stripUiCommit), technical.mirroredAssets.map(stripUiCommit)), 'CURRENT_UI_APPROVED_INPUTS');
  const beforeFonts = new Map(prior.studentFontResources.map(f => [f.resourceId, f]));
  const afterFonts = new Map(technical.studentFontResources.map(f => [f.resourceId, f]));
  ensure(beforeFonts.size === 31 && afterFonts.size === 30 && beforeFonts.size === prior.studentFontResources.length &&
    afterFonts.size === technical.studentFontResources.length &&
    same([...beforeFonts.keys()].filter(id => !afterFonts.has(id)), [c.omittedFontResourceId]) &&
    [...afterFonts].every(([id, f]) => beforeFonts.has(id) && same(stripUiCommit(f), stripUiCommit(beforeFonts.get(id)))), 'CURRENT_UI_FONT_REUSE');
  for (let i = 0; i < 2; i++) {
    const a = prior.results[i], b = technical.results[i], before = {...a.capture}, after = {...b.capture};
    delete before.equalSlotEvidence; delete after.equalSlotEvidence;
    ensure(a.questionUid === M3_Q5_UID && b.questionUid === M3_Q5_UID && a.sourceOrdinal === 5 && b.sourceOrdinal === 5 &&
      same(a.viewport, b.viewport) && same(stripUiCommit(a.sourceRef), stripUiCommit(b.sourceRef)) &&
      same(stripUiCommit(a.assetRef), stripUiCommit(b.assetRef)) && same(before, after) &&
      ['screenshots','geometry','pageErrors','requestFailures','externalRequests'].every(k => same(a[k], b[k])), 'CURRENT_UI_CAPTURE_CHANGED');
    ensure(Array.isArray(a.capture.equalSlotEvidence) && a.capture.equalSlotEvidence.length === 7 &&
      Array.isArray(b.capture.equalSlotEvidence) && b.capture.equalSlotEvidence.length === 7, 'CURRENT_UI_CAPTURE_PROVENANCE');
    for (let j = 0; j < 7; j++) {
      const x = a.capture.equalSlotEvidence[j], y = b.capture.equalSlotEvidence[j];
      ensure(x.commit === c.oldCaptureHead && y.commit === c.head &&
        (j === 3 ? same(noCommit(x), UI_CODE[1]) && same(noCommit(y), c.code[1]) : same(noCommit(x), noCommit(y))),
        'CURRENT_UI_CAPTURE_PROVENANCE');
    }
    const at = {...a.technical}, bt = {...b.technical}; delete at.fontResourceIds; delete bt.fontResourceIds;
    ensure(same(at, bt) && Array.isArray(b.technical.fontResourceIds) &&
      new Set(b.technical.fontResourceIds).size === b.technical.fontResourceIds.length &&
      b.technical.fontResourceIds.every(id => a.technical.fontResourceIds.includes(id) && afterFonts.has(id)), 'CURRENT_UI_CASE_FONT_REUSE');
    const binding = currentVisual.captureBindings?.[i];
    ensure(binding?.questionUid === M3_Q5_UID && binding.sourceOrdinal === 5 && binding.viewport === b.viewport.name &&
      binding.priorCaptureSha256 === sha(stable(a.capture)) && binding.currentCaptureSha256 === sha(stable(b.capture)) &&
      binding.originalScreenshotsExactlyReused === true && binding.wholeCaptureExactlyReused === false, 'CURRENT_UI_CAPTURE_BINDING');
  }
  const delta = currentVisual.captureProvenanceDelta;
  ensure(delta?.entireCaptureEqual === false && delta.exceptEqualSlotEvidenceWholeEqual === true &&
    same(delta.exactlySevenImmutableRefCommits, {before: c.oldCaptureHead, after: c.head}) &&
    same(delta.producerOnlyPinChange, {path: UI_CODE[1].path, beforeGitBlobSha1: UI_CODE[1].gitBlobSha1, afterGitBlobSha1: c.code[1].gitBlobSha1}) &&
    delta.measurementAndCoverageFieldsChanged === 0, 'CURRENT_UI_CAPTURE_PROVENANCE');
  return true;
}
function currentM3Q5Ui(ctx, prior, visual) {
  const c = CURRENT_Q5_UI;
  // The current binding is used when its files are present; the current engine bytes
  // are not compared with a fixed edition.
  const requested = [c.technicalRef, c.visualRef].some(ref => fs.existsSync(safe(ctx.root, ref.path)));
  if (!requested) return null;
  ensure(same(ctx.spec.technicalRef, c.priorTechnicalRef) && same(ctx.spec.visualRef, c.priorVisualRef), 'CURRENT_UI_ORIGINAL_AUTHORITY_REF');
  // Original publication refs are fixed above and already authenticated by
  // evidence()/reference() against their immutable trees and current live bytes.
  // Their publication commits need not be ancestors of this checkout. Current
  // UI evidence still requires ancestry from the actual checkout.
  for (const ref of [c.technicalRef, c.visualRef, c.witnessRef, c.framesRef, ...c.artifacts])
    git(ctx, ['merge-base', '--is-ancestor', ref.commit, 'HEAD']);
  for (const ref of [c.technicalRef, c.visualRef, c.witnessRef, c.framesRef, ...c.artifacts])
    ensure(git(ctx, ['rev-parse', 'HEAD:' + ref.path]).toString().trim() === ref.gitBlobSha1, 'CURRENT_UI_HEAD_EVIDENCE_DRIFT');
  const technical = jsonReference(ctx, c.technicalRef, {live: true});
  const currentVisual = jsonReference(ctx, c.visualRef, {live: true});
  const witness = jsonReference(ctx, c.witnessRef, {live: true});
  const frames = reference(ctx, c.framesRef, {live: true, data: true}).toString('utf8').trim().split('\n');
  let start, end;
  try { start = JSON.parse(frames[0]); end = JSON.parse(frames[frames.length - 1]); }
  catch { fail('CURRENT_UI_TRANSPORT_JSON'); }
  ensure(start.kind === 'bundle-begin' && end.kind === 'bundle-end' && start.bundle === end.bundle &&
    start.manifest?.technicalJsonSha256 === c.technicalRef.sha256, 'CURRENT_UI_TRANSPORT_BOUNDARY');
  assertM3Q5CurrentUiDocuments({prior, visual, technical, currentVisual, witness, transport: start.manifest});
  for (const ref of c.artifacts) {
    const bytes = reference(ctx, ref, {live: true, data: true});
    ensure(bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a','hex')), 'CURRENT_UI_PNG_BYTES');
  }
  return {technical, technicalRef: c.technicalRef, visualRef: c.visualRef, witnessRef: c.witnessRef};
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
