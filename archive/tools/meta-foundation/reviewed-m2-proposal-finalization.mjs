import fs from "node:fs";

// This lane resolves a native M2 proposal only through its separately authored,
// immutable definition review. It leaves v1/v2 and their refusal rules intact.
export function finalizeM2NativeDisposition(ctx, proof, proposals, h) {
  const { fail, sha, stable, equal, text, uniqueStrings, sorted, safePath, gitFile, boundDocument,
    exactNativeRef, oneRow, sourceSnapshot, dispositionAssets, exactDefinition, reusedDefinition, nativeFieldBase } = h;
  const CANON = "archive/data/meta-foundation/canonical/";
  const scope = p => p?.newFullMathematicalQa === false && p?.newReview2Claims === 0 &&
    p?.newMetadataApprovals === 0 && p?.newDifficultyJudgments === 0;
  if (ctx.native.review.schemaVersion !== "m2-s2-meta-review-v1" || proposals.length !== 1 ||
      proof.schemaVersion !== "archive-independent-m2-native-proposal-disposition-v1" ||
      proof.status !== "NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING" || !scope(proof.scope) ||
      proof.scope?.newSourceContentEdits !== 0 || !equal(ctx.spec.proposalSelections, proposals.map(p => p.selection)) ||
      !["CORRECT", "KEEP", "KEEP_SEMANTIC_RPM"].includes(ctx.row.rpmDecision) ||
      (ctx.row.contentDebt || []).length || [...(ctx.row.debts || []), ...(ctx.row.registrationDebt || [])].some(d => {
        const kind = typeof d === "string" ? d : d?.type || d?.kind || "";
        return /^(SOURCE_|CONTENT_|SOLUTION_|PRIOR_SOURCE_QA|DIFFICULTY_HOLD|EXPLICIT_DIFFICULTY_VALIDITY)/.test(kind) && kind !== "SOURCE_IMAGE_CROP_NONBLOCKING_METADATA";
      })) fail("v3 requires a settled M2 native proposal without a content or difficulty hold");
  const app = oneRow(proof.applications, ctx, "sourceOrdinal"), selected = proposals[0];
  exactNativeRef(ctx, app.nativeReviewRef);
  if (!text(app.reviewer) || app.reviewer === ctx.native.reviewer || !text(app.reason) ||
      app.nativeItemStableSha256 !== sha(stable(ctx.row)) || !equal(app.proposalSelections, ctx.spec.proposalSelections) ||
      app.newMathematicalQa !== false || app.newMetadataApproval !== false || app.difficultyChanged !== false ||
      !equal(app.nativeProtectedStudentFieldsChanges, []) || !Array.isArray(app.decisions) || app.decisions.length !== 1 ||
      !equal(app.decisions[0].selection, selected.selection)) fail("v3 application must bind the exact native item and independent reviewer");
  const snapshot = sourceSnapshot(ctx, app.sourceSnapshot), assets = dispositionAssets(ctx, snapshot, app.rendererAssets), choice = app.decisions[0];
  const witness = boundDocument(ctx, app.independentReviewRef), rows = witness.rows?.filter(r => r.questionUid === app.questionUid);
  if (witness.schemaVersion !== "archive-independent-m2-native-definition-finalization-v1" ||
      witness.decision !== "APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS" || witness.reviewer !== app.reviewer ||
      !scope(witness) || witness.existingDefinitionsModified !== 0 || witness.sourceWrites !== 0 || witness.canonicalWrites !== 0 ||
      witness.officialCompilerResolverConsumerStillRequired !== true || witness.actualMainRegistrationClaimed !== false ||
      witness.currentMainChecked !== snapshot.commit || rows?.length !== 1) fail("v3 original independent definition witness missing or overbroad");
  const row = rows[0];
  if (row.examId !== app.examId || row.sourceOrdinal !== app.sourceOrdinal || row.sourcePath !== app.sourcePath ||
      !equal(row.nativeReviewRef, app.nativeReviewRef) || row.nativeItemStableSha256 !== sha(stable(ctx.row)) ||
      !equal(row.nativeProposal, selected.proposal) || !equal(row.proposalSelection, selected.selection) ||
      !equal(row.nativeAfter, ctx.row.after) || !equal(row.nativeActiveDefinitionMatch, ctx.row.activeDefinitionMatch ?? null) ||
      !equal(row.sourceSnapshot, app.sourceSnapshot) || !equal(row.rendererAssets, app.rendererAssets) ||
      row.textOnlyItem !== (assets.length === 0) || row.protectedPayloadFieldsUnchanged !== true ||
      !equal(row.reviewedPrimaryContext, app.reviewedPrimaryContext) || !equal(row.decision, choice) ||
      row.newFullMathematicalQa !== false || row.newReview2 !== false || row.newMetadataApproval !== false ||
      row.newDifficultyJudgment !== false || row.sourceWrites !== 0 || !text(row.independentRationale))
    fail("v3 normalized disposition differs from the original independent review");
  const contextFields = ["standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"];
  if (!app.reviewedPrimaryContext || Object.keys(app.reviewedPrimaryContext).some(k => !contextFields.includes(k)) ||
      contextFields.some(k => !text(app.reviewedPrimaryContext[k]) || app.reviewedPrimaryContext[k] !== ctx.final[k]))
    fail("v3 exact primary context mismatch");
  const rpm = row.nativeRpmContext, rpmFile = rpm && gitFile(ctx, ctx.native.spec.reviewCommit, rpm.path);
  if (!rpm || rpmFile.sha256 !== rpm.sha256 || rpm.path !== "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json")
    fail("v3 immutable native RPM scope missing");
  const rpmMatches = JSON.parse(rpmFile.bytes).records?.filter(r => r.id === ctx.row.rpmRecordId);
  if (rpmMatches?.length !== 1 || !equal(rpmMatches[0], rpm.record) || rpm.record.scope !== "M2-2" ||
      !["2015", "2022"].includes(rpm.record.curriculum) || rpm.record.curriculum !== (ctx.final.curriculumKey || ctx.final.curriculum) ||
      rpm.record.standardUnitKey !== ctx.final.standardUnitKey ||
      rpm.record.subUnitKey && rpm.record.subUnitKey !== ctx.final.subUnitKey)
    fail("v3 final curriculum scope differs from the exact native RPM record");
  const pt = ctx.final.problemTypeKey, tpl = ctx.final.templateKey, oldPt = ctx.canonicalBefore?.pt?.get(pt),
    newPt = ctx.canonicalAfter?.pt?.get(pt), oldTpl = ctx.canonicalBefore?.tpl?.get(tpl), newTpl = ctx.canonicalAfter?.tpl?.get(tpl);
  const fields = {}, definitions = [], retained = {};
  const compiledDefinition = (record, before, after) => {
    if (after?.status !== "ACTIVE" || Object.entries(record).some(([k, v]) => !equal(after[k], v)) ||
        before && Object.entries(record).some(([k, v]) => !equal(before[k], v))) fail("v3 finalized definition conflicts with current canonical records");
  };
  const authorizedChange = change => {
    const matches = witness.approvedRegistryChanges?.filter(c => equal(c, change));
    if (matches?.length !== 1) fail("v3 registry change is not exactly authorized by the original review");
  };
  const add = (change, keyField, definition) => {
    authorizedChange(change);definitions.push(exactDefinition(ctx, change, keyField, definition));
  };
  const preserveParent = () => {
    if (oldPt?.status !== "ACTIVE" || !equal(oldPt, newPt)) fail("v3 existing ACTIVE parent must remain unchanged");
    if (Object.hasOwn(ctx.accepted, "problemTypeKey")) {
      if (ctx.accepted.problemTypeKey !== pt) fail("v3 cannot replace a native-approved primary parent");
    } else {
      const a = ctx.native.committedBank[ctx.patch.sourceOrdinal - 1], b = ctx.native.reviewedBank[ctx.patch.sourceOrdinal - 1], match = ctx.row.activeDefinitionMatch;
      // A newly finalized template may reuse a global parent the immutable review
      // already matched to this exact curriculum. A parent's supporting UID list
      // is not an exhaustive application list. This route requires the separate
      // original definition witness above, the unresolved native template, and
      // the exact native ACTIVE binding; the older CC retention route is unchanged.
      const exactNativeBinding = [{ curriculum: rpm.record.curriculum, standardCourse: ctx.final.standardCourse,
        standardUnitKey: ctx.final.standardUnitKey, subUnitKey: ctx.final.subUnitKey,
        problemTypeKey: pt, status: "ACTIVE" }];
      const independentlyFinalizedTemplateParent = selected.type === "TPL" && selected.kind === "NEW_TPL" &&
        choice.disposition === "ADD_ONLY" && choice.definition?.parentProblemTypeKey === pt &&
        match?.templateKey === null && match.templateStatus === null && match.templateParent === null &&
        equal(match.exactBindings, exactNativeBinding) && text(ctx.row.fieldReview?.classification) && text(ctx.row.fieldReview?.binding);
      if (a.problemTypeKey !== pt || b.problemTypeKey !== pt || ctx.question.problemTypeKey !== pt ||
          (!oldPt.supportingQuestionUids?.includes(ctx.patch.questionUid) && !independentlyFinalizedTemplateParent) ||
          match?.problemTypeKey !== pt || match.problemTypeStatus !== "ACTIVE")
        fail("v3 omitted parent lacks immutable native and existing UID support");
      fields.problemTypeKey = pt;retained.problemTypeKey = sha(stable(pt));
      if (independentlyFinalizedTemplateParent) retained.finalizedTemplateParentBindingSha256 = sha(stable(exactNativeBinding));
    }
  };
  const addTemplate = () => {
    const definition = choice.definition;
    if (definition?.parentProblemTypeKey !== pt || definition.templateKey !== tpl || definition.ownerPack !== newPt?.ownerPack ||
        choice.registryChange?.path !== `${CANON}packs/${definition.ownerPack.toLowerCase().replaceAll("_", "-")}/taxonomy.json`)
      fail("v3 template owner or parent mismatch");
    add(choice.registryChange, "templateKey", definition);compiledDefinition(definition, oldTpl, newTpl);fields.templateKey = tpl;
  };
  if (selected.type === "CC") {
    preserveParent();
    if (oldTpl?.status !== "ACTIVE" || oldTpl.parentProblemTypeKey !== pt || !equal(oldTpl, newTpl)) fail("v3 CC application must preserve its ACTIVE template");
    if (Object.hasOwn(ctx.accepted, "templateKey")) {
      if (ctx.accepted.templateKey !== tpl) fail("v3 CC cannot replace a native-approved template");
    } else {
      const a = ctx.native.committedBank[ctx.patch.sourceOrdinal - 1], b = ctx.native.reviewedBank[ctx.patch.sourceOrdinal - 1], match = ctx.row.activeDefinitionMatch;
      if (a.templateKey !== tpl || b.templateKey !== tpl || ctx.question.templateKey !== tpl ||
          !oldTpl.supportingQuestionUids?.includes(ctx.patch.questionUid) || match?.templateKey !== tpl ||
          match.templateStatus !== "ACTIVE" || match.templateParent !== pt) fail("v3 omitted template lacks immutable native and existing UID support");
      fields.templateKey = tpl;retained.templateKey = sha(stable(tpl));
    }
    const base = nativeFieldBase(ctx, "crossConceptKeys"), key = choice.definition?.conceptKey;
    if (!uniqueStrings(base) || !text(key) || base.includes(key)) fail("v3 may only append an exact missing reviewed concept");
    if (choice.disposition === "ADD_ONLY") {
      if (choice.definition.ownerConceptShard !== "PLANE_GEOMETRY" || choice.registryChange?.path !== `${CANON}concepts/plane-geometry.json`)
        fail("v3 new M2 concept owner mismatch");
      add(choice.registryChange, "conceptKey", choice.definition);
    } else if (choice.disposition === "REUSE_ACTIVE") {
      const prereq = choice.prerequisiteDefinitionRef, file = prereq && gitFile(ctx, prereq.commit, prereq.path);
      const matches = file && JSON.parse(file.bytes).registryChanges?.filter(c => c.path === choice.canonicalPath && c.match?.conceptKey === key);
      if (!prereq || file.sha256 !== prereq.sha256 || prereq.definitionSha256 !== sha(stable(choice.definition)) ||
          matches?.length !== 1 || !equal(matches[0].after, choice.definition)) fail("v3 reused definition prerequisite binding mismatch");
      definitions.push(reusedDefinition(ctx, choice, "conceptKey"));
    } else fail("v3 unsupported concept disposition");
    fields.crossConceptKeys = [...base, key];
  } else if (selected.type === "TPL") {
    preserveParent();
    const match = ctx.row.activeDefinitionMatch;
    if (selected.kind !== "NEW_TPL" || choice.disposition !== "ADD_ONLY" ||
        Object.hasOwn(ctx.row.after, "templateKey") && ![null, ""].includes(ctx.row.after.templateKey) ||
        match && (match.problemTypeKey !== pt || match.problemTypeStatus !== "ACTIVE" || match.templateKey !== null) ||
        !match && ctx.row.after.problemTypeKey !== pt ||
        ![pt, `${pt} / ${rpm.record.id}`].includes(selected.proposal.parent))
      fail("v3 template requires its exact native parent and unresolved template proposal");
    addTemplate();
  } else if (selected.type === "PT") {
    const match = ctx.row.activeDefinitionMatch, definition = choice.problemTypeDefinition;
    if (selected.kind !== "NEW_PT" || choice.disposition !== "ADD_ONLY" ||
        ["problemTypeKey", "templateKey"].some(k => Object.hasOwn(ctx.row.after, k) && ![null, ""].includes(ctx.row.after[k])) ||
        !match || match.problemTypeKey !== null || match.templateKey !== null || match.problemTypeStatus !== null ||
        match.templateStatus !== null || match.templateParent !== null || !equal(match.exactBindings, []) ||
        !text(selected.proposal.parent) || selected.proposal.parent !== `${rpm.record.id} / ${rpm.record.rpmPath.l3}` ||
        definition?.problemTypeKey !== pt || definition.ownerPack !== rpm.record.ownerPack ||
        choice.problemTypeRegistryChange?.path !== `${CANON}packs/${definition.ownerPack.toLowerCase().replaceAll("_", "-")}/taxonomy.json`)
      fail("v3 new parent requires an explicit unresolved native NEW_PT proposal");
    add(choice.problemTypeRegistryChange, "problemTypeKey", definition);compiledDefinition(definition, oldPt, newPt);fields.problemTypeKey = pt;
    addTemplate();
    const change = choice.bindingRegistryChange, binding = choice.binding,
      matchKeys = ["problemTypeKey", "curriculum", "standardCourse", "standardUnitKey", "subUnitKey"],
      expected = Object.fromEntries(matchKeys.map(k => [k, k === "curriculum" ? rpm.record.curriculum : ctx.final[k]]));
    authorizedChange(change);
    if (change?.path !== `${CANON}packs/${definition.ownerPack.toLowerCase().replaceAll("_", "-")}/bindings.json` ||
        change.collection !== "bindings" || change.before !== null || !equal(change.match, expected) || !equal(change.after, binding) ||
        Object.entries(expected).some(([k, v]) => binding?.[k] !== v) || binding.status !== "ACTIVE" ||
        binding.ownerPack !== definition.ownerPack || !equal(binding.supportingQuestionUids, [ctx.patch.questionUid]) || binding.supportingItemCount !== 1)
      fail("v3 new primary requires one exact independently authorized curriculum binding");
    const requested = (ctx.request.registryChanges || []).filter(c => c.path === change.path && c.collection === "bindings" && equal(c.match, change.match));
    const semanticChange = c => Object.fromEntries(["path", "collection", "match", "before", "after"].map(k => [k, c[k]]));
    if (requested.length ? requested.length !== 1 || !equal(semanticChange(requested[0]), semanticChange(change)) ||
          !requested[0].evidenceRefs?.some(r => equal(r, app.independentReviewRef)) :
        !JSON.parse(fs.readFileSync(safePath(ctx.root, change.path))).bindings?.some(r => equal(r, binding)))
      fail("v3 exact new binding is neither installed nor requested");
    definitions.push({ path: change.path, collection: "bindings", key: stable(expected), definitionSha256: sha(stable(binding)) });
  } else fail("v3 unsupported M2 proposal kind");
  const bindingKey = stable([rpm.record.curriculum, ctx.final.standardCourse, ctx.final.standardUnitKey, ctx.final.subUnitKey, pt]),
    oldBinding = ctx.canonicalBefore?.bindings?.get(bindingKey), newBinding = ctx.canonicalAfter?.bindings?.get(bindingKey);
  if (newBinding?.status !== "ACTIVE" || selected.type !== "PT" && (!oldBinding || !equal(oldBinding, newBinding)) ||
      selected.type === "PT" && Object.entries(choice.binding).some(([k, v]) => !equal(newBinding[k], v)))
    fail("v3 exact ACTIVE compiled curriculum binding mismatch");
  for (const field of ["crossConceptKeys", "conditionKeys", "integrationPattern"]) {
    if (Object.hasOwn(fields, field) || Object.hasOwn(ctx.accepted, field) || !Object.hasOwn(ctx.patch.after, field)) continue;
    const value = nativeFieldBase(ctx, field), valid = field === "integrationPattern" ? ["NONE", "SEQUENTIAL", "PARALLEL"].includes(value) : Array.isArray(value) && value.length === 0;
    const reviewField = { crossConceptKeys: "crossConcept", conditionKeys: "condition", integrationPattern: "integration" }[field];
    if (!valid || !text(ctx.row.fieldReview?.[reviewField]) || !equal(value, ctx.question[field]) || !equal(value, ctx.final[field]))
      fail("v3 cannot add missing or new native auxiliary values");
    fields[field] = value;retained[field] = sha(stable(value));
  }
  return { fields, snapshot, assets, definitions, decisions: [{ selection: selected.selection, disposition: choice.disposition,
    key: choice.definition.conceptKey || choice.definition.templateKey, retainedNativeFields: retained }],
    independentReviews: [app.independentReviewRef], reviewer: app.reviewer };
}
