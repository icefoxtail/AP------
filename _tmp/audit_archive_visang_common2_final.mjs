import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const archiveRoot = path.join(root, "archive", "exams", "textbook");
const reportsDir = path.join(root, "archive", "textbook", "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function parseBank(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return {
    examTitle: sandbox.window.examTitle || "",
    bank: sandbox.window.questionBank || [],
  };
}

function imageCandidates(imagePath) {
  const normalized = String(imagePath || "").replaceAll("/", path.sep);
  return [
    path.join(root, normalized),
    path.join(root, "archive", normalized),
  ];
}

const files = fs.readdirSync(archiveRoot)
  .filter((name) => name.includes("비상_공통수학2") && name.endsWith(".js"))
  .map((name) => path.join(archiveRoot, name))
  .sort((a, b) => path.basename(a).localeCompare(path.basename(b), "ko"));

const issues = [];
const summaries = [];

for (const file of files) {
  const parsed = parseBank(file);
  let imageRefs = 0;
  for (const [index, q] of parsed.bank.entries()) {
    const id = q.id ?? index + 1;
    if (q.id !== index + 1) issues.push({ file: rel(file), id, type: "id_sequence_gap", evidence: `expected ${index + 1}, got ${q.id}` });
    if (!String(q.content ?? "").trim()) issues.push({ file: rel(file), id, type: "content_missing" });
    if (!String(q.answer ?? "").trim()) issues.push({ file: rel(file), id, type: "answer_missing" });
    if (!String(q.solution ?? "").trim()) issues.push({ file: rel(file), id, type: "solution_missing" });
    if (q.image) {
      imageRefs += 1;
      if (!imageCandidates(q.image).some((candidate) => fs.existsSync(candidate))) {
        issues.push({ file: rel(file), id, type: "image_path_missing", evidence: q.image });
      }
    }
  }
  summaries.push({ file: rel(file), questions: parsed.bank.length, imageRefs });
}

const report = {
  generatedAt: new Date().toISOString(),
  scope: "archive/exams/textbook 비상 공통수학2 final audit",
  filesChecked: files.length,
  questions: summaries.reduce((sum, item) => sum + item.questions, 0),
  imageRefs: summaries.reduce((sum, item) => sum + item.imageRefs, 0),
  issueCount: issues.length,
  issueTypeCounts: issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {}),
  files: summaries,
  issues,
};

fs.mkdirSync(reportsDir, { recursive: true });
const out = path.join(reportsDir, `archive_visang_common2_final_audit_${stamp}.json`);
fs.writeFileSync(out, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({
  out: rel(out),
  filesChecked: report.filesChecked,
  questions: report.questions,
  imageRefs: report.imageRefs,
  issueCount: report.issueCount,
  issueTypeCounts: report.issueTypeCounts,
}, null, 2));
