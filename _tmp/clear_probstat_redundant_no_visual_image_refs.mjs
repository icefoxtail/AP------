import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "archive", "textbook", "reports");
const sourceReport = path.join(
  reportDir,
  fs
    .readdirSync(reportDir)
    .filter((file) => file.startsWith("probstat_table_image_necessity_") && file.endsWith(".json"))
    .sort()
    .at(-1)
);
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outReport = path.join(reportDir, `probstat_redundant_no_visual_image_cleanup_${stamp}.json`);

const jsRoots = [
  path.join(root, "archive", "exams"),
  path.join(root, "archive", "_generated", "past-exams", "high_h2_probability_statistics_all_terms"),
];

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
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
  return (
    normalized === assetRel ||
    normalized === assetNoArchive ||
    normalized.endsWith(assetNoArchive) ||
    assetRel.endsWith(normalized)
  );
}

function allCurrentImageRefs() {
  const refs = [];
  for (const file of jsRoots.flatMap(walk).filter((candidate) => candidate.endsWith(".js"))) {
    let parsed;
    try {
      parsed = parseJs(file);
    } catch {
      continue;
    }
    for (const q of parsed.questionBank) {
      if (q && q.image) refs.push({ file: rel(file), id: q.id ?? null, image: q.image });
    }
  }
  return refs;
}

const data = JSON.parse(fs.readFileSync(sourceReport, "utf8"));
const candidates = data.items
  .filter((item) => item.bucket === "no_visual_hint_redundant_candidate")
  .filter((item) => item.js && item.asset && item.image)
  .sort((a, b) => `${a.js}:${a.id}`.localeCompare(`${b.js}:${b.id}`, "ko"));

const editsByJs = new Map();
for (const item of candidates) {
  const jsFile = path.join(root, item.js);
  if (!editsByJs.has(jsFile)) editsByJs.set(jsFile, []);
  editsByJs.get(jsFile).push(item);
}

const cleared = [];
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
    const q = parsed.questionBank.find((question) => Number(question.id) === Number(item.id));
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
    cleared.push({
      asset: item.asset,
      js: item.js,
      id: item.id,
      beforeImage,
      qualityScore: item.qualityScore,
      width: item.width,
      height: item.height,
      contentPreview: item.contentPreview,
    });
  }

  if (changed) writeJs(jsFile, parsed.examTitle, parsed.questionBank);
}

const remainingRefs = allCurrentImageRefs();
const deleted = [];
const deleteSkipped = [];
for (const asset of [...new Set(cleared.map((item) => item.asset))].sort()) {
  const assetFile = path.join(root, asset);
  if (!fs.existsSync(assetFile)) {
    deleteSkipped.push({ asset, reason: "asset_missing" });
    continue;
  }
  const stillReferenced = remainingRefs.filter((ref) => assetMatchesImage(asset, ref.image));
  if (stillReferenced.length) {
    deleteSkipped.push({ asset, reason: "still_referenced", refs: stillReferenced.slice(0, 12), refCount: stillReferenced.length });
    continue;
  }
  fs.unlinkSync(assetFile);
  deleted.push(asset);
}

const report = {
  generatedAt: new Date().toISOString(),
  sourceReport: rel(sourceReport),
  policy:
    "Cleared image tags only for probability/statistics questions whose JS prompt has no HTML table and no table/figure/data hint. Deleted an asset file only when no JS image refs remained.",
  candidates: candidates.length,
  imageTagsCleared: cleared.length,
  assetFilesDeleted: deleted.length,
  skippedCount: skipped.length + deleteSkipped.length,
  cleared,
  deleted,
  skipped,
  deleteSkipped,
};

fs.writeFileSync(outReport, JSON.stringify(report, null, 2), "utf8");
console.log(
  JSON.stringify(
    {
      out: rel(outReport),
      candidates: report.candidates,
      imageTagsCleared: report.imageTagsCleared,
      assetFilesDeleted: report.assetFilesDeleted,
      skippedCount: report.skippedCount,
    },
    null,
    2
  )
);
