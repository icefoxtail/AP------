import fs from "node:fs";
import path from "node:path";
import { archiveAllowedFields, collectQuestionBanks, findForbiddenFields, renderArchiveJs } from "./js-archive-utils.mjs";
import { ensureDir, writeJson } from "./report-utils.mjs";
import {
  applyStandardUnitMapping,
  buildStandardUnitResolver,
  loadMasterTableReference,
  validateStandardUnitMapping,
} from "./standard-unit-utils.mjs";

export const archiveFieldOrder = [
  "id",
  "level",
  "category",
  "originalCategory",
  "standardCourse",
  "standardUnitKey",
  "standardUnit",
  "standardUnitOrder",
  "questionType",
  "layoutTag",
  "tags",
  "wide",
  "content",
  "choices",
  "image",
  "answer",
  "solution",
];

function compact(value) {
  return String(value || "").replace(/[\s_]+/g, "");
}

export function inferMetaFromSetKey(setKey, cfg = {}) {
  const parts = String(setKey || "").split("_").filter(Boolean);
  const publisher = cfg.publisher || parts[0] || "";
  const textbook = cfg.textbook || parts[1] || "";
  const grade = cfg.grade || parts[parts.length - 1] || "";
  const sectionType = parts.length >= 2 ? parts[parts.length - 2] : "";
  const unit = parts.length >= 4 ? parts.slice(2, -2).join("_") : "";
  return { publisher, textbook, grade, sectionType, unit };
}

function unique(values) {
  return [...new Set(values.map((v) => String(v || "").trim()).filter(Boolean))];
}

function stripChoiceMarker(choice) {
  return String(choice || "").replace(/^\s*[\d①②③④⑤⑥⑦⑧⑨⑩]+[).]?\s*/, "").trim();
}

function looksLikeQuestionFullCrop(image) {
  return /question[_-]?crops|question_crop_images|crop_images\/original_question_full|_full\.png/i.test(String(image || ""));
}

function inferQuestionType(question) {
  if (question.questionType) return question.questionType;
  return Array.isArray(question.choices) && question.choices.length ? "objective" : "short_answer";
}

export function normalizeArchiveQuestion(question, context = {}) {
  const before = { ...question };
  const setKey = context.setKey || "";
  const cfg = context.cfg || {};
  const resolver = context.resolver;
  const meta = inferMetaFromSetKey(setKey, cfg);
  const mappingContext = {
    setKey,
    unitTitle: meta.unit || question.standardUnit,
    sectionTitle: meta.sectionType,
    category: question.category,
    originalCategory: question.originalCategory,
    standardUnit: question.standardUnit,
    standardUnitKey: question.standardUnitKey,
    pageNo: question.pageNo,
    detectedSection: context.detectedSection,
    tableOfContentsUnit: context.tableOfContentsUnit,
  };
  const mapped = applyStandardUnitMapping(question, mappingContext, resolver);
  const mappedQuestion = mapped.question;
  const report = {
    setKey,
    id: question.id,
    fieldChanges: [],
    tagChanges: [],
    unitMapping: mapped.result,
    schemaViolations: [],
    imageWarnings: [],
  };
  const normalized = {};
  normalized.id = Number.isFinite(Number(mappedQuestion.id)) ? Number(mappedQuestion.id) : mappedQuestion.id;
  normalized.level = mappedQuestion.level ?? "";
  normalized.category = mappedQuestion.category || meta.sectionType || "";
  normalized.originalCategory = mappedQuestion.originalCategory || mappedQuestion.category || meta.sectionType || "";
  normalized.standardCourse = mappedQuestion.standardCourse || meta.textbook || cfg.textbook || "";
  normalized.standardUnitKey = mappedQuestion.standardUnitKey || "UNMAPPED";
  normalized.standardUnit = mappedQuestion.standardUnit || meta.unit || "";
  normalized.standardUnitOrder = Number(mappedQuestion.standardUnitOrder) || 999;
  normalized.questionType = inferQuestionType(mappedQuestion);
  normalized.layoutTag = mappedQuestion.layoutTag || "grid";
  const baseTags = [
    "textbook",
    meta.publisher,
    meta.textbook || normalized.standardCourse,
    meta.grade,
    meta.unit || normalized.standardUnit,
    meta.sectionType,
  ];
  const existingTags = Array.isArray(mappedQuestion.tags) ? mappedQuestion.tags : [];
  normalized.tags = unique([...existingTags, ...baseTags]);
  normalized.wide = Boolean(mappedQuestion.wide);
  normalized.content = mappedQuestion.content ?? "";
  normalized.choices = Array.isArray(mappedQuestion.choices) ? mappedQuestion.choices.map(stripChoiceMarker) : [];
  normalized.image = looksLikeQuestionFullCrop(mappedQuestion.image) ? "" : (mappedQuestion.image || "");
  normalized.answer = mappedQuestion.answer ?? "";
  normalized.solution = mappedQuestion.solution ?? "";

  for (const key of archiveFieldOrder) {
    if (JSON.stringify(before[key] ?? "") !== JSON.stringify(normalized[key] ?? "")) {
      report.fieldChanges.push({ field: key, before: before[key], after: normalized[key] });
      if (key === "tags") report.tagChanges.push({ before: before[key], after: normalized[key] });
      if (key === "image" && before[key]) {
        report.imageWarnings.push({ before: before[key], after: normalized[key], reason: "question_full_crop_not_allowed_in_image" });
      }
    }
  }
  const forbidden = findForbiddenFields(question);
  if (forbidden.length) report.schemaViolations.push({ fields: forbidden });
  return { question: normalized, report };
}

