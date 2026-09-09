import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { requireProductionClosure } from "../pipeline-core/integration.mjs";
import {
  assertPastExamPromotion,
  makePromotionReceipt,
  productionWritePreflight,
} from "./lib/hardening.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const archiveRoot = path.resolve(here, "../..");

function arg(name, argv = process.argv) {
  const index = argv.indexOf(name);
  if (index < 0 || !argv[index + 1]) throw new Error(`${name} is required`);
  return path.resolve(argv[index + 1]);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadCandidate(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.window;
}

function isNonEmpty(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function loadSubunitMaster(root) {
  const file = path.join(root, "data", "master_tables", "js_archive_tag_master.json");
  const rows = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(rows) ? rows.filter((row) => isNonEmpty(row?.subUnitKey)) : [];
}

function writeCandidate(file, candidate) {
  const source = [
    `window.examTitle = ${JSON.stringify(candidate.examTitle)};`,
    `window.questionBank = ${JSON.stringify(candidate.questionBank, null, 2)};`,
    "",
  ].join("\n");
  fs.writeFileSync(file, source, "utf8");
}

export function promotionSourceIdentityScope(candidate, identities) {
  return identities.map(identity => ({
    sourceIdentityKey: identity.sourceIdentityKey,
    sourceDocumentSha256: identity.sourceDocumentSha256,
    sourceQuestionNo: identity.sourceQuestionNo,
    sourcePageNo: identity.sourcePageNo,
    sourcePageEvidencePaths: identity.sourcePageEvidencePaths,
    qid: candidate.questionBank.find(question => question.sourceIdentityKey === identity.sourceIdentityKey)?.id,
  }));
}

export function runPromotion({ argv = process.argv, archiveRootOverride = archiveRoot, quiet = false } = {}) {
  const manifestFile = arg("--manifest", argv);
  const candidateFile = arg("--candidate", argv);
  const reviewFile = arg("--review", argv);
  const assetsDir = arg("--assets", argv);
  const closureManifestFile = arg("--closure-manifest", argv);
  const replaceExisting = argv.includes("--replace-existing");
  const projectRoot = path.resolve(archiveRootOverride, "..");
  const manifest = readJson(manifestFile);
  const review = readJson(reviewFile);
  const candidate = loadCandidate(candidateFile);
  // A reviewed_pass string cannot authorize copying unbound/stale evidence.
  // All source, fidelity, math, asset, serialization, and handoff bindings are
  // checked before any protected destination is created.
  const hardening = assertPastExamPromotion({ candidateFile, manifest, review, reviewFile });
  const masterRows = loadSubunitMaster(archiveRootOverride);
  if (review.examId !== manifest.examId || candidate.examTitle !== manifest.examId) throw new Error("exam identity mismatch");
  if (!Array.isArray(candidate.questionBank) || candidate.questionBank.length !== review.questionCount) throw new Error("question count mismatch");
  const ids = candidate.questionBank.map((question) => question.id);
  if (ids.some((id, index) => id !== index + 1)) throw new Error("question ids must be sequential from 1");
  if (!manifest.archiveRelativePath) throw new Error("manifest.archiveRelativePath is required");
  const required = ["level", "category", "originalCategory", "standardCourse", "standardUnitKey", "standardUnit", "standardUnitOrder", "questionType", "layoutTag", "tags", "wide", "content", "choices", "answer", "solution", ...["subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"]];
  const nonEmptyRequired = ["content", "answer", "solution", "subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"];
  const confidenceValues = new Set(["existing_preserved", "candidate_evidence", "category_or_cue_inferred", "rule_inferred"]);
  const depthValues = new Set(["complete_candidate", "complete_category", "complete_documented", "complete_rule"]);
  for (const question of candidate.questionBank) {
    for (const key of required) if (!(key in question)) throw new Error(`q${question.id} missing ${key}`);
    for (const key of nonEmptyRequired) if (!isNonEmpty(question[key])) throw new Error(`q${question.id} empty ${key}`);
    if (!confidenceValues.has(question.subUnitConfidence)) throw new Error(`q${question.id} invalid subUnitConfidence`);
    if (!depthValues.has(question.subUnitClassificationDepth)) throw new Error(`q${question.id} invalid subUnitClassificationDepth`);
    const masterMatch = masterRows.find((row) =>
      row.subUnitKey === question.subUnitKey &&
      row.standardUnitKey === question.standardUnitKey &&
      row.labelKo === question.subUnit &&
      row.status !== "deprecated"
    );
    if (!masterMatch) throw new Error(`q${question.id} subunit master mismatch`);
  }

  const liveRoot = path.resolve(archiveRootOverride, "exams");
  const liveJs = path.resolve(liveRoot, manifest.archiveRelativePath);
  if (!liveJs.startsWith(`${liveRoot}${path.sep}`)) throw new Error("manifest.archiveRelativePath escapes archive/exams");
  if (fs.existsSync(liveJs) && !replaceExisting) throw new Error(`live JS already exists: ${liveJs}`);

  const liveAssetsDir = path.join(archiveRootOverride, "assets", "images", manifest.examId);
  const expectedPrefix = `assets/images/${manifest.examId}/`;
  const assetSources = new Map();
  const reviewedQuestionBytes = JSON.stringify(candidate.questionBank);
  function canonicalizeAsset(question, field) {
    const value = String(question[field] || "");
    if (!value) return;
    if (value.startsWith(expectedPrefix)) {
      assetSources.set(path.basename(value), value);
      return;
    }
    if (value.startsWith("assets/") && !value.includes("/images/")) {
      const canonical = `${expectedPrefix}${path.basename(value)}`;
      question[field] = canonical;
      if (field === "image" && question.visualAsset === value) question.visualAsset = canonical;
      assetSources.set(path.basename(canonical), canonical);
      return;
    }
    throw new Error(`q${question.id} ${field} path mismatch`);
  }
  for (const question of candidate.questionBank) {
    canonicalizeAsset(question, "image");
    canonicalizeAsset(question, "solutionImage");
  }
  if (JSON.stringify(candidate.questionBank) !== reviewedQuestionBytes) throw new Error('candidate asset paths must be canonical BEFORE independent review and closure');
  // Validate the complete copy plan before the first destination write.
  const copyPlan = [...assetSources.values()].map(canonical => {
    const name = path.basename(canonical);
    const source = path.join(assetsDir, name);
    if (!fs.existsSync(source)) throw new Error(`missing generated asset: ${source}`);
    return { source, destination: path.join(liveAssetsDir, name) };
  });
  const expectedSourceIdentities = promotionSourceIdentityScope(candidate, hardening.identities);
  const commonClosure = requireProductionClosure(
    projectRoot,
    'past-exam',
    argv,
    [candidateFile, ...copyPlan.map(item => item.source)],
    expectedSourceIdentities,
  );
  const receipt = makePromotionReceipt({
    manifest,
    candidateFile,
    reviewFile,
    closureManifestFile,
    hardening,
    closure: commonClosure,
  });
  productionWritePreflight({
    changedPaths: [`archive/exams/${manifest.archiveRelativePath}`, ...copyPlan.map(item => path.relative(projectRoot, item.destination))],
    receipt,
    candidateFile,
    reviewFile,
    closureManifestFile,
    expectedSourceIdentities,
    closure: commonClosure,
  });
  const receiptFile = path.join(path.dirname(candidateFile), "..", "reports", "production_promotion_receipt.json");
  if (fs.existsSync(receiptFile)) throw new Error(`PROMOTION_RECEIPT_ALREADY_EXISTS:${receiptFile}`);
  fs.mkdirSync(path.dirname(receiptFile), { recursive: true });
  fs.writeFileSync(receiptFile, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  if (assetSources.size) fs.mkdirSync(liveAssetsDir, { recursive: true });
  for (const { source, destination } of copyPlan) fs.copyFileSync(source, destination);
  fs.mkdirSync(path.dirname(liveJs), { recursive: true });
  // Preserve the exact reviewed bytes; never reserialize after SHA-bound review.
  fs.copyFileSync(candidateFile, liveJs);
  const result = { status: "promoted", commonClosure, receipt, receiptFile, examId: manifest.examId, liveJs, liveAssetsDir, questionCount: candidate.questionBank.length, assetCount: assetSources.size };
  if (!quiet) console.log(JSON.stringify(result, null, 2));
  return result;
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] || "")) runPromotion();
