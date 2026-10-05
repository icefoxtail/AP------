#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { scanJsBank, loadWindowScript } from "../js-bank-cleanup/scripts/scan-js-bank.mjs";

const repo = process.cwd();
const schemaPath = path.join(repo, "archive", "_generated", "js-bank-cleanup", "reports", "schema-validation.json");
const masterPath = path.join(repo, "archive", "data", "master_tables", "js_archive_tag_master.json");
const masterAuditPath = path.join(repo, "archive", "_generated", "intelligence", "phase1", "master-audit", "master-key-integrity-report.json");
const outputPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-legacy-master-key-adjudication-v1.json");
const summaryPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-legacy-master-key-adjudication-v1.summary.md");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const masterRecords = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const masterAudit = fs.existsSync(masterAuditPath) ? JSON.parse(fs.readFileSync(masterAuditPath, "utf8")) : null;
const targetIssues = (Array.isArray(schema.issues) ? schema.issues : []).filter((issue) =>
  issue.code === "unknown_standard_unit_key" || issue.code === "raw_unit",
);

const canonicalUnits = new Map(
  (Array.isArray(masterAudit?.documentedStandardUnits) ? masterAudit.documentedStandardUnits : masterRecords)
    .filter((record) => record?.key && (record.keyType === undefined || record.keyType === "standardUnitKey"))
    .map((record) => [record.key, { labelKo: record.labelKo ?? record.unit ?? "", order: record.order ?? null }]),
);
const standardRecords = new Map(
  masterRecords
    .filter((record) => record?.keyType === "standardUnitKey" && record.key)
    .map((record) => [record.key, record]),
);
const subunitByKey = new Map(
  masterRecords
    .filter((record) => record?.keyType === "subUnitKey" && record.key)
    .map((record) => [record.key, record]),
);
const parentEvidence = new Map();
for (const record of subunitByKey.values()) {
  const parent = record.standardUnitKey || record.parentKey || "";
  if (!parent) continue;
  const entry = parentEvidence.get(parent) ?? { recordCount: 0, labels: new Map(), subunitKeys: [] };
  entry.recordCount += 1;
  if (record.labelKo) entry.labels.set(record.labelKo, (entry.labels.get(record.labelKo) ?? 0) + 1);
  if (entry.subunitKeys.length < 12) entry.subunitKeys.push(record.key);
  parentEvidence.set(parent, entry);
}

function normalizeKey(value) {
  if (value === undefined || value === null || value === "") return "(empty)";
  return String(value);
}

function classifyKey(key) {
  if (key === "(empty)") {
    return {
      code: "MISSING_STANDARD_UNIT_KEY",
      disposition: "MANUAL_SOURCE_OR_CONTENT_REVIEW_REQUIRED",
      rationale: "standardUnitKey is empty; no production promotion without question-level evidence.",
    };
  }
  if (/^(RAW|RRAW)-/.test(key)) {
    return {
      code: "RAW_SOURCE_KEY",
      disposition: "MANUAL_CONTENT_REVIEW_REQUIRED",
      rationale: "RAW/RRAW is a source label, not a formal master standardUnitKey; retain until content or source evidence maps it.",
    };
  }
  if (canonicalUnits.has(key)) {
    return {
      code: "CANONICAL_KEY_TOOL_MISMATCH",
      disposition: "VALIDATOR_RULE_REVIEW_ONLY",
      rationale: "The key is canonical in the master audit but was emitted as unknown by the legacy validator.",
    };
  }
  if (parentEvidence.has(key)) {
    return {
      code: "DOCUMENTED_PARENT_KEY",
      disposition: "VALIDATOR_PARENT_ALLOWLIST_REVIEW_ONLY",
      rationale: "The key is documented as a standardUnitKey parent for compiled subunits, but is not in the canonical standard-unit table parsed by the validator.",
    };
  }
  return {
    code: "UNRESOLVED_KEY",
    disposition: "BLOCKING_MANUAL_REVIEW",
    rationale: "The key is absent from both the canonical standard-unit table and compiled subunit-parent evidence.",
  };
}

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

const inventory = scanJsBank();
const fileSummaries = new Map(inventory.files.map((file) => [file.relativePath, file]));
const issueRows = new Map();
for (const issue of targetIssues) {
  const key = `${issue.sourceFile}#${issue.questionId ?? `index-${issue.originalIndex}`}`;
  const row = issueRows.get(key) ?? {
    sourceFile: issue.sourceFile,
    questionId: issue.questionId ?? null,
    originalIndex: issue.originalIndex ?? null,
    issueCodes: new Set(),
    currentKey: normalizeKey(issue.currentValue),
  };
  row.issueCodes.add(issue.code);
  if (issue.code === "unknown_standard_unit_key") row.currentKey = normalizeKey(issue.currentValue);
  issueRows.set(key, row);
}

