#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  META_VALUE_FIELDS, contentFingerprint, equal, jsonText, normalizeSourceFile,
  assertBaseAndFinalQuestionFiles, packetDigest, parseArgs, readJson, readPacket, repoRootFrom, sha256,
  sourceFingerprint, stableJson
} from "./reviewed-apply-core.mjs";

const arg = parseArgs(process.argv.slice(2));
const packetPath = arg.values.get("packet");
const check = arg.flags.has("check");
const write = arg.flags.has("write");
if (!packetPath || check === write) throw new Error("Usage: apply-reviewed-meta-patch.mjs --packet <path> (--check|--write) [--repo-root <path>]");
const root = repoRootFrom(import.meta.url, arg.values.get("repo-root"));
const { packet, info } = readPacket(path.isAbsolute(packetPath) ? packetPath : path.join(root, packetPath));
const rel = (...parts) => path.join(...parts);
const dataRoot = rel(root, "archive", "data");
const metadataPath = rel(dataRoot, "question_metadata.json");
const identityPath = rel(dataRoot, "question_identity_map.json");
const registryPath = rel(dataRoot, "meta-foundation", "canonical", "registry_index.json");
const compiledRoot = rel(dataRoot, "meta-foundation", "compiled");
const overridesDir = rel(dataRoot, "meta-foundation", "evidence", "review-overrides", "v1");
const overridesRel = "archive/data/meta-foundation/evidence/review-overrides/v1";
const packetSha = packetDigest(packet);

const gitShow = (commit, repoPath) => execFileSync("git", ["-C", root, "show", `${commit}:${repoPath}`], {
  encoding: null,
  maxBuffer: 64 * 1024 * 1024,
  stdio: ["ignore", "pipe", "pipe"]
});

const identity = readJson(identityPath);
const metadata = readJson(metadataPath);
const sourceState = assertBaseAndFinalQuestionFiles({
  root,
  packet,
  packetInfo: info,
  identity,
  gitShow
});
const metadataByUid = new Map();
const metadataSourceKeys = new Set();
for (const row of metadata.records || []) {
  if (metadataByUid.has(row.questionUid)) throw new Error(`duplicate metadata UID: ${row.questionUid}`);
  const sourceKey = `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`;
  if (metadataSourceKeys.has(sourceKey)) throw new Error(`duplicate metadata source identity: ${sourceKey}`);
  metadataSourceKeys.add(sourceKey);
  metadataByUid.set(row.questionUid, row);
}
if (metadataByUid.size !== identity.records.length) throw new Error("metadata/identity cardinality mismatch");

