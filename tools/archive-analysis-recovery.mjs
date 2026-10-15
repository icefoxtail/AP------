import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MANIFEST_RELATIVE_PATH = 'tools/archive-analysis-recovery-manifest.v1.json';
const DRIVE_ROOT_RECEIPT_RELATIVE_PATH = 'archive/data/archive-analysis-drive-root-receipt.v1.json';
const HOT_AUTHORITY_INDEX_RELATIVE_PATH = 'archive/data/evidence-authority/v1/index.json';
const EXPECTED_SCHEMA = 'archive-analysis-recovery/v1';
const EXPECTED_BASELINE = 'd305af51b01b15e09d37839538ef3baaa269bd55';
const EXPECTED_TREE = '979303b78a9b8daddb048680b7c12a539c310dbb';
const DRIVE_ROOT_RECEIPT_SCHEMA = 'archive-analysis-drive-root-receipt/v1';
const EXPECTED_DRIVE_PACK_COUNT = 200;
const EXPECTED_SOURCE_MANIFEST_COUNT = 3;
const HEX40 = /^[0-9a-f]{40}$/i;
const HEX64 = /^[0-9a-f]{64}$/i;

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

function safeReadJson(root, relativePath, label) {
  const absolute = resolveInside(root, relativePath, label);
  let stat;
  try { stat = fs.lstatSync(absolute); }
  catch (error) {
    if (error.code === 'ENOENT') throw new Error(`RECOVERY_${label.toUpperCase()}_MISSING`);
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`RECOVERY_${label.toUpperCase()}_INVALID_PATH`);
  try { return JSON.parse(fs.readFileSync(absolute, 'utf8')); }
  catch { throw new Error(`RECOVERY_${label.toUpperCase()}_INVALID_JSON`); }
}

function baselineTreeMetrics(root, baselineCommit) {
  const listing = runGit(root, ['ls-tree', '-r', '-l', '-z', `${baselineCommit}:archive/analysis`], {
    encoding: null,
    maxBuffer: 64 * 1024 * 1024
  });
  let pathCount = 0;
  let pathBytes = 0;
  for (const record of listing.toString('utf8').split('\0')) {
    if (!record) continue;
    const tab = record.indexOf('\t');
    if (tab < 0) throw new Error('RECOVERY_BASELINE_TREE_LISTING_INVALID');
    const metadata = record.slice(0, tab).trim().split(/\s+/);
    if (metadata.length !== 4 || !HEX40.test(metadata[2]) || !/^\d+$/.test(metadata[3])) {
      throw new Error('RECOVERY_BASELINE_TREE_LISTING_INVALID');
    }
    pathCount += 1;
    pathBytes += Number(metadata[3]);
  }
  return { pathCount, pathBytes };
}

function validateDriveBinding(row, label) {
  const readback = row?.driveReadback;
  const sourceVersion = row?.sourceVersion;
  const expectedSha = String(row?.sha256 ?? '').toLowerCase();
  if (!/^[A-Za-z0-9_-]+$/.test(row?.driveFileId ?? '')
      || typeof row?.driveParentId !== 'string' || !row.driveParentId
      || typeof row?.name !== 'string' || !row.name
      || typeof row?.driveName !== 'string' || row.driveName !== row.name
      || typeof row?.driveMimeType !== 'string' || !row.driveMimeType
      || !Number.isSafeInteger(row?.sizeBytes) || row.sizeBytes <= 0 || !HEX64.test(expectedSha)
      || row?.driveSizeBytes !== row.sizeBytes
      || !readback || readback.status !== 'FULL_BYTES_VERIFIED' || readback.sha256 !== expectedSha
      || readback.sizeBytes !== row.sizeBytes || typeof readback.method !== 'string' || !readback.method
      || typeof readback.verifiedAtUtc !== 'string' || !Number.isFinite(Date.parse(readback.verifiedAtUtc))
      || !sourceVersion || sourceVersion.id !== row.driveFileId
      || !Array.isArray(sourceVersion.parentIds) || !sourceVersion.parentIds.includes(row.driveParentId)
      || typeof sourceVersion.observedModifiedTime !== 'string'
      || !Number.isFinite(Date.parse(sourceVersion.observedModifiedTime))) {
    throw new Error(`RECOVERY_DRIVE_ROOT_RECEIPT_BINDING_INVALID:${label}`);
  }
}

