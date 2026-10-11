#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const IMAGE_ROOT = 'archive/assets/images';
export const STATE_OBJECT_KEY = 'sync-state/r2-archive-assets-copy-main.json';
const WORKFLOW_ID = 'r2-archive-assets-copy';

function asBuffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value === undefined || value === null) return Buffer.alloc(0);
  return Buffer.from(value);
}

function decodeUtf8(buffer, label) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    throw new Error(`${label} is not valid UTF-8; refusing to lose a Git path.`);
  }
}

function splitNul(buffer, label) {
  const values = [];
  let start = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    if (buffer[index] !== 0) continue;
    if (index > start) values.push(decodeUtf8(buffer.subarray(start, index), label));
    start = index + 1;
  }
  if (start !== buffer.length) throw new Error(`${label} did not end with a NUL delimiter.`);
  return values;
}

function runProcess(binary, args, { cwd, input, maxBuffer = 1024 * 1024 * 1024 } = {}) {
  const result = spawnSync(binary, args, {
    cwd,
    input,
    encoding: null,
    maxBuffer,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  return {
    status: result.status ?? 1,
    stdout: asBuffer(result.stdout),
    stderr: asBuffer(result.stderr),
  };
}

function runGit(repoRoot, args, { allowFailure = false } = {}) {
  const result = runProcess('git', args, { cwd: repoRoot });
  if (!allowFailure && result.status !== 0) {
    const stderr = decodeUtf8(result.stderr, 'Git stderr').trim();
    throw new Error(`git ${args.join(' ')} failed${stderr ? `: ${stderr}` : ''}`);
  }
  return result;
}

function gitText(repoRoot, args) {
  return decodeUtf8(runGit(repoRoot, args).stdout, 'Git output').trim();
}

function canonicalCommit(repoRoot, value, label) {
  const requested = String(value || '').trim().toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(requested)) {
    throw new Error(`${label} must be a full 40-character Git commit SHA.`);
  }
  const resolved = gitText(repoRoot, ['rev-parse', '--verify', `${requested}^{commit}`]).toLowerCase();
  if (resolved !== requested) throw new Error(`${label} did not resolve to the requested commit.`);
  return resolved;
}

function isAncestor(repoRoot, older, newer) {
  const result = runGit(repoRoot, ['merge-base', '--is-ancestor', older, newer], { allowFailure: true });
  if (result.status === 0) return true;
  if (result.status === 1) return false;
  const stderr = decodeUtf8(result.stderr, 'Git stderr').trim();
  throw new Error(`Could not compare commit ancestry${stderr ? `: ${stderr}` : ''}`);
}

function deletionCommit(repoRoot, baseline, target, gitPath) {
  const result = runGit(repoRoot, [
    'log', '-1', '--full-history', '-m', '--no-renames', '--format=%H', '--diff-filter=D',
    `${baseline}..${target}`, '--', `:(literal)${gitPath}`,
  ], { allowFailure: true });
  if (result.status !== 0) {
    const stderr = decodeUtf8(result.stderr, 'Git stderr').trim();
    throw new Error(`Could not confirm deletion for ${JSON.stringify(gitPath)}${stderr ? `: ${stderr}` : ''}`);
  }
  const commits = [...new Set(decodeUtf8(result.stdout, 'Git deletion commit').split(/\r?\n/).filter(Boolean))];
  return commits[0] || '';
}

function assertTrackedImagePath(gitPath) {
  if (!gitPath.startsWith(`${IMAGE_ROOT}/`)) return false;
  if (gitPath.includes('\0')) throw new Error('Git returned an invalid NUL in an image path.');
  return true;
}

function gitBlob(repoRoot, target, gitPath) {
  return gitText(repoRoot, ['rev-parse', `${target}:${gitPath}`]);
}

function localBlob(repoRoot, sourcePath) {
  return gitText(repoRoot, ['hash-object', '--no-filters', '--', sourcePath]);
}

function hashBytes(value) {
  return createHash('sha256').update(value).digest('hex');
}

function hashFile(filePath) {
  return hashBytes(readFileSync(filePath));
}

export function buildDeltaPlan({ repoRoot, baseline: baselineInput, target: targetInput }) {
  const baseline = canonicalCommit(repoRoot, baselineInput, 'R2 baseline');
  const target = canonicalCommit(repoRoot, targetInput, 'Target commit');

  if (!isAncestor(repoRoot, baseline, target)) {
    if (isAncestor(repoRoot, target, baseline)) {
      return { baseline, target, stale: true, commits: [], files: [], deleted: [] };
    }
    throw new Error(
      `R2 baseline ${baseline} is not an ancestor of target ${target}; history diverged. ` +
      'Refusing a full scan; run the manual workflow_dispatch bootstrap after reviewing repository history.'
    );
  }

  if (baseline === target) {
    return { baseline, target, stale: false, commits: [], files: [], deleted: [] };
  }

  const commits = decodeUtf8(
    runGit(repoRoot, ['rev-list', '--reverse', `${baseline}..${target}`]).stdout,
    'Git commit list'
  ).split(/\r?\n/).filter(Boolean);
  const changed = new Set();

  for (const commit of commits) {
    // --no-renames records both the old and new paths. Current-tree filtering
    // below uploads only the new key and reports the removed key as retained.
    const raw = runGit(repoRoot, [
      'diff-tree', '--root', '--no-commit-id', '--name-only', '-r', '-z', '-m', '--no-renames', commit,
    ]).stdout;
    for (const gitPath of splitNul(raw, `image paths for ${commit}`)) {
      if (assertTrackedImagePath(gitPath)) changed.add(gitPath);
    }
  }

  const files = [];
  const deleted = [];
  for (const gitPath of [...changed].sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)))) {
    const treeEntry = runGit(repoRoot, ['cat-file', '-e', `${target}:${gitPath}`], { allowFailure: true });
    if (treeEntry.status !== 0) {
      const deletedAt = deletionCommit(repoRoot, baseline, target, gitPath);
      if (!deletedAt) {
        throw new Error(`Changed image path ${JSON.stringify(gitPath)} is absent from the target tree without a verified deletion.`);
      }
      deleted.push({ path: gitPath.slice(IMAGE_ROOT.length + 1), gitPath, deletedAt });
      continue;
    }

    const relative = gitPath.slice(IMAGE_ROOT.length + 1);
    const sourcePath = path.resolve(repoRoot, ...gitPath.split('/'));
    const rootPath = path.resolve(repoRoot, ...IMAGE_ROOT.split('/'));
    const pathFromRoot = path.relative(rootPath, sourcePath);
    if (!pathFromRoot || pathFromRoot.startsWith('..') || path.isAbsolute(pathFromRoot)) {
      throw new Error(`Image path escapes the local image root: ${JSON.stringify(gitPath)}`);
    }
    if (!existsSync(sourcePath)) {
      throw new Error(`Target commit contains ${JSON.stringify(gitPath)}, but checkout is missing that file.`);
    }
    const stat = lstatSync(sourcePath);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw new Error(`Target image path is not a regular file: ${JSON.stringify(gitPath)}`);
    }

    const expectedBlob = gitBlob(repoRoot, target, gitPath);
    const checkedOutBlob = localBlob(repoRoot, sourcePath);
    if (expectedBlob !== checkedOutBlob) {
      throw new Error(`Checkout bytes for ${JSON.stringify(gitPath)} do not match target commit ${target}.`);
    }

    files.push({
      path: relative,
      gitPath,
      sourcePath,
      sha256: hashFile(sourcePath),
    });
  }

  return { baseline, target, stale: false, commits, files, deleted };
}

