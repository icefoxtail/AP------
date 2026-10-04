import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadWindowScript, parseArgs } from "./scan-js-bank.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const DB_PATH = path.join(ROOT_DIR, "archive", "db.js");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");

function normalizeEntry(entry, index) {
  return {
    index,
    file: entry?.file ?? "",
    resolvedExamPath: entry?.file ? `archive/exams/${entry.file}` : "",
    school: entry?.school ?? "",
    title: entry?.title ?? "",
    topic: entry?.topic ?? "",
    grade: entry?.grade ?? "",
    year: entry?.year ?? "",
    semester: entry?.semester ?? "",
    examType: entry?.examType ?? "",
    subject: entry?.subject ?? "",
    contentType: entry?.contentType ?? "",
    qCount: entry?.qCount ?? null,
    rangeStartUnitKey: entry?.rangeStartUnitKey ?? "",
    rangeStartUnit: entry?.rangeStartUnit ?? "",
    rangeStartUnitOrder: entry?.rangeStartUnitOrder ?? null,
    rangeEndUnitKey: entry?.rangeEndUnitKey ?? "",
    rangeEndUnit: entry?.rangeEndUnit ?? "",
    rangeEndUnitOrder: entry?.rangeEndUnitOrder ?? null,
    primaryStandardCourse: entry?.primaryStandardCourse ?? "",
    courseRanges: Array.isArray(entry?.courseRanges) ? entry.courseRanges : [],
    raw: entry,
  };
}

export function scanDbIndex(options = parseArgs()) {
  const loaded = loadWindowScript(DB_PATH);
  const mainDB = loaded.window.mainDB ?? {};
  const exams = Array.isArray(mainDB.exams) ? mainDB.exams : [];
  const entries = exams
    .map((entry, index) => normalizeEntry(entry, index))
    .filter((entry) => !options.grade || entry.grade === options.grade)
    .filter((entry) => !options.source || `archive/exams/${entry.file}` === options.source || entry.file === options.source);
  const duplicateFiles = [...new Set(entries.map((entry) => entry.file).filter((file, index, list) => file && list.indexOf(file) !== index))];
  const fieldPresence = {};
  for (const entry of entries) {
    for (const key of Object.keys(entry.raw ?? {})) fieldPresence[key] = (fieldPresence[key] ?? 0) + 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    source: "archive/db.js",
    filters: {
      limit: options.limit ?? null,
      grade: options.grade || null,
      source: options.source || null,
    },
    loadable: loaded.ok && Array.isArray(mainDB.exams),
    loadError: loaded.ok ? (Array.isArray(mainDB.exams) ? "" : "window.mainDB.exams is not an array") : loaded.error,
    totals: {
      dbEntries: entries.length,
      duplicateFileCount: duplicateFiles.length,
    },
    duplicateFiles,
    fieldPresence,
    entries,
  };
}

export function writeDbIndexInventory(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "db-index-inventory.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = scanDbIndex();
  writeDbIndexInventory(report);
  console.log(`Scanned ${report.totals.dbEntries} db.js entries.`);
}
