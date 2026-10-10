#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const BASELINE_COMMIT = '13457a7e86ab5f30a3cea2866e2b9c20dace30a2';
const SOURCE_PATH = 'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js';
const BASELINE_SHA256 = 'sha256:804586432b5d1100740f025700a14092b4cdd57a2443ccda7efb8cff3f9b65d5';
const REQUIRED_NEGATIVE = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const TARGETS = [
  'archive/data/r2e-intake/m2/21_연향중_1학기_중간_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/19_연향중_1학기_중간_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/24_연향중_1학기_기말_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/24_승평중_1학기_기말_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/24_삼산중_1학기_기말_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/23_신흥중_1학기_기말_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/22_왕운중_1학기_기말_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/22_연향중_1학기_기말_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/24_왕운중_1학기_기말_중2_기출.create.physical-evidence.json',
  'archive/data/r2e-intake/m2/24_금당중_1학기_기말_중2_기출.create.physical-evidence.json',
];
const REQUIRED_AXES = [
  'STUDENT_REPRODUCIBILITY', 'SMALL_BOARD_STRUCTURE', 'EXPLANATION_DENSITY',
  'VISUAL_SEMANTIC_PARITY', 'VISUAL_READABILITY',
];
const sha256 = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const gitBlobSha = bytes => crypto.createHash('sha1')
  .update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');

