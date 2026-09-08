import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const manifestPath = path.join(dir, "candidate_manifest.json");
const gatePath = path.join(dir, "candidates", "add-function", "add_candidate_gate_records.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const gates = JSON.parse(fs.readFileSync(gatePath, "utf8")).records;
const byUid = new Map(gates.map((row) => [row.questionUid, row]));
for (const row of manifest.rows) {
  const gate = byUid.get(row.questionUid);
  if (!gate) continue;
  row.candidateRef = gate.candidateRef;
  row.generationStatus = gate.status;
  row.v1Status = gate.v1;
  row.v2Status = gate.v2;
  row.v3Status = gate.v3;
}
const counts = {};
for (const row of manifest.rows) counts[row.generationStatus] = (counts[row.generationStatus] || 0) + 1;
manifest.generationStatusCounts = counts;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(JSON.stringify(counts));
