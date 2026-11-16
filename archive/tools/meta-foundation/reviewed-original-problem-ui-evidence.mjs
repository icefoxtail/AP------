import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

// Shared mechanics only. The caller must provide a code-owned, closed subject
// profile and separately replay its original complete Native/v3 authority.
// This module provides no subject roster or approval, metadata or source waiver.
const fail = message => { throw new Error(`ORIGINAL_PROBLEM_UI: ${message}`); };
export const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
export const text = value => typeof value === "string" && value.trim().length > 0;
export const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
export const same = (a, b) => stable(a) === stable(b);
export const sha = value => crypto.createHash("sha256").update(value).digest("hex");
export const blob = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
export const keys = (value, expected) => value && typeof value === "object" && !Array.isArray(value) &&
  same(Object.keys(value).sort(), [...expected].sort());
export const presence = (row, key) => Object.hasOwn(row, key) ? { present: true, sha256: sha(stable(row[key])) } : { present: false };
export const differences = (before, after) => [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()
  .filter(key => !same(presence(before, key), presence(after, key)))
  .map(field => ({ field, before: presence(before, field), after: presence(after, field) }));

export function safePath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || /[\\\x00-\x1f]/.test(relative) ||
      relative.split("/").some(part => !part || part === "." || part === "..")) fail("unsafe path");
  const full = path.resolve(root, relative);
  for (let current = full; current !== path.resolve(root); current = path.dirname(current))
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) fail("symlink path");
  return full;
}
function gitFile(ctx, commit, relative) {
  safePath(ctx.root, relative);
  if (!SHA1.test(commit || "")) fail("exact immutable commit required");
  const key = stable(["original-problem-ui-git-v1", ctx.root, commit, relative]);
  if (!ctx.cache.has(key)) {
    try {
      const options = { cwd: ctx.root, maxBuffer: 128 * 1024 * 1024, env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" }, stdio: ["ignore", "pipe", "pipe"] };
      if (execFileSync("git", ["rev-parse", "--verify", `${commit}^{commit}`], options).toString().trim() !== commit)
        fail("exact immutable commit required");
      const entry = execFileSync("git", ["ls-tree", "-z", commit, "--", relative], options).toString();
      const match = entry.match(/^100644 blob ([a-f0-9]{40})\t[^\0]+\0$/u);
      if (!match) fail("regular immutable blob required");
      const bytes = execFileSync("git", ["cat-file", "blob", match[1]], options);
      if (blob(bytes) !== match[1]) fail("immutable Git blob changed");
      ctx.cache.set(key, { bytes, commit, path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes) });
    } catch { fail("immutable source, asset or witness unavailable"); }
  }
  return ctx.cache.get(key);
}

