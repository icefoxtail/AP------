#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

function parseArgs(argv) {
  const out = { repo: process.cwd(), exams: [] };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--repo") out.repo = argv[++i];
    else if (argv[i] === "--exam") out.exams.push(argv[++i]);
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

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function findCandidates(root, title) {
  const generated = path.join(root, "archive", "_generated", "past-exams");
  if (!fs.existsSync(generated)) return [];
  const found = [];
  for (const batch of fs.readdirSync(generated, { withFileTypes: true })) {
    if (!batch.isDirectory()) continue;
    const candidate = path.join(generated, batch.name, title, "candidate", `${title}.js`);
    if (fs.existsSync(candidate)) found.push(candidate);
  }
  return found;
}

const args = parseArgs(process.argv.slice(2));
const repo = path.resolve(args.repo);
const archive = path.join(repo, "archive");
const db = loadWindowScript(path.join(archive, "db.js")).mainDB?.exams ?? [];
const index = loadWindowScript(path.join(archive, "question-index.js")).questionIndex ?? [];
const reports = [];
let failed = false;

for (const relativeInput of args.exams) {
  const normalized = relativeInput.replaceAll("\\", "/").replace(/^archive\//, "");
  const relative = normalized.replace(/^exams\//, "");
  const live = path.join(archive, "exams", ...relative.split("/"));
  const errors = [];
  let title = path.basename(relative, ".js");
  let questions = [];

  try {
    const loaded = loadWindowScript(live);
    title = loaded.examTitle || title;
    questions = Array.isArray(loaded.questionBank) ? loaded.questionBank : [];
  } catch (error) {
    errors.push(`JS evaluation failed: ${error.message}`);
  }

  if (!questions.length) errors.push("questionBank is empty");
  const ids = questions.map((q) => q.id);
  if (new Set(ids).size !== ids.length) errors.push("question IDs are not unique");
  for (const q of questions) {
    if (!Number.isInteger(q.id)) errors.push(`invalid id: ${String(q.id)}`);
    if (!String(q.content ?? "").trim()) errors.push(`q${q.id}: empty content`);
    if (q.answer === undefined || q.answer === null || String(q.answer).trim() === "") errors.push(`q${q.id}: empty answer`);
    if (!String(q.solution ?? "").trim()) errors.push(`q${q.id}: empty solution`);
    if (q.visualAssetStatus === "full_page_reference") errors.push(`q${q.id}: unresolved full_page_reference`);
    if (q.image) {
      const image = path.join(archive, ...String(q.image).replaceAll("\\", "/").split("/"));
      if (!fs.existsSync(image) || fs.statSync(image).size === 0) errors.push(`q${q.id}: missing image ${q.image}`);
    }
  }

  const records = db.filter((entry) => entry.file === relative);
  if (records.length !== 1) errors.push(`DB record count is ${records.length}, expected 1`);
  const record = records[0];
  if (record) {
    if (!String(record.school ?? "").trim()) errors.push("DB school is empty");
    if (!String(record.subject ?? "").trim()) errors.push("DB subject is empty");
    if (record.qCount !== questions.length) errors.push(`DB qCount ${record.qCount} != JS ${questions.length}`);
  }

  const indexed = index.filter((q) => q.sourceFile === relative).length;
  if (indexed !== questions.length) errors.push(`question-index ${indexed} != JS ${questions.length}`);

  const candidates = findCandidates(repo, title);
  for (const candidate of candidates) {
    if (sha256(candidate) !== sha256(live)) errors.push(`candidate differs: ${path.relative(repo, candidate)}`);
  }

  failed ||= errors.length > 0;
  reports.push({ exam: relative, title, questions: questions.length, indexed, candidates: candidates.length, errors });
}

console.log(JSON.stringify({ ok: !failed, reports }, null, 2));
process.exitCode = failed ? 1 : 0;
