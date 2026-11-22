import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { questionAssetReferences } from "../archive-content-inputs.mjs";
import { compareSvgIndexContinuity, SvgIndexContinuityError } from "./svg-index-continuity.mjs";

export const M2_E006_PROBLEM_SCHEMA = "archive-m2-e006-problem-continuity-v1";
const WITNESS_SCHEMA = "archive-independent-m2-e006-problem-continuity-v1";
const UI_REVIEW_SCHEMA = "archive-root-e006-actual-original-ui-observation-v1";
const SCOPE = "EXACT_M2_E006_Q3_Q21_PROBLEM_DISPLAY";
const RENDERER_FIELDS = ["image", "imageAlt", "imageSize", "layoutTag"];
const META_FIELDS = ["curriculum", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern",
  "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "rpmL1", "rpmL2", "rpmL3", "rpmL4",
  "rpmPrimaryPath", "primaryMethod", "decisiveStep"];
// The original THREE/six-case contract is unchanged in its own module.
// This separate profile binds only E006 Q3/Q21 to the observed four current cases.
export const M2_E006_PROBLEM_ITEMS = Object.freeze([
  {
    "questionUid": "qid_v1_77bdb41803d8e38bf819ade572a121911b9ef1bf783541203c671df15ec0985f",
    "sourceOrdinal": 3,
    "sourceArchiveFile": "original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 23,
    "lane": "M2_RETAINED_INDEPENDENT_PRIMARY"
  },
  {
    "questionUid": "qid_v1_df7a46a1d2551864d378ffa34389721380b230aa6e36d5a8d064be61aada21ea",
    "sourceOrdinal": 21,
    "sourceArchiveFile": "original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 23,
    "lane": "M2_RETAINED_INDEPENDENT_PRIMARY"
  }
].map(Object.freeze));
const fail = message => { throw new Error(`M2_E006_PROBLEM: ${message}`); };
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const text = value => typeof value === "string" && value.trim().length > 0;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const keys = (value, expected) => value && typeof value === "object" && !Array.isArray(value) &&
  same(Object.keys(value).sort(), [...expected].sort());
