'use strict';

// 한 문항이 사다리(글자·그림 줄이기 -> 한 단 전체)를 다 거치고도 쪽에 안 들어가도, 시험지·해설지 전체가 막히지 않는다 (2026-11-23,
// 사용자 원칙 "한 문항 때문에 인쇄가 실패되는 경우는 없어야 한다. 그걸 제외한 나머지 문항은 떠야 한다").
// 이전에는 70줄짜리 문항 하나가 engine.html 시험지를 SNAPSHOT_COMMON_HARD_GATE:S12(0쪽), engine.html 해설지를 MEASURED_SOLUTION_CHUNK_EXCEEDS_PAGE(0쪽),
// mixed_engine.html 시험지·해설지를 인쇄 사전 점검(layout overflow / content clipped) 실패로 만들었다.
// 1) 소스 계약(항상 실행): 같은 진단 파일·실행기를 두 출력 화면이 같은 ?v=로 불러온다.
// 2) 실제 Chrome(playwright와 Chrome이 있을 때만; 없으면 NOT_RUN으로 건너뜀): 4개 경로(E·M x 시험지·해설지)에서 ready가 나고, 나머지 문항이 모두 그려지고,
//    그 문항 하나만 번호가 남은 자리 표시가 되고, 진단 객체·알림 띠·복사 글에 그 문항이 찍히고, 인쇄 사전 점검(assertLayoutReady)이 통과한다.
//    결함 없는 시험지에서는 자리 표시·띠·진단이 없다. 시험지의 특정 글자·해시·개수는 고정하지 않고 성질만 본다.
//    "Archive Output Performance" 워크플로에서는 ARCHIVE_ONE_ITEM_REQUIRE_BROWSER=1로 Chrome 없음을 실패로 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const MIME = { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const TALL = 'engine-robust-tall.js';
const OK = 'engine-robust-ok.js';
const ALL = [1, 2, 3, 4, 5, 6, 7, 8];

test('두 출력 화면이 같은 진단·배치 파일을 같은 ?v=로 불러온다', () => {
  const versions = (html, names) => names.map(name => (new RegExp(`<script src="${name.replace('.', '\\.')}\\?v=([^"]+)"`).exec(read(html)) || [])[1]);
  const names = ['render-diagnostics.js', 'equal-slot-engine.js', 'exam-render-executor.js', 'solution-render-executor.js', 'screen-runtime.js'];
  const engine = versions('archive/engine.html', names);
  const mixed = versions('archive/mixed_engine.html', names);
  assert.ok(engine.every(Boolean), 'engine.html must load all files');
  assert.deepEqual(engine, mixed, 'engine.html and mixed_engine.html must use one ?v= per file');
  const diagnostics = read('archive/render-diagnostics.js');
  for (const name of ['guardOverflow', 'replaceUnfit', 'apRenderReport', 'LAYOUT_CANNOT_FIT']) assert.ok(diagnostics.includes(name), name);
  for (const file of ['archive/equal-slot-engine.js', 'archive/exam-render-executor.js', 'archive/solution-render-executor.js', 'archive/layout-materializer.js']) {
    assert.match(read(file), /APRenderDiagnostics\??\.guardOverflow/, `${file}: 쪽을 넘치는 문항만 자리 표시로 바꾸는 안전망을 부른다`);
  }
});

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (pathname === '/__seed.html') { res.writeHead(200, { 'content-type': MIME['.html'] }); return res.end('<!doctype html><title>seed</title>'); }
      // 작은 가짜 시험지는 tests/fixtures에 두고, 엔진이 읽는 exams/ 아래 주소로 보여 준다.
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

async function snapshot(page) {
  await page.waitForFunction(() => document.documentElement.dataset.apRenderReady === 'true' || document.documentElement.dataset.apRenderError, null, { timeout: 60000 });
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const area = document.getElementById('print-area');
    const notice = document.getElementById('ap-render-notice');
    const layout = (() => { try { window.Archive2PdfReadiness.assertLayoutReady(); return null; } catch (error) { return String(error.message); } })();
    const unfit = [...area.querySelectorAll('[data-ap-unfit]')].map(box => ({ no: parseInt(box.querySelector('.q-num')?.textContent, 10), note: box.querySelector('.ap-unfit')?.textContent || '' }));
    return {
      ready: document.documentElement.dataset.apRenderReady, error: document.documentElement.dataset.apRenderError || null,
      pages: area.querySelectorAll('.page').length,
      numbers: [...new Set([...area.querySelectorAll('.q-num')].map(node => parseInt(node.textContent, 10)).filter(Number.isFinite))].sort((a, b) => a - b),
      diagnostics: window.apRenderDiagnostics, report: window.apRenderReport, reportText: window.apRenderReportText ? window.apRenderReportText() : '',
      warnings: document.documentElement.dataset.apRenderWarnings, unfit, layout,
      noticeVisible: !!notice && !notice.hidden && getComputedStyle(notice).display !== 'none', noticeText: notice?.textContent || '',
      hasCopy: !!notice?.querySelector('.ap-render-notice__copy')
    };
  });
}

