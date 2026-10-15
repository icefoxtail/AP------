import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const FOOTPRINT_LIMITS = Object.freeze({
  analysisBlobBytes: 2 * 1024 * 1024,
  transientBlobBytes: 8 * 1024 * 1024,
  changedBlobBytes: 32 * 1024 * 1024
});

// Canonical catalog projections are production inputs consumed by the live
// archive. They are intentionally large and have stable, explicit paths.
export const CANONICAL_LARGE_DATA = Object.freeze([
  'archive/data/archive2-catalog.json',
  'archive/data/question_metadata.json'
]);

const PRODUCTION_ASSET_PREFIXES = Object.freeze([
  'archive/assets/images/',
  'assets/images/'
]);
const PRODUCTION_ASSET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg']);

const ANALYSIS_ROOT = 'archive/analysis/';
const TRANSIENT_SEGMENTS = /(?:^|\/)(?:conflict-stage-snapshots|pre-keyfilter-derived-snapshot|post-keyfilter-derived-snapshot|captures?|snapshots?|backups?|patchpacks?)(?:\/|$)/i;
const TRANSIENT_SUFFIX = /(?:\.patch|\.diff|\.capture(?:\.json)?|\.worktree\.bin)$/i;

function runGit(root, args, { encoding = 'utf8' } = {}) {
  return execFileSync('git', ['-C', root, '-c', 'core.quotepath=false', ...args], {
    encoding,
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 128 * 1024 * 1024
  });
}

function tryGit(root, args) {
  try { return runGit(root, args).trim(); } catch { return ''; }
}

function repoRootFromScript() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function normalizeRef(ref) {
  if (!ref || ref.startsWith('-')) throw new Error(`BASE_REF_INVALID:${ref}`);
  if (/^0+$/.test(ref)) {
    throw new Error('INITIAL_PUSH_BASE_UNAVAILABLE: full-history audit is required; refusing an incomplete HEAD fallback');
  }
  return ref;
}

function splitNul(value) {
  return value.split('\0').filter(Boolean);
}

function diffPaths(root, args) {
  try {
    return splitNul(runGit(root, ['diff', '--no-renames', '--name-only', '-z', ...args], { encoding: 'utf8' }));
  } catch (error) {
    throw new Error(`GIT_DIFF_FAILED:${String(error.stderr ?? error.message).trim()}`);
  }
}

function objectId(root, spec) {
  const value = tryGit(root, ['rev-parse', '--verify', spec]);
  return /^[0-9a-f]{40,64}$/i.test(value) ? value : null;
}

function objectSize(root, object) {
  if (!object) return null;
  const value = tryGit(root, ['cat-file', '-s', object]);
  return /^\d+$/.test(value) ? Number(value) : null;
}

function indexObject(root, repoPath) {
  const entries = tryGit(root, ['ls-files', '--stage', '-z', '--', repoPath]);
  const entry = splitNul(entries).find(value => value.endsWith(`\t${repoPath}`));
  const match = entry?.match(/^\d+ ([0-9a-f]{40,64}) \d\t/);
  return match ? match[1] : null;
}

