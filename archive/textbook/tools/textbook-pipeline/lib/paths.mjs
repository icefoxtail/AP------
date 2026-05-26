import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const pipelineDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function resolveFrom(base, value) {
  if (!value) return base;
  return path.isAbsolute(value) ? value : path.resolve(base, value);
}

export function rel(workspaceRoot, target) {
  return path.relative(workspaceRoot, target).replaceAll("\\", "/");
}

export function toPosix(value) {
  return value.replaceAll("\\", "/");
}

export function getGeneratedRoot(cfg) {
  return path.resolve(cfg.generatedRoot || path.join(cfg.workspaceRoot || process.cwd(), "generated"));
}

export function getRunOutputRoot(cfg) {
  return path.resolve(cfg.runOutputRoot || getGeneratedRoot(cfg));
}

export async function ensureRunOutputRoot(cfg) {
  const root = getRunOutputRoot(cfg);
  await fs.promises.mkdir(root, { recursive: true });
  return root;
}

export function getCodexResultPath(cfg) {
  const fileName = cfg.codexResultFileName || "CODEX_RESULT.md";
  const policy = cfg.resultReportPolicy || "generated_output_root";
  if (policy === "disabled") return "";
  if (policy === "project_root" && cfg.writeRootCodexResult === true) {
    return path.join(path.resolve(cfg.projectRoot || process.cwd()), fileName);
  }
  if (policy === "workspace_root" && cfg.writeWorkspaceCodexResult === true) {
    return path.join(path.resolve(cfg.workspaceRoot || process.cwd()), fileName);
  }
  return path.join(getRunOutputRoot(cfg), fileName);
}
