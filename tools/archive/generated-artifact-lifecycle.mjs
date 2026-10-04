import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

export const GENERATED_WORKSPACE_ROOTS = Object.freeze([
  'archive/_generated',
  'archive/exams/_generated',
  'archive/tools/logic-visual-audit/reports',
]);

export const GENERATED_INVENTORY_ROOTS = Object.freeze([
  ...GENERATED_WORKSPACE_ROOTS,
  'alive/runtime',
]);

const LIFECYCLE_FILE = '.lifecycle.json';

function now() {
  return new Date().toISOString();
}

function normalizeRepoPath(value) {
  const normalized = String(value ?? '').replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalized || normalized.startsWith('/') || /^[A-Za-z]:\//.test(normalized)) {
    throw new Error(`REPOSITORY_PATH_INVALID:${value}`);
  }
  const clean = path.posix.normalize(normalized);
  if (clean === '..' || clean.startsWith('../')) throw new Error(`REPOSITORY_PATH_ESCAPE:${value}`);
  return clean;
}

function resolveRepoPath(repoRoot, repoRelativePath) {
  const normalized = normalizeRepoPath(repoRelativePath);
  const root = path.resolve(repoRoot);
  const absolute = path.resolve(root, normalized);
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    throw new Error(`REPOSITORY_PATH_ESCAPE:${repoRelativePath}`);
  }
  return { normalized, absolute };
}

function resolveInside(parent, relativePath) {
  const relative = normalizeRepoPath(relativePath);
  const parentAbsolute = path.resolve(parent);
  const absolute = path.resolve(parentAbsolute, relative);
  if (absolute !== parentAbsolute && !absolute.startsWith(`${parentAbsolute}${path.sep}`)) {
    throw new Error(`RUN_PATH_ESCAPE:${relativePath}`);
  }
  return absolute;
}

function isWithin(child, parent) {
  const childAbsolute = path.resolve(child);
  const parentAbsolute = path.resolve(parent);
  return childAbsolute === parentAbsolute || childAbsolute.startsWith(`${parentAbsolute}${path.sep}`);
}

function generatedRootFor(repoRoot, runDir) {
  const runAbsolute = path.resolve(runDir);
  const roots = GENERATED_WORKSPACE_ROOTS.map((root) => ({
    root,
    absolute: resolveRepoPath(repoRoot, root).absolute,
  }));
  const match = roots.find(({ absolute }) => isWithin(runAbsolute, absolute) && runAbsolute !== absolute);
  if (!match) throw new Error(`GENERATED_RUN_ROOT_REQUIRED:${runDir}`);
  return match;
}

function atomicWriteJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${randomUUID()}.tmp`);
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temporary, file);
}

function lifecyclePath(runDir) {
  return path.join(runDir, LIFECYCLE_FILE);
}

export function writeGeneratedLifecycle(runDir, payload = {}) {
  const timestamp = now();
  const lifecycle = {
    schemaVersion: 'GENERATED_ARTIFACT_LIFECYCLE_0.1',
    runId: String(payload.runId || path.basename(runDir)),
    producer: String(payload.producer || 'unknown'),
    status: String(payload.status || 'ACTIVE'),
    tempPaths: [...new Set((payload.tempPaths || []).map(normalizeRepoPath))].sort(),
    canonicalPaths: [...new Set([LIFECYCLE_FILE, ...(payload.canonicalPaths || []).map(normalizeRepoPath)])].sort(),
    createdAt: payload.createdAt || timestamp,
    updatedAt: timestamp,
  };
  if (!['ACTIVE', 'FAILED', 'SUCCEEDED', 'HELD'].includes(lifecycle.status)) {
    throw new Error(`GENERATED_LIFECYCLE_STATUS_INVALID:${lifecycle.status}`);
  }
  atomicWriteJson(lifecyclePath(runDir), lifecycle);
  return lifecycle;
}

export function readGeneratedLifecycle(runDir) {
  const file = lifecyclePath(runDir);
  if (!fs.existsSync(file)) throw new Error(`GENERATED_LIFECYCLE_MISSING:${file}`);
  let value;
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`GENERATED_LIFECYCLE_INVALID:${file}:${error.message}`);
  }
  if (!value || typeof value !== 'object' || typeof value.status !== 'string') {
    throw new Error(`GENERATED_LIFECYCLE_INVALID:${file}`);
  }
  return value;
}

export function markGeneratedRun(runDir, status, patch = {}) {
  const current = readGeneratedLifecycle(runDir);
  return writeGeneratedLifecycle(runDir, {
    ...current,
    ...patch,
    status,
    createdAt: current.createdAt,
  });
}

function removeExcept(target, runDir, canonical) {
  if (!fs.existsSync(target)) return { files: 0, bytes: 0 };
  const relative = path.relative(runDir, target).replaceAll('\\', '/') || '.';
  if (canonical.has(relative)) return { files: 0, bytes: 0 };
  const stat = fs.lstatSync(target);
  if (stat.isFile() || stat.isSymbolicLink()) {
    const stats = { files: 1, bytes: stat.isFile() ? stat.size : 0 };
    fs.rmSync(target, { recursive: true, force: false });
    return stats;
  }
  let files = 0;
  let bytes = 0;
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const child = removeExcept(path.join(target, entry.name), runDir, canonical);
    files += child.files;
    bytes += child.bytes;
  }
  if (fs.existsSync(target) && fs.readdirSync(target).length === 0) fs.rmdirSync(target);
  return { files, bytes };
}

export function cleanupGeneratedRun({ repoRoot, runDir, mode = 'success' }) {
  if (mode !== 'success') throw new Error(`GENERATED_CLEANUP_MODE_UNSUPPORTED:${mode}`);
  const { root: generatedRoot } = generatedRootFor(repoRoot, runDir);
  const runAbsolute = path.resolve(runDir);
  if (!fs.existsSync(runAbsolute) || !fs.statSync(runAbsolute).isDirectory()) {
    throw new Error(`GENERATED_RUN_MISSING:${runDir}`);
  }
  const lifecycle = readGeneratedLifecycle(runAbsolute);
  if (lifecycle.status !== 'SUCCEEDED') {
    return { status: 'SKIPPED', reason: 'RUN_NOT_SUCCEEDED', generatedRoot, runDir: runAbsolute };
  }
  const canonical = new Set([LIFECYCLE_FILE, ...(lifecycle.canonicalPaths || [])].map(normalizeRepoPath));
  const removed = [];
  let removedBytes = 0;
  for (const relative of [...new Set(lifecycle.tempPaths || [])].map(normalizeRepoPath).sort()) {
    if (canonical.has(relative)) continue;
    const target = resolveInside(runAbsolute, relative);
    if (!isWithin(target, runAbsolute)) throw new Error(`RUN_PATH_ESCAPE:${relative}`);
    const stats = removeExcept(target, runAbsolute, canonical);
    if (stats.files > 0) {
      removed.push(relative);
      removedBytes += stats.bytes;
    }
  }
  const updated = writeGeneratedLifecycle(runAbsolute, {
    ...lifecycle,
    status: 'SUCCEEDED',
    cleanedAt: now(),
    cleanup: { status: 'CLEANED', removedFiles: removed.length, removedBytes, removedPaths: removed },
    createdAt: lifecycle.createdAt,
  });
  return {
    status: 'CLEANED',
    generatedRoot,
    runDir: runAbsolute,
    removedFiles: removed.length,
    removedBytes,
    removedPaths: removed,
    retainedPaths: [...canonical].sort(),
    lifecycle: updated,
  };
}

function trackedPaths(repoRoot, root) {
  try {
    return execFileSync('git', ['-C', path.resolve(repoRoot), 'ls-files', '--', root], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

export function inventoryGeneratedArtifacts({ repoRoot, roots = GENERATED_INVENTORY_ROOTS }) {
  const normalizedRoots = [...new Set(roots.map(normalizeRepoPath))].sort();
  const reports = normalizedRoots.map((root) => {
    const absolute = resolveRepoPath(repoRoot, root).absolute;
    const files = walkFiles(absolute);
    const tracked = new Set(trackedPaths(repoRoot, root));
    const extensionCounts = {};
    let bytes = 0;
    for (const file of files) {
      const relative = path.relative(path.resolve(repoRoot), file).replaceAll('\\', '/');
      const extension = path.extname(file).toLowerCase() || '(none)';
      extensionCounts[extension] = (extensionCounts[extension] || 0) + 1;
      bytes += fs.statSync(file).size;
      if (!relative.startsWith(`${root}/`)) throw new Error(`GENERATED_INVENTORY_PATH_ESCAPE:${relative}`);
    }
    return { root, exists: fs.existsSync(absolute), fileCount: files.length, bytes, trackedCount: [...tracked].length, extensionCounts };
  });
  return {
    schemaVersion: 'GENERATED_ARTIFACT_INVENTORY_0.1',
    roots: reports,
    totalFiles: reports.reduce((sum, row) => sum + row.fileCount, 0),
    totalBytes: reports.reduce((sum, row) => sum + row.bytes, 0),
    productionFiles: 0,
  };
}
