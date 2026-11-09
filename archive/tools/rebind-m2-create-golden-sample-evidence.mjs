#!/usr/bin/env node
// Rebinds the m2 CREATE gate "golden sample" pins (sha256 / gitBlobSha in
// solutionQualityCalibration.goldenSampleRefs) after a golden exam JS changed.
//
//   node archive/tools/rebind-m2-create-golden-sample-evidence.mjs                      # legacy Masan line-wrap mode (dry-run)
//   node archive/tools/rebind-m2-create-golden-sample-evidence.mjs --source <exam.js>   # figure-only mode (dry-run)
//   ... --source <exam.js> [--source <exam2.js>] [--baseline <commit>] [--evidence <file>] [--root <dir>] [--write]
//
// Safety (this never weakens the gate): the baseline exam (the version the evidence pins now)
// and the current exam are compared question by question. Only figure-display fields
// (solutionImage*, imageSize*, imageAlt/imageCaption/imageLayout) may differ. Any other change
// (content, answer, choices, solution, id, problem `image`, question count, ...) is REFUSED
// and nothing is written; that needs a human decision. solution SHA / excerpt of the referenced
// golden questions are still verified by the gate itself and by this tool before any write.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const TOOL_PATH = 'archive/tools/rebind-m2-create-golden-sample-evidence.mjs';
const REQUIRED_NEGATIVE = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const REQUIRED_AXES = [
  'STUDENT_REPRODUCIBILITY', 'SMALL_BOARD_STRUCTURE', 'EXPLANATION_DENSITY',
  'VISUAL_SEMANTIC_PARITY', 'VISUAL_READABILITY',
];
const FIGURE_REASON = 'solution figure only (solutionImage*), content/answer/choices/solution unchanged';
// Figure-display fields that may differ between baseline and current. `image`/`images` (the
// problem figure source) is deliberately NOT here: changing it can change the problem.
const FIGURE_FIELD_PATTERNS = [/^solutionImage[A-Za-z0-9]*$/, /^imageSize[A-Za-z0-9]*$/, /^image(Alt|Caption|Layout)$/];

// Legacy precedent (commit 5a89046ebd): Masan q10/q12 line-wrap only.
const LEGACY = Object.freeze({
  sourcePath: 'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',
  baselineCommit: '13457a7e86ab5f30a3cea2866e2b9c20dace30a2',
  baselineSha256: 'sha256:804586432b5d1100740f025700a14092b4cdd57a2443ccda7efb8cff3f9b65d5',
  lineWrapQids: [10, 12],
  exactQids: [1, 2],
  deltaFinding: 'Only line-wrap newlines in unreferenced q10/q12 content differ; all remaining question fields and all referenced q1/q2 are exact.',
});

export const sha256 = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
export const gitBlobSha = bytes => crypto.createHash('sha1')
  .update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');

function fail(message) { throw new Error(message); }
const git = (root, args) => execFileSync('git', args, { cwd: root, maxBuffer: 256 * 1024 * 1024 });
const norm = value => String(value || '').replaceAll('\\', '/');

function parseWindow(source, label) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: label, timeout: 5000 });
  const bank = context.window.questionBank || context.window.questions;
  if (!Array.isArray(bank) || !bank.length) fail(`QUESTION_BANK_REQUIRED:${label}`);
  return { window: context.window, bank };
}
const parseBank = (source, label) => parseWindow(source, label).bank;
const isFigureField = key => FIGURE_FIELD_PATTERNS.some(re => re.test(key));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const brief = value => { const s = JSON.stringify(value) ?? 'undefined'; return s.length > 90 ? `${s.slice(0, 90)}...` : s; };

/**
 * Compares baseline vs current exam. Returns { violations, changedQids, changedFields }.
 * violations must be empty for a rebind.
 */
