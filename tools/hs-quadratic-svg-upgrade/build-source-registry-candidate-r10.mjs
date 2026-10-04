import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { normalizeSourceExamIdRegistry, sourceExamIdRegistrySha, questionUidV2 } from '../../archive/tools/pipeline-core/question-uid.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const OUTPUT = path.join(REPORT, '61_source_exam_id_registry_candidate_r10.json');
const PAYLOAD = path.join(REPORT, '61_source_exam_id_registry_payload_r10.json');
const REF = path.join(REPORT, '61_source_exam_id_registry_ref_r10.json');
const TARGET_KEYS = new Set(['H15-SA-05', 'H15-SA-08', 'H15-SA-13', 'H22-C-05', 'H22-C-06']);
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function parseCsv(text) { const rows = []; let row = []; let cell = ''; let quoted = false; for (let i = 0; i < text.length; i += 1) { const ch = text[i]; const next = text[i + 1]; if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; } if (ch === '"') { quoted = !quoted; continue; } if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; } if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; } cell += ch; } if (cell || row.length) { row.push(cell); rows.push(row); } const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? '']))); }
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function parseSourcePath(value) { return value.startsWith('archive/') ? value : `archive/${value}`; }

const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8')).filter(row => TARGET_KEYS.has(row.standardUnitKey));
const bySource = new Map();
for (const row of inventory) { const sourcePath = parseSourcePath(row.sourceJsPath); if (!bySource.has(sourcePath)) bySource.set(sourcePath, []); bySource.get(sourcePath).push(row); }
const entries = []; const identityMismatches = [];
for (const [sourcePath, rows] of bySource) {
  const source = load(sourcePath); if (!source.examTitle) throw new Error(`examTitle missing ${sourcePath}`);
  if (source.examTitle !== rows[0].examId) identityMismatches.push({ sourcePath, inventoryExamId: rows[0].examId, sourceExamTitle: source.examTitle, reason: 'CURRENT_SOURCE_EXAM_TITLE_DIFFERS_FROM_INVENTORY_EXAM_ID_REQUIRES_EXPLICIT_MIGRATION_AUTHORITY' });
  const sourceSha = `sha256:${sha(fs.readFileSync(path.join(ROOT, sourcePath)))}`;
  for (const row of rows) { const id = Number(row.id); entries.push({ canonicalSourceExamId: source.examTitle, sourceExamId: source.examTitle, sourceIdentityKey: sourcePath, status: 'ACTIVE', sourceQuestionOrdinal: id, questionUidV2: questionUidV2(source.examTitle, id), legacyQuestionUid: row.questionUid, sourcePath, sourceSha256: sourceSha }); }
}
const registry = normalizeSourceExamIdRegistry({ schemaVersion: 'SOURCE_EXAM_ID_REGISTRY_v1', entries });
const registryPayload = `${JSON.stringify(registry, null, 2)}\n`; fs.writeFileSync(PAYLOAD, registryPayload, 'utf8');
const registryRef = { path: 'reports/hs-quadratic-svg-upgrade-20260908/61_source_exam_id_registry_payload_r10.json', bytes: Buffer.byteLength(registryPayload), sha256: `sha256:${sha(Buffer.from(registryPayload, 'utf8'))}` }; fs.writeFileSync(REF, `${JSON.stringify(registryRef, null, 2)}\n`, 'utf8');
const output = { schemaVersion: 'HS_QUADRATIC_SOURCE_EXAM_ID_REGISTRY_CANDIDATE_R10', status: 'CANDIDATE_SOURCE_REGISTRY_VALIDATED_PENDING_AUTHORITY_NO_PASS', productionAuthorized: false, authorityStatus: 'PENDING_EXPLICIT_REGISTRY_AUTHORITY', targetQuestionCount: inventory.length, sourceFileCount: bySource.size, registry: { schemaVersion: registry.schemaVersion, entries: registry.entries }, registrySha: sourceExamIdRegistrySha(registry), registryPayloadRef: 'reports/hs-quadratic-svg-upgrade-20260908/61_source_exam_id_registry_ref_r10.json', directIdentityBasis: 'current source window.examTitle + current source path + current source file SHA256', identityMismatchCount: identityMismatches.length, identityMismatches, note: 'Registry parses and validates under pipeline-core. Inventory/source exam-title differences are preserved as explicit migration-authority holds; no IDs are inferred from filenames and no final authority is claimed.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.targetQuestionCount, sourceFileCount: output.sourceFileCount, registryEntryCount: registry.entries.length, registrySha: output.registrySha }, null, 2));
