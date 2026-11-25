#!/usr/bin/env node
// A source-first, fail-closed companion to plan-lint. This does NOT render SVG or
// prove mathematical correctness: it checks source coverage and declared visible fields.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '../../../../..');
const sourceDir = path.join(repoRoot, 'archive/exams/types/high/h2');
const planDir = path.join(repoRoot, 'archive/tools/geometry-equation/production/plans');
const argumentsWithoutFlags = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const ledgerPath = argumentsWithoutFlags.length
  ? path.resolve(argumentsWithoutFlags[0])
  : path.join(planDir, 'typebank-geometry-source-first-001-006.audit.json');
const requireComplete = process.argv.includes('--require-complete');
const failures = [];
const fail = message => failures.push(message);

function questionsFromSource(file) {
  const source = fs.readFileSync(file, 'utf8');
  const prefix = 'window.questionBank = ';
  const begin = source.indexOf(prefix);
  if (begin < 0) throw new Error(`questionBank not found in ${file}`);
  const rest = source.slice(begin + prefix.length).trim();
  const end = rest.lastIndexOf('];');
  if (!rest.startsWith('[') || end < 0) throw new Error(`questionBank JSON boundary missing in ${file}`);
  const questions = JSON.parse(rest.slice(0, end + 1));
  if (!Array.isArray(questions)) throw new Error(`questionBank is not an array in ${file}`);
  return questions;
}

function figureFromSource(questions) {
  return questions.filter(row => typeof row.content === 'string' && row.content.includes('[그림:')).map(row => row.id);
}

function feature(plan, fieldPath) {
  const parts = fieldPath.split('.');
  let value = plan;
  for (let index = 0; index < parts.length; index += 1) {
    const key = parts[index];
    if (Array.isArray(value)) value = /^\d+$/.test(key) ? value[Number(key)] : value.find(item => item && item.id === key);
    else value = value?.[key];
    if (value === undefined) return undefined;
  }
  return value;
}

function inspectPlan(row, bank, question) {
  const planFolder = path.join(planDir, bank);
  const qid = String(row.qid).padStart(2, '0');
  const file = path.join(planFolder, `q${qid}-problem.plan.json`);
  if (!fs.existsSync(file)) return fail(`${bank} q${qid}: missing plan file`);
  const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
  const pointIds = (plan.points || []).map(point => point.id);
  const conicIds = (plan.conics || []).map(conic => conic.id);
  const lineIds = (plan.lines || []).map(line => line.id);
  const segmentIds = (plan.segments || []).map(segment => segment.id);
  const polygonIds = (plan.polygons || []).map(polygon => polygon.id);
  const constructionIds = [
    ...(plan.mathPlan?.nodes || []),
    ...(plan.displaySegments || []),
    ...(plan.displayLines || []),
    ...(plan.displayCircles || []),
    ...(plan.planeMarks?.expressionLabels || []),
    ...(plan.planeMarks?.dimensions || [])
  ].map(item => item.id);
  const permitted = new Set(['conic', 'conics', 'ellipse', 'ellipses', 'arch', ...conicIds, ...pointIds, ...lineIds, ...segmentIds, ...polygonIds, ...constructionIds]);
  if (!Array.isArray(plan.sourceConditions) || !plan.sourceConditions.length) fail(`${bank} q${qid}: missing sourceConditions`);
  for (const c of plan.sourceConditions || []) {
    if (!Array.isArray(c.mappedTo) || !c.mappedTo.length) {
      fail(`${bank} q${qid}: ${c.id} mappedTo must be a nonempty array`);
      continue;
    }
    for (const id of c.mappedTo) {
      const graphField = typeof id === 'string' && id.startsWith('graphPlan.') && feature(plan, id) !== undefined;
      if (!permitted.has(id) && !graphField) fail(`${bank} q${qid}: ${c.id} refers to a non-drawn/unknown id ${id}`);
    }
  }
  if (row.sourceQuote && !question.content.includes(row.sourceQuote)) fail(`${bank} q${qid}: sourceQuote not found in original`);
  if (typeof row.mathReview !== 'string' || !row.mathReview.trim()) fail(`${bank} q${qid}: missing independent math-review evidence`);
  if (!Array.isArray(row.requiredVisible) || !row.requiredVisible.length) fail(`${bank} q${qid}: no declared visible-field checks`);
  if (!['PASS', 'ENGINE_CAPABILITY_PENDING', 'CONTENT_MATH_BLOCKED'].includes(row.preRenderParity)) fail(`${bank} q${qid}: invalid preRenderParity`);
  if (row.preRenderParity === 'PASS' && row.planLintFull !== 'PASS') fail(`${bank} q${qid}: declared PASS without full lint`);
  if (row.preRenderParity === 'PASS' && row.blockers?.length) fail(`${bank} q${qid}: PASS has unresolved blockers`);
  if (row.preRenderParity !== 'PASS' && !row.blockers?.length) fail(`${bank} q${qid}: pending status lacks blocker`);
  if (row.renderSvg !== 'NOT_RUN' || row.studentChrome !== 'NOT_RUN' || row.a4 !== 'NOT_RUN') fail(`${bank} q${qid}: inaccurate render-state declaration`);
  for (const check of row.requiredVisible || []) {
    const actual = feature(plan, check.path);
    if (actual === undefined) fail(`${bank} q${qid}: missing visible field ${check.path}`);
    else if (Object.hasOwn(check, 'equals') && actual !== check.equals) fail(`${bank} q${qid}: ${check.path} expected ${JSON.stringify(check.equals)}, got ${JSON.stringify(actual)}`);
  }
  for (const forbidden of row.forbiddenVisible || []) {
    if (feature(plan, forbidden) !== undefined) fail(`${bank} q${qid}: answer-leak field must be absent: ${forbidden}`);
  }
}

