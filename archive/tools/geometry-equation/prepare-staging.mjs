import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));

if (fs.existsSync(STAGING)) throw new Error(`Staging already exists; refusing to overwrite: ${STAGING}`);

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function copyFile(relativePath, copied) {
  const source = path.join(ARCHIVE, relativePath.replaceAll('/', path.sep));
  const target = path.join(STAGING, relativePath.replaceAll('/', path.sep));
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) throw new Error(`Required staging source missing: ${relativePath}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  copied.push({ relativePath, sourceSha256: sha256File(source), stagingSha256: sha256File(target), bytes: fs.statSync(source).size });
}

function copyDirectory(relativePath, copied) {
  const source = path.join(ARCHIVE, relativePath.replaceAll('/', path.sep));
  const target = path.join(STAGING, relativePath.replaceAll('/', path.sep));
  fs.cpSync(source, target, { recursive: true, force: false, errorOnExist: false });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const child = `${relativePath}/${entry.name}`;
    if (entry.isDirectory()) copyDirectory(child, copied);
    else if (entry.isFile()) copyFile(child, copied);
  }
}

const copied = [];
const requiredFiles = new Set([
  'engine.html',
  'mixed_engine.html',
  'native_print.js',
  'print_image_optimizer.js',
  'mathjax_render_loop.js',
  'concept_map.js',
  'question-meta.js',
  'question-identity.js',
  'db.js',
  'question-index.js',
]);
for (const entry of fs.readdirSync(ARCHIVE, { withFileTypes: true })) {
  if (entry.isFile() && /\.css$/i.test(entry.name)) requiredFiles.add(entry.name);
}

copyDirectory('exams/original/high/h1', copied);
copyDirectory('vendor', copied);
for (const relativePath of requiredFiles) copyFile(relativePath, copied);

const assetRefs = new Set();
const sourcePaths = [...new Set(manifest.rows.map(row => row.sourceJsPath))];
for (const sourceJsPath of sourcePaths) {
  const sourceText = fs.readFileSync(path.join(ARCHIVE, 'exams', sourceJsPath.replaceAll('/', path.sep)), 'utf8');
  for (const match of sourceText.matchAll(/(?:assets\/images\/|\.\.\/assets\/images\/)([^"'\\)\s?]+)/g)) {
    const suffix = match[1].replaceAll('\\', '/');
    const relativePath = `assets/images/${suffix}`;
    if (fs.existsSync(path.join(ARCHIVE, relativePath.replaceAll('/', path.sep)))) assetRefs.add(relativePath);
  }
}
for (const relativePath of assetRefs) copyFile(relativePath, copied);

const canonical = copied
  .map(({ relativePath, stagingSha256, bytes }) => ({ relativePath, stagingSha256, bytes }))
  .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
const stagingBaselineSha = crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
const snapshot = {
  generatedAt: new Date().toISOString(),
  status: 'STAGING_READY',
  productionArchive: path.relative(ROOT, ARCHIVE).replaceAll('\\', '/'),
  stagingArchive: path.relative(ROOT, STAGING).replaceAll('\\', '/'),
  sourceJsCount: sourcePaths.length,
  copiedAssetCount: assetRefs.size,
  copiedFileCount: copied.length,
  projectStagingBaselineSha: stagingBaselineSha,
  files: copied.sort((a, b) => a.relativePath.localeCompare(b.relativePath)),
};
fs.writeFileSync(path.join(REPORTS, 'production_baseline_snapshot.json'), JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(REPORTS, 'project_staging_manifest.json'), JSON.stringify({ ...snapshot, files: canonical }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: snapshot.status, stagingArchive: snapshot.stagingArchive, sourceJsCount: sourcePaths.length, copiedAssetCount: assetRefs.size, copiedFileCount: copied.length, projectStagingBaselineSha: stagingBaselineSha }, null, 2));
