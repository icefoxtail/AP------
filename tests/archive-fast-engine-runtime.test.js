const test = require('node:test');
const assert = require('node:assert/strict');
const N = require('../archive/render-state-normalizer.js');
const R = require('../archive/screen-runtime.js');
const L = require('../archive/side-effect-ledger.js');
const M = require('../archive/mathjax_render_loop.js');

function candidate(targetSessionId, mode = 'exam', input = {}) {
    return N.createCandidate({ mode, qpp: 4, input,
        source: { targetSessionId, sourceRequestId: input.sourceRequestId || 'a', sourceArchiveFile: 'a.js', canonicalDataFingerprint: 'a', canonicalRenderData: [{ sourceRef: { sourceArchiveFile: 'a.js', sourceQuestionUid: 'q1' }, displayNo: 1, choices: [{ text: 'x' }] }] },
        fingerprints: { engine: '1', pageLayout: '1', font: '1', asset: '1' }
    });
}
function fixture(overrides = {}) {
    let visible = 'initial', committed = null, effectCount = 0, releaseCount = 0;
    const adapter = {
        captureInput: (intent, desired, committed) => N.copy({ ...(desired || committed?.input || { mode: 'exam', sourceRequestId: 'a' }), ...(intent.payload || {}), ...(intent.requestedMode ? { mode: intent.requestedMode } : {}) }),
        prepare: async (input, ctx) => candidate(ctx.requestedTargetSessionId, input.mode, input),
        build: async ctx => ({ rootNode: { mode: ctx.candidate.mode }, pageCount: 1, sessionId: ctx.requestedTargetSessionId }),
        capture: () => ({ visible, committed }),
        attach: ctx => { visible = ctx.result.rootNode; },
        commit: ctx => { committed = ctx.candidate; },
        rollback: (_, journal) => { visible = journal.visible; committed = journal.committed; },
        afterCommit: () => { effectCount++; },
        release: () => { releaseCount++; },
        ...overrides
    };
    const runtime = R.create(adapter);
    return { runtime, adapter, state: () => ({ visible, committed, effectCount, releaseCount }) };
}
const req = (type, payload) => ({ type, payload, foreground: true });

test('candidate recursively copies choices and rejects unsupported graphs without freezing raw input', () => {
    const raw = { choices: [{ text: 'before' }], nested: { imageSize: 'full' } };
    const frozen = N.copy(raw);
    raw.choices[0].text = 'after';
    assert.equal(frozen.choices[0].text, 'before');
    assert.equal(Object.isFrozen(raw), false);
    assert.equal(N.assertImmutable(frozen), true);
    const cycle = {}; cycle.x = cycle;
    for (const value of [cycle, new Date(), { f() {} }, { get x() { throw Error('must not invoke'); } }, { x: Infinity }]) assert.throws(() => N.copy(value));
    assert.throws(() => N.createCandidate({ mode: 'solution' }), /INVALID_RENDER_MODE/);
    assert.throws(() => N.createCandidate({ ...candidate('target'), unknown: true }), /UNKNOWN_CANDIDATE_FIELD/);
});

test('keys include semantic changes and exclude pending session/request provenance', () => {
    const a = candidate('one', 'exam', { sourceRequestId: 'a' });
    const b = candidate('two', 'exam', { sourceRequestId: 'b' });
    assert.equal(N.computeSnapshotKey(a), N.computeSnapshotKey(b));
    assert.notEqual(N.computeSnapshotKey(a), N.computeSnapshotKey(candidate('one', 'ans')));
    assert.notEqual(N.computeSnapshotKey(a), N.computeSnapshotKey(N.createCandidate({ ...a, qpp: 6 })));
});

test('structural sharing trusts only normalizer-owned transitive immutable graphs', () => {
    const raw = Object.freeze({ nested: { choice: 'before' } });
    const copied = N.copy(raw);
    raw.nested.choice = 'after';
    assert.equal(copied.nested.choice, 'before');
    assert.equal(Object.isFrozen(raw.nested), false);
    assert.equal(N.copy(copied), copied);
    assert.equal(N.semanticDigest(copied), N.semanticDigest(copied));
    assert.throws(() => N.assertImmutable(raw), /MUTABLE_RENDER_VALUE/);
});

