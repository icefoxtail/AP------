import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stage10b from "../stages/10b-transcribe-content-choices.mjs";
import { ensureDir, writeJson } from "../lib/report-utils.mjs";

const pipelineDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(process.cwd());

async function exists(target) {
  try {
    await fs.promises.access(target);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const folders = [];
  for (const entry of await fs.promises.readdir(workspaceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folder = path.join(workspaceRoot, entry.name);
    const generatedRoot = path.join(folder, "generated");
    if (await exists(path.join(generatedRoot, "js"))) folders.push({ name: entry.name, folder, generatedRoot });
  }

  const results = [];
  for (const item of folders) {
    const cfg = {
      workspaceRoot,
      projectRoot: path.resolve(workspaceRoot, "../.."),
      materialRoot: item.folder,
      generatedRoot: item.generatedRoot,
      reportsDir: path.join(item.generatedRoot, "reports"),
      draftContentDir: path.join(item.generatedRoot, "draft_content"),
      jsDir: path.join(item.generatedRoot, "js"),
      pipelineDir,
      contentExtractionMode: "manual_or_gpt_assisted",
    };
    await ensureDir(cfg.reportsDir);
    await ensureDir(cfg.draftContentDir);
    try {
      const result = await stage10b(cfg);
      results.push({ folder: item.name, ...result });
      console.log(`[10B] ${item.name}: ${result.status}`);
    } catch (error) {
      results.push({ folder: item.name, status: "fail", error: error.stack || error.message });
      console.log(`[10B] ${item.name}: fail`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    folderCount: folders.length,
    results,
    status: results.some((item) => item.status === "fail") ? "partial" : "ok",
  };
  const out = path.join(workspaceRoot, "generated", "2026-05-23_pipeline_results", "run_10b_all_generated_report.json");
  await writeJson(out, report);
  console.log(JSON.stringify({ report: out, folderCount: folders.length, status: report.status }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
