import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";

import { canonicalJson, objectSha } from "../../pipeline-core/canonical.mjs";

export const SOURCE_INVENTORY_SCHEMA = "PAST_EXAM_SOURCE_INVENTORY_v1";
export const SOURCE_IDENTITY_MAP_SCHEMA = "PAST_EXAM_SOURCE_IDENTITY_MAP_v1";
export const SOURCE_FIDELITY_SCHEMA = "PAST_EXAM_SOURCE_FIDELITY_EVIDENCE_v1";
export const MATH_REVIEW_SCHEMA = "PAST_EXAM_MATH_REVIEW_EVIDENCE_v1";
export const ASSET_PROVENANCE_SCHEMA = "PAST_EXAM_ASSET_PROVENANCE_EVIDENCE_v1";

export const SOURCE_DISPOSITIONS = new Set([
  "INCLUDED",
  "REVIEW_NEEDED",
  "SOURCE_DEFECT",
  "EXCLUDED_WITH_EVIDENCE",
]);

export const RELEASE_STATES = Object.freeze([
  "SOURCE_INVENTORY_FROZEN",
  "EXTRACTED",
  "EXTRACTION_VALIDATED",
  "SOURCE_FIDELITY_PASS",
  "MATH_REVIEW_PASS",
  "ASSET_REVIEW_PASS",
  "PRE_PROMOTION_PASS",
  "PROMOTED",
  "PORTABLE_PACKAGE_PASS",
  "REAL_RENDER_PASS",
  "DONE",
]);

const REQUIRED_EVIDENCE_FIELDS = Object.freeze([
  ["sourceInventorySha", "source_inventory.json", SOURCE_INVENTORY_SCHEMA],
  ["sourceIdentityMapSha", "source_identity_map.json", SOURCE_IDENTITY_MAP_SCHEMA],
  ["sourceFidelityEvidenceSha", "source_fidelity_evidence.json", SOURCE_FIDELITY_SCHEMA],
  ["mathReviewEvidenceSha", "math_review_evidence.json", MATH_REVIEW_SCHEMA],
  ["assetProvenanceEvidenceSha", "asset_provenance_evidence.json", ASSET_PROVENANCE_SCHEMA],
]);

