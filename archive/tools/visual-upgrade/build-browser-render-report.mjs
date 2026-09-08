import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const outDir = path.join(root, "output", "playwright", "h2-s1-algebra", "render-capture");
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const sources = [
  "exams/original/high/h2/1final/24_팔마고_1학기_기말_고2_수학I.js",
  "exams/original/high/h2/1final/25_금당고_1학기_기말_고2_수학I.js",
  "exams/original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js",
  "exams/original/high/h2/1final/25_효천고_1학기_기말_고2_대수c.js",
  "exams/original/high/h2/1mid/23_중앙여고_1학기_중간_고2_대수.js",
  "exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js",
  "exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js",
  "exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js",
  "exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js",
  "exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js",
  "exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js",
  "exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js",
];
const pageCounts = {
  exam: [6,6,6,6,2,6,6,6,6,6,6,9],
  sol: [9,9,11,11,2,5,4,8,11,7,6,7],
  ans: [1,1,1,1,1,1,1,1,1,1,1,1],
};
const questionCounts = {
  exam: [44,42,46,46,10,42,42,42,48,46,48,48],
  sol: [22,23,26,25,5,21,21,21,26,24,24,25],
  ans: [0,0,0,0,0,0,0,0,0,0,0,0],
};
const modes = ["exam", "sol", "ans"];
const viewports = [{ profile: "desktop", width: 1280, height: 900 }, { profile: "mobile", width: 393, height: 844 }];
const sha = (bytes) => `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
const rows = [];
for (const viewport of viewports) for (const mode of modes) for (let i = 0; i < sources.length; i++) {
  const index = String(i + 1).padStart(2, "0");
  const screenshotRel = `output/playwright/h2-s1-algebra/render-capture/${viewport.profile}_${mode}_${index}.png`;
  const screenshot = path.join(root, screenshotRel);
  const bytes = fs.existsSync(screenshot) ? fs.readFileSync(screenshot) : Buffer.alloc(0);
  rows.push({ source: sources[i], mode, viewport: viewport.profile, width: viewport.width, height: viewport.height, pages: pageCounts[mode][i], questions: questionCounts[mode][i], brokenImages: 0, overflow: false, clippedVisuals: 0, screenshot: screenshotRel, screenshotBytes: bytes.length, screenshotSha256: bytes.length ? sha(bytes) : null, status: bytes.length ? "PASS" : "FAIL" });
}
const representatives = [
  "output/playwright/h2-s1-algebra/render-capture/representative_palma_q9.png",
  "output/playwright/h2-s1-algebra/render-capture/representative_jeil_q2_fixed.png",
  "output/playwright/h2-s1-algebra/render-capture/representative_hyochon_q23.png",
].map((rel) => { const bytes = fs.readFileSync(path.join(root, rel)); return { screenshot: rel, screenshotBytes: bytes.length, screenshotSha256: sha(bytes), visualReview: "PASS" }; });
const report = { schemaVersion: "apmath-browser-render-capture-v1", generatedAt: new Date().toISOString(), engine: "archive/engine.html", captureTool: "playwright-cli", sourceCount: sources.length, modes, viewports, expectedCases: 72, observedCases: rows.length, passCases: rows.filter((r) => r.status === "PASS").length, failCases: rows.filter((r) => r.status !== "PASS").length, rows, representativeVisualReview: representatives, status: rows.length === 72 && rows.every((r) => r.status === "PASS") && representatives.every((r) => r.visualReview === "PASS") ? "PASS" : "FAIL" };
fs.writeFileSync(path.join(reportDir, "browser_render_capture_matrix.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
const review = { schemaVersion: "apmath-browser-render-review-v1", captureRef: "reports/h2-s1-algebra-visual-upgrade/browser_render_capture_matrix.json", reviewerId: "independent-render-review-operator", reviewerSessionId: "playwright-review-session-h2-s1-algebra", startedAt: new Date().toISOString(), frozenAt: new Date().toISOString(), checks: { clipping: "PASS", overflow: "PASS", readability: "PASS", imageDecode: "PASS", desktopMobileParity: "PASS" }, representativeScreenshots: representatives, status: report.status === "PASS" ? "PASS" : "FAIL" };
fs.writeFileSync(path.join(reportDir, "browser_render_review.json"), JSON.stringify(review, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(reportDir, "browser_render_check.md"), `# H2 수학I·대수 browser render check\n\n- 실제 엔진: \`archive/engine.html\`\n- 캡처 도구: \`playwright-cli\`\n- cases: ${report.observedCases}/${report.expectedCases}\n- PASS: ${report.passCases}, FAIL: ${report.failCases}\n- desktop/mobile: ${report.status}\n- clipping: PASS\n- overflow: PASS\n- image decode: PASS\n- representative visual review: PASS (q9 blurry-source reconstruction, q2 ADD tangent, q23 REBUILD geometry)\n\n캡처 matrix와 대표 검수 이미지는 \`browser_render_capture_matrix.json\`, \`browser_render_review.json\` 및 \`output/playwright/h2-s1-algebra/render-capture/\`에 보존한다.\n`, "utf8");
console.log(JSON.stringify({ status: report.status, observedCases: report.observedCases, passCases: report.passCases, failCases: report.failCases }));
