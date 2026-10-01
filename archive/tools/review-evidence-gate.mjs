#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const SCHEMA = 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1';
const PASS = 'PASS';
const HOLD = 'HOLD';
const ALLOWED_STAGES = new Set(['CREATE', 'R1', 'R2', 'R3']);
const REQUIRED_AXES = [
  'sourceExact', 'answerMath', 'solutionMath', 'smallBoard',
  'curriculum', 'visualNecessity', 'meta', 'difficulty', 'runtimeString',
];
const HIGH_SIGNAL_TEX = [
  'dfrac', 'frac', 'sqrt', 'left', 'right', 'overline', 'text', 'mathrm',
  'mathbb', 'operatorname', 'cdot', 'times', 'leq', 'geq', 'neq', 'ne',
  'cup', 'cap', 'subset', 'supset', 'in', 'notin', 'emptyset', 'angle',
  'triangle', 'parallel', 'perp', 'vec', 'ell', 'qquad', 'mid',
];
const DOUBLE_TEX = new RegExp(`\\\\\\\\(${HIGH_SIGNAL_TEX.join('|')})(?![A-Za-z])`, 'g');
const ENUM_LABEL_RE = /(?:^|<br\s*\/?>|\n)\s*([ㄱ-ㅎ])\./g;

function parseArgs(argv) {
  const out = { stage: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--exam') out.exam = argv[++i];
    else if (arg === '--evidence') out.evidence = argv[++i];
    else if (arg === '--stage') out.stage = String(argv[++i] || '').toUpperCase();
    else if (arg === '--json') out.json = true;
    else throw new Error(`UNKNOWN_ARGUMENT:${arg}`);
  }
  if (!out.exam) throw new Error('EXAM_PATH_REQUIRED');
  if (!out.evidence) throw new Error('EVIDENCE_PATH_REQUIRED');
  if (!ALLOWED_STAGES.has(out.stage)) throw new Error('STAGE_CREATE_R1_R2_R3_REQUIRED');
  return out;
}

const sha256 = value => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const normalize = value => String(value || '').replaceAll('\\', '/');
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const hasValue = value => value !== undefined && value !== null && (typeof value !== 'string' || value.trim().length > 0);
function validHoldEvidence(item) {
  const hold = item?.holdEvidence;
  return Boolean(hold
    && nonEmpty(hold.reason)
    && hasValue(hold.observedEvidence)
    && nonEmpty(hold.unresolvedPoint)
    && nonEmpty(hold.nextRequiredEvidenceOrCapability)
    && hasValue(hold.repairAttempted)
    && hasValue(hold.authorityLookupAttempted)
    && nonEmpty(hold.whyDeterministicClosureImpossible));
}

function loadExam(file) {
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: file, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(questions) || questions.length === 0) throw new Error('QUESTION_BANK_REQUIRED');
  return { source, questions };
}

function array(value) { return Array.isArray(value) ? value : []; }

function collectEnumLabels(content) {
  const labels = [];
  for (const match of String(content || '').matchAll(ENUM_LABEL_RE)) {
    if (!labels.includes(match[1])) labels.push(match[1]);
  }
  return labels;
}

function enumSolutionSeparated(solution, labels) {
  const value = String(solution || '');
  return labels.every(label => new RegExp(`(?:^|\\n\\n|\\n)\\s*${label}\\.`).test(value));
}

function runtimeTexIssues(question) {
  const fields = [
    ['content', question.content], ['answer', question.answer], ['solution', question.solution],
    ...array(question.choices).map((choice, index) => [`choice${index + 1}`, choice]),
  ];
  const issues = [];
  for (const [field, raw] of fields) {
    const value = String(raw ?? '');
    DOUBLE_TEX.lastIndex = 0;
    for (const match of value.matchAll(DOUBLE_TEX)) issues.push(`${field}:runtime-double-slash-${match[1]}`);
  }
  return issues;
}

