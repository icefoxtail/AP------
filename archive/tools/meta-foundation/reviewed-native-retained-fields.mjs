import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { validateExistingPrimaryDisposition } from "./reviewed-existing-primary-disposition.mjs";

const fail = message => { throw new Error(`native retained fields: ${message}`); };
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const equal = (left, right) => stable(left) === stable(right);
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const text = value => typeof value === "string" && value.trim().length > 0;
const compact = value => value.replace(/\s+/gu, "");
const SCHEMA = "archive-reviewed-native-retained-fields-v1";
const RPM_PATH = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json";
export const NATIVE_RPM_EVIDENCE_ALIAS_SCHEMA = "archive-reviewed-native-rpm-evidence-alias-v1";
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const own = (value, key) => value && Object.hasOwn(value, key);
const exactKeys = (value, keys) => value && typeof value === "object" && !Array.isArray(value) &&
  equal(Object.keys(value).sort(), [...keys].sort());
const PRIMARY = ["problemTypeKey", "templateKey"];
const PARENTS = ["standardCourse", "standardUnitKey", "subUnitKey"];
const LABEL_KEYS = { standardUnit: "standardUnitKey", subUnit: "subUnitKey" };
export const REVIEWED_NATIVE_RETAINABLE_FIELDS = Object.freeze([
  ...PARENTS, ...PRIMARY, "crossConceptKeys", "conditionKeys", "integrationPattern", ...Object.keys(LABEL_KEYS),
]);

// This is an evidence-location opt-in, not another native approval. Keep it on
// the item so the immutable sourceReview/retainedFields/frozen renderer contract
// remains exact. It cannot be silently ignored by another registrar mode.
export function assertNativeRpmEvidenceAliasScope(request) {
  if (own(request, "nativeRpmEvidenceAlias") || own(request?.approval, "nativeRpmEvidenceAlias"))
    fail("native RPM alias belongs only to a selected retained item");
  for (const patch of Array.isArray(request?.items) ? request.items : []) {
    if (own(patch?.sourceReview, "nativeRpmEvidenceAlias") || own(patch?.sourceReview?.retainedFields, "nativeRpmEvidenceAlias"))
      fail("native RPM alias must not alter the original sourceReview");
    if (!own(patch, "nativeRpmEvidenceAlias")) continue;
    const spec = patch.nativeRpmEvidenceAlias, review = patch.sourceReview;
    if (request.schemaVersion !== "archive-reviewed-exam-meta-register-request-v2" ||
        request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
        request.approval.metadataReviewed !== true || request.registrationMode !== undefined ||
        request.approval.sourceRebind !== undefined || !Array.isArray(request.registryChanges) || request.registryChanges.length ||
        !/^original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/.test(request.sourceArchiveFile || "") ||
        patch.rebind !== undefined || review?.schemaVersion !== "archive-reviewed-source-reassessment-v1" ||
        review.retainedFields?.schemaVersion !== SCHEMA || review.proposalFinalization !== undefined ||
        review.rendererProof !== undefined || review.m2ProviderRendererProof !== undefined ||
        !exactKeys(spec, ["schemaVersion", "nativeCommit", "nativePath", "nativeSha256", "copyRef"]) ||
        spec.schemaVersion !== NATIVE_RPM_EVIDENCE_ALIAS_SCHEMA || !SHA1.test(spec.nativeCommit || "") ||
        spec.nativeCommit !== review.reviewCommit || spec.nativePath !== RPM_PATH || !SHA256.test(spec.nativeSha256 || "") ||
        !exactKeys(spec.copyRef, ["path", "sha256"]) || spec.copyRef.sha256 !== spec.nativeSha256 ||
        spec.copyRef.path !== `.archive-meta-register/evidence/retained-native-rpm/${spec.nativeCommit}/middle2.json`)
      fail("native RPM alias requires the closed existing M2 retained-fields scope");
    for (const refs of [request.approval.evidenceRefs, patch.evidenceRefs])
      if (!Array.isArray(refs) || refs.filter(ref => equal(ref, spec.copyRef)).length !== 1 ||
          refs.some(ref => ref?.path === RPM_PATH) ||
          refs.filter(ref => ref?.path === spec.copyRef.path).length !== 1)
        fail("native RPM alias must replace only the historical path in both evidence lists");
  }
}