test('pending materialization is a separate complete session and rejects mismatched targets', () => {
    const c = candidate('target');
    const pending = { status: 'READY_TO_COMMIT', targetSessionId: 'target', preparedSnapshots: { exam: null, sol: null, ans: null }, createdAt: 1 };
    const snapshot = { sessionId: 'target', mode: 'exam', key: 'key' };
    const session = R.promotePendingSession({ pending, candidate: c, promotedSnapshot: snapshot, committedAt: 2 });
    assert.notEqual(session, pending);
    for (const field of ['sessionId', 'sourceArchiveFile', 'canonicalDataFingerprint', 'engineFingerprint', 'layoutFingerprint', 'fontFingerprint', 'assetFingerprint', 'activeMode', 'activeSnapshotKey', 'status', 'modeSnapshots', 'createdAt', 'promotedAt']) assert.ok(Object.hasOwn(session, field), field);
    assert.equal(pending.status, 'READY_TO_COMMIT');
    assert.throws(() => R.promotePendingSession({ pending, candidate: c, promotedSnapshot: { ...snapshot, sessionId: 'wrong' } }));
});

test('successful commit binds state, active status and current session; stale provenance is not validity', async () => {
    const { runtime } = fixture();
    assert.equal((await runtime.request(req('SOURCE_CHANGE'))).ok, true);
    const first = runtime.activeSnapshot;
    assert.equal(first.status, 'ACTIVE');
    const session = runtime.currentSession;
    await runtime.request({ type: 'MODE_CHANGE', requestedMode: 'sol' });
    assert.equal(runtime.currentSession, session);
    assert.equal(runtime.activeSnapshot.mode, 'sol');
    assert.equal(first.status, 'EVICTED');
    assert.equal(first.builtRequestGeneration, 1);
    assert.equal(runtime.inspect().attempts.every(a => a.keyBuildParity), true);
});

test('PREPARE failure and history-like synchronous COMMIT failure preserve old state and status', async () => {
    const f = fixture(); const r = f.runtime;
    await r.request(req('SOURCE_CHANGE'));
    const previous = { ...f.state(), session: r.currentSession, snapshot: r.activeSnapshot };
    f.adapter.build = async () => { throw Error('layout failure'); };
    assert.equal((await r.request(req('FORCED_REBUILD'))).ok, false);
    assert.equal(f.state().visible, previous.visible);
    f.adapter.build = async ctx => ({ rootNode: {}, pageCount: 1, sessionId: ctx.requestedTargetSessionId });
    f.adapter.commit = () => { throw Error('history failure'); };
    assert.equal((await r.request(req('SOURCE_CHANGE', { sourceRequestId: 'new' }))).ok, false);
    assert.equal(r.currentSession, previous.session);
    assert.equal(r.activeSnapshot, previous.snapshot);
    assert.equal(previous.snapshot.status, 'ACTIVE');
    assert.equal(f.state().effectCount, previous.effectCount);
});

test('latest wins serializes builds and never commits stale work', async () => {
    const f = fixture(); await f.runtime.request(req('SOURCE_CHANGE'));
    let resume, entered;
    const enteredPromise = new Promise(r => { entered = r; });
    let calls = 0;
    f.adapter.build = async ctx => { if (++calls === 1) { entered(); await new Promise(r => { resume = r; }); } return { rootNode: {}, pageCount: 1, sessionId: ctx.requestedTargetSessionId }; };
    const old = f.runtime.request({ type: 'MODE_CHANGE', requestedMode: 'sol' });
    await enteredPromise;
    const next = f.runtime.request({ type: 'MODE_CHANGE', requestedMode: 'ans' });
    resume();
    assert.equal((await old).code, 'DISCARDED_STALE');
    assert.equal((await next).ok, true);
    assert.equal(f.runtime.activeSnapshot.mode, 'ans');
    assert.equal(f.runtime.inspect().attempts.find(a => a.requestGeneration === 2).committed, false);
});

test('background and invalid enums cannot execute builds or effects', async () => {
    const f = fixture();
    assert.equal((await f.runtime.request({ type: 'FORCED_REBUILD', foreground: false })).code, 'BACKGROUND_NOT_ENABLED');
    assert.equal((await f.runtime.request({ type: 'INVALIDATION' })).code, 'UNKNOWN_RENDER_INTENT');
    assert.equal(f.state().effectCount, 0);
    assert.equal(Object.keys(R.RenderIntentType).length, 12);
});

