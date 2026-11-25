#!/usr/bin/env node
'use strict';

// GPT FINAL QA only. This gate never renders SVG, approves mathematics by itself,
// changes an exam, or replaces CREATE/R1/R2/R3 release checks.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '../..');
const SCHEMA = 'gpt-finalqa-evidence-v1';
const AXES = ['problem', 'solution'];
const CHECKS = ['math', 'answerUniqueness', 'solution', 'curriculum', 'metadata', 'choices'];
const SEMANTIC_FIELDS = [
  'id', 'content', 'choices', 'answer', 'solution', 'questionType', 'points',
  'image', 'imageAlt', 'imageCaption',
  'curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey',
  'rpmPrimaryRecordId', 'problemTypeKey', 'templateKey',
  'difficultyBucket', 'crossConceptKeys', 'conditionKeys', 'integrationPattern'
];
const QUOTE_UNSUPPORTED = new Set(['number-line-figure-v1']);

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const issue = (issues, code, detail) => issues.push({ code, detail });
const nonblank = (value, min = 1) => typeof value === 'string' && value.trim().length >= min;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
const qidKey = (qid, axis) => `${qid}:${axis}`;

function semanticFingerprint(question) {
  const snapshot = {};
  for (const key of SEMANTIC_FIELDS) snapshot[key] = own(question, key) ? question[key] : null;
  return sha256(JSON.stringify(snapshot));
}

function readExam(filename) {
  const scope = { window: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), scope, {
    filename,
    timeout: 3000,
  });
  const bank = scope.window.questionBank;
  if (!Array.isArray(bank) || !bank.length) throw new Error('NO_QUESTION_BANK');
  const questions = JSON.parse(JSON.stringify(bank));
  const seen = new Set();
  for (const q of questions) {
    if (!Number.isInteger(q.id) || q.id < 1 || seen.has(q.id)) {
      throw new Error(`DUPLICATE_OR_INVALID_QID:${q.id}`);
    }
    seen.add(q.id);
    if (!nonblank(q.content) || !nonblank(q.solution) || !nonblank(String(q.answer ?? ''))) {
      throw new Error(`INCOMPLETE_QUESTION:${q.id}`);
    }
  }
  return questions;
}

function resolveRepoPath(root, rel) {
  if (!nonblank(rel) || path.isAbsolute(rel)) throw new Error('INVALID_REPO_RELATIVE_PATH');
  const absolute = path.resolve(root, rel);
  if (!absolute.startsWith(root + path.sep)) throw new Error('PATH_OUTSIDE_REPOSITORY');
  return absolute;
}

function examPaths(root, examRel) {
  const examPath = resolveRepoPath(root, examRel);
  if (!examRel.endsWith('.js')) throw new Error('EXAM_NOT_JS');
  const stem = examRel.slice(0, -3);
  return {
    examPath,
    examUid: path.basename(stem),
    ledgerPath: resolveRepoPath(root, stem + '.svg-followup-ledger.json'),
  };
}

