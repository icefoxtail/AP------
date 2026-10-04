import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compareDbVsFiles, writeDbVsFilesMismatch } from "./compare-db-vs-files.mjs";
import { validateJsSchema, writeSchemaValidation } from "./validate-js-schema.mjs";
import { scanImageAssets, writeImageReports } from "./scan-image-assets.mjs";
import { parseArgs } from "./scan-js-bank.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");

const ACTION_BY_SCHEMA_CODE = {
  invalid_question_type: "FIX_MISSING_DEFAULT_FIELD",
  invalid_layout_tag: "REVIEW_SPECIAL_LAYOUT",
  invalid_wide: "REVIEW_SPECIAL_LAYOUT",
  invalid_tags: "FIX_MISSING_DEFAULT_FIELD",
  invalid_choices: "REVIEW_INVALID_CHOICES",
  empty_answer: "REVIEW_MISSING_ANSWER",
  empty_solution: "REVIEW_MISSING_SOLUTION",
  empty_content: "REVIEW_EMPTY_CONTENT",
  raw_unit: "REVIEW_RAW_UNIT",
  unknown_standard_unit_key: "REVIEW_UNKNOWN_STANDARD_UNIT_KEY",
  standard_unit_mismatch: "FIX_STANDARD_UNIT_MAPPING",
  standard_unit_order_mismatch: "FIX_STANDARD_UNIT_MAPPING",
  generated_pending_solution: "REVIEW_MISSING_SOLUTION",
};
const SAFE_DEFAULTS = {
  questionType: "",
  layoutTag: "grid",
  tags: [],
  wide: false,
};
const REVIEW_ACTION_FOR_MISSING_FIELD = {
  id: "DB_FIX_METADATA",
  level: "DB_FIX_METADATA",
  category: "DB_FIX_METADATA",
  originalCategory: "DB_FIX_METADATA",
  standardCourse: "FIX_STANDARD_UNIT_MAPPING",
  content: "REVIEW_EMPTY_CONTENT",
  choices: "REVIEW_INVALID_CHOICES",
  answer: "REVIEW_MISSING_ANSWER",
  solution: "REVIEW_MISSING_SOLUTION",
  standardUnitKey: "REVIEW_UNKNOWN_STANDARD_UNIT_KEY",
  standardUnit: "FIX_STANDARD_UNIT_MAPPING",
  standardUnitOrder: "FIX_STANDARD_UNIT_MAPPING",
};

function candidate(id, severity, actionType, sourceFile, questionId, dbFile, currentValue, suggestedValue, reason, autoFixSafe, requiresMasterReview) {
  return {
    candidateId: `CLEANUP-${String(id).padStart(5, "0")}`,
    severity,
    actionType,
    sourceFile,
    questionId: questionId ?? null,
    dbFile: dbFile ?? "",
    currentValue,
    suggestedValue,
    reason,
    autoFixSafe,
    requiresMasterReview,
  };
}

function severityForSchema(issue) {
  if (issue.severity === "critical") return "critical";
  if (issue.severity === "error") return "error";
  return "warn";
}

function schemaCandidateSafety(issue) {
  if (issue.code === "missing_required_field") {
    const isSafeDefault = Object.hasOwn(SAFE_DEFAULTS, issue.field);
    return {
      autoFixSafe: isSafeDefault,
      requiresMasterReview: !isSafeDefault,
    };
  }
  if (["invalid_tags"].includes(issue.code)) return { autoFixSafe: true, requiresMasterReview: false };
  if (["standard_unit_order_mismatch"].includes(issue.code)) return { autoFixSafe: true, requiresMasterReview: false };
  if (["standard_unit_mismatch", "unknown_standard_unit_key", "raw_unit"].includes(issue.code)) return { autoFixSafe: false, requiresMasterReview: true };
  return { autoFixSafe: false, requiresMasterReview: true };
}

function actionTypeForSchemaIssue(issue) {
  if (issue.code !== "missing_required_field") return ACTION_BY_SCHEMA_CODE[issue.code] ?? "FIX_MISSING_DEFAULT_FIELD";
  if (Object.hasOwn(SAFE_DEFAULTS, issue.field)) return "FIX_MISSING_DEFAULT_FIELD";
  return REVIEW_ACTION_FOR_MISSING_FIELD[issue.field] ?? "DB_FIX_METADATA";
}

function suggestedValueForSchemaIssue(issue) {
  if (issue.code === "missing_required_field" && Object.hasOwn(SAFE_DEFAULTS, issue.field)) {
    return SAFE_DEFAULTS[issue.field];
  }
  if (issue.code === "invalid_question_type") return "";
  if (issue.code === "invalid_tags") return [];
  return null;
}

