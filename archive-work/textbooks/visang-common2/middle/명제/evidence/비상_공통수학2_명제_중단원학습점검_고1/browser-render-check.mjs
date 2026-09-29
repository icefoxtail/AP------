import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const repoRoot = process.cwd();
const setRoot = path.join(repoRoot, 'archive-work/textbooks/visang-common2/middle/명제');
const archiveRoot = path.join(repoRoot, 'archive');
const evidenceRoot = path.join(setRoot, 'evidence/비상_공통수학2_명제_중단원학습점검_고1');
const setFolder = '비상_공통수학2_명제_중단원학습점검_고1';
const jsName = `${setFolder}.js`;
const dependencyRoot = process.env.APMATH_NODE_MODULES;
if (!dependencyRoot) throw new Error('APMATH_NODE_MODULES_REQUIRED');
const require = createRequire(path.join(dependencyRoot, 'package.json'));
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('playwright-core')); }

function sendFile(res, filePath, contentType) {
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': contentType, 'cache-control': 'no-store' });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  if (pathname === '/archive/exams/visang-textbook-preview.js') {
    return sendFile(res, path.join(setRoot, 'js', jsName), 'text/javascript; charset=utf-8');
  }
  const assetPrefix = `/archive/assets/images/${setFolder}/`;
  if (pathname.startsWith(assetPrefix)) {
    const name = pathname.slice(assetPrefix.length);
    if (name.includes('/') || name.includes('..')) { res.writeHead(400); res.end('bad asset path'); return; }
    const type = name.endsWith('.svg') ? 'image/svg+xml; charset=utf-8' : 'image/png';
    return sendFile(res, path.join(setRoot, 'assets/images', setFolder, name), type);
  }
  if (pathname.startsWith('/archive/')) {
    const relative = pathname.slice('/archive/'.length);
    if (relative.includes('..') || relative.includes('\\')) { res.writeHead(400); res.end('bad archive path'); return; }
    const filePath = path.join(archiveRoot, relative);
    const extension = path.extname(filePath).toLowerCase();
    const type = extension === '.html' ? 'text/html; charset=utf-8'
      : extension === '.css' ? 'text/css; charset=utf-8'
      : extension === '.js' ? 'text/javascript; charset=utf-8'
      : extension === '.svg' ? 'image/svg+xml; charset=utf-8'
      : extension === '.woff2' ? 'font/woff2' : extension === '.woff' ? 'font/woff' : 'application/octet-stream';
    return sendFile(res, filePath, type);
  }
  res.writeHead(404); res.end('not found');
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const captures = [];
try {
  for (const viewport of [
    { profile: 'desktop', width: 1440, height: 1000 },
    { profile: 'mobile', width: 390, height: 844 }
  ]) {
    for (const mode of ['exam', 'sol', 'ans']) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const pageErrors = [];
      const failedRequests = [];
      const badResponses = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'failed' }));
      page.on('response', response => { if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() }); });
      const url = `http://127.0.0.1:${port}/archive/engine.html?data=exams%2Fvisang-textbook-preview.js&mode=${mode}&qpp=4&preview=1`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => (document.querySelector('#print-area')?.innerText || '').trim().length > 40, { timeout: 60000 });
      await page.waitForFunction(() => !window.MathJax || !window.MathJax.startup?.promise || window.MathJax.startup.promise.then(() => true), { timeout: 60000 });
      await page.waitForTimeout(1200);
      const details = await page.evaluate((mode) => {
        const root = document.querySelector('#print-area');
        const images = [...(root?.querySelectorAll('img') || [])].map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, width: img.naturalWidth }));
        const count = mode === 'exam' ? root?.querySelectorAll('.q-box[data-source-ref]:not(.sol-box)').length
          : mode === 'sol' ? root?.querySelectorAll('.q-box.sol-box[data-source-ref]').length : root?.querySelectorAll('.ans-n').length;
        return {
          textLength: (root?.innerText || '').trim().length,
          scrollWidth: root?.scrollWidth || 0,
          clientWidth: root?.clientWidth || 0,
          blockCount: count,
          imageCount: images.length,
          images,
          lastQuestionPresent: (root?.innerText || '').includes(mode === 'ans' ? '25' : '최댓값'),
          title: document.title,
          renderError: document.documentElement.dataset.apRenderError || '',
          bodyImages: [...document.querySelectorAll('img')].map(img => ({ src: img.getAttribute('src'), complete: img.complete, width: img.naturalWidth }))
        };
      }, mode);
      const brokenImages = details.images.filter(image => !image.loaded);
      const overflow = details.scrollWidth > details.clientWidth + 2;
      const status = details.textLength > 100 && details.blockCount === 11 && details.lastQuestionPresent
        && !brokenImages.length && !pageErrors.length && !failedRequests.length && !overflow ? 'PASS' : 'FAIL';
      const screenshot = `browser-render-${mode}-${viewport.profile}.png`;
      await page.screenshot({ path: path.join(evidenceRoot, screenshot), fullPage: true });
      captures.push({ mode, viewport: viewport.profile, status, ...details, brokenImages, pageErrors, failedRequests, badResponses, overflow, screenshot });
      await context.close();
    }
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

const report = {
  schemaVersion: 'VISANG_TEXTBOOK_BROWSER_RENDER_REPORT_v1',
  setTitle: setFolder,
  renderedAt: new Date().toISOString(),
  engine: 'archive/engine.html',
  route: 'Set-local final JS and visual assets served through a temporary local HTTP mapping.',
  expectedQuestionCount: 11,
  captures,
  summary: { pass: captures.filter(row => row.status === 'PASS').length, fail: captures.filter(row => row.status !== 'PASS').length }
};
fs.writeFileSync(path.join(evidenceRoot, 'browser-render-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
if (report.summary.fail) process.exitCode = 1;
console.log(JSON.stringify(report, null, 2));
