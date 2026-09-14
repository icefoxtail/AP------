import path from "node:path";
import { parseArgs, loadConfig } from "./lib/config.mjs";
import { ensureDir, listPdfFiles, readJson, rel, writeJson } from "./lib/fs-utils.mjs";
import { buildManifestFromInventoryItem, parseExamPdfMetadata } from "./lib/exam-id.mjs";
import { runOneExam } from "./run-one-exam.mjs";

function toFullYear(twoDigit) {
  const n = Number(twoDigit);
  if (!Number.isFinite(n)) return 0;
  return n >= 70 ? 1900 + n : 2000 + n;
}

function normalizeExamType(value) {
  if (!value) return "";
  if (value === "mid" || value === "중간") return "mid";
  if (value === "final" || value === "기말") return "final";
  return value;
}

function filterInventory(items, cfg) {
  const args = cfg.args;
  let selected = items.filter((item) => item.parseStatus === "parsed" && item.pdfKind === "problem");
  if (args.years.length) {
    const years = new Set(args.years.map((y) => String(y).slice(-2)));
    selected = selected.filter((item) => years.has(item.year));
  } else {
    const recentYears = Number(args.recentYears || cfg.defaultRecentYears || 0);
    if (recentYears > 0) {
      const fullYears = selected.map((item) => toFullYear(item.year)).filter(Boolean);
      const maxYear = Math.max(...fullYears);
      const minYear = maxYear - recentYears + 1;
      selected = selected.filter((item) => toFullYear(item.year) >= minYear);
    }
  }
  if (args.grade) selected = selected.filter((item) => item.grade === args.grade);
  if (args.semester) selected = selected.filter((item) => item.semester === args.semester.replace(/\D/g, ""));
  if (args.examType) selected = selected.filter((item) => item.examType === normalizeExamType(args.examType));
  if (args.limit > 0) selected = selected.slice(0, args.limit);
  return selected;
}

function makeManifests(items, cfg) {
  const seen = new Map();
  return items.map((item) => {
    const count = seen.get(item.examId) || 0;
    seen.set(item.examId, count + 1);
    return buildManifestFromInventoryItem(item, cfg, count);
  });
}

function summarizeJobResult(job, result, index) {
  return {
    index,
    examId: job.examId,
    pdfPath: job.pdfPath,
    outputDir: job.outputDir,
    status: result?.status || "unknown",
    currentStage: result?.currentStage || "",
    candidateFile: result?.candidateFile || "",
    questionCount: result?.questionCount ?? 0,
    cropCount: result?.cropCount ?? 0,
    contentTranscriptionQueue: result?.contentTranscriptionQueue || "",
    answerMappingQueue: result?.answerMappingQueue || "",
    continuityReport: result?.continuityReport || "",
    nextActions: result?.nextActions || "",
    blockedReasons: result?.blockedReasons || [],
    nextStages: result?.nextStages || [],
  };
}

async function writeBatchProgress(cfg, manifestFile, jobs, results, active = null) {
  const rows = jobs.map((job, index) => {
    const result = results[index] || null;
    if (!result) {
      return {
        index: index + 1,
        examId: job.examId,
        pdfPath: job.pdfPath,
        outputDir: job.outputDir,
        status: active === index ? "in_progress" : "pending",
        currentStage: active === index ? "running" : "not_started",
        candidateFile: "",
        questionCount: 0,
        cropCount: 0,
        contentTranscriptionQueue: "",
        answerMappingQueue: "",
        continuityReport: "",
        nextActions: "",
        blockedReasons: [],
        nextStages: [],
      };
    }
    return summarizeJobResult(job, result, index + 1);
  });
  const readyForSubagents = rows
    .filter((row) => row.contentTranscriptionQueue || row.answerMappingQueue)
    .map((row) => ({
      index: row.index,
      examId: row.examId,
      contentTranscriptionQueue: row.contentTranscriptionQueue,
      answerMappingQueue: row.answerMappingQueue,
      nextActions: row.nextActions,
      allowedParallelWork: [
        row.contentTranscriptionQueue ? "content_choices_transcription" : "",
        row.answerMappingQueue ? "answer_mapping" : "",
      ].filter(Boolean),
    }));
  const progress = {
    generatedAt: new Date().toISOString(),
    selectedManifest: manifestFile,
    jobCount: jobs.length,
    completedCount: rows.filter((row) => !["pending", "in_progress"].includes(row.status)).length,
    pendingCount: rows.filter((row) => row.status === "pending").length,
    partialCount: rows.filter((row) => row.status === "partial" || row.status === "manual_review").length,
    failCount: rows.filter((row) => row.status === "fail" || row.status === "blocked").length,
    active,
    rows,
    readyForSubagents,
    oneStopPolicy: "a job may become partial/fail, but batch execution continues to the next selected PDF",
  };
  await writeJson(path.join(cfg.batchDir, "batch_progress.json"), progress);
  await writeJson(path.join(cfg.batchDir, "subagent_worklist.json"), {
    generatedAt: progress.generatedAt,
    selectedManifest: manifestFile,
    items: readyForSubagents,
  });
  return progress;
}