function checkQuestionRows(questions, evidence, issues) {
  const rows = array(evidence.questionRows);
  const byQid = new Map();
  for (const row of rows) {
    const qid = Number(row?.qid);
    if (!Number.isInteger(qid)) { issues.push('QUESTION_ROW_QID_INVALID'); continue; }
    if (byQid.has(qid)) issues.push(`QUESTION_ROW_DUPLICATE:q${qid}`);
    byQid.set(qid, row);
  }
  for (const q of questions) {
    const row = byQid.get(Number(q.id));
    if (!row) { issues.push(`QUESTION_ROW_MISSING:q${q.id}`); continue; }
    for (const axis of REQUIRED_AXES) {
      const item = row[axis];
      if (!item || ![PASS, HOLD].includes(item.status)) {
        issues.push(`QUESTION_AXIS_EVIDENCE_MISSING:q${q.id}:${axis}`);
        continue;
      }
      if (item.status === PASS && !nonEmpty(item.evidence)) {
        issues.push(`QUESTION_AXIS_PASS_EVIDENCE_MISSING:q${q.id}:${axis}`);
      }
      if (item.status === HOLD && !validHoldEvidence(item)) {
        issues.push(`QUESTION_AXIS_HOLD_EVIDENCE_INCOMPLETE:q${q.id}:${axis}`);
      }
    }
    const tex = runtimeTexIssues(q);
    for (const issue of tex) issues.push(`RUNTIME_TEX_FAIL:q${q.id}:${issue}`);
    const labels = collectEnumLabels(q.content);
    if (labels.length >= 2 && !enumSolutionSeparated(q.solution, labels)) {
      issues.push(`SMALLBOARD_ENUMERATION_FAIL:q${q.id}:${labels.join(',')}`);
    }
  }
  const actual = new Set(questions.map(q => Number(q.id)));
  for (const qid of byQid.keys()) if (!actual.has(qid)) issues.push(`QUESTION_ROW_ORPHAN:q${qid}`);
  const heldQids = [...byQid.entries()]
    .filter(([, row]) => REQUIRED_AXES.some(axis => row?.[axis]?.status === HOLD))
    .map(([qid]) => qid)
    .sort((a, b) => a - b);
  return { rowCount: rows.length, heldQids };
}

