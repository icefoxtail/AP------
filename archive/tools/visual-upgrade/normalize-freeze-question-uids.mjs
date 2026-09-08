import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const cache = new Map();
const loadTitle = (sourceJsPath) => {
  if (cache.has(sourceJsPath)) return cache.get(sourceJsPath);
  const file = path.join(root, sourceJsPath);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 5000 });
  cache.set(sourceJsPath, context.window.examTitle);
  return context.window.examTitle;
};

for (const fileName of fs.readdirSync(reportDir).filter((name) => /^solution_freeze_batch_\d+\.json$/.test(name))) {
  const file = path.join(reportDir, fileName);
  const report = JSON.parse(fs.readFileSync(file, "utf8"));
  const title = loadTitle(report.sourceJsPath);
  for (const row of report.rows || []) row.questionUid = `${title}::q${row.questionUid.split("::q").at(-1)}`;
  fs.writeFileSync(file, JSON.stringify(report, null, 2) + "\n", "utf8");
}
console.log("freeze questionUid normalization complete");
