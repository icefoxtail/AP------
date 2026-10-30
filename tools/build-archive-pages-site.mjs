import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_MANIFEST = path.join(SCRIPT_DIR, 'archive-pages-release-manifest.json');
const SHA256_RE = /^[a-f0-9]{64}$/i;
const MIXED_VERIFICATION_CONTEXT_PATH = 'data/archive2-source-verification/mixed-v1/context.json';
const MIXED_SOURCE_SHARD_PREFIX = 'data/archive2-source-verification/mixed-v1/sources/';
const MIXED_UID_BUCKET_PREFIX = 'data/archive2-source-verification/mixed-v1/uid-buckets/';

function fail(message) {
  throw new Error(`Archive Pages package: ${message}`);
}

function normalizeRelative(value, label = 'path') {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty relative path`);
  const normalized = value.replace(/\\/g, '/');
  if (normalized.startsWith('/') || /^[a-z]:/i.test(normalized)) fail(`${label} must be relative: ${value}`);
  const parts = normalized.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..')) fail(`${label} contains an unsafe path segment: ${value}`);
  return parts.join('/');
}

function resolveInside(root, relative, label = 'path') {
  const safeRelative = normalizeRelative(relative, label);
  const absolute = path.resolve(root, ...safeRelative.split('/'));
  const rel = path.relative(root, absolute);
  if (!rel || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    if (!rel) return absolute;
    fail(`${label} escapes its source root: ${relative}`);
  }
  return absolute;
}

function toPosixRelative(root, absolute) {
  return path.relative(root, absolute).split(path.sep).join('/');
}

function assertNoSymlinkComponents(root, absolute, label) {
  const rootReal = fs.realpathSync(root);
  let cursor = rootReal;
  const rel = path.relative(rootReal, absolute);
  if (!rel || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel))
    fail(`${label} escapes the repository root`);
  for (const component of rel.split(path.sep)) {
    cursor = path.join(cursor, component);
    let stat;
    try { stat = fs.lstatSync(cursor); }
    catch { fail(`${label} does not exist: ${toPosixRelative(root, absolute)}`); }
    if (stat.isSymbolicLink()) fail(`${label} traverses a symbolic link: ${toPosixRelative(root, absolute)}`);
  }
}

function readJson(root, relative, label) {
  const absolute = resolveInside(root, relative, label);
  assertNoSymlinkComponents(root, absolute, label);
  let value;
  try { value = JSON.parse(fs.readFileSync(absolute, 'utf8')); }
  catch (error) { fail(`${label} is not valid JSON (${error.message})`); }
  return value;
}

function normalizedTextSha256(absolute) {
  return crypto.createHash('sha256')
    .update(fs.readFileSync(absolute, 'utf8').replace(/\r\n/g, '\n'))
    .digest('hex');
}

function normalizedTextByteLength(absolute) {
  return Buffer.byteLength(fs.readFileSync(absolute, 'utf8').replace(/\r\n/g, '\n'), 'utf8');
}

function sha256Text(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function addFile(selection, root, relative, reason) {
  const safeRelative = normalizeRelative(relative);
  const absolute = resolveInside(root, safeRelative);
  assertNoSymlinkComponents(root, absolute, 'included file');
  const stat = fs.statSync(absolute);
  if (!stat.isFile()) fail(`included path is not a regular file: ${safeRelative}`);
  const existing = selection.get(safeRelative);
  if (existing) {
    if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
    return;
  }
  selection.set(safeRelative, { absolute, reasons: [reason] });
}

function isExcluded(relativeToTree, excludes = []) {
  return excludes.some((item) => {
    const normalized = normalizeRelative(item, 'tree exclusion');
    return relativeToTree === normalized || relativeToTree.startsWith(`${normalized}/`);
  });
}

function addTree(selection, root, tree) {
  const treePath = normalizeRelative(tree.path, 'tree path');
  const absolute = resolveInside(root, treePath, 'tree path');
  assertNoSymlinkComponents(root, absolute, 'tree path');
  if (!fs.statSync(absolute).isDirectory()) fail(`tree path is not a directory: ${treePath}`);
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const child = path.join(dir, entry.name);
      const relative = toPosixRelative(absolute, child);
      if (isExcluded(relative, tree.exclude || [])) continue;
      if (entry.isSymbolicLink()) fail(`tree contains a symbolic link: ${toPosixRelative(root, child)}`);
      if (entry.isDirectory()) {
        walk(child);
      } else if (entry.isFile()) {
        addFile(selection, root, toPosixRelative(root, child), tree.reason || `runtime tree ${treePath}`);
      } else {
        fail(`tree contains a non-regular filesystem entry: ${toPosixRelative(root, child)}`);
      }
    }
  };
  walk(absolute);
}

function addCanonicalInputs(selection, root, config) {
  if (!config) return;
  const manifest = readJson(root, config.manifest, 'canonical input manifest');
  if (manifest.schemaVersion !== 'archive2-canonical-input-manifest-v1' || !Array.isArray(manifest.files))
    fail('canonical input manifest has an unsupported schema');
  const seen = new Set();
  for (const entry of manifest.files) {
    if (!entry || typeof entry.path !== 'string' || !SHA256_RE.test(String(entry.sha256 || '')))
      fail('canonical input manifest contains an invalid file entry');
    const raw = entry.path.replace(/\\/g, '/');
    let relative;
    if (raw.startsWith('../')) {
      if (raw !== '../docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json')
        fail(`canonical input manifest references an unapproved parent path: ${raw}`);
      relative = normalizeRelative(path.posix.normalize(`archive/${raw}`), 'canonical input path');
    } else {
      relative = normalizeRelative(`archive/${raw}`, 'canonical input path');
    }
    const allowed = config.allowedPrefixes.some((prefix) => {
      const safePrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
      return relative === safePrefix || relative.startsWith(`${safePrefix}/`);
    });
    if (!allowed) fail(`canonical input manifest references an unapproved runtime path: ${relative}`);
    if (seen.has(relative)) fail(`canonical input manifest repeats a file: ${relative}`);
    seen.add(relative);
    const absolute = resolveInside(root, relative, 'canonical input path');
    assertNoSymlinkComponents(root, absolute, 'canonical input path');
    const actualSha = normalizedTextSha256(absolute);
    if (actualSha !== entry.sha256.toLowerCase())
      fail(`canonical input digest mismatch: ${relative}`);
    addFile(selection, root, relative, `canonical input manifest (${config.manifest})`);
  }
}

function addSourceVerificationShards(selection, root, config) {
  if (!config) return;
  const index = readJson(root, config.index, 'source verification index');
  if (index.schemaVersion !== 'archive2-source-verification-index-v1' || !Array.isArray(index.files))
    fail('source verification index has an unsupported schema');
  const seen = new Set();
  for (const row of index.files) {
    // The shard path is derived from the source file; a row that still carries a path is used as is.
    const itemPath = String(row?.path ?? (typeof row?.sourceFile === 'string' && row.sourceFile
      ? `${config.pathPrefix}${sha256Text(row.sourceFile)}.json` : '')).replace(/\\/g, '/');
    const prefix = config.pathPrefix;
    const basename = itemPath.startsWith(prefix) ? itemPath.slice(prefix.length) : '';
    if (!/^[a-f0-9]{64}\.json$/i.test(basename) || !SHA256_RE.test(String(row?.sha256 || '')))
      fail(`source verification index contains an invalid shard reference: ${itemPath}`);
    if (seen.has(itemPath)) fail(`source verification index repeats a shard: ${itemPath}`);
    seen.add(itemPath);
    const relative = normalizeRelative(`archive/${itemPath}`, 'source verification shard path');
    const absolute = resolveInside(root, relative, 'source verification shard path');
    assertNoSymlinkComponents(root, absolute, 'source verification shard path');
    if (normalizedTextSha256(absolute) !== row.sha256.toLowerCase())
      fail(`source verification shard digest mismatch: ${relative}`);
    addFile(selection, root, relative, `source verification index (${config.index})`);
  }
  if (Object.prototype.hasOwnProperty.call(index, 'mixedLookup'))
    addMixedSourceVerificationFiles(selection, root, index, config.index);
}

function readMixedReference(root, pathValue, expectedPrefix, reference, label) {
  const itemPath = String(pathValue || '').replace(/\\/g, '/');
  if (!itemPath.startsWith(expectedPrefix)) fail(`${label} has an unapproved path prefix: ${itemPath}`);
  const relative = normalizeRelative(`archive/${itemPath}`, `${label} path`);
  const absolute = resolveInside(root, relative, `${label} path`);
  assertNoSymlinkComponents(root, absolute, `${label} path`);
  const stat = fs.statSync(absolute);
  if (!stat.isFile()) fail(`${label} is not a regular file: ${relative}`);
  const byteLength = normalizedTextByteLength(absolute);
  if (byteLength !== Number(reference?.byteLength)) fail(`${label} byteLength mismatch: ${relative}`);
  if (normalizedTextSha256(absolute) !== String(reference?.sha256 || '').toLowerCase())
    fail(`${label} digest mismatch: ${relative}`);
  let value;
  try { value = JSON.parse(fs.readFileSync(absolute, 'utf8').replace(/\r\n/g, '\n')); }
  catch { fail(`${label} is not valid JSON: ${relative}`); }
  return { relative, absolute, byteLength, value };
}

function addMixedSourceVerificationFiles(selection, root, sourceIndex, indexPath) {
  const lookup = sourceIndex?.mixedLookup;
  if (!lookup || lookup.schemaVersion !== 'archive2-mixed-source-verification-index-v1' ||
      lookup.resolverVersion !== sourceIndex.resolverVersion ||
      lookup.baseProjectionVersion !== sourceIndex.baseProjectionVersion ||
      !Array.isArray(sourceIndex.files) || !Array.isArray(lookup.files) ||
      !Array.isArray(lookup.uidBuckets) || lookup.files.length !== sourceIndex.files.length ||
      lookup.uidBuckets.length !== 16 || !lookup.context ||
      lookup.context.path !== MIXED_VERIFICATION_CONTEXT_PATH ||
      !SHA256_RE.test(String(lookup.context.sha256 || '')) ||
      !Number.isInteger(Number(lookup.context.byteLength)) || Number(lookup.context.byteLength) < 1)
    fail('mixed source verification index has an unsupported schema or coverage');

  const contextFile = readMixedReference(
    root,
    lookup.context.path,
    MIXED_VERIFICATION_CONTEXT_PATH,
    lookup.context,
    'mixed verification context',
  );
  const context = contextFile.value;
  if (context?.schemaVersion !== 'archive2-mixed-source-verification-context-v1' ||
      context.resolverVersion !== lookup.resolverVersion ||
      context.baseProjectionVersion !== lookup.baseProjectionVersion ||
      !context.authority || typeof context.authority !== 'object' || Array.isArray(context.authority) ||
      !String(context.authority.taxonomyVersion || '').trim() ||
      !Array.isArray(context.authority.gradeCourses) ||
      !Array.isArray(context.authority.canonicalParents) ||
      !Array.isArray(context.authority.canonicalAdvancedPaths) ||
      !context.authority.projectionPolicy || typeof context.authority.projectionPolicy !== 'object' ||
      Array.isArray(context.authority.projectionPolicy) ||
      !Array.isArray(context.authority.problemTypeKeys) ||
      !context.authority.templatesByKey || typeof context.authority.templatesByKey !== 'object' ||
      Array.isArray(context.authority.templatesByKey) ||
      !Array.isArray(context.authority.bindingKeys))
    fail('mixed verification context has an unsupported schema');
  const canonicalContextText = `${JSON.stringify(context)}\n`;
  if (canonicalContextText !== fs.readFileSync(contextFile.absolute, 'utf8').replace(/\r\n/g, '\n') ||
      Buffer.byteLength(canonicalContextText, 'utf8') !== Number(lookup.context.byteLength) ||
      sha256Text(canonicalContextText) !== String(lookup.context.sha256).toLowerCase())
    fail('mixed verification context canonical bytes do not match its index reference');

  const indexedSourceFiles = new Set();
  const mixedPaths = new Set([contextFile.relative]);
  let sourceRecordCount = 0;
  let bucketRecordCount = 0;
  const sourceUids = new Set();
  const bucketUids = new Set();
  for (let i = 0; i < lookup.files.length; i += 1) {
    const row = lookup.files[i];
    const baseRow = sourceIndex.files[i];
    const sourceFile = String(baseRow?.sourceFile || '').replace(/\\/g, '/');
    const normalizedSourceFile = normalizeRelative(sourceFile, 'mixed source file');
    const mixedFileKeys = row && typeof row === 'object' && !Array.isArray(row)
      ? Object.keys(row).sort().join(',')
      : '';
    if (mixedFileKeys !== 'byteLength,recordCount,sha256,sourceIndex' ||
        row.sourceIndex !== i || normalizedSourceFile !== sourceFile ||
        sourceFile !== String(baseRow?.sourceFile || '') || indexedSourceFiles.has(sourceFile))
      fail(`mixed source index has an invalid or duplicate source: ${sourceFile}`);
    indexedSourceFiles.add(sourceFile);
    const expectedPath = `${MIXED_SOURCE_SHARD_PREFIX}${sha256Text(sourceFile)}.json`;
    if (!SHA256_RE.test(String(row.sha256 || '')) ||
        !Number.isInteger(Number(row.byteLength)) || Number(row.byteLength) < 1 ||
        !Number.isInteger(Number(row.recordCount)) || Number(row.recordCount) < 0 ||
        Number(row.recordCount) > Number(baseRow.qCount))
      fail(`mixed source index has an invalid shard reference: ${expectedPath}`);
    const file = readMixedReference(root, expectedPath, MIXED_SOURCE_SHARD_PREFIX, row, 'mixed source shard');
    if (mixedPaths.has(file.relative)) fail(`mixed source index repeats a file: ${file.relative}`);
    mixedPaths.add(file.relative);
    const shard = file.value;
    if (shard?.schemaVersion !== 'archive2-mixed-source-verification-v1' ||
        shard.sourceFile !== sourceFile || !Array.isArray(shard.records) ||
        shard.records.length !== Number(row.recordCount))
      fail(`mixed source shard does not match its index: ${file.relative}`);
    for (const record of shard.records) {
      const uid = String(record?.questionUid || '');
      if (!/^qid_v1_[a-f0-9]{64}$/.test(uid) || sourceUids.has(uid) ||
          record.sourceFile !== sourceFile || !Number.isInteger(Number(record.sourceOrdinal)) || Number(record.sourceOrdinal) < 1)
        fail(`mixed source shard contains an invalid or duplicate identity: ${file.relative}`);
      sourceUids.add(uid);
    }
    sourceRecordCount += shard.records.length;
    addFile(selection, root, file.relative, `mixed source verification index (${indexPath})`);
  }
  if (indexedSourceFiles.size !== sourceIndex.files.length)
    fail('mixed source index coverage does not match the original source index');

  const prefixes = new Set();
  for (const row of lookup.uidBuckets) {
    const prefix = String(row?.prefix || '');
    const expectedPath = `${MIXED_UID_BUCKET_PREFIX}${prefix}.json`;
    const inlineContextExpected = prefix === 'f';
    const hasContextMarker = Object.prototype.hasOwnProperty.call(row || {}, 'includesContext');
    if (!/^[0-9a-f]$/.test(prefix) || prefixes.has(prefix) || row.path !== expectedPath ||
        !SHA256_RE.test(String(row.sha256 || '')) ||
        !Number.isInteger(Number(row.byteLength)) || Number(row.byteLength) < 1 ||
        !Number.isInteger(Number(row.recordCount)) || Number(row.recordCount) < 0 ||
        (inlineContextExpected ? row.includesContext !== true : hasContextMarker))
      fail(`mixed UID bucket index has an invalid reference: ${String(row?.path || '')}`);
    prefixes.add(prefix);
    const file = readMixedReference(root, row.path, MIXED_UID_BUCKET_PREFIX, row, 'mixed UID bucket');
    if (mixedPaths.has(file.relative)) fail(`mixed lookup index repeats a file: ${file.relative}`);
    mixedPaths.add(file.relative);
    const bucket = file.value;
    if (bucket?.schemaVersion !== 'archive2-mixed-source-verification-uid-bucket-v1' ||
        bucket.prefix !== prefix || !Array.isArray(bucket.records) ||
        bucket.records.length !== Number(row.recordCount))
      fail(`mixed UID bucket does not match its index: ${file.relative}`);
    const embedsContext = Object.prototype.hasOwnProperty.call(bucket, 'context');
    if (embedsContext !== inlineContextExpected)
      fail(`mixed UID bucket context marker mismatch: ${file.relative}`);
    if (inlineContextExpected && JSON.stringify(bucket.context) !== JSON.stringify(context))
      fail(`mixed UID bucket inline context differs from the shared context: ${file.relative}`);
    for (const record of bucket.records) {
      const uid = String(record?.questionUid || '');
      if (!/^qid_v1_[a-f0-9]{64}$/.test(uid) || uid.slice('qid_v1_'.length, 'qid_v1_'.length + 1) !== prefix ||
          bucketUids.has(uid) || !indexedSourceFiles.has(String(record?.sourceFile || '')) ||
          !Number.isInteger(Number(record?.sourceOrdinal)) || Number(record.sourceOrdinal) < 1)
        fail(`mixed UID bucket contains an invalid or duplicate identity: ${file.relative}`);
      bucketUids.add(uid);
    }
    bucketRecordCount += bucket.records.length;
    addFile(selection, root, file.relative, `mixed source verification index (${indexPath})`);
  }
  if (prefixes.size !== 16 || sourceRecordCount !== bucketRecordCount || sourceUids.size !== bucketUids.size ||
      [...sourceUids].some((uid) => !bucketUids.has(uid)))
    fail('mixed UID bucket coverage does not match mixed source shards');
  addFile(selection, root, contextFile.relative, `mixed source verification index (${indexPath})`);
}

function addReviewOverrides(selection, root, config) {
  if (!config) return;
  const index = readJson(root, config.index, 'review override index');
  if (!Array.isArray(index.records)) fail('review override index has no records array');
  const seen = new Set();
  for (const row of index.records) {
    const reference = String(row?.evidenceReference || '').replace(/\\/g, '/');
    if (!reference) continue;
    const basename = reference.startsWith(config.pathPrefix) ? reference.slice(config.pathPrefix.length) : '';
    if (!/^qid_v1_[a-f0-9]{64}\.json$/i.test(basename) || !SHA256_RE.test(String(row?.evidenceSha256 || '')))
      fail(`review override index contains an invalid evidence reference: ${reference}`);
    const relative = normalizeRelative(`archive/${reference}`, 'review override evidence path');
    if (seen.has(relative)) continue;
    seen.add(relative);
    const absolute = resolveInside(root, relative, 'review override evidence path');
    assertNoSymlinkComponents(root, absolute, 'review override evidence path');
    if (normalizedTextSha256(absolute) !== row.evidenceSha256.toLowerCase())
      fail(`review override evidence digest mismatch: ${relative}`);
    addFile(selection, root, relative, `runtime review evidence referenced by ${config.index}`);
  }
}

function addReviewedExamMeta(selection, root, config) {
  if (!config) return;
  const index = readJson(root, config.index, 'question metadata');
  if (!Array.isArray(index.records)) fail('question metadata has no records array');
  const paths = new Set();
  for (const row of index.records) {
    const reference = String(row?.reviewedOriginalMetaEvidence?.manifestPath || '').replace(/\\/g, '/');
    if (!reference) continue;
    if (!reference.startsWith(config.pathPrefix) || !reference.endsWith('.json'))
      fail(`question metadata references an unapproved reviewed-meta path: ${reference}`);
    const relative = normalizeRelative(reference, 'reviewed exam metadata path');
    paths.add(relative);
  }
  for (const relative of [...paths].sort())
    addFile(selection, root, relative, `reviewed exam metadata referenced by ${config.index}`);
}

function collectSelection(root, manifest) {
  if (manifest.schemaVersion !== 'ARCHIVE_PAGES_SITE_MANIFEST_V1')
    fail('site manifest has an unsupported schema');
  const selection = new Map();
  for (const file of manifest.files || []) addFile(selection, root, file, 'explicit site file');
  for (const tree of manifest.trees || []) addTree(selection, root, tree);
  for (const relative of manifest.archiveRootFiles || [])
    addFile(selection, root, `archive/${relative}`, 'explicit archive runtime module');
  for (const relative of manifest.archiveDataFiles || [])
    addFile(selection, root, `archive/data/${relative}`, 'explicit archive runtime data');
  const closure = manifest.runtimeClosure || {};
  addCanonicalInputs(selection, root, closure.canonicalInputs);
  addSourceVerificationShards(selection, root, closure.sourceVerification);
  addReviewOverrides(selection, root, closure.reviewOverrides);
  addReviewedExamMeta(selection, root, closure.reviewedExamMeta);
  for (const relative of closure.extraFiles || []) addFile(selection, root, relative, 'explicit runtime data dependency');
  return [...selection.entries()]
    .map(([relative, value]) => ({ path: relative, ...value }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

async function sha256File(absolute) {
  const hash = crypto.createHash('sha256');
  await new Promise((resolve, reject) => {
    const stream = fs.createReadStream(absolute);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', resolve);
  });
  return hash.digest('hex');
}

function isInside(parent, child) {
  const rel = path.relative(parent, child);
  return rel === '' || (!rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel));
}

export async function buildPagesSite({
  sourceRoot = DEFAULT_ROOT,
  outputDir = path.join(sourceRoot, '_site'),
  reportPath = null,
  manifestPath = DEFAULT_MANIFEST,
  manifest: suppliedManifest = null,
} = {}) {
  const root = fs.realpathSync(path.resolve(sourceRoot));
  const output = path.resolve(outputDir);
  const expectedOutput = path.join(root, '_site');
  const pathKey = (value) => process.platform === 'win32' ? value.toLowerCase() : value;
  if (pathKey(output) !== pathKey(expectedOutput)) fail('output directory must be exactly <sourceRoot>/_site');
  try {
    const outputStat = fs.lstatSync(output);
    if (outputStat.isSymbolicLink()) fail('output directory cannot be a symbolic link or junction');
    const outputReal = fs.realpathSync(output);
    if (pathKey(outputReal) !== pathKey(expectedOutput)) fail('output directory resolves outside <sourceRoot>/_site');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (reportPath && isInside(output, path.resolve(reportPath))) fail('package report must be outside _site');
  const manifest = suppliedManifest || JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const selected = collectSelection(root, manifest);
  const entries = selected.map(({ path: relative, absolute, reasons }) => {
    const stat = fs.statSync(absolute);
    return { path: relative, absolute, bytes: stat.size, reasons };
  });
  const totalBytes = entries.reduce((sum, entry) => sum + entry.bytes, 0);
  const maxBytes = Number(manifest.maxBytes);
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) fail('manifest maxBytes must be a positive integer');
  if (maxBytes > 1_000_000_000) fail('manifest maxBytes cannot exceed the fixed 1000000000-byte Pages limit');
  if (totalBytes >= maxBytes)
    fail(`selected site is ${totalBytes} bytes; must be below the ${maxBytes}-byte Pages limit`);

  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  const inventory = [];
  for (const entry of entries) {
    const destination = path.join(output, ...entry.path.split('/'));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(entry.absolute, destination);
    inventory.push({
      path: entry.path,
      bytes: entry.bytes,
      sha256: await sha256File(entry.absolute),
      reasons: entry.reasons,
    });
  }
  const report = {
    schemaVersion: 'ARCHIVE_PAGES_SITE_PACKAGE_REPORT_V1',
    sourceRoot: root,
    outputDir: output,
    fileCount: inventory.length,
    totalBytes,
    totalMiB: Number((totalBytes / (1024 * 1024)).toFixed(2)),
    maxBytes,
    inventory,
  };
  if (reportPath) {
    fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  }
  return report;
}

function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--root') options.sourceRoot = path.resolve(args[++i] || '');
    else if (arg === '--output') options.outputDir = path.resolve(args[++i] || '');
    else if (arg === '--manifest') options.manifestPath = path.resolve(args[++i] || '');
    else if (arg === '--report') options.reportPath = path.resolve(args[++i] || '');
    else fail(`unknown option: ${arg}`);
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await buildPagesSite(parseArgs(process.argv.slice(2)));
    console.log(`Archive Pages site staged: ${result.fileCount} files, ${result.totalBytes} bytes (${result.totalMiB} MiB).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
