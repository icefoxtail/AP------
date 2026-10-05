// Self-serving integration/print harness. Run with AP_PLAYWRIGHT_MODULE if Playwright is not installed locally.
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { makeBank } = require('../archive/exams/test-fixtures/equal-slot-engine-bank.js');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'reports/print-engine-v2');
fs.mkdirSync(out, { recursive: true });
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const match = url.pathname.match(/\/equal-slot-(\d+)(-plain)?(-broken)?\.js$/);
    if (match) {
        const bank = makeBank(Number(match[1]), !match[2]);
        if (match[3]) bank[0].image = '/missing-equal-slot-image.png';
        res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
        return res.end('window.questionBank = ' + JSON.stringify(bank) + ';');
    }
    if (url.pathname === '/blank') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<!doctype html><title>Engine QA</title>'); }
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (error, data) => {
        if (error) { res.writeHead(404); return res.end('missing'); }
        res.writeHead(200, { 'Content-Type': (types[path.extname(file)] || 'application/octet-stream') + (/\.(js|css|html|json)$/.test(file) ? '; charset=utf-8' : '') });
        res.end(data);
    });
});
async function ready(page) {
    const deadline = Date.now() + 90000;
    while (Date.now() < deadline) {
        const state = await page.evaluate(() => Promise.race([window.__AP_RENDER_READY__, new Promise(resolve => setTimeout(() => resolve(null), 1000))]));
        if (state && state.code !== 'RENDER_NOT_STARTED') return state;
        await page.waitForTimeout(50);
    }
    throw Error('render readiness timeout: ' + JSON.stringify(await page.evaluate(() => ({ text: document.body.innerText.slice(-1000), data: {...document.documentElement.dataset} }))));
}
async function launch(browser, origin, { kind, count = 9, legacy = false, width = 1440, recipients = 1, broken = false, mode = 'exam', qpp = 4, strict = true, special = true, missingEngine = false }) {
    const context = await browser.newContext({ viewport: { width, height: 1050 } });
    await context.route('**/api/**', r => r.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
    if (missingEngine) await context.route(`**/${missingEngine === 'executor' ? 'exam-render-executor' : 'equal-slot-engine'}.js*`, r => r.abort());
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
        // Capture error evidence from aborted transactions without changing their result.
        Object.defineProperty(window, 'APEqualSlotEngine', { configurable: true, get() { return this.__slotApi; }, set(api) {
            this.__slotApi = { ...api, async render(args) { try { return await api.render(args); } catch (e) { window.__slotFailure = e.evidence; throw e; } }, async finalize(area) { try { return await api.finalize(area); } catch (e) { window.__slotFailure = e.evidence; throw e; } } };
        } });
    });
    await page.goto(origin + '/blank');
    const bankPath = `/archive/exams/test-fixtures/equal-slot-${count}${special ? '' : '-plain'}${broken ? '-broken' : ''}.js`;
    const query = new URLSearchParams({ qpp: String(qpp), mode, fit: 'screen', prewarm: '0', slotEngine: legacy ? 'legacy' : 'v2', solQr: '1', equalSlots: '1' });
    if (!strict) query.delete('equalSlots');
    let engine;
    if (kind === 'archive') { engine = '/archive/engine.html'; query.set('data', bankPath.replace('/archive/', '')); }
    else if (kind === 'mixer') {
        engine = '/archive/mixed_engine.html'; query.set('key', 'equal-slot-qa');
        const bank = makeBank(count, special).map(q => ({ ...q, sourceArchiveFile: bankPath, _sourceFile: bankPath }));
        if (broken) bank[0].image = '/missing-equal-slot-image.png';
        await page.evaluate(({ bank, qpp }) => { localStorage.setItem('mixedQuestions_equal-slot-qa', JSON.stringify(bank)); localStorage.setItem('mixedMeta_equal-slot-qa', JSON.stringify({ title: '균등 슬롯 인쇄 검증', qpp, count: bank.length })); }, { bank, qpp });
    } else {
        engine = '/apmath/wrong_print_engine.html';
        await page.evaluate(({ bankPath, count, recipients, origin }) => {
            const archiveFile = origin + bankPath;
            const payload = { mode: 'student', printTitle: '균등 슬롯 인쇄 검증', className: 'QA', createdDate: '2026-09-15', options: { pageBreakByStudent: recipients > 1, includeHomeworkCheckBox: recipients > 1 }, students: Array.from({ length: recipients }, (_, i) => ({ studentName: `검증 학생 ${i + 1}`, wrongItems: Array.from({ length: count }, (_, n) => ({ sourceArchiveFile: archiveFile, archiveFile, questionNo: n + 1, sourceQuestionNo: n + 1, examTitle: '균등 슬롯 검증' })) })) };
            sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', JSON.stringify(payload));
        }, { bankPath, count, recipients, origin });
    }
    const started = Date.now();
    await page.goto(origin + engine + '?' + query, { waitUntil: 'domcontentloaded' });
    const outcome = await ready(page);
    return { page, context, outcome, errors, wallMs: Date.now() - started };
}
async function capture(page) {
    return page.evaluate(() => {
        const area = document.getElementById('print-area');
        const norm = r => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height });
        const pages = [...area.querySelectorAll('.page')].map(p => ({ className: p.className, boxes: [...p.querySelectorAll('.q-box')].map(b => ({ rect: norm(b.getBoundingClientRect()), text: b.textContent, source: b.dataset.sourceRef, data: { ...b.dataset } })), rect: norm(p.getBoundingClientRect()), qr: [...p.querySelectorAll('.page-qr,.page-submit-qr')].map(q => norm(q.getBoundingClientRect())) }));
        const overflowBoxes = [...area.querySelectorAll('.q-box')].filter(box => {
            const r = box.getBoundingClientRect();
            return [...box.querySelectorAll('.q-content,.choices,.q-image-wrap')].some(n => { const x = n.getBoundingClientRect(); return x.left < r.left - 2 || x.top < r.top - 2 || x.right > r.right + 2 || x.bottom > r.bottom + 2; });
        }).map(q => q.dataset.sourceRef);
        return { pages, overflowBoxes, api: !!window.APEqualSlotEngine, audit: window.APEqualSlotEngine?.audit(area), metrics: window.__AP_RENDER_METRICS__, mathErrors: area.querySelectorAll('mjx-merror').length, images: [...area.querySelectorAll('img')].map(i => ({ ready: i.complete && i.naturalWidth > 0, src: i.currentSrc })), questionText: [...area.querySelectorAll('.q-box')].map(q => q.textContent), rootData: { ...area.dataset } };
    });
}
function assertExam(data, count, recipients = 1) {
    assert.equal(data.api, true, 'shared equal-slot engine must be loaded');
    assert.equal(data.audit?.ok, true, JSON.stringify(data.audit?.issues));
    assert.equal(data.mathErrors, 0);
    assert.ok(data.images.every(i => i.ready));
    const actual = data.questionText.join(' ').match(/검증문항\d{3}/g) || [];
    const expected = Array.from({ length: recipients }, () => Array.from({ length: count }, (_, i) => `검증문항${String(i + 1).padStart(3, '0')}`)).flat();
    assert.deepEqual(actual, expected, 'question content and order');
    const examPages = data.pages.filter(p => p.boxes.some(b => b.source));
    assert.equal(examPages.length, Math.ceil(count / 4) * recipients);
    for (const p of examPages) {
        assert.equal(p.boxes.length, 4, 'partial pages retain four equal q-box slots');
        const [a, b, c, d] = p.boxes.map(b => b.rect);
        for (const r of [b, c, d]) { assert.ok(Math.abs(a.width - r.width) < 1); assert.ok(Math.abs(a.height - r.height) < 1); }
        assert.ok(a.left < c.left && b.top > a.top && Math.abs(a.top - c.top) < 1 && Math.abs(b.top - d.top) < 1, 'column-major positions');
        for (const box of p.boxes) for (const qr of p.qr) {
            const r = box.rect;
            assert.ok(Math.min(r.right, qr.right) - Math.max(r.left, qr.left) <= 1 || Math.min(r.bottom, qr.bottom) - Math.max(r.top, qr.top) <= 1, 'slot/QR intersection');
        }
    }
}
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = [];
    try {
        const phase = process.env.AP_SLOT_PHASE || 'all';
        const cases = phase !== 'all' && phase !== 'layout' ? [] : process.env.AP_SLOT_SMOKE ? [{ kind: 'archive', count: 4 }] : ['archive', 'mixer', 'wrong'].flatMap(kind => [{ kind, count: 9 }, { kind, count: 4, width: 390 }, { kind, count: 8 }]);
        if (!process.env.AP_SLOT_SMOKE && cases.length) cases.push({ kind: 'wrong', count: 4, recipients: 2 });
        for (const item of cases) {
            const name = `${item.kind}-${item.count}-${item.width || 1440}-${item.recipients || 1}`;
            const run = await launch(browser, origin, item);
            try {
                assert.equal(run.outcome?.ok, true, JSON.stringify({ outcome: run.outcome, errors: run.errors, evidence: await run.page.evaluate(() => window.__slotFailure?.issues) }));
                const screen = await capture(run.page);
                fs.writeFileSync(path.join(out, 'last-capture.json'), JSON.stringify(screen, null, 2));
                assertExam(screen, item.count, item.recipients);
                await run.page.emulateMedia({ media: 'print' });
                await run.page.evaluate(() => document.fonts.ready);
                const print = await capture(run.page); assertExam(print, item.count, item.recipients);
                if (item.count === 9 || process.env.AP_SLOT_PDF) {
                    await run.page.pdf({ path: path.join(out, name + '.pdf'), preferCSSPageSize: true, printBackground: true });
                    const texts = JSON.parse(execFileSync(process.env.AP_PYTHON || 'python', ['-c', 'import sys,json; from pypdf import PdfReader; print(json.dumps([p.extract_text() or "" for p in PdfReader(sys.argv[1]).pages]))', path.join(out, name + '.pdf')], { encoding: 'utf8' })).map(s => s.replace(/\s+/g, ''));
                    for (let i = 1; i <= item.count; i++) assert.ok(texts[Math.floor((i - 1) / 4)].includes('선택끝' + String(i).padStart(3, '0')), `PDF lost or moved choices for question ${i}`);
                    await run.page.locator('#print-area .page').first().screenshot({ path: path.join(out, name + '.png') });
                }
                assert.deepEqual(run.errors, []);
                results.push({ name, ok: true, wallMs: run.wallMs, screen: screen.metrics, printAudit: print.audit, rootData: print.rootData });
                console.log('PASS', name, run.wallMs + 'ms');
            } finally { await run.context.close(); fs.writeFileSync(path.join(out, 'browser-results.json'), JSON.stringify(results, null, 2)); }
        }
        if (!process.env.AP_SLOT_SMOKE && ['all', 'parity'].includes(phase)) {
            for (const kind of ['archive', 'mixer', 'wrong']) {
                for (const mode of (kind === 'wrong' ? ['exam', 'sol', 'ans', 'review'] : ['exam', 'sol', 'ans'])) {
                    const pair = [];
                    for (const legacy of [true, false]) {
                        const run = await launch(browser, origin, { kind, mode, legacy, strict: false, count: 9 });
                        try {
                            assert.equal(run.outcome.ok, true, JSON.stringify(run.outcome));
                            pair.push(await run.page.evaluate(() => [...document.querySelectorAll('#print-area .page')].map(p => ({ text: p.textContent.replace(/\s+/g, ' ').trim(), className: p.className, shapes: [...p.querySelectorAll('.q-box,.ans-cell,img,table')].map(n => [n.offsetWidth, n.offsetHeight]) }))));
                        } finally { await run.context.close(); }
                    }
                    assert.deepEqual(pair[1], pair[0], `${kind}/${mode}: existing special-layout and solution/answer behavior`);
                    results.push({ name: `${kind}-${mode}-legacy-parity`, ok: true }); console.log('PASS parity', kind, mode);
                }
                if (kind !== 'wrong') for (const qpp of [6, 8]) {
                    const pair = [];
                    for (const legacy of [true, false]) {
                        const run = await launch(browser, origin, { kind, legacy, qpp, count: 9 });
                        try { assert.equal(run.outcome.ok, true); pair.push((await capture(run.page)).pages.map(p => ({ text: p.boxes.map(b => b.text), h: p.boxes.map(b => b.rect.height) }))); }
                        finally { await run.context.close(); }
                    }
                    assert.deepEqual(pair[1], pair[0]); console.log('PASS parity', kind, qpp); results.push({ name: `${kind}-qpp${qpp}-legacy-parity`, ok: true });
                }
            }
        }
        if (!process.env.AP_SLOT_SMOKE && ['all', 'lifecycle'].includes(phase)) {
            for (const kind of ['archive', 'mixer', 'wrong']) {
                const run = await launch(browser, origin, { kind, count: 4 });
                try {
                    assert.equal(run.outcome.ok, true);
                    const reused = await run.page.evaluate(async () => {
                        const before = document.getElementById('print-area');
                        for (const mode of ['sol', 'ans', 'exam']) { const outcome = await switchMode(mode); if (outcome?.ok === false) throw Error(JSON.stringify(outcome)); }
                        await window.__AP_RENDER_READY__;
                        const runtime = window.archiveScreenRuntime || window.mixedScreenRuntime || window.wrongScreenRuntime;
                        return { same: before === document.getElementById('print-area'), cache: runtime.inspect().attempts.at(-1).cacheStatus, audit: APEqualSlotEngine.audit(document.getElementById('print-area')) };
                    });
                    assert.equal(reused.same, true); assert.equal(reused.cache, 'HIT'); assert.equal(reused.audit.ok, true);
                    const mutated = await run.page.evaluate(() => {
                        const box = document.querySelector('#print-area .ap-slot-content'), original = box.style.transform;
                        box.style.transform = 'translateX(-100px)'; const escaped = APEqualSlotEngine.audit(document.getElementById('print-area')); box.style.transform = original;
                        const content = box.querySelector('.q-content'), style = content.style.cssText;
                        content.style.height = '1px'; content.style.overflow = 'hidden'; const clipped = APEqualSlotEngine.audit(document.getElementById('print-area')); content.style.cssText = style;
                        const math = box.querySelector('mjx-math'), mathStyle = math.style.cssText;
                        math.style.display = 'inline-block'; math.style.transform = 'translateX(-1000px)'; const mathEscape = APEqualSlotEngine.audit(document.getElementById('print-area')); math.style.cssText = mathStyle;
                        return { escaped: escaped.issues, clipped: clipped.issues, mathEscape: mathEscape.issues, restored: APEqualSlotEngine.audit(document.getElementById('print-area')).ok };
                    });
                    assert.ok(mutated.escaped.some(i => i.code === 'CONTENT_OUTSIDE_SLOT'));
                    assert.ok(mutated.clipped.some(i => i.code === 'INTERNAL_CLIPPING'));
                    assert.ok(mutated.mathEscape.some(i => i.code === 'CONTENT_OUTSIDE_SLOT'), 'MathJax inner ink cannot escape its slot');
                    assert.equal(mutated.restored, true);
                    const slotChecks = await run.page.evaluate(() => {
                        const area = document.getElementById('print-area'), slot = area.querySelector('.ap-equal-slot'), content = slot.querySelector('.ap-slot-content');
                        const html = content.innerHTML, style = content.style.cssText;
                        content.remove(); delete slot.dataset.empty;
                        const missing = APEqualSlotEngine.audit(area);
                        slot.dataset.empty = 'true'; const marker = document.createElement('span'); marker.textContent = '오염'; slot.appendChild(marker);
                        const contaminated = APEqualSlotEngine.audit(area);
                        slot.replaceChildren(); slot.dataset.empty = 'true'; const empty = APEqualSlotEngine.audit(area);
                        slot.dataset.empty = ''; const restored = document.createElement('div'); restored.className = 'ap-slot-content'; restored.style.cssText = style; restored.innerHTML = html; slot.appendChild(restored);
                        return { missing: missing.issues, contaminated: contaminated.issues, empty: empty.issues };
                    });
                    assert.ok(slotChecks.missing.some(i => i.code === 'MISSING_SLOT_CONTENT'));
                    assert.ok(slotChecks.contaminated.some(i => i.code === 'EMPTY_SLOT_HAS_CONTENT'));
                    assert.equal(slotChecks.empty.some(i => i.code === 'MISSING_SLOT_CONTENT'), false);
                    const svgCheck = await run.page.evaluate(async () => {
                        const host = document.querySelector('.ap-slot-content'), svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 100 100'); svg.setAttribute('width','80'); svg.setAttribute('height','80'); const text = document.createElementNS('http://www.w3.org/2000/svg','text'); text.textContent='label'; text.setAttribute('x','20'); text.setAttribute('y','50'); svg.appendChild(text); host.appendChild(svg);
                        const original = text.getAttribute('x'); text.setAttribute('x', '1000'); await new Promise(requestAnimationFrame); const clipped = APEqualSlotEngine.audit(document.getElementById('print-area')); text.setAttribute('x', original); svg.remove(); await document.fonts.ready; const restored = APEqualSlotEngine.audit(document.getElementById('print-area'));
                        return { skipped: false, clipped: clipped.issues, restored: restored.ok };
                    });
                    if (!svgCheck.skipped) { assert.ok(svgCheck.clipped.some(i => i.code === 'SVG_VIEWBOX_CLIP')); assert.equal(svgCheck.restored, true, JSON.stringify(svgCheck)); }
                    const stable = await run.page.evaluate(async () => {
                        const area = document.getElementById('print-area');
                        const before = [...area.querySelectorAll('.ap-slot-content')].map(n => n.style.cssText);
                        await APEqualSlotEngine.finalize(area); await APEqualSlotEngine.finalize(area);
                        const host = window.mixedFastHost || window.wrongFastHost;
                        if (host) { await host.preflight(); host.unlockPrint(); } else bindArchiveRuntimePrintReadiness();
                        return { before, after: [...area.querySelectorAll('.ap-slot-content')].map(n => n.style.cssText) };
                    });
                    assert.deepEqual(stable.after, stable.before);
                    console.log('PASS lifecycle', kind); results.push({ name: `${kind}-cache-mutations-idempotence`, ok: true });
                } finally { await run.context.close(); }
                const failed = await launch(browser, origin, { kind, count: 4, broken: true });
                try { assert.equal(failed.outcome.ok, false, 'missing image must block readiness'); results.push({ name: `${kind}-missing-image`, ok: true, code: failed.outcome.code }); console.log('PASS missing image', kind); }
                finally { await failed.context.close(); }
            }
        }
        if (!process.env.AP_SLOT_SMOKE && ['all', 'performance'].includes(phase)) {
            for (const kind of ['archive', 'mixer', 'wrong']) for (const legacy of [true, false]) {
                const samples = [];
                for (let n = 0; n < 3; n++) {
                    const run = await launch(browser, origin, { kind, count: 24, legacy, special: false });
                    try {
                        assert.equal(run.outcome.ok, true, JSON.stringify(run.outcome));
                        const data = await capture(run.page);
                        const rebuild = await run.page.evaluate(async () => {
                            const rt = window.archiveScreenRuntime || window.mixedScreenRuntime || window.wrongScreenRuntime;
                            const start = performance.now(); const result = await rt.request({ type: 'FORCED_REBUILD' });
                            return { ok: result.ok, ms: performance.now() - start, metrics: window.__AP_RENDER_METRICS__ };
                        });
                        assert.equal(rebuild.ok, true); samples.push({ wallMs: run.wallMs, metrics: data.metrics, overflowBoxes: data.overflowBoxes, rebuild });
                    } finally { await run.context.close(); }
                }
                results.push({ name: `${kind}-${legacy ? 'legacy' : 'v2'}-performance`, ok: true, samples });
                console.log('MEASURE', kind, legacy ? 'legacy' : 'v2', samples.map(s => s.metrics.renderReadyMs));
            }
        }
        if (phase === 'raster') {
            for (const kind of ['archive', 'mixer']) {
                const run = await launch(browser, origin, { kind, count: 9 });
                try {
                    assert.equal(run.outcome.ok, true);
                    const raster = await run.page.evaluate(async () => {
                        const page = document.querySelector('#print-area .page');
                        const renderer = window.APEqualSlotEngine?.rasterizePage || window.html2canvas;
                        const canvas = await renderer(page, { scale: 1.5, width: Math.ceil(page.offsetWidth), height: Math.ceil(page.offsetHeight), logging: false, useCORS: true, backgroundColor: '#fff' });
                        return canvas.toDataURL('image/png').split(',')[1];
                    });
                    fs.writeFileSync(path.join(out, `${kind}-raster.png`), Buffer.from(raster, 'base64'));
                    results.push({ name: `${kind}-raster`, ok: true }); console.log('CAPTURE raster', kind);
                } finally { await run.context.close(); }
            }
        }
        if (phase === 'guards' || phase === 'all') {
            for (const kind of ['archive', 'mixer', 'wrong']) {
                const run = await launch(browser, origin, { kind, count: 4 });
                try {
                    assert.equal(run.outcome.ok, true);
                    const prints = await run.page.evaluate(async kind => {
                        let prints = 0; window.print = () => { prints++; }; window.alert = () => {};
                        const original = APEqualSlotEngine.assertReady;
                        APEqualSlotEngine.assertReady = () => { throw Object.assign(Error('injected invalid geometry'), { code: 'EQUAL_SLOT_AUDIT_FAILED' }); };
                        if (kind === 'wrong') await clinicSafePrint(); else await safePrint('vector');
                        APEqualSlotEngine.assertReady = original;
                        return prints;
                    }, kind);
                    assert.equal(prints, 0, `${kind}: failed slot preflight must not print`);
                    if (kind === 'archive') {
                        const result = await run.page.evaluate(async () => {
                            let prints = 0; window.print = () => { prints++; };
                            const original = bindArchiveRuntimePrintReadiness;
                            bindArchiveRuntimePrintReadiness = () => { throw Error('PRINT_ACTIVE_BINDING_FAILED'); };
                            await safePrint('vector'); bindArchiveRuntimePrintReadiness = original; return prints;
                        });
                        assert.equal(result, 0, 'snapshot readiness failure must block vector print');
                    }
                    results.push({ name: `${kind}-preflight-blocks-print`, ok: true }); console.log('PASS print guard', kind);
                } finally { await run.context.close(); }
                const missing = await launch(browser, origin, { kind, count: 4, missingEngine: true });
                try { assert.equal(missing.outcome.ok, false, `${kind}: unavailable strict compositor must not silently change layout`); results.push({ name: `${kind}-missing-engine`, ok: true }); console.log('PASS missing engine', kind); }
                finally { await missing.context.close(); }
                const compatible = await launch(browser, origin, { kind, count: 9, missingEngine: true, strict: false });
                try { assert.equal(compatible.outcome.ok, true, `${kind}: special layout must remain available without v2`); results.push({ name: `${kind}-missing-engine-special-compatibility`, ok: true }); }
                finally { await compatible.context.close(); }
                const executorMissing = await launch(browser, origin, { kind, count: 4, missingEngine: 'executor' });
                try { assert.equal(executorMissing.outcome.ok, false, `${kind}: strict mode cannot use missing executor fallback`); }
                finally { await executorMissing.context.close(); }
            }
        }
        if (phase === 'quality') {
            for (const kind of ['archive', 'mixer', 'wrong']) {
                const pair = [];
                for (const legacy of [true, false]) {
                    const run = await launch(browser, origin, { kind, count: 9, legacy, special: false });
                    try { assert.equal(run.outcome.ok, true); const data = await capture(run.page); pair.push({ legacy, overflow: data.overflowBoxes.length, math: data.metrics.mathJaxCalls }); }
                    finally { await run.context.close(); }
                }
                assert.equal(pair[1].overflow, 0); assert.ok(pair[0].overflow > pair[1].overflow, `${kind}: clipping fixture must improve`);
                results.push({ name: `${kind}-clip-improvement`, ok: true, pair }); console.log('QUALITY', kind, pair);
            }
        }
        fs.writeFileSync(path.join(out, `browser-${phase}.json`), JSON.stringify(results, null, 2));
    } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
