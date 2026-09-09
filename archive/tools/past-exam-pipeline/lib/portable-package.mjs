import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

function sha256Bytes(bytes) {
  return `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
}

function treeDigest(root) {
  const rows = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) rows.push({ path: path.relative(root, full).replaceAll("\\", "/"), sha256: sha256Bytes(fs.readFileSync(full)), bytes: fs.statSync(full).size });
    }
  }
  walk(root);
  rows.sort((a, b) => a.path.localeCompare(b.path));
  return { sha256: sha256Bytes(Buffer.from(JSON.stringify(rows), "utf8")), files: rows };
}

function pythonConsumer(zipFile, outputDir) {
  const script = [
    "import hashlib, json, pathlib, sys, zipfile",
    "zip_path, out = sys.argv[1], pathlib.Path(sys.argv[2])",
    "out.mkdir(parents=True, exist_ok=True)",
    "rows = []",
    "with zipfile.ZipFile(zip_path) as z:",
    "  for info in z.infolist():",
    "    if info.is_dir(): continue",
    "    data = z.read(info.filename)",
    "    target = (out / pathlib.PurePosixPath(info.filename)).resolve()",
    "    if out.resolve() not in target.parents: raise RuntimeError('ZIP_PATH_ESCAPE')",
    "    target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(data)",
    "    rows.append({'path': info.filename, 'bytes': len(data), 'crc': info.CRC, 'utf8': bool(info.flag_bits & 0x800), 'sha256': 'sha256:' + hashlib.sha256(data).hexdigest()})",
    "print(json.dumps(rows, ensure_ascii=False))",
  ].join("\n");
  const raw = execFileSync("python", ["-c", script, zipFile, outputDir], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(raw);
}

function secondConsumer(zipFile, outputDir) {
  const sevenZip = process.platform === "win32" ? (() => {
    try { return execFileSync("where.exe", ["7z"], { encoding: "utf8" }).split(/\r?\n/).find(Boolean); } catch { return ""; }
  })() : "";
  if (sevenZip) {
    execFileSync(sevenZip, ["x", "-y", zipFile, `-o${outputDir}`], { stdio: "pipe" });
    return "7zip";
  }
  if (process.platform === "win32") {
    const quote = value => `'${String(value).replaceAll("'", "''")}'`;
    const command = `Expand-Archive -LiteralPath ${quote(zipFile)} -DestinationPath ${quote(outputDir)} -Force`;
    execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], { stdio: "pipe" });
    return "powershell-expand-archive";
  }
  throw new Error("SECOND_ZIP_CONSUMER_UNAVAILABLE");
}

export function validatePortableZip({ zipFile, manifestFile = "" }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "past-exam-zip-"));
  const pythonRoot = path.join(root, "python");
  const secondRoot = path.join(root, "second");
  const errors = [];
  let pythonEntries = [];
  let secondConsumerName = "";
  try {
    pythonEntries = pythonConsumer(path.resolve(zipFile), pythonRoot);
    secondConsumerName = secondConsumer(path.resolve(zipFile), secondRoot);
    const pythonTree = treeDigest(pythonRoot);
    const secondTree = treeDigest(secondRoot);
    if (pythonTree.sha256 !== secondTree.sha256) errors.push("EXTRACTED_TREE_MISMATCH");
    for (const entry of pythonEntries) {
      if (/[^\x00-\x7f]/.test(entry.path) && !entry.utf8) errors.push(`ZIP_UTF8_FLAG_MISSING:${entry.path}`);
    }
    if (manifestFile) {
      const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
      const names = new Set(pythonEntries.map((entry) => entry.path));
      for (const row of manifest.files || []) {
        const name = String(row.path || row.entryName || "");
        if (!name || !names.has(name)) errors.push(`MANIFEST_PATH_MISSING:${name}`);
        const actual = pythonEntries.find((entry) => entry.path === name);
        if (actual && row.sha256 && row.sha256 !== actual.sha256) errors.push(`MANIFEST_FILE_SHA_MISMATCH:${name}`);
      }
      if (manifest.manifestPath && !names.has(manifest.manifestPath)) errors.push(`MANIFEST_PATH_MISSING:${manifest.manifestPath}`);
    }
    return {
      status: errors.length ? "FAIL" : "PASS",
      errors,
      zipSha256: sha256Bytes(fs.readFileSync(zipFile)),
      extractedTreeSha256: treeDigest(pythonRoot).sha256,
      pythonEntries,
      secondConsumer: secondConsumerName,
    };
  } catch (error) {
    return { status: "FAIL", errors: [...errors, String(error.message || error)], zipSha256: sha256Bytes(fs.readFileSync(zipFile)) };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
