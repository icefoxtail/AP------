import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAnswerSourceOcrReport } from "../lib/answer-source-ocr-utils.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

export default async function stage08dAnswerSourceOcr(cfg = {}) {
  const report = await buildAnswerSourceOcrReport(cfg);
  return {
    name: "08D-answer-source-ocr",
    status: report.status,
    pdfCount: report.pdfCount,
    itemCount: report.itemCount,
    rapidOcrPdfCount: report.rapidOcrPdfCount,
    pypdfZeroFallbackCount: report.pypdfZeroFallbackCount,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  stage08dAnswerSourceOcr({
    workspaceRoot: path.resolve(args.workspaceRoot || args["workspace-root"] || cwd),
    materialRoot: args.materialRoot ? path.resolve(args.materialRoot) : "",
    generatedRoot: path.resolve(args.generatedRoot || args["generated-root"] || "generated"),
    jsDir: path.resolve(args.jsDir || args["js-dir"] || "generated/js"),
    reportsDir: path.resolve(args.reportsDir || args["reports-dir"] || "generated/reports"),
    workDir: path.resolve(args.workDir || args["work-dir"] || "generated/work"),
    answerSourceOcrMaxPages: args.maxPages || args["max-pages"] || 0,
  }).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
