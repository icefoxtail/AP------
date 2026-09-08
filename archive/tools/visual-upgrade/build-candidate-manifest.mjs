import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const triage = JSON.parse(fs.readFileSync(path.join(dir, "visual_triage.json"), "utf8"));
const rebuild = fs.existsSync(path.join(dir, "rebuild_candidate_manifest.json"))
  ? JSON.parse(fs.readFileSync(path.join(dir, "rebuild_candidate_manifest.json"), "utf8"))
  : { rows: [] };
const byUid = new Map(rebuild.rows.map((row) => [row.questionUid, row]));
const gateFiles = [
  path.join(dir, "candidates", "add-function", "add_candidate_gate_records.json"),
  path.join(dir, "candidates", "add-general", "add_general_gate_records.json"),
  path.join(dir, "candidates", "rebuild-general", "rebuild_general_gate_records.json"),
];
const gates = new Map();
for (const file of gateFiles) {
  if (!fs.existsSync(file)) continue;
  for (const row of JSON.parse(fs.readFileSync(file, "utf8")).records ?? []) gates.set(row.questionUid, row);
}
const rows = triage.rows.filter((row) => ["ADD_NEW_VISUAL", "REBUILD_EXISTING"].includes(row.disposition)).map((row) => {
  let next = row;
  if (byUid.has(row.questionUid)) next = { ...next, candidateRef: byUid.get(row.questionUid).candidateRef, generationStatus: byUid.get(row.questionUid).candidateStatus };
  if (row.questionUid === "24_팔마고_1학기_기말_고2_수학I::q9") next = { ...next, candidateRef: "reports/h2-s1-algebra-visual-upgrade/candidates/24_팔마고_1학기_기말_고2_수학I_q9_solution.svg", generationStatus: "GENERATED_CANDIDATE_V1_V2_V3_PASS" };
  if (!byUid.has(row.questionUid) && row.questionUid !== "24_팔마고_1학기_기말_고2_수학I::q9") next = { ...next, candidateRef: null, generationStatus: row.disposition === "ADD_NEW_VISUAL" ? "PENDING_FACT_MODEL_GENERATION" : "PENDING_REBUILD" };
  const gate = gates.get(row.questionUid);
  if (gate) next = { ...next, candidateRef: gate.candidateRef, v1Status: gate.v1, v2Status: gate.v2, v3Status: gate.v3, v1Evidence: gate.v1Evidence, v2Evidence: gate.v2Evidence, v3Evidence: gate.v3Evidence, generationStatus: gate.status };
  return next;
});
const counts = {};
for (const row of rows) counts[row.generationStatus] = (counts[row.generationStatus] || 0) + 1;
const manifest = { schemaVersion: "apmath-visual-candidate-manifest-v1", targetCount: rows.length, generationStatusCounts: counts, rows };
fs.writeFileSync(path.join(dir, "candidate_manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ targetCount: rows.length, generationStatusCounts: counts }));
