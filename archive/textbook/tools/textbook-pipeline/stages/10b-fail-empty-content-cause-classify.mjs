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
  for (const key of ["items", "rows", "questions", "pending"]) {
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

function classifyFromMapping(mappingItem, repairItem, question) {
  if (mappingItem?.status === "question_page_mapping_mismatch") return "page_mapping_mismatch";
  if (mappingItem?.status === "missing_full_page_image") return "missing_full_page_image";
  if (mappingItem?.status === "page_range_missing") return "page_range_missing";
  if (mappingItem?.status === "question_crop_missing") return "question_crop_missing";
  if (mappingItem?.status === "unreadable_image") return "unreadable_image";
  if (mappingItem?.status === "non_question_stub") return "non_question_stub";
  if (mappingItem?.status === "stale_or_extra_js_question") return "stale_or_extra_js_question";
  if (repairItem?.status === "repair_candidate") return "page_mapping_mismatch";
  const combined = [question.content, ...(Array.isArray(question.choices) ? question.choices : [])].join("\n");
  if (/(도형|그림|그래프|표|좌표평면|figure|graph|table|diagram)/i.test(combined) && question.image) return "visual_asset_only_question";
  if (!String(question.id ?? "").trim()) return "non_question_stub";
  return "input_agent_skipped";
}

function suggestionFor(cause) {
  if (cause === "page_mapping_mismatch") return "run 06D-question-page-mapping-repair and rerun 10B for this setKey";
  if (cause === "missing_full_page_image") return "restore or regenerate the missing full page image before rerunning 10B";
  if (cause === "page_range_missing") return "rebuild page/section mapping metadata before rerunning 10B";
  if (cause === "question_crop_missing") return "rerun existing question crop stage or use full page evidence for 10B";
  if (cause === "visual_asset_only_question") return "confirm visual asset link with 07A and transcribe any visible statement text";
  if (cause === "non_question_stub") return "confirm whether this JS entry should remain a non-question stub";
  if (cause === "stale_or_extra_js_question") return "confirm skeleton/source mapping before rerunning input";
  return "manual review or rerun 10B after evidence reports are complete";
}

async function scan({ bookId, jsDir, reportsDir, outDir, limit = 0, setKey = "", chunk = "" }) {
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const auditFile = await latestReport(reportsDir, "question_page_mapping_audit", bookId);
  const repairFile = await latestReport(reportsDir, "question_page_mapping_repair_candidates", bookId);
  const auditItems = asArray(await readJson(auditFile, null));
  const repairItems = asArray(await readJson(repairFile, null));
  const auditByKey = new Map();
  const repairByKey = new Map();
  for (const item of auditItems) {
    auditByKey.set(keyFor(item.setKey, item.id, item.displayNo), item);
    auditByKey.set(keyFor(item.setKey, item.id, ""), item);
  }
  for (const item of repairItems) {
    repairByKey.set(keyFor(item.setKey, item.id, item.displayNo), item);
    repairByKey.set(keyFor(item.setKey, item.id, ""), item);
  }
  const files = await listArchiveJs(jsDir).catch(() => []);
  const filteredFiles = setKey ? files.filter((file) => path.basename(file, ".js") === setKey) : files;
  const inputWarnings = [];
  const items = [];
  let scannedQuestions = 0;

  if (!filteredFiles.length) inputWarnings.push({ input: jsDir, reason: "input_js_missing_or_empty" });
  if (!auditFile) inputWarnings.push({ input: reportsDir, reason: "question_page_mapping_audit_missing" });

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
      if (String(question.content || "").trim()) continue;
      const id = String(question.id ?? "");
      const displayNo = String(question.displayNo ?? question.sourceQuestionNo ?? question.questionNo ?? id);
      const mappingItem = auditByKey.get(keyFor(currentSetKey, id, displayNo)) || auditByKey.get(keyFor(currentSetKey, id, ""));
      const repairItem = repairByKey.get(keyFor(currentSetKey, id, displayNo)) || repairByKey.get(keyFor(currentSetKey, id, ""));
      const cause = classifyFromMapping(mappingItem, repairItem, question);
      items.push({
        bookId,
        id,
        setKey: currentSetKey,
        displayNo,
        jsFile,
        cause,
        repairSuggestion: suggestionFor(cause),
        canRetryInput: ["page_mapping_mismatch", "question_crop_missing", "input_agent_skipped", "visual_asset_only_question"].includes(cause),
        requiresNewFullPageImage: cause === "missing_full_page_image",
        mappingStatus: mappingItem?.status || "",
        repairCandidateStatus: repairItem?.status || "",
      });
    }
  }

  const byCause = {};
  for (const item of items) byCause[item.cause] = (byCause[item.cause] || 0) + 1;
  const createdAt = new Date().toISOString();
  const report = {
    stage: "10B-FAIL-empty-content-cause-classify",
    bookId,
    createdAt,
    jsDir,
    reportsDir,
    auditFile,
    repairFile,
    setKey,
    chunk,
    scannedQuestions,
    itemCount: items.length,
    inputWarnings,
    items,
    status: inputWarnings.length && !filteredFiles.length ? "empty" : "ok",
  };
  const summary = {
    stage: "10B-FAIL-empty-content-cause-classify",
    bookId,
    createdAt,
    scannedQuestions,
    emptyContentCount: items.length,
    byCause,
    canRetryInputCount: items.filter((item) => item.canRetryInput).length,
    requiresNewFullPageImageCount: items.filter((item) => item.requiresNewFullPageImage).length,
    inputWarnings,
    status: report.status,
  };
  const reportFile = path.join(outDir, `empty_content_cause_report__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `empty_content_cause_summary__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(summaryFile, summary);
  return { status: "ok", reportFile, summaryFile, report, summary };
}

export default async function stage10bFailEmptyContentCauseClassify(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  return scan({
    bookId,
    jsDir: cfg.emptyContentCauseJsDir || cfg.jsDir || path.join(process.cwd(), "generated", "js"),
    reportsDir: cfg.emptyContentCauseReportsDir || cfg.reportsDir || path.join(process.cwd(), "generated", "reports"),
    outDir: cfg.emptyContentCauseOutDir || cfg.reportsDir || path.join(process.cwd(), "generated", "reports"),
    limit: Number(cfg.emptyContentCauseLimit || 0),
    setKey: cfg.emptyContentCauseSetKey || "",
    chunk: cfg.emptyContentCauseChunk || "",
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