export function buildCleanupCandidates(options = parseArgs()) {
  const compare = compareDbVsFiles(options);
  writeDbVsFilesMismatch(compare);
  const schema = validateJsSchema(options);
  writeSchemaValidation(schema);
  const images = scanImageAssets(options);
  writeImageReports(images);
  let id = 1;
  const candidates = [];

  for (const file of compare.fileOnly) {
    candidates.push(candidate(id++, "warn", "DB_ADD_MISSING_FILE", file.file, null, file.file, null, file, "JS file exists but db.js has no entry", true, false));
  }
  for (const entry of compare.dbOnly) {
    candidates.push(candidate(id++, "error", "DB_REMOVE_MISSING_FILE", "", null, entry.file, entry, null, "db.js entry points to a missing JS file", true, false));
  }
  for (const mismatch of compare.qCountMismatches) {
    candidates.push(candidate(id++, "warn", "DB_FIX_QCOUNT", mismatch.file, null, mismatch.file, mismatch.dbQCount, mismatch.actualQuestionCount, "db.js qCount differs from questionBank length", true, false));
  }
  for (const mismatch of compare.titleMismatches) {
    candidates.push(candidate(id++, "warn", "FIX_EXAM_TITLE_MISMATCH", mismatch.file, null, mismatch.file, mismatch.dbFileBase, mismatch.examTitle, "file basename and window.examTitle differ", false, true));
  }
  for (const group of compare.metadataMismatches) {
    candidates.push(candidate(id++, "warn", "DB_FIX_METADATA", group.file, null, group.file, group.mismatches, null, "db.js metadata differs from filename-derived metadata", true, false));
  }

  for (const issue of schema.issues) {
    const actionType = actionTypeForSchemaIssue(issue);
    const safety = schemaCandidateSafety(issue);
    candidates.push(candidate(id++, severityForSchema(issue), actionType, issue.sourceFile, issue.questionId, "", issue.currentValue, suggestedValueForSchemaIssue(issue), issue.message, safety.autoFixSafe, safety.requiresMasterReview));
  }

  for (const missing of images.missing) {
    candidates.push(candidate(id++, "error", "FIX_IMAGE_PATH", missing.sourceFile, missing.questionId, "", missing.path, null, "image reference does not resolve to an existing asset", false, true));
  }
  for (const orphan of images.orphan) {
    candidates.push(candidate(id++, "info", "REVIEW_ORPHAN_IMAGE", orphan.projectPath, null, "", orphan.projectPath, null, "image asset exists but was not referenced by scanned JS questions", false, true));
  }
  for (const warning of images.tagWarnings) {
    const actionType = warning.type === "image-field-and-content-img" ? "FIX_IMAGE_PATH" : "REVIEW_SPECIAL_LAYOUT";
    candidates.push(candidate(id++, "warn", actionType, warning.sourceFile, warning.questionId, "", warning, null, `image/tag warning: ${warning.type}`, false, true));
  }

  const countsByActionType = {};
  const countsBySeverity = {};
  for (const item of candidates) {
    countsByActionType[item.actionType] = (countsByActionType[item.actionType] ?? 0) + 1;
    countsBySeverity[item.severity] = (countsBySeverity[item.severity] ?? 0) + 1;
  }
  const safeStructureOnly = candidates.filter((item) => item.autoFixSafe && !item.requiresMasterReview);
  const requiresReview = candidates.filter((item) => item.requiresMasterReview || !item.autoFixSafe);

  return {
    generatedAt: new Date().toISOString(),
    filters: compare.filters,
    totals: {
      candidates: candidates.length,
      safeStructureOnly: safeStructureOnly.length,
      requiresReview: requiresReview.length,
      countsByActionType,
      countsBySeverity,
    },
    candidates,
    safeStructureOnly,
    requiresReview,
  };
}

function renderSummary(report) {
  const rows = Object.entries(report.totals.countsByActionType)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `| ${type} | ${count} |`)
    .join("\n");
  return `# Cleanup Candidates Summary

- Generated: ${report.generatedAt}
- Limited-run note: if run-summary skippedReasons is non-empty, whole-bank-only checks were intentionally omitted from this candidate set.
- Candidates: ${report.totals.candidates}
- Safe structure-only candidates: ${report.totals.safeStructureOnly}
- Requires review candidates: ${report.totals.requiresReview}

| Action Type | Count |
|---|---:|
${rows || "| - | 0 |"}

No source files are modified by this report.
`;
}

export function writeCleanupCandidates(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "cleanup-candidates.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "cleanup-candidates.safe-structure-only.json"), `${JSON.stringify(report.safeStructureOnly, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "cleanup-candidates.requires-review.json"), `${JSON.stringify(report.requiresReview, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "cleanup-candidates.summary.md"), renderSummary(report), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildCleanupCandidates();
  writeCleanupCandidates(report);
  console.log(`Built ${report.totals.candidates} cleanup candidates.`);
}
