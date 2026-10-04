import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanJsBank, writeJsBankInventory, parseArgs } from "./scan-js-bank.mjs";
import { scanDbIndex, writeDbIndexInventory } from "./scan-db-index.mjs";
import { scanImageAssets, writeImageReports } from "./scan-image-assets.mjs";
import { compareDbVsFiles, writeDbVsFilesMismatch } from "./compare-db-vs-files.mjs";
import { validateJsSchema, writeSchemaValidation } from "./validate-js-schema.mjs";
import { buildCleanupCandidates, writeCleanupCandidates } from "./build-cleanup-candidates.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "js-bank-cleanup", "reports");

function parseRunArgs(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  options.dryRun = true;
  return options;
}

export function runJsBankCleanup(options = parseRunArgs()) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const jsBank = scanJsBank(options);
  writeJsBankInventory(jsBank);
  const dbIndex = scanDbIndex(options);
  writeDbIndexInventory(dbIndex);
  const images = scanImageAssets(options);
  writeImageReports(images);
  const compare = compareDbVsFiles(options);
  writeDbVsFilesMismatch(compare);
  const schema = validateJsSchema(options);
  writeSchemaValidation(schema);
  const candidates = buildCleanupCandidates(options);
  writeCleanupCandidates(candidates);
  const skippedReasons = [
    compare.presenceSkippedReason,
    images.orphanAnalysisSkippedReason,
  ].filter(Boolean);

  const summary = {
    generatedAt: new Date().toISOString(),
    dryRun: true,
    filters: {
      limit: options.limit ?? null,
      grade: options.grade || null,
      source: options.source || null,
    },
    outputs: {
      reportDir: path.relative(ROOT_DIR, REPORT_DIR).replaceAll("\\", "/"),
    },
    totals: {
      jsFiles: jsBank.totals.files,
      jsQuestions: jsBank.totals.questions,
      dbEntries: dbIndex.totals.dbEntries,
      imageAssets: images.totals.imageAssets,
      imageReferences: images.totals.imageReferences,
      schemaIssues: schema.totals.issues,
      cleanupCandidates: candidates.totals.candidates,
    },
    presenceScope: compare.presenceScope,
    orphanScope: images.orphanScope,
    skippedReasons,
    sourceMutation: false,
    reviewPackCreated: false,
  };
  fs.writeFileSync(path.join(REPORT_DIR, "run-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  return summary;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const summary = runJsBankCleanup();
  console.log(`Scanned ${summary.totals.jsQuestions} questions from ${summary.totals.jsFiles} JS files.`);
  console.log(`Built ${summary.totals.cleanupCandidates} cleanup candidates.`);
  console.log(`Report dir: ${summary.outputs.reportDir}`);
}
