import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';

import { captureRender } from '../../pipeline-core/render.mjs';
import { fileRef } from '../../pipeline-core/canonical.mjs';
import { RUN_VERSION, runInputSha } from '../../pipeline-core/closure.mjs';
import { runtimeDependencyBundle } from '../../pipeline-core/runtime.mjs';

const DEFAULT_EXAMS = Object.freeze([
  'archive/exams/original/high/h2/1mid/23_중앙여고_1학기_중간_고2_대수.js',
  'archive/exams/original/middle/m3/2final/23_순천여중_2학기_기말_중3_기출.js',
  'archive/exams/original/high/h2/1final/25_효천고_1학기_기말_고2_대수c.js',
]);

function posixPath(value) {
  return String(value).replaceAll('\\', '/');
}

export function normalizeBenchmarkExamPath(value) {
  const normalized = posixPath(value).replace(/^\.\//, '');
  if (!normalized.startsWith('archive/exams/original/') || !normalized.endsWith('.js') || normalized.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`REAL_EXAM_PATH_INVALID:${value}`);
  }
  return normalized;
}

export function loadExamBank(root, examPath) {
  const normalized = normalizeBenchmarkExamPath(examPath);
  const source = fs.readFileSync(path.join(root, normalized), 'utf8');
  const context = { console, window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: normalized, timeout: 5000 });
  const questions = context.window.questionBank;
  if (!Array.isArray(questions) || questions.length === 0 || questions.some(question => !Number.isSafeInteger(question?.id))) {
    throw new Error(`REAL_EXAM_BANK_INVALID:${normalized}`);
  }
  const ids = questions.map(question => question.id);
  if (new Set(ids).size !== ids.length) throw new Error(`REAL_EXAM_BANK_DUPLICATE_IDS:${normalized}`);
  return {
    path: normalized,
    title: context.window.examTitle || path.basename(normalized, '.js'),
    questions: JSON.parse(JSON.stringify(questions)),
  };
}

