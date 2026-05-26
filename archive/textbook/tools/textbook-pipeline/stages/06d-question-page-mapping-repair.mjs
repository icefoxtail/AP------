import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  for (const key of ["items", "rows", "questions", "mappings", "pages", "sections"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

function displayValue(value) {
  return String(value ?? "").trim();
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

async function latestAuditFile(reportsDir, bookId) {
  const safeBook = safeName(bookId);
  try {
    const files = (await fs.promises.readdir(reportsDir))
      .filter((name) => name.startsWith(`question_page_mapping_audit__${safeBook}__`) && name.endsWith(".json"))
      .map((name) => path.join(reportsDir, name));
    const ranked = [];
    for (const file of files) ranked.push({ file, mtimeMs: (await fs.promises.stat(file)).mtimeMs });
    ranked.sort((a, b) => b.mtimeMs - a.mtimeMs);
    return ranked[0]?.file || "";
  } catch {
    return "";
  }
}

async function readFirstJson(reportsDir, names) {
  for (const name of names) {
    const file = path.join(reportsDir, name);
    const value = await readJson(file, null);
    if (value) return { file, value };
  }
  return { file: "", value: null };
}

function buildPageEvidence(cropItems, sectionItems) {
  const bySetDisplay = new Map();
  const rangeBySetPage = new Map();
  const addCandidate = (setKey, displayNo, pageNo, source) => {
    if (!setKey || !displayNo || pageNo === null) return;
    const key = `${setKey}::${displayNo}`;
    if (!bySetDisplay.has(key)) bySetDisplay.set(key, []);
    bySetDisplay.get(key).push({ pageNo, source });
  };
  for (const item of [...sectionItems, ...cropItems]) {
    if (item.mappingStatus === "map_review" || item.sourceDisplayNo === null) continue;
    const setKey = displayValue(item.setKey || item.sectionKey);
    const pageNo = pageNoOf(item);
    const range = displayRangeOf(item);
    if (setKey && pageNo !== null && range.length) rangeBySetPage.set(`${setKey}::${pageNo}`, range);
    for (const displayNo of range) addCandidate(setKey, displayNo, pageNo, "display_range");
    addCandidate(setKey, displayValue(item.sourceDisplayNo ?? item.displayNo ?? item.sourceQuestionNo ?? item.questionNo), pageNo, "question_crop_map");
  }
  return { bySetDisplay, rangeBySetPage };
}

function uniquePages(candidates) {
  return [...new Set(candidates.map((item) => item.pageNo).filter((page) => Number.isFinite(page)))].sort((a, b) => a - b);
}

async function scan({ bookId, auditFile, reportsDir, outDir, searchWindow = 5, applyMapRepair = false, setKey = "", chunk = "" }) {
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const resolvedAudit = auditFile || await latestAuditFile(reportsDir, bookId);
  const auditRaw = resolvedAudit ? await readJson(resolvedAudit, null) : null;
  const auditItems = asArray(auditRaw);
  const cropMap = await readFirstJson(reportsDir, ["question_crop_map.json", "rpm_question_crop_map.json", "miraen_question_crop_map.json", "text1_question_crop_map.json"]);
  const sectionMap = await readFirstJson(reportsDir, ["page_section_map.json", "section_page_map.json", "section_set_detection.json"]);
  const cropItems = asArray(cropMap.value);
  const sectionItems = asArray(sectionMap.value);
  const { bySetDisplay, rangeBySetPage } = buildPageEvidence(cropItems, sectionItems);
  const inputWarnings = [];
  const candidates = [];

  if (!resolvedAudit) inputWarnings.push({ input: reportsDir, reason: "question_page_mapping_audit_missing" });
  if (!cropItems.length) inputWarnings.push({ input: reportsDir, reason: "question_crop_map_missing_or_empty" });

  for (const item of auditItems) {
    if (setKey && item.setKey !== setKey) continue;
    if (!["question_page_mapping_mismatch", "question_crop_missing", "page_range_missing", "missing_full_page_image"].includes(item.status)) continue;
    const displayNo = displayValue(item.displayNo);
    const key = `${item.setKey || ""}::${displayNo}`;
    const pageEvidence = bySetDisplay.get(key) || [];
    const searchPages = new Set(item.candidateSearchRange || []);
    if (Number.isFinite(item.currentPageNo)) {
      for (let page = Number(item.currentPageNo) - searchWindow; page <= Number(item.currentPageNo) + searchWindow; page += 1) {
        if (page > 0) searchPages.add(page);
      }
    }
    const filteredPages = uniquePages(pageEvidence.filter((candidate) => !searchPages.size || searchPages.has(candidate.pageNo)));
    let status = "not_repairable";
    let reason = "displayNo could not be resolved to a unique page";
    if (filteredPages.length === 1) {
      const range = rangeBySetPage.get(`${item.setKey || ""}::${filteredPages[0]}`) || [];
      if (!range.length || range.includes(displayNo)) {
        status = "repair_candidate";
        reason = "single page candidate found within same setKey and display range evidence";
      } else {
        reason = "candidate page conflicts with page display range";
      }
    } else if (filteredPages.length > 1) {
      status = "ambiguous_page_candidate";
      reason = "multiple page candidates found";
    }
    candidates.push({
      bookId,
      id: item.id || "",
      setKey: item.setKey || "",
      displayNo,
      jsFile: item.jsFile || "",
      currentPageNo: item.currentPageNo ?? null,
      candidatePages: filteredPages,
      selectedPageNo: status === "repair_candidate" ? filteredPages[0] : null,
      status,
      reason,
      canApplyMapRepair: status === "repair_candidate",
      chunk,
    });
  }

  const applyItems = [];
  if (applyMapRepair && cropMap.file && candidates.some((item) => item.canApplyMapRepair)) {
    for (const mapItem of cropItems) {
      const match = candidates.find((candidate) => candidate.canApplyMapRepair
        && candidate.setKey === (mapItem.setKey || mapItem.sectionKey)
        && (displayValue(candidate.id) === displayValue(mapItem.jsIdCandidate ?? mapItem.id ?? mapItem.questionId)
          || displayValue(candidate.displayNo) === displayValue(mapItem.sourceDisplayNo ?? mapItem.displayNo ?? mapItem.sourceQuestionNo ?? mapItem.questionNo)));
      if (!match) continue;
      mapItem.pageNo = match.selectedPageNo;
      mapItem.currentPageNo = match.selectedPageNo;
      applyItems.push({ id: match.id, setKey: match.setKey, displayNo: match.displayNo, selectedPageNo: match.selectedPageNo });
    }
    await writeJson(cropMap.file, Array.isArray(cropMap.value) ? cropItems : { ...cropMap.value, items: cropItems });
  }

  const createdAt = new Date().toISOString();
  const byStatus = {};
  for (const item of candidates) byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  const report = {
    stage: "06D-question-page-mapping-repair",
    bookId,
    createdAt,
    auditFile: resolvedAudit,
    reportsDir,
    searchWindow,
    applyMapRepair,
    setKey,
    chunk,
    itemCount: candidates.length,
    inputWarnings,
    items: candidates,
    status: inputWarnings.length && !resolvedAudit ? "empty" : "ok",
  };
  const summary = {
    stage: "06D-question-page-mapping-repair",
    bookId,
    createdAt,
    candidateCount: candidates.length,
    repairCandidateCount: candidates.filter((item) => item.status === "repair_candidate").length,
    ambiguousCount: candidates.filter((item) => item.status === "ambiguous_page_candidate").length,
    appliedCount: applyItems.length,
    byStatus,
    inputWarnings,
    status: report.status,
  };
  const reportFile = path.join(outDir, `question_page_mapping_repair_candidates__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `question_page_mapping_repair_summary__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(summaryFile, summary);
  let applyReportFile = "";
  if (applyMapRepair) {
    applyReportFile = path.join(outDir, `question_page_mapping_repair_apply_report__${safeBook}__${stamp}.json`);
    await writeJson(applyReportFile, {
      stage: "06D-question-page-mapping-repair",
      createdAt,
      appliedCount: applyItems.length,
      mapFile: cropMap.file,
      items: applyItems,
      status: "ok",
    });
  }
  return { status: "ok", reportFile, summaryFile, applyReportFile, report, summary };
}

export default async function stage06dQuestionPageMappingRepair(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  return scan({
    bookId,
    auditFile: cfg.questionPageMappingAuditFile || "",
    reportsDir: cfg.questionPageMappingRepairReportsDir || cfg.reportsDir || path.join(process.cwd(), "reports"),
    outDir: cfg.questionPageMappingRepairOutDir || cfg.reportsDir || path.join(process.cwd(), "reports"),
    searchWindow: Number(cfg.questionPageMappingRepairSearchWindow || 5),
    applyMapRepair: cfg.applyQuestionPageMapRepair === true || cfg.applyMapRepair === true,
    setKey: cfg.questionPageMappingRepairSetKey || "",
    chunk: cfg.questionPageMappingRepairChunk || "",
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  scan({
    bookId: args["book-id"] || args.bookId || "book",
    auditFile: args.audit ? path.resolve(args.audit) : "",
    reportsDir: path.resolve(args["reports-dir"] || "reports"),
    outDir: path.resolve(args.out || args["reports-dir"] || "reports"),
    searchWindow: args["search-window"] ? Number(args["search-window"]) : 5,
    applyMapRepair: args["apply-map-repair"] === true || args["apply-map-repair"] === "true",
    setKey: args["set-key"] || "",
    chunk: args.chunk || "",
  }).then(({ report, reportFile, summaryFile, applyReportFile }) => {
    console.log(JSON.stringify({ status: report.status, itemCount: report.itemCount, reportFile, summaryFile, applyReportFile }, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
