import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "archive", "textbook", "reports");
const sourceReport = path.join(reportDir, "probstat_referenced_suspicious_crop_classification.json");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outReport = path.join(reportDir, `probstat_useless_image_tag_asset_removal_${stamp}.json`);

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function parseJs(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file, timeout: 5000 });
  return {
    examTitle: sandbox.window.examTitle || "",
    questionBank: Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [],
  };
}

function writeJs(file, examTitle, questionBank) {
  fs.writeFileSync(
    file,
    [
      `window.examTitle = ${JSON.stringify(examTitle)};`,
      "",
      `window.questionBank = ${JSON.stringify(questionBank, null, 2)};`,
      "",
    ].join("\n"),
    "utf8"
  );
}

function assetMatchesImage(assetRel, image) {
  const normalized = String(image || "").replaceAll("\\", "/");
  if (!normalized) return false;
  const assetNoArchive = assetRel.startsWith("archive/") ? assetRel.slice("archive/".length) : assetRel;
  return normalized === assetRel || normalized === assetNoArchive || normalized.endsWith(assetNoArchive) || assetRel.endsWith(normalized);
}

const data = JSON.parse(fs.readFileSync(sourceReport, "utf8"));
const strongCandidates = data.items
  .filter((item) => item.bucket === "probable_unnecessary_text_or_noise_crop")
  .filter((item) => item.questionJs && item.asset)
  .sort((a, b) => a.asset.localeCompare(b.asset, "ko"));

const editsByJs = new Map();
for (const item of strongCandidates) {
  const jsFile = path.join(root, item.questionJs);
  if (!editsByJs.has(jsFile)) editsByJs.set(jsFile, []);
  editsByJs.get(jsFile).push(item);
}

const edited = [];
const skipped = [];

for (const [jsFile, items] of editsByJs.entries()) {
  if (!fs.existsSync(jsFile)) {
    for (const item of items) skipped.push({ ...item, reason: "js_missing" });
    continue;
  }
  let parsed;
  try {
    parsed = parseJs(jsFile);
  } catch (error) {
    for (const item of items) skipped.push({ ...item, reason: "js_parse_failed", error: error.message });
    continue;
  }
  let changed = false;
  for (const item of items) {
    const q = parsed.questionBank.find((question) => Number(question.id) === Number(item.q));
    if (!q) {
      skipped.push({ ...item, reason: "question_id_missing" });
      continue;
    }
    if (!assetMatchesImage(item.asset, q.image)) {
      skipped.push({ ...item, reason: "image_path_no_longer_matches", currentImage: q.image || "" });
      continue;
    }
    const beforeImage = q.image;
    q.image = "";
    changed = true;
    edited.push({
      asset: item.asset,
      js: item.questionJs,
      id: item.q,
      beforeImage,
      contentPreview: item.contentPreview,
      bucket: item.bucket,
      qualityScore: item.qualityScore,
      width: item.width,
      height: item.height,
    });
  }
  if (changed) writeJs(jsFile, parsed.examTitle, parsed.questionBank);
}

const deleted = [];
const deleteSkipped = [];
const editedAssetSet = new Set(edited.map((item) => item.asset));
for (const assetRel of editedAssetSet) {
  const file = path.join(root, assetRel);
  if (!fs.existsSync(file)) {
    deleteSkipped.push({ asset: assetRel, reason: "asset_missing" });
    continue;
  }
  fs.unlinkSync(file);
  deleted.push(assetRel);
}

const report = {
  generatedAt: new Date().toISOString(),
  sourceReport: rel(sourceReport),
  policy: "Removed only strong probable unnecessary text/noise crops: JS content has no image hint and asset quality/size is suspicious.",
  candidates: strongCandidates.length,
  imageTagsCleared: edited.length,
  assetFilesDeleted: deleted.length,
  skippedCount: skipped.length + deleteSkipped.length,
  edited,
  deleted,
  skipped,
  deleteSkipped,
};

fs.writeFileSync(outReport, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({
  out: rel(outReport),
  candidates: report.candidates,
  imageTagsCleared: report.imageTagsCleared,
  assetFilesDeleted: report.assetFilesDeleted,
  skippedCount: report.skippedCount,
}, null, 2));
