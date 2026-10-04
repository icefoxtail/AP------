import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const DEFAULT_GENERATED_ROOTS = Object.freeze([
  'archive/_generated',
  'archive/exams/_generated',
  'alive/runtime',
  'archive/tools/logic-visual-audit/reports'
]);

export const DEFAULT_TRACKED_GENERATED_EXCEPTIONS = Object.freeze([
  'alive/runtime/provider-bridge/auditor-output-normalizer.mjs',
  'alive/runtime/provider-bridge/auditor-output-schema.mjs',
  'alive/runtime/provider-bridge/auditor-turn-output.mjs',
  'alive/runtime/provider-bridge/codex-appserver-adapter.mjs',
  'alive/runtime/provider-bridge/codex-appserver-launch-state.mjs'
]);

const ASSET_FIELDS = Object.freeze(['image', 'solutionImage']);
const JEILGO_NAME = /제일고|jeilgo/i;

function normalizeRepoPath(value) {
  const normalized = String(value ?? '').replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalized || normalized.startsWith('/') || /^[A-Za-z]:\//.test(normalized)) {
    throw new Error(`REPOSITORY_PATH_INVALID:${value}`);
  }
  const clean = path.posix.normalize(normalized);
  if (clean === '..' || clean.startsWith('../')) throw new Error(`REPOSITORY_PATH_ESCAPE:${value}`);
  return clean;
}

function resolveInside(root, repoRelativePath) {
  const normalized = normalizeRepoPath(repoRelativePath);
  const absoluteRoot = path.resolve(root);
  const absolute = path.resolve(absoluteRoot, normalized);
  const prefix = `${absoluteRoot}${path.sep}`;
  if (absolute !== absoluteRoot && !absolute.startsWith(prefix)) {
    throw new Error(`REPOSITORY_PATH_ESCAPE:${repoRelativePath}`);
  }
  return { normalized, absolute };
}

function runGit(root, args) {
  try {
    return {
      status: 0,
      stdout: execFileSync('git', ['-C', root, '-c', 'core.quotepath=false', ...args], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      }),
      stderr: ''
    };
  } catch (error) {
    return {
      status: Number.isInteger(error.status) ? error.status : 1,
      stdout: String(error.stdout ?? ''),
      stderr: String(error.stderr ?? error.message ?? '')
    };
  }
}

function evaluateProductionSource(source, filename = 'production-exam.js') {
  const context = { window: {} };
  vm.runInNewContext(String(source), context, { filename, timeout: 1000 });
  const examTitle = context.window?.examTitle;
  const questionBank = context.window?.questionBank;
  if (typeof examTitle !== 'string' || !examTitle.trim()) throw new Error('PRODUCTION_EXAM_TITLE_REQUIRED');
  if (!Array.isArray(questionBank) || questionBank.length === 0) throw new Error('PRODUCTION_QUESTION_BANK_REQUIRED');
  return { examTitle, questionBank };
}

export function loadProductionExam(root, repoRelativePath) {
  const { normalized, absolute } = resolveInside(root, repoRelativePath);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    throw new Error(`PRODUCTION_JS_MISSING:${normalized}`);
  }
  const source = fs.readFileSync(absolute, 'utf8');
  const { examTitle, questionBank } = evaluateProductionSource(source, normalized);
  return { source, examTitle, questionBank, repoRelativePath: normalized };
}

export function extractProductionAssetRefs(source) {
  const { questionBank } = evaluateProductionSource(source);
  return questionBank
    .flatMap((question, index) => ASSET_FIELDS
      .filter(field => typeof question?.[field] === 'string' && question[field].trim())
      .map(field => ({
        questionId: question?.id ?? index + 1,
        field,
        ref: question[field].trim()
      })))
    .sort((left, right) => (
      Number(left.questionId) - Number(right.questionId)
      || left.field.localeCompare(right.field)
      || left.ref.localeCompare(right.ref)
    ));
}

