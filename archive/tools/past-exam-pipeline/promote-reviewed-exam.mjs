import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import { assertPastExamPromotion, productionWritePreflight } from "./lib/hardening.mjs";
import { assertExternalApproval } from "./lib/release-authority.mjs";
import { assertProductionPayloadClean, assertPromotionWriteScope, assertStagingOutput } from "./lib/production-boundary.mjs";
import { assertReviewReady } from "./lib/review-ready.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, "../../..");

function arg(name, argv = process.argv) {
  const index = argv.indexOf(name);
  if (index < 0 || !argv[index + 1]) throw new Error(name + " is required");
  return path.resolve(argv[index + 1]);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadCandidate(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 3000 });
  if (!Array.isArray(context.window.questionBank)) throw new Error("CANDIDATE_QUESTION_BANK_REQUIRED");
  return context.window;
}

function relative(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

export function promoteApprovedExam({
  root = defaultRoot,
  manifest,
  candidateFile,
  reviewFile,
  reviewReady,
  approval,
  assetsDir,
  replaceExisting = false,
} = {}) {
  if (!manifest || !candidateFile || !reviewFile || !reviewReady || !approval || !assetsDir) throw new Error("PROMOTION_INPUT_REQUIRED");
  const repoRoot = path.resolve(root);
  assertStagingOutput(repoRoot, candidateFile, "PROMOTION_CANDIDATE_PRODUCTION_FORBIDDEN");
  assertStagingOutput(repoRoot, assetsDir, "PROMOTION_ASSET_ROOT_PRODUCTION_FORBIDDEN");
  const candidate = loadCandidate(candidateFile);
  const candidateRef = reviewReady.candidateRef || { path: relative(repoRoot, candidateFile) };
  const assetRefs = reviewReady.assetRefs || [];
  assertReviewReady(reviewReady, { root: repoRoot, candidateRef, assetRefs });
  assertExternalApproval({ root: repoRoot, reviewReady, approval, candidateRef, assetRefs });
  assertProductionPayloadClean(candidate);
  const candidateAssetNames = [...new Set(candidate.questionBank.flatMap(question => [question.image, question.solutionImage].filter(Boolean).map(value => path.basename(String(value)))))].sort();
  const approvedAssetNames = [...new Set(assetRefs.map(ref => path.basename(String(ref.path))))].sort();
  if (JSON.stringify(candidateAssetNames) !== JSON.stringify(approvedAssetNames)) throw new Error("PROMOTION_ASSET_SET_SCOPE_MISMATCH");
  const review = readJson(reviewFile);
  const hardening = assertPastExamPromotion({ candidateFile, manifest, review, reviewFile });
  if (candidate.examTitle !== manifest.examId) throw new Error("EXAM_IDENTITY_MISMATCH");
  if (candidate.questionBank.length !== review.questionCount) throw new Error("QUESTION_COUNT_MISMATCH");
  if (!manifest.archiveRelativePath) throw new Error("ARCHIVE_RELATIVE_PATH_REQUIRED");

  const liveRoot = path.resolve(repoRoot, "archive", "exams");
  const liveJs = path.resolve(liveRoot, manifest.archiveRelativePath);
  if (!liveJs.startsWith(liveRoot + path.sep)) throw new Error("TARGET_PRODUCTION_JS_ESCAPE");
  if (fs.existsSync(liveJs) && !replaceExisting) throw new Error("LIVE_JS_EXISTS_REPLACE_EXPLICIT_REQUIRED");
  const liveAssetsDir = path.resolve(repoRoot, "archive", "assets", "images", manifest.examId);
  const expectedPrefix = "assets/images/" + manifest.examId + "/";
  const assetSources = new Map();
  for (const question of candidate.questionBank) {
    for (const field of ["image", "solutionImage"]) {
      const value = String(question[field] || "").replaceAll("\\", "/");
      if (!value) continue;
      if (!value.startsWith(expectedPrefix) || value.includes("..")) throw new Error("NON_CANONICAL_PROMOTION_ASSET:q" + question.id + ":" + field);
      const name = path.basename(value);
      if (!name || name === "." || name === path.sep) throw new Error("PROMOTION_ASSET_NAME_INVALID");
      assetSources.set(name, value);
    }
  }
  const copyPlan = [...assetSources.entries()].map(([name, archiveRelative]) => {
    const source = path.resolve(assetsDir, name);
    const destination = path.resolve(liveAssetsDir, name);
    if (!source.startsWith(path.resolve(assetsDir) + path.sep)) throw new Error("STAGED_ASSET_SOURCE_ESCAPE");
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) throw new Error("STAGED_ASSET_MISSING:" + source);
    return { name, archiveRelative, source, destination };
  });
  const changedPaths = [relative(repoRoot, liveJs), ...copyPlan.map(item => relative(repoRoot, item.destination))];
  assertPromotionWriteScope(repoRoot, changedPaths, {
    targetProductionJs: relative(repoRoot, liveJs),
    targetAssetRoot: relative(repoRoot, liveAssetsDir),
  });
  productionWritePreflight({
    root: repoRoot,
    changedPaths,
    receipt: approval,
    candidateFile,
    phase: "PROMOTE_APPROVED_EXAM",
    targetProductionJs: relative(repoRoot, liveJs),
    targetAssetRoot: relative(repoRoot, liveAssetsDir),
  });

  if (copyPlan.length) fs.mkdirSync(liveAssetsDir, { recursive: true });
  for (const item of copyPlan) fs.copyFileSync(item.source, item.destination);
  fs.mkdirSync(path.dirname(liveJs), { recursive: true });
  fs.copyFileSync(candidateFile, liveJs);
  return {
    status: "PROMOTED",
    productionAuthorized: false,
    examId: manifest.examId,
    liveJs: relative(repoRoot, liveJs),
    liveAssetsDir: relative(repoRoot, liveAssetsDir),
    questionCount: candidate.questionBank.length,
    assetCount: copyPlan.length,
    candidateSha256: hardening.candidateSha,
    changedPaths,
  };
}

function main() {
  const result = promoteApprovedExam({
    root: defaultRoot,
    manifest: readJson(arg("--manifest")),
    candidateFile: arg("--candidate"),
    reviewFile: arg("--review"),
    reviewReady: readJson(arg("--review-ready")),
    approval: readJson(arg("--approval-receipt")),
    assetsDir: arg("--assets"),
    replaceExisting: process.argv.includes("--replace-existing"),
  });
  console.log(JSON.stringify(result, null, 2));
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] || "")) main();
