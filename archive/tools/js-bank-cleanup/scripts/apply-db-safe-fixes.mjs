import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_REL_DIR = path.join("archive", "_generated", "js-bank-cleanup", "reports");
const DB_REL_PATH = path.join("archive", "db.js");
const EXAMS_REL_DIR = path.join("archive", "exams");

function toPosix(value) {
  return String(value ?? "").replaceAll("\\", "/");
}

function parseArgs(argv = process.argv.slice(2)) {
  return {
    rootDir: DEFAULT_ROOT_DIR,
    dryRun: argv.includes("--dry-run"),
  };
}

function loadWindowScript(filePath, timeout = 1000) {
  const source = fs.readFileSync(filePath, "utf8");
  const sandbox = {
    window: {},
    console: { log() {}, warn() {}, error() {} },
  };
  sandbox.globalThis = sandbox.window;
  try {
    vm.runInNewContext(source, sandbox, {
      filename: filePath,
      timeout,
      displayErrors: true,
    });
    return { ok: true, error: "", window: sandbox.window, source };
  } catch (error) {
    return { ok: false, error: `${error.name}: ${error.message}`, window: sandbox.window, source };
  }
}

function scanStringAware(source, start, onToken) {
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
      if (escapeNext) escapeNext = false;
      else if (char === "\\") escapeNext = true;
      else if (char === quote) quote = "";
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
    const result = onToken(char, i);
    if (result === false) break;
  }
}

function findExamsArray(source) {
  const examsMatch = /["']?exams["']?\s*:\s*\[/.exec(source);
  if (!examsMatch) return null;
  const start = examsMatch.index + examsMatch[0].lastIndexOf("[");
  let depth = 0;
  let end = -1;
  scanStringAware(source, start, (char, index) => {
    if (char === "[") depth += 1;
    else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        end = index;
        return false;
      }
    }
    return true;
  });
  return end > start ? { start, end } : null;
}

function scanTopLevelObjectsInArray(source, arrayRange) {
  const ranges = [];
  let arrayDepth = 0;
  let objectDepth = 0;
  let objectStart = -1;
  scanStringAware(source, arrayRange.start, (char, index) => {
    if (char === "[") arrayDepth += 1;
    else if (char === "]") {
      arrayDepth -= 1;
      if (arrayDepth === 0) return false;
    } else if (char === "{") {
      if (arrayDepth === 1 && objectDepth === 0) objectStart = index;
      if (objectDepth > 0 || arrayDepth === 1) objectDepth += 1;
    } else if (char === "}") {
      if (objectDepth > 0) {
        objectDepth -= 1;
        if (objectDepth === 0 && objectStart >= 0) {
          ranges.push({ start: objectStart, end: index + 1 });
          objectStart = -1;
        }
      }
    }
    return true;
  });
  return ranges;
}

function dbEntryRanges(source, entryCount) {
  const arrayRange = findExamsArray(source);
  if (!arrayRange) return { arrayRange: null, ranges: [] };
  const ranges = scanTopLevelObjectsInArray(source, arrayRange);
  if (ranges.length !== entryCount) return { arrayRange, ranges: [] };
  return { arrayRange, ranges };
}

