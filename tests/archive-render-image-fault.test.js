'use strict';

// 그림 하나가 안 받아져도(404·네트워크 실패·시간 초과) 시험지·해설지 전체가 막히지 않는다 (2026-11-23, 사용자 원칙
// "한 문항 때문에 인쇄가 실패되는 경우는 없어야 한다. 그걸 제외한 나머지 문항은 떠야 한다").
// 수식 오류 한 문항 처리(tests/archive-render-one-item.test.js)와 같은 진단 객체·같은 알림 띠를 쓴다.
// 1) 소스·단위 계약(항상 실행): 두 출력 HTML이 같은 파일을 같은 ?v=로 불러오고, waitForImages의 onFailure가 처리한 그림은
//    던지지 않으며 처리하지 못한 그림은 예전처럼 던진다.
// 2) 실제 Chrome(playwright와 Chrome이 있을 때만; 없으면 NOT_RUN으로 건너뜀): 그림 하나가 404일 때 ready가 나고, 나머지 문항이 그려지고,
//    그 자리에 표식이 있고, 진단 배열·띠에 그 문항이 나오고, 인쇄 사전 점검이 통과한다. 그림이 모두 정상이면 표식·띠가 없다.
//    "Archive Output Performance" 워크플로에서는 ARCHIVE_ONE_ITEM_REQUIRE_BROWSER=1로 Chrome 없음을 실패로 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const readiness = require('../archive/question-image-readiness.js');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const FIXTURE = 'exams/test-fixtures/render-image-fault.js';
const MIME = { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const BROKEN = /missing-(image-q2|inline-q4|solution-q5)\.png/;

test('두 출력 화면이 같은 진단·그림 대기 파일을 같은 ?v=로 불러온다', () => {
  const versions = html => {
    const text = read(html);
    const pick = name => (new RegExp(`<script src="${name}\\?v=([^"]+)"`).exec(text) || [])[1];
    return ['render-diagnostics', 'question-image-readiness', 'equal-slot-engine'].map(name => pick(`${name}\\.js`));
  };
  const engine = versions('archive/engine.html');
  const mixed = versions('archive/mixed_engine.html');
  assert.ok(engine.every(Boolean), 'engine.html must load all three files');
  assert.deepEqual(engine, mixed, 'engine.html and mixed_engine.html must use one ?v= per file');
  assert.ok(read('archive/render-diagnostics.js').includes('replaceImage'));
  for (const html of ['archive/engine.html', 'archive/mixed_engine.html']) {
    const text = read(html);
    assert.match(text, /onFailure: recoverFailedQuestionImage/, `${html}: 대기 단계가 실패한 그림을 표식으로 바꾼다`);
    assert.match(text, /if \(recoverFailedQuestionImage\(img, result\)\) return result;/, `${html}: 해설 그림 한 장 대기도 같다`);
    assert.match(text, /failureCodes: \{ error: 'QUESTION_IMAGE_LOAD_FAILED', timeout: 'QUESTION_IMAGE_READINESS_INCOMPLETE' \}/, `${html}: 실패 코드는 그대로`);
  }
});

function fakeImage(state) {
  const listeners = {};
  return {
    complete: true, naturalWidth: 100, naturalHeight: 50, ...state,
    getAttribute: () => '', setAttribute() {},
    addEventListener(name, fn) { listeners[name] = fn; },
    removeEventListener(name) { delete listeners[name]; }
  };
}

test('waitForImages: onFailure가 처리한 그림은 던지지 않고, 처리하지 못한 그림이 남으면 예전처럼 던진다', async () => {
  const good = fakeImage({});
  const broken = fakeImage({ naturalWidth: 0, naturalHeight: 0 });
  const stuck = fakeImage({ complete: false, naturalWidth: 0, naturalHeight: 0 });
  const codes = { error: 'QUESTION_IMAGE_LOAD_FAILED', timeout: 'QUESTION_IMAGE_READINESS_INCOMPLETE' };

  const seen = [];
  const handled = await readiness.waitForImages([good, broken, stuck], {
    timeoutMs: 20, failureCodes: codes, throwOnFailure: true,
    onFailure: (image, result) => { seen.push([image === broken ? 'broken' : image === stuck ? 'stuck' : 'good', result.status]); return true; }
  });
  assert.deepEqual(seen, [['broken', 'error'], ['stuck', 'timeout']], '오류와 시간 초과를 같게 처리한다');
  assert.equal(handled.recovered, 2);
  assert.equal(handled.summary.loaded, 1);

  await assert.rejects(
    readiness.waitForImages([good, broken], { failureCodes: codes, onFailure: () => false }),
    error => error.code === 'QUESTION_IMAGE_LOAD_FAILED', '처리하지 못하면 던진다');
  await assert.rejects(
    readiness.waitForImages([broken], { failureCodes: codes, onFailure: () => { throw new Error('boom'); } }),
    error => error.code === 'QUESTION_IMAGE_LOAD_FAILED', 'onFailure가 예외를 던져도 조용히 성공하지 않는다');
  await assert.rejects(
    readiness.waitForImages([stuck], { timeoutMs: 20, failureCodes: codes }),
    error => error.code === 'QUESTION_IMAGE_READINESS_INCOMPLETE', 'onFailure가 없으면 기존 동작 그대로');
  const aborted = new AbortController();
  aborted.abort();
  await assert.rejects(readiness.waitForImages([broken], { signal: aborted.signal, onFailure: () => true }), error => error.code === 'DISCARDED_STALE');
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
    const area = document.getElementById('print-area');
    const notice = document.getElementById('ap-render-notice');
    const boxOf = node => node.closest('.q-box');
    return {
      ready: document.documentElement.dataset.apRenderReady, error: document.documentElement.dataset.apRenderError || null,
      pages: area.querySelectorAll('.page').length,
      numbers: [...new Set([...area.querySelectorAll('.q-num')].map(node => parseInt(node.textContent, 10)).filter(Number.isFinite))].sort((a, b) => a - b),
      diagnostics: window.apRenderDiagnostics,
      markers: [...area.querySelectorAll('.ap-image-missing')].map(node => ({ no: parseInt(boxOf(node)?.querySelector('.q-num')?.textContent, 10), text: node.textContent, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })),
      loadedImages: [...area.querySelectorAll('img')].filter(img => img.complete && img.naturalWidth > 0).length,
      brokenImages: [...area.querySelectorAll('img')].filter(img => !(img.complete && img.naturalWidth > 0)).length,
      mathBroken: area.querySelectorAll('mjx-merror').length,
      noticeVisible: !!notice && !notice.hidden && getComputedStyle(notice).display !== 'none', noticeText: notice?.textContent || ''
    };
  });
}

