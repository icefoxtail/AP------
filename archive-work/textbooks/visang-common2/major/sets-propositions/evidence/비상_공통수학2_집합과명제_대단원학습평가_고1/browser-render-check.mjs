import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const repoRoot = process.cwd();
const setRoot = path.join(repoRoot, 'archive-work/textbooks/visang-common2/major/sets-propositions');
const archiveRoot = path.join(repoRoot, 'archive');
const evidenceRoot = path.join(setRoot, 'evidence/비상_공통수학2_집합과명제_대단원학습평가_고1');
const setFolder = '비상_공통수학2_집합과명제_대단원학습평가_고1';
const jsName = '비상_공통수학2_집합과명제_대단원학습평가_고1.js';
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
  if (pathname === '/archive/exams/visang-textbook-preview.js') return sendFile(res, path.join(setRoot, 'js', jsName), 'text/javascript; charset=utf-8');
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
    const filePath = path.join(archiveRoot, relative), ext = path.extname(filePath).toLowerCase();
    const type = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.css' ? 'text/css; charset=utf-8' : ext === '.js' ? 'text/javascript; charset=utf-8' : ext === '.svg' ? 'image/svg+xml; charset=utf-8' : ext === '.png' ? 'image/png' : ext === '.woff2' ? 'font/woff2' : 'application/octet-stream';
    return sendFile(res, filePath, type);
  }
  res.writeHead(404); res.end('not found');
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const captures = [];
try {
  for (const viewport of [{ profile: 'desktop', width: 1440, height: 1000 }, { profile: 'mobile', width: 390, height: 844 }]) {
    for (const mode of ['exam', 'sol', 'ans']) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
      const page = await context.newPage(), pageErrors = [], failedRequests = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'failed' }));
      await page.goto(`http://127.0.0.1:${server.address().port}/archive/engine.html?data=exams%2Fvisang-textbook-preview.js&mode=${mode}&qpp=4&preview=1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => (document.querySelector('#print-area')?.innerText || '').trim().length > 80, { timeout: 60000 });
      await page.waitForFunction(() => !window.MathJax?.startup?.promise || window.MathJax.startup.promise.then(() => true), { timeout: 60000 });
      await page.waitForTimeout(1000);
      const details = await page.evaluate(() => {
        const root = document.querySelector('#print-area');
        const images = [...(root?.querySelectorAll('img') || [])].map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, width: img.naturalWidth }));
        return { textLength: (root?.innerText || '').trim().length, scrollWidth: root?.scrollWidth || 0, clientWidth: root?.clientWidth || 0, images, title: document.querySelector('#ctrl-title')?.innerText || '' };
      });
      const brokenImages = details.images.filter(image => !image.loaded), overflow = details.scrollWidth > details.clientWidth + 2;
      const ok = details.textLength > 200 && !pageErrors.length && !failedRequests.length && !brokenImages.length && !overflow;
      const screenshot = `browser-render-${mode}-${viewport.profile}.png`;
      await page.screenshot({ path: path.join(evidenceRoot, screenshot), fullPage: true });
      captures.push({ mode, viewport: viewport.profile, status: ok ? 'PASS' : 'FAIL', ...details, brokenImages, pageErrors, failedRequests, screenshot });
      await context.close();
    }
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
const report = { schemaVersion: 'VISANG_TEXTBOOK_BROWSER_RENDER_REPORT_v1', setTitle: '비상_공통수학2_집합과명제_대단원학습평가_고1', renderedAt: new Date().toISOString(), engine: 'archive/engine.html', temporaryRoute: 'serves textbook JS and assets without copying files into archive production paths', expectedQuestionCount: 17, captures, summary: { pass: captures.filter(x => x.status === 'PASS').length, fail: captures.filter(x => x.status !== 'PASS').length } };
fs.writeFileSync(path.join(evidenceRoot, 'browser-render-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(report, null, 2));
if (report.summary.fail) process.exitCode = 1;
