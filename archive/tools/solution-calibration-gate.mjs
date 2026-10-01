#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const PASS = 'PASS';
const REQUIRED_AXES = Object.freeze([
  'STUDENT_REPRODUCIBILITY',
  'SMALL_BOARD_STRUCTURE',
  'EXPLANATION_DENSITY',
  'VISUAL_SEMANTIC_PARITY',
  'VISUAL_READABILITY',
]);
const REQUIRED_NEGATIVE = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const SUPPORTED_STAGES = new Set([
  'CREATE', 'R1', 'R2', 'R3', 'SOLUTION_UPGRADE',
  'REPAIR', 'R3_REPAIR', 'ITEM_RECOVERY', 'VISUAL_REPAIR', 'INDEPENDENT_RECHECK',
]);
const REPAIR_STAGES = new Set(['REPAIR', 'R3_REPAIR', 'ITEM_RECOVERY', 'VISUAL_REPAIR']);

const sha256 = value => 'sha256:' + crypto.createHash('sha256').update(value).digest('hex');
const gitBlobSha = value => {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');
};
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const array = value => Array.isArray(value) ? value : [];
const normalize = value => String(value || '').replaceAll('\\', '/');

function findRepoRoot(examFile) {
  const starts = [path.dirname(path.resolve(examFile)), process.cwd()];
  for (const start of starts) {
    let dir = start;
    for (;;) {
      if (fs.existsSync(path.join(dir, '.git'))) return dir;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  throw new Error('CALIBRATION_REPO_ROOT_NOT_FOUND');
}

function resolveRef(root, refPath) {
  const rel = normalize(refPath);
  if (!nonEmpty(rel) || rel.startsWith('/') || rel.includes('..')) throw new Error('CALIBRATION_REF_PATH_INVALID');
  const absolute = path.resolve(root, ...rel.split('/'));
  if (!(absolute === root || absolute.startsWith(root + path.sep))) throw new Error('CALIBRATION_REF_ESCAPES_REPO');
  return { rel, absolute };
}

function bindRef(root, ref, issues, prefix, predicate = null) {
  if (!ref || !nonEmpty(ref.path) || !nonEmpty(ref.sha256) || !nonEmpty(ref.gitBlobSha)) {
    issues.push(prefix + '_REF_INCOMPLETE');
    return null;
  }
  let resolved;
  try { resolved = resolveRef(root, ref.path); }
  catch (error) { issues.push(prefix + '_REF_INVALID:' + error.message); return null; }
  if (predicate && !predicate(resolved.rel)) {
    issues.push(prefix + '_PATH_FORBIDDEN:' + resolved.rel);
    return null;
  }
  if (!fs.existsSync(resolved.absolute) || !fs.statSync(resolved.absolute).isFile()) {
    issues.push(prefix + '_REF_NOT_FOUND:' + resolved.rel);
    return null;
  }
  const bytes = fs.readFileSync(resolved.absolute);
  if (sha256(bytes) !== ref.sha256) issues.push(prefix + '_SHA256_MISMATCH:' + resolved.rel);
  if (gitBlobSha(bytes) !== ref.gitBlobSha) issues.push(prefix + '_BLOB_SHA_MISMATCH:' + resolved.rel);
  return { ...resolved, bytes };
}

function loadQuestions(file) {
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: file, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(questions) || !questions.length) throw new Error('QUESTION_BANK_REQUIRED');
  return questions;
}

function expectedMode(stage) {
  if (stage === 'CREATE') return new Set(['SOURCE_ONLY_CREATE', 'FRESH_REWRITE_CREATE']);
  if (stage === 'SOLUTION_UPGRADE') return new Set(['EXISTING_SOLUTION_UPGRADE']);
  if (REPAIR_STAGES.has(stage)) return new Set(['TARGETED_REPAIR']);
  if (stage === 'INDEPENDENT_RECHECK') return new Set(['INDEPENDENT_RECHECK']);
  return new Set(['INDEPENDENT_REVIEW']);
}

function expectedOrder(stage) {
  if (stage === 'SOLUTION_UPGRADE') return 'SAMPLES_PREFLIGHT_THEN_BASELINE_REVIEW_THEN_UPGRADE';
  if (REPAIR_STAGES.has(stage)) return 'SAMPLES_PREFLIGHT_THEN_DEFECT_SCOPE_FREEZE_THEN_REPAIR';
  return 'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE';
}

function validateBinding({ examFile, questions, evidence, stage, requireCompare }) {
  const issues = [];
  const c = evidence?.solutionQualityCalibration;
  if (!SUPPORTED_STAGES.has(stage)) return ['CALIBRATION_STAGE_UNSUPPORTED:' + stage];
  if (!c || typeof c !== 'object') return ['SOLUTION_CALIBRATION_REQUIRED'];

  if (c.sampleReadBeforeWork !== true) issues.push('CALIBRATION_SAMPLE_READ_BEFORE_WORK_REQUIRED');
  if (c.calibrationStatus !== PASS) issues.push('CALIBRATION_STATUS_PASS_REQUIRED');
  if (!expectedMode(stage).has(c.solutionWorkMode)) issues.push('CALIBRATION_WORK_MODE_INVALID:' + stage);
  if (c.calibrationOrder !== expectedOrder(stage)) issues.push('CALIBRATION_ORDER_INVALID:' + stage);

  const axes = new Set(array(c.calibrationAxes));
  for (const axis of REQUIRED_AXES) if (!axes.has(axis)) issues.push('CALIBRATION_AXIS_REQUIRED:' + axis);

  if (requireCompare) {
    const count = /^([0-9]+)\/([0-9]+)$/.exec(String(c.qualityCompareCount || ''));
    if (!count || Number(count[1]) !== questions.length || Number(count[2]) !== questions.length) {
      issues.push('CALIBRATION_QUALITY_COMPARE_COUNT_MISMATCH');
    }
  }

  let root;
  try { root = findRepoRoot(examFile); }
  catch (error) { issues.push(error.message); return issues; }

  const targetRel = normalize(path.relative(root, path.resolve(examFile)));
  const golden = array(c.goldenSampleRefs);
  if (![2, 3].includes(golden.length) || new Set(golden.map(x => normalize(x?.path))).size !== golden.length) {
    issues.push('CALIBRATION_REQUIRES_2_OR_3_DISTINCT_GOLDEN_SAMPLES');
  }

  const banks = new Map();
  for (const ref of golden) {
    const bound = bindRef(root, ref, issues, 'GOLDEN_SAMPLE',
      p => /^archive\/exams\/original\/.+\.js$/.test(p) && p !== targetRel);
    if (!bound) continue;
    try { banks.set(bound.rel, loadQuestions(bound.absolute)); }
    catch (error) { issues.push('GOLDEN_SAMPLE_JS_INVALID:' + bound.rel + ':' + error.message); }
  }

  const seen = new Set();
  const counts = new Map();
  for (const ref of array(c.goldenSampleQuestionRefs)) {
    const samplePath = normalize(ref?.path);
    const qid = Number(ref?.qid);
    const key = samplePath + '|q' + qid;
    if (seen.has(key)) {
      issues.push('GOLDEN_SAMPLE_QUESTION_DUPLICATE:' + key);
      continue;
    }
    seen.add(key);

    const bank = banks.get(samplePath);
    const question = bank?.find(item => Number(item.id) === qid);
    if (!bank || !Number.isInteger(qid) || !question || !nonEmpty(question.solution)) {
      issues.push('GOLDEN_SAMPLE_QUESTION_NOT_FOUND:' + key);
      continue;
    }
    if (ref.solutionSha256 !== sha256(String(question.solution))) {
      issues.push('GOLDEN_SAMPLE_SOLUTION_SHA_MISMATCH:' + key);
    }
    if (!nonEmpty(ref.solutionExcerpt) || !String(question.solution).includes(ref.solutionExcerpt)) {
      issues.push('GOLDEN_SAMPLE_SOLUTION_EXCERPT_MISSING_OR_STALE:' + key);
    }
    if (!nonEmpty(ref.observation)) issues.push('GOLDEN_SAMPLE_QUESTION_OBSERVATION_REQUIRED:' + key);
    counts.set(samplePath, (counts.get(samplePath) || 0) + 1);
  }
  for (const samplePath of banks.keys()) {
    const count = counts.get(samplePath) || 0;
    if (count < 2 || count > 5) {
      issues.push('GOLDEN_SAMPLE_REPRESENTATIVE_QUESTION_COUNT_INVALID:' + samplePath + ':' + count);
    }
  }

  const negatives = array(c.negativeSampleRefs);
  if (!negatives.length) issues.push('NEGATIVE_SAMPLE_REQUIRED');
  let bokseong = false;
  for (const ref of negatives) {
    const bound = bindRef(root, ref, issues, 'NEGATIVE_SAMPLE');
    if (bound?.rel === REQUIRED_NEGATIVE) bokseong = true;
  }
  if (!bokseong) issues.push('BOKSEONG_FALSE_PASS_NEGATIVE_SAMPLE_REQUIRED');

  return issues;
}

export function validateSolutionCalibrationPreflight({ examFile, questions, evidence, stage }) {
  return validateBinding({ examFile, questions, evidence, stage, requireCompare: false });
}

export function validateSolutionCalibration({ examFile, questions, evidence, stage }) {
  return validateBinding({ examFile, questions, evidence, stage, requireCompare: true });
}

function parseArgs(argv) {
  const out = { stage: '', preflight: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--exam') out.exam = argv[++i];
    else if (arg === '--evidence') out.evidence = argv[++i];
    else if (arg === '--stage') out.stage = String(argv[++i] || '').toUpperCase();
    else if (arg === '--preflight') out.preflight = true;
    else if (arg === '--json') out.json = true;
    else throw new Error('UNKNOWN_ARGUMENT:' + arg);
  }
  if (!out.exam) throw new Error('EXAM_PATH_REQUIRED');
  if (!out.evidence) throw new Error('EVIDENCE_PATH_REQUIRED');
  if (!SUPPORTED_STAGES.has(out.stage)) throw new Error('CALIBRATION_STAGE_REQUIRED');
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const examFile = path.resolve(args.exam);
    const questions = loadQuestions(examFile);
    const evidence = JSON.parse(fs.readFileSync(path.resolve(args.evidence), 'utf8'));
    const issues = args.preflight
      ? validateSolutionCalibrationPreflight({ examFile, questions, evidence, stage: args.stage })
      : validateSolutionCalibration({ examFile, questions, evidence, stage: args.stage });
    const report = {
      ok: issues.length === 0,
      stage: args.stage,
      gate: args.preflight ? 'CALIBRATION_PREFLIGHT' : 'CALIBRATION_CLOSURE',
      questionCount: questions.length,
      issues,
    };
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exitCode = 2;
  }
}
