import fs from "node:fs";
import path from "node:path";
import { collectQuestionBanks } from "./js-archive-utils.mjs";
import { ensureDir, listFiles, readJson, writeJson } from "./report-utils.mjs";

export const preciseRemainingReasons = new Set([
  "answer_source_not_found_after_full_search",
  "answer_source_unreadable",
  "full_page_missing",
  "question_crop_missing",
  "crop_js_mismatch",
  "solution_question_mismatch",
  "answer_mismatch",
  "content_unrecoverable",
  "diagram_or_graph_unreadable",
  "stale_or_extra_js_question",
  "non_question_or_self_evaluation",
  "final_hold_after_all_sources_checked",
]);

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function rel(root, file) {
  return path.relative(root || process.cwd(), file).replaceAll(path.sep, "/");
}

function basenameLower(file) {
  return path.basename(file || "").toLowerCase();
}

function containsAny(value, tokens) {
  const text = String(value || "").toLowerCase();
  return tokens.some((token) => text.includes(token));
}

function isImage(file) {
  return /\.(png|jpe?g|webp)$/i.test(file);
}

function isPdf(file) {
  return /\.pdf$/i.test(file);
}

function isJson(file) {
  return /\.json$/i.test(file);
}

export function classifySourceType(source = "", raw = {}) {
  const text = `${source} ${raw.source || ""} ${raw.reportFile || ""} ${raw.source_type || ""}`.toLowerCase();
  if (/quick.*answer|빠른정답/.test(text)) return "quick_answer";
  if (/answer[_ -]?solution.*crop|solution[_ -]?crop|answer_solution_crop/.test(text)) return "answer_solution_crop";
  if (/solution|해설/.test(text)) return "solution_pdf";
  if (/answer.*pdf|정답/.test(text)) return "answer_pdf";
  if (/crop|full[_ -]?page/.test(text)) return "crop_answer_crosscheck";
  if (/direct|solve_from_js|js_question/.test(text)) return "direct_solve";
  return "generated_answer_report";
}

export function sourcePriority(sourceType) {
  return {
    quick_answer: 1,
    answer_pdf: 2,
    solution_pdf: 3,
    answer_solution_crop: 4,
    crop_answer_crosscheck: 5,
    generated_answer_report: 6,
    direct_solve: 99,
  }[sourceType] || 50;
}

