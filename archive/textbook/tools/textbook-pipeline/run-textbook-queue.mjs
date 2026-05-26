import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const pipelineDir = path.dirname(__filename);
const defaultWorkspaceRoot = path.resolve(pipelineDir, "../..");
const oneclickRunner = path.join(pipelineDir, "run-oneclick-pipeline.mjs");

const terminalStatuses = new Set(["completed", "completed_with_manual_review", "not_ready", "skipped"]);
const temporaryLimitPatterns = [
  /token limit/i,
  /usage limit/i,
  /rate limit/i,
  /quota/i,
  /too many requests/i,
  /temporarily unavailable/i,
  /context length/i,
  /model overloaded/i,
  /Codex usage/i,
  /작업 한도/i,
  /사용량/i,
  /한도/i,
  /잠시 후/i,
  /retry later/i,
];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function boolArg(value, fallback) {
  if (value === undefined) return fallback;
  if (value === true) return true;
  return !/^(false|0|no)$/i.test(String(value));
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function listFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function readQuestionBank(jsFile) {
  const code = fs.readFileSync(jsFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: jsFile, timeout: 5000 });
  return Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [];
}

function discoverBooks(workspaceRoot) {
  return fs.readdirSync(workspaceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !["tools", "reports", "generated", ".venv"].includes(name))
    .map((name) => {
      const root = path.join(workspaceRoot, name);
      return {
        bookId: name,
        bookRoot: root,
        generatedRoot: path.join(root, "generated"),
        jsDir: path.join(root, "generated", "js"),
        reportsDir: path.join(root, "generated", "reports"),
      };
    })
    .filter((book) => fs.existsSync(book.generatedRoot) || fs.existsSync(book.jsDir))
    .sort((a, b) => a.bookId.localeCompare(b.bookId, "ko"));
}

function hasAnyFile(dir, matcher = () => true) {
  return listFiles(dir, matcher).length > 0;
}

function detectAnswerSource(book) {
  const work = path.join(book.generatedRoot, "work");
  const reports = book.reportsDir;
  const reportNames = [
    "quick_answer_extraction_report.json",
    "quick_answer_table_report.json",
    "answer_solution_extraction_report.json",
    "answer_solution_crop_report.json",
    "text1_answer_extraction_report.json",
    "text1_answer_solution_extraction_report.json",
  ];
  const reportEvidence = reportNames.some((name) => {
    const raw = readJson(path.join(reports, name), null);
    if (!raw) return false;
    const rows = Array.isArray(raw) ? raw : Array.isArray(raw.items) ? raw.items : Array.isArray(raw.answers) ? raw.answers : [];
    return rows.length > 0;
  });
  return reportEvidence
    || hasAnyFile(path.join(work, "answer_candidate_pages"), (file) => /\.(png|jpe?g)$/i.test(file))
    || hasAnyFile(path.join(work, "answer_manual_pages"), (file) => /\.(png|jpe?g)$/i.test(file));
}

function readinessCheck(book) {
  const jsFiles = listFiles(book.jsDir, (file) => file.endsWith(".js"));
  const pageCropReady = hasAnyFile(path.join(book.generatedRoot, "work", "page_crops"), (file) => /\.(png|jpe?g)$/i.test(file));
  const questionCropReady = hasAnyFile(path.join(book.generatedRoot, "work", "question_crops"), (file) => /\.(png|jpe?g)$/i.test(file));
  const visualMapReady = fs.existsSync(path.join(book.reportsDir, "visual_asset_map.json"))
    || fs.existsSync(path.join(book.reportsDir, "visual_asset_crop_report.json"))
    || fs.existsSync(path.join(book.reportsDir, "visual_asset_link_audit_report.json"));
  const answerSourceReady = detectAnswerSource(book);
  const missing = [];
  if (!jsFiles.length) missing.push("generated_js");
  if (!pageCropReady) missing.push("full_page_images");
  return {
    status: jsFiles.length && pageCropReady ? (answerSourceReady ? "ready" : "partial_ready") : "not_ready",
    jsFileCount: jsFiles.length,
    pageCropReady,
    questionCropReady,
    visualMapReady,
    answerSourceReady,
    missing,
  };
}

