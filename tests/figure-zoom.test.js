'use strict';

// 그림 눌러서 크게 보기 (2026-11-24 원장님 결정): 학생 화면(studentReview=1 또는 학생 포털)에서만 그림을 눌러 크게 본다.
// 1) 소스 계약(항상 실행): 학생 화면 판정, 두 엔진에 같은 ?v=로 연결, 오답 엔진에는 연결 안 함, 인쇄에서 숨김, alert 없음, 배포 목록 등록.
// 2) 실제 Chrome(Chrome이 있을 때만, 없으면 건너뜀 = NOT_RUN): 선생님 주소에서는 DOM이 그대로, 학생 주소에서는 "크게" 표시가 붙고
//    눌러 열고 닫으며(단추·Esc·바깥·뒤로 가기) 초점이 돌아오고 스크롤이 잠겼다 풀리며, 인쇄 매체에서는 숨고, 숨은 측정 칸에는 표시가 없다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const zoom = require(path.join(root, 'archive', 'figure-zoom.js'));

test('학생 화면 판정: studentReview=1 이거나 학생 포털 안일 때만', () => {
  assert.equal(zoom.isStudentContext({ pathname: '/archive/engine.html', search: '?data=exams/a.js&mode=exam&studentReview=1' }), true);
  assert.equal(zoom.isStudentContext({ pathname: '/AP------/apmath/student/index.html', search: '' }), true);
  assert.equal(zoom.isStudentContext({ pathname: '/archive/engine.html', search: '?data=exams/a.js&mode=exam' }), false);
  assert.equal(zoom.isStudentContext({ pathname: '/archive/engine.html', search: '?studentReview=0' }), false);
  assert.equal(zoom.isStudentContext({ pathname: '/apmath/wrong_print_engine.html', search: '?packet=x' }), false);
  assert.equal(zoom.isStudentContext({ pathname: '/archive/workspace.html', search: '?view=find' }), false);
  assert.equal(zoom.isStudentContext(null), false);
});

test('큰 그림 크기: 칸에 비율을 지키며 꽉 차고, 래스터는 원본 2배까지만', () => {
  assert.deepEqual(zoom.fitSize({ width: 400, height: 800 }, 2), { width: 400, height: 200 });
  assert.deepEqual(zoom.fitSize({ width: 800, height: 300 }, 2), { width: 600, height: 300 });
  assert.deepEqual(zoom.fitSize({ width: 1000, height: 1000 }, 1, 120), { width: 240, height: 240 });
  assert.deepEqual(zoom.fitSize({ width: 0, height: 100 }, 1), { width: 0, height: 0 });
});

test('엔진 두 곳이 같은 ?v=로 연결하고, 오답 출력 엔진에는 연결하지 않는다', () => {
  const pick = (text, name) => (new RegExp(`(?:href|src)="(?:\\.\\./)*(?:archive/)?${name.replace('.', '\\.')}\\?v=([^"]+)"`).exec(text) || [])[1];
  const engine = read('archive/engine.html');
  const mixed = read('archive/mixed_engine.html');
  for (const name of ['figure-zoom.js', 'figure-zoom.css']) {
    assert.ok(pick(engine, name), `engine.html loads ${name} with ?v=`);
    assert.equal(pick(engine, name), pick(mixed, name), `${name} ?v= matches in engine.html and mixed_engine.html`);
  }
  assert.equal(pick(engine, 'figure-zoom.js'), pick(engine, 'figure-zoom.css'), 'script and style share one version');
  assert.ok(!read('apmath/wrong_print_engine.html').includes('figure-zoom'), '오답 출력 엔진(선생님 인쇄용)에는 기능을 붙이지 않는다');
  const portal = read('apmath/student/index.html');
  assert.ok(pick(portal, 'figure-zoom.js') && pick(portal, 'figure-zoom.css'), '학생 포털(자습 화면)도 같은 파일을 부른다');
  assert.equal(pick(portal, 'figure-zoom.js'), pick(engine, 'figure-zoom.js'));
});

test('배포 목록과 CI 범위에 두 파일이 들어 있다', () => {
  const manifest = JSON.parse(read('tools/archive-pages-release-manifest.json'));
  const listed = JSON.stringify(manifest);
  assert.ok(listed.includes('"figure-zoom.js"') && listed.includes('"figure-zoom.css"'));
  const scope = read('tools/ci/archive-ci-scope.mjs');
  assert.ok(scope.includes("'archive/figure-zoom.js'") && scope.includes("'archive/figure-zoom.css'"));
});