export function compareExamForFigureOnly(oldParsed, newParsed, { lineWrapQids = [], exactQids = [] } = {}) {
  const violations = [];
  const changedFields = new Set();
  const changedQids = [];
  const oldBank = oldParsed.bank;
  const newBank = newParsed.bank;
  for (const key of new Set([...Object.keys(oldParsed.window), ...Object.keys(newParsed.window)])) {
    if (key === 'questionBank' || key === 'questions') continue;
    if (!same(oldParsed.window[key], newParsed.window[key])) violations.push(`WINDOW_FIELD_CHANGED:${key}: ${brief(oldParsed.window[key])} -> ${brief(newParsed.window[key])}`);
  }
  if (oldBank.length !== newBank.length) violations.push(`QUESTION_COUNT_CHANGED:${oldBank.length}->${newBank.length}`);
  const oldIds = oldBank.map(q => String(q.id));
  const newIds = newBank.map(q => String(q.id));
  if (!same(oldIds, newIds)) violations.push(`QUESTION_IDS_OR_ORDER_CHANGED:${oldIds.join(',')} -> ${newIds.join(',')}`);
  const wrap = new Set(lineWrapQids.map(Number));
  const exact = new Set(exactQids.map(Number));
  for (const oldQ of oldBank) {
    const newQ = newBank.find(q => String(q.id) === String(oldQ.id));
    if (!newQ) { violations.push(`QID_MISSING_IN_CURRENT:q${oldQ.id}`); continue; }
    const qid = Number(oldQ.id);
    let questionChanged = false;
    for (const key of new Set([...Object.keys(oldQ), ...Object.keys(newQ)])) {
      if (same(oldQ[key], newQ[key])) continue;
      questionChanged = true;
      if (exact.has(qid)) { violations.push(`REFERENCED_QUESTION_CHANGED:q${oldQ.id}:${key}`); continue; }
      if (isFigureField(key)) { changedFields.add(key); continue; }
      if (key === 'content' && wrap.has(qid)
        && String(oldQ.content || '').replaceAll('\n', '') === String(newQ.content || '').replaceAll('\n', '')) {
        changedFields.add('content(line-wrap)');
        continue;
      }
      violations.push(`NON_FIGURE_FIELD_CHANGED:q${oldQ.id}:${key}: ${brief(oldQ[key])} -> ${brief(newQ[key])}`);
    }
    if (questionChanged) changedQids.push(qid);
  }
  return { violations, changedQids, changedFields: [...changedFields].sort() };
}

