import path from "node:path";
import { parseArgs, loadPipelineConfig } from "./lib/config.mjs";
import { loadPipelineEnv } from "./lib/env-loader.mjs";
import { writeCodexResult, writeJson } from "./lib/report-utils.mjs";
import { normalizeStageStatus, summarizeStageResults } from "./lib/stage-result-utils.mjs";

const stages = [
  ["00", "rulebook-gate", () => import("./stages/00-rulebook-gate.mjs")],
  ["01", "detect-environment", () => import("./stages/01-detect-environment.mjs")],
  ["02", "detect-pdfs", () => import("./stages/02-detect-pdfs.mjs")],
  ["03", "read-rules-and-samples", () => import("./stages/03-read-rules-and-samples.mjs")],
  ["04", "detect-sections", () => import("./stages/04-detect-sections.mjs")],
  ["05", "page-crop", () => import("./stages/05-page-crop.mjs")],
  ["06", "question-full-crop", () => import("./stages/06-question-full-crop.mjs")],
  ["04B", "question-id-mapping-guard", () => import("./stages/04b-question-id-mapping-guard.mjs")],
  ["06B", "review-crop-quality", () => import("./stages/06b-review-crop-quality.mjs")],
  ["06C", "question-page-mapping-audit", () => import("./stages/06c-question-page-mapping-audit.mjs")],
  ["06D", "question-page-mapping-repair", () => import("./stages/06d-question-page-mapping-repair.mjs")],
  ["07", "visual-asset-crop", () => import("./stages/07-visual-asset-crop.mjs")],
  ["07A", "visual-asset-link-audit", () => import("./stages/07a-visual-asset-link-audit.mjs")],
  ["08A", "quick-answer-table", () => import("./stages/08a-quick-answer-table.mjs")],
  ["08B", "answer-solution-crop", () => import("./stages/08b-answer-solution-crop.mjs")],
  ["08C", "source-inventory", () => import("./stages/08c-source-inventory.mjs")],
  ["08D", "answer-source-ocr", () => import("./stages/08d-answer-source-ocr.mjs")],
  ["09", "build-internal-model", () => import("./stages/09-build-internal-model.mjs")],
  ["10", "emit-output-profiles", () => import("./stages/10-emit-output-profiles.mjs")],
  ["10B", "transcribe-content-choices", () => import("./stages/10b-transcribe-content-choices.mjs")],
  ["10B-SCAN", "scan-broken-formula-strings", () => import("./stages/10b-scan-broken-formula-strings.mjs")],
  ["10B-FAIL", "empty-content-cause-classify", () => import("./stages/10b-fail-empty-content-cause-classify.mjs")],
  ["10C", "answer-fill-and-verify", () => import("./stages/10c-answer-fill-and-verify.mjs")],
  ["10C-FAIL", "missing-answer-cause-classify", () => import("./stages/10c-fail-missing-answer-cause-classify.mjs")],
  ["10C-SCAN", "scan-answer-string-risk", () => import("./stages/10c-scan-answer-string-risk.mjs")],
  ["11", "validate", () => import("./stages/11-validate.mjs")],
  ["12", "formula-repair-target-extract", () => import("./stages/12-formula-repair-target-extract.mjs")],
  ["12B", "gemini-formula-patch-build", () => import("./stages/12b-gemini-formula-patch-dry-run.mjs")],
  ["12D", "apply-gemini-formula-patch", () => import("./stages/12d-apply-gemini-formula-patches.mjs")],
  ["12C", "make-input-packs", () => import("./stages/12-make-input-packs.mjs")],
  ["13", "apply-corrections", () => import("./stages/13-apply-corrections.mjs")],
  ["14", "final-pre-review-validate", () => import("./stages/14-final-pre-review-validate.mjs")],
];

const productionStageIds = new Set([
  "04B",
  "06C",
  "08C",
  "08D",
  "09",
  "10B",
  "10B-SCAN",
  "10C",
  "10C-SCAN",
  "12",
  "12D",
  "14",
]);

function selectedStages(filter) {
  if (!filter) return stages;
  return stages.filter(([id, name]) => id.toLowerCase() === filter.toLowerCase() || name === filter);
}