const affectedFiles = new Set([...issueRows.values()].map((row) => row.sourceFile));
const rawQuestionsByFile = new Map();
for (const relativePath of affectedFiles) {
  const fullPath = path.join(repo, "archive", "exams", relativePath.replaceAll("/", path.sep));
  const loaded = loadWindowScript(fullPath);
  rawQuestionsByFile.set(relativePath, loaded.ok && Array.isArray(loaded.window.questionBank) ? loaded.window.questionBank : []);
}

const grouped = new Map();
for (const row of issueRows.values()) {
  const fileSummary = fileSummaries.get(row.sourceFile);
  const summaryQuestion = fileSummary?.questions?.find((question) =>
    question.questionId === row.questionId || question.originalIndex === row.originalIndex,
  );
  const rawQuestion = rawQuestionsByFile.get(row.sourceFile)?.[row.originalIndex] ?? null;
  const currentKey = normalizeKey(summaryQuestion?.standardUnitKey || (row.currentKey === "(empty)" ? "" : row.currentKey));
  const subUnitKey = summaryQuestion?.subUnitKey ?? "";
  const subunitRecord = subunitByKey.get(subUnitKey);
  const subunitParent = subunitRecord?.standardUnitKey ?? "";
  const classification = classifyKey(currentKey);
  const parentAligned = currentKey !== "(empty)" && subUnitKey
    ? subunitParent === currentKey || subUnitKey.startsWith(`${currentKey}-`)
    : null;
  const detail = {
    sourceFile: row.sourceFile,
    questionId: row.questionId,
    originalIndex: row.originalIndex,
    issueCodes: [...row.issueCodes].sort(),
    standardUnitKey: currentKey,
    standardUnit: summaryQuestion?.standardUnit ?? "",
    standardUnitOrder: summaryQuestion?.standardUnitOrder ?? null,
    subUnitKey,
    subUnit: summaryQuestion?.subUnit ?? "",
    subunitMasterParent: subunitParent || null,
    parentAligned,
    level: summaryQuestion?.level ?? "",
    standardCourse: summaryQuestion?.standardCourse ?? "",
    contentPreview: preview(rawQuestion?.content),
  };
  const group = grouped.get(currentKey) ?? {
    key: currentKey,
    classification,
    issueCount: 0,
    uniqueQuestions: new Set(),
    uniqueFiles: new Set(),
    issueCodeCounts: {},
    labels: new Map(),
    subunitKeys: new Set(),
    parentAlignedCounts: { true: 0, false: 0, unknown: 0 },
    questions: [],
  };
  group.issueCount += detail.issueCodes.length;
  group.uniqueQuestions.add(`${detail.sourceFile}#${detail.questionId ?? detail.originalIndex}`);
  group.uniqueFiles.add(detail.sourceFile);
  for (const code of detail.issueCodes) group.issueCodeCounts[code] = (group.issueCodeCounts[code] ?? 0) + 1;
  if (detail.standardUnit) group.labels.set(detail.standardUnit, (group.labels.get(detail.standardUnit) ?? 0) + 1);
  if (detail.subUnitKey) group.subunitKeys.add(detail.subUnitKey);
  group.parentAlignedCounts[parentAligned === true ? "true" : parentAligned === false ? "false" : "unknown"] += 1;
  group.questions.push(detail);
  grouped.set(currentKey, group);
}

function mapToSortedObject(map) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))));
}

const keyGroups = [...grouped.values()]
  .sort((a, b) => b.uniqueQuestions.size - a.uniqueQuestions.size || a.key.localeCompare(b.key))
  .map((group) => {
    const canonical = canonicalUnits.get(group.key);
    const parent = parentEvidence.get(group.key);
    return {
      key: group.key,
      classification: group.classification.code,
      disposition: group.classification.disposition,
      rationale: group.classification.rationale,
      issueCount: group.issueCount,
      uniqueQuestions: group.uniqueQuestions.size,
      uniqueFiles: group.uniqueFiles.size,
      issueCodeCounts: group.issueCodeCounts,
      canonicalMaster: canonical ? { labelKo: canonical.labelKo, order: canonical.order } : null,
      standardMasterRecord: standardRecords.has(group.key),
      documentedParentEvidence: parent
        ? { recordCount: parent.recordCount, labels: mapToSortedObject(parent.labels), sampleSubunitKeys: parent.subunitKeys }
        : null,
      observedStandardUnitLabels: mapToSortedObject(group.labels),
      observedSubunitKeyCount: group.subunitKeys.size,
      observedSubunitKeys: [...group.subunitKeys].sort(),
      parentAlignedCounts: group.parentAlignedCounts,
      questions: group.questions.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile, "ko") || (a.originalIndex ?? 0) - (b.originalIndex ?? 0)),
    };
  });

