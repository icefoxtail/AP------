// Run with AP_PLAYWRIGHT_MODULE pointing at an installed Playwright package.
// Serve the repository on AP_ARCHIVE_BASE (default http://127.0.0.1:8766).
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '../reports/archive-fast-engine-v2');
const base = process.env.AP_ARCHIVE_BASE || 'http://127.0.0.1:8766';
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const tests = [], errors = [], expectedPageErrors = [], posts = [];
    let failDelivery = false;
    await page.context().route('**/api/**', async route => {
        posts.push({ url: route.request().url(), body: route.request().postData() });
        await route.fulfill({ status: failDelivery ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ success: !failDelivery }) });
    });
    page.on('pageerror', error => {
        const message = String(error);
        if (message.includes('INJECTED_FONT_FAILURE')) expectedPageErrors.push(message);
        else errors.push(message);
    });
    await page.goto(base + '/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&mode=exam&qpp=4&printDryRun=1&prewarm=0' + (process.env.AP_BROWSER_CACHE === '0' ? '&snapshotCache=0' : ''));
    await page.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot, undefined, { timeout: 120000 });
    await page.evaluate(() => archiveScreenRuntime.whenIdle());
    async function check(name, work) {
        try { await work(); tests.push({ name, status: 'PASS' }); console.log('PASS', name); }
        catch (error) { tests.push({ name, status: 'FAIL', error: String(error.stack || error) }); console.error('FAIL', name, error.message); }
        fs.writeFileSync(path.join(out, process.env.AP_BROWSER_REPORT || 'phase1a-browser.json'), JSON.stringify({ tests, errors, expectedPageErrors, posts }, null, 2));
    }
    await page.evaluate(() => {
        window.saveState = () => ({ root: document.getElementById('print-area'), mode: AppState.mode, qpp: AppState.qpp, data: AppState.data, header: AppState.printHeaderOptions, url: location.href, session: archiveScreenRuntime.currentSession, snapshot: archiveScreenRuntime.activeSnapshot, tab: document.querySelector('.mode-tab.active')?.id });
        window.sameState = before => { const after = saveState(); return Object.keys(before).every(key => before[key] === after[key]) && after.snapshot.status === 'ACTIVE'; };
    });
    await check('Canonical candidate schema and recursive immutability', async () => {
        const result = await page.evaluate(() => ({ frozen: APRenderStateNormalizer.assertImmutable(archiveScreenRuntime.committedCandidate), mode: archiveScreenRuntime.committedCandidate.canonicalMode, enum: Object.keys(APScreenRuntime.RenderIntentType).length }));
        assert.deepEqual(result, { frozen: true, mode: 'exam', enum: 12 });
    });
    await check('PREPARE keeps DOM/state/URL/tab; late request wins and composes header delta', async () => {
        const result = await page.evaluate(async () => {
            const old = saveState(), executor = APSolutionRenderExecutor;
            let entered, resume;
            const started = new Promise(r => { entered = r; });
            window.APSolutionRenderExecutor = { ...executor, async render(args) { entered(); await new Promise(r => { resume = r; }); return executor.render(args); } };
            const first = switchMode('sol'); await started;
            const preserved = sameState(old);
            const second = switchMode('ans');
            const raw = { title: 'Final header' };
            const third = setPrintHeaderOptions(raw); raw.title = 'MUTATED OUTSIDE';
            resume(); const results = await Promise.all([first, second, third]);
            window.APSolutionRenderExecutor = executor;
            return { preserved, results: results.map(r => ({ ok: r.ok, code: r.code || null })), mode: AppState.mode, title: AppState.printHeaderOptions.title, digestParity: archiveScreenRuntime.inspect().attempts.at(-1).keyBuildParity };
        });
        assert.equal(result.preserved, true); assert.equal(result.results[0].code, 'DISCARDED_STALE');
        assert.equal(result.results[2].ok, true, JSON.stringify(result)); assert.equal(result.mode, 'ans'); assert.equal(result.title, 'Final header'); assert.equal(result.digestParity, true);
    });
    await check('MathJax failure preserves active state and has no committed effects', async () => {
        const result = await page.evaluate(async () => {
            const before = saveState(), original = MathJax.typesetPromise;
            MathJax.typesetPromise = async () => { throw Error('INJECTED_MATHJAX_FAILURE'); };
            const result = await switchMode('sol'); MathJax.typesetPromise = original;
            return { ok: result.ok, preserved: sameState(before) };
        }); assert.deepEqual(result, { ok: false, preserved: true });
    });
    await check('Executor layout throw preserves active root and ledgers', async () => {
        const result = await page.evaluate(async () => {
            const before = saveState(), original = window.APExamRenderExecutor;
            window.APExamRenderExecutor = { render() { throw Error('INJECTED_LAYOUT_FAILURE'); } };
            const result = await switchMode('exam'); window.APExamRenderExecutor = original;
            return { ok: result.ok, preserved: sameState(before) };
        }); assert.deepEqual(result, { ok: false, preserved: true });
    });
    await check('Font readiness rejection preserves active root', async () => {
        const result = await page.evaluate(async () => {
            const before = saveState(), desc = Object.getOwnPropertyDescriptor(document.fonts, 'ready');
            Object.defineProperty(document.fonts, 'ready', { configurable: true, get() { return Promise.reject(Error('INJECTED_FONT_FAILURE')); } });
            const result = await render();
            if (desc) Object.defineProperty(document.fonts, 'ready', desc); else delete document.fonts.ready;
            return { ok: result.ok, preserved: sameState(before) };
        }); assert.deepEqual(result, { ok: false, preserved: true });
    });
    await check('Synchronous history failure rolls back root/state/session/snapshot status', async () => {
        const result = await page.evaluate(async () => {
            const before = saveState(), original = history.pushState;
            history.pushState = () => { throw Error('INJECTED_HISTORY_FAILURE'); };
            const result = await switchMode('exam'); history.pushState = original;
            return { ok: result.ok, preserved: sameState(before), roots: document.querySelectorAll('#print-area').length };
        }); assert.deepEqual(result, { ok: false, preserved: true, roots: 1 });
    });
    await check('Source load failure preserves current session', async () => {
        const result = await page.evaluate(async () => { const before = saveState(); const result = await archiveScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { safeDataUrl: 'exams/test-fixtures/does-not-exist.js' } }); return { ok: result.ok, preserved: sameState(before) }; });
        assert.deepEqual(result, { ok: false, preserved: true });
    });
    await check('Canonical normalization rejects function input and restores source globals', async () => {
        const result = await page.evaluate(async () => {
            const before = saveState(), bank = window.questionBank;
            const url = URL.createObjectURL(new Blob(["window.examTitle='INVALID';window.questionBank=[{id:1,content:'test',choices:[function(){}]}];"], { type: 'text/javascript' }));
            const result = await archiveScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { safeDataUrl: url } }); URL.revokeObjectURL(url);
            return { ok: result.ok, preserved: sameState(before), globals: bank === window.questionBank };
        }); assert.deepEqual(result, { ok: false, preserved: true, globals: true });
    });
    await check('Image failure aborts pending source without destroying old MathJax DOM', async () => {
        const result = await page.evaluate(async () => {
            const before = saveState();
            const url = URL.createObjectURL(new Blob(["window.examTitle='BROKEN IMAGE';window.questionBank=[{id:1,content:'test',image:'missing-test-image.svg',answer:'1',solution:'test'}];"], { type: 'text/javascript' }));
            const result = await archiveScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { safeDataUrl: url, mode: 'exam' } });URL.revokeObjectURL(url);
            return { ok: result.ok, preserved: sameState(before) };
        }); assert.deepEqual(result, { ok: false, preserved: true });
    });
    await check('Pending session materializes separately, old root evicts after successful commit', async () => {
        const result = await page.evaluate(async () => {
            const before = saveState();
            const result = await archiveScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { safeDataUrl: 'exams/test-fixtures/render-authority-golden.js', mode: 'exam' } });
            const session = archiveScreenRuntime.currentSession, snapshot = archiveScreenRuntime.activeSnapshot;
            return { ok: result.ok, changed: session.sessionId !== before.session.sessionId, status: session.status, oldStatus: before.session.status, detached: !before.root.isConnected, parity: session.sessionId === snapshot.sessionId && snapshot.sessionId === archiveScreenRuntime.committedCandidate.source.targetSessionId };
        }); assert.deepEqual(result, { ok: true, changed: true, status: 'CURRENT', oldStatus: 'EVICTED', detached: true, parity: true });
    });
    await check('Real bank top-level const helpers are isolated across repeated SOURCE_CHANGE', async () => {
        const result = await page.evaluate(async () => {
            const request = { type: 'SOURCE_CHANGE', payload: { safeDataUrl: 'exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js', mode: 'ans' } };
            const a = await archiveScreenRuntime.request(request), b = await archiveScreenRuntime.request(request);
            await archiveScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { safeDataUrl: 'exams/test-fixtures/render-authority-golden.js', mode: 'exam' } });
            return [a.ok, b.ok];
        }); assert.deepEqual(result, [true, true]);
    });
    await check('QPP/header/QR/profile/invalidation/forced entries all commit through runtime', async () => {
        const result = await page.evaluate(async () => {
            const results = [];
            results.push(await setArchiveQpp(6));
            results.push(await setPrintHeaderOptions({ subtitle: 'Transaction header' }));
            results.push(await setQrOutputParam('sol', true));
            for (const type of ['PROFILE_CHANGE', 'FONT_INVALIDATION', 'ASSET_INVALIDATION', 'PAGE_LAYOUT_INVALIDATION', 'ENGINE_INVALIDATION']) results.push(await archiveScreenRuntime.request({ type, payload: { fingerprint: 'browser-test-v1', profile: { layout: 'A4' } } }));
            results.push(await render());
            return { ok: results.every(r => r.ok), qpp: AppState.qpp, subtitle: AppState.printHeaderOptions.subtitle, qr: document.querySelectorAll('#print-area .page-qr canvas').length, parity: archiveScreenRuntime.inspect().attempts.filter(a => a.committed).every(a => a.keyBuildParity) };
        }); assert.deepEqual(result, { ok: true, qpp: 6, subtitle: 'Transaction header', qr: 1, parity: true });
    });
    await check('Background request executes zero business side effects', async () => {
        const count = posts.length;
        const result = await page.evaluate(() => archiveScreenRuntime.request({ type: 'FORCED_REBUILD', foreground: false }));
        assert.ok(['BACKGROUND_NOT_ENABLED', 'BACKGROUND_INTENT_FORBIDDEN'].includes(result.code)); assert.equal(posts.length, count);
    });
    await check('Post-commit business delivery failure and next-activation retry keep identity', async () => {
        await page.evaluate(() => localStorage.setItem('APMATH_SESSION', JSON.stringify({ session_token: 'local-browser-test-only' })));
        failDelivery = true;
        await page.evaluate(() => setQrOutputParam('submit', true));
        await page.waitForFunction(() => __AP_SIDE_EFFECT_LEDGER__.snapshot().entries.some(e => e.state === 'FAILED_RETRYABLE'));
        const before = await page.evaluate(() => __AP_SIDE_EFFECT_LEDGER__.snapshot().entries.find(e => e.effectId === 'blueprint'));
        failDelivery = false; await page.evaluate(() => render());
        await page.waitForFunction(() => __AP_SIDE_EFFECT_LEDGER__.snapshot().entries.some(e => e.state === 'ACKNOWLEDGED'));
        const after = await page.evaluate(() => __AP_SIDE_EFFECT_LEDGER__.snapshot().entries.find(e => e.effectId === 'blueprint'));
        assert.equal(before.logicalEffectId, after.logicalEffectId); assert.equal(before.idempotencyKey, after.idempotencyKey); assert.equal(after.attempt, before.attempt + 1);
        const count = posts.length; await page.evaluate(() => render()); assert.equal(posts.length, count);
    });
    await check('Print dry-run validates active render, repeated print gets fresh readiness', async () => {
        const result = await page.evaluate(async () => {
            await safePrint('vector'); const first = archiveReadinessTracker;
            await safePrint('vector');
            return { state: archiveReadinessTracker.snapshot().state, ready: archiveReadinessTracker.snapshot().ready, fresh: first !== archiveReadinessTracker, metrics: JSON.parse(document.documentElement.dataset.apPrintMetrics), pending: printPending };
        }); assert.equal(result.state, 'PRINT_READY'); assert.equal(result.ready, true); assert.equal(result.fresh, true); assert.equal(result.pending, false);
    });
    await check('Print stale math recovery is routed through PRINT_STALE_REBUILD', async () => {
        const result = await page.evaluate(async () => {
            document.querySelector('#print-area .page').appendChild(document.createTextNode('$unrendered$'));
            await safePrint('vector');
            return { ready: archiveReadinessTracker.snapshot().ready, intent: archiveScreenRuntime.inspect().attempts.at(-1).intentType, math: APRenderLoop.unrenderedMathCount(document.getElementById('print-area')) };
        }); assert.deepEqual(result, { ready: true, intent: 'PRINT_STALE_REBUILD', math: 0 });
    });
    await check('No abandoned build/staging DOM; current snapshot owns canonical root', async () => {
        const result = await page.evaluate(() => ({ hosts: document.querySelectorAll('[data-archive-build-root],[data-archive-staging]').length, owns: archiveScreenRuntime.activeSnapshot.rootNode === document.getElementById('print-area'), counters: __AP_SIDE_EFFECT_LEDGER__.snapshot().counters }));
        assert.equal(result.hosts, 0); assert.equal(result.owns, true); assert.ok(Object.values(result.counters).every(n => n === 0));
    });
    await check('Preview disables QR and business effects; QR solution mode remains locked', async () => {
        const other = await page.context().newPage(); const before = posts.length;
        await other.goto(base + '/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&mode=exam&preview=1&submitQr=1&solQr=1');
        await other.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot);
        await other.evaluate(() => archiveScreenRuntime.whenIdle());
        assert.equal(await other.locator('#print-area canvas').count(), 0); assert.equal(posts.length, before);
        await other.goto(base + '/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&qr=1&mode=exam');
        await other.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot);
        await other.evaluate(() => switchMode('exam'));
        assert.equal(await other.evaluate(() => AppState.mode), 'sol'); assert.equal(await other.locator('#btn-exam').isVisible(), false);
        await other.close();
    });
    await check('Class assignment is delivered once after COMMIT and acknowledged', async () => {
        const other = await page.context().newPage();
        await other.goto(base + '/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&mode=exam&submitQr=1&class=phase1a-test&teacher=test&date=2026-09-10');
        await other.waitForFunction(() => __AP_SIDE_EFFECT_LEDGER__?.snapshot().entries.some(e => e.effectId === 'assignment' && e.state === 'ACKNOWLEDGED'));
        const count = posts.filter(p => p.url.endsWith('class-exam-assignments')).length;
        await other.evaluate(() => render());
        assert.equal(posts.filter(p => p.url.endsWith('class-exam-assignments')).length, count); assert.ok(count > 0);
        await other.close();
    });
    await page.screenshot({ path: path.join(out, (process.env.AP_BROWSER_REPORT || 'phase1a-browser.json').replace('.json', '-final.png')), fullPage: true });
    await browser.close();
    if (tests.some(t => t.status === 'FAIL') || errors.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
