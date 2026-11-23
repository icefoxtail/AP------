'use strict';

// 오답 인쇄 엔진(apmath/wrong_print_engine.html)도 문항 하나의 수식 오류 때문에 학생의 오답지 전체가 막히지 않는다
// (2026-11-23, 사용자 원칙 "한 문항 때문에 인쇄가 실패되는 경우는 없어야"). #2687이 engine.html·mixed_engine.html에 넣은 같은 모듈
// (archive/render-diagnostics.js)을 오답 엔진이 불러 쓴다. 두 번째 구현은 없다.
// 1) 소스 계약(항상 실행): 같은 진단 파일·같은 ?v=, 오답 엔진에 수식 오류 처리 코드가 따로 없음.
// 2) 실제 Chrome(playwright와 Chrome이 있을 때만, 없으면 건너뜀 = NOT_RUN. "Archive Output Performance"는 ARCHIVE_ONE_ITEM_REQUIRE_BROWSER=1):
//    오류 수식이 든 문항이 섞인 여러 학생의 오답지가 열리고(시험지·해설지·복습지, 옛 방식 포함), 그 문항만 표식·띠·진단 배열에 학생과 원본 문항으로
//    나타나고, 인쇄 준비(clinicSafePrint)까지 가며, 오류 없는 오답지에는 표식·띠가 없다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const FAULT = 'exams/test-fixtures/render-one-item-fault.js';
const CLEAN_FILE = 'tests/fixtures/wrong-print-overflow-bank.js';
const MIME = { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };

test('오답 엔진이 engine.html·mixed_engine.html과 같은 진단 파일을 같은 ?v=로 불러온다', () => {
  const wrong = read('apmath/wrong_print_engine.html');
  const pick = (text, name, prefix) => (new RegExp(`<script src="${prefix}${name}\\?v=([^"]+)"`).exec(text) || [])[1];
  for (const [name, html] of [['render-diagnostics\\.js', 'archive/engine.html'], ['mathjax_render_loop\\.js', 'archive/engine.html'], ['render-diagnostics\\.js', 'archive/mixed_engine.html']]) {
    const own = pick(wrong, name, '\\.\\./archive/');
    assert.ok(own, `wrong_print_engine.html must load ${name}`);
    assert.equal(own, pick(read(html), name, ''), `${name} ?v= must match ${html}`);
  }
  assert.ok(wrong.indexOf('render-diagnostics.js') < wrong.indexOf('mathjax_render_loop.js'), 'diagnostics load before the render loop');
  assert.equal(pick(wrong, 'common-fast-runtime\\.js', '\\.\\./archive/'), pick(read('archive/mixed_engine.html'), 'common-fast-runtime\\.js', ''), 'common-fast-runtime ?v= (publish hook) matches mixed_engine.html');
});

test('오답 엔진에는 수식 오류 처리 구현이 따로 없고 공통 모듈만 부른다', () => {
  const wrong = read('apmath/wrong_print_engine.html');
  assert.ok(!/ap-math-error|mjx-merror/.test(wrong), 'no second implementation of the marker');
  assert.match(wrong, /APRenderDiagnostics\?\.sanitize/, 'legacy typeset path uses the shared sanitize');
  assert.match(wrong, /APRenderDiagnostics\?\.publish/, 'legacy render path publishes diagnostics');
  assert.match(wrong, /function stampMathDiagnostics/);
  assert.ok(read('archive/render-diagnostics.js').includes('data-ap-diag-student'));
});

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
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

// 학생 둘, 원본 시험 둘(오류 수식이 든 파일 + 깨끗한 파일). 김가나: 오류 파일 1~6번, 이다라: 오류 파일 2번 + 깨끗한 파일 2번.
function payloadFor(origin, withFault) {
  const fault = n => ({ archiveFile: FAULT, questionNo: n, examTitle: '오류 시험' });
  const clean = n => ({ archiveFile: `${origin}/${CLEAN_FILE}`, questionNo: n, examTitle: '정상 시험' });
  const students = withFault
    ? [{ studentName: '김가나', wrongItems: [1, 2, 3, 4, 5, 6].map(fault) }, { studentName: '이다라', wrongItems: [fault(2), clean(2)] }]
    : [{ studentName: '김가나', wrongItems: [1, 3, 5].map(fault) }, { studentName: '이다라', wrongItems: [fault(3), clean(2)] }];
  return { mode: 'student', className: '테스트반', createdDate: '2026-11-23', students, options: { pageBreakByStudent: true } };
}

