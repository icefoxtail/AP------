import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { questionAssetReferences } from "../archive-content-inputs.mjs";

export const M2_PROBLEM_RENDERER_SCHEMA = "archive-reviewed-m2-problem-renderer-continuity-v1";
const WITNESS_SCHEMA = "archive-independent-m2-problem-renderer-continuity-v1";
const UI_REVIEW_SCHEMA = "archive-independent-m2-problem-renderer-student-ui-review-v2";
const SCOPE = "EXACT_M2_PROBLEM_RENDERER_THREE";
const RENDERER_FIELDS = ["image", "imageAlt", "imageSize", "layoutTag"];
const META_FIELDS = ["curriculum", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern",
  "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "rpmL1", "rpmL2", "rpmL3", "rpmL4",
  "rpmPrimaryPath", "primaryMethod", "decisiveStep"];
// This version covers only the separately reviewed three intersections. It is
// not an open renderer exception for M2, M3, other native reviews or other UIDs.
export const M2_PROBLEM_RENDERER_ITEMS = Object.freeze([
  Object.freeze({ questionUid: "qid_v1_826a35829c515296d28c799f17e8610d2ece6e8ea45c812778822d082b9efee1", sourceOrdinal: 12,
    sourceArchiveFile: "original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js", expectedQuestionCount: 24, lane: "M2_FINALIZED_V3" }),
  Object.freeze({ questionUid: "qid_v1_77bdb41803d8e38bf819ade572a121911b9ef1bf783541203c671df15ec0985f", sourceOrdinal: 3,
    sourceArchiveFile: "original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js", expectedQuestionCount: 23, lane: "M2_RETAINED_INDEPENDENT_PRIMARY" }),
  Object.freeze({ questionUid: "qid_v1_df7a46a1d2551864d378ffa34389721380b230aa6e36d5a8d064be61aada21ea", sourceOrdinal: 21,
    sourceArchiveFile: "original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js", expectedQuestionCount: 23, lane: "M2_RETAINED_INDEPENDENT_PRIMARY" }),
]);
const fail = message => { throw new Error(`M2 problem renderer continuity: ${message}`); };
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
  const key = stable(["m2-problem-renderer-git", ctx.root, commit, relative]);
  if (!ctx.cache.has(key)) {
    try {
      const options = { cwd: ctx.root, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] };
      if (execFileSync("git", ["rev-parse", "--verify", `${commit}^{commit}`], options).toString().trim() !== commit)
        fail("exact immutable commit required");
      const bytes = execFileSync("git", ["show", `${commit}:${relative}`], options);
      ctx.cache.set(key, { bytes, commit, path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes) });
    } catch { fail("immutable source, asset or witness unavailable"); }
  }
  return ctx.cache.get(key);
}
function bound(ctx, ref) {
  if (!keys(ref, ["path", "sha256"]) || !SHA256.test(ref.sha256 || "")) fail("exact evidence reference required");
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (refs?.filter(item => same(item, ref)).length !== 1) fail("witness must bind both evidence lists exactly once");
  const file = gitFile(ctx, ctx.spec.reviewCommit, ref.path);
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
// Version 2 binds six logical cases to every original scroll tile. A tile is
// evidence of the unchanged student viewport, never a resized/stitched substitute.
export function validateM2ProblemRendererUiTileEvidence(ctx, result, review, itemKey) {
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
    safe(ctx.root, shot.path); lastStart = span[0]; lastEnd = span[1]; operations += tile.scrollOperations;
  }
  if (lastEnd !== c.content.height || c.scrollOperations !== operations || !same(c.scrollAfter, c.tiles.at(-1).scroll) ||
      !keys(review, ["questionUid", "sourceOrdinal", "viewport", "screenshots", "decision", "conditionsAndLabelsPreserved",
        "legible", "notClipped", "completeProblemCoverage"]) || !same(review.screenshots, shots) || review.decision !== "PASS" ||
      review.conditionsAndLabelsPreserved !== true || review.legible !== true || review.notClipped !== true || review.completeProblemCoverage !== true)
    fail("independent observation of every original scroll tile required");
  return shots;
}

