import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadWindowScript } from "./scan-js-bank.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const EXAMS_DIR = path.join(ROOT_DIR, "archive", "exams");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");
const CANDIDATE_PATH = path.join(REPORT_DIR, "cleanup-candidates.safe-structure-only.json");
const APPLY_REPORT_PATH = path.join(REPORT_DIR, "safe-default-field-apply-report.json");
const APPLY_SUMMARY_PATH = path.join(REPORT_DIR, "safe-default-field-apply-summary.md");

const FIELD_ORDER = ["questionType", "layoutTag", "tags", "wide"];
const ALLOWED_FIELDS = new Set(FIELD_ORDER);
const EXPECTED_VALUES = {
  questionType: "",
  layoutTag: "grid",
  tags: [],
  wide: false,
};
const FIELD_SOURCE = {
  questionType: 'questionType: ""',
  layoutTag: 'layoutTag: "grid"',
  tags: "tags: []",
  wide: "wide: false",
};
const ANCHOR_FIELDS = [
  "standardUnitOrder",
  "standardUnit",
  "standardUnitKey",
  "standardCourse",
  "originalCategory",
  "category",
];

function toPosix(value) {
  return value.replaceAll("\\", "/");
}

function parseArgs(argv = process.argv.slice(2)) {
  return {
    dryRun: argv.includes("--dry-run"),
  };
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function fieldFromCandidate(candidate) {
  if (ALLOWED_FIELDS.has(candidate.field)) return candidate.field;
  const match = String(candidate.reason ?? "").match(/missing required field: (\w+)/);
  if (match && ALLOWED_FIELDS.has(match[1])) return match[1];
  return "";
}

function resolveSourceFile(sourceFile) {
  const normalized = toPosix(String(sourceFile ?? "")).replace(/^\/+/, "");
  const rel = normalized.startsWith("archive/exams/")
    ? normalized.slice("archive/exams/".length)
    : normalized;
  if (!rel || path.isAbsolute(rel) || rel.split("/").includes("..")) return null;
  const absolutePath = path.resolve(EXAMS_DIR, ...rel.split("/"));
  const relativeToExams = path.relative(EXAMS_DIR, absolutePath);
  if (relativeToExams.startsWith("..") || path.isAbsolute(relativeToExams)) return null;
  if (!absolutePath.endsWith(".js")) return null;
  return absolutePath;
}

function eligibleCandidate(candidate) {
  const field = fieldFromCandidate(candidate);
  if (!field) return { ok: false, field: "", reason: "field-not-allowed" };
  if (candidate.actionType !== "FIX_MISSING_DEFAULT_FIELD") return { ok: false, field, reason: "wrong-action-type" };
  if (candidate.autoFixSafe !== true) return { ok: false, field, reason: "not-auto-fix-safe" };
  if (candidate.requiresMasterReview !== false) return { ok: false, field, reason: "requires-master-review" };
  if (!valuesEqual(candidate.suggestedValue, EXPECTED_VALUES[field])) {
    return { ok: false, field, reason: "unexpected-suggested-value" };
  }
  const absolutePath = resolveSourceFile(candidate.sourceFile);
  if (!absolutePath) return { ok: false, field, reason: "source-outside-archive-exams" };
  if (!Number.isInteger(candidate.questionId)) return { ok: false, field, reason: "invalid-question-id" };
  return { ok: true, field, absolutePath, reason: "" };
}

function scanTopLevelQuestionObjects(source) {
  const assignmentMatch = /window\s*\.\s*questionBank\s*=\s*\[/.exec(source);
  if (!assignmentMatch) return [];
  const start = assignmentMatch.index + assignmentMatch[0].lastIndexOf("[");
  const ranges = [];
  let arrayDepth = 0;
  let objectDepth = 0;
  let objectStart = -1;
  let quote = "";
  let escapeNext = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escapeNext) {
        escapeNext = false;
      } else if (char === "\\") {
        escapeNext = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      i += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "[") arrayDepth += 1;
    else if (char === "]") {
      arrayDepth -= 1;
      if (arrayDepth === 0) break;
    } else if (char === "{") {
      if (arrayDepth === 1 && objectDepth === 0) objectStart = i;
      if (objectDepth > 0 || arrayDepth === 1) objectDepth += 1;
    } else if (char === "}") {
      if (objectDepth > 0) {
        objectDepth -= 1;
        if (objectDepth === 0 && objectStart >= 0) {
          ranges.push({ start: objectStart, end: i + 1 });
          objectStart = -1;
        }
      }
    }
  }
  return ranges;
}

function propertyPattern(field) {
  return new RegExp(`(^|\\n)\\s*(?:${field}|["']${field}["'])\\s*:`, "m");
}

function inferIndent(objectText, fallback = "    ") {
  const match = objectText.match(/\n(\s+)(?:[A-Za-z_$][\w$]*|["'][^"']+["'])\s*:/);
  return match?.[1] ?? fallback;
}