const classificationCounts = {};
const classificationQuestionCounts = {};
for (const group of keyGroups) {
  classificationCounts[group.classification] = (classificationCounts[group.classification] ?? 0) + group.issueCount;
  classificationQuestionCounts[group.classification] = (classificationQuestionCounts[group.classification] ?? 0) + group.uniqueQuestions;
}

const report = {
  schemaVersion: "archive-legacy-master-key-adjudication-v1",
  generatedAt: new Date().toISOString(),
  status: "REVIEW_INVENTORY_ONLY",
  sources: {
    schemaValidation: "archive/_generated/js-bank-cleanup/reports/schema-validation.json",
    compiledMaster: "archive/data/master_tables/js_archive_tag_master.json",
    masterKeyIntegrity: "archive/_generated/intelligence/phase1/master-audit/master-key-integrity-report.json",
  },
  scope: {
    targetIssueCodes: ["unknown_standard_unit_key", "raw_unit"],
    issueCount: targetIssues.length,
    uniqueQuestions: issueRows.size,
    uniqueFiles: affectedFiles.size,
    sourceQuestionCount: inventory.totals.questions,
    canonicalStandardKeyCount: canonicalUnits.size,
    compiledStandardRecordCount: standardRecords.size,
    compiledSubunitParentCount: parentEvidence.size,
  },
  classificationCounts,
  classificationQuestionCounts,
  keyGroups,
  policy: {
    productionWrites: false,
    dbWrites: false,
    questionIndexWrites: false,
    identityRuntimeWrites: false,
    autoPatch: false,
    rationale: "Canonical standard-unit keys, documented subunit parents, and RAW/source labels are kept separate until the validator policy and question-level evidence are approved.",
  },
  decisions: {
    documentedParentKey: "Do not rewrite JS. Review validator allowlist against compiled subunit parent evidence; promote only after policy approval.",
    rawSourceKey: "Do not invent a formal key. Review content/solution and map to an existing canonical key only with evidence.",
    missingStandardUnitKey: "Do not infer from filename alone. Keep in manual/source-dependent queue.",
    unresolvedKey: "Blocking manual review; no matching master evidence was found.",
  },
};
report.digest = crypto.createHash("sha256").update(JSON.stringify(report)).digest("hex");

function renderSummary() {
  const rows = keyGroups.map((group) =>
    `| ${group.key} | ${group.classification} | ${group.uniqueQuestions} | ${group.uniqueFiles} | ${group.parentAlignedCounts.true}/${group.parentAlignedCounts.false}/${group.parentAlignedCounts.unknown} | ${group.disposition} |`,
  ).join("\n");
  return `# Legacy master-key adjudication inventory\n\n- Generated: ${report.generatedAt}\n- Status: ${report.status}\n- Issue instances: ${report.scope.issueCount}\n- Unique questions: ${report.scope.uniqueQuestions}\n- Unique files: ${report.scope.uniqueFiles}\n- Canonical standard keys: ${report.scope.canonicalStandardKeyCount}\n- Compiled subunit-parent keys: ${report.scope.compiledSubunitParentCount}\n- Production writes: no\n\n## Classification totals\n\n| Classification | Issue instances | Unique questions |\n|---|---:|---:|\n${Object.keys(classificationCounts).sort().map((key) => `| ${key} | ${classificationCounts[key]} | ${classificationQuestionCounts[key]} |`).join("\n")}\n\n` +
    `## Key groups\n\n| Key | Classification | Questions | Files | Parent aligned / mismatch / unknown | Disposition |\n|---|---|---:|---:|---:|---|\n${rows || "| - | - | 0 | 0 | 0/0/0 | - |"}\n\n` +
    `The JSON report contains the question/file-level evidence rows and content previews. This inventory is not an approval to rewrite production JS.\n`;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(summaryPath, renderSummary(), "utf8");
console.log(JSON.stringify({
  output: path.relative(repo, outputPath).replaceAll("\\", "/"),
  summary: path.relative(repo, summaryPath).replaceAll("\\", "/"),
  status: report.status,
  issueCount: report.scope.issueCount,
  uniqueQuestions: report.scope.uniqueQuestions,
  uniqueFiles: report.scope.uniqueFiles,
  classificationCounts: report.classificationCounts,
  classificationQuestionCounts: report.classificationQuestionCounts,
  digest: report.digest,
  productionWrites: report.policy.productionWrites,
}, null, 2));
