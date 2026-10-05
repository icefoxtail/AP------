#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const repo = process.cwd();
const inventoryPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-legacy-master-key-adjudication-v1.json");
const masterPath = path.join(repo, "archive", "data", "master_tables", "js_archive_tag_master.json");
const masterAuditPath = path.join(repo, "archive", "_generated", "intelligence", "phase1", "master-audit", "master-key-integrity-report.json");
const outputPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-legacy-master-key-parent-application-v1.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const masterRecords = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const masterAudit = fs.existsSync(masterAuditPath) ? JSON.parse(fs.readFileSync(masterAuditPath, "utf8")) : null;

const canonicalUnits = new Map(
  (Array.isArray(masterAudit?.documentedStandardUnits) ? masterAudit.documentedStandardUnits : masterRecords)
    .filter((record) => record?.key && (record.keyType === undefined || record.keyType === "standardUnitKey"))
    .map((record) => [record.key, { labelKo: record.labelKo ?? record.unit ?? "", order: record.order ?? null }]),
);
const subunitByKey = new Map(
  masterRecords
    .filter((record) => record?.keyType === "subUnitKey" && record.key)
    .map((record) => [record.key, record]),
);

function loadQuestions(filePath) {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  sandbox.globalThis = sandbox.window;
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath, displayErrors: true });
  return Array.isArray(sandbox.window.questionBank) ? sandbox.window.questionBank : [];
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function normalize(value) {
  return value === "(empty)" ? "" : value ?? "";
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

const candidates = [];
for (const group of inventory.keyGroups ?? []) {
  const allowed = new Set(["DOCUMENTED_PARENT_KEY", "RAW_SOURCE_KEY", "MISSING_STANDARD_UNIT_KEY"]);
  if (!allowed.has(group.classification)) continue;
  for (const question of group.questions ?? []) {
    const parent = question.subunitMasterParent;
    if (!parent || !canonicalUnits.has(parent)) continue;
    const mismatch = question.parentAligned === false;
    const rawOrEmpty = group.classification === "RAW_SOURCE_KEY" || group.classification === "MISSING_STANDARD_UNIT_KEY";
    if (!mismatch && !rawOrEmpty) continue;
    candidates.push({
      sourceFile: question.sourceFile,
      questionId: question.questionId,
      originalIndex: question.originalIndex,
      previousStandardUnitKey: normalize(question.standardUnitKey),
      previousStandardUnit: question.standardUnit,
      previousStandardUnitOrder: question.standardUnitOrder,
      subUnitKey: question.subUnitKey,
      subunitMasterParent: parent,
      classification: group.classification,
    });
  }
}

const candidateByKey = new Map();
for (const candidate of candidates) {
  const key = `${candidate.sourceFile}#${candidate.questionId ?? `index-${candidate.originalIndex}`}`;
  if (candidateByKey.has(key)) throw new Error(`Duplicate candidate: ${key}`);
  candidateByKey.set(key, candidate);
}
if (candidateByKey.size !== candidates.length) throw new Error("Candidate deduplication failed");
if (candidates.length !== 48) throw new Error(`Expected 48 evidence-backed candidates, found ${candidates.length}`);

const protectedFields = ["content", "choices", "answer", "solution", "image"];
const files = [...new Set(candidates.map((candidate) => candidate.sourceFile))].sort((a, b) => a.localeCompare(b, "ko"));
const fileReports = [];
for (const relativeFile of files) {
  const fileCandidates = candidates.filter((candidate) => candidate.sourceFile === relativeFile);
  const filePath = path.join(repo, "archive", "exams", ...relativeFile.split("/"));
  const originalSource = fs.readFileSync(filePath, "utf8");
  const newline = originalSource.includes("\r\n") ? "\r\n" : "\n";
  const lines = originalSource.split(/\r?\n/);
  const beforeQuestions = loadQuestions(filePath);
  const beforeById = new Map(beforeQuestions.map((question) => [question.id, question]));
  const blocks = findBlocks(lines, relativeFile);
  const blockById = new Map(blocks.map((block) => [block.id, block]));
  const replacements = new Map();
  const applied = [];
  for (const candidate of fileCandidates) {
    const question = beforeById.get(candidate.questionId);
    const block = blockById.get(candidate.questionId);
    if (!question || !block) throw new Error(`Question block missing: ${relativeFile}#${candidate.questionId}`);
    const target = canonicalUnits.get(candidate.subunitMasterParent);
    if (!target || !target.labelKo || !Number.isFinite(Number(target.order))) {
      throw new Error(`Canonical parent has no complete label/order: ${candidate.subunitMasterParent}`);
    }
    if (question.subUnitKey !== candidate.subUnitKey) throw new Error(`subUnitKey changed before application: ${relativeFile}#${candidate.questionId}`);
    const currentKey = normalize(question.standardUnitKey);
    if (currentKey !== candidate.previousStandardUnitKey && currentKey !== candidate.subunitMasterParent) {
      throw new Error(`Unexpected current standardUnitKey at ${relativeFile}#${candidate.questionId}: ${currentKey}`);
    }
    const fieldValues = {
      standardUnitKey: candidate.subunitMasterParent,
      standardUnit: target.labelKo,
      standardUnitOrder: Number(target.order),
    };
    for (const [field, value] of Object.entries(fieldValues)) {
      const lineIndex = lines.findIndex((line, index) => index > block.start && index < block.end && new RegExp(`^    "${field}":`).test(line));
      if (lineIndex < 0) throw new Error(`Field line not found at ${relativeFile}#${candidate.questionId}: ${field}`);
      replacements.set(lineIndex, `    "${field}": ${JSON.stringify(value)},`);
    }
    applied.push({
      questionId: candidate.questionId,
      classification: candidate.classification,
      previous: {
        standardUnitKey: currentKey,
        standardUnit: question.standardUnit ?? "",
        standardUnitOrder: question.standardUnitOrder ?? null,
      },
      applied: fieldValues,
      evidence: {
        subUnitKey: candidate.subUnitKey,
        subunitMasterParent: candidate.subunitMasterParent,
      },
    });
  }
  const updatedLines = lines.map((line, index) => replacements.get(index) ?? line);
  fs.writeFileSync(filePath, updatedLines.join(newline), "utf8");
  const afterQuestions = loadQuestions(filePath);
  if (beforeQuestions.length !== afterQuestions.length) throw new Error(`Question count changed: ${relativeFile}`);
  const afterById = new Map(afterQuestions.map((question) => [question.id, question]));
  const protectedDiffs = [];
  for (const before of beforeQuestions) {
    const after = afterById.get(before.id);
    if (!after) {
      protectedDiffs.push({ questionId: before.id, field: "id", reason: "question_missing_after" });
      continue;
    }
    for (const field of protectedFields) {
      if (!equal(before[field], after[field])) protectedDiffs.push({ questionId: before.id, field });
    }
    for (const key of Object.keys(before)) {
      if (["standardUnitKey", "standardUnit", "standardUnitOrder"].includes(key)) continue;
      if (!equal(before[key], after[key])) protectedDiffs.push({ questionId: before.id, field: key });
    }
  }
  if (protectedDiffs.length) throw new Error(`Protected fields changed in ${relativeFile}: ${JSON.stringify(protectedDiffs.slice(0, 5))}`);
  for (const candidate of fileCandidates) {
    const after = afterById.get(candidate.questionId);
    const target = canonicalUnits.get(candidate.subunitMasterParent);
    if (after.standardUnitKey !== candidate.subunitMasterParent || after.standardUnit !== target.labelKo || after.standardUnitOrder !== Number(target.order)) {
      throw new Error(`Applied canonical fields do not verify: ${relativeFile}#${candidate.questionId}`);
    }
  }
  fileReports.push({
    file: relativeFile,
    questionCount: beforeQuestions.length,
    questionsUpdated: applied.length,
    fieldsUpdated: applied.length * 3,
    protectedFieldDiffs: protectedDiffs.length,
    applied,
  });
}

const report = {
  schemaVersion: "archive-legacy-master-key-parent-application-v1",
  generatedAt: new Date().toISOString(),
  status: "APPLIED_CANONICAL_PARENT_EVIDENCE",
  sourceInventory: "archive/_generated/intelligence/phase4/archive-legacy-master-key-adjudication-v1.json",
  policy: "RAW/공란 및 parent mismatch 문항 중 compiled subunit parent가 canonical standard-unit master에 직접 존재하는 경우에 한해 standardUnitKey·standardUnit·standardUnitOrder를 parent 값으로 정규화했다.",
  scope: {
    candidateQuestions: candidates.length,
    candidateFiles: files.length,
    classifications: Object.fromEntries([...new Set(candidates.map((candidate) => candidate.classification))].sort().map((classification) => [classification, candidates.filter((candidate) => candidate.classification === classification).length])),
  },
  files: fileReports,
  totals: {
    questionsUpdated: fileReports.reduce((sum, file) => sum + file.questionsUpdated, 0),
    fieldsUpdated: fileReports.reduce((sum, file) => sum + file.fieldsUpdated, 0),
    protectedFieldDiffs: fileReports.reduce((sum, file) => sum + file.protectedFieldDiffs, 0),
  },
  gates: {
    onlyCanonicalSubunitParents: true,
    onlyStandardUnitFieldsChanged: true,
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
  scope: report.scope,
  totals: report.totals,
  gates: report.gates,
  digest: report.digest,
}, null, 2));
