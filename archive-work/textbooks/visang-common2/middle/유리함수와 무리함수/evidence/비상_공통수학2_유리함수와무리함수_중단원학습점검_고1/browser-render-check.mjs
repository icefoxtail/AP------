import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const repoRoot = process.cwd();
const setRoot = path.join(repoRoot, 'archive-work/textbooks/visang-common2/middle/유리함수와 무리함수');
const archiveRoot = path.join(repoRoot, 'archive');
const evidenceRoot = path.join(setRoot, 'evidence/비상_공통수학2_유리함수와무리함수_중단원학습점검_고1');
const setFolder = '비상_공통수학2_유리함수와무리함수_중단원학습점검_고1';
const jsName = '비상_공통수학2_유리함수와무리함수_중단원학습점검_고1.js';

const dependencyRoot = process.env.APMATH_NODE_MODULES;
if (!dependencyRoot) throw new Error('APMATH_NODE_MODULES_REQUIRED');
const require = createRequire(path.join(dependencyRoot, 'package.json'));
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('playwright-core')); }

function sendFile(res, filePath, contentType) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': contentType, 'cache-control': 'no-store' });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/favicon.ico') {
    res.writeHead(204); res.end(); return;
  }
  if (pathname === '/archive/exams/visang-textbook-preview.js') {
    return sendFile(res, path.join(setRoot, 'js', jsName), 'text/javascript; charset=utf-8');
  }
  const assetPrefix = `/archive/assets/images/${setFolder}/`;
  if (pathname.startsWith(assetPrefix)) {
    const name = pathname.slice(assetPrefix.length);
    if (name.includes('/') || name.includes('..')) {
      res.writeHead(400); res.end('bad asset path'); return;
    }
    const type = name.endsWith('.svg') ? 'image/svg+xml; charset=utf-8' : 'application/octet-stream';
    return sendFile(res, path.join(setRoot, 'assets/images', setFolder, name), type);
  }
  if (pathname.startsWith('/archive/')) {
    const relative = pathname.slice('/archive/'.length);
    if (relative.includes('..') || relative.includes('\\')) {
      res.writeHead(400); res.end('bad archive path'); return;
    }
    const filePath = path.join(archiveRoot, relative);
    const extension = path.extname(filePath).toLowerCase();
    const contentType = extension === '.html' ? 'text/html; charset=utf-8'
      : extension === '.css' ? 'text/css; charset=utf-8'
      : extension === '.js' ? 'text/javascript; charset=utf-8'
      : extension === '.svg' ? 'image/svg+xml; charset=utf-8'
      : extension === '.woff2' ? 'font/woff2'
      : extension === '.woff' ? 'font/woff'
      : 'application/octet-stream';
    return sendFile(res, filePath, contentType);
  }
  res.writeHead(404); res.end('not found');
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const viewport of [
    { profile: 'desktop', width: 1440, height: 1000 },
    { profile: 'mobile', width: 390, height: 844 }
  ]) {
    for (const mode of ['exam', 'sol', 'ans']) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const pageErrors = [];
      const consoleErrors = [];
      const failedRequests = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'failed' }));
      const url = `http://127.0.0.1:${address.port}/archive/engine.html?data=exams%2Fvisang-textbook-preview.js&mode=${mode}&qpp=4&preview=1`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => (document.querySelector('#print-area')?.innerText || '').trim().length > 40, { timeout: 60000 });
      await page.waitForFunction(() => !window.MathJax || !window.MathJax.startup?.promise || window.MathJax.startup.promise.then(() => true), { timeout: 60000 });
      await page.waitForTimeout(1200);
      const pageInfo = await page.evaluate(() => {
        const root = document.querySelector('#print-area');
        const images = [...(root?.querySelectorAll('img') || [])].map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, width: img.naturalWidth }));
        const boxes = [...(root?.querySelectorAll('.q-box') || [])];
        const answerRows = [...(root?.querySelectorAll('.ans-n') || [])].length;
        return {
          textLength: (root?.innerText || '').trim().length,
          scrollWidth: root?.scrollWidth || 0,
          clientWidth: root?.clientWidth || 0,
          documentScrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          questionBoxCount: boxes.length,
          answerRowCount: answerRows,
          lastBoxText: (boxes.at(-1)?.innerText || '').slice(0, 300),
          mathJaxContainerCount: root?.querySelectorAll('mjx-container').length || 0,
          unrenderedMathScriptCount: root?.querySelectorAll('script[type="math/tex"]').length || 0,
          imageCount: images.length,
          images,
          renderTextHasSetName: (root?.innerText || '').includes('유리함수'),
          title: document.title
        };
      });
      const brokenImages = pageInfo.images.filter(img => !img.loaded);
      const overflow = pageInfo.scrollWidth > pageInfo.clientWidth + 2;
      const countOk = mode === 'ans' ? pageInfo.answerRowCount === 12 : pageInfo.questionBoxCount === 12;
      const viewportOverflow = pageInfo.documentScrollWidth > pageInfo.viewportWidth + 2;
      const ok = pageInfo.textLength > 100 && pageInfo.renderTextHasSetName && countOk && !brokenImages.length && !pageErrors.length && !consoleErrors.length && !failedRequests.length && !overflow && !viewportOverflow && pageInfo.mathJaxContainerCount > 0;
      const filename = `browser-render-${mode}-${viewport.profile}.png`;
      await page.screenshot({ path: path.join(evidenceRoot, filename), fullPage: true });
      results.push({ mode, viewport: viewport.profile, status: ok ? 'PASS' : 'FAIL', countOk, viewportOverflow, ...pageInfo, brokenImages, pageErrors, consoleErrors, failedRequests, screenshot: filename });
      await context.close();
    }
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

const report = {
  schemaVersion: 'VISANG_TEXTBOOK_BROWSER_RENDER_REPORT_v1',
  setTitle: '비상_공통수학2_유리함수와무리함수_중단원학습점검_고1',
  renderedAt: new Date().toISOString(),
  engine: 'archive/engine.html',
  temporaryRoute: 'archive-work textbook JS and SVG assets served without copying into archive production paths',
  expectedQuestionCount: 12,
  captures: results,
  summary: {
    pass: results.filter(row => row.status === 'PASS').length,
    fail: results.filter(row => row.status !== 'PASS').length
  }
};
fs.writeFileSync(path.join(evidenceRoot, 'browser-render-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
if (report.summary.fail) process.exitCode = 1;
console.log(JSON.stringify(report, null, 2));
