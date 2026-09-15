import assert from 'node:assert/strict';
import test from 'node:test';
import writer from '../archive/review-source-writer.js';
import transactionApi from '../archive/review-save-transaction.js';

const { saveReviewSource } = transactionApi;

function createFileHandle(initialSource, { corruptAfterWrite = false } = {}) {
  let source = initialSource;
  let writes = 0;
  return {
    get writes() { return writes; },
    get source() { return source; },
    setExternalSource(next) { source = next; },
    async getFile() { return { name: 'fixture.js', text: async () => source }; },
    async createWritable() {
      let pending = '';
      return {
        async write(next) { writes += 1; pending = next; },
        async close() { source = corruptAfterWrite ? pending.replace('수정', '손상') : pending; },
      };
    },
  };
}

const source = `// keep\nwindow.examTitle = "시험";\nwindow.extra = { keep: true };\nwindow.questionBank = [{ id: 1, content: "원본" }];\n`;

test('waits for the visible revision and verifies the preserved source after writing', async () => {
  const handle = createFileHandle(source);
  const loadedFingerprint = await writer.fingerprintText(source);
  const waited = [];
  const result = await saveReviewSource({
    fileHandle: handle,
    loadedFingerprint,
    bank: [{ id: 1, content: '수정' }],
    fileName: 'fixture.js',
    revision: 7,
    waitForPreview: async revision => waited.push(revision),
    writer,
  });

  assert.deepEqual(waited, [7]);
  assert.equal(handle.writes, 1);
  assert.match(result.source, /window\.extra = \{ keep: true \}/);
  assert.deepEqual(writer.parseArchiveSource(result.source, 'fixture.js').bank, [{ id: 1, content: '수정' }]);
  assert.equal(result.postWriteVerified, true);
});

test('rejects an external source change before opening a writable handle', async () => {
  const handle = createFileHandle(source);
  const loadedFingerprint = await writer.fingerprintText(source);
  handle.setExternalSource(source.replace('원본', '외부 수정'));

  await assert.rejects(
    () => saveReviewSource({ fileHandle: handle, loadedFingerprint, bank: [{ id: 1, content: '수정' }], fileName: 'fixture.js', writer }),
    error => error.code === 'EXTERNAL_SOURCE_MODIFIED'
  );
  assert.equal(handle.writes, 0);
});

test('rejects a post-write semantic mismatch instead of reporting save success', async () => {
  const handle = createFileHandle(source, { corruptAfterWrite: true });
  const loadedFingerprint = await writer.fingerprintText(source);
  let failure;

  await assert.rejects(
    () => saveReviewSource({ fileHandle: handle, loadedFingerprint, bank: [{ id: 1, content: '수정' }], fileName: 'fixture.js', writer }),
    error => {
      failure = error;
      return error.code === 'POST_WRITE_VERIFICATION_FAILED';
    }
  );

  assert.equal(failure.beforeSource, source);
  assert.equal(failure.recoverySource, source);
  assert.match(failure.recoveryFileName, /fixture\.before-review-recovery\.js$/);
  assert.equal(failure.writeCompleted, true);
  assert.equal(failure.rollbackAttempted, false);
  assert.equal(handle.writes, 1);
  assert.notEqual(handle.source, source, 'the test confirms that verification failed after disk mutation');
});
