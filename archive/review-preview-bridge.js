/* Versioned parent/iframe transport for the internal review preview. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.APReviewPreviewBridge = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function (root) {
  'use strict';

  const CHANNEL = 'AP_REVIEW_BRIDGE';
  const PROTOCOL_VERSION = 1;
  const STATUS = Object.freeze({ BOOTING: 'BOOTING', READY: 'READY', RENDERING: 'RENDERING', ERROR: 'ERROR' });
  const EVENTS = Object.freeze([
    'REVIEW_BRIDGE_READY',
    'REVIEW_SET_SOURCE',
    'REVIEW_SET_MODE',
    'REVIEW_RENDER_START',
    'REVIEW_RENDER_DONE',
    'REVIEW_RENDER_ERROR',
    'REVIEW_QUESTION_SELECT',
  ]);

  function numberOr(value, fallback) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : fallback;
  }

  function normalizeTuple(tuple = {}, fallback = { bridgeEpoch: 0, sourceEpoch: 0, revision: 0 }) {
    return {
      bridgeEpoch: numberOr(tuple.bridgeEpoch, fallback.bridgeEpoch),
      sourceEpoch: numberOr(tuple.sourceEpoch, fallback.sourceEpoch),
      revision: numberOr(tuple.revision, fallback.revision),
    };
  }

  function tupleKey(tuple) {
    const value = normalizeTuple(tuple);
    return `${value.bridgeEpoch}:${value.sourceEpoch}:${value.revision}`;
  }

  function createReviewMessage(type, payload = {}, tuple = {}) {
    if (!EVENTS.includes(type)) throw new Error(`REVIEW_BRIDGE_UNKNOWN_EVENT:${type}`);
    const value = normalizeTuple(tuple);
    return {
      channel: CHANNEL,
      protocolVersion: PROTOCOL_VERSION,
      type,
      ...value,
      payload: payload && typeof payload === 'object' ? payload : {},
    };
  }

  function isCurrentRevisionTuple(candidate, current) {
    const left = normalizeTuple(candidate);
    const right = normalizeTuple(current);
    return left.bridgeEpoch === right.bridgeEpoch
      && left.sourceEpoch === right.sourceEpoch
      && left.revision === right.revision;
  }

  function isAcceptableNewerTuple(candidate, current) {
    const next = normalizeTuple(candidate);
    const previous = normalizeTuple(current);
    if (next.bridgeEpoch !== previous.bridgeEpoch) return false;
    if (next.sourceEpoch < previous.sourceEpoch) return false;
    if (next.sourceEpoch === previous.sourceEpoch && next.revision < previous.revision) return false;
    return true;
  }

  function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  }

  function messageFromEvent(event) {
    const message = event && event.data;
    if (!message || message.channel !== CHANNEL || message.protocolVersion !== PROTOCOL_VERSION) return null;
    return message;
  }

  function createReviewPreviewBridge(options = {}) {
    const windowRef = options.windowRef || root;
    const iframe = options.iframe || null;
    const expectedOrigin = options.origin || windowRef?.location?.origin || '';
    const expectedWindow = options.expectedWindow || null;
    const post = options.post || ((message, targetOrigin = expectedOrigin) => {
      const target = iframe?.contentWindow || expectedWindow;
      if (!target?.postMessage) throw new Error('REVIEW_BRIDGE_TARGET_UNAVAILABLE');
      target.postMessage(message, targetOrigin);
    });
    const schedule = options.schedule || (callback => setTimeout(callback, 0));
    const handshakeTimeoutMs = Number.isFinite(options.handshakeTimeoutMs) ? options.handshakeTimeoutMs : 5000;
    const onQuestionSelect = options.onQuestionSelect || (() => {});
    const onFatal = options.onFatal || (() => {});
    const onEvent = options.onEvent || (() => {});
    const initial = normalizeTuple(options.initialTuple);
    let tuple = initial;
    let status = STATUS.BOOTING;
    let ready = typeof options.isReady === 'function' ? !!options.isReady() : false;
    let pending = null;
    let lastSnapshot = null;
    let lastDone = null;
    let flushScheduled = false;
    let handshakeTimer = null;
    let listener = null;
    const waiters = new Map();

    function isReady() {
      return ready && (typeof options.isReady !== 'function' || options.isReady());
    }

    function resolveWaiters(message, outcome) {
      const key = tupleKey(message);
      const waiting = waiters.get(key);
      if (!waiting) return;
      waiters.delete(key);
      waiting.forEach(entry => outcome.ok ? entry.resolve(outcome) : entry.reject(Object.assign(new Error(outcome.code || 'REVIEW_RENDER_ERROR'), outcome)));
    }

    function scheduleFlush() {
      if (flushScheduled) return;
      flushScheduled = true;
      schedule(() => {
        // Keep synchronous input bursts in one queue turn even when tests or a
        // host provide an immediate scheduler.
        Promise.resolve().then(() => {
          flushScheduled = false;
          if (!pending || !isReady()) return;
          const item = pending;
          pending = null;
          tuple = item.tuple;
          lastSnapshot = item.snapshot;
          status = STATUS.RENDERING;
          onEvent('REVIEW_SET_SOURCE', item.snapshot);
          try {
            post(createReviewMessage('REVIEW_SET_SOURCE', item.snapshot, item.tuple), expectedOrigin);
            item.accepted.resolve({ ok: true, revision: item.tuple.revision, tuple: { ...item.tuple } });
          } catch (error) {
            status = STATUS.ERROR;
            item.accepted.resolve({ ok: false, code: String(error?.code || error?.message || error) });
          }
        });
      });
    }

    function validateIncoming(event, message) {
      if (!message) return false;
      if (expectedOrigin && event?.origin && event.origin !== expectedOrigin) return false;
      const source = expectedWindow || iframe?.contentWindow;
      if (source && event?.source !== source) return false;
      return true;
    }

    function handleMessage(event) {
      const message = messageFromEvent(event);
      if (!validateIncoming(event, message)) return false;
      if (message.type === 'REVIEW_BRIDGE_READY') {
        if (numberOr(message.bridgeEpoch, -1) !== tuple.bridgeEpoch) return false;
        ready = true;
        status = STATUS.READY;
        if (handshakeTimer) { clearTimeout(handshakeTimer); handshakeTimer = null; }
        onEvent('REVIEW_BRIDGE_READY', message);
        scheduleFlush();
        return true;
      }
      if (!isCurrentRevisionTuple(message, tuple)) return false;
      if (message.type === 'REVIEW_RENDER_START') {
        status = STATUS.RENDERING;
        onEvent('REVIEW_RENDER_START', message);
        return true;
      }
      if (message.type === 'REVIEW_RENDER_DONE') {
        status = STATUS.READY;
        lastDone = normalizeTuple(message);
        onEvent('REVIEW_RENDER_DONE', message);
        resolveWaiters(message, { ok: true, ...lastDone, pages: message.payload?.pages ?? null });
        return true;
      }
      if (message.type === 'REVIEW_RENDER_ERROR') {
        status = STATUS.ERROR;
        const outcome = { ok: false, code: message.payload?.code || 'REVIEW_RENDER_ERROR', ...normalizeTuple(message) };
        onEvent('REVIEW_RENDER_ERROR', message);
        resolveWaiters(message, outcome);
        return true;
      }
      if (message.type === 'REVIEW_QUESTION_SELECT') {
        if (typeof message.payload?.sourceRef === 'string' && message.payload.sourceRef) onQuestionSelect(message.payload.sourceRef, message);
        return true;
      }
      return false;
    }

    function sendSnapshot(snapshot = {}) {
      const nextTuple = normalizeTuple(snapshot, tuple);
      if (nextTuple.bridgeEpoch !== tuple.bridgeEpoch) return Promise.resolve({ ok: false, code: 'STALE_BRIDGE_EPOCH' });
      if (nextTuple.sourceEpoch < tuple.sourceEpoch || (nextTuple.sourceEpoch === tuple.sourceEpoch && nextTuple.revision < tuple.revision)) {
        return Promise.resolve({ ok: false, code: 'STALE_REVIEW_REVISION' });
      }
      for (const [key, waiting] of waiters) {
        const [bridgeEpoch, sourceEpoch, revision] = key.split(':').map(Number);
        if (bridgeEpoch === nextTuple.bridgeEpoch && sourceEpoch === nextTuple.sourceEpoch && revision < nextTuple.revision) {
          waiters.delete(key);
          waiting.forEach(entry => entry.reject(Object.assign(new Error('SUPERSEDED_REVIEW_REVISION'), { code: 'SUPERSEDED_REVIEW_REVISION', revision })));
        }
      }
      if (pending) pending.accepted.resolve({ ok: false, code: 'COALESCED', revision: pending.tuple.revision });
      const accepted = deferred();
      pending = { snapshot: { ...snapshot, ...nextTuple }, tuple: nextTuple, accepted };
      tuple = nextTuple;
      if (isReady()) scheduleFlush();
      return accepted.promise;
    }

    function sendMode(mode) {
      if (!['exam', 'sol', 'ans'].includes(mode)) return Promise.resolve({ ok: false, code: 'INVALID_REVIEW_MODE' });
      if (!isReady()) return Promise.resolve({ ok: false, code: 'REVIEW_BRIDGE_NOT_READY' });
      status = STATUS.RENDERING;
      try { post(createReviewMessage('REVIEW_SET_MODE', { mode }, tuple), expectedOrigin); }
      catch (error) { status = STATUS.ERROR; return Promise.resolve({ ok: false, code: String(error?.code || error?.message || error) }); }
      return Promise.resolve({ ok: true, revision: tuple.revision, tuple: { ...tuple } });
    }

    function waitForRevision(target = tuple) {
      const wanted = normalizeTuple(typeof target === 'number' ? { ...tuple, revision: target } : target, tuple);
      if (lastDone && isCurrentRevisionTuple(lastDone, wanted)) return Promise.resolve({ ok: true, ...wanted });
      const entry = deferred();
      const key = tupleKey(wanted);
      if (!waiters.has(key)) waiters.set(key, new Set());
      waiters.get(key).add(entry);
      return entry.promise;
    }

    function beginSource() {
      for (const waiting of waiters.values()) waiting.forEach(entry => entry.reject(Object.assign(new Error('SOURCE_EPOCH_REPLACED'), { code: 'SOURCE_EPOCH_REPLACED' })));
      waiters.clear();
      tuple = { bridgeEpoch: tuple.bridgeEpoch, sourceEpoch: tuple.sourceEpoch + 1, revision: 0 };
      lastDone = null;
      if (pending) { pending.accepted.resolve({ ok: false, code: 'SOURCE_EPOCH_REPLACED' }); pending = null; }
      return { ...tuple };
    }

    function nextRevision() {
      tuple = { ...tuple, revision: tuple.revision + 1 };
      return { ...tuple };
    }

    function buildIframeUrl() {
      const source = options.src || 'engine.html';
      const url = new URL(source, windowRef?.location?.href || 'http://localhost/');
      url.searchParams.set('preview', '1');
      url.searchParams.set('reviewBridge', '1');
      url.searchParams.set('prewarm', '0');
      url.searchParams.set('bridgeEpoch', String(tuple.bridgeEpoch));
      return url.href;
    }

    function start() {
      if (!iframe) throw new Error('REVIEW_BRIDGE_IFRAME_REQUIRED');
      if (windowRef?.addEventListener) {
        listener = event => handleMessage(event);
        windowRef.addEventListener('message', listener);
      }
      iframe.src = buildIframeUrl();
      status = STATUS.BOOTING;
      ready = false;
      if (handshakeTimeoutMs > 0) {
        handshakeTimer = setTimeout(() => {
          if (!ready) {
            status = STATUS.ERROR;
            onFatal('HANDSHAKE_TIMEOUT');
          }
        }, handshakeTimeoutMs);
      }
      return { ...getState() };
    }

    function reloadForFatal(reason) {
      const pendingSnapshot = pending?.snapshot || lastSnapshot;
      for (const waiting of waiters.values()) waiting.forEach(entry => entry.reject(Object.assign(new Error('REVIEW_BRIDGE_RELOADED'), { code: 'REVIEW_BRIDGE_RELOADED' })));
      waiters.clear();
      tuple = { bridgeEpoch: tuple.bridgeEpoch + 1, sourceEpoch: tuple.sourceEpoch, revision: tuple.revision };
      ready = false;
      status = STATUS.BOOTING;
      if (handshakeTimer) clearTimeout(handshakeTimer);
      if (iframe) iframe.src = buildIframeUrl();
      if (pendingSnapshot) {
        const snapshot = { ...pendingSnapshot, ...tuple };
        pending = { snapshot, tuple: { ...tuple }, accepted: deferred() };
      }
      if (handshakeTimeoutMs > 0) handshakeTimer = setTimeout(() => { if (!ready) { status = STATUS.ERROR; onFatal('HANDSHAKE_TIMEOUT'); } }, handshakeTimeoutMs);
      return { reason, ...tuple };
    }

    function setReady(value = true) {
      ready = !!value;
      status = ready ? STATUS.READY : STATUS.BOOTING;
      if (ready) scheduleFlush();
    }

    function dispose() {
      if (handshakeTimer) clearTimeout(handshakeTimer);
      if (listener && windowRef?.removeEventListener) windowRef.removeEventListener('message', listener);
      listener = null;
      ready = false;
      status = STATUS.BOOTING;
    }

    function getState() {
      return { status, ready: isReady(), tuple: { ...tuple }, lastSnapshot, lastDone, pending: !!pending };
    }

    return Object.freeze({
      start,
      dispose,
      sendSnapshot,
      sendMode,
      waitForRevision,
      beginSource,
      nextRevision,
      setReady,
      handleMessage,
      reloadForFatal,
      buildIframeUrl,
      getState,
      get status() { return status; },
      get tuple() { return { ...tuple }; },
    });
  }

  function installReviewPreviewReceiver(options = {}) {
    const windowRef = options.windowRef || root;
    const params = new URLSearchParams(windowRef?.location?.search || '');
    if (params.get('reviewBridge') !== '1' || !windowRef || windowRef.parent === windowRef) return null;
    const expectedOrigin = options.origin || windowRef.location.origin;
    const parentWindow = options.parentWindow || windowRef.parent;
    let tuple = {
      bridgeEpoch: numberOr(params.get('bridgeEpoch'), 0),
      sourceEpoch: 0,
      revision: 0,
    };
    let status = STATUS.BOOTING;
    const runtimeProvider = options.runtimeProvider || (() => windowRef.archiveScreenRuntime);

    function markChildState(nextStatus, errorCode = '') {
      status = nextStatus;
      if (windowRef.document?.documentElement) {
        windowRef.document.documentElement.dataset.apReviewBridgeStatus = nextStatus;
        windowRef.document.documentElement.dataset.apReviewBridgeTuple = tupleKey(tuple);
        if (errorCode) windowRef.document.documentElement.dataset.apReviewBridgeError = String(errorCode);
        else delete windowRef.document.documentElement.dataset.apReviewBridgeError;
      }
    }

    function post(type, payload = {}, messageTuple = tuple) {
      parentWindow.postMessage(createReviewMessage(type, payload, messageTuple), expectedOrigin);
    }

    function valid(event, message) {
      if (!message || event.origin !== expectedOrigin || event.source !== parentWindow) return false;
      return true;
    }

    function acceptTuple(message) {
      if (numberOr(message.bridgeEpoch, -1) !== tuple.bridgeEpoch) return false;
      return isAcceptableNewerTuple(message, tuple);
    }

    async function applySource(message) {
      if (!acceptTuple(message)) return;
      const requestTuple = normalizeTuple(message, tuple);
      const payload = message.payload || {};
      if (payload.sourceKind !== 'review-snapshot' || !Array.isArray(payload.questionBank)) {
        markChildState(STATUS.ERROR, 'INVALID_REVIEW_SNAPSHOT');
        post('REVIEW_RENDER_ERROR', { code: 'INVALID_REVIEW_SNAPSHOT' }, requestTuple);
        return;
      }
      tuple = requestTuple;
      markChildState(STATUS.RENDERING);
      post('REVIEW_RENDER_START', { mode: payload.mode || 'exam' }, requestTuple);
      try {
        const runtime = runtimeProvider();
        if (!runtime?.request) throw new Error('REVIEW_RUNTIME_UNAVAILABLE');
        const outcome = await runtime.request({
          type: 'SOURCE_CHANGE',
          foreground: true,
          payload: {
            sourceKind: 'review-snapshot',
            questionBank: payload.questionBank,
            examTitle: payload.examTitle || '',
            examDisplayTitle: payload.examDisplayTitle || '',
            sourceArchiveFile: payload.sourceArchiveFile || '',
            assetRevision: payload.assetRevision || '',
            bridgeEpoch: requestTuple.bridgeEpoch,
            sourceEpoch: requestTuple.sourceEpoch,
            revision: requestTuple.revision,
            mode: payload.mode || 'exam',
            qpp: payload.qpp || 4,
          },
        });
        if (!isCurrentRevisionTuple(requestTuple, tuple)) return;
        if (!outcome?.ok) throw Object.assign(new Error(outcome?.code || 'REVIEW_RENDER_ERROR'), outcome || {});
        markChildState(STATUS.READY);
        post('REVIEW_RENDER_DONE', { mode: payload.mode || 'exam', pages: outcome.pages || null, metrics: windowRef.__AP_RENDER_METRICS__ || null }, requestTuple);
      } catch (error) {
        if (!isCurrentRevisionTuple(requestTuple, tuple)) return;
        const code = String(error?.code || error?.message || error);
        markChildState(STATUS.ERROR, code);
        post('REVIEW_RENDER_ERROR', { code }, requestTuple);
      }
    }

    async function applyMode(message) {
      if (!isCurrentRevisionTuple(message, tuple)) return;
      const mode = message.payload?.mode;
      if (!['exam', 'sol', 'ans'].includes(mode)) return;
      markChildState(STATUS.RENDERING);
      post('REVIEW_RENDER_START', { mode }, tuple);
      try {
        const runtime = runtimeProvider();
        if (!runtime?.request) throw new Error('REVIEW_RUNTIME_UNAVAILABLE');
        const outcome = await runtime.request({ type: 'MODE_CHANGE', requestedMode: mode, foreground: true });
        if (!outcome?.ok) throw Object.assign(new Error(outcome?.code || 'REVIEW_RENDER_ERROR'), outcome || {});
        markChildState(STATUS.READY);
        post('REVIEW_RENDER_DONE', { mode, pages: outcome.pages || null, metrics: windowRef.__AP_RENDER_METRICS__ || null }, tuple);
      } catch (error) {
        const code = String(error?.code || error?.message || error);
        markChildState(STATUS.ERROR, code);
        post('REVIEW_RENDER_ERROR', { code }, tuple);
      }
    }

    const listener = event => {
      const message = messageFromEvent(event);
      if (!valid(event, message)) return;
      if (message.type === 'REVIEW_SET_SOURCE') applySource(message);
      else if (message.type === 'REVIEW_SET_MODE') applyMode(message);
    };
    windowRef.addEventListener('message', listener);
    windowRef.addEventListener('load', () => {
      markChildState(STATUS.READY);
      post('REVIEW_BRIDGE_READY', { status }, tuple);
    }, { once: true });
    markChildState(STATUS.READY);
    post('REVIEW_BRIDGE_READY', { status: STATUS.READY }, tuple);

    const documentRef = windowRef.document;
    if (documentRef?.addEventListener) {
      documentRef.addEventListener('click', event => {
        const node = event.target?.closest?.('[data-source-ref]');
        const sourceRef = node?.getAttribute?.('data-source-ref');
        if (sourceRef) post('REVIEW_QUESTION_SELECT', { sourceRef }, tuple);
      });
    }

    return Object.freeze({
      dispose() { windowRef.removeEventListener('message', listener); },
      get status() { return status; },
      get tuple() { return { ...tuple }; },
    });
  }

  return Object.freeze({
    CHANNEL,
    PROTOCOL_VERSION,
    STATUS,
    EVENTS,
    createReviewMessage,
    isCurrentRevisionTuple,
    createReviewPreviewBridge,
    installReviewPreviewReceiver,
  });
}));
