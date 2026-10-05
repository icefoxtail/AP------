#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { scanJsBank, loadWindowScript } from "../js-bank-cleanup/scripts/scan-js-bank.mjs";

const repo = process.cwd();
const schemaPath = path.join(repo, "archive", "_generated", "js-bank-cleanup", "reports", "schema-validation.json");
const masterPath = path.join(repo, "archive", "data", "master_tables", "js_archive_tag_master.json");
const masterAuditPath = path.join(repo, "archive", "_generated", "intelligence", "phase1", "master-audit", "master-key-integrity-report.json");
const outputPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-subunit-parent-mismatch-adjudication-v1.json");
const summaryPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-subunit-parent-mismatch-adjudication-v1.summary.md");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const masterRecords = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const masterAudit = fs.existsSync(masterAuditPath) ? JSON.parse(fs.readFileSync(masterAuditPath, "utf8")) : null;
const issues = (schema.issues ?? []).filter((issue) => issue.code === "subunit_parent_mismatch");
const canonicalKeys = new Set(
  (Array.isArray(masterAudit?.documentedStandardUnits) ? masterAudit.documentedStandardUnits : masterRecords)
    .filter((record) => record?.key && (record.keyType === undefined || record.keyType === "standardUnitKey"))
    .map((record) => record.key),
);
const subunitByKey = new Map(masterRecords.filter((record) => record?.keyType === "subUnitKey" && record.key).map((record) => [record.key, record]));

