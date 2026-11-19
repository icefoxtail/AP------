// Fingerprint continuation of an existing basic approval. An immutable native
// source review and a separate explicit primary HOLD do not approve that primary.
import fs from "node:fs";
import { META_FILE, questionMetadataBytesAt } from "./question-metadata-format.mjs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { prepareBasicHeldRendererContinuity } from "./basic-held-renderer-continuity.mjs";

const canonical = createRequire(import.meta.url)("../../archive2-canonical.js");
export const NATIVE_BASIC_HOLD_SCHEMA = "archive-basic-native-source-hold-preservation-v1";
export const NATIVE_BASIC_HOLD_REVIEW_SCHEMA = "archive-basic-native-source-hold-review-v1";
export const NATIVE_BASIC_HOLD_REASON = "MULTI_L4_SEMANTIC_SPAN_NO_UNIQUE_PRIMARY";
const META = "archive/data/question_metadata.json", IDENTITY = "archive/data/question_identity_map.json";
const EVIDENCE = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const PARENT = ["grade", "curriculumKey", "courseKey", "L1", "L2"];
const STUDENT = ["id", "number", "sourceQuestionNo", "sourceQid", "sourceOrdinal", "questionUid", "questionType", "content", "question", "choices", "answer", "solution", "image", "images", "figureSvg", "solutionImage", "solutionImages", "solutionFigureSvg", "layoutTag", "wide", "imageSize", "solutionImageAlt", "solutionImageCaption", "solutionImageSize", "score"];
const BODY = ["id", "number", "sourceQuestionNo", "sourceQid", "sourceOrdinal", "questionUid", "questionType", "content", "question", "choices", "answer", "image", "images", "figureSvg", "score"];
const BASIC = ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"];
const cache = new Map(), gitCache = new Map();
const fail = message => { throw Error("NATIVE_BASIC_HOLD: " + message); };
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const hash = value => sha(stable(value) ?? "undefined");
const eq = (a, b) => stable(a) === stable(b);
const pick = (value, fields) => Object.fromEntries(fields.map(field => [field, value[field] ?? null]));
const omit = (value, fields) => Object.fromEntries(Object.entries(value).filter(([field]) => !fields.includes(field)));
const protectedMetadata = value => omit(value, ["sourceFingerprint", "contentFingerprint"]);
const protectedIdentity = value => omit(value, ["sourceFingerprint"]);
const text = value => typeof value === "string" && Boolean(value.trim());
const fingerprints = q => ({
  sourceFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null })),
  contentFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null })),
});
function safe(relative) {
  if (!text(relative) || /[\\\r\n\0]/.test(relative) || path.isAbsolute(relative) || relative.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe path");
  return relative;
}
function local(root, relative) {
  const full = path.resolve(root, safe(relative));
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink input");
  return full;
}
function requireCommit(root, commit) {
  if (!/^[a-f0-9]{40}$/.test(commit || "")) fail("immutable commit required");
  try {
    if (execFileSync("git", ["rev-parse", "--verify", `${commit}^{commit}`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() !== commit) fail("immutable commit mismatch");
  } catch { fail("immutable commit unavailable"); }
}
function gitBytes(root, commit, relative) {
  safe(relative); requireCommit(root, commit);
  if (relative === META_FILE) return questionMetadataBytesAt(root, commit);
  const key = path.resolve(root) + "\0" + commit + "\0" + relative;
  if (gitCache.has(key)) return gitCache.get(key);
  let bytes;
  try {
    const record = execFileSync("git", ["ls-tree", "-z", commit, "--", relative], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    if (!record.startsWith("100644 blob ") || record.split("\0").filter(Boolean).length !== 1) fail("immutable regular file required");
    bytes = execFileSync("git", ["show", `${commit}:${relative}`], { cwd: root, maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  } catch { fail(`immutable input unavailable: ${commit}:${relative}`); }
  gitCache.set(key, bytes); return bytes;
}
function bank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const rows = ctx.window.questionBank || ctx.window.questions;
  if (!Array.isArray(rows)) fail("immutable source bank missing");
  return JSON.parse(JSON.stringify(rows));
}
function one(rows, uid, source, ordinal, name) {
  const selected = rows.filter(row => row.questionUid === uid);
  if (selected.length !== 1 || (selected[0].sourceArchiveFile ?? selected[0].sourceFile) !== source || selected[0].sourceOrdinal !== ordinal) fail(`${name} UID/source/ordinal mismatch`);
  return selected[0];
}

// The historical approval is resolved through the production canonical loader,
// including all manifest-bound runtime and receipt inputs, before it is reused.
function priorBundle(root, commit) {
  const key = path.resolve(root) + "\0" + commit;
  if (cache.has(key)) return cache.get(key);
  requireCommit(root, commit);
  const inputPath = rel => rel === canonical.CANONICAL_MASTER_PATH ? path.posix.normalize(`archive/${rel}`) : `archive/${safe(rel)}`;
  const read = rel => gitBytes(root, commit, inputPath(rel)).toString("utf8");
  const manifest = JSON.parse(read("data/archive2-canonical-input-manifest.json"));
  if (manifest.schemaVersion !== "archive2-canonical-input-manifest-v1" || manifest.resolverVersion !== canonical.RESOLVER_VERSION || !Array.isArray(manifest.files)) fail("prior canonical resolver/manifest mismatch");
  const version = "archive2-canonical-v1:" + sha(canonical.projectionManifestPayload(manifest.files, canonical.RESOLVER_VERSION));
  if (version !== manifest.projectionVersion) fail("prior canonical manifest digest mismatch");
  const files = Object.fromEntries(manifest.files.map(row => { inputPath(row.path); return [row.path, { sha256: row.sha256.toLowerCase() }]; }));
  if (new Set(manifest.files.map(row => row.path)).size !== manifest.files.length || canonical.MANIFEST_REQUIRED_PATHS.some(p => !files[p])) fail("prior canonical manifest incomplete/ambiguous");
  const resources = {}, runtimePaths = canonical.runtimeInputPathsFromManifest(manifest.files);
  const load = rel => {
    if (!files[rel]) fail(`prior canonical input not bound: ${rel}`);
    const raw = read(rel).replace(/\r\n/g, "\n");
    if (sha(raw) !== files[rel].sha256) fail(`prior canonical input digest mismatch: ${rel}`);
    resources[rel] = JSON.parse(raw);
  };
  for (const rel of new Set([...canonical.REQUIRED_INPUT_PATHS, ...runtimePaths])) load(rel);
  for (const rel of canonical.reviewedRegistrationProofPaths(runtimePaths.map(p => resources[p]))) load(rel);
  const required = canonical.manifestInputPathsFromRuntimePacks(runtimePaths.map(p => resources[p]), p => Boolean(files[p]), runtimePaths);
  if (required.some(p => !files[p])) fail("prior canonical generated input not bound");
  const bundle = { manifest, projectionVersion: version, files, resources, runtimeInputPaths: runtimePaths };
  const result = { catalog: canonical.resolveCatalog({ versionBundle: bundle }), bundle,
    metadata: JSON.parse(gitBytes(root, commit, META)), identity: JSON.parse(gitBytes(root, commit, IDENTITY)) };
  cache.set(key, result); return result;
}
function boundDocument(root, request, item, commit, immutablePath, ref) {
  if (!ref || !eq(Object.keys(ref).sort(), ["path", "sha256"]) || !String(ref.path).startsWith(EVIDENCE) || !/^[a-f0-9]{64}$/.test(ref.sha256 || "") ||
      !request.approval.evidenceRefs.some(r => eq(r, ref)) || !item.evidenceRefs.some(r => eq(r, ref))) fail("immutable evidence must bind approval and item");
  const raw = fs.readFileSync(local(root, ref.path)), original = gitBytes(root, commit, immutablePath);
  if (sha(raw) !== ref.sha256 || !raw.equals(original)) fail("immutable evidence bytes differ");
  return JSON.parse(raw);
}
function assetPaths(question) {
  const paths = new Set();
  const add = value => {
    if (!text(value) || /[?#&]/.test(value)) fail("unsupported asset reference");
    const rel = value.startsWith("archive/") ? value : `archive/${value}`;
    if (!rel.startsWith("archive/assets/")) fail("asset outside archive/assets");
    paths.add(safe(rel));
  };
  const external = ["image", "images", "solutionImage", "solutionImages"];
  for (const field of external) {
    const value = question[field]; if (value == null || value === "") continue;
    if (Array.isArray(value)) value.forEach(add); else add(value);
  }
  for (const field of ["figureSvg", "solutionFigureSvg"]) if (question[field] != null && question[field] !== "") fail("inline SVG is outside native basic hold preservation");
  for (const field of ["content", "question", "solution"]) {
    const html = question[field]; if (typeof html !== "string") continue;
    if (/<(?:svg|object|iframe|image)\b|\bsrcset\s*=|\bstyle\s*=|url\s*\(/i.test(html)) fail("unsupported HTML renderer dependency");
    for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
      const refs = [...tag[0].matchAll(/\bsrc\s*=\s*(["'])(.*?)\1/gi)];
      if (refs.length !== 1) fail("image must have one quoted source"); add(refs[0][2]);
    }
  }
  const rejectUnlisted = value => {
    if (typeof value === "string" && /(?:^|[\s"'=])(?:archive\/)?assets\/|data:image|<(?:img|svg|object|iframe|image)\b|\b(?:src|href|srcset|style)\s*=|url\s*\(/i.test(value)) fail("unlisted renderer field");
    if (value && typeof value === "object") Object.values(value).forEach(rejectUnlisted);
  };
  for (const [field, value] of Object.entries(question)) if (![...external, "content", "question", "solution", "figureSvg", "solutionFigureSvg"].includes(field)) rejectUnlisted(value);
  return [...paths].sort();
}
function selfContainedSvg(raw, depth = 0) {
  if (depth > 4 || raw.length > 8 * 1024 * 1024) fail("SVG dependency limit");
  const svg = raw.toString("utf8");
  if (!/<svg\b/i.test(svg) || /<(?:script|foreignObject|style)\b|<!ENTITY|<!DOCTYPE|@import|\bon\w+\s*=/i.test(svg)) fail("unsafe SVG dependency");
  const urls = [...svg.matchAll(/url\s*\(([^)]*)\)/gi)];
  if (urls.length !== [...svg.matchAll(/url\s*\(/gi)].length || urls.some(match => !/^(?:#[^\s"']+|"#[^"\s]+"|'#[^'\s]+')$/.test(match[1].trim()))) fail("unsafe SVG dependency");
  // Inspect every dependency attribute, including malformed/unquoted ones.
  // Matching only quoted attributes would silently omit an invalid declaration.
  for (const attribute of svg.matchAll(/\b(?:xlink:)?(?:href|src)\s*=/gi)) {
    const tail = svg.slice(attribute.index + attribute[0].length);
    const match = /^\s*(["'])([^"']*)\1(?=\s|\/?\>)/.exec(tail);
    if (!match) fail("unquoted or malformed SVG dependency");
    if (match[2].startsWith("#")) continue;
    const embedded = /^data:image\/svg\+xml;base64,([A-Za-z0-9+/]+={0,2})$/.exec(match[2]);
    if (!embedded || Buffer.from(embedded[1], "base64").toString("base64") !== embedded[1]) fail("external SVG dependency");
    selfContainedSvg(Buffer.from(embedded[1], "base64"), depth + 1);
  }
}
function rendererProof(root, question, application, native) {
  const expected = assetPaths(question), assets = application.rendererAssets;
  if (!Array.isArray(assets) || !eq(assets.map(a => a.path).sort(), expected) || new Set(assets.map(a => a.path)).size !== assets.length || (assets.length && !text(application.rendererReview))) fail("renderer inventory/review mismatch");
  return assets.map(asset => {
    if (asset.visuallyInspected !== true || !/^[a-f0-9]{40}$/.test(asset.gitBlobSha1 || "") || !/^[a-f0-9]{64}$/.test(asset.sha256 || "") || asset.commit !== application.currentSource.commit || asset.nativeCommit !== native.reviewCommit || asset.unchangedFromNative !== true) fail("renderer review binding missing");
    for (const commit of new Set([native.baseSha, native.reviewCommit, application.currentSource.commit])) {
      const raw = gitBytes(root, commit, asset.path);
      if (blob(raw) !== asset.gitBlobSha1 || sha(raw) !== asset.sha256 || asset.nativeGitBlobSha1 !== asset.gitBlobSha1 || asset.nativeSha256 !== asset.sha256) fail("immutable renderer bytes differ");
    }
    const raw = fs.readFileSync(local(root, asset.path));
    if (blob(raw) !== asset.gitBlobSha1 || sha(raw) !== asset.sha256) fail("current renderer bytes differ");
    if (/\.svg$/i.test(asset.path)) selfContainedSvg(raw);
    return { path: asset.path, gitBlobSha1: asset.gitBlobSha1, sha256: asset.sha256 };
  });
}
function heldRuntime(records, uid, source, ordinal) {
  const selected = records.filter(r => r.questionUid === uid);
  if (selected.length > 1) fail("ambiguous held runtime");
  if (selected.some(r => (r.sourceArchiveFile ?? r.sourceFile) !== source || r.sourceOrdinal !== ordinal || r.metadataApprovalType ||
    r.reviewStatus !== "manual_review" || r.metadataStatus !== "EXPLICIT_L4_HOLD" || r.metaFoundationStatus !== "EXPLICIT_L4_HOLD" ||
    r.metaFoundationL4Status !== "EXPLICIT_HOLD" || r.templateKey !== null || r.defaultSelectable !== false)) fail("runtime must remain an explicit unapproved L4 hold");
  return selected;
}
export function verifyNativeBasicHoldPreservation({ root, request, review, item, current, previous, row, identity, crosswalk }) {
  const spec = request.approval.sourceReview;
  const rendererClaim = Object.hasOwn(spec || {}, "rendererContinuity");
  if (!spec || spec.schemaVersion !== NATIVE_BASIC_HOLD_SCHEMA || !eq(Object.keys(spec).sort(), ["schemaVersion", "priorCommit", "nativeReviewCommit", "nativeReviewPath", "nativeReviewRef", "holdReviewCommit", "holdReviewPath", "holdReviewRef", ...(rendererClaim ? ["rendererContinuity"] : [])].sort()) ||
      request.registryChanges !== undefined || request.difficultyEvidence !== undefined || request.scope !== undefined || request.registrationMode !== undefined || request.approval.sourceRebind !== undefined ||
      !eq(Object.keys(item).sort(), ["questionUid", "sourceOrdinal", "before", "after", "basicParent", "holdReasonCode", "reason", "evidenceRefs"].sort()) || item.holdReasonCode !== NATIVE_BASIC_HOLD_REASON) fail("native hold preservation scope");
  const uid = item.questionUid, source = request.sourceArchiveFile, ordinal = item.sourceOrdinal, sourcePath = `archive/exams/${source}`;
  const renderer = rendererClaim ? prepareBasicHeldRendererContinuity({ root, request, item, current, identity }) : null;
  // Re-run the unchanged native/HOLD tests against the exact original reviewed
  // question. The helper above separately binds every live field and asset.
  const reviewedCurrent = renderer?.reviewedQuestion ?? current;
  const oldBytes = gitBytes(root, request.previousSourceCommit, sourcePath), oldBank = bank(oldBytes);
  if (blob(oldBytes) !== request.previousSourceBlobSha1 || oldBank.length !== request.expectedQuestionCount || !eq(oldBank[ordinal - 1], previous) || !eq(fingerprints(previous), item.before) || BODY.some(k => !eq(previous[k], reviewedCurrent[k]))) fail("historical approved body/answer binding mismatch");
  const native = boundDocument(root, request, item, spec.nativeReviewCommit, spec.nativeReviewPath, spec.nativeReviewRef);
  const nativeAuthor = native.judgedBy?.agent ?? native.owner;
  if (native.schemaVersion !== "m2-s2-meta-review-v1" || native.sourceArchiveFile !== source || native.reviewedQuestionCount !== request.expectedQuestionCount || !text(nativeAuthor) ||
      !Array.isArray(native.items) || native.items.length !== request.expectedQuestionCount || new Set(native.items.map(i => i.questionUid)).size !== native.items.length ||
      new Set(native.items.map(i => i.sourceOrdinal)).size !== native.items.length || native.items.some(i => !Number.isInteger(i.sourceOrdinal) || i.sourceOrdinal < 1 || i.sourceOrdinal > request.expectedQuestionCount)) fail("native review whole-bank scope mismatch");
  const nativeRows = native.items.filter(i => i.questionUid === uid), decision = nativeRows[0];
  if (nativeRows.length !== 1 || decision.sourceOrdinal !== ordinal || decision.rpmDecision !== "KEEP" || decision.evidenceScope?.sourceRead !== true || decision.evidenceScope?.solutionRead !== true ||
      !eq(decision.proposalRefs, []) || !eq(decision.contentDebt ?? [], []) || !eq(decision.registrationDebt, ["OFFICIAL_RESOLVER_RECEIPT_REQUIRED"])) fail("native source review cannot preserve this hold");
  const beforeBytes = gitBytes(root, native.baseSha, sourcePath), reviewedBytes = gitBytes(root, spec.nativeReviewCommit, sourcePath);
  const beforeBank = bank(beforeBytes), reviewedBank = bank(reviewedBytes);
  if (blob(beforeBytes) !== native.sourceGitBlobSha || beforeBank.length !== request.expectedQuestionCount || reviewedBank.length !== request.expectedQuestionCount ||
      !eq(pick(beforeBank[ordinal - 1], STUDENT), pick(reviewedCurrent, STUDENT)) || !eq(pick(reviewedBank[ordinal - 1], STUDENT), pick(reviewedCurrent, STUDENT))) fail("current student payload differs from immutable native review");
  const independent = boundDocument(root, request, item, spec.holdReviewCommit, spec.holdReviewPath, spec.holdReviewRef);
  if (independent.schemaVersion !== "archive-independent-existing-primary-disposition-v1" || independent.scope !== "EXISTING_PRIMARY_RETENTION_ONLY" ||
      !text(independent.reviewerOwner) || independent.reviewerOwner === nativeAuthor || !text(independent.reviewerRole) ||
      independent.sourceWrites !== 0 || independent.canonicalWrites !== 0 || independent.newDefinitions !== 0 || independent.newMathematicalQa !== false ||
      independent.newReview2 !== false || independent.newDifficultyApproval !== false || independent.officialRegistrationRequired !== true || independent.actualMainRegistered !== false) fail("independent hold authority/scope mismatch");
  const selected = (independent.applications || []).filter(a => a.questionUid === uid), application = selected[0];
  if (selected.length !== 1 || application.sourceOrdinal !== ordinal || application.decision !== "HOLD_CURRENT_TEMPLATE_DEFINITION_MISMATCH" ||
      !eq(application.allowedRetentionFields, []) || !eq(application.approvedValues, {}) || !eq(application.nativeReviewRef, { commit: spec.nativeReviewCommit, path: spec.nativeReviewPath, sha256: spec.nativeReviewRef.sha256 }) ||
      application.nativeItemStableSha256 !== hash(decision) || application.nativeAfterSha256 !== hash(decision.after) || application.nativeActiveDefinitionMatchSha256 !== hash(decision.activeDefinitionMatch) ||
      application.originalNativeAfterPreserved !== true || application.sourcePayloadChangeApproved !== false || application.newMathematicalQa !== false || application.newReview2 !== false ||
      application.newDifficultyApproval !== false || !text(application.rationale) || !eq(application.studentPayloadFields, STUDENT) || application.studentPayloadSha256 !== hash(pick(reviewedCurrent, STUDENT))) fail("independent exact native hold disposition mismatch");
  const sourceRef = (ref, commit, bytes, question) => {
    if (!ref || ref.commit !== commit || ref.path !== sourcePath || ref.blob !== blob(bytes) || ref.sha256 !== sha(bytes) || ref.questionStableSha256 !== hash(question)) fail("independent source snapshot mismatch");
  };
  sourceRef(application.immutableSourceBefore, native.baseSha, beforeBytes, beforeBank[ordinal - 1]);
  sourceRef(application.immutableReviewedSource, spec.nativeReviewCommit, reviewedBytes, reviewedBank[ordinal - 1]);
  const currentBytes = gitBytes(root, application.currentSource?.commit, sourcePath), currentBank = bank(currentBytes);
  sourceRef(application.currentSource, application.currentSource.commit, currentBytes, currentBank[ordinal - 1]);
  if (currentBank.length !== request.expectedQuestionCount || !eq(currentBank[ordinal - 1], reviewedCurrent)) fail("current question differs from independently held snapshot");
  if (renderer && (!eq(renderer.proof.beforeSource, { commit: application.currentSource.commit, path: sourcePath,
      gitBlobSha1: blob(currentBytes), sha256: sha(currentBytes), questionSha256: hash(currentBank[ordinal - 1]) }) ||
      renderer.proof.reviewer === nativeAuthor || renderer.proof.studentUi.reviewer === nativeAuthor)) fail("renderer continuity is not bound to the original independent HOLD snapshot");
  const assets = rendererProof(root, reviewedCurrent, application, { ...native, reviewCommit: spec.nativeReviewCommit });
  const original = priorBundle(root, spec.priorCommit);
  const before = one(original.metadata.records, uid, source, ordinal, "prior metadata"), beforeId = one(original.identity.records, uid, source, ordinal, "prior identity");
  if (!eq(item.before, { sourceFingerprint: before.sourceFingerprint, contentFingerprint: before.contentFingerprint }) || beforeId.sourceFingerprint !== before.sourceFingerprint ||
      !eq(protectedMetadata(row), protectedMetadata(before)) || !eq(protectedIdentity(identity), protectedIdentity(beforeId))) fail("protected prior metadata/difficulty/identity changed");
  if (row.metadataStatus !== "approved_partial_with_explicit_holds" || row.metadataApprovalType || row.registrationUpdateState || row.problemTypeKey || row.templateKey ||
      row.fieldStatus?.problemType !== "manual_review_pending" || row.fieldStatus?.template !== "manual_review_pending") fail("existing explicit basic type holds required");
  if ([previous, current, beforeBank[ordinal - 1], reviewedBank[ordinal - 1]].some(q => BASIC.some(k => !eq(q[k], row[k])))) fail("existing basic classification changed");
  const resolved = one(original.catalog.records, uid, source, ordinal, "prior canonical"), bp = item.basicParent;
  if (!bp || !eq(Object.keys(bp).sort(), [...PARENT].sort()) || PARENT.some(k => !text(bp[k])) || resolved.assignmentEvidence?.approvalStatus !== "APPROVED" ||
      resolved.assignmentEvidence?.reviewEvidence?.status !== "PASS" || !eq(resolved.canonicalAssignmentReasons, []) || canonical.pathGrade(source) !== bp.grade ||
      ["curriculumKey", "courseKey", "L1", "L2"].some(k => resolved[k] !== bp[k]) || !crosswalk.some(link => PARENT.every(k => link[k] === bp[k]) && link.standardUnitKey === row.standardUnitKey && link.subUnitKey === row.subUnitKey)) fail("prior exact canonical basic parent is not approved");
  const priorRuntime = original.bundle.runtimeInputPaths.flatMap(p => heldRuntime(original.bundle.resources[p].records || [], uid, source, ordinal).map(record => ({ path: `archive/${p}`, record })));
  const runtimeDir = local(root, "archive/data/meta-foundation/runtime"), currentRuntime = fs.readdirSync(runtimeDir).filter(p => /^[a-z0-9-]+-v[0-9]+\.json$/.test(p)).sort()
    .flatMap(p => heldRuntime(JSON.parse(fs.readFileSync(local(root, `archive/data/meta-foundation/runtime/${p}`))).records || [], uid, source, ordinal).map(record => ({ path: `archive/data/meta-foundation/runtime/${p}`, record })));
  if (priorRuntime.length > 1 || currentRuntime.length > 1 || !eq(priorRuntime, currentRuntime)) fail("protected explicit held runtime changed");
  const records = (review.questions || []).filter(q => q.questionUid === uid), recorded = records[0];
  if (review.schemaVersion !== NATIVE_BASIC_HOLD_REVIEW_SCHEMA || review.status !== "PASS" || review.decision !== "PRESERVE_EXISTING_BASIC_AND_EXPLICIT_TYPE_HOLD" ||
      review.priorCommit !== spec.priorCommit || review.expectedSourceBlobSha1 !== request.expectedSourceBlobSha1 || review.expectedQuestionCount !== request.expectedQuestionCount ||
      review.newMetadataApprovals !== 0 || review.advancedApprovals !== 0 || !text(review.preparedBy) || review.reviewedBy !== independent.reviewerOwner || review.reviewedBy === review.preparedBy ||
      review.reviewedBy !== request.approval.approvedBy || records.length !== 1 || recorded.sourceOrdinal !== ordinal || recorded.holdReasonCode !== NATIVE_BASIC_HOLD_REASON ||
      recorded.nativeItemSha256 !== hash(decision) || recorded.currentQuestionSha256 !== hash(current) || recorded.priorMetadataSha256 !== hash(before) ||
      recorded.priorIdentitySha256 !== hash(beforeId) || !eq(recorded.basicParent, bp)) fail("request wrapper is not bound to this native basic hold");
  return { sourceReviewSchema: NATIVE_BASIC_HOLD_SCHEMA, nativeReviewRef: application.nativeReviewRef,
    independentHoldRef: { commit: spec.holdReviewCommit, path: spec.holdReviewPath, sha256: spec.holdReviewRef.sha256 },
    nativeItemSha256: hash(decision), currentStudentPayloadSha256: hash(pick(current, STUDENT)), currentQuestionSha256: hash(current),
    protectedMetadataSha256: hash(protectedMetadata(before)), protectedIdentitySha256: hash(protectedIdentity(beforeId)), priorCommit: spec.priorCommit,
    priorCanonicalProjectionVersion: original.bundle.projectionVersion, rendererAssets: assets,
    ...(renderer ? { rendererContinuity: renderer.proof } : {}),
    heldRuntimeBindings: priorRuntime.map(({ path: p, record }) => ({ path: p, questionUid: uid, recordSha256: hash(record) })),
    metaOnlyHoldReason: NATIVE_BASIC_HOLD_REASON, sourceDeclaredPrimaryNotApproved: true,
    preservedMetadataApprovals: 1, newMetadataApprovals: 0, advancedApprovals: 0,
    newMathematicalQa: false, newReview2: false, newDifficultyApproval: false };
}
