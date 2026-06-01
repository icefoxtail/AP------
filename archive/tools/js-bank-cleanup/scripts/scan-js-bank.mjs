import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const EXAMS_DIR = path.join(ROOT_DIR, "archive", "exams");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");
const DB_PATH = path.join(ROOT_DIR, "archive", "db.js");
const ALLOWED_GRADES = new Set(["중1", "중2", "중3", "고1", "고2", "고3"]);

export const REQUIRED_FIELDS = [
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
];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

export function parseArgs(argv = process.argv.slice(2)) {
  const options = { limit: null, grade: "", source: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--limit") options.limit = Number(argv[++i]);
    else if (arg === "--grade") options.grade = argv[++i] ?? "";
    else if (arg === "--source") options.source = (argv[++i] ?? "").replaceAll("\\", "/");
  }
  if (options.grade && !ALLOWED_GRADES.has(options.grade)) {
    throw new Error(`Invalid --grade "${options.grade}". Allowed values: ${[...ALLOWED_GRADES].join(", ")}`);
  }
  return options;
}

export function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath, predicate));
    else if (entry.isFile() && predicate(fullPath)) files.push(fullPath);
  }
  return files.sort((a, b) => a.localeCompare(b, "ko"));
}

export function loadWindowScript(filePath, timeout = 1000) {
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

export function increment(map, key) {
  const normalized = key === undefined || key === null || key === "" ? "(empty)" : String(key);
  map[normalized] = (map[normalized] ?? 0) + 1;
}

function inferGradeFromText(text) {
  const match = String(text ?? "").match(/(^|[^가-힣A-Za-z0-9])([중고][1-3])($|[^가-힣A-Za-z0-9])/);
  return match?.[2] ?? "";
}

function buildDbGradeMap() {
  const loaded = loadWindowScript(DB_PATH);
  const entries = Array.isArray(loaded.window.mainDB?.exams) ? loaded.window.mainDB.exams : [];
  return new Map(entries.filter((entry) => entry?.file && entry?.grade).map((entry) => [entry.file, entry.grade]));
}

function inferFileGrade(relativeFile, examTitle, questions, dbGradeMap) {
  const dbGrade = dbGradeMap.get(relativeFile);
  if (ALLOWED_GRADES.has(dbGrade)) return dbGrade;
  for (const question of questions) {
    const explicit = question?.grade;
    if (ALLOWED_GRADES.has(explicit)) return explicit;
    const fromCourse = inferGradeFromText(question?.standardCourse);
    if (fromCourse) return fromCourse;
  }
  const titleGrade = inferGradeFromText(examTitle);
  if (titleGrade) return titleGrade;
  return inferGradeFromText(path.basename(relativeFile, ".js"));
}

function isGradeMatch(relativeFile, examTitle, questions, grade, dbGradeMap) {
  if (!grade) return true;
  return inferFileGrade(relativeFile, examTitle, questions, dbGradeMap) === grade;
}

function findImageSrcs(content) {
  const matches = [];
  const regex = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(String(content ?? "")))) matches.push(match[1]);
  return matches;
}