function commitIsAncestor(root, ancestor, descendant) {
  try {
    runGit(root, ['merge-base', '--is-ancestor', ancestor, descendant]);
    return true;
  } catch (error) {
    if (error.status === 1) return false;
    throw error;
  }
}

function validateDriveRootReceipt(root, manifest, baselineMetrics, receiptPath) {
  const relativeReceiptPath = receiptPath
    ? path.relative(root, path.resolve(receiptPath)).split(path.sep).join('/')
    : DRIVE_ROOT_RECEIPT_RELATIVE_PATH;
  const receipt = safeReadJson(root, relativeReceiptPath, 'drive_root_receipt');
  if (receipt.schemaVersion !== DRIVE_ROOT_RECEIPT_SCHEMA || receipt.status !== 'FULL_BYTES_VERIFIED'
      || typeof receipt.method !== 'string'
      || !receipt.method.includes('every decompressed raw object/alias verified against original Git blobs')
      || typeof receipt.verifiedAtUtc !== 'string' || !Number.isFinite(Date.parse(receipt.verifiedAtUtc))
      || receipt.baselineCommit !== manifest.baselineCommit
      || receipt.baselineAnalysisTreeSha !== manifest.baselineArchiveAnalysisTreeSha
      || receipt.baselineRootTreeShas?.['archive/analysis'] !== manifest.baselineArchiveAnalysisTreeSha
      || !Array.isArray(receipt.allowedRoots) || !receipt.allowedRoots.includes('archive/analysis/')
      || receipt.historyRewrite !== false || receipt.historicalGitStorageBytesReduced !== 0) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_BASELINE_MISMATCH');
  }

  const preservation = receipt.preservationSummary;
  if (!preservation
      || preservation.analysisBaselinePathCount !== baselineMetrics.pathCount
      || preservation.analysisBaselinePathBytes !== baselineMetrics.pathBytes) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_ANALYSIS_COVERAGE_MISMATCH');
  }

  const tracking = receipt.trackingRemovalSummary;
  if (!tracking || !HEX40.test(tracking.currentHead ?? '')
      || !Number.isSafeInteger(tracking.pathCount) || tracking.pathCount < 1
      || !Number.isSafeInteger(tracking.pathBytes) || tracking.pathBytes < 1
      || tracking.previouslyRemovedAliasCount !== manifest.entries.length
      || tracking.previouslyRemovedAliasBytes !== manifest.scope.headCheckoutBytesReduced) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_REMOVAL_BINDING_MISMATCH');
  }
  const currentHead = objectId(root, 'HEAD^{commit}');
  const receiptHead = optionalObjectId(root, `${tracking.currentHead}^{commit}`);
  if (!receiptHead || receiptHead !== tracking.currentHead || !commitIsAncestor(root, receiptHead, currentHead)) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_HEAD_MISMATCH');
  }

  if (!HEX40.test(receipt.baselineAnalysisTreeSha ?? '')
      || !Number.isSafeInteger(receipt.pathCount) || receipt.pathCount < baselineMetrics.pathCount
      || !Number.isSafeInteger(receipt.uniqueBlobCount) || receipt.uniqueBlobCount < 1
      || receipt.uniqueBlobCount > receipt.pathCount
      || !Number.isSafeInteger(receipt.pathBytes) || receipt.pathBytes < baselineMetrics.pathBytes
      || !Number.isSafeInteger(receipt.uniqueRawBytes) || receipt.uniqueRawBytes < 1
      || !Number.isSafeInteger(receipt.indexSizeBytes) || receipt.indexSizeBytes < 1
      || !HEX64.test(receipt.indexSha256 ?? '')
      || !Array.isArray(receipt.packs) || receipt.packCount !== EXPECTED_DRIVE_PACK_COUNT
      || receipt.packs.length !== EXPECTED_DRIVE_PACK_COUNT
      || !Number.isSafeInteger(receipt.packBytes) || receipt.packBytes < 0
      || !Array.isArray(receipt.sourceManifests) || receipt.sourceManifests.length !== EXPECTED_SOURCE_MANIFEST_COUNT) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_INVENTORY_INVALID');
  }

  const index = receipt.index;
  validateDriveBinding(index, 'fullpath-index');
  if (index.sha256 !== receipt.indexSha256 || index.sizeBytes !== receipt.indexSizeBytes
      || index.driveSizeBytes !== receipt.indexSizeBytes) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_INDEX_MISMATCH');
  }
  const vaultParentId = index.driveParentId;
  const packNames = new Set();
  let packBytes = 0;
  for (const pack of receipt.packs) {
    validateDriveBinding(pack, `pack:${pack?.name ?? 'unknown'}`);
    if (!pack.name.endsWith('.zip') || pack.driveParentId !== vaultParentId || packNames.has(pack.name)) {
      throw new Error(`RECOVERY_DRIVE_ROOT_RECEIPT_PACK_INVALID:${pack.name}`);
    }
    packNames.add(pack.name);
    packBytes += pack.sizeBytes;
  }
  if (packBytes !== receipt.packBytes) throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_PACK_TOTAL_MISMATCH');

  const sourceNames = new Set();
  for (const sourceManifest of receipt.sourceManifests) {
    validateDriveBinding(sourceManifest, `source-manifest:${sourceManifest?.name ?? 'unknown'}`);
    if (!sourceManifest.name.endsWith('.index.json') || sourceManifest.driveParentId !== vaultParentId
        || sourceNames.has(sourceManifest.name)) {
      throw new Error(`RECOVERY_DRIVE_ROOT_RECEIPT_SOURCE_MANIFEST_INVALID:${sourceManifest.name}`);
    }
    sourceNames.add(sourceManifest.name);
  }

  const hot = receipt.hotAuthorityExclusion;
  if (!hot || hot.sourcePath !== HOT_AUTHORITY_INDEX_RELATIVE_PATH
      || !HEX64.test(hot.indexSha256 ?? '') || !Number.isSafeInteger(hot.entryCount)
      || !Number.isSafeInteger(hot.excludedPathBytes)) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_HOT_AUTHORITY_MISMATCH');
  }
  const hotIndex = safeReadJson(root, HOT_AUTHORITY_INDEX_RELATIVE_PATH, 'hot_authority_index');
  const hotIndexBytes = fs.readFileSync(resolveInside(root, HOT_AUTHORITY_INDEX_RELATIVE_PATH, 'hot_authority_index'));
  const hotEntries = hotIndex.entries;
  if (hotIndex.schemaVersion !== 'archive-analysis-hot-authorities/v1'
      || hotIndex.status !== 'EXACT_BYTES_MATERIALIZED_NO_QUALITY_GATE_CHANGE'
      || hotIndex.baselineCommit !== manifest.baselineCommit || !Array.isArray(hotEntries)
      || sha256(hotIndexBytes) !== hot.indexSha256 || hotEntries.length !== hot.entryCount
      || hotEntries.reduce((sum, entry) => sum + Number(entry.sizeBytes || 0), 0) !== hot.excludedPathBytes) {
    throw new Error('RECOVERY_DRIVE_ROOT_RECEIPT_HOT_AUTHORITY_MISMATCH');
  }

  return {
    receipt,
    receiptPath: relativeReceiptPath,
    verifiedAnalysisPathCount: preservation.analysisBaselinePathCount,
    verifiedAnalysisBytes: preservation.analysisBaselinePathBytes,
    driveIndexSha256: index.sha256,
    drivePackCount: receipt.packs.length
  };
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
  if (!resolved) return null;
  if (resolved !== baselineCommit) throw new Error('RECOVERY_BASELINE_COMMIT_MISMATCH');
  const tree = objectId(root, `${baselineCommit}:archive/analysis`);
  if (tree !== baselineTreeSha) throw new Error('RECOVERY_BASELINE_TREE_MISMATCH');
  return baselineTreeMetrics(root, baselineCommit);
}

