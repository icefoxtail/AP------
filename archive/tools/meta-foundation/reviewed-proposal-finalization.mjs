import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const fail = message => { throw new Error(`native proposal finalization: ${message}`); };
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => stable(a) === stable(b);
const text = v => typeof v === "string" && v.trim();
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const CANON = "archive/data/meta-foundation/canonical/";
const sorted = values => [...values].sort();
const uniqueStrings = values => Array.isArray(values) && values.every(text) && new Set(values).size === values.length;
const ACTIVE_REUSE_KINDS = new Set(["EXISTING_ACTIVE_CROSSWALK_CONNECTION", "REUSE_ACTIVE_ADD_CROSSWALK", "RPM_LEAF_GAP_ACTIVE_TEMPLATE_REUSE",
  "EXISTING_ACTIVE_LINK_GAP", "RPM_LEAF_LINK_PROPOSAL"]);

function safePath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes("\\") || relative.includes("\0") ||
      relative.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe evidence path");
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink evidence path");
  return full;
}

function git(root, args) {
  try { return execFileSync("git", args, { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }); }
  catch { fail("immutable Git object unavailable"); }
}

function gitFile(ctx, commit, relative) {
  safePath(ctx.root, relative);
  if (!SHA1.test(commit || "")) fail("exact immutable commit required");
  const key = `proposal-git:${commit}:${relative}`;
  if (!ctx.cache.has(key)) {
    if (git(ctx.root, ["rev-parse", "--verify", `${commit}^{commit}`]).toString().trim() !== commit)
      fail("exact immutable commit required");
    const blob = git(ctx.root, ["rev-parse", `${commit}:${relative}`]).toString().trim();
    const bytes = git(ctx.root, ["cat-file", "blob", blob]);
    ctx.cache.set(key, { blob, bytes, sha256: sha(bytes) });
  }
  return ctx.cache.get(key);
}

function parse(bytes) {
  try { return JSON.parse(bytes); } catch { fail("invalid JSON evidence"); }
}

function boundDocument(ctx, ref) {
  if (!ref || Object.keys(ref).some(k => !["path", "sha256"].includes(k)) || !SHA256.test(ref.sha256 || ""))
    fail("SHA-bound finalization evidence required");
  const full = safePath(ctx.root, ref.path);
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (!refs?.some(r => r.path === ref.path && r.sha256 === ref.sha256)) fail("finalization evidence must bind approval and item");
  if (!fs.existsSync(full) || sha(fs.readFileSync(full)) !== ref.sha256) fail("local finalization evidence changed");
  const file = gitFile(ctx, ctx.spec.finalizationCommit, ref.path);
  if (file.sha256 !== ref.sha256) fail("finalization evidence differs from immutable commit");
  return parse(file.bytes);
}

