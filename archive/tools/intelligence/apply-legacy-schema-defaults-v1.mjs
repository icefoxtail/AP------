#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const repo = process.cwd();
const inputPath = path.join(repo, "archive", "_generated", "js-bank-cleanup", "reports", "schema-validation.json");
const outputPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-legacy-schema-default-application-v1.json");
const DEFAULTS = {
  questionType: "",
  layoutTag: "grid",
  tags: [],
  wide: false,
};
const targetFiles = new Set([
  "original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js",
  "original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js",
  "types/high/h1/항등식과나머지정리_고1_유형1.js",
]);

function loadQuestions(filePath) {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  sandbox.globalThis = sandbox.window;
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath });
  return Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [];
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

const validation = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const expectedByFile = new Map();
for (const issue of validation.issues ?? []) {
  if (issue.code !== "missing_required_field") continue;
  const file = issue.sourceFile.replaceAll("\\", "/");
  if (!targetFiles.has(file)) throw new Error(`Unexpected missing-field file: ${file}`);
  if (!Object.hasOwn(DEFAULTS, issue.field)) throw new Error(`Unsupported default field: ${issue.field}`);
  const byQuestion = expectedByFile.get(file) ?? new Map();
  const fields = byQuestion.get(issue.questionId) ?? new Set();
  fields.add(issue.field);
  byQuestion.set(issue.questionId, fields);
  expectedByFile.set(file, byQuestion);
}
if (expectedByFile.size !== targetFiles.size) throw new Error("Target missing-field inventory does not cover exactly three files");

const protectedFields = ["content", "choices", "answer", "solution", "image"];
const fileReports = [];
for (const relativeFile of [...targetFiles].sort()) {
  const filePath = path.join(repo, "archive", "exams", ...relativeFile.split("/"));
  const beforeQuestions = loadQuestions(filePath);
  const expected = expectedByFile.get(relativeFile);
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
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
  const beforeById = new Map(beforeQuestions.map((question) => [question.id, question]));
  const insertions = new Map();
  const applied = [];
  for (const block of blocks) {
    const question = beforeById.get(block.id);
    if (!question) throw new Error(`Question id ${block.id} not loaded from ${relativeFile}`);
    const expectedFields = [...(expected.get(block.id) ?? [])].sort((a, b) => Object.keys(DEFAULTS).indexOf(a) - Object.keys(DEFAULTS).indexOf(b));
    const actualMissing = Object.keys(DEFAULTS).filter((field) => !Object.hasOwn(question, field));
    if (!equal(expectedFields, actualMissing.sort((a, b) => Object.keys(DEFAULTS).indexOf(a) - Object.keys(DEFAULTS).indexOf(b)))) {
      throw new Error(`Missing-field inventory mismatch at ${relativeFile}#${block.id}`);
    }
    if (!expectedFields.length) continue;
    const contentLine = lines.findIndex((line, lineIndex) => lineIndex > block.start && lineIndex < block.end && /^    "content":/.test(line));
    if (contentLine < 0) throw new Error(`Content line not found at ${relativeFile}#${block.id}`);
    insertions.set(contentLine, expectedFields.map((field) => `    "${field}": ${JSON.stringify(DEFAULTS[field])},`));
    applied.push({ questionId: block.id, fields: expectedFields });
  }
  if (!applied.length) throw new Error(`No defaults to apply in ${relativeFile}`);
  const updatedLines = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (insertions.has(index)) updatedLines.push(...insertions.get(index));
    updatedLines.push(lines[index]);
  }
  const originalSource = fs.readFileSync(filePath, "utf8");
  const newline = originalSource.includes("\r\n") ? "\r\n" : "\n";
  fs.writeFileSync(filePath, updatedLines.join(newline), "utf8");
  const afterQuestions = loadQuestions(filePath);
  if (beforeQuestions.length !== afterQuestions.length) throw new Error(`Question count changed: ${relativeFile}`);
  const protectedDiffs = [];
  for (let index = 0; index < beforeQuestions.length; index += 1) {
    const before = beforeQuestions[index];
    const after = afterQuestions[index];
    if (before.id !== after.id) protectedDiffs.push({ questionId: before.id, field: "id", before: before.id, after: after.id });
    for (const field of protectedFields) {
      if (!equal(before[field], after[field])) protectedDiffs.push({ questionId: before.id, field });
    }
    for (const key of Object.keys(before)) {
      if (Object.hasOwn(DEFAULTS, key)) continue;
      if (!equal(before[key], after[key])) protectedDiffs.push({ questionId: before.id, field: key });
    }
    const appliedFields = applied.find((entry) => entry.questionId === before.id)?.fields ?? [];
    for (const field of appliedFields) {
      if (!equal(after[field], DEFAULTS[field])) protectedDiffs.push({ questionId: before.id, field, expected: DEFAULTS[field], actual: after[field] });
    }
  }
  if (protectedDiffs.length) throw new Error(`Protected fields changed in ${relativeFile}: ${JSON.stringify(protectedDiffs.slice(0, 5))}`);
  fileReports.push({ file: relativeFile, questions: beforeQuestions.length, updatedQuestions: applied.length, updatedFields: applied.reduce((sum, entry) => sum + entry.fields.length, 0), applied });
}

const report = {
  schemaVersion: "archive-legacy-schema-default-application-v1",
  generatedAt: "2026-08-24",
  status: "APPLIED_METADATA_DEFAULTS",
  sourceInventory: "archive/_generated/intelligence/phase4/archive-legacy-schema-inventory-v1.json",
  policy: "운영규칙의 legacy 기본값만 누락 필드에 추가하고 문항 본문·보기·정답·해설·이미지와 기타 필드는 보호한다.",
  defaults: DEFAULTS,
  files: fileReports,
  totals: {
    sourceFiles: fileReports.length,
    questionsUpdated: fileReports.reduce((sum, file) => sum + file.updatedQuestions, 0),
    fieldsAdded: fileReports.reduce((sum, file) => sum + file.updatedFields, 0),
    protectedFieldDiffs: 0,
  },
  gates: {
    onlyExpectedMissingFields: true,
    onlyDefaultFieldsAdded: true,
    protectedFieldsUnchanged: true,
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
  totals: report.totals,
  gates: report.gates,
  digest: report.digest,
}, null, 2));
