import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
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
const RAW_OUTPUT_ROOTS = Object.freeze([
  'output/',
  'reports/',
  'render_review/',
  'artifacts/',
  'archive-work/',
  'archive/evidence/',
  'evidence/',
  '스캔_인테이크_산출물/'
]);
const CANONICAL_GENERATED_DATA = new Set([
  'archive/_generated/intelligence/meta-foundation/h2-math2-continuity/STAGE6_FINAL_FOUNDATION.json',
  'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_CANONICAL_MAPPING.json',
  'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json'
]);
const HISTORY_REWRITE_POLICY_PATH = 'tools/git-history-rewrite-policy.v1.json';
const HEX_OID = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/i;

function runGit(root, args, { encoding = 'utf8', input, metrics } = {}) {
  if (metrics) metrics.gitCommands = (metrics.gitCommands || 0) + 1;
  return execFileSync('git', ['-C', root, '-c', 'core.quotepath=false', ...args], {
    encoding,
    input,
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 128 * 1024 * 1024
  });
}

function tryGit(root, args, metrics) {
  try { return runGit(root, args, { metrics }).trim(); } catch { return ''; }
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

function diffPaths(root, args, metrics) {
  try {
    return splitNul(runGit(root, ['diff', '--no-renames', '--name-only', '-z', ...args], { encoding: 'utf8', metrics }));
  } catch (error) {
    throw new Error(`GIT_DIFF_FAILED:${String(error.stderr ?? error.message).trim()}`);
  }
}

function treeObjects(root, ref, metrics) {
  const records = splitNul(runGit(root, ['ls-tree', '-r', '-l', '-z', ref], { metrics }));
  const objects = new Map();
  for (const record of records) {
    const separator = record.indexOf('\t');
    if (separator < 0) continue;
    // `ls-tree -l` pads the size column, so metadata can contain repeated
    // spaces. Normalize the header before reading the path's object and size.
    const fields = record.slice(0, separator).trim().split(/\s+/);
    const repoPath = record.slice(separator + 1);
    if (fields.length !== 4 || fields[1] !== 'blob' || !/^[0-9a-f]{40,64}$/i.test(fields[2]) || !/^\d+$/.test(fields[3])) continue;
    objects.set(repoPath, { oid: fields[2], size: Number(fields[3]) });
  }
  return objects;
}

function indexObjects(root, metrics) {
  const records = splitNul(runGit(root, ['ls-files', '--stage', '-z'], { metrics }));
  const objects = new Map();
  for (const record of records) {
    const separator = record.indexOf('\t');
    if (separator < 0) continue;
    const fields = record.slice(0, separator).split(' ');
    const repoPath = record.slice(separator + 1);
    if (fields.length !== 3 || !/^[0-9a-f]{40,64}$/i.test(fields[1])) continue;
    // Match the former per-path lookup: take the first stage when a path is
    // unmerged, since such files are not a durable tree candidate anyway.
    if (!objects.has(repoPath)) objects.set(repoPath, { oid: fields[1] });
  }
  return objects;
}

function objectSizes(root, objects, metrics) {
  const unique = [...new Set(objects)].filter(value => /^[0-9a-f]{40,64}$/i.test(value));
  if (unique.length === 0) return new Map();
  const output = runGit(root, ['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], {
    input: `${unique.join('\n')}\n`,
    metrics
  });
  const sizes = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^([0-9a-f]{40,64}) blob (\d+)$/i);
    if (match) sizes.set(match[1], Number(match[2]));
  }
  return sizes;
}

