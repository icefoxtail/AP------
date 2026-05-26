import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listArchiveJs, readQuestionBank } from "../lib/js-archive-utils.mjs";
import { readJson, writeJson } from "../lib/report-utils.mjs";

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

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function safeName(value) {
  return String(value || "book").replace(/[\\/:*?"<>|]/g, "_");
}

function asArray(raw) {
  if (Array.isArray(raw)) return raw;
  for (const key of ["items", "rows", "answers", "mismatches", "candidates", "questions"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

function keyFor(setKey, id, displayNo = "") {
  return `${setKey || ""}::${id || ""}::${displayNo || ""}`;
}

async function latestReport(reportsDir, prefix, bookId) {
  const safeBook = safeName(bookId);
  try {
    const files = (await fs.promises.readdir(reportsDir))
      .filter((name) => name.startsWith(`${prefix}__${safeBook}__`) && name.endsWith(".json"))
      .map((name) => path.join(reportsDir, name));
    const ranked = [];
    for (const file of files) ranked.push({ file, mtimeMs: (await fs.promises.stat(file)).mtimeMs });
    ranked.sort((a, b) => b.mtimeMs - a.mtimeMs);
    return ranked[0]?.file || "";
  } catch {
    return "";
  }
}

async function readNamed(reportsDir, names) {
  for (const name of names) {
    const file = path.join(reportsDir, name);
    const value = await readJson(file, null);
    if (value) return { file, items: asArray(value) };
  }
  return { file: "", items: [] };
}

function buildKeySet(items) {
  const keys = new Set();
  for (const item of items) {
    const setKey = item.setKey || item.sectionKey || "";
    const id = item.id || item.questionId || "";
    const displayNo = item.displayNo || item.sourceQuestionNo || "";
    keys.add(keyFor(setKey, id, displayNo));
    keys.add(keyFor(setKey, id, ""));
  }
  return keys;
}

function classify({ question, mismatchKeys, candidateKeys, answerCropKeys, answerTableMissing }) {
  const answer = String(question.answer ?? "").trim();
  if (answer) return "";
  if (answerTableMissing) return "missing_answer_table";
  const setKey = question.__setKey;
  const id = String(question.id ?? "");
  const displayNo = String(question.displayNo ?? question.sourceQuestionNo ?? question.questionNo ?? id);
  const hasMismatch = mismatchKeys.has(keyFor(setKey, id, displayNo)) || mismatchKeys.has(keyFor(setKey, id, ""));
  const hasCandidate = candidateKeys.has(keyFor(setKey, id, displayNo)) || candidateKeys.has(keyFor(setKey, id, ""));
  const hasAnswerCrop = answerCropKeys.has(keyFor(setKey, id, displayNo)) || answerCropKeys.has(keyFor(setKey, id, ""));
  if (hasMismatch) return "answer_candidate_mismatch";
  if (!hasAnswerCrop && hasCandidate) return "answer_crop_missing";
  if (!hasAnswerCrop) return "answer_page_mapping_mismatch";
  if (/주관식|서술형|short|subjective/i.test([question.questionType, question.layoutTag, ...(Array.isArray(question.tags) ? question.tags : [])].join(" "))) {
    return "subjective_answer_needs_review";
  }
  if (Array.isArray(question.choices) && question.choices.length === 0) return "non_objective_question";
  if (!id) return "stale_or_extra_js_question";
  return "needs_manual_review";
}

function suggestionFor(cause) {
  if (cause === "missing_answer_table") return "provide or regenerate quick_answer_table before rerunning 10C";
  if (cause === "answer_page_mapping_mismatch") return "check answer page mapping and answer crop map before rerunning 10C";
  if (cause === "answer_crop_missing") return "rerun existing answer/solution crop stage for this setKey";
  if (cause === "subjective_answer_needs_review") return "manual answer review required; do not guess";
  if (cause === "answer_candidate_mismatch") return "review answer evidence and candidate mismatch before applying answer";
  return "manual review required before rerunning answer fill";
}

async function scan({ bookId, jsDir, reportsDir, outDir, limit = 0, setKey = "", chunk = "" }) {
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const answerReport = await readNamed(reportsDir, ["answer_report.json"]);
  const candidateReport = await readNamed(reportsDir, ["answer_candidate_report.json"]);
  const mismatchReport = await readNamed(reportsDir, ["answer_mismatch_report.json"]);
  const quickAnswer = await readNamed(reportsDir, ["quick_answer_table.json", "quick_answer_table_report.json"]);
  const answerCrop = await readNamed(reportsDir, ["answer_solution_crop_map.json", "answer_crop_map.json"]);
  const riskFile = await latestReport(reportsDir, "answer_string_risk_scan", bookId);
  const mismatchKeys = buildKeySet([...mismatchReport.items, ...asArray(await readJson(riskFile, null)).filter((item) => item.riskTypes?.includes?.("answer_candidate_mismatch"))]);
  const candidateKeys = buildKeySet(candidateReport.items);
  const answerCropKeys = buildKeySet(answerCrop.items);
  const answerTableMissing = !quickAnswer.items.length;
  const files = await listArchiveJs(jsDir).catch(() => []);
  const filteredFiles = setKey ? files.filter((file) => path.basename(file, ".js") === setKey) : files;
  const inputWarnings = [];
  const items = [];
  let scannedQuestions = 0;

  if (!filteredFiles.length) inputWarnings.push({ input: jsDir, reason: "input_js_missing_or_empty" });
  if (!answerReport.file) inputWarnings.push({ input: reportsDir, reason: "answer_report_missing" });
  if (!answerCrop.file) inputWarnings.push({ input: reportsDir, reason: "answer_solution_crop_map_missing" });

  for (const jsFile of filteredFiles) {
    let parsed;
    try {
      parsed = await readQuestionBank(jsFile);
    } catch (error) {
      inputWarnings.push({ input: jsFile, reason: `js_parse_error:${error.message}` });
      continue;
    }
    const currentSetKey = path.basename(jsFile, ".js");
    for (const question of parsed.questions) {
      if (limit > 0 && items.length >= limit) break;
      scannedQuestions += 1;
      const cause = classify({ question: { ...question, __setKey: currentSetKey }, mismatchKeys, candidateKeys, answerCropKeys, answerTableMissing });
      if (!cause) continue;
      const id = String(question.id ?? "");
      const displayNo = String(question.displayNo ?? question.sourceQuestionNo ?? question.questionNo ?? id);
      items.push({
        bookId,
        id,
        setKey: currentSetKey,
        displayNo,
        jsFile,
        cause,
        repairSuggestion: suggestionFor(cause),
        canRetryAnswerInput: ["missing_answer_table", "answer_page_mapping_mismatch", "answer_crop_missing", "answer_candidate_mismatch"].includes(cause),
        requiresManualReview: ["subjective_answer_needs_review", "non_objective_question", "needs_manual_review"].includes(cause),
      });
    }
  }

  const byCause = {};
  for (const item of items) byCause[item.cause] = (byCause[item.cause] || 0) + 1;
  const createdAt = new Date().toISOString();
  const report = {
    stage: "10C-FAIL-missing-answer-cause-classify",
    bookId,
    createdAt,
    jsDir,
    reportsDir,
    setKey,
    chunk,
    scannedQuestions,
    itemCount: items.length,
    inputReports: {
      answerReport: answerReport.file,
      answerCandidateReport: candidateReport.file,
      answerMismatchReport: mismatchReport.file,
      quickAnswerTable: quickAnswer.file,
      answerSolutionCropMap: answerCrop.file,
      answerStringRiskScan: riskFile,
    },
    inputWarnings,
    items,
    status: inputWarnings.length && !filteredFiles.length ? "empty" : "ok",
  };
  const summary = {
    stage: "10C-FAIL-missing-answer-cause-classify",
    bookId,
    createdAt,
    scannedQuestions,
    missingAnswerCount: items.length,
    byCause,
    canRetryAnswerInputCount: items.filter((item) => item.canRetryAnswerInput).length,
    manualReviewCount: items.filter((item) => item.requiresManualReview).length,
    inputWarnings,
    status: report.status,
  };
  const reportFile = path.join(outDir, `missing_answer_cause_report__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `missing_answer_cause_summary__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(summaryFile, summary);
  return { status: "ok", reportFile, summaryFile, report, summary };
}

export default async function stage10cFailMissingAnswerCauseClassify(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  return scan({
    bookId,
    jsDir: cfg.missingAnswerCauseJsDir || cfg.jsDir || path.join(process.cwd(), "generated", "js"),
    reportsDir: cfg.missingAnswerCauseReportsDir || cfg.reportsDir || path.join(process.cwd(), "generated", "reports"),
    outDir: cfg.missingAnswerCauseOutDir || cfg.reportsDir || path.join(process.cwd(), "generated", "reports"),
    limit: Number(cfg.missingAnswerCauseLimit || 0),
    setKey: cfg.missingAnswerCauseSetKey || "",
    chunk: cfg.missingAnswerCauseChunk || "",
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const bookRoot = args["book-root"] ? path.resolve(args["book-root"]) : process.cwd();
  const generatedRoot = path.join(bookRoot, "generated");
  scan({
    bookId: args["book-id"] || args.bookId || "book",
    jsDir: path.join(generatedRoot, "js"),
    reportsDir: path.resolve(args["reports-dir"] || path.join(generatedRoot, "reports")),
    outDir: path.resolve(args.out || args["reports-dir"] || path.join(generatedRoot, "reports")),
    limit: args.limit ? Number(args.limit) : 0,
    setKey: args["set-key"] || "",
    chunk: args.chunk || "",
  }).then(({ report, reportFile, summaryFile }) => {
    console.log(JSON.stringify({ status: report.status, itemCount: report.itemCount, reportFile, summaryFile }, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
