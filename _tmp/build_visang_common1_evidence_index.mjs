import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportsDir = path.join(root, "archive", "textbook", "generated", "reports");
const targetIssues = new Set(["solution_missing", "answer_missing", "content_mojibake_or_ocr_suspected"]);

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function existsRel(relPath) {
  if (!relPath) return false;
  return fs.existsSync(path.join(root, relPath));
}

function latestWorklist() {
  const files = fs.readdirSync(reportsDir)
    .filter((name) => /^visang_common1_gpt_worklist_.*\.json$/.test(name))
    .map((name) => path.join(reportsDir, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (!files.length) throw new Error("No visang_common1_gpt_worklist JSON found");
  return files[0];
}

function kindFromTargetFile(targetFile) {
  if (targetFile.includes("/workbook/") || targetFile.includes("\\workbook\\")) return "workbook";
  return "textbook";
}

function loadQuestion(targetFile, id) {
  const abs = path.join(root, targetFile);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(abs, "utf8"), sandbox, { filename: abs, timeout: 5000 });
  const q = sandbox.window.questionBank.find((item) => item.id === id);
  if (!q) throw new Error(`Question ${id} not found in ${targetFile}`);
  return q;
}

function normalizeEvidencePath(p) {
  if (!p) return "";
  const normalized = p.replaceAll("\\", "/");
  if (normalized.startsWith("archive/textbook/")) return normalized;
  if (normalized.startsWith("generated/")) return `archive/textbook/${normalized}`;
  return normalized;
}

function pageCropPath(item) {
  const kind = kindFromTargetFile(item.targetFile);
  if (!item.pageNo) return "";
  return `archive/textbook/generated/work/page_crops/${kind}/${item.setKey}/page${item.pageNo}.png`;
}

const worklistPath = latestWorklist();
const worklist = JSON.parse(fs.readFileSync(worklistPath, "utf8"));
const filtered = worklist.items.filter((item) => item.issueTypes.some((type) => targetIssues.has(type)));

const rows = filtered.map((item) => {
  const q = loadQuestion(item.targetFile, item.id);
  const sourceCropPath = normalizeEvidencePath(item.evidence?.sourceCropPath ?? "");
  const reviewCropPath = normalizeEvidencePath(item.evidence?.cropImagePath ?? "");
  const fullPageCropPath = pageCropPath(item);
  const imageAssetPath = q.image ? `archive/textbook/generated/${q.image}` : "";
  const requestedIssueTypes = item.issueTypes.filter((type) => targetIssues.has(type));
  return {
    targetFile: item.targetFile,
    setKey: item.setKey,
    kind: kindFromTargetFile(item.targetFile),
    id: item.id,
    displayNo: item.displayNo,
    pageNo: item.pageNo,
    issueTypes: requestedIssueTypes,
    allIssueTypes: item.issueTypes,
    answer: q.answer ?? "",
    solutionPresent: Boolean(String(q.solution ?? "").trim()),
    contentPreview: item.contentPreview,
    fullPageCropPath,
    fullPageCropExists: existsRel(fullPageCropPath),
    questionCropPath: sourceCropPath,
    questionCropExists: existsRel(sourceCropPath),
    reviewPackCropPath: reviewCropPath,
    reviewPackCropExists: existsRel(reviewCropPath),
    imageAssetPath,
    imageAssetExists: imageAssetPath ? existsRel(imageAssetPath) : null,
  };
});

const byIssue = {};
for (const type of targetIssues) {
  const issueRows = rows.filter((row) => row.issueTypes.includes(type));
  byIssue[type] = {
    items: issueRows.length,
    missingFullPageCrops: issueRows.filter((row) => !row.fullPageCropExists).length,
    missingQuestionCrops: issueRows.filter((row) => !row.questionCropExists).length,
    withImageAssets: issueRows.filter((row) => row.imageAssetPath).length,
    missingImageAssets: issueRows.filter((row) => row.imageAssetPath && !row.imageAssetExists).length,
  };
}

const byFile = [];
const fileMap = new Map();
for (const row of rows) {
  const bucket = fileMap.get(row.targetFile) ?? {
    targetFile: row.targetFile,
    setKey: row.setKey,
    kind: row.kind,
    items: 0,
    issueTypeCounts: {},
    pageCropPaths: new Set(),
    questionCropMissing: 0,
    fullPageCropMissing: 0,
  };
  bucket.items += 1;
  for (const type of row.issueTypes) bucket.issueTypeCounts[type] = (bucket.issueTypeCounts[type] ?? 0) + 1;
  if (row.fullPageCropPath) bucket.pageCropPaths.add(row.fullPageCropPath);
  if (!row.questionCropExists) bucket.questionCropMissing += 1;
  if (!row.fullPageCropExists) bucket.fullPageCropMissing += 1;
  fileMap.set(row.targetFile, bucket);
}
for (const bucket of fileMap.values()) {
  byFile.push({ ...bucket, pageCropPaths: [...bucket.pageCropPaths].sort() });
}

const generatedAt = new Date().toISOString();
const stamp = generatedAt.replaceAll(/[-:T.Z]/g, "").slice(0, 14);
const outJson = `archive/textbook/generated/reports/visang_common1_evidence_index_${stamp}.json`;
const outMd = `archive/textbook/generated/reports/visang_common1_evidence_index_${stamp}.md`;

const summary = {
  generatedAt,
  sourceWorklist: rel(worklistPath),
  requestedIssueTypes: [...targetIssues],
  uniqueItems: rows.length,
  byIssue,
  byFile,
  missing: {
    fullPageCropItems: rows.filter((row) => !row.fullPageCropExists),
    questionCropItems: rows.filter((row) => !row.questionCropExists),
    reviewPackCropItems: rows.filter((row) => !row.reviewPackCropExists),
    imageAssetItems: rows.filter((row) => row.imageAssetPath && !row.imageAssetExists),
  },
  rows,
};

fs.writeFileSync(path.join(root, outJson), JSON.stringify(summary, null, 2), "utf8");

const md = [
  "# 비상 공통수학1 잔여 이슈 증거 인덱스",
  "",
  `- 생성: ${generatedAt}`,
  `- 원본 worklist: ${summary.sourceWorklist}`,
  `- 대상 이슈: ${[...targetIssues].join(", ")}`,
  `- 고유 문항: ${rows.length}`,
  "",
  "## 이슈별 현황",
  "",
  "| issue | items | missing full-page | missing question crop | with image asset | missing image asset |",
  "|---|---:|---:|---:|---:|---:|",
  ...Object.entries(byIssue).map(([type, c]) =>
    `| ${type} | ${c.items} | ${c.missingFullPageCrops} | ${c.missingQuestionCrops} | ${c.withImageAssets} | ${c.missingImageAssets} |`
  ),
  "",
  "## 파일별 풀페이지 crop",
  "",
  ...byFile.flatMap((file) => [
    `### ${file.setKey}`,
    `- JS: ${file.targetFile}`,
    `- 문항: ${file.items}`,
    `- 이슈: ${Object.entries(file.issueTypeCounts).map(([k, v]) => `${k} ${v}`).join(", ")}`,
    `- 풀페이지 crop 누락: ${file.fullPageCropMissing}`,
    `- 문항 crop 누락: ${file.questionCropMissing}`,
    "- 풀페이지:",
    ...file.pageCropPaths.map((p) => `  - ${p}`),
    "",
  ]),
  "## 문항별 증거",
  "",
  "| set | no | issues | page | full-page crop | question crop | asset |",
  "|---|---:|---|---:|---|---|---|",
  ...rows.map((row) => [
    row.setKey,
    row.displayNo,
    row.issueTypes.join(", "),
    row.pageNo ?? "",
    row.fullPageCropExists ? row.fullPageCropPath : `MISSING: ${row.fullPageCropPath}`,
    row.questionCropExists ? row.questionCropPath : `MISSING: ${row.questionCropPath}`,
    row.imageAssetPath ? (row.imageAssetExists ? row.imageAssetPath : `MISSING: ${row.imageAssetPath}`) : "",
  ].map((cell) => String(cell).replaceAll("|", "\\|")).join(" | ")).map((line) => `| ${line} |`),
  "",
].join("\n");

fs.writeFileSync(path.join(root, outMd), md, "utf8");
console.log(JSON.stringify({ outJson, outMd, uniqueItems: rows.length, byIssue, missing: {
  fullPageCropItems: summary.missing.fullPageCropItems.length,
  questionCropItems: summary.missing.questionCropItems.length,
  reviewPackCropItems: summary.missing.reviewPackCropItems.length,
  imageAssetItems: summary.missing.imageAssetItems.length,
}}, null, 2));
