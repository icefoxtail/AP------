import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const generated = path.join(root, "archive", "textbook", "generated");
const jsRoot = path.join(generated, "js");
const outDir = path.join(generated, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `visang_asset_audit_${stamp}.json`);
const outMd = path.join(outDir, `visang_asset_audit_${stamp}.md`);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

function countImages(dir) {
  if (!fs.existsSync(dir)) return { exists: false, count: 0, zeroByte: [] };
  const files = walk(dir).filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
  return {
    exists: true,
    count: files.length,
    zeroByte: files.filter((file) => fs.statSync(file).size === 0).map((file) => rel(file)),
  };
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

const jsFiles = walk(jsRoot).filter((file) => file.endsWith(".js") && path.basename(file).includes("비상")).sort();
const rows = [];
const issues = [];

for (const jsFile of jsFiles) {
  const kind = rel(jsFile).includes("/workbook/") ? "workbook" : "textbook";
  const setName = path.basename(jsFile, ".js");
  const dirs = {
    js: jsFile,
    assets: path.join(generated, "assets", kind, setName),
    questionCrops: path.join(generated, "work", "question_crops", kind, setName),
    pageCrops: path.join(generated, "work", "page_crops", kind, setName),
    renderedPages: path.join(generated, "work", "rendered_pages", kind, setName),
    reviewPack: path.join(generated, "review_pack", setName),
  };
  const row = {
    setName,
    kind,
    jsFile: rel(jsFile),
    assets: countImages(dirs.assets),
    questionCrops: countImages(dirs.questionCrops),
    pageCrops: countImages(dirs.pageCrops),
    renderedPages: countImages(dirs.renderedPages),
    reviewPackExists: fs.existsSync(dirs.reviewPack),
  };
  rows.push(row);
  for (const key of ["questionCrops", "pageCrops"]) {
    if (!row[key].exists || row[key].count === 0) {
      issues.push({ setName, kind, issueType: `${key}_missing`, evidence: rel(dirs[key]) });
    }
    for (const zero of row[key].zeroByte) {
      issues.push({ setName, kind, issueType: `${key}_zero_byte`, evidence: zero });
    }
  }
  if (!row.renderedPages.exists || row.renderedPages.count === 0) {
    issues.push({ setName, kind, issueType: "rendered_full_pages_missing", evidence: rel(dirs.renderedPages) });
  }
  if (!row.reviewPackExists) {
    issues.push({ setName, kind, issueType: "review_pack_missing", evidence: rel(dirs.reviewPack) });
  }
}

const report = { generatedAt: new Date().toISOString(), filesChecked: jsFiles.length, rows, issues };
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");
const lines = [
  "# Visang Asset Audit",
  "",
  `- Generated: ${report.generatedAt}`,
  `- JS files checked: ${jsFiles.length}`,
  `- Issues: ${issues.length}`,
  "",
  "## Rows",
  "",
  "| Set | Kind | Assets | Question crops | Page crops | Rendered full pages | Review pack |",
  "| --- | --- | ---: | ---: | ---: | ---: | --- |",
  ...rows.map((row) => `| ${row.setName} | ${row.kind} | ${row.assets.count} | ${row.questionCrops.count} | ${row.pageCrops.count} | ${row.renderedPages.count} | ${row.reviewPackExists ? "yes" : "no"} |`),
  "",
  "## Issues",
  "",
  ...issues.map((issue) => `- ${issue.setName} [${issue.issueType}] ${issue.evidence}`),
];
fs.writeFileSync(outMd, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ outJson: rel(outJson), outMd: rel(outMd), filesChecked: jsFiles.length, issues: issues.length }, null, 2));
