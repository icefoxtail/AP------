const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.resolve(__dirname, '../reports/three-engine-fast-polish');
fs.mkdirSync(out, { recursive: true });
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = [];
    try {
        for (const port of [8768, 8766]) {
            const context = await browser.newContext();
            const page = await context.newPage();
            page.on('pageerror', error => console.error(port, String(error)));
            let requests = 0, offline = false;
            await context.route('**/wrong-print-duplex-bank.js*', route => { requests++; return offline ? route.abort() : route.continue(); });
            await page.goto(`http://127.0.0.1:${port}/tests/fixtures/wrong-print-layout-launcher.html?duplex=1&recipients=2`);
            try { await page.waitForFunction(() => window.wrongScreenRuntime?.activeSnapshot, null, { timeout: 60000 }); }
            catch (error) { console.error(port, await page.evaluate(async () => ({ outcome: await window.__AP_RENDER_READY__, diagnostic: document.documentElement.dataset.apCommonFastRuntime }))); throw error; }
            await page.evaluate(() => wrongScreenRuntime.whenIdle());
            const initialRequests = requests;
            const switches = await page.evaluate(async () => {
                const rows = [];
                for (const mode of ['sol', 'ans', 'exam', 'sol', 'ans', 'exam']) {
                    const start = performance.now(); const result = await switchMode(mode);
                    rows.push({ mode, ok: result.ok, ms: performance.now() - start, cache: wrongScreenRuntime.inspect().attempts.at(-1).cacheStatus });
                }
                return rows;
            });
            const requestsDuringSwitch = requests - initialRequests;
            offline = true;
            const offlineSwitch = await page.evaluate(() => switchMode('sol'));
            offline = false;
            await page.evaluate(() => wrongScreenRuntime.request({ type: 'FORCED_REBUILD' }));
            await page.evaluate(() => switchMode('exam'));
            const print = await page.evaluate(async () => {
                const original = HTMLCanvasElement.prototype.toDataURL;
                let encodes = 0;
                HTMLCanvasElement.prototype.toDataURL = function (...args) { encodes++; return original.apply(this, args); };
                const canvases = document.querySelectorAll('#print-area canvas').length;
                const durations = [];
                try {
                    for (let i = 0; i < 5; i++) {
                        const start = performance.now(); await wrongFastHost.preflight(); durations.push(performance.now() - start); wrongFastHost.unlockPrint();
                    }
                    const normalEncodes = encodes;
                    const before = wrongScreenRuntime.activeSnapshot;
                    document.querySelector('#print-area canvas').getContext('2d').fillRect(0, 0, 10, 10);
                    await wrongFastHost.preflight(); wrongFastHost.unlockPrint();
                    return { canvases, normalEncodes, durations, mutationRebuilt: wrongScreenRuntime.activeSnapshot !== before };
                } finally { HTMLCanvasElement.prototype.toDataURL = original; }
            });
            assert.ok(switches.every(row => row.ok));
            assert.equal(print.mutationRebuilt, true);
            if (port === 8766) {
                assert.equal(requestsDuringSwitch, 0, 'cached bank must not be fetched or reparsed on mode switches');
                assert.equal(offlineSwitch.ok, true, 'committed source must remain usable after network loss');
                assert.equal(print.normalEncodes, print.canvases * 5, 'each preflight must verify each QR exactly once');
                const recovery = await page.evaluate(async () => {
                    const original = window.print; let calls = 0;
                    window.print = () => { calls++; throw Error('INJECTED_PRINT_FAILURE'); };
                    try {
                        const pair = await Promise.all([clinicSafePrint(), clinicSafePrint()]);
                        const mode = await switchMode('ans');
                        return { calls, codes: pair.map(r => r.code), canRenderAgain: mode.ok, buttonEnabled: !document.getElementById('btn-print').disabled };
                    } finally { window.print = original; }
                });
                assert.deepEqual(recovery, { calls: 1, codes: ['INJECTED_PRINT_FAILURE', 'PRINT_TRANSACTION_BUSY'], canRenderAgain: true, buttonEnabled: true });
                print.failureRecovery = recovery;
            }
            const bank = [{ id: 1, content: '함수 $f(x)=x^2+1$을 정리하시오.', answer: '$7$', solution: Array.from({ length: 70 }, (_, i) => `풀이 ${i + 1}: $x^2+2x+1=(x+1)^2$이다.<br>`).join('') }];
            await context.route('**/polish-long.js*', route => route.fulfill({ contentType: 'text/javascript', body: `window.questionBank=${JSON.stringify(bank)};` }));
            const longSolution = await page.evaluate(async () => {
                const original = MathJax.typesetPromise;
                let calls = 0, targetElements = 0;
                MathJax.typesetPromise = function (nodes) {
                    calls++; targetElements += [...nodes].reduce((sum, node) => sum + node.querySelectorAll('*').length + 1, 0);
                    return original.call(this, nodes);
                };
                try {
                    const file = location.origin + '/tests/fixtures/polish-long.js';
                    const payload = { mode: 'student', printTitle: '긴 해설 성능 검수', students: [{ studentName: '검수', wrongItems: [{ sourceArchiveFile: file, archiveFile: file, questionNo: 1, sourceQuestionNo: 1 }] }] };
                    const start = performance.now();
                    const outcome = await wrongScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { payload, mode: 'sol' } });
                    return { ok: outcome.ok, ms: performance.now() - start, calls, targetElements, mathMs: window.__AP_RENDER_METRICS__?.mathJaxTotalMs, layoutBarriers: window.__AP_RENDER_METRICS__?.layoutBarrierCount, pages: [...document.querySelectorAll('#print-area .page')].map(p => p.textContent.replace(/\s+/g, ' ').trim()) };
                } finally { MathJax.typesetPromise = original; }
            });
            assert.equal(longSolution.ok, true);
            if (port === 8766) { assert.deepEqual(longSolution.pages, results[0].longSolution.pages); assert.ok(longSolution.targetElements < results[0].longSolution.targetElements); }
            results.push({ implementation: port === 8766 ? 'improved' : 'before', initialRequests, requestsDuringSwitch, offlineSwitch: { ok: offlineSwitch.ok, code: offlineSwitch.code }, switches, print, longSolution });
            fs.writeFileSync(path.join(out, 'focused-performance.json'), JSON.stringify(results, null, 2));
            await context.close();
        }
    } finally { await browser.close(); }
    console.log(JSON.stringify(results.map(row => ({ implementation: row.implementation, requestsDuringSwitch: row.requestsDuringSwitch, offlineSwitch: row.offlineSwitch, printQrEncodes: row.print.normalEncodes, printMutationRebuilt: row.print.mutationRebuilt })), null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
