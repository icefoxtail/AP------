#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";

const repo = process.cwd();
const validationPath = path.join(repo, "archive", "_generated", "js-bank-cleanup", "reports", "schema-validation.json");
const masterAuditPath = path.join(repo, "archive", "_generated", "intelligence", "phase1", "master-audit", "master-key-integrity-report.json");
const outputPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-standard-master-label-order-application-v1.json");
const applyRequested = process.argv.includes("--apply");

const validation = JSON.parse(fs.readFileSync(validationPath, "utf8"));
const masterAudit = JSON.parse(fs.readFileSync(masterAuditPath, "utf8"));
const standardUnits = new Map((masterAudit.documentedStandardUnits ?? []).map((row) => [row.key, row]));
const targetCodes = new Set(["standard_unit_mismatch", "standard_unit_order_mismatch"]);

function loadQuestions(filePath) {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  sandbox.globalThis = sandbox.window;
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath, displayErrors: true });
  return Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [];
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function findBlocks(lines, relativeFile) {
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index] !== "  {") continue;
    const idMatch = lines[index + 1]?.match(/^    "id":\s*(\d+),?$/);
    if (!idMatch) continue;
    let end = index + 1;
    while (end < lines.length && !/^  \},?$/.test(lines[end])) end += 1;
    if (end >= lines.length) throw new Error(`Question block is not closed: ${relativeFile}#${idMatch[1]}`);
    blocks.push({ start: index, end, id: Number(idMatch[1]) });
  }
  return blocks;
}

const issueRows = (validation.issues ?? []).filter((issue) => targetCodes.has(issue.code));
const rowMap = new Map();
for (const issue of issueRows) {
  const key = `${issue.sourceFile}#${issue.questionId}`;
  const row = rowMap.get(key) ?? { sourceFile: issue.sourceFile, questionId: issue.questionId, codes: [] };
  row.codes.push(issue.code);
  rowMap.set(key, row);
}

const fileCache = new Map();
function getQuestions(relativeFile) {
  if (!fileCache.has(relativeFile)) {
    const filePath = path.join(repo, "archive", "exams", ...relativeFile.split("/"));
    fileCache.set(relativeFile, loadQuestions(filePath));
  }
  return fileCache.get(relativeFile);
}

const resolutions = [];
for (const row of rowMap.values()) {
  const question = getQuestions(row.sourceFile).find((item) => item.id === row.questionId);
  if (!question) throw new Error(`Question not found: ${row.sourceFile}#${row.questionId}`);
  const master = standardUnits.get(question.standardUnitKey);
  if (!master) throw new Error(`Canonical master key not found: ${row.sourceFile}#${row.questionId}:${question.standardUnitKey}`);
  const after = {};
  if (row.codes.includes("standard_unit_mismatch")) after.standardUnit = master.labelKo;
  if (row.codes.includes("standard_unit_order_mismatch")) after.standardUnitOrder = Number(master.order);
  const fieldsChanged = Object.keys(after).filter((field) => !equal(question[field], after[field]));
  if (!fieldsChanged.length) throw new Error(`No effective change: ${row.sourceFile}#${row.questionId}`);
  resolutions.push({
    sourceFile: row.sourceFile,
    questionId: row.questionId,
    standardUnitKey: question.standardUnitKey,
    codes: row.codes,
    rationale: "canonical standard-unit master의 labelKo/order를 standardUnit·standardUnitOrder에 그대로 반영",
    before: { standardUnit: question.standardUnit, standardUnitOrder: question.standardUnitOrder },
    after,
    fieldsChanged,
  });
}

const byFile = new Map();
for (const row of resolutions) {
  const list = byFile.get(row.sourceFile) ?? [];
  list.push(row);
  byFile.set(row.sourceFile, list);
}

