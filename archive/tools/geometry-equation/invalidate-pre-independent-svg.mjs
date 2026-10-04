import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const QUARANTINE = path.join(ARCHIVE, '_quarantine', 'geometry-equation-pre-independent-svg');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function findQuestionObject(text, id) {
  const startPattern = new RegExp(`\\n([ \\t]*)\\{\\r?\\n\\1  "id":\\s*${id},`);
  const match = startPattern.exec(text);
  if (!match) throw new Error(`Question object not found: id=${id}`);
  const start = match.index + 1;
  let depth = 0;
  let quote = false;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const character = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') quote = false;
      continue;
    }
    if (character === '"') { quote = true; continue; }
    if (character === '{') depth += 1;
    else if (character === '}') {
      depth -= 1;
      if (depth === 0) return { start, end: index + 1 };
    }
  }
  throw new Error(`Question object closing brace not found: id=${id}`);
}

function removeMetadata(text, id, asset) {
  const object = findQuestionObject(text, id);
  let block = text.slice(object.start, object.end);
  for (const [key, value] of [
    ['solutionImage', asset.assetRef],
    ['solutionImageAlt', asset.alt],
    ['solutionImageCaption', asset.caption],
    ['solutionImageSize', 'full'],
  ]) {
    const expected = JSON.stringify(value);
    const escapedExpected = expected.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    const pattern = new RegExp(`^[ \\t]*"${key}"\\s*:\\s*${escapedExpected},?\\r?\\n`, 'm');
    if (!pattern.test(block)) throw new Error(`Inserted metadata not found or changed: ${key}, id=${id}`);
    block = block.replace(pattern, '');
  }
  block = block.replace(/(^[ \t]*"solution":.*),([\r\n]+[ \t]*})/m, '$1$2');
  return `${text.slice(0, object.start)}${block}${text.slice(object.end)}`;
}

function main() {
  const summaryPath = path.join(REPORTS, 'svg_build_summary.json');
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  const generated = summary.generatedAssets || [];
  if (generated.length !== 234) throw new Error(`Expected 234 generated assets, got ${generated.length}`);
  const byFile = new Map();
  for (const asset of generated) {
    if (!byFile.has(asset.sourceJsPath)) byFile.set(asset.sourceJsPath, []);
    byFile.get(asset.sourceJsPath).push(asset);
  }
  const revertedFiles = [];
  for (const [sourceJsPath, assets] of byFile) {
    const filePath = path.join(ARCHIVE, 'exams', sourceJsPath.replaceAll('/', path.sep));
    const before = fs.readFileSync(filePath, 'utf8');
    let after = before;
    for (const asset of assets.sort((a, b) => a.id - b.id)) after = removeMetadata(after, asset.id, asset);
    new vm.Script(after, { filename: filePath });
    if (after !== before) {
      fs.writeFileSync(filePath, after, 'utf8');
      revertedFiles.push({ sourceJsPath, beforeSha: sha256(before), afterSha: sha256(after), revertedQuestionCount: assets.length });
    }
  }
  const moved = [];
  for (const asset of generated) {
    const source = path.resolve(ARCHIVE, asset.assetRef.replaceAll('/', path.sep));
    const allowedRoot = path.resolve(ARCHIVE, 'assets', 'images');
    if (!source.startsWith(`${allowedRoot}${path.sep}`)) throw new Error(`Unsafe quarantine source: ${source}`);
    if (!fs.existsSync(source)) throw new Error(`Generated asset missing before quarantine: ${source}`);
    const destination = path.resolve(QUARANTINE, asset.assetRef.replaceAll('/', path.sep));
    if (!destination.startsWith(`${path.resolve(QUARANTINE)}${path.sep}`)) throw new Error(`Unsafe quarantine destination: ${destination}`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.renameSync(source, destination);
    moved.push({ assetRef: asset.assetRef, from: path.relative(ROOT, source), to: path.relative(ROOT, destination), sha256: sha256(fs.readFileSync(destination)) });
  }
  const invalidatedSummary = {
    invalidatedAt: new Date().toISOString(),
    status: 'INVALIDATED_PRE_INDEPENDENT_REVIEW',
    reason: 'SVG was generated before independent solution/math review and must not influence the solution or mathematical facts.',
    generatedAssetCount: generated.length,
    revertedSourceFileCount: revertedFiles.length,
    revertedQuestionCount: revertedFiles.reduce((sum, row) => sum + row.revertedQuestionCount, 0),
    quarantinedAssetCount: moved.length,
    revertedFiles,
    moved,
  };
  fs.writeFileSync(path.join(REPORTS, 'pre_independent_svg_invalidation.json'), JSON.stringify(invalidatedSummary, null, 2) + '\n', 'utf8');
  summary.status = 'INVALIDATED_PRE_INDEPENDENT_REVIEW';
  summary.invalidatedAt = invalidatedSummary.invalidatedAt;
  summary.invalidatedReason = invalidatedSummary.reason;
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ status: invalidatedSummary.status, generatedAssetCount: generated.length, revertedSourceFileCount: revertedFiles.length, quarantinedAssetCount: moved.length }, null, 2));
}

main();