function inferBookType(bookId) {
  return /RPM|라이트쎈|마플|LIGHTSSEN|MAPL/i.test(bookId) ? "workbook" : "textbook";
}

function makeBookConfig(queueCfg, book, readiness, args) {
  const workspaceRoot = queueCfg.workspaceRoot;
  return {
    workspaceRoot,
    inputPdf: `${book.bookId}.pdf`,
    outputByInputPdfFolder: true,
    materialOutputRoot: ".",
    materialFolderName: book.bookId,
    projectRoot: path.resolve(workspaceRoot, "../.."),
    rulesDir: path.resolve(workspaceRoot, "../../rules"),
    archiveRoot: path.resolve(workspaceRoot, ".."),
    publisher: "",
    textbook: book.bookId,
    grade: "",
    bookType: inferBookType(book.bookId),
    bookId: book.bookId,
    bookIdPrefix: book.bookId,
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
    makeQuickAnswerTable: false,
    makeAnswerSolutionCrops: false,
    buildInternalModel: false,
    emitOutputProfiles: false,
    buildInputPacks: true,
    contentChoicesInputMode: queueCfg.contentChoicesInputMode || "apply_unambiguous",
    answerFillMode: readiness.answerSourceReady ? (queueCfg.answerFillModeWithSource || "apply_unambiguous") : (queueCfg.answerFillModeWithoutSource || "skipped_no_answer_candidates"),
    makeFormulaRepairTargets: true,
    makeGeminiFormulaPatchDryRun: !args["no-gemini"],
    makeGeminiFormulaPatchAutoApply: !args["no-apply"] && queueCfg.makeGeminiFormulaPatchAutoApply === true,
    formulaRepairLimit: 0,
    defaultSourcePolicy: "internal_only",
    defaultContentMode: "pending_input",
    contentExtractionMode: "full_page_statement_build",
    answerSourceReady: readiness.answerSourceReady,
    queueManaged: true,
  };
}

function selectedStages(queueCfg, readiness, args) {
  let stages = args["no-gemini"] ? queueCfg.noGeminiStages : queueCfg.stages;
  if (args["no-apply"]) {
    const noApply = new Set(queueCfg.noApplyStages || stages.filter((stage) => stage !== "12D"));
    stages = stages.filter((stage) => noApply.has(stage) && stage !== "12D");
  }
  if (args["no-gemini"]) stages = stages.filter((stage) => stage !== "12B");
  if (!readiness.answerSourceReady) stages = stages.filter((stage) => !["10C", "10C-SCAN"].includes(stage));
  return stages;
}

function getBookMetrics(book) {
  const jsFiles = listFiles(book.jsDir, (file) => file.endsWith(".js"));
  let questionCount = 0;
  let emptyContentCount = 0;
  let missingAnswerCount = 0;
  let imageOnlyContentCount = 0;
  let parseFailCount = 0;
  for (const file of jsFiles) {
    try {
      const questions = readQuestionBank(file);
      questionCount += questions.length;
      for (const q of questions) {
        if (!String(q.content || "").trim()) emptyContentCount += 1;
        if (!String(q.answer || "").trim()) missingAnswerCount += 1;
        if (/<img\b|\.png\b|\.jpe?g\b|page[_-]?full|question[_-]?crop|crop_images/i.test(String(q.content || ""))) imageOnlyContentCount += 1;
      }
    } catch {
      parseFailCount += 1;
    }
  }
  const validation = readJson(path.join(book.reportsDir, "pipeline_validation_report.json"), {});
  const scan = readJson(path.join(book.reportsDir, "broken_formula_string_summary.json"), null)
    || readJson(path.join(book.reportsDir, `broken_formula_string_summary__${book.bookId}__${new Date().toISOString().slice(0, 10).replaceAll("-", "")}.json`), null);
  return {
    jsFileCount: jsFiles.length,
    questionCount,
    emptyContentCount,
    missingAnswerCount,
    imageOnlyContentCount,
    parseFailCount,
    syntaxPass: validation.syntaxPass ?? parseFailCount === 0,
    validationStatus: validation.status || "",
    brokenOrSuspiciousCount: scan?.brokenOrSuspiciousCount ?? scan?.itemCount ?? null,
  };
}

