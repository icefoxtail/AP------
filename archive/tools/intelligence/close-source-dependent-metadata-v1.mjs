#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = process.cwd();
const sourceReportPath = path.join(
  repo,
  "archive",
  "_generated",
  "intelligence",
  "phase3",
  "archive-db-source-evidence-intake-v1.json",
);
const outputPath = path.join(
  repo,
  "archive",
  "_generated",
  "intelligence",
  "phase3",
  "archive-db-source-unavailable-closure-v1.json",
);

const sourceReport = JSON.parse(fs.readFileSync(sourceReportPath, "utf8"));
const deferredFields = Array.isArray(sourceReport.deferredFields)
  ? sourceReport.deferredFields
  : [];
const uniqueFiles = [...new Set(deferredFields.map((row) => row.file))].sort();
const fieldOccurrenceCounts = Object.fromEntries(
  [...new Set(deferredFields.map((row) => row.field))]
    .sort()
    .map((field) => [field, deferredFields.filter((row) => row.field === field).length]),
);
const scopeCounts = {};
for (const row of deferredFields) {
  scopeCounts[row.scope] ??= { files: new Set(), fieldOccurrences: 0 };
  scopeCounts[row.scope].files.add(row.file);
  scopeCounts[row.scope].fieldOccurrences += 1;
}
const normalizedScopeCounts = Object.fromEntries(
  Object.entries(scopeCounts).map(([scope, value]) => [scope, {
    files: value.files.size,
    fieldOccurrences: value.fieldOccurrences,
  }]),
);
const sourceEvidenceDigest = crypto
  .createHash("sha256")
  .update(fs.readFileSync(sourceReportPath))
  .digest("hex");

if (sourceReport.scope?.exactSourceBasenameMatches !== 0 || sourceReport.scope?.exactTextSourceMatches !== 0) {
  throw new Error("Cannot close queue: direct source evidence exists in the intake report");
}
if (sourceReport.decisions?.promotedFieldCount !== 0 || sourceReport.decisions?.dbWrites !== false) {
  throw new Error("Cannot close queue: intake report contains promoted fields or DB writes");
}
if (deferredFields.some((row) => row.reason !== "no_direct_source_evidence")) {
  throw new Error("Cannot close queue: deferred reason is not uniformly no_direct_source_evidence");
}

const report = {
  schemaVersion: "archive-db-source-unavailable-closure-v1",
  generatedAt: "2026-08-24",
  status: "CLOSED_SOURCE_UNAVAILABLE",
  disposition: "현재 workspace에서 직접 원본을 확인할 수 없어 이번 작업범위의 source-dependent 메타데이터 queue를 종결한다. DB 필드는 빈 상태를 유지하며 값을 추정하지 않는다.",
  sourceEvidenceReport: "archive/_generated/intelligence/phase3/archive-db-source-evidence-intake-v1.json",
  sourceEvidenceDigest,
  scope: {
    closedRecords: sourceReport.scope?.requiredFieldGapRecords ?? uniqueFiles.length,
    closedFiles: uniqueFiles.length,
    closedFieldOccurrences: deferredFields.length,
    emptySchoolRecords: sourceReport.scope?.emptySchoolRecords ?? 0,
    requiredFieldGapRecords: sourceReport.scope?.requiredFieldGapRecords ?? 0,
    exactSourceBasenameMatches: sourceReport.scope?.exactSourceBasenameMatches ?? 0,
    exactTextSourceMatches: sourceReport.scope?.exactTextSourceMatches ?? 0,
    contextualCandidateRows: sourceReport.scope?.contextualCandidateRows ?? 0,
  },
  fieldOccurrenceCounts,
  scopeCounts: normalizedScopeCounts,
  closureRules: {
    metadataValuesFabricated: false,
    dbWrites: false,
    productionJsWrites: false,
    questionIndexWrites: false,
    identityRuntimeWrites: false,
    reopenOnlyWhen: "새 PDF/스캔/표지/명시 source metadata가 대상 file 또는 examTitle과 직접 1:1로 확인될 때",
    contextualMatchesAccepted: false,
  },
  rows: deferredFields.map((row) => ({
    file: row.file,
    scope: row.scope,
    field: row.field,
    status: "CLOSED_SOURCE_UNAVAILABLE",
    reason: row.reason,
  })),
};
report.digest = crypto
  .createHash("sha256")
  .update(JSON.stringify(report))
  .digest("hex");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  output: path.relative(repo, outputPath).replaceAll("\\", "/"),
  status: report.status,
  closedFiles: report.scope.closedFiles,
  closedRecords: report.scope.closedRecords,
  closedFieldOccurrences: report.scope.closedFieldOccurrences,
  fieldOccurrenceCounts: report.fieldOccurrenceCounts,
  digest: report.digest,
  dbWrites: report.closureRules.dbWrites,
  reopenOnlyWhen: report.closureRules.reopenOnlyWhen,
}, null, 2));
