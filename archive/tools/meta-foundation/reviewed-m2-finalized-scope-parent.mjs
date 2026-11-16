import fs from "node:fs";

export const M2_FINALIZED_SCOPE_PARENT = "archive-native-m2-finalized-scope-parent-v1";
const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const SHA256 = /^[a-f0-9]{64}$/;
const owns = (row, key) => Object.hasOwn(row || {}, key);
const same = (a, b) => JSON.stringify(a, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v) ===
  JSON.stringify(b, (_, v) => v && typeof v === "object" && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const exactKeys = (row, keys) => row && typeof row === "object" && !Array.isArray(row) &&
  same(Object.keys(row).sort(), [...keys].sort());
const fail = message => { throw Error(`M2 finalized scope parent: ${message}`); };

// The v3 caller has already revalidated the immutable native RPM record, the
// independently finalized definition and the exact ACTIVE pre/post binding.
// This opt-in transports that record's scope, never a course inferred from a
// display label, grade, filename, school year or a newly authored classification.
export function bindM2FinalizedScopeParent(ctx, rpm, snapshot, h) {
  const spec = ctx.spec.scopeParentTransport;
  if (spec === undefined) return null;
  const { sha, stable, safePath } = h;
  const patch = ctx.patch, request = ctx.request, ref = patch.targetParentRef;
  if (!same(spec, { schemaVersion: M2_FINALIZED_SCOPE_PARENT }) || ctx.spec.curriculumTransport !== undefined ||
      request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" || request.approval.metadataReviewed !== true ||
      request.registrationMode !== undefined || request.approval.sourceRebind !== undefined || patch.rebind !== undefined ||
      patch.basicScopeParentRef !== undefined || patch.semanticBinding !== undefined || patch.approvedMetadataRef !== undefined ||
      !/^original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/.test(request.sourceArchiveFile || "") ||
      ctx.native.review.schemaVersion !== "m2-s2-meta-review-v1" || ctx.native.review.sourceArchiveFile !== request.sourceArchiveFile ||
      !exactKeys(patch.sourceReview, ["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "proposalFinalization"]) ||
      patch.sourceReview.schemaVersion !== "archive-reviewed-source-reassessment-v1")
    fail("exclusive explicit v3 M2 FINAL_QA scope/parent transport required");
  if (rpm.record.curriculum !== "2015" || rpm.record.scope !== "M2-2" || ctx.final.standardCourse !== "중2 수학" ||
      !owns(patch.before, "curriculum") || patch.before.curriculum !== null ||
      !owns(patch.before, "courseKey") || patch.before.courseKey !== null ||
      patch.after.curriculum !== "2015" || patch.after.courseKey !== "M2-2" ||
      ctx.final.curriculum !== "2015" || ctx.final.courseKey !== "M2-2" ||
      [patch.before, patch.after].some(row => owns(row, "curriculumKey")) ||
      owns(ctx.final, "curriculumKey") && ctx.final.curriculumKey !== "2015")
    fail("exact native 2015/M2-2 values and absent before fields required");
  const sourceRows = [ctx.native.reviewedBank[patch.sourceOrdinal - 1], ctx.native.committedBank[patch.sourceOrdinal - 1],
    snapshot.question, ctx.question];
  const nativeRows = [ctx.row.after, ctx.accepted, ...sourceRows];
  const aliases = ["courseKey", "courseSemester", "semester", "grade", "gradeKey"];
  if (nativeRows.some(row => !row || owns(row, "curriculumKey") || aliases.some(key => owns(row, key))) ||
      aliases.slice(1).some(key => [patch.before, patch.after, ctx.metadata, ctx.final].some(row => owns(row, key))))
    fail("original course, grade and semester aliases must be absent");
  const nativeCurriculumPresent = owns(ctx.row.after, "curriculum");
  // Four real reviewed applications carry an explicit native.after value into
  // a later independently bound source. Their two immutable original sources
  // both omit it. This is distinct from deriving an omitted native value from
  // RPM, and from sources that already explicitly contained the native value.
  const nativeCurriculumCarried = nativeCurriculumPresent && ctx.row.after.curriculum === "2015" &&
    owns(ctx.accepted, "curriculum") && ctx.accepted.curriculum === "2015" &&
    sourceRows.slice(0, 2).every(row => !owns(row, "curriculum")) &&
    sourceRows.slice(2).every(row => owns(row, "curriculum") && row.curriculum === "2015");
  if (!nativeCurriculumCarried && nativeRows.some(row => owns(row, "curriculum") !== nativeCurriculumPresent ||
      nativeCurriculumPresent && row.curriculum !== "2015"))
    fail("native/source curriculum must be uniformly absent or explicitly 2015");
  const metadataBefore = { curriculum: { present: false }, curriculumKey: { present: false }, courseKey: { present: false } };
  const issued = ctx.issuedSourceReview?.proposalFinalization?.scopeParentTransport;
  if (issued !== undefined) {
    if (!same(issued.metadataBefore, metadataBefore) || !ctx.metadata ||
        !owns(ctx.metadata, "curriculum") || ctx.metadata.curriculum !== null ||
        !owns(ctx.metadata, "courseKey") || ctx.metadata.courseKey !== null ||
        !owns(ctx.metadata, "curriculumKey") || ctx.metadata.curriculumKey !== "2015")
      fail("issued original scope presence or before context changed");
  } else if (!ctx.metadata || ["curriculum", "curriculumKey", "courseKey"].some(key => owns(ctx.metadata, key))) {
    fail("original metadata scope properties must be absent");
  }
  if (!exactKeys(ref, ["path", "sha256", "curriculum", "scope", "majorUnit", "midUnit", "finalizedScopeParent"]) ||
      ref.path !== MASTER || !SHA256.test(ref.sha256 || "") ||
      !same(ref.finalizedScopeParent, { schemaVersion: M2_FINALIZED_SCOPE_PARENT }) ||
      ref.curriculum !== rpm.record.curriculum || ref.scope !== rpm.record.scope ||
      ref.majorUnit !== rpm.record.rpmPath?.majorUnit || ref.midUnit !== rpm.record.rpmPath?.midUnit ||
      !["majorUnit", "midUnit", "l3", "l4"].every(key => typeof rpm.record.rpmPath?.[key] === "string" && rpm.record.rpmPath[key].trim()))
    fail("exact immutable native RPM parent reference required");
  for (const refs of [request.approval.evidenceRefs, patch.evidenceRefs])
    if (refs?.filter(row => row.path === MASTER && row.sha256 === ref.sha256).length !== 1)
      fail("current parent authority must bind both evidence lists");
  let bytes, master;
  try { bytes = fs.readFileSync(safePath(ctx.root, MASTER)); master = JSON.parse(bytes); }
  catch { fail("current parent authority missing or invalid"); }
  if (sha(bytes) !== ref.sha256) fail("current parent authority SHA changed");
  const parents = master.records?.filter(row => row.curriculum === ref.curriculum && row.scope === ref.scope &&
    row.majorUnit === ref.majorUnit && row.midUnit === ref.midUnit);
  const concepts = parents?.[0]?.concepts?.filter(row => row.concept === rpm.record.rpmPath.l3);
  const leaves = concepts?.[0]?.problemTypes?.filter(row => row.problemType === rpm.record.rpmPath.l4);
  if (parents?.length !== 1 || concepts?.length !== 1 || leaves?.length !== 1 ||
      [parents[0], concepts[0], leaves[0]].some(row => row.defaultSelectable !== true))
    fail("one exact selectable current master parent and native leaf required");
  const key = stable(["2015", ctx.final.standardCourse, ctx.final.standardUnitKey, ctx.final.subUnitKey ?? null, ctx.final.problemTypeKey]);
  const binding = ctx.canonicalAfter?.bindings?.get(key), pt = ctx.canonicalAfter?.pt?.get(ctx.final.problemTypeKey),
    tpl = ctx.canonicalAfter?.tpl?.get(ctx.final.templateKey), pack = ctx.canonicalAfter?.packs?.get(binding?.ownerPack || pt?.ownerPack);
  if (binding?.status !== "ACTIVE" || pt?.status !== "ACTIVE" || tpl?.status !== "ACTIVE" ||
      tpl.parentProblemTypeKey !== pt.problemTypeKey || pack?.meta?.canonicalStatus !== "ACTIVE" ||
      pack.meta.packId !== (binding.ownerPack || pt.ownerPack) ||
      !pack.meta.curricula?.includes("2015") || !["중2 수학", "M2-2"].every(value => pack.meta.standardCourses?.includes(value)) ||
      binding.L1 && binding.L1 !== ref.majorUnit || binding.L2 && binding.L2 !== ref.midUnit)
    fail("current ACTIVE definition, binding or parent owner conflicts");
  const parent = { curriculumKey: "2015", courseKey: "M2-2", L1: ref.majorUnit, L2: ref.midUnit };
  if (issued !== undefined && ["L1", "L2"].some(key => ctx.final[key] !== parent[key]))
    fail("issued canonical parent labels changed");
  const fields = { ...(nativeCurriculumPresent ? {} : { curriculum: "2015" }), courseKey: "M2-2" };
  const proof = { schemaVersion: M2_FINALIZED_SCOPE_PARENT, questionUid: patch.questionUid, sourceOrdinal: patch.sourceOrdinal,
    fields, metadataBefore, originalCurriculum: nativeCurriculumCarried ? "EXPLICIT_NATIVE_AFTER_CARRIED_TO_REVIEWED_SOURCE_2015" :
      nativeCurriculumPresent ? "EXPLICIT_NATIVE_AND_SOURCE_2015" : "ABSENT_NATIVE_AND_SOURCE",
    ...(nativeCurriculumCarried ? { nativeCurriculumCarry: {
      schemaVersion: "archive-native-m2-explicit-curriculum-source-carry-v1",
      nativeAfterSha256: sha(stable(ctx.row.after.curriculum)),
      originalSources: { reviewed: { present: false }, committed: { present: false } },
      independentSource: Object.fromEntries(["commit", "sourcePath", "blob", "sha256", "questionSha256"].map(key => [key, snapshot[key]])),
      currentSource: { present: true, sha256: sha(stable(ctx.question.curriculum)) },
      originalNativeSourceWrites: 0, newCurriculumJudgment: false } } : {}),
    nativeItemSha256: sha(stable(ctx.row)), nativeRpmContext: { path: rpm.path, sha256: rpm.sha256, recordId: rpm.record.id,
      recordSha256: sha(stable(rpm.record)), curriculum: "2015", scope: "M2-2" },
    masterRef: { path: MASTER, sha256: ref.sha256 }, masterParentSha256: sha(stable(parents[0])),
    masterLeafSha256: sha(stable(leaves[0])), parent,
    exactActiveTuple: { curriculum: "2015", standardCourse: ctx.final.standardCourse, standardUnitKey: ctx.final.standardUnitKey,
      subUnitKey: ctx.final.subUnitKey ?? null, problemTypeKey: pt.problemTypeKey, templateKey: tpl.templateKey,
      bindingOwnerPack: pack.meta.packId, problemTypeOwnerPack: pt.ownerPack, templateOwnerPack: tpl.ownerPack },
    sourceWrites: 0, newClassificationJudgments: false, newMathematicalQa: false, newDifficultyJudgments: false };
  if (issued !== undefined && !same(issued, proof)) fail("issued scope/parent proof changed");
  return proof;
}

// Only a successfully recomputed v3 proof can select this parent. The writer
// still resolves the ACTIVE tuple and validates the current master as usual.
export function checkedM2FinalizedParent({ request, patch, row, resolved, sourceReview }) {
  const ref = patch.targetParentRef;
  if (ref?.finalizedScopeParent === undefined) return null;
  const proof = sourceReview?.proposalFinalization?.scopeParentTransport;
  if (!same(ref.finalizedScopeParent, { schemaVersion: M2_FINALIZED_SCOPE_PARENT }) ||
      !same(patch.sourceReview?.proposalFinalization?.scopeParentTransport, ref.finalizedScopeParent) ||
      proof?.schemaVersion !== M2_FINALIZED_SCOPE_PARENT || proof.questionUid !== patch.questionUid ||
      proof.sourceOrdinal !== patch.sourceOrdinal || row.questionUid !== patch.questionUid || row.sourceOrdinal !== patch.sourceOrdinal ||
      request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      ref.nativeSourceReview !== undefined || ref.retainedScopeParent !== undefined || ref.crosswalkRef !== undefined ||
      !same(proof.masterRef, { path: ref.path, sha256: ref.sha256 }) ||
      !same(proof.parent, { curriculumKey: ref.curriculum, courseKey: ref.scope, L1: ref.majorUnit, L2: ref.midUnit }) ||
      row.curriculum !== ref.curriculum || row.courseKey !== ref.scope || resolved.curriculum !== ref.curriculum ||
      resolved.course !== "중2 수학" || resolved.binding?.status !== "ACTIVE" ||
      proof.exactActiveTuple.standardUnitKey !== row.standardUnitKey || proof.exactActiveTuple.subUnitKey !== (row.subUnitKey ?? null) ||
      proof.exactActiveTuple.problemTypeKey !== row.problemTypeKey || proof.exactActiveTuple.templateKey !== row.templateKey ||
      proof.exactActiveTuple.bindingOwnerPack !== resolved.pack?.meta?.packId)
    fail("validated v3 scope/parent proof required by the registrar");
  return proof.parent;
}
