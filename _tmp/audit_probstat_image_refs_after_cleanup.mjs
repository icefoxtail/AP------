import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "archive", "textbook", "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const out = path.join(reportDir, `probstat_image_refs_after_cleanup_${stamp}.json`);

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

function parse(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [];
}

function candidates(image) {
  const normalized = String(image || "").replaceAll("/", path.sep);
  return [
    path.join(root, normalized),
    path.join(root, "archive", normalized),
  ];
}

const jsFiles = [
  ...walk(path.join(root, "archive", "exams")),
  ...walk(path.join(root, "archive", "_generated", "past-exams", "high_h2_probability_statistics_all_terms")),
]
  .filter((file) => file.endsWith(".js"))
  .filter((file) => rel(file).includes("확률과통계"));

const issues = [];
const files = [];
for (const file of jsFiles) {
  let bank;
  try {
    bank = parse(file);
  } catch (error) {
    issues.push({ file: rel(file), type: "parse_error", evidence: error.message });
    continue;
  }
  let refs = 0;
  for (const q of bank) {
    if (!q.image) continue;
    refs += 1;
    const resolved = candidates(q.image).find((candidate) => fs.existsSync(candidate));
    if (!resolved) {
      issues.push({ file: rel(file), id: q.id ?? null, type: "image_missing", image: q.image });
    }
  }
  files.push({ file: rel(file), questions: bank.length, imageRefs: refs });
}

const report = {
  generatedAt: new Date().toISOString(),
  filesChecked: files.length,
  totalImageRefs: files.reduce((sum, file) => sum + file.imageRefs, 0),
  issueCount: issues.length,
  issueTypeCounts: issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {}),
  files,
  issues,
};

fs.writeFileSync(out, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({
  out: rel(out),
  filesChecked: report.filesChecked,
  totalImageRefs: report.totalImageRefs,
  issueCount: report.issueCount,
  issueTypeCounts: report.issueTypeCounts,
}, null, 2));