function analyzeQuestion(question, originalIndex) {
  const safeQuestion = question && typeof question === "object" ? question : {};
  const missingRequiredFields = REQUIRED_FIELDS.filter((field) => !(field in safeQuestion));
  const ids = safeQuestion?.id;
  const choices = safeQuestion?.choices;
  const tags = safeQuestion?.tags;
  const content = String(safeQuestion?.content ?? "");
  const imageSrcs = findImageSrcs(content);
  const choiceFormatErrors = [];
  if (!Array.isArray(choices)) choiceFormatErrors.push("choices is not an array");
  else if (choices.some((choice) => typeof choice !== "string")) choiceFormatErrors.push("choices has non-string item");

  return {
    questionId: ids ?? null,
    originalIndex,
    idType: typeof ids,
    isObject: Boolean(question && typeof question === "object"),
    level: safeQuestion?.level ?? "",
    category: safeQuestion?.category ?? "",
    originalCategory: safeQuestion?.originalCategory ?? "",
    standardCourse: safeQuestion?.standardCourse ?? "",
    standardUnitKey: safeQuestion?.standardUnitKey ?? "",
    standardUnit: safeQuestion?.standardUnit ?? "",
    standardUnitOrder: safeQuestion?.standardUnitOrder ?? null,
    questionType: safeQuestion?.questionType ?? "",
    layoutTag: safeQuestion?.layoutTag ?? "",
    tags: Array.isArray(tags) ? tags : [],
    tagsIsArray: Array.isArray(tags),
    wide: safeQuestion?.wide ?? null,
    wideIsBoolean: typeof safeQuestion?.wide === "boolean",
    image: typeof safeQuestion?.image === "string" ? safeQuestion.image : "",
    hasImageField: typeof safeQuestion?.image === "string" && safeQuestion.image.length > 0,
    contentHasImg: imageSrcs.length > 0,
    contentImgSrcs: imageSrcs,
    contentHasSvg: /<svg\b/i.test(content),
    contentHasTable: /<table\b/i.test(content),
    contentEmpty: typeof safeQuestion?.content !== "string" || safeQuestion.content.trim() === "",
    answerEmpty: typeof safeQuestion?.answer !== "string" || safeQuestion.answer.trim() === "",
    solutionEmpty: typeof safeQuestion?.solution !== "string" || safeQuestion.solution.trim() === "",
    choicesIsArray: Array.isArray(choices),
    choicesLength: Array.isArray(choices) ? choices.length : null,
    choiceFormatErrors,
    missingRequiredFields,
    missingRequiredFieldCount: missingRequiredFields.length,
    hasGeneratedPendingSolution: /generated_pending|answer_solution_manual_review/i.test(String(safeQuestion?.solution ?? "")),
  };
}

function summarizeFile(relativeFile, loaded, options) {
  const questionBankExists = Array.isArray(loaded.window.questionBank);
  const allQuestions = questionBankExists ? loaded.window.questionBank : [];
  const remaining = options.limitRemaining ?? Infinity;
  const slicedQuestions = allQuestions.slice(0, remaining);
  const questions = Array.from({ length: slicedQuestions.length }, (_, index) => analyzeQuestion(slicedQuestions[index], index));
  const ids = questions.map((q) => q.questionId);
  const duplicateIds = [...new Set(ids.filter((id, index) => id !== null && ids.indexOf(id) !== index))];
  const idSequential = ids.every((id, index) => id === index + 1);
  const distributions = {
    level: {},
    category: {},
    originalCategory: {},
    standardCourse: {},
    standardUnitKey: {},
    standardUnit: {},
    standardUnitOrder: {},
    questionType: {},
    layoutTag: {},
    wide: {},
  };
  const tagCounts = {};
  for (const question of questions) {
    for (const key of Object.keys(distributions)) increment(distributions[key], question[key]);
    for (const tag of question.tags) increment(tagCounts, tag);
  }

  return {
    fileName: path.basename(relativeFile),
    relativePath: relativeFile,
    examTitleExists: typeof loaded.window.examTitle === "string",
    examTitle: typeof loaded.window.examTitle === "string" ? loaded.window.examTitle : "",
    questionBankExists,
    questionCount: allQuestions.length,
    scannedQuestionCount: questions.length,
    jsLoadable: loaded.ok && questionBankExists,
    loadError: loaded.ok ? (questionBankExists ? "" : "window.questionBank is not an array") : loaded.error,
    idSequential,
    duplicateIds,
    distributions,
    tags: tagCounts,
    imageUsage: {
      imageFieldCount: questions.filter((q) => q.hasImageField).length,
      contentImgCount: questions.filter((q) => q.contentHasImg).length,
      svgCount: questions.filter((q) => q.contentHasSvg).length,
      tableCount: questions.filter((q) => q.contentHasTable).length,
      imageAndContentImgCount: questions.filter((q) => q.hasImageField && q.contentHasImg).length,
    },
    emptyCounts: {
      content: questions.filter((q) => q.contentEmpty).length,
      answer: questions.filter((q) => q.answerEmpty).length,
      solution: questions.filter((q) => q.solutionEmpty).length,
    },
    choicesFormatErrorCount: questions.filter((q) => q.choiceFormatErrors.length > 0).length,
    missingRequiredFieldCount: questions.reduce((sum, q) => sum + q.missingRequiredFieldCount, 0),
    questions,
  };
}