const registryIndex = readJson(registryPath);
const taxonomy = readJson(rel(compiledRoot, "taxonomy_registry.json"));
const concepts = readJson(rel(compiledRoot, "concept_registry.json"));
const conditions = readJson(rel(compiledRoot, "condition_registry.json"));
const bindings = readJson(rel(compiledRoot, "curriculum_bindings.json"));
const aliases = readJson(rel(compiledRoot, "aliases.json"));
const master = readJson(rel(dataRoot, "master_tables", "js_archive_tag_master.json"));
const masterByKey = new Map(master.map((row) => [row.key, row]));
const problemRows = taxonomy.problemTypes || [];
const templateRows = taxonomy.templates || [];
const conceptRows = concepts.concepts || [];
const conditionRows = conditions.conditions || [];
const bindingRows = bindings.bindings || [];
const byUniqueKey = (rows, keyField, key) => {
  const matches = rows.filter((row) => row[keyField] === key && row.status === "ACTIVE");
  if (matches.length !== 1) throw new Error(`canonical ${keyField} must resolve to one ACTIVE row: ${key} (${matches.length})`);
  return matches[0];
};
const activePackIds = new Set((registryIndex.activePacks || []).filter((row) => row.status === "ACTIVE").map((row) => row.id));
const activeL3Keys = new Set(problemRows.filter((row) => row.status === "ACTIVE").map((row) => row.problemTypeKey));
const activeL4Keys = new Set(templateRows.filter((row) => row.status === "ACTIVE").map((row) => row.templateKey));
const activeCrossConceptKeys = new Set(conceptRows.filter((row) => row.status === "ACTIVE").map((row) => row.conceptKey));
const activeConditionKeys = new Set(conditionRows.filter((row) => row.status === "ACTIVE").map((row) => row.conditionKey));
if (new Set(problemRows.map((row) => row.problemTypeKey)).size !== problemRows.length) throw new Error("canonical L3 duplicate key collision");
if (new Set(templateRows.map((row) => row.templateKey)).size !== templateRows.length) throw new Error("canonical L4 duplicate key collision");
if (new Set(conceptRows.map((row) => row.conceptKey)).size !== conceptRows.length) throw new Error("canonical CrossConcept duplicate key collision");
const canonicalKeys = [
  ...problemRows.map((row) => [row.problemTypeKey, "L3"]),
  ...templateRows.map((row) => [row.templateKey, "L4"]),
  ...conceptRows.map((row) => [row.conceptKey, "CrossConcept"]),
  ...conditionRows.map((row) => [row.conditionKey, "condition"])
];
if (new Set(canonicalKeys.map(([key]) => key)).size !== canonicalKeys.length) throw new Error("canonical duplicate/cross-kind key collision");
const activePackRows = (registryIndex.activePacks || []).filter((row) => row.status === "ACTIVE");
if (new Set(activePackRows.map((row) => row.id)).size !== activePackRows.length) throw new Error("duplicate ACTIVE canonical runtime pack id");
const activeBindingKeys = bindingRows.filter((row) => row.status === "ACTIVE").map((row) => [row.curriculum, row.standardUnitKey, row.subUnitKey ?? "", row.problemTypeKey].join("\u0000"));
if (new Set(activeBindingKeys).size !== activeBindingKeys.length) throw new Error("duplicate ACTIVE curriculum/L1/L2/L3 binding collision");
if ((aliases.collisions || []).length !== 0) throw new Error("canonical alias collision exists");

const getBeforeValue = (row, key) => Object.hasOwn(row, key) ? row[key] : null;
const validateRepair = (patch, current) => {
  if (!activePackIds.has(patch.runtimePackId)) throw new Error(`runtimePackId is not an ACTIVE pack: ${patch.runtimePackId}`);
  const after = patch.after;
  const l1 = masterByKey.get(after.standardUnitKey);
  const l2 = after.subUnitKey ? masterByKey.get(after.subUnitKey) : null;
  if (!l1 || l1.keyType !== "standardUnitKey") throw new Error(`unregistered L1/standardUnitKey: ${after.standardUnitKey}`);
  if (after.subUnitKey && (!l2 || l2.keyType !== "subUnitKey")) throw new Error(`unregistered L2/subUnitKey: ${after.subUnitKey}`);
  const l3 = byUniqueKey(problemRows, "problemTypeKey", after.problemTypeKey);
  const l4 = byUniqueKey(templateRows, "templateKey", after.templateKey);
  if (l4.parentProblemTypeKey !== l3.problemTypeKey) throw new Error(`invalid L4 parent ${l4.templateKey} -> ${l4.parentProblemTypeKey}; expected ${l3.problemTypeKey}`);
  for (const key of after.crossConceptKeys || []) if (!activeCrossConceptKeys.has(key)) throw new Error(`unregistered/inactive CrossConcept: ${key}`);
  for (const key of after.conditionKeys || current.conditionKeys || []) if (!activeConditionKeys.has(key)) throw new Error(`unregistered/inactive condition: ${key}`);
  const matching = bindingRows.filter((row) => row.status === "ACTIVE" && row.standardUnitKey === after.standardUnitKey && (row.subUnitKey ?? null) === (after.subUnitKey ?? null) && row.problemTypeKey === after.problemTypeKey);
  if (matching.length !== 1) throw new Error(`curriculum/L1/L2/L3 binding must resolve to one ACTIVE row (${matching.length}) for ${patch.questionUid}`);
  const binding = matching[0];
  if (!l2 && binding.bindingMode !== "STANDARD_UNIT_DIRECT") throw new Error(`L2 is required by the active curriculum binding for ${patch.questionUid}`);
  const requestedCurriculum = after.curriculum || after.curriculumKey || current.curriculum || current.curriculumKey;
  if (requestedCurriculum && requestedCurriculum !== binding.curriculum) throw new Error(`curriculum binding mismatch for ${patch.questionUid}: ${requestedCurriculum} != ${binding.curriculum}`);
  const requestedCourse = after.standardCourse || current.standardCourse || current.courseKey;
  if (requestedCourse && binding.standardCourse && requestedCourse !== binding.standardCourse) throw new Error(`course binding mismatch for ${patch.questionUid}: ${requestedCourse} != ${binding.standardCourse}`);
  if (current.curriculumApplicability === "HOLD" && after.curriculumApplicability !== "DEFAULT_SCOPE") {
    throw new Error(`REPAIR must explicitly resolve the curriculum HOLD: ${patch.questionUid}`);
  }
  return { l1, l2, l3, l4, binding };
};

