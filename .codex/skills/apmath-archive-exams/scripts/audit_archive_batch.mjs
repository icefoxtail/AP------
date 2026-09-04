#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const DB_REQUIRED_FIELDS = [
  "file",
  "school",
  "grade",
  "year",
  "semester",
  "examType",
  "subject",
  "contentType",
  "qCount",
];

const NEW_QUESTION_REQUIRED_FIELDS = [
  "subUnitKey",
  "subUnit",
  "subUnitConfidence",
  "subUnitClassificationDepth",
];

const SUBUNIT_CONFIDENCE_VALUES = new Set([
  "existing_preserved",
  "candidate_evidence",
  "category_or_cue_inferred",
  "rule_inferred",
]);

const SUBUNIT_DEPTH_VALUES = new Set([
  "complete_candidate",
  "complete_category",
  "complete_documented",
  "complete_rule",
]);

function parseArgs(argv) {
  const out = { repo: process.cwd(), exams: [], strictNew: false, allDb: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--repo") out.repo = argv[++i];
    else if (argv[i] === "--exam") out.exams.push(argv[++i]);
    else if (argv[i] === "--strict-new") out.strictNew = true;
    else if (argv[i] === "--all-db") out.allDb = true;
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!out.exams.length) throw new Error("Pass at least one --exam path relative to archive/");
  return out;
}