const ALL = [1, 2, 3, 4, 5, 6];
const keyOf = entries => entries.map(({ questionNo, part, code }) => `${questionNo}:${part}:${code}`).sort();
const LOAD_FAILED = 'QUESTION_IMAGE_LOAD_FAILED';

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

test('그림 하나가 404여도 원본 열기(engine.html)가 시험지·해설지·정답표를 모두 연다', async t => {
  await withBrowser(t, async (browser, origin) => {
    const url = mode => `${origin}/archive/engine.html?data=${FIXTURE}&mode=${mode}&assetBase=off`;
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => { window.print = () => { window.__printCalls = (window.__printCalls || 0) + 1; }; });

    // 그림이 모두 정상이면 화면·진단은 예전과 같다(표식·띠 없음)
    await page.route(BROKEN, route => route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL }));
    await page.goto(url('exam'));
    const healthy = await snapshot(page);
    assert.equal(healthy.error, null);
    assert.equal(healthy.ready, 'true');
    assert.deepEqual(healthy.numbers, ALL);
    assert.deepEqual(healthy.diagnostics, []);
    assert.deepEqual(healthy.markers, []);
    assert.equal(healthy.brokenImages, 0);
    assert.equal(healthy.noticeVisible, false);
    await page.unroute(BROKEN);

    // 시험지: 2번 문제 그림 · 4번 본문 안 그림이 404
    await page.route(BROKEN, route => route.fulfill({ status: 404, body: 'nope' }));
    await page.goto(url('exam'));
    const exam = await snapshot(page);
    assert.equal(exam.error, null, 'whole-failure flag must stay empty');
    assert.equal(exam.ready, 'true');
    assert.ok(exam.pages > 0);
    assert.deepEqual(exam.numbers, ALL, 'every question keeps its number and box');
    assert.deepEqual(keyOf(exam.diagnostics), [`2:문제 그림:${LOAD_FAILED}`, `4:문제 그림:${LOAD_FAILED}`]);
    assert.equal(exam.diagnostics[0].file, FIXTURE);
    assert.match(exam.diagnostics.find(entry => entry.questionNo === 2).excerpt, /missing-image-q2\.png$/);
    assert.deepEqual(exam.markers.map(marker => marker.no).sort(), [2, 4]);
    assert.ok(exam.markers.every(marker => /그림을 불러오지 못했습니다/.test(marker.text) && marker.width > 20 && marker.height > 10), 'the blank box has a real size');
    assert.equal(exam.loadedImages, 1, '3번의 정상 그림은 그대로 보인다');
    assert.equal(exam.brokenImages, 0, '깨진 <img>가 남지 않는다');
    assert.ok(exam.mathBroken === 0 && exam.noticeVisible && /2번 문제 그림 1개/.test(exam.noticeText) && /4번 문제 그림 1개/.test(exam.noticeText), 'notice band names the questions');

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
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.ap-image-missing')).display !== 'none'), true, 'the box itself is printed');
    await page.emulateMedia({ media: 'screen' });

    // 해설지: 4번 본문 그림(문제 다시보기) · 5번 해설 그림
    await page.goto(url('sol'));
    const sol = await snapshot(page);
    assert.equal(sol.error, null);
    assert.equal(sol.ready, 'true');
    assert.deepEqual(sol.numbers, ALL);
    assert.deepEqual(keyOf(sol.diagnostics), [`4:문제 그림:${LOAD_FAILED}`, `5:해설 그림:${LOAD_FAILED}`]);
    assert.equal(sol.brokenImages, 0);
    assert.ok(sol.noticeVisible && /5번 해설 그림 1개/.test(sol.noticeText));
    await page.click('#ap-render-notice .ap-render-notice__item >> nth=0');
    assert.equal(await page.evaluate(() => document.querySelectorAll('.ap-math-error--flash').length), 1, '띠의 항목을 누르면 그 자리로 이동·강조한다');

    // 쪽 안 모드 전환(스냅숏 재사용 경로)에서도 진단과 띠가 그 모드에 맞게 바뀐다
    const switched = await page.evaluate(async () => {
      const result = [];
      for (const mode of ['exam', 'sol']) {
        const outcome = await window.switchMode(mode);
        result.push({ mode, ok: outcome?.ok !== false, count: (window.apRenderDiagnostics || []).length, error: document.documentElement.dataset.apRenderError || null });
      }
      return result;
    });
    assert.deepEqual(switched, [{ mode: 'exam', ok: true, count: 2, error: null }, { mode: 'sol', ok: true, count: 2, error: null }]);

    // 정답표: 그림이 없으므로 표식·띠 없음
    await page.goto(url('ans'));
    const ans = await snapshot(page);
    assert.equal(ans.error, null);
    assert.ok(ans.pages > 0);
    assert.deepEqual(ans.diagnostics, []);
    assert.equal(ans.noticeVisible, false);
    await context.close();
  });
});

