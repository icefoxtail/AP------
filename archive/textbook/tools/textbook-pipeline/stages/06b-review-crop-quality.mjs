import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readJson, writeJson } from "../lib/report-utils.mjs";

const execFileAsync = promisify(execFile);

function pythonExecutable(cfg) {
  const local = path.join(cfg.workspaceRoot, ".venv", "Scripts", "python.exe");
  if (fs.existsSync(local)) return local;
  return "python";
}

export default async function stage06b(cfg) {
  const script = path.join(cfg.pipelineDir, "helpers", "review_crop_quality.py");
  let helperOutput = "";
  try {
    const { stdout } = await execFileAsync(pythonExecutable(cfg), [script, cfg.generatedRoot], { timeout: 180000 });
    helperOutput = stdout.trim();
  } catch (error) {
    await writeJson(path.join(cfg.reportsDir, "question_crop_quality_validation.json"), {
      stage: "06B-review-crop-quality",
      status: "manual_review",
      error: error.stack || error.message,
    });
    return { name: "06B-review-crop-quality", status: "manual_review", error: error.message };
  }
  const summary = await readJson(path.join(cfg.reportsDir, "question_crop_quality_summary.json"), {});
  const validation = await readJson(path.join(cfg.reportsDir, "question_crop_quality_validation.json"), {});
  const status = validation.status === "ok" || summary.cropCount > 0 ? "ok" : "manual_review";
  return {
    name: "06B-review-crop-quality",
    status,
    cropCount: summary.cropCount || 0,
    passCount: summary.passCount || 0,
    warningCount: summary.warningCount || 0,
    manualReviewCount: summary.manualReviewCount || 0,
    corruptedAssetCount: summary.corruptedAssetCount || 0,
    contactSheetCount: summary.contactSheetCount || 0,
    helperOutput,
  };
}