export const REF_KEYS = Object.freeze(["commit", "path", "gitBlobSha1", "sha256", "bytes"]);
export const fullRef = value => Object.fromEntries(REF_KEYS.map(key => [key, value[key]]));
export const bytesRef = value => Object.fromEntries(["path", "gitBlobSha1", "sha256", "bytes"].map(key => [key, value[key]]));
export const evidenceRef = value => ({ path: value.path, sha256: value.sha256 });
export const need = (value, message) => { if (!value) fail(message); };
export const one = (rows, predicate, message) => {
  const matches = Array.isArray(rows) ? rows.filter(predicate) : [];
  need(matches.length === 1, message); return matches[0];
};
export function createExactProblemEvidenceIO({ root, cache = new Map() }) {
  need(text(root) && cache instanceof Map, "root and cache required");
  const ctx = { root, cache };
  const file = (commit, relative) => {
    const value = gitFile(ctx, commit, relative);
    return { bytes: value.bytes, ref: { commit, path: relative, gitBlobSha1: value.gitBlobSha1, sha256: value.sha256, bytes: value.bytes.length } };
  };
  const readRef = ref => {
    need(keys(ref, REF_KEYS) && SHA1.test(ref.commit || "") && SHA1.test(ref.gitBlobSha1 || "") &&
      SHA256.test(ref.sha256 || "") && Number.isSafeInteger(ref.bytes) && ref.bytes > 0, "complete immutable input reference required");
    const value = file(ref.commit, ref.path);
    need(same(value.ref, ref), "immutable input bytes changed: " + ref.path); return value.bytes;
  };
  const readLiveRef = ref => {
    readRef(ref); let raw;
    try {
      const relative = safePath(root, ref.path);
      need(fs.lstatSync(relative).isFile(), "live regular file required");
      raw = fs.readFileSync(relative);
    } catch { fail("live input missing: " + ref.path); }
    need(raw.length === ref.bytes && sha(raw) === ref.sha256 && blob(raw) === ref.gitBlobSha1, "live input bytes changed: " + ref.path);
    return raw;
  };
  return { gitFile: file, readRef, readLiveRef };
}
export function boundJson({ ref, readRef, readLiveRef, evidenceLists, argument }) {
  need(typeof readRef === "function" && typeof readLiveRef === "function" &&
    Array.isArray(evidenceLists) && evidenceLists.length > 0, "immutable/live readers and evidence lists required");
  for (const refs of evidenceLists)
    need(Array.isArray(refs) && refs.filter(value => same(value, evidenceRef(ref))).length === 1, "exact witness must bind every evidence list once");
  const raw = readRef(ref); readLiveRef(ref);
  need(Buffer.isBuffer(raw) && raw.length === ref.bytes && sha(raw) === ref.sha256 && blob(raw) === ref.gitBlobSha1, "bound JSON bytes changed");
  let value; try { value = JSON.parse(raw); } catch { fail("bound JSON invalid"); }
  if (argument !== undefined) need(same(value, argument), "bound JSON argument changed");
  return value;
}
function uiDocument(readRef, ref, argument) {
  const raw = readRef(ref);
  need(Buffer.isBuffer(raw) && raw.length === ref.bytes && sha(raw) === ref.sha256 && blob(raw) === ref.gitBlobSha1, "immutable UI document bytes changed");
  const value = JSON.parse(raw);
  if (argument !== undefined) need(same(value, argument), "immutable UI document argument changed");
  return value;
}

