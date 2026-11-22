// A new BASIC parent after a separately reviewed current-source wording repair.
// This is not preservation of a prior canonical approval and grants no PT/TPL.
import { META_FILE, questionMetadataBytesAt } from "./question-metadata-format.mjs";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { REASSESSED_STUDENT_FIELDS } from "./reviewed-source-reassessment.mjs";

export const NATIVE_BASIC_PARENT_SCHEMA = "archive-reviewed-native-basic-parent-v1";
export const NATIVE_BASIC_PARENT_REVIEW_SCHEMA = "archive-reviewed-native-basic-parent-review-v1";
const INDEPENDENT_SCHEMA = "archive-m2s1-next-four-current-root-review-v1";
const META = "archive/data/question_metadata.json", IDENTITY = "archive/data/question_identity_map.json";
const LINKS = "archive/data/basic-scope-source-links.json";
const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const POLICY = "archive/data/archive2-canonical-projection-policy.json";
const EVIDENCE = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const D5 = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];
const BASIC = ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"];
const PARENT = ["grade", "curriculumKey", "courseKey", "L1", "L2"];
const STUDENT = [...new Set([...REASSESSED_STUDENT_FIELDS, "sharedMaterial", "sharedChoices", "imageAlt", "caption"])];
const fail = message => { throw Error("REVIEWED_NATIVE_BASIC_PARENT: " + message); };
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const blob = value => crypto.createHash("sha1").update(`blob ${value.length}\0`).update(value).digest("hex");
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const eq = (a, b) => stable(a) === stable(b);
const hash = value => sha(stable(value) ?? "undefined");
const pick = (row, keys) => Object.fromEntries(keys.map(k => [k, Object.hasOwn(row, k) ? row[k] : null]));
const omit = (row, keys) => Object.fromEntries(Object.entries(row).filter(([k]) => !keys.includes(k)));
const text = value => typeof value === "string" && value.trim();
const fingerprints = q => ({
  sourceFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null })),
  contentFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null })),
});
function local(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || /[\\\x00-\x1f]/.test(relative) || relative.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe path");
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink path");
  return full;
}
function gitBytes(root, commit, relative) {
  if (!/^[a-f0-9]{40}$/.test(commit || "")) fail("immutable commit required");
  local(root, relative);
  if (relative === META_FILE) return questionMetadataBytesAt(root, commit);
  try { return execFileSync("git", ["show", `${commit}:${relative}`], { cwd: root, maxBuffer: 128 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }); }
  catch { fail("immutable input unavailable"); }
}
function bank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const rows = ctx.window.questionBank || ctx.window.questions;
  if (!Array.isArray(rows)) fail("immutable source bank missing");
  return JSON.parse(JSON.stringify(rows));
}
function one(rows, uid, source, ordinal, what) {
  const selected = rows?.filter(r => r.questionUid === uid) || [];
  if (selected.length !== 1 || selected[0].sourceArchiveFile !== source || selected[0].sourceOrdinal !== ordinal) fail(`${what} UID/source/ordinal mismatch`);
  return selected[0];
}
function bound(root, request, item, commit, reviewPath, ref) {
  if (!ref || !/^[a-f0-9]{64}$/.test(ref.sha256 || "") || !ref.path?.startsWith(EVIDENCE) || !ref.path.endsWith(".json") ||
      !request.approval.evidenceRefs.some(r => eq(r, ref)) || !item.evidenceRefs.some(r => eq(r, ref))) fail("SHA-bound review required");
  const raw = fs.readFileSync(local(root, ref.path));
  if (sha(raw) !== ref.sha256 || !gitBytes(root, commit, reviewPath).equals(raw)) fail("review differs from immutable Git bytes");
  return JSON.parse(raw);
}
function textOnly(value, key = "") {
  if (/image|svg|figure|asset|diagram|canvas|video|audio/i.test(key) && value !== undefined && value !== null && value !== "" && value !== false) fail("renderer assets are outside this text-only BASIC review");
  if (typeof value === "string" && /assets\/|data:image|<(?:img|svg|object|iframe|canvas|video|audio)\b|\b(?:src|href|srcset|style)\s*=|url\s*\(/i.test(value)) fail("renderer dependency is outside this text-only BASIC review");
  if (value && typeof value === "object") for (const [child, v] of Object.entries(value)) textOnly(v, child);
}

export function verifyReviewedNativeBasicParent({ root, request, review, item, current, previous, row, identity, crosswalk }) {
  const spec = request.approval.sourceReview;
  const specKeys = ["schemaVersion", "priorCommit", "priorFingerprintSourceCommit", "nativeReviewCommit", "nativeReviewPath", "nativeReviewRef", "independentReviewCommit", "independentReviewPath", "independentReviewRef"];
  if (!spec || spec.schemaVersion !== NATIVE_BASIC_PARENT_SCHEMA || !eq(Object.keys(spec).sort(), specKeys.sort()) || request.items.length !== 1 ||
      request.registryChanges !== undefined || request.difficultyEvidence !== undefined || request.scope !== undefined || request.registrationMode !== undefined || request.approval.sourceRebind !== undefined ||
      !eq(Object.keys(item).sort(), ["questionUid", "sourceOrdinal", "before", "after", "basicParent", "reason", "evidenceRefs"].sort())) fail("new BASIC scope");
  const source = request.sourceArchiveFile, sourcePath = `archive/exams/${source}`, uid = item.questionUid, ordinal = item.sourceOrdinal;
  if (!/^original\/middle\/m2\/1(?:mid|final)\//.test(source) || request.examUid !== path.basename(source, ".js")) fail("M2 semester-one source identity required");
  const rawBefore = gitBytes(root, request.previousSourceCommit, sourcePath), rawCurrent = fs.readFileSync(local(root, sourcePath));
  const beforeBank = bank(rawBefore), currentBank = bank(rawCurrent);
  if (blob(rawBefore) !== request.previousSourceBlobSha1 || blob(rawCurrent) !== request.expectedSourceBlobSha1 ||
      beforeBank.length !== request.expectedQuestionCount || currentBank.length !== beforeBank.length || !eq(beforeBank[ordinal - 1], previous) || !eq(currentBank[ordinal - 1], current) ||
      beforeBank.some((q, i) => i !== ordinal - 1 && !eq(q, currentBank[i]))) fail("reviewed source scope or non-selected question drift");
  textOnly(previous); textOnly(current);
  const changed = Object.keys({ ...previous, ...current }).filter(k => !eq(previous[k], current[k])).sort();
  if (!eq(changed, ["content"])) fail("only the reviewed wording field may change");
  const native = bound(root, request, item, spec.nativeReviewCommit, spec.nativeReviewPath, spec.nativeReviewRef);
  if (native.schemaVersion !== "m2-s1-meta-review-v1" || native.sourceArchiveFile !== source || native.reviewedQuestionCount !== request.expectedQuestionCount ||
      !text(native.judgedBy?.agent ?? native.owner) || native.items?.length !== request.expectedQuestionCount ||
      new Set(native.items.map(r => r.questionUid)).size !== native.items.length || new Set(native.items.map(r => r.sourceOrdinal)).size !== native.items.length ||
      native.items.some(r => !Number.isInteger(r.sourceOrdinal) || r.sourceOrdinal < 1 || r.sourceOrdinal > request.expectedQuestionCount)) fail("native review denominator/identity mismatch");
  const decisions = native.items.filter(r => r.questionUid === uid), decision = decisions[0];
  if (decisions.length !== 1 || decision.sourceOrdinal !== ordinal || decision.semanticDecision?.curriculumProvenance !== "SOURCE_EXPLICIT_PRESERVED" ||
      decision.semanticDecision.machineCurriculum !== "2022" || decision.semanticDecision.semanticCurriculum !== "2022" ||
      decision.semanticDecision.problemTypeKey !== null || decision.semanticDecision.templateKey !== null ||
      !eq(decision.proposalRefs, []) || !decision.contentDebt?.some(d => d.type === "MULTIPLE_VALID_CHOICES_IN_SINGLE_CHOICE_STEM") ||
      !decision.registrationDebt?.includes("ACTIVE_SCOPED_PT_TPL_BINDING_NOT_ESTABLISHED") || decision.registrationDebt.some(d => /CURRICULUM_EVIDENCE_DEBT/.test(d))) fail("native BASIC-only disposition is unresolved or outside this scope");
  const nativeBeforeBytes = gitBytes(root, native.baseSha, sourcePath), nativeCommitted = bank(gitBytes(root, spec.nativeReviewCommit, sourcePath)), nativeBefore = bank(nativeBeforeBytes);
  if (blob(nativeBeforeBytes) !== native.sourceGitBlobSha || nativeBefore.length !== beforeBank.length || nativeCommitted.length !== beforeBank.length ||
      !eq(pick(nativeBefore[ordinal - 1], STUDENT), pick(previous, STUDENT)) || !eq(pick(nativeCommitted[ordinal - 1], STUDENT), pick(previous, STUDENT))) fail("current student input is not the immutable native input");
  const independent = bound(root, request, item, spec.independentReviewCommit, spec.independentReviewPath, spec.independentReviewRef);
  if (independent.schemaVersion !== INDEPENDENT_SCHEMA || independent.reviewScope !== "CURRENT_STUDENT_MATH_RENDERER_AND_EXACT_BASIC_PARENT_ONLY_WITH_NATIVE_CONTEXT" ||
      !text(independent.reviewer) || independent.reviewer === (native.judgedBy?.agent ?? native.owner) || independent.reviewer !== request.approval.approvedBy ||
      independent.baseCommit !== request.previousSourceCommit || independent.newBasicParentApprovedCount !== 1 ||
      independent.newAdvancedApprovals !== 0 || independent.newDifficultyJudgments !== 0 || independent.newBlindReviews !== 0 || independent.newReview2 !== 0 ||
      independent.nonSelectedQuestionChanges !== 0 || !Array.isArray(independent.rows) || new Set(independent.rows.map(r => r.questionUid)).size !== independent.rows.length) fail("independent new BASIC authority mismatch");
  const applications = independent.rows.filter(r => r.questionUid === uid), a = applications[0];
  if (applications.length !== 1 || a.sourceOrdinal !== ordinal || a.sourceArchiveFile !== source || a.expectedQuestionCount !== request.expectedQuestionCount ||
      a.basicParentDisposition !== "APPROVED_NEW_BASIC_ONLY" || !eq(a.basicParent, item.basicParent) || a.sourceRepairDisposition !== "APPROVED_NARROW_CURRENT_REVIEW" ||
      a.currentStudentMathAndRendererConsistency !== "PASS" || a.studentAnswerPreserved !== true || a.studentSolutionPreserved !== true || a.assetsPreserved !== true ||
      a.advancedApproval !== "HOLD_PRESERVED" || a.newAdvancedApproval !== false || a.newBlindReview !== false || a.newReview2 !== false ||
      a.difficultyDisposition !== "TRANSPORT_EXACT_ACCEPTED_NATIVE_ONLY" || !eq(a.allowedChangedFields, ["content"]) ||
      a.nativeItemStableSha256 !== hash(decision) || a.nativeDifficultyStableSha256 !== hash(decision.finalDifficulty) ||
      a.nativeReviewRef?.commit !== spec.nativeReviewCommit || a.nativeReviewRef.path !== spec.nativeReviewPath || a.nativeReviewRef.sha256 !== spec.nativeReviewRef.sha256 ||
      a.beforeQuestionStableSha256 !== hash(previous) || a.afterQuestionStableSha256 !== hash(current)) fail("independent exact current review mismatch");
  for (const [ref, bytes, commit] of [[a.sourceBefore, rawBefore, request.previousSourceCommit], [a.sourceAfter, rawCurrent, undefined]]) {
    const keys = ["gitBlobSha1", "sha256", "bytes", ...(commit ? ["commit", "path"] : ref && Object.hasOwn(ref, "path") ? ["path"] : [])];
    if (!ref || !eq(Object.keys(ref).sort(), keys.sort()) || ref.gitBlobSha1 !== blob(bytes) || ref.sha256 !== sha(bytes) || ref.bytes !== bytes.length ||
        Object.hasOwn(ref, "path") && ref.path !== sourcePath || commit && ref.commit !== commit) fail("independent source hash mismatch");
  }
  const edit = a.literalTextReplacement;
  if (!edit || edit.exactOccurrenceCount !== 1 || ![edit.before, edit.after].every(s => typeof s === "string" && s.length > 0 && s.length <= 48 && /^[\p{Script=Hangul} .,!?·'’“”():;-]+$/u.test(s)) ||
      edit.before === edit.after || previous.content.split(edit.before).length !== 2 || previous.content.replace(edit.before, edit.after) !== current.content) fail("exact Korean wording repair required");
  const oldMetadata = JSON.parse(gitBytes(root, spec.priorCommit, META)), oldIdentity = JSON.parse(gitBytes(root, spec.priorCommit, IDENTITY));
  const prior = one(oldMetadata.records, uid, source, ordinal, "prior metadata"), priorId = one(oldIdentity.records, uid, source, ordinal, "prior identity");
  const oldBank = bank(gitBytes(root, spec.priorFingerprintSourceCommit, sourcePath));
  if (oldBank.length !== request.expectedQuestionCount || !eq(fingerprints(oldBank[ordinal - 1]), item.before) ||
      !eq(item.before, pick(prior, ["sourceFingerprint", "contentFingerprint"])) || priorId.sourceFingerprint !== item.before.sourceFingerprint ||
      !eq(omit(row, ["sourceFingerprint", "contentFingerprint", ...D5]), omit(prior, ["sourceFingerprint", "contentFingerprint", ...D5])) ||
      !eq(omit(identity, ["sourceFingerprint"]), omit(priorId, ["sourceFingerprint"]))) fail("prior metadata/identity or historical fingerprint changed");
  const nativeD5 = pick(decision.finalDifficulty || {}, D5), priorD5 = pick(prior, D5);
  if (Object.values(nativeD5).some(v => v === null) || !eq(pick(current, D5), nativeD5) ||
      !eq(pick(row, D5), priorD5) && !eq(pick(row, D5), nativeD5)) fail("difficulty is neither the original value nor the exact accepted native value");
  if (row.metadataStatus !== "approved_partial_with_explicit_holds" || row.metadataApprovalType || row.registrationUpdateState || row.problemTypeKey || row.templateKey ||
      row.fieldStatus?.problemType !== "manual_review_pending" || row.fieldStatus?.template !== "manual_review_pending" ||
      [previous, current, nativeBefore[ordinal - 1], nativeCommitted[ordinal - 1]].some(q => BASIC.some(k => !eq(q[k], row[k]))) ||
      [previous, current].some(q => q.problemTypeKey || q.templateKey || q.curriculum !== "2022" || q.curriculumKey !== undefined && q.curriculumKey !== "2022")) fail("existing BASIC values/explicit curriculum/type HOLD changed");
  const bp = item.basicParent, masterRef = independent.canonicalMasterRef;
  if (!bp || !eq(Object.keys(bp).sort(), PARENT.slice().sort()) || bp.grade !== "중2" || bp.curriculumKey !== "2022" || bp.courseKey !== "M2-1" ||
      !PARENT.every(k => text(bp[k])) || masterRef?.path !== MASTER || masterRef.commit !== request.previousSourceCommit) fail("explicit current parent scope mismatch");
  const masterRaw = fs.readFileSync(local(root, MASTER)), master = JSON.parse(masterRaw), policy = JSON.parse(fs.readFileSync(local(root, POLICY)));
  if (!masterRaw.equals(gitBytes(root, masterRef.commit, MASTER)) || sha(masterRaw) !== masterRef.sha256 || blob(masterRaw) !== masterRef.gitBlobSha1 ||
      policy.canonicalMasterSha256 !== sha(masterRaw) || !policy.gradeCourseAllowlist?.some(r => r.grade === bp.grade && r.curriculumKey === bp.curriculumKey && r.courseKey === bp.courseKey) ||
      master.records?.filter(r => r.curriculum === bp.curriculumKey && r.scope === bp.courseKey && r.majorUnit === bp.L1 && r.midUnit === bp.L2 && r.majorStatus === "RPM_VERIFIED" && r.midStatus === "RPM_VERIFIED").length !== 1) fail("current canonical parent authority mismatch");
  const parents = crosswalk.filter(r => r.grade === bp.grade && r.curriculumKey === bp.curriculumKey && r.courseKey === bp.courseKey && r.standardUnitKey === row.standardUnitKey && r.subUnitKey === row.subUnitKey);
  if (!parents.length || new Set(parents.map(r => stable(pick(r, PARENT)))).size !== 1 || !parents.every(r => PARENT.every(k => r[k] === bp[k]))) fail("explicit curriculum has no single canonical crosswalk parent");
  const priorLinks = JSON.parse(gitBytes(root, spec.priorCommit, LINKS));
  if (priorLinks.records?.some(r => r.sourceFile === source && Number(r.sourceOrdinal) === ordinal)) fail("new BASIC parent cannot replace an existing scoped link");
  const runtimeRoot = local(root, "archive/data/meta-foundation/runtime");
  for (const file of fs.readdirSync(runtimeRoot).filter(f => /^[a-z0-9-]+-v[0-9]+\.json$/.test(f)))
    if (JSON.parse(fs.readFileSync(local(root, `archive/data/meta-foundation/runtime/${file}`))).records?.some(r => r.questionUid === uid)) fail("runtime approval or explicit runtime HOLD is outside this BASIC-only lane");
  const recorded = review.questions?.filter(r => r.questionUid === uid) || [];
  if (review.schemaVersion !== NATIVE_BASIC_PARENT_REVIEW_SCHEMA || review.status !== "PASS" || review.decision !== "REGISTER_NEW_BASIC_PARENT_ONLY" ||
      !text(review.preparedBy) || review.reviewedBy !== independent.reviewer || review.reviewedBy === review.preparedBy ||
      review.priorCommit !== spec.priorCommit || review.expectedQuestionCount !== request.expectedQuestionCount || review.expectedSourceBlobSha1 !== request.expectedSourceBlobSha1 ||
      review.newBasicParentApprovals !== 1 || review.preservedMetadataApprovals !== 0 || review.advancedApprovals !== 0 || review.newDifficultyJudgments !== 0 ||
      recorded.length !== 1 || !eq(recorded[0], { questionUid: uid, sourceOrdinal: ordinal, nativeItemSha256: hash(decision),
        currentQuestionSha256: hash(current), priorMetadataSha256: hash(prior), priorIdentitySha256: hash(priorId), basicParent: bp })) fail("request wrapper differs from the independent BASIC review");
  return { sourceReviewSchema: NATIVE_BASIC_PARENT_SCHEMA, priorCommit: spec.priorCommit,
    nativeReviewRef: { commit: spec.nativeReviewCommit, path: spec.nativeReviewPath, sha256: spec.nativeReviewRef.sha256 },
    independentReviewRef: { commit: spec.independentReviewCommit, path: spec.independentReviewPath, sha256: spec.independentReviewRef.sha256 },
    nativeItemSha256: hash(decision), currentQuestionSha256: hash(current), protectedMetadataSha256: hash(omit(prior, ["sourceFingerprint", "contentFingerprint", ...D5])),
    protectedIdentitySha256: hash(omit(priorId, ["sourceFingerprint"])), originalDifficulty: priorD5, acceptedNativeDifficulty: nativeD5,
    newBasicParentApprovals: 1, preservedMetadataApprovals: 0, newMetadataApprovals: 1, advancedApprovals: 0,
    newDifficultyJudgments: 0, newBlindReviews: 0, newReview2: 0 };
}
