import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { readM2Family7RpmRowContinuity } from "./reviewed-m2-family7-rpm-row-continuity.mjs";

const SCHEMA = "archive-reviewed-retained-scope-transport-v1";
const PARENT_SCHEMA = "archive-reviewed-retained-primary-parent-v1";
const FIELDS = ["curriculum", "curriculumKey", "courseKey"];
const RPM = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json";
const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const fail = message => { throw new Error(`retained scope transport: ${message}`); };
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const plain = value => value && typeof value === "object" && !Array.isArray(value);
const keys = (value, expected) => plain(value) && same(Object.keys(value).sort(), [...expected].sort());
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;

function safePath(root, relative) {
  if (typeof relative !== "string" || path.isAbsolute(relative) || /[\\\x00-\x1f]/.test(relative) ||
      relative.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe evidence path");
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink evidence path");
  return full;
}

function gitFile(root, commit, relative, cache) {
  if (!SHA1.test(commit || "")) fail("immutable commit required");
  safePath(root, relative);
  const key = stable(["retained-scope-git", root, commit, relative]);
  if (!cache.has(key)) {
    try {
      const opts = { cwd: root, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] };
      if (execFileSync("git", ["rev-parse", "--verify", `${commit}^{commit}`], opts).toString().trim() !== commit)
        fail("immutable commit required");
      const blob = execFileSync("git", ["rev-parse", `${commit}:${relative}`], opts).toString().trim();
      const bytes = execFileSync("git", ["cat-file", "blob", blob], opts);
      cache.set(key, { commit, path: relative, blob, sha256: sha(bytes), bytes, value: JSON.parse(bytes) });
    } catch { fail("immutable scope evidence unavailable"); }
  }
  return cache.get(key);
}

function boundLocal(root, request, patch, ref) {
  if (!keys(ref, ["path", "sha256"]) || !SHA256.test(ref.sha256 || "")) fail("exact local evidence reference required");
  for (const refs of [request.approval?.evidenceRefs, patch.evidenceRefs])
    if (!refs?.some(r => same(r, ref))) fail("scope evidence must bind both evidence lists");
  let bytes;
  try { bytes = fs.readFileSync(safePath(root, ref.path)); } catch { fail("scope evidence missing"); }
  if (sha(bytes) !== ref.sha256) fail("scope evidence raw SHA mismatch");
  try { return { bytes, value: JSON.parse(bytes) }; } catch { fail("invalid scope evidence JSON"); }
}

