import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const OUTPUT = path.join(REPORT, '19_legacy_evidence_alignment_v2.json');
const LEGACY = [
  'docs/reports/high1-svg-exhaustive-20260905/unit-09-quadratic/01_unit_inventory.csv',
  'docs/reports/high1-svg-exhaustive-20260905/unit-10-root-relations/01_unit_inventory.csv',
  'docs/reports/high1-svg-exhaustive-20260905/unit-12-inequality-combinatorics/01_unit_inventory.csv',
  'docs/reports/high1-svg-exhaustive-20260905/unit-14-quadratic-function/01_unit_inventory.csv',
];
const EXPECTED = [
  'docs/reports/high1-svg-exhaustive-20260905/unit-09-quadratic/06_expected_facts.jsonl',
  'docs/reports/high1-svg-exhaustive-20260905/unit-10-root-relations/06_expected_facts.jsonl',
  'docs/reports/high1-svg-exhaustive-20260905/unit-12-inequality-combinatorics/06_expected_facts.jsonl',
  'docs/reports/high1-svg-exhaustive-20260905/unit-14-quadratic-function/06_expected_facts.jsonl',
];

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value === undefined ? null : value;
}
function jsonSha(value) { return sha(JSON.stringify(stable(value))); }
function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]; const next = text[i + 1];
    if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; }
    if (ch === '"') { quoted = !quoted; continue; }
    if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; }
    if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; }
    cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ''])));
}
function loadBank(sourcePath) {
  const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, sourcePath), 'utf8'), context, { filename: sourcePath, timeout: 10000 }); return context.window.questionBank || [];
}
function pathQidKey(sourcePath, id) { return `${sourcePath}|${id}`; }
function questionUidPathQid(uid) {
  const parts = String(uid).split('|');
  return `${parts.slice(0, -2).join('|')}|${parts.at(-1)}`;
}
function main() {
  const current = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));
  const legacyRows = LEGACY.flatMap(file => parseCsv(fs.readFileSync(path.join(ROOT, file), 'utf8'))).filter(row => current.some(item => pathQidKey(item.sourceJsPath, item.id) === pathQidKey(row.sourceJsPath, row.id)));
  const legacyByPathQid = new Map(legacyRows.map(row => [pathQidKey(row.sourceJsPath, row.id), row]));
  const expectedRows = EXPECTED.flatMap(file => fs.readFileSync(path.join(ROOT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line))).filter(row => current.some(item => pathQidKey(item.sourceJsPath, item.id) === questionUidPathQid(row.questionUid)));
  const expectedByPathQid = new Map(expectedRows.map(row => [questionUidPathQid(row.questionUid), row]));
  const bankCache = new Map(); const rows = [];
  for (const item of current) {
    if (!bankCache.has(item.sourceJsPath)) bankCache.set(item.sourceJsPath, loadBank(item.sourceJsPath));
    const q = bankCache.get(item.sourceJsPath).find(question => Number(question.id) === Number(item.id));
    const currentHashes = { contentHash: jsonSha(q.content ?? ''), choicesHash: jsonSha(q.choices ?? []), answerHash: jsonSha(q.answer ?? null), solutionHash: jsonSha(q.solution ?? '') };
    const key = pathQidKey(item.sourceJsPath, item.id);
    const old = legacyByPathQid.get(key) || null;
    const fieldMatches = old ? Object.fromEntries(Object.keys(currentHashes).map(field => [field, currentHashes[field] === old[field]])) : {};
    rows.push({ questionUid: item.questionUid, pathQidKey: key, currentExamId: item.examId, legacyQuestionUid: old?.questionUid || null, legacyExamId: old?.examId || null, exactUidMatch: old?.questionUid === item.questionUid, examIdentityChanged: Boolean(old && old.examId !== item.examId), currentSourceFileSha256: item.sourceFileSha256, legacyInventoryPresent: Boolean(old), legacyExpectedFactPresent: expectedByPathQid.has(key), currentHashes, legacyHashes: old ? Object.fromEntries(Object.keys(currentHashes).map(field => [field, old[field]])) : null, fieldMatches, legacySourceStatus: old?.sourceValidityStatus || null, legacyVisualCandidate: old?.visualRequirement || null, currentVisualDecision: item.visualDecision, status: old && Object.values(fieldMatches).every(Boolean) && expectedByPathQid.has(key) ? 'LEGACY_ALIGNMENT_ONLY' : 'CURRENT_REVIEW_REQUIRED' });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_LEGACY_EVIDENCE_ALIGNMENT_V2', status: 'DIAGNOSTIC_ONLY_NO_PASS', scope: { currentTargetCount: current.length, legacyInventoryRowsMatchedByPathQid: legacyRows.length, legacyExpectedRowsMatchedByPathQid: expectedRows.length }, counts: { allFourHashesMatchByPathQid: rows.filter(row => row.status === 'LEGACY_ALIGNMENT_ONLY').length, anyCurrentFieldDrift: rows.filter(row => row.legacyInventoryPresent && Object.values(row.fieldMatches).some(match => !match)).length, exactUidMatched: rows.filter(row => row.exactUidMatch).length, examIdentityChanged: rows.filter(row => row.examIdentityChanged).length, missingLegacyInventory: rows.filter(row => !row.legacyInventoryPresent).length, missingLegacyExpectedFacts: rows.filter(row => !row.legacyExpectedFactPresent).length }, rows, note: 'Legacy inventory/expected facts are diagnostic alignment only. Even exact raw field matches do not create current V1/A1/V2/V3 evidence or solution freeze. Path+qid matching is used only to expose current exam-identity changes; no old PASS is promoted.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, scope: output.scope, counts: output.counts }, null, 2));
}
main();
