/* Canonical engine.html adapter. This file contains orchestration, not a renderer. */
function setArchiveBuildEvidence(name, value, ctx) {
    if (ctx) ctx.diagnostics[name] = value;
    else document.documentElement.dataset[name] = value;
}

function setArchiveQpp(qpp) {
    if (archiveScreenRuntime) return archiveScreenRuntime.request({ type: 'QPP_CHANGE', payload: { qpp: Number(qpp) }, foreground: true });
    AppState.qpp = Number(qpp);
    return render();
}

function bindArchiveRuntimePrintReadiness() {
    const runtime = archiveScreenRuntime;
    const snapshot = runtime.activeSnapshot;
    const candidate = runtime.committedCandidate;
    if (snapshot?.commonHardGateEvidence) {
        const preflight = window.APArchiveSnapshotContract.preflight(snapshot, candidate);
        document.documentElement.dataset.apSnapshotPrintPreflight = JSON.stringify(preflight);
        if (!preflight.pass) throw new Error('PRINT_SNAPSHOT_PREFLIGHT_GATE:' + Object.keys(preflight.gates).filter(k => !preflight.gates[k]).join(','));
    }
    if (!snapshot || snapshot.status !== 'ACTIVE' || snapshot.rootNode !== document.getElementById('print-area') ||
        snapshot.sessionId !== candidate?.source.targetSessionId || snapshot.key !== window.APRenderStateNormalizer.computeSnapshotKey(candidate)) throw new Error('PRINT_ACTIVE_BINDING_FAILED');
    if (window.APRenderLoop.unrenderedMathCount(snapshot.rootNode)) throw new Error('MATH_TYPESET_INCOMPLETE');
    const tracker = window.APPrintRuntime.createReadinessTracker('ArchiveAdapter');
    tracker.begin({ snapshotId: snapshot.snapshotId, sessionId: snapshot.sessionId });
    for (const event of snapshot.readinessEvidence.events) tracker.mark(event.state, { ...event.evidence, snapshotId: snapshot.snapshotId });
    archiveReadinessTracker = tracker;
}

async function initArchiveScreenRuntime() {
    installArchivePreviewWitness();
    const params = new URLSearchParams(window.location.search);
    const launch = params.get('data') ? null : readRecentArchiveEngineLaunch();
    const data = params.get('data') || launch?.data;
    if (!data) {
        showArchiveDataLoadError('시험지 데이터가 전달되지 않았습니다. 아카이브에서 시험지를 다시 선택해 주세요.');
        return;
    }
    if (!normalizeArchiveExamScriptPath(data)) { showArchiveDataLoadError(); return; }
    const outcome = await archiveScreenRuntime.request({
        type: 'SOURCE_CHANGE', foreground: true,
        payload: { safeDataUrl: data, mode: params.get('mode') || launch?.mode || 'exam', qpp: Number(params.get('qpp') || launch?.qpp || 4), title: params.get('title') || launch?.title || '' }
    });
    if (!outcome.ok && !archiveScreenRuntime.currentSession) {
        document.documentElement.dataset.apRenderError = outcome.code;
        showArchiveDataLoadError(String(outcome.code).startsWith('SOURCE_LOAD_FAILED')
            ? '시험지 데이터를 불러올 수 없습니다. 아카이브에서 다시 출력해 주세요.'
            : '시험지 렌더링 중 오류가 발생했습니다. 개발자 도구의 apRenderError 값을 확인해 주세요.');
    }
}