// The independent primary witness names curriculum and the exact ACTIVE unit
// binding. The separately immutable native RPM record names the semester scope.
// This explicit opt-in joins those authorities; it never attributes courseKey
// approval to the independent document or infers a scope from a year/file name.
export function bindReviewedRetainedScopeTransport({ root, request, patch, native, row, metadata,
  accepted, question, final, retainedNativeFields, canonicalBefore, canonicalAfter, issuedScopeProof,
  cache = new Map() }) {
  const spec = patch.sourceReview?.retainedScopeTransport;
  if (spec === undefined) return null;
  if (!keys(spec, ["schemaVersion", "fields"]) || spec.schemaVersion !== SCHEMA || !Array.isArray(spec.fields) ||
      !same([...spec.fields].sort(), [...FIELDS].sort())) fail("explicit exact three-field scope selection required");
  const retained = retainedNativeFields?.proof, independent = retained?.independentPrimary;
  if (request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" || request.registrationMode !== undefined ||
      request.approval.sourceRebind !== undefined || patch.rebind !== undefined || (request.registryChanges || []).length ||
      patch.sourceReview.rendererProof !== undefined || patch.sourceReview.proposalFinalization !== undefined ||
      patch.sourceReview.scopeFieldBinding !== undefined || !patch.sourceReview.retainedFields ||
      native.review.schemaVersion !== "m2-s2-meta-review-v1" || !["KEEP", "CORRECT"].includes(row.rpmDecision) ||
      !/^original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/.test(request.sourceArchiveFile || "") ||
      !retained || retained.schemaVersion !== "archive-reviewed-native-retained-fields-v1" ||
      retained.independentApplicabilityDecision !== true || retained.questionUid !== patch.questionUid ||
      retained.sourceOrdinal !== patch.sourceOrdinal || retained.nativeItemSha256 !== sha(stable(row)) ||
      retained.newDefinitions !== false || retained.newMathematicalQa !== false || !independent ||
      independent.questionUid !== patch.questionUid || independent.sourceOrdinal !== patch.sourceOrdinal ||
      independent.originalNativeMatchPreserved !== true || independent.originalNativeAfterPreserved !== true ||
      independent.newDefinitions !== false || independent.newMathematicalQa !== false || independent.newReview2 !== false ||
      independent.newDifficultyApproval !== false) fail("validated independent M2 primary retention required");
  const declared = patch.sourceReview.retainedFields.independentPrimary;
  if (!keys(declared, ["schemaVersion", "reviewCommit", "reviewRef"]) ||
      declared.schemaVersion !== "archive-reviewed-existing-primary-disposition-v1" ||
      declared.reviewCommit !== independent.reviewCommit || !same(declared.reviewRef, independent.reviewRef))
    fail("exact validated independent reference required");
  const localIndependent = boundLocal(root, request, patch, declared.reviewRef);
  const document = gitFile(root, declared.reviewCommit, declared.reviewRef.path, cache);
  if (document.sha256 !== declared.reviewRef.sha256 || !same(document.value, localIndependent.value) ||
      document.value.schemaVersion !== "archive-independent-existing-primary-disposition-v1" ||
      document.value.scope !== "EXISTING_PRIMARY_RETENTION_ONLY") fail("independent scope document differs from its Git authority");
  const applications = document.value.applications?.filter(a => a.questionUid === patch.questionUid && a.sourceOrdinal === patch.sourceOrdinal);
  const app = applications?.[0], applicationIndex = document.value.applications?.indexOf(app);
  if (applications?.length !== 1 || app.decision !== "APPROVED_EXISTING_PRIMARY" ||
      sha(stable(app)) !== independent.applicationSha256 || app.nativeItemStableSha256 !== sha(stable(row)) ||
      !same(app.nativeReviewRef, { commit: native.spec.reviewCommit, path: native.spec.reviewPath, sha256: native.spec.reviewRef.sha256 }))
    fail("independent scope does not bind the exact native UID");

  const rpm = gitFile(root, native.spec.reviewCommit, RPM, cache), nativeRpm = retained.nativeRpmRef;
  const rpmRef = { path: RPM, sha256: rpm.sha256 };
  const rpmRowContinuity = readM2Family7RpmRowContinuity({ root, request, patch,
    nativeSpec: native.spec, nativeRow: row, cache });
  if (rpmRowContinuity) {
    if (!same(rpmRowContinuity.proof, retained.rpmRowContinuity) || rpmRowContinuity.historical.ref.sha256 !== rpm.sha256)
      fail("fresh retained RPM row continuity proof required");
  } else boundLocal(root, request, patch, rpmRef);
  const matches = rpm.value.records?.filter(r => r.id === row.rpmRecordId), record = matches?.[0];
  const recordIndex = rpm.value.records?.indexOf(record);
  if (matches?.length !== 1 || nativeRpm?.commit !== native.spec.reviewCommit || nativeRpm.path !== RPM ||
      nativeRpm.sha256 !== rpm.sha256 || nativeRpm.recordId !== row.rpmRecordId || nativeRpm.recordSha256 !== sha(stable(record)) ||
      record.curriculum !== "2015" || record.scope !== "M2-2") fail("exact immutable 2015 M2-2 RPM scope required");
  const bindingContext = { curriculum: "2015", standardCourse: final.standardCourse,
    standardUnitKey: final.standardUnitKey, subUnitKey: final.subUnitKey, problemTypeKey: final.problemTypeKey, status: "ACTIVE" };
  const select = tables => [...(tables?.bindings?.values() || [])].filter(b =>
    Object.entries(bindingContext).every(([k, v]) => same(b[k], v)));
  const oldBindings = select(canonicalBefore), nextBindings = select(canonicalAfter), binding = oldBindings[0];
  if (oldBindings.length !== 1 || nextBindings.length !== 1 || !same(binding, nextBindings[0]) ||
      app.existingPrimary?.exactBinding?.curriculum !== record.curriculum ||
      !same(app.existingPrimary.exactBinding, { ...bindingContext, ownerPack: binding.ownerPack }) ||
      record.standardUnitKey !== final.standardUnitKey || record.subUnitKey !== final.subUnitKey ||
      independent.exactBindingSha256 !== sha(stable(binding)) || retained.exactBindingSha256 !== sha(stable(binding)))
    fail("native scope and independent ACTIVE primary binding disagree");
  for (const [key, map, field] of [[final.problemTypeKey, "pt", "problemTypeDefinitionSha256"],
    [final.templateKey, "tpl", "templateDefinitionSha256"]]) {
    const before = canonicalBefore?.[map]?.get(key), after = canonicalAfter?.[map]?.get(key);
    if (before?.status !== "ACTIVE" || !same(before, after) || sha(stable(before)) !== independent[field] ||
        sha(stable(before)) !== retained[field]) fail("current primary definition differs from the independent approval");
  }
  for (const [field, key] of [["standardUnitKey", final.standardUnitKey], ["subUnitKey", final.subUnitKey]]) {
    const before = canonicalBefore?.master?.get(key), after = canonicalAfter?.master?.get(key);
    if (before?.status !== "active" || before.keyType !== field || !same(before, after) ||
        field === "subUnitKey" && before.parentKey !== final.standardUnitKey) fail("exact current active master parent required");
  }
  const parent = patch.targetParentRef;
  const parentSpec = parent?.retainedScopeParent;
  const parentKeys = ["path", "curriculum", "scope", "majorUnit", "midUnit",
    ...(parentSpec === undefined ? [] : ["retainedScopeParent"]),
    ...(rpmRowContinuity ? ["nativeRpmRowContinuity"] : [])];
  if (!keys(parent, parentKeys) || parent.path !== MASTER ||
      parent.curriculum !== record.curriculum || parent.scope !== record.scope ||
      parent.majorUnit !== record.rpmPath?.majorUnit || parent.midUnit !== record.rpmPath?.midUnit ||
      final.L1 !== parent.majorUnit || final.L2 !== parent.midUnit) fail("exact immutable RPM master parent reference required");
  const masterRefs = patch.evidenceRefs?.filter(r => r.path === MASTER);
  if (masterRefs?.length !== 1) fail("exact current master evidence required");
  const masterRef = masterRefs[0], master = boundLocal(root, request, patch, masterRef);
  const masterMatches = master.value.records?.filter(r => r.curriculum === record.curriculum && r.scope === record.scope &&
    r.majorUnit === parent.majorUnit && r.midUnit === parent.midUnit);
  if (!masterMatches?.length) fail("native scope has no exact current master parent");
  let retainedParentAuthority;
  if (parentSpec !== undefined) {
    if (!keys(parentSpec, ["schemaVersion"]) || parentSpec.schemaVersion !== PARENT_SCHEMA ||
        record.mappingStatus !== "FAMILY_ACTIVE" || record.bindingStatus !== "ACTIVE" ||
        Object.hasOwn(record, "templateKey") || record.problemTypeKey !== final.problemTypeKey ||
        masterMatches.length !== 1 || masterMatches[0].defaultSelectable === false ||
        binding.L1 && binding.L1 !== parent.majorUnit || binding.L2 && binding.L2 !== parent.midUnit)
      fail("retained parent requires the exact ACTIVE family, independent primary and selectable master parent");
    retainedParentAuthority = { schemaVersion: PARENT_SCHEMA,
      parent: { curriculum: record.curriculum, scope: record.scope, L1: parent.majorUnit, L2: parent.midUnit },
      problemTypeKey: final.problemTypeKey, templateKey: final.templateKey,
      nativeRpmRecordSha256: nativeRpm.recordSha256, independentApplicationSha256: independent.applicationSha256,
      exactBindingSha256: sha(stable(binding)), masterParentSelectionSha256: sha(stable(masterMatches)),
      nativeAfterPrimaryInvented: false, templateCandidatesUsedAsApproval: false, newPrimaryJudgment: false };
  }

  const fields = { curriculum: record.curriculum, curriculumKey: record.curriculum, courseKey: record.scope };
  const sources = [native.reviewedBank[patch.sourceOrdinal - 1], native.committedBank[patch.sourceOrdinal - 1], question];
  if (sources.some(q => !plain(q))) fail("both immutable source snapshots and current source required");
  // Only receipt-backed callers may supply this context, after the writer-issued
  // sidecar and current rows have been checked. Ordinary before maps serialize an
  // absent value as null; do not turn that replay representation into an explicit
  // original null, or relax the first-registration null/conflict guard.
  const issuedPresence = issuedScopeProof?.metadataBeforeScopePresence;
  if (issuedScopeProof !== undefined && (issuedScopeProof?.schemaVersion !== SCHEMA ||
      issuedScopeProof.questionUid !== patch.questionUid || issuedScopeProof.sourceOrdinal !== patch.sourceOrdinal ||
      !keys(issuedPresence, FIELDS))) fail("exact issued scope-presence proof required");
  const metadataBeforeScopePresence = {};
  for (const [field, value] of Object.entries(fields)) {
    const expectedPresence = issuedPresence?.[field];
    if (issuedScopeProof !== undefined && (!plain(expectedPresence) ||
        (expectedPresence.present === false ? !keys(expectedPresence, ["present"]) :
        expectedPresence.present !== true || !keys(expectedPresence, ["present", "valueSha256"]) ||
        expectedPresence.valueSha256 !== sha(stable(value))))) fail("invalid issued metadata scope-presence record");
    const issuedAbsence = issuedScopeProof !== undefined && expectedPresence.present === false;
    if (issuedAbsence && (patch.before[field] !== null ||
        Object.hasOwn(metadata, field) && metadata[field] !== null)) fail("issued scope absence reconstruction drift");
    if (!Object.hasOwn(patch.after, field) || patch.after[field] !== value || final[field] !== value ||
        !Object.hasOwn(patch.before, field) || !same(patch.before[field], metadata[field] ?? null) ||
        Object.hasOwn(accepted, field) && accepted[field] !== value ||
        !issuedAbsence && Object.hasOwn(metadata, field) && metadata[field] !== value ||
        expectedPresence?.present === true && !Object.hasOwn(metadata, field) ||
        sources.some(q => Object.hasOwn(q, field) && q[field] !== value))
      fail(`scope field conflicts with explicit before/source/native authority: ${field}`);
    metadataBeforeScopePresence[field] = issuedAbsence ? { present: false } :
      Object.hasOwn(metadata, field) ? { present: true, valueSha256: sha(stable(metadata[field])) } : { present: false };
  }
  const sourcePresence = sources.map(q => Object.fromEntries(FIELDS.map(field =>
    [field, Object.hasOwn(q, field) ? { present: true, valueSha256: sha(stable(q[field])) } : { present: false }])));
  return { fields, proof: { schemaVersion: SCHEMA, questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal,
    independentReviewRef: { commit: declared.reviewCommit, ...declared.reviewRef }, applicationSha256: independent.applicationSha256,
    independentCurriculumField: `applications[${applicationIndex}].existingPrimary.exactBinding.curriculum`,
    independentStandardCourseField: `applications[${applicationIndex}].existingPrimary.exactBinding.standardCourse`,
    independentCourseKeyExplicitlyDeclared: false,
    ...(rpmRowContinuity ? { rpmRowContinuity: rpmRowContinuity.proof } : {}),
    nativeRpmRef: { ...nativeRpm, recordIndex }, nativeCurriculumField: `records[${recordIndex}].curriculum`,
    nativeCourseField: `records[${recordIndex}].scope`, exactBindingSha256: sha(stable(binding)),
    masterRef, masterParentSelectionSha256: sha(stable(masterMatches)), sourcePresence, metadataBeforeScopePresence,
    ...(retainedParentAuthority ? { retainedParentAuthority } : {}),
    fieldBindings: { curriculum: { valueSha256: sha(stable(fields.curriculum)), origin: "INDEPENDENT_CURRICULUM_AND_NATIVE_RPM" },
      curriculumKey: { valueSha256: sha(stable(fields.curriculumKey)), origin: "EXACT_CURRICULUM_ALIAS" },
      courseKey: { valueSha256: sha(stable(fields.courseKey)), origin: "IMMUTABLE_NATIVE_RPM_SCOPE_JOIN" } },
    sourceFieldsChanged: false, newIndependentPrimaryJudgment: false, newMathematicalQa: false,
    newDifficultyJudgment: false, inferredFromYearOrFilename: false } };
}

