import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const textbookRoot = path.join(root, "archive", "textbook");
const bookRoot = fs.readdirSync(textbookRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(textbookRoot, entry.name))
  .find((dir) => path.basename(dir).includes("비상교육") && path.basename(dir).includes("공통수학2") && path.basename(dir).includes("교과서"));
if (!bookRoot) throw new Error("비상 공통수학2 교과서 폴더를 찾지 못했습니다.");

const jsRoot = path.join(bookRoot, "generated", "js");
const archiveRoot = path.join(root, "archive", "exams", "textbook");
const reportsDir = path.join(bookRoot, "generated", "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");

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
  return sandbox.window.questionBank || [];
}

fs.mkdirSync(archiveRoot, { recursive: true });

const copied = [];
for (const src of walk(jsRoot).filter((file) => file.endsWith(".js")).sort((a, b) => rel(a).localeCompare(rel(b), "ko"))) {
  const dest = path.join(archiveRoot, path.basename(src));
  fs.copyFileSync(src, dest);
  copied.push({
    src: rel(src),
    dest: rel(dest),
    questions: parseBank(dest).length,
    imageRefs: parseBank(dest).filter((q) => q.image).length,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  scope: "비상 공통수학2 generated/js -> archive/exams/textbook promotion",
  copiedFiles: copied.length,
  questions: copied.reduce((sum, item) => sum + item.questions, 0),
  imageRefs: copied.reduce((sum, item) => sum + item.imageRefs, 0),
  copied,
};

const out = path.join(reportsDir, `visang_common2_promotion_${stamp}.json`);
fs.writeFileSync(out, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({
  out: rel(out),
  copiedFiles: report.copiedFiles,
  questions: report.questions,
  imageRefs: report.imageRefs,
}, null, 2));