// Read-only, target-specific static evidence checks. Semantic math still needs
// actual independent solving and a per-QID reviewer record.
function inspectPlans({ root = ROOT, examRel, questions, issues = [] }) {
  const { examUid, ledgerPath } = examPaths(root, examRel);
  const result = { totalAxes: questions.length * 2, inspectedAxes: 0, exempt: 0, assetBacked: 0, executable: 0, unsupported: 0, planFiles: [], axes: new Map() };
  if (!fs.existsSync(ledgerPath)) {
    issue(issues, 'MISSING_AXIS_LEDGER', ledgerPath);
    return result;
  }
  let ledger;
  try { ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8')); }
  catch (err) { issue(issues, 'INVALID_AXIS_LEDGER', String(err.message)); return result; }
  if (ledger.examUid !== examUid) issue(issues, 'LEDGER_UID_MISMATCH', String(ledger.examUid));
  if (!Array.isArray(ledger.axes)) {
    issue(issues, 'LEDGER_AXES_MISSING', examUid);
    return result;
  }
  const byId = new Map(questions.map(q => [q.id, q]));
  const seen = new Set();
  for (const axisRecord of ledger.axes) {
    const { qid, axis, necessity, planPath, planStatus, assetPath, assetGitBlobSha1 } = axisRecord || {};
    const key = qidKey(qid, axis);
    if (!byId.has(qid) || !AXES.includes(axis) || seen.has(key)) {
      issue(issues, 'BAD_AXIS_ID_OR_DUPLICATE', key);
      continue;
    }
    seen.add(key);
    result.inspectedAxes++;
    result.axes.set(key, { necessity, planStatus, planDigest: null });
    if (!['EXEMPT', 'BENEFICIAL', 'REQUIRED'].includes(necessity)) {
      issue(issues, 'INVALID_AXIS_NECESSITY', key);
      continue;
    }
    if (!nonblank(axisRecord.reason, 8)) issue(issues, 'AXIS_REASON_MISSING', key);
    if (necessity === 'EXEMPT') {
      result.exempt++;
      if (planStatus !== 'EXEMPT' || planPath || assetPath) issue(issues, 'EXEMPT_WITH_PLAN', key);
      continue;
    }
    // A REQUIRED problem figure may be an existing, immutable source PNG.
    // This is asset provenance, not a newly authored executable SVG plan.
    if (planStatus === 'EXISTING_SOURCE_ASSET_VERIFIED') {
      if (axis !== 'problem' || necessity !== 'REQUIRED' || planPath) {
        issue(issues, 'INVALID_SOURCE_ASSET_AXIS', key);
        continue;
      }
      let absolute;
      try { absolute = resolveRepoPath(root, assetPath); }
      catch (err) { issue(issues, 'BAD_SOURCE_ASSET_PATH', key + ':' + err.message); continue; }
      if (!fs.existsSync(absolute)) {
        issue(issues, 'SOURCE_ASSET_MISSING', key);
        continue;
      }
      const file = fs.readFileSync(absolute);
      if (!assetPath.endsWith('.png') ||
          !file.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
        issue(issues, 'SOURCE_ASSET_NOT_PNG', key);
        continue;
      }
      if ('archive/' + String(byId.get(qid).image || '') !== assetPath) {
        issue(issues, 'SOURCE_ASSET_NOT_REFERENCED_BY_QUESTION', key);
      }
      const gitBlobSha1 = crypto.createHash('sha1')
        .update('blob ' + file.length + '\0').update(file).digest('hex');
      if (gitBlobSha1 !== assetGitBlobSha1) {
        issue(issues, 'SOURCE_ASSET_BLOB_MISMATCH', key);
      }
      result.assetBacked++;
      result.axes.get(key).planDigest = sha256(file);
      continue;
    }
    if (assetPath) issue(issues, 'PLAN_AXIS_UNEXPECTED_ASSET', key);
    if (!nonblank(planPath)) {
      issue(issues, 'REQUIRED_PLAN_MISSING', key);
      continue;
    }
    let absolute;
    try { absolute = resolveRepoPath(root, planPath); }
    catch (err) { issue(issues, 'BAD_PLAN_PATH', `${key} ${err.message}`); continue; }
    if (!fs.existsSync(absolute)) {
      issue(issues, 'PLAN_FILE_MISSING', key);
      continue;
    }
    let plan;
    const raw = fs.readFileSync(absolute, 'utf8');
    try { plan = JSON.parse(raw); }
    catch (err) { issue(issues, 'PLAN_JSON_INVALID', key); continue; }
    result.axes.get(key).planDigest = sha256(raw);
    const source = byId.get(qid)[axis === 'problem' ? 'content' : 'solution'];
    if (plan.status === 'UNSUPPORTED') {
      result.unsupported++;
      if (planStatus !== 'ENGINE_CAPABILITY_PENDING' ||
          !nonblank(plan.requiredEngineExtension) ||
          !nonblank(plan.reason, 12) ||
          !Array.isArray(plan.studentRequirements) || !plan.studentRequirements.length) {
        issue(issues, 'UNSUPPORTED_HANDOFF_INCOMPLETE', key);
      }
      continue;
    }
    if (planStatus !== 'VALID_OFFICIAL_PLAN' || !nonblank(plan.capability)) {
      issue(issues, 'NON_EXECUTABLE_PLAN_MISLABELED', key);
      continue;
    }
    result.executable++;
    result.planFiles.push(absolute);
    if (!Array.isArray(plan.sourceConditions) || !plan.sourceConditions.length) {
      issue(issues, 'PLAN_SOURCE_CONDITIONS_MISSING', key);
    }
    if (QUOTE_UNSUPPORTED.has(plan.capability)) {
      if (own(plan, 'sourceQuote')) issue(issues, 'PLAN_QUOTE_NOT_SUPPORTED_BY_ENGINE', key);
    } else if (!nonblank(plan.sourceQuote, 12)) {
      issue(issues, 'PLAN_SOURCE_QUOTE_MISSING', key);
    } else if (!source.includes(plan.sourceQuote)) {
      issue(issues, 'PLAN_SOURCE_QUOTE_MISMATCH', key);
    }
    if (axis === 'problem' && plan.capability === 'construction-spike-v1') {
      const displayed = new Set(plan.displayPoints || []);
      const hidden = new Set(plan.hiddenPointNames || []);
      const coordinateLabels = new Set((Array.isArray(plan.coordinateLabels) ? plan.coordinateLabels : []).map(label =>
        typeof label === 'string' ? label : (label?.pointId || label?.id)));
      for (const node of plan.mathPlan?.nodes || []) {
        if (node.factRole === 'DERIVED_INTERMEDIATE' && coordinateLabels.has(node.id)) {
          issue(issues, 'PROBLEM_DERIVED_COORDINATE_REVEALED', `${key}:${node.id}`);
        }
        if (node.op === 'SOURCE_POINT' && node.factRole === 'DERIVED_INTERMEDIATE' &&
            displayed.has(node.id) &&
            (!hidden.has(node.id) || plan.hiddenPointStyle !== 'NONE')) {
          issue(issues, 'PROBLEM_DERIVED_SOURCE_POINT_VISIBLE', `${key}:${node.id}`);
        }
      }
    }
  }
  for (const q of questions) {
    for (const axis of AXES) {
      if (!seen.has(qidKey(q.id, axis))) issue(issues, 'AXIS_COVERAGE_MISSING', qidKey(q.id, axis));
    }
  }
  return result;
}

function expectedAxisStatus(axis) {
  if (!axis) return 'NOT_RUN';
  if (axis.necessity === 'EXEMPT') return 'EXEMPT';
  if (axis.planStatus === 'EXISTING_SOURCE_ASSET_VERIFIED') return 'SOURCE_ASSET_VERIFIED';
  if (axis.planStatus === 'ENGINE_CAPABILITY_PENDING') return 'ENGINE_PENDING';
  return 'PASS';
}

function makeBlindPack({ root = ROOT, examRel }) {
  const { examPath, examUid } = examPaths(root, examRel);
  const questions = readExam(examPath);
  let axes = [];
  try {
    const { ledgerPath } = examPaths(root, examRel);
    axes = JSON.parse(fs.readFileSync(ledgerPath, 'utf8')).axes || [];
  } catch { /* Missing REQUIRED input will separately fail inspectPlans. */ }
  function givenFigure(qid) {
    const found = axes.find(a => a.qid === qid && a.axis === 'problem' && a.necessity === 'REQUIRED');
    if (!found) return null;
    if (found.planStatus === 'EXISTING_SOURCE_ASSET_VERIFIED') {
      return { status: 'SOURCE_ASSET', assetPath: found.assetPath };
    }
    if (found.planStatus !== 'VALID_OFFICIAL_PLAN' || !found.planPath) {
      return { status: 'REQUIRED_FIGURE_UNAVAILABLE' };
    }
    try {
      const plan = JSON.parse(fs.readFileSync(resolveRepoPath(root, found.planPath), 'utf8'));
      return { status: 'PLAN_DESCRIPTION_ONLY', accessibilityDescription: plan.accessibilityDescription || '' };
    } catch { return { status: 'REQUIRED_FIGURE_UNAVAILABLE' }; }
  }
  return {
    schemaVersion: 'gpt-finalqa-blind-pack-v1',
    examUid,
    sourcePath: examRel,
    questions: questions.map(q => ({
      qid: q.id,
      questionType: q.questionType,
      content: q.content,
      choices: q.choices || [],
      points: q.points ?? null,
      requiredProblemFigure: givenFigure(q.id),
    })),
  };
}

function makeTemplate({ root = ROOT, examRel }) {
  const { examPath, examUid } = examPaths(root, examRel);
  const questions = readExam(examPath);
  const issues = [];
  const plans = inspectPlans({ root, examRel, questions, issues });
  return {
    schemaVersion: SCHEMA,
    examUid,
    sourcePath: examRel,
    blindPackDigest: sha256(JSON.stringify(makeBlindPack({ root, examRel }))),
    reviewer: { id: '', blindFirstPass: 'NOT_RUN', independentEvidence: '', blindArtifactRef: '' },
    questions: questions.map(q => ({
      qid: q.id,
      sourceFingerprint: semanticFingerprint(q),
      blindAnswer: '',
      blindReasoning: '',
      checks: Object.fromEntries(CHECKS.map(k => [k, k === 'choices' && !String(q.questionType).includes('객관식') ? 'NOT_APPLICABLE' : 'NOT_RUN'])),
      plan: Object.fromEntries(AXES.map(axis => [
        axis,
        { status: plans.axes.get(qidKey(q.id, axis))?.necessity === 'EXEMPT' ? 'EXEMPT' : 'NOT_RUN',
          planDigest: plans.axes.get(qidKey(q.id, axis))?.planDigest ?? null,
          reasoning: '' }
      ])),
    })),
    preflightProblems: issues, // Diagnostics, never auto-passes.
  };
}

function normalizedChoice(value) {
  const marks = '①②③④⑤';
  if (Number.isInteger(value) && value >= 1 && value <= 5) return marks[value - 1];
  if (typeof value === 'string' && /^[1-5]$/.test(value.trim())) return marks[Number(value.trim()) - 1];
  return String(value ?? '').trim();
}

function verifyEvidence({ root = ROOT, examRel, evidence, lint = false }) {
  const issues = [];
  const { examPath, examUid } = examPaths(root, examRel);
  const questions = readExam(examPath);
  const planReport = inspectPlans({ root, examRel, questions, issues });
  if (!evidence || evidence.schemaVersion !== SCHEMA ||
      evidence.examUid !== examUid || evidence.sourcePath !== examRel) {
    issue(issues, 'RECEIPT_ID_OR_SCHEMA_MISMATCH', examUid);
  }
  if (evidence?.blindPackDigest !== sha256(JSON.stringify(makeBlindPack({ root, examRel })))) {
    issue(issues, 'BLIND_PACK_STALE_OR_MISSING', examUid);
  }
  const reviewer = evidence?.reviewer;
  if (!nonblank(reviewer?.id) ||
      reviewer?.blindFirstPass !== 'CONFIRMED' ||
      !nonblank(reviewer?.independentEvidence, 12) ||
      !nonblank(reviewer?.blindArtifactRef)) {
    issue(issues, 'INDEPENDENT_REVIEW_EVIDENCE_MISSING', examUid);
  }
  const recorded = Array.isArray(evidence?.questions) ? evidence.questions : [];
  const seen = new Set();
  const byId = new Map(questions.map(q => [q.id, q]));
  for (const entry of recorded) {
    const q = byId.get(entry?.qid);
    if (!q || seen.has(entry.qid)) {
      issue(issues, 'REVIEW_QID_INVALID_OR_DUPLICATE', String(entry?.qid));
      continue;
    }
    seen.add(entry.qid);
    if (entry.sourceFingerprint !== semanticFingerprint(q)) {
      issue(issues, 'REVIEW_STALE_SOURCE', String(q.id));
    }
    if (!nonblank(entry.blindAnswer) || !nonblank(entry.blindReasoning, 12)) {
      issue(issues, 'BLIND_SOLUTION_EVIDENCE_MISSING', String(q.id));
    }
    if (String(q.questionType).includes('객관식') &&
        normalizedChoice(entry.blindAnswer) !== normalizedChoice(q.answer)) {
      issue(issues, 'BLIND_ANSWER_DISAGREES', String(q.id));
    }
    for (const k of CHECKS) {
      const expected = k === 'choices' && !String(q.questionType).includes('객관식') ? 'NOT_APPLICABLE' : 'PASS';
      if (entry.checks?.[k] !== expected) issue(issues, 'QUESTION_CHECK_INCOMPLETE', `${q.id}:${k}`);
    }
    for (const axis of AXES) {
      const ref = planReport.axes.get(qidKey(q.id, axis));
      const item = entry.plan?.[axis];
      const expected = expectedAxisStatus(ref);
      if (item?.status !== expected) issue(issues, 'PLAN_REVIEW_STATUS_MISMATCH', `${q.id}:${axis} expected ${expected}`);
      if (item?.planDigest !== (ref?.planDigest ?? null)) {
        issue(issues, 'PLAN_REVIEW_STALE', `${q.id}:${axis}`);
      }
      if (!nonblank(item?.reasoning, 8)) {
        issue(issues, 'PLAN_SEMANTIC_REASONING_MISSING', `${q.id}:${axis}`);
      }
    }
  }
  for (const q of questions) {
    if (!seen.has(q.id)) issue(issues, 'REVIEW_QID_MISSING', String(q.id));
  }
  const lintResults = [];
  if (lint && planReport.planFiles.length) {
    const lintTool = path.join(root, 'archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs');
    for (const mode of ['shallow', 'full']) {
      const args = [lintTool, ...(mode === 'shallow' ? ['--shallow'] : []), ...planReport.planFiles];
      const run = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', maxBuffer: 3 * 1024 * 1024, timeout: 120000 });
      lintResults.push({ mode, exitCode: run.status, output: (run.stdout || '') + (run.stderr || '') });
      if (run.status !== 0) issue(issues, 'OFFICIAL_PLAN_LINT_FAILED', mode + ':' + (run.error?.message || run.stderr || run.stdout || '').slice(0, 200));
    }
  }
  return {
    status: issues.length ? 'EVIDENCE_INCOMPLETE' : (lint ? 'QA_EVIDENCE_COMPLETE' : 'READY_FOR_OFFICIAL_LINT'),
    formalQualityCertifiedBySoftware: false,
    rendering: 'NOT_RUN_BY_DESIGN',
    questions: questions.length,
    reviewerQids: seen.size,
    axes: { expected: planReport.totalAxes, checked: planReport.inspectedAxes, exempt: planReport.exempt, assetBacked: planReport.assetBacked, executable: planReport.executable, unsupported: planReport.unsupported },
    lint: lint ? lintResults.map(({ mode, exitCode }) => ({ mode, exitCode })) : 'NOT_RUN',
    issues,
  };
}

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (['--template', '--blind-pack', '--no-lint'].includes(argv[i])) opts[argv[i].slice(2)] = true;
    else if (argv[i] === '--exam' || argv[i] === '--evidence') opts[argv[i].slice(2)] = argv[++i];
    else throw new Error('UNKNOWN_ARGUMENT:' + argv[i]);
  }
  if (!opts.exam) throw new Error('USAGE: --exam <repo-relative.js> [--blind-pack | --template | --evidence <file> [--no-lint]]');
  return opts;
}

function main() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (opts['blind-pack']) {
      process.stdout.write(JSON.stringify(makeBlindPack({ examRel: opts.exam }), null, 2) + '\n');
      return;
    }
    if (opts.template) {
      process.stdout.write(JSON.stringify(makeTemplate({ examRel: opts.exam }), null, 2) + '\n');
      return;
    }
    if (!opts.evidence) throw new Error('MISSING_EVIDENCE_PATH (use --template to start)');
    const evidence = JSON.parse(fs.readFileSync(opts.evidence, 'utf8'));
    const result = verifyEvidence({ examRel: opts.exam, evidence, lint: !opts['no-lint'] });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    if (result.status !== 'QA_EVIDENCE_COMPLETE') process.exitCode = 1;
  } catch (err) {
    process.stderr.write('FINALQA_GATE_ERROR:' + err.message + '\n');
    process.exitCode = 2;
  }
}

if (require.main === module) main();
module.exports = { SCHEMA, semanticFingerprint, readExam, inspectPlans, makeBlindPack, makeTemplate, verifyEvidence };
