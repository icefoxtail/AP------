import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const dir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const triageFile = path.join(dir, "visual_triage.json");
const triage = JSON.parse(fs.readFileSync(triageFile, "utf8"));
const cache = new Map();
const nonVisual = new Set();
for (const row of triage.rows.filter((item) => item.disposition === "ADD_NEW_VISUAL")) {
  let window = cache.get(row.sourceJsPath);
  if (!window) {
    const file = path.join(root, row.sourceJsPath);
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 5000 });
    window = context.window;
    cache.set(row.sourceJsPath, window);
  }
  const question = (window.questionBank || []).find((item) => Number(item.id) === row.id);
  const source = `${question?.content || ""}\n${question?.solution || ""}`;
  const factDependent = /(<svg|<table|그림|그래프가|그래프의|그래프와|좌표|점근선|교점|함수의 그래프)/u.test(source);
  if (!factDependent) nonVisual.add(row.questionUid);
}
for (const row of triage.rows) {
  if (nonVisual.has(row.questionUid)) {
    row.disposition = "NO_VISUAL";
    row.visualAdjudication = "VISUAL_OPTIONAL_NO_SOURCE_GRAPH_DEPENDENCY";
    row.v1Status = "NOT_REQUIRED";
    row.v2Status = "NOT_REQUIRED";
    row.v3Status = "NOT_REQUIRED";
  }
}
const counts = {};
for (const row of triage.rows) counts[row.disposition] = (counts[row.disposition] || 0) + 1;
triage.summary = { ...triage.summary, generatedAt: new Date().toISOString(), dispositionCounts: counts, candidateCount: counts.REBUILD_EXISTING + counts.ADD_NEW_VISUAL, refinedOptionalDropCount: nonVisual.size };
fs.writeFileSync(triageFile, JSON.stringify(triage, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ refinedOptionalDropCount: nonVisual.size, dispositionCounts: counts }));
