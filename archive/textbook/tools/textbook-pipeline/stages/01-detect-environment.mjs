import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { writeJson } from "../lib/report-utils.mjs";

const execFileAsync = promisify(execFile);

async function probe(command, args = []) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, { timeout: 10000 });
    return { available: true, command: [command, ...args].join(" "), output: `${stdout}${stderr}`.trim() };
  } catch (error) {
    return { available: false, command: [command, ...args].join(" "), error: error.message };
  }
}

export default async function stage01(cfg) {
  const probes = {
    node: await probe("node", ["-v"]),
    npm: await probe("npm", ["-v"]),
    python: await probe("python", ["--version"]),
    python3: await probe("python3", ["--version"]),
    pip: await probe("pip", ["--version"]),
    pip3: await probe("pip3", ["--version"]),
    pdftoppm: await probe("pdftoppm", ["-v"]),
    pdftotext: await probe("pdftotext", ["-v"]),
    pdfinfo: await probe("pdfinfo", ["-v"]),
    magick: await probe("magick", ["-version"]),
    fitz: await probe("python", ["-c", "import fitz; print('fitz ok')"]),
    PIL: await probe("python", ["-c", "from PIL import Image; print('PIL ok')"]),
  };
  const report = {
    stage: "01-detect-environment",
    generatedAt: new Date().toISOString(),
    workspaceRoot: cfg.workspaceRoot,
    probes,
    status: probes.node.available ? "ok" : "manual_review",
  };
  await writeJson(path.join(cfg.reportsDir, "tool_availability.json"), report);
  return { name: "01-detect-environment", status: report.status, report: "generated/reports/tool_availability.json" };
}