function stripHtml(value) {
  return String(value ?? "")
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function preview(value, max = 180) {
  const text = stripHtml(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function classification(pairCount, currentKey, parentKey, subunitKey) {
  if (pairCount >= 50) return "BULK_PARENT_LEAKAGE_CANDIDATE";
  if (canonicalKeys.has(currentKey) && canonicalKeys.has(parentKey)) return "CANONICAL_CROSS_UNIT_CONFLICT";
  if (subunitKey.startsWith(`${currentKey}-`)) return "PARENT_STRING_CONFLICT_REQUIRES_MASTER_REVIEW";
  return "INDIVIDUAL_PARENT_CONFLICT";
}

const inventory = scanJsBank();
const summaryByQuestion = new Map();
for (const file of inventory.files) {
  for (const question of file.questions ?? []) summaryByQuestion.set(`${file.relativePath}#${question.questionId}`, question);
}
const affectedFiles = new Set(issues.map((issue) => issue.sourceFile));
const rawQuestionsByFile = new Map();
for (const relativePath of affectedFiles) {
  const fullPath = path.join(repo, "archive", "exams", relativePath.replaceAll("/", path.sep));
  const loaded = loadWindowScript(fullPath);
  rawQuestionsByFile.set(relativePath, loaded.ok && Array.isArray(loaded.window.questionBank) ? loaded.window.questionBank : []);
}

const pairCounts = new Map();
for (const issue of issues) {
  const current = issue.currentValue?.current ?? "";
  const parent = issue.currentValue?.master ?? "";
  const key = `${current} -> ${parent}`;
  pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
}

const rows = issues.map((issue) => {
  const summary = summaryByQuestion.get(`${issue.sourceFile}#${issue.questionId}`) ?? {};
  const raw = rawQuestionsByFile.get(issue.sourceFile)?.[issue.originalIndex] ?? null;
  const currentKey = issue.currentValue?.current ?? summary.standardUnitKey ?? "";
  const parentKey = issue.currentValue?.master ?? "";
  const subunitKey = summary.subUnitKey ?? "";
  const subunit = subunitByKey.get(subunitKey);
  const pair = `${currentKey} -> ${parentKey}`;
  return {
    sourceFile: issue.sourceFile,
    questionId: issue.questionId,
    originalIndex: issue.originalIndex,
    currentStandardUnitKey: currentKey,
    currentStandardUnit: summary.standardUnit ?? "",
    masterParentKey: parentKey,
    masterParentCanonical: canonicalKeys.has(parentKey),
    subUnitKey: subunitKey,
    subUnit: summary.subUnit ?? "",
    subunitMasterLabel: subunit?.labelKo ?? null,
    standardCourse: summary.standardCourse ?? "",
    category: summary.category ?? "",
    pair,
    pairCount: pairCounts.get(pair) ?? 0,
    classification: classification(pairCounts.get(pair) ?? 0, currentKey, parentKey, subunitKey),
    contentPreview: preview(raw?.content),
    answerPreview: preview(raw?.answer, 100),
    solutionPreview: preview(raw?.solution, 180),
  };
});

const grouped = new Map();
for (const row of rows) {
  const group = grouped.get(row.pair) ?? {
    pair: row.pair,
    classification: row.classification,
    issueCount: 0,
    uniqueFiles: new Set(),
    uniqueQuestions: new Set(),
    subunitKeyCounts: new Map(),
    standardUnitLabels: new Map(),
    rows: [],
  };
  group.issueCount += 1;
  group.uniqueFiles.add(row.sourceFile);
  group.uniqueQuestions.add(`${row.sourceFile}#${row.questionId}`);
  if (row.subUnitKey) group.subunitKeyCounts.set(row.subUnitKey, (group.subunitKeyCounts.get(row.subUnitKey) ?? 0) + 1);
  if (row.currentStandardUnit) group.standardUnitLabels.set(row.currentStandardUnit, (group.standardUnitLabels.get(row.currentStandardUnit) ?? 0) + 1);
  group.rows.push(row);
  grouped.set(row.pair, group);
}

function sortedCounts(map) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

const keyGroups = [...grouped.values()]
  .sort((a, b) => b.issueCount - a.issueCount || a.pair.localeCompare(b.pair))
  .map((group) => ({
    pair: group.pair,
    classification: group.classification,
    issueCount: group.issueCount,
    uniqueFiles: group.uniqueFiles.size,
    uniqueQuestions: group.uniqueQuestions.size,
    subunitKeyCounts: sortedCounts(group.subunitKeyCounts),
    observedStandardUnitLabels: sortedCounts(group.standardUnitLabels),
    questions: group.rows.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile, "ko") || (a.originalIndex ?? 0) - (b.originalIndex ?? 0)),
  }));
const countsByClassification = {};
for (const group of keyGroups) countsByClassification[group.classification] = (countsByClassification[group.classification] ?? 0) + group.issueCount;

const report = {
  schemaVersion: "archive-subunit-parent-mismatch-adjudication-v1",
  generatedAt: new Date().toISOString(),
  status: "REVIEW_INVENTORY_ONLY",
  sources: {
    schemaValidation: "archive/_generated/js-bank-cleanup/reports/schema-validation.json",
    compiledMaster: "archive/data/master_tables/js_archive_tag_master.json",
    masterKeyIntegrity: "archive/_generated/intelligence/phase1/master-audit/master-key-integrity-report.json",
  },
  scope: {
    issueCount: issues.length,
    uniqueQuestions: new Set(rows.map((row) => `${row.sourceFile}#${row.questionId}`)).size,
    uniqueFiles: affectedFiles.size,
    sourceQuestionCount: inventory.totals.questions,
  },
  countsByClassification,
  keyGroups,
  policy: {
    productionWrites: false,
    dbWrites: false,
    questionIndexWrites: false,
    identityRuntimeWrites: false,
    autoPatch: false,
    rationale: "A subunit parent mismatch can mean a classifier leak, a cross-curriculum reuse error, or a genuinely wrong standardUnitKey. Each group needs content-level evidence before changing either side.",
  },
  nextWorkOrder: [
    { order: 1, pair: "M3-07 -> M1-08", count: pairCounts.get("M3-07 -> M1-08") ?? 0, action: "중3 통계 문항을 M3-07 master subunit으로 문항별 재분류; M1-08 키를 일괄 승격하지 않음" },
    { order: 2, pair: "M1-03 -> M2-03", count: pairCounts.get("M1-03 -> M2-03") ?? 0, action: "중1 문자와 식 문항의 연립방정식 subunit 누출 여부를 문항별 확인" },
    { order: 3, pair: "H22-C-04/H22-C-05 -> M3-03", count: (pairCounts.get("H22-C-04 -> M3-03") ?? 0) + (pairCounts.get("H22-C-05 -> M3-03") ?? 0), action: "유형 파일의 고등 standardUnit과 중등 subunit 혼입을 분리 검토" },
    { order: 4, pair: "remaining", count: issues.length - (pairCounts.get("M3-07 -> M1-08") ?? 0) - (pairCounts.get("M1-03 -> M2-03") ?? 0) - (pairCounts.get("H22-C-04 -> M3-03") ?? 0) - (pairCounts.get("H22-C-05 -> M3-03") ?? 0), action: "18개 개별 충돌은 내용·정답·해설 근거로 별도 판정" },
  ],
};
report.digest = crypto.createHash("sha256").update(JSON.stringify(report)).digest("hex");

function renderSummary() {
  const rowsMarkdown = keyGroups.map((group) => `| ${group.pair} | ${group.classification} | ${group.issueCount} | ${group.uniqueFiles} | ${Object.keys(group.subunitKeyCounts).slice(0, 3).join(", ")} |`).join("\n");
  return `# Subunit parent mismatch adjudication inventory\n\n- Generated: ${report.generatedAt}\n- Status: ${report.status}\n- Issues: ${report.scope.issueCount}\n- Unique questions: ${report.scope.uniqueQuestions}\n- Unique files: ${report.scope.uniqueFiles}\n- Production writes: no\n\n| Parent pair | Classification | Questions | Files | Dominant subUnitKey(s) |\n|---|---|---:|---:|---|\n${rowsMarkdown || "| - | - | 0 | 0 | - |"}\n\nThe JSON report contains question-level content/answer/solution previews. No parent or standardUnit value was changed by this inventory.\n`;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(summaryPath, renderSummary(), "utf8");
console.log(JSON.stringify({
  output: path.relative(repo, outputPath).replaceAll("\\", "/"),
  summary: path.relative(repo, summaryPath).replaceAll("\\", "/"),
  status: report.status,
  scope: report.scope,
  countsByClassification: report.countsByClassification,
  digest: report.digest,
  productionWrites: report.policy.productionWrites,
}, null, 2));
