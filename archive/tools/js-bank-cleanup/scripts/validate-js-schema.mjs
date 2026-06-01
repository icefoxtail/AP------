import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanJsBank, writeJsBankInventory, parseArgs } from "./scan-js-bank.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");
const MASTER_PATH = path.join(ROOT_DIR, "rules", "# JS아카이브 표준단원키 마스터 테이블.md");
const ALLOWED_QUESTION_TYPE = new Set(["", "객관식", "단답형", "주관식", "서술형"]);
const ALLOWED_LAYOUT_TAG = new Set(["", "grid", "subjective-2up", "subjective-4up", "fullwidth"]);

function parseMasterUnits() {
  const text = fs.readFileSync(MASTER_PATH, "utf8");
  const units = new Map();
  const rowRegex = /^\|\s*([^|\s][^|]*?)\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|$/gm;
  let match;
  while ((match = rowRegex.exec(text))) {
    const key = match[1].trim();
    const unit = match[2].trim();
    const order = Number(match[3]);
    if (/^(M\d-\d{2}|H\d{2}-[A-Z0-9]+-\d{2}|H15-[A-Z0-9]+-\d{2})$/.test(key)) {
      units.set(key, { key, unit, order });
    }
  }
  return units;
}

function issue(severity, sourceFile, question, code, message, currentValue = null, extra = {}) {
  return {
    severity,
    sourceFile,
    questionId: question.questionId,
    originalIndex: question.originalIndex,
    code,
    message,
    currentValue,
    ...extra,
  };
}

export function validateJsSchema(options = parseArgs()) {
  const jsInventory = scanJsBank(options);
  writeJsBankInventory(jsInventory);
  const masterUnits = parseMasterUnits();
  const issues = [];
  const specialLayout = [];

  for (const file of jsInventory.files) {
    for (const question of file.questions) {
      for (const field of question.missingRequiredFields) {
        issues.push(issue("error", file.relativePath, question, "missing_required_field", `missing required field: ${field}`, null, { field }));
      }
      const missing = new Set(question.missingRequiredFields);
      if (!missing.has("questionType") && !ALLOWED_QUESTION_TYPE.has(question.questionType)) {
        issues.push(issue("warn", file.relativePath, question, "invalid_question_type", "questionType has non-standard value", question.questionType));
      }
      if (!missing.has("layoutTag") && !ALLOWED_LAYOUT_TAG.has(question.layoutTag)) {
        issues.push(issue("warn", file.relativePath, question, "invalid_layout_tag", "layoutTag has non-standard value", question.layoutTag));
      }
      if (!missing.has("layoutTag") && question.layoutTag && question.layoutTag !== "grid") {
        specialLayout.push({ sourceFile: file.relativePath, questionId: question.questionId, layoutTag: question.layoutTag, wide: question.wide });
      }
      if (!missing.has("wide") && question.wide === true) {
        specialLayout.push({ sourceFile: file.relativePath, questionId: question.questionId, layoutTag: question.layoutTag, wide: question.wide });
      }
      if (!missing.has("wide") && !question.wideIsBoolean) issues.push(issue("error", file.relativePath, question, "invalid_wide", "wide is not boolean", question.wide));
      if (!missing.has("tags") && !question.tagsIsArray) issues.push(issue("error", file.relativePath, question, "invalid_tags", "tags is not an array", question.tags));
      if (!missing.has("choices") && !question.choicesIsArray) issues.push(issue("error", file.relativePath, question, "invalid_choices", "choices is not an array", question.choicesLength));
      for (const choiceError of question.choiceFormatErrors) issues.push(issue("error", file.relativePath, question, "invalid_choices", choiceError));
      if (!missing.has("answer") && question.answerEmpty) issues.push(issue("warn", file.relativePath, question, "empty_answer", "answer is empty"));
      if (!missing.has("solution") && question.solutionEmpty) issues.push(issue("warn", file.relativePath, question, "empty_solution", "solution is empty"));
      if (!missing.has("content") && question.contentEmpty) issues.push(issue("error", file.relativePath, question, "empty_content", "content is empty"));
      if (!missing.has("standardUnitKey") && question.standardUnitKey?.startsWith("RAW")) issues.push(issue("warn", file.relativePath, question, "raw_unit", "standardUnitKey uses RAW", question.standardUnitKey));
      if (!missing.has("standardUnitKey") && (!question.standardUnitKey || !masterUnits.has(question.standardUnitKey))) {
        issues.push(issue("warn", file.relativePath, question, "unknown_standard_unit_key", "standardUnitKey is missing or not in master table", question.standardUnitKey));
      } else if (!missing.has("standardUnitKey")) {
        const master = masterUnits.get(question.standardUnitKey);
        if (question.standardUnit && master.unit && question.standardUnit !== master.unit) {
          issues.push(issue("warn", file.relativePath, question, "standard_unit_mismatch", "standardUnit differs from master table", { current: question.standardUnit, master: master.unit }));
        }
        if (question.standardUnitOrder !== master.order) {
          issues.push(issue("warn", file.relativePath, question, "standard_unit_order_mismatch", "standardUnitOrder differs from master table", { current: question.standardUnitOrder, master: master.order }));
        }
      }
      if (question.hasGeneratedPendingSolution) {
        issues.push(issue("critical", file.relativePath, question, "generated_pending_solution", "generated_pending or manual-review marker appears in solution"));
      }
    }
  }

  const countsByCode = {};
  const countsBySeverity = {};
  for (const item of issues) {
    countsByCode[item.code] = (countsByCode[item.code] ?? 0) + 1;
    countsBySeverity[item.severity] = (countsBySeverity[item.severity] ?? 0) + 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    source: "archive/exams/**/*.js",
    filters: jsInventory.filters,
    totals: {
      issues: issues.length,
      specialLayout: specialLayout.length,
      countsByCode,
      countsBySeverity,
    },
    masterTable: {
      path: "rules/# JS아카이브 표준단원키 마스터 테이블.md",
      standardUnitKeyCount: masterUnits.size,
    },
    issues,
    specialLayout,
  };
}

function renderSummary(report) {
  const rows = Object.entries(report.totals.countsByCode)
    .sort((a, b) => b[1] - a[1])
    .map(([code, count]) => `| ${code} | ${count} |`)
    .join("\n");
  return `# Schema Validation Summary

- Generated: ${report.generatedAt}
- Issues: ${report.totals.issues}
- Special layout/wide records: ${report.totals.specialLayout}
- Master standardUnitKey count: ${report.masterTable.standardUnitKeyCount}

| Code | Count |
|---|---:|
${rows || "| - | 0 |"}
`;
}

export function writeSchemaValidation(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "schema-validation.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "schema-validation.summary.md"), renderSummary(report), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = validateJsSchema();
  writeSchemaValidation(report);
  console.log(`Validated JS schema with ${report.totals.issues} issues.`);
}
