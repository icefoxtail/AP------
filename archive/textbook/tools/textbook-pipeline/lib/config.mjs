import fs from "node:fs";
import path from "node:path";
import { ensureRunOutputRoot, pipelineDir, resolveFrom } from "./paths.mjs";
import { ensureDir } from "./report-utils.mjs";

async function detectDefaultPdf(workspaceRoot) {
  const entries = await fs.promises.readdir(workspaceRoot, { withFileTypes: true });
  const pdfs = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".pdf")) continue;
    const full = path.join(workspaceRoot, entry.name);
    const stat = await fs.promises.stat(full);
    pdfs.push({ file: full, size: stat.size });
  }
  pdfs.sort((a, b) => b.size - a.size);
  return pdfs[0]?.file || "";
}

async function resolveInputPdf(raw, workspaceRoot) {
  if (raw.inputPdf) return resolveFrom(workspaceRoot, raw.inputPdf);
  return detectDefaultPdf(workspaceRoot);
}

function deriveMaterialRoot(raw, workspaceRoot, inputPdf) {
  if (!raw.outputByInputPdfFolder) return "";
  const base = resolveFrom(workspaceRoot, raw.materialOutputRoot || ".");
  const folderName = raw.materialFolderName || (inputPdf ? path.basename(inputPdf, path.extname(inputPdf)) : "unknown_pdf");
  return path.join(base, folderName);
}

export function parseArgs(argv) {
  const args = { config: null, dryRun: false, stage: null, mode: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--config") args.config = argv[++i];
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--stage") args.stage = argv[++i];
    else if (arg === "--mode") args.mode = argv[++i];
  }
  return args;
}

export async function loadPipelineConfig(args) {
  const workspaceRoot = process.cwd();
  const configFile = args.config
    ? resolveFrom(workspaceRoot, args.config)
    : path.resolve(workspaceRoot, "pipeline.config.json");
  const raw = JSON.parse(await fs.promises.readFile(configFile, "utf8"));
  const cfg = {
    ...raw,
    configFile,
    dryRun: args.dryRun,
    stageFilter: args.stage,
    mode: args.mode || raw.mode || "default",
    pipelineDir,
    resultReportPolicy: raw.resultReportPolicy || "generated_output_root",
    writeRootCodexResult: raw.writeRootCodexResult === true,
    writeWorkspaceCodexResult: raw.writeWorkspaceCodexResult === true,
    codexResultFileName: raw.codexResultFileName || "CODEX_RESULT.md",
  };
  cfg.workspaceRoot = resolveFrom(path.dirname(configFile), raw.workspaceRoot || ".");
  cfg.projectRoot = resolveFrom(cfg.workspaceRoot, raw.projectRoot || "../..");
  cfg.inputPdf = await resolveInputPdf(raw, cfg.workspaceRoot);
  cfg.materialRoot = deriveMaterialRoot(raw, cfg.workspaceRoot, cfg.inputPdf);
  cfg.generatedRoot = cfg.materialRoot
    ? path.join(cfg.materialRoot, "generated")
    : resolveFrom(cfg.workspaceRoot, raw.generatedRoot || "generated");
  cfg.runOutputRoot = cfg.generatedRoot;
  cfg.reportsDir = path.join(cfg.generatedRoot, "reports");
  cfg.workDir = path.join(cfg.generatedRoot, "work");
  cfg.jsDir = path.join(cfg.generatedRoot, "js");
  cfg.jsInternalDir = path.join(cfg.generatedRoot, "js-internal");
  cfg.internalDir = path.join(cfg.generatedRoot, "internal");
  cfg.indexDir = path.join(cfg.generatedRoot, "index");
  cfg.manifestDir = path.join(cfg.generatedRoot, "manifest");
  cfg.inputTemplatesDir = path.join(cfg.generatedRoot, "input_templates");
  cfg.inputResultsDir = path.join(cfg.generatedRoot, "input_results");
  cfg.reviewPackDir = path.join(cfg.generatedRoot, "review_pack");
  cfg.finalCleanDir = path.join(cfg.generatedRoot, "final_clean");
  cfg.draftContentDir = path.join(cfg.generatedRoot, "draft_content");
  cfg.finalAppliedDir = path.join(cfg.generatedRoot, "final_applied");
  if (cfg.mode === "production") {
    cfg.contentChoicesInputMode ??= "apply_unambiguous";
    cfg.answerFillMode ??= "apply_unambiguous";
    cfg.solveFromJsQuestionFallback ??= true;
    cfg.sourcePolicy ??= "full_page_mapping_first";
  }
  await Promise.all([
    ensureRunOutputRoot(cfg),
    ensureDir(cfg.reportsDir),
    ensureDir(cfg.workDir),
    ensureDir(cfg.internalDir),
    ensureDir(cfg.indexDir),
    ensureDir(cfg.manifestDir),
    ensureDir(cfg.inputTemplatesDir),
    ensureDir(cfg.inputResultsDir),
    ensureDir(cfg.reviewPackDir),
    ensureDir(cfg.finalCleanDir),
    ensureDir(cfg.draftContentDir),
    ensureDir(cfg.finalAppliedDir),
  ]);
  return cfg;
}
