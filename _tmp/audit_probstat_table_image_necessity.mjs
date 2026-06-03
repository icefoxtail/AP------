import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "archive", "textbook", "reports");
const qualityReport = path.join(reportDir, fs.readdirSync(reportDir).filter((f) => f.startsWith("archive_asset_image_quality_") && f.endsWith(".json")).sort().at(-1));
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const out = path.join(reportDir, `probstat_table_image_necessity_${stamp}.json`);

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

function imageToAssetRel(image) {
  const s = String(image || "").replaceAll("\\", "/");
  if (!s) return "";
  return s.startsWith("archive/") ? s : `archive/${s}`;
}

function hasHtmlTable(text) {
  return /<\s*table\b|<\s*tr\b|<\s*td\b|<\s*th\b/i.test(String(text || ""));
}

function hasTableHint(text) {
  return /표|도수분포|분포표|확률분포|상대도수|자료|계급|히스토그램|막대그래프|그래프|그림|보기|다음\s*자료|table|figure/i.test(String(text || ""));
}

function hasStrongTableHint(text) {
  return /표|도수분포|분포표|확률분포|상대도수|계급|table/i.test(String(text || ""));
}

const quality = JSON.parse(fs.readFileSync(qualityReport, "utf8"));
const qualityMap = new Map();
for (const row of quality.worstProbabilityStatisticsImages || []) {
  qualityMap.set(row.path, row);
}

const jsFiles = [
  ...walk(path.join(root, "archive", "exams")),
  ...walk(path.join(root, "archive", "_generated", "past-exams", "high_h2_probability_statistics_all_terms")),
]
  .filter((file) => file.endsWith(".js"))
  .filter((file) => rel(file).includes("확률과통계"));

const seen = new Set();
const items = [];

for (const file of jsFiles) {
  let bank;
  try {
    bank = parseBank(file);
  } catch {
    continue;
  }
  for (const q of bank) {
    if (!q.image) continue;
    const asset = imageToAssetRel(q.image);
    if (!asset.includes("archive/assets/images/") || !asset.includes("확률과통계")) continue;
    const key = `${asset}#${rel(file)}#${q.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const content = String(q.content || "");
    const qrow = qualityMap.get(asset) || {};
    const tableHtml = hasHtmlTable(content);
    const tableHint = hasTableHint(content);
    const strongTableHint = hasStrongTableHint(content);
    const score = qrow.score || 0;
    let bucket = "keep_or_review";
    if (tableHtml && score >= 40) bucket = "html_table_present_image_maybe_redundant";
    else if (strongTableHint && !tableHtml) bucket = "table_hint_without_html_table_keep_image";
    else if (tableHint && !tableHtml) bucket = "visual_hint_without_html_table_keep_or_recrop";
    else if (!tableHint && score >= 40) bucket = "no_visual_hint_bad_crop_redundant_candidate";
    else if (!tableHint) bucket = "no_visual_hint_redundant_candidate";
    items.push({
      bucket,
      asset,
      js: rel(file),
      id: q.id ?? null,
      image: q.image,
      qualityScore: score,
      width: qrow.width ?? null,
      height: qrow.height ?? null,
      flags: qrow.flags || [],
      hasHtmlTable: tableHtml,
      hasTableHint: tableHint,
      hasStrongTableHint: strongTableHint,
      contentPreview: content.slice(0, 300),
    });
  }
}

const bucketCounts = items.reduce((acc, item) => {
  acc[item.bucket] = (acc[item.bucket] || 0) + 1;
  return acc;
}, {});

const byAsset = new Map();
for (const item of items) {
  if (!byAsset.has(item.asset)) byAsset.set(item.asset, []);
  byAsset.get(item.asset).push(item);
}

const report = {
  generatedAt: new Date().toISOString(),
  qualityReport: rel(qualityReport),
  checkedImageRefs: items.length,
  uniqueAssets: byAsset.size,
  bucketCounts,
  htmlTablePresentImageMaybeRedundant: items.filter((item) => item.bucket === "html_table_present_image_maybe_redundant"),
  tableHintWithoutHtmlTableKeepImage: items.filter((item) => item.bucket === "table_hint_without_html_table_keep_image"),
  visualHintWithoutHtmlTableKeepOrRecrop: items.filter((item) => item.bucket === "visual_hint_without_html_table_keep_or_recrop"),
  noVisualHintRedundantCandidate: items.filter((item) => item.bucket.includes("redundant_candidate")),
  items,
};

fs.writeFileSync(out, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({
  out: rel(out),
  checkedImageRefs: report.checkedImageRefs,
  uniqueAssets: report.uniqueAssets,
  bucketCounts,
}, null, 2));
