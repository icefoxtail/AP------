const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const feedbackSource = readFileSync(join(__dirname, '../archive/render-feedback.js'), 'utf8');
const readerSource = readFileSync(join(__dirname, '../archive/archive2-reader-controls.js'), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferred() {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
}

class Element {
    constructor(tag, doc) {
        this.tagName = tag.toUpperCase();
        this.ownerDocument = doc;
        this.children = [];
        this.parentNode = null;
        this.dataset = {};
        this.attributes = new Map();
        this.listeners = new Map();
        this.hidden = false;
        this.disabled = false;
        this.value = '';
        this.id = '';
        this.className = '';
        this.classList = { add: value => { this.className += ' ' + value; } };
        this._text = '';
        this._html = '';
    }
    get isConnected() {
        return this === this.ownerDocument.documentElement || Boolean(this.parentNode?.isConnected);
    }
    appendChild(node) {
        node.remove();
        node.parentNode = this;
        this.children.push(node);
        return node;
    }
    remove() {
        if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(node => node !== this);
        this.parentNode = null;
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) this.listeners.set(type, []);
        this.listeners.get(type).push(listener);
    }
    async dispatch(type) {
        await Promise.all((this.listeners.get(type) || []).map(listener => listener({
            type, target: this, currentTarget: this, stopPropagation() {}
        })));
    }
    contains(node) { return node === this || this.children.some(child => child.contains(node)); }
    querySelector(selector) {
        const matches = node => selector.startsWith('#') ? node.id === selector.slice(1)
            : node.className.split(/\s+/).includes(selector.slice(1));
        for (const child of this.children) {
            if (matches(child)) return child;
            const found = child.querySelector(selector);
            if (found) return found;
        }
        return null;
    }
    set textContent(value) {
        for (const child of this.children) child.parentNode = null;
        this.children = [];
        this._text = String(value);
        this._html = '';
    }
    get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
    set innerHTML(value) {
        this.textContent = '';
        this._html = String(value);
        // The reader's static toolbar only needs ID-addressable controls for these action tests.
        for (const match of this._html.matchAll(/<([a-z]+)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
            const child = new Element(match[1], this.ownerDocument);
            child.id = match[2];
            this.appendChild(child);
        }
    }
    get innerHTML() { return this._html; }
}

function fixture(withReader = false) {
    const doc = {
        readyState: 'complete',
        createElement(tag) { return new Element(tag, this); },
        getElementById(id) { return this.documentElement.querySelector('#' + id); },
        addEventListener() {}
    };
    doc.documentElement = doc.createElement('html');
    doc.head = doc.documentElement.appendChild(doc.createElement('head'));
    doc.body = doc.documentElement.appendChild(doc.createElement('body'));
    const toolbar = doc.body.appendChild(doc.createElement('div'));
    toolbar.id = 'mode-ctrl';
    const area = doc.body.appendChild(doc.createElement('div'));
    area.id = 'print-area';
    area.innerHTML = '<article class="page">기존 해설과 도형</article>';
    const snapshot = Object.freeze({ rootNode: area, status: 'ACTIVE', key: 'frozen-source' });
    const ready = Promise.resolve({ ok: true, pages: 1 });
    const alerts = [];
    const root = {
        document: doc,
        location: new URL('https://archive.example/engine.html?mode=exam'),
        AppState: { mode: 'exam' },
        __AP_RENDER_READY__: ready,
        activeSnapshot: snapshot,
        alert: message => alerts.push(message)
    };
    root.parent = root;
    doc.documentElement.dataset.apRenderReady = 'true';
    const context = { window: root, document: doc, location: root.location, Promise, URLSearchParams, URL };
    vm.runInNewContext(feedbackSource, context, { filename: 'render-feedback.js' });
    if (withReader) {
        vm.runInNewContext(readerSource, context, { filename: 'archive2-reader-controls.js' });
        root.Archive2ReaderControls.setReady(true, 'exam');
    }
    return {
        root, doc, alerts, area,
        panel: () => doc.getElementById('ap-archive-render-feedback'),
        message: () => doc.getElementById('ap-archive-render-feedback')?.children[0],
        retry: () => doc.getElementById('ap-archive-render-feedback')?.children[1],
        preserved() {
            assert.equal(doc.getElementById('print-area'), area);
            assert.equal(area.innerHTML, '<article class="page">기존 해설과 도형</article>');
            assert.equal(root.__AP_RENDER_READY__, ready);
            assert.equal(root.activeSnapshot, snapshot);
            assert.equal(doc.documentElement.dataset.apRenderReady, 'true');
        }
    };
}

test('pending feedback and measured progress stay outside the frozen output; success hides them', async () => {
    const h = fixture();
    const work = deferred();
    const handle = h.root.APArchiveRenderFeedback.track(work.promise, { mode: 'sol', questionCount: 50 });
    assert.equal(h.panel().parentNode, h.doc.body);
    assert.equal(h.area.contains(h.panel()), false);
    assert.equal(h.panel().getAttribute('role'), 'status');
    assert.equal(h.message().textContent, '해설 50문항 준비 중…');
    handle.progress({ phase: 'math', completed: 10, total: 50 });
    assert.equal(h.message().textContent, '수식 정리 중 · 10/50문항');
    handle.progress({ phase: 'images', completed: 2, total: 6 });
    assert.equal(h.message().textContent, '그림 준비 중 · 2/6개');
    handle.progress({ phase: 'layout', completed: 25, total: 50 });
    assert.equal(h.message().textContent, '쪽 배치 중 · 25/50문항');
    const outcome = { ok: true, pages: 25 };
    work.resolve(outcome);
    assert.equal(await work.promise, outcome);
    await tick();
    assert.equal(h.panel().hidden, true);
    handle.progress({ phase: 'math', completed: 20, total: 50 });
    assert.equal(h.panel().hidden, true);
    assert.match(h.doc.getElementById('ap-archive-render-feedback-style').textContent, /@media print[^}]*display:none !important/);
    h.preserved();
});

