import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadVerifiedColdEvidenceIndex, resolveColdEvidenceFromPack } from './archive-cold-evidence.mjs';

const MANIFEST_RELATIVE_PATH = 'tools/archive-analysis-recovery-manifest.v1.json';
const DRIVE_ROOT_RECEIPT_RELATIVE_PATH = 'archive/data/archive-analysis-drive-root-receipt.v1.json';
const HOT_AUTHORITY_INDEX_RELATIVE_PATH = 'archive/data/evidence-authority/v1/index.json';
const EXPECTED_SCHEMA = 'archive-analysis-recovery/v1';
const EXPECTED_BASELINE = 'd305af51b01b15e09d37839538ef3baaa269bd55';
const EXPECTED_TREE = '979303b78a9b8daddb048680b7c12a539c310dbb';
const DRIVE_ROOT_RECEIPT_SCHEMA = 'archive-analysis-drive-root-receipt/v1';
const MAX_INDEX_BYTES = 32 * 1024 * 1024;
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

function readLocalFile(filePath, label, maxBytes) {
  let stat;
  try { stat = fs.lstatSync(filePath); }
  catch (error) { if (error.code === 'ENOENT') throw new Error(`RECOVERY_${label}_MISSING`); throw error; }
  if (stat.isSymbolicLink() || !stat.isFile() || stat.size > maxBytes) throw new Error(`RECOVERY_${label}_INVALID`);
  return fs.readFileSync(filePath);
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

function validateDriveRootReceipt(root, manifest, receiptPath) {
  const relativeReceiptPath = receiptPath
    ? path.relative(root, path.resolve(receiptPath)).split(path.sep).join('/')
    : DRIVE_ROOT_RECEIPT_RELATIVE_PATH;
  const receipt = safeReadJson(root, relativeReceiptPath, 'drive_root_receipt');
  if (receipt.schemaVersion !== DRIVE_ROOT_RECEIPT_SCHEMA || receipt.status !== 'FULL_BYTES_VERIFIED'
      || typeof receipt.method !== 'string' || !receipt.method
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
      || preservation.analysisBaselinePathCount !== manifest.scope.baselineArchiveAnalysisPathCount
      || preservation.analysisBaselinePathBytes !== manifest.scope.baselineArchiveAnalysisPathBytes) {
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

  if (!HEX40.test(receipt.baselineAnalysisTreeSha ?? '')
      || !Number.isSafeInteger(receipt.pathCount) || receipt.pathCount < manifest.scope.baselineArchiveAnalysisPathCount
      || !Number.isSafeInteger(receipt.uniqueBlobCount) || receipt.uniqueBlobCount < 1
      || receipt.uniqueBlobCount > receipt.pathCount
      || !Number.isSafeInteger(receipt.pathBytes) || receipt.pathBytes < manifest.scope.baselineArchiveAnalysisPathBytes
      || !Number.isSafeInteger(receipt.uniqueRawBytes) || receipt.uniqueRawBytes < 1
      || !Number.isSafeInteger(receipt.indexSizeBytes) || receipt.indexSizeBytes < 1
      || receipt.indexSizeBytes > MAX_INDEX_BYTES
      || !HEX64.test(receipt.indexSha256 ?? '')
      || !Array.isArray(receipt.packs) || receipt.packCount !== receipt.packs.length || receipt.packs.length < 1
      || !Number.isSafeInteger(receipt.packBytes) || receipt.packBytes < 0
      || !Array.isArray(receipt.sourceManifests)) {
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
  if (!Array.isArray(manifest.entries) || manifest.entries.length < 1
      || manifest.scope?.removedPathCount !== manifest.entries.length
      || !Number.isSafeInteger(manifest.scope?.headCheckoutBytesReduced) || manifest.scope.headCheckoutBytesReduced < 1
      || !Number.isSafeInteger(manifest.scope?.baselineArchiveAnalysisPathCount) || manifest.scope.baselineArchiveAnalysisPathCount < 1
      || !Number.isSafeInteger(manifest.scope?.baselineArchiveAnalysisPathBytes) || manifest.scope.baselineArchiveAnalysisPathBytes < 1) {
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
    'MIGRATED_TO_DRIVE: historical Git objects are provenance only and are not required or searched. '
    + 'Supply the downloaded receipt-named fullpath sidecar and only the required verified ZIP packs: '
    + 'node tools/archive-analysis-recovery.mjs --check --index-file <local-index.json> --pack-dir <local-pack-directory>. '
    + 'No network or automatic Drive authentication is used; without these files recovery remains unavailable.'
  );
}

async function createOfflineResolver({ root, manifest, receiptPath, indexFile, packDirectory } = {}) {
  if (typeof indexFile !== 'string' || typeof packDirectory !== 'string') throw migrationRequiredError();
  const receiptBinding = validateDriveRootReceipt(root, manifest, receiptPath);
  const receipt = receiptBinding.receipt;
  let fullPathIndexBytes;
  try { fullPathIndexBytes = readLocalFile(path.resolve(indexFile), 'FULLPATH_INDEX', MAX_INDEX_BYTES); }
  catch (error) {
    if (error.message === 'RECOVERY_FULLPATH_INDEX_MISSING') throw migrationRequiredError();
    throw error;
  }
  const packDirectoryPath = path.resolve(packDirectory);
  let packDirectoryStat;
  try { packDirectoryStat = fs.lstatSync(packDirectoryPath); }
  catch (error) { if (error.code === 'ENOENT') throw migrationRequiredError(); throw error; }
  if (packDirectoryStat.isSymbolicLink() || !packDirectoryStat.isDirectory()) throw new Error('RECOVERY_PACK_DIRECTORY_INVALID');
  const realPackDirectory = fs.realpathSync(packDirectoryPath);
  const fullPathIndexMetadata = {
    id: receipt.index.driveFileId,
    file_name: receipt.index.driveName,
    mime_type: receipt.index.driveMimeType,
    file_size_bytes: receipt.index.driveSizeBytes,
    parent_ids: receipt.index.sourceVersion.parentIds,
    modified_time: receipt.index.sourceVersion.observedModifiedTime,
    bytes: fullPathIndexBytes
  };
  const verifiedIndex = await loadVerifiedColdEvidenceIndex({ root, fullPathIndexBytes, fullPathIndexMetadata, receipt });
  const resultByPath = new Map();
  const downloadDrivePack = async driveFileId => {
    const pack = receipt.packs.find(row => row.driveFileId === driveFileId);
    if (!pack) throw new Error('RECOVERY_PACK_ID_NOT_IN_DRIVE_RECEIPT');
    const packPath = path.resolve(realPackDirectory, pack.name);
    const relative = path.relative(realPackDirectory, packPath);
    if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('RECOVERY_PACK_PATH_OUTSIDE_DIRECTORY');
    let stat;
    try { stat = fs.lstatSync(packPath); }
    catch (error) { if (error.code === 'ENOENT') throw migrationRequiredError(); throw error; }
    if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`RECOVERY_PACK_FILE_INVALID:${pack.name}`);
    return {
      id: pack.driveFileId,
      file_name: pack.driveName,
      mime_type: pack.driveMimeType,
      file_size_bytes: pack.driveSizeBytes,
      parent_ids: pack.sourceVersion.parentIds,
      modified_time: pack.sourceVersion.observedModifiedTime,
      localPath: packPath
    };
  };
  return {
    receiptBinding,
    index: verifiedIndex.index,
    verifiedIndexContext: verifiedIndex.context,
    async read(originalPath) {
      const prior = resultByPath.get(originalPath);
      if (prior) return prior;
      const result = await resolveColdEvidenceFromPack({
        root,
        originalPath,
        fullPathIndexBytes,
        fullPathIndexMetadata,
        receipt,
        verifiedIndexContext: verifiedIndex.context,
        downloadDrivePack
      });
      resultByPath.set(originalPath, result);
      return result;
    }
  };
}

async function verifyEntries(root, manifest, entries, {
  receiptPath, indexFile, packDirectory
} = {}) {
  const drive = await createOfflineResolver({ root, manifest, receiptPath, indexFile, packDirectory });
  const rawByBlob = new Map();
  const referenceFiles = new Set();
  const sidecarByPath = new Map(drive.index.files.map(entry => [entry.originalPath, entry]));
  const verifySidecarBinding = (repoPath, entry) => {
    const sidecar = sidecarByPath.get(repoPath);
    if (!sidecar || sidecar.sizeBytes !== entry.sizeBytes || sidecar.sha256 !== entry.sha256
        || sidecar.gitBlobSha1 !== entry.gitBlobSha1) throw new Error(`RECOVERY_DRIVE_MANIFEST_BINDING_MISMATCH:${repoPath}`);
    return sidecar;
  };
  const verifyManifestEntry = async (repoPath, entry) => {
    verifySidecarBinding(repoPath, entry);
    const result = await drive.read(repoPath);
    if (result.sizeBytes !== entry.sizeBytes || result.sha256 !== entry.sha256 || result.gitBlobSha1 !== entry.gitBlobSha1) {
      throw new Error(`RECOVERY_DRIVE_MANIFEST_BINDING_MISMATCH:${repoPath}`);
    }
    if (!rawByBlob.has(entry.gitBlobSha1)) {
      rawByBlob.set(entry.gitBlobSha1, result.bytes);
    }
  };

  for (const entry of entries) {
    await verifyManifestEntry(entry.originalPath, entry);
    verifySidecarBinding(entry.retainedIdenticalPath, entry);
    for (const reference of entry.historicalReferenceFiles) referenceFiles.add(reference);
  }

  for (const reference of referenceFiles) {
    const archived = sidecarByPath.get(reference);
    if (!archived) throw new Error(`RECOVERY_DRIVE_REFERENCE_MISSING:${reference}`);
    const projectedObject = optionalObjectId(root, `:${reference}`);
    const committedHeadObject = optionalObjectId(root, `HEAD:${reference}`);
    assertHistoricalReferenceParity(reference, {
      baselineObject: archived.gitBlobSha1,
      headObject: projectedObject,
      committedHeadObject
    });
  }

  let indexedPaths = new Set();
  try {
    indexedPaths = new Set(runGit(root, ['ls-files', '-z'], { encoding: null }).toString('utf8').split('\0').filter(Boolean));
  } catch {}
  const missingProjectedReferenceCount = [...referenceFiles].filter(reference => !indexedPaths.has(reference)).length;
  return {
    rawByBlob,
    referenceFileCount: referenceFiles.size,
    missingHeadReferenceCount: missingProjectedReferenceCount,
    missingProjectedReferenceCount,
    baselineAvailable: false,
    archivedBaseline: drive.receiptBinding
  };
}

export async function checkRecoveryManifest({ root, manifestPath, receiptPath, indexFile, packDirectory } = {}) {
  const repoRoot = fs.realpathSync(root ?? runGit(process.cwd(), ['rev-parse', '--show-toplevel']).trim());
  const loaded = loadRecoveryManifest(repoRoot, manifestPath ?? path.join(repoRoot, MANIFEST_RELATIVE_PATH));
  const verification = await verifyEntries(repoRoot, loaded.manifest, loaded.manifest.entries, { receiptPath, indexFile, packDirectory });
  return {
    status: 'DRIVE_VERIFIED_OFFLINE',
    technicalOnly: true,
    entryCount: loaded.manifest.entries.length,
    uniqueBlobCount: loaded.uniqueBlobCount,
    totalBytes: loaded.totalBytes,
    referenceFileCount: verification.referenceFileCount,
    missingHeadReferenceCount: verification.missingHeadReferenceCount,
    missingProjectedReferenceCount: verification.missingProjectedReferenceCount,
    referenceSnapshot: 'Current Git index/HEAD compared with Drive-verified source blob IDs',
    baselineCommit: loaded.manifest.baselineCommit,
    baselineAvailable: false,
    baselineArchiveAnalysisPathCount: loaded.manifest.scope.baselineArchiveAnalysisPathCount,
    baselineArchiveAnalysisBytes: loaded.manifest.scope.baselineArchiveAnalysisPathBytes,
    driveRootReceiptPath: verification.archivedBaseline.receiptPath,
    driveIndexSha256: verification.archivedBaseline.driveIndexSha256
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

export async function restoreRecoveryPaths({ root, paths, destinationRoot, manifestPath, receiptPath, indexFile, packDirectory } = {}) {
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

  const verification = await verifyEntries(repoRoot, loaded.manifest, selected, { receiptPath, indexFile, packDirectory });
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
    status: 'DRIVE_VERIFIED_OFFLINE',
    technicalOnly: true,
    missingHeadReferenceCount: verification.missingHeadReferenceCount,
    missingProjectedReferenceCount: verification.missingProjectedReferenceCount,
    referenceSnapshot: 'Current Git index/HEAD compared with Drive-verified source blob IDs',
    baselineCommit: loaded.manifest.baselineCommit,
    baselineAvailable: verification.baselineAvailable,
    driveRootReceiptPath: verification.archivedBaseline.receiptPath,
    driveIndexSha256: verification.archivedBaseline.driveIndexSha256
  };
}

function printUsage() {
  console.log('Usage:');
  console.log('  node tools/archive-analysis-recovery.mjs --check --index-file <downloaded-fullpath-index.json> --pack-dir <downloaded-pack-directory>');
  console.log('  node tools/archive-analysis-recovery.mjs --restore archive/analysis/<exact-path> --index-file <local-index.json> --pack-dir <local-pack-directory> [--destination <existing-directory>]');
  console.log('  node tools/archive-analysis-recovery.mjs --restore-all --index-file <local-index.json> --pack-dir <local-pack-directory> --destination <existing-directory>');
  console.log('  The tracked D305/276 hashes are historical provenance only. No network authentication is performed.');
}

export async function runRecoveryCli(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    return 0;
  }
  const action = argv[0];
  const root = fs.realpathSync(runGit(process.cwd(), ['rev-parse', '--show-toplevel']).trim());
  const options = {};
  const paths = [];
  for (let index = 1; index < argv.length; index += 1) {
    const option = argv[index];
    if (['--destination', '--receipt', '--manifest', '--index-file', '--pack-dir'].includes(option)) {
      const value = argv[index + 1];
      if (!value) throw new Error(`RECOVERY_OPTION_VALUE_REQUIRED:${option}`);
      const key = ({ '--destination': 'destinationRoot', '--receipt': 'receiptPath', '--manifest': 'manifestPath', '--index-file': 'indexFile', '--pack-dir': 'packDirectory' })[option];
      options[key] = path.resolve(value);
      index += 1;
    } else if (option.startsWith('--')) {
      throw new Error(`RECOVERY_OPTION_UNKNOWN:${option}`);
    } else {
      paths.push(option);
    }
  }
  if (action === '--check' && paths.length === 0) {
    const report = await checkRecoveryManifest({ root, ...options });
    console.log(`DRIVE_VERIFIED_OFFLINE (technical only): ${report.entryCount} exact recovery payloads and ${report.referenceFileCount} historical references match the verified local Drive sidecar/packs.`);
    console.log(`Drive index SHA-256: ${report.driveIndexSha256}; payload bytes checked: ${report.totalBytes}; missing current Git references: ${report.missingProjectedReferenceCount}.`);
    return 0;
  }

  if (action === '--restore' || action === '--restore-all') {
    let selectedPaths = paths;
    if (action === '--restore-all') {
      if (paths.length) throw new Error('RECOVERY_RESTORE_ALL_TAKES_NO_PATHS');
      const manifest = loadRecoveryManifest(root, options.manifestPath ?? path.join(root, MANIFEST_RELATIVE_PATH)).manifest;
      selectedPaths = manifest.entries.map(entry => entry.originalPath);
    } else if (paths.length !== 1) {
      throw new Error('RECOVERY_RESTORE_REQUIRES_ONE_EXACT_PATH');
    }

    const report = await restoreRecoveryPaths({ root, paths: selectedPaths, ...options });
    for (const entry of report.restored) console.log(`Restored ${entry.path} (${entry.sizeBytes} bytes, sha256 ${entry.sha256}).`);
    console.log(`DRIVE_VERIFIED_OFFLINE (technical only): ${report.missingProjectedReferenceCount} historical references match verified local Drive bytes; Drive index SHA-256 ${report.driveIndexSha256}.`);
    return 0;
  }

  printUsage();
  throw new Error('RECOVERY_ACTION_INVALID');
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && pathToFileURL(invokedPath).href === import.meta.url) {
  try {
    process.exitCode = await runRecoveryCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
