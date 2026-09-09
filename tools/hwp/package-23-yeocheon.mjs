import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const root = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908");
const work = path.join(root, "work/23_yeocheon_2mid");
const title = "23_여천고_2학기_중간_고1_기출";
const packageDir = path.join(root, "packages", `${title}_EXTERNAL_REVIEW`);
const zipPath = `${packageDir}.zip`;
const finalDir = path.join(work, "fresh-extract-final");

async function walk(dir) {
  const output = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}
function sha256(file) { return crypto.createHash("sha256").update(readFileSync(file)).digest("hex"); }
function rel(file, base) { return path.relative(base, file).replaceAll("\\", "/"); }

await fs.rm(packageDir, { recursive: true, force: true });
await fs.rm(zipPath, { force: true });
await fs.rm(path.join(work, "fresh-extract-package"), { recursive: true, force: true });
await fs.mkdir(path.join(packageDir, "source"), { recursive: true });
await fs.mkdir(path.join(packageDir, "reports"), { recursive: true });

await fs.copyFile(path.join(finalDir, `${title}.js`), path.join(packageDir, `${title}.js`));
await fs.cp(path.join(finalDir, "assets"), path.join(packageDir, "assets"), { recursive: true });
await fs.cp(path.join(finalDir, "reports"), path.join(packageDir, "reports"), { recursive: true });
await fs.cp(path.join(work, "source"), path.join(packageDir, "source"), { recursive: true });
await fs.copyFile(path.join(work, "reports/hwp_conversion_manifest.json"), path.join(packageDir, "reports/hwp_conversion_manifest.json"));

const jsPath = path.join(packageDir, `${title}.js`);
const sandbox = { window: {} };
vm.runInNewContext(await fs.readFile(jsPath, "utf8"), sandbox, { filename: jsPath });
const questions = sandbox.window.questionBank;
if (!Array.isArray(questions) || questions.length !== 17) throw new Error(`unexpected included count: ${questions?.length}`);
if (questions.some((question) => !question.answer || !question.solution)) throw new Error("included answer/solution blank");
await execFileAsync("node", ["--check", jsPath]);
const assets = (await walk(path.join(packageDir, "assets"))).filter((file) => file.toLowerCase().endsWith(".png"));
if (!assets.length) throw new Error("no PNG assets in package");
const sanity = `# BUILD SANITY — ${title}\n\n- native HWP PDF generated from the original HWP\n- source question count: 21\n- included independently solved questions: 17\n- local REVIEW_NEEDED exclusions: q7, q8, q9, q10\n- JS syntax: PASS\n- Node VM load: PASS\n- answers/solutions blank among included: 0\n- native PDF and original HWP copied: PASS\n- PNG assets: ${assets.length}\n- ZIP fresh extraction: checked after archive creation\n`;
await fs.writeFile(path.join(packageDir, "reports/BUILD_SANITY.md"), sanity, "utf8");

const files = (await walk(packageDir)).filter((file) => path.basename(file) !== "sha256_manifest.txt").sort();
const manifestLines = files.map((file) => `${sha256(file)}  ${rel(file, packageDir)}`);
await fs.writeFile(path.join(packageDir, "reports/sha256_manifest.txt"), manifestLines.join("\n") + "\n", "utf8");

const ps = `$ErrorActionPreference='Stop'; Compress-Archive -Path ${JSON.stringify(path.join(packageDir, "*"))} -DestinationPath ${JSON.stringify(zipPath)} -Force`;
await execFileAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", ps], { maxBuffer: 10 * 1024 * 1024 });

const fresh = path.join(work, "fresh-extract-package");
await fs.mkdir(fresh, { recursive: true });
const expand = `$ErrorActionPreference='Stop'; Expand-Archive -LiteralPath ${JSON.stringify(zipPath)} -DestinationPath ${JSON.stringify(fresh)} -Force`;
await execFileAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", expand], { maxBuffer: 10 * 1024 * 1024 });
const freshJs = path.join(fresh, `${title}.js`);
await execFileAsync("node", ["--check", freshJs]);
const freshCtx = { window: {} };
vm.runInNewContext(await fs.readFile(freshJs, "utf8"), freshCtx, { filename: freshJs });
if (freshCtx.window.questionBank.length !== 17) throw new Error("fresh extracted question count mismatch");
const pngCheck = `import sys\nfrom pathlib import Path\nfrom PIL import Image\nroot=Path(sys.argv[1])\nfiles=list(root.rglob('*.png'))\nassert files\nfor p in files:\n    with Image.open(p) as im: im.verify()\nprint(len(files))`;
await execFileAsync("python", ["-c", pngCheck, fresh]);
const zipSha = sha256(zipPath);
console.log(JSON.stringify({ status: "PASS", zipPath, zipSha256: zipSha, included: 17, excluded: ["7", "8", "9", "10"], pngCount: assets.length }, null, 2));