function verifyPathObject(root, baselineCommit, repoPath, expectedBlob, expectedSize) {
  const spec = `${baselineCommit}:${repoPath}`;
  if (objectId(root, spec) !== expectedBlob) throw new Error(`RECOVERY_PATH_BLOB_MISMATCH:${repoPath}`);
  if (objectSize(root, spec) !== expectedSize) throw new Error(`RECOVERY_PATH_SIZE_MISMATCH:${repoPath}`);
}

export function assertHistoricalReferenceParity(reference, { baselineObject, headObject, committedHeadObject = null }) {
  if (!baselineObject) throw new Error(`RECOVERY_HISTORICAL_REFERENCE_BASELINE_MISSING:${reference}`);
  if ((headObject && headObject !== baselineObject)
      || (committedHeadObject && committedHeadObject !== baselineObject)) {
    throw new Error(`RECOVERY_HISTORICAL_REFERENCE_CHANGED:${reference}`);
  }
  return headObject || committedHeadObject ? 'unchanged' : 'archived-baseline';
}

function migrationRequiredError() {
  return new Error(
    'MIGRATED_TO_DRIVE: the d305 baseline and retained index payloads are unavailable in this checkout. '
    + 'Use node tools/archive-cold-evidence.mjs --receipt archive/data/archive-analysis-drive-root-receipt.v1.json '
    + '--index-file <downloaded-fullpath-index.json> --pack-dir <downloaded-pack-directory> '
    + '--original-path <exact-original-path>; no automatic Drive authentication is performed.'
  );
}

