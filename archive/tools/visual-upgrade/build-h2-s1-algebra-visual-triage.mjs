import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "reports", "h2-s1-algebra-visual-upgrade");
const ARCHIVE = path.join(ROOT, "archive");
const EXAM_ROOT = path.join(ARCHIVE, "exams", "original", "high", "h2");
const EXAM_NAME = /_고2_(수학I|대수)(?:c)?\.js$/u;
const INCLUDE = /^(H15-M1-|H22-A-)/u;
const text = (value) => String(value ?? "");
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const rel = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const load = (file) => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 5000 });
  return context.window;
};
const tagsOf = (q) => Array.isArray(q.tags) ? q.tags : [];
const sourceSignals = (q) => {
  const content = text(q.content);
  const tags = tagsOf(q);
  const inlineSvgInContent = /<svg[ >]/iu.test(content);
  const inlineSvgInSolution = /<svg[ >]/iu.test(text(q.solution));
  const mathVisualCue = /(그래프|곡선|좌표|교점|절편|점근선|삼각형|사각형|원|반지름|접선|기울기|넓이|길이|부채꼴|정사각형|수직선|부등식의 해)/u.test(content);
  const explicitVisual = tags.some((tag) => ["그래프", "도형", "표"].includes(tag));
  return { inlineSvgInContent, inlineSvgInSolution, inlineSvg: inlineSvgInContent || inlineSvgInSolution, explicitVisual, mathVisualCue };
};
const disposition = (q, signal) => {
  if (signal.inlineSvg) return "REBUILD_EXISTING";
  if (q.image) return "KEEP_EXISTING";
  if (signal.explicitVisual) return "ADD_NEW_VISUAL";
  return "NO_VISUAL";
};

const rows = [];
for (const file of walk(EXAM_ROOT).filter((candidate) => EXAM_NAME.test(path.basename(candidate))).sort()) {
  const window = load(file);
  for (const q of window.questionBank || []) {
    if (!INCLUDE.test(text(q.standardUnitKey))) continue;
    const signal = sourceSignals(q);
    const action = disposition(q, signal);
    rows.push({
      questionUid: `${text(window.examTitle)}::q${q.id}`,
      sourceJsPath: rel(file),
      id: Number(q.id),
      standardCourse: text(q.standardCourse),
      standardUnitKey: text(q.standardUnitKey),
      standardUnit: text(q.standardUnit),
      subUnitKey: text(q.subUnitKey),
      image: q.image || null,
      solutionImage: q.solutionImage || null,
      tags: tagsOf(q),
      inlineSvgInContent: signal.inlineSvgInContent,
      inlineSvgInSolution: signal.inlineSvgInSolution,
      explicitVisualSignal: signal.explicitVisual,
      mathVisualCue: signal.mathVisualCue,
      disposition: action,
      v1Status: action === "NO_VISUAL" ? "NOT_REQUIRED" : "PENDING",
      v2Status: action === "NO_VISUAL" ? "NOT_REQUIRED" : "PENDING",
      v3Status: action === "NO_VISUAL" ? "NOT_REQUIRED" : "PENDING",
    });
  }
}
const counts = Object.fromEntries(["NO_VISUAL", "KEEP_EXISTING", "REBUILD_EXISTING", "ADD_NEW_VISUAL"].map((value) => [value, rows.filter((row) => row.disposition === value).length]));
const summary = { schemaVersion: "apmath-h2-s1-algebra-visual-triage-v1", generatedAt: new Date().toISOString(), targetCount: rows.length, dispositionCounts: counts, candidateCount: counts.REBUILD_EXISTING + counts.ADD_NEW_VISUAL };
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, "visual_triage.json"), JSON.stringify({ summary, rows }, null, 2) + "\n", "utf8");
console.log(JSON.stringify(summary, null, 2));
