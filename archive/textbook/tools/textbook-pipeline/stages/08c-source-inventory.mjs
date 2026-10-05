import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildQuestionSourceCrosscheck, buildSourceInventory, updatePipelineBookSummary } from "../lib/source-crosscheck-utils.mjs";

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

export default async function stage08cSourceInventory(cfg = {}) {
  const inventory = await buildSourceInventory(cfg);
  const questionCrosscheck = await buildQuestionSourceCrosscheck(cfg, inventory);
  await updatePipelineBookSummary(cfg, {
    full_page_crop_count: inventory.fullPageCropCount,
    question_crop_count: inventory.questionCropCount,
    quick_answer_source_count: inventory.quickAnswerSourceCount,
    answer_pdf_source_count: inventory.answerPdfSourceCount,
    solution_pdf_source_count: inventory.solutionPdfSourceCount,
    answer_solution_crop_count: inventory.answerSolutionCropCount,
    question_source_crosschecked_count: questionCrosscheck.crosscheckedCount,
  });
  return {
    name: "08C-source-inventory",
    status: inventory.status,
    fullPageCropCount: inventory.fullPageCropCount,
    questionCropCount: inventory.questionCropCount,
    quickAnswerSourceCount: inventory.quickAnswerSourceCount,
    answerPdfSourceCount: inventory.answerPdfSourceCount,
    solutionPdfSourceCount: inventory.solutionPdfSourceCount,
    answerSolutionCropCount: inventory.answerSolutionCropCount,
    questionSourceCrosscheckedCount: questionCrosscheck.crosscheckedCount,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  stage08cSourceInventory({
    workspaceRoot: path.resolve(args.workspaceRoot || args["workspace-root"] || cwd),
    materialRoot: args.materialRoot ? path.resolve(args.materialRoot) : "",
    generatedRoot: path.resolve(args.generatedRoot || args["generated-root"] || "generated"),
    jsDir: path.resolve(args.jsDir || args["js-dir"] || "generated/js"),
    reportsDir: path.resolve(args.reportsDir || args["reports-dir"] || "generated/reports"),
  }).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