function loadWindowScript(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.window;
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function nonEmpty(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function normalizeRelative(value) {
  let normalized = String(value || "").replaceAll("\\", "/");
  normalized = normalized.replace(/^\.\//, "").replace(/^archive\//, "");
  normalized = normalized.replace(/^exams\//, "");
  return normalized;
}

function resolveInside(root, relative) {
  const normalized = String(relative || "").replaceAll("\\", "/");
  if (!normalized || path.isAbsolute(normalized)) return null;
  const resolved = path.resolve(root, ...normalized.split("/"));
  const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) return null;
  return resolved;
}

function findCandidates(root, title) {
  const generated = path.join(root, "archive", "_generated", "past-exams");
  if (!fs.existsSync(generated)) return [];
  const found = new Set();

  function addCandidate(candidate) {
    if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      found.add(path.resolve(candidate));
    }
  }

  for (const batch of fs.readdirSync(generated, { withFileTypes: true })) {
    if (!batch.isDirectory()) continue;
    const examDir = path.join(generated, batch.name, title);
    const candidateDir = path.join(examDir, "candidate");
    if (!fs.existsSync(candidateDir)) continue;

    const manifest = readJson(path.join(examDir, "manifest.json"));
    const report = readJson(path.join(examDir, "reports", "validation_summary.json"));
    for (const value of [manifest?.candidateFile, report?.candidateFile]) {
      if (!value) continue;
      addCandidate(path.isAbsolute(value) ? value : path.resolve(examDir, value));
    }

    for (const entry of fs.readdirSync(candidateDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".js")) {
        // Supports both legacy <title>.js and V2 <title>.candidate.js.
        addCandidate(path.join(candidateDir, entry.name));
      }
    }
  }
  return [...found].sort();
}

function buildSubunitMaster(archive) {
  const file = path.join(archive, "data", "master_tables", "js_archive_tag_master.json");
  const rows = readJson(file, []);
  return Array.isArray(rows) ? rows.filter((row) => nonEmpty(row?.subUnitKey)) : [];
}

function validateSubunit(q, masterRows, errors) {
  for (const key of NEW_QUESTION_REQUIRED_FIELDS) {
    if (!nonEmpty(q[key])) errors.push(`q${q.id}: empty ${key}`);
  }
  if (!nonEmpty(q.subUnitKey) || !nonEmpty(q.standardUnitKey) || !nonEmpty(q.subUnit)) return;

  if (!SUBUNIT_CONFIDENCE_VALUES.has(String(q.subUnitConfidence))) {
    errors.push(`q${q.id}: invalid subUnitConfidence ${String(q.subUnitConfidence)}`);
  }
  if (!SUBUNIT_DEPTH_VALUES.has(String(q.subUnitClassificationDepth))) {
    errors.push(`q${q.id}: invalid subUnitClassificationDepth ${String(q.subUnitClassificationDepth)}`);
  }

  const match = masterRows.find((row) =>
    row.subUnitKey === q.subUnitKey &&
    row.standardUnitKey === q.standardUnitKey &&
    row.labelKo === q.subUnit &&
    row.status !== "deprecated"
  );
  if (!match) {
    errors.push(`q${q.id}: subunit master mismatch ${q.standardUnitKey}/${q.subUnitKey}/${q.subUnit}`);
  }
}

function auditDbCoverage(archive, db, index) {
  const originalEntries = db.filter((entry) => normalizeRelative(entry.file).startsWith("original/"));
  const grouped = new Map();
  for (const entry of originalEntries) {
    const file = normalizeRelative(entry.file);
    const rows = grouped.get(file) || [];
    rows.push(entry);
    grouped.set(file, rows);
  }
  const issues = [];
  for (const [relative, rows] of grouped) {
    if (rows.length !== 1) issues.push(`DB ${relative}: record count is ${rows.length}, expected 1`);
    const live = resolveInside(path.join(archive, "exams"), relative);
    if (!live || !fs.existsSync(live)) {
      issues.push(`DB ${relative}: production file is missing`);
      continue;
    }
    let questions = [];
    try {
      questions = loadWindowScript(live).questionBank || [];
    } catch (error) {
      issues.push(`DB ${relative}: JS evaluation failed: ${error.message}`);
      continue;
    }
    const record = rows[0];
    if (record.qCount !== questions.length) issues.push(`DB ${relative}: qCount ${record.qCount} != JS ${questions.length}`);
    const indexed = index.filter((q) => normalizeRelative(q.sourceFile) === relative).length;
    if (indexed !== questions.length) issues.push(`DB ${relative}: question-index ${indexed} != JS ${questions.length}`);
  }
  return {
    status: issues.length ? "FAIL" : "PASS",
    originalDbRecords: originalEntries.length,
    originalProductionFiles: grouped.size,
    issues,
  };
}

const args = parseArgs(process.argv.slice(2));
const repo = path.resolve(args.repo);
const archive = path.join(repo, "archive");
const db = loadWindowScript(path.join(archive, "db.js")).mainDB?.exams ?? [];
const index = loadWindowScript(path.join(archive, "question-index.js")).questionIndex ?? [];
const masterRows = buildSubunitMaster(archive);
const reports = [];
let failed = false;

for (const relativeInput of args.exams) {
  const relative = normalizeRelative(relativeInput);
  const live = resolveInside(path.join(archive, "exams"), relative);
  const errors = [];
  let title = path.basename(relative, ".js");
  let questions = [];

  if (!live || !fs.existsSync(live)) {
    errors.push(`production JS missing: ${relative}`);
  } else {
    try {
      const loaded = loadWindowScript(live);
      title = loaded.examTitle || title;
      questions = Array.isArray(loaded.questionBank) ? loaded.questionBank : [];
    } catch (error) {
      errors.push(`JS evaluation failed: ${error.message}`);
    }
  }

  if (!questions.length) errors.push("questionBank is empty");
  const ids = questions.map((q) => q.id);
  if (new Set(ids).size !== ids.length) errors.push("question IDs are not unique");
  if (args.strictNew && ids.some((id, index) => id !== index + 1)) errors.push("question IDs are not sequential from 1");
  for (const q of questions) {
    if (!Number.isInteger(q.id)) errors.push(`invalid id: ${String(q.id)}`);
    if (!nonEmpty(q.content)) errors.push(`q${q.id}: empty content`);
    if (q.answer === undefined || q.answer === null || String(q.answer).trim() === "") errors.push(`q${q.id}: empty answer`);
    if (!nonEmpty(q.solution)) errors.push(`q${q.id}: empty solution`);
    if (args.strictNew) validateSubunit(q, masterRows, errors);
    if (q.visualAssetStatus === "full_page_reference") errors.push(`q${q.id}: unresolved full_page_reference`);
    if (q.image) {
      const image = resolveInside(archive, q.image);
      if (!image || !fs.existsSync(image) || fs.statSync(image).size === 0) {
        errors.push(`q${q.id}: missing image or unsafe image path ${q.image}`);
      }
    }
    if (q.solutionImage) {
      const solutionImage = resolveInside(archive, q.solutionImage);
      if (!solutionImage || !fs.existsSync(solutionImage) || fs.statSync(solutionImage).size === 0) {
        errors.push(`q${q.id}: missing solution image or unsafe solution-image path ${q.solutionImage}`);
      }
    }
  }

  const records = db.filter((entry) => normalizeRelative(entry.file) === relative);
  if (records.length !== 1) errors.push(`DB record count is ${records.length}, expected 1`);
  const record = records[0];
  if (record) {
    if (args.strictNew) {
      for (const field of DB_REQUIRED_FIELDS) {
        if (!nonEmpty(record[field])) errors.push(`DB ${field} is empty`);
      }
    }
    if (record.qCount !== questions.length) errors.push(`DB qCount ${record.qCount} != JS ${questions.length}`);
  }

  const indexed = index.filter((q) => normalizeRelative(q.sourceFile) === relative).length;
  if (indexed !== questions.length) errors.push(`question-index ${indexed} != JS ${questions.length}`);

  const candidates = findCandidates(repo, title);
  for (const candidate of candidates) {
    if (!live || !fs.existsSync(live)) continue;
    try {
      const loaded = loadWindowScript(candidate);
      if (loaded.examTitle !== title) {
        errors.push(`candidate identity mismatch: ${path.relative(repo, candidate)}`);
      }
    } catch (error) {
      errors.push(`candidate evaluation failed: ${path.relative(repo, candidate)} (${error.message})`);
      continue;
    }
    if (sha256(candidate) !== sha256(live)) errors.push(`candidate differs: ${path.relative(repo, candidate)}`);
  }

  failed ||= errors.length > 0;
  reports.push({
    exam: relative,
    title,
    questions: questions.length,
    indexed,
    candidates: candidates.length,
    candidatePaths: candidates.map((candidate) => path.relative(repo, candidate).replaceAll("\\", "/")),
    strictNew: args.strictNew,
    errors,
  });
}

let dbCoverage = null;
if (args.allDb) {
  dbCoverage = auditDbCoverage(archive, db, index);
  failed ||= dbCoverage.issues.length > 0;
}

console.log(JSON.stringify({
  ok: !failed,
  strictNew: args.strictNew,
  allDb: args.allDb,
  dbCoverage,
  reports,
}, null, 2));
process.exitCode = failed ? 1 : 0;