function nativeProposals(ctx) {
  const { native, row, patch } = ctx, ref = native.review.artifactRefs?.proposals;
  let proposals = native.review.proposals || [], origin = { path: native.spec.reviewPath, sha256: native.spec.reviewRef.sha256 };
  if (ref) {
    if (native.review.proposals !== undefined || !SHA256.test(ref.sha256 || "")) fail("ambiguous native proposal document");
    const file = gitFile(ctx, native.spec.reviewCommit, ref.path);
    if (file.sha256 !== ref.sha256) fail("native proposal document SHA mismatch");
    proposals = parse(file.bytes); origin = { path: ref.path, sha256: ref.sha256 };
  }
  if (!Array.isArray(proposals) || !uniqueStrings(row.proposalRefs || [])) fail("invalid native proposal inventory");
  const byId = new Map();
  for (const proposal of proposals) {
    if (!proposal || typeof proposal !== "object" || Array.isArray(proposal)) fail("invalid native proposal entry");
    const id = proposal.id || proposal.proposalId;
    if (id === undefined) continue;
    if (!text(id) || proposal.id && proposal.proposalId && proposal.id !== proposal.proposalId || byId.has(id))
      fail("ambiguous native proposal ID");
    byId.set(id, proposal);
  }
  for (const id of row.proposalRefs || []) if (!byId.has(id)) fail("native item proposal is missing");
  const selected = [], technical = [];
  for (const proposal of proposals) {
    const id = proposal.id || proposal.proposalId;
    // M2 TERM proposals belong to the separate four-slot vocabulary contract.
    // FINAL_QA's value allowlist cannot register a term or its candidate fields.
    if (native.review.schemaVersion === "m2-s2-meta-review-v1" && proposal.type === "TERM") continue;
    const ordinals = proposal.supportOrdinals || proposal.ordinals ||
      (proposal.ordinal !== undefined ? [proposal.ordinal] : proposal.sourceOrdinal !== undefined ? [proposal.sourceOrdinal] : undefined);
    const supportingUids = proposal.supportingQuestionUids || (proposal.questionUid !== undefined ? [proposal.questionUid] : undefined);
    const declared = (row.proposalRefs || []).includes(id);
    const supportsUid = supportingUids?.includes(patch.questionUid);
    if (!declared && !supportsUid && !ordinals?.includes(patch.sourceOrdinal)) continue;
    if (!uniqueStrings(supportingUids) || !supportsUid ||
        proposal.questionUid !== undefined && proposal.questionUid !== patch.questionUid ||
        proposal.ordinal !== undefined && proposal.ordinal !== patch.sourceOrdinal ||
        proposal.sourceOrdinal !== undefined && proposal.sourceOrdinal !== patch.sourceOrdinal ||
        ordinals !== undefined && (!Array.isArray(ordinals) || !ordinals.every(Number.isInteger) ||
          new Set(ordinals).size !== ordinals.length || !ordinals.includes(patch.sourceOrdinal)))
      fail("native proposal does not support the exact UID/ordinal");
    const kind = native.review.schemaVersion === "m3-s2-complete-semantic-review-v1" ? proposal.kind || proposal.type : proposal.type;
    if (native.review.schemaVersion === "m3-s2-complete-semantic-review-v1" && ACTIVE_REUSE_KINDS.has(kind)) {
      technical.push(validateActiveReuse(ctx, { id, kind, proposal, origin })); continue;
    }
    if (["BINDING", "EXACT_BINDING", "LINK", "LINK_MISSING"].includes(kind)) continue;
    if (!text(id)) fail("selected semantic proposal requires an exact native ID");
    const type = ["CC", "NEW_CC", "CROSS_CONCEPT"].includes(kind) ? "CC" : ["TPL", "NEW_TPL", "NEW_TEMPLATE"].includes(kind) ? "TPL" : "UNSUPPORTED";
    selected.push({ id, type, proposal, origin });
  }
  const semanticDebt = [...(row.debts || []), ...(row.registrationDebt || [])].some(d =>
    /^(NEW_CC|NEW_CROSS_CONCEPT|NEW_CROSSCONCEPT|CROSS_CONCEPT_DEFINITION_GAP|NEW_CONDITION|NEW_TPL|NEW_TEMPLATE|NEW_TPL_PROPOSAL|NEW_PT|NEW_PROBLEM_TYPE|DEFINITION_REQUIRED)$/.test(typeof d === "string" ? d : d?.type || d?.kind || ""));
  if (semanticDebt && !selected.length) fail("unresolved native definition debt has no bound proposal");
  return { selected, technical };
}

