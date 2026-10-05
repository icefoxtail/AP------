import fs from "node:fs";
import path from "node:path";
import { zipDirectory } from "../lib/zip-utils.mjs";

const workspaceRoot = process.cwd();
const generatedRoot = path.join(workspaceRoot, "generated");
const outRoot = path.join(generatedRoot, "review_pack", "gpt_by_unit");

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function exists(file) {
  try {
    await fs.promises.access(file);
    return true;
  } catch {
    return false;
  }
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.promises.copyFile(src, dest);
}

async function copyDirFiles(srcDir, destDir, filter = () => true) {
  if (!(await exists(srcDir))) return 0;
  let copied = 0;
  for (const dirent of await fs.promises.readdir(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, dirent.name);
    const dest = path.join(destDir, dirent.name);
    if (dirent.isDirectory()) {
      copied += await copyDirFiles(src, dest, filter);
    } else if (dirent.isFile() && filter(src)) {
      await copyFile(src, dest);
      copied += 1;
    }
  }
  return copied;
}

async function listFiles(root, filter = () => true) {
  if (!(await exists(root))) return [];
  const files = [];
  async function walk(dir) {
    for (const dirent of await fs.promises.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, dirent.name);
      if (dirent.isDirectory()) await walk(file);
      else if (dirent.isFile() && filter(file)) files.push(file);
    }
  }
  await walk(root);
  return files;
}

function rel(target) {
  return path.relative(workspaceRoot, target).replaceAll("\\", "/");
}

function safeName(value) {
  return String(value).replace(/[\\/:*?"<>|]/g, "_");
}

function unitFromSetKey(setKey) {
  const parts = setKey.split("_").filter(Boolean);
  if (setKey.startsWith("RPM_") && parts.length >= 4) return parts[3];
  if (setKey.startsWith("LIGHTSSEN_")) return parts[3] || "전체";
  if (parts.length >= 3) return parts[2];
  return "전체";
}

function unitKeyFromSetKey(setKey) {
  return safeName(unitFromSetKey(setKey));
}

async function copyPageImages(setKey, packDir) {
  const roots = [
    path.join(generatedRoot, "work", "rendered_pages"),
    path.join(generatedRoot, "work", "page_crops"),
  ];
  let copied = 0;
  for (const root of roots) {
    const matches = await listFiles(root, (file) => {
      const normalized = file.replaceAll("\\", "/");
      return normalized.includes(`/${setKey}/`) && file.toLowerCase().endsWith(".png");
    });
    for (const src of matches) {
      const dest = path.join(packDir, "page_full_images", setKey, path.basename(src).replace(/^page_?/, "p"));
      await copyFile(src, dest);
      copied += 1;
    }
  }
  return copied;
}

async function copyVisualAssets(setKey, packDir) {
  const roots = [
    path.join(generatedRoot, "assets"),
    path.join(generatedRoot, "final_clean", "archiveCompatible", "assets"),
  ];
  let copied = 0;
  for (const root of roots) {
    const matches = await listFiles(root, (file) => {
      const normalized = file.replaceAll("\\", "/");
      return normalized.includes(`/${setKey}/`) && file.toLowerCase().endsWith(".png");
    });
    for (const src of matches) {
      const dest = path.join(packDir, "visual_asset_images", setKey, path.basename(src));
      await copyFile(src, dest);
      copied += 1;
    }
  }
  return copied;
}

async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.promises.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  if (!(await exists(generatedRoot))) {
    throw new Error(`generated folder not found under ${workspaceRoot}`);
  }
  await fs.promises.rm(outRoot, { recursive: true, force: true });
  await ensureDir(outRoot);

  const jsFiles = await listFiles(path.join(generatedRoot, "js"), (file) => file.endsWith(".js"));
  const byUnit = new Map();
  for (const jsFile of jsFiles) {
    const setKey = path.basename(jsFile, ".js");
    const unitKey = unitKeyFromSetKey(setKey);
    if (!byUnit.has(unitKey)) byUnit.set(unitKey, []);
    byUnit.get(unitKey).push({ setKey, jsFile });
  }

  const packs = [];
  for (const [unitKey, entries] of [...byUnit.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko"))) {
    const packDir = path.join(outRoot, unitKey);
    await ensureDir(packDir);
    let jsCount = 0;
    let pageFullImageCount = 0;
    let visualAssetCount = 0;
    for (const entry of entries.sort((a, b) => a.setKey.localeCompare(b.setKey, "ko"))) {
      await copyFile(entry.jsFile, path.join(packDir, "js", path.basename(entry.jsFile)));
      jsCount += 1;
      pageFullImageCount += await copyPageImages(entry.setKey, packDir);
      visualAssetCount += await copyVisualAssets(entry.setKey, packDir);
    }
    const zipPath = path.join(outRoot, `${unitKey}_gpt.zip`);
    const zipResult = await zipDirectory(packDir, zipPath);
    packs.push({
      unitKey,
      setCount: entries.length,
      jsCount,
      pageFullImageCount,
      visualAssetCount,
      packDir: rel(packDir),
      zipPath: rel(zipPath),
      zipFileCount: zipResult.fileCount,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    purpose: "Minimal GPT handoff zips: js, full page images, and visual asset images only.",
    packCount: packs.length,
    packs,
    status: packs.length ? "ok" : "empty",
  };
  await writeJson(path.join(generatedRoot, "reports", "gpt_unit_pack_report.json"), report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
