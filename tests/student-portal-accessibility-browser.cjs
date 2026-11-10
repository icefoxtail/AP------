'use strict';

// Independent acceptance checks for the user's feature-access requirements.
// Product HTML/JS and full current Worker authentication run unchanged.
// API transport uses isolated synthetic D1; readers receive synthetic issued
// snapshots and an empty metadata sidecar for those test-only questions.
// This does not claim an authenticated production student account was tested.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createLocalStudentWorker } = require('./student-portal-accessibility-worker.cjs');
const arg = name => process.argv.find(value => value.startsWith('--' + name + '='))?.slice(name.length + 3);
const root = path.resolve(arg('source-root') || path.join(__dirname, '..'));
const output = path.resolve(arg('output') || path.join(require('node:os').tmpdir(), 'student-portal-accessibility'));
const prefix = '/AP------';
let playwright;
try { playwright = require('playwright'); }
catch (_) { playwright = require(require.resolve('playwright', { paths: [process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || ''] })); }
fs.mkdirSync(output, { recursive: true });
const report = {
  source: arg('base-url') || root, revision: arg('revision') || null,
  auth: 'Unmodified full Worker, name/PIN and teacher login endpoints, ephemeral D1 synthetic identities. Production account: NOT_RUN.',
  readerData: 'Two synthetic arithmetic questions and an empty synthetic metadata sidecar; actual original/mixed rendering, mode controls and shared navigation are unchanged.',
  startedAt: new Date().toISOString(), checks: [], failures: [], screenshots: [], pageErrors: [], api: [], completed: false
};
const labels = ['홈', '시험지', '실험실', '플래너', '더보기'];
const selectors = {
  nav: '.student-global-nav',
  navItem: destination => '.student-global-nav [data-student-destination="' + destination + '"]',
  feature: destination => '[data-portal-feature="' + destination + '"]'
};

function createServer() {
  return http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/AP------(?=\/|$)/, '') || '/'; }
    catch (_) { res.writeHead(400); return res.end(); }
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
    const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
}

async function capture(page, name) {
  await page.screenshot({ path: path.join(output, name + '.png'), fullPage: false, animations: 'disabled' });
  const geometry = await page.evaluate(() => ({
    width: innerWidth, height: innerHeight, scrollY, scrollWidth: document.documentElement.scrollWidth,
    title: document.querySelector('h1')?.textContent || '',
    version: document.querySelector('.student-app-version')?.textContent || '',
    navigation: [...document.querySelectorAll('.student-global-nav [data-student-destination]')].map(el => {
      const r = el.getBoundingClientRect();
      return { destination: el.dataset.studentDestination, current: el.getAttribute('aria-current'), x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom };
    }),
    features: [...document.querySelectorAll('[data-portal-feature]')].map(el => {
      const r = el.getBoundingClientRect();
      return { feature: el.dataset.portalFeature, text: el.textContent.trim(), x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom };
    })
  }));
  report.screenshots.push({ name, file: name + '.png', geometry });
  return geometry;
}

