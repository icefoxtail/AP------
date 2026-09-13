const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(process.env.AP_REPORT_DIR || path.join(__dirname, '../reports/three-engine-fast-runtime'));
fs.mkdirSync(out, { recursive: true });
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const tests = [];
    async function check(name, work) {
        try { await work(); tests.push({ name, pass: true }); console.log('PASS', name); }
        catch (error) { tests.push({ name, pass: false, error: String(error.stack) }); console.log('FAIL', name, error.message); }
        fs.writeFileSync(path.join(out, 'lifecycle.json'), JSON.stringify(tests, null, 2));
    }
    try {
        for (const kind of ['mixer', 'wrong']) {
            const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
            const page = await context.newPage();
            const posts = [];
            await context.route('**/api/**', route => { posts.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }); });
            const launcher = kind === 'mixer' ? 'mixer-render-authority-storage-launcher.html' : 'wrong-print-layout-launcher.html?duplex=1&recipients=2';
            await page.goto('http://127.0.0.1:8766/tests/fixtures/' + launcher);
            await page.waitForFunction(() => (window.mixedScreenRuntime || window.wrongScreenRuntime)?.activeSnapshot, null, { timeout: 60000 });
            await page.evaluate(() => {
                window.host = window.mixedFastHost || window.wrongFastHost;
                window.rt = host.runtime;
                window.save = () => ({ node: document.getElementById('print-area'), snapshot: rt.activeSnapshot, candidate: rt.committedCandidate, url: location.href, mode: (window.AppState || window.state).mode });
                window.same = old => Object.entries(old).every(([key, value]) => save()[key] === value);
            });
            await check(`${kind}: shared transaction cache restores same root`, async () => {
                const result = await page.evaluate(async () => {
                    const before = save(); await switchMode('ans'); await switchMode('exam');
                    return { root: document.getElementById('print-area') === before.node, cache: rt.inspect().attempts.at(-1).cacheStatus };
                }); assert.deepEqual(result, { root: true, cache: 'HIT' });
            });
            await check(`${kind}: latest wins preserves visible root during a blocked build`, async () => {
                const result = await page.evaluate(async () => {
                    const original = MathJax.typesetPromise, old = save();
                    let entered, resume; const started = new Promise(r => { entered = r; });
                    MathJax.typesetPromise = async nodes => { entered(); await new Promise(r => { resume = r; }); return original.call(MathJax, nodes); };
                    const first = switchMode('sol'); await started;
                    const preserved = same(old); const second = switchMode('ans');
                    MathJax.typesetPromise = original; resume();
                    const results = await Promise.all([first, second]);
                    return { preserved, first: results[0].code, last: results[1].ok, mode: rt.committedCandidate.mode };
                }); assert.deepEqual(result, { preserved: true, first: 'DISCARDED_STALE', last: true, mode: 'ans' });
            });
            await check(`${kind}: failed math build rolls back without fallback publication`, async () => {
                const result = await page.evaluate(async () => {
                    const old = save(), original = MathJax.typesetPromise;
                    MathJax.typesetPromise = async () => { throw Error('INJECTED_MATH_FAILURE'); };
                    const outcome = await rt.request({ type: 'FORCED_REBUILD' }); MathJax.typesetPromise = original;
                    return { ok: outcome.ok, preserved: same(old), staging: document.querySelectorAll('[data-fast-build]').length };
                }); assert.deepEqual(result, { ok: false, preserved: true, staging: 0 });
                await page.evaluate(() => rt.request({ type: 'FORCED_REBUILD' }));
            });
            await check(`${kind}: commit failure restores DOM, mode, history and snapshot`, async () => {
                const result = await page.evaluate(async () => {
                    const old = save(), original = history.replaceState;
                    history.replaceState = () => { throw Error('INJECTED_COMMIT_FAILURE'); };
                    const outcome = await switchMode('exam'); history.replaceState = original;
                    return { ok: outcome.ok, preserved: same(old) };
                }); assert.deepEqual(result, { ok: false, preserved: true });
                await page.evaluate(() => rt.request({ type: 'FORCED_REBUILD' }));
            });
            await check(`${kind}: prewarm leaves DOM/state/URL unchanged and performs zero API effects`, async () => {
                const beforePosts = posts.length;
                const result = await page.evaluate(async () => {
                    const old = save(); const outcome = await rt.prewarm('sol'); return { ok: outcome.ok, preserved: same(old) };
                }); assert.deepEqual(result, { ok: true, preserved: true }); assert.equal(posts.length, beforePosts);
            });
            await check(`${kind}: print snapshot mutation rebuilds and repeated dry-run reaches PRINT_READY`, async () => {
                const result = await page.evaluate(async () => {
                    const old = rt.activeSnapshot;
                    document.querySelector('#print-area .ans-v').textContent = '$MUTATED$';
                    await host.preflight(); const repaired = rt.activeSnapshot !== old;
                    const busy = await switchMode('sol'); host.unlockPrint();
                    const url = new URL(location.href); url.searchParams.set('printDryRun', '1'); history.replaceState(null, '', url);
                    let calls = 0; const original = window.print; window.print = () => { calls++; };
                    await (window.mixedFastHost ? safePrint() : clinicSafePrint());
                    await (window.mixedFastHost ? safePrint() : clinicSafePrint());
                    window.print = original;
                    return { repaired, busy: busy.code, calls, ready: JSON.parse(document.documentElement.dataset.apPrintReadiness).state };
                }); assert.deepEqual(result, { repaired: true, busy: 'PRINT_TRANSACTION_BUSY', calls: 0, ready: 'PRINT_READY' });
            });
            if (kind === 'mixer') {
                await check('mixer: rapid mode/header/QPP changes compose, QR toggle updates output', async () => {
                    const result = await page.evaluate(async () => {
                        const results = await Promise.all([switchMode('exam'), setPrintHeaderOptions({ title: '통합 헤더' }), changeQpp(6)]);
                        await setQrOutputParam('sol', true);
                        return { ok: results.at(-1).ok, mode: AppState.mode, title: AppState.printHeaderOptions.title, qpp: AppState.qpp, qr: document.querySelectorAll('#print-area .page-qr canvas').length, source: rt.committedCandidate.source.businessData.key };
                    }); assert.equal(result.ok, true); assert.equal(result.mode, 'exam'); assert.equal(result.title, '통합 헤더'); assert.equal(result.qpp, 6); assert.equal(result.qr, 1);
                });
            } else {
                await check('wrong: failed source request preserves previous recipient packet', async () => {
                    const result = await page.evaluate(async () => {
                        const old = save();
                        const payload = { mode: 'student', students: [{ studentName: 'FAILED', wrongItems: [{ sourceArchiveFile: location.origin + '/missing-bank.js', questionNo: 1 }] }] };
                        const outcome = await rt.request({ type: 'SOURCE_CHANGE', payload: { payload, mode: 'exam' } });
                        return { ok: outcome.ok, preserved: same(old) };
                    }); assert.deepEqual(result, { ok: false, preserved: true });
                });
                await check('wrong: review composition and recipient boundary survive source replacement', async () => {
                    const result = await page.evaluate(async () => {
                        const payload = JSON.parse(JSON.stringify(state.payload)); payload.printTitle = '교체된 오답지';
                        const outcome = await rt.request({ type: 'SOURCE_CHANGE', payload: { payload, mode: 'review' } });
                        return { ok: outcome.ok, mode: state.mode, text: document.getElementById('print-area').textContent };
                    }); assert.equal(result.ok, true); assert.equal(result.mode, 'review'); assert.match(result.text, /검수 학생 A/); assert.match(result.text, /검수 학생 B/);
                });
            }
            await context.close();
        }
    } finally { await browser.close(); }
    if (tests.some(t => !t.pass)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
