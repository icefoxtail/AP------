import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "reports", "h2-s1-algebra-visual-upgrade", "visual_triage.json");
const report = JSON.parse(fs.readFileSync(file, "utf8"));
const row = report.rows.find((item) => item.questionUid === "24_팔마고_1학기_기말_고2_수학I::q9");
if (!row) throw new Error("q9 row missing");
row.disposition = "REBUILD_EXISTING";
row.sourceBlurRoute = "SOURCE_BLUR_RECONSTRUCTABLE";
row.v1Status = "PASS";
row.v2Status = "PASS";
row.v3Status = "PASS";
row.candidateRef = "reports/h2-s1-algebra-visual-upgrade/candidates/24_팔마고_1학기_기말_고2_수학I_q9_solution.svg";
row.v1Evidence = "reports/h2-s1-algebra-visual-upgrade/V1_source_only_q9.json";
row.v2Evidence = "reports/h2-s1-algebra-visual-upgrade/V2_artifact_only_q9.json";
row.v3Evidence = "reports/h2-s1-algebra-visual-upgrade/V3_parity_q9.json";
fs.writeFileSync(file, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ questionUid: row.questionUid, disposition: row.disposition, v1: row.v1Status, v2: row.v2Status, v3: row.v3Status }));