// The producer and receipt-backed replay both pass a freshly revalidated scope
// proof. This separate opt-in transports only its exact L1/L2 display parent;
// the independent existing-primary disposition remains the PT/TPL authority.
export function validateReviewedRetainedScopeParent({ request, patch, row, resolved, sourceReview }) {
  const target = patch.targetParentRef, spec = target?.retainedScopeParent;
  if (spec === undefined) return null;
  const scope = sourceReview?.retainedScopeTransport, authority = scope?.retainedParentAuthority;
  const retained = sourceReview?.retainedNativeFields, independent = retained?.independentPrimary;
  if (!keys(spec, ["schemaVersion"]) || spec.schemaVersion !== PARENT_SCHEMA || target.nativeSourceReview !== undefined ||
      target.crosswalkRef !== undefined || patch.basicScopeParentRef !== undefined || patch.typeHold !== undefined ||
      request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" || request.approval.metadataReviewed !== true ||
      request.registrationMode !== undefined || request.approval.sourceRebind !== undefined || (request.registryChanges || []).length ||
      sourceReview?.schemaVersion !== "archive-reviewed-source-reassessment-v1" ||
      sourceReview.nativeSchemaVersion !== "m2-s2-meta-review-v1" || sourceReview.scope !== "METADATA_SOURCE_BINDING_ONLY" ||
      sourceReview.newMathematicalQa !== false || sourceReview.questionUid !== patch.questionUid ||
      sourceReview.sourceOrdinal !== patch.sourceOrdinal || row.questionUid !== patch.questionUid || row.sourceOrdinal !== patch.sourceOrdinal ||
      scope?.schemaVersion !== SCHEMA || scope.questionUid !== patch.questionUid || scope.sourceOrdinal !== patch.sourceOrdinal ||
      retained?.independentApplicabilityDecision !== true || retained.questionUid !== patch.questionUid ||
      retained.sourceOrdinal !== patch.sourceOrdinal || !independent ||
      independent.applicationSha256 !== scope.applicationSha256 ||
      authority?.schemaVersion !== PARENT_SCHEMA || authority.nativeAfterPrimaryInvented !== false ||
      authority.templateCandidatesUsedAsApproval !== false || authority.newPrimaryJudgment !== false)
    fail("retained parent requires freshly validated exact independent scope authority");
  if (Object.hasOwn(target, "nativeRpmRowContinuity") && (!scope.rpmRowContinuity ||
      !same(scope.rpmRowContinuity, retained.rpmRowContinuity) ||
      !same(target.nativeRpmRowContinuity, Object.fromEntries(["schemaVersion", "historicalRef", "currentRef", "recordId", "recordSha256"]
        .map(key => [key, scope.rpmRowContinuity[key]]))))) fail("retained parent RPM row continuity drift");
  const parent = { curriculum: target.curriculum, scope: target.scope, L1: target.majorUnit, L2: target.midUnit };
  const { binding, pt, tpl, pack } = resolved;
  if (target.path !== MASTER || !same(parent, authority.parent) || target.curriculum !== resolved.curriculum ||
      target.scope !== row.courseKey || row.L1 !== parent.L1 || row.L2 !== parent.L2 ||
      authority.problemTypeKey !== row.problemTypeKey || authority.templateKey !== row.templateKey ||
      authority.nativeRpmRecordSha256 !== scope.nativeRpmRef?.recordSha256 ||
      authority.independentApplicationSha256 !== scope.applicationSha256 ||
      authority.masterParentSelectionSha256 !== scope.masterParentSelectionSha256 ||
      authority.exactBindingSha256 !== scope.exactBindingSha256 || authority.exactBindingSha256 !== sha(stable(binding)) ||
      binding?.status !== "ACTIVE" || binding.curriculum !== resolved.curriculum || binding.standardCourse !== resolved.course ||
      binding.standardUnitKey !== row.standardUnitKey || binding.subUnitKey !== row.subUnitKey || binding.problemTypeKey !== row.problemTypeKey ||
      pt?.status !== "ACTIVE" || tpl?.status !== "ACTIVE" || pt.problemTypeKey !== row.problemTypeKey ||
      tpl.templateKey !== row.templateKey || tpl.parentProblemTypeKey !== row.problemTypeKey ||
      sha(stable(pt)) !== retained.problemTypeDefinitionSha256 || sha(stable(tpl)) !== retained.templateDefinitionSha256 ||
      pack?.meta?.canonicalStatus !== "ACTIVE" || pack.meta.packId !== (binding.ownerPack || pt.ownerPack) ||
      !pack.meta.curricula?.includes(resolved.curriculum) || !pack.meta.standardCourses?.includes(resolved.course) ||
      !pack.meta.standardCourses?.includes(row.courseKey) || binding.L1 && binding.L1 !== parent.L1 || binding.L2 && binding.L2 !== parent.L2)
    fail("retained parent differs from the independently validated current tuple or master authority");
  return { schemaVersion: PARENT_SCHEMA, questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal,
    nativeRpmRef: scope.nativeRpmRef, independentReviewRef: scope.independentReviewRef,
    ...(scope.rpmRowContinuity ? { rpmRowContinuity: scope.rpmRowContinuity } : {}),
    applicationSha256: scope.applicationSha256, masterRef: scope.masterRef,
    masterParentSelectionSha256: scope.masterParentSelectionSha256, parent,
    exactActiveTuple: { curriculum: resolved.curriculum, standardCourse: resolved.course,
      standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, problemTypeKey: row.problemTypeKey,
      templateKey: row.templateKey, bindingOwnerPack: pack.meta.packId },
    nativeAfterPrimaryInvented: false, templateCandidatesUsedAsApproval: false,
    sharedCrosswalkModified: false, canonicalDefinitionsModified: false, newMathematicalQa: false };
}