const outputFiles = new Map();
const touched = [];
let metadataMutationCount = 0;
let semanticMetadataMutationCount = 0;
const recordResults = new Map();

const loadExistingOverride = (uid) => {
  const file = rel(overridesDir, `${uid}.json`);
  return fs.existsSync(file) ? { file, row: readJson(file) } : { file, row: null };
};
if (fs.existsSync(overridesDir)) {
  for (const name of fs.readdirSync(overridesDir).filter((entry) => entry.endsWith(".json"))) {
    const file = rel(overridesDir, name);
    const row = readJson(file);
    if (!row.questionUid || path.basename(name, ".json") !== row.questionUid) throw new Error(`review override UID/path mismatch: ${name}`);
  }
}

for (const patch of packet.metaPatches) {
  const current = metadataByUid.get(patch.questionUid);
  if (!current) throw new Error(`metadata UID missing: ${patch.questionUid}`);
  if (normalizeSourceFile(current.sourceArchiveFile) !== patch.sourceArchiveFile || Number(current.sourceOrdinal) !== patch.sourceOrdinal) {
    throw new Error(`metadata source join mismatch: ${patch.questionUid}`);
  }
  const { file: overridePath, row: priorOverride } = loadExistingOverride(patch.questionUid);
  const sameApply = priorOverride?.latestAcceptedReview2?.applyId === packet.applyId;
  if (sameApply && priorOverride.latestAcceptedReview2.packetSha256 !== packetSha) throw new Error(`applyId collision with different packet: ${packet.applyId}`);
  if (sameApply) {
    for (const key of Object.keys(priorOverride.latestAcceptedReview2.metadataAfter || {})) {
      if (!equal(getBeforeValue(current, key), priorOverride.latestAcceptedReview2.metadataAfter[key])) throw new Error(`idempotent metadata drift for ${patch.questionUid}.${key}`);
    }
  } else {
    for (const key of Object.keys(patch.before)) {
      if (!equal(getBeforeValue(current, key), patch.before[key])) throw new Error(`before value mismatch for ${patch.questionUid}.${key}`);
    }
  }

  const finalQuestion = sourceState.finalBank[patch.sourceOrdinal - 1];
  const finalFingerprint = sourceFingerprint(finalQuestion);
  const finalContentFingerprint = contentFingerprint(finalQuestion);
  let nextRecord = { ...current };
  let canonical = null;
  if (patch.status === "REPAIR") {
    canonical = validateRepair(patch, current);
    if (!sameApply) {
      for (const [key, value] of Object.entries(patch.after)) nextRecord[key] = value;
      nextRecord.curriculum = canonical.binding.curriculum;
      nextRecord.curriculumKey = canonical.binding.curriculum;
      nextRecord.standardCourse = patch.after.standardCourse || canonical.binding.standardCourse || current.standardCourse || "";
      nextRecord.standardUnit = patch.after.standardUnit || canonical.l1.labelKo;
      nextRecord.standardUnitOrder = patch.after.standardUnitOrder ?? canonical.l1.order ?? current.standardUnitOrder;
      nextRecord.subUnit = patch.after.subUnit || canonical.l2?.labelKo || canonical.binding.subUnitLabelKo || "";
      nextRecord.L1 = canonical.l1.labelKo;
      nextRecord.L2 = canonical.l2?.labelKo || canonical.binding.subUnitLabelKo || "";
      nextRecord.L3 = canonical.l3.canonicalLabelKo;
      nextRecord.L4 = canonical.l4.canonicalLabelKo;
      nextRecord.conceptClusterKey = patch.after.conceptClusterKey || patch.after.subUnitKey;
      nextRecord.crossConceptKeys = [...(patch.after.crossConceptKeys || [])];
      nextRecord.conditionKeys = [...(patch.after.conditionKeys || current.conditionKeys || [])];
      nextRecord.foundationTaxonomyStatus = "CONFIRMED";
      nextRecord.rpmPathStatus = "DIRECT";
      nextRecord.curriculumApplicability = patch.after.curriculumApplicability || "DEFAULT_SCOPE";
      nextRecord.defaultSelectable = patch.after.defaultSelectable !== false;
      nextRecord.reviewStatus = "reviewed_pass";
      nextRecord.metadataStatus = "approved_semantic_review";
      nextRecord.tagConfidence = "independent_review2";
      nextRecord.tagStatus = "reviewed_pass";
      nextRecord.metadataRevision = `meta-foundation:${patch.runtimePackId}@${registryIndex.activePacks.find((row) => row.id === patch.runtimePackId).version}:reviewed-apply-v1`;
      nextRecord.metaFoundationStatus = "ACTIVE";
      nextRecord.metaFoundationPackId = patch.runtimePackId;
      nextRecord.metaFoundationPackVersion = registryIndex.activePacks.find((row) => row.id === patch.runtimePackId).version;
      nextRecord.metaFoundationHoldReason = null;
      nextRecord.fieldStatus = {
        ...(current.fieldStatus || {}),
        standardUnit: "approved_review2",
        subUnit: "approved_review2",
        concept: "approved_review2",
        problemType: "approved_review2",
        template: "approved_review2",
        crossConcept: "approved_review2",
        condition: "approved_review2",
        integrationPattern: "approved_review2",
        difficulty: Object.hasOwn(patch.after, "difficultyBucket") ? "approved_review2" : current.fieldStatus?.difficulty || "manual_review_pending"
      };
      const evidencePath = `${overridesRel}/${patch.questionUid}.json`;
      nextRecord.approvalEvidence = [...new Set([...(current.approvalEvidence || []), evidencePath])];
      semanticMetadataMutationCount += Number(!equal(current, nextRecord));
    }
  }

  // The identity map intentionally remains the original source identity. The metadata
  // projection follows the final approved source payload so Archive2 sourceStatus is current.
  if (nextRecord.sourceFingerprint !== finalFingerprint) nextRecord.sourceFingerprint = finalFingerprint;
  if (nextRecord.contentFingerprint !== finalContentFingerprint) nextRecord.contentFingerprint = finalContentFingerprint;
  if (!equal(current, nextRecord)) {
    const recordIndex = metadata.records.findIndex((row) => row.questionUid === patch.questionUid);
    metadata.records[recordIndex] = nextRecord;
    metadataByUid.set(patch.questionUid, nextRecord);
    metadataMutationCount += 1;
  }

  const latestAcceptedReview2 = {
    schemaVersion: "archive-reviewed-apply-decision-v1",
    applyId: packet.applyId,
    targetRef: packet.targetRef,
    targetBaseSha: packet.targetBaseSha,
    grade: packet.grade,
    examFile: packet.examFile,
    sourceArchiveFile: patch.sourceArchiveFile,
    sourceOrdinal: patch.sourceOrdinal,
    sourceFingerprint: patch.sourceFingerprint,
    sourceBlobSha: packet.sourceBlobSha,
    finalExamSha256: packet.finalFiles.find((file) => file.kind === "exam_js").sha256,
    finalSourceFingerprint: finalFingerprint,
    r2Artifact: packet.r2Artifact,
    reviewArtifactSha256: packet.reviewArtifactSha256,
    closedAt: packet.closedAt,
    reviewPassCount: packet.reviewPassCount,
    closureStatus: packet.closureStatus,
    status: patch.status,
    runtimePackId: patch.runtimePackId,
    packetSha256: packetSha,
    before: patch.before,
    after: patch.after,
    metadataAfter: Object.fromEntries(Object.keys(nextRecord).filter((key) => [
      ...META_VALUE_FIELDS, "curriculum", "curriculumKey", "courseKey", "L1", "L2", "L3", "L4",
      "foundationTaxonomyStatus", "reviewStatus", "metadataStatus", "metadataRevision",
      "metaFoundationStatus", "metaFoundationPackId", "metaFoundationPackVersion",
      "curriculumApplicability", "defaultSelectable"
    ].includes(key)).map((key) => [key, nextRecord[key]])),
    ...(patch.status === "CANDIDATE" ? { candidateEvidence: {
      l3CandidateLabel: patch.l3CandidateLabel,
      l3CandidateDefinition: patch.l3CandidateDefinition,
      l4CandidateLabel: patch.l4CandidateLabel,
      l4CandidateSkeleton: patch.l4CandidateSkeleton,
      crossConceptCandidates: patch.crossConceptCandidates,
      searchedCanonicalCandidates: patch.searchedCanonicalCandidates,
      whyExistingCanonicalDoesNotFit: patch.whyExistingCanonicalDoesNotFit
    } } : {})
  };
  const override = {
    schemaVersion: "archive-reviewed-apply-override-v1",
    questionUid: patch.questionUid,
    sourceArchiveFile: patch.sourceArchiveFile,
    sourceOrdinal: patch.sourceOrdinal,
    sourceFingerprint: patch.sourceFingerprint,
    latestAcceptedReview2
  };
  const relativeOverride = `${overridesRel}/${patch.questionUid}.json`;
  const overrideText = jsonText(override);
  if (!fs.existsSync(overridePath) || fs.readFileSync(overridePath, "utf8").replace(/\r\n/g, "\n") !== overrideText) {
    outputFiles.set(relativeOverride, overrideText);
    touched.push(relativeOverride);
  }
  recordResults.set(patch.questionUid, { patch, current: nextRecord, canonical, finalQuestion, finalFingerprint });
}

