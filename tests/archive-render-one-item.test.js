'use strict';

// 문항 하나의 수식 오류가 시험지·해설지·정답표 전체를 막지 않는다 (2026-11-23, 사용자 원칙 "한 문항 때문에 인쇄가 실패되는 경우는 없어야").
// 1) 소스 계약(항상 실행): 두 출력 HTML이 같은 진단 파일을 같은 ?v=로 불러온다.
// 2) 실제 Chrome(playwright와 Chrome이 있을 때만; 없으면 건너뜀 = NOT_RUN): 오류 수식이 있는 시험지에서
//    ready가 나고, 쪽 수 > 0이고, 진단 배열에 그 문항 번호가 있고, 다른 문항 수식은 정상이며, 인쇄 사전 점검이 통과한다.
//    "Archive Output Performance" 워크플로에서는 ARCHIVE_ONE_ITEM_REQUIRE_BROWSER=1로 Chrome 없음을 실패로 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const FIXTURE = 'exams/test-fixtures/render-one-item-fault.js';
const MIME = { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };

test('두 출력 화면이 같은 render-diagnostics.js를 같은 ?v=로 불러온다', () => {
  const versions = html => {
    const text = read(html);
    const pick = name => (new RegExp(`<script src="${name}\\?v=([^"]+)"`).exec(text) || [])[1];
    return { diag: pick('render-diagnostics\\.js'), loop: pick('mathjax_render_loop\\.js') };
  };
  const engine = versions('archive/engine.html');
  const mixed = versions('archive/mixed_engine.html');
  assert.ok(engine.diag && engine.loop, 'engine.html must load both files');
  assert.deepEqual(engine, mixed, 'engine.html and mixed_engine.html must use one ?v= per file');
  assert.ok(read('archive/render-diagnostics.js').includes('apRenderDiagnostics'));
});

test('감지(mjx-merror·남은 $ 검사)는 그대로 남아 있다', () => {
  assert.match(read('archive/screen-runtime-adapter.js'), /querySelector\('mjx-merror'\)\) throw new Error\('MATH_TYPESET_ERROR'\)/);
  assert.match(read('archive/common-fast-runtime.js'), /querySelector\('mjx-merror'\)\) throw Error\('MATH_TYPESET_ERROR'\)/);
  assert.match(read('archive/equal-slot-engine.js'), /querySelector\('mjx-merror'\)\) throw failure\('EQUAL_SLOT_MATH_ERROR'\)/);
  assert.match(read('archive/common-fast-runtime.js'), /MATH_TYPESET_INCOMPLETE/);
});

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (pathname === '/__seed.html') { res.writeHead(200, { 'content-type': MIME['.html'] }); return res.end('<!doctype html><title>seed</title>'); }
      const file = path.resolve(root, '.' + pathname);
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

async function snapshot(page) {
  await page.waitForFunction(() => document.documentElement.dataset.apRenderReady === 'true' || document.documentElement.dataset.apRenderError, null, { timeout: 60000 });
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const pages = [...document.querySelectorAll('#print-area .page')];
    const boxes = [...document.querySelectorAll('#print-area .q-box')];
    const numbers = new Set([...document.querySelectorAll('#print-area .q-num')].map(node => parseInt(node.textContent, 10)).filter(Number.isFinite));
    const box = no => boxes.find(node => parseInt(node.querySelector('.q-num')?.textContent, 10) === no);
    const notice = document.getElementById('ap-render-notice');
    return {
      ready: document.documentElement.dataset.apRenderReady, error: document.documentElement.dataset.apRenderError || null,
      pages: pages.length, numbers: [...numbers].sort((a, b) => a - b),
      diagnostics: window.apRenderDiagnostics, merror: document.querySelectorAll('#print-area mjx-merror').length,
      markers: [...document.querySelectorAll('#print-area span.ap-math-error')].map(node => ({ no: parseInt(node.closest('.q-box')?.querySelector('.q-num')?.textContent, 10), text: node.textContent })),
      mathCounts: Object.fromEntries([1, 2, 3, 5].map(no => [no, box(no)?.querySelectorAll('mjx-container').length || 0])),
      noticeVisible: !!notice && !notice.hidden && getComputedStyle(notice).display !== 'none', noticeText: notice?.textContent || ''
    };
  });
}

const ALL = Array.from({ length: 16 }, (_, index) => index + 1);
const keyOf = entries => entries.map(({ questionNo, part, code }) => `${questionNo}:${part}:${code}`).sort();

