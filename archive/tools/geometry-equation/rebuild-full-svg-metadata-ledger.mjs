import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const summary = JSON.parse(fs.readFileSync(path.join(REPORTS, 'svg_build_summary_v22.json'), 'utf8'));
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function locate(text, id) {
  const found = new RegExp(`\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*${id},`).exec(text);
  if (!found) throw new Error(`Question object not found: ${id}`);
  const start = found.index + 1; let depth = 0; let quote = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quote = false; continue; }
    if (ch === '"') { quote = true; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error(`Question object not closed: ${id}`);
}
const byFile = new Map();
for (const asset of summary.generatedAssets) {
  const filePath = path.join(STAGING, 'exams', asset.sourceJsPath.replaceAll('/', path.sep));
  const text = byFile.get(filePath) || fs.readFileSync(filePath, 'utf8');
  const object = locate(text, asset.id); const block = text.slice(object.start, object.end);
  const fields = {};
  for (const key of ['solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']) {
    const match = new RegExp(`^[ \\t]*"${key}"\\s*:\\s*("(?:\\\\.|[^"\\\\])*")`, 'm').exec(block);
    if (match) fields[key] = JSON.parse(match[1]);
  }
  if (fields.solutionImage !== asset.assetRef || fields.solutionImageAlt !== asset.alt || fields.solutionImageCaption !== asset.caption || fields.solutionImageSize !== 'full') throw new Error(`Metadata mismatch: ${asset.questionUid}`);
  byFile.set(filePath, text);
}
for (const [filePath, text] of byFile) new vm.Script(text, { filename: filePath });
const ledger = summary.generatedAssets.map((asset) => ({ questionUid: asset.questionUid, qKey: asset.qKey, sourceJsPath: asset.sourceJsPath, id: asset.id, field: 'solutionImage|solutionImageAlt|solutionImageCaption|solutionImageSize', assetRef: asset.assetRef, assetSha256: sha(fs.readFileSync(path.join(STAGING, asset.assetRef.replaceAll('/', path.sep)))), currentSourceFileSha256: sha(fs.readFileSync(path.join(STAGING, 'exams', asset.sourceJsPath.replaceAll('/', path.sep)))), status: 'PRESENT_AND_MATCHED' }));
const result = { status: 'FULL_SVG_METADATA_LEDGER_REBUILT_AFTER_SYNTAX_REPAIR', generatedAssetCount: summary.generatedAssets.length, metadataMatchedCount: ledger.length, sourceFileCount: byFile.size, ledger };
fs.writeFileSync(path.join(REPORTS, 'repair_ledger_svg_metadata_full.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
const headers = Object.keys(ledger[0] || {}); const csv = [headers.join(',')];
for (const row of ledger) csv.push(headers.map((key) => { const value = String(row[key] ?? ''); return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value; }).join(','));
fs.writeFileSync(path.join(REPORTS, 'repair_ledger_svg_metadata_full.csv'), `${csv.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status: result.status, generatedAssetCount: result.generatedAssetCount, metadataMatchedCount: result.metadataMatchedCount, sourceFileCount: result.sourceFileCount }, null, 2));
