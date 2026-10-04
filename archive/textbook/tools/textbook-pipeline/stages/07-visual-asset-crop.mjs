import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { collectQuestionBanks } from "../lib/js-archive-utils.mjs";
import { readJson, writeJson } from "../lib/report-utils.mjs";

const execFileAsync = promisify(execFile);

function normalizeItems(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  return [];
}

function padId(id) {
  return String(id).padStart(3, "0");
}

function pythonExecutable(cfg) {
  const local = path.join(cfg.workspaceRoot, ".venv", "Scripts", "python.exe");
  if (fs.existsSync(local)) return local;
  return "python";
}

export default async function stage07(cfg) {
  const banks = await collectQuestionBanks(cfg.jsDir);
  const cropMap = normalizeItems(await readJson(path.join(cfg.reportsDir, "question_crop_map.json"), []));
  const cropBySetId = new Map();
  for (const item of cropMap) {
    if (item.mappingStatus === "map_review" || item.sourceDisplayNo === null) continue;
    const id = item.jsIdCandidate || item.finalQuestionId || Number.parseInt(item.displayNo, 10);
    cropBySetId.set(`${item.setKey}:${id}`, item);
  }
  const candidates = [];
  for (const bank of banks) {
    for (const q of bank.questions) {
      if (q.image) {
        const crop = cropBySetId.get(`${bank.setKey}:${q.id}`);
        const outputPath = path.join(cfg.generatedRoot, q.image.replaceAll("/", path.sep));
        candidates.push({
          setKey: bank.setKey,
          bookPart: bank.bookPart,
          id: q.id,
          paddedId: `q${padId(q.id)}`,
          image: q.image,
          sourceCropPath: crop?.cropPath ? path.join(cfg.workspaceRoot, crop.cropPath) : "",
          outputPath,
          status: crop?.cropPath ? "asset_crop_pending" : "source_crop_missing",
        });
      }
    }
  }
  const manifestPath = path.join(cfg.workDir, "visual_asset_crop_manifest.json");
  const reportPath = path.join(cfg.reportsDir, "visual_asset_crop_report.json");
  const contactSheetPath = path.join(cfg.reportsDir, "visual_asset_contact_sheet.png");
  await writeJson(path.join(cfg.reportsDir, "visual_asset_crop_candidates.json"), candidates);
  await writeJson(manifestPath, { candidates, contactSheetPath });
  try {
    await execFileAsync(pythonExecutable(cfg), [
      path.join(cfg.pipelineDir, "helpers", "crop_visual_assets.py"),
      manifestPath,
      reportPath,
    ], { timeout: 120000 });
  } catch {
    // The helper returns non-zero when some candidates fail; the JSON report is still authoritative.
  }
  const report = await readJson(reportPath, null);
  const status = report?.status || "manual_review";
  return {
    name: "07-visual-asset-crop",
    status,
    candidateCount: candidates.length,
    createdCount: report?.createdCount || 0,
    failedCount: report?.failedCount || candidates.length,
  };
}
