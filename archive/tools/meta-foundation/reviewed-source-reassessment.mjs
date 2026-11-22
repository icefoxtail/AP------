import { readM2Problem21CurrentRpmSource } from "./m2-problem21-current-ui-continuity.mjs";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { REVIEWED_RPM_FIELDS } from "./reviewed-rpm-provenance.mjs";
import { validateNativeProposalFinalization } from "./reviewed-proposal-finalization.mjs";
import { validateReviewedCurrentRendererContinuity } from "./reviewed-current-renderer-continuity.mjs";
import { bindReviewedNativeScopeFields } from "./reviewed-native-scope-fields.mjs";
import { validateReviewedNativeRetainedFields } from "./reviewed-native-retained-fields.mjs";
import { bindReviewedRetainedScopeTransport } from "./reviewed-retained-scope-transport.mjs";
import { bindReviewedNativeFamilyCourse } from "./reviewed-native-parent.mjs";
import { bindReviewedNativeRationaleContinuity } from "./reviewed-native-rationale-continuity.mjs";
import { validateM2S1CurrentDefinitionApplication } from "./reviewed-m2s1-current-definition-application.mjs";
import { validateM2S1PrerequisiteExistingApplication } from "./reviewed-m2s1-prerequisite-existing-application.mjs";
import { validateM3S2CurrentTargetApplication } from "./reviewed-m3s2-current-target-application.mjs";
import { validateM2ProblemRendererContinuity } from "./reviewed-m2-problem-renderer-continuity.mjs";
import { validateM2E006ProblemContinuity } from "./reviewed-m2-e006-problem-continuity.mjs";
import { validateReviewedM2CcRendererContinuity } from "./reviewed-m2-cc-renderer-continuity.mjs";
import { validateM2E017RhsContinuity } from "./reviewed-m2-e017-rhs-continuity.mjs";
import { validateM2ProblemRenderer21Continuity } from "./reviewed-m2-problem21-continuity.mjs";
import { validateM2Family3ProblemContinuity } from "./reviewed-m2-family3-problem-continuity.mjs";
import { validateM2E023SolutionDisplayContinuity } from "./reviewed-m2-e023-solution-display-continuity.mjs";
import { validateM3Q5CompleteGivenApplication, M3_Q5_COMPLETE_GIVEN_SCHEMA } from "./reviewed-m3-e052-q5-complete-given.mjs";
import { bindReviewedM2NativeRpmCourse } from "./reviewed-m2-native-rpm-course.mjs";

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

