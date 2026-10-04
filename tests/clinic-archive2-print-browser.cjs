// Self-contained browser regression: deploy under /AP------/, with no external CDN.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const oldEngine = execFileSync('git', ['show', 'HEAD:apmath/wrong_print_engine.html'], { cwd: root, encoding: 'utf8' });
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    // Only project-relative vendor URLs work on GitHub Pages.
    if (url.pathname.startsWith('/archive/vendor/')) { res.writeHead(404).end(); return; }
    let pathname = decodeURIComponent(url.pathname).replace(/^\/AP------\//, '/');
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    try {
        res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
        res.end(url.searchParams.has('baseline') && pathname === '/apmath/wrong_print_engine.html' ? oldEngine : fs.readFileSync(file));
    } catch { res.writeHead(404).end(); }
});
const results = [];
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        async function open(payload, query = '', baseline = false) {
            const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
            const page = await context.newPage();
            const pageErrors = [];
            page.on('pageerror', error => pageErrors.push(error.message));
            page.on('console', message => { if (message.text().startsWith('CLINIC_FULL_PROGRESS')) console.log(message.text()); });
            await page.route('https://cdnjs.cloudflare.com/**', route => baseline
                ? route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(path.join(root, 'archive/vendor/qrious/qrious.min.js'), 'utf8') })
                : route.abort());
            await page.addInitScript(value => sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', JSON.stringify(value)), payload);
            await page.goto(`${origin}/AP------/apmath/wrong_print_engine.html?prewarm=0&${query}${baseline ? '&baseline=1' : ''}`);
            if (process.argv.includes('--full-midterms')) await page.evaluate(() => {
                window.fullProgressTimer = setInterval(() => console.log('CLINIC_FULL_PROGRESS ' + JSON.stringify({ mode: state.mode, event: document.documentElement.dataset.apCommonFastRuntime, pages: document.querySelectorAll('[data-fast-build] .page').length, boxes: document.querySelectorAll('[data-fast-build] .q-box:has(.q-num)').length, status: document.getElementById('clinic-render-message').textContent })), 15000);
            });
            const outcome = await page.evaluate(() => window.__AP_RENDER_READY__);
            // boot() is scheduled, so the first readiness promise can still be RENDER_NOT_STARTED.
            if (outcome?.code === 'RENDER_NOT_STARTED') await page.waitForFunction(() => window.wrongScreenRuntime?.busy || document.documentElement.dataset.apRenderReady === 'true');
            await page.evaluate(async () => {
                const outcome = await Promise.race([window.__AP_RENDER_READY__, new Promise(resolve => setTimeout(() => resolve({ ok: false, code: 'BROWSER_RENDER_TIMEOUT' }), 180000))]);
                if (outcome.code === 'BROWSER_RENDER_TIMEOUT') throw Error(JSON.stringify(outcome));
                return outcome;
            });
            return { context, page, pageErrors };
        }
        const file = `${origin}/AP------/tests/fixtures/wrong-print-overflow-bank.js`;
        const payload = { mode: 'grade', gradeName: '중3', printTitle: '중3 2학기 중간 오답', gradeWrongItems: [{ archiveFile: file, questionNo: 2 }], options: { pageBreakByStudent: false } };
        const before = await open(payload, '', true);
        const failure = await before.page.evaluate(async () => ({ outcome: await window.__AP_RENDER_READY__, text: document.getElementById('print-area').textContent }));
        assert.equal(failure.outcome.ok, false);
        assert.equal(failure.text.trim(), '');
        results.push({ name: 'Before fix: project subpath produces failed render and blank output', ...failure });
        console.log('Reproduced:', JSON.stringify(failure));
        await before.context.close();

        const fixed = await open(payload);
        assert.equal((await fixed.page.evaluate(() => window.__AP_RENDER_READY__)).ok, true);
        assert.equal(await fixed.page.locator('.q-box:has(.q-num)').count(), 1);
        assert.equal(await fixed.page.locator('#clinic-render-status').isVisible(), false);
        assert.equal(await fixed.page.locator('#btn-print-gdi').isEnabled(), true);
        assert.deepEqual(fixed.pageErrors, []);
        for (const mode of ['sol', 'ans', 'exam']) {
            assert.equal((await fixed.page.evaluate(mode => switchMode(mode), mode)).ok, true);
            assert.ok(await fixed.page.locator('.page').count());
        }
        await fixed.page.evaluate(() => {
            window.testNativeCalls = [];
            window.APNativePrint.printGdi = async (area, opts) => { testNativeCalls.push({ pages: area.querySelectorAll('.page').length, copies: opts.copies, duplex: opts.duplex }); return { pageCount: area.querySelectorAll('.page').length }; };
            window.print = () => { throw Error('Unexpected browser printing'); };
            document.getElementById('print-copies').value = '3';
        });
        assert.equal((await fixed.page.evaluate(() => clinicSafePrint('gdi'))).ok, true);
        assert.deepEqual(await fixed.page.evaluate(() => testNativeCalls), [{ pages: 1, copies: 3, duplex: true }]);
        results.push({ name: 'After fix: subpath + blocked CDN + all output modes + GDI copies/duplex', status: 'PASS' });
        const activeHTML = await fixed.page.locator('#print-area').innerHTML();
        await fixed.page.route('**/missing-bank.js', route => route.fulfill({ status: 404, body: 'missing' }));
        const missing = { ...payload, gradeWrongItems: [{ archiveFile: origin + '/missing-bank.js', questionNo: 2 }] };
        const failed = await fixed.page.evaluate(payload => wrongScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { payload } }), missing);
        assert.equal(failed.ok, false);
        assert.equal(await fixed.page.locator('#clinic-render-status').getAttribute('data-status'), 'error');
        assert.equal(await fixed.page.locator('#btn-print-gdi').isEnabled(), false);
        assert.equal(await fixed.page.locator('#print-area').innerHTML(), activeHTML);
        assert.equal((await fixed.page.evaluate(() => clinicSafePrint('gdi'))).ok, false);
        assert.equal(await fixed.page.evaluate(() => testNativeCalls.length), 1);
        assert.equal((await fixed.page.evaluate(payload => wrongScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { payload } }), payload)).ok, true);
        results.push({ name: 'Failed source is visible, preserves previous pages, blocks print, and recovers', status: 'PASS' });
        const progressing = await fixed.page.evaluate(async payload => {
            let release, entered;
            const start = new Promise(resolve => { entered = resolve; });
            const original = APExamRenderExecutor;
            window.APExamRenderExecutor = { ...original, renderComposed: async (...args) => { entered(); await new Promise(resolve => { release = resolve; }); return original.renderComposed(...args); } };
            const pending = wrongScreenRuntime.request({ type: 'FORCED_REBUILD' });
            await start;
            const status = document.getElementById('clinic-render-status').dataset.status;
            const disabled = document.getElementById('btn-print-gdi').disabled;
            release();
            const outcome = await pending;
            window.APExamRenderExecutor = original;
            return { status, disabled, ok: outcome.ok };
        }, payload);
        assert.deepEqual(progressing, { status: 'loading', disabled: true, ok: true });
        results.push({ name: 'A running render reports progress and disables printing until commit', status: 'PASS' });
        const sourceIdentity = await fixed.page.evaluate(() => {
            const bank = [{ id: 1, content: 'objective' }, { id: 1, content: 'subjective' }];
            const item = { archiveFile: 'exams/test.js', questionNo: 1, sourceQuestionOrdinal: 2 };
            const compact = compactWrongItem(item);
            return { content: findQuestionInBank(bank, item).content, qrOrdinal: expandWrongItem(compact).sourceQuestionOrdinal, invalidOrdinal: findQuestionInBank(bank, { ...item, sourceQuestionOrdinal: 3 }) };
        });
        assert.deepEqual(sourceIdentity, { content: 'subjective', qrOrdinal: 2, invalidOrdinal: null });
        results.push({ name: 'Archive 2.0 duplicate ids restore the canonical ordinal, including compact QR', status: 'PASS' });
        const output = path.join(root, 'reports/clinic-print-20260928');
        fs.mkdirSync(output, { recursive: true });
        await fixed.page.evaluate(() => document.getElementById('clinic-print-error')?.remove());
        await fixed.page.waitForFunction(() => document.getElementById('clinic-render-status').dataset.status === 'ready');
        assert.equal(await fixed.page.locator('#btn-print').isEnabled(), true);
        assert.equal(await fixed.page.locator('#btn-print-gdi').isEnabled(), true);
        await fixed.page.screenshot({ path: path.join(output, 'grade-output.png'), fullPage: true });
        await fixed.context.close();
        const recipientRun = await open({ ...payload, recipients: [{ studentName: '검증 학생 A', packetKey: 'fixture-a' }, { studentName: '검증 학생 B', packetKey: 'fixture-b' }] });
        assert.equal((await recipientRun.page.evaluate(() => window.__AP_RENDER_READY__)).ok, true);
        assert.deepEqual(await recipientRun.page.locator('.page-qr').evaluateAll(nodes => nodes.map(node => node.dataset.qrTargetKey)), ['packet:fixture-a', 'packet:fixture-b']);
        assert.equal(await recipientRun.page.locator('.q-box:has(.q-num)').count(), 2);
        for (const mode of ['sol', 'ans', 'review']) assert.equal((await recipientRun.page.evaluate(mode => switchMode(mode), mode)).ok, true);
        results.push({ name: 'Grade recipient packets retain separate QR ownership and solution/review composition', status: 'PASS' });
        await recipientRun.context.close();

        // --full-midterms also checks whole-grade scale using the stored set's short QR.
        const examDir = path.join(root, 'archive/exams/original/middle/m3/2mid');
        const realFiles = fs.readdirSync(examDir).filter(name => name.endsWith('.js'));
        const full = process.argv.includes('--full-midterms');
        const realItems = realFiles.flatMap(name => {
            const scope = {};
            new Function('window', fs.readFileSync(path.join(examDir, name), 'utf8'))(scope);
            const numbers = full ? scope.questionBank.map((_, i) => i + 1) : [1, 2];
            return numbers.map(questionNo => ({ archiveFile: 'exams/original/middle/m3/2mid/' + name, questionNo, sourceQuestionOrdinal: questionNo }));
        });
        const real = await open({ ...payload, publicSetKey: 'fixture-grade-public-set', gradeWrongItems: realItems });
        console.log('Actual midterm exam ready:', realItems.length);
        const realOutcome = await real.page.evaluate(() => window.__AP_RENDER_READY__);
        assert.equal(realOutcome.ok, true, JSON.stringify(realOutcome));
        assert.equal(await real.page.locator('.q-box:has(.q-num)').count(), realItems.length);
        assert.equal(await real.page.locator('.sol-load-warn').count(), 0);
        assert.equal(await real.page.locator('mjx-merror').count(), 0);
        for (const mode of ['sol', 'ans']) {
            console.log('Checking real midterm mode:', mode);
            const modeOutcome = await real.page.evaluate(mode => Promise.race([switchMode(mode), new Promise(resolve => setTimeout(() => resolve({ ok: false, code: 'BROWSER_MODE_TIMEOUT' }), 600000))]), mode);
            assert.equal(modeOutcome.ok, true, JSON.stringify(modeOutcome));
        }
        results.push({ name: 'Actual middle-3 semester-2 midterm files render across exam/solution/answer', files: realFiles.length, questions: realItems.length, status: 'PASS' });
        await real.page.screenshot({ path: path.join(output, 'real-midterm-answer.png'), fullPage: !full });
        await real.context.close();
        const filterPage = await browser.newPage({ viewport: { width: 500, height: 850 } });
        await filterPage.goto(`${origin}/AP------/tests/fixtures/clinic-period-filter.html`);
        assert.equal(await filterPage.locator('#clinic-print-exam-year').inputValue(), '2025');
        assert.equal(await filterPage.locator('.clinic-print-exam-row').count(), 2);
        await filterPage.locator('[data-exam-period="1final"]').click();
        assert.equal(await filterPage.locator('.clinic-print-exam-row').count(), 1);
        assert.ok((await filterPage.locator('.clinic-print-exam-row').textContent()).includes('1학기_기말'));
        await filterPage.locator('#clinic-print-exam-year').selectOption('all');
        await filterPage.locator('[data-exam-period="2mid"]').click();
        assert.equal(await filterPage.locator('.clinic-print-exam-row').count(), 3);
        await filterPage.locator('#select-visible').click();
        assert.equal(await filterPage.locator('input[name="clinic-print-exam"]:checked').count(), 3);
        await filterPage.reload();
        assert.equal(await filterPage.locator('#clinic-print-exam-year').inputValue(), 'all');
        await filterPage.locator('#clinic-print-exam-year').selectOption('2025');
        await filterPage.screenshot({ path: path.join(output, 'semester-filter.png') });
        await filterPage.close();
        results.push({ name: 'Semester cards + latest source year + visible-only selection + reopening persistence', status: 'PASS' });
        fs.writeFileSync(path.join(output, full ? 'browser-full-results.json' : 'browser-results.json'), JSON.stringify(results, null, 2));
        console.log(JSON.stringify(results, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
