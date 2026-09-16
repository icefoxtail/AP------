const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(process.env.AP_REPORT_DIR || path.join(__dirname, '../reports/three-engine-fast-runtime'));
const base = 'http://127.0.0.1:8766';
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = [];
    async function check(name, work) {
        try { await work(); results.push({ name, pass: true }); console.log('PASS', name); }
        catch (error) { results.push({ name, pass: false, error: String(error.stack) }); console.log('FAIL', name, error.message); }
        fs.writeFileSync(path.join(out, 'protocols.json'), JSON.stringify(results, null, 2));
    }
    async function ready(page) {
        const limit = Date.now() + 120000;
        while (Date.now() < limit) {
            const outcome = await page.evaluate(() => window.__AP_RENDER_READY__);
            if (outcome && outcome.code !== 'RENDER_NOT_STARTED') { assert.equal(outcome.ok, true, JSON.stringify(outcome)); return outcome; }
            await page.waitForTimeout(100);
        }
        throw Error('READY_TIMEOUT');
    }
    try {
        await check('Preview only accepts parent payload and commits replacements atomically', async () => {
            const page = await browser.newPage();
            await page.goto(base + '/tests/fixtures/wrong-print-preview-parent.html');
            const frame = page.frames().find(f => f.url().includes('wrong_print_engine'));
            await ready(frame);
            assert.match(await frame.locator('#print-area').textContent(), /PARENT_AUTHORITY_STUDENT/);
            const result = await frame.evaluate(async () => {
                const previous = { root: document.getElementById('print-area'), payload: state.payload };
                const payload = JSON.parse(JSON.stringify(state.payload)); payload.printTitle = '새 부모 제목';
                let entered, resume; const started = new Promise(r => { entered = r; }); const original = MathJax.typesetPromise;
                MathJax.typesetPromise = async nodes => { entered(); await new Promise(r => { resume = r; }); return original.call(MathJax, nodes); };
                window.dispatchEvent(new MessageEvent('message', { origin: location.origin, data: { type: 'AP_PRINT_PREVIEW', payload, mode: 'sol' } }));
                await started;
                const preserved = document.getElementById('print-area') === previous.root && state.payload === previous.payload;
                MathJax.typesetPromise = original; resume(); await __AP_RENDER_READY__;
                return { preserved, title: state.payload.printTitle, mode: state.mode, sources: document.getElementById('print-area').textContent.includes('STALE_STORAGE_MUST_NOT_RENDER') };
            });
            assert.deepEqual(result, { preserved: true, title: '새 부모 제목', mode: 'sol', sources: false });
            await page.screenshot({ path: path.join(out, 'preview-parent.png'), fullPage: true });
            await page.close();
        });
        for (const keyKind of ['packet', 'set', 'compact']) await check(`Wrong public ${keyKind} route retains review sections and blocks editing modes`, async () => {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(base + '/tests/fixtures/wrong-print-layout-launcher.html?duplex=1&recipients=2');
            await page.waitForURL('**/wrong_print_engine.html?**'); await ready(page);
            const payload = await page.evaluate(() => state.payload);
            await context.route('**/api/wrong-clinics/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, payload }) }));
            const url = await page.evaluate(({ keyKind, payload }) => {
                const target = new URL(location.href); target.search = '';
                if (keyKind === 'compact') target.searchParams.set('wp', encodeWrongQrPayload(buildStudentQrPayload(payload, payload.students[0])));
                else target.searchParams.set(keyKind, 'fixture-public-key');
                target.searchParams.set('qr', '1'); target.searchParams.set('mode', 'review'); target.searchParams.set('printDryRun', '1'); return target.href;
            }, { keyKind, payload });
            await page.goto(url); await ready(page);
            const result = await page.evaluate(async () => {
                const before = state.mode; await switchMode('exam');
                await wrongScreenRuntime.request({ type: 'MODE_CHANGE', requestedMode: 'exam' });
                return { before, after: state.mode, pages: document.querySelectorAll('#print-area .page').length, text: document.getElementById('print-area').textContent, print: await clinicSafePrint() };
            });
            assert.equal(result.before, 'review'); assert.equal(result.after, 'review'); assert.ok(result.pages >= 2); assert.match(result.text, /검수 학생 A/); assert.equal(result.print.ok, true);
            await page.pdf({ path: path.join(out, `public-${keyKind}.pdf`), preferCSSPageSize: true });
            await context.close();
        });
        for (const kind of ['mixer', 'wrong']) for (const fallback of ['explicit', 'missing-executor']) await check(`${kind}: ${fallback} fallback remains operational`, async () => {
            const context = await browser.newContext(); const page = await context.newPage();
            if (fallback === 'missing-executor') await context.route('**/exam-render-executor.js*', route => route.abort());
            await page.goto(base + '/tests/fixtures/' + (kind === 'mixer' ? 'mixer-render-authority-storage-launcher.html' : 'wrong-print-layout-launcher.html?duplex=1'));
            await page.waitForURL(/\/(mixed_engine|wrong_print_engine)\.html\?/);
            if (fallback === 'explicit') { const url = new URL(page.url()); url.searchParams.set('runtime', 'legacy'); await page.goto(url.href); }
            await ready(page);
            assert.equal(await page.evaluate(() => !!(window.mixedFastHost || window.wrongFastHost)), false);
            assert.ok(await page.locator('#print-area .page').count()); await context.close();
        });
    } finally { await browser.close(); }
    if (results.some(r => !r.pass)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
