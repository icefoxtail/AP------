import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const PACKETS = path.join(REPORT, '15_full_scope_v1_source_only_packets.jsonl');
const OUTPUT = path.join(REPORT, '18_full_scope_v1_packet_validation.json');

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
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

function main() {
  const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));
  const packets = fs.readFileSync(PACKETS, 'utf8').trim().split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
  const inventoryUids = new Set(inventory.map(row => row.questionUid));
  const packetUids = packets.map(packet => packet.payload?.questionUid);
  const errors = [];
  if (new Set(packetUids).size !== packetUids.length) errors.push('DUPLICATE_PACKET_UID');
  if (inventoryUids.size !== packetUids.length || [...inventoryUids].some(uid => !new Set(packetUids).has(uid))) errors.push('PACKET_INVENTORY_MEMBERSHIP_MISMATCH');
  for (const packet of packets) {
    if (packet.inputVisibilityProfile !== 'SOURCE_ONLY' || packet.priorReviewVisibility !== 'NONE') errors.push(`VISIBILITY:${packet.payload?.questionUid}`);
    if (!Array.isArray(packet.hiddenFields) || !packet.hiddenFields.includes('answer') || !packet.hiddenFields.includes('solution')) errors.push(`HIDDEN_FIELDS:${packet.payload?.questionUid}`);
    for (const forbidden of ['answer', 'solution', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'visualDecision', 'previousVerdict']) {
      if (Object.prototype.hasOwnProperty.call(packet.payload || {}, forbidden)) errors.push(`LEAK:${forbidden}:${packet.payload?.questionUid}`);
    }
    if (packet.sourceOnlyInputSha !== sha(JSON.stringify(Object.fromEntries(Object.keys(packet.payload).sort().map(key => [key, packet.payload[key]]))))) errors.push(`INPUT_SHA:${packet.payload?.questionUid}`);
  }
  const output = { schemaVersion: 'HS_QUADRATIC_V1_PACKET_VALIDATION_V1', status: errors.length ? 'V1_PACKET_VALIDATION_FAIL' : 'V1_PACKET_VALIDATED_INPUT_READY_NO_PASS', inventoryCount: inventory.length, packetCount: packets.length, uniquePacketCount: new Set(packetUids).size, sourceOnlyLeakCount: errors.filter(error => error.startsWith('LEAK:')).length, errors, inventorySha256: sha(fs.readFileSync(INVENTORY)), packetFileSha256: sha(fs.readFileSync(PACKETS)), note: 'Packet validation proves scope, visibility, and input binding only; it does not prove independent expected facts or final PASS.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, inventoryCount: output.inventoryCount, packetCount: output.packetCount, uniquePacketCount: output.uniquePacketCount, errors: errors.length }, null, 2));
}

main();
