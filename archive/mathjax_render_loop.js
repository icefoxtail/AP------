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
        const metrics = {
            renderer: rendererMode(),
            mode: meta.mode || '',
            questions: Number(meta.questions) || 0,
            startedAt: now(),
            renderReadyMs: 0,
            mathJaxCalls: 0,
            mathJaxTotalMs: 0,
            calls: [],
            phases: {},
            pages: 0,
            transactionId: meta.transactionId || null,
            requestGeneration: meta.requestGeneration || null,
            sessionId: meta.sessionId || null,
            rafCount: 0,
            layoutBarrierCount: 0,
            fontWaitMs: 0
        };
        if (meta.publish === false) return metrics;
        current = metrics;
        global.__AP_RENDER_METRICS__ = current;
        try {
            global.document.documentElement.dataset.apRenderReady = 'false';
            global.document.documentElement.dataset.apRenderMetrics = JSON.stringify(current);
        } catch (error) {}
        return current;
    }

    async function measure(label, work, metrics = current) {
        const startedAt = now();
        try {
            return await work();
        } finally {
            if (metrics) metrics.phases[label] = Number((now() - startedAt).toFixed(1));
        }
    }

    async function typeset(label, elements, metrics = current) {
        if (!global.MathJax?.typesetPromise) return false;
        const startedAt = now();
        await global.MathJax.typesetPromise(elements);
        const elapsedMs = Number((now() - startedAt).toFixed(1));
        if (metrics) {
            metrics.mathJaxCalls += 1;
            metrics.mathJaxTotalMs = Number((metrics.mathJaxTotalMs + elapsedMs).toFixed(1));
            metrics.calls.push({ label, elapsedMs });
        }
        return true;
    }

    function unrenderedMathCount(scope) {
        const text = String(scope?.textContent || '');
        return (text.match(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g) || []).length;
    }

    function finish(scope, metrics = current, publish = true) {
        if (!metrics) return null;
        metrics.renderReadyMs = Number((now() - metrics.startedAt).toFixed(1));
        metrics.pages = scope?.querySelectorAll?.('.page')?.length || 0;
        metrics.unrenderedMath = unrenderedMathCount(scope);
        metrics.finishedAt = now();
        if (!publish) return metrics;
        current = metrics;
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
