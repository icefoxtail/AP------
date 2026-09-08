import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "reports", "h2-s1-algebra-visual-upgrade");
const CANDIDATE_DIR = path.join(REPORT_DIR, "candidates", "rebuild-baselines");
const triage = JSON.parse(fs.readFileSync(path.join(REPORT_DIR, "visual_triage.json"), "utf8"));
fs.mkdirSync(CANDIDATE_DIR, { recursive: true });
const cache = new Map();
const load = (sourceJsPath) => {
  if (cache.has(sourceJsPath)) return cache.get(sourceJsPath);
  const file = path.join(ROOT, sourceJsPath);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 5000 });
  cache.set(sourceJsPath, context.window);
  return context.window;
};
const safe = (value) => String(value).replace(/[^A-Za-z0-9_-]+/g, "_");
const rows = [];
for (const row of triage.rows.filter((item) => item.disposition === "REBUILD_EXISTING" && item.questionUid !== "24_팔마고_1학기_기말_고2_수학I::q9")) {
  const window = load(row.sourceJsPath);
  const q = (window.questionBank || []).find((item) => Number(item.id) === row.id);
  const source = `${q?.content || ""}\n${q?.solution || ""}`;
  const svgs = [...source.matchAll(/<svg[\s\S]*?<\/svg>/gi)].map((match) => match[0]);
  const out = path.join(CANDIDATE_DIR, `${safe(row.questionUid)}.svg`);
  if (svgs.length) fs.writeFileSync(out, svgs[0], "utf8");
  rows.push({ ...row, candidateRef: svgs.length ? path.relative(ROOT, out).replaceAll("\\", "/") : null, candidateStatus: svgs.length ? "REBUILD_BASELINE_EXTRACTED_PENDING_REBUILD" : "NO_INLINE_SVG_FOUND" });
}
fs.writeFileSync(path.join(REPORT_DIR, "rebuild_candidate_manifest.json"), JSON.stringify({ schemaVersion: "apmath-rebuild-candidate-manifest-v1", rows }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ extracted: rows.filter((row) => row.candidateRef).length, missing: rows.filter((row) => !row.candidateRef).length, total: rows.length }));