function workingObject(root, repoPath, metrics) {
  const absolute = path.resolve(root, repoPath);
  const prefix = `${path.resolve(root)}${path.sep}`;
  if (!absolute.startsWith(prefix) || !fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  if (!stat.isFile()) return null;
  const object = tryGit(root, ['hash-object', `--path=${repoPath}`, '--', absolute], metrics)
    || tryGit(root, ['hash-object', '--no-filters', '--', absolute], metrics);
  return /^[0-9a-f]{40,64}$/i.test(object) ? object : null;
}

function workingSizeFromFilesystem(root, repoPath) {
  const absolute = path.resolve(root, repoPath);
  const prefix = `${path.resolve(root)}${path.sep}`;
  if (!absolute.startsWith(prefix) || !fs.existsSync(absolute)) return null;
  const stat = fs.statSync(absolute);
  return stat.isFile() ? stat.size : null;
}

function baseObjectIds(root, base, metrics) {
  try {
    return new Set(runGit(root, ['rev-list', '--objects', '--no-object-names', base], { metrics }).split(/\r?\n/).filter(Boolean));
  } catch {
    // A complete commit history is expected in CI. Keeping a missing-object
    // set empty is conservative: every changed blob counts toward the cap.
    return new Set();
  }
}

function checkRewrittenHistoryFrontier(root, head, metrics) {
  const policyPath = path.join(root, HISTORY_REWRITE_POLICY_PATH);
  let stat;
  try { stat = fs.lstatSync(policyPath); }
  catch (error) { if (error.code === 'ENOENT') return { status: 'NO_POLICY_CONFIGURED', reachableDeniedFrontier: [] }; throw error; }
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('GIT_HISTORY_REWRITE_POLICY_INVALID_PATH');
  let policy;
  try { policy = JSON.parse(fs.readFileSync(policyPath, 'utf8')); }
  catch { throw new Error('GIT_HISTORY_REWRITE_POLICY_INVALID_JSON'); }
  if (policy?.schemaVersion !== 'git-history-rewrite-policy/v1' || policy.status !== 'ACTIVE'
      || !Array.isArray(policy.deniedOldFrontier) || policy.deniedOldFrontier.length === 0
      || policy.deniedOldFrontier.some(oid => typeof oid !== 'string' || !HEX_OID.test(oid))
      || typeof policy.sourceCommitMapSha256 !== 'string' || !/^[0-9a-f]{64}$/i.test(policy.sourceCommitMapSha256)
      || !Number.isSafeInteger(policy.sourceChangedOldCommitCount) || policy.sourceChangedOldCommitCount < 1
      || !Number.isSafeInteger(policy.sourceAncestorGraphCommitCount) || policy.sourceAncestorGraphCommitCount < policy.sourceChangedOldCommitCount) {
    throw new Error('GIT_HISTORY_REWRITE_POLICY_INVALID');
  }
  const frontier = [...new Set(policy.deniedOldFrontier.map(oid => oid.toLowerCase()))];
  if (frontier.length !== policy.deniedOldFrontier.length) throw new Error('GIT_HISTORY_REWRITE_POLICY_DUPLICATE_FRONTIER');
  let reachable;
  try { reachable = new Set(runGit(root, ['rev-list', head], { metrics }).split(/\r?\n/).filter(Boolean).map(oid => oid.toLowerCase())); }
  catch (error) { throw new Error(`GIT_HISTORY_REWRITE_REACHABILITY_FAILED:${String(error.stderr ?? error.message).trim()}`); }
  const reachableDeniedFrontier = frontier.filter(oid => reachable.has(oid)).sort();
  const baseline = policy.baselinePostFilterMain;
  const baselineValid = typeof baseline === 'string' && HEX_OID.test(baseline);
  if (baseline !== undefined && !baselineValid) throw new Error('GIT_HISTORY_REWRITE_POLICY_BASELINE_INVALID');
  const errors = [];
  if (baselineValid && !reachable.has(baseline.toLowerCase())) errors.push(`GIT_HISTORY_REWRITE_BASELINE_NOT_REACHABLE:${baseline}`);
  for (const oid of reachableDeniedFrontier) errors.push(`GIT_HISTORY_REWRITTEN_ANCESTRY_FORBIDDEN:${oid}`);
  return {
    status: errors.length ? 'BLOCKED_REWRITTEN_ANCESTRY' : 'PASS_NO_REWRITTEN_ANCESTRY',
    policyPath: HISTORY_REWRITE_POLICY_PATH,
    policySha256: requirePolicySha256(policyPath),
    sourceCommitMapSha256: policy.sourceCommitMapSha256.toLowerCase(),
    sourceChangedOldCommitCount: policy.sourceChangedOldCommitCount,
    sourceAncestorGraphCommitCount: policy.sourceAncestorGraphCommitCount,
    baselinePostFilterMain: baselineValid ? baseline.toLowerCase() : null,
    checkedFrontierCount: frontier.length,
    reachableDeniedFrontier,
    errors
  };
}

function requirePolicySha256(policyPath) {
  // The hash makes the exact active policy visible in CI's JSON report.
  return createHash('sha256').update(fs.readFileSync(policyPath)).digest('hex');
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

function isForbiddenRawOutput(repoPath) {
  if (repoPath.toLowerCase().startsWith(ANALYSIS_ROOT)) return true;
  if (repoPath.startsWith('archive/_generated/')) return !CANONICAL_GENERATED_DATA.has(repoPath);
  return RAW_OUTPUT_ROOTS.some(prefix => repoPath.startsWith(prefix));
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
export function auditGitGrowth({ root, base = 'HEAD^', head = 'HEAD', metrics = null } = {}) {
  if (metrics) metrics.gitCommands = 0;
  const normalizedBase = normalizeRef(base);
  const untrackedPaths = splitNul(tryGit(root, ['ls-files', '--others', '--exclude-standard', '-z'], metrics));
  const nonignoredUntracked = new Set(untrackedPaths);
  const paths = new Set([
    // Compare the endpoint trees directly. Three-dot diff requires a merge
    // base and silently stops working for the force-update transition that
    // this guard must inspect.
    ...diffPaths(root, [normalizedBase, head], metrics),
    ...diffPaths(root, ['HEAD'], metrics),
    ...diffPaths(root, ['--cached', 'HEAD'], metrics),
    ...untrackedPaths
  ]);
  const files = [];
  const errors = [];
  const baseTree = treeObjects(root, normalizedBase, metrics);
  const headTree = treeObjects(root, head, metrics);
  const stagedTree = indexObjects(root, metrics);
  const baseObjects = baseObjectIds(root, normalizedBase, metrics);
  const rewriteHistory = checkRewrittenHistoryFrontier(root, head, metrics);
  errors.push(...(rewriteHistory.errors || []));
  const introducedObjects = new Map();
  const candidates = [];

  for (const repoPath of [...paths].sort()) {
    const headObject = headTree.get(repoPath);
    const stagedObject = stagedTree.get(repoPath);
    // A path removed from both HEAD and the index may still exist locally as
    // ignored cold evidence. It is not a candidate Git addition; do not hash
    // that retained copy (there may be thousands after a cold-root cleanup).
    // Nonignored untracked files and forced-staged paths remain candidates.
    if (!headObject && !stagedObject && !nonignoredUntracked.has(repoPath)) continue;
    const currentWorkOid = workingObject(root, repoPath, metrics);
    const uniqueCandidates = [...new Set([headObject?.oid, stagedObject?.oid, currentWorkOid].filter(Boolean))];
    if (uniqueCandidates.length === 0) continue;
    candidates.push({ repoPath, headObject, stagedObject, currentWorkOid, uniqueCandidates });
  }

  const knownSizes = new Map();
  for (const objects of [baseTree, headTree]) {
    for (const { oid, size } of objects.values()) knownSizes.set(oid, size);
  }
  const unresolvedObjects = candidates.flatMap(candidate => candidate.uniqueCandidates.filter(oid => !knownSizes.has(oid)));
  for (const [oid, size] of objectSizes(root, unresolvedObjects, metrics)) knownSizes.set(oid, size);

  for (const { repoPath, headObject, currentWorkOid, uniqueCandidates } of candidates) {
    const baseObject = baseTree.get(repoPath);
    const baseOid = baseObject?.oid ?? null;
    const baseSize = baseObject?.size ?? null;
    const workSize = currentWorkOid ? workingSizeFromFilesystem(root, repoPath) : null;
    const candidateSize = Math.max(...uniqueCandidates.map(oid => oid === currentWorkOid
      ? (knownSizes.get(oid) ?? workSize)
      : knownSizes.get(oid)).filter(Number.isFinite));
    const changedObjects = uniqueCandidates.filter(oid => oid !== baseOid);
    if (changedObjects.length > 0 && isForbiddenRawOutput(repoPath)) {
      errors.push(`GIT_RAW_OUTPUT_FORBIDDEN:${repoPath}`);
      files.push({ path: repoPath, classification: classify(repoPath), baseBytes: baseSize, candidateBytes: candidateSize, checked: true });
      continue;
    }
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
      const size = knownSizes.get(oid) ?? (currentWorkOid === oid ? workSize : null);
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
    rewriteHistory,
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
