import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const generatedRoot = path.join(root, "archive", "textbook", "generated");
const jsRoot = path.join(generatedRoot, "js");
const outDir = path.join(generatedRoot, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `visang_common1_image_asset_audit_${stamp}.json`);
const outMd = path.join(outDir, `visang_common1_image_asset_audit_${stamp}.md`);

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
    "p=sys.argv[1]",
    "im=Image.open(p).convert('RGB')",
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

const jsFiles = walk(jsRoot)
  .filter((file) => file.endsWith(".js") && path.basename(file).includes("비상_공통수학1"))
  .sort((a, b) => rel(a).localeCompare(rel(b), "ko"));

const rows = [];
for (const jsFile of jsFiles) {
  const bank = parseBank(jsFile);
  const kind = jsFile.includes(`${path.sep}workbook${path.sep}`) ? "workbook" : "textbook";
  const setKey = path.basename(jsFile, ".js");
  for (const q of bank) {
    const image = String(q.image ?? "").trim();
    if (!image) continue;
    const candidates = imageCandidates(image);
    const existing = candidates.find((candidate) => fs.existsSync(candidate)) ?? "";
    const info = existing ? pngInfo(existing) : null;
    const quality = existing && info?.isPng ? pythonQuality(existing) : null;
    const expectedPrefix = `assets/${kind}/${setKey}/`;
    const expectedFilename = `q${String(q.id).padStart(3, "0")}.png`;
    const issues = [];
    if (!existing) issues.push("missing_file");
    if (!image.startsWith(expectedPrefix)) issues.push("unexpected_image_prefix");
    if (!image.endsWith(expectedFilename)) issues.push("unexpected_image_filename");
    if (info && !info.isPng) issues.push("not_png");
    if (info && (info.width < 80 || info.height < 40)) issues.push("tiny_image");
    if (info && info.bytes < 1000) issues.push("small_file");
    if (quality?.stddev !== undefined && quality.stddev < 8) issues.push("low_contrast_or_blank");
    if (quality?.whiteRatio !== undefined && quality.whiteRatio > 0.985) issues.push("mostly_blank_white");
    rows.push({
      jsFile: rel(jsFile),
      kind,
      setKey,
      id: q.id,
      displayNo: String(q.id).padStart(2, "0"),
      contentPreview: String(q.content ?? "").replace(/\s+/g, " ").slice(0, 160),
      image,
      expectedPrefix,
      expectedFilename,
      resolvedPath: existing ? rel(existing) : "",
      exists: Boolean(existing),
      info,
      quality,
      issues,
    });
  }
}

const issueRows = rows.filter((row) => row.issues.length);
const issueTypeCounts = issueRows.flatMap((row) => row.issues).reduce((acc, issue) => {
  acc[issue] = (acc[issue] ?? 0) + 1;
  return acc;
}, {});

const bySet = [];
const setMap = new Map();
for (const row of rows) {
  const bucket = setMap.get(row.setKey) ?? {
    setKey: row.setKey,
    kind: row.kind,
    imageRefs: 0,
    issueRefs: 0,
    missing: 0,
    paths: [],
  };
  bucket.imageRefs += 1;
  if (row.issues.length) bucket.issueRefs += 1;
  if (!row.exists) bucket.missing += 1;
  bucket.paths.push(row.image);
  setMap.set(row.setKey, bucket);
}
for (const bucket of setMap.values()) {
  bySet.push(bucket);
}

const report = {
  generatedAt: new Date().toISOString(),
  scope: "비상 공통수학1 generated/js image refs",
  filesChecked: jsFiles.length,
  imageRefs: rows.length,
  issueRefs: issueRows.length,
  issueTypeCounts,
  bySet,
  issueRows,
  rows,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");

const md = [
  "# 비상 공통수학1 이미지 에셋 검수",
  "",
  `- 생성: ${report.generatedAt}`,
  `- JS 파일: ${report.filesChecked}`,
  `- image 참조: ${report.imageRefs}`,
  `- 문제 참조: ${report.issueRefs}`,
  "",
  "## 이슈 카운트",
  "",
  ...Object.entries(issueTypeCounts).sort((a, b) => b[1] - a[1]).map(([issue, count]) => `- ${issue}: ${count}`),
  ...(Object.keys(issueTypeCounts).length ? [] : ["- 없음"]),
  "",
  "## 세트별",
  "",
  "| setKey | kind | image refs | issue refs | missing |",
  "|---|---|---:|---:|---:|",
  ...bySet.map((set) => `| ${set.setKey} | ${set.kind} | ${set.imageRefs} | ${set.issueRefs} | ${set.missing} |`),
  "",
  "## 이슈 항목",
  "",
  "| setKey | no | image | resolved | size | quality | issues |",
  "|---|---:|---|---|---|---|---|",
  ...issueRows.map((row) => {
    const size = row.info ? `${row.info.width}x${row.info.height}, ${row.info.bytes}B` : "";
    const quality = row.quality?.stddev !== undefined
      ? `std=${row.quality.stddev.toFixed(1)}, white=${row.quality.whiteRatio.toFixed(3)}`
      : "";
    return `| ${row.setKey} | ${row.displayNo} | ${row.image} | ${row.resolvedPath} | ${size} | ${quality} | ${row.issues.join(", ")} |`;
  }),
  "",
].join("\n");

fs.writeFileSync(outMd, md, "utf8");

console.log(JSON.stringify({
  outJson: rel(outJson),
  outMd: rel(outMd),
  filesChecked: report.filesChecked,
  imageRefs: report.imageRefs,
  issueRefs: report.issueRefs,
  issueTypeCounts,
}, null, 2));