function validateActiveReuse(ctx, { id, kind, proposal, origin }) {
  const ptKey = ctx.accepted.problemTypeKey, tplKey = ctx.accepted.templateKey;
  const beforePt = ctx.canonicalBefore?.pt?.get(ptKey), beforeTpl = ctx.canonicalBefore?.tpl?.get(tplKey);
  const afterPt = ctx.canonicalAfter?.pt?.get(ptKey), afterTpl = ctx.canonicalAfter?.tpl?.get(tplKey);
  if (!text(ptKey) || !text(tplKey) || ctx.final.problemTypeKey !== ptKey || ctx.final.templateKey !== tplKey ||
      beforePt?.status !== "ACTIVE" || beforeTpl?.status !== "ACTIVE" || beforeTpl.parentProblemTypeKey !== ptKey ||
      !equal(beforePt, afterPt) || !equal(beforeTpl, afterTpl)) fail("technical reuse requires unchanged pre-existing ACTIVE PT/TPL definitions");
  if (kind === "EXISTING_ACTIVE_CROSSWALK_CONNECTION") {
    if (!uniqueStrings(proposal.existingTemplates) || !proposal.existingTemplates.includes(tplKey)) fail("technical connection does not name the native template");
  } else if (kind === "REUSE_ACTIVE_ADD_CROSSWALK") {
    if (proposal.templateKey !== tplKey || proposal.parentProblemTypeKey !== ptKey ||
        proposal.globalActiveSearch?.selectedStatus !== "ACTIVE" || proposal.registrationStatus !== "PROPOSAL_ONLY_NOT_INSERTED")
      fail("technical crosswalk reuse differs from native PT/TPL");
  } else if (kind === "EXISTING_ACTIVE_LINK_GAP") {
    if (proposal.existingTemplate !== tplKey || proposal.parent !== ptKey || proposal.searchedGlobalActive !== true)
      fail("existing link gap differs from native PT/TPL");
  } else if (kind === "RPM_LEAF_LINK_PROPOSAL") {
    if (proposal.reuseTemplate !== tplKey || proposal.searchedGlobalActive !== true || proposal.registrationStatus !== "PROPOSAL_ONLY_NOT_INSERTED")
      fail("RPM leaf proposal does not preserve the native template");
  } else if (proposal.existingTemplateKey !== tplKey || proposal.parentProblemTypeKey !== ptKey ||
      proposal.nativeTemplateProposalWithdrawn !== true || proposal.sourceNewStringKeyInserted !== false ||
      proposal.registrationStatus !== "PUBLISHER_LEAF_AND_CONNECTION_ONLY_NATIVE_REUSE")
    fail("publisher-leaf gap does not preserve the reviewed ACTIVE template");
  return { ...(id ? { id } : {}), kind, proposalSha256: sha(stable(proposal)), documentRef: origin,
    problemTypeKey: ptKey, templateKey: tplKey, problemTypeDefinitionSha256: sha(stable(beforePt)), templateDefinitionSha256: sha(stable(beforeTpl)),
    scope: "EXISTING_ACTIVE_PT_TPL_REUSE", newDefinition: false, newMathematicalQa: false };
}

function exactNativeRef(ctx, ref) {
  if (!equal(ref, { commit: ctx.native.spec.reviewCommit, path: ctx.native.spec.reviewPath, sha256: ctx.native.spec.reviewRef.sha256 }))
    fail("finalization native review binding mismatch");
}

function oneRow(rows, ctx, ordinalKey) {
  if (!Array.isArray(rows)) fail("finalization applications missing");
  const candidates = rows.filter(r => r.questionUid === ctx.patch.questionUid);
  if (candidates.length !== 1 || candidates[0][ordinalKey] !== ctx.patch.sourceOrdinal ||
      candidates[0].sourcePath !== `archive/exams/${ctx.request.sourceArchiveFile}` ||
      ctx.native.review.examId && candidates[0].examId !== ctx.native.review.examId)
    fail("finalization application UID/ordinal/source mismatch");
  return candidates[0];
}

