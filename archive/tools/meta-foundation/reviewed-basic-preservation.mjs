// Exact continuation of an existing basic approval after an independently
// reviewed display/text repair. This is separate from the figure-only gate.
import { META_FILE, questionMetadataBytesAt } from "./question-metadata-format.mjs";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const canonical = require("../../archive2-canonical.js");
export const BASIC_PRESERVATION_SCHEMA = "archive-basic-scope-current-source-preservation-v1";
export const BASIC_PRESERVATION_REVIEW_SCHEMA = "archive-basic-scope-current-source-review-v1";
const META = "archive/data/question_metadata.json", IDENTITY = "archive/data/question_identity_map.json";
const EVIDENCE = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const DIFFICULTY = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];
const PARENT = ["grade", "curriculumKey", "courseKey", "L1", "L2"];
const cache = new Map();
const fail = reason => { throw Error("BASIC_SCOPE_PRESERVATION: " + reason); };
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
export const stableBasicValue = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const eq = (a, b) => stableBasicValue(a) === stableBasicValue(b);
const hash = value => sha(stableBasicValue(value) ?? "undefined");
const omit = (row, keys) => Object.fromEntries(Object.entries(row).filter(([key]) => !keys.includes(key)));
export const protectedBasicMetadata = row => omit(row, ["sourceFingerprint", "contentFingerprint", ...DIFFICULTY]);
const fingerprints = q => ({
  sourceFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null })),
  contentFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null })),
});