export function scanJsBank(options = parseArgs()) {
  const sourceFilter = options.source || "";
  const dbGradeMap = buildDbGradeMap();
  const jsFiles = walkFiles(EXAMS_DIR, (filePath) => filePath.endsWith(".js"))
    .map((filePath) => ({
      filePath,
      relativeFile: toPosix(path.relative(path.join(ROOT_DIR, "archive", "exams"), filePath)),
      projectRelativeFile: toPosix(path.relative(ROOT_DIR, filePath)),
    }))
    .filter((entry) => !sourceFilter || entry.projectRelativeFile === sourceFilter || entry.relativeFile === sourceFilter);

  const files = [];
  let scannedQuestions = 0;
  for (const entry of jsFiles) {
    if (options.limit && scannedQuestions >= options.limit) break;
    const loaded = loadWindowScript(entry.filePath);
    const questions = Array.isArray(loaded.window.questionBank) ? loaded.window.questionBank : [];
    if (!isGradeMatch(entry.relativeFile, loaded.window.examTitle ?? "", questions, options.grade, dbGradeMap)) continue;
    const fileSummary = summarizeFile(entry.relativeFile, loaded, {
      limitRemaining: options.limit ? options.limit - scannedQuestions : Infinity,
    });
    scannedQuestions += fileSummary.scannedQuestionCount;
    files.push(fileSummary);
  }

  const totals = {
    files: files.length,
    questions: scannedQuestions,
    loadErrors: files.filter((file) => !file.jsLoadable).length,
    nonSequentialIdFiles: files.filter((file) => !file.idSequential).length,
    duplicateIdFiles: files.filter((file) => file.duplicateIds.length > 0).length,
    missingRequiredFields: files.reduce((sum, file) => sum + file.missingRequiredFieldCount, 0),
    emptyContent: files.reduce((sum, file) => sum + file.emptyCounts.content, 0),
    emptyAnswer: files.reduce((sum, file) => sum + file.emptyCounts.answer, 0),
    emptySolution: files.reduce((sum, file) => sum + file.emptyCounts.solution, 0),
    choicesFormatErrors: files.reduce((sum, file) => sum + file.choicesFormatErrorCount, 0),
  };

  return {
    generatedAt: new Date().toISOString(),
    source: "archive/exams/**/*.js",
    filters: {
      limit: options.limit ?? null,
      grade: options.grade || null,
      source: options.source || null,
    },
    totals,
    files,
  };
}

function renderSummary(report) {
  const rows = report.files
    .slice(0, 50)
    .map((file) => `| ${file.relativePath} | ${file.questionCount} | ${file.scannedQuestionCount} | ${file.jsLoadable ? "yes" : "no"} | ${file.missingRequiredFieldCount} |`)
    .join("\n");
  return `# JS Bank Inventory

- Generated: ${report.generatedAt}
- Files scanned: ${report.totals.files}
- Questions scanned: ${report.totals.questions}
- Load errors: ${report.totals.loadErrors}
- Missing required field instances: ${report.totals.missingRequiredFields}
- Empty content: ${report.totals.emptyContent}
- Empty answer: ${report.totals.emptyAnswer}
- Empty solution: ${report.totals.emptySolution}
- Choice format errors: ${report.totals.choicesFormatErrors}

| File | Total Questions | Scanned | Loadable | Missing Field Instances |
|---|---:|---:|---|---:|
${rows || "| - | 0 | 0 | - | 0 |"}
`;
}

export function writeJsBankInventory(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "js-bank-inventory.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "js-bank-inventory.summary.md"), renderSummary(report), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = scanJsBank();
  writeJsBankInventory(report);
  console.log(`Scanned ${report.totals.questions} questions from ${report.totals.files} JS files.`);
}
