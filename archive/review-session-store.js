/* Versioned, single-snapshot persistence for the internal review editor. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.APReviewSessionStore = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function (root) {
  'use strict';

  const SCHEMA_VERSION = 2;
  const DB_NAME = 'apms-review-engine';
  const DB_VERSION = 2;
  const STORE_NAME = 'session';
  const SNAPSHOT_KEY = 'current';

  function clone(value) {
    if (value === undefined) return undefined;
    if (typeof structuredClone === 'function') {
      try { return structuredClone(value); } catch (_) { /* JSON state is the supported fallback. */ }
    }
    return JSON.parse(JSON.stringify(value));
  }

  function buildReviewSessionSnapshot(state = {}) {
    return {
      schemaVersion: SCHEMA_VERSION,
      sessionRevision: Number.isInteger(state.sessionRevision) ? state.sessionRevision : 0,
      sourceFingerprint: String(state.sourceFingerprint || ''),
      sourceIdentity: String(state.sourceIdentity || ''),
      archiveDirHandle: state.archiveDirHandle || null,
      currentFileHandle: state.currentFileHandle || null,
      editorState: clone(state.editorState || {}),
      uiState: clone(state.uiState || {}),
      draftState: clone(state.draftState || {}),
      savedAt: Number.isFinite(state.savedAt) ? state.savedAt : Date.now(),
    };
  }

  function conflictDraftFileName(fileName) {
    const baseName = String(fileName || 'archive.js').split(/[\\/]/).pop() || 'archive.js';
    const base = baseName.replace(/\.js$/i, '').replace(/[^A-Za-z0-9._-]+/g, '_') || 'archive';
    return `${base}.review-draft-recovery.js`;
  }

  function buildConflictDraftRecovery(snapshot, fileName) {
    const draft = snapshot?.draftState || {};
    const existing = draft.conflictDraftRecovery;
    if (existing && typeof existing === 'object') {
      const value = clone(existing);
      value.bank = clone(Array.isArray(value.bank) ? value.bank : (Array.isArray(draft.currentBank) ? draft.currentBank : []));
      value.fileName = value.fileName || conflictDraftFileName(fileName);
      return value;
    }
    return {
      bank: clone(Array.isArray(draft.currentBank) ? draft.currentBank : []),
      fileName: conflictDraftFileName(fileName),
      reason: 'SESSION_SOURCE_FINGERPRINT_CONFLICT',
    };
  }

  function restoreReviewSession(snapshot, diskSource, fileName = '') {
    if (!snapshot || snapshot.schemaVersion !== SCHEMA_VERSION || !diskSource) {
      return { status: 'INVALID', draftApplied: false, currentBank: [] };
    }
    const draft = snapshot.draftState || {};
    const diskBank = clone(Array.isArray(diskSource.bank) ? diskSource.bank : []);
    if (String(snapshot.sourceFingerprint || '') !== String(diskSource.sourceFingerprint || '')) {
      return {
        status: 'CONFLICT',
        draftApplied: false,
        sourceIdentity: snapshot.sourceIdentity || fileName,
        currentFileName: fileName,
        currentBank: diskBank,
        originalBank: clone(diskBank),
        sourceFingerprint: String(diskSource.sourceFingerprint || ''),
        emergencyRecovery: clone(snapshot.draftState?.emergencyRecovery || null),
        conflictDraftRecovery: buildConflictDraftRecovery(snapshot, fileName),
      };
    }
    const editor = snapshot.editorState || {};
    const ui = snapshot.uiState || {};
    return {
      status: 'RESTORED',
      draftApplied: true,
      sourceIdentity: snapshot.sourceIdentity || fileName,
      currentFileName: fileName,
      sourceFingerprint: snapshot.sourceFingerprint,
      currentBank: clone(Array.isArray(draft.currentBank) ? draft.currentBank : diskBank),
      originalBank: clone(Array.isArray(draft.originalBank) ? draft.originalBank : diskBank),
      sourceRefs: clone(Array.isArray(draft.sourceRefs) ? draft.sourceRefs : []),
      modifiedIds: clone(Array.isArray(draft.modifiedIds) ? draft.modifiedIds : []),
      removedItems: clone(Array.isArray(draft.removedItems) ? draft.removedItems : []),
      selectedSourceRef: editor.selectedSourceRef || null,
      editorState: clone(editor),
      uiState: clone(ui),
      emergencyRecovery: clone(draft.emergencyRecovery || null),
      conflictDraftRecovery: clone(draft.conflictDraftRecovery || null),
      sessionRevision: snapshot.sessionRevision,
    };
  }

  function now() {
    return typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now();
  }

  function createReviewSessionStore(options = {}) {
    const indexedDBApi = options.indexedDB || root?.indexedDB;
    const dbName = options.dbName || DB_NAME;
    const metrics = options.metrics || { writeCount: 0, writeMs: 0, payloadSize: 0 };
    let openPromise = null;
    let writeTail = Promise.resolve();

    function open() {
      if (openPromise) return openPromise;
      if (!indexedDBApi?.open) return Promise.reject(new Error('REVIEW_SESSION_INDEXEDDB_UNAVAILABLE'));
      openPromise = new Promise((resolve, reject) => {
        const request = indexedDBApi.open(dbName, DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('REVIEW_SESSION_INDEXEDDB_OPEN_FAILED'));
      }).catch(error => {
        openPromise = null;
        throw error;
      });
      return openPromise;
    }

    function transaction(mode, operation) {
      return open().then(db => new Promise((resolve, reject) => {
        let value;
        let failed = false;
        try {
          const tx = db.transaction(STORE_NAME, mode);
          const store = tx.objectStore(STORE_NAME);
          value = operation(store, tx);
          tx.oncomplete = () => resolve(value);
          tx.onerror = () => {
            failed = true;
            reject(tx.error || new Error('REVIEW_SESSION_TRANSACTION_FAILED'));
          };
          tx.onabort = () => {
            if (!failed) reject(tx.error || new Error('REVIEW_SESSION_TRANSACTION_ABORTED'));
          };
        } catch (error) {
          reject(error);
        }
      }));
    }

    function enqueue(operation) {
      const task = writeTail.then(operation, operation);
      writeTail = task;
      return task;
    }

    async function put(snapshot) {
      const value = buildReviewSessionSnapshot(snapshot);
      const performWrite = async () => {
        const started = now();
        await transaction('readwrite', store => { store.put(value, SNAPSHOT_KEY); });
        metrics.writeCount = Number(metrics.writeCount || 0) + 1;
        metrics.writeMs = Number((now() - started).toFixed(2));
        metrics.payloadSize = JSON.stringify(value).length;
        return value;
      };
      return enqueue(performWrite);
    }

    async function get() {
      return transaction('readonly', store => new Promise((resolve, reject) => {
        const request = store.get(SNAPSHOT_KEY);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error('REVIEW_SESSION_READ_FAILED'));
      }));
    }

    async function clear() {
      await enqueue(() => transaction('readwrite', store => { store.delete(SNAPSHOT_KEY); }));
    }

    return Object.freeze({ put, get, clear, metrics, schemaVersion: SCHEMA_VERSION });
  }

  return Object.freeze({
    SCHEMA_VERSION,
    DB_NAME,
    DB_VERSION,
    STORE_NAME,
    SNAPSHOT_KEY,
    buildReviewSessionSnapshot,
    restoreReviewSession,
    createReviewSessionStore,
  });
}));
