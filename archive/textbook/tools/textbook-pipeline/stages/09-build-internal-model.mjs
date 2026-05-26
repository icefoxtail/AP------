import path from "node:path";
import { normalizeGeneratedJs } from "../lib/js-normalization-utils.mjs";
import { buildInternalQuestionModel, summarizeInternalModel } from "../lib/internal-model-utils.mjs";
import { readJson, writeJson } from "../lib/report-utils.mjs";
import { makeStageReport } from "../lib/stage-result-utils.mjs";

export default async function stage09(cfg) {
  const masterReportPath = path.join(cfg.reportsDir, "master_table_reference_report.json");
  const masterReport = await readJson(masterReportPath, null);
  if (!masterReport?.standardUnits?.length) {
    await writeJson(path.join(cfg.reportsDir, "standard_unit_mapping_blocked_report.json"), {
      stage: "09-build-internal-model",
      inputFiles: [masterReportPath],
      outputFiles: [],
      missingInputs: masterReport ? [] : [masterReportPath],
      status: "blocked",
      blockedReasons: ["master_table_reference_report_missing_or_empty"],
      manualReviewCount: 1,
      nextStageContract: {
        validationMustForbidPass: true,
      },
    });
  }
  const normalization = await normalizeGeneratedJs(cfg, { writeBack: true });
  const model = await buildInternalQuestionModel(cfg);
  await writeJson(path.join(cfg.internalDir, "internal_question_model.json"), model);
  await writeJson(path.join(cfg.internalDir, "internal_asset_model.json"), {
    generatedAt: new Date().toISOString(),
    assets: model.questions.filter((q) => q.archiveQuestion.image).map((q) => ({
      setKey: q.setKey,
      bookPart: q.bookPart,
      id: q.archiveQuestion.id,
      image: q.archiveQuestion.image,
      status: "asset_crop_pending",
    })),
  });
  const summary = summarizeInternalModel(cfg, model);
  await writeJson(path.join(cfg.reportsDir, "internal_model_build_report.json"), summary);
  const report = makeStageReport("09-build-internal-model", {
    inputFiles: [cfg.jsDir, masterReportPath],
    outputFiles: [
      path.join(cfg.internalDir, "internal_question_model.json"),
      path.join(cfg.internalDir, "internal_asset_model.json"),
      path.join(cfg.reportsDir, "standard_unit_mapping_report.json"),
      path.join(cfg.reportsDir, "standard_unit_mapping_validation.json"),
      path.join(cfg.reportsDir, "standard_unit_mapping_unresolved.json"),
    ],
    missingInputs: masterReport?.standardUnits?.length ? [] : [masterReportPath],
    status: normalization.status,
    blockedReasons: normalization.blocked ? normalization.blockedReasons : [],
    manualReviewCount: Number(normalization.unmapped || 0) + Number(normalization.bypassViolationCount || 0),
    nextStageContract: {
      internalQuestionModel: "generated/internal/internal_question_model.json",
      standardUnitMappingValidation: "generated/reports/standard_unit_mapping_validation.json",
      passForbiddenWhenUnmapped: true,
    },
    extra: {
      questionCount: model.questionCount,
      normalization,
    },
  });
  await writeJson(path.join(cfg.reportsDir, "stage_09_contract_report.json"), report);
  return { name: "09-build-internal-model", status: report.status, questionCount: model.questionCount, normalization };
}
