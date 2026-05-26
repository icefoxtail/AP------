import path from "node:path";
import { copyIfExists, readJson, writeJson } from "../lib/report-utils.mjs";

export default async function stage08a(cfg) {
  const copied = await copyIfExists(
    path.join(cfg.reportsDir, "text1_answer_extraction_report.json"),
    path.join(cfg.reportsDir, "quick_answer_extraction_report.json"),
  );
  const applied = await readJson(path.join(cfg.reportsDir, "text1_answer_apply_report.json"), []);
  await writeJson(path.join(cfg.reportsDir, "quick_answer_table_report.json"), {
    stage: "08A-quick-answer-table",
    mode: "reuse_existing_answer_reports",
    extractionReportCopied: copied,
    appliedCount: Array.isArray(applied) ? applied.length : 0,
    status: copied ? "ok" : "manual_review",
  });
  return { name: "08A-quick-answer-table", status: copied ? "ok" : "manual_review", appliedCount: Array.isArray(applied) ? applied.length : 0 };
}

