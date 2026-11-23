'use strict';

// 엔진 견고화 2단계: 문항 하나의 HTML 태그 짝 오류는 그 문항에만 알림으로 남고(출력은 그대로), 어떤 대기도 끝없이 두지 않는다(시간 예산).
// 1) 순수 계약(항상 실행): htmlBalance, APRenderLoop.bounded.
// 2) 실제 Chrome(playwright와 Chrome이 있을 때만; 없으면 NOT_RUN): 태그 짝이 안 맞는 문항이 있어도 E·M 시험지·해설지가 ready로 열리고 모든 문항이 남으며,
//    알림(severity=warn)이 apRenderReport와 띠에 그 문항 번호로 찍힌다(apRenderDiagnostics 오류 배열은 비어 있다). MathJax가 끝없이 멈춰도
//    예산(테스트에서는 1.5초) 뒤 ready가 나고 RENDER_TIME_BUDGET 알림이 남는다.
//    "Archive Output Performance" 워크플로에서는 ARCHIVE_ONE_ITEM_REQUIRE_BROWSER=1로 Chrome 없음을 실패로 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const diagnostics = require('../archive/render-diagnostics.js');
const loop = require('../archive/mathjax_render_loop.js');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const MIME = { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const HTML = 'engine-robust-html.js';
const OK = 'engine-robust-ok.js';
const ALL = [1, 2, 3, 4, 5, 6, 7, 8];

test('htmlBalance: 안 닫힘·짝 없는 닫기만 잡고, 수식·부등호 글자·자동으로 닫히는 태그는 건드리지 않는다', () => {
  const bad = diagnostics.htmlBalance('앞 <div class="x">열고 <b>굵게</b> 안 닫음');
  assert.deepEqual(bad.unclosed, ['div']);
  assert.deepEqual(diagnostics.htmlBalance('짝 없음 </div> 끝').stray, ['div']);
  assert.deepEqual(diagnostics.htmlBalance('<span><b>두 개').unclosed.sort(), ['b', 'span']);
  for (const fine of [
    '<div class="a"><b>x</b></div>', '줄바꿈 <br> 와 <br/> 와 <img src="a.png">', '$a<b$ 이고 \\(c<d\\) 이고 \\[e<f\\]',
    'a<b 이고 c>d', '<p>문단 <li>목록', '<table><tr><td>칸</td></tr></table>', '<svg><g><path d="M0 0"></g></svg>', '', null, undefined
  ]) assert.equal(diagnostics.htmlBalance(fine).ok, true, String(fine));
});

test('APRenderLoop.bounded: 제때 끝나면 true, 시간을 넘기면 false(기록 후 계속), 거절은 그대로 던진다', async () => {
  delete globalThis.__AP_RENDER_BUDGET_HITS__;
  assert.equal(await loop.bounded(Promise.resolve(1), 200, 'fast'), true);
  assert.equal(await loop.bounded(new Promise(() => {}), 30, 'never'), false);
  assert.deepEqual(globalThis.__AP_RENDER_BUDGET_HITS__, [{ label: 'never', ms: 30 }]);
  await assert.rejects(loop.bounded(Promise.reject(new Error('boom')), 200, 'reject'), /boom/);
  delete globalThis.__AP_RENDER_BUDGET_HITS__;
});

test('두 출력 화면이 같은 파일을 같은 ?v=로 불러온다', () => {
  const pick = (html, name) => (new RegExp(`<script src="(?:\\.\\./archive/)?${name.replace('.', '\\.')}\\?v=([^"]+)"`).exec(read(html)) || [])[1];
  for (const name of ['render-diagnostics.js', 'mathjax_render_loop.js', 'equal-slot-engine.js', 'exam-render-executor.js', 'solution-render-executor.js']) {
    assert.ok(pick('archive/engine.html', name), name);
    assert.equal(pick('archive/engine.html', name), pick('archive/mixed_engine.html', name), name);
  }
});

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (pathname === '/__seed.html') { res.writeHead(200, { 'content-type': MIME['.html'] }); return res.end('<!doctype html><title>seed</title>'); }
      const fixture = /^\/archive\/exams\/_fixture\/([\w.-]+)$/.exec(pathname);
      const file = fixture ? path.join(root, 'tests', 'fixtures', fixture[1]) : path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve(server));
  });
}
async function launch() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (error) { return { reason: 'playwright를 불러올 수 없음' }; }
  const candidates = [process.env.CHROME_BIN, 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(file => file && fs.existsSync(file));
  try {
    const browser = candidates.length
      ? await chromium.launch({ executablePath: candidates[0], headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
      : await chromium.launch({ channel: 'chrome', headless: true });
    return { browser };
  } catch (error) { return { reason: 'Chrome을 실행할 수 없음' }; }
}
async function withBrowser(t, body) {
  const launched = await launch();
  if (!launched.browser) {
    assert.ok(process.env.ARCHIVE_ONE_ITEM_REQUIRE_BROWSER !== '1', 'Chrome required: ' + launched.reason);
    t.skip('NOT_RUN: ' + launched.reason);
    return;
  }
  const server = await serve();
  try { await body(launched.browser, `http://127.0.0.1:${server.address().port}`); }
  finally { await launched.browser.close(); await new Promise(resolve => server.close(resolve)); }
}
async function openPage(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'block' });
  await context.route('**/*', route => (route.request().url().startsWith(origin) ? route.fallback() : route.abort()));
  const page = await context.newPage();
  await page.addInitScript(() => { window.print = () => {}; });
  return { context, page };
}
async function snapshot(page) {
  await page.waitForFunction(() => document.documentElement.dataset.apRenderReady === 'true' || document.documentElement.dataset.apRenderError, null, { timeout: 90000 });
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const area = document.getElementById('print-area');
    const notice = document.getElementById('ap-render-notice');
    const layout = (() => { try { window.Archive2PdfReadiness.assertLayoutReady(); return null; } catch (error) { return String(error.message); } })();
    return {
      ready: document.documentElement.dataset.apRenderReady, error: document.documentElement.dataset.apRenderError || null,
      pages: area.querySelectorAll('.page').length,
      numbers: [...new Set([...area.querySelectorAll('.q-num')].map(node => parseInt(node.textContent, 10)).filter(Number.isFinite))].sort((a, b) => a - b),
      diagnostics: window.apRenderDiagnostics, report: window.apRenderReport, layout,
      noticeVisible: !!notice && !notice.hidden && getComputedStyle(notice).display !== 'none', noticeText: notice?.textContent || ''
    };
  });
}
async function seedMixed(page, origin, file) {
  const sandbox = { window: {} };
  vm.runInNewContext(read('tests/fixtures/' + file), sandbox);
  const questions = sandbox.window.questionBank.map((question, index) => ({ ...question, sourceArchiveFile: `exams/_fixture/${file}`, sourceOrdinal: index + 1 }));
  await page.goto(`${origin}/__seed.html`);
  await page.evaluate(({ qs }) => {
    localStorage.setItem('mixedQuestions_robust', JSON.stringify(qs));
    localStorage.setItem('mixedMeta_robust', JSON.stringify({ title: 'engine-robust', qpp: 4, count: qs.length }));
  }, { qs: questions });
}
const urlFor = (origin, engine, file, mode) => engine === 'E'
  ? `${origin}/archive/engine.html?data=exams/_fixture/${file}&mode=${mode}&assetBase=off`
  : `${origin}/archive/mixed_engine.html?key=robust&mode=${mode}&qpp=4&assetBase=off&prewarm=0&snapshotCache=0`;