function sourceSnapshot(ctx, { commit, sourcePath, blob, sha256, questionSha256 }) {
  if (!SHA1.test(blob || "") || !SHA256.test(sha256 || "") || !SHA256.test(questionSha256 || "")) fail("source snapshot digest missing");
  const file = gitFile(ctx, commit, sourcePath);
  if (file.blob !== blob || file.sha256 !== sha256) fail("source snapshot Git/blob/SHA mismatch");
  const bank = ctx.bankFromBytes(file.bytes), q = bank[ctx.patch.sourceOrdinal - 1];
  if (bank.length !== ctx.request.expectedQuestionCount || !q || sha(stable(q)) !== questionSha256 ||
      !equal(ctx.studentPayload(q), ctx.studentPayload(ctx.question))) fail("source snapshot question/protected payload mismatch");
  return { commit, sourcePath, blob, sha256, questionSha256, question: q };
}

function assetBindings(ctx, snapshot, primary) {
  const references = new Set();
  const assetPath = value => {
    if (typeof value !== "string" || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail("unsupported renderer asset reference");
    const p = value.startsWith("archive/") ? value : `archive/${value}`;
    safePath(ctx.root, p); references.add(p); return p;
  };
  const walkAsset = value => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "string") { assetPath(value); return; }
    if (Array.isArray(value)) { value.forEach(walkAsset); return; }
    // No broad object-shape or remote-URL exception: this narrow finalization lane
    // can be extended only with an explicit renderer contract and regression.
    fail("unsupported renderer asset shape");
  };
  for (const field of ["image", "images", "solutionImage", "solutionImages"]) walkAsset(ctx.question[field]);
  const inspectInline = value => {
    if (typeof value === "string") {
      for (const match of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
        if (match[1].startsWith("#")) continue;
        assetPath(match[1]);
      }
      if (/url\s*\(/i.test(value)) fail("unsupported inline asset URL");
    } else if (Array.isArray(value)) value.forEach(inspectInline);
    else if (value && typeof value === "object") Object.values(value).forEach(inspectInline);
  };
  inspectInline(ctx.studentPayload(ctx.question));
  if (!primary || primary.path !== assetPath(ctx.question.image) || !SHA256.test(primary.sha256 || "")) fail("independently inspected primary image binding missing");
  return sorted(references).map(p => {
    const file = gitFile(ctx, snapshot.commit, p), original = gitFile(ctx, ctx.native.spec.reviewCommit, p), full = safePath(ctx.root, p);
    if (file.sha256 !== original.sha256 || !fs.existsSync(full) || sha(fs.readFileSync(full)) !== file.sha256 ||
        p === primary.path && (file.sha256 !== primary.sha256 || primary.blob && file.blob !== primary.blob))
      fail("reviewed renderer asset bytes changed");
    if (/\.svg$/i.test(p)) {
      const svg = file.bytes.toString("utf8"), dependencies = [
        ...[...svg.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]),
        ...[...svg.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m => m[1]),
      ];
      if (dependencies.some(ref => !ref.startsWith("#") && !/^data:image\/[a-z0-9.+-]+;base64,/i.test(ref)))
        fail("unsupported SVG renderer dependency");
    }
    return { path: p, gitBlobSha1: file.blob, sha256: file.sha256 };
  });
}

