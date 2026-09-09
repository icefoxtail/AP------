import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const closure = JSON.parse(fs.readFileSync(path.join(reportDir, "targeted_svg_closure_20260909.json"), "utf8"));
const targetUids = new Set([
  "25_제일고_1학기_기말_고2_수학I::q2",
  "25_효천고_1학기_기말_고2_대수::q23",
  "24_금당고_1학기_중간_고2_대수::q16",
  "25_매산고_1학기_중간_고2_대수::q18",
  "25_순천여고_1학기_중간_고2_대수::q18",
  "23_한영고_1학기_중간_고2_대수::q13",
  "24_금당고_1학기_중간_고2_대수::q17",
]);
const outDir = path.join(reportDir, "targeted-evidence-20260909");
fs.mkdirSync(outDir, { recursive: true });
const slug = (uid) => uid.replaceAll("::", "_").replaceAll(/[^\p{L}\p{N}_-]+/gu, "_");
const sha = (relative) => `sha256:${crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relative))).digest("hex")}`;
const rows = closure.rows.filter((row) => targetUids.has(row.questionUid)).map((row) => {
  const name = slug(row.questionUid);
  const v1 = { schemaVersion: "apmath-targeted-v1-source-only-v1", status: row.V1, questionUid: row.questionUid, expectedFacts: row.expectedFacts, sourceAnchors: row.sourceAnchors, sourceFactFreeze: { anchorsAllFound: row.sourceAnchors.every((anchor) => anchor.found), solutionFreeze: row.solutionFreeze } };
  const v2 = { schemaVersion: "apmath-targeted-v2-artifact-only-v1", status: row.V2, questionUid: row.questionUid, candidateRef: row.candidateRef, productionAsset: row.productionAsset, candidateSha: row.candidateSha, productionSha: row.newAssetSha, shaParity: row.shaParity, observedFacts: row.observedFacts, actualGeometry: row.actualGeometry, structure: row.structure, actualCoordinateParity: row.actualCoordinateParity };
  const v3 = { schemaVersion: "apmath-targeted-v3-frozen-parity-v1", status: row.V3, questionUid: row.questionUid, V1: row.V1, V2: row.V2, expectedFacts: row.expectedFacts, observedFacts: row.observedFacts, sourceFactFreeze: row.solutionFreeze, parity: { metadataParity: row.mathParity, actualCoordinateParity: row.actualCoordinateParity, candidateProductionShaParity: row.shaParity } };
  fs.writeFileSync(path.join(outDir, `V1_source_only_${name}.json`), JSON.stringify(v1, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(outDir, `V2_artifact_only_${name}.json`), JSON.stringify(v2, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(outDir, `V3_frozen_parity_${name}.json`), JSON.stringify(v3, null, 2) + "\n", "utf8");
  return { questionUid: row.questionUid, V1: row.V1, V2: row.V2, V3: row.V3, shaParity: row.shaParity, actualCoordinateParity: row.actualCoordinateParity };
});
const summary = { schemaVersion: "apmath-targeted-svg-evidence-summary-v1", generatedAt: new Date().toISOString(), scope: "remaining FAIL 7 only", targetCount: rows.length, passCount: rows.filter((row) => row.V1 === "PASS" && row.V2 === "PASS" && row.V3 === "PASS" && row.shaParity && row.actualCoordinateParity).length, rows };
fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ targetCount: summary.targetCount, passCount: summary.passCount, outDir: path.relative(root, outDir).replaceAll("\\", "/") }));
