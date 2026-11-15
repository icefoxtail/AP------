import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const nonempty = value => typeof value === "string" && value.trim().length > 0;
const fail = message => { throw new Error(`native reviewed parent: ${message}`); };

function repositoryPath(root, file) {
  if (!nonempty(file) || path.isAbsolute(file) || file.includes("\\") || file.includes("\0") ||
      file.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe evidence path");
  const full = path.resolve(root, file);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink evidence path");
  return full;
}
function localBytes(root, file) {
  try { return fs.readFileSync(repositoryPath(root, file)); } catch { fail("evidence missing or unsafe"); }
}

function evidence(root, request, patch, ref) {
  if (!ref || !SHA256.test(ref.sha256 || "") ||
      ![request.approval?.evidenceRefs, patch.evidenceRefs].every(refs =>
        refs?.some(r => r.path === ref.path && r.sha256 === ref.sha256)))
    fail("evidence must bind approval and item");
  const bytes = localBytes(root, ref.path);
  if (sha(bytes) !== ref.sha256) fail("evidence SHA mismatch");
  try { return { bytes, doc: JSON.parse(bytes.toString("utf8")) }; } catch { fail("invalid evidence JSON"); }
}

// An old crosswalk's MISSING flag describes its old unit projection. It cannot
// approve a parent. This opt-in instead requires an already validated immutable
// native review of that precise RPM path, the current master leaf, and a distinct
// current ACTIVE curriculum/unit/PT binding. None of these documents is changed.
export function validateNativeReviewedParent({ root, request, patch, row, resolved, sourceReview }) {
  const target = patch.targetParentRef, spec = target?.nativeSourceReview;
  if (spec === undefined) return null;
  if (spec?.schemaVersion !== "archive-native-reviewed-parent-v1" || request.scope !== "PARTIAL_UIDS" ||
      request.approval?.type !== "FINAL_QA" || request.approval.metadataReviewed !== true ||
      request.registrationMode !== undefined || request.approval.sourceRebind || request.registryChanges?.length ||
      patch.typeHold !== undefined || patch.basicScopeParentRef || patch.semanticBinding || patch.approvedMetadataRef || target.crosswalkRef)
    fail("requires exclusive FINAL_QA native parent carrier without registry changes");
  if (!sourceReview || sourceReview.nativeSchemaVersion !== "m2-s2-meta-review-v1" ||
      sourceReview.scope !== "METADATA_SOURCE_BINDING_ONLY" || sourceReview.newMathematicalQa !== false ||
      sourceReview.schemaVersion !== "archive-reviewed-source-reassessment-v1" ||
      !SHA1.test(spec.reviewCommit || "") || spec.reviewCommit !== sourceReview.reviewCommit ||
      spec.reviewPath !== sourceReview.reviewPath || !same(spec.reviewRef, sourceReview.reviewRef) ||
      spec.questionUid !== patch.questionUid || spec.sourceOrdinal !== patch.sourceOrdinal ||
      sourceReview.questionUid !== patch.questionUid || sourceReview.sourceOrdinal !== patch.sourceOrdinal ||
      patch.questionUid !== row.questionUid || patch.sourceOrdinal !== row.sourceOrdinal ||
      !same(patch.sourceReview?.reviewRef, spec.reviewRef) || patch.sourceReview?.reviewCommit !== spec.reviewCommit ||
      patch.sourceReview?.reviewPath !== spec.reviewPath)
    fail("validated native source review identity required");
  const review = evidence(root, request, patch, spec.reviewRef);
  // Re-read the exact original object, including on receipt-backed replay. A local
  // replacement with an updated self-declared hash is never native authority.
  repositoryPath(root, spec.reviewPath);
  let committed;
  try {
    if (execFileSync("git", ["rev-parse", "--verify", `${spec.reviewCommit}^{commit}`],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() !== spec.reviewCommit)
      fail("reviewCommit is not an exact commit");
    committed = execFileSync("git", ["show", `${spec.reviewCommit}:${spec.reviewPath}`],
      { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  } catch { fail("native Git review unavailable"); }
  if (sha(committed) !== spec.reviewRef.sha256 || !committed.equals(review.bytes)) fail("native review differs from Git");
  const rows = review.doc.items?.filter(r => r.questionUid === patch.questionUid && r.sourceOrdinal === patch.sourceOrdinal);
  const native = rows?.[0], accepted = native?.after;
  if (review.doc.schemaVersion !== "m2-s2-meta-review-v1" || review.doc.sourceArchiveFile !== request.sourceArchiveFile ||
      review.doc.reviewedQuestionCount !== request.expectedQuestionCount || rows?.length !== 1 ||
      !["CORRECT", "KEEP", "KEEP_SEMANTIC_RPM"].includes(native.rpmDecision) ||
      !nonempty(native.fieldReview?.classification) || !nonempty(native.fieldReview?.binding) || !accepted)
    fail("settled native parent review missing or ambiguous");
  const rpmPath = accepted.rpmPrimaryPath;
  if (!rpmPath || !["majorUnit", "midUnit", "l3", "l4"].every(k => nonempty(rpmPath[k])) ||
      !same(patch.after.rpmPrimaryPath, rpmPath) || !same(row.rpmPrimaryPath, rpmPath) ||
      accepted.rpmL1 !== rpmPath.majorUnit || accepted.rpmL2 !== rpmPath.midUnit ||
      row.rpmL1 !== rpmPath.majorUnit || row.rpmL2 !== rpmPath.midUnit ||
      sourceReview.rpmBindings?.rpmPrimaryPath?.origin !== "NATIVE_AFTER" ||
      sourceReview.rpmBindings.rpmPrimaryPath.valueSha256 !== sha(stable(rpmPath)) ||
      accepted.curriculum !== resolved.curriculum || accepted.problemTypeKey !== row.problemTypeKey ||
      accepted.templateKey !== row.templateKey)
    fail("parent and PT/TPL must be explicit native after values");
  if (target.path !== MASTER || target.curriculum !== resolved.curriculum || target.scope !== row.courseKey ||
      target.majorUnit !== rpmPath.majorUnit || target.midUnit !== rpmPath.midUnit ||
      row.L1 !== target.majorUnit || row.L2 !== target.midUnit)
    fail("requested parent differs from native path or current scope");
  const master = evidence(root, request, patch, target).doc;
  const parents = master.records?.filter(r => r.curriculum === target.curriculum && r.scope === target.scope &&
    r.majorUnit === target.majorUnit && r.midUnit === target.midUnit);
  const concepts = parents?.[0]?.concepts?.filter(r => r.concept === rpmPath.l3);
  const leaves = concepts?.[0]?.problemTypes?.filter(r => r.problemType === rpmPath.l4);
  if (parents?.length !== 1 || concepts?.length !== 1 || leaves?.length !== 1 ||
      parents[0].defaultSelectable === false || concepts[0].defaultSelectable === false || leaves[0].defaultSelectable === false)
    fail("exact selectable canonical master leaf required");
  const cross = spec.crosswalkRef;
  if (!/^archive\/data\/meta-foundation\/crosswalks\/rpm-primary-v1\.0\/middle2\.json$/.test(cross?.path || ""))
    fail("M2 native crosswalk reference required");
  const crosswalk = evidence(root, request, patch, cross).doc;
  const records = crosswalk.records?.filter(r => r.id === cross.recordId), reference = records?.[0];
  if (crosswalk.status !== "ACTIVE_REFERENCE" || records?.length !== 1 || cross.recordId !== native.rpmRecordId ||
      reference.mappingStatus !== "DIRECT_BINDING_GAP" || reference.bindingStatus !== "MISSING" ||
      reference.curriculum !== resolved.curriculum || reference.scope !== target.scope || !same(reference.rpmPath, rpmPath) ||
      reference.problemTypeKey !== row.problemTypeKey || reference.templateKey !== row.templateKey)
    fail("immutable reviewed RPM reference/context mismatch");
  const { binding, pt, tpl, pack } = resolved;
  if (binding?.status !== "ACTIVE" || binding.curriculum !== resolved.curriculum || binding.standardCourse !== resolved.course ||
      binding.standardUnitKey !== row.standardUnitKey || (binding.subUnitKey ?? null) !== (row.subUnitKey ?? null) ||
      binding.problemTypeKey !== row.problemTypeKey || pt?.status !== "ACTIVE" || tpl?.status !== "ACTIVE" ||
      pt.problemTypeKey !== row.problemTypeKey || tpl.templateKey !== row.templateKey || tpl.parentProblemTypeKey !== pt.problemTypeKey ||
      !nonempty(pt.ownerPack) || !nonempty(tpl.ownerPack) || pack?.meta?.canonicalStatus !== "ACTIVE" ||
      pack.meta.packId !== (binding.ownerPack || pt.ownerPack) || !pack.meta.curricula?.includes(resolved.curriculum) ||
      !pack.meta.standardCourses?.includes(resolved.course) || !pack.meta.standardCourses?.includes(row.courseKey) ||
      binding.L1 && binding.L1 !== target.majorUnit || binding.L2 && binding.L2 !== target.midUnit)
    fail("current ACTIVE binding/owner/parent conflict");
  return { schemaVersion: spec.schemaVersion, questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal,
    reviewCommit: spec.reviewCommit, reviewPath: spec.reviewPath, reviewRef: spec.reviewRef,
    nativeItemSha256: sha(stable(native)), studentPayloadSha256: sourceReview.studentPayloadSha256,
    masterRef: { path: target.path, sha256: target.sha256 }, crosswalkRef: cross,
    parent: { curriculum: target.curriculum, scope: target.scope, L1: target.majorUnit, L2: target.midUnit },
    exactActiveTuple: { curriculum: binding.curriculum, standardCourse: binding.standardCourse,
      standardUnitKey: binding.standardUnitKey, subUnitKey: binding.subUnitKey ?? null, problemTypeKey: pt.problemTypeKey,
      templateKey: tpl.templateKey, bindingOwnerPack: pack.meta.packId, problemTypeOwnerPack: pt.ownerPack, templateOwnerPack: tpl.ownerPack },
    sharedCrosswalkModified: false, canonicalDefinitionsModified: false, newMathematicalQa: false };
}
