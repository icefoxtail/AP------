import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const PACKET_SCHEMA_VERSION = 3;
export const LEGACY_GEUMDANG_R2_ATTESTATION = Object.freeze({
  packetSha256: "ea4afcb4a39a9f2bc91b163dfdc26216df3bbdf4edc66c07e7718d800da39867",
  artifactSha256: "d72bf847deed2a251d6d73c3cda2bd77cb3f41c3068ac98e83262209615f84dd",
  artifactName: "REVIEW_DONE__24_금당중_2학기_중간_중3_수학.js.zip",
  applyId: "r2-24-geumdang-m3-2mid-20260926",
  targetBaseSha: "1cdd50343690977693ae9bf9b144ff9b538c340b",
  sourceBlobSha: "f96498d639b3f3a9174d139cb9cfdea85c4643ff",
  sourcePath: "archive/exams/original/middle/m3/2mid/24_금당중_2학기_중간_중3_수학.js",
  examFile: "24_금당중_2학기_중간_중3_수학.js"
});
export const TARGET_REFS = new Set(["main", "codex/meta-foundation/middle1"]);
export const META_VALUE_FIELDS = new Set([
  "standardCourse", "standardUnitKey", "standardUnit", "standardUnitOrder",
  "subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth",
  "conceptClusterKey", "problemTypeKey", "templateKey", "crossConceptKeys",
  "secondaryConceptKeys", "conditionKeys", "integrationPattern",
  "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag",
  "legacyLevelCompatibility", "curriculum", "curriculumKey", "courseKey",
  "L1", "L2", "L3", "L4", "curriculumApplicability", "defaultSelectable"
]);
export const JS_META_FIELDS = new Set([
  ...META_VALUE_FIELDS,
  "level", "tags"
]);
export const PROTECTED_FIELDS = new Set([
  "id", "content", "choices", "answer", "image", "imageSize",
  "questionType", "layoutTag", "wide", "tags"
]);
export const APPLY_STATUSES = new Set(["KEEP", "REPAIR", "CANDIDATE", "HOLD", "ROUTE_OUT"]);

export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
export const gitBlobSha1 = (value) => crypto.createHash("sha1")
  .update(`blob ${value.length}\0`).update(value).digest("hex");
export const sourceBlobMatches = (bytes, packet, info) =>
  info?.legacyCompatibility
    ? gitBlobSha1(bytes) === packet.sourceBlobSha
    : sha256(bytes) === packet.sourceBlobSha;
