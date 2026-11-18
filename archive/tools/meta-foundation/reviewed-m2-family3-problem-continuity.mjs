import { readE015IssuedSourceContinuation } from './native-e015-source-cc-continuity.mjs';
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { validateM2ProblemRendererUiTileEvidence } from "./reviewed-m2-problem-renderer-continuity.mjs";
import { verifySvgIndexFootprint } from "./svg-index-continuity.mjs";


// Exact problem-display comparison for the three frozen family follow-ups.
// Metadata and parent authority remain with the ordinary Native/retained validators.
export const M2_FAMILY3_PROBLEM_CONTINUITY_SCHEMA = "archive-m2-family3-problem-continuity-v1";
export const M2_FAMILY3_PROBLEM_BINDING_SCHEMA = "archive-m2-family3-problem-continuity-binding-v1";
export const M2_FAMILY3_PROBLEM_SCOPE = "EXACT_M2_E017_Q6_E015_Q7_Q8_PROBLEM_DISPLAY";
const NATIVE_COMMIT = "c28641f67d91bfb27352b11faaef4552f46c45be";
const NATIVE_BASE = "ed83f05220b64f75cbbd5de360a68dd6ddaadd22";
const STATIC_BEFORE = "695f36bf272de5c42323a1329732efccfa542263";
const STATIC_CURRENT = "ea844f0eb45e98c2696810a3f31c90b471c97edc";
const STATIC_RAW = "cad480e6f19e0878254a4a3169c043702013a121cabcacab09c8c25bc26d8683";
const OBSERVATION_RAW = "68ac3383bb9e202dca0d4a2a40efbf136a07a679211f81a76f8c2db3879478c3";
const UI_COMMIT = "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7";
const E015 = "original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js";
const OWNED_FIELDS = Object.freeze(["image", "imageAlt", "imageSize", "layoutTag"]);
const PROBLEM_FIELDS = Object.freeze(["id", "number", "sourceQuestionNo", "sourceQid", "sourceOrdinal", "questionUid", "questionType",
  "content", "question", "choices", "image", "images", "figureSvg", "layoutTag", "wide", "imageAlt", "imageCaption", "imageSize", "score"]);
const EVIDENCE = Object.freeze({
  "staticRef": {
    "path": "docs/operations/m2-family3-problem-continuity-20261116/static-v1.json",
    "sha256": "8da49d4870091b0f2169e38e534329d84fecc578045a93702af59589b0c8d18b",
    "gitBlobSha1": "f1ceefa4b7acd705874d1b7e57d8fde1f4c88186",
    "bytes": 20125
  },
  "studentUiObservedRef": {
    "path": "docs/operations/m2-family3-problem-continuity-20261116/student-ui-observed-v1.json",
    "sha256": "fcb6e1b8fdf1d04cfaeefa6c08177a28e5daff6b7e137d34269cfc7198fccb8d",
    "gitBlobSha1": "f087afbfc4f4ada24aeaf3fcbdaf5fa48f2a42c8",
    "bytes": 9339
  },
  "studentUiTechnicalRef": {
    "path": "docs/operations/m2-problem21-continuity-20261116/student-ui-technical-v1.json",
    "sha256": "90265ccadf9b400e99396667f5e44ec39da5a43138eaa04626e605d9b840d264",
    "gitBlobSha1": "8e30cbebdf2518a9e307383d04d50e5a4b337e9d",
    "bytes": 501326
  }
});
export const M2_FAMILY3_PROBLEM_ITEMS = Object.freeze([
  {
    "key": "E015-Q07",
    "questionUid": "qid_v1_3c72535bb4d43798192918e723d32bd646b2415bde8c5e8ad872b445496b7bfd",
    "sourceOrdinal": 7,
    "sourceArchiveFile": "original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 24
  },
  {
    "key": "E015-Q08",
    "questionUid": "qid_v1_76b2be613350f59166e128170c6f38b6150078c9ed44e727733d5de0bbf76942",
    "sourceOrdinal": 8,
    "sourceArchiveFile": "original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 24
  },
  {
    "key": "E017-Q06",
    "questionUid": "qid_v1_9a0686ad7215cc2afff66c158131fd343a64bd2111f30341df6b8383aaba1b7c",
    "sourceOrdinal": 6,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23
  }
].map(Object.freeze));
const fail = code => { throw new Error(`M2_FAMILY3_PROBLEM:${code}`); };
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const blob = value => crypto.createHash("sha1").update(`blob ${value.length}\0`).update(value).digest("hex");
const keys = (value, expected) => value && typeof value === "object" && !Array.isArray(value) && same(Object.keys(value).sort(), [...expected].sort());
const projection = question => Object.fromEntries(PROBLEM_FIELDS.filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]]));
const presence = (question, field) => Object.hasOwn(question, field) ? { present: true, sha256: sha(stable(question[field])) } : { present: false };
const delta = (before, after) => PROBLEM_FIELDS.slice().sort().filter(field => !same(presence(before, field), presence(after, field)))
  .map(field => ({ field, before: presence(before, field), after: presence(after, field) }));