function aliasFile(root, relative) {
  if (typeof relative !== "string" || path.isAbsolute(relative) || relative.includes("\\") || relative.includes("\0") ||
      relative.split("/").some(part => !part || part === "." || part === "..")) fail("unsafe native RPM alias path");
  const full = path.resolve(root, relative), stop = path.resolve(root);
  for (let current = full; current !== stop; current = path.dirname(current))
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) fail("native RPM alias symlink rejected");
  if (!fs.existsSync(full) || !fs.lstatSync(full).isFile()) fail("native RPM alias file missing");
  return fs.readFileSync(full);
}

function nativeRpmAlias({ root, native, row, request, patch, loaded }) {
  const spec = patch.nativeRpmEvidenceAlias;
  if (spec === undefined) return null;
  assertNativeRpmEvidenceAliasScope(request);
  const git = args => {
    try { return execFileSync("git", args, { cwd: root, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 16 * 1024 * 1024 }); }
    catch { fail("native RPM alias immutable Git input unavailable"); }
  };
  if (git(["rev-parse", "--verify", `${spec.nativeCommit}^{commit}`]).toString().trim() !== native.spec.reviewCommit)
    fail("native RPM alias commit differs from the actual native review");
  const head = git(["rev-parse", "--verify", "HEAD^{commit}"]).toString().trim();
  if (!SHA1.test(head)) fail("native RPM alias current HEAD unavailable");
  for (const commit of [spec.nativeCommit, head]) {
    const entry = git(["ls-tree", "-z", "--full-tree", commit, "--", RPM_PATH]).toString();
    if (!/^100(?:644|755) blob [a-f0-9]{40}\t[^\0]+\0$/.test(entry) || entry.split("\t")[1] !== RPM_PATH + "\0")
      fail("native RPM alias canonical Git path is not one regular file");
  }
  // Read both raw snapshots and the live files on every validation. No success,
  // current raw bytes or live-record equality is cached by this transport.
  const original = git(["show", `${spec.nativeCommit}:${RPM_PATH}`]), copied = aliasFile(root, spec.copyRef.path),
    current = aliasFile(root, RPM_PATH), committed = git(["show", `${head}:${RPM_PATH}`]);
  if (!original.equals(copied) || sha256(original) !== spec.nativeSha256 || loaded.sha256 !== spec.nativeSha256)
    fail("native RPM alias is not the exact immutable native raw copy");
  if (!current.equals(committed)) fail("native RPM alias current canonical bytes differ from HEAD");
  let before, after;
  try { before = JSON.parse(original); after = JSON.parse(current); }
  catch { fail("native RPM alias canonical JSON invalid"); }
  for (const document of [before, after])
    if (document?.schemaVersion !== "rpm-primary-active-crosswalk-v1" || document.status !== "ACTIVE_REFERENCE" ||
        document.grade !== "M2" || document.rpmAuthority?.version !== "RPM_PRIMARY_TAXONOMY_v1.0" ||
        document.rpmAuthority.status !== "LOCKED" ||
        document.rpmAuthority.source !== "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json" ||
        document.activeAuthority?.source !== "archive/data/meta-foundation/canonical/" ||
        !Array.isArray(document.records) || !document.records.length || document.records.some(record => !record || !text(record.id)) ||
        new Set(document.records.map(record => record.id)).size !== document.records.length)
      fail("native RPM alias requires matching ACTIVE M2 canonical headers");
  const header = document => Object.fromEntries(Object.entries(document).filter(([key]) =>
    !["records", "summary", "generatedAgainstMain"].includes(key)));
  if (!equal(header(before), header(after))) fail("native RPM alias canonical header drift");
  const priorRows = before.records.filter(record => record.id === row.rpmRecordId),
    currentRows = after.records.filter(record => record.id === row.rpmRecordId);
  if (priorRows.length !== 1 || currentRows.length !== 1 || !equal(priorRows[0], currentRows[0]))
    fail("native RPM alias selected whole record changed or missing");
  return { schemaVersion: NATIVE_RPM_EVIDENCE_ALIAS_SCHEMA, nativeCommit: spec.nativeCommit, nativePath: RPM_PATH,
    nativeSha256: spec.nativeSha256, copyRef: { ...spec.copyRef }, recordId: row.rpmRecordId,
    selectedRecordSha256: sha256(stable(priorRows[0])), newMetadataApprovals: 0, inferredValues: false };
}