function resolveAssetPath(ref) {
  const normalized = normalizeRepoPath(ref);
  const archiveRelative = normalized.startsWith('archive/')
    ? normalized
    : path.posix.normalize(path.posix.join('archive', normalized));
  if (archiveRelative === 'archive' || archiveRelative.startsWith('../') || !archiveRelative.startsWith('archive/')) {
    throw new Error(`PRODUCTION_ASSET_PATH_INVALID:${ref}`);
  }
  return archiveRelative;
}

function isTracked(root, repoRelativePath) {
  return runGit(root, ['ls-files', '--error-unmatch', '--', repoRelativePath]).status === 0;
}

function ignoreWitness(root, repoRelativePath) {
  const result = runGit(root, ['check-ignore', '--no-index', '-v', '--', repoRelativePath]);
  const witness = result.stdout.trim() || result.stderr.trim();
  const match = witness.split(/\r?\n/).at(-1) || '';
  const pattern = match.includes('\t') ? match.slice(0, match.indexOf('\t')).split(':').at(-1) : '';
  return {
    ignored: result.status === 0 && !pattern.startsWith('!'),
    witness,
    pattern
  };
}

function productionPathStatus(root, repoRelativePath) {
  const { normalized, absolute } = resolveInside(root, repoRelativePath);
  const exists = fs.existsSync(absolute) && fs.statSync(absolute).isFile();
  const tracked = exists && isTracked(root, normalized);
  const ignore = ignoreWitness(root, normalized);
  return { path: normalized, exists, tracked, ignored: ignore.ignored, ignoreWitness: ignore.witness };
}

export function auditProductionAssets({ root, productionPaths = [] }) {
  const errors = [];
  const assets = [];
  const normalizedProductionPaths = [...new Set(productionPaths.map(normalizeRepoPath))].sort();
  if (normalizedProductionPaths.length === 0) errors.push('PRODUCTION_JS_SET_EMPTY');

  for (const productionPath of normalizedProductionPaths) {
    let exam;
    try {
      exam = loadProductionExam(root, productionPath);
    } catch (error) {
      errors.push(`${error.message}`);
      continue;
    }
    const productionFile = productionPathStatus(root, productionPath);
    if (!productionFile.tracked) errors.push(`PRODUCTION_JS_UNTRACKED:${productionPath}`);
    if (productionFile.ignored) errors.push(`PRODUCTION_JS_IGNORED:${productionPath}`);

    for (const ref of extractProductionAssetRefs(exam.source)) {
      let assetPath;
      try {
        assetPath = resolveAssetPath(ref.ref);
      } catch (error) {
        errors.push(`${error.message}:${productionPath}:q${ref.questionId}:${ref.field}`);
        continue;
      }
      const status = productionPathStatus(root, assetPath);
      const row = { productionPath, questionId: ref.questionId, field: ref.field, ref: ref.ref, ...status };
      assets.push(row);
      if (!status.exists) errors.push(`PRODUCTION_ASSET_MISSING:${productionPath}:q${ref.questionId}:${ref.field}:${assetPath}`);
      if (!status.tracked) errors.push(`PRODUCTION_ASSET_UNTRACKED:${productionPath}:q${ref.questionId}:${ref.field}:${assetPath}`);
      if (status.ignored) errors.push(`PRODUCTION_ASSET_IGNORED:${productionPath}:q${ref.questionId}:${ref.field}:${assetPath}`);
    }
  }

  return {
    errors: [...new Set(errors)].sort(),
    assets: assets.sort((left, right) => (
      left.productionPath.localeCompare(right.productionPath)
      || Number(left.questionId) - Number(right.questionId)
      || left.field.localeCompare(right.field)
      || left.path.localeCompare(right.path)
    ))
  };
}

function trackedPathsUnder(root, repoRelativeRoot) {
  const result = runGit(root, ['ls-files', '--', repoRelativeRoot]);
  if (result.status !== 0) return [];
  return result.stdout.split(/\r?\n/).map(value => value.trim()).filter(Boolean).sort();
}