export async function normalizeGeneratedJs(cfg, options = {}) {
  const master = await loadMasterTableReference(cfg);
  const resolver = buildStandardUnitResolver(master);
  if (resolver.blocked) {
    await writeJson(path.join(cfg.reportsDir, "standard_unit_mapping_blocked_report.json"), {
      stage: "09-build-internal-model",
      blockedReasons: resolver.blockedReasons,
      masterTableReferenceReport: master.reportPath,
      status: "blocked",
    });
  }
  const banks = await collectQuestionBanks(cfg.jsDir);
  const jsFormat = [];
  const tagReport = [];
  const unitReport = [];
  const unresolved = [];
  const schemaViolations = [];
  const validationItems = [];
  let changedQuestionCount = 0;
  for (const bank of banks) {
    const normalizedQuestions = [];
    let fileChanged = false;
    for (const question of bank.questions) {
      const result = normalizeArchiveQuestion(question, { setKey: bank.setKey, bookPart: bank.bookPart, cfg, resolver });
      normalizedQuestions.push(result.question);
      validationItems.push({ setKey: bank.setKey, bookPart: bank.bookPart, question: result.question });
      if (result.report.fieldChanges.length) {
        changedQuestionCount += 1;
        fileChanged = true;
        jsFormat.push({ file: bank.file, setKey: bank.setKey, id: question.id, changes: result.report.fieldChanges });
      }
      if (result.report.tagChanges.length) tagReport.push({ file: bank.file, setKey: bank.setKey, id: question.id, changes: result.report.tagChanges });
      unitReport.push({
        file: bank.file,
        setKey: bank.setKey,
        id: question.id,
        standardCourse: result.question.standardCourse,
        standardUnitKey: result.question.standardUnitKey,
        standardUnit: result.question.standardUnit,
        standardUnitOrder: result.question.standardUnitOrder,
        status: result.report.unitMapping.status === "mapped" ? "mapped" : result.report.unitMapping.status,
        mappingSource: result.report.unitMapping.source || "",
      });
      if (result.report.unitMapping.status !== "mapped") {
        unresolved.push({
          file: bank.file,
          setKey: bank.setKey,
          id: question.id,
          reason: result.report.unitMapping.reason || result.report.unitMapping.status,
          contentEmpty: !question.content,
          choicesEmpty: !Array.isArray(question.choices) || question.choices.length === 0,
        });
      }
      if (result.report.schemaViolations.length) schemaViolations.push({ file: bank.file, setKey: bank.setKey, id: question.id, violations: result.report.schemaViolations });
      if (result.report.imageWarnings.length) schemaViolations.push({ file: bank.file, setKey: bank.setKey, id: question.id, violations: result.report.imageWarnings });
    }
    if (fileChanged && options.writeBack !== false) {
      await ensureDir(path.dirname(bank.file));
      await fs.promises.writeFile(bank.file, renderArchiveJs(bank.examTitle, normalizedQuestions), "utf8");
    }
  }
  const validation = validateStandardUnitMapping(validationItems, resolver);
  validation.jsFileCount = banks.length;
  validation.changedQuestionCount = changedQuestionCount;
  validation.emptyTags = tagReport.filter((r) => !r.changes?.[0]?.after?.length).length;
  validation.schemaViolationCount = schemaViolations.length;
  validation.status = resolver.blocked ? "blocked" : validation.unmapped || validation.bypassViolationCount || schemaViolations.length ? "partial" : "ok";

  await writeJson(path.join(cfg.reportsDir, "js_format_normalization_report.json"), jsFormat);
  await writeJson(path.join(cfg.reportsDir, "tag_normalization_report.json"), tagReport);
  await writeJson(path.join(cfg.reportsDir, "standard_unit_mapping_report.json"), unitReport);
  await writeJson(path.join(cfg.reportsDir, "standard_unit_mapping_validation.json"), validation);
  await writeJson(path.join(cfg.reportsDir, "standard_unit_mapping_unresolved.json"), unresolved);
  await writeJson(path.join(cfg.reportsDir, "unresolved_standard_unit_report.json"), unresolved);
  await writeJson(path.join(cfg.reportsDir, "js_archive_schema_violation_report.json"), schemaViolations);
  return validation;
}