test('a failed result remains failed, shows a Korean error, and retries the actual operation once', async () => {
    const h = fixture();
    const next = deferred();
    let calls = 0;
    const outcome = { ok: false, code: 'QUESTION_IMAGE_LOAD_FAILED' };
    const original = Promise.resolve(outcome);
    h.root.APArchiveRenderFeedback.track(original, { mode: 'sol', retry: () => { calls += 1; return next.promise; } });
    assert.equal(await original, outcome);
    await tick();
    assert.equal(h.panel().getAttribute('role'), 'alert');
    assert.equal(h.message().textContent, '그림을 불러오지 못했습니다.');
    assert.equal(h.panel().dataset.errorCode, outcome.code);
    assert.equal(h.retry().hidden, false);
    await h.retry().dispatch('click');
    await tick();
    assert.equal(calls, 1);
    assert.equal(h.panel().dataset.state, 'pending');
    assert.equal(h.retry().hidden, true);
    await h.retry().dispatch('click');
    assert.equal(calls, 1, 'a pending retry cannot be started twice');
    next.resolve({ ok: true, pages: 25 });
    await tick();
    assert.equal(h.panel().hidden, true);
    await h.retry().dispatch('click');
    await tick();
    assert.equal(calls, 1, 'a completed render cannot restart through a stale retry action');
    h.preserved();
});

test('observing a rejected render does not turn its original promise into a success', async () => {
    const h = fixture();
    const error = Object.assign(new Error('MATH_TYPESET_ERROR'), { code: 'MATH_TYPESET_ERROR' });
    const original = Promise.reject(error);
    h.root.APArchiveRenderFeedback.track(original, { mode: 'sol' });
    await assert.rejects(original, actual => actual === error);
    await tick();
    assert.equal(h.message().textContent, '수식을 표시하지 못했습니다.');
    assert.equal(h.retry().hidden, true);
    h.preserved();
});

test('an older completion or progress update cannot replace feedback for a newer request', async () => {
    const h = fixture();
    const old = deferred(), latest = deferred();
    const oldHandle = h.root.APArchiveRenderFeedback.track(old.promise, { mode: 'exam', questionCount: 10 });
    const latestHandle = h.root.APArchiveRenderFeedback.track(latest.promise, { mode: 'sol', questionCount: 50 });
    oldHandle.progress({ phase: 'layout', completed: 10, total: 10 });
    old.resolve({ ok: false, code: 'QUESTION_IMAGE_LOAD_FAILED' });
    await tick();
    assert.equal(h.message().textContent, '해설 50문항 준비 중…');
    assert.equal(h.panel().dataset.state, 'pending');
    latestHandle.progress({ phase: 'math', completed: 25, total: 50 });
    assert.equal(h.message().textContent, '수식 정리 중 · 25/50문항');
    latest.resolve({ ok: true });
    await tick();
    assert.equal(h.panel().hidden, true);
    h.preserved();
});

test('a cancelled stale request clears its own feedback without showing an error', async () => {
    const h = fixture();
    h.root.APArchiveRenderFeedback.track(Promise.resolve({ ok: false, code: 'DISCARDED_STALE' }), { mode: 'sol' });
    await tick();
    assert.equal(h.panel().hidden, true);
    assert.notEqual(h.panel().getAttribute('role'), 'alert');
    h.preserved();
});

