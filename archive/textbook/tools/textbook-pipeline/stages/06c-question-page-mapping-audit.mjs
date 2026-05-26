import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listArchiveJs, readQuestionBank } from "../lib/js-archive-utils.mjs";
import { listFiles, readJson, writeJson } from "../lib/report-utils.mjs";

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
  for (const key of ["items", "rows", "questions", "mappings", "pages", "sections"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

function displayValue(value) {
  return String(value ?? "").trim();
}

function sameDisplay(a, b) {
  return displayValue(a) && displayValue(a) === displayValue(b);
}

function pageNoOf(item) {
  const raw = item?.pageNo ?? item?.page ?? item?.sourcePageNo ?? item?.currentPageNo ?? item?.fullPageNo;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function displayRangeOf(item) {
  const raw = item?.observedDisplayRangeOnPage || item?.displayRange || item?.displayNos || item?.questionNos || item?.displayNoRange;
  if (Array.isArray(raw)) return raw.map(displayValue).filter(Boolean);
  if (typeof raw === "string") return raw.split(/[,~\s-]+/).map(displayValue).filter(Boolean);
  return [];
}

function imagePathOf(item) {
  return item?.currentFullPageImage || item?.fullPageImage || item?.pageFullImage || item?.pageImagePath || item?.sourcePageImage || "";
}

function cropPathOf(item) {
  return item?.cropPath || item?.finalCropPath || item?.refinedCropPath || item?.questionCropPath || item?.sourceCropPath || "";
}

async function pathExists(root, file) {
  if (!file) return false;
  const candidates = [file, path.join(root, file)];
  for (const candidate of candidates) {
    try {
      await fs.promises.access(candidate);
      return true;
    } catch {
      // keep looking
    }
  }
  return false;
}

async function fullPageImages(generatedRoot) {
  const roots = [
    path.join(generatedRoot, "page_full_images"),
    path.join(generatedRoot, "work", "rendered_pages"),
    path.join(generatedRoot, "work", "page_crops"),
  ];
  const files = [];
  for (const root of roots) {
    files.push(...await listFiles(root, (file) => /\.(png|jpe?g)$/i.test(file)));
  }
  return files;
}

function pageNumberFromName(file) {
  const match = path.basename(file).match(/(?:page[_-]?)?(\d{1,5})/i);
  return match ? Number(match[1]) : null;
}

function buildIndexes({ cropItems, sectionItems }) {
  const cropByKey = new Map();
  const displayPages = new Map();
  const pageRanges = new Map();
  for (const item of cropItems) {
    if (item.mappingStatus === "map_review" || item.sourceDisplayNo === null) continue;
    const setKey = displayValue(item.setKey || item.sectionKey);
    const id = displayValue(item.jsIdCandidate ?? item.id ?? item.questionId);
    const displayNo = displayValue(item.sourceDisplayNo ?? item.displayNo ?? item.sourceQuestionNo ?? item.questionNo);
    const pageNo = pageNoOf(item);
    if (setKey && id) cropByKey.set(`${setKey}::${id}`, item);
    if (setKey && displayNo && pageNo !== null) {
      const key = `${setKey}::${displayNo}`;
      if (!displayPages.has(key)) displayPages.set(key, new Set());
      displayPages.get(key).add(pageNo);
    }
    const range = displayRangeOf(item);
    if (pageNo !== null && range.length) pageRanges.set(`${setKey}::${pageNo}`, range);
  }
  for (const item of sectionItems) {
    const setKey = displayValue(item.setKey || item.sectionKey);
    const pageNo = pageNoOf(item);
    const range = displayRangeOf(item);
    if (setKey && pageNo !== null && range.length) pageRanges.set(`${setKey}::${pageNo}`, range);
    for (const displayNo of range) {
      const key = `${setKey}::${displayNo}`;
      if (!displayPages.has(key)) displayPages.set(key, new Set());
      displayPages.get(key).add(pageNo);
    }
  }
  return { cropByKey, displayPages, pageRanges };
}

function candidateSearchRange(currentPageNo, pages = [], window = 5) {
  const ordered = new Set();
  if (currentPageNo !== null) {
    for (let page = currentPageNo - window; page <= currentPageNo + window; page += 1) {
      if (page > 0) ordered.add(page);
    }
  }
  for (const page of pages) ordered.add(page);
  return [...ordered].sort((a, b) => a - b);
}

async function readFirstJson(reportsDir, names) {
  for (const name of names) {
    const value = await readJson(path.join(reportsDir, name), null);
    if (value) return value;
  }
  return null;
}

async function scan({ bookId, bookRoot, generatedRoot, jsDir, reportsDir, outDir, limit = 0, setKey = "", chunk = "" }) {
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const cropRaw = await readFirstJson(reportsDir, [
    "question_crop_map.json",
    "rpm_question_crop_map.json",
    "miraen_question_crop_map.json",
    "text1_question_crop_map.json",
  ]);
  const sectionRaw = await readFirstJson(reportsDir, [
    "page_section_map.json",
    "section_page_map.json",
    "section_set_detection.json",
  ]);
  const cropItems = asArray(cropRaw);
  const sectionItems = asArray(sectionRaw);
  const { cropByKey, displayPages, pageRanges } = buildIndexes({ cropItems, sectionItems });
  const pageImages = await fullPageImages(generatedRoot);
  const pagesWithImages = new Set(pageImages.map(pageNumberFromName).filter((page) => page !== null));
  const files = await listArchiveJs(jsDir).catch(() => []);
  const filteredFiles = setKey ? files.filter((file) => path.basename(file, ".js") === setKey) : files;
  const inputWarnings = [];
  const items = [];
  let scannedQuestions = 0;

  if (!filteredFiles.length) inputWarnings.push({ input: jsDir, reason: "input_js_missing_or_empty" });
  if (!cropItems.length) inputWarnings.push({ input: reportsDir, reason: "question_crop_map_missing_or_empty" });

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
      const id = displayValue(question.id);
      const displayNo = displayValue(question.displayNo ?? question.sourceQuestionNo ?? question.questionNo ?? id);
      const crop = cropByKey.get(`${currentSetKey}::${id}`) || cropByKey.get(`${currentSetKey}::${displayNo}`) || {};
      const currentPageNo = pageNoOf(crop);
      const currentFullPageImage = imagePathOf(crop) || (currentPageNo !== null ? pageImages.find((file) => pageNumberFromName(file) === currentPageNo) || "" : "");
      const observedDisplayRangeOnPage = currentPageNo !== null ? pageRanges.get(`${currentSetKey}::${currentPageNo}`) || displayRangeOf(crop) : [];
      const displayCandidatePages = [...(displayPages.get(`${currentSetKey}::${displayNo}`) || new Set())];
      const cropPath = cropPathOf(crop);
      const fullPageExists = Boolean(currentFullPageImage) ? await pathExists(bookRoot || generatedRoot, currentFullPageImage) : currentPageNo !== null && pagesWithImages.has(currentPageNo);
      const cropExists = cropPath ? await pathExists(bookRoot || generatedRoot, cropPath) : false;
      let status = "ok";
      let reason = "mapping evidence is consistent or not contradicted by available metadata";

      if (!id && !displayNo) {
        status = "non_question_stub";
        reason = "question id/displayNo is missing";
      } else if (!Object.keys(crop).length) {
        status = displayCandidatePages.length ? "question_crop_missing" : "page_range_missing";
        reason = displayCandidatePages.length ? "question crop map entry is missing" : "page range metadata for displayNo is missing";
      } else if (!sameDisplay(crop.sourceDisplayNo ?? crop.displayNo ?? crop.sourceQuestionNo ?? crop.questionNo, displayNo) && displayValue(crop.sourceDisplayNo ?? crop.displayNo ?? crop.sourceQuestionNo ?? crop.questionNo)) {
        status = "question_crop_display_mismatch";
        reason = "question crop displayNo does not match JS displayNo";
      } else if (currentPageNo === null) {
        status = "page_range_missing";
        reason = "current pageNo is missing from map metadata";
      } else if (!fullPageExists) {
        status = "missing_full_page_image";
        reason = "mapped full page image is missing";
      } else if (cropPath && !cropExists) {
        status = "question_crop_missing";
        reason = "mapped question crop file is missing";
      } else if (observedDisplayRangeOnPage.length && !observedDisplayRangeOnPage.includes(displayNo)) {
        status = "question_page_mapping_mismatch";
        reason = "full page display range does not include JS displayNo";
      } else if (!observedDisplayRangeOnPage.length && displayCandidatePages.length > 1) {
        status = "ambiguous_page_candidate";
        reason = "multiple page candidates exist and page display range metadata is unavailable";
      }

      items.push({
        bookId,
        id,
        setKey: currentSetKey,
        displayNo,
        jsFile,
        currentPageNo,
        currentFullPageImage,
        questionCropPath: cropPath,
        observedDisplayRangeOnPage,
        status,
        reason,
        repairable: ["question_page_mapping_mismatch", "question_crop_missing", "page_range_missing"].includes(status) && displayCandidatePages.length <= 1,
        candidateSearchRange: candidateSearchRange(currentPageNo, displayCandidatePages),
      });
    }
  }

  const byStatus = {};
  for (const item of items) byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  const createdAt = new Date().toISOString();
  const report = {
    stage: "06C-question-page-mapping-audit",
    bookId,
    createdAt,
    bookRoot,
    generatedRoot,
    jsDir,
    reportsDir,
    setKey,
    chunk,
    scannedQuestions,
    itemCount: items.length,
    inputWarnings,
    items,
    status: inputWarnings.length && !filteredFiles.length ? "empty" : "ok",
  };
  const summary = {
    stage: "06C-question-page-mapping-audit",
    bookId,
    createdAt,
    scannedQuestions,
    itemCount: items.length,
    byStatus,
    repairableCount: items.filter((item) => item.repairable).length,
    inputWarnings,
    status: report.status,
  };
  const reportFile = path.join(outDir, `question_page_mapping_audit__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `question_page_mapping_audit_summary__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(summaryFile, summary);
  return { status: report.status === "empty" ? "ok" : "ok", reportFile, summaryFile, report, summary };
}

export default async function stage06cQuestionPageMappingAudit(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  return scan({
    bookId,
    bookRoot: cfg.bookRoot || cfg.materialRoot || cfg.workspaceRoot || "",
    generatedRoot: cfg.generatedRoot || path.join(cfg.bookRoot || process.cwd(), "generated"),
    jsDir: cfg.questionPageMappingAuditJsDir || cfg.jsDir || path.join(cfg.generatedRoot || process.cwd(), "js"),
    reportsDir: cfg.questionPageMappingAuditReportsDir || cfg.reportsDir || path.join(cfg.generatedRoot || process.cwd(), "reports"),
    outDir: cfg.questionPageMappingAuditOutDir || cfg.reportsDir || path.join(cfg.generatedRoot || process.cwd(), "reports"),
    limit: Number(cfg.questionPageMappingAuditLimit || 0),
    setKey: cfg.questionPageMappingAuditSetKey || "",
    chunk: cfg.questionPageMappingAuditChunk || "",
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const bookRoot = args["book-root"] ? path.resolve(args["book-root"]) : process.cwd();
  const generatedRoot = path.join(bookRoot, "generated");
  scan({
    bookId: args["book-id"] || args.bookId || "book",
    bookRoot,
    generatedRoot,
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
