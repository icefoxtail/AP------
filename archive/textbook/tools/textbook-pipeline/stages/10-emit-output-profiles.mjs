import fs from "node:fs";
import path from "node:path";
import { normalizeGeneratedJs } from "../lib/js-normalization-utils.mjs";
import { emitArchiveCompatible, emitInternalJs, buildInputTemplate } from "../lib/output-profile-utils.mjs";
import { readJson, writeJson, ensureDir } from "../lib/report-utils.mjs";

export default async function stage10(cfg) {
  const normalization = await normalizeGeneratedJs(cfg, { writeBack: true });
  const model = await readJson(path.join(cfg.internalDir, "internal_question_model.json"), { questions: [] });
  const archive = await emitArchiveCompatible(cfg);
  const internalJs = await emitInternalJs(cfg, model);
  const index = model.questions.map((q) => ({
    setKey: q.setKey,
    bookPart: q.bookPart,
    id: q.archiveQuestion.id,
    displayNo: q.internal.displayNo,
    sourceCropPath: q.internal.sourceCropPath,
    contentMode: q.internal.contentMode,
  }));
  await writeJson(path.join(cfg.indexDir, "archiveCompatible_question_index.json"), index);
  const visualReport = await readJson(path.join(cfg.reportsDir, "visual_asset_crop_report.json"), { results: [] });
  const assetStatus = new Map((visualReport.results || []).map((item) => [item.image, item]));
  await writeJson(path.join(cfg.manifestDir, "archiveCompatible_asset_manifest.json"), {
    generatedAt: new Date().toISOString(),
    assets: model.questions.filter((q) => q.archiveQuestion.image).map((q) => ({
      setKey: q.setKey,
      id: q.archiveQuestion.id,
      image: q.archiveQuestion.image,
      outputPath: assetStatus.get(q.archiveQuestion.image)?.outputPath || "",
      bboxInQuestionCrop: assetStatus.get(q.archiveQuestion.image)?.bboxInQuestionCrop || [],
      status: assetStatus.get(q.archiveQuestion.image)?.status || "asset_missing",
    })),
  });
  const grouped = new Map();
  for (const q of model.questions) {
    if (!grouped.has(q.setKey)) grouped.set(q.setKey, []);
    grouped.get(q.setKey).push(buildInputTemplate(q));
  }
  for (const [setKey, items] of grouped) {
    await writeJson(path.join(cfg.inputTemplatesDir, `${setKey}_input_template.json`), {
      setKey,
      schemaVersion: 1,
      items,
    });
    await writeJson(path.join(cfg.inputTemplatesDir, `${setKey}_correction_result_schema.json`), {
      setKey,
      required: ["setKey", "id", "status"],
      allowedCorrectionFields: ["content", "choices", "answer", "solution", "note"],
    });
  }
  const internalJson = path.join(cfg.generatedRoot, "textbookInternal_questions.json");
  await ensureDir(path.dirname(internalJson));
  await fs.promises.writeFile(internalJson, `${JSON.stringify(model, null, 2)}\n`, "utf8");
  await writeJson(path.join(cfg.reportsDir, "output_profiles_report.json"), {
    stage: "10-emit-output-profiles",
    archiveCompatible: archive,
    internalJsCount: internalJs.length,
    inputTemplateCount: grouped.size,
    normalization,
    status: "ok",
  });
  return { name: "10-emit-output-profiles", status: "ok", archiveJsCount: archive.fileCount, internalJsCount: internalJs.length };
}