// A native KEEP review may record only its CC/difficulty delta. Restore an
// omitted primary tuple only when that same UID already supports both unchanged
// ACTIVE definitions, both immutable source snapshots carry the tuple, and the
// independent CC finalization has verified its exact primary context. This is
// not a fallback for a new classification, an unresolved proposal or a hold.
export function bindUnchangedReviewedPrimary({ native, row, accepted, patch, question, final,
  canonicalBefore, canonicalAfter, proposalFinalization }) {
  const primary = ["problemTypeKey", "templateKey"];
  if (!primary.some(key => Object.hasOwn(patch.after, key) && !Object.hasOwn(accepted, key))) return null;
  const proof = proposalFinalization?.proof, match = row.activeDefinitionMatch;
  if (native.review.schemaVersion !== "m2-s2-meta-review-v1" || row.rpmDecision !== "KEEP" ||
      primary.some(key => Object.hasOwn(accepted, key)) ||
      proof?.schemaVersion !== "archive-native-proposal-finalization-v1" ||
      !Array.isArray(proof.nativeProposalBindings) || !proof.nativeProposalBindings.length ||
      proof.nativeProposalBindings.some(binding => binding.type !== "CC") ||
      !Array.isArray(proof.definitions) || !proof.definitions.length ||
      proof.definitions.some(definition => definition.collection !== "concepts")) return null;
  const committed = native.committedBank[patch.sourceOrdinal - 1], reviewed = native.reviewedBank[patch.sourceOrdinal - 1];
  const context = ["standardCourse", "standardUnitKey", "subUnitKey", ...primary];
  for (const key of context) if (!text(committed?.[key]) || !equal(committed[key], reviewed?.[key]) ||
      !equal(committed[key], question[key]) || !equal(committed[key], final[key]) ||
      Object.hasOwn(patch.after, key) && !equal(committed[key], patch.after[key]))
    fail(`unchanged primary tuple differs from immutable native sources: ${key}`);
  const pt = committed.problemTypeKey, tpl = committed.templateKey;
  const beforePt = canonicalBefore?.pt?.get(pt), afterPt = canonicalAfter?.pt?.get(pt),
    beforeTpl = canonicalBefore?.tpl?.get(tpl), afterTpl = canonicalAfter?.tpl?.get(tpl);
  if (beforePt?.status !== "ACTIVE" || beforeTpl?.status !== "ACTIVE" ||
      beforeTpl.parentProblemTypeKey !== pt || !equal(beforePt, afterPt) || !equal(beforeTpl, afterTpl) ||
      !beforePt.supportingQuestionUids?.includes(patch.questionUid) ||
      !beforeTpl.supportingQuestionUids?.includes(patch.questionUid) ||
      match?.problemTypeKey !== pt || match.templateKey !== tpl || match.problemTypeStatus !== "ACTIVE" ||
      match.templateStatus !== "ACTIVE" || match.templateParent !== pt)
    fail("unchanged primary requires exact pre-existing ACTIVE definitions supporting this UID");
  const curriculum = final.curriculumKey || final.curriculum;
  if (!["2015", "2022"].includes(curriculum) || native.review.sourceArchiveFile === undefined ||
      row.rpmPath?.curriculum !== curriculum || !Array.isArray(match.exactBindings))
    fail("unchanged primary requires the native exact curriculum binding");
  const bindings = match.exactBindings.filter(binding => binding.status === "ACTIVE" &&
    binding.curriculum === curriculum && binding.standardCourse === committed.standardCourse &&
    binding.standardUnitKey === committed.standardUnitKey && binding.subUnitKey === committed.subUnitKey &&
    binding.problemTypeKey === pt);
  if (bindings.length !== 1) fail("unchanged primary requires one exact native ACTIVE binding");
  const fields = Object.fromEntries(primary.map(key => [key, committed[key]]));
  for (const key of ["conditionKeys", "integrationPattern"]) {
    if (!Object.hasOwn(patch.after, key) || Object.hasOwn(accepted, key)) continue;
    const value = committed[key];
    if (!Object.hasOwn(committed, key) || !Object.hasOwn(reviewed, key) ||
        !equal(value, reviewed[key]) || !equal(value, question[key]) ||
        !equal(value, patch.after[key]) || !equal(value, final[key]) ||
        (key === "conditionKeys" ? !Array.isArray(value) || value.length !== 0 || !text(row.fieldReview?.condition) :
          !["NONE", "SEQUENTIAL", "PARALLEL"].includes(value) || !text(row.fieldReview?.integration)))
      fail(`unchanged primary cannot add or replace native auxiliary values: ${key}`);
    fields[key] = value;
  }
  return { fields, proof: { schemaVersion: "archive-native-unchanged-primary-binding-v1",
    origin: "UNCHANGED_REVIEWED_SOURCE_AND_EXISTING_UID_DEFINITIONS",
    fieldSha256: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, sha256(stable(value))])),
    problemTypeDefinitionSha256: sha256(stable(beforePt)), templateDefinitionSha256: sha256(stable(beforeTpl)),
    nativeExactBindingSha256: sha256(stable(bindings[0])), newDefinitions: false, newMathematicalQa: false } };
}

