import path from "node:path";
import { copyIfExists, readJson, writeJson } from "../lib/report-utils.mjs";

export default async function stage08b(cfg) {
  const copied = await copyIfExists(
    path.join(cfg.reportsDir, "text1_answer_solution_extraction_report.json"),
    path.join(cfg.reportsDir, "answer_solution_extraction_report.json"),
  );
  const applied = await readJson(path.join(cfg.reportsDir, "text1_answer_solution_apply_report.json"), []);
  await writeJson(path.join(cfg.reportsDir, "answer_solution_crop_report.json"), {
    stage: "08B-answer-solution-crop",
    mode: "reuse_existing_answer_solution_reports",
    extractionReportCopied: copied,
    appliedCount: Array.isArray(applied) ? applied.length : 0,
    status: copied ? "ok" : "manual_review",
  });
  return { name: "08B-answer-solution-crop", status: copied ? "ok" : "manual_review", appliedCount: Array.isArray(applied) ? applied.length : 0 };
}

