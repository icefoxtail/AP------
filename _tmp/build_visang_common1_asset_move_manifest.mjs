import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const root = process.cwd();
const generatedRoot = path.join(root, "archive", "textbook", "generated");
const jsRoot = path.join(generatedRoot, "js");
const archiveImageRoot = path.join(root, "archive", "assets", "images");
const outDir = path.join(generatedRoot, "reports");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
const outJson = path.join(outDir, `visang_common1_asset_move_manifest_${stamp}.json`);
const outMd = path.join(outDir, `visang_common1_asset_move_manifest_${stamp}.md`);

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
  const normalized = imagePath.replaceAll("/", path.sep);
  return [
    path.join(root, normalized),
    path.join(generatedRoot, normalized),
    path.join(root, "archive", "textbook", normalized),
  ];
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
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

const jsFiles = walk(jsRoot)
  .filter((file) => file.endsWith(".js") && path.basename(file).includes("비상_공통수학1"))
  .sort();

const entries = [];

for (const jsFile of jsFiles) {
  const bank = parseBank(jsFile);
  const setKey = path.basename(jsFile, ".js");
  for (const item of bank) {
    if (!item.image) continue;
    const source = imageCandidates(item.image).find((candidate) => fs.existsSync(candidate));
    const fileName = path.basename(item.image);
    const targetAbs = path.join(archiveImageRoot, setKey, fileName);
    const targetTag = `assets/images/${setKey}/${fileName}`;
    const targetExists = fs.existsSync(targetAbs);
    const sourceHash = source ? sha256(source) : null;
    const targetHash = targetExists ? sha256(targetAbs) : null;
    const issues = [];

    if (!source) issues.push("source_missing");
    if (!/^assets\/(textbook|workbook)\//.test(item.image)) issues.push("source_tag_unexpected");
    if (fileName !== `q${String(item.id).padStart(3, "0")}.png`) issues.push("filename_id_mismatch");
    if (targetExists && sourceHash !== targetHash) issues.push("target_collision_different_file");

    entries.push({
      jsFile: rel(jsFile),
      setKey,
      id: item.id,
      title: item.title || "",
      currentTag: item.image,
      sourcePath: source ? rel(source) : null,
      targetTag,
      targetPath: rel(targetAbs),
      targetExists,
      sameAsTarget: targetExists ? sourceHash === targetHash : null,
      sourceHash,
      targetHash,
      image: source ? pngInfo(source) : null,
      issues,
    });
  }
}

const issueEntries = entries.filter((entry) => entry.issues.length);
const existingTargets = entries.filter((entry) => entry.targetExists);
const sameExistingTargets = existingTargets.filter((entry) => entry.sameAsTarget);
const differentExistingTargets = existingTargets.filter((entry) => entry.sameAsTarget === false);
const bySet = Object.values(entries.reduce((acc, entry) => {
  acc[entry.setKey] ??= {
    setKey: entry.setKey,
    refs: 0,
    existingTargets: 0,
    differentExistingTargets: 0,
    issues: 0,
  };
  acc[entry.setKey].refs += 1;
  if (entry.targetExists) acc[entry.setKey].existingTargets += 1;
  if (entry.sameAsTarget === false) acc[entry.setKey].differentExistingTargets += 1;
  if (entry.issues.length) acc[entry.setKey].issues += 1;
  return acc;
}, {})).sort((a, b) => a.setKey.localeCompare(b.setKey, "ko"));

const report = {
  generatedAt: new Date().toISOString(),
  scope: "비상_공통수학1 generated assets -> archive/assets/images move preview",
  filesChecked: jsFiles.length,
  imageRefs: entries.length,
  issueRefs: issueEntries.length,
  existingTargetRefs: existingTargets.length,
  sameExistingTargetRefs: sameExistingTargets.length,
  differentExistingTargetRefs: differentExistingTargets.length,
  bySet,
  issueEntries,
  entries,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");

const lines = [
  "# 비상 공통수학1 이미지 에셋 이동 전 매핑 검수",
  "",
  `- 검사 JS 파일: ${report.filesChecked}`,
  `- 이미지 참조: ${report.imageRefs}`,
  `- 문제 참조: ${report.issueRefs}`,
  `- 기존 archive/assets/images 대상 존재: ${report.existingTargetRefs}`,
  `- 기존 대상과 동일 파일: ${report.sameExistingTargetRefs}`,
  `- 기존 대상과 다른 파일 충돌: ${report.differentExistingTargetRefs}`,
  "",
  "## 세트별 요약",
  "",
  "| 세트 | refs | target exists | different collisions | issues |",
  "|---|---:|---:|---:|---:|",
  ...bySet.map((set) => `| ${set.setKey} | ${set.refs} | ${set.existingTargets} | ${set.differentExistingTargets} | ${set.issues} |`),
  "",
  "## 이동 후 JS 태그 예시",
  "",
  ...entries.slice(0, 8).map((entry) => `- ${entry.currentTag} -> ${entry.targetTag}`),
];

if (issueEntries.length) {
  lines.push("", "## 문제 항목", "");
  for (const entry of issueEntries) {
    lines.push(`- ${entry.jsFile} #${entry.id}: ${entry.issues.join(", ")}`);
  }
}

fs.writeFileSync(outMd, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  outJson: rel(outJson),
  outMd: rel(outMd),
  filesChecked: report.filesChecked,
  imageRefs: report.imageRefs,
  issueRefs: report.issueRefs,
  existingTargetRefs: report.existingTargetRefs,
  differentExistingTargetRefs: report.differentExistingTargetRefs,
}, null, 2));
