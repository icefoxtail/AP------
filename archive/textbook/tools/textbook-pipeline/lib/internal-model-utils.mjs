import path from "node:path";
import { collectQuestionBanks } from "./js-archive-utils.mjs";
import { readJson } from "./report-utils.mjs";
import { rel } from "./paths.mjs";

async function readFirstMap(reportsDir) {
  for (const name of ["fresh_js_input_manifest.json", "question_crop_map.json", "text1_question_crop_map.json"]) {
    const raw = await readJson(path.join(reportsDir, name), null);
    if (raw) return { name, raw };
  }
  return { name: "", raw: [] };
}

export async function buildInternalQuestionModel(cfg) {
  const banks = await collectQuestionBanks(cfg.jsDir);
  const mapInput = await readFirstMap(cfg.reportsDir);
  const rawCropMap = mapInput.raw;
  const strictManifest = mapInput.name === "fresh_js_input_manifest.json";
  const cropMap = Array.isArray(rawCropMap) ? rawCropMap : Array.isArray(rawCropMap?.items) ? rawCropMap.items : [];
  const cropBySetId = new Map();
  for (const item of cropMap) {
    if (item.mappingStatus === "map_review" || item.sourceDisplayNo === null) continue;
    const globalId = strictManifest
      ? (item.globalId || item.globalQuestionNo || item.internalId || item.questionGlobalId)
      : (item.globalId || item.globalQuestionNo || item.internalId || item.questionGlobalId || item.jsIdCandidate || item.finalQuestionId || item.id);
    const sourceDisplayNo = strictManifest
      ? item.sourceDisplayNo
      : (item.sourceDisplayNo || item.displayNo || item.sourceQuestionNo || item.questionNo);
    if (globalId) cropBySetId.set(`${item.setKey}:${globalId}`, item);
    if (sourceDisplayNo) cropBySetId.set(`${item.setKey}:${sourceDisplayNo}`, item);
  }
  const questions = [];
  for (const bank of banks) {
    for (const question of bank.questions) {
      const crop = cropBySetId.get(`${bank.setKey}:${question.id}`) || null;
      questions.push({
        setKey: bank.setKey,
        bookPart: bank.bookPart,
        examTitle: bank.examTitle,
        archiveQuestion: question,
        internal: {
          sourcePolicy: cfg.sourcePolicy || "crop_first",
          contentMode: question.image ? "content_plus_asset_candidate" : "text_only",
          sourceCropPath: crop?.cropPath || crop?.finalCropPath || "",
          sourcePageNo: crop?.pageNo || null,
          sourceDisplayNo: crop?.sourceDisplayNo || crop?.displayNo || "",
          bboxSlotNo: crop?.bboxSlotNo ?? null,
          globalId: crop?.globalId || crop?.globalQuestionNo || "",
          displayNo: crop?.sourceDisplayNo || crop?.displayNo || "",
          mappingSource: mapInput.name || "",
          mapReviewStatus: crop?.mappingStatus || "",
          reviewStatus: question.content ? "ok" : "manual_review",
        },
      });
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    workspaceRoot: cfg.workspaceRoot,
    questionCount: questions.length,
    questions,
  };
}

export function summarizeInternalModel(cfg, model) {
  const bySetKey = {};
  for (const q of model.questions) {
    bySetKey[q.setKey] ??= { setKey: q.setKey, bookPart: q.bookPart, count: 0, manualReview: 0 };
    bySetKey[q.setKey].count += 1;
    if (q.internal.reviewStatus !== "ok") bySetKey[q.setKey].manualReview += 1;
  }
  return {
    questionCount: model.questionCount,
    setCount: Object.keys(bySetKey).length,
    bySetKey: Object.values(bySetKey),
    modelPath: rel(cfg.workspaceRoot, path.join(cfg.internalDir, "internal_question_model.json")),
  };
}
