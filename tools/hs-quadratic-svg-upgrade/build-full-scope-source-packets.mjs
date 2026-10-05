import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const PACKETS = path.join(REPORT, '15_full_scope_v1_source_only_packets.jsonl');
const FREEZE = path.join(REPORT, '16_full_scope_solution_freeze_ledger.json');
const PLAN = path.join(REPORT, '17_full_scope_batch_plan.json');
const TARGET_KEYS = new Set(['H15-SA-05', 'H15-SA-08', 'H15-SA-13', 'H22-C-05', 'H22-C-06']);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function objectSha(value) { return sha(JSON.stringify(value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, value[k]])) : value)); }

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

function loadQuestion(sourcePath, id) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, sourcePath), 'utf8'), context, { filename: sourcePath, timeout: 10000 });
  const q = context.window.questionBank?.find(item => Number(item.id) === Number(id));
  if (!q) throw new Error(`question missing: ${sourcePath} q${id}`);
  return q;
}

function assetInfo(reference) {
  if (!reference) return null;
  const normalized = String(reference).replaceAll('\\', '/').replace(/^\.\//, '');
  const absolute = path.resolve(normalized.startsWith('archive/') ? path.join(ROOT, normalized) : path.join(ROOT, 'archive', normalized));
  if (!absolute.startsWith(`${path.join(ROOT, 'archive')}${path.sep}`) || !fs.existsSync(absolute)) return { path: reference, status: 'BROKEN' };
  return { path: reference, status: 'PRESENT', bytes: fs.statSync(absolute).size, sha256: sha(fs.readFileSync(absolute)) };
}

function parseSourcePath(value) { return value.startsWith('archive/') ? value : `archive/${value}`; }

function build() {
  const rows = parseCsv(fs.readFileSync(INVENTORY, 'utf8')).filter(row => TARGET_KEYS.has(row.standardUnitKey));
  const packets = []; const freezeRows = [];
  const sourceCache = new Map();
  for (const row of rows) {
    const sourcePath = parseSourcePath(row.sourceJsPath);
    if (!sourceCache.has(sourcePath)) sourceCache.set(sourcePath, loadQuestion(sourcePath, row.id));
    const q = sourceCache.get(sourcePath);
    const problemAsset = assetInfo(q.image);
    const payload = { questionUid: row.questionUid, sourceJsPath: row.sourceJsPath, examId: row.examId, qid: Number(row.id), content: q.content ?? '', choices: Array.isArray(q.choices) ? q.choices : [], problemAsset: problemAsset ? { path: problemAsset.path, status: problemAsset.status, bytes: problemAsset.bytes ?? null, sha256: problemAsset.sha256 ?? null } : null };
    const sourceOnlyInputSha = objectSha(payload);
    packets.push({ schemaVersion: 'HS_QUADRATIC_V1_SOURCE_ONLY_PACKET_V1', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', sourceOnlyInputSha, payload, hiddenFields: ['answer', 'solution', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'visualDecision', 'previousVerdict'], status: 'V1_INPUT_READY_NO_PASS' });
    const sourceHold = row.questionUid.includes('26_금당고_1학기_중간_고1_기출_c.js|26_금당고_1학기_중간_고1_기출_c|17');
    freezeRows.push({ questionUid: row.questionUid, sourceJsPath: row.sourceJsPath, id: Number(row.id), standardUnitKey: row.standardUnitKey, protectedHash: row.protectedHash, solutionHash: row.solutionHash, sourceFileSha256: row.sourceFileSha256, visualDecision: row.visualDecision, sourceReviewStatus: sourceHold ? 'SOURCE_BLOCKED_KNOWN_HOLD' : 'PENDING_INDEPENDENT_A1', solutionFreezeStatus: 'NOT_FROZEN', mathReviewStatus: 'NOT_REVIEWED', pedagogyReviewStatus: 'NOT_REVIEWED', studentReproducibleStatus: 'NOT_REVIEWED', curriculumStatus: 'NOT_REVIEWED', currentStatus: 'CURRENT_SCOPE_LEDGER_NO_PASS' });
  }
  const byDecision = new Map();
  for (const row of rows) {
    if (row.visualDecision === 'NO_VISUAL') continue;
    const visualType = row.standardUnitKey === 'H15-SA-05' || row.standardUnitKey === 'H15-SA-13' || row.standardUnitKey === 'H22-C-05' ? 'cartesian' : 'number-line';
    const key = `${row.visualDecision}|${visualType}`;
    if (!byDecision.has(key)) byDecision.set(key, []);
    byDecision.get(key).push(row);
  }
  const batches = []; let batchNo = 1;
  for (const [key, grouped] of [...byDecision.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const [decision, visualType] = key.split('|');
    const size = decision === 'REBUILD_EXISTING' ? 4 : 5;
    for (let i = 0; i < grouped.length; i += size) {
      const members = grouped.slice(i, i + size);
      batches.push({ batchId: `hs-quadratic-${String(batchNo).padStart(3, '0')}`, batchNo, revision: 1, supersedes: null, isCanonical: true, riskProfile: decision === 'REBUILD_EXISTING' ? 'HIGH_RISK_REBUILD' : 'HIGH_RISK_ADD', plannedSize: members.length, questionUids: members.map(row => row.questionUid), visualDecisionPlan: { NO_VISUAL: 0, KEEP_EXISTING: 0, REBUILD_EXISTING: decision === 'REBUILD_EXISTING' ? members.length : 0, ADD_NEW_VISUAL: decision === 'ADD_NEW_VISUAL' ? members.length : 0 }, visualTypes: [visualType], factSchemaVersions: ['HS_QUADRATIC_FACT_V1_PENDING_CURRENT_PIPELINE_ADAPTER'], appliedRuleRefs: ['docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md', 'docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md', 'docs/rules/04_VISUAL/도형추출.md'], inventorySha: sha(fs.readFileSync(INVENTORY)), status: 'PLANNED_NO_PASS' });
      batchNo += 1;
    }
  }
  const sourceOnlyText = packets.map(packet => JSON.stringify(packet)).join('\n') + '\n';
  fs.writeFileSync(PACKETS, sourceOnlyText, 'utf8');
  const freezeOutput = { schemaVersion: 'HS_QUADRATIC_SOLUTION_FREEZE_LEDGER_V1', status: 'SOLUTION_FREEZE_NOT_EXECUTED', scope: { targetCount: rows.length, targetUidSetSha: sha(rows.map(row => row.questionUid).sort().join('\n')) }, coverage: { rows: freezeRows.length, denominator: rows.length, frozen: 0 }, sourceHoldCount: freezeRows.filter(row => row.sourceReviewStatus !== 'PENDING_INDEPENDENT_A1').length, rows: freezeRows, note: 'This ledger binds current source/solution raw hashes but does not claim independent math, pedagogy, or solution freeze PASS.' };
  fs.writeFileSync(FREEZE, `${JSON.stringify(freezeOutput, null, 2)}\n`, 'utf8');
  const planOutput = { schemaVersion: 'HS_QUADRATIC_ADAPTIVE_BATCH_PLAN_V1', status: 'PLAN_ONLY_NO_PASS', inventory: INVENTORY.replaceAll(path.sep, '/'), targetCount: rows.length, candidateTargetCount: rows.filter(row => row.visualDecision !== 'NO_VISUAL').length, noVisualCount: rows.filter(row => row.visualDecision === 'NO_VISUAL').length, batchCount: batches.length, batches, note: 'Batch plan groups same visual type/risk; execution and independent review are not implied.' };
  fs.writeFileSync(PLAN, `${JSON.stringify(planOutput, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ packets: packets.length, packetFile: PACKETS, solutionFreezeRows: freezeRows.length, sourceHoldCount: freezeOutput.sourceHoldCount, batches: batches.length, candidateTargetCount: planOutput.candidateTargetCount, noVisualCount: planOutput.noVisualCount, status: 'V1_INPUT_READY_SOLUTION_FREEZE_PENDING' }, null, 2));
}

build();