async function seedMixed(page, origin, key, file) {
  const sandbox = { window: {} };
  vm.runInNewContext(read('tests/fixtures/' + file), sandbox);
  const questions = sandbox.window.questionBank.map((question, index) => ({ ...question, sourceArchiveFile: `exams/_fixture/${file}`, sourceOrdinal: index + 1 }));
  await page.goto(`${origin}/__seed.html`);
  await page.evaluate(({ qs, key }) => {
    localStorage.setItem('mixedQuestions_' + key, JSON.stringify(qs));
    localStorage.setItem('mixedMeta_' + key, JSON.stringify({ title: 'engine-robust', qpp: 4, count: qs.length }));
  }, { qs: questions, key });
}

function urlFor(origin, engine, file, mode) {
  return engine === 'E'
    ? `${origin}/archive/engine.html?data=exams/_fixture/${file}&mode=${mode}&assetBase=off`
    : `${origin}/archive/mixed_engine.html?key=robust&mode=${mode}&qpp=4&assetBase=off&prewarm=0&snapshotCache=0`;
}

for (const engine of ['E', 'M']) {
  for (const mode of ['exam', 'sol']) {
    const label = `${engine === 'E' ? 'engine.html(원본 열기)' : 'mixed_engine.html(문제지 만들기)'} ${mode === 'exam' ? '시험지' : '해설지'}`;
    test(`${label}: 한 문항이 쪽에 안 들어가도 나머지는 뜨고 그 문항만 자리 표시가 된다`, async t => {
      await withBrowser(t, async (browser, origin) => {
        const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'block' });
        await context.route('**/*', route => (route.request().url().startsWith(origin) ? route.fallback() : route.abort())); // 외부 주소는 막는다(느린 외부 요청으로 흔들리지 않게)
        const page = await context.newPage();
        await page.addInitScript(() => { window.print = () => {}; });
        if (engine === 'M') await seedMixed(page, origin, 'robust', TALL);
        await page.goto(urlFor(origin, engine, TALL, mode));
        const view = await snapshot(page);
        assert.equal(view.error, null, 'whole-failure flag must stay empty');
        assert.equal(view.ready, 'true', 'ready는 실패한 문항이 있어도 반드시 난다');
        assert.ok(view.pages > 0);
        assert.deepEqual(view.numbers, ALL, '모든 문항이 번호와 칸을 지킨다');
        assert.equal(view.layout, null, '인쇄 사전 점검(쪽 넘침·잘림)이 통과한다: ' + view.layout);
        // 자리 표시는 그 문항 하나뿐이고, 번호와 안내 문구가 있다
        assert.equal(view.unfit.length, 1);
        assert.equal(view.unfit[0].no, 5);
        assert.match(view.unfit[0].note, /너무 길어/);
        // 진단 한 객체: window.apRenderDiagnostics(오류)와 apRenderReport(전부) 모두에 그 문항이 사유 코드와 함께 찍힌다
        assert.equal(view.diagnostics.length, 1);
        const entry = view.diagnostics[0];
        assert.equal(entry.questionNo, 5);
        assert.equal(entry.code, 'LAYOUT_CANNOT_FIT');
        assert.equal(entry.stage, '배치');
        assert.equal(entry.severity, 'error');
        assert.ok(entry.message && entry.file.endsWith(TALL), 'one-line reason and file path');
        assert.equal(view.report.mode, mode);
        assert.equal(view.report.viewport.width, 1366);
        assert.equal(view.report.entries.length, 1);
        assert.ok(view.report.engine.includes('render-diagnostics'));
        // 알림 띠와 복사 글에 파일·문항 번호·사유 코드·엔진 판본·모드·화면 폭이 들어간다
        assert.ok(view.noticeVisible && view.hasCopy && /5번 문항/.test(view.noticeText), 'band names the question and has a copy button');
        for (const piece of [TALL, '5번', 'LAYOUT_CANNOT_FIT', 'render-diagnostics', `모드 ${mode}`, '화면 폭 1366px']) assert.ok(view.reportText.includes(piece), `copy text has ${piece}`);
        await context.close();
      });
    });
  }
}

test('결함이 없는 시험지에는 자리 표시·알림 띠·진단이 없다 (E·M, 시험지·해설지)', async t => {
  await withBrowser(t, async (browser, origin) => {
    for (const engine of ['E', 'M']) for (const mode of ['exam', 'sol']) {
      const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'block' });
        await context.route('**/*', route => (route.request().url().startsWith(origin) ? route.fallback() : route.abort())); // 외부 주소는 막는다(느린 외부 요청으로 흔들리지 않게)
      const page = await context.newPage();
      if (engine === 'M') await seedMixed(page, origin, 'robust', OK);
      await page.goto(urlFor(origin, engine, OK, mode));
      const view = await snapshot(page);
      const where = `${engine} ${mode}`;
      assert.equal(view.error, null, where);
      assert.deepEqual(view.numbers, ALL, where);
      assert.equal(view.layout, null, where);
      assert.deepEqual(view.unfit, [], where);
      assert.deepEqual(view.diagnostics, [], where);
      assert.equal(view.report.entries.length, 0, where);
      assert.equal(view.warnings, '0', where);
      assert.equal(view.noticeVisible, false, where);
      await context.close();
    }
  });
});