export async function buildSourceInventory(cfg) {
  const workspaceRoot = cfg.workspaceRoot || process.cwd();
  const reportsDir = cfg.reportsDir || path.join(cfg.generatedRoot || workspaceRoot, "reports");
  const generatedRoot = cfg.generatedRoot || path.dirname(reportsDir);
  const materialRoot = cfg.materialRoot || path.dirname(generatedRoot);
  const explicitMaterialRoot = Boolean(cfg.materialRoot);
  const scanRoots = uniq([
    cfg.jsDir,
    generatedRoot,
    materialRoot,
    explicitMaterialRoot ? path.dirname(materialRoot) : "",
    cfg.archiveRoot,
    cfg.scanWorkspaceRoot === true ? cfg.workspaceRoot : "",
  ].map((item) => item && path.resolve(item)));

  const files = [];
  for (const root of scanRoots) {
    if (!root || !fs.existsSync(root)) continue;
    files.push(...await listFiles(root, () => true));
  }
  const uniqueFiles = uniq(files.map((file) => path.resolve(file)));
  const images = uniqueFiles.filter(isImage);
  const pdfs = uniqueFiles.filter(isPdf);
  const jsonReports = uniqueFiles.filter((file) => isJson(file) && file.replaceAll("\\", "/").includes("/reports/"));
  const operatingJs = cfg.jsDir && fs.existsSync(cfg.jsDir)
    ? await listFiles(cfg.jsDir, (file) => file.endsWith(".js"))
    : [];

  const fullPageCrops = images.filter((file) => containsAny(file, [
    "page_full_images",
    "full_page",
    "page_full",
    "pdf_pages",
    "page_crops",
  ]));
  const questionCrops = images.filter((file) => containsAny(file, [
    "question_crop",
    "question-crop",
    "question_crop_images",
    "question_full",
  ]));
  const visualCrops = images.filter((file) => containsAny(file, [
    "visual",
    "diagram",
    "graph",
    "table",
    "figure",
    "도형",
    "그래프",
    "표",
  ]));
  const quickAnswerPdfs = pdfs.filter((file) => /quick.*answer|빠른정답/i.test(file));
  const answerPdfs = pdfs.filter((file) => /answer|정답/i.test(file) && !/quick|빠른정답|solution|해설/i.test(file));
  const solutionPdfs = pdfs.filter((file) => /solution|해설/i.test(file));
  const answerSolutionCropReports = jsonReports.filter((file) => /answer.*solution.*crop|answer_solution_crop/i.test(basenameLower(file)));
  const quickAnswerTableReports = jsonReports.filter((file) => /quick.*answer.*table|quick_answer_table/i.test(basenameLower(file)));
  const answerCandidatePages = jsonReports.filter((file) => /answer.*candidate.*page|candidate_page/i.test(basenameLower(file)));
  const answerReports = jsonReports.filter((file) => /answer/i.test(basenameLower(file)));
  const solutionReports = jsonReports.filter((file) => /solution|해설/i.test(basenameLower(file)));

  const report = {
    stage: "source-inventory",
    generatedAt: new Date().toISOString(),
    scanRoots: scanRoots.map((file) => rel(workspaceRoot, file)),
    operatingJs: operatingJs.map((file) => rel(workspaceRoot, file)),
    operatingJsCount: operatingJs.length,
    fullPageCrops: fullPageCrops.map((file) => rel(workspaceRoot, file)),
    fullPageCropCount: fullPageCrops.length,
    questionCrops: questionCrops.map((file) => rel(workspaceRoot, file)),
    questionCropCount: questionCrops.length,
    visualCrops: visualCrops.map((file) => rel(workspaceRoot, file)),
    visualCropCount: visualCrops.length,
    quickAnswerPdfs: quickAnswerPdfs.map((file) => rel(workspaceRoot, file)),
    quickAnswerSourceCount: quickAnswerPdfs.length + quickAnswerTableReports.length,
    answerPdfs: answerPdfs.map((file) => rel(workspaceRoot, file)),
    answerPdfSourceCount: answerPdfs.length,
    solutionPdfs: solutionPdfs.map((file) => rel(workspaceRoot, file)),
    solutionPdfSourceCount: solutionPdfs.length,
    answerSolutionCropReports: answerSolutionCropReports.map((file) => rel(workspaceRoot, file)),
    answerSolutionCropCount: answerSolutionCropReports.length,
    quickAnswerTableReports: quickAnswerTableReports.map((file) => rel(workspaceRoot, file)),
    answerCandidatePages: answerCandidatePages.map((file) => rel(workspaceRoot, file)),
    generatedAnswerReports: answerReports.map((file) => rel(workspaceRoot, file)),
    generatedSolutionReports: solutionReports.map((file) => rel(workspaceRoot, file)),
    status: "ok",
  };
  await writeJson(path.join(reportsDir, "source_inventory_report.json"), report);
  return report;
}