function workingObject(root, repoPath) {
  const absolute = path.resolve(root, repoPath);
  const prefix = `${path.resolve(root)}${path.sep}`;
  if (!absolute.startsWith(prefix) || !fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  if (!stat.isFile()) return null;
  const object = tryGit(root, ['hash-object', `--path=${repoPath}`, '--', absolute])
    || tryGit(root, ['hash-object', '--no-filters', '--', absolute]);
  return /^[0-9a-f]{40,64}$/i.test(object) ? object : null;
}

function workingSizeFromFilesystem(root, repoPath) {
  const absolute = path.resolve(root, repoPath);
  const prefix = `${path.resolve(root)}${path.sep}`;
  if (!absolute.startsWith(prefix) || !fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  return stat.isFile() ? stat.size : null;
}

function baseObjectIds(root, base) {
  try {
    return new Set(runGit(root, ['rev-list', '--objects', '--no-object-names', base]).split(/\r?\n/).filter(Boolean));
  } catch {
    // A complete commit history is expected in CI. Keeping a missing-object
    // set empty is conservative: every changed blob counts toward the cap.
    return new Set();
  }
}

function isProductionExemption(repoPath) {
  return CANONICAL_LARGE_DATA.includes(repoPath)
    || (PRODUCTION_ASSET_PREFIXES.some(prefix => repoPath.startsWith(prefix))
      && PRODUCTION_ASSET_EXTENSIONS.has(path.posix.extname(repoPath).toLowerCase()));
}

function isTransient(repoPath) {
  return repoPath.toLowerCase().startsWith(ANALYSIS_ROOT)
    || TRANSIENT_SEGMENTS.test(repoPath)
    || TRANSIENT_SUFFIX.test(repoPath);
}

function classify(repoPath) {
  if (CANONICAL_LARGE_DATA.includes(repoPath)) return 'canonical-production-data';
  if (PRODUCTION_ASSET_PREFIXES.some(prefix => repoPath.startsWith(prefix))) return 'production-asset';
  if (repoPath.toLowerCase().startsWith(ANALYSIS_ROOT)) return 'analysis';
  if (isTransient(repoPath)) return 'transient';
  return 'ordinary';
}

/**
 * Check only changed files and index/worktree additions. The base tree is a
 * grandfathered size baseline; unchanged legacy blobs never enter the audit.
 */
export function auditGitGrowth({ root, base = 'HEAD^', head = 'HEAD' } = {}) {
  const normalizedBase = normalizeRef(base);
  const paths = new Set([
    ...diffPaths(root, [`${normalizedBase}...${head}`]),
    ...diffPaths(root, ['HEAD']),
    ...diffPaths(root, ['--cached', 'HEAD']),
    ...splitNul(tryGit(root, ['ls-files', '--others', '--exclude-standard', '-z']))
  ]);
  const files = [];
  const errors = [];
  const baseObjects = baseObjectIds(root, normalizedBase);
  const introducedObjects = new Map();

  for (const repoPath of [...paths].sort()) {
    const baseOid = objectId(root, `${normalizedBase}:${repoPath}`);
    const baseSize = objectSize(root, baseOid);
    const currentWorkOid = workingObject(root, repoPath);
    const candidateOids = [
      objectId(root, `${head}:${repoPath}`),
      indexObject(root, repoPath),
      currentWorkOid
    ].filter(Boolean);
    const uniqueCandidates = [...new Set(candidateOids)];
    if (uniqueCandidates.length === 0) continue;
    const candidateSize = Math.max(...uniqueCandidates.map(oid => currentWorkOid === oid
      ? workingSizeFromFilesystem(root, repoPath)
      : objectSize(root, oid)).filter(Number.isFinite));
    const changedObjects = uniqueCandidates.filter(oid => oid !== baseOid);
    if (changedObjects.length === 0 || isProductionExemption(repoPath)) {
      files.push({ path: repoPath, classification: classify(repoPath), baseBytes: baseSize, candidateBytes: candidateSize, checked: false });
      continue;
    }

    const classification = classify(repoPath);
    const limit = classification === 'analysis'
      ? FOOTPRINT_LIMITS.analysisBlobBytes
      : classification === 'transient'
        ? FOOTPRINT_LIMITS.transientBlobBytes
        : FOOTPRINT_LIMITS.changedBlobBytes;
    for (const oid of changedObjects) {
      const size = objectSize(root, oid) ?? (currentWorkOid === oid ? workingSizeFromFilesystem(root, repoPath) : null);
      if (size === null) continue;
      if (!baseObjects.has(oid)) introducedObjects.set(oid, size);
      if (size > limit) errors.push(`GIT_GROWTH_FILE_LIMIT:${repoPath}:${size}:${limit}:${classification}`);
    }
    files.push({ path: repoPath, classification, baseBytes: baseSize, candidateBytes: candidateSize, limitBytes: limit, checked: true });
  }

  const countedBytes = [...introducedObjects.values()].reduce((sum, size) => sum + size, 0);
  if (countedBytes > FOOTPRINT_LIMITS.changedBlobBytes) {
    errors.push(`GIT_GROWTH_CHANGESET_LIMIT:${countedBytes}:${FOOTPRINT_LIMITS.changedBlobBytes}`);
  }
  return {
    ok: errors.length === 0,
    base: normalizedBase,
    head,
    limits: { ...FOOTPRINT_LIMITS },
    countedChangedBytes: countedBytes,
    files,
    errors: [...new Set(errors)].sort()
  };
}

function parseArgs(argv) {
  const result = { base: 'HEAD^', head: 'HEAD' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--base' || arg === '--head') {
      const value = argv[index + 1];
      if (!value) throw new Error(`CLI_VALUE_REQUIRED:${arg}`);
      result[arg.slice(2)] = value;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else {
      throw new Error(`CLI_ARGUMENT_UNKNOWN:${arg}`);
    }
  }
  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write('Usage: node tools/check-git-growth.mjs --base <ref> [--head <ref>]\n');
    return 0;
  }
  const report = auditGitGrowth({ root: repoRootFromScript(), ...args });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  return report.ok ? 0 : 1;
}

const entrypoint = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === entrypoint) {
  try { process.exitCode = main(); }
  catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  }
}
