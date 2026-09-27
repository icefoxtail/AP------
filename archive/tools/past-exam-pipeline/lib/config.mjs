import path from "node:path";
import { readJson } from "./fs-utils.mjs";

export function parseArgs(argv) {
  const args = {
    config: "",
    inventory: false,
    createSelected: false,
    runSelected: false,
    selectedManifest: "",
    sourceRoot: "",
    workRoot: "",
    sourceOnly: false,
    prepare: false,
    recentYears: null,
    years: [],
    grade: "",
    semester: "",
    examType: "",
    limit: 0
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--config") args.config = argv[++i];
    else if (arg === "--inventory") args.inventory = true;
    else if (arg === "--create-selected") args.createSelected = true;
    else if (arg === "--run-selected") args.runSelected = true;
    else if (arg === "--selected-manifest") args.selectedManifest = argv[++i];
    else if (arg === "--source-only") args.sourceOnly = true;
    else if (arg === "--prepare") args.prepare = true;
    else if (arg === "--work-root") args.workRoot = argv[++i];
    else if (arg === "--source-root") args.sourceRoot = argv[++i];
    else if (arg === "--recent-years") args.recentYears = Number(argv[++i]);
    else if (arg === "--years") args.years = argv[++i].split(",").map((v) => v.trim()).filter(Boolean);
    else if (arg === "--year") args.years.push(argv[++i]);
    else if (arg === "--grade") args.grade = argv[++i];
    else if (arg === "--semester") args.semester = argv[++i];
    else if (arg === "--exam-type") args.examType = argv[++i];
    else if (arg === "--limit") args.limit = Number(argv[++i]);
  }
  return args;
}

export async function loadConfig(args) {
  const cwd = process.cwd();
  const configFile = args.config
    ? path.resolve(cwd, args.config)
    : path.resolve(cwd, "archive/tools/past-exam-pipeline/pipeline.config.example.json");
  const raw = await readJson(configFile, {});
  const projectRoot = path.resolve(raw.projectRoot || cwd);
  const workRoot = args.workRoot || raw.workRoot || (raw.generatedRoot ? "" : "archive-work");
  const cfg = {
    ...raw,
    configFile,
    projectRoot,
    sourceRoot: path.resolve(args.sourceRoot || raw.sourceRoot || projectRoot),
    workRoot,
    generatedRoot: raw.generatedRoot ? path.resolve(raw.generatedRoot) : undefined,
    archiveRoot: path.resolve(raw.archiveRoot || path.join(projectRoot, "archive")),
    rulesDir: path.resolve(raw.rulesDir || path.join(projectRoot, "rules")),
    defaultRecentYears: Number(raw.defaultRecentYears || 3),
    defaultQuestionCount: Number(raw.defaultQuestionCount || 0),
    candidateFileSuffix: raw.candidateFileSuffix || "",
    allowBatchRunWithoutSelectedManifest: raw.allowBatchRunWithoutSelectedManifest === true,
    args
  };
  cfg.batchDir = workRoot ? path.resolve(projectRoot, workRoot, "evidence", "batch") : path.join(cfg.generatedRoot, "_batch");
  return cfg;
}
