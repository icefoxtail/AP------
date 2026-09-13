import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { fileRef } from "../pipeline-core/canonical.mjs";
import { createReviewReady, writeReviewReady } from "./lib/review-ready.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(name + " is required");
  return process.argv[index + 1];
}

function optionalArg(name) {
  const index = process.argv.indexOf(name);
  return index < 0 ? '' : process.argv[index + 1] || '';
}

function readJson(value) {
  return JSON.parse(fs.readFileSync(path.resolve(value), "utf8"));
}

function candidateQuestions(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.resolve(file), "utf8"), context, { timeout: 3000 });
  if (!Array.isArray(context.window.questionBank)) throw new Error("CANDIDATE_QUESTION_BANK_REQUIRED");
  return context.window.questionBank;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = process.cwd();
    const candidatePath = arg("--candidate");
    const finalClosurePath = arg("--final-closure");
    const ready = createReviewReady({
      root,
      run: readJson(arg("--run")),
      closure: readJson(arg("--closure")),
      finalAudit: readJson(arg("--final-audit")),
      candidateRef: fileRef(root, path.relative(root, path.resolve(candidatePath)).split(path.sep).join("/")),
      assetRefs: readJson(arg("--asset-refs")),
      candidateQuestions: candidateQuestions(candidatePath),
      baselineQuestions: process.argv.includes("--baseline-questions") ? readJson(arg("--baseline-questions")) : [],
      visualExemptions: process.argv.includes("--visual-exemptions") ? readJson(arg("--visual-exemptions")) : {},
      renderCases: readJson(arg("--render-cases")),
      gateStatuses: readJson(arg("--gates")),
      finalClosureRef: fileRef(root, path.relative(root, path.resolve(finalClosurePath)).split(path.sep).join("/")),
      openDefectCount: Number(optionalArg("--open-defect-count") || 0),
    });
    if (ready.status !== "REVIEW_READY") throw new Error("REVIEW_READY_BLOCKED:" + ready.errors.join(";"));
    const ref = writeReviewReady(root, arg("--out"), ready);
    console.log(JSON.stringify({ status: ready.status, reviewReadyRef: ref, reviewReadySha: ready.reviewReadySha }, null, 2));
  } catch (error) {
    console.error(String(error.message || error));
    process.exitCode = 1;
  }
}