function resolveExamPath(rootDir, relativeFile) {
  const rel = toPosix(relativeFile).replace(/^archive\/exams\//, "");
  if (!rel || path.isAbsolute(rel) || rel.split("/").includes("..") || !rel.endsWith(".js")) return null;
  const examsDir = path.join(rootDir, EXAMS_REL_DIR);
  const absolutePath = path.resolve(examsDir, ...rel.split("/"));
  const relativeToExams = path.relative(examsDir, absolutePath);
  if (relativeToExams.startsWith("..") || path.isAbsolute(relativeToExams)) return null;
  return absolutePath;
}

function isSafeCandidate(candidate, actionType) {
  return candidate.actionType === actionType
    && candidate.autoFixSafe === true
    && candidate.requiresMasterReview === false;
}

function parseFilenameMetadata(relativeFile, examTitle) {
  const rel = toPosix(relativeFile);
  const base = path.posix.basename(rel, ".js");
  const text = `${base}_${examTitle ?? ""}`;
  const gradeFromPath = rel.includes("/h1/") ? "고1"
    : rel.includes("/h2/") ? "고2"
      : rel.includes("/h3/") ? "고3"
        : rel.includes("/m1/") ? "중1"
          : rel.includes("/m2/") ? "중2"
            : rel.includes("/m3/") ? "중3"
              : "";
  const gradeMatch = text.match(/(?:^|_)((?:고|중)[1-3])(?:_|$)/);
  const grade = gradeMatch?.[1] || gradeFromPath;
  const yearMatch = base.match(/^(\d{2})_/);
  const semesterMatch = text.match(/(?:^|_)([12])학기(?:_|$)/);
  const examType = text.includes("중간") ? "mid" : text.includes("기말") ? "final" : "";

  let contentType = "";
  if (rel.startsWith("types/")) contentType = "유형";
  else if (rel.startsWith("similar/")) contentType = text.includes("단원평가") ? "단원평가" : "유사";
  else if (rel.startsWith("original/")) contentType = "기출";

  if (!grade || !contentType) return null;
  return {
    school: "",
    topic: "",
    grade,
    year: yearMatch ? Number(`20${yearMatch[1]}`) : "",
    semester: semesterMatch?.[1] ?? "",
    examType,
    subject: "",
    contentType,
  };
}

function unitSummary(questionBank) {
  if (!Array.isArray(questionBank) || questionBank.length === 0) return null;
  const normalized = questionBank.map((question) => ({
    standardCourse: question?.standardCourse ?? "",
    standardUnitKey: question?.standardUnitKey ?? "",
    standardUnit: question?.standardUnit ?? "",
    standardUnitOrder: question?.standardUnitOrder ?? null,
  }));
  if (normalized.some((unit) => !unit.standardCourse || !unit.standardUnitKey || !unit.standardUnit || !Number.isInteger(unit.standardUnitOrder))) {
    return null;
  }
  const first = normalized[0];
  const last = normalized.at(-1);
  const courseMap = new Map();
  for (const unit of normalized) {
    if (!courseMap.has(unit.standardCourse)) courseMap.set(unit.standardCourse, []);
    courseMap.get(unit.standardCourse).push(unit);
  }
  const courseRanges = [...courseMap.entries()].map(([standardCourse, units]) => {
    const start = units[0];
    const end = units.at(-1);
    return {
      standardCourse,
      courseCode: start.standardUnitKey.split("-").slice(0, -1).join("-"),
      rangeStartUnitKey: start.standardUnitKey,
      rangeStartUnit: start.standardUnit,
      rangeStartUnitOrder: start.standardUnitOrder,
      rangeEndUnitKey: end.standardUnitKey,
      rangeEndUnit: end.standardUnit,
      rangeEndUnitOrder: end.standardUnitOrder,
    };
  });
  return {
    rangeStartUnitKey: first.standardUnitKey,
    rangeStartUnit: first.standardUnit,
    rangeStartUnitOrder: first.standardUnitOrder,
    rangeEndUnitKey: last.standardUnitKey,
    rangeEndUnit: last.standardUnit,
    rangeEndUnitOrder: last.standardUnitOrder,
    courseRanges,
    primaryStandardCourse: first.standardCourse,
  };
}

function makeDbEntry(relativeFile, examTitle, questionBank) {
  const metadata = parseFilenameMetadata(relativeFile, examTitle);
  const units = unitSummary(questionBank);
  if (!metadata || !units) return null;
  return {
    file: toPosix(relativeFile),
    ...metadata,
    qCount: questionBank.length,
    ...units,
  };
}

function stringifyEntry(entry, indent = "    ") {
  const json = JSON.stringify(entry, null, 2);
  return json.split("\n").map((line) => `${indent}${line}`).join("\n");
}

function replaceQCount(source, range, expectedCurrent, nextValue) {
  const objectText = source.slice(range.start, range.end);
  const pattern = /(["']qCount["']\s*:\s*)(\d+)/;
  const match = pattern.exec(objectText);
  if (!match) return { source, changed: false, reason: "qcount-field-not-found" };
  const current = Number(match[2]);
  if (current !== expectedCurrent) return { source, changed: false, reason: "qcount-current-value-mismatch" };
  const nextObjectText = objectText.slice(0, match.index) + match[1] + String(nextValue) + objectText.slice(match.index + match[0].length);
  return {
    source: source.slice(0, range.start) + nextObjectText + source.slice(range.end),
    changed: true,
    reason: "",
  };
}

function insertionIndexForFile(entries, newFile) {
  const normalized = toPosix(newFile);
  const greater = entries.findIndex((entry) => toPosix(entry.file).localeCompare(normalized, "ko") > 0);
  return greater >= 0 ? greater : entries.length;
}

function insertEntry(source, arrayRange, ranges, entries, entry) {
  const insertIndex = insertionIndexForFile(entries, entry.file);
  const block = stringifyEntry(entry);
  if (ranges.length === 0) {
    return source.slice(0, arrayRange.start + 1) + `\n${block}\n  ` + source.slice(arrayRange.end);
  }
  if (insertIndex < ranges.length) {
    const previousNewline = source.lastIndexOf("\n", ranges[insertIndex].start);
    const insertAt = previousNewline >= 0 ? previousNewline + 1 : ranges[insertIndex].start;
    return source.slice(0, insertAt) + `${block},\n` + source.slice(insertAt);
  }
  const previous = ranges.at(-1);
  const insertAt = previous.end;
  return source.slice(0, insertAt) + `,\n${block}` + source.slice(insertAt);
}

function reasonCounts(skippedEntries) {
  const reasons = {};
  for (const item of skippedEntries) reasons[item.reason] = (reasons[item.reason] ?? 0) + 1;
  return reasons;
}

function writeReports(rootDir, report) {
  const reportDir = path.join(rootDir, REPORT_REL_DIR);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, "apply-db-safe-fixes-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const lines = [
    "# Apply DB Safe Fixes Summary",
    "",
    `- generatedAt: ${report.generatedAt}`,
    `- dryRun: ${report.dryRun}`,
    `- appliedDbFixQcountCount: ${report.appliedDbFixQcountCount}`,
    `- appliedDbAddMissingFileCount: ${report.appliedDbAddMissingFileCount}`,
    `- skippedDbAddMissingFileCount: ${report.skippedDbAddMissingFileCount}`,
    `- skippedDbFixMetadataCount: ${report.skippedDbFixMetadataCount}`,
    `- dbBeforeCount: ${report.dbBeforeCount}`,
    `- dbAfterCount: ${report.dbAfterCount}`,
    "",
    "## Reasons",
    "",
    ...Object.entries(report.reasons).map(([reason, count]) => `- ${reason}: ${count}`),
    "",
  ];
  fs.writeFileSync(path.join(reportDir, "apply-db-safe-fixes-report.summary.md"), `${lines.join("\n")}\n`, "utf8");
}

export function applyDbSafeFixes(options = {}) {
  const rootDir = path.resolve(options.rootDir ?? DEFAULT_ROOT_DIR);
  const dryRun = options.dryRun ?? false;
  const reportDir = path.join(rootDir, REPORT_REL_DIR);
  const dbPath = path.join(rootDir, DB_REL_PATH);
  const candidatePath = path.join(reportDir, "cleanup-candidates.json");
  const candidateReport = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
  const candidates = Array.isArray(candidateReport.candidates) ? candidateReport.candidates : candidateReport;
  const loadedDb = loadWindowScript(dbPath);
  if (!loadedDb.ok || !Array.isArray(loadedDb.window.mainDB?.exams)) {
    throw new Error(`Unable to load archive/db.js: ${loadedDb.error || "window.mainDB.exams is not an array"}`);
  }

  const skippedEntries = [];
  const appliedEntries = [];
  const metadataCandidates = candidates.filter((candidate) => candidate.actionType === "DB_FIX_METADATA");
  for (const candidate of metadataCandidates) {
    skippedEntries.push({
      candidateId: candidate.candidateId ?? "",
      actionType: candidate.actionType,
      dbFile: candidate.dbFile ?? candidate.sourceFile ?? "",
      reason: "db-fix-metadata-not-allowed-this-round",
    });
  }

  let dbSource = loadedDb.source;
  let dbEntries = loadedDb.window.mainDB.exams;
  const dbBeforeCount = dbEntries.length;
  let rangesInfo = dbEntryRanges(dbSource, dbEntries.length);
  if (!rangesInfo.arrayRange || rangesInfo.ranges.length !== dbEntries.length) {
    throw new Error("Unable to map archive/db.js exam entry ranges safely.");
  }

  const qCountCandidates = candidates.filter((candidate) => isSafeCandidate(candidate, "DB_FIX_QCOUNT"));
  for (const candidate of qCountCandidates) {
    const relativeFile = toPosix(candidate.dbFile || candidate.sourceFile);
    const examPath = resolveExamPath(rootDir, relativeFile);
    const dbIndex = dbEntries.findIndex((entry) => toPosix(entry.file) === relativeFile);
    if (!examPath || dbIndex < 0) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "qcount-target-not-found" });
      continue;
    }
    const loadedExam = loadWindowScript(examPath);
    const questionBank = loadedExam.window.questionBank;
    if (!loadedExam.ok || !Array.isArray(questionBank)) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "qcount-js-not-loadable" });
      continue;
    }
    if (questionBank.length !== candidate.suggestedValue) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "qcount-suggested-value-mismatch" });
      continue;
    }
    if (dbEntries[dbIndex].qCount !== candidate.currentValue) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "qcount-current-value-mismatch" });
      continue;
    }
    const replaced = replaceQCount(dbSource, rangesInfo.ranges[dbIndex], candidate.currentValue, candidate.suggestedValue);
    if (!replaced.changed) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: replaced.reason });
      continue;
    }
    dbSource = replaced.source;
    dbEntries = dbEntries.map((entry, index) => index === dbIndex ? { ...entry, qCount: candidate.suggestedValue } : entry);
    rangesInfo = dbEntryRanges(dbSource, dbEntries.length);
    appliedEntries.push({
      candidateId: candidate.candidateId ?? "",
      actionType: candidate.actionType,
      dbFile: relativeFile,
      before: candidate.currentValue,
      after: candidate.suggestedValue,
    });
  }

  const addCandidates = candidates.filter((candidate) => isSafeCandidate(candidate, "DB_ADD_MISSING_FILE"));
  for (const candidate of addCandidates) {
    const relativeFile = toPosix(candidate.dbFile || candidate.sourceFile);
    const examPath = resolveExamPath(rootDir, relativeFile);
    if (!examPath || !fs.existsSync(examPath)) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "add-js-file-not-found" });
      continue;
    }
    if (dbEntries.some((entry) => toPosix(entry.file) === relativeFile)) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "add-db-entry-already-exists" });
      continue;
    }
    const loadedExam = loadWindowScript(examPath);
    const questionBank = loadedExam.window.questionBank;
    if (!loadedExam.ok || !loadedExam.window.examTitle || !Array.isArray(questionBank) || questionBank.length === 0) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "add-js-not-unambiguously-loadable" });
      continue;
    }
    if (candidate.suggestedValue?.questionCount !== questionBank.length || candidate.suggestedValue?.examTitle !== loadedExam.window.examTitle) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "add-candidate-does-not-match-js" });
      continue;
    }
    const entry = makeDbEntry(relativeFile, loadedExam.window.examTitle, questionBank);
    if (!entry) {
      skippedEntries.push({ candidateId: candidate.candidateId ?? "", actionType: candidate.actionType, dbFile: relativeFile, reason: "add-metadata-not-unambiguous" });
      continue;
    }
    dbSource = insertEntry(dbSource, rangesInfo.arrayRange, rangesInfo.ranges, dbEntries, entry);
    dbEntries = [...dbEntries.slice(0, insertionIndexForFile(dbEntries, entry.file)), entry, ...dbEntries.slice(insertionIndexForFile(dbEntries, entry.file))];
    rangesInfo = dbEntryRanges(dbSource, dbEntries.length);
    appliedEntries.push({
      candidateId: candidate.candidateId ?? "",
      actionType: candidate.actionType,
      dbFile: relativeFile,
      entry,
    });
  }

  const appliedDbFixQcountCount = appliedEntries.filter((entry) => entry.actionType === "DB_FIX_QCOUNT").length;
  const appliedDbAddMissingFileCount = appliedEntries.filter((entry) => entry.actionType === "DB_ADD_MISSING_FILE").length;
  const skippedDbAddMissingFileCount = skippedEntries.filter((entry) => entry.actionType === "DB_ADD_MISSING_FILE").length;
  const skippedDbFixMetadataCount = skippedEntries.filter((entry) => entry.actionType === "DB_FIX_METADATA").length;
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    appliedDbFixQcountCount,
    appliedDbAddMissingFileCount,
    skippedDbAddMissingFileCount,
    skippedDbFixMetadataCount,
    appliedEntries,
    skippedEntries,
    reasons: reasonCounts(skippedEntries),
    dbBeforeCount,
    dbAfterCount: dbEntries.length,
  };

  if (!dryRun && dbSource !== loadedDb.source) {
    fs.writeFileSync(dbPath, dbSource, "utf8");
  }
  writeReports(rootDir, report);
  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = applyDbSafeFixes(parseArgs());
  console.log(`${report.dryRun ? "Would apply" : "Applied"} ${report.appliedDbFixQcountCount} qCount fixes and ${report.appliedDbAddMissingFileCount} DB adds.`);
  console.log(`Report: ${toPosix(path.relative(report.rootDir ?? DEFAULT_ROOT_DIR, path.join(DEFAULT_ROOT_DIR, REPORT_REL_DIR, "apply-db-safe-fixes-report.json")))}`);
}