test('오류 수식 하나가 있어도 원본 열기(engine.html)가 시험지·해설지·정답표를 모두 연다', async t => {
  const launched = await launch();
  if (!launched.browser) {
    assert.ok(process.env.ARCHIVE_ONE_ITEM_REQUIRE_BROWSER !== '1', 'Chrome required: ' + launched.reason);
    t.skip('NOT_RUN: ' + launched.reason);
    return;
  }
  const { browser } = launched;
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = mode => `${origin}/archive/engine.html?data=${FIXTURE}&mode=${mode}&assetBase=off`;
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => { window.print = () => { window.__printCalls = (window.__printCalls || 0) + 1; }; });

    // 시험지: 4번 본문 수식 오류 하나
    await page.goto(url('exam'));
    const exam = await snapshot(page);
    assert.equal(exam.error, null, 'whole-failure flag must stay empty');
    assert.equal(exam.ready, 'true');
    assert.ok(exam.pages > 0);
    assert.deepEqual(exam.numbers, ALL, 'every question keeps its box');
    assert.deepEqual(keyOf(exam.diagnostics), ['4:본문:MATH_TYPESET_ERROR']);
    assert.equal(exam.diagnostics[0].file, FIXTURE);
    assert.match(exam.diagnostics[0].excerpt, /boxed\{k&=-4\}/);
    assert.equal(exam.merror, 0);
    assert.deepEqual(exam.markers.map(marker => marker.no), [4]);
    assert.match(exam.markers[0].text, /수식 오류/);
    assert.match(exam.markers[0].text, /boxed\{k&=-4\}/, 'the TeX source stays visible');
    for (const no of [1, 2, 3, 5]) assert.ok(exam.mathCounts[no] > 0, `question ${no} math must render normally`);
    assert.ok(exam.noticeVisible && /4번 본문/.test(exam.noticeText), 'notice band names question and part');

    // 인쇄 사전 점검은 약해지지 않는다: 표식이 붙은 준비 스냅숏이 그대로 통과하고 safePrint가 인쇄까지 간다
    const printed = await page.evaluate(async () => {
      const runtime = window.archiveScreenRuntime;
      const preflight = window.APArchiveSnapshotContract.preflight(runtime.activeSnapshot, runtime.committedCandidate);
      window.bindArchiveRuntimePrintReadiness();
      await window.safePrint('vector');
      return { pass: preflight.pass, failed: Object.keys(preflight.gates).filter(key => !preflight.gates[key]), printCalls: window.__printCalls || 0 };
    });
    assert.deepEqual(printed, { pass: true, failed: [], printCalls: 1 });
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.getElementById('ap-render-notice')).display), 'none', 'band is not printed');
    await page.emulateMedia({ media: 'screen' });

    // 해설지: 2번 해설·4번 본문(문제 다시보기)·6번 해설(괄호 짝이 안 맞는 $$)
    await page.goto(url('sol'));
    const sol = await snapshot(page);
    assert.equal(sol.error, null);
    assert.equal(sol.ready, 'true');
    assert.ok(sol.pages > 0);
    assert.deepEqual(sol.numbers, ALL);
    assert.deepEqual(keyOf(sol.diagnostics), ['2:해설:MATH_TYPESET_ERROR', '4:본문:MATH_TYPESET_ERROR', '6:해설:MATH_UNRENDERED']);
    assert.equal(sol.merror, 0);
    for (const no of [1, 3, 5]) assert.ok(sol.mathCounts[no] > 0, `solution ${no} math must render normally`);
    assert.ok(sol.noticeVisible && /수식 3개/.test(sol.noticeText) && /2번 해설/.test(sol.noticeText) && /6번 해설/.test(sol.noticeText));
    // 띠의 항목을 누르면 그 표식으로 이동한다(표식에 강조가 붙는다)
    await page.click('#ap-render-notice .ap-render-notice__item >> nth=0');
    assert.equal(await page.evaluate(() => document.querySelectorAll('.ap-math-error--flash').length), 1);

    // 쪽 안 모드 전환(스냅숏 재사용 경로)에서도 진단과 띠가 그 모드에 맞게 바뀐다
    const switched = await page.evaluate(async () => {
      const result = [];
      for (const mode of ['exam', 'sol']) {
        const outcome = await window.switchMode(mode);
        result.push({ mode, ok: outcome?.ok !== false, count: (window.apRenderDiagnostics || []).length, error: document.documentElement.dataset.apRenderError || null });
      }
      return result;
    });
    assert.deepEqual(switched, [{ mode: 'exam', ok: true, count: 1, error: null }, { mode: 'sol', ok: true, count: 3, error: null }]);

    // 정답표: 수식이 없으므로 표식·띠 없음
    await page.goto(url('ans'));
    const ans = await snapshot(page);
    assert.equal(ans.error, null);
    assert.ok(ans.pages > 0);
    assert.deepEqual(ans.diagnostics, []);
    assert.equal(ans.noticeVisible, false);
    await context.close();
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
});

test('오류 수식 하나가 있어도 문제지 만들기 출력(mixed_engine.html)이 시험지·해설지를 연다', async t => {
  const launched = await launch();
  if (!launched.browser) {
    assert.ok(process.env.ARCHIVE_ONE_ITEM_REQUIRE_BROWSER !== '1', 'Chrome required: ' + launched.reason);
    t.skip('NOT_RUN: ' + launched.reason);
    return;
  }
  const { browser } = launched;
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const vm = require('node:vm');
  const context0 = { window: {} };
  vm.runInNewContext(read('archive/' + FIXTURE), context0);
  const questions = context0.window.questionBank.map((question, index) => ({ ...question, sourceArchiveFile: FIXTURE, sourceOrdinal: index + 1 }));
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${origin}/__seed.html`);
    await page.evaluate(({ qs }) => {
      localStorage.setItem('mixedQuestions_oneitem', JSON.stringify(qs));
      localStorage.setItem('mixedMeta_oneitem', JSON.stringify({ title: 'one-item', qpp: 4, count: qs.length }));
    }, { qs: questions });
    for (const [mode, expected] of [['exam', ['4:본문:MATH_TYPESET_ERROR']], ['sol', ['2:해설:MATH_TYPESET_ERROR', '4:본문:MATH_TYPESET_ERROR', '6:해설:MATH_UNRENDERED']]]) {
      await page.goto(`${origin}/archive/mixed_engine.html?key=oneitem&mode=${mode}&qpp=4&assetBase=off&prewarm=0&snapshotCache=0`);
      const row = await snapshot(page);
      assert.equal(row.error, null, mode);
      assert.equal(row.ready, 'true', mode);
      assert.ok(row.pages > 0, mode);
      assert.deepEqual(row.numbers, ALL, mode);
      assert.deepEqual(keyOf(row.diagnostics), expected, mode);
      assert.equal(row.merror, 0, mode);
      assert.ok(row.noticeVisible, mode);
    }
    await context.close();
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
});