function nonEmpty(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function normalizeSha(value) {
  if (!nonEmpty(value)) return "";
  const text = String(value);
  return text.startsWith("sha256:") ? text : `sha256:${text}`;
}

export function fileSha(file) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}`;
}

export function objectFileSha(value) {
  return objectSha(value);
}

function writeJsonIfNew(file, value) {
  const body = `${JSON.stringify(value, null, 2)}\n`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    const existing = JSON.parse(fs.readFileSync(file, "utf8"));
    const comparable = (item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const copy = { ...item };
      delete copy.frozenAt;
      return copy;
    };
    if (canonicalJson(comparable(existing)) !== canonicalJson(comparable(value))) throw new Error(`FROZEN_EVIDENCE_CHANGED:${file}`);
    return fileSha(file);
  }
  fs.writeFileSync(file, body, "utf8");
  return fileSha(file);
}

function resolveInputPath(value, base) {
  if (!nonEmpty(value)) return "";
  return path.isAbsolute(String(value)) ? String(value) : path.resolve(base, String(value));
}

function sourceDocumentSha(manifest, input, base) {
  const sourcePath = resolveInputPath(input.sourceDocumentPath || manifest.pdfPath, base);
  const declared = normalizeSha(input.sourceDocumentSha256 || input.sourceDocumentSha);
  if (sourcePath && fs.existsSync(sourcePath)) {
    const actual = fileSha(sourcePath);
    if (declared && actual !== declared) throw new Error("SOURCE_DOCUMENT_SHA_MISMATCH");
    return { sourceDocumentPath: sourcePath, sourceDocumentSha256: actual };
  }
  if (!declared) throw new Error("SOURCE_DOCUMENT_SHA_REQUIRED");
  return { sourceDocumentPath: sourcePath, sourceDocumentSha256: declared };
}

function sourceQuestionsFromInput(input) {
  const rows = input?.questions || input?.items || input?.sourceQuestions;
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("SOURCE_QUESTION_INVENTORY_REQUIRED");
  return rows;
}

function inventoryInput(manifest, base) {
  if (manifest.sourceInventory && typeof manifest.sourceInventory === "object") return manifest.sourceInventory;
  const file = resolveInputPath(manifest.sourceInventoryPath || manifest.sourceInventoryFile, base);
  if (!file || !fs.existsSync(file)) throw new Error("SOURCE_INVENTORY_REQUIRED");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normalizedSourceQuestion(row, index, sourceDocumentSha256, pageCount, pageEvidenceByNo) {
  const sourceQuestionNo = String(row.sourceQuestionNo ?? row.questionNo ?? row.displayNo ?? "").trim();
  const sourcePageNo = Number(row.sourcePageNo ?? row.pageNo);
  const disposition = String(row.disposition || "").trim();
  if (!sourceQuestionNo) throw new Error(`SOURCE_QUESTION_NO_MISSING:${index + 1}`);
  if (!Number.isSafeInteger(sourcePageNo) || sourcePageNo < 1 || sourcePageNo > pageCount) throw new Error(`SOURCE_PAGE_NO_INVALID:${sourceQuestionNo}`);
  if (!SOURCE_DISPOSITIONS.has(disposition)) throw new Error(`SOURCE_DISPOSITION_INVALID:${sourceQuestionNo}`);
  const evidencePaths = Array.isArray(row.sourcePageEvidencePaths) && row.sourcePageEvidencePaths.length
    ? row.sourcePageEvidencePaths.map(String)
    : [String(row.sourceEvidencePath || pageEvidenceByNo.get(sourcePageNo) || "")].filter(Boolean);
  if (!evidencePaths.length) throw new Error(`SOURCE_EVIDENCE_MISSING:${sourceQuestionNo}`);
  return {
    sourceIdentityKey: `${sourceDocumentSha256}|${sourceQuestionNo}`,
    sourceDocumentSha256,
    sourceQuestionNo,
    sourcePageNo,
    sourcePageEvidencePaths: evidencePaths,
    sourceEvidencePath: evidencePaths[0],
    disposition,
    sourceOrdinal: index + 1,
  };
}

export function includedIdentitySet(inventory) {
  return inventory.questions
    .filter((row) => row.disposition !== "EXCLUDED_WITH_EVIDENCE")
    .map((row) => row.sourceIdentityKey)
    .sort();
}

export function freezeSourceInventory({ manifest, outputDir, pageCount = null, pageEvidence = [] }) {
  const base = path.resolve(process.cwd());
  const input = inventoryInput(manifest, base);
  if (input.schema && input.schema !== SOURCE_INVENTORY_SCHEMA) throw new Error("SOURCE_INVENTORY_SCHEMA_INVALID");
  const document = sourceDocumentSha(manifest, input, base);
  const declaredPageCount = Number(input.pageCount ?? pageCount ?? 0);
  if (!Number.isSafeInteger(declaredPageCount) || declaredPageCount < 1) throw new Error("SOURCE_PAGE_COUNT_REQUIRED");
  if (pageCount !== null && pageCount > 0 && declaredPageCount !== pageCount) throw new Error("SOURCE_PAGE_COUNT_MISMATCH");
  const pageEvidenceByNo = new Map(pageEvidence.map((item) => [Number(item.pageNo), item.relativeImagePath || item.imagePath || ""]));
  const questions = sourceQuestionsFromInput(input).map((row, index) => normalizedSourceQuestion(row, index, document.sourceDocumentSha256, declaredPageCount, pageEvidenceByNo));
  const keys = questions.map((row) => row.sourceIdentityKey);
  if (new Set(keys).size !== keys.length) throw new Error("SOURCE_IDENTITY_DUPLICATE");
  const examId = String(input.examId || manifest.examId || "");
  if (!examId) throw new Error("SOURCE_INVENTORY_EXAM_ID_REQUIRED");
  if (input.expectedQuestionCount !== undefined && Number(input.expectedQuestionCount) !== questions.length) throw new Error("SOURCE_QUESTION_COUNT_MISMATCH");
  const inventory = {
    schema: SOURCE_INVENTORY_SCHEMA,
    examId,
    sourceDocumentPath: document.sourceDocumentPath,
    sourceDocumentSha256: document.sourceDocumentSha256,
    pageCount: declaredPageCount,
    expectedQuestionCount: questions.length,
    frozenAt: new Date().toISOString(),
    questions,
  };
  const reports = path.join(outputDir, "reports");
  const inventoryPath = path.join(reports, "source_inventory.json");
  const sourceInventorySha = writeJsonIfNew(inventoryPath, inventory);
  const identityMap = {
    schema: SOURCE_IDENTITY_MAP_SCHEMA,
    examId,
    sourceInventorySha,
    coveragePolicy: "every non-excluded source question must have exactly one candidate disposition",
    includedIdentitySet: includedIdentitySet(inventory),
    questions: questions.map(({ sourceOrdinal, ...row }) => row),
  };
  const sourceIdentityMapPath = path.join(reports, "source_identity_map.json");
  const sourceIdentityMapSha = writeJsonIfNew(sourceIdentityMapPath, identityMap);
  return {
    status: "PASS",
    inventory,
    inventoryPath,
    sourceInventorySha,
    sourceIdentityMapPath,
    sourceIdentityMapSha,
  };
}

export function loadCandidate(file) {
  const source = fs.readFileSync(file, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: file, timeout: 1000 });
  if (!Array.isArray(context.window.questionBank)) throw new Error("CANDIDATE_QUESTION_BANK_REQUIRED");
  return { source, window: context.window, questions: context.window.questionBank };
}

export function questionIdentity(question) {
  const sourceDocumentSha256 = normalizeSha(question.sourceDocumentSha256 || question.sourceDocumentSha);
  const sourceQuestionNo = String(question.sourceQuestionNo ?? "").trim();
  const sourcePageNo = Number(question.sourcePageNo ?? question.pageNo);
  if (!sourceDocumentSha256 || !sourceQuestionNo || !Number.isSafeInteger(sourcePageNo) || sourcePageNo < 1) throw new Error(`SOURCE_IDENTITY_MISSING:q${question.id}`);
  return {
    sourceIdentityKey: String(question.sourceIdentityKey || `${sourceDocumentSha256}|${sourceQuestionNo}`),
    sourceDocumentSha256,
    sourceQuestionNo,
    sourcePageNo,
    sourceEvidencePath: String(question.sourceEvidencePath || question.fullPageImageRelPath || ""),
  };
}

export function candidateIdentitySet(questions) {
  const identities = questions.map(questionIdentity);
  const keys = identities.map((row) => row.sourceIdentityKey);
  if (new Set(keys).size !== keys.length) throw new Error("SOURCE_IDENTITY_DUPLICATE");
  return { identities, keys: [...keys].sort() };
}

export function protectedPayload(question) {
  return {
    content: question.content ?? "",
    choices: question.choices ?? [],
    sourceQuestionNo: question.sourceQuestionNo ?? null,
    sourcePageNo: question.sourcePageNo ?? question.pageNo ?? null,
    image: question.image ?? "",
    visualAsset: question.visualAsset ?? "",
    sourceEvidencePath: question.sourceEvidencePath ?? question.fullPageImageRelPath ?? "",
    sourceDocumentSha256: question.sourceDocumentSha256 ?? null,
  };
}

export function protectedPayloadSha(question) {
  return objectSha(protectedPayload(question));
}

function valuesInQuestion(question) {
  return [question.content, ...(Array.isArray(question.choices) ? question.choices : []), question.answer, question.solution]
    .filter((value) => typeof value === "string");
}

export function serializationIssues(source, questions) {
  const errors = [];
  for (const question of questions) {
    for (const value of valuesInQuestion(question)) {
      if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) errors.push(`SERIALIZATION_CONTROL_CHARACTER:q${question.id}`);
      if ((value.match(/\$/g) || []).length % 2 !== 0) errors.push(`SERIALIZATION_ODD_MATH_DELIMITER:q${question.id}`);
    }
  }
  if (/(^|[^\\])\\(?:pi|sqrt|neq|not)\b/.test(source)) errors.push("SERIALIZATION_LATEX_ESCAPE_BROKEN");
  return [...new Set(errors)];
}

function resolveEvidenceFile(candidateFile, configured, fallbackName) {
  const candidateRoot = path.basename(path.dirname(candidateFile)) === "candidate" ? path.dirname(path.dirname(candidateFile)) : path.dirname(candidateFile);
  const configuredPath = configured?.path ? resolveInputPath(configured.path, candidateRoot) : "";
  const inferred = path.join(candidateRoot, "reports", fallbackName);
  const file = configuredPath || inferred;
  return fs.existsSync(file) ? file : "";
}

function evidenceSha(review, field, file) {
  const declared = normalizeSha(review[field]);
  if (!declared || !file) return false;
  return declared === fileSha(file);
}

function readEvidence(review, field, fallbackName, candidateFile) {
  const file = resolveEvidenceFile(candidateFile, review.evidenceFiles?.[field], fallbackName);
  if (!file || !evidenceSha(review, field, file)) return { file, data: null };
  return { file, data: JSON.parse(fs.readFileSync(file, "utf8")) };
}

function evidenceItems(data) {
  return Array.isArray(data?.items) ? data.items : [];
}

function validateSourceInventoryAndCoverage(candidateFile, questions) {
  const candidateRoot = path.basename(path.dirname(candidateFile)) === "candidate" ? path.dirname(path.dirname(candidateFile)) : path.dirname(candidateFile);
  const inventoryFile = path.join(candidateRoot, "reports", "source_inventory.json");
  const mapFile = path.join(candidateRoot, "reports", "source_identity_map.json");
  if (!fs.existsSync(inventoryFile) || !fs.existsSync(mapFile)) return { errors: ["SOURCE_INVENTORY_REQUIRED"], inventory: null, identityMap: null };
  const inventory = JSON.parse(fs.readFileSync(inventoryFile, "utf8"));
  const identityMap = JSON.parse(fs.readFileSync(mapFile, "utf8"));
  if (inventory.schema !== SOURCE_INVENTORY_SCHEMA) return { errors: ["SOURCE_INVENTORY_SCHEMA_INVALID"], inventory, identityMap };
  if (identityMap.schema !== SOURCE_IDENTITY_MAP_SCHEMA) return { errors: ["SOURCE_IDENTITY_MAP_SCHEMA_INVALID"], inventory, identityMap };
  const candidate = candidateIdentitySet(questions);
  const expected = includedIdentitySet(inventory);
  const missing = expected.filter((key) => !candidate.keys.includes(key));
  const extra = candidate.keys.filter((key) => !expected.includes(key));
  const errors = [];
  if (extra.length) errors.push(`SOURCE_QUESTION_IDENTITY_FAIL:${extra.join(",")}`);
  if (missing.length || extra.length || candidate.keys.length !== expected.length) errors.push(`SOURCE_INVENTORY_COVERAGE_FAIL:missing=${missing.join(",")}:extra=${extra.join(",")}`);
  return { errors, inventory, identityMap, candidate };
}

function validateFidelityEvidence(candidateFile, questions, review, inventory) {
  const result = readEvidence(review, "sourceFidelityEvidenceSha", "source_fidelity_evidence.json", candidateFile);
  const errors = [];
  if (!result.data || result.data.schema !== SOURCE_FIDELITY_SCHEMA) return ["SOURCE_FIDELITY_EVIDENCE_BINDING_FAIL"];
  if (result.data.sourceInventorySha !== fileSha(path.join(path.dirname(result.file), "source_inventory.json"))) errors.push("SOURCE_FIDELITY_INVENTORY_STALE");
  const byKey = new Map(evidenceItems(result.data).map((item) => [String(item.sourceIdentityKey || `${item.sourceDocumentSha256}|${item.sourceQuestionNo}`), item]));
  for (const q of questions) {
    const identity = questionIdentity(q);
    const item = byKey.get(identity.sourceIdentityKey);
    if (!item || item.sourceQuestionNo !== identity.sourceQuestionNo || Number(item.sourcePageNo) !== identity.sourcePageNo || !nonEmpty(item.sourceEvidencePath) || !/^sha256:[0-9a-f]{64}$/.test(String(item.sourceEvidenceSha256 || "")) || item.contentChecked !== true || item.choicesChecked !== true || item.verdict !== "PASS") errors.push(`SOURCE_FIDELITY_FAIL:q${q.id}`);
    if (item?.contentSha256 && item.contentSha256 !== objectSha(q.content ?? "")) errors.push(`SOURCE_FIDELITY_FAIL:q${q.id}:CONTENT_MISMATCH`);
    if (item?.choicesSha256 && item.choicesSha256 !== objectSha(q.choices ?? [])) errors.push(`SOURCE_FIDELITY_FAIL:q${q.id}:CHOICES_MISMATCH`);
  }
  if (byKey.size !== inventory.questions.filter((row) => row.disposition !== "EXCLUDED_WITH_EVIDENCE").length) errors.push("SOURCE_FIDELITY_COVERAGE_FAIL");
  return [...new Set(errors)];
}

function validateMathEvidence(candidateFile, questions, review) {
  const result = readEvidence(review, "mathReviewEvidenceSha", "math_review_evidence.json", candidateFile);
  if (!result.data || result.data.schema !== MATH_REVIEW_SCHEMA) return ["MATH_REVIEW_EVIDENCE_BINDING_FAIL"];
  const byKey = new Map(evidenceItems(result.data).map((item) => [String(item.sourceIdentityKey), item]));
  const errors = [];
  for (const q of questions) {
    const identity = questionIdentity(q);
    const item = byKey.get(identity.sourceIdentityKey);
    if (!item || item.inputVisibilityProfile !== "SOURCE_ONLY" || item.priorAnswerVisible === true || item.sourceOnlyBlindSolve !== true || item.choiceUniqueness !== true || item.questionValidity !== true || item.verdict !== "PASS") errors.push(`MATH_REVIEW_FAIL:q${q.id}`);
    if (item && String(item.independentAnswer ?? "") !== String(q.answer ?? "")) errors.push(`MATH_REVIEW_FAIL:q${q.id}:ANSWER_MISMATCH`);
  }
  return [...new Set(errors)];
}

function resolveAsset(candidateFile, assetPath) {
  if (!nonEmpty(assetPath)) return "";
  if (path.isAbsolute(assetPath)) return assetPath;
  const candidateRoot = path.basename(path.dirname(candidateFile)) === "candidate" ? path.dirname(path.dirname(candidateFile)) : path.dirname(candidateFile);
  const local = path.resolve(candidateRoot, assetPath);
  if (fs.existsSync(local)) return local;
  const repo = path.resolve(candidateRoot, "../../../../");
  const archive = path.resolve(candidateRoot, "../../..");
  for (const base of [repo, archive]) {
    const possible = path.resolve(base, assetPath);
    if (fs.existsSync(possible)) return possible;
  }
  return local;
}

function validateAssetEvidence(candidateFile, questions, review) {
  const result = readEvidence(review, "assetProvenanceEvidenceSha", "asset_provenance_evidence.json", candidateFile);
  if (!result.data || result.data.schema !== ASSET_PROVENANCE_SCHEMA) return ["ASSET_PROVENANCE_EVIDENCE_BINDING_FAIL"];
  const byKey = new Map(evidenceItems(result.data).map((item) => [String(item.sourceIdentityKey), item]));
  const errors = [];
  for (const q of questions) {
    const identity = questionIdentity(q);
    const assetPath = String(q.visualAsset || q.image || "");
    if (!assetPath && !q.hasVisualAsset) continue;
    const item = byKey.get(identity.sourceIdentityKey);
    const provenance = q.visualAssetProvenance || item;
    if (!provenance || !assetPath) { errors.push(`ASSET_PROVENANCE_MISSING:q${q.id}`); continue; }
    if (String(provenance.sourceQuestionNo) !== identity.sourceQuestionNo) errors.push(`QUESTION_ASSET_IDENTITY_MISMATCH:q${q.id}`);
    if (normalizeSha(provenance.sourceDocumentSha256) !== identity.sourceDocumentSha256) errors.push(`WRONG_ASSET_PROVENANCE:q${q.id}`);
    if (Number(provenance.sourcePageNo) !== identity.sourcePageNo) errors.push(`WRONG_ASSET_PROVENANCE:q${q.id}`);
    const file = resolveAsset(candidateFile, assetPath);
    if (!fs.existsSync(file)) { errors.push(`ASSET_FILE_MISSING:q${q.id}`); continue; }
    if (normalizeSha(provenance.assetSha256) !== fileSha(file)) errors.push(`WRONG_ASSET_PROVENANCE:q${q.id}`);
    const checks = provenance.checks || item?.checks || {};
    for (const key of ["CROP_PURITY", "NO_OTHER_QUESTION_TEXT", "NO_CHOICES_CONTAMINATION", "NO_PAGE_BORDER_CONTAMINATION", "NO_CLIPPING", "REQUIRED_LABELS_PRESENT", "QUESTION_SEMANTIC_MATCH"]) if (checks[key] !== true) errors.push(`CROP_PURITY_FAIL:q${q.id}:${key}`);
    if (provenance.verdict !== "PASS") errors.push(`ASSET_SEMANTIC_FAIL:q${q.id}`);
  }
  return [...new Set(errors)];
}

function validateReviewEnvelope(candidateFile, candidateSource, questions, review, manifest) {
  const errors = [];
  if (review.status !== "reviewed_pass") errors.push("REVIEWED_PASS_REQUIRED");
  if (review.candidateSha !== fileSha(candidateFile)) errors.push("CANDIDATE_SHA_BINDING_FAIL");
  if (!nonEmpty(review.promotionTransactionId)) errors.push("PROMOTION_TRANSACTION_ID_REQUIRED");
  if (review.sourceFidelityRestoration === true || review.sourceRestorationRequested === true) errors.push("SOURCE_FIDELITY_RESTORATION_REQUIRED");
  const allowed = new Set(["answer", "solution", "answerStatus", "solutionStatus", "subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"]);
  for (const field of review.changedFields || []) if (!allowed.has(field)) errors.push("ANSWER_SOLUTION_SCOPE_VIOLATION");
  const candidateRoot = path.basename(path.dirname(candidateFile)) === "candidate" ? path.dirname(path.dirname(candidateFile)) : path.dirname(candidateFile);
  const handoffFile = path.join(candidateRoot, "reports", "gpt_gemini_handoff_manifest.json");
  if (!fs.existsSync(handoffFile)) {
    errors.push("HANDOFF_PROTECTED_PAYLOAD_BINDING_MISSING");
  } else {
    const handoff = JSON.parse(fs.readFileSync(handoffFile, "utf8"));
    if (review.handoffManifestSha && review.handoffManifestSha !== fileSha(handoffFile)) errors.push("HANDOFF_MANIFEST_SHA_STALE");
    if (!review.handoffManifestSha) errors.push("HANDOFF_MANIFEST_SHA_REQUIRED");
    const baseline = new Map((handoff.protectedPayload || []).map((row) => [String(row.sourceIdentityKey), row.sha256]));
    for (const q of questions) {
      const identity = questionIdentity(q);
      if (baseline.get(identity.sourceIdentityKey) !== protectedPayloadSha(q)) errors.push(`ANSWER_SOLUTION_SCOPE_VIOLATION:q${q.id}`);
    }
  }
  const protectedRows = new Map((review.protectedPayload || []).map((row) => [String(row.sourceIdentityKey), row]));
  const candidateKeys = candidateIdentitySet(questions).keys;
  const reviewKeys = (review.sourceIdentitySet || review.sourceIdentities || []).map((row) => String(row.sourceIdentityKey || row)).sort();
  if (!reviewKeys.length) errors.push("REVIEW_SOURCE_IDENTITY_SET_REQUIRED");
  else if (JSON.stringify(reviewKeys) !== JSON.stringify(candidateKeys)) errors.push("REVIEW_SOURCE_IDENTITY_SET_MISMATCH");
  for (const q of questions) {
    const identity = questionIdentity(q);
    const row = protectedRows.get(identity.sourceIdentityKey);
    if (!row || row.sha256 !== protectedPayloadSha(q)) errors.push(`ANSWER_SOLUTION_SCOPE_VIOLATION:q${q.id}`);
  }
  if (protectedRows.size !== questions.length) errors.push("ANSWER_SOLUTION_SCOPE_VIOLATION");
  for (const [field, fallback, schema] of REQUIRED_EVIDENCE_FIELDS) {
    const file = resolveEvidenceFile(candidateFile, review.evidenceFiles?.[field], fallback);
    if (!file || !evidenceSha(review, field, file)) errors.push(`${field.toUpperCase()}_BINDING_FAIL`);
    if (file && schema && JSON.parse(fs.readFileSync(file, "utf8")).schema !== schema) errors.push(`${field.toUpperCase()}_SCHEMA_INVALID`);
  }
  if (manifest?.examId && review.examId !== manifest.examId) errors.push("REVIEW_EXAM_ID_MISMATCH");
  errors.push(...serializationIssues(candidateSource, questions).map(() => "SERIALIZATION_FAIL"));
  return [...new Set(errors)];
}

export function validatePastExamPromotion({ candidateFile, manifest, review, reviewFile = "" }) {
  const loaded = loadCandidate(candidateFile);
  const errors = [];
  if (loaded.window.examTitle !== manifest.examId) errors.push("EXAM_IDENTITY_MISMATCH");
  const source = validateSourceInventoryAndCoverage(candidateFile, loaded.questions);
  errors.push(...source.errors);
  if (source.inventory) {
    const reviewEnvelope = validateReviewEnvelope(candidateFile, loaded.source, loaded.questions, review, manifest);
    errors.push(...reviewEnvelope);
    errors.push(...validateFidelityEvidence(candidateFile, loaded.questions, review, source.inventory));
    errors.push(...validateMathEvidence(candidateFile, loaded.questions, review));
    errors.push(...validateAssetEvidence(candidateFile, loaded.questions, review));
  }
  const identities = source.candidate?.identities || [];
  return {
    status: errors.length ? "BLOCKED" : "PASS",
    errors: [...new Set(errors)],
    candidateSha: fileSha(candidateFile),
    sourceInventorySha: source.inventory && fileSha(path.join(path.dirname(candidateFile), "..", "reports", "source_inventory.json")),
    sourceIdentityMapSha: source.identityMap && fileSha(path.join(path.dirname(candidateFile), "..", "reports", "source_identity_map.json")),
    identities,
    identityKeys: source.candidate?.keys || [],
    reviewFile,
  };
}

export function assertPastExamPromotion(options) {
  const report = validatePastExamPromotion(options);
  if (report.status !== "PASS") throw new Error(`PAST_EXAM_PROMOTION_BLOCKED:${report.errors.join(";")}`);
  return report;
}

export function assertReleaseClosure(release) {
  const errors = [];
  const required = ["zipSha256", "extractedTreeSha256", "candidateSha", "productionSha", "runtimeBundleSha", "renderEvidenceSha"];
  for (const key of required) if (!/^sha256:[0-9a-f]{64}$/.test(String(release?.[key] || ""))) errors.push(`RELEASE_BINDING_MISSING:${key}`);
  if (release?.exactDeliverableZip !== true || release?.freshExtraction !== true) errors.push("EXACT_DELIVERABLE_ZIP_REQUIRED");
  for (const mode of ["exam", "sol", "ans"]) if (release?.render?.[mode] !== "PASS") errors.push(`RELEASE_BLOCKED:${mode}`);
  if (release?.state !== "DONE") errors.push("DONE_UNAVAILABLE");
  if (release?.browserTested !== true) errors.push("BROWSER_QA_NOT_TESTED");
  if (release?.state === "DONE" && release?.previousState !== "REAL_RENDER_PASS") errors.push("STATE_TRANSITION_INVALID");
  if (errors.length) throw new Error(errors.join(";"));
  return { status: "PASS", state: release.state };
}

export function validateReleaseTransition(previous, next) {
  const from = RELEASE_STATES.indexOf(previous);
  const to = RELEASE_STATES.indexOf(next);
  if (from < 0 || to !== from + 1) throw new Error(`INVALID_RELEASE_TRANSITION:${previous}->${next}`);
  return true;
}

export function protectedPath(relative) {
  const normalized = String(relative || "").replaceAll("\\", "/");
  return normalized === "archive/db.js" || normalized === "archive/question-index.js" || normalized.startsWith("archive/exams/original/") || normalized.startsWith("archive/assets/images/");
}

export function productionWritePreflight({ changedPaths, receipt }) {
  const protectedChanges = changedPaths.filter(protectedPath);
  if (!protectedChanges.length) return { status: "PASS", protectedChanges: [] };
  const required = ["candidateSha", "closureManifestSha", "sourceIdentitySetSha", "reviewedPassEnvelopeSha", "promotionTransactionId"];
  const errors = required.filter((key) => !nonEmpty(receipt?.[key]));
  if (errors.length) throw new Error(`UNAUTHORIZED_PRODUCTION_WRITE:${errors.join(",")}`);
  return { status: "PASS", protectedChanges };
}

export function makePromotionReceipt({ manifest, candidateFile, reviewFile, closureManifestFile, hardening, closure }) {
  const sourceIdentitySetSha = objectSha(hardening.identityKeys);
  return {
    schema: "PAST_EXAM_PRODUCTION_PROMOTION_RECEIPT_v1",
    status: "AUTHORIZED",
    examId: manifest.examId,
    candidateSha: hardening.candidateSha,
    closureManifestSha: closureManifestFile && fs.existsSync(closureManifestFile) ? fileSha(closureManifestFile) : "",
    sourceIdentitySetSha,
    reviewedPassEnvelopeSha: reviewFile && fs.existsSync(reviewFile) ? fileSha(reviewFile) : "",
    promotionTransactionId: `past-exam-${Date.now()}-${crypto.randomUUID()}`,
    closureInputSha: closure?.inputSha || "",
    sourceInventorySha: hardening.sourceInventorySha,
    sourceIdentityMapSha: hardening.sourceIdentityMapSha,
  };
}

export function temporaryDirectory(prefix = "past-exam-hardening-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export { canonicalJson };