function checkVisualRows(examFile, questions, evidence, issues) {
  const visualQuestions = questions.filter(q => nonEmpty(q.solutionImage));
  const rows = array(evidence.visualRows);
  const byQid = new Map(rows.map(row => [Number(row?.qid), row]));
  for (const q of visualQuestions) {
    const row = byQid.get(Number(q.id));
    if (!row) { issues.push(`VISUAL_ROW_MISSING:q${q.id}`); continue; }
    if (row.result !== PASS) issues.push(`VISUAL_ROW_NOT_PASS:q${q.id}`);
    if (normalize(row.assetPath) !== normalize(q.solutionImage)) issues.push(`VISUAL_PATH_MISMATCH:q${q.id}`);
    if (!array(row.expectedFacts).length || !array(row.observedFacts).length) issues.push(`VISUAL_FACTS_MISSING:q${q.id}`);
    const checks = array(row.checks);
    if (!checks.length) issues.push(`VISUAL_CHECKS_MISSING:q${q.id}`);
    if (!checks.some(check => ['COORDINATE_COMPUTE', 'TOPOLOGY_COMPUTE', 'SOURCE_PIXEL', 'TARGETED_RENDER'].includes(check?.method))) {
      issues.push(`VISUAL_PHYSICAL_METHOD_MISSING:q${q.id}`);
    }
    for (const [index, check] of checks.entries()) {
      if (check?.result !== PASS || !nonEmpty(check?.predicate) || check?.expected == null || check?.observed == null) {
        issues.push(`VISUAL_CHECK_INCOMPLETE:q${q.id}:${index + 1}`);
      }
      if (check?.method === 'TEXT_LABEL_ONLY') issues.push(`VISUAL_TEXT_ONLY_FORBIDDEN:q${q.id}:${index + 1}`);
    }
    const asset = path.resolve(path.dirname(examFile), '..', '..', '..', '..', q.solutionImage);
    const repoGuess = examFile.slice(0, examFile.lastIndexOf(`${path.sep}archive${path.sep}`));
    const repoAsset = repoGuess ? path.join(repoGuess, 'archive', q.solutionImage.replace(/^assets\//, 'assets/')) : asset;
    const candidates = [repoAsset, asset].filter(Boolean);
    const actualAsset = candidates.find(candidate => fs.existsSync(candidate));
    if (!actualAsset) { issues.push(`VISUAL_ASSET_NOT_FOUND:q${q.id}`); continue; }
    const bytes = fs.readFileSync(actualAsset);
    const actualSha = sha256(bytes);
    if (!nonEmpty(row.assetSha256) || row.assetSha256 !== actualSha) issues.push(`VISUAL_SHA_MISMATCH:q${q.id}`);
  }
  const expectedIds = new Set(visualQuestions.map(q => Number(q.id)));
  for (const row of rows) if (!expectedIds.has(Number(row?.qid))) issues.push(`VISUAL_ROW_ORPHAN:q${row?.qid}`);
  return { expected: visualQuestions.length, actual: rows.length };
}

function checkMetaRows(questions, evidence, issues) {
  const rows = array(evidence.metaRows);
  const byQid = new Map(rows.map(row => [Number(row?.qid), row]));
  for (const q of questions) {
    const row = byQid.get(Number(q.id));
    if (!row) { issues.push(`META_ROW_MISSING:q${q.id}`); continue; }
    if (![PASS, HOLD].includes(row.result) || !nonEmpty(row.primaryMethod) || !nonEmpty(row.decisiveStep)) {
      issues.push(`META_SEMANTIC_EVIDENCE_MISSING:q${q.id}`);
    }
    if (row.result === HOLD && !validHoldEvidence(row)) issues.push(`META_HOLD_EVIDENCE_INCOMPLETE:q${q.id}`);
    if (!nonEmpty(row.rpmDisposition) || !nonEmpty(row.projectionDisposition) || !array(row.lookupRefs).length) issues.push(`META_LOOKUP_EVIDENCE_MISSING:q${q.id}`);
    const ptNull = !nonEmpty(q.problemTypeKey);
    const tplNull = !nonEmpty(q.templateKey);
    if ((ptNull || tplNull) && row.projectionDisposition === 'EXACT_ACTIVE') issues.push(`META_NULL_BUT_RESOLVABLE:q${q.id}`);
    if ((ptNull || tplNull) && !nonEmpty(row.nullReason)) issues.push(`META_NULL_REASON_REQUIRED:q${q.id}`);
    if (nonEmpty(q.problemTypeKey) && row.problemTypeKey && row.problemTypeKey !== q.problemTypeKey) issues.push(`META_PT_EVIDENCE_MISMATCH:q${q.id}`);
    if (nonEmpty(q.templateKey) && row.templateKey && row.templateKey !== q.templateKey) issues.push(`META_TPL_EVIDENCE_MISMATCH:q${q.id}`);
  }
  const heldQids = rows.filter(row => row?.result === HOLD)
    .map(row => Number(row?.qid))
    .filter(Number.isInteger)
    .sort((a, b) => a - b);
  return { rowCount: rows.length, heldQids };
}

function checkIndependence(stage, evidence, issues) {
  const i = evidence.independence || {};
  if (stage === 'R1' && i.createReceiptUsedAsAuthority !== false) issues.push('R1_INDEPENDENCE_FLAG_REQUIRED');
  if (stage === 'R2') {
    if (i.blindDecisionFrozenBeforeR1Compare !== true) issues.push('R2_BLIND_FREEZE_REQUIRED');
    if (!nonEmpty(i.blindFreezeSha256)) issues.push('R2_BLIND_FREEZE_SHA_REQUIRED');
  }
  if (stage === 'R3') {
    if (i.freshFromArtifactBytes !== true) issues.push('R3_FRESH_BYTES_REQUIRED');
    if (i.priorStageCountsUsedAsEvidence !== false) issues.push('R3_PRIOR_COUNTS_FORBIDDEN');
  }
}

function checkSummary(evidence, derived, issues) {
  const summary = evidence.summary || {};
  for (const [key, value] of Object.entries(derived)) {
    if (summary[key] != null && Number(summary[key]) !== Number(value)) issues.push(`SUMMARY_COUNT_MISMATCH:${key}`);
  }
}

export function validatePhysicalEvidence({ examFile, evidenceFile, stage }) {
  const { source, questions } = loadExam(examFile);
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
  const issues = [];
  if (evidence.schemaVersion !== SCHEMA) issues.push('EVIDENCE_SCHEMA_INVALID');
  if (String(evidence.stage || '').toUpperCase() !== stage) issues.push('EVIDENCE_STAGE_MISMATCH');
  if (normalize(evidence.examPath) && !normalize(examFile).endsWith(normalize(evidence.examPath))) issues.push('EVIDENCE_EXAM_PATH_MISMATCH');
  const examSha = sha256(source);
  if (evidence.examSha256 !== examSha) issues.push('EVIDENCE_EXAM_SHA_MISMATCH');
  if (Number(evidence.questionCount) !== questions.length) issues.push('EVIDENCE_QUESTION_COUNT_MISMATCH');

  const questionEvidence = checkQuestionRows(questions, evidence, issues);
  const visual = checkVisualRows(examFile, questions, evidence, issues);
  const metaEvidence = checkMetaRows(questions, evidence, issues);
  checkIndependence(stage, evidence, issues);

  const heldQids = [...new Set([...questionEvidence.heldQids, ...metaEvidence.heldQids])].sort((a, b) => a - b);
  if (stage === 'R3' && heldQids.length) issues.push(`R3_ITEM_HOLD_FORBIDDEN:${heldQids.join(',')}`);

  const derived = {
    questionCount: questions.length,
    questionEvidenceRows: questionEvidence.rowCount,
    linkedSolutionVisualCount: visual.expected,
    visualEvidenceRows: visual.actual,
    metaEvidenceRows: metaEvidence.rowCount,
    itemHoldCount: heldQids.length,
  };
  checkSummary(evidence, derived, issues);

  return {
    ok: issues.length === 0,
    schemaVersion: SCHEMA,
    stage,
    examPath: normalize(examFile),
    examSha256: examSha,
    ...derived,
    itemHoldQids: heldQids,
    disposition: issues.length ? 'FAIL' : heldQids.length ? 'PASS_WITH_ITEM_HOLDS' : 'PASS',
    issues,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const report = validatePhysicalEvidence({
      examFile: path.resolve(args.exam), evidenceFile: path.resolve(args.evidence), stage: args.stage,
    });
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exitCode = 2;
  }
}