export function auditGeneratedRoots({
  root,
  generatedRoots = DEFAULT_GENERATED_ROOTS,
  trackedExceptions = DEFAULT_TRACKED_GENERATED_EXCEPTIONS
}) {
  const errors = [];
  const roots = [...new Set(generatedRoots.map(normalizeRepoPath))].sort();
  const exceptions = new Set(trackedExceptions.map(normalizeRepoPath));
  const reports = [];

  for (const generatedRoot of roots) {
    const absolute = path.resolve(root, generatedRoot);
    const exists = fs.existsSync(absolute);
    const tracked = trackedPathsUnder(root, generatedRoot);
    const unexpectedTracked = tracked.filter(value => !exceptions.has(value));
    const probe = `${generatedRoot}/.git-policy-probe`;
    const ignore = ignoreWitness(root, probe);
    if (ignore.ignored === false && exists) errors.push(`GENERATED_ROOT_NOT_IGNORED:${generatedRoot}`);
    for (const value of unexpectedTracked) errors.push(`GENERATED_PATH_TRACKED:${value}`);
    reports.push({ generatedRoot, exists, ignored: ignore.ignored, ignoreWitness: ignore.witness, tracked, allowedTracked: tracked.filter(value => exceptions.has(value)), unexpectedTracked });
  }

  return { errors: [...new Set(errors)].sort(), roots: reports };
}

export function discoverJeilgoProductionPaths(root) {
  return trackedPathsUnder(root, 'archive/exams')
    .filter(value => value.toLowerCase().endsWith('.js'))
    .filter(value => JEILGO_NAME.test(path.posix.basename(value)))
    .sort();
}

export function runPolicyAudit({
  root,
  productionPaths = discoverJeilgoProductionPaths(root),
  generatedRoots = DEFAULT_GENERATED_ROOTS
}) {
  const production = auditProductionAssets({ root, productionPaths });
  const generated = auditGeneratedRoots({ root, generatedRoots });
  const gates = {
    GENERATED_WORKTREE_NOISE_GATE: generated.errors.length === 0 ? 'PASS' : 'FAIL',
    PRODUCTION_ASSET_NOT_IGNORED_GATE: production.errors.length === 0 ? 'PASS' : 'FAIL',
    JS_ASSET_FORWARD_PARITY_GATE: production.assets.every(asset => asset.exists) ? 'PASS' : 'FAIL',
    GENERATED_REBUILDABILITY_GATE: generated.errors.length === 0 ? 'PASS' : 'FAIL'
  };
  return { gates, production, generated };
}

function parseArgs(argv) {
  const productionPaths = [];
  let jeilgo = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--jeilgo') {
      jeilgo = true;
    } else if (arg === '--exam') {
      const value = argv[index + 1];
      if (!value) throw new Error('CLI_EXAM_PATH_REQUIRED');
      productionPaths.push(value);
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      return { help: true, productionPaths, jeilgo };
    } else {
      throw new Error(`CLI_ARGUMENT_UNKNOWN:${arg}`);
    }
  }
  if (jeilgo && productionPaths.length) throw new Error('CLI_EXAM_AND_JEILGO_ARE_EXCLUSIVE');
  if (!jeilgo && productionPaths.length === 0) throw new Error('CLI_EXAM_OR_JEILGO_REQUIRED');
  return { help: false, productionPaths, jeilgo };
}

function printHelp() {
  process.stdout.write('Usage: node tools/archive/check-generated-git-policy.mjs --jeilgo\n');
  process.stdout.write('   or: node tools/archive/check-generated-git-policy.mjs --exam <archive-relative-js-path> [--exam <path>]\n');
}

function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help) {
    printHelp();
    return 0;
  }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const productionPaths = parsed.jeilgo ? discoverJeilgoProductionPaths(root) : parsed.productionPaths;
  const result = runPolicyAudit({ root, productionPaths });
  process.stdout.write(`${JSON.stringify({ productionPaths, ...result }, null, 2)}\n`);
  return Object.values(result.gates).every(value => value === 'PASS') ? 0 : 1;
}

const entrypoint = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === entrypoint) {
  try {
    process.exitCode = main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  }
}
