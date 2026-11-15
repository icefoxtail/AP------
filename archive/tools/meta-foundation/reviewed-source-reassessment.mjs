import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const fail = message => { throw new Error(`source reassessment: ${message}`); };
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const equal = (left, right) => stable(left) === stable(right);
const text = value => typeof value === "string" && value.trim();
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;

// Include aliases and renderer inputs as well as the fields used by the stored fingerprints.
// A review of an older question cannot authorize a later stem, answer, solution, figure or layout.
export const REASSESSED_STUDENT_FIELDS = Object.freeze([
  "id", "number", "sourceQuestionNo", "sourceQid", "sourceOrdinal", "questionUid", "questionType", "content", "question", "choices", "answer", "solution",
  "image", "images", "figureSvg", "solutionImage", "solutionImages", "solutionFigureSvg", "layoutTag", "wide",
  "imageSize", "solutionImageAlt", "solutionImageCaption", "solutionImageSize", "score",
]);
const studentPayload = question => Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(key =>
  [key, Object.hasOwn(question, key) ? question[key] : null]));
const DIFFICULTY_FIELDS = ["level", "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];
const DERIVED_FIELDS = new Set(["sourceFingerprint", "contentFingerprint", "L1", "L2", "L3", "L4"]);

function repositoryPath(root, relative) {
  if (!text(relative) || relative.includes("\\") || relative.includes("\0") || path.isAbsolute(relative) ||
      relative.split("/").some(part => !part || part === "." || part === "..")) fail("unsafe review path");
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink review path");
  return full;
}

function git(root, args) {
  try { return execFileSync("git", args, { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }); }
  catch { fail("review commit or bound Git object unavailable"); }
}

function bankFromBytes(bytes) {
  try {
    const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.runInNewContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
    const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
    if (!Array.isArray(bank)) fail("reviewed source has no question bank");
    return JSON.parse(JSON.stringify(bank));
  } catch { fail("reviewed source has no valid question bank"); }
}

function loadReview({ root, request, patch, cache }) {
  const spec = patch.sourceReview, ref = spec?.reviewRef;
  if (spec?.schemaVersion !== "archive-reviewed-source-reassessment-v1" || !SHA1.test(spec.reviewCommit || "") ||
      !SHA256.test(ref?.sha256 || "")) fail("explicit commit and SHA-bound native review required");
  const localPath = repositoryPath(root, ref.path), reviewPath = spec.reviewPath;
  repositoryPath(root, reviewPath);
  for (const refs of [request.approval.evidenceRefs, patch.evidenceRefs])
    if (!refs?.some(row => row.path === ref.path && row.sha256 === ref.sha256)) fail("reviewRef must bind approval and item evidence");
  if (!fs.existsSync(localPath) || sha256(fs.readFileSync(localPath)) !== ref.sha256) fail("native review missing or changed");
  const cacheKey = stable([spec.reviewCommit, reviewPath, ref.path, ref.sha256, request.sourceArchiveFile]);
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  if (git(root, ["rev-parse", "--verify", `${spec.reviewCommit}^{commit}`]).toString().trim() !== spec.reviewCommit)
    fail("reviewCommit must name the exact commit");
  const original = git(root, ["show", `${spec.reviewCommit}:${reviewPath}`]);
  if (sha256(original) !== ref.sha256) fail("native review differs from its Git commit");
  let review;
  try { review = JSON.parse(original); } catch { fail("native review JSON invalid"); }
  if (review.sourceArchiveFile !== request.sourceArchiveFile) fail("review source identity mismatch");
  const sourcePath = `archive/exams/${request.sourceArchiveFile}`;
  repositoryPath(root, sourcePath);
  const committedBlob = git(root, ["rev-parse", `${spec.reviewCommit}:${sourcePath}`]).toString().trim();
  const committedBytes = git(root, ["cat-file", "blob", committedBlob]);
  let sourceBlob, sourceBytes, count, ordinalKey, reviewer;
  if (review.schemaVersion === "m3-s2-complete-semantic-review-v1") {
    sourceBlob = review.sourceAfterBlob;
    if (!SHA1.test(sourceBlob || "") || sourceBlob !== committedBlob ||
        !SHA256.test(review.sourceAfterSha256 || "") || sha256(committedBytes) !== review.sourceAfterSha256)
      fail("native review source blob/SHA mismatch");
    sourceBytes = committedBytes;
    count = review.questionCount;
    ordinalKey = "ordinal";
    reviewer = review.author;
    if (!text(review.rootIntegrator)) fail("native review integrator missing");
  } else if (["m2-s1-meta-review-v1", "m2-s2-meta-review-v1"].includes(review.schemaVersion)) {
    sourceBlob = review.sourceGitBlobSha;
    if (!SHA1.test(sourceBlob || "") || !SHA1.test(review.baseSha || "") ||
        git(root, ["rev-parse", `${review.baseSha}:${sourcePath}`]).toString().trim() !== sourceBlob)
      fail("native review baseline/source blob mismatch");
    sourceBytes = git(root, ["cat-file", "blob", sourceBlob]);
    count = review.reviewedQuestionCount;
    ordinalKey = "sourceOrdinal";
    reviewer = review.judgedBy?.agent || review.owner;
  } else fail("unsupported native review schema");
  if (!text(reviewer) || !Number.isInteger(count) || count !== request.expectedQuestionCount ||
      !Array.isArray(review.items) || review.items.length !== count) fail("native review denominator/reviewer mismatch");
  const reviewedBank = bankFromBytes(sourceBytes), committedBank = bankFromBytes(committedBytes);
  if (reviewedBank.length !== count || committedBank.length !== count) fail("reviewed source denominator mismatch");
  const rows = new Map(), uids = new Set();
  for (const row of review.items) {
    const ordinal = row[ordinalKey];
    if (!Number.isInteger(ordinal) || ordinal < 1 || ordinal > count || rows.has(ordinal) ||
        !text(row.questionUid) || uids.has(row.questionUid)) fail("native review UID/ordinal denominator mismatch");
    rows.set(ordinal, row); uids.add(row.questionUid);
  }
  const loaded = { spec, review, sourceBlob, sourceSha256: sha256(sourceBytes), committedBlob, reviewedBank, committedBank, rows, reviewer };
  cache.set(cacheKey, loaded);
  return loaded;
}

export function validateReviewedSourceReassessment({ root, request, patch, metadata, question, final, supportedFields, cache = new Map() }) {
  if (request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.sourceRebind || patch.rebind !== undefined || !Object.hasOwn(patch.after, "sourceFingerprint"))
    fail("requires an exclusive PARTIAL_UIDS FINAL_QA fingerprint repair");
  const loaded = loadReview({ root, request, patch, cache });
  const { review, rows, reviewedBank, committedBank } = loaded, ordinal = patch.sourceOrdinal;
  const row = rows.get(ordinal);
  if (row?.questionUid !== patch.questionUid || !text(row.decisiveStep) || !row.after ||
      typeof row.after !== "object" || Array.isArray(row.after)) fail("reviewed UID/ordinal/decision missing");
  const decision = review.schemaVersion === "m3-s2-complete-semantic-review-v1" ? row.decision : row.rpmDecision;
  if (!["CORRECT", "KEEP", "KEEP_SEMANTIC_RPM"].includes(decision)) fail("native semantic decision is not settled");
  if (review.schemaVersion !== "m3-s2-complete-semantic-review-v1" &&
      (!row.fieldReview || !text(row.fieldReview.classification) || !text(row.fieldReview.difficulty)))
    fail("native per-field review missing");
  const hardDebts = [...(row.debts || []), ...(row.contentDebt || []), ...(row.registrationDebt || [])];
  if ((row.contentDebt || []).length || hardDebts.some(debt => {
    const kind = typeof debt === "string" ? debt : debt?.type || debt?.kind || "";
    return /^(SOURCE_|CONTENT_|SOLUTION_|PRIOR_SOURCE_QA|DIFFICULTY_HOLD|EXPLICIT_DIFFICULTY_VALIDITY)/.test(kind) &&
      kind !== "SOURCE_IMAGE_CROP_NONBLOCKING_METADATA";
  })) fail("native review retains an explicit source/content/difficulty hold");
  const payload = studentPayload(question);
  if (!equal(payload, studentPayload(reviewedBank[ordinal - 1])) ||
      !equal(payload, studentPayload(committedBank[ordinal - 1]))) fail("current student payload differs from the reviewed source");
  if (row.sourceEvidence) {
    const evidence = row.sourceEvidence, q = reviewedBank[ordinal - 1];
    const fingerprints = { QBODY: sha256(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null })),
      QFULL: sha256(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null })) };
    if (evidence.sourceGitBlobSha !== loaded.sourceBlob || !Array.isArray(evidence.fingerprints) ||
        Object.entries(fingerprints).some(([scope, value]) => evidence.fingerprints.filter(f =>
          f.scope === scope && f.algo === "sha256-canonical-json-v1" && f.value === value).length !== 1))
      fail("native per-item source fingerprints mismatch");
  }
  const accepted = { ...row.after };
  for (const key of DIFFICULTY_FIELDS) if (Object.hasOwn(row.finalDifficulty || {}, key)) {
    if (Object.hasOwn(accepted, key) && !equal(accepted[key], row.finalDifficulty[key])) fail(`native difficulty disagreement: ${key}`);
    accepted[key] = row.finalDifficulty[key];
  }
  for (const [key, value] of Object.entries(patch.after)) {
    if (DERIVED_FIELDS.has(key) || equal(value, metadata[key] ?? null)) continue;
    // Source curriculum identifiers may be carried verbatim; they are never guessed from the reviewed grade.
    if (["curriculum", "curriculumKey", "courseKey"].includes(key) &&
        (equal(value, question[key]) || ["curriculum", "curriculumKey"].includes(key) && equal(value, question.curriculum))) continue;
    if (!Object.hasOwn(accepted, key) || !equal(accepted[key], value)) fail(`changed value not approved by native review: ${key}`);
  }
  const identityOnly = request.registrationMode === "IDENTITY_FINGERPRINT_ONLY";
  if (identityOnly && Object.entries(patch.after).some(([key, value]) =>
    !["sourceFingerprint", "contentFingerprint"].includes(key) || !equal(value, metadata[key])))
    fail("identity-only proof cannot change metadata");
  // Ordinary FINAL_QA re-registers a complete metadata row. Omitting an approved correction
  // from patch.after cannot retain an older conflicting value and re-approve that row.
  // Display L1..L4 are derived/validated by the registrar; native auxiliary fields outside its
  // value contract are not invented. Identity-only repair emits no metadata approval at all.
  if (!identityOnly) for (const [key, value] of Object.entries(accepted))
    if (!DERIVED_FIELDS.has(key) && (!supportedFields || supportedFields.has(key)) && !equal(final[key] ?? null, value ?? null))
      fail(`reviewed after value mismatch (including omitted field): ${key}`);
  return { schemaVersion: patch.sourceReview.schemaVersion, nativeSchemaVersion: review.schemaVersion,
    reviewCommit: loaded.spec.reviewCommit, reviewPath: loaded.spec.reviewPath, reviewRef: loaded.spec.reviewRef,
    reviewedSourceBlobSha1: loaded.sourceBlob, reviewedSourceSha256: loaded.sourceSha256,
    reviewCommitSourceBlobSha1: loaded.committedBlob, questionUid: patch.questionUid, sourceOrdinal: ordinal,
    reviewer: loaded.reviewer, decision, studentPayloadSha256: sha256(stable(payload)),
    scope: identityOnly ? "IDENTITY_BINDING_ONLY" : "METADATA_SOURCE_BINDING_ONLY", newMathematicalQa: false };
}
