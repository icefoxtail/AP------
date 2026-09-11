const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'reports/archive-fast-engine-v2');
const base = 'http://127.0.0.1:8766/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&mode=exam&prewarm=0&snapshotCache=0';
const version = '20260911.4';
const runtimeScripts = ['mathjax_render_loop', 'layout-authority', 'layout-materializer', 'solution-render-executor', 'exam-render-executor', 'render-state-normalizer', 'side-effect-ledger', 'screen-runtime', 'snapshot-contract', 'screen-runtime-adapter'];

(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const results = [];
    for (const width of [1440, 390]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(String(error)));
        // Seed an older URL in the same browser cache. Query identity must force
        // current runtime files to load even when the old resource is warm.
        await page.goto('http://127.0.0.1:8766/archive/layout-authority.js?v=20260906.25');
        await page.goto(base);
        await page.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot, { timeout: 60000 });
        await page.evaluate(() => archiveScreenRuntime.whenIdle());
        const scripts = await page.evaluate(() => [...document.scripts].map(script => script.src).filter(Boolean));
        for (const script of runtimeScripts) assert.ok(scripts.some(src => src.endsWith(`/archive/${script}.js?v=20260911.4`)), script);
        const identity = await page.evaluate(() => ({
            runtime: Boolean(window.APScreenRuntime), planner: typeof window.APLayoutAuthority?.planMeasuredSolutionLayout,
            materializer: Boolean(window.APArchiveLayoutMaterializer), fingerprint: archiveScreenRuntime.committedCandidate.fingerprints
        }));
        assert.equal(identity.runtime, true); assert.equal(identity.planner, 'function'); assert.equal(identity.materializer, true);
        assert.equal(identity.fingerprint.engine, 'archive-fast-phase6-20260911.4');
        assert.equal(identity.fingerprint.layoutAuthority, 'measured-production-v1-20260911.4');

        await page.getByRole('button', { name: '헤더 수정' }).click();
        const input = page.locator('#print-header-title-input');
        await input.fill('A');
        await input.pressSequentially('BC', { delay: 0 });
        await page.evaluate(() => archiveScreenRuntime.whenIdle());
        const header = await page.evaluate(() => ({
            value: document.getElementById('print-header-title-input').value,
            committed: AppState.printHeaderOptions.title,
            candidate: archiveScreenRuntime.committedCandidate.printHeaderOptions.title,
            pageTitle: document.querySelector('.page-header-title')?.textContent || '',
            attempts: archiveScreenRuntime.inspect().attempts.filter(attempt => attempt.intentType === 'HEADER_CHANGE').length
        }));
        assert.equal(header.value, 'ABC');
        assert.equal(header.committed, 'ABC');
        assert.equal(header.candidate, 'ABC');
        assert.equal(header.pageTitle, 'ABC');
        assert.ok(header.attempts >= 2);

        const source = `window.examTitle='Authority clipping fixture';window.questionBank=[{id:1,content:'문제',choices:[],answer:'1',solution:'정상 해설'}];`;
        const clipping = await page.evaluate(async script => {
            const url = URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
            const result = await archiveScreenRuntime.request({ type: 'SOURCE_CHANGE', payload: { safeDataUrl: url, mode: 'sol' } });
            URL.revokeObjectURL(url);
            const column = document.querySelector('.sol-grid-col');
            const box = document.querySelector('.sol-box');
            const wide = document.createElement('span');
            wide.textContent = 'WIDE';
            wide.style.cssText = 'display:inline-block;white-space:nowrap;transform:scaleX(40);transform-origin:left top;';
            box?.querySelector('.sol-exp')?.appendChild(wide);
            const colStyle = column ? getComputedStyle(column) : null;
            const boxStyle = box ? getComputedStyle(box) : null;
            const colRect = column?.getBoundingClientRect(); const wideRect = wide?.getBoundingClientRect();
            return { ok: result.ok, code: result.code || null, colClass: column?.className || '', colOverflow: colStyle?.overflow || '', boxOverflowX: boxStyle?.overflowX || '', spills: Boolean(wideRect && colRect && wideRect.right > colRect.right), transform: wide ? getComputedStyle(wide).transform : '', wideRight: wideRect?.right || 0, colRight: colRect?.right || 0, planner: AppState.layoutAuthorityEvidence?.planner || null };
        }, source);
        assert.equal(clipping.ok, true);
        assert.equal(clipping.code, null);
        assert.equal(clipping.colClass, 'grid-col sol-grid-col');
        assert.equal(clipping.colOverflow, 'visible');
        assert.equal(clipping.boxOverflowX, 'visible');
        assert.equal(clipping.transform, 'matrix(40, 0, 0, 1, 0, 0)');
        assert.equal(clipping.spills, true, JSON.stringify(clipping));
        assert.equal(clipping.planner, 'MEASURED_SOLUTION_PRODUCTION');

        await page.goto(base);
        await page.waitForFunction(() => window.archiveScreenRuntime?.activeSnapshot);
        await page.evaluate(() => archiveScreenRuntime.whenIdle());
        const warm = await page.evaluate(() => [...document.scripts].map(script => script.src).filter(src => src.includes('/archive/')).filter(src => src.includes('?v=20260911.4')).length);
        assert.equal(warm, runtimeScripts.length);
        assert.deepEqual(errors, []);
        results.push({ width, identity, header, clipping, warmScriptCount: warm, errors });
        await context.close();
        console.log('PASS', width);
    }
    fs.writeFileSync(path.join(out, 'main-readiness-browser.json'), JSON.stringify({ version, results }, null, 2));
    await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
