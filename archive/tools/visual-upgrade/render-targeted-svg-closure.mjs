import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const closurePath = path.join(reportDir, "targeted_svg_closure_20260909.json");
const closure = JSON.parse(fs.readFileSync(closurePath, "utf8"));
const renderDir = path.join(reportDir, "targeted-render-20260909");
fs.mkdirSync(renderDir, { recursive: true });
const playwrightRoot = process.env.AP_PLAYWRIGHT_ROOT;
if (!playwrightRoot) throw new Error("AP_PLAYWRIGHT_ROOT is required");
const { chromium } = await import(pathToFileURL(path.join(playwrightRoot, "index.mjs")).href);

const sourceFor = (row) => row.productionAsset.includes("25_제일고") ? "exams/original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js" :
  row.productionAsset.includes("25_금당고_1학기_기말") ? "exams/original/high/h2/1final/25_금당고_1학기_기말_고2_수학I.js" :
  row.productionAsset.includes("25_효천고_1학기_기말") ? "exams/original/high/h2/1final/25_효천고_1학기_기말_고2_대수c.js" :
  row.productionAsset.includes("24_금당고") ? "exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js" :
  row.productionAsset.includes("25_순천고") ? "exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js" :
  row.productionAsset.includes("25_효천고_1학기_중간") ? "exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js" :
  row.productionAsset.includes("25_매산고") ? "exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js" :
  row.productionAsset.includes("25_순천여고") ? "exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js" :
  "exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js";
const sourceRows = [...new Map(closure.rows.map((row) => [sourceFor(row), row])).values()];
const viewports = { desktop: { width: 1365, height: 900 }, mobile: { width: 390, height: 844 } };
const modes = ["exam"];
const browser = await chromium.launch({ headless: true });
const captures = [];
try {
  for (const row of sourceRows) {
    const source = sourceFor(row);
    for (const mode of modes) for (const [profile, viewport] of Object.entries(viewports)) {
      const page = await browser.newPage({ viewport });
        const engineUrl = process.env.AP_RENDER_BASE_URL ? `${process.env.AP_RENDER_BASE_URL.replace(/\/$/, "")}/archive/engine.html` : pathToFileURL(path.join(root, "archive", "engine.html")).href;
        const url = `${engineUrl}?data=${encodeURIComponent(source)}&mode=${mode}&qpp=4&fit=screen`;
      let error = null;
      try {
        await page.goto(url, { waitUntil: "load", timeout: 45000 });
        await page.waitForFunction(() => document.querySelectorAll("#print-area .q-box, #print-area .ans-n").length > 0 || document.documentElement.dataset.apRenderError, null, { timeout: 45000 });
        await page.waitForTimeout(3000);
        const check = await page.evaluate(() => ({
          pages: document.querySelectorAll("#print-area .page").length,
          blocks: document.querySelectorAll("#print-area .q-box, #print-area .ans-n").length,
          renderError: document.documentElement.dataset.apRenderError || null,
          brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
          overflow: (() => { const rect = document.querySelector("#print-area")?.getBoundingClientRect(); return Boolean(rect && (rect.left < -2 || rect.right > innerWidth + 2)); })(),
          textPresent: document.querySelector("#print-area")?.textContent?.trim().length > 0,
        }));
        const slug = source.split("/").pop().replace(/\.js$/, "").replace(/[^\p{L}\p{N}_-]+/gu, "_");
        const screenshot = path.join(renderDir, `${slug}_${mode}_${profile}.png`);
        await page.screenshot({ path: screenshot, fullPage: false });
        captures.push({ source, mode, profile, viewport, pages: check.pages, blocks: check.blocks, brokenImages: check.brokenImages, overflow: check.overflow, textPresent: check.textPresent, renderError: check.renderError, screenshot: path.relative(root, screenshot).replaceAll("\\", "/"), status: check.blocks > 0 && !check.renderError && check.brokenImages === 0 && !check.overflow && check.textPresent ? "PASS" : "FAIL" });
      } catch (cause) {
        error = String(cause?.stack || cause);
        captures.push({ source, mode, profile, viewport, status: "FAIL", error });
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

for (const row of closure.rows) {
  const own = captures.filter((capture) => capture.source === sourceFor(row));
  row.desktopRender = own.filter((capture) => capture.profile === "desktop").every((capture) => capture.status === "PASS") ? "PASS" : "FAIL";
  row.mobileRender = own.filter((capture) => capture.profile === "mobile").every((capture) => capture.status === "PASS") ? "PASS" : "FAIL";
}
closure.render = { expectedCases: captures.length, passCases: captures.filter((capture) => capture.status === "PASS").length, failCases: captures.filter((capture) => capture.status !== "PASS").length, captures };
closure.status = closure.rows.length === 13 && closure.rows.every((row) => row.V1 === "PASS" && row.V2 === "PASS" && row.V3 === "PASS" && row.shaParity && row.desktopRender === "PASS" && row.mobileRender === "PASS") && closure.render.failCases === 0 ? "TARGETED_CLOSURE_PASS_SEAL_HOLD" : "HOLD";
fs.writeFileSync(closurePath, JSON.stringify(closure, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ status: closure.status, expectedCases: closure.render.expectedCases, passCases: closure.render.passCases, failCases: closure.render.failCases }));
