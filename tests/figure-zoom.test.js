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
  assert.equal(zoom.isStudentContext({ pathname: '/archive/engine.html', search: '?mode=exam&studentReview=1&figureZoom=0' }), false, 'figureZoom=0은 끈다(렌더 검증 CI용)');
  assert.equal(zoom.isStudentContext({ pathname: '/apmath/student/index.html', search: '?figureZoom=0' }), false);
  assert.equal(zoom.isStudentContext({ pathname: '/archive/engine.html', search: '?studentReview=1&figureZoom=1' }), true);
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
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media print\s*\{[\s\S]*?\n\}/, '').replace(/@media \([^)]*\)\s*\{([\s\S]*?)\n\}/g, '$1').split('{').slice(0, -1).map(part => part.split('}').pop().trim()).filter(Boolean);
  for (const selector of selectors) assert.ok(/ap-fz/.test(selector), `규칙이 학생 화면 전용 클래스 아래에 있다: ${selector.slice(0, 60)}`);
});

// ---------- 신고 보조 함수 ----------
const el = (attrs, closestMap = {}) => ({ tagName: attrs.tag || 'img', getAttribute: name => (attrs[name] === undefined ? null : attrs[name]),
  closest: selector => closestMap[selector] || null });

test('그림 경로: R2 주소·사이트 주소를 assets/ 상대 경로로 돌리고, 인라인·데이터 주소는 빈 값', () => {
  const path = 'assets/images/25_금당고_2학기_중간_고1_기출/q1-solution-v2.svg';
  assert.equal(zoom.figurePathOf('assets/images/25_금당고_2학기_중간_고1_기출/q1-solution-v2.svg?v=2'), path);
  assert.equal(zoom.figurePathOf('https://img.wangjiedu.com/exams/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A01_%EA%B8%B0%EC%B6%9C/q1-solution-v2.svg?v=3'), path);
  assert.equal(zoom.figurePathOf('http://127.0.0.1:8934/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A01_%EA%B8%B0%EC%B6%9C/q1-solution-v2.svg'), path);
  assert.equal(zoom.figurePathOf('data:image/svg+xml;utf8,%3Csvg%3E'), '');
  assert.equal(zoom.figurePathOf(''), '');
  assert.equal(zoom.figurePathOf('https://example.com/x.png'), '');
});

test('문항 식별: legacy uid는 파일+번호로, 그 밖의 uid는 uid와 화면 번호로', () => {
  assert.deepEqual(zoom.questionOf('exams/o/a.js#legacy:exams/o/a.js#ordinal:3', '3.'), { uid: '', file: 'exams/o/a.js', no: 3 });
  assert.deepEqual(zoom.questionOf('exams/o/a.js#uid-7', '7.'), { uid: 'uid-7', file: 'exams/o/a.js', no: 7 });
  assert.deepEqual(zoom.questionOf('exams/o/a.js#uid-7', ''), { uid: 'uid-7', file: 'exams/o/a.js', no: 0 });
  assert.deepEqual(zoom.questionOf('', '1.'), { uid: '', file: '', no: 0 });
});

