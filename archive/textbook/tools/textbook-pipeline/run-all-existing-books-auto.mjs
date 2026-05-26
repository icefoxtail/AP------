import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const pipelineDir = path.dirname(__filename);
const workspaceRoot = path.resolve(pipelineDir, "../..");
const runner = path.join(pipelineDir, "run-oneclick-pipeline.mjs");

const withAnswerStages = ["08A", "08B", "10B", "10D", "10C", "11", "12", "12B", "12D", "12C", "13", "14"];
const noAnswerStages = ["10B", "10D", "11", "12", "12B", "12D", "12C", "13", "14"];

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function jsonRead(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  } catch {
    return fallback;
  }
}

function jsonWrite(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function listMaterialFolders() {
  return fs.readdirSync(workspaceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(workspaceRoot, name, "generated", "js")))
    .sort((a, b) => a.localeCompare(b, "ko"));
}

function answerCandidateMap() {
  const report = jsonRead(path.join(workspaceRoot, "generated", "reports", "answer_candidate_page_crop_all_report.json"), {});
  const map = new Map();
  for (const item of Array.isArray(report.results) ? report.results : []) {
    map.set(item.book, {
      status: item.status || "",
      candidatePageCount: Number(item.candidatePageCount || 0),
    });
  }
  return map;
}

function inferBookType(bookName) {
  if (/RPM|라이트쎈|마플/.test(bookName)) return "workbook";
  return "textbook";
}

function makeConfig(bookName, hasAnswerCandidates) {
  const pdfName = `${bookName}.pdf`;
  return {
    workspaceRoot,
    inputPdf: pdfName,
    outputByInputPdfFolder: true,
    materialOutputRoot: ".",
    materialFolderName: bookName,
    projectRoot: path.resolve(workspaceRoot, "../.."),
    rulesDir: path.resolve(workspaceRoot, "../../rules"),
    archiveRoot: path.resolve(workspaceRoot, ".."),
    publisher: "",
    textbook: bookName,
    grade: "",
    bookType: inferBookType(bookName),
    bookId: bookName,
    bookIdPrefix: bookName,
    requiredNodeVersion: ">=18.0.0",
    resultReportPolicy: "generated_output_root",
    writeRootCodexResult: false,
    writeWorkspaceCodexResult: false,
    codexResultFileName: "CODEX_RESULT.md",
    outputProfiles: ["archiveCompatible", "textbookInternal", "inputPack"],
    defaultOutputProfile: "archiveCompatible",
    assetMode: "create_or_reuse",
    existingAssetsDir: "",
    existingWorkDir: "generated/work",
    recropPolicy: "missing_only",
    assetPathMode: "localRelative",
    cropDpi: 220,
    makePageCrops: false,
    makeQuestionCrops: false,
    makeVisualAssets: false,
    makeQuickAnswerTable: hasAnswerCandidates,
    makeAnswerSolutionCrops: hasAnswerCandidates,
    buildInternalModel: false,
    emitOutputProfiles: false,
    buildInputPacks: true,
    makeGeminiContentTranscribe: true,
    contentTranscribeLimit: Number(process.env.CONTENT_TRANSCRIBE_LIMIT || 0),
    makeFormulaRepairTargets: true,
    makeGeminiFormulaPatchDryRun: true,
    makeGeminiFormulaPatchAutoApply: true,
    formulaRepairLimit: 0,
    defaultSourcePolicy: "internal_only",
    defaultContentMode: "pending_input",
    contentExtractionMode: "review_index_and_formula_repair_only",
    answerFillMode: hasAnswerCandidates ? "evidence_only_report_first" : "skipped_no_answer_candidates",
    basicSectionContentMode: "pending_input",
    densePageRangeSections: [],
    densePageRangePolicy: {
      extractContent: false,
      extractChoices: false,
      usePageImage: false,
      keepQuestionIds: true,
    },
    pageRangeOverrides: [],
    agentMode: "sequential",
    subagentFallback: "sequential",
    sectionPriorityRules: {
      basic: [],
      inputTarget: [],
    },
  };
}

