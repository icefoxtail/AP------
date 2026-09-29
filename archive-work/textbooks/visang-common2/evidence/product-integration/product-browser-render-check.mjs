import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const root = process.cwd();
const productFolder = 'archive/exams/textbooks/비상교육_공통수학2';
const manifestPath = 'archive-work/textbooks/visang-common2/evidence/product-integration/product-registration-manifest.json';
const registration = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const expectedByFile = new Map(registration.files.map(row => [row.file, row.questionCount]));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/+/, '');
    const file = path.resolve(root, pathname);
    if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error('NOT_FOUND');
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(response);
  } catch (error) { response.writeHead(404); response.end(error.message); }
});

const dependencyRoot = process.env.APMATH_NODE_MODULES;
if (!dependencyRoot) throw new Error('APMATH_NODE_MODULES_REQUIRED');
const require = createRequire(path.join(dependencyRoot, '..', 'package.json'));
const { chromium } = require('playwright');
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

try {
  for (const [file, expectedCount] of expectedByFile) {
    for (const mode of ['exam', 'sol', 'ans']) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
      const pageErrors = [], failedRequests = [], badResponses = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'failed' }));
      page.on('response', response => { if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() }); });
      const url = `http://127.0.0.1:${server.address().port}/archive/engine.html?mode=${mode}&qpp=4&data=${encodeURIComponent(`exams/${file}`)}`;
      const selector = mode === 'ans' ? '#print-area .ans-n' : mode === 'sol' ? '#print-area .q-box.sol-box[data-source-ref]' : '#print-area .q-box[data-source-ref]:not(.sol-box)';
      let status = 'PASS', count = 0, lastPresent = false;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForFunction(({ selector, expectedCount }) => {
          const nodes = [...document.querySelectorAll(selector)];
          const keys = new Set(nodes.map((node, i) => node.dataset.sourceRef || String(i)));
          return keys.size === expectedCount;
        }, { selector, expectedCount }, { timeout: 60000 });
        await page.evaluate(async () => {
          if (window.MathJax?.startup?.promise) await Promise.race([window.MathJax.startup.promise, new Promise(resolve => setTimeout(resolve, 12000))]);
          await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 12000))]);
          await Promise.race([Promise.all([...document.images].map(image => image.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 12000))]);
        });
        const observed = await page.evaluate(selector => {
          const root = document.querySelector('#print-area');
          const nodes = [...document.querySelectorAll(selector)];
          const keys = new Set(nodes.map((node, i) => node.dataset.sourceRef || String(i)));
          return {
            count: keys.size,
            lastPresent: nodes.length > 0 && nodes.at(-1).getBoundingClientRect().height > 0,
            brokenImages: [...(root?.querySelectorAll('img') || [])].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.getAttribute('src')),
            mathErrors: root?.querySelectorAll('mjx-merror,[data-mjx-error]').length || 0,
            mathJaxPresent: Boolean(window.MathJax),
            horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
            renderError: document.documentElement.dataset.apRenderError || null,
          };
        }, selector);
        count = observed.count;
        lastPresent = observed.lastPresent;
        if (count !== expectedCount || !lastPresent || observed.brokenImages.length || observed.mathErrors || !observed.mathJaxPresent || observed.horizontalOverflow || observed.renderError || pageErrors.length || failedRequests.length || badResponses.length) status = 'FAIL';
        results.push({ file, mode, status, expectedCount, observedCount: count, lastPresent, ...observed, pageErrors, failedRequests, badResponses });
      } catch (error) {
        status = 'FAIL';
        results.push({ file, mode, status, expectedCount, observedCount: count, lastPresent, error: error.message, pageErrors, failedRequests, badResponses });
      } finally { await page.close(); }
      console.log(JSON.stringify({ status, file, mode, expectedCount, observedCount: count }));
    }
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

const report = {
  schemaVersion: 'VISANG_TEXTBOOK_PRODUCT_BROWSER_RENDER_v1',
  status: results.every(result => result.status === 'PASS') ? 'PASS' : 'FAIL',
  productFolder,
  modeCount: results.length,
  examFileCount: expectedByFile.size,
  questionCount: [...expectedByFile.values()].reduce((sum, value) => sum + value, 0),
  contentReviewPerformed: false,
  results,
};
fs.writeFileSync(path.join(root, 'archive-work/textbooks/visang-common2/evidence/product-integration/product-browser-render-check.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, examFileCount: report.examFileCount, questionCount: report.questionCount, modeCount: report.modeCount, contentReviewPerformed: false }, null, 2));
if (report.status !== 'PASS') process.exitCode = 1;
