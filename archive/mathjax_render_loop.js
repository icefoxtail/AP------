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
            foreground: meta.foreground !== false,
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

    // 시간 예산(2026-11-23): 어떤 대기도 끝나지 않는 채로 두지 않는다. 초과하면 기다리지 않고 계속하며 window.__AP_RENDER_BUDGET_HITS__에 남긴다
    // (render-diagnostics.js publish가 RENDER_TIME_BUDGET 알림으로 띠·진단 객체에 올린다). 정상 시험지는 예산에 닿지 않으므로 출력이 같다.
    const TYPESET_BUDGET_MS = 60000;
    const FONT_BUDGET_MS = 10000;
    let typesetStalled = false;
    function budgetFor(name, fallback) {
        const value = Number(global[name]);
        return value > 0 ? value : fallback;
    }
    function recordBudgetHit(label, ms) {
        try { (global.__AP_RENDER_BUDGET_HITS__ = global.__AP_RENDER_BUDGET_HITS__ || []).push({ label, ms }); } catch (error) { /* 기록 실패는 무시 */ }
        console.warn('[archive-render] RENDER_TIME_BUDGET: 기다리지 않고 계속합니다', label, ms + 'ms');
    }
    // promise가 ms 안에 끝나면 true, 아니면 false(기록 후 계속). promise가 나중에 거절되어도 처리하지 않은 거절로 남지 않게 한다.
    async function bounded(promise, ms, label) {
        let timer;
        const guarded = Promise.resolve(promise).then(() => true);
        guarded.catch(() => {});
        const outcome = await Promise.race([guarded, new Promise(resolve => { timer = setTimeout(() => resolve(false), ms); })]);
        clearTimeout(timer);
        if (!outcome) recordBudgetHit(label, ms);
        return outcome;
    }
    function fontsReady(doc) {
        const ready = (doc || global.document)?.fonts?.ready;
        return ready ? bounded(ready, budgetFor('__AP_FONT_BUDGET_MS__', FONT_BUDGET_MS), 'fonts.ready') : Promise.resolve(true);
    }

    async function typeset(label, elements, metrics = current) {
        if (!global.MathJax?.typesetPromise) return false;
        if (global.waitForEnclosedLatinMath) await global.waitForEnclosedLatinMath(elements);
        const startedAt = now();
        const record = () => {
            const elapsedMs = Number((now() - startedAt).toFixed(1));
            if (metrics) {
                metrics.mathJaxCalls += 1;
                metrics.mathJaxTotalMs = Number((metrics.mathJaxTotalMs + elapsedMs).toFixed(1));
                metrics.calls.push({ label, elapsedMs });
            }
        };
        if (typesetStalled) {
            // MathJax가 앞서 예산을 넘겨 멈춘 상태: 다시 기다리지 않고 남은 $는 표식으로만 바꾼다(호출은 한 번으로 센다: 공통 게이트 S09).
            global.APRenderDiagnostics?.sanitize?.(elements);
            record();
            return false;
        }
        const budget = budgetFor('__AP_TYPESET_BUDGET_MS__', TYPESET_BUDGET_MS);
        if (!await bounded(global.MathJax.typesetPromise(elements), budget, 'typeset:' + label)) {
            typesetStalled = true;
            global.APRenderDiagnostics?.sanitize?.(elements);
            record();
            return false;
        }
        // 한 문항의 수식 오류는 그 자리 표식으로 바꾸고 전체를 막지 않는다(render-diagnostics.js를 불러온 화면만). 조판 예외는 위에서 그대로 던진다.
        global.APRenderDiagnostics?.sanitize?.(elements);
        record();
        return true;
    }

    function unrenderedMathCount(scope) {
        // 표식으로 바뀐 글자(원문 $ 포함)는 "남은 $"로 세지 않는다. 표식이 없으면 기존과 같은 textContent.
        const text = String(global.APRenderDiagnostics?.textWithoutMarks ? global.APRenderDiagnostics.textWithoutMarks(scope) : (scope?.textContent || ''));
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

    global.APRenderLoop = { rendererMode, start, measure, typeset, unrenderedMathCount, finish, bounded, fontsReady };
    if (typeof module !== 'undefined' && module.exports) module.exports = global.APRenderLoop;
})(typeof window !== 'undefined' ? window : globalThis);