function exactDefinition(ctx, change, keyField, definition) {
  const collection = keyField === "conceptKey" ? "concepts" : "templates", key = definition?.[keyField];
  if (!text(key) || definition.status !== "ACTIVE" || !text(definition.canonicalLabelKo) || !text(definition.definition) ||
      !uniqueStrings(definition.supportingQuestionUids) || !definition.supportingQuestionUids.includes(ctx.patch.questionUid) ||
      definition.supportingItemCount !== definition.supportingQuestionUids.length ||
      !change?.path?.startsWith(CANON) || change.collection !== collection || change.before !== null ||
      !equal(change.match, { [keyField]: key }) || !equal(change.after, definition)) fail("add-only exact finalized definition required");
  const proposed = (ctx.request.registryChanges || []).filter(c => c.path === change.path &&
    (c.collection === collection && c.match?.[keyField] === key || !c.collection));
  if (proposed.length) {
    if (proposed.length !== 1 || proposed[0].before !== null) fail("finalized definition cannot replace an existing record");
    const c = proposed[0], records = c.collection ? [c.after] : c.after?.[collection];
    const matching = records?.filter(r => r[keyField] === key);
    if (matching?.length !== 1 || !equal(matching[0], definition) ||
        c.collection && !equal(c.match, change.match)) fail("registry change differs from finalized definition");
  } else {
    const full = safePath(ctx.root, change.path);
    if (!fs.existsSync(full)) fail("finalized definition is neither installed nor requested");
    const records = parse(fs.readFileSync(full))[collection]?.filter(r => r[keyField] === key);
    if (records?.length !== 1 || !equal(records[0], definition)) fail("installed definition differs from finalization");
  }
  return { path: change.path, collection, key, definitionSha256: sha(stable(definition)) };
}

function finalizeConcept(ctx, proof, proposals) {
  if (ctx.native.review.schemaVersion !== "m2-s2-meta-review-v1" || proposals.some(p => p.type !== "CC") ||
      proof.status !== "DEFINITIONS_FINALIZED_OFFICIAL_REGISTRATION_PENDING" || !text(proof.reviewer) ||
      proof.reviewer === ctx.native.reviewer || proof.nativeReviewCommit !== ctx.native.spec.reviewCommit ||
      proof.scope?.newFullMathematicalQa !== false || proof.scope?.newReview2Claims !== 0 ||
      proof.scope?.newMetadataApprovals !== 0 || proof.scope?.newDifficultyJudgments !== 0 ||
      ctx.spec.proposalMappingRef || ctx.spec.sourceBindingRef) fail("unsupported cross-concept finalization scope");
  const registry = boundDocument(ctx, ctx.spec.registryChangesRef);
  if (registry.schemaVersion !== "archive-reviewed-cross-concept-registry-change-proposal-v1" ||
      registry.status !== "PENDING_OFFICIAL_REGISTRAR" || !registry.evidenceRefs?.some(r => equal(r, ctx.spec.finalizationRef)))
    fail("registry proposal is not bound to independent finalization");
  const app = oneRow(proof.applications, ctx, "sourceOrdinal");
  exactNativeRef(ctx, app.nativeReviewRef);
  if (app.nativeItemStableSha256 !== sha(stable(ctx.row)) ||
      !equal(sorted(app.nativeProposalRefs || []), sorted(ctx.spec.proposalIds)) ||
      app.definitionDisposition !== "ADD_EXACT_NEW_CANONICAL_CC" || app.newMathematicalQa !== false ||
      app.newMetadataApproval !== false || app.difficultyChanged !== false ||
      !equal(app.nativeProtectedStudentFieldsChanges, [])) fail("cross-concept native application mismatch");
  const snapshot = sourceSnapshot(ctx, { commit: app.currentSourceCommit, sourcePath: app.sourcePath,
    blob: app.currentSourceBlobSha1, sha256: app.currentSourceRawSha256, questionSha256: app.currentWholeQuestionStableSha256 });
  if (app.currentSourceCommit !== proof.actualMain || app.currentProblemFigure?.commit !== snapshot.commit ||
      app.currentProblemFigure?.visuallyInspected !== true) fail("independently reviewed source/figure mismatch");
  const assets = assetBindings(ctx, snapshot, { path: app.currentProblemFigure.path,
    sha256: app.currentProblemFigure.sha256, blob: app.currentProblemFigure.gitBlobSha1 });
  for (const field of ["standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"])
    if (!text(app.reviewedPrimaryContext?.[field]) || app.reviewedPrimaryContext[field] !== ctx.final[field])
      fail(`finalized primary context mismatch: ${field}`);
  const base = Object.hasOwn(ctx.accepted, "crossConceptKeys") ? ctx.accepted.crossConceptKeys :
    ctx.native.committedBank[ctx.patch.sourceOrdinal - 1].crossConceptKeys;
  if (!uniqueStrings(base) || !equal(base, app.nativeAfterCrossConceptKeys) ||
      !Object.hasOwn(ctx.accepted, "crossConceptKeys") && !equal(base, ctx.native.reviewedBank[ctx.patch.sourceOrdinal - 1].crossConceptKeys) ||
      !text(app.addCrossConceptKey) || base.includes(app.addCrossConceptKey)) fail("native cross-concepts cannot be removed or replaced");
  const decisions = proof.definitionDecisions?.filter(d => d.definition?.conceptKey === app.addCrossConceptKey);
  const changes = registry.registryChanges?.filter(c => c.match?.conceptKey === app.addCrossConceptKey);
  if (decisions?.length !== 1 || changes?.length !== 1) fail("unique finalized concept definition missing");
  const definition = exactDefinition(ctx, changes[0], "conceptKey", decisions[0].definition);
  return { fields: { crossConceptKeys: [...base, app.addCrossConceptKey] }, snapshot, assets, definitions: [definition], reviewer: proof.reviewer };
}

