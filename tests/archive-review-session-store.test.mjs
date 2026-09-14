import assert from 'node:assert/strict';
import test from 'node:test';
import sessionStore from '../archive/review-session-store.js';

const { buildReviewSessionSnapshot, restoreReviewSession } = sessionStore;

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
  const snapshot = buildReviewSessionSnapshot({
    sourceFingerprint: 'sha-a', sourceIdentity: 'foo.js',
    draftState: { currentBank: [{ id: 1 }] }
  });
  const restored = restoreReviewSession(snapshot, {
    sourceFingerprint: 'sha-b', bank: [{ id: 2 }]
  }, 'foo.js');

  assert.equal(restored.status, 'CONFLICT');
  assert.deepEqual(restored.currentBank, [{ id: 2 }]);
  assert.equal(restored.draftApplied, false);
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