function asArray(raw) {
  if (Array.isArray(raw)) return raw;
  for (const key of ["items", "rows", "questions", "mappings", "accepted"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

async function loadQuestionSourceRows(cfg) {
  const reportsDir = cfg.reportsDir;
  const inputReports = uniq([
    "fresh_js_input_manifest.json",
    "question_crop_map.json",
    "rpm_question_crop_map.json",
    "miraen_question_crop_map.json",
    "miraen2_question_crop_map.json",
    "donga_question_crop_map.json",
    "visang2_question_crop_map.json",
    "text1_question_crop_map.json",
  ]);
  const rows = [];
  for (const name of inputReports) {
    const raw = await readJson(path.join(reportsDir, name), null);
    if (!raw) continue;
    rows.push(...asArray(raw).map((item) => ({ ...item, reportFile: name })));
  }
  return rows;
}

function questionNo(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const digits = text.match(/\d+/)?.[0] || "";
  return digits ? digits.padStart(4, "0") : text;
}

function rowKeys(row, strictManifest) {
  const setKey = row.setKey || row.sectionKey || row.fileKey || "";
  const keys = [];
  const globalId = row.globalId ?? row.globalQuestionNo ?? row.internalId ?? row.questionGlobalId;
  if (globalId !== undefined && globalId !== null && globalId !== "") keys.push(`${setKey}::id::${globalId}`);
  if (!strictManifest) {
    const id = row.id ?? row.jsIdCandidate ?? row.finalQuestionId;
    if (id !== undefined && id !== null && id !== "") keys.push(`${setKey}::id::${id}`);
  }
  const sourceDisplayNo = row.sourceDisplayNo ?? row.sourceQuestionNo ?? row.printedQuestionNo;
  if (sourceDisplayNo) keys.push(`${setKey}::display::${questionNo(sourceDisplayNo)}`);
  return keys;
}

function rowPage(row) {
  return row.pageNo ?? row.sourcePageNo ?? row.page ?? "";
}

function rowFullPage(row) {
  return row.fullPageImage || row.pageFullImage || row.pageImagePath || row.fullPageImagePath || row.sourcePageImage || "";
}

function rowCrop(row) {
  return row.cropPath || row.finalCropPath || row.refinedCropPath || row.questionCropPath || "";
}

function resolvePathCandidates(cfg, rawPath) {
  if (!rawPath) return [];
  const value = String(rawPath);
  const withoutGenerated = value.replace(/^generated[\\/]/, "");
  return uniq([
    path.resolve(value),
    cfg.generatedRoot ? path.resolve(cfg.generatedRoot, withoutGenerated) : "",
    cfg.materialRoot ? path.resolve(cfg.materialRoot, value) : "",
    cfg.workspaceRoot ? path.resolve(cfg.workspaceRoot, value) : "",
  ].filter(Boolean));
}

function resolveExistingPath(cfg, rawPath) {
  return resolvePathCandidates(cfg, rawPath).find((candidate) => fs.existsSync(candidate)) || "";
}

function matchByPage(candidates, pageNo) {
  const page = Number(pageNo);
  if (!Number.isFinite(page)) return [];
  const padded = String(page).padStart(3, "0");
  return candidates.filter((file) => {
    const base = path.basename(file);
    return base.includes(`p${padded}`) || base.includes(`page_${padded}`) || base.includes(`_${padded}`);
  });
}

export async function buildQuestionSourceCrosscheck(cfg, inventory = null) {
  const reportsDir = cfg.reportsDir || path.join(cfg.generatedRoot || process.cwd(), "reports");
  const sourceInventory = inventory || await readJson(path.join(reportsDir, "source_inventory_report.json"), null) || await buildSourceInventory(cfg);
  const banks = await collectQuestionBanks(cfg.jsDir);
  const rows = await loadQuestionSourceRows(cfg);
  const strictManifest = rows.some((row) => row.reportFile === "fresh_js_input_manifest.json");
  const byKey = new Map();
  for (const row of rows) {
    for (const key of rowKeys(row, strictManifest)) {
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(row);
    }
  }

  const fullPageFiles = (sourceInventory.fullPageCrops || []).map((file) => path.resolve(cfg.workspaceRoot || process.cwd(), file));
  const questionCropFiles = (sourceInventory.questionCrops || []).map((file) => path.resolve(cfg.workspaceRoot || process.cwd(), file));
  const visualCropFiles = (sourceInventory.visualCrops || []).map((file) => path.resolve(cfg.workspaceRoot || process.cwd(), file));
  const items = [];
  const byReason = {};
  let crosscheckedCount = 0;
  for (const bank of banks) {
    for (const question of bank.questions) {
      const displayNo = question.displayNo || question.sourceQuestionNo || question.questionNo || "";
      const keys = [
        `${bank.setKey}::id::${question.id}`,
        `${bank.setKey}::display::${questionNo(displayNo)}`,
      ];
      const matchedRows = uniq(keys.flatMap((key) => byKey.get(key) || []));
      const primary = matchedRows[0] || {};
      const fullFromRow = resolveExistingPath(cfg, rowFullPage(primary));
      const cropFromRow = resolveExistingPath(cfg, rowCrop(primary));
      const pageNo = rowPage(primary) || question.sourcePageNo || "";
      const fullPageCandidates = uniq([
        fullFromRow,
        ...matchByPage(fullPageFiles, pageNo),
      ]).filter(Boolean);
      const questionCropCandidates = uniq([
        cropFromRow,
        ...questionCropFiles.filter((file) => path.basename(file).includes(String(question.id).padStart(4, "0"))),
      ]).filter(Boolean);
      const visualAssetCandidates = visualCropFiles.filter((file) => pageNo && matchByPage([file], pageNo).length).slice(0, 12);
      let status = "crosschecked";
      let reason = "";
      if (!matchedRows.length) {
        status = "manual_review";
        reason = "crop_js_mismatch";
      } else if (!fullPageCandidates.length) {
        status = "manual_review";
        reason = "full_page_missing";
      } else if (!questionCropCandidates.length) {
        status = "manual_review";
        reason = "question_crop_missing";
      }
      if (status === "crosschecked") crosscheckedCount += 1;
      if (reason) byReason[reason] = (byReason[reason] || 0) + 1;
      items.push({
        setKey: bank.setKey,
        id: question.id,
        displayNo,
        sourceQuestionNo: question.sourceQuestionNo || "",
        pageNo,
        matchedReportFiles: uniq(matchedRows.map((row) => row.reportFile)),
        matchBasis: matchedRows.length ? "setKey+globalId/sourceDisplayNo with full-page evidence" : "none",
        fullPageCropCandidates: fullPageCandidates.map((file) => rel(cfg.workspaceRoot, file)),
        questionCropCandidates: questionCropCandidates.map((file) => rel(cfg.workspaceRoot, file)),
        visualAssetCandidates: visualAssetCandidates.map((file) => rel(cfg.workspaceRoot, file)),
        actualQuestionNoPolicy: "full page sourceDisplayNo/page flow required; bboxSlotNo never promoted to displayNo",
        status,
        reason,
      });
    }
  }
  const report = {
    stage: "question-source-crosscheck",
    generatedAt: new Date().toISOString(),
    itemCount: items.length,
    crosscheckedCount,
    manualReviewCount: items.length - crosscheckedCount,
    byReason,
    policies: {
      noOcrIdSimpleMatch: true,
      bboxSlotNoForbiddenAsDisplayNo: true,
      questionCropZoomOnly: true,
      fullPageFirst: true,
    },
    items,
    status: items.length - crosscheckedCount ? "manual_review" : "ok",
  };
  await writeJson(path.join(reportsDir, "question_source_crosscheck_report.json"), report);
  return report;
}

export async function ensureSourceReports(cfg) {
  const inventory = await buildSourceInventory(cfg);
  const questionCrosscheck = await buildQuestionSourceCrosscheck(cfg, inventory);
  return { inventory, questionCrosscheck };
}

export async function loadQuestionCrosscheckMap(cfg) {
  const report = await readJson(path.join(cfg.reportsDir, "question_source_crosscheck_report.json"), null)
    || (await ensureSourceReports(cfg)).questionCrosscheck;
  const map = new Map();
  for (const item of report.items || []) {
    map.set(`${item.setKey}::${item.id}`, item);
    if (item.displayNo) map.set(`${item.setKey}::display::${questionNo(item.displayNo)}`, item);
  }
  return { report, map };
}

export function crosscheckForQuestion(crosscheckMap, setKey, question) {
  const displayNo = question.displayNo || question.sourceQuestionNo || question.questionNo || "";
  return crosscheckMap.get(`${setKey}::${question.id}`)
    || crosscheckMap.get(`${setKey}::display::${questionNo(displayNo)}`)
    || null;
}

export function hasQuestionSourceCrosscheck(item) {
  return item?.status === "crosschecked" && item.fullPageCropCandidates?.length > 0;
}

export async function updatePipelineBookSummary(cfg, patch) {
  const file = path.join(cfg.reportsDir, "pipeline_book_summary.json");
  const existing = await readJson(file, {});
  const next = {
    ...existing,
    sourceCrosscheckMetrics: {
      ...(existing.sourceCrosscheckMetrics || {}),
      ...patch,
      updatedAt: new Date().toISOString(),
    },
  };
  await ensureDir(path.dirname(file));
  await writeJson(file, next);
  return next;
}