async function open(browser, origin, payload, mode, extra = '') {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**/*', route => route.abort());
  await page.addInitScript(value => {
    sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', JSON.stringify(value));
    window.print = () => { window.__printCalls = (window.__printCalls || 0) + 1; };
  }, payload);
  await page.goto(`${origin}/apmath/wrong_print_engine.html?prewarm=0&mode=${mode}${extra}`);
  const outcome = await page.evaluate(() => Promise.race([
    (async () => { for (;;) { const value = await window.__AP_RENDER_READY__; if (value?.code !== 'RENDER_NOT_STARTED') return value; await new Promise(resolve => setTimeout(resolve, 200)); } })(),
    new Promise(resolve => setTimeout(() => resolve({ ok: false, code: 'TEST_TIMEOUT' }), 90000))
  ]));
  await page.waitForTimeout(300);
  return { context, page, outcome, errors };
}

function inspect(page) {
  return page.evaluate(() => {
    const notice = document.getElementById('ap-render-notice');
    const boxes = [...document.querySelectorAll('#print-area .q-box')];
    return {
      pages: document.querySelectorAll('#print-area .page').length,
      boxes: boxes.length,
      merror: document.querySelectorAll('#print-area mjx-merror').length,
      markers: [...document.querySelectorAll('#print-area span.ap-math-error')].map(node => ({
        student: node.closest('.q-box')?.dataset.apDiagStudent || null, no: node.closest('.q-box')?.dataset.apDiagNo || null, text: node.textContent
      })),
      diagnostics: window.apRenderDiagnostics,
      noticeVisible: !!notice && !notice.hidden && getComputedStyle(notice).display !== 'none',
      noticeText: notice?.textContent || '',
      status: document.getElementById('clinic-render-status')?.dataset.status,
      printDisabled: document.getElementById('btn-print')?.disabled,
      otherMath: boxes.filter(box => !box.querySelector('.ap-math-error')).every(box => !box.textContent.includes('$') || box.querySelector('mjx-container')),
      mathContainers: document.querySelectorAll('#print-area mjx-container').length
    };
  });
}
const keyOf = entries => entries.map(({ student, questionNo, sourceNo, part, code }) => `${student}|${questionNo}|${sourceNo}|${part}|${code}`).sort();

test('오류 수식 하나가 있어도 오답 엔진이 시험지·해설지·복습지를 연다 (학생·원본 문항 식별, 인쇄 준비까지)', async t => {
  const launched = await launch();
  if (!launched.browser) {
    assert.ok(process.env.ARCHIVE_ONE_ITEM_REQUIRE_BROWSER !== '1', 'Chrome required: ' + launched.reason);
    t.skip('NOT_RUN: ' + launched.reason);
    return;
  }
  const { browser } = launched;
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const cases = [
    { mode: 'exam', extra: '', boxes: 8, expected: ['김가나|4|4|본문|MATH_TYPESET_ERROR'] },
    { mode: 'sol', extra: '', boxes: 8, expected: ['김가나|2|2|해설|MATH_TYPESET_ERROR', '김가나|4|4|본문|MATH_TYPESET_ERROR', '김가나|6|6|해설|MATH_UNRENDERED', '이다라|1|2|해설|MATH_TYPESET_ERROR'] },
    { mode: 'review', extra: '', boxes: 8, expected: ['김가나|2|2|해설|MATH_TYPESET_ERROR', '김가나|4|4|본문|MATH_TYPESET_ERROR', '김가나|6|6|해설|MATH_UNRENDERED', '이다라|1|2|해설|MATH_TYPESET_ERROR'] },
    { mode: 'exam', extra: '&runtime=legacy', boxes: 8, expected: ['김가나|4|4|본문|MATH_TYPESET_ERROR'] },
    { mode: 'sol', extra: '&runtime=legacy', boxes: 8, expected: ['김가나|2|2|해설|MATH_TYPESET_ERROR', '김가나|4|4|본문|MATH_TYPESET_ERROR', '김가나|6|6|해설|MATH_UNRENDERED', '이다라|1|2|해설|MATH_TYPESET_ERROR'] }
  ];
  try {
    for (const row of cases) {
      const label = `${row.mode}${row.extra}`;
      const { context, page, outcome, errors } = await open(browser, origin, payloadFor(origin, true), row.mode, row.extra);
      assert.equal(outcome.ok, true, `${label}: whole render must not fail (${JSON.stringify(outcome)})`);
      const view = await inspect(page);
      assert.equal(view.status, 'ready', label);
      assert.ok(view.pages > 0, label);
      assert.equal(view.merror, 0, `${label}: no raw MathJax error left`);
      assert.deepEqual(keyOf(view.diagnostics), row.expected.slice().sort(), label);
      assert.ok(view.diagnostics.every(entry => entry.file === FAULT), `${label}: diagnostics name the source file`);
      assert.equal(view.markers.length, row.expected.length, label);
      assert.ok(view.markers.every(marker => /수식 오류|수식 변환 안 됨/.test(marker.text)), `${label}: marker label`);
      assert.ok(view.markers.some(marker => /boxed\{k&=-4\}/.test(marker.text)), `${label}: TeX source stays visible`);
      assert.equal(view.noticeVisible, true, `${label}: notice band`);
      assert.match(view.noticeText, /김가나/, label);
      assert.match(view.noticeText, /원본 render-one-item-fault \d번/, label);
      assert.ok(view.mathContainers > 0 && view.otherMath, `${label}: other questions' math still renders`);
      assert.ok(view.boxes >= row.boxes, `${label}: every question keeps its box (${view.boxes})`);
      assert.deepEqual(errors, [], label);
      // 인쇄 준비: 표식이 붙은 채로 인쇄 사전 점검을 지나 print()까지 간다
      const printed = await page.evaluate(async () => ({ result: await window.clinicSafePrint('browser'), calls: window.__printCalls || 0 }));
      assert.deepEqual(printed, { result: { ok: true }, calls: 1 }, `${label}: print reaches window.print`);
      if (!row.extra) {
        // 쪽 안 모드 전환(스냅숏 경로)에서도 그 모드에 맞는 진단으로 바뀐다
        const switched = await page.evaluate(async () => {
          const out = [];
          for (const mode of ['exam', 'sol']) { const r = await window.switchMode(mode); out.push([mode, r?.ok !== false, (window.apRenderDiagnostics || []).length]); }
          return out;
        });
        assert.deepEqual(switched, [['exam', true, 1], ['sol', true, 4]], `${label}: mode switch`);
        // 띠를 누르면 그 표식으로 이동·강조한다
        await page.click('#ap-render-notice .ap-render-notice__item >> nth=0');
        assert.equal(await page.evaluate(() => document.querySelectorAll('.ap-math-error--flash').length), 1, label);
        // 띠는 인쇄되지 않고 표식은 인쇄된다
        await page.emulateMedia({ media: 'print' });
        assert.equal(await page.evaluate(() => getComputedStyle(document.getElementById('ap-render-notice')).display), 'none');
        assert.ok(await page.evaluate(() => document.querySelectorAll('#print-area .ap-math-error').length > 0));
      }
      await context.close();
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
});

test('오류가 없는 오답지에는 표식·띠·진단이 없고 그대로 열린다', async t => {
  const launched = await launch();
  if (!launched.browser) {
    assert.ok(process.env.ARCHIVE_ONE_ITEM_REQUIRE_BROWSER !== '1', 'Chrome required: ' + launched.reason);
    t.skip('NOT_RUN: ' + launched.reason);
    return;
  }
  const { browser } = launched;
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const payload = {
    mode: 'student', className: '테스트반', createdDate: '2026-11-23', options: { pageBreakByStudent: true },
    students: [{ studentName: '김가나', wrongItems: [1, 3, 5].map(n => ({ archiveFile: FAULT, questionNo: n, examTitle: '시험' })) }]
  };
  try {
    for (const mode of ['exam', 'sol', 'review', 'ans']) {
      const { context, page, outcome } = await open(browser, origin, payload, mode);
      assert.equal(outcome.ok, true, mode);
      const view = await inspect(page);
      assert.deepEqual(view.diagnostics, [], mode);
      assert.equal(view.markers.length, 0, mode);
      assert.equal(view.noticeVisible, false, mode);
      assert.equal(await page.evaluate(() => document.querySelectorAll('[data-ap-math-error]').length), 0, mode);
      assert.ok(view.pages > 0, mode);
      await context.close();
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
});
