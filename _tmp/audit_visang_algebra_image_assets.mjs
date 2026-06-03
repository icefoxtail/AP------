import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";

const root = process.cwd();
const bookRoot = path.join(root, "archive", "textbook", "_비상교육_고등_대수_교과서");
const generatedRoot = path.join(bookRoot, "generated");
const jsRoot = path.join(generatedRoot, "js");
const archiveImageRoot = path.join(root, "archive", "assets", "images");
const outDir = path.join(generatedRoot, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `visang_algebra_image_asset_audit_${stamp}.json`);
const outMd = path.join(outDir, `visang_algebra_image_asset_audit_${stamp}.md`);

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

function parseBank(jsFile) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(jsFile, "utf8"), sandbox, { filename: jsFile, timeout: 5000 });
  if (!Array.isArray(sandbox.window.questionBank)) throw new Error(`questionBank not array: ${jsFile}`);
  return sandbox.window.questionBank;
}

function imageCandidates(imagePath) {
  if (!imagePath) return [];
  const normalized = imagePath.replaceAll("/", path.sep);
  return [
    path.join(root, normalized),
    path.join(generatedRoot, normalized),
    path.join(bookRoot, normalized),
    path.join(root, "archive", "textbook", normalized),
  ];
}

function pngInfo(absPath) {
  const buf = fs.readFileSync(absPath);
  if (buf.length < 24 || buf.toString("ascii", 1, 4) !== "PNG") {
    return { bytes: buf.length, isPng: false, width: null, height: null };
  }
  return {
    bytes: buf.length,
    isPng: true,
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function pythonQuality(absPath) {
  const script = [
    "from PIL import Image, ImageStat",
    "import sys, json",
    "im=Image.open(sys.argv[1]).convert('RGB')",
    "w,h=im.size",
    "stat=ImageStat.Stat(im)",
    "mean=sum(stat.mean)/3",
    "std=sum(stat.stddev)/3",
    "hist=im.convert('L').histogram()",
    "n=w*h",
    "white=sum(hist[245:])/n",
    "black=sum(hist[:20])/n",
    "print(json.dumps({'mean':mean,'stddev':std,'whiteRatio':white,'blackRatio':black}, ensure_ascii=False))",
  ].join("\n");
  try {
    return JSON.parse(execFileSync("python", ["-c", script, absPath], { encoding: "utf8" }));
  } catch (error) {
    return { error: String(error.message || error) };
  }
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const jsFiles = walk(jsRoot).filter((file) => file.endsWith(".js")).sort();
const rows = [];

for (const jsFile of jsFiles) {
  const kind = path.basename(path.dirname(jsFile));
  const setKey = path.basename(jsFile, ".js");
  const bank = parseBank(jsFile);
  for (const item of bank) {
    if (!item.image) continue;
    const expectedPrefix = `assets/${kind}/${setKey}/`;
    const expectedFilename = `q${String(item.id).padStart(3, "0")}.png`;
    const resolved = imageCandidates(item.image).find((candidate) => fs.existsSync(candidate));
    const targetPath = path.join(archiveImageRoot, setKey, path.basename(item.image));
    const issues = [];
    let info = null;
    let quality = null;

    if (!resolved) {
      issues.push("missing_file");
    } else {
      info = pngInfo(resolved);
      if (!info.isPng) issues.push("not_png");
      if (info.width < 80 || info.height < 40) issues.push("tiny_image");
      if (info.bytes < 1000) issues.push("small_file");
      quality = pythonQuality(resolved);
      if (!quality.error) {
        if (quality.stddev < 8) issues.push("low_contrast_or_blank");
        if (quality.whiteRatio > 0.985 && quality.stddev < 18) issues.push("mostly_blank_white");
      }
    }

    if (!item.image.startsWith(expectedPrefix)) issues.push("unexpected_prefix");
    if (path.basename(item.image) !== expectedFilename) issues.push("filename_id_mismatch");
    if (fs.existsSync(targetPath) && resolved && sha256(targetPath) !== sha256(resolved)) {
      issues.push("target_collision_different_file");
    }

    rows.push({
      jsFile: rel(jsFile),
      kind,
      setKey,
      id: item.id,
      image: item.image,
      expectedPrefix,
      expectedFilename,
      resolvedPath: resolved ? rel(resolved) : null,
      targetPath: rel(targetPath),
      targetExists: fs.existsSync(targetPath),
      info,
      quality,
      issues,
    });
  }
}

const issueRows = rows.filter((row) => row.issues.length);
const bySet = Object.values(rows.reduce((acc, row) => {
  acc[row.setKey] ??= { setKey: row.setKey, kind: row.kind, imageRefs: 0, issueRefs: 0, missing: 0, targetExists: 0 };
  acc[row.setKey].imageRefs += 1;
  if (row.issues.length) acc[row.setKey].issueRefs += 1;
  if (row.issues.includes("missing_file")) acc[row.setKey].missing += 1;
  if (row.targetExists) acc[row.setKey].targetExists += 1;
  return acc;
}, {})).sort((a, b) => a.setKey.localeCompare(b.setKey, "ko"));

const report = {
  generatedAt: new Date().toISOString(),
  scope: "비상 대수 generated/js image refs",
  filesChecked: jsFiles.length,
  imageRefs: rows.length,
  issueRefs: issueRows.length,
  issueTypeCounts: issueRows.flatMap((row) => row.issues).reduce((acc, issue) => {
    acc[issue] = (acc[issue] || 0) + 1;
    return acc;
  }, {}),
  bySet,
  issueRows,
  rows,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");

const lines = [
  "# 비상 대수 이미지 에셋 검수",
  "",
  `- 검사 JS 파일: ${report.filesChecked}`,
  `- 이미지 참조: ${report.imageRefs}`,
  `- 문제 참조: ${report.issueRefs}`,
  `- 이슈 타입: ${JSON.stringify(report.issueTypeCounts)}`,
  "",
  "## 세트별 요약",
  "",
  "| 세트 | refs | issues | missing | target exists |",
  "|---|---:|---:|---:|---:|",
  ...bySet.map((set) => `| ${set.setKey} | ${set.imageRefs} | ${set.issueRefs} | ${set.missing} | ${set.targetExists} |`),
];

if (issueRows.length) {
  lines.push("", "## 문제 항목", "");
  for (const row of issueRows) lines.push(`- ${row.jsFile} #${row.id}: ${row.issues.join(", ")} / ${row.image}`);
}

fs.writeFileSync(outMd, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  outJson: rel(outJson),
  outMd: rel(outMd),
  filesChecked: report.filesChecked,
  imageRefs: report.imageRefs,
  issueRefs: report.issueRefs,
  issueTypeCounts: report.issueTypeCounts,
}, null, 2));
