import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { collectQuestionBanks, findForbiddenFields, listArchiveJs } from "../lib/js-archive-utils.mjs";
import { hasMappedStandardUnit } from "../lib/standard-unit-utils.mjs";
import { exists, readJson, writeJson } from "../lib/report-utils.mjs";
import { makeStageReport } from "../lib/stage-result-utils.mjs";

const execFileAsync = promisify(execFile);

async function checkJs(file) {
  try {
    await execFileAsync("node", ["--check", file], { timeout: 10000 });
    return { file, ok: true };
  } catch (error) {
    return { file, ok: false, error: error.message };
  }
}

export default async function stage11(cfg) {
  const requiredGateReports = [
    "rules_read_report.json",
    "master_table_reference_report.json",
    "js_archive_shape_reference.json",
    "rulebook_gate_report.json",
    "standard_unit_mapping_validation.json",
  ];
  const missingGateReports = [];
  for (const reportName of requiredGateReports) {
    if (!(await exists(path.join(cfg.reportsDir, reportName)))) missingGateReports.push(reportName);
  }
  const gateReport = await readJson(path.join(cfg.reportsDir, "rulebook_gate_report.json"), null);
  const standardUnitValidation = await readJson(path.join(cfg.reportsDir, "standard_unit_mapping_validation.json"), null);
  const mappingBlocked = await exists(path.join(cfg.reportsDir, "standard_unit_mapping_blocked_report.json"));
  const files = await listArchiveJs(cfg.jsDir);
  const syntax = [];
  for (const file of files) syntax.push(await checkJs(file));
  const banks = await collectQuestionBanks(cfg.jsDir);
  const rawCropMap = await readJson(path.join(cfg.reportsDir, "question_crop_map.json"), []);
  const cropMap = Array.isArray(rawCropMap) ? rawCropMap : Array.isArray(rawCropMap?.items) ? rawCropMap.items : [];
  let questionCount = 0;
  let emptyTags = 0;
  let unmapped = 0;
  let nonEmptySolution = 0;
  let missingImages = 0;
  let questionFullCropInImage = 0;
  let choiceShapeErrors = 0;
  const forbidden = [];
  for (const bank of banks) {
    for (const q of bank.questions) {
      questionCount += 1;
      if (!Array.isArray(q.tags) || q.tags.length === 0) emptyTags += 1;
      if (!hasMappedStandardUnit(q)) unmapped += 1;
      const noteText = JSON.stringify([q.note, q.notes, q.reason, q.mappingNote, q.reviewStatus].filter(Boolean));
      if (/content.*(없|missing|empty).*standardUnitKey|standardUnitKey.*content.*(없|missing|empty)/i.test(noteText)) {
        forbidden.push({ setKey: bank.setKey, id: q.id, fields: ["content_based_standard_unit_excuse_note"] });
      }
      if (!Array.isArray(q.choices)) choiceShapeErrors += 1;
      if (q.solution) nonEmptySolution += 1;
      if (/question[_-]?crops|question_crop_images|crop_images\/original_question_full|_full\.png/i.test(String(q.image || ""))) questionFullCropInImage += 1;
      if (q.image && !(await exists(path.join(cfg.generatedRoot, q.image.replaceAll("/", path.sep))))) missingImages += 1;
      const bad = findForbiddenFields(q);
      if (bad.length) forbidden.push({ setKey: bank.setKey, id: q.id, fields: bad });
    }
  }
  const report = {
    stage: "11-validate",
    inputFiles: [cfg.jsDir, ...requiredGateReports.map((file) => path.join(cfg.reportsDir, file))],
    outputFiles: [path.join(cfg.reportsDir, "pipeline_validation_report.json"), path.join(cfg.reportsDir, "validation_summary.json")],
    missingInputs: missingGateReports,
    blockedReasons: [
      ...missingGateReports.map((file) => `missing_report:${file}`),
      ...(mappingBlocked ? ["standard_unit_mapping_blocked"] : []),
      ...(standardUnitValidation?.unmapped ? [`standard_unit_unmapped:${standardUnitValidation.unmapped}`] : []),
    ],
    manualReviewCount: missingGateReports.length + unmapped + forbidden.length,
    nextStageContract: {
      finalPassAllowed: false,
      reason: "computed below",
    },
    syntax,
    syntaxPass: syntax.every((x) => x.ok),
    jsFileCount: files.length,
    questionCount,
    cropMapCount: cropMap.length,
    emptyTags,
    unmapped,
    nonEmptySolution,
    missingImages,
    questionFullCropInImage,
    choiceShapeErrors,
    forbiddenArchiveFields: forbidden,
    gate: {
      rulebookGateStatus: gateReport?.status || "missing",
      missingGateReports,
      mappingBlocked,
      standardUnitMappingValidation: standardUnitValidation,
    },
  };
  const passAllowed = report.syntaxPass
    && missingGateReports.length === 0
    && !mappingBlocked
    && !standardUnitValidation?.blocked
    && Number(standardUnitValidation?.unmapped || unmapped) === 0
    && Number(standardUnitValidation?.bypassViolationCount || 0) === 0
    && emptyTags === 0
    && unmapped === 0
    && questionFullCropInImage === 0
    && choiceShapeErrors === 0
    && missingImages === 0
    && forbidden.length === 0;
  report.nextStageContract.finalPassAllowed = passAllowed;
  report.nextStageContract.reason = passAllowed ? "validation_criteria_met" : "validation_criteria_not_met";
  report.status = passAllowed ? "ok" : (report.syntaxPass ? "partial" : "fail");
  await writeJson(path.join(cfg.reportsDir, "pipeline_validation_report.json"), report);
  await writeJson(path.join(cfg.reportsDir, "validation_summary.json"), report);
  const contract = makeStageReport("11-validate", {
    inputFiles: report.inputFiles,
    outputFiles: report.outputFiles,
    missingInputs: report.missingInputs,
    status: report.status,
    blockedReasons: report.blockedReasons,
    manualReviewCount: report.manualReviewCount,
    nextStageContract: report.nextStageContract,
    extra: {
      questionCount,
      syntaxPass: report.syntaxPass,
      unmapped,
      mappingBlocked,
    },
  });
  await writeJson(path.join(cfg.reportsDir, "stage_11_contract_report.json"), contract);
  return { name: "11-validate", status: report.status, questionCount, syntaxPass: report.syntaxPass, unmapped };
}