function resolveAssetPath(root, value) {
  const normalized = posixPath(value).replace(/[?#].*$/, '');
  if (!normalized || normalized.split('/').some(part => !part || part === '.' || part === '..')) return null;
  const candidates = normalized.startsWith('archive/')
    ? [normalized]
    : [`archive/${normalized}`, normalized];
  for (const candidate of candidates) {
    const target = path.join(root, candidate);
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return candidate;
  }
  return null;
}

function unique(values) {
  return [...new Set(values)];
}

export function buildBenchmarkRun(root, examPath, { runId = null, revision = 1 } = {}) {
  const exam = loadExamBank(root, examPath);
  const candidateRef = fileRef(root, exam.path);
  const assetPaths = unique(exam.questions.flatMap(question => [question.image, question.solutionImage].filter(Boolean).map(value => {
    const resolved = resolveAssetPath(root, value);
    if (!resolved) throw new Error(`REAL_EXAM_ASSET_MISSING:${exam.path}:${question.id}:${value}`);
    return resolved;
  })));
  const assetRefs = assetPaths.map(assetPath => ({ ...fileRef(root, assetPath), role: 'asset' }));
  const runtime = runtimeDependencyBundle(root, 'archive/engine.html');
  const runtimeRefs = runtime.localFiles.map(ref => ({ ...ref, role: ref.path === runtime.enginePath ? 'engine' : 'runtime' }));
  const generatedRunId = runId || `loop9-shadow-${path.basename(exam.path, '.js')}`;
  const questions = exam.questions.map(question => {
    const questionUid = `${exam.path}|real-exam|${question.id}`;
    return {
      questionUid,
      qid: question.id,
      sourcePath: exam.path,
      candidatePath: exam.path,
      problemAssetPaths: question.image ? [resolveAssetPath(root, question.image)] : [],
      solutionAssetPaths: question.solutionImage ? [resolveAssetPath(root, question.solutionImage)] : [],
      requiredAxes: [],
    };
  });
  const run = {
    schemaVersion: RUN_VERSION,
    pipeline: 'past-exam',
    runId: generatedRunId,
    revision,
    publicationIntent: 'FULL_EXAM',
    assetRoot: 'archive',
    questions,
    inputs: [
      { ...candidateRef, role: 'source' },
      { ...candidateRef, role: 'candidate' },
      ...assetRefs,
      ...runtimeRefs,
    ],
    evidence: [],
    registry: [],
    renderRuntime: runtime,
  };
  run.inputSha = runInputSha(run);
  return run;
}

function readJson(root, ref) {
  return JSON.parse(fs.readFileSync(path.join(root, ref.path), 'utf8'));
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(target));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

function screenshotStatsFromCapture(root, outputRelative, report, captures) {
  const reported = report?.screenshotStats;
  if (reported && Number.isSafeInteger(reported.encodedCount)) return { ...reported };
  const pngFiles = walkFiles(path.join(root, outputRelative)).filter(file => path.extname(file).toLowerCase() === '.png');
  const encodedCount = captures.reduce((sum, capture) => sum + (capture.payload?.itemWitnesses || []).reduce((inner, witness) => inner + 1 + (witness.blocks?.length || 0), 0) + 1, 0);
  return {
    encodedCount,
    uniqueFileCount: pngFiles.length,
    dedupHitCount: 0,
    writtenBytes: pngFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0),
    encodeMs: null,
    writeMs: null,
  };
}

function captureRows(root, report) {
  return (report?.captures || []).map(ref => readJson(root, ref));
}

export function benchmarkRow(root, examPath, implementation, outputRelative, report, elapsedMs) {
  const captures = captureRows(root, report);
  const caseMetrics = Array.isArray(report?.caseMetrics) ? report.caseMetrics : [];
  const caseKeys = captures.map(capture => `${capture.payload?.mode || 'unknown'}/${capture.payload?.viewport?.profile || 'unknown'}`).sort();
  const reusedCases = captures.filter(capture => capture.payload?.captureSession?.contextReused === true).length;
  const navigationCases = caseMetrics.filter(metric => metric.transition === 'NAVIGATION').length;
  const contextCreated = caseMetrics.length ? navigationCases : captures.length;
  const stats = screenshotStatsFromCapture(root, outputRelative, report, captures);
  return {
    implementation,
    examPath,
    questionCount: new Set(captures.flatMap(capture => capture.payload?.questionUids || [])).size,
    caseCount: captures.length,
    caseKeys,
    status: report?.status || 'FAILED',
    mechanicalPass: captures.length > 0 && captures.every(capture => capture.status === 'PASS'),
    totalCaptureMs: Number.isFinite(report?.totalCaptureMs) ? report.totalCaptureMs : Math.round(elapsedMs),
    wallMs: Math.round(elapsedMs),
    browserColdBoots: 1,
    browserContextsCreated: contextCreated,
    contextReusedCases: reusedCases,
    screenshotStats: stats,
    runtimeReadyCases: captures.filter(capture => capture.payload?.runtimeReadiness?.ok === true).length,
    outputRelative,
  };
}

function quantile(values, percentile) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(percentile * sorted.length) - 1));
  return sorted[index];
}

function summarizeRows(rows) {
  const durations = rows.map(row => row.totalCaptureMs).filter(Number.isFinite);
  return {
    runCount: rows.length,
    passCount: rows.filter(row => row.mechanicalPass).length,
    failCount: rows.filter(row => !row.mechanicalPass).length,
    totalCaptureMsP50: quantile(durations, 0.5),
    totalCaptureMsP95: quantile(durations, 0.95),
    browserContextsCreated: rows.length ? rows.reduce((sum, row) => sum + row.browserContextsCreated, 0) / rows.length : null,
    contextReusedCases: rows.length ? rows.reduce((sum, row) => sum + row.contextReusedCases, 0) / rows.length : null,
    uniqueScreenshotFiles: rows.length ? rows.reduce((sum, row) => sum + row.screenshotStats.uniqueFileCount, 0) / rows.length : null,
    screenshotDedupHits: rows.length ? rows.reduce((sum, row) => sum + row.screenshotStats.dedupHitCount, 0) / rows.length : null,
  };
}

