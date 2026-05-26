import fs from "node:fs";
import path from "node:path";

export async function detectPdfFiles(workspaceRoot) {
  const entries = await fs.promises.readdir(workspaceRoot, { withFileTypes: true });
  const pdfs = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".pdf")) continue;
    const full = path.join(workspaceRoot, entry.name);
    const stat = await fs.promises.stat(full);
    pdfs.push({ file: full, name: entry.name, size: stat.size });
  }
  pdfs.sort((a, b) => b.size - a.size);
  return pdfs;
}