function finalizeTemplate(ctx, proof, proposals) {
  if (ctx.native.review.schemaVersion !== "m3-s2-complete-semantic-review-v1" || proposals.length !== 1 || proposals[0].type !== "TPL" ||
      proof.decision !== "APPROVE_ADD_ONLY_EXACT_TEMPLATE_FINALIZATION" || !text(proof.reviewer) ||
      proof.reviewer === ctx.native.reviewer || ctx.spec.registryChangesRef) fail("unsupported template finalization scope");
  const mapping = boundDocument(ctx, ctx.spec.proposalMappingRef), binding = boundDocument(ctx, ctx.spec.sourceBindingRef);
  if (mapping.schemaVersion !== "archive-m3s2-exact-type-finalization-review-request-v1" ||
      binding.schemaVersion !== "archive-exact-template-finalization-source-binding-v1" ||
      proof.reviewRequest?.sha256 !== ctx.spec.proposalMappingRef.sha256 ||
      !equal(binding.independentReviewRef, ctx.spec.finalizationRef) || !equal(binding.proposalMappingRef, ctx.spec.proposalMappingRef) ||
      binding.historicalReviewSourceCommit !== proof.sourceCommit || binding.registryDefinitionUnchanged !== true ||
      binding.newMathematicalQa !== false || binding.newMetadataApprovals !== 0 ||
      proof.targetTemplateKey !== mapping.targetTemplateKey || proof.targetTemplateKey !== binding.targetTemplateKey ||
      !equal(proof.registryChange, mapping.registryChange)) fail("independent template proof/mapping/source binding mismatch");
  const app = oneRow(proof.rows, ctx, "ordinal"), mapped = oneRow(mapping.rows, ctx, "ordinal"), source = oneRow(binding.rows, ctx, "sourceOrdinal");
  for (const r of [app, mapped, source]) exactNativeRef(ctx, r.nativeReview);
  const { exam, ...originalProposal } = mapped.originalProposal || {};
  if (exam !== app.examId || !equal(originalProposal, proposals[0].proposal) || !equal(mapped.nativeItem, ctx.row) ||
      source.sourceIdenticalToIndependentReview !== true || app.decision !== "EXACT_TEMPLATE_SUPPORTED" || app.imageViewedByRoot !== true ||
      !equal([app.sourceBlobSha1, app.sourceSha256, app.questionSha256], [source.sourceBlobSha1, source.sourceRawSha256, source.questionStableSha256]) ||
      !equal([mapped.currentSourceBlobSha1, mapped.currentSourceSha256], [source.sourceBlobSha1, source.sourceRawSha256]))
    fail("template native proposal/application/source mismatch");
  const snapshot = sourceSnapshot(ctx, { commit: binding.publishedSourceCommit, sourcePath: source.sourcePath,
    blob: source.sourceBlobSha1, sha256: source.sourceRawSha256, questionSha256: source.questionStableSha256 });
  if (!equal(mapped.currentQuestion, snapshot.question)) fail("template mapping question differs from immutable snapshot");
  const assets = assetBindings(ctx, snapshot, { path: app.imagePath, sha256: app.imageSha256 });
  const definition = proof.registryChange.after, proposal = proposals[0].proposal;
  if (![null, ""].includes(ctx.accepted.templateKey) || proposal.proposedKey !== proof.targetTemplateKey ||
      definition.templateKey !== proof.targetTemplateKey || definition.parentProblemTypeKey !== proposal.parentProblemTypeKey ||
      definition.parentProblemTypeKey !== ctx.accepted.problemTypeKey || definition.parentProblemTypeKey !== ctx.final.problemTypeKey)
    fail("finalization may only fill the exact native empty template under its approved parent");
  return { fields: { templateKey: definition.templateKey }, snapshot, assets,
    definitions: [exactDefinition(ctx, proof.registryChange, "templateKey", definition)], reviewer: proof.reviewer };
}

