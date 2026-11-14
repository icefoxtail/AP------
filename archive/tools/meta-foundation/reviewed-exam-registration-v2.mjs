import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { execFileSync } from "node:child_process";
import canonical from "../../archive2-canonical.js";
import { loadCanonical, buildCompiled, compiledOutputs, buildRegistryIndex } from "./compile-meta-foundation.mjs";
import { refreshRuntime } from "./reviewed-runtime-summary.mjs";
import { computeLegacyCompat } from "./register-difficulty5.mjs";

const CANON = "archive/data/meta-foundation/canonical";
const INDEX = `${CANON}/registry_index.json`;
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const RPM_MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
const RECEIVED = "archive/data/meta-os/received-values.json";
const RECEIVED_KINDS = new Set(["unit", "subUnit", "rpmPath", "pt", "tpl", "cross", "cond", "term4"]);
const RECEIVED_STATUS = new Set(["UNGROUPED", "GROUPED", "WITHDRAWN"]);
const SIX_INTEGRATION = new Set(["NONE", "SEQUENTIAL", "INTERDEPENDENT", "REINTERPRETATION", "CASE_BRANCH", "DEEP_COMPOSITE"]);
const CANDIDATE_FIELDS = new Set(["standardUnitKey", "subUnitKey", "rpmPath", "crossConceptKeys", "conditionKeys", "integrationPattern"]);
const CANDIDATE_SOURCES = new Set(["agree", "p3", "p4-luna", "p4-sonnet", "proposed-new", "registered", "source-js"]);
const json = value => JSON.stringify(value, null, 2) + "\n";
// Received-values registry: an append-only table beside the sealed canonical tables (which it never rewrites). Missing file = empty registry.
export function loadReceivedValues(root) {
  const file = path.join(root, RECEIVED);
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  const doc = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  if (doc.schemaVersion !== "archive-received-values-v1" || !Array.isArray(doc.records)) fail("received-values schema mismatch");
  for (const r of doc.records) {
    if (!RECEIVED_KINDS.has(r.kind)) fail("received-values kind invalid: " + r.kind);
    for (const k of ["value", "label", "reason", "firstExam", "receivedAt"]) requireText(r[k], "received-values " + k);
    if (typeof r.parent !== "string") fail("received-values parent required: " + r.value);
    if (!RECEIVED_STATUS.has(r.status)) fail("received-values status invalid: " + r.value);
    const key = r.kind + "\0" + r.value;
    if (map.has(key)) fail("received-values duplicate: " + r.kind + "/" + r.value);
    map.set(key, r);
  }
  return map;
}
const receivedActive = (tables, kind, value) => { const r = tables.received?.get(kind + "\0" + value); return r && r.status !== "WITHDRAWN" ? r : null; };
// A unit/sub-unit key that is not in the sealed master may be a received value (type-hold rows only).
function masterOrReceivedKey(tables, key, kind) {
  const m = tables.master.get(key);
  if (m) return m;
  const r = receivedActive(tables, kind === "standardUnitKey" ? "unit" : "subUnit", key);
  if (!r) return null;
  return { key, keyType: kind, status: "active", labelKo: r.label, standardUnitKey: kind === "subUnitKey" ? r.parent : undefined, received: true };
}
let rpmIndexCache = null;
function rpmPathKnown(root, tables, p) {
  if (!rpmIndexCache || rpmIndexCache.root !== root) {
    const set = new Set();
    // CANONICAL_MASTER.json: one record per (curriculum, scope, majorUnit, midUnit); L3 = concept, L4 = problemType.
    if (fs.existsSync(path.join(root, RPM_MASTER)))
      for (const r of JSON.parse(fs.readFileSync(path.join(root, RPM_MASTER), "utf8")).records || [])
        for (const c of r.concepts || []) for (const pt of c.problemTypes || []) set.add([r.majorUnit, r.midUnit, c.concept, pt.problemType].join("\0"));
    rpmIndexCache = { root, set };
  }
  return rpmIndexCache.set.has([p.majorUnit, p.midUnit, p.l3, p.l4].join("\0")) || Boolean(receivedActive(tables, "rpmPath", [p.majorUnit, p.midUnit, p.l3, p.l4].join(" > ")));
}
// Judged values that differ from the main cell (the source JS or an approved value wins there) are kept as candidates, never dropped or overwritten.
function validateFieldCandidates(root, tables, candidates, questionUid) {
  if (candidates === null || typeof candidates !== "object" || Array.isArray(candidates)) fail("fieldCandidates must be an object: " + questionUid);
  for (const [field, list] of Object.entries(candidates)) {
    if (!CANDIDATE_FIELDS.has(field)) fail("fieldCandidates field not allowed: " + questionUid + "." + field);
    if (!Array.isArray(list) || !list.length) fail("fieldCandidates list required: " + questionUid + "." + field);
    for (const c of list) {
      if (!c || typeof c !== "object" || !CANDIDATE_SOURCES.has(c.source) || !Object.hasOwn(c, "value") || Object.keys(c).some(k => !["value", "source"].includes(k)))
        fail("fieldCandidates entry malformed: " + questionUid + "." + field);
      const v = c.value;
      if (field === "standardUnitKey" || field === "subUnitKey") {
        const m = masterOrReceivedKey(tables, v, field);
        if (!m || m.keyType !== field) fail("fieldCandidates value not in master or received registry: " + questionUid + "." + field + "=" + v);
      } else if (field === "rpmPath") {
        if (!v || typeof v !== "object" || Object.keys(v).length !== 4 || ["majorUnit", "midUnit", "l3", "l4"].some(k => typeof v[k] !== "string" || !v[k].trim())) fail("fieldCandidates rpmPath malformed: " + questionUid);
        if (!rpmPathKnown(root, tables, v)) fail("fieldCandidates rpmPath not in RPM master or received registry: " + questionUid);
      } else if (field === "integrationPattern") {
        if (!SIX_INTEGRATION.has(v)) fail("fieldCandidates integrationPattern outside the six values: " + questionUid);
      } else {
        const map = field === "crossConceptKeys" ? tables.cc : tables.cond, kind = field === "crossConceptKeys" ? "cross" : "cond";
        if (!Array.isArray(v) || new Set(v).size !== v.length) fail("fieldCandidates " + field + " must be a unique array: " + questionUid);
        for (const k of v) if (map.get(k)?.status !== "ACTIVE" && !receivedActive(tables, kind, k)) fail("fieldCandidates " + field + " key not canonical or received: " + questionUid + "." + k);
      }
    }
  }
}
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
const eq = (a, b) => isDeepStrictEqual(a, b);
const slug = value => value.toLowerCase().replaceAll("_", "-");
const isTypeHoldRecord = r => r.metadataApprovalType === "REVIEW2" && r.metaFoundationHoldReason === "TYPE_PATH_UNBOUND_UNIT_SUB_ONLY" && !r.problemTypeKey;
const approved = row => row.reviewStatus === "reviewed_pass" || String(row.metadataStatus || "").startsWith("approved_");
const fail = message => { throw new Error(message); };
const requireText = (value, name) => typeof value === "string" && value.trim() ? value : fail(`${name} required`);
const sourceFields = ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "level", "L3", "L4",
  "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"];