export function validateOriginalProblemScrollTileEvidence(result, review, itemKey) {
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

export function validateExactOriginalProblemUiEvidence({ profile, technical, visual, technicalRef, visualRef, questionUid, sourceOrdinal,
  currentSource, currentAsset, readRef, readLiveRef }) {
  need(profile?.schemaVersion === "archive-closed-original-problem-ui-profile-v1" && Array.isArray(profile.items) &&
    profile.items.length > 0 && profile.items.length === profile.counts?.items &&
    new Set(profile.items.map(item => item.questionUid)).size === profile.items.length, "caller-owned closed UI profile required");
  const ITEMS = profile.items, PRODUCER = profile.producerCommit, TECHNICAL = profile.technicalRef,
    VISUAL = profile.visualRef, MANIFEST = profile.manifestRef, COUNT = profile.counts;
  const subject = ITEMS.find(item => item.questionUid === questionUid && item.sourceOrdinal === sourceOrdinal);
  need(subject && typeof readRef === "function" && typeof readLiveRef === "function", "exact original profile subject and immutable/live readers required");
  need(same(technicalRef, evidenceRef(TECHNICAL)) && same(visualRef, evidenceRef(VISUAL)),
    "exact published original profile UI references required");
  need(keys(currentSource, ["path", "gitBlobSha1", "sha256", "bytes"]) &&
    keys(currentAsset, ["path", "gitBlobSha1", "sha256", "bytes"]), "complete current original profile source and asset bytes required");
  const t = uiDocument(readRef, TECHNICAL, technical), v = uiDocument(readRef, VISUAL, visual);
  const manifest = uiDocument(readRef, MANIFEST);
  need(t.schemaVersion === profile.technicalSchema && t.checkoutCommit === PRODUCER &&
    same(t.checkout, { expectedCheckoutCommit: PRODUCER, actualCheckoutCommit: PRODUCER, githubEventCommit: PRODUCER }) &&
    t.executionOwner === "GITHUB_ACTIONS_SUPPORTED_CHROME" && t.status === "TECHNICAL_PASS_VISUAL_REVIEW_PENDING" &&
    t.mode === "exam" && t.studentReview === true && t.problemOnlyScreenshots === true && t.sourceOverlay === false &&
    t.sourceOverlayCount === 0 && t.sourceWrites === 0 && t.solutionsOpened === false && t.newParentApprovals === 0 &&
    t.newNativeApprovals === 0 && t.newFullMathematicalQa === false && t.newMetadataApprovals === 0 &&
    t.newDifficultyJudgments === 0 && t.newReviewPassCount === 0 && t.newFourSlotApprovals === 0 &&
    t.expectedLogicalCases === COUNT.logicalCases && t.completedLogicalCases === COUNT.logicalCases && t.items.length === COUNT.items && t.results.length === COUNT.logicalCases &&
    t.screenshotArtifactCount === COUNT.pngs && t.screenshotArtifacts.length === COUNT.pngs && t.failures.length === 0 && t.externalFontResources.length === 0,
    "closed original profile closed actual UI required");
  need(v.schemaVersion === profile.visualSchema && v.scope === profile.visualScope &&
    v.decision === "APPROVE_EXACT_STUDENT_UI" && v.actualRunId === profile.runId && v.actualJobId === profile.jobId &&
    v.checkoutCommit === PRODUCER && v.technicalSha256 === TECHNICAL.sha256 &&
    v.reviewer === profile.reviewer && v.producerOwner === profile.producerOwner && v.reviewer !== v.producerOwner && v.records.length === COUNT.logicalCases &&
    v.logicalCases === COUNT.logicalCases && v.originalPngsDirectlyViewed === COUNT.pngs && v.sourceWrites === 0 && v.newMathematicalQa === false &&
    v.newNativeApprovals === 0 && v.newMetadataApprovals === 0 && v.newDifficultyJudgments === 0 && v.newReview2Claims === 0 &&
    v.mainRegistrationPerformed === false, "independent observation of the exact closed cases and original PNGs required");
  for (const key of ["manifestRef", "checkerRef", "captureHelperRef", "identityRef", "fontLicenseRef"]) {
    need(keys(t[key], REF_KEYS) && t[key].commit === PRODUCER, "original profile actual checkout reference required"); readRef(t[key]);
    if (key === "identityRef") readLiveRef(t[key]);
  }
  need(same(t.manifestRef, MANIFEST) && manifest.items.length === COUNT.items, "original profile capture manifest changed");
  for (const refs of [t.surfaceRefs, t.originalFirstBasisRefs, t.mirroredAssets]) for (const ref of refs) {
    need(keys(ref, REF_KEYS) && ref.commit === PRODUCER, "original profile immutable capture input changed"); readRef(ref);
  }
  // The caller must provide exact live metadata/identity projection validation.
  // There is no global MD exemption here. Complete sources are checked below.
  const dynamic = new Set(t.items.map(item => item.sourceRef.path));
  need(t.servedFiles.length === COUNT.servedFiles && new Set(t.servedFiles.map(ref => ref.path)).size === COUNT.servedFiles, "original profile served inventory changed");
  for (const ref of t.servedFiles) {
    need(keys(ref, REF_KEYS) && ref.commit === PRODUCER, "original profile served checkout changed");
    readRef(ref); if (!dynamic.has(ref.path)) readLiveRef(ref);
  }
  const fonts = new Map();
  need(t.fontTransport === "EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS" && t.studentFontResources.length === COUNT.fonts,
    "exact original profile student font transport required");
  for (const font of t.studentFontResources) {
    need(font.commit === PRODUCER && font.status === 200 && ["FONT", "STYLESHEET"].includes(font.kind) &&
      SHA256.test(font.resourceId || "") && !fonts.has(font.resourceId), "original profile font inventory changed");
    fonts.set(font.resourceId, font); readRef(fullRef(font)); readLiveRef(fullRef(font));
  }
  const inventories = [];
  for (const item of ITEMS) {
    const im = one(t.items, row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal, "original profile UI item mismatch");
    need(im.key === item.key && im.expectedBankCount === item.expectedBankCount && im.imageBinding === "QUESTION_IMAGE" &&
      im.expectedLayoutTag === item.expectedLayoutTag && im.expectedChoiceCount === item.expectedChoiceCount &&
      im.expectedImageWidth === item.expectedImageWidth && im.expectedImageHeight === item.expectedImageHeight, "original profile item display binding changed");
    for (const viewport of [{ name: "desktop", width: 1365, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
      const result = one(t.results, row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal &&
        row.viewport?.name === viewport.name, "original profile actual case mismatch");
      const review = one(v.records, row => row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal &&
        row.viewport === viewport.name, "original profile independent case mismatch");
      const state = result.technical, font = state.fontReadiness, roles = result.legacyRoleFrame;
      need(result.key === im.key && result.status === "PASS" && result.visualReview === "PENDING" && same(result.viewport, viewport) &&
        same(result.sourceRef, im.sourceRef) && same(result.assetRef, im.assetRef) && result.sourceRef.commit === PRODUCER &&
        result.assetRef.commit === PRODUCER, "original profile screenshot source or asset binding changed");
      need(state.mode === "exam" && state.questions === item.expectedBankCount && state.pages === item.expectedPages && state.readiness === "RENDER_READY" &&
        state.imagesComplete === true && state.mathErrors === 0 && state.unrenderedMath === 0 && state.mathJaxSource === "local" &&
        state.solutionNodes === 0 && font.status === "loaded" && font.family === "Nanum Myeongjo" &&
        same(font.weights.map(value => value.weight), [400, 700, 800]) && font.weights.every(value =>
          Number.isInteger(value.loadedFaces) && value.loadedFaces > 0 && value.allLoaded === true && value.checked === true) &&
        font.problemFontFamilies.length > 0 && font.problemFontFamilies.every(value => value.includes("Nanum Myeongjo")) &&
        state.fontResourceIds.length > 0 && new Set(state.fontResourceIds).size === state.fontResourceIds.length &&
        state.fontResourceIds.every(id => fonts.has(id)) && state.fontResourceIds.some(id => fonts.get(id).kind === "STYLESHEET") &&
        state.fontResourceIds.some(id => fonts.get(id).kind === "FONT"), "original profile exact student readiness required");
      need(result.geometry.imageInsideQuestion === true && result.geometry.naturalWidth === im.expectedImageWidth &&
        result.geometry.naturalHeight === im.expectedImageHeight && Number(String(result.geometry.questionNumber).match(/^\d+/)?.[0]) === item.sourceOrdinal &&
        [result.pageErrors, result.requestFailures, result.externalRequests].every(rows => Array.isArray(rows) && rows.length === 0),
        "original profile geometry or request failures changed");
      const choices = item.expectedChoiceCount > 0;
      need(keys(roles, ["schemaVersion", "sourceOrdinal", "directChildRoles", "imageCount", "choiceCount", "visibleRequiredRoles", "responseSpace", "domWrites", "cssWrites"]) &&
        roles.schemaVersion === profile.rolesSchema && roles.sourceOrdinal === item.sourceOrdinal &&
        same(roles.directChildRoles, ["q-num", "q-content", "q-image-wrap", choices ? "choices" : "answer-box"]) &&
        roles.imageCount === 1 && roles.choiceCount === item.expectedChoiceCount && roles.visibleRequiredRoles === (choices ? 4 : 3) &&
        result.capture.visibleChildren === (choices || viewport.name === "desktop" ? 4 : 3) && roles.responseSpace === (choices ? "NOT_APPLICABLE" : "EMPTY_ORIGINAL_ANSWER_BOX") &&
        roles.domWrites === 0 && roles.cssWrites === 0, "exact original profile legacy problem roles required");
      readRef(result.sourceRef); readRef(result.assetRef);
      const screenshots = validateOriginalProblemScrollTileEvidence(result, review, im.key);
      inventories.push({ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name, screenshots });
    }
    readLiveRef(im.sourceRef); readLiveRef(im.assetRef);
  }
  const sorted = rows => rows.slice().sort((a, b) => a.path.localeCompare(b.path, "en"));
  const screenshots = inventories.flatMap(row => row.screenshots.map(({ tileIndex, ...ref }) => ref));
  need(screenshots.length === COUNT.pngs && new Set(screenshots.map(row => row.path)).size === COUNT.pngs &&
    same(sorted(screenshots), sorted(t.screenshotArtifacts)), "original profile complete original PNG inventory required");
  const selected = one(t.items, item => item.questionUid === questionUid && item.sourceOrdinal === sourceOrdinal, "selected original profile UI item missing");
  need(same(currentSource, bytesRef(selected.sourceRef)) && same(currentAsset, bytesRef(selected.assetRef)),
    "current original profile complete source or renderer differs from actual UI");
  readLiveRef(selected.sourceRef); readLiveRef(selected.assetRef);
  return { technicalRef, visualRef, checkoutCommit: PRODUCER, independentReviewer: v.reviewer, actualRunId: profile.runId, actualJobId: profile.jobId, logicalCases: COUNT.logicalCases,
    screenshotArtifactCount: COUNT.pngs, screenshots: inventories, selectedLogicalCases: 2,
    selectedOriginalTiles: inventories.filter(row => row.questionUid === questionUid).reduce((n, row) => n + row.screenshots.length, 0) };
}