function parseRemoteStat(stdout, requestedPath) {
  const text = decodeUtf8(stdout, 'rclone lsjson output').trim();
  if (!text) throw new Error(`rclone lsjson --stat returned empty output for exact key ${requestedPath}.`);
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(`rclone lsjson --stat returned invalid JSON for exact key ${requestedPath}.`);
  }
  const rows = Array.isArray(value) ? value : [value];
  if (rows.length === 0) return false;
  const basename = requestedPath.split('/').at(-1);
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    if (row.IsDir === true) continue;
    const name = typeof row.Name === 'string' ? row.Name : '';
    const objectPath = typeof row.Path === 'string' ? row.Path : '';
    if (name === basename || objectPath === basename || objectPath === requestedPath) return true;
  }
  if (rows.every(row => row?.IsDir === true)) return false;
  throw new Error(`rclone lsjson --stat returned an ambiguous object for exact key ${requestedPath}.`);
}

function createRcloneAdapter(binary = process.env.RCLONE_BIN || 'rclone') {
  return {
    run(args) {
      return runProcess(binary, args, { maxBuffer: 1024 * 1024 * 1024 });
    },
  };
}

function rcloneCall(rclone, args, label) {
  const result = rclone.run(args);
  if (result.status !== 0) {
    const stderr = decodeUtf8(asBuffer(result.stderr), 'rclone stderr').trim();
    throw new Error(`${label} failed${stderr ? `: ${stderr}` : ` (exit ${result.status})`}`);
  }
  return asBuffer(result.stdout);
}

