import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildTagCandidates, writeCandidateReports } from "./build-tag-candidates.mjs";
import { validateTagCandidates, writeValidationReports } from "./validate-tag-candidates.mjs";
import { buildReviewPack } from "./build-review-pack.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "tag-enrichment", "reports");

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    dryRun: true,
    limit: null,
    grade: "",
    source: "",
    reviewPack: true,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--limit") options.limit = Number(argv[++i]);
    else if (arg === "--grade") options.grade = argv[++i] ?? "";
    else if (arg === "--source") options.source = (argv[++i] ?? "").replaceAll("\\", "/");
    else if (arg === "--no-review-pack") options.reviewPack = false;
  }
  return options;
}

export function runTagEnrichment(options = parseArgs()) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const candidates = buildTagCandidates(options);
  writeCandidateReports(candidates);
  const validation = validateTagCandidates();
  writeValidationReports(validation);
  let reviewPack = null;
  if (options.reviewPack) reviewPack = buildReviewPack();

  const runSummary = {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    filters: {
      limit: options.limit ?? null,
      grade: options.grade || null,
      source: options.source || null,
    },
    outputs: {
      reportDir: path.relative(ROOT_DIR, REPORT_DIR).replaceAll("\\", "/"),
      reviewPackPath: reviewPack?.outputPath ?? null,
    },
    totals: {
      candidates: candidates.totals.candidates,
      validationErrors: validation.totals.errors,
      validationWarnings: validation.totals.warnings,
    },
    sourceMutation: false,
  };
  fs.writeFileSync(path.join(REPORT_DIR, "run-summary.json"), `${JSON.stringify(runSummary, null, 2)}\n`, "utf8");
  return runSummary;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = runTagEnrichment();
  console.log(`Generated ${result.totals.candidates} candidates.`);
  console.log(`Validation errors: ${result.totals.validationErrors}`);
  if (result.outputs.reviewPackPath) console.log(`Review pack: ${result.outputs.reviewPackPath}`);
  if (result.totals.validationErrors > 0) process.exitCode = 1;
}
