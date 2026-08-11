(function (global) {
    'use strict';

    let current = null;

    function now() {
        return global.performance?.now ? global.performance.now() : Date.now();
    }

    function rendererMode() {
        try {
            return new URLSearchParams(global.location?.search || '').get('renderer') === 'legacy' ? 'legacy' : 'batch';
        } catch (error) {
            return 'batch';
        }
    }

    function start(meta = {}) {
        current = {
            renderer: rendererMode(),
            mode: meta.mode || '',
            questions: Number(meta.questions) || 0,
            startedAt: now(),
            renderReadyMs: 0,
            mathJaxCalls: 0,
            mathJaxTotalMs: 0,
            calls: [],
            phases: {},
            pages: 0
        };
        global.__AP_RENDER_METRICS__ = current;
        try {
            global.document.documentElement.dataset.apRenderReady = 'false';
            global.document.documentElement.dataset.apRenderMetrics = JSON.stringify(current);
        } catch (error) {}
        return current;
    }

    async function measure(label, work) {
        const startedAt = now();
        try {
            return await work();
        } finally {
            if (current) current.phases[label] = Number((now() - startedAt).toFixed(1));
        }
    }

    async function typeset(label, elements) {
        if (!global.MathJax?.typesetPromise) return false;
        const startedAt = now();
        await global.MathJax.typesetPromise(elements);
        const elapsedMs = Number((now() - startedAt).toFixed(1));
        if (current) {
            current.mathJaxCalls += 1;
            current.mathJaxTotalMs = Number((current.mathJaxTotalMs + elapsedMs).toFixed(1));
            current.calls.push({ label, elapsedMs });
        }
        return true;
    }

    function unrenderedMathCount(scope) {
        const text = String(scope?.textContent || '');
        return (text.match(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g) || []).length;
    }

    function finish(scope) {
        if (!current) return null;
        current.renderReadyMs = Number((now() - current.startedAt).toFixed(1));
        current.pages = scope?.querySelectorAll?.('.page')?.length || 0;
        current.unrenderedMath = unrenderedMathCount(scope);
        current.finishedAt = now();
        global.__AP_RENDER_METRICS__ = current;
        try {
            global.document.documentElement.dataset.apRenderMetrics = JSON.stringify(current);
            global.document.documentElement.dataset.apRenderReady = 'true';
        } catch (error) {}
        console.info('[archive-render-metrics]', current);
        return current;
    }

    global.APRenderLoop = { rendererMode, start, measure, typeset, unrenderedMathCount, finish };
    if (typeof module !== 'undefined' && module.exports) module.exports = global.APRenderLoop;
})(typeof window !== 'undefined' ? window : globalThis);