function safeLabel(value) {
  return String(value).replace(/[^\p{L}\p{N}._-]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 100) || 'run';
}

function parseArgs(argv) {
  const options = { exams: [], repeat: 1, implementation: 'current', channel: process.env.APMATH_BROWSER_CHANNEL || 'chrome', output: null, root: process.cwd() };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--exam') options.exams.push(argv[++index]);
    else if (arg === '--repeat') options.repeat = Math.max(1, Number.parseInt(argv[++index], 10) || 1);
    else if (arg === '--implementation') options.implementation = argv[++index] || options.implementation;
    else if (arg === '--channel') options.channel = argv[++index] || options.channel;
    else if (arg === '--output') options.output = argv[++index];
    else if (arg === '--root') options.root = path.resolve(argv[++index]);
    else if (arg === '--help') options.help = true;
    else throw new Error(`UNKNOWN_ARGUMENT:${arg}`);
  }
  if (!options.exams.length) options.exams = [...DEFAULT_EXAMS];
  options.exams = options.exams.map(normalizeBenchmarkExamPath);
  return options;
}

function usage() {
  return [
    'Usage: node fast-runtime-shadow-benchmark.mjs [options]',
    '  --root <repo-root>',
    '  --exam <archive/exams/original/...js> (repeatable)',
    '  --repeat <n>',
    '  --implementation <label>',
    '  --channel <playwright-channel>',
    '  --output <relative-or-absolute-json>',
  ].join('\n');
}

export async function runShadowBenchmark({ root = process.cwd(), exams = DEFAULT_EXAMS, repeat = 1, implementation = 'current', channel = process.env.APMATH_BROWSER_CHANNEL || 'chrome', output = null } = {}) {
  const normalizedRoot = path.resolve(root);
  const rows = [];
  for (const examPath of exams.map(normalizeBenchmarkExamPath)) {
    for (let iteration = 1; iteration <= repeat; iteration++) {
      const runId = `loop9-shadow-${safeLabel(implementation)}-${safeLabel(path.basename(examPath, '.js'))}-${Date.now()}-${iteration}`;
      const outputRelative = `archive/_generated/loop9-shadow-benchmark/${safeLabel(implementation)}/${safeLabel(path.basename(examPath, '.js'))}/${Date.now()}-${iteration}`;
      const run = buildBenchmarkRun(normalizedRoot, examPath, { runId });
      const startedAt = performance.now();
      try {
        const report = await captureRender(normalizedRoot, run, outputRelative, { channel });
        rows.push(benchmarkRow(normalizedRoot, examPath, implementation, outputRelative, report, performance.now() - startedAt));
      } catch (error) {
        rows.push({ implementation, examPath, questionCount: run.questions.length, caseCount: 0, caseKeys: [], status: 'FAILED', mechanicalPass: false, totalCaptureMs: Math.round(performance.now() - startedAt), wallMs: Math.round(performance.now() - startedAt), browserColdBoots: 0, browserContextsCreated: null, contextReusedCases: 0, screenshotStats: { encodedCount: 0, uniqueFileCount: 0, dedupHitCount: 0, writtenBytes: 0, encodeMs: null, writeMs: null }, runtimeReadyCases: 0, outputRelative, error: String(error?.stack || error) });
      }
    }
  }
  const result = {
    schemaVersion: 'APMATH_FAST_RUNTIME_SHADOW_BENCHMARK_v1',
    implementation,
    root: normalizedRoot,
    channel,
    exams: [...new Set(rows.map(row => row.examPath))],
    rows,
    summary: summarizeRows(rows),
  };
  if (output) {
    const outputPath = path.isAbsolute(output) ? output : path.join(normalizedRoot, output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { encoding: 'utf8' });
    result.output = outputPath;
  }
  return result;
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll('\\', '/')}` || process.argv[1]?.endsWith('fast-runtime-shadow-benchmark.mjs')) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) console.log(usage());
    else console.log(JSON.stringify(await runShadowBenchmark(options), null, 2));
  } catch (error) {
    console.error(error?.stack || error);
    process.exitCode = 1;
  }
}
