/* Shared DOM/snapshot host for source/composition adapters. APScreenRuntime
 * remains the transaction authority used by Archive, Mixer and Wrong Clinic. */
(function (root) {
    'use strict';
    const N = root.APRenderStateNormalizer;
    const clone = value => JSON.parse(JSON.stringify(N.copy(value)));
    const geometry = node => [...node.querySelectorAll('.page')].map(page => {
        const body = page.querySelector('.page-body');
        return { width: page.offsetWidth, height: page.offsetHeight, bodyWidth: body?.clientWidth || 0, bodyHeight: body?.clientHeight || 0,
            blocks: [...page.querySelectorAll('.page-header,.grid-container,.grid-col,.q-box,.ans-cell,.page-qr,.page-submit-qr')].map(block => [block.offsetLeft, block.offsetTop, block.offsetWidth, block.offsetHeight]) };
    });
    const canvases = node => [...node.querySelectorAll('canvas')].map(canvas => canvas.toDataURL());
    function create(policy) {
        let runtime, printLocked = false, idleTimer = null, revisionSerial = 0;
        const params = new URLSearchParams(location.search);
        const cacheEnabled = params.get('snapshotCache') !== '0';
        function cancelWarm() { clearTimeout(idleTimer); idleTimer = null; }
        function check(ctx) { if (ctx.abortSignal.aborted) throw Error('DISCARDED_STALE'); }
        const adapter = {
            cacheModes: cacheEnabled ? policy.modes : [],
            enablePrewarm: cacheEnabled,
            captureInput(intent, desired, committed) {
                if (printLocked && intent.type !== 'PRINT_STALE_REBUILD') throw Error('PRINT_TRANSACTION_BUSY');
                const refresh = ['SOURCE_CHANGE', 'FORCED_REBUILD'].includes(intent.type);
                const state = clone((!refresh && desired?.state) || policy.getState());
                policy.applyIntent(state, intent);
                if (!policy.modes.includes(state.mode)) throw Error('INVALID_RENDER_MODE');
                const url = new URL((!refresh && desired?.url) || location.href);
                if (intent.type === 'QR_CHANGE') {
                    for (const [key, value] of Object.entries(intent.payload.qr || {})) url.searchParams.set(key, value ? '1' : '0');
                    url.searchParams.delete('osqr');
                }
                url.searchParams.set('mode', state.mode);
                if (state.qpp) url.searchParams.set('qpp', String(state.qpp));
                const sourceRequestId = N.semanticDigest(policy.sourceIdentity(state));
                return N.copy({ state, mode: state.mode, sourceRequestId, url: url.href,
                    revision: intent.type.endsWith('INVALIDATION') ? ++revisionSerial : (desired?.revision || committed?.input.revision || 0) });
            },
            async prepare(input, ctx) {
                ctx.fetchText = async (url, options = {}) => {
                    const controller = new AbortController();
                    const abort = () => controller.abort();
                    const timer = setTimeout(abort, 15000);
                    ctx.abortSignal.addEventListener('abort', abort, { once: true });
                    try {
                        check(ctx);
                        const response = await fetch(url, { ...options, signal: controller.signal });
                        if (!response.ok) throw Error(`SOURCE_LOAD_FAILED:${response.status}`);
                        const text = await response.text(); check(ctx); return text;
                    } finally { clearTimeout(timer); ctx.abortSignal.removeEventListener('abort', abort); }
                };
                const state = clone(input.state);
                await policy.prepareState?.(state, ctx);
                check(ctx);
                return N.copy({ input, mode: input.mode, canonicalMode: input.mode,
                    source: { targetSessionId: ctx.requestedTargetSessionId, sourceRequestId: input.sourceRequestId,
                        sourceArchiveFile: policy.name, canonicalDataFingerprint: N.semanticDigest((policy.renderIdentity || policy.sourceIdentity)(state)),
                        businessData: policy.sourceIdentity(input.state) },
                    state, environment: { url: input.url },
                    fingerprints: { engine: 'common-fast-v1', pageLayout: policy.name, font: 'Nanum-Myeongjo/MathJax', asset: '20260828.1', revision: input.revision } });
            },
            async build(ctx) {
                check(ctx);
                ctx.targetArea = document.createElement('div');
                ctx.targetArea.dataset.fastBuild = ctx.transactionId;
                ctx.targetArea.style.cssText = 'position:absolute;left:-20000px;top:0;visibility:hidden;pointer-events:none;';
                ctx.targetArea.setAttribute('aria-hidden', 'true');
                ctx.stagingHost = document.createElement('div');
                ctx.stagingHost.style.cssText = 'position:absolute;top:-9999px;left:0;visibility:hidden;width:83mm;';
                document.body.append(ctx.targetArea, ctx.stagingHost);
                ctx.buildState = clone(ctx.candidate.state);
                ctx.diagnostics = {};
                ctx.metrics = root.APRenderLoop.start({ mode: ctx.input.mode, transactionId: ctx.transactionId, requestGeneration: ctx.requestGeneration, sessionId: ctx.requestedTargetSessionId, foreground: ctx.foreground, publish: false });
                ctx.readinessTracker = root.APPrintRuntime.createReadinessTracker(policy.name);
                ctx.readinessTracker.begin({ transactionId: ctx.transactionId });
                ctx.typeset = async (label, nodes) => { check(ctx); const result = await root.APRenderLoop.typeset(label, nodes, ctx.metrics); check(ctx); return result; };
                ctx.raf = async () => { check(ctx); ctx.metrics.rafCount += 1; ctx.metrics.layoutBarrierCount += 1; await new Promise(resolve => { let done = false; const finish = () => { if (!done) { done = true; resolve(); } }; requestAnimationFrame(finish); setTimeout(finish, 32); }); check(ctx); };
                await document.fonts?.ready;
                check(ctx);
                ctx.binding = policy.createBuild(ctx);
                await ctx.binding.build();
                check(ctx);
                await document.fonts?.ready;
                const images = await ctx.binding.waitImages(ctx.targetArea);
                ctx.readinessTracker.mark('IMAGE_READY', images);
                ctx.readinessTracker.mark('LAYOUT_READY', { pages: ctx.targetArea.querySelectorAll('.page').length });
                ctx.readinessTracker.mark('RENDER_READY', { mode: ctx.input.mode });
                root.APRenderLoop.finish(ctx.targetArea, ctx.metrics, false);
                return { rootNode: ctx.targetArea, sessionId: ctx.requestedTargetSessionId, pageCount: ctx.targetArea.querySelectorAll('.page').length, evidence: ctx.readinessTracker.snapshot() };
            },
            validate(ctx) {
                check(ctx);
                if (!root.MathJax?.typesetPromise || root.APRenderLoop.unrenderedMathCount(ctx.targetArea)) throw Error('MATH_TYPESET_INCOMPLETE');
                if (ctx.targetArea.querySelector('mjx-merror')) throw Error('MATH_TYPESET_ERROR');
                ctx.binding.validate?.();
            },
            capture() {
                return { area: document.getElementById('print-area'), state: policy.captureState?.() || policy.getState(), tracker: policy.getReadiness?.(),
                    metrics: root.__AP_RENDER_METRICS__, scale: document.documentElement.style.getPropertyValue('--screen-page-scale'),
                    controls: [...document.querySelectorAll('#mode-ctrl button,#mode-ctrl input,#mode-ctrl select,#ctrl-title')].map(node => ({ node, value: node.value, checked: node.checked, className: node.className, text: node.tagName === 'BUTTON' || node.id === 'ctrl-title' ? node.textContent : null })),
                    dataset: { ...document.documentElement.dataset }, url: location.href };
            },
            attach(ctx, journal) {
                journal.area.removeAttribute('id');
                ctx.targetArea.id = 'print-area';
                ctx.targetArea.removeAttribute('style');
                ctx.targetArea.removeAttribute('aria-hidden');
                ctx.targetArea.removeAttribute('data-fast-build');
                journal.area.replaceWith(ctx.targetArea);
            },
            commit(ctx) {
                policy.commit(ctx.buildState, ctx);
                Object.assign(document.documentElement.dataset, ctx.diagnostics);
                document.documentElement.dataset.apPrintReadiness = JSON.stringify(ctx.readinessTracker.snapshot());
                document.documentElement.dataset.apRenderReady = 'true';
                root.__AP_RENDER_METRICS__ = ctx.metrics;
                history.replaceState(history.state, '', ctx.input.url);
            },
            rollback(ctx, journal) {
                if (ctx.targetArea.isConnected) ctx.targetArea.replaceWith(journal.area);
                ctx.targetArea.removeAttribute('id'); journal.area.id = 'print-area';
                (policy.restoreState || policy.commit)(journal.state);
                policy.bindReadiness?.(journal.tracker);
                root.__AP_RENDER_METRICS__ = journal.metrics;
                document.documentElement.style.setProperty('--screen-page-scale', journal.scale);
                for (const item of journal.controls) { Object.assign(item.node, { value: item.value, checked: item.checked, className: item.className }); if (item.text !== null) item.node.textContent = item.text; }
                for (const key of Object.keys(document.documentElement.dataset)) delete document.documentElement.dataset[key];
                Object.assign(document.documentElement.dataset, journal.dataset);
            },
            afterCommit(ctx) { policy.afterCommit?.(ctx); },
            freezeSnapshot(snapshot, ctx) {
                snapshot.buildState = N.copy(ctx.buildState);
                snapshot.diagnostics = { ...ctx.diagnostics };
                snapshot.html = snapshot.rootNode.innerHTML;
                snapshot.geometry = geometry(snapshot.rootNode);
                snapshot.canvases = canvases(snapshot.rootNode);
            },
            canReuse(snapshot) { return document.fonts.status === 'loaded' && !!root.MathJax?.typesetPromise && snapshot.html === snapshot.rootNode.innerHTML && N.semanticDigest(canvases(snapshot.rootNode)) === N.semanticDigest(snapshot.canvases) && !root.APRenderLoop.unrenderedMathCount(snapshot.rootNode) && !snapshot.rootNode.querySelector('mjx-merror') && [...snapshot.rootNode.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0); },
            reuse(ctx, snapshot) {
                ctx.targetArea = snapshot.rootNode; ctx.buildState = clone(snapshot.buildState); ctx.diagnostics = { ...snapshot.diagnostics };
                ctx.metrics = root.APRenderLoop.start({ mode: snapshot.mode, transactionId: ctx.transactionId, requestGeneration: ctx.requestGeneration, sessionId: ctx.requestedTargetSessionId, foreground: ctx.foreground, publish: false });
                ctx.metrics.cacheStatus = 'HIT';
                ctx.readinessTracker = root.APPrintRuntime.createReadinessTracker(policy.name);
                ctx.readinessTracker.begin({ snapshotId: snapshot.snapshotId });
                for (const event of snapshot.readinessEvidence.events) ctx.readinessTracker.mark(event.state, event.evidence);
                return { rootNode: snapshot.rootNode, sessionId: snapshot.sessionId, pageCount: snapshot.pageCount, evidence: snapshot.readinessEvidence };
            },
            storeSnapshot(snapshot) { snapshot.rootNode.remove(); },
            cleanup(node) { if (node) { root.MathJax?.typesetClear?.([node]); node.remove(); } },
            release(ctx) { if (ctx.stagingHost) { root.MathJax?.typesetClear?.([ctx.stagingHost]); ctx.stagingHost.remove(); } },
            visible(ctx) { policy.visible?.(ctx); },
            onRequest(promise) { cancelWarm(); root.__AP_RENDER_READY__ = promise; },
            observe(event, ctx) {
                if (ctx.background) return;
                document.documentElement.dataset.apCommonFastRuntime = JSON.stringify({ adapter: policy.name, event, generation: ctx.requestGeneration, cache: ctx.cacheStatus, error: ctx.error || null });
                if (event === 'VISIBLE_READY' && cacheEnabled && params.get('prewarm') === '1') {
                    const candidate = runtime.committedCandidate;
                    idleTimer = setTimeout(async () => { for (const mode of policy.modes) { if (runtime.committedCandidate !== candidate || printLocked) return; if (mode !== candidate.mode) await runtime.prewarm(mode); } }, 100);
                }
            }
        };
        runtime = root.APScreenRuntime.create(adapter);
        document.fonts?.addEventListener('loadingdone', () => {
            if (runtime.currentSession && !runtime.busy && !printLocked) runtime.request({ type: 'FONT_INVALIDATION' });
        });
        async function preflight() {
            cancelWarm();
            try {
                root.APPrintRuntime.assertSuccessfulRender(await root.__AP_RENDER_READY__);
                printLocked = true;
                runtime.cancelBackground();
                const outcome = await runtime.whenIdle();
                root.APPrintRuntime.assertSuccessfulRender(outcome);
                let snapshot = runtime.activeSnapshot;
                if (!snapshot || snapshot.rootNode !== document.getElementById('print-area') || snapshot.key !== N.computeSnapshotKey(runtime.committedCandidate)) throw Error('PRINT_ACTIVE_BINDING_FAILED');
                const valid = snapshot => adapter.canReuse(snapshot) && N.semanticDigest(geometry(snapshot.rootNode)) === N.semanticDigest(snapshot.geometry);
                if (!valid(snapshot)) {
                    root.APPrintRuntime.assertSuccessfulRender(await runtime.request({ type: 'PRINT_STALE_REBUILD' }));
                    snapshot = runtime.activeSnapshot;
                }
                if (!valid(snapshot)) throw Error('PRINT_SNAPSHOT_PREFLIGHT_FAILED');
                if (!snapshot.pageCount) throw Error('PRINT_EMPTY_DOCUMENT');
                const tracker = root.APPrintRuntime.createReadinessTracker(policy.name);
                tracker.begin({ snapshotId: snapshot.snapshotId });
                for (const event of snapshot.readinessEvidence.events) tracker.mark(event.state, event.evidence);
                policy.bindReadiness?.(tracker);
                return { ok: true, snapshotId: snapshot.snapshotId, pages: snapshot.pageCount };
            } catch (error) { printLocked = false; error.code ||= error.message; throw error; }
        }
        root.addEventListener('afterprint', () => { printLocked = false; });
        return Object.freeze({ runtime, preflight, unlockPrint: () => { printLocked = false; } });
    }
    const isAvailable = () => !!(root.APScreenRuntime?.create && root.APRenderStateNormalizer && root.APRenderLoop && root.APPrintRuntime && root.APExamRenderExecutor?.renderComposed && root.APSolutionRenderExecutor?.renderComposed && root.APAnswerRenderExecutor?.render);
    root.APCommonFastRuntime = Object.freeze({ create, isAvailable });
})(window);