const valueFields = new Set([...sourceFields, "sourceFingerprint", "contentFingerprint", "curriculum", "curriculumKey", "courseKey", "L1", "L2", "L3", "L4",
  "rpmL1", "rpmL2", "rpmL3", "rpmL4", "rpmPrimaryPath", "rpmSemanticStatus", "semanticSourceScope", "semanticScopeRelation",
  "primaryMethod", "decisiveStep", "integrationReason", "conceptClusterKey", "secondaryConceptKeys",
  "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "curriculumApplicability", "defaultSelectable"]);
const META_PIPELINE_STUDENT_FIELDS = ["id", "questionType", "content", "choices", "answer", "solution", "image", "images", "figureSvg", "solutionImage", "solutionFigureSvg", "layoutTag", "wide"];
const studentPayloadSha256 = question => digest(stable(Object.fromEntries(META_PIPELINE_STUDENT_FIELDS.map(field =>
  [field, Object.hasOwn(question, field) ? question[field] : null]))));
const META_PIPELINE_PENDING_META_STATUSES = new Set([
  "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED",
  "RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING",
  "RPM_SEMANTIC_FINAL_DIRECT_BINDING_GAP"
]);

export function metaPipelineCrossConceptCountMatches(statistics, audit) {
  const records = Array.isArray(audit?.records) ? audit.records : [];
  const uniqueCount = new Set(records.flatMap(row => row?.classification?.crossConceptKeys || [])).size;
  const bindingCount = records.reduce((sum, row) => sum + (row?.classification?.crossConceptKeys || []).length, 0);
  return statistics?.atomicCrossConceptsBound === uniqueCount || statistics?.atomicCrossConceptsBound === bindingCount;
}
export function metaPipelineTemplateReuseCountMatches(statistics, audit) {
  const keys = (audit?.records || []).map(row => row?.classification?.templateKey);
  if (!keys.length || keys.some(key => typeof key !== "string" || !key.trim())) return false;
  const count = statistics?.canonicalTemplatesReused;
  // Gemini rich packages report either item bindings or distinct reused keys.
  // Every individual ACTIVE TPL/PT binding is still checked by the registrar.
  return count === keys.length || count === new Set(keys).size;
}
const hasPendingMetaReason = (question, field) =>
  question.projectionStatus === "BINDING_PENDING"
    ? typeof question[`${field}NullReason`] === "string" && question[`${field}NullReason`].trim().length > 0
    : META_PIPELINE_PENDING_META_STATUSES.has(question.metaStatus) &&
      typeof question.metaNullReason === "string" && question.metaNullReason.trim().length > 0;
const isPendingMetaPlaceholder = (question, field, approvedValue) => (
  ["problemTypeKey", "templateKey"].includes(field) && (question[field] === null || question[field] === "") &&
    hasPendingMetaReason(question, field) ||
  ["crossConceptKeys", "conditionKeys"].includes(field) && Array.isArray(question[field]) && question[field].length === 0 &&
    Array.isArray(approvedValue) && approvedValue.length > 0 && hasPendingMetaReason(question, field)
);
export function isMetaPipelineApprovedTypeRebindAllowed({ field, current, priorTypeStatus }) {
  return ["problemTypeKey", "templateKey"].includes(field) && approved(current) &&
    priorTypeStatus === "ACTIVE" && !["FINAL_QA", "REVIEW2"].includes(current.metadataApprovalType);
}
export function isAuditedPendingIntegrationRebindAllowed({ current, question, patch, final, auditedPattern }) {
  return current.metadataStatus === "registration_pending_semantic_review" && !approved(current) &&
    !["FINAL_QA", "REVIEW2"].includes(current.metadataApprovalType) &&
    typeof auditedPattern === "string" && auditedPattern.trim().length > 0 &&
    Object.hasOwn(patch.before || {}, "integrationPattern") &&
    eq(patch.before.integrationPattern ?? null, current.integrationPattern ?? null) &&
    Object.hasOwn(patch.sourceMetadataBefore || {}, "integrationPattern") &&
    eq(patch.sourceMetadataBefore.integrationPattern ?? null, question.integrationPattern ?? null) &&
    final.integrationPattern === auditedPattern;
}
export function isSopPendingSourceNamespaceCorrectionAllowed({ field, current, question, patch, final, audited, resolved }) {
  if (!["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"].includes(field) ||
      current.metadataStatus !== "registration_pending_semantic_review" ||
      ["FINAL_QA", "REVIEW2"].includes(current.metadataApprovalType) ||
      !audited?.assignmentCorrectionReason || !patch.sourceMetadataBefore ||
      !Object.hasOwn(patch.sourceMetadataBefore, field) ||
      !eq(patch.sourceMetadataBefore[field] ?? null, question[field] ?? null) ||
      !eq(current[field] ?? null, question[field] ?? null) ||
      final.standardUnitKey !== audited.correctedStandardUnitKey || final.subUnitKey !== audited.correctedSubUnitKey)
    return false;
  const courses = resolved?.pack?.meta?.standardCourses || [];
  return courses.includes(question.standardCourse) && courses.includes(final.standardCourse) &&
    final.standardUnit === resolved?.unit?.labelKo && final.subUnit === resolved?.sub?.labelKo;
}
const canRebindPendingAuditMetadata = ({ approvalType, metaPipelineAudit, beforeTables, current, question, patch, final, ordinal, field }) => {
  const pendingStatusKeys = {
    standardUnitKey: ["standardUnit"], subUnitKey: ["subUnit"], problemTypeKey: ["problemType"],
    templateKey: ["template"], crossConceptKeys: ["concept", "crossConcept"], conditionKeys: ["condition"]
  }[field] || [];
  // Older partial registrations can approve several fields while explicitly
  // leaving concept/template fields pending. Allow the audit to bind only the
  // exact fields still marked pending; fully approved fields remain immutable.
  // Some source rows retain an overall reviewed_pass while marking individual
  // PT/TPL/CC fields as manual_review_pending. The exact field marker plus the
  // explicit partial-hold status is the pending authority; the row-level
  // review label must not hide it. The MIDDLE_RECERT snapshot also uses the
  // narrower projection_unmaterialized marker for an empty PT/TPL slot.
  const fieldExplicitlyPending = current.metadataStatus === "approved_partial_with_explicit_holds" &&
    pendingStatusKeys.some(key => current.fieldStatus?.[key] === "manual_review_pending") ||
    ["problemTypeKey", "templateKey"].includes(field) && (current[field] === null || current[field] === "") &&
      current.reviewStatus === "reviewed_pass" && current.metadataStatus === "approved_semantic_review" &&
      ["projection_unmaterialized", "meta_semantic_hold"].includes(current.fieldStatus?.[pendingStatusKeys[0]]);
  const audited = metaPipelineAudit?.audit?.records?.find(row => Number(row.questionId) === ordinal);
  const auditedDifficulty = audited?.difficultyEvidence;
  const currentDifficultyIsCanonical = Number.isInteger(current.difficultyBucket) && current.difficultyBucket >= 1 && current.difficultyBucket <= 5;
  const sourceDifficultyIsCanonical = Number.isInteger(question.difficultyBucket) && question.difficultyBucket >= 1 && question.difficultyBucket <= 5;
  const exactFlatV3DifficultyRebind = field === "difficultyBucket" && metaPipelineAudit?.inputAuditVariant === "source_drive_flat_v3" &&
    !currentDifficultyIsCanonical && !sourceDifficultyIsCanonical && Number.isInteger(auditedDifficulty?.bucket) &&
    auditedDifficulty.bucket >= 1 && auditedDifficulty.bucket <= 5 && final.difficultyBucket === auditedDifficulty.bucket &&
    final.difficultyConfidence === auditedDifficulty.confidence && Object.hasOwn(patch.sourceMetadataBefore || {}, "difficultyBucket") &&
    eq(patch.sourceMetadataBefore.difficultyBucket ?? null, question.difficultyBucket ?? null);
  const legacySourceConcepts = current.metadataStatus === "approved_partial_with_explicit_holds" &&
    current.crossConceptKeys == null && Array.isArray(question.crossConceptKeys);
  const existingConcepts = legacySourceConcepts ? question.crossConceptKeys : current.crossConceptKeys;
  const nextConcepts = final.crossConceptKeys;
  const additiveApprovedConcepts = field === "crossConceptKeys" && approved(current) &&
    Array.isArray(existingConcepts) && Array.isArray(nextConcepts) && nextConcepts.length > existingConcepts.length &&
    existingConcepts.every((key, index) => nextConcepts[index] === key);
  const priorType = field === "problemTypeKey" ? beforeTables?.pt.get(current.problemTypeKey)
    : field === "templateKey" ? beforeTables?.tpl.get(current.templateKey) : null;
  const exactAuditedTypeRebind = isMetaPipelineApprovedTypeRebindAllowed({ field, current, priorTypeStatus: priorType?.status });
  const sourceCrossCorrection = metaPipelineAudit?.sourceCrossConceptCorrections?.find(row => row.questionUid === current.questionUid);
  if (field === "crossConceptKeys" && sourceCrossCorrection) {
    return approvalType === "META_PIPELINE_AUDIT" && current.metadataStatus === "registration_pending_semantic_review" &&
      !approved(current) && Object.hasOwn(patch.before || {}, field) && eq(patch.before[field] ?? null, current[field] ?? null) &&
      Object.hasOwn(patch.sourceMetadataBefore || {}, field) && eq(patch.sourceMetadataBefore[field], question[field]) &&
      eq(final[field], sourceCrossCorrection.crossConceptKeys);
  }
  if (field === "integrationPattern") {
    const evidence = metaPipelineAudit?.auditedIntegrations?.find(row => row.questionUid === current.questionUid);
    return approvalType === "META_PIPELINE_AUDIT" && Boolean(evidence) &&
      isAuditedPendingIntegrationRebindAllowed({ current, question, patch, final, auditedPattern: evidence.pattern });
  }
  if (approvalType !== "META_PIPELINE_AUDIT" || !metaPipelineAudit ||
      approved(current) && !fieldExplicitlyPending && !additiveApprovedConcepts && !exactAuditedTypeRebind && !exactFlatV3DifficultyRebind ||
      !["standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "difficultyBucket"].includes(field) ||
      !patch.sourceMetadataBefore || !Object.hasOwn(patch.sourceMetadataBefore, field) ||
      !eq(patch.sourceMetadataBefore[field] ?? null, question[field] ?? null)) return false;
  const auditedValue = ["standardUnitKey", "subUnitKey"].includes(field)
    ? audited?.[field]
    : field === "difficultyBucket" && exactFlatV3DifficultyRebind ? auditedDifficulty.bucket
    : audited?.classification?.[field];
  return auditedValue !== undefined && eq(final[field] ?? null, auditedValue ?? null);
};

// ---- SOP_v1.2 META_AUDIT_ATOMIC_PACKAGE (approval v4) ----------------------------------------------
// The native SOP_v1.2 audit names the audited PT/TPL/CC/unit of every row and its Courier manifest
// names the same rows, but neither carries readingEvidence. A separate SHA-bound corrective review
// supplies the exact current-source excerpts, the visual evidence status, the UID/ordinal parity and
// both the originally declared and the current source SHA. difficultyRank is provenance only: it is
// never converted into a 1-5 difficultyBucket, and the absent template statistic is never set to zero.
const SOP_V12_AUDIT_TYPE = "META_AUDIT_ATOMIC_PACKAGE";
const SOP_V12_MANIFEST_TYPE = "COURIER_INTAKE_MANIFEST";
const SOP_V12_CORRECTIVE_REVIEW_SCHEMA = "archive-meta-pipeline-sop-v12-corrective-review-v1";
const SOP_V12_REVIEWER_ROLES = new Set(["ROOT", "AUTHORIZED_REVIEWER"]);
export function sopV12PackIncludes(primaryPack, rowPack) {
  return typeof primaryPack === "string" && typeof rowPack === "string" && primaryPack.split("_AND_").includes(rowPack);
}
const SOP_V12_LEVELS = new Set(["하", "중", "상"]);
const textValue = value => typeof value === "string" && value.trim().length > 0;
const compactSourceText = value => String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
const isSvgAsset = value => /\.svg(?:$|[?#])/i.test(String(value ?? ""));
export function sourceVisualType(question) {
  const asset = value => typeof value === "string" ? value.trim() : "";
  const images = Array.isArray(question?.images) ? question.images.filter(textValue) : [];
  const html = [question?.content, question?.solution, ...(Array.isArray(question?.choices) ? question.choices : [])].filter(value => typeof value === "string").join("\n");
  const inlineImages = [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
  const svgAssets = [asset(question?.figureSvg), asset(question?.solutionFigureSvg), ...images.filter(isSvgAsset), ...inlineImages.filter(isSvgAsset), /<svg\b/i.test(html) ? "inline-svg" : ""].filter(Boolean);
  const rasterAssets = [asset(question?.image), asset(question?.solutionImage), ...images.filter(name => !isSvgAsset(name)), ...inlineImages.filter(name => !isSvgAsset(name))].filter(Boolean);
  if (rasterAssets.length && svgAssets.length) return "SVG_IMAGE";
  if (rasterAssets.length) return "IMAGE";
  if (svgAssets.length) return "SVG";
  return "NONE";
}
const SOP_V12_SOURCE_CORRECTION_FIELDS = new Set(["answer", "questionType", "choicesCount", "score"]);
export function isSopV12SourceFieldCorrectionAllowed({ field, ordinal, questionUid, originalValue, currentValue, reviewEntry, itemEntry }) {
  if (!SOP_V12_SOURCE_CORRECTION_FIELDS.has(field)) return false;
  if (!reviewEntry || typeof reviewEntry !== "object" || Array.isArray(reviewEntry) ||
      !itemEntry || typeof itemEntry !== "object" || Array.isArray(itemEntry) || !eq(reviewEntry, itemEntry)) return false;
  if (reviewEntry.field !== field || reviewEntry.questionUid !== questionUid ||
      Number(reviewEntry.auditQuestionNumber ?? reviewEntry.sourceOrdinal) !== ordinal ||
      reviewEntry.appliedToManifest !== false || !textValue(reviewEntry.reason)) return false;
  if (!Object.hasOwn(reviewEntry, "originalManifestValue") || !Object.hasOwn(reviewEntry, "currentSourceValue")) return false;
  if (!eq(reviewEntry.originalManifestValue, originalValue)) return false;
  if (!eq(reviewEntry.currentSourceValue, currentValue)) return false;
  if (eq(reviewEntry.originalManifestValue, reviewEntry.currentSourceValue)) return false;
  return true;
}
function validateSopV12SourceFieldCorrections({ ordinal, questionUid, question, manifestRow, reviewed, patch }) {
  const reviewEntries = reviewed.sourceFieldCorrections ?? [];
  const itemEntries = patch.sourceFieldCorrections ?? [];
  if (!Array.isArray(reviewEntries) || !Array.isArray(itemEntries))
    fail("SOP_v1.2 source field corrections must be arrays: " + ordinal);
  const collect = entries => {
    const map = new Map();
    for (const entry of entries) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry))
        fail("SOP_v1.2 source field correction entry must be an object: " + ordinal);
      if (typeof entry.field !== "string" || !SOP_V12_SOURCE_CORRECTION_FIELDS.has(entry.field))
        fail("SOP_v1.2 source field correction is not permitted for field " + String(entry.field) + ": " + ordinal);
      if (map.has(entry.field)) fail("SOP_v1.2 duplicate source field correction: " + ordinal + "." + entry.field);
      map.set(entry.field, entry);
    }
    return map;
  };
  const reviewMap = collect(reviewEntries);
  const itemMap = collect(itemEntries);
  if (!eq([...reviewMap.keys()].sort(), [...itemMap.keys()].sort()))
    fail("SOP_v1.2 corrective review/request source field correction fields differ: " + ordinal);
  const result = new Map();
  for (const [field, reviewEntry] of reviewMap) {
    const itemEntry = itemMap.get(field);
    if (!manifestRow) fail("SOP_v1.2 source field correction has no manifest row: " + ordinal + "." + field);
    const originalValue = manifestRow[field] ?? null;
    const currentValue = field === "choicesCount"
      ? (Array.isArray(question?.choices) ? question.choices.length : null)
      : question?.[field] ?? null;
    if (!isSopV12SourceFieldCorrectionAllowed({ field, ordinal, questionUid, originalValue, currentValue, reviewEntry, itemEntry }))
      fail("SOP_v1.2 invalid source field correction: " + ordinal + "." + field);
    result.set(field, reviewEntry);
  }
  return result;
}
function normalizeSopV12Audit({ root, proof, rawAudit, manifest, review, bank, source, sourceBytes, expectedQuestionCount, items, registryChanges }) {
  const reviewRef = proof.correctiveReviewRef;
  const currentSourceSha256 = digest(sourceBytes);
  const expectedTitle = path.basename(source, ".js");
  if (!review || typeof review !== "object" || Array.isArray(review) ||
      review.schemaVersion !== SOP_V12_CORRECTIVE_REVIEW_SCHEMA || review.sopVersion !== "SOP_v1.2" ||
      review.excerptBasis !== "CURRENT_PRODUCTION_SOURCE" ||
      !textValue(review.examTitle) || !textValue(review.reviewedAt) ||
      !review.reviewer || typeof review.reviewer !== "object" || Array.isArray(review.reviewer) ||
      !SOP_V12_REVIEWER_ROLES.has(review.reviewer.role) || !textValue(review.reviewer.id) ||
      !Array.isArray(review.rows) || review.questionCount !== expectedQuestionCount ||
      review.rows.length !== expectedQuestionCount ||
      !/^[a-f0-9]{64}$/.test(review.originalDeclaredSourceSha256 || "") ||
      !/^[a-f0-9]{64}$/.test(review.driveSourceSha256 || "") ||
      !/^[a-f0-9]{64}$/.test(review.productionSourceSha256 || "") ||
      typeof review.sourceHashDrift !== "boolean")
    fail("SOP_v1.2 corrective review schema/identity incomplete");
  if (review.sourceArchiveFile !== source) fail("SOP_v1.2 corrective review sourceArchiveFile mismatch");
  if (review.examSlug !== expectedTitle || rawAudit.examSlug !== expectedTitle)
    fail("SOP_v1.2 audit/review examSlug does not bind the production source file");
  if (review.examTitle !== rawAudit.examTitle || review.examTitle !== manifest.examTitle)
    fail("SOP_v1.2 audit/manifest/review examTitle mismatch");
  if (review.sourceFileDriveId !== proof.sourceFileDriveId)
    fail("SOP_v1.2 corrective review source drive identity mismatch");
  if (review.originalDeclaredSourceSha256 !== rawAudit.sourceFileSha256)
    fail("SOP_v1.2 corrective review original source SHA does not match the audit declaration");
  if (review.driveSourceSha256 !== currentSourceSha256)
    fail("SOP_v1.2 corrective review actual current Drive SHA does not match the current source bytes");
  if (review.productionSourceSha256 !== currentSourceSha256)
    fail("SOP_v1.2 corrective review production source SHA does not match the current source bytes");
  if (review.sourceHashDrift !== (review.originalDeclaredSourceSha256 !== currentSourceSha256))
    fail("SOP_v1.2 corrective review sourceHashDrift flag is inconsistent");
  if (rawAudit.manifestType !== SOP_V12_AUDIT_TYPE || rawAudit.sopVersion !== "SOP_v1.2" ||
      !textValue(rawAudit.examTitle) || !textValue(rawAudit.primaryPack) || !textValue(rawAudit.standardCourse) ||
      !Number.isInteger(rawAudit.totalQuestionsAudited) || rawAudit.totalQuestionsAudited !== expectedQuestionCount ||
      !Number.isInteger(rawAudit.auditPassedCount) || rawAudit.auditPassedCount !== expectedQuestionCount ||
      rawAudit.holdCount !== 0 || !Array.isArray(rawAudit.auditRecords) ||
      rawAudit.auditRecords.length !== expectedQuestionCount)
    fail("SOP_v1.2 audit denominator/identity mismatch");
  const auditRows = new Map();
  for (const row of rawAudit.auditRecords) {
    const ordinal = Number(row?.questionNumber);
    if (!Number.isInteger(ordinal) || ordinal < 1 || ordinal > expectedQuestionCount || auditRows.has(ordinal) ||
        Number(row?.sourceQuestionId) !== ordinal)
      fail("SOP_v1.2 audit questionNumber/sourceQuestionId is not a unique 1..N ordinal");
    auditRows.set(ordinal, row);
  }
  if (auditRows.size !== expectedQuestionCount) fail("SOP_v1.2 audit record denominator mismatch");
  const patches = unique(items || [], "sourceOrdinal", "SOP_v1.2 request sourceOrdinal");
  const reviewRows = unique(review.rows, "sourceOrdinal", "SOP_v1.2 corrective review sourceOrdinal");
  if (reviewRows.size !== expectedQuestionCount) fail("SOP_v1.2 corrective review row denominator mismatch");
  const manifestRows = new Map();
  for (const manifestRow of Array.isArray(manifest?.recordsToBind) ? manifest.recordsToBind : []) {
    const manifestOrdinal = Number(manifestRow?.questionNumber);
    if (Number.isInteger(manifestOrdinal)) manifestRows.set(manifestOrdinal, manifestRow);
  }
  const sourceFieldCorrections = new Map();
  const records = [];
  for (let ordinal = 1; ordinal <= expectedQuestionCount; ordinal++) {
    const row = auditRows.get(ordinal), reviewed = reviewRows.get(ordinal), patch = patches.get(ordinal);
    const question = bank[ordinal - 1];
    const sourceText = question?.content ?? question?.question ?? question?.stem ?? question?.text ?? "";
    const solutionText = question?.solution ?? question?.explanation ?? question?.answerExplanation ?? "";
    const unitKey = row?.curriculumAlignment?.unitKey;
    const subUnitKey = row?.curriculumAlignment?.subUnitKey;
    if (!row || row.auditStatus !== "PASS" || row.packIsolationPassed !== true ||
        row.zeroHoldCompliance !== true || row.zeroStubCertified !== true ||
        !sopV12PackIncludes(rawAudit.primaryPack, row.designatedPack) ||
        !/^PT_[A-Z0-9_]+$/.test(row.verifiedPrimaryTaxonomy || "") ||
        !/^TPL_[A-Z0-9_]+$/.test(row.verifiedTemplatePattern || "") ||
        !textValue(unitKey) || !textValue(subUnitKey) ||
        !SOP_V12_LEVELS.has(row.levelVerbatimPreserved) ||
        !Number.isInteger(row.difficultyRank) || row.difficultyRank < 1 || row.difficultyRank > 5 ||
        !textValue(row.difficultyReasonTrace) ||
        !Number.isInteger(row.solutionStepCountVerified) || row.solutionStepCountVerified < 1)
      fail(`SOP_v1.2 audit record incomplete: ${ordinal}`);
    if (!Array.isArray(row.verifiedCrossConcepts) || new Set(row.verifiedCrossConcepts).size !== row.verifiedCrossConcepts.length ||
        row.verifiedCrossConcepts.some(key => !/^CC_[A-Z0-9_]+$/.test(key || "")))
      fail(`SOP_v1.2 audit CrossConcept keys invalid: ${ordinal}`);
    if (!patch || patch.sourceOrdinal !== ordinal || !textValue(patch.questionUid))
      fail(`SOP_v1.2 request UID/ordinal mismatch: ${ordinal}`);
    if (!reviewed || !textValue(reviewed.questionUid) || reviewed.questionUid !== patch.questionUid ||
        Number(reviewed.auditQuestionNumber) !== ordinal ||
        reviewed.problemTypeKey !== (reviewed.correctedAssignment?.problemTypeKey ?? row.verifiedPrimaryTaxonomy) ||
        reviewed.templateKey !== (reviewed.correctedAssignment?.templateKey ?? row.verifiedTemplatePattern) ||
        !Array.isArray(reviewed.crossConceptKeys) || !eq(reviewed.crossConceptKeys, reviewed.correctedAssignment?.crossConceptKeys ?? row.verifiedCrossConcepts) ||
        ![unitKey, reviewed.correctedAssignment?.standardUnitKey].includes(reviewed.standardUnitKey) ||
        ![subUnitKey, reviewed.correctedAssignment?.subUnitKey].includes(reviewed.subUnitKey))
      fail(`SOP_v1.2 corrective review UID/ordinal/classification parity mismatch: ${ordinal}`);
    if (!reviewed.originalAssignment || typeof reviewed.originalAssignment !== "object" || Array.isArray(reviewed.originalAssignment) ||
        !reviewed.correctedAssignment || typeof reviewed.correctedAssignment !== "object" || Array.isArray(reviewed.correctedAssignment) ||
        reviewed.originalAssignment.standardUnitKey !== unitKey || reviewed.originalAssignment.subUnitKey !== subUnitKey ||
        !textValue(reviewed.correctedAssignment.standardUnitKey) || !textValue(reviewed.correctedAssignment.subUnitKey))
      fail(`SOP_v1.2 corrective review original/corrected assignment mismatch: ${ordinal}`);
    const correctedUnitKey = reviewed.correctedAssignment.standardUnitKey;
    const correctedSubUnitKey = reviewed.correctedAssignment.subUnitKey;
    const corrected = { problemTypeKey: row.verifiedPrimaryTaxonomy, templateKey: row.verifiedTemplatePattern,
      crossConceptKeys: row.verifiedCrossConcepts, standardCourse: rawAudit.standardCourse, ...reviewed.correctedAssignment };
    for (const [field, original] of Object.entries({problemTypeKey: row.verifiedPrimaryTaxonomy,
      templateKey: row.verifiedTemplatePattern, crossConceptKeys: row.verifiedCrossConcepts, standardCourse: rawAudit.standardCourse})) {
      if (Object.hasOwn(reviewed.originalAssignment, field) && !eq(reviewed.originalAssignment[field], original))
        fail(`SOP_v1.2 corrective review original/corrected assignment mismatch: ${ordinal}`);
      if (!eq(corrected[field], original) && !eq(reviewed.originalAssignment[field], original))
        fail(`SOP_v1.2 correction lacks exact original assignment: ${ordinal}`);
    }
    const assignmentChanged = correctedUnitKey !== unitKey || correctedSubUnitKey !== subUnitKey ||
      corrected.problemTypeKey !== row.verifiedPrimaryTaxonomy || corrected.templateKey !== row.verifiedTemplatePattern ||
      !eq(corrected.crossConceptKeys, row.verifiedCrossConcepts) || corrected.standardCourse !== rawAudit.standardCourse;
    if (assignmentChanged && !textValue(reviewed.assignmentCorrectionReason))
      fail(`SOP_v1.2 corrective review assignment correction requires a reason: ${ordinal}`);
    if (reviewed.sourceTextExcerpt === row.difficultyReasonTrace || reviewed.solutionDecisiveExcerpt === row.difficultyReasonTrace)
      fail(`SOP_v1.2 corrective review must not reuse difficultyReasonTrace as a source excerpt: ${ordinal}`);
    if (!textValue(reviewed.sourceTextExcerpt) ||
        !compactSourceText(sourceText).includes(compactSourceText(reviewed.sourceTextExcerpt)))
      fail(`SOP_v1.2 corrective review source excerpt is not in the production question: ${ordinal}`);
    if (!textValue(reviewed.solutionDecisiveExcerpt) ||
        !compactSourceText(solutionText).includes(compactSourceText(reviewed.solutionDecisiveExcerpt)))
      fail(`SOP_v1.2 corrective review solution excerpt is not in the production solution: ${ordinal}`);
    const actualVisualType = sourceVisualType(question);
    if (!reviewed.visualEvidence || typeof reviewed.visualEvidence.assetChecked !== "boolean" ||
        reviewed.visualEvidence.visualType !== actualVisualType)
      fail(`SOP_v1.2 corrective review visual evidence does not match the production source assets: ${ordinal}`);
    if (Object.keys(reviewed).some(key => /difficultyBucket|^bucket$/i.test(key)))
      fail(`SOP_v1.2 corrective review must not declare a difficulty bucket: ${ordinal}`);
    const corrections = validateSopV12SourceFieldCorrections({ ordinal, questionUid: reviewed.questionUid,
      question, manifestRow: manifestRows.get(ordinal), reviewed, patch });
    if (corrections.size) sourceFieldCorrections.set(ordinal, corrections);
    records.push({
      questionId: ordinal,
      standardCourse: corrected.standardCourse,
      standardUnitKey: correctedUnitKey,
      subUnitKey: correctedSubUnitKey,
      auditVerdict: "APPROVED",
      classification: {
        status: "APPROVED_CANONICAL",
        problemTypeKey: corrected.problemTypeKey,
        templateKey: corrected.templateKey,
        crossConceptKeys: [...corrected.crossConceptKeys],
        conditionKeys: null,
        targetPack: row.designatedPack,
        assignedPack: row.designatedPack,
      },
      readingEvidence: {
        sourceTextExcerpt: reviewed.sourceTextExcerpt,
        solutionDecisiveExcerpt: reviewed.solutionDecisiveExcerpt,
        visualAssetChecked: reviewed.visualEvidence.assetChecked,
        visualType: actualVisualType,
        evidenceOrigin: "SOP_V12_CORRECTIVE_REVIEW",
        reviewSha256: reviewRef.sha256,
      },
      auditedClassification: {
        auditedOrdinal: ordinal,
        questionUid: reviewed.questionUid,
        problemTypeKey: row.verifiedPrimaryTaxonomy,
        templateKey: row.verifiedTemplatePattern,
        crossConceptKeys: [...row.verifiedCrossConcepts],
        standardUnitKey: unitKey,
        subUnitKey,
        correctedStandardUnitKey: correctedUnitKey,
        correctedSubUnitKey: correctedSubUnitKey,
        assignmentCorrectionReason: textValue(reviewed.assignmentCorrectionReason) ? reviewed.assignmentCorrectionReason : null,
        level: row.levelVerbatimPreserved,
        difficultyRank: row.difficultyRank,
        difficultyReasonTrace: row.difficultyReasonTrace,
        solutionStepCountVerified: row.solutionStepCountVerified,
      },
      classificationReadingEvidenceStatus: "CORRECTIVE_REVIEW_EXCERPTS_VERIFIED",
      sourceSchemaVisualEvidence: reviewed.visualEvidence.assetChecked ? "EXPLICITLY_CHECKED" : "EXPLICITLY_NOT_CHECKED",
      sourceSchemaVisualType: actualVisualType,
    });
  }
  const beforeTables = lookup(registryPlan(root, [], () => {}));
  const conceptKeys = [...new Set(records.flatMap(record => record.classification.crossConceptKeys))].sort();
  const afterTables = conceptKeys.some(key => !beforeTables.cc.has(key)) && (registryChanges || []).length
    ? lookup(registryPlan(root, registryChanges, () => {})) : beforeTables;
  const boundAtomicCrossConcepts = conceptKeys.map(key => {
    const definition = (beforeTables.cc.has(key) ? beforeTables : afterTables).cc.get(key);
    if (!definition || definition.status !== "ACTIVE" || !definition.canonicalLabelKo || !definition.definition)
      fail(`SOP_v1.2 audit lacks an active canonical CrossConcept definition: ${key}`);
    return { conceptKey: key, labelKo: definition.canonicalLabelKo, definition: definition.definition };
  });
  const statistics = {
    totalQuestions: rawAudit.totalQuestionsAudited,
    approved: rawAudit.auditPassedCount,
    holdRemaining: rawAudit.holdCount,
    atomicCrossConceptsBound: records.reduce((sum, record) => sum + record.classification.crossConceptKeys.length, 0),
    canonicalTemplatesReusedStatus: "NOT_REPORTED_IN_SOURCE_SCHEMA",
    templateInflationStatus: "NOT_REPORTED_IN_SOURCE_SCHEMA",
    normalizationBasis: "SOP_v1.2 rows are individually PASS; template creation/reuse statistics are absent from the native schema and are not synthesized as zero",
  };
  return {
    audit: {
      ...rawAudit,
      sourceSha256: rawAudit.sourceFileSha256,
      inputAuditSchemaVersion: rawAudit.manifestType,
      inputAuditVariant: "sop_v12_corrective_review",
      statistics,
      records,
      boundAtomicCrossConcepts,
      sopV12: {
        originalDeclaredSourceSha256: rawAudit.sourceFileSha256,
        driveSourceSha256: review.driveSourceSha256,
        productionSourceSha256: currentSourceSha256,
        sourceHashDrift: review.sourceHashDrift,
        reviewSha256: reviewRef.sha256,
        reviewer: { id: review.reviewer.id, role: review.reviewer.role },
        reviewedAt: review.reviewedAt,
        excerptBasis: review.excerptBasis,
        conditionEvidence: "NOT_PRESENT_IN_SOURCE_SCHEMA",
        difficultyBucketSource: "NOT_AUDITED_1_5_BUCKET",
        templateInflation: "NOT_REPORTED_IN_SOURCE_SCHEMA",
      },
    },
    sourceFieldCorrections,
  };
}
function safePath(root, relative) {
  if (typeof relative !== "string" || !relative || relative.includes("\\") || relative.split("/").some(x => !x || x === "." || x === "..") || path.isAbsolute(relative)) fail(`unsafe path: ${relative}`);
  const full = path.resolve(root, relative);
  if (!full.startsWith(path.resolve(root) + path.sep)) fail(`path outside repository: ${relative}`);
  // Do not let a symlink in a checkout turn an allowlisted write into an external write.
  for (let p = full; p !== path.resolve(root); p = path.dirname(p)) {
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail(`symlink path: ${relative}`);
  }
  return full;
}

function unique(rows, key, name) {
  const map = new Map();
  for (const row of rows) {
    const k = typeof key === "function" ? key(row) : row[key];
    if (!k || map.has(k)) fail(`missing/duplicate ${name}: ${k}`);
    map.set(k, row);
  }
  return map;
}

function manifestKeyList(row, arrayField, legacyField = arrayField) {
  const value = row?.[arrayField] ?? row?.[legacyField];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.trim() ? value.trim().split(/[\s,]+/).filter(Boolean) : [];
  return null;
}

// A source-bound targeted replacement review may supply fields the Gemini
// audit did not examine. Keep this evidence distinct from Gemini approval.
export function validateTargetedRecoverySupplement({ recovery, source, sourceBlobSha1, bank, items, rawAudit, classificationPackage, manifest, ref }) {
  if (!recovery || recovery.schemaVersion !== "JS_ARCHIVE_M3_ITEM_RECOVERY_META_V2_PAYLOAD_v1" ||
      recovery.examFile !== path.basename(source) || recovery.finalArtifactSha !== sourceBlobSha1 ||
      recovery.sourceReview2Audit !== "FRESH_INDEPENDENT_REVIEW2" || recovery.itemRecoveryQuestionCount !== 1 ||
      !Array.isArray(recovery.itemRecoveryQuestionIds) || recovery.itemRecoveryQuestionIds.length !== 1)
    fail("targeted recovery supplement identity/source/review mismatch");
  const ordinal = Number(recovery.itemRecoveryQuestionIds[0]);
  const rows = (recovery.freshMetadataRows || []).filter(row => Number(row.sourceOrdinal) === ordinal);
  const resolutions = (recovery.itemHoldResolution || []).filter(row => Number(row.qid) === ordinal);
  const patch = (items || []).find(row => Number(row.sourceOrdinal) === ordinal);
  const audited = (rawAudit.records || []).find(row => Number(row.questionId) === ordinal);
  const candidate = (classificationPackage?.records || []).find(row => Number(row.questionId) === ordinal);
  const manifestRow = (manifest.recordsToBind || []).find(row => Number(row.questionId) === ordinal);
  const question = bank[ordinal - 1], row = rows[0], resolution = resolutions[0];
  if (rows.length !== 1 || resolutions.length !== 1 || !patch || !question || !audited || !candidate || !manifestRow ||
      row.questionUid !== patch.questionUid || row.metadataReviewStatus !== "TARGETED_RECOVERY_PASS" ||
      row.difficultyAudit !== "FRESH_INDEPENDENT_TARGETED_PASS" || row.replacementType !== "QUESTION_REPLACEMENT" ||
      resolution.recoveryType !== "QUESTION_REPLACEMENT" || Number(resolution.replacedQid) !== ordinal ||
      !Array.isArray(row.conditionKeys) || !row.conditionKeys.length || !row.integrationPattern ||
      Object.hasOwn(audited, "conditionKeys") || Object.hasOwn(candidate, "conditionKeys") ||
      Object.hasOwn(audited, "integrationPattern") || Object.hasOwn(candidate, "integrationPattern") ||
      !eq(manifestRow.conditionKeys || [], []) ||
      !eq(patch.after?.conditionKeys, row.conditionKeys) || patch.after?.integrationPattern !== row.integrationPattern ||
      !(patch.evidenceRefs || []).some(e => e.path === ref.path && e.sha256 === ref.sha256) ||
      ["content", "choices", "answer", "solution"].some(key =>
        JSON.stringify(question[key] ?? null) !== JSON.stringify(resolution.replacementQuestion?.[key] ?? null)))
    fail(`targeted recovery supplement item/evidence mismatch: ${ordinal}`);
  return { ordinal, questionUid: row.questionUid, conditionKeys: row.conditionKeys, integrationPattern: row.integrationPattern, ref };
}

export function isSourceConditionEvidenceDebtAllowed({ debt, flatV3, rawRow, candidateRow, question, patch }) {
  return Boolean(debt) && flatV3 && !Object.hasOwn(rawRow || {}, "conditionKeys") &&
    !Object.hasOwn(candidateRow || {}, "conditionKeys") && !Object.hasOwn(question, "conditionKeys") &&
    patch?.before?.conditionKeys == null && patch?.after?.conditionKeys === null &&
    Boolean(requireText(debt.reason, "conditionKeys EVIDENCE_DEBT reason"));
}

// Preserve an explicit source condition that a paired v2 audit omitted, only
// with a separate source-bound, per-UID human correction record.
export function validateSourceConditionCorrections({ corrections, source, sourceSha256, sourceBlobSha1, bank, items, rawAudit, manifest, ref }) {
  if (!corrections || corrections.schemaVersion !== "meta-pipeline-source-condition-corrections-v1" ||
      corrections.sourceArchiveFile !== source || corrections.sourceSha256 !== sourceSha256 ||
      corrections.sourceBlobSha1 !== sourceBlobSha1 || corrections.reviewer?.role !== "CODEX_META_PIPELINE_COURIER" ||
      !corrections.reviewer?.id || !Array.isArray(corrections.records) || !corrections.records.length)
    fail("source Condition correction identity/reviewer mismatch");
  const seen = new Set();
  return corrections.records.map(row => {
    const ordinal = Number(row.sourceOrdinal), question = bank[ordinal - 1];
    const patch = (items || []).find(item => Number(item.sourceOrdinal) === ordinal);
    const audited = (rawAudit.records || []).find(item => Number(item.questionId) === ordinal);
    const manifestRow = (manifest.recordsToBind || []).find(item => Number(item.questionId) === ordinal);
    const compact = value => String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
    const excerpts = Array.isArray(row.sourceTextExcerpts) ? row.sourceTextExcerpts :
      row.sourceConditionKeys?.length === 1 ? [{ text: row.sourceTextExcerpt, supports: row.sourceConditionKeys }] : [];
    const supported = key => excerpts.some(entry => {
      if (!entry?.text || !Array.isArray(entry.supports) || !entry.supports.includes(key) ||
          ![undefined, "content", "solution"].includes(entry.location)) return false;
      const values = entry.location === "content" ? [question?.content ?? question?.question] :
        entry.location === "solution" ? [question?.solution] : [question?.content ?? question?.question, question?.solution];
      return values.some(value => compact(value).includes(compact(entry.text)));
    });
    if (!Number.isInteger(ordinal) || seen.has(ordinal) || !question || !patch || !audited || !manifestRow ||
        row.questionUid !== patch.questionUid || !Array.isArray(row.sourceConditionKeys) || !row.sourceConditionKeys.length ||
        JSON.stringify(row.sourceConditionKeys) !== JSON.stringify(question.conditionKeys) || !eq(row.sourceConditionKeys, patch.before?.conditionKeys) ||
        !eq(row.auditedConditionKeys, audited.conditionKeys || []) || !eq(row.auditedConditionKeys, manifestRow.conditionKeys || []) ||
        !eq(patch.after?.conditionKeys, [...new Set([...row.auditedConditionKeys, ...row.sourceConditionKeys])]) ||
        !(patch.evidenceRefs || []).some(e => e.path === ref.path && e.sha256 === ref.sha256) ||
        !row.reason || row.sourceConditionKeys.some(key => !supported(key)))
      fail(`source Condition correction item/evidence mismatch: ${ordinal}`);
    seen.add(ordinal);
    return { ordinal, questionUid: row.questionUid, conditionKeys: patch.after.conditionKeys, ref };
  });
}

export function validateSourceCrossConceptCorrections({ corrections, source, sourceSha256, sourceBlobSha1, bank, items, rawAudit, manifest, ref, targetedAuditCorrections = [] }) {
  if (!corrections || corrections.schemaVersion !== "meta-pipeline-source-crossconcept-corrections-v1" ||
      corrections.sourceArchiveFile !== source || corrections.sourceSha256 !== sourceSha256 ||
      corrections.sourceBlobSha1 !== sourceBlobSha1 || corrections.reviewer?.role !== "CODEX_META_PIPELINE_COURIER" ||
      !corrections.reviewer?.id || !Array.isArray(corrections.records) || !corrections.records.length)
    fail("source CrossConcept correction identity/reviewer mismatch");
  const seen = new Set();
  return corrections.records.map(row => {
    const ordinal = Number(row.sourceOrdinal), question = bank[ordinal - 1];
    const patch = (items || []).find(item => Number(item.sourceOrdinal) === ordinal);
    const audited = (rawAudit.records || []).find(item => Number(item.questionId) === ordinal);
    const manifestRow = (manifest.recordsToBind || []).find(item => Number(item.questionId) === ordinal);
    const compact = value => String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
    const targeted = targetedAuditCorrections.find(entry => entry.ordinal === ordinal);
    const effectiveAudited = targeted ? targeted.correctedCrossConceptKeys : row.auditedCrossConceptKeys;
    const expected = [...new Set([...(effectiveAudited || []), ...(row.sourceCrossConceptKeys || [])])];
    const excerpts = Array.isArray(row.sourceTextExcerpts) ? row.sourceTextExcerpts :
      row.sourceCrossConceptKeys?.length === 1 ? [{ text: row.sourceTextExcerpt, supports: row.sourceCrossConceptKeys }] : [];
    const supported = key => excerpts.some(entry => {
      if (!entry?.text || !Array.isArray(entry.supports) || !entry.supports.includes(key) ||
          ![undefined, "content", "solution"].includes(entry.location)) return false;
      const values = entry.location === "content" ? [question?.content ?? question?.question] :
        entry.location === "solution" ? [question?.solution] : [question?.content ?? question?.question, question?.solution];
      return values.some(value => compact(value).includes(compact(entry.text)));
    });
    if (!Number.isInteger(ordinal) || seen.has(ordinal) || !question || !patch || !audited || !manifestRow ||
        row.questionUid !== patch.questionUid || !Array.isArray(row.sourceCrossConceptKeys) || !row.sourceCrossConceptKeys.length ||
        JSON.stringify(row.sourceCrossConceptKeys) !== JSON.stringify(question.crossConceptKeys) ||
        !eq(row.sourceCrossConceptKeys, patch.before?.crossConceptKeys) ||
        !eq(row.auditedCrossConceptKeys, audited.crossConceptKeys || []) || !eq(row.auditedCrossConceptKeys, manifestRow.crossConceptKeys || []) ||
        (targeted && !eq(row.correctedAuditedCrossConceptKeys, effectiveAudited)) ||
        !eq(patch.after?.crossConceptKeys, expected) || expected.length <= effectiveAudited.length ||
        !(patch.evidenceRefs || []).some(e => e.path === ref.path && e.sha256 === ref.sha256) ||
        !row.reason || row.sourceCrossConceptKeys.some(key => !supported(key)))
      fail(`source CrossConcept correction item/evidence mismatch: ${ordinal}`);
    seen.add(ordinal);
    return { ordinal, questionUid: row.questionUid, crossConceptKeys: expected, ref };
  });
}

export function validateTargetedAuditCorrections({ corrections, source, sourceSha256, sourceBlobSha1, bank, items, rawAudit, classificationPackage, manifest, ref, existingConceptKeys, replayAddedConceptKeys = new Set() }) {
  if (!corrections || corrections.schemaVersion !== "meta-pipeline-targeted-audit-corrections-v1" ||
      corrections.sourceArchiveFile !== source || corrections.sourceSha256 !== sourceSha256 || corrections.sourceBlobSha1 !== sourceBlobSha1 ||
      corrections.reviewer?.role !== "CODEX_META_PIPELINE_COURIER" || !corrections.reviewer?.id ||
      !Array.isArray(corrections.records) || !corrections.records.length)
    fail("targeted audit correction identity/reviewer mismatch");
  const seen = new Set(), records = rawAudit.records || [];
  return corrections.records.map(row => {
    const ordinal = Number(row.sourceOrdinal), question = bank[ordinal - 1];
    const patch = (items || []).find(item => Number(item.sourceOrdinal) === ordinal);
    const audited = records.find(item => Number(item.questionId) === ordinal);
    const candidate = (classificationPackage?.records || []).find(item => Number(item.questionId) === ordinal);
    const manifestRow = (manifest.recordsToBind || []).find(item => Number(item.questionId) === ordinal);
    const compact = value => String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
    const original = row.originalCrossConceptKeys, corrected = row.correctedCrossConceptKeys;
    if (!Number.isInteger(ordinal) || seen.has(ordinal) || !question || !patch || !audited || !candidate || !manifestRow ||
        row.questionUid !== patch.questionUid || !Array.isArray(original) || !Array.isArray(corrected) ||
        !eq(original, audited.crossConceptKeys) || !eq(original, candidate.crossConceptKeys) || !eq(original, manifestRow.crossConceptKeys) ||
        row.originalDifficultyReason !== audited.difficultyReason || row.originalDifficultyReason !== candidate.difficultyReason ||
        row.originalDifficultyReason !== manifestRow.difficultyReason || !row.correctedDifficultyReason || !row.reason ||
        !row.sourceTextExcerpt || !row.sourceSolutionExcerpt ||
        !compact(question.content ?? question.question).includes(compact(row.sourceTextExcerpt)) ||
        !compact(question.solution).includes(compact(row.sourceSolutionExcerpt)) ||
        !(patch.evidenceRefs || []).some(e => e.path === ref.path && e.sha256 === ref.sha256) ||
        new Set(corrected).size !== corrected.length || corrected.some(key => !/^CC_[A-Z0-9_]+$/.test(key || "")))
      fail(`targeted audit correction item/evidence mismatch: ${ordinal}`);
    const removed = original.filter(key => !corrected.includes(key)), added = corrected.filter(key => !original.includes(key));
    if (removed.length !== added.length || removed.length > 1 || removed.some(key => existingConceptKeys.has(key)) ||
        added.some(key => existingConceptKeys.has(key) && !replayAddedConceptKeys.has(key)) || removed.some(key => records.some(r => Number(r.questionId) !== ordinal && (r.crossConceptKeys || []).includes(key))) ||
        added.some(key => !records.some(r => Number(r.questionId) !== ordinal && (r.crossConceptKeys || []).includes(key))))
      fail(`targeted audit correction cannot merge existing meanings: ${ordinal}`);
    seen.add(ordinal);
    return { ordinal, questionUid: row.questionUid, originalCrossConceptKeys: original,
      correctedCrossConceptKeys: corrected, correctedDifficultyReason: row.correctedDifficultyReason, ref };
  });
}

function validateMetaPipelineAudit({ root, approval, source, sourceBytes, sourceBlobSha1, bank, expectedQuestionCount, items, registryChanges, requestId, requestSha256 }) {
  if (approval.type !== "META_PIPELINE_AUDIT") return null;
  const proof = approval.metaPipelineAudit;
  const proofV1 = proof?.schemaVersion === "meta-pipeline-audit-approval-v1";
  const proofV2 = proof?.schemaVersion === "meta-pipeline-audit-approval-v2";
  const proofV3 = proof?.schemaVersion === "meta-pipeline-audit-approval-v3";
  const proofV4 = proof?.schemaVersion === "meta-pipeline-audit-approval-v4";
  if (!proof || !proofV1 && !proofV2 && !proofV3 && !proofV4) fail("META_PIPELINE_AUDIT proof required");
  requireText(proof.sourceFileDriveId, "META_PIPELINE_AUDIT sourceFileDriveId");
  const readEvidence = (ref, name) => {
    if (!ref || typeof ref !== "object" || Array.isArray(ref) || !/^[a-f0-9]{64}$/.test(ref.sha256 || "")) fail(`${name} reference required`);
    const approvalRef = (approval.evidenceRefs || []).find(row => row.path === ref.path && row.sha256 === ref.sha256);
    if (!approvalRef) fail(`${name} must be included in approval.evidenceRefs`);
    const bytes = fs.readFileSync(safePath(root, ref.path));
    if (digest(bytes) !== ref.sha256) fail(`${name} SHA-256 mismatch`);
    return JSON.parse(bytes.toString("utf8"));
  };
  const rawAudit = readEvidence(proof.auditPackageRef, "META_PIPELINE_AUDIT package");
  const manifest = readEvidence(proof.manifestRef, "META_PIPELINE_AUDIT manifest");
  const sourceParity = readEvidence(proof.sourceParityRef, "META_PIPELINE_AUDIT source parity");
  if (proofV4 !== Boolean(proof.correctiveReviewRef)) fail("META_PIPELINE_AUDIT correctiveReviewRef is required only for approval v4");
  const classificationPackage = proofV2 || proofV3
    ? readEvidence(proof.classificationRef, "META_PIPELINE_AUDIT paired classification package")
    : null;
  if (proofV4 !== Boolean(proof.correctiveReviewRef)) fail("META_PIPELINE_AUDIT correctiveReviewRef is required only for approval v4");
  if (proofV4 && [proof.auditPackageRef?.path, proof.manifestRef?.path, proof.sourceParityRef?.path].includes(proof.correctiveReviewRef?.path))
    fail("META_PIPELINE_AUDIT SOP_v1.2 corrective review must be a distinct evidence file");
  const correctiveReview = proofV4
    ? readEvidence(proof.correctiveReviewRef, "META_PIPELINE_AUDIT SOP_v1.2 corrective review")
    : null;
  const parentBindingCorrection = proof.parentBindingCorrectionRef
    ? readEvidence(proof.parentBindingCorrectionRef, "META_PIPELINE_AUDIT canonical parent-binding correction")
    : null;
  const expectedTitle = path.basename(source, ".js");
  const v3DefinitionRows = Array.isArray(rawAudit.boundAtomicCrossConcepts) &&
    rawAudit.boundAtomicCrossConcepts.every(row => row && typeof row === "object" && typeof row.conceptKey === "string");
  const v3KeyRows = Array.isArray(rawAudit.boundAtomicCrossConcepts) &&
    rawAudit.boundAtomicCrossConcepts.every(row => typeof row === "string");
  const auditV3Rich = rawAudit.schemaVersion === "ALIVE_META_AUDIT_ATOMIC_v3" && v3DefinitionRows &&
    Boolean(rawAudit.records?.[0]?.classification) && Boolean(rawAudit.handOffToCourier?.registrationProtocol);
  const auditV3KeyOnly = rawAudit.schemaVersion === "ALIVE_META_AUDIT_ATOMIC_v3" && v3KeyRows &&
    !rawAudit.records?.[0]?.classification;
  const auditV3SourceDriveFlat = rawAudit.schemaVersion === "ALIVE_META_AUDIT_ATOMIC_v3" &&
    typeof rawAudit.sourceDriveId === "string" && !rawAudit.sourceFileDriveId &&
    !Object.hasOwn(rawAudit, "boundAtomicCrossConcepts") && Boolean(rawAudit.records?.[0]?.readingEvidence) &&
    Boolean(rawAudit.records?.[0]?.difficulty) && Number.isInteger(rawAudit.totalQuestions) &&
    Number.isInteger(rawAudit.totalApproved) && Number.isInteger(rawAudit.totalHold);
  const auditV2 = rawAudit.schemaVersion === "META_AUDIT_ATOMIC_PACKAGE_v2";
  if (proof.targetedAuditCorrectionRef && (!auditV2 || !proofV2))
    fail("targeted audit correction requires paired atomic v2 audit");
  const currentConcepts = proof.targetedAuditCorrectionRef ? lookup(registryPlan(root, [], () => {})).cc : new Map();
  const previousPath = proof.targetedAuditCorrectionRef ? safePath(root, `${RECEIPTS}/${requestId}.json`) : null;
  const previous = previousPath && fs.existsSync(previousPath) ? JSON.parse(fs.readFileSync(previousPath, "utf8")) : null;
  const validReplay = previous?.metadataRegistrationStatus === "REGISTERED" && previous.requestSha256 === requestSha256 &&
    previous.sourceRawSha256 === digest(sourceBytes);
  const replayAddedConceptKeys = new Set(validReplay ? (registryChanges || []).filter(change =>
    change.collection === "concepts" && change.before === null && change.after?.conceptKey &&
      eq(currentConcepts.get(change.after.conceptKey), change.after)).map(change => change.after.conceptKey) : []);
  const targetedAuditCorrections = proof.targetedAuditCorrectionRef
    ? validateTargetedAuditCorrections({ corrections: readEvidence(proof.targetedAuditCorrectionRef, "targeted audit correction"),
      source, sourceSha256: digest(sourceBytes), sourceBlobSha1, bank, items, rawAudit, classificationPackage, manifest,
      ref: proof.targetedAuditCorrectionRef, existingConceptKeys: new Set(currentConcepts.keys()), replayAddedConceptKeys })
    : [];
  if (proof.sourceCrossConceptCorrectionRef && (!auditV2 || !proofV2))
    fail("source CrossConcept correction requires paired atomic v2 audit");
  const sourceCrossConceptCorrections = proof.sourceCrossConceptCorrectionRef
    ? validateSourceCrossConceptCorrections({ corrections: readEvidence(proof.sourceCrossConceptCorrectionRef, "source CrossConcept correction"),
      source, sourceSha256: digest(sourceBytes), sourceBlobSha1, bank, items, rawAudit, manifest,
      ref: proof.sourceCrossConceptCorrectionRef, targetedAuditCorrections })
    : [];
  if (proof.sourceConditionCorrectionRef && (!auditV2 || !proofV2))
    fail("source Condition correction requires paired atomic v2 audit");
  const sourceConditionCorrections = proof.sourceConditionCorrectionRef
    ? validateSourceConditionCorrections({ corrections: readEvidence(proof.sourceConditionCorrectionRef, "source Condition correction"),
      source, sourceSha256: digest(sourceBytes), sourceBlobSha1, bank, items, rawAudit, manifest, ref: proof.sourceConditionCorrectionRef })
    : [];
  if (proof.targetedRecoveryRef && !auditV3SourceDriveFlat)
    fail("targeted recovery supplement requires sourceDrive flat v3 audit");
  const targetedRecovery = proof.targetedRecoveryRef
    ? validateTargetedRecoverySupplement({ recovery: readEvidence(proof.targetedRecoveryRef, "targeted recovery supplement"),
      source, sourceBlobSha1, bank, items, rawAudit, classificationPackage, manifest, ref: proof.targetedRecoveryRef })
    : null;
  const auditV4 = rawAudit.manifestType === SOP_V12_AUDIT_TYPE && rawAudit.sopVersion === "SOP_v1.2" &&
    Array.isArray(rawAudit.auditRecords) && Boolean(rawAudit.auditRecords.length);
  const pairedLegacyInput = auditV2 || auditV3KeyOnly;
  const auditV3 = auditV3Rich || auditV3KeyOnly || auditV3SourceDriveFlat;
  const expectedAuditSourceId = rawAudit.sourceFileDriveId || rawAudit.sourceDriveId;
  const declaredSourceSha256 = auditV4 ? rawAudit.sourceFileSha256 : rawAudit.sourceSha256;
  if (auditV3Rich !== proofV1 || (auditV2 || auditV3KeyOnly) !== proofV2 ||
      auditV3SourceDriveFlat !== proofV3 || auditV4 !== proofV4 || !auditV3 && !auditV2 && !auditV4 ||
      (auditV4 ? rawAudit.examSlug !== expectedTitle : rawAudit.examTitle !== expectedTitle) ||
      expectedAuditSourceId !== proof.sourceFileDriveId || !/^[a-f0-9]{64}$/.test(declaredSourceSha256 || ""))
    fail("META_PIPELINE_AUDIT source identity/schema mismatch");
  const rawAuditVerdict = rawAudit.auditVerdict || rawAudit.auditStatus;
  const expectedVerdict = auditV4 ? "AUDIT_COMPLETE_100_PERCENT_PASS" : "ALL_APPROVED_CANONICAL_STANDARDIZED";
  if (rawAuditVerdict !== expectedVerdict) fail("META_PIPELINE_AUDIT audit verdict mismatch");
  if (auditV3Rich && (rawAudit.handOffToCourier?.status !== "READY_FOR_COURIER_REGISTRATION" ||
      rawAudit.handOffToCourier?.author !== "META_PIPELINE_UNIFIED_AUTHOR" ||
      rawAudit.handOffToCourier?.registrationProtocol !== "DIRECT_ATOMIC_METADATA_BINDING"))
    fail("META_PIPELINE_AUDIT is not an approved Courier handoff");
  let audit = rawAudit;
  let sopSourceFieldCorrections = new Map();
  if (auditV4) {
    const normalizedSop = normalizeSopV12Audit({ root, proof, rawAudit, manifest, review: correctiveReview, bank, source, sourceBytes,
      expectedQuestionCount, items, registryChanges });
    audit = normalizedSop.audit;
    sopSourceFieldCorrections = normalizedSop.sourceFieldCorrections;
  } else if (pairedLegacyInput || auditV3SourceDriveFlat) {
    const classificationSchema = auditV3SourceDriveFlat ? "ALIVE_CANDIDATE_CLASSIFICATION_v3"
      : auditV3KeyOnly ? "CANDIDATE_CLASSIFICATION_PACKAGE_v2" : "CANDIDATE_CLASSIFICATION_v2";
    const classificationSourceId = classificationPackage?.sourceFileDriveId || classificationPackage?.sourceDriveId;
    // Atomic v2 Courier evidence used both v2 classification envelope names.
    // Retain all existing source, exam, SHA, denominator and row-level parity checks.
    const classificationSchemaMatches = classificationPackage?.schemaVersion === classificationSchema ||
      (auditV2 && classificationPackage?.schemaVersion === "CANDIDATE_CLASSIFICATION_PACKAGE_v2");
    if (!classificationSchemaMatches ||
        classificationPackage.examTitle !== expectedTitle ||
        (!auditV3SourceDriveFlat && ![expectedTitle, `${expectedTitle}.js`, path.basename(source)].includes(classificationPackage.sourceFileName)) ||
        classificationSourceId !== proof.sourceFileDriveId ||
        classificationPackage.sourceSha256 !== rawAudit.sourceSha256 ||
        classificationPackage.totalQuestions !== expectedQuestionCount ||
        !Array.isArray(classificationPackage.records) || classificationPackage.records.length !== expectedQuestionCount)
      fail(`META_PIPELINE_AUDIT ${auditV3SourceDriveFlat ? "sourceDrive v3" : "v2"} classification identity/schema mismatch`);
    if (auditV3SourceDriveFlat && (rawAudit.totalQuestions !== expectedQuestionCount ||
        rawAudit.totalApproved !== expectedQuestionCount || rawAudit.totalHold !== 0 ||
        rawAudit.auditStatus !== "ALL_APPROVED_CANONICAL_STANDARDIZED"))
      fail("META_PIPELINE_AUDIT sourceDrive v3 denominator/verdict mismatch");
    const rawKeys = auditV3SourceDriveFlat
      ? [...new Set((rawAudit.records || []).flatMap(row => row.crossConceptKeys || []))]
      : rawAudit.boundAtomicCrossConcepts;
    if (!Array.isArray(rawKeys)) fail(`META_PIPELINE_AUDIT ${auditV3SourceDriveFlat ? "sourceDrive v3" : "v2"} CrossConcept keys required`);
    const originalConceptKeys = rawKeys.map(row => typeof row === "string" ? row : row?.conceptKey);
    if (originalConceptKeys.some(key => !/^CC_[A-Z0-9_]+$/.test(key || "")) || new Set(originalConceptKeys).size !== originalConceptKeys.length)
      fail(`META_PIPELINE_AUDIT ${auditV3SourceDriveFlat ? "sourceDrive v3" : "v2"} CrossConcept key list invalid`);
    if (targetedAuditCorrections.length) {
      const rawRecords = (rawAudit.records || []).map(row => ({ classification: { crossConceptKeys: row.crossConceptKeys } }));
      const rawUsed = [...new Set(rawRecords.flatMap(row => row.classification.crossConceptKeys || []))].sort();
      if (!eq([...originalConceptKeys].sort(), rawUsed) || !metaPipelineCrossConceptCountMatches(rawAudit.statistics, { records: rawRecords }))
        fail("targeted audit correction original CrossConcept statistics mismatch");
    }
    const conceptKeys = targetedAuditCorrections.length
      ? [...new Set(rawAudit.records.flatMap(row => targetedAuditCorrections.find(entry => entry.ordinal === Number(row.questionId))?.correctedCrossConceptKeys || row.crossConceptKeys || []))]
      : originalConceptKeys;
    // The request-level evidence gate has already SHA-verified every registry
    // change before this adapter is called. Compile the current and proposed
    // states so legacy key-only audits can use an unchanged active definition
    // or an exact add-only definition carried by this request.
    const v2BeforeTables = lookup(registryPlan(root, [], () => {}));
    // On replay the additive changes are already present; applying their
    // before:null plan again would reject an otherwise valid registration.
    // The plan is still checked below for a new registration.
    const v2Tables = conceptKeys.every(key => v2BeforeTables.cc.get(key)?.status === "ACTIVE")
      ? v2BeforeTables
      : (registryChanges || []).length
        ? lookup(registryPlan(root, registryChanges, () => {}))
        : v2BeforeTables;
    const boundAtomicCrossConcepts = conceptKeys.map(key => {
      const existed = v2BeforeTables.cc.has(key);
      const definition = (existed ? v2BeforeTables : v2Tables).cc.get(key);
      if (!definition || definition.status !== "ACTIVE")
        fail(`META_PIPELINE_AUDIT ${auditV3SourceDriveFlat ? "sourceDrive v3" : "v2"} lacks an active CrossConcept definition for ${key}`);
      if (!definition.canonicalLabelKo || !definition.definition)
        fail(`META_PIPELINE_AUDIT ${auditV3SourceDriveFlat ? "sourceDrive v3" : "v2"} CrossConcept definition incomplete: ${key}`);
      return { conceptKey: key, labelKo: definition.canonicalLabelKo, definition: definition.definition };
    });
    const classRecords = unique(classificationPackage.records, "questionId", "META_PIPELINE_AUDIT v2 classification questionId");
    const normalizedRecords = rawAudit.records?.map(row => {
      const ordinal = Number(row.questionId);
      const candidate = classRecords.get(ordinal);
      const flatV3 = auditV3SourceDriveFlat;
      const crossConceptKeys = row.crossConceptKeys;
      const conditionKeys = flatV3 ? candidate?.conditionKeys ?? [] : row.conditionKeys ?? [];
      const rowDifficultyReason = flatV3 ? row.difficulty?.reason : row.difficultyReason;
      const rowApproved = flatV3 ? row.auditVerdict === "APPROVED_CANONICAL" : row.auditStatus === "APPROVED";
      if (!Number.isInteger(ordinal) || !candidate || !rowApproved ||
          flatV3 && (Number(row.questionNo) !== ordinal || Number(candidate.questionNo) !== ordinal ||
            typeof row.difficulty?.confidence !== "string" || !row.difficulty.confidence.trim()) ||
          !Array.isArray(crossConceptKeys) || !Array.isArray(conditionKeys) ||
          !row.problemTypeKey || !row.templateKey || !row.standardUnitKey || !row.subUnitKey ||
          !(row.targetPack || row.pack) || !rowDifficultyReason ||
          flatV3 && (!row.readingEvidence?.sourceTextExcerpt || !row.readingEvidence?.solutionDecisiveExcerpt ||
            candidate.readingEvidence !== undefined && (!candidate.readingEvidence?.sourceTextExcerpt || !candidate.readingEvidence?.solutionDecisiveExcerpt) ||
            !Number.isInteger(row.difficulty?.bucket) || row.difficulty.bucket < 1 || row.difficulty.bucket > 5))
        fail(`META_PIPELINE_AUDIT ${flatV3 ? "sourceDrive v3" : "v2"} record incomplete: ${row.questionId}`);
      if (new Set(crossConceptKeys).size !== crossConceptKeys.length ||
          crossConceptKeys.some(key => !/^CC_[A-Z0-9_]+$/.test(key || "")) ||
          new Set(conditionKeys).size !== conditionKeys.length ||
          conditionKeys.some(key => !/^COND_[A-Z0-9_]+$/.test(key || "")))
        fail(`META_PIPELINE_AUDIT ${flatV3 ? "sourceDrive v3" : "v2"} record tags invalid: ${ordinal}`);
      const comparedFields = flatV3
        ? ["pack", "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "problemTypeKey", "templateKey"]
        : ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "problemTypeKey", "templateKey", "targetPack", "difficultyBucket", "level", "difficultyReason"];
      for (const field of comparedFields) {
        const auditValue = flatV3 && field === "pack" ? row.pack
          : flatV3 && field === "difficultyReason" ? row.difficulty?.reason
            : flatV3 && field === "difficultyBucket" ? row.difficulty?.bucket
              : flatV3 && field === "targetPack" ? row.pack : row[field];
        const candidateValue = flatV3 && field === "difficultyReason" ? candidate.difficultyReason
          : flatV3 && field === "difficultyBucket" ? candidate.difficultyBucket
            : flatV3 && field === "targetPack" ? candidate.pack : candidate[field];
        if (!eq(auditValue ?? null, candidateValue ?? null)) fail(`META_PIPELINE_AUDIT ${flatV3 ? "sourceDrive v3" : "v2"} classification mismatch: ${ordinal}.${field}`);
      }
      if (flatV3 && (!eq(row.difficulty?.bucket, candidate.difficultyBucket) ||
          !eq(row.difficulty?.confidence, candidate.difficultyConfidence) ||
          !eq(row.difficulty?.reason, candidate.difficultyReason) ||
          candidate.readingEvidence !== undefined && (!eq(row.readingEvidence?.sourceTextExcerpt, candidate.readingEvidence.sourceTextExcerpt) ||
            !eq(row.readingEvidence?.solutionDecisiveExcerpt, candidate.readingEvidence.solutionDecisiveExcerpt))))
        fail(`META_PIPELINE_AUDIT sourceDrive v3 evidence mismatch: ${ordinal}`);
      if (!eq(crossConceptKeys, candidate.crossConceptKeys) || !eq(conditionKeys, candidate.conditionKeys || []))
        fail(`META_PIPELINE_AUDIT ${auditV3SourceDriveFlat ? "sourceDrive v3" : "v2"} classification tags mismatch: ${ordinal}`);
      const question = bank[ordinal - 1];
      const sourceText = question?.content ?? question?.question ?? question?.stem ?? question?.text ?? "";
      const compact = value => String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
      const sourceExcerpt = flatV3 ? row.readingEvidence.sourceTextExcerpt : candidate.contentSnippet;
      if (typeof sourceText !== "string" || !compact(sourceText).includes(compact(sourceExcerpt)))
        fail(`META_PIPELINE_AUDIT ${flatV3 ? "sourceDrive v3" : "v2"} source excerpt mismatch: ${ordinal}`);
      if (flatV3) {
        const solutionText = question?.solution ?? question?.explanation ?? question?.answerExplanation ?? "";
        if (typeof solutionText !== "string" || !compact(solutionText).includes(compact(row.readingEvidence.solutionDecisiveExcerpt)))
          fail(`META_PIPELINE_AUDIT sourceDrive v3 solution excerpt mismatch: ${ordinal}`);
      }
      const readingEvidence = auditV3KeyOnly ? row.readingEvidence : null;
      if (auditV3KeyOnly && (!readingEvidence?.sourceTextExcerpt || !readingEvidence?.solutionDecisiveExcerpt ||
          typeof readingEvidence.visualAssetChecked !== "boolean" ||
          !["IMAGE", "SVG", "SVG_IMAGE", "NONE"].includes(readingEvidence.visualType)))
        fail(`META_PIPELINE_AUDIT v3 key-only reading evidence incomplete: ${ordinal}`);
      const normalizedReadingEvidence = flatV3 ? row.readingEvidence : readingEvidence;
      const targetedCorrection = targetedAuditCorrections.find(entry => entry.ordinal === ordinal);
      return {
        questionId: ordinal,
        standardCourse: row.standardCourse,
        standardUnitKey: row.standardUnitKey,
        standardUnit: row.standardUnit,
        subUnitKey: row.subUnitKey,
        subUnit: row.subUnit,
        auditVerdict: "APPROVED",
        classification: {
          status: "APPROVED_CANONICAL",
          problemTypeKey: row.problemTypeKey,
          templateKey: row.templateKey,
          crossConceptKeys: targetedCorrection?.correctedCrossConceptKeys || crossConceptKeys,
          conditionKeys,
          targetPack: flatV3 ? row.pack : row.targetPack,
          assignedPack: flatV3 ? row.pack : row.assignedPack,
        },
        ...(flatV3 ? {
          readingEvidence: normalizedReadingEvidence,
          difficultyEvidence: { ...row.difficulty },
          classificationReadingEvidenceStatus: candidate.readingEvidence === undefined ? "NOT_PROVIDED_AUDIT_EXCERPTS_VERIFIED" : "TEXT_EXCERPTS_MATCHED_FINAL_AUDIT",
          sourceSchemaVisualEvidence: typeof row.readingEvidence.visualAssetChecked === "boolean"
            ? (row.readingEvidence.visualAssetChecked ? "EXPLICITLY_CHECKED" : "EXPLICITLY_NOT_CHECKED") : "NOT_PROVIDED",
        } : { legacyV2Evidence: {
          sourceTextExcerpt: readingEvidence?.sourceTextExcerpt || candidate.contentSnippet,
          solutionDecisiveExcerpt: readingEvidence?.solutionDecisiveExcerpt || null,
          difficultyReason: targetedCorrection?.correctedDifficultyReason || row.difficultyReason,
          auditRemarks: row.auditRemarks,
          hasImage: candidate.hasImage,
          visualAssetChecked: readingEvidence?.visualAssetChecked ?? false,
          visualType: readingEvidence?.visualType || (candidate.hasImage ? "IMAGE" : "NONE"),
        } }),
      };
    }) || [];
    const flatV3 = auditV3SourceDriveFlat;
    const statistics = flatV3 ? {
      totalQuestions: rawAudit.totalQuestions,
      approved: rawAudit.totalApproved,
      holdRemaining: rawAudit.totalHold,
      canonicalTemplatesReused: rawAudit.totalApproved,
      newTemplatesCreated: 0,
      atomicCrossConceptsBound: normalizedRecords.reduce((sum, row) => sum + row.classification.crossConceptKeys.length, 0),
      normalizationBasis: "all sourceDrive v3 rows explicitly APPROVED_CANONICAL; template-promotion counts remain separate from Git canonical registration",
    } : rawAudit.statistics;
    audit = { ...rawAudit, inputAuditSchemaVersion: rawAudit.schemaVersion,
      ...(flatV3 ? { inputAuditVariant: "source_drive_flat_v3", statistics } : {}),
      records: normalizedRecords, boundAtomicCrossConcepts };
  }
  const stats = audit.statistics;
  if (!stats || stats.totalQuestions !== expectedQuestionCount || stats.approved !== expectedQuestionCount ||
      stats.holdRemaining !== 0) fail("META_PIPELINE_AUDIT denominator/hold/template gate mismatch");
  if (auditV4) {
    if (stats.templateInflationStatus !== "NOT_REPORTED_IN_SOURCE_SCHEMA" ||
        stats.canonicalTemplatesReusedStatus !== "NOT_REPORTED_IN_SOURCE_SCHEMA" ||
        Object.hasOwn(stats, "newTemplatesCreated") || Object.hasOwn(stats, "canonicalTemplatesReused"))
      fail("META_PIPELINE_AUDIT SOP_v1.2 must not synthesize template inflation statistics");
  } else if (stats.newTemplatesCreated !== 0 || !metaPipelineTemplateReuseCountMatches(stats, audit))
    fail("META_PIPELINE_AUDIT denominator/hold/template gate mismatch");
  const manifestV2 = manifest.schemaVersion === "COURIER_INTAKE_MANIFEST_v2";
  const manifestV3 = ["ALIVE_COURIER_INTAKE_MANIFEST_v3", "COURIER_INTAKE_MANIFEST_v3"].includes(manifest.schemaVersion);
  const manifestV4 = manifest.manifestType === SOP_V12_MANIFEST_TYPE && manifest.sopVersion === "SOP_v1.2";
  if (auditV4) {
    if (!manifestV4 || manifest.examTitle !== rawAudit.examTitle || manifest.examSlug !== expectedTitle ||
        manifest.sourceDriveId !== proof.sourceFileDriveId ||
        manifest.sourceFileSha256 !== rawAudit.sourceFileSha256 ||
        manifest.standardCourse !== rawAudit.standardCourse || manifest.targetPack !== rawAudit.primaryPack ||
        manifest.totalQuestionsToRegister !== expectedQuestionCount ||
        manifest.readyForRegistrationCount !== expectedQuestionCount ||
        manifest.pipelineStatus !== "READY_FOR_COURIER_REGISTRATION" ||
        !Array.isArray(manifest.recordsToBind) || manifest.recordsToBind.length !== expectedQuestionCount)
      fail("META_PIPELINE_AUDIT SOP_v1.2 manifest identity/denominator mismatch");
  } else if ((!manifestV2 && !manifestV3) || manifest.examTitle !== expectedTitle ||
      manifest.sourceFileDriveId !== proof.sourceFileDriveId || manifest.sourceSha256 !== audit.sourceSha256 ||
      manifest.status !== "READY_FOR_COURIER_REGISTRATION") fail("META_PIPELINE_AUDIT manifest/source mismatch");
  if (manifestV2 && (manifest.courierAction !== "COMMIT_CANONICAL_BINDING" ||
      path.basename(manifest.bindingTarget || "") !== `${expectedTitle}.js`)) fail("META_PIPELINE_AUDIT v2 manifest routing mismatch");
  if (manifestV3 && (manifest.totalQuestions !== expectedQuestionCount || manifest.totalHoldCount !== 0))
    fail("META_PIPELINE_AUDIT v3 manifest denominator/hold gate mismatch");
  const auditSourceSha256 = auditV4
    ? (sourceParity.originalDeclaredSourceSha256 || "")
    : sourceParity.auditSourceSha256 || sourceParity.driveSourceSha256;
  const sourceHashDrift = sourceParity.driveSourceSha256 !== audit.sourceSha256;
    if (auditV2 && sourceHashDrift)
    fail("META_PIPELINE_AUDIT v2 cannot reconcile audit/Drive source hash drift without final audit excerpts");
  const exactSourceHashParity = !sourceHashDrift && sourceParity.parityBasis === "EXACT_SOURCE_SHA256" &&
    sourceParity.driveSourceSha256 === audit.sourceSha256 && sourceParity.productionSourceSha256 === audit.sourceSha256;
  const sopCurrentSourceParity = auditV4 &&
    sourceParity.originalDeclaredSourceSha256 === rawAudit.sourceFileSha256 &&
    sourceParity.driveSourceSha256 === digest(sourceBytes) &&
    sourceParity.productionSourceSha256 === digest(sourceBytes) &&
    sourceParity.parityBasis === "EXACT_SOURCE_SHA256" &&
    ["EXACT_STUDENT_VISIBLE_PARITY", "EXACT_STUDENT_VISIBLE_PARITY_WITH_AUDIT_HASH_DRIFT"].includes(sourceParity.status);
  if (auditV4) {
    if (sourceParity.originalDeclaredSourceSha256 !== rawAudit.sourceFileSha256)
      fail("META_PIPELINE_AUDIT SOP_v1.2 source parity does not preserve the originally declared source SHA");
    if (auditV4 && !sopCurrentSourceParity)
      fail("META_PIPELINE_AUDIT SOP_v1.2 source parity must bind the original declaration and exact current Drive/production bytes");
  }
  const sourceParityStatusValid = auditV4
    ? ["EXACT_STUDENT_VISIBLE_PARITY", "EXACT_STUDENT_VISIBLE_PARITY_WITH_AUDIT_HASH_DRIFT"].includes(sourceParity.status) && sourceParity.parityBasis === "EXACT_SOURCE_SHA256" &&
      sourceParity.driveSourceSha256 === digest(sourceBytes) && sourceParity.productionSourceSha256 === digest(sourceBytes) &&
      sourceParity.originalDeclaredSourceSha256 === audit.sourceSha256
    : sourceHashDrift
      ? sourceParity.status === "EXACT_STUDENT_VISIBLE_PARITY_WITH_AUDIT_HASH_DRIFT" &&
        sourceParity.auditSourceSha256 === audit.sourceSha256 &&
        sourceParity.sourceHashDriftReason === "AUDIT_SOURCE_HASH_DIFFERS_FROM_CURRENT_DRIVE_FILE"
      : sourceParity.status === "EXACT_STUDENT_VISIBLE_PARITY";
  if (sourceParity.schemaVersion !== "archive-meta-pipeline-source-parity-v1" || !sourceParityStatusValid ||
      !/^[a-f0-9]{64}$/.test(sourceParity.driveSourceSha256 || "") || auditSourceSha256 !== audit.sourceSha256 ||
      sourceParity.sourceFileDriveId !== proof.sourceFileDriveId ||
      sourceParity.productionSourceSha256 !== digest(sourceBytes) || sourceParity.productionSourceBlobSha1 !== sourceBlobSha1 ||
      sourceParity.sourceArchiveFile !== source || !eq(sourceParity.studentFields, META_PIPELINE_STUDENT_FIELDS) ||
      sourceParity.questionCount !== expectedQuestionCount || !Array.isArray(sourceParity.records) || sourceParity.records.length !== expectedQuestionCount)
    fail("META_PIPELINE_AUDIT source parity identity/denominator mismatch");
  const summary = manifest.payloadSummary;
  if (manifestV2 && (!summary || summary.totalQuestions !== expectedQuestionCount || summary.approved !== expectedQuestionCount ||
      summary.holdCount !== 0 || summary.templateInflationCount !== 0)) fail("META_PIPELINE_AUDIT manifest denominator/hold/template gate mismatch");
  // v3 manifests omit the redundant payloadSummary. The rich audit above remains
  // authoritative for zero template inflation; v3 must still prove N/N and zero holds.
  if (manifestV3 && (manifest.totalQuestions !== expectedQuestionCount || manifest.totalHoldCount !== 0 ||
      stats.newTemplatesCreated !== 0 || !metaPipelineTemplateReuseCountMatches(stats, audit)))
    fail("META_PIPELINE_AUDIT v3 manifest denominator/hold/template gate mismatch");
  if (!Array.isArray(audit.records) || audit.records.length !== expectedQuestionCount ||
      !Array.isArray(manifest.recordsToBind) || manifest.recordsToBind.length !== expectedQuestionCount) fail("META_PIPELINE_AUDIT record denominator mismatch");
  const records = unique(audit.records, "questionId", "audit questionId");
  const manifestRecords = unique(manifest.recordsToBind, auditV4 ? "questionNumber" : "questionId", "manifest questionId");
  const parityRecords = unique(sourceParity.records, "sourceOrdinal", "source parity ordinal");
  const patches = unique(items || [], "sourceOrdinal", "META_PIPELINE_AUDIT sourceOrdinal");
  const conditionDebtUids = [];
  const auditedIntegrations = [];
  if (proof.auditedIntegrationPatterns && (!auditV2 || proof.auditedIntegrationPatterns !== true))
    fail("audited integration patterns require atomic v2 audit");
  if (patches.size !== expectedQuestionCount || bank.length !== expectedQuestionCount) fail("META_PIPELINE_AUDIT request denominator mismatch");
  for (let ordinal = 1; ordinal <= expectedQuestionCount; ordinal++) {
    const record = records.get(ordinal), manifestRow = manifestRecords.get(ordinal), parityRow = parityRecords.get(ordinal), patch = patches.get(ordinal);
    const classification = record?.classification, reading = record?.readingEvidence;
    if (!record || record.auditVerdict !== "APPROVED" || classification?.status !== "APPROVED_CANONICAL" ||
        !Array.isArray(classification.crossConceptKeys) || !classification.problemTypeKey || !classification.templateKey ||
        !record.standardUnitKey || !record.subUnitKey) fail(`META_PIPELINE_AUDIT record incomplete: ${ordinal}`);
    if (auditV3Rich && (!reading || !reading.sourceTextExcerpt || !reading.solutionDecisiveExcerpt ||
        typeof reading.visualAssetChecked !== "boolean" || !["IMAGE", "SVG", "SVG_IMAGE", "NONE"].includes(reading.visualType)))
      fail(`META_PIPELINE_AUDIT record incomplete: ${ordinal}`);
    if (pairedLegacyInput && (!record.legacyV2Evidence?.sourceTextExcerpt || !record.legacyV2Evidence?.difficultyReason ||
        !record.legacyV2Evidence?.auditRemarks || typeof record.legacyV2Evidence.hasImage !== "boolean"))
      fail(`META_PIPELINE_AUDIT paired legacy evidence incomplete: ${ordinal}`);
    if (auditV4) {
      const bankRow = bank[ordinal - 1];
      const manifestCrossConcepts = manifestKeyList(manifestRow, "crossConcepts", "crossConceptKeys");
      if (!manifestRow) fail("META_PIPELINE_AUDIT SOP_v1.2 manifest binding mismatch: " + ordinal);
      const sourceChoicesCount = Array.isArray(bankRow.choices) ? bankRow.choices.length : null;
      const correctionAllows = (field, manifestValue, sourceValue) => {
        const correction = sopSourceFieldCorrections.get(ordinal)?.get(field);
        return Boolean(correction) && isSopV12SourceFieldCorrectionAllowed({ field, ordinal, questionUid: patch.questionUid,
          originalValue: manifestValue, currentValue: sourceValue, reviewEntry: correction, itemEntry: correction });
      };
      const questionTypeMatches = eq(manifestRow.questionType ?? null, bankRow.questionType ?? null) ||
        correctionAllows("questionType", manifestRow.questionType ?? null, bankRow.questionType ?? null);
      const answerMatches = eq(manifestRow.answer ?? null, bankRow.answer ?? null) ||
        correctionAllows("answer", manifestRow.answer ?? null, bankRow.answer ?? null);
      const choicesCountMatches = manifestRow.choicesCount === sourceChoicesCount ||
        correctionAllows("choicesCount", manifestRow.choicesCount ?? null, sourceChoicesCount);
      const scoreMatches = eq(Number(manifestRow.score), Number(bankRow.score)) ||
        correctionAllows("score", manifestRow.score ?? null, bankRow.score ?? null);
      if (Number(manifestRow.questionNumber) !== ordinal || Number(manifestRow.sourceQuestionId) !== ordinal ||
          manifestRow.primaryTaxonomy !== record.auditedClassification.problemTypeKey ||
          manifestRow.templatePattern !== record.auditedClassification.templateKey ||
          !manifestCrossConcepts || !eq(manifestCrossConcepts, record.auditedClassification.crossConceptKeys) ||
          manifestRow.unitKey !== record.auditedClassification.standardUnitKey || manifestRow.subUnitKey !== record.auditedClassification.subUnitKey ||
          manifestRow.pack !== classification.targetPack ||
          Number(manifestRow.difficulty) !== record.auditedClassification.difficultyRank ||
          manifestRow.level !== record.auditedClassification.level ||
          !questionTypeMatches || !answerMatches || !choicesCountMatches || !scoreMatches)
        fail(`META_PIPELINE_AUDIT SOP_v1.2 manifest binding mismatch: ${ordinal}`);
    } else {
      const manifestCrossConceptKeys = manifestKeyList(manifestRow, "crossConceptKeys", "crossConcepts");
      const manifestConditionKeys = manifestKeyList(manifestRow, "conditionKeys");
      const manifestConditionsMatch = manifestConditionKeys === null
        ? manifestV2 || manifestRow?.conditionKeys === undefined
        : eq(manifestConditionKeys, classification.conditionKeys || []);
      const manifestUnitsMatch = !(pairedLegacyInput || auditV3SourceDriveFlat) || manifestRow?.standardUnitKey === record.standardUnitKey &&
        manifestRow?.subUnitKey === record.subUnitKey &&
        (manifestRow.targetPack || manifestRow.pack) === classification.targetPack;
      const originalAuditedCross = targetedAuditCorrections.find(entry => entry.ordinal === ordinal)?.originalCrossConceptKeys || classification.crossConceptKeys;
      if (!manifestRow || manifestRow.problemTypeKey !== classification.problemTypeKey || manifestRow.templateKey !== classification.templateKey ||
          !manifestCrossConceptKeys || !eq(manifestCrossConceptKeys, originalAuditedCross) ||
          !manifestConditionsMatch || !manifestUnitsMatch)
        fail(`META_PIPELINE_AUDIT manifest binding mismatch: ${ordinal}`);
    }
    if (record.difficultyEvidence && (patch.after?.difficultyBucket !== record.difficultyEvidence.bucket ||
        patch.after?.difficultyConfidence !== record.difficultyEvidence.confidence))
      fail(`META_PIPELINE_AUDIT sourceDrive v3 difficulty binding mismatch: ${ordinal}`);
    const actualPayloadHash = studentPayloadSha256(bank[ordinal - 1]);
    if (!parityRow || parityRow.questionId !== ordinal || parityRow.questionUid !== patch?.questionUid ||
        !(exactSourceHashParity || sopCurrentSourceParity || parityRow.driveSourceTextExcerptMatched === true && parityRow.driveSolutionExcerptMatched === true) ||
        parityRow.driveStudentPayloadSha256 !== actualPayloadHash || parityRow.productionStudentPayloadSha256 !== actualPayloadHash ||
        parityRow.studentPayloadEqual !== true) fail(`META_PIPELINE_AUDIT student source parity mismatch: ${ordinal}`);
    const after = patch?.after || {};
    const basicParentRef = patch?.basicScopeParentRef;
    const targetParentRef = patch?.targetParentRef;
    const parentRef = basicParentRef || targetParentRef;
    const itemEvidence = patch?.evidenceRefs || [];
    const approvalEvidence = approval.evidenceRefs || [];
    const parentEvidenceLinked = basicParentRef
      ? itemEvidence.some(ref => ref.path === basicParentRef.path && ref.sha256 === basicParentRef.sha256)
      : targetParentRef && targetParentRef.path === "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"
        ? itemEvidence.some(ref => ref.path === targetParentRef.path && /^[a-f0-9]{64}$/.test(ref.sha256 || "") &&
            approvalEvidence.some(approvedRef => approvedRef.path === ref.path && approvedRef.sha256 === ref.sha256) &&
            fs.existsSync(safePath(root, ref.path)) && digest(fs.readFileSync(safePath(root, ref.path))) === ref.sha256)
        : false;
    if (auditV4 && (after.level !== record.auditedClassification.level ||
        after.standardUnitKey !== record.auditedClassification.correctedStandardUnitKey ||
        after.subUnitKey !== record.auditedClassification.correctedSubUnitKey ||
        after.standardCourse !== record.standardCourse && after.courseKey !== record.standardCourse ||
        Object.hasOwn(patch?.after || {}, "difficultyBucket") && patch.after.difficultyBucket !== null ||
        Array.isArray(patch?.after?.conditionKeys) && !eq(patch.after.conditionKeys, patch?.before?.conditionKeys ?? null)))
      fail(`META_PIPELINE_AUDIT SOP_v1.2 audited binding limits violated: ${ordinal}`);
    const rawRow = (rawAudit.records || []).find(row => Number(row.questionId) === ordinal);
    const candidateRow = (classificationPackage?.records || []).find(row => Number(row.questionId) === ordinal);
    if (proof.auditedIntegrationPatterns) {
      const pattern = requireText(rawRow?.integrationPattern, `audited integration pattern ${ordinal}`);
      if (manifestRow?.integrationPattern !== pattern || patch?.after?.integrationPattern !== pattern)
        fail(`audited integration pattern/manifest mismatch: ${ordinal}`);
      auditedIntegrations.push({ questionUid: patch.questionUid, pattern });
    }
    const conditionDebt = (proof.unreviewedFields || []).find(row => row.field === "conditionKeys" &&
      row.status === "EVIDENCE_DEBT" && Array.isArray(row.questionUids) && row.questionUids.includes(patch?.questionUid));
    const explicitConditionDebt = isSourceConditionEvidenceDebtAllowed({ debt: conditionDebt,
      flatV3: auditV3SourceDriveFlat, rawRow, candidateRow, question: bank[ordinal - 1], patch });
    if (conditionDebt && !explicitConditionDebt) fail(`conditionKeys EVIDENCE_DEBT mismatch: ${ordinal}`);
    if (explicitConditionDebt) conditionDebtUids.push(patch.questionUid);
    if (!patch || patch.questionId !== undefined && patch.questionId !== ordinal ||
        after.standardUnitKey !== record.standardUnitKey || after.subUnitKey !== record.subUnitKey ||
        after.problemTypeKey !== classification.problemTypeKey || after.templateKey !== classification.templateKey ||
        !eq(after.crossConceptKeys, sourceCrossConceptCorrections.find(row => row.ordinal === ordinal)?.crossConceptKeys || classification.crossConceptKeys) || (!auditV4 && !eq(after.conditionKeys,
          targetedRecovery?.ordinal === ordinal ? targetedRecovery.conditionKeys : explicitConditionDebt ? null :
            sourceConditionCorrections.find(row => row.ordinal === ordinal)?.conditionKeys || classification.conditionKeys || [])) ||
        Boolean(basicParentRef) === Boolean(targetParentRef) || !parentRef ||
        basicParentRef && !/^[a-f0-9]{64}$/.test(basicParentRef.sha256 || "") || !parentEvidenceLinked)
      fail(`META_PIPELINE_AUDIT registration binding mismatch: ${ordinal}`);
  }
  if (!Array.isArray(audit.boundAtomicCrossConcepts)) fail("META_PIPELINE_AUDIT CrossConcept definitions required");
  const usedConcepts = [...new Set(audit.records.flatMap(row => row.classification.crossConceptKeys))].sort();
  const definedConcepts = unique(audit.boundAtomicCrossConcepts, "conceptKey", "audit CrossConcept definition");
  if (!eq([...definedConcepts.keys()].sort(), usedConcepts) || !metaPipelineCrossConceptCountMatches(stats, audit))
    fail("META_PIPELINE_AUDIT CrossConcept definition/binding mismatch");
  for (const definition of definedConcepts.values()) {
    if (!/^CC_[A-Z0-9_]+$/.test(definition.conceptKey) || !definition.labelKo || !definition.definition)
      fail(`META_PIPELINE_AUDIT CrossConcept definition incomplete: ${definition.conceptKey}`);
    if (definition.labelKo.trim() === definition.conceptKey || definition.definition.trim() === definition.conceptKey)
      fail(`META_PIPELINE_AUDIT CrossConcept definition placeholder: ${definition.conceptKey}`);
  }
  return { audit, manifest, sourceParity, parentBindingCorrection, targetedRecovery, targetedAuditCorrections, sourceConditionCorrections, sourceCrossConceptCorrections, conditionDebtUids, auditedIntegrations, parentBindingCorrectionRef: proof.parentBindingCorrectionRef || null,
    sourceFileDriveId: proof.sourceFileDriveId, inputAuditSchemaVersion: audit.inputAuditSchemaVersion || rawAudit.schemaVersion,
    inputAuditVariant: auditV4 ? "sop_v12_corrective_review" : auditV3Rich ? "rich_v3" : auditV3KeyOnly ? "key_only_v3"
      : auditV3SourceDriveFlat ? "source_drive_flat_v3" : "atomic_package_v2",
    classificationRef: proof.classificationRef || null,
    sourceFieldCorrections: [...sopSourceFieldCorrections.entries()].sort(([a], [b]) => a - b).flatMap(([ordinal, corrections]) =>
      [...corrections.values()].map(entry => ({ ...entry, sourceOrdinal: ordinal }))) };
}

function validateMetaPipelineRegistry({ audit, parentBindingCorrection, parentBindingCorrectionRef, beforeTables, afterTables, registryChanges, existingConceptReviews, items, root }) {
  if (!audit) return;
  const packCourseExtensions = registryChanges.map(change => {
    if (change.collection || !/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/pack\.json$/.test(change.path || "") ||
        !change.before || !change.after || !Array.isArray(change.before.standardCourses) || !Array.isArray(change.after.standardCourses)) return null;
    const beforeCourses = new Set(change.before.standardCourses), afterCourses = new Set(change.after.standardCourses);
    const addedCourses = [...afterCourses].filter(course => !beforeCourses.has(course));
    const beforeRest = { ...change.before }, afterRest = { ...change.after };
    delete beforeRest.standardCourses; delete afterRest.standardCourses;
    if (!addedCourses.length || beforeCourses.size !== change.before.standardCourses.length ||
        afterCourses.size !== change.after.standardCourses.length || [...beforeCourses].some(course => !afterCourses.has(course)) ||
        !eq(beforeRest, afterRest)) return null;
    return { change, packId: change.after.packId, addedCourses };
  }).filter(Boolean);
  const allowedPackScopeChanges = new Set(packCourseExtensions.map(extension => extension.change));
  const parentBindingChanges = new Set();
  if (parentBindingCorrection || parentBindingCorrectionRef) {
    if (!parentBindingCorrection || parentBindingCorrection.schemaVersion !== "archive-meta-pipeline-parent-binding-correction-v1" ||
        parentBindingCorrection.requestId !== parentBindingCorrectionRef?.requestId ||
        !Array.isArray(parentBindingCorrection.affectedQuestions) || !Array.isArray(parentBindingCorrection.bindingChanges) ||
        !parentBindingCorrection.affectedQuestions.length || !parentBindingCorrection.bindingChanges.length)
      fail("META_PIPELINE_AUDIT parent-binding correction evidence/schema mismatch");
    const parent = parentBindingCorrection.canonicalParent || {};
    if (parent.path !== RPM_MASTER || !/^[a-f0-9]{64}$/.test(parent.sha256 || "") ||
        !["curriculum", "scope", "majorUnit", "midUnit", "conceptLabel"].every(key => requireText(parent[key], `parent-binding canonical parent ${key}`)))
      fail("META_PIPELINE_AUDIT parent-binding canonical authority incomplete");
    const masterBytes = fs.readFileSync(safePath(root, RPM_MASTER));
    if (digest(masterBytes) !== parent.sha256) fail("META_PIPELINE_AUDIT parent-binding canonical master SHA mismatch");
    const canonicalMaster = JSON.parse(masterBytes.toString("utf8"));
    const parentRows = (canonicalMaster.records || []).filter(row => row.curriculum === parent.curriculum && row.scope === parent.scope &&
      row.majorUnit === parent.majorUnit && row.midUnit === parent.midUnit);
    if (parentRows.length !== 1 || !(parentRows[0].concepts || []).some(concept => concept.concept === parent.conceptLabel))
      fail("META_PIPELINE_AUDIT parent-binding canonical parent/concept mismatch");
    const unitMaster = JSON.parse(fs.readFileSync(safePath(root, MASTER), "utf8"));
    const affectedByUid = new Map(parentBindingCorrection.affectedQuestions.map(row => [row.questionUid, row]));
    if (affectedByUid.size !== parentBindingCorrection.affectedQuestions.length) fail("META_PIPELINE_AUDIT duplicate corrected parent UID");
    const declaredUids = [];
    for (const correction of parentBindingCorrection.bindingChanges) {
      if (correction.path !== `${CANON}/packs/${slug(correction.before?.ownerPack || "")}/bindings.json` ||
          correction.collection !== "bindings" || !correction.match || !correction.before || !correction.after ||
          !Array.isArray(correction.questionUids) || !correction.questionUids.length) fail("META_PIPELINE_AUDIT parent-binding change identity incomplete");
      const matches = registryChanges.filter(change => change.path === correction.path && change.collection === correction.collection && eq(change.match, correction.match));
      if (matches.length !== 1 || !eq(matches[0].before, correction.before) || !eq(matches[0].after, correction.after))
        fail("META_PIPELINE_AUDIT parent-binding correction/request mismatch");
      const change = matches[0];
      parentBindingChanges.add(change);
      if (!change.evidenceRefs?.some(ref => ref.path === parentBindingCorrectionRef.path && ref.sha256 === parentBindingCorrectionRef.sha256) ||
          !change.evidenceRefs?.some(ref => ref.path === parent.path && ref.sha256 === parent.sha256))
        fail("META_PIPELINE_AUDIT parent-binding change evidence is not SHA-bound");
      const changedFields = [...new Set([...Object.keys(correction.before), ...Object.keys(correction.after)])]
        .filter(key => !eq(correction.before[key], correction.after[key]));
      if (!changedFields.length || changedFields.some(key => key !== "L2") || correction.before.L1 !== parent.majorUnit ||
          correction.after.L1 !== parent.majorUnit || correction.after.L2 !== parent.midUnit ||
          correction.before.status !== "ACTIVE" || correction.after.status !== "ACTIVE" ||
          correction.before.ownerPack !== correction.after.ownerPack ||
          correction.before.supportingItemCount !== correction.after.supportingItemCount ||
          !eq(correction.before.supportingQuestionUids, correction.after.supportingQuestionUids) ||
          !eq([...correction.questionUids].sort(), [...(correction.before.supportingQuestionUids || [])].sort()))
        fail("META_PIPELINE_AUDIT parent-binding correction changes more than its exact parent L2");
      const keyType = (unitMaster || []).find(row => row.keyType === "subUnitKey" && row.key === correction.before.subUnitKey);
      if (!keyType || keyType.standardUnitKey !== correction.before.standardUnitKey || correction.before.standardUnitKey !== "H15-M1-07")
        fail("META_PIPELINE_AUDIT parent-binding standard-unit scope mismatch");
      for (const uid of correction.questionUids) {
        const affected = affectedByUid.get(uid), item = [...(items || [])].find(row => row.questionUid === uid);
        const record = (audit.records || []).find(row => Number(row.questionId) === Number(affected?.sourceOrdinal));
        const classification = record?.classification || {}, target = item?.targetParentRef;
        if (!affected || !item || !record || Number(item.sourceOrdinal) !== Number(affected.sourceOrdinal) ||
            affected.standardUnitKey !== correction.before.standardUnitKey ||
            affected.subUnitKey !== correction.before.subUnitKey || affected.problemTypeKey !== correction.before.problemTypeKey ||
            item.after?.standardUnitKey !== correction.before.standardUnitKey || item.after?.subUnitKey !== correction.before.subUnitKey ||
            item.after?.problemTypeKey !== correction.before.problemTypeKey || classification.problemTypeKey !== correction.before.problemTypeKey ||
            !eq(classification.crossConceptKeys, item.after.crossConceptKeys) || item.after.L1 !== parent.majorUnit || item.after.L2 !== parent.midUnit ||
            target?.path !== RPM_MASTER || target.curriculum !== parent.curriculum || target.scope !== parent.scope ||
            target.majorUnit !== parent.majorUnit || target.midUnit !== parent.midUnit ||
            !(item.evidenceRefs || []).some(ref => ref.path === parentBindingCorrectionRef.path && ref.sha256 === parentBindingCorrectionRef.sha256))
          fail(`META_PIPELINE_AUDIT corrected parent UID/evidence mismatch: ${uid}`);
        declaredUids.push(uid);
      }
    }
    if (!eq([...affectedByUid.keys()].sort(), [...declaredUids].sort()) || registryChanges.some(change =>
      change.before !== null && !allowedPackScopeChanges.has(change) && !parentBindingChanges.has(change)))
      fail("META_PIPELINE_AUDIT parent-binding correction scope mismatch");
  }
  if (registryChanges.some(change => change.after === null || change.before !== null && !allowedPackScopeChanges.has(change) && !parentBindingChanges.has(change)))
    fail("META_PIPELINE_AUDIT registry changes must be additions only; existing meanings cannot be rewritten");
  // Gemini's zero-inflation count describes its semantic classification pass.
  // A missing Git canonical definition is an additive registry promotion, not
  // a newly invented template in that pass. Promote only keys used by this
  // audited exam, and never rewrite an existing definition.
  const itemByOrdinal = unique(items || [], "sourceOrdinal", "META_PIPELINE_AUDIT promotion ordinal");
  const uses = { problemTypes: new Map(), templates: new Map(), concepts: new Map() };
  const addUse = (kind, key, record) => {
    const list = uses[kind].get(key) || [];
    list.push(record);
    uses[kind].set(key, list);
  };
  for (const record of audit.records || []) {
    const classification = record.classification || {};
    const item = itemByOrdinal.get(Number(record.questionId));
    if (!item || item.sourceOrdinal !== Number(record.questionId)) fail(`META_PIPELINE_AUDIT promotion UID missing: ${record.questionId}`);
    if (classification.problemTypeKey) addUse("problemTypes", classification.problemTypeKey, { record, item });
    if (classification.templateKey) addUse("templates", classification.templateKey, { record, item });
    for (const key of classification.crossConceptKeys || []) addUse("concepts", key, { record, item });
  }

  for (const extension of packCourseExtensions) {
    const linkedItems = itemByOrdinal.size ? [...itemByOrdinal.values()].filter(item => {
      const row = item.after || {};
      const course = row.standardCourse || row.courseKey;
      const courseKey = row.courseKey || course;
      if (!extension.addedCourses.includes(course) && !extension.addedCourses.includes(courseKey)) return false;
      const binding = afterTables.bindings.get(stable([row.curriculum || row.curriculumKey, course, row.standardUnitKey,
        row.subUnitKey ?? null, row.problemTypeKey]));
      return binding?.status === "ACTIVE" && binding.ownerPack === extension.packId;
    }) : [];
    if (!linkedItems.length) fail(`META_PIPELINE_AUDIT pack course extension is not used by audited UIDs: ${extension.packId}`);
    for (const item of linkedItems) {
      const row = item.after || {};
      const course = row.standardCourse || row.courseKey;
      const binding = afterTables.bindings.get(stable([row.curriculum || row.curriculumKey, course, row.standardUnitKey,
        row.subUnitKey ?? null, row.problemTypeKey]));
      if (!binding || binding.status !== "ACTIVE" || binding.ownerPack !== extension.packId)
        fail(`META_PIPELINE_AUDIT pack course extension lacks exact active binding: ${extension.packId}/${course}/${row.problemTypeKey}`);
    }
  }

  const sorted = rows => [...rows].sort();
  const validateSupportingEvidence = (entry, key, kind, linkedRows) => {
    const expectedUids = sorted(linkedRows.map(({ item }) => item.questionUid));
    if (new Set(expectedUids).size !== expectedUids.length) fail(`META_PIPELINE_AUDIT duplicate supporting UID ${kind}: ${key}`);
    if (!eq(sorted(entry.supportingQuestionUids || []), expectedUids) || entry.supportingItemCount !== expectedUids.length)
      fail(`META_PIPELINE_AUDIT ${kind} promotion support mismatch: ${key}`);
    requireText(entry.canonicalLabelKo, `${kind} canonical label ${key}`);
    requireText(entry.definition, `${kind} canonical definition ${key}`);
  };
  const validatePackBinding = (key, entry, linkedRows, kind) => {
    const owners = new Set();
    for (const { item } of linkedRows) {
      const row = item.after || {};
      const curriculum = requireText(row.curriculum || row.curriculumKey, `${kind} promotion curriculum ${key}`);
      const course = requireText(row.standardCourse || row.courseKey, `${kind} promotion course ${key}`);
      const binding = afterTables.bindings.get(stable([curriculum, course, row.standardUnitKey, row.subUnitKey ?? null,
        kind === "PT" ? key : row.problemTypeKey]));
      if (!binding || binding.status !== "ACTIVE") fail(`META_PIPELINE_AUDIT ${kind} promotion binding missing: ${key}`);
      owners.add(binding.ownerPack || afterTables.pt.get(row.problemTypeKey)?.ownerPack);
    }
    if (owners.size !== 1 || !owners.has(entry.ownerPack)) fail(`META_PIPELINE_AUDIT ${kind} promotion pack isolation mismatch: ${key}`);
    const pack = afterTables.packs.get(entry.ownerPack);
    if (!pack || linkedRows.some(({ item }) => {
      const row = item.after || {};
      const curriculum = row.curriculum || row.curriculumKey;
      const course = row.standardCourse || row.courseKey;
      const domains = pack.meta.ownedStandardUnitDomains || [];
      return !pack.meta.curricula.includes(curriculum) || !pack.meta.standardCourses.includes(course) ||
        domains.length > 0 && !domains.includes(row.standardUnitKey);
    })) fail(`META_PIPELINE_AUDIT ${kind} promotion outside owner pack scope: ${key}`);
  };

  const newProblemTypes = [...afterTables.pt.keys()].filter(key => !beforeTables.pt.has(key));
  const expectedNewProblemTypes = [...uses.problemTypes.keys()].filter(key => !beforeTables.pt.has(key));
  if (!eq(sorted(newProblemTypes), sorted(expectedNewProblemTypes)))
    fail("META_PIPELINE_AUDIT problemType promotions must exactly match missing audited keys");
  for (const key of expectedNewProblemTypes) {
    const entry = afterTables.pt.get(key), linkedRows = uses.problemTypes.get(key);
    if (!entry || entry.status !== "ACTIVE" || !/^PT_[A-Z0-9_]+$/.test(key)) fail(`META_PIPELINE_AUDIT invalid PT promotion: ${key}`);
    validateSupportingEvidence(entry, key, "PT", linkedRows);
    validatePackBinding(key, entry, linkedRows, "PT");
  }

  const newTemplates = [...afterTables.tpl.keys()].filter(key => !beforeTables.tpl.has(key));
  const expectedNewTemplates = [...uses.templates.keys()].filter(key => !beforeTables.tpl.has(key));
  if (!eq(sorted(newTemplates), sorted(expectedNewTemplates)))
    fail("META_PIPELINE_AUDIT template promotions must exactly match missing audited keys");
  for (const key of expectedNewTemplates) {
    const entry = afterTables.tpl.get(key), linkedRows = uses.templates.get(key);
    const parents = new Set(linkedRows.map(({ record }) => record.classification.problemTypeKey));
    if (!entry || entry.status !== "ACTIVE" || !/^TPL_[A-Z0-9_]+$/.test(key)) fail(`META_PIPELINE_AUDIT invalid TPL promotion: ${key}`);
    if (parents.size !== 1 || entry.parentProblemTypeKey !== [...parents][0]) fail(`META_PIPELINE_AUDIT TPL parent promotion mismatch: ${key}`);
    validateSupportingEvidence(entry, key, "TPL", linkedRows);
    const parent = afterTables.pt.get(entry.parentProblemTypeKey);
    if (!parent || parent.status !== "ACTIVE") fail(`META_PIPELINE_AUDIT TPL parent missing: ${key}`);
    // A PT may be canonically owned by one pack but reused by an exact active
    // binding in another course pack. A new TPL belongs to that binding owner;
    // its parent PT remains the unchanged canonical key.
    validatePackBinding(key, { ...entry, ownerPack: entry.ownerPack || parent.ownerPack }, linkedRows, "TPL");
  }

  const audited = new Map(audit.boundAtomicCrossConcepts.map(row => [row.conceptKey, row]));
  const added = new Map();
  for (const change of registryChanges) {
    if (change.collection === "concepts") {
      const key = change.after?.conceptKey;
      if (!audited.has(key)) fail(`META_PIPELINE_AUDIT contains unbound CrossConcept registry addition: ${key}`);
      added.set(key, change.after);
    } else if (!change.collection && change.path.startsWith(`${CANON}/concepts/`)) {
      for (const row of change.after?.concepts || []) {
        if (!audited.has(row.conceptKey)) fail(`META_PIPELINE_AUDIT contains unbound CrossConcept registry addition: ${row.conceptKey}`);
        added.set(row.conceptKey, row);
      }
    }
  }
  for (const [key, definition] of audited) {
    const before = beforeTables.cc.get(key), after = afterTables.cc.get(key);
    const candidate = before || added.get(key);
    if (!after || !candidate) fail(`META_PIPELINE_AUDIT CrossConcept canonical definition missing: ${key}`);
    if (before) {
      if (!eq(before, after)) fail(`META_PIPELINE_AUDIT cannot revise existing CrossConcept: ${key}`);
      const labelDiffers = candidate.canonicalLabelKo !== definition.labelKo;
      const definitionDiffers = candidate.definition !== definition.definition;
      if (labelDiffers || definitionDiffers) {
        const review = existingConceptReviews.get(key);
        if (!review || review.disposition !== "REUSE_CANONICAL" || review.canonicalLabelKo !== candidate.canonicalLabelKo ||
            review.canonicalDefinition !== candidate.definition || review.auditLabelKo !== definition.labelKo ||
            review.auditDefinition !== definition.definition || !requireText(review.rationale, `META_PIPELINE_AUDIT existing CC rationale ${key}`))
          fail(`META_PIPELINE_AUDIT existing CrossConcept wording review required: ${key}`);
      }
    } else {
      if (candidate.canonicalLabelKo !== definition.labelKo)
        fail(`META_PIPELINE_AUDIT new CrossConcept label mismatch: ${key}`);
      if (candidate.definition !== definition.definition) fail(`META_PIPELINE_AUDIT new CrossConcept definition mismatch: ${key}`);
      validateSupportingEvidence(candidate, key, "CrossConcept", uses.concepts.get(key) || []);
    }
  }
  const expectedReviews = [...audited].filter(([key, definition]) => {
    const before = beforeTables.cc.get(key);
    return before && (before.canonicalLabelKo !== definition.labelKo || before.definition !== definition.definition);
  }).map(([key]) => key).sort();
  if (!eq([...existingConceptReviews.keys()].sort(), expectedReviews)) fail("META_PIPELINE_AUDIT existing CrossConcept reviews do not match wording differences");
  const expectedAdditions = [...audited.keys()].filter(key => !beforeTables.cc.has(key)).sort();
  if (!eq([...added.keys()].sort(), expectedAdditions)) fail("META_PIPELINE_AUDIT CrossConcept additions do not exactly match the audited definitions");
}

// Native canonical documents only. No second registry or parallel compiler.
function allowedCollection(file, collection) {
  if (file === MASTER) return collection === "$";
  if (file === INDEX) return ["activePacks", "activeConceptShards"].includes(collection);
  if (/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/taxonomy\.json$/.test(file)) return ["problemTypes", "templates"].includes(collection);
  if (/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/bindings\.json$/.test(file)) return ["bindings", "applicabilityRules"].includes(collection);
  if (/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/aliases\.json$/.test(file)) return collection === "aliases";
  if (/^archive\/data\/meta-foundation\/canonical\/concepts\/[a-z0-9-]+\.json$/.test(file)) return collection === "concepts";
  return file === `${CANON}/condition_registry.json` && collection === "conditions";
}

function registryPlan(root, changes, verifyEvidence) {
  const documents = new Map();
  const original = new Map();
  const read = file => {
    if (documents.has(file)) return documents.get(file);
    const full = safePath(root, file);
    const value = fs.existsSync(full) ? JSON.parse(fs.readFileSync(full, "utf8")) : null;
    original.set(file, structuredClone(value));
    documents.set(file, value);
    return value;
  };
  for (const change of changes) {
    const { path: file, collection, match, before, after } = change;
    safePath(root, file);
    if (!Object.hasOwn(change, "before") || !Object.hasOwn(change, "after")) fail("registry change requires explicit before/after (null for absence)");
    verifyEvidence(change.evidenceRefs);
    const doc = read(file);
    if (!collection) {
      const nativeDoc = /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/(pack|taxonomy|bindings|aliases)\.json$/.test(file)
        || /^archive\/data\/meta-foundation\/canonical\/concepts\/[a-z0-9-]+\.json$/.test(file);
      if (!nativeDoc || (doc !== null && !file.endsWith("/pack.json"))) fail(`whole-document change not allowed: ${file}`);
      if (!eq(doc, before) || !after || typeof after !== "object" || Array.isArray(after)) fail(`registry document before/after mismatch: ${file}`);
      documents.set(file, structuredClone(after));
      continue;
    }
    if (!allowedCollection(file, collection) || !match || typeof match !== "object" || Array.isArray(match) || !Object.keys(match).length) fail(`registry collection/match not allowed: ${file}`);
    if (!doc) fail(`create native document before editing collection: ${file}`);
    const rows = collection === "$" ? doc : doc[collection];
    if (!Array.isArray(rows)) fail(`registry collection missing: ${file}.${collection}`);
    const matches = rows.map((row, i) => Object.entries(match).every(([k, v]) => Object.hasOwn(row, k) && eq(row[k], v)) ? i : -1).filter(i => i >= 0);
    if (matches.length > 1) fail(`ambiguous registry match: ${file}`);
    const index = matches[0];
    if (!eq(index === undefined ? null : rows[index], before)) fail(`registry before mismatch: ${file}`);
    if (after !== null && (!after || typeof after !== "object" || Array.isArray(after) || !Object.entries(match).every(([k, v]) => eq(after[k], v)))) fail(`registry after identity mismatch: ${file}`);
    if (after === null) { if (index === undefined) fail(`cannot delete missing registry entry: ${file}`); rows.splice(index, 1); }
    else if (index === undefined) rows.push(structuredClone(after));
    else rows[index] = structuredClone(after);
  }
  const readJson = file => read(file) ?? fail(`canonical file missing: ${file}`);
  const index = readJson(INDEX);
  unique(index.activePacks, "id", "pack");
  unique(index.activeConceptShards, "id", "concept shard");
  for (const row of [...index.activePacks, ...index.activeConceptShards]) if (!/^[A-Z][A-Z0-9_]*$/.test(row.id) || row.status !== "ACTIVE") fail(`invalid ACTIVE owner: ${row.id}`);
  const bump = value => /^\d+\.\d+\.\d+$/.test(value) ? value.replace(/\d+$/, n => String(Number(n) + 1)) : /^\d+$/.test(value) ? String(Number(value) + 1) : fail(`invalid canonical version: ${value}`);
  for (const entry of index.activePacks) {
    const base = `${CANON}/packs/${slug(entry.id)}`;
    const meta = readJson(`${base}/pack.json`);
    const taxonomy = readJson(`${base}/taxonomy.json`);
    const bindings = readJson(`${base}/bindings.json`);
    const aliases = readJson(`${base}/aliases.json`);
    const touched = ["pack", "taxonomy", "bindings", "aliases"].some(n => {
      const p = `${base}/${n}.json`; return !eq(readJson(p), original.get(p));
    });
    if (touched) {
      taxonomy.problemTypeCount = taxonomy.problemTypes.length;
      taxonomy.templateCount = taxonomy.templates.length;
      bindings.bindingCount = bindings.bindings.length;
      Object.assign(meta, { problemTypeCount: taxonomy.problemTypes.length, templateCount: taxonomy.templates.length, bindingCount: bindings.bindings.length, aliasCount: aliases.aliases.length });
      const addedBindingDomains = changes
        .filter(change => change.path === `${base}/bindings.json` && change.collection === "bindings" && change.before === null && change.after?.status === "ACTIVE")
        .map(change => change.after.standardUnitKey)
        .filter(Boolean);
      if (addedBindingDomains.length) {
        meta.ownedStandardUnitDomains = [...new Set([...(meta.ownedStandardUnitDomains || []), ...addedBindingDomains])].sort();
      }
      const old = original.get(`${base}/pack.json`);
      if (old && meta.packVersion === old.packVersion) meta.packVersion = bump(old.packVersion);
    }
    if (meta.canonicalStatus !== "ACTIVE" || !/^\d+\.\d+\.\d+$/.test(meta.packVersion)) fail(`invalid pack status/version: ${entry.id}`);
    entry.version = meta.packVersion;
  }
  for (const entry of index.activeConceptShards) {
    const file = `${CANON}/concepts/${slug(entry.id)}.json`;
    const shard = readJson(file);
    const old = original.get(file);
    if (!eq(old, shard)) {
      shard.conceptCount = shard.concepts.length;
      if (old && shard.shardVersion === old.shardVersion) shard.shardVersion = bump(old.shardVersion);
    }
    entry.version = shard.shardVersion;
    entry.conceptCount = shard.concepts.length;
  }
  const conditionPath = `${CANON}/condition_registry.json`;
  const condition = readJson(conditionPath);
  if (!eq(condition, original.get(conditionPath))) {
    condition.conditionCount = condition.conditions.length;
    index.conditionRegistry.version = bump(index.conditionRegistry.version);
  }
  const canonical = loadCanonical(readJson);
  const compiled = buildCompiled(canonical);
  const output = compiledOutputs(canonical, compiled);
  const requiredSources = [...canonical.packs.flatMap(p => ["pack", "taxonomy", "bindings", "aliases"].map(n => `${p.base}/${n}.json`)), ...canonical.shards.map(s => s.file), conditionPath];
  const indexed = new Set(index.canonicalSources.map(r => r.path));
  for (const file of requiredSources) if (!indexed.has(file)) index.canonicalSources.push({ path: file });
  const readText = file => documents.has(file) && !eq(documents.get(file), original.get(file)) ? json(documents.get(file)) : fs.readFileSync(safePath(root, file), "utf8");
  output.set(INDEX, json(buildRegistryIndex(canonical, output, readText)));
  for (const [file, doc] of documents) if (file !== INDEX && !eq(doc, original.get(file))) output.set(file, json(doc));
  return { root, canonical, compiled, output, master: readJson(MASTER), original, readJson };
}

// ---- Generated-only extension keys (EXT-*) ----------------------------------------------------------
// A reviewed exam may carry Generated extension CrossConcept / Condition keys next to canonical ones
// (Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1 section 3: EXT namespace, never a canonical
// promotion). The registrar accepts such a key ONLY when every statement below holds; anything else keeps
// the previous refusal. It never writes an extension into a canonical registry or the RPM LOCKED master.
//   1. The derived index (archive2-extension-keys.json) lists the key as GENERATED_ACTIVE, not promoted,
//      of the kind the request field needs (cross -> crossConceptKeys, cond -> conditionKeys).
//   2. The index's source file lives under archive/data/meta-foundation/extensions/ and the file itself is a
//      GENERATED_ACTIVE* registry that defines the key exactly once, with status GENERATED_ACTIVE and
//      canonicalRpmPromotion === false (re-checked in the source: the index is derived and may be stale).
//   3. The definition names an existing ACTIVE canonical parent (CrossConcept / Condition).
//   4. The definition's curriculum and course equal the question's.
// Extension keys are not accepted for PT/TPL; those stay canonical-only.
const EXTENSION_INDEX = "archive/data/archive2-extension-keys.json";
const EXTENSION_INDEX_SCHEMA = "archive2-extension-keys-v1";
const EXTENSION_ROOT = "archive/data/meta-foundation/extensions/";
const isExtensionKey = key => typeof key === "string" && key.startsWith("EXT-");
const compactText = value => String(value ?? "").normalize("NFC").replace(/\s/g, "");
const EXTENSION_FIELDS = {
  crossConceptKeys: { kind: "cross", sourceKind: "CROSS", containers: ["extensions", "generatedCrossConcepts"], parentProp: "conceptKey", table: "cc" },
  conditionKeys: { kind: "cond", sourceKind: "COND", containers: ["extensions", "generatedConditions"], parentProp: "conditionKey", table: "cond" }
};

function createExtensionLookup(root, tables) {
  let index = null;
  const sources = new Map();
  const loadIndex = () => {
    if (index) return index;
    const full = safePath(root, EXTENSION_INDEX);
    if (!fs.existsSync(full)) fail("extension key index missing");
    const doc = JSON.parse(fs.readFileSync(full, "utf8"));
    if (doc.schemaVersion !== EXTENSION_INDEX_SCHEMA || !Array.isArray(doc.definitions)) fail("extension key index schema mismatch");
    index = new Map();
    for (const definition of doc.definitions) {
      if (index.has(definition.key)) fail(`duplicate extension key index entry: ${definition.key}`);
      index.set(definition.key, definition);
    }
    return index;
  };
  const loadSource = file => {
    if (sources.has(file)) return sources.get(file);
    const full = safePath(root, file);
    if (!fs.existsSync(full)) fail(`extension registry missing: ${file}`);
    const bytes = fs.readFileSync(full);
    const loaded = { doc: JSON.parse(bytes.toString("utf8")), sha256: digest(bytes) };
    sources.set(file, loaded);
    return loaded;
  };
  return {
    check(field, key, scope) {
      const spec = EXTENSION_FIELDS[field];
      if (!spec) fail(`extension keys are not accepted for ${field}: ${key}`);
      const definition = loadIndex().get(key);
      if (!definition) fail(`unregistered extension key (${field}): ${key}`);
      if (definition.status !== "GENERATED_ACTIVE") fail(`extension key is not GENERATED_ACTIVE (${field}): ${key} (${definition.status})`);
      if (definition.canonicalPromoted !== false) fail(`extension key claims or omits canonical promotion state (${field}): ${key}`);
      if (definition.kind !== spec.kind || definition.kindConflicts) fail(`extension key kind mismatch (${field}): ${key} is ${definition.kind}`);
      if (typeof definition.file !== "string" || !definition.file.startsWith(EXTENSION_ROOT)) fail(`extension key is not defined in ${EXTENSION_ROOT}: ${key}`);
      const { doc, sha256 } = loadSource(definition.file);
      if (!/^GENERATED_ACTIVE/.test(doc.status || "")) fail(`extension registry is not GENERATED_ACTIVE: ${definition.file}`);
      const entries = spec.containers.flatMap(container => (Array.isArray(doc[container]) ? doc[container] : []).filter(entry => entry?.key === key));
      if (entries.length !== 1) fail(`extension key must be defined exactly once in ${definition.file}: ${key}`);
      const entry = entries[0];
      if (entry.kind !== undefined && entry.kind !== spec.sourceKind) fail(`extension registry kind mismatch (${field}): ${key} is ${entry.kind}`);
      if (entry.status !== "GENERATED_ACTIVE") fail(`extension registry entry is not GENERATED_ACTIVE: ${key} (${entry.status})`);
      if (entry.canonicalRpmPromotion !== false || entry.canonicalPromoted === true || entry.canonicalRpmPromoted === true)
        fail(`extension registry entry must declare canonicalRpmPromotion false: ${key}`);
      const parentKey = entry.parent?.[spec.parentProp] ?? entry.parentKey;
      if (typeof parentKey !== "string" || !parentKey || tables[spec.table].get(parentKey)?.status !== "ACTIVE")
        fail(`extension key parent is not an ACTIVE canonical ${spec.kind}: ${key} -> ${parentKey}`);
      const curriculum = entry.curriculumKey ?? entry.curriculum;
      if (!curriculum || String(curriculum) !== String(scope.curriculum) || !entry.standardCourse || compactText(entry.standardCourse) !== compactText(scope.course))
        fail(`extension key scope mismatch: ${key} is ${curriculum}/${entry.standardCourse}, question is ${scope.curriculum}/${scope.course}`);
      return { key, field, kind: spec.kind, status: entry.status, canonicalRpmPromotion: false, parentKey,
        registryPath: definition.file, registrySha256: sha256 };
    }
  };
}

function lookup(plan) {
  const c = plan.compiled;
  const result = {
    packs: unique(plan.canonical.packs, p => p.meta.packId, "pack"),
    pt: unique(c.taxonomy.problemTypes, "problemTypeKey", "PT"),
    tpl: unique(c.taxonomy.templates, "templateKey", "TPL"),
    cc: unique(c.conceptRegistry.concepts, "conceptKey", "CrossConcept"),
    cond: unique(c.conditionRegistry.conditions, "conditionKey", "Condition"),
    master: unique(plan.master.filter(r => ["standardUnitKey", "subUnitKey"].includes(r.keyType)), "key", "master unit key"),
    bindings: unique(c.curriculumBindings.bindings.filter(r => r.status === "ACTIVE"), r => stable([r.curriculum, r.standardCourse, r.standardUnitKey, r.subUnitKey ?? null, r.problemTypeKey]), "binding")
  };
  unique([...result.pt.keys(), ...result.tpl.keys(), ...result.cc.keys(), ...result.cond.keys()].map(key => ({ key })), "key", "cross-kind canonical key");
  for (const p of result.pt.values()) if (p.status === "ACTIVE") {
    requireText(p.canonicalLabelKo, `PT label ${p.problemTypeKey}`);
    if (!result.packs.has(p.ownerPack)) fail(`PT owner missing: ${p.problemTypeKey}`);
  }
  for (const t of result.tpl.values()) if (t.status === "ACTIVE") {
    requireText(t.canonicalLabelKo, `TPL label ${t.templateKey}`);
    if (result.pt.get(t.parentProblemTypeKey)?.status !== "ACTIVE") fail(`TPL parent missing: ${t.templateKey}`);
  }
  for (const b of result.bindings.values()) {
    if (result.pt.get(b.problemTypeKey)?.status !== "ACTIVE") fail(`binding PT missing: ${b.problemTypeKey}`);
    if (!result.master.has(b.standardUnitKey) || b.subUnitKey && !result.master.has(b.subUnitKey)) fail(`binding unit missing: ${b.standardUnitKey}/${b.subUnitKey}`);
  }
  if (c.aliases.collisions.length) fail("canonical alias collision");
  // Lazy and read-only: canonical-only registrations never touch the extension files.
  Object.defineProperty(result, "ext", { value: createExtensionLookup(plan.root, result), enumerable: false });
  return result;
}

function resolve(row, tables, { allowConditionDebt = false } = {}) {
  const active = (map, key, type) => {
    const r = map.get(key);
    if (!r || r.status !== "ACTIVE") fail(`inactive/missing ${type}: ${key}`);
    return r;
  };
  const pt = active(tables.pt, row.problemTypeKey, "PT");
  const tpl = active(tables.tpl, row.templateKey, "TPL");
  if (tpl.parentProblemTypeKey !== pt.problemTypeKey) fail(`TPL parent mismatch: ${row.templateKey}`);
  const extensionKeys = [];
  for (const [field, map] of [["crossConceptKeys", tables.cc], ["conditionKeys", tables.cond]]) {
    if (field === "conditionKeys" && row[field] === null && allowConditionDebt) continue;
    if (!Array.isArray(row[field]) || new Set(row[field]).size !== row[field].length) fail(`invalid ${field}`);
    for (const k of row[field]) {
      // A key that is not a canonical definition at all may be a Generated extension (checked below, once
      // curriculum/course are known). A canonical key that exists but is not ACTIVE is still refused.
      if (isExtensionKey(k) && !map.has(k)) extensionKeys.push({ field, key: k });
      else active(map, k, field);
    }
  }
  const unit = tables.master.get(row.standardUnitKey), sub = tables.master.get(row.subUnitKey);
  if (!unit || unit.keyType !== "standardUnitKey" || !["active", "ACTIVE"].includes(unit.status)) fail(`standard unit missing: ${row.standardUnitKey}`);
  if (row.subUnitKey && (!sub || sub.keyType !== "subUnitKey" || !["active", "ACTIVE"].includes(sub.status))) fail(`subunit missing: ${row.subUnitKey}`);
  const curriculum = requireText(row.curriculum || row.curriculumKey, "curriculum");
  const course = requireText(row.standardCourse || row.courseKey, "standardCourse");
  const compactCourse = value => String(value).normalize("NFC").replace(/\s/g, "");
  if (row.curriculumKey && row.curriculumKey !== curriculum) fail("curriculum/course aliases disagree");
  const binding = tables.bindings.get(stable([curriculum, course, row.standardUnitKey, row.subUnitKey ?? null, row.problemTypeKey]));
  if (!binding) fail(`ACTIVE curriculum binding missing: ${curriculum}/${course}/${row.problemTypeKey}`);
  const pack = tables.packs.get(binding.ownerPack || pt.ownerPack);
  const courseKey = row.courseKey || course;
  const courseAliasAllowed = compactCourse(courseKey) === compactCourse(course) || pack?.meta.standardCourses.includes(courseKey);
  if (compactCourse(courseKey) !== compactCourse(course) && !courseAliasAllowed) fail("curriculum/course aliases disagree");
  if (!pack || !pack.meta.curricula.includes(curriculum) || !pack.meta.standardCourses.includes(course) || !pack.meta.standardCourses.includes(courseKey))
    fail(`binding ownerPack scope missing: ${binding.ownerPack || pt.ownerPack}/${curriculum}/${course}`);
  const extensions = extensionKeys.map(({ field, key }) => tables.ext.check(field, key, { curriculum, course }));
  return { pt, tpl, unit, sub, binding, pack, curriculum, course, extensions };
}

// Type-hold rows (REVIEW2): validate everything except PT/TPL/binding/pack, which are deliberately absent.
function resolveUnitOnly(row, tables) {
  const active = (map, key, type) => { const r = map.get(key); if (!r || r.status !== "ACTIVE") fail(`inactive/missing ${type}: ${key}`); return r; };
  for (const [field, map, kind] of [["crossConceptKeys", tables.cc, "cross"], ["conditionKeys", tables.cond, "cond"]]) {
    if (!Array.isArray(row[field]) || new Set(row[field]).size !== row[field].length) fail(`invalid ${field}`);
    for (const k of row[field]) if (map.has(k) || !receivedActive(tables, kind, k)) active(map, k, field);
  }
  const unit = masterOrReceivedKey(tables, row.standardUnitKey, "standardUnitKey"), sub = row.subUnitKey ? masterOrReceivedKey(tables, row.subUnitKey, "subUnitKey") : null;
  if (!unit || unit.keyType !== "standardUnitKey" || !["active", "ACTIVE"].includes(unit.status)) fail(`standard unit missing: ${row.standardUnitKey}`);
  if (row.subUnitKey && (!sub || sub.keyType !== "subUnitKey" || !["active", "ACTIVE"].includes(sub.status))) fail(`subunit missing: ${row.subUnitKey}`);
  if (sub && (sub.standardUnitKey || sub.parentKey) !== row.standardUnitKey) fail(`subunit parent mismatch: ${row.subUnitKey}`);
  requireText(row.integrationPattern, "integrationPattern");
  return { unit, sub, curriculum: requireText(row.curriculum || row.curriculumKey, "curriculum"), course: requireText(row.standardCourse || row.courseKey, "standardCourse") };
}

function labelsFor(root, patch, row, resolved, read, sourceBlob, { registeredReplay = false } = {}) {
  const base = { L1: resolved.binding.L1 || resolved.unit.labelKo, L2: resolved.binding.L2 || resolved.sub?.labelKo || "", L3: resolved.pt.canonicalLabelKo, L4: resolved.tpl.canonicalLabelKo };
  if (patch.basicScopeParentRef) {
    if (patch.targetParentRef) fail("basic and RPM target parent references cannot be combined");
    const ref = patch.basicScopeParentRef;
    if (!/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/.+\.parent-labels\.json$/.test(ref.path || "") ||
        !(patch.evidenceRefs || []).some(e => e.path === ref.path && e.sha256 === ref.sha256)) fail("basic scope parent reference is not evidence-bound");
    const proof = read(ref.path);
    if (proof.schemaVersion !== "archive-meta-pipeline-parent-label-evidence-v1" ||
        !["archive/data/basic-scope-parent-links.json", META].includes(proof.sourcePath) || !/^[a-f0-9]{64}$/.test(proof.sourceSha256 || ""))
      fail("basic scope parent evidence schema/source mismatch");
    const compactCourse = value => String(value ?? "").normalize("NFC").replace(/\s/g, "");
    const parentCourseMatches = value => compactCourse(value) === compactCourse(resolved.course) ||
      Boolean(row.courseKey && resolved.pack?.meta?.standardCourses?.includes(row.courseKey) &&
        compactCourse(value) === compactCourse(row.courseKey));
    let parent = null;
    if (proof.sourcePath === META) {
      const metadataBytes = fs.readFileSync(safePath(root, META));
      // The parent proof is bound to the pre-registration metadata snapshot.
      // A receipt-backed replay runs after this same request has updated META,
      // so its file SHA necessarily differs. The immutable request/evidence
      // hashes and the receipt are checked before this branch; retain the exact
      // UID/ordinal/unit/label comparisons below during replay.
      if (!registeredReplay && digest(metadataBytes) !== proof.sourceSha256) fail(`approved metadata parent snapshot SHA mismatch: ${row.questionUid}`);
      const metadataDoc = JSON.parse(metadataBytes.toString("utf8"));
      const currentRows = metadataDoc.records.filter(candidate => candidate.questionUid === patch.questionUid &&
        candidate.sourceArchiveFile === row.sourceArchiveFile && candidate.sourceOrdinal === row.sourceOrdinal);
      const snapshotRows = (proof.records || []).filter(candidate => candidate.questionUid === patch.questionUid &&
        candidate.sourceArchiveFile === row.sourceArchiveFile && candidate.sourceOrdinal === row.sourceOrdinal);
      if (currentRows.length !== 1 || snapshotRows.length !== 1 || !approved(currentRows[0]))
        fail(`approved metadata parent snapshot missing/ambiguous: ${row.questionUid}`);
      const current = currentRows[0], snapshot = snapshotRows[0];
      if (snapshot.curriculumKey !== resolved.curriculum || compactCourse(snapshot.courseKey) !== compactCourse(resolved.course) ||
          snapshot.standardUnitKey !== row.standardUnitKey || (snapshot.subUnitKey ?? null) !== (row.subUnitKey ?? null) ||
          (current.curriculum || current.curriculumKey) !== snapshot.curriculumKey ||
          compactCourse(current.standardCourse || current.courseKey) !== compactCourse(snapshot.courseKey) ||
          current.standardUnitKey !== snapshot.standardUnitKey || (current.subUnitKey ?? null) !== (snapshot.subUnitKey ?? null) ||
          current.L1 !== snapshot.L1 || current.L2 !== snapshot.L2)
        fail(`approved metadata parent snapshot identity mismatch: ${row.questionUid}`);
      parent = snapshot;
    } else {
      const matches = (proof.records || []).filter(candidate => candidate.curriculumKey === resolved.curriculum &&
        parentCourseMatches(candidate.courseKey) && candidate.standardUnitKey === row.standardUnitKey && (candidate.subUnitKey ?? null) === (row.subUnitKey ?? null));
      parent = matches.length === 1 ? matches[0] : null;
      if (!parent && matches.length === 0) {
        const derived = (proof.derivedRecords || []).filter(candidate => candidate.curriculumKey === resolved.curriculum &&
          parentCourseMatches(candidate.courseKey) && candidate.standardUnitKey === row.standardUnitKey &&
          candidate.subUnitKey === (row.subUnitKey ?? null));
        if (derived.length !== 1 || derived[0].method !== "SAME_STANDARD_UNIT_SIBLING_PARENT_CONSENSUS" ||
            !Array.isArray(derived[0].supportingSubUnitKeys) || derived[0].supportingSubUnitKeys.length < 2) fail(`basic scope parent evidence missing/ambiguous: ${row.questionUid}`);
        const supportKeys = new Set(derived[0].supportingSubUnitKeys);
        const support = (proof.records || []).filter(candidate => candidate.curriculumKey === resolved.curriculum &&
          parentCourseMatches(candidate.courseKey) && candidate.standardUnitKey === row.standardUnitKey &&
          supportKeys.has(candidate.subUnitKey) && candidate.subUnitKey !== row.subUnitKey);
        if (support.length !== supportKeys.size || new Set(support.map(candidate => candidate.L1)).size !== 1 ||
            new Set(support.map(candidate => candidate.L2)).size !== 1 || support[0].L1 !== derived[0].L1 || support[0].L2 !== derived[0].L2)
          fail(`basic scope sibling parent evidence is inconsistent: ${row.questionUid}`);
        parent = derived[0];
      }
    }
    if (!parent) fail(`basic scope parent evidence missing/ambiguous: ${row.questionUid}`);
    base.L1 = requireText(parent.L1, "basic-scope L1");
    base.L2 = requireText(parent.L2, "basic-scope L2");
  }
  const withTargetParent = labels => {
    if (!patch.targetParentRef) return labels;
    const ref = patch.targetParentRef;
    const masterPath = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
    if (ref.path !== masterPath || !(patch.evidenceRefs || []).some(e => e.path === ref.path)) fail("target parent reference is not evidence-bound");
    const compact = value => String(value).normalize("NFC").replace(/\s/g, "");
    const matches = (read(masterPath).records || []).filter(r => r.curriculum === ref.curriculum && r.scope === ref.scope && r.majorUnit === ref.majorUnit && r.midUnit === ref.midUnit);
    // Same two legacy scope aliases used by archive2-canonical's master-path projection.
    const masterCourse = ({ 수학_상: "수학(상)", 수학_하: "수학(하)" })[ref.scope] || ref.scope;
    const canonicalMidLabels = [resolved.binding.L2, resolved.sub?.labelKo, resolved.unit.labelKo].filter(Boolean);
    let exactTypeParent = false;
    if (ref.crosswalkRef) {
      const cross = ref.crosswalkRef;
      if (!/^archive\/data\/meta-foundation\/crosswalks\/rpm-primary-v1\.0\/[a-z0-9-]+\.json$/.test(cross.path || "") ||
          !(patch.evidenceRefs || []).some(e => e.path === cross.path && e.sha256 === cross.sha256))
        fail("canonical target crosswalk is not evidence-bound");
      const doc = read(cross.path), rows = (doc.records || []).filter(r => r.id === cross.recordId);
      const r = rows[0];
      const normalizedScope = value => ({ 수학_상: "수학(상)", 수학_하: "수학(하)" })[value] || value;
      const crosswalkCourseMatches = r && (compact(normalizedScope(r.scope)) === compact(resolved.course) ||
        resolved.pack.meta.standardCourses.includes(row.courseKey) && compact(normalizedScope(r.scope)) === compact(row.courseKey));
      if (doc.status !== "ACTIVE_REFERENCE" || rows.length !== 1 || r.bindingStatus !== "ACTIVE" ||
          r.curriculum !== resolved.curriculum || !crosswalkCourseMatches ||
          r.problemTypeKey !== row.problemTypeKey || r.templateKey !== row.templateKey ||
          r.rpmPath?.majorUnit !== ref.majorUnit || r.rpmPath?.midUnit !== ref.midUnit)
        fail("canonical target crosswalk classification/parent mismatch");
      exactTypeParent = true;
    }
    if (!matches.length || ref.curriculum !== resolved.curriculum || compact(masterCourse) !== compact(row.courseKey || resolved.course) ||
        !canonicalMidLabels.includes(ref.midUnit) && !exactTypeParent || resolved.binding.L1 && ref.majorUnit !== resolved.binding.L1) fail("canonical target parent mismatch");
    return { ...labels, L1: ref.majorUnit, L2: ref.midUnit };
  };
  if (patch.approvedMetadataRef) {
    if (patch.semanticBinding) fail("ambiguous semantic approval reference");
    const ref = patch.approvedMetadataRef;
    if (!/^archive\/data\/meta-foundation\/exam-scoped\/[^/]+\.json$/.test(ref.path || "") ||
        !(patch.evidenceRefs || []).some(e => e.path === ref.path)) fail("approved metadata reference is not evidence-bound");
    const doc = read(ref.path);
    if (doc.schemaVersion !== "archive-exam-scoped-metadata-v1" || doc.purpose !== "EXAM_SCOPED_CANONICAL_METADATA_EXPORT" ||
        !/^ACTIVE_SEMANTIC_VERIFIED(?:__|$)/.test(doc.status || "") || doc.sourceArchiveFile !== row.sourceArchiveFile ||
        doc.sourceBlobSha !== sourceBlob || doc.recordCount !== doc.records?.length) fail("approved metadata source/schema drift");
    const matches = doc.records.filter(r => r.questionUid === row.questionUid && r.sourceOrdinal === row.sourceOrdinal);
    if (matches.length !== 1 || ref.questionUid !== row.questionUid) fail("approved metadata UID/ordinal mismatch");
    const approvedRow = matches[0];
    if (approvedRow.reviewStatus !== "reviewed_pass" || approvedRow.bindingResolutionStatus !== "RESOLVED" ||
        ["curriculumKey", "standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"].some(k => !eq(approvedRow[k], row[k]))) fail("approved metadata classification drift");
    return withTargetParent(Object.fromEntries(["L1", "L2", "L3", "L4"].map(k => [k, requireText(approvedRow[k], `approved ${k}`)])));
  }
  if (!patch.semanticBinding) return withTargetParent(base);
  const load = (file, id) => {
    if (!/^archive\/data\/meta-foundation\/crosswalks\/rpm-primary-v1\.0\/[a-z0-9-]+\.json$/.test(file || "")) fail("invalid semantic crosswalk path");
    const doc = read(file), matches = (doc.records || []).filter(r => r.id === id);
    if (matches.length !== 1) fail(`semantic crosswalk record missing/ambiguous: ${id}`);
    return { doc, record: matches[0] };
  };
  const spec = patch.semanticBinding;
  const semantic = load(spec.crosswalkPath, spec.recordId);
  const target = load(spec.targetCrosswalkPath || spec.crosswalkPath, spec.targetRecordId || spec.recordId);
  const s = semantic.record, t = target.record;
  if (s.problemTypeKey !== row.problemTypeKey || s.templateKey !== row.templateKey || s.bindingStatus !== "ACTIVE") fail(`RPM/PT/TPL mismatch: ${row.questionUid}`);
  if (t.curriculum !== resolved.curriculum || t.scope !== resolved.course || t.standardUnitKey !== row.standardUnitKey || (t.subUnitKey ?? null) !== (row.subUnitKey ?? null)) fail(`RPM target scope mismatch: ${row.questionUid}`);
  if (s.curriculum !== t.curriculum || s.scope !== t.scope) {
    const rank = grade => ({ 중1: 1, 중2: 2, 중3: 3, 고1: 4, 고2: 5, 고3: 6, M1: 1, M2: 2, M3: 3, H1: 4, H2: 5, H3: 6 })[grade] || 0;
    if (row.semanticScopeRelation !== "PREREQUISITE_LOWER_GRADE" || !rank(semantic.doc.grade) || rank(semantic.doc.grade) >= rank(target.doc.grade)) fail(`invalid prerequisite semantic scope: ${row.questionUid}`);
  }
  return withTargetParent({ L1: requireText(t.rpmPath?.majorUnit, "target RPM L1"), L2: requireText(t.rpmPath?.midUnit, "target RPM L2"),
    L3: requireText(s.rpmPath?.l3, "semantic RPM L3"), L4: requireText(s.rpmPath?.l4, "semantic RPM L4") });
}

// The caller first binds the complete source file to expectedSourceBlobSha1.
// Hashes supplied by a request are assertions, never the fingerprint authority.
export function validateReviewedSourceFingerprints({ question: q, metadata, identity, patch }) {
  const uid = metadata.questionUid;
  const sourceFingerprint = digest(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
  const contentFingerprint = digest(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null }));
  const requested = Object.hasOwn(patch.after, "sourceFingerprint");
  if (requested) {
    for (const [key, value] of Object.entries({ sourceFingerprint, contentFingerprint })) {
      if (!Object.hasOwn(patch.after, key) || !Object.hasOwn(patch.before, key)) fail(`fingerprint repair before/after required: ${uid}.${key}`);
      if (!eq(patch.before[key], metadata[key] ?? null)) fail(`fingerprint before mismatch: ${uid}.${key}`);
      if (patch.after[key] !== value) fail(`computed fingerprint mismatch: ${uid}.${key}`);
    }
  }
  if (Object.hasOwn(patch.after, "contentFingerprint") && patch.after.contentFingerprint !== contentFingerprint)
    fail(`computed fingerprint mismatch: ${uid}.contentFingerprint`);
  if ((patch.after.sourceFingerprint ?? metadata.sourceFingerprint) !== sourceFingerprint) fail(`source fingerprint drift: ${uid}`);
  if (patch.identityBefore !== undefined) {
    const before = patch.identityBefore;
    if (!before || typeof before !== "object" || Array.isArray(before) || Object.keys(before).length !== 1 ||
        !Object.hasOwn(before, "sourceFingerprint") || before.sourceFingerprint !== identity.sourceFingerprint)
      fail(`identity fingerprint before mismatch: ${uid}`);
  }
  const identityChanged = identity.sourceFingerprint !== sourceFingerprint;
  if (identityChanged && (!requested || patch.identityBefore === undefined)) fail(`identity fingerprint before required: ${uid}`);
  return { sourceFingerprint, contentFingerprint, identityChanged,
    identityAfter: identityChanged ? { ...identity, sourceFingerprint } : { ...identity } };
}

// FINAL_QA source-only rebind guard. `approval.sourceRebind.priorReceiptRef` names the SHA-bound registration receipt whose
// per-question records the current metadata rows must still equal exactly. Nothing but the source binding, the metadata
// revision and the approval evidence list may change; approval provenance (type, fieldStatus, EVIDENCE_DEBT) stays as registered.
function loadSourceRebindPrior({ req, source, bytes, rows, read, evidenceRefs }) {
  const spec = req.approval.sourceRebind, ref = spec?.priorReceiptRef;
  if (req.approval.type !== "FINAL_QA" || req.registryChanges?.length) fail("sourceRebind requires FINAL_QA without registryChanges");
  if (!ref || !/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[^/]+\.json$/.test(ref.path || "") ||
      !req.approval.evidenceRefs.some(e => e.path === ref.path && e.sha256 === ref.sha256)) fail("sourceRebind priorReceiptRef must be an approval evidence ref");
  evidenceRefs([ref]);
  const prior = read(ref.path);
  if (prior.schemaVersion !== "archive-reviewed-exam-meta-registration-v2" || prior.metadataRegistrationStatus !== "REGISTERED" ||
      prior.examUid !== req.examUid || prior.sourceArchiveFile !== source || prior.totalQuestions !== rows.length ||
      !Array.isArray(prior.appliedRecords) || prior.appliedRecords.length !== rows.length) fail("sourceRebind prior receipt does not match this exam");
  if (prior.sourceRawSha256 === digest(bytes)) fail("sourceRebind unnecessary: source bytes equal the prior receipt");
  // The prior receipt must be a real registration receipt that the current approved rows were registered from.
  if (prior.requestId !== path.basename(ref.path, ".json") || rows.some(r => !approved(r) || !(r.approvalEvidence || []).includes(ref.path)))
    fail("sourceRebind prior receipt is not the registration of the current approved rows");
  return { receipt: prior, records: unique(prior.appliedRecords, "questionUid", "prior receipt UID") };
}

export function registerReviewedExamV2({ root, request: req, write = false, verifyProjection = false }) {
  if (req.schemaVersion !== "archive-reviewed-exam-meta-register-request-v2") fail("request schema mismatch");
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(req.requestId || "")) fail("valid requestId required");
  requireText(req.examUid, "examUid");
  if (!["REVIEW2", "FINAL_QA", "META_PIPELINE_AUDIT"].includes(req.approval?.type) || req.approval.metadataReviewed !== true) fail("metadata approval required");
  if (req.approval.type === "REVIEW2" && req.approval.reviewPassCount !== 2) fail("REVIEW2 count must be 2");
  requireText(req.approval.approvedBy, "approvedBy");
  const evidenceRefs = refs => {
    if (!Array.isArray(refs) || !refs.length) fail("evidenceRefs required");
    for (const ref of refs) {
      if (!/^[a-f0-9]{64}$/.test(ref.sha256 || "")) fail("evidence SHA-256 required");
      const full = safePath(root, ref.path);
      if (!fs.existsSync(full) || digest(fs.readFileSync(full)) !== ref.sha256) fail(`evidence missing/drift: ${ref.path}`);
    }
  };
  evidenceRefs(req.approval.evidenceRefs);
  if (!Array.isArray(req.items) || req.registryChanges !== undefined && !Array.isArray(req.registryChanges)) fail("items/registryChanges must be arrays");
  for (const item of req.items) evidenceRefs(item.evidenceRefs);
  for (const change of req.registryChanges || []) evidenceRefs(change.evidenceRefs);
  const source = requireText(req.sourceArchiveFile, "sourceArchiveFile");
  if (!source.endsWith(".js") || source.startsWith("archive/") || source.startsWith("exams/")) fail("sourceArchiveFile must be archive/exams-relative");
  const bytes = fs.readFileSync(safePath(root, `archive/exams/${source}`));
  const blob = fs.existsSync(path.join(root, ".git"))
    ? execFileSync("git", ["hash-object", "--path", `archive/exams/${source}`, "--stdin"], { cwd: root, input: bytes, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim()
    : crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
  if (req.expectedSourceBlobSha1 !== blob) fail("source Git blob drift");
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || !Number.isInteger(req.expectedQuestionCount) || bank.length !== req.expectedQuestionCount || !bank.length) fail("source denominator mismatch");
  const metaPipelineAudit = validateMetaPipelineAudit({ root, approval: req.approval, source, sourceBytes: bytes, sourceBlobSha1: blob,
    bank, expectedQuestionCount: req.expectedQuestionCount, items: req.items, registryChanges: req.registryChanges || [],
    requestId: req.requestId, requestSha256: digest(stable(req)) });
  const read = file => JSON.parse(fs.readFileSync(safePath(root, file), "utf8"));
  const metadata = read(META), identity = read(IDENTITY);
  const metadataByUid = unique(metadata.records, "questionUid", "metadata UID");
  unique(metadata.records, r => `${r.sourceArchiveFile}#${r.sourceOrdinal}`, "metadata source ordinal");
  const ids = unique(identity.records, "questionUid", "identity UID");
  const rows = metadata.records.filter(r => r.sourceArchiveFile === source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  const patches = unique(req.items || [], "questionUid", "request UID");
  if (rows.length !== bank.length || patches.size !== bank.length || identity.records.filter(r => r.sourceArchiveFile === source).length !== bank.length) fail("UID denominator mismatch");
  const requestSha256 = digest(stable(req));
  const receiptPath = `${RECEIPTS}/${req.requestId}.json`;
  const receiptFull = safePath(root, receiptPath);
  const previous = fs.existsSync(receiptFull) ? read(receiptPath) : null;
  if (previous && previous.requestSha256 !== requestSha256) fail("requestId reused with different content");
  if (previous) {
    for (const record of previous.appliedRecords) if (!eq(rows.find(r => r.questionUid === record.questionUid), record)) fail(`registered metadata drift: ${record.questionUid}`);
    for (const record of previous.appliedIdentityRecords || []) if (!eq(ids.get(record.questionUid), record)) fail(`registered identity drift: ${record.questionUid}`);
    const currentPlan = registryPlan(root, [], evidenceRefs), currentTables = lookup(currentPlan);
    for (const record of previous.approval?.sourceRebind ? [] : previous.appliedRecords.filter(r => !isTypeHoldRecord(r))) {
      const r = resolve(record, currentTables, { allowConditionDebt: metaPipelineAudit?.conditionDebtUids.includes(record.questionUid) });
      const labels = labelsFor(root, patches.get(record.questionUid), record, r, read, blob, { registeredReplay: true });
      for (const [key, value] of Object.entries(labels)) if (record[key] !== value) fail(`registered canonical label drift: ${record.questionUid}.${key}`);
    }
    const allRuntime = fs.readdirSync(safePath(root, "archive/data/meta-foundation/runtime")).filter(n => n.endsWith(".json") && n !== "runtime-bridge-receipt.json").flatMap(n => read(`archive/data/meta-foundation/runtime/${n}`).records || []);
    for (const record of previous.runtimeRecords) {
      const found = allRuntime.filter(r => r.questionUid === record.questionUid);
      if (found.length !== 1 || !eq(found[0], record)) fail(`registered runtime drift: ${record.questionUid}`);
    }
    const consumerLanes = verifyProjection ? verifyConsumer(root, previous.appliedRecords, previous.runtimeRecords, read) : null;
    return { status: "PASS", requestId: req.requestId, totalQuestions: rows.length, replay: true, plannedPaths: [],
      consumerSearchStatus: verifyProjection ? "STATIC_VALUES_VERIFIED" : "NOT_RUN", browserStatus: "NOT_RUN",
      ...(consumerLanes ? { consumerLanes } : {}) };
  }
  if (verifyProjection) fail("registration receipt required before --verify-projection");
  const targetUids = new Set(rows.map(r => r.questionUid));
  const plan = registryPlan(root, req.registryChanges || [], evidenceRefs);
  const tables = lookup(plan);
  tables.received = loadReceivedValues(root);
  const baseline = req.registryChanges?.length || metaPipelineAudit ? registryPlan(root, [], evidenceRefs) : null;
  const beforeTables = baseline ? lookup(baseline) : null;
  const existingConceptReviews = unique(req.approval.metaPipelineAudit?.existingConceptReviews || [], "conceptKey", "existing CrossConcept review");
  validateMetaPipelineRegistry({ root, audit: metaPipelineAudit?.audit, parentBindingCorrection: metaPipelineAudit?.parentBindingCorrection,
    parentBindingCorrectionRef: metaPipelineAudit?.parentBindingCorrectionRef, beforeTables, afterTables: tables,
    registryChanges: req.registryChanges || [], existingConceptReviews, items: req.items });
  for (const change of req.registryChanges || []) {
    const row = change.after;
    if (change.path === MASTER && row?.keyType === "subUnitKey" && ["active", "ACTIVE"].includes(row.status)) {
      if (tables.master.get(row.standardUnitKey || row.parentKey)?.keyType !== "standardUnitKey" || row.parentKey && row.standardUnitKey && row.parentKey !== row.standardUnitKey) fail(`subunit parent mismatch: ${row.key}`);
    }
  }
  // A shared definition may evolve only when it leaves all out-of-scope approved
  // consumers identical. Migrations involving another exam need its own request.
  if (req.registryChanges?.length) {
    for (const row of metadata.records.filter(r => !targetUids.has(r.questionUid) && approved(r))) {
      const signature = t => {
        const refs = [t.pt.get(row.problemTypeKey), t.tpl.get(row.templateKey), t.master.get(row.standardUnitKey), t.master.get(row.subUnitKey),
          ...(row.crossConceptKeys || []).map(k => t.cc.get(k)), ...(row.conditionKeys || []).map(k => t.cond.get(k)),
          // A binding is looked up by its exact standardCourse (see resolve()); a binding for another course alias
          // (e.g. "중3 수학" next to "중3-1") is not a consumer of this row and must not count as a change of it.
          ...[...t.bindings.values()].filter(b => b.curriculum === (row.curriculum || row.curriculumKey) && b.standardCourse === (row.standardCourse || row.courseKey) && b.standardUnitKey === row.standardUnitKey && (b.subUnitKey ?? null) === (row.subUnitKey ?? null) && b.problemTypeKey === row.problemTypeKey)];
        return stable(refs);
      };
      if (signature(beforeTables) !== signature(tables)) fail(`registry change affects out-of-scope approved UID: ${row.questionUid}`);
      const p = beforeTables.pt.get(row.problemTypeKey);
      if (p) {
        const was = beforeTables.packs.get(p.ownerPack)?.meta;
        const now = tables.packs.get(p.ownerPack)?.meta;
        const c = row.curriculum || row.curriculumKey, course = row.standardCourse || row.courseKey;
        if (was?.curricula?.includes(c) && !now?.curricula?.includes(c) || was?.standardCourses?.includes(course) && !now?.standardCourses?.includes(course)) fail(`registry scope change affects out-of-scope UID: ${row.questionUid}`);
      }
    }
  }
  const runtimeRoot = "archive/data/meta-foundation/runtime";
  const runtimes = new Map();
  for (const name of fs.readdirSync(safePath(root, runtimeRoot)).filter(n => n.endsWith(".json") && n !== "runtime-bridge-receipt.json")) {
    const file = `${runtimeRoot}/${name}`, data = read(file);
    if (!data.packId || !Array.isArray(data.records) || runtimes.has(data.packId)) fail(`runtime pack malformed/duplicate: ${file}`);
    runtimes.set(data.packId, { file, data });
  }
  const owners = new Map();
  for (const [pack, item] of runtimes) for (const r of item.data.records) {
    if (owners.has(r.questionUid)) fail(`duplicate runtime UID: ${r.questionUid}`);
    owners.set(r.questionUid, pack);
  }
  const touched = new Set(), applied = [], runtimeRecords = [], appliedIdentityRecords = [], fingerprintRepairs = [];
  const extensionUsage = new Map();
  let identityChanged = false;
  // Source-only rebind (2026-11-02): re-bind an already registered receipt to changed source bytes without
  // touching any metadata value. The prior receipt (SHA-bound) must equal the current metadata row for row.
  const rebindPrior = req.approval.sourceRebind ? loadSourceRebindPrior({ req, source, bytes, rows, read, evidenceRefs }) : null;
  for (let i = 0; i < bank.length; i++) {
    const current = rows[i], patch = patches.get(current.questionUid), q = JSON.parse(JSON.stringify(bank[i]));
    const id = ids.get(current.questionUid);
    if (!patch || patch.sourceOrdinal !== i + 1 || current.sourceOrdinal !== i + 1 || id?.sourceArchiveFile !== source || id.sourceOrdinal !== i + 1) fail(`UID/source ordinal mismatch #${i + 1}`);
    if (q.questionUid && q.questionUid !== current.questionUid) fail(`source UID mismatch #${i + 1}`);
    evidenceRefs(patch.evidenceRefs);
    requireText(patch.reason, `UID ${current.questionUid} semantic reason`);
    if (!patch.after || typeof patch.after !== "object" || Array.isArray(patch.after) || !patch.before || typeof patch.before !== "object" || Array.isArray(patch.before)) fail(`before/after required: ${current.questionUid}`);
    if (rebindPrior) {
      if (Object.keys(patch.before).length || Object.keys(patch.after).length) fail(`source rebind must not change values: ${current.questionUid}`);
      const prior = rebindPrior.records.get(current.questionUid);
      // The only value change tolerated since the prior receipt is the later 5-level difficulty intake
      // (register-difficulty5.mjs), which only fills a difficultyBucket the receipt recorded as null.
      const diff5Fields = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];
      const withoutDiff5 = row => Object.fromEntries(Object.entries(row || {}).filter(([k]) => !diff5Fields.includes(k)));
      const diff5Filled = prior && !Number.isInteger(prior.difficultyBucket) && Number.isInteger(current.difficultyBucket);
      if (!prior || prior.sourceOrdinal !== i + 1 || !eq(diff5Filled ? withoutDiff5(current) : current, diff5Filled ? withoutDiff5(prior) : prior))
        fail(`source rebind: metadata differs from prior receipt: ${current.questionUid}`);
      // The tolerated difficulty fields must have the exact shape register-difficulty5.mjs writes.
      if (diff5Filled && !(current.difficultyBucket >= 1 && current.difficultyBucket <= 5 &&
          ["high", "medium", "low"].includes(current.difficultyConfidence) &&
          ["NONE", "B12", "B23", "B34", "B45"].includes(current.difficultyBoundaryFlag) &&
          current.legacyLevelCompatibility === computeLegacyCompat(current.level, current.difficultyBucket)))
        fail(`source rebind: difficulty fields are not a valid difficulty5 intake result: ${current.questionUid}`);
      const resolvedPrior = resolve(current, tables);
      for (const f of sourceFields) if (Object.hasOwn(q, f) && !eq(q[f], current[f]) &&
          !(f === "subUnit" && q.subUnit === resolvedPrior.sub?.labelKo)) fail(`source rebind: source/approved metadata parity: ${current.questionUid}.${f}`);
      const checkedPrior = validateReviewedSourceFingerprints({ question: q, metadata: current, identity: id, patch });
      if (checkedPrior.identityChanged || checkedPrior.sourceFingerprint !== current.sourceFingerprint ||
          current.contentFingerprint != null && checkedPrior.contentFingerprint !== current.contentFingerprint) fail(`source rebind: question text fingerprint drift: ${current.questionUid}`);
      appliedIdentityRecords.push(structuredClone(id));
      const packIdPrior = resolvedPrior.pack.meta.packId;
      const finalPrior = { ...structuredClone(current), approvalEvidence: [...new Set([...(current.approvalEvidence || []), receiptPath])],
        metadataRevision: `meta-foundation:${resolvedPrior.pack.meta.packId}@${resolvedPrior.pack.meta.packVersion}:exam-${req.approval.type.toLowerCase()}-v2:${req.requestId}` };
      const existingRuntime = (runtimes.get(owners.get(current.questionUid))?.data.records || []).find(r => r.questionUid === current.questionUid);
      const rrPrior = { ...finalPrior, sourceQuestionNo: String(q.sourceQuestionNo ?? q.id ?? ""), sourceIdentity: `${source}#${i + 1}`,
        approvedSourceFingerprint: checkedPrior.sourceFingerprint, legacyLevel: finalPrior.level,
        runtimeSelectable: finalPrior.defaultSelectable && finalPrior.curriculumApplicability === "DEFAULT_SCOPE" };
      if (owners.get(current.questionUid) !== packIdPrior || !existingRuntime ||
          !eq(diff5Filled ? withoutDiff5({ ...existingRuntime, metadataRevision: rrPrior.metadataRevision, approvalEvidence: rrPrior.approvalEvidence }) : { ...existingRuntime, metadataRevision: rrPrior.metadataRevision, approvalEvidence: rrPrior.approvalEvidence },
            diff5Filled ? withoutDiff5(rrPrior) : rrPrior))
        fail(`source rebind: runtime record differs from prior registration: ${current.questionUid}`);
      const rtPrior = runtimes.get(packIdPrior).data;
      rtPrior.records = rtPrior.records.filter(r => r.questionUid !== current.questionUid); rtPrior.records.push(rrPrior);
      touched.add(packIdPrior);
      Object.assign(current, finalPrior); applied.push(structuredClone(finalPrior)); runtimeRecords.push(rrPrior);
      continue;
    }
    for (const [field, value] of Object.entries(patch.before)) if (!valueFields.has(field) || !eq(current[field] ?? null, value)) fail(`before mismatch: ${current.questionUid}.${field}`);
    for (const [field, value] of Object.entries(patch.after)) {
      if (!valueFields.has(field)) fail(`unapproved field: ${field}`);
      if (!Object.hasOwn(patch.before, field)) fail(`before required: ${current.questionUid}.${field}`);
    }
    const final = { ...current, ...structuredClone(patch.after) };
    if (patch.fieldCandidates !== undefined) {
      if (req.approval.type !== "REVIEW2") fail(`fieldCandidates requires REVIEW2: ${current.questionUid}`);
      validateFieldCandidates(root, tables, patch.fieldCandidates, current.questionUid);
      // Append-only: nothing already stored is removed or changed; new entries are added.
      const merged = structuredClone(current.fieldCandidates || {});
      for (const [field, list] of Object.entries(patch.fieldCandidates)) {
        merged[field] = merged[field] || [];
        for (const c of list) if (!merged[field].some(x => eq(x, c))) merged[field].push(c);
      }
      final.fieldCandidates = merged;
    }
    if (req.approval.type === "META_PIPELINE_AUDIT" && metaPipelineAudit?.inputAuditVariant === "sop_v12_corrective_review" &&
        !eq(final.conditionKeys ?? null, current.conditionKeys ?? null))
      fail(`SOP_v1.2 audit has no Condition evidence; existing conditionKeys must be preserved: ${current.questionUid}`);
    for (const f of sourceFields) if (Object.hasOwn(q, f) && !eq(q[f], final[f]) &&
        // REVIEW2: a source that carries an empty PT/TPL placeholder (null/"") is consistent with PT/TPL staying unregistered and with a first registration of a resolved PT/TPL (nothing registered yet to overwrite).
        !(req.approval.type === "REVIEW2" && ["problemTypeKey", "templateKey"].includes(f) && (q[f] === null || q[f] === "") && !current[f])) {
      const preservesApprovedAuditValue = req.approval.type === "META_PIPELINE_AUDIT" && approved(current) &&
        eq(current[f] ?? null, final[f] ?? null);
      const sopAuditedRecord = req.approval.type === "META_PIPELINE_AUDIT" && metaPipelineAudit?.inputAuditVariant === "sop_v12_corrective_review"
        ? metaPipelineAudit.audit.records.find(record => Number(record.questionId) === i + 1) : null;
      const sopAssignmentRebind = Boolean(sopAuditedRecord) && ["standardUnitKey", "subUnitKey"].includes(f) &&
        eq(q[f] ?? null, sopAuditedRecord.auditedClassification[f]) &&
        eq(final[f], sopAuditedRecord.auditedClassification[f === "standardUnitKey" ? "correctedStandardUnitKey" : "correctedSubUnitKey"]);
      const pendingNamespaceCorrection = Boolean(sopAuditedRecord) &&
        isSopPendingSourceNamespaceCorrectionAllowed({ field: f, current, question: q, patch, final,
          audited: sopAuditedRecord.auditedClassification, resolved: resolve(final, tables) });
      if (!preservesApprovedAuditValue && !sopAssignmentRebind && !pendingNamespaceCorrection && !(req.approval.type === "META_PIPELINE_AUDIT" && isPendingMetaPlaceholder(q, f, final[f])) &&
          !canRebindPendingAuditMetadata({ approvalType: req.approval.type, metaPipelineAudit, beforeTables, current, question: q, patch, final, ordinal: i + 1, field: f }))
        fail(`source/approved metadata parity: ${current.questionUid}.${f}`);
    }
    const checked = validateReviewedSourceFingerprints({ question: q, metadata: current, identity: id, patch });
    const fingerprint = checked.sourceFingerprint;
    if (checked.identityChanged || Object.hasOwn(patch.after, "sourceFingerprint")) fingerprintRepairs.push({
      questionUid: current.questionUid, sourceOrdinal: i + 1,
      metadataBefore: { sourceFingerprint: current.sourceFingerprint ?? null, contentFingerprint: current.contentFingerprint ?? null },
      identityBefore: { sourceFingerprint: id.sourceFingerprint },
      after: { sourceFingerprint: checked.sourceFingerprint, contentFingerprint: checked.contentFingerprint }
    });
    if (checked.identityChanged) { Object.assign(id, checked.identityAfter); identityChanged = true; }
    appliedIdentityRecords.push(structuredClone(id));
    // REVIEW2 only: a source that does not carry `level` at all may stay without one (nothing is invented); a carried value must still be valid.
    const reviewTwoLevelAbsent = req.approval.type === "REVIEW2" && !Object.hasOwn(q, "level") && (final.level === undefined || final.level === null || final.level === "");
    if (!reviewTwoLevelAbsent && !["하", "중", "상"].includes(final.level)) fail(`level invalid: ${current.questionUid}`);
    const debtRows = req.approval.type === "META_PIPELINE_AUDIT" ? (req.approval.metaPipelineAudit.unreviewedFields || []) : [];
    let difficultyEvidenceDebt = null;
    if (!Number.isInteger(final.difficultyBucket) || final.difficultyBucket < 1 || final.difficultyBucket > 5) {
      const debt = debtRows.find(row => row.field === "difficultyBucket" && row.status === "EVIDENCE_DEBT");
      const currentBucket = current.difficultyBucket;
      const currentBucketValid = Number.isInteger(currentBucket) && currentBucket >= 1 && currentBucket <= 5;
      if (!debt || !requireText(debt.reason, "difficultyBucket EVIDENCE_DEBT reason") || patch.after.difficultyBucket !== null ||
          !Array.isArray(debt.questionUids) || !debt.questionUids.includes(current.questionUid) ||
          currentBucketValid || Object.hasOwn(q, "difficultyBucket")) fail(`difficultyBucket invalid without explicit META_PIPELINE_AUDIT EVIDENCE_DEBT: ${current.questionUid}`);
      final.difficultyBucket = null;
      difficultyEvidenceDebt = debt.reason;
    }
    let integrationPatternEvidenceDebt = null;
    if (final.integrationPattern === null || final.integrationPattern === undefined || final.integrationPattern === "") {
      const debt = debtRows.find(row => row.field === "integrationPattern" && row.status === "EVIDENCE_DEBT");
      if (req.approval.type !== "META_PIPELINE_AUDIT" || !debt || !requireText(debt.reason, "integrationPattern EVIDENCE_DEBT reason") ||
          !Array.isArray(debt.questionUids) || !debt.questionUids.includes(current.questionUid) ||
          patch.after.integrationPattern !== null || Object.hasOwn(q, "integrationPattern"))
        requireText(final.integrationPattern, "integrationPattern (explicit NONE if not applicable)");
      integrationPatternEvidenceDebt = debt.reason;
    } else requireText(final.integrationPattern, "integrationPattern");
    if (patch.typeHold !== undefined) {
      // REVIEW2 only: register unit/sub-unit (and the judged CrossConcept/Condition/Integration) of a question whose type path cannot be bound.
      // PT/TPL are never guessed: they must be unregistered, stay exactly as they are, and the row keeps an explicit type hold.
      if (patch.typeHold !== true || req.approval.type !== "REVIEW2") fail(`typeHold requires REVIEW2 and true: ${current.questionUid}`);
      if (current.problemTypeKey || current.templateKey) fail(`typeHold only for unregistered PT/TPL: ${current.questionUid}`);
      for (const k of ["problemTypeKey", "templateKey", "L3", "L4", "rpmL3", "rpmL4"]) if (Object.hasOwn(patch.after, k)) fail(`typeHold must not set ${k}: ${current.questionUid}`);
      const held = resolveUnitOnly(final, tables);

      // With a basicScopeParentRef (same evidence the full path accepts) L1/L2 are the verified basic-scope parent labels the Consumer exposes.
      const labels = patch.basicScopeParentRef
        ? (({ L1, L2 }) => ({ L1, L2 }))(labelsFor(root, patch, final, { course: held.course, curriculum: held.curriculum, binding: {}, unit: held.unit, sub: held.sub,
            pt: { canonicalLabelKo: "" }, tpl: { canonicalLabelKo: "" }, pack: null }, read, blob))
        : { L1: held.unit.labelKo, L2: held.sub?.labelKo || "" };
      for (const [field, label] of Object.entries(labels)) {
        if (Object.hasOwn(patch.after, field) && patch.after[field] !== label) fail(`canonical label mismatch: ${current.questionUid}.${field}`);
        if (approved(current) && current[field] !== label && !Object.hasOwn(patch.before, field)) fail(`before required for derived label: ${current.questionUid}.${field}`);
        final[field] = label;
      }
      const holdFieldStatus = { ...(current.fieldStatus || {}), ...Object.fromEntries(["standardUnit", "subUnit", "crossConcept", "condition", "integrationPattern"].map(k => [k, "approved_review2"])),
        problemType: "manual_review_pending", template: "manual_review_pending" };
      Object.assign(final, { curriculum: held.curriculum, curriculumKey: held.curriculum, standardCourse: held.course, courseKey: final.courseKey || held.course,
        reviewStatus: "reviewed_pass", metadataStatus: "approved_partial_with_explicit_holds", metadataApprovalType: "REVIEW2",
        metadataRevision: `archive-review2-type-hold-v2:${req.requestId}`, tagStatus: "reviewed_pass", tagConfidence: "independent_review2",
        metaFoundationHoldReason: "TYPE_PATH_UNBOUND_UNIT_SUB_ONLY", l3Disposition: "HOLD", l4Disposition: "HOLD",
        curriculumApplicability: final.curriculumApplicability || "DEFAULT_SCOPE", defaultSelectable: final.defaultSelectable !== false,
        approvalEvidence: [...new Set([...(current.approvalEvidence || []), receiptPath])], fieldStatus: holdFieldStatus });
      Object.assign(current, final); applied.push(structuredClone(final));
      continue;
    }
    const resolved = resolve(final, tables, { allowConditionDebt: metaPipelineAudit?.conditionDebtUids.includes(current.questionUid) }), { pt, tpl, unit, sub, pack, curriculum, course } = resolved;
    for (const use of resolved.extensions) {
      const seen = extensionUsage.get(use.key) || { ...use, questionUids: [] };
      seen.questionUids.push(current.questionUid);
      extensionUsage.set(use.key, seen);
    }
    for (const [field, label] of Object.entries(labelsFor(root, patch, final, resolved, read, blob))) {
      if (Object.hasOwn(patch.after, field) && patch.after[field] !== label) fail(`canonical label mismatch: ${current.questionUid}.${field}`);
      if (approved(current) && current[field] !== label && !Object.hasOwn(patch.before, field)) fail(`before required for derived label: ${current.questionUid}.${field}`);
      final[field] = label;
    }
    const revision = `meta-foundation:${pack.meta.packId}@${pack.meta.packVersion}:exam-${req.approval.type.toLowerCase()}-v2:${req.requestId}`;
    const confidence = req.approval.type === "REVIEW2" ? "independent_review2" :
      req.approval.type === "META_PIPELINE_AUDIT" ? "meta_pipeline_audit" : "approved_final_qa";
    const fieldApproval = req.approval.type === "REVIEW2" ? "approved_review2" :
      req.approval.type === "META_PIPELINE_AUDIT" ? "approved_meta_pipeline_audit" : "approved_final_qa";
    const sopV12Variant = metaPipelineAudit?.inputAuditVariant === "sop_v12_corrective_review";
    const approvedFields = req.approval.type === "META_PIPELINE_AUDIT"
      ? ["standardUnit", "subUnit", "concept", "problemType", "template", "crossConcept",
        ...(sopV12Variant ? [] : ["condition"]),
        ...(metaPipelineAudit?.inputAuditVariant === "source_drive_flat_v3" && final.difficultyBucket !== current.difficultyBucket ? ["difficulty"] : [])]
      : ["standardUnit", "subUnit", "concept", "problemType", "template", "crossConcept", "condition", "integrationPattern", "difficulty"];
    const fieldStatus = { ...(current.fieldStatus || {}), ...Object.fromEntries(approvedFields.map(k => [k, fieldApproval])) };
    const targetedRecovery = metaPipelineAudit?.targetedRecovery?.questionUid === current.questionUid
      ? metaPipelineAudit.targetedRecovery : null;
    if (targetedRecovery) {
      fieldStatus.condition = "approved_r2e_targeted_recovery";
      fieldStatus.integrationPattern = "approved_r2e_targeted_recovery";
    }
    const sourceConditionCorrection = metaPipelineAudit?.sourceConditionCorrections.find(row => row.questionUid === current.questionUid);
    if (sourceConditionCorrection) fieldStatus.condition = "approved_source_condition_review";
    const sourceCrossCorrection = metaPipelineAudit?.sourceCrossConceptCorrections.find(row => row.questionUid === current.questionUid);
    if (sourceCrossCorrection) fieldStatus.crossConcept = "approved_source_and_meta_pipeline_audit";
    const targetedAuditCorrection = metaPipelineAudit?.targetedAuditCorrections.find(row => row.questionUid === current.questionUid);
    if (metaPipelineAudit?.auditedIntegrations.some(row => row.questionUid === current.questionUid))
      fieldStatus.integrationPattern = "approved_meta_pipeline_audit";
    if (metaPipelineAudit?.conditionDebtUids.includes(current.questionUid)) fieldStatus.condition = "EVIDENCE_DEBT";
    const manualFieldHoldRemains = Object.values(fieldStatus).includes("manual_review_pending");
    const priorPartialHoldResolved = current.reviewStatus === "manual_review" &&
      current.metadataStatus === "approved_partial_with_explicit_holds" &&
      Object.values(current.fieldStatus || {}).includes("manual_review_pending") && !manualFieldHoldRemains;
    const preserveManualStatus = manualFieldHoldRemains || current.reviewStatus === "manual_review" && !priorPartialHoldResolved;
    const preserveApprovedPartialStatus = manualFieldHoldRemains ||
      req.approval.type !== "META_PIPELINE_AUDIT" && current.reviewStatus === "manual_review" && !priorPartialHoldResolved;
    const metadataStatus = preserveApprovedPartialStatus
      ? (req.approval.type === "META_PIPELINE_AUDIT" && manualFieldHoldRemains &&
          !String(current.metadataStatus || "").startsWith("approved_")
        ? "approved_partial_with_explicit_holds" : current.metadataStatus)
      : "approved_semantic_review";
    const approvalEvidence = metaPipelineAudit
      ? [receiptPath, req.approval.metaPipelineAudit.auditPackageRef.path, req.approval.metaPipelineAudit.manifestRef.path, req.approval.metaPipelineAudit.sourceParityRef.path,
        ...(targetedRecovery ? [targetedRecovery.ref.path] : []),
        ...(sourceConditionCorrection ? [sourceConditionCorrection.ref.path] : []),
        ...(sourceCrossCorrection ? [sourceCrossCorrection.ref.path] : []),
        ...(targetedAuditCorrection ? [targetedAuditCorrection.ref.path] : []),
        ...(sopV12Variant ? [req.approval.metaPipelineAudit.correctiveReviewRef.path] : [])]
      : [receiptPath];
    Object.assign(final, { curriculum, curriculumKey: curriculum, standardCourse: course, courseKey: final.courseKey || course,
      reviewStatus: req.approval.type === "META_PIPELINE_AUDIT"
        ? (Object.hasOwn(q, "reviewStatus") ? q.reviewStatus : current.reviewStatus)
        : (preserveManualStatus ? current.reviewStatus : "reviewed_pass"),
      metadataStatus, metadataRevision: revision,
      metadataApprovalType: req.approval.type,
      tagStatus: req.approval.type === "META_PIPELINE_AUDIT"
        ? (Object.hasOwn(q, "tagStatus") ? q.tagStatus : current.tagStatus)
        : (preserveManualStatus ? current.tagStatus : "reviewed_pass"),
      tagConfidence: req.approval.type === "META_PIPELINE_AUDIT"
        ? (Object.hasOwn(q, "tagConfidence") ? q.tagConfidence : (current.tagConfidence ?? confidence))
        : confidence,
      foundationTaxonomyStatus: "CONFIRMED", projectionStatus: "REUSE", metaFoundationStatus: "ACTIVE",
      metaFoundationPackId: pack.meta.packId, metaFoundationPackVersion: pack.meta.packVersion,
      metaFoundationHoldReason: preserveApprovedPartialStatus ? current.metaFoundationHoldReason ?? null : null,
      l3Disposition: "ASSIGNED", l4Disposition: "ASSIGNED", curriculumApplicability: final.curriculumApplicability || "DEFAULT_SCOPE",
      defaultSelectable: final.defaultSelectable !== false, approvalEvidence: [...new Set([...(current.approvalEvidence || []), ...approvalEvidence])],
      fieldStatus
    });
    const updateState = final.registrationUpdateState;
    if (req.approval.type === "META_PIPELINE_AUDIT" &&
        updateState?.schemaVersion === "JS_ARCHIVE_EXISTING_TARGET_META_DELTA_POLICY_V1" &&
        ["PHYSICAL_META_UPDATED_REVIEW_RESET_PENDING", "R1_RPM_DEBT_EVIDENCE_BOUND_REVIEW_PENDING"].includes(updateState.disposition)) {
      final.registrationUpdateState = {
        ...updateState,
        disposition: "META_PIPELINE_AUDIT_REGISTERED",
        metaPipelineAuditCompletion: {
          requestId: req.requestId,
          auditPackagePath: req.approval.metaPipelineAudit.auditPackageRef.path,
          auditPackageSha256: req.approval.metaPipelineAudit.auditPackageRef.sha256,
          sourceParitySha256: req.approval.metaPipelineAudit.sourceParityRef.sha256
        }
      };
    }
    if (difficultyEvidenceDebt) {
      final.fieldStatus.difficulty = "EVIDENCE_DEBT";
      final.difficultyEvidenceDebt = { field: "difficultyBucket", status: "EVIDENCE_DEBT", reason: difficultyEvidenceDebt };
    }
    if (integrationPatternEvidenceDebt) {
      final.fieldStatus.integrationPattern = "EVIDENCE_DEBT";
      final.integrationPatternEvidenceDebt = { field: "integrationPattern", status: "EVIDENCE_DEBT", reason: integrationPatternEvidenceDebt };
    }
    if (metaPipelineAudit?.conditionDebtUids.includes(current.questionUid)) {
      const debt = req.approval.metaPipelineAudit.unreviewedFields.find(row => row.field === "conditionKeys" && row.questionUids.includes(current.questionUid));
      final.conditionKeysEvidenceDebt = { field: "conditionKeys", status: "EVIDENCE_DEBT", reason: debt.reason };
    }
    const packId = pack.meta.packId;
    if (!runtimes.has(packId)) {
      const file = `${runtimeRoot}/${slug(packId)}-v1.json`;
      if (fs.existsSync(safePath(root, file))) fail(`runtime output path conflict: ${file}`);
      runtimes.set(packId, { file, data: { schemaVersion: "meta-foundation-runtime-v1", status: "ACTIVE", packId, packVersion: pack.meta.packVersion,
        runtimeVersion: `${packId}@${pack.meta.packVersion}/reviewed-exam-v2`, counts: {}, records: [], taxonomyRows: [], ownedScopes: [] } });
    }
    const oldOwner = owners.get(current.questionUid);
    if (oldOwner && oldOwner !== packId) {
      const old = runtimes.get(oldOwner);
      old.data.records = old.data.records.filter(r => r.questionUid !== current.questionUid); touched.add(oldOwner);
    }
    const rr = { ...final, sourceQuestionNo: String(q.sourceQuestionNo ?? q.id ?? ""), sourceIdentity: `${source}#${i + 1}`,
      approvedSourceFingerprint: fingerprint, legacyLevel: final.level,
      runtimeSelectable: final.defaultSelectable && final.curriculumApplicability === "DEFAULT_SCOPE" };
    const rt = runtimes.get(packId).data;
    rt.records = rt.records.filter(r => r.questionUid !== current.questionUid); rt.records.push(rr);
    touched.add(packId);
    Object.assign(current, final); applied.push(structuredClone(final)); runtimeRecords.push(rr);
  }
  for (const [packId, item] of runtimes) for (const row of item.data.records) {
    if (targetUids.has(row.questionUid) || !req.registryChanges?.length) continue;
    // Retiring/removing a native key must also preserve non-approved runtime consumers.
    if (row.problemTypeKey) {
      const old = metadataByUid.get(row.questionUid);
      if (!old) fail(`runtime without metadata: ${row.questionUid}`);
      if (!tables.packs.has(packId) || tables.pt.get(row.problemTypeKey)?.status !== "ACTIVE" || row.templateKey && tables.tpl.get(row.templateKey)?.status !== "ACTIVE") fail(`registry change breaks runtime UID: ${row.questionUid}`);
    }
  }
  for (const packId of touched) {
    const item = runtimes.get(packId);
    if (item.data.records.some(row => targetUids.has(row.questionUid))) {
      item.data.generatedFrom = { ...(item.data.generatedFrom || {}), [`reviewedExam_${req.requestId}`]: receiptPath };
    }
    const version = tables.packs.get(packId)?.meta.packVersion;
    if (version) { item.data.packVersion = version; item.data.runtimeVersion = `${packId}@${version}/reviewed-exam-v2`; }
    item.data.records.sort((a, b) => a.questionUid.localeCompare(b.questionUid, "en"));
    refreshRuntime(item.data);
    plan.output.set(item.file, json(item.data));
  }
  metadata.reviewedPassCount = metadata.records.filter(r => r.reviewStatus === "reviewed_pass").length;
  metadata.counts = { ...(metadata.counts || {}), records: metadata.records.length,
    uidUnique: true, sourceJoinUnique: true, semanticallyReviewed: metadata.records.filter(approved).length };
  if (Object.hasOwn(metadata.counts, "explicitProblemTypeHolds")) metadata.counts.explicitProblemTypeHolds = metadata.records.filter(r => r.fieldStatus?.problemType === "manual_review_pending").length;
  if (Object.hasOwn(metadata.counts, "explicitTemplateHolds")) metadata.counts.explicitTemplateHolds = metadata.records.filter(r => r.fieldStatus?.template === "manual_review_pending").length;
  if (Object.hasOwn(metadata.counts, "explicitDifficultyHolds")) metadata.counts.explicitDifficultyHolds = metadata.records.filter(r => r.fieldStatus?.difficulty === "manual_review_pending").length;
  plan.output.set(META, json(metadata));
  if (identityChanged) {
    // Retain UID, source ordinal, lookups and unrelated identity records.
    const stableIdentity = { ...identity }; delete stableIdentity.generatedAt; delete stableIdentity.identityDigest;
    identity.identityDigest = digest(JSON.stringify(stableIdentity));
    plan.output.set(IDENTITY, JSON.stringify(identity) + "\n");
  }
  const outputDigests = [...plan.output].filter(([file, text]) => file !== META && (!fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text)).map(([file, text]) => ({ path: file, sha256: digest(text) }));
  const receipt = { schemaVersion: "archive-reviewed-exam-meta-registration-v2", requestId: req.requestId, requestSha256,
    examUid: req.examUid, sourceArchiveFile: source, sourceBlobSha1: blob, sourceRawSha256: digest(bytes), approval: req.approval,
    ...(metaPipelineAudit ? { metaPipelineAudit: { schemaVersion: metaPipelineAudit.inputAuditSchemaVersion || metaPipelineAudit.audit.schemaVersion,
      inputAuditVariant: metaPipelineAudit.inputAuditVariant,
      ...(metaPipelineAudit.inputAuditVariant === "source_drive_flat_v3" ? { sourceSchemaNormalization: {
        statistics: metaPipelineAudit.audit.statistics,
        visualEvidence: metaPipelineAudit.audit.records.every(row => row.sourceSchemaVisualEvidence === "NOT_PROVIDED")
          ? "NOT_PROVIDED_IN_SOURCE_SCHEMA" : "PER_RECORD_PROVIDED_STATUS",
        visualEvidenceCounts: {
          checked: metaPipelineAudit.audit.records.filter(row => row.sourceSchemaVisualEvidence === "EXPLICITLY_CHECKED").length,
          notChecked: metaPipelineAudit.audit.records.filter(row => row.sourceSchemaVisualEvidence === "EXPLICITLY_NOT_CHECKED").length,
          notProvided: metaPipelineAudit.audit.records.filter(row => row.sourceSchemaVisualEvidence === "NOT_PROVIDED").length,
        },
        classificationEvidenceAbsent: metaPipelineAudit.audit.records.filter(row => row.classificationReadingEvidenceStatus === "NOT_PROVIDED_AUDIT_EXCERPTS_VERIFIED").length,
      } } : {}),
      ...(metaPipelineAudit.inputAuditVariant === "sop_v12_corrective_review" ? { sopV12CorrectiveReview: {
        schemaVersion: SOP_V12_CORRECTIVE_REVIEW_SCHEMA,
        correctiveReviewSha256: req.approval.metaPipelineAudit.correctiveReviewRef.sha256,
        reviewer: metaPipelineAudit.audit.sopV12.reviewer,
        reviewedAt: metaPipelineAudit.audit.sopV12.reviewedAt,
        excerptBasis: metaPipelineAudit.audit.sopV12.excerptBasis,
        originalDeclaredSourceSha256: metaPipelineAudit.audit.sopV12.originalDeclaredSourceSha256,
        driveSourceSha256: metaPipelineAudit.audit.sopV12.driveSourceSha256,
        productionSourceSha256: metaPipelineAudit.audit.sopV12.productionSourceSha256,
        sourceHashDrift: metaPipelineAudit.audit.sopV12.sourceHashDrift,
        sourceFieldCorrections: (metaPipelineAudit.sourceFieldCorrections || []).map(correction => ({
          questionUid: correction.questionUid,
          field: correction.field,
          originalManifestValue: correction.originalManifestValue,
          currentSourceValue: correction.currentSourceValue,
          reason: correction.reason,
          appliedToManifest: false,
          reviewer: { id: metaPipelineAudit.audit.sopV12.reviewer.id, role: metaPipelineAudit.audit.sopV12.reviewer.role },
          reviewedAt: metaPipelineAudit.audit.sopV12.reviewedAt,
          sourceOrdinal: correction.sourceOrdinal,
        })),
        sourceBytesMutation: "NONE",
        conditionEvidence: "NOT_PRESENT_IN_SOURCE_SCHEMA",
        difficultyBucketSource: "NOT_AUDITED_1_5_BUCKET",
        templateInflation: "NOT_REPORTED_IN_SOURCE_SCHEMA",
        statistics: metaPipelineAudit.audit.statistics,
        visualEvidenceCounts: {
          checked: metaPipelineAudit.audit.records.filter(row => row.readingEvidence?.visualAssetChecked === true).length,
          notChecked: metaPipelineAudit.audit.records.filter(row => row.readingEvidence?.visualAssetChecked === false).length,
          actualTypes: Object.fromEntries(["IMAGE", "SVG", "SVG_IMAGE", "NONE"].map(type =>
            [type, metaPipelineAudit.audit.records.filter(row => row.sourceSchemaVisualType === type).length])),
        },
        auditedDifficultyRanks: metaPipelineAudit.audit.records.map(row => ({ questionId: row.questionId,
          difficultyRank: row.auditedClassification.difficultyRank })),
      } } : {}),
      ...(metaPipelineAudit.classificationRef ? { classificationSha256: metaPipelineAudit.classificationRef.sha256 } : {}),
      sourceFileDriveId: metaPipelineAudit.sourceFileDriveId,
      auditSha256: req.approval.metaPipelineAudit.auditPackageRef.sha256, manifestSha256: req.approval.metaPipelineAudit.manifestRef.sha256,
      sourceParitySha256: req.approval.metaPipelineAudit.sourceParityRef.sha256,
      auditSourceSha256: metaPipelineAudit.audit.sourceSha256,
      driveSourceSha256: metaPipelineAudit.sourceParity.driveSourceSha256,
      productionSourceSha256: metaPipelineAudit.sourceParity.productionSourceSha256,
      sourceHashDrift: metaPipelineAudit.inputAuditVariant === "sop_v12_corrective_review"
        ? metaPipelineAudit.audit.sopV12.sourceHashDrift
        : metaPipelineAudit.sourceParity.driveSourceSha256 !== metaPipelineAudit.audit.sourceSha256 } } : {}),
    metadataRegistrationStatus: "REGISTERED", examFinalQaStatus: "NOT_EVALUATED_BY_REGISTRAR",
    consumerSearchStatus: "NOT_RUN", totalQuestions: applied.length, registryChanges: req.registryChanges || [],
    ...(extensionUsage.size ? { generatedExtensionKeys: [...extensionUsage.values()].sort((x, y) => x.key.localeCompare(y.key, "en")) } : {}),
    appliedRecords: applied, appliedIdentityRecords, fingerprintRepairs, runtimeRecords, outputDigests };
  plan.output.set(receiptPath, json(receipt));
  const changed = [...plan.output].filter(([file, text]) => !fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text);
  if (changed.some(([file]) => file.startsWith("archive/exams/"))) fail("registration must not write exam source bytes");
  if (!eq(fs.readFileSync(safePath(root, `archive/exams/${source}`)), bytes)) fail("exam source bytes changed during registration");
  // All semantic and reference checks precede the first write; restore originals
  // if an I/O failure occurs. CLI dry-run never changes production data.
  if (write) {
    const backup = new Map();
    try {
      for (const [file, text] of changed) {
        const full = safePath(root, file);
        backup.set(full, fs.existsSync(full) ? fs.readFileSync(full) : null);
        fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, text, "utf8");
      }
    } catch (error) {
      for (const [full, bytes] of backup) { if (bytes === null) fs.rmSync(full, { force: true }); else fs.writeFileSync(full, bytes); }
      throw error;
    }
  }
  return { status: "PASS", write, requestId: req.requestId, approvalType: req.approval.type, totalQuestions: applied.length,
    registryChangeCount: req.registryChanges?.length || 0, runtimeMaterialized: runtimeRecords.length,
    fingerprintRepairCount: fingerprintRepairs.length,
    consumerSearchStatus: "NOT_RUN", replay: false, plannedPaths: changed.map(([file]) => file) };
}

// Loads the digest-checked canonical input bundle exactly as the student Consumer
// does and returns the resolved catalog (canonical.resolveCatalog output).
export function loadResolvedConsumerCatalog(root, read = file => JSON.parse(fs.readFileSync(safePath(root, file), "utf8"))) {
  const manifestPath = "archive/data/archive2-canonical-input-manifest.json";
  if (!fs.existsSync(safePath(root, manifestPath))) fail("canonical manifest missing");
  const manifest = read(manifestPath);
  if (manifest.schemaVersion !== "archive2-canonical-input-manifest-v1" || manifest.resolverVersion !== canonical.RESOLVER_VERSION ||
      manifest.projectionVersion !== "archive2-canonical-v1:" + digest(canonical.projectionManifestPayload(manifest.files, manifest.resolverVersion))) fail("canonical manifest version/digest mismatch");
  const files = Object.fromEntries(manifest.files.map(row => [row.path, { sha256: row.sha256 }]));
  if (canonical.MANIFEST_REQUIRED_PATHS.some(p => !files[p])) fail("canonical manifest incomplete");
  const resources = {};
  const load = relative => {
    const repoRelative = path.relative(root, path.resolve(root, "archive", relative)).replaceAll("\\", "/");
    const text = fs.readFileSync(safePath(root, repoRelative), "utf8").replaceAll("\r\n", "\n");
    if (!files[relative] || digest(text) !== files[relative].sha256) fail(`canonical input digest mismatch: ${relative}`);
    resources[relative] = JSON.parse(text);
  };
  const runtimePaths = canonical.runtimeInputPathsFromManifest(manifest.files);
  for (const relative of new Set([...canonical.REQUIRED_INPUT_PATHS, ...runtimePaths])) load(relative);
  for (const relative of canonical.reviewedRegistrationProofPaths(runtimePaths.map(p => resources[p]))) load(relative);
  return canonical.resolveCatalog({ versionBundle: { manifest, projectionVersion: manifest.projectionVersion, files, resources } });
}

// REVIEW2 only: the search index is source-only. A field the exam source does not carry at all (and the index therefore leaves empty)
// is not a mismatch with the registered value. A source value that is carried and differs is still refused.
function reviewTwoSourceLacks(root, r, field, indexValue, cache) {
  const empty = v => v === undefined || v === null || v === "";
  if (!empty(indexValue)) return false;
  const sourceFile = "archive/exams/" + r.sourceArchiveFile;
  let bank = cache.get(sourceFile);
  if (!bank) {
    const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(safePath(root, sourceFile), "utf8"), ctx, { timeout: 5000 });
    bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
    cache.set(sourceFile, bank);
  }
  const q = bank?.[Number(r.sourceOrdinal) - 1];
  return Boolean(q) && empty(q[field]);
}

