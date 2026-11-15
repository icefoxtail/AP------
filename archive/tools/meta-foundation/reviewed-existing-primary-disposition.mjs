import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { questionAssetReferences } from "../archive-content-inputs.mjs";

const fail = message => { throw new Error(`existing primary disposition: ${message}`); };
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const text = value => typeof value === "string" && value.trim().length > 0;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const equal = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const TAXONOMY = "archive/data/meta-foundation/compiled/taxonomy_registry.json";
const BINDINGS = "archive/data/meta-foundation/compiled/curriculum_bindings.json";
const KEYS = ["problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys"];
const exactKeys = (value, keys) => value && typeof value === "object" && !Array.isArray(value) &&
  equal(Object.keys(value).sort(), [...keys].sort());

function safePath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes("\\") || /[\x00-\x1f]/.test(relative) ||
      relative.split("/").some(part => !part || part === "." || part === "..")) fail("unsafe evidence path");
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink evidence path");
  return full;
}
function git(ctx, ...args) {
  try { return execFileSync("git", args, { cwd: ctx.root, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }); }
  catch { fail("exact immutable Git evidence unavailable"); }
}
function gitFile(ctx, commit, relative) {
  safePath(ctx.root, relative);
  if (!SHA1.test(commit || "")) fail("exact commit required");
  const key = stable(["existing-primary-git", ctx.root, commit, relative]);
  if (!ctx.cache.has(key)) {
    if (git(ctx, "rev-parse", "--verify", `${commit}^{commit}`).toString().trim() !== commit) fail("exact commit required");
    const blob = git(ctx, "rev-parse", `${commit}:${relative}`).toString().trim(), bytes = git(ctx, "cat-file", "blob", blob);
    ctx.cache.set(key, { commit, path: relative, blob, sha256: sha(bytes), bytes });
  }
  return ctx.cache.get(key);
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail("invalid JSON evidence"); } }
function boundFile(ctx, ref, expectedPath) {
  if (!ref || ref.path !== expectedPath || !SHA1.test(ref.blob || "") || !SHA256.test(ref.sha256 || ""))
    fail("exact immutable file reference required");
  const file = gitFile(ctx, ref.commit, ref.path);
  if (file.blob !== ref.blob || file.sha256 !== ref.sha256) fail("immutable file blob or raw SHA mismatch");
  return file;
}
function references(root, question) {
  const result = new Set(), add = value => {
    if (typeof value !== "string" || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail("unsupported renderer reference");
    const relative = value.startsWith("archive/") ? value : `archive/${value}`;safePath(root, relative);result.add(relative);
  };
  const walk = value => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) { value.forEach(walk);return; }
    if (typeof value === "string") { add(value);return; }
    fail("unsupported renderer object");
  };
  for (const key of ["image", "images", "solutionImage", "solutionImages"]) walk(question[key]);
  if (question.figureSvg || question.solutionFigureSvg) fail("inline renderer needs a separate contract");
  const html = value => {
    if (Array.isArray(value)) { value.forEach(html);return; }
    if (value && typeof value === "object") { Object.values(value).forEach(html);return; }
    if (typeof value !== "string") return;
    if (/<(?:svg|object|iframe|image)\b|(?:srcset|style)\s*=|url\s*\(/i.test(value)) fail("unsupported inline renderer dependency");
    for (const tag of value.matchAll(/<img\b[^>]*>/gi)) {
      const match = tag[0].match(/\bsrc\s*=\s*(["'])([^"']+)\1/i);if (!match) fail("image source missing");add(match[2]);
    }
  };
  // The independent witness binds each whole question, including choice HTML
  // and nested shared material. Keep the same strict reference policy for all
  // of it, and use the production source extractor for nested image fields.
  html(question);
  questionAssetReferences(question).forEach(add);
  return [...result].sort();
}
function inspectAssets(ctx, app, current) {
  const paths = references(ctx.root, current.question), assets = app.rendererAssets;
  if (!Array.isArray(assets) || new Set(assets.map(row => row.path)).size !== assets.length ||
      !equal(assets.map(row => row.path).sort(), paths)) fail("complete exact renderer inventory required");
  if (!paths.length && app.rendererReview !== "TEXT_ONLY_NO_REFERENCED_ASSETS" || paths.length && !text(app.rendererReview))
    fail("explicit renderer inspection required");
  const bindings = [];
  for (const row of assets) {
    if (row.visuallyInspected !== true || !SHA1.test(row.gitBlobSha1 || "") || !SHA256.test(row.sha256 || ""))
      fail("each renderer asset requires a visually inspected exact blob and SHA");
    for (const commit of [ctx.native.review.baseSha, ctx.native.spec.reviewCommit, current.file.commit]) {
      const file = gitFile(ctx, commit, row.path);
      if (file.blob !== row.gitBlobSha1 || file.sha256 !== row.sha256) fail("renderer bytes changed from an immutable reviewed source");
    }
    const bytes = fs.readFileSync(safePath(ctx.root, row.path));
    if (sha(bytes) !== row.sha256) fail("current renderer bytes drifted");
    if (/\.svg$/i.test(row.path)) {
      const svg = bytes.toString("utf8");
      if (/<(?:script|foreignObject|style)\b|<!ENTITY|@import|\b(?:on\w+)\s*=/i.test(svg) ||
          [...svg.matchAll(/(?:href|xlink:href)\s*=\s*(["'])(.*?)\1/gi)].some(match => !match[2].startsWith("#")) ||
          [...svg.matchAll(/url\s*\(\s*['"]?([^)'"\s]+)/gi)].some(match => !match[1].startsWith("#")))
        fail("SVG dependency is outside the exact renderer inventory");
    }
    bindings.push({ path: row.path, gitBlobSha1: row.gitBlobSha1, sha256: row.sha256 });
  }
  return bindings;
}

// This independent disposition never edits or reinterprets the original native
// null/different match. It proves the selected existing pair separately.
export function validateExistingPrimaryDisposition(ctx) {
  const spec = ctx.patch.sourceReview?.retainedFields?.independentPrimary;
  if (spec === undefined) return null;
  if (!exactKeys(spec, ["schemaVersion", "reviewCommit", "reviewRef"]) ||
      spec.schemaVersion !== "archive-reviewed-existing-primary-disposition-v1" ||
      !exactKeys(spec.reviewRef, ["path", "sha256"]) || !SHA256.test(spec.reviewRef.sha256 || ""))
    fail("explicit exact independent review reference required");
  const { request, patch, native, row, question, final, studentPayload, studentFields, bankFromBytes } = ctx;
  for (const refs of [request.approval.evidenceRefs, patch.evidenceRefs])
    if (!refs?.some(ref => equal(ref, spec.reviewRef))) fail("independent review must bind both evidence lists");
  const local = fs.readFileSync(safePath(ctx.root, spec.reviewRef.path)), file = gitFile(ctx, spec.reviewCommit, spec.reviewRef.path);
  if (sha(local) !== spec.reviewRef.sha256 || file.sha256 !== spec.reviewRef.sha256) fail("independent review differs from local or immutable Git bytes");
  const doc = parse(file.bytes);
  if (doc.schemaVersion !== "archive-independent-existing-primary-disposition-v1" || doc.scope !== "EXISTING_PRIMARY_RETENTION_ONLY" ||
      !text(doc.reviewerRole) || !text(doc.reviewerOwner) || doc.reviewerOwner === native.reviewer ||
      doc.sourceWrites !== 0 || doc.canonicalWrites !== 0 || doc.newDefinitions !== 0 ||
      doc.newMathematicalQa !== false || doc.newReview2 !== false || doc.newDifficultyApproval !== false ||
      doc.officialRegistrationRequired !== true || doc.actualMainRegistered !== false || !Array.isArray(doc.applications))
    fail("independent review scope is missing or overbroad");
  const apps = doc.applications.filter(app => app.questionUid === patch.questionUid);
  if (apps.length !== 1 || apps[0].sourceOrdinal !== patch.sourceOrdinal) fail("independent UID or ordinal is missing or ambiguous");
  const app = apps[0];
  if (!equal(app.nativeReviewRef, { commit: native.spec.reviewCommit, path: native.spec.reviewPath, sha256: native.spec.reviewRef.sha256 }) ||
      app.nativeItemStableSha256 !== sha(stable(row)) || app.nativeAfterSha256 !== sha(stable(row.after)) ||
      app.nativeActiveDefinitionMatchSha256 !== sha(stable(row.activeDefinitionMatch ?? null)) ||
      !text(app.nativeActiveDefinitionMatchDisposition) || app.originalNativeAfterPreserved !== true ||
      app.sourcePayloadChangeApproved !== false || app.newMathematicalQa !== false || app.newReview2 !== false ||
      app.newDifficultyApproval !== false || app.decision !== "APPROVED_EXISTING_PRIMARY" || !text(app.rationale))
    fail("independent disposition must preserve the exact original native item and approve only this existing primary");
  const ordinal = patch.sourceOrdinal, sourcePath = `archive/exams/${request.sourceArchiveFile}`,
    before = native.reviewedBank[ordinal - 1], reviewed = native.committedBank[ordinal - 1];
  const beforeRef = app.immutableSourceBefore, beforeCore = beforeRef && Object.fromEntries(
    ["blob", "sha256", "questionStableSha256"].map(key => [key, beforeRef[key]]));
  if ((!exactKeys(beforeRef, ["blob", "sha256", "questionStableSha256"]) &&
       !exactKeys(beforeRef, ["commit", "path", "blob", "sha256", "questionStableSha256"])) ||
      !equal(beforeCore, { blob: native.sourceBlob, sha256: native.sourceSha256, questionStableSha256: sha(stable(before)) }))
    fail("original native source binding mismatch");
  if (Object.hasOwn(beforeRef, "commit") && (beforeRef.commit !== native.review.baseSha ||
      boundFile(ctx, beforeRef, sourcePath).blob !== native.sourceBlob)) fail("original native source commit or path mismatch");
  const reviewedFile = boundFile(ctx, app.immutableReviewedSource, sourcePath);
  if (reviewedFile.commit !== native.spec.reviewCommit || reviewedFile.blob !== native.committedBlob ||
      app.immutableReviewedSource.questionStableSha256 !== sha(stable(reviewed))) fail("native review-commit source binding mismatch");
  const currentFile = boundFile(ctx, app.currentSource, sourcePath), bank = bankFromBytes(currentFile.bytes), currentQuestion = bank[ordinal - 1];
  if (currentFile.commit !== doc.canonicalSnapshotCommit || bank.length !== request.expectedQuestionCount ||
      !currentQuestion || app.currentSource.questionStableSha256 !== sha(stable(currentQuestion))) fail("independent current source snapshot mismatch");
  if (!equal(app.studentPayloadFields, studentFields) || [before, reviewed, currentQuestion, question].some(q =>
      sha(stable(studentPayload(q))) !== app.studentPayloadSha256)) fail("independent review cannot authorize a changed student payload");
  const scopeTransport = {}, expected = { curriculum: final.curriculum, curriculumKey: final.curriculumKey, courseKey: final.courseKey };
  for (const key of new Set([...Object.keys(currentQuestion), ...Object.keys(question)])) {
    if (equal(currentQuestion[key], question[key])) continue;
    if (!Object.hasOwn(expected, key) || Object.hasOwn(currentQuestion, key) || !text(expected[key]) || !equal(question[key], expected[key]))
      fail("current question differs from the independent snapshot outside absent exact native scope transport");
    scopeTransport[key] = question[key];
  }
  const taxonomy = boundFile(ctx, app.canonicalRefs?.taxonomy, TAXONOMY), bindingsFile = boundFile(ctx, app.canonicalRefs?.bindings, BINDINGS);
  if (taxonomy.commit !== doc.canonicalSnapshotCommit || bindingsFile.commit !== doc.canonicalSnapshotCommit)
    fail("canonical references must name the reviewed current snapshot");
  const tax = parse(taxonomy.bytes), oldBindings = parse(bindingsFile.bytes).bindings, primary = app.existingPrimary,
    pt = ctx.canonicalBefore.pt.get(final.problemTypeKey), tpl = ctx.canonicalBefore.tpl.get(final.templateKey);
  const p = tax.problemTypes?.filter(value => value.problemTypeKey === final.problemTypeKey),
    t = tax.templates?.filter(value => value.templateKey === final.templateKey);
  const context = { curriculum: final.curriculumKey || final.curriculum, standardCourse: final.standardCourse,
    standardUnitKey: final.standardUnitKey, subUnitKey: final.subUnitKey, problemTypeKey: final.problemTypeKey, status: "ACTIVE" };
  const matching = values => values.filter(value => Object.entries(context).every(([key, v]) => equal(value[key], v)));
  const b = Array.isArray(oldBindings) ? matching(oldBindings) : [], currentBindings = matching([...ctx.canonicalBefore.bindings.values()]);
  if (p?.length !== 1 || t?.length !== 1 || b.length !== 1 || currentBindings.length !== 1 ||
      !equal(p[0], pt) || !equal(t[0], tpl) || !equal(b[0], currentBindings[0]) ||
      primary?.problemTypeKey !== final.problemTypeKey || primary.templateKey !== final.templateKey ||
      primary.problemTypeRecordSha256 !== sha(stable(pt)) || primary.templateRecordSha256 !== sha(stable(tpl)) ||
      primary.bindingRecordSha256 !== sha(stable(b[0])) ||
      !equal(primary.exactBinding, { ...context, ownerPack: b[0].ownerPack }))
    fail("independent existing primary or binding differs from unchanged current canonical records");
  for (const [key, value] of [["uidExplicitlySupportedByProblemType", pt], ["uidExplicitlySupportedByTemplate", tpl], ["uidExplicitlySupportedByBinding", b[0]]])
    if (primary[key] !== Boolean(value.supportingQuestionUids?.includes(patch.questionUid))) fail("supporting UID provenance was altered");
  const allowed = app.allowedRetentionFields;
  if (!Array.isArray(allowed) || new Set(allowed).size !== allowed.length || !KEYS.slice(0, 2).every(key => allowed.includes(key)) ||
      allowed.some(key => !KEYS.includes(key)) || !exactKeys(app.approvedValues, allowed)) fail("exact narrow primary retention fields required");
  for (const key of allowed) {
    if (!equal(app.approvedValues[key], final[key]) || !equal(app.approvedValues[key], question[key]) ||
        !Object.hasOwn(patch.after, key) || !equal(app.approvedValues[key], patch.after[key]) ||
        !equal(before[key], app.approvedValues[key]) || !equal(reviewed[key], app.approvedValues[key]) ||
        KEYS.slice(2).includes(key) && (!Array.isArray(app.approvedValues[key]) || app.approvedValues[key].length))
      fail("independent disposition may retain only its exact existing pair and reviewed empty auxiliary sets");
  }
  const rendererAssets = inspectAssets(ctx, app, { file: currentFile, question: currentQuestion });
  return { schemaVersion: spec.schemaVersion, reviewCommit: spec.reviewCommit, reviewRef: spec.reviewRef,
    reviewerRole: doc.reviewerRole, reviewerOwner: doc.reviewerOwner, questionUid: patch.questionUid, sourceOrdinal: ordinal,
    applicationSha256: sha(stable(app)), originalNativeMatchPreserved: true, originalNativeAfterPreserved: true,
    canonicalSnapshotCommit: doc.canonicalSnapshotCommit, currentSource: app.currentSource, scopeTransport,
    problemTypeDefinitionSha256: sha(stable(pt)), templateDefinitionSha256: sha(stable(tpl)), exactBindingSha256: sha(stable(b[0])),
    rendererAssets, newDefinitions: false, newMathematicalQa: false, newReview2: false, newDifficultyApproval: false };
}
