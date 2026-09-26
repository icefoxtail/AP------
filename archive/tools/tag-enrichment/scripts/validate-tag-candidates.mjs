import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateIdentityRows } from '../../pipeline-core/integration.mjs';

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
  "advancedMetaAuthority",
  "advancedMetaDisposition",
  "tagConfidence",
  "tagStatus",
  "reasons",
  "conflicts",
  "reviewNotes",
];
const ALLOWED_CONFIDENCE = new Set(["high", "medium", "low"]);
const ALLOWED_STATUS = new Set(["hint_only", "manual_review"]);

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
  for (const message of validateIdentityRows(report.candidates, row => row.sourceFile && Number.isSafeInteger(row.questionId) && row.questionId > 0 ? `${row.sourceFile}|${row.questionId}` : '')) addIssue(issues, 'error', null, message);
  const seen = new Set();
  const knownSubUnits = new Set(master.subUnits.map((item) => item.subUnitKey));

  for (const candidate of report.candidates ?? []) {
    for (const field of REQUIRED_FIELDS) {
      if (!(field in candidate)) addIssue(issues, "error", candidate, `missing required field: ${field}`);
    }
    if (!ALLOWED_CONFIDENCE.has(candidate.tagConfidence)) addIssue(issues, "error", candidate, `invalid tagConfidence: ${candidate.tagConfidence}`);
    if (!ALLOWED_STATUS.has(candidate.tagStatus)) addIssue(issues, "error", candidate, `invalid tagStatus: ${candidate.tagStatus}`);

    const identity = `${candidate.sourceFile}#${candidate.questionId ?? candidate.originalIndex}`;
    if (seen.has(identity)) addIssue(issues, "error", candidate, `duplicate source/question identity: ${identity}`);
    seen.add(identity);

    if (candidate.advancedMetaAuthority !== "RPM_ACTIVE_RESOLVER_ONLY" || candidate.advancedMetaDisposition !== "NOT_CLASSIFIED") {
      addIssue(issues, "error", candidate, "tag-enrichment cannot assign or resolve advanced Meta");
    }
    if (candidate.subUnitKeyCandidate && !knownSubUnits.has(candidate.subUnitKeyCandidate)) addIssue(issues, "error", candidate, `subUnitKeyCandidate not in seed: ${candidate.subUnitKeyCandidate}`);
    for (const forbiddenAdvanced of ["conceptClusterKeyCandidate", "problemTypeKeyCandidate", "templateKeyCandidate", "crossConceptKeyCandidates", "conditionKeyCandidates", "difficultyBucketCandidate", "difficultyFromLevel"]) {
      if (forbiddenAdvanced in candidate) addIssue(issues, "error", candidate, `forbidden advanced Meta candidate field: ${forbiddenAdvanced}`);
    }

    if (!candidate.sourceFingerprint || !("layoutTag" in candidate.sourceFingerprint) || !("wide" in candidate.sourceFingerprint)) {
      addIssue(issues, "error", candidate, "missing source fingerprint for layoutTag/wide");
    }
    for (const forbidden of ["contentCandidate", "choicesCandidate", "answerCandidate", "solutionCandidate", "imageCandidate"]) {
      if (forbidden in candidate) addIssue(issues, "error", candidate, `forbidden mutation-style field exists: ${forbidden}`);
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
    statusScope: 'METADATA_CANDIDATE_SCHEMA_ONLY',
    productionAuthorized: false,
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