function immutableRpm({ root, native, row, request, patch, cache }) {
  const commit = native.spec.reviewCommit, key = stable(["retained-native-rpm", root, commit]);
  let loaded = cache.get(key);
  if (!loaded) {
    let bytes;
    try { bytes = execFileSync("git", ["show", `${commit}:${RPM_PATH}`], { cwd: root,
      stdio: ["ignore", "pipe", "pipe"], maxBuffer: 16 * 1024 * 1024 }); }
    catch { fail("immutable native RPM scope unavailable"); }
    let document;
    try { document = JSON.parse(bytes); } catch { fail("immutable native RPM scope invalid"); }
    if (!Array.isArray(document.records)) fail("immutable native RPM records missing");
    loaded = { records: document.records, sha256: sha256(bytes) };cache.set(key, loaded);
  }
  const aliasProof = nativeRpmAlias({ root, native, row, request, patch, loaded });
  if (!aliasProof) for (const refs of [request.approval?.evidenceRefs, patch.evidenceRefs])
    if (!refs?.some(ref => ref.path === RPM_PATH && ref.sha256 === loaded.sha256))
      fail("native RPM scope must be bound by both evidence lists");
  const records = loaded.records.filter(record => record.id === row.rpmRecordId);
  if (records.length !== 1) fail("one exact native RPM record required");
  return { record: records[0], ref: { commit, path: RPM_PATH, sha256: loaded.sha256,
    recordId: row.rpmRecordId, recordSha256: sha256(stable(records[0])) }, aliasProof };
}

