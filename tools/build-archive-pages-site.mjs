import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_MANIFEST = path.join(SCRIPT_DIR, 'archive-pages-release-manifest.json');
const SHA256_RE = /^[a-f0-9]{64}$/i;

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
    const itemPath = String(row?.path || '').replace(/\\/g, '/');
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
