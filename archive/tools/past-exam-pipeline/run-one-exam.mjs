import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { parseArgs, loadConfig } from "./lib/config.mjs";
import { ensureDir, readJson, writeJson, writeText } from "./lib/fs-utils.mjs";
import { makeCandidateJs } from "./lib/js-candidate.mjs";

const execFileAsync = promisify(execFile);
const thisDir = path.dirname(fileURLToPath(import.meta.url));

const REQUIRED_REPORTS = [
  "validation_summary.json",
  "crop_failed.json",
  "content_manual_review.json",
  "answer_solution_manual_review.json",
  "formula_manual_review.json",
  "missing_image_report.json",
  "missing_answer_report.json",
  "missing_solution_report.json",
  "tag_low_confidence_report.json",
  "duplicate_question_report.json",
  "generated_files_manifest.json"
];

function parseOneArgs(argv) {
  const base = parseArgs(argv);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--manifest") base.manifest = argv[++i];
  }
  return base;
}

export async function runOneExam(cfg, manifest) {
  const outputDir = path.resolve(manifest.outputDir || path.join(cfg.generatedRoot, manifest.examId));
  const reportsDir = path.join(outputDir, "reports");
  const candidateDir = path.join(outputDir, "candidate");
  await Promise.all([
    ensureDir(outputDir),
    ensureDir(path.join(outputDir, "pages")),
    ensureDir(path.join(outputDir, "crops")),
    ensureDir(path.join(outputDir, "assets")),
    ensureDir(reportsDir),
    ensureDir(candidateDir)
  ]);
  const normalizedManifest = { ...manifest, outputDir };
  await writeJson(path.join(outputDir, "manifest.json"), normalizedManifest);
  const candidateFile = path.join(candidateDir, manifest.outputFileName || `${manifest.examId}${cfg.candidateFileSuffix}.js`);
  if (cfg.writeCandidateJs !== false) {
    await writeText(candidateFile, makeCandidateJs(normalizedManifest));
  }
  const questionCount = Number(manifest.expectedQuestionCount || 0);
  const reportBase = {
    examId: manifest.examId,
    generatedAt: new Date().toISOString(),
    status: questionCount > 0 ? "generated_pending" : "manual_review",
    items: []
  };
  for (const name of REQUIRED_REPORTS) {
    if (name === "validation_summary.json") continue;
    if (name === "generated_files_manifest.json") continue;
    await writeJson(path.join(reportsDir, name), reportBase);
  }
  const generatedFiles = {
    examId: manifest.examId,
    generatedAt: new Date().toISOString(),
    files: [
      "manifest.json",
      `candidate/${path.basename(candidateFile)}`,
      ...REQUIRED_REPORTS.map((name) => `reports/${name}`)
    ]
  };
  await writeJson(path.join(reportsDir, "generated_files_manifest.json"), generatedFiles);
  const validationSummary = {
    examId: manifest.examId,
    generatedAt: new Date().toISOString(),
    candidateFile,
    syntaxCheckRequired: true,
    expectedQuestionCount: questionCount,
    currentStage: "candidate_skeleton",
    protectedArchiveTouched: false,
    status: questionCount > 0 ? "partial" : "manual_review",
    blockedReasons: questionCount > 0 ? [] : ["expectedQuestionCount_missing_or_zero"],
    nextStages: [
      "render_pdf_pages",
      "detect_displayNo_page_map",
      "crop_question_candidates",
      "transcribe_content_choices",
      "fill_answers_from_evidence"
    ]
  };
  await writeJson(path.join(reportsDir, "validation_summary.json"), validationSummary);
  if (manifest.pdfPath) {
    const helperPath = path.join(thisDir, "helpers", "scanned_exam_pipeline.py");
    try {
      const result = await execFileAsync("python", [
        helperPath,
        "--manifest", path.join(outputDir, "manifest.json"),
        "--out", outputDir,
        "--dpi", String(cfg.cropDpi || 220),
        "--candidate-file", candidateFile,
      ], {
        timeout: 10 * 60 * 1000,
        maxBuffer: 1024 * 1024 * 50,
        env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      });
      return JSON.parse(result.stdout);
    } catch (error) {
      const failed = {
        ...validationSummary,
        status: "partial",
        currentStage: "scanned_exam_helper_failed",
        helperError: String(error.stderr || error.message || error).slice(0, 4000),
      };
      await writeJson(path.join(reportsDir, "validation_summary.json"), failed);
      return failed;
    }
  }
  return validationSummary;
}

async function main() {
  const args = parseOneArgs(process.argv.slice(2));
  const cfg = await loadConfig(args);
  if (!args.manifest) throw new Error("--manifest is required");
  const manifest = await readJson(path.resolve(process.cwd(), args.manifest));
  if (!manifest?.examId) throw new Error("manifest.examId is required");
  const result = await runOneExam(cfg, manifest);
  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
