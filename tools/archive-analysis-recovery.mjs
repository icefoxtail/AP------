import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MANIFEST_RELATIVE_PATH = 'tools/archive-analysis-recovery-manifest.v1.json';
const EXPECTED_SCHEMA = 'archive-analysis-recovery/v1';
const EXPECTED_BASELINE = 'd305af51b01b15e09d37839538ef3baaa269bd55';
const EXPECTED_TREE = '979303b78a9b8daddb048680b7c12a539c310dbb';

function runGit(root, args, { encoding = 'utf8', maxBuffer = 128 * 1024 * 1024 } = {}) {
  return execFileSync('git', ['-C', root, '-c', 'core.quotepath=false', ...args], {
    encoding,
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer
  });
}

function objectId(root, spec) {
  return runGit(root, ['rev-parse', '--verify', spec]).trim();
}

function objectSize(root, spec) {
  const size = runGit(root, ['cat-file', '-s', spec]).trim();
  if (!/^\d+$/.test(size)) throw new Error(`RECOVERY_OBJECT_SIZE_INVALID:${spec}`);
  return Number(size);
}

function readBlob(root, spec, expectedSize) {
  return runGit(root, ['cat-file', 'blob', spec], {
    encoding: null,
    maxBuffer: Math.max(8 * 1024 * 1024, expectedSize + 1024 * 1024)
  });
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function validateRepoPath(value, label) {
  if (typeof value !== 'string' || !value.startsWith('archive/analysis/')) {
    throw new Error(`RECOVERY_PATH_INVALID:${label}`);
  }
  if (value.includes('\\') || value.includes('\0')) throw new Error(`RECOVERY_PATH_INVALID:${label}`);
  const segments = value.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) {
    throw new Error(`RECOVERY_PATH_INVALID:${label}`);
  }
  return value;
}

function resolveInside(root, repoPath, label) {
  const absoluteRoot = path.resolve(root);
  const absolutePath = path.resolve(absoluteRoot, ...repoPath.split('/'));
  const relative = path.relative(absoluteRoot, absolutePath);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
    throw new Error(`RECOVERY_PATH_OUTSIDE_ROOT:${label}`);
  }
  return absolutePath;
}

export function loadRecoveryManifest(root, manifestPath = path.join(root, MANIFEST_RELATIVE_PATH)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.schemaVersion !== EXPECTED_SCHEMA) throw new Error('RECOVERY_SCHEMA_UNSUPPORTED');
  if (manifest.baselineCommit !== EXPECTED_BASELINE || manifest.baselineArchiveAnalysisTreeSha !== EXPECTED_TREE) {
    throw new Error('RECOVERY_BASELINE_MISMATCH');
  }
  if (!Array.isArray(manifest.entries) || manifest.entries.length !== 11) throw new Error('RECOVERY_ENTRY_COUNT_INVALID');
  if (manifest.scope?.removedPathCount !== 11 || manifest.scope?.headCheckoutBytesReduced !== 326839777) {
    throw new Error('RECOVERY_SCOPE_INVALID');
  }

  const seenPaths = new Set();
  const seenBlobs = new Set();
  const referenceFiles = new Set();
  let totalBytes = 0;
  for (const entry of manifest.entries) {
    validateRepoPath(entry.originalPath, 'originalPath');
    validateRepoPath(entry.retainedIdenticalPath, 'retainedIdenticalPath');
    if (seenPaths.has(entry.originalPath)) throw new Error(`RECOVERY_DUPLICATE_PATH:${entry.originalPath}`);
    seenPaths.add(entry.originalPath);
    if (!/^[0-9a-f]{40}$/.test(entry.gitBlobSha1 ?? '')) throw new Error(`RECOVERY_BLOB_ID_INVALID:${entry.originalPath}`);
    if (!/^[0-9a-f]{64}$/.test(entry.sha256 ?? '')) throw new Error(`RECOVERY_SHA256_INVALID:${entry.originalPath}`);
    if (!Number.isSafeInteger(entry.sizeBytes) || entry.sizeBytes <= 0) throw new Error(`RECOVERY_SIZE_INVALID:${entry.originalPath}`);
    if (!Array.isArray(entry.historicalReferenceFiles)) throw new Error(`RECOVERY_REFERENCES_INVALID:${entry.originalPath}`);
    for (const reference of entry.historicalReferenceFiles) {
      validateRepoPath(reference, 'historicalReferenceFile');
      referenceFiles.add(reference);
    }
    seenBlobs.add(entry.gitBlobSha1);
    totalBytes += entry.sizeBytes;
  }
  if (totalBytes !== manifest.scope.headCheckoutBytesReduced) throw new Error('RECOVERY_TOTAL_BYTES_INVALID');
  if (manifest.scope.historicalReferenceFileCount !== referenceFiles.size
      || manifest.scope.historicalReferenceMentionCount !== manifest.entries.reduce((sum, entry) => sum + entry.historicalReferenceFiles.length, 0)) {
    throw new Error('RECOVERY_REFERENCE_COUNTS_INVALID');
  }
  return { manifest, uniqueBlobCount: seenBlobs.size, totalBytes };
}