function verifyConsumer(root, records, runtimeRecords, read) {
  return verifyConsumerValues(root, records, runtimeRecords, loadResolvedConsumerCatalog(root, read));
}

export function verifyConsumerValues(root, records, runtimeRecords, catalog) {
  const decode = v => Array.isArray(v) && v.length === 1 && Number.isInteger(v[0]) && catalog.strings?.[v[0]] !== undefined ? catalog.strings[v[0]] : v;
  const rows = catalog.encoding === "column-dictionary-v1" && Array.isArray(catalog.records[0])
    ? catalog.records.map(r => Object.fromEntries(catalog.columns.map((k, i) => [k, decode(r[i])]))) : catalog.records;
  const byUid = unique(rows, "questionUid", "catalog UID");
  const runtimeByUid = unique(runtimeRecords, "questionUid", "runtime UID");
  const lanes = { canonical: 0, usableMetaLane: 0 };
  let extensionTables = null;
  const hasExtensionKey = r => [...(r.crossConceptKeys || []), ...(r.conditionKeys || [])].some(isExtensionKey);
  for (const r of records) {
    const c = byUid.get(r.questionUid);
    if (!c || c.sourceFile !== r.sourceArchiveFile || c.sourceOrdinal !== r.sourceOrdinal) fail(`Consumer UID missing/mismatch: ${r.questionUid}`);
    // A record the strict canonical resolver does not assign (assignment_missing: no reviewed
    // parent link, a registration row whose source reviewStatus is not reviewed_pass, a native
    // course outside the grade/course allowlist, ...) is deliberately NOT given canonical
    // curriculumKey/PT/TPL by the Consumer, so the canonical columns are empty by design. The
    // Consumer exposes the registered, content-bound values through the usable-meta lane
    // (metaHint*) and the display projection instead. For such a record each empty canonical field
    // is verified against that lane; every field the lane does not carry is verified against the
    // exact active runtime pack row. A canonical value that exists must still equal the request.
    const canonicalMissing = Array.isArray(c.canonicalAssignmentReasons) && c.canonicalAssignmentReasons.includes("assignment_missing");
    const laneBound = canonicalMissing && ["exact", "content"].includes(c.metaBinding);
    const projection = c.metaProjection && c.metaProjection.projectionStatus === "DISPLAY_ONLY_SOURCE_BOUND" ? c.metaProjection : null;
    const lane = {
      curriculumKey: () => c.metaHintCurriculum,
      problemTypeKey: () => c.metaHintPT,
      templateKey: () => c.metaHintTPL,
      courseKey: () => projection?.courseKey,
      L1: () => projection?.L1,
      L2: () => projection?.L2,
      standardUnitKey: () => projection?.standardUnitKey,
      subUnitKey: () => projection?.subUnitKey,
    };
    const empty = value => value === undefined || value === null || value === "";
    const courseCompact = value => String(value ?? "").normalize("NFC").replace(/\s/g, "");
    let usedLane = false;
    for (const f of ["curriculumKey", "courseKey", "L1", "L2", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"]) {
      // A type-hold row has no foundation revision, so the Consumer does not publish PT/TPL nor CrossConcept/Condition for it; those are verified in the registrar (resolveUnitOnly) instead.
      if (isTypeHoldRecord(r) && ["problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys"].includes(f)) continue;
      // A type-hold row has no consumer assignment yet, so the Consumer publishes a blank for the assignment-governed columns; a blank is
      // not a mismatch (a published value that differs still fails below).
      if (isTypeHoldRecord(r) && f !== "difficultyBucket" && empty(c[f]) && ["curriculumKey", "courseKey", "L1", "L2", "standardUnitKey", "subUnitKey", "integrationPattern"].includes(f)) continue;
      // Archive2 omits unknown fields instead of publishing a false NONE. Verify an omitted IntegrationPattern against its exact active runtime value.
      if (f === "integrationPattern" && !Object.hasOwn(c, f)) {
        const runtime = runtimeByUid.get(r.questionUid);
        if (!runtime && isTypeHoldRecord(r)) continue;   // type-hold rows have no runtime row by design
        if (!runtime) fail("Consumer runtime UID missing: " + r.questionUid);
        if (!eq(runtime[f], r[f])) fail("Consumer runtime metadata mismatch: " + r.questionUid + "." + f);
        continue;
      }
      if (laneBound && empty(c[f]) && !empty(r[f]) && Object.hasOwn(lane, f)) {
        const exposed = lane[f]();
        if (!empty(exposed)) {
          // The display projection names the allowlisted course key; the registration may spell the
          // same course with a space ("확률과 통계" vs "확률과통계").
          const same = f === "courseKey" ? courseCompact(exposed) === courseCompact(r[f]) : eq(exposed, r[f]);
          if (!same) fail("Consumer usable-meta lane mismatch: " + r.questionUid + "." + f);
          usedLane = true;
          continue;
        }
        const runtime = runtimeByUid.get(r.questionUid);
        if (!runtime) fail("Consumer runtime UID missing: " + r.questionUid);
        if (!eq(runtime[f], r[f])) fail("Consumer runtime metadata mismatch: " + r.questionUid + "." + f);
        usedLane = true;
        continue;
      }
      // The Consumer publishes an unrecorded difficulty as "UNKNOWN"; a registration that
      // preserves the EVIDENCE_DEBT (null) must match it, a real 1-5 bucket must match exactly.
      const consumerValue = f === "difficultyBucket" && c[f] === "UNKNOWN" && empty(r[f]) ? null : c[f];
      // The registrar itself treats course names that differ only by whitespace as the same course.
      const same = f === "courseKey" && typeof c[f] === "string" && typeof r[f] === "string"
        ? courseCompact(c[f]) === courseCompact(r[f]) : eq(consumerValue, r[f]);
      if (!same) fail("Consumer metadata mismatch: " + r.questionUid + "." + f + " (request " + JSON.stringify(r[f]) + " != consumer " + JSON.stringify(c[f]) + ")");
    }
    lanes[usedLane ? "usableMetaLane" : "canonical"]++;
    const typeHold = isTypeHoldRecord(r);
    if (typeHold) lanes.typeHold = (lanes.typeHold || 0) + 1;
    const runtime = runtimeByUid.get(r.questionUid);
    if (!runtime && !typeHold) fail(`Consumer runtime UID missing: ${r.questionUid}`);
    // Archive2's catalog exposes the verified basic path (L1/L2). The
    // Meta Foundation runtime owns the deeper canonical path (L3/L4).
    for (const f of typeHold ? [] : ["L3", "L4"]) {
      // A lane-bound record has no canonical L3/L4 (they are blanked, not absent); its recorded
      // L3 is exposed as metaHintL3 and L4 only exists in the runtime pack.
      const canonicalBlank = laneBound && empty(c[f]);
      if (canonicalBlank && f === "L3" && !empty(c.metaHintL3)) {
        if (!eq(c.metaHintL3, r[f])) fail(`Consumer usable-meta lane mismatch: ${r.questionUid}.${f}`);
      } else if (!canonicalBlank && Object.hasOwn(c, f) && c[f] !== undefined && !eq(c[f], r[f])) fail(`Consumer metadata mismatch: ${r.questionUid}.${f}`);
      if (!eq(runtime[f], r[f])) fail(`Consumer runtime metadata mismatch: ${r.questionUid}.${f}`);
    }
    // The source question's own review annotation (e.g. SELF_CHECKED) is a historical source review
    // state, kept separately from this receipt's metadata approval; it is not a metadata conflict
    // for a record served through the usable-meta lane (the canonical resolver waives it the same
    // way for FINAL_QA / REVIEW2 registrations). Any other conflict still blocks.
    // A Generated extension key is not in the compiled canonical concept/condition registry, so the catalog builder
    // flags such a record with `foundationTaxonomy` and keeps it out of the strict advanced (canonical L3/L4) lane.
    // That is the intended "usable, never promoted" outcome. It is waived here only when the record's whole
    // classification (PT/TPL/binding/canonical keys/extension keys) re-validates through the registrar's own resolve().
    const extensionExplained = field => field === "foundationTaxonomy" && hasExtensionKey(r) &&
      resolve(r, (extensionTables ||= lookup(registryPlan(root, [], () => {}))),
        { allowConditionDebt: r.conditionKeysEvidenceDebt?.status === "EVIDENCE_DEBT" }).extensions.length > 0;
    const blockingConflicts = (c.metadataConflicts || []).filter(field => !(laneBound && field === "reviewStatus") && !(r.metadataApprovalType === "REVIEW2" && field === "reviewStatus") && !extensionExplained(field));
    if (blockingConflicts.length) fail(`Consumer metadata conflict: ${r.questionUid}`);
    if ((c.metadataConflicts || []).includes("foundationTaxonomy") && hasExtensionKey(r)) lanes.generatedExtension = (lanes.generatedExtension || 0) + 1;
  }
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx); vm.runInContext(fs.readFileSync(safePath(root, "archive/question-index.js"), "utf8"), ctx, { timeout: 10000 });
  const index = unique(JSON.parse(JSON.stringify(ctx.window.questionIndex || [])), r => `${r.sourceFile}#${r.sourceOrdinal}`, "search source ordinal");
  const searchSourceCache = new Map();
  for (const r of records) {
    const found = index.get(`${r.sourceArchiveFile}#${r.sourceOrdinal}`);
    if (!found) fail(`Search UID source missing: ${r.questionUid}`);
    for (const f of ["standardUnitKey", "subUnitKey", "level"]) {
      if (eq(found[f], r[f])) continue;
      if (r.metadataApprovalType === "REVIEW2" && ["standardUnitKey", "subUnitKey", "level"].includes(f) && reviewTwoSourceLacks(root, r, f, found[f], searchSourceCache)) continue;
      if (r.metadataApprovalType === "META_PIPELINE_AUDIT" && ["standardUnitKey", "subUnitKey", "level"].includes(f)) {
        const sourceFile = "archive/exams/" + r.sourceArchiveFile;
        let bank = searchSourceCache.get(sourceFile);
        if (!bank) {
          const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
          vm.createContext(ctx);
          vm.runInContext(fs.readFileSync(safePath(root, sourceFile), "utf8"), ctx, { timeout: 5000 });
          bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
          searchSourceCache.set(sourceFile, bank);
        }
        const sourceQuestion = bank?.[Number(r.sourceOrdinal) - 1];
        // The source-only index serializes absent source metadata as an empty
        // string. Effective catalog and runtime values were verified above.
        if (sourceQuestion && eq(found[f] ?? "", sourceQuestion[f] ?? "")) continue;
      }
      fail("Search metadata mismatch: " + r.questionUid + "." + f);
    }
    if (found.course !== r.standardCourse && !(r.metadataApprovalType === "REVIEW2" && reviewTwoSourceLacks(root, r, "standardCourse", found.course, searchSourceCache))) {
      const sourceQuestion = searchSourceCache.get("archive/exams/" + r.sourceArchiveFile)?.[Number(r.sourceOrdinal) - 1];
      if (!(r.metadataApprovalType === "META_PIPELINE_AUDIT" && sourceQuestion &&
          eq(found.course ?? "", sourceQuestion.standardCourse ?? ""))) fail(`Search course mismatch: ${r.questionUid}`);
    }
  }
  if (!runtimeRecords.length && !records.every(isTypeHoldRecord)) fail("runtime records missing");
  return lanes;
}