test('a retry that starts a newer tracked engine request leaves that request in charge', async () => {
    const h = fixture();
    const next = deferred();
    h.root.APArchiveRenderFeedback.track(Promise.resolve({ ok: false, code: 'RENDER_FAILED' }), {
        mode: 'sol',
        retry() {
            h.root.APArchiveRenderFeedback.track(next.promise, { mode: 'sol', questionCount: 50 });
            return Promise.resolve({ ok: true });
        }
    });
    await tick();
    await h.retry().dispatch('click');
    await tick();
    assert.equal(h.panel().hidden, false);
    assert.equal(h.message().textContent, '해설 50문항 준비 중…');
    next.resolve({ ok: true });
    await tick();
    assert.equal(h.panel().hidden, true);
    h.preserved();
});

test('feedback is safe when no document body exists', async () => {
    const root = {};
    vm.runInNewContext(feedbackSource, { window: root, Promise });
    const handle = root.APArchiveRenderFeedback.track(Promise.resolve({ ok: false, code: 'RENDER_FAILED' }), { mode: 'sol' });
    assert.doesNotThrow(() => handle.progress({ phase: 'math', completed: 1, total: 50 }));
    await tick();
    assert.equal(root.__AP_RENDER_READY__, undefined);
});

test('reader checks a resolved failure, restores the active mode, and retries through the real switch action', async () => {
    const h = fixture(true);
    const select = h.doc.getElementById('archive2-reader-mode');
    let calls = 0;
    h.root.switchMode = async mode => {
        calls += 1;
        if (calls === 1) return { ok: false, code: 'MATH_TYPESET_ERROR' };
        h.root.location.search = '?mode=' + mode;
        h.root.AppState.mode = mode;
        return { ok: true, mode, pages: 25 };
    };
    select.value = 'sol';
    await select.dispatch('change');
    await tick();
    assert.equal(select.value, 'exam');
    assert.equal(h.panel().getAttribute('role'), 'alert');
    assert.equal(h.message().textContent, '수식을 표시하지 못했습니다.');
    assert.equal(h.alerts.length, 0);
    await h.retry().dispatch('click');
    await tick();
    assert.equal(calls, 2);
    assert.equal(select.value, 'sol');
    assert.equal(h.panel().hidden, true);
    h.preserved();
});

test('reader reloads the same output when PDF readiness fails after its mode committed', async () => {
    const h = fixture(true);
    const select = h.doc.getElementById('archive2-reader-mode');
    const controls = h.doc.getElementById('archive2-reader-controls');
    let switchCalls = 0;
    const reloadedUrls = [];
    h.root.location.search = '?mode=exam&archive2Context=archive2&outputRequestId=committed-output&outputOwnerId=owner';
    h.root.location.reload = () => { reloadedUrls.push(h.root.location.href); };
    h.root.switchMode = async mode => {
        switchCalls += 1;
        h.root.location.searchParams.set('mode', mode);
        h.root.AppState.mode = mode;
        h.root.__AP_OUTPUT_RENDER_READY__ = null;
        h.root.__AP_OUTPUT_RENDER_ERROR__ = 'PDF_READINESS_FAILED';
        h.root.Archive2ReaderControls.setReady(false, mode);
        return { ok: false, code: 'PDF_READINESS_FAILED' };
    };

    select.value = 'sol';
    await select.dispatch('change');
    await tick();
    const committedUrl = h.root.location.href;
    assert.equal(select.value, 'sol');
    assert.equal(controls.dataset.ready, 'false');
    assert.equal(h.panel().dataset.state, 'failed');
    assert.equal(h.retry().hidden, false);

    await h.retry().dispatch('click');
    await tick();
    assert.deepEqual(reloadedUrls, [committedUrl], 'retry preserves the committed output identity');
    assert.equal(switchCalls, 1, 'retry must not take the already-active mode shortcut');
    assert.equal(controls.dataset.ready, 'false');
    assert.equal(h.root.__AP_OUTPUT_RENDER_READY__, null);
    assert.equal(h.root.__AP_OUTPUT_RENDER_ERROR__, 'PDF_READINESS_FAILED');
    h.preserved();
});

test('reader treats DISCARDED_STALE as cancellation rather than an error', async () => {
    const h = fixture(true);
    const select = h.doc.getElementById('archive2-reader-mode');
    h.root.switchMode = async () => ({ ok: false, code: 'DISCARDED_STALE' });
    select.value = 'sol';
    await select.dispatch('change');
    await tick();
    assert.equal(select.value, 'exam');
    assert.equal(h.panel(), null);
    assert.equal(h.alerts.length, 0);
    h.preserved();
});