function classifyBookStatus(metrics, readiness, stageFailures) {
  if (readiness.status === "not_ready") return "not_ready";
  if (stageFailures.length || metrics.parseFailCount || metrics.syntaxPass === false) return "failed";
  if (metrics.emptyContentCount > 0) return "completed_with_manual_review";
  if (!readiness.answerSourceReady || metrics.missingAnswerCount > 0 || metrics.imageOnlyContentCount > 0) return "completed_with_manual_review";
  return "completed";
}

function isTemporaryLimit(text) {
  return temporaryLimitPatterns.some((pattern) => pattern.test(text || ""));
}

function loadQueueConfig(args) {
  const configPath = args.config ? path.resolve(process.cwd(), args.config) : path.join(defaultWorkspaceRoot, "textbook_pipeline_queue.config.json");
  const raw = readJson(configPath, {});
  return {
    configPath,
    workspaceRoot: path.resolve(raw.workspaceRoot || defaultWorkspaceRoot),
    reportsDir: path.resolve(raw.reportsDir || path.join(raw.workspaceRoot || defaultWorkspaceRoot, "reports")),
    statusFile: path.resolve(raw.statusFile || path.join(raw.reportsDir || path.join(raw.workspaceRoot || defaultWorkspaceRoot, "reports"), "textbook_pipeline_queue_status.json")),
    summaryFile: path.resolve(raw.summaryFile || path.join(raw.reportsDir || path.join(raw.workspaceRoot || defaultWorkspaceRoot, "reports"), "textbook_pipeline_queue_summary.json")),
    resumeLogFile: path.resolve(raw.resumeLogFile || path.join(raw.reportsDir || path.join(raw.workspaceRoot || defaultWorkspaceRoot, "reports"), "textbook_pipeline_queue_resume_log.json")),
    batchSize: Number(args["batch-size"] || raw.batchSize || 4),
    continueOnError: boolArg(args["continue-on-error"], raw.continueOnError !== false),
    autoResume: boolArg(args["auto-resume"], raw.autoResume !== false),
    pauseMinutes: Number(args["pause-minutes"] || raw.pauseMinutes || 30),
    maxRetriesPerBook: Number(args["max-retries-per-book"] || raw.maxRetriesPerBook || 3),
    maxRetriesTotal: Number(args["max-retries-total"] || raw.maxRetriesTotal || 20),
    maxFailures: args["max-failures"] === undefined ? raw.maxFailures : Number(args["max-failures"]),
    runningTimeoutMinutes: Number(raw.runningTimeoutMinutes || 120),
    retryFailed: boolArg(args["retry-failed"], raw.retryFailed === true),
    stages: raw.stages || ["10B", "10B-SCAN", "10C", "10C-SCAN", "11", "12", "12B", "12D", "12C", "14"],
    noGeminiStages: raw.noGeminiStages || ["10B", "10B-SCAN", "10C", "10C-SCAN", "11", "12", "12C", "14"],
    noApplyStages: raw.noApplyStages || ["10B", "10B-SCAN", "10C", "10C-SCAN", "11", "12", "12B", "12C", "14"],
    contentChoicesInputMode: raw.contentChoicesInputMode || "apply_unambiguous",
    answerFillModeWithSource: raw.answerFillModeWithSource || "apply_unambiguous",
    answerFillModeWithoutSource: raw.answerFillModeWithoutSource || "skipped_no_answer_candidates",
    makeGeminiFormulaPatchAutoApply: raw.makeGeminiFormulaPatchAutoApply === true,
  };
}

function newStatus(queueCfg, books) {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    configFile: queueCfg.configPath,
    workspaceRoot: queueCfg.workspaceRoot,
    statusFile: queueCfg.statusFile,
    books: books.map((book) => ({
      bookId: book.bookId,
      bookRoot: book.bookRoot,
      status: "pending",
      currentStage: "",
      retryCount: 0,
      stageRetryCounts: {},
      stages: [],
      readiness: null,
      metrics: null,
      errors: [],
    })),
    totalRetryCount: 0,
    queueStatus: "pending",
  };
}

