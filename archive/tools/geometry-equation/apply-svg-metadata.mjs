import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.resolve(process.env.GEOMETRY_ARCHIVE_ROOT || path.join(ROOT, 'archive'));
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const SUMMARY_PATH = path.join(REPORTS, process.env.GEOMETRY_SVG_SUMMARY || 'svg_build_summary.json');
const PHASE = process.env.GEOMETRY_SVG_PHASE || 'legacy';

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
      if (depth === 0) return { start, end: index + 1, indent: match[1] };
    }
  }
  throw new Error(`Question object closing brace not found: id=${id}`);
}

function insertMetadata(text, id, asset) {
  const object = findQuestionObject(text, id);
  const block = text.slice(object.start, object.end);
  if (/"solutionImage"\s*:/.test(block)) return { text, changed: false };
  const solutionLine = /^(\s*)"solution"\s*:\s*.*(?:\r?\n|$)/m.exec(block);
  if (!solutionLine) throw new Error(`Solution property not found: id=${id}`);
  const indent = solutionLine[1];
  const fields = [
    ['solutionImage', asset.assetRef],
    ['solutionImageAlt', asset.alt],
    ['solutionImageCaption', asset.caption],
    ['solutionImageSize', 'full'],
  ].map(([key, value]) => `${indent}${JSON.stringify(key)}: ${JSON.stringify(value)},`).join('\n') + '\n';
  const insertionAt = object.start + solutionLine.index + solutionLine[0].length;
  return {
    text: `${text.slice(0, insertionAt)}${fields}${text.slice(insertionAt)}`,
    changed: true,
  };
}

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, rows) {
  const keys = Object.keys(rows[0] || {});
  const lines = [keys.join(',')];
  for (const row of rows) lines.push(keys.map((key) => csvEscape(row[key])).join(','));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function main() {
  const summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
  const generated = summary.generatedAssets || [];
  const byFile = new Map();
  for (const asset of generated) {
    if (!byFile.has(asset.sourceJsPath)) byFile.set(asset.sourceJsPath, []);
    byFile.get(asset.sourceJsPath).push(asset);
  }
  const ledger = [];
  for (const [sourceJsPath, assets] of byFile) {
    const filePath = path.join(ARCHIVE, 'exams', sourceJsPath.replaceAll('/', path.sep));
    const before = fs.readFileSync(filePath, 'utf8');
    let after = before;
    let changedCount = 0;
    for (const asset of assets.sort((a, b) => a.id - b.id)) {
      const result = insertMetadata(after, asset.id, asset);
      after = result.text;
      if (result.changed) {
        changedCount += 1;
        ledger.push({
          questionUid: asset.questionUid,
          qKey: asset.qKey,
          sourceJsPath,
          id: asset.id,
          field: 'solutionImage|solutionImageAlt|solutionImageCaption|solutionImageSize',
          beforeHash: sha256('NONE'),
          afterHash: sha256(JSON.stringify({ ref: asset.assetRef, alt: asset.alt, caption: asset.caption, size: 'full' })),
          reasonCode: 'SOLUTION_VISUAL_MISSING',
          artifactShaBefore: sha256(before),
          artifactShaAfter: null,
        });
      }
    }
    if (changedCount) {
      fs.writeFileSync(filePath, after, 'utf8');
      const afterSha = sha256(after);
      for (const row of ledger.filter((item) => item.sourceJsPath === sourceJsPath && item.artifactShaAfter === null)) row.artifactShaAfter = afterSha;
    }
  }
  const changedFiles = new Set(ledger.map((row) => row.sourceJsPath));
  const existingMetadataCount = generated.length - ledger.length;
  fs.writeFileSync(path.join(REPORTS, PHASE === 'legacy' ? 'repair_ledger_svg_metadata.json' : `repair_ledger_svg_metadata_${PHASE}.json`), JSON.stringify(ledger, null, 2) + '\n', 'utf8');
  writeCsv(path.join(REPORTS, PHASE === 'legacy' ? 'repair_ledger_svg_metadata.csv' : `repair_ledger_svg_metadata_${PHASE}.csv`), ledger);
  const report = {
    generatedAssetCount: generated.length,
    metadataInsertedCount: ledger.length,
    changedSourceFileCount: changedFiles.size,
    existingMetadataCount,
    protectedFieldsTouched: 0,
    allowedFieldsOnly: true,
    status: 'APPLIED',
  };
  fs.writeFileSync(path.join(REPORTS, PHASE === 'legacy' ? 'svg_metadata_apply_summary.json' : `svg_metadata_apply_${PHASE}_summary.json`), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();
