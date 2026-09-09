import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const OUTPUT = path.join(REPORT, '53_current_v1_source_only_packets_r10.jsonl');
const SUMMARY = path.join(REPORT, '54_current_v1_source_only_manifest_r10.json');
const TARGET_KEYS = new Set(['H15-SA-05', 'H15-SA-08', 'H15-SA-13', 'H22-C-05', 'H22-C-06']);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function objectSha(value) { return sha(JSON.stringify(Object.fromEntries(Object.keys(value).sort().map(key => [key, value[key]])))); }
function parseCsv(text) { const rows = []; let row = []; let cell = ''; let quoted = false; for (let i = 0; i < text.length; i += 1) { const ch = text[i]; const next = text[i + 1]; if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; } if (ch === '"') { quoted = !quoted; continue; } if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; } if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; } cell += ch; } if (cell || row.length) { row.push(cell); rows.push(row); } const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? '']))); }
function parseSourcePath(value) { return value.startsWith('archive/') ? value : `archive/${value}`; }
function loadBank(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return context.window.questionBank || []; }
function assetInfo(reference) { if (!reference) return null; const normalized = String(reference).replaceAll('\\', '/').replace(/^\.\//, ''); const absolute = path.resolve(normalized.startsWith('archive/') ? path.join(ROOT, normalized) : path.join(ROOT, 'archive', normalized)); if (!absolute.startsWith(`${path.join(ROOT, 'archive')}${path.sep}`) || !fs.existsSync(absolute)) return { path: reference, status: 'BROKEN' }; return { path: reference, status: 'PRESENT', bytes: fs.statSync(absolute).size, sha256: sha(fs.readFileSync(absolute)) }; }

const rows = parseCsv(fs.readFileSync(INVENTORY, 'utf8')).filter(row => TARGET_KEYS.has(row.standardUnitKey));
const sourceCache = new Map(); const packets = [];
for (const row of rows) {
  const sourcePath = parseSourcePath(row.sourceJsPath); if (!sourceCache.has(sourcePath)) sourceCache.set(sourcePath, loadBank(sourcePath));
  const q = sourceCache.get(sourcePath).find(item => Number(item.id) === Number(row.id)); if (!q) throw new Error(`question missing ${sourcePath} q${row.id}`);
  const payload = { questionUid: row.questionUid, sourceJsPath: row.sourceJsPath, examId: row.examId, qid: Number(row.id), content: q.content ?? '', choices: Array.isArray(q.choices) ? q.choices : [], problemAsset: assetInfo(q.image) };
  packets.push({ schemaVersion: 'HS_QUADRATIC_V1_SOURCE_ONLY_PACKET_R10', inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE', sourceOnlyInputSha: objectSha(payload), payload, hiddenFields: ['answer', 'solution', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'visualDecision', 'previousVerdict'], status: 'V1_INPUT_READY_NO_PASS' });
}
const raw = packets.map(packet => JSON.stringify(packet)).join('\n') + '\n';
fs.writeFileSync(OUTPUT, raw, 'utf8');
const output = { schemaVersion: 'HS_QUADRATIC_CURRENT_V1_SOURCE_ONLY_MANIFEST_R10', status: 'V1_INPUT_REBUILT_AFTER_SOURCE_REPAIR_NO_PASS', productionAuthorized: false, inventoryTargetCount: rows.length, packetCount: packets.length, uniquePacketCount: new Set(packets.map(packet => packet.payload.questionUid)).size, packetFile: 'reports/hs-quadratic-svg-upgrade-20260908/53_current_v1_source_only_packets_r10.jsonl', packetFileSha256: sha(Buffer.from(raw, 'utf8')), sourceFiles: [...sourceCache.keys()].map(sourcePath => ({ sourcePath, sourceFileSha256: sha(fs.readFileSync(path.join(ROOT, sourcePath))), questionCount: sourceCache.get(sourcePath).length })), hiddenFieldPolicy: 'answer/solution/solutionImage/previous verdict fields absent from payload', note: 'Rebuilt from the user-approved current branch source after the five source repairs; this is input-ready evidence, not independent expected-fact or final PASS evidence.' };
fs.writeFileSync(SUMMARY, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, inventoryTargetCount: output.inventoryTargetCount, packetCount: output.packetCount, uniquePacketCount: output.uniquePacketCount }, null, 2));