test('스크립트는 alert/confirm/prompt에 기대지 않고, CSS는 인쇄에서 숨기며 학생 화면 클래스 아래에만 걸린다', () => {
  const js = read('archive/figure-zoom.js');
  assert.ok(!/\b(?:alert|confirm|prompt)\s*\(/.test(js));
  const css = read('archive/figure-zoom.css');
  assert.match(css, /@media print\s*\{[^}]*\.ap-fz-layer[^}]*display:\s*none\s*!important/);
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media print\s*\{[\s\S]*?\n\}/, '').split('{').slice(0, -1).map(part => part.split('}').pop().trim()).filter(Boolean);
  for (const selector of selectors) assert.ok(/ap-fz/.test(selector), `규칙이 학생 화면 전용 클래스 아래에 있다: ${selector.slice(0, 60)}`);
});

// ---------- 실제 Chrome ----------
const MIME = { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css' };
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

async function launchChrome() {
  const exe = [process.env.CHROME_BIN, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium']
    .filter(Boolean).find(file => fs.existsSync(file));
  if (!exe || typeof WebSocket !== 'function') return { reason: 'Chrome 또는 WebSocket을 쓸 수 없음' };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'figure-zoom-chrome-'));
  const child = spawn(exe, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-sandbox', '--disable-gpu', '--disable-extensions', '--no-first-run', '--disable-background-networking', 'about:blank'], { stdio: 'ignore' });
  let endpoint = '';
  for (let i = 0; i < 100 && !endpoint; i += 1) {
    await new Promise(resolve => setTimeout(resolve, 100));
    try { const [port, pathname] = fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').trim().split(/\r?\n/); endpoint = `ws://127.0.0.1:${port}${pathname}`; } catch { /* 아직 안 뜸 */ }
  }
  if (!endpoint) { child.kill(); return { reason: 'Chrome 원격 디버깅 연결 실패' }; }
  const socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = () => reject(new Error('ws')); });
  let nextId = 0;
  const pending = new Map();
  const waiters = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) { const { resolve, reject } = pending.get(message.id); pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : resolve(message.result); }
    else for (const waiter of waiters.slice()) if (waiter.method === message.method && (!waiter.sessionId || waiter.sessionId === message.sessionId)) { waiters.splice(waiters.indexOf(waiter), 1); waiter.resolve(message.params); }
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { nextId += 1; pending.set(nextId, { resolve, reject }); socket.send(JSON.stringify({ id: nextId, method, params, ...(sessionId ? { sessionId } : {}) })); });
  const once = (method, sessionId) => new Promise(resolve => waiters.push({ method, sessionId, resolve }));
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  const page = {
    async goto(url) { const loaded = once('Page.loadEventFired', sessionId); await send('Page.navigate', { url }, sessionId); await loaded; await page.sleep(500); },
    async eval(expression) {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result.value;
    },
    media: media => send('Emulation.setEmulatedMedia', { media }, sessionId),
    size: (width, height) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, sessionId),
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  };
  const close = async () => { try { socket.close(); } catch { /* 이미 닫힘 */ } child.kill(); await new Promise(resolve => setTimeout(resolve, 200)); try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* 윈도우는 잠시 잡고 있을 수 있다 */ } };
  return { page, close };
}

