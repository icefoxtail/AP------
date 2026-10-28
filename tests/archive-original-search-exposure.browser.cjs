'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const core = require(path.join(__dirname, '../archive/archive2-core.js'));
const root = path.resolve(__dirname, '..');
const catalog = core.decodeCatalog(JSON.parse(
  fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8'),
));
const expectedOriginalRows = (catalog.records || []).filter(row =>
  core.normalizeFile(row.sourceFile).startsWith('original/'),
);
const expectedOriginalUids = expectedOriginalRows.map(row => row.questionUid).sort();
const expectedOriginalFiles = [...new Set(expectedOriginalRows.map(row =>
  core.normalizeFile(row.sourceFile),
))].sort();

const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404);
    res.end();
    return;
  }
  const type = file.endsWith('.json') ? 'application/json; charset=utf-8'
    : file.endsWith('.js') ? 'text/javascript; charset=utf-8'
      : file.endsWith('.svg') ? 'image/svg+xml'
        : file.endsWith('.css') ? 'text/css; charset=utf-8'
          : 'text/html; charset=utf-8';
  res.setHeader('Content-Type', type);
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch(process.env.CHROME_BIN
      ? { executablePath: process.env.CHROME_BIN, headless: true }
      : { channel: 'chrome', headless: true });
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    const base = `http://127.0.0.1:${server.address().port}/archive/`;
    await page.goto(base + 'problem-bank-search.html');
    await page.waitForFunction(() => {
      const status = document.querySelector('#status')?.textContent || '';
      if (typeof inventory !== 'undefined' && inventory.length > 10000) return true;
      if (status && !status.includes('불러오는 중') && !status.includes('문항'))
        throw new Error('problem-bank-search init failed: ' + status);
      return false;
    });

    await page.selectOption('#source', 'original');
    const exposed = await page.evaluate(() => ({
      uids: matching.map(row => row.uid || row.questionUid).sort(),
      files: [...new Set(matching.map(row => row.sourceFile))].sort(),
      visibleLinks: [...document.querySelectorAll('#results article a')]
        .map(link => link.getAttribute('href')),
      visibleCards: document.querySelectorAll('#results article').length,
    }));
    assert.ok(expectedOriginalUids.length > 0, 'the original Archive2 catalog is nonempty');
    assert.equal(new Set(expectedOriginalUids).size, expectedOriginalUids.length,
      'the original Archive2 catalog has unique UIDs');
    assert.equal(exposed.uids.length, expectedOriginalUids.length,
      'the student search query returns every original catalog UID');
    assert.deepEqual(exposed.uids, expectedOriginalUids,
      'the student search query exposes the exact original catalog UID set');
    assert.deepEqual(exposed.files, expectedOriginalFiles,
      'the student search query exposes every registered original exam file');
    assert.equal(exposed.visibleCards, 40, 'the visible search page renders its first result page');
    assert.ok(exposed.visibleLinks.length > 0 && exposed.visibleLinks.every(href =>
      /engine\.html\?data=exams%2Foriginal%2F/.test(href || '')),
    'visible original results retain the direct Archive 1 exam path');
    assert.deepEqual(pageErrors, []);
    console.log(JSON.stringify({
      status: 'ACTUAL_CHROME_PASS',
      originalSearchQuestions: expectedOriginalUids.length,
      originalSearchExams: expectedOriginalFiles.length,
      visibleCards: exposed.visibleCards,
      directOriginalLinks: exposed.visibleLinks.length,
    }));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
