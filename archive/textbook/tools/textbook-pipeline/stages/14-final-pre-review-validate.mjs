import path from "node:path";
import validateStage from "./11-validate.mjs";
import { readJson, writeJson } from "../lib/report-utils.mjs";

export default async function stage14FinalPreReviewValidate(cfg = {}) {
  const validation = await validateStage(cfg);
  const formulaAutoApply = await readJson(path.join(cfg.reportsDir, "formula_auto_apply_report.json"), {});
  const contentChoices = await readJson(path.join(cfg.reportsDir, "content_choices_extraction_report.json"), {});
  const answerReport = await readJson(path.join(cfg.reportsDir, "answer_report.json"), {});
  const report = {
    stage: "14-final-pre-review-validate",
    createdAt: new Date().toISOString(),
    status: validation.status === "ok" || validation.status === "pass" ? "ok" : "manual_review",
    validation,
    formulaAutoApply: {
      patchCount: formulaAutoApply.patchCount ?? 0,
      appliedCount: formulaAutoApply.appliedCount ?? 0,
      rejectedCount: formulaAutoApply.rejectedCount ?? 0,
      changedFileCount: formulaAutoApply.changedFileCount ?? 0,
      report: "formula_auto_apply_report.json",
    },
    contentChoices: {
      questionCount: contentChoices.questionCount ?? contentChoices.summary?.questionCount ?? null,
      filledContentCount: contentChoices.filledContentCount ?? contentChoices.summary?.filledContentCount ?? null,
      emptyContentCount: contentChoices.emptyContentCount ?? contentChoices.summary?.emptyContentCount ?? null,
    },
    answer: {
      questionCount: answerReport.questionCount ?? null,
      appliedCount: answerReport.appliedCount ?? null,
      missingEvidenceCount: answerReport.missingEvidenceCount ?? null,
    },
    nextStep: "Human final review should inspect formula_auto_apply_report.json rejections and normal validation reports.",
  };
  await writeJson(path.join(cfg.reportsDir, "final_pre_review_validation_report.json"), report);
  return {
    name: "14-final-pre-review-validate",
    status: report.status,
    formulaAppliedCount: report.formulaAutoApply.appliedCount,
    formulaRejectedCount: report.formulaAutoApply.rejectedCount,
  };
}