// This explicit lane carries only values already present in both source snapshots
// read by the immutable native review. Its field-specific review and unchanged
// ACTIVE definitions are mandatory; current metadata alone is never evidence.
export function validateReviewedNativeRetainedFields({ root, request, patch, native, row,
  accepted, question, final, canonicalBefore, canonicalAfter, studentPayload, studentFields, bankFromBytes, cache = new Map() }) {
  assertNativeRpmEvidenceAliasScope(request);
  const spec = patch.sourceReview?.retainedFields;
  if (spec === undefined) return null;
  if (!spec || spec.schemaVersion !== SCHEMA || Object.keys(spec).some(key => !["schemaVersion", "fields", "independentPrimary"].includes(key)) ||
      !Array.isArray(spec.fields) || !spec.fields.length || new Set(spec.fields).size !== spec.fields.length ||
      spec.fields.some(key => !REVIEWED_NATIVE_RETAINABLE_FIELDS.includes(key))) fail("explicit supported field selection required");
  if (request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.registrationMode !== undefined || request.approval.sourceRebind || patch.rebind !== undefined ||
      patch.sourceReview.rendererProof !== undefined || patch.sourceReview.proposalFinalization !== undefined ||
      (request.registryChanges || []).length || native.review.schemaVersion !== "m2-s2-meta-review-v1" ||
      !["KEEP", "CORRECT"].includes(row.rpmDecision) || (row.proposalRefs || []).length ||
      (row.contentDebt || []).length || !text(row.fieldReview?.classification) || !text(row.fieldReview?.binding))
    fail("requires an exclusive settled M2 native review without new definitions or proposals");
  const ordinal = patch.sourceOrdinal, before = native.reviewedBank[ordinal - 1], reviewed = native.committedBank[ordinal - 1];
  if (row.questionUid !== patch.questionUid || row.sourceOrdinal !== ordinal || !before || !reviewed)
    fail("native UID and ordinal mismatch");
  const fields = {}, fieldBindings = {};
  for (const key of REVIEWED_NATIVE_RETAINABLE_FIELDS.filter(key => spec.fields.includes(key))) {
    if (Object.hasOwn(accepted, key) || !Object.hasOwn(patch.after, key) ||
        !Object.hasOwn(before, key) || !Object.hasOwn(reviewed, key) || !Object.hasOwn(question, key) ||
        !equal(before[key], reviewed[key]) || !equal(before[key], question[key]) ||
        !equal(before[key], patch.after[key]) || !equal(before[key], final[key]))
      fail(`field is not omitted and identical in both immutable sources/current/request: ${key}`);
    fields[key] = before[key];fieldBindings[key] = { valueSha256: sha256(stable(before[key])) };
  }
  const pt = final.problemTypeKey, tpl = final.templateKey, oldPt = canonicalBefore?.pt?.get(pt),
    newPt = canonicalAfter?.pt?.get(pt), oldTpl = canonicalBefore?.tpl?.get(tpl), newTpl = canonicalAfter?.tpl?.get(tpl);
  if (!text(pt) || !text(tpl) || oldPt?.status !== "ACTIVE" || oldTpl?.status !== "ACTIVE" ||
      oldTpl.parentProblemTypeKey !== pt || !text(oldPt.ownerPack) || oldTpl.ownerPack !== oldPt.ownerPack ||
      !equal(oldPt, newPt) || !equal(oldTpl, newTpl)) fail("exact unchanged ACTIVE primary definitions required");
  for (const key of [...PARENTS, ...PRIMARY]) {
    if (!text(final[key]) || !equal(question[key], final[key]) ||
        (Object.hasOwn(accepted, key) ? !equal(accepted[key], final[key]) :
          !Object.hasOwn(before, key) || !Object.hasOwn(reviewed, key) ||
          !equal(before[key], final[key]) || !equal(reviewed[key], final[key])))
      fail(`final primary context lacks immutable native evidence: ${key}`);
  }
  const curriculum = final.curriculumKey || final.curriculum, rpm = immutableRpm({ root, native, row, request, patch, cache });
  if (!["2015", "2022"].includes(curriculum) || rpm.record.curriculum !== curriculum ||
      rpm.record.scope !== "M2-2" || final.courseKey !== rpm.record.scope ||
      (final.curriculum && final.curriculum !== curriculum)) fail("exact native curriculum and course scope required");
  const bindingContext = { curriculum, standardCourse: final.standardCourse, standardUnitKey: final.standardUnitKey,
    subUnitKey: final.subUnitKey, problemTypeKey: pt, status: "ACTIVE" };
  const exact = binding => Object.entries(bindingContext).every(([key, value]) => equal(binding[key], value));
  const priorBindings = [...(canonicalBefore?.bindings?.values() || [])].filter(exact),
    currentBindings = [...(canonicalAfter?.bindings?.values() || [])].filter(exact);
  if (priorBindings.length !== 1 || currentBindings.length !== 1 || !equal(priorBindings[0], currentBindings[0]))
    fail("one exact unchanged ACTIVE curriculum binding required");
  const independentPrimary = validateExistingPrimaryDisposition({ root, request, patch, native, row, question, final,
    canonicalBefore, canonicalAfter, studentPayload, studentFields, bankFromBytes, cache });
  let primaryOrigin = "EXPLICIT_NATIVE_AFTER", nativeBinding = null;
  if (independentPrimary) {
    if (!PRIMARY.every(key => Object.hasOwn(fields, key))) fail("independent primary disposition must select both omitted primary fields");
    primaryOrigin = "INDEPENDENT_EXISTING_PRIMARY_DISPOSITION";
  } else if (PRIMARY.some(key => Object.hasOwn(fields, key))) {
    const match = row.activeDefinitionMatch;
    if (match?.problemTypeKey !== pt || match.templateKey !== tpl || match.problemTypeStatus !== "ACTIVE" ||
        match.templateStatus !== "ACTIVE" || match.templateParent !== pt || !Array.isArray(match.exactBindings))
      fail("omitted primary requires an explicit native ACTIVE match; null is not approval");
    const uidSupported = oldPt.supportingQuestionUids?.includes(patch.questionUid) && oldTpl.supportingQuestionUids?.includes(patch.questionUid);
    const exactNative = match.exactBindings.length === 1 && equal(match.exactBindings[0], bindingContext);
    if (!exactNative) fail("omitted primary requires the exact native ACTIVE binding, including when the UID supports its definitions");
    primaryOrigin = uidSupported ? "UNCHANGED_UID_SUPPORTED_NATIVE_MATCH" : "EXACT_NATIVE_ACTIVE_BINDING_AND_FIELD_REVIEW";
    if (exactNative) nativeBinding = sha256(stable(match.exactBindings[0]));
  } else if (PRIMARY.some(key => !Object.hasOwn(row.after, key) || !equal(row.after[key], final[key])))
    fail("auxiliary or parent retention requires an explicit native primary tuple");
  const parentBindings = {};
  if (PARENTS.some(key => Object.hasOwn(fields, key))) {
    if (rpm.record.standardUnitKey !== final.standardUnitKey || rpm.record.subUnitKey !== final.subUnitKey)
      fail("retained parent differs from the immutable native RPM context");
    for (const key of ["standardUnitKey", "subUnitKey"]) {
      const old = canonicalBefore?.master?.get(final[key]), current = canonicalAfter?.master?.get(final[key]);
      if (!old || old.keyType !== key || old.status !== "active" || !equal(old, current) ||
          key === "subUnitKey" && old.parentKey !== final.standardUnitKey)
        fail("retained parent requires the exact unchanged active master hierarchy");
      parentBindings[key] = sha256(stable(old));
    }
  }
  for (const [label, key] of Object.entries(LABEL_KEYS)) if (Object.hasOwn(fields, label)) {
    const parent = canonicalBefore?.master?.get(final[key]);
    if (!Object.hasOwn(fields, key) || !parentBindings[key] || fields[label] !== parent?.labelKo)
      fail("retained display label must be the exact master label of its selected retained parent");
    fieldBindings[label].parentField = key;fieldBindings[label].masterSha256 = parentBindings[key];
  }
  const conceptBindings = {};
  if (Object.hasOwn(fields, "crossConceptKeys")) {
    const keys = fields.crossConceptKeys, review = row.fieldReview.crossConcept;
    if (!Array.isArray(keys) || new Set(keys).size !== keys.length || keys.some(key => !text(key)) || !text(review))
      fail("retained cross-concepts require explicit per-field evidence");
    if (!keys.length && !/(?:없|빈\s*배열|\[\s*\])/u.test(review)) fail("empty cross-concepts lack an explicit absence review");
    for (const key of keys) {
      const old = canonicalBefore?.cc?.get(key), current = canonicalAfter?.cc?.get(key);
      if (old?.status !== "ACTIVE" || !text(old.canonicalLabelKo) || !equal(old, current) ||
          !compact(review).includes(compact(old.canonicalLabelKo)))
        fail("retained cross-concept needs its exact unchanged ACTIVE label in native field review");
      conceptBindings[key] = sha256(stable(old));
    }
    fieldBindings.crossConceptKeys.reviewSha256 = sha256(review);
  }
  if (Object.hasOwn(fields, "conditionKeys")) {
    const review = row.fieldReview.condition;
    if (!Array.isArray(fields.conditionKeys) || fields.conditionKeys.length || !text(review) ||
        !/(?:NOT_APPLICABLE|없|conditionKeys\s*=\s*\[\s*\])/u.test(review))
      fail("only an explicitly reviewed empty condition set may be retained");
    fieldBindings.conditionKeys.reviewSha256 = sha256(review);
  }
  if (Object.hasOwn(fields, "integrationPattern")) {
    const review = row.fieldReview.integration, pattern = fields.integrationPattern;
    if (!text(review) || (pattern === "NONE" ? !/(?:NONE|한\s*주개념|단일|Primary\s+taxonomy\s+내부\s+단계)/u.test(review) :
      pattern === "SEQUENTIAL" ? !/(?:SEQUENTIAL|순차)/u.test(review) : true))
      fail("retained integration pattern lacks the exact native field review");
    fieldBindings.integrationPattern.reviewSha256 = sha256(review);
  }
  return { fields, proof: { schemaVersion: SCHEMA, questionUid: patch.questionUid, sourceOrdinal: ordinal,
    nativeItemSha256: sha256(stable(row)), reviewedSourceBlobSha1: native.sourceBlob,
    reviewCommitSourceBlobSha1: native.committedBlob, fieldBindings, primaryOrigin,
    nativeFieldReviewSha256: sha256(stable(row.fieldReview)),
    problemTypeDefinitionSha256: sha256(stable(oldPt)), templateDefinitionSha256: sha256(stable(oldTpl)),
    exactBindingSha256: sha256(stable(priorBindings[0])), nativeExactBindingSha256: nativeBinding,
    nativeRpmRef: rpm.ref, parentBindings, conceptBindings,
    ...(rpm.aliasProof ? { nativeRpmEvidenceAlias: rpm.aliasProof } : {}),
    ...(independentPrimary ? { independentPrimary, independentApplicabilityDecision: true } : { newFieldJudgments: false }),
    newDefinitions: false, newMathematicalQa: false, inferredValues: false } };
}
