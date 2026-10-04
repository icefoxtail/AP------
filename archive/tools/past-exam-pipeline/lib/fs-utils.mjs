import fs from "node:fs";
import path from "node:path";

export async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

export async function exists(target) {
  try {
    await fs.promises.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await fs.promises.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

export async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.promises.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function writeText(file, text) {
  await ensureDir(path.dirname(file));
  await fs.promises.writeFile(file, text, "utf8");
}

export async function listPdfFiles(root) {
  const out = [];
  if (!(await exists(root))) return out;
  async function walk(dir) {
    for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
        const stat = await fs.promises.stat(full);
        out.push({ file: full, name: entry.name, size: stat.size });
      }
    }
  }
  await walk(root);
  out.sort((a, b) => a.file.localeCompare(b.file, "ko"));
  return out;
}

export function rel(base, target) {
  return path.relative(base, target).replaceAll("\\", "/");
}