function remoteExists(rclone, remotePath) {
  const output = rcloneCall(rclone, ['lsjson', remotePath, '--stat'], `Exact-key lookup for ${remotePath}`);
  return parseRemoteStat(output, remotePath.split(':').slice(1).join(':'));
}

function readRemoteBytes(rclone, remotePath, label) {
  return rcloneCall(rclone, ['cat', remotePath], label);
}

function stateFromBytes(bytes) {
  let state;
  try {
    state = JSON.parse(decodeUtf8(bytes, 'R2 baseline marker'));
  } catch (error) {
    throw new Error(`R2 baseline marker is invalid JSON: ${error.message}`);
  }
  if (
    state?.schemaVersion !== 1 ||
    state?.workflow !== WORKFLOW_ID ||
    state?.branch !== 'main' ||
    !/^[0-9a-f]{40}$/.test(String(state?.lastSuccessfulCommit || ''))
  ) {
    throw new Error(
      `R2 baseline marker has an unsupported or invalid schema at ${STATE_OBJECT_KEY}; ` +
      'refusing an automatic full scan.'
    );
  }
  return state;
}

function stateObject(bucket) {
  return `r2-ap-assets:${bucket}/${STATE_OBJECT_KEY}`;
}

function imageObject(bucket, relative) {
  return `r2-ap-assets:${bucket}/exams/images/${relative}`;
}

function loadBaseline(rclone, bucket, repoRoot, { allowMissing = false } = {}) {
  const marker = stateObject(bucket);
  if (!remoteExists(rclone, marker)) {
    if (allowMissing) return null;
    throw new Error(
      `R2 baseline marker is missing at ${STATE_OBJECT_KEY}. ` +
      'Run this workflow manually on main with mode=bootstrap after reviewing the initial full upload and verification.'
    );
  }
  const state = stateFromBytes(readRemoteBytes(rclone, marker, 'Read R2 baseline marker'));
  try {
    canonicalCommit(repoRoot, state.lastSuccessfulCommit, 'Stored R2 baseline');
  } catch (error) {
    throw new Error(
      `Stored R2 baseline ${state.lastSuccessfulCommit} is not a valid commit in the fetched history: ${error.message}. ` +
      'Refusing an automatic full scan; review history before a manual bootstrap.'
    );
  }
  return state;
}

