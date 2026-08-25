#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = process.cwd();
const inputPath = path.join(repo, "archive", "_generated", "js-bank-cleanup", "reports", "schema-validation.json");
const outputPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-legacy-schema-inventory-v1.json");
const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const issues = Array.isArray(input.issues) ? input.issues : [];

const dispositionByCode = {
  missing_required_field: "BLOCKER_REQUIRES_FIELD_REVIEW",
  unknown_standard_unit_key: "REVIEW_ONLY_NO_AUTOPATCH",
  raw_unit: "REVIEW_ONLY_NO_AUTOPATCH",
  subunit_parent_mismatch: "REVIEW_ONLY_NO_AUTOPATCH",
  standard_unit_mismatch: "REVIEW_ONLY_NO_AUTOPATCH",
  standard_unit_order_mismatch: "REVIEW_ONLY_NO_AUTOPATCH",
  invalid_layout_tag: "REVIEW_ONLY_NO_AUTOPATCH",
  invalid_question_type: "REVIEW_ONLY_NO_AUTOPATCH",
};

const byCode = new Map();
const byField = new Map();
const questionKeys = new Set();
const fileSet = new Set();
for (const issue of issues) {
  const code = issue.code || "unknown";
  const entry = byCode.get(code) ?? {
    code,
    severityCounts: {},
    issueCount: 0,
    fileSet: new Set(),
    questionSet: new Set(),
    samples: [],
    disposition: dispositionByCode[code] ?? "REVIEW_ONLY_NO_AUTOPATCH",
  };
  entry.issueCount += 1;
  entry.severityCounts[issue.severity] = (entry.severityCounts[issue.severity] ?? 0) + 1;
  entry.fileSet.add(issue.sourceFile);
  const questionKey = `${issue.sourceFile}#${issue.questionId}`;
  entry.questionSet.add(questionKey);
  questionKeys.add(questionKey);
  fileSet.add(issue.sourceFile);
  if (entry.samples.length < 8) {
    entry.samples.push({
      sourceFile: issue.sourceFile,
      questionId: issue.questionId,
      originalIndex: issue.originalIndex,
      severity: issue.severity,
      field: issue.field ?? null,
      currentValue: issue.currentValue ?? null,
    });
  }
  byCode.set(code, entry);

  if (issue.field) byField.set(issue.field, (byField.get(issue.field) ?? 0) + 1);
}

const codeRows = [...byCode.values()]
  .sort((a, b) => b.issueCount - a.issueCount || a.code.localeCompare(b.code))
  .map((entry) => ({
    code: entry.code,
    severityCounts: entry.severityCounts,
    issueCount: entry.issueCount,
    uniqueFiles: entry.fileSet.size,
    uniqueQuestions: entry.questionSet.size,
    disposition: entry.disposition,
    samples: entry.samples,
  }));

const report = {
  schemaVersion: "archive-legacy-schema-inventory-v1",
  generatedAt: "2026-08-24",
  status: "REVIEW_INVENTORY_ONLY",
  sourceReport: "archive/_generated/js-bank-cleanup/reports/schema-validation.json",
  sourceReportGeneratedAt: input.generatedAt,
  scope: {
    source: input.source,
    issueCount: issues.length,
    uniqueFiles: fileSet.size,
    uniqueQuestions: questionKeys.size,
    countsBySeverity: input.totals?.countsBySeverity ?? {},
    specialLayoutOrWideRecords: input.totals?.specialLayout ?? 0,
  },
  countsByCode: input.totals?.countsByCode ?? {},
  countsByField: Object.fromEntries([...byField.entries()].sort((a, b) => b[1] - a[1])),
  issueGroups: codeRows,
  policy: {
    metadataSourceUnavailableClosureExcluded: true,
    productionWrites: false,
    dbWrites: false,
    questionIndexWrites: false,
    identityRuntimeWrites: false,
    autoPatch: false,
    rationale: "legacy/invalid/schema issues overlap with historical fields and label variants; each change requires field-level evidence and targeted QA.",
  },
  nextWorkOrder: [
    { order: 1, code: "missing_required_field", action: "문항·파일별 필수 필드 확인 후 최소 보강 또는 legacy_exception 승인" },
    { order: 2, code: "unknown_standard_unit_key/raw_unit", action: "현재 master에 직접 대응하는 키만 문항 근거로 adjudicate" },
    { order: 3, code: "subunit_parent_mismatch", action: "subUnitKey parent와 standardUnitKey를 문항별 대조" },
    { order: 4, code: "standard_unit_mismatch/standard_unit_order_mismatch", action: "master 라벨·순서와 source label을 분리해 alias/legacy 여부 판정" },
    { order: 5, code: "invalid_layout_tag/invalid_question_type", action: "렌더 계약에 필요한 값만 대상 파일 단위로 보정" },
  ],
};
report.digest = crypto.createHash("sha256").update(JSON.stringify(report)).digest("hex");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  output: path.relative(repo, outputPath).replaceAll("\\", "/"),
  status: report.status,
  issueCount: report.scope.issueCount,
  uniqueFiles: report.scope.uniqueFiles,
  uniqueQuestions: report.scope.uniqueQuestions,
  countsBySeverity: report.scope.countsBySeverity,
  countsByCode: report.countsByCode,
  digest: report.digest,
  productionWrites: report.policy.productionWrites,
}, null, 2));
