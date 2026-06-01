import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../../../..");
const TOOL_DIR = path.join(ROOT_DIR, "archive", "tools", "tag-enrichment");
const REPORT_DIR = path.join(ROOT_DIR, "archive", "_generated", "tag-enrichment", "reports");
const REQUIRED_FIELDS = [
  "sourceFile",
  "examTitle",
  "questionId",
  "originalIndex",
  "standardCourse",
  "standardUnitKey",
  "standardUnit",
  "currentLevel",
  "currentQuestionType",
  "currentLayoutTag",
  "currentTags",
  "subUnitKeyCandidate",
  "subUnitCandidate",
  "conceptClusterKeyCandidate",
  "problemTypeKeyCandidate",
  "templateKeyCandidate",
  "difficultyBucketCandidate",
  "tagConfidence",
  "tagStatus",
  "reasons",
  "conflicts",
  "reviewNotes",
];
const ALLOWED_CONFIDENCE = new Set(["high", "medium", "low"]);
const ALLOWED_STATUS = new Set(["auto_high", "auto_medium", "auto_low", "manual_review"]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function addIssue(issues, severity, candidate, message) {
  issues.push({
    severity,
    sourceFile: candidate?.sourceFile ?? "",
    questionId: candidate?.questionId ?? null,
    originalIndex: candidate?.originalIndex ?? null,
    message,
  });
}

export function validateTagCandidates() {
  const candidatesPath = path.join(REPORT_DIR, "tag-candidates.json");
  const master = readJson(path.join(TOOL_DIR, "data", "tag-master.seed.json"));
  const report = readJson(candidatesPath);
  const issues = [];
  const seen = new Set();
  const knownSubUnits = new Set(master.subUnits.map((item) => item.subUnitKey));
  const knownConcepts = new Set(master.conceptClusters);
  const knownProblemTypes = new Set(master.problemTypes.map((item) => item.problemTypeKey));
  const knownTemplates = new Set(master.templates.map((item) => item.templateKey));

  for (const candidate of report.candidates ?? []) {
    for (const field of REQUIRED_FIELDS) {
      if (!(field in candidate)) addIssue(issues, "error", candidate, `missing required field: ${field}`);
    }
    if (!ALLOWED_CONFIDENCE.has(candidate.tagConfidence)) addIssue(issues, "error", candidate, `invalid tagConfidence: ${candidate.tagConfidence}`);
    if (!ALLOWED_STATUS.has(candidate.tagStatus)) addIssue(issues, "error", candidate, `invalid tagStatus: ${candidate.tagStatus}`);

    const identity = `${candidate.sourceFile}#${candidate.questionId ?? candidate.originalIndex}`;
    if (seen.has(identity)) addIssue(issues, "warning", candidate, `duplicate source/question identity: ${identity}`);
    seen.add(identity);

    if (candidate.tagStatus === "auto_high" && !candidate.problemTypeKeyCandidate) addIssue(issues, "error", candidate, "auto_high missing problemTypeKeyCandidate");
    if (candidate.tagStatus === "auto_high" && !candidate.templateKeyCandidate) addIssue(issues, "error", candidate, "auto_high missing templateKeyCandidate");
    if (candidate.tagStatus === "auto_high" && (!Array.isArray(candidate.reasons) || candidate.reasons.length === 0)) addIssue(issues, "error", candidate, "auto_high missing reasons");

    if (candidate.standardUnitKey && !candidate.problemTypeKeyCandidate && candidate.tagStatus === "auto_high") {
      addIssue(issues, "error", candidate, "standardUnitKey-only candidate cannot be auto_high");
    }
    if (candidate.subUnitKeyCandidate && !knownSubUnits.has(candidate.subUnitKeyCandidate)) addIssue(issues, "error", candidate, `subUnitKeyCandidate not in seed: ${candidate.subUnitKeyCandidate}`);
    if (candidate.conceptClusterKeyCandidate && !knownConcepts.has(candidate.conceptClusterKeyCandidate)) addIssue(issues, "error", candidate, `conceptClusterKeyCandidate not in seed: ${candidate.conceptClusterKeyCandidate}`);
    if (candidate.problemTypeKeyCandidate && !knownProblemTypes.has(candidate.problemTypeKeyCandidate)) addIssue(issues, "error", candidate, `problemTypeKeyCandidate not in seed: ${candidate.problemTypeKeyCandidate}`);
    if (candidate.templateKeyCandidate && !knownTemplates.has(candidate.templateKeyCandidate)) addIssue(issues, "error", candidate, `templateKeyCandidate not in seed: ${candidate.templateKeyCandidate}`);

    if (!candidate.sourceFingerprint || !("layoutTag" in candidate.sourceFingerprint) || !("wide" in candidate.sourceFingerprint)) {
      addIssue(issues, "error", candidate, "missing source fingerprint for layoutTag/wide");
    }
    for (const forbidden of ["contentCandidate", "choicesCandidate", "answerCandidate", "solutionCandidate", "imageCandidate"]) {
      if (forbidden in candidate) addIssue(issues, "error", candidate, `forbidden mutation-style field exists: ${forbidden}`);
    }
    if (String(candidate.problemTypeKeyCandidate).startsWith("PROPOSED-") || String(candidate.templateKeyCandidate).startsWith("PROPOSED-")) {
      addIssue(issues, "error", candidate, "PROPOSED key must not be used as an automatic recommendation");
    }
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  return {
    generatedAt: new Date().toISOString(),
    source: "tag-candidates.json",
    totals: {
      candidates: report.candidates?.length ?? 0,
      errors: errors.length,
      warnings: warnings.length,
    },
    pass: errors.length === 0,
    issues,
  };
}

function renderSummary(summary) {
  const issueRows = summary.issues
    .slice(0, 50)
    .map((issue) => `| ${issue.severity} | ${issue.sourceFile} | ${issue.questionId ?? ""} | ${issue.message} |`)
    .join("\n");
  return `# Validation Summary

- Generated: ${summary.generatedAt}
- Candidates checked: ${summary.totals.candidates}
- Errors: ${summary.totals.errors}
- Warnings: ${summary.totals.warnings}
- Pass: ${summary.pass ? "yes" : "no"}

## Issues

| Severity | Source | Question | Message |
|---|---|---:|---|
${issueRows || "| - | - | - | No issues. |"}
`;
}

export function writeValidationReports(summary) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "validation-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(REPORT_DIR, "validation-summary.md"), renderSummary(summary), "utf8");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const summary = validateTagCandidates();
  writeValidationReports(summary);
  console.log(`Validation ${summary.pass ? "passed" : "failed"} with ${summary.totals.errors} errors and ${summary.totals.warnings} warnings.`);
  if (!summary.pass) process.exitCode = 1;
}