function verifyEntries(root, manifest, entries, receiptPath) {
  const baselineMetrics = validateBaseline(root, manifest.baselineCommit, manifest.baselineArchiveAnalysisTreeSha);
  const baselineAvailable = Boolean(baselineMetrics);
  if (!baselineAvailable) throw migrationRequiredError();
  const rawByBlob = new Map();
  const sourceByBlob = new Map();
  const referenceFiles = new Set();

  for (const entry of entries) {
    const projectedRetainedSpec = `:${entry.retainedIdenticalPath}`;
    const projectedRetainedBlob = optionalObjectId(root, projectedRetainedSpec);
    const projectedRetainedSize = projectedRetainedBlob ? objectSize(root, projectedRetainedSpec) : null;
    let baselineOriginalSpec = null;

    if (baselineAvailable) {
      baselineOriginalSpec = `${manifest.baselineCommit}:${entry.originalPath}`;
      verifyPathObject(root, manifest.baselineCommit, entry.originalPath, entry.gitBlobSha1, entry.sizeBytes);
      verifyPathObject(root, manifest.baselineCommit, entry.retainedIdenticalPath, entry.gitBlobSha1, entry.sizeBytes);
    }

    let sourceSpec;
    if (projectedRetainedBlob === entry.gitBlobSha1 && projectedRetainedSize === entry.sizeBytes) {
      sourceSpec = projectedRetainedSpec;
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
      sourceByBlob.set(entry.gitBlobSha1, sourceSpec.startsWith(':') ? 'retained-index' : 'baseline');
    }

    for (const reference of entry.historicalReferenceFiles) referenceFiles.add(reference);
  }

  for (const reference of referenceFiles) {
    const projectedSpec = `:${reference}`;
    const projectedObject = optionalObjectId(root, projectedSpec);
    const committedHeadObject = optionalObjectId(root, `HEAD:${reference}`);
    const baselineObject = optionalObjectId(root, `${manifest.baselineCommit}:${reference}`);
    assertHistoricalReferenceParity(reference, {
      baselineObject,
      headObject: projectedObject,
      committedHeadObject
    });
  }

  const missingProjectedReferenceCount = [...referenceFiles]
    .filter(reference => !optionalObjectId(root, `:${reference}`)).length;
  const archivedBaseline = missingProjectedReferenceCount > 0
    ? validateDriveRootReceipt(root, manifest, baselineMetrics, receiptPath)
    : null;

  return {
    rawByBlob,
    sourceByBlob,
    referenceFileCount: referenceFiles.size,
    missingHeadReferenceCount: missingProjectedReferenceCount,
    missingProjectedReferenceCount,
    baselineAvailable,
    baselineMetrics,
    archivedBaseline
  };
}