async function buildInventory(cfg) {
  await ensureDir(cfg.batchDir);
  const pdfs = await listPdfFiles(cfg.sourceRoot);
  const items = pdfs.map((pdf) => ({
    ...parseExamPdfMetadata(pdf.file, cfg.sourceRoot),
    size: pdf.size,
    pdfPath: pdf.file,
    pdfPathRelative: rel(cfg.sourceRoot, pdf.file)
  }));
  const sourceGroups = new Map();
  for (const item of items) {
    const key = item.sourceGroupKey;
    const group = sourceGroups.get(key) || { problem: [], answer: [], solution: [] };
    group[item.pdfKind]?.push(item.pdfPath);
    sourceGroups.set(key, group);
  }
  for (const item of items) {
    const group = sourceGroups.get(item.sourceGroupKey);
    item.answerPdfPath = group?.answer?.[0] || "";
    item.solutionPdfPath = group?.solution?.[0] || "";
    item.hasProblemPdf = Boolean(group?.problem?.length);
    item.hasAnswerPdf = Boolean(group?.answer?.length);
    item.hasSolutionPdf = Boolean(group?.solution?.length);
  }
  const duplicateGroups = new Map();
  for (const item of items.filter((entry) => entry.pdfKind === "problem")) {
    if (!item.examId) continue;
    const list = duplicateGroups.get(item.examId) || [];
    list.push(item.pdfPathRelative);
    duplicateGroups.set(item.examId, list);
  }
  const duplicates = [...duplicateGroups.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([examId, files]) => ({ examId, files }));
  const inventory = {
    generatedAt: new Date().toISOString(),
    sourceRoot: cfg.sourceRoot,
    pdfCount: items.length,
    problemPdfCount: items.filter((item) => item.pdfKind === "problem").length,
    answerPdfCount: items.filter((item) => item.pdfKind === "answer").length,
    solutionPdfCount: items.filter((item) => item.pdfKind === "solution").length,
    parsedCount: items.filter((item) => item.parseStatus === "parsed").length,
    parsedProblemCount: items.filter((item) => item.parseStatus === "parsed" && item.pdfKind === "problem").length,
    manualReviewCount: items.filter((item) => item.parseStatus !== "parsed").length,
    duplicateExamIdCount: duplicates.length,
    items
  };
  await writeJson(path.join(cfg.batchDir, "pdf_inventory.json"), inventory);
  await writeJson(path.join(cfg.batchDir, "duplicate_pdf_report.json"), { generatedAt: inventory.generatedAt, duplicates });
  await writeJson(path.join(cfg.batchDir, "filename_parse_review.json"), {
    generatedAt: inventory.generatedAt,
    items: items.filter((item) => item.parseStatus !== "parsed")
  });
  return inventory;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = await loadConfig(args);
  const needsInventory = args.inventory || args.createSelected || (!args.selectedManifest && !args.runSelected);
  const inventory = needsInventory ? await buildInventory(cfg) : null;
  if (args.createSelected) {
    const selectedItems = filterInventory(inventory.items, cfg);
    const manifests = makeManifests(selectedItems, cfg);
    const selectedManifest = {
      generatedAt: new Date().toISOString(),
      sourceRoot: cfg.sourceRoot,
      filters: {
        recentYears: args.recentYears || cfg.defaultRecentYears,
        years: args.years,
        grade: args.grade,
        semester: args.semester,
        examType: args.examType,
        limit: args.limit
      },
      jobCount: manifests.length,
      jobs: manifests
    };
    await writeJson(path.join(cfg.batchDir, "selected_manifest.json"), selectedManifest);
    console.log(JSON.stringify({ status: "selected_manifest_created", jobCount: manifests.length, file: path.join(cfg.batchDir, "selected_manifest.json") }, null, 2));
    return;
  }
  if (args.runSelected) {
    const manifestFile = args.selectedManifest ? path.resolve(process.cwd(), args.selectedManifest) : path.join(cfg.batchDir, "selected_manifest.json");
    if (!args.selectedManifest && !cfg.allowBatchRunWithoutSelectedManifest) {
      throw new Error("--run-selected requires --selected-manifest or an existing _batch/selected_manifest.json");
    }
    const selectedManifest = await readJson(manifestFile);
    if (!selectedManifest?.jobs?.length) throw new Error("selected manifest has no jobs");
    const results = [];
    await writeBatchProgress(cfg, manifestFile, selectedManifest.jobs, results, null);
    for (const [index, job] of selectedManifest.jobs.entries()) {
      await writeBatchProgress(cfg, manifestFile, selectedManifest.jobs, results, index);
      try {
        results.push(await runOneExam(cfg, job));
      } catch (error) {
        results.push({
          examId: job.examId,
          generatedAt: new Date().toISOString(),
          candidateFile: "",
          currentStage: "job_exception_captured",
          protectedArchiveTouched: false,
          status: "fail",
          blockedReasons: ["job_exception"],
          error: String(error.stack || error.message || error).slice(0, 4000),
          nextStages: ["inspect_job_exception_report", "continue_batch"],
        });
      }
      await writeBatchProgress(cfg, manifestFile, selectedManifest.jobs, results, null);
    }
    const summary = {
      generatedAt: new Date().toISOString(),
      selectedManifest: manifestFile,
      jobCount: selectedManifest.jobs.length,
      results,
      status: results.some((r) => ["manual_review", "partial", "blocked", "fail"].includes(r.status)) ? "partial" : "ok"
    };
    await writeJson(path.join(cfg.batchDir, "batch_validation_summary.json"), summary);
    await writeBatchProgress(cfg, manifestFile, selectedManifest.jobs, results, null);
    console.log(JSON.stringify(summary, null, 2));
    return;
  }
  console.log(JSON.stringify({
    status: "inventory_created",
    pdfCount: inventory.pdfCount,
    problemPdfCount: inventory.problemPdfCount,
    parsedCount: inventory.parsedCount,
    parsedProblemCount: inventory.parsedProblemCount,
    manualReviewCount: inventory.manualReviewCount,
    duplicateExamIdCount: inventory.duplicateExamIdCount,
    inventoryFile: path.join(cfg.batchDir, "pdf_inventory.json")
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
