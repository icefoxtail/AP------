import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "archive", "textbook", "reports");
const removalReport = path.join(reportDir, fs.readdirSync(reportDir).filter((f) => f.startsWith("probstat_useless_image_tag_asset_removal_") && f.endsWith(".json")).sort().at(-1));
const removal = JSON.parse(fs.readFileSync(removalReport, "utf8"));
const deleted = new Set(removal.deleted.flatMap((p) => {
  const noArchive = p.startsWith("archive/") ? p.slice("archive/".length) : p;
  return [p.replaceAll("\\", "/"), noArchive.replaceAll("\\", "/")];
}));
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const out = path.join(reportDir, `probstat_clear_deleted_asset_refs_${stamp}.json`);

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
  return { examTitle: sandbox.window.examTitle || "", questionBank: sandbox.window.questionBank || [] };
}

function write(file, examTitle, questionBank) {
  fs.writeFileSync(file, [`window.examTitle = ${JSON.stringify(examTitle)};`, "", `window.questionBank = ${JSON.stringify(questionBank, null, 2)};`, ""].join("\n"), "utf8");
}

function isDeletedRef(image) {
  const s = String(image || "").replaceAll("\\", "/");
  if (!s) return false;
  return deleted.has(s) || deleted.has(s.replace(/^archive\//, "")) || [...deleted].some((d) => s.endsWith(d));
}

const roots = [
  path.join(root, "archive", "exams"),
  path.join(root, "archive", "_generated", "past-exams", "high_h2_probability_statistics_all_terms"),
];

const cleared = [];
for (const file of roots.flatMap(walk).filter((f) => f.endsWith(".js") && rel(f).includes("확률과통계"))) {
  let parsed;
  try {
    parsed = parse(file);
  } catch {
    continue;
  }
  let changed = false;
  for (const q of parsed.questionBank) {
    if (isDeletedRef(q.image)) {
      cleared.push({ file: rel(file), id: q.id ?? null, image: q.image });
      q.image = "";
      changed = true;
    }
  }
  if (changed) write(file, parsed.examTitle, parsed.questionBank);
}

fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), removalReport: rel(removalReport), clearedCount: cleared.length, cleared }, null, 2), "utf8");
console.log(JSON.stringify({ out: rel(out), clearedCount: cleared.length }, null, 2));