test('그림이 시간 안에 오지 않아도(응답 없음) 같은 표식으로 계속한다', async t => {
  await withBrowser(t, async (browser, origin) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    // 2번 그림은 끝내 응답하지 않는다(기존 그림 대기 시간 제한이 끝나면 실패로 보고 계속), 나머지는 정상
    await page.route(/missing-image-q2\.png/, () => {});
    await page.route(/missing-(inline-q4|solution-q5)\.png/, route => route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL }));
    await page.goto(`${origin}/archive/engine.html?data=${FIXTURE}&mode=exam&assetBase=off`);
    const exam = await snapshot(page);
    assert.equal(exam.error, null);
    assert.equal(exam.ready, 'true');
    assert.deepEqual(exam.numbers, ALL);
    assert.deepEqual(keyOf(exam.diagnostics), ['2:문제 그림:QUESTION_IMAGE_READINESS_INCOMPLETE']);
    assert.equal(exam.brokenImages, 0);
    assert.ok(exam.noticeVisible && /2번 문제 그림 1개/.test(exam.noticeText));
    await context.close();
  });
});

test('그림 하나가 404여도 문제지 만들기 출력(mixed_engine.html)이 시험지·해설지를 연다', async t => {
  await withBrowser(t, async (browser, origin) => {
    const context0 = { window: {} };
    vm.runInNewContext(read('archive/' + FIXTURE), context0);
    const questions = context0.window.questionBank.map((question, index) => ({ ...question, sourceArchiveFile: FIXTURE, sourceOrdinal: index + 1 }));
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${origin}/__seed.html`);
    await page.evaluate(({ qs }) => {
      localStorage.setItem('mixedQuestions_imgfault', JSON.stringify(qs));
      localStorage.setItem('mixedMeta_imgfault', JSON.stringify({ title: 'img-fault', qpp: 4, count: qs.length }));
    }, { qs: questions });
    await page.route(BROKEN, route => route.fulfill({ status: 404, body: 'nope' }));
    for (const [mode, expected] of [['exam', [`2:문제 그림:${LOAD_FAILED}`, `4:문제 그림:${LOAD_FAILED}`]], ['sol', [`4:문제 그림:${LOAD_FAILED}`, `5:해설 그림:${LOAD_FAILED}`]]]) {
      await page.goto(`${origin}/archive/mixed_engine.html?key=imgfault&mode=${mode}&qpp=4&assetBase=off&prewarm=0&snapshotCache=0`);
      const row = await snapshot(page);
      assert.equal(row.error, null, mode);
      assert.equal(row.ready, 'true', mode);
      assert.ok(row.pages > 0, mode);
      assert.deepEqual(row.numbers, ALL, mode);
      assert.deepEqual(keyOf(row.diagnostics), expected, mode);
      assert.equal(row.brokenImages, 0, mode);
      assert.ok(row.noticeVisible, mode);
    }
    await context.close();
  });
});
