// Informational local Chrome measurements, never a machine-independent speed gate.
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const rows = [];
    try {
        for (const kind of ['mixer', 'wrong']) for (const port of [8767, 8766]) {
            const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
            await page.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
            const launcher = kind === 'mixer' ? 'mixer-render-authority-storage-launcher.html' : 'wrong-print-layout-launcher.html?duplex=1&recipients=2';
            await page.goto(`http://127.0.0.1:${port}/tests/fixtures/${launcher}`);
            await page.waitForURL(/\/(mixed_engine|wrong_print_engine)\.html\?/);
            await page.waitForFunction(() => document.querySelector('#print-area .page'));
            await page.evaluate(() => window.__AP_RENDER_READY__);
            const samples = await page.evaluate(async () => {
                const samples = [];
                for (const mode of ['sol', 'ans', 'exam', 'sol', 'ans', 'exam']) {
                    const started = performance.now();
                    await switchMode(mode); const outcome = await window.__AP_RENDER_READY__;
                    const runtime = window.mixedScreenRuntime || window.wrongScreenRuntime;
                    samples.push({ mode, ms: Math.round((performance.now() - started) * 10) / 10, ok: outcome.ok,
                        cache: runtime?.inspect().attempts.at(-1)?.cacheStatus || 'LEGACY', pages: document.querySelectorAll('#print-area .page').length });
                }
                return samples;
            });
            assert.ok(samples.every(s => s.ok));
            if (port === 8766) assert.ok(samples.slice(3).every(s => s.cache === 'HIT'));
            rows.push({ engine: kind, implementation: port === 8766 ? 'fast' : 'baseline', samples });
            await page.close();
        }
    } finally { await browser.close(); }
    fs.writeFileSync(path.resolve(__dirname, '../reports/three-engine-fast-runtime/performance.json'), JSON.stringify(rows, null, 2));
    console.log(JSON.stringify(rows.map(r => ({ engine: r.engine, implementation: r.implementation, warmMedianMs: r.samples.slice(3).map(s => s.ms).sort((a, b) => a - b)[1] })), null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
