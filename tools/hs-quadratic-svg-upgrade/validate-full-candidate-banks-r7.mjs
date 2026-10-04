import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const MANIFEST = path.join(REPORT, '32_full_candidate_bank_manifest_r7.json');
const OUTPUT = path.join(REPORT, '33_full_candidate_bank_validation_r7.json');

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) { const ch = text[i]; const next = text[i + 1]; if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; } if (ch === '"') { quoted = !quoted; continue; } if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; } if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; } cell += ch; }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ''])));
}
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return context.window.questionBank || []; }
function key(pathValue, id) { return `${pathValue}|${id}`; }

function main() {
  const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const sourceByPath = new Map(); const candidateByPath = new Map(); const errors = [];
  for (const file of manifest.candidateFiles) {
    const source = load(file.sourcePath); const candidate = load(file.candidatePath);
    sourceByPath.set(file.sourcePath, source); candidateByPath.set(file.sourcePath, candidate);
    if (source.length !== candidate.length) errors.push(`BANK_COUNT:${file.sourcePath}`);
    if (JSON.stringify(source.map(q => q.id)) !== JSON.stringify(candidate.map(q => q.id))) errors.push(`BANK_ORDER:${file.sourcePath}`);
  }
  for (const item of manifest.candidateVisualRows) {
    const candidate = candidateByPath.get(item.sourceJsPath)?.find(q => Number(q.id) === Number(item.id));
    const asset = item.candidateAssetPath ? path.join(ROOT, item.candidateAssetPath) : null;
    if (!candidate || candidate.solutionImage !== item.candidateAssetPath || !asset || !fs.existsSync(asset)) errors.push(`VISUAL_BINDING:${item.questionUid}`);
    if (item.sourceProtectedHash !== item.candidateProtectedHash) errors.push(`PROTECTED_PARITY:${item.questionUid}`);
  }
  const inventoryKeys = new Set(inventory.map(item => key(item.sourceJsPath, item.id)));
  const manifestKeys = new Set(manifest.candidateVisualRows.map(item => key(item.sourceJsPath, item.id)));
  if (![...manifestKeys].every(item => inventoryKeys.has(item))) errors.push('VISUAL_SCOPE_OUTSIDE_INVENTORY');
  const output = { schemaVersion: 'HS_QUADRATIC_FULL_CANDIDATE_BANK_VALIDATION_R7', status: errors.length ? 'FULL_CANDIDATE_BANK_VALIDATION_FAIL' : 'FULL_CANDIDATE_BANK_VALIDATED_NO_PASS', scope: manifest.scope, candidateVisualCount: manifest.candidateVisualCount, inventoryTargetCount: inventory.length, candidateFilesLoaded: candidateByPath.size, candidateBankQuestionCount: [...candidateByPath.values()].reduce((n, bank) => n + bank.length, 0), errors, note: 'Full candidate-bank validation proves file/order/asset binding and protected parity only. It does not close source, math, pedagogy, V1/V2/V3, render, or final audit.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, inventoryTargetCount: output.inventoryTargetCount, candidateFilesLoaded: output.candidateFilesLoaded, candidateVisualCount: output.candidateVisualCount, errors: errors.length }, null, 2));
}
main();
