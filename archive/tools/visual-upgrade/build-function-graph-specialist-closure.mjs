import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const manifest = JSON.parse(fs.readFileSync(path.join(reportDir, "candidate_manifest.json"), "utf8"));
const bindings = JSON.parse(fs.readFileSync(path.join(reportDir, "PRODUCTION_ASSET_BINDINGS.json"), "utf8"));
const render = JSON.parse(fs.readFileSync(path.join(reportDir, "browser_render_capture_matrix.json"), "utf8"));
const bindingRows = bindings.files.flatMap((file) => file.rows);
const candidateRows = manifest.rows.filter((row) => row.candidateRef && row.v1Status === "PASS" && row.v2Status === "PASS" && row.v3Status === "PASS");
const sha = (relative) => `sha256:${crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relative))).digest("hex")}`;
const evidenceExists = (relative) => Boolean(relative && fs.existsSync(path.join(root, relative)));
const rows = candidateRows.map((row) => {
  const binding = bindingRows.find((item) => item.questionUid === row.questionUid);
  const evidence = [row.v1Evidence, row.v2Evidence, row.v3Evidence];
  const errors = [];
  if (!fs.existsSync(path.join(root, row.candidateRef))) errors.push("CANDIDATE_MISSING");
  if (!binding) errors.push("PRODUCTION_BINDING_MISSING");
  if (binding && sha(row.candidateRef) !== sha(binding.assetPath.startsWith("archive/") ? binding.assetPath : `archive/${binding.assetPath}`)) errors.push("CANDIDATE_ASSET_SHA_MISMATCH");
  if (evidence.some((ref) => !evidenceExists(ref))) errors.push("V1_V2_V3_EVIDENCE_MISSING");
  return { questionUid: row.questionUid, disposition: row.disposition, generationStatus: row.generationStatus, candidateRef: row.candidateRef, v1Evidence: row.v1Evidence, v2Evidence: row.v2Evidence, v3Evidence: row.v3Evidence, productionAsset: binding?.assetPath || null, status: errors.length ? "FAIL" : "PASS", errors };
});
const output = {
  schemaVersion: "apmath-function-graph-specialist-closure-v1",
  generatedAt: new Date().toISOString(),
  route: "function-family-specialist-visual-route",
  scope: "H2 S1 algebra 39 ADD/REBUILD candidate visuals",
  candidateCount: rows.length,
  passCount: rows.filter((row) => row.status === "PASS").length,
  failCount: rows.filter((row) => row.status !== "PASS").length,
  renderCapture: { status: render.status, expectedCases: render.expectedCases, observedCases: render.observedCases, passCases: render.passCases, failCases: render.failCases },
  canonicalPipelineCore: { status: "HOLD", reason: "MISSING_CURRENT_PIPELINE_EVIDENCE: pipeline-core visual-contract has no current function-graph specialist adapter" },
  productionAuthorized: false,
  status: rows.length === 39 && rows.every((row) => row.status === "PASS") && render.status === "PASS" ? "SPECIALIST_EVIDENCE_PASS_CANONICAL_ROUTE_HOLD" : "SPECIALIST_EVIDENCE_FAIL",
  rows,
};
fs.writeFileSync(path.join(reportDir, "function_graph_specialist_closure.json"), JSON.stringify(output, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(reportDir, "function_graph_specialist_closure.md"), `# Function-graph specialist closure\n\n- status: **${output.status}**\n- candidate rows: ${output.passCount}/${output.candidateCount} PASS\n- render: ${output.renderCapture.passCases}/${output.renderCapture.expectedCases} PASS\n- canonical pipeline-core: **HOLD** — current typed visual contract has no general-function graph adapter\n- productionAuthorized: **false**\n\nThis report closes the specialist-side evidence without claiming canonical pipeline-core PASS.\n`, "utf8");
console.log(JSON.stringify({ status: output.status, candidateCount: output.candidateCount, passCount: output.passCount, failCount: output.failCount, render: output.renderCapture }));