function main() {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  const fileNames = fs.readdirSync(sourceDir).filter(name => /^기하_\d{3}_.*\.js$/.test(name));
  const records = ledger.figures || [];
  const seen = new Set();
  let figuresInSources = 0;
  for (let number = ledger.from; number <= ledger.to; number += 1) {
    const names = fileNames.filter(name => Number(name.slice(3, 6)) === number);
    if (names.length > 1) { fail(`file number ${number}: ambiguous source JS`); continue; }
    if (!names.length) {
      if (!ledger.missingSourceNumbers.includes(number)) fail(`file number ${number}: unrecorded source gap`);
      continue;
    }
    if (ledger.missingSourceNumbers.includes(number)) fail(`file number ${number}: incorrectly marked missing`);
    const questions = questionsFromSource(path.join(sourceDir, names[0]));
    const qids = figureFromSource(questions);
    figuresInSources += qids.length;
    for (const qid of qids) {
      const id = `${number}:${qid}`;
      const entries = records.filter(item => item.number === number && item.qid === qid);
      if (entries.length !== 1) { fail(`${id}: expected exactly one audit entry, got ${entries.length}`); continue; }
      seen.add(id);
      inspectPlan(entries[0], names[0].slice(0, -3), questions.find(question => question.id === qid));
    }
    for (const row of records.filter(item => item.number === number)) {
      if (!qids.includes(row.qid)) fail(`${number}:${row.qid}: audited a qid without [그림:]`);
    }
  }
  for (const row of records) if (!seen.has(`${row.number}:${row.qid}`)) fail(`${row.number}:${row.qid}: orphan audit entry`);
  const passed = records.filter(row => row.preRenderParity === 'PASS').length;
  const pending = records.length - passed;
  if (requireComplete && pending) fail(`${pending} figure(s) still ENGINE_CAPABILITY_PENDING/CONTENT_MATH_BLOCKED`);
  for (const error of failures) process.stderr.write(`FAIL ${error}\n`);
  process.stdout.write(`source-first gate: sourceFigures=${figuresInSources}, audited=${records.length}, preRenderPass=${passed}, pending=${pending}, violations=${failures.length}\n`);
  process.exitCode = failures.length ? 1 : 0;
}

try { main(); } catch (error) { process.stderr.write(`${error.stack || error}\n`); process.exitCode = 1; }