function writeBaseline(rclone, bucket, state) {
  const marker = stateObject(bucket);
  const directory = mkdtempSync(path.join(os.tmpdir(), 'r2-assets-state-'));
  const filePath = path.join(directory, 'baseline.json');
  const bytes = Buffer.from(`${JSON.stringify(state, null, 2)}\n`, 'utf8');
  try {
    writeFileSync(filePath, bytes);
    rcloneCall(rclone, ['copyto', filePath, marker, '--ignore-times'], 'Write R2 baseline marker');
    const written = readRemoteBytes(rclone, marker, 'Verify R2 baseline marker');
    if (!written.equals(bytes)) throw new Error('R2 baseline marker readback did not match the written bytes.');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function listLocalImages(sourceRoot) {
  if (!existsSync(sourceRoot)) throw new Error(`Image root not found for manual bootstrap: ${sourceRoot}`);
  const files = [];
  const visit = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Manual bootstrap does not support image symlinks: ${fullPath}`);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile()) files.push(fullPath);
      else throw new Error(`Unsupported entry under image root: ${fullPath}`);
    }
  };
  visit(sourceRoot);
  return files;
}

function makeState(target, mode, counts, now) {
  return {
    schemaVersion: 1,
    workflow: WORKFLOW_ID,
    branch: 'main',
    lastSuccessfulCommit: target,
    mode,
    uploaded: counts.uploaded,
    verified: counts.verified,
    unchanged: counts.unchanged,
    deletedRetained: counts.deletedRetained,
    updatedAt: now,
  };
}

export function runCopy({
  mode = 'delta',
  target: targetInput,
  eventName = 'push',
  ref = 'refs/heads/main',
  repoRoot = process.cwd(),
  bucket,
  rclone = createRcloneAdapter(),
  now = new Date().toISOString(),
  log = message => console.log(message),
  stats = {},
}) {
  if (!['delta', 'bootstrap'].includes(mode)) throw new Error(`Unsupported R2 sync mode: ${mode}`);
  if (ref !== 'refs/heads/main') throw new Error(`R2 writes are restricted to refs/heads/main (received ${ref}).`);
  if (!bucket || /[\r\n]/.test(bucket)) throw new Error('R2_BUCKET is missing or invalid.');
  const target = canonicalCommit(repoRoot, targetInput, 'Target commit');
  const checkout = gitText(repoRoot, ['rev-parse', 'HEAD']).toLowerCase();
  if (checkout !== target) {
    throw new Error(`Checkout HEAD ${checkout} does not match processed target commit ${target}.`);
  }
  log(`mode=${mode} processed_commit=${target} event=${eventName} ref=${ref}`);

  const sourceRoot = path.resolve(repoRoot, ...IMAGE_ROOT.split('/'));
  const remotePrefix = `r2-ap-assets:${bucket}/exams/images`;
  const counts = Object.assign(stats, {
    mode,
    processedCommit: target,
    baseline: null,
    uploaded: 0,
    verified: 0,
    unchanged: 0,
    deletedRetained: 0,
    comparisonTargets: 0,
    verificationFailures: 0,
    fullPrefixOperations: 0,
  });

  if (mode === 'bootstrap') {
    if (eventName !== 'workflow_dispatch') {
      throw new Error('Full bootstrap is allowed only from an explicit workflow_dispatch run.');
    }
    const priorState = loadBaseline(rclone, bucket, repoRoot, { allowMissing: true });
    if (priorState) {
      const priorBaseline = priorState.lastSuccessfulCommit;
      counts.baseline = priorBaseline;
      log(`baseline_commit=${priorBaseline}`);
      if (!isAncestor(repoRoot, priorBaseline, target)) {
        if (isAncestor(repoRoot, target, priorBaseline)) {
          log(`stale_bootstrap_skipped=${target} baseline_commit=${priorBaseline}; no R2 writes performed`);
          return {
            ...counts,
            status: 'stale-skipped',
            message: 'Bootstrap target is older than the successful R2 baseline; no R2 writes performed.',
          };
        }
        throw new Error(
          `Stored R2 baseline ${priorBaseline} is not an ancestor of bootstrap target ${target}; history diverged. ` +
          'Refusing to overwrite remote objects from an older or unrelated checkout.'
        );
      }
    }
    const localFiles = listLocalImages(sourceRoot);
    counts.comparisonTargets = localFiles.length;
    counts.uploaded = null;
    counts.unchanged = null;
    counts.fullPrefixOperations = 2;
    log(`bootstrap_local_files=${localFiles.length} remote_prefix=${remotePrefix}`);
    rcloneCall(rclone, ['copy', sourceRoot, remotePrefix, '--transfers', '16', '--checkers', '32'], 'Manual full upload');
    try {
      rcloneCall(rclone, ['check', sourceRoot, remotePrefix, '--one-way', '--download', '--checkers', '32'], 'Manual full verification');
    } catch (error) {
      counts.verificationFailures += 1;
      throw error;
    }
    counts.verified = localFiles.length;
    writeBaseline(rclone, bucket, makeState(target, 'bootstrap', counts, now));
    counts.baseline = target;
    log(`r2_sync_counts comparison_targets=${counts.comparisonTargets} identical=${counts.unchanged ?? 'unknown'} uploaded=${counts.uploaded ?? 'see rclone output'} verified=${counts.verified} verification_failures=${counts.verificationFailures}`);
    return {
      ...counts,
      status: 'success',
      message: 'Manual full upload and one-way download verification succeeded.',
    };
  }

  const priorState = loadBaseline(rclone, bucket, repoRoot);
  const baseline = priorState.lastSuccessfulCommit;
  counts.baseline = baseline;
  log(`baseline_commit=${baseline}`);
  log('delta_request_scope=existing selected keys are read in full for SHA-256; a missing exact key may use a limited LIST; mock tests do not establish Cloudflare API methods or request counts');
  if (!isAncestor(repoRoot, baseline, target)) {
    if (isAncestor(repoRoot, target, baseline)) {
      log(`stale_target_skipped=${target} baseline_commit=${baseline}; no R2 writes performed`);
      return {
        ...counts,
        status: 'stale-skipped',
        message: 'Target commit is older than the successful R2 baseline; no R2 writes performed.',
      };
    }
    throw new Error(
      `Stored R2 baseline ${baseline} is not an ancestor of target ${target}; history diverged. ` +
      'Refusing an automatic full scan; review history and use the manual bootstrap only if a full reconciliation is intended.'
    );
  }

  const plan = buildDeltaPlan({ repoRoot, baseline, target });
  counts.comparisonTargets = plan.files.length;
  counts.deletedRetained = plan.deleted.length;
  for (const item of plan.deleted) {
    log(`deleted_path_retained=${JSON.stringify(item.path)} deleted_at=${item.deletedAt}`);
  }

  for (const item of plan.files) {
    const remotePath = imageObject(bucket, item.path);
    log(`checking_exact_key=${JSON.stringify(item.path)} remote=${remotePath}`);
    let remoteHash = null;
    try {
      if (remoteExists(rclone, remotePath)) {
        remoteHash = hashBytes(readRemoteBytes(rclone, remotePath, `Read exact image key ${item.path}`));
      }
    } catch (error) {
      counts.verificationFailures += 1;
      throw error;
    }
    if (remoteHash !== null) {
      if (remoteHash === item.sha256) {
        counts.unchanged += 1;
        counts.verified += 1;
        log(`unchanged_content_skipped=${JSON.stringify(item.path)} sha256=${item.sha256}`);
        continue;
      }
    }

    log(`upload_exact_key=${JSON.stringify(item.path)} sha256=${item.sha256}`);
    rcloneCall(
      rclone,
      ['copyto', item.sourcePath, remotePath, '--ignore-times'],
      `Upload exact image key ${item.path}`
    );
    counts.uploaded += 1;
    let verifiedHash;
    try {
      verifiedHash = hashBytes(readRemoteBytes(rclone, remotePath, `Verify exact image key ${item.path}`));
    } catch (error) {
      counts.verificationFailures += 1;
      throw error;
    }
    if (verifiedHash !== item.sha256) {
      counts.verificationFailures += 1;
      throw new Error(
        `Uploaded bytes failed SHA-256 verification for ${JSON.stringify(item.path)}: ` +
        `expected ${item.sha256}, received ${verifiedHash}.`
      );
    }
    counts.verified += 1;
  }

  // This exact-key marker is the commit point. It is written only after every
  // changed current object has been uploaded or content-verified.
  if (target !== baseline) {
    writeBaseline(rclone, bucket, makeState(target, 'delta', counts, now));
    counts.baseline = target;
  }

  log(`r2_sync_counts comparison_targets=${counts.comparisonTargets} identical=${counts.unchanged} uploaded=${counts.uploaded} verified=${counts.verified} verification_failures=${counts.verificationFailures}`);
  return {
    ...counts,
    status: target === baseline ? 'already-current' : 'success',
    message: `Exact-key delta processed ${plan.files.length} current image path(s); no full-prefix listing performed.`,
  };
}

function formatSummary(result, status = result.status, error = '') {
  const requestNote = result.mode === 'bootstrap'
    ? 'Manual bootstrap performs a full-prefix copy and --one-way --download content verification for every local image; use only for initial preparation or an explicitly reviewed reconciliation.'
    : 'Delta SHA-256 comparison reads full contents of selected existing objects; a missing exact key may cause a limited LIST. Mock tests do not establish Cloudflare API methods or request counts.';
  return [
    '## R2 archive image copy',
    '',
    `- Status: ${status}`,
    `- Mode: ${result.mode}`,
    `- Processed commit: \`${result.processedCommit}\``,
    `- Baseline commit: \`${result.baseline || '(not applicable)'}\``,
    `- Comparison targets: ${result.comparisonTargets ?? 0}`,
    `- Identical content skipped: ${result.unchanged ?? 'see rclone output (manual bootstrap)'}`,
    `- Uploaded: ${result.uploaded ?? 'see rclone output (manual bootstrap)'}`,
    `- Current image keys verified: ${result.verified ?? 0}`,
    `- Verification failures: ${result.verificationFailures ?? 0}`,
    `- Deleted local paths retained remotely: ${result.deletedRetained}`,
    `- Full-prefix commands (manual bootstrap only): ${result.fullPrefixOperations}`,
    `- Request behavior: ${requestNote}`,
    ...(error ? [`- Error: ${error}`] : []),
    '',
    result.message,
    '',
  ].join('\n');
}

function cli() {
  const env = process.env;
  const base = {
    mode: env.R2_SYNC_MODE || 'delta',
    target: env.GITHUB_SHA,
    eventName: env.GITHUB_EVENT_NAME,
    ref: env.GITHUB_REF,
    repoRoot: process.cwd(),
    bucket: env.R2_BUCKET,
  };
  const stats = {
    mode: base.mode,
    processedCommit: String(base.target || '(unavailable)'),
    baseline: null,
    uploaded: 0,
    verified: 0,
    unchanged: 0,
    deletedRetained: 0,
    comparisonTargets: 0,
    verificationFailures: 0,
    fullPrefixOperations: 0,
  };
  try {
    const result = runCopy({ ...base, stats });
    const summary = formatSummary(result);
    if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, `${summary}\n`);
    console.log(summary);
  } catch (error) {
    const message = String(error?.message || error);
    const failure = {
      ...stats,
      mode: base.mode,
      status: 'failed',
      processedCommit: String(base.target || '(unavailable)'),
      baseline: stats.baseline || '(unchanged unless final marker write succeeded; see step log)',
      message: 'A failed delta may have partially uploaded exact keys; retry from the stored cursor. If final marker readback failed, inspect that exact marker key.',
    };
    const summary = formatSummary(failure, 'failed', message);
    if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, `${summary}\n`);
    console.error(`R2 archive asset copy failed for processed_commit=${base.target || '(unavailable)'}: ${message}`);
    process.exitCode = 1;
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) cli();
