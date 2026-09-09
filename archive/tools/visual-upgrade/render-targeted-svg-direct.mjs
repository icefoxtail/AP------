import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const closure = JSON.parse(fs.readFileSync(path.join(reportDir, "targeted_svg_closure_20260909.json"), "utf8"));
const targetUids = new Set([
  "25_제일고_1학기_기말_고2_수학I::q2", "25_효천고_1학기_기말_고2_대수::q23", "24_금당고_1학기_중간_고2_대수::q16", "25_매산고_1학기_중간_고2_대수::q18", "25_순천여고_1학기_중간_고2_대수::q18", "23_한영고_1학기_중간_고2_대수::q13", "24_금당고_1학기_중간_고2_대수::q17",
]);
const rows = closure.rows.filter((row) => targetUids.has(row.questionUid));
const renderDir = path.join(reportDir, "targeted-render-20260909");
fs.mkdirSync(renderDir, { recursive: true });
const { chromium } = await import(pathToFileURL(path.join(process.env.AP_PLAYWRIGHT_ROOT, "index.mjs")).href);
const browser = await chromium.launch({ headless: true });
const browserVersion = browser.version();
const captures = [];
const viewports = { desktop: { width: 1365, height: 900 }, mobile: { width: 390, height: 844 } };
const slug = (uid) => uid.replaceAll("::", "_").replaceAll(/[^\p{L}\p{N}_-]+/gu, "_");
try {
  for (const row of rows) for (const [profile, viewport] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport });
    const src = `${process.env.AP_RENDER_BASE_URL.replace(/\/$/, "")}/${row.productionAsset.replaceAll("\\", "/")}`;
    const html = `<style>html,body{margin:0;background:white}img{display:block;max-width:100vw;max-height:100vh;width:auto;height:auto}</style><img id="svg" src="${src}">`;
    const screenshot = path.join(renderDir, `${slug(row.questionUid)}_svg-direct_${profile}.png`);
    try {
      await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForFunction(() => document.querySelector("#svg")?.complete && document.querySelector("#svg")?.naturalWidth > 0, null, { timeout: 30000 });
      const metrics = await page.evaluate(() => { const img = document.querySelector("#svg"), r = img.getBoundingClientRect(); return { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }, overflow: r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > innerHeight + 1 }; });
      await page.screenshot({ path: screenshot, fullPage: false });
      const screenshotSha256 = `sha256:${crypto.createHash("sha256").update(fs.readFileSync(screenshot)).digest("hex")}`;
      captures.push({ questionUid: row.questionUid, mode: "svg-direct", profile, viewport, browserVersion, productionAsset: row.productionAsset, screenshot: path.relative(root, screenshot).replaceAll("\\", "/"), screenshotSha256, ...metrics, status: metrics.complete && metrics.naturalWidth > 0 && !metrics.overflow ? "PASS" : "FAIL" });
    } catch (error) {
      captures.push({ questionUid: row.questionUid, mode: "svg-direct", profile, viewport, productionAsset: row.productionAsset, status: "FAIL", error: String(error?.stack || error) });
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
const report = { schemaVersion: "apmath-targeted-svg-direct-render-v1", generatedAt: new Date().toISOString(), status: captures.every((capture) => capture.status === "PASS") ? "SVG_DIRECT_RENDER_PASS" : "SVG_DIRECT_RENDER_FAIL", expectedCases: captures.length, passCases: captures.filter((capture) => capture.status === "PASS").length, failCases: captures.filter((capture) => capture.status !== "PASS").length, captures };
fs.writeFileSync(path.join(reportDir, "targeted_svg_direct_render_20260909.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ status: report.status, expectedCases: report.expectedCases, passCases: report.passCases, failCases: report.failCases }));
