import path from "node:path";
import { exists, readJson, writeJson } from "../lib/report-utils.mjs";

function asArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  return [];
}

function valueOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sourceDisplayNoEvidence(item) {
  const source = String(item.sourceDisplayNoSource || item.displayNoSource || item.questionNoSource || "").toLowerCase();
  if (item.sourceDisplayNoConfirmed === true || item.displayNoConfirmed === true) return "confirmed_flag";
  if (["manual", "ocr", "full_page_ocr", "source_text_layer", "publisher_index"].includes(source)) return source;
  if (item.sourceDisplayNo && source) return source;
  return "";
}

function normalizeMapItem(item, index) {
  const legacyDisplayNo = valueOrNull(item.displayNo);
  const legacyJsIdCandidate = item.jsIdCandidate ?? item.finalQuestionId ?? item.id ?? null;
  const bboxSlotNo = numberOrNull(item.bboxSlotNo ?? item.slotNo ?? item.cropSlotNo ?? legacyJsIdCandidate ?? legacyDisplayNo ?? index + 1);
  const evidence = sourceDisplayNoEvidence(item);
  const sourceDisplayNo = evidence ? valueOrNull(item.sourceDisplayNo ?? item.displayNo ?? item.sourceQuestionNo ?? item.questionNo) : null;
  const base = {
    ...item,
    bboxSlotNo,
    legacyDisplayNo,
    legacyJsIdCandidate,
    sourceDisplayNo,
    sourceDisplayNoEvidence: evidence || null,
    displayNo: sourceDisplayNo,
  };
  if (sourceDisplayNo) {
    return {
      ...base,
      mappingStatus: item.mappingStatus || "ok",
      needsReview: item.needsReview === true,
    };
  }
  return {
    ...base,
    displayNo: null,
    mappingStatus: "map_review",
    needsReview: true,
    mapReviewReason: "sourceDisplayNo_unconfirmed_bboxSlotNo_not_sourceDisplayNo",
  };
}

export default async function stage06(cfg) {
  const src = path.join(cfg.reportsDir, "text1_question_crop_map.json");
  const dest = path.join(cfg.reportsDir, "question_crop_map.json");
  const raw = await readJson(src, await readJson(dest, []));
  const sourceExists = await exists(src);
  const originalItems = asArray(raw);
  const normalized = originalItems.map(normalizeMapItem);
  const map = normalized.filter((item) => item.mappingStatus !== "map_review");
  const mapReview = normalized.filter((item) => item.mappingStatus === "map_review");
  const failed = map.filter((x) => x.status && !String(x.status).includes("success"));
  const rawWasObject = raw && typeof raw === "object" && !Array.isArray(raw);
  const outputMap = rawWasObject ? { ...raw, items: map } : map;
  const reviewOutput = rawWasObject ? { ...raw, items: mapReview } : mapReview;
  await writeJson(dest, outputMap);
  await writeJson(path.join(cfg.reportsDir, "question_crop_map_review.json"), reviewOutput);
  const mapReport = {
    stage: "06-question-full-crop",
    mode: "reuse_existing_question_crops_with_source_display_guard",
    sourceFile: sourceExists ? src : dest,
    outputFile: dest,
    rawCount: originalItems.length,
    acceptedCount: map.length,
    mapReviewCount: mapReview.length,
    failedCount: failed.length,
    bboxSlotNoSeparatedFromSourceDisplayNo: true,
    sourceDisplayNoPolicy: "sourceDisplayNo is populated only when confirmed by manual/OCR/source evidence; bbox slot numbers are never promoted to sourceDisplayNo.",
    staleOrExtraJsQuestionPrevention: "Unconfirmed sourceDisplayNo entries are written to question_crop_map_review.json and excluded from question_crop_map.json.",
    workbookMappingKeyPolicy: "Downstream matching must use setKey + sourceDisplayNo when source display numbers restart by section.",
    status: mapReview.length ? "manual_review" : (sourceExists || map.length ? "ok" : "manual_review"),
  };
  await writeJson(path.join(cfg.reportsDir, "question_crop_map_report.json"), mapReport);
  await writeJson(path.join(cfg.reportsDir, "question_crop_result_report.json"), {
    stage: "06-question-full-crop",
    mode: "reuse_existing_question_crops_with_source_display_guard",
    sourceFile: sourceExists ? src : dest,
    cropCount: map.length,
    rawCropCount: originalItems.length,
    mapReviewCount: mapReview.length,
    failedCount: failed.length,
    bboxSlotNoSeparatedFromSourceDisplayNo: true,
    status: mapReport.status,
  });
  await writeJson(path.join(cfg.reportsDir, "question_crop_failed.json"), failed);
  return { name: "06-question-full-crop", status: mapReport.status, cropCount: map.length, mapReviewCount: mapReview.length };
}
