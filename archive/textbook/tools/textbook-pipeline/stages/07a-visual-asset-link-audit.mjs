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
  for (const key of ["items", "assets", "rows", "questions"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

function visualNeeded(text) {
  return /(도형|그림|그래프|표|좌표평면|좌표|직선|원|삼각형|사각형|함수의\s*그래프|figure|graph|table|diagram|coordinate)/i.test(String(text || ""));
}

function badImagePath(image) {
  return /(page_full_images|page[_-]?crop|question[_-]?crop|original_question_full|by_js_id)/i.test(String(image || ""));
}

async function readFirstJson(reportsDir, names) {
  for (const name of names) {
    const value = await readJson(path.join(reportsDir, name), null);
    if (value) return value;
  }
  return null;
}

function keyFor(setKey, id, displayNo = "") {
  return `${setKey || ""}::${id || ""}::${displayNo || ""}`;
}

async function scan({ bookId, jsDir, reportsDir, outDir, limit = 0, setKey = "", chunk = "" }) {
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const assetMapRaw = await readFirstJson(reportsDir, ["visual_asset_crop_map.json", "visual_asset_map.json"]);
  const assetReportRaw = await readFirstJson(reportsDir, ["visual_asset_crop_report.json", "visual_asset_report.json"]);
  const assetItems = [...asArray(assetMapRaw), ...asArray(assetReportRaw)];
  const assetKeys = new Set();
  for (const asset of assetItems) {
    const set = asset.setKey || asset.sectionKey || "";
    const id = asset.jsIdCandidate ?? asset.id ?? asset.questionId ?? "";
    const displayNo = asset.displayNo ?? asset.sourceQuestionNo ?? asset.questionNo ?? "";
    assetKeys.add(keyFor(set, id, displayNo));
    assetKeys.add(keyFor(set, id, ""));
  }
  const files = await listArchiveJs(jsDir).catch(() => []);
  const filteredFiles = setKey ? files.filter((file) => path.basename(file, ".js") === setKey) : files;
  const inputWarnings = [];
  const items = [];
  let scannedQuestions = 0;

  if (!filteredFiles.length) inputWarnings.push({ input: jsDir, reason: "input_js_missing_or_empty" });
  if (!assetItems.length) inputWarnings.push({ input: reportsDir, reason: "visual_asset_crop_map_missing_or_empty" });

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
      const id = String(question.id ?? "");
      const displayNo = String(question.displayNo ?? question.sourceQuestionNo ?? question.questionNo ?? id);
      const combined = [question.content, ...(Array.isArray(question.choices) ? question.choices : [])].join("\n");
      const image = String(question.image || "");
      const hasAssetCrop = assetKeys.has(keyFor(currentSetKey, id, displayNo)) || assetKeys.has(keyFor(currentSetKey, id, ""));
      const needsVisual = visualNeeded(combined) || hasAssetCrop;
      const statuses = [];
      if (needsVisual && !image) statuses.push("visual_asset_required_missing_image");
      if (image && !/\.(png|jpe?g|webp)$/i.test(image)) statuses.push("image_path_missing_or_not_file");
      if (image && badImagePath(image)) statuses.push("image_points_to_page_or_question_crop");
      if (/(?:page_full_images|page[_-]?crop|question[_-]?crop|crop_images|\.png|\.jpe?g)/i.test(combined)) statuses.push("content_contains_image_path");
      if (hasAssetCrop && !image) statuses.push("visual_asset_crop_unlinked");
      if (!statuses.length) continue;
      items.push({
        bookId,
        id,
        setKey: currentSetKey,
        displayNo,
        jsFile,
        image,
        needsVisual,
        hasAssetCrop,
        status: statuses[0],
        statuses,
        repairable: statuses.includes("visual_asset_crop_unlinked") || statuses.includes("visual_asset_required_missing_image"),
        reason: "visual asset linkage requires review; this stage does not create crops or edit JS",
      });
    }
  }

  const byStatus = {};
  for (const item of items) for (const status of item.statuses) byStatus[status] = (byStatus[status] || 0) + 1;
  const createdAt = new Date().toISOString();
  const report = {
    stage: "07A-visual-asset-link-audit",
    bookId,
    createdAt,
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
    stage: "07A-visual-asset-link-audit",
    bookId,
    createdAt,
    scannedQuestions,
    itemCount: items.length,
    byStatus,
    inputWarnings,
    status: report.status,
  };
  const reportFile = path.join(outDir, `visual_asset_link_audit__${safeBook}__${stamp}.json`);
  const summaryFile = path.join(outDir, `visual_asset_link_audit_summary__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(summaryFile, summary);
  return { status: "ok", reportFile, summaryFile, report, summary };
}

export default async function stage07aVisualAssetLinkAudit(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  return scan({
    bookId,
    jsDir: cfg.visualAssetLinkAuditJsDir || cfg.jsDir || path.join(process.cwd(), "generated", "js"),
    reportsDir: cfg.visualAssetLinkAuditReportsDir || cfg.reportsDir || path.join(process.cwd(), "generated", "reports"),
    outDir: cfg.visualAssetLinkAuditOutDir || cfg.reportsDir || path.join(process.cwd(), "generated", "reports"),
    limit: Number(cfg.visualAssetLinkAuditLimit || 0),
    setKey: cfg.visualAssetLinkAuditSetKey || "",
    chunk: cfg.visualAssetLinkAuditChunk || "",
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