export function validateReviewedSourceReassessment({ root, request, patch, metadata, question, final, supportedFields,
  canonicalBefore, canonicalAfter, issuedSourceReview, cache = new Map(), e015IssuedSourceContinuation, m2Problem21CurrentUiContinuation }) {
  if (request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.sourceRebind || patch.rebind !== undefined || !Object.hasOwn(patch.after, "sourceFingerprint"))
    fail("requires an exclusive PARTIAL_UIDS FINAL_QA fingerprint repair");
  if (e015IssuedSourceContinuation !== undefined && !patch.sourceReview?.m2Family3ProblemContinuity)
    fail("E015 issued-source context requires its original family3 option");
  if (m2Problem21CurrentUiContinuation !== undefined) {
    if (e015IssuedSourceContinuation !== undefined)
      fail("current problem21 context requires its exclusive original option");
    if (!patch.sourceReview?.m2ProblemRenderer21Continuity)
      readM2Problem21CurrentRpmSource({context:m2Problem21CurrentUiContinuation,root,request,patch,metadata,final,
        issuedProof:issuedSourceReview?.nativeRpmCourseTransport,relativePath:`archive/exams/${request.sourceArchiveFile}`});
  }
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
  const q5CompleteGiven = validateM3Q5CompleteGivenApplication({ root, request, patch, native: loaded, row,
    metadata, question, final, canonicalBefore, canonicalAfter, studentPayload, cache });
  if (q5CompleteGiven) {
    const inner = validateReviewedSourceReassessment({ root, request, patch: q5CompleteGiven.normalizedPatch,
      metadata, question: q5CompleteGiven.normalizedQuestion, final, supportedFields, canonicalBefore, canonicalAfter,
      issuedSourceReview, cache });
    if (q5CompleteGiven.proof.schemaVersion !== M3_Q5_COMPLETE_GIVEN_SCHEMA ||
        inner.proposalFinalization?.schemaVersion !== "archive-native-proposal-finalization-v2" ||
        !inner.proposalFinalization.nativeProposalBindings?.length ||
        inner.proposalFinalization.nativeProposalBindings.some(binding => binding.type !== "CC") ||
        !inner.proposalFinalization.definitions?.length ||
        inner.proposalFinalization.definitions.some(definition => definition.collection !== "concepts"))
      fail("Q5 complete-given bridge requires the original complete Native and CC finalizer");
    return { ...inner, studentPayloadSha256: sha256(stable(payload)), q5CompleteGivenApplication: {
      ...q5CompleteGiven.proof, replayedOriginalSourceReviewSha256: sha256(stable(inner)) } };
  }
  const e017Rhs = validateM2E017RhsContinuity({ root, request, patch, native: loaded, row,
    question, studentPayload, bankFromBytes });
  if (e017Rhs) {
    const inner = validateReviewedSourceReassessment({ root, request, patch: e017Rhs.normalizedPatch,
      metadata, question: e017Rhs.normalizedQuestion, final, supportedFields, canonicalBefore, canonicalAfter,
      issuedSourceReview, cache });
    return { ...inner, studentPayloadSha256: sha256(stable(payload)), e017RhsContinuity: {
      ...e017Rhs.proof, originalSourceReviewSha256: sha256(stable(inner)) } };
  }
  const m2Family3 = validateM2Family3ProblemContinuity({ root, request, patch, native: loaded, row,
    question, final, bankFromBytes, cache, e015IssuedSourceContinuation });
  if (m2Family3) {
    // Preserve the existing retained-fields/scope options. The ordinary Native
    // recursion still checks every non-display value and the current parent.
    const inner = validateReviewedSourceReassessment({ root, request, patch: m2Family3.normalizedPatch,
      metadata, question: m2Family3.normalizedQuestion, final, supportedFields, canonicalBefore, canonicalAfter,
      issuedSourceReview, cache });
    return { ...inner, studentPayloadSha256: sha256(stable(payload)), m2Family3ProblemContinuity: {
      ...m2Family3.proof, originalSourceReviewSha256: sha256(stable(inner)) } };
  }
  // Both witnesses read the same real source before either comparison view is
  // composed. Each owns a closed, disjoint set of display fields. The recursive
  // ordinary Native validator still checks the complete resulting payload and
  // all metadata, original assets and current parent authority.
  const m2Problem21 = validateM2ProblemRenderer21Continuity({ root, request, patch, native: loaded, row,
    question, bankFromBytes, cache, final, m2Problem21CurrentUiContinuation });
  const e023Display = validateM2E023SolutionDisplayContinuity({ root, request, patch, native: loaded, row,
    question, bankFromBytes });
  if (m2Problem21 || e023Display) {
    const normalizedQuestion = { ...question }, normalizedPatch = { ...patch, sourceReview: { ...patch.sourceReview } };
    const owned = new Set();
    for (const [context, fields, option] of [
      [m2Problem21, m2Problem21?.normalizedProblemFields, "m2ProblemRenderer21Continuity"],
      [e023Display, e023Display?.ownedFields, "e023SolutionDisplayContinuity"],
    ]) {
      if (!context) continue;
      if (!Array.isArray(fields) || !fields.length || new Set(fields).size !== fields.length)
        fail("exact owned display field inventory required");
      for (const field of fields) {
        if (owned.has(field)) fail("display comparison field ownership overlaps");
        owned.add(field);
        if (Object.hasOwn(context.normalizedQuestion, field)) normalizedQuestion[field] = context.normalizedQuestion[field];
        else delete normalizedQuestion[field];
      }
      delete normalizedPatch.sourceReview[option];
    }
    const inner = validateReviewedSourceReassessment({ root, request, patch: normalizedPatch, metadata,
      question: normalizedQuestion, final, supportedFields, canonicalBefore, canonicalAfter, issuedSourceReview, cache,
      m2Problem21CurrentUiContinuation });
    const originalSourceReviewSha256 = sha256(stable(inner));
    return { ...inner, studentPayloadSha256: sha256(stable(payload)),
      ...(m2Problem21 ? { m2ProblemRenderer21Continuity: { ...m2Problem21.proof, originalSourceReviewSha256 } } : {}),
      ...(e023Display ? { e023SolutionDisplayContinuity: { ...e023Display.proof, originalSourceReviewSha256 } } : {}) };
  }
  const m2E006 = validateM2E006ProblemContinuity({ root, request, patch, native: loaded, row,
    question, studentPayload, bankFromBytes, cache });
  if (m2E006) {
    const inner = validateReviewedSourceReassessment({ root, request, patch: m2E006.normalizedPatch,
      metadata, question: m2E006.normalizedQuestion, final, supportedFields, canonicalBefore, canonicalAfter,
      issuedSourceReview, cache });
    return { ...inner, studentPayloadSha256: sha256(stable(payload)), m2E006ProblemContinuity: {
      ...m2E006.proof, originalSourceReviewSha256: sha256(stable(inner)) } };
  }
  const m2Renderer = validateM2ProblemRendererContinuity({ root, request, patch, native: loaded, row,
    question, studentPayload, bankFromBytes, cache });
  if (m2Renderer) {
    // Only the authenticated four renderer fields are compared through the
    // original prefigure view. Native, definition, retained-primary, scope and
    // live original asset validators all run again without exceptions or writes.
    const inner = validateReviewedSourceReassessment({ root, request, patch: m2Renderer.normalizedPatch,
      metadata, question: m2Renderer.normalizedQuestion, final, supportedFields, canonicalBefore, canonicalAfter,
      issuedSourceReview, cache });
    return { ...inner, studentPayloadSha256: sha256(stable(payload)), m2ProblemRendererContinuity: {
      ...m2Renderer.proof, originalSourceReviewSha256: sha256(stable(inner)) } };
  }
  const m2CcRenderer = validateReviewedM2CcRendererContinuity({ root, request, patch, native: loaded, row,
    question, studentPayload, bankFromBytes, cache });
  const rendererContinuity = patch.sourceReview.rendererProof === undefined ? null :
    validateReviewedCurrentRendererContinuity({ root, request, patch, native: loaded, row,
      question, studentPayload, bankFromBytes, cache });
  if (!m2CcRenderer && !rendererContinuity && (!equal(payload, studentPayload(reviewedBank[ordinal - 1])) ||
      !equal(payload, studentPayload(committedBank[ordinal - 1])))) fail("current student payload differs from the reviewed source");
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
  const identityOnly = request.registrationMode === "IDENTITY_FINGERPRINT_ONLY";
  const proposalFinalization = identityOnly && patch.sourceReview.proposalFinalization === undefined ? null :
    validateNativeProposalFinalization({ root, request, patch, native: loaded, row,
      accepted, question: m2CcRenderer?.originalQuestion || question, final, metadata, issuedSourceReview, studentPayload, bankFromBytes, canonicalBefore, canonicalAfter, cache });
  if (m2CcRenderer && (proposalFinalization?.proof?.schemaVersion !== "archive-native-proposal-finalization-v1" ||
      !proposalFinalization.proof.nativeProposalBindings?.length ||
      proposalFinalization.proof.nativeProposalBindings.some(binding => binding.type !== "CC") ||
      !proposalFinalization.proof.definitions?.length ||
      proposalFinalization.proof.definitions.some(definition => definition.collection !== "concepts")))
    fail("typed M2 renderer bridge requires the original CC finalizer to succeed");
  if (proposalFinalization) Object.assign(accepted, proposalFinalization.fields);
  const currentDefinitionApplication = validateM2S1CurrentDefinitionApplication({ root, request, patch, native: loaded, row,
    accepted, question, final, canonicalBefore, canonicalAfter, studentPayload,
    studentFields: REASSESSED_STUDENT_FIELDS, bankFromBytes, cache });
  if (currentDefinitionApplication) Object.assign(accepted, currentDefinitionApplication.fields);
  const prerequisiteExistingApplication = validateM2S1PrerequisiteExistingApplication({ root, request, patch, native: loaded, row,
    accepted, question, final, canonicalBefore, canonicalAfter, studentPayload,
    studentFields: REASSESSED_STUDENT_FIELDS, bankFromBytes, cache });
  if (prerequisiteExistingApplication) Object.assign(accepted, prerequisiteExistingApplication.fields);
  const currentTargetApplication = validateM3S2CurrentTargetApplication({ root, request, patch, native: loaded, row,
    accepted, question, final, canonicalBefore, canonicalAfter, rendererContinuity, studentPayload,
    studentFields: REASSESSED_STUDENT_FIELDS, bankFromBytes, cache });
  if (currentTargetApplication) Object.assign(accepted, currentTargetApplication.fields);
  const unchangedPrimary = identityOnly ? null : bindUnchangedReviewedPrimary({ native: loaded, row, accepted,
    patch, question, final, canonicalBefore, canonicalAfter, proposalFinalization });
  if (unchangedPrimary) Object.assign(accepted, unchangedPrimary.fields);
  const scopeFieldBindings = bindReviewedNativeScopeFields({ request, patch, native: loaded, row,
    accepted, question, final, canonicalBefore, canonicalAfter, cache });
  if (scopeFieldBindings) Object.assign(accepted, scopeFieldBindings.fields);
  const retainedNativeFields = validateReviewedNativeRetainedFields({ root, request, patch, native: loaded, row,
    accepted, question, final, canonicalBefore, canonicalAfter, studentPayload, studentFields: REASSESSED_STUDENT_FIELDS, bankFromBytes, cache });
  if (retainedNativeFields) Object.assign(accepted, retainedNativeFields.fields);
  const retainedScopeTransport = bindReviewedRetainedScopeTransport({ root, request, patch, native: loaded, row,
    metadata, accepted, question, final, retainedNativeFields, canonicalBefore, canonicalAfter,
    issuedScopeProof: issuedSourceReview?.retainedScopeTransport, cache });
  if (retainedScopeTransport) Object.assign(accepted, retainedScopeTransport.fields);
  const rationaleBindings = {};
  if (!identityOnly) for (const field of ["primaryMethod", "decisiveStep"]) {
    if (!Object.hasOwn(patch.after, field) && !Object.hasOwn(question, field)) continue;
    let value, origin;
    if (Object.hasOwn(prerequisiteExistingApplication?.retainedRationaleFields || {}, field)) {
      value = prerequisiteExistingApplication.retainedRationaleFields[field];
      origin = "PREREQUISITE_EXISTING_APPLICATION_UNCHANGED_NATIVE_SOURCE";
    } else if (Object.hasOwn(currentDefinitionApplication?.retainedRationaleFields || {}, field)) {
      value = currentDefinitionApplication.retainedRationaleFields[field];
      origin = "CURRENT_DEFINITION_APPLICATION_UNCHANGED_NATIVE_SOURCE";
    } else if (Object.hasOwn(accepted, field)) { value = accepted[field]; origin = "NATIVE_AFTER"; }
    else if (text(row[field])) { value = row[field]; origin = "NATIVE_ITEM_FIELD"; }
    else if (field === "primaryMethod" && !equal(committedBank[ordinal - 1][field], row.decisiveStep) &&
      [patch.after.primaryMethod, patch.after.decisiveStep,
      question.primaryMethod, question.decisiveStep].every(v => equal(v, row.decisiveStep))) {
      // This schema's reviewed decisive step may be carried verbatim as both rationale
      // fields, including when the review commit still carries an older source method.
      // Keep already-matching source provenance stable for issued receipts. This is
      // not a separately authored method judgment or new mathematical QA.
      value = row.decisiveStep; origin = "NATIVE_DECISIVE_STEP_VERBATIM";
    } else if (text(committedBank[ordinal - 1][field])) { value = committedBank[ordinal - 1][field]; origin = "REVIEW_COMMIT_SOURCE_FIELD"; }
    else if (field === "primaryMethod" && review.schemaVersion === "m3-s2-complete-semantic-review-v1" &&
      Object.keys(patch.after).length === 2 && ["sourceFingerprint", "contentFingerprint"].every(key => Object.hasOwn(patch.after, key)) &&
      metadata.metadataApprovalType === "FINAL_QA" && metadata.reviewStatus === "reviewed_pass" &&
      metadata.tagStatus === "reviewed_pass" && String(metadata.metadataStatus || "").startsWith("approved_") &&
      metadata.metaFoundationStatus === "ACTIVE" &&
      ["primaryMethod", "decisiveStep"].every(key => [metadata[key], question[key], final[key]].every(v => equal(v, row.decisiveStep)))) {
      // A fingerprint-only reassessment retains this already issued value. Both
      // rationale fields still require the same immutable native decisive step;
      // no omitted or newly supplied rationale is approved by this branch.
      value = row.decisiveStep; origin = "REGISTERED_NATIVE_DECISIVE_STEP_UNCHANGED";
    } else fail(`rationale has no immutable native evidence: ${field}`);
    if (!text(value) || Object.hasOwn(question, field) && !equal(question[field], value))
      fail(`current source rationale differs from native evidence: ${field}`);
    accepted[field] = value;
    rationaleBindings[field] = { origin, valueSha256: sha256(value) };
  }
  const rpmBindings = {};
  if (!identityOnly) for (const field of REVIEWED_RPM_FIELDS) {
    if (!Object.hasOwn(patch.after, field) && !Object.hasOwn(question, field)) continue;
    let value, origin;
    if (Object.hasOwn(prerequisiteExistingApplication?.nativeRpmAliasFields || {}, field)) {
      value = prerequisiteExistingApplication.nativeRpmAliasFields[field];
      origin = "PREREQUISITE_EXISTING_APPLICATION_NATIVE_RPM_ALIAS";
    } else if (Object.hasOwn(currentDefinitionApplication?.nativeRpmAliasFields || {}, field)) {
      value = currentDefinitionApplication.nativeRpmAliasFields[field];
      origin = "CURRENT_DEFINITION_APPLICATION_NATIVE_RPM_ALIAS";
    } else if (Object.hasOwn(accepted, field)) { value = accepted[field]; origin = "NATIVE_AFTER"; }
    else if (Object.hasOwn(question, field) && Object.hasOwn(committedBank[ordinal - 1], field)) {
      value = committedBank[ordinal - 1][field]; origin = "REVIEW_COMMIT_SOURCE_FIELD";
    } else fail(`RPM value has no immutable native evidence: ${field}`);
    if (Object.hasOwn(question, field) && !equal(question[field], value)) fail(`current source RPM differs from native evidence: ${field}`);
    accepted[field] = value;
    rpmBindings[field] = { origin, valueSha256: sha256(stable(value)) };
  }
  const nativeFamilyCourseTransport = bindReviewedNativeFamilyCourse({ root, request, patch, native: loaded, row,
    metadata, question, final, accepted, canonicalBefore, canonicalAfter,
    issuedProof: issuedSourceReview?.nativeFamilyCourseTransport,
    sourceReview: { schemaVersion: patch.sourceReview.schemaVersion, nativeSchemaVersion: review.schemaVersion,
      reviewCommit: loaded.spec.reviewCommit, reviewPath: loaded.spec.reviewPath, reviewRef: loaded.spec.reviewRef,
      questionUid: patch.questionUid, sourceOrdinal: ordinal, studentPayloadSha256: sha256(stable(payload)),
      rpmBindings, scope: "METADATA_SOURCE_BINDING_ONLY", newMathematicalQa: false } });
  if (nativeFamilyCourseTransport) Object.assign(accepted, nativeFamilyCourseTransport.fields);
  const nativeRpmCourseTransport = bindReviewedM2NativeRpmCourse({ root, request, patch, native: loaded, row,
    metadata, question, committedQuestion: committedBank[ordinal - 1], accepted, final, canonicalBefore, canonicalAfter,
    issuedProof: issuedSourceReview?.nativeRpmCourseTransport, m2Problem21CurrentUiContinuation });
  if (nativeRpmCourseTransport) Object.assign(accepted, nativeRpmCourseTransport.fields);
  for (const [key, value] of Object.entries(patch.after)) {
    if (DERIVED_FIELDS.has(key) || equal(value, metadata[key] ?? null)) continue;
    // Source curriculum identifiers may be carried verbatim; they are never guessed from the reviewed grade.
    if (["curriculum", "curriculumKey", "courseKey"].includes(key) &&
        (equal(value, question[key]) || ["curriculum", "curriculumKey"].includes(key) && equal(value, question.curriculum))) continue;
    if (!Object.hasOwn(accepted, key) || !equal(accepted[key], value)) fail(`changed value not approved by native review: ${key}`);
  }
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
  const rationaleContinuity = bindReviewedNativeRationaleContinuity({ root, request, patch, native: loaded,
    row, question, final, rationaleBindings, canonicalBefore, canonicalAfter, cache });
  return { schemaVersion: patch.sourceReview.schemaVersion, nativeSchemaVersion: review.schemaVersion,
    reviewCommit: loaded.spec.reviewCommit, reviewPath: loaded.spec.reviewPath, reviewRef: loaded.spec.reviewRef,
    reviewedSourceBlobSha1: loaded.sourceBlob, reviewedSourceSha256: loaded.sourceSha256,
    reviewCommitSourceBlobSha1: loaded.committedBlob, questionUid: patch.questionUid, sourceOrdinal: ordinal,
    reviewer: loaded.reviewer, decision, studentPayloadSha256: sha256(stable(payload)),
    ...(rendererContinuity ? { rendererContinuity } : {}),
    ...(m2CcRenderer ? { m2CcRendererContinuity: { ...m2CcRenderer.proof,
      originalFinalizationSha256: sha256(stable(proposalFinalization.proof)) } } : {}),
    ...(Object.keys(rationaleBindings).length ? { rationaleBindings } : {}),
    ...(rationaleContinuity ? { rationaleContinuity } : {}),
    ...(Object.keys(rpmBindings).length ? { rpmBindings } : {}),
    ...(unchangedPrimary ? { unchangedPrimaryBindings: unchangedPrimary.proof } : {}),
    ...(scopeFieldBindings ? { scopeFieldBindings: scopeFieldBindings.proof } : {}),
    ...(retainedNativeFields ? { retainedNativeFields: retainedNativeFields.proof } : {}),
    ...(retainedScopeTransport ? { retainedScopeTransport: retainedScopeTransport.proof } : {}),
    ...(nativeFamilyCourseTransport ? { nativeFamilyCourseTransport: nativeFamilyCourseTransport.proof } : {}),
    ...(nativeRpmCourseTransport ? { nativeRpmCourseTransport: nativeRpmCourseTransport.proof } : {}),
    ...(currentDefinitionApplication ? { currentDefinitionApplication: currentDefinitionApplication.proof } : {}),
    ...(prerequisiteExistingApplication ? { prerequisiteExistingApplication: prerequisiteExistingApplication.proof } : {}),
    ...(currentTargetApplication ? { currentTargetApplication: currentTargetApplication.proof } : {}),
    ...(proposalFinalization?.proof ? { proposalFinalization: proposalFinalization.proof } : {}),
    ...(proposalFinalization?.technicalBindings?.length ? { technicalProposalBindings: proposalFinalization.technicalBindings } : {}),
    scope: identityOnly ? "IDENTITY_BINDING_ONLY" : "METADATA_SOURCE_BINDING_ONLY", newMathematicalQa: false };
}
