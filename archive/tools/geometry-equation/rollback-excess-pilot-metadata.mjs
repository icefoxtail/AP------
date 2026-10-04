import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const pilot = JSON.parse(fs.readFileSync(path.join(REPORTS, 'svg_pilot_build_summary.json'), 'utf8'));
const reconciliation = JSON.parse(fs.readFileSync(path.join(REPORTS, 'svg_visual_policy_reconciliation.json'), 'utf8'));
const movedUids = new Set(reconciliation.moved.map((row) => row.questionUid));
const excess = pilot.generatedAssets.filter((asset) => movedUids.has(asset.questionUid));
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
function remove(text, id, asset) {
  const object = locate(text, id); let block = text.slice(object.start, object.end);
  for (const [key, value] of [['solutionImage', asset.assetRef], ['solutionImageAlt', asset.alt], ['solutionImageCaption', asset.caption], ['solutionImageSize', 'full']]) {
    const expected = JSON.stringify(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^[ \\t]*"${key}"\\s*:\\s*${expected},?\\r?\\n`, 'm');
    if (!pattern.test(block)) throw new Error(`Metadata not found: ${key} ${asset.questionUid}`);
    block = block.replace(pattern, '');
  }
  return text.slice(0, object.start) + block + text.slice(object.end);
}
const byFile = new Map();
for (const asset of excess) {
  const filePath = path.join(STAGING, 'exams', asset.sourceJsPath.replaceAll('/', path.sep));
  const before = byFile.get(filePath) || fs.readFileSync(filePath, 'utf8');
  byFile.set(filePath, remove(before, asset.id, asset));
}
for (const [filePath, content] of byFile) { new vm.Script(content, { filename: filePath }); fs.writeFileSync(filePath, content, 'utf8'); }
fs.writeFileSync(path.join(REPORTS, 'rollback_excess_pilot_metadata.json'), JSON.stringify({ status: 'EXCESS_PILOT_METADATA_REMOVED', removedCount: excess.length, removed: excess.map((asset) => ({ questionUid: asset.questionUid, assetRef: asset.assetRef })) }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'EXCESS_PILOT_METADATA_REMOVED', removedCount: excess.length, changedSourceFileCount: byFile.size }, null, 2));
