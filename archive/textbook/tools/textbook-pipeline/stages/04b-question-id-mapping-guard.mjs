import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, writeJson } from "../lib/report-utils.mjs";
import { buildQuestionSourceCrosscheck, buildSourceInventory, updatePipelineBookSummary } from "../lib/source-crosscheck-utils.mjs";

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
  for (const key of ["items", "rows", "questions", "mappings"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

function valueOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function sourceDisplayNoEvidence(item) {
  const source = String(item.sourceDisplayNoSource || item.displayNoSource || item.questionNoSource || item.sourceQuestionNoSource || "").toLowerCase();
  if (item.sourceDisplayNoConfirmed === true || item.displayNoConfirmed === true || item.sourceQuestionNoConfirmed === true) return "confirmed_flag";
  if (["manual", "ocr", "full_page_ocr", "source_text_layer", "publisher_index", "page_display_range"].includes(source)) return source;
  if (item.sourceDisplayNo && source) return source;
  return "";
}

function explicitSourceDisplayNo(item) {
  return valueOrNull(item.sourceDisplayNo ?? item.sourceQuestionNo ?? item.printedQuestionNo ?? item.originalDisplayNo);
}

function legacyDisplayNo(item) {
  return valueOrNull(item.displayNo ?? item.questionNo ?? item.no);
}

function bboxSlotNo(item, index) {
  const raw = item.bboxSlotNo ?? item.slotNo ?? item.cropSlotNo ?? item.bboxIndex ?? item.localCropIndex;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : index + 1;
}

function globalId(item, setKey, sourceDisplayNo) {
  return valueOrNull(item.globalId ?? item.globalQuestionNo ?? item.internalId ?? item.questionGlobalId)
    || `${setKey || "set"}__${sourceDisplayNo || "unknown"}`;
}

function readCandidate(item, index) {
  const setKey = valueOrNull(item.setKey ?? item.sectionKey) || "";
  const evidence = sourceDisplayNoEvidence(item);
  const sourceDisplayNo = evidence ? explicitSourceDisplayNo(item) || legacyDisplayNo(item) : null;
  const slotNo = bboxSlotNo(item, index);
  return {
    original: item,
    setKey,
    globalId: globalId(item, setKey, sourceDisplayNo),
    sourceDisplayNo,
    sourceDisplayNoEvidence: evidence || null,
    bboxSlotNo: slotNo,
    cropPath: item.cropPath || item.finalCropPath || item.refinedCropPath || item.questionCropPath || "",
    pageNo: item.pageNo ?? item.sourcePageNo ?? null,
    fullPageImage: item.fullPageImage || item.pageFullImage || item.pageImagePath || item.sourcePageImage || "",
    legacyDisplayNo: legacyDisplayNo(item),
    legacyJsIdCandidate: item.jsIdCandidate ?? item.finalQuestionId ?? item.id ?? null,
  };
}

function reviewItem(candidate, reason) {
  return {
    ...candidate.original,
    setKey: candidate.setKey,
    globalId: candidate.globalId,
    sourceDisplayNo: candidate.sourceDisplayNo,
    sourceDisplayNoEvidence: candidate.sourceDisplayNoEvidence,
    bboxSlotNo: candidate.bboxSlotNo,
    mappingStatus: "map_review",
    freshJsEligible: false,
    reason,
    reviewReason: reason,
    bboxSlotNoPolicy: "bboxSlotNo is crop-internal order only and must not become displayNo/sourceDisplayNo/jsIdCandidate.",
  };
}

async function readFirstMap(reportsDir, explicitInput = "") {
  const names = explicitInput
    ? [explicitInput]
    : [
        "question_crop_map.json",
        "rpm_question_crop_map.json",
        "miraen_question_crop_map.json",
        "miraen2_question_crop_map.json",
        "donga_question_crop_map.json",
        "visang2_question_crop_map.json",
        "text1_question_crop_map.json",
      ];
  for (const name of names) {
    const file = path.isAbsolute(name) ? name : path.join(reportsDir, name);
    const raw = await readJson(file, null);
    if (raw) return { file, raw };
  }
  return { file: "", raw: null };
}

async function scan({
  bookId,
  reportsDir,
  outDir,
  workspaceRoot = process.cwd(),
  materialRoot = "",
  generatedRoot = "",
  jsDir = "",
  input = "",
  limit = 0,
  setKey = "",
  chunk = "",
}) {
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const { file: inputFile, raw } = await readFirstMap(reportsDir, input);
  const rawItems = asArray(raw);
  const accepted = [];
  const review = [];
  const seenSetDisplay = new Map();
  const seenGlobalId = new Map();
  const inputWarnings = [];

  if (!inputFile) inputWarnings.push({ input: reportsDir, reason: "question_crop_map_missing" });
  if (!rawItems.length) inputWarnings.push({ input: inputFile || reportsDir, reason: "question_crop_map_empty" });

  for (const [index, item] of rawItems.entries()) {
    if (limit > 0 && accepted.length + review.length >= limit) break;
    const candidate = readCandidate(item, index);
    if (setKey && candidate.setKey !== setKey) continue;
    if (!candidate.setKey) {
      review.push(reviewItem(candidate, "content_input_pending"));
      continue;
    }
    if (!candidate.sourceDisplayNo) {
      const reason = candidate.cropPath || candidate.fullPageImage ? "ocr_unreadable" : "source_image_missing";
      review.push(reviewItem(candidate, reason));
      continue;
    }
    const setDisplayKey = `${candidate.setKey}::${candidate.sourceDisplayNo}`;
    if (seenSetDisplay.has(setDisplayKey)) {
      review.push(reviewItem(candidate, "duplicate_slot_candidate"));
      const previous = seenSetDisplay.get(setDisplayKey);
      previous.duplicate = true;
      previous.reason = "duplicate_slot_candidate";
      previous.reviewReason = "duplicate_slot_candidate";
      continue;
    }
    if (seenGlobalId.has(candidate.globalId)) {
      review.push(reviewItem(candidate, "stale_or_extra_js_question"));
      continue;
    }
    const manifestItem = {
      bookId,
      setKey: candidate.setKey,
      globalId: candidate.globalId,
      sourceDisplayNo: candidate.sourceDisplayNo,
      displayNo: candidate.sourceDisplayNo,
      sourceDisplayNoEvidence: candidate.sourceDisplayNoEvidence,
      pageNo: candidate.pageNo,
      cropPath: candidate.cropPath,
      fullPageImage: candidate.fullPageImage,
      bboxSlotNo: candidate.bboxSlotNo,
      sourceIdentityKey: `${candidate.setKey}::${candidate.sourceDisplayNo}`,
      freshJsEligible: true,
      note: "Use globalId as internal id and setKey + sourceDisplayNo as printed-question identity. Do not use bboxSlotNo as displayNo/sourceDisplayNo/jsIdCandidate.",
    };
    accepted.push(manifestItem);
    seenSetDisplay.set(setDisplayKey, manifestItem);
    seenGlobalId.set(candidate.globalId, manifestItem);
  }

  const createdAt = new Date().toISOString();
  const report = {
    stage: "04B-question-id-mapping-guard",
    bookId,
    createdAt,
    inputFile,
    rawCount: rawItems.length,
    acceptedCount: accepted.length,
    reviewCount: review.length,
    setKey,
    chunk,
    rules: {
      bboxSlotNoIsCropInternalOnly: true,
      bboxSlotNoForbiddenAsDisplayNo: true,
      sourceDisplayNoRequiresFullPageEvidence: true,
      globalIdSeparatedFromSourceDisplayNo: true,
      workbookIdentityPolicy: "setKey + sourceDisplayNo",
    },
    inputWarnings,
    status: inputWarnings.length && !inputFile ? "empty" : review.length ? "manual_review" : "ok",
  };
  const manifest = {
    schemaVersion: "apmath.freshJsInputManifest.v1",
    stage: "04B-question-id-mapping-guard",
    bookId,
    createdAt,
    inputFile,
    itemCount: accepted.length,
    items: accepted,
    identityPolicy: {
      internalId: "globalId",
      printedQuestionIdentity: "setKey + sourceDisplayNo",
      forbidden: ["bboxSlotNo_as_displayNo", "bboxSlotNo_as_sourceDisplayNo", "bboxSlotNo_as_jsIdCandidate"],
    },
    status: accepted.length ? "ok" : "manual_review",
  };
  const reviewReport = {
    stage: "04B-question-id-mapping-guard",
    bookId,
    createdAt,
    itemCount: review.length,
    items: review,
    status: review.length ? "manual_review" : "ok",
  };
  const reportFile = path.join(outDir, `question_id_mapping_guard_report__${safeBook}__${stamp}.json`);
  const reviewFile = path.join(outDir, `question_id_mapping_review__${safeBook}__${stamp}.json`);
  const manifestFile = path.join(outDir, `fresh_js_input_manifest__${safeBook}__${stamp}.json`);
  await writeJson(reportFile, report);
  await writeJson(reviewFile, reviewReport);
  await writeJson(manifestFile, manifest);
  await writeJson(path.join(outDir, "fresh_js_input_manifest.json"), manifest);
  await writeJson(path.join(outDir, "question_id_mapping_review.json"), reviewReport);
  let sourceInventory = null;
  let questionSourceCrosscheck = null;
  if (jsDir) {
    sourceInventory = await buildSourceInventory({ workspaceRoot, materialRoot, generatedRoot, jsDir, reportsDir: outDir });
    questionSourceCrosscheck = await buildQuestionSourceCrosscheck({ workspaceRoot, materialRoot, generatedRoot, jsDir, reportsDir: outDir }, sourceInventory);
    await updatePipelineBookSummary({ reportsDir: outDir }, {
      full_page_crop_count: sourceInventory.fullPageCropCount,
      question_crop_count: sourceInventory.questionCropCount,
      quick_answer_source_count: sourceInventory.quickAnswerSourceCount,
      answer_pdf_source_count: sourceInventory.answerPdfSourceCount,
      solution_pdf_source_count: sourceInventory.solutionPdfSourceCount,
      answer_solution_crop_count: sourceInventory.answerSolutionCropCount,
      question_source_crosschecked_count: questionSourceCrosscheck.crosscheckedCount,
    });
  }
  return {
    name: "04B-question-id-mapping-guard",
    status: report.status,
    reportFile,
    reviewFile,
    manifestFile,
    acceptedCount: accepted.length,
    reviewCount: review.length,
    sourceInventoryReport: sourceInventory ? path.join(outDir, "source_inventory_report.json") : "",
    questionSourceCrosscheckReport: questionSourceCrosscheck ? path.join(outDir, "question_source_crosscheck_report.json") : "",
  };
}

export default async function stage04bQuestionIdMappingGuard(cfg = {}) {
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  return scan({
    bookId,
    reportsDir: cfg.questionIdMappingGuardReportsDir || cfg.reportsDir || path.join(process.cwd(), "reports"),
    outDir: cfg.questionIdMappingGuardOutDir || cfg.reportsDir || path.join(process.cwd(), "reports"),
    workspaceRoot: cfg.workspaceRoot || process.cwd(),
    materialRoot: cfg.materialRoot || "",
    generatedRoot: cfg.generatedRoot || "",
    jsDir: cfg.jsDir || "",
    input: cfg.questionIdMappingGuardInput || "",
    limit: Number(cfg.questionIdMappingGuardLimit || 0),
    setKey: cfg.questionIdMappingGuardSetKey || "",
    chunk: cfg.questionIdMappingGuardChunk || "",
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  scan({
    bookId: args["book-id"] || args.bookId || "book",
    reportsDir: path.resolve(args["reports-dir"] || "reports"),
    outDir: path.resolve(args.out || args["reports-dir"] || "reports"),
    workspaceRoot: path.resolve(args["workspace-root"] || process.cwd()),
    materialRoot: args["material-root"] ? path.resolve(args["material-root"]) : "",
    generatedRoot: args["generated-root"] ? path.resolve(args["generated-root"]) : "",
    jsDir: args["js-dir"] ? path.resolve(args["js-dir"]) : "",
    input: args.input || "",
    limit: args.limit ? Number(args.limit) : 0,
    setKey: args["set-key"] || "",
    chunk: args.chunk || "",
  }).then((result) => {
    console.log(JSON.stringify({
      status: result.status,
      acceptedCount: result.acceptedCount,
      reviewCount: result.reviewCount,
      reportFile: result.reportFile,
      reviewFile: result.reviewFile,
      manifestFile: result.manifestFile,
    }, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