test('화면 종류·폭 구간·세션: 포털 시험/유사/원본/자습, 폭 4구간, 선생님 미리보기는 세션 없음', () => {
  const at = (pathname, search) => zoom.screenKind({ pathname, search });
  assert.equal(at('/archive/engine.html', '?data=exams/similar/x.js&studentReview=1'), 'similar');
  assert.equal(at('/archive/engine.html', '?data=exams/original/x.js&studentReview=1&assignmentId=a1&studio=1'), 'exam');
  assert.equal(at('/archive/engine.html', '?data=exams/original/x.js&studentReview=1&originalSnapshot=o-1'), 'exam');
  assert.equal(at('/archive/engine.html', '?data=exams/original/x.js&studentReview=1&mode=sol'), 'original');
  assert.equal(at('/apmath/student/index.html', ''), 'self_study');
  assert.deepEqual([479, 480, 767, 768, 1099, 1100].map(zoom.widthBucket), ['xs', 'sm', 'sm', 'md', 'md', 'lg']);
  const storage = { getItem: () => JSON.stringify({ student_id: 's1', student_token: 'tok', name: '홍길동' }) };
  assert.deepEqual(zoom.studentCredentials({ search: '?studentReview=1' }, storage), { student_id: 's1', student_token: 'tok' });
  assert.equal(zoom.studentCredentials({ search: '?studentReview=1&studentReturnTo=%2Fapmath%2Fstudent%2F%3Fteacher_preview%3D1' }, storage), null);
  assert.equal(zoom.studentCredentials({ search: '?teacher_preview=1' }, storage), null);
  assert.equal(zoom.studentCredentials({ search: '' }, { getItem: () => null }), null);
  assert.equal(zoom.reportApiBase({ hostname: 'icefoxtail.github.io', search: '?figureReportApi=http://127.0.0.1:8787/api' }), 'https://ap-math-os-v2612.js-pdf.workers.dev/api', '운영 주소에서는 바꿀 수 없다');
  assert.equal(zoom.reportApiBase({ hostname: '127.0.0.1', search: '?figureReportApi=http://127.0.0.1:8787/api' }), 'http://127.0.0.1:8787/api');
  assert.equal(zoom.reportApiBase({ hostname: '127.0.0.1', search: '?figureReportApi=https://evil.example/api' }), 'https://ap-math-os-v2612.js-pdf.workers.dev/api');
  assert.deepEqual(zoom.REASONS.map(item => item[0]), ['not_visible', 'text_unreadable', 'mismatch', 'missing_parts', 'other']);
  const box = { getAttribute: () => 'exams/o/a.js#legacy:exams/o/a.js#ordinal:3', querySelector: () => ({ textContent: '3.' }) };
  const figure = el({ src: 'assets/images/a/q3.svg' }, { '.ss-card': null, '[data-source-ref]': box, '.choices': null });
  assert.deepEqual(zoom.describe(figure, { pathname: '/archive/engine.html', search: '?studentReview=1' }, 390),
    { question_uid: '', archive_file: 'exams/o/a.js', question_no: 3, figure_path: 'assets/images/a/q3.svg', role: 'problem', screen: 'original', width_bucket: 'xs' });
  assert.equal(zoom.describe(el({ src: 'x' }, {}), { pathname: '/archive/engine.html', search: '' }, 390), null, '문항을 알 수 없으면 보낼 수 없다');
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

test('실제 Chrome: 그림이 이상해요 - 사유만 고르면 전송, 학생 정보는 본문에 로그인 확인용만, 같은 그림은 다시 못 보냄', async t => {
  const server = await serve();
  t.after(() => server.close());
  const chrome = await launchChrome();
  if (chrome.reason) { t.skip(`NOT_RUN: ${chrome.reason}`); return; }
  t.after(() => chrome.close());
  const { page } = chrome;
  const base = `http://127.0.0.1:${server.address().port}/tests/fixtures/figure-zoom-page.html?studentReview=1`;
  await page.size(390, 844);

  // 로그인 세션이 없으면 신고 단추가 없다(크게 보기는 된다).
  await page.goto(base);
  await page.eval(`localStorage.clear(); 0`);
  await page.goto(base);
  await page.eval(`document.getElementById('fig-s').click(); 0`);
  await page.sleep(300);
  assert.equal(await page.eval(`!!document.querySelector('.ap-fz-dialog') && !document.querySelector('.ap-fz-report')`), true);

  // 세션이 있으면 단추 -> 사유 선택지 5개(입력 칸 없음)
  await page.eval(`localStorage.setItem('APMATH_STUDENT_PORTAL_SESSION', JSON.stringify({ student_id: 's-1', student_token: 'tok', student_name: '홍길동' })); 0`);
  await page.goto(base);
  await page.eval(`window.__sent = []; window.__mode = 'ok';
    window.fetch = (url, init) => { window.__sent.push({ url: String(url), body: JSON.parse(init.body) });
      return window.__mode === 'ok' ? Promise.resolve(new Response(JSON.stringify({ ok: true, success: true }), { status: 200 }))
        : window.__mode === 'limit' ? Promise.resolve(new Response(JSON.stringify({ ok: false, code: 'DAILY_LIMIT' }), { status: 429 }))
        : Promise.reject(new TypeError('network')); };
    document.getElementById('fig-s').click(); 0`);
  await page.sleep(300);
  const ui = await page.eval(`({ report: document.querySelector('.ap-fz-report').textContent, sheetHidden: document.querySelector('.ap-fz-sheet').hidden,
    reasons: [...document.querySelectorAll('.ap-fz-reason')].map(b => b.textContent), inputs: document.querySelectorAll('.ap-fz-dialog input, .ap-fz-dialog textarea, .ap-fz-dialog [contenteditable]').length })`);
  assert.equal(ui.report, '그림이 이상해요');
  assert.equal(ui.sheetHidden, true);
  assert.deepEqual(ui.reasons, ['그림이 안 보여요', '글자·숫자가 안 읽혀요', '그림이 문제와 달라요', '선이나 점이 빠진 것 같아요', '기타']);
  assert.equal(ui.inputs, 0, '자유 글 입력이 없다');

  // 실패(네트워크 오류 = 옛 Worker/오프라인과 같은 처리): 문구, 다시 고를 수 있음, 보냈다는 표시는 안 남음
  await page.eval(`window.__mode = 'fail'; document.querySelector('.ap-fz-report').click(); document.querySelector('.ap-fz-reason[data-reason="mismatch"]').click(); 0`);
  await page.sleep(500);
  assert.equal(await page.eval(`document.querySelector('.ap-fz-note').textContent`), '지금은 보낼 수 없어요');
  assert.equal(await page.eval(`[...document.querySelectorAll('.ap-fz-reason')].every(b => !b.disabled)`), true);
  assert.equal(await page.eval(`localStorage.getItem('ap.figureReports.sent.v1')`), null);
  // 하루 상한 응답
  await page.eval(`window.__mode = 'limit'; document.querySelector('.ap-fz-reason[data-reason="other"]').click(); 0`);
  await page.sleep(500);
  assert.equal(await page.eval(`document.querySelector('.ap-fz-note').textContent`), '오늘은 더 보낼 수 없어요');

  // 성공: 본문 형식, 감사 문구, 보냈다는 표시
  await page.eval(`window.__mode = 'ok'; window.__sent.length = 0; document.querySelector('.ap-fz-reason[data-reason="missing_parts"]').click(); 0`);
  await page.sleep(500);
  const sent = await page.eval('window.__sent');
  assert.equal(sent.length, 1);
  assert.ok(sent[0].url.endsWith('/api/student-portal/figure-report'));
  assert.deepEqual(sent[0].body, {
    student_id: 's-1', student_token: 'tok', question_uid: 'question-uid-7', archive_file: 'exams/fixture/a.js', question_no: 7,
    figure_path: 'assets/images/25_금당고_2학기_중간_고1_기출/q1-solution-v2.svg', role: 'solution', screen: 'original', width_bucket: 'xs', reason_code: 'missing_parts',
  });
  assert.ok(!JSON.stringify(sent[0].body).includes('홍길동'), '이름은 보내지 않는다');
  assert.equal(await page.eval(`document.querySelector('.ap-fz-note').textContent`), '알려 줘서 고마워요');
  const after = await page.eval(`({ label: document.querySelector('.ap-fz-report').textContent, disabled: document.querySelector('.ap-fz-report').disabled, stored: localStorage.getItem('ap.figureReports.sent.v1') })`);
  assert.equal(after.label, '이미 알려 주셨어요');
  assert.equal(after.disabled, true);
  assert.equal(JSON.parse(after.stored).length, 1);

  // 닫았다 다시 열어도 못 보낸다. 다른 그림(legacy uid의 문제 그림)은 보낼 수 있고 파일+번호로 간다.
  await page.eval(`document.querySelector('.ap-fz-close').click(); 0`);
  await page.sleep(600);
  await page.eval(`window.__sent.length = 0; document.getElementById('fig-s').click(); 0`);
  await page.sleep(300);
  assert.equal(await page.eval(`document.querySelector('.ap-fz-report').disabled`), true);
  await page.eval(`document.querySelector('.ap-fz-close').click(); 0`);
  await page.sleep(600);
  await page.eval(`document.getElementById('fig-q').click(); 0`);
  await page.sleep(300);
  assert.equal(await page.eval(`document.querySelector('.ap-fz-report').disabled`), false);
  await page.eval(`document.querySelector('.ap-fz-report').click(); document.querySelector('.ap-fz-reason[data-reason="not_visible"]').click(); 0`);
  await page.sleep(500);
  const second = (await page.eval('window.__sent'))[0].body;
  assert.deepEqual([second.question_uid, second.archive_file, second.question_no, second.figure_path, second.role], ['', 'exams/fixture/a.js', 3, '', 'problem']);
});