function optionalObjectId(root, spec) {
  try { return objectId(root, spec); } catch { return null; }
}

function validateBaseline(root, baselineCommit, baselineTreeSha) {
  const resolved = optionalObjectId(root, `${baselineCommit}^{commit}`);
  if (!resolved) return false;
  if (resolved !== baselineCommit) throw new Error('RECOVERY_BASELINE_COMMIT_MISMATCH');
  const tree = objectId(root, `${baselineCommit}:archive/analysis`);
  if (tree !== baselineTreeSha) throw new Error('RECOVERY_BASELINE_TREE_MISMATCH');
  return true;
}

function verifyPathObject(root, baselineCommit, repoPath, expectedBlob, expectedSize) {
  const spec = `${baselineCommit}:${repoPath}`;
  if (objectId(root, spec) !== expectedBlob) throw new Error(`RECOVERY_PATH_BLOB_MISMATCH:${repoPath}`);
  if (objectSize(root, spec) !== expectedSize) throw new Error(`RECOVERY_PATH_SIZE_MISMATCH:${repoPath}`);
}

function verifyEntries(root, manifest, entries) {
  const baselineAvailable = validateBaseline(root, manifest.baselineCommit, manifest.baselineArchiveAnalysisTreeSha);
  const rawByBlob = new Map();
  const sourceByBlob = new Map();
  const referenceFiles = new Set();

  for (const entry of entries) {
    const headRetainedSpec = `HEAD:${entry.retainedIdenticalPath}`;
    const headRetainedBlob = optionalObjectId(root, headRetainedSpec);
    const headRetainedSize = headRetainedBlob ? objectSize(root, headRetainedSpec) : null;
    let baselineOriginalSpec = null;

    if (baselineAvailable) {
      baselineOriginalSpec = `${manifest.baselineCommit}:${entry.originalPath}`;
      verifyPathObject(root, manifest.baselineCommit, entry.originalPath, entry.gitBlobSha1, entry.sizeBytes);
      verifyPathObject(root, manifest.baselineCommit, entry.retainedIdenticalPath, entry.gitBlobSha1, entry.sizeBytes);
    }

    let sourceSpec;
    if (headRetainedBlob === entry.gitBlobSha1 && headRetainedSize === entry.sizeBytes) {
      sourceSpec = headRetainedSpec;
    } else if (baselineAvailable) {
      sourceSpec = baselineOriginalSpec;
    } else {
      throw new Error(`RECOVERY_NO_VERIFIED_SOURCE:${entry.originalPath}`);
    }

    let raw = rawByBlob.get(entry.gitBlobSha1);
    if (!raw) {
      raw = readBlob(root, sourceSpec, entry.sizeBytes);
      if (raw.length !== entry.sizeBytes) throw new Error(`RECOVERY_RAW_SIZE_MISMATCH:${entry.originalPath}`);
      if (sha256(raw) !== entry.sha256) throw new Error(`RECOVERY_RAW_SHA256_MISMATCH:${entry.originalPath}`);
      rawByBlob.set(entry.gitBlobSha1, raw);
      sourceByBlob.set(entry.gitBlobSha1, sourceSpec.startsWith('HEAD:') ? 'retained-head' : 'baseline');
    }

    for (const reference of entry.historicalReferenceFiles) referenceFiles.add(reference);
  }

  for (const reference of referenceFiles) {
    const headSpec = `HEAD:${reference}`;
    const headObject = optionalObjectId(root, headSpec);
    if (!headObject) throw new Error(`RECOVERY_HISTORICAL_REFERENCE_MISSING:${reference}`);
    if (baselineAvailable && objectId(root, `${manifest.baselineCommit}:${reference}`) !== headObject) {
      throw new Error(`RECOVERY_HISTORICAL_REFERENCE_CHANGED:${reference}`);
    }
  }

  return {
    rawByBlob,
    sourceByBlob,
    referenceFileCount: referenceFiles.size,
    baselineAvailable
  };
}