function productionStages(filter) {
  const plan = stages.filter(([id]) => productionStageIds.has(id));
  if (!filter) return plan;
  return plan.filter(([id, name]) => id.toLowerCase() === filter.toLowerCase() || name === filter);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await loadPipelineEnv({
    cwd: process.cwd(),
    configFile: args.config ? path.resolve(process.cwd(), args.config) : path.resolve(process.cwd(), "pipeline.config.json"),
  });
  const cfg = await loadPipelineConfig(args);
  const plan = cfg.dryRun && !cfg.stageFilter
    ? selectedStages("00")
    : cfg.mode === "production"
      ? productionStages(cfg.stageFilter)
      : selectedStages(cfg.stageFilter);
  if (cfg.dryRun) {
    const dryRunResults = [];
    for (const [id, name, loader] of plan) {
      const startedAt = new Date().toISOString();
      try {
        const mod = await loader();
        const result = await mod.default(cfg);
        if (id === "12" && result?.targetsFile) cfg.formulaRepairTargetsFile = result.targetsFile;
        dryRunResults.push({ id, name, startedAt, finishedAt: new Date().toISOString(), ...result, status: normalizeStageStatus(result.status) });
      } catch (error) {
        dryRunResults.push({ id, name, startedAt, finishedAt: new Date().toISOString(), status: "partial", error: error.stack || error.message });
      }
    }
    const execution = summarizeStageResults(dryRunResults);
    const report = {
      generatedAt: new Date().toISOString(),
      configFile: cfg.configFile,
      workspaceRoot: cfg.workspaceRoot,
      inputPdf: cfg.inputPdf,
      materialRoot: cfg.materialRoot || "",
      generatedRoot: cfg.generatedRoot,
      selectedStages: plan.map(([id, name]) => ({ id, name })),
      results: dryRunResults,
      status: execution.status === "pass" ? "dry_run_ok" : `dry_run_${execution.status}`,
      resultReportPolicy: cfg.resultReportPolicy,
      writeRootCodexResult: cfg.writeRootCodexResult,
      writeWorkspaceCodexResult: cfg.writeWorkspaceCodexResult,
      note: "No crop or JS mutation performed in dry-run mode.",
    };
    await writeJson(path.join(cfg.reportsDir, "oneclick_pipeline_dry_run_report.json"), report);
    await writeJson(path.join(cfg.reportsDir, "stage_execution_summary.json"), { ...execution, results: dryRunResults });
    await writeJson(path.join(cfg.reportsDir, "oneclick_pipeline_execution_report.json"), report);
    const finalStatus = {
      generatedAt: report.generatedAt,
      dryRun: true,
      status: report.status,
      statusPriority: ["fail", "blocked", "partial", "pass"],
      summary: execution,
      resultReportPolicy: cfg.resultReportPolicy,
      writeRootCodexResult: cfg.writeRootCodexResult,
      writeWorkspaceCodexResult: cfg.writeWorkspaceCodexResult,
    };
    await writeJson(path.join(cfg.reportsDir, "pipeline_final_status_report.json"), finalStatus);
    const codexPolicy = await writeCodexResult(cfg, {
      generatedAt: report.generatedAt,
      dryRun: true,
      status: report.status,
      stageResults: dryRunResults,
      stageSummary: execution,
      finalStatus,
    });
    report.codexResultPath = codexPolicy.codexResultPath;
    report.codexResultPolicyStatus = codexPolicy.policyStatus;
    await writeJson(path.join(cfg.reportsDir, "oneclick_pipeline_execution_report.json"), report);
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  const results = [];
  for (const [id, name, loader] of plan) {
    const startedAt = new Date().toISOString();
    try {
      const mod = await loader();
      const result = await mod.default(cfg);
      if (id === "12" && result?.targetsFile) cfg.formulaRepairTargetsFile = result.targetsFile;
      const normalized = normalizeStageStatus(result.status);
      results.push({ id, name, startedAt, finishedAt: new Date().toISOString(), ...result, status: normalized });
      console.log(`[${id}] ${name}: ${normalized}`);
    } catch (error) {
      const result = { id, name, startedAt, finishedAt: new Date().toISOString(), status: "partial", error: error.stack || error.message };
      results.push(result);
      console.log(`[${id}] ${name}: partial`);
    }
  }
  const execution = summarizeStageResults(results);
  const summary = {
    generatedAt: new Date().toISOString(),
    configFile: cfg.configFile,
    workspaceRoot: cfg.workspaceRoot,
    inputPdf: cfg.inputPdf,
    materialRoot: cfg.materialRoot || "",
    generatedRoot: cfg.generatedRoot,
    stageCount: execution.stageCount,
    okCount: execution.okCount,
    partialCount: execution.partialCount,
    blockedCount: execution.blockedCount,
    failCount: execution.failCount,
    manualReviewCount: execution.partialCount + execution.blockedCount + execution.failCount,
    results,
    status: execution.status,
    resultReportPolicy: cfg.resultReportPolicy,
    writeRootCodexResult: cfg.writeRootCodexResult,
    writeWorkspaceCodexResult: cfg.writeWorkspaceCodexResult,
  };
  await writeJson(path.join(cfg.reportsDir, "oneclick_pipeline_summary.json"), summary);
  await writeJson(path.join(cfg.reportsDir, "oneclick_pipeline_execution_report.json"), summary);
  await writeJson(path.join(cfg.reportsDir, "stage_execution_summary.json"), summary);
  const finalStatus = {
    generatedAt: summary.generatedAt,
    dryRun: false,
    status: summary.status,
    statusPriority: ["fail", "blocked", "partial", "pass"],
    summary: execution,
    resultReportPolicy: cfg.resultReportPolicy,
    writeRootCodexResult: cfg.writeRootCodexResult,
    writeWorkspaceCodexResult: cfg.writeWorkspaceCodexResult,
  };
  await writeJson(path.join(cfg.reportsDir, "pipeline_final_status_report.json"), finalStatus);
  const codexPolicy = await writeCodexResult(cfg, {
    generatedAt: summary.generatedAt,
    dryRun: false,
    status: summary.status,
    stageResults: results,
    stageSummary: execution,
    finalStatus,
  });
  summary.codexResultPath = codexPolicy.codexResultPath;
  summary.codexResultPolicyStatus = codexPolicy.policyStatus;
  await writeJson(path.join(cfg.reportsDir, "oneclick_pipeline_execution_report.json"), summary);
  await writeJson(path.join(cfg.reportsDir, "stage_execution_summary.json"), summary);
  console.log(JSON.stringify({ status: summary.status, okCount: summary.okCount, manualReviewCount: summary.manualReviewCount }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
