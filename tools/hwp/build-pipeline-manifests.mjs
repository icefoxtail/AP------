import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const nightlyRoot = repo;
const stateRoot = path.join(repo, "archive/_generated/nightly-h1-2sem/20260908");
const workRoot = path.join(stateRoot, "work");
const sourceManifestPath = path.join(workRoot, "hwp-batch-manifest.json");
const outputManifestPath = path.join(workRoot, "hwp-pipeline-selected-manifest.json");
const configPath = path.join(workRoot, "hwp-pipeline.config.json");

const metadata = {
  "24_buyeong_2mid": { year: 2024, examType: "mid", school: "부영여고", objective: 18, subjective: 3 },
  "24_yeocheon_2mid": { year: 2024, examType: "mid", school: "여천고", objective: 18, subjective: 5 },
  "24_yeoyang_2final": { year: 2024, examType: "final", school: "여양고", objective: 18, subjective: 4 },
  "24_yeocheon_2final": { year: 2024, examType: "final", school: "여천고", objective: 18, subjective: 3 },
  "24_jungang_2final": { year: 2024, examType: "final", school: "중앙여고", objective: 20, subjective: 4 },
  "24_hanyeong_2final": { year: 2024, examType: "final", school: "한영고", objective: 14, subjective: 7 },
  "23_buyeong_2mid": { year: 2023, examType: "mid", school: "부영여고", objective: 18, subjective: 3 },
  "23_yeoyang_2mid": { year: 2023, examType: "mid", school: "여양고", objective: 18, subjective: 3 },
  "23_yeocheon_2mid": { year: 2023, examType: "mid", school: "여천고", objective: 18, subjective: 3 },
  "23_hanyeong_2mid": { year: 2023, examType: "mid", school: "한영고", objective: 15, subjective: 3 },
  "23_yeocheon_2final": { year: 2023, examType: "final", school: "여천고", objective: 18, subjective: 3 },
  "23_jungang_2final": { year: 2023, examType: "final", school: "중앙여고", objective: 20, subjective: 4 },
  "23_hanyeong_2final": { year: 2023, examType: "final", school: "한영고", objective: 15, subjective: 3 },
};

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function title(meta) {
  const type = meta.examType === "mid" ? "중간" : "기말";
  return `${String(meta.year).slice(-2)}_${meta.school}_2학기_${type}_고1_기출`;
}

const sourceItems = JSON.parse(await fs.readFile(sourceManifestPath, "utf8"));
const jobs = [];
const conversionRows = [];
for (const item of sourceItems) {
  const meta = metadata[item.key];
  if (!meta) continue;
  const examTitle = title(meta);
  const pdf = path.resolve(item.outputPdf);
  const hwpBytes = await fs.readFile(item.source);
  const pdfBytes = await fs.readFile(pdf);
  const job = {
    examId: item.key,
    examTitle,
    school: meta.school,
    year: meta.year,
    grade: "고1",
    semester: "2",
    examType: meta.examType,
    subject: "수학(하)",
    sourcePdfPath: pdf,
    pdfPath: pdf,
    sourcePdfSha256: sha256(pdfBytes),
    expectedQuestionCount: meta.objective + meta.subjective,
    expectedChoiceCount: meta.objective,
    expectedSubjectiveCount: meta.subjective,
    outputDir: path.join(workRoot, item.key, "extraction"),
    outputFileName: `${examTitle}.candidate.js`,
    createQuestionCrops: false,
    pipelineVersion: "past_exam_full_page_vision_v2",
    questionCropPolicy: "disabled_by_default_debug_only",
    answerSolutionPolicy: "excluded_from_extraction_pipeline",
    hwpSourcePath: item.source,
    hwpSourceSha256: sha256(hwpBytes),
    hwpConversionManifestPath: item.manifestPath,
  };
  jobs.push(job);
  conversionRows.push({
    key: item.key,
    examTitle,
    sourceHwpPath: item.source,
    sourceHwpSha256: job.hwpSourceSha256,
    convertedPdfPath: pdf,
    convertedPdfSha256: job.sourcePdfSha256,
    expectedQuestionCount: job.expectedQuestionCount,
    expectedChoiceCount: job.expectedChoiceCount,
    expectedSubjectiveCount: job.expectedSubjectiveCount,
    conversionManifestPath: item.manifestPath,
  });
}

await fs.writeFile(outputManifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  sourceRoot: "D:/기출",
  route: "HWP -> native Hancom PDF -> full-page-first archive pipeline",
  jobCount: jobs.length,
  jobs,
}, null, 2) + "\n", "utf8");
await fs.writeFile(configPath, JSON.stringify({
  projectRoot: nightlyRoot,
  sourceRoot: path.join(workRoot),
  generatedRoot: path.join(stateRoot, "pipeline-generated"),
  archiveRoot: path.join(repo, "archive"),
  rulesDir: path.join(repo, "docs/rules"),
  defaultRecentYears: 0,
  candidateFileSuffix: ".candidate",
  liveArchiveProtected: true,
  writeCandidateJs: true,
  allowBatchRunWithoutSelectedManifest: false,
  createQuestionCrops: false,
  visionProviderMode: "external_json_first",
  visionPageExtractJsonPath: "",
}, null, 2) + "\n", "utf8");
await fs.writeFile(path.join(stateRoot, "hwp-conversion-check.json"), JSON.stringify({
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  route: "official Hancom HwpObject 32-bit automation; PDF SaveAs with Print fallback",
  securityModule: "FilePathCheckerModuleExample.dll",
  securityModuleSha256: "9ac5b97c47ac8aed1e8bca27a3eef39411361d8f68c262509f0c40a8f9d21bb6",
  rows: conversionRows,
}, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ outputManifestPath, configPath, jobCount: jobs.length, conversionCheck: path.join(stateRoot, "hwp-conversion-check.json") }, null, 2));