function saveStatus(queueCfg, status) {
  status.updatedAt = new Date().toISOString();
  writeJson(queueCfg.statusFile, status);
}

function appendResumeLog(queueCfg, entry) {
  const existing = readJson(queueCfg.resumeLogFile, { items: [] });
  existing.updatedAt = new Date().toISOString();
  existing.items = Array.isArray(existing.items) ? existing.items : [];
  existing.items.push(entry);
  writeJson(queueCfg.resumeLogFile, existing);
}

function normalizeLoadedStatus(queueCfg, books) {
  const loaded = readJson(queueCfg.statusFile, null);
  if (!loaded) return newStatus(queueCfg, books);
  const byId = new Map((loaded.books || []).map((book) => [book.bookId, book]));
  loaded.books = books.map((book) => {
    const prev = byId.get(book.bookId);
    return prev || {
      bookId: book.bookId,
      bookRoot: book.bookRoot,
      status: "pending",
      currentStage: "",
      retryCount: 0,
      stageRetryCounts: {},
      stages: [],
      readiness: null,
      metrics: null,
      errors: [],
    };
  });
  loaded.configFile = queueCfg.configPath;
  loaded.workspaceRoot = queueCfg.workspaceRoot;
  loaded.statusFile = queueCfg.statusFile;
  return loaded;
}

function handleInterrupted(status, queueCfg) {
  const now = Date.now();
  for (const book of status.books) {
    if (!["running", "paused"].includes(book.status)) continue;
    if (book.pauseUntil && Date.parse(book.pauseUntil) > now) continue;
    if (book.status === "paused") {
      book.status = "pending";
      book.resumedAt = new Date().toISOString();
      continue;
    }
    const updatedAt = Date.parse(book.updatedAt || status.updatedAt || status.createdAt || new Date().toISOString());
    const staleMs = queueCfg.runningTimeoutMinutes * 60 * 1000;
    if (Number.isFinite(updatedAt) && now - updatedAt > staleMs) {
      book.status = "pending";
      book.previousStatus = "interrupted";
      book.interruptedAt = new Date().toISOString();
    }
  }
}

function isTerminalForSelection(state, book) {
  if (state.status === "not_ready") return readinessCheck(book).status === "not_ready";
  return terminalStatuses.has(state.status);
}

function runStage(queueCfg, book, bookState, stage, configFile, status) {
  const startedAt = new Date().toISOString();
  bookState.currentStage = stage;
  bookState.status = "running";
  bookState.updatedAt = startedAt;
  bookState.stages.push({ stage, status: "running", startedAt });
  saveStatus(queueCfg, status);

  const result = spawnSync(process.execPath, [oneclickRunner, "--config", configFile, "--stage", stage], {
    cwd: queueCfg.workspaceRoot,
    encoding: "utf8",
    env: process.env,
  });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  const finishedAt = new Date().toISOString();
  const stageRecord = bookState.stages[bookState.stages.length - 1];
  stageRecord.finishedAt = finishedAt;
  stageRecord.exitCode = result.status;
  stageRecord.stdoutTail = (result.stdout || "").slice(-4000);
  stageRecord.stderrTail = (result.stderr || "").slice(-4000);

  if (isTemporaryLimit(output)) {
    const retryKey = `${book.bookId}::${stage}`;
    const nextRetry = Number(bookState.stageRetryCounts?.[retryKey] || 0) + 1;
    bookState.stageRetryCounts = bookState.stageRetryCounts || {};
    bookState.stageRetryCounts[retryKey] = nextRetry;
    bookState.retryCount = Number(bookState.retryCount || 0) + 1;
    status.totalRetryCount = Number(status.totalRetryCount || 0) + 1;
    const pauseUntil = new Date(Date.now() + queueCfg.pauseMinutes * 60 * 1000).toISOString();
    bookState.status = "paused";
    bookState.pauseUntil = pauseUntil;
    bookState.pauseMinutes = queueCfg.pauseMinutes;
    bookState.pauseReason = "temporary_limit_pause";
    stageRecord.status = "paused";
    stageRecord.reason = "temporary_limit_pause";
    appendResumeLog(queueCfg, {
      pausedAt: finishedAt,
      pauseUntil,
      reason: "temporary_limit_pause",
      bookId: book.bookId,
      stage,
      retryCount: nextRetry,
      finalStatus: "paused",
    });
    saveStatus(queueCfg, status);
    return { status: "paused", temporaryLimit: true };
  }

  stageRecord.status = result.status === 0 ? "ok" : "failed";
  if (result.status !== 0) {
    bookState.errors.push({ stage, error: stageRecord.stderrTail || stageRecord.stdoutTail || "stage failed" });
  }
  saveStatus(queueCfg, status);
  return { status: stageRecord.status };
}

