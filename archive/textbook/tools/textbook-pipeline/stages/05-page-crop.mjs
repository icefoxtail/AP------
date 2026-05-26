import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { exists, listFiles, writeJson } from "../lib/report-utils.mjs";

const execFileAsync = promisify(execFile);

function pythonCandidates(cfg) {
  return [
    cfg.pythonExecutable,
    path.join(cfg.workspaceRoot || "", ".venv", "Scripts", "python.exe"),
    path.join(cfg.projectRoot || "", ".venv", "Scripts", "python.exe"),
    "python",
  ].filter(Boolean);
}

async function renderPageCrops(cfg, outDir) {
  const script = path.join(cfg.pipelineDir, "helpers", "render_pdf_page_crops.py");
  const errors = [];
  for (const python of pythonCandidates(cfg)) {
    try {
      const result = await execFileAsync(python, [
        script,
        "--pdf", cfg.inputPdf,
        "--out", outDir,
        "--dpi", String(cfg.cropDpi || 220),
        "--prefix", path.basename(cfg.inputPdf || "page", path.extname(cfg.inputPdf || "")),
      ], { timeout: 10 * 60 * 1000, maxBuffer: 1024 * 1024 * 20 });
      return { status: "ok", python, result: JSON.parse(result.stdout) };
    } catch (error) {
      errors.push({ python, error: String(error.message || error).split("\n")[0] });
    }
  }
  return { status: "failed", errors };
}

export default async function stage05(cfg) {
  const pageCropRoot = path.join(cfg.workDir, "page_crops");
  let pageCrops = await listFiles(pageCropRoot, (file) => file.toLowerCase().endsWith(".png"));
  let renderResult = { status: "skipped", reason: "existing_page_crops_found_or_disabled" };
  if (!pageCrops.length && cfg.makePageCrops !== false && await exists(cfg.inputPdf)) {
    const outDir = path.join(pageCropRoot, "pdf_pages");
    renderResult = await renderPageCrops(cfg, outDir);
    pageCrops = await listFiles(pageCropRoot, (file) => file.toLowerCase().endsWith(".png"));
  }
  const report = {
    stage: "05-page-crop",
    mode: pageCrops.length ? "create_or_reuse_page_crops" : "page_crops_missing",
    pageCropCount: pageCrops.length,
    inputPdf: cfg.inputPdf,
    renderResult,
    status: pageCrops.length ? "ok" : "manual_review",
    note: pageCrops.length ? "page crops available" : "no page crops found and page rendering failed or was disabled",
  };
  await writeJson(path.join(cfg.reportsDir, "page_crop_report.json"), report);
  return { name: "05-page-crop", status: report.status, pageCropCount: pageCrops.length };
}