function runStage(configFile, stage) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(
    process.execPath,
    [runner, "--config", configFile, "--stage", stage],
    { cwd: workspaceRoot, encoding: "utf8", env: process.env },
  );
  return {
    stage,
    startedAt,
    finishedAt: new Date().toISOString(),
    exitCode: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    status: result.status === 0 ? "ok" : "failed",
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const stamp = dateStamp();
  const allBooks = listMaterialFolders();
  const groupCount = Math.max(1, Number(args["group-count"] || process.env.BATCH_GROUP_COUNT || 1));
  const groupIndex = Math.max(0, Number(args["group-index"] || process.env.BATCH_GROUP_INDEX || 0));
  const books = allBooks.filter((_, index) => groupCount <= 1 || index % groupCount === groupIndex);
  const candidates = answerCandidateMap();
  const batchName = groupCount > 1 ? `all_existing_books_auto_${stamp}_g${groupIndex + 1}of${groupCount}` : `all_existing_books_auto_${stamp}`;
  const batchRoot = path.join(workspaceRoot, "generated", "batch", batchName);
  const configRoot = path.join(batchRoot, "configs");
  const results = [];

  for (const book of books) {
    const candidate = candidates.get(book) || { status: "unknown", candidatePageCount: 0 };
    const hasAnswerCandidates = candidate.candidatePageCount > 0 || candidate.status === "has_answer_candidate_pages";
    const stages = hasAnswerCandidates ? withAnswerStages : noAnswerStages;
    const pdfExists = fs.existsSync(path.join(workspaceRoot, `${book}.pdf`));
    const configFile = path.join(configRoot, `${book.replace(/[\\/:*?"<>|]/g, "_")}.config.json`);
    jsonWrite(configFile, makeConfig(book, hasAnswerCandidates));
    const bookResult = {
      book,
      pdfExists,
      answerCandidateStatus: candidate.status,
      answerCandidatePageCount: candidate.candidatePageCount,
      answerStagesIncluded: hasAnswerCandidates,
      configFile,
      stages: [],
      status: "ok",
    };
    if (!pdfExists) {
      bookResult.status = "skipped";
      bookResult.reason = "pdf_missing";
      results.push(bookResult);
      continue;
    }
    for (const stage of stages) {
      const stageResult = runStage(configFile, stage);
      bookResult.stages.push(stageResult);
      if (stageResult.status !== "ok") bookResult.status = "partial";
    }
    results.push(bookResult);
    jsonWrite(path.join(batchRoot, "run_all_existing_books_auto_progress.json"), {
      createdAt: new Date().toISOString(),
      batchRoot,
      processedCount: results.length,
      totalCount: books.length,
      results,
    });
  }

  const summary = {
    createdAt: new Date().toISOString(),
    batchRoot,
    groupCount,
    groupIndex,
    allBookCount: allBooks.length,
    totalCount: results.length,
    okCount: results.filter((item) => item.status === "ok").length,
    partialCount: results.filter((item) => item.status === "partial").length,
    skippedCount: results.filter((item) => item.status === "skipped").length,
    withAnswerStageCount: results.filter((item) => item.answerStagesIncluded).length,
    withoutAnswerStageCount: results.filter((item) => !item.answerStagesIncluded).length,
    results,
  };
  jsonWrite(path.join(batchRoot, "run_all_existing_books_auto_summary.json"), summary);
  jsonWrite(path.join(workspaceRoot, "generated", "reports", "run_all_existing_books_auto_summary.json"), summary);
  console.log(JSON.stringify({
    status: summary.partialCount || summary.skippedCount ? "partial" : "pass",
    totalCount: summary.totalCount,
    okCount: summary.okCount,
    partialCount: summary.partialCount,
    skippedCount: summary.skippedCount,
    withAnswerStageCount: summary.withAnswerStageCount,
    withoutAnswerStageCount: summary.withoutAnswerStageCount,
    summaryFile: path.join(batchRoot, "run_all_existing_books_auto_summary.json"),
  }, null, 2));
}

main();