async function assertNav(page, active) {
  const nav = page.locator(selectors.nav);
  await nav.waitFor({ state: 'visible' });
  assert.deepEqual((await nav.locator('.student-global-link').allTextContents()).map(text => text.trim()), labels);
  const current = nav.locator('[aria-current="page"]');
  assert.equal(await current.count(), 1, 'one current destination');
  assert.equal(await current.getAttribute('data-student-destination'), active);
  const geometry = await nav.locator('.student-global-link').evaluateAll(nodes => nodes.map(node => {
    const r = node.getBoundingClientRect();
    return { x: r.x, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
  }));
  const viewport = page.viewportSize();
  for (const box of geometry) {
    assert.ok(box.x >= -1 && box.right <= viewport.width + 1, 'navigation fits viewport width');
    assert.ok(box.top >= -1 && box.bottom <= viewport.height + 1, 'navigation is visible without scrolling');
    assert.ok(box.width >= 44 && box.height >= 44, 'navigation has at least 44px touch area');
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal overflow');
}

async function assertHome(page) {
  await page.locator(selectors.feature('exams')).waitFor({ state: 'visible' });
  await assertNav(page, 'home');
  const controls = page.locator('[data-portal-feature]');
  assert.equal(await controls.count(), 4, 'exactly four first-level learning destinations');
  const texts = await controls.allTextContents();
  for (const expected of ['내 시험지', '도형·수학 실험실', '학습 플래너', '과제']) assert.ok(texts.some(value => value.includes(expected)), expected + ' is present');
  const bounds = await controls.evaluateAll(nodes => nodes.map(node => {
    const r = node.getBoundingClientRect(); return { x: r.x, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
  }));
  const navTop = await page.locator(selectors.nav).evaluate(el => getComputedStyle(el).position === 'fixed' ? el.getBoundingClientRect().top : innerHeight);
  for (const bound of bounds) {
    assert.ok(bound.top >= 0 && bound.bottom <= navTop, 'all four features visible above mobile navigation in first viewport');
    assert.ok(bound.width >= 44 && bound.height >= 44, 'home destinations have usable touch areas');
  }
  assert.ok(await page.locator('.portal-recent-item').count() <= 1, 'home does not stack multiple recent exams');
  assert.equal(await page.locator('.clv-row').count(), 0, 'home does not render the full learning-history stack');
}

async function instrument(context, worker, options = {}) {
  if (options.preview) await context.addInitScript(session => {
    localStorage.setItem('APMATH_SESSION', JSON.stringify(session));
    localStorage.removeItem('APMATH_STUDENT_PORTAL_SESSION');
  }, worker.teacherSession);
  await context.addInitScript(() => localStorage.setItem('APMATH_STUDENT_INSTALL_DISMISSED_AT', String(Date.now())));
  const requests = [];
  await context.route('**/*', async route => {
    const request = route.request(); const url = new URL(request.url());
    if (url.pathname.endsWith('/archive/data/question_metadata.json')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ records: [] }) });
    }
    if (url.hostname === 'ap-math-os-v2612.js-pdf.workers.dev') {
      const headers = { ...request.headers() }; delete headers.host; delete headers['content-length'];
      const options = { method: request.method(), headers };
      if (!['GET', 'HEAD'].includes(request.method())) options.body = request.postDataBuffer();
      const response = await worker.mf.dispatchFetch('http://local-worker.test' + url.pathname + url.search, options);
      const observation = { endpoint: url.pathname.replace(/^\/api\//, ''), method: request.method(), status: response.status, teacherAuthorization: !!headers.authorization, studentAuthorization: !!headers['x-student-token'] || url.searchParams.has('token') };
      requests.push(observation); report.api.push(observation);
      return route.fulfill({ status: response.status, headers: { ...Object.fromEntries(response.headers), 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: Buffer.from(await response.arrayBuffer()) });
    }
    if (['127.0.0.1', 'localhost'].includes(url.hostname) || url.hostname === 'icefoxtail.github.io') return route.continue();
    // Isolate fonts/analytics/3D CDN. No live API or student data leaves the test.
    return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
  });
  return requests;
}

async function run() {
  const server = createServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = (arg('base-url') || 'http://127.0.0.1:' + server.address().port + prefix).replace(/\/$/, '');
  const portal = base + '/apmath/student/';
  let browser; let worker;
  const check = async (name, callback) => {
    try { await callback(); report.checks.push({ name, passed: true }); }
    catch (error) { report.checks.push({ name, passed: false }); report.failures.push({ name, message: error.message }); }
  };
  try {
    worker = await createLocalStudentWorker(root);
    const executable = process.env.CHROMIUM_PATH || (fs.existsSync(playwright.chromium.executablePath()) ? playwright.chromium.executablePath() : '/usr/bin/chromium');
    browser = await playwright.chromium.launch({ headless: true, executablePath: executable, args: ['--no-sandbox'] });
    const withPage = async (options, callback) => {
      const viewport = options.viewport || { width: 390, height: 844 };
      const context = await browser.newContext({ viewport, isMobile: viewport.width < 768, hasTouch: viewport.width < 768, serviceWorkers: 'block' });
      const requests = await instrument(context, worker, options);
      context.on('page', observedPage => observedPage.on('pageerror', error => report.pageErrors.push({ scenario: options.name, message: error.message })));
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      try {
        await page.goto(portal + (options.preview ? '?teacher_preview=1&student_id=' + worker.identity.id : ''), { waitUntil: 'domcontentloaded' });
        if (!options.preview) {
          await page.locator('#student-name').fill(worker.identity.name);
          await page.locator('#student-pin').fill(worker.identity.pin);
          await page.locator('#login-btn').click();
        }
        await page.locator(selectors.feature('exams')).waitFor();
        await callback(page, requests, context);
      } catch (error) {
        try { await capture(page, 'failure-' + options.name); } catch (_) { /* preserve the original error */ }
        throw error;
      } finally { await context.close(); }
    };

    await check('real Worker rejects wrong PIN, outsider preview and teacher-only OMR mutation', async () => {
      let response = await worker.request('student-portal/auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: worker.identity.name, pin: 'wrong-test-pin' }) });
      assert.equal(response.status, 401);
      const headers = { authorization: 'Bearer ' + worker.teacherSession.session_token };
      response = await worker.request('student-portal/home?student_id=' + worker.identity.outsiderId, { headers });
      assert.equal(response.status, 403, 'teacher cannot read unrelated student');
      response = await worker.request('student-portal/omr-submit', { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify({ student_id: worker.identity.id, assignment_id: 'qa-navigation-pending', wrong_ids: [2] }) });
      assert.equal(response.status, 401, 'teacher token does not become a student write credential');
    });
    for (const [width, height] of [[360, 640], [360, 800], [390, 844], [800, 1280], [1280, 800], [1440, 900]]) {
      const suffix = width + (height === 640 ? '-compact' : '');
      await check('authenticated student first-screen access ' + width + 'x' + height, () => withPage({ name: 'student-' + suffix, viewport: { width, height } }, async (page, requests) => {
        await capture(page, 'student-home-' + suffix); await assertHome(page);
        assert.equal(requests.filter(r => r.endpoint === 'student-portal/auth' && r.status === 200).length, 1);
        assert.ok(requests.some(r => r.endpoint === 'student-portal/home' && r.status === 200 && r.studentAuthorization));
      }));
    }
    await check('student reaches all retained features and OMR draft survives shared navigation/back', () => withPage({ name: 'student-journey' }, async (page) => {
      await page.locator(selectors.feature('exams')).click();
      await page.locator('#omr-panel-all').waitFor(); await assertNav(page, 'exams');
      assert.equal(await page.locator('#omr-panel-all [data-assignment-id]').count(), 3, 'all assigned exams remain reachable');
      await page.locator('[data-assignment-id="qa-navigation-pending"] [onclick*="renderOmrInput"]').click();
      await page.locator('[data-omr-no="4"]').click(); await assertNav(page, 'exams');
      await capture(page, 'student-omr-390');
      await page.locator(selectors.navItem('more')).click(); await assertNav(page, 'more');
      await capture(page, 'student-more-390');
      for (const label of ['학습 기록', '오답 클리닉', '수업자료 오답', '과제']) assert.ok((await page.locator('#app').innerText()).includes(label), label + ' is discoverable');
      await page.goBack(); await page.locator('#omr-submit-btn').waitFor();
      assert.equal(await page.locator('[data-omr-no="4"]').getAttribute('aria-pressed'), 'true', 'selected wrong number survives back');
      await page.locator(selectors.navItem('more')).click();
      await page.getByRole('button', { name: /학습 기록/ }).click();
      await page.locator('#clinic-learning-history').waitFor(); await assertNav(page, 'more');
      await capture(page, 'student-history-390');
      await page.locator(selectors.navItem('more')).click();
      await page.getByRole('button', { name: /오답 클리닉/ }).click(); await assertNav(page, 'more');
      await capture(page, 'student-clinic-390');
      await page.locator(selectors.navItem('more')).click();
      await page.getByRole('button', { name: /수업자료 오답/ }).click(); await assertNav(page, 'more');
      await capture(page, 'student-materials-390');
    }));
    await check('planner and homework preserve shared five-destination navigation after real PIN authentication', () => withPage({ name: 'student-tools' }, async page => {
      await page.locator(selectors.feature('planner')).click();
      await page.waitForURL(url => url.pathname.includes('/apmath/planner/'));
      await page.getByText('오늘의 합성 복습 계획', { exact: true }).waitFor(); await assertNav(page, 'planner');
      assert.equal(new URL(page.url()).searchParams.has('pin'), false, 'portal does not put PIN into destination URL');
      await capture(page, 'student-planner-390');
      await page.locator(selectors.navItem('home')).click(); await assertHome(page);
      await page.locator(selectors.feature('assignments')).click(); await assertNav(page, 'more');
      await page.getByRole('button', { name: '제출하기', exact: true }).click();
      await page.waitForURL(url => url.pathname.includes('/apmath/homework/'));
      await page.locator('#pin-input').fill(worker.identity.pin);
      await page.getByRole('button', { name: /확인|시작/ }).click();
      await page.getByLabel('사진 선택', { exact: true }).waitFor(); await assertNav(page, 'more');
      await capture(page, 'student-homework-390');
      await page.locator(selectors.navItem('exams')).click(); await page.locator('#omr-panel-all').waitFor(); await assertNav(page, 'exams');
    }));
    await check('lab enters the actual grade hub directly and an experiment retains shared navigation', () => withPage({ name: 'student-labs' }, async page => {
      await page.locator(selectors.feature('labs')).click();
      await page.waitForURL(url => /\/playground\/next\/(?:index\.html)?$/.test(url.pathname));
      await assertNav(page, 'labs');
      assert.equal(new URL(page.url()).hash, '#g8');
      await page.locator('.hub-course[aria-pressed="true"]').waitFor();
      assert.match(await page.locator('.hub-course[aria-pressed="true"]').innerText(), /중2/);
      await capture(page, 'student-lab-hub-390');
      await page.setViewportSize({ width: 800, height: 1280 });
      await capture(page, 'student-lab-hub-800'); await assertNav(page, 'labs');
      await page.setViewportSize({ width: 390, height: 844 });
      const list = page.getByRole('button', { name: '목록으로 보기', exact: true });
      if (await list.isVisible()) await list.click();
      await page.locator('.hub-card a[href*="g8-triangles.html"]').first().click();
      await page.waitForURL(/g8-triangles\.html/); await assertNav(page, 'labs');
      await capture(page, 'student-lab-scene-390');
      await page.setViewportSize({ width: 800, height: 1280 });
      await capture(page, 'student-lab-scene-800'); await assertNav(page, 'labs');
      const stage = await page.locator('.apl-stage').boundingBox();
      assert.ok(stage && stage.height <= 561, 'portrait tablet keeps the existing bounded stage so experiment controls remain close');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator(selectors.navItem('home')).click(); await assertHome(page);
    }));
    for (const [width, height] of [[360, 640], [360, 800], [390, 844]]) {
      const suffix = width + (height === 640 ? '-compact' : '');
      await check('authenticated teacher preview exposes all entries and explanations ' + width + 'x' + height, () => withPage({ name: 'teacher-' + suffix, preview: true, viewport: { width, height } }, async (page, requests) => {
        await capture(page, 'teacher-home-' + suffix); await assertHome(page);
        assert.match(await page.locator('#app').innerText(), /미리보기|읽기 전용/);
        await page.locator(selectors.feature('planner')).click(); await assertNav(page, 'planner');
        assert.match(await page.locator('#app').innerText(), /학생.*인증|PIN|이용.*불가|확인할 수 없/);
        await capture(page, 'teacher-planner-' + suffix);
        await page.locator(selectors.navItem('more')).click(); await assertNav(page, 'more');
        for (const label of ['학습 기록', '오답 클리닉', '수업자료 오답', '과제']) assert.ok((await page.locator('#app').innerText()).includes(label));
        for (const label of ['오답 클리닉', '수업자료 오답']) {
          await page.getByRole('button', { name: new RegExp(label) }).click();
          assert.match(await page.locator('#app').innerText(), /미리보기|읽기 전용|학생.*인증|확인할 수 없/);
          await page.locator(selectors.navItem('more')).click();
        }
        await page.locator(selectors.navItem('exams')).click(); await page.locator('#omr-panel-all').waitFor();
        assert.equal(await page.locator('[onclick*="renderOmrInput"]').count(), 0);
        const denial = await page.evaluate(async () => { try { await apiPost('student-portal/omr-submit', {}); return ''; } catch (error) { return error.message; } });
        assert.match(denial, /저장할 수 없습니다/);
        assert.equal(requests.filter(r => ['POST', 'PATCH', 'PUT', 'DELETE'].includes(r.method)).length, 0, 'preview made zero write requests');
        assert.ok(requests.filter(r => r.endpoint === 'student-portal/home').every(r => r.teacherAuthorization && r.status === 200));
        await capture(page, 'teacher-exams-' + suffix);
      }));
    }
    await check('missing preview target never falls back to an authenticated student session', () => withPage({ name: 'preview-missing-target' }, async (page, requests) => {
      const before = requests.length;
      await page.goto(portal + '?teacher_preview=1', { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { name: /학생 화면/ }).waitFor();
      assert.match(await page.locator('#app').innerText(), /대상|학생 정보|선택/);
      assert.equal(await page.locator('[data-portal-feature]').count(), 0);
      assert.equal(requests.length, before, 'invalid preview does not silently reuse student authentication');
      await capture(page, 'teacher-preview-missing-target-390');
    }));
    await check('teacher child links explain access restrictions and public labs return to the same preview', () => withPage({ name: 'teacher-children', preview: true }, async (page, requests) => {
      await page.locator(selectors.feature('assignments')).click(); await assertNav(page, 'more');
      assert.equal(await page.locator('.assignment-card').count(), 1);
      assert.match(await page.locator('#app').innerText(), /읽기 전용/);
      assert.equal(await page.getByRole('button', { name: '제출하기', exact: true }).count(), 0);
      await capture(page, 'teacher-assignments-390');
      for (const [tool, active] of [['planner', 'planner'], ['homework', 'more']]) {
        const before = requests.length;
        await page.goto(base + '/apmath/' + tool + '/?teacher_preview=1&student_id=' + worker.identity.id + '&assignment_id=qa-navigation-homework', { waitUntil: 'domcontentloaded' });
        await assertNav(page, active);
        assert.match(await page.locator('#app').innerText(), /선생님 미리보기/);
        assert.equal(await page.locator('#pin-input').count(), 0, 'preview never asks for or imports student PIN');
        assert.equal(requests.length, before, 'preview restriction is enforced before student API requests');
        await capture(page, 'teacher-' + tool + '-direct-390');
      }
      await page.locator(selectors.navItem('home')).click(); await assertHome(page);
      await page.locator(selectors.feature('labs')).click(); await assertNav(page, 'labs');
      await capture(page, 'teacher-lab-hub-390');
      await page.locator(selectors.navItem('home')).click(); await assertHome(page);
      const returned = new URL(page.url());
      assert.equal(returned.pathname, new URL(portal).pathname);
      assert.equal(returned.searchParams.get('teacher_preview'), '1');
      assert.equal(returned.searchParams.get('student_id'), worker.identity.id);
      assert.equal(requests.filter(r => ['POST', 'PATCH', 'PUT', 'DELETE'].includes(r.method)).length, 0);
    }));
    for (const preview of [false, true]) {
      const role = preview ? 'teacher' : 'student';
      await check(role + ' uses actual original and mixed readers in exam, solution and answer modes with shared return navigation', () => withPage({ name: role + '-readers', preview }, async (page, requests) => {
        await page.locator(selectors.feature('exams')).click();
        await page.locator('#omr-panel-all').waitFor();
        for (const [assignment, engine] of [['qa-navigation-complete', 'engine'], ['qa-navigation-second', 'mixed_engine']]) {
          const opened = page.waitForEvent('popup');
          await page.locator('[data-assignment-id="' + assignment + '"] [onclick="openOmrReview(\'' + assignment + '\', \'exam\')"]').click();
          const reader = await opened; reader.setDefaultTimeout(45000);
          try {
            await reader.waitForURL(url => url.pathname.endsWith('/archive/' + engine + '.html'));
            const readerUrl = new URL(reader.url());
            assert.equal(readerUrl.pathname, new URL(base).pathname + '/archive/' + engine + '.html', 'reader keeps the GitHub project prefix');
            assert.equal(readerUrl.searchParams.get('studentReview'), '1');
            assert.ok(readerUrl.searchParams.get('outputRequestId'), 'real issued output envelope is used');
            const returnTarget = new URL(readerUrl.searchParams.get('studentReturnTo'), readerUrl.origin);
            assert.equal(returnTarget.pathname, new URL(portal).pathname);
            assert.equal(returnTarget.searchParams.get('view'), 'exams');
            if (preview) {
              assert.equal(returnTarget.searchParams.get('teacher_preview'), '1');
              assert.equal(returnTarget.searchParams.get('student_id'), worker.identity.id);
            }
            assert.equal(returnTarget.searchParams.has('pin'), false);
            assert.equal(returnTarget.searchParams.has('token'), false);
            await reader.locator('#print-area .page').first().waitFor();
            assert.match(await reader.locator('#print-area').innerText(), /합성 검수 문제/);
            await assertNav(reader, 'exams');
            await capture(reader, role + '-' + engine + '-exam-390');
            await reader.locator('#archive2-reader-mode').selectOption('sol');
            await reader.locator('#print-area').getByText(/합성 검수 해설/).first().waitFor();
            await assertNav(reader, 'exams');
            await capture(reader, role + '-' + engine + '-solution-390');
            await reader.locator('#archive2-reader-mode').selectOption('ans');
            await reader.locator('#print-area .ans-v').first().waitFor();
            assert.deepEqual((await reader.locator('#print-area .ans-v').allTextContents()).map(value => value.trim()), ['2', '3'], 'actual answer DOM belongs to the issued synthetic snapshot');
            await assertNav(reader, 'exams');
            await capture(reader, role + '-' + engine + '-answers-390');
            if (engine === 'engine') await reader.locator('#archive2-reader-back').click();
            else await reader.locator(selectors.navItem('exams')).click();
            await reader.locator('#omr-panel-all').waitFor(); await assertNav(reader, 'exams');
            assert.equal(new URL(reader.url()).pathname, new URL(portal).pathname);
            if (preview) assert.equal(new URL(reader.url()).searchParams.get('teacher_preview'), '1');
          } catch (error) {
            try { await capture(reader, 'failure-' + role + '-' + engine + '-390'); } catch (_) { /* preserve original failure */ }
            throw error;
          } finally { await reader.close(); }
        }
        if (preview) assert.equal(requests.filter(r => ['POST', 'PATCH', 'PUT', 'DELETE'].includes(r.method)).length, 0, 'reading never creates a teacher mutation');
      }));
    }
    report.completed = true;
  } finally {
    if (browser) await browser.close(); if (worker) await worker.dispose();
    await new Promise(resolve => server.close(resolve));
    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify({ output, checks: report.checks.length, failures: report.failures, pageErrors: report.pageErrors, screenshots: report.screenshots.length }));
  if (report.failures.length || report.pageErrors.length) process.exitCode = 1;
}

if (require.main === module) run().catch(error => {
  report.fatal = error.stack; fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n'); console.error(error); process.exitCode = 1;
});