if (metadataMutationCount) {
  metadata.generatedAt = packet.closedAt;
  metadata.reviewedPassCount = metadata.records.filter((row) => row.reviewStatus === "reviewed_pass").length;
  const sourceKeys = metadata.records.map((row) => `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`);
  metadata.counts = {
    ...(metadata.counts || {}),
    records: metadata.records.length,
    uidUnique: new Set(metadata.records.map((row) => row.questionUid)).size === metadata.records.length,
    sourceJoinUnique: new Set(sourceKeys).size === sourceKeys.length,
    semanticallyReviewed: metadata.records.filter((row) => row.reviewStatus === "reviewed_pass" || ["approved_semantic_review", "approved_exam_meta_source"].includes(row.metadataStatus)).length,
    explicitProblemTypeHolds: metadata.records.filter((row) => row.fieldStatus?.problemType === "manual_review_pending").length,
    explicitTemplateHolds: metadata.records.filter((row) => row.fieldStatus?.template === "manual_review_pending").length,
    explicitDifficultyHolds: metadata.records.filter((row) => row.fieldStatus?.difficulty === "manual_review_pending").length
  };
  delete metadata.digest;
  metadata.digest = sha256(JSON.stringify(metadata));
  outputFiles.set("archive/data/question_metadata.json", jsonText(metadata));
}

const plannedPaths = [...outputFiles.keys()].filter((relative) => {
  const file = rel(root, ...relative.split("/"));
  return !fs.existsSync(file) || fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") !== outputFiles.get(relative);
});
for (const [relative, text] of outputFiles) {
  const file = rel(root, ...relative.split("/"));
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null;
  if (write && current !== text) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temp = `${file}.apply-tmp`;
    fs.writeFileSync(temp, text, "utf8");
    fs.renameSync(temp, file);
  }
}

if (check && metadataMutationCount) {
  // --check is a validation/preflight operation: it reports the exact write plan and
  // deliberately leaves the repository untouched.
}
console.log(JSON.stringify({
  status: "PASS",
  mode: check ? "CHECK" : "WRITE",
  applyId: packet.applyId,
  packetSha256: packetSha,
  totalQuestions: packet.totalQuestions,
  metadataMutationCount,
  semanticMetadataMutationCount,
  evidenceMutationCount: outputFiles.size - Number(metadataMutationCount > 0),
  filesWouldChange: plannedPaths,
  filesChanged: write ? plannedPaths : []
}, null, 2));
