import fs from "node:fs";
import path from "node:path";
import { getCodexResultPath, rel } from "./paths.mjs";

export async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

export async function exists(file) {
  try {
    await fs.promises.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await fs.promises.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

export async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.promises.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function copyIfExists(src, dest) {
  if (!(await exists(src))) return false;
  await ensureDir(path.dirname(dest));
  await fs.promises.copyFile(src, dest);
  return true;
}

export async function listFiles(dir, predicate = () => true) {
  const out = [];
  if (!(await exists(dir))) return out;
  for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await listFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

export function status(ok, note = "") {
  return { status: ok ? "ok" : "manual_review", note };
}

function bulletList(items) {
  if (!items?.length) return "- none";
  return items.map((item) => `- ${item}`).join("\n");
}

function formatStageLine(stage) {
  const name = stage.name || stage.stage || "unknown";
  const id = stage.id ? `${stage.id} ` : "";
  const statusValue = stage.status || "unknown";
  const details = [];
  if (stage.error) details.push(`error: ${String(stage.error).split("\n")[0]}`);
  if (Number.isFinite(stage.questionCount)) details.push(`questions: ${stage.questionCount}`);
  return `- ${id}${name}: ${statusValue}${details.length ? ` (${details.join(", ")})` : ""}`;
}

export function collectStageResultSummary(stageResults = []) {
  const results = Array.isArray(stageResults) ? stageResults : [];
  return {
    stageCount: results.length,
    passCount: results.filter((stage) => stage.status === "ok" || stage.status === "pass").length,
    partialCount: results.filter((stage) => stage.status === "partial" || stage.status === "manual_review").length,
    blockedCount: results.filter((stage) => stage.status === "blocked").length,
    failCount: results.filter((stage) => stage.status === "fail").length,
    stages: results.map((stage) => ({
      id: stage.id || "",
      name: stage.name || stage.stage || "",
      status: stage.status || "unknown",
      startedAt: stage.startedAt || "",
      finishedAt: stage.finishedAt || "",
      error: stage.error || "",
    })),
  };
}

export async function collectReportFileIndex(cfg) {
  const files = await listFiles(cfg.reportsDir, (file) => /\.(json|md|txt)$/i.test(file));
  return files
    .sort((a, b) => a.localeCompare(b, "ko"))
    .map((file) => rel(cfg.workspaceRoot, file));
}

export async function collectReviewPackPaths(cfg) {
  const files = await listFiles(cfg.reviewPackDir, (file) => /\.(zip|json|md)$/i.test(file));
  return files
    .sort((a, b) => a.localeCompare(b, "ko"))
    .map((file) => rel(cfg.workspaceRoot, file));
}

export function buildCodexResultMarkdown(resultData) {
  const reports = resultData.reportFiles || [];
  const reviewPacks = resultData.reviewPackPaths || [];
  const validation = resultData.validationSummary || {};
  const stageResults = resultData.stageResults || [];
  const manualReports = reports.filter((file) => /manual|unresolved|blocked|fallback|failed|issue/i.test(file));
  return `# CODEX_RESULT

## 1. 생성/수정 파일

- generatedRoot: \`${resultData.generatedRoot || ""}\`
- reportsDir: \`${resultData.reportsDir || ""}\`
- reviewPackDir: \`${resultData.reviewPackDir || ""}\`
- pipeline files modified by this run: pipeline execution reports and generated CODEX_RESULT only

## 2. 사용한 입력 파일과 기준 파일

- configFile: \`${resultData.configFile || ""}\`
- workspaceRoot: \`${resultData.workspaceRoot || ""}\`
- projectRoot: \`${resultData.projectRoot || ""}\`
- inputPdf: \`${resultData.inputPdf || ""}\`
- rulesDir: \`${resultData.rulesDir || ""}\`
- archiveRoot: \`${resultData.archiveRoot || ""}\`

## 3. stage별 실행 결과

${stageResults.length ? stageResults.map(formatStageLine).join("\n") : "- stage results not available"}

## 4. validation summary

- finalStatus: \`${resultData.status || "unknown"}\`
- dryRun: \`${Boolean(resultData.dryRun)}\`
- syntaxPass: \`${validation.syntaxPass ?? "unknown"}\`
- questionCount: \`${validation.questionCount ?? "unknown"}\`
- unmapped: \`${validation.unmapped ?? "unknown"}\`
- mappingBlocked: \`${validation.gate?.mappingBlocked ?? validation.blocked ?? "unknown"}\`
- validationReport: \`${resultData.validationReportPath || ""}\`

## 5. manual_review / unresolved / blocked / fallback reports

${bulletList(manualReports)}

## 6. review_pack 경로

${bulletList(reviewPacks)}

## 7. PASS / PARTIAL / BLOCKED / FAIL 판정

- status: \`${resultData.status || "unknown"}\`
- policyStatus: \`${resultData.policyStatus || "unknown"}\`
- resultReportPolicy: \`${resultData.resultReportPolicy || "generated_output_root"}\`
- codexResultPath: \`${resultData.codexResultPath || ""}\`

## 8. 다음 조치

- Review \`reports/stage_execution_summary.json\` and \`reports/pipeline_final_status_report.json\`.
- Resolve any manual_review, unresolved, blocked, or fallback reports before PASS.
- Keep this CODEX_RESULT.md inside the generated output root for this run.
`;
}

export async function writeCodexResult(cfg, resultData) {
  const codexResultPath = getCodexResultPath(cfg);
  if (!codexResultPath) {
    const disabledReport = {
      codexResultPath: "",
      exists: false,
      resultReportPolicy: cfg.resultReportPolicy || "generated_output_root",
      rootCodexResultWritten: false,
      workspaceCodexResultWritten: false,
      policyStatus: "disabled",
    };
    await writeJson(path.join(cfg.reportsDir, "codex_result_policy_report.json"), disabledReport);
    return disabledReport;
  }
  const reportFiles = resultData.reportFiles || await collectReportFileIndex(cfg);
  const reviewPackPaths = resultData.reviewPackPaths || await collectReviewPackPaths(cfg);
  const validationSummary = resultData.validationSummary || await readJson(path.join(cfg.reportsDir, "validation_summary.json"), {});
  const enriched = {
    ...resultData,
    generatedRoot: cfg.generatedRoot,
    reportsDir: cfg.reportsDir,
    reviewPackDir: cfg.reviewPackDir,
    configFile: cfg.configFile,
    workspaceRoot: cfg.workspaceRoot,
    projectRoot: cfg.projectRoot,
    inputPdf: cfg.inputPdf,
    rulesDir: cfg.rulesDir,
    archiveRoot: cfg.archiveRoot,
    codexResultPath,
    resultReportPolicy: cfg.resultReportPolicy || "generated_output_root",
    reportFiles,
    reviewPackPaths,
    validationSummary,
  };
  await ensureDir(path.dirname(codexResultPath));
  await fs.promises.writeFile(codexResultPath, buildCodexResultMarkdown(enriched), "utf8");
  const existsAfterWrite = await exists(codexResultPath);
  const policyReport = {
    codexResultPath,
    exists: existsAfterWrite,
    resultReportPolicy: cfg.resultReportPolicy || "generated_output_root",
    rootCodexResultWritten: cfg.resultReportPolicy === "project_root" && cfg.writeRootCodexResult === true,
    workspaceCodexResultWritten: cfg.resultReportPolicy === "workspace_root" && cfg.writeWorkspaceCodexResult === true,
    policyStatus: existsAfterWrite ? "ok" : "fail",
  };
  await writeJson(path.join(cfg.reportsDir, "codex_result_policy_report.json"), policyReport);
  return policyReport;
}
