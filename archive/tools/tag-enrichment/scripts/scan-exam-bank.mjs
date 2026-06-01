import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const EXAMS_DIR = path.join(ROOT_DIR, "archive", "exams");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "tag-enrichment", "reports");

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = { limit: null, grade: "", source: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--limit") options.limit = Number(argv[++i]);
    else if (arg === "--grade") options.grade = argv[++i] ?? "";
    else if (arg === "--source") options.source = (argv[++i] ?? "").replaceAll("\\", "/");
  }
  return options;
}

function walkJsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkJsFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(fullPath);
  }
  return files.sort((a, b) => a.localeCompare(b, "ko"));
}

function safeLoadExamFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const sandbox = {
    window: {},
    console: { log() {}, warn() {}, error() {} },
  };
  sandbox.globalThis = sandbox.window;
  try {
    vm.runInNewContext(source, sandbox, {
      filename: filePath,
      timeout: 1000,
      displayErrors: true,
    });
  } catch (error) {
    return {
      ok: false,
      error: `${error.name}: ${error.message}`,
      examTitle: "",
      questionBank: [],
      sourceLength: source.length,
    };
  }
  return {
    ok: Array.isArray(sandbox.window.questionBank),
    error: Array.isArray(sandbox.window.questionBank) ? "" : "window.questionBank is not an array",
    examTitle: typeof sandbox.window.examTitle === "string" ? sandbox.window.examTitle : "",
    questionBank: Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [],
    sourceLength: source.length,
  };
}

function gradeMatches(relativeFile, examTitle, grade) {
  if (!grade) return true;
  return `${relativeFile} ${examTitle}`.includes(grade);
}

function summarizeQuestion(question, index) {
  const fields = [
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
    "answer",
    "solution",
    "image",
  ];
  const missingFields = fields.filter((field) => !(field in question));
  return {
    questionId: question?.id ?? null,
    originalIndex: index,
    fieldsPresent: Object.keys(question ?? {}).sort(),
    missingFields,
    standardCourse: question?.standardCourse ?? "",
    standardUnitKey: question?.standardUnitKey ?? "",
    standardUnit: question?.standardUnit ?? "",
    level: question?.level ?? "",
    questionType: question?.questionType ?? "",
    layoutTag: question?.layoutTag ?? "",
    tags: Array.isArray(question?.tags) ? question.tags : [],
    wide: question?.wide === true,
    hasContent: typeof question?.content === "string" && question.content.length > 0,
    hasChoices: Array.isArray(question?.choices) && question.choices.length > 0,
    hasAnswer: typeof question?.answer === "string" && question.answer.length > 0,
    hasSolution: typeof question?.solution === "string" && question.solution.length > 0,
    hasImage: typeof question?.image === "string" && question.image.length > 0,
    content: question?.content ?? "",
    choices: Array.isArray(question?.choices) ? question.choices : [],
    answer: question?.answer ?? "",
    solution: question?.solution ?? "",
    image: question?.image ?? "",
  };
}

function increment(map, key) {
  const safeKey = key || "(empty)";
  map[safeKey] = (map[safeKey] ?? 0) + 1;
}

export function scanExamBank(options = parseArgs()) {
  const sourceFilter = options.source || "";
  const allFiles = walkJsFiles(EXAMS_DIR)
    .map((filePath) => ({
      filePath,
      relativeFile: toPosix(path.relative(ROOT_DIR, filePath)),
    }))
    .filter((entry) => !sourceFilter || entry.relativeFile === sourceFilter);

  const files = [];
  let totalQuestions = 0;
  const standardUnitKeyDistribution = {};
  const questionTypeDistribution = {};
  const layoutTagDistribution = {};
  const tagDistribution = {};
  let filesWithErrors = 0;

  for (const entry of allFiles) {
    const loaded = safeLoadExamFile(entry.filePath);
    if (!gradeMatches(entry.relativeFile, loaded.examTitle, options.grade)) continue;
    if (options.limit && totalQuestions >= options.limit) break;

    const remaining = options.limit ? options.limit - totalQuestions : Infinity;
    const questions = loaded.questionBank
      .slice(0, remaining)
      .map((question, index) => summarizeQuestion(question, index));

    for (const question of questions) {
      increment(standardUnitKeyDistribution, question.standardUnitKey);
      increment(questionTypeDistribution, question.questionType);
      increment(layoutTagDistribution, question.layoutTag);
      for (const tag of question.tags) increment(tagDistribution, tag);
    }

    totalQuestions += questions.length;
    if (!loaded.ok) filesWithErrors += 1;
    files.push({
      sourceFile: entry.relativeFile,
      examTitle: loaded.examTitle,
      ok: loaded.ok,
      error: loaded.error,
      sourceLength: loaded.sourceLength,
      questionCount: loaded.questionBank.length,
      scannedQuestionCount: questions.length,
      questions,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    source: "archive/exams/**/*.js",
    filters: {
      limit: options.limit ?? null,
      grade: options.grade || null,
      source: options.source || null,
    },
    totals: {
      files: files.length,
      filesWithErrors,
      questions: totalQuestions,
    },
    distributions: {
      standardUnitKey: standardUnitKeyDistribution,
      questionType: questionTypeDistribution,
      layoutTag: layoutTagDistribution,
      tags: tagDistribution,
    },
    files,
  };
}

function renderSummary(report) {
  const unitRows = Object.entries(report.distributions.standardUnitKey)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([key, count]) => `| ${key} | ${count} |`)
    .join("\n");
  return `# Exam Bank Inventory

- Generated: ${report.generatedAt}
- Files scanned: ${report.totals.files}
- Questions scanned: ${report.totals.questions}
- Files with load errors: ${report.totals.filesWithErrors}

## Standard Unit Key Distribution

| standardUnitKey | Count |
|---|---:|
${unitRows || "| (none) | 0 |"}

## Field Notes

- This report inventories existing fields only.
- Source JS files are loaded in a constrained VM sandbox and are not modified.
- layoutTag, wide, content, choices, answer, solution, and image are recorded for comparison only.
`;
}

export function writeScanReports(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "exam-bank-inventory.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "exam-bank-inventory.summary.md"), renderSummary(report), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = scanExamBank();
  writeScanReports(report);
  console.log(`Scanned ${report.totals.questions} questions from ${report.totals.files} files.`);
}
