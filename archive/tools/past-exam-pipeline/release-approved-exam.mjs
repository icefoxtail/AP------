import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fileRef, objectSha, writeNewJson } from "../pipeline-core/canonical.mjs";
import { createReleaseTransaction, assertExternalApproval, assertProductionSmokeRender, assertTargetParity } from "./lib/release-authority.mjs";
import { assetSetSha, assertStagingOutput } from "./lib/production-boundary.mjs";
import { assertReviewReady } from "./lib/review-ready.mjs";
import { promoteApprovedExam } from "./promote-reviewed-exam.mjs";
import { loadProductionBank, loadTargetDbEntry, loadTargetIndexRows, rebuildApprovedIndex, registerApprovedExam } from "./register-approved-exam.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, "../../..");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function relative(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function targetDbEntry(root, dbEntryFile, examId) {
  const entry = readJson(dbEntryFile);
  if (entry.examId && entry.examId !== examId) throw new Error("DB_ENTRY_EXAM_ID_MISMATCH");
  return entry;
}

function productionSmokeBinding(repoRoot, manifest, reviewReady, production, currentDbEntry, indexRows) {
  const productionJs = fileRef(repoRoot, relative(repoRoot, production.file));
  const productionAssets = (reviewReady.assetRefs || []).map(ref => fileRef(repoRoot, "archive/assets/images/" + manifest.examId + "/" + path.basename(String(ref.path))));
  const dbRef = fileRef(repoRoot, "archive/db.js");
  const indexRef = fileRef(repoRoot, "archive/question-index.js");
  return {
    examId: manifest.examId,
    productionJsSha256: productionJs.sha256,
    productionAssetSetSha256: assetSetSha(productionAssets),
    questionCount: production.questionCount,
    dbTarget: { file: currentDbEntry.file, qCount: currentDbEntry.qCount, entrySha256: objectSha(currentDbEntry), dbFileSha256: dbRef.sha256 },
    indexTarget: { sourceFile: manifest.archiveRelativePath.replaceAll("\\", "/"), qCount: indexRows.length, targetSha256: objectSha(indexRows), indexFileSha256: indexRef.sha256 },
  };
}