// The original native review remains immutable. A second independently authored,
// Git-bound definition review can settle only the proposal explicitly supported by
// this UID; it cannot supply a new stem, solution, difficulty, PT or native verdict.
export function validateNativeProposalFinalization(args) {
  const ctx = { ...args, spec: args.patch.sourceReview.proposalFinalization };
  const { selected: proposals, technical } = nativeProposals(ctx);
  if (!ctx.spec) {
    if (proposals.length) fail("native semantic proposal requires explicit independent finalization");
    return technical.length ? { fields: {}, technicalBindings: technical } : null;
  }
  const allowed = ["schemaVersion", "finalizationCommit", "finalizationRef", "registryChangesRef", "proposalMappingRef", "sourceBindingRef", "proposalIds"];
  if (ctx.request.registrationMode || ctx.spec.schemaVersion !== "archive-native-proposal-finalization-v1" ||
      Object.keys(ctx.spec).some(k => !allowed.includes(k)) || !SHA1.test(ctx.spec.finalizationCommit || "") ||
      !uniqueStrings(ctx.spec.proposalIds) || !ctx.spec.proposalIds.length ||
      !equal(sorted(ctx.spec.proposalIds), sorted(proposals.map(p => p.id))) || proposals.some(p => p.type === "UNSUPPORTED"))
    fail("exact supported native proposal selection required");
  const proof = boundDocument(ctx, ctx.spec.finalizationRef);
  const result = proof.schemaVersion === "archive-cross-concept-narrow-definition-finalization-v1" ? finalizeConcept(ctx, proof, proposals) :
    proof.schemaVersion === "archive-independent-exact-template-finalization-review-v1" ? finalizeTemplate(ctx, proof, proposals) : null;
  if (!result) fail("unsupported independent finalization schema");
  for (const [field, value] of Object.entries(result.fields)) {
    if (!Object.hasOwn(ctx.patch.after, field) || !equal(ctx.patch.after[field], value) || !equal(ctx.question[field], value) || !equal(ctx.final[field], value))
      fail(`finalized value must bind explicit request, source and final metadata: ${field}`);
  }
  const { question, ...snapshot } = result.snapshot;
  return { fields: result.fields, technicalBindings: technical, proof: { ...ctx.spec, reviewer: result.reviewer,
    nativeAfterSha256: sha(stable(ctx.row.after)), nativeProposalBindings: proposals.map(p => ({ id: p.id, type: p.type,
      proposalSha256: sha(stable(p.proposal)), documentRef: p.origin })),
    sourceSnapshot: snapshot, assetBindings: result.assets, definitions: result.definitions,
    finalizedFields: result.fields, newMathematicalQa: false, newReview2Claims: 0 } };
}
