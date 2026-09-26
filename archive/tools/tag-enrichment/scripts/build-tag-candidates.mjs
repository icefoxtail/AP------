import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanExamBank, writeScanReports } from "./scan-exam-bank.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const TOOL_DIR = path.join(ROOT_DIR, "archive", "tools", "tag-enrichment");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "tag-enrichment", "reports");

function parseArgs(argv = process.argv.slice(2)) {
  const options = { limit: null, grade: "", source: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--limit") options.limit = Number(argv[++i]);
    else if (arg === "--grade") options.grade = argv[++i] ?? "";
    else if (arg === "--source") options.source = (argv[++i] ?? "").replaceAll("\\", "/");
  }
  return options;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(TOOL_DIR, relativePath), "utf8"));
}

function bestSubUnit(question, master) {
  const byUnit = master.subUnits.filter((item) => item.standardUnitKey === question.standardUnitKey);
  if (byUnit.length === 1) return byUnit[0];
  return null;
}

export function buildCandidate(question, file, master) {
  const subUnit = bestSubUnit(question, master);
  const reasons = [];
  const conflicts = [];

  if (subUnit) reasons.push(`master seed matched ${subUnit.subUnitKey}`);
  if (!question.hasContent) conflicts.push("missing content");
  if (!question.hasSolution) conflicts.push("missing solution");
  if (!question.standardUnitKey || question.standardUnitKey.startsWith("RAW")) conflicts.push("missing or RAW standardUnitKey");
  if (question.hasImage || /<svg|<table|<img/i.test(question.content)) reasons.push("visual or structured content requires human review context");

  const tagConfidence = subUnit && conflicts.length === 0 ? "medium" : "low";
  const tagStatus = subUnit && conflicts.length === 0 ? "hint_only" : "manual_review";

  return {
    sourceFile: file.sourceFile,
    examTitle: file.examTitle,
    questionId: question.questionId,
    originalIndex: question.originalIndex,
    standardCourse: question.standardCourse,
    standardUnitKey: question.standardUnitKey,
    standardUnit: question.standardUnit,
    currentLevel: question.level,
    currentQuestionType: question.questionType,
    currentLayoutTag: question.layoutTag,
    currentTags: question.tags,
    subUnitKeyCandidate: subUnit?.subUnitKey ?? "",
    subUnitCandidate: subUnit?.subUnit ?? "",
    advancedMetaAuthority: "RPM_ACTIVE_RESOLVER_ONLY",
    advancedMetaDisposition: "NOT_CLASSIFIED",
    tagConfidence,
    tagStatus,
    reasons,
    conflicts,
    reviewNotes: "L1/L2 subunit hint only. L3/L4, CrossConcept, Condition, IntegrationPattern and difficulty require the shared RPM→ACTIVE resolver and independent evidence.",
    sourceFingerprint: {
      contentLength: question.content.length,
      choicesLength: question.choices.length,
      hasAnswer: question.hasAnswer,
      hasSolution: question.hasSolution,
      image: question.image,
      layoutTag: question.layoutTag,
      wide: question.wide,
    },
  };
}

export function buildTagCandidates(options = parseArgs()) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const inventory = scanExamBank(options);
  writeScanReports(inventory);
  const master = readJson("data/tag-master.seed.json");
  const candidates = [];
  for (const file of inventory.files) {
    for (const question of file.questions) {
      candidates.push(buildCandidate(question, file, master));
    }
  }
  const statusCounts = {};
  const confidenceCounts = {};
  for (const candidate of candidates) {
    statusCounts[candidate.tagStatus] = (statusCounts[candidate.tagStatus] ?? 0) + 1;
    confidenceCounts[candidate.tagConfidence] = (confidenceCounts[candidate.tagConfidence] ?? 0) + 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    source: "exam-bank-inventory",
    filters: inventory.filters,
    totals: {
      candidates: candidates.length,
      statusCounts,
      confidenceCounts,
    },
    candidates,
  };
}

function renderSummary(report) {
  const rows = Object.entries(report.totals.statusCounts)
    .sort()
    .map(([status, count]) => `| ${status} | ${count} |`)
    .join("\n");
  return `# Tag Candidates Summary

- Generated: ${report.generatedAt}
- Candidates: ${report.totals.candidates}

## Status Counts

| tagStatus | Count |
|---|---:|
${rows || "| (none) | 0 |"}

## Notes

- hint_only means the existing L1/L2 master yielded one possible subunit hint; it is not a canonical classification.
- No advanced Meta or difficulty fields are produced by this tool.
- The report intentionally carries source fingerprints so validators can confirm no content-diff proposal was generated.
`;
}

export function writeCandidateReports(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const hints = report.candidates.filter((candidate) => candidate.tagStatus === "hint_only");
  const reviewRequired = report.candidates.filter((candidate) => candidate.tagStatus !== "hint_only");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.hint_only.json"), `${JSON.stringify(hints, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.review_required.json"), `${JSON.stringify(reviewRequired, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.summary.md"), renderSummary(report), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildTagCandidates();
  writeCandidateReports(report);
  console.log(`Built ${report.totals.candidates} tag candidates.`);
}
