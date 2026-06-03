import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const textbookRoot = path.join(root, "archive", "textbook");
const outDir = path.join(textbookRoot, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `common_math_answer_source_inventory_${stamp}.json`);
const outMd = path.join(outDir, `common_math_answer_source_inventory_${stamp}.md`);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function parseBank(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [];
}

function summarizeJson(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const keys = ["appliedCount", "filled", "filledCount", "answerMissing", "missingAnswerCount", "beforeMissing", "afterMissing", "status"];
    return Object.fromEntries(keys.filter((key) => Object.prototype.hasOwnProperty.call(data, key)).map((key) => [key, data[key]]));
  } catch {
    return {};
  }
}

const subjectPattern = /공통수학[12]/;
const bookDirs = fs.readdirSync(textbookRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && subjectPattern.test(entry.name))
  .map((entry) => path.join(textbookRoot, entry.name))
  .sort((a, b) => path.basename(a).localeCompare(path.basename(b), "ko"));

const topFiles = fs.readdirSync(textbookRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => path.join(textbookRoot, entry.name));

const rows = [];
for (const bookDir of bookDirs) {
  const name = path.basename(bookDir);
  const subject = (name.match(/공통수학[12]/) || [""])[0];
  const relatedTopAnswerFiles = topFiles.filter((file) => {
    const base = path.basename(file);
    return base.includes(subject) && /답|정답|해설|answer|solution|빠른/i.test(base);
  });
  const internalAnswerFiles = walk(bookDir).filter((file) => /답|정답|해설|answer|solution|빠른/i.test(path.basename(file)));
  const answerPdfs = [...relatedTopAnswerFiles, ...internalAnswerFiles].filter((file) => /\.pdf$/i.test(file));
  const answerJsons = internalAnswerFiles.filter((file) => /\.json$/i.test(file) && /answer|solution|답|정답|해설/i.test(path.basename(file)));
  const answerApplyReports = answerJsons.filter((file) => /apply|fill|source|table|answer_report|solution/i.test(path.basename(file)));
  const jsFiles = walk(path.join(bookDir, "generated", "js")).filter((file) => file.endsWith(".js"));
  let questionCount = 0;
  let answerMissing = 0;
  let solutionMissing = 0;
  let parseErrors = 0;
  for (const jsFile of jsFiles) {
    try {
      const bank = parseBank(jsFile);
      questionCount += bank.length;
      answerMissing += bank.filter((q) => !String(q?.answer ?? "").trim()).length;
      solutionMissing += bank.filter((q) => !String(q?.solution ?? "").trim()).length;
    } catch {
      parseErrors += 1;
    }
  }
  const latestApplyReports = answerApplyReports
    .map((file) => ({ file, mtimeMs: fs.statSync(file).mtimeMs, summary: summarizeJson(file) }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, 5);

  rows.push({
    name,
    subject,
    path: rel(bookDir),
    answerPdfCount: answerPdfs.length,
    answerPdfs: answerPdfs.map(rel),
    answerJsonCount: answerJsons.length,
    answerApplyReportCount: answerApplyReports.length,
    latestApplyReports: latestApplyReports.map((item) => ({ file: rel(item.file), summary: item.summary })),
    jsFiles: jsFiles.length,
    questionCount,
    answerMissing,
    solutionMissing,
    parseErrors,
    hasStrongAnswerSource: answerPdfs.length > 0 || answerApplyReports.length > 0,
    isAnswerCompleteInJs: jsFiles.length > 0 && answerMissing === 0 && parseErrors === 0,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  scope: "공통수학1/공통수학2 answer source inventory",
  bookCount: rows.length,
  rows,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");

const lines = [
  "# 공통수학1/2 정답 근거 인벤토리",
  "",
  `- 교재 폴더: ${rows.length}`,
  "",
  "| 교재 | 과목 | 정답PDF | answer리포트 | JS | 문항 | 답누락 | 해설누락 | 상태 |",
  "|---|---|---:|---:|---:|---:|---:|---:|---|",
  ...rows.map((row) => `| ${row.name} | ${row.subject} | ${row.answerPdfCount} | ${row.answerApplyReportCount} | ${row.jsFiles} | ${row.questionCount} | ${row.answerMissing} | ${row.solutionMissing} | ${row.isAnswerCompleteInJs ? "JS답완료" : row.hasStrongAnswerSource ? "정답근거있음" : "근거약함"} |`),
  "",
  "## 정답 PDF",
  "",
  ...rows.flatMap((row) => row.answerPdfs.length ? [`### ${row.name}`, ...row.answerPdfs.map((file) => `- ${file}`), ""] : []),
  "## 최신 answer 리포트",
  "",
  ...rows.flatMap((row) => row.latestApplyReports.length ? [`### ${row.name}`, ...row.latestApplyReports.map((item) => `- ${item.file} ${JSON.stringify(item.summary)}`), ""] : []),
];

fs.writeFileSync(outMd, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  outJson: rel(outJson),
  outMd: rel(outMd),
  bookCount: rows.length,
  answerPdfBooks: rows.filter((row) => row.answerPdfCount > 0).length,
  jsAnswerCompleteBooks: rows.filter((row) => row.isAnswerCompleteInJs).length,
}, null, 2));
