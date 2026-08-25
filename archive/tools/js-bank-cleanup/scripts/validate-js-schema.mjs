import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanJsBank, writeJsBankInventory, parseArgs, increment } from "./scan-js-bank.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");
const MASTER_PATH_CANDIDATES = [
  path.join(ROOT_DIR, "docs", "rules", "JS아카이브_표준단원키_마스터테이블.md"),
  path.join(ROOT_DIR, "rules", "JS아카이브_표준단원키_마스터테이블.md"),
];
const SUBUNIT_MASTER_PATH = path.join(ROOT_DIR, "archive", "data", "master_tables", "js_archive_tag_master.json");
const SUBUNIT_FIELDS = ["subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"];
const SUBUNIT_CONFIDENCE = new Set(["existing_preserved", "candidate_evidence", "category_or_cue_inferred", "rule_inferred"]);
const SUBUNIT_DEPTH = new Set(["complete_candidate", "complete_category", "complete_documented", "complete_rule"]);
const MASTER_PATH = MASTER_PATH_CANDIDATES.find((candidate) => fs.existsSync(candidate));
const ALLOWED_QUESTION_TYPE = new Set(["", "객관식", "단답형", "주관식", "서술형"]);
const ALLOWED_LAYOUT_TAG = new Set(["", "grid", "subjective-2up", "subjective-4up", "fullwidth"]);

function parseMasterUnits() {
  if (!MASTER_PATH) throw new Error(`standard-unit master table not found: ${MASTER_PATH_CANDIDATES.join(", ")}`);
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

function parseMasterParents(subunitRecords) {
  const parents = new Set();
  for (const record of subunitRecords) {
    if (record?.keyType !== "subUnitKey") continue;
    const parent = String(record.standardUnitKey ?? "").trim();
    if (parent && !/^(RAW|RRAW|UNMAPPED)-/.test(parent)) parents.add(parent);
  }
  return parents;
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
  const subunitRecords = fs.existsSync(SUBUNIT_MASTER_PATH) ? JSON.parse(fs.readFileSync(SUBUNIT_MASTER_PATH, "utf8")) : [];
  const masterParents = parseMasterParents(subunitRecords);
  const subunits = new Map(subunitRecords.filter((record) => record.keyType === "subUnitKey").map((record) => [record.key, record]));
  const issues = [];
  const specialLayout = [];
  const acceptedDocumentedParentKeys = {};

  for (const file of jsInventory.files) {
    for (const question of file.questions) {
      for (const field of question.missingRequiredFields) {
        issues.push(issue("error", file.relativePath, question, "missing_required_field", `missing required field: ${field}`, null, { field }));
      }
      const missing = new Set(question.missingRequiredFields);
      const missingSubunitFields = SUBUNIT_FIELDS.filter((field) => !question[field]);
      if (missingSubunitFields.length && !file.relativePath.includes("/raw/")) {
        issues.push(issue("warn", file.relativePath, question, "legacy_subunit_fields_missing", "new subunit fields are missing; classify as legacy exception before promotion", missingSubunitFields, { fields: missingSubunitFields }));
      }
      if (!missingSubunitFields.length && question.subUnitKey && !/^RAW-|^RRAW-|^UNMAPPED-/.test(question.subUnitKey)) {
        const subunit = subunits.get(question.subUnitKey);
        if (!subunit) issues.push(issue("warn", file.relativePath, question, "unknown_subunit_key", "subUnitKey is not in compiled master", question.subUnitKey));
        else if (subunit.standardUnitKey && subunit.standardUnitKey !== question.standardUnitKey) issues.push(issue("warn", file.relativePath, question, "subunit_parent_mismatch", "subUnitKey parent differs from standardUnitKey", { current: question.standardUnitKey, master: subunit.standardUnitKey }));
        if (subunit && subunit.labelKo && question.subUnit !== subunit.labelKo) issues.push(issue("warn", file.relativePath, question, "subunit_label_mismatch", "subUnit differs from compiled master", { current: question.subUnit, master: subunit.labelKo }));
      }
      if (!missingSubunitFields.includes("subUnitConfidence") && !SUBUNIT_CONFIDENCE.has(question.subUnitConfidence)) issues.push(issue("warn", file.relativePath, question, "invalid_subunit_confidence", "subUnitConfidence has non-standard value", question.subUnitConfidence));
      if (!missingSubunitFields.includes("subUnitClassificationDepth") && !SUBUNIT_DEPTH.has(question.subUnitClassificationDepth)) issues.push(issue("warn", file.relativePath, question, "invalid_subunit_depth", "subUnitClassificationDepth has non-standard value", question.subUnitClassificationDepth));
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
      const isDocumentedParent = !missing.has("standardUnitKey")
        && question.standardUnitKey
        && !masterUnits.has(question.standardUnitKey)
        && masterParents.has(question.standardUnitKey)
        && !/^(RAW|RRAW|UNMAPPED)-/.test(question.standardUnitKey);
      if (isDocumentedParent) increment(acceptedDocumentedParentKeys, question.standardUnitKey);
      if (!missing.has("standardUnitKey") && (!question.standardUnitKey || (!masterUnits.has(question.standardUnitKey) && !isDocumentedParent))) {
        issues.push(issue("warn", file.relativePath, question, "unknown_standard_unit_key", "standardUnitKey is missing or not in master table", question.standardUnitKey));
      } else if (!missing.has("standardUnitKey") && masterUnits.has(question.standardUnitKey)) {
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
      path: "docs/rules/JS아카이브_표준단원키_마스터테이블.md",
      standardUnitKeyCount: masterUnits.size,
      documentedParentKeyCount: masterParents.size,
      acceptedDocumentedParentKeys,
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