function writeBookSummary(book, bookState) {
  const deltas = bookState.beforeMetrics && bookState.metrics ? {
    emptyContentCount: Number(bookState.metrics.emptyContentCount || 0) - Number(bookState.beforeMetrics.emptyContentCount || 0),
    missingAnswerCount: Number(bookState.metrics.missingAnswerCount || 0) - Number(bookState.beforeMetrics.missingAnswerCount || 0),
    imageOnlyContentCount: Number(bookState.metrics.imageOnlyContentCount || 0) - Number(bookState.beforeMetrics.imageOnlyContentCount || 0),
  } : null;
  const summary = {
    createdAt: new Date().toISOString(),
    bookId: book.bookId,
    status: bookState.status,
    readiness: bookState.readiness,
    beforeMetrics: bookState.beforeMetrics || null,
    metrics: bookState.metrics,
    deltas,
    stages: bookState.stages,
    errors: bookState.errors,
    nextAction: bookState.status === "completed" ? "none"
      : bookState.status === "not_ready" ? "prepare_missing_inputs"
        : "review_manual_reports_or_retry_failed_stages",
  };
  writeJson(path.join(book.reportsDir, "pipeline_book_summary.json"), summary);
  return summary;
}

function writeQueueSummary(queueCfg, status) {
  const counts = {};
  for (const book of status.books) counts[book.status] = (counts[book.status] || 0) + 1;
  const summary = {
    createdAt: new Date().toISOString(),
    queueStatus: status.queueStatus,
    totalBookCount: status.books.length,
    counts,
    totalRetryCount: status.totalRetryCount || 0,
    books: status.books.map((book) => ({
      bookId: book.bookId,
      status: book.status,
      currentStage: book.currentStage,
      retryCount: book.retryCount || 0,
      readiness: book.readiness,
      beforeMetrics: book.beforeMetrics || null,
      metrics: book.metrics,
      deltas: book.beforeMetrics && book.metrics ? {
        emptyContentCount: Number(book.metrics.emptyContentCount || 0) - Number(book.beforeMetrics.emptyContentCount || 0),
        missingAnswerCount: Number(book.metrics.missingAnswerCount || 0) - Number(book.beforeMetrics.missingAnswerCount || 0),
        imageOnlyContentCount: Number(book.metrics.imageOnlyContentCount || 0) - Number(book.beforeMetrics.imageOnlyContentCount || 0),
      } : null,
      errorCount: book.errors?.length || 0,
    })),
  };
  writeJson(queueCfg.summaryFile, summary);
  return summary;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const queueCfg = loadQueueConfig(args);
  fs.mkdirSync(queueCfg.reportsDir, { recursive: true });
  const allBooks = discoverBooks(queueCfg.workspaceRoot);
  let books = allBooks;
  if (args.only) books = books.filter((book) => book.bookId === args.only);
  if (args["start-from"]) {
    const index = books.findIndex((book) => book.bookId === args["start-from"]);
    if (index >= 0) books = books.slice(index);
  }

  const status = normalizeLoadedStatus(queueCfg, allBooks);
  handleInterrupted(status, queueCfg);
  saveStatus(queueCfg, status);

  const pendingBooks = books
    .map((book) => ({ book, state: status.books.find((item) => item.bookId === book.bookId) }))
    .filter(({ book, state }) => {
      if (!state) return false;
      if (isTerminalForSelection(state, book)) return false;
      if (state.status === "failed" && !queueCfg.retryFailed) return false;
      if (state.status === "paused" && state.pauseUntil && Date.parse(state.pauseUntil) > Date.now()) return false;
      return true;
    })
    .slice(0, Number(args["batch-size"] || queueCfg.batchSize || 4));

  if (args["dry-run"]) {
    const dryRun = {
      createdAt: new Date().toISOString(),
      dryRun: true,
      discoveredBookCount: allBooks.length,
      selectedBookCount: pendingBooks.length,
      selectedBooks: pendingBooks.map(({ book, state }) => ({
        bookId: book.bookId,
        currentStatus: state?.status || "pending",
        readiness: readinessCheck(book),
        plannedStages: selectedStages(queueCfg, readinessCheck(book), args),
      })),
      statusFile: queueCfg.statusFile,
      summaryFile: queueCfg.summaryFile,
    };
    writeJson(path.join(queueCfg.reportsDir, "textbook_pipeline_queue_dry_run_report.json"), dryRun);
    writeQueueSummary(queueCfg, status);
    console.log(JSON.stringify(dryRun, null, 2));
    return;
  }

  let processed = 0;
  let failureCount = 0;
  for (const { book, state: bookState } of pendingBooks) {
    const readiness = readinessCheck(book);
    bookState.readiness = readiness;
    bookState.beforeMetrics = getBookMetrics(book);
    bookState.startedAt = bookState.startedAt || new Date().toISOString();
    bookState.updatedAt = new Date().toISOString();
    bookState.errors = bookState.errors || [];
    saveStatus(queueCfg, status);

    if (readiness.status === "not_ready") {
      bookState.status = "not_ready";
      bookState.reason = `missing:${readiness.missing.join(",")}`;
      bookState.metrics = getBookMetrics(book);
      writeBookSummary(book, bookState);
      saveStatus(queueCfg, status);
      processed += 1;
      continue;
    }

    const configRoot = path.join(queueCfg.workspaceRoot, "generated", "queue", "configs");
    const safeName = book.bookId.replace(/[\\/:*?"<>|]/g, "_");
    const configFile = path.join(configRoot, `${safeName}.queue.config.json`);
    writeJson(configFile, makeBookConfig(queueCfg, book, readiness, args));
    bookState.configFile = configFile;
    bookState.status = "running";
    saveStatus(queueCfg, status);

    const stages = selectedStages(queueCfg, readiness, args);
    const stageFailures = [];
    for (const stage of stages) {
      const result = runStage(queueCfg, book, bookState, stage, configFile, status);
      if (result.status === "paused") {
        status.queueStatus = "paused";
        writeQueueSummary(queueCfg, status);
        console.log(JSON.stringify({ status: "paused", bookId: book.bookId, stage, pauseUntil: bookState.pauseUntil }, null, 2));
        return;
      }
      if (result.status !== "ok") {
        stageFailures.push(stage);
        if (!queueCfg.continueOnError) break;
      }
    }

    bookState.metrics = getBookMetrics(book);
    bookState.status = classifyBookStatus(bookState.metrics, readiness, stageFailures);
    bookState.finishedAt = new Date().toISOString();
    if (bookState.status === "failed") failureCount += 1;
    writeBookSummary(book, bookState);
    saveStatus(queueCfg, status);
    processed += 1;

    if (queueCfg.maxFailures !== undefined && failureCount > Number(queueCfg.maxFailures)) {
      status.queueStatus = "stopped_max_failures";
      saveStatus(queueCfg, status);
      break;
    }
    if (Number(status.totalRetryCount || 0) > queueCfg.maxRetriesTotal) {
      status.queueStatus = "stopped_limit_exceeded";
      saveStatus(queueCfg, status);
      break;
    }
  }

  const remaining = status.books.filter((book) => !terminalStatuses.has(book.status) && book.status !== "failed").length;
  status.queueStatus = status.queueStatus?.startsWith("stopped") ? status.queueStatus : (remaining ? "running_or_pending" : "completed");
  saveStatus(queueCfg, status);
  const summary = writeQueueSummary(queueCfg, status);
  console.log(JSON.stringify({
    status: status.queueStatus,
    discoveredBookCount: allBooks.length,
    processedThisRun: processed,
    counts: summary.counts,
    statusFile: queueCfg.statusFile,
    summaryFile: queueCfg.summaryFile,
  }, null, 2));
}

main();
