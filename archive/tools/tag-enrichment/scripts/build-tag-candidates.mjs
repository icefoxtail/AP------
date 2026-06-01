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

function normalizeText(value) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchKeywordRule(text, rule) {
  const anyHit = !rule.keywordsAny?.length || rule.keywordsAny.some((keyword) => text.includes(keyword));
  const groupedHit = !rule.keywordsAllAny?.length || rule.keywordsAllAny.every((group) => group.some((keyword) => text.includes(keyword)));
  return anyHit && groupedHit;
}

function difficultyFromLevel(level) {
  if (level === "상") return "hard";
  if (level === "중") return "medium";
  if (level === "하") return "easy";
  return "unknown";
}

function bestSubUnit(question, master, pattern) {
  const byUnit = master.subUnits.filter((item) => item.standardUnitKey === question.standardUnitKey);
  if (pattern) {
    const exact = byUnit.find((item) => item.conceptClusterKey === pattern.conceptClusterKey);
    if (exact) return exact;
  }
  if (byUnit.length === 1) return byUnit[0];
  return null;
}

function knownKey(master, collection, field, value) {
  if (!value) return true;
  if (collection === "conceptClusters") return master.conceptClusters.includes(value);
  return master[collection].some((item) => item[field] === value);
}

function buildCandidate(question, file, master, patterns) {
  const combinedText = normalizeText([
    question.standardUnit,
    question.standardUnitKey,
    question.content,
    question.solution,
    question.tags.join(" "),
  ].join(" "));
  const patternMatches = patterns.rules.filter((rule) => matchKeywordRule(combinedText, rule));
  const pattern = patternMatches[0] ?? null;
  const subUnit = bestSubUnit(question, master, pattern);
  const reasons = [];
  const conflicts = [];

  if (subUnit) reasons.push(`master seed matched ${subUnit.subUnitKey}`);
  if (pattern) reasons.push(pattern.reason);
  if (patternMatches.length > 1) conflicts.push(`multiple pattern matches: ${patternMatches.map((item) => item.id).join(", ")}`);
  if (!question.hasContent) conflicts.push("missing content");
  if (!question.hasSolution) conflicts.push("missing solution");
  if (!question.standardUnitKey || question.standardUnitKey.startsWith("RAW")) conflicts.push("missing or RAW standardUnitKey");
  if (question.hasImage || /<svg|<table|<img/i.test(question.content)) reasons.push("visual or structured content requires human review context");

  const conceptClusterKeyCandidate = pattern?.conceptClusterKey || subUnit?.conceptClusterKey || "";
  const problemTypeKeyCandidate = pattern?.problemTypeKey || "";
  const templateKeyCandidate = pattern?.templateKey || "";

  if (!knownKey(master, "conceptClusters", "", conceptClusterKeyCandidate)) conflicts.push(`unknown conceptClusterKey ${conceptClusterKeyCandidate}`);
  if (!knownKey(master, "problemTypes", "problemTypeKey", problemTypeKeyCandidate)) conflicts.push(`unknown problemTypeKey ${problemTypeKeyCandidate}`);
  if (!knownKey(master, "templates", "templateKey", templateKeyCandidate)) conflicts.push(`unknown templateKey ${templateKeyCandidate}`);

  let tagConfidence = "low";
  let tagStatus = "auto_low";
  if (conflicts.some((conflict) => conflict.includes("missing content") || conflict.includes("RAW"))) {
    tagStatus = "manual_review";
  } else if (subUnit && pattern && problemTypeKeyCandidate && templateKeyCandidate && conflicts.length === 0) {
    tagConfidence = "high";
    tagStatus = "auto_high";
  } else if ((subUnit || pattern) && conflicts.length <= 1) {
    tagConfidence = "medium";
    tagStatus = "auto_medium";
  }

  if (!problemTypeKeyCandidate || !templateKeyCandidate) {
    tagConfidence = tagStatus === "manual_review" ? "low" : tagConfidence;
    if (tagStatus === "auto_high") tagStatus = "auto_medium";
  }

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
    conceptClusterKeyCandidate,
    problemTypeKeyCandidate,
    templateKeyCandidate,
    difficultyBucketCandidate: difficultyFromLevel(question.level),
    tagConfidence,
    tagStatus,
    reasons,
    conflicts,
    reviewNotes: tagStatus === "auto_high"
      ? "Candidate only. Do not auto-apply without review."
      : "Review required before any JS application.",
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
  const patterns = readJson("data/pattern-rules.seed.json");
  const candidates = [];
  for (const file of inventory.files) {
    for (const question of file.questions) {
      candidates.push(buildCandidate(question, file, master, patterns));
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

- auto_high means a review candidate has strong evidence; it is not an application instruction.
- auto_low and manual_review must not be used for automatic similar-problem recommendation.
- The report intentionally carries source fingerprints so validators can confirm no content-diff proposal was generated.
`;
}

export function writeCandidateReports(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const autoHigh = report.candidates.filter((candidate) => candidate.tagStatus === "auto_high");
  const reviewRequired = report.candidates.filter((candidate) => candidate.tagStatus !== "auto_high");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.auto_high.json"), `${JSON.stringify(autoHigh, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.review_required.json"), `${JSON.stringify(reviewRequired, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "tag-candidates.summary.md"), renderSummary(report), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildTagCandidates();
  writeCandidateReports(report);
  console.log(`Built ${report.totals.candidates} tag candidates.`);
}