export const jsonText = (value) => JSON.stringify(value, null, 2) + "\n";
export const normalizeSourceFile = (value) => String(value || "").normalize("NFC")
  .replace(/\\/g, "/").replace(/^\.?\/?archive\/exams\//, "")
  .replace(/^\.?\/?exams\//, "").replace(/^\/+/, "").trim();

export function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

export const stableJson = (value) => JSON.stringify(stableValue(value));
export const equal = (a, b) => stableJson(a) === stableJson(b);

function fail(message) {
  throw new Error(`APPLY_PACKET_INVALID: ${message}`);
}

function safeRelativePath(value) {
  if (typeof value !== "string" || !value || value.includes("\\") || value.startsWith("/")) return false;
  const parts = value.split("/");
  return parts.every((part) => part && part !== "." && part !== "..");
}

function requiredString(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`${label} is required`);
}

function patchUidFor(sourceArchiveFile, ordinal) {
  return `qid_v1_${sha256(`${normalizeSourceFile(sourceArchiveFile)}#${Number(ordinal)}`)}`;
}

export function validatePacketEnvelope(packet, { rawBytes = null } = {}) {
  if (!packet || typeof packet !== "object" || Array.isArray(packet)) fail("top-level object required");
  const exactPacketSha256 = rawBytes ? sha256(rawBytes) : null;
  const legacyCompatibility = packet.schemaVersion === "archive-reviewed-apply/v2" &&
    exactPacketSha256 === LEGACY_GEUMDANG_R2_ATTESTATION.packetSha256;
  if (packet.schemaVersion !== PACKET_SCHEMA_VERSION && !legacyCompatibility) fail("schemaVersion must be 3; v2 is accepted only for the exact sealed legacy recovery packet");
  if (!legacyCompatibility && packet.recoveryRoute !== "SEALED_LEGACY_RECOVERY") fail("schema v3 is reserved for sealed legacy artifact recovery; new CREATE/R1/R2E production must use the current intake/R2E lifecycle");
  if (legacyCompatibility && (
    packet.applyId !== LEGACY_GEUMDANG_R2_ATTESTATION.applyId ||
    packet.targetBaseSha !== LEGACY_GEUMDANG_R2_ATTESTATION.targetBaseSha ||
    packet.sourceBlobSha !== LEGACY_GEUMDANG_R2_ATTESTATION.sourceBlobSha ||
    packet.sourcePath !== LEGACY_GEUMDANG_R2_ATTESTATION.sourcePath ||
    packet.examFile !== LEGACY_GEUMDANG_R2_ATTESTATION.examFile ||
    packet.targetRef !== "main"
  )) fail("exact legacy Geumdang packet identity mismatch");
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(packet.applyId || "") || packet.applyId.endsWith(".") || packet.applyId.endsWith("..")) {
    fail("applyId is invalid");
  }
  if (!TARGET_REFS.has(packet.targetRef)) fail("targetRef is not allowlisted");
  if (!/^[0-9a-f]{40}$/.test(packet.targetBaseSha || "")) fail("targetBaseSha must be a full SHA-1 commit id");
  if (legacyCompatibility
    ? !/^[0-9a-f]{40}$/.test(packet.sourceBlobSha || "")
    : !/^[0-9a-f]{64}$/.test(packet.sourceBlobSha || "")) {
    fail(legacyCompatibility ? "sourceBlobSha must be a Git blob SHA-1" : "sourceBlobSha must be SHA-256");
  }
  if (!Number.isInteger(packet.totalQuestions) || packet.totalQuestions < 1) fail("totalQuestions must be positive");
  if (packet.reviewPassCount !== 2) fail("reviewPassCount must equal 2");
  if (packet.closureStatus !== "CLOSED_FOR_APPLY") fail("closureStatus must be CLOSED_FOR_APPLY");
  if (packet.status !== "READY_FOR_APPLY") fail("status must be READY_FOR_APPLY");
  if (!/^(중[123]|고[123])$/.test(packet.grade || "")) fail("grade is invalid");
  const expectedTarget = packet.grade === "중1" ? "codex/meta-foundation/middle1" : "main";
  if (packet.targetRef !== expectedTarget) fail(`targetRef must be ${expectedTarget} for ${packet.grade}`);
  const normalized = normalizeSourceFile(packet.sourcePath);
  if (!normalized || (!legacyCompatibility && normalized !== packet.sourcePath) || !safeRelativePath(`archive/exams/${normalized}`) || !normalized.endsWith(".js")) {
    fail("sourcePath must be an archive/exams relative JS path");
  }
  if (packet.examFile !== path.posix.basename(normalized)) fail("examFile must be the sourcePath basename");
  if (!legacyCompatibility) {
    requiredString(packet.r2Artifact, "r2Artifact");
    if (!/^[0-9a-f]{64}$/.test(packet.reviewArtifactSha256 || "")) fail("reviewArtifactSha256 must be SHA-256");
    if (typeof packet.closedAt !== "string" || !Number.isFinite(Date.parse(packet.closedAt))) fail("closedAt must be an ISO timestamp");
    if (new Date(packet.closedAt).toISOString() !== packet.closedAt) fail("closedAt must use canonical UTC ISO format");
  }

  if (!Array.isArray(packet.finalFiles) || !packet.finalFiles.length) fail("finalFiles must be a nonempty array");
  const finalFilePaths = new Set();
  let examJsCount = 0;
  for (const file of packet.finalFiles) {
    if (!file || typeof file !== "object" || !safeRelativePath(file.path)) fail("finalFiles contains unsafe path");
    if (finalFilePaths.has(file.path)) fail(`duplicate finalFiles path: ${file.path}`);
    finalFilePaths.add(file.path);
    if (!/^[0-9a-f]{64}$/.test(file.sha256 || "")) fail(`invalid SHA-256 for ${file.path}`);
    if (!Number.isSafeInteger(file.sizeBytes) || file.sizeBytes < 0) fail(`invalid sizeBytes for ${file.path}`);
    if (file.kind === "exam_js") {
      examJsCount += 1;
      if (file.path !== `archive/exams/${normalized}`) fail("exam_js finalFile must equal sourcePath");
    } else if (file.kind === "solution_svg") {
      if (!file.path.startsWith("archive/assets/images/") || !file.path.endsWith(".svg")) fail("solution_svg must be under archive/assets/images and end in .svg");
    } else fail(`unsupported finalFiles kind: ${file.kind}`);
  }
  if (examJsCount !== 1) fail("finalFiles must contain exactly one exam_js");

  if (!Array.isArray(packet.metaPatches) || packet.metaPatches.length !== packet.totalQuestions) {
    fail("metaPatches must cover totalQuestions exactly");
  }
  const uidSet = new Set();
  const sourceSet = new Set();
  const patchByOrdinal = new Map();
  for (const patch of packet.metaPatches) {
    if (!patch || typeof patch !== "object") fail("metaPatches entries must be objects");
    requiredString(patch.questionUid, "metaPatches.questionUid");
    const source = normalizeSourceFile(patch.sourceArchiveFile);
    if (!source || source !== patch.sourceArchiveFile || source !== normalized) fail(`patch source does not match packet source: ${patch.questionUid}`);
    if (!Number.isInteger(patch.sourceOrdinal) || patch.sourceOrdinal < 1 || patch.sourceOrdinal > packet.totalQuestions) fail(`invalid sourceOrdinal for ${patch.questionUid}`);
    if (!/^[0-9a-f]{64}$/.test(patch.sourceFingerprint || "")) fail(`invalid sourceFingerprint for ${patch.questionUid}`);
    if (patch.questionUid !== patchUidFor(source, patch.sourceOrdinal)) fail(`questionUid/source identity formula mismatch: ${patch.questionUid}`);
    if (uidSet.has(patch.questionUid)) fail(`duplicate UID: ${patch.questionUid}`);
    const sourceKey = `${source}#${patch.sourceOrdinal}`;
    if (sourceSet.has(sourceKey)) fail(`duplicate source identity: ${sourceKey}`);
    uidSet.add(patch.questionUid);
    sourceSet.add(sourceKey);
    patchByOrdinal.set(patch.sourceOrdinal, patch);
    if (!APPLY_STATUSES.has(patch.status)) fail(`invalid status for ${patch.questionUid}`);
    if (typeof patch.runtimePackId !== "string") fail(`runtimePackId must be a string for ${patch.questionUid}`);
    if (!patch.before || typeof patch.before !== "object" || Array.isArray(patch.before)) fail(`before object required for ${patch.questionUid}`);
    if (!patch.after || typeof patch.after !== "object" || Array.isArray(patch.after)) fail(`after object required for ${patch.questionUid}`);
    if (!legacyCompatibility) {
      for (const [field, value] of Object.entries({
        resolverInput: patch.resolverInput,
        resolverEvidence: patch.resolverEvidence,
        difficultyEvidence: patch.difficultyEvidence,
        semanticMetaEvidence: patch.semanticMetaEvidence,
        validatorReceipt: patch.validatorReceipt,
      })) {
        if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${field} required for ${patch.questionUid}`);
      }
      if (patch.resolverInput.sourceIdentity?.questionUid !== patch.questionUid) fail(`resolverInput UID mismatch for ${patch.questionUid}`);
      if (patch.resolverInput.sourceIdentity?.sourceArchiveFile !== patch.sourceArchiveFile
        || Number(patch.resolverInput.sourceIdentity?.sourceOrdinal) !== patch.sourceOrdinal) fail(`resolverInput source identity mismatch for ${patch.questionUid}`);
      if (patch.validatorReceipt.status !== "PASS" || patch.validatorReceipt.validatorId !== "rpm-active-resolver-v1"
        || patch.validatorReceipt.inputEvidenceSha !== patch.resolverEvidence.evidenceSha || !patch.validatorReceipt.runSha) {
        fail(`deterministic Meta validator receipt required for ${patch.questionUid}`);
      }
    }
    for (const field of [...Object.keys(patch.before), ...Object.keys(patch.after)]) {
      if (!META_VALUE_FIELDS.has(field) &&
          !(legacyCompatibility && new Set(["legacyL3Key", "legacyL4Key"]).has(field))) {
        fail(`unsupported patch field ${field} for ${patch.questionUid}`);
      }
    }
    if (patch.status === "REPAIR") {
      requiredString(patch.runtimePackId, `runtimePackId for ${patch.questionUid}`);
      const required = ["standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys"];
      for (const field of required) if (!Object.hasOwn(patch.after, field)) fail(`REPAIR after.${field} required for ${patch.questionUid}`);
      if (!Array.isArray(patch.after.crossConceptKeys) || new Set(patch.after.crossConceptKeys).size !== patch.after.crossConceptKeys.length) fail(`crossConceptKeys must be unique array for ${patch.questionUid}`);
      if (Object.hasOwn(patch.after, "conditionKeys") && (!Array.isArray(patch.after.conditionKeys) || new Set(patch.after.conditionKeys).size !== patch.after.conditionKeys.length)) fail(`conditionKeys must be a unique array for ${patch.questionUid}`);
      if (Object.hasOwn(patch.after, "difficultyBucket") && (!Number.isInteger(patch.after.difficultyBucket) || patch.after.difficultyBucket < 1 || patch.after.difficultyBucket > 5)) fail(`difficultyBucket must be 1..5 for ${patch.questionUid}`);
      if (legacyCompatibility) {
        const legacyOnlyBefore = Object.keys(patch.before).filter((field) => !Object.hasOwn(patch.after, field)).sort();
        if (!equal(legacyOnlyBefore, ["legacyL3Key", "legacyL4Key"])) {
          fail(`legacy REPAIR may only preserve archived legacy L3/L4 evidence for ${patch.questionUid}`);
        }
      } else if (!equal(Object.keys(patch.before).sort(), Object.keys(patch.after).sort())) {
        fail(`REPAIR before/after fields must match for ${patch.questionUid}`);
      }
    } else if (patch.status === "CANDIDATE") {
      for (const field of ["l3CandidateLabel", "l3CandidateDefinition", "l4CandidateLabel", "l4CandidateSkeleton", "whyExistingCanonicalDoesNotFit"]) requiredString(patch[field], `${field} for ${patch.questionUid}`);
      if (!Array.isArray(patch.crossConceptCandidates) || !Array.isArray(patch.searchedCanonicalCandidates)) fail(`candidate evidence arrays required for ${patch.questionUid}`);
      if (Object.keys(patch.after).length) fail(`CANDIDATE cannot write after fields for ${patch.questionUid}`);
      if (Object.keys(patch).some((field) => /^(?:problemTypeKey|templateKey|l3CandidateKey|l4CandidateKey)$/i.test(field))) fail(`CANDIDATE cannot mint canonical keys for ${patch.questionUid}`);
      for (const candidate of patch.crossConceptCandidates) {
        if (!candidate || typeof candidate !== "object" || typeof candidate.label !== "string" || !candidate.label.trim() || typeof candidate.definition !== "string" || !candidate.definition.trim()) {
          fail(`crossConceptCandidates must preserve label/definition evidence for ${patch.questionUid}`);
        }
        if (Object.keys(candidate).some((field) => /(?:^|_)(?:conceptKey|canonicalKey|problemTypeKey|templateKey)$/i.test(field))) {
          fail(`candidate CrossConcept evidence cannot carry a selectable key for ${patch.questionUid}`);
        }
      }
    } else if (!equal(patch.before, patch.after)) {
      fail(`${patch.status} must preserve before/after for ${patch.questionUid}`);
    }
  }
  for (let ordinal = 1; ordinal <= packet.totalQuestions; ordinal += 1) {
    if (!patchByOrdinal.has(ordinal)) fail(`missing source ordinal ${ordinal}`);
  }
  const expectedSummary = (status) => packet.metaPatches.filter((x) => x.status === status).map((x) => x.questionUid).sort();
  for (const [field, status] of [["candidatePending", "CANDIDATE"], ["canonicalHolds", "HOLD"], ["routeOutPreserve", "ROUTE_OUT"]]) {
    if (!Array.isArray(packet[field]) || !equal([...packet[field]].sort(), expectedSummary(status))) fail(`${field} must exactly match ${status} UIDs`);
  }
  if (!Array.isArray(packet.regenerateScopes)) fail("regenerateScopes must be an array");
  for (const required of ["question_metadata", "meta_runtime", "question_index", "archive2_catalog", "crosswalk"]) {
    const legacyCrosswalkAlias = legacyCompatibility && required === "crosswalk" &&
      packet.regenerateScopes.includes("archive2_crosswalk");
    if (!packet.regenerateScopes.includes(required) && !legacyCrosswalkAlias) {
      fail(`regenerateScopes must include ${required}`);
    }
  }
  return {
    sourcePath: normalized, finalFilePaths, patchByOrdinal, uidSet,
    legacyCompatibility,
    exactPacketSha256,
    legacyAttestation: legacyCompatibility ? LEGACY_GEUMDANG_R2_ATTESTATION : null
  };
}

export function parseQuestionBank(code, filename) {
  const context = { window: Object.create(null), console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(code, context, { filename, timeout: 3000 });
  const bank = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
  if (!Array.isArray(bank)) throw new Error(`questions array not found: ${filename}`);
  return bank;
}

export function sourceFingerprint(question) {
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    answer: question?.answer ?? null,
    solution: question?.solution ?? null,
    image: question?.image ?? null
  }));
}

export function contentFingerprint(question) {
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    image: question?.image ?? null
  }));
}

export function assertBaseAndFinalQuestionFiles({ root, packet, packetInfo, identity, gitShow }) {
  const identityByUid = new Map();
  const identityBySource = new Map();
  for (const row of identity.records || []) {
    if (identityByUid.has(row.questionUid)) throw new Error(`duplicate identity UID: ${row.questionUid}`);
    const sourceKey = `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`;
    if (identityBySource.has(sourceKey)) throw new Error(`duplicate identity source: ${sourceKey}`);
    identityByUid.set(row.questionUid, row);
    identityBySource.set(sourceKey, row);
  }
  const repoPath = `archive/exams/${packetInfo.sourcePath}`;
  const baseBytes = gitShow(packet.targetBaseSha, repoPath);
  if (!sourceBlobMatches(baseBytes, packet, packetInfo)) throw new Error("sourceBlobSha mismatch against targetBaseSha source blob");
  const finalPath = path.join(root, ...repoPath.split("/"));
  const finalBytes = fs.readFileSync(finalPath);
  const baseBank = parseQuestionBank(baseBytes.toString("utf8"), `base:${repoPath}`);
  const finalBank = parseQuestionBank(finalBytes.toString("utf8"), finalPath);
  if (baseBank.length !== packet.totalQuestions || finalBank.length !== packet.totalQuestions) throw new Error("base/final question cardinality mismatch");

  for (let ordinal = 1; ordinal <= packet.totalQuestions; ordinal += 1) {
    const patch = packetInfo.patchByOrdinal.get(ordinal);
    const identityRecord = identityByUid.get(patch.questionUid);
    const sourceIdentity = identityBySource.get(`${packetInfo.sourcePath}#${ordinal}`);
    if (!identityRecord || !sourceIdentity || identityRecord !== sourceIdentity) throw new Error(`source identity missing or split for ${patch.questionUid}`);
    if (normalizeSourceFile(identityRecord.sourceArchiveFile) !== packetInfo.sourcePath || Number(identityRecord.sourceOrdinal) !== ordinal || identityRecord.sourceFingerprint !== patch.sourceFingerprint) {
      throw new Error(`source identity mismatch for ${patch.questionUid}`);
    }
  }

  const metaFields = packet.metaPatches.reduce((map, patch) => map.set(patch.sourceOrdinal, patch), new Map());
  for (let i = 0; i < packet.totalQuestions; i += 1) {
    const before = baseBank[i];
    const after = finalBank[i];
    if (!before || !after || typeof before !== "object" || typeof after !== "object") throw new Error(`invalid question object at ordinal ${i + 1}`);
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const patch = metaFields.get(i + 1);
    if (patch.status === "REPAIR") {
      for (const [key, value] of Object.entries(patch.after)) {
        if (Object.hasOwn(after, key) && !equal(after[key], value)) {
          throw new Error(`final exam JS Meta disagrees with REPAIR after at ${packetInfo.sourcePath}#${i + 1}.${key}`);
        }
      }
    }
    for (const key of keys) {
      if (equal(before[key], after[key]) && Object.hasOwn(before, key) === Object.hasOwn(after, key)) continue;
      if (PROTECTED_FIELDS.has(key)) throw new Error(`protected field mutation at ${packetInfo.sourcePath}#${i + 1}.${key}`);
      if (key === "solution" || key === "solutionImage") continue;
      if (!JS_META_FIELDS.has(key)) throw new Error(`non-allowlisted field mutation at ${packetInfo.sourcePath}#${i + 1}.${key}`);
      if (patch.status !== "REPAIR" || !Object.hasOwn(patch.after, key) || !equal(patch.after[key], after[key])) {
        throw new Error(`Meta JS mutation is not declared by REPAIR after at ${packetInfo.sourcePath}#${i + 1}.${key}`);
      }
    }
  }

  for (const file of packet.finalFiles) {
    const filePath = path.join(root, ...file.path.split("/"));
    const bytes = fs.readFileSync(filePath);
    if (sha256(bytes) !== file.sha256 || bytes.length !== file.sizeBytes) throw new Error(`finalFiles SHA/size mismatch: ${file.path}`);
  }
  return { baseBank, finalBank, identityByUid };
}

export function packetDigest(packet) {
  return sha256(stableJson(packet));
}

export function readPacket(packetPath) {
  const absolute = path.resolve(packetPath);
  if (!fs.existsSync(absolute)) throw new Error(`packet not found: ${absolute}`);
  const rawBytes = fs.readFileSync(absolute);
  const packet = JSON.parse(rawBytes.toString("utf8"));
  return { absolute, packet, info: validatePacketEnvelope(packet, { rawBytes }) };
}

export function parseArgs(argv) {
  const values = new Map();
  const flags = new Set();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--check" || arg === "--write" || arg === "--repo-root") {
      if (arg === "--repo-root") {
        const value = argv[++i];
        if (!value) throw new Error("--repo-root requires a value");
        values.set("repo-root", value);
      } else flags.add(arg.slice(2));
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[++i];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      values.set(key, value);
    } else if (!values.has("command")) values.set("command", arg);
    else throw new Error(`unexpected argument: ${arg}`);
  }
  return { values, flags };
}

export function repoRootFrom(importMetaUrl, override) {
  if (override) return path.resolve(override);
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), "../../..");
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