function discoverTargets(root) {
  const dir = path.join(root, 'tests');
  const found = [];
  if (!fs.existsSync(dir)) return found;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!/^m2-.*create-gate.*\.test\.js$/.test(name)) continue;
    const source = fs.readFileSync(path.join(dir, name), 'utf8');
    for (const match of source.matchAll(/archive\/data\/r2e-intake\/m2\/[^"'`]+?\.create\.physical-evidence\.json/g)) found.push(match[0]);
  }
  return [...new Set(found)];
}

function readBaseline(root, source, ref, baselineCommit) {
  let bytes;
  try {
    bytes = baselineCommit
      ? git(root, ['show', `${baselineCommit}:${source}`])
      : git(root, ['cat-file', 'blob', ref.gitBlobSha]);
  } catch {
    fail(baselineCommit
      ? `BASELINE_COMMIT_SOURCE_NOT_FOUND:${baselineCommit}:${source}`
      : `BASELINE_BLOB_NOT_FOUND:${ref.gitBlobSha} (git fetch more history or pass --baseline <commit>)`);
  }
  if (sha256(bytes) !== ref.sha256 || gitBlobSha(bytes) !== ref.gitBlobSha) fail(`BASELINE_DOES_NOT_MATCH_EVIDENCE_PIN:${source}`);
  return bytes;
}

function validateBundle(root, rel, sources) {
  const raw = fs.readFileSync(path.join(root, rel), 'utf8');
  const evidence = JSON.parse(raw);
  const calibration = evidence.solutionQualityCalibration;
  if (evidence.schemaVersion !== 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1' || evidence.stage !== 'CREATE') fail(`TARGET_SCHEMA_OR_STAGE_INVALID:${rel}`);
  if (!calibration || calibration.sampleReadBeforeWork !== true || calibration.calibrationStatus !== 'PASS') fail(`CALIBRATION_PREFLIGHT_STATE_INVALID:${rel}`);
  if (REQUIRED_AXES.some(axis => !calibration.calibrationAxes?.includes(axis))) fail(`CALIBRATION_AXIS_MISSING:${rel}`);
  const golden = calibration.goldenSampleRefs;
  if (!Array.isArray(golden) || golden.length < 2 || golden.length > 3) fail(`GOLDEN_SAMPLE_COUNT_INVALID:${rel}`);
  const goldenByPath = new Map();
  for (const ref of golden) {
    if (!ref?.path || goldenByPath.has(ref.path)) fail(`GOLDEN_SAMPLE_PATH_DUPLICATE_OR_MISSING:${rel}`);
    goldenByPath.set(ref.path, ref);
    if (sources.includes(ref.path)) continue; // judged against baseline/current in main flow
    const bytes = fs.readFileSync(path.join(root, ref.path));
    if (sha256(bytes) !== ref.sha256 || gitBlobSha(bytes) !== ref.gitBlobSha) fail(`OTHER_GOLDEN_BINDING_STALE:${rel}:${ref.path}`);
  }
  const refs = calibration.goldenSampleQuestionRefs;
  if (!Array.isArray(refs)) fail(`GOLDEN_QUESTION_REFS_MISSING:${rel}`);
  const seen = new Set();
  const perSample = new Map();
  for (const ref of refs) {
    perSample.set(ref.path, (perSample.get(ref.path) || 0) + 1);
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
  const negatives = calibration.negativeSampleRefs;
  if (!Array.isArray(negatives) || !negatives.some(ref => ref.path === REQUIRED_NEGATIVE)) fail(`REQUIRED_NEGATIVE_SAMPLE_MISSING:${rel}`);
  for (const ref of negatives) {
    const bytes = fs.readFileSync(path.join(root, ref.path));
    if (sha256(bytes) !== ref.sha256 || gitBlobSha(bytes) !== ref.gitBlobSha) fail(`NEGATIVE_SAMPLE_BINDING_STALE:${rel}:${ref.path}`);
  }
  return { rel, raw, evidence, goldenByPath, questionRefs: refs };
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
  const escapedExpected = JSON.stringify(expected).slice(1, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`("${field}"\\s*:\\s*")(${escapedExpected})(?=")`);
  const match = pattern.exec(block);
  if (!match) fail(`TEXT_BINDING_NOT_FOUND:${field}:${expected}`);
  const start = match.index + match[1].length;
  return block.slice(0, start) + replacement + block.slice(start + match[2].length);
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
  if (pathAt < 0 || listText.indexOf(pathToken, pathAt + pathToken.length) >= 0) fail('GOLDEN_PATH_TEXT_NOT_UNIQUE');
  const objectStart = listText.lastIndexOf('{', pathAt);
  const objectEnd = findMatching(listText, objectStart, '{', '}');
  let objectText = listText.slice(objectStart, objectEnd + 1);
  objectText = replaceField(objectText, 'sha256', oldRef.sha256, currentSha);
  objectText = replaceField(objectText, 'gitBlobSha', oldRef.gitBlobSha, currentBlob);
  listText = listText.slice(0, objectStart) + objectText + listText.slice(objectEnd + 1);
  return raw.slice(0, open) + listText + raw.slice(close + 1);
}
// Appends one entry to evidenceBindingHistory.entries as text, keeping the file's existing formatting.
function addHistoryText(raw, item) {
  const key = '"evidenceBindingHistory"';
  const at = raw.indexOf(key);
  if (at < 0) {
    const history = { schemaVersion: 'JS_ARCHIVE_EVIDENCE_BINDING_HISTORY_V1', entries: [item] };
    const close = raw.lastIndexOf('}');
    if (close < 0) fail('ROOT_JSON_CLOSE_MISSING');
    const trimmed = raw.slice(0, close).trimEnd();
    const body = JSON.stringify(history, null, 2).replaceAll('\n', '\n  ');
    return `${trimmed}${trimmed.endsWith('{') ? '' : ','}\n  ${key}: ${body}\n${raw.slice(close)}`;
  }
  const entriesAt = raw.indexOf('"entries"', at);
  if (entriesAt < 0) fail('BINDING_HISTORY_ENTRIES_MISSING');
  const open = raw.indexOf('[', entriesAt);
  const close = findMatching(raw, open, '[', ']');
  const before = raw.slice(open + 1, close);
  const closeIndent = /\n([ \t]*)$/.exec(before)?.[1] ?? '';
  const entryIndent = `${closeIndent}  `;
  const body = JSON.stringify(item, null, 2).split('\n').map(line => entryIndent + line).join('\n');
  const head = raw.slice(0, open + 1) + before.trimEnd();
  const comma = before.trim() ? ',' : '';
  return `${head}${comma}\n${body}\n${closeIndent}${raw.slice(close)}`;
}

export function runRebind({ root, sources, baselines = [], evidencePaths = [], write = false, legacy = false, date, log = () => {} }) {
  const targetPaths = evidencePaths.length ? evidencePaths : discoverTargets(root);
  if (!targetPaths.length) fail('NO_TARGET_EVIDENCE_FOUND');
  const bundles = targetPaths.map(rel => validateBundle(root, norm(rel), sources));
  const headCommit = git(root, ['rev-parse', 'HEAD']).toString().trim();
  const now = new Date();
  const today = date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const parsedCurrent = new Map();
  const currentBytes = new Map();
  for (const source of sources) {
    const bytes = fs.readFileSync(path.join(root, source));
    currentBytes.set(source, bytes);
    parsedCurrent.set(source, parseWindow(bytes.toString('utf8'), source));
  }
  const comparisons = new Map(); // `${source}|${blob}` -> result
  const violations = [];
  const reports = [];
  const plans = [];
  for (const bundle of bundles) {
    const touched = sources.filter(s => bundle.goldenByPath.has(s));
    if (!touched.length) { reports.push({ path: bundle.rel, status: 'NOT_APPLICABLE' }); continue; }
    if (legacy) {
      const refs = bundle.questionRefs.filter(r => r.path === LEGACY.sourcePath).map(r => Number(r.qid));
      if (refs.length !== 2 || !LEGACY.exactQids.every(q => refs.includes(q))) fail('EXPECTED_MASAN_Q1_Q2_REFERENCES_REQUIRED');
    }
    let nextRaw = bundle.raw;
    const bound = [];
    for (const source of touched) {
      const ref = bundle.goldenByPath.get(source);
      const bytes = currentBytes.get(source);
      const curSha = sha256(bytes);
      const curBlob = gitBlobSha(bytes);
      if (ref.sha256 === curSha && ref.gitBlobSha === curBlob) { bound.push({ source, status: 'ALREADY_BOUND' }); continue; }
      const baselineCommit = baselines[sources.indexOf(source)] || (legacy ? LEGACY.baselineCommit : undefined);
      const baselineBytes = readBaseline(root, source, ref, baselineCommit);
      if (legacy && sha256(baselineBytes) !== LEGACY.baselineSha256) fail('HISTORICAL_SOURCE_SHA_UNEXPECTED');
      const cacheKey = `${source}|${ref.gitBlobSha}`;
      if (!comparisons.has(cacheKey)) {
        comparisons.set(cacheKey, compareExamForFigureOnly(
          parseWindow(baselineBytes.toString('utf8'), `baseline:${source}`), parsedCurrent.get(source),
          legacy ? { lineWrapQids: LEGACY.lineWrapQids, exactQids: LEGACY.exactQids } : {}));
      }
      const cmp = comparisons.get(cacheKey);
      if (cmp.violations.length) {
        for (const v of cmp.violations) violations.push({ evidence: bundle.rel, source, violation: v });
        bound.push({ source, status: 'REFUSED' });
        continue;
      }
      const item = {
        sourcePath: source,
        previous: { sha256: ref.sha256, gitBlobSha: ref.gitBlobSha },
        current: { sha256: curSha, gitBlobSha: curBlob },
        reason: legacy ? 'line-wrap only in unreferenced q10/q12 content, all other fields unchanged' : FIGURE_REASON,
        date: today,
        verifiedAtCommit: headCommit,
        verification: {
          baselineSource: baselineCommit ? `git:${baselineCommit}` : `git-blob:${ref.gitBlobSha}`,
          changedQids: cmp.changedQids,
          changedFields: cmp.changedFields,
          deltaFinding: legacy ? LEGACY.deltaFinding
            : `Only figure-display fields (${cmp.changedFields.join(', ') || 'none'}) differ in q${cmp.changedQids.join(',q') || '-'}; content/answer/choices/solution and every other question field, question count and ids are exact.`,
        },
        rebindTool: TOOL_PATH,
      };
      nextRaw = updateGoldenRefText(nextRaw, ref, curSha, curBlob);
      nextRaw = addHistoryText(nextRaw, item);
      bound.push({ source, status: write ? 'UPDATED' : 'WOULD_UPDATE', previousSha256: ref.sha256, currentSha256: curSha, previousGitBlobSha: ref.gitBlobSha, currentGitBlobSha: curBlob, changedQids: cmp.changedQids, changedFields: cmp.changedFields, item });
    }
    if (nextRaw !== bundle.raw) {
      // Verify the textual edit is exactly the intended structured change.
      const expected = JSON.parse(bundle.raw);
      for (const b of bound.filter(x => x.item)) {
        const ref = expected.solutionQualityCalibration.goldenSampleRefs.find(r => r.path === b.source);
        ref.sha256 = b.currentSha256; ref.gitBlobSha = b.currentGitBlobSha;
        expected.evidenceBindingHistory ??= { schemaVersion: 'JS_ARCHIVE_EVIDENCE_BINDING_HISTORY_V1', entries: [] };
        expected.evidenceBindingHistory.entries.push(b.item);
      }
      if (!same(JSON.parse(nextRaw), expected)) fail(`GENERATED_BINDING_VERIFY_FAILED:${bundle.rel}`);
      plans.push({ rel: bundle.rel, nextRaw });
    }
    reports.push({ path: bundle.rel, sources: bound.map(({ item, ...rest }) => rest) });
  }
  if (violations.length) {
    return { ok: false, mode: write ? 'WRITE' : 'DRY_RUN', refused: true, message: 'REFUSED: golden exam changed outside figure-display fields; nothing written. Human decision required.', violations: groupViolations(violations), reports };
  }
  if (write) {
    for (const plan of plans) {
      const file = path.join(root, plan.rel);
      const tmp = `${file}.rebind.tmp`;
      fs.writeFileSync(tmp, plan.nextRaw, 'utf8');
      fs.renameSync(tmp, file);
    }
  }
  log(`${plans.length} evidence file(s) ${write ? 'updated' : 'would be updated'}`);
  return { ok: true, mode: write ? 'WRITE' : 'DRY_RUN', sources, evidenceToUpdate: plans.length, reports };
}
// The same source diff shows up once per evidence file; report each distinct diff once.
function groupViolations(list) {
  const groups = new Map();
  for (const { source, violation } of list) {
    const key = `${source}|${violation}`;
    if (!groups.has(key)) groups.set(key, { source, violation, evidenceFiles: 0 });
    groups.get(key).evidenceFiles += 1;
  }
  return [...groups.values()];
}

export function parseArgs(argv) {
  const opts = { write: false, sources: [], baselines: [], evidencePaths: [], root: process.cwd() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => { if (i + 1 >= argv.length) fail(`MISSING_VALUE:${arg}`); i += 1; return argv[i]; };
    if (arg === '--write') opts.write = true;
    else if (arg === '--source') opts.sources.push(norm(value()));
    else if (arg === '--baseline') opts.baselines.push(value());
    else if (arg === '--evidence') opts.evidencePaths.push(norm(value()));
    else if (arg === '--root') opts.root = path.resolve(value());
    else fail(`UNKNOWN_ARGUMENT:${arg}`);
  }
  if (opts.baselines.length && opts.baselines.length !== opts.sources.length) fail('BASELINE_COUNT_MUST_MATCH_SOURCE_COUNT');
  return opts;
}

function main(argv) {
  const opts = parseArgs(argv);
  const legacy = opts.sources.length === 0;
  const sources = legacy ? [LEGACY.sourcePath] : opts.sources.map(s => path.isAbsolute(s) ? norm(path.relative(opts.root, s)) : s);
  const result = runRebind({ root: opts.root, sources, baselines: opts.baselines, evidencePaths: opts.evidencePaths, write: opts.write, legacy });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(JSON.stringify({ ok: false, error: error.message }, null, 2)); process.exitCode = 1; }
}