export function checkRecoveryManifest({ root, manifestPath } = {}) {
  const repoRoot = fs.realpathSync(root ?? runGit(process.cwd(), ['rev-parse', '--show-toplevel']).trim());
  const loaded = loadRecoveryManifest(repoRoot, manifestPath ?? path.join(repoRoot, MANIFEST_RELATIVE_PATH));
  const verification = verifyEntries(repoRoot, loaded.manifest, loaded.manifest.entries);
  return {
    entryCount: loaded.manifest.entries.length,
    uniqueBlobCount: loaded.uniqueBlobCount,
    totalBytes: loaded.totalBytes,
    referenceFileCount: verification.referenceFileCount,
    baselineCommit: loaded.manifest.baselineCommit,
    baselineAvailable: verification.baselineAvailable
  };
}

function ensureSafeDirectories(root, relativeDirectory) {
  let current = root;
  for (const segment of relativeDirectory.split('/').filter(Boolean)) {
    current = path.join(current, segment);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`RECOVERY_PARENT_NOT_DIRECTORY:${current}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      try { fs.mkdirSync(current); } catch (mkdirError) {
        if (mkdirError.code !== 'EEXIST') throw mkdirError;
        const stat = fs.lstatSync(current);
        if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`RECOVERY_PARENT_NOT_DIRECTORY:${current}`);
      }
    }
  }
}

function preflightDestinations(root, entries) {
  for (const entry of entries) {
    const destination = resolveInside(root, entry.originalPath, 'restorePath');
    const relativeDirectory = path.relative(root, path.dirname(destination));
    let current = root;
    for (const segment of relativeDirectory.split(path.sep).filter(Boolean)) {
      current = path.join(current, segment);
      try {
        const stat = fs.lstatSync(current);
        if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`RECOVERY_PARENT_NOT_DIRECTORY:${current}`);
      } catch (error) {
        if (error.code === 'ENOENT') break;
        throw error;
      }
    }
    try {
      fs.lstatSync(destination);
      throw new Error(`RECOVERY_TARGET_EXISTS:${entry.originalPath}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

export function restoreRecoveryPaths({ root, paths, destinationRoot, manifestPath } = {}) {
  if (!Array.isArray(paths) || paths.length < 1) throw new Error('RECOVERY_RESTORE_PATHS_REQUIRED');
  const repoRoot = fs.realpathSync(root ?? runGit(process.cwd(), ['rev-parse', '--show-toplevel']).trim());
  const outputRootInput = path.resolve(destinationRoot ?? repoRoot);
  const outputRootStat = fs.lstatSync(outputRootInput);
  if (outputRootStat.isSymbolicLink() || !outputRootStat.isDirectory()) throw new Error('RECOVERY_DESTINATION_INVALID');
  const outputRoot = fs.realpathSync(outputRootInput);
  const loaded = loadRecoveryManifest(repoRoot, manifestPath ?? path.join(repoRoot, MANIFEST_RELATIVE_PATH));
  const requested = new Set(paths.map(value => validateRepoPath(value, 'restorePath')));
  const selected = loaded.manifest.entries.filter(entry => requested.has(entry.originalPath));
  if (selected.length !== requested.size) throw new Error('RECOVERY_RESTORE_PATH_NOT_IN_MANIFEST');

  const verification = verifyEntries(repoRoot, loaded.manifest, selected);
  preflightDestinations(outputRoot, selected);
  const restored = [];
  for (const entry of selected) {
    const destination = resolveInside(outputRoot, entry.originalPath, 'restorePath');
    const relativeDirectory = path.relative(outputRoot, path.dirname(destination)).split(path.sep).join('/');
    if (relativeDirectory) ensureSafeDirectories(outputRoot, relativeDirectory);

    const raw = verification.rawByBlob.get(entry.gitBlobSha1);
    let descriptor;
    try {
      descriptor = fs.openSync(destination, 'wx');
    } catch (error) {
      if (error.code === 'EEXIST') throw new Error(`RECOVERY_TARGET_EXISTS:${entry.originalPath}`);
      throw error;
    }
    try {
      fs.writeFileSync(descriptor, raw);
      fs.fsyncSync(descriptor);
    } finally {
      fs.closeSync(descriptor);
    }

    const restoredBytes = fs.readFileSync(destination);
    if (restoredBytes.length !== entry.sizeBytes || sha256(restoredBytes) !== entry.sha256) {
      throw new Error(`RECOVERY_RESTORED_BYTES_MISMATCH:${entry.originalPath}`);
    }
    restored.push({ path: entry.originalPath, sizeBytes: restoredBytes.length, sha256: entry.sha256 });
  }
  return {
    restored,
    baselineCommit: loaded.manifest.baselineCommit,
    baselineAvailable: verification.baselineAvailable
  };
}

function printUsage() {
  console.log('Usage:');
  console.log('  node tools/archive-analysis-recovery.mjs --check');
  console.log('  node tools/archive-analysis-recovery.mjs --restore archive/analysis/<exact-path> [--destination <existing-directory>]');
  console.log('  node tools/archive-analysis-recovery.mjs --restore-all --destination <existing-directory>');
}

export function runRecoveryCli(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    return 0;
  }
  const action = argv[0];
  const root = fs.realpathSync(runGit(process.cwd(), ['rev-parse', '--show-toplevel']).trim());
  if (action === '--check' && argv.length === 1) {
    const report = checkRecoveryManifest({ root });
    const referenceStatus = report.baselineAvailable ? 'unchanged against baseline' : 'present in current HEAD';
    console.log(`Recovery manifest OK: ${report.entryCount} original paths, ${report.uniqueBlobCount} unique blobs, ${report.referenceFileCount} historical references ${referenceStatus}.`);
    console.log(`HEAD checkout payload: ${report.totalBytes} bytes recoverable from ${report.baselineCommit}; historical Git storage reduction: 0 bytes.`);
    return 0;
  }

  if (action === '--restore' || action === '--restore-all') {
    let destinationRoot = root;
    const paths = [];
    for (let index = 1; index < argv.length; index += 1) {
      if (argv[index] === '--destination') {
        if (!argv[index + 1]) throw new Error('RECOVERY_DESTINATION_REQUIRED');
        destinationRoot = path.resolve(argv[index + 1]);
        index += 1;
      } else if (!argv[index].startsWith('--')) {
        paths.push(argv[index]);
      } else {
        throw new Error(`RECOVERY_OPTION_UNKNOWN:${argv[index]}`);
      }
    }

    let selectedPaths = paths;
    if (action === '--restore-all') {
      if (paths.length) throw new Error('RECOVERY_RESTORE_ALL_TAKES_NO_PATHS');
      const manifest = loadRecoveryManifest(root).manifest;
      selectedPaths = manifest.entries.map(entry => entry.originalPath);
    } else if (paths.length !== 1) {
      throw new Error('RECOVERY_RESTORE_REQUIRES_ONE_EXACT_PATH');
    }

    const report = restoreRecoveryPaths({ root, paths: selectedPaths, destinationRoot });
    for (const entry of report.restored) console.log(`Restored ${entry.path} (${entry.sizeBytes} bytes, sha256 ${entry.sha256}).`);
    return 0;
  }

  printUsage();
  throw new Error('RECOVERY_ACTION_INVALID');
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && pathToFileURL(invokedPath).href === import.meta.url) {
  try {
    process.exitCode = runRecoveryCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
