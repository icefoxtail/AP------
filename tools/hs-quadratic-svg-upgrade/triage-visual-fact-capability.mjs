import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const OUTPUT = path.join(REPORT, '66_visual_fact_capability_triage_r10.json');

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) { const ch = text[i]; const next = text[i + 1]; if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; } if (ch === '"') { quoted = !quoted; continue; } if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; } if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; } cell += ch; }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ''])));
}
function loadBank(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return context.window.questionBank || []; }
function normalizeText(value) { return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function capability(row, q) {
  if (row.visualDecision === 'NO_VISUAL') return { visualType: 'none', capability: 'NOT_APPLICABLE', reason: 'NO_VISUAL_DECISION_CANDIDATE' };
  const text = normalizeText(`${q.content || ''} ${q.choices || ''}`);
  const inequality = row.standardUnitKey === 'H15-SA-08' || row.standardUnitKey === 'H22-C-06';
  if (inequality) {
    const hasRelation = /(?:<|>|≤|≥|\\lt|\\gt|\\le|\\ge)/.test(text);
    const hasSimpleAbs = /\|[^|]{1,30}\|/.test(text) && !/[a-zA-Z가-힣]/.test(text.replace(/부등식|해집합|모든|실수|정수|자연수/g, ''));
    const hasNumericPolynomial = /x\s*(?:\^\s*2|²)/.test(text) && hasRelation && !/\b(?:a|b|c|k|m|n|t)\b/.test(text);
    if (hasRelation && (hasSimpleAbs || hasNumericPolynomial)) return { visualType: 'number-line', capability: 'NUMBER_LINE_DETERMINISTIC_CANDIDATE', reason: 'numeric inequality/absolute inequality can expose interval and open-closed endpoint facts' };
    if (hasRelation) return { visualType: 'number-line', capability: 'NUMBER_LINE_SPECIALIST_FACT_REQUIRED', reason: 'inequality signal exists but parameters, cases, systems, or source visual require independent interval derivation' };
    return { visualType: 'number-line', capability: 'SPECIALIST_FACT_REQUIRED', reason: 'inequality unit requires source-only interval adjudication before generation' };
  }
  const explicitQuadratic = /(?:y|f\(x\))\s*=\s*[-+\d\sxX^²()/.]+/.test(text);
  const unresolvedParameters = /\b(?:a|b|c|k|m|n|t)\b/.test(text);
  const sourceImage = Boolean(q.image) || /<svg\b|<table\b/.test(String(q.content || ''));
  if (explicitQuadratic && !unresolvedParameters && !sourceImage) return { visualType: 'cartesian', capability: 'CARTESIAN_NUMERIC_DETERMINISTIC_CANDIDATE', reason: 'explicit numeric quadratic expression can expose vertex, roots, and interval facts' };
  if (explicitQuadratic) return { visualType: 'cartesian', capability: 'CARTESIAN_SPECIALIST_FACT_REQUIRED', reason: 'quadratic graph signal exists but parameters, comparison line, source image, or case structure require independent fact modeling' };
  return { visualType: 'cartesian', capability: 'SPECIALIST_FACT_REQUIRED', reason: 'quadratic/function unit requires source-only derivation of the plotted objective before generation' };
}

function main() {
  const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));
  const cache = new Map(); const rows = [];
  for (const row of inventory) {
    if (!cache.has(row.sourceJsPath)) cache.set(row.sourceJsPath, loadBank(row.sourceJsPath));
    const q = cache.get(row.sourceJsPath).find(item => Number(item.id) === Number(row.id));
    if (!q) throw new Error(`missing ${row.questionUid}`);
    const result = capability(row, q);
    rows.push({ questionUid: row.questionUid, standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, visualDecision: row.visualDecision, ...result, expectedFactStatus: 'NOT_STARTED', candidateStatus: 'NOT_GENERATED' });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_VISUAL_FACT_CAPABILITY_TRIAGE_V1', status: 'CAPABILITY_TRIAGE_ONLY_NO_PASS', scope: { targetCount: rows.length, candidateVisualTargetCount: rows.filter(row => row.visualDecision !== 'NO_VISUAL').length }, counts: Object.fromEntries([...new Set(rows.map(row => row.capability))].sort().map(value => [value, rows.filter(row => row.capability === value).length])), rows, note: 'This deterministic capability triage does not adjudicate mathematical facts and does not authorize visual generation or final PASS.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, scope: output.scope, counts: output.counts }, null, 2));
}
main();