const presence = (row, key) => Object.hasOwn(row, key) ? { present: true, sha256: sha(stable(row[key])) } : { present: false };
const differences = (before, after) => [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()
  .filter(key => !same(presence(before, key), presence(after, key)))
  .map(field => ({ field, before: presence(before, field), after: presence(after, field) }));

function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || /[\\\x00-\x1f]/.test(relative) ||
      relative.split("/").some(part => !part || part === "." || part === "..")) fail("unsafe path");
  const full = path.resolve(root, relative);
  for (let current = full; current !== path.resolve(root); current = path.dirname(current))
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) fail("symlink path");
  return full;
}
function gitFile(ctx, commit, relative) {
  safe(ctx.root, relative);
  if (!SHA1.test(commit || "")) fail("exact immutable commit required");
  const key = stable(["m2-e006-problem-git", ctx.root, commit, relative]);
  if (!ctx.cache.has(key)) {
    try {
      const options = { cwd: ctx.root, maxBuffer: 128 * 1024 * 1024, env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" }, stdio: ["ignore", "pipe", "pipe"] };
      if (execFileSync("git", ["rev-parse", "--verify", `${commit}^{commit}`], options).toString().trim() !== commit)
        fail("exact immutable commit required");
      const bytes = execFileSync("git", ["show", `${commit}:${relative}`], options);
      ctx.cache.set(key, { bytes, commit, path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes) });
    } catch { fail("immutable source, asset or witness unavailable"); }
  }
  return ctx.cache.get(key);
}
function bound(ctx, ref, commit = ctx.spec.reviewCommit) {
  if (!keys(ref, ["path", "sha256"]) || !SHA256.test(ref.sha256 || "")) fail("exact evidence reference required");
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (refs?.filter(item => same(item, ref)).length !== 1) fail("witness must bind both evidence lists exactly once");
  const file = gitFile(ctx, commit, ref.path);
  let local;
  try { local = fs.readFileSync(safe(ctx.root, ref.path)); } catch { fail("live witness missing"); }
  if (file.sha256 !== ref.sha256 || sha(local) !== ref.sha256) fail("witness Git/live bytes changed");
  try { return { value: JSON.parse(file.bytes), ref, bytes: file.bytes.length }; } catch { fail("invalid witness JSON"); }
}
function source(ctx, ref, expectedCommit) {
  if (!keys(ref, ["commit", "path", "gitBlobSha1", "sha256", "questionSha256"]) ||
      ref.path !== `archive/exams/${ctx.request.sourceArchiveFile}` || !SHA1.test(ref.gitBlobSha1 || "") ||
      !SHA256.test(ref.sha256 || "") || !SHA256.test(ref.questionSha256 || "") ||
      expectedCommit !== undefined && ref.commit !== expectedCommit) fail("exact source reference required");
  const file = gitFile(ctx, ref.commit, ref.path);
  if (file.gitBlobSha1 !== ref.gitBlobSha1 || file.sha256 !== ref.sha256) fail("source Git/raw binding changed");
  const bank = ctx.bankFromBytes(file.bytes), question = bank[ctx.patch.sourceOrdinal - 1];
  if (bank.length !== ctx.request.expectedQuestionCount || !question || sha(stable(question)) !== ref.questionSha256)
    fail("source question/ordinal/denominator mismatch");
  return { ref, file, bank, question };
}
function withBank(bytes, bank) {
  const text = bytes.toString("utf8"), matches = [...text.matchAll(/(?:^|\n)[ \t]*window\.(?:questionBank|questions)[ \t]*=[ \t]*/gu)];
  if (matches.length !== 1) fail("one canonical JSON question-bank assignment required");
  const start = matches[0].index + matches[0][0].length;
  if (text[start] !== "[") fail("literal question bank required");
  let depth = 0, string = false, escaped = false, end;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (string) { if (escaped) escaped = false; else if (c === "\\") escaped = true; else if (c === '"') string = false; }
    else if (c === '"') string = true;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") { if (--depth === 0) { end = i + 1; break; } }
  }
  if (!end) fail("literal question-bank end missing");
  let original;
  try { original = JSON.parse(text.slice(start, end)); } catch { fail("canonical JSON question bank required"); }
  if (JSON.stringify(original, null, 2) !== text.slice(start, end)) fail("canonical JSON question-bank formatting required");
  return Buffer.from(text.slice(0, start) + JSON.stringify(bank, null, 2) + text.slice(end));
}
function references(ctx, question) {
  const out = new Set(), add = value => {
    if (typeof value !== "string" || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail("unsupported renderer reference");
    const relative = value.startsWith("archive/") ? value : `archive/${value}`;
    safe(ctx.root, relative); out.add(relative);
  };
  const explicit = value => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) return value.forEach(explicit);
    if (typeof value === "string") return add(value);
    fail("unsupported renderer object");
  };
  for (const key of ["image", "images", "solutionImage", "solutionImages"]) explicit(question[key]);
  if (question.figureSvg || question.solutionFigureSvg) fail("inline renderer outside this contract");
  const html = value => {
    if (Array.isArray(value)) return value.forEach(html);
    if (value && typeof value === "object") return Object.values(value).forEach(html);
    if (typeof value !== "string") return;
    if (/<(?:svg|object|iframe|image)\b|(?:srcset|style)\s*=|url\s*\(/i.test(value)) fail("unsupported inline renderer dependency");
    for (const tag of value.matchAll(/<img\b[^>]*>/gi)) {
      const match = tag[0].match(/\bsrc\s*=\s*(["'])([^"']+)\1/i);
      if (!match) fail("image src required"); add(match[2]);
    }
  };
  html(question); questionAssetReferences(question).forEach(add);
  return [...out].sort();
}
function assets(ctx, snapshot, inventory) {
  const paths = references(ctx, snapshot.question);
  if (!Array.isArray(inventory) || inventory.length !== new Set(inventory.map(item => item.path)).size ||
      !same(inventory.map(item => item.path).sort(), paths)) fail("complete asset inventory required");
  for (const item of inventory) {
    if (!keys(item, ["path", "gitBlobSha1", "sha256", "bytes"]) || !SHA1.test(item.gitBlobSha1 || "") ||
        !SHA256.test(item.sha256 || "") || !Number.isInteger(item.bytes) || item.bytes < 1) fail("exact asset digest required");
    const file = gitFile(ctx, snapshot.ref.commit, item.path);
    let local;
    try { local = fs.readFileSync(safe(ctx.root, item.path)); } catch { fail("live renderer missing"); }
    if (file.gitBlobSha1 !== item.gitBlobSha1 || file.sha256 !== item.sha256 || file.bytes.length !== item.bytes ||
        sha(local) !== item.sha256 || blob(local) !== item.gitBlobSha1) fail("live/immutable renderer bytes changed");
    if (/\.svg$/i.test(item.path)) {
      const svg = file.bytes.toString("utf8");
      if (/<(?:script|foreignObject)\b|<!ENTITY|<!DOCTYPE|@import|\bon\w+\s*=/i.test(svg) ||
          [...svg.matchAll(/(?:href|xlink:href|src)\s*=\s*(["'])(.*?)\1/gi)].some(match => !match[2].startsWith("#")) ||
          [...svg.matchAll(/url\s*\(\s*['"]?([^)'"\s]+)/gi)].some(match => !match[1].startsWith("#")))
        fail("SVG dependency outside the exact asset inventory");
    }
  }
  return inventory;
}
// The E006 profile binds four logical cases to every original scroll tile. A tile is
// evidence of the unchanged student viewport, never a resized/stitched substitute.
export function validateM2E006ProblemUiTileEvidence(ctx, result, review, itemKey) {
  const c = result.capture, shots = result.screenshots;
  const point = v => keys(v, ["x", "y"]) && Number.isFinite(v.x) && Number.isFinite(v.y);
  const rect = v => keys(v, ["x", "y", "width", "height"]) && point({ x: v.x, y: v.y }) &&
    Number.isFinite(v.width) && Number.isFinite(v.height) && v.width > 0 && v.height > 0;
  if (Object.hasOwn(result, "screenshot") || !/^[A-Za-z0-9_-]{1,40}$/.test(itemKey || "") ||
      !keys(c, ["schemaVersion", "method", "tileLimit", "overlapCssPixels", "tileCount", "content", "question", "viewport",
        "visibleChildren", "coverage", "tiles", "scrollBefore", "scrollAfter", "scrollOperations", "domSha256", "feedbackIdle",
        "foreignContentHits", "cssWrites", "domWrites", "viewportChanges", "compositeImageCreated"]) ||
      c.schemaVersion !== "archive-problem-scroll-coverage-v1" || c.method !== "UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES" ||
      c.tileLimit !== 8 || c.overlapCssPixels !== 32 || !Number.isInteger(c.tileCount) || c.tileCount < 1 || c.tileCount > 8 ||
      !Array.isArray(shots) || shots.length !== c.tileCount || !Array.isArray(c.tiles) || c.tiles.length !== c.tileCount ||
      !rect(c.content) || !rect(c.question) || c.content.x < c.question.x || c.content.y < c.question.y ||
      c.content.x + c.content.width > c.question.x + c.question.width ||
      c.content.y + c.content.height > c.question.y + c.question.height ||
      !same(c.viewport, { width: result.viewport.width, height: result.viewport.height }) ||
      !Number.isInteger(c.visibleChildren) || c.visibleChildren < 1 || !SHA256.test(c.domSha256 || "") ||
      c.feedbackIdle !== true || c.foreignContentHits !== 0 || c.cssWrites !== 0 || c.domWrites !== 0 || c.viewportChanges !== 0 ||
      c.compositeImageCreated !== false || !point(c.scrollBefore) || !point(c.scrollAfter) ||
      !same(c.coverage, { requiredInterval: [0, c.content.height], coveredInterval: [0, c.content.height], complete: true }))
    fail("complete unchanged student scroll coverage required");
  let lastEnd = 0, lastStart = -1, operations = 0;
  for (let index = 0; index < shots.length; index++) {
    const shot = shots[index], tile = c.tiles[index], span = tile?.relativeInterval;
    const filename = `${itemKey}-${result.viewport.name}-tile-${String(index + 1).padStart(2, "0")}.png`;
    if (!keys(shot, ["tileIndex", "path", "sha256", "bytes"]) || shot.tileIndex !== index + 1 || shot.path !== filename ||
        !SHA256.test(shot.sha256 || "") || !Number.isSafeInteger(shot.bytes) || shot.bytes < 1 ||
        !keys(tile, ["tileIndex", "relativeInterval", "filename", "clip", "scroll", "scrollOperations", "feedbackIdle",
          "obstructionsIntersectingClip", "hitTestSamples", "foreignContentHits", "domSha256"]) ||
        tile.tileIndex !== index + 1 || tile.filename !== filename || !Array.isArray(span) || span.length !== 2 ||
        !span.every(Number.isFinite) || span[0] < 0 || span[1] > c.content.height || span[1] <= span[0] ||
        (index === 0 ? span[0] !== 0 : span[0] <= lastStart || span[1] <= lastEnd || lastEnd - span[0] !== 32) ||
        !rect(tile.clip) || !point(tile.scroll) || tile.clip.x !== c.content.x - tile.scroll.x ||
        tile.clip.y !== c.content.y - tile.scroll.y + span[0] || tile.clip.width !== c.content.width ||
        tile.clip.height !== span[1] - span[0] || tile.clip.x < 0 || tile.clip.y < 0 ||
        tile.clip.x + tile.clip.width > result.viewport.width || tile.clip.y + tile.clip.height > result.viewport.height ||
        !Number.isInteger(tile.scrollOperations) || tile.scrollOperations < 0 || tile.scrollOperations > 3 ||
        tile.feedbackIdle !== true || tile.obstructionsIntersectingClip !== 0 || tile.foreignContentHits !== 0 ||
        !Number.isSafeInteger(tile.hitTestSamples) || tile.hitTestSamples < 1 || tile.domSha256 !== c.domSha256)
      fail("original scroll tile binding or coverage changed");
    lastStart = span[0]; lastEnd = span[1]; operations += tile.scrollOperations;
  }
  if (lastEnd !== c.content.height || c.scrollOperations !== operations || !same(c.scrollAfter, c.tiles.at(-1).scroll) ||
      !keys(review, ["key", "questionUid", "sourceOrdinal", "viewport", "screenshots", "decision", "conditionsVisible",
        "legible", "notClipped", "completeCoverage", "everyOriginalTileDirectlyViewed", "newMathematicalQa"]) ||
      review.key !== itemKey || review.questionUid !== result.questionUid || review.sourceOrdinal !== result.sourceOrdinal ||
      review.viewport !== result.viewport.name || !same(review.screenshots, shots.map(({ tileIndex, ...ref }) => ref)) ||
      review.decision !== "ACCEPT_DISPLAY" || review.conditionsVisible !== true || review.legible !== true || review.notClipped !== true ||
      review.completeCoverage !== true || review.everyOriginalTileDirectlyViewed !== true || review.newMathematicalQa !== false)
    fail("independent observation of every original scroll tile required");
  return shots;
}

const E006_UI_COMMIT = "b6b605bf0d660f48e64646a9e59688c77e3e8a01";
const E006_UI_PUBLIC = "cdad05c2efd43d947d3dfa29325d8e32f9589514";
const E006_UI_PREFIX = "docs/operations/m2-e006-problem-continuity-20261116/";
export const M2_E006_UI_TECHNICAL_REF = Object.freeze({ commit: E006_UI_PUBLIC,
  path: E006_UI_PREFIX + "student-ui-technical-v1.json", gitBlobSha1: "cda984193a4fa02b6bc7a45808e5db4df90fc880",
  sha256: "6c36bb0f768012fd47d654865bb3cbf5cdeb763c453b90e239190c844a0c7b32", bytes: 90462 });
export const M2_E006_UI_VISUAL_REF = Object.freeze({ commit: E006_UI_PUBLIC,
  path: E006_UI_PREFIX + "student-ui-independent-v1.json", gitBlobSha1: "b0a8b94ce6c7b9103b6836ad6100e55439f2b3e8",
  sha256: "eaa4c0ff0adcaf3764cf46867e563d81aa615f2c3357f5becbe4d6c19e1dfe35", bytes: 4054 });
const E006_UI_MANIFEST_REF = Object.freeze({ commit: E006_UI_COMMIT, path: "tests/fixtures/archive-m2-e006-problem-ui.json",
  gitBlobSha1: "60d0ca76e58fdec8e01c58f372998fcab2921562", sha256: "e329d128441bf6cf58efb8bf0261f977c571067ec408b0972c597a4980b61aad", bytes: 3096 });
const E006_SVG_INDEX_PATH = "archive/data/svg-accessibility-index.js";
const E006_REF_KEYS = ["commit", "path", "gitBlobSha1", "sha256", "bytes"];
const e006Ref = value => Object.fromEntries(E006_REF_KEYS.map(key => [key, value[key]]));
const e006BytesRef = value => Object.fromEntries(["path", "gitBlobSha1", "sha256", "bytes"].map(key => [key, value[key]]));
const e006EvidenceRef = value => ({ path: value.path, sha256: value.sha256 });
const e006One = (rows, predicate, message) => { const found = (rows || []).filter(predicate); if (found.length !== 1) fail(message); return found[0]; };
// Render engine files may change after the capture; only their captured Git bytes are authenticated (user decision 2026-11-18).
const isRenderEngineFile = p => p === "archive/engine.html" || p === "archive/mixed_engine.html" || p === "apmath/wrong_print_engine.html" ||
  /^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) ||
  /^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(p);
const e006Need = (value, message) => { if (!value) fail(message); };
function e006Document(readRef, ref, argument) {
  const raw = readRef(ref);
  e006Need(Buffer.isBuffer(raw) && raw.length === ref.bytes && sha(raw) === ref.sha256 && blob(raw) === ref.gitBlobSha1,
    "immutable E006 UI document bytes changed");
  const parsed = JSON.parse(raw);
  if (argument !== undefined) e006Need(same(parsed, argument), "E006 UI document argument changed");
  return parsed;
}
// The complete four-case observation is immutable. A new capture or another UID
// requires a separately reviewed profile; callers cannot reseal these pins.
export function validateM2E006ProblemUiEvidence({ technical, visual, technicalRef, visualRef, questionUid, sourceOrdinal,
  currentSource, currentAsset, readRef, readLiveRef, readLiveFile }) {
  const subject = M2_E006_PROBLEM_ITEMS.find(item => item.questionUid === questionUid && item.sourceOrdinal === sourceOrdinal);
  e006Need(subject && typeof readRef === "function" && typeof readLiveRef === "function", "exact E006 subject and immutable/live readers required");
  e006Need(same(technicalRef, e006EvidenceRef(M2_E006_UI_TECHNICAL_REF)) && same(visualRef, e006EvidenceRef(M2_E006_UI_VISUAL_REF)),
    "exact published E006 UI references required");
  e006Need(keys(currentSource, ["path", "gitBlobSha1", "sha256", "bytes"]) &&
    keys(currentAsset, ["path", "gitBlobSha1", "sha256", "bytes"]), "complete current E006 source and asset bytes required");
  const t = e006Document(readRef, M2_E006_UI_TECHNICAL_REF, technical), v = e006Document(readRef, M2_E006_UI_VISUAL_REF, visual);
  const manifest = e006Document(readRef, E006_UI_MANIFEST_REF);
  e006Need(t.schemaVersion === "archive-m2-e006-student-ui-preview-v1" && t.checkoutCommit === E006_UI_COMMIT &&
    same(t.checkout, { expectedCheckoutCommit: E006_UI_COMMIT, actualCheckoutCommit: E006_UI_COMMIT, githubEventCommit: E006_UI_COMMIT }) &&
    t.executionOwner === "GITHUB_ACTIONS_SUPPORTED_CHROME" && t.status === "TECHNICAL_PASS_VISUAL_REVIEW_PENDING" &&
    t.mode === "exam" && t.studentReview === true && t.problemOnlyScreenshots === true && t.sourceOverlay === false &&
    t.sourceOverlayCount === 0 && t.sourceWrites === 0 && t.solutionsOpened === false && t.newParentApprovals === 0 &&
    t.newNativeApprovals === 0 && t.newFullMathematicalQa === false && t.newMetadataApprovals === 0 &&
    t.newDifficultyJudgments === 0 && t.newReviewPassCount === 0 && t.newFourSlotApprovals === 0 &&
    t.expectedLogicalCases === 4 && t.completedLogicalCases === 4 && t.items.length === 2 && t.results.length === 4 &&
    t.screenshotArtifactCount === 5 && t.screenshotArtifacts.length === 5 && t.failures.length === 0 && t.externalFontResources.length === 0,
    "closed E006 two-item four-case actual UI required");
  e006Need(v.schemaVersion === UI_REVIEW_SCHEMA && v.scope === "EXACT_E006_Q3_Q21_CURRENT_PROBLEM_DISPLAY_ONLY" &&
    v.decision === "APPROVE_EXACT_STUDENT_UI" && v.actualRunId === 43919393591 && v.actualJobId === 133482267233 &&
    v.checkoutCommit === E006_UI_COMMIT && v.technicalSha256 === M2_E006_UI_TECHNICAL_REF.sha256 &&
    text(v.reviewer) && text(v.producerOwner) && v.reviewer !== v.producerOwner && v.records.length === 4 &&
    v.logicalCases === 4 && v.originalPngsDirectlyViewed === 5 && v.sourceWrites === 0 && v.newMathematicalQa === false &&
    v.newNativeApprovals === 0 && v.newMetadataApprovals === 0 && v.newDifficultyJudgments === 0 && v.newReview2Claims === 0 &&
    v.mainRegistrationPerformed === false, "independent observation of the exact four cases and five original PNGs required");
  for (const key of ["manifestRef", "checkerRef", "captureHelperRef", "identityRef", "fontLicenseRef"]) {
    e006Need(keys(t[key], E006_REF_KEYS) && t[key].commit === E006_UI_COMMIT, "E006 actual checkout reference required"); readRef(t[key]);
  }
  e006Need(same(t.manifestRef, E006_UI_MANIFEST_REF) && manifest.items.length === 2, "E006 capture manifest changed");
  for (const refs of [t.surfaceRefs, t.originalFirstBasisRefs, t.mirroredAssets]) for (const ref of refs) {
    e006Need(keys(ref, E006_REF_KEYS) && ref.commit === E006_UI_COMMIT, "E006 immutable capture input changed"); readRef(ref);
  }
  const dynamic = new Set(["archive/data/question_metadata.json", ...t.items.map(item => item.sourceRef.path)]);
  e006Need(t.servedFiles.length === 87 && new Set(t.servedFiles.map(ref => ref.path)).size === 87, "E006 served inventory changed");
  // The generated SVG accessibility index is rebuilt by every main snapshot, so
  // compare the entries this question's own image consumes (rules in
  // svg-index-continuity.mjs) when the caller can read the live checkout. Without
  // a live file reader the exact byte pin remains.
  const indexAssetRefs = [...new Set([currentAsset.path, ...t.items.filter(item => item.questionUid === questionUid &&
    item.sourceOrdinal === sourceOrdinal).map(item => item.assetRef?.path)])].filter(value => typeof value === "string").sort()
    .map(value => ({ path: value }));
  for (const ref of t.servedFiles) {
    e006Need(keys(ref, E006_REF_KEYS) && ref.commit === E006_UI_COMMIT, "E006 served checkout changed");
    const frozen = readRef(ref);
    if (ref.path === E006_SVG_INDEX_PATH && typeof readLiveFile === "function") {
      const read = relative => { try { const bytes = readLiveFile(relative); return Buffer.isBuffer(bytes) ? bytes : null; } catch { return null; } };
      try { compareSvgIndexContinuity({ frozenBytes: frozen, liveBytes: read(ref.path), assetRefs: indexAssetRefs, readAsset: read }); }
      catch (error) { if (error instanceof SvgIndexContinuityError) fail(`E006 served SVG index continuity: ${error.code}`); throw error; }
    } else if (!dynamic.has(ref.path) && !isRenderEngineFile(ref.path)) readLiveRef(ref);
  }
  const fonts = new Map();
  e006Need(t.fontTransport === "EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS" && t.studentFontResources.length === 32,
    "exact E006 student font transport required");
  for (const font of t.studentFontResources) {
    e006Need(font.commit === E006_UI_COMMIT && font.status === 200 && ["FONT", "STYLESHEET"].includes(font.kind) &&
      SHA256.test(font.resourceId || "") && !fonts.has(font.resourceId), "E006 font inventory changed");
    fonts.set(font.resourceId, font); readRef(e006Ref(font)); readLiveRef(e006Ref(font));
  }
  const inventories = [];
  for (const item of M2_E006_PROBLEM_ITEMS) {
    const im = e006One(t.items, row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal, "E006 UI item mismatch");
    e006Need(im.key === `E006-Q${item.sourceOrdinal}` && im.expectedBankCount === 23 && im.imageBinding === "QUESTION_IMAGE" &&
      im.expectedLayoutTag === "fullwidth" && im.expectedChoiceCount === (item.sourceOrdinal === 3 ? 5 : 0), "E006 item display binding changed");
    for (const viewport of [{ name: "desktop", width: 1365, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
      const result = e006One(t.results, row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal &&
        row.viewport?.name === viewport.name, "E006 actual case mismatch");
      const review = e006One(v.records, row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal &&
        row.viewport === viewport.name, "E006 independent case mismatch");
      const state = result.technical, font = state.fontReadiness, roles = result.legacyRoleFrame;
      e006Need(result.key === im.key && result.status === "PASS" && result.visualReview === "PENDING" && same(result.viewport, viewport) &&
        same(result.sourceRef, im.sourceRef) && same(result.assetRef, im.assetRef) && result.sourceRef.commit === E006_UI_COMMIT &&
        result.assetRef.commit === E006_UI_COMMIT, "E006 screenshot source or asset binding changed");
      e006Need(state.mode === "exam" && state.questions === 23 && state.pages === 19 && state.readiness === "RENDER_READY" &&
        state.imagesComplete === true && state.mathErrors === 0 && state.unrenderedMath === 0 && state.mathJaxSource === "local" &&
        state.solutionNodes === 0 && font.status === "loaded" && font.family === "Nanum Myeongjo" &&
        same(font.weights.map(value => value.weight), [400, 700, 800]) && font.weights.every(value =>
          Number.isInteger(value.loadedFaces) && value.loadedFaces > 0 && value.allLoaded === true && value.checked === true) &&
        font.problemFontFamilies.length > 0 && font.problemFontFamilies.every(value => value.includes("Nanum Myeongjo")) &&
        state.fontResourceIds.length > 0 && new Set(state.fontResourceIds).size === state.fontResourceIds.length &&
        state.fontResourceIds.every(id => fonts.has(id)) && state.fontResourceIds.some(id => fonts.get(id).kind === "STYLESHEET") &&
        state.fontResourceIds.some(id => fonts.get(id).kind === "FONT"), "E006 exact student readiness required");
      e006Need(result.geometry.imageInsideQuestion === true && result.geometry.naturalWidth === im.expectedImageWidth &&
        result.geometry.naturalHeight === im.expectedImageHeight && Number(String(result.geometry.questionNumber).match(/^\d+/)?.[0]) === item.sourceOrdinal &&
        [result.pageErrors, result.requestFailures, result.externalRequests].every(rows => Array.isArray(rows) && rows.length === 0),
        "E006 geometry or request failures changed");
      const choices = item.sourceOrdinal === 3;
      e006Need(keys(roles, ["schemaVersion", "sourceOrdinal", "directChildRoles", "imageCount", "choiceCount", "visibleRequiredRoles", "responseSpace", "domWrites", "cssWrites"]) &&
        roles.schemaVersion === "archive-e006-direct-problem-role-frame-v1" && roles.sourceOrdinal === item.sourceOrdinal &&
        same(roles.directChildRoles, ["q-num", "q-content", "q-image-wrap", choices ? "choices" : "answer-box"]) &&
        roles.imageCount === 1 && roles.choiceCount === (choices ? 5 : 0) && roles.visibleRequiredRoles === (choices ? 4 : 3) &&
        result.capture.visibleChildren === (choices || viewport.name === "desktop" ? 4 : 3) && roles.responseSpace === (choices ? "NOT_APPLICABLE" : "EMPTY_ORIGINAL_ANSWER_BOX") &&
        roles.domWrites === 0 && roles.cssWrites === 0, "exact E006 legacy problem roles required");
      readRef(result.sourceRef); readRef(result.assetRef);
      const screenshots = validateM2E006ProblemUiTileEvidence({}, result, review, im.key);
      inventories.push({ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name, screenshots });
    }
  }
  const sorted = rows => rows.slice().sort((a, b) => a.path.localeCompare(b.path, "en"));
  const screenshots = inventories.flatMap(row => row.screenshots.map(({ tileIndex, ...ref }) => ref));
  e006Need(screenshots.length === 5 && new Set(screenshots.map(row => row.path)).size === 5 &&
    same(sorted(screenshots), sorted(t.screenshotArtifacts)), "E006 complete original PNG inventory required");
  const selected = e006One(t.items, item => item.questionUid === questionUid && item.sourceOrdinal === sourceOrdinal, "selected E006 UI item missing");
  e006Need(same(currentSource, e006BytesRef(selected.sourceRef)) && same(currentAsset, e006BytesRef(selected.assetRef)),
    "current E006 complete source or renderer differs from actual UI");
  readLiveRef(selected.sourceRef); readLiveRef(selected.assetRef);
  return { technicalRef, visualRef, checkoutCommit: E006_UI_COMMIT, independentReviewer: v.reviewer, logicalCases: 4,
    screenshotArtifactCount: 5, screenshots: inventories, selectedLogicalCases: 2,
    selectedOriginalTiles: inventories.filter(row => row.questionUid === questionUid).reduce((n, row) => n + row.screenshots.length, 0) };
}
function technicalUi(ctx, witness, current) {
  const technical = bound(ctx, witness.studentUiTechnicalRef, M2_E006_UI_TECHNICAL_REF.commit).value,
    visual = bound(ctx, witness.studentUiVisualRef, M2_E006_UI_VISUAL_REF.commit).value;
  e006Need(visual.reviewer !== ctx.native.reviewer, "E006 UI observer must remain independent from the native reviewer");
  const readRef = ref => {
    e006Need(keys(ref, E006_REF_KEYS), "complete immutable E006 UI reference required");
    const file = gitFile(ctx, ref.commit, ref.path);
    e006Need(file.gitBlobSha1 === ref.gitBlobSha1 && file.sha256 === ref.sha256 && file.bytes.length === ref.bytes,
      "E006 UI immutable dependency bytes changed");
    return file.bytes;
  };
  const readLiveRef = ref => {
    const raw = readRef(ref); let live;
    try { live = fs.readFileSync(safe(ctx.root, ref.path)); } catch { fail("E006 UI current dependency missing"); }
    e006Need(live.equals(raw), "E006 UI live dependency differs from observed immutable bytes"); return live;
  };
  const readLiveFile = relative => {
    const full = safe(ctx.root, relative), stat = fs.lstatSync(full);
    if (!stat.isFile() || stat.size < 1 || stat.size > 128 * 1024 * 1024) fail("E006 UI live file unreadable");
    return fs.readFileSync(full);
  };
  const assetPath = current.question.image.startsWith("archive/") ? current.question.image : `archive/${current.question.image}`;
  const currentAsset = e006One(witness.currentAssets, asset => asset.path === assetPath, "E006 current problem asset missing");
  return validateM2E006ProblemUiEvidence({ technical, visual, technicalRef: witness.studentUiTechnicalRef, visualRef: witness.studentUiVisualRef,
    questionUid: ctx.patch.questionUid, sourceOrdinal: ctx.patch.sourceOrdinal,
    currentSource: { path: current.ref.path, gitBlobSha1: current.file.gitBlobSha1, sha256: current.file.sha256, bytes: current.file.bytes.length },
    currentAsset, readRef, readLiveRef, readLiveFile });
}

function originalObservations(ctx, witness, prefigure, current) {
  if (!Array.isArray(witness.originalReviewRefs) || !witness.originalReviewRefs.length ||
      new Set(witness.originalReviewRefs.map(ref => ref.path)).size !== witness.originalReviewRefs.length)
    fail("original independent observations required");
  const documents = witness.originalReviewRefs.map(ref => bound(ctx, ref));
  const image = snapshot => (snapshot.question.image || "").startsWith("archive/") ? snapshot.question.image : `archive/${snapshot.question.image}`;
  const assetMatches = (ref, inventory, expectedPath) => ref && (ref.repositoryPath || ref.path) === expectedPath &&
    inventory.some(item => item.path === expectedPath && item.gitBlobSha1 === ref.gitBlobSha1 && item.sha256 === ref.sha256);
  const sameBoundQuestion = (ref, expected) => {
    if (!ref || ref.path !== expected.ref.path || !SHA1.test(ref.commit || "") || !SHA1.test(ref.gitBlobSha1 || "") || !SHA256.test(ref.sha256 || "")) return false;
    const file = gitFile(ctx, ref.commit, ref.path), bank = ctx.bankFromBytes(file.bytes);
    return file.gitBlobSha1 === ref.gitBlobSha1 && file.sha256 === ref.sha256 && bank.length === ctx.request.expectedQuestionCount &&
      same(bank[ctx.patch.sourceOrdinal - 1], expected.question);
  };
  let approved = false;
  for (const { value } of documents) {
    if (!["archive-independent-problem-renderer-review-v1", "archive-independent-problem-renderer-label-repair-review-v1",
      "root-problem-renderer-observed-v1"].includes(value.schemaVersion)) fail("unrecognized original independent renderer witness");
    if (value.schemaVersion === "archive-independent-problem-renderer-review-v1") {
      const rows = value.rows?.filter(item => item.questionUid === ctx.patch.questionUid && item.sourceOrdinal === ctx.patch.sourceOrdinal), item = rows?.[0];
      if (rows?.length === 1 && item.decision === "PASS_NARROW_PROBLEM_RENDERER_CONTINUITY" && item.geometryAndGivenConditions === "PASS" && value.producerAndVerifierAreDifferent === true &&
          value.newFullMathematicalQa === false && value.newMetadataApprovals === 0 && value.newDifficultyJudgments === 0 && value.newReview2Count === 0 &&
          ["newMetadataApproval", "newDifficultyJudgment", "newFullMathematicalQa", "newReview2"].every(key => item[key] === false) &&
          assetMatches(item.beforeAsset, witness.prefigureAssets, image(prefigure)) && assetMatches(item.afterAsset, witness.currentAssets, image(current)) &&
          sameBoundQuestion(item.sourceBinding?.beforeSourceRef, prefigure) && sameBoundQuestion(item.sourceBinding?.currentSourceRef, current)) approved = true;
    }
    if (value.schemaVersion === "archive-independent-problem-renderer-label-repair-review-v1" &&
        value.questionUid === ctx.patch.questionUid && value.sourceOrdinal === ctx.patch.sourceOrdinal &&
        value.decision === "PASS_NARROW_PROBLEM_RENDERER_LABEL_REPAIR" && value.producerAndVerifierAreDifferent === true &&
        value.reversePatchByteExact === true && value.geometryAndTextAndDescriptionUnchanged === true &&
        value.newFullMathematicalQa === false && value.newMetadataApprovals === 0 && value.newDifficultyJudgments === 0 && value.newReview2Count === 0 &&
        assetMatches(value.candidateAssetRef, witness.currentAssets, image(current))) {
      // The unchanged authored review records its original local path. Its
      // portable copy is resolved by exact raw SHA/length, then independently
      // bound to this immutable evidence commit. No local absolute path is read.
      const originals = documents.filter(doc => doc.ref.sha256 === value.priorIndependentReviewRef?.sha256 &&
        doc.bytes === value.priorIndependentReviewRef?.bytes);
      const prior = originals.length === 1 ? originals[0].value : null;
      const oldRows = prior?.rows?.filter(item => item.questionUid === ctx.patch.questionUid && item.sourceOrdinal === ctx.patch.sourceOrdinal), old = oldRows?.[0];
      if (prior?.schemaVersion !== "archive-independent-problem-renderer-review-v1" || oldRows?.length !== 1 ||
          old.decision !== "FAIL_NARROW_LABEL_CLEARANCE" || old.geometryAndGivenConditions !== "PASS" ||
          !assetMatches(old.beforeAsset, witness.prefigureAssets, image(prefigure)) || !sameBoundQuestion(old.sourceBinding?.beforeSourceRef, prefigure))
        fail("label repair must retain the exact original independently checked geometry");
      const oldSource = old.sourceBinding.currentSourceRef, file = gitFile(ctx, oldSource.commit, oldSource.path), oldQuestion = ctx.bankFromBytes(file.bytes)[ctx.patch.sourceOrdinal - 1];
      if (file.gitBlobSha1 !== oldSource.gitBlobSha1 || file.sha256 !== oldSource.sha256 ||
          !same({ ...oldQuestion, image: current.question.image }, current.question) ||
          value.originalPublicAssetRef?.sha256 !== old.afterAsset?.sha256 ||
          value.originalPublicAssetRef?.gitBlobSha1 !== old.afterAsset?.gitBlobSha1)
        fail("label repair source or original public renderer changed");
      approved = true;
    }
  }
  if (!approved) fail("applicable independent original renderer approval missing");
}

// Return a memory-only comparison view *after* authenticating every source,
// asset and independent/UI witness. The caller must then run the unchanged
// native/v3/retained validators against that view. This function grants no
// semantic authority and never rewrites a source, renderer, runtime or witness.
export function validateM2E006ProblemContinuity(args) {
  if (!Object.hasOwn(args.patch.sourceReview || {}, "m2E006ProblemContinuity")) return null;
  const spec = args.patch.sourceReview.m2E006ProblemContinuity;
  const ctx = { ...args, spec, cache: args.cache || new Map() }, { request, patch, native, row, question } = ctx;
  if (!keys(spec, ["schemaVersion", "reviewCommit", "reviewRef"]) || spec.schemaVersion !== M2_E006_PROBLEM_SCHEMA ||
      !SHA1.test(spec.reviewCommit || "") || request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.metadataReviewed !== true || request.registrationMode !== undefined || request.approval.sourceRebind !== undefined ||
      patch.rebind !== undefined || native.review.schemaVersion !== "m2-s2-meta-review-v1") fail("explicit exclusive M2 renderer contract required");
  const supported = M2_E006_PROBLEM_ITEMS.find(item => item.questionUid === patch.questionUid && item.sourceOrdinal === patch.sourceOrdinal &&
    item.sourceArchiveFile === request.sourceArchiveFile);
  if (!supported || row.questionUid !== patch.questionUid || row.sourceOrdinal !== patch.sourceOrdinal || request.expectedQuestionCount !== supported.expectedQuestionCount)
    fail("only the exact E006 two UID/source/ordinal bindings are supported");
  const baseKeys = ["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "m2E006ProblemContinuity"];
  const review = patch.sourceReview;
  if (!keys(review, [...baseKeys, "retainedFields", "retainedScopeTransport"]) ||
      review.retainedFields?.independentPrimary?.schemaVersion !== "archive-reviewed-existing-primary-disposition-v1" ||
      review.retainedScopeTransport?.schemaVersion !== "archive-reviewed-retained-scope-transport-v1" || (request.registryChanges || []).length)
    fail("original retained independent-primary authority must remain explicit and unmixed");
  const { value: document } = bound(ctx, spec.reviewRef);
  if (!keys(document, ["schemaVersion", "scope", "decision", "reviewer", "rows", "newMathematicalQa", "newMetadataApprovals",
      "newDifficultyJudgments", "newReview2Claims", "sourceWrites", "canonicalWrites", "actualMainRegistrationClaimed"]) ||
      document.schemaVersion !== WITNESS_SCHEMA || document.scope !== SCOPE || document.decision !== "APPROVE_EXACT_PROBLEM_RENDERER_CONTINUITY" ||
      !text(document.reviewer) || document.reviewer === native.reviewer || document.newMathematicalQa !== false ||
      document.newMetadataApprovals !== 0 || document.newDifficultyJudgments !== 0 || document.newReview2Claims !== 0 ||
      document.sourceWrites !== 0 || document.canonicalWrites !== 0 || document.actualMainRegistrationClaimed !== false ||
      !Array.isArray(document.rows) || document.rows.length !== 2 || M2_E006_PROBLEM_ITEMS.some(item =>
        document.rows.filter(value => value.questionUid === item.questionUid && value.sourceOrdinal === item.sourceOrdinal &&
          value.sourceArchiveFile === item.sourceArchiveFile).length !== 1)) fail("closed independent E006 two-item witness required");
  const witness = document.rows.find(item => item.questionUid === patch.questionUid);
  if (!keys(witness, ["questionUid", "sourceOrdinal", "sourceArchiveFile", "expectedQuestionCount", "nativeReviewRef", "nativeItemSha256",
      "nativeReviewedSource", "nativeCommittedSource", "prefigureSource", "currentSource", "nativeToPrefigureMetadata", "prefigureToCurrentFields",
      "nativeAssets", "prefigureAssets", "currentAssets", "originalReviewRefs", "studentUiTechnicalRef", "studentUiVisualRef"]) ||
      witness.expectedQuestionCount !== request.expectedQuestionCount || witness.nativeItemSha256 !== sha(stable(row)) ||
      !same(witness.nativeReviewRef, { commit: native.spec.reviewCommit, path: native.spec.reviewPath, sha256: native.spec.reviewRef.sha256 }))
    fail("original native review/item or exact witness shape changed");
  const original = source(ctx, witness.nativeReviewedSource, native.review.baseSha), committed = source(ctx, witness.nativeCommittedSource, native.spec.reviewCommit),
    prefigure = source(ctx, witness.prefigureSource), current = source(ctx, witness.currentSource);
  if (original.file.gitBlobSha1 !== native.sourceBlob || committed.file.gitBlobSha1 !== native.committedBlob ||
      !same(original.question, native.reviewedBank[patch.sourceOrdinal - 1]) || !same(committed.question, native.committedBank[patch.sourceOrdinal - 1]) ||
      !same(original.question, committed.question)) fail("both original native questions must remain byte-bound and identical");
  const metadataDelta = differences(committed.question, prefigure.question).map(change => {
    if (!META_FIELDS.includes(change.field) || !Object.hasOwn(prefigure.question, change.field)) fail("native-to-prefigure change outside explicit metadata fields");
    const value = prefigure.question[change.field]; let authority;
    if (["primaryMethod", "decisiveStep"].includes(change.field) && same(row[change.field], value)) authority = "NATIVE_ITEM_RATIONALE";
    else if (Object.hasOwn(row.after, change.field) && same(row.after[change.field], value)) authority = "NATIVE_AFTER";
    else if (["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"].includes(change.field) &&
        Object.hasOwn(row.finalDifficulty || {}, change.field) && same(row.finalDifficulty[change.field], value)) authority = "NATIVE_FINAL_DIFFICULTY";
    else fail("prefigure metadata change lacks its original native field authority");
    return { ...change, authority };
  });
  if (!same(metadataDelta, witness.nativeToPrefigureMetadata)) fail("exact native-to-prefigure metadata inventory changed");
  const rendererDelta = differences(prefigure.question, current.question);
  if (!same(rendererDelta.map(change => change.field).sort(), [...RENDERER_FIELDS].sort()) ||
      !same(rendererDelta, witness.prefigureToCurrentFields)) fail("only the exact four foreign problem-renderer fields may differ");
  const nativeAssets = assets(ctx, original, witness.nativeAssets);
  assets(ctx, committed, nativeAssets); const prefigureAssets = assets(ctx, prefigure, witness.prefigureAssets), currentAssets = assets(ctx, current, witness.currentAssets);
  if (!same(nativeAssets, prefigureAssets)) fail("original and prefigure complete renderer inventories differ");
  originalObservations(ctx, witness, prefigure, current);
  const ui = technicalUi(ctx, witness, current);
  const liveBytes = fs.readFileSync(safe(ctx.root, current.ref.path));
  if (blob(liveBytes) !== request.expectedSourceBlobSha1) fail("live source differs from the exact request blob");
  const liveBank = ctx.bankFromBytes(liveBytes);
  if (liveBank.length !== request.expectedQuestionCount || !same(liveBank[patch.sourceOrdinal - 1], question)) fail("live source/argument question mismatch");
  const liveMetadataFields = [];
  const liveDelta = differences(current.question, question);
  if (liveDelta.some(change => !liveMetadataFields.includes(change.field) || !Object.hasOwn(patch.after, change.field) ||
      !same(patch.after[change.field], question[change.field]))) fail("live source change outside separately validated metadata transport");
  if (liveBank.some((item, index) => index !== patch.sourceOrdinal - 1 && !same(item, current.bank[index])))
    fail("unselected live source question differs from the immutable current snapshot");
  if (!withBank(current.file.bytes, liveBank).equals(liveBytes)) fail("live source wrapper or non-metadata bytes changed");
  // No normalization has happened before all immutable/live/visual gates above.
  const normalizedQuestion = structuredClone(question);
  for (const field of RENDERER_FIELDS) {
    if (Object.hasOwn(prefigure.question, field)) normalizedQuestion[field] = structuredClone(prefigure.question[field]);
    else delete normalizedQuestion[field];
  }
  if (!same(ctx.studentPayload(normalizedQuestion), ctx.studentPayload(original.question)))
    fail("verified renderer normalization does not restore the exact native student payload");
  const normalizedPatch = { ...patch, sourceReview: { ...patch.sourceReview } };
  delete normalizedPatch.sourceReview.m2E006ProblemContinuity;
  return { normalizedQuestion, normalizedPatch, proof: { schemaVersion: M2_E006_PROBLEM_SCHEMA, questionUid: patch.questionUid,
    sourceOrdinal: patch.sourceOrdinal, sourceArchiveFile: request.sourceArchiveFile, lane: supported.lane, reviewCommit: spec.reviewCommit,
    reviewRef: spec.reviewRef, reviewer: document.reviewer, nativeReviewRef: witness.nativeReviewRef, nativeItemSha256: witness.nativeItemSha256,
    nativeReviewedSource: witness.nativeReviewedSource, nativeCommittedSource: witness.nativeCommittedSource,
    prefigureSource: witness.prefigureSource, currentSource: witness.currentSource, nativeToPrefigureMetadata: metadataDelta,
    prefigureToCurrentFields: rendererDelta, nativeAssets, prefigureAssets, currentAssets, originalReviewRefs: witness.originalReviewRefs,
    ui, liveSourceBlobSha1: blob(liveBytes), liveSourceSha256: sha(liveBytes), liveMetadataFields: liveDelta,
    originalStudentPayloadSha256: sha(stable(ctx.studentPayload(original.question))),
    currentStudentPayloadSha256: sha(stable(ctx.studentPayload(question))), memoryOnlyNormalization: true,
    newMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReview2Claims: 0, sourceWrites: 0, rendererWrites: 0 } };
}