test('실제 Chrome: 선생님 주소는 DOM 그대로, 학생 주소는 눌러서 크게 보기', async t => {
  const server = await serve();
  t.after(() => server.close());
  const chrome = await launchChrome();
  if (chrome.reason) { t.skip(`NOT_RUN: ${chrome.reason}`); return; }
  t.after(() => chrome.close());
  const { page } = chrome;
  const base = `http://127.0.0.1:${server.address().port}/tests/fixtures/figure-zoom-page.html`;
  await page.size(390, 844);

  // 선생님 주소(studentReview 없음): 아무것도 붙지 않는다.
  await page.goto(base);
  const before = await page.eval('document.documentElement.outerHTML');
  await page.sleep(800);
  const teacher = await page.eval(`({ on: document.documentElement.className, layer: !!document.querySelector('.ap-fz-layer'), badges: document.querySelectorAll('.ap-fz-badge').length, html: document.documentElement.outerHTML })`);
  assert.equal(teacher.on, '');
  assert.equal(teacher.layer, false);
  assert.equal(teacher.badges, 0);
  assert.equal(teacher.html, before, '선생님 화면 DOM은 변하지 않는다');

  // 학생 주소
  await page.goto(`${base}?studentReview=1`);
  await page.sleep(900);
  const student = await page.eval(`({ on: document.documentElement.classList.contains('ap-fz-on'), badges: document.querySelectorAll('.ap-fz-badge').length,
    hiddenFigBadge: false, inline: getComputedStyle(document.querySelector('.ap-fz-badge')).display,
    inPrintArea: document.querySelectorAll('#print-area .ap-fz-badge, #print-area .ap-fz-layer').length,
    layerParent: document.querySelector('.ap-fz-layer').parentElement.tagName,
    label: document.querySelector('.ap-fz-badge').getAttribute('aria-label') })`);
  assert.equal(student.on, true);
  assert.equal(student.badges, 4, '문제 그림·인라인 svg·선택지 그림·해설 그림에만(수식 svg와 숨은 측정 칸은 제외)');
  assert.equal(student.inPrintArea, 0, '표시는 쪽 DOM 안이 아니라 body 끝의 층에 둔다');
  assert.equal(student.layerParent, 'BODY');
  assert.equal(student.label, '그림 크게 보기');

  // 표시를 눌러 열기 → 대화상자 속성, 초점, 스크롤 잠금
  await page.eval(`window.scrollTo(0, 0); document.getElementById('fig-q').scrollIntoView({ block: 'center' }); 0`);
  await page.sleep(300);
  const y0 = await page.eval('window.scrollY');
  await page.eval(`document.querySelector('.ap-fz-badge').focus(); document.querySelector('.ap-fz-badge').click(); 0`);
  await page.sleep(300);
  const opened = await page.eval(`(() => { const d = document.querySelector('.ap-fz-dialog'); const img = d && d.querySelector('img, svg');
    return { role: d && d.getAttribute('role'), modal: d && d.getAttribute('aria-modal'), focus: document.activeElement.className, lock: document.documentElement.classList.contains('ap-fz-lock'),
      big: img ? Math.round(img.getBoundingClientRect().width) : 0, small: Math.round(document.getElementById('fig-q').getBoundingClientRect().width), fits: img ? img.getBoundingClientRect().right <= innerWidth : false }; })()`);
  assert.equal(opened.role, 'dialog');
  assert.equal(opened.modal, 'true');
  assert.equal(opened.focus, 'ap-fz-close');
  assert.equal(opened.lock, true);
  assert.ok(opened.big > opened.small, `큰 그림(${opened.big})이 쪽 안 그림(${opened.small})보다 크다`);
  assert.equal(opened.fits, true, '화면 폭을 넘지 않는다');

  // Esc로 닫기: 초점 복귀, 잠금 해제, 스크롤 위치 유지
  await page.eval(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); 0`);
  await page.sleep(700);
  const closed = await page.eval(`({ open: !!document.querySelector('.ap-fz-dialog'), focus: document.activeElement.className, lock: document.documentElement.classList.contains('ap-fz-lock'), y: window.scrollY })`);
  assert.equal(closed.open, false);
  assert.equal(closed.focus, 'ap-fz-badge');
  assert.equal(closed.lock, false);
  assert.ok(Math.abs(closed.y - y0) <= 2, `스크롤 위치 복원(${y0} -> ${closed.y})`);

  // 그림 자체를 눌러 열고, 뒤로 가기·바깥 누름·닫기 단추로 닫기
  const closeBy = async how => {
    await page.eval(`document.getElementById('fig-q').click(); 0`);
    await page.sleep(300);
    assert.equal(await page.eval(`!!document.querySelector('.ap-fz-dialog')`), true, '그림을 누르면 열린다');
    await page.eval(how);
    await page.sleep(700);
    assert.equal(await page.eval(`!!document.querySelector('.ap-fz-dialog')`), false, how);
  };
  await closeBy('history.back(); 0');
  await closeBy(`document.querySelector('.ap-fz-stage').dispatchEvent(new MouseEvent('click', { bubbles: true })); 0`);
  await closeBy(`document.querySelector('.ap-fz-close').click(); 0`);
  assert.equal(await page.eval('location.search'), '?studentReview=1', '열고 닫아도 주소는 그대로');

  // 큰 그림을 눌러도 닫히지 않는다(두 손가락 확대·끌기와 겹치지 않게)
  await page.eval(`document.getElementById('fig-s').click(); 0`);
  await page.sleep(300);
  await page.eval(`document.querySelector('.ap-fz-large').dispatchEvent(new MouseEvent('click', { bubbles: true })); 0`);
  await page.sleep(200);
  assert.equal(await page.eval(`!!document.querySelector('.ap-fz-dialog')`), true);
  await page.eval(`document.querySelector('.ap-fz-close').click(); 0`);
  await page.sleep(600);

  // 인쇄 매체에서는 표시와 대화상자가 모두 숨는다
  await page.media('print');
  const printed = await page.eval(`[...document.querySelectorAll('.ap-fz-layer, .ap-fz-badge')].map(e => e.getClientRects().length === 0 ? 'none' : getComputedStyle(e).display)`);
  await page.media('');
  assert.ok(printed.length > 0 && printed.every(value => value === 'none'), `인쇄에서 숨김: ${printed.join(',')}`);
});