function usesQuotedKeys(objectText) {
  return /(^|\n)\s*["']id["']\s*:/.test(objectText);
}

function fieldLine(field, indent, quoteKeys) {
  const raw = FIELD_SOURCE[field];
  if (!quoteKeys) return `${indent}${raw},`;
  const [key, rest] = raw.split(": ");
  return `${indent}"${key}": ${rest},`;
}

function findAnchorInsertion(objectText) {
  let defaultFieldEnd = -1;
  for (const field of FIELD_ORDER) {
    const pattern = new RegExp(`(^|\\n)(\\s*)(?:${field}|["']${field}["'])\\s*:`, "g");
    const match = pattern.exec(objectText);
    if (!match) continue;
    const lineStart = match.index + match[1].length;
    let lineEnd = objectText.indexOf("\n", lineStart);
    if (lineEnd === -1) lineEnd = objectText.length;
    const lineText = objectText.slice(lineStart, lineEnd);
    if (!/,\s*(?:(?:\/\/.*)|(?:\/\*.*\*\/))?\s*$/.test(lineText)) return lineStart;
    defaultFieldEnd = Math.max(defaultFieldEnd, lineEnd);
  }
  if (defaultFieldEnd >= 0) return defaultFieldEnd;

  for (const anchor of ANCHOR_FIELDS) {
    const pattern = new RegExp(`(^|\\n)(\\s*)(?:${anchor}|["']${anchor}["'])\\s*:`, "g");
    const match = pattern.exec(objectText);
    if (!match) continue;
    const lineStart = match.index + match[1].length;
    let lineEnd = objectText.indexOf("\n", lineStart);
    if (lineEnd === -1) lineEnd = objectText.length;
    const lineText = objectText.slice(lineStart, lineEnd);
    if (!/,\s*(?:(?:\/\/.*)|(?:\/\*.*\*\/))?\s*$/.test(lineText)) return lineStart;
    return lineEnd;
  }
  const contentMatch = /(^|\n)\s*(?:content|["']content["'])\s*:/.exec(objectText);
  if (contentMatch) return contentMatch.index + contentMatch[1].length;
  const closing = objectText.lastIndexOf("}");
  return closing > 0 ? closing : objectText.length;
}

function insertMissingFields(source, range, fields) {
  const objectText = source.slice(range.start, range.end);
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const indent = inferIndent(objectText);
  const quoteKeys = usesQuotedKeys(objectText);
  const insertAt = findAnchorInsertion(objectText);
  const lines = fields.map((field) => fieldLine(field, indent, quoteKeys)).join(newline);
  const prefix = objectText.slice(0, insertAt);
  const suffix = objectText.slice(insertAt);
  const separator = insertAt === 0 || objectText[insertAt - 1] === "\n" ? "" : newline;
  const inserted = `${prefix}${separator}${lines}${suffix.startsWith(newline) ? "" : newline}${suffix}`;
  return source.slice(0, range.start) + inserted + source.slice(range.end);
}

function summarizeByField(records) {
  const counts = Object.fromEntries(FIELD_ORDER.map((field) => [field, 0]));
  for (const record of records) {
    counts[record.field] = (counts[record.field] ?? 0) + 1;
  }
  return counts;
}

function writeReports(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(APPLY_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const lines = [
    "# Safe Default Field Apply Summary",
    "",
    `- generatedAt: ${report.generatedAt}`,
    `- dryRun: ${report.dryRun}`,
    `- candidatesRead: ${report.candidatesRead}`,
    `- candidatesEligible: ${report.candidatesEligible}`,
    `- appliedTotal: ${report.appliedTotal}`,
    `- modifiedFiles: ${report.modifiedFiles.length}`,
    `- skippedTotal: ${report.skipped.length}`,
    "",
    "## Applied By Field",
    "",
    ...FIELD_ORDER.map((field) => `- ${field}: ${report.appliedByField[field] ?? 0}`),
    "",
  ];
  fs.writeFileSync(APPLY_SUMMARY_PATH, `${lines.join("\n")}\n`, "utf8");
}

export function applySafeDefaultFields(options = parseArgs()) {
  const candidates = JSON.parse(fs.readFileSync(CANDIDATE_PATH, "utf8"));
  const grouped = new Map();
  const skipped = [];
  let candidatesEligible = 0;

  for (const candidate of candidates) {
    const eligible = eligibleCandidate(candidate);
    if (!eligible.ok) {
      skipped.push({
        candidateId: candidate.candidateId ?? "",
        sourceFile: candidate.sourceFile ?? "",
        questionId: candidate.questionId ?? null,
        field: eligible.field,
        reason: eligible.reason,
      });
      continue;
    }
    candidatesEligible += 1;
    const fileGroup = grouped.get(eligible.absolutePath) ?? new Map();
    const questionGroup = fileGroup.get(candidate.questionId) ?? new Map();
    questionGroup.set(eligible.field, candidate);
    fileGroup.set(candidate.questionId, questionGroup);
    grouped.set(eligible.absolutePath, fileGroup);
  }

  const applied = [];
  const modifiedFiles = [];

  for (const [filePath, questionGroups] of [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b, "ko"))) {
    const loaded = loadWindowScript(filePath);
    if (!loaded.ok || !Array.isArray(loaded.window.questionBank)) {
      for (const [questionId, fieldMap] of questionGroups) {
        for (const field of fieldMap.keys()) {
          skipped.push({
            candidateId: fieldMap.get(field).candidateId ?? "",
            sourceFile: path.relative(EXAMS_DIR, filePath).replaceAll("\\", "/"),
            questionId,
            field,
            reason: loaded.ok ? "question-bank-not-array" : "source-load-failed",
          });
        }
      }
      continue;
    }

    const source = loaded.source;
    const ranges = scanTopLevelQuestionObjects(source);
    if (ranges.length !== loaded.window.questionBank.length) {
      for (const [questionId, fieldMap] of questionGroups) {
        for (const field of fieldMap.keys()) {
          skipped.push({
            candidateId: fieldMap.get(field).candidateId ?? "",
            sourceFile: path.relative(EXAMS_DIR, filePath).replaceAll("\\", "/"),
            questionId,
            field,
            reason: "question-object-range-count-mismatch",
          });
        }
      }
      continue;
    }

    const indexesById = new Map();
    loaded.window.questionBank.forEach((question, index) => {
      if (!question || !Number.isInteger(question.id)) return;
      const indexes = indexesById.get(question.id) ?? [];
      indexes.push(index);
      indexesById.set(question.id, indexes);
    });

    const edits = [];
    for (const [questionId, fieldMap] of [...questionGroups.entries()].sort((a, b) => b[0] - a[0])) {
      const indexes = indexesById.get(questionId) ?? [];
      if (indexes.length !== 1) {
        for (const field of fieldMap.keys()) {
          skipped.push({
            candidateId: fieldMap.get(field).candidateId ?? "",
            sourceFile: path.relative(EXAMS_DIR, filePath).replaceAll("\\", "/"),
            questionId,
            field,
            reason: indexes.length === 0 ? "question-id-not-found" : "duplicate-question-id",
          });
        }
        continue;
      }
      const index = indexes[0];
      const question = loaded.window.questionBank[index];
      const objectText = source.slice(ranges[index].start, ranges[index].end);
      const fieldsToAdd = FIELD_ORDER.filter((field) => {
        if (!fieldMap.has(field)) return false;
        if (Object.hasOwn(question, field)) {
          skipped.push({
            candidateId: fieldMap.get(field).candidateId ?? "",
            sourceFile: path.relative(EXAMS_DIR, filePath).replaceAll("\\", "/"),
            questionId,
            field,
            reason: "field-present-in-loaded-question",
          });
          return false;
        }
        if (propertyPattern(field).test(objectText)) {
          skipped.push({
            candidateId: fieldMap.get(field).candidateId ?? "",
            sourceFile: path.relative(EXAMS_DIR, filePath).replaceAll("\\", "/"),
            questionId,
            field,
            reason: "field-present-in-source-object",
          });
          return false;
        }
        return true;
      });
      if (fieldsToAdd.length === 0) continue;
      edits.push({ range: ranges[index], fields: fieldsToAdd, questionId });
      for (const field of fieldsToAdd) {
        applied.push({
          sourceFile: path.relative(EXAMS_DIR, filePath).replaceAll("\\", "/"),
          questionId,
          field,
          value: EXPECTED_VALUES[field],
        });
      }
    }

    if (edits.length === 0) continue;
    let nextSource = source;
    for (const edit of edits.sort((a, b) => b.range.start - a.range.start)) {
      nextSource = insertMissingFields(nextSource, edit.range, edit.fields);
    }
    if (nextSource !== source) {
      modifiedFiles.push(path.relative(ROOT_DIR, filePath).replaceAll("\\", "/"));
      if (!options.dryRun) fs.writeFileSync(filePath, nextSource, "utf8");
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    candidatesRead: candidates.length,
    candidatesEligible,
    appliedTotal: applied.length,
    appliedByField: summarizeByField(applied),
    modifiedFiles,
    applied,
    skipped,
  };
  writeReports(report);
  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = applySafeDefaultFields();
  console.log(`${report.dryRun ? "Would apply" : "Applied"} ${report.appliedTotal} safe default fields in ${report.modifiedFiles.length} files.`);
  console.log(`Report: ${path.relative(ROOT_DIR, APPLY_REPORT_PATH).replaceAll("\\", "/")}`);
}