test('태그 짝이 안 맞는 문항은 알림으로만 남고 시험지·해설지(E·M)는 그대로 열린다', async t => {
  await withBrowser(t, async (browser, origin) => {
    for (const engine of ['E', 'M']) for (const mode of ['exam', 'sol']) {
      const { context, page } = await openPage(browser, origin);
      if (engine === 'M') await seedMixed(page, origin, HTML);
      await page.goto(urlFor(origin, engine, HTML, mode));
      const view = await snapshot(page);
      const where = `${engine} ${mode}`;
      assert.equal(view.error, null, where);
      assert.equal(view.ready, 'true', where);
      assert.deepEqual(view.numbers, ALL, where);
      assert.equal(view.layout, null, where);
      assert.deepEqual(view.diagnostics, [], where + ': 알림은 오류 배열에 넣지 않는다');
      const warns = view.report.entries.filter(entry => entry.code === 'HTML_UNBALANCED').map(entry => entry.questionNo).sort((a, b) => a - b);
      assert.deepEqual(warns, mode === 'exam' ? [3, 6] : [3, 6, 7], where);
      assert.ok(view.report.entries.every(entry => entry.severity === 'warn' && entry.stage && entry.message), where);
      assert.ok(view.noticeVisible && /3번/.test(view.noticeText) && /6번/.test(view.noticeText), where + ': ' + view.noticeText);
      await context.close();
    }
  });
});

test('MathJax가 끝없이 멈춰도 예산 뒤 ready가 나고 시간 초과 알림이 남는다 (E·M 시험지)', async t => {
  await withBrowser(t, async (browser, origin) => {
    for (const engine of ['E', 'M']) {
      const { context, page } = await openPage(browser, origin);
      await page.addInitScript(() => {
        window.__AP_TYPESET_BUDGET_MS__ = 1500;
        // MathJax가 읽히면 조판 호출을 끝나지 않는 약속으로 바꾼다(시험용 고장 주입).
        const timer = setInterval(() => {
          if (window.MathJax?.typesetPromise && !window.MathJax.__hung) {
            window.MathJax.__hung = true;
            window.MathJax.typesetPromise = () => new Promise(() => {});
            clearInterval(timer);
          }
        }, 5);
      });
      if (engine === 'M') await seedMixed(page, origin, OK);
      await page.goto(urlFor(origin, engine, OK, 'exam'));
      const view = await snapshot(page);
      assert.equal(view.error, null, engine);
      assert.equal(view.ready, 'true', engine);
      assert.deepEqual(view.numbers, ALL, engine);
      const budget = view.report.entries.filter(entry => entry.code === 'RENDER_TIME_BUDGET');
      assert.ok(budget.length >= 1 && budget[0].severity === 'warn' && /typeset/.test(budget[0].excerpt), engine + ': ' + JSON.stringify(view.report.entries));
      await context.close();
    }
  });
});
