import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanJsBank, writeJsBankInventory, walkFiles, parseArgs } from "./scan-js-bank.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function existingAssetRoots() {
  return [
    path.join(ROOT_DIR, "archive", "assets", "images"),
    path.join(ROOT_DIR, "assets", "images"),
  ].filter((dir) => fs.existsSync(dir));
}

function normalizeReference(ref) {
  const clean = String(ref ?? "").replace(/^\.?\//, "").replaceAll("\\", "/");
  if (clean.startsWith("archive/")) return clean;
  if (clean.startsWith("assets/images/")) return `archive/${clean}`;
  return clean;
}

function collectReferences(jsInventory) {
  const references = [];
  for (const file of jsInventory.files) {
    for (const question of file.questions) {
      if (question.image) {
        references.push({
          sourceFile: file.relativePath,
          questionId: question.questionId,
          kind: "image",
          path: question.image,
          normalizedPath: normalizeReference(question.image),
        });
      }
      for (const src of question.contentImgSrcs) {
        references.push({
          sourceFile: file.relativePath,
          questionId: question.questionId,
          kind: "content-img",
          path: src,
          normalizedPath: normalizeReference(src),
        });
      }
    }
  }
  return references;
}

export function scanImageAssets(options = parseArgs()) {
  const jsInventory = scanJsBank(options);
  writeJsBankInventory(jsInventory);
  const roots = existingAssetRoots();
  const assets = roots.flatMap((root) => walkFiles(root, (filePath) => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())))
    .map((filePath) => ({
      projectPath: toPosix(path.relative(ROOT_DIR, filePath)),
      root: toPosix(path.relative(ROOT_DIR, roots.find((root) => filePath.startsWith(root)) ?? ROOT_DIR)),
      bytes: fs.statSync(filePath).size,
    }));
  const assetSet = new Set(assets.map((asset) => asset.projectPath));
  const references = collectReferences(jsInventory);
  const referencedSet = new Set(references.map((ref) => ref.normalizedPath));

  const missing = references.filter((ref) => !assetSet.has(ref.normalizedPath));
  const isFiltered = Boolean(options.limit || options.grade || options.source);
  const orphan = isFiltered ? [] : assets.filter((asset) => !referencedSet.has(asset.projectPath));
  const tagWarnings = [];
  for (const file of jsInventory.files) {
    for (const question of file.questions) {
      const hasVisual = question.hasImageField || question.contentHasImg || question.contentHasSvg || question.contentHasTable;
      const tags = question.tags.join(" ");
      const hasVisualTag = /도형|그래프|표|공통자료/.test(tags);
      if (question.hasImageField && !hasVisualTag) {
        tagWarnings.push({
          sourceFile: file.relativePath,
          questionId: question.questionId,
          type: "image-without-visual-tag",
          tags: question.tags,
        });
      }
      if (hasVisual && question.tags.length === 0) {
        tagWarnings.push({
          sourceFile: file.relativePath,
          questionId: question.questionId,
          type: "visual-content-empty-tags",
          visual: {
            image: question.hasImageField,
            contentImg: question.contentHasImg,
            svg: question.contentHasSvg,
            table: question.contentHasTable,
          },
        });
      }
      if (question.hasImageField && question.contentHasImg) {
        tagWarnings.push({
          sourceFile: file.relativePath,
          questionId: question.questionId,
          type: "image-field-and-content-img",
          image: question.image,
          contentImgSrcs: question.contentImgSrcs,
        });
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    source: "archive/assets/images + assets/images",
    filters: jsInventory.filters,
    totals: {
      assetRoots: roots.length,
      imageAssets: assets.length,
      imageReferences: references.length,
      missingImages: missing.length,
      orphanImages: orphan.length,
      imageTagWarnings: tagWarnings.length,
    },
    orphanScope: isFiltered ? "skipped-filtered-run" : "full-scan",
    orphanAnalysisSkippedReason: isFiltered ? "Orphan image detection requires an unfiltered full JS-bank scan." : "",
    roots: roots.map((root) => toPosix(path.relative(ROOT_DIR, root))),
    assets,
    references,
    missing,
    orphan,
    tagWarnings,
  };
}

export function writeImageReports(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "image-asset-inventory.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "missing-image-report.json"), `${JSON.stringify(report.missing, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "orphan-image-report.json"), `${JSON.stringify(report.orphan, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "image-tag-warning-report.json"), `${JSON.stringify(report.tagWarnings, null, 2)}\n`, "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = scanImageAssets();
  writeImageReports(report);
  console.log(`Scanned ${report.totals.imageAssets} image assets and ${report.totals.imageReferences} references.`);
}
