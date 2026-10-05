#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";

const repo = process.cwd();
const inventoryPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-subunit-parent-mismatch-adjudication-v1.json");
const masterPath = path.join(repo, "archive", "data", "master_tables", "js_archive_tag_master.json");
const masterAuditPath = path.join(repo, "archive", "_generated", "intelligence", "phase1", "master-audit", "master-key-integrity-report.json");
const outputPath = path.join(repo, "archive", "_generated", "intelligence", "phase4", "archive-subunit-parent-mismatch-resolution-v1.json");
const applyRequested = process.argv.includes("--apply");

const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const masterRecords = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const masterAudit = JSON.parse(fs.readFileSync(masterAuditPath, "utf8"));
const standardUnits = new Map((masterAudit.documentedStandardUnits ?? []).map((record) => [record.key, record]));
const subunits = new Map(masterRecords.filter((record) => record?.keyType === "subUnitKey" && record.key).map((record) => [record.key, record]));

function normalize(value) {
  return value === "(empty)" ? "" : value ?? "";
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

function statsSubunit(question) {
  const text = [question.content, question.answer, question.solution].map(stripHtml).join(" ");
  return /(산점도|상관관계|두 변량|변량 사이|상관관계가|산점)/.test(text)
    ? "M3-07-STATISTICS_DATA_INTERPRETATION"
    : "M3-07-STATISTICS_REPRESENTATIVE";
}

function resolutionFor(row, question) {
  const pair = row.pair;
  const updates = {};
  let rationale = "";
  if (pair === "M3-07 -> M1-08") {
    updates.subUnitKey = statsSubunit(question);
    rationale = updates.subUnitKey.endsWith("DATA_INTERPRETATION")
      ? "산점도·상관관계 자료를 중3 통계 자료 해석으로 이동"
      : "평균·중앙값·최빈값·분산·표준편차 등 대푯값·산포도 문항을 중3 통계 세부키로 이동";
  } else if (pair === "M1-03 -> M2-03") {
    updates.subUnitKey = /x의 값에 관계없이 항상 성립하는 등식|항등식/.test(stripHtml(question.content))
      ? "M1-03-ALGEBRAIC_EXPRESSION"
      : row.subUnitKey === "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD"
        ? "M1-03-LINEAR_EQUATION_WORD"
        : "M1-03-LINEAR_EQUATION";
    rationale = updates.subUnitKey === "M1-03-ALGEBRAIC_EXPRESSION"
      ? "항등식·식의 성질 문항은 문자와 식 세부키로 이동"
      : updates.subUnitKey.endsWith("WORD")
        ? "중1 일차방정식 활용 문항으로 이동"
        : "중1 일차방정식 풀이·개념 문항으로 이동";
  } else if (pair === "H22-C-04 -> M3-03") {
    updates.subUnitKey = "H22-C-04-COMPLEX_ROOT";
    rationale = "공통수학1 표준단원은 유지하고 중등 이차방정식 세부키를 복소수와 이차방정식으로 교정";
  } else if (pair === "H22-C-05 -> M3-03") {
    const applicationIds = new Set([1, 3, 6, 8, 11]);
    updates.subUnitKey = applicationIds.has(Number(row.questionId))
      ? "H22-C-05-QUADRATIC_FUNCTION_APPLICATION"
      : "H22-C-05-QUADRATIC_FUNCTION_GRAPH";
    rationale = updates.subUnitKey.endsWith("APPLICATION")
      ? "이차함수의 넓이·조건 적용 문항으로 고등 이차함수 활용 세부키를 적용"
      : "이차함수의 꼭짓점·평행·그래프 성질 문항으로 고등 이차함수 그래프 세부키를 적용";
  } else if (pair === "M3-01 -> M1-02") {
    updates.subUnitKey = "M3-01-SQUARE_ROOT_REAL_NUMBER";
    rationale = "중3 제곱근·실수의 대소 비교 문항으로 세부키를 교정";
  } else if (pair === "M3-01 -> M3-02") {
    updates.standardUnitKey = "M3-02";
    updates.subUnitKey = /A\s*\+\s*1/.test(stripHtml(question.content))
      ? "M3-02-FACTORIZATION"
      : "M3-02-POLYNOMIAL_MULTIPLICATION";
    rationale = updates.subUnitKey.endsWith("FACTORIZATION")
      ? "곱셈 공식·인수분해 항등식으로 다항식 단원 표준키와 세부키를 교정"
      : "곱셈 공식 활용 문항으로 다항식의 곱셈 표준키와 세부키를 교정";
  } else if (pair === "M1-05 -> M2-05") {
    updates.standardUnitKey = "M2-05";
    rationale = "삼각형의 성질 문항이므로 도형의 성질 표준키로 교정";
  } else if (pair === "M2-01 -> M1-02") {
    updates.subUnitKey = "M2-01-REPEATING_DECIMAL";
    rationale = "유리수와 순환소수 문항으로 중2 순환소수 세부키를 교정";
  } else if (pair === "M1-03 -> M2-02") {
    updates.standardUnitKey = "M2-02";
    rationale = "일차부등식 문항이므로 일차부등식 표준키로 교정";
  } else if (pair === "M1-05 -> M1-06") {
    updates.standardUnitKey = "M1-06";
    rationale = "사다리꼴 넓이 문항이므로 평면도형의 성질 표준키로 교정";
  } else if (pair === "M2-01 -> M1-01") {
    updates.standardUnitKey = "M1-01";
    rationale = "소인수분해 문항이므로 중1 소인수분해 표준키로 교정";
  } else if (pair === "M2-01 -> M2-03") {
    updates.standardUnitKey = "M2-03";
    rationale = "미지수 2개 일차방정식 문항이므로 연립일차방정식 표준키로 교정";
  } else if (pair === "M2-04 -> M2-03") {
    updates.subUnitKey = "M2-04-LINEAR_FUNCTION_EQUATION";
    rationale = "일차함수 그래프의 평행이동과 일차방정식 관계 문항으로 세부키를 교정";
  } else if (pair === "M2-06 -> M1-07") {
    updates.subUnitKey = "M2-06-SIMILAR_FIGURE";
    rationale = "닮은 입체도형의 부피비 문항으로 도형의 닮음 세부키를 교정";
  } else {
    throw new Error(`No resolution policy for pair: ${pair}`);
  }
  return { updates, rationale };
}

const rows = inventory.keyGroups.flatMap((group) => group.questions.map((question) => ({ ...question, pair: group.pair })));
if (rows.length !== 306) throw new Error(`Expected 306 mismatch rows, found ${rows.length}`);
const fileCache = new Map();
function questionFor(row) {
  if (!fileCache.has(row.sourceFile)) {
    const filePath = path.join(repo, "archive", "exams", ...row.sourceFile.split("/"));
    fileCache.set(row.sourceFile, loadQuestions(filePath));
  }
  const question = fileCache.get(row.sourceFile).find((item) => item.id === row.questionId);
  if (!question) throw new Error(`Question not found: ${row.sourceFile}#${row.questionId}`);
  return question;
}

const resolutions = rows.map((row) => {
  const before = questionFor(row);
  const { updates, rationale } = resolutionFor(row, before);
  const complete = { ...updates };
  const targetStandardKey = updates.standardUnitKey ?? before.standardUnitKey;
  const targetSubunitKey = updates.subUnitKey ?? before.subUnitKey;
  if (targetStandardKey && standardUnits.has(targetStandardKey)) {
    const standard = standardUnits.get(targetStandardKey);
    complete.standardUnitKey = targetStandardKey;
    complete.standardUnit = standard.labelKo;
    complete.standardUnitOrder = Number(standard.order);
  }
  if (targetSubunitKey && subunits.has(targetSubunitKey)) {
    const subunit = subunits.get(targetSubunitKey);
    complete.subUnitKey = targetSubunitKey;
    complete.subUnit = subunit.labelKo;
  } else {
    throw new Error(`Target subunit not found in compiled master: ${targetSubunitKey}`);
  }
  return {
    sourceFile: row.sourceFile,
    questionId: row.questionId,
    pair: row.pair,
    rationale,
    before: {
      standardUnitKey: before.standardUnitKey,
      standardUnit: before.standardUnit,
      standardUnitOrder: before.standardUnitOrder,
      subUnitKey: before.subUnitKey,
      subUnit: before.subUnit,
    },
    after: complete,
    fieldsChanged: Object.keys(complete).filter((field) => !equal(before[field], complete[field])),
  };
});

const duplicateKeys = new Set();
for (const row of resolutions) {
  const key = `${row.sourceFile}#${row.questionId}`;
  if (duplicateKeys.has(key)) throw new Error(`Duplicate resolution: ${key}`);
  duplicateKeys.add(key);
  if (!row.fieldsChanged.length) throw new Error(`Resolution has no field change: ${key}`);
}

const byFile = new Map();
for (const row of resolutions) {
  const list = byFile.get(row.sourceFile) ?? [];
  list.push(row);
  byFile.set(row.sourceFile, list);
}

const fileReports = [];
const protectedFields = ["content", "choices", "answer", "solution", "image"];
for (const [relativeFile, fileRows] of [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko"))) {
  const filePath = path.join(repo, "archive", "exams", ...relativeFile.split("/"));
  const beforeText = fs.readFileSync(filePath, "utf8");
  const beforeQuestions = loadQuestions(filePath);
  const beforeById = new Map(beforeQuestions.map((question) => [question.id, question]));
  const lines = beforeText.split(/\r?\n/);
  const newline = beforeText.includes("\r\n") ? "\r\n" : "\n";
  const blocks = new Map(findBlocks(lines, relativeFile).map((block) => [block.id, block]));
  const replacements = new Map();
  for (const row of fileRows) {
    const block = blocks.get(row.questionId);
    if (!block) throw new Error(`Question block missing: ${relativeFile}#${row.questionId}`);
    for (const [field, value] of Object.entries(row.after)) {
      if (!["standardUnitKey", "standardUnit", "standardUnitOrder", "subUnitKey", "subUnit"].includes(field)) continue;
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
      for (const key of Object.keys(before)) {
        if (["standardUnitKey", "standardUnit", "standardUnitOrder", "subUnitKey", "subUnit"].includes(key)) continue;
        if (!equal(before[key], after[key])) protectedDiffs.push({ questionId: before.id, field: key });
      }
    }
    if (protectedDiffs.length) throw new Error(`Protected fields changed in ${relativeFile}: ${JSON.stringify(protectedDiffs.slice(0, 5))}`);
    for (const row of fileRows) {
      const after = afterQuestions.find((question) => question.id === row.questionId);
      for (const [field, expected] of Object.entries(row.after)) {
        if (!equal(after[field], expected)) throw new Error(`Applied field did not verify: ${relativeFile}#${row.questionId}:${field}`);
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
  schemaVersion: "archive-subunit-parent-mismatch-resolution-v1",
  generatedAt: new Date().toISOString(),
  status: applyRequested ? "APPLIED_EVIDENCE_BACKED_RESOLUTION" : "PROPOSED_EVIDENCE_BACKED_RESOLUTION",
  sourceInventory: "archive/_generated/intelligence/phase4/archive-subunit-parent-mismatch-adjudication-v1.json",
  policy: "문항 content·answer·solution과 compiled master를 함께 확인해 표준단원 키와 세부키를 독립적으로 교정했다. 생산 파일에는 메타데이터 필드만 쓰며 content·choices·answer·solution·image와 그 밖의 필드는 보호한다.",
  scope: {
    mismatchRows: rows.length,
    uniqueFiles: byFile.size,
    questionsByAction: {
      standardAndSubunit: resolutions.filter((row) => row.fieldsChanged.includes("standardUnitKey") && row.fieldsChanged.includes("subUnitKey")).length,
      standardOnly: resolutions.filter((row) => row.fieldsChanged.includes("standardUnitKey") && !row.fieldsChanged.includes("subUnitKey")).length,
      subunitOnly: resolutions.filter((row) => row.fieldsChanged.includes("subUnitKey") && !row.fieldsChanged.includes("standardUnitKey")).length,
    },
  },
  totals: {
    questionsUpdated: resolutions.length,
    fieldsUpdated: resolutions.reduce((sum, row) => sum + row.fieldsChanged.length, 0),
    protectedFieldDiffs: fileReports.reduce((sum, file) => sum + file.protectedFieldDiffs, 0),
  },
  files: fileReports,
  resolutions,
  gates: {
    everyMismatchHasResolution: resolutions.length === rows.length,
    compiledMasterTargetsOnly: resolutions.every((row) => subunits.has(row.after.subUnitKey)),
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
