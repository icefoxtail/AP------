import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanJsBank, writeJsBankInventory, parseArgs } from "./scan-js-bank.mjs";
import { scanDbIndex, writeDbIndexInventory } from "./scan-db-index.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");

function stripExt(file) {
  return String(file ?? "").replace(/\.js$/i, "");
}

function parseFileMeta(relativePath) {
  const base = path.basename(relativePath, ".js");
  const parts = base.split("_");
  const year = /^\d{2}$/.test(parts[0]) ? Number(`20${parts[0]}`) : "";
  return {
    base,
    year,
    school: year ? parts[1] ?? "" : "",
    semester: parts.find((part) => /학기/.test(part))?.replace("학기", "") ?? "",
    examType: parts.includes("중간") ? "mid" : parts.includes("기말") ? "final" : "",
    grade: parts.find((part) => /^[중고]\d$/.test(part)) ?? "",
    subject: parts.slice(Math.max(parts.findIndex((part) => /^[중고]\d$/.test(part)) + 1, 0)).join("_"),
  };
}

function compareMetadata(dbEntry, file) {
  const parsed = parseFileMeta(file.relativePath);
  const mismatches = [];
  for (const field of ["year", "school", "semester", "examType", "grade"]) {
    if (parsed[field] && dbEntry[field] !== "" && String(dbEntry[field]) !== String(parsed[field])) {
      mismatches.push({ field, dbValue: dbEntry[field], fileNameValue: parsed[field] });
    }
  }
  return mismatches;
}

export function compareDbVsFiles(options = parseArgs()) {
  const jsInventory = scanJsBank(options);
  writeJsBankInventory(jsInventory);
  const dbInventory = scanDbIndex(options);
  writeDbIndexInventory(dbInventory);

  const filesByRelative = new Map(jsInventory.files.map((file) => [file.relativePath, file]));
  const dbByFile = new Map(dbInventory.entries.map((entry) => [entry.file, entry]));
  const dbFiles = new Set(dbInventory.entries.map((entry) => entry.file));
  const actualFiles = new Set(jsInventory.files.map((file) => file.relativePath));

  const presenceComplete = !options.limit;
  const dbOnly = presenceComplete ? [...dbFiles].filter((file) => file && !actualFiles.has(file)).map((file) => dbByFile.get(file)) : [];
  const fileOnly = presenceComplete ? [...actualFiles].filter((file) => file && !dbFiles.has(file)).map((file) => filesByRelative.get(file)) : [];
  const qCountMismatches = [];
  const titleMismatches = [];
  const metadataMismatches = [];

  for (const dbEntry of dbInventory.entries) {
    const file = filesByRelative.get(dbEntry.file);
    if (!file) continue;
    if (typeof dbEntry.qCount === "number" && dbEntry.qCount !== file.questionCount) {
      qCountMismatches.push({
        file: dbEntry.file,
        dbQCount: dbEntry.qCount,
        actualQuestionCount: file.questionCount,
      });
    }
    if (file.examTitle && stripExt(dbEntry.file).split("/").at(-1) !== file.examTitle) {
      titleMismatches.push({
        file: dbEntry.file,
        dbFileBase: stripExt(dbEntry.file).split("/").at(-1),
        examTitle: file.examTitle,
      });
    }
    const meta = compareMetadata(dbEntry, file);
    if (meta.length) metadataMismatches.push({ file: dbEntry.file, mismatches: meta });
  }

  return {
    generatedAt: new Date().toISOString(),
    source: "archive/db.js vs archive/exams/**/*.js",
    filters: jsInventory.filters,
    totals: {
      dbEntries: dbInventory.totals.dbEntries,
      jsFiles: jsInventory.totals.files,
      dbOnly: dbOnly.length,
      fileOnly: fileOnly.length,
      qCountMismatches: qCountMismatches.length,
      titleMismatches: titleMismatches.length,
      metadataMismatches: metadataMismatches.length,
    },
    presenceScope: presenceComplete ? "complete" : "skipped-limited-run",
    presenceSkippedReason: presenceComplete ? "" : "DB-only and file-only checks require a non-limited JS file scan.",
    dbOnly,
    fileOnly: fileOnly.map((file) => ({ file: file.relativePath, examTitle: file.examTitle, questionCount: file.questionCount })),
    qCountMismatches,
    titleMismatches,
    metadataMismatches,
  };
}

function renderSummary(report) {
  const scopeLine = report.presenceScope === "complete"
    ? "- DB-only and file-only checks: complete"
    : `- DB-only and file-only checks: skipped (${report.presenceSkippedReason})`;
  return `# DB vs Files Mismatch Summary

- Generated: ${report.generatedAt}
- presenceScope: ${report.presenceScope}
${scopeLine}
- DB entries: ${report.totals.dbEntries}
- JS files scanned: ${report.totals.jsFiles}
- DB-only entries: ${report.totals.dbOnly}
- File-only JS files: ${report.totals.fileOnly}
- qCount mismatches: ${report.totals.qCountMismatches}
- filename/window.examTitle mismatches: ${report.totals.titleMismatches}
- metadata mismatch groups: ${report.totals.metadataMismatches}
`;
}

export function writeDbVsFilesMismatch(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "db-vs-files-mismatch.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "db-vs-files-mismatch.summary.md"), renderSummary(report), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = compareDbVsFiles();
  writeDbVsFilesMismatch(report);
  console.log(`Compared ${report.totals.dbEntries} DB entries with ${report.totals.jsFiles} JS files.`);
}