test('side effect failure, acknowledgement and retry keep one logical identity/key', async () => {
    const ledger = L.create(); let count = 0;
    const effect = { effectId: 'blueprint', key: 'a', triggerEventId: 't1', foreground: true, run: async () => ({ ok: ++count > 1 }) };
    await ledger.execute(effect);
    const failed = ledger.snapshot().entries[0]; assert.equal(failed.state, 'FAILED_RETRYABLE');
    await ledger.execute({ ...effect, triggerEventId: 't2' });
    await ledger.execute({ ...effect, triggerEventId: 't3' });
    const success = ledger.snapshot().entries[0];
    assert.equal(success.state, 'ACKNOWLEDGED'); assert.equal(success.attempt, 2);
    assert.equal(success.logicalEffectId, failed.logicalEffectId); assert.equal(success.idempotencyKey, failed.idempotencyKey);
    assert.equal(count, 2); assert.equal(ledger.snapshot().entries.length, 1);
    assert.equal(Object.values(ledger.snapshot().counters).every(n => n === 0), true);
});

test('precommit effects are rejected before execution; no unresolved required compensation', async () => {
    const ledger = L.create(); let ran = false;
    assert.throws(() => ledger.execute({ effectId: 'forbidden', key: 'x', foreground: true, failurePolicy: 'BLOCK_BEFORE_COMMIT', run() { ran = true; } }), /PRECOMMIT_EXTERNAL_EFFECT_FORBIDDEN/);
    await ledger.execute({ effectId: 'bg', key: 'x', foreground: false, run() { ran = true; } });
    assert.equal(ran, false);
    assert.deepEqual(ledger.snapshot().compensationLedger, []);
    assert.equal(ledger.snapshot().counters.UNRESOLVED_REQUIRED_COMPENSATION_COUNT, 0);
});

test('asynchronous measurements remain bound to their own transaction metrics', async () => {
    const a = M.start({ mode: 'exam', transactionId: 'a', requestGeneration: 1, publish: false });
    let resume;
    const pending = M.measure('slow', () => new Promise(r => { resume = r; }), a);
    const b = M.start({ mode: 'ans', transactionId: 'b', requestGeneration: 2, publish: false });
    await M.measure('fast', () => Promise.resolve(), b);
    resume(); await pending;
    assert.equal(a.transactionId, 'a'); assert.equal(b.transactionId, 'b');
    assert.ok(Object.hasOwn(a.phases, 'slow')); assert.equal(Object.hasOwn(a.phases, 'fast'), false);
    assert.ok(Object.hasOwn(b.phases, 'fast')); assert.equal(Object.hasOwn(b.phases, 'slow'), false);
});

test('prewarm stores READY without committing state or creating business effects', async () => {
    const f = fixture({ enablePrewarm: true, cacheModes: ['exam', 'sol', 'ans'] });
    await f.runtime.request(req('SOURCE_CHANGE'));
    const before = f.state(), active = f.runtime.activeSnapshot;
    const result = await f.runtime.prewarm('sol');
    assert.equal(result.prewarmed, true);
    assert.equal(f.runtime.activeSnapshot, active);
    assert.equal(f.runtime.currentSession.modeSnapshots.sol.status, 'READY');
    assert.equal(f.state().visible, before.visible);
    assert.equal(f.state().committed, before.committed);
    assert.equal(f.state().effectCount, before.effectCount);
});

test('foreground work cancels stale prewarm before snapshot registration', async () => {
    const f = fixture({ enablePrewarm: true, cacheModes: ['exam', 'sol', 'ans'] });
    await f.runtime.request(req('SOURCE_CHANGE'));
    let enter, release;
    const started = new Promise(r => { enter = r; });
    f.adapter.build = async ctx => {
        if (ctx.background) { enter(); await new Promise(r => { release = r; }); }
        return { rootNode: {}, sessionId: ctx.requestedTargetSessionId, pageCount: 1 };
    };
    const bg = f.runtime.prewarm('sol'); await started;
    const fg = f.runtime.request({ type: 'MODE_CHANGE', requestedMode: 'ans' });
    release();
    assert.equal((await bg).code, 'DISCARDED_STALE');
    assert.equal((await fg).ok, true);
    assert.equal(f.runtime.activeSnapshot.mode, 'ans');
    assert.equal(f.runtime.currentSession.modeSnapshots.sol, null);
});