function safe(relative) {
  if (typeof relative !== "string" || !relative || /[\\\r\n\0]/.test(relative) || path.isAbsolute(relative)
      || relative.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe immutable path");
  return relative;
}
function gitBytes(root, commit, relative) {
  if (!/^[a-f0-9]{40}$/.test(commit || "")) fail("immutable commit required");
  safe(relative);
  if (relative === META_FILE) return questionMetadataBytesAt(root, commit);
  try { return execFileSync("git", ["show", `${commit}:${relative}`], {
    cwd: root, maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
  }); } catch { fail(`immutable input unavailable: ${commit}:${relative}`); }
}
function requireCommit(root, commit) {
  if (!/^[a-f0-9]{40}$/.test(commit || "")) fail("immutable commit required");
  try {
    if (execFileSync("git", ["cat-file", "-t", commit], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() !== "commit")
      fail("immutable commit required");
  } catch { fail("immutable commit unavailable"); }
}
function bank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const rows = ctx.window.questionBank || ctx.window.questions;
  if (!Array.isArray(rows)) fail("immutable source bank missing");
  return rows;
}
function one(rows, uid, source, ordinal, what) {
  const matches = rows.filter(row => row.questionUid === uid);
  if (matches.length !== 1 || (matches[0].sourceArchiveFile ?? matches[0].sourceFile) !== source || matches[0].sourceOrdinal !== ordinal)
    fail(`${what} UID/source/ordinal mismatch: ${uid}`);
  return matches[0];
}

// Synchronous Git adapter for the public canonical loader's manifest contract.
// The same exported path derivation, digest payload and resolver are used; no
// historical APPROVED flag is accepted without resolving its complete bundle.
function priorBundle(root, commit) {
  const key = path.resolve(root) + "\0" + commit;
  if (cache.has(key)) return cache.get(key);
  requireCommit(root, commit);
  const inputPath = rel => rel === canonical.CANONICAL_MASTER_PATH
    ? path.posix.normalize(`archive/${rel}`) : `archive/${safe(rel)}`;
  const read = rel => gitBytes(root, commit, inputPath(rel)).toString("utf8");
  const manifest = JSON.parse(read("data/archive2-canonical-input-manifest.json"));
  if (manifest.schemaVersion !== "archive2-canonical-input-manifest-v1" || manifest.resolverVersion !== canonical.RESOLVER_VERSION
      || !Array.isArray(manifest.files)) fail("prior canonical resolver/manifest mismatch");
  const version = "archive2-canonical-v1:" + sha(canonical.projectionManifestPayload(manifest.files, canonical.RESOLVER_VERSION));
  if (version !== manifest.projectionVersion) fail("prior canonical manifest digest mismatch");
  const files = Object.fromEntries(manifest.files.map(row => {
    inputPath(row.path); return [row.path, { sha256: row.sha256.toLowerCase() }];
  }));
  if (canonical.MANIFEST_REQUIRED_PATHS.some(p => !files[p])) fail("prior canonical manifest incomplete");
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
  cache.set(key, result);
  return result;
}

function exactRepair(previous, current, item, recorded) {
  const changed = Object.keys({ ...previous, ...current }).filter(k => !eq(previous[k], current[k])).sort();
  if (!changed.length) fail("source repair is empty");
  const changes = changed.map(field => ({ field, beforeSha256: hash(previous[field]), afterSha256: hash(current[field]) }));
  if (!eq(recorded.changes, changes) || recorded.beforeQuestionSha256 !== hash(previous)
      || recorded.afterQuestionSha256 !== hash(current) || recorded.repairKind !== item.repairKind
      || !eq(recorded.textEdits, item.textEdits)) fail("independent current-source review mismatch");
  if (item.repairKind === "EMPTY_CHOICE_PLACEHOLDERS_ONLY") {
    if (!eq(changed, ["choices"]) || !Array.isArray(previous.choices) || !previous.choices.length
        || previous.choices.some(choice => typeof choice !== "string" || choice.trim())
        || !eq(current.choices, []) || !eq(item.textEdits, {})) fail("only empty choice placeholders may be removed");
  } else if (item.repairKind === "REVIEWED_KOREAN_TEXT_ONLY") {
    if (!item.textEdits || !eq(Object.keys(item.textEdits).sort(), changed)
        || changed.some(field => !["content", "question", "solution"].includes(field))) fail("text repair field scope");
    let count = 0;
    for (const field of changed) {
      let expected = previous[field];
      const edits = item.textEdits[field];
      if (typeof expected !== "string" || typeof current[field] !== "string" || !Array.isArray(edits) || !edits.length) fail("text repair type");
      for (const edit of edits) {
        if (!edit || !eq(Object.keys(edit).sort(), ["from", "to"]) || ![edit.from, edit.to].every(text => typeof text === "string"
            && text.length > 0 && text.length <= 48 && /^[\p{Script=Hangul} .,!?·'’“”():;-]+$/u.test(text))
            || edit.from === edit.to || expected.split(edit.from).length !== 2) fail("text repair must be an exact Korean literal, without math or numbers");
        expected = expected.replace(edit.from, edit.to); count++;
      }
      if (expected !== current[field]) fail("undeclared text change");
    }
    if (count > 6) fail("text repair limit");
  } else fail("unsupported reviewed repair kind");
  return changes;
}

function requireTextOnlyAssets(value, key = "") {
  if (/image|svg|figure|asset|diagram|canvas|video|audio/i.test(key) && value !== undefined && value !== null && value !== "" && value !== false)
    fail("render assets are outside text-only preservation");
  if (typeof value === "string" && /assets\/|data:image|<(?:img|svg|object|iframe|canvas|video|audio)\b|\b(?:src|href)\s*=|url\s*\(/i.test(value))
    fail("inline render assets are outside text-only preservation");
  if (value && typeof value === "object") for (const [child, item] of Object.entries(value)) requireTextOnlyAssets(item, child);
}

export function verifyReviewedBasicPreservation({ root, request, review, item, current, previous, row, identity, crosswalk }) {
  const spec = request.approval.sourceReview;
  if (!spec || spec.schemaVersion !== BASIC_PRESERVATION_SCHEMA ||
      !eq(Object.keys(spec).sort(), ["priorCommit", "repairBaseCommit", "schemaVersion"]) ||
      request.previousSourceCommit !== spec.repairBaseCommit || request.registryChanges !== undefined || request.difficultyEvidence !== undefined ||
      request.scope !== undefined || request.registrationMode !== undefined || request.approval.sourceRebind !== undefined ||
      Object.keys(item).some(k => !["questionUid", "sourceOrdinal", "before", "after", "basicParent", "repairKind", "textEdits", "reason", "evidenceRefs"].includes(k)))
    fail("preservation scope");
  const source = request.sourceArchiveFile, uid = item.questionUid, ordinal = item.sourceOrdinal;
  const sourcePath = `archive/exams/${source}`;
  requireCommit(root, spec.repairBaseCommit);
  const repairBytes = gitBytes(root, spec.repairBaseCommit, sourcePath);
  const repairBlob = crypto.createHash("sha1").update(`blob ${repairBytes.length}\0`).update(repairBytes).digest("hex");
  if (repairBlob !== request.previousSourceBlobSha1 || !eq(bank(repairBytes)[ordinal - 1], previous)) fail("repair base commit/path binding mismatch");
  if (review.schemaVersion !== BASIC_PRESERVATION_REVIEW_SCHEMA || review.status !== "PASS" ||
      review.decision !== "PRESERVE_EXISTING_BASIC_ONLY" || review.priorCommit !== spec.priorCommit ||
      review.repairBaseCommit !== spec.repairBaseCommit || review.expectedSourceBlobSha1 !== request.expectedSourceBlobSha1 ||
      typeof review.reviewedBy !== "string" || !review.reviewedBy.trim() || typeof review.preparedBy !== "string" ||
      !review.preparedBy.trim() || review.reviewedBy === review.preparedBy || review.reviewedBy !== request.approval.approvedBy ||
      review.newMetadataApprovals !== 0 || review.advancedApprovals !== 0 || review.expectedQuestionCount !== request.expectedQuestionCount)
    fail("independent review scope");
  const recorded = review.questions.filter(q => q.questionUid === uid);
  if (recorded.length !== 1 || recorded[0].sourceOrdinal !== ordinal || recorded[0].decision !== "PRESERVE_EXISTING_BASIC_ONLY")
    fail("independent review UID/ordinal scope");
  const evidence = ref => {
    if (!ref || !String(ref.path || "").startsWith(EVIDENCE) || !/^[a-f0-9]{64}$/.test(ref.sha256 || "") ||
        !request.approval.evidenceRefs.some(candidate => eq(candidate, ref)) || !item.evidenceRefs.some(candidate => eq(candidate, ref)))
      fail("independent evidence must be bound to approval and item");
    const raw = fs.readFileSync(path.join(root, safe(ref.path)));
    if (sha(raw) !== ref.sha256) fail("independent evidence digest mismatch");
    return JSON.parse(raw);
  };
  const independent = evidence(review.independentReviewRef), input = evidence(review.independentInputRef);
  const checked = (independent.rows || []).filter(q => q.questionUid === uid);
  const proposed = (input.rows || []).filter(q => q.questionUid === uid);
  if (independent.schemaVersion !== "archive-basic-scope-preservation-independent-review-v1" ||
      independent.status !== "PASS_FOR_EXACT_DECLARED_REPAIR_AND_EXISTING_BASIC_ONLY" || independent.reviewer !== review.reviewedBy ||
      independent.inputSha256 !== review.independentInputRef.sha256 || input.schemaVersion !== "archive-basic-scope-preservation-review-input-v1" ||
      checked.length !== 1 || proposed.length !== 1 || checked[0].sourceOrdinal !== ordinal || checked[0].sourcePath !== sourcePath ||
      checked[0].decision !== "PRESERVE_EXISTING_BASIC_ONLY" || checked[0].newAdvancedApproval !== false ||
      checked[0].priorCommit !== spec.priorCommit || checked[0].repairBaseCommit !== spec.repairBaseCommit ||
      checked[0].verifiedCurrentSourceRawSha256 !== sha(fs.readFileSync(path.join(root, sourcePath))) ||
      ["repairKind", "beforeQuestionSha256", "afterQuestionSha256", "basicParent"].some(k => !eq(checked[0][k], recorded[0][k])) ||
      ["repairKind", "beforeQuestionSha256", "afterQuestionSha256", "basicParent", "changes", "textEdits"].some(k => !eq(proposed[0][k], recorded[0][k])))
    fail("independent decision is not bound to this exact current repair");
  const changes = exactRepair(previous, current, item, recorded[0]);
  // These two repair kinds cover questions without external/rendered assets.
  // Figure-bearing repairs retain the original dedicated figure-only gate.
  requireTextOnlyAssets(previous); requireTextOnlyAssets(current);
  const original = priorBundle(root, spec.priorCommit);
  const before = one(original.metadata.records, uid, source, ordinal, "prior metadata");
  const beforeId = one(original.identity.records, uid, source, ordinal, "prior identity");
  const priorRows = bank(gitBytes(root, spec.priorCommit, sourcePath));
  if (priorRows.length !== request.expectedQuestionCount) fail("prior source denominator mismatch");
  const priorFp = fingerprints(priorRows[ordinal - 1]);
  if (!eq(item.before, { sourceFingerprint: before.sourceFingerprint, contentFingerprint: before.contentFingerprint })
      || beforeId.sourceFingerprint !== before.sourceFingerprint || before.contentFingerprint !== priorFp.contentFingerprint)
    fail("prior approved body/identity binding mismatch");
  if (!eq(protectedBasicMetadata(row), protectedBasicMetadata(before)) ||
      !eq(omit(identity, ["sourceFingerprint"]), omit(beforeId, ["sourceFingerprint"]))) fail("protected approval/identity values changed");
  if (row.problemTypeKey || row.templateKey || row.metadataApprovalType || row.registrationUpdateState ||
      row.fieldStatus?.problemType !== "manual_review_pending" || row.fieldStatus?.template !== "manual_review_pending") fail("existing basic-only type holds required");
  if (current.standardUnitKey !== row.standardUnitKey || current.subUnitKey !== row.subUnitKey ||
      current.problemTypeKey || current.templateKey) fail("source basic classification/type holds changed");
  const resolved = one(original.catalog.records, uid, source, ordinal, "prior canonical");
  const bp = item.basicParent;
  if (!bp || !eq(Object.keys(bp).sort(), [...PARENT].sort()) || PARENT.some(k => typeof bp[k] !== "string" || !bp[k].trim()) ||
      resolved.assignmentEvidence?.approvalStatus !== "APPROVED" || resolved.assignmentEvidence?.reviewEvidence?.status !== "PASS" ||
      !eq(resolved.canonicalAssignmentReasons, []) || canonical.pathGrade(source) !== bp.grade ||
      ["curriculumKey", "courseKey", "L1", "L2"].some(k => resolved[k] !== bp[k]) || !eq(recorded[0].basicParent, bp))
    fail("existing exact canonical basic parent is not approved");
  if (!crosswalk.some(link => PARENT.every(k => link[k] === bp[k]) && link.standardUnitKey === row.standardUnitKey && link.subUnitKey === row.subUnitKey))
    fail("prior parent is absent from current canonical crosswalk");
  if (original.bundle.runtimeInputPaths.some(p => (original.bundle.resources[p].records || []).some(r => r.questionUid === uid)))
    fail("native runtime approval cannot use basic preservation");
  const runtimeDir = path.join(root, "archive/data/meta-foundation/runtime");
  for (const file of fs.readdirSync(runtimeDir).filter(p => /^[a-z0-9-]+-v[0-9]+\.json$/.test(p))) {
    if ((JSON.parse(fs.readFileSync(path.join(runtimeDir, file), "utf8")).records || []).some(r => r.questionUid === uid))
      fail("current runtime approval cannot use basic preservation");
  }
  return { sourceRepairKind: item.repairKind, sourceChanges: changes,
    protectedMetadataSha256: hash(protectedBasicMetadata(before)), protectedIdentitySha256: hash(omit(beforeId, ["sourceFingerprint"])),
    priorCanonicalProjectionVersion: original.bundle.projectionVersion, priorCommit: spec.priorCommit,
    repairBaseCommit: spec.repairBaseCommit, preexistingFullFingerprintDrift: priorFp.sourceFingerprint !== before.sourceFingerprint,
    preservedMetadataApprovals: 1, newMetadataApprovals: 0, advancedApprovals: 0 };
}
