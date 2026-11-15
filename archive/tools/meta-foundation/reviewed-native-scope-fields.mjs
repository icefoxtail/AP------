import crypto from "node:crypto";

export const NATIVE_SCOPE_FIELDS = Object.freeze(["semanticSourceScope", "semanticScopeRelation"]);
const SCHEMA = "archive-native-reviewed-scope-fields-v1";
const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const SOURCE_REVIEW_KEYS = new Set(["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "scopeFieldBinding"]);
const PRIMARY = ["standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"];
const stable = value => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const equal = (left, right) => stable(left) === stable(right);
const digest = value => crypto.createHash("sha256").update(stable(value)).digest("hex");
const text = value => typeof value === "string" && value.trim();
const fail = message => { throw new Error(`native scope fields: ${message}`); };

// This is a retained-value adapter, not an inference of a question's course.
// Its caller has already authenticated both immutable native source banks and
// checked their protected student payload against the current question. Only
// the observed M3-1/current-scope provenance pair is admitted here; lower-grade
// and historical/display scope decisions remain outside this contract.
export function bindReviewedNativeScopeFields({ request, patch, native, row, accepted,
  question, final, canonicalBefore, canonicalAfter }) {
  const spec = patch.sourceReview?.scopeFieldBinding;
  if (spec === undefined) return null;
  if (!spec || typeof spec !== "object" || Array.isArray(spec) ||
      Object.keys(spec).some(key => !["schemaVersion", "fields"].includes(key)) ||
      spec.schemaVersion !== SCHEMA || !equal(spec.fields, NATIVE_SCOPE_FIELDS))
    fail("explicit exact two-field scope contract required");
  if (request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.metadataReviewed !== true || request.registrationMode !== undefined ||
      request.approval.sourceRebind !== undefined || patch.rebind !== undefined ||
      !Object.hasOwn(patch.after || {}, "sourceFingerprint") ||
      Object.keys(patch.sourceReview).some(key => !SOURCE_REVIEW_KEYS.has(key)))
    fail("requires an exclusive ordinary PARTIAL FINAL_QA native-source repair");
  if (native.review.schemaVersion !== "m3-s2-complete-semantic-review-v1" ||
      !["KEEP", "CORRECT", "KEEP_SEMANTIC_RPM"].includes(row.decision) ||
      native.review.sourceArchiveFile !== request.sourceArchiveFile ||
      !/^original\/middle\/m3\/(?:2mid|2final)\/[^/]+\.js$/.test(request.sourceArchiveFile || "") ||
      row.questionUid !== patch.questionUid || row.ordinal !== patch.sourceOrdinal)
    fail("requires the exact settled M3 native UID and source");
  const reviewed = native.reviewedBank[patch.sourceOrdinal - 1], committed = native.committedBank[patch.sourceOrdinal - 1];
  if (!reviewed || !committed) fail("native source ordinal missing");
  const fields = {};
  for (const field of NATIVE_SCOPE_FIELDS) {
    if (Object.hasOwn(accepted, field) || Object.hasOwn(row.after || {}, field) ||
        !Object.hasOwn(reviewed, field) || !Object.hasOwn(committed, field) ||
        !Object.hasOwn(question, field) || !Object.hasOwn(patch.after, field) ||
        !Object.hasOwn(final, field) || !text(committed[field]) ||
        [reviewed[field], question[field], patch.after[field], final[field]].some(value => !equal(value, committed[field])))
      fail(`field is not an unchanged explicit native source value: ${field}`);
    fields[field] = committed[field];
  }
  if (fields.semanticSourceScope !== "M3-1" || fields.semanticScopeRelation !== "CURRENT_SCOPE")
    fail("scope pair is outside the reviewed current-grade M3-1 contract");
  const base = row.rpm?.base, curriculum = final.curriculumKey || final.curriculum;
  if (!base || Array.isArray(base) || base.scope !== fields.semanticSourceScope ||
      base.curriculum !== "2015" || curriculum !== "2015" ||
      row.rpm.originalCurriculum !== "2015" || final.curriculum !== "2015" ||
      final.curriculumKey !== "2015" || final.courseKey !== base.scope ||
      !text(base.majorUnit) || !text(base.midUnit) || !text(base.recordId) ||
      final.rpmPrimaryId !== base.recordId)
    fail("native RPM/original curriculum and registered current scope disagree");
  for (const source of [reviewed, committed, question]) {
    if (source.curriculum !== "2015" || source.sourceCurriculum !== undefined && source.sourceCurriculum !== "2015" ||
        source.grade !== undefined && source.grade !== "M3" || source.rpmPrimaryId !== base.recordId)
      fail("immutable source curriculum/grade/RPM provenance disagrees");
  }
  for (const key of PRIMARY) {
    if (!text(accepted[key]) || !equal(accepted[key], row.after?.[key]) ||
        [reviewed[key], committed[key], question[key], final[key]].some(value => !equal(value, accepted[key])) ||
        Object.hasOwn(patch.after, key) && !equal(patch.after[key], accepted[key]))
      fail(`primary classification differs from native reviewed after: ${key}`);
  }
  if (accepted.standardCourse !== "중3 수학" || accepted.standardUnitKey !== "M3-04" ||
      accepted.subUnitKey !== "M3-04-QUADRATIC_FUNCTION_GRAPH")
    fail("native current-grade classification is outside the scope contract");
  const beforePt = canonicalBefore?.pt?.get(accepted.problemTypeKey), beforeTpl = canonicalBefore?.tpl?.get(accepted.templateKey);
  const afterPt = canonicalAfter?.pt?.get(accepted.problemTypeKey), afterTpl = canonicalAfter?.tpl?.get(accepted.templateKey);
  if (beforePt?.status !== "ACTIVE" || beforeTpl?.status !== "ACTIVE" ||
      beforeTpl.parentProblemTypeKey !== accepted.problemTypeKey || !equal(beforePt, afterPt) || !equal(beforeTpl, afterTpl))
    fail("requires unchanged existing ACTIVE PT/TPL definitions");
  const tuple = [curriculum, accepted.standardCourse, accepted.standardUnitKey, accepted.subUnitKey, accepted.problemTypeKey];
  const binding = canonicalAfter?.bindings?.get(stable(tuple));
  const pack = canonicalAfter?.packs?.get("MIDDLE3")?.meta;
  if (!binding || binding.status !== "ACTIVE" || binding.ownerPack !== "MIDDLE3" ||
      !equal([binding.curriculum, binding.standardCourse, binding.standardUnitKey, binding.subUnitKey, binding.problemTypeKey], tuple) ||
      binding.L1 !== base.majorUnit || binding.L2 !== base.midUnit ||
      !pack?.curricula?.includes(curriculum) || !pack.standardCourses?.includes(accepted.standardCourse) ||
      !pack.standardCourses?.includes(base.scope) || !pack.ownedStandardUnitDomains?.includes(accepted.standardUnitKey))
    fail("exact current ACTIVE binding/owner scope is absent or inconsistent");
  const parent = patch.targetParentRef;
  if (!parent || patch.basicScopeParentRef !== undefined || parent.path !== MASTER ||
      !/^[a-f0-9]{64}$/.test(parent.sha256 || "") || parent.curriculum !== curriculum ||
      parent.scope !== base.scope || parent.majorUnit !== base.majorUnit || parent.midUnit !== base.midUnit ||
      final.L1 !== base.majorUnit || final.L2 !== base.midUnit ||
      [request.approval.evidenceRefs, patch.evidenceRefs].some(refs =>
        !refs?.some(ref => ref.path === parent.path && ref.sha256 === parent.sha256)))
    fail("exact native RPM parent must be bound to the current canonical master");
  return { fields, proof: {
    schemaVersion: SCHEMA, origin: "UNCHANGED_NATIVE_SOURCE_AND_EXPLICIT_RPM_SCOPE",
    fields: [...NATIVE_SCOPE_FIELDS], fieldSha256: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, digest(value)])),
    nativeItemSha256: digest(row), nativeRpmBaseSha256: digest(base),
    problemTypeDefinitionSha256: digest(beforePt), templateDefinitionSha256: digest(beforeTpl),
    exactActiveBindingSha256: digest(binding), targetParentRef: parent,
    originalCurriculum: "2015", semanticSourceScope: "M3-1", semanticScopeRelation: "CURRENT_SCOPE",
    newClassificationJudgments: false, newDefinitions: false, newMathematicalQa: false,
  } };
}