export function executeApprovedRelease({
  root = defaultRoot,
  manifest,
  candidateFile,
  reviewFile,
  reviewReady,
  approval,
  assetsDir,
  dbEntry,
  dbBaselineSha256,
  indexBaselineSha256,
  smokeReport,
  replaceExisting = false,
  dependencies = {},
} = {}) {
  const repoRoot = path.resolve(root);
  const stages = ["REVIEW_READY"];
  try {
    const candidateRef = reviewReady?.candidateRef || fileRef(repoRoot, relative(repoRoot, candidateFile));
    const assetRefs = reviewReady?.assetRefs || [];
    assertReviewReady(reviewReady, { root: repoRoot, candidateRef, assetRefs });
    assertExternalApproval({ root: repoRoot, reviewReady, approval, candidateRef, assetRefs });
    stages.push("EXTERNAL_APPROVED");
    if (!manifest?.examId || !manifest.archiveRelativePath) throw new Error("RELEASE_MANIFEST_IDENTITY_REQUIRED");
    if (!dbEntry) throw new Error("APPROVED_DB_ENTRY_REQUIRED");
    if (!dbBaselineSha256 || !indexBaselineSha256) throw new Error("RELEASE_BASELINE_SHA_REQUIRED");
    if (approval.dbBaselineSha256 !== dbBaselineSha256) throw new Error("APPROVAL_DB_BASELINE_SHA_MISMATCH");
    if (approval.indexBaselineSha256 !== indexBaselineSha256) throw new Error("APPROVAL_INDEX_BASELINE_SHA_MISMATCH");

    const promote = dependencies.promote || promoteApprovedExam;
    stages.push("PROMOTE_APPROVED_EXAM");
    const promotion = promote({ root: repoRoot, manifest, candidateFile, reviewFile, reviewReady, approval, assetsDir, replaceExisting });
    const liveJs = path.resolve(repoRoot, "archive", "exams", manifest.archiveRelativePath);
    const liveCandidateSha = fileRef(repoRoot, relative(repoRoot, liveJs)).sha256;
    if (liveCandidateSha !== reviewReady.candidateSha256) throw new Error("PROMOTION_CANDIDATE_PARITY_FAIL");
    stages.push("PROMOTION_PARITY_PASS");

    const register = dependencies.register || registerApprovedExam;
    stages.push("REGISTER_APPROVED_EXAM");
    const registered = register({ root: repoRoot, examId: manifest.examId, targetFile: manifest.archiveRelativePath, dbEntry, expectedDbSha256: dbBaselineSha256, reviewReady, approval, promotion });
    const production = loadProductionBank(repoRoot, manifest.archiveRelativePath);
    const currentDbEntry = loadTargetDbEntry(repoRoot, "archive/db.js", manifest.archiveRelativePath);
    if (!currentDbEntry || currentDbEntry.file !== manifest.archiveRelativePath || currentDbEntry.qCount !== production.questionCount) throw new Error("DB_TARGET_PARITY_FAIL");
    stages.push("DB_TARGET_PARITY_PASS");

    const rebuild = dependencies.rebuildIndex || rebuildApprovedIndex;
    stages.push("INDEX_REBUILD");
    const indexed = rebuild({ root: repoRoot, examId: manifest.examId, targetFile: manifest.archiveRelativePath, dbEntry: currentDbEntry, expectedIndexSha256: indexBaselineSha256, registration: registered });
    const indexRows = loadTargetIndexRows(repoRoot, "archive/question-index.js", manifest.archiveRelativePath);
    assertTargetParity({ examId: manifest.examId, targetFile: manifest.archiveRelativePath.replaceAll("\\", "/"), questionCount: production.questionCount, dbEntry: currentDbEntry, indexRows });
    stages.push("INDEX_TARGET_PARITY_PASS");

    const smokeBinding = productionSmokeBinding(repoRoot, manifest, reviewReady, production, currentDbEntry, indexRows);
    const smoke = dependencies.smoke || assertProductionSmokeRender;
    stages.push("PRODUCTION_SMOKE_RENDER");
    smoke(smokeReport, production.questionCount, smokeBinding);
    stages.push("DONE");
    const transaction = createReleaseTransaction({ reviewReady, approval, stages, status: "DONE" });
    return { ...transaction, productionAuthorized: true, productionSmokeBinding: smokeBinding, promotion, registered, indexed };
  } catch (error) {
    const failure = { phase: stages[stages.length - 1], code: error.message };
    return { ...createReleaseTransaction({ reviewReady, approval, stages, status: "HOLD", failure }), status: "HOLD", productionAuthorized: false, failure };
  }
}

function arg(name, argv = process.argv) {
  const index = argv.indexOf(name);
  if (index < 0 || !argv[index + 1]) throw new Error(name + " is required");
  return path.resolve(argv[index + 1]);
}

function scalarArg(name, argv = process.argv) {
  const index = argv.indexOf(name);
  if (index < 0 || !argv[index + 1]) throw new Error(name + " is required");
  return argv[index + 1];
}

function main() {
  const root = defaultRoot;
  const reviewReady = readJson(arg("--review-ready"));
  const approval = readJson(arg("--approval-receipt"));
  const manifest = readJson(arg("--manifest"));
  const dbEntry = targetDbEntry(root, arg("--db-entry"), manifest.examId);
  const smokeReport = readJson(arg("--smoke-report"));
  const result = executeApprovedRelease({
    root,
    manifest,
    candidateFile: arg("--candidate"),
    reviewFile: arg("--review"),
    reviewReady,
    approval,
    assetsDir: arg("--assets"),
    dbEntry,
    dbBaselineSha256: scalarArg("--db-baseline-sha256"),
    indexBaselineSha256: scalarArg("--index-baseline-sha256"),
    smokeReport,
    replaceExisting: process.argv.includes("--replace-existing"),
  });
  if (process.argv.includes("--out")) {
    const output = arg("--out");
    assertStagingOutput(root, output, "RELEASE_TRANSACTION_OUTPUT_FORBIDDEN");
    writeNewJson(output, result);
  }
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== "DONE") process.exitCode = 1;
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] || "")) main();
