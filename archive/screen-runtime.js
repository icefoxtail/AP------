(function (root, factory) {
    const normalizer = typeof module === 'object' && module.exports ? require('./render-state-normalizer.js') : root.APRenderStateNormalizer;
    const api = factory(normalizer);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APScreenRuntime = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function (N) {
    'use strict';
    const RenderIntentType = Object.freeze(Object.fromEntries(['MODE_CHANGE', 'HEADER_CHANGE', 'QR_CHANGE', 'QPP_CHANGE', 'SOURCE_CHANGE', 'PROFILE_CHANGE', 'FONT_INVALIDATION', 'ASSET_INVALIDATION', 'PAGE_LAYOUT_INVALIDATION', 'ENGINE_INVALIDATION', 'FORCED_REBUILD', 'PRINT_STALE_REBUILD'].map(key => [key, key])));
    const BuildAttemptState = Object.freeze(Object.fromEntries(['QUEUED', 'BUILDING', 'SUCCEEDED', 'FAILED', 'ABORTED', 'DISCARDED_STALE'].map(key => [key, key])));
    const ModeSnapshotStatus = Object.freeze(Object.fromEntries(['READY', 'ACTIVE', 'STALE', 'EVICTED'].map(key => [key, key])));
    let serial = 0;
    const unique = prefix => `${prefix}-${Date.now()}-${++serial}`;

    function promotePendingSession({ pending, candidate, promotedSnapshot, committedAt }) {
        if (pending.status !== 'READY_TO_COMMIT' || promotedSnapshot.sessionId !== pending.targetSessionId || candidate.source.targetSessionId !== pending.targetSessionId) throw new Error('PENDING_TARGET_SESSION_MISMATCH');
        return {
            sessionId: pending.targetSessionId,
            sourceArchiveFile: candidate.source.sourceArchiveFile,
            canonicalDataFingerprint: candidate.source.canonicalDataFingerprint,
            engineFingerprint: candidate.fingerprints.engine,
            layoutFingerprint: candidate.fingerprints.pageLayout,
            fontFingerprint: candidate.fingerprints.font,
            assetFingerprint: candidate.fingerprints.asset,
            activeMode: promotedSnapshot.mode,
            activeSnapshotKey: promotedSnapshot.key,
            status: 'CURRENT',
            modeSnapshots: { ...pending.preparedSnapshots, [promotedSnapshot.mode]: promotedSnapshot },
            createdAt: pending.createdAt,
            promotedAt: committedAt
        };
    }

    function create(adapter) {
        let currentRequestGeneration = 0, currentSession = null, activeSnapshot = null, committedCandidate = null;
        let tail = Promise.resolve(), activeContext = null, latestReady = Promise.resolve({ ok: false, code: 'RENDER_NOT_STARTED' });
        let desired = null;
        const attempts = [], cleanupPending = [];
        const owners = new WeakMap();
        const canCache = mode => (adapter.cacheModes || []).includes(mode);
        function isLatest(ctx) { return ctx.requestGeneration === currentRequestGeneration && !ctx.abortSignal.aborted; }
        function observe(event, ctx) { try { adapter.observe?.(event, ctx); } catch (_) { /* observability cannot undo a commit */ } }
        async function cleanup(root, session, snapshot) {
            try {
                await adapter.cleanup?.(root);
                if (snapshot) snapshot.status = 'EVICTED';
                if (session) { session.status = 'EVICTED'; session.modeSnapshots = { exam: null, sol: null, ans: null }; }
            } catch (error) { cleanupPending.push({ root, session, snapshot, error: String(error) }); }
        }
        async function run(ctx) {
            if (!isLatest(ctx)) return { ok: false, code: 'DISCARDED_STALE' };
            activeContext = ctx;
            const oldSnapshot = activeSnapshot;
            const oldSession = currentSession;
            try {
                ctx.state = 'BUILDING';
                ctx.currentSessionId = currentSession?.sessionId || null;
                const sourceChange = !currentSession || ctx.input.sourceRequestId !== committedCandidate?.source.sourceRequestId;
                ctx.requestedTargetSessionId = sourceChange ? unique('session') : currentSession.sessionId;
                ctx.pendingSession = sourceChange ? {
                    pendingSessionId: unique('pending'), targetSessionId: ctx.requestedTargetSessionId,
                    parentCurrentSessionId: ctx.currentSessionId, preparedSnapshots: { exam: null, sol: null, ans: null },
                    status: 'PREPARING', intendedInitialMode: ctx.input.mode, createdAt: Date.now(), promotedSessionId: null
                } : null;
                ctx.candidate = await adapter.prepare(ctx.input, ctx, committedCandidate);
                if (!isLatest(ctx)) throw new Error('DISCARDED_STALE');
                N.assertImmutable(ctx.candidate);
                if (ctx.candidate.source.targetSessionId !== ctx.requestedTargetSessionId) throw new Error('CANDIDATE_TARGET_SESSION_MISMATCH');
                ctx.keyInputDigest = N.semanticDigest(ctx.candidate);
                ctx.snapshotKey = N.computeSnapshotKey(ctx.candidate);
                const cached = !sourceChange && canCache(ctx.candidate.mode) && currentSession.modeSnapshots[ctx.candidate.mode];
                const force = ['FORCED_REBUILD', 'PRINT_STALE_REBUILD'].includes(ctx.intentType);
                const hit = !force && cached?.status === 'READY' && cached.sessionId === ctx.requestedTargetSessionId && cached.key === ctx.snapshotKey && owners.get(cached.rootNode) === cached && adapter.canReuse?.(cached, ctx);
                ctx.cacheStatus = hit ? 'HIT' : 'MISS';
                ctx.result = hit ? await adapter.reuse(ctx, cached) : await adapter.build(ctx);
                if (!isLatest(ctx)) throw new Error('DISCARDED_STALE');
                ctx.buildInputDigest = N.semanticDigest(ctx.candidate);
                if (ctx.keyInputDigest !== ctx.buildInputDigest || ctx.result.sessionId !== ctx.requestedTargetSessionId) throw new Error('BUILD_INPUT_PARITY_FAILED');
                if (!hit) await adapter.validate?.(ctx);
                if (!isLatest(ctx)) throw new Error('DISCARDED_STALE');
                ctx.state = 'SUCCEEDED';
                const snapshot = hit ? cached : {
                    snapshotId: unique('snapshot'), mode: ctx.candidate.mode, canonicalMode: ctx.candidate.canonicalMode,
                    key: ctx.snapshotKey, sessionId: ctx.requestedTargetSessionId, status: 'READY',
                    rootNode: ctx.result.rootNode, ownershipToken: unique('owner'), pageCount: ctx.result.pageCount,
                    readinessEvidence: ctx.result.evidence, builtRequestGeneration: ctx.requestGeneration,
                    createdAt: Date.now(), lastUsedAt: Date.now()
                };
                ctx.snapshot = snapshot;
                if (!hit) { adapter.freezeSnapshot?.(snapshot, ctx); owners.set(snapshot.rootNode, snapshot); }
                let nextSession = currentSession;
                if (ctx.pendingSession) {
                    Object.assign(ctx.pendingSession, {
                        status: 'READY_TO_COMMIT', sourceArchiveFile: ctx.candidate.source.sourceArchiveFile,
                        canonicalDataFingerprint: ctx.candidate.source.canonicalDataFingerprint,
                        engineFingerprint: ctx.candidate.fingerprints.engine, layoutFingerprint: ctx.candidate.fingerprints.pageLayout,
                        fontFingerprint: ctx.candidate.fingerprints.font, assetFingerprint: ctx.candidate.fingerprints.asset
                    });
                    ctx.pendingSession.preparedSnapshots[snapshot.mode] = snapshot;
                    nextSession = promotePendingSession({ pending: ctx.pendingSession, candidate: ctx.candidate, promotedSnapshot: snapshot, committedAt: Date.now() });
                }
                // Capture all throw-prone materialization before the synchronous commit.
                const journal = adapter.capture(ctx);
                const oldCandidate = committedCandidate;
                const oldSessionFields = oldSession && { ...oldSession, modeSnapshots: { ...oldSession.modeSnapshots } };
                const oldStatus = oldSnapshot?.status;
                ctx.commitReadyAt = Date.now();
                try {
                    if (!isLatest(ctx)) throw new Error('DISCARDED_STALE');
                    adapter.attach(ctx, journal);
                    if (oldSnapshot) oldSnapshot.status = 'READY';
                    snapshot.status = 'ACTIVE';
                    currentSession = nextSession;
                    currentSession.activeMode = snapshot.mode;
                    currentSession.activeSnapshotKey = snapshot.key;
                    currentSession.modeSnapshots = { ...currentSession.modeSnapshots, [snapshot.mode]: snapshot };
                    activeSnapshot = snapshot;
                    committedCandidate = ctx.candidate;
                    if (ctx.pendingSession) { ctx.pendingSession.status = 'PROMOTED'; ctx.pendingSession.promotedSessionId = nextSession.sessionId; }
                    adapter.commit(ctx, journal); // synchronous DOM/state/controls/history only
                    ctx.committed = true;
                } catch (error) {
                    if (oldSnapshot) oldSnapshot.status = oldStatus;
                    snapshot.status = 'READY';
                    if (oldSession) Object.assign(oldSession, oldSessionFields);
                    currentSession = oldSession; activeSnapshot = oldSnapshot; committedCandidate = oldCandidate;
                    adapter.rollback(ctx, journal);
                    throw error;
                }
                ctx.state = 'SUCCEEDED';
                ctx.commitMs = Date.now() - ctx.commitReadyAt;
                observe('COMMIT_SUCCESS', ctx);
                // Keep optional post-commit effects and cleanup out of correctness rollback.
                try { adapter.afterCommit?.(ctx); } catch (error) { observe('POST_COMMIT_EFFECT_FAILED', { ...ctx, error }); }
                if (oldSession && oldSession !== currentSession) oldSession.status = 'RETIRED_PENDING_CLEANUP';
                const retired = new Set();
                if (oldSession && oldSession !== currentSession) Object.values(oldSession.modeSnapshots).filter(Boolean).forEach(s => retired.add(s));
                else {
                    if (oldSnapshot && (!canCache(oldSnapshot.mode) || oldSnapshot.mode === snapshot.mode)) retired.add(oldSnapshot);
                    if (cached && cached !== snapshot) retired.add(cached);
                }
                for (const obsolete of retired) if (obsolete !== snapshot) await cleanup(obsolete.rootNode, null, obsolete);
                if (oldSession && oldSession !== currentSession) { oldSession.status = 'EVICTED'; oldSession.modeSnapshots = { exam: null, sol: null, ans: null }; }
                for (const [mode, s] of Object.entries(currentSession.modeSnapshots)) if (s?.status === 'EVICTED') currentSession.modeSnapshots[mode] = null;
                for (const item of cleanupPending.splice(0)) await cleanup(item.root, item.session, item.snapshot);
                await adapter.visible?.(ctx);
                ctx.visibleReadyMs = Date.now() - ctx.createdAt;
                observe('VISIBLE_READY', ctx);
                return { ok: true, mode: snapshot.mode, pages: snapshot.pageCount, transactionId: ctx.transactionId, sessionId: currentSession.sessionId };
            } catch (error) {
                if (ctx.committed) { observe('POST_COMMIT_OBSERVATION_FAILED', { ...ctx, error }); return { ok: true, mode: committedCandidate.mode, transactionId: ctx.transactionId }; }
                ctx.state = !isLatest(ctx) ? 'DISCARDED_STALE' : 'FAILED';
                ctx.error = String(error?.message || error);
                if (ctx.pendingSession) { ctx.pendingSession.status = 'ABORTED'; ctx.pendingSession.preparedSnapshots = { exam: null, sol: null, ans: null }; }
                if (ctx.cacheStatus !== 'HIT') await cleanup(ctx.result?.rootNode || ctx.targetArea, null, ctx.snapshot);
                observe('BUILD_FAILED', ctx);
                if (isLatest(ctx)) desired = null;
                return { ok: false, code: ctx.state === 'DISCARDED_STALE' ? ctx.state : ctx.error, transactionId: ctx.transactionId };
            } finally {
                try { await adapter.release?.(ctx); }
                catch (error) { observe('STAGING_CLEANUP_FAILED', { ...ctx, error }); await cleanup(ctx.stagingHost, null, null); }
                if (activeContext === ctx) activeContext = null;
                // Do not retain failed/pending DOM or copied data in diagnostic history.
                attempts.push({ transactionId: ctx.transactionId, requestGeneration: ctx.requestGeneration, intentType: ctx.intentType, cacheStatus: ctx.cacheStatus, state: ctx.state, committed: !!ctx.committed, error: ctx.error || null, requestedTargetSessionId: ctx.requestedTargetSessionId, keyBuildParity: ctx.keyInputDigest === ctx.buildInputDigest, visibleReadyMs: ctx.visibleReadyMs || null, metrics: ctx.metrics || null });
                if (attempts.length > 50) attempts.shift();
            }
        }
        function request(value) {
            if (!Object.hasOwn(RenderIntentType, value?.type)) return Promise.resolve({ ok: false, code: 'UNKNOWN_RENDER_INTENT' });
            if (value.foreground === false) return Promise.resolve({ ok: false, code: 'BACKGROUND_NOT_ENABLED_PHASE1A' });
            let intent, input;
            try {
                intent = N.copy({ ...value, foreground: true });
                input = adapter.captureInput(intent, desired, committedCandidate);
                N.assertImmutable(input);
            } catch (error) { return Promise.resolve({ ok: false, code: String(error.message || error) }); }
            desired = input;
            const abort = new AbortController();
            activeContext?.abortController.abort();
            const ctx = { transactionId: unique('render'), requestGeneration: ++currentRequestGeneration, intentType: intent.type, intent, input, foreground: true, background: false, sideEffectsAllowed: false, abortController: abort, abortSignal: abort.signal, state: 'QUEUED', createdAt: Date.now(), committed: false };
            latestReady = tail.then(() => run(ctx));
            tail = latestReady.catch(() => {});
            adapter.onRequest?.(latestReady, ctx);
            return latestReady;
        }
        async function whenIdle() { let pending; do { pending = latestReady; await pending; } while (pending !== latestReady); return latestReady; }
        return Object.freeze({ request, whenIdle, get busy() { return activeContext !== null; }, get currentSession() { return currentSession; }, get activeSnapshot() { return activeSnapshot; }, get committedCandidate() { return committedCandidate; }, get requestGeneration() { return currentRequestGeneration; }, inspect: () => ({ requestGeneration: currentRequestGeneration, currentSession, activeSnapshot, attempts: attempts.slice(), cleanupPending: cleanupPending.length, backgroundSideEffectCount: 0 }) });
    }
    return Object.freeze({ RenderIntentType, BuildAttemptState, ModeSnapshotStatus, create, promotePendingSession });
}));
