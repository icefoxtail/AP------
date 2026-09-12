// Compare the frozen reference checkout on :8767 with the integration on :8766.
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '../reports/three-engine-fast-runtime');
fs.mkdirSync(out, { recursive: true });
const cases = [];
for (const width of [1440, 390]) for (const mode of ['exam', 'sol', 'ans']) {
    for (const qpp of (mode === 'exam' ? [4, 6, 8] : [4])) cases.push({ name: `mixer-${width}-${mode}-${qpp}`, width, launcher: `mixer-render-authority-storage-launcher.html?mode=${mode}&qpp=${qpp}` });
    if (!process.env.AP_MIXER_ONLY) {
        cases.push({ name: `wrong-${width}-${mode}`, width, launcher: `wrong-print-layout-launcher.html?duplex=1&recipients=2&mode=${mode}` });
    }
}
if (!process.env.AP_MIXER_ONLY) for (const payloadMode of ['class', 'grade', 'type']) cases.push({ name: `wrong-${payloadMode}`, width: 1440, launcher: `wrong-print-modes-launcher.html?payloadMode=${payloadMode}&recipients=2` });
if (process.env.AP_EXTENDED_ONLY) {
    cases.length = 0;
    for (const width of [1440, 390]) for (const mode of ['exam', 'sol', 'ans']) {
        cases.push({ name: `assessment-${width}-${mode}`, width, direct: `/archive/mixed_engine.html?packId=M3_FINAL_UNIT_POLY_10&mode=${mode}&qpp=4&fit=screen` });
        for (const source of ['unitpast', 'clinic-mixed']) cases.push({ name: `${source}-${width}-${mode}`, width, source, mode, launcher: 'mixer-render-authority-storage-launcher.html' });
        cases.push({ name: `wrong-overflow-${width}-${mode}`, width, launcher: `wrong-print-layout-launcher.html?overflow=1&recipients=2&mode=${mode}` });
    }
    cases.push({ name: 'wrong-review', width: 1440, launcher: 'wrong-print-layout-launcher.html?overflow=1&recipients=2&mode=review' });
    cases.push({ name: 'mixer-real-subjective', width: 1440, launcher: 'mixed-print-layout-launcher.html' });
    cases.push({ name: 'mixer-long-solution', width: 1440, long: true, launcher: 'mixer-render-authority-storage-launcher.html?mode=sol' });
    cases.push({ name: 'wrong-long-solution', width: 1440, long: true, launcher: 'wrong-print-layout-launcher.html?overflow=1&mode=sol' });
    for (const payloadMode of ['class', 'grade', 'type']) for (const mode of ['sol', 'ans']) cases.push({ name: `wrong-${payloadMode}-${mode}`, width: 1440, overrideMode: mode, launcher: `wrong-print-modes-launcher.html?payloadMode=${payloadMode}&recipients=2` });
}
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = [];
    try {
        for (const item of cases) {
            if (process.env.AP_CASE_FILTER && !new RegExp(process.env.AP_CASE_FILTER).test(item.name)) continue;
            const pair = [];
            for (const [label, port] of [['baseline', 8767], ['fast', 8766]]) {
                const context = await browser.newContext({ viewport: { width: item.width, height: 1000 } });
                const page = await context.newPage();
                const errors = [];
                page.on('pageerror', e => errors.push(String(e)));
                await context.route('**/api/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));
                if (item.long && item.name.startsWith('wrong')) await context.route('**/wrong-print-overflow-bank.js*', route => route.fulfill({ contentType: 'text/javascript', body: `window.questionBank = ${JSON.stringify([1, 2, 3].map(id => ({ id, content: `긴 해설 ${id}`, answer: '$7$', solution: Array.from({ length: id === 1 ? 70 : 2 }, (_, i) => `풀이 ${i + 1}: $x^2+2x+1=(x+1)^2$이다.<br>`).join('') })))}` }));
                await page.goto(`http://127.0.0.1:${port}` + (item.direct || `/tests/fixtures/${item.launcher}`));
                await page.waitForURL(/\/(?:archive\/mixed_engine|apmath\/wrong_print_engine)\.html\?/);
                if (item.overrideMode || (item.long && item.name.startsWith('mixer'))) {
                    const nextUrl = await page.evaluate(item => {
                        if (item.long) {
                            const key = 'mixedQuestions_render-authority-mixer-storage'; const questions = JSON.parse(localStorage.getItem(key));
                            questions[0].solution = Array.from({ length: 70 }, (_, i) => `풀이 ${i + 1}: $x^2+2x+1=(x+1)^2$이다.<br>`).join(''); localStorage.setItem(key, JSON.stringify(questions));
                        }
                        const url = new URL(location.href); if (item.overrideMode) url.searchParams.set('mode', item.overrideMode); return url.href;
                    }, item);
                    await page.goto(nextUrl);
                }
                if (item.source) {
                    // Run the real storage producers; only selection/catalog inputs
                    // are fixture values. Then follow the production consumer URL.
                    await page.evaluate(async ({ source, mode }) => {
                        const questions = JSON.parse(localStorage.getItem('mixedQuestions_render-authority-mixer-storage'));
                        const key = source === 'unitpast' ? 'unitpast_fast_parity' : 'clinic_fast_parity';
                        if (source === 'unitpast') {
                            const code = await (await fetch('/archive/unit-past-exams.js')).text();
                            const fn = code.slice(code.indexOf('function storeMixedPayload'), code.indexOf('function appendSessionHash'));
                            const store = new Function('getProfile', 'getPaperSources', 'core', fn + '; return storeMixedPayload;')(
                                () => ({ grade: 'M3', gradeLabel: '중3' }), () => [{ label: '단원별 기출 출처' }],
                                { getSubUnitLabel: () => '다항식', getDifficultyBucket: () => '중', getQuestionUid: q => q.sourceQuestionUid });
                            store({ key: 'poly', name: '다항식', course: '수학' }, { title: '단원별 기출 통합 검수', snapshotKey: key, records: [] }, questions);
                        } else {
                            const code = await (await fetch('/apmath/js/core.js')).text();
                            const fn = code.slice(code.indexOf('function saveClinicMixedPayload'), code.indexOf('async function openClinicWorksheet'));
                            const api = new Function('getJsArchiveBaseUrl', fn + '; return { saveClinicMixedPayload, buildMixedEngineClinicUrl };')(() => location.origin + '/archive/');
                            api.saveClinicMixedPayload(key, questions, { title: 'Clinic Mixed 통합 검수', source: 'apmath_clinic', qpp: 4 });
                            window.__fixtureClinicUrl = api.buildMixedEngineClinicUrl(key, 4);
                        }
                        const url = new URL(window.__fixtureClinicUrl || '/archive/mixed_engine.html', location.origin);
                        url.searchParams.set('key', key); url.searchParams.set('mode', mode); url.searchParams.set('qpp', '4'); url.searchParams.set('fit', 'screen');
                        location.replace(url);
                    }, { source: item.source, mode: item.mode });
                    await page.waitForURL(/key=(unitpast|clinic)_fast_parity/);
                }
                // This bundled Playwright treats an async waitForFunction
                // predicate as truthy before resolution. Poll the resolved
                // readiness outcome explicitly so pack loading cannot pass early.
                let ready;
                const deadline = Date.now() + 120000;
                do {
                    ready = await page.evaluate(() => window.__AP_RENDER_READY__);
                    if (ready && ready.code !== 'RENDER_NOT_STARTED') break;
                    await page.waitForTimeout(100);
                } while (Date.now() < deadline);
                await page.evaluate(() => document.fonts.ready);
                await page.waitForTimeout(100);
                const capture = await page.evaluate(() => {
                    const normalize = text => text.replace(/https?:\/\/127\.0\.0\.1:\d+/g, 'LOCAL').replace(/\?v=\d+/g, '').replace(/\s+/g, ' ').trim();
                    return [...document.querySelectorAll('#print-area .page')].map(page => {
                        const rect = page.getBoundingClientRect();
                        const scale = rect.width / page.offsetWidth;
                        return { text: normalize(page.textContent), classes: page.className,
                            blocks: [...page.querySelectorAll('.q-box,.ans-cell:not(.ans-cell-empty)')].map(node => {
                                const r = node.getBoundingClientRect();
                                return { text: normalize(node.textContent), x: Math.round((r.x - rect.x) / scale), y: Math.round((r.y - rect.y) / scale), width: Math.round(r.width / scale), height: Math.round(r.height / scale) };
                            }),
                            images: [...page.querySelectorAll('img')].map(i => ({ src: normalize(i.getAttribute('src')), loaded: i.complete && i.naturalWidth > 0 })),
                            qr: page.querySelectorAll('.page-qr canvas').length };
                    });
                });
                await page.screenshot({ path: path.join(out, `${item.name}-${label}.png`), fullPage: true });
                if (label === 'baseline' && process.env.AP_PRINT_BASELINE) await page.pdf({ path: path.join(out, `${item.name}-baseline.pdf`), preferCSSPageSize: true, printBackground: true });
                if (label === 'fast') {
                    const host = await page.evaluate(async () => {
                        const host = window.mixedFastHost || window.wrongFastHost;
                        if (!host) return null;
                        try { const result = await host.preflight(); host.unlockPrint(); return result; }
                        catch (error) { return { ok: false, code: error.message, attempts: host.runtime.inspect().attempts }; }
                    });
                    if (host && !host.ok) errors.push(JSON.stringify(host));
                    await page.pdf({ path: path.join(out, `${item.name}.pdf`), preferCSSPageSize: true, printBackground: true });
                }
                pair.push({ label, ready, capture, errors });
                await context.close();
            }
            let error = null;
            try { assert.equal(pair[0].ready?.ok, true); assert.equal(pair[1].ready?.ok, true); assert.deepEqual(pair[1].errors, []); assert.deepEqual(pair[1].capture, pair[0].capture); }
            catch (e) { error = String(e.message); }
            results.push({ ...item, pass: !error, error, pair });
            console.log(error ? 'FAIL' : 'PASS', item.name, error?.slice(0, 300) || '');
            fs.writeFileSync(path.join(out, process.env.AP_PARITY_REPORT || 'parity.json'), JSON.stringify(results, null, 2));
        }
    } finally { await browser.close(); }
    if (results.some(r => !r.pass)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