const refOnly = value => Object.fromEntries(["commit", "path", "gitBlobSha1", "sha256", "bytes"].map(key => [key, value[key]]));
function safe(root, relative) {
  if (typeof relative !== "string" || path.isAbsolute(relative) || /[\\\x00-\x1f\x7f]/.test(relative) ||
      relative.split("/").some(part => !part || part === "." || part === "..")) fail("UNSAFE_PATH");
  const full = path.resolve(root, relative);
  for (let cursor = full; cursor !== path.resolve(root); cursor = path.dirname(cursor))
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) fail("SYMLINK_PATH");
  return full;
}
function git(ctx, args, maxBuffer = 8 * 1024 * 1024) {
  try { return execFileSync("git", args, { cwd: ctx.root, maxBuffer, stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" } }); }
  catch { fail("IMMUTABLE_GIT_INPUT_UNAVAILABLE"); }
}
function regularGitBlob(ctx, commit, relative) {
  safe(ctx.root, relative);
  const entries = git(ctx, ["ls-tree", "-z", commit, "--", relative]).toString("utf8").split("\0");
  if (entries.length !== 2 || entries[1] !== "") fail("IMMUTABLE_BLOB_MODE");
  const tab = entries[0].indexOf("\t"), header = entries[0].slice(0, tab), name = entries[0].slice(tab + 1);
  const match = /^100644 blob ([a-f0-9]{40})$/.exec(header);
  if (!match || name !== relative) fail("IMMUTABLE_BLOB_MODE");
  return match[1];
}
// Stream the two historical data snapshots rather than retaining 100 MB of
// metadata in each renderer call. The child emits digests only, never contents.
const STREAM_GIT_DIGEST = `const {spawn}=require('node:child_process'),c=require('node:crypto');
const p=spawn('git',['cat-file','blob',process.argv[1]],{stdio:['ignore','pipe','pipe']});
const h=c.createHash('sha256');let n=0;p.stdout.on('data',b=>{n+=b.length;h.update(b)});
p.stderr.resume();p.on('error',()=>process.exit(2));p.on('close',x=>{if(x!==0)process.exit(2);process.stdout.write(JSON.stringify({bytes:n,sha256:h.digest('hex')}))});`;
function immutable(ctx, ref, read = false) {
  if (!keys(ref, ["commit", "path", "gitBlobSha1", "sha256", "bytes"]) || !SHA1.test(ref.commit || "") ||
      !SHA1.test(ref.gitBlobSha1 || "") || !SHA256.test(ref.sha256 || "") || !Number.isSafeInteger(ref.bytes) || ref.bytes < 1) fail("EXACT_FIVE_KEY_REF_REQUIRED");
  safe(ctx.root, ref.path);
  const cacheKey = stable(["m2-family3-problem-immutable", ctx.root, ref]);
  if (!ctx.cache.has(cacheKey)) {
    if (git(ctx, ["rev-parse", "--verify", `${ref.commit}^{commit}`]).toString().trim() !== ref.commit ||
        regularGitBlob(ctx, ref.commit, ref.path) !== ref.gitBlobSha1 ||
        Number(git(ctx, ["cat-file", "-s", ref.gitBlobSha1]).toString().trim()) !== ref.bytes) fail("IMMUTABLE_REF_BINDING");
    let digest;
    if (ref.bytes > 8 * 1024 * 1024) {
      try { digest = JSON.parse(execFileSync(process.execPath, ["-e", STREAM_GIT_DIGEST, ref.gitBlobSha1], {
        cwd: ctx.root, maxBuffer: 4096, stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" } })); }
      catch { fail("IMMUTABLE_GIT_INPUT_UNAVAILABLE"); }
    } else { const bytes = git(ctx, ["cat-file", "blob", ref.gitBlobSha1]); digest = { bytes: bytes.length, sha256: sha(bytes) }; }
    if (digest.bytes !== ref.bytes || digest.sha256 !== ref.sha256) fail("IMMUTABLE_RAW_DIGEST");
    ctx.cache.set(cacheKey, true);
  }
  if (!read) return ref;
  if (ref.bytes > 8 * 1024 * 1024) fail("LARGE_CONTENT_READ_OUTSIDE_PROFILE");
  const bytes = git(ctx, ["cat-file", "blob", ref.gitBlobSha1]);
  if (bytes.length !== ref.bytes || sha(bytes) !== ref.sha256 || blob(bytes) !== ref.gitBlobSha1) fail("IMMUTABLE_RAW_DIGEST");
  return bytes;
}
// Render engine files may change after the capture; only their captured Git bytes are authenticated (user decision 2026-11-18).
const isRenderEngineFile = p => p === "archive/engine.html" || p === "archive/mixed_engine.html" || p === "apmath/wrong_print_engine.html" ||
  /^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) ||
  /^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(p);
function live(ctx, ref, code = "LIVE_REF_DRIFT") {
  let fd;
  try {
    fd = fs.openSync(safe(ctx.root, ref.path), "r");
    if (!fs.fstatSync(fd).isFile()) fail(code);
    const digest = crypto.createHash("sha256"), buffer = Buffer.alloc(65536); let count = 0, n;
    while ((n = fs.readSync(fd, buffer, 0, buffer.length, null))) { count += n; digest.update(buffer.subarray(0, n)); }
    if (count !== ref.bytes || digest.digest("hex") !== ref.sha256) fail(code);
  } catch (error) { if (String(error.message).startsWith("M2_FAMILY3_PROBLEM:")) throw error; fail(code); }
  finally { if (fd !== undefined) fs.closeSync(fd); }
}
function bindEvidence(ctx, ref) {
  const narrow = { path: ref.path, sha256: ref.sha256 };
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (!Array.isArray(refs) || refs.filter(value => same(value, narrow)).length !== 1) fail("BOTH_EVIDENCE_LISTS_REQUIRED");
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail("INVALID_EVIDENCE_JSON"); } }
function source(ctx, ref, count) {
  const bytes = immutable(ctx, ref, true), bank = ctx.bankFromBytes(bytes);
  if (!Array.isArray(bank) || bank.length !== count) fail("SOURCE_DENOMINATOR");
  return { bytes, bank, ref };
}
function assetPaths(ctx, problem) {
  const paths = new Set();
  const add = value => {
    if (typeof value !== "string" || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail("PROBLEM_ASSET_PATH");
    const relative = value.startsWith("archive/") ? value : `archive/${value}`; safe(ctx.root, relative); paths.add(relative);
  };
  const explicit = value => { if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) value.forEach(explicit); else add(value); };
  explicit(problem.image); explicit(problem.images);
  if (problem.figureSvg) fail("INLINE_PROBLEM_FIGURE_OUTSIDE_PROFILE");
  const html = value => {
    if (Array.isArray(value)) return value.forEach(html);
    if (value && typeof value === "object") return Object.values(value).forEach(html);
    if (typeof value !== "string") return;
    if (/<(?:svg|object|iframe|image)\b|srcset\s*=|url\s*\(/i.test(value) ||
        /style\s*=/i.test(value))
      fail("UNDECLARED_PROBLEM_DEPENDENCY");
    for (const match of value.matchAll(/<img\b[^>]*>/gi)) {
      const src = match[0].match(/\bsrc\s*=\s*(["'])([^"']+)\1/i); if (!src) fail("PROBLEM_IMAGE_SRC"); add(src[2]);
    }
  };
  html(problem); return [...paths].sort();
}
function assets(ctx, problem, refs) {
  if (!Array.isArray(refs) || !same(refs.map(ref => ref.path).sort(), assetPaths(ctx, problem)) ||
      new Set(refs.map(ref => ref.path)).size !== refs.length) fail("COMPLETE_PROBLEM_ASSETS_REQUIRED");
  for (const ref of refs) { immutable(ctx, ref); live(ctx, ref, "LIVE_PROBLEM_ASSET_DRIFT"); }
}

function evidence(ctx) {
  const ref = ctx.spec.reviewRef;
  if (!keys(ref, ["path", "sha256"]) || !SHA256.test(ref.sha256 || "")) fail("EXACT_WRAPPER_REF");
  safe(ctx.root, ref.path); bindEvidence(ctx, ref);
  if (git(ctx, ["rev-parse", "--verify", ctx.spec.reviewCommit + "^{commit}"]).toString().trim() !== ctx.spec.reviewCommit) fail("WRAPPER_BINDING");
  const raw = git(ctx, ["cat-file", "blob", regularGitBlob(ctx, ctx.spec.reviewCommit, ref.path)]);
  if (sha(raw) !== ref.sha256) fail("WRAPPER_BINDING");
  live(ctx, { ...ref, bytes: raw.length }, "LIVE_WRAPPER_DRIFT");
  const wrapper = parse(raw);
  if (!keys(wrapper, ["schemaVersion", "scope", "sourceArchiveFile", "selectedQuestionUids", ...Object.keys(EVIDENCE),
      "inventoryQuestions", "normalizationQuestions", "newMathematicalQa", "newMetadataApprovals", "newDifficultyJudgments",
      "newReview2Claims", "sourceWrites", "rendererWrites"]) ||
      wrapper.schemaVersion !== M2_FAMILY3_PROBLEM_BINDING_SCHEMA || wrapper.scope !== M2_FAMILY3_PROBLEM_SCOPE ||
      wrapper.sourceArchiveFile !== ctx.request.sourceArchiveFile ||
      !same(wrapper.selectedQuestionUids, M2_FAMILY3_PROBLEM_ITEMS.filter(item => item.sourceArchiveFile === ctx.request.sourceArchiveFile).map(item => item.questionUid)) ||
      wrapper.inventoryQuestions !== 3 || wrapper.normalizationQuestions !== 3 || wrapper.newMathematicalQa !== false ||
      ["newMetadataApprovals", "newDifficultyJudgments", "newReview2Claims", "sourceWrites", "rendererWrites"].some(key => wrapper[key] !== 0)) fail("EXACT_WRAPPER_SCOPE");
  const documents = {};
  for (const [name, expected] of Object.entries(EVIDENCE)) {
    const current = wrapper[name];
    if (!current || !same(Object.fromEntries(Object.keys(expected).map(key => [key, current[key]])), expected)) fail("FROZEN_CAPSULE_CHANGED");
    bindEvidence(ctx, current); const bytes = immutable(ctx, current, true); live(ctx, current, "LIVE_CAPSULE_DRIFT"); documents[name] = parse(bytes);
  }
  return { wrapper, documents };
}
function validateStatic(ctx, document) {
  if (document.schemaVersion !== "archive-m2-family3-frozen-static-transport-v1" || document.scope !== M2_FAMILY3_PROBLEM_SCOPE ||
      document.inventoryQuestions !== 3 || document.normalizationQuestions !== 3 || document.rows?.length !== 3 ||
      document.sourceReviewer !== "m3s2_release" || document.producerOfCurrentSvg !== false ||
      document.originalObservationRef?.sha256 !== STATIC_RAW || document.newMathematicalQa !== false || document.newMetadataApprovals !== 0) fail("FROZEN_STATIC_SCOPE");
  for (const item of M2_FAMILY3_PROBLEM_ITEMS)
    if (document.rows.filter(row => Object.entries(item).every(([key, value]) => row[key] === value)).length !== 1) fail("STATIC_IDENTITY_INVENTORY");
  const witness = document.rows.find(row => row.questionUid === ctx.patch.questionUid);
  const original = source(ctx, witness.nativeSourceRef, witness.expectedQuestionCount);
  const committed = source(ctx, witness.nativeCommittedSourceRef, witness.expectedQuestionCount);
  const current = source(ctx, witness.currentSourceRef, witness.expectedQuestionCount);
  const n = ctx.patch.sourceOrdinal - 1, oldProblem = projection(original.bank[n]), currentProblem = projection(current.bank[n]);
  if (witness.nativeSourceRef.commit !== NATIVE_BASE || witness.nativeCommittedSourceRef.commit !== NATIVE_COMMIT ||
      witness.currentSourceRef.commit !== UI_COMMIT || witness.nativeSourceRef.path !== "archive/exams/" + ctx.request.sourceArchiveFile ||
      witness.nativeCommittedSourceRef.path !== witness.nativeSourceRef.path || witness.currentSourceRef.path !== witness.nativeSourceRef.path ||
      sha(stable(original.bank[n])) !== witness.nativeReviewedQuestionSha256 ||
      sha(stable(committed.bank[n])) !== witness.nativeCommittedQuestionSha256 ||
      sha(stable(current.bank[n])) !== witness.reviewedCurrentQuestionSha256 ||
      sha(stable(oldProblem)) !== witness.nativeProblemSha256 || sha(stable(currentProblem)) !== witness.currentProblemSha256 ||
      !same(projection(committed.bank[n]), oldProblem) || !same(delta(oldProblem, currentProblem), witness.problemFieldDelta) ||
      !same(witness.problemFieldDelta.map(row => row.field), OWNED_FIELDS) ||
      !same(witness.normalizedProblemFields, OWNED_FIELDS)) fail("STATIC_PROBLEM_BINDING");
  const nativeReview = parse(immutable(ctx, witness.nativeReviewRef, true)), native = ctx.native;
  if (witness.nativeReviewRef.commit !== NATIVE_COMMIT || native.spec.reviewCommit !== NATIVE_COMMIT ||
      native.review.baseSha !== NATIVE_BASE || native.spec.reviewPath !== witness.nativeReviewRef.path ||
      native.spec.reviewRef.sha256 !== witness.nativeReviewRef.sha256 || !same(native.review, nativeReview) ||
      sha(stable(ctx.row)) !== witness.nativeItemSha256 ||
      sha(stable(nativeReview.items.find(row => row.questionUid === ctx.patch.questionUid))) !== witness.nativeItemSha256 ||
      native.sourceBlob !== witness.nativeSourceRef.gitBlobSha1 || native.committedBlob !== witness.nativeCommittedSourceRef.gitBlobSha1 ||
      sha(stable(native.reviewedBank[n])) !== witness.nativeReviewedQuestionSha256 ||
      sha(stable(native.committedBank[n])) !== witness.nativeCommittedQuestionSha256) fail("ORIGINAL_NATIVE_AUTHORITY_CHANGED");
  assets(ctx, oldProblem, witness.nativeProblemAssets); assets(ctx, currentProblem, witness.currentProblemAssets);
  const basis = witness.basis;
  if (basis.kind !== "EXACT_ORIGINAL_STATIC_ACCEPTANCE" || basis.originalObservationRef?.sha256 !== STATIC_RAW ||
      basis.staticBeforeSourceRef?.commit !== STATIC_BEFORE || basis.staticSourceRef?.commit !== STATIC_CURRENT ||
      basis.staticBeforeSourceRef.path !== witness.nativeSourceRef.path || basis.staticSourceRef.path !== witness.nativeSourceRef.path ||
      basis.staticDecision !== "NARROW_STATIC_DISPLAY_CONTINUITY_ACCEPTABLE") fail("ORIGINAL_STATIC_AUTHORITY");
  const reviewedBefore = source(ctx, basis.staticBeforeSourceRef, witness.expectedQuestionCount);
  const reviewedCurrent = source(ctx, basis.staticSourceRef, witness.expectedQuestionCount);
  if (sha(stable(reviewedBefore.bank[n])) !== basis.staticBeforeQuestionSha256 ||
      sha(stable(reviewedCurrent.bank[n])) !== basis.staticCurrentQuestionSha256 ||
      !same(projection(reviewedBefore.bank[n]), oldProblem) || !same(projection(reviewedCurrent.bank[n]), currentProblem)) fail("ORIGINAL_STATIC_PROJECTION");
  for (const ref of witness.nativeProblemAssets) immutable(ctx, { ...ref, commit: STATIC_BEFORE });
  for (const ref of witness.currentProblemAssets) immutable(ctx, { ...ref, commit: STATIC_CURRENT });
  return { witness, original, committed, current, oldProblem, currentProblem, ownedFields: [...OWNED_FIELDS] };
}
const SVG_INDEX_PATH = "archive/data/svg-accessibility-index.js";
function validateUi(ctx, bound, current) {
  const { studentUiTechnicalRef: technical, studentUiObservedRef: visual } = bound.documents;
  if (technical.schemaVersion !== "archive-m2-problem24-student-ui-preview-v1" || technical.checkoutCommit !== UI_COMMIT ||
      technical.status !== "TECHNICAL_PASS_VISUAL_REVIEW_PENDING" || technical.executionOwner !== "GITHUB_ACTIONS_SUPPORTED_CHROME" ||
      technical.mode !== "exam" || technical.problemOnlyScreenshots !== true || technical.solutionsOpened !== false ||
      technical.sourceOverlay !== false || technical.sourceOverlayCount !== 0 || technical.sourceWrites !== 0 ||
      technical.fontTransport !== "EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS" ||
      technical.newFullMathematicalQa !== false || technical.newMetadataApprovals !== 0 || technical.newReviewPassCount !== 0 ||
      technical.expectedLogicalCases !== 48 || technical.completedLogicalCases !== 48 || technical.results?.length !== 48 ||
      technical.items?.length !== 24 || technical.screenshotArtifactCount !== 51 || technical.screenshotArtifacts?.length !== 51 ||
      technical.failures?.length !== 0 || technical.externalFontResources?.length !== 0) fail("ACTUAL_UI_48_51_REQUIRED");
  if (visual.schemaVersion !== "archive-m2-family3-student-ui-observation-transport-v1" || visual.scope !== M2_FAMILY3_PROBLEM_SCOPE ||
      visual.checkoutCommit !== UI_COMMIT || visual.observer !== "m2s1_release" || visual.roleDisclosure.engineCodeAuthor !== true ||
      visual.roleDisclosure.independentMathQa !== false || visual.decision !== "DISPLAY_CONTINUITY_ACCEPTABLE" ||
      visual.inventoryQuestions !== 3 || visual.normalizationQuestions !== 3 || visual.logicalCases !== 6 || visual.originalPngs !== 6 ||
      visual.cases?.length !== 6 || visual.technicalProofRef.sha256 !== bound.wrapper.studentUiTechnicalRef.sha256 ||
      visual.originalObservationRef?.sha256 !== OBSERVATION_RAW || visual.originalStaticObservationRef?.sha256 !== STATIC_RAW || visual.newMathematicalQa !== false || visual.newMetadataApprovals !== 0) fail("ACTUAL_OBSERVATION_ROLE_OR_SCOPE");
  for (const ref of [technical.manifestRef, technical.checkerRef, technical.captureHelperRef, technical.identityRef, technical.fontLicenseRef]) {
    if (ref?.commit !== UI_COMMIT) fail("UI_CHECKOUT_REF"); immutable(ctx, ref);
  }
  const dynamic = new Set(["archive/data/question_metadata.json", ...technical.items.map(item => item.sourceRef.path)]);
  if (technical.servedFiles?.length !== 98 || new Set(technical.servedFiles.map(ref => ref.path)).size !== 98) fail("SERVED_INVENTORY");
  // The generated index is rebuilt by every main snapshot: compare the entries
  // this question's own images consume (rules in svg-index-continuity.mjs).
  const indexAssetRefs = [...new Set([...current.witness.currentProblemAssets.map(ref => ref.path),
    ...technical.results.filter(row => row.questionUid === ctx.patch.questionUid).map(row => row.assetRef?.path)])]
    .filter(value => typeof value === "string").sort().map(value => ({ path: value }));
  for (const ref of technical.servedFiles) {
    if (ref.commit !== UI_COMMIT) fail("SERVED_CHECKOUT_REF"); immutable(ctx, ref);
    if (ref.path === SVG_INDEX_PATH) verifySvgIndexFootprint({ frozenBytes: immutable(ctx, ref, true), root: ctx.root,
      indexPath: ref.path, assetRefs: indexAssetRefs, safe, fail });
    else if (!dynamic.has(ref.path) && !isRenderEngineFile(ref.path)) live(ctx, ref, "LIVE_SERVED_CODE_DRIFT");
  }
  const fonts = new Map();
  for (const font of technical.studentFontResources) {
    if (font.status !== 200 || font.commit !== UI_COMMIT || !SHA256.test(font.resourceId || "") || fonts.has(font.resourceId) ||
        !["STYLESHEET", "FONT"].includes(font.kind)) fail("STUDENT_FONT_BINDING");
    immutable(ctx, refOnly(font)); live(ctx, font, "LIVE_STUDENT_FONT_DRIFT"); fonts.set(font.resourceId, font);
  }
  const shots = [];
  for (const item of M2_FAMILY3_PROBLEM_ITEMS) for (const viewport of ["desktop", "mobile"]) {
    const results = technical.results.filter(row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal && row.viewport?.name === viewport);
    const observations = visual.cases.filter(row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal && row.viewport === viewport);
    const manifests = technical.items.filter(row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal);
    if (results.length !== 1 || observations.length !== 1 || manifests.length !== 1) fail("UI_IDENTITY_CASE_INVENTORY");
    const result = results[0], observation = observations[0], manifest = manifests[0], t = result.technical, g = result.geometry, f = t.fontReadiness;
    if (result.key !== item.key || observation.key !== item.key || manifest.key !== item.key || manifest.expectedBankCount !== item.expectedQuestionCount ||
        result.status !== "PASS" || result.visualReview !== "PENDING" || observation.decision !== "DISPLAY_CONTINUITY_ACCEPTABLE" ||
        !same(observation.screenshots, result.screenshots) || !same(observation.sourceRef, result.sourceRef) || !same(observation.assetRef, result.assetRef) || !same(result.sourceRef, manifest.sourceRef) || !same(result.assetRef, manifest.assetRef) ||
        t.mode !== "exam" || t.questions !== item.expectedQuestionCount || t.readiness !== "RENDER_READY" || t.imagesComplete !== true ||
        t.mathErrors !== 0 || t.unrenderedMath !== 0 || t.mathJaxSource !== "local" || t.solutionNodes !== 0 ||
        g.imageInsideQuestion !== true || g.naturalWidth <= 0 || g.naturalHeight <= 0 || Number(String(g.questionNumber).match(/^\d+/)?.[0]) !== item.sourceOrdinal ||
        [result.pageErrors, result.requestFailures, result.externalRequests].some(value => !Array.isArray(value) || value.length) ||
        f.status !== "loaded" || f.family !== "Nanum Myeongjo" || !same(f.weights.map(row => row.weight).sort((a, b) => a - b), [400, 700, 800]) ||
        f.weights.some(row => row.allLoaded !== true || row.checked !== true || row.loadedFaces < 1) ||
        !Array.isArray(t.fontResourceIds) || !t.fontResourceIds.length || t.fontResourceIds.some(id => !fonts.has(id))) fail("ACTUAL_UI_CASE_OR_READINESS");
    // Translate the existing display decision into the generic tile validator's
    // shape. This preserves the disclosed engine-author role; it is not a new
    // independent review and adds no metadata authority.
    validateM2ProblemRendererUiTileEvidence(ctx, result, { questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
      screenshots: observation.screenshots, decision: "PASS", conditionsAndLabelsPreserved: true, legible: true,
      notClipped: true, completeProblemCoverage: true }, item.key);
    shots.push(...result.screenshots);
    if (item.questionUid === ctx.patch.questionUid) {
      if (!same(result.sourceRef, current.witness.currentSourceRef) || !current.witness.currentProblemAssets.some(ref => same(ref, result.assetRef))) fail("UI_CURRENT_PROBLEM_BINDING");
    }
  }
  if (shots.length !== 6 || new Set(shots.map(shot => shot.path)).size !== 6) fail("SELECTED_ORIGINAL_PNG_INVENTORY");
  const all = technical.results.flatMap(result => result.screenshots.map(({ tileIndex, ...ref }) => ref)).sort((a, b) => a.path.localeCompare(b.path));
  if (all.length !== 51 || new Set(all.map(ref => ref.path)).size !== 51 || !same(all, technical.screenshotArtifacts.slice().sort((a, b) => a.path.localeCompare(b.path)))) fail("FULL_ORIGINAL_PNG_INVENTORY");

  return { technicalRef: bound.wrapper.studentUiTechnicalRef, observationRef: bound.wrapper.studentUiObservedRef,
    checkoutCommit: UI_COMMIT, logicalCases: 6, originalPngs: 6, fullLogicalCases: 48, fullOriginalPngs: 51,
    observerRoleDisclosure: visual.roleDisclosure, liveServedCodeVerified: true };
}

function retainedCompanions(ctx, supported, reviewKeys) {
  if (supported.sourceArchiveFile !== E015) return;
  const retained = ctx.patch.sourceReview.retainedFields, transport = ctx.patch.sourceReview.retainedScopeTransport;
  if (!keys(retained, ["schemaVersion", "fields", "independentPrimary"]) ||
      retained.schemaVersion !== "archive-reviewed-native-retained-fields-v1" ||
      !same(retained.fields, ["standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey",
        "crossConceptKeys", "conditionKeys", "integrationPattern", "standardUnit", "subUnit"]) ||
      !keys(retained.independentPrimary, ["schemaVersion", "reviewCommit", "reviewRef"]) ||
      retained.independentPrimary.schemaVersion !== "archive-reviewed-existing-primary-disposition-v1" ||
      !SHA1.test(retained.independentPrimary.reviewCommit || "") ||
      !keys(retained.independentPrimary.reviewRef, ["path", "sha256"]) || !SHA256.test(retained.independentPrimary.reviewRef.sha256 || "") ||
      !keys(transport, ["schemaVersion", "fields"]) || transport.schemaVersion !== "archive-reviewed-retained-scope-transport-v1" ||
      !same(transport.fields, ["curriculum", "curriculumKey", "courseKey"])) fail("RETAINED_COMPANION_OUTER_CONTRACT");
  safe(ctx.root, retained.independentPrimary.reviewRef.path);
  // Only the outer shape is checked here. The ordinary retained-fields and
  // scope-transport validators still authenticate these unchanged options.
  reviewKeys.push("retainedFields", "retainedScopeTransport");
}
export function validateM2Family3ProblemContinuity(args) {
  const sourceReview = args.patch?.sourceReview;
  if (!sourceReview || !Object.hasOwn(sourceReview, "m2Family3ProblemContinuity")) return null;
  const spec = sourceReview.m2Family3ProblemContinuity;
  const ctx = { ...args, spec, cache: args.cache || new Map() }, { request, patch, native, row, question } = ctx;
  if (!keys(spec, ["schemaVersion", "reviewCommit", "reviewRef"]) || spec.schemaVersion !== M2_FAMILY3_PROBLEM_CONTINUITY_SCHEMA ||
      !SHA1.test(spec.reviewCommit || "") || request?.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.metadataReviewed !== true || Object.hasOwn(request.approval, "sourceRebind") ||
      Object.hasOwn(request, "registrationMode") || Object.hasOwn(patch, "rebind") ||
      !Array.isArray(request.registryChanges) || request.registryChanges.length !== 0 ||
      native?.review?.schemaVersion !== "m2-s2-meta-review-v1" || !SHA1.test(request.expectedSourceBlobSha1 || "") ||
      typeof ctx.bankFromBytes !== "function" || !question || !row) fail("EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT");
  const supported = M2_FAMILY3_PROBLEM_ITEMS.find(item => item.questionUid === patch.questionUid &&
    item.sourceOrdinal === patch.sourceOrdinal && item.sourceArchiveFile === request.sourceArchiveFile);
  if (!supported) fail("EXACT_FAMILY3_ONLY");
  const reviewKeys = ["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "m2Family3ProblemContinuity"];
  retainedCompanions(ctx, supported, reviewKeys);
  if (!keys(sourceReview, reviewKeys) || sourceReview.schemaVersion !== "archive-reviewed-source-reassessment-v1" ||
      !["schemaVersion", "reviewCommit", "reviewPath", "reviewRef"].every(key => same(sourceReview[key], native.spec?.[key]))) fail("EXACT_SOURCE_REVIEW_OPTIONS");
  if (request.expectedQuestionCount !== supported.expectedQuestionCount || row.questionUid !== patch.questionUid ||
      row.sourceOrdinal !== patch.sourceOrdinal || PROBLEM_FIELDS.some(field => Object.hasOwn(patch.after || {}, field))) fail("NATIVE_IDENTITY_OR_METADATA_ONLY_SCOPE");
  const bound = evidence(ctx), validated = validateStatic(ctx, bound.documents.staticRef), ui = validateUi(ctx, bound, validated);
  let bytes;
  try {
    bytes = readE015IssuedSourceContinuation({ context:ctx.e015IssuedSourceContinuation, root:ctx.root,
      request, patch, current:ctx.final, question, relativePath:validated.current.ref.path })
      ?? fs.readFileSync(safe(ctx.root, validated.current.ref.path));
  } catch { fail("LIVE_SOURCE_UNAVAILABLE"); }
  if (blob(bytes) !== request.expectedSourceBlobSha1) fail("LIVE_SOURCE_CAS");
  const bank = ctx.bankFromBytes(bytes), n = patch.sourceOrdinal - 1;
  if (!Array.isArray(bank) || bank.length !== request.expectedQuestionCount || !same(projection(bank[n]), projection(question))) fail("LIVE_ARGUMENT_OR_DENOMINATOR");
  if (bank.some((item, index) => !same(projection(item), projection(validated.current.bank[index])))) fail("LIVE_PROBLEM_BANK_DRIFT");
  if (sha(stable(projection(question))) !== validated.witness.currentProblemSha256) fail("LIVE_SELECTED_PROBLEM_DRIFT");
  const normalizedQuestion = { ...question };
  for (const field of OWNED_FIELDS) {
    if (Object.hasOwn(validated.oldProblem, field)) normalizedQuestion[field] = structuredClone(validated.oldProblem[field]);
    else delete normalizedQuestion[field];
  }
  if (!same(projection(normalizedQuestion), validated.oldProblem)) fail("NORMALIZED_PROBLEM_NOT_NATIVE");
  const normalizedPatch = { ...patch, sourceReview: { ...patch.sourceReview } };
  delete normalizedPatch.sourceReview.m2Family3ProblemContinuity;
  return { normalizedQuestion, normalizedPatch, normalizedProblemFields: [...OWNED_FIELDS], proof: {
    schemaVersion: M2_FAMILY3_PROBLEM_CONTINUITY_SCHEMA, scope: M2_FAMILY3_PROBLEM_SCOPE,
    questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal, sourceArchiveFile: request.sourceArchiveFile,
    reviewCommit: spec.reviewCommit, reviewRef: spec.reviewRef, staticRef: bound.wrapper.staticRef,
    nativeReviewRef: validated.witness.nativeReviewRef, nativeItemSha256: validated.witness.nativeItemSha256,
    nativeSourceRef: validated.witness.nativeSourceRef, nativeCommittedSourceRef: validated.witness.nativeCommittedSourceRef,
    currentSourceRef: validated.witness.currentSourceRef, staticBeforeSourceRef: validated.witness.basis.staticBeforeSourceRef,
    staticSourceRef: validated.witness.basis.staticSourceRef,
    nativeReviewedQuestionSha256: validated.witness.nativeReviewedQuestionSha256,
    nativeCommittedQuestionSha256: validated.witness.nativeCommittedQuestionSha256,
    reviewedCurrentQuestionSha256: validated.witness.reviewedCurrentQuestionSha256,
    staticBeforeQuestionSha256: validated.witness.basis.staticBeforeQuestionSha256,
    staticCurrentQuestionSha256: validated.witness.basis.staticCurrentQuestionSha256,
    liveWholeQuestionSha256: sha(stable(bank[n])), argumentWholeQuestionSha256: sha(stable(question)),
    normalizedProblemFields: [...OWNED_FIELDS], problemFieldDelta: validated.witness.problemFieldDelta,
    originalProblemSha256: validated.witness.nativeProblemSha256, currentProblemSha256: validated.witness.currentProblemSha256,
    liveSourceBlobSha1: blob(bytes), liveSourceSha256: sha(bytes), ui, memoryOnlyNormalization: true,
    requiresOrdinaryNativeValidation: true, requiresOrdinaryRetainedValidation: supported.sourceArchiveFile === E015,
    requiresSeparateSolutionContinuity: false, newMathematicalQa: false, newMetadataApprovals: 0,
    newDifficultyJudgments: 0, newReview2Claims: 0, sourceWrites: 0, rendererWrites: 0
  } };
}