function technicalUi(ctx, row, current) {
  const { value: technical } = bound(ctx, row.studentUiTechnicalRef), { value: visual } = bound(ctx, row.studentUiVisualRef);
  if (technical.schemaVersion !== "archive-problem-renderer-student-ui-preview-v2" ||
      technical.status !== "TECHNICAL_PASS_VISUAL_REVIEW_PENDING" || technical.executionOwner !== "GITHUB_ACTIONS_SUPPORTED_CHROME" ||
      technical.mode !== "exam" || technical.sourceOverlayCount !== 0 || technical.problemOnlyScreenshots !== true ||
      technical.sourceOverlay !== false || technical.sourceWrites !== 0 || technical.solutionsOpened !== false ||
      technical.fontTransport !== "EXACT_STUDENT_GOOGLE_STYLESHEET_AND_ITS_DECLARED_NANUM_MYEONGJO_FILES" ||
      technical.newFullMathematicalQa !== false || technical.newMetadataApprovals !== 0 ||
      technical.newDifficultyJudgments !== 0 || technical.newReviewPassCount !== 0 || technical.newFourSlotApprovals !== 0 ||
      !Array.isArray(technical.failures) || technical.failures.length ||
      !SHA1.test(technical.checkoutCommit || "") || !Array.isArray(technical.items) || technical.items.length !== 3 ||
      !Array.isArray(technical.results) || technical.results.length !== 6 ||
      technical.expectedLogicalCases !== 6 || technical.completedLogicalCases !== 6 ||
      !Number.isSafeInteger(technical.screenshotArtifactCount) || technical.screenshotArtifactCount < 6 || technical.screenshotArtifactCount > 48 ||
      !Array.isArray(technical.screenshotArtifacts) || technical.screenshotArtifacts.length !== technical.screenshotArtifactCount)
    fail("exact actual student UI technical evidence required; standalone render is insufficient");
  const fonts = new Map();
  for (const resource of technical.externalFontResources || []) {
    if (!keys(resource, ["resourceId", "kind", "host", "urlSha256", "status", "mime", "sha256", "bytes"]) ||
        !SHA256.test(resource.resourceId || "") || !SHA256.test(resource.urlSha256 || "") || !SHA256.test(resource.sha256 || "") ||
        resource.resourceId !== sha(stable({ urlSha256: resource.urlSha256, responseSha256: resource.sha256, mime: resource.mime })) ||
        resource.status !== 200 || !Number.isInteger(resource.bytes) || resource.bytes < 1 || resource.bytes > 2 * 1024 * 1024 ||
        fonts.has(resource.resourceId) || (resource.kind === "STYLESHEET" ? resource.host !== "fonts.googleapis.com" ||
          String(resource.mime).split(";")[0].trim().toLowerCase() !== "text/css" : resource.kind !== "FONT" ||
          resource.host !== "fonts.gstatic.com" || !["font/woff2", "font/woff", "font/ttf", "application/font-woff", "application/x-font-ttf"].includes(String(resource.mime).split(";")[0].trim().toLowerCase())))
      fail("actual student font response inventory changed");
    fonts.set(resource.resourceId, resource);
  }
  for (const ref of [technical.manifestRef, technical.checkerRef, technical.identityRef]) {
    if (!keys(ref, ["commit", "path", "gitBlobSha1", "sha256", "bytes"]) || ref.commit !== technical.checkoutCommit ||
        !SHA1.test(ref.gitBlobSha1 || "") || !SHA256.test(ref.sha256 || "") || !Number.isInteger(ref.bytes) || ref.bytes < 1)
      fail("UI manifest and checker immutable references required");
    const file = gitFile(ctx, technical.checkoutCommit, ref.path);
    if (file.gitBlobSha1 !== ref.gitBlobSha1 || file.sha256 !== ref.sha256 || file.bytes.length !== ref.bytes)
      fail("UI manifest/checker differs from the executed checkout");
  }
  if (!keys(visual, ["schemaVersion", "scope", "decision", "reviewer", "producerOwner", "technicalRef", "records",
      "newMathematicalQa", "newMetadataApprovals", "newDifficultyJudgments", "newReview2Claims"]) ||
      visual.schemaVersion !== UI_REVIEW_SCHEMA || visual.scope !== SCOPE || visual.decision !== "APPROVE_EXACT_STUDENT_UI_RENDERERS" ||
      !text(visual.reviewer) || !text(visual.producerOwner) || visual.reviewer === visual.producerOwner || visual.reviewer === ctx.native.reviewer ||
      !same(visual.technicalRef, row.studentUiTechnicalRef) || visual.newMathematicalQa !== false ||
      visual.newMetadataApprovals !== 0 || visual.newDifficultyJudgments !== 0 || visual.newReview2Claims !== 0 ||
      !Array.isArray(visual.records) || visual.records.length !== 6) fail("separate six-case independent visual review required");
  const inventories = [];
  for (const supported of M2_PROBLEM_RENDERER_ITEMS) {
    const items = technical.items.filter(item => item.questionUid === supported.questionUid && item.sourceOrdinal === supported.sourceOrdinal);
    if (items.length !== 1) fail("UI item inventory mismatch");
    for (const name of ["desktop", "mobile"]) {
      const results = technical.results.filter(item => item.questionUid === supported.questionUid &&
        item.sourceOrdinal === supported.sourceOrdinal && item.viewport?.name === name);
      const reviews = visual.records.filter(item => item.questionUid === supported.questionUid &&
        item.sourceOrdinal === supported.sourceOrdinal && item.viewport === name);
      if (results.length !== 1 || reviews.length !== 1) fail("UI screenshot inventory mismatch");
      const result = results[0], review = reviews[0];
      const t = result.technical, g = result.geometry;
      const font = t?.fontReadiness, fontIds = t?.fontResourceIds;
      if (font?.status !== "loaded" || font.family !== "Nanum Myeongjo" || !Array.isArray(font.weights) ||
          !same(font.weights.map(row => row.weight).sort((a, b) => a - b), [400, 700, 800]) ||
          font.weights.some(row => row.allLoaded !== true || row.checked !== true || !Number.isInteger(row.loadedFaces) || row.loadedFaces < 1) ||
          !Array.isArray(font.problemFontFamilies) || !font.problemFontFamilies.length ||
          font.problemFontFamilies.some(value => typeof value !== "string" || !value.includes("Nanum Myeongjo")) ||
          !Array.isArray(fontIds) || fontIds.length !== new Set(fontIds).size || fontIds.some(id => !fonts.has(id)) ||
          !fontIds.some(id => fonts.get(id).kind === "STYLESHEET") || !fontIds.some(id => fonts.get(id).kind === "FONT"))
        fail("actual student font readiness and responses required");
      if (result.status !== "PASS" || result.visualReview !== "PENDING" ||
          t?.mode !== "exam" || t.questions !== supported.expectedQuestionCount || !Number.isInteger(t.pages) || t.pages < 1 || t.readiness !== "RENDER_READY" ||
          t.imagesComplete !== true || t.mathErrors !== 0 || t.unrenderedMath !== 0 || t.mathJaxSource !== "local" || t.solutionNodes !== 0 ||
          g?.imageInsideQuestion !== true || !(g.naturalWidth > 0) || !(g.naturalHeight > 0) || !(g.image?.width > 0) ||
          Number(String(g.questionNumber || "").match(/^\d+/)?.[0]) !== supported.sourceOrdinal ||
          [result.pageErrors, result.requestFailures, result.externalRequests].some(values => !Array.isArray(values) || values.length) ||
          !Number.isInteger(result.viewport.width) || !Number.isInteger(result.viewport.height) ||
          result.viewport.width <= 0 || result.viewport.height <= 0 ||
          !same(items[0].sourceRef, result.sourceRef) || !same(items[0].assetRef, result.assetRef)) fail("UI screenshot or independent observation mismatch");
      const screenshots = validateM2ProblemRendererUiTileEvidence(ctx, result, review, items[0].key);
      inventories.push({ questionUid: supported.questionUid, sourceOrdinal: supported.sourceOrdinal, viewport: name, screenshots });
      if (supported.questionUid === ctx.patch.questionUid) {
        const sourceRef = result.sourceRef, assetRef = result.assetRef;
        if (sourceRef?.commit !== technical.checkoutCommit || sourceRef.path !== current.ref.path ||
            sourceRef.gitBlobSha1 !== current.ref.gitBlobSha1 || sourceRef.sha256 !== current.ref.sha256 ||
            assetRef?.commit !== technical.checkoutCommit || assetRef.path !== `archive/${current.question.image}`.replace(/^archive\/archive\//, "archive/"))
          fail("student UI does not use the independently reviewed current source/image");
        for (const ref of [sourceRef, assetRef]) {
          if (!keys(ref, ["commit", "path", "gitBlobSha1", "sha256", "bytes"]) || !Number.isInteger(ref.bytes) || ref.bytes < 1)
            fail("exact student UI source/asset reference required");
          const file = gitFile(ctx, technical.checkoutCommit, ref.path);
          if (file.gitBlobSha1 !== ref.gitBlobSha1 || file.sha256 !== ref.sha256 || file.bytes.length !== ref.bytes) fail("UI checkout source/asset binding changed");
        }
        const currentAsset = row.currentAssets.find(asset => asset.path === assetRef.path);
        if (!currentAsset || currentAsset.sha256 !== assetRef.sha256 || currentAsset.gitBlobSha1 !== assetRef.gitBlobSha1)
          fail("UI current asset differs from complete renderer inventory");
      }
    }
  }
  const artifacts = inventories.flatMap(item => item.screenshots.map(({ tileIndex, ...ref }) => ref))
    .sort((a, b) => a.path.localeCompare(b.path));
  if (new Set(artifacts.map(item => item.path)).size !== artifacts.length ||
      artifacts.length !== technical.screenshotArtifactCount ||
      !same(technical.screenshotArtifacts.slice().sort((a, b) => String(a?.path).localeCompare(String(b?.path))), artifacts))
    fail("complete original PNG artifact inventory required");
  return { technicalRef: row.studentUiTechnicalRef, visualRef: row.studentUiVisualRef,
    checkoutCommit: technical.checkoutCommit, independentReviewer: visual.reviewer, screenshots: inventories,
    screenshotArtifactCount: artifacts.length };
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
export function validateM2ProblemRendererContinuity(args) {
  const spec = args.patch.sourceReview?.m2ProblemRendererContinuity;
  if (spec === undefined) return null;
  const ctx = { ...args, spec, cache: args.cache || new Map() }, { request, patch, native, row, question } = ctx;
  if (!keys(spec, ["schemaVersion", "reviewCommit", "reviewRef"]) || spec.schemaVersion !== M2_PROBLEM_RENDERER_SCHEMA ||
      !SHA1.test(spec.reviewCommit || "") || request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.metadataReviewed !== true || request.registrationMode !== undefined || request.approval.sourceRebind !== undefined ||
      patch.rebind !== undefined || native.review.schemaVersion !== "m2-s2-meta-review-v1") fail("explicit exclusive M2 renderer contract required");
  const supported = M2_PROBLEM_RENDERER_ITEMS.find(item => item.questionUid === patch.questionUid && item.sourceOrdinal === patch.sourceOrdinal &&
    item.sourceArchiveFile === request.sourceArchiveFile);
  if (!supported || row.questionUid !== patch.questionUid || row.sourceOrdinal !== patch.sourceOrdinal || request.expectedQuestionCount !== supported.expectedQuestionCount)
    fail("only the exact three independently reviewed UID/source/ordinal bindings are supported");
  const baseKeys = ["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "m2ProblemRendererContinuity"];
  const review = patch.sourceReview;
  if (supported.lane === "M2_FINALIZED_V3" ?
      !keys(review, [...baseKeys, "proposalFinalization"]) || review.proposalFinalization?.schemaVersion !== "archive-native-proposal-finalization-v3" ||
        review.proposalFinalization?.scopeParentTransport?.schemaVersion !== "archive-native-m2-finalized-scope-parent-v1" :
      !keys(review, [...baseKeys, "retainedFields", "retainedScopeTransport"]) ||
        review.retainedFields?.independentPrimary?.schemaVersion !== "archive-reviewed-existing-primary-disposition-v1" ||
        review.retainedScopeTransport?.schemaVersion !== "archive-reviewed-retained-scope-transport-v1" || (request.registryChanges || []).length)
    fail("original v3 or retained independent-primary authority must remain explicit and unmixed");
  const { value: document } = bound(ctx, spec.reviewRef);
  if (!keys(document, ["schemaVersion", "scope", "decision", "reviewer", "rows", "newMathematicalQa", "newMetadataApprovals",
      "newDifficultyJudgments", "newReview2Claims", "sourceWrites", "canonicalWrites", "actualMainRegistrationClaimed"]) ||
      document.schemaVersion !== WITNESS_SCHEMA || document.scope !== SCOPE || document.decision !== "APPROVE_EXACT_PROBLEM_RENDERER_CONTINUITY" ||
      !text(document.reviewer) || document.reviewer === native.reviewer || document.newMathematicalQa !== false ||
      document.newMetadataApprovals !== 0 || document.newDifficultyJudgments !== 0 || document.newReview2Claims !== 0 ||
      document.sourceWrites !== 0 || document.canonicalWrites !== 0 || document.actualMainRegistrationClaimed !== false ||
      !Array.isArray(document.rows) || document.rows.length !== 3 || M2_PROBLEM_RENDERER_ITEMS.some(item =>
        document.rows.filter(value => value.questionUid === item.questionUid && value.sourceOrdinal === item.sourceOrdinal &&
          value.sourceArchiveFile === item.sourceArchiveFile).length !== 1)) fail("closed independent three-item witness required");
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
  const liveMetadataFields = supported.lane === "M2_FINALIZED_V3" ? ["crossConceptKeys"] : [];
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
  delete normalizedPatch.sourceReview.m2ProblemRendererContinuity;
  return { normalizedQuestion, normalizedPatch, proof: { schemaVersion: M2_PROBLEM_RENDERER_SCHEMA, questionUid: patch.questionUid,
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
