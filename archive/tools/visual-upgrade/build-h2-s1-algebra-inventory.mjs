import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const ARCHIVE = path.join(ROOT, "archive");
const EXAM_ROOT = path.join(ARCHIVE, "exams", "original", "high", "h2");
const REPORT_DIR = path.join(ROOT, "reports", "h2-s1-algebra-visual-upgrade");
const INCLUDE_KEY = /^(H15-M1-|H22-A-)/u;
const EXAM_NAME = /_고2_(수학I|대수)(?:c)?\.js$/u;

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const rel = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const archiveRel = (file) => path.relative(ARCHIVE, file).replaceAll("\\", "/");
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const loadExam = (file) => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 5000 });
  return context.window;
};
const text = (value) => String(value ?? "");
const visualSignals = (question) => {
  const content = text(question.content);
  const tags = Array.isArray(question.tags) ? question.tags : [];
  const sourceImage = question.image ? path.join(ARCHIVE, question.image) : null;
  const inlineSvgInContent = /<svg[ >]/iu.test(content);
  const inlineSvgInSolution = /<svg[ >]/iu.test(text(question.solution));
  const cuePattern = /(그래프|곡선|좌표|교점|절편|점근선|삼각형|사각형|원|반지름|접선|기울기|넓이|길이|도형|표|수직선|부등식의 해)/u;
  return {
    tags,
    hasImage: Boolean(question.image),
    imageExists: Boolean(sourceImage && fs.existsSync(sourceImage)),
    imagePath: question.image || null,
    hasSolutionImage: Boolean(question.solutionImage),
    inlineSvgInContent,
    inlineSvgInSolution,
    inlineSvg: inlineSvgInContent || inlineSvgInSolution,
    cueInContent: cuePattern.test(content),
    visualTag: tags.some((tag) => ["그래프", "도형", "표"].includes(tag)),
  };
};

const files = walk(EXAM_ROOT)
  .filter((file) => EXAM_NAME.test(path.basename(file)))
  .sort((a, b) => rel(a).localeCompare(rel(b), "ko"));

const fileRows = [];
const targetRows = [];
const excludedRows = [];
for (const file of files) {
  const source = fs.readFileSync(file);
  const window = loadExam(file);
  const questions = Array.isArray(window.questionBank) ? window.questionBank : [];
  const examTitle = text(window.examTitle);
  const qRows = [];
  questions.forEach((question, ordinal) => {
    const standardUnitKey = text(question.standardUnitKey);
    const visual = visualSignals(question);
    const row = {
      questionUid: `${examTitle}::q${question.id}`,
      sourceJsPath: archiveRel(file),
      sourceJsSha256: sha256(source),
      examTitle,
      sourceOrdinal: ordinal + 1,
      id: Number(question.id),
      displayNo: question.displayNo ?? question.id,
      standardCourse: text(question.standardCourse),
      standardUnitKey,
      standardUnit: text(question.standardUnit),
      subUnitKey: text(question.subUnitKey),
      level: text(question.level),
      questionType: text(question.questionType),
      answer: text(question.answer),
      ...visual,
    };
    qRows.push(row);
    if (INCLUDE_KEY.test(standardUnitKey)) targetRows.push(row);
    else excludedRows.push({ ...row, exclusionReason: standardUnitKey.startsWith("H21-M1-") ? "LEGACY_H21_M1_OUT_OF_SCOPE" : "NON_H15_M1_OR_H22_A" });
  });
  fileRows.push({
    sourceJsPath: archiveRel(file),
    sourceJsSha256: sha256(source),
    examTitle,
    questionCount: questions.length,
    targetQuestionCount: qRows.filter((row) => INCLUDE_KEY.test(row.standardUnitKey)).length,
    excludedQuestionCount: qRows.filter((row) => !INCLUDE_KEY.test(row.standardUnitKey)).length,
    imageQuestionCount: qRows.filter((row) => row.hasImage).length,
    inlineSvgQuestionCount: qRows.filter((row) => row.inlineSvg).length,
  });
}

const byKey = (rows) => Object.fromEntries([...rows.reduce((map, row) => map.set(row.standardUnitKey, (map.get(row.standardUnitKey) || 0) + 1), new Map())].sort());
const summary = {
  schemaVersion: "apmath-h2-s1-algebra-visual-upgrade-inventory-v1",
  generatedAt: new Date().toISOString(),
  baselineCommit: "981ac3c744c479f6eeee1d502752915c6ed429f7",
  inclusionRule: "H15-M1-* or H22-A-*",
  sourceFileCount: files.length,
  candidateQuestionCount: fileRows.reduce((sum, row) => sum + row.questionCount, 0),
  targetQuestionCount: targetRows.length,
  excludedQuestionCount: excludedRows.length,
  targetByStandardUnitKey: byKey(targetRows),
  targetImageCount: targetRows.filter((row) => row.hasImage).length,
  targetMissingImageCount: targetRows.filter((row) => row.hasImage && !row.imageExists).length,
  targetInlineSvgCount: targetRows.filter((row) => row.inlineSvg).length,
  targetVisualTagCounts: Object.fromEntries(["그래프", "도형", "표"].map((tag) => [tag, targetRows.filter((row) => row.tags.includes(tag)).length])),
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, "inventory.json"), JSON.stringify({ summary, files: fileRows, targetRows, excludedRows }, null, 2) + "\n", "utf8");
const csvHeader = "questionUid,sourceJsPath,examTitle,id,standardCourse,standardUnitKey,standardUnit,subUnitKey,hasImage,imageExists,inlineSvgInContent,inlineSvgInSolution,visualTag,cueInContent\n";
const csvEscape = (value) => `"${text(value).replaceAll('"', '""')}"`;
const csv = targetRows.map((row) => [row.questionUid, row.sourceJsPath, row.examTitle, row.id, row.standardCourse, row.standardUnitKey, row.standardUnit, row.subUnitKey, row.hasImage, row.imageExists, row.inlineSvgInContent, row.inlineSvgInSolution, row.visualTag, row.cueInContent].map(csvEscape).join(",")).join("\n");
fs.writeFileSync(path.join(REPORT_DIR, "inventory.csv"), csvHeader + csv + "\n", "utf8");
console.log(JSON.stringify(summary, null, 2));