function createArchiveScreenRuntime() {
    const N = window.APRenderStateNormalizer;
    const effects = window.APSideEffectLedger.create();
    let sourceRequestSerial = 0;
    let runtime;
    const initialFingerprints = Object.freeze({ engine: 'archive-fast-phase1a-20260910.1', renderAuthority: 'ap-render-authority-v2.2-phase1a', layoutAuthority: '20260906.25', executor: '20260907.1-context1', pageLayout: 'engine-20260910.1', font: 'Nanum-Myeongjo:400,700,800/mathjax-tex', asset: ARCHIVE_ASSET_CACHE_VERSION, qrPolicy: 'archive-qr-v1' });

    function captureInput(intent, desired, committed) {
        if (typeof printPending !== 'undefined' && printPending && intent.type !== 'PRINT_STALE_REBUILD') throw new Error('PRINT_TRANSACTION_BUSY');
        const base = desired || committed?.input || {
            mode: 'exam', qpp: 4, header: {}, safeDataUrl: '', sourceRequestId: '', title: '',
            url: window.location.href, fingerprints: initialFingerprints, profile: {}, layoutOptions: {}
        };
        const next = { ...base };
        const payload = intent.payload || {};
        const url = new URL(base.url);
        if (intent.type === 'SOURCE_CHANGE') {
            const safe = normalizeArchiveExamScriptPath(payload.safeDataUrl || payload.dataUrl || '');
            if (!safe) throw new Error('INVALID_SOURCE_PATH');
            next.safeDataUrl = safe;
            next.sourceRequestId = `source-${++sourceRequestSerial}`;
            next.title = payload.title || '';
            next.header = payload.printHeaderOptions || {};
            next.mode = payload.mode || next.mode;
            next.qpp = payload.qpp ?? next.qpp;
            url.searchParams.set('data', safe);
        }
        if (intent.type === 'MODE_CHANGE') next.mode = intent.requestedMode;
        if (url.searchParams.get('qr') === '1') next.mode = 'sol';
        if (intent.type === 'QPP_CHANGE') next.qpp = payload.qpp;
        if (intent.type === 'HEADER_CHANGE') next.header = { ...base.header, ...payload.printHeaderOptions };
        if (intent.type === 'QR_CHANGE') {
            for (const [key, value] of Object.entries(payload.qrState || {})) {
                if (!['submit', 'sol'].includes(key)) throw new Error('INVALID_QR_STATE');
                url.searchParams.set(key === 'submit' ? 'submitQr' : 'solQr', value ? '1' : '0');
                if (key === 'submit') url.searchParams.delete('osqr');
            }
        }
        if (intent.type === 'PROFILE_CHANGE') next.profile = { ...base.profile, ...payload.profile };
        const invalidation = { FONT_INVALIDATION: 'font', ASSET_INVALIDATION: 'asset', PAGE_LAYOUT_INVALIDATION: 'pageLayout', ENGINE_INVALIDATION: 'engine' }[intent.type];
        if (invalidation) next.fingerprints = { ...base.fingerprints, [invalidation]: String(payload.fingerprint || `${base.fingerprints[invalidation]}:${Date.now()}`) };
        if (!Object.hasOwn(N.MODE_MAP, next.mode)) throw new Error('INVALID_RENDER_MODE');
        if (!Number.isInteger(next.qpp) || next.qpp < 1 || next.qpp > 40) throw new Error('INVALID_QPP');
        url.searchParams.set('mode', next.mode);
        url.searchParams.set('qpp', String(next.qpp));
        next.url = url.href;
        return N.copy(next);
    }

    async function loadSource(input, ctx) {
        const timeout = new AbortController();
        const timer = setTimeout(() => timeout.abort(), 15000);
        const abort = () => timeout.abort();
        ctx.abortSignal.addEventListener('abort', abort, { once: true });
        let sourceCode;
        try {
            const response = await fetch(input.safeDataUrl, { signal: timeout.signal, cache: 'no-cache' });
            if (!response.ok) throw new Error(`SOURCE_LOAD_FAILED:${response.status}`);
            sourceCode = await response.text();
        } finally { clearTimeout(timer); ctx.abortSignal.removeEventListener('abort', abort); }
        if (ctx.abortSignal.aborted) throw new Error('DISCARDED_STALE');
        // Source scripts are canonical archive data scripts. Fetch first so a
        // timed-out script can never execute later and overwrite source globals.
        const names = ['questionBank', 'examTitle', 'examDisplayTitle'];
        const originals = names.map(name => [name, Object.getOwnPropertyDescriptor(window, name)]);
        let raw, title, displayTitle;
        const script = document.createElement('script');
        let scriptError = null;
        const onError = event => { scriptError = event.error || new Error(event.message); };
        try {
            names.forEach(name => { delete window[name]; });
            window.addEventListener('error', onError);
            // Several real banks declare top-level const helpers (U, q,
            // _solutionMap). Their scope belongs to this source load, so loading
            // another bank cannot collide with an earlier lexical declaration.
            script.textContent = `(function () {\n${sourceCode}\n}).call(window);`;
            document.body.appendChild(script);
            if (scriptError) throw scriptError;
            const bank = window.questionBank;
            raw = Array.isArray(bank) ? bank : bank?.questions || bank?.problems;
            if (!Array.isArray(raw) || !raw.length) throw new Error('EMPTY_SOURCE_DATA');
            title = window.examTitle || input.title || '수학 시험지';
            displayTitle = window.examDisplayTitle || title;
        } finally {
            window.removeEventListener('error', onError);
            script.remove();
            originals.forEach(([name, descriptor]) => { if (descriptor) Object.defineProperty(window, name, descriptor); else delete window[name]; });
        }
        if (window.__ARCHIVE_METADATA_READY__) await window.__ARCHIVE_METADATA_READY__;
        const sourceArchiveFile = String(input.safeDataUrl).replace(/^[^#?]*\/exams\//i, '').replace(/[?#].*$/, '').replace(/^\.?\//, '');
        const data = raw.map((question, index) => window.mergeArchiveQuestionMetadata ? window.mergeArchiveQuestionMetadata(question, { sourceArchiveFile, sourceOrdinal: index + 1 }) : question);
        const canonical = window.APRenderAuthority.normalizeArchiveQuestions(data, { sourceArchiveFile });
        const canonicalRenderData = N.canonicalRenderData(canonical, data);
        return N.copy({
            sourceRequestId: input.sourceRequestId, safeDataUrl: input.safeDataUrl, sourceArchiveFile,
            canonicalRenderData, canonicalDataFingerprint: N.semanticDigest(canonicalRenderData),
            title, identityTitle: title, displayTitle,
            businessData: data.map(q => N.project(q, ['id', 'standardUnitKey', 'standardUnit', 'standardCourse']))
        });
    }

    function qrState(input, source) {
        const url = new URL(input.url), p = url.searchParams;
        const preview = p.get('preview') === '1';
        const submit = p.get('submitQr') === '1' || (p.get('submitQr') !== '0' && p.get('osqr') === '1');
        const sol = p.get('solQr') === '1';
        const solution = new URL(url); solution.searchParams.set('mode', 'sol'); solution.searchParams.set('qr', '1');
        const hasClass = !!p.get('class');
        const target = new URL(hasClass ? '../check/' : '../apmath/student/', url);
        if (!hasClass) target.searchParams.set('omr', '1');
        else for (const key of ['class', 'teacher', 'className']) if (p.get(key)) target.searchParams.set(key, p.get(key));
        const today = new Date();
        const date = p.get('date') || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        target.searchParams.set('exam', source.identityTitle || '시험지');
        target.searchParams.set('date', date);
        target.searchParams.set('q', p.get('q') || source.canonicalRenderData.length);
        if (p.get('data')) target.searchParams.set('archiveFile', p.get('data'));
        return N.copy({ submit, sol, preview, hasClass, renderSubmit: submit && !preview && input.mode === 'exam', renderSolution: sol && !preview && input.mode === 'exam', solutionUrl: solution.href, submitUrl: target.href, assignmentDate: p.get('date') || getKstTodayString() });
    }

    async function prepare(input, ctx, committed) {
        const source = committed?.source.sourceRequestId === input.sourceRequestId ? committed.source : await loadSource(input, ctx);
        const state = { title: source.title, identityTitle: source.identityTitle, displayTitle: source.displayTitle };
        const header = normalizePrintHeaderOptions(input.header, state);
        const qr = qrState(input, source);
        const params = new URL(input.url).searchParams;
        return N.createCandidate({
            input, mode: input.mode, qpp: input.qpp,
            source: { ...source, targetSessionId: ctx.requestedTargetSessionId },
            printHeaderOptions: header, qrState: qr,
            rendererMode: params.get('renderer') === 'legacy' ? 'legacy' : 'batch',
            profile: input.profile, layoutOptions: input.layoutOptions,
            environment: { url: input.url, examAuthority: params.get('examAuthority') || 'shared', solutionAuthority: params.get('solutionAuthority') || 'shared', answerAuthority: params.get('answerAuthority') || 'shared' },
            fingerprints: { ...input.fingerprints, qrPayload: N.semanticDigest(qr), printHeader: N.semanticDigest(header), profile: N.semanticDigest(input.profile) }
        });
    }

    async function build(ctx) {
        const candidate = ctx.candidate;
        ctx.buildState = {
            mode: candidate.mode, qpp: candidate.qpp, title: candidate.source.title, identityTitle: candidate.source.identityTitle,
            displayTitle: candidate.source.displayTitle, url: candidate.environment.url,
            printHeaderOptions: candidate.printHeaderOptions, sourceArchiveFile: candidate.source.sourceArchiveFile,
            data: candidate.source.canonicalRenderData.map(q => q.renderInput), canonicalData: candidate.source.canonicalRenderData,
            layoutMeasurementLedger: null, solutionDecisionLedger: null, solutionObservedPlacementLedger: null
        };
        ctx.targetArea = document.createElement('div');
        ctx.targetArea.setAttribute('data-archive-build-root', ctx.transactionId);
        ctx.targetArea.style.cssText = 'position:absolute;left:-20000px;top:0;visibility:hidden;pointer-events:none;';
        ctx.targetArea.setAttribute('aria-hidden', 'true');
        ctx.buildHost = ctx.targetArea;
        ctx.stagingHost = document.createElement('div');
        ctx.stagingHost.setAttribute('data-archive-staging', ctx.transactionId);
        ctx.stagingHost.style.cssText = 'position:absolute;top:-9999px;left:0;visibility:hidden;width:83mm;';
        document.body.append(ctx.targetArea, ctx.stagingHost);
        ctx.metrics = window.APRenderLoop.start({ mode: candidate.mode, questions: ctx.buildState.data.length, transactionId: ctx.transactionId, requestGeneration: ctx.requestGeneration, sessionId: ctx.requestedTargetSessionId, publish: false });
        ctx.diagnostics = {};
        ctx.readinessTracker = window.APPrintRuntime.createReadinessTracker('ArchiveAdapter');
        ctx.readinessTracker.begin({ source: candidate.source.sourceArchiveFile, transactionId: ctx.transactionId });
        ctx.readinessTracker.mark('DATA_READY', { questions: ctx.buildState.data.length, sourceArchiveFile: candidate.source.sourceArchiveFile });
        ctx.deps = {
            ...archiveExamDeps, ...archiveSolutionDeps, ...archiveAnswerDeps,
            appState: ctx.buildState, stagingHost: ctx.stagingHost,
            makePage: (area, type, pageNo) => makePage(area, type, pageNo, ctx.buildState),
            getArchiveQuestionSourceRef: (question, index) => getArchiveQuestionSourceRef(question, index, ctx.buildState),
            rendererMode: () => candidate.rendererMode,
            typesetMath: (label, elements) => window.APRenderLoop.typeset(label, elements, ctx.metrics),
            raf: () => { ctx.metrics.rafCount += 1; ctx.metrics.layoutBarrierCount += 1; return raf(); }
        };
        const fontStart = performance.now();
        if (document.fonts) await document.fonts.ready;
        ctx.metrics.fontWaitMs = performance.now() - fontStart;
        await ctx.deps.raf();
        await renderBody(ctx);
        if (document.fonts) await document.fonts.ready;
        ctx.readinessTracker.mark('RENDER_READY', { mode: candidate.mode, pages: ctx.targetArea.querySelectorAll('.page').length });
        window.APRenderLoop.finish(ctx.targetArea, ctx.metrics, false);
        return { rootNode: ctx.targetArea, sessionId: ctx.requestedTargetSessionId, pageCount: ctx.targetArea.querySelectorAll('.page').length, evidence: ctx.readinessTracker.snapshot() };
    }

    function validate(ctx) {
        if (ctx.result.rootNode !== ctx.targetArea || ctx.result.sessionId !== ctx.requestedTargetSessionId) throw new Error('ROOT_OWNERSHIP_MISMATCH');
        if (!ctx.result.pageCount || !ctx.targetArea.isConnected || getComputedStyle(ctx.targetArea).display === 'none') throw new Error('INVALID_RENDER_ROOT');
        if (!window.MathJax?.typesetPromise || window.APRenderLoop.unrenderedMathCount(ctx.targetArea)) throw new Error('MATH_TYPESET_INCOMPLETE');
        if (ctx.targetArea.querySelector('mjx-merror')) throw new Error('MATH_TYPESET_ERROR');
        if ((ctx.candidate.qrState.renderSubmit || ctx.candidate.qrState.renderSolution) && typeof QRious !== 'function') throw new Error('QR_RUNTIME_UNAVAILABLE');
    }

    function capture(ctx) {
        const area = document.getElementById('print-area');
        const controls = [...document.querySelectorAll('#mode-ctrl input,#mode-ctrl button,#ctrl-title,#qpp-display')].map(node => ({ node, className: node.className, style: node.style.cssText, value: node.value, checked: node.checked, text: node.tagName === 'INPUT' ? null : node.textContent }));
        return { area, parent: area.parentNode, nextSibling: area.nextSibling, appState: { ...AppState }, controls,
            url: location.href, historyState: history.state, readiness: archiveReadinessTracker, metrics: window.__AP_RENDER_METRICS__,
            dataset: { ...document.documentElement.dataset }, scale: document.documentElement.style.getPropertyValue('--screen-page-scale') };
    }
    function attach(ctx, journal) {
        journal.area.removeAttribute('id');
        ctx.targetArea.id = 'print-area';
        ctx.targetArea.removeAttribute('data-archive-build-root');
        ctx.targetArea.removeAttribute('aria-hidden');
        ctx.targetArea.removeAttribute('style');
        journal.parent.replaceChild(ctx.targetArea, journal.area);
    }
    function commit(ctx) {
        Object.assign(AppState, ctx.buildState);
        archiveReadinessTracker = ctx.readinessTracker;
        window.__AP_RENDER_METRICS__ = ctx.metrics;
        document.querySelectorAll('.mode-tab').forEach(tab => tab.classList.toggle('active', tab.id === `btn-${ctx.candidate.mode}`));
        document.getElementById('ctrl-title').innerText = getDisplayTitle(AppState);
        document.getElementById('qpp-display').innerText = `QPP: ${AppState.qpp}`;
        renderPrintHeaderControls();
        // QR controls use the candidate until history becomes visible at the end.
        const qr = ctx.candidate.qrState;
        document.getElementById('chk-submit-qr').checked = qr.submit;
        document.getElementById('chk-sol-qr').checked = qr.sol;
        const count = Number(qr.submit) + Number(qr.sol);
        document.getElementById('btn-qr-output').textContent = count ? `QR 출력: ${count}개` : 'QR 출력: 없음';
        applyQrSolutionLockUI();
        Object.assign(document.documentElement.dataset, ctx.diagnostics);
        document.documentElement.dataset.apPrintReadiness = JSON.stringify(ctx.readinessTracker.snapshot());
        document.documentElement.dataset.apRenderMetrics = JSON.stringify(ctx.metrics);
        document.documentElement.dataset.apRenderReady = 'true';
        // No operation that may throw follows history. pushState is atomic on failure.
        const method = ctx.intentType === 'MODE_CHANGE' ? 'pushState' : 'replaceState';
        history[method](null, '', ctx.candidate.environment.url);
    }
    function rollback(ctx, journal) {
        ctx.targetArea?.removeAttribute('id');
        if (ctx.targetArea?.parentNode === journal.parent) journal.parent.replaceChild(journal.area, ctx.targetArea);
        else if (!journal.area.isConnected) journal.parent.insertBefore(journal.area, journal.nextSibling);
        journal.area.id = 'print-area';
        for (const key of Object.keys(AppState)) delete AppState[key];
        Object.assign(AppState, journal.appState);
        archiveReadinessTracker = journal.readiness;
        window.__AP_RENDER_METRICS__ = journal.metrics;
        for (const item of journal.controls) {
            item.node.className = item.className; item.node.style.cssText = item.style;
            if (item.text !== null) item.node.textContent = item.text;
            if (item.value !== undefined) item.node.value = item.value;
            if (item.checked !== undefined) item.node.checked = item.checked;
        }
        for (const key of Object.keys(document.documentElement.dataset)) delete document.documentElement.dataset[key];
        Object.assign(document.documentElement.dataset, journal.dataset);
        document.documentElement.style.setProperty('--screen-page-scale', journal.scale);
        if (location.href !== journal.url) history.replaceState(journal.historyState, '', journal.url);
    }
    function afterCommit(ctx) {
        ctx.sideEffectsAllowed = true;
        const c = ctx.candidate, p = new URL(c.environment.url).searchParams;
        if (!c.qrState.renderSubmit) return;
        const file = p.get('data') || '';
        const blueprintKey = file + '|' + c.source.businessData.map(q => q.id).join(',');
        effects.execute({ effectId: 'blueprint', key: blueprintKey, triggerEventId: ctx.transactionId, foreground: true, run: () => registerBlueprintToOS(c) });
        if (p.get('class')) {
            const key = [p.get('class'), c.qrState.assignmentDate, file, parseInt(p.get('q'), 10) || c.source.canonicalRenderData.length, 'archive'].join('|');
            effects.execute({ effectId: 'assignment', key, triggerEventId: ctx.transactionId, foreground: true, run: () => registerClassExamAssignmentToOS(c) });
        }
    }
    runtime = window.APScreenRuntime.create({
        captureInput, prepare, build, validate, capture, attach, commit, rollback, afterCommit,
        cacheModes: new URLSearchParams(location.search).get('snapshotCache') === '0' ? [] : ['ans', 'sol'],
        freezeSnapshot(snapshot, ctx) {
            if (['ans', 'sol'].includes(snapshot.mode)) window.APArchiveSnapshotContract.freeze(snapshot, ctx);
        },
        canReuse: (snapshot, ctx) => window.APArchiveSnapshotContract.canReuse(snapshot, ctx),
        reuse(ctx, snapshot) {
            ctx.targetArea = snapshot.rootNode;
            ctx.buildState = { ...snapshot.buildState };
            ctx.diagnostics = { ...snapshot.diagnostics };
            ctx.metrics = window.APRenderLoop.start({ mode: snapshot.mode, transactionId: ctx.transactionId, requestGeneration: ctx.requestGeneration, sessionId: ctx.requestedTargetSessionId, publish: false });
            ctx.metrics.cacheStatus = 'HIT';
            ctx.readinessTracker = window.APPrintRuntime.createReadinessTracker('ArchiveAdapter');
            ctx.readinessTracker.begin({ snapshotId: snapshot.snapshotId });
            for (const event of snapshot.readinessEvidence.events) ctx.readinessTracker.mark(event.state, event.evidence);
            return { rootNode: snapshot.rootNode, sessionId: snapshot.sessionId, pageCount: snapshot.pageCount, evidence: ctx.readinessTracker.snapshot() };
        },
        cleanup(root) { if (!root) return; window.MathJax?.typesetClear?.([root]); root.remove(); },
        release(ctx) { if (ctx.stagingHost) { window.MathJax?.typesetClear?.([ctx.stagingHost]); ctx.stagingHost.remove(); } },
        visible: async () => { updateScreenFitScale(); await raf(); },
        onRequest(promise) { window.__AP_RENDER_READY__ = promise; },
        observe(event, ctx) {
            document.documentElement.dataset.apScreenRuntime = JSON.stringify({ event, transactionId: ctx.transactionId, requestGeneration: ctx.requestGeneration, state: ctx.state, error: ctx.error || null, committed: ctx.committed, visibleReadyMs: ctx.visibleReadyMs || null });
        }
    });
    let fontReadyObserved = false;
    document.fonts?.ready.then(() => { fontReadyObserved = true; });
    document.fonts?.addEventListener('loadingdone', () => {
        // Fonts loaded by this serialized build belong to its readiness barrier;
        // they must not supersede the user intent that caused the load.
        if (fontReadyObserved && runtime.currentSession && !runtime.busy) runtime.request({ type: 'FONT_INVALIDATION', reason: 'font-loadingdone', foreground: true });
    });
    window.__AP_SIDE_EFFECT_LEDGER__ = effects;
    return runtime;
}
