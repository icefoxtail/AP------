import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const full = JSON.parse(fs.readFileSync(path.join(REPORTS, 'svg_build_summary_v22.json'), 'utf8'));
const pilot = JSON.parse(fs.readFileSync(path.join(REPORTS, 'svg_pilot_build_summary.json'), 'utf8'));
const destinationRoot = path.join(REPORTS, 'staging', '_quarantine', 'geometry-equation-svg-before-generator-fix');
const moved = [];
for (const asset of full.generatedAssets) {
  const source = path.resolve(STAGING, asset.assetRef.replaceAll('/', path.sep));
  const root = path.resolve(STAGING, 'assets', 'images');
  if (!source.startsWith(`${root}${path.sep}`) || !fs.existsSync(source)) continue;
  const destination = path.resolve(destinationRoot, asset.assetRef.replaceAll('/', path.sep));
  if (!destination.startsWith(`${destinationRoot}${path.sep}`)) throw new Error(`Unsafe destination: ${destination}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.renameSync(source, destination);
  moved.push({ questionUid: asset.questionUid, assetRef: asset.assetRef, from: path.relative(ROOT, source).replaceAll('\\', '/'), to: path.relative(ROOT, destination).replaceAll('\\', '/'), bytes: fs.statSync(destination).size });
}

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
function removePilotMetadata(text, id, asset) {
  const object = locate(text, id); let block = text.slice(object.start, object.end);
  for (const [key, value] of [['solutionImage', asset.assetRef], ['solutionImageAlt', asset.alt], ['solutionImageCaption', asset.caption], ['solutionImageSize', 'full']]) {
    const escaped = JSON.stringify(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^[ \\t]*"${key}"\\s*:\\s*${escaped},?\\r?\\n`, 'm');
    if (!pattern.test(block)) throw new Error(`Pilot metadata not found: ${key} ${asset.questionUid}`);
    block = block.replace(pattern, '');
  }
  return text.slice(0, object.start) + block + text.slice(object.end);
}
const pilotUids = new Set(pilot.generatedAssets.map((asset) => asset.questionUid));
const byFile = new Map();
for (const asset of pilot.generatedAssets.filter((asset) => pilotUids.has(asset.questionUid))) {
  const row = full.generatedAssets.find((candidate) => candidate.questionUid === asset.questionUid);
  if (!row) continue;
  const filePath = path.join(STAGING, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  const current = byFile.get(filePath) || fs.readFileSync(filePath, 'utf8');
  byFile.set(filePath, removePilotMetadata(current, row.id, row));
}
for (const [filePath, content] of byFile) { new vm.Script(content, { filename: filePath }); fs.writeFileSync(filePath, content, 'utf8'); }
const result = { status: 'SVG_AND_PILOT_METADATA_QUARANTINED_FOR_GENERATOR_FIX', sourceAssetCount: full.generatedAssets.length, movedAssetCount: moved.length, removedPilotMetadataCount: pilot.generatedAssets.length, changedSourceFileCount: byFile.size, moved };
fs.writeFileSync(path.join(REPORTS, 'svg_before_generator_fix_quarantine.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, sourceAssetCount: result.sourceAssetCount, movedAssetCount: result.movedAssetCount, removedPilotMetadataCount: result.removedPilotMetadataCount }, null, 2));