export function checkRecoveryManifest({ root, manifestPath, receiptPath } = {}) {
  const repoRoot = fs.realpathSync(root ?? runGit(process.cwd(), ['rev-parse', '--show-toplevel']).trim());
  const loaded = loadRecoveryManifest(repoRoot, manifestPath ?? path.join(repoRoot, MANIFEST_RELATIVE_PATH));
  const verification = verifyEntries(repoRoot, loaded.manifest, loaded.manifest.entries, receiptPath);
  return {
    status: verification.archivedBaseline ? 'ARCHIVED_BASELINE_BOUND' : 'LOCAL_BASELINE_VERIFIED',
    technicalOnly: true,
    entryCount: loaded.manifest.entries.length,
    uniqueBlobCount: loaded.uniqueBlobCount,
    totalBytes: loaded.totalBytes,
    referenceFileCount: verification.referenceFileCount,
    missingHeadReferenceCount: verification.missingHeadReferenceCount,
    missingProjectedReferenceCount: verification.missingProjectedReferenceCount,
    referenceSnapshot: 'Git index (prospective HEAD)',
    baselineCommit: loaded.manifest.baselineCommit,
    baselineAvailable: verification.baselineAvailable,
    baselineArchiveAnalysisPathCount: verification.baselineMetrics.pathCount,
    baselineArchiveAnalysisBytes: verification.baselineMetrics.pathBytes,
    driveRootReceiptPath: verification.archivedBaseline?.receiptPath ?? null,
    driveIndexSha256: verification.archivedBaseline?.driveIndexSha256 ?? null
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

export function restoreRecoveryPaths({ root, paths, destinationRoot, manifestPath, receiptPath } = {}) {
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

  const verification = verifyEntries(repoRoot, loaded.manifest, selected, receiptPath);
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
    status: verification.archivedBaseline ? 'ARCHIVED_BASELINE_BOUND' : 'LOCAL_BASELINE_VERIFIED',
    technicalOnly: true,
    missingHeadReferenceCount: verification.missingHeadReferenceCount,
    missingProjectedReferenceCount: verification.missingProjectedReferenceCount,
    referenceSnapshot: 'Git index (prospective HEAD)',
    baselineCommit: loaded.manifest.baselineCommit,
    baselineAvailable: verification.baselineAvailable,
    driveRootReceiptPath: verification.archivedBaseline?.receiptPath ?? null,
    driveIndexSha256: verification.archivedBaseline?.driveIndexSha256 ?? null
  };
}

function printUsage() {
  console.log('Usage:');
  console.log('  node tools/archive-analysis-recovery.mjs --check');
  console.log('  node tools/archive-analysis-recovery.mjs --restore archive/analysis/<exact-path> [--destination <existing-directory>]');
  console.log('  node tools/archive-analysis-recovery.mjs --restore-all --destination <existing-directory>');
  console.log('  If the baseline is absent, use tools/archive-cold-evidence.mjs with a downloaded verified index and local pack directory.');
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
    if (report.status === 'ARCHIVED_BASELINE_BOUND') {
      console.log(`ARCHIVED_BASELINE_BOUND (technical only): ${report.entryCount} original paths and ${report.referenceFileCount} historical references are byte-verified against ${report.baselineCommit}; ${report.missingHeadReferenceCount} historical reference paths are absent from the Git index / prospective HEAD and bound by the verified Drive-root receipt.`);
      console.log(`Drive index SHA-256: ${report.driveIndexSha256}; recovered HEAD checkout payload: ${report.totalBytes} bytes; historical Git storage reduction: 0 bytes.`);
    } else {
      console.log(`Recovery manifest locally verified (technical only): ${report.entryCount} original paths, ${report.uniqueBlobCount} unique blobs, and ${report.referenceFileCount} historical references match ${report.baselineCommit}.`);
      console.log(`HEAD checkout payload: ${report.totalBytes} bytes; historical Git storage reduction: 0 bytes.`);
    }
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
    if (report.status === 'ARCHIVED_BASELINE_BOUND') {
      console.log(`ARCHIVED_BASELINE_BOUND (technical only): ${report.missingProjectedReferenceCount} historical reference paths absent from the Git index / prospective HEAD are covered by the verified Drive-root receipt; Drive index SHA-256 ${report.driveIndexSha256}.`);
    }
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
