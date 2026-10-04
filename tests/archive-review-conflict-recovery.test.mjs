import assert from 'node:assert/strict';
import test from 'node:test';
import writer from '../archive/review-source-writer.js';
import saveTransaction from '../archive/review-save-transaction.js';
import sessionStore from '../archive/review-session-store.js';

const { saveReviewSource } = saveTransaction;
const { buildReviewSessionSnapshot, createReviewSessionStore, restoreReviewSession } = sessionStore;

function memoryIndexedDB() {
  let current = null;
  const database = {
    objectStoreNames: { contains: () => true },
    transaction() {
      const tx = {};
      const store = {
        put(value) {
          current = value;
          queueMicrotask(() => tx.oncomplete?.());
        },
        get() {
          const request = {};
          queueMicrotask(() => {
            request.result = current;
            request.onsuccess?.({ target: request });
            tx.oncomplete?.();
          });
          return request;
        },
      };
      tx.objectStore = () => store;
      return tx;
    },
  };
  return {
    open() {
      const request = { result: database };
      queueMicrotask(() => request.onsuccess?.());
      return request;
    },
  };
}

function createPostWriteCorruptingHandle(initialSource) {
  let source = initialSource;
  let writes = 0;
  return {
    get source() { return source; },
    get writes() { return writes; },
    async getFile() { return { name: 'fixture.js', text: async () => source }; },
    async createWritable() {
      let pending = '';
      return {
        async write(next) { writes += 1; pending = next; },
        async close() { source = pending.replace('수정본', '손상본'); },
      };
    },
  };
}

const beforeSource = `// keep metadata\nwindow.examTitle = "충돌 시험";\nwindow.extra = { keep: true };\nwindow.questionBank = [{ id: 1, content: "원본" }];\n`;

test('preserves both original and edited-draft recovery through persisted conflict restore', async () => {
  const editedBank = [{ id: 1, content: '수정본' }];
  const handle = createPostWriteCorruptingHandle(beforeSource);
  const loadedFingerprint = await writer.fingerprintText(beforeSource);
  let failure;

  await assert.rejects(
    () => saveReviewSource({
      fileHandle: handle,
      loadedFingerprint,
      bank: editedBank,
      fileName: 'fixture.js',
      writer,
    }),
    error => {
      failure = error;
      return error.code === 'POST_WRITE_VERIFICATION_FAILED';
    }
  );
  assert.equal(failure.beforeSource, beforeSource);
  assert.equal(failure.recoverySource, beforeSource);
  assert.equal(failure.rollbackAttempted, false);
  assert.equal(handle.writes, 1);

  const persistedSession = createReviewSessionStore({ indexedDB: memoryIndexedDB() });
  const snapshot = buildReviewSessionSnapshot({
    sourceFingerprint: loadedFingerprint,
    sourceIdentity: 'fixture.js',
    draftState: {
      currentBank: editedBank,
      originalBank: [{ id: 1, content: '원본' }],
      emergencyRecovery: {
        source: failure.recoverySource,
        fileName: failure.recoveryFileName,
      },
    },
  });
  await persistedSession.put(snapshot);
  const persisted = await persistedSession.get();
  assert.deepEqual(persisted.draftState.currentBank, editedBank);
  assert.deepEqual(persisted.draftState.emergencyRecovery, snapshot.draftState.emergencyRecovery);

  const diskSource = await (await handle.getFile()).text();
  const diskParsed = writer.parseArchiveSource(diskSource, 'fixture.js');
  const diskFingerprint = await writer.fingerprintText(diskSource);
  const diskBank = structuredClone(diskParsed.bank);
  const restored = restoreReviewSession(persisted, {
    sourceFingerprint: diskFingerprint,
    bank: diskBank,
  }, 'fixture.js');

  assert.equal(restored.status, 'CONFLICT');
  assert.equal(restored.draftApplied, false);
  assert.deepEqual(restored.currentBank, diskBank);
  assert.deepEqual(diskBank, [{ id: 1, content: '손상본' }]);
  assert.deepEqual(restored.emergencyRecovery, snapshot.draftState.emergencyRecovery);
  assert.deepEqual(restored.conflictDraftRecovery.bank, editedBank);
  assert.match(restored.conflictDraftRecovery.fileName, /fixture\.review-draft-recovery\.js$/);

  const draftRecoverySource = writer.replaceQuestionBankPreservingSource(
    restored.emergencyRecovery.source,
    restored.conflictDraftRecovery.bank
  );
  writer.validateRoundTrip(draftRecoverySource, editedBank, restored.conflictDraftRecovery.fileName);
  assert.match(draftRecoverySource, /window\.extra = \{ keep: true \}/);
});
