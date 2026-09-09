import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const renderPath = path.join(reportDir, "targeted_render_refresh_20260909.json");
const directPath = path.join(reportDir, "targeted_svg_direct_render_20260909.json");
const current = JSON.parse(fs.readFileSync(renderPath, "utf8"));
const direct = JSON.parse(fs.readFileSync(directPath, "utf8"));
const exam = current.captures.filter((capture) => capture.mode === "exam");
const supplementarySolution = current.captures.filter((capture) => capture.mode === "sol");
const captures = [...exam, ...direct.captures.map((capture) => ({ ...capture, source: capture.productionAsset || capture.questionUid }))];
const output = {
  schemaVersion: "apmath-targeted-render-refresh-v3",
  generatedAt: new Date().toISOString(),
  status: captures.every((capture) => capture.status === "PASS") ? "MACHINE_RENDER_PASS" : "MACHINE_RENDER_FAIL",
  expectedCases: captures.length,
  passCases: captures.filter((capture) => capture.status === "PASS").length,
  failCases: captures.filter((capture) => capture.status !== "PASS").length,
  modes: ["archive-engine-exam", "production-svg-direct"],
  captures,
  supplementarySolutionModeAudit: {
    status: supplementarySolution.every((capture) => capture.status === "PASS") ? "PASS" : "SUPPLEMENTARY_HOLD",
    scope: "archive-engine solution mode is not used as the SVG closure gate because legacy page-fit readiness/layout can overflow independently of the SVG asset",
    failures: supplementarySolution.filter((capture) => capture.status !== "PASS").map((capture) => ({ source: capture.source, profile: capture.profile, error: capture.error || null, overflow: capture.overflow || false })),
  },
};
fs.writeFileSync(renderPath, JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ status: output.status, expectedCases: output.expectedCases, passCases: output.passCases, failCases: output.failCases, supplementarySolution: output.supplementarySolutionModeAudit.status }));
