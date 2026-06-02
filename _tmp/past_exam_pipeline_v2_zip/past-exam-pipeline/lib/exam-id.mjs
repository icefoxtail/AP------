import path from "node:path";

const COURSE_TOKENS = [
  "공통수학1",
  "공통수학2",
  "수학(상)",
  "수학(하)",
  "수학상",
  "수학하",
  "수학I",
  "수학II",
  "수학Ⅰ",
  "수학Ⅱ",
  "수1",
  "수2",
  "대수",
  "미적분",
  "미적분I",
  "미적분II",
  "미적분1",
  "미적분2",
  "확률과통계",
  "확률과 통계",
  "확통",
  "기벡",
  "기하"
];

const COURSE_ALIASES = new Map([
  ["수1", "수학I"],
  ["수2", "수학II"],
  ["수학Ⅰ", "수학I"],
  ["수학Ⅱ", "수학II"],
  ["확통", "확률과통계"],
  ["확률과 통계", "확률과통계"],
  ["미적분1", "미적분I"],
  ["미적분2", "미적분II"]
]);

function normalizeYear(raw) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 4) return digits.slice(2);
  if (digits.length === 2) return digits;
  return "";
}

function parseTermFromPath(file) {
  const parts = file.split(/[\\/]+/);
  const joined = parts.join("_");
  const semester = /(?:^|[^\d])1\s*학기|1중간|1기말|1학기/.test(joined)
    ? "1"
    : /(?:^|[^\d])2\s*학기|2중간|2기말|2학기/.test(joined)
      ? "2"
      : "";
  const examTypeLabel = /중간/.test(joined)
    ? "중간"
    : /기말/.test(joined)
      ? "기말"
      : "";
  const examType = examTypeLabel === "중간" ? "mid" : examTypeLabel === "기말" ? "final" : "";
  return { semester, semesterLabel: semester ? `${semester}학기` : "", examType, examTypeLabel };
}

function parseGrade(text) {
  const m = text.match(/(고|중)\s*([1-3])/);
  if (m) return `${m[1]}${m[2]}`;
  const femaleHigh = text.match(/여\s*([1-3])|여([1-3])/);
  if (femaleHigh) return `고${femaleHigh[1] || femaleHigh[2]}`;
  return "";
}

function parseCourse(text) {
  const found = COURSE_TOKENS.find((token) => text.includes(token)) || "";
  return COURSE_ALIASES.get(found) || found;
}

function parseSchool(tokens) {
  for (const token of tokens) {
    if (/^(중|고)[1-3]$/.test(token)) continue;
    const attached = token.match(/^(.+?(?:여고|여중|고|중))[1-3].*$/);
    if (attached) return attached[1];
    const femaleHigh = token.match(/^(.+?여)[1-3].*$/);
    if (femaleHigh) return `${femaleHigh[1]}고`;
    if (/(여고|여중|고|중)$/.test(token)) return token;
  }
  return "";
}

function parsePdfKind(text) {
  if (/정답|답지|answer/i.test(text)) return "answer";
  if (/해설|풀이|solution/i.test(text)) return "solution";
  return "problem";
}

export function makeSourceGroupKey(file) {
  const parsed = path.parse(file);
  return parsed.name
    .replace(/[_\-\s]*(정답|답지|answer|해설|풀이|solution)\d*$/i, "")
    .replace(/[_\-\s]+$/g, "");
}

export function parseExamPdfMetadata(file, sourceRoot = "") {
  const name = path.basename(file, path.extname(file));
  const normalizedName = name.replace(/[()[\]{}]/g, "_").replace(/\s+/g, "_");
  const tokens = normalizedName.split(/[_\-\s]+/).filter(Boolean);
  const yearMatch = normalizedName.match(/(?:^|[^\d])(\d{2}|\d{4})(?:[^\d]|$)/);
  const year = normalizeYear(yearMatch?.[1] || tokens[0] || "");
  const term = parseTermFromPath(file);
  const grade = parseGrade(normalizedName);
  const course = parseCourse(`${normalizedName}_${file}`);
  const schoolName = parseSchool(tokens);
  const pdfKind = parsePdfKind(normalizedName);
  const sourceType = "past_exam";
  const titleTail = course || "기출";
  const titleParts = [year, schoolName, term.semesterLabel, term.examTypeLabel, grade, titleTail].filter(Boolean);
  const examId = titleParts.join("_");
  const parseStatus = examId && year && schoolName && term.semester && term.examType && grade
    ? "parsed"
    : "manual_review";
  return {
    examId,
    year,
    schoolName,
    grade,
    semester: term.semester,
    semesterLabel: term.semesterLabel,
    examType: term.examType,
    examTypeLabel: term.examTypeLabel,
    course,
    sourceType,
    pdfKind,
    sourceGroupKey: makeSourceGroupKey(file),
    pdfPath: file,
    sourceRelativePath: sourceRoot ? path.relative(sourceRoot, file).replaceAll("\\", "/") : file,
    originalFileName: path.basename(file),
    parseStatus,
    parseIssues: [
      !year ? "year_missing" : "",
      !schoolName ? "school_missing" : "",
      !term.semester ? "semester_missing" : "",
      !term.examType ? "exam_type_missing" : "",
      !grade ? "grade_missing" : "",
      !examId ? "exam_id_empty" : ""
    ].filter(Boolean)
  };
}

export function buildManifestFromInventoryItem(item, cfg, duplicateIndex = 0) {
  const safeExamId = duplicateIndex > 0 ? `${item.examId}_${duplicateIndex + 1}` : item.examId;
  return {
    examId: safeExamId,
    canonicalExamId: item.examId,
    year: item.year,
    schoolName: item.schoolName,
    grade: item.grade,
    semester: item.semester,
    examType: item.examType,
    course: item.course,
    sourceType: "past_exam",
    pdfPath: item.pdfPath,
    answerPdfPath: item.answerPdfPath || "",
    solutionPdfPath: item.solutionPdfPath || "",
    pageRange: "",
    expectedQuestionCount: cfg.defaultQuestionCount,
    outputFileName: `${safeExamId}${cfg.candidateFileSuffix}.js`,
    outputDir: path.join(cfg.generatedRoot, safeExamId),
    status: item.parseStatus === "parsed" ? "pending" : "blocked",
    notes: item.parseIssues
  };
}
