import assert from 'node:assert/strict';
import test from 'node:test';
import sessionStore from '../archive/review-session-store.js';
import writer from '../archive/review-source-writer.js';

const { buildReviewSessionSnapshot, restoreReviewSession, createReviewSessionStore } = sessionStore;

test('builds one versioned logical snapshot without duplicated independent records', () => {
  const snapshot = buildReviewSessionSnapshot({
    sourceFingerprint: 'sha-a', sourceIdentity: 'foo.js', sessionRevision: 4,
    archiveDirHandle: { kind: 'directory' }, currentFileHandle: { kind: 'file' },
    editorState: { selectedSourceRef: 'foo.js#q1' }, uiState: { mode: 'exam' },
    draftState: { currentBank: [{ id: 1 }], originalBank: [{ id: 1 }] }, savedAt: 10
  });

  assert.equal(snapshot.schemaVersion, 2);
  assert.equal(snapshot.sourceFingerprint, 'sha-a');
  assert.deepEqual(Object.keys(snapshot).sort(), [
    'archiveDirHandle', 'currentFileHandle', 'draftState', 'editorState', 'savedAt',
    'schemaVersion', 'sessionRevision', 'sourceFingerprint', 'sourceIdentity', 'uiState'
  ].sort());
});

test('does not apply an old draft when the current disk fingerprint differs', () => {
  const beforeSource = 'window.examTitle = "시험";\nwindow.questionBank = [{ id: 1, content: "원본" }];\n';
  const editedBank = [{ id: 1, content: 'edited draft' }];
  const snapshot = buildReviewSessionSnapshot({
    sourceFingerprint: 'sha-a', sourceIdentity: 'foo.js',
    draftState: {
      currentBank: editedBank,
      emergencyRecovery: { source: beforeSource, fileName: 'foo.before-review-recovery.js' },
    }
  });
  const diskBank = [{ id: 1, content: 'current disk' }];
  const restored = restoreReviewSession(snapshot, {
    sourceFingerprint: 'sha-b', bank: diskBank
  }, 'foo.js');

  assert.equal(restored.status, 'CONFLICT');
  assert.deepEqual(restored.currentBank, diskBank);
  assert.equal(restored.draftApplied, false);
  assert.deepEqual(restored.emergencyRecovery, { source: beforeSource, fileName: 'foo.before-review-recovery.js' });
  assert.deepEqual(restored.conflictDraftRecovery.bank, editedBank);
  assert.equal(restored.conflictDraftRecovery.fileName, 'foo.review-draft-recovery.js');
  assert.deepEqual(diskBank, [{ id: 1, content: 'current disk' }], 'conflict restore must not mutate the disk bank');

  const draftRecoverySource = writer.replaceQuestionBankPreservingSource(
    restored.emergencyRecovery.source,
    restored.conflictDraftRecovery.bank
  );
  writer.validateRoundTrip(draftRecoverySource, editedBank, 'foo.review-draft-recovery.js');
});

test('restores the stored draft only when the disk fingerprint matches', () => {
  const snapshot = buildReviewSessionSnapshot({
    sourceFingerprint: 'sha-a', sourceIdentity: 'foo.js',
    draftState: { currentBank: [{ id: 1, content: 'draft' }] },
    editorState: { selectedSourceRef: 'foo.js#q1' }
  });
  const restored = restoreReviewSession(snapshot, {
    sourceFingerprint: 'sha-a', bank: [{ id: 1, content: 'disk' }]
  }, 'foo.js');

  assert.equal(restored.status, 'RESTORED');
  assert.equal(restored.draftApplied, true);
  assert.deepEqual(restored.currentBank, [{ id: 1, content: 'draft' }]);
  assert.equal(restored.selectedSourceRef, 'foo.js#q1');
});

test('serializes clear behind queued writes so a cleared session cannot reappear', async () => {
  let stored = null;
  let transactionCount = 0;
  const indexedDB = {
    open() {
      const request = { result: null };
      const database = {
        objectStoreNames: { contains: () => true },
        transaction() {
          const id = ++transactionCount;
          const tx = {};
          const store = {
            put(value, key) {
              setTimeout(() => {
                stored = key === 'current' ? value : stored;
                tx.oncomplete?.();
              }, id === 1 ? 20 : 0);
            },
            delete(key) {
              setTimeout(() => {
                if (key === 'current') stored = null;
                tx.oncomplete?.();
              }, 0);
            },
            get(key) {
              const read = {};
              setTimeout(() => {
                read.onsuccess?.({ target: { result: key === 'current' ? stored : null } });
                tx.oncomplete?.();
              }, 0);
              return read;
            },
          };
          tx.objectStore = () => store;
          return tx;
        },
      };
      queueMicrotask(() => {
        request.result = database;
        request.onsuccess?.();
      });
      return request;
    },
  };

  const store = createReviewSessionStore({ indexedDB });
  const putPromise = store.put({ sourceFingerprint: 'sha-a', draftState: { currentBank: [{ id: 1 }] } });
  const clearPromise = store.clear();
  await Promise.all([putPromise, clearPromise]);
  assert.equal(await store.get(), null);
});
