import path from "node:path";
import { writeJson } from "./report-utils.mjs";

export const STATUS_ORDER = ["pass", "ok", "partial", "blocked", "fail"];

export function normalizeStageStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value === "pass" || value === "ok") return "ok";
  if (value === "blocked") return "blocked";
  if (value === "fail" || value === "failed" || value === "error") return "fail";
  if (value === "partial" || value === "manual_review" || value === "warning") return "partial";
  return "partial";
}

export function worstStatus(statuses) {
  let worst = "ok";
  for (const status of statuses) {
    const normalized = normalizeStageStatus(status);
    if (STATUS_ORDER.indexOf(normalized) > STATUS_ORDER.indexOf(worst)) worst = normalized;
  }
  return worst;
}

export function makeStageReport(stage, fields = {}) {
  return {
    stage,
    inputFiles: fields.inputFiles || [],
    outputFiles: fields.outputFiles || [],
    missingInputs: fields.missingInputs || [],
    status: normalizeStageStatus(fields.status || "ok"),
    blockedReasons: fields.blockedReasons || [],
    manualReviewCount: Number(fields.manualReviewCount || 0),
    nextStageContract: fields.nextStageContract || {},
    ...fields.extra,
  };
}

export async function writeStageReport(cfg, fileName, report) {
  const file = path.join(cfg.reportsDir, fileName);
  await writeJson(file, report);
  return file;
}

export function summarizeStageResults(results) {
  const statuses = results.map((result) => normalizeStageStatus(result.status));
  const hasFail = statuses.includes("fail");
  const hasBlocked = statuses.includes("blocked");
  const hasPartial = statuses.includes("partial");
  return {
    stageCount: results.length,
    okCount: statuses.filter((status) => status === "ok").length,
    partialCount: statuses.filter((status) => status === "partial").length,
    blockedCount: statuses.filter((status) => status === "blocked").length,
    failCount: statuses.filter((status) => status === "fail").length,
    status: hasFail ? "fail" : hasBlocked ? "blocked" : hasPartial ? "partial" : "pass",
  };
}