function fail(message) { throw new Error(message); }
function parseBank(source, label) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: label, timeout: 5000 });
  const bank = context.window.questionBank || context.window.questions;
  if (!Array.isArray(bank) || !bank.length) fail(`QUESTION_BANK_REQUIRED:${label}`);
  return bank;
}
function assertHistoricalDelta(root, sampleQuestionRefs) {
  const previousBytes = execFileSync('git', ['show', `${BASELINE_COMMIT}:${SOURCE_PATH}`], { cwd: root });
  const currentBytes = fs.readFileSync(path.join(root, SOURCE_PATH));
  if (sha256(previousBytes) !== BASELINE_SHA256) fail('HISTORICAL_SOURCE_SHA_UNEXPECTED');
  const oldBank = parseBank(previousBytes.toString('utf8'), `git:${BASELINE_COMMIT}:${SOURCE_PATH}`);
  const currentBank = parseBank(currentBytes.toString('utf8'), SOURCE_PATH);
  const referenced = new Set(sampleQuestionRefs.filter(r => r.path === SOURCE_PATH).map(r => Number(r.qid)));
  if (referenced.size !== 2 || !referenced.has(1) || !referenced.has(2)) fail('EXPECTED_MASAN_Q1_Q2_REFERENCES_REQUIRED');
  for (const id of [1, 2]) {
    const oldQ = oldBank.find(q => Number(q.id) === id);
    const currentQ = currentBank.find(q => Number(q.id) === id);
    if (!oldQ || !currentQ || JSON.stringify(oldQ) !== JSON.stringify(currentQ)) {
      fail(`REFERENCED_SOURCE_QUESTION_CHANGED:q${id}`);
    }
  }
  if (oldBank.length !== currentBank.length) fail('SOURCE_QUESTION_DENOMINATOR_CHANGED');
  const allowedChanged = new Set([10, 12]);
  for (const oldQ of oldBank) {
    const currentQ = currentBank.find(q => Number(q.id) === Number(oldQ.id));
    if (!currentQ) fail(`SOURCE_QID_MISSING:q${oldQ.id}`);
    if (JSON.stringify(oldQ) === JSON.stringify(currentQ)) continue;
    if (!allowedChanged.has(Number(oldQ.id))) fail(`UNEXPECTED_SOURCE_QUESTION_CHANGED:q${oldQ.id}`);
    const oldContent = String(oldQ.content || '').replaceAll('\n', '');
    const currentContent = String(currentQ.content || '').replaceAll('\n', '');
    const oldRemainder = { ...oldQ }; delete oldRemainder.content;
    const currentRemainder = { ...currentQ }; delete currentRemainder.content;
    if (oldContent !== currentContent || JSON.stringify(oldRemainder) !== JSON.stringify(currentRemainder)) {
      fail(`UNREFERENCED_SOURCE_CHANGE_NOT_LINE_WRAP_ONLY:q${oldQ.id}`);
    }
  }
  return {
    historicalSourceSha256: sha256(previousBytes),
    currentSourceSha256: sha256(currentBytes),
    currentSourceGitBlobSha: gitBlobSha(currentBytes),
    verifiedQids: [1, 2],
    changedUnreferencedQids: [10, 12],
    deltaFinding: 'Only line-wrap newlines in unreferenced q10/q12 content differ; all remaining question fields and all referenced q1/q2 are exact.',
  };
}
function validateBundle(root, rel, sourceFinding) {
  const abs = path.join(root, rel);
  const raw = fs.readFileSync(abs, 'utf8');
  const evidence = JSON.parse(raw);
  const calibration = evidence.solutionQualityCalibration;
  if (evidence.schemaVersion !== 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1' || evidence.stage !== 'CREATE') fail(`TARGET_SCHEMA_OR_STAGE_INVALID:${rel}`);
  if (!calibration || calibration.sampleReadBeforeWork !== true || calibration.calibrationStatus !== 'PASS') fail(`CALIBRATION_PREFLIGHT_STATE_INVALID:${rel}`);
  if (REQUIRED_AXES.some(axis => !calibration.calibrationAxes?.includes(axis))) fail(`CALIBRATION_AXIS_MISSING:${rel}`);
  if (!Array.isArray(calibration.goldenSampleRefs) || calibration.goldenSampleRefs.length < 2 || calibration.goldenSampleRefs.length > 3) fail(`GOLDEN_SAMPLE_COUNT_INVALID:${rel}`);

  const goldenByPath = new Map();
  for (const ref of calibration.goldenSampleRefs) {
    if (!ref?.path || goldenByPath.has(ref.path)) fail(`GOLDEN_SAMPLE_PATH_DUPLICATE_OR_MISSING:${rel}`);
    goldenByPath.set(ref.path, ref);
    const bytes = fs.readFileSync(path.join(root, ref.path));
    if (ref.path === SOURCE_PATH) {
      const expectedOldBlob = execFileSync('git', ['rev-parse', `${BASELINE_COMMIT}:${SOURCE_PATH}`], { cwd: root, encoding: 'utf8' }).trim();
      const currentBindingValid = ref.sha256 === sha256(bytes) && ref.gitBlobSha === gitBlobSha(bytes)
        && evidence.evidenceBindingHistory?.schemaVersion === 'JS_ARCHIVE_EVIDENCE_BINDING_HISTORY_V1'
        && evidence.evidenceBindingHistory.entries?.some(entry => entry.sourcePath === SOURCE_PATH
          && entry.previous?.sha256 === BASELINE_SHA256
          && entry.current?.sha256 === ref.sha256
          && entry.current?.gitBlobSha === ref.gitBlobSha);
      const historicalBindingValid = ref.sha256 === BASELINE_SHA256 && ref.gitBlobSha === expectedOldBlob;
      if (!historicalBindingValid && !currentBindingValid) {
        fail(`HISTORICAL_GOLDEN_BINDING_UNEXPECTED:${rel}`);
      }
    } else if (sha256(bytes) !== ref.sha256 || gitBlobSha(bytes) !== ref.gitBlobSha) {
      fail(`OTHER_GOLDEN_BINDING_STALE:${rel}:${ref.path}`);
    }
  }
  if (!goldenByPath.has(SOURCE_PATH)) fail(`COMMON_GOLDEN_SAMPLE_MISSING:${rel}`);

  const perSample = new Map();
  const refs = calibration.goldenSampleQuestionRefs;
  if (!Array.isArray(refs)) fail(`GOLDEN_QUESTION_REFS_MISSING:${rel}`);
  const seen = new Set();
  for (const ref of refs) {
    const count = (perSample.get(ref.path) || 0) + 1;
    perSample.set(ref.path, count);
    const key = `${ref.path}|${ref.qid}`;
    if (seen.has(key)) fail(`GOLDEN_QUESTION_DUPLICATE:${rel}:${key}`);
    seen.add(key);
    const bank = parseBank(fs.readFileSync(path.join(root, ref.path), 'utf8'), ref.path);
    const question = bank.find(item => Number(item.id) === Number(ref.qid));
    if (!question || typeof question.solution !== 'string' || !question.solution.trim()) fail(`GOLDEN_QUESTION_MISSING:${rel}:${key}`);
    if (sha256(Buffer.from(question.solution)) !== ref.solutionSha256) fail(`GOLDEN_SOLUTION_SHA_STALE:${rel}:${key}`);
    if (typeof ref.solutionExcerpt !== 'string' || !ref.solutionExcerpt.trim() || !question.solution.includes(ref.solutionExcerpt)) fail(`GOLDEN_EXCERPT_STALE:${rel}:${key}`);
    if (typeof ref.observation !== 'string' || !ref.observation.trim()) fail(`GOLDEN_OBSERVATION_MISSING:${rel}:${key}`);
  }
  for (const samplePath of goldenByPath.keys()) {
    const count = perSample.get(samplePath) || 0;
    if (count < 2 || count > 5) fail(`GOLDEN_QUESTION_COUNT_INVALID:${rel}:${samplePath}:${count}`);
  }
  const sourceFindingForBundle = assertHistoricalDelta(root, refs);
  if (sourceFindingForBundle.currentSourceSha256 !== sourceFinding.currentSourceSha256) fail('SOURCE_CHANGED_DURING_PREFLIGHT');

  const negatives = calibration.negativeSampleRefs;
  if (!Array.isArray(negatives) || negatives.length < 1 || !negatives.some(ref => ref.path === REQUIRED_NEGATIVE)) fail(`REQUIRED_NEGATIVE_SAMPLE_MISSING:${rel}`);
  for (const ref of negatives) {
    const bytes = fs.readFileSync(path.join(root, ref.path));
    if (sha256(bytes) !== ref.sha256 || gitBlobSha(bytes) !== ref.gitBlobSha) fail(`NEGATIVE_SAMPLE_BINDING_STALE:${rel}:${ref.path}`);
  }
  return { rel, raw, evidence, oldRef: goldenByPath.get(SOURCE_PATH), sourceFinding: sourceFindingForBundle };
}
function findMatching(text, start, openChar, closeChar) {
  let depth = 0; let quoted = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
    if (c === '"') { quoted = true; continue; }
    if (c === openChar) depth += 1;
    else if (c === closeChar && --depth === 0) return i;
  }
  fail('JSON_TEXT_BLOCK_UNCLOSED');
}
function replaceField(block, field, expected, replacement) {
  const escapedExpected = JSON.stringify(expected).slice(1, -1);
  const pattern = new RegExp(`("${field}"\\s*:\\s*")(${escapedExpected})(?=")`);
  const match = pattern.exec(block);
  if (!match) fail(`TEXT_BINDING_NOT_FOUND:${field}:${expected}`);
  const start = match.index + match[1].length;
  const end = start + match[2].length;
  return block.slice(0, start) + replacement + block.slice(end);
}
function updateGoldenRefText(raw, oldRef, currentSha, currentBlob) {
  const key = '"goldenSampleRefs"';
  const property = raw.indexOf(key);
  if (property < 0) fail('GOLDEN_SAMPLE_REFS_TEXT_MISSING');
  const open = raw.indexOf('[', property + key.length);
  const close = findMatching(raw, open, '[', ']');
  let listText = raw.slice(open, close + 1);
  const pathToken = JSON.stringify(oldRef.path);
  const pathAt = listText.indexOf(pathToken);
  if (pathAt < 0 || listText.indexOf(pathToken, pathAt + pathToken.length) >= 0) fail('COMMON_GOLDEN_PATH_TEXT_NOT_UNIQUE');
  const objectStart = listText.lastIndexOf('{', pathAt);
  const objectEnd = findMatching(listText, objectStart, '{', '}');
  let objectText = listText.slice(objectStart, objectEnd + 1);
  objectText = replaceField(objectText, 'sha256', oldRef.sha256, currentSha);
  objectText = replaceField(objectText, 'gitBlobSha', oldRef.gitBlobSha, currentBlob);
  listText = listText.slice(0, objectStart) + objectText + listText.slice(objectEnd + 1);
  return raw.slice(0, open) + listText + raw.slice(close + 1);
}
function addHistory(raw, item) {
  const evidence = JSON.parse(raw);
  const key = 'evidenceBindingHistory';
  const prior = evidence[key];
  if (prior && prior.schemaVersion !== 'JS_ARCHIVE_EVIDENCE_BINDING_HISTORY_V1') fail('BINDING_HISTORY_SCHEMA_UNSUPPORTED');
  if ((prior?.entries || []).some(entry => entry.current?.sha256 === item.current.sha256 && entry.sourcePath === SOURCE_PATH)) return raw;
  const next = prior || { schemaVersion: 'JS_ARCHIVE_EVIDENCE_BINDING_HISTORY_V1', entries: [] };
  next.entries.push(item);
  const encoded = JSON.stringify(next);
  const close = raw.lastIndexOf('}');
  if (close < 0) fail('ROOT_JSON_CLOSE_MISSING');
  const before = raw.slice(0, close);
  const trimmed = before.trimEnd();
  const comma = trimmed.endsWith('{') ? '' : ',';
  const after = raw.slice(close);
  return `${trimmed}${comma}\n  "${key}": ${encoded}\n}${after.slice(1)}`;
}