const protectedFields = ["content", "choices", "answer", "solution", "image"];
const fileReports = [];
for (const [relativeFile, fileRows] of [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko"))) {
  const filePath = path.join(repo, "archive", "exams", ...relativeFile.split("/"));
  const beforeText = fs.readFileSync(filePath, "utf8");
  const beforeQuestions = loadQuestions(filePath);
  const lines = beforeText.split(/\r?\n/);
  const newline = beforeText.includes("\r\n") ? "\r\n" : "\n";
  const blocks = new Map(findBlocks(lines, relativeFile).map((block) => [block.id, block]));
  const replacements = new Map();
  for (const row of fileRows) {
    const block = blocks.get(row.questionId);
    if (!block) throw new Error(`Question block missing: ${relativeFile}#${row.questionId}`);
    for (const [field, value] of Object.entries(row.after)) {
      const lineIndex = lines.findIndex((line, index) => index > block.start && index < block.end && new RegExp(`^    "${field}":`).test(line));
      if (lineIndex < 0) throw new Error(`Field line not found: ${relativeFile}#${row.questionId}:${field}`);
      replacements.set(lineIndex, `    "${field}": ${JSON.stringify(value)},`);
    }
  }
  const updatedText = lines.map((line, index) => replacements.get(index) ?? line).join(newline);
  let protectedDiffs = [];
  let afterQuestions = beforeQuestions;
  if (applyRequested) {
    fs.writeFileSync(filePath, updatedText, "utf8");
    afterQuestions = loadQuestions(filePath);
    const afterById = new Map(afterQuestions.map((question) => [question.id, question]));
    for (const before of beforeQuestions) {
      const after = afterById.get(before.id);
      if (!after) {
        protectedDiffs.push({ questionId: before.id, field: "id" });
        continue;
      }
      for (const field of protectedFields) if (!equal(before[field], after[field])) protectedDiffs.push({ questionId: before.id, field });
      for (const field of Object.keys(before)) {
        if (["standardUnit", "standardUnitOrder"].includes(field)) continue;
        if (!equal(before[field], after[field])) protectedDiffs.push({ questionId: before.id, field });
      }
    }
    if (protectedDiffs.length) throw new Error(`Protected fields changed in ${relativeFile}`);
    for (const row of fileRows) {
      const applied = afterQuestions.find((question) => question.id === row.questionId);
      for (const [field, expected] of Object.entries(row.after)) {
        if (!equal(applied[field], expected)) throw new Error(`Applied field did not verify: ${relativeFile}#${row.questionId}:${field}`);
      }
    }
  }
  fileReports.push({
    file: relativeFile,
    questionCount: beforeQuestions.length,
    questionsUpdated: fileRows.length,
    fieldsUpdated: fileRows.reduce((sum, row) => sum + row.fieldsChanged.length, 0),
    protectedFieldDiffs: protectedDiffs.length,
  });
}

const report = {
  schemaVersion: "archive-standard-master-label-order-application-v1",
  generatedAt: new Date().toISOString(),
  status: applyRequested ? "APPLIED_CANONICAL_MASTER_LABEL_ORDER" : "PROPOSED_CANONICAL_MASTER_LABEL_ORDER",
  sourceValidation: "archive/_generated/js-bank-cleanup/reports/schema-validation.json",
  sourceValidationGeneratedAt: validation.generatedAt,
  masterAudit: "archive/_generated/intelligence/phase1/master-audit/master-key-integrity-report.json",
  policy: "canonical standardUnitKey가 이미 master에 존재하는 문항만 대상으로 master labelKo/order를 standardUnit·standardUnitOrder에 반영했다. 표준키·세부키·content·choices·answer·solution·image 및 기타 필드는 보호한다.",
  scope: {
    issueRows: issueRows.length,
    uniqueQuestions: resolutions.length,
    uniqueFiles: byFile.size,
    labelRows: resolutions.filter((row) => row.codes.includes("standard_unit_mismatch")).length,
    orderRows: resolutions.filter((row) => row.codes.includes("standard_unit_order_mismatch")).length,
  },
  totals: {
    questionsUpdated: resolutions.length,
    fieldsUpdated: resolutions.reduce((sum, row) => sum + row.fieldsChanged.length, 0),
    protectedFieldDiffs: fileReports.reduce((sum, file) => sum + file.protectedFieldDiffs, 0),
  },
  files: fileReports,
  resolutions,
  gates: {
    everyIssueHasCanonicalMaster: resolutions.length === issueRows.length,
    metadataFieldsOnly: true,
    protectedFieldsUnchanged: fileReports.every((file) => file.protectedFieldDiffs === 0),
    noDbWrite: true,
    noQuestionIndexWrite: true,
    noIdentityRuntimeWrite: true,
    noCommitOrPush: true,
  },
};
report.digest = crypto.createHash("sha256").update(JSON.stringify(report)).digest("hex");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  output: path.relative(repo, outputPath).replaceAll("\\", "/"),
  status: report.status,
  scope: report.scope,
  totals: report.totals,
  gates: report.gates,
  digest: report.digest,
}, null, 2));
