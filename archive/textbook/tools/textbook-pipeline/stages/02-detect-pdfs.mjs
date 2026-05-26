import path from "node:path";
import { detectPdfFiles } from "../lib/pdf-tools.mjs";
import { rel } from "../lib/paths.mjs";
import { writeJson } from "../lib/report-utils.mjs";

export default async function stage02(cfg) {
  const pdfs = await detectPdfFiles(cfg.workspaceRoot);
  const selected = cfg.inputPdf
    ? pdfs.find((p) => path.resolve(p.file) === path.resolve(cfg.inputPdf)) || null
    : pdfs[0] || null;
  const report = {
    stage: "02-detect-pdfs",
    generatedAt: new Date().toISOString(),
    pdfCount: pdfs.length,
    pdfs: pdfs.map((p) => ({ ...p, file: rel(cfg.workspaceRoot, p.file) })),
    selectedPdf: selected ? rel(cfg.workspaceRoot, selected.file) : "",
    selectionReason: selected ? (cfg.inputPdf ? "configured_input_pdf" : "largest_pdf_in_workspace_root") : "no_pdf_found",
    materialRoot: cfg.materialRoot ? rel(cfg.workspaceRoot, cfg.materialRoot) : "",
    status: selected ? "ok" : "manual_review",
  };
  await writeJson(path.join(cfg.reportsDir, "pdf_detection_report.json"), report);
  return { name: "02-detect-pdfs", status: report.status, selectedPdf: report.selectedPdf };
}