function main(argv) {
  const write = argv.includes('--write');
  const unexpected = argv.filter(arg => arg !== '--write');
  if (unexpected.length) fail(`UNKNOWN_ARGUMENT:${unexpected[0]}`);
  const root = process.cwd();
  const sourceFinding = assertHistoricalDelta(root, [{ path: SOURCE_PATH, qid: 1 }, { path: SOURCE_PATH, qid: 2 }]);
  const currentBytes = fs.readFileSync(path.join(root, SOURCE_PATH));
  const currentSha = sha256(currentBytes);
  const currentBlob = gitBlobSha(currentBytes);
  const bundles = TARGETS.map(rel => validateBundle(root, rel, sourceFinding));
  const reports = [];
  for (const bundle of bundles) {
    const changed = bundle.oldRef.sha256 !== currentSha || bundle.oldRef.gitBlobSha !== currentBlob;
    if (!changed) { reports.push({ path: bundle.rel, status: 'ALREADY_BOUND' }); continue; }
    const historyItem = {
      sourcePath: SOURCE_PATH,
      previous: { sha256: bundle.oldRef.sha256, gitBlobSha: bundle.oldRef.gitBlobSha },
      current: { sha256: currentSha, gitBlobSha: currentBlob },
      verifiedAtCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
      verification: bundle.sourceFinding,
      rebindTool: 'archive/tools/rebind-m2-create-golden-sample-evidence.mjs',
    };
    let nextRaw = updateGoldenRefText(bundle.raw, bundle.oldRef, currentSha, currentBlob);
    nextRaw = addHistory(nextRaw, historyItem);
    const reparsed = JSON.parse(nextRaw);
    const newRef = reparsed.solutionQualityCalibration.goldenSampleRefs.find(ref => ref.path === SOURCE_PATH);
    if (newRef.sha256 !== currentSha || newRef.gitBlobSha !== currentBlob) fail(`GENERATED_BINDING_VERIFY_FAILED:${bundle.rel}`);
    reports.push({ path: bundle.rel, status: write ? 'UPDATED' : 'WOULD_UPDATE', previousSha256: bundle.oldRef.sha256, currentSha256: currentSha, previousGitBlobSha: bundle.oldRef.gitBlobSha, currentGitBlobSha: currentBlob, sampleQuestionsVerified: bundle.evidence.solutionQualityCalibration.goldenSampleQuestionRefs.length, negativeSamplesVerified: bundle.evidence.solutionQualityCalibration.negativeSampleRefs.length, writeBytes: Buffer.byteLength(nextRaw), nextRaw });
  }
  if (write) {
    for (const report of reports) if (report.status === 'UPDATED') {
      const file = path.join(root, report.path);
      const tmp = `${file}.rebind.tmp`;
      fs.writeFileSync(tmp, report.nextRaw, 'utf8');
      fs.renameSync(tmp, file);
      delete report.nextRaw;
    }
  } else for (const report of reports) delete report.nextRaw;
  console.log(JSON.stringify({ ok: true, mode: write ? 'WRITE' : 'DRY_RUN', source: sourceFinding, reports }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(JSON.stringify({ ok: false, error: error.message }, null, 2)); process.exitCode = 1; }
}
